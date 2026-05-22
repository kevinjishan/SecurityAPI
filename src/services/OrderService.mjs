import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const BUY_CAPABILITY_ID = "order.domesticStock.buy";
const SELL_CAPABILITY_ID = "order.domesticStock.sell";
const MODIFY_CAPABILITY_ID = "order.domesticStock.modify";
const CANCEL_CAPABILITY_ID = "order.domesticStock.cancel";

export class OrderService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async buyDomesticStock(broker, order = {}, options = {}) {
    return this.#requestOrder({
      broker,
      order,
      options,
      side: "buy",
      capabilityId: BUY_CAPABILITY_ID,
      request: buildNewOrderRequest,
    });
  }

  async sellDomesticStock(broker, order = {}, options = {}) {
    return this.#requestOrder({
      broker,
      order,
      options,
      side: "sell",
      capabilityId: SELL_CAPABILITY_ID,
      request: buildNewOrderRequest,
    });
  }

  async modifyDomesticStock(broker, order = {}, options = {}) {
    return this.#requestOrder({
      broker,
      order,
      options,
      side: "modify",
      capabilityId: MODIFY_CAPABILITY_ID,
      request: buildModifyOrderRequest,
    });
  }

  async cancelDomesticStock(broker, order = {}, options = {}) {
    return this.#requestOrder({
      broker,
      order,
      options,
      side: "cancel",
      capabilityId: CANCEL_CAPABILITY_ID,
      request: buildCancelOrderRequest,
    });
  }

  async #requestOrder({ broker, order, options, side, capabilityId, request }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const capabilities = getCapabilities(normalizedBroker);

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

      source = selectOrderSource(normalizedBroker, capabilities, capabilityId, options);
      const prepared = request(normalizedBroker, source.id, side, order);
      const params = prepared.params;
      const safety = evaluateOrderSafety(prepared.normalized, params, options);
      const dryRun = options.dryRun !== false;

      if (!safety.allowed) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          capabilityId,
          error: BrokerError.validation(safety.reason, {
            broker: normalizedBroker,
            id: source.id,
            details: safety,
          }),
        });
      }

      if (dryRun) {
        return previewResponse({
          broker: normalizedBroker,
          source,
          capabilityId,
          side,
          params,
          normalizedOrder: prepared.normalized,
          safety,
        });
      }

      if (options.confirm !== true) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          capabilityId,
          error: BrokerError.validation("Live order requires options.confirm === true", {
            broker: normalizedBroker,
            id: source.id,
            details: {
              capabilityId,
              dryRun,
              confirm: options.confirm ?? false,
            },
          }),
        });
      }

      if (safety.requiresMarketOrderConfirmation && options.confirmMarketOrder !== true) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          capabilityId,
          error: BrokerError.validation("Market live order requires options.confirmMarketOrder === true", {
            broker: normalizedBroker,
            id: source.id,
            details: safety,
          }),
        });
      }

      if (options.expectedRequest !== undefined && !deepEqual(params, options.expectedRequest)) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          capabilityId,
          error: BrokerError.validation("Live order request does not match expectedRequest", {
            broker: normalizedBroker,
            id: source.id,
            details: {
              expectedRequest: options.expectedRequest,
              actualRequest: params,
            },
          }),
        });
      }

      const client = this.clients[normalizedBroker];
      if (!client?.request) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          capabilityId,
          error: BrokerError.config(`Missing client for broker: ${normalizedBroker}`, {
            broker: normalizedBroker,
            details: { broker: normalizedBroker },
          }),
        });
      }

      const result = await client.request(source.id, params, {
        ...(options.requestOptions ?? {}),
        ...(normalizedBroker === "kis" ? { side } : {}),
        retryable: false,
      });

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
        side,
        params,
        safety,
        data: normalizeDomesticStockOrder(normalizedBroker, source.id, side, result.data),
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

