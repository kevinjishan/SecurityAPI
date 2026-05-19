import { BrokerError, assertBroker } from "../core/index.mjs";
import { MarketDataService } from "./MarketDataService.mjs";
import { QuoteService } from "./QuoteService.mjs";
import { RealtimeService } from "./RealtimeService.mjs";
import { ScannerService } from "./ScannerService.mjs";

const SIGNAL_INPUT_CAPABILITY_ID = "signal.domesticStock.inputs";
const REALTIME_SIGNAL_INPUT_CAPABILITY_ID = "signal.domesticStock.realtimeInputs";

export class SignalInputService {
  constructor(dependencies = {}) {
    const hasServiceDependencies = dependencies.quote || dependencies.marketData || dependencies.realtime || dependencies.scanner;
    this.clients = hasServiceDependencies ? dependencies.clients ?? {} : dependencies;
    this.quote = dependencies.quote ?? new QuoteService(this.clients);
    this.marketData = dependencies.marketData ?? new MarketDataService(this.clients);
    this.scanner = dependencies.scanner ?? new ScannerService(this.clients);
    this.realtime = dependencies.realtime ?? new RealtimeService(this.clients, dependencies.realtimeOptions ?? {});
  }

  async getDomesticStockSignalInputs(broker, symbol, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedSymbol = String(symbol ?? "").trim();

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      normalizedSymbol = normalizeSymbol(symbol);

      const results = await collectSignalSources({
        quote: this.quote,
        marketData: this.marketData,
        scanner: this.scanner,
        broker: normalizedBroker,
        symbol: normalizedSymbol,
        options: normalizeOptions(options),
      });

      const currentPriceResult = results.currentPrice;
      if (!currentPriceResult?.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          results,
          error: currentPriceResult?.error ?? BrokerError.unknown("Current price source failed", {
            broker: normalizedBroker,
          }),
        });
      }

      return successResponse({
        broker: normalizedBroker,
        symbol: normalizedSymbol,
        results,
        data: buildDomesticStockSignalInputs({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          results,
          options,
        }),
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol: normalizedSymbol,
        error,
      });
    }
  }

  createDomesticStockRealtimeSignalState(initialInputs, options = {}) {
    return createDomesticStockRealtimeSignalState(initialInputs, options);
  }

  async subscribeDomesticStockSignalInputs(broker, symbol, handlers = {}, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedSymbol = String(symbol ?? "").trim();

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      normalizedSymbol = normalizeSymbol(symbol);

      const initialInputs = options.initialInputs ?? await this.getDomesticStockSignalInputs(
        normalizedBroker,
        normalizedSymbol,
        options.snapshotOptions ?? options,
      );
      const initialData = initialInputs?.ok === false ? null : unwrapSignalData(initialInputs);

      if (!initialData) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          error: initialInputs?.error ?? BrokerError.unknown("Initial signal inputs are required", {
            broker: normalizedBroker,
          }),
          capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID,
        });
      }

      const state = createDomesticStockRealtimeSignalState(initialData, options);
      const handleMessage = (message) => {
        const update = state.applyRealtimeMessage(message);
        if (update.updated) {
          handlers.onUpdate?.(update.data, message, update);
        }
        handlers.onMessage?.(message, update);
      };
      const subscriptions = [];
      const tradeSubscription = await this.realtime.subscribeDomesticStockTrades(
        normalizedBroker,
        normalizedSymbol,
        {
          onMessage: handleMessage,
          onAck: handlers.onAck,
          onError: handlers.onError,
        },
        options.tradeOptions ?? {},
      );

      if (!tradeSubscription.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          error: tradeSubscription.error,
          capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID,
        });
      }

      subscriptions.push(tradeSubscription);

      if (options.includeRealtimeOrderBook !== false) {
        const orderBookSubscription = await this.realtime.subscribeDomesticStockOrderBook(
          normalizedBroker,
          normalizedSymbol,
          {
            onMessage: handleMessage,
            onAck: handlers.onAck,
            onError: handlers.onError,
          },
          options.orderBookOptions ?? {},
        );

        if (!orderBookSubscription.ok) {
          await unsubscribeAll(subscriptions);
          return failureResponse({
            broker: normalizedBroker,
            symbol: normalizedSymbol,
            error: orderBookSubscription.error,
            capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID,
          });
        }

        subscriptions.push(orderBookSubscription);
      }

      return {
        ok: true,
        broker: normalizedBroker,
        capability: REALTIME_SIGNAL_INPUT_CAPABILITY_ID,
        id: null,
        symbol: normalizedSymbol,
        data: state.getSnapshot(),
        state,
        subscriptions,
        unsubscribe: async () => unsubscribeAll(subscriptions),
      };
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol: normalizedSymbol,
        error,
        capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID,
      });
    }
  }
}

