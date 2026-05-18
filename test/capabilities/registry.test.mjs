import assert from "node:assert/strict";
import test from "node:test";

import {
  BrokerCapabilities,
  assertCapabilityReferences,
  getCapabilities,
  getCapabilityDefinition,
  listCapabilityDefinitions,
  listCapabilityIds,
} from "../../src/index.mjs";
import { getCapabilities as getCapabilitiesFromPackage } from "security-api-reference/capabilities";

test("exports capability registry through package entry", () => {
  assert.equal(getCapabilitiesFromPackage, getCapabilities);
});

test("lists Kiwoom capabilities and supports prefixes", () => {
  const caps = getCapabilities("kiwoom");

  assert.equal(caps instanceof BrokerCapabilities, true);
  assert.equal(caps.supports("quote.domesticStock.currentPrice"), true);
  assert.equal(caps.supports("quote.domesticStock"), true);
  assert.equal(caps.supports("overseasStock.quote.currentPrice"), false);
  assert.ok(caps.listIds().includes("order.domesticStock.buy"));
});

test("finds Kiwoom API references for capabilities", () => {
  const caps = getCapabilities("kiwoom");

  assert.deepEqual(caps.findApis("auth.oauth.issueToken").map((api) => api.id), ["au10001"]);
  assert.deepEqual(caps.findApis("quote.domesticStock.currentPrice").map((api) => api.id), ["ka10001"]);
  assert.deepEqual(caps.findApis("order.domesticStock").map((api) => api.id), [
    "kt10000",
    "kt10001",
    "kt10002",
    "kt10003",
  ]);
});

test("lists LS capabilities across domestic, overseas, and derivatives", () => {
  const caps = getCapabilities("ls");

  assert.equal(caps.supports("quote.domesticStock.orderBook"), true);
  assert.equal(caps.supports("overseasStock.quote"), true);
  assert.equal(caps.supports("futureOption.order"), true);
  assert.equal(caps.supports("realtime.domesticStock.balance"), false);
});

test("finds LS API references for capabilities", () => {
  const caps = getCapabilities("ls");

  assert.deepEqual(caps.findApis("auth.oauth.issueToken").map((api) => api.id), ["token"]);
  assert.ok(caps.findApis("quote.domesticStock.currentPrice").some((api) => api.id === "t1101"));
  assert.deepEqual(caps.findApis("order.domesticStock").map((api) => api.id), [
    "CSPAT00601",
    "CSPAT00601",
    "CSPAT00701",
    "CSPAT00801",
  ]);
  assert.deepEqual(caps.findApis("overseasStock.order").map((api) => api.id), [
    "COSAT00301",
    "COSAT00311",
    "COSAT00400",
  ]);
});

test("throws unsupported errors when requiring unknown capabilities", () => {
  const caps = getCapabilities("kiwoom");

  assert.throws(() => caps.require("overseasStock.quote.currentPrice"), {
    code: "UNSUPPORTED_CAPABILITY",
  });
});

test("returns capability definitions", () => {
  const definitions = listCapabilityDefinitions();

  assert.equal(getCapabilityDefinition("quote.domesticStock.currentPrice").area, "quote");
  assert.equal(definitions["order.domesticStock.buy"].label, "국내주식 매수");
});

test("lists capability ids by broker", () => {
  assert.ok(listCapabilityIds("kiwoom").includes("realtime.domesticStock.trade"));
  assert.ok(listCapabilityIds("ls").includes("futureOption.quote.currentPrice"));
});

test("validates all capability API references against generated manifests", async () => {
  const result = await assertCapabilityReferences();

  assert.equal(result.ok, true);
  assert.equal(result.missing.length, 0);
  assert.ok(result.checked > 40);
});
