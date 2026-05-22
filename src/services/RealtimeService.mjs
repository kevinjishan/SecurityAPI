import { getCapabilities } from "../capabilities/index.mjs";
import { WebSocketBrokerClient, normalizeRealtimeMessage } from "../adapters/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const TRADE_CAPABILITY_ID = "realtime.domesticStock.trade";
const ORDER_BOOK_CAPABILITY_ID = "realtime.domesticStock.orderBook";
const ORDER_EVENT_CAPABILITY_ID = "realtime.domesticStock.orderEvent";
const BALANCE_CAPABILITY_ID = "realtime.domesticStock.balance";
const MARKET_STATUS_CAPABILITY_ID = "realtime.market.status";

const KIWOOM_MARKET_STATUS_EVENTS = Object.freeze({
  0: { session: "preopen", phase: "notice", eventName: "장시작전 알림" },
  2: { session: "closingAuction", phase: "notice", eventName: "장마감 알림" },
  3: { session: "regular", phase: "open", eventName: "장시작" },
  4: { session: "regular", phase: "close", eventName: "장마감" },
  8: { session: "regular", phase: "close", eventName: "정규장마감" },
  9: { session: "closed", phase: "close", eventName: "전체장마감" },
  a: { session: "afterHours", phase: "open", eventName: "시간외 종가매매 시작" },
  b: { session: "afterHours", phase: "close", eventName: "시간외 종가매매 종료" },
  c: { session: "afterHoursSingle", phase: "open", eventName: "시간외 단일가 시작" },
  d: { session: "afterHoursSingle", phase: "close", eventName: "시간외 단일가 종료" },
  e: { session: "derivatives", phase: "close", eventName: "선옵 장마감전 동시호가 종료" },
  f: { session: "derivatives", phase: "notice", eventName: "선물옵션 장운영시간 알림" },
  o: { session: "derivatives", phase: "open", eventName: "선옵 장시작" },
  s: { session: "derivatives", phase: "auction", eventName: "선옵 장마감전 동시호가 시작" },
  P: { session: "nxtPreMarket", phase: "notice", eventName: "NXT 프리마켓 시작 알림" },
  Q: { session: "nxtPreMarket", phase: "close", eventName: "NXT 프리마켓 종료 알림" },
  R: { session: "nxtMainMarket", phase: "notice", eventName: "NXT 메인마켓 시작 알림" },
  S: { session: "nxtMainMarket", phase: "close", eventName: "NXT 메인마켓 종료 알림" },
  T: { session: "nxtAfterMarket", phase: "auction", eventName: "NXT 에프터마켓 단일가 시작 알림" },
  U: { session: "nxtAfterMarket", phase: "open", eventName: "NXT 에프터마켓 시작 알림" },
  V: { session: "nxtAfterMarket", phase: "close", eventName: "NXT 에프터마켓 종료 알림" },
});

const LS_MARKET_STATUS_MARKETS = Object.freeze({
  1: { market: "kospi", marketName: "KOSPI" },
  2: { market: "kosdaq", marketName: "KOSDAQ" },
  5: { market: "derivatives", marketName: "선물/옵션" },
  6: { market: "nxt", marketName: "NXT" },
  8: { market: "krxNightDerivatives", marketName: "KRX야간파생" },
  9: { market: "usStock", marketName: "미국주식" },
  A: { market: "chinaMorning", marketName: "중국주식오전" },
  B: { market: "chinaAfternoon", marketName: "중국주식오후" },
  C: { market: "hongKongMorning", marketName: "홍콩주식오전" },
  D: { market: "hongKongAfternoon", marketName: "홍콩주식오후" },
  E: { market: "japanMorning", marketName: "일본주식오전" },
  F: { market: "japanAfternoon", marketName: "일본주식오후" },
});

