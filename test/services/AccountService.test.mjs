import assert from "node:assert/strict";
import test from "node:test";

import {
  AccountService,
  BrokerError,
  normalizeDomesticStockBalance,
  normalizeDomesticStockCash,
  normalizeDomesticStockOrderHistory,
} from "../../src/index.mjs";
import { AccountService as AccountServiceFromPackage } from "security-api-reference/services";

test("exports AccountService through package service entry", () => {
  assert.equal(AccountServiceFromPackage, AccountService);
});

test("gets and normalizes Kiwoom domestic stock cash", async () => {
  const calls = [];
  const service = new AccountService({
    kiwoom: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess("kiwoom", id, {
          entr: "1,000,000",
          repl_amt: "50,000",
          pymn_alow_amt: "800,000",
          ord_alow_amt: "750,000",
          d1_entra: "900,000",
          d2_entra: "850,000",
          return_code: 0,
        });
      },
    },
  });

  const result = await service.getDomesticStockCash("kiwoom", {
    requestOptions: { timeoutMs: 5000 },
  });

  assert.equal(result.ok, true);
  assert.equal(result.broker, "kiwoom");
  assert.equal(result.capability, "account.domesticStock.cash");
  assert.equal(result.id, "kt00001");
  assert.deepEqual(calls, [
    {
      id: "kt00001",
      params: { qry_tp: "3" },
      options: { timeoutMs: 5000 },
    },
  ]);
  assert.deepEqual(result.data.summary, {
    deposit: 1000000,
    depositRaw: "1,000,000",
    substituteAmount: 50000,
    substituteAmountRaw: "50,000",
    withdrawableAmount: 800000,
    withdrawableAmountRaw: "800,000",
    orderableAmount: 750000,
    orderableAmountRaw: "750,000",
    d1Deposit: 900000,
    d1DepositRaw: "900,000",
    d2Deposit: 850000,
    d2DepositRaw: "850,000",
  });
});

test("gets and normalizes LS domestic stock cash", async () => {
  const calls = [];
  const service = new AccountService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess("ls", id, {
          rsp_cd: "00000",
          rsp_msg: "정상",
          CSPAQ12200OutBlock2: {
            Dps: 1000000,
            MnyoutAbleAmt: 800000,
            MnyOrdAbleAmt: 750000,
            BalEvalAmt: 1200000,
            DpsastTotamt: 1300000,
            D1Dps: 900000,
            D2Dps: 850000,
          },
        });
      },
    },
  });

  const result = await service.getDomesticStockCash("ls");

  assert.equal(result.ok, true);
  assert.equal(result.id, "CSPAQ12200");
  assert.deepEqual(calls, [
    {
      id: "CSPAQ12200",
      params: { CSPAQ12200InBlock1: { BalCreTp: "0" } },
      options: {},
    },
  ]);
  assert.equal(result.data.summary.deposit, 1000000);
  assert.equal(result.data.summary.withdrawableAmount, 800000);
  assert.equal(result.data.summary.orderableAmount, 750000);
  assert.equal(result.data.summary.totalAssetAmount, 1300000);
});

