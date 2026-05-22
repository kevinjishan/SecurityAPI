import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";
import { MarketContextService } from "./MarketContextService.mjs";
import { MarketDataService } from "./MarketDataService.mjs";

const DOMESTIC_CAPABILITY_ID = "relativeStrength.domesticStock.benchmark";

const DEFAULT_RELATIVE_STRENGTH_OPTIONS = Object.freeze({
  periods: [20, 60],
  epsilon: 0.000001,
});

export class RelativeStrengthService {
  constructor(clients = {}, dependencies = {}) {
    this.clients = clients;
    this.marketData = dependencies.marketData ?? new MarketDataService(clients);
    this.marketContext = dependencies.marketContext ?? new MarketContextService(clients);
  }

  calculateRelativeStrength(input = {}, options = {}) {
    try {
      const data = calculateRelativeStrength(input, options);

      return successResponse({
        broker: options.broker ?? null,
        symbol: options.symbol ?? null,
        benchmark: input.benchmark ?? options.benchmark ?? null,
        capabilityId: options.capabilityId ?? null,
        data,
      });
    } catch (error) {
      return failureResponse({
        broker: options.broker ?? "unknown",
        symbol: options.symbol ?? null,
        benchmark: input.benchmark ?? options.benchmark ?? null,
        capabilityId: options.capabilityId ?? null,
        error,
      });
    }
  }

  async getDomesticStockRelativeStrength(broker, symbol, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const capabilities = getCapabilities(normalizedBroker);

      if (!capabilities.supports(DOMESTIC_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          symbol,
          benchmark: options.benchmark ?? null,
          capabilityId: DOMESTIC_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${DOMESTIC_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: DOMESTIC_CAPABILITY_ID },
          }),
        });
      }

      const targetResult = await this.marketData.getDomesticStockDailyCandles(normalizedBroker, symbol, options);
      if (!targetResult.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol,
          benchmark: options.benchmark ?? null,
          capabilityId: DOMESTIC_CAPABILITY_ID,
          result: targetResult,
          error: targetResult.error,
        });
      }

      const benchmarkResult = await resolveBenchmarkCandles({
        broker: normalizedBroker,
        options,
        marketContext: this.marketContext,
      });
      if (!benchmarkResult.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol,
          benchmark: options.benchmark ?? null,
          capabilityId: DOMESTIC_CAPABILITY_ID,
          result: benchmarkResult,
          error: benchmarkResult.error,
        });
      }

      const data = calculateRelativeStrength({
        targetCandles: targetResult.data?.candles ?? [],
        benchmarkCandles: benchmarkResult.data?.candles ?? [],
        benchmark: normalizeBenchmark(options.benchmark),
      }, {
        ...options,
        broker: normalizedBroker,
        symbol,
      });

      return successResponse({
        broker: normalizedBroker,
        symbol,
        benchmark: data.benchmark,
        capabilityId: DOMESTIC_CAPABILITY_ID,
        result: targetResult,
        data: {
          ...data,
          sources: {
            target: targetResult.data?.source ?? null,
            benchmark: benchmarkResult.data?.source ?? null,
          },
        },
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol,
        benchmark: options.benchmark ?? null,
        capabilityId: DOMESTIC_CAPABILITY_ID,
        error,
      });
    }
  }

  async getDomesticStockRelativeStrengthVsBasket(broker, symbol, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const capabilities = getCapabilities(normalizedBroker);

      if (!capabilities.supports(DOMESTIC_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          symbol,
          benchmark: options.benchmark ?? null,
          capabilityId: DOMESTIC_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${DOMESTIC_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: DOMESTIC_CAPABILITY_ID },
          }),
        });
      }

      const targetResult = await this.marketData.getDomesticStockDailyCandles(normalizedBroker, symbol, options);
      if (!targetResult.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol,
          benchmark: options.benchmark ?? null,
          capabilityId: DOMESTIC_CAPABILITY_ID,
          result: targetResult,
          error: targetResult.error,
        });
      }

      const basketResult = await resolveBasketCandles({
        broker: normalizedBroker,
        targetSymbol: symbol,
        options,
        marketData: this.marketData,
      });
      if (!basketResult.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol,
          benchmark: options.benchmark ?? null,
          capabilityId: DOMESTIC_CAPABILITY_ID,
          result: basketResult,
          error: basketResult.error,
        });
      }

      const benchmark = normalizeBenchmark(options.benchmark ?? {
        type: "basket",
        code: options.basketCode ?? "basket",
        label: options.basketName ?? null,
      });
      const data = calculateRelativeStrength({
        targetCandles: targetResult.data?.candles ?? [],
        benchmarkCandles: basketResult.data?.candles ?? [],
        benchmark,
      }, {
        ...options,
        broker: normalizedBroker,
        symbol,
      });

      return successResponse({
        broker: normalizedBroker,
        symbol,
        benchmark: data.benchmark,
        capabilityId: DOMESTIC_CAPABILITY_ID,
        result: targetResult,
        data: {
          ...data,
          basket: basketResult.data?.basket ?? null,
          sources: {
            target: targetResult.data?.source ?? null,
            benchmark: basketResult.data?.source ?? null,
          },
        },
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol,
        benchmark: options.benchmark ?? null,
        capabilityId: DOMESTIC_CAPABILITY_ID,
        error,
      });
    }
  }
}

