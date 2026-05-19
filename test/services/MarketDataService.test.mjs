import assert from "node:assert/strict";
import test from "node:test";

import {
  MarketDataService,
  normalizeDomesticStockDailyCandles,
} from "../../src/index.mjs";
import { MarketDataService as MarketDataServiceFromPackage } from "security-api-reference/services";

test("exports MarketDataService through package service entry", () => {
  assert.equal(MarketDataServiceFromPackage, MarketDataService);
});

test("gets and normalizes Kiwoom domestic stock daily candles", async () => {
  const client = new FakeClient("kiwoom");
  const service = new MarketDataService({ kiwoom: client });

  const result = await service.getDomesticStockDailyCandles("kiwoom", "005930", {
    baseDate: "2026-05-19",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "ka10081",
    params: {
      stk_cd: "005930",
      base_dt: "20260519",
      upd_stkpc_tp: "1",
    },
    options: {},
  });
  assert.equal(result.data.interval, "1d");
  assert.equal(result.data.candles[0].date, "20260519");
  assert.equal(result.data.candles[0].open, 69800);
  assert.equal(result.data.candles[0].close, 70100);
  assert.equal(result.data.candles[0].volume, 9263135);
  assert.equal(result.data.source.id, "ka10081");
});

test("gets and normalizes LS domestic stock minute candles", async () => {
  const client = new FakeClient("ls");
  const service = new MarketDataService({ ls: client });

  const result = await service.getDomesticStockMinuteCandles("ls", "005930", {
    intervalMinutes: 5,
    count: 2,
    endDate: "2026-05-19",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "t8412",
    params: {
      t8412InBlock: {
        shcode: "005930",
        ncnt: 5,
        qrycnt: 2,
        nday: "0",
        sdate: "",
        stime: "",
        edate: "20260519",
        etime: "",
        cts_date: "",
        cts_time: "",
        comp_yn: "N",
      },
    },
    options: {},
  });
  assert.equal(result.data.interval, "5m");
  assert.equal(result.data.candles[0].timestamp, "20260519093000");
  assert.equal(result.data.candles[0].close, 70000);
  assert.equal(result.data.candles[0].value, 7000000);
  assert.equal(result.data.summary.previousClose, 69000);
});

test("gets and normalizes domestic stock basic info", async () => {
  const client = new FakeClient("ls");
  const service = new MarketDataService({ ls: client });

  const result = await service.getDomesticStockBasicInfo("ls", "005930");

  assert.equal(result.ok, true);
  assert.equal(client.calls[0].id, "t1102");
  assert.deepEqual(client.calls[0].params, {
    t1102InBlock: { shcode: "005930" },
  });
  assert.equal(result.data.symbol, "005930");
  assert.equal(result.data.name, "삼성전자");
  assert.equal(result.data.price, 70000);
  assert.equal(result.data.referencePrice, 69000);
  assert.equal(result.data.listedShares, 5969783);
});

test("returns config and validation errors for market data requests", async () => {
  const service = new MarketDataService({});

  const missingClient = await service.getDomesticStockDailyCandles("kiwoom", "005930");
  const blankSymbol = await service.getDomesticStockMinuteCandles("kiwoom", "");

  assert.equal(missingClient.ok, false);
  assert.equal(missingClient.error.code, "CONFIG_ERROR");
  assert.equal(blankSymbol.ok, false);
  assert.equal(blankSymbol.error.code, "VALIDATION_ERROR");
});

test("normalizes daily candle payloads directly", () => {
  const data = normalizeDomesticStockDailyCandles("kiwoom", "005930", "ka10081", {
    stk_dt_pole_chart_qry: [
      {
        dt: "20260519",
        open_pric: "70000",
        high_pric: "+71000",
        low_pric: "-69000",
        cur_prc: "-70500",
        trde_qty: "100",
      },
    ],
  });

  assert.equal(data.candles[0].high, 71000);
  assert.equal(data.candles[0].low, 69000);
  assert.equal(data.candles[0].close, 70500);
});

class FakeClient {
  constructor(broker) {
    this.broker = broker;
    this.calls = [];
  }

  async request(id, params, options = {}) {
    this.calls.push({ id, params, options });
    return {
      ok: true,
      broker: this.broker,
      id,
      data: fakePayload(id),
      raw: fakePayload(id),
      headers: {},
      status: 200,
    };
  }
}

function fakePayload(id) {
  if (id === "ka10081") {
    return {
      stk_cd: "005930",
      stk_dt_pole_chart_qry: [
        {
          dt: "20260519",
          open_pric: "69800",
          high_pric: "70500",
          low_pric: "69600",
          cur_prc: "70100",
          trde_qty: "9263135",
          trde_prica: "648525",
          pred_pre: "+600",
        },
      ],
    };
  }

  if (id === "t8412") {
    return {
      t8412OutBlock: {
        shcode: "005930",
        jiclose: 69000,
        highend: 89700,
        lowend: 48300,
        cts_date: "",
        cts_time: "",
        rec_count: 2,
      },
      t8412OutBlock1: [
        {
          date: "20260519",
          time: "093000",
          open: 69900,
          high: 70100,
          low: 69800,
          close: 70000,
          jdiff_vol: 100,
          value: 7000000,
        },
      ],
    };
  }

  if (id === "t1102") {
    return {
      t1102OutBlock: {
        shcode: "005930",
        hname: "삼성전자",
        price: 70000,
        recprice: 69000,
        open: 69900,
        high: 71000,
        low: 69500,
        volume: 1000000,
        total: 417000000,
        listing: 5969783,
      },
    };
  }

  return {};
}