test("gets and normalizes Kiwoom domestic stock balance", async () => {
  const calls = [];
  const service = new AccountService({
    kiwoom: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess("kiwoom", id, {
          tot_pur_amt: "1,000,000",
          tot_evlt_amt: "1,200,000",
          tot_evlt_pl: "200,000",
          tot_prft_rt: "20.00",
          prsm_dpst_aset_amt: "1,300,000",
          acnt_evlt_remn_indv_tot: [
            {
              stk_cd: "A005930",
              stk_nm: "삼성전자",
              rmnd_qty: "10",
              trde_able_qty: "8",
              pur_pric: "60,000",
              cur_prc: "70,000",
              pur_amt: "600,000",
              evlt_amt: "700,000",
              evltv_prft: "100,000",
              prft_rt: "16.67",
            },
          ],
          return_code: 0,
        });
      },
    },
  });

  const result = await service.getDomesticStockBalance("kiwoom", {
    params: { dmst_stex_tp: "SOR" },
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "account.domesticStock.balance");
  assert.equal(result.id, "kt00018");
  assert.deepEqual(calls, [
    {
      id: "kt00018",
      params: { qry_tp: "1", dmst_stex_tp: "SOR" },
      options: {},
    },
  ]);
  assert.deepEqual(result.data.summary, {
    purchaseAmount: 1000000,
    purchaseAmountRaw: "1,000,000",
    valuationAmount: 1200000,
    valuationAmountRaw: "1,200,000",
    profitLoss: 200000,
    profitLossRaw: "200,000",
    profitRate: 20,
    profitRateRaw: "20.00",
    estimatedDepositAssetAmount: 1300000,
    estimatedDepositAssetAmountRaw: "1,300,000",
  });
  assert.deepEqual(result.data.positions[0], {
    symbol: "005930",
    symbolRaw: "A005930",
    name: "삼성전자",
    quantity: 10,
    quantityRaw: "10",
    tradableQuantity: 8,
    tradableQuantityRaw: "8",
    averagePrice: 60000,
    averagePriceRaw: "60,000",
    currentPrice: 70000,
    currentPriceRaw: "70,000",
    purchaseAmount: 600000,
    purchaseAmountRaw: "600,000",
    valuationAmount: 700000,
    valuationAmountRaw: "700,000",
    profitLoss: 100000,
    profitLossRaw: "100,000",
    profitRate: 16.67,
    profitRateRaw: "16.67",
  });
});

test("gets and normalizes LS domestic stock balance", async () => {
  const calls = [];
  const service = new AccountService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess("ls", id, {
          rsp_cd: "00000",
          rsp_msg: "정상",
          t0424OutBlock: {
            sunamt: 1300000,
            mamt: 1000000,
            tappamt: 1200000,
            tdtsunik: 200000,
            cts_expcode: "005930",
          },
          t0424OutBlock1: [
            {
              expcode: "005930",
              hname: "삼성전자",
              janqty: 10,
              mdposqt: 8,
              pamt: 60000,
              price: 70000,
              mamt: 600000,
              appamt: 700000,
              dtsunik: 100000,
              sunikrt: "16.67",
            },
          ],
        });
      },
    },
  });

  const result = await service.getDomesticStockBalance("ls");

  assert.equal(result.ok, true);
  assert.equal(result.id, "t0424");
  assert.deepEqual(calls, [
    {
      id: "t0424",
      params: {
        t0424InBlock: {
          prcgb: "1",
          chegb: "2",
          dangb: "0",
          charge: "1",
          cts_expcode: "",
        },
      },
      options: {},
    },
  ]);
  assert.equal(result.data.summary.estimatedAssetAmount, 1300000);
  assert.equal(result.data.summary.profitLoss, 200000);
  assert.equal(result.data.summary.nextKey, "005930");
  assert.deepEqual(result.data.positions[0], {
    symbol: "005930",
    symbolRaw: "005930",
    name: "삼성전자",
    quantity: 10,
    quantityRaw: "10",
    tradableQuantity: 8,
    tradableQuantityRaw: "8",
    averagePrice: 60000,
    averagePriceRaw: "60000",
    currentPrice: 70000,
    currentPriceRaw: "70000",
    purchaseAmount: 600000,
    purchaseAmountRaw: "600000",
    valuationAmount: 700000,
    valuationAmountRaw: "700000",
    profitLoss: 100000,
    profitLossRaw: "100000",
    profitRate: 16.67,
    profitRateRaw: "16.67",
  });
});

