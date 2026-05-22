import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_TECHNICAL_PROFILE,
  TechnicalIndicatorService,
  averageTrueRange,
  calculateBollingerBands,
  calculateTechnicalIndicators,
  detectCandlePatterns,
  exponentialMovingAverage,
  moneyFlowIndex,
  movingAverageAlignment,
  movingAverageConvergenceDivergence,
  movingAverageDisparity,
  movingAverageSlope,
  onBalanceVolume,
  ratioToMovingAverage,
  relativeStrengthIndex,
  rollingStandardDeviation,
  simpleMovingAverage,
  stochasticOscillator,
} from "../../src/index.mjs";
import { TechnicalIndicatorService as TechnicalIndicatorServiceFromPackage } from "security-api-reference/services";

test("exports TechnicalIndicatorService through package service entry", () => {
  assert.equal(TechnicalIndicatorServiceFromPackage, TechnicalIndicatorService);
});

test("calculates common technical indicators from normalized candles", () => {
  const result = calculateTechnicalIndicators(sampleCandles(), {
    broker: "ls",
    symbol: "005930",
    interval: "1d",
    smaPeriods: [3, 5],
    emaPeriods: [3],
    disparityPeriods: [3],
    maAlignmentPeriods: [3, 5],
    slope: { periods: [3], lookback: 2 },
    rsiPeriod: 3,
    macd: { fastPeriod: 3, slowPeriod: 6, signalPeriod: 3 },
    stochastic: { kPeriod: 3, kSmoothing: 2, dPeriod: 2 },
    volumeMovingAveragePeriods: [3],
    volumeRatioPeriod: 3,
    valueRatioPeriod: 3,
    mfiPeriod: 3,
    atrPeriod: 3,
    bollingerBands: { period: 3, standardDeviations: 2 },
    standardDeviationPeriod: 3,
  });

  assert.equal(result.symbol, "005930");
  assert.equal(result.candles[0].timestamp, "20260501");
  assert.equal(result.candles.at(-1).close, 19);
  assert.equal(result.indicators.sma.p3[2], 11);
  assert.equal(result.indicators.sma.p3.at(-1), 18);
  assert.equal(result.indicators.trend.sma.p3.at(-1), 18);
  assert.equal(result.indicators.trend.disparity.p3.at(-1), 105.55555556);
  assert.equal(result.indicators.trend.maSlope.p3.at(-1), 12.5);
  assert.equal(result.indicators.trend.maAlignment.at(-1), "bullish");
  assert.equal(result.indicators.ema.p3[2], 11);
  assert.equal(result.indicators.rsi.values[3], 100);
  assert.equal(result.indicators.macd.line[5], 1.5);
  assert.equal(result.indicators.macd.signal[7], 1.5);
  assert.equal(result.indicators.momentum.stochastic.rawK.at(-1), 75);
  assert.equal(result.indicators.volume.ratio.values.at(-1), 1.05555556);
  assert.equal(result.indicators.volume.valueRatio.values.at(-1), null);
  assert.equal(result.indicators.volume.obv.at(-1), 13500);
  assert.equal(result.indicators.volume.mfi.values.at(-1), 100);
  assert.equal(result.indicators.volatility.atr.values.at(-1), 2);
  assert.equal(result.indicators.bollingerBands.middle.at(-1), 18);
  assert.equal(result.indicators.volatility.standardDeviation.values.at(-1), 0.81649658);
  assert.equal(result.indicators.candlePatterns.at(-1).color, "bullish");
  assert.equal(result.latest.sma.p3, 18);
  assert.equal(result.latest.trend.sma.p3, 18);
  assert.equal(result.latest.trend.maAlignment, "bullish");
  assert.equal(result.latest.rsi, 100);
  assert.equal(result.latest.volume.ratio, 1.05555556);
  assert.equal(result.latest.flags.maAlignment, "bullish");
  assert.equal(result.latest.flags.rsiZone, "overbought");
  assert.equal(result.latest.flags.candleColor, "bullish");
  assert.equal(result.latest.bollingerBands.middle, 18);
  assert.equal(result.meta.outputCount, 10);
  assert.equal(result.meta.requiredWarmup, 9);
});

