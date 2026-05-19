import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const CASH_CAPABILITY_ID = "overseasStock.account.cash";
const BALANCE_CAPABILITY_ID = "overseasStock.account.balance";
const ORDER_HISTORY_CAPABILITY_ID = "overseasStock.account.orderHistory";
const RESERVED_ORDER_HISTORY_CAPABILITY_ID = "overseasStock.account.reservedOrderHistory";

export class OverseasStockAccountService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async getOverseasStockCash(broker, query = {}, options = {}) {
    return this.#requestAccount({
      broker,
      query,
      options,
      capabilityId: CASH_CAPABILITY_ID,
      normalizeQuery: normalizeCashQuery,
      request: requestCash,
      normalize: normalizeOverseasStockCash,
    });
  }

  async getOverseasStockBalance(broker, query = {}, options = {}) {
    return this.#requestAccount({
      broker,
      query,
      options,
      capabilityId: BALANCE_CAPABILITY_ID,
      normalizeQuery: normalizeBalanceQuery,
      request: requestBalance,
      normalize: normalizeOverseasStockBalance,
    });
  }

  async getOverseasStockOrderHistory(broker, query = {}, options = {}) {
    return this.#requestAccount({
      broker,
      query,
      options,
      capabilityId: ORDER_HISTORY_CAPABILITY_ID,
      normalizeQuery: normalizeOrderHistoryQuery,
      request: requestOrderHistory,
      normalize: normalizeOverseasStockOrderHistory,
    });
  }

  async getOverseasStockReservedOrderHistory(broker, query = {}, options = {}) {
    return this.#requestAccount({
      broker,
      query,
      options,
      capabilityId: RESERVED_ORDER_HISTORY_CAPABILITY_ID,
      normalizeQuery: normalizeReservedOrderHistoryQuery,
      request: requestReservedOrderHistory,
      normalize: normalizeOverseasStockReservedOrderHistory,
    });
  }

  async #requestAccount({ broker, query, options, capabilityId, normalizeQuery, request, normalize }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let normalizedQuery = normalizeQueryPreview(query);
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      normalizedQuery = normalizeQuery(query, options, capabilityId);
      const capabilities = getCapabilities(normalizedBroker);

      if (!capabilities.supports(capabilityId)) {
        return failureResponse({
          broker: normalizedBroker,
          query: normalizedQuery,
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
          query: normalizedQuery,
          source,
          capabilityId,
          error: BrokerError.config(`Missing client for broker: ${normalizedBroker}`, {
            broker: normalizedBroker,
            details: { broker: normalizedBroker },
          }),
        });
      }

      source = selectAccountSource(normalizedBroker, capabilities, capabilityId, options);
      const result = await request(client, normalizedBroker, source.id, normalizedQuery, options);

      if (!result.ok) {
        return failureResponse({
          broker: normalizedBroker,
          query: normalizedQuery,
          source,
          result,
          capabilityId,
          error: result.error,
        });
      }

      return successResponse({
        broker: normalizedBroker,
        query: normalizedQuery,
        source,
        result,
        data: normalize(normalizedBroker, normalizedQuery, source.id, result.data),
        capabilityId,
      });
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        query: normalizedQuery,
        source,
        capabilityId,
        error,
      });
    }
  }
}

export function normalizeOverseasStockCash(broker, query, sourceId, payload) {
  assertLsBroker(broker, sourceId);
  const request = objectBlock(payload, `${sourceId}OutBlock1`);
  const settlements = arrayBlock(payload, `${sourceId}OutBlock2`);
  const currencies = arrayBlock(payload, `${sourceId}OutBlock3`);
  const summary = objectBlock(payload, `${sourceId}OutBlock4`);

  return {
    broker: "ls",
    currencyCode: nullableString(firstValue(request, ["CrcyCode"]) ?? query.currencyCode),
    summary: {
      recordCount: parseNumber(firstValue(summary, ["RecCnt"])),
      wonDepositBalance: parseNumber(firstValue(summary, ["WonDpsBalAmt"])),
      wonDepositBalanceRaw: nullableString(firstValue(summary, ["WonDpsBalAmt"])),
      withdrawableAmount: parseNumber(firstValue(summary, ["MnyoutAbleAmt"])),
      withdrawableAmountRaw: nullableString(firstValue(summary, ["MnyoutAbleAmt"])),
      wonPreExchangeableAmount: parseNumber(firstValue(summary, ["WonPrexchAbleAmt"])),
      wonPreExchangeableAmountRaw: nullableString(firstValue(summary, ["WonPrexchAbleAmt"])),
      overseasMargin: parseNumber(firstValue(summary, ["OvrsMgn"])),
      overseasMarginRaw: nullableString(firstValue(summary, ["OvrsMgn"])),
      nationalityCode: nullableString(firstValue(summary, ["NrfCode"])),
    },
    settlements: settlements.map(normalizeCashSettlement),
    currencies: currencies.map(normalizeCashCurrency),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: CASH_CAPABILITY_ID,
    },
    raw: {
      request,
      summary,
      settlements,
      currencies,
    },
  };
}

