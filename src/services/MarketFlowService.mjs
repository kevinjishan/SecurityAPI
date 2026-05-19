import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const INVESTOR_FLOW_CAPABILITY_ID = "marketFlow.domesticInvestor.netBuy";
const PROGRAM_TRADING_CAPABILITY_ID = "marketFlow.programTrading.trend";

const MARKET_FLOW_TARGETS = Object.freeze({
  kospi: {
    label: "KOSPI",
    kiwoom: { marketType: "0", code: "001" },
    ls: { market: "1", code: "001" },
  },
  kosdaq: {
    label: "KOSDAQ",
    kiwoom: { marketType: "1", code: "101" },
    ls: { market: "3", code: "301" },
  },
  kospi200: {
    label: "KOSPI200",
    kiwoom: { marketType: "0", code: "201" },
    ls: { market: "2", code: "101" },
  },
});

const PROGRAM_TRADING_TARGETS = Object.freeze({
  kospi: {
    label: "KOSPI",
    kiwoom: {
      codes: {
        krx: "P00101",
        nxt: "P001_NX01",
        integrated: "P001_AL01",
      },
    },
    ls: { gubun: "0" },
  },
  kosdaq: {
    label: "KOSDAQ",
    kiwoom: {
      codes: {
        krx: "P10102",
        nxt: "P101_NX02",
        integrated: "P101_AL02",
      },
    },
    ls: { gubun: "1" },
  },
});

const PARTICIPANTS = Object.freeze([
  { type: "individual", label: "개인", kiwoom: "ind_netprps", ls: "08" },
  { type: "foreign", label: "외국인", kiwoom: "frgnr_netprps", ls: "17" },
  { type: "institutional", label: "기관계", kiwoom: "orgn_netprps", ls: "18" },
  { type: "securities", label: "증권", kiwoom: "sc_netprps", ls: "01" },
  { type: "investmentTrust", label: "투신", kiwoom: "invtrt_netprps", ls: "03" },
  { type: "bank", label: "은행", kiwoom: "bank_netprps", ls: "04" },
  { type: "insurance", label: "보험", kiwoom: "insrnc_netprps", ls: "02" },
  { type: "merchantBank", label: "종금", kiwoom: "jnsinkm_netprps", ls: "05" },
  { type: "pensionFund", label: "기금", kiwoom: "endw_netprps", ls: "06" },
  { type: "government", label: "국가", kiwoom: "natn_netprps", ls: "11" },
  { type: "privateFund", label: "사모펀드", kiwoom: "samo_fund_netprps", ls: "00" },
  { type: "other", label: "기타", kiwoom: "etc_corp_netprps", ls: "07" },
]);

export class MarketFlowService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getDomesticInvestorFlow(broker, market, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedMarket = String(market ?? "").trim();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const marketRef = resolveMarketFlowTarget(normalizedBroker, normalizedMarket);
      normalizedMarket = marketRef.key;
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(INVESTOR_FLOW_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          market: normalizedMarket,
          source,
          capabilityId: INVESTOR_FLOW_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${INVESTOR_FLOW_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: INVESTOR_FLOW_CAPABILITY_ID },
          }),
        });
      }

      source = selectMarketFlowSource(normalizedBroker, capabilities, INVESTOR_FLOW_CAPABILITY_ID, options);
      const result = await requestDomesticInvestorFlow(client, normalizedBroker, source.id, marketRef, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          market: normalizedMarket,
          source,
          result,
          capabilityId: INVESTOR_FLOW_CAPABILITY_ID,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        market: normalizedMarket,
        source,
        result,
        capabilityId: INVESTOR_FLOW_CAPABILITY_ID,
        data: normalizeDomesticInvestorFlow(normalizedBroker, normalizedMarket, source.id, result.data, options),
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        market: normalizedMarket,
        source,
        capabilityId: INVESTOR_FLOW_CAPABILITY_ID,
        error,
      });
    }
  }

  async getProgramTradingTrend(broker, market, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedMarket = String(market ?? "").trim();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const marketRef = resolveProgramTradingTarget(normalizedBroker, normalizedMarket);
      normalizedMarket = marketRef.key;
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(PROGRAM_TRADING_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          market: normalizedMarket,
          source,
          capabilityId: PROGRAM_TRADING_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${PROGRAM_TRADING_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: PROGRAM_TRADING_CAPABILITY_ID },
          }),
        });
      }

      source = selectMarketFlowSource(normalizedBroker, capabilities, PROGRAM_TRADING_CAPABILITY_ID, options);
      const result = await requestProgramTradingTrend(client, normalizedBroker, source.id, marketRef, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          market: normalizedMarket,
          source,
          result,
          capabilityId: PROGRAM_TRADING_CAPABILITY_ID,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        market: normalizedMarket,
        source,
        result,
        capabilityId: PROGRAM_TRADING_CAPABILITY_ID,
        data: normalizeProgramTradingTrend(normalizedBroker, normalizedMarket, source.id, result.data, options),
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        market: normalizedMarket,
        source,
        capabilityId: PROGRAM_TRADING_CAPABILITY_ID,
        error,
      });
    }
  }
}

