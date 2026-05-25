import {
  buildCryptoRestClient,
  buildCryptoServices,
  cryptoPrivateRequiredEnv,
  runReadOnlyScenario,
} from "../live-readonly/_shared.mjs";

const binance = buildCryptoRestClient("binance");
const bybit = buildCryptoRestClient("bybit");
const services = buildCryptoServices({
  rest: { binance, bybit },
  ws: {},
});

await runReadOnlyScenario({
  scenario: "binance crypto spot balance",
  broker: "binance",
  environment: process.env.BINANCE_ENV ?? "prod",
  api: "binance.spot.balance",
  serviceMethod: "CryptoSpotAccountService.getCryptoSpotBalance",
  inputSummary: { accountType: "spot" },
  requiredEnv: cryptoPrivateRequiredEnv("binance"),
  run: () => services.spotAccount.getCryptoSpotBalance("binance"),
  summarize: summarizeAccountResult,
});

await runReadOnlyScenario({
  scenario: "bybit crypto futures positions",
  broker: "bybit",
  environment: process.env.BYBIT_ENV ?? "prod",
  api: "bybit.futures.positions",
  serviceMethod: "CryptoFuturesAccountService.getCryptoFuturesPositions",
  inputSummary: { symbol: "BTCUSDT" },
  requiredEnv: cryptoPrivateRequiredEnv("bybit"),
  run: () => services.futuresAccount.getCryptoFuturesPositions("bybit", { symbol: "BTCUSDT" }),
  summarize: summarizeAccountResult,
});

function summarizeAccountResult(response) {
  return {
    brokerResponseCode: response?.raw?.code ?? response?.raw?.retCode ?? null,
    notes: response?.ok ? "crypto private read-only account response received" : response?.error?.message,
    response: {
      ok: response?.ok,
      exchange: response?.exchange,
      id: response?.id,
      status: response?.status,
      data: response?.ok ? {
        balanceCount: Array.isArray(response.data?.balances) ? response.data.balances.length : undefined,
        positionCount: Array.isArray(response.data?.positions) ? response.data.positions.length : undefined,
      } : null,
      error: response?.error ? {
        code: response.error.code,
        message: response.error.message,
        retryable: response.error.retryable,
      } : null,
    },
  };
}
