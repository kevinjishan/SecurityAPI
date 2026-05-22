import { BrokerError, assertBroker } from "../core/index.mjs";
import { MarketBreadthService } from "./MarketBreadthService.mjs";
import { MarketContextService } from "./MarketContextService.mjs";
import { MarketDataService } from "./MarketDataService.mjs";
import { MarketFlowService } from "./MarketFlowService.mjs";
import { QuoteService } from "./QuoteService.mjs";
import { RealtimeService } from "./RealtimeService.mjs";
import { RelativeStrengthService } from "./RelativeStrengthService.mjs";
import { ScannerService } from "./ScannerService.mjs";
import { TechnicalIndicatorService } from "./TechnicalIndicatorService.mjs";

const SIGNAL_INPUT_CAPABILITY_ID = "signal.domesticStock.inputs";
const REALTIME_SIGNAL_INPUT_CAPABILITY_ID = "signal.domesticStock.realtimeInputs";

export class SignalInputService {
  constructor(dependencies = {}) {
    const hasServiceDependencies = dependencies.quote
      || dependencies.marketData
      || dependencies.marketContext
      || dependencies.marketFlow
      || dependencies.marketBreadth
      || dependencies.realtime
      || dependencies.scanner
      || dependencies.relativeStrength
      || dependencies.technical;
    this.clients = hasServiceDependencies ? dependencies.clients ?? {} : dependencies;
    this.quote = dependencies.quote ?? new QuoteService(this.clients);
    this.marketData = dependencies.marketData ?? new MarketDataService(this.clients);
    this.marketContext = dependencies.marketContext ?? new MarketContextService(this.clients);
    this.marketFlow = dependencies.marketFlow ?? new MarketFlowService(this.clients);
    this.marketBreadth = dependencies.marketBreadth ?? new MarketBreadthService();
    this.scanner = dependencies.scanner ?? new ScannerService(this.clients);
    this.technical = dependencies.technical ?? new TechnicalIndicatorService(this.clients);
    this.relativeStrength = dependencies.relativeStrength ?? new RelativeStrengthService(this.clients);
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
        marketContext: this.marketContext,
        marketFlow: this.marketFlow,
        marketBreadth: this.marketBreadth,
        scanner: this.scanner,
        technical: this.technical,
        relativeStrength: this.relativeStrength,
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

      if (options.includeMarketStatus) {
        const marketStatusSubscription = await this.realtime.subscribeMarketStatus(
          normalizedBroker,
          {
            onMessage: handleMessage,
            onAck: handlers.onAck,
            onError: handlers.onError,
          },
          options.marketStatusOptions ?? {},
        );

        if (!marketStatusSubscription.ok) {
          await unsubscribeAll(subscriptions);
          return failureResponse({
            broker: normalizedBroker,
            symbol: normalizedSymbol,
            error: marketStatusSubscription.error,
            capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID,
          });
        }

        subscriptions.push(marketStatusSubscription);
      }

      if (options.includeRealtimeConditionSearch) {
        const conditionSearches = normalizeRealtimeConditionSearchOptions(options, initialData);

        if (conditionSearches.length === 0) {
          await unsubscribeAll(subscriptions);
          return failureResponse({
            broker: normalizedBroker,
            symbol: normalizedSymbol,
            error: BrokerError.validation("conditionSearches are required for realtime condition search", {
              broker: normalizedBroker,
              details: { capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID },
            }),
            capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID,
          });
        }

        if (typeof this.scanner.startConditionSearchRealtime !== "function") {
          await unsubscribeAll(subscriptions);
          return failureResponse({
            broker: normalizedBroker,
            symbol: normalizedSymbol,
            error: BrokerError.config("ScannerService.startConditionSearchRealtime is required", {
              broker: normalizedBroker,
              details: { capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID },
            }),
            capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID,
          });
        }

        for (const search of conditionSearches) {
          const conditionSubscription = await this.scanner.startConditionSearchRealtime(
            normalizedBroker,
            search.condition,
            {
              onMessage: handleMessage,
              onAck: handlers.onAck,
              onError: handlers.onError,
            },
            search.options,
          );

          if (!conditionSubscription.ok) {
            await unsubscribeAll(subscriptions);
            return failureResponse({
              broker: normalizedBroker,
              symbol: normalizedSymbol,
              error: conditionSubscription.error,
              capabilityId: REALTIME_SIGNAL_INPUT_CAPABILITY_ID,
            });
          }

          state.registerConditionSearchRealtimeSession(conditionSubscription);
          subscriptions.push(conditionSubscription);
        }
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
  const conditionContext = options.conditionSearchBackground === undefined
    ? buildConditionSearchContext(symbol, results.conditionSearches)
    : clone(options.conditionSearchBackground);
  const thresholds = normalizeThresholds(options.thresholds);
  const market = options.marketBackground === undefined
    ? buildMarketBackground({ results, options })
    : clone(options.marketBackground);
  const technical = options.technicalBackground === undefined
    ? buildTechnicalBackground(results.technicalIndicators)
    : clone(options.technicalBackground);
  const relativeStrength = options.relativeStrengthBackground === undefined
    ? buildRelativeStrengthBackground(results.relativeStrength)
    : clone(options.relativeStrengthBackground);
  const marketBreadth = options.marketBreadthBackground === undefined
    ? buildMarketBreadthBackground(results.marketBreadth)
    : clone(options.marketBreadthBackground);

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
    market,
    quote: currentPrice,
    basicInfo,
    orderBook,
    candles: {
      daily: dailyCandles,
      minute: minuteCandles,
    },
    rankings: rankingContext,
    conditions: conditionContext,
    technical,
    relativeStrength,
    marketBreadth,
    metrics: {
      ...metrics,
      conditions: conditionContext?.metrics ?? null,
      market: market?.metrics ?? null,
      technical: technical?.metrics ?? null,
      relativeStrength: relativeStrength?.metrics ?? null,
      marketBreadth: marketBreadth?.metrics ?? null,
    },
    signals: {
      ...buildSignals(metrics, thresholds),
      conditions: conditionContext?.indicators ?? null,
      market: market?.indicators ?? null,
      technical: technical?.indicators ?? null,
      relativeStrength: relativeStrength?.indicators ?? null,
      marketBreadth: marketBreadth?.indicators ?? null,
    },
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
      marketStatusUpdateCount: 0,
      conditionSearchEventCount: 0,
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

    if (message?.kind !== "marketStatus" && !isSameSymbol(this.data.symbol, message?.symbol ?? message?.key)) {
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
    } else if (message?.kind === "marketStatus") {
      applyRealtimeMarketStatus(next, message);
      this.stats.marketStatusUpdateCount += 1;
      updated = true;
    } else if (message?.kind === "conditionSearchEvent") {
      applyRealtimeConditionSearch(next, message);
      this.stats.conditionSearchEventCount += 1;
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

  registerConditionSearchRealtimeSession(sessionResult) {
    const next = clone(this.data);
    applyConditionSearchRealtimeSession(next, sessionResult);
    this.data = next;

    return this.getSnapshot();
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

async function collectSignalSources({
  quote,
  marketData,
  marketContext,
  marketFlow,
  marketBreadth,
  scanner,
  technical,
  relativeStrength,
  broker,
  symbol,
  options,
}) {
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

  if (options.includeConditionSearch) {
    options.conditionSearches.forEach((search, index) => {
      tasks.push([
        `conditionSearch:${index}`,
        scanner.searchCondition(broker, search.condition, search.options),
      ]);
    });
  }

  if (options.includeMarketContext) {
    tasks.push(["marketSnapshot", marketContext.getDomesticMarketSnapshot(broker, options.marketContextOptions)]);
  }

  if (options.includeMarketIndexCandles) {
    tasks.push([
      "marketIndexDailyCandles",
      marketContext.getDomesticIndexDailyCandles(broker, options.marketIndex, options.marketIndexDailyCandlesOptions),
    ]);
  }

  if (options.includeExpectedIndex) {
    tasks.push([
      "expectedIndex",
      marketContext.getDomesticExpectedIndex(broker, options.marketIndex, options.expectedIndexOptions),
    ]);
  }

  if (options.includeMarketFlow) {
    tasks.push([
      "domesticInvestorFlow",
      marketFlow.getDomesticInvestorFlow(broker, options.marketFlowMarket, options.domesticInvestorFlowOptions),
    ]);
  }

  if (options.includeProgramTrading) {
    tasks.push([
      "programTrading",
      marketFlow.getProgramTradingTrend(broker, options.programTradingMarket, options.programTradingOptions),
    ]);
  }

  if (options.includeTechnicalIndicators) {
    tasks.push([
      "technicalIndicators",
      technical.getDomesticStockIndicators(broker, symbol, options.technicalIndicatorOptions),
    ]);
  }

  if (options.includeRelativeStrength) {
    tasks.push([
      "relativeStrength",
      relativeStrength.getDomesticStockRelativeStrength(broker, symbol, options.relativeStrengthOptions),
    ]);
  }

  if (options.includeMarketBreadth) {
    tasks.push([
      "marketBreadth",
      resolveMarketBreadth(marketBreadth, options),
    ]);
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

  if (options.includeConditionSearch) {
    results.conditionSearches = options.conditionSearches.map((search, index) => {
      const result = results[`conditionSearch:${index}`];
      delete results[`conditionSearch:${index}`];
      return result;
    });
  }

  return results;
}

function normalizeOptions(options) {
  const market = normalizeMarketTarget(options.market ?? "kospi");
  const marketIndex = normalizeMarketTarget(options.marketIndex ?? market);
  const marketFlowMarket = normalizeMarketTarget(options.marketFlowMarket ?? market);
  const programTradingMarket = normalizeMarketTarget(options.programTradingMarket ?? marketFlowMarket);
  const includeMarketFlow = Boolean(options.includeMarketFlow);
  const conditionSearches = normalizeConditionSearchOptions(options);
  const includeConditionSearch = Boolean(options.includeConditionSearch) || conditionSearches.length > 0;
  const includeTechnicalIndicators = Boolean(options.includeTechnicalIndicators);
  const includeRelativeStrength = Boolean(options.includeRelativeStrength);
  const includeMarketBreadth = Boolean(options.includeMarketBreadth);

  return {
    includeOrderBook: options.includeOrderBook !== false,
    includeBasicInfo: options.includeBasicInfo !== false,
    includeDailyCandles: options.includeDailyCandles !== false,
    includeMinuteCandles: options.includeMinuteCandles !== false,
    includeRankings: Boolean(options.includeRankings),
    includeConditionSearch,
    includeMarketContext: Boolean(options.includeMarketContext),
    includeMarketIndexCandles: Boolean(options.includeMarketIndexCandles),
    includeExpectedIndex: Boolean(options.includeExpectedIndex),
    includeMarketFlow,
    includeProgramTrading: Boolean(options.includeProgramTrading) || (includeMarketFlow && options.includeProgramTrading !== false),
    includeTechnicalIndicators,
    includeRelativeStrength,
    includeMarketBreadth,
    market,
    marketIndex,
    marketFlowMarket,
    programTradingMarket,
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
    conditionSearches,
    marketContextOptions: {
      indexes: normalizeMarketIndexes(options.marketIndexes ?? options.indexes ?? ["kospi", "kosdaq"]),
      generatedAt: options.generatedAt,
      ...(options.marketContextOptions ?? {}),
    },
    marketIndexDailyCandlesOptions: {
      count: options.marketIndexDailyCount ?? 20,
      baseDate: options.baseDate,
      ...(options.marketIndexDailyCandlesOptions ?? {}),
    },
    expectedIndexOptions: {
      session: options.expectedIndexSession ?? options.session,
      ...(options.expectedIndexOptions ?? {}),
    },
    domesticInvestorFlowOptions: {
      unit: options.marketFlowUnit ?? options.unit,
      baseDate: options.baseDate,
      exchange: options.exchange,
      ...(options.marketFlowOptions ?? {}),
      ...(options.domesticInvestorFlowOptions ?? {}),
    },
    programTradingOptions: {
      unit: options.marketFlowUnit ?? options.unit,
      date: options.date ?? options.baseDate,
      exchange: options.exchange,
      ...(options.marketFlowOptions ?? {}),
      ...(options.programTradingOptions ?? {}),
    },
    technicalIndicatorOptions: {
      count: options.technicalCount ?? options.dailyCount ?? 220,
      baseDate: options.baseDate,
      profile: options.indicatorProfile,
      ...(options.technicalIndicatorOptions ?? {}),
    },
    relativeStrengthOptions: {
      count: options.relativeStrengthCount ?? options.dailyCount ?? 120,
      baseDate: options.baseDate,
      benchmark: options.benchmark ?? { type: "index", code: marketIndex },
      benchmarkCandles: options.benchmarkCandles,
      periods: options.relativeStrengthPeriods,
      ...(options.relativeStrengthOptions ?? {}),
    },
    marketBreadthOptions: {
      market,
      period: options.marketBreadthPeriod ?? 20,
      lookback: options.marketBreadthLookback ?? 252,
      ...(options.marketBreadthOptions ?? {}),
    },
    marketBreadthSnapshot: options.marketBreadthSnapshot,
    marketBreadthRows: options.marketBreadthRows,
    highLowRows: options.highLowRows,
    candlesBySymbol: options.candlesBySymbol,
  };
}

async function resolveMarketBreadth(marketBreadth, options) {
  if (options.marketBreadthSnapshot) {
    return okComputedResult(options.marketBreadthSnapshot);
  }

  if (options.marketBreadthRows) {
    return marketBreadth.calculateAdvanceDeclineLine(options.marketBreadthRows, options.marketBreadthOptions);
  }

  if (options.highLowRows) {
    return marketBreadth.calculateHighLowRatio(options.highLowRows, options.marketBreadthOptions);
  }

  if (options.candlesBySymbol) {
    return marketBreadth.calculateAboveMovingAverageRatio(options.candlesBySymbol, options.marketBreadthOptions);
  }

  return {
    ok: false,
    broker: null,
    capability: "marketBreadth.domesticMarket.indicators",
    id: null,
    data: null,
    raw: null,
    headers: {},
    status: 0,
    error: BrokerError.validation("market breadth input is required", {
      details: {
        acceptedInputs: ["marketBreadthSnapshot", "marketBreadthRows", "highLowRows", "candlesBySymbol"],
      },
    }),
  };
}

function okComputedResult(data) {
  return {
    ok: true,
    broker: null,
    capability: "marketBreadth.domesticMarket.indicators",
    id: null,
    data,
    raw: data,
    headers: {},
    status: 0,
  };
}

function normalizeConditionSearchOptions(options = {}) {
  const rawSearches = options.conditionSearches ?? options.conditionSearch ?? options.conditions;
  const searches = rawSearches === undefined || rawSearches === null
    ? []
    : Array.isArray(rawSearches) ? rawSearches : [rawSearches];
  const baseOptions = options.conditionSearchOptions ?? {};

  return searches
    .map((search) => {
      if (search && typeof search === "object" && (Object.hasOwn(search, "condition") || Object.hasOwn(search, "options"))) {
        return {
          condition: search.condition ?? null,
          options: {
            ...baseOptions,
            ...(search.options ?? {}),
          },
        };
      }

      return {
        condition: search,
        options: { ...baseOptions },
      };
    })
    .filter((search) => search.condition !== undefined && search.condition !== null && search.condition !== "");
}

function normalizeRealtimeConditionSearchOptions(options = {}, initialData = {}) {
  const rawSearches = options.realtimeConditionSearches
    ?? options.conditionRealtimeSearches
    ?? options.conditionSearches
    ?? options.conditionSearch
    ?? options.conditions
    ?? initialData.conditions?.searches?.map((search) => search.condition);
  const searches = rawSearches === undefined || rawSearches === null
    ? []
    : Array.isArray(rawSearches) ? rawSearches : [rawSearches];
  const baseOptions = options.conditionRealtimeOptions
    ?? options.conditionSearchRealtimeOptions
    ?? options.conditionSearchOptions
    ?? {};

  return searches
    .map((search) => {
      if (search && typeof search === "object" && (Object.hasOwn(search, "condition") || Object.hasOwn(search, "options"))) {
        return {
          condition: search.condition ?? null,
          options: {
            ...baseOptions,
            ...(search.options ?? {}),
          },
        };
      }

      return {
        condition: search,
        options: { ...baseOptions },
      };
    })
    .filter((search) => search.condition !== undefined && search.condition !== null && search.condition !== "");
}

function buildMarketBackground({ results, options }) {
  const snapshot = resultData(results.marketSnapshot);
  const indexDailyCandles = resultData(results.marketIndexDailyCandles);
  const expectedIndex = resultData(results.expectedIndex);
  const investorFlow = resultData(results.domesticInvestorFlow);
  const programTrading = resultData(results.programTrading);

  if (!snapshot && !indexDailyCandles && !expectedIndex && !investorFlow && !programTrading) {
    return null;
  }

  const targetMarket = normalizeMarketTarget(options.market ?? "kospi");
  const indexCandles = normalizeCandles(indexDailyCandles?.candles);
  const currentIndex = findMarketIndex(snapshot, targetMarket)
    ?? findMarketIndex(snapshot, options.marketIndex)
    ?? snapshot?.indexes?.[0]
    ?? null;
  const latestIndexCandle = latest(indexCandles);
  const previousIndexCandle = previous(latestIndex(indexCandles), indexCandles);
  const breadth = snapshot?.breadth ?? currentIndex?.breadth ?? null;
  const breadthBalance = Number.isFinite(breadth?.rising) && Number.isFinite(breadth?.falling)
    ? breadth.rising - breadth.falling
    : null;
  const indexChange = firstNumber([
    currentIndex?.change,
    Number.isFinite(latestIndexCandle?.close) && Number.isFinite(previousIndexCandle?.close)
      ? latestIndexCandle.close - previousIndexCandle.close
      : null,
  ]);
  const indexChangeRate = firstNumber([
    currentIndex?.changeRate,
    Number.isFinite(latestIndexCandle?.close) && Number.isFinite(previousIndexCandle?.close) && previousIndexCandle.close !== 0
      ? percentageChange(latestIndexCandle.close, previousIndexCandle.close)
      : null,
  ]);
  const foreignInstitutionalNetBuy = investorFlow?.summary?.foreignInstitutionalNetBuy ?? null;
  const programTotalNetBuy = programTrading?.summary?.totalNetBuy ?? null;

  const metrics = {
    index: currentIndex ? {
      index: currentIndex.index,
      name: currentIndex.name,
      price: currentIndex.price,
      change: indexChange,
      changeRate: indexChangeRate,
    } : null,
    expectedIndex: expectedIndex ? {
      index: expectedIndex.index,
      session: expectedIndex.session,
      latestTime: expectedIndex.summary?.latestTime ?? null,
      latestExpectedIndex: expectedIndex.summary?.latestExpectedIndex ?? null,
      latestChangeRate: expectedIndex.summary?.latestChangeRate ?? null,
    } : null,
    breadth: {
      rising: breadth?.rising ?? null,
      steady: breadth?.steady ?? null,
      falling: breadth?.falling ?? null,
      risingRate: breadth?.risingRate ?? null,
      balance: breadthBalance,
      advanceDeclineRatio: ratio(breadth?.rising, breadth?.falling),
    },
    flow: {
      individualNetBuy: investorFlow?.summary?.individualNetBuy ?? null,
      foreignNetBuy: investorFlow?.summary?.foreignNetBuy ?? null,
      institutionalNetBuy: investorFlow?.summary?.institutionalNetBuy ?? null,
      foreignInstitutionalNetBuy,
      programTotalNetBuy,
      programArbitrageNetBuy: programTrading?.summary?.arbitrageNetBuy ?? null,
      programNonArbitrageNetBuy: programTrading?.summary?.nonArbitrageNetBuy ?? null,
    },
  };

  return {
    targetMarket,
    snapshot,
    indexDailyCandles: indexDailyCandles ? {
      ...indexDailyCandles,
      candles: indexCandles,
    } : null,
    expectedIndex,
    flow: {
      investor: investorFlow,
      programTrading,
    },
    metrics,
    indicators: {
      marketDirection: snapshot?.direction ?? signedDirection(indexChangeRate, 0.1),
      indexMomentum: signedDirection(indexChangeRate, 0.1),
      expectedIndex: signedDirection(expectedIndex?.summary?.latestChangeRate, 0.1),
      breadth: signedDirection(breadthBalance, 0),
      foreignInstitutionalFlow: signedDirection(foreignInstitutionalNetBuy, 0),
      programFlow: signedDirection(programTotalNetBuy, 0),
    },
  };
}

function buildTechnicalBackground(result) {
  const data = resultData(result);
  if (!data) {
    return null;
  }

  const latest = data.latest ?? null;

  return {
    snapshot: data,
    metrics: {
      trend: latest?.trend ?? null,
      momentum: latest?.momentum ?? null,
      volume: latest?.volume ?? null,
      volatility: latest?.volatility ?? null,
      candlePatterns: latest?.candlePatterns ?? null,
    },
    indicators: {
      maAlignment: latest?.flags?.maAlignment ?? null,
      disparity20Overheated: latest?.flags?.disparity20Overheated ?? null,
      rsiZone: latest?.flags?.rsiZone ?? null,
      macdBias: latest?.flags?.macdBias ?? null,
      volumeRatioAboveEarlyTrend: latest?.flags?.volumeRatioAboveEarlyTrend ?? null,
      valueRatioAlert: latest?.flags?.valueRatioAlert ?? null,
      candleColor: latest?.flags?.candleColor ?? null,
      longBullishCandle: latest?.flags?.longBullishCandle ?? null,
      longBearishCandle: latest?.flags?.longBearishCandle ?? null,
      doji: latest?.flags?.doji ?? null,
      hammer: latest?.flags?.hammer ?? null,
    },
  };
}

function buildRelativeStrengthBackground(result) {
  const data = resultData(result);
  if (!data) {
    return null;
  }

  return {
    snapshot: data,
    metrics: {
      benchmark: data.benchmark ?? null,
      periods: data.periods ?? [],
      latest: data.latest ?? {},
      alignedCount: data.alignedCount ?? null,
    },
    indicators: Object.fromEntries(
      Object.entries(data.latest ?? {}).map(([period, item]) => [
        period,
        item ? {
          direction: item.direction,
          outperforming: item.outperforming,
          spread: item.spread,
          ratio: item.ratio,
        } : null,
      ]),
    ),
  };
}

function buildMarketBreadthBackground(result) {
  const data = resultData(result);
  if (!data) {
    return null;
  }

  const latest = data.latest ?? null;

  return {
    snapshot: data,
    metrics: {
      market: data.market ?? null,
      latest,
      ratio: data.ratio ?? latest?.ratio ?? null,
      universeSize: data.universeSize ?? null,
      comparableCount: data.comparableCount ?? null,
    },
    indicators: {
      direction: marketBreadthDirection(data),
      ratio: data.ratio ?? latest?.ratio ?? null,
      aboveMovingAverageRatio: data.aboveCount !== undefined ? data.ratio : null,
      highLowRatio: data.highCount !== undefined ? data.ratio : null,
      advanceDeclineLine: latest?.value ?? null,
    },
  };
}

function marketBreadthDirection(data) {
  const latest = data?.latest ?? null;

  if (Number.isFinite(latest?.netAdvances)) {
    return signedDirection(latest.netAdvances, 0);
  }

  const ratioValue = data?.ratio ?? latest?.ratio;
  if (Number.isFinite(ratioValue)) {
    return signedDirection(ratioValue - 0.5, 0);
  }

  return null;
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

function resultData(result) {
  return result?.ok ? result.data ?? null : null;
}

function findMarketIndex(snapshot, market) {
  const normalizedMarket = nullableString(market);
  if (!normalizedMarket || !Array.isArray(snapshot?.indexes)) {
    return null;
  }

  return snapshot.indexes.find((index) => index?.index === normalizedMarket) ?? null;
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

function buildConditionSearchContext(symbol, conditionSearches) {
  if (!Array.isArray(conditionSearches) || conditionSearches.length === 0) {
    return null;
  }

  const normalizedSymbol = normalizeSymbolCode(symbol);
  const searches = conditionSearches.map((result, index) => {
    const data = resultData(result);
    const item = data?.items?.find((candidate) => normalizeSymbolCode(candidate?.symbol) === normalizedSymbol) ?? null;
    const condition = summarizeCondition(data?.condition, index);

    return {
      condition,
      matched: Boolean(item),
      item: item ? summarizeConditionSearchItem(item) : null,
      itemCount: Array.isArray(data?.items) ? data.items.length : 0,
      summary: data?.summary ?? null,
      source: {
        ok: Boolean(result?.ok),
        broker: result?.broker ?? null,
        id: result?.id ?? null,
        capability: result?.capability ?? null,
        status: result?.status ?? 0,
      },
    };
  });
  const matches = searches.filter((search) => search.matched);
  const matchedConditionIds = matches.map((search) => search.condition.id).filter(Boolean);
  const matchedNames = matches.map((search) => search.condition.name).filter(Boolean);

  return {
    searches,
    matches,
    metrics: {
      searchedCount: searches.length,
      matchedCount: matches.length,
      unmatchedCount: searches.length - matches.length,
      matchedRatio: ratio(matches.length, searches.length),
    },
    indicators: {
      anyMatch: matches.length > 0,
      matchedCount: matches.length,
      matchedConditionIds,
      matchedNames,
    },
  };
}

function summarizeCondition(condition, index) {
  const id = nullableString(condition?.id ?? condition?.seq ?? condition?.queryIndex);

  return {
    id,
    seq: nullableString(condition?.seq),
    queryIndex: nullableString(condition?.queryIndex),
    realtimeKey: nullableString(condition?.realtimeKey),
    alertKey: nullableString(condition?.alertKey),
    name: nullableString(condition?.name) ?? `condition-${index + 1}`,
    groupName: nullableString(condition?.groupName),
  };
}

function summarizeConditionSearchItem(item) {
  return {
    symbol: normalizeSymbolCode(item?.symbol),
    name: nullableString(item?.name),
    price: firstNumber([item?.price]),
    change: firstNumber([item?.change]),
    changeRate: firstNumber([item?.changeRate]),
    volume: firstNumber([item?.volume]),
  };
}

function buildSourceSummary(results) {
  return Object.fromEntries(Object.entries(results).map(([key, result]) => {
    if (key === "rankings") {
      return [key, buildSourceSummary(result)];
    }

    if (Array.isArray(result)) {
      return [key, result.map((item) => sourceSummary(item))];
    }

    return [key, sourceSummary(result)];
  }));
}

function sourceSummary(result) {
  return {
    ok: Boolean(result?.ok),
    broker: result?.broker ?? null,
    id: result?.id ?? null,
    capability: result?.capability ?? null,
    status: result?.status ?? 0,
  };
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

    if (Array.isArray(result)) {
      result.forEach((item, index) => {
        if (item && !item.ok) {
          warnings.push(sourceWarning(`${key}.${index}`, item));
        }
      });
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

function applyRealtimeMarketStatus(data, message) {
  data.market = {
    ...(data.market ?? {}),
    status: {
      broker: message.broker ?? data.broker,
      market: message.market ?? data.market?.targetMarket ?? null,
      marketCode: message.marketCode ?? null,
      marketName: message.marketName ?? null,
      session: message.session ?? null,
      phase: message.phase ?? null,
      eventCode: message.eventCode ?? null,
      eventName: message.eventName ?? null,
      time: message.time ?? null,
      remainingTime: message.remainingTime ?? null,
      raw: message.raw ?? message,
    },
  };
}

function applyConditionSearchRealtimeSession(data, sessionResult) {
  const session = sessionResult?.data ?? sessionResult;
  if (!session?.condition && !session?.realtimeKey) {
    return;
  }

  const conditions = normalizeConditionContext(data.conditions);
  const index = findConditionSearchIndex(conditions.searches, {
    ...(session.condition ?? {}),
    realtimeKey: session.realtimeKey,
  });
  const targetIndex = index >= 0 ? index : conditions.searches.length;
  const current = conditions.searches[targetIndex] ?? emptyConditionSearch(targetIndex);
  const condition = summarizeCondition({
    ...(current.condition ?? {}),
    ...(session.condition ?? {}),
    realtimeKey: session.realtimeKey ?? current.condition?.realtimeKey,
    alertKey: session.alertKey ?? current.condition?.alertKey,
  }, targetIndex);

  conditions.searches[targetIndex] = {
    ...current,
    condition,
    summary: {
      ...(current.summary ?? {}),
      realtime: {
        ok: sessionResult?.ok ?? true,
        status: session.status ?? null,
        realtimeKey: session.realtimeKey ?? null,
        resultFlag: session.resultFlag ?? null,
        time: session.time ?? null,
        message: session.message ?? null,
      },
    },
  };

  data.conditions = rebuildConditionContext(conditions.searches);
}

function applyRealtimeConditionSearch(data, message) {
  const conditions = normalizeConditionContext(data.conditions);
  const index = findConditionSearchIndex(conditions.searches, message);
  const targetIndex = index >= 0 ? index : conditions.searches.length === 1 ? 0 : conditions.searches.length;
  const current = conditions.searches[targetIndex] ?? emptyConditionSearch(targetIndex);
  const eventType = message.eventType ?? null;
  const wasMatched = Boolean(current.matched);
  const matched = eventType === "exited" ? false : true;
  const item = matched ? summarizeConditionSearchItem(message) : null;
  const itemCount = nextConditionItemCount(current.itemCount, wasMatched, matched);
  const condition = summarizeCondition({
    ...(current.condition ?? {}),
    id: current.condition?.id ?? message.conditionId,
    seq: current.condition?.seq ?? message.conditionId,
    realtimeKey: current.condition?.realtimeKey ?? message.realtimeKey,
    alertKey: current.condition?.alertKey ?? message.realtimeKey,
  }, targetIndex);

  conditions.searches[targetIndex] = {
    ...current,
    condition,
    matched,
    item,
    itemCount,
    summary: {
      ...(current.summary ?? {}),
      realtime: {
        ...(current.summary?.realtime ?? {}),
        lastEvent: {
          eventType,
          eventCode: message.eventCode ?? null,
          symbol: normalizeSymbolCode(message.symbol),
          name: nullableString(message.name),
          time: nullableString(message.time ?? message.tradeTime ?? message.timestamp),
          price: firstNumber([message.price]),
          change: firstNumber([message.change]),
          changeRate: firstNumber([message.changeRate]),
          volume: firstNumber([message.volume]),
        },
      },
    },
  };

  data.conditions = rebuildConditionContext(conditions.searches);
}

function normalizeConditionContext(conditions) {
  return {
    ...(conditions ?? {}),
    searches: Array.isArray(conditions?.searches) ? clone(conditions.searches) : [],
  };
}

function emptyConditionSearch(index) {
  return {
    condition: summarizeCondition(null, index),
    matched: false,
    item: null,
    itemCount: 0,
    summary: null,
    source: {
      ok: true,
      broker: null,
      id: null,
      capability: null,
      status: 0,
    },
  };
}

function rebuildConditionContext(searches) {
  const normalizedSearches = searches.map((search, index) => ({
    ...search,
    condition: summarizeCondition(search.condition, index),
    matched: Boolean(search.matched),
    item: search.item ? summarizeConditionSearchItem(search.item) : null,
    itemCount: Number.isFinite(search.itemCount) ? search.itemCount : 0,
  }));
  const matches = normalizedSearches.filter((search) => search.matched);
  const matchedConditionIds = matches.map((search) => search.condition.id).filter(Boolean);
  const matchedNames = matches.map((search) => search.condition.name).filter(Boolean);

  return {
    searches: normalizedSearches,
    matches,
    metrics: {
      searchedCount: normalizedSearches.length,
      matchedCount: matches.length,
      unmatchedCount: normalizedSearches.length - matches.length,
      matchedRatio: ratio(matches.length, normalizedSearches.length),
    },
    indicators: {
      anyMatch: matches.length > 0,
      matchedCount: matches.length,
      matchedConditionIds,
      matchedNames,
    },
  };
}

function findConditionSearchIndex(searches, candidate) {
  const ids = conditionCandidateIds(candidate);

  if (ids.length === 0) {
    return -1;
  }

  return searches.findIndex((search) => {
    const searchIds = conditionCandidateIds(search.condition);
    return searchIds.some((id) => ids.includes(id));
  });
}

function conditionCandidateIds(candidate) {
  const values = [
    candidate?.conditionId,
    candidate?.realtimeKey,
    candidate?.alertKey,
    candidate?.id,
    candidate?.seq,
    candidate?.queryIndex,
    candidate?.key,
  ];

  return values.map(nullableString).filter(Boolean);
}

function nextConditionItemCount(currentCount, wasMatched, matched) {
  const count = Number.isFinite(currentCount) ? currentCount : 0;

  if (matched && !wasMatched) {
    return count + 1;
  }

  if (!matched && wasMatched) {
    return Math.max(0, count - 1);
  }

  return count;
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
  const marketResults = data.market ? {
    marketSnapshot: signalResult("marketSnapshot", data.market.snapshot, data),
    marketIndexDailyCandles: signalResult("marketIndexDailyCandles", data.market.indexDailyCandles, data),
    expectedIndex: signalResult("expectedIndex", data.market.expectedIndex, data),
    marketStatus: signalResult("marketStatus", data.market.status, data),
    domesticInvestorFlow: signalResult("domesticInvestorFlow", data.market.flow?.investor, data),
    programTrading: signalResult("programTrading", data.market.flow?.programTrading, data),
  } : {};

  return buildDomesticStockSignalInputs({
    broker: data.broker,
    symbol: data.symbol,
    options: {
      generatedAt: options.updatedAt,
      thresholds: options.thresholds ?? data.thresholds,
      realtime: options.realtime,
      market: data.market?.targetMarket,
      marketBackground: data.market,
      conditionSearchBackground: data.conditions,
      technicalBackground: data.technical,
      relativeStrengthBackground: data.relativeStrength,
      marketBreadthBackground: data.marketBreadth,
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
      conditionSearches: conditionSearchResults(data),
      technicalIndicators: signalResult("technicalIndicators", data.technical?.snapshot, data),
      relativeStrength: signalResult("relativeStrength", data.relativeStrength?.snapshot, data),
      marketBreadth: signalResult("marketBreadth", data.marketBreadth?.snapshot, data),
      ...marketResults,
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

function conditionSearchResults(signalData) {
  const sources = signalData.source?.conditionSearches;

  return (signalData.conditions?.searches ?? []).map((search, index) => {
    const source = Array.isArray(sources) ? sources[index] ?? {} : {};

    return {
      ok: source.ok ?? search.source?.ok ?? true,
      broker: signalData.broker,
      capability: source.capability ?? search.source?.capability ?? null,
      id: source.id ?? search.source?.id ?? null,
      data: {
        condition: search.condition,
        items: search.item ? [search.item] : [],
        summary: search.summary,
      },
      raw: search,
      headers: {},
      status: source.status ?? search.source?.status ?? 0,
    };
  });
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

    if (Array.isArray(result)) {
      return [key, result.map((item) => item?.raw ?? null)];
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

function signedDirection(value, flatThreshold = 0) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "unknown";
  }

  if (value > flatThreshold) {
    return "positive";
  }

  if (value < -flatThreshold) {
    return "negative";
  }

  return "neutral";
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

function normalizeMarketTarget(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized || "kospi";
}

function normalizeMarketIndexes(value) {
  const rawIndexes = Array.isArray(value) ? value : [value];
  const indexes = rawIndexes
    .map(normalizeMarketTarget)
    .filter(Boolean);

  return indexes.length ? indexes : ["kospi", "kosdaq"];
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
