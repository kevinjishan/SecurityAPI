import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const BASIC_INFO_CAPABILITY_ID = "marketData.domesticStock.basicInfo";
const DAILY_CANDLES_CAPABILITY_ID = "marketData.domesticStock.dailyCandles";
const MINUTE_CANDLES_CAPABILITY_ID = "marketData.domesticStock.minuteCandles";

export class MarketDataService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getDomesticStockBasicInfo(broker, symbol, options = {}) {
    return this.requestMarketData({
      broker,
      symbol,
      options,
      capabilityId: BASIC_INFO_CAPABILITY_ID,
      request: requestBasicInfo,
      normalize: normalizeDomesticStockBasicInfo,
    });
  }

  async getDomesticStockDailyCandles(broker, symbol, options = {}) {
    return this.requestMarketData({
      broker,
      symbol,
      options,
      capabilityId: DAILY_CANDLES_CAPABILITY_ID,
      request: requestDailyCandles,
      normalize: normalizeDomesticStockDailyCandles,
    });
  }

  async getDomesticStockMinuteCandles(broker, symbol, options = {}) {
    return this.requestMarketData({
      broker,
      symbol,
      options,
      capabilityId: MINUTE_CANDLES_CAPABILITY_ID,
      request: requestMinuteCandles,
      normalize: normalizeDomesticStockMinuteCandles,
    });
  }

  async requestMarketData({ broker, symbol, options, capabilityId, request, normalize }) {
    let normalizedSymbol = String(symbol ?? "").trim();
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;

    try {
      normalizedSymbol = normalizeSymbol(symbol, capabilityId);
      normalizedBroker = assertBroker(normalizedBroker);
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(capabilityId)) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          capabilityId,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${capabilityId}`, {
            broker: normalizedBroker,
            details: { capabilityId },
          }),
        });
      }

      source = selectMarketDataSource(normalizedBroker, capabilities, capabilityId, options);
      const result = await request(client, normalizedBroker, source.id, normalizedSymbol, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          symbol: normalizedSymbol,
          source,
          result,
          capabilityId,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        symbol: normalizedSymbol,
        source,
        result,
        data: normalize(normalizedBroker, normalizedSymbol, source.id, result.data, options),
        capabilityId,
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        symbol: normalizedSymbol,
        source,
        capabilityId,
        error,
      });
    }
  }
}

export function normalizeDomesticStockBasicInfo(broker, symbol, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomBasicInfo(symbol, sourceId, payload);
  }

  if (broker === "ls") {
    return normalizeLsBasicInfo(symbol, sourceId, payload);
  }

  throw BrokerError.unsupported(`Unsupported market data normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticStockDailyCandles(broker, symbol, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomCandles(symbol, sourceId, "1d", payload?.stk_dt_pole_chart_qry);
  }

  if (broker === "ls") {
    return normalizeLsCandles(symbol, sourceId, "1d", payload?.t8410OutBlock1, payload?.t8410OutBlock);
  }

  throw BrokerError.unsupported(`Unsupported daily candle normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticStockMinuteCandles(broker, symbol, sourceId, payload, options = {}) {
  const interval = `${normalizeIntervalMinutes(options.intervalMinutes)}m`;

  if (broker === "kiwoom") {
    return normalizeKiwoomCandles(symbol, sourceId, interval, payload?.stk_min_pole_chart_qry);
  }

  if (broker === "ls") {
    return normalizeLsCandles(symbol, sourceId, interval, payload?.t8412OutBlock1, payload?.t8412OutBlock);
  }

  throw BrokerError.unsupported(`Unsupported minute candle normalization broker: ${broker}`, {
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

function selectMarketDataSource(broker, capabilities, capabilityId, options) {
  const preferredId = options.apiId ?? options.trCode;
  const sources = capabilities.findApis(capabilityId).filter((api) => api.transport === "rest");

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
    throw BrokerError.unsupported(`${broker} does not have a REST source for ${capabilityId}`, {
      broker,
      details: { capabilityId },
    });
  }

  return source;
}

async function requestBasicInfo(client, broker, sourceId, symbol, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, { stk_cd: symbol }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        shcode: symbol,
        exchgubun: options.exchangeCode ?? options.exchange ?? "K",
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported basic info request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestDailyCandles(client, broker, sourceId, symbol, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      stk_cd: symbol,
      base_dt: normalizeDate(options.baseDate ?? options.endDate),
      upd_stkpc_tp: options.adjusted === false ? "0" : "1",
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        shcode: symbol,
        gubun: options.periodCode ?? "2",
        qrycnt: options.count ?? 200,
        sdate: normalizeOptionalDate(options.startDate),
        edate: normalizeOptionalDate(options.endDate ?? options.baseDate),
        cts_date: options.ctsDate ?? "",
        comp_yn: "N",
        sujung: options.adjusted === false ? "N" : "Y",
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported daily candle request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestMinuteCandles(client, broker, sourceId, symbol, options) {
  const requestOptions = options.requestOptions ?? {};
  const intervalMinutes = normalizeIntervalMinutes(options.intervalMinutes);

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      stk_cd: symbol,
      tic_scope: String(intervalMinutes),
      upd_stkpc_tp: options.adjusted === false ? "0" : "1",
      base_dt: normalizeOptionalDate(options.baseDate),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        shcode: symbol,
        ncnt: intervalMinutes,
        qrycnt: options.count ?? 500,
        nday: options.businessDays ? "1" : "0",
        sdate: normalizeOptionalDate(options.startDate),
        stime: options.startTime ?? "",
        edate: normalizeOptionalDate(options.endDate) || "99999999",
        etime: options.endTime ?? "",
        cts_date: options.ctsDate ?? "",
        cts_time: options.ctsTime ?? "",
        comp_yn: "N",
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported minute candle request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

function normalizeKiwoomBasicInfo(symbol, sourceId, payload) {
  return {
    broker: "kiwoom",
    symbol: normalizeSymbolCode(firstValue(payload, ["stk_cd"]) ?? symbol),
    name: nullableString(firstValue(payload, ["stk_nm"])),
    price: parsePrice(firstValue(payload, ["cur_prc"])),
    priceRaw: nullableString(firstValue(payload, ["cur_prc"])),
    open: parsePrice(firstValue(payload, ["open_pric", "open"])),
    high: parsePrice(firstValue(payload, ["high_pric", "high"])),
    low: parsePrice(firstValue(payload, ["low_pric", "low"])),
    volume: parseNumber(firstValue(payload, ["trde_qty", "volume"])),
    volumeRaw: nullableString(firstValue(payload, ["trde_qty", "volume"])),
    referencePrice: parsePrice(firstValue(payload, ["base_pric"])),
    highLimit: parsePrice(firstValue(payload, ["upl_pric"])),
    lowLimit: parsePrice(firstValue(payload, ["lst_pric"])),
    marketCap: parseNumber(firstValue(payload, ["mac", "market_cap"])),
    marketCapRaw: nullableString(firstValue(payload, ["mac", "market_cap"])),
    listedShares: parseNumber(firstValue(payload, ["flo_stk", "listed_shares"])),
    listedSharesRaw: nullableString(firstValue(payload, ["flo_stk", "listed_shares"])),
    currency: "KRW",
    source: {
      broker: "kiwoom",
      id: sourceId,
      capabilityId: BASIC_INFO_CAPABILITY_ID,
    },
  };
}

function normalizeLsBasicInfo(symbol, sourceId, payload) {
  const block = payload?.[`${sourceId}OutBlock`] ?? payload?.t1102OutBlock ?? payload;

  return {
    broker: "ls",
    symbol: normalizeSymbolCode(firstValue(block, ["shcode"]) ?? symbol),
    name: nullableString(firstValue(block, ["hname"])),
    price: parsePrice(firstValue(block, ["price"])),
    priceRaw: nullableString(firstValue(block, ["price"])),
    open: parsePrice(firstValue(block, ["open"])),
    high: parsePrice(firstValue(block, ["high"])),
    low: parsePrice(firstValue(block, ["low"])),
    volume: parseNumber(firstValue(block, ["volume"])),
    volumeRaw: nullableString(firstValue(block, ["volume"])),
    referencePrice: parsePrice(firstValue(block, ["recprice"])),
    highLimit: parsePrice(firstValue(block, ["uplmtprice"])),
    lowLimit: parsePrice(firstValue(block, ["dnlmtprice"])),
    marketCap: parseNumber(firstValue(block, ["total", "marketcap"])),
    marketCapRaw: nullableString(firstValue(block, ["total", "marketcap"])),
    listedShares: parseNumber(firstValue(block, ["listing", "listcount"])),
    listedSharesRaw: nullableString(firstValue(block, ["listing", "listcount"])),
    currency: "KRW",
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: BASIC_INFO_CAPABILITY_ID,
    },
  };
}

function normalizeKiwoomCandles(symbol, sourceId, interval, rows) {
  return {
    broker: "kiwoom",
    symbol,
    interval,
    candles: (Array.isArray(rows) ? rows : []).map((row) => {
      const timestamp = nullableString(firstValue(row, ["cntr_tm", "dt"]));

      return {
        date: candleDate(timestamp),
        time: candleTime(timestamp),
        timestamp,
        open: parsePrice(firstValue(row, ["open_pric"])),
        high: parsePrice(firstValue(row, ["high_pric"])),
        low: parsePrice(firstValue(row, ["low_pric"])),
        close: parsePrice(firstValue(row, ["cur_prc"])),
        volume: parseNumber(firstValue(row, ["trde_qty"])),
        volumeRaw: nullableString(firstValue(row, ["trde_qty"])),
        value: parseNumber(firstValue(row, ["trde_prica"])),
        valueRaw: nullableString(firstValue(row, ["trde_prica"])),
        change: parseNumber(firstValue(row, ["pred_pre"])),
        changeRaw: nullableString(firstValue(row, ["pred_pre"])),
        raw: row,
      };
    }),
    source: {
      broker: "kiwoom",
      id: sourceId,
      capabilityId: interval === "1d" ? DAILY_CANDLES_CAPABILITY_ID : MINUTE_CANDLES_CAPABILITY_ID,
    },
  };
}

function normalizeLsCandles(symbol, sourceId, interval, rows, summary = {}) {
  return {
    broker: "ls",
    symbol: normalizeSymbolCode(firstValue(summary, ["shcode"]) ?? symbol),
    interval,
    candles: (Array.isArray(rows) ? rows : []).map((row) => {
      const date = nullableString(firstValue(row, ["date"]));
      const time = nullableString(firstValue(row, ["time"]));

      return {
        date,
        time,
        timestamp: date && time ? `${date}${time}` : date,
        open: parsePrice(firstValue(row, ["open"])),
        high: parsePrice(firstValue(row, ["high"])),
        low: parsePrice(firstValue(row, ["low"])),
        close: parsePrice(firstValue(row, ["close"])),
        volume: parseNumber(firstValue(row, ["jdiff_vol"])),
        volumeRaw: nullableString(firstValue(row, ["jdiff_vol"])),
        value: parseNumber(firstValue(row, ["value"])),
        valueRaw: nullableString(firstValue(row, ["value"])),
        change: null,
        changeRaw: null,
        raw: row,
      };
    }),
    summary: {
      previousClose: parsePrice(firstValue(summary, ["jiclose"])),
      highLimit: parsePrice(firstValue(summary, ["highend"])),
      lowLimit: parsePrice(firstValue(summary, ["lowend"])),
      nextDate: nullableString(firstValue(summary, ["cts_date"])),
      nextTime: nullableString(firstValue(summary, ["cts_time"])),
      recordCount: parseNumber(firstValue(summary, ["rec_count"])),
    },
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: interval === "1d" ? DAILY_CANDLES_CAPABILITY_ID : MINUTE_CANDLES_CAPABILITY_ID,
    },
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
    : BrokerError.unknown(error?.message ?? "Market data service failed", {
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

function normalizeSymbol(symbol, capabilityId) {
  const normalized = String(symbol ?? "").trim();

  if (!normalized) {
    throw BrokerError.validation("Domestic stock symbol is required", {
      details: { capabilityId },
    });
  }

  return normalized;
}

function normalizeSymbolCode(value) {
  const normalized = nullableString(value);
  if (!normalized) {
    return null;
  }

  return normalized.startsWith("A") && normalized.length === 7 ? normalized.slice(1) : normalized;
}

function normalizeIntervalMinutes(value) {
  const parsed = Number(value ?? 1);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw BrokerError.validation("intervalMinutes must be a positive number", {
      details: { field: "intervalMinutes" },
    });
  }

  return Math.trunc(parsed);
}

function normalizeDate(value) {
  const normalized = normalizeOptionalDate(value);
  if (normalized) {
    return normalized;
  }

  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function normalizeOptionalDate(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return String(value).replaceAll("-", "").trim();
}

function candleDate(timestamp) {
  if (!timestamp) {
    return null;
  }

  return timestamp.slice(0, 8);
}

function candleTime(timestamp) {
  if (!timestamp || timestamp.length <= 8) {
    return null;
  }

  return timestamp.slice(8);
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
