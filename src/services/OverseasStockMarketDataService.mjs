import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const BASIC_INFO_CAPABILITY_ID = "overseasStock.marketData.basicInfo";
const MASTER_CAPABILITY_ID = "overseasStock.marketData.master";
const CANDLES_CAPABILITY_ID = "overseasStock.marketData.candles";
const TIME_SERIES_CAPABILITY_ID = "overseasStock.marketData.timeSeries";

const CANDLE_PERIOD_CODES = Object.freeze({
  day: "2",
  daily: "2",
  week: "3",
  weekly: "3",
  month: "4",
  monthly: "4",
  year: "5",
  yearly: "5",
});

export class OverseasStockMarketDataService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getOverseasStockBasicInfo(broker, identity, options = {}) {
    return this.#requestMarketData({
      broker,
      input: identity,
      options,
      capabilityId: BASIC_INFO_CAPABILITY_ID,
      normalizeInput: normalizeOverseasStockIdentity,
      request: requestBasicInfo,
      normalize: normalizeOverseasStockBasicInfo,
    });
  }

  async getOverseasStockMaster(broker, query = {}, options = {}) {
    return this.#requestMarketData({
      broker,
      input: query,
      options,
      capabilityId: MASTER_CAPABILITY_ID,
      normalizeInput: normalizeMasterQuery,
      request: requestMaster,
      normalize: normalizeOverseasStockMaster,
    });
  }

  async getOverseasStockCandles(broker, identity, options = {}) {
    return this.#requestMarketData({
      broker,
      input: identity,
      options,
      capabilityId: CANDLES_CAPABILITY_ID,
      normalizeInput: normalizeOverseasStockIdentity,
      request: requestCandles,
      normalize: normalizeOverseasStockCandles,
    });
  }

  async getOverseasStockTimeSeries(broker, identity, options = {}) {
    return this.#requestMarketData({
      broker,
      input: identity,
      options,
      capabilityId: TIME_SERIES_CAPABILITY_ID,
      normalizeInput: normalizeOverseasStockIdentity,
      request: requestTimeSeries,
      normalize: normalizeOverseasStockTimeSeries,
    });
  }

  async #requestMarketData({ broker, input, options, capabilityId, normalizeInput, request, normalize }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedInput = normalizeInputPreview(input);
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      normalizedInput = normalizeInput(input, options, capabilityId);
      const capabilities = getCapabilities(normalizedBroker);

      if (!capabilities.supports(capabilityId)) {
        return failureResponse({
          broker: normalizedBroker,
          input: normalizedInput,
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
          input: normalizedInput,
          source,
          capabilityId,
          error: BrokerError.config(`Missing client for broker: ${normalizedBroker}`, {
            broker: normalizedBroker,
            details: { broker: normalizedBroker },
          }),
        });
      }

      source = selectMarketDataSource(normalizedBroker, capabilities, capabilityId, options);
      const result = await request(client, normalizedBroker, source.id, normalizedInput, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          input: normalizedInput,
          source,
          result,
          capabilityId,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        input: normalizedInput,
        source,
        result,
        data: normalize(normalizedBroker, normalizedInput, source.id, result.data, options),
        capabilityId,
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        input: normalizedInput,
        source,
        capabilityId,
        error,
      });
    }
  }
}