export function buildDomesticStockSignalInputs({ broker, symbol, results = {}, options = {} }) {
  const currentPrice = results.currentPrice?.data ?? null;
  const basicInfo = results.basicInfo?.data ?? null;
  const orderBook = results.orderBook?.data ?? null;
  const dailyCandles = normalizeCandles(results.dailyCandles?.data?.candles);
  const minuteCandles = normalizeCandles(results.minuteCandles?.data?.candles);
  const rankingContext = buildRankingContext(symbol, results.rankings);
  const thresholds = normalizeThresholds(options.thresholds);

  const metrics = buildMetrics({
    currentPrice,
    basicInfo,
    orderBook,
    dailyCandles,
    minuteCandles,
    rankingContext,
  });

  return {
    broker,
    symbol,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    quote: currentPrice,
    basicInfo,
    orderBook,
    candles: {
      daily: dailyCandles,
      minute: minuteCandles,
    },
    rankings: rankingContext,
    metrics,
    signals: buildSignals(metrics, thresholds),
    thresholds,
    realtime: options.realtime ?? null,
    source: buildSourceSummary(results),
    warnings: buildWarnings(results),
  };
}

export class DomesticStockRealtimeSignalState {
  constructor(initialInputs, options = {}) {
    this.options = normalizeRealtimeStateOptions(options);
    this.data = normalizeInitialSignalData(initialInputs);
    this.stats = {
      startedAt: this.options.startedAt,
      updatedAt: this.data.generatedAt ?? this.options.startedAt,
      lastMessageKind: null,
      lastTradeTime: null,
      tradeCount: 0,
      orderBookUpdateCount: 0,
      ignoredCount: 0,
    };
    this.data.realtime = {
      ...this.stats,
    };
  }

  applyRealtimeMessage(message, options = {}) {
    const updateOptions = {
      ...this.options,
      ...options,
    };

    if (!isSameSymbol(this.data.symbol, message?.symbol ?? message?.key)) {
      this.stats.ignoredCount += 1;
      this.data.realtime = {
        ...this.stats,
      };
      return {
        updated: false,
        reason: "symbol_mismatch",
        message,
        data: this.getSnapshot(),
      };
    }

    let updated = false;
    const next = clone(this.data);

    if (message?.kind === "trade") {
      applyRealtimeTrade(next, message, updateOptions);
      this.stats.tradeCount += 1;
      this.stats.lastTradeTime = message.tradeTime ?? this.stats.lastTradeTime;
      updated = true;
    } else if (message?.kind === "orderBook") {
      applyRealtimeOrderBook(next, message);
      this.stats.orderBookUpdateCount += 1;
      updated = true;
    }

    if (!updated) {
      this.stats.ignoredCount += 1;
      this.data.realtime = {
        ...this.stats,
      };
      return {
        updated: false,
        reason: "unsupported_message_kind",
        message,
        data: this.getSnapshot(),
      };
    }

    this.stats.updatedAt = updateOptions.updatedAt ?? new Date().toISOString();
    this.stats.lastMessageKind = message.kind;
    this.data = rebuildSignalDataFromSnapshot(next, {
      ...updateOptions,
      realtime: {
        ...this.stats,
      },
    });

    return {
      updated: true,
      message,
      data: this.getSnapshot(),
    };
  }

  getSnapshot() {
    return clone(this.data);
  }
}

export function createDomesticStockRealtimeSignalState(initialInputs, options = {}) {
  return new DomesticStockRealtimeSignalState(initialInputs, options);
}

