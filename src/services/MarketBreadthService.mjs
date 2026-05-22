import { BrokerError } from "../core/index.mjs";

const MARKET_BREADTH_CAPABILITY_ID = "marketBreadth.domesticMarket.indicators";

export class MarketBreadthService {
  calculateAdvanceDeclineLine(rows, options = {}) {
    try {
      return successResponse({
        market: options.market ?? null,
        data: calculateAdvanceDeclineLine(rows, options),
      });
    } catch (error) {
      return failureResponse({ market: options.market ?? null, error });
    }
  }

  calculateHighLowRatio(rows, options = {}) {
    try {
      return successResponse({
        market: options.market ?? null,
        data: calculateHighLowRatio(rows, options),
      });
    } catch (error) {
      return failureResponse({ market: options.market ?? null, error });
    }
  }

  calculateAboveMovingAverageRatio(candlesBySymbol, options = {}) {
    try {
      return successResponse({
        market: options.market ?? null,
        data: calculateAboveMovingAverageRatio(candlesBySymbol, options),
      });
    } catch (error) {
      return failureResponse({ market: options.market ?? null, error });
    }
  }
}

export function calculateAdvanceDeclineLine(rows, options = {}) {
  const normalizedRows = normalizeBreadthRows(rows);
  let cumulative = Number(options.initialValue ?? 0);
  const series = normalizedRows.map((row) => {
    const netAdvances = row.advancing - row.declining;
    cumulative += netAdvances;

    return {
      date: row.date,
      advancing: row.advancing,
      declining: row.declining,
      unchanged: row.unchanged,
      netAdvances,
      value: cumulative,
    };
  });

  return {
    market: options.market ?? null,
    series,
    latest: series.at(-1) ?? null,
    meta: {
      inputCount: Array.isArray(rows) ? rows.length : 0,
      outputCount: series.length,
    },
  };
}

export function calculateHighLowRatio(rows, options = {}) {
  const normalizedRows = normalizeHighLowRows(rows);
  const highCount = normalizedRows.filter((row) => row.isNewHigh).length;
  const lowCount = normalizedRows.filter((row) => row.isNewLow).length;
  const neutralCount = normalizedRows.length - highCount - lowCount;

  return {
    market: options.market ?? null,
    lookback: Number(options.lookback ?? 252),
    highCount,
    lowCount,
    neutralCount,
    universeSize: normalizedRows.length,
    ratio: lowCount === 0 ? null : roundNumber(highCount / lowCount),
    highShare: normalizedRows.length ? roundNumber(highCount / normalizedRows.length) : null,
    lowShare: normalizedRows.length ? roundNumber(lowCount / normalizedRows.length) : null,
    latest: {
      highCount,
      lowCount,
      ratio: lowCount === 0 ? null : roundNumber(highCount / lowCount),
    },
  };
}

export function calculateAboveMovingAverageRatio(candlesBySymbol, options = {}) {
  const period = normalizePeriod(options.period ?? 20, "period");
  const entries = normalizeCandlesBySymbol(candlesBySymbol);
  const items = entries.map(([symbol, candles]) => {
    const normalizedCandles = normalizeCandles(candles);
    const latest = normalizedCandles.at(-1) ?? null;
    const movingAverage = latestMovingAverage(normalizedCandles.map((candle) => candle.close), period);
    const above = latest && Number.isFinite(movingAverage) ? latest.close > movingAverage : null;

    return {
      symbol,
      latestClose: latest?.close ?? null,
      movingAverage,
      above,
    };
  });
  const comparable = items.filter((item) => item.above !== null);
  const aboveCount = comparable.filter((item) => item.above).length;

  return {
    market: options.market ?? null,
    period,
    aboveCount,
    belowOrEqualCount: comparable.length - aboveCount,
    comparableCount: comparable.length,
    universeSize: items.length,
    ratio: comparable.length ? roundNumber(aboveCount / comparable.length) : null,
    items,
    latest: {
      aboveCount,
      comparableCount: comparable.length,
      ratio: comparable.length ? roundNumber(aboveCount / comparable.length) : null,
    },
  };
}

function normalizeBreadthRows(rows) {
  if (!Array.isArray(rows)) {
    throw BrokerError.validation("rows must be an array", {
      details: { field: "rows" },
    });
  }

  return rows.map((row) => ({
    date: nullableString(row?.date),
    advancing: parseCount(row?.advancing ?? row?.advance ?? row?.rising),
    declining: parseCount(row?.declining ?? row?.decline ?? row?.falling),
    unchanged: parseCount(row?.unchanged ?? row?.steady ?? 0),
  }));
}

function normalizeHighLowRows(rows) {
  if (!Array.isArray(rows)) {
    throw BrokerError.validation("rows must be an array", {
      details: { field: "rows" },
    });
  }

  return rows.map((row) => {
    const close = parseNumber(row?.close);
    const high = parseNumber(row?.high52Week ?? row?.high ?? row?.lookbackHigh);
    const low = parseNumber(row?.low52Week ?? row?.low ?? row?.lookbackLow);

    return {
      symbol: nullableString(row?.symbol),
      close,
      high,
      low,
      isNewHigh: row?.isNewHigh ?? (Number.isFinite(close) && Number.isFinite(high) ? close >= high : false),
      isNewLow: row?.isNewLow ?? (Number.isFinite(close) && Number.isFinite(low) ? close <= low : false),
    };
  });
}

function normalizeCandlesBySymbol(value) {
  if (value instanceof Map) {
    return [...value.entries()];
  }

  if (Array.isArray(value)) {
    return value.map((item) => [item.symbol, item.candles]);
  }

  if (value && typeof value === "object") {
    return Object.entries(value);
  }

  throw BrokerError.validation("candlesBySymbol must be an object, Map, or array", {
    details: { field: "candlesBySymbol" },
  });
}

function normalizeCandles(candles) {
  if (!Array.isArray(candles)) {
    return [];
  }

  return candles
    .map((candle, index) => ({
      index,
      timestamp: nullableString(candle?.timestamp) ?? nullableString(candle?.date),
      close: parseNumber(candle?.close),
    }))
    .filter((candle) => candle.timestamp && Number.isFinite(candle.close))
    .sort((left, right) => left.timestamp.localeCompare(right.timestamp) || left.index - right.index);
}

function latestMovingAverage(values, period) {
  if (values.length < period) {
    return null;
  }

  const window = values.slice(-period);
  if (!window.every(Number.isFinite)) {
    return null;
  }

  return roundNumber(window.reduce((sum, value) => sum + value, 0) / period);
}

function normalizePeriod(value, field) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw BrokerError.validation(`${field} must be a positive integer`, {
      details: { field, value },
    });
  }

  return parsed;
}

function parseCount(value) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.trunc(Math.max(parsed, 0)) : 0;
}

function parseNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(String(value).replaceAll(",", "").replace(/^\+/, ""));
  return Number.isFinite(parsed) ? Math.abs(parsed) : null;
}

function nullableString(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value);
}

function roundNumber(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value * 1e8) / 1e8;
}

function successResponse({ market, data }) {
  return {
    ok: true,
    broker: null,
    capability: MARKET_BREADTH_CAPABILITY_ID,
    id: null,
    market,
    data,
    raw: null,
    headers: {},
    status: 0,
  };
}

function failureResponse({ market, error }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Market breadth service failed", {
        cause: error,
      });

  return {
    ok: false,
    broker: null,
    capability: MARKET_BREADTH_CAPABILITY_ID,
    id: null,
    market,
    data: null,
    raw: null,
    headers: {},
    status: brokerError.status ?? 0,
    error: brokerError,
  };
}
