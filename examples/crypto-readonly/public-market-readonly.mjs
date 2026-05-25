import {
  buildCryptoRestClient,
  buildCryptoServices,
  runReadOnlyScenario,
  summarizeCollection,
} from "../live-readonly/_shared.mjs";

const binance = buildCryptoRestClient("binance");
const upbit = buildCryptoRestClient("upbit");
const services = buildCryptoServices({
  rest: { binance, upbit },
  ws: {},
});

await runReadOnlyScenario({
  scenario: "binance crypto spot current price",
  broker: "binance",
  environment: process.env.BINANCE_ENV ?? "prod",
  api: "binance.spot.ticker",
  serviceMethod: "CryptoSpotQuoteService.getCryptoSpotCurrentPrice",
  inputSummary: { symbol: "BTCUSDT" },
  run: () => services.spotQuote.getCryptoSpotCurrentPrice("binance", { symbol: "BTCUSDT" }),
  summarize: summarizeCryptoResult,
});

await runReadOnlyScenario({
  scenario: "upbit crypto spot order book",
  broker: "upbit",
  environment: process.env.UPBIT_ENV ?? "prod",
  api: "upbit.spot.orderbook",
  serviceMethod: "CryptoSpotQuoteService.getCryptoSpotOrderBook",
  inputSummary: { symbol: "KRW-BTC", limit: 15 },
  run: () => services.spotQuote.getCryptoSpotOrderBook("upbit", { symbol: "KRW-BTC" }, { limit: 15 }),
  summarize: summarizeCryptoResult,
});

await runReadOnlyScenario({
  scenario: "binance crypto spot candles",
  broker: "binance",
  environment: process.env.BINANCE_ENV ?? "prod",
  api: "binance.spot.candles",
  serviceMethod: "CryptoSpotMarketDataService.getCryptoSpotCandles",
  inputSummary: { symbol: "BTCUSDT", interval: "1d", limit: 5 },
  run: () => services.spotMarketData.getCryptoSpotCandles("binance", { symbol: "BTCUSDT" }, { interval: "1d", limit: 5 }),
  summarize: summarizeCryptoResult,
});

function summarizeCryptoResult(response) {
  return {
    brokerResponseCode: response?.raw?.code ?? response?.raw?.retCode ?? response?.raw?.result ?? null,
    notes: response?.ok ? "crypto public read-only response received" : response?.error?.message,
    response: {
      ok: response?.ok,
      exchange: response?.exchange,
      id: response?.id,
      status: response?.status,
      data: response?.ok ? summarizeCryptoData(response.data) : null,
      error: response?.error ? {
        code: response.error.code,
        message: response.error.message,
        retryable: response.error.retryable,
      } : null,
    },
  };
}

function summarizeCryptoData(data) {
  if (!data || typeof data !== "object") return null;
  return {
    exchange: data.exchange,
    product: data.product,
    symbol: data.symbol,
    price: data.price,
    bids: Array.isArray(data.bids) ? data.bids.slice(0, 1) : undefined,
    asks: Array.isArray(data.asks) ? data.asks.slice(0, 1) : undefined,
    candles: Array.isArray(data.candles) ? data.candles.slice(0, 1).map((row) => summarizeCollection(row, ["time", "open", "high", "low", "close", "volume"])) : undefined,
  };
}
