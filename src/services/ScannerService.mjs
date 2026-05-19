import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const VOLUME_RANKING_CAPABILITY_ID = "scanner.domesticStock.volumeRanking";
const VALUE_RANKING_CAPABILITY_ID = "scanner.domesticStock.valueRanking";
const CHANGE_RATE_RANKING_CAPABILITY_ID = "scanner.domesticStock.changeRateRanking";

export class ScannerService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getDomesticStockVolumeRankings(broker, options = {}) {
    return this.requestScanner({
      broker,
      options,
      capabilityId: VOLUME_RANKING_CAPABILITY_ID,
      request: requestVolumeRankings,
      normalize: normalizeDomesticStockVolumeRankings,
    });
  }

  async getDomesticStockValueRankings(broker, options = {}) {
    return this.requestScanner({
      broker,
      options,
      capabilityId: VALUE_RANKING_CAPABILITY_ID,
      request: requestValueRankings,
      normalize: normalizeDomesticStockValueRankings,
    });
  }

  async getDomesticStockChangeRateRankings(broker, options = {}) {
    return this.requestScanner({
      broker,
      options,
      capabilityId: CHANGE_RATE_RANKING_CAPABILITY_ID,
      request: requestChangeRateRankings,
      normalize: normalizeDomesticStockChangeRateRankings,
    });
  }

  async requestScanner({ broker, options, capabilityId, request, normalize }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(capabilityId)) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          capabilityId,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${capabilityId}`, {
            broker: normalizedBroker,
            details: { capabilityId },
          }),
        });
      }

      source = selectScannerSource(normalizedBroker, capabilities, capabilityId, options);
      const result = await request(client, normalizedBroker, source.id, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          result,
          capabilityId,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        source,
        result,
        data: normalize(normalizedBroker, source.id, result.data),
        capabilityId,
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        source,
        capabilityId,
        error,
      });
    }
  }
}

export function normalizeDomesticStockVolumeRankings(broker, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeRankingList({
      broker,
      sourceId,
      capabilityId: VOLUME_RANKING_CAPABILITY_ID,
      rankingType: "volume",
      rows: payload?.tdy_trde_qty_upper,
    });
  }

  if (broker === "ls") {
    return normalizeRankingList({
      broker,
      sourceId,
      capabilityId: VOLUME_RANKING_CAPABILITY_ID,
      rankingType: "volume",
      rows: payload?.t1452OutBlock1,
      summary: payload?.t1452OutBlock,
    });
  }

  throw BrokerError.unsupported(`Unsupported volume ranking normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticStockValueRankings(broker, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeRankingList({
      broker,
      sourceId,
      capabilityId: VALUE_RANKING_CAPABILITY_ID,
      rankingType: "value",
      rows: payload?.trde_prica_upper,
    });
  }

  if (broker === "ls") {
    return normalizeRankingList({
      broker,
      sourceId,
      capabilityId: VALUE_RANKING_CAPABILITY_ID,
      rankingType: "value",
      rows: payload?.t1463OutBlock1,
      summary: payload?.t1463OutBlock,
    });
  }

  throw BrokerError.unsupported(`Unsupported value ranking normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticStockChangeRateRankings(broker, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeRankingList({
      broker,
      sourceId,
      capabilityId: CHANGE_RATE_RANKING_CAPABILITY_ID,
      rankingType: "changeRate",
      rows: payload?.pred_pre_flu_rt_upper,
    });
  }

  if (broker === "ls") {
    return normalizeRankingList({
      broker,
      sourceId,
      capabilityId: CHANGE_RATE_RANKING_CAPABILITY_ID,
      rankingType: "changeRate",
      rows: payload?.t1441OutBlock1,
      summary: payload?.t1441OutBlock,
    });
  }

  throw BrokerError.unsupported(`Unsupported change rate ranking normalization broker: ${broker}`, {
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

function selectScannerSource(broker, capabilities, capabilityId, options) {
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

async function requestVolumeRankings(client, broker, sourceId, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      mrkt_tp: kiwoomMarket(options.market),
      sort_tp: options.sortType ?? "1",
      mang_stk_incls: options.managedStockFilter ?? "0",
      crd_tp: options.creditType ?? "0",
      trde_qty_tp: options.volumeFilter ?? "0",
      pric_tp: options.priceFilter ?? "0",
      trde_prica_tp: options.valueFilter ?? "0",
      mrkt_open_tp: options.marketSession ?? "0",
      stex_tp: kiwoomExchange(options.exchange),
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        gubun: lsMarket(options.market),
        jnilgubun: options.dayCode ?? "1",
        sdiff: options.minChangeRate ?? 0,
        ediff: options.maxChangeRate ?? 0,
        jc_num: options.excludeFlags ?? 0,
        sprice: options.minPrice ?? 0,
        eprice: options.maxPrice ?? 0,
        volume: options.minVolume ?? 0,
        idx: options.idx ?? 0,
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported volume ranking request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestValueRankings(client, broker, sourceId, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      mrkt_tp: kiwoomMarket(options.market),
      mang_stk_incls: options.managedStockFilter ?? "1",
      stex_tp: kiwoomExchange(options.exchange),
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        gubun: lsMarket(options.market),
        jnilgubun: options.dayCode ?? "0",
        jc_num: options.excludeFlags ?? 0,
        sprice: options.minPrice ?? 0,
        eprice: options.maxPrice ?? 0,
        volume: options.minVolume ?? 0,
        idx: options.idx ?? 0,
        jc_num2: options.excludeFlags2 ?? 0,
        exchgubun: lsExchange(options.exchange),
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported value ranking request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestChangeRateRankings(client, broker, sourceId, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      mrkt_tp: kiwoomMarket(options.market),
      sort_tp: kiwoomChangeSort(options.direction),
      trde_qty_cnd: options.volumeFilter ?? "0000",
      stk_cnd: options.stockFilter ?? "0",
      crd_cnd: options.creditCondition ?? "0",
      updown_incls: options.includeLimitUpDown === false ? "0" : "1",
      pric_cnd: options.priceCondition ?? "0",
      trde_prica_cnd: options.valueCondition ?? "0",
      stex_tp: kiwoomExchange(options.exchange),
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        gubun1: lsMarket(options.market),
        gubun2: lsChangeDirection(options.direction),
        gubun3: options.dayCode ?? "0",
        jc_num: options.excludeFlags ?? 0,
        sprice: options.minPrice ?? 0,
        eprice: options.maxPrice ?? 0,
        volume: options.minVolume ?? 0,
        idx: options.idx ?? 0,
        jc_num2: options.excludeFlags2 ?? 0,
        exchgubun: lsExchange(options.exchange),
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported change rate ranking request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

function normalizeRankingList({ broker, sourceId, capabilityId, rankingType, rows, summary }) {
  return {
    broker,
    rankingType,
    items: (Array.isArray(rows) ? rows : []).map((row, index) => normalizeRankingItem(broker, row, index)),
    summary: {
      nextIndex: parseNumber(firstValue(summary, ["idx"])),
    },
    source: {
      broker,
      id: sourceId,
      capabilityId,
    },
  };
}

function normalizeRankingItem(broker, row, index) {
  const rankRaw = firstValue(row, ["rank", "now_rank"]);

  return {
    rank: parseNumber(rankRaw) ?? index + 1,
    rankRaw: nullableString(rankRaw),
    symbol: normalizeSymbolCode(firstValue(row, broker === "kiwoom" ? ["stk_cd"] : ["shcode"])),
    name: nullableString(firstValue(row, broker === "kiwoom" ? ["stk_nm"] : ["hname"])),
    price: parsePrice(firstValue(row, broker === "kiwoom" ? ["cur_prc"] : ["price"])),
    priceRaw: nullableString(firstValue(row, broker === "kiwoom" ? ["cur_prc"] : ["price"])),
    change: parseNumber(firstValue(row, broker === "kiwoom" ? ["pred_pre"] : ["change"])),
    changeRaw: nullableString(firstValue(row, broker === "kiwoom" ? ["pred_pre"] : ["change"])),
    changeRate: parseNumber(firstValue(row, broker === "kiwoom" ? ["flu_rt"] : ["diff"])),
    changeRateRaw: nullableString(firstValue(row, broker === "kiwoom" ? ["flu_rt"] : ["diff"])),
    sign: nullableString(firstValue(row, broker === "kiwoom" ? ["pred_pre_sig"] : ["sign"])),
    volume: parseNumber(firstValue(row, broker === "kiwoom" ? ["trde_qty", "now_trde_qty"] : ["volume"])),
    volumeRaw: nullableString(firstValue(row, broker === "kiwoom" ? ["trde_qty", "now_trde_qty"] : ["volume"])),
    value: parseNumber(firstValue(row, broker === "kiwoom" ? ["trde_amt", "trde_prica"] : ["value"])),
    valueRaw: nullableString(firstValue(row, broker === "kiwoom" ? ["trde_amt", "trde_prica"] : ["value"])),
    turnoverRate: parseNumber(firstValue(row, broker === "kiwoom" ? ["trde_tern_rt"] : ["vol"])),
    previousVolume: parseNumber(firstValue(row, broker === "kiwoom" ? ["pred_trde_qty"] : ["jnilvolume"])),
    previousValue: parseNumber(firstValue(row, ["jnilvalue"])),
    marketCap: parseNumber(firstValue(row, ["total"])),
    askPrice: parsePrice(firstValue(row, broker === "kiwoom" ? ["sel_bid"] : ["offerho1"])),
    bidPrice: parsePrice(firstValue(row, broker === "kiwoom" ? ["buy_bid"] : ["bidho1"])),
    raw: row,
  };
}

function successResponse({ broker, source, result, data, capabilityId }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: source.id,
    data,
    raw: result.raw,
    headers: result.headers ?? {},
    status: result.status ?? 0,
    continuation: result.continuation,
  };
}

function failureResponse({ broker, source, result, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Scanner service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: source?.id ?? result?.id ?? null,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
}

function kiwoomMarket(market) {
  if (market === "kospi") {
    return "001";
  }

  if (market === "kosdaq") {
    return "101";
  }

  return market ?? "000";
}

function lsMarket(market) {
  if (market === "kospi") {
    return "1";
  }

  if (market === "kosdaq") {
    return "2";
  }

  return market ?? "0";
}

function kiwoomExchange(exchange) {
  if (exchange === "krx") {
    return "1";
  }

  if (exchange === "nxt") {
    return "2";
  }

  return exchange ?? "3";
}

function lsExchange(exchange) {
  if (exchange === "krx") {
    return "K";
  }

  if (exchange === "nxt") {
    return "N";
  }

  return exchange ?? "U";
}

function kiwoomChangeSort(direction) {
  if (direction === "down") {
    return "3";
  }

  if (direction === "flat") {
    return "5";
  }

  return "1";
}

function lsChangeDirection(direction) {
  if (direction === "down") {
    return "1";
  }

  if (direction === "flat") {
    return "2";
  }

  return "0";
}

function normalizeSymbolCode(value) {
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
