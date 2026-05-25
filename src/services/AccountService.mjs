import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const CASH_CAPABILITY_ID = "account.domesticStock.cash";
const BALANCE_CAPABILITY_ID = "account.domesticStock.balance";
const ORDER_HISTORY_CAPABILITY_ID = "account.domesticStock.orderHistory";

export class AccountService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getDomesticStockCash(broker, options = {}) {
    return this.#requestAccount({
      broker,
      options,
      capabilityId: CASH_CAPABILITY_ID,
      request: requestCash,
      normalize: normalizeDomesticStockCash,
    });
  }

  async getDomesticStockBalance(broker, options = {}) {
    return this.#requestAccount({
      broker,
      options,
      capabilityId: BALANCE_CAPABILITY_ID,
      request: requestBalance,
      normalize: normalizeDomesticStockBalance,
    });
  }

  async getDomesticStockOrderHistory(broker, options = {}) {
    return this.#requestAccount({
      broker,
      options,
      capabilityId: ORDER_HISTORY_CAPABILITY_ID,
      request: requestOrderHistory,
      normalize: normalizeDomesticStockOrderHistory,
    });
  }

  async #requestAccount({ broker, options, capabilityId, request, normalize }) {
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

      source = selectAccountSource(normalizedBroker, capabilities, capabilityId, options);
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
        capabilityId,
        data: normalize(normalizedBroker, source.id, result.data),
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

export function normalizeDomesticStockCash(broker, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomCash(sourceId, payload);
  }

  if (broker === "ls") {
    return normalizeLsCash(sourceId, payload);
  }

  if (broker === "db") {
    return normalizeDbCash(sourceId, payload);
  }

  if (broker === "kis") {
    return normalizeKisCash(sourceId, payload);
  }

  throw BrokerError.unsupported(`Unsupported cash normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticStockBalance(broker, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomBalance(sourceId, payload);
  }

  if (broker === "ls") {
    return normalizeLsBalance(sourceId, payload);
  }

  if (broker === "db") {
    return normalizeDbBalance(sourceId, payload);
  }

  if (broker === "kis") {
    return normalizeKisBalance(sourceId, payload);
  }

  throw BrokerError.unsupported(`Unsupported balance normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}

