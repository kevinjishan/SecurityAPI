import {
  buildCryptoServices,
  buildCryptoWebSocketClient,
  runReadOnlyScenario,
} from "../live-readonly/_shared.mjs";

const binanceWs = buildCryptoWebSocketClient("binance");
const bybitWs = buildCryptoWebSocketClient("bybit");
const services = buildCryptoServices({
  rest: {},
  ws: { binance: binanceWs, bybit: bybitWs },
});

try {
  await runReadOnlyScenario({
    scenario: "binance crypto spot trade realtime subscribe",
    broker: "binance",
    environment: process.env.BINANCE_ENV ?? "prod",
    api: "binance.spot.ws.trade",
    serviceMethod: "CryptoSpotRealtimeService.subscribeCryptoSpotTrades",
    inputSummary: { symbol: "BTCUSDT" },
    run: () => services.spotRealtime.subscribeCryptoSpotTrades("binance", { symbol: "BTCUSDT" }),
    summarize: summarizeRealtimeResult,
  });

  await runReadOnlyScenario({
    scenario: "bybit crypto futures order book realtime subscribe",
    broker: "bybit",
    environment: process.env.BYBIT_ENV ?? "prod",
    api: "bybit.futures.ws.orderbook",
    serviceMethod: "CryptoFuturesRealtimeService.subscribeCryptoFuturesOrderBook",
    inputSummary: { symbol: "BTCUSDT", depth: 50 },
    run: () => services.futuresRealtime.subscribeCryptoFuturesOrderBook("bybit", { symbol: "BTCUSDT" }, {}, { depth: 50 }),
    summarize: summarizeRealtimeResult,
  });
} finally {
  binanceWs.close();
  bybitWs.close();
}

async function summarizeRealtimeResult(response) {
  await response?.unsubscribe?.();
  return {
    brokerResponseCode: null,
    notes: response?.ok ? "crypto public realtime subscription created; no private stream used" : response?.error?.message,
    response: {
      ok: response?.ok,
      exchange: response?.exchange,
      id: response?.id,
      status: response?.status,
      data: response?.ok ? {
        key: response.data.key,
        streamKind: response.data.streamKind,
        subscription: {
          id: response.data.subscription?.id,
          product: response.data.subscription?.product,
          streamKind: response.data.subscription?.streamKind,
          action: response.data.subscription?.action,
        },
      } : null,
      error: response?.error ? {
        code: response.error.code,
        message: response.error.message,
        retryable: response.error.retryable,
      } : null,
    },
  };
}
