import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const CAPABILITY_ID = "quote.domesticStock.currentPrice";

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

      if (!capabilities.supports(CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: CAPABILITY_ID },
          }),
        });
      }

      const client = this.clients[normalizedBroker];
      if (!client?.request) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          error: BrokerError.config(`Missing client for broker: ${normalizedBroker}`, {
            broker: normalizedBroker,
            details: { broker: normalizedBroker },
          }),
        });
      }

      source = selectCurrentPriceSource(normalizedBroker, capabilities, options);
      const result = await requestCurrentPrice(client, normalizedBroker, source.id, normalizedSymbol, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          result,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        symbol: normalizedSymbol,
        source,
        result,
        data: normalizeDomesticStockCurrentPrice(normalizedBroker, normalizedSymbol, source.id, result.data),
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol: normalizedSymbol,
        source,
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

function selectCurrentPriceSource(broker, capabilities, options) {
  const preferredId = options.apiId ?? options.trCode;
  const sources = capabilities.findApis(CAPABILITY_ID).filter((api) => api.transport === "rest");

  if (preferredId) {
    const source = sources.find((api) => api.id === preferredId);
    if (!source) {
      throw BrokerError.unsupported(`${broker} ${CAPABILITY_ID} does not expose ${preferredId}`, {
        broker,
        details: {
          capabilityId: CAPABILITY_ID,
          requestedId: preferredId,
        },
      });
    }

    return source;
  }

  const defaultId = broker === "kiwoom" ? "ka10001" : "t1101";
  const source = sources.find((api) => api.id === defaultId) ?? sources[0];

  if (!source) {
    throw BrokerError.unsupported(`${broker} does not have a REST source for ${CAPABILITY_ID}`, {
      broker,
      details: { capabilityId: CAPABILITY_ID },
    });
  }

  return source;
}

async function requestCurrentPrice(client, broker, sourceId, symbol, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, { stk_cd: symbol }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, { [`${sourceId}InBlock`]: { shcode: symbol } }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported quote request broker: ${broker}`, {
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
      capabilityId: CAPABILITY_ID,
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
      capabilityId: CAPABILITY_ID,
    },
  };
}

function successResponse({ broker, symbol, source, result, data }) {
  return {
    ok: true,
    broker,
    capability: CAPABILITY_ID,
    id: source.id,
    symbol,
    data,
    raw: result.raw,
    headers: result.headers ?? {},
    status: result.status ?? 0,
    continuation: result.continuation,
  };
}

function failureResponse({ broker, symbol, source, result, error }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Quote service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: CAPABILITY_ID,
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

function normalizeSymbol(symbol) {
  const normalized = String(symbol ?? "").trim();

  if (!normalized) {
    throw BrokerError.validation("Domestic stock symbol is required", {
      details: { capabilityId: CAPABILITY_ID },
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
