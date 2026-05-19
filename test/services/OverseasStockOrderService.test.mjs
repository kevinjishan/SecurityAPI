import assert from "node:assert/strict";
import test from "node:test";

import {
  BROKER_ERROR_CODES,
  BrokerError,
  OverseasStockOrderService,
  normalizeOverseasStockOrder,
} from "../../src/index.mjs";
import { OverseasStockOrderService as OverseasStockOrderServiceFromPackage } from "security-api-reference/services";

test("exports OverseasStockOrderService through package service entry", () => {
  assert.equal(OverseasStockOrderServiceFromPackage, OverseasStockOrderService);
});

test("builds an LS overseas buy limit order dry run", async () => {
  let called = false;
  const service = new OverseasStockOrderService({
    ls: {
      request: async () => {
        called = true;
      },
    },
  });

  const result = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 5,
    price: 70,
    orderType: "limit",
  });

  assert.equal(result.ok, true);
  assert.equal(result.dryRun, true);
  assert.equal(result.id, "COSAT00301");
  assert.equal(called, false);
  assert.deepEqual(result.data.request, {
    COSAT00301InBlock1: {
      RecCnt: 1,
      OrdPtnCode: "02",
      OrgOrdNo: 0,
      OrdMktCode: "82",
      IsuNo: "PLTR",
      OrdQty: 5,
      OvrsOrdPrc: 70,
      OrdprcPtnCode: "00",
      BrkTpCode: "",
    },
  });
  assert.equal(result.data.normalized.currencyCode, "USD");
  assert.equal(result.data.safety.orderValue, 350);
});

test("builds an LS overseas sell market order and requires market confirmation for live", async () => {
  const service = new OverseasStockOrderService({
    ls: {
      request: async () => {
        throw new Error("should not call without market confirmation");
      },
    },
  });

  const dryRun = await service.sellOverseasStock("ls", {
    symbol: "TSLA",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 1,
    orderType: "market",
    estimatedPrice: 283.82,
  });
  const live = await service.sellOverseasStock("ls", {
    symbol: "TSLA",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 1,
    orderType: "market",
    estimatedPrice: 283.82,
  }, {
    dryRun: false,
    confirm: true,
  });

  assert.equal(dryRun.ok, true);
  assert.equal(dryRun.data.request.COSAT00301InBlock1.OvrsOrdPrc, 0);
  assert.equal(dryRun.data.request.COSAT00301InBlock1.OrdprcPtnCode, "03");
  assert.equal(dryRun.data.safety.requiresMarketOrderConfirmation, true);
  assert.equal(live.ok, false);
  assert.equal(live.error.code, BROKER_ERROR_CODES.VALIDATION_ERROR);
  assert.equal(live.error.details.requiresMarketOrderConfirmation, true);
});

test("builds LS overseas modify and cancel dry runs", async () => {
  const service = new OverseasStockOrderService({});

  const modify = await service.modifyOverseasStockOrder("ls", {
    originalOrderNumber: "87",
    symbol: "TSLA",
    marketCode: "82",
    currencyCode: "USD",
    price: 200,
    orderType: "limit",
  });
  const cancel = await service.cancelOverseasStockOrder("ls", {
    originalOrderNumber: "87",
    symbol: "TSLA",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 10,
  });

  assert.equal(modify.ok, true);
  assert.equal(modify.id, "COSAT00311");
  assert.deepEqual(modify.data.request, {
    COSAT00311InBlock1: {
      RecCnt: 1,
      OrdPtnCode: "07",
      OrgOrdNo: 87,
      OrdMktCode: "82",
      IsuNo: "TSLA",
      OrdQty: 0,
      OvrsOrdPrc: 200,
      OrdprcPtnCode: "00",
      BrkTpCode: "",
    },
  });
  assert.equal(cancel.ok, true);
  assert.equal(cancel.id, "COSAT00301");
  assert.deepEqual(cancel.data.request, {
    COSAT00301InBlock1: {
      RecCnt: 1,
      OrdPtnCode: "08",
      OrgOrdNo: 87,
      OrdMktCode: "82",
      IsuNo: "TSLA",
      OrdQty: 10,
      OvrsOrdPrc: 0,
      OrdprcPtnCode: "00",
      BrkTpCode: "",
    },
  });
});