export function normalizeDomesticStockOrder(broker, sourceId, side, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomOrder(sourceId, side, payload);
  }

  if (broker === "ls") {
    return normalizeLsOrder(sourceId, side, payload);
  }

  if (broker === "db") {
    return normalizeDbOrder(sourceId, side, payload);
  }

  if (broker === "kis") {
    return normalizeKisOrder(sourceId, side, payload);
  }

  throw BrokerError.unsupported(`Unsupported order normalization broker: ${broker}`, {
    broker,
    details: { sourceId, side },
  });
}

function selectOrderSource(broker, capabilities, capabilityId, options) {
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

function buildNewOrderRequest(broker, sourceId, side, order) {
  const normalized = normalizeNewOrder(order);
  normalized.side = side;
  const params = buildBrokerNewOrder(broker, side, normalized);

  return {
    normalized,
    params: mergeParams(params, order.params),
  };
}

function buildModifyOrderRequest(broker, sourceId, side, order) {
  const normalized = normalizeModifyOrder(order);
  const params = buildBrokerModifyOrder(broker, normalized);

  return {
    normalized,
    params: mergeParams(params, order.params),
  };
}

function buildCancelOrderRequest(broker, sourceId, side, order) {
  const normalized = normalizeCancelOrder(order);
  const params = buildBrokerCancelOrder(broker, normalized);

  return {
    normalized,
    params: mergeParams(params, order.params),
  };
}

function buildBrokerNewOrder(broker, side, order) {
  if (broker === "kiwoom") {
    return buildKiwoomNewOrder(side, order);
  }
  if (broker === "ls") {
    return buildLsNewOrder(side, order);
  }
  if (broker === "db") {
    return buildDbNewOrder(side, order);
  }
  if (broker === "kis") {
    return buildKisNewOrder(side, order);
  }
  throw BrokerError.unsupported(`Unsupported order request broker: ${broker}`, { broker });
}

function buildBrokerModifyOrder(broker, order) {
  if (broker === "kiwoom") {
    return buildKiwoomModifyOrder(order);
  }
  if (broker === "ls") {
    return buildLsModifyOrder(order);
  }
  if (broker === "db") {
    return buildDbModifyOrder(order);
  }
  if (broker === "kis") {
    return buildKisModifyOrder(order);
  }
  throw BrokerError.unsupported(`Unsupported modify order request broker: ${broker}`, { broker });
}

function buildBrokerCancelOrder(broker, order) {
  if (broker === "kiwoom") {
    return buildKiwoomCancelOrder(order);
  }
  if (broker === "ls") {
    return buildLsCancelOrder(order);
  }
  if (broker === "db") {
    return buildDbCancelOrder(order);
  }
  if (broker === "kis") {
    return buildKisCancelOrder(order);
  }
  throw BrokerError.unsupported(`Unsupported cancel order request broker: ${broker}`, { broker });
}

function buildKiwoomNewOrder(side, order) {
  return {
    dmst_stex_tp: order.exchange,
    stk_cd: order.symbol,
    ord_qty: String(order.quantity),
    ord_uv: order.orderType === "market" ? "" : String(order.price),
    trde_tp: kiwoomTradeType(order.orderType),
    cond_uv: nullableRequestString(order.conditionPrice),
  };
}

function buildKiwoomModifyOrder(order) {
  return {
    dmst_stex_tp: order.exchange,
    orig_ord_no: order.originalOrderNumber,
    stk_cd: order.symbol,
    mdfy_qty: String(order.quantity),
    mdfy_uv: order.orderType === "market" ? "" : String(order.price),
    mdfy_cond_uv: nullableRequestString(order.conditionPrice),
  };
}

function buildKiwoomCancelOrder(order) {
  return {
    dmst_stex_tp: order.exchange,
    orig_ord_no: order.originalOrderNumber,
    stk_cd: order.symbol,
    cncl_qty: String(order.quantity),
  };
}

function buildLsNewOrder(side, order) {
  return {
    CSPAT00601InBlock1: {
      IsuNo: lsIssueNumber(order.symbol),
      OrdQty: order.quantity,
      OrdPrc: order.orderType === "market" ? 0 : order.price,
      BnsTpCode: side === "buy" ? "2" : "1",
      OrdprcPtnCode: lsOrderPriceType(order.orderType),
      MgntrnCode: order.marginCode,
      LoanDt: order.loanDate,
      OrdCndiTpCode: order.conditionTypeCode,
      MbrNo: order.exchange,
    },
  };
}

function buildLsModifyOrder(order) {
  return {
    CSPAT00701InBlock1: {
      OrgOrdNo: numberOrString(order.originalOrderNumber),
      IsuNo: lsIssueNumber(order.symbol),
      OrdQty: order.quantity,
      OrdprcPtnCode: lsOrderPriceType(order.orderType),
      OrdCndiTpCode: order.conditionTypeCode,
      OrdPrc: order.orderType === "market" ? 0 : order.price,
    },
  };
}

function buildLsCancelOrder(order) {
  return {
    CSPAT00801InBlock1: {
      OrgOrdNo: numberOrString(order.originalOrderNumber),
      IsuNo: lsIssueNumber(order.symbol),
      OrdQty: order.quantity,
    },
  };
}

function buildDbNewOrder(side, order) {
  return {
    In: {
      IsuNo: lsIssueNumber(order.symbol),
      TrchNo: 0,
      OrdQty: order.quantity,
      OrdPrc: order.orderType === "market" ? 0 : order.price,
      BnsTpCode: side === "buy" ? "2" : "1",
      OrdprcPtnCode: lsOrderPriceType(order.orderType),
      MgntrnCode: order.marginCode,
      LoanDt: order.loanDate,
      OrdCndiTpCode: order.conditionTypeCode,
    },
  };
}

function buildDbModifyOrder(order) {
  return {
    In: {
      OrgOrdNo: numberOrString(order.originalOrderNumber),
      IsuNo: lsIssueNumber(order.symbol),
      OrdQty: order.quantity,
      OrdprcPtnCode: lsOrderPriceType(order.orderType),
      OrdCndiTpCode: order.conditionTypeCode,
      OrdPrc: order.orderType === "market" ? 0 : order.price,
    },
  };
}

function buildDbCancelOrder(order) {
  return {
    In: {
      OrgOrdNo: numberOrString(order.originalOrderNumber),
      IsuNo: lsIssueNumber(order.symbol),
      OrdQty: order.quantity,
    },
  };
}

function buildKisNewOrder(side, order) {
  return {
    CANO: "",
    ACNT_PRDT_CD: "01",
    PDNO: order.symbol,
    ORD_DVSN: kisOrderDivision(order.orderType),
    ORD_QTY: String(order.quantity),
    ORD_UNPR: order.orderType === "market" ? "0" : String(order.price),
  };
}

function buildKisModifyOrder(order) {
  return {
    CANO: "",
    ACNT_PRDT_CD: "01",
    KRX_FWDG_ORD_ORGNO: "",
    ORGN_ODNO: order.originalOrderNumber,
    ORD_DVSN: kisOrderDivision(order.orderType),
    RVSE_CNCL_DVSN_CD: "01",
    ORD_QTY: String(order.quantity),
    ORD_UNPR: order.orderType === "market" ? "0" : String(order.price),
    QTY_ALL_ORD_YN: "N",
  };
}

function buildKisCancelOrder(order) {
  return {
    CANO: "",
    ACNT_PRDT_CD: "01",
    KRX_FWDG_ORD_ORGNO: "",
    ORGN_ODNO: order.originalOrderNumber,
    ORD_DVSN: "00",
    RVSE_CNCL_DVSN_CD: "02",
    ORD_QTY: String(order.quantity),
    ORD_UNPR: "0",
    QTY_ALL_ORD_YN: "N",
  };
}

function normalizeNewOrder(order) {
  const normalized = normalizeBaseOrder(order);
  validatePriceForOrderType(normalized);
  return normalized;
}

function normalizeModifyOrder(order) {
  const normalized = normalizeBaseOrder(order);
  normalized.side = "modify";
  normalized.originalOrderNumber = normalizeRequiredString(order.originalOrderNumber, "originalOrderNumber");
  validatePriceForOrderType(normalized);
  return normalized;
}

function normalizeCancelOrder(order) {
  return {
    symbol: normalizeSymbol(order.symbol),
    quantity: normalizeQuantity(order.quantity),
    side: "cancel",
    exchange: normalizeExchange(order.exchange),
    originalOrderNumber: normalizeRequiredString(order.originalOrderNumber, "originalOrderNumber"),
  };
}

function normalizeBaseOrder(order) {
  const price = normalizeOptionalPrice(order.price);
  const estimatedPrice = normalizeOptionalPrice(order.estimatedPrice);

  return {
    symbol: normalizeSymbol(order.symbol),
    quantity: normalizeQuantity(order.quantity),
    price,
    estimatedPrice,
    orderType: normalizeOrderType(order.orderType),
    exchange: normalizeExchange(order.exchange),
    conditionPrice: order.conditionPrice,
    conditionTypeCode: normalizeOptionalString(order.conditionTypeCode, "0"),
    marginCode: normalizeOptionalString(order.marginCode, "000"),
    loanDate: normalizeOptionalString(order.loanDate, ""),
  };
}

function validatePriceForOrderType(order) {
  if (order.orderType !== "market" && order.price === null) {
    throw BrokerError.validation("Limit-like orders require price", {
      details: { orderType: order.orderType },
    });
  }
}

function normalizeSymbol(symbol) {
  const normalized = String(symbol ?? "").trim().replace(/^[AJQ]/, "");
  if (!normalized) {
    throw BrokerError.validation("Domestic stock symbol is required");
  }

  return normalized;
}

function normalizeQuantity(quantity) {
  const normalized = Number(quantity);
  if (!Number.isInteger(normalized) || normalized <= 0) {
    throw BrokerError.validation("Order quantity must be a positive integer", {
      details: { quantity },
    });
  }

  return normalized;
}

function normalizeOptionalPrice(price) {
  if (price === undefined || price === null || price === "") {
    return null;
  }

  const normalized = Number(price);
  if (!Number.isFinite(normalized) || normalized < 0) {
    throw BrokerError.validation("Order price must be a non-negative number", {
      details: { price },
    });
  }

  return normalized;
}

function normalizeOrderType(orderType) {
  const normalized = String(orderType ?? "market").trim();
  if (!["market", "limit"].includes(normalized)) {
    throw BrokerError.validation("Unsupported domestic stock order type", {
      details: { orderType },
    });
  }

  return normalized;
}

function normalizeExchange(exchange) {
  const normalized = String(exchange ?? "KRX").trim().toUpperCase();
  if (!normalized) {
    throw BrokerError.validation("Exchange is required");
  }

  return normalized;
}

function normalizeRequiredString(value, field) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation(`${field} is required`, {
      details: { field },
    });
  }

  return normalized;
}