export function applyDomesticStockRealtimeSignalMessage(initialInputs, message, options = {}) {
  const state = createDomesticStockRealtimeSignalState(initialInputs, options);
  return state.applyRealtimeMessage(message, options);
}

async function collectSignalSources({ quote, marketData, scanner, broker, symbol, options }) {
  const tasks = [
    ["currentPrice", quote.getDomesticStockCurrentPrice(broker, symbol, options.currentPriceOptions)],
  ];

  if (options.includeOrderBook) {
    tasks.push(["orderBook", quote.getDomesticStockOrderBook(broker, symbol, options.orderBookOptions)]);
  }

  if (options.includeBasicInfo) {
    tasks.push(["basicInfo", marketData.getDomesticStockBasicInfo(broker, symbol, options.basicInfoOptions)]);
  }

  if (options.includeDailyCandles) {
    tasks.push(["dailyCandles", marketData.getDomesticStockDailyCandles(broker, symbol, options.dailyCandlesOptions)]);
  }

  if (options.includeMinuteCandles) {
    tasks.push(["minuteCandles", marketData.getDomesticStockMinuteCandles(broker, symbol, options.minuteCandlesOptions)]);
  }

  if (options.includeRankings) {
    tasks.push(["volumeRanking", scanner.getDomesticStockVolumeRankings(broker, options.rankingOptions)]);
    tasks.push(["valueRanking", scanner.getDomesticStockValueRankings(broker, options.rankingOptions)]);
    tasks.push(["changeRateRanking", scanner.getDomesticStockChangeRateRankings(broker, options.rankingOptions)]);
  }

  const settled = await Promise.all(tasks.map(async ([key, promise]) => [key, await promise]));
  const results = Object.fromEntries(settled);

  if (options.includeRankings) {
    results.rankings = {
      volume: results.volumeRanking,
      value: results.valueRanking,
      changeRate: results.changeRateRanking,
    };
    delete results.volumeRanking;
    delete results.valueRanking;
    delete results.changeRateRanking;
  }

  return results;
}

function normalizeOptions(options) {
  return {
    includeOrderBook: options.includeOrderBook !== false,
    includeBasicInfo: options.includeBasicInfo !== false,
    includeDailyCandles: options.includeDailyCandles !== false,
    includeMinuteCandles: options.includeMinuteCandles !== false,
    includeRankings: Boolean(options.includeRankings),
    currentPriceOptions: options.currentPriceOptions ?? {},
    orderBookOptions: options.orderBookOptions ?? {},
    basicInfoOptions: options.basicInfoOptions ?? {},
    dailyCandlesOptions: {
      count: options.dailyCount ?? 20,
      ...(options.dailyCandlesOptions ?? {}),
    },
    minuteCandlesOptions: {
      intervalMinutes: options.intervalMinutes ?? 1,
      count: options.minuteCount ?? 30,
      ...(options.minuteCandlesOptions ?? {}),
    },
    rankingOptions: {
      market: options.market,
      exchange: options.exchange,
      ...(options.rankingOptions ?? {}),
    },
  };
}