export function normalizeDomesticInvestorFlow(broker, market, sourceId, payload, options = {}) {
  if (broker === "kiwoom") {
    return normalizeKiwoomDomesticInvestorFlow(market, sourceId, payload, options);
  }

  if (broker === "ls") {
    return normalizeLsDomesticInvestorFlow(market, sourceId, payload, options);
  }

  throw BrokerError.unsupported(`Unsupported market flow normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeProgramTradingTrend(broker, market, sourceId, payload, options = {}) {
  if (broker === "kiwoom") {
    return normalizeKiwoomProgramTradingTrend(market, sourceId, payload, options);
  }

  if (broker === "ls") {
    return normalizeLsProgramTradingTrend(market, sourceId, payload, options);
  }

  throw BrokerError.unsupported(`Unsupported program trading normalization broker: ${broker}`, {
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

function selectMarketFlowSource(broker, capabilities, capabilityId, options) {
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

async function requestDomesticInvestorFlow(client, broker, sourceId, marketRef, options) {
  const requestOptions = options.requestOptions ?? {};
  const unit = normalizeFlowUnit(options.unit);

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      mrkt_tp: options.marketType ?? marketRef.marketType,
      amt_qty_tp: unit === "quantity" ? "1" : "0",
      base_dt: normalizeOptionalDate(options.baseDate),
      stex_tp: normalizeKiwoomExchange(options.exchange),
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        market: options.marketCode ?? marketRef.market,
        upcode: options.upcode ?? marketRef.code,
        gubun1: unit === "quantity" ? "1" : "2",
        gubun2: options.previousDay ? "1" : "0",
        cts_time: options.ctsTime ?? " ",
        cts_idx: options.ctsIndex ?? 1,
        cnt: options.count ?? 20,
        gubun3: options.compareCode ?? "C",
        exchgubun: normalizeLsExchange(options.exchange),
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported domestic investor flow request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestProgramTradingTrend(client, broker, sourceId, marketRef, options) {
  const requestOptions = options.requestOptions ?? {};
  const unit = normalizeFlowUnit(options.unit);

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      date: normalizeDate(options.date ?? options.baseDate),
      amt_qty_tp: unit === "quantity" ? "2" : "1",
      mrkt_tp: marketRef.codes[normalizeKiwoomExchangeName(options.exchange)],
      min_tic_tp: options.tick === true ? "0" : "1",
      stex_tp: normalizeKiwoomExchange(options.exchange),
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        gubun: options.marketCode ?? marketRef.gubun,
        gubun1: unit === "quantity" ? "1" : "0",
        gubun2: options.compareCode ?? "1",
        gubun3: options.previousDay ? "1" : "0",
        date: normalizeOptionalDate(options.date ?? options.baseDate) || " ",
        time: options.time ?? " ",
        exchgubun: normalizeLsExchange(options.exchange),
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported program trading trend request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

function normalizeKiwoomDomesticInvestorFlow(market, sourceId, payload, options) {
  const marketRef = resolveMarketFlowTarget("kiwoom", market);
  const rows = Array.isArray(payload?.inds_netprps) ? payload.inds_netprps : [];
  const row = rows.find((item) => normalizeKiwoomIndustryCode(item.inds_cd) === marketRef.code) ?? rows[0] ?? {};
  const participants = PARTICIPANTS.map((participant) => normalizeKiwoomParticipant(row, participant));

  return investorFlow({
    broker: "kiwoom",
    market: marketRef.key,
    code: normalizeKiwoomIndustryCode(firstValue(row, ["inds_cd"])) ?? marketRef.code,
    name: firstValue(row, ["inds_nm"]) ?? marketRef.label,
    unit: normalizeFlowUnit(options.unit),
    exchange: normalizeKiwoomExchangeName(options.exchange),
    participants,
    index: {
      price: parseScaledPrice(firstValue(row, ["cur_prc"])),
      priceRaw: nullableString(firstValue(row, ["cur_prc"])),
      change: parseScaledPrice(firstValue(row, ["pred_pre"])),
      changeRaw: nullableString(firstValue(row, ["pred_pre"])),
      changeRate: parseScaledRate(firstValue(row, ["flu_rt"])),
      changeRateRaw: nullableString(firstValue(row, ["flu_rt"])),
      sign: nullableString(firstValue(row, ["pre_smbol", "pred_pre_sig"])),
      volume: parseNumber(firstValue(row, ["trde_qty"])),
      volumeRaw: nullableString(firstValue(row, ["trde_qty"])),
    },
    timeline: [],
    summary: {},
    sourceId,
    raw: row,
  });
}

function normalizeLsDomesticInvestorFlow(market, sourceId, payload, options) {
  const marketRef = resolveMarketFlowTarget("ls", market);
  const block = payload?.[`${sourceId}OutBlock`] ?? payload?.t1602OutBlock ?? payload;
  const rows = payload?.[`${sourceId}OutBlock1`] ?? payload?.t1602OutBlock1;
  const participants = PARTICIPANTS.map((participant) => normalizeLsParticipant(block, participant));

  return investorFlow({
    broker: "ls",
    market: marketRef.key,
    code: nullableString(firstValue(block, ["ex_upcode"])) ?? marketRef.code,
    name: marketRef.label,
    unit: normalizeFlowUnit(options.unit),
    exchange: normalizeLsExchangeName(options.exchange),
    participants,
    index: null,
    timeline: (Array.isArray(rows) ? rows : []).map((row) => ({
      time: nullableString(firstValue(row, ["time"])),
      timestamp: nullableString(firstValue(row, ["time"])),
      participants: PARTICIPANTS.map((participant) => normalizeLsTimelineParticipant(row, participant)),
      raw: row,
    })),
    summary: {
      nextTime: nullableString(firstValue(block, ["cts_time"])),
    },
    sourceId,
    raw: block,
  });
}

function normalizeKiwoomProgramTradingTrend(market, sourceId, payload, options) {
  const marketRef = resolveProgramTradingTarget("kiwoom", market);
  const unit = normalizeFlowUnit(options.unit);
  const rows = Array.isArray(payload?.prm_trde_trnsn) ? payload.prm_trde_trnsn : [];

  return programTradingTrend({
    broker: "kiwoom",
    market: marketRef.key,
    name: marketRef.label,
    unit,
    exchange: normalizeKiwoomExchangeName(options.exchange),
    timeline: rows.map((row) => normalizeKiwoomProgramTradingRow(row, unit)),
    summary: {},
    sourceId,
    raw: payload,
  });
}

function normalizeLsProgramTradingTrend(market, sourceId, payload, options) {
  const marketRef = resolveProgramTradingTarget("ls", market);
  const unit = normalizeFlowUnit(options.unit);
  const summary = payload?.[`${sourceId}OutBlock`] ?? payload?.t1632OutBlock ?? {};
  const rows = payload?.[`${sourceId}OutBlock1`] ?? payload?.t1632OutBlock1;

  return programTradingTrend({
    broker: "ls",
    market: marketRef.key,
    name: marketRef.label,
    unit,
    exchange: normalizeLsExchangeName(options.exchange),
    timeline: (Array.isArray(rows) ? rows : []).map((row) => normalizeLsProgramTradingRow(row)),
    summary: {
      nextDate: nullableString(firstValue(summary, ["date"])),
      nextTime: nullableString(firstValue(summary, ["time"])),
      nextIndex: parseNumber(firstValue(summary, ["idx"])),
    },
    sourceId,
    raw: payload,
  });
}

function investorFlow({ broker, market, code, name, unit, exchange, participants, index, timeline, summary, sourceId, raw }) {
  const byType = Object.fromEntries(participants.map((participant) => [participant.type, participant]));
  const individualNetBuy = byType.individual?.netBuy ?? null;
  const foreignNetBuy = byType.foreign?.netBuy ?? null;
  const institutionalNetBuy = byType.institutional?.netBuy ?? null;
  const foreignInstitutionalNetBuy = sum([foreignNetBuy, institutionalNetBuy]);

  return {
    broker,
    market,
    code: nullableString(code),
    name: normalizeName(name),
    unit,
    exchange,
    index,
    participants,
    summary: {
      individualNetBuy,
      foreignNetBuy,
      institutionalNetBuy,
      foreignInstitutionalNetBuy,
      ...summary,
    },
    timeline,
    source: {
      broker,
      id: sourceId,
      capabilityId: INVESTOR_FLOW_CAPABILITY_ID,
    },
    raw,
  };
}

function programTradingTrend({ broker, market, name, unit, exchange, timeline, summary, sourceId, raw }) {
  const latest = timeline[0] ?? null;

  return {
    broker,
    market,
    name: normalizeName(name),
    unit,
    exchange,
    timeline,
    summary: {
      latestTime: latest?.time ?? null,
      totalNetBuy: latest?.total.netBuy ?? null,
      arbitrageNetBuy: latest?.arbitrage.netBuy ?? null,
      nonArbitrageNetBuy: latest?.nonArbitrage.netBuy ?? null,
      k200Index: latest?.index.kospi200 ?? null,
      basis: latest?.index.basis ?? null,
      ...summary,
    },
    source: {
      broker,
      id: sourceId,
      capabilityId: PROGRAM_TRADING_CAPABILITY_ID,
    },
    raw,
  };
}

function normalizeKiwoomProgramTradingRow(row, unit) {
  const amountMode = unit === "amount";

  return {
    time: nullableString(firstValue(row, ["cntr_tm"])),
    timestamp: nullableString(firstValue(row, ["cntr_tm"])),
    total: normalizeProgramSide(row, ["all_buy"], ["all_sel"], ["all_netprps"]),
    arbitrage: normalizeProgramSide(
      row,
      [amountMode ? "dfrt_trde_buy" : "dfrt_trde_buy_qty"],
      [amountMode ? "dfrt_trde_sel" : "dfrt_trde_sell_qty"],
      [amountMode ? "dfrt_trde_netprps" : "dfrt_trde_netprps_qty"],
    ),
    nonArbitrage: normalizeProgramSide(
      row,
      [amountMode ? "ndiffpro_trde_buy" : "ndiffpro_trde_buy_qty"],
      [amountMode ? "ndiffpro_trde_sel" : "ndiffpro_trde_sell_qty"],
      [amountMode ? "ndiffpro_trde_netprps" : "ndiffpro_trde_netprps_qty"],
    ),
    index: {
      kospi200: parseScaledPrice(firstValue(row, ["kospi200"])),
      basis: parseNumber(firstValue(row, ["basis"])),
      sign: null,
      change: null,
    },
    raw: row,
  };
}

function normalizeLsProgramTradingRow(row) {
  return {
    time: nullableString(firstValue(row, ["time"])),
    timestamp: nullableString(firstValue(row, ["time"])),
    total: normalizeProgramSide(row, ["tot1"], ["tot2"], ["tot3"]),
    arbitrage: normalizeProgramSide(row, ["cha1"], ["cha2"], ["cha3"]),
    nonArbitrage: normalizeProgramSide(row, ["bcha1"], ["bcha2"], ["bcha3"]),
    index: {
      kospi200: parseNumber(firstValue(row, ["k200jisu"])),
      basis: parseNumber(firstValue(row, ["k200basis"])),
      sign: nullableString(firstValue(row, ["sign"])),
      change: parseNumber(firstValue(row, ["change"])),
    },
    raw: row,
  };
}

function normalizeProgramSide(row, buyKeys, sellKeys, netBuyKeys) {
  const buyRaw = firstValue(row, buyKeys);
  const sellRaw = firstValue(row, sellKeys);
  const netBuyRaw = firstValue(row, netBuyKeys);

  return {
    buy: parseNumber(buyRaw),
    buyRaw: nullableString(buyRaw),
    sell: parseNumber(sellRaw),
    sellRaw: nullableString(sellRaw),
    netBuy: parseNumber(netBuyRaw),
    netBuyRaw: nullableString(netBuyRaw),
  };
}

function normalizeKiwoomParticipant(row, participant) {
  return {
    type: participant.type,
    label: participant.label,
    code: null,
    buy: null,
    sell: null,
    netBuy: parseNumber(firstValue(row, [participant.kiwoom])),
    change: null,
    raw: pickRaw(row, [participant.kiwoom]),
  };
}

function normalizeLsParticipant(block, participant) {
  const suffix = participant.ls;
  const codeKey = suffix === "08" ? `tjjcode_${suffix}` : `jjcode_${suffix}`;

  return {
    type: participant.type,
    label: participant.label,
    code: nullableString(firstValue(block, [codeKey])),
    buy: parseNumber(firstValue(block, [`ms_${suffix}`])),
    sell: parseNumber(firstValue(block, [`md_${suffix}`])),
    netBuy: parseNumber(firstValue(block, [`svolume_${suffix}`])),
    change: parseNumber(firstValue(block, [`rate_${suffix}`])),
    raw: pickRaw(block, [codeKey, `ms_${suffix}`, `md_${suffix}`, `svolume_${suffix}`, `rate_${suffix}`]),
  };
}

function normalizeLsTimelineParticipant(row, participant) {
  const suffix = participant.ls;

  return {
    type: participant.type,
    label: participant.label,
    netBuy: parseNumber(firstValue(row, [`sv_${suffix}`])),
    raw: pickRaw(row, [`sv_${suffix}`]),
  };
}

function successResponse({ broker, market, source, result, data, capabilityId }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: source.id,
    market,
    data,
    raw: result.raw,
    headers: result.headers ?? {},
    status: result.status ?? 0,
    continuation: result.continuation,
  };
}

function failureResponse({ broker, market, source, result, error, capabilityId = INVESTOR_FLOW_CAPABILITY_ID }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Market flow service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: source?.id ?? result?.id ?? null,
    market,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
}

function resolveMarketFlowTarget(broker, market) {
  const normalized = String(market ?? "").trim().toLowerCase();
  if (!normalized) {
    throw BrokerError.validation("Domestic market is required", {
      details: { capabilityId: INVESTOR_FLOW_CAPABILITY_ID },
    });
  }

  const matched = MARKET_FLOW_TARGETS[normalized]
    ? [normalized, MARKET_FLOW_TARGETS[normalized]]
    : Object.entries(MARKET_FLOW_TARGETS).find(([, value]) => value[broker].code === normalized);

  if (!matched) {
    throw BrokerError.validation(`Unsupported domestic market flow target: ${market}`, {
      broker,
      details: { market, supported: Object.keys(MARKET_FLOW_TARGETS) },
    });
  }

  const [key, entry] = matched;
  return {
    key,
    label: entry.label,
    ...entry[broker],
  };
}

function resolveProgramTradingTarget(broker, market) {
  const normalized = String(market ?? "").trim().toLowerCase();
  if (!normalized) {
    throw BrokerError.validation("Program trading market is required", {
      details: { capabilityId: PROGRAM_TRADING_CAPABILITY_ID },
    });
  }

  const matched = PROGRAM_TRADING_TARGETS[normalized]
    ? [normalized, PROGRAM_TRADING_TARGETS[normalized]]
    : null;

  if (!matched) {
    throw BrokerError.validation(`Unsupported program trading market: ${market}`, {
      broker,
      details: { market, supported: Object.keys(PROGRAM_TRADING_TARGETS) },
    });
  }

  const [key, entry] = matched;
  return {
    key,
    label: entry.label,
    ...entry[broker],
  };
}

function normalizeFlowUnit(value) {
  const normalized = String(value ?? "amount").trim().toLowerCase();
  if (["amount", "value", "money"].includes(normalized)) {
    return "amount";
  }

  if (["quantity", "volume", "qty"].includes(normalized)) {
    return "quantity";
  }

  throw BrokerError.validation("unit must be amount or quantity", {
    details: { field: "unit", value },
  });
}

function normalizeKiwoomExchange(value) {
  const normalized = String(value ?? "integrated").trim().toLowerCase();
  if (["krx", "k"].includes(normalized)) {
    return "1";
  }
  if (["nxt", "n"].includes(normalized)) {
    return "2";
  }
  return "3";
}

function normalizeLsExchange(value) {
  const normalized = String(value ?? "integrated").trim().toLowerCase();
  if (["krx", "k"].includes(normalized)) {
    return "K";
  }
  if (["nxt", "n"].includes(normalized)) {
    return "N";
  }
  return "U";
}

function normalizeKiwoomExchangeName(value) {
  const code = normalizeKiwoomExchange(value);
  return code === "1" ? "krx" : code === "2" ? "nxt" : "integrated";
}

function normalizeLsExchangeName(value) {
  const code = normalizeLsExchange(value);
  return code === "K" ? "krx" : code === "N" ? "nxt" : "integrated";
}

function normalizeKiwoomIndustryCode(value) {
  const normalized = nullableString(value);
  return normalized ? normalized.split("_")[0] : null;
}

function parseScaledPrice(value) {
  const parsed = parseNumber(value);
  return parsed === null ? null : Math.abs(parsed) / 100;
}

function parseScaledRate(value) {
  const parsed = parseNumber(value);
  return parsed === null ? null : parsed / 100;
}

function normalizeOptionalDate(value) {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  return String(value).replaceAll("-", "").trim();
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

function normalizeName(value) {
  const normalized = nullableString(value);
  return normalized ? normalized.replace(/\s+/g, " ").trim() : null;
}

function pickRaw(source, keys) {
  return Object.fromEntries(keys.map((key) => [key, source?.[key]]).filter(([, value]) => value !== undefined));
}

function sum(values) {
  const finiteValues = values.filter(Number.isFinite);
  if (finiteValues.length === 0) {
    return null;
  }

  return finiteValues.reduce((sumValue, value) => sumValue + value, 0);
}
