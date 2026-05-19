import { getCapabilities } from "../capabilities/index.mjs";
import { WebSocketBrokerClient, normalizeRealtimeMessage } from "../adapters/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const TRADE_CAPABILITY_ID = "realtime.domesticStock.trade";
const ORDER_BOOK_CAPABILITY_ID = "realtime.domesticStock.orderBook";
const ORDER_EVENT_CAPABILITY_ID = "realtime.domesticStock.orderEvent";
const BALANCE_CAPABILITY_ID = "realtime.domesticStock.balance";

export class RealtimeService {
  constructor(clients = {}, options = {}) {
    this.clients = clients;
    this.webSocketOptions = options.webSocketOptions ?? {};
  }

  async subscribeDomesticStockTrades(broker, symbol, handlers = {}, options = {}) {
    return this.subscribe({
      broker,
      key: normalizeRequiredKey(symbol, "symbol"),
      handlers,
      options,
      capabilityId: TRADE_CAPABILITY_ID,
      streamKind: "quote",
    });
  }

  async subscribeDomesticStockOrderBook(broker, symbol, handlers = {}, options = {}) {
    return this.subscribe({
      broker,
      key: normalizeRequiredKey(symbol, "symbol"),
      handlers,
      options,
      capabilityId: ORDER_BOOK_CAPABILITY_ID,
      streamKind: "quote",
    });
  }

  async subscribeDomesticStockOrderEvents(broker, handlers = {}, options = {}) {
    return this.subscribe({
      broker,
      key: options.key ?? "",
      handlers,
      options,
      capabilityId: ORDER_EVENT_CAPABILITY_ID,
      streamKind: "account",
    });
  }

  async subscribeDomesticStockBalance(broker, handlers = {}, options = {}) {
    return this.subscribe({
      broker,
      key: options.key ?? "",
      handlers,
      options,
      capabilityId: BALANCE_CAPABILITY_ID,
      streamKind: "account",
    });
  }

  async subscribe({ broker, key, handlers, options, capabilityId, streamKind }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const capabilities = getCapabilities(normalizedBroker);

      if (!capabilities.supports(capabilityId)) {
        throw BrokerError.unsupported(`${normalizedBroker} does not support ${capabilityId}`, {
          broker: normalizedBroker,
          details: { capabilityId },
        });
      }

      source = selectRealtimeSource(normalizedBroker, capabilities, capabilityId, options);
      const client = this.resolveRealtimeClient(normalizedBroker);
      const offRealtime = client.on("realtime", (event) => {
        const messages = normalizeDomesticStockRealtimeMessage(normalizedBroker, event.data);
        for (const message of messages) {
          if (message.id === source.id || !message.id) {
            handlers.onMessage?.(message);
          }
        }
      });
      const offAck = handlers.onAck ? client.on("ack", handlers.onAck) : null;
      const offError = handlers.onError ? client.on("error", handlers.onError) : null;
      const subscription = await client.subscribe(source.id, key, {
        ...options,
        streamKind,
      });

      return {
        ok: true,
        broker: normalizedBroker,
        capability: capabilityId,
        id: source.id,
        key,
        subscription,
        unsubscribe: async () => {
          offRealtime();
          offAck?.();
          offError?.();
          return client.unsubscribe(source.id, key, {
            ...options,
            streamKind,
          });
        },
      };
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        source,
        capabilityId,
        error,
      });
    }
  }

  resolveRealtimeClient(broker) {
    const client = this.clients[broker];
    if (!client) {
      throw BrokerError.config(`Missing realtime client for broker: ${broker}`, {
        broker,
        details: { broker },
      });
    }

    if (client.subscribe && client.on) {
      return client;
    }

    if (client.getAccessToken && client.getEndpoint) {
      return new WebSocketBrokerClient({
        brokerClient: client,
        ...this.webSocketOptions,
      });
    }

    throw BrokerError.config(`Invalid realtime client for broker: ${broker}`, {
      broker,
      details: { broker },
    });
  }
}

export function normalizeDomesticStockRealtimeMessage(broker, payload) {
  return normalizeRealtimeMessage(broker, payload).map((message) => normalizeRealtimeDomainEvent(message));
}

export function normalizeDomesticStockRealtimeTrade(broker, payload) {
  return normalizeDomesticStockRealtimeMessage(broker, payload).filter((message) => message.kind === "trade");
}

