import assert from "node:assert/strict";
import test from "node:test";

import {
  BrokerError,
  OrderService,
  normalizeDomesticStockOrder,
} from "../../src/index.mjs";
import { OrderService as OrderServiceFromPackage } from "security-api-reference/services";

test("exports OrderService through package service entry", () => {
  assert.equal(OrderServiceFromPackage, OrderService);
});

test("builds a Kiwoom buy order dry run by default", async () => {
  let called = false;
  const service = new OrderService({
    kiwoom: {
      request: async () => {
        called = true;
      },
    },
  });

  const result = await service.buyDomesticStock("kiwoom", {
    symbol: "005930",
    quantity: 3,
  });

  assert.equal(result.ok, true);
  assert.equal(result.dryRun, true);
  assert.equal(result.id, "kt10000");
  assert.equal(called, false);
  assert.deepEqual(result.data.request, {
    dmst_stex_tp: "KRX",
    stk_cd: "005930",
    ord_qty: "3",
    ord_uv: "",
    trde_tp: "3",
    cond_uv: "",
  });
});

test("builds an LS sell limit order dry run", async () => {
  const service = new OrderService({});

  const result = await service.sellDomesticStock("ls", {
    symbol: "A005930",
    quantity: 2,
    price: 70000,
    orderType: "limit",
    exchange: "NXT",
  });

  assert.equal(result.ok, true);
  assert.equal(result.dryRun, true);
  assert.equal(result.id, "CSPAT00601");
  assert.deepEqual(result.data.request, {
    CSPAT00601InBlock1: {
      IsuNo: "A005930",
      OrdQty: 2,
      OrdPrc: 70000,
      BnsTpCode: "1",
      OrdprcPtnCode: "00",
      MgntrnCode: "000",
      LoanDt: "",
      OrdCndiTpCode: "0",
      MbrNo: "NXT",
    },
  });
});

