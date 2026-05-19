import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const CURRENT_PRICE_CAPABILITY_ID = "quote.domesticStock.currentPrice";
const ORDER_BOOK_CAPABILITY_ID = "quote.domesticStock.orderBook";
const MULTI_CURRENT_PRICE_CAPABILITY_ID = "quote.domesticStock.multiCurrentPrice";

export class QuoteService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getDomesticStockCurrentPrice(broker, symbol, options = {}) {
    let normalizedSymbol = String(symbol ?? "").trim();
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;

    try {
      normalizedSymbol = normalizeSymbol(symbol);
      normalizedBroker = assertBroker(normalizedBroker);
      const capabilities = getCapabilities(normalizedBroker);

      if (!capabilities.supports(CURRENT_PRICE_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          capabilityId: CURRENT_PRICE_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${CURRENT_PRICE_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: CURRENT_PRICE_CAPABILITY_ID },
          }),
        });
      }

      const client = this.clients[normalizedBroker];
      if (!client?.request) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          capabilityId: CURRENT_PRICE_CAPABILITY_ID,
          error: BrokerError.config(`Missing client for broker: ${normalizedBroker}`, {
            broker: normalizedBroker,
            details: { broker: normalizedBroker },
          }),
        });
      }

      source = selectQuoteSource(normalizedBroker, capabilities, CURRENT_PRICE_CAPABILITY_ID, options);
      const result = await requestCurrentPrice(client, normalizedBroker, source.id, normalizedSymbol, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          result,
          capabilityId: CURRENT_PRICE_CAPABILITY_ID,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        symbol: normalizedSymbol,
        source,
        result,
        data: normalizeDomesticStockCurrentPrice(normalizedBroker, normalizedSymbol, source.id, result.data),
        capabilityId: CURRENT_PRICE_CAPABILITY_ID,
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol: normalizedSymbol,
        source,
        capabilityId: CURRENT_PRICE_CAPABILITY_ID,
        error,
      });
    }
  }

  async getDomesticStockOrderBook(broker, symbol, options = {}) {
    let normalizedSymbol = String(symbol ?? "").trim();
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;

    try {
      normalizedSymbol = normalizeSymbol(symbol, ORDER_BOOK_CAPABILITY_ID);
      normalizedBroker = assertBroker(normalizedBroker);
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(ORDER_BOOK_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          capabilityId: ORDER_BOOK_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${ORDER_BOOK_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: ORDER_BOOK_CAPABILITY_ID },
          }),
        });
      }

      source = selectQuoteSource(normalizedBroker, capabilities, ORDER_BOOK_CAPABILITY_ID, options);
      const result = await requestOrderBook(client, normalizedBroker, source.id, normalizedSymbol, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          result,
          capabilityId: ORDER_BOOK_CAPABILITY_ID,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        symbol: normalizedSymbol,
        source,
        result,
        data: normalizeDomesticStockOrderBook(normalizedBroker, normalizedSymbol, source.id, result.data),
        capabilityId: ORDER_BOOK_CAPABILITY_ID,
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol: normalizedSymbol,
        source,
        capabilityId: ORDER_BOOK_CAPABILITY_ID,
        error,
      });
    }
  }

  async getDomesticStockMultiCurrentPrice(broker, symbols, options = {}) {
    let normalizedSymbols = [];
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;

    try {
      normalizedSymbols = normalizeSymbols(symbols);
      normalizedBroker = assertBroker(normalizedBroker);
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(MULTI_CURRENT_PRICE_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbols.join(","),
          source,
          capabilityId: MULTI_CURRENT_PRICE_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${MULTI_CURRENT_PRICE_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: MULTI_CURRENT_PRICE_CAPABILITY_ID },
          }),
        });
      }

      source = selectQuoteSource(normalizedBroker, capabilities, MULTI_CURRENT_PRICE_CAPABILITY_ID, options);
      const result = await requestMultiCurrentPrice(client, normalizedBroker, source.id, normalizedSymbols, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbols.join(","),
          source,
          result,
          capabilityId: MULTI_CURRENT_PRICE_CAPABILITY_ID,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        symbol: normalizedSymbols.join(","),
        source,
        result,
        data: normalizeDomesticStockMultiCurrentPrice(normalizedBroker, normalizedSymbols, source.id, result.data),
        capabilityId: MULTI_CURRENT_PRICE_CAPABILITY_ID,
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol: normalizedSymbols.join(","),
        source,
        capabilityId: MULTI_CURRENT_PRICE_CAPABILITY_ID,
        error,
      });
    }
  }
}

