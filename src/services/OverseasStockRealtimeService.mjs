import { getCapabilities } from "../capabilities/index.mjs";
import { WebSocketBrokerClient, normalizeRealtimeMessage } from "../adapters/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const TRADE_CAPABILITY_ID = "overseasStock.realtime.trade";
const ORDER_BOOK_CAPABILITY_ID = "overseasStock.realtime.orderBook";
const ORDER_EVENT_CAPABILITY_ID = "overseasStock.realtime.orderEvent";

const OVERSEAS_ORDER_EVENT_TYPES = Object.freeze({
  AS0: "accepted",
  AS1: "executed",
  AS2: "modified",
  AS3: "canceled",
  AS4: "rejected",
});

export class OverseasStockRealtimeService {
  constructor(clients = {}, options = {}) {
    this.clients = clients;
    this.webSocketOptions = options.webSocketOptions ?? {};
  }

  async subscribeOverseasStockTrades(broker, identity, handlers = {}, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();

    try {
      const normalizedIdentity = normalizeOverseasRealtimeIdentity(identity, options, TRADE_CAPABILITY_ID);

      return this.#subscribeSingle({
        broker,
        key: normalizedIdentity.realtimeKey,
        handlers,
        options,
        capabilityId: TRADE_CAPABILITY_ID,
        streamKind: "quote",
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        source: null,
        capabilityId: TRADE_CAPABILITY_ID,
        error,
      });
    }
  }

  async subscribeOverseasStockOrderBook(broker, identity, handlers = {}, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();

    try {
      const normalizedIdentity = normalizeOverseasRealtimeIdentity(identity, options, ORDER_BOOK_CAPABILITY_ID);

      return this.#subscribeSingle({
        broker,
        key: normalizedIdentity.realtimeKey,
        handlers,
        options,
        capabilityId: ORDER_BOOK_CAPABILITY_ID,
        streamKind: "quote",
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        source: null,
        capabilityId: ORDER_BOOK_CAPABILITY_ID,
        error,
      });
    }
  }

  async subscribeOverseasStockOrderEvents(broker, handlers = {}, options = {}) {
    return this.#subscribeMany({
      broker,
      key: normalizeOptionalKey(options.key),
      handlers,
      options,
      capabilityId: ORDER_EVENT_CAPABILITY_ID,
      streamKind: "account",
    });
  }

  async #subscribeSingle({ broker, key, handlers, options, capabilityId, streamKind }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const capabilities = getCapabilities(normalizedBroker);
      assertCapabilitySupported(normalizedBroker, capabilities, capabilityId);

      source = selectRealtimeSource(normalizedBroker, capabilities, capabilityId, options);
      const client = this.resolveRealtimeClient(normalizedBroker);
      const offRealtime = client.on("realtime", (event) => {
        const messages = normalizeOverseasStockRealtimeMessage(normalizedBroker, event.data);
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
        close: () => client.close?.(),
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

  async #subscribeMany({ broker, key, handlers, options, capabilityId, streamKind }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let sources = [];

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const capabilities = getCapabilities(normalizedBroker);
      assertCapabilitySupported(normalizedBroker, capabilities, capabilityId);

      sources = selectRealtimeSources(normalizedBroker, capabilities, capabilityId, options);
      const sourceIds = new Set(sources.map((source) => source.id));
      const client = this.resolveRealtimeClient(normalizedBroker);
      const offRealtime = client.on("realtime", (event) => {
        const messages = normalizeOverseasStockRealtimeMessage(normalizedBroker, event.data);
        for (const message of messages) {
          if (sourceIds.has(message.id) || !message.id) {
            handlers.onMessage?.(message);
          }
        }
      });
      const offAck = handlers.onAck ? client.on("ack", handlers.onAck) : null;
      const offError = handlers.onError ? client.on("error", handlers.onError) : null;
      const subscriptions = [];

      for (const source of sources) {
        subscriptions.push(await client.subscribe(source.id, key, {
          ...options,
          streamKind,
        }));
      }

      return {
        ok: true,
        broker: normalizedBroker,
        capability: capabilityId,
        id: sources[0]?.id ?? null,
        ids: sources.map((source) => source.id),
        key,
        subscriptions,
        unsubscribe: async () => {
          offRealtime();
          offAck?.();
          offError?.();
          const results = [];
          for (const source of sources) {
            results.push(await client.unsubscribe(source.id, key, {
              ...options,
              streamKind,
            }));
          }
          return results;
        },
        close: () => client.close?.(),
      };
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        source: sources[0] ?? null,
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

export function normalizeOverseasStockRealtimeMessage(broker, payload) {
  return normalizeRealtimeMessage(broker, payload).map((message) => normalizeOverseasRealtimeDomainEvent(message));
}

export function normalizeOverseasStockRealtimeTrade(broker, payload) {
  return normalizeOverseasStockRealtimeMessage(broker, payload).filter((message) => message.kind === "trade");
}

export function normalizeOverseasStockRealtimeOrderBook(broker, payload) {
  return normalizeOverseasStockRealtimeMessage(broker, payload).filter((message) => message.kind === "orderBook");
}

export function normalizeOverseasStockRealtimeOrderEvent(broker, payload) {
  return normalizeOverseasStockRealtimeMessage(broker, payload).filter((message) => message.kind === "orderEvent");
}

function assertCapabilitySupported(broker, capabilities, capabilityId) {
  if (!capabilities.supports(capabilityId)) {
    throw BrokerError.unsupported(`${broker} does not support ${capabilityId}`, {
      broker,
      details: { capabilityId },
    });
  }
}

function selectRealtimeSource(broker, capabilities, capabilityId, options) {
  return selectRealtimeSources(broker, capabilities, capabilityId, options)[0];
}

function selectRealtimeSources(broker, capabilities, capabilityId, options) {
  const preferredId = options.apiId ?? options.trCode;
  const sources = capabilities.findApis(capabilityId, { status: "serviceReady" })
    .filter((api) => api.transport === "websocket");

  if (preferredId) {
    const source = sources.find((api) => normalizeId(api.id) === normalizeId(preferredId));
    if (!source) {
      throw BrokerError.unsupported(`${broker} ${capabilityId} does not expose service-ready ${preferredId}`, {
        broker,
        details: { capabilityId, requestedId: preferredId },
      });
    }

    return [source];
  }

  if (sources.length === 0) {
    throw BrokerError.unsupported(`${broker} does not have a service-ready WebSocket source for ${capabilityId}`, {
      broker,
      details: { capabilityId },
    });
  }

  return sources;
}

function normalizeOverseasRealtimeIdentity(identity, options = {}, capabilityId) {
  const value = typeof identity === "string" ? { symbol: identity } : identity;
  if (!value || typeof value !== "object") {
    throw BrokerError.validation("Overseas realtime identity must be an object or symbol string", {
      details: { capabilityId },
    });
  }

  const symbol = normalizeRequiredString(value.symbol, "symbol", capabilityId);
  const exchangeCode = firstNonBlank(value.exchangeCode, value.exchange, options.exchangeCode, options.exchange);
  const keySymbol = firstNonBlank(value.keySymbol, value.keysymbol, options.keySymbol, options.keysymbol)
    ?? (exchangeCode ? `${exchangeCode}${symbol}` : null);

  if (!keySymbol) {
    throw BrokerError.validation("Overseas realtime keySymbol or exchangeCode is required", {
      details: { capabilityId, symbol },
    });
  }

  return {
    symbol,
    keySymbol,
    exchangeCode: nullableString(exchangeCode),
    realtimeKey: formatLsOverseasRealtimeKey(keySymbol),
  };
}

function formatLsOverseasRealtimeKey(value) {
  const key = normalizeRequiredString(value, "keySymbol", null);
  if (key.length > 18) {
    throw BrokerError.validation("LS overseas realtime keySymbol must be 18 characters or fewer", {
      broker: "ls",
      details: { field: "keySymbol", length: key.length, maxLength: 18 },
    });
  }

  return key.padEnd(18, " ");
}

function normalizeOptionalKey(value) {
  const normalized = String(value ?? "").trim();
  return normalized || "";
}

function normalizeOverseasRealtimeDomainEvent(message) {
  if (message.broker !== "ls") {
    return {
      ...message,
      kind: "unknown",
    };
  }

  if (message.id === "GSC") {
    return normalizeLsOverseasRealtimeTrade(message);
  }

  if (message.id === "GSH") {
    return normalizeLsOverseasRealtimeOrderBook(message);
  }

  if (OVERSEAS_ORDER_EVENT_TYPES[message.id]) {
    return normalizeLsOverseasRealtimeOrderEvent(message);
  }

  return {
    ...message,
    kind: "unknown",
  };
}

function normalizeLsOverseasRealtimeTrade(message) {
  const body = message.body ?? {};
  const tradeQuantityRaw = firstValue(body, ["trdq"]);

  return {
    ...message,
    kind: "trade",
    market: "overseas",
    symbol: normalizeSymbol(firstValue(body, ["symbol"]) ?? message.key),
    keySymbol: nullableString(message.key),
    localDate: nullableString(firstValue(body, ["ovsdate"])),
    koreaDate: nullableString(firstValue(body, ["kordate"])),
    localTime: nullableString(firstValue(body, ["trdtm"])),
    koreaTime: nullableString(firstValue(body, ["kortm"])),
    price: parsePrice(firstValue(body, ["price"])),
    priceRaw: nullableString(firstValue(body, ["price"])),
    change: parseNumber(firstValue(body, ["diff"])),
    changeRaw: nullableString(firstValue(body, ["diff"])),
    changeRate: parseNumber(firstValue(body, ["rate"])),
    changeRateRaw: nullableString(firstValue(body, ["rate"])),
    tradeQuantity: parseAbsNumber(tradeQuantityRaw),
    tradeQuantityRaw: nullableString(tradeQuantityRaw),
    tradeSide: sideFromLsTradeCode(firstValue(body, ["cgubun"])),
    volume: parseNumber(firstValue(body, ["totq"])),
    volumeRaw: nullableString(firstValue(body, ["totq"])),
    amount: parseNumber(firstValue(body, ["amount"])),
    amountRaw: nullableString(firstValue(body, ["amount"])),
    open: parsePrice(firstValue(body, ["open"])),
    high: parsePrice(firstValue(body, ["high"])),
    low: parsePrice(firstValue(body, ["low"])),
    high52Week: parsePrice(firstValue(body, ["high52p"])),
    low52Week: parsePrice(firstValue(body, ["low52p"])),
    sign: nullableString(firstValue(body, ["sign"])),
    sequence: nullableString(firstValue(body, ["lSeq", "lseq"])),
  };
}

function normalizeLsOverseasRealtimeOrderBook(message) {
  const body = message.body ?? {};

  return {
    ...message,
    kind: "orderBook",
    market: "overseas",
    symbol: normalizeSymbol(firstValue(body, ["symbol"]) ?? message.key),
    keySymbol: nullableString(message.key),
    localTime: nullableString(firstValue(body, ["loctime"])),
    koreaTime: nullableString(firstValue(body, ["kortime"])),
    asks: Array.from({ length: 10 }, (_, index) => orderBookLevel(body, "ask", index + 1)),
    bids: Array.from({ length: 10 }, (_, index) => orderBookLevel(body, "bid", index + 1)),
    totals: {
      askCount: parseNumber(firstValue(body, ["totoffercnt"])),
      askCountRaw: nullableString(firstValue(body, ["totoffercnt"])),
      bidCount: parseNumber(firstValue(body, ["totbidcnt"])),
      bidCountRaw: nullableString(firstValue(body, ["totbidcnt"])),
      askQuantity: parseNumber(firstValue(body, ["totofferrem"])),
      askQuantityRaw: nullableString(firstValue(body, ["totofferrem"])),
      bidQuantity: parseNumber(firstValue(body, ["totbidrem"])),
      bidQuantityRaw: nullableString(firstValue(body, ["totbidrem"])),
    },
  };
}

function normalizeLsOverseasRealtimeOrderEvent(message) {
  const body = message.body ?? {};
  const eventType = OVERSEAS_ORDER_EVENT_TYPES[message.id] ?? null;

  return {
    ...message,
    kind: "orderEvent",
    market: "overseas",
    eventType,
    accountId: nullableString(firstValue(body, ["sAcntNo"])),
    accountName: nullableString(firstValue(body, ["sAcntNm"])),
    orderAccountId: nullableString(firstValue(body, ["sOrdAcntNo"])),
    orderId: nullableString(firstValue(body, ["sOrdNo"])),
    originalOrderId: nullableString(firstValue(body, ["sOrgOrdNo"])),
    executionId: nullableString(firstValue(body, ["sExecNO", "sExecNo"])),
    overseasExecutionId: nullableString(firstValue(body, ["sAbrdExecId"])),
    symbol: normalizeSymbol(firstValue(body, ["sShtnIsuNo", "sIsuNo"]) ?? message.key),
    issueNumber: nullableString(firstValue(body, ["sIsuNo"])),
    name: nullableString(firstValue(body, ["sIsuNm"])),
    side: sideFromLsOrderCode(firstValue(body, ["sBnsTp", "sOrdPtnCode"])),
    status: nullableString(firstValue(body, ["sOrdxctPtnCode", "sOrdTrxPtnCode"])),
    orderPatternCode: nullableString(firstValue(body, ["sOrdPtnCode"])),
    marketCode: nullableString(firstValue(body, ["sOrdMktCode"])),
    registeredMarketCode: nullableString(firstValue(body, ["sRegMktCode"])),
    orderType: nullableString(firstValue(body, ["sOrdprcPtnCode"])),
    orderCondition: nullableString(firstValue(body, ["sOrdCndi"])),
    orderQuantity: parseNumber(firstValue(body, ["sOrdQty"])),
    orderQuantityRaw: nullableString(firstValue(body, ["sOrdQty"])),
    orderPrice: parsePrice(firstValue(body, ["sOrdPrc"])),
    orderPriceRaw: nullableString(firstValue(body, ["sOrdPrc"])),
    executedQuantity: parseNumber(firstValue(body, ["sExecQty", "sSpotExecQty"])),
    executedQuantityRaw: nullableString(firstValue(body, ["sExecQty", "sSpotExecQty"])),
    executedPrice: parsePrice(firstValue(body, ["sExecPrc"])),
    executedPriceRaw: nullableString(firstValue(body, ["sExecPrc"])),
    modifiedConfirmedQuantity: parseNumber(firstValue(body, ["sMdfyCnfQty"])),
    modifiedConfirmedQuantityRaw: nullableString(firstValue(body, ["sMdfyCnfQty"])),
    canceledConfirmedQuantity: parseNumber(firstValue(body, ["sCancCnfQty"])),
    canceledConfirmedQuantityRaw: nullableString(firstValue(body, ["sCancCnfQty"])),
    rejectedQuantity: parseNumber(firstValue(body, ["sRjtQty"])),
    rejectedQuantityRaw: nullableString(firstValue(body, ["sRjtQty"])),
    remainingQuantity: parseNumber(firstValue(body, ["sUnercQty"])),
    remainingQuantityRaw: nullableString(firstValue(body, ["sUnercQty"])),
    originalRemainingQuantity: parseNumber(firstValue(body, ["sOrgOrdUnercQty"])),
    originalRemainingQuantityRaw: nullableString(firstValue(body, ["sOrgOrdUnercQty"])),
    averageExecutionPrice: parsePrice(firstValue(body, ["sOrdAvrExecPrc"])),
    averageExecutionPriceRaw: nullableString(firstValue(body, ["sOrdAvrExecPrc"])),
    orderAmount: parseNumber(firstValue(body, ["sOrdAmt"])),
    orderAmountRaw: nullableString(firstValue(body, ["sOrdAmt"])),
    mediumCode: nullableString(firstValue(body, ["sCommdaCode"])),
    rejectionReason: nullableString(firstValue(body, ["sRjtRsn"])),
    executionTime: nullableString(firstValue(body, ["sExecTime"])),
    receivedExecutionTime: nullableString(firstValue(body, ["sRcptExecTime"])),
    orderSequence: nullableString(firstValue(body, ["sOrdSeqno"])),
    orderUserId: nullableString(firstValue(body, ["sOrdUserId"])),
    balanceQuantity: parseNumber(firstValue(body, ["sSecBalQty"])),
    sellableQuantity: parseNumber(firstValue(body, ["sSellAbleQty"])),
    deposit: parseNumber(firstValue(body, ["sDeposit"])),
    purchaseAmount: parseNumber(firstValue(body, ["sPchsAmt"])),
    averagePurchasePrice: parsePrice(firstValue(body, ["sAvrPchsPrc"])),
  };
}

function orderBookLevel(payload, side, level) {
  const priceKey = side === "ask" ? `offerho${level}` : `bidho${level}`;
  const quantityKey = side === "ask" ? `offerrem${level}` : `bidrem${level}`;
  const countKey = side === "ask" ? `offerno${level}` : `bidno${level}`;

  return {
    level,
    price: parsePrice(payload?.[priceKey]),
    priceRaw: nullableString(payload?.[priceKey]),
    quantity: parseNumber(payload?.[quantityKey]),
    quantityRaw: nullableString(payload?.[quantityKey]),
    count: parseNumber(payload?.[countKey]),
    countRaw: nullableString(payload?.[countKey]),
  };
}

function failureResponse({ broker, source, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Overseas stock realtime service failed", {
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

function sideFromLsOrderCode(value) {
  const normalized = nullableString(value);
  if (normalized === "1" || normalized === "01") {
    return "sell";
  }

  if (normalized === "2" || normalized === "02") {
    return "buy";
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
  const normalized = nullableString(value)?.trim();
  return normalized || null;
}

function normalizeRequiredString(value, field, capabilityId) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation(`Overseas realtime ${field} is required`, {
      details: { capabilityId, field },
    });
  }

  return normalized;
}

function firstNonBlank(...values) {
  for (const value of values) {
    const normalized = nullableString(value);
    if (normalized !== null) {
      return normalized.trim();
    }
  }

  return null;
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

function normalizeId(value) {
  return String(value ?? "").trim().toLowerCase();
}