function buildMetrics({ currentPrice, basicInfo, orderBook, dailyCandles, minuteCandles, rankingContext }) {
  const price = firstNumber([
    currentPrice?.price,
    basicInfo?.price,
    latest(minuteCandles)?.close,
    latest(dailyCandles)?.close,
  ]);
  const open = firstNumber([basicInfo?.open, latest(dailyCandles)?.open]);
  const high = firstNumber([basicInfo?.high, latest(dailyCandles)?.high]);
  const low = firstNumber([basicInfo?.low, latest(dailyCandles)?.low]);
  const referencePrice = firstNumber([
    basicInfo?.referencePrice,
    currentPrice?.price && currentPrice?.change !== null ? currentPrice.price - currentPrice.change : null,
    previous(latestIndex(dailyCandles), dailyCandles)?.close,
  ]);
  const latestDaily = latest(dailyCandles);
  const previousDaily = previous(latestIndex(dailyCandles), dailyCandles);
  const firstMinute = first(minuteCandles);
  const latestMinute = latest(minuteCandles);
  const previousMinuteCandles = minuteCandles.slice(0, Math.max(0, minuteCandles.length - 1));
  const previousDailyCandles = dailyCandles.slice(0, Math.max(0, dailyCandles.length - 1));
  const orderBookMetrics = buildOrderBookMetrics(orderBook, price);

  return {
    price: {
      current: price,
      change: firstNumber([currentPrice?.change, price !== null && referencePrice ? price - referencePrice : null]),
      changeRate: firstNumber([
        currentPrice?.changeRate,
        price !== null && referencePrice ? percentageChange(price, referencePrice) : null,
      ]),
      referencePrice,
    },
    intraday: {
      open,
      high,
      low,
      range: high !== null && low !== null ? high - low : null,
      rangePosition: price !== null && high !== null && low !== null && high > low
        ? (price - low) / (high - low)
        : null,
      fromOpenChange: price !== null && open !== null ? price - open : null,
      fromOpenChangeRate: price !== null && open ? percentageChange(price, open) : null,
    },
    momentum: {
      dailyCloseChange: Number.isFinite(latestDaily?.close) && Number.isFinite(previousDaily?.close)
        ? latestDaily.close - previousDaily.close
        : null,
      dailyCloseChangeRate: Number.isFinite(latestDaily?.close) && Number.isFinite(previousDaily?.close) && previousDaily.close !== 0
        ? percentageChange(latestDaily.close, previousDaily.close)
        : null,
      minuteCloseChange: Number.isFinite(latestMinute?.close) && Number.isFinite(firstMinute?.close)
        ? latestMinute.close - firstMinute.close
        : null,
      minuteCloseChangeRate: Number.isFinite(latestMinute?.close) && Number.isFinite(firstMinute?.close) && firstMinute.close !== 0
        ? percentageChange(latestMinute.close, firstMinute.close)
        : null,
      latestDailyClose: latestDaily?.close ?? null,
      latestMinuteClose: latestMinute?.close ?? null,
    },
    volume: {
      currentVolume: firstNumber([currentPrice?.volume, basicInfo?.volume]),
      latestMinuteVolume: latestMinute?.volume ?? null,
      averagePreviousMinuteVolume: average(previousMinuteCandles.map((candle) => candle.volume)),
      minuteVolumeRatio: ratio(latestMinute?.volume, average(previousMinuteCandles.map((candle) => candle.volume))),
      latestDailyVolume: latestDaily?.volume ?? null,
      averagePreviousDailyVolume: average(previousDailyCandles.map((candle) => candle.volume)),
      dailyVolumeRatio: ratio(latestDaily?.volume, average(previousDailyCandles.map((candle) => candle.volume))),
    },
    orderBook: orderBookMetrics,
    rankings: rankingContext,
  };
}

function buildOrderBookMetrics(orderBook, price) {
  const bestAsk = firstLevel(orderBook?.asks);
  const bestBid = firstLevel(orderBook?.bids);
  const askQuantity = firstNumber([orderBook?.totals?.askQuantity, sumQuantities(orderBook?.asks)]);
  const bidQuantity = firstNumber([orderBook?.totals?.bidQuantity, sumQuantities(orderBook?.bids)]);
  const totalQuantity = askQuantity !== null && bidQuantity !== null ? askQuantity + bidQuantity : null;
  const spread = Number.isFinite(bestAsk?.price) && Number.isFinite(bestBid?.price) ? bestAsk.price - bestBid.price : null;

  return {
    bestAskPrice: bestAsk?.price ?? null,
    bestBidPrice: bestBid?.price ?? null,
    spread,
    spreadRate: spread !== null && price ? (spread / price) * 100 : null,
    askQuantity,
    bidQuantity,
    totalQuantity,
    imbalance: totalQuantity ? (bidQuantity - askQuantity) / totalQuantity : null,
  };
}

