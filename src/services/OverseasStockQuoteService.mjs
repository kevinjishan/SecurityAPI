import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const CURRENT_PRICE_CAPABILITY_ID = "overseasStock.quote.currentPrice";
const ORDER_BOOK_CAPABILITY_ID = "overseasStock.quote.orderBook";

export class OverseasStockQuoteService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getOverseasStockCurrentPrice(broker, identity, options = {}) {
    return this.#requestQuote({
      broker,
      identity,
      options,
      capabilityId: CURRENT_PRICE_CAPABILITY_ID,
      request: requestCurrentPrice,
      normalize: normalizeOverseasStockCurrentPrice,
    });
  }

  async getOverseasStockOrderBook(broker, identity, options = {}) {
    return this.#requestQuote({
      broker,
      identity,
      options,
      capabilityId: ORDER_BOOK_CAPABILITY_ID,
      request: requestOrderBook,
      normalize: normalizeOverseasStockOrderBook,
    });
  }

  async #requestQuote({ broker, identity, options, capabilityId, request, normalize }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedIdentity = normalizeIdentityPreview(identity);
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      normalizedIdentity = normalizeOverseasStockIdentity(identity, options, capabilityId);
      const capabilities = getCapabilities(normalizedBroker);

      if (!capabilities.supports(capabilityId)) {
        return failureResponse({
          broker: normalizedBroker,
          identity: normalizedIdentity,
          source,
          capabilityId,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${capabilityId}`, {
            broker: normalizedBroker,
            details: { capabilityId },
          }),
        });
      }

      const client = this.clients[normalizedBroker];
      if (!client?.request) {
        return failureResponse({
          broker: normalizedBroker,
          identity: normalizedIdentity,
          source,
          capabilityId,
          error: BrokerError.config(`Missing client for broker: ${normalizedBroker}`, {
            broker: normalizedBroker,
            details: { broker: normalizedBroker },
          }),
        });
      }

      source = selectQuoteSource(normalizedBroker, capabilities, capabilityId, options);
      const result = await request(client, normalizedBroker, source.id, normalizedIdentity, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          identity: normalizedIdentity,
          source,
          result,
          capabilityId,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        identity: normalizedIdentity,
        source,
        result,
        data: normalize(normalizedBroker, normalizedIdentity, source.id, result.data),
        capabilityId,
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        identity: normalizedIdentity,
        source,
        capabilityId,
        error,
      });
    }
  }
}

export function normalizeOverseasStockCurrentPrice(broker, identity, sourceId, payload) {
  if (broker !== "ls") {
    throw BrokerError.unsupported(`Unsupported overseas quote normalization broker: ${broker}`, {
      broker,
      details: { sourceId },
    });
  }

  const block = responseBlock(payload, sourceId);
  const symbol = String(firstValue(block, ["symbol"]) ?? identity.symbol);
  const keySymbol = nullableString(firstValue(block, ["keysymbol"]) ?? identity.keySymbol);
  const exchangeCode = nullableString(firstValue(block, ["exchcd"]) ?? identity.exchangeCode);
  const priceRaw = firstValue(block, ["price"]);
  const changeRaw = firstValue(block, ["diff"]);
  const changeRateRaw = firstValue(block, ["rate"]);
  const volumeRaw = firstValue(block, ["volume"]);
  const amountRaw = firstValue(block, ["amount"]);

  return {
    broker: "ls",
    symbol,
    keySymbol,
    exchangeCode,
    exchangeId: nullableString(firstValue(block, ["exchange"])),
    name: nullableString(firstValue(block, ["korname"])),
    industryName: nullableString(firstValue(block, ["induname"])),
    price: parsePrice(priceRaw),
    priceRaw: nullableString(priceRaw),
    change: parseNumber(changeRaw),
    changeRaw: nullableString(changeRaw),
    changeRate: parseNumber(changeRateRaw),
    changeRateRaw: nullableString(changeRateRaw),
    volume: parseNumber(volumeRaw),
    volumeRaw: nullableString(volumeRaw),
    amount: parseNumber(amountRaw),
    amountRaw: nullableString(amountRaw),
    open: parsePrice(firstValue(block, ["open"])),
    high: parsePrice(firstValue(block, ["high"])),
    low: parsePrice(firstValue(block, ["low"])),
    high52Week: parsePrice(firstValue(block, ["high52p"])),
    low52Week: parsePrice(firstValue(block, ["low52p"])),
    upperLimit: parsePrice(firstValue(block, ["uplimit"])),
    lowerLimit: parsePrice(firstValue(block, ["dnlimit"])),
    per: parseNumber(firstValue(block, ["perv"])),
    eps: parseNumber(firstValue(block, ["epsv"])),
    sign: nullableString(firstValue(block, ["sign"])),
    currency: nullableString(firstValue(block, ["currency"]) ?? identity.currencyCode),
    delayType: nullableString(firstValue(block, ["delaygb"]) ?? identity.delayType),
    floatPoint: nullableString(firstValue(block, ["floatpoint"])),
    tradingStatus: {
      suspend: nullableString(firstValue(block, ["suspend"])),
      sellOnly: nullableString(firstValue(block, ["sellonly"])),
    },
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: CURRENT_PRICE_CAPABILITY_ID,
    },
    raw: block,
  };
}

export function normalizeOverseasStockOrderBook(broker, identity, sourceId, payload) {
  if (broker !== "ls") {
    throw BrokerError.unsupported(`Unsupported overseas order book normalization broker: ${broker}`, {
      broker,
      details: { sourceId },
    });
  }

  const block = responseBlock(payload, sourceId);
  const symbol = String(firstValue(block, ["symbol"]) ?? identity.symbol);
  const priceRaw = firstValue(block, ["price"]);
  const changeRaw = firstValue(block, ["diff"]);
  const changeRateRaw = firstValue(block, ["rate"]);
  const volumeRaw = firstValue(block, ["volume"]);
  const amountRaw = firstValue(block, ["amount"]);

  return {
    broker: "ls",
    symbol,
    keySymbol: nullableString(firstValue(block, ["keysymbol"]) ?? identity.keySymbol),
    exchangeCode: nullableString(firstValue(block, ["exchcd"]) ?? identity.exchangeCode),
    name: nullableString(firstValue(block, ["korname"])),
    price: parsePrice(priceRaw),
    priceRaw: nullableString(priceRaw),
    change: parseNumber(changeRaw),
    changeRaw: nullableString(changeRaw),
    changeRate: parseNumber(changeRateRaw),
    changeRateRaw: nullableString(changeRateRaw),
    volume: parseNumber(volumeRaw),
    volumeRaw: nullableString(volumeRaw),
    amount: parseNumber(amountRaw),
    amountRaw: nullableString(amountRaw),
    previousClose: parsePrice(firstValue(block, ["jnilclose"])),
    open: parsePrice(firstValue(block, ["open"])),
    high: parsePrice(firstValue(block, ["high"])),
    low: parsePrice(firstValue(block, ["low"])),
    delayType: nullableString(firstValue(block, ["delaygb"]) ?? identity.delayType),
    floatPoint: nullableString(firstValue(block, ["floatpoint"])),
    asks: Array.from({ length: 10 }, (_, index) => lsOrderBookLevel(block, "ask", index + 1)),
    bids: Array.from({ length: 10 }, (_, index) => lsOrderBookLevel(block, "bid", index + 1)),
    totals: {
      askCount: parseNumber(firstValue(block, ["offercnt"])),
      askCountRaw: nullableString(firstValue(block, ["offercnt"])),
      bidCount: parseNumber(firstValue(block, ["bidcnt"])),
      bidCountRaw: nullableString(firstValue(block, ["bidcnt"])),
      askQuantity: parseNumber(firstValue(block, ["offer"])),
      askQuantityRaw: nullableString(firstValue(block, ["offer"])),
      bidQuantity: parseNumber(firstValue(block, ["bid"])),
      bidQuantityRaw: nullableString(firstValue(block, ["bid"])),
    },
    timestamp: nullableString(firstValue(block, ["hotime"])),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: ORDER_BOOK_CAPABILITY_ID,
    },
    raw: block,
  };
}

function selectQuoteSource(broker, capabilities, capabilityId, options) {
  const preferredId = options.apiId ?? options.trCode;
  const sources = capabilities.findApis(capabilityId, { status: "serviceReady" })
    .filter((api) => api.transport === "rest");

  if (preferredId) {
    const source = sources.find((api) => normalizeId(api.id) === normalizeId(preferredId));
    if (!source) {
      throw BrokerError.unsupported(`${broker} ${capabilityId} does not expose service-ready ${preferredId}`, {
        broker,
        details: { capabilityId, requestedId: preferredId },
      });
    }

    return source;
  }

  const source = sources[0];
  if (!source) {
    throw BrokerError.unsupported(`${broker} does not have a service-ready REST source for ${capabilityId}`, {
      broker,
      details: { capabilityId },
    });
  }

  return source;
}

async function requestCurrentPrice(client, broker, sourceId, identity, options) {
  if (broker === "ls") {
    return requestLsQuote(client, sourceId, identity, options);
  }

  throw BrokerError.unsupported(`Unsupported overseas current price broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestOrderBook(client, broker, sourceId, identity, options) {
  if (broker === "ls") {
    return requestLsQuote(client, sourceId, identity, options);
  }

  throw BrokerError.unsupported(`Unsupported overseas order book broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestLsQuote(client, sourceId, identity, options) {
  return client.request(sourceId, {
    [`${sourceId}InBlock`]: {
      delaygb: identity.delayType,
      keysymbol: identity.keySymbol,
      exchcd: identity.exchangeCode,
      symbol: identity.symbol,
    },
  }, options.requestOptions ?? {});
}

function normalizeOverseasStockIdentity(identity, options = {}, capabilityId) {
  const value = typeof identity === "string" ? { symbol: identity } : identity;
  if (!value || typeof value !== "object") {
    throw BrokerError.validation("Overseas stock identity must be an object or symbol string", {
      details: { capabilityId },
    });
  }

  const symbol = normalizeRequiredString(value.symbol, "symbol", capabilityId);
  const exchangeCode = firstNonBlank(value.exchangeCode, value.exchange, options.exchangeCode, options.exchange);
  if (!exchangeCode) {
    throw BrokerError.validation("Overseas stock exchangeCode is required", {
      details: { capabilityId, symbol },
    });
  }

  const delayType = firstNonBlank(value.delayType, options.delayType, "R");
  const keySymbol = firstNonBlank(value.keySymbol, value.keysymbol, options.keySymbol, options.keysymbol)
    ?? `${exchangeCode}${symbol}`;

  return {
    symbol,
    keySymbol,
    exchangeCode,
    marketCode: nullableString(firstNonBlank(value.marketCode, value.market, options.marketCode, options.market)),
    countryCode: nullableString(firstNonBlank(value.countryCode, value.country, options.countryCode, options.country)),
    currencyCode: nullableString(firstNonBlank(value.currencyCode, value.currency, options.currencyCode, options.currency)),
    delayType,
  };
}

function normalizeIdentityPreview(identity) {
  if (typeof identity === "string") {
    return { symbol: identity.trim() };
  }

  if (!identity || typeof identity !== "object") {
    return { symbol: "" };
  }

  return {
    symbol: String(identity.symbol ?? "").trim(),
    keySymbol: nullableString(identity.keySymbol ?? identity.keysymbol),
    exchangeCode: nullableString(identity.exchangeCode ?? identity.exchange),
  };
}

function normalizeRequiredString(value, field, capabilityId) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation(`Overseas stock ${field} is required`, {
      details: { capabilityId, field },
    });
  }

  return normalized;
}

function firstNonBlank(...values) {
  for (const value of values) {
    const normalized = nullableString(value);
    if (normalized !== null) {
      return normalized;
    }
  }

  return null;
}

function responseBlock(payload, sourceId) {
  return payload?.[`${sourceId}OutBlock`] ?? payload;
}

function lsOrderBookLevel(payload, side, level) {
  const priceKey = side === "ask" ? `offerho${level}` : `bidho${level}`;
  const quantityKey = side === "ask" ? `offerrem${level}` : `bidrem${level}`;
  const countKey = side === "ask" ? `offercnt${level}` : `bidcnt${level}`;

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

function successResponse({ broker, identity, source, result, data, capabilityId }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: source.id,
    symbol: identity.symbol,
    data,
    raw: result.raw,
    headers: result.headers ?? {},
    status: result.status ?? 0,
    continuation: result.continuation,
  };
}

function failureResponse({ broker, identity, source, result, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Overseas stock quote service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: source?.id ?? result?.id ?? null,
    symbol: identity?.symbol ?? null,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
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

function normalizeId(value) {
  return String(value ?? "").trim().toLowerCase();
}
