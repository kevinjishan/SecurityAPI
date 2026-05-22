import assert from "node:assert/strict";
import test from "node:test";

import { BrokerError, DbClient, MemoryTokenStore, parseDbExpiresAt } from "../../src/index.mjs";
import { DbClient as DbClientFromPackage } from "security-api-reference/adapters";

test("exports DbClient through package adapter entry", () => {
  assert.equal(DbClientFromPackage, DbClient);
});

test("requests a token before the first authenticated DB TR call", async () => {
  const calls = [];
  const client = new DbClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    macAddress: "AABBCCDDEEFF",
    fetch: async (url, init) => {
      calls.push(readCall(url, init));

      if (url.endsWith("/oauth2/token")) {
        return jsonResponse({
          access_token: "token-1",
          token_type: "Bearer",
          expires_in: 86400,
        });
      }

      return jsonResponse(
        {
          rsp_cd: "00000",
          rsp_msg: "ok",
          Out: { Iscd: "005930", Prpr: "70000" },
        },
        {
          headers: {
            cont_yn: "N",
          },
        },
      );
    },
  });

  const result = await client.request("PRICE", {
    In: {
      InputCondMrktDivCode: "J",
      InputIscd1: "005930",
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.broker, "db");
  assert.equal(result.id, "PRICE");
  assert.equal(result.data.Out.Prpr, "70000");
  assert.deepEqual(result.continuation, {
    hasNext: false,
    key: undefined,
    raw: {
      cont_yn: "N",
      cont_key: undefined,
    },
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://openapi.dbsec.co.kr:8443/oauth2/token");
  assert.equal(calls[0].headers["Content-Type"], "application/x-www-form-urlencoded");
  assert.equal(calls[0].body, "grant_type=client_credentials&appkey=app-key&appsecretkey=secret-key&scope=oob");

  assert.equal(calls[1].url, "https://openapi.dbsec.co.kr:8443/api/v1/quote/kr-stock/inquiry/price");
  assert.equal(calls[1].headers.authorization, "Bearer token-1");
  assert.equal(calls[1].headers.cont_yn, "N");
  assert.equal(calls[1].headers.mac_address, "AABBCCDDEEFF");
  assert.equal(calls[1].headers["Content-Type"], "application/json;charset=utf-8");
  assert.deepEqual(JSON.parse(calls[1].body), {
    In: {
      InputCondMrktDivCode: "J",
      InputIscd1: "005930",
    },
  });
});

test("sends DB continuation headers and extracts next key", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("db:prod", {
    accessToken: "cached-token",
    tokenType: "Bearer",
    expiresAt: Date.now() + 60_000,
  });
  const client = new DbClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse(
        { rsp_cd: "00000", rsp_msg: "ok" },
        {
          headers: {
            cont_yn: "Y",
            cont_key: "next-response-key",
          },
        },
      );
    },
  });

  const result = await client.request(
    "HOGA",
    { In: { InputCondMrktDivCode: "J", InputIscd1: "005930" } },
    { continuation: { nextKey: "next-request-key" } },
  );

  assert.equal(result.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers.cont_yn, "Y");
  assert.equal(calls[0].headers.cont_key, "next-request-key");
  assert.deepEqual(result.continuation, {
    hasNext: true,
    key: "next-response-key",
    raw: {
      cont_yn: "Y",
      cont_key: "next-response-key",
    },
  });
});

test("normalizes DB business API errors", async () => {
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("db:prod", {
    accessToken: "cached-token",
    tokenType: "Bearer",
    expiresAt: Date.now() + 60_000,
  });
  const client = new DbClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    tokenStore,
    fetch: async () =>
      jsonResponse({
        rsp_cd: "99999",
        rsp_msg: "business error",
      }),
  });

  const result = await client.request("PRICE", {
    In: {
      InputCondMrktDivCode: "J",
      InputIscd1: "005930",
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.error instanceof BrokerError, true);
  assert.equal(result.error.code, "API_ERROR");
  assert.deepEqual(result.error.details, {
    rsp_cd: "99999",
    rsp_msg: "business error",
  });
});

test("revokes a DB token", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("db:prod", {
    accessToken: "cached-token",
    tokenType: "Bearer",
    expiresAt: Date.now() + 60_000,
  });
  const client = new DbClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ code: 200, message: "revoked" });
    },
  });

  const result = await client.revokeToken();

  assert.equal(result.ok, true);
  assert.equal(calls[0].url, "https://openapi.dbsec.co.kr:8443/oauth2/revoke");
  assert.equal(calls[0].headers["Content-Type"], "application/x-www-form-urlencoded");
  assert.equal(calls[0].body, "appkey=app-key&appsecretkey=secret-key&token_type_hint=access_token&token=cached-token");
  assert.equal(tokenStore.get("db:prod"), null);
});

test("parses DB expiration seconds and falls back to 23 hours", () => {
  assert.equal(parseDbExpiresAt(60, () => 1_000), 61_000);
  assert.equal(parseDbExpiresAt("bad", () => 1_000), 1_000 + 23 * 60 * 60 * 1000);
});

function readCall(url, init) {
  return {
    url,
    method: init.method,
    headers: init.headers,
    body: init.body,
  };
}

function jsonResponse(body, options = {}) {
  return new Response(JSON.stringify(body), {
    status: options.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });
}
