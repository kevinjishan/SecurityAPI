import assert from "node:assert/strict";
import test from "node:test";

import { BrokerError, KisClient, MemoryTokenStore, parseKisExpiresAt } from "../../src/index.mjs";
import { KisClient as KisClientFromPackage } from "security-api-reference/adapters";

test("exports KisClient through package adapter entry", () => {
  assert.equal(KisClientFromPackage, KisClient);
});

test("requests a token before the first authenticated KIS GET call", async () => {
  const calls = [];
  const client = new KisClient({
    appKey: "app-key",
    appSecret: "secret-key",
    fetch: async (url, init) => {
      calls.push(readCall(url, init));

      if (url.endsWith("/oauth2/tokenP")) {
        return jsonResponse({
          access_token: "token-1",
          token_type: "Bearer",
          expires_in: 86400,
        });
      }

      return jsonResponse(
        {
          rt_cd: "0",
          msg_cd: "0",
          msg1: "ok",
          output: { stck_shrn_iscd: "005930", stck_prpr: "70000" },
        },
        {
          headers: {
            tr_cont: "",
          },
        },
      );
    },
  });

  const result = await client.request("/uapi/domestic-stock/v1/quotations/inquire-price", {
    FID_COND_MRKT_DIV_CODE: "J",
    FID_INPUT_ISCD: "005930",
  });

  assert.equal(result.ok, true);
  assert.equal(result.broker, "kis");
  assert.equal(result.id, "/uapi/domestic-stock/v1/quotations/inquire-price");
  assert.equal(result.data.output.stck_prpr, "70000");
  assert.deepEqual(result.continuation, {
    hasNext: false,
    key: undefined,
    raw: {
      tr_cont: "",
    },
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://openapi.koreainvestment.com:9443/oauth2/tokenP");
  assert.equal(calls[0].headers["Content-Type"], "application/json; charset=UTF-8");
  assert.deepEqual(JSON.parse(calls[0].body), {
    grant_type: "client_credentials",
    appkey: "app-key",
    appsecret: "secret-key",
  });

  const requestUrl = new URL(calls[1].url);
  assert.equal(requestUrl.origin + requestUrl.pathname, "https://openapi.koreainvestment.com:9443/uapi/domestic-stock/v1/quotations/inquire-price");
  assert.equal(requestUrl.searchParams.get("FID_COND_MRKT_DIV_CODE"), "J");
  assert.equal(requestUrl.searchParams.get("FID_INPUT_ISCD"), "005930");
  assert.equal(calls[1].method, "GET");
  assert.equal(calls[1].body, undefined);
  assert.equal(calls[1].headers.authorization, "Bearer token-1");
  assert.equal(calls[1].headers.appkey, "app-key");
  assert.equal(calls[1].headers.appsecret, "secret-key");
  assert.equal(calls[1].headers.tr_id, "FHKST01010100");
  assert.equal(calls[1].headers.custtype, "P");
  assert.equal(calls[1].headers.tr_cont, "");
});

test("uses KIS mock domains, hashkey, and side-specific mock order TR IDs", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore();
  const client = new KisClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    env: "mock",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      if (url.endsWith("/oauth2/tokenP")) {
        return jsonResponse({
          access_token: "token-1",
          token_type: "Bearer",
          expires_in: 86400,
        });
      }
      if (url.endsWith("/uapi/hashkey")) {
        return jsonResponse({ HASH: "hash-1" });
      }
      return jsonResponse({
        rt_cd: "0",
        msg_cd: "0",
        msg1: "order accepted",
        output: { ODNO: "12345" },
      });
    },
  });
  const body = {
    CANO: "12345678",
    ACNT_PRDT_CD: "01",
    PDNO: "005930",
    ORD_DVSN: "00",
    ORD_QTY: "1",
    ORD_UNPR: "70000",
  };

  const result = await client.request("/uapi/domestic-stock/v1/trading/order-cash", body, {
    hashKey: true,
    side: "sell",
  });

  assert.equal(result.ok, true);
  assert.equal(calls.length, 3);
  assert.equal(calls[0].url, "https://openapivts.koreainvestment.com:29443/oauth2/tokenP");
  assert.equal(calls[1].url, "https://openapivts.koreainvestment.com:29443/uapi/hashkey");
  assert.equal(calls[1].headers.appkey, "app-key");
  assert.equal(calls[1].headers.appsecret, "secret-key");
  assert.deepEqual(JSON.parse(calls[1].body), body);
  assert.equal(calls[2].url, "https://openapivts.koreainvestment.com:29443/uapi/domestic-stock/v1/trading/order-cash");
  assert.equal(calls[2].headers.tr_id, "VTTC0012U");
  assert.equal(calls[2].headers.hashkey, "hash-1");
  assert.deepEqual(JSON.parse(calls[2].body), body);
});

test("caches KIS WebSocket approval keys separately from access tokens", async () => {
  const calls = [];
  const client = new KisClient({
    appKey: "app-key",
    appSecret: "secret-key",
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ approval_key: "approval-1" });
    },
  });

  const first = await client.getApprovalKey();
  const second = await client.getApprovalKey();

  assert.equal(first, "approval-1");
  assert.equal(second, "approval-1");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, "https://openapi.koreainvestment.com:9443/oauth2/Approval");
  assert.deepEqual(JSON.parse(calls[0].body), {
    grant_type: "client_credentials",
    appkey: "app-key",
    secretkey: "secret-key",
  });
});

test("normalizes KIS business API errors", async () => {
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("kis:prod:access", {
    accessToken: "cached-token",
    tokenType: "Bearer",
    expiresAt: Date.now() + 60_000,
  });
  const client = new KisClient({
    appKey: "app-key",
    appSecret: "secret-key",
    tokenStore,
    fetch: async () =>
      jsonResponse({
        rt_cd: "1",
        msg_cd: "EGW00123",
        msg1: "business error",
      }),
  });

  const result = await client.request("/uapi/domestic-stock/v1/quotations/inquire-price", {
    FID_COND_MRKT_DIV_CODE: "J",
    FID_INPUT_ISCD: "005930",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error instanceof BrokerError, true);
  assert.equal(result.error.code, "API_ERROR");
  assert.deepEqual(result.error.details, {
    rt_cd: "1",
    msg_cd: "EGW00123",
    msg1: "business error",
  });
});

test("parses KIS expiration seconds, absolute timestamps, and fallback", () => {
  assert.equal(parseKisExpiresAt(60, () => 1_000), 61_000);
  assert.equal(parseKisExpiresAt("bad", () => 1_000), 1_000 + 23 * 60 * 60 * 1000);
  assert.equal(Number.isFinite(parseKisExpiresAt("2099-12-31 23:59:59", () => 1_000)), true);
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
