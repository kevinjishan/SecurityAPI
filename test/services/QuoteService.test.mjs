import assert from "node:assert/strict";
import test from "node:test";

import {
  BrokerError,
  QuoteService,
  normalizeDomesticStockCurrentPrice,
  normalizeDomesticStockMultiCurrentPrice,
  normalizeDomesticStockOrderBook,
} from "../../src/index.mjs";
import { QuoteService as QuoteServiceFromPackage } from "security-api-reference/services";

test("exports QuoteService through package service entry", () => {
  assert.equal(QuoteServiceFromPackage, QuoteService);
});

test("gets and normalizes Kiwoom domestic stock current price", async () => {
  const calls = [];
  const service = new QuoteService({
    kiwoom: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess({
          stk_cd: "005930",
          stk_nm: "삼성전자",
          cur_prc: "-70,000",
          pred_pre: "-1,000",
          flu_rt: "-1.41",
          trde_qty: "1,234",
          return_code: 0,
        });
      },
    },
  });

  const result = await service.getDomesticStockCurrentPrice("kiwoom", "005930", {
    requestOptions: { timeoutMs: 5000 },
  });

  assert.equal(result.ok, true);
  assert.equal(result.broker, "kiwoom");
  assert.equal(result.id, "ka10001");
  assert.equal(result.capability, "quote.domesticStock.currentPrice");
  assert.equal(result.symbol, "005930");
  assert.deepEqual(calls, [
    {
      id: "ka10001",
      params: { stk_cd: "005930" },
      options: { timeoutMs: 5000 },
    },
  ]);
  assert.deepEqual(result.data, {
    broker: "kiwoom",
    symbol: "005930",
    name: "삼성전자",
    price: 70000,
    priceRaw: "-70,000",
    change: -1000,
    changeRaw: "-1,000",
    changeRate: -1.41,
    changeRateRaw: "-1.41",
    volume: 1234,
    volumeRaw: "1,234",
    currency: "KRW",
    source: {
      broker: "kiwoom",
      id: "ka10001",
      capabilityId: "quote.domesticStock.currentPrice",
    },
  });
});

test("gets and normalizes LS domestic stock current price", async () => {
  const calls = [];
  const service = new QuoteService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess({
          rsp_cd: "00000",
          rsp_msg: "정상",
          t1101OutBlock: {
            shcode: "005930",
            hname: "삼성전자",
            price: 70000,
            change: -1000,
            diff: "-1.41",
            volume: 1234,
          },
        });
      },
    },
  });

  const result = await service.getDomesticStockCurrentPrice("ls", "005930");

  assert.equal(result.ok, true);
  assert.equal(result.broker, "ls");
  assert.equal(result.id, "t1101");
  assert.deepEqual(calls, [
    {
      id: "t1101",
      params: { t1101InBlock: { shcode: "005930" } },
      options: {},
    },
  ]);
  assert.equal(result.data.symbol, "005930");
  assert.equal(result.data.name, "삼성전자");
  assert.equal(result.data.price, 70000);
  assert.equal(result.data.changeRate, -1.41);
});

test("supports explicit LS current price source selection", async () => {
  const calls = [];
  const service = new QuoteService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess({
          rsp_cd: "00000",
          t1102OutBlock: {
            shcode: "005930",
            hname: "삼성전자",
            price: 71000,
          },
        });
      },
    },
  });

  const result = await service.getDomesticStockCurrentPrice("ls", "005930", {
    trCode: "t1102",
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "t1102");
  assert.deepEqual(calls[0], {
    id: "t1102",
    params: { t1102InBlock: { shcode: "005930" } },
  });
  assert.equal(result.data.price, 71000);
});

test("gets and normalizes Kiwoom domestic stock order book", async () => {
  const calls = [];
  const service = new QuoteService({
    kiwoom: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess({
          bid_req_base_tm: "093000",
          sel_fpr_bid: "70100",
          sel_fpr_req: "10",
          sel_2th_pre_bid: "70200",
          sel_2th_pre_req: "20",
          buy_fpr_bid: "70000",
          buy_fpr_req: "15",
          buy_2th_pre_bid: "69900",
          buy_2th_pre_req: "25",
          tot_sel_req: "100",
          tot_buy_req: "200",
          return_code: 0,
        });
      },
    },
  });

  const result = await service.getDomesticStockOrderBook("kiwoom", "005930");

  assert.equal(result.ok, true);
  assert.equal(result.capability, "quote.domesticStock.orderBook");
  assert.equal(result.id, "ka10004");
  assert.deepEqual(calls, [{ id: "ka10004", params: { stk_cd: "005930" }, options: {} }]);
  assert.deepEqual(result.data.asks[0], { level: 1, price: 70100, priceRaw: "70100", quantity: 10, quantityRaw: "10" });
  assert.deepEqual(result.data.bids[1], { level: 2, price: 69900, priceRaw: "69900", quantity: 25, quantityRaw: "25" });
  assert.deepEqual(result.data.totals, {
    askQuantity: 100,
    askQuantityRaw: "100",
    bidQuantity: 200,
    bidQuantityRaw: "200",
  });
});

test("gets and normalizes LS domestic stock order book", async () => {
  const calls = [];
  const service = new QuoteService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess({
          rsp_cd: "00000",
          t1101OutBlock: {
            shcode: "005930",
            hotime: "09300000",
            offerho1: 70100,
            offerrem1: 10,
            offerho2: 70200,
            offerrem2: 20,
            bidho1: 70000,
            bidrem1: 15,
            bidho2: 69900,
            bidrem2: 25,
            totofferrem: 100,
            totbidrem: 200,
          },
        });
      },
    },
  });

  const result = await service.getDomesticStockOrderBook("ls", "005930");

  assert.equal(result.ok, true);
  assert.equal(result.id, "t1101");
  assert.deepEqual(calls, [{ id: "t1101", params: { t1101InBlock: { shcode: "005930" } }, options: {} }]);
  assert.deepEqual(result.data.asks[0], { level: 1, price: 70100, priceRaw: "70100", quantity: 10, quantityRaw: "10" });
  assert.deepEqual(result.data.bids[1], { level: 2, price: 69900, priceRaw: "69900", quantity: 25, quantityRaw: "25" });
  assert.equal(result.data.timestamp, "09300000");
});