const LS_MARKET_STATUS_EVENTS = Object.freeze({
  11: { session: "preopen", phase: "auction", eventName: "장전동시호가개시" },
  21: { session: "regular", phase: "open", eventName: "장시작" },
  22: { session: "regular", phase: "countdown", eventName: "장개시10초전" },
  23: { session: "regular", phase: "countdown", eventName: "장개시1분전" },
  24: { session: "regular", phase: "countdown", eventName: "장개시5분전" },
  25: { session: "regular", phase: "countdown", eventName: "장개시10분전" },
  31: { session: "closingAuction", phase: "auction", eventName: "장후동시호가개시" },
  41: { session: "regular", phase: "close", eventName: "장마감" },
  42: { session: "regular", phase: "countdown", eventName: "장마감10초전" },
  43: { session: "regular", phase: "countdown", eventName: "장마감1분전" },
  44: { session: "regular", phase: "countdown", eventName: "장마감5분전" },
  51: { session: "afterHours", phase: "open", eventName: "시간외종가매매개시" },
  52: { session: "afterHoursSingle", phase: "open", eventName: "시간외종가매매종료,시간외단일가매매개시" },
  54: { session: "afterHoursSingle", phase: "close", eventName: "시간외단일가매매종료" },
  55: { session: "preMarket", phase: "open", eventName: "프리마켓 개시" },
  56: { session: "afterMarket", phase: "open", eventName: "에프터마켓 개시" },
  57: { session: "preMarket", phase: "close", eventName: "프리마켓 마감" },
  58: { session: "afterMarket", phase: "close", eventName: "에프터마켓 마감" },
  61: { session: "regular", phase: "halt", eventName: "서킷브레이크1단계발동" },
  62: { session: "regular", phase: "resume", eventName: "서킷브레이크1단계해제,호가접수개시" },
  63: { session: "regular", phase: "auction", eventName: "서킷브레이크1단계,동시호가종료" },
  64: { session: "regular", phase: "sidecar", eventName: "사이드카 매도발동" },
  65: { session: "regular", phase: "sidecarRelease", eventName: "사이드카 매도해제" },
  66: { session: "regular", phase: "sidecar", eventName: "사이드카 매수발동" },
  67: { session: "regular", phase: "sidecarRelease", eventName: "사이드카 매수해제" },
  68: { session: "regular", phase: "halt", eventName: "서킷브레이크2단계발동" },
  69: { session: "regular", phase: "halt", eventName: "서킷브레이크3단계발동,당일 장종료" },
  70: { session: "regular", phase: "resume", eventName: "서킷브레이크2단계해제,호가접수개시" },
  71: { session: "regular", phase: "auction", eventName: "서킷브레이크2단계,동시호가종료" },
  A2: { session: "preMarket", phase: "countdown", eventName: "프리마켓 장개시10초전" },
  A3: { session: "preMarket", phase: "countdown", eventName: "프리마켓 장개시1분전" },
  A4: { session: "preMarket", phase: "countdown", eventName: "프리마켓 장개시5분전" },
  A5: { session: "preMarket", phase: "countdown", eventName: "프리마켓 장개시10분전" },
  B2: { session: "afterMarket", phase: "countdown", eventName: "에프터마켓 장개시10초전" },
  B3: { session: "afterMarket", phase: "countdown", eventName: "에프터마켓 장개시1분전" },
  B4: { session: "afterMarket", phase: "countdown", eventName: "에프터마켓 장개시5분전" },
  B5: { session: "afterMarket", phase: "countdown", eventName: "에프터마켓 장개시10분전" },
  C2: { session: "preMarket", phase: "countdown", eventName: "프리마켓 장마감10초전" },
  C3: { session: "preMarket", phase: "countdown", eventName: "프리마켓 장마감1분전" },
  C4: { session: "preMarket", phase: "countdown", eventName: "프리마켓 장마감5분전" },
  D2: { session: "afterMarket", phase: "countdown", eventName: "에프터마켓 장마감10초전" },
  D3: { session: "afterMarket", phase: "countdown", eventName: "에프터마켓 장마감1분전" },
  D4: { session: "afterMarket", phase: "countdown", eventName: "에프터마켓 장마감5분전" },
});

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

  async subscribeMarketStatus(broker, handlers = {}, options = {}) {
    const normalizedBroker = String(broker ?? "").trim().toLowerCase();

    return this.subscribe({
      broker,
      key: options.key ?? defaultMarketStatusKey(normalizedBroker),
      handlers,
      options,
      capabilityId: MARKET_STATUS_CAPABILITY_ID,
      streamKind: "quote",
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

export function normalizeMarketStatusRealtimeMessage(broker, payload) {
  return normalizeDomesticStockRealtimeMessage(broker, payload).filter((message) => message.kind === "marketStatus");
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

function defaultMarketStatusKey(broker) {
  return broker === "ls" ? "0" : "";
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

  if (isMarketStatusMessage(message)) {
    return normalizeRealtimeMarketStatus(message);
  }

  return {
    ...message,
    kind: "unknown",
  };
}

function isTradeMessage(message) {
  if (message.broker === "kiwoom") {
    return message.id === "0B";
  }
  if (message.broker === "db") {
    return message.id === "S00";
  }
  if (message.broker === "kis") {
    return ["H0STCNT0", "H0UNCNT0"].includes(message.id);
  }
  return ["S3_", "K3_", "US3"].includes(message.id);
}

function isOrderBookMessage(message) {
  if (message.broker === "kiwoom") {
    return ["0D", "0C"].includes(message.id);
  }
  if (message.broker === "db") {
    return message.id === "S01";
  }
  if (message.broker === "kis") {
    return ["H0STASP0", "H0UNASP0"].includes(message.id);
  }
  return ["H1_", "HA_", "UH1"].includes(message.id);
}

function isOrderEventMessage(message) {
  if (message.broker === "kiwoom") {
    return message.id === "00";
  }
  if (message.broker === "db") {
    return ["IS0", "IS1"].includes(message.id);
  }
  if (message.broker === "kis") {
    return message.id === "H0STCNI0";
  }
  return ["SC0", "SC1", "SC2", "SC3", "SC4"].includes(message.id);
}

function isMarketStatusMessage(message) {
  return message.broker === "kiwoom"
    ? message.id === "0s"
    : message.id === "JIF";
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

  if (message.broker === "db") {
    return {
      ...message,
      kind: "trade",
      symbol: normalizeSymbol(firstValue(body, ["ShrnIscd"]) ?? message.key),
      tradeTime: nullableString(firstValue(body, ["StckCntghour", "BsopHour"])),
      price: parsePrice(firstValue(body, ["StckPrpr", "Prpr"])),
      priceRaw: nullableString(firstValue(body, ["StckPrpr", "Prpr"])),
      change: parseNumber(firstValue(body, ["PrdyVrss"])),
      changeRaw: nullableString(firstValue(body, ["PrdyVrss"])),
      changeRate: parseNumber(firstValue(body, ["PrdyCtrt"])),
      changeRateRaw: nullableString(firstValue(body, ["PrdyCtrt"])),
      tradeQuantity: parseAbsNumber(firstValue(body, ["CntgVol", "Cvolume"])),
      tradeQuantityRaw: nullableString(firstValue(body, ["CntgVol", "Cvolume"])),
      tradeSide: null,
      volume: parseNumber(firstValue(body, ["AcmlVol"])),
      volumeRaw: nullableString(firstValue(body, ["AcmlVol"])),
      value: parseNumber(firstValue(body, ["AcmlTrPbmn"])),
      valueRaw: nullableString(firstValue(body, ["AcmlTrPbmn"])),
      currency: "KRW",
    };
  }

  if (message.broker === "kis") {
    return {
      ...message,
      kind: "trade",
      symbol: normalizeSymbol(firstValue(body, ["stck_shrn_iscd"]) ?? message.key),
      tradeTime: nullableString(firstValue(body, ["stck_cntg_hour"])),
      price: parsePrice(firstValue(body, ["stck_prpr"])),
      priceRaw: nullableString(firstValue(body, ["stck_prpr"])),
      change: parseNumber(firstValue(body, ["prdy_vrss"])),
      changeRaw: nullableString(firstValue(body, ["prdy_vrss"])),
      changeRate: parseNumber(firstValue(body, ["prdy_ctrt"])),
      changeRateRaw: nullableString(firstValue(body, ["prdy_ctrt"])),
      tradeQuantity: parseAbsNumber(firstValue(body, ["cntg_vol"])),
      tradeQuantityRaw: nullableString(firstValue(body, ["cntg_vol"])),
      tradeSide: null,
      volume: parseNumber(firstValue(body, ["acml_vol"])),
      volumeRaw: nullableString(firstValue(body, ["acml_vol"])),
      value: parseNumber(firstValue(body, ["acml_tr_pbmn"])),
      valueRaw: nullableString(firstValue(body, ["acml_tr_pbmn"])),
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

  if (message.broker === "db") {
    return {
      ...message,
      kind: "orderBook",
      symbol: normalizeSymbol(firstValue(body, ["ShrnIscd"]) ?? message.key),
      timestamp: nullableString(firstValue(body, ["BsopHour"])),
      asks: Array.from({ length: 10 }, (_, index) => orderBookLevel(
        index + 1,
        firstValue(body, [`askp${index + 1}`, `Askp${index + 1}`]),
        firstValue(body, [`AskpRsqn${index + 1}`, `askp_rsqn${index + 1}`]),
      )),
      bids: Array.from({ length: 10 }, (_, index) => orderBookLevel(
        index + 1,
        firstValue(body, [`bidp${index + 1}`, `Bidp${index + 1}`]),
        firstValue(body, [`BidpRsqn${index + 1}`, `bidp_rsqn${index + 1}`]),
      )),
      totals: {
        askQuantity: parseNumber(firstValue(body, ["TotalAskpRsqn", "AskpTtalRsqn"])),
        askQuantityRaw: nullableString(firstValue(body, ["TotalAskpRsqn", "AskpTtalRsqn"])),
        bidQuantity: parseNumber(firstValue(body, ["TotalBidpRsqn", "BidpTtalRsqn"])),
        bidQuantityRaw: nullableString(firstValue(body, ["TotalBidpRsqn", "BidpTtalRsqn"])),
      },
    };
  }

  if (message.broker === "kis") {
    return {
      ...message,
      kind: "orderBook",
      symbol: normalizeSymbol(firstValue(body, ["stck_shrn_iscd"]) ?? message.key),
      timestamp: nullableString(firstValue(body, ["aspr_acpt_hour"])),
      asks: Array.from({ length: 10 }, (_, index) => orderBookLevel(
        index + 1,
        firstValue(body, [`askp${index + 1}`]),
        firstValue(body, [`askp_rsqn${index + 1}`]),
      )),
      bids: Array.from({ length: 10 }, (_, index) => orderBookLevel(
        index + 1,
        firstValue(body, [`bidp${index + 1}`]),
        firstValue(body, [`bidp_rsqn${index + 1}`]),
      )),
      totals: {
        askQuantity: parseNumber(firstValue(body, ["total_askp_rsqn"])),
        askQuantityRaw: nullableString(firstValue(body, ["total_askp_rsqn"])),
        bidQuantity: parseNumber(firstValue(body, ["total_bidp_rsqn"])),
        bidQuantityRaw: nullableString(firstValue(body, ["total_bidp_rsqn"])),
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

  if (message.broker === "db") {
    return {
      ...message,
      kind: "orderEvent",
      accountId: null,
      orderId: nullableString(firstValue(body, ["Sordno"])),
      originalOrderId: nullableString(firstValue(body, ["Sorgordno"])),
      executionId: nullableString(firstValue(body, ["Sexecno"])),
      symbol: normalizeSymbol(firstValue(body, ["Sshtnisuno", "Sisuno"]) ?? message.key),
      name: nullableString(firstValue(body, ["Sisunm"])) ?? message.name,
      side: sideFromBrokerCode(message.broker, firstValue(body, ["Strancode", "Sordptncode"])),
      status: nullableString(firstValue(body, ["Sordxctptncode"])),
      orderType: nullableString(firstValue(body, ["Sordprcptncode"])),
      orderQuantity: parseNumber(firstValue(body, ["Sordqty"])),
      orderQuantityRaw: nullableString(firstValue(body, ["Sordqty"])),
      orderPrice: parsePrice(firstValue(body, ["Sordprc"])),
      orderPriceRaw: nullableString(firstValue(body, ["Sordprc"])),
      executedQuantity: parseNumber(firstValue(body, ["Sexecqty"])),
      executedQuantityRaw: nullableString(firstValue(body, ["Sexecqty"])),
      executedPrice: parsePrice(firstValue(body, ["Sexecprc"])),
      executedPriceRaw: nullableString(firstValue(body, ["Sexecprc"])),
      remainingQuantity: null,
      remainingQuantityRaw: null,
      eventTime: nullableString(firstValue(body, ["Sordtm", "Sexectime"])),
    };
  }

  if (message.broker === "kis") {
    return {
      ...message,
      kind: "orderEvent",
      accountId: nullableString(firstValue(body, ["acnt_no"])),
      orderId: nullableString(firstValue(body, ["odno"])),
      originalOrderId: nullableString(firstValue(body, ["orgn_odno"])),
      executionId: nullableString(firstValue(body, ["cntg_no"])),
      symbol: normalizeSymbol(firstValue(body, ["stck_shrn_iscd", "pdno"]) ?? message.key),
      name: nullableString(firstValue(body, ["prdt_name"])) ?? message.name,
      side: sideFromBrokerCode(message.broker, firstValue(body, ["sll_buy_dvsn_cd"])),
      status: nullableString(firstValue(body, ["oder_tmd", "ccld_dvsn"])),
      orderType: nullableString(firstValue(body, ["ord_dvsn"])),
      orderQuantity: parseNumber(firstValue(body, ["ord_qty"])),
      orderQuantityRaw: nullableString(firstValue(body, ["ord_qty"])),
      orderPrice: parsePrice(firstValue(body, ["ord_unpr"])),
      orderPriceRaw: nullableString(firstValue(body, ["ord_unpr"])),
      executedQuantity: parseNumber(firstValue(body, ["cntg_qty"])),
      executedQuantityRaw: nullableString(firstValue(body, ["cntg_qty"])),
      executedPrice: parsePrice(firstValue(body, ["cntg_unpr"])),
      executedPriceRaw: nullableString(firstValue(body, ["cntg_unpr"])),
      remainingQuantity: parseNumber(firstValue(body, ["rmn_qty"])),
      remainingQuantityRaw: nullableString(firstValue(body, ["rmn_qty"])),
      eventTime: nullableString(firstValue(body, ["cntg_hour", "oder_tmd"])),
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

function normalizeRealtimeMarketStatus(message) {
  const body = message.body ?? {};

  if (message.broker === "kiwoom") {
    const eventCode = nullableString(firstValue(body, ["215"]));
    const event = KIWOOM_MARKET_STATUS_EVENTS[eventCode] ?? {};

    return {
      ...message,
      kind: "marketStatus",
      market: nullableString(message.key) || null,
      marketCode: nullableString(message.key),
      marketName: null,
      session: event.session ?? null,
      phase: event.phase ?? null,
      eventCode,
      eventName: event.eventName ?? message.name ?? null,
      time: nullableString(firstValue(body, ["20"])),
      remainingTime: nullableString(firstValue(body, ["214"])),
    };
  }

  const marketCode = nullableString(firstValue(body, ["jangubun"]));
  const eventCode = nullableString(firstValue(body, ["jstatus"]));
  const market = LS_MARKET_STATUS_MARKETS[marketCode] ?? {};
  const event = LS_MARKET_STATUS_EVENTS[eventCode] ?? {};

  return {
    ...message,
    kind: "marketStatus",
    market: market.market ?? null,
    marketCode,
    marketName: market.marketName ?? null,
    session: event.session ?? null,
    phase: event.phase ?? null,
    eventCode,
    eventName: event.eventName ?? null,
    time: nullableString(firstValue(body, ["time", "chetime"])),
    remainingTime: nullableString(firstValue(body, ["remainingTime", "remtime"])),
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