export function normalizeOverseasStockBasicInfo(broker, identity, sourceId, payload) {
  assertLsBroker(broker, sourceId);
  const block = responseBlock(payload, sourceId);

  return {
    broker: "ls",
    symbol: String(firstValue(block, ["symbol"]) ?? identity.symbol),
    keySymbol: nullableString(firstValue(block, ["keysymbol"]) ?? identity.keySymbol),
    exchangeCode: nullableString(firstValue(block, ["exchcd"]) ?? identity.exchangeCode),
    exchangeId: nullableString(firstValue(block, ["exchange"])),
    name: nullableString(firstValue(block, ["korname"])),
    englishName: nullableString(firstValue(block, ["engname"])),
    exchangeName: nullableString(firstValue(block, ["exchange_name"])),
    nationName: nullableString(firstValue(block, ["nation_name"])),
    industryName: nullableString(firstValue(block, ["induname"])),
    instrumentName: nullableString(firstValue(block, ["instname"])),
    currency: nullableString(firstValue(block, ["currency"]) ?? identity.currencyCode),
    shares: parseNumber(firstValue(block, ["share"])),
    sharesRaw: nullableString(firstValue(block, ["share"])),
    tickSize: parseNumber(firstValue(block, ["untprc"])),
    tickSizeRaw: nullableString(firstValue(block, ["untprc"])),
    bidLotSize: parseNumber(firstValue(block, ["bidlotsize"])),
    bidLotSizeRaw: nullableString(firstValue(block, ["bidlotsize"])),
    askLotSize: parseNumber(firstValue(block, ["asklotsize"])),
    askLotSizeRaw: nullableString(firstValue(block, ["asklotsize"])),
    volume: parseNumber(firstValue(block, ["volume"])),
    volumeRaw: nullableString(firstValue(block, ["volume"])),
    amount: parseNumber(firstValue(block, ["amount"])),
    amountRaw: nullableString(firstValue(block, ["amount"])),
    previousClose: parsePrice(firstValue(block, ["pcls"])),
    referencePrice: parsePrice(firstValue(block, ["clos"])),
    open: parsePrice(firstValue(block, ["open"])),
    high: parsePrice(firstValue(block, ["high"])),
    low: parsePrice(firstValue(block, ["low"])),
    high52Week: parsePrice(firstValue(block, ["high52p"])),
    low52Week: parsePrice(firstValue(block, ["low52p"])),
    marketCap: parseNumber(firstValue(block, ["shareprc"])),
    marketCapRaw: nullableString(firstValue(block, ["shareprc"])),
    per: parseNumber(firstValue(block, ["perv"])),
    eps: parseNumber(firstValue(block, ["epsv"])),
    exchangeRate: parseNumber(firstValue(block, ["exrate"])),
    delayType: nullableString(firstValue(block, ["delaygb"]) ?? identity.delayType),
    floatPoint: nullableString(firstValue(block, ["floatpoint"])),
    tradingStatus: {
      suspend: nullableString(firstValue(block, ["suspend"])),
      sellOnly: nullableString(firstValue(block, ["sellonly"])),
    },
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: BASIC_INFO_CAPABILITY_ID,
    },
    raw: block,
  };
}

export function normalizeOverseasStockMaster(broker, query, sourceId, payload) {
  assertLsBroker(broker, sourceId);
  const summary = responseBlock(payload, sourceId);
  const rows = Array.isArray(payload?.g3190OutBlock1) ? payload.g3190OutBlock1 : [];

  return {
    broker: "ls",
    countryCode: nullableString(firstValue(summary, ["natcode"]) ?? query.countryCode),
    exchangeGroup: nullableString(firstValue(summary, ["exgubun"]) ?? query.exchangeGroup),
    delayType: nullableString(firstValue(summary, ["delaygb"]) ?? query.delayType),
    continuationValue: nullableString(firstValue(summary, ["cts_value"])),
    recordCount: parseNumber(firstValue(summary, ["rec_count"])),
    items: rows.map(normalizeMasterItem),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: MASTER_CAPABILITY_ID,
    },
    raw: {
      summary,
      rows,
    },
  };
}

export function normalizeOverseasStockCandles(broker, identity, sourceId, payload, options = {}) {
  assertLsBroker(broker, sourceId);
  const summary = responseBlock(payload, sourceId);
  const rows = Array.isArray(payload?.[`${sourceId}OutBlock1`]) ? payload[`${sourceId}OutBlock1`] : [];
  const interval = normalizeCandleInterval(firstValue(summary, ["gubun"]) ?? options.period ?? options.interval ?? "daily");

  return {
    broker: "ls",
    symbol: String(firstValue(summary, ["symbol"]) ?? identity.symbol),
    keySymbol: nullableString(firstValue(summary, ["keysymbol"]) ?? identity.keySymbol),
    exchangeCode: nullableString(firstValue(summary, ["exchcd"]) ?? identity.exchangeCode),
    interval,
    candles: rows.map((row) => normalizeCandleRow(row, sourceId, interval)),
    summary: {
      delayType: nullableString(firstValue(summary, ["delaygb"]) ?? identity.delayType),
      periodCode: nullableString(firstValue(summary, ["gubun"])),
      queryDate: nullableString(firstValue(summary, ["date"])),
      continuationDate: nullableString(firstValue(summary, ["cts_date"])),
      continuationInfo: nullableString(firstValue(summary, ["cts_info"])),
      recordCount: parseNumber(firstValue(summary, ["rec_count"])),
      sessionStartTime: nullableString(firstValue(summary, ["s_time"])),
      sessionEndTime: nullableString(firstValue(summary, ["e_time"])),
      previous: {
        open: parsePrice(firstValue(summary, ["preopen"])),
        high: parsePrice(firstValue(summary, ["prehigh"])),
        low: parsePrice(firstValue(summary, ["prelow"])),
        close: parsePrice(firstValue(summary, ["preclose"])),
        volume: parseNumber(firstValue(summary, ["prevolume"])),
      },
    },
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: CANDLES_CAPABILITY_ID,
    },
    raw: {
      summary,
      rows,
    },
  };
}

