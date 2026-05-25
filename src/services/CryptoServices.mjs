import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertCryptoExchange } from "../core/index.mjs";

const SPOT_CURRENT_PRICE = "cryptoSpot.quote.currentPrice";
const SPOT_ORDER_BOOK = "cryptoSpot.quote.orderBook";
const SPOT_CANDLES = "cryptoSpot.marketData.candles";
const SPOT_BALANCE = "cryptoSpot.account.balance";
const SPOT_ORDER_NEW = "cryptoSpot.order.new";
const SPOT_ORDER_CANCEL = "cryptoSpot.order.cancel";
const SPOT_REALTIME_TRADE = "cryptoSpot.realtime.trade";
const SPOT_REALTIME_ORDER_BOOK = "cryptoSpot.realtime.orderBook";

const FUTURES_CURRENT_PRICE = "cryptoFutures.quote.currentPrice";
const FUTURES_CANDLES = "cryptoFutures.marketData.candles";
const FUTURES_BALANCE = "cryptoFutures.account.balance";
const FUTURES_POSITIONS = "cryptoFutures.account.positions";
const FUTURES_ORDER_NEW = "cryptoFutures.order.new";
const FUTURES_ORDER_CANCEL = "cryptoFutures.order.cancel";
const FUTURES_REALTIME_TRADE = "cryptoFutures.realtime.trade";
const FUTURES_REALTIME_ORDER_BOOK = "cryptoFutures.realtime.orderBook";

export class CryptoSpotQuoteService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getCryptoSpotCurrentPrice(exchange, identity, options = {}) {
    return requestReadOnly({
      clients: this.clients,
      exchange,
      capabilityId: SPOT_CURRENT_PRICE,
      params: buildMarketParams(exchange, "spot", identity, options),
      requestOptions: options.requestOptions,
      normalize: normalizeCryptoSpotCurrentPrice,
    });
  }

  async getCryptoSpotOrderBook(exchange, identity, options = {}) {
    return requestReadOnly({
      clients: this.clients,
      exchange,
      capabilityId: SPOT_ORDER_BOOK,
      params: { ...buildMarketParams(exchange, "spot", identity, options), limit: options.limit ?? options.size ?? 20 },
      requestOptions: options.requestOptions,
      normalize: normalizeCryptoSpotOrderBook,
    });
  }
}

export class CryptoSpotMarketDataService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getCryptoSpotCandles(exchange, identity, options = {}) {
    return requestReadOnly({
      clients: this.clients,
      exchange,
      capabilityId: SPOT_CANDLES,
      params: {
        ...buildMarketParams(exchange, "spot", identity, options),
        interval: normalizeInterval(options.interval ?? "1d"),
        limit: normalizeLimit(options.limit ?? options.count ?? 200),
        startTime: options.startTime ?? options.from ?? null,
        endTime: options.endTime ?? options.to ?? null,
      },
      requestOptions: options.requestOptions,
      normalize: normalizeCryptoSpotCandles,
    });
  }
}

export class CryptoSpotAccountService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getCryptoSpotBalance(exchange, options = {}) {
    return requestReadOnly({
      clients: this.clients,
      exchange,
      capabilityId: SPOT_BALANCE,
      params: mergeParams({ accountType: "spot" }, options.params),
      requestOptions: options.requestOptions,
      normalize: normalizeCryptoSpotBalance,
    });
  }
}

export class CryptoSpotOrderService {
  async buyCryptoSpot(exchange, order = {}, options = {}) {
    return previewCryptoOrder(exchange, SPOT_ORDER_NEW, "buy", "spot", order, options);
  }

  async sellCryptoSpot(exchange, order = {}, options = {}) {
    return previewCryptoOrder(exchange, SPOT_ORDER_NEW, "sell", "spot", order, options);
  }

  async cancelCryptoSpotOrder(exchange, order = {}, options = {}) {
    return previewCryptoCancel(exchange, SPOT_ORDER_CANCEL, "spot", order, options);
  }
}