function buildSignals(metrics, thresholds) {
  const minuteMomentumRate = metrics.momentum.minuteCloseChangeRate;
  const dailyMomentumRate = metrics.momentum.dailyCloseChangeRate;
  const rangePosition = metrics.intraday.rangePosition;
  const orderBookImbalance = metrics.orderBook.imbalance;
  const minuteVolumeRatio = metrics.volume.minuteVolumeRatio;

  return {
    priceMomentum: {
      direction: momentumDirection(minuteMomentumRate ?? dailyMomentumRate, thresholds.flatMomentumRate),
      minuteChangeRate: minuteMomentumRate,
      dailyChangeRate: dailyMomentumRate,
    },
    volumeSpike: {
      active: minuteVolumeRatio !== null ? minuteVolumeRatio >= thresholds.volumeSpikeRatio : null,
      ratio: minuteVolumeRatio,
      threshold: thresholds.volumeSpikeRatio,
    },
    orderBookImbalance: {
      direction: imbalanceDirection(orderBookImbalance, thresholds.orderBookImbalance),
      value: orderBookImbalance,
      threshold: thresholds.orderBookImbalance,
    },
    dayRange: {
      zone: dayRangeZone(rangePosition, thresholds),
      position: rangePosition,
    },
  };
}

function buildRankingContext(symbol, rankings) {
  if (!rankings) {
    return {
      volume: null,
      value: null,
      changeRate: null,
    };
  }

  return {
    volume: findRankingItem(symbol, rankings.volume),
    value: findRankingItem(symbol, rankings.value),
    changeRate: findRankingItem(symbol, rankings.changeRate),
  };
}

function findRankingItem(symbol, rankingResult) {
  if (!rankingResult?.ok) {
    return null;
  }

  const normalizedSymbol = normalizeSymbolCode(symbol);
  const item = rankingResult.data?.items?.find((candidate) => normalizeSymbolCode(candidate.symbol) === normalizedSymbol);
  if (!item) {
    return null;
  }

  return {
    rank: item.rank,
    symbol: item.symbol,
    name: item.name,
    price: item.price,
    changeRate: item.changeRate,
    volume: item.volume,
    value: item.value,
    turnoverRate: item.turnoverRate,
  };
}

function buildSourceSummary(results) {
  return Object.fromEntries(Object.entries(results).map(([key, result]) => {
    if (key === "rankings") {
      return [key, buildSourceSummary(result)];
    }

    return [key, {
      ok: Boolean(result?.ok),
      broker: result?.broker ?? null,
      id: result?.id ?? null,
      capability: result?.capability ?? null,
      status: result?.status ?? 0,
    }];
  }));
}

function buildWarnings(results) {
  const warnings = [];

  for (const [key, result] of Object.entries(results)) {
    if (key === "rankings") {
      for (const [rankingKey, rankingResult] of Object.entries(result ?? {})) {
        if (rankingResult && !rankingResult.ok) {
          warnings.push(sourceWarning(`rankings.${rankingKey}`, rankingResult));
        }
      }
      continue;
    }

    if (result && !result.ok) {
      warnings.push(sourceWarning(key, result));
    }
  }

  return warnings;
}

function sourceWarning(source, result) {
  return {
    source,
    code: result.error?.code ?? "UNKNOWN_ERROR",
    message: result.error?.message ?? "Signal source failed",
  };
}

function normalizeInitialSignalData(initialInputs) {
  const data = unwrapSignalData(initialInputs);
  if (!data) {
    throw BrokerError.validation("Initial signal inputs are required", {
      details: { capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID },
    });
  }

  return clone(data);
}

function unwrapSignalData(initialInputs) {
  if (!initialInputs) {
    return null;
  }

  return initialInputs.ok === true ? initialInputs.data : initialInputs;
}

function normalizeRealtimeStateOptions(options = {}) {
  return {
    intervalMinutes: normalizePositiveInteger(options.intervalMinutes ?? options.minuteIntervalMinutes ?? 1, "intervalMinutes"),
    maxMinuteCandles: normalizePositiveInteger(options.maxMinuteCandles ?? options.minuteCount ?? 60, "maxMinuteCandles"),
    tradeDate: normalizeOptionalDate(options.tradeDate),
    startedAt: options.startedAt ?? new Date().toISOString(),
    thresholds: options.thresholds,
  };
}