function normalizeOptionalString(value, fallback) {
  const normalized = String(value ?? fallback).trim();
  return normalized;
}

function evaluateOrderSafety(order, params, options) {
  const rules = {
    maxOrderAmount: normalizeOptionalPositiveNumber(options.maxOrderAmount, "maxOrderAmount"),
    allowedSymbols: normalizeSymbolSet(options.allowedSymbols),
    blockedSymbols: normalizeSymbolSet(options.blockedSymbols),
  };
  const orderValue = estimateOrderValue(order);
  const checks = [];

  if (rules.allowedSymbols && !rules.allowedSymbols.has(order.symbol)) {
    checks.push({
      ok: false,
      code: "SYMBOL_NOT_ALLOWED",
      message: `Symbol ${order.symbol} is not in allowedSymbols`,
    });
  }

  if (rules.blockedSymbols?.has(order.symbol)) {
    checks.push({
      ok: false,
      code: "SYMBOL_BLOCKED",
      message: `Symbol ${order.symbol} is in blockedSymbols`,
    });
  }

  if (rules.maxOrderAmount !== null) {
    if (orderValue === null) {
      checks.push({
        ok: false,
        code: "ORDER_VALUE_REQUIRED",
        message: "maxOrderAmount requires price or estimatedPrice",
      });
    } else if (orderValue > rules.maxOrderAmount) {
      checks.push({
        ok: false,
        code: "ORDER_VALUE_EXCEEDED",
        message: `Order value ${orderValue} exceeds maxOrderAmount ${rules.maxOrderAmount}`,
      });
    }
  }

  const failed = checks.find((check) => !check.ok);

  return {
    allowed: !failed,
    reason: failed?.message ?? "Order safety checks passed",
    failedCode: failed?.code ?? null,
    requiresMarketOrderConfirmation: order.orderType === "market" && order.side !== "cancel",
    orderValue,
    rules: {
      maxOrderAmount: rules.maxOrderAmount,
      allowedSymbols: rules.allowedSymbols ? [...rules.allowedSymbols] : null,
      blockedSymbols: rules.blockedSymbols ? [...rules.blockedSymbols] : null,
    },
    checks,
    auditRequest: maskOrderRequest(params),
  };
}

