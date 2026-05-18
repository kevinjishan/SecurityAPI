import assert from "node:assert/strict";
import test from "node:test";

import { BrokerError, KiwoomClient, MemoryTokenStore, parseKiwoomExpiresAt } from "../../src/index.mjs";
import { KiwoomClient as KiwoomClientFromPackage } from "security-api-reference/adapters";

test("exports KiwoomClient through package adapter entry", () => {
  assert.equal(KiwoomClientFromPackage, KiwoomClient);
});

test("requests a token before the first authenticated Kiwoom API call", async () => {
  const calls = [];
  const client = new KiwoomClient({
    appKey: "app-key",
    secretKey: "secret-key",
    env: "mock",
    fetch: async (url, init) => {
      calls.push(readCall(url, init));

      if (url.endsWith("/oauth2/token")) {
        return jsonResponse({
          token: "token-1",
          token_type: "Bearer",
          expires_dt: "20991231235959",
        });
      }

      return jsonResponse(
        {
          stk_cd: "005930",
          return_code: 0,
          return_msg: "정상적으로 처리되었습니다",
        },
        {
          headers: {
            "cont-yn": "N",
          },
        },
      );
    },
  });

  const result = await client.request("ka10001", { stk_cd: "005930" });

  assert.equal(result.ok, true);
  assert.equal(result.broker, "kiwoom");
  assert.equal(result.id, "ka10001");
  assert.equal(result.data.stk_cd, "005930");
  assert.deepEqual(result.continuation, {
    hasNext: false,
    key: undefined,
    raw: {
      "cont-yn": "N",
      "next-key": undefined,
    },
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://mockapi.kiwoom.com/oauth2/token");
  assert.equal(calls[0].headers["api-id"], "au10001");
  assert.equal(calls[0].headers["Content-Type"], "application/json;charset=UTF-8");
  assert.deepEqual(JSON.parse(calls[0].body), {
    grant_type: "client_credentials",
    appkey: "app-key",
    secretkey: "secret-key",
  });

  assert.equal(calls[1].url, "https://mockapi.kiwoom.com/api/dostk/stkinfo");
  assert.equal(calls[1].headers.authorization, "Bearer token-1");
  assert.equal(calls[1].headers["api-id"], "ka10001");
  assert.equal(calls[1].headers["Content-Type"], "application/json;charset=UTF-8");
  assert.deepEqual(JSON.parse(calls[1].body), { stk_cd: "005930" });
});

test("reuses a valid cached Kiwoom token", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore({ now: () => 1_000, expirationSkewMs: 0 });
  tokenStore.set("kiwoom:mock", {
    accessToken: "cached-token",
    tokenType: "Bearer",
    expiresAt: 10_000,
  });

  const client = new KiwoomClient({
    appKey: "app-key",
    secretKey: "secret-key",
    env: "mock",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ return_code: 0, return_msg: "ok" });
    },
  });

  const result = await client.request("ka10001", { stk_cd: "005930" });

  assert.equal(result.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://mockapi.kiwoom.com/api/dostk/stkinfo");
  assert.equal(calls[0].headers.authorization, "Bearer cached-token");
});

test("refreshes an expired Kiwoom token", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore({ now: () => 10_000, expirationSkewMs: 0 });
  tokenStore.set("kiwoom:mock", {
    accessToken: "expired-token",
    expiresAt: 9_999,
  });

  const client = new KiwoomClient({
    appKey: "app-key",
    secretKey: "secret-key",
    env: "mock",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      if (url.endsWith("/oauth2/token")) {
        return jsonResponse({
          token: "fresh-token",
          token_type: "Bearer",
          expires_dt: "20991231235959",
        });
      }
      return jsonResponse({ return_code: 0, return_msg: "ok" });
    },
  });

  const result = await client.request("ka10001", { stk_cd: "005930" });

  assert.equal(result.ok, true);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].headers.authorization, "Bearer fresh-token");
});