export function normalizeOverseasStockTimeSeries(broker, identity, sourceId, payload) {
  assertLsBroker(broker, sourceId);
  const summary = responseBlock(payload, sourceId);
  const rows = Array.isArray(payload?.g3102OutBlock1) ? payload.g3102OutBlock1 : [];

  return {
    broker: "ls",
    symbol: String(firstValue(summary, ["symbol"]) ?? identity.symbol),
    keySymbol: nullableString(firstValue(summary, ["keysymbol"]) ?? identity.keySymbol),
    exchangeCode: nullableString(firstValue(summary, ["exchcd"]) ?? identity.exchangeCode),
    delayType: nullableString(firstValue(summary, ["delaygb"]) ?? identity.delayType),
    continuationSequence: nullableString(firstValue(summary, ["cts_seq"])),
    recordCount: parseNumber(firstValue(summary, ["rec_count"])),
    trades: rows.map((row) => ({
      localDate: nullableString(firstValue(row, ["locdate"])),
      localTime: nullableString(firstValue(row, ["loctime"])),
      koreaDate: nullableString(firstValue(row, ["kordate"])),
      koreaTime: nullableString(firstValue(row, ["kortime"])),
      price: parsePrice(firstValue(row, ["price"])),
      priceRaw: nullableString(firstValue(row, ["price"])),
      change: parseNumber(firstValue(row, ["diff"])),
      changeRaw: nullableString(firstValue(row, ["diff"])),
      changeRate: parseNumber(firstValue(row, ["rate"])),
      changeRateRaw: nullableString(firstValue(row, ["rate"])),
      open: parsePrice(firstValue(row, ["open"])),
      high: parsePrice(firstValue(row, ["high"])),
      low: parsePrice(firstValue(row, ["low"])),
      executionVolume: parseNumber(firstValue(row, ["exevol"])),
      executionVolumeRaw: nullableString(firstValue(row, ["exevol"])),
      tradeSideCode: nullableString(firstValue(row, ["cgubun"])),
      sign: nullableString(firstValue(row, ["sign"])),
      floatPoint: nullableString(firstValue(row, ["floatpoint"])),
      raw: row,
    })),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: TIME_SERIES_CAPABILITY_ID,
    },
    raw: {
      summary,
      rows,
    },
  };
}

function selectMarketDataSource(broker, capabilities, capabilityId, options) {
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

async function requestBasicInfo(client, broker, sourceId, identity, options) {
  if (broker === "ls") {
    return requestLsIdentity(client, sourceId, identity, options);
  }

  throwUnsupportedBroker(broker, sourceId, "overseas basic info");
}

async function requestMaster(client, broker, sourceId, query, options) {
  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        delaygb: query.delayType,
        natcode: query.countryCode,
        exgubun: query.exchangeGroup,
        readcnt: query.readCount,
        cts_value: query.continuationValue,
      },
    }, options.requestOptions ?? {});
  }

  throwUnsupportedBroker(broker, sourceId, "overseas master");
}

