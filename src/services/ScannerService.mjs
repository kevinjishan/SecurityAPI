import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const VOLUME_RANKING_CAPABILITY_ID = "scanner.domesticStock.volumeRanking";
const VALUE_RANKING_CAPABILITY_ID = "scanner.domesticStock.valueRanking";
const CHANGE_RATE_RANKING_CAPABILITY_ID = "scanner.domesticStock.changeRateRanking";
const CONDITION_LIST_CAPABILITY_ID = "scanner.conditionSearch.list";
const CONDITION_SEARCH_CAPABILITY_ID = "scanner.conditionSearch.search";
const CONDITION_REALTIME_CAPABILITY_ID = "scanner.conditionSearch.realtime";

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

  async listConditionSearches(broker, options = {}) {
    const sourceTransport = conditionRequestTransport(broker);

    return this.requestScanner({
      broker,
      options,
      capabilityId: CONDITION_LIST_CAPABILITY_ID,
      request: requestConditionSearchList,
      normalize: normalizeConditionSearchList,
      sourceTransport,
      sourceRole: "conditionList",
    });
  }

  async searchCondition(broker, condition, options = {}) {
    const sourceTransport = conditionRequestTransport(broker);

    return this.requestScanner({
      broker,
      options: {
        ...options,
        condition: normalizeConditionInput(condition),
      },
      capabilityId: CONDITION_SEARCH_CAPABILITY_ID,
      request: requestConditionSearch,
      normalize: normalizeConditionSearchResult,
      sourceTransport,
      sourceRole: "conditionSearch",
    });
  }

  async startConditionSearchRealtime(broker, condition, handlers = {}, options = {}) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;
    let offRealtime = null;
    let realtimeSubscription = null;

    const conditionOptions = {
      ...options,
      condition: normalizeConditionInput(condition),
    };

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const { client, capabilities } = resolveClient(this.clients, normalizedBroker);

      if (!capabilities.supports(CONDITION_REALTIME_CAPABILITY_ID)) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          capabilityId: CONDITION_REALTIME_CAPABILITY_ID,
          error: BrokerError.unsupported(`${normalizedBroker} does not support ${CONDITION_REALTIME_CAPABILITY_ID}`, {
            broker: normalizedBroker,
            details: { capabilityId: CONDITION_REALTIME_CAPABILITY_ID },
          }),
        });
      }

      source = selectScannerSource(normalizedBroker, capabilities, CONDITION_REALTIME_CAPABILITY_ID, {
        ...conditionOptions,
        sourceTransport: conditionRequestTransport(normalizedBroker),
        sourceRole: normalizedBroker === "kiwoom" ? "realtimeStart" : "realtimeSession",
      });
      const result = await requestStartConditionSearchRealtime(client, normalizedBroker, source.id, conditionOptions);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          result,
          capabilityId: CONDITION_REALTIME_CAPABILITY_ID,
          error: result.error,
        });
      }

      const data = normalizeConditionSearchRealtimeSession(normalizedBroker, source.id, result.data, conditionOptions);
      const realtimeClient = resolveOptionalRealtimeClient(this.clients, normalizedBroker, options);
      const realtimeSource = findConditionRealtimeEventSource(capabilities);
      const realtimeOptions = {
        ...(options.realtimeOptions ?? {}),
        streamKind: "quote",
      };

      if (realtimeClient?.on && handlers.onMessage) {
        offRealtime = realtimeClient.on("realtime", (event) => {
          for (const message of normalizeConditionSearchRealtimeMessage(normalizedBroker, event.data)) {
            if (conditionRealtimeMatches(message, data)) {
              handlers.onMessage(message);
            }
          }
        });
      }

      if (normalizedBroker === "ls" && realtimeClient?.subscribe && realtimeSource && data.realtimeKey) {
        realtimeSubscription = await realtimeClient.subscribe(realtimeSource.id, data.realtimeKey, realtimeOptions);
      }

      const response = successResponse({
        broker: normalizedBroker,
        source,
        result,
        data,
        capabilityId: CONDITION_REALTIME_CAPABILITY_ID,
      });

      return {
        ...response,
        realtimeSubscription,
        unsubscribe: async () => {
          offRealtime?.();
          if (normalizedBroker === "ls" && realtimeClient?.unsubscribe && realtimeSource && data.realtimeKey) {
            await realtimeClient.unsubscribe(realtimeSource.id, data.realtimeKey, realtimeOptions);
          }

          return this.stopConditionSearchRealtime(normalizedBroker, data, options);
        },
      };
    } catch (error) {
      offRealtime?.();
      return failureResponse({
        broker: normalizedBroker || "unknown",
        source,
        capabilityId: CONDITION_REALTIME_CAPABILITY_ID,
        error,
      });
    }
  }

  async stopConditionSearchRealtime(broker, session, options = {}) {
    return this.requestScanner({
      broker,
      options: {
        ...options,
        condition: normalizeConditionInput(session),
      },
      capabilityId: CONDITION_REALTIME_CAPABILITY_ID,
      request: requestStopConditionSearchRealtime,
      normalize: normalizeConditionSearchRealtimeStop,
      sourceTransport: conditionRequestTransport(broker),
      sourceRole: String(broker ?? "").trim().toLowerCase() === "kiwoom" ? "realtimeStop" : "realtimeSession",
    });
  }

  async requestScanner({ broker, options, capabilityId, request, normalize, sourceTransport = "rest", sourceRole }) {
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

      source = selectScannerSource(normalizedBroker, capabilities, capabilityId, {
        ...options,
        sourceTransport,
        sourceRole,
      });
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
        data: normalize(normalizedBroker, source.id, result.data, options),
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

export function normalizeConditionSearchList(broker, sourceId, payload) {
  if (broker === "kiwoom") {
    return {
      broker,
      conditions: (Array.isArray(payload?.data) ? payload.data : []).map((row) => normalizeConditionListItem(broker, row)),
      summary: {
        count: Array.isArray(payload?.data) ? payload.data.length : 0,
        hasNext: payload?.cont_yn === "Y",
        nextKey: nullableString(payload?.next_key),
      },
      source: {
        broker,
        id: sourceId,
        capabilityId: CONDITION_LIST_CAPABILITY_ID,
      },
    };
  }

  if (broker === "ls") {
    const rows = Array.isArray(payload?.t1866OutBlock1) ? payload.t1866OutBlock1 : [];
    const summary = payload?.t1866OutBlock ?? {};

    return {
      broker,
      conditions: rows.map((row) => normalizeConditionListItem(broker, row)),
      summary: {
        count: parseNumber(firstValue(summary, ["result_count"])) ?? rows.length,
        hasNext: firstValue(summary, ["cont"]) === "1",
        nextKey: nullableString(firstValue(summary, ["cont_key", "contkey"])),
      },
      source: {
        broker,
        id: sourceId,
        capabilityId: CONDITION_LIST_CAPABILITY_ID,
      },
    };
  }

  throw BrokerError.unsupported(`Unsupported condition list normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeConditionSearchResult(broker, sourceId, payload, options = {}) {
  const condition = normalizeConditionInput(options.condition ?? payload);

  if (broker === "kiwoom") {
    const rows = Array.isArray(payload?.data) ? payload.data : [];

    return {
      broker,
      condition: {
        ...condition,
        id: condition.id ?? nullableString(payload?.seq),
        seq: condition.seq ?? nullableString(payload?.seq),
      },
      items: rows.map((row) => normalizeConditionSearchItem(broker, row)),
      summary: {
        count: rows.length,
        hasNext: payload?.cont_yn === "Y",
        nextKey: nullableString(payload?.next_key),
        message: nullableString(payload?.return_msg),
      },
      source: {
        broker,
        id: sourceId,
        capabilityId: CONDITION_SEARCH_CAPABILITY_ID,
      },
    };
  }

  if (broker === "ls") {
    const rows = Array.isArray(payload?.t1859OutBlock1) ? payload.t1859OutBlock1 : [];
    const summary = payload?.t1859OutBlock ?? {};

    return {
      broker,
      condition,
      items: rows.map((row) => normalizeConditionSearchItem(broker, row)),
      summary: {
        count: parseNumber(firstValue(summary, ["result_count"])) ?? rows.length,
        time: nullableString(firstValue(summary, ["result_time"])),
        text: nullableString(firstValue(summary, ["text"])),
        message: nullableString(payload?.rsp_msg),
      },
      source: {
        broker,
        id: sourceId,
        capabilityId: CONDITION_SEARCH_CAPABILITY_ID,
      },
    };
  }

  throw BrokerError.unsupported(`Unsupported condition search normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeConditionSearchRealtimeSession(broker, sourceId, payload, options = {}) {
  const condition = normalizeConditionInput(options.condition ?? payload);

  if (broker === "kiwoom") {
    const search = normalizeConditionSearchResult(broker, sourceId, payload, options);
    const realtimeKey = condition.seq ?? condition.id ?? nullableString(payload?.seq);

    return {
      broker,
      condition: search.condition,
      realtimeKey,
      status: payload?.return_code === 0 || payload?.return_code === "0" ? "started" : "unknown",
      message: nullableString(payload?.return_msg),
      initialItems: search.items,
      raw: payload,
    };
  }

  if (broker === "ls") {
    const block = payload?.t1860OutBlock ?? {};
    const realtimeKey = nullableString(firstValue(block, ["sAlertNum"]));

    return {
      broker,
      condition,
      realtimeKey,
      status: firstValue(block, ["sResultFlag"]) === "S" ? "started" : "unknown",
      resultFlag: nullableString(firstValue(block, ["sResultFlag"])),
      time: nullableString(firstValue(block, ["sTime"])),
      message: nullableString(firstValue(block, ["Msg"])),
      initialItems: [],
      raw: payload,
    };
  }

  throw BrokerError.unsupported(`Unsupported condition realtime session normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeConditionSearchRealtimeStop(broker, sourceId, payload, options = {}) {
  const condition = normalizeConditionInput(options.condition ?? payload);

  if (broker === "kiwoom") {
    return {
      broker,
      condition,
      realtimeKey: condition.realtimeKey ?? condition.seq ?? condition.id ?? nullableString(payload?.seq),
      status: payload?.return_code === 0 || payload?.return_code === "0" ? "stopped" : "unknown",
      message: nullableString(payload?.return_msg),
      raw: payload,
    };
  }

  if (broker === "ls") {
    const block = payload?.t1860OutBlock ?? {};

    return {
      broker,
      condition,
      realtimeKey: condition.realtimeKey ?? condition.alertKey ?? nullableString(firstValue(block, ["sAlertNum"])),
      status: firstValue(block, ["sResultFlag"]) === "S" ? "stopped" : "unknown",
      resultFlag: nullableString(firstValue(block, ["sResultFlag"])),
      time: nullableString(firstValue(block, ["sTime"])),
      message: nullableString(firstValue(block, ["Msg"])),
      raw: payload,
    };
  }

  throw BrokerError.unsupported(`Unsupported condition realtime stop normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeConditionSearchRealtimeMessage(broker, payload) {
  const normalizedBroker = assertBroker(String(broker ?? "").trim().toLowerCase());

  if (normalizedBroker === "kiwoom") {
    const rows = Array.isArray(payload?.data) ? payload.data : [];

    return rows
      .filter((row) => row?.type === "02" || row?.name === "조건검색")
      .map((row) => normalizeKiwoomConditionRealtimeMessage(row));
  }

  const header = payload?.header ?? {};
  const body = payload?.body ?? {};
  const id = nullableString(header.tr_cd ?? body.tr_cd);

  if (id !== "AFR" && !Object.hasOwn(body, "gsJobFlag")) {
    return [];
  }

  return [normalizeLsConditionRealtimeMessage(header, body, payload)];
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
  const requestedTransport = options.sourceTransport ?? "rest";
  const requestedRole = options.sourceRole;
  const sources = capabilities.findApis(capabilityId)
    .filter((api) => !requestedTransport || api.transport === requestedTransport)
    .filter((api) => !requestedRole || api.role === requestedRole);

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
    throw BrokerError.unsupported(`${broker} does not have a ${requestedTransport ?? "matching"} source for ${capabilityId}`, {
      broker,
      details: { capabilityId, requestedTransport, requestedRole },
    });
  }

  return source;
}

function findConditionRealtimeEventSource(capabilities) {
  return capabilities
    .findApis(CONDITION_REALTIME_CAPABILITY_ID)
    .find((api) => api.transport === "websocket" && api.role === "realtimeEvent");
}

function resolveOptionalRealtimeClient(clients, broker, options = {}) {
  return options.realtimeClient ?? clients[`${broker}Realtime`] ?? clients.realtime?.[broker] ?? null;
}

function conditionRequestTransport(broker) {
  return String(broker ?? "").trim().toLowerCase() === "kiwoom" ? "websocket" : "rest";
}

function conditionRealtimeMatches(message, session) {
  if (!session?.realtimeKey || !message.realtimeKey) {
    return true;
  }

  return String(message.realtimeKey) === String(session.realtimeKey);
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

async function requestConditionSearchList(client, broker, sourceId, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      trnm: "CNSRLST",
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        user_id: normalizeRequiredString(options.userId, "userId"),
        gb: options.scope ?? options.gb ?? "0",
        group_name: options.groupName ?? "",
        cont: options.cont ?? options.continuation?.continueFlag ?? "",
        cont_key: options.contKey ?? options.continuation?.nextKey ?? "",
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported condition list request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestConditionSearch(client, broker, sourceId, options) {
  const requestOptions = options.requestOptions ?? {};
  const condition = normalizeConditionInput(options.condition);

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      trnm: "CNSRREQ",
      seq: normalizeRequiredString(condition.seq ?? condition.id, "condition.seq"),
      search_type: options.searchType ?? "0",
      stex_tp: kiwoomConditionExchange(options.exchange),
      cont_yn: options.contYn ?? options.continuation?.continueFlag ?? "N",
      next_key: options.nextKey ?? options.continuation?.nextKey ?? "",
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        query_index: normalizeRequiredString(condition.queryIndex ?? condition.id, "condition.queryIndex"),
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported condition search request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestStartConditionSearchRealtime(client, broker, sourceId, options) {
  const requestOptions = options.requestOptions ?? {};
  const condition = normalizeConditionInput(options.condition);

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      trnm: "CNSRREQ",
      seq: normalizeRequiredString(condition.seq ?? condition.id, "condition.seq"),
      search_type: "1",
      stex_tp: kiwoomConditionExchange(options.exchange),
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        sSysUserFlag: options.userFlag ?? "U",
        sFlag: "E",
        sAlertNum: "",
        query_index: normalizeRequiredString(condition.queryIndex ?? condition.id, "condition.queryIndex"),
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported condition realtime start request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

async function requestStopConditionSearchRealtime(client, broker, sourceId, options) {
  const requestOptions = options.requestOptions ?? {};
  const condition = normalizeConditionInput(options.condition);

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      trnm: "CNSRCLR",
      seq: normalizeRequiredString(condition.seq ?? condition.id ?? condition.realtimeKey, "condition.seq"),
      ...(options.params ?? {}),
    }, requestOptions);
  }

  if (broker === "ls") {
    return client.request(sourceId, {
      [`${sourceId}InBlock`]: {
        sSysUserFlag: options.userFlag ?? "U",
        sFlag: "D",
        sAlertNum: normalizeRequiredString(
          condition.realtimeKey ?? condition.alertKey ?? condition.id,
          "condition.realtimeKey",
        ),
        query_index: condition.queryIndex ?? "",
        ...(options.params ?? {}),
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported condition realtime stop request broker: ${broker}`, {
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

function normalizeConditionListItem(broker, row) {
  if (broker === "kiwoom") {
    const seq = Array.isArray(row) ? row[0] : firstValue(row, ["seq", "id"]);
    const name = Array.isArray(row) ? row[1] : firstValue(row, ["name", "conditionName"]);

    return {
      id: nullableString(seq),
      seq: nullableString(seq),
      queryIndex: null,
      name: nullableString(name),
      groupName: null,
      raw: row,
    };
  }

  const queryIndex = firstValue(row, ["query_index", "queryIndex"]);

  return {
    id: nullableString(queryIndex),
    seq: null,
    queryIndex: nullableString(queryIndex),
    name: nullableString(firstValue(row, ["query_name", "queryName", "name"])),
    groupName: nullableString(firstValue(row, ["group_name", "groupName"])),
    raw: row,
  };
}

function normalizeConditionSearchItem(broker, row) {
  if (broker === "kiwoom") {
    return {
      symbol: normalizeSymbolCode(firstValue(row, ["9001", "jmcode", "stk_cd"])),
      name: nullableString(firstValue(row, ["302", "stk_nm", "name"])),
      price: parsePrice(firstValue(row, ["10", "cur_prc", "price"])),
      priceRaw: nullableString(firstValue(row, ["10", "cur_prc", "price"])),
      change: parseNumber(firstValue(row, ["11", "pred_pre", "change"])),
      changeRaw: nullableString(firstValue(row, ["11", "pred_pre", "change"])),
      changeRate: parseNumber(firstValue(row, ["12", "flu_rt", "diff"])),
      changeRateRaw: nullableString(firstValue(row, ["12", "flu_rt", "diff"])),
      sign: nullableString(firstValue(row, ["25", "pred_pre_sig", "sign"])),
      volume: parseNumber(firstValue(row, ["13", "trde_qty", "volume"])),
      volumeRaw: nullableString(firstValue(row, ["13", "trde_qty", "volume"])),
      open: parsePrice(firstValue(row, ["16", "open"])),
      high: parsePrice(firstValue(row, ["17", "high"])),
      low: parsePrice(firstValue(row, ["18", "low"])),
      raw: row,
    };
  }

  return {
    symbol: normalizeSymbolCode(firstValue(row, ["shcode", "gsCode"])),
    name: nullableString(firstValue(row, ["hname", "gshname"])),
    price: parsePrice(firstValue(row, ["price", "gsPrice"])),
    priceRaw: nullableString(firstValue(row, ["price", "gsPrice"])),
    change: parseNumber(firstValue(row, ["change", "gsChange"])),
    changeRaw: nullableString(firstValue(row, ["change", "gsChange"])),
    changeRate: parseNumber(firstValue(row, ["diff", "gsChgRate"])),
    changeRateRaw: nullableString(firstValue(row, ["diff", "gsChgRate"])),
    sign: nullableString(firstValue(row, ["sign", "gsSign"])),
    volume: parseNumber(firstValue(row, ["volume", "gsVolume"])),
    volumeRaw: nullableString(firstValue(row, ["volume", "gsVolume"])),
    open: null,
    high: null,
    low: null,
    raw: row,
  };
}

function normalizeKiwoomConditionRealtimeMessage(row) {
  const body = row?.values ?? {};
  const eventCode = nullableString(firstValue(body, ["843"]));

  return {
    broker: "kiwoom",
    id: nullableString(row?.type),
    kind: "conditionSearchEvent",
    key: nullableString(row?.item),
    realtimeKey: nullableString(firstValue(body, ["841"])),
    conditionId: nullableString(firstValue(body, ["841"])),
    symbol: normalizeSymbolCode(firstValue(body, ["9001"]) ?? row?.item),
    eventCode,
    eventType: kiwoomConditionEventType(eventCode),
    time: nullableString(firstValue(body, ["20"])),
    side: conditionSide(firstValue(body, ["907"])),
    raw: row,
  };
}

function normalizeLsConditionRealtimeMessage(header, body, raw) {
  const eventCode = nullableString(firstValue(body, ["gsJobFlag"]));

  return {
    broker: "ls",
    id: "AFR",
    kind: "conditionSearchEvent",
    key: nullableString(header.tr_key),
    realtimeKey: nullableString(header.tr_key),
    conditionId: nullableString(header.tr_key),
    symbol: normalizeSymbolCode(firstValue(body, ["gsCode"])),
    name: nullableString(firstValue(body, ["gshname"])),
    price: parsePrice(firstValue(body, ["gsPrice"])),
    priceRaw: nullableString(firstValue(body, ["gsPrice"])),
    change: parseNumber(firstValue(body, ["gsChange"])),
    changeRaw: nullableString(firstValue(body, ["gsChange"])),
    changeRate: parseNumber(firstValue(body, ["gsChgRate"])),
    changeRateRaw: nullableString(firstValue(body, ["gsChgRate"])),
    sign: nullableString(firstValue(body, ["gsSign"])),
    volume: parseNumber(firstValue(body, ["gsVolume"])),
    volumeRaw: nullableString(firstValue(body, ["gsVolume"])),
    eventCode,
    eventType: lsConditionEventType(eventCode),
    raw,
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

function kiwoomConditionExchange(exchange) {
  if (exchange === "krx") {
    return "K";
  }

  if (exchange === "nxt") {
    return "N";
  }

  return exchange ?? "K";
}

function normalizeConditionInput(value) {
  if (value && typeof value === "object") {
    const nestedCondition = value.condition && typeof value.condition === "object"
      ? normalizeConditionInput(value.condition)
      : {};
    const id = nullableString(firstValue(value, [
      "id",
      "seq",
      "queryIndex",
      "query_index",
      "realtimeKey",
      "alertKey",
      "sAlertNum",
    ]));

    return {
      id: id ?? nestedCondition.id ?? null,
      seq: nullableString(firstValue(value, ["seq"])) ?? nestedCondition.seq ?? null,
      queryIndex: nullableString(firstValue(value, ["queryIndex", "query_index"])) ?? nestedCondition.queryIndex ?? null,
      realtimeKey: nullableString(firstValue(value, ["realtimeKey", "alertKey", "sAlertNum"])) ?? nestedCondition.realtimeKey ?? null,
      alertKey: nullableString(firstValue(value, ["alertKey", "sAlertNum"])) ?? nestedCondition.alertKey ?? null,
      name: nullableString(firstValue(value, ["name", "queryName", "query_name"])) ?? nestedCondition.name ?? null,
      groupName: nullableString(firstValue(value, ["groupName", "group_name"])) ?? nestedCondition.groupName ?? null,
    };
  }

  const id = nullableString(value);

  return {
    id,
    seq: id,
    queryIndex: id,
    realtimeKey: id,
    alertKey: id,
    name: null,
    groupName: null,
  };
}

function kiwoomConditionEventType(code) {
  if (code === "I") {
    return "entered";
  }

  if (code === "D" || code === "O") {
    return "exited";
  }

  return null;
}

function lsConditionEventType(code) {
  if (code === "N") {
    return "entered";
  }

  if (code === "R") {
    return "reentered";
  }

  if (code === "O") {
    return "exited";
  }

  return null;
}

function conditionSide(code) {
  if (code === "1") {
    return "sell";
  }

  if (code === "2") {
    return "buy";
  }

  return null;
}

function normalizeRequiredString(value, field) {
  const normalized = nullableString(value)?.trim();
  if (!normalized) {
    throw BrokerError.validation(`${field} is required`, {
      details: { field },
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
