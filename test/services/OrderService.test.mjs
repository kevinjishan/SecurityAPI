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