export function calculateRelativeStrength(input = {}, options = {}) {
  const periods = normalizePeriodList(options.periods ?? DEFAULT_RELATIVE_STRENGTH_OPTIONS.periods, "periods");
  const epsilon = normalizePositiveNumber(options.epsilon ?? DEFAULT_RELATIVE_STRENGTH_OPTIONS.epsilon, "epsilon");
  const targetCandles = normalizeCandles(input.targetCandles, "targetCandles");
  const benchmarkCandles = normalizeCandles(input.benchmarkCandles, "benchmarkCandles");
  const aligned = alignCandles(targetCandles, benchmarkCandles);
  const series = {};

  for (const period of periods) {
    series[periodKey(period)] = relativeStrengthSeries(aligned, period, epsilon);
  }

  return {
    broker: options.broker ?? null,
    symbol: options.symbol ?? null,
    benchmark: normalizeBenchmark(input.benchmark ?? options.benchmark),
    periods,
    series,
    latest: latestRelativeStrength(series),
    alignedCount: aligned.length,
    meta: {
      targetCount: targetCandles.length,
      benchmarkCount: benchmarkCandles.length,
      epsilon,
    },
  };
}

export function buildBasketBenchmarkCandles(candlesBySymbol, options = {}) {
  const entries = normalizeCandlesBySymbol(candlesBySymbol, "basketCandlesBySymbol");
  const weights = normalizeBasketWeights(options.weights ?? options.basketWeights, entries.map(([symbol]) => symbol));
  const normalizedEntries = entries.map(([symbol, candles]) => [symbol, normalizeCandles(candles, `basketCandlesBySymbol.${symbol}`)]);
  const commonDates = intersectDates(normalizedEntries.map(([, candles]) => candles));

  if (commonDates.length < 2) {
    throw BrokerError.validation("basketCandlesBySymbol must contain at least two common dates", {
      details: {
        field: "basketCandlesBySymbol",
        symbols: normalizedEntries.map(([symbol]) => symbol),
      },
    });
  }

  const candleMaps = new Map(normalizedEntries.map(([symbol, candles]) => [
    symbol,
    new Map(candles.map((candle) => [candle.timestamp ?? candle.date, candle])),
  ]));
  const baseCloses = new Map(normalizedEntries.map(([symbol]) => {
    const base = candleMaps.get(symbol).get(commonDates[0]);
    return [symbol, base?.close ?? null];
  }));
  const candles = commonDates.map((date) => {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [symbol] of normalizedEntries) {
      const baseClose = baseCloses.get(symbol);
      const candle = candleMaps.get(symbol).get(date);
      const weight = weights.get(symbol) ?? 1;

      if (Number.isFinite(baseClose) && baseClose > 0 && Number.isFinite(candle?.close) && weight > 0) {
        weightedSum += ((candle.close / baseClose) * 100) * weight;
        totalWeight += weight;
      }
    }

    return {
      date,
      timestamp: date,
      close: totalWeight > 0 ? roundNumber(weightedSum / totalWeight) : null,
    };
  }).filter((candle) => Number.isFinite(candle.close));

  return {
    benchmark: normalizeBenchmark(options.benchmark ?? {
      type: "basket",
      code: options.basketCode ?? "basket",
      label: options.basketName ?? null,
    }),
    symbols: normalizedEntries.map(([symbol]) => symbol),
    weighting: options.weighting ?? "equal",
    baseDate: candles[0]?.date ?? null,
    candles,
    meta: {
      inputSymbolCount: entries.length,
      outputCount: candles.length,
    },
  };
}