export function normalizeOverseasStockBalance(broker, query, sourceId, payload) {
  assertLsBroker(broker, sourceId);
  const request = objectBlock(payload, `${sourceId}OutBlock1`);
  const summary = objectBlock(payload, `${sourceId}OutBlock2`);
  const currencyBalances = arrayBlock(payload, `${sourceId}OutBlock3`);
  const positions = arrayBlock(payload, `${sourceId}OutBlock4`);

  return {
    broker: "ls",
    baseDate: nullableString(firstValue(request, ["BaseDt"]) ?? query.baseDate),
    currencyCode: nullableString(firstValue(request, ["CrcyCode"]) ?? query.currencyCode),
    balanceType: nullableString(firstValue(request, ["AstkBalTpCode"]) ?? query.balanceType),
    summary: {
      recordCount: parseNumber(firstValue(summary, ["RecCnt"])),
      profitRate: parseNumber(firstValue(summary, ["ErnRat"])),
      profitRateRaw: nullableString(firstValue(summary, ["ErnRat"])),
      depositConvertedEvaluationAmount: parseNumber(firstValue(summary, ["DpsConvEvalAmt"])),
      depositConvertedEvaluationAmountRaw: nullableString(firstValue(summary, ["DpsConvEvalAmt"])),
      stockConvertedEvaluationAmount: parseNumber(firstValue(summary, ["StkConvEvalAmt"])),
      stockConvertedEvaluationAmountRaw: nullableString(firstValue(summary, ["StkConvEvalAmt"])),
      depositAssetConvertedEvaluationAmount: parseNumber(firstValue(summary, ["DpsastConvEvalAmt"])),
      depositAssetConvertedEvaluationAmountRaw: nullableString(firstValue(summary, ["DpsastConvEvalAmt"])),
      wonEvaluationSumAmount: parseNumber(firstValue(summary, ["WonEvalSumAmt"])),
      wonEvaluationSumAmountRaw: nullableString(firstValue(summary, ["WonEvalSumAmt"])),
      convertedEvaluationProfitLoss: parseNumber(firstValue(summary, ["ConvEvalPnlAmt"])),
      convertedEvaluationProfitLossRaw: nullableString(firstValue(summary, ["ConvEvalPnlAmt"])),
      wonDepositBalance: parseNumber(firstValue(summary, ["WonDpsBalAmt"])),
      wonDepositBalanceRaw: nullableString(firstValue(summary, ["WonDpsBalAmt"])),
      d2EstimatedDeposit: parseNumber(firstValue(summary, ["D2EstiDps"])),
      d2EstimatedDepositRaw: nullableString(firstValue(summary, ["D2EstiDps"])),
      loanAmount: parseNumber(firstValue(summary, ["LoanAmt"])),
      loanAmountRaw: nullableString(firstValue(summary, ["LoanAmt"])),
    },
    currencyBalances: currencyBalances.map(normalizeBalanceCurrency),
    positions: positions.map(normalizeBalancePosition),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: BALANCE_CAPABILITY_ID,
    },
    raw: {
      request,
      summary,
      currencyBalances,
      positions,
    },
  };
}

export function normalizeOverseasStockOrderHistory(broker, query, sourceId, payload) {
  assertLsBroker(broker, sourceId);
  const request = objectBlock(payload, `${sourceId}OutBlock1`);
  const summary = objectBlock(payload, `${sourceId}OutBlock2`);
  const rows = arrayBlock(payload, `${sourceId}OutBlock3`);

  return {
    broker: "ls",
    orderDate: nullableString(firstValue(request, ["OrdDt"]) ?? query.orderDate),
    marketCode: nullableString(firstValue(request, ["OrdMktCode"]) ?? query.marketCode),
    currencyCode: nullableString(firstValue(request, ["CrcyCode"]) ?? query.currencyCode),
    symbol: nullableString(firstValue(request, ["IsuNo"]) ?? query.symbol),
    summary: {
      recordCount: parseNumber(firstValue(summary, ["RecCnt"])),
      accountName: nullableString(firstValue(summary, ["AcntNm"])),
      name: nullableString(firstValue(summary, ["JpnMktHanglIsuNm"])),
      branchName: nullableString(firstValue(summary, ["MgmtBrnNm"])),
      sellExecutedForeignAmount: parseNumber(firstValue(summary, ["SellExecFcurrAmt"])),
      sellExecutedForeignAmountRaw: nullableString(firstValue(summary, ["SellExecFcurrAmt"])),
      sellExecutedQuantity: parseNumber(firstValue(summary, ["SellExecQty"])),
      sellExecutedQuantityRaw: nullableString(firstValue(summary, ["SellExecQty"])),
      buyExecutedForeignAmount: parseNumber(firstValue(summary, ["BuyExecFcurrAmt"])),
      buyExecutedForeignAmountRaw: nullableString(firstValue(summary, ["BuyExecFcurrAmt"])),
      buyExecutedQuantity: parseNumber(firstValue(summary, ["BuyExecQty"])),
      buyExecutedQuantityRaw: nullableString(firstValue(summary, ["BuyExecQty"])),
      count: rows.length,
    },
    orders: rows.map(normalizeOrderHistoryRow),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: ORDER_HISTORY_CAPABILITY_ID,
    },
    raw: {
      request,
      summary,
      rows,
    },
  };
}

