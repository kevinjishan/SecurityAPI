import assert from "node:assert/strict";
import test from "node:test";

import {
  AccountService,
  BrokerError,
  normalizeDomesticStockBalance,
  normalizeDomesticStockCash,
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
