import { BrokerError, assertCryptoExchange } from "../core/index.mjs";

const DEFAULT_CONNECT_TIMEOUT_MS = 10_000;

const WS_URLS = Object.freeze({
  binance: {
    prod: { spot: "wss://stream.binance.com:9443/ws", futures: "wss://fstream.binance.com/ws" },
    mock: { spot: "wss://testnet.binance.vision/ws", futures: "wss://stream.binancefuture.com/ws" },
  },
  bingx: {
    prod: { spot: "wss://open-api-ws.bingx.com/market", futures: "wss://open-api-ws.bingx.com/market" },
    mock: { spot: "wss://open-api-ws.bingx.com/market", futures: "wss://open-api-ws.bingx.com/market" },
  },
  bybit: {
    prod: { spot: "wss://stream.bybit.com/v5/public/spot", futures: "wss://stream.bybit.com/v5/public/linear" },
    mock: { spot: "wss://stream-testnet.bybit.com/v5/public/spot", futures: "wss://stream-testnet.bybit.com/v5/public/linear" },
  },
  upbit: {
    prod: { spot: "wss://api.upbit.com/websocket/v1" },
    mock: { spot: "wss://api.upbit.com/websocket/v1" },
  },
  bithumb: {
    prod: { spot: "wss://ws-api.bithumb.com/websocket/v1" },
    mock: { spot: "wss://ws-api.bithumb.com/websocket/v1" },
  },
  coinone: {
    prod: { spot: "wss://stream.coinone.co.kr" },
    mock: { spot: "wss://stream.coinone.co.kr" },
  },
});

export class CryptoWebSocketClient {
  constructor(exchange, config = {}) {
    this.exchange = assertCryptoExchange(exchange);
    this.broker = this.exchange;
    this.env = config.env ?? "prod";
    this.WebSocket = config.WebSocket;
    this.webSocketFactory = config.webSocketFactory;
    this.urls = mergeWebSocketUrls(this.exchange, config.urls);
    this.connectTimeoutMs = config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS;
    this.sockets = new Map();
    this.subscriptions = new Map();
    this.handlers = new Map();
  }

  async subscribe(id, key = "", options = {}) {
    const descriptor = buildCryptoWebSocketDescriptor(this.exchange, id, key, options);
    const socket = await this.ensureSocket(descriptor.product);
    const subscriptionKey = makeSubscriptionKey(descriptor);
    const existing = this.subscriptions.get(subscriptionKey);
    if (existing) {
      return { ...existing, duplicate: true };
    }

    socket.send(serializeMessage(descriptor.subscribeMessage));
    const subscription = {
      broker: this.exchange,
      exchange: this.exchange,
      id: descriptor.id,
      key: descriptor.key,
      product: descriptor.product,
      streamKind: descriptor.streamKind,
      action: "subscribe",
      request: descriptor.subscribeMessage,
      url: descriptor.url,
    };
    this.subscriptions.set(subscriptionKey, subscription);
    return subscription;
  }

  async unsubscribe(id, key = "", options = {}) {
    const descriptor = buildCryptoWebSocketDescriptor(this.exchange, id, key, options);
    const socket = await this.ensureSocket(descriptor.product);
    socket.send(serializeMessage(descriptor.unsubscribeMessage));
    this.subscriptions.delete(makeSubscriptionKey(descriptor));
    return {
      broker: this.exchange,
      exchange: this.exchange,
      id: descriptor.id,
      key: descriptor.key,
      product: descriptor.product,
      streamKind: descriptor.streamKind,
      action: "unsubscribe",
      request: descriptor.unsubscribeMessage,
      url: descriptor.url,
    };
  }

  async ensureSocket(product) {
    const existing = this.sockets.get(product);
    if (existing && existing.readyState <= 1) {
      return existing;
    }

    const url = this.urlFor(product);
    const socket = this.createSocket(url);
    this.attachSocketHandlers(socket, product);
    await waitForSocketOpen(socket, this.connectTimeoutMs);
    this.sockets.set(product, socket);
    return socket;
  }

  createSocket(url) {
    if (this.webSocketFactory) {
      return this.webSocketFactory(url);
    }

    const WebSocketCtor = this.WebSocket ?? globalThis.WebSocket;
    if (!WebSocketCtor) {
      throw BrokerError.config("No WebSocket implementation is available", {
        broker: this.exchange,
      });
    }
    return new WebSocketCtor(url);
  }

