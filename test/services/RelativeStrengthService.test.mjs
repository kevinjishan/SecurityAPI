import assert from "node:assert/strict";
import test from "node:test";

import {
  RelativeStrengthService,
  buildBasketBenchmarkCandles,
  calculateRelativeStrength,
} from "../../src/index.mjs";
import { RelativeStrengthService as RelativeStrengthServiceFromPackage } from "security-api-reference/services";

test("exports RelativeStrengthService through package service entry", () => {
  assert.equal(RelativeStrengthServiceFromPackage, RelativeStrengthService);
});

test("calculates relative strength from aligned target and benchmark candles", () => {
  const result = calculateRelativeStrength({
    targetCandles: targetCandles(),
    benchmarkCandles: benchmarkCandles(),
    benchmark: { type: "index", code: "kospi" },
  }, {
    broker: "ls",
    symbol: "005930",
    periods: [3, 5],
  });

  assert.equal(result.symbol, "005930");
  assert.deepEqual(result.periods, [3, 5]);
  assert.equal(result.alignedCount, 8);
  assert.equal(result.series.p3.at(-1).targetReturn, 11.11111111);
  assert.equal(result.series.p3.at(-1).benchmarkReturn, 3.44827586);
  assert.equal(result.series.p3.at(-1).spread, 7.66283525);
  assert.equal(result.series.p3.at(-1).ratio, 3.22222222);
  assert.equal(result.series.p3.at(-1).direction, "outperforming");
  assert.equal(result.latest.p5.direction, "outperforming");
});

test("uses null ratio when benchmark return is too close to zero", () => {
  const result = calculateRelativeStrength({
    targetCandles: [
      candle("20260501", 100),
      candle("20260502", 110),
    ],
    benchmarkCandles: [
      candle("20260501", 100),
      candle("20260502", 100),
    ],
  }, {
    periods: [1],
  });

  assert.equal(result.latest.p1.benchmarkReturn, 0);
  assert.equal(result.latest.p1.ratio, null);
  assert.equal(result.latest.p1.spread, 10);
});

test("builds an equal-weight basket benchmark from provided sector candles", () => {
  const basket = buildBasketBenchmarkCandles({
    "000660": [
      candle("20260501", 100),
      candle("20260502", 110),
      candle("20260503", 120),
    ],
    "042700": [
      candle("20260501", 200),
      candle("20260502", 190),
      candle("20260503", 210),
    ],
  }, {
    basketCode: "semiconductor",
    basketName: "반도체",
  });

  assert.equal(basket.benchmark.type, "basket");
  assert.equal(basket.benchmark.code, "semiconductor");
  assert.equal(basket.baseDate, "20260501");
  assert.deepEqual(basket.symbols, ["000660", "042700"]);
  assert.equal(basket.candles[0].close, 100);
  assert.equal(basket.candles[1].close, 102.5);
  assert.equal(basket.candles[2].close, 112.5);
});