function applyRealtimeTrade(data, message, options) {
  const price = firstNumber([message.price, data.quote?.price, data.metrics?.price?.current]);
  const tradeQuantity = firstNumber([message.tradeQuantity, 0]) ?? 0;
  const volume = firstNumber([message.volume, data.quote?.volume, data.basicInfo?.volume]);
  const open = firstNumber([message.open, data.basicInfo?.open, data.metrics?.intraday?.open]);
  const high = firstNumber([message.high, data.basicInfo?.high, data.metrics?.intraday?.high, price]);
  const low = firstNumber([message.low, data.basicInfo?.low, data.metrics?.intraday?.low, price]);

  data.quote = {
    ...(data.quote ?? {}),
    broker: data.broker,
    symbol: data.symbol,
    price,
    priceRaw: message.priceRaw ?? data.quote?.priceRaw ?? nullableString(price),
    change: firstNumber([message.change, data.quote?.change]),
    changeRaw: message.changeRaw ?? data.quote?.changeRaw ?? null,
    changeRate: firstNumber([message.changeRate, data.quote?.changeRate]),
    changeRateRaw: message.changeRateRaw ?? data.quote?.changeRateRaw ?? null,
    volume,
    volumeRaw: message.volumeRaw ?? data.quote?.volumeRaw ?? nullableString(volume),
    currency: message.currency ?? data.quote?.currency ?? "KRW",
  };

  data.basicInfo = {
    ...(data.basicInfo ?? {}),
    broker: data.broker,
    symbol: data.symbol,
    price,
    priceRaw: message.priceRaw ?? data.basicInfo?.priceRaw ?? nullableString(price),
    open,
    high,
    low,
    volume,
    volumeRaw: message.volumeRaw ?? data.basicInfo?.volumeRaw ?? nullableString(volume),
    currency: message.currency ?? data.basicInfo?.currency ?? "KRW",
  };

  data.candles = data.candles ?? {};
  data.candles.minute = updateMinuteCandles(data.candles.minute, message, {
    ...options,
    price,
    tradeQuantity,
  });
}

function applyRealtimeOrderBook(data, message) {
  data.orderBook = {
    ...(data.orderBook ?? {}),
    broker: data.broker,
    symbol: data.symbol,
    asks: message.asks ?? data.orderBook?.asks ?? [],
    bids: message.bids ?? data.orderBook?.bids ?? [],
    totals: message.totals ?? data.orderBook?.totals ?? {},
    timestamp: message.timestamp ?? data.orderBook?.timestamp ?? null,
    source: data.orderBook?.source,
  };
}

function updateMinuteCandles(candles, message, options) {
  const normalizedCandles = normalizeCandles(candles);
  if (!Number.isFinite(options.price)) {
    return normalizedCandles;
  }

  const bucket = realtimeCandleBucket(message, options);
  const existingIndex = normalizedCandles.findIndex((candle) => candle.timestamp === bucket.timestamp);
  const existing = existingIndex >= 0 ? normalizedCandles[existingIndex] : null;
  const nextCandle = existing
    ? updateExistingMinuteCandle(existing, options.price, options.tradeQuantity, message)
    : createMinuteCandle(bucket, options.price, options.tradeQuantity, message);

  if (existingIndex >= 0) {
    normalizedCandles[existingIndex] = nextCandle;
  } else {
    normalizedCandles.push(nextCandle);
  }

  return normalizeCandles(normalizedCandles).slice(-options.maxMinuteCandles);
}

function updateExistingMinuteCandle(candle, price, tradeQuantity, message) {
  const volume = firstNumber([candle.volume, 0]) + tradeQuantity;

  return {
    ...candle,
    high: Math.max(firstNumber([candle.high, price]), price),
    low: Math.min(firstNumber([candle.low, price]), price),
    close: price,
    volume,
    volumeRaw: nullableString(volume),
    value: addNullable(candle.value, Number.isFinite(price) ? price * tradeQuantity : null),
    valueRaw: nullableString(addNullable(candle.value, Number.isFinite(price) ? price * tradeQuantity : null)),
    raw: {
      ...(candle.raw ?? {}),
      lastRealtime: message,
    },
  };
}

function createMinuteCandle(bucket, price, tradeQuantity, message) {
  const value = Number.isFinite(price) ? price * tradeQuantity : null;

  return {
    date: bucket.date,
    time: bucket.time,
    timestamp: bucket.timestamp,
    open: price,
    high: price,
    low: price,
    close: price,
    volume: tradeQuantity,
    volumeRaw: nullableString(tradeQuantity),
    value,
    valueRaw: nullableString(value),
    change: message.change ?? null,
    changeRaw: message.changeRaw ?? null,
    raw: {
      realtime: message,
    },
  };
}