export class CryptoSpotRealtimeService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async subscribeCryptoSpotTrades(exchange, identity, handlers = {}, options = {}) {
    return subscribeCrypto({
      clients: this.clients,
      exchange,
      identity,
      capabilityId: SPOT_REALTIME_TRADE,
      streamKind: "trade",
      handlers,
      options,
    });
  }

  async subscribeCryptoSpotOrderBook(exchange, identity, handlers = {}, options = {}) {
    return subscribeCrypto({
      clients: this.clients,
      exchange,
      identity,
      capabilityId: SPOT_REALTIME_ORDER_BOOK,
      streamKind: "orderBook",
      handlers,
      options,
    });
  }
}

export class CryptoFuturesQuoteService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getCryptoFuturesCurrentPrice(exchange, identity, options = {}) {
    return requestReadOnly({
      clients: this.clients,
      exchange,
      capabilityId: FUTURES_CURRENT_PRICE,
      params: buildMarketParams(exchange, "futures", identity, options),
      requestOptions: options.requestOptions,
      normalize: normalizeCryptoFuturesCurrentPrice,
    });
  }
}

export class CryptoFuturesMarketDataService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getCryptoFuturesCandles(exchange, identity, options = {}) {
    return requestReadOnly({
      clients: this.clients,
      exchange,
      capabilityId: FUTURES_CANDLES,
      params: {
        ...buildMarketParams(exchange, "futures", identity, options),
        interval: normalizeInterval(options.interval ?? "1d"),
        limit: normalizeLimit(options.limit ?? options.count ?? 200),
        startTime: options.startTime ?? options.from ?? null,
        endTime: options.endTime ?? options.to ?? null,
      },
      requestOptions: options.requestOptions,
      normalize: normalizeCryptoFuturesCandles,
    });
  }
}

export class CryptoFuturesAccountService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getCryptoFuturesBalance(exchange, options = {}) {
    return requestReadOnly({
      clients: this.clients,
      exchange,
      capabilityId: FUTURES_BALANCE,
      params: mergeParams({ accountType: "futures", contractType: options.contractType ?? "linearPerp" }, options.params),
      requestOptions: options.requestOptions,
      normalize: normalizeCryptoFuturesBalance,
    });
  }

  async getCryptoFuturesPositions(exchange, options = {}) {
    return requestReadOnly({
      clients: this.clients,
      exchange,
      capabilityId: FUTURES_POSITIONS,
      params: mergeParams({ accountType: "futures", contractType: options.contractType ?? "linearPerp", symbol: options.symbol ?? null }, options.params),
      requestOptions: options.requestOptions,
      normalize: normalizeCryptoFuturesPositions,
    });
  }
}

export class CryptoFuturesOrderService {
  async openCryptoFuturesPosition(exchange, order = {}, options = {}) {
    return previewCryptoOrder(exchange, FUTURES_ORDER_NEW, order.side ?? "buy", "futures", order, options);
  }

  async closeCryptoFuturesPosition(exchange, order = {}, options = {}) {
    return previewCryptoOrder(exchange, FUTURES_ORDER_NEW, order.side ?? "sell", "futures", { ...order, reduceOnly: true }, options);
  }

  async cancelCryptoFuturesOrder(exchange, order = {}, options = {}) {
    return previewCryptoCancel(exchange, FUTURES_ORDER_CANCEL, "futures", order, options);
  }
}

export class CryptoFuturesRealtimeService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async subscribeCryptoFuturesTrades(exchange, identity, handlers = {}, options = {}) {
    return subscribeCrypto({
      clients: this.clients,
      exchange,
      identity,
      capabilityId: FUTURES_REALTIME_TRADE,
      streamKind: "trade",
      handlers,
      options,
    });
  }

  async subscribeCryptoFuturesOrderBook(exchange, identity, handlers = {}, options = {}) {
    return subscribeCrypto({
      clients: this.clients,
      exchange,
      identity,
      capabilityId: FUTURES_REALTIME_ORDER_BOOK,
      streamKind: "orderBook",
      handlers,
      options,
    });
  }
}