function estimateOrderValue(order) {
  if (order.side === "cancel") {
    return 0;
  }

  const price = order.price ?? order.estimatedPrice;
  if (price === null) {
    return null;
  }

  return order.quantity * price;
}

function normalizeOptionalPositiveNumber(value, field) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized <= 0) {
    throw BrokerError.validation(`${field} must be a positive number`, {
      details: { [field]: value },
    });
  }

  return normalized;
}

function normalizeSymbolSet(symbols) {
  if (symbols === undefined || symbols === null) {
    return null;
  }

  if (!Array.isArray(symbols)) {
    throw BrokerError.validation("Symbol safety lists must be arrays");
  }

  return new Set(symbols.map((symbol) => normalizeSymbol(symbol)));
}

function kiwoomTradeType(orderType) {
  return orderType === "market" ? "3" : "0";
}

function lsOrderPriceType(orderType) {
  return orderType === "market" ? "03" : "00";
}

function kisOrderDivision(orderType) {
  return orderType === "market" ? "01" : "00";
}

function lsIssueNumber(symbol) {
  return `A${symbol}`;
}

function nullableRequestString(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

function numberOrString(value) {
  const normalized = Number(value);
  return Number.isSafeInteger(normalized) ? normalized : value;
}

function normalizeKiwoomOrder(sourceId, side, payload) {
  return {
    broker: "kiwoom",
    side,
    orderNumber: nullableString(firstValue(payload, ["ord_no"])),
    originalOrderNumber: nullableString(firstValue(payload, ["base_orig_ord_no"])),
    quantity: parseNumber(firstValue(payload, ["mdfy_qty", "cncl_qty"])),
    exchange: nullableString(firstValue(payload, ["dmst_stex_tp"])),
    message: nullableString(firstValue(payload, ["return_msg"])),
    source: {
      broker: "kiwoom",
      id: sourceId,
      capabilityId: capabilityIdForSide(side),
    },
  };
}

function normalizeLsOrder(sourceId, side, payload) {
  const block = payload?.[`${sourceId}OutBlock2`] ?? {};

  return {
    broker: "ls",
    side,
    orderNumber: nullableString(firstValue(block, ["OrdNo"])),
    originalOrderNumber: nullableString(firstValue(block, ["PrntOrdNo"])),
    symbol: stripLsIssueNumber(nullableString(firstValue(block, ["ShtnIsuNo"]))),
    symbolRaw: nullableString(firstValue(block, ["ShtnIsuNo"])),
    name: nullableString(firstValue(block, ["IsuNm"])),
    orderAmount: parseNumber(firstValue(block, ["OrdAmt"])),
    orderTime: nullableString(firstValue(block, ["OrdTime"])),
    message: nullableString(firstValue(payload, ["rsp_msg"])),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: capabilityIdForSide(side),
    },
  };
}