export function normalizeDomesticStockOrderHistory(broker, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomOrderHistory(sourceId, payload);
  }

  if (broker === "ls") {
    return normalizeLsOrderHistory(sourceId, payload);
  }

  if (broker === "db") {
    return normalizeDbOrderHistory(sourceId, payload);
  }

  if (broker === "kis") {
    return normalizeKisOrderHistory(sourceId, payload);
  }

  throw BrokerError.unsupported(`Unsupported order history normalization broker: ${broker}`, {
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

function selectAccountSource(broker, capabilities, capabilityId, options) {
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
  if (capabilityId === CASH_CAPABILITY_ID) {
    if (broker === "kiwoom") return "kt00001";
    if (broker === "ls") return "CSPAQ12200";
    if (broker === "db") return "CDPCQ00100";
    if (broker === "kis") return "/uapi/domestic-stock/v1/trading/inquire-psbl-order";
  }

  if (capabilityId === BALANCE_CAPABILITY_ID) {
    if (broker === "kiwoom") return "kt00018";
    if (broker === "ls") return "t0424";
    if (broker === "db") return "CSPAQ03420";
    if (broker === "kis") return "/uapi/domestic-stock/v1/trading/inquire-balance";
  }

  if (capabilityId === ORDER_HISTORY_CAPABILITY_ID) {
    if (broker === "kiwoom") return "kt00007";
    if (broker === "ls") return "CSPAQ13700";
    if (broker === "db") return "CSPAQ04800";
    if (broker === "kis") return "/uapi/domestic-stock/v1/trading/inquire-daily-ccld";
  }

  return null;
}

async function requestCash(client, broker, sourceId, options) {
  const params = mergeParams(defaultCashParams(broker, sourceId, options), options.params);
  return client.request(sourceId, params, options.requestOptions ?? {});
}

async function requestBalance(client, broker, sourceId, options) {
  const params = mergeParams(defaultBalanceParams(broker, sourceId, options), options.params);
  return client.request(sourceId, params, options.requestOptions ?? {});
}

async function requestOrderHistory(client, broker, sourceId, options) {
  const params = mergeParams(defaultOrderHistoryParams(broker, sourceId, options), options.params);
  return client.request(sourceId, params, options.requestOptions ?? {});
}

function defaultCashParams(broker, sourceId, options = {}) {
  if (broker === "kiwoom") {
    return { qry_tp: "3" };
  }

  if (broker === "ls" && sourceId === "CSPAQ12200") {
    return { CSPAQ12200InBlock1: { BalCreTp: "0" } };
  }

  if (broker === "ls") {
    return { [`${sourceId}InBlock1`]: {} };
  }

  if (broker === "db") {
    return {};
  }

  if (broker === "kis") {
    return {
      ...kisAccountParams(options),
      PDNO: "",
      ORD_UNPR: "",
      ORD_DVSN: "00",
      CMA_EVLU_AMT_ICLD_YN: "N",
      OVRS_ICLD_YN: "N",
    };
  }

  return {};
}

function defaultBalanceParams(broker, sourceId, options = {}) {
  if (broker === "kiwoom") {
    return {
      qry_tp: "1",
      dmst_stex_tp: "KRX",
    };
  }

  if (broker === "ls" && sourceId === "t0424") {
    return {
      t0424InBlock: {
        prcgb: "1",
        chegb: "2",
        dangb: "0",
        charge: "1",
        cts_expcode: "",
      },
    };
  }

  if (broker === "ls") {
    return { [`${sourceId}InBlock1`]: {} };
  }

  if (broker === "db" && sourceId === "CSPAQ03420") {
    return { In: { QryTpCode0: "1" } };
  }

  if (broker === "db") {
    return { In: {} };
  }

  if (broker === "kis") {
    return {
      ...kisAccountParams(options),
      AFHR_FLPR_YN: "N",
      OFL_YN: "",
      INQR_DVSN: "02",
      UNPR_DVSN: "01",
      FUND_STTL_ICLD_YN: "N",
      FNCG_AMT_AUTO_RDPT_YN: "N",
      PRCS_DVSN: "01",
      CTX_AREA_FK100: "",
      CTX_AREA_NK100: "",
    };
  }

  return {};
}

function defaultOrderHistoryParams(broker, sourceId, options) {
  const symbol = normalizeOptionalSymbol(options.symbol);
  const orderDate = normalizeOptionalOrderDate(options.orderDate, options.now);

  if (broker === "kiwoom") {
    return {
      ord_dt: orderDate ?? "",
      qry_tp: "1",
      stk_bond_tp: "0",
      sell_tp: "0",
      stk_cd: symbol ?? "",
      fr_ord_no: "",
      dmst_stex_tp: "%",
    };
  }

  if (broker === "ls" && sourceId === "CSPAQ13700") {
    return {
      CSPAQ13700InBlock1: {
        OrdMktCode: "00",
        BnsTpCode: "0",
        IsuNo: symbol ? `A${symbol}` : "",
        ExecYn: "0",
        OrdDt: orderDate ?? formatYmd(new Date()),
        SrtOrdNo2: 0,
        BkseqTpCode: "0",
        OrdPtnCode: "00",
      },
    };
  }

  if (broker === "ls") {
    return { [`${sourceId}InBlock1`]: {} };
  }

  if (broker === "db" && sourceId === "CSPAQ04800") {
    return {
      In: {
        SorTpYn: "0",
        ExecYn: "0",
        TrdMktCode: "00",
        BnsTpCode: "0",
        IsuTpCode: "0",
        QryTp: "0",
      },
    };
  }

  if (broker === "kis") {
    return {
      ...kisAccountParams(options),
      INQR_STRT_DT: orderDate ?? formatYmd(new Date()),
      INQR_END_DT: orderDate ?? formatYmd(new Date()),
      SLL_BUY_DVSN_CD: "00",
      INQR_DVSN: "00",
      PDNO: symbol ?? "",
      CCLD_DVSN: "00",
      ORD_GNO_BRNO: "",
      ODNO: "",
      INQR_DVSN_3: "00",
      INQR_DVSN_1: "",
      CTX_AREA_FK100: "",
      CTX_AREA_NK100: "",
    };
  }

  return {};
}

function kisAccountParams(input = {}) {
  return {
    CANO: normalizeOptionalRequestString(input.accountNumber, ""),
    ACNT_PRDT_CD: normalizeOptionalRequestString(input.accountProductCode, "01"),
  };
}

function normalizeKiwoomCash(sourceId, payload) {
  return {
    broker: "kiwoom",
    summary: {
      deposit: accountNumber(firstValue(payload, ["entr"])),
      depositRaw: nullableString(firstValue(payload, ["entr"])),
      substituteAmount: accountNumber(firstValue(payload, ["repl_amt"])),
      substituteAmountRaw: nullableString(firstValue(payload, ["repl_amt"])),
      withdrawableAmount: accountNumber(firstValue(payload, ["pymn_alow_amt"])),
      withdrawableAmountRaw: nullableString(firstValue(payload, ["pymn_alow_amt"])),
      orderableAmount: accountNumber(firstValue(payload, ["ord_alow_amt"])),
      orderableAmountRaw: nullableString(firstValue(payload, ["ord_alow_amt"])),
      d1Deposit: accountNumber(firstValue(payload, ["d1_entra"])),
      d1DepositRaw: nullableString(firstValue(payload, ["d1_entra"])),
      d2Deposit: accountNumber(firstValue(payload, ["d2_entra"])),
      d2DepositRaw: nullableString(firstValue(payload, ["d2_entra"])),
    },
    currency: "KRW",
    source: {
      broker: "kiwoom",
      id: sourceId,
      capabilityId: CASH_CAPABILITY_ID,
    },
  };
}

function normalizeLsCash(sourceId, payload) {
  const block = payload?.[`${sourceId}OutBlock2`] ?? payload?.CSPAQ12200OutBlock2 ?? payload;

  return {
    broker: "ls",
    summary: {
      deposit: accountNumber(firstValue(block, ["Dps"])),
      depositRaw: nullableString(firstValue(block, ["Dps"])),
      withdrawableAmount: accountNumber(firstValue(block, ["MnyoutAbleAmt"])),
      withdrawableAmountRaw: nullableString(firstValue(block, ["MnyoutAbleAmt"])),
      orderableAmount: accountNumber(firstValue(block, ["MnyOrdAbleAmt"])),
      orderableAmountRaw: nullableString(firstValue(block, ["MnyOrdAbleAmt"])),
      valuationAmount: accountNumber(firstValue(block, ["BalEvalAmt"])),
      valuationAmountRaw: nullableString(firstValue(block, ["BalEvalAmt"])),
      totalAssetAmount: accountNumber(firstValue(block, ["DpsastTotamt"])),
      totalAssetAmountRaw: nullableString(firstValue(block, ["DpsastTotamt"])),
      d1Deposit: accountNumber(firstValue(block, ["D1Dps"])),
      d1DepositRaw: nullableString(firstValue(block, ["D1Dps"])),
      d2Deposit: accountNumber(firstValue(block, ["D2Dps"])),
      d2DepositRaw: nullableString(firstValue(block, ["D2Dps"])),
    },
    currency: "KRW",
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: CASH_CAPABILITY_ID,
    },
  };
}

function normalizeDbCash(sourceId, payload) {
  const block = payload?.Out1 ?? payload?.Out ?? payload;

  return {
    broker: "db",
    summary: {
      deposit: accountNumber(firstValue(block, ["DpsBalAmt", "Dps"])),
      depositRaw: nullableString(firstValue(block, ["DpsBalAmt", "Dps"])),
      withdrawableAmount: accountNumber(firstValue(block, ["WthdwAbleAmt", "MnyoutAbleAmt"])),
      withdrawableAmountRaw: nullableString(firstValue(block, ["WthdwAbleAmt", "MnyoutAbleAmt"])),
      orderableAmount: accountNumber(firstValue(block, ["OrdAbleAmt", "MnyOrdAbleAmt"])),
      orderableAmountRaw: nullableString(firstValue(block, ["OrdAbleAmt", "MnyOrdAbleAmt"])),
      substituteAmount: accountNumber(firstValue(block, ["SubstAmt"])),
      substituteAmountRaw: nullableString(firstValue(block, ["SubstAmt"])),
    },
    currency: "KRW",
    source: {
      broker: "db",
      id: sourceId,
      capabilityId: CASH_CAPABILITY_ID,
    },
  };
}

function normalizeKisCash(sourceId, payload) {
  const block = payload?.output ?? payload;

  return {
    broker: "kis",
    summary: {
      deposit: accountNumber(firstValue(block, ["dnca_tot_amt"])),
      depositRaw: nullableString(firstValue(block, ["dnca_tot_amt"])),
      withdrawableAmount: accountNumber(firstValue(block, ["ord_psbl_cash"])),
      withdrawableAmountRaw: nullableString(firstValue(block, ["ord_psbl_cash"])),
      orderableAmount: accountNumber(firstValue(block, ["ord_psbl_cash"])),
      orderableAmountRaw: nullableString(firstValue(block, ["ord_psbl_cash"])),
      nrcvbBuyAmount: accountNumber(firstValue(block, ["nrcvb_buy_amt"])),
      nrcvbBuyAmountRaw: nullableString(firstValue(block, ["nrcvb_buy_amt"])),
    },
    currency: "KRW",
    source: {
      broker: "kis",
      id: sourceId,
      capabilityId: CASH_CAPABILITY_ID,
    },
  };
}

function normalizeKiwoomBalance(sourceId, payload) {
  const rows = Array.isArray(payload?.acnt_evlt_remn_indv_tot) ? payload.acnt_evlt_remn_indv_tot : [];

  return {
    broker: "kiwoom",
    summary: {
      purchaseAmount: accountNumber(firstValue(payload, ["tot_pur_amt"])),
      purchaseAmountRaw: nullableString(firstValue(payload, ["tot_pur_amt"])),
      valuationAmount: accountNumber(firstValue(payload, ["tot_evlt_amt"])),
      valuationAmountRaw: nullableString(firstValue(payload, ["tot_evlt_amt"])),
      profitLoss: accountNumber(firstValue(payload, ["tot_evlt_pl"])),
      profitLossRaw: nullableString(firstValue(payload, ["tot_evlt_pl"])),
      profitRate: parseNumber(firstValue(payload, ["tot_prft_rt"])),
      profitRateRaw: nullableString(firstValue(payload, ["tot_prft_rt"])),
      estimatedDepositAssetAmount: accountNumber(firstValue(payload, ["prsm_dpst_aset_amt"])),
      estimatedDepositAssetAmountRaw: nullableString(firstValue(payload, ["prsm_dpst_aset_amt"])),
    },
    positions: rows.map((row) => normalizeKiwoomPosition(row)),
    currency: "KRW",
    source: {
      broker: "kiwoom",
      id: sourceId,
      capabilityId: BALANCE_CAPABILITY_ID,
    },
  };
}

function normalizeLsBalance(sourceId, payload) {
  const block = payload?.[`${sourceId}OutBlock`] ?? payload?.t0424OutBlock ?? {};
  const rows = payload?.[`${sourceId}OutBlock1`] ?? payload?.t0424OutBlock1 ?? [];

  return {
    broker: "ls",
    summary: {
      estimatedAssetAmount: accountNumber(firstValue(block, ["sunamt", "sunamt1"])),
      estimatedAssetAmountRaw: nullableString(firstValue(block, ["sunamt", "sunamt1"])),
      purchaseAmount: accountNumber(firstValue(block, ["mamt"])),
      purchaseAmountRaw: nullableString(firstValue(block, ["mamt"])),
      valuationAmount: accountNumber(firstValue(block, ["tappamt"])),
      valuationAmountRaw: nullableString(firstValue(block, ["tappamt"])),
      profitLoss: accountNumber(firstValue(block, ["tdtsunik", "dtsunik"])),
      profitLossRaw: nullableString(firstValue(block, ["tdtsunik", "dtsunik"])),
      nextKey: nullableString(firstValue(block, ["cts_expcode"])),
    },
    positions: (Array.isArray(rows) ? rows : []).map((row) => normalizeLsPosition(row)),
    currency: "KRW",
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: BALANCE_CAPABILITY_ID,
    },
  };
}

