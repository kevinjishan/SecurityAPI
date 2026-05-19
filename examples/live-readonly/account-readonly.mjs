import {
  brokerEnv,
  buildDomesticServices,
  buildKiwoomClient,
  buildLsClient,
  buildOverseasServices,
  parseCliOptions,
  requiredEnvForBroker,
  runReadOnlyScenario,
} from "./_shared.mjs";

const options = parseCliOptions();

await runReadOnlyScenario({
  scenario: "kiwoom domestic account cash",
  broker: "kiwoom",
  environment: brokerEnv("kiwoom"),
  api: "kt00001",
  serviceMethod: "AccountService.getDomesticStockCash",
  inputSummary: { account: "configured broker account" },
  requiredEnv: requiredEnvForBroker("kiwoom"),
  options,
  run: async () => {
    const services = buildDomesticServices({ kiwoom: buildKiwoomClient() });
    return services.account.getDomesticStockCash("kiwoom");
  },
  summarize: summarizeAccountResult("domestic cash received"),
});

await runReadOnlyScenario({
  scenario: "kiwoom domestic account balance",
  broker: "kiwoom",
  environment: brokerEnv("kiwoom"),
  api: "kt00018",
  serviceMethod: "AccountService.getDomesticStockBalance",
  inputSummary: { account: "configured broker account" },
  requiredEnv: requiredEnvForBroker("kiwoom"),
  options,
  run: async () => {
    const services = buildDomesticServices({ kiwoom: buildKiwoomClient() });
    return services.account.getDomesticStockBalance("kiwoom");
  },
  summarize: summarizeAccountResult("domestic balance received"),
});

await runReadOnlyScenario({
  scenario: "ls domestic account cash",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "CSPAQ12200",
  serviceMethod: "AccountService.getDomesticStockCash",
  inputSummary: { account: "configured broker account" },
  requiredEnv: requiredEnvForBroker("ls"),
  options,
  run: async () => {
    const services = buildDomesticServices({ ls: buildLsClient() });
    return services.account.getDomesticStockCash("ls");
  },
  summarize: summarizeAccountResult("domestic cash received"),
});

await runReadOnlyScenario({
  scenario: "ls domestic account balance",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "t0424",
  serviceMethod: "AccountService.getDomesticStockBalance",
  inputSummary: { account: "configured broker account" },
  requiredEnv: requiredEnvForBroker("ls"),
  options,
  run: async () => {
    const services = buildDomesticServices({ ls: buildLsClient() });
    return services.account.getDomesticStockBalance("ls");
  },
  summarize: summarizeAccountResult("domestic balance received"),
});

await runReadOnlyScenario({
  scenario: "ls overseas account cash",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "COSOQ02701",
  serviceMethod: "OverseasStockAccountService.getOverseasStockCash",
  inputSummary: { currencyCode: "ALL", account: "configured broker account" },
  requiredEnv: requiredEnvForBroker("ls"),
  options,
  run: async () => {
    const services = buildOverseasServices({ ls: buildLsClient() });
    return services.account.getOverseasStockCash("ls", {
      currencyCode: "ALL",
    });
  },
  summarize: summarizeAccountResult("overseas cash received"),
});

await runReadOnlyScenario({
  scenario: "ls overseas account balance",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "COSOQ00201",
  serviceMethod: "OverseasStockAccountService.getOverseasStockBalance",
  inputSummary: { currencyCode: "ALL", balanceType: "00", account: "configured broker account" },
  requiredEnv: requiredEnvForBroker("ls"),
  options,
  run: async () => {
    const services = buildOverseasServices({ ls: buildLsClient() });
    return services.account.getOverseasStockBalance("ls", {
      baseDate: "20260519",
      currencyCode: "ALL",
      balanceType: "00",
    });
  },
  summarize: summarizeAccountResult("overseas balance received"),
});

function summarizeAccountResult(successNotes) {
  return (response) => ({
    brokerResponseCode: response?.raw?.rsp_cd ?? response?.raw?.return_code ?? null,
    notes: response?.ok ? successNotes : response?.error?.message,
    response: {
      ok: response?.ok,
      broker: response?.broker,
      id: response?.id,
      summary: response?.data?.summary ? "[SUMMARY_MASKED]" : null,
      positionCount: response?.data?.positions?.length ?? null,
      orderCount: response?.data?.orders?.length ?? null,
      currency: response?.data?.currency,
      source: response?.data?.source,
    },
  });
}