test("builds LS overseas reserved order request and masks account fields", async () => {
  const service = new OverseasStockOrderService({});

  const result = await service.submitOverseasStockReservedOrder("ls", {
    transactionType: "1",
    countryCode: "001",
    accountNumber: "TEST_ACCOUNT",
    password: "TESTPWD",
    reservedOrderInputDate: "20260519",
    reservedOrderNumber: 0,
    side: "buy",
    marketCode: "82",
    currencyCode: "USD",
    symbol: "PLTR",
    quantity: 5,
    price: 70,
    reservedOrderStartDate: "20260520",
    reservedOrderEndDate: "20260520",
    conditionCode: "00",
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "COSAT00400");
  assert.deepEqual(result.data.request, {
    COSAT00400InBlock1: {
      RecCnt: 1,
      TrxTpCode: "1",
      CntryCode: "001",
      RsvOrdInptDt: "20260519",
      RsvOrdNo: 0,
      BnsTpCode: "2",
      AcntNo: "TEST_ACCOUNT",
      Pwd: "TESTPWD",
      FcurrMktCode: "82",
      IsuNo: "PLTR",
      OrdQty: 5,
      OvrsOrdPrc: 70,
      OrdprcPtnCode: "00",
      RsvOrdSrtDt: "20260520",
      RsvOrdEndDt: "20260520",
      RsvOrdCndiCode: "00",
      MgntrnCode: "000",
      LoanDt: "",
      LoanDtlClssCode: "",
    },
  });
  assert.equal(result.data.normalized.accountNumber, "***");
  assert.equal(result.data.normalized.password, "***");
  assert.equal(result.data.safety.auditRequest.COSAT00400InBlock1.AcntNo, "***");
  assert.equal(result.data.safety.auditRequest.COSAT00400InBlock1.Pwd, "***");
});

test("submits a confirmed LS overseas live order with retry disabled", async () => {
  const calls = [];
  const service = new OverseasStockOrderService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess(id, {
          rsp_cd: "00040",
          rsp_msg: "매수 주문이 완료되었습니다.",
          COSAT00301OutBlock1: {
            RecCnt: 1,
            OrdPtnCode: "02",
            OrgOrdNo: 0,
            OrdMktCode: "82",
            IsuNo: "PLTR",
            OrdQty: 5,
            OvrsOrdPrc: 70,
            OrdprcPtnCode: "00",
            BrkTpCode: "",
          },
          COSAT00301OutBlock2: {
            RecCnt: 1,
            OrdNo: 32004,
            AcntNm: "***",
            IsuNm: "팔란티어 테크",
          },
        });
      },
    },
  });
  const expectedRequest = {
    COSAT00301InBlock1: {
      RecCnt: 1,
      OrdPtnCode: "02",
      OrgOrdNo: 0,
      OrdMktCode: "82",
      IsuNo: "PLTR",
      OrdQty: 5,
      OvrsOrdPrc: 70,
      OrdprcPtnCode: "00",
      BrkTpCode: "",
    },
  };

  const result = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    tradingSession: "regular",
    quantity: 5,
    price: 70,
  }, {
    dryRun: false,
    confirm: true,
    expectedRequest,
    requestOptions: { timeoutMs: 3000, retryable: true },
  });

  assert.equal(result.ok, true);
  assert.equal(result.dryRun, false);
  assert.deepEqual(calls, [
    {
      id: "COSAT00301",
      params: expectedRequest,
      options: { timeoutMs: 3000, retryable: false },
    },
  ]);
  assert.equal(result.data.orderNumber, "32004");
  assert.equal(result.data.name, "팔란티어 테크");
  assert.deepEqual(result.audit.request, expectedRequest);
});

test("guards live overseas orders with confirm, currency, and expected request", async () => {
  const service = new OverseasStockOrderService({
    ls: {
      request: async () => {
        throw new Error("should not call guarded order");
      },
    },
  });

  const missingConfirm = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 5,
    price: 70,
  }, {
    dryRun: false,
  });
  const missingCurrency = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    quantity: 5,
    price: 70,
  }, {
    dryRun: false,
    confirm: true,
  });
  const expectedMismatch = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    tradingSession: "regular",
    quantity: 5,
    price: 70,
  }, {
    dryRun: false,
    confirm: true,
    expectedRequest: { wrong: true },
  });

  assert.equal(missingConfirm.ok, false);
  assert.equal(missingConfirm.error.code, BROKER_ERROR_CODES.VALIDATION_ERROR);
  assert.equal(missingCurrency.ok, false);
  assert.equal(missingCurrency.error.details.field, "currencyCode");
  assert.equal(expectedMismatch.ok, false);
  assert.deepEqual(expectedMismatch.error.details.expectedRequest, { wrong: true });
});

test("enforces overseas order amount, symbol, market, and currency safety rules", async () => {
  const service = new OverseasStockOrderService({});

  const tooLarge = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 5,
    price: 70,
  }, {
    maxOrderAmount: 100,
  });
  const blocked = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 1,
    price: 70,
  }, {
    blockedSymbols: ["PLTR"],
  });
  const marketNotAllowed = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 1,
    price: 70,
  }, {
    allowedMarketCodes: ["81"],
  });
  const currencyNotAllowed = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 1,
    price: 70,
  }, {
    allowedCurrencyCodes: ["JPY"],
  });

  assert.equal(tooLarge.error.details.failedCode, "ORDER_VALUE_EXCEEDED");
  assert.equal(blocked.error.details.failedCode, "SYMBOL_BLOCKED");
  assert.equal(marketNotAllowed.error.details.failedCode, "MARKET_NOT_ALLOWED");
  assert.equal(currencyNotAllowed.error.details.failedCode, "CURRENCY_NOT_ALLOWED");
});