test("sends Kiwoom continuation headers and extracts next key", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("kiwoom:mock", {
    accessToken: "cached-token",
    expiresAt: Date.now() + 60_000,
  });

  const client = new KiwoomClient({
    appKey: "app-key",
    secretKey: "secret-key",
    env: "mock",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse(
        { return_code: 0, return_msg: "ok" },
        {
          headers: {
            "cont-yn": "Y",
            "next-key": "next-response-key",
          },
        },
      );
    },
  });

  const result = await client.request(
    "ka10001",
    { stk_cd: "005930" },
    { continuation: { nextKey: "next-request-key" } },
  );

  assert.equal(result.ok, true);
  assert.equal(calls[0].headers["cont-yn"], "Y");
  assert.equal(calls[0].headers["next-key"], "next-request-key");
  assert.deepEqual(result.continuation, {
    hasNext: true,
    key: "next-response-key",
    raw: {
      "cont-yn": "Y",
      "next-key": "next-response-key",
    },
  });
});

test("normalizes Kiwoom business API errors", async () => {
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("kiwoom:mock", {
    accessToken: "cached-token",
    expiresAt: Date.now() + 60_000,
  });

  const client = new KiwoomClient({
    appKey: "app-key",
    secretKey: "secret-key",
    env: "mock",
    tokenStore,
    fetch: async () =>
      jsonResponse({
        return_code: -100,
        return_msg: "업무 오류",
      }),
  });

  const result = await client.request("ka10001", { stk_cd: "005930" });

  assert.equal(result.ok, false);
  assert.equal(result.error instanceof BrokerError, true);
  assert.equal(result.error.code, "API_ERROR");
  assert.deepEqual(result.error.details, {
    return_code: -100,
    return_msg: "업무 오류",
  });
});

test("returns validation errors for unknown Kiwoom API ids", async () => {
  let fetchCalled = false;
  const client = new KiwoomClient({
    appKey: "app-key",
    secretKey: "secret-key",
    env: "mock",
    fetch: async () => {
      fetchCalled = true;
      return jsonResponse({});
    },
  });

  const result = await client.request("missing-id", {});

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.equal(fetchCalled, false);
});

test("returns validation errors for blank Kiwoom API ids", async () => {
  const client = new KiwoomClient({
    appKey: "app-key",
    secretKey: "secret-key",
    env: "mock",
    fetch: async () => jsonResponse({}),
  });

  const result = await client.request("", {});

  assert.equal(result.ok, false);
  assert.equal(result.id, "unknown");
  assert.equal(result.error.code, "VALIDATION_ERROR");
});

test("revokes a Kiwoom token", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("kiwoom:mock", {
    accessToken: "cached-token",
    tokenType: "Bearer",
    expiresAt: Date.now() + 60_000,
  });

  const client = new KiwoomClient({
    appKey: "app-key",
    secretKey: "secret-key",
    env: "mock",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ return_code: 0, return_msg: "ok" });
    },
  });

  const result = await client.revokeToken();

  assert.equal(result.ok, true);
  assert.equal(calls[0].url, "https://mockapi.kiwoom.com/oauth2/revoke");
  assert.equal(calls[0].headers.authorization, "Bearer cached-token");
  assert.equal(calls[0].headers["api-id"], "au10002");
  assert.deepEqual(JSON.parse(calls[0].body), {
    appkey: "app-key",
    secretkey: "secret-key",
    token: "cached-token",
  });
  assert.equal(tokenStore.get("kiwoom:mock"), null);
});

test("parses Kiwoom expiration dates and falls back to 23 hours", () => {
  assert.equal(
    parseKiwoomExpiresAt("20991231235959"),
    new Date(2099, 11, 31, 23, 59, 59).getTime(),
  );
  assert.equal(parseKiwoomExpiresAt("bad", () => 1_000), 1_000 + 23 * 60 * 60 * 1000);
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