async function requestReadOnly({ clients, exchange, capabilityId, params, requestOptions = {}, normalize }) {
  let normalizedExchange = String(exchange ?? "").trim().toLowerCase();
  let source = null;

  try {
    normalizedExchange = assertCryptoExchange(normalizedExchange);
    source = selectCryptoSource(normalizedExchange, capabilityId, "rest");
    const client = clients[normalizedExchange];
    if (!client?.request) {
      throw BrokerError.config(`Missing crypto exchange client: ${normalizedExchange}`, {
        broker: normalizedExchange,
        details: { exchange: normalizedExchange },
      });
    }

    const result = await client.request(source.id, params, requestOptions);
    if (!result.ok) {
      return failureResponse({ exchange: normalizedExchange, source, capabilityId, error: result.error, result });
    }

    return {
      ok: true,
      broker: normalizedExchange,
      exchange: normalizedExchange,
      capability: capabilityId,
      id: source.id,
      data: normalize(normalizedExchange, source.id, result.data),
      raw: result.raw ?? result.data,
      headers: result.headers ?? {},
      status: result.status ?? 200,
      continuation: result.continuation,
    };
  } catch (error) {
    return failureResponse({ exchange: normalizedExchange || "unknown", source, capabilityId, error });
  }
}

function previewCryptoOrder(exchange, capabilityId, side, product, order, options) {
  let normalizedExchange = String(exchange ?? "").trim().toLowerCase();
  let source = null;

  try {
    normalizedExchange = assertCryptoExchange(normalizedExchange);
    source = selectCryptoSource(normalizedExchange, capabilityId, "rest");
    const normalized = normalizeCryptoOrder(product, side, order);
    const request = buildCryptoOrderRequest(normalizedExchange, normalized);
    const safety = evaluateCryptoOrderSafety(normalized, request, options);

    if (!safety.allowed) {
      throw BrokerError.validation(safety.reason, {
        broker: normalizedExchange,
        id: source.id,
        details: safety,
      });
    }

    return {
      ok: true,
      broker: normalizedExchange,
      exchange: normalizedExchange,
      capability: capabilityId,
      id: source.id,
      dryRun: true,
      data: {
        exchange: normalizedExchange,
        product,
        side: normalized.side,
        request: mergeParams(request, order.params),
        normalized,
        safety,
        source: { broker: normalizedExchange, id: source.id, capabilityId },
      },
      raw: null,
      headers: {},
      status: 0,
    };
  } catch (error) {
    return failureResponse({ exchange: normalizedExchange || "unknown", source, capabilityId, error });
  }
}

function previewCryptoCancel(exchange, capabilityId, product, order, options) {
  let normalizedExchange = String(exchange ?? "").trim().toLowerCase();
  let source = null;

  try {
    normalizedExchange = assertCryptoExchange(normalizedExchange);
    source = selectCryptoSource(normalizedExchange, capabilityId, "rest");
    const symbol = normalizeSymbol(order.symbol);
    const orderId = normalizeRequiredString(order.orderId ?? order.clientOrderId, "orderId");
    const request = mergeParams({
      symbol,
      orderId,
      clientOrderId: order.clientOrderId ?? null,
      product,
    }, order.params);

    return {
      ok: true,
      broker: normalizedExchange,
      exchange: normalizedExchange,
      capability: capabilityId,
      id: source.id,
      dryRun: true,
      data: {
        exchange: normalizedExchange,
        product,
        side: "cancel",
        request,
        normalized: { product, symbol, orderId },
        safety: {
          allowed: true,
          reason: "Cancel preview does not submit an exchange request",
          liveSubmissionSupported: false,
          orderValue: 0,
          rules: summarizeRules(options),
          checks: [],
        },
        source: { broker: normalizedExchange, id: source.id, capabilityId },
      },
      raw: null,
      headers: {},
      status: 0,
    };
  } catch (error) {
    return failureResponse({ exchange: normalizedExchange || "unknown", source, capabilityId, error });
  }
}