function realtimeCandleBucket(message, options) {
  const date = normalizeRealtimeDate(options.tradeDate, message);
  const time = normalizeRealtimeTime(message.tradeTime, options.intervalMinutes);

  return {
    date,
    time,
    timestamp: `${date}${time}`,
  };
}

function normalizeRealtimeDate(tradeDate, message) {
  const explicitDate = normalizeOptionalDate(tradeDate);
  if (explicitDate) {
    return explicitDate;
  }

  const rawTimestamp = nullableString(message.timestamp);
  if (rawTimestamp?.length >= 8) {
    return rawTimestamp.slice(0, 8);
  }

  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("");
}

function normalizeRealtimeTime(tradeTime, intervalMinutes) {
  const normalized = nullableString(tradeTime)?.replace(/\D/g, "").padEnd(6, "0").slice(0, 6) ?? "000000";
  const hour = Number(normalized.slice(0, 2));
  const minute = Number(normalized.slice(2, 4));
  const bucketMinute = Math.floor((Number.isFinite(minute) ? minute : 0) / intervalMinutes) * intervalMinutes;

  return [
    String(Number.isFinite(hour) ? hour : 0).padStart(2, "0"),
    String(bucketMinute).padStart(2, "0"),
    "00",
  ].join("");
}

function rebuildSignalDataFromSnapshot(data, options) {
  return buildDomesticStockSignalInputs({
    broker: data.broker,
    symbol: data.symbol,
    options: {
      generatedAt: options.updatedAt,
      thresholds: options.thresholds ?? data.thresholds,
      realtime: options.realtime,
    },
    results: {
      currentPrice: signalResult("currentPrice", data.quote, data),
      basicInfo: signalResult("basicInfo", data.basicInfo, data),
      orderBook: signalResult("orderBook", data.orderBook, data),
      dailyCandles: signalResult("dailyCandles", { candles: data.candles?.daily ?? [] }, data),
      minuteCandles: signalResult("minuteCandles", { candles: data.candles?.minute ?? [] }, data),
      rankings: {
        volume: rankingResult("volume", data.rankings?.volume, data),
        value: rankingResult("value", data.rankings?.value, data),
        changeRate: rankingResult("changeRate", data.rankings?.changeRate, data),
      },
    },
  });
}

function signalResult(key, data, signalData) {
  const source = signalData.source?.[key] ?? {};

  return {
    ok: true,
    broker: signalData.broker,
    capability: source.capability ?? null,
    id: source.id ?? null,
    data,
    raw: data,
    headers: {},
    status: source.status ?? 0,
  };
}

function rankingResult(key, item, signalData) {
  const source = signalData.source?.rankings?.[key] ?? {};

  return {
    ok: true,
    broker: signalData.broker,
    capability: source.capability ?? null,
    id: source.id ?? null,
    data: {
      items: item ? [item] : [],
    },
    raw: item,
    headers: {},
    status: source.status ?? 0,
  };
}

function isSameSymbol(left, right) {
  return normalizeSymbolCode(left) === normalizeSymbolCode(right);
}

async function unsubscribeAll(subscriptions) {
  const results = [];

  for (const subscription of subscriptions) {
    results.push(await subscription.unsubscribe?.());
  }

  return results;
}

function successResponse({ broker, symbol, results, data }) {
  return {
    ok: true,
    broker,
    capability: SIGNAL_INPUT_CAPABILITY_ID,
    id: null,
    symbol,
    data,
    raw: buildRawSummary(results),
    headers: {},
    status: 0,
  };
}

function failureResponse({ broker, symbol, results = {}, error, capabilityId = SIGNAL_INPUT_CAPABILITY_ID }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Signal input service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: null,
    symbol,
    data: null,
    raw: buildRawSummary(results),
    headers: {},
    status: brokerError.status ?? 0,
    error: brokerError,
  };
}