test("gets and normalizes Kiwoom multi current prices", async () => {
  const calls = [];
  const service = new QuoteService({
    kiwoom: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess({
          atn_stk_infr: [
            { stk_cd: "005930", stk_nm: "삼성전자", cur_prc: "+70000", flu_rt: "+1.00" },
            { stk_cd: "000660", stk_nm: "SK하이닉스", cur_prc: "-120000", flu_rt: "-0.50" },
          ],
          return_code: 0,
        });
      },
    },
  });

  const result = await service.getDomesticStockMultiCurrentPrice("kiwoom", ["005930", "000660"]);

  assert.equal(result.ok, true);
  assert.equal(result.id, "ka10095");
  assert.deepEqual(calls, [{ id: "ka10095", params: { stk_cd: "005930|000660" }, options: {} }]);
  assert.deepEqual(result.data.map((item) => [item.symbol, item.name, item.price]), [
    ["005930", "삼성전자", 70000],
    ["000660", "SK하이닉스", 120000],
  ]);
});

test("gets and normalizes LS multi current prices", async () => {
  const calls = [];
  const service = new QuoteService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess({
          rsp_cd: "00000",
          t8407OutBlock1: [
            { shcode: "005930", hname: "삼성전자", price: 70000, diff: "1.00" },
            { shcode: "000660", hname: "SK하이닉스", price: 120000, diff: "-0.50" },
          ],
        });
      },
    },
  });

  const result = await service.getDomesticStockMultiCurrentPrice("ls", ["005930", "000660"]);

  assert.equal(result.ok, true);
  assert.equal(result.id, "t8407");
  assert.deepEqual(calls, [
    {
      id: "t8407",
      params: { t8407InBlock: { nrec: 2, shcode: "005930000660" } },
      options: {},
    },
  ]);
  assert.deepEqual(result.data.map((item) => [item.symbol, item.name, item.price]), [
    ["005930", "삼성전자", 70000],
    ["000660", "SK하이닉스", 120000],
  ]);
});

test("returns config errors when a broker client is missing", async () => {
  const service = new QuoteService({});

  const result = await service.getDomesticStockCurrentPrice("kiwoom", "005930");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "CONFIG_ERROR");
});

test("returns validation errors for blank symbols", async () => {
  const service = new QuoteService({});

  const result = await service.getDomesticStockCurrentPrice("kiwoom", "");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
});

test("returns validation errors for empty multi current price symbols", async () => {
  const service = new QuoteService({});

  const result = await service.getDomesticStockMultiCurrentPrice("ls", []);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
});

test("preserves broker client failures", async () => {
  const service = new QuoteService({
    kiwoom: {
      request: async () => ({
        ok: false,
        broker: "kiwoom",
        id: "ka10001",
        data: null,
        raw: { return_code: -100 },
        headers: {},
        status: 200,
        error: BrokerError.api("업무 오류", {
          broker: "kiwoom",
          id: "ka10001",
        }),
      }),
    },
  });

  const result = await service.getDomesticStockCurrentPrice("kiwoom", "005930");

  assert.equal(result.ok, false);
  assert.equal(result.id, "ka10001");
  assert.equal(result.status, 200);
  assert.equal(result.error.code, "API_ERROR");
  assert.deepEqual(result.raw, { return_code: -100 });
});

test("normalizes payloads directly", () => {
  assert.deepEqual(
    normalizeDomesticStockCurrentPrice("ls", "005930", "t1101", {
      t1101OutBlock: { shcode: "005930", hname: "삼성전자", price: "-70000" },
    }),
    {
      broker: "ls",
      symbol: "005930",
      name: "삼성전자",
      price: 70000,
      priceRaw: "-70000",
      change: null,
      changeRaw: null,
      changeRate: null,
      changeRateRaw: null,
      volume: null,
      volumeRaw: null,
      currency: "KRW",
      source: {
        broker: "ls",
        id: "t1101",
        capabilityId: "quote.domesticStock.currentPrice",
      },
    },
  );
});

test("normalizes order book and multi current price payloads directly", () => {
  const orderBook = normalizeDomesticStockOrderBook("ls", "005930", "t1101", {
    t1101OutBlock: { shcode: "005930", offerho1: 70100, offerrem1: 10, bidho1: 70000, bidrem1: 15 },
  });

  assert.deepEqual(orderBook.asks[0], { level: 1, price: 70100, priceRaw: "70100", quantity: 10, quantityRaw: "10" });
  assert.deepEqual(orderBook.bids[0], { level: 1, price: 70000, priceRaw: "70000", quantity: 15, quantityRaw: "15" });

  const multi = normalizeDomesticStockMultiCurrentPrice("kiwoom", ["005930"], "ka10095", {
    atn_stk_infr: [{ stk_cd: "005930", stk_nm: "삼성전자", cur_prc: "70000" }],
  });

  assert.equal(multi.length, 1);
  assert.equal(multi[0].price, 70000);
});

function brokerSuccess(data) {
  return {
    ok: true,
    broker: data.rsp_cd ? "ls" : "kiwoom",
    id: data.rsp_cd ? "t1101" : "ka10001",
    data,
    raw: data,
    headers: {},
    status: 200,
  };
}
