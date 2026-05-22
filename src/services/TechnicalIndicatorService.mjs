import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";
import { MarketDataService } from "./MarketDataService.mjs";
import { OverseasStockMarketDataService } from "./OverseasStockMarketDataService.mjs";

const DOMESTIC_CAPABILITY_ID = "technical.domesticStock.indicators";
const OVERSEAS_CAPABILITY_ID = "overseasStock.technical.indicators";

export const DEFAULT_TECHNICAL_PROFILE = Object.freeze({
  trend: {
    smaPeriods: [5, 20, 60, 120, 200],
    emaPeriods: [12, 26],
    disparityPeriods: [20, 60],
    maAlignmentPeriods: [5, 20, 60, 120],
    slope: {
      periods: [20, 60],
      lookback: 5,
    },
  },
  momentum: {
    rsiPeriod: 14,
    macd: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
    },
    stochastic: {
      kPeriod: 14,
      kSmoothing: 3,
      dPeriod: 3,
    },
  },
  volume: {
    movingAveragePeriods: [20],
    ratioPeriod: 20,
    valueRatioPeriod: 20,
    mfiPeriod: 14,
  },
  volatility: {
    atrPeriod: 14,
    bollingerBands: {
      period: 20,
      standardDeviations: 2,
    },
    standardDeviationPeriod: 20,
  },
  thresholds: {
    overheatedDisparity20: 115,
    rsiOverbought: 70,
    rsiOversold: 30,
    earlyTrendVolumeRatio: 1.5,
    alertValueRatio: 3,
    atrStopMultiplier: 1.5,
    longBodyBodyToRangeRatio: 0.7,
    dojiBodyToRangeRatio: 0.1,
    hammerShadowToBodyRatio: 2,
  },
});

const DEFAULT_INDICATOR_OPTIONS = DEFAULT_TECHNICAL_PROFILE;

export class TechnicalIndicatorService {
  constructor(clients = {}, dependencies = {}) {
    this.clients = clients;
    this.marketData = dependencies.marketData ?? new MarketDataService(clients);
    this.overseasMarketData = dependencies.overseasMarketData ?? new OverseasStockMarketDataService(clients);
  }

  calculateFromCandles(candles, options = {}) {
    try {
      return successResponse({
        broker: options.broker ?? null,
        symbol: options.symbol ?? null,
        interval: options.interval ?? null,
        capabilityId: options.capabilityId ?? null,
        source: options.source ?? null,
        data: calculateTechnicalIndicators(candles, options),
      });
    } catch (error) {
      return failureResponse({
        broker: options.broker ?? "unknown",
        symbol: options.symbol ?? null,
        interval: options.interval ?? null,
        capabilityId: options.capabilityId ?? null,
        error,
      });
    }
  }