function relativeStrengthSeries(aligned, period, epsilon) {
  return aligned.map((row, index) => {
    const previous = aligned[index - period];
    if (!previous) {
      return null;
    }

    const targetReturn = returnPct(row.target.close, previous.target.close);
    const benchmarkReturn = returnPct(row.benchmark.close, previous.benchmark.close);

    if (!Number.isFinite(targetReturn) || !Number.isFinite(benchmarkReturn)) {
      return null;
    }

    const ratio = Math.abs(benchmarkReturn) <= epsilon ? null : roundNumber(targetReturn / benchmarkReturn);
    const spread = roundNumber(targetReturn - benchmarkReturn);

    return {
      date: row.date,
      timestamp: row.timestamp,
      targetClose: row.target.close,
      benchmarkClose: row.benchmark.close,
      targetReturn,
      benchmarkReturn,
      spread,
      ratio,
      outperforming: spread > 0,
      direction: spread > 0 ? "outperforming" : spread < 0 ? "underperforming" : "neutral",
    };
  });
}

async function resolveBenchmarkCandles({ broker, options, marketContext }) {
  if (Array.isArray(options.benchmarkCandles)) {
    return {
      ok: true,
      broker,
      id: null,
      data: {
        candles: options.benchmarkCandles,
        source: {
          broker,
          id: "provided",
          capabilityId: DOMESTIC_CAPABILITY_ID,
        },
      },
      raw: null,
      headers: {},
      status: 0,
    };
  }

  const benchmark = normalizeBenchmark(options.benchmark);
  if (benchmark.type !== "index") {
    return failureResponse({
      broker,
      benchmark,
      capabilityId: DOMESTIC_CAPABILITY_ID,
      error: BrokerError.validation("benchmarkCandles are required for non-index relative strength benchmarks", {
        broker,
        details: { benchmark },
      }),
    });
  }

  return marketContext.getDomesticIndexDailyCandles(broker, benchmark.code, options);
}

async function resolveBasketCandles({ broker, targetSymbol, options, marketData }) {
  const symbols = normalizeBasketSymbols(options.basketSymbols, {
    excludeSymbol: options.excludeTargetFromBasket ? targetSymbol : null,
  });
  const provided = normalizeOptionalCandlesBySymbol(options.basketCandlesBySymbol);
  const candlesBySymbol = new Map(provided);

  for (const symbol of symbols) {
    if (candlesBySymbol.has(symbol)) {
      continue;
    }

    const result = await marketData.getDomesticStockDailyCandles(broker, symbol, options.basketCandleOptions ?? options);
    if (!result.ok) {
      return failureResponse({
        broker,
        symbol,
        benchmark: options.benchmark ?? null,
        capabilityId: DOMESTIC_CAPABILITY_ID,
        result,
        error: result.error,
      });
    }

    candlesBySymbol.set(symbol, result.data?.candles ?? []);
  }

  if (candlesBySymbol.size === 0) {
    return failureResponse({
      broker,
      benchmark: options.benchmark ?? null,
      capabilityId: DOMESTIC_CAPABILITY_ID,
      error: BrokerError.validation("basketSymbols or basketCandlesBySymbol is required", {
        broker,
        details: { field: "basketSymbols" },
      }),
    });
  }

  const basket = buildBasketBenchmarkCandles(candlesBySymbol, options);
  return {
    ok: true,
    broker,
    id: null,
    benchmark: basket.benchmark,
    data: {
      candles: basket.candles,
      basket,
      source: {
        broker,
        id: "basket",
        capabilityId: DOMESTIC_CAPABILITY_ID,
        symbols: basket.symbols,
        weighting: basket.weighting,
      },
    },
    raw: null,
    headers: {},
    status: 0,
  };
}

function alignCandles(targetCandles, benchmarkCandles) {
  const benchmarkByDate = new Map();
  for (const candle of benchmarkCandles) {
    if (candle.timestamp || candle.date) {
      benchmarkByDate.set(candle.timestamp ?? candle.date, candle);
    }
  }

  return targetCandles
    .map((target) => {
      const key = target.timestamp ?? target.date;
      const benchmark = benchmarkByDate.get(key);
      return benchmark ? {
        date: target.date ?? benchmark.date ?? null,
        timestamp: key,
        target,
        benchmark,
      } : null;
    })
    .filter(Boolean);
}

function latestRelativeStrength(series) {
  return Object.fromEntries(
    Object.entries(series).map(([key, values]) => [key, latestValue(values)]),
  );
}

function latestValue(values) {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index]) {
      return values[index];
    }
  }

  return null;
}

