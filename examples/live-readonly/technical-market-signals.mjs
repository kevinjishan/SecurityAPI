import {
  brokerEnv,
  buildDomesticServices,
  buildKiwoomClient,
  buildLsClient,
  parseCliOptions,
  requiredEnvForBroker,
  runReadOnlyScenario,
} from "./_shared.mjs";

const options = parseCliOptions();
const broker = process.env.SECURITY_API_SIGNAL_BROKER ?? "kiwoom";
const symbol = process.env.SECURITY_API_SIGNAL_SYMBOL ?? "005930";
const baseDate = process.env.SECURITY_API_SIGNAL_BASE_DATE ?? "20260519";
const benchmark = process.env.SECURITY_API_SIGNAL_BENCHMARK ?? "kospi";
const requiredEnv = requiredEnvForBroker(broker);

await runReadOnlyScenario({
  scenario: `${broker} domestic technical indicators`,
  broker,
  environment: brokerEnv(broker),
  api: broker === "kiwoom" ? "ka10081" : "t8410/t8451",
  serviceMethod: "TechnicalIndicatorService.getDomesticStockIndicators",
  inputSummary: {
    symbol,
    baseDate,
    profile: "live-readonly-short",
  },
  requiredEnv,
  options,
  run: async () => {
    const services = buildServices(broker);
    return services.technical.getDomesticStockIndicators(broker, symbol, shortIndicatorOptions({ baseDate }));
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? response?.raw?.return_code ?? null,
    notes: response?.ok ? "technical indicators calculated from read-only candles" : response?.error?.message,
    response: summarizeTechnical(response?.data),
  }),
});

await runReadOnlyScenario({
  scenario: `${broker} domestic relative strength vs ${benchmark}`,
  broker,
  environment: brokerEnv(broker),
  api: broker === "kiwoom" ? "ka10081 + ka20006" : "t8410/t8451 + t1514",
  serviceMethod: "RelativeStrengthService.getDomesticStockRelativeStrength",
  inputSummary: {
    symbol,
    benchmark: { type: "index", code: benchmark },
    baseDate,
    periods: [5, 20],
  },
  requiredEnv,
  options,
  run: async () => {
    const services = buildServices(broker);
    return services.relativeStrength.getDomesticStockRelativeStrength(broker, symbol, {
      baseDate,
      endDate: baseDate,
      count: 60,
      benchmark: {
        type: "index",
        code: benchmark,
      },
      periods: [5, 20],
    });
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? response?.raw?.return_code ?? null,
    notes: response?.ok ? "relative strength calculated from read-only candles" : response?.error?.message,
    response: summarizeRelativeStrength(response?.data),
  }),
});

await runReadOnlyScenario({
  scenario: "snapshot domestic market breadth indicators",
  broker: "local",
  environment: "snapshot",
  api: "snapshot",
  serviceMethod: "MarketBreadthService snapshot calculators",
  inputSummary: {
    source: "static sample snapshot",
    market: "kospi",
    orderApiCalled: false,
  },
  requiredEnv: [],
  options,
  run: async () => {
    const services = buildDomesticServices({});
    const adl = services.marketBreadth.calculateAdvanceDeclineLine([
      { date: "20260517", advancing: 410, declining: 360, unchanged: 30 },
      { date: "20260518", advancing: 390, declining: 385, unchanged: 25 },
      { date: "20260519", advancing: 460, declining: 310, unchanged: 30 },
    ], { market: "kospi" });
    const highLow = services.marketBreadth.calculateHighLowRatio([
      { symbol: "A", close: 120, high52Week: 120, low52Week: 80 },
      { symbol: "B", close: 72, high52Week: 130, low52Week: 72 },
      { symbol: "C", close: 95, high52Week: 110, low52Week: 70 },
    ], { market: "kospi", lookback: 252 });
    const aboveMa = services.marketBreadth.calculateAboveMovingAverageRatio({
      A: sampleCloses("A", [101, 102, 103, 104, 105, 106]),
      B: sampleCloses("B", [105, 104, 103, 102, 101, 100]),
      C: sampleCloses("C", [99, 100, 101, 102, 103, 104]),
    }, { market: "kospi", period: 3 });

    return {
      ok: adl.ok && highLow.ok && aboveMa.ok,
      broker: "local",
      id: "snapshot",
      status: 0,
      data: {
        adl: adl.data,
        highLow: highLow.data,
        aboveMa: aboveMa.data,
      },
      raw: null,
      headers: {},
    };
  },
  summarize: (response) => ({
    brokerResponseCode: null,
    notes: response?.ok ? "market breadth calculated from snapshot input; no broker network call" : response?.error?.message,
    response: summarizeMarketBreadth(response?.data),
  }),
});

function buildServices(selectedBroker) {
  if (selectedBroker === "kiwoom") {
    return buildDomesticServices({ kiwoom: buildKiwoomClient() });
  }

  if (selectedBroker === "ls") {
    return buildDomesticServices({ ls: buildLsClient() });
  }

  throw new Error("SECURITY_API_SIGNAL_BROKER must be kiwoom or ls");
}

function shortIndicatorOptions({ baseDate }) {
  return {
    baseDate,
    count: 220,
    smaPeriods: [5, 20, 60, 120, 200],
    emaPeriods: [12, 26],
    disparityPeriods: [20, 60],
    maAlignmentPeriods: [5, 20, 60, 120],
    slope: { periods: [20, 60], lookback: 5 },
    volumeMovingAveragePeriods: [20],
    volumeRatioPeriod: 20,
    valueRatioPeriod: 20,
  };
}

function summarizeTechnical(data) {
  const latest = data?.latest ?? {};
  return {
    symbol: data?.symbol,
    interval: data?.interval,
    candleCount: data?.meta?.inputCount ?? data?.candles?.length ?? 0,
    latest: {
      close: latest.close,
      sma5: latest.trend?.sma?.p5 ?? latest.sma?.p5,
      sma20: latest.trend?.sma?.p20 ?? latest.sma?.p20,
      sma60: latest.trend?.sma?.p60,
      maAlignment: latest.flags?.maAlignment,
      disparity20: latest.trend?.disparity?.p20,
      rsi: latest.momentum?.rsi ?? latest.rsi,
      macdHistogram: latest.momentum?.macd?.histogram,
      volumeRatio: latest.volume?.ratio,
      valueRatio: latest.volume?.valueRatio,
      atr: latest.volatility?.atr,
      candleColor: latest.flags?.candleColor,
    },
    source: data?.source,
  };
}

function summarizeRelativeStrength(data) {
  return {
    symbol: data?.symbol,
    benchmark: data?.benchmark,
    periods: data?.periods,
    alignedCount: data?.alignedCount,
    latest: data?.latest,
    sources: data?.sources,
  };
}

function summarizeMarketBreadth(data) {
  return {
    adlLatest: data?.adl?.latest,
    highLowLatest: data?.highLow?.latest,
    aboveMovingAverageLatest: data?.aboveMa?.latest,
    universeSize: data?.aboveMa?.universeSize,
  };
}

function sampleCloses(symbol, closes) {
  return closes.map((close, index) => ({
    symbol,
    date: `202605${String(14 + index).padStart(2, "0")}`,
    timestamp: `202605${String(14 + index).padStart(2, "0")}`,
    close,
  }));
}