test("gets and normalizes Kiwoom domestic stock order history", async () => {
  const calls = [];
  const service = new AccountService({
    kiwoom: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess("kiwoom", id, {
          acnt_ord_cntr_prps_dtl: [
            {
              ord_no: "0000050",
              stk_cd: "A005930",
              trde_tp: "시장가",
              ord_qty: "0000000010",
              ord_uv: "0000070000",
              cnfm_qty: "0000000008",
              acpt_tp: "접수",
              ord_tm: "13:05:43",
              ori_ord: "0000000",
              stk_nm: "삼성전자",
              io_tp_nm: "현금매수",
              cntr_qty: "0000000008",
              cntr_uv: "0000069900",
              ord_remnq: "0000000002",
              comm_ord_tp: "영웅문4",
              cnfm_tm: "13:05:44",
              dmst_stex_tp: "KRX",
            },
          ],
          return_code: 0,
        });
      },
    },
  });

  const result = await service.getDomesticStockOrderHistory("kiwoom", {
    orderDate: "2026-05-18",
    symbol: "005930",
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "account.domesticStock.orderHistory");
  assert.equal(result.id, "kt00007");
  assert.deepEqual(calls, [
    {
      id: "kt00007",
      params: {
        ord_dt: "20260518",
        qry_tp: "1",
        stk_bond_tp: "0",
        sell_tp: "0",
        stk_cd: "005930",
        fr_ord_no: "",
        dmst_stex_tp: "%",
      },
      options: {},
    },
  ]);
  assert.equal(result.data.summary.count, 1);
  assert.deepEqual(result.data.orders[0], {
    orderNumber: "0000050",
    originalOrderNumber: "0000000",
    executionNumber: null,
    symbol: "005930",
    symbolRaw: "A005930",
    name: "삼성전자",
    side: "buy",
    sideRaw: "현금매수",
    orderType: "시장가",
    status: "접수",
    orderQuantity: 10,
    orderQuantityRaw: "0000000010",
    orderPrice: 70000,
    orderPriceRaw: "0000070000",
    confirmedQuantity: 8,
    confirmedQuantityRaw: "0000000008",
    executedQuantity: 8,
    executedQuantityRaw: "0000000008",
    executedPrice: 69900,
    executedPriceRaw: "0000069900",
    remainingQuantity: 2,
    remainingQuantityRaw: "0000000002",
    orderTime: "13:05:43",
    executionTime: "13:05:44",
    exchange: "KRX",
    channel: "영웅문4",
    raw: {
      ord_no: "0000050",
      stk_cd: "A005930",
      trde_tp: "시장가",
      ord_qty: "0000000010",
      ord_uv: "0000070000",
      cnfm_qty: "0000000008",
      acpt_tp: "접수",
      ord_tm: "13:05:43",
      ori_ord: "0000000",
      stk_nm: "삼성전자",
      io_tp_nm: "현금매수",
      cntr_qty: "0000000008",
      cntr_uv: "0000069900",
      ord_remnq: "0000000002",
      comm_ord_tp: "영웅문4",
      cnfm_tm: "13:05:44",
      dmst_stex_tp: "KRX",
    },
  });
});