async function subscribeCrypto({ clients, exchange, identity, capabilityId, streamKind, handlers, options }) {
  let normalizedExchange = String(exchange ?? "").trim().toLowerCase();
  let source = null;

  try {
    normalizedExchange = assertCryptoExchange(normalizedExchange);
    source = selectCryptoSource(normalizedExchange, capabilityId, "websocket");
    const client = clients[normalizedExchange];
    if (!client?.subscribe) {
      throw BrokerError.config(`Missing crypto realtime client: ${normalizedExchange}`, {
        broker: normalizedExchange,
        details: { exchange: normalizedExchange },
      });
    }

    const key = normalizeSymbol(identity?.symbol ?? identity);
    const subscription = await client.subscribe(source.id, key, { ...options, streamKind, handlers });
    return {
      ok: true,
      broker: normalizedExchange,
      exchange: normalizedExchange,
      capability: capabilityId,
      id: source.id,
      data: {
        exchange: normalizedExchange,
        key,
        streamKind,
        subscription,
      },
      raw: subscription,
      headers: {},
      status: 0,
      unsubscribe: () => client.unsubscribe?.(source.id, key, { ...options, streamKind }),
    };
  } catch (error) {
    return failureResponse({ exchange: normalizedExchange || "unknown", source, capabilityId, error });
  }
}

function selectCryptoSource(exchange, capabilityId, transport) {
  const caps = getCapabilities(exchange);
  if (!caps.supports(capabilityId)) {
    throw BrokerError.unsupported(`${exchange} does not support ${capabilityId}`, {
      broker: exchange,
      details: { exchange, capabilityId },
    });
  }

  const source = caps.findApis(capabilityId, { status: "serviceReady" }).find((api) => api.transport === transport);
  if (!source) {
    throw BrokerError.unsupported(`${exchange} does not expose a ${transport} source for ${capabilityId}`, {
      broker: exchange,
      details: { exchange, capabilityId, transport },
    });
  }

  return source;
}

function buildMarketParams(exchange, product, identity, options = {}) {
  const normalized = normalizeIdentity(identity);
  const symbol = normalized.symbol;
  const market = normalized.market ?? defaultMarket(exchange, symbol);
  return mergeParams({
    exchange,
    product,
    symbol,
    market,
    baseAsset: normalized.baseAsset,
    quoteAsset: normalized.quoteAsset,
    contractType: product === "futures" ? normalized.contractType ?? "linearPerp" : undefined,
    marginAsset: product === "futures" ? normalized.marginAsset ?? normalized.quoteAsset ?? "USDT" : undefined,
  }, options.params);
}

function normalizeIdentity(identity) {
  if (typeof identity === "string") {
    return { symbol: normalizeSymbol(identity) };
  }

  return {
    symbol: normalizeSymbol(identity?.symbol ?? identity?.market),
    market: normalizeOptionalString(identity?.market),
    baseAsset: normalizeOptionalString(identity?.baseAsset),
    quoteAsset: normalizeOptionalString(identity?.quoteAsset),
    contractType: normalizeOptionalString(identity?.contractType),
    marginAsset: normalizeOptionalString(identity?.marginAsset),
  };
}

function normalizeCryptoOrder(product, side, order) {
  const price = normalizeOptionalNumber(order.price, "price");
  const quantity = normalizeOptionalNumber(order.quantity ?? order.qty, "quantity");
  const quoteQuantity = normalizeOptionalNumber(order.quoteQuantity ?? order.quoteQty, "quoteQuantity");
  if (quantity === null && quoteQuantity === null) {
    throw BrokerError.validation("Crypto order requires quantity or quoteQuantity");
  }

  return {
    product,
    symbol: normalizeSymbol(order.symbol),
    side: normalizeSide(side),
    orderType: normalizeOrderType(order.orderType ?? order.type),
    quantity,
    quoteQuantity,
    price,
    reduceOnly: Boolean(order.reduceOnly),
    leverage: normalizeOptionalNumber(order.leverage, "leverage"),
    timeInForce: normalizeOptionalString(order.timeInForce) ?? "GTC",
  };
}

function buildCryptoOrderRequest(exchange, order) {
  return {
    exchange,
    product: order.product,
    symbol: order.symbol,
    side: order.side.toUpperCase(),
    type: order.orderType.toUpperCase(),
    quantity: order.quantity,
    quoteQuantity: order.quoteQuantity,
    price: order.price,
    timeInForce: order.timeInForce,
    reduceOnly: order.product === "futures" ? order.reduceOnly : undefined,
    leverage: order.product === "futures" ? order.leverage : undefined,
  };
}