test("exposes standalone indicator calculators", () => {
  const values = [1, 2, 3, 4, 5, 6];

  assert.equal(DEFAULT_TECHNICAL_PROFILE.trend.smaPeriods.includes(200), true);
  assert.deepEqual(simpleMovingAverage(values, 3), [null, null, 2, 3, 4, 5]);
  assert.deepEqual(exponentialMovingAverage(values, 3), [null, null, 2, 3, 4, 5]);
  assert.deepEqual(movingAverageDisparity(values, simpleMovingAverage(values, 3)), [
    null,
    null,
    150,
    133.33333333,
    125,
    120,
  ]);
  assert.deepEqual(movingAverageSlope(simpleMovingAverage(values, 3), 2), [null, null, null, null, 100, 66.66666667]);
  assert.deepEqual(movingAverageAlignment({
    p2: [null, 2, 3, 4],
    p3: [null, null, 2, 3],
  }, [2, 3]), [null, null, "bullish", "bullish"]);
  assert.equal(relativeStrengthIndex(values, 3).at(-1), 100);
  assert.equal(movingAverageConvergenceDivergence(values, {
    fastPeriod: 2,
    slowPeriod: 3,
    signalPeriod: 2,
  }).histogram.at(-1), 0);
  assert.equal(calculateBollingerBands(values, {
    period: 3,
    standardDeviations: 2,
  }).middle.at(-1), 5);
  assert.deepEqual(ratioToMovingAverage(values, 3).slice(0, 4), [null, null, 1.5, 1.33333333]);
  assert.deepEqual(onBalanceVolume(values, [10, 20, 30, 40, 50, 60]), [0, 20, 50, 90, 140, 200]);
  assert.equal(stochasticOscillator(sampleCandles().toReversed(), {
    kPeriod: 3,
    kSmoothing: 2,
    dPeriod: 2,
  }).rawK.at(-1), 75);
  assert.equal(moneyFlowIndex(sampleCandles().toReversed(), 3).at(-1), 100);
  assert.equal(averageTrueRange(sampleCandles().toReversed(), 3).at(-1), 2);
  assert.equal(rollingStandardDeviation(values, 3).at(-1), 0.81649658);
  assert.equal(detectCandlePatterns(sampleCandles().toReversed()).at(-1).color, "bullish");
});

test("gets domestic stock indicators from MarketDataService candles", async () => {
  const fakeMarketData = {
    async getDomesticStockDailyCandles(broker, symbol, options) {
      assert.equal(broker, "kiwoom");
      assert.equal(symbol, "005930");
      assert.equal(options.count, 10);

      return candleResult({
        broker,
        symbol,
        interval: "1d",
        source: { broker, id: "ka10081", capabilityId: "marketData.domesticStock.dailyCandles" },
      });
    },
  };
  const service = new TechnicalIndicatorService({}, { marketData: fakeMarketData });
  const result = await service.getDomesticStockIndicators("kiwoom", "005930", {
    count: 10,
    smaPeriods: [3],
    emaPeriods: [3],
    rsiPeriod: 3,
    macd: { fastPeriod: 3, slowPeriod: 6, signalPeriod: 3 },
    bollingerBands: { period: 3, standardDeviations: 2 },
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "technical.domesticStock.indicators");
  assert.equal(result.id, "ka10081");
  assert.equal(result.data.latest.sma.p3, 18);
});

test("gets overseas stock indicators from OverseasStockMarketDataService candles", async () => {
  const fakeOverseasMarketData = {
    async getOverseasStockCandles(broker, identity) {
      assert.equal(broker, "ls");
      assert.equal(identity.symbol, "TSLA");

      return candleResult({
        broker,
        symbol: "TSLA",
        interval: "1d",
        source: { broker, id: "g3204", capabilityId: "overseasStock.marketData.candles" },
      });
    },
  };
  const service = new TechnicalIndicatorService({}, { overseasMarketData: fakeOverseasMarketData });
  const result = await service.getOverseasStockIndicators("ls", { symbol: "TSLA", exchangeCode: "82" }, {
    smaPeriods: [3],
    emaPeriods: [3],
    rsiPeriod: 3,
    macd: { fastPeriod: 3, slowPeriod: 6, signalPeriod: 3 },
    bollingerBands: { period: 3, standardDeviations: 2 },
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "overseasStock.technical.indicators");
  assert.equal(result.id, "g3204");
  assert.equal(result.data.latest.sma.p3, 18);
});

test("returns validation errors for invalid indicator input", () => {
  const service = new TechnicalIndicatorService();
  const result = service.calculateFromCandles("not-candles");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
});

function candleResult({ broker, symbol, interval, source }) {
  return {
    ok: true,
    broker,
    id: source.id,
    symbol,
    data: {
      broker,
      symbol,
      interval,
      candles: sampleCandles(),
      source,
    },
    raw: null,
    headers: {},
    status: 200,
  };
}

function sampleCandles() {
  return [
    candle("20260510", 19, 1900),
    candle("20260509", 18, 1800),
    candle("20260508", 17, 1700),
    candle("20260507", 16, 1600),
    candle("20260506", 15, 1500),
    candle("20260505", 14, 1400),
    candle("20260504", 13, 1300),
    candle("20260503", 12, 1200),
    candle("20260502", 11, 1100),
    candle("20260501", 10, 1000),
  ];
}

function candle(date, close, volume) {
  return {
    date,
    timestamp: date,
    open: close - 0.5,
    high: close + 1,
    low: close - 1,
    close,
    volume,
  };
}