function normalizeCandles(candles, field) {
  if (!Array.isArray(candles)) {
    throw BrokerError.validation(`${field} must be an array`, {
      details: { field },
    });
  }

  return candles
    .map((candle, index) => ({
      index,
      date: nullableString(candle?.date),
      timestamp: nullableString(candle?.timestamp) ?? nullableString(candle?.date),
      close: parseNumber(candle?.close),
      raw: candle,
    }))
    .filter((candle) => (candle.timestamp || candle.date) && Number.isFinite(candle.close))
    .sort((left, right) => {
      const leftKey = left.timestamp ?? left.date ?? "";
      const rightKey = right.timestamp ?? right.date ?? "";
      return leftKey.localeCompare(rightKey) || left.index - right.index;
    });
}

function normalizeCandlesBySymbol(value, field) {
  if (value instanceof Map) {
    return [...value.entries()].map(([symbol, candles]) => [normalizeSymbol(symbol, field), candles]);
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (Array.isArray(item)) {
        return [normalizeSymbol(item[0], `${field}.${index}`), item[1]];
      }

      return [normalizeSymbol(item?.symbol, `${field}.${index}.symbol`), item?.candles];
    });
  }

  if (value && typeof value === "object") {
    return Object.entries(value).map(([symbol, candles]) => [normalizeSymbol(symbol, field), candles]);
  }

  throw BrokerError.validation(`${field} must be an object, Map, or array`, {
    details: { field },
  });
}

function normalizeOptionalCandlesBySymbol(value) {
  if (!value) {
    return [];
  }

  return normalizeCandlesBySymbol(value, "basketCandlesBySymbol");
}

function normalizeBasketSymbols(value, { excludeSymbol = null } = {}) {
  const symbols = Array.isArray(value) ? value.map((symbol) => normalizeSymbol(symbol, "basketSymbols")) : [];
  const excluded = excludeSymbol ? normalizeSymbol(excludeSymbol, "excludeTargetFromBasket") : null;
  return [...new Set(symbols)].filter((symbol) => symbol !== excluded);
}

function normalizeSymbol(value, field) {
  const symbol = String(value ?? "").trim();
  if (!symbol) {
    throw BrokerError.validation(`${field} must contain non-empty symbols`, {
      details: { field, value },
    });
  }

  return symbol;
}

function normalizeBasketWeights(value, symbols) {
  if (!value) {
    return new Map(symbols.map((symbol) => [symbol, 1]));
  }

  const entries = value instanceof Map
    ? [...value.entries()]
    : Array.isArray(value)
      ? value.map((item) => Array.isArray(item) ? item : [item?.symbol, item?.weight])
      : Object.entries(value);
  const weights = new Map();

  for (const [symbolValue, weightValue] of entries) {
    const symbol = normalizeSymbol(symbolValue, "basketWeights");
    const weight = Number(weightValue);
    if (!Number.isFinite(weight) || weight <= 0) {
      throw BrokerError.validation("basketWeights must contain positive numbers", {
        details: { field: "basketWeights", symbol, weight: weightValue },
      });
    }
    weights.set(symbol, weight);
  }

  return new Map(symbols.map((symbol) => [symbol, weights.get(symbol) ?? 1]));
}

function intersectDates(candleLists) {
  if (!candleLists.length) {
    return [];
  }

  const [first, ...rest] = candleLists.map((candles) => new Set(candles.map((candle) => candle.timestamp ?? candle.date)));
  return [...first]
    .filter((date) => rest.every((set) => set.has(date)))
    .sort((left, right) => left.localeCompare(right));
}

function normalizeBenchmark(value) {
  if (!value) {
    return { type: "index", code: "kospi" };
  }

  if (typeof value === "string") {
    return { type: "index", code: value };
  }

  return {
    type: value.type ?? "index",
    code: value.code ?? value.symbol ?? "kospi",
    label: value.label ?? null,
  };
}

function returnPct(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) {
    return null;
  }

  return roundNumber(((current / previous) - 1) * 100);
}

function normalizePeriodList(values, field) {
  const list = Array.isArray(values) ? values : [values];
  const periods = list.map((value) => normalizePeriod(value, field));
  return [...new Set(periods)].sort((left, right) => left - right);
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

function normalizePositiveNumber(value, field) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw BrokerError.validation(`${field} must be a positive number`, {
      details: { field, value },
    });
  }

  return parsed;
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

function periodKey(period) {
  return `p${period}`;
}

function roundNumber(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  return Math.round(value * 1e8) / 1e8;
}

function successResponse({ broker, symbol, benchmark, capabilityId, result, data }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: result?.id ?? null,
    symbol,
    benchmark,
    data,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? 0,
    continuation: result?.continuation,
  };
}

function failureResponse({ broker, symbol, benchmark, capabilityId, result, error }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Relative strength service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: result?.id ?? null,
    symbol,
    benchmark,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
}
