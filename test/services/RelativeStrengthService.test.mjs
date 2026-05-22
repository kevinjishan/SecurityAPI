import assert from "node:assert/strict";
import test from "node:test";

import {
  RelativeStrengthService,
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
