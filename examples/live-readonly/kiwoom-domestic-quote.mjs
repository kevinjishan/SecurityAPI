import {
  brokerEnv,
  buildDomesticServices,
  buildKiwoomClient,
  parseCliOptions,
  requiredEnvForBroker,
  runReadOnlyScenario,
  summarizeCollection,
  summarizeQuoteData,
} from "./_shared.mjs";

const options = parseCliOptions();
const requiredEnv = requiredEnvForBroker("kiwoom");

await runReadOnlyScenario({
  scenario: "kiwoom domestic current price",
  broker: "kiwoom",
  environment: brokerEnv("kiwoom"),
  api: "ka10001",
  serviceMethod: "QuoteService.getDomesticStockCurrentPrice",
  inputSummary: { symbol: "005930" },
  requiredEnv,
  options,
  run: async () => {
    const services = buildDomesticServices({ kiwoom: buildKiwoomClient() });
    return services.quote.getDomesticStockCurrentPrice("kiwoom", "005930");
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.return_code ?? null,
    notes: response?.ok ? "domestic quote received" : response?.error?.message,
    response: summarizeQuoteData(response?.data),
  }),
});

await runReadOnlyScenario({
  scenario: "kiwoom domestic daily candles",
  broker: "kiwoom",
  environment: brokerEnv("kiwoom"),
  api: "ka10081",
  serviceMethod: "MarketDataService.getDomesticStockDailyCandles",
  inputSummary: { symbol: "005930", baseDate: "20260519" },
  requiredEnv,
  options,
  run: async () => {
    const services = buildDomesticServices({ kiwoom: buildKiwoomClient() });
    return services.marketData.getDomesticStockDailyCandles("kiwoom", "005930", {
      baseDate: "20260519",
    });
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.return_code ?? null,
    notes: response?.ok ? "domestic daily candles received" : response?.error?.message,
    response: {
      symbol: response?.data?.symbol,
      interval: response?.data?.interval,
      candleCount: response?.data?.candles?.length ?? 0,
      source: response?.data?.source,
    },
  }),
});

await runReadOnlyScenario({
  scenario: "kiwoom domestic index current",
  broker: "kiwoom",
  environment: brokerEnv("kiwoom"),
  api: "ka20001",
  serviceMethod: "MarketContextService.getDomesticIndexCurrent",
  inputSummary: { index: "kospi" },
  requiredEnv,
  options,
  run: async () => {
    const services = buildDomesticServices({ kiwoom: buildKiwoomClient() });
    return services.marketContext.getDomesticIndexCurrent("kiwoom", "kospi");
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.return_code ?? null,
    notes: response?.ok ? "domestic index received" : response?.error?.message,
    response: summarizeCollection(response?.data, ["index", "code", "name", "price", "change", "changeRate"]),
  }),
});

await runReadOnlyScenario({
  scenario: "kiwoom domestic investor flow",
  broker: "kiwoom",
  environment: brokerEnv("kiwoom"),
  api: "ka10051",
  serviceMethod: "MarketFlowService.getDomesticInvestorFlow",
  inputSummary: { market: "kospi", baseDate: "20260519" },
  requiredEnv,
  options,
  run: async () => {
    const services = buildDomesticServices({ kiwoom: buildKiwoomClient() });
    return services.marketFlow.getDomesticInvestorFlow("kiwoom", "kospi", {
      baseDate: "20260519",
    });
  },
  summarize: (response) => ({
    brokerResponseCode: response?.raw?.return_code ?? null,
    notes: response?.ok ? "domestic investor flow received" : response?.error?.message,
    response: {
      market: response?.data?.market,
      summary: response?.data?.summary,
      source: response?.data?.source,
    },
  }),
});