function evaluateCryptoOrderSafety(order, request, options = {}) {
  const rules = {
    maxNotional: normalizeOptionalNumber(options.maxNotional ?? options.maxOrderAmount, "maxNotional"),
    maxLeverage: normalizeOptionalNumber(options.maxLeverage, "maxLeverage"),
    allowedSymbols: normalizeSymbolSet(options.allowedSymbols),
    blockedSymbols: normalizeSymbolSet(options.blockedSymbols),
  };
  const orderValue = estimateOrderValue(order);
  const checks = [];

  if (rules.allowedSymbols && !rules.allowedSymbols.has(order.symbol)) {
    checks.push({ ok: false, code: "SYMBOL_NOT_ALLOWED", message: `Symbol ${order.symbol} is not in allowedSymbols` });
  }
  if (rules.blockedSymbols?.has(order.symbol)) {
    checks.push({ ok: false, code: "SYMBOL_BLOCKED", message: `Symbol ${order.symbol} is in blockedSymbols` });
  }
  if (rules.maxNotional !== null && orderValue !== null && orderValue > rules.maxNotional) {
    checks.push({ ok: false, code: "ORDER_VALUE_EXCEEDED", message: `Order value ${orderValue} exceeds maxNotional ${rules.maxNotional}` });
  }
  if (rules.maxLeverage !== null && order.leverage !== null && order.leverage > rules.maxLeverage) {
    checks.push({ ok: false, code: "LEVERAGE_EXCEEDED", message: `Leverage ${order.leverage} exceeds maxLeverage ${rules.maxLeverage}` });
  }

  const failed = checks.find((check) => !check.ok);
  return {
    allowed: !failed,
    reason: failed?.message ?? "Crypto order preview safety checks passed",
    failedCode: failed?.code ?? null,
    liveSubmissionSupported: false,
    requiresMarketOrderConfirmation: order.orderType === "market",
    orderValue,
    request: maskSensitive(request),
    rules: summarizeRules(options, rules),
    checks,
  };
}

function summarizeRules(options = {}, normalizedRules = {}) {
  return {
    maxNotional: normalizedRules.maxNotional ?? normalizeOptionalNumber(options.maxNotional ?? options.maxOrderAmount, "maxNotional"),
    maxLeverage: normalizedRules.maxLeverage ?? normalizeOptionalNumber(options.maxLeverage, "maxLeverage"),
    allowedSymbols: normalizedRules.allowedSymbols ? [...normalizedRules.allowedSymbols] : options.allowedSymbols ?? null,
    blockedSymbols: normalizedRules.blockedSymbols ? [...normalizedRules.blockedSymbols] : options.blockedSymbols ?? null,
  };
}

function estimateOrderValue(order) {
  if (order.quoteQuantity !== null) return order.quoteQuantity;
  if (order.quantity !== null && order.price !== null) return order.quantity * order.price;
  return null;
}

export function normalizeCryptoSpotCurrentPrice(exchange, sourceId, payload) {
  return normalizeCryptoCurrentPrice(exchange, sourceId, "spot", payload);
}

export function normalizeCryptoFuturesCurrentPrice(exchange, sourceId, payload) {
  return normalizeCryptoCurrentPrice(exchange, sourceId, "futures", payload);
}

function normalizeCryptoCurrentPrice(exchange, sourceId, product, payload) {
  const block = Array.isArray(payload)
    ? payload[0] ?? {}
    : payload?.result?.list?.[0] ?? payload?.tickers?.[0] ?? payload ?? {};
  return {
    exchange,
    product,
    symbol: nullableString(firstValue(block, ["symbol", "market", "code", "s"])),
    price: parseNumber(firstValue(block, ["price", "trade_price", "closing_price", "lastPrice", "last", "c"])),
    priceRaw: nullableString(firstValue(block, ["price", "trade_price", "closing_price", "lastPrice", "last", "c"])),
    raw: payload,
    source: { broker: exchange, id: sourceId },
  };
}