  async getDomesticStockIndicators(broker, symbol, options = {}) {
    return this.#requestIndicators({
      broker,
      symbol,
      options,
      capabilityId: DOMESTIC_CAPABILITY_ID,
      requestCandles: () => {
        if (options.interval === "minute" || options.intervalMinutes) {
          return this.marketData.getDomesticStockMinuteCandles(broker, symbol, options);
        }

        return this.marketData.getDomesticStockDailyCandles(broker, symbol, options);
      },
    });
  }

  async getOverseasStockIndicators(broker, identity, options = {}) {
    const symbol = normalizeOverseasSymbol(identity);

    return this.#requestIndicators({
      broker,
      symbol,
      options,
      capabilityId: OVERSEAS_CAPABILITY_ID,
      requestCandles: () => this.overseasMarketData.getOverseasStockCandles(broker, identity, options),
    });
  }

  async #requestIndicators({ broker, symbol, options, capabilityId, requestCandles }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const capabilities = getCapabilities(normalizedBroker);

      if (!capabilities.supports(capabilityId)) {
        return failureResponse({
          broker: normalizedBroker,
          symbol,
          capabilityId,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${capabilityId}`, {
            broker: normalizedBroker,
            details: { capabilityId },
          }),
        });
      }

      const candleResult = await requestCandles();
      if (!candleResult.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol,
          interval: options.interval ?? null,
          capabilityId,
          error: candleResult.error,
          result: candleResult,
        });
      }

      const candles = candleResult.data?.candles ?? [];
      const data = calculateTechnicalIndicators(candles, {
        ...options,
        broker: normalizedBroker,
        symbol,
        interval: candleResult.data?.interval ?? options.interval ?? null,
        source: candleResult.data?.source ?? null,
      });

      return successResponse({
        broker: normalizedBroker,
        symbol,
        interval: data.interval,
        capabilityId,
        source: candleResult.data?.source ?? null,
        result: candleResult,
        data,
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol,
        interval: options.interval ?? null,
        capabilityId,
        error,
      });
    }
  }
}

export function calculateTechnicalIndicators(candles, options = {}) {
  const normalizedCandles = normalizeCandles(candles, options);
  const closes = normalizedCandles.map((candle) => candle.close);
  const highs = normalizedCandles.map((candle) => candle.high);
  const lows = normalizedCandles.map((candle) => candle.low);
  const volumes = normalizedCandles.map((candle) => candle.volume);
  const values = normalizedCandles.map((candle) => candle.value);
  const config = normalizeIndicatorOptions(options);
  const sma = Object.fromEntries(config.trend.smaPeriods.map((period) => [periodKey(period), simpleMovingAverage(closes, period)]));
  const ema = Object.fromEntries(config.trend.emaPeriods.map((period) => [periodKey(period), exponentialMovingAverage(closes, period)]));
  const disparity = Object.fromEntries(
    config.trend.disparityPeriods.map((period) => [
      periodKey(period),
      movingAverageDisparity(closes, sma[periodKey(period)] ?? simpleMovingAverage(closes, period)),
    ]),
  );
  const maSlope = Object.fromEntries(
    config.trend.slope.periods.map((period) => [
      periodKey(period),
      movingAverageSlope(sma[periodKey(period)] ?? simpleMovingAverage(closes, period), config.trend.slope.lookback),
    ]),
  );
  const maAlignment = movingAverageAlignment(sma, config.trend.maAlignmentPeriods);
  const rsi = relativeStrengthIndex(closes, config.momentum.rsiPeriod);
  const macd = movingAverageConvergenceDivergence(closes, config.momentum.macd);
  const stochastic = stochasticOscillator(normalizedCandles, config.momentum.stochastic);
  const volumeMovingAverage = Object.fromEntries(
    config.volume.movingAveragePeriods.map((period) => [periodKey(period), simpleMovingAverage(volumes, period)]),
  );
  const volumeRatio = ratioToMovingAverage(volumes, config.volume.ratioPeriod);
  const valueRatio = ratioToMovingAverage(values, config.volume.valueRatioPeriod);
  const obv = onBalanceVolume(closes, volumes);
  const mfi = moneyFlowIndex(normalizedCandles, config.volume.mfiPeriod);
  const atr = averageTrueRange(normalizedCandles, config.volatility.atrPeriod);
  const bollingerBands = calculateBollingerBands(closes, config.volatility.bollingerBands);
  const standardDeviation = rollingStandardDeviation(closes, config.volatility.standardDeviationPeriod);
  const candlePatterns = detectCandlePatterns(normalizedCandles, config.thresholds);
  const volumeSma = Object.fromEntries(
    config.trend.smaPeriods.map((period) => [periodKey(period), simpleMovingAverage(volumes, period)]),
  );
  const latest = latestIndicatorSnapshot({
    candles: normalizedCandles,
    sma,
    ema,
    disparity,
    maSlope,
    maAlignment,
    rsi,
    macd,
    stochastic,
    volumeMovingAverage,
    volumeRatio,
    valueRatio,
    obv,
    mfi,
    atr,
    bollingerBands,
    standardDeviation,
    candlePatterns,
    volumeSma,
    thresholds: config.thresholds,
  });

  return {
    broker: options.broker ?? null,
    symbol: options.symbol ?? null,
    interval: options.interval ?? null,
    profile: config,
    candles: normalizedCandles,
    indicators: {
      trend: {
        sma,
        ema,
        disparity,
        maAlignment,
        maSlope,
      },
      momentum: {
        rsi: {
          period: config.momentum.rsiPeriod,
          values: rsi,
        },
        macd,
        stochastic,
      },
      volume: {
        movingAverage: volumeMovingAverage,
        ratio: {
          period: config.volume.ratioPeriod,
          values: volumeRatio,
        },
        valueRatio: {
          period: config.volume.valueRatioPeriod,
          values: valueRatio,
        },
        obv,
        mfi: {
          period: config.volume.mfiPeriod,
          values: mfi,
        },
      },
      volatility: {
        atr: {
          period: config.volatility.atrPeriod,
          values: atr,
        },
        bollingerBands,
        standardDeviation: {
          period: config.volatility.standardDeviationPeriod,
          values: standardDeviation,
        },
      },
      candlePatterns,
      sma,
      ema,
      disparity,
      maAlignment,
      maSlope,
      rsi: {
        period: config.momentum.rsiPeriod,
        values: rsi,
      },
      macd,
      stochastic,
      bollingerBands,
      volumeSma,
      volumeMovingAverage,
      volumeRatio,
      valueRatio,
      obv,
      mfi,
      atr,
      standardDeviation,
    },
    latest,
    source: options.source ?? null,
    meta: {
      inputCount: Array.isArray(candles) ? candles.length : 0,
      outputCount: normalizedCandles.length,
      sorted: options.sort ?? "asc",
      requiredWarmup: requiredWarmup(config),
      config,
    },
  };
}

export function simpleMovingAverage(values, period) {
  const normalizedPeriod = normalizePeriod(period, "period");
  const normalizedValues = normalizeNumberSeries(values);
  const output = Array(normalizedValues.length).fill(null);
  let sum = 0;
  let count = 0;

  for (let index = 0; index < normalizedValues.length; index += 1) {
    const value = normalizedValues[index];
    if (Number.isFinite(value)) {
      sum += value;
      count += 1;
    }

    if (index >= normalizedPeriod) {
      const previous = normalizedValues[index - normalizedPeriod];
      if (Number.isFinite(previous)) {
        sum -= previous;
        count -= 1;
      }
    }

    if (index >= normalizedPeriod - 1 && count === normalizedPeriod) {
      output[index] = roundNumber(sum / normalizedPeriod);
    }
  }

  return output;
}

export function exponentialMovingAverage(values, period) {
  const normalizedPeriod = normalizePeriod(period, "period");
  const normalizedValues = normalizeNumberSeries(values);
  const output = Array(normalizedValues.length).fill(null);
  const multiplier = 2 / (normalizedPeriod + 1);
  const seed = [];
  let ema = null;

  for (let index = 0; index < normalizedValues.length; index += 1) {
    const value = normalizedValues[index];
    if (!Number.isFinite(value)) {
      continue;
    }

    if (ema === null) {
      seed.push(value);
      if (seed.length === normalizedPeriod) {
        ema = seed.reduce((sum, item) => sum + item, 0) / normalizedPeriod;
        output[index] = roundNumber(ema);
      }
      continue;
    }

    ema = (value - ema) * multiplier + ema;
    output[index] = roundNumber(ema);
  }

  return output;
}

export function relativeStrengthIndex(values, period = DEFAULT_INDICATOR_OPTIONS.rsiPeriod) {
  const normalizedPeriod = normalizePeriod(period, "period");
  const normalizedValues = normalizeNumberSeries(values);
  const output = Array(normalizedValues.length).fill(null);

  if (normalizedValues.length <= normalizedPeriod) {
    return output;
  }

  let averageGain = 0;
  let averageLoss = 0;

  for (let index = 1; index <= normalizedPeriod; index += 1) {
    const change = normalizedValues[index] - normalizedValues[index - 1];
    if (!Number.isFinite(change)) {
      return output;
    }

    if (change >= 0) {
      averageGain += change;
    } else {
      averageLoss += Math.abs(change);
    }
  }

  averageGain /= normalizedPeriod;
  averageLoss /= normalizedPeriod;
  output[normalizedPeriod] = roundNumber(rsiValue(averageGain, averageLoss));

  for (let index = normalizedPeriod + 1; index < normalizedValues.length; index += 1) {
    const change = normalizedValues[index] - normalizedValues[index - 1];
    if (!Number.isFinite(change)) {
      continue;
    }

    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    averageGain = ((averageGain * (normalizedPeriod - 1)) + gain) / normalizedPeriod;
    averageLoss = ((averageLoss * (normalizedPeriod - 1)) + loss) / normalizedPeriod;
    output[index] = roundNumber(rsiValue(averageGain, averageLoss));
  }

  return output;
}

export function movingAverageConvergenceDivergence(values, options = {}) {
  const fastPeriod = normalizePeriod(options.fastPeriod ?? DEFAULT_INDICATOR_OPTIONS.macd.fastPeriod, "fastPeriod");
  const slowPeriod = normalizePeriod(options.slowPeriod ?? DEFAULT_INDICATOR_OPTIONS.macd.slowPeriod, "slowPeriod");
  const signalPeriod = normalizePeriod(options.signalPeriod ?? DEFAULT_INDICATOR_OPTIONS.macd.signalPeriod, "signalPeriod");

  if (fastPeriod >= slowPeriod) {
    throw BrokerError.validation("MACD fastPeriod must be lower than slowPeriod", {
      details: { fastPeriod, slowPeriod },
    });
  }

  const fast = exponentialMovingAverage(values, fastPeriod);
  const slow = exponentialMovingAverage(values, slowPeriod);
  const line = fast.map((fastValue, index) => {
    const slowValue = slow[index];
    return Number.isFinite(fastValue) && Number.isFinite(slowValue)
      ? roundNumber(fastValue - slowValue)
      : null;
  });
  const signal = exponentialMovingAverage(line, signalPeriod);
  const histogram = line.map((lineValue, index) => {
    const signalValue = signal[index];
    return Number.isFinite(lineValue) && Number.isFinite(signalValue)
      ? roundNumber(lineValue - signalValue)
      : null;
  });

  return {
    fastPeriod,
    slowPeriod,
    signalPeriod,
    line,
    signal,
    histogram,
  };
}

export function calculateBollingerBands(values, options = {}) {
  const period = normalizePeriod(options.period ?? DEFAULT_INDICATOR_OPTIONS.bollingerBands.period, "period");
  const standardDeviations = normalizePositiveNumber(
    options.standardDeviations ?? DEFAULT_INDICATOR_OPTIONS.bollingerBands.standardDeviations,
    "standardDeviations",
  );
  const normalizedValues = normalizeNumberSeries(values);
  const middle = simpleMovingAverage(normalizedValues, period);
  const upper = Array(normalizedValues.length).fill(null);
  const lower = Array(normalizedValues.length).fill(null);
  const width = Array(normalizedValues.length).fill(null);

  for (let index = period - 1; index < normalizedValues.length; index += 1) {
    const window = normalizedValues.slice(index - period + 1, index + 1);
    if (!window.every(Number.isFinite) || !Number.isFinite(middle[index])) {
      continue;
    }

    const deviation = standardDeviation(window);
    upper[index] = roundNumber(middle[index] + standardDeviations * deviation);
    lower[index] = roundNumber(middle[index] - standardDeviations * deviation);
    width[index] = middle[index] === 0 ? null : roundNumber((upper[index] - lower[index]) / middle[index]);
  }

  return {
    period,
    standardDeviations,
    middle,
    upper,
    lower,
    width,
  };
}

export function movingAverageDisparity(values, movingAverageValues) {
  const normalizedValues = normalizeNumberSeries(values);
  const normalizedMovingAverage = normalizeNumberSeries(movingAverageValues);

  return normalizedValues.map((value, index) => {
    const movingAverage = normalizedMovingAverage[index];
    return Number.isFinite(value) && Number.isFinite(movingAverage) && movingAverage !== 0
      ? roundNumber((value / movingAverage) * 100)
      : null;
  });
}

export function movingAverageSlope(values, lookback = DEFAULT_TECHNICAL_PROFILE.trend.slope.lookback) {
  const normalizedLookback = normalizePeriod(lookback, "lookback");
  const normalizedValues = normalizeNumberSeries(values);

  return normalizedValues.map((value, index) => {
    const previous = normalizedValues[index - normalizedLookback];
    return Number.isFinite(value) && Number.isFinite(previous) && previous !== 0
      ? roundNumber(((value / previous) - 1) * 100)
      : null;
  });
}

export function movingAverageAlignment(seriesByPeriod, periods = DEFAULT_TECHNICAL_PROFILE.trend.maAlignmentPeriods) {
  const normalizedPeriods = normalizePeriodList(periods, "maAlignmentPeriods");
  const keys = normalizedPeriods.map(periodKey);
  const length = Math.max(0, ...keys.map((key) => seriesByPeriod[key]?.length ?? 0));

  return Array.from({ length }, (_, index) => {
    const values = keys.map((key) => seriesByPeriod[key]?.[index] ?? null);
    if (!values.every(Number.isFinite)) {
      return null;
    }

    const bullish = values.every((value, valueIndex) => valueIndex === 0 || values[valueIndex - 1] > value);
    const bearish = values.every((value, valueIndex) => valueIndex === 0 || values[valueIndex - 1] < value);

    if (bullish) {
      return "bullish";
    }

    if (bearish) {
      return "bearish";
    }

    return "mixed";
  });
}

export function stochasticOscillator(candles, options = {}) {
  const kPeriod = normalizePeriod(options.kPeriod ?? DEFAULT_TECHNICAL_PROFILE.momentum.stochastic.kPeriod, "kPeriod");
  const kSmoothing = normalizePeriod(
    options.kSmoothing ?? DEFAULT_TECHNICAL_PROFILE.momentum.stochastic.kSmoothing,
    "kSmoothing",
  );
  const dPeriod = normalizePeriod(options.dPeriod ?? DEFAULT_TECHNICAL_PROFILE.momentum.stochastic.dPeriod, "dPeriod");
  const normalizedCandles = normalizeCandles(candles, { sort: "none" });
  const rawK = Array(normalizedCandles.length).fill(null);

  for (let index = kPeriod - 1; index < normalizedCandles.length; index += 1) {
    const window = normalizedCandles.slice(index - kPeriod + 1, index + 1);
    const highs = window.map((candle) => candle.high);
    const lows = window.map((candle) => candle.low);
    const close = normalizedCandles[index].close;

    if (!highs.every(Number.isFinite) || !lows.every(Number.isFinite) || !Number.isFinite(close)) {
      continue;
    }

    const highestHigh = Math.max(...highs);
    const lowestLow = Math.min(...lows);
    rawK[index] = highestHigh === lowestLow
      ? 50
      : roundNumber(((close - lowestLow) / (highestHigh - lowestLow)) * 100);
  }

  const slowK = simpleMovingAverage(rawK, kSmoothing);
  const d = simpleMovingAverage(slowK, dPeriod);

  return {
    kPeriod,
    kSmoothing,
    dPeriod,
    rawK,
    slowK,
    d,
  };
}

export function ratioToMovingAverage(values, period) {
  const normalizedValues = normalizeNumberSeries(values);
  const movingAverage = simpleMovingAverage(normalizedValues, period);

  return normalizedValues.map((value, index) => {
    const averageValue = movingAverage[index];
    return Number.isFinite(value) && Number.isFinite(averageValue) && averageValue !== 0
      ? roundNumber(value / averageValue)
      : null;
  });
}

export function onBalanceVolume(closes, volumes) {
  const normalizedCloses = normalizeNumberSeries(closes);
  const normalizedVolumes = normalizeNumberSeries(volumes);
  const output = Array(normalizedCloses.length).fill(null);
  let current = 0;

  for (let index = 0; index < normalizedCloses.length; index += 1) {
    const close = normalizedCloses[index];
    const volume = normalizedVolumes[index];
    if (!Number.isFinite(close) || !Number.isFinite(volume)) {
      continue;
    }

    if (index === 0 || !Number.isFinite(normalizedCloses[index - 1])) {
      output[index] = current;
      continue;
    }

    if (close > normalizedCloses[index - 1]) {
      current += volume;
    } else if (close < normalizedCloses[index - 1]) {
      current -= volume;
    }

    output[index] = roundNumber(current);
  }

  return output;
}

export function moneyFlowIndex(candles, period = DEFAULT_TECHNICAL_PROFILE.volume.mfiPeriod) {
  const normalizedPeriod = normalizePeriod(period, "period");
  const normalizedCandles = normalizeCandles(candles, { sort: "none" });
  const typicalPrices = normalizedCandles.map((candle) => {
    if (![candle.high, candle.low, candle.close].every(Number.isFinite)) {
      return null;
    }

    return (candle.high + candle.low + candle.close) / 3;
  });
  const positiveFlows = Array(normalizedCandles.length).fill(0);
  const negativeFlows = Array(normalizedCandles.length).fill(0);
  const output = Array(normalizedCandles.length).fill(null);

  for (let index = 1; index < normalizedCandles.length; index += 1) {
    const typicalPrice = typicalPrices[index];
    const previousTypicalPrice = typicalPrices[index - 1];
    const volume = normalizedCandles[index].volume;
    if (!Number.isFinite(typicalPrice) || !Number.isFinite(previousTypicalPrice) || !Number.isFinite(volume)) {
      continue;
    }

    const rawMoneyFlow = typicalPrice * volume;
    if (typicalPrice > previousTypicalPrice) {
      positiveFlows[index] = rawMoneyFlow;
    } else if (typicalPrice < previousTypicalPrice) {
      negativeFlows[index] = rawMoneyFlow;
    }
  }

  for (let index = normalizedPeriod; index < normalizedCandles.length; index += 1) {
    const positive = positiveFlows.slice(index - normalizedPeriod + 1, index + 1).reduce((sum, value) => sum + value, 0);
    const negative = negativeFlows.slice(index - normalizedPeriod + 1, index + 1).reduce((sum, value) => sum + value, 0);

    if (negative === 0) {
      output[index] = positive === 0 ? 50 : 100;
    } else {
      const moneyRatio = positive / negative;
      output[index] = roundNumber(100 - (100 / (1 + moneyRatio)));
    }
  }

  return output;
}

export function averageTrueRange(candles, period = DEFAULT_TECHNICAL_PROFILE.volatility.atrPeriod) {
  const normalizedPeriod = normalizePeriod(period, "period");
  const normalizedCandles = normalizeCandles(candles, { sort: "none" });
  const trueRanges = normalizedCandles.map((candle, index) => {
    if (![candle.high, candle.low].every(Number.isFinite)) {
      return null;
    }

    if (index === 0 || !Number.isFinite(normalizedCandles[index - 1]?.close)) {
      return roundNumber(candle.high - candle.low);
    }

    const previousClose = normalizedCandles[index - 1].close;
    return roundNumber(Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - previousClose),
      Math.abs(candle.low - previousClose),
    ));
  });
  const output = Array(normalizedCandles.length).fill(null);
  let atr = null;

  for (let index = normalizedPeriod - 1; index < trueRanges.length; index += 1) {
    const trueRange = trueRanges[index];
    if (!Number.isFinite(trueRange)) {
      continue;
    }

    if (atr === null) {
      const seed = trueRanges.slice(index - normalizedPeriod + 1, index + 1);
      if (seed.every(Number.isFinite)) {
        atr = seed.reduce((sum, value) => sum + value, 0) / normalizedPeriod;
        output[index] = roundNumber(atr);
      }
      continue;
    }

    atr = ((atr * (normalizedPeriod - 1)) + trueRange) / normalizedPeriod;
    output[index] = roundNumber(atr);
  }

  return output;
}

export function rollingStandardDeviation(values, period = DEFAULT_TECHNICAL_PROFILE.volatility.standardDeviationPeriod) {
  const normalizedPeriod = normalizePeriod(period, "period");
  const normalizedValues = normalizeNumberSeries(values);
  const output = Array(normalizedValues.length).fill(null);

  for (let index = normalizedPeriod - 1; index < normalizedValues.length; index += 1) {
    const window = normalizedValues.slice(index - normalizedPeriod + 1, index + 1);
    if (window.every(Number.isFinite)) {
      output[index] = roundNumber(standardDeviation(window));
    }
  }

  return output;
}

export function detectCandlePatterns(candles, thresholds = DEFAULT_TECHNICAL_PROFILE.thresholds) {
  const normalizedCandles = normalizeCandles(candles, { sort: "none" });

  return normalizedCandles.map((candle) => {
    const body = Math.abs(candle.close - candle.open);
    const range = candle.high - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const bodyToRangeRatio = Number.isFinite(range) && range > 0 ? body / range : null;
    const color = candle.close > candle.open ? "bullish" : candle.close < candle.open ? "bearish" : "neutral";
    const longBody = Number.isFinite(bodyToRangeRatio)
      ? bodyToRangeRatio >= thresholds.longBodyBodyToRangeRatio
      : false;
    const doji = Number.isFinite(bodyToRangeRatio)
      ? bodyToRangeRatio <= thresholds.dojiBodyToRangeRatio
      : false;
    const hammer = Number.isFinite(body) && body > 0
      ? lowerShadow / body >= thresholds.hammerShadowToBodyRatio && upperShadow <= body
      : false;
    const invertedHammer = Number.isFinite(body) && body > 0
      ? upperShadow / body >= thresholds.hammerShadowToBodyRatio && lowerShadow <= body
      : false;

    return {
      color,
      body: roundNumber(body),
      range: roundNumber(range),
      upperShadow: roundNumber(upperShadow),
      lowerShadow: roundNumber(lowerShadow),
      bodyToRangeRatio: roundNumber(bodyToRangeRatio),
      longBody,
      longBullish: longBody && color === "bullish",
      longBearish: longBody && color === "bearish",
      doji,
      hammer,
      invertedHammer,
    };
  });
}

function normalizeCandles(candles, options = {}) {
  if (!Array.isArray(candles)) {
    throw BrokerError.validation("candles must be an array", {
      details: { field: "candles" },
    });
  }

  const normalized = candles
    .map((candle, index) => ({
      index,
      date: nullableString(candle?.date),
      time: nullableString(candle?.time),
      timestamp: nullableString(candle?.timestamp) ?? nullableString(candle?.date),
      open: parseNumber(candle?.open),
      high: parseNumber(candle?.high),
      low: parseNumber(candle?.low),
      close: parseNumber(candle?.close),
      volume: parseNumber(candle?.volume),
      value: parseNumber(candle?.value),
      raw: candle,
    }))
    .filter((candle) => Number.isFinite(candle.close));

  if ((options.sort ?? "asc") === "none") {
    return normalized;
  }

  return normalized.sort((left, right) => {
    const leftKey = left.timestamp ?? "";
    const rightKey = right.timestamp ?? "";
    return leftKey.localeCompare(rightKey) || left.index - right.index;
  });
}

function normalizeIndicatorOptions(options = {}) {
  const profile = options.profile && options.profile !== "eraCore"
    ? mergeProfile(DEFAULT_TECHNICAL_PROFILE, options.profile)
    : DEFAULT_TECHNICAL_PROFILE;

  return {
    trend: {
      smaPeriods: normalizePeriodList(options.smaPeriods ?? options.trend?.smaPeriods ?? profile.trend.smaPeriods, "smaPeriods"),
      emaPeriods: normalizePeriodList(options.emaPeriods ?? options.trend?.emaPeriods ?? profile.trend.emaPeriods, "emaPeriods"),
      disparityPeriods: normalizePeriodList(
        options.disparityPeriods ?? options.trend?.disparityPeriods ?? profile.trend.disparityPeriods,
        "disparityPeriods",
      ),
      maAlignmentPeriods: normalizePeriodList(
        options.maAlignmentPeriods ?? options.trend?.maAlignmentPeriods ?? profile.trend.maAlignmentPeriods,
        "maAlignmentPeriods",
      ),
      slope: {
        periods: normalizePeriodList(
          options.slope?.periods ?? options.trend?.slope?.periods ?? profile.trend.slope.periods,
          "slope.periods",
        ),
        lookback: normalizePeriod(
          options.slope?.lookback ?? options.trend?.slope?.lookback ?? profile.trend.slope.lookback,
          "slope.lookback",
        ),
      },
    },
    momentum: {
      rsiPeriod: normalizePeriod(options.rsiPeriod ?? options.momentum?.rsiPeriod ?? profile.momentum.rsiPeriod, "rsiPeriod"),
      macd: {
        fastPeriod: normalizePeriod(
          options.macd?.fastPeriod ?? options.momentum?.macd?.fastPeriod ?? profile.momentum.macd.fastPeriod,
          "macd.fastPeriod",
        ),
        slowPeriod: normalizePeriod(
          options.macd?.slowPeriod ?? options.momentum?.macd?.slowPeriod ?? profile.momentum.macd.slowPeriod,
          "macd.slowPeriod",
        ),
        signalPeriod: normalizePeriod(
          options.macd?.signalPeriod ?? options.momentum?.macd?.signalPeriod ?? profile.momentum.macd.signalPeriod,
          "macd.signalPeriod",
        ),
      },
      stochastic: {
        kPeriod: normalizePeriod(
          options.stochastic?.kPeriod ?? options.momentum?.stochastic?.kPeriod ?? profile.momentum.stochastic.kPeriod,
          "stochastic.kPeriod",
        ),
        kSmoothing: normalizePeriod(
          options.stochastic?.kSmoothing
            ?? options.momentum?.stochastic?.kSmoothing
            ?? profile.momentum.stochastic.kSmoothing,
          "stochastic.kSmoothing",
        ),
        dPeriod: normalizePeriod(
          options.stochastic?.dPeriod ?? options.momentum?.stochastic?.dPeriod ?? profile.momentum.stochastic.dPeriod,
          "stochastic.dPeriod",
        ),
      },
    },
    volume: {
      movingAveragePeriods: normalizePeriodList(
        options.volumeMovingAveragePeriods
          ?? options.volume?.movingAveragePeriods
          ?? profile.volume.movingAveragePeriods,
        "volume.movingAveragePeriods",
      ),
      ratioPeriod: normalizePeriod(options.volumeRatioPeriod ?? options.volume?.ratioPeriod ?? profile.volume.ratioPeriod, "volume.ratioPeriod"),
      valueRatioPeriod: normalizePeriod(
        options.valueRatioPeriod ?? options.volume?.valueRatioPeriod ?? profile.volume.valueRatioPeriod,
        "volume.valueRatioPeriod",
      ),
      mfiPeriod: normalizePeriod(options.mfiPeriod ?? options.volume?.mfiPeriod ?? profile.volume.mfiPeriod, "volume.mfiPeriod"),
    },
    volatility: {
      atrPeriod: normalizePeriod(options.atrPeriod ?? options.volatility?.atrPeriod ?? profile.volatility.atrPeriod, "atrPeriod"),
      bollingerBands: {
        period: normalizePeriod(
          options.bollingerBands?.period ?? options.volatility?.bollingerBands?.period ?? profile.volatility.bollingerBands.period,
          "bollingerBands.period",
        ),
        standardDeviations: normalizePositiveNumber(
          options.bollingerBands?.standardDeviations
            ?? options.volatility?.bollingerBands?.standardDeviations
            ?? profile.volatility.bollingerBands.standardDeviations,
          "bollingerBands.standardDeviations",
        ),
      },
      standardDeviationPeriod: normalizePeriod(
        options.standardDeviationPeriod
          ?? options.volatility?.standardDeviationPeriod
          ?? profile.volatility.standardDeviationPeriod,
        "standardDeviationPeriod",
      ),
    },
    thresholds: {
      ...profile.thresholds,
      ...(options.thresholds ?? {}),
    },
  };
}

function mergeProfile(base, override) {
  return {
    ...base,
    ...override,
    trend: {
      ...base.trend,
      ...(override.trend ?? {}),
      slope: {
        ...base.trend.slope,
        ...(override.trend?.slope ?? {}),
      },
    },
    momentum: {
      ...base.momentum,
      ...(override.momentum ?? {}),
      macd: {
        ...base.momentum.macd,
        ...(override.momentum?.macd ?? {}),
      },
      stochastic: {
        ...base.momentum.stochastic,
        ...(override.momentum?.stochastic ?? {}),
      },
    },
    volume: {
      ...base.volume,
      ...(override.volume ?? {}),
    },
    volatility: {
      ...base.volatility,
      ...(override.volatility ?? {}),
      bollingerBands: {
        ...base.volatility.bollingerBands,
        ...(override.volatility?.bollingerBands ?? {}),
      },
    },
    thresholds: {
      ...base.thresholds,
      ...(override.thresholds ?? {}),
    },
  };
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

function normalizeNumberSeries(values) {
  return (Array.isArray(values) ? values : []).map(parseNumber);
}

function latestIndicatorSnapshot({
  candles,
  sma,
  ema,
  disparity,
  maSlope,
  maAlignment,
  rsi,
  macd,
  stochastic,
  volumeMovingAverage,
  volumeRatio,
  valueRatio,
  obv,
  mfi,
  atr,
  bollingerBands,
  standardDeviation,
  candlePatterns,
  volumeSma,
  thresholds,
}) {
  const index = latestIndex(candles);
  if (index < 0) {
    return null;
  }

  const snapshot = {
    candle: candles[index],
    trend: {
      sma: latestObjectValues(sma, index),
      ema: latestObjectValues(ema, index),
      disparity: latestObjectValues(disparity, index),
      maSlope: latestObjectValues(maSlope, index),
      maAlignment: maAlignment[index] ?? null,
    },
    momentum: {
      rsi: rsi[index] ?? null,
      macd: {
        line: macd.line[index] ?? null,
        signal: macd.signal[index] ?? null,
        histogram: macd.histogram[index] ?? null,
      },
      stochastic: {
        rawK: stochastic.rawK[index] ?? null,
        slowK: stochastic.slowK[index] ?? null,
        d: stochastic.d[index] ?? null,
      },
    },
    volume: {
      movingAverage: latestObjectValues(volumeMovingAverage, index),
      ratio: volumeRatio[index] ?? null,
      valueRatio: valueRatio[index] ?? null,
      obv: obv[index] ?? null,
      mfi: mfi[index] ?? null,
    },
    volatility: {
      atr: atr[index] ?? null,
      bollingerBands: {
        middle: bollingerBands.middle[index] ?? null,
        upper: bollingerBands.upper[index] ?? null,
        lower: bollingerBands.lower[index] ?? null,
        width: bollingerBands.width[index] ?? null,
      },
      standardDeviation: standardDeviation[index] ?? null,
    },
    candlePatterns: candlePatterns[index] ?? null,
    sma: latestObjectValues(sma, index),
    ema: latestObjectValues(ema, index),
    disparity: latestObjectValues(disparity, index),
    maSlope: latestObjectValues(maSlope, index),
    maAlignment: maAlignment[index] ?? null,
    rsi: rsi[index] ?? null,
    macd: {
      line: macd.line[index] ?? null,
      signal: macd.signal[index] ?? null,
      histogram: macd.histogram[index] ?? null,
    },
    bollingerBands: {
      middle: bollingerBands.middle[index] ?? null,
      upper: bollingerBands.upper[index] ?? null,
      lower: bollingerBands.lower[index] ?? null,
      width: bollingerBands.width[index] ?? null,
    },
    volumeSma: latestObjectValues(volumeSma, index),
    volumeMovingAverage: latestObjectValues(volumeMovingAverage, index),
    volumeRatio: volumeRatio[index] ?? null,
    valueRatio: valueRatio[index] ?? null,
    obv: obv[index] ?? null,
    mfi: mfi[index] ?? null,
    atr: atr[index] ?? null,
    standardDeviation: standardDeviation[index] ?? null,
  };

  return {
    ...snapshot,
    flags: indicatorFlags(snapshot, thresholds),
  };
}

function indicatorFlags(snapshot, thresholds) {
  const disparity20 = snapshot.trend.disparity.p20 ?? null;
  const rsi = snapshot.momentum.rsi;
  const macdHistogram = snapshot.momentum.macd.histogram;
  const volumeRatio = snapshot.volume.ratio;
  const valueRatio = snapshot.volume.valueRatio;
  const candlePatterns = snapshot.candlePatterns;

  return {
    maAlignment: snapshot.trend.maAlignment,
    disparity20Overheated: Number.isFinite(disparity20) ? disparity20 >= thresholds.overheatedDisparity20 : false,
    rsiZone: rsiZone(rsi, thresholds),
    macdBias: Number.isFinite(macdHistogram) ? macdHistogram > 0 ? "positive" : macdHistogram < 0 ? "negative" : "neutral" : null,
    volumeRatioAboveEarlyTrend: Number.isFinite(volumeRatio) ? volumeRatio >= thresholds.earlyTrendVolumeRatio : false,
    valueRatioAlert: Number.isFinite(valueRatio) ? valueRatio >= thresholds.alertValueRatio : false,
    candleColor: candlePatterns?.color ?? null,
    longBullishCandle: Boolean(candlePatterns?.longBullish),
    longBearishCandle: Boolean(candlePatterns?.longBearish),
    doji: Boolean(candlePatterns?.doji),
    hammer: Boolean(candlePatterns?.hammer),
  };
}

function rsiZone(rsi, thresholds) {
  if (!Number.isFinite(rsi)) {
    return null;
  }

  if (rsi >= thresholds.rsiOverbought) {
    return "overbought";
  }

  if (rsi <= thresholds.rsiOversold) {
    return "oversold";
  }

  return "neutral";
}

function latestObjectValues(seriesByPeriod, index) {
  return Object.fromEntries(
    Object.entries(seriesByPeriod).map(([key, values]) => [key, values[index] ?? null]),
  );
}

function latestIndex(values) {
  return values.length - 1;
}

function rsiValue(averageGain, averageLoss) {
  if (averageLoss === 0) {
    return averageGain === 0 ? 50 : 100;
  }

  const relativeStrength = averageGain / averageLoss;
  return 100 - (100 / (1 + relativeStrength));
}

function standardDeviation(values) {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length;
  return Math.sqrt(variance);
}

function periodKey(period) {
  return `p${period}`;
}

function requiredWarmup(config) {
  return Math.max(
    ...config.trend.smaPeriods,
    ...config.trend.emaPeriods,
    ...config.trend.disparityPeriods,
    ...config.trend.maAlignmentPeriods,
    ...config.trend.slope.periods.map((period) => period + config.trend.slope.lookback),
    config.momentum.rsiPeriod + 1,
    config.momentum.macd.slowPeriod + config.momentum.macd.signalPeriod,
    config.momentum.stochastic.kPeriod + config.momentum.stochastic.kSmoothing + config.momentum.stochastic.dPeriod - 2,
    ...config.volume.movingAveragePeriods,
    config.volume.ratioPeriod,
    config.volume.valueRatioPeriod,
    config.volume.mfiPeriod + 1,
    config.volatility.atrPeriod,
    config.volatility.bollingerBands.period,
    config.volatility.standardDeviationPeriod,
  );
}

function normalizeOverseasSymbol(identity) {
  if (typeof identity === "string") {
    return identity;
  }

  return identity?.symbol ?? identity?.keySymbol ?? null;
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

function successResponse({ broker, symbol, interval, capabilityId, source, result, data }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: source?.id ?? result?.id ?? null,
    symbol,
    interval,
    data,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? 0,
    continuation: result?.continuation,
  };
}

function failureResponse({ broker, symbol, interval, capabilityId, result, error }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Technical indicator service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: result?.id ?? null,
    symbol,
    interval,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
}