export function normalizeOverseasStockReservedOrderHistory(broker, query, sourceId, payload) {
  assertLsBroker(broker, sourceId);
  const request = objectBlock(payload, `${sourceId}OutBlock1`);
  const rows = arrayBlock(payload, `${sourceId}OutBlock2`);

  return {
    broker: "ls",
    countryCode: nullableString(firstValue(request, ["CntryCode"]) ?? query.countryCode),
    startDate: nullableString(firstValue(request, ["SrtDt"]) ?? query.startDate),
    endDate: nullableString(firstValue(request, ["EndDt"]) ?? query.endDate),
    sideCode: nullableString(firstValue(request, ["BnsTpCode"]) ?? query.sideCode),
    conditionCode: nullableString(firstValue(request, ["RsvOrdCndiCode"]) ?? query.conditionCode),
    statusCode: nullableString(firstValue(request, ["RsvOrdStatCode"]) ?? query.statusCode),
    summary: {
      recordCount: parseNumber(firstValue(request, ["RecCnt"])),
      count: rows.length,
    },
    orders: rows.map(normalizeReservedOrderHistoryRow),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: RESERVED_ORDER_HISTORY_CAPABILITY_ID,
    },
    raw: {
      request,
      rows,
    },
  };
}

function selectAccountSource(broker, capabilities, capabilityId, options) {
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

async function requestCash(client, broker, sourceId, query, options) {
  if (broker === "ls") {
    return requestLsAccount(client, sourceId, {
      COSOQ02701InBlock1: {
        RecCnt: query.recCount,
        CrcyCode: query.currencyCode,
      },
    }, options);
  }

  throwUnsupportedBroker(broker, sourceId, "overseas cash");
}

async function requestBalance(client, broker, sourceId, query, options) {
  if (broker === "ls") {
    return requestLsAccount(client, sourceId, {
      COSOQ00201InBlock1: {
        RecCnt: query.recCount,
        BaseDt: query.baseDate,
        CrcyCode: query.currencyCode,
        AstkBalTpCode: query.balanceType,
      },
    }, options);
  }

  throwUnsupportedBroker(broker, sourceId, "overseas balance");
}

async function requestOrderHistory(client, broker, sourceId, query, options) {
  if (broker === "ls") {
    return requestLsAccount(client, sourceId, {
      COSAQ00102InBlock1: {
        RecCnt: query.recCount,
        QryTpCode: query.queryType,
        BkseqTpCode: query.reverseSequenceType,
        OrdMktCode: query.marketCode,
        BnsTpCode: query.sideCode,
        IsuNo: query.symbol,
        SrtOrdNo: query.startOrderNumber,
        OrdDt: query.orderDate,
        ExecYn: query.executionStatus,
        CrcyCode: query.currencyCode,
        ThdayBnsAppYn: query.todayTradeApply,
        LoanBalHldYn: query.loanBalanceOnly,
      },
    }, options);
  }

  throwUnsupportedBroker(broker, sourceId, "overseas order history");
}

async function requestReservedOrderHistory(client, broker, sourceId, query, options) {
  if (broker === "ls") {
    return requestLsAccount(client, sourceId, {
      COSAQ01400InBlock1: {
        RecCnt: query.recCount,
        QryTpCode: query.queryType,
        CntryCode: query.countryCode,
        AcntNo: query.accountNumber,
        Pwd: query.password,
        SrtDt: query.startDate,
        EndDt: query.endDate,
        BnsTpCode: query.sideCode,
        RsvOrdCndiCode: query.conditionCode,
        RsvOrdStatCode: query.statusCode,
      },
    }, options);
  }

  throwUnsupportedBroker(broker, sourceId, "overseas reserved order history");
}

async function requestLsAccount(client, sourceId, params, options) {
  return client.request(sourceId, mergeParams(params, options.params), options.requestOptions ?? {});
}

function normalizeCashQuery(query = {}, options = {}, capabilityId) {
  const value = objectValue(query);
  return {
    recCount: normalizePositiveInteger(value.recCount ?? value.RecCnt ?? options.recCount ?? 1, "recCount", capabilityId),
    currencyCode: normalizeRequiredString(
      firstNonBlank(value.currencyCode, value.currency, value.CrcyCode, options.currencyCode, options.currency, "ALL"),
      "currencyCode",
      capabilityId,
    ),
  };
}

function normalizeBalanceQuery(query = {}, options = {}, capabilityId) {
  const value = objectValue(query);
  return {
    recCount: normalizePositiveInteger(value.recCount ?? value.RecCnt ?? options.recCount ?? 1, "recCount", capabilityId),
    baseDate: normalizeDate(value.baseDate ?? value.date ?? value.BaseDt ?? options.baseDate ?? options.date, "baseDate", capabilityId, {
      defaultToday: true,
      now: options.now,
    }),
    currencyCode: normalizeRequiredString(
      firstNonBlank(value.currencyCode, value.currency, value.CrcyCode, options.currencyCode, options.currency, "ALL"),
      "currencyCode",
      capabilityId,
    ),
    balanceType: normalizeRequiredString(
      firstNonBlank(value.balanceType, value.AstkBalTpCode, options.balanceType, "00"),
      "balanceType",
      capabilityId,
    ),
  };
}

function normalizeOrderHistoryQuery(query = {}, options = {}, capabilityId) {
  const value = objectValue(query);
  const symbol = firstNonBlank(value.symbol, value.issueNumber, value.IsuNo, options.symbol, "");

  return {
    recCount: normalizePositiveInteger(value.recCount ?? value.RecCnt ?? options.recCount ?? 1, "recCount", capabilityId),
    queryType: normalizeRequiredString(firstNonBlank(value.queryType, value.QryTpCode, options.queryType, "1"), "queryType", capabilityId),
    reverseSequenceType: normalizeRequiredString(
      firstNonBlank(value.reverseSequenceType, value.BkseqTpCode, options.reverseSequenceType, "1"),
      "reverseSequenceType",
      capabilityId,
    ),
    marketCode: normalizeRequiredString(firstNonBlank(value.marketCode, value.OrdMktCode, options.marketCode, "82"), "marketCode", capabilityId),
    sideCode: normalizeRequiredString(firstNonBlank(value.sideCode, value.BnsTpCode, options.sideCode, "0"), "sideCode", capabilityId),
    symbol: nullableString(symbol) ?? "",
    startOrderNumber: normalizeNonNegativeInteger(
      value.startOrderNumber ?? value.SrtOrdNo ?? options.startOrderNumber ?? 999999999,
      "startOrderNumber",
      capabilityId,
    ),
    orderDate: normalizeDate(value.orderDate ?? value.date ?? value.OrdDt ?? options.orderDate ?? options.date, "orderDate", capabilityId, {
      defaultToday: true,
      now: options.now,
    }),
    executionStatus: normalizeRequiredString(firstNonBlank(value.executionStatus, value.ExecYn, options.executionStatus, "0"), "executionStatus", capabilityId),
    currencyCode: normalizeRequiredString(
      firstNonBlank(value.currencyCode, value.currency, value.CrcyCode, options.currencyCode, options.currency, "000"),
      "currencyCode",
      capabilityId,
    ),
    todayTradeApply: normalizeYnCode(
      firstNonBlank(value.todayTradeApply, value.ThdayBnsAppYn, options.todayTradeApply, "0"),
      "todayTradeApply",
      capabilityId,
    ),
    loanBalanceOnly: normalizeYnCode(
      firstNonBlank(value.loanBalanceOnly, value.LoanBalHldYn, options.loanBalanceOnly, "0"),
      "loanBalanceOnly",
      capabilityId,
    ),
  };
}

function normalizeReservedOrderHistoryQuery(query = {}, options = {}, capabilityId) {
  const value = objectValue(query);
  return {
    recCount: normalizePositiveInteger(value.recCount ?? value.RecCnt ?? options.recCount ?? 1, "recCount", capabilityId),
    queryType: normalizeRequiredString(firstNonBlank(value.queryType, value.QryTpCode, options.queryType, "1"), "queryType", capabilityId),
    countryCode: normalizeRequiredString(firstNonBlank(value.countryCode, value.country, value.CntryCode, options.countryCode, options.country), "countryCode", capabilityId),
    accountNumber: normalizeRequiredString(firstNonBlank(value.accountNumber, value.accountNo, value.AcntNo, options.accountNumber, options.accountNo), "accountNumber", capabilityId),
    password: normalizeRequiredString(firstNonBlank(value.password, value.pwd, value.Pwd, options.password, options.pwd), "password", capabilityId),
    startDate: normalizeDate(value.startDate ?? value.SrtDt ?? options.startDate, "startDate", capabilityId),
    endDate: normalizeDate(value.endDate ?? value.EndDt ?? options.endDate, "endDate", capabilityId),
    sideCode: normalizeRequiredString(firstNonBlank(value.sideCode, value.BnsTpCode, options.sideCode, "0"), "sideCode", capabilityId),
    conditionCode: normalizeRequiredString(
      firstNonBlank(value.conditionCode, value.RsvOrdCndiCode, options.conditionCode, "00"),
      "conditionCode",
      capabilityId,
    ),
    statusCode: normalizeRequiredString(firstNonBlank(value.statusCode, value.RsvOrdStatCode, options.statusCode, "1"), "statusCode", capabilityId),
  };
}

function normalizeQueryPreview(query) {
  if (!query || typeof query !== "object") {
    return {};
  }

  return {
    symbol: nullableString(query.symbol ?? query.IsuNo),
    currencyCode: nullableString(query.currencyCode ?? query.currency ?? query.CrcyCode),
    marketCode: nullableString(query.marketCode ?? query.OrdMktCode),
    baseDate: nullableString(query.baseDate ?? query.BaseDt),
    orderDate: nullableString(query.orderDate ?? query.OrdDt),
  };
}

function normalizeCashSettlement(row) {
  return {
    currencyCode: nullableString(firstValue(row, ["CrcyCode"])),
    buyAdjustments: [1, 2, 3, 4].map((index) => amountPair(row, `FcurrBuyAdjstAmt${index}`)),
    sellAdjustments: [1, 2, 3, 4].map((index) => amountPair(row, `FcurrSellAdjstAmt${index}`)),
    estimatedForeignDeposits: [1, 2, 3, 4].map((index) => amountPair(row, `PrsmptFcurrDps${index}`)),
    estimatedExchangeableAmounts: [1, 2, 3, 4].map((index) => amountPair(row, `PrsmptMxchgAbleAmt${index}`)),
    raw: row,
  };
}

function normalizeCashCurrency(row) {
  return {
    countryName: nullableString(firstValue(row, ["CntryNm"])),
    currencyCode: nullableString(firstValue(row, ["CrcyCode"])),
    t4ForeignDeposit: parseNumber(firstValue(row, ["T4FcurrDps"])),
    t4ForeignDepositRaw: nullableString(firstValue(row, ["T4FcurrDps"])),
    foreignDeposit: parseNumber(firstValue(row, ["FcurrDps"])),
    foreignDepositRaw: nullableString(firstValue(row, ["FcurrDps"])),
    orderableAmount: parseNumber(firstValue(row, ["FcurrOrdAbleAmt"])),
    orderableAmountRaw: nullableString(firstValue(row, ["FcurrOrdAbleAmt"])),
    preExchangeOrderableAmount: parseNumber(firstValue(row, ["PrexchOrdAbleAmt"])),
    preExchangeOrderableAmountRaw: nullableString(firstValue(row, ["PrexchOrdAbleAmt"])),
    foreignOrderAmount: parseNumber(firstValue(row, ["FcurrOrdAmt"])),
    foreignOrderAmountRaw: nullableString(firstValue(row, ["FcurrOrdAmt"])),
    pledgeAmount: parseNumber(firstValue(row, ["FcurrPldgAmt"])),
    pledgeAmountRaw: nullableString(firstValue(row, ["FcurrPldgAmt"])),
    executionReuseForeignAmount: parseNumber(firstValue(row, ["ExecRuseFcurrAmt"])),
    executionReuseForeignAmountRaw: nullableString(firstValue(row, ["ExecRuseFcurrAmt"])),
    exchangeableAmount: parseNumber(firstValue(row, ["FcurrMxchgAbleAmt"])),
    exchangeableAmountRaw: nullableString(firstValue(row, ["FcurrMxchgAbleAmt"])),
    baseExchangeRate: parseNumber(firstValue(row, ["BaseXchrat"])),
    baseExchangeRateRaw: nullableString(firstValue(row, ["BaseXchrat"])),
    raw: row,
  };
}

function normalizeBalanceCurrency(row) {
  return {
    currencyCode: nullableString(firstValue(row, ["CrcyCode"])),
    foreignDeposit: parseNumber(firstValue(row, ["FcurrDps"])),
    foreignDepositRaw: nullableString(firstValue(row, ["FcurrDps"])),
    foreignEvaluationAmount: parseNumber(firstValue(row, ["FcurrEvalAmt"])),
    foreignEvaluationAmountRaw: nullableString(firstValue(row, ["FcurrEvalAmt"])),
    foreignEvaluationProfitLoss: parseNumber(firstValue(row, ["FcurrEvalPnlAmt"])),
    foreignEvaluationProfitLossRaw: nullableString(firstValue(row, ["FcurrEvalPnlAmt"])),
    profitRate: parseNumber(firstValue(row, ["PnlRat"])),
    profitRateRaw: nullableString(firstValue(row, ["PnlRat"])),
    baseExchangeRate: parseNumber(firstValue(row, ["BaseXchrat"])),
    baseExchangeRateRaw: nullableString(firstValue(row, ["BaseXchrat"])),
    depositConvertedEvaluationAmount: parseNumber(firstValue(row, ["DpsConvEvalAmt"])),
    depositConvertedEvaluationAmountRaw: nullableString(firstValue(row, ["DpsConvEvalAmt"])),
    purchaseAmount: parseNumber(firstValue(row, ["PchsAmt"])),
    purchaseAmountRaw: nullableString(firstValue(row, ["PchsAmt"])),
    stockConvertedEvaluationAmount: parseNumber(firstValue(row, ["StkConvEvalAmt"])),
    stockConvertedEvaluationAmountRaw: nullableString(firstValue(row, ["StkConvEvalAmt"])),
    convertedEvaluationProfitLoss: parseNumber(firstValue(row, ["ConvEvalPnlAmt"])),
    convertedEvaluationProfitLossRaw: nullableString(firstValue(row, ["ConvEvalPnlAmt"])),
    foreignBuyAmount: parseNumber(firstValue(row, ["FcurrBuyAmt"])),
    foreignBuyAmountRaw: nullableString(firstValue(row, ["FcurrBuyAmt"])),
    foreignOrderableAmount: parseNumber(firstValue(row, ["FcurrOrdAbleAmt"])),
    foreignOrderableAmountRaw: nullableString(firstValue(row, ["FcurrOrdAbleAmt"])),
    loanAmount: parseNumber(firstValue(row, ["LoanAmt"])),
    loanAmountRaw: nullableString(firstValue(row, ["LoanAmt"])),
    raw: row,
  };
}

function normalizeBalancePosition(row) {
  return {
    currencyCode: nullableString(firstValue(row, ["CrcyCode"])),
    symbol: nullableString(firstValue(row, ["ShtnIsuNo"])),
    issueNumber: nullableString(firstValue(row, ["IsuNo"])),
    name: nullableString(firstValue(row, ["JpnMktHanglIsuNm"])),
    balanceType: nullableString(firstValue(row, ["AstkBalTpCode"])),
    balanceTypeName: nullableString(firstValue(row, ["AstkBalTpCodeNm"])),
    quantity: parseNumber(firstValue(row, ["AstkBalQty"])),
    quantityRaw: nullableString(firstValue(row, ["AstkBalQty"])),
    sellableQuantity: parseNumber(firstValue(row, ["AstkSellAbleQty"])),
    sellableQuantityRaw: nullableString(firstValue(row, ["AstkSellAbleQty"])),
    unitPrice: parseNumber(firstValue(row, ["FcstckUprc"])),
    unitPriceRaw: nullableString(firstValue(row, ["FcstckUprc"])),
    foreignBuyAmount: parseNumber(firstValue(row, ["FcurrBuyAmt"])),
    foreignBuyAmountRaw: nullableString(firstValue(row, ["FcurrBuyAmt"])),
    marketIssueCode: nullableString(firstValue(row, ["FcstckMktIsuCode"])),
    currentPrice: parseNumber(firstValue(row, ["OvrsScrtsCurpri"])),
    currentPriceRaw: nullableString(firstValue(row, ["OvrsScrtsCurpri"])),
    foreignEvaluationAmount: parseNumber(firstValue(row, ["FcurrEvalAmt"])),
    foreignEvaluationAmountRaw: nullableString(firstValue(row, ["FcurrEvalAmt"])),
    foreignEvaluationProfitLoss: parseNumber(firstValue(row, ["FcurrEvalPnlAmt"])),
    foreignEvaluationProfitLossRaw: nullableString(firstValue(row, ["FcurrEvalPnlAmt"])),
    profitRate: parseNumber(firstValue(row, ["PnlRat"])),
    profitRateRaw: nullableString(firstValue(row, ["PnlRat"])),
    baseExchangeRate: parseNumber(firstValue(row, ["BaseXchrat"])),
    baseExchangeRateRaw: nullableString(firstValue(row, ["BaseXchrat"])),
    purchaseAmount: parseNumber(firstValue(row, ["PchsAmt"])),
    purchaseAmountRaw: nullableString(firstValue(row, ["PchsAmt"])),
    depositConvertedEvaluationAmount: parseNumber(firstValue(row, ["DpsConvEvalAmt"])),
    depositConvertedEvaluationAmountRaw: nullableString(firstValue(row, ["DpsConvEvalAmt"])),
    stockConvertedEvaluationAmount: parseNumber(firstValue(row, ["StkConvEvalAmt"])),
    stockConvertedEvaluationAmountRaw: nullableString(firstValue(row, ["StkConvEvalAmt"])),
    convertedEvaluationProfitLoss: parseNumber(firstValue(row, ["ConvEvalPnlAmt"])),
    convertedEvaluationProfitLossRaw: nullableString(firstValue(row, ["ConvEvalPnlAmt"])),
    settledQuantity: parseNumber(firstValue(row, ["AstkSettQty"])),
    settledQuantityRaw: nullableString(firstValue(row, ["AstkSettQty"])),
    marketName: nullableString(firstValue(row, ["MktTpNm"])),
    foreignMarketCode: nullableString(firstValue(row, ["FcurrMktCode"])),
    loanDate: nullableString(firstValue(row, ["LoanDt"])),
    loanDetailClassCode: nullableString(firstValue(row, ["LoanDtlClssCode"])),
    loanAmount: parseNumber(firstValue(row, ["LoanAmt"])),
    loanAmountRaw: nullableString(firstValue(row, ["LoanAmt"])),
    dueDate: nullableString(firstValue(row, ["DueDt"])),
    basePrice: parseNumber(firstValue(row, ["AstkBasePrc"])),
    basePriceRaw: nullableString(firstValue(row, ["AstkBasePrc"])),
    raw: row,
  };
}

function normalizeOrderHistoryRow(row) {
  return {
    branchNumber: nullableString(firstValue(row, ["MgmtBrnNo"])),
    accountName: nullableString(firstValue(row, ["AcntNm"])),
    orderNumber: nullableString(firstValue(row, ["OrdNo"])),
    originalOrderNumber: nullableString(firstValue(row, ["OrgOrdNo"])),
    symbol: nullableString(firstValue(row, ["ShtnIsuNo"])),
    issueNumber: nullableString(firstValue(row, ["IsuNo"])),
    name: nullableString(firstValue(row, ["JpnMktHanglIsuNm"])),
    side: normalizeLsSide(firstValue(row, ["BnsTpCode", "OrdPtnNm", "OrdTrxPtnNm"])),
    sideCode: nullableString(firstValue(row, ["BnsTpCode"])),
    orderProcessTypeName: nullableString(firstValue(row, ["OrdTrxPtnNm"])),
    orderProcessTypeCode: nullableString(firstValue(row, ["OrdTrxPtnCode"])),
    modifyCancelableQuantity: parseNumber(firstValue(row, ["MrcAbleQty"])),
    modifyCancelableQuantityRaw: nullableString(firstValue(row, ["MrcAbleQty"])),
    orderQuantity: parseNumber(firstValue(row, ["OrdQty"])),
    orderQuantityRaw: nullableString(firstValue(row, ["OrdQty"])),
    orderPrice: parseNumber(firstValue(row, ["OvrsOrdPrc"])),
    orderPriceRaw: nullableString(firstValue(row, ["OvrsOrdPrc"])),
    executedQuantity: parseNumber(firstValue(row, ["ExecQty"])),
    executedQuantityRaw: nullableString(firstValue(row, ["ExecQty"])),
    executedPrice: parseNumber(firstValue(row, ["OvrsExecPrc"])),
    executedPriceRaw: nullableString(firstValue(row, ["OvrsExecPrc"])),
    priceTypeCode: nullableString(firstValue(row, ["OrdprcPtnCode"])),
    priceTypeName: nullableString(firstValue(row, ["OrdprcPtnNm"])),
    orderTypeName: nullableString(firstValue(row, ["OrdPtnNm"])),
    orderTypeCode: nullableString(firstValue(row, ["OrdPtnCode"])),
    modifyCancelTypeCode: nullableString(firstValue(row, ["MrcTpCode"])),
    modifyCancelTypeName: nullableString(firstValue(row, ["MrcTpNm"])),
    allExecutedQuantity: parseNumber(firstValue(row, ["AllExecQty"])),
    allExecutedQuantityRaw: nullableString(firstValue(row, ["AllExecQty"])),
    orderMarketCode: nullableString(firstValue(row, ["OrdMktCode"])),
    marketName: nullableString(firstValue(row, ["MktNm"])),
    mediumCode: nullableString(firstValue(row, ["CommdaCode"])),
    mediumName: nullableString(firstValue(row, ["CommdaNm"])),
    unexecutedQuantity: parseNumber(firstValue(row, ["UnercQty"])),
    unexecutedQuantityRaw: nullableString(firstValue(row, ["UnercQty"])),
    confirmedQuantity: parseNumber(firstValue(row, ["CnfQty"])),
    confirmedQuantityRaw: nullableString(firstValue(row, ["CnfQty"])),
    currencyCode: nullableString(firstValue(row, ["CrcyCode"])),
    registeredMarketCode: nullableString(firstValue(row, ["RegMktCode"])),
    brokerTypeCode: nullableString(firstValue(row, ["BrkTpCode"])),
    oppositeBrokerName: nullableString(firstValue(row, ["OppBrkNm"])),
    loanDate: nullableString(firstValue(row, ["LoanDt"])),
    loanAmount: parseNumber(firstValue(row, ["LoanAmt"])),
    loanAmountRaw: nullableString(firstValue(row, ["LoanAmt"])),
    orderTime: nullableString(firstValue(row, ["OrdTime"])),
    executionTime: nullableString(firstValue(row, ["ExecTime"])),
    raw: row,
  };
}

function normalizeReservedOrderHistoryRow(row) {
  return {
    accountName: nullableString(firstValue(row, ["AcntNm"])),
    orderDate: nullableString(firstValue(row, ["OrdDt"])),
    orderNumber: nullableString(firstValue(row, ["OrdNo"])),
    reservedOrderInputDate: nullableString(firstValue(row, ["RsvOrdInptDt"])),
    reservedOrderNumber: nullableString(firstValue(row, ["RsvOrdNo"])),
    symbol: nullableString(firstValue(row, ["ShtnIsuNo"])),
    name: nullableString(firstValue(row, ["JpnMktHanglIsuNm"])),
    priceTypeName: nullableString(firstValue(row, ["OrdprcPtnNm"])),
    orderQuantity: parseNumber(firstValue(row, ["OrdQty"])),
    orderQuantityRaw: nullableString(firstValue(row, ["OrdQty"])),
    orderPrice: parseNumber(firstValue(row, ["OvrsOrdPrc"])),
    orderPriceRaw: nullableString(firstValue(row, ["OvrsOrdPrc"])),
    side: normalizeLsSide(firstValue(row, ["BnsTpNm"])),
    sideName: nullableString(firstValue(row, ["BnsTpNm"])),
    executedQuantity: parseNumber(firstValue(row, ["ExecQty"])),
    executedQuantityRaw: nullableString(firstValue(row, ["ExecQty"])),
    unexecutedQuantity: parseNumber(firstValue(row, ["UnercQty"])),
    unexecutedQuantityRaw: nullableString(firstValue(row, ["UnercQty"])),
    totalExecutedQuantity: parseNumber(firstValue(row, ["TotExecQty"])),
    totalExecutedQuantityRaw: nullableString(firstValue(row, ["TotExecQty"])),
    currencyCode: nullableString(firstValue(row, ["CrcyCode"])),
    statusCode: nullableString(firstValue(row, ["RsvOrdStatCode"])),
    marketName: nullableString(firstValue(row, ["MktTpNm"])),
    errorMessage: nullableString(firstValue(row, ["ErrCnts"])),
    loanDate: nullableString(firstValue(row, ["LoanDt"])),
    creditTradeCode: nullableString(firstValue(row, ["MgntrnCode"])),
    raw: row,
  };
}

function successResponse({ broker, query, source, result, data, capabilityId }) {
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
    query,
  };
}