export function normalizeCryptoSpotOrderBook(exchange, sourceId, payload) {
  const block = Array.isArray(payload) ? payload[0] ?? {} : payload ?? {};
  const units = block?.orderbook_units ?? block?.bids ?? block?.asks ?? block?.data ?? [];
  const bids = Array.isArray(block?.bids)
    ? block.bids
    : Array.isArray(units)
      ? units.map((unit) => ({ price: firstValue(unit, ["bid_price", "price"]), quantity: firstValue(unit, ["bid_size", "quantity", "size"]) }))
      : [];
  const asks = Array.isArray(block?.asks)
    ? block.asks
    : Array.isArray(units)
      ? units.map((unit) => ({ price: firstValue(unit, ["ask_price", "price"]), quantity: firstValue(unit, ["ask_size", "quantity", "size"]) }))
      : [];
  return {
    exchange,
    product: "spot",
    symbol: nullableString(firstValue(block, ["symbol", "market", "code"])),
    bids: bids.map(normalizeBookLevel),
    asks: asks.map(normalizeBookLevel),
    raw: payload,
    source: { broker: exchange, id: sourceId },
  };
}

export function normalizeCryptoSpotCandles(exchange, sourceId, payload) {
  return normalizeCryptoCandles(exchange, sourceId, "spot", payload);
}

export function normalizeCryptoFuturesCandles(exchange, sourceId, payload) {
  return normalizeCryptoCandles(exchange, sourceId, "futures", payload);
}

function normalizeCryptoCandles(exchange, sourceId, product, payload) {
  const rows = Array.isArray(payload) ? payload : payload?.result?.list ?? payload?.data ?? payload?.candles ?? payload?.chart ?? [];
  return {
    exchange,
    product,
    interval: nullableString(payload?.interval),
    candles: rows.map(normalizeCandle),
    raw: payload,
    source: { broker: exchange, id: sourceId },
  };
}

export function normalizeCryptoSpotBalance(exchange, sourceId, payload) {
  return normalizeCryptoBalance(exchange, sourceId, "spot", payload);
}

export function normalizeCryptoFuturesBalance(exchange, sourceId, payload) {
  return normalizeCryptoBalance(exchange, sourceId, "futures", payload);
}

function normalizeCryptoBalance(exchange, sourceId, product, payload) {
  const rows = payload?.balances ?? payload?.assets ?? payload?.result?.list?.[0]?.coin ?? payload?.result?.list ?? payload?.data ?? [];
  return {
    exchange,
    product,
    balances: (Array.isArray(rows) ? rows : []).map((row) => ({
      asset: nullableString(firstValue(row, ["asset", "currency", "coin"])),
      free: parseNumber(firstValue(row, ["free", "available", "availableBalance"])),
      locked: parseNumber(firstValue(row, ["locked", "hold", "freeze"])),
      total: parseNumber(firstValue(row, ["total", "balance", "walletBalance"])),
      raw: row,
    })),
    raw: payload,
    source: { broker: exchange, id: sourceId },
  };
}

export function normalizeCryptoFuturesPositions(exchange, sourceId, payload) {
  const rows = payload?.positions ?? payload?.result?.list ?? payload?.data ?? payload ?? [];
  return {
    exchange,
    product: "futures",
    positions: (Array.isArray(rows) ? rows : [rows]).filter(Boolean).map((row) => ({
      symbol: nullableString(firstValue(row, ["symbol", "market"])),
      side: normalizeOptionalString(firstValue(row, ["side", "positionSide"])),
      quantity: parseNumber(firstValue(row, ["quantity", "positionAmt", "size"])),
      entryPrice: parseNumber(firstValue(row, ["entryPrice", "avgPrice"])),
      leverage: parseNumber(firstValue(row, ["leverage"])),
      unrealizedPnl: parseNumber(firstValue(row, ["unrealizedPnl", "unrealisedPnl"])),
      raw: row,
    })),
    raw: payload,
    source: { broker: exchange, id: sourceId },
  };
}

function normalizeBookLevel(level) {
  if (Array.isArray(level)) {
    return { price: parseNumber(level[0]), quantity: parseNumber(level[1]), raw: level };
  }

  return {
    price: parseNumber(firstValue(level, ["price", "bid_price", "ask_price", "p"])),
    quantity: parseNumber(firstValue(level, ["quantity", "size", "bid_size", "ask_size", "q"])),
    raw: level,
  };
}