function normalizeDbBalance(sourceId, payload) {
  const block = payload?.Out ?? {};
  const rows = payload?.Out1 ?? [];

  return {
    broker: "db",
    summary: {
      purchaseAmount: accountNumber(firstValue(block, ["TotBuyAmt"])),
      purchaseAmountRaw: nullableString(firstValue(block, ["TotBuyAmt"])),
      valuationAmount: accountNumber(firstValue(block, ["TotEvalAmt"])),
      valuationAmountRaw: nullableString(firstValue(block, ["TotEvalAmt"])),
      profitLoss: accountNumber(firstValue(block, ["TotEvalPnlAmt"])),
      profitLossRaw: nullableString(firstValue(block, ["TotEvalPnlAmt"])),
      profitRate: parseNumber(firstValue(block, ["TotErnrat"])),
      profitRateRaw: nullableString(firstValue(block, ["TotErnrat"])),
      estimatedAssetAmount: accountNumber(firstValue(block, ["DpsastAmt"])),
      estimatedAssetAmountRaw: nullableString(firstValue(block, ["DpsastAmt"])),
    },
    positions: (Array.isArray(rows) ? rows : []).map((row) => normalizeDbPosition(row)),
    currency: "KRW",
    source: {
      broker: "db",
      id: sourceId,
      capabilityId: BALANCE_CAPABILITY_ID,
    },
  };
}

