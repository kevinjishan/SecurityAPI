import assert from "node:assert/strict";
import test from "node:test";

import { BrokerError, LsClient, MemoryTokenStore, parseLsExpiresAt } from "../../src/index.mjs";
import { LsClient as LsClientFromPackage } from "security-api-reference/adapters";

test("exports LsClient through package adapter entry", () => {
  assert.equal(LsClientFromPackage, LsClient);
});

test("requests a token before the first authenticated LS TR call", async () => {
  const calls = [];
  const client = new LsClient({
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
          rsp_msg: "정상적으로 조회가 완료되었습니다.",
          t1101OutBlock: { shcode: "005930", price: 70000 },
        },
        {
          headers: {
            tr_cont: "N",
          },
        },
      );
    },
  });

  const result = await client.request("t1101", {
    t1101InBlock: { shcode: "005930" },
  });

  assert.equal(result.ok, true);
  assert.equal(result.broker, "ls");
  assert.equal(result.id, "t1101");
  assert.equal(result.data.t1101OutBlock.price, 70000);
  assert.deepEqual(result.continuation, {
    hasNext: false,
    key: undefined,
    raw: {
      tr_cont: "N",
      tr_cont_key: undefined,
    },
  });

  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, "https://openapi.ls-sec.co.kr:8080/oauth2/token");
  assert.equal(calls[0].headers["Content-Type"], "application/x-www-form-urlencoded");
  assert.equal(calls[0].body, "grant_type=client_credentials&appkey=app-key&appsecretkey=secret-key&scope=oob");

  assert.equal(calls[1].url, "https://openapi.ls-sec.co.kr:8080/stock/market-data");
  assert.equal(calls[1].headers.authorization, "Bearer token-1");
  assert.equal(calls[1].headers.tr_cd, "t1101");
  assert.equal(calls[1].headers.tr_cont, "N");
  assert.equal(calls[1].headers.mac_address, "AABBCCDDEEFF");
  assert.equal(calls[1].headers["Content-Type"], "application/json; charset=UTF-8");
  assert.deepEqual(JSON.parse(calls[1].body), {
    t1101InBlock: { shcode: "005930" },
  });
});

test("reuses a valid cached LS token", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore({ now: () => 1_000, expirationSkewMs: 0 });
  tokenStore.set("ls:prod", {
    accessToken: "cached-token",
    tokenType: "Bearer",
    expiresAt: 10_000,
  });

  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    macAddress: "AABBCCDDEEFF",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ rsp_cd: "00000", rsp_msg: "ok" });
    },
  });

  const result = await client.request("t1101", {
    t1101InBlock: { shcode: "005930" },
  });

  assert.equal(result.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers.authorization, "Bearer cached-token");
});

test("refreshes an expired LS token", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore({ now: () => 10_000, expirationSkewMs: 0 });
  tokenStore.set("ls:prod", {
    accessToken: "expired-token",
    expiresAt: 9_999,
  });

  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    macAddress: "AABBCCDDEEFF",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      if (url.endsWith("/oauth2/token")) {
        return jsonResponse({
          access_token: "fresh-token",
          token_type: "Bearer",
          expire_in: 86400,
        });
      }
      return jsonResponse({ rsp_cd: "00000", rsp_msg: "ok" });
    },
  });

  const result = await client.request("t1101", {
    t1101InBlock: { shcode: "005930" },
  });

  assert.equal(result.ok, true);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].headers.authorization, "Bearer fresh-token");
});