export function normalizeDomesticStockRealtimeOrderBook(broker, payload) {
  return normalizeDomesticStockRealtimeMessage(broker, payload).filter((message) => message.kind === "orderBook");
}

export function normalizeDomesticStockRealtimeOrderEvent(broker, payload) {
  return normalizeDomesticStockRealtimeMessage(broker, payload).filter((message) => message.kind === "orderEvent");
}

function selectRealtimeSource(broker, capabilities, capabilityId, options) {
  const preferredId = options.apiId ?? options.trCode;
  const sources = capabilities.findApis(capabilityId).filter((api) => api.transport === "websocket");

  if (preferredId) {
    const source = sources.find((api) => api.id === preferredId);
    if (!source) {
      throw BrokerError.unsupported(`${broker} ${capabilityId} does not expose ${preferredId}`, {
        broker,
        details: { capabilityId, requestedId: preferredId },
      });
    }

    return source;
  }

  const source = sources[0];
  if (!source) {
    throw BrokerError.unsupported(`${broker} does not have a WebSocket source for ${capabilityId}`, {
      broker,
      details: { capabilityId },
    });
  }

  return source;
}

function normalizeRequiredKey(value, field) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation(`${field} is required`, {
      details: { field },
    });
  }

  return normalized;
}

function failureResponse({ broker, source, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Realtime service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: source?.id ?? null,
    data: null,
    error: brokerError,
  };
}

function normalizeRealtimeDomainEvent(message) {
  if (isTradeMessage(message)) {
    return normalizeRealtimeTrade(message);
  }

  if (isOrderBookMessage(message)) {
    return normalizeRealtimeOrderBook(message);
  }

  if (isOrderEventMessage(message)) {
    return normalizeRealtimeOrderEvent(message);
  }

  return {
    ...message,
    kind: "unknown",
  };
}

function isTradeMessage(message) {
  return message.broker === "kiwoom"
    ? message.id === "0B"
    : ["S3_", "K3_", "US3"].includes(message.id);
}

function isOrderBookMessage(message) {
  return message.broker === "kiwoom"
    ? ["0D", "0C"].includes(message.id)
    : ["H1_", "HA_", "UH1"].includes(message.id);
}

function isOrderEventMessage(message) {
  return message.broker === "kiwoom"
    ? message.id === "00"
    : ["SC0", "SC1", "SC2", "SC3", "SC4"].includes(message.id);
}

function normalizeRealtimeTrade(message) {
  const body = message.body ?? {};

  if (message.broker === "kiwoom") {
    const tradeQuantityRaw = firstValue(body, ["15"]);

    return {
      ...message,
      kind: "trade",
      symbol: normalizeSymbol(message.key ?? message.raw?.item),
      tradeTime: nullableString(firstValue(body, ["20"])),
      price: parsePrice(firstValue(body, ["10"])),
      priceRaw: nullableString(firstValue(body, ["10"])),
      change: parseNumber(firstValue(body, ["11"])),
      changeRaw: nullableString(firstValue(body, ["11"])),
      changeRate: parseNumber(firstValue(body, ["12"])),
      changeRateRaw: nullableString(firstValue(body, ["12"])),
      tradeQuantity: parseAbsNumber(tradeQuantityRaw),
      tradeQuantityRaw: nullableString(tradeQuantityRaw),
      tradeSide: sideFromSignedQuantity(tradeQuantityRaw),
      volume: parseNumber(firstValue(body, ["13"])),
      volumeRaw: nullableString(firstValue(body, ["13"])),
      value: parseNumber(firstValue(body, ["14"])),
      valueRaw: nullableString(firstValue(body, ["14"])),
      askPrice: parsePrice(firstValue(body, ["27"])),
      bidPrice: parsePrice(firstValue(body, ["28"])),
      open: parsePrice(firstValue(body, ["16"])),
      high: parsePrice(firstValue(body, ["17"])),
      low: parsePrice(firstValue(body, ["18"])),
      currency: "KRW",
    };
  }

  return {
    ...message,
    kind: "trade",
    symbol: normalizeSymbol(firstValue(body, ["shcode"]) ?? message.key),
    tradeTime: nullableString(firstValue(body, ["chetime"])),
    price: parsePrice(firstValue(body, ["price"])),
    priceRaw: nullableString(firstValue(body, ["price"])),
    change: parseNumber(firstValue(body, ["change"])),
    changeRaw: nullableString(firstValue(body, ["change"])),
    changeRate: parseNumber(firstValue(body, ["drate"])),
    changeRateRaw: nullableString(firstValue(body, ["drate"])),
    tradeQuantity: parseAbsNumber(firstValue(body, ["cvolume"])),
    tradeQuantityRaw: nullableString(firstValue(body, ["cvolume"])),
    tradeSide: sideFromLsTradeCode(firstValue(body, ["cgubun"])),
    volume: parseNumber(firstValue(body, ["volume"])),
    volumeRaw: nullableString(firstValue(body, ["volume"])),
    value: parseNumber(firstValue(body, ["value"])),
    valueRaw: nullableString(firstValue(body, ["value"])),
    askPrice: parsePrice(firstValue(body, ["offerho"])),
    bidPrice: parsePrice(firstValue(body, ["bidho"])),
    open: parsePrice(firstValue(body, ["open"])),
    high: parsePrice(firstValue(body, ["high"])),
    low: parsePrice(firstValue(body, ["low"])),
    currency: "KRW",
  };
}