function normalizeKisBalance(sourceId, payload) {
  const rows = payload?.output1 ?? [];
  const summary = payload?.output2?.[0] ?? payload?.output2 ?? {};

  return {
    broker: "kis",
    summary: {
      purchaseAmount: accountNumber(firstValue(summary, ["pchs_amt_smtl_amt"])),
      purchaseAmountRaw: nullableString(firstValue(summary, ["pchs_amt_smtl_amt"])),
      valuationAmount: accountNumber(firstValue(summary, ["evlu_amt_smtl_amt"])),
      valuationAmountRaw: nullableString(firstValue(summary, ["evlu_amt_smtl_amt"])),
      profitLoss: accountNumber(firstValue(summary, ["evlu_pfls_smtl_amt"])),
      profitLossRaw: nullableString(firstValue(summary, ["evlu_pfls_smtl_amt"])),
      totalAssetAmount: accountNumber(firstValue(summary, ["tot_evlu_amt"])),
      totalAssetAmountRaw: nullableString(firstValue(summary, ["tot_evlu_amt"])),
    },
    positions: (Array.isArray(rows) ? rows : []).map((row) => normalizeKisPosition(row)),
    currency: "KRW",
    source: {
      broker: "kis",
      id: sourceId,
      capabilityId: BALANCE_CAPABILITY_ID,
    },
  };
}

function normalizeKiwoomOrderHistory(sourceId, payload) {
  const rows = Array.isArray(payload?.acnt_ord_cntr_prps_dtl)
    ? payload.acnt_ord_cntr_prps_dtl
    : Array.isArray(payload?.acnt_ord_cntr_prst_array)
      ? payload.acnt_ord_cntr_prst_array
      : [];

  return {
    broker: "kiwoom",
    summary: {
      sellEstimatedAmount: accountNumber(firstValue(payload, ["sell_grntl_engg_amt"])),
      sellEstimatedAmountRaw: nullableString(firstValue(payload, ["sell_grntl_engg_amt"])),
      buyEstimatedAmount: accountNumber(firstValue(payload, ["buy_engg_amt"])),
      buyEstimatedAmountRaw: nullableString(firstValue(payload, ["buy_engg_amt"])),
      estimatedAmount: accountNumber(firstValue(payload, ["engg_amt"])),
      estimatedAmountRaw: nullableString(firstValue(payload, ["engg_amt"])),
      count: rows.length,
    },
    orders: rows.map((row) => normalizeKiwoomOrderHistoryRow(row)),
    currency: "KRW",
    source: {
      broker: "kiwoom",
      id: sourceId,
      capabilityId: ORDER_HISTORY_CAPABILITY_ID,
    },
  };
}