  attachSocketHandlers(socket, product) {
    setSocketHandler(socket, "open", (event) => this.emit("open", { exchange: this.exchange, product, event }));
    setSocketHandler(socket, "close", (event) => this.emit("close", { exchange: this.exchange, product, event }));
    setSocketHandler(socket, "error", (event) => this.emit("error", { exchange: this.exchange, product, event }));
    setSocketHandler(socket, "message", (event) => {
      const raw = event?.data ?? event;
      const data = parseSocketMessage(raw);
      this.emit("message", { exchange: this.exchange, product, data, raw });
      this.emit("realtime", { exchange: this.exchange, product, data, raw });
    });
  }

  urlFor(product) {
    const url = this.urls?.[this.env]?.[product] ?? this.urls?.prod?.[product];
    if (!url) {
      throw BrokerError.unsupported(`${this.exchange} ${product} public WebSocket is not supported`, {
        broker: this.exchange,
        details: { exchange: this.exchange, product },
      });
    }
    return url;
  }

  close(product) {
    if (product) {
      this.sockets.get(product)?.close?.();
      this.sockets.delete(product);
      return;
    }

    for (const socket of this.sockets.values()) {
      socket.close?.();
    }
    this.sockets.clear();
  }

  listSubscriptions() {
    return [...this.subscriptions.values()].map((subscription) => ({ ...subscription }));
  }

  on(event, handler) {
    const handlers = this.handlers.get(event) ?? new Set();
    handlers.add(handler);
    this.handlers.set(event, handlers);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event, payload) {
    for (const handler of this.handlers.get(event) ?? []) {
      handler(payload);
    }
  }
}

export function buildCryptoWebSocketDescriptor(exchange, apiId, key, options = {}) {
  const normalizedExchange = assertCryptoExchange(exchange);
  const id = normalizeWebSocketApiId(normalizedExchange, apiId);
  const parsed = parseWebSocketApiId(normalizedExchange, id);
  const normalizedKey = normalizeKey(key);

  if (parsed.product === "futures" && !["binance", "bingx", "bybit"].includes(normalizedExchange)) {
    throw BrokerError.unsupported(`${normalizedExchange} futures WebSocket is not supported`, {
      broker: normalizedExchange,
      id,
    });
  }

  if (!["trade", "orderbook"].includes(parsed.streamKind)) {
    throw BrokerError.unsupported(`Crypto private WebSocket stream is not supported in v1: ${id}`, {
      broker: normalizedExchange,
      id,
    });
  }

  const url = options.url ?? WS_URLS[normalizedExchange]?.[options.env ?? "prod"]?.[parsed.product] ?? WS_URLS[normalizedExchange]?.prod?.[parsed.product];
  const topic = buildTopic(normalizedExchange, parsed.product, parsed.streamKind, normalizedKey, options);
  return {
    exchange: normalizedExchange,
    id,
    key: normalizedKey,
    product: parsed.product,
    streamKind: parsed.streamKind,
    topic,
    url,
    subscribeMessage: buildSubscriptionMessage(normalizedExchange, "subscribe", parsed.product, parsed.streamKind, normalizedKey, topic, options),
    unsubscribeMessage: buildSubscriptionMessage(normalizedExchange, "unsubscribe", parsed.product, parsed.streamKind, normalizedKey, topic, options),
  };
}

function normalizeWebSocketApiId(exchange, apiId) {
  const rawId = String(apiId ?? "").trim();
  if (!rawId) {
    throw BrokerError.validation("Crypto WebSocket API id is required", { broker: exchange });
  }
  return rawId.startsWith(`${exchange}.`) ? rawId : `${exchange}.${rawId}`;
}

function parseWebSocketApiId(exchange, apiId) {
  const parts = apiId.split(".");
  if (parts.length < 4 || parts[0] !== exchange || parts[2] !== "ws") {
    throw BrokerError.validation(`Invalid crypto WebSocket API id: ${apiId}`, {
      broker: exchange,
      id: apiId,
    });
  }
  return {
    product: parts[1],
    streamKind: parts[3] === "orderbook" ? "orderbook" : parts[3],
  };
}

function buildTopic(exchange, product, streamKind, key, options = {}) {
  if (exchange === "binance") {
    const stream = streamKind === "trade" ? "trade" : options.depthStream ?? "depth";
    return `${key.toLowerCase()}@${stream}`;
  }

  if (exchange === "bybit") {
    return streamKind === "trade"
      ? `publicTrade.${key}`
      : `orderbook.${options.depth ?? 50}.${key}`;
  }

  if (exchange === "bingx") {
    const channel = streamKind === "trade" ? "trade" : "depth";
    return `${key}@${channel}`;
  }

  if (exchange === "coinone") {
    return streamKind === "trade" ? "TRADE" : "ORDERBOOK";
  }

  return streamKind;
}

