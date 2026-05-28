import assert from "node:assert/strict";
import test from "node:test";

import {
  AccountService,
  MarketDataService,
  OrderService,
  QuoteService,
  RealtimeService,
  normalizeDomesticStockRealtimeOrderBook,
  normalizeDomesticStockRealtimeOrderEvent,
} from "../../src/index.mjs";

test("gets and normalizes DB and KIS domestic stock current prices", async () => {
  const calls = [];
  const service = new QuoteService({
    db: {
      request: async (id, params, options) => {
        calls.push({ broker: "db", id, params, options });
        return brokerSuccess("db", id, {
          rsp_cd: "00000",
          Out: {
            Iscd: "005930",
            KorIsnm: "Samsung Electronics",
            Prpr: "70000",
            PrdyVrss: "1000",
            PrdyCtrt: "1.45",
            AcmlVol: "1234",
          },
        });
      },
    },
    kis: {
      request: async (id, params, options) => {
        calls.push({ broker: "kis", id, params, options });
        return brokerSuccess("kis", id, {
          rt_cd: "0",
          output: {
            stck_shrn_iscd: "005930",
            hts_kor_isnm: "Samsung Electronics",
            stck_prpr: "70100",
            prdy_vrss: "1100",
            prdy_ctrt: "1.59",
            acml_vol: "2345",
          },
        });
      },
    },
  });

  const db = await service.getDomesticStockCurrentPrice("db", "005930");
  const kis = await service.getDomesticStockCurrentPrice("kis", "005930", {
    marketDivision: "J",
  });

  assert.equal(db.ok, true);
  assert.equal(db.id, "PRICE");
  assert.equal(db.data.price, 70000);
  assert.deepEqual(calls[0], {
    broker: "db",
    id: "PRICE",
    params: { In: { InputCondMrktDivCode: "J", InputIscd1: "005930" } },
    options: {},
  });
  assert.equal(kis.ok, true);
  assert.equal(kis.id, "/uapi/domestic-stock/v1/quotations/inquire-price");
  assert.equal(kis.data.price, 70100);
  assert.deepEqual(calls[1], {
    broker: "kis",
    id: "/uapi/domestic-stock/v1/quotations/inquire-price",
    params: { FID_COND_MRKT_DIV_CODE: "J", FID_INPUT_ISCD: "005930" },
    options: {},
  });
});

test("gets and normalizes DB and KIS domestic daily candles", async () => {
  const calls = [];
  const service = new MarketDataService({
    db: {
      request: async (id, params, options) => {
        calls.push({ broker: "db", id, params, options });
        return brokerSuccess("db", id, {
          rsp_cd: "00000",
          Out: [
            { Date: "20260519", Oprc: "69800", Hprc: "70500", Lprc: "69600", Prpr: "70100", AcmlVol: "9263135" },
          ],
        });
      },
    },
    kis: {
      request: async (id, params, options) => {
        calls.push({ broker: "kis", id, params, options });
        return brokerSuccess("kis", id, {
          rt_cd: "0",
          output1: { stck_shrn_iscd: "005930" },
          output2: [
            { stck_bsop_date: "20260519", stck_oprc: "69900", stck_hgpr: "70600", stck_lwpr: "69700", stck_clpr: "70200", acml_vol: "1000" },
          ],
        });
      },
    },
  });

  const db = await service.getDomesticStockDailyCandles("db", "005930", {
    startDate: "2026-05-18",
    endDate: "2026-05-19",
  });
  const kis = await service.getDomesticStockDailyCandles("kis", "005930", {
    baseDate: "2026-05-19",
  });

  assert.equal(db.ok, true);
  assert.equal(db.id, "CHARTDAY");
  assert.equal(db.data.candles[0].date, "20260519");
  assert.equal(db.data.candles[0].close, 70100);
  assert.equal(kis.ok, true);
  assert.equal(kis.id, "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice");
  assert.equal(kis.data.candles[0].close, 70200);
  assert.deepEqual(calls[0].params, {
    In: {
      InputOrgAdjPrc: "1",
      InputCondMrktDivCode: "J",
      InputIscd1: "005930",
      InputDate1: "20260518",
      InputDate2: "20260519",
    },
  });
  assert.equal(calls[1].params.FID_INPUT_DATE_2, "20260519");
});

test("gets and normalizes DB cash and KIS balance account read-only responses", async () => {
  const calls = [];
  const service = new AccountService({
    db: {
      request: async (id, params, options) => {
        calls.push({ broker: "db", id, params, options });
        return brokerSuccess("db", id, {
          rsp_cd: "00000",
          Out1: {
            DpsBalAmt: "1000000",
            WthdwAbleAmt: "800000",
            OrdAbleAmt: "750000",
            SubstAmt: "50000",
          },
        });
      },
    },
    kis: {
      request: async (id, params, options) => {
        calls.push({ broker: "kis", id, params, options });
        return brokerSuccess("kis", id, {
          rt_cd: "0",
          output1: [
            { pdno: "005930", prdt_name: "Samsung Electronics", hldg_qty: "10", ord_psbl_qty: "8", prpr: "70000" },
          ],
          output2: [{ pchs_amt_smtl_amt: "600000", evlu_amt_smtl_amt: "700000", evlu_pfls_smtl_amt: "100000", tot_evlu_amt: "1300000" }],
        });
      },
    },
  });

  const db = await service.getDomesticStockCash("db");
  const kis = await service.getDomesticStockBalance("kis", {
    params: { CANO: "12345678" },
  });

  assert.equal(db.ok, true);
  assert.equal(db.id, "CDPCQ00100");
  assert.equal(db.data.summary.deposit, 1000000);
  assert.deepEqual(calls[0], {
    broker: "db",
    id: "CDPCQ00100",
    params: {},
    options: {},
  });
  assert.equal(kis.ok, true);
  assert.equal(kis.id, "/uapi/domestic-stock/v1/trading/inquire-balance");
  assert.equal(kis.data.summary.totalAssetAmount, 1300000);
  assert.equal(kis.data.positions[0].symbol, "005930");
  assert.equal(calls[1].params.CANO, "12345678");
  assert.equal(calls[1].params.ACNT_PRDT_CD, "01");
});