test("auto-refreshes the LS token when broker reports IGW00121 token-invalid", async () => {
  // 시나리오: 같은 appkey 로 외부 클라이언트(legacy LSClient.py)가 새 토큰을 발급해
  // 우리 캐시된 토큰이 LS 인프라 게이트웨이에서 무효화된 상태. 첫 요청은
  // 500 + IGW00121 으로 실패해야 하지만 SDK 가 자동 클리어 + 재발급 + 1회
  // 재시도를 거쳐 두 번째 응답을 성공으로 반환해야 한다.
  const calls = [];
  const tokenStore = new MemoryTokenStore({ now: () => 1_000, expirationSkewMs: 0 });
  tokenStore.set("ls:prod", {
    accessToken: "stale-but-not-expired",
    tokenType: "Bearer",
    expiresAt: 9_999_999_999_999, // 시간상 유효, 서버 측 무효화
  });

  let businessCalls = 0;
  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    macAddress: "AABBCCDDEEFF",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      if (url.endsWith("/oauth2/token")) {
        return jsonResponse({
          access_token: "freshly-reissued",
          token_type: "Bearer",
          expires_in: 86400,
        });
      }
      businessCalls += 1;
      if (businessCalls === 1) {
        return jsonResponse(
          { rsp_cd: "IGW00121", rsp_msg: "유효하지 않은 token 입니다." },
          { status: 500 },
        );
      }
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "ok",
        t1101OutBlock: { shcode: "005930", price: 70000 },
      });
    },
  });

  const result = await client.request("t1101", { t1101InBlock: { shcode: "005930" } });

  assert.equal(result.ok, true, "auto-recovery should produce ok response");
  assert.equal(result.data.t1101OutBlock.price, 70000);
  // 호출 순서: (1) 비즈니스(실패) → (2) 토큰 재발급 → (3) 비즈니스(재시도 성공)
  assert.equal(calls.length, 3);
  assert.equal(calls[0].headers.authorization, "Bearer stale-but-not-expired");
  assert.equal(calls[1].url, "https://openapi.ls-sec.co.kr:8080/oauth2/token");
  assert.equal(calls[2].headers.authorization, "Bearer freshly-reissued");
});

test("does not auto-retry when the LS error is unrelated to token invalidation", async () => {
  // IGW00121 외의 일반 에러는 재시도 없이 한 번에 실패 응답을 그대로 반환해야 한다.
  // (인증과 무관한 비즈니스 오류로 토큰을 클리어하면 다음 호출까지 영향)
  const calls = [];
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("ls:prod", {
    accessToken: "cached-token",
    tokenType: "Bearer",
    expiresAt: Date.now() + 60_000,
  });
  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ rsp_cd: "99999", rsp_msg: "업무 오류" });
    },
  });

  const result = await client.request("t1101", { t1101InBlock: { shcode: "005930" } });
  assert.equal(result.ok, false);
  assert.equal(result.error.code, "API_ERROR");
  assert.equal(calls.length, 1, "should not retry for non-token errors");
});

test("sends LS continuation headers and extracts next key", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("ls:prod", {
    accessToken: "cached-token",
    expiresAt: Date.now() + 60_000,
  });

  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    macAddress: "AABBCCDDEEFF",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse(
        { rsp_cd: "00000", rsp_msg: "ok" },
        {
          headers: {
            tr_cont: "Y",
            tr_cont_key: "next-response-key",
          },
        },
      );
    },
  });

  const result = await client.request(
    "t1101",
    { t1101InBlock: { shcode: "005930" } },
    { continuation: { nextKey: "next-request-key" } },
  );

  assert.equal(result.ok, true);
  assert.equal(calls[0].headers.tr_cont, "Y");
  assert.equal(calls[0].headers.tr_cont_key, "next-request-key");
  assert.deepEqual(result.continuation, {
    hasNext: true,
    key: "next-response-key",
    raw: {
      tr_cont: "Y",
      tr_cont_key: "next-response-key",
    },
  });
});

test("omits optional mac_address when macAddress is not configured", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("ls:prod", {
    accessToken: "cached-token",
    expiresAt: Date.now() + 60_000,
  });
  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상",
        t1101OutBlock: { shcode: "005930" },
      });
    },
  });

  const result = await client.request("t1101", {
    t1101InBlock: { shcode: "005930" },
  });

  assert.equal(result.ok, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].headers.mac_address, undefined);
});

test("normalizes LS business API errors", async () => {
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("ls:prod", {
    accessToken: "cached-token",
    expiresAt: Date.now() + 60_000,
  });

  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    macAddress: "AABBCCDDEEFF",
    tokenStore,
    fetch: async () =>
      jsonResponse({
        rsp_cd: "99999",
        rsp_msg: "업무 오류",
      }),
  });

  const result = await client.request("t1101", {
    t1101InBlock: { shcode: "005930" },
  });

  assert.equal(result.ok, false);
  assert.equal(result.error instanceof BrokerError, true);
  assert.equal(result.error.code, "API_ERROR");
  assert.deepEqual(result.error.details, {
    rsp_cd: "99999",
    rsp_msg: "업무 오류",
  });
});