function normalizeLsOrderHistory(sourceId, payload) {
  const summaryBlock = payload?.[`${sourceId}OutBlock2`] ?? payload?.CSPAQ13700OutBlock2 ?? {};
  const rows = payload?.[`${sourceId}OutBlock3`] ?? payload?.CSPAQ13700OutBlock3 ?? [];

  return {
    broker: "ls",
    summary: {
      recordCount: accountNumber(firstValue(summaryBlock, ["RecCnt"])),
      recordCountRaw: nullableString(firstValue(summaryBlock, ["RecCnt"])),
      buyOrderQuantity: accountNumber(firstValue(summaryBlock, ["BuyOrdQty"])),
      buyOrderQuantityRaw: nullableString(firstValue(summaryBlock, ["BuyOrdQty"])),
      sellOrderQuantity: accountNumber(firstValue(summaryBlock, ["SellOrdQty"])),
      sellOrderQuantityRaw: nullableString(firstValue(summaryBlock, ["SellOrdQty"])),
      buyExecutedQuantity: accountNumber(firstValue(summaryBlock, ["BuyExecQty"])),
      buyExecutedQuantityRaw: nullableString(firstValue(summaryBlock, ["BuyExecQty"])),
      sellExecutedQuantity: accountNumber(firstValue(summaryBlock, ["SellExecQty"])),
      sellExecutedQuantityRaw: nullableString(firstValue(summaryBlock, ["SellExecQty"])),
      buyExecutedAmount: accountNumber(firstValue(summaryBlock, ["BuyExecAmt"])),
      buyExecutedAmountRaw: nullableString(firstValue(summaryBlock, ["BuyExecAmt"])),
      sellExecutedAmount: accountNumber(firstValue(summaryBlock, ["SellExecAmt"])),
      sellExecutedAmountRaw: nullableString(firstValue(summaryBlock, ["SellExecAmt"])),
      count: Array.isArray(rows) ? rows.length : 0,
    },
    orders: (Array.isArray(rows) ? rows : []).map((row) => normalizeLsOrderHistoryRow(row)),
    currency: "KRW",
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: ORDER_HISTORY_CAPABILITY_ID,
    },
  };
}

function normalizeDbOrderHistory(sourceId, payload) {
  const rows = payload?.Out1 ?? payload?.Out ?? [];

  return {
    broker: "db",
    summary: {
      count: Array.isArray(rows) ? rows.length : 0,
    },
    orders: (Array.isArray(rows) ? rows : []).map((row) => normalizeDbOrderHistoryRow(row)),
    currency: "KRW",
    source: {
      broker: "db",
      id: sourceId,
      capabilityId: ORDER_HISTORY_CAPABILITY_ID,
    },
  };
}

function normalizeKisOrderHistory(sourceId, payload) {
  const rows = payload?.output1 ?? [];
  const summary = payload?.output2?.[0] ?? payload?.output2 ?? {};

  return {
    broker: "kis",
    summary: {
      buyOrderQuantity: accountNumber(firstValue(summary, ["tot_ccld_qty", "buy_qty"])),
      buyOrderQuantityRaw: nullableString(firstValue(summary, ["tot_ccld_qty", "buy_qty"])),
      buyExecutedAmount: accountNumber(firstValue(summary, ["tot_ccld_amt"])),
      buyExecutedAmountRaw: nullableString(firstValue(summary, ["tot_ccld_amt"])),
      count: Array.isArray(rows) ? rows.length : 0,
    },
    orders: (Array.isArray(rows) ? rows : []).map((row) => normalizeKisOrderHistoryRow(row)),
    currency: "KRW",
    source: {
      broker: "kis",
      id: sourceId,
      capabilityId: ORDER_HISTORY_CAPABILITY_ID,
    },
  };
}

function normalizeKiwoomPosition(row) {
  const symbol = nullableString(firstValue(row, ["stk_cd"]));

  return {
    symbol: stripKiwoomSymbol(symbol),
    symbolRaw: symbol,
    name: nullableString(firstValue(row, ["stk_nm"])),
    quantity: accountNumber(firstValue(row, ["rmnd_qty"])),
    quantityRaw: nullableString(firstValue(row, ["rmnd_qty"])),
    tradableQuantity: accountNumber(firstValue(row, ["trde_able_qty"])),
    tradableQuantityRaw: nullableString(firstValue(row, ["trde_able_qty"])),
    averagePrice: accountNumber(firstValue(row, ["pur_pric"])),
    averagePriceRaw: nullableString(firstValue(row, ["pur_pric"])),
    currentPrice: accountNumber(firstValue(row, ["cur_prc"])),
    currentPriceRaw: nullableString(firstValue(row, ["cur_prc"])),
    purchaseAmount: accountNumber(firstValue(row, ["pur_amt"])),
    purchaseAmountRaw: nullableString(firstValue(row, ["pur_amt"])),
    valuationAmount: accountNumber(firstValue(row, ["evlt_amt"])),
    valuationAmountRaw: nullableString(firstValue(row, ["evlt_amt"])),
    profitLoss: accountNumber(firstValue(row, ["evltv_prft"])),
    profitLossRaw: nullableString(firstValue(row, ["evltv_prft"])),
    profitRate: parseNumber(firstValue(row, ["prft_rt"])),
    profitRateRaw: nullableString(firstValue(row, ["prft_rt"])),
  };
}

