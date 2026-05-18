import assert from "node:assert/strict";

import { KiwoomClient, LsClient, QuoteService } from "security-api-reference";

const kiwoomCalls = [];
const kiwoom = new KiwoomClient({
  appKey: "mock-kiwoom-app-key",
  secretKey: "mock-kiwoom-secret-key",
  env: "mock",
  fetch: async (url, init) => {
    kiwoomCalls.push(readCall(url, init));

    if (url.endsWith("/oauth2/token")) {
      return jsonResponse({
        token: "mock-kiwoom-token",
        token_type: "Bearer",
        expires_dt: "20991231235959",
      });
    }

    return jsonResponse(
      {
        stk_cd: "005930",
        stk_nm: "삼성전자",
        cur_prc: "70000",
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

const kiwoomResult = await kiwoom.request("ka10001", {
  stk_cd: "005930",
});

assert.equal(kiwoomResult.ok, true);
assert.equal(kiwoomResult.data.stk_cd, "005930");
assert.equal(kiwoomCalls.length, 2);
assert.equal(kiwoomCalls[1].headers["api-id"], "ka10001");
assert.equal(kiwoomCalls[1].headers.authorization, "Bearer mock-kiwoom-token");

const lsCalls = [];
const ls = new LsClient({
  appKey: "mock-ls-app-key",
  appSecretKey: "mock-ls-secret-key",
  macAddress: "AABBCCDDEEFF",
  env: "prod",
  fetch: async (url, init) => {
    lsCalls.push(readCall(url, init));

    if (url.endsWith("/oauth2/token")) {
      return jsonResponse({
        access_token: "mock-ls-token",
        token_type: "Bearer",
        expires_in: 86400,
      });
    }

    return jsonResponse(
      {
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t1101OutBlock: {
          shcode: "005930",
          hname: "삼성전자",
          price: 70000,
        },
      },
      {
        headers: {
          tr_cont: "N",
        },
      },
    );
  },
});

const lsResult = await ls.request("t1101", {
  t1101InBlock: { shcode: "005930" },
});

assert.equal(lsResult.ok, true);
assert.equal(lsResult.data.t1101OutBlock.shcode, "005930");
assert.equal(lsCalls.length, 2);
assert.equal(lsCalls[1].headers.tr_cd, "t1101");
assert.equal(lsCalls[1].headers.authorization, "Bearer mock-ls-token");
assert.equal(lsCalls[1].headers.mac_address, "AABBCCDDEEFF");

const quote = new QuoteService({ kiwoom, ls });
const kiwoomQuote = await quote.getDomesticStockCurrentPrice("kiwoom", "005930");
const lsQuote = await quote.getDomesticStockCurrentPrice("ls", "005930");

assert.equal(kiwoomQuote.ok, true);
assert.equal(kiwoomQuote.data.price, 70000);
assert.equal(lsQuote.ok, true);
assert.equal(lsQuote.data.price, 70000);

console.log("Mock Kiwoom result:", kiwoomResult.data);
console.log("Mock LS result:", lsResult.data);
console.log("Mock QuoteService results:", {
  kiwoom: kiwoomQuote.data,
  ls: lsQuote.data,
});
console.log("Mock broker client examples passed.");

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
