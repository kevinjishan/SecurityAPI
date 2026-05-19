import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const INDEX_CURRENT_CAPABILITY_ID = "marketContext.domesticIndex.current";
const INDEX_DAILY_CANDLES_CAPABILITY_ID = "marketContext.domesticIndex.dailyCandles";
const INDEX_EXPECTED_CAPABILITY_ID = "marketContext.domesticIndex.expected";
const MARKET_SNAPSHOT_CAPABILITY_ID = "marketContext.domesticMarket.snapshot";

const DOMESTIC_INDEXES = Object.freeze({
  kospi: {
    label: "KOSPI",
    kiwoom: { code: "001", marketType: "0" },
    ls: { code: "001" },
  },
  kosdaq: {
    label: "KOSDAQ",
    kiwoom: { code: "101", marketType: "1" },
    ls: { code: "301" },
  },
  kospi200: {
    label: "KOSPI200",
    kiwoom: { code: "201", marketType: "2" },
    ls: { code: "101" },
  },
  krx100: {
    label: "KRX100",
    kiwoom: { code: "701", marketType: "0" },
    ls: { code: "501" },
  },
});

export class MarketContextService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getDomesticIndexCurrent(broker, index, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedIndex = String(index ?? "").trim();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const indexRef = resolveDomesticIndex(normalizedBroker, normalizedIndex);
      normalizedIndex = indexRef.key;
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(INDEX_CURRENT_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          index: normalizedIndex,
          source,
          capabilityId: INDEX_CURRENT_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${INDEX_CURRENT_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: INDEX_CURRENT_CAPABILITY_ID },
          }),
        });
      }

      source = selectMarketContextSource(normalizedBroker, capabilities, INDEX_CURRENT_CAPABILITY_ID, options);
      const result = await requestDomesticIndexCurrent(client, normalizedBroker, source.id, indexRef, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          index: normalizedIndex,
          source,
          result,
          capabilityId: INDEX_CURRENT_CAPABILITY_ID,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        index: normalizedIndex,
        source,
        result,
        capabilityId: INDEX_CURRENT_CAPABILITY_ID,
        data: normalizeDomesticIndexCurrent(normalizedBroker, normalizedIndex, source.id, result.data),
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        index: normalizedIndex,
        source,
        capabilityId: INDEX_CURRENT_CAPABILITY_ID,
        error,
      });
    }
  }

  async getDomesticIndexDailyCandles(broker, index, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedIndex = String(index ?? "").trim();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const indexRef = resolveDomesticIndex(normalizedBroker, normalizedIndex);
      normalizedIndex = indexRef.key;
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(INDEX_DAILY_CANDLES_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          index: normalizedIndex,
          source,
          capabilityId: INDEX_DAILY_CANDLES_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${INDEX_DAILY_CANDLES_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: INDEX_DAILY_CANDLES_CAPABILITY_ID },
          }),
        });
      }

      source = selectMarketContextSource(normalizedBroker, capabilities, INDEX_DAILY_CANDLES_CAPABILITY_ID, options);
      const result = await requestDomesticIndexDailyCandles(client, normalizedBroker, source.id, indexRef, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          index: normalizedIndex,
          source,
          result,
          capabilityId: INDEX_DAILY_CANDLES_CAPABILITY_ID,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        index: normalizedIndex,
        source,
        result,
        capabilityId: INDEX_DAILY_CANDLES_CAPABILITY_ID,
        data: normalizeDomesticIndexDailyCandles(normalizedBroker, normalizedIndex, source.id, result.data),
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        index: normalizedIndex,
        source,
        capabilityId: INDEX_DAILY_CANDLES_CAPABILITY_ID,
        error,
      });
    }
  }

  async getDomesticExpectedIndex(broker, index, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedIndex = String(index ?? "").trim();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const indexRef = resolveDomesticIndex(normalizedBroker, normalizedIndex);
      normalizedIndex = indexRef.key;
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(INDEX_EXPECTED_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          index: normalizedIndex,
          source,
          capabilityId: INDEX_EXPECTED_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${INDEX_EXPECTED_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: INDEX_EXPECTED_CAPABILITY_ID },
          }),
        });
      }

      source = selectMarketContextSource(normalizedBroker, capabilities, INDEX_EXPECTED_CAPABILITY_ID, options);
      const result = await requestDomesticExpectedIndex(client, normalizedBroker, source.id, indexRef, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          index: normalizedIndex,
          source,
          result,
          capabilityId: INDEX_EXPECTED_CAPABILITY_ID,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        index: normalizedIndex,
        source,
        result,
        capabilityId: INDEX_EXPECTED_CAPABILITY_ID,
        data: normalizeDomesticExpectedIndex(normalizedBroker, normalizedIndex, source.id, result.data, options),
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        index: normalizedIndex,
        source,
        capabilityId: INDEX_EXPECTED_CAPABILITY_ID,
        error,
      });
    }
  }

  async getDomesticMarketSnapshot(broker, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const indexes = normalizeSnapshotIndexes(options.indexes);
      const results = await Promise.all(
        indexes.map((index) => this.getDomesticIndexCurrent(normalizedBroker, index, options)),
      );
      const failed = results.find((result) => !result.ok);

      if (failed && options.failFast !== false) {
        return failureResponse({
          broker: normalizedBroker,
          index: indexes.join(","),
          capabilityId: MARKET_SNAPSHOT_CAPABILITY_ID,
          error: failed.error,
        });
      }

      const data = normalizeDomesticMarketSnapshot(normalizedBroker, results, {
        generatedAt: options.generatedAt,
      });

      return {
        ok: true,
        broker: normalizedBroker,
        capability: MARKET_SNAPSHOT_CAPABILITY_ID,
        id: null,
        data,
        raw: Object.fromEntries(results.map((result) => [result.index, result.raw])),
        headers: {},
        status: 0,
      };
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        index: null,
        capabilityId: MARKET_SNAPSHOT_CAPABILITY_ID,
        error,
      });
    }
  }
}