function normalizeRealtimeOrderBook(message) {
  const body = message.body ?? {};

  if (message.broker === "kiwoom") {
    return {
      ...message,
      kind: "orderBook",
      symbol: normalizeSymbol(message.key ?? message.raw?.item),
      timestamp: nullableString(firstValue(body, ["21"])),
      asks: Array.from({ length: 10 }, (_, index) => orderBookLevel(
        index + 1,
        firstValue(body, [String(41 + index)]),
        firstValue(body, [String(61 + index)]),
      )),
      bids: Array.from({ length: 10 }, (_, index) => orderBookLevel(
        index + 1,
        firstValue(body, [String(51 + index)]),
        firstValue(body, [String(71 + index)]),
      )),
      totals: {
        askQuantity: parseNumber(firstValue(body, ["121"])),
        askQuantityRaw: nullableString(firstValue(body, ["121"])),
        bidQuantity: parseNumber(firstValue(body, ["125"])),
        bidQuantityRaw: nullableString(firstValue(body, ["125"])),
      },
    };
  }

  return {
    ...message,
    kind: "orderBook",
    symbol: normalizeSymbol(firstValue(body, ["shcode"]) ?? message.key),
    timestamp: nullableString(firstValue(body, ["hotime"])),
    asks: Array.from({ length: 10 }, (_, index) => orderBookLevel(
      index + 1,
      firstValue(body, [`offerho${index + 1}`]),
      firstValue(body, [`offerrem${index + 1}`]),
    )),
    bids: Array.from({ length: 10 }, (_, index) => orderBookLevel(
      index + 1,
      firstValue(body, [`bidho${index + 1}`]),
      firstValue(body, [`bidrem${index + 1}`]),
    )),
    totals: {
      askQuantity: parseNumber(firstValue(body, ["totofferrem"])),
      askQuantityRaw: nullableString(firstValue(body, ["totofferrem"])),
      bidQuantity: parseNumber(firstValue(body, ["totbidrem"])),
      bidQuantityRaw: nullableString(firstValue(body, ["totbidrem"])),
    },
  };
}