function normalizeCandle(row) {
  if (Array.isArray(row)) {
    return {
      time: nullableString(row[0]),
      open: parseNumber(row[1]),
      high: parseNumber(row[2]),
      low: parseNumber(row[3]),
      close: parseNumber(row[4]),
      volume: parseNumber(row[5]),
      raw: row,
    };
  }

  return {
    time: nullableString(firstValue(row, ["time", "timestamp", "candle_date_time_utc", "t"])),
    open: parseNumber(firstValue(row, ["open", "opening_price", "o"])),
    high: parseNumber(firstValue(row, ["high", "high_price", "h"])),
    low: parseNumber(firstValue(row, ["low", "low_price", "l"])),
    close: parseNumber(firstValue(row, ["close", "trade_price", "c"])),
    volume: parseNumber(firstValue(row, ["volume", "candle_acc_trade_volume", "v"])),
    amount: parseNumber(firstValue(row, ["amount", "candle_acc_trade_price", "q"])),
    raw: row,
  };
}

function normalizeSymbol(value) {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (!normalized) {
    throw BrokerError.validation("Crypto symbol is required");
  }
  return normalized;
}

function normalizeSide(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!["buy", "sell"].includes(normalized)) {
    throw BrokerError.validation("Crypto order side must be buy or sell", { details: { side: value } });
  }
  return normalized;
}

function normalizeOrderType(value) {
  const normalized = String(value ?? "market").trim().toLowerCase();
  if (!["market", "limit"].includes(normalized)) {
    throw BrokerError.validation("Crypto order type must be market or limit", { details: { orderType: value } });
  }
  return normalized;
}

function normalizeRequiredString(value, field) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation(`${field} is required`, { details: { field } });
  }
  return normalized;
}

function normalizeOptionalString(value) {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}

function normalizeOptionalNumber(value, field) {
  if (value === undefined || value === null || value === "") return null;
  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized < 0) {
    throw BrokerError.validation(`${field} must be a non-negative number`, { details: { [field]: value } });
  }
  return normalized;
}

function normalizeLimit(value) {
  const normalized = Number(value);
  if (!Number.isInteger(normalized) || normalized <= 0) {
    throw BrokerError.validation("Crypto candle limit must be a positive integer", { details: { limit: value } });
  }
  return normalized;
}

function normalizeInterval(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation("Crypto candle interval is required");
  }
  return normalized;
}

function normalizeSymbolSet(symbols) {
  if (symbols === undefined || symbols === null) return null;
  if (!Array.isArray(symbols)) {
    throw BrokerError.validation("Crypto symbol safety lists must be arrays");
  }
  return new Set(symbols.map(normalizeSymbol));
}

function defaultMarket(exchange, symbol) {
  if (["upbit", "bithumb", "coinone"].includes(exchange) && !symbol.includes("-")) {
    return `KRW-${symbol}`;
  }
  return symbol;
}

function parseNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function nullableString(value) {
  if (value === undefined || value === null || value === "") return null;
  return String(value);
}

function firstValue(source, keys) {
  if (!source || typeof source !== "object") return undefined;
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
      return source[key];
    }
  }
  return undefined;
}

function mergeParams(base, override) {
  if (!override || typeof override !== "object") return base;
  if (!base || typeof base !== "object") return override;
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      merged[key] &&
      typeof merged[key] === "object" &&
      !Array.isArray(merged[key])
    ) {
      merged[key] = mergeParams(merged[key], value);
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

function maskSensitive(value) {
  if (Array.isArray(value)) return value.map(maskSensitive);
  if (!value || typeof value !== "object") return value;
  const masked = {};
  for (const [key, child] of Object.entries(value)) {
    masked[key] = /key|secret|signature|token|account/i.test(key) ? "***" : maskSensitive(child);
  }
  return masked;
}

function failureResponse({ exchange, source, result, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Crypto service failed", {
        broker: exchange,
        cause: error,
      });

  return {
    ok: false,
    broker: exchange,
    exchange,
    capability: capabilityId,
    id: source?.id ?? result?.id ?? null,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
}