function normalizeLsPosition(row) {
  return {
    symbol: nullableString(firstValue(row, ["expcode"])),
    symbolRaw: nullableString(firstValue(row, ["expcode"])),
    name: nullableString(firstValue(row, ["hname"])),
    quantity: accountNumber(firstValue(row, ["janqty"])),
    quantityRaw: nullableString(firstValue(row, ["janqty"])),
    tradableQuantity: accountNumber(firstValue(row, ["mdposqt"])),
    tradableQuantityRaw: nullableString(firstValue(row, ["mdposqt"])),
    averagePrice: accountNumber(firstValue(row, ["pamt"])),
    averagePriceRaw: nullableString(firstValue(row, ["pamt"])),
    currentPrice: accountNumber(firstValue(row, ["price"])),
    currentPriceRaw: nullableString(firstValue(row, ["price"])),
    purchaseAmount: accountNumber(firstValue(row, ["mamt"])),
    purchaseAmountRaw: nullableString(firstValue(row, ["mamt"])),
    valuationAmount: accountNumber(firstValue(row, ["appamt"])),
    valuationAmountRaw: nullableString(firstValue(row, ["appamt"])),
    profitLoss: accountNumber(firstValue(row, ["dtsunik"])),
    profitLossRaw: nullableString(firstValue(row, ["dtsunik"])),
    profitRate: parseNumber(firstValue(row, ["sunikrt"])),
    profitRateRaw: nullableString(firstValue(row, ["sunikrt"])),
  };
}

function normalizeDbPosition(row) {
  const issueNumber = nullableString(firstValue(row, ["IsuNo", "ShtnIsuNo"]));

  return {
    symbol: stripLsIssueNumber(issueNumber),
    symbolRaw: issueNumber,
    name: nullableString(firstValue(row, ["IsuNm"])),
    quantity: accountNumber(firstValue(row, ["BalQty", "BalQty0"])),
    quantityRaw: nullableString(firstValue(row, ["BalQty", "BalQty0"])),
    tradableQuantity: accountNumber(firstValue(row, ["AbleQty"])),
    tradableQuantityRaw: nullableString(firstValue(row, ["AbleQty"])),
    averagePrice: accountNumber(firstValue(row, ["ExecPrc", "AvrPrc"])),
    averagePriceRaw: nullableString(firstValue(row, ["ExecPrc", "AvrPrc"])),
    currentPrice: accountNumber(firstValue(row, ["NowPrc", "Prpr"])),
    currentPriceRaw: nullableString(firstValue(row, ["NowPrc", "Prpr"])),
    purchaseAmount: accountNumber(firstValue(row, ["BuyAmt", "PchsAmt"])),
    purchaseAmountRaw: nullableString(firstValue(row, ["BuyAmt", "PchsAmt"])),
    valuationAmount: accountNumber(firstValue(row, ["EvalAmt"])),
    valuationAmountRaw: nullableString(firstValue(row, ["EvalAmt"])),
    profitLoss: accountNumber(firstValue(row, ["EvalPnlAmt"])),
    profitLossRaw: nullableString(firstValue(row, ["EvalPnlAmt"])),
    profitRate: parseNumber(firstValue(row, ["Ernrat"])),
    profitRateRaw: nullableString(firstValue(row, ["Ernrat"])),
  };
}

function normalizeKisPosition(row) {
  return {
    symbol: nullableString(firstValue(row, ["pdno"])),
    symbolRaw: nullableString(firstValue(row, ["pdno"])),
    name: nullableString(firstValue(row, ["prdt_name"])),
    quantity: accountNumber(firstValue(row, ["hldg_qty"])),
    quantityRaw: nullableString(firstValue(row, ["hldg_qty"])),
    tradableQuantity: accountNumber(firstValue(row, ["ord_psbl_qty"])),
    tradableQuantityRaw: nullableString(firstValue(row, ["ord_psbl_qty"])),
    averagePrice: accountNumber(firstValue(row, ["pchs_avg_pric"])),
    averagePriceRaw: nullableString(firstValue(row, ["pchs_avg_pric"])),
    currentPrice: accountNumber(firstValue(row, ["prpr"])),
    currentPriceRaw: nullableString(firstValue(row, ["prpr"])),
    purchaseAmount: accountNumber(firstValue(row, ["pchs_amt"])),
    purchaseAmountRaw: nullableString(firstValue(row, ["pchs_amt"])),
    valuationAmount: accountNumber(firstValue(row, ["evlu_amt"])),
    valuationAmountRaw: nullableString(firstValue(row, ["evlu_amt"])),
    profitLoss: accountNumber(firstValue(row, ["evlu_pfls_amt"])),
    profitLossRaw: nullableString(firstValue(row, ["evlu_pfls_amt"])),
    profitRate: parseNumber(firstValue(row, ["evlu_pfls_rt"])),
    profitRateRaw: nullableString(firstValue(row, ["evlu_pfls_rt"])),
  };
}