function normalizeRealtimeOrderEvent(message) {
  const body = message.body ?? {};

  if (message.broker === "kiwoom") {
    return {
      ...message,
      kind: "orderEvent",
      accountId: nullableString(firstValue(body, ["9201"])),
      orderId: nullableString(firstValue(body, ["9203"])),
      originalOrderId: nullableString(firstValue(body, ["904"])),
      executionId: nullableString(firstValue(body, ["909"])),
      symbol: normalizeSymbol(firstValue(body, ["9001"]) ?? message.key),
      name: nullableString(firstValue(body, ["302"])) ?? message.name,
      side: sideFromBrokerCode(message.broker, firstValue(body, ["907"]), firstValue(body, ["905"])),
      status: nullableString(firstValue(body, ["913"])),
      orderType: nullableString(firstValue(body, ["906"])),
      orderQuantity: parseNumber(firstValue(body, ["900"])),
      orderQuantityRaw: nullableString(firstValue(body, ["900"])),
      orderPrice: parsePrice(firstValue(body, ["901"])),
      orderPriceRaw: nullableString(firstValue(body, ["901"])),
      executedQuantity: parseNumber(firstValue(body, ["911"])),
      executedQuantityRaw: nullableString(firstValue(body, ["911"])),
      executedPrice: parsePrice(firstValue(body, ["910"])),
      executedPriceRaw: nullableString(firstValue(body, ["910"])),
      remainingQuantity: parseNumber(firstValue(body, ["902"])),
      remainingQuantityRaw: nullableString(firstValue(body, ["902"])),
      eventTime: nullableString(firstValue(body, ["908"])),
    };
  }

  return {
    ...message,
    kind: "orderEvent",
    accountId: nullableString(firstValue(body, ["accno", "accno1", "ordacntno"])),
    orderId: nullableString(firstValue(body, ["ordno"])),
    originalOrderId: nullableString(firstValue(body, ["orgordno"])),
    executionId: nullableString(firstValue(body, ["execno"])),
    symbol: normalizeSymbol(firstValue(body, ["shtnIsuno", "shtcode", "shcode", "Isuno"]) ?? message.key),
    name: nullableString(firstValue(body, ["Isunm", "hname"])) ?? message.name,
    side: sideFromBrokerCode(message.broker, firstValue(body, ["bnstp", "ordgb", "ordptncode"])),
    status: nullableString(firstValue(body, ["ordxctptncode", "ordchegb"])),
    orderType: nullableString(firstValue(body, ["ordprcptncode", "etfhogagb"])),
    orderQuantity: parseNumber(firstValue(body, ["ordqty"])),
    orderQuantityRaw: nullableString(firstValue(body, ["ordqty"])),
    orderPrice: parsePrice(firstValue(body, ["ordprc", "ordprice"])),
    orderPriceRaw: nullableString(firstValue(body, ["ordprc", "ordprice"])),
    executedQuantity: parseNumber(firstValue(body, ["execqty", "spotexecqty"])),
    executedQuantityRaw: nullableString(firstValue(body, ["execqty", "spotexecqty"])),
    executedPrice: parsePrice(firstValue(body, ["execprc"])),
    executedPriceRaw: nullableString(firstValue(body, ["execprc"])),
    remainingQuantity: parseNumber(firstValue(body, ["unercqty", "orgordunercqty", "orgordundrqty"])),
    remainingQuantityRaw: nullableString(firstValue(body, ["unercqty", "orgordunercqty", "orgordundrqty"])),
    eventTime: nullableString(firstValue(body, ["exectime", "ordtm", "rcptexectime"])),
  };
}

function orderBookLevel(level, priceRaw, quantityRaw) {
  return {
    level,
    price: parsePrice(priceRaw),
    priceRaw: nullableString(priceRaw),
    quantity: parseNumber(quantityRaw),
    quantityRaw: nullableString(quantityRaw),
  };
}

function sideFromBrokerCode(broker, code, label) {
  const normalizedCode = nullableString(code);
  const normalizedLabel = nullableString(label);

  if (broker === "kiwoom") {
    if (normalizedCode === "1" || normalizedLabel?.includes("매도")) {
      return "sell";
    }

    if (normalizedCode === "2" || normalizedLabel?.includes("매수")) {
      return "buy";
    }
  }

  if (normalizedCode === "1" || normalizedCode === "01") {
    return "sell";
  }

  if (normalizedCode === "2" || normalizedCode === "02") {
    return "buy";
  }

  return null;
}

function sideFromSignedQuantity(value) {
  const normalized = nullableString(value);
  if (normalized?.startsWith("+")) {
    return "buy";
  }

  if (normalized?.startsWith("-")) {
    return "sell";
  }

  return null;
}

function sideFromLsTradeCode(value) {
  const normalized = nullableString(value);
  if (normalized === "+") {
    return "buy";
  }

  if (normalized === "-") {
    return "sell";
  }

  return null;
}

function normalizeSymbol(value) {
  const normalized = nullableString(value);
  if (!normalized) {
    return null;
  }

  return normalized.startsWith("A") && normalized.length === 7 ? normalized.slice(1) : normalized;
}

function firstValue(source, keys) {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null && source[key] !== "") {
      return source[key];
    }
  }

  return undefined;
}

function parsePrice(value) {
  const parsed = parseNumber(value);
  return parsed === null ? null : Math.abs(parsed);
}

function parseAbsNumber(value) {
  const parsed = parseNumber(value);
  return parsed === null ? null : Math.abs(parsed);
}

function parseNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = String(value).replace(/,/g, "").trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function nullableString(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value);
}