export function normalizeDomesticStockCurrentPrice(broker, symbol, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomCurrentPrice(symbol, sourceId, payload);
  }

  if (broker === "ls") {
    return normalizeLsCurrentPrice(symbol, sourceId, payload);
  }

  throw BrokerError.unsupported(`Unsupported quote normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticStockMultiCurrentPrice(broker, symbols, sourceId, payload) {
  if (broker === "kiwoom") {
    const rows = Array.isArray(payload?.atn_stk_infr) ? payload.atn_stk_infr : [];
    return rows.map((row) => normalizeKiwoomCurrentPrice(firstValue(row, ["stk_cd"]) ?? "", sourceId, row));
  }

  if (broker === "ls") {
    const rows = Array.isArray(payload?.t8407OutBlock1) ? payload.t8407OutBlock1 : [];
    return rows.map((row) => normalizeLsCurrentPrice(firstValue(row, ["shcode"]) ?? "", sourceId, row));
  }

  throw BrokerError.unsupported(`Unsupported multi quote normalization broker: ${broker}`, {
    broker,
    details: { sourceId, symbols },
  });
}

export function normalizeDomesticStockOrderBook(broker, symbol, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomOrderBook(symbol, sourceId, payload);
  }

  if (broker === "ls") {
    return normalizeLsOrderBook(symbol, sourceId, payload);
  }

  throw BrokerError.unsupported(`Unsupported order book normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

function resolveClient(clients, broker) {
  const client = clients[broker];
  if (!client?.request) {
    throw BrokerError.config(`Missing client for broker: ${broker}`, {
      broker,
      details: { broker },
    });
  }

  return {
    client,
    capabilities: getCapabilities(broker),
  };
}

function selectQuoteSource(broker, capabilities, capabilityId, options) {
  const preferredId = options.apiId ?? options.trCode;
  const sources = capabilities.findApis(capabilityId).filter((api) => api.transport === "rest");

  if (preferredId) {
    const source = sources.find((api) => api.id === preferredId);
    if (!source) {
      throw BrokerError.unsupported(`${broker} ${capabilityId} does not expose ${preferredId}`, {
        broker,
        details: {
          capabilityId,
          requestedId: preferredId,
        },
      });
    }

    return source;
  }

  const defaultId = defaultSourceId(broker, capabilityId);
  const source = sources.find((api) => api.id === defaultId) ?? sources[0];

  if (!source) {
    throw BrokerError.unsupported(`${broker} does not have a REST source for ${capabilityId}`, {
      broker,
      details: { capabilityId },
    });
  }

  return source;
}

function defaultSourceId(broker, capabilityId) {
  if (capabilityId === CURRENT_PRICE_CAPABILITY_ID) {
    return broker === "kiwoom" ? "ka10001" : "t1101";
  }

  if (capabilityId === ORDER_BOOK_CAPABILITY_ID) {
    return broker === "kiwoom" ? "ka10004" : "t1101";
  }

  if (capabilityId === MULTI_CURRENT_PRICE_CAPABILITY_ID) {
    return broker === "kiwoom" ? "ka10095" : "t8407";
  }

  return null;
}

async function requestCurrentPrice(client, broker, sourceId, symbol, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, { stk_cd: symbol }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        shcode: symbol,
        ...lsExchangeParam(sourceId, options),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported quote request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestOrderBook(client, broker, sourceId, symbol, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, { stk_cd: symbol }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        shcode: symbol,
        ...lsExchangeParam(sourceId, options),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported order book request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestMultiCurrentPrice(client, broker, sourceId, symbols, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, { stk_cd: symbols.join("|") }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        nrec: symbols.length,
        shcode: symbols.join(""),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported multi quote request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

function normalizeKiwoomCurrentPrice(symbol, sourceId, payload) {
  const priceRaw = firstValue(payload, ["cur_prc", "cur_price", "price"]);
  const changeRaw = firstValue(payload, ["pred_pre", "change"]);
  const changeRateRaw = firstValue(payload, ["flu_rt", "diff"]);
  const volumeRaw = firstValue(payload, ["trde_qty", "volume"]);

  return {
    broker: "kiwoom",
    symbol: String(firstValue(payload, ["stk_cd"]) ?? symbol),
    name: nullableString(firstValue(payload, ["stk_nm"])),
    price: parsePrice(priceRaw),
    priceRaw: nullableString(priceRaw),
    change: parseNumber(changeRaw),
    changeRaw: nullableString(changeRaw),
    changeRate: parseNumber(changeRateRaw),
    changeRateRaw: nullableString(changeRateRaw),
    volume: parseNumber(volumeRaw),
    volumeRaw: nullableString(volumeRaw),
    currency: "KRW",
    source: {
      broker: "kiwoom",
      id: sourceId,
      capabilityId: CURRENT_PRICE_CAPABILITY_ID,
    },
  };
}

function normalizeLsCurrentPrice(symbol, sourceId, payload) {
  const block = payload?.[`${sourceId}OutBlock`] ?? payload?.t1101OutBlock ?? payload?.t1102OutBlock ?? payload;
  const priceRaw = firstValue(block, ["price", "cur_prc", "cur_price"]);
  const changeRaw = firstValue(block, ["change"]);
  const changeRateRaw = firstValue(block, ["diff"]);
  const volumeRaw = firstValue(block, ["volume"]);

  return {
    broker: "ls",
    symbol: String(firstValue(block, ["shcode"]) ?? symbol),
    name: nullableString(firstValue(block, ["hname"])),
    price: parsePrice(priceRaw),
    priceRaw: nullableString(priceRaw),
    change: parseNumber(changeRaw),
    changeRaw: nullableString(changeRaw),
    changeRate: parseNumber(changeRateRaw),
    changeRateRaw: nullableString(changeRateRaw),
    volume: parseNumber(volumeRaw),
    volumeRaw: nullableString(volumeRaw),
    currency: "KRW",
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: CURRENT_PRICE_CAPABILITY_ID,
    },
  };
}

function normalizeKiwoomOrderBook(symbol, sourceId, payload) {
  return {
    broker: "kiwoom",
    symbol,
    asks: Array.from({ length: 10 }, (_, index) => kiwoomOrderBookLevel(payload, "ask", index + 1)),
    bids: Array.from({ length: 10 }, (_, index) => kiwoomOrderBookLevel(payload, "bid", index + 1)),
    totals: {
      askQuantity: parseNumber(firstValue(payload, ["tot_sel_req"])),
      askQuantityRaw: nullableString(firstValue(payload, ["tot_sel_req"])),
      bidQuantity: parseNumber(firstValue(payload, ["tot_buy_req"])),
      bidQuantityRaw: nullableString(firstValue(payload, ["tot_buy_req"])),
    },
    timestamp: nullableString(firstValue(payload, ["bid_req_base_tm"])),
    source: {
      broker: "kiwoom",
      id: sourceId,
      capabilityId: ORDER_BOOK_CAPABILITY_ID,
    },
  };
}

function normalizeLsOrderBook(symbol, sourceId, payload) {
  const block = payload?.[`${sourceId}OutBlock`] ?? payload?.t1101OutBlock ?? payload;

  return {
    broker: "ls",
    symbol: String(firstValue(block, ["shcode"]) ?? symbol),
    asks: Array.from({ length: 10 }, (_, index) => lsOrderBookLevel(block, "ask", index + 1)),
    bids: Array.from({ length: 10 }, (_, index) => lsOrderBookLevel(block, "bid", index + 1)),
    totals: {
      askQuantity: parseNumber(firstValue(block, ["totofferrem"])),
      askQuantityRaw: nullableString(firstValue(block, ["totofferrem"])),
      bidQuantity: parseNumber(firstValue(block, ["totbidrem"])),
      bidQuantityRaw: nullableString(firstValue(block, ["totbidrem"])),
    },
    timestamp: nullableString(firstValue(block, ["hotime"])),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: ORDER_BOOK_CAPABILITY_ID,
    },
  };
}

function kiwoomOrderBookLevel(payload, side, level) {
  const prefix = side === "ask" ? "sel" : "buy";
  const priceKey = level === 1 ? `${prefix}_fpr_bid` : `${prefix}_${level}th_pre_bid`;
  const quantityKey = level === 1 ? `${prefix}_fpr_req` : `${prefix}_${level}th_pre_req`;

  return orderBookLevel(level, payload?.[priceKey], payload?.[quantityKey]);
}

function lsOrderBookLevel(payload, side, level) {
  const priceKey = side === "ask" ? `offerho${level}` : `bidho${level}`;
  const quantityKey = side === "ask" ? `offerrem${level}` : `bidrem${level}`;

  return orderBookLevel(level, payload?.[priceKey], payload?.[quantityKey]);
}

function lsExchangeParam(sourceId, options = {}) {
  if (!["t1102", "t8450"].includes(sourceId)) {
    return {};
  }

  return {
    exchgubun: options.exchangeCode ?? options.exchange ?? "K",
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

function successResponse({ broker, symbol, source, result, data, capabilityId }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: source.id,
    symbol,
    data,
    raw: result.raw,
    headers: result.headers ?? {},
    status: result.status ?? 0,
    continuation: result.continuation,
  };
}

function failureResponse({ broker, symbol, source, result, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Quote service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: source?.id ?? result?.id ?? null,
    symbol,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
}

function normalizeSymbol(symbol, capabilityId = CURRENT_PRICE_CAPABILITY_ID) {
  const normalized = String(symbol ?? "").trim();

  if (!normalized) {
    throw BrokerError.validation("Domestic stock symbol is required", {
      details: { capabilityId },
    });
  }

  return normalized;
}

function normalizeSymbols(symbols) {
  if (!Array.isArray(symbols)) {
    throw BrokerError.validation("Domestic stock symbols must be an array", {
      details: { capabilityId: MULTI_CURRENT_PRICE_CAPABILITY_ID },
    });
  }

  const normalized = symbols.map((symbol) => normalizeSymbol(symbol, MULTI_CURRENT_PRICE_CAPABILITY_ID));

  if (normalized.length === 0) {
    throw BrokerError.validation("At least one domestic stock symbol is required", {
      details: { capabilityId: MULTI_CURRENT_PRICE_CAPABILITY_ID },
    });
  }

  return normalized;
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