function normalizeKiwoomOrderHistoryRow(row) {
  const symbol = nullableString(firstValue(row, ["stk_cd"]));
  const side = inferOrderSide(firstValue(row, ["io_tp_nm"]));

  return {
    orderNumber: nullableString(firstValue(row, ["ord_no"])),
    originalOrderNumber: nullableString(firstValue(row, ["ori_ord", "orig_ord_no"])),
    executionNumber: nullableString(firstValue(row, ["cntr_no"])),
    symbol: stripKiwoomSymbol(symbol),
    symbolRaw: symbol,
    name: nullableString(firstValue(row, ["stk_nm"])),
    side,
    sideRaw: nullableString(firstValue(row, ["io_tp_nm"])),
    orderType: nullableString(firstValue(row, ["trde_tp"])),
    status: nullableString(firstValue(row, ["acpt_tp"])),
    orderQuantity: accountNumber(firstValue(row, ["ord_qty"])),
    orderQuantityRaw: nullableString(firstValue(row, ["ord_qty"])),
    orderPrice: accountNumber(firstValue(row, ["ord_uv"])),
    orderPriceRaw: nullableString(firstValue(row, ["ord_uv"])),
    confirmedQuantity: accountNumber(firstValue(row, ["cnfm_qty"])),
    confirmedQuantityRaw: nullableString(firstValue(row, ["cnfm_qty"])),
    executedQuantity: accountNumber(firstValue(row, ["cntr_qty"])),
    executedQuantityRaw: nullableString(firstValue(row, ["cntr_qty"])),
    executedPrice: accountNumber(firstValue(row, ["cntr_uv"])),
    executedPriceRaw: nullableString(firstValue(row, ["cntr_uv"])),
    remainingQuantity: accountNumber(firstValue(row, ["ord_remnq"])),
    remainingQuantityRaw: nullableString(firstValue(row, ["ord_remnq"])),
    orderTime: nullableString(firstValue(row, ["ord_tm"])),
    executionTime: nullableString(firstValue(row, ["cntr_tm", "cnfm_tm"])),
    exchange: nullableString(firstValue(row, ["dmst_stex_tp"])),
    channel: nullableString(firstValue(row, ["comm_ord_tp"])),
    raw: row,
  };
}

function normalizeLsOrderHistoryRow(row) {
  const issueNumber = nullableString(firstValue(row, ["IsuNo"]));

  return {
    orderNumber: nullableString(firstValue(row, ["OrdNo"])),
    originalOrderNumber: nullableString(firstValue(row, ["OrgOrdNo"])),
    executionNumber: nullableString(firstValue(row, ["ExecNo"])),
    symbol: stripLsIssueNumber(issueNumber),
    symbolRaw: issueNumber,
    name: nullableString(firstValue(row, ["IsuNm"])),
    side: normalizeLsSide(firstValue(row, ["BnsTpCode", "BnsTpNm"])),
    sideRaw: nullableString(firstValue(row, ["BnsTpNm", "BnsTpCode"])),
    orderType: nullableString(firstValue(row, ["OrdPtnNm", "OrdPtnCode"])),
    status: nullableString(firstValue(row, ["ExecYn", "OrdprcPtnNm"])),
    orderQuantity: accountNumber(firstValue(row, ["OrdQty"])),
    orderQuantityRaw: nullableString(firstValue(row, ["OrdQty"])),
    orderPrice: accountNumber(firstValue(row, ["OrdPrc"])),
    orderPriceRaw: nullableString(firstValue(row, ["OrdPrc"])),
    executedQuantity: accountNumber(firstValue(row, ["ExecQty", "AllExecQty"])),
    executedQuantityRaw: nullableString(firstValue(row, ["ExecQty", "AllExecQty"])),
    executedPrice: accountNumber(firstValue(row, ["ExecPrc"])),
    executedPriceRaw: nullableString(firstValue(row, ["ExecPrc"])),
    remainingQuantity: accountNumber(firstValue(row, ["MrcAbleQty"])),
    remainingQuantityRaw: nullableString(firstValue(row, ["MrcAbleQty"])),
    orderDate: nullableString(firstValue(row, ["OrdDt"])),
    orderTime: nullableString(firstValue(row, ["OrdTime"])),
    executionTime: nullableString(firstValue(row, ["ExecTrxTime", "LastExecTime"])),
    channel: nullableString(firstValue(row, ["CommdaNm", "RegCommdaCode"])),
    raw: row,
  };
}

function normalizeDbOrderHistoryRow(row) {
  const issueNumber = nullableString(firstValue(row, ["IsuNo", "ShtnIsuNo"]));

  return {
    orderNumber: nullableString(firstValue(row, ["OrdNo"])),
    originalOrderNumber: nullableString(firstValue(row, ["OrgOrdNo"])),
    executionNumber: nullableString(firstValue(row, ["ExecNo"])),
    symbol: stripLsIssueNumber(issueNumber),
    symbolRaw: issueNumber,
    name: nullableString(firstValue(row, ["IsuNm"])),
    side: normalizeLsSide(firstValue(row, ["BnsTpCode", "BnsTpNm"])),
    sideRaw: nullableString(firstValue(row, ["BnsTpNm", "BnsTpCode"])),
    orderType: nullableString(firstValue(row, ["OrdPtnCode", "OrdprcPtnCode"])),
    status: nullableString(firstValue(row, ["ExecYn", "OrdStatus"])),
    orderQuantity: accountNumber(firstValue(row, ["OrdQty"])),
    orderQuantityRaw: nullableString(firstValue(row, ["OrdQty"])),
    orderPrice: accountNumber(firstValue(row, ["OrdPrc"])),
    orderPriceRaw: nullableString(firstValue(row, ["OrdPrc"])),
    executedQuantity: accountNumber(firstValue(row, ["ExecQty", "AllExecQty"])),
    executedQuantityRaw: nullableString(firstValue(row, ["ExecQty", "AllExecQty"])),
    executedPrice: accountNumber(firstValue(row, ["ExecPrc", "AvrExecPrc"])),
    executedPriceRaw: nullableString(firstValue(row, ["ExecPrc", "AvrExecPrc"])),
    remainingQuantity: accountNumber(firstValue(row, ["MrcAbleQty", "MrcQty"])),
    remainingQuantityRaw: nullableString(firstValue(row, ["MrcAbleQty", "MrcQty"])),
    orderTime: nullableString(firstValue(row, ["OrdTime", "OrdTm"])),
    executionTime: nullableString(firstValue(row, ["ExecTime", "ExecTrxTime"])),
    raw: row,
  };
}

