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

const KIS_CANDLE_PERIOD_CODES = Object.freeze({
  day: "D",
  daily: "D",
  "1d": "D",
  week: "W",
  weekly: "W",
  "1w": "W",
  month: "M",
  monthly: "M",
  "1mo": "M",
  year: "Y",
  yearly: "Y",
  "1y": "Y",
});

const US_EXCHANGE_ALIASES = Object.freeze({
  ls: {
    NYSE: "81",
    NASDAQ: "82",
    AMEX: "81",
  },
  db: {
    NYSE: "FY",
    NASDAQ: "FN",
    AMEX: "FA",
  },
  kis: {
    NYSE: "NYS",
    NASDAQ: "NAS",
    AMEX: "AMS",
  },
});

const DEFAULT_DAILY_CANDLE_COUNT = 260;
const DEFAULT_MINUTE_CANDLE_COUNT = 390;

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
      normalizedInput = normalizeInput(input, options, capabilityId, normalizedBroker);
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
  if (broker === "ls") {
    return normalizeLsOverseasStockCandles(identity, sourceId, payload, options);
  }

  if (broker === "db") {
    return normalizeDbOverseasStockCandles(identity, sourceId, payload, options);
  }

  if (broker === "kis") {
    return normalizeKisOverseasStockCandles(identity, sourceId, payload, options);
  }

  throw BrokerError.unsupported(`Unsupported overseas candle normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
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

  const source = capabilityId === CANDLES_CAPABILITY_ID
    ? selectCandleSource(broker, sources, options)
    : sources[0];
  if (!source) {
    throw BrokerError.unsupported(`${broker} does not have a service-ready REST source for ${capabilityId}`, {
      broker,
      details: { capabilityId },
    });
  }

  return source;
}

function selectCandleSource(broker, sources, options = {}) {
  const desiredIds = desiredCandleSourceIds(broker, options).map(normalizeId);
  for (const desiredId of desiredIds) {
    const source = sources.find((api) => normalizeId(api.id) === desiredId);
    if (source) {
      return source;
    }
  }

  return sources[0];
}

function desiredCandleSourceIds(broker, options = {}) {
  if (isTickCandleOptions(options)) {
    return broker === "db" ? ["FSTKCHARTTICK"] : [];
  }

  if (isMinuteCandleOptions(options)) {
    if (broker === "ls") return ["g3203"];
    if (broker === "db") return ["FSTKCHARTMIN"];
    if (broker === "kis") return ["/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice"];
  }

  const interval = normalizeCandleInterval(options.period ?? options.interval ?? options.gubun ?? "daily");
  if (broker === "db") {
    if (interval === "1w") return ["FSTKCHARTWEEK"];
    if (interval === "1mo") return ["FSTKCHARTMONTH"];
    return ["FSTKCHARTDAY"];
  }

  if (broker === "kis") {
    return ["/uapi/overseas-price/v1/quotations/inquire-daily-chartprice"];
  }

  return ["g3204"];
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
  if (broker === "ls") {
    return requestLsCandles(client, sourceId, identity, options);
  }

  if (broker === "db") {
    return requestDbCandles(client, sourceId, identity, options);
  }

  if (broker === "kis") {
    return requestKisCandles(client, sourceId, identity, options);
  }

  throwUnsupportedBroker(broker, sourceId, "overseas candles");
}

async function requestLsCandles(client, sourceId, identity, options) {
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

  if (sourceId === "g3203") {
    return client.request(sourceId, {
      g3203InBlock: {
        delaygb: identity.delayType,
        keysymbol: identity.keySymbol,
        exchcd: identity.exchangeCode,
        symbol: identity.symbol,
        ncnt: normalizeIntervalMinutes(options.intervalMinutes ?? options.ncnt ?? options.interval ?? 1),
        qrycnt: normalizePositiveInteger(options.count ?? options.queryCount ?? DEFAULT_MINUTE_CANDLE_COUNT, "count", CANDLES_CAPABILITY_ID),
        comp_yn: normalizeCompressionFlag(options),
        sdate: normalizeOptionalDate(options.startDate ?? options.sdate),
        edate: normalizeOptionalDate(options.endDate ?? options.edate),
        cts_date: nullableString(options.continuationDate ?? options.ctsDate) ?? "",
        cts_time: nullableString(options.continuationTime ?? options.ctsTime) ?? "",
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
      qrycnt: normalizePositiveInteger(options.count ?? options.queryCount ?? DEFAULT_DAILY_CANDLE_COUNT, "count", CANDLES_CAPABILITY_ID),
      comp_yn: normalizeCompressionFlag(options),
      sdate: normalizeOptionalDate(options.startDate ?? options.sdate),
      edate: normalizeOptionalDate(options.endDate ?? options.edate),
      cts_date: nullableString(options.continuationDate ?? options.ctsDate) ?? "",
      cts_info: nullableString(options.continuationInfo ?? options.ctsInfo) ?? "",
    },
  }, options.requestOptions ?? {});
}

async function requestDbCandles(client, sourceId, identity, options) {
  const isIntraday = sourceId === "FSTKCHARTMIN" || sourceId === "FSTKCHARTTICK";
  const endDate = normalizeDateOrDefault(options.endDate ?? options.baseDate ?? options.date);
  const startDate = normalizeDateOrDefault(options.startDate, {
    fallback: isIntraday ? endDate : defaultStartDateForPeriod(options.period ?? options.interval ?? "daily", endDate),
  });
  const request = {
    In: {
      InputCondMrktDivCode: identity.exchangeCode,
      InputIscd1: identity.symbol,
      InputDate1: startDate,
      InputDate2: endDate,
      InputOrgAdjPrc: options.adjusted === false ? "0" : "1",
    },
  };

  if (isIntraday) {
    request.In.dataCnt = String(normalizePositiveInteger(options.count ?? options.queryCount ?? DEFAULT_MINUTE_CANDLE_COUNT, "count", CANDLES_CAPABILITY_ID));
    request.In.InputHourClsCode = nullableString(options.hourClassCode ?? options.inputHourClassCode) ?? "0";
    if (sourceId === "FSTKCHARTTICK") {
      request.In.InputDivXtick = String(normalizeTickCount(options.tickCount ?? options.divXtick ?? options.interval, {
        fallback: 0,
      }));
    } else {
      const intervalMinutes = normalizeIntervalMinutes(options.intervalMinutes ?? options.interval ?? 1);
      request.In.InputDivXtick = String(intervalMinutes * 60);
    }
    request.In.InputPwDataIncuYn = options.periodSpecified === false || options.includePeriod === false ? "N" : "Y";
  }

  return client.request(sourceId, request, options.requestOptions ?? {});
}

async function requestKisCandles(client, sourceId, identity, options) {
  if (sourceId === "/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice") {
    return client.request(sourceId, {
      AUTH: nullableString(options.auth) ?? "",
      EXCD: identity.exchangeCode,
      SYMB: identity.symbol,
      NMIN: String(normalizeIntervalMinutes(options.intervalMinutes ?? options.nmin ?? options.interval ?? 1)),
      PINC: nullableString(options.pinc ?? options.priceInclude) ?? "1",
      NEXT: nullableString(options.next ?? options.continuationFlag) ?? "",
      NREC: String(normalizePositiveInteger(options.count ?? options.queryCount ?? DEFAULT_MINUTE_CANDLE_COUNT, "count", CANDLES_CAPABILITY_ID)),
      FILL: nullableString(options.fill ?? options.fillMissing) ?? "",
      KEYB: nullableString(options.keyb ?? options.continuationKey) ?? "",
    }, options.requestOptions ?? {});
  }

  const endDate = normalizeDateOrDefault(options.endDate ?? options.baseDate ?? options.date);
  const startDate = normalizeDateOrDefault(options.startDate, {
    fallback: defaultStartDateForPeriod(options.period ?? options.interval ?? "daily", endDate),
  });

  return client.request(sourceId, {
    FID_COND_MRKT_DIV_CODE: identity.exchangeCode,
    FID_INPUT_ISCD: identity.symbol,
    FID_INPUT_DATE_1: startDate,
    FID_INPUT_DATE_2: endDate,
    FID_PERIOD_DIV_CODE: normalizeKisPeriodCode(options.period ?? options.interval ?? "daily"),
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

function normalizeOverseasStockIdentity(identity, options = {}, capabilityId, broker = null) {
  const value = typeof identity === "string" ? { symbol: identity } : identity;
  if (!value || typeof value !== "object") {
    throw BrokerError.validation("Overseas stock identity must be an object or symbol string", {
      details: { capabilityId },
    });
  }

  const symbol = normalizeRequiredString(value.symbol, "symbol", capabilityId);
  const countryCode = nullableString(firstNonBlank(value.countryCode, value.country, options.countryCode, options.country));
  const exchangeCode = normalizeOverseasExchangeCode(
    firstNonBlank(value.exchangeCode, value.exchange, options.exchangeCode, options.exchange),
    broker,
    countryCode,
    capabilityId,
  );
  if (!exchangeCode) {
    throw BrokerError.validation("Overseas stock exchangeCode is required", {
      details: { capabilityId, symbol },
    });
  }

  const delayType = firstNonBlank(value.delayType, options.delayType, "R");
  const keySymbol = firstNonBlank(value.keySymbol, value.keysymbol, options.keySymbol, options.keysymbol)
    ?? (broker === "ls" || !broker ? `${exchangeCode}${symbol}` : null);

  return {
    symbol,
    keySymbol,
    exchangeCode,
    marketCode: nullableString(firstNonBlank(value.marketCode, value.market, options.marketCode, options.market)),
    countryCode,
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

function normalizeLsOverseasStockCandles(identity, sourceId, payload, options = {}) {
  const summary = responseBlock(payload, sourceId);
  const rows = Array.isArray(payload?.[`${sourceId}OutBlock1`]) ? payload[`${sourceId}OutBlock1`] : [];
  const interval = sourceId === "g3203"
    ? `${normalizeIntervalMinutes(options.intervalMinutes ?? firstValue(summary, ["ncnt"]) ?? options.interval ?? 1)}m`
    : normalizeCandleInterval(firstValue(summary, ["gubun"]) ?? options.period ?? options.interval ?? "daily");

  return {
    broker: "ls",
    symbol: String(firstValue(summary, ["symbol"]) ?? identity.symbol),
    keySymbol: nullableString(firstValue(summary, ["keysymbol"]) ?? identity.keySymbol),
    exchangeCode: nullableString(firstValue(summary, ["exchcd"]) ?? identity.exchangeCode),
    marketCode: identity.marketCode ?? null,
    countryCode: identity.countryCode ?? null,
    currencyCode: identity.currencyCode ?? "USD",
    interval,
    candles: rows.map((row) => normalizeLsCandleRow(row, sourceId, interval)),
    summary: {
      delayType: nullableString(firstValue(summary, ["delaygb"]) ?? identity.delayType),
      periodCode: nullableString(firstValue(summary, ["gubun"])),
      queryDate: nullableString(firstValue(summary, ["date"])),
      continuationDate: nullableString(firstValue(summary, ["cts_date"])),
      continuationTime: nullableString(firstValue(summary, ["cts_time"])),
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

function normalizeDbOverseasStockCandles(identity, sourceId, payload, options = {}) {
  const rows = Array.isArray(payload?.Out) ? payload.Out : Array.isArray(payload?.output) ? payload.output : [];
  const interval = dbCandleInterval(sourceId, options);

  return {
    broker: "db",
    symbol: identity.symbol,
    keySymbol: identity.keySymbol ?? null,
    exchangeCode: identity.exchangeCode,
    marketCode: identity.marketCode ?? null,
    countryCode: identity.countryCode ?? null,
    currencyCode: identity.currencyCode ?? "USD",
    interval,
    candles: rows.map((row) => normalizeDbCandleRow(row, interval)),
    summary: {
      recordCount: rows.length,
    },
    source: {
      broker: "db",
      id: sourceId,
      capabilityId: CANDLES_CAPABILITY_ID,
    },
    raw: {
      rows,
    },
  };
}

function normalizeKisOverseasStockCandles(identity, sourceId, payload, options = {}) {
  const summary = firstObject(payload?.output1) ?? firstObject(payload?.output) ?? {};
  const rows = normalizeKisCandleRows(payload, sourceId);
  const interval = sourceId === "/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice"
    ? `${normalizeIntervalMinutes(options.intervalMinutes ?? options.nmin ?? options.interval ?? 1)}m`
    : normalizeCandleInterval(options.period ?? options.interval ?? "daily");

  return {
    broker: "kis",
    symbol: nullableString(firstValue(summary, ["rsym", "symb", "SYMB"])) ?? identity.symbol,
    keySymbol: identity.keySymbol ?? null,
    exchangeCode: nullableString(firstValue(summary, ["excd", "EXCD"])) ?? identity.exchangeCode,
    marketCode: identity.marketCode ?? null,
    countryCode: identity.countryCode ?? null,
    currencyCode: identity.currencyCode ?? "USD",
    interval,
    candles: rows.map((row) => normalizeKisCandleRow(row, interval)),
    summary: {
      recordCount: rows.length,
      previousClose: parsePrice(firstValue(summary, ["base", "prev", "stck_sdpr", "ovrs_nmix_sdpr"])),
    },
    source: {
      broker: "kis",
      id: sourceId,
      capabilityId: CANDLES_CAPABILITY_ID,
    },
    raw: {
      summary,
      rows,
    },
  };
}

function normalizeLsCandleRow(row, sourceId, interval) {
  const date = nullableString(firstValue(row, sourceId === "g3103" ? ["chedate"] : ["date", "locdate"]));
  const time = nullableString(firstValue(row, ["loctime", "time"]));
  const amount = parseNumber(firstValue(row, ["amount"]));

  return {
    date,
    time,
    localDate: date,
    localTime: time,
    timestamp: newYorkTimestamp(date, time),
    interval,
    open: parsePrice(firstValue(row, ["open"])),
    high: parsePrice(firstValue(row, ["high"])),
    low: parsePrice(firstValue(row, ["low"])),
    close: parsePrice(firstValue(row, sourceId === "g3103" ? ["price"] : ["close", "price"])),
    volume: parseNumber(firstValue(row, ["volume", "exevol"])),
    amount,
    value: amount,
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

function normalizeDbCandleRow(row, interval) {
  const date = nullableString(firstValue(row, ["Date", "date"]));
  const time = nullableString(firstValue(row, ["Hour", "time"]));
  const amount = parseNumber(firstValue(row, ["AcmlTrPbmn", "amount", "value"]));

  return {
    date,
    time,
    localDate: date,
    localTime: time,
    timestamp: newYorkTimestamp(date, time),
    interval,
    open: parsePrice(firstValue(row, ["Oprc", "open"])),
    high: parsePrice(firstValue(row, ["Hprc", "high"])),
    low: parsePrice(firstValue(row, ["Lprc", "low"])),
    close: parsePrice(firstValue(row, ["Prpr", "close"])),
    volume: parseNumber(firstValue(row, ["CntgVol", "AcmlVol", "volume"])),
    amount,
    value: amount,
    raw: row,
  };
}

function normalizeKisCandleRow(row, interval) {
  const date = nullableString(firstValue(row, [
    "xymd",
    "stck_bsop_date",
    "date",
    "localDate",
  ]));
  const time = nullableString(firstValue(row, [
    "xhms",
    "stck_cntg_hour",
    "time",
    "localTime",
  ]));
  const amount = parseNumber(firstValue(row, ["tamt", "acml_tr_pbmn", "amount", "value"]));

  return {
    date,
    time,
    localDate: date,
    localTime: time,
    timestamp: newYorkTimestamp(date, time),
    interval,
    open: parsePrice(firstValue(row, ["open", "stck_oprc", "ovrs_nmix_oprc"])),
    high: parsePrice(firstValue(row, ["high", "stck_hgpr", "ovrs_nmix_hgpr"])),
    low: parsePrice(firstValue(row, ["low", "stck_lwpr", "ovrs_nmix_lwpr"])),
    close: parsePrice(firstValue(row, ["clos", "last", "stck_clpr", "stck_prpr", "ovrs_nmix_prpr", "close"])),
    volume: parseNumber(firstValue(row, ["tvol", "evol", "acml_vol", "cntg_vol", "volume"])),
    amount,
    value: amount,
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

function dbCandleInterval(sourceId, options = {}) {
  if (sourceId === "FSTKCHARTMIN") {
    return `${normalizeIntervalMinutes(options.intervalMinutes ?? options.interval ?? 1)}m`;
  }

  if (sourceId === "FSTKCHARTTICK") {
    const tickCount = normalizeTickCount(options.tickCount ?? options.divXtick ?? options.interval, {
      fallback: null,
    });
    return tickCount ? `${tickCount}tick` : "tick";
  }

  if (sourceId === "FSTKCHARTWEEK") {
    return "1w";
  }

  if (sourceId === "FSTKCHARTMONTH") {
    return "1mo";
  }

  return "1d";
}

function normalizePeriodCode(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return CANDLE_PERIOD_CODES[normalized] ?? normalized;
}

function normalizeKisPeriodCode(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return KIS_CANDLE_PERIOD_CODES[normalized] ?? String(value ?? "D").trim().toUpperCase() ?? "D";
}

function normalizeIntervalMinutes(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  const minuteMatch = normalized.match(/^(\d+)m$/);
  const parsed = Number(minuteMatch?.[1] ?? normalized);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw BrokerError.validation("intervalMinutes must be a positive integer", {
      details: { capabilityId: CANDLES_CAPABILITY_ID, field: "intervalMinutes", value },
    });
  }

  return parsed;
}

function normalizeTickCount(value, { fallback } = {}) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();
  if (normalized === "tick") {
    return fallback;
  }

  const tickMatch = normalized.match(/^(\d+)tick$/);
  const parsed = Number(tickMatch?.[1] ?? normalized);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw BrokerError.validation("tickCount must be a non-negative integer", {
      details: { capabilityId: CANDLES_CAPABILITY_ID, field: "tickCount", value },
    });
  }

  return parsed;
}

function isMinuteCandleOptions(options = {}) {
  const interval = String(options.interval ?? options.period ?? "").trim().toLowerCase();
  return options.intervalMinutes !== undefined
    || interval === "minute"
    || interval === "intraday"
    || /^\d+m$/.test(interval);
}

function isTickCandleOptions(options = {}) {
  const interval = String(options.interval ?? options.period ?? "").trim().toLowerCase();
  return options.tickCount !== undefined || interval === "tick" || /^\d+tick$/.test(interval);
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

function normalizeOptionalDate(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return String(value).replaceAll("-", "").trim();
}

function normalizeDateOrDefault(value, options = {}) {
  const normalized = normalizeOptionalDate(value);
  if (normalized) {
    return normalized;
  }

  return options.fallback ?? todayYmd();
}

function defaultStartDateForPeriod(period, endDate) {
  const interval = normalizeCandleInterval(period);
  if (interval === "1w") {
    return shiftYmd(endDate, -DEFAULT_DAILY_CANDLE_COUNT * 7);
  }

  if (interval === "1mo") {
    return shiftYmd(endDate, -DEFAULT_DAILY_CANDLE_COUNT * 30);
  }

  if (interval === "1y") {
    return shiftYmd(endDate, -DEFAULT_DAILY_CANDLE_COUNT * 365);
  }

  return shiftYmd(endDate, -370);
}

function todayYmd() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function shiftYmd(ymd, days) {
  const normalized = normalizeOptionalDate(ymd);
  if (!/^\d{8}$/.test(normalized)) {
    return normalized;
  }

  const date = new Date(Date.UTC(
    Number(normalized.slice(0, 4)),
    Number(normalized.slice(4, 6)) - 1,
    Number(normalized.slice(6, 8)),
  ));
  date.setUTCDate(date.getUTCDate() + days);
  return [
    String(date.getUTCFullYear()),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("");
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

function normalizeOverseasExchangeCode(value, broker, countryCode, capabilityId) {
  const normalized = firstNonBlank(value);
  if (!normalized) {
    return null;
  }

  const alias = String(normalized).trim().toUpperCase();
  const isUs = !countryCode || String(countryCode).trim().toUpperCase() === "US";
  const brokerAliases = US_EXCHANGE_ALIASES[broker] ?? null;
  if (isUs && brokerAliases && Object.hasOwn(brokerAliases, alias)) {
    return brokerAliases[alias];
  }

  if (isUs && ["NYSE", "NASDAQ", "AMEX"].includes(alias) && brokerAliases) {
    throw BrokerError.validation(`Unsupported US exchange alias for ${broker}: ${normalized}`, {
      broker,
      details: {
        capabilityId,
        exchange: normalized,
        supported: Object.keys(brokerAliases),
      },
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

function normalizeKisCandleRows(payload, sourceId) {
  const candidates = sourceId === "/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice"
    ? [payload?.output2, payload?.output, payload?.output1]
    : [payload?.output2, payload?.output, payload?.output1];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
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

function firstObject(value) {
  if (Array.isArray(value)) {
    return value.find((item) => item && typeof item === "object") ?? null;
  }

  return value && typeof value === "object" ? value : null;
}

function newYorkTimestamp(dateValue, timeValue) {
  const date = normalizeOptionalDate(dateValue);
  if (!/^\d{8}$/.test(date)) {
    return null;
  }

  const rawTime = String(timeValue ?? "").replaceAll(":", "").trim();
  const time = rawTime ? rawTime.padEnd(6, "0").slice(0, 6) : "000000";
  if (!/^\d{6}$/.test(time)) {
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  }

  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(4, 6));
  const day = Number(date.slice(6, 8));
  const offset = newYorkUtcOffset(year, month, day, Number(time.slice(0, 2)));

  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}${offset}`;
}

function newYorkUtcOffset(year, month, day, hour) {
  const dstStartDay = nthWeekdayOfMonth(year, 3, 0, 2);
  const dstEndDay = nthWeekdayOfMonth(year, 11, 0, 1);

  if (month > 3 && month < 11) {
    return "-04:00";
  }

  if (month < 3 || month > 11) {
    return "-05:00";
  }

  if (month === 3) {
    return day > dstStartDay || (day === dstStartDay && hour >= 2) ? "-04:00" : "-05:00";
  }

  return day < dstEndDay || (day === dstEndDay && hour < 2) ? "-04:00" : "-05:00";
}

function nthWeekdayOfMonth(year, month, weekday, nth) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const firstWeekday = first.getUTCDay();
  const offset = (weekday - firstWeekday + 7) % 7;
  return 1 + offset + (nth - 1) * 7;
}

function parsePrice(value) {
  const parsed = parseNumber(value);
  return parsed === null ? null : parsed;
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
