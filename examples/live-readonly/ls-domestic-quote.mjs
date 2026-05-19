import {
  brokerEnv,
  buildDomesticServices,
  buildLsClient,
  parseCliOptions,
  requiredEnvForBroker,
  runReadOnlyScenario,
  summarizeCollection,
  summarizeQuoteData,
} from "./_shared.mjs";

const options = parseCliOptions();
const requiredEnv = requiredEnvForBroker("ls");

await runReadOnlyScenario({
  scenario: "ls domestic current price",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "t1101",
  serviceMethod: "QuoteService.getDomesticStockCurrentPrice",
  inputSummary: { symbol: "005930" },
  requiredEnv,
  options,
  run: async () => {
    const services = buildDomesticServices({ ls: buildLsClient() });
    return services.quote.getDomesticStockCurrentPrice("ls", "005930");
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? null,
    notes: response?.ok ? "domestic quote received" : response?.error?.message,
    response: summarizeQuoteData(response?.data),
  }),
});

await runReadOnlyScenario({
  scenario: "ls domestic minute candles",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "t8412",
  serviceMethod: "MarketDataService.getDomesticStockMinuteCandles",
  inputSummary: { symbol: "005930", intervalMinutes: 5, endDate: "20260519" },
  requiredEnv,
  options,
  run: async () => {
    const services = buildDomesticServices({ ls: buildLsClient() });
    return services.marketData.getDomesticStockMinuteCandles("ls", "005930", {
      intervalMinutes: 5,
      endDate: "20260519",
    });
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? null,
    notes: response?.ok ? "domestic minute candles received" : response?.error?.message,
    response: {
      symbol: response?.data?.symbol,
      interval: response?.data?.interval,
      candleCount: response?.data?.candles?.length ?? 0,
      source: response?.data?.source,
    },
  }),
});

await runReadOnlyScenario({
  scenario: "ls domestic index current",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "t1511",
  serviceMethod: "MarketContextService.getDomesticIndexCurrent",
  inputSummary: { index: "kospi" },
  requiredEnv,
  options,
  run: async () => {
    const services = buildDomesticServices({ ls: buildLsClient() });
    return services.marketContext.getDomesticIndexCurrent("ls", "kospi");
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? null,
    notes: response?.ok ? "domestic index received" : response?.error?.message,
    response: summarizeCollection(response?.data, ["index", "code", "name", "price", "change", "changeRate"]),
  }),
});

await runReadOnlyScenario({
  scenario: "ls domestic investor flow",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "t1602",
  serviceMethod: "MarketFlowService.getDomesticInvestorFlow",
  inputSummary: { market: "kospi", unit: "quantity", count: 1 },
  requiredEnv,
  options,
  run: async () => {
    const services = buildDomesticServices({ ls: buildLsClient() });
    return services.marketFlow.getDomesticInvestorFlow("ls", "kospi", {
      unit: "quantity",
      count: 1,
    });
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? null,
    notes: response?.ok ? "domestic investor flow received" : response?.error?.message,
    response: {
      market: response?.data?.market,
      summary: response?.data?.summary,
      source: response?.data?.source,
    },
  }),
});