function buildSubscriptionMessage(exchange, action, product, streamKind, key, topic, options = {}) {
  if (exchange === "binance") {
    return {
      method: action === "subscribe" ? "SUBSCRIBE" : "UNSUBSCRIBE",
      params: [topic],
      id: options.requestId ?? 1,
    };
  }

  if (exchange === "bybit") {
    return {
      op: action,
      args: [topic],
    };
  }

  if (exchange === "bingx") {
    return {
      id: String(options.requestId ?? Date.now()),
      reqType: action === "subscribe" ? "sub" : "unsub",
      dataType: topic,
    };
  }

  if (exchange === "upbit" || exchange === "bithumb") {
    return [
      { ticket: options.ticket ?? "security-api" },
      { type: streamKind === "trade" ? "trade" : "orderbook", codes: [key] },
      { format: options.format ?? "SIMPLE" },
    ];
  }

  if (exchange === "coinone") {
    const pair = splitKoreanMarket(key);
    return {
      request_type: action === "subscribe" ? "SUBSCRIBE" : "UNSUBSCRIBE",
      channel: topic,
      topic: {
        quote_currency: pair.quoteCurrency,
        target_currency: pair.targetCurrency,
      },
    };
  }

  throw BrokerError.unsupported(`Crypto WebSocket exchange is not supported: ${exchange}`, {
    broker: exchange,
    details: { exchange, product, streamKind },
  });
}

function serializeMessage(message) {
  return JSON.stringify(message);
}

function makeSubscriptionKey(descriptor) {
  return JSON.stringify({
    id: descriptor.id,
    key: descriptor.key,
    product: descriptor.product,
    streamKind: descriptor.streamKind,
  });
}

function normalizeKey(key) {
  const normalized = String(key ?? "").trim().toUpperCase();
  if (!normalized) {
    throw BrokerError.validation("Crypto WebSocket subscription key is required");
  }
  return normalized;
}

function splitKoreanMarket(market) {
  const normalized = String(market ?? "").trim().toUpperCase().replace("_", "-");
  if (normalized.includes("-")) {
    const [quoteCurrency, targetCurrency] = normalized.split("-");
    return { quoteCurrency, targetCurrency };
  }
  return { quoteCurrency: "KRW", targetCurrency: normalized };
}

function mergeWebSocketUrls(exchange, overrides = {}) {
  const defaults = WS_URLS[exchange];
  return {
    prod: { ...(defaults?.prod ?? {}), ...(overrides?.prod ?? {}) },
    mock: { ...(defaults?.mock ?? {}), ...(overrides?.mock ?? {}) },
  };
}

function setSocketHandler(socket, event, handler) {
  if (socket.addEventListener) {
    socket.addEventListener(event, handler);
    return;
  }
  socket[`on${event}`] = handler;
}

function addSocketListener(socket, event, handler) {
  if (socket.addEventListener) {
    socket.addEventListener(event, handler);
    return () => socket.removeEventListener?.(event, handler);
  }

  const previous = socket[`on${event}`];
  socket[`on${event}`] = (payload) => {
    previous?.(payload);
    handler(payload);
  };
  return () => {
    socket[`on${event}`] = previous;
  };
}

function waitForSocketOpen(socket, timeoutMs) {
  if (socket.readyState === 1) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let cleanupOpen = () => {};
    let cleanupError = () => {};
    let cleanupClose = () => {};
    const timer = setTimeout(() => settle(reject, new Error("Crypto WebSocket connection timed out before open.")), timeoutMs);

    const settle = (callback, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanupOpen();
      cleanupError();
      cleanupClose();
      callback(value);
    };

    cleanupOpen = addSocketListener(socket, "open", () => settle(resolve));
    cleanupError = addSocketListener(socket, "error", (event) => settle(reject, toSocketError(event, "Crypto WebSocket error before open.")));
    cleanupClose = addSocketListener(socket, "close", (event) => settle(reject, toSocketError(event, "Crypto WebSocket closed before open.")));
  });
}

function toSocketError(event, fallbackMessage) {
  if (event instanceof Error) return event;
  const reason = event?.reason || event?.message;
  return new Error(reason ? `${fallbackMessage} ${reason}` : fallbackMessage);
}

function parseSocketMessage(raw) {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}
