import assert from "node:assert/strict";

import {
  AccountService,
  KiwoomClient,
  LsClient,
  OrderService,
  QuoteService,
  RealtimeService,
} from "security-api-reference";

class MockRealtimeClient {
  constructor(broker) {
    this.broker = broker;
    this.handlers = new Map();
    this.subscriptions = [];
  }

  on(event, handler) {
    const handlers = this.handlers.get(event) ?? new Set();
    handlers.add(handler);
    this.handlers.set(event, handlers);
    return () => handlers.delete(handler);
  }

  async subscribe(id, key, options = {}) {
    const subscription = { id, key, options };
    this.subscriptions.push(subscription);
    return {
      ...subscription,
      action: "subscribe",
    };
  }

  async unsubscribe(id, key, options = {}) {
    return {
      id,
      key,
      options,
      action: "unsubscribe",
    };
  }

  emit(event, payload) {
    for (const handler of this.handlers.get(event) ?? []) {
      handler(payload);
    }
  }
}

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

    if (init.headers["api-id"] === "ka10004") {
      return jsonResponse({
        bid_req_base_tm: "093000",
        sel_fpr_bid: "70100",
        sel_fpr_req: "10",
        buy_fpr_bid: "70000",
        buy_fpr_req: "15",
        tot_sel_req: "100",
        tot_buy_req: "200",
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "ka10095") {
      return jsonResponse({
        atn_stk_infr: [
          { stk_cd: "005930", stk_nm: "삼성전자", cur_prc: "70000" },
          { stk_cd: "000660", stk_nm: "SK하이닉스", cur_prc: "120000" },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "kt00001") {
      return jsonResponse({
        entr: "1000000",
        pymn_alow_amt: "800000",
        ord_alow_amt: "750000",
        d1_entra: "900000",
        d2_entra: "850000",
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "kt00018") {
      return jsonResponse({
        tot_pur_amt: "1000000",
        tot_evlt_amt: "1200000",
        tot_evlt_pl: "200000",
        tot_prft_rt: "20.00",
        prsm_dpst_aset_amt: "1300000",
        acnt_evlt_remn_indv_tot: [
          {
            stk_cd: "A005930",
            stk_nm: "삼성전자",
            rmnd_qty: "10",
            trde_able_qty: "8",
            pur_pric: "60000",
            cur_prc: "70000",
            pur_amt: "600000",
            evlt_amt: "700000",
            evltv_prft: "100000",
            prft_rt: "16.67",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    if (init.headers["api-id"] === "kt00007") {
      return jsonResponse({
        acnt_ord_cntr_prps_dtl: [
          {
            ord_no: "0000050",
            stk_cd: "A005930",
            trde_tp: "시장가",
            ord_qty: "0000000010",
            ord_uv: "0000070000",
            cnfm_qty: "0000000008",
            acpt_tp: "접수",
            ord_tm: "13:05:43",
            ori_ord: "0000000",
            stk_nm: "삼성전자",
            io_tp_nm: "현금매수",
            cntr_qty: "0000000008",
            cntr_uv: "0000069900",
            ord_remnq: "0000000002",
            comm_ord_tp: "영웅문4",
            cnfm_tm: "13:05:44",
            dmst_stex_tp: "KRX",
          },
        ],
        return_code: 0,
        return_msg: "정상적으로 처리되었습니다",
      });
    }

    return jsonResponse({
      stk_cd: "005930",
      stk_nm: "삼성전자",
      cur_prc: "70000",
      return_code: 0,
      return_msg: "정상적으로 처리되었습니다",
    }, {
      headers: {
        "cont-yn": "N",
      },
    });
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

    if (init.headers.tr_cd === "t8407") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t8407OutBlock1: [
          { shcode: "005930", hname: "삼성전자", price: 70000 },
          { shcode: "000660", hname: "SK하이닉스", price: 120000 },
        ],
      });
    }

    if (init.headers.tr_cd === "CSPAQ12200") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        CSPAQ12200OutBlock2: {
          Dps: 1000000,
          MnyoutAbleAmt: 800000,
          MnyOrdAbleAmt: 750000,
          BalEvalAmt: 1200000,
          DpsastTotamt: 1300000,
          D1Dps: 900000,
          D2Dps: 850000,
        },
      });
    }

    if (init.headers.tr_cd === "t0424") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        t0424OutBlock: {
          sunamt: 1300000,
          mamt: 1000000,
          tappamt: 1200000,
          tdtsunik: 200000,
          cts_expcode: "",
        },
        t0424OutBlock1: [
          {
            expcode: "005930",
            hname: "삼성전자",
            janqty: 10,
            mdposqt: 8,
            pamt: 60000,
            price: 70000,
            mamt: 600000,
            appamt: 700000,
            dtsunik: 100000,
            sunikrt: "16.67",
          },
        ],
      });
    }

    if (init.headers.tr_cd === "CSPAQ13700") {
      return jsonResponse({
        rsp_cd: "00000",
        rsp_msg: "정상적으로 조회가 완료되었습니다.",
        CSPAQ13700OutBlock2: {
          RecCnt: 1,
          SellOrdQty: 0,
          BuyOrdQty: 10,
          BuyExecQty: 8,
          SellExecQty: 0,
          BuyExecAmt: 559200,
          SellExecAmt: 0,
        },
        CSPAQ13700OutBlock3: [
          {
            OrdNo: "50",
            OrgOrdNo: "0",
            ExecNo: "1",
            IsuNo: "A005930",
            IsuNm: "삼성전자",
            BnsTpCode: "2",
            BnsTpNm: "매수",
            OrdPtnNm: "현금매수",
            ExecYn: "1",
            OrdQty: 10,
            OrdPrc: 70000,
            ExecQty: 8,
            ExecPrc: 69900,
            MrcAbleQty: 2,
            OrdDt: "20260518",
            OrdTime: "130543",
            ExecTrxTime: "130544",
            CommdaNm: "API",
          },
        ],
      });
    }

    return jsonResponse({
      rsp_cd: "00000",
      rsp_msg: "정상적으로 조회가 완료되었습니다.",
      t1101OutBlock: {
        shcode: "005930",
        hname: "삼성전자",
        price: 70000,
        offerho1: 70100,
        offerrem1: 10,
        bidho1: 70000,
        bidrem1: 15,
      },
    }, {
      headers: {
        tr_cont: "N",
      },
    });
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
const kiwoomOrderBook = await quote.getDomesticStockOrderBook("kiwoom", "005930");
const lsOrderBook = await quote.getDomesticStockOrderBook("ls", "005930");
const kiwoomMultiQuote = await quote.getDomesticStockMultiCurrentPrice("kiwoom", ["005930", "000660"]);
const lsMultiQuote = await quote.getDomesticStockMultiCurrentPrice("ls", ["005930", "000660"]);
const account = new AccountService({ kiwoom, ls });
const kiwoomCash = await account.getDomesticStockCash("kiwoom");
const lsCash = await account.getDomesticStockCash("ls");
const kiwoomBalance = await account.getDomesticStockBalance("kiwoom");
const lsBalance = await account.getDomesticStockBalance("ls");
const kiwoomOrderHistory = await account.getDomesticStockOrderHistory("kiwoom", {
  orderDate: "20260518",
  symbol: "005930",
});
const lsOrderHistory = await account.getDomesticStockOrderHistory("ls", {
  orderDate: "20260518",
  symbol: "005930",
});
const order = new OrderService({ kiwoom, ls });
const kiwoomBuyDryRun = await order.buyDomesticStock("kiwoom", {
  symbol: "005930",
  quantity: 1,
  estimatedPrice: 70000,
}, {
  maxOrderAmount: 100000,
  allowedSymbols: ["005930"],
});
const lsSellDryRun = await order.sellDomesticStock("ls", {
  symbol: "005930",
  quantity: 1,
  price: 70000,
  orderType: "limit",
}, {
  maxOrderAmount: 100000,
  blockedSymbols: ["000660"],
});
const kiwoomRealtime = new MockRealtimeClient("kiwoom");
const realtime = new RealtimeService({ kiwoom: kiwoomRealtime });
const realtimeMessages = [];
const realtimeSubscription = await realtime.subscribeDomesticStockTrades("kiwoom", "005930", {
  onMessage: (message) => realtimeMessages.push(message),
});

kiwoomRealtime.emit("realtime", {
  data: {
    trnm: "REAL",
    data: [
      {
        type: "0B",
        name: "주식체결",
        item: "005930",
        values: { 10: "70000" },
      },
    ],
  },
});

assert.equal(kiwoomQuote.ok, true);
assert.equal(kiwoomQuote.data.price, 70000);
assert.equal(lsQuote.ok, true);
assert.equal(lsQuote.data.price, 70000);
assert.equal(kiwoomOrderBook.ok, true);
assert.equal(kiwoomOrderBook.data.asks[0].price, 70100);
assert.equal(lsOrderBook.ok, true);
assert.equal(lsOrderBook.data.asks[0].price, 70100);
assert.equal(kiwoomMultiQuote.ok, true);
assert.equal(kiwoomMultiQuote.data.length, 2);
assert.equal(lsMultiQuote.ok, true);
assert.equal(lsMultiQuote.data.length, 2);
assert.equal(kiwoomCash.ok, true);
assert.equal(kiwoomCash.data.summary.orderableAmount, 750000);
assert.equal(lsCash.ok, true);
assert.equal(lsCash.data.summary.orderableAmount, 750000);
assert.equal(kiwoomBalance.ok, true);
assert.equal(kiwoomBalance.data.positions[0].symbol, "005930");
assert.equal(lsBalance.ok, true);
assert.equal(lsBalance.data.positions[0].symbol, "005930");
assert.equal(kiwoomOrderHistory.ok, true);
assert.equal(kiwoomOrderHistory.data.orders[0].symbol, "005930");
assert.equal(lsOrderHistory.ok, true);
assert.equal(lsOrderHistory.data.orders[0].symbol, "005930");
assert.equal(kiwoomBuyDryRun.ok, true);
assert.equal(kiwoomBuyDryRun.dryRun, true);
assert.equal(kiwoomBuyDryRun.data.request.trde_tp, "3");
assert.equal(kiwoomBuyDryRun.data.safety.orderValue, 70000);
assert.equal(lsSellDryRun.ok, true);
assert.equal(lsSellDryRun.dryRun, true);
assert.equal(lsSellDryRun.data.request.CSPAT00601InBlock1.BnsTpCode, "1");
assert.equal(lsSellDryRun.data.safety.allowed, true);
assert.equal(realtimeSubscription.ok, true);
assert.equal(realtimeSubscription.id, "0B");
assert.equal(kiwoomRealtime.subscriptions[0].id, "0B");
assert.equal(kiwoomRealtime.subscriptions[0].key, "005930");
assert.equal(realtimeMessages[0].body["10"], "70000");

console.log("Mock Kiwoom result:", kiwoomResult.data);
console.log("Mock LS result:", lsResult.data);
console.log("Mock QuoteService results:", {
  kiwoom: kiwoomQuote.data,
  ls: lsQuote.data,
  kiwoomOrderBook: kiwoomOrderBook.data,
  lsOrderBook: lsOrderBook.data,
  kiwoomMultiQuote: kiwoomMultiQuote.data,
  lsMultiQuote: lsMultiQuote.data,
  kiwoomCash: kiwoomCash.data,
  lsCash: lsCash.data,
  kiwoomBalance: kiwoomBalance.data,
  lsBalance: lsBalance.data,
  kiwoomOrderHistory: kiwoomOrderHistory.data,
  lsOrderHistory: lsOrderHistory.data,
  kiwoomBuyDryRun: kiwoomBuyDryRun.data,
  lsSellDryRun: lsSellDryRun.data,
  realtimeSubscription,
  realtimeMessage: realtimeMessages[0],
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