async function requestCandles(client, broker, sourceId, identity, options) {
  if (broker !== "ls") {
    throwUnsupportedBroker(broker, sourceId, "overseas candles");
  }

  if (sourceId === "g3103") {
    return client.request(sourceId, {
      g3103InBlock: {
        delaygb: identity.delayType,
        keysymbol: identity.keySymbol,
        exchcd: identity.exchangeCode,
        symbol: identity.symbol,
        gubun: normalizePeriodCode(options.period ?? options.interval ?? options.gubun ?? "daily"),
        date: normalizeRequiredString(options.date ?? options.baseDate ?? options.endDate, "date", CANDLES_CAPABILITY_ID),
      },
    }, options.requestOptions ?? {});
  }

  return client.request(sourceId, {
    g3204InBlock: {
      sujung: normalizeAdjustedFlag(options),
      delaygb: identity.delayType,
      keysymbol: identity.keySymbol,
      exchcd: identity.exchangeCode,
      symbol: identity.symbol,
      gubun: normalizePeriodCode(options.period ?? options.interval ?? options.gubun ?? "daily"),
      qrycnt: normalizePositiveInteger(options.count ?? options.queryCount ?? 5, "count", CANDLES_CAPABILITY_ID),
      comp_yn: normalizeCompressionFlag(options),
      sdate: normalizeRequiredString(options.startDate ?? options.sdate, "startDate", CANDLES_CAPABILITY_ID),
      edate: nullableString(options.endDate ?? options.edate) ?? "",
      cts_date: nullableString(options.continuationDate ?? options.ctsDate) ?? "",
      cts_info: nullableString(options.continuationInfo ?? options.ctsInfo) ?? "",
    },
  }, options.requestOptions ?? {});
}

async function requestTimeSeries(client, broker, sourceId, identity, options) {
  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        delaygb: identity.delayType,
        keysymbol: identity.keySymbol,
        exchcd: identity.exchangeCode,
        symbol: identity.symbol,
        readcnt: normalizePositiveInteger(options.count ?? options.readCount ?? 30, "readCount", TIME_SERIES_CAPABILITY_ID),
        cts_seq: options.continuationSequence ?? options.ctsSeq ?? 0,
      },
    }, options.requestOptions ?? {});
  }

  throwUnsupportedBroker(broker, sourceId, "overseas time series");
}

