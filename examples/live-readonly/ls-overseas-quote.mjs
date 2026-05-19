import {
  brokerEnv,
  buildLsClient,
  buildOverseasServices,
  parseCliOptions,
  requiredEnvForBroker,
  runReadOnlyScenario,
  summarizeQuoteData,
} from "./_shared.mjs";

const options = parseCliOptions();
const requiredEnv = requiredEnvForBroker("ls");
const identity = { symbol: "TSLA", exchangeCode: "82" };

await runReadOnlyScenario({
  scenario: "ls overseas current price",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "g3101",
  serviceMethod: "OverseasStockQuoteService.getOverseasStockCurrentPrice",
  inputSummary: identity,
  requiredEnv,
  options,
  run: async () => {
    const services = buildOverseasServices({ ls: buildLsClient() });
    return services.quote.getOverseasStockCurrentPrice("ls", identity);
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? null,
    notes: response?.ok ? "overseas current price received" : response?.error?.message,
    response: summarizeQuoteData(response?.data),
  }),
});

await runReadOnlyScenario({
  scenario: "ls overseas order book",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "g3106",
  serviceMethod: "OverseasStockQuoteService.getOverseasStockOrderBook",
  inputSummary: identity,
  requiredEnv,
  options,
  run: async () => {
    const services = buildOverseasServices({ ls: buildLsClient() });
    return services.quote.getOverseasStockOrderBook("ls", identity);
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? null,
    notes: response?.ok ? "overseas order book received" : response?.error?.message,
    response: {
      symbol: response?.data?.symbol,
      price: response?.data?.price,
      askLevels: response?.data?.asks?.length ?? 0,
      bidLevels: response?.data?.bids?.length ?? 0,
      source: response?.data?.source,
    },
  }),
});

await runReadOnlyScenario({
  scenario: "ls overseas basic info",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "g3104",
  serviceMethod: "OverseasStockMarketDataService.getOverseasStockBasicInfo",
  inputSummary: identity,
  requiredEnv,
  options,
  run: async () => {
    const services = buildOverseasServices({ ls: buildLsClient() });
    return services.marketData.getOverseasStockBasicInfo("ls", identity);
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? null,
    notes: response?.ok ? "overseas basic info received" : response?.error?.message,
    response: summarizeQuoteData(response?.data),
  }),
});

await runReadOnlyScenario({
  scenario: "ls overseas period candles",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "g3204",
  serviceMethod: "OverseasStockMarketDataService.getOverseasStockCandles",
  inputSummary: { ...identity, startDate: "20260501", count: 5 },
  requiredEnv,
  options,
  run: async () => {
    const services = buildOverseasServices({ ls: buildLsClient() });
    return services.marketData.getOverseasStockCandles("ls", identity, {
      startDate: "20260501",
      count: 5,
    });
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? null,
    notes: response?.ok ? "overseas candles received" : response?.error?.message,
    response: {
      symbol: response?.data?.symbol,
      interval: response?.data?.interval,
      candleCount: response?.data?.candles?.length ?? 0,
      source: response?.data?.source,
    },
  }),
});

await runReadOnlyScenario({
  scenario: "ls overseas time series",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "g3102",
  serviceMethod: "OverseasStockMarketDataService.getOverseasStockTimeSeries",
  inputSummary: identity,
  requiredEnv,
  options,
  run: async () => {
    const services = buildOverseasServices({ ls: buildLsClient() });
    return services.marketData.getOverseasStockTimeSeries("ls", identity);
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? null,
    notes: response?.ok ? "overseas time series received" : response?.error?.message,
    response: {
      symbol: response?.data?.symbol,
      tradeCount: response?.data?.trades?.length ?? response?.data?.items?.length ?? 0,
      source: response?.data?.source,
    },
  }),
});