function failureResponse({ broker, query, source, result, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Overseas stock account service failed", {
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
    query,
  };
}

function assertLsBroker(broker, sourceId) {
  if (broker !== "ls") {
    throw BrokerError.unsupported(`Unsupported overseas account normalization broker: ${broker}`, {
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

function objectValue(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function objectBlock(payload, key) {
  const block = payload?.[key];
  return block && typeof block === "object" && !Array.isArray(block) ? block : {};
}

function arrayBlock(payload, key) {
  const block = payload?.[key];
  if (Array.isArray(block)) {
    return block;
  }

  if (block && typeof block === "object") {
    return [block];
  }

  return [];
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

function firstNonBlank(...values) {
  for (const value of values) {
    const normalized = nullableString(value);
    if (normalized !== null) {
      return normalized;
    }
  }

  return null;
}

function normalizeRequiredString(value, field, capabilityId) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation(`Overseas stock account ${field} is required`, {
      details: { capabilityId, field },
    });
  }

  return normalized;
}

function normalizeDate(value, field, capabilityId, options = {}) {
  let candidate = value;
  if (candidate === undefined || candidate === null || candidate === "") {
    if (!options.defaultToday) {
      throw BrokerError.validation(`Overseas stock account ${field} is required`, {
        details: { capabilityId, field },
      });
    }

    candidate = currentDate(options.now);
  }

  if (candidate instanceof Date) {
    return formatYmd(candidate);
  }

  const normalized = String(candidate).replace(/-/g, "").trim();
  if (!/^\d{8}$/.test(normalized)) {
    throw BrokerError.validation(`${field} must be YYYYMMDD`, {
      details: { capabilityId, field, value },
    });
  }

  return normalized;
}

function currentDate(now) {
  if (typeof now === "function") {
    return now();
  }

  if (now instanceof Date) {
    return now;
  }

  return new Date();
}

function formatYmd(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
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

function normalizeNonNegativeInteger(value, field, capabilityId) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw BrokerError.validation(`${field} must be a non-negative integer`, {
      details: { capabilityId, field, value },
    });
  }

  return parsed;
}

function normalizeYnCode(value, field, capabilityId) {
  const normalized = normalizeRequiredString(value, field, capabilityId);
  if (!["0", "1", "Y", "N"].includes(normalized)) {
    throw BrokerError.validation(`${field} must be one of 0, 1, Y, N`, {
      details: { capabilityId, field, value },
    });
  }

  return normalized;
}

function amountPair(row, key) {
  return {
    value: parseNumber(firstValue(row, [key])),
    raw: nullableString(firstValue(row, [key])),
  };
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

function normalizeLsSide(value) {
  const text = nullableString(value);
  if (!text) {
    return null;
  }

  if (text === "2" || text.includes("매수") || text.toLowerCase() === "buy") {
    return "buy";
  }

  if (text === "1" || text.includes("매도") || text.toLowerCase() === "sell") {
    return "sell";
  }

  return null;
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

function normalizeId(value) {
  return String(value ?? "").trim().toLowerCase();
}