test("returns unsupported for brokers without overseas stock order capability", async () => {
  const service = new OverseasStockOrderService({
    kiwoom: {
      request: async () => {
        throw new Error("should not call unsupported broker");
      },
    },
  });

  const result = await service.buyOverseasStock("kiwoom", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    quantity: 1,
    price: 70,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, BROKER_ERROR_CODES.UNSUPPORTED_CAPABILITY);
});

test("validates overseas order required fields before request building", async () => {
  const service = new OverseasStockOrderService({});

  const missingMarket = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    quantity: 1,
    price: 70,
  });
  const missingPrice = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    quantity: 1,
  });
  const missingReservedSide = await service.submitOverseasStockReservedOrder("ls", {
    transactionType: "1",
    countryCode: "001",
    accountNumber: "TEST_ACCOUNT",
    password: "TESTPWD",
    reservedOrderInputDate: "20260519",
    marketCode: "82",
    symbol: "PLTR",
    quantity: 1,
    price: 70,
    reservedOrderStartDate: "20260520",
    reservedOrderEndDate: "20260520",
  });

  assert.equal(missingMarket.ok, false);
  assert.equal(missingMarket.error.details.field, "marketCode");
  assert.equal(missingPrice.ok, false);
  assert.equal(missingPrice.error.code, BROKER_ERROR_CODES.VALIDATION_ERROR);
  assert.equal(missingReservedSide.ok, false);
  assert.equal(missingReservedSide.error.details.field, "side");
});

test("preserves overseas order broker client failures", async () => {
  const service = new OverseasStockOrderService({
    ls: {
      request: async () => ({
        ok: false,
        broker: "ls",
        id: "COSAT00301",
        data: null,
        raw: { rsp_cd: "03181" },
        headers: {},
        status: 200,
        error: BrokerError.api("주문가격이 하한가 미달입니다.", {
          broker: "ls",
          id: "COSAT00301",
        }),
      }),
    },
  });

  const result = await service.buyOverseasStock("ls", {
    symbol: "PLTR",
    marketCode: "82",
    currencyCode: "USD",
    tradingSession: "regular",
    quantity: 5,
    price: 70,
  }, {
    dryRun: false,
    confirm: true,
  });

  assert.equal(result.ok, false);
  assert.equal(result.id, "COSAT00301");
  assert.equal(result.error.code, BROKER_ERROR_CODES.API_ERROR);
  assert.deepEqual(result.raw, { rsp_cd: "03181" });
});

test("normalizes overseas order payloads directly", () => {
  const regular = normalizeOverseasStockOrder("ls", "COSAT00301", "buy", {
    rsp_msg: "매수 주문이 완료되었습니다.",
    COSAT00301OutBlock1: {
      OrdPtnCode: "02",
      OrgOrdNo: 0,
      OrdMktCode: "82",
      IsuNo: "PLTR",
      OrdQty: 5,
      OvrsOrdPrc: 70,
      OrdprcPtnCode: "00",
    },
    COSAT00301OutBlock2: {
      OrdNo: 32004,
      AcntNm: "***",
      IsuNm: "팔란티어 테크",
    },
  });
  const reserved = normalizeOverseasStockOrder("ls", "COSAT00400", "reserve", {
    rsp_msg: "예약주문이 완료되었습니다.",
    COSAT00400OutBlock1: {
      TrxTpCode: "1",
      CntryCode: "001",
      RsvOrdNo: 999,
      BnsTpCode: "2",
      FcurrMktCode: "82",
      IsuNo: "PLTR",
      OrdQty: 5,
      OvrsOrdPrc: 70,
      OrdprcPtnCode: "00",
      RsvOrdSrtDt: "20260520",
      RsvOrdEndDt: "20260520",
      RsvOrdCndiCode: "00",
    },
    COSAT00400OutBlock2: {
      RsvOrdNo: 999,
    },
  });

  assert.equal(regular.orderNumber, "32004");
  assert.equal(regular.symbol, "PLTR");
  assert.equal(regular.price, 70);
  assert.equal(reserved.reservedOrderNumber, "999");
  assert.equal(reserved.marketCode, "82");
  assert.equal(reserved.message, "예약주문이 완료되었습니다.");
});

function brokerSuccess(id, data) {
  return {
    ok: true,
    broker: "ls",
    id,
    data,
    raw: data,
    headers: {},
    status: 200,
  };
}