test("requires explicit confirmation for live orders", async () => {
  let called = false;
  const service = new OrderService({
    kiwoom: {
      request: async () => {
        called = true;
      },
    },
  });

  const result = await service.buyDomesticStock("kiwoom", {
    symbol: "005930",
    quantity: 1,
  }, {
    dryRun: false,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.equal(called, false);
});

test("requires explicit market order confirmation for live market orders", async () => {
  let called = false;
  const service = new OrderService({
    kiwoom: {
      request: async () => {
        called = true;
      },
    },
  });

  const result = await service.buyDomesticStock("kiwoom", {
    symbol: "005930",
    quantity: 1,
  }, {
    dryRun: false,
    confirm: true,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.equal(result.error.details.requiresMarketOrderConfirmation, true);
  assert.equal(called, false);
});

test("enforces order amount and symbol safety rules", async () => {
  const service = new OrderService({});

  const tooLarge = await service.buyDomesticStock("ls", {
    symbol: "005930",
    quantity: 2,
    price: 70000,
    orderType: "limit",
  }, {
    maxOrderAmount: 100000,
  });
  const blocked = await service.buyDomesticStock("ls", {
    symbol: "005930",
    quantity: 1,
    price: 70000,
    orderType: "limit",
  }, {
    blockedSymbols: ["005930"],
  });
  const notAllowed = await service.buyDomesticStock("ls", {
    symbol: "005930",
    quantity: 1,
    price: 70000,
    orderType: "limit",
  }, {
    allowedSymbols: ["000660"],
  });

  assert.equal(tooLarge.ok, false);
  assert.equal(tooLarge.error.details.failedCode, "ORDER_VALUE_EXCEEDED");
  assert.equal(blocked.ok, false);
  assert.equal(blocked.error.details.failedCode, "SYMBOL_BLOCKED");
  assert.equal(notAllowed.ok, false);
  assert.equal(notAllowed.error.details.failedCode, "SYMBOL_NOT_ALLOWED");
});

test("uses estimatedPrice for market order amount checks", async () => {
  const service = new OrderService({});

  const missingEstimate = await service.buyDomesticStock("kiwoom", {
    symbol: "005930",
    quantity: 1,
  }, {
    maxOrderAmount: 100000,
  });
  const withinLimit = await service.buyDomesticStock("kiwoom", {
    symbol: "005930",
    quantity: 1,
    estimatedPrice: 70000,
  }, {
    maxOrderAmount: 100000,
  });

  assert.equal(missingEstimate.ok, false);
  assert.equal(missingEstimate.error.details.failedCode, "ORDER_VALUE_REQUIRED");
  assert.equal(withinLimit.ok, true);
  assert.equal(withinLimit.data.safety.orderValue, 70000);
});

test("requires expectedRequest match for live orders", async () => {
  let called = false;
  const service = new OrderService({
    kiwoom: {
      request: async () => {
        called = true;
      },
    },
  });

  const result = await service.buyDomesticStock("kiwoom", {
    symbol: "005930",
    quantity: 1,
  }, {
    dryRun: false,
    confirm: true,
    confirmMarketOrder: true,
    expectedRequest: {
      dmst_stex_tp: "KRX",
      stk_cd: "000660",
      ord_qty: "1",
      ord_uv: "",
      trde_tp: "3",
      cond_uv: "",
    },
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.equal(result.error.details.actualRequest.stk_cd, "005930");
  assert.equal(called, false);
});

test("submits a confirmed Kiwoom live order with retry disabled", async () => {
  const calls = [];
  const service = new OrderService({
    kiwoom: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess("kiwoom", id, {
          ord_no: "0000024",
          dmst_stex_tp: "KRX",
          return_code: 0,
          return_msg: "정상적으로 처리되었습니다",
        });
      },
    },
  });

  const result = await service.buyDomesticStock("kiwoom", {
    symbol: "005930",
    quantity: 1,
  }, {
    dryRun: false,
    confirm: true,
    confirmMarketOrder: true,
    requestOptions: { timeoutMs: 3000, retryable: true },
  });

  assert.equal(result.ok, true);
  assert.equal(result.dryRun, false);
  assert.deepEqual(calls, [
    {
      id: "kt10000",
      params: {
        dmst_stex_tp: "KRX",
        stk_cd: "005930",
        ord_qty: "1",
        ord_uv: "",
        trde_tp: "3",
        cond_uv: "",
      },
      options: { timeoutMs: 3000, retryable: false },
    },
  ]);
  assert.equal(result.data.orderNumber, "0000024");
  assert.equal(result.data.message, "정상적으로 처리되었습니다");
  assert.equal(result.audit.safety.requiresMarketOrderConfirmation, true);
  assert.deepEqual(result.audit.request, {
    dmst_stex_tp: "KRX",
    stk_cd: "005930",
    ord_qty: "1",
    ord_uv: "",
    trde_tp: "3",
    cond_uv: "",
  });
});

test("builds Kiwoom modify and cancel dry runs", async () => {
  const service = new OrderService({});

  const modify = await service.modifyDomesticStock("kiwoom", {
    originalOrderNumber: "0000139",
    symbol: "005930",
    quantity: 1,
    price: 69700,
    orderType: "limit",
  });

  const cancel = await service.cancelDomesticStock("kiwoom", {
    originalOrderNumber: "0000140",
    symbol: "005930",
    quantity: 1,
  });

  assert.equal(modify.id, "kt10002");
  assert.deepEqual(modify.data.request, {
    dmst_stex_tp: "KRX",
    orig_ord_no: "0000139",
    stk_cd: "005930",
    mdfy_qty: "1",
    mdfy_uv: "69700",
    mdfy_cond_uv: "",
  });
  assert.equal(cancel.id, "kt10003");
  assert.deepEqual(cancel.data.request, {
    dmst_stex_tp: "KRX",
    orig_ord_no: "0000140",
    stk_cd: "005930",
    cncl_qty: "1",
  });
});

test("builds LS modify and cancel dry runs", async () => {
  const service = new OrderService({});

  const modify = await service.modifyDomesticStock("ls", {
    originalOrderNumber: "171011",
    symbol: "005930",
    quantity: 1,
    price: 69700,
    orderType: "limit",
  });

  const cancel = await service.cancelDomesticStock("ls", {
    originalOrderNumber: "171011",
    symbol: "005930",
    quantity: 1,
  });

  assert.equal(modify.id, "CSPAT00701");
  assert.deepEqual(modify.data.request, {
    CSPAT00701InBlock1: {
      OrgOrdNo: 171011,
      IsuNo: "A005930",
      OrdQty: 1,
      OrdprcPtnCode: "00",
      OrdCndiTpCode: "0",
      OrdPrc: 69700,
    },
  });
  assert.equal(cancel.id, "CSPAT00801");
  assert.deepEqual(cancel.data.request, {
    CSPAT00801InBlock1: {
      OrgOrdNo: 171011,
      IsuNo: "A005930",
      OrdQty: 1,
    },
  });
});

test("builds KIS domestic order dry runs with first-class account fields", async () => {
  const service = new OrderService({});

  const buy = await service.buyDomesticStock("kis", {
    symbol: "005930",
    quantity: 1,
    price: 70000,
    orderType: "limit",
    accountNumber: "12345678",
    accountProductCode: "01",
  });
  const sell = await service.sellDomesticStock("kis", {
    symbol: "005930",
    quantity: 2,
    price: 71000,
    orderType: "limit",
    accountNumber: "12345678",
    accountProductCode: "02",
  });
  const modify = await service.modifyDomesticStock("kis", {
    originalOrderNumber: "0000000010",
    symbol: "005930",
    quantity: 1,
    price: 70500,
    orderType: "limit",
    accountNumber: "12345678",
    accountProductCode: "03",
  });
  const cancel = await service.cancelDomesticStock("kis", {
    originalOrderNumber: "0000000011",
    symbol: "005930",
    quantity: 1,
    accountNumber: "12345678",
    accountProductCode: "04",
  });

  assert.equal(buy.id, "/uapi/domestic-stock/v1/trading/order-cash");
  assert.deepEqual(buy.data.request, {
    CANO: "12345678",
    ACNT_PRDT_CD: "01",
    PDNO: "005930",
    ORD_DVSN: "00",
    ORD_QTY: "1",
    ORD_UNPR: "70000",
  });
  assert.equal(sell.data.request.CANO, "12345678");
  assert.equal(sell.data.request.ACNT_PRDT_CD, "02");
  assert.equal(sell.data.request.PDNO, "005930");
  assert.equal(modify.data.request.CANO, "12345678");
  assert.equal(modify.data.request.ACNT_PRDT_CD, "03");
  assert.equal(modify.data.request.ORGN_ODNO, "0000000010");
  assert.equal(modify.data.request.RVSE_CNCL_DVSN_CD, "01");
  assert.equal(cancel.data.request.CANO, "12345678");
  assert.equal(cancel.data.request.ACNT_PRDT_CD, "04");
  assert.equal(cancel.data.request.ORGN_ODNO, "0000000011");
  assert.equal(cancel.data.request.RVSE_CNCL_DVSN_CD, "02");
});

test("preserves raw KIS order params override compatibility", async () => {
  const service = new OrderService({});

  const result = await service.buyDomesticStock("kis", {
    symbol: "005930",
    quantity: 1,
    estimatedPrice: 70000,
    accountNumber: "12345678",
    accountProductCode: "01",
    params: {
      CANO: "87654321",
      ACNT_PRDT_CD: "99",
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.request.CANO, "87654321");
  assert.equal(result.data.request.ACNT_PRDT_CD, "99");
});

test("validates required order fields", async () => {
  const service = new OrderService({});

  const missingSymbol = await service.buyDomesticStock("kiwoom", {
    quantity: 1,
  });
  const missingPrice = await service.buyDomesticStock("ls", {
    symbol: "005930",
    quantity: 1,
    orderType: "limit",
  });
  const missingOriginalOrder = await service.cancelDomesticStock("ls", {
    symbol: "005930",
    quantity: 1,
  });

  assert.equal(missingSymbol.ok, false);
  assert.equal(missingSymbol.error.code, "VALIDATION_ERROR");
  assert.equal(missingPrice.ok, false);
  assert.equal(missingPrice.error.code, "VALIDATION_ERROR");
  assert.equal(missingOriginalOrder.ok, false);
  assert.equal(missingOriginalOrder.error.code, "VALIDATION_ERROR");
});

test("preserves broker client order failures", async () => {
  const service = new OrderService({
    kiwoom: {
      request: async () => ({
        ok: false,
        broker: "kiwoom",
        id: "kt10000",
        data: null,
        raw: { return_code: -100 },
        headers: {},
        status: 200,
        error: BrokerError.api("주문 오류", {
          broker: "kiwoom",
          id: "kt10000",
        }),
      }),
    },
  });

  const result = await service.buyDomesticStock("kiwoom", {
    symbol: "005930",
    quantity: 1,
  }, {
    dryRun: false,
    confirm: true,
    confirmMarketOrder: true,
  });

  assert.equal(result.ok, false);
  assert.equal(result.id, "kt10000");
  assert.equal(result.error.code, "API_ERROR");
  assert.deepEqual(result.raw, { return_code: -100 });
});

test("normalizes order payloads directly", () => {
  const kiwoom = normalizeDomesticStockOrder("kiwoom", "kt10003", "cancel", {
    ord_no: "0000141",
    base_orig_ord_no: "0000139",
    cncl_qty: "000000000001",
    return_msg: "매수취소 주문입력이 완료되었습니다",
  });
  const ls = normalizeDomesticStockOrder("ls", "CSPAT00601", "buy", {
    rsp_msg: "매수 주문이 완료되었습니다.",
    CSPAT00601OutBlock2: {
      OrdNo: 32004,
      ShtnIsuNo: "A272210",
      IsuNm: "한화시스템",
      OrdAmt: 35000,
    },
  });

  assert.equal(kiwoom.orderNumber, "0000141");
  assert.equal(kiwoom.originalOrderNumber, "0000139");
  assert.equal(kiwoom.quantity, 1);
  assert.equal(ls.orderNumber, "32004");
  assert.equal(ls.symbol, "272210");
  assert.equal(ls.orderAmount, 35000);
});

function brokerSuccess(broker, id, data) {
  return {
    ok: true,
    broker,
    id,
    data,
    raw: data,
    headers: {},
    status: 200,
  };
}
