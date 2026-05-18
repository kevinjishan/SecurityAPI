import assert from "node:assert/strict";
import test from "node:test";

import {
  MetadataLookupError,
  createMetadataRegistry,
} from "../../src/metadata/index.mjs";
import { createMetadataRegistry as createMetadataRegistryFromPackage } from "security-api-reference/metadata";

const registry = await createMetadataRegistry();

test("loads generated broker manifests", () => {
  assert.equal(createMetadataRegistryFromPackage, createMetadataRegistry);
  assert.deepEqual(registry.listBrokers(), ["kiwoom", "ls"]);
  assert.equal(registry.listApiIds("kiwoom").length, 207);
  assert.equal(registry.listApiIds("ls").length, 365);
});

test("looks up Kiwoom endpoint metadata", () => {
  const endpoint = registry.getEndpoint("kiwoom", "ka10001", { env: "mock" });

  assert.deepEqual(endpoint, {
    broker: "kiwoom",
    id: "ka10001",
    env: "mock",
    method: "POST",
    domain: "https://mockapi.kiwoom.com",
    path: "/api/dostk/stkinfo",
    url: "https://mockapi.kiwoom.com/api/dostk/stkinfo",
    contentType: "application/json;charset=UTF-8",
    requestFormat: "json",
    authRequired: true,
    rateLimit: { perSecond: null, raw: null },
  });

  assert.equal(registry.isAuthRequired("kiwoom", "ka10001"), true);
});

test("looks up LS endpoint metadata", () => {
  const endpoint = registry.getEndpoint("ls", "t1101");

  assert.equal(endpoint.broker, "ls");
  assert.equal(endpoint.id, "t1101");
  assert.equal(endpoint.method, "POST");
  assert.equal(endpoint.domain, "https://openapi.ls-sec.co.kr:8080");
  assert.equal(endpoint.path, "/stock/market-data");
  assert.equal(endpoint.url, "https://openapi.ls-sec.co.kr:8080/stock/market-data");
  assert.equal(endpoint.authRequired, true);
});

test("returns request and response fields by location", () => {
  const kiwoomRequest = registry.getRequestFields("kiwoom", "ka10001");
  const lsResponse = registry.getResponseFields("ls", "t1101");
  const lsRequestHeaders = registry.getRequestFields("ls", "t1101", { location: "header" });

  assert.deepEqual(kiwoomRequest.map((field) => field.id), ["stk_cd"]);
  assert.equal(lsResponse.length, 92);
  assert.ok(lsRequestHeaders.some((field) => field.id === "authorization"));
});

test("filters required fields", () => {
  const requiredFields = registry.getRequiredFields("ls", "token");

  assert.deepEqual(
    requiredFields.map((field) => field.id),
    ["grant_type", "appkey", "appsecretkey", "scope"],
  );
});

test("finds an entry without specifying broker", () => {
  const matches = registry.findById("ka10001");

  assert.equal(matches.length, 1);
  assert.equal(matches[0].broker, "kiwoom");
});

test("throws a metadata error for unknown ids", () => {
  assert.throws(
    () => registry.requireEntry("kiwoom", "missing-id"),
    (error) => error instanceof MetadataLookupError && error.code === "NOT_FOUND",
  );
});

test("throws a metadata error when an environment domain is not configured", () => {
  assert.throws(
    () => registry.getEndpoint("ls", "t1101", { env: "mock" }),
    (error) => error instanceof MetadataLookupError && error.code === "DOMAIN_NOT_CONFIGURED",
  );
});
