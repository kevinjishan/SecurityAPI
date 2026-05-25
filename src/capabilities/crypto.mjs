const EXCHANGES = ["binance", "bingx", "bybit", "upbit", "bithumb", "coinone"];
const FUTURES_EXCHANGES = new Set(["binance", "bingx", "bybit"]);

export const CRYPTO_CAPABILITIES = Object.freeze(Object.fromEntries(
  EXCHANGES.map((exchange) => [exchange, Object.freeze([
    capability("cryptoSpot.quote.currentPrice", `${exchange}.spot.ticker`, "ticker"),
    capability("cryptoSpot.quote.orderBook", `${exchange}.spot.orderbook`, "orderBook"),
    capability("cryptoSpot.marketData.candles", `${exchange}.spot.candles`, "candles"),
    capability("cryptoSpot.account.balance", `${exchange}.spot.balance`, "balance"),
    capability("cryptoSpot.order.new", `${exchange}.spot.order.preview`, "orderPreview"),
    capability("cryptoSpot.order.cancel", `${exchange}.spot.cancel.preview`, "cancelPreview"),
    capability("cryptoSpot.realtime.trade", `${exchange}.spot.ws.trade`, "tradeStream", "websocket"),
    capability("cryptoSpot.realtime.orderBook", `${exchange}.spot.ws.orderbook`, "orderBookStream", "websocket"),
    futuresCapability(exchange, "cryptoFutures.quote.currentPrice", "ticker"),
    futuresCapability(exchange, "cryptoFutures.marketData.candles", "candles"),
    futuresCapability(exchange, "cryptoFutures.account.balance", "balance"),
    futuresCapability(exchange, "cryptoFutures.account.positions", "positions"),
    futuresCapability(exchange, "cryptoFutures.order.new", "orderPreview"),
    futuresCapability(exchange, "cryptoFutures.order.cancel", "cancelPreview"),
    futuresCapability(exchange, "cryptoFutures.realtime.trade", "tradeStream", "websocket"),
    futuresCapability(exchange, "cryptoFutures.realtime.orderBook", "orderBookStream", "websocket"),
  ])]),
));

function capability(id, apiId, role, transport = "rest", status = "serviceReady") {
  return {
    id,
    status,
    apis: [{ id: apiId, role, transport }],
  };
}

function futuresCapability(exchange, id, role, transport = "rest") {
  const status = FUTURES_EXCHANGES.has(exchange) ? "serviceReady" : "parked";
  const apis = status === "serviceReady"
    ? [{ id: `${exchange}.futures.${roleId(role)}`, role, transport }]
    : [];
  return { id, status, apis };
}

function roleId(role) {
  if (role === "tradeStream") return "ws.trade";
  if (role === "orderBookStream") return "ws.orderbook";
  if (role === "orderPreview") return "order.preview";
  if (role === "cancelPreview") return "cancel.preview";
  return role;
}