test("builds DB and KIS domestic order dry runs without live submission", async () => {
  let called = false;
  const service = new OrderService({
    db: {
      request: async () => {
        called = true;
      },
    },
    kis: {
      request: async () => {
        called = true;
      },
    },
  });

  const db = await service.sellDomesticStock("db", {
    symbol: "005930",
    quantity: 2,
    price: 70000,
    orderType: "limit",
  });
  const kis = await service.buyDomesticStock("kis", {
    symbol: "005930",
    quantity: 1,
    estimatedPrice: 70000,
  });

  assert.equal(db.ok, true);
  assert.equal(db.dryRun, true);
  assert.equal(db.id, "CSPAT00600");
  assert.deepEqual(db.data.request, {
    In: {
      IsuNo: "A005930",
      TrchNo: 0,
      OrdQty: 2,
      OrdPrc: 70000,
      BnsTpCode: "1",
      OrdprcPtnCode: "00",
      MgntrnCode: "000",
      LoanDt: "",
      OrdCndiTpCode: "0",
    },
  });
  assert.equal(kis.ok, true);
  assert.equal(kis.dryRun, true);
  assert.equal(kis.id, "/uapi/domestic-stock/v1/trading/order-cash");
  assert.deepEqual(kis.data.request, {
    CANO: "",
    ACNT_PRDT_CD: "01",
    PDNO: "005930",
    ORD_DVSN: "01",
    ORD_QTY: "1",
    ORD_UNPR: "0",
    EXCG_ID_DVSN_CD: "KRX",
  });
  assert.equal(called, false);
});

test("subscribes and normalizes DB and KIS realtime quote streams", async () => {
  const dbClient = new FakeRealtimeClient("db");
  const kisClient = new FakeRealtimeClient("kis");
  const service = new RealtimeService({ db: dbClient, kis: kisClient });

  const dbTrade = await service.subscribeDomesticStockTrades("db", "005930");
  const kisBook = await service.subscribeDomesticStockOrderBook("kis", "005930");
  const [dbBook] = normalizeDomesticStockRealtimeOrderBook("db", {
    header: { tr_cd: "S01", tr_key: "005930" },
    body: {
      ShrnIscd: "005930",
      BsopHour: "093000",
      Askp1: "70100",
      AskpRsqn1: "10",
      Bidp1: "70000",
      BidpRsqn1: "15",
      TotalAskpRsqn: "100",
      TotalBidpRsqn: "200",
    },
  });
  const [kisOrder] = normalizeDomesticStockRealtimeOrderEvent("kis", {
    header: { tr_id: "H0STCNI0", tr_key: "005930" },
    body: {
      output: {
        acnt_no: "12345678",
        odno: "50",
        cntg_no: "1",
        stck_shrn_iscd: "005930",
        sll_buy_dvsn_cd: "02",
        ord_qty: "10",
        cntg_qty: "8",
        cntg_unpr: "69900",
        rmn_qty: "2",
        cntg_hour: "130544",
      },
    },
  });

  assert.equal(dbTrade.ok, true);
  assert.equal(dbTrade.id, "S00");
  assert.deepEqual(dbClient.subscriptions[0], { id: "S00", key: "005930", options: { streamKind: "quote" } });
  assert.equal(kisBook.ok, true);
  assert.equal(kisBook.id, "H0STASP0");
  assert.deepEqual(kisClient.subscriptions[0], { id: "H0STASP0", key: "005930", options: { streamKind: "quote" } });
  assert.equal(dbBook.kind, "orderBook");
  assert.equal(dbBook.asks[0].price, 70100);
  assert.equal(dbBook.bids[0].quantity, 15);
  assert.equal(kisOrder.kind, "orderEvent");
  assert.equal(kisOrder.side, "buy");
  assert.equal(kisOrder.executedQuantity, 8);
  assert.equal(kisOrder.remainingQuantity, 2);
});

class FakeRealtimeClient {
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

  async subscribe(id, key, options) {
    this.subscriptions.push({ id, key, options });
    return { id, key, action: "subscribe" };
  }

  async unsubscribe(id, key) {
    return { id, key, action: "unsubscribe" };
  }
}

function brokerSuccess(broker, id, data) {
  return {
    ok: true,
    broker,
    id,
    data,
    raw: data,
    headers: {},
    status: 200,
  };
}