export function normalizeDomesticIndexCurrent(broker, index, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomIndexCurrent(index, sourceId, payload);
  }

  if (broker === "ls") {
    return normalizeLsIndexCurrent(index, sourceId, payload);
  }

  throw BrokerError.unsupported(`Unsupported market context normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticIndexDailyCandles(broker, index, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomIndexDailyCandles(index, sourceId, payload);
  }

  if (broker === "ls") {
    return normalizeLsIndexDailyCandles(index, sourceId, payload);
  }

  throw BrokerError.unsupported(`Unsupported market context candle normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticExpectedIndex(broker, index, sourceId, payload, options = {}) {
  if (broker === "ls") {
    return normalizeLsExpectedIndex(index, sourceId, payload, options);
  }

  throw BrokerError.unsupported(`Unsupported expected index normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticMarketSnapshot(broker, indexResults, options = {}) {
  const indexes = indexResults
    .filter((result) => result?.ok)
    .map((result) => result.data);
  const breadth = combineBreadth(indexes.map((index) => index.breadth));

  return {
    broker,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    indexes,
    breadth,
    direction: marketDirection(indexes),
    source: {
      broker,
      capabilityId: MARKET_SNAPSHOT_CAPABILITY_ID,
      indexes: indexes.map((index) => ({
        index: index.index,
        code: index.code,
        id: index.source.id,
      })),
    },
  };
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

function selectMarketContextSource(broker, capabilities, capabilityId, options) {
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

async function requestDomesticIndexCurrent(client, broker, sourceId, indexRef, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      inds_cd: indexRef.code,
      mrkt_tp: options.marketType ?? indexRef.marketType,
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        upcode: indexRef.code,
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported domestic index current request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestDomesticIndexDailyCandles(client, broker, sourceId, indexRef, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      inds_cd: indexRef.code,
      base_dt: normalizeDate(options.baseDate ?? options.endDate),
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        upcode: indexRef.code,
        gubun1: " ",
        gubun2: "1",
        cts_date: options.ctsDate ?? " ",
        cnt: options.count ?? 200,
        rate_gbn: options.rateCode ?? "1",
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported domestic index daily candle request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestDomesticExpectedIndex(client, broker, sourceId, indexRef, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        upcode: indexRef.code,
        gubun: normalizeExpectedIndexSession(options.session ?? options.gubun),
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported expected index request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

function normalizeKiwoomIndexCurrent(index, sourceId, payload) {
  const indexRef = resolveDomesticIndex("kiwoom", index);

  return indexCurrent({
    broker: "kiwoom",
    index,
    code: firstValue(payload, ["inds_cd", "stk_cd"]) ?? indexRef.code,
    name: firstValue(payload, ["inds_nm", "stk_nm"]) ?? indexRef.label,
    sourceId,
    priceRaw: firstValue(payload, ["cur_prc"]),
    changeRaw: firstValue(payload, ["pred_pre"]),
    changeRateRaw: firstValue(payload, ["flu_rt"]),
    sign: firstValue(payload, ["pred_pre_sig", "pre_sig"]),
    openRaw: firstValue(payload, ["open_pric"]),
    highRaw: firstValue(payload, ["high_pric"]),
    lowRaw: firstValue(payload, ["low_pric"]),
    volumeRaw: firstValue(payload, ["trde_qty"]),
    valueRaw: firstValue(payload, ["trde_prica"]),
    listedCountRaw: firstValue(payload, ["flo_stk_num"]),
    risingRaw: firstValue(payload, ["rising"]),
    steadyRaw: firstValue(payload, ["stdns"]),
    fallingRaw: firstValue(payload, ["fall"]),
    upperLimitRaw: firstValue(payload, ["upl"]),
    lowerLimitRaw: firstValue(payload, ["lst"]),
    tradedCountRaw: firstValue(payload, ["trde_frmatn_stk_num"]),
    tradedRateRaw: firstValue(payload, ["trde_frmatn_rt"]),
    raw: payload,
  });
}

function normalizeLsIndexCurrent(index, sourceId, payload) {
  const block = payload?.[`${sourceId}OutBlock`] ?? payload?.t1511OutBlock ?? payload;
  const indexRef = resolveDomesticIndex("ls", index);

  return {
    ...indexCurrent({
      broker: "ls",
      index,
      code: firstValue(block, ["upcode"]) ?? indexRef.code,
      name: firstValue(block, ["hname"]) ?? indexRef.label,
      sourceId,
      priceRaw: firstValue(block, ["pricejisu"]),
      changeRaw: firstValue(block, ["change"]),
      changeRateRaw: firstValue(block, ["diffjisu"]),
      sign: firstValue(block, ["sign"]),
      openRaw: firstValue(block, ["openjisu"]),
      highRaw: firstValue(block, ["highjisu"]),
      lowRaw: firstValue(block, ["lowjisu"]),
      volumeRaw: firstValue(block, ["volume"]),
      valueRaw: firstValue(block, ["value"]),
      listedCountRaw: null,
      risingRaw: firstValue(block, ["highjo"]),
      steadyRaw: firstValue(block, ["unchgjo"]),
      fallingRaw: firstValue(block, ["lowjo"]),
      upperLimitRaw: firstValue(block, ["upjo"]),
      lowerLimitRaw: firstValue(block, ["downjo"]),
      tradedCountRaw: null,
      tradedRateRaw: null,
      raw: block,
    }),
    previousClose: parseIndexPrice(firstValue(block, ["jniljisu"])),
    relatedIndexes: normalizeLsRelatedIndexes(block),
  };
}

function normalizeKiwoomIndexDailyCandles(index, sourceId, payload) {
  const indexRef = resolveDomesticIndex("kiwoom", index);
  const rows = payload?.inds_dt_pole_qry;

  return indexDailyCandles({
    broker: "kiwoom",
    index,
    code: firstValue(payload, ["inds_cd"]) ?? indexRef.code,
    name: indexRef.label,
    sourceId,
    rows,
    normalizeRow: normalizeKiwoomIndexDailyCandle,
    summary: {},
  });
}

function normalizeLsIndexDailyCandles(index, sourceId, payload) {
  const indexRef = resolveDomesticIndex("ls", index);
  const summary = payload?.[`${sourceId}OutBlock`] ?? payload?.t1514OutBlock ?? {};
  const rows = payload?.[`${sourceId}OutBlock1`] ?? payload?.t1514OutBlock1;

  return indexDailyCandles({
    broker: "ls",
    index,
    code: indexRef.code,
    name: indexRef.label,
    sourceId,
    rows,
    normalizeRow: normalizeLsIndexDailyCandle,
    summary,
  });
}

function normalizeLsExpectedIndex(index, sourceId, payload, options) {
  const indexRef = resolveDomesticIndex("ls", index);
  const summary = payload?.[`${sourceId}OutBlock`] ?? payload?.t1485OutBlock ?? {};
  const rows = payload?.[`${sourceId}OutBlock1`] ?? payload?.t1485OutBlock1;
  const breadth = {
    listedCount: null,
    rising: parseNumber(firstValue(summary, ["yhighjo"])),
    steady: parseNumber(firstValue(summary, ["yunchgjo"])),
    falling: parseNumber(firstValue(summary, ["ylowjo"])),
    upperLimit: parseNumber(firstValue(summary, ["yupjo"])),
    lowerLimit: parseNumber(firstValue(summary, ["ydownjo"])),
    tradedCount: parseNumber(firstValue(summary, ["ytrajo"])),
    tradedRate: null,
  };
  breadth.risingRate = calculateRisingRate(breadth);
  const timeline = (Array.isArray(rows) ? rows : []).map(normalizeLsExpectedIndexRow);
  const latest = timeline[0] ?? null;

  return {
    broker: "ls",
    index,
    code: indexRef.code,
    name: indexRef.label,
    session: normalizeExpectedIndexSession(options.session ?? options.gubun),
    price: parseIndexPrice(firstValue(summary, ["pricejisu"])),
    priceRaw: nullableString(firstValue(summary, ["pricejisu"])),
    change: parseNumber(firstValue(summary, ["change"])),
    changeRaw: nullableString(firstValue(summary, ["change"])),
    sign: nullableString(firstValue(summary, ["sign"])),
    volume: parseNumber(firstValue(summary, ["volume"])),
    volumeRaw: nullableString(firstValue(summary, ["volume"])),
    breadth,
    timeline,
    summary: {
      latestTime: latest?.time ?? null,
      latestExpectedIndex: latest?.expectedIndex ?? null,
      latestChangeRate: latest?.changeRate ?? null,
      recordCount: timeline.length,
    },
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: INDEX_EXPECTED_CAPABILITY_ID,
    },
    raw: payload,
  };
}

function indexCurrent({
  broker,
  index,
  code,
  name,
  sourceId,
  priceRaw,
  changeRaw,
  changeRateRaw,
  sign,
  openRaw,
  highRaw,
  lowRaw,
  volumeRaw,
  valueRaw,
  listedCountRaw,
  risingRaw,
  steadyRaw,
  fallingRaw,
  upperLimitRaw,
  lowerLimitRaw,
  tradedCountRaw,
  tradedRateRaw,
  raw,
}) {
  const breadth = {
    listedCount: parseNumber(listedCountRaw),
    rising: parseNumber(risingRaw),
    steady: parseNumber(steadyRaw),
    falling: parseNumber(fallingRaw),
    upperLimit: parseNumber(upperLimitRaw),
    lowerLimit: parseNumber(lowerLimitRaw),
    tradedCount: parseNumber(tradedCountRaw),
    tradedRate: parseNumber(tradedRateRaw),
  };
  breadth.risingRate = calculateRisingRate(breadth);

  return {
    broker,
    index,
    code: nullableString(code),
    name: normalizeName(name),
    price: parseIndexPrice(priceRaw),
    priceRaw: nullableString(priceRaw),
    change: parseNumber(changeRaw),
    changeRaw: nullableString(changeRaw),
    changeRate: parseNumber(changeRateRaw),
    changeRateRaw: nullableString(changeRateRaw),
    sign: nullableString(sign),
    open: parseIndexPrice(openRaw),
    high: parseIndexPrice(highRaw),
    low: parseIndexPrice(lowRaw),
    volume: parseNumber(volumeRaw),
    volumeRaw: nullableString(volumeRaw),
    value: parseNumber(valueRaw),
    valueRaw: nullableString(valueRaw),
    breadth,
    source: {
      broker,
      id: sourceId,
      capabilityId: INDEX_CURRENT_CAPABILITY_ID,
    },
    raw,
  };
}

function indexDailyCandles({ broker, index, code, name, sourceId, rows, normalizeRow, summary }) {
  const candles = (Array.isArray(rows) ? rows : []).map(normalizeRow);

  return {
    broker,
    index,
    code: nullableString(code),
    name: normalizeName(name),
    interval: "1d",
    candles,
    summary: {
      nextDate: nullableString(firstValue(summary, ["cts_date"])),
      recordCount: candles.length,
    },
    source: {
      broker,
      id: sourceId,
      capabilityId: INDEX_DAILY_CANDLES_CAPABILITY_ID,
    },
  };
}

function normalizeKiwoomIndexDailyCandle(row) {
  const date = nullableString(firstValue(row, ["dt"]));

  return {
    date,
    time: null,
    timestamp: date,
    open: parseKiwoomIndexCandlePrice(firstValue(row, ["open_pric"])),
    high: parseKiwoomIndexCandlePrice(firstValue(row, ["high_pric"])),
    low: parseKiwoomIndexCandlePrice(firstValue(row, ["low_pric"])),
    close: parseKiwoomIndexCandlePrice(firstValue(row, ["cur_prc"])),
    change: parseNumber(firstValue(row, ["pred_pre"])),
    changeRaw: nullableString(firstValue(row, ["pred_pre"])),
    changeRate: parseNumber(firstValue(row, ["flu_rt"])),
    changeRateRaw: nullableString(firstValue(row, ["flu_rt"])),
    sign: nullableString(firstValue(row, ["pred_pre_sig", "pre_sig"])),
    volume: parseNumber(firstValue(row, ["trde_qty"])),
    volumeRaw: nullableString(firstValue(row, ["trde_qty"])),
    value: parseNumber(firstValue(row, ["trde_prica"])),
    valueRaw: nullableString(firstValue(row, ["trde_prica"])),
    breadth: null,
    investorFlow: null,
    raw: row,
  };
}

function normalizeLsIndexDailyCandle(row) {
  const date = nullableString(firstValue(row, ["date"]));
  const breadth = {
    listedCount: parseNumber(firstValue(row, ["totjo"])),
    rising: parseNumber(firstValue(row, ["high"])),
    steady: parseNumber(firstValue(row, ["unchg"])),
    falling: parseNumber(firstValue(row, ["low"])),
    upperLimit: parseNumber(firstValue(row, ["up"])),
    lowerLimit: parseNumber(firstValue(row, ["down"])),
    tradedCount: null,
    tradedRate: parseNumber(firstValue(row, ["rate"])),
  };
  breadth.risingRate = firstFinite([
    parseNumber(firstValue(row, ["uprate"])),
    calculateRisingRate(breadth),
  ]);

  return {
    date,
    time: null,
    timestamp: date,
    open: parseIndexPrice(firstValue(row, ["openjisu"])),
    high: parseIndexPrice(firstValue(row, ["highjisu"])),
    low: parseIndexPrice(firstValue(row, ["lowjisu"])),
    close: parseIndexPrice(firstValue(row, ["jisu"])),
    change: parseNumber(firstValue(row, ["change"])),
    changeRaw: nullableString(firstValue(row, ["change"])),
    changeRate: parseNumber(firstValue(row, ["diff"])),
    changeRateRaw: nullableString(firstValue(row, ["diff"])),
    sign: nullableString(firstValue(row, ["sign"])),
    volume: parseNumber(firstValue(row, ["volume"])),
    volumeRaw: nullableString(firstValue(row, ["volume"])),
    value: parseNumber(firstValue(row, ["value2", "value1"])),
    valueRaw: nullableString(firstValue(row, ["value2", "value1"])),
    volumeChangeRate: parseNumber(firstValue(row, ["diff_vol"])),
    valueShareRate: parseNumber(firstValue(row, ["rate"])),
    dividendRate: parseNumber(firstValue(row, ["divrate"])),
    breadth,
    investorFlow: {
      foreignNetBuy: parseNumber(firstValue(row, ["frgsvolume"])),
      institutionalNetBuy: parseNumber(firstValue(row, ["orgsvolume"])),
    },
    raw: row,
  };
}

function normalizeLsExpectedIndexRow(row) {
  return {
    time: nullableString(firstValue(row, ["chetime"])),
    timestamp: nullableString(firstValue(row, ["chetime"])),
    expectedIndex: parseIndexPrice(firstValue(row, ["jisu"])),
    expectedIndexRaw: nullableString(firstValue(row, ["jisu"])),
    change: parseNumber(firstValue(row, ["change"])),
    changeRaw: nullableString(firstValue(row, ["change"])),
    changeRate: parseNumber(firstValue(row, ["diff"])),
    changeRateRaw: nullableString(firstValue(row, ["diff"])),
    sign: nullableString(firstValue(row, ["sign"])),
    volume: parseNumber(firstValue(row, ["volume"])),
    volumeRaw: nullableString(firstValue(row, ["volume"])),
    volumeChange: parseNumber(firstValue(row, ["volcha"])),
    volumeChangeRaw: nullableString(firstValue(row, ["volcha"])),
    raw: row,
  };
}

function normalizeLsRelatedIndexes(block) {
  return [
    ["first", "fir"],
    ["second", "sec"],
    ["third", "thr"],
    ["fourth", "for"],
  ].map(([namePrefix, valuePrefix]) => ({
    code: nullableString(firstValue(block, [`${namePrefix}jcode`])),
    name: normalizeName(firstValue(block, [`${namePrefix}jname`])),
    price: parseIndexPrice(firstValue(block, [`${namePrefix}jisu`])),
    change: parseNumber(firstValue(block, [`${valuePrefix}change`])),
    changeRate: parseNumber(firstValue(block, [`${valuePrefix}diff`])),
    sign: nullableString(firstValue(block, [`${valuePrefix}sign`])),
  })).filter((item) => item.code || item.name || item.price !== null);
}

function combineBreadth(items) {
  const totals = {
    listedCount: sum(items.map((item) => item?.listedCount)),
    rising: sum(items.map((item) => item?.rising)),
    steady: sum(items.map((item) => item?.steady)),
    falling: sum(items.map((item) => item?.falling)),
    upperLimit: sum(items.map((item) => item?.upperLimit)),
    lowerLimit: sum(items.map((item) => item?.lowerLimit)),
    tradedCount: sum(items.map((item) => item?.tradedCount)),
  };
  totals.risingRate = calculateRisingRate(totals);
  totals.fallingRate = calculateFallingRate(totals);
  return totals;
}

function marketDirection(indexes) {
  const values = indexes.map((index) => index.changeRate).filter(Number.isFinite);
  if (values.length === 0) {
    return "unknown";
  }

  const averageChangeRate = values.reduce((sumValue, value) => sumValue + value, 0) / values.length;
  if (averageChangeRate > 0.1) {
    return "up";
  }

  if (averageChangeRate < -0.1) {
    return "down";
  }

  return "flat";
}

function resolveDomesticIndex(broker, index) {
  const normalized = String(index ?? "").trim().toLowerCase();
  if (!normalized) {
    throw BrokerError.validation("Domestic index is required", {
      details: { capabilityId: INDEX_CURRENT_CAPABILITY_ID },
    });
  }

  const entry = DOMESTIC_INDEXES[normalized] ?? Object.entries(DOMESTIC_INDEXES)
    .find(([, value]) => value[broker].code === normalized)?.[1];
  const key = DOMESTIC_INDEXES[normalized]
    ? normalized
    : Object.entries(DOMESTIC_INDEXES).find(([, value]) => value[broker].code === normalized)?.[0];

  if (!entry || !key) {
    throw BrokerError.validation(`Unsupported domestic index: ${index}`, {
      broker,
      details: { index, supported: Object.keys(DOMESTIC_INDEXES) },
    });
  }

  return {
    key,
    label: entry.label,
    ...entry[broker],
  };
}

function normalizeSnapshotIndexes(indexes) {
  const values = Array.isArray(indexes) && indexes.length ? indexes : ["kospi", "kosdaq"];
  return values.map((index) => String(index).trim()).filter(Boolean);
}

function normalizeExpectedIndexSession(value) {
  const normalized = String(value ?? "preopen").trim().toLowerCase();
  if (["1", "pre", "preopen", "before", "beforeopen", "장전"].includes(normalized)) {
    return "1";
  }

  if (["2", "after", "afterclose", "close", "장후"].includes(normalized)) {
    return "2";
  }

  throw BrokerError.validation(`Unsupported expected index session: ${value}`, {
    details: { session: value, supported: ["preopen", "afterclose"] },
  });
}

function successResponse({ broker, index, source, result, data, capabilityId }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: source.id,
    index,
    data,
    raw: result.raw,
    headers: result.headers ?? {},
    status: result.status ?? 0,
    continuation: result.continuation,
  };
}

function failureResponse({ broker, index, source, result, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Market context service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: source?.id ?? result?.id ?? null,
    index,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
}

function calculateRisingRate(breadth) {
  const rising = breadth.rising;
  const falling = breadth.falling;
  const steady = breadth.steady ?? 0;
  const total = firstFinite([breadth.listedCount, rising !== null && falling !== null ? rising + falling + steady : null]);

  if (!Number.isFinite(rising) || !Number.isFinite(total) || total === 0) {
    return null;
  }

  return (rising / total) * 100;
}

function calculateFallingRate(breadth) {
  const falling = breadth.falling;
  const rising = breadth.rising;
  const steady = breadth.steady ?? 0;
  const total = firstFinite([breadth.listedCount, rising !== null && falling !== null ? rising + falling + steady : null]);

  if (!Number.isFinite(falling) || !Number.isFinite(total) || total === 0) {
    return null;
  }

  return (falling / total) * 100;
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

function parseIndexPrice(value) {
  const parsed = parseNumber(value);
  return parsed === null ? null : Math.abs(parsed);
}

function parseKiwoomIndexCandlePrice(value) {
  const parsed = parseNumber(value);
  return parsed === null ? null : Math.abs(parsed) / 100;
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

function nullableString(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value);
}

function normalizeName(value) {
  const normalized = nullableString(value);
  return normalized ? normalized.replace(/\s+/g, " ").trim() : null;
}

function firstFinite(values) {
  return values.find(Number.isFinite) ?? null;
}

function sum(values) {
  const finiteValues = values.filter(Number.isFinite);
  if (finiteValues.length === 0) {
    return null;
  }

  return finiteValues.reduce((sumValue, value) => sumValue + value, 0);
}