test("treats documented LS no-data success codes as successful responses", async () => {
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("ls:prod", {
    accessToken: "cached-token",
    expiresAt: Date.now() + 60_000,
  });

  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    macAddress: "AABBCCDDEEFF",
    tokenStore,
    fetch: async () =>
      jsonResponse({
        rsp_cd: "00200",
        rsp_msg: "조회내역이 없습니다.",
        CSPAQ13700OutBlock3: [],
      }),
  });

  const result = await client.request("CSPAQ13700", {
    CSPAQ13700InBlock1: {
      OrdMktCode: "00",
      BnsTpCode: "0",
      IsuNo: "",
      ExecYn: "0",
      OrdDt: "20260518",
      SrtOrdNo2: 0,
      BkseqTpCode: "0",
      OrdPtnCode: "00",
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.rsp_cd, "00200");
  assert.deepEqual(result.data.CSPAQ13700OutBlock3, []);
});

test("treats LS no-data messages as successful responses", async () => {
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("ls:prod", {
    accessToken: "cached-token",
    expiresAt: Date.now() + 60_000,
  });

  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    tokenStore,
    fetch: async () =>
      jsonResponse({
        rsp_cd: "02679",
        rsp_msg: "조회내역이 없습니다.",
        COSOQ00201OutBlock4: [],
      }),
  });

  const result = await client.request("COSOQ00201", {
    COSOQ00201InBlock1: {
      RecCnt: 1,
      BaseDt: "20260519",
      CrcyCode: "ALL",
      AstkBalTpCode: "00",
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.rsp_cd, "02679");
  assert.deepEqual(result.data.COSOQ00201OutBlock4, []);
});

test("treats documented LS order success codes as successful responses", async () => {
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("ls:prod", {
    accessToken: "cached-token",
    expiresAt: Date.now() + 60_000,
  });

  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    macAddress: "AABBCCDDEEFF",
    tokenStore,
    fetch: async () =>
      jsonResponse({
        rsp_cd: "00040",
        rsp_msg: "매수 주문이 완료되었습니다.",
        CSPAT00601OutBlock2: {
          OrdNo: 32004,
        },
      }),
  });

  const result = await client.request("CSPAT00601", {
    CSPAT00601InBlock1: {
      IsuNo: "A005930",
      OrdQty: 1,
      OrdPrc: 0,
      BnsTpCode: "2",
      OrdprcPtnCode: "03",
      MgntrnCode: "000",
      LoanDt: "",
      OrdCndiTpCode: "0",
      MbrNo: "KRX",
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.rsp_cd, "00040");
  assert.equal(result.data.CSPAT00601OutBlock2.OrdNo, 32004);
});

test("returns validation errors for unknown LS TR codes", async () => {
  let fetchCalled = false;
  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    fetch: async () => {
      fetchCalled = true;
      return jsonResponse({});
    },
  });

  const result = await client.request("missing-tr", {});

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.equal(fetchCalled, false);
});

test("returns config errors for LS mock domain gaps", async () => {
  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    macAddress: "AABBCCDDEEFF",
    env: "mock",
    fetch: async () => jsonResponse({}),
  });

  const result = await client.request("t1101", {
    t1101InBlock: { shcode: "005930" },
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "CONFIG_ERROR");
});

test("revokes an LS token", async () => {
  const calls = [];
  const tokenStore = new MemoryTokenStore();
  tokenStore.set("ls:prod", {
    accessToken: "cached-token",
    tokenType: "Bearer",
    expiresAt: Date.now() + 60_000,
  });

  const client = new LsClient({
    appKey: "app-key",
    appSecretKey: "secret-key",
    tokenStore,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ code: 200, message: "접근토큰 폐기에 성공하였습니다." });
    },
  });

  const result = await client.revokeToken();

  assert.equal(result.ok, true);
  assert.equal(calls[0].url, "https://openapi.ls-sec.co.kr:8080/oauth2/revoke");
  assert.equal(calls[0].headers["Content-Type"], "application/x-www-form-urlencoded");
  assert.equal(calls[0].body, "appkey=app-key&appsecretkey=secret-key&token_type_hint=access_token&token=cached-token");
  assert.equal(tokenStore.get("ls:prod"), null);
});

test("parses LS expiration seconds and falls back to 23 hours", () => {
  assert.equal(parseLsExpiresAt(60, () => 1_000), 61_000);
  assert.equal(parseLsExpiresAt("bad", () => 1_000), 1_000 + 23 * 60 * 60 * 1000);
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
