import assert from "node:assert/strict";
import test from "node:test";

import { BrokerError, QuoteService, normalizeDomesticStockCurrentPrice } from "../../src/index.mjs";
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
