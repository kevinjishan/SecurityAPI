import { getCapabilities } from "../capabilities/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const NEW_CAPABILITY_ID = "overseasStock.order.new";
const MODIFY_CAPABILITY_ID = "overseasStock.order.modify";
const CANCEL_CAPABILITY_ID = "overseasStock.order.cancel";
const RESERVE_CAPABILITY_ID = "overseasStock.order.reserve";

const MARKET_PRICE_TYPE_CODES = new Set(["03", "M3", "M4"]);

export class OverseasStockOrderService {
  constructor(clients = {}) {
    this.clients = clients;
  }

  async buyOverseasStock(broker, order = {}, options = {}) {
    return this.#requestOrder({
      broker,
      order,
      options,
      side: "buy",
      capabilityId: NEW_CAPABILITY_ID,
      prepare: prepareNewOrder,
    });
  }

  async sellOverseasStock(broker, order = {}, options = {}) {
    return this.#requestOrder({
      broker,
      order,
      options,
      side: "sell",
      capabilityId: NEW_CAPABILITY_ID,
      prepare: prepareNewOrder,
    });
  }

  async modifyOverseasStockOrder(broker, order = {}, options = {}) {
    return this.#requestOrder({
      broker,
      order,
      options,
      side: "modify",
      capabilityId: MODIFY_CAPABILITY_ID,
      prepare: prepareModifyOrder,
    });
  }

  async cancelOverseasStockOrder(broker, order = {}, options = {}) {
    return this.#requestOrder({
      broker,
      order,
      options,
      side: "cancel",
      capabilityId: CANCEL_CAPABILITY_ID,
      prepare: prepareCancelOrder,
    });
  }

  async submitOverseasStockReservedOrder(broker, order = {}, options = {}) {
    return this.#requestOrder({
      broker,
      order,
      options,
      side: "reserve",
      capabilityId: RESERVE_CAPABILITY_ID,
      prepare: prepareReservedOrder,
    });
  }

  async #requestOrder({ broker, order, options, side, capabilityId, prepare }) {
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
      const prepared = prepare(normalizedBroker, source.id, side, order, options, capabilityId);
      const safety = evaluateOrderSafety(prepared.normalized, prepared.params, options);
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
          params: prepared.params,
          normalizedOrder: prepared.normalized,
          safety,
        });
      }

      const liveGuard = evaluateLiveOrderGuard(prepared.normalized, prepared.params, safety, options);
      if (!liveGuard.allowed) {
        return failureResponse({
          broker: normalizedBroker,
          source,
          capabilityId,
          error: BrokerError.validation(liveGuard.reason, {
            broker: normalizedBroker,
            id: source.id,
            details: liveGuard.details,
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

      const result = await client.request(source.id, prepared.params, {
        ...(options.requestOptions ?? {}),
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
        params: prepared.params,
        safety,
        data: normalizeOverseasStockOrder(normalizedBroker, source.id, side, result.data),
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

export function normalizeOverseasStockOrder(broker, sourceId, side, payload) {
  if (broker !== "ls") {
    throw BrokerError.unsupported(`Unsupported overseas order normalization broker: ${broker}`, {
      broker,
      details: { sourceId, side },
    });
  }

  if (sourceId === "COSAT00400") {
    return normalizeLsReservedOrder(sourceId, side, payload);
  }

  return normalizeLsOverseasOrder(sourceId, side, payload);
}

function selectOrderSource(broker, capabilities, capabilityId, options) {
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

function prepareNewOrder(broker, sourceId, side, order, options, capabilityId) {
  assertLsOnly(broker, sourceId, "overseas new order");
  const normalized = normalizeBaseOrder(order, options, capabilityId, {
    side,
    requirePositiveQuantity: true,
    requirePrice: true,
  });

  normalized.side = side;
  const params = {
    COSAT00301InBlock1: {
      RecCnt: normalized.recCount,
      OrdPtnCode: side === "buy" ? "02" : "01",
      OrgOrdNo: 0,
      OrdMktCode: normalized.marketCode,
      IsuNo: normalized.symbol,
      OrdQty: normalized.quantity,
      OvrsOrdPrc: normalized.isMarketLike ? 0 : normalized.price,
      OrdprcPtnCode: normalized.priceTypeCode,
      BrkTpCode: normalized.brokerTypeCode,
    },
  };

  return {
    normalized,
    params: mergeParams(params, order.params),
  };
}

function prepareModifyOrder(broker, sourceId, side, order, options, capabilityId) {
  assertLsOnly(broker, sourceId, "overseas modify order");
  const normalized = normalizeBaseOrder(order, options, capabilityId, {
    side,
    requirePositiveQuantity: false,
    requirePrice: true,
  });
  normalized.originalOrderNumber = normalizeOrderNumber(
    firstNonBlank(order.originalOrderNumber, order.originalOrderNo, order.OrgOrdNo),
    "originalOrderNumber",
    capabilityId,
  );

  const params = {
    COSAT00311InBlock1: {
      RecCnt: normalized.recCount,
      OrdPtnCode: "07",
      OrgOrdNo: numberOrString(normalized.originalOrderNumber),
      OrdMktCode: normalized.marketCode,
      IsuNo: normalized.symbol,
      OrdQty: normalized.quantity,
      OvrsOrdPrc: normalized.isMarketLike ? 0 : normalized.price,
      OrdprcPtnCode: normalized.priceTypeCode,
      BrkTpCode: normalized.brokerTypeCode,
    },
  };

  return {
    normalized,
    params: mergeParams(params, order.params),
  };
}

function prepareCancelOrder(broker, sourceId, side, order, options, capabilityId) {
  assertLsOnly(broker, sourceId, "overseas cancel order");
  const normalized = normalizeBaseOrder(order, options, capabilityId, {
    side,
    requirePositiveQuantity: true,
    requirePrice: false,
  });
  normalized.originalOrderNumber = normalizeOrderNumber(
    firstNonBlank(order.originalOrderNumber, order.originalOrderNo, order.OrgOrdNo),
    "originalOrderNumber",
    capabilityId,
  );
  normalized.price = normalized.price ?? 0;
  normalized.priceTypeCode = firstNonBlank(order.priceTypeCode, order.OrdprcPtnCode, options.priceTypeCode, "00");
  normalized.orderType = "cancel";
  normalized.isMarketLike = false;

  const params = {
    COSAT00301InBlock1: {
      RecCnt: normalized.recCount,
      OrdPtnCode: "08",
      OrgOrdNo: numberOrString(normalized.originalOrderNumber),
      OrdMktCode: normalized.marketCode,
      IsuNo: normalized.symbol,
      OrdQty: normalized.quantity,
      OvrsOrdPrc: 0,
      OrdprcPtnCode: normalized.priceTypeCode,
      BrkTpCode: normalized.brokerTypeCode,
    },
  };

  return {
    normalized,
    params: mergeParams(params, order.params),
  };
}

function prepareReservedOrder(broker, sourceId, side, order, options, capabilityId) {
  assertLsOnly(broker, sourceId, "overseas reserved order");
  const reservedSide = normalizeReservedOrderSide(
    firstNonBlank(order.side, order.tradeSide, order.BnsTpCode, options.side, options.tradeSide, options.sideCode),
    capabilityId,
  );
  const normalized = normalizeBaseOrder(order, options, capabilityId, {
    side: reservedSide,
    requirePositiveQuantity: true,
    requirePrice: true,
  });
  normalized.action = side;

  normalized.transactionType = normalizeRequiredString(
    firstNonBlank(order.transactionType, order.transactionTypeCode, order.TrxTpCode, options.transactionType, options.transactionTypeCode),
    "transactionType",
    capabilityId,
  );
  normalized.countryCode = normalizeRequiredString(
    firstNonBlank(order.countryCode, order.country, order.CntryCode, options.countryCode, options.country),
    "countryCode",
    capabilityId,
  );
  normalized.accountNumber = normalizeRequiredString(
    firstNonBlank(order.accountNumber, order.accountNo, order.AcntNo, options.accountNumber, options.accountNo),
    "accountNumber",
    capabilityId,
  );
  normalized.password = normalizeRequiredString(
    firstNonBlank(order.password, order.pwd, order.Pwd, options.password, options.pwd),
    "password",
    capabilityId,
  );
  normalized.reservedOrderInputDate = normalizeDate(
    firstNonBlank(order.reservedOrderInputDate, order.RsvOrdInptDt, options.reservedOrderInputDate),
    "reservedOrderInputDate",
    capabilityId,
  );
  normalized.reservedOrderNumber = normalizeNonNegativeInteger(
    order.reservedOrderNumber ?? order.RsvOrdNo ?? options.reservedOrderNumber ?? 0,
    "reservedOrderNumber",
    capabilityId,
  );
  normalized.reservedOrderStartDate = normalizeDate(
    firstNonBlank(order.reservedOrderStartDate, order.startDate, order.RsvOrdSrtDt, options.reservedOrderStartDate, options.startDate),
    "reservedOrderStartDate",
    capabilityId,
  );
  normalized.reservedOrderEndDate = normalizeDate(
    firstNonBlank(order.reservedOrderEndDate, order.endDate, order.RsvOrdEndDt, options.reservedOrderEndDate, options.endDate),
    "reservedOrderEndDate",
    capabilityId,
  );
  normalized.conditionCode = normalizeRequiredString(
    firstNonBlank(order.conditionCode, order.RsvOrdCndiCode, options.conditionCode, "00"),
    "conditionCode",
    capabilityId,
  );
  normalized.marginCode = normalizeOptionalString(firstNonBlank(order.marginCode, order.MgntrnCode, options.marginCode), "000");
  normalized.loanDate = normalizeOptionalString(firstNonBlank(order.loanDate, order.LoanDt, options.loanDate), "");
  normalized.loanDetailClassCode = normalizeOptionalString(
    firstNonBlank(order.loanDetailClassCode, order.LoanDtlClssCode, options.loanDetailClassCode),
    "",
  );

  const params = {
    COSAT00400InBlock1: {
      RecCnt: normalized.recCount,
      TrxTpCode: normalized.transactionType,
      CntryCode: normalized.countryCode,
      RsvOrdInptDt: normalized.reservedOrderInputDate,
      RsvOrdNo: normalized.reservedOrderNumber,
      BnsTpCode: sideCodeFor(normalized.side),
      AcntNo: normalized.accountNumber,
      Pwd: normalized.password,
      FcurrMktCode: normalized.marketCode,
      IsuNo: normalized.symbol,
      OrdQty: normalized.quantity,
      OvrsOrdPrc: normalized.isMarketLike ? 0 : normalized.price,
      OrdprcPtnCode: normalized.priceTypeCode,
      RsvOrdSrtDt: normalized.reservedOrderStartDate,
      RsvOrdEndDt: normalized.reservedOrderEndDate,
      RsvOrdCndiCode: normalized.conditionCode,
      MgntrnCode: normalized.marginCode,
      LoanDt: normalized.loanDate,
      LoanDtlClssCode: normalized.loanDetailClassCode,
    },
  };

  return {
    normalized,
    params: mergeParams(params, order.params),
  };
}

function normalizeBaseOrder(order = {}, options = {}, capabilityId, behavior) {
  const side = behavior.side;
  const priceTypeCode = normalizePriceTypeCode(order, options, side, capabilityId);
  const isMarketLike = MARKET_PRICE_TYPE_CODES.has(priceTypeCode);
  const price = isMarketLike && (order.price === undefined || order.price === null || order.price === "")
    ? 0
    : normalizeOptionalPrice(firstNonBlank(order.price, order.OvrsOrdPrc));

  if (behavior.requirePrice && !isMarketLike && price === null) {
    throw BrokerError.validation("Overseas limit-like orders require price", {
      details: { capabilityId, orderType: order.orderType, priceTypeCode },
    });
  }

  return {
    broker: "ls",
    side,
    symbol: normalizeSymbol(firstNonBlank(order.symbol, order.issueNumber, order.IsuNo), capabilityId),
    quantity: behavior.requirePositiveQuantity
      ? normalizePositiveInteger(firstNonBlank(order.quantity, order.OrdQty), "quantity", capabilityId)
      : normalizeNonNegativeInteger(order.quantity ?? order.OrdQty ?? options.quantity ?? 0, "quantity", capabilityId),
    price,
    estimatedPrice: normalizeOptionalPrice(firstNonBlank(order.estimatedPrice, options.estimatedPrice)),
    orderType: normalizeOrderType(order.orderType, priceTypeCode),
    priceTypeCode,
    isMarketLike,
    marketCode: normalizeRequiredString(
      firstNonBlank(order.marketCode, order.exchangeCode, order.exchange, order.OrdMktCode, order.FcurrMktCode, options.marketCode, options.exchangeCode, options.exchange),
      "marketCode",
      capabilityId,
    ),
    exchangeCode: normalizeRequiredString(
      firstNonBlank(order.exchangeCode, order.exchange, order.marketCode, options.exchangeCode, options.exchange, options.marketCode),
      "exchangeCode",
      capabilityId,
    ),
    currencyCode: nullableString(firstNonBlank(order.currencyCode, order.currency, options.currencyCode, options.currency)),
    tradingSession: nullableString(firstNonBlank(order.tradingSession, order.session, options.tradingSession, options.session)),
    brokerTypeCode: normalizeOptionalString(firstNonBlank(order.brokerTypeCode, order.BrkTpCode, options.brokerTypeCode), ""),
    recCount: normalizePositiveInteger(order.recCount ?? order.RecCnt ?? options.recCount ?? 1, "recCount", capabilityId),
  };
}

function normalizePriceTypeCode(order, options, side, capabilityId) {
  const explicit = firstNonBlank(order.priceTypeCode, order.OrdprcPtnCode, options.priceTypeCode);
  if (explicit) {
    if (side === "buy" && MARKET_PRICE_TYPE_CODES.has(explicit)) {
      throw BrokerError.validation("LS overseas buy orders only expose limit-like price types in the current service", {
        details: { capabilityId, side, priceTypeCode: explicit },
      });
    }

    return explicit;
  }

  const orderType = String(order.orderType ?? options.orderType ?? "limit").trim().toLowerCase();
  const code = {
    limit: "00",
    market: "03",
    loo: "M1",
    loc: "M2",
    moo: "M3",
    moc: "M4",
  }[orderType];

  if (!code) {
    throw BrokerError.validation("Unsupported overseas stock order type", {
      details: { capabilityId, orderType },
    });
  }

  if (side === "buy" && MARKET_PRICE_TYPE_CODES.has(code)) {
    throw BrokerError.validation("LS overseas buy orders only expose limit-like price types in the current service", {
      details: { capabilityId, side, orderType, priceTypeCode: code },
    });
  }

  return code;
}

function normalizeOrderType(orderType, priceTypeCode) {
  if (orderType) {
    return String(orderType).trim().toLowerCase();
  }

  if (priceTypeCode === "03") {
    return "market";
  }

  if (priceTypeCode === "M1") {
    return "loo";
  }

  if (priceTypeCode === "M2") {
    return "loc";
  }

  if (priceTypeCode === "M3") {
    return "moo";
  }

  if (priceTypeCode === "M4") {
    return "moc";
  }

  return "limit";
}

function normalizeReservedOrderSide(value, capabilityId) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "buy" || normalized === "2" || normalized === "매수") {
    return "buy";
  }

  if (normalized === "sell" || normalized === "1" || normalized === "매도") {
    return "sell";
  }

  throw BrokerError.validation("Reserved overseas order side is required", {
    details: { capabilityId, field: "side" },
  });
}

function evaluateOrderSafety(order, params, options) {
  const rules = {
    maxOrderAmount: normalizeOptionalPositiveNumber(options.maxOrderAmount, "maxOrderAmount"),
    allowedSymbols: normalizeSymbolSet(options.allowedSymbols),
    blockedSymbols: normalizeSymbolSet(options.blockedSymbols),
    allowedMarketCodes: normalizeStringSet(options.allowedMarketCodes, "allowedMarketCodes"),
    allowedCurrencyCodes: normalizeStringSet(options.allowedCurrencyCodes, "allowedCurrencyCodes"),
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

  if (rules.allowedMarketCodes && !rules.allowedMarketCodes.has(order.marketCode)) {
    checks.push({
      ok: false,
      code: "MARKET_NOT_ALLOWED",
      message: `Market ${order.marketCode} is not in allowedMarketCodes`,
    });
  }

  if (rules.allowedCurrencyCodes && !rules.allowedCurrencyCodes.has(order.currencyCode)) {
    checks.push({
      ok: false,
      code: "CURRENCY_NOT_ALLOWED",
      message: `Currency ${order.currencyCode ?? "(none)"} is not in allowedCurrencyCodes`,
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
    requiresMarketOrderConfirmation: order.isMarketLike && order.side !== "cancel",
    orderValue,
    rules: {
      maxOrderAmount: rules.maxOrderAmount,
      allowedSymbols: rules.allowedSymbols ? [...rules.allowedSymbols] : null,
      blockedSymbols: rules.blockedSymbols ? [...rules.blockedSymbols] : null,
      allowedMarketCodes: rules.allowedMarketCodes ? [...rules.allowedMarketCodes] : null,
      allowedCurrencyCodes: rules.allowedCurrencyCodes ? [...rules.allowedCurrencyCodes] : null,
    },
    checks,
    auditRequest: maskOrderRequest(params),
  };
}

function evaluateLiveOrderGuard(order, params, safety, options) {
  if (options.confirm !== true) {
    return {
      allowed: false,
      reason: "Live overseas order requires options.confirm === true",
      details: {
        dryRun: false,
        confirm: options.confirm ?? false,
      },
    };
  }

  if (safety.requiresMarketOrderConfirmation && options.confirmMarketOrder !== true) {
    return {
      allowed: false,
      reason: "Market-like live overseas order requires options.confirmMarketOrder === true",
      details: safety,
    };
  }

  if (!order.currencyCode) {
    return {
      allowed: false,
      reason: "Live overseas order requires currencyCode",
      details: {
        field: "currencyCode",
        capabilityId: capabilityIdForSide(order.side),
      },
    };
  }

  if (!order.marketCode || !order.exchangeCode) {
    return {
      allowed: false,
      reason: "Live overseas order requires marketCode and exchangeCode",
      details: {
        marketCode: order.marketCode,
        exchangeCode: order.exchangeCode,
      },
    };
  }

  if (!order.tradingSession) {
    return {
      allowed: false,
      reason: "Live overseas order requires tradingSession",
      details: {
        field: "tradingSession",
      },
    };
  }

  if (options.expectedRequest !== undefined && !deepEqual(params, options.expectedRequest)) {
    return {
      allowed: false,
      reason: "Live overseas order request does not match expectedRequest",
      details: {
        expectedRequest: options.expectedRequest,
        actualRequest: params,
      },
    };
  }

  return {
    allowed: true,
    reason: "Live order guard passed",
    details: {},
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

function normalizeLsOverseasOrder(sourceId, side, payload) {
  const request = objectBlock(payload, `${sourceId}OutBlock1`);
  const result = objectBlock(payload, `${sourceId}OutBlock2`);

  return {
    broker: "ls",
    side,
    orderNumber: nullableString(firstValue(result, ["OrdNo"])),
    originalOrderNumber: nullableString(firstValue(request, ["OrgOrdNo"])),
    accountName: nullableString(firstValue(result, ["AcntNm"])),
    symbol: nullableString(firstValue(request, ["IsuNo"]) ?? firstValue(result, ["ShtnIsuNo"])),
    name: nullableString(firstValue(result, ["IsuNm"])),
    orderPatternCode: nullableString(firstValue(request, ["OrdPtnCode"])),
    marketCode: nullableString(firstValue(request, ["OrdMktCode"])),
    quantity: parseNumber(firstValue(request, ["OrdQty"])),
    quantityRaw: nullableString(firstValue(request, ["OrdQty"])),
    price: parseNumber(firstValue(request, ["OvrsOrdPrc"])),
    priceRaw: nullableString(firstValue(request, ["OvrsOrdPrc"])),
    priceTypeCode: nullableString(firstValue(request, ["OrdprcPtnCode"])),
    brokerTypeCode: nullableString(firstValue(request, ["BrkTpCode"])),
    message: nullableString(firstValue(payload, ["rsp_msg"])),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: capabilityIdForSide(side),
    },
    raw: {
      request,
      result,
    },
  };
}

function normalizeLsReservedOrder(sourceId, side, payload) {
  const request = objectBlock(payload, `${sourceId}OutBlock1`);
  const result = objectBlock(payload, `${sourceId}OutBlock2`);

  return {
    broker: "ls",
    side,
    reservedOrderNumber: nullableString(firstValue(result, ["RsvOrdNo"]) ?? firstValue(request, ["RsvOrdNo"])),
    transactionType: nullableString(firstValue(request, ["TrxTpCode"])),
    countryCode: nullableString(firstValue(request, ["CntryCode"])),
    symbol: nullableString(firstValue(request, ["IsuNo"])),
    marketCode: nullableString(firstValue(request, ["FcurrMktCode"])),
    sideCode: nullableString(firstValue(request, ["BnsTpCode"])),
    quantity: parseNumber(firstValue(request, ["OrdQty"])),
    quantityRaw: nullableString(firstValue(request, ["OrdQty"])),
    price: parseNumber(firstValue(request, ["OvrsOrdPrc"])),
    priceRaw: nullableString(firstValue(request, ["OvrsOrdPrc"])),
    priceTypeCode: nullableString(firstValue(request, ["OrdprcPtnCode"])),
    reservedOrderStartDate: nullableString(firstValue(request, ["RsvOrdSrtDt"])),
    reservedOrderEndDate: nullableString(firstValue(request, ["RsvOrdEndDt"])),
    conditionCode: nullableString(firstValue(request, ["RsvOrdCndiCode"])),
    message: nullableString(firstValue(payload, ["rsp_msg"])),
    source: {
      broker: "ls",
      id: sourceId,
      capabilityId: RESERVE_CAPABILITY_ID,
    },
    raw: {
      request,
      result,
    },
  };
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
    : BrokerError.unknown(error?.message ?? "Overseas stock order service failed", {
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

function normalizeSymbol(symbol, capabilityId) {
  const normalized = String(symbol ?? "").trim().replace(/^[AJQ]/, "");
  if (!normalized) {
    throw BrokerError.validation("Overseas stock symbol is required", {
      details: { capabilityId, field: "symbol" },
    });
  }

  return normalized;
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

function normalizeOptionalPrice(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized < 0) {
    throw BrokerError.validation("Order price must be a non-negative number", {
      details: { price: value },
    });
  }

  return normalized;
}

function normalizeOrderNumber(value, field, capabilityId) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation(`${field} is required`, {
      details: { capabilityId, field },
    });
  }

  return normalized;
}

function normalizeRequiredString(value, field, capabilityId) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation(`Overseas stock order ${field} is required`, {
      details: { capabilityId, field },
    });
  }

  return normalized;
}

function normalizeDate(value, field, capabilityId) {
  const normalized = String(value ?? "").replace(/-/g, "").trim();
  if (!/^\d{8}$/.test(normalized)) {
    throw BrokerError.validation(`${field} must be YYYYMMDD`, {
      details: { capabilityId, field, value },
    });
  }

  return normalized;
}

function normalizeOptionalString(value, fallback) {
  const normalized = String(value ?? fallback).trim();
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

function normalizeStringSet(values, field) {
  if (values === undefined || values === null) {
    return null;
  }

  if (!Array.isArray(values)) {
    throw BrokerError.validation(`${field} must be an array`);
  }

  return new Set(values.map((value) => String(value).trim()).filter(Boolean));
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

function objectBlock(payload, key) {
  const block = payload?.[key] ?? payload?.[`-${key}`];
  return block && typeof block === "object" && !Array.isArray(block) ? block : {};
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

function sideCodeFor(side) {
  return side === "sell" ? "1" : "2";
}

function capabilityIdForSide(side) {
  if (side === "modify") {
    return MODIFY_CAPABILITY_ID;
  }

  if (side === "cancel") {
    return CANCEL_CAPABILITY_ID;
  }

  if (side === "reserve") {
    return RESERVE_CAPABILITY_ID;
  }

  return NEW_CAPABILITY_ID;
}

function numberOrString(value) {
  const normalized = Number(value);
  return Number.isSafeInteger(normalized) ? normalized : value;
}

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function redactOrder(order) {
  const { password, params, ...rest } = order ?? {};
  if (order?.accountNumber) {
    rest.accountNumber = "***";
  }

  if (password !== undefined) {
    rest.password = "***";
  }

  return rest;
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

function assertLsOnly(broker, sourceId, label) {
  if (broker !== "ls") {
    throw BrokerError.unsupported(`Unsupported ${label} broker: ${broker}`, {
      broker,
      details: { sourceId },
    });
  }
}

function normalizeId(value) {
  return String(value ?? "").trim().toLowerCase();
}
