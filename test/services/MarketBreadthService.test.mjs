import assert from "node:assert/strict";
import test from "node:test";

import {
  MarketBreadthService,
  calculateAboveMovingAverageRatio,
  calculateAdvanceDeclineLine,
  calculateHighLowRatio,
} from "../../src/index.mjs";
import { MarketBreadthService as MarketBreadthServiceFromPackage } from "security-api-reference/services";

test("exports MarketBreadthService through package service entry", () => {
  assert.equal(MarketBreadthServiceFromPackage, MarketBreadthService);
});

test("calculates advance decline line", () => {
  const result = calculateAdvanceDeclineLine([
    { date: "20260520", advancing: 500, declining: 300, unchanged: 50 },
    { date: "20260521", advancing: 350, declining: 450, unchanged: 60 },
    { date: "20260522", advancing: 600, declining: 250, unchanged: 40 },
  ]);

  assert.equal(result.series[0].netAdvances, 200);
  assert.equal(result.series[1].value, 100);
  assert.equal(result.latest.value, 450);
});

test("calculates high low ratio", () => {
  const result = calculateHighLowRatio([
    { symbol: "A", close: 100, high52Week: 100, low52Week: 50 },
    { symbol: "B", close: 50, high52Week: 120, low52Week: 50 },
    { symbol: "C", close: 80, high52Week: 100, low52Week: 60 },
  ]);

  assert.equal(result.highCount, 1);
  assert.equal(result.lowCount, 1);
  assert.equal(result.ratio, 1);
  assert.equal(result.highShare, 0.33333333);
});

test("calculates above moving average ratio", () => {
  const result = calculateAboveMovingAverageRatio({
    A: candles([10, 11, 12, 13, 14]),
    B: candles([14, 13, 12, 11, 10]),
    C: candles([10, 10, 10, 10, 10]),
  }, {
    period: 3,
  });

  assert.equal(result.aboveCount, 1);
  assert.equal(result.comparableCount, 3);
  assert.equal(result.ratio, 0.33333333);
  assert.equal(result.items.find((item) => item.symbol === "A").above, true);
  assert.equal(result.items.find((item) => item.symbol === "B").above, false);
});

test("wraps market breadth calculations in service responses", () => {
  const service = new MarketBreadthService();
  const result = service.calculateAdvanceDeclineLine([
    { date: "20260522", advancing: 10, declining: 5 },
  ], {
    market: "kospi",
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "marketBreadth.domesticMarket.indicators");
  assert.equal(result.market, "kospi");
  assert.equal(result.data.latest.value, 5);
});

test("returns validation errors for invalid market breadth input", () => {
  const service = new MarketBreadthService();
  const result = service.calculateAboveMovingAverageRatio(null);

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
});

function candles(closes) {
  return closes.map((close, index) => ({
    date: `202605${String(index + 1).padStart(2, "0")}`,
    close,
  }));
}
