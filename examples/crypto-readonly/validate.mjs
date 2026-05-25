import {
  CryptoExchangeClient,
  CryptoFuturesAccountService,
  CryptoSpotOrderService,
  CryptoSpotQuoteService,
} from "../../src/index.mjs";

const clients = {
  binance: new CryptoExchangeClient("binance", {
    fetch: mockCryptoFetch,
  }),
  bybit: new CryptoExchangeClient("bybit", {
    apiKey: "validate-only-api-key",
    apiSecret: "validate-only-secret",
    env: "mock",
    fetch: mockCryptoFetch,
    now: () => 1_700_000_000_000,
  }),
};

async function mockCryptoFetch(url) {
  const parsed = new URL(url);

  if (parsed.hostname.includes("binance") && parsed.pathname.endsWith("/ticker/price")) {
    return jsonResponse({ symbol: parsed.searchParams.get("symbol"), price: "70000" });
  }

  if (parsed.hostname.includes("bybit") && parsed.pathname === "/v5/position/list") {
    return jsonResponse({
      retCode: 0,
      result: {
        list: [
          { symbol: parsed.searchParams.get("symbol") ?? "BTCUSDT", positionAmt: "0.01", entryPrice: "70000", leverage: "2" },
        ],
      },
    });
  }

  throw new Error(`Unexpected validate-only crypto request: ${url}`);
}

function jsonResponse(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

const spotQuote = new CryptoSpotQuoteService(clients);
const spotOrder = new CryptoSpotOrderService();
const futuresAccount = new CryptoFuturesAccountService(clients);

const checks = [];

checks.push(await spotQuote.getCryptoSpotCurrentPrice("binance", { symbol: "BTCUSDT" }));
checks.push(await spotOrder.buyCryptoSpot("upbit", {
  symbol: "KRW-BTC",
  quoteQuantity: 10000,
}, {
  maxNotional: 50000,
  allowedSymbols: ["KRW-BTC"],
}));
checks.push(await futuresAccount.getCryptoFuturesPositions("bybit", { symbol: "BTCUSDT" }));
checks.push(await futuresAccount.getCryptoFuturesPositions("upbit", { symbol: "BTCUSDT" }));

const summary = checks.map((result) => ({
  exchange: result.exchange,
  capability: result.capability,
  id: result.id,
  ok: result.ok,
  dryRun: result.dryRun ?? false,
  errorCode: result.error?.code ?? null,
  sensitiveDataMasked: "yes",
}));

console.log(JSON.stringify({
  mode: "validate-only",
  orderApiCalled: false,
  transferApiCalled: false,
  leverageMutationCalled: false,
  checks: summary,
}, null, 2));

if (!checks[0].ok || !checks[1].ok || !checks[2].ok) {
  throw new Error("Crypto validate-only examples should pass for service-ready scenarios");
}

if (checks[3].ok || checks[3].error?.code !== "UNSUPPORTED_CAPABILITY") {
  throw new Error("Domestic crypto futures scenario should return unsupported");
}