test("gets and normalizes LS domestic stock order history", async () => {
  const calls = [];
  const service = new AccountService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess("ls", id, {
          rsp_cd: "00000",
          rsp_msg: "정상",
          CSPAQ13700OutBlock2: {
            RecCnt: 1,
            SellOrdQty: 0,
            BuyOrdQty: 10,
            BuyExecQty: 8,
            SellExecQty: 0,
            BuyExecAmt: 559200,
            SellExecAmt: 0,
          },
          CSPAQ13700OutBlock3: [
            {
              OrdNo: "50",
              OrgOrdNo: "0",
              ExecNo: "1",
              IsuNo: "A005930",
              IsuNm: "삼성전자",
              BnsTpCode: "2",
              BnsTpNm: "매수",
              OrdPtnNm: "현금매수",
              ExecYn: "1",
              OrdQty: 10,
              OrdPrc: 70000,
              ExecQty: 8,
              ExecPrc: 69900,
              MrcAbleQty: 2,
              OrdDt: "20260518",
              OrdTime: "130543",
              ExecTrxTime: "130544",
              CommdaNm: "API",
            },
          ],
        });
      },
    },
  });

  const result = await service.getDomesticStockOrderHistory("ls", {
    orderDate: "20260518",
    symbol: "005930",
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "CSPAQ13700");
  assert.deepEqual(calls, [
    {
      id: "CSPAQ13700",
      params: {
        CSPAQ13700InBlock1: {
          OrdMktCode: "00",
          BnsTpCode: "0",
          IsuNo: "A005930",
          ExecYn: "0",
          OrdDt: "20260518",
          SrtOrdNo2: 0,
          BkseqTpCode: "0",
          OrdPtnCode: "00",
        },
      },
      options: {},
    },
  ]);
  assert.equal(result.data.summary.recordCount, 1);
  assert.equal(result.data.summary.buyExecutedAmount, 559200);
  assert.deepEqual(result.data.orders[0], {
    orderNumber: "50",
    originalOrderNumber: "0",
    executionNumber: "1",
    symbol: "005930",
    symbolRaw: "A005930",
    name: "삼성전자",
    side: "buy",
    sideRaw: "매수",
    orderType: "현금매수",
    status: "1",
    orderQuantity: 10,
    orderQuantityRaw: "10",
    orderPrice: 70000,
    orderPriceRaw: "70000",
    executedQuantity: 8,
    executedQuantityRaw: "8",
    executedPrice: 69900,
    executedPriceRaw: "69900",
    remainingQuantity: 2,
    remainingQuantityRaw: "2",
    orderDate: "20260518",
    orderTime: "130543",
    executionTime: "130544",
    channel: "API",
    raw: {
      OrdNo: "50",
      OrgOrdNo: "0",
      ExecNo: "1",
      IsuNo: "A005930",
      IsuNm: "삼성전자",
      BnsTpCode: "2",
      BnsTpNm: "매수",
      OrdPtnNm: "현금매수",
      ExecYn: "1",
      OrdQty: 10,
      OrdPrc: 70000,
      ExecQty: 8,
      ExecPrc: 69900,
      MrcAbleQty: 2,
      OrdDt: "20260518",
      OrdTime: "130543",
      ExecTrxTime: "130544",
      CommdaNm: "API",
    },
  });
});

test("supports explicit account source selection and nested parameter overrides", async () => {
  const calls = [];
  const service = new AccountService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess("ls", id, {
          rsp_cd: "00000",
          t0424OutBlock: {},
          t0424OutBlock1: [],
        });
      },
    },
  });

  const result = await service.getDomesticStockBalance("ls", {
    trCode: "t0424",
    params: { t0424InBlock: { cts_expcode: "005930" } },
  });

  assert.equal(result.ok, true);
  assert.deepEqual(calls[0], {
    id: "t0424",
    params: {
      t0424InBlock: {
        prcgb: "1",
        chegb: "2",
        dangb: "0",
        charge: "1",
        cts_expcode: "005930",
      },
    },
  });
});

test("supports nested parameter overrides for account order history", async () => {
  const calls = [];
  const service = new AccountService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess("ls", id, {
          rsp_cd: "00000",
          CSPAQ13700OutBlock2: {},
          CSPAQ13700OutBlock3: [],
        });
      },
    },
  });

  const result = await service.getDomesticStockOrderHistory("ls", {
    trCode: "CSPAQ13700",
    orderDate: "20260518",
    params: { CSPAQ13700InBlock1: { ExecYn: "3", SrtOrdNo2: 999999999 } },
  });

  assert.equal(result.ok, true);
  assert.deepEqual(calls[0], {
    id: "CSPAQ13700",
    params: {
      CSPAQ13700InBlock1: {
        OrdMktCode: "00",
        BnsTpCode: "0",
        IsuNo: "",
        ExecYn: "3",
        OrdDt: "20260518",
        SrtOrdNo2: 999999999,
        BkseqTpCode: "0",
        OrdPtnCode: "00",
      },
    },
  });
});