test("gets domestic stock relative strength with provided benchmark candles", async () => {
  const fakeMarketData = {
    async getDomesticStockDailyCandles(broker, symbol, options) {
      assert.equal(broker, "kiwoom");
      assert.equal(symbol, "005930");
      assert.equal(options.count, 8);

      return {
        ok: true,
        broker,
        id: "ka10081",
        data: {
          candles: targetCandles(),
          source: { broker, id: "ka10081", capabilityId: "marketData.domesticStock.dailyCandles" },
        },
        raw: null,
        headers: {},
        status: 200,
      };
    },
  };
  const service = new RelativeStrengthService({}, { marketData: fakeMarketData });
  const result = await service.getDomesticStockRelativeStrength("kiwoom", "005930", {
    count: 8,
    benchmark: { type: "sector", code: "semiconductor" },
    benchmarkCandles: benchmarkCandles(),
    periods: [3],
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "relativeStrength.domesticStock.benchmark");
  assert.equal(result.data.latest.p3.direction, "outperforming");
  assert.equal(result.data.sources.target.id, "ka10081");
  assert.equal(result.data.sources.benchmark.id, "provided");
});

test("gets domestic stock relative strength against a provided sector basket", async () => {
  const fakeMarketData = {
    async getDomesticStockDailyCandles(broker, symbol) {
      assert.equal(broker, "kiwoom");
      assert.equal(symbol, "005930");

      return {
        ok: true,
        broker,
        id: "ka10081",
        data: {
          candles: targetCandles(),
          source: { broker, id: "ka10081", capabilityId: "marketData.domesticStock.dailyCandles" },
        },
        raw: null,
        headers: {},
        status: 200,
      };
    },
  };
  const service = new RelativeStrengthService({}, { marketData: fakeMarketData });
  const result = await service.getDomesticStockRelativeStrengthVsBasket("kiwoom", "005930", {
    basketCode: "semiconductor",
    basketSymbols: ["000660", "042700"],
    basketCandlesBySymbol: {
      "000660": targetCandles(),
      "042700": benchmarkCandles(),
    },
    periods: [3],
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "relativeStrength.domesticStock.benchmark");
  assert.equal(result.data.benchmark.type, "basket");
  assert.equal(result.data.benchmark.code, "semiconductor");
  assert.deepEqual(result.data.basket.symbols, ["000660", "042700"]);
  assert.equal(result.data.sources.benchmark.id, "basket");
  assert.equal(result.data.latest.p3.direction, "outperforming");
});

test("gets US stock relative strength with provided benchmark candles", async () => {
  const fakeOverseasMarketData = {
    async getOverseasStockCandles(broker, identity, options) {
      assert.equal(broker, "db");
      assert.equal(identity.symbol, "TSLA");
      assert.equal(identity.countryCode, "US");
      assert.equal(options.count, 8);

      return {
        ok: true,
        broker,
        id: "FSTKCHARTDAY",
        data: {
          candles: targetCandles(),
          source: { broker, id: "FSTKCHARTDAY", capabilityId: "overseasStock.marketData.candles" },
        },
        raw: null,
        headers: {},
        status: 200,
      };
    },
  };
  const service = new RelativeStrengthService({}, { overseasMarketData: fakeOverseasMarketData });
  const result = await service.getUsStockRelativeStrength("db", {
    symbol: "TSLA",
    exchangeCode: "NASDAQ",
  }, {
    count: 8,
    benchmark: { type: "etf", code: "SPY" },
    benchmarkCandles: benchmarkCandles(),
    periods: [3],
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "overseasStock.relativeStrength.benchmark");
  assert.equal(result.data.benchmark.type, "etf");
  assert.equal(result.data.latest.p3.direction, "outperforming");
  assert.equal(result.data.sources.target.id, "FSTKCHARTDAY");
  assert.equal(result.data.sources.benchmark.id, "provided");
});

test("gets US stock relative strength by fetching benchmark identity", async () => {
  const calls = [];
  const fakeOverseasMarketData = {
    async getOverseasStockCandles(broker, identity) {
      calls.push({ broker, identity });
      const candles = identity.symbol === "SPY" ? benchmarkCandles() : targetCandles();

      return {
        ok: true,
        broker,
        id: "g3204",
        data: {
          candles,
          source: { broker, id: "g3204", capabilityId: "overseasStock.marketData.candles" },
        },
        raw: null,
        headers: {},
        status: 200,
      };
    },
  };
  const service = new RelativeStrengthService({}, { overseasMarketData: fakeOverseasMarketData });
  const result = await service.getUsStockRelativeStrength("ls", {
    symbol: "TSLA",
    exchangeCode: "NASDAQ",
  }, {
    benchmarkIdentity: { symbol: "SPY", exchangeCode: "AMEX" },
    periods: [3],
  });

  assert.equal(result.ok, true);
  assert.deepEqual(calls.map((call) => call.identity.symbol), ["TSLA", "SPY"]);
  assert.deepEqual(calls.map((call) => call.identity.countryCode), ["US", "US"]);
  assert.equal(result.data.benchmark.code, "SPY");
  assert.equal(result.data.latest.p3.ratio, 3.22222222);
});

test("returns validation error for non-index benchmark without benchmarkCandles", async () => {
  const fakeMarketData = {
    async getDomesticStockDailyCandles() {
      return {
        ok: true,
        data: { candles: targetCandles() },
        headers: {},
        status: 200,
      };
    },
  };
  const service = new RelativeStrengthService({}, { marketData: fakeMarketData });
  const result = await service.getDomesticStockRelativeStrength("ls", "005930", {
    benchmark: { type: "sector", code: "semiconductor" },
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
});

function targetCandles() {
  return [
    candle("20260508", 140),
    candle("20260507", 136),
    candle("20260506", 130),
    candle("20260505", 126),
    candle("20260504", 120),
    candle("20260503", 116),
    candle("20260502", 110),
    candle("20260501", 100),
  ];
}

function benchmarkCandles() {
  return [
    candle("20260508", 3000),
    candle("20260507", 2980),
    candle("20260506", 2940),
    candle("20260505", 2900),
    candle("20260504", 2880),
    candle("20260503", 2870),
    candle("20260502", 2860),
    candle("20260501", 2850),
  ];
}

function candle(date, close) {
  return {
    date,
    timestamp: date,
    close,
  };
}