function normalizeDbOrder(sourceId, side, payload) {
  const block = payload?.Out ?? payload?.Out2 ?? {};

  return {
    broker: "db",
    side,
    orderNumber: nullableString(firstValue(block, ["OrdNo"])),
    originalOrderNumber: nullableString(firstValue(block, ["PrntOrdNo", "OrgOrdNo"])),
    symbol: stripLsIssueNumber(nullableString(firstValue(block, ["ShtnIsuNo", "IsuNo"]))),
    symbolRaw: nullableString(firstValue(block, ["ShtnIsuNo", "IsuNo"])),
    name: nullableString(firstValue(block, ["IsuNm"])),
    orderAmount: parseNumber(firstValue(block, ["MnyOrdAmt", "OrdAmt"])),
    orderTime: nullableString(firstValue(block, ["OrdTime"])),
    message: nullableString(firstValue(payload, ["rsp_msg", "message"])),
    source: {
      broker: "db",
      id: sourceId,
      capabilityId: capabilityIdForSide(side),
    },
  };
}

function normalizeKisOrder(sourceId, side, payload) {
  const block = payload?.output ?? payload;

  return {
    broker: "kis",
    side,
    orderNumber: nullableString(firstValue(block, ["ODNO", "odno"])),
    originalOrderNumber: nullableString(firstValue(block, ["ORGN_ODNO", "orgn_odno"])),
    message: nullableString(firstValue(payload, ["msg1", "message"])),
    source: {
      broker: "kis",
      id: sourceId,
      capabilityId: capabilityIdForSide(side),
    },
  };
}