async function requestLsIdentity(client, sourceId, identity, options) {
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

function normalizeMasterQuery(query = {}, options = {}, capabilityId) {
  const value = query && typeof query === "object" ? query : {};
  return {
    delayType: firstNonBlank(value.delayType, options.delayType, "R"),
    countryCode: normalizeRequiredString(
      firstNonBlank(value.countryCode, value.country, value.natcode, options.countryCode, options.country, options.natcode),
      "countryCode",
      capabilityId,
    ),
    exchangeGroup: normalizeRequiredString(
      firstNonBlank(value.exchangeGroup, value.exchangeType, value.exgubun, options.exchangeGroup, options.exchangeType, options.exgubun),
      "exchangeGroup",
      capabilityId,
    ),
    readCount: normalizePositiveInteger(value.readCount ?? value.readcnt ?? options.readCount ?? options.readcnt ?? 10, "readCount", capabilityId),
    continuationValue: nullableString(value.continuationValue ?? value.ctsValue ?? value.cts_value ?? options.continuationValue ?? options.ctsValue ?? options.cts_value) ?? "",
  };
}

function normalizeInputPreview(input) {
  if (typeof input === "string") {
    return { symbol: input.trim() };
  }

  if (!input || typeof input !== "object") {
    return { symbol: "" };
  }

  return {
    symbol: nullableString(input.symbol),
    keySymbol: nullableString(input.keySymbol ?? input.keysymbol),
    exchangeCode: nullableString(input.exchangeCode ?? input.exchange),
    countryCode: nullableString(input.countryCode ?? input.country ?? input.natcode),
  };
}

function normalizeMasterItem(row) {
  return {
    symbol: nullableString(firstValue(row, ["symbol"])),
    keySymbol: nullableString(firstValue(row, ["keysymbol"])),
    countryCode: nullableString(firstValue(row, ["natcode"])),
    exchangeCode: nullableString(firstValue(row, ["exchcd"])),
    securityCode: nullableString(firstValue(row, ["seccode"])),
    name: nullableString(firstValue(row, ["korname"])),
    englishName: nullableString(firstValue(row, ["engname"])),
    currency: nullableString(firstValue(row, ["currency"])),
    isin: nullableString(firstValue(row, ["isin"])),
    floatPoint: nullableString(firstValue(row, ["floatpoint"])),
    industryCode: nullableString(firstValue(row, ["indusury"])),
    shares: parseNumber(firstValue(row, ["share"])),
    marketCap: parseNumber(firstValue(row, ["marketcap"])),
    parValue: parsePrice(firstValue(row, ["par"])),
    parCurrency: nullableString(firstValue(row, ["parcurr"])),
    bidLotSize: parseNumber(firstValue(row, ["bidlotsize2"])),
    askLotSize: parseNumber(firstValue(row, ["asklotsize2"])),
    referencePrice: parsePrice(firstValue(row, ["clos"])),
    previousClose: parsePrice(firstValue(row, ["pcls"])),
    listedDate: nullableString(firstValue(row, ["listed_date"])),
    expireDate: nullableString(firstValue(row, ["expire_date"])),
    businessDate: nullableString(firstValue(row, ["bymd"])),
    tradingStatus: {
      suspend: nullableString(firstValue(row, ["suspend"])),
      sellOnly: nullableString(firstValue(row, ["sellonly"])),
    },
    flags: {
      stamp: nullableString(firstValue(row, ["stamp"])),
      tickType: nullableString(firstValue(row, ["ticktype"])),
      vcm: nullableString(firstValue(row, ["vcmf"])),
      cas: nullableString(firstValue(row, ["casf"])),
      pos: nullableString(firstValue(row, ["posf"])),
      decimalTrading: nullableString(firstValue(row, ["point"])),
    },
    raw: row,
  };
}

function normalizeCandleRow(row, sourceId, interval) {
  return {
    date: nullableString(firstValue(row, sourceId === "g3103" ? ["chedate"] : ["date"])),
    interval,
    open: parsePrice(firstValue(row, ["open"])),
    high: parsePrice(firstValue(row, ["high"])),
    low: parsePrice(firstValue(row, ["low"])),
    close: parsePrice(firstValue(row, sourceId === "g3103" ? ["price"] : ["close"])),
    volume: parseNumber(firstValue(row, ["volume"])),
    amount: parseNumber(firstValue(row, ["amount"])),
    sign: nullableString(firstValue(row, ["sign"])),
    change: parseNumber(firstValue(row, ["diff"])),
    changeRate: parseNumber(firstValue(row, ["rate"])),
    adjustment: {
      code: nullableString(firstValue(row, ["jongchk"])),
      rate: parseNumber(firstValue(row, ["prtt_rate"])),
      priceCheck: nullableString(firstValue(row, ["pricechk"])),
      rateValue: parseNumber(firstValue(row, ["ratevalue"])),
    },
    floatPoint: nullableString(firstValue(row, ["floatpoint"])),
    raw: row,
  };
}

function normalizeCandleInterval(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  const code = CANDLE_PERIOD_CODES[normalized] ?? normalized;
  if (code === "2") {
    return "1d";
  }

  if (code === "3") {
    return "1w";
  }

  if (code === "4") {
    return "1mo";
  }

  if (code === "5") {
    return "1y";
  }

  return normalized || "1d";
}

function normalizePeriodCode(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return CANDLE_PERIOD_CODES[normalized] ?? normalized;
}

function normalizeAdjustedFlag(options = {}) {
  if (options.adjustedFlag !== undefined) {
    return normalizeYn(options.adjustedFlag);
  }

  if (options.sujung !== undefined) {
    return normalizeYn(options.sujung);
  }

  if (options.adjusted !== undefined) {
    return options.adjusted ? "Y" : "N";
  }

  return "Y";
}

function normalizeCompressionFlag(options = {}) {
  if (options.compressionFlag !== undefined) {
    return normalizeYn(options.compressionFlag);
  }

  if (options.comp_yn !== undefined) {
    return normalizeYn(options.comp_yn);
  }

  if (options.compressed !== undefined) {
    return options.compressed ? "Y" : "N";
  }

  return "N";
}

function normalizeYn(value) {
  const normalized = String(value ?? "").trim().toUpperCase();
  return normalized === "Y" ? "Y" : "N";
}

function normalizePositiveInteger(value, field, capabilityId) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw BrokerError.validation(`${field} must be a positive integer`, {
      details: { capabilityId, field, value },
    });
  }

  return parsed;
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

function successResponse({ broker, input, source, result, data, capabilityId }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: source.id,
    symbol: input.symbol ?? null,
    data,
    raw: result.raw,
    headers: result.headers ?? {},
    status: result.status ?? 0,
    continuation: result.continuation,
  };
}

function failureResponse({ broker, input, source, result, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Overseas stock market data service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: source?.id ?? result?.id ?? null,
    symbol: input?.symbol ?? null,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
}

function assertLsBroker(broker, sourceId) {
  if (broker !== "ls") {
    throw BrokerError.unsupported(`Unsupported overseas market data normalization broker: ${broker}`, {
      broker,
      details: { sourceId },
    });
  }
}

function throwUnsupportedBroker(broker, sourceId, label) {
  throw BrokerError.unsupported(`Unsupported ${label} broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
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