test("maps KIS accountNumber and accountProductCode to account requests", async () => {
  const calls = [];
  const service = new AccountService({
    kis: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess("kis", id, {
          rt_cd: "0",
          output1: [],
          output2: [{}],
        });
      },
    },
  });

  await service.getDomesticStockCash("kis", {
    accountNumber: "12345678",
    accountProductCode: "01",
  });
  await service.getDomesticStockBalance("kis", {
    accountNumber: "12345678",
    accountProductCode: "02",
  });
  await service.getDomesticStockOrderHistory("kis", {
    accountNumber: "12345678",
    accountProductCode: "03",
    orderDate: "2026-05-18",
    symbol: "005930",
  });

  assert.equal(calls[0].params.CANO, "12345678");
  assert.equal(calls[0].params.ACNT_PRDT_CD, "01");
  assert.equal(calls[1].params.CANO, "12345678");
  assert.equal(calls[1].params.ACNT_PRDT_CD, "02");
  assert.equal(calls[2].params.CANO, "12345678");
  assert.equal(calls[2].params.ACNT_PRDT_CD, "03");
  assert.equal(calls[2].params.INQR_STRT_DT, "20260518");
  assert.equal(calls[2].params.PDNO, "005930");
});

test("preserves raw KIS account params override compatibility", async () => {
  const calls = [];
  const service = new AccountService({
    kis: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess("kis", id, {
          rt_cd: "0",
          output1: [],
          output2: [{}],
        });
      },
    },
  });

  await service.getDomesticStockBalance("kis", {
    accountNumber: "12345678",
    accountProductCode: "01",
    params: {
      CANO: "87654321",
      ACNT_PRDT_CD: "99",
    },
  });

  assert.equal(calls[0].params.CANO, "87654321");
  assert.equal(calls[0].params.ACNT_PRDT_CD, "99");
});

test("returns config errors when an account broker client is missing", async () => {
  const service = new AccountService({});

  const result = await service.getDomesticStockBalance("kiwoom");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "CONFIG_ERROR");
});

test("preserves account broker client failures", async () => {
  const service = new AccountService({
    kiwoom: {
      request: async () => ({
        ok: false,
        broker: "kiwoom",
        id: "kt00018",
        data: null,
        raw: { return_code: -100 },
        headers: {},
        status: 200,
        error: BrokerError.api("업무 오류", {
          broker: "kiwoom",
          id: "kt00018",
        }),
      }),
    },
  });

  const result = await service.getDomesticStockBalance("kiwoom");

  assert.equal(result.ok, false);
  assert.equal(result.id, "kt00018");
  assert.equal(result.status, 200);
  assert.equal(result.error.code, "API_ERROR");
  assert.deepEqual(result.raw, { return_code: -100 });
});

test("normalizes account payloads directly", () => {
  const cash = normalizeDomesticStockCash("ls", "CSPAQ12200", {
    CSPAQ12200OutBlock2: { Dps: "1000000", MnyOrdAbleAmt: "750000" },
  });

  assert.equal(cash.summary.deposit, 1000000);
  assert.equal(cash.summary.orderableAmount, 750000);

  const balance = normalizeDomesticStockBalance("kiwoom", "kt00018", {
    tot_pur_amt: "1000000",
    acnt_evlt_remn_indv_tot: [{ stk_cd: "A005930", stk_nm: "삼성전자", rmnd_qty: "10" }],
  });

  assert.equal(balance.summary.purchaseAmount, 1000000);
  assert.equal(balance.positions[0].symbol, "005930");
  assert.equal(balance.positions[0].quantity, 10);

  const history = normalizeDomesticStockOrderHistory("ls", "CSPAQ13700", {
    CSPAQ13700OutBlock2: { RecCnt: "1" },
    CSPAQ13700OutBlock3: [{ IsuNo: "A005930", BnsTpNm: "매도", OrdQty: "3" }],
  });

  assert.equal(history.summary.recordCount, 1);
  assert.equal(history.orders[0].symbol, "005930");
  assert.equal(history.orders[0].side, "sell");
  assert.equal(history.orders[0].orderQuantity, 3);
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