function normalizeKisOrderHistoryRow(row) {
  return {
    orderNumber: nullableString(firstValue(row, ["odno"])),
    originalOrderNumber: nullableString(firstValue(row, ["orgn_odno"])),
    executionNumber: nullableString(firstValue(row, ["ccld_no"])),
    symbol: nullableString(firstValue(row, ["pdno"])),
    symbolRaw: nullableString(firstValue(row, ["pdno"])),
    name: nullableString(firstValue(row, ["prdt_name"])),
    side: normalizeKisSide(firstValue(row, ["sll_buy_dvsn_cd", "sll_buy_dvsn_cd_name"])),
    sideRaw: nullableString(firstValue(row, ["sll_buy_dvsn_cd_name", "sll_buy_dvsn_cd"])),
    orderType: nullableString(firstValue(row, ["ord_dvsn_name", "ord_dvsn_cd"])),
    status: nullableString(firstValue(row, ["ccld_dvsn", "ccld_dvsn_name"])),
    orderQuantity: accountNumber(firstValue(row, ["ord_qty"])),
    orderQuantityRaw: nullableString(firstValue(row, ["ord_qty"])),
    orderPrice: accountNumber(firstValue(row, ["ord_unpr"])),
    orderPriceRaw: nullableString(firstValue(row, ["ord_unpr"])),
    executedQuantity: accountNumber(firstValue(row, ["tot_ccld_qty"])),
    executedQuantityRaw: nullableString(firstValue(row, ["tot_ccld_qty"])),
    executedPrice: accountNumber(firstValue(row, ["avg_prvs"])),
    executedPriceRaw: nullableString(firstValue(row, ["avg_prvs"])),
    remainingQuantity: accountNumber(firstValue(row, ["rmn_qty"])),
    remainingQuantityRaw: nullableString(firstValue(row, ["rmn_qty"])),
    orderDate: nullableString(firstValue(row, ["ord_dt"])),
    orderTime: nullableString(firstValue(row, ["ord_tmd"])),
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
    : BrokerError.unknown(error?.message ?? "Account service failed", {
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

function mergeParams(base, override) {
  if (!override || typeof override !== "object") {
    return base;
  }

  if (!base || typeof base !== "object") {
    return override;
  }

  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      merged[key] &&
      typeof merged[key] === "object" &&
      !Array.isArray(merged[key])
    ) {
      merged[key] = mergeParams(merged[key], value);
    } else {
      merged[key] = value;
    }
  }

  return merged;
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

function accountNumber(value) {
  return parseNumber(value);
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

function stripKiwoomSymbol(value) {
  if (!value) {
    return null;
  }

  return String(value).replace(/^A/, "");
}

function stripLsIssueNumber(value) {
  if (!value) {
    return null;
  }

  return String(value).replace(/^[AJ]/, "");
}

function normalizeOptionalSymbol(symbol) {
  const normalized = String(symbol ?? "").trim();
  return normalized ? normalized.replace(/^[AJ]/, "") : null;
}

function normalizeOptionalOrderDate(orderDate, now) {
  if (orderDate === undefined || orderDate === null || orderDate === "") {
    return null;
  }

  if (orderDate instanceof Date) {
    return formatYmd(orderDate);
  }

  if (now instanceof Date && orderDate === true) {
    return formatYmd(now);
  }

  const normalized = String(orderDate).replace(/-/g, "").trim();
  return normalized || null;
}

function normalizeOptionalRequestString(value, fallback) {
  return String(value ?? fallback).trim();
}

function formatYmd(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function inferOrderSide(value) {
  const text = nullableString(value);
  if (!text) {
    return null;
  }

  if (text.includes("매수")) {
    return "buy";
  }

  if (text.includes("매도")) {
    return "sell";
  }

  return null;
}

function normalizeLsSide(value) {
  const text = nullableString(value);
  if (!text) {
    return null;
  }

  if (text === "2" || text.includes("매수")) {
    return "buy";
  }

  if (text === "1" || text.includes("매도")) {
    return "sell";
  }

  return null;
}

function normalizeKisSide(value) {
  const text = nullableString(value);
  if (!text) {
    return null;
  }

  if (text === "02" || text.includes("매수")) {
    return "buy";
  }

  if (text === "01" || text.includes("매도")) {
    return "sell";
  }

  return null;
}