function buildRawSummary(results) {
  return Object.fromEntries(Object.entries(results ?? {}).map(([key, result]) => {
    if (key === "rankings") {
      return [key, buildRawSummary(result)];
    }

    return [key, result?.raw ?? null];
  }));
}

function normalizeCandles(candles) {
  return (Array.isArray(candles) ? candles : [])
    .slice()
    .sort((a, b) => String(a?.timestamp ?? a?.date ?? "").localeCompare(String(b?.timestamp ?? b?.date ?? "")));
}

function normalizeThresholds(thresholds = {}) {
  return {
    volumeSpikeRatio: finiteNumber(thresholds.volumeSpikeRatio, 2),
    orderBookImbalance: finiteNumber(thresholds.orderBookImbalance, 0.2),
    nearHighRangePosition: finiteNumber(thresholds.nearHighRangePosition, 0.8),
    nearLowRangePosition: finiteNumber(thresholds.nearLowRangePosition, 0.2),
    flatMomentumRate: finiteNumber(thresholds.flatMomentumRate, 0.1),
  };
}

function momentumDirection(value, flatThreshold) {
  if (value === null || value === undefined) {
    return "unknown";
  }

  if (value >= flatThreshold) {
    return "up";
  }

  if (value <= -flatThreshold) {
    return "down";
  }

  return "flat";
}

function imbalanceDirection(value, threshold) {
  if (value === null || value === undefined) {
    return "unknown";
  }

  if (value >= threshold) {
    return "bid";
  }

  if (value <= -threshold) {
    return "ask";
  }

  return "balanced";
}

function dayRangeZone(value, thresholds) {
  if (value === null || value === undefined) {
    return "unknown";
  }

  if (value >= thresholds.nearHighRangePosition) {
    return "nearHigh";
  }

  if (value <= thresholds.nearLowRangePosition) {
    return "nearLow";
  }

  return "middle";
}

function normalizeSymbol(symbol) {
  const normalized = String(symbol ?? "").trim();

  if (!normalized) {
    throw BrokerError.validation("Domestic stock symbol is required", {
      details: { capabilityId: SIGNAL_INPUT_CAPABILITY_ID },
    });
  }

  return normalized;
}

function normalizeSymbolCode(value) {
  const normalized = value === undefined || value === null ? "" : String(value).trim();
  return normalized.startsWith("A") && normalized.length === 7 ? normalized.slice(1) : normalized;
}

function firstLevel(levels) {
  return Array.isArray(levels) ? levels.find((level) => level?.price !== null || level?.quantity !== null) ?? null : null;
}

function first(candles) {
  return candles.length ? candles[0] : null;
}

function latest(candles) {
  return candles.length ? candles[candles.length - 1] : null;
}

function latestIndex(candles) {
  return candles.length ? candles.length - 1 : -1;
}

function previous(index, values) {
  return index > 0 ? values[index - 1] : null;
}

function firstNumber(values) {
  for (const value of values) {
    if (Number.isFinite(value)) {
      return value;
    }
  }

  return null;
}

function finiteNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizePositiveInteger(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw BrokerError.validation(`${field} must be a positive number`, {
      details: { field },
    });
  }

  return Math.trunc(number);
}

function normalizeOptionalDate(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return String(value).replaceAll("-", "").trim();
}

function addNullable(left, right) {
  const leftValue = Number.isFinite(left) ? left : 0;
  const rightValue = Number.isFinite(right) ? right : 0;
  return leftValue + rightValue;
}

function nullableString(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value);
}

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function sumQuantities(levels) {
  if (!Array.isArray(levels)) {
    return null;
  }

  const values = levels.map((level) => level?.quantity).filter(Number.isFinite);
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0);
}

function average(values) {
  const finiteValues = values.filter(Number.isFinite);
  if (finiteValues.length === 0) {
    return null;
  }

  return finiteValues.reduce((sum, value) => sum + value, 0) / finiteValues.length;
}

function ratio(value, baseline) {
  if (!Number.isFinite(value) || !Number.isFinite(baseline) || baseline === 0) {
    return null;
  }

  return value / baseline;
}

function percentageChange(value, baseline) {
  if (!Number.isFinite(value) || !Number.isFinite(baseline) || baseline === 0) {
    return null;
  }

  return ((value - baseline) / baseline) * 100;
}
