import test from "node:test";
import assert from "node:assert/strict";

import {
  CANDLE_CAPABILITY_IDS,
  weeklyPeriodCode,
  classifyCandleInterval,
} from "../../src/services/candleSupport.mjs";

test("capability id map covers day/week/month/minute", () => {
  assert.equal(CANDLE_CAPABILITY_IDS["1d"], "marketData.domesticStock.dailyCandles");
  assert.equal(CANDLE_CAPABILITY_IDS["1w"], "marketData.domesticStock.weeklyCandles");
  assert.equal(CANDLE_CAPABILITY_IDS["1mo"], "marketData.domesticStock.monthlyCandles");
  assert.equal(CANDLE_CAPABILITY_IDS.minute, "marketData.domesticStock.minuteCandles");
});

test("weeklyPeriodCode maps ls and kis", () => {
  assert.equal(weeklyPeriodCode("ls"), "3");
  assert.equal(weeklyPeriodCode("kis"), "W");
});

test("classifyCandleInterval recognizes period intervals and aliases", () => {
  assert.deepEqual(classifyCandleInterval("1w"), { kind: "period", interval: "1w", minutes: null });
  assert.deepEqual(classifyCandleInterval("weekly"), { kind: "period", interval: "1w", minutes: null });
  assert.deepEqual(classifyCandleInterval("1d"), { kind: "period", interval: "1d", minutes: null });
  assert.deepEqual(classifyCandleInterval("monthly"), { kind: "period", interval: "1mo", minutes: null });
});

test("classifyCandleInterval recognizes minute intervals", () => {
  assert.deepEqual(classifyCandleInterval("5m"), { kind: "minute", interval: "5m", minutes: 5 });
  assert.deepEqual(classifyCandleInterval("60m"), { kind: "minute", interval: "60m", minutes: 60 });
});

test("classifyCandleInterval flags unsupported and missing intervals", () => {
  assert.equal(classifyCandleInterval("1y").kind, "unsupported");
  assert.equal(classifyCandleInterval("tick").kind, "unsupported");
  assert.equal(classifyCandleInterval(undefined).kind, "unsupported");
});