function capabilityIdForSide(side) {
  if (side === "buy") {
    return BUY_CAPABILITY_ID;
  }

  if (side === "sell") {
    return SELL_CAPABILITY_ID;
  }

  if (side === "modify") {
    return MODIFY_CAPABILITY_ID;
  }

  return CANCEL_CAPABILITY_ID;
}

function previewResponse({ broker, source, capabilityId, side, params, normalizedOrder, safety }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: source.id,
    dryRun: true,
    data: {
      broker,
      side,
      request: params,
      normalized: redactOrder(normalizedOrder),
      safety,
      source: {
        broker,
        id: source.id,
        capabilityId,
      },
    },
    raw: null,
    headers: {},
    status: 0,
    continuation: undefined,
  };
}

function successResponse({ broker, source, result, data, capabilityId, params, safety }) {
  return {
    ok: true,
    broker,
    capability: capabilityId,
    id: source.id,
    dryRun: false,
    data,
    request: params,
    audit: {
      request: safety.auditRequest,
      safety,
    },
    raw: result.raw,
    headers: result.headers ?? {},
    status: result.status ?? 0,
    continuation: result.continuation,
  };
}

function failureResponse({ broker, source, result, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Order service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: source?.id ?? result?.id ?? null,
    dryRun: false,
    data: null,
    raw: result?.raw ?? null,
    headers: result?.headers ?? {},
    status: result?.status ?? brokerError.status ?? 0,
    continuation: result?.continuation,
    error: brokerError,
  };
}

function redactOrder(order) {
  const { params, ...rest } = order ?? {};
  return rest;
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

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function maskOrderRequest(value) {
  if (Array.isArray(value)) {
    return value.map((item) => maskOrderRequest(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const masked = {};
  for (const [key, child] of Object.entries(value)) {
    if (/acnt|pwd|password|inptpwd/i.test(key)) {
      masked[key] = "***";
    } else {
      masked[key] = maskOrderRequest(child);
    }
  }

  return masked;
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

function stripLsIssueNumber(value) {
  if (!value) {
    return null;
  }

  return String(value).replace(/^[AJQ]/, "");
}
