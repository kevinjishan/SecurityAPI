import {
  brokerEnv,
  buildKiwoomClient,
  buildLsClient,
  parseCliOptions,
  requiredEnvForBroker,
  runReadOnlyScenario,
} from "./_shared.mjs";

const options = parseCliOptions();

await runReadOnlyScenario({
  scenario: "kiwoom oauth token issue",
  broker: "kiwoom",
  environment: brokerEnv("kiwoom"),
  api: "au10001",
  serviceMethod: "KiwoomClient.getAccessToken",
  inputSummary: { env: brokerEnv("kiwoom") },
  requiredEnv: requiredEnvForBroker("kiwoom"),
  options,
  run: async () => {
    const token = await buildKiwoomClient().getAccessToken(true);
    return {
      ok: true,
      broker: "kiwoom",
      id: "au10001",
      data: {
        tokenType: token.tokenType,
        expiresAt: token.expiresAt,
      },
      raw: null,
      status: 0,
    };
  },
  summarize: (response) => ({
    brokerResponseCode: null,
    notes: response?.ok ? "token issued; token value redacted" : response?.error?.message,
    response: response?.data,
  }),
});

await runReadOnlyScenario({
  scenario: "ls oauth token issue",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "token",
  serviceMethod: "LsClient.getAccessToken",
  inputSummary: { env: brokerEnv("ls") },
  requiredEnv: requiredEnvForBroker("ls"),
  options,
  run: async () => {
    const token = await buildLsClient().getAccessToken(true);
    return {
      ok: true,
      broker: "ls",
      id: "token",
      data: {
        tokenType: token.tokenType,
        expiresAt: token.expiresAt,
      },
      raw: null,
      status: 0,
    };
  },
  summarize: (response) => ({
    brokerResponseCode: null,
    notes: response?.ok ? "token issued; token value redacted" : response?.error?.message,
    response: response?.data,
  }),
});
