import assert from "node:assert/strict";
import test from "node:test";

import {
  BROKER_ERROR_CODES,
  OverseasStockAccountService,
  normalizeOverseasStockBalance,
  normalizeOverseasStockCash,
  normalizeOverseasStockOrderHistory,
  normalizeOverseasStockReservedOrderHistory,
} from "../../src/index.mjs";
import { OverseasStockAccountService as OverseasStockAccountServiceFromPackage } from "security-api-reference/services";

test("exports OverseasStockAccountService through package service entry", () => {
  assert.equal(OverseasStockAccountServiceFromPackage, OverseasStockAccountService);
});

test("gets and normalizes LS overseas stock cash", async () => {
  const calls = [];
  const service = new OverseasStockAccountService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess(id, {
          COSOQ02701OutBlock1: {
            RecCnt: 1,
            AcntNo: "***********",
            Pwd: "********",
            CrcyCode: "ALL",
          },
          COSOQ02701OutBlock2: [
            {
              CrcyCode: "USD",
              FcurrBuyAdjstAmt1: "10.12",
              FcurrSellAdjstAmt1: "5.00",
              PrsmptFcurrDps1: "1000.50",
              PrsmptMxchgAbleAmt1: "900.00",
            },
          ],
          COSOQ02701OutBlock3: [
            {
              CntryNm: "미국",
              CrcyCode: "USD",
              T4FcurrDps: "1100.00",
              FcurrDps: "1000.50",
              FcurrOrdAbleAmt: "800.25",
              PrexchOrdAbleAmt: "700.25",
              FcurrOrdAmt: "100.00",
              FcurrPldgAmt: "0.00",
              ExecRuseFcurrAmt: "1.00",
              FcurrMxchgAbleAmt: "600.00",
              BaseXchrat: "1434.60",
            },
          ],
          COSOQ02701OutBlock4: {
            RecCnt: 1,
            WonDpsBalAmt: "1000000",
            MnyoutAbleAmt: "900000",
            WonPrexchAbleAmt: "800000",
            OvrsMgn: "70000",
            NrfCode: "1",
          },
        });
      },
    },
  });

  const result = await service.getOverseasStockCash("ls", { currencyCode: "ALL" }, {
    requestOptions: { timeoutMs: 5000 },
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "COSOQ02701");
  assert.equal(result.capability, "overseasStock.account.cash");
  assert.deepEqual(calls, [
    {
      id: "COSOQ02701",
      params: {
        COSOQ02701InBlock1: {
          RecCnt: 1,
          CrcyCode: "ALL",
        },
      },
      options: { timeoutMs: 5000 },
    },
  ]);
  assert.equal(result.data.summary.wonDepositBalance, 1000000);
  assert.equal(result.data.summary.withdrawableAmount, 900000);
  assert.equal(result.data.currencies[0].currencyCode, "USD");
  assert.equal(result.data.currencies[0].foreignDeposit, 1000.5);
  assert.equal(result.data.currencies[0].orderableAmount, 800.25);
  assert.equal(result.data.settlements[0].estimatedForeignDeposits[0].value, 1000.5);
});

test("gets and normalizes LS overseas stock balance", async () => {
  const calls = [];
  const service = new OverseasStockAccountService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess(id, {
          COSOQ00201OutBlock1: {
            RecCnt: 1,
            BaseDt: "20260519",
            CrcyCode: "ALL",
            AstkBalTpCode: "00",
          },
          COSOQ00201OutBlock2: {
            RecCnt: 1,
            ErnRat: "12.34",
            DpsConvEvalAmt: "100000",
            StkConvEvalAmt: "2000000",
            DpsastConvEvalAmt: "2100000",
            WonEvalSumAmt: "2200000",
            ConvEvalPnlAmt: "123000",
            WonDpsBalAmt: "500000",
            D2EstiDps: "490000",
            LoanAmt: "0",
          },
          COSOQ00201OutBlock3: [
            {
              CrcyCode: "USD",
              FcurrDps: "1000.50",
              FcurrEvalAmt: "1500.25",
              FcurrEvalPnlAmt: "100.00",
              PnlRat: "7.14",
              BaseXchrat: "1434.60",
              FcurrOrdAbleAmt: "800.00",
            },
          ],
          COSOQ00201OutBlock4: [
            {
              CrcyCode: "USD",
              ShtnIsuNo: "TSLA",
              IsuNo: "TSLA",
              JpnMktHanglIsuNm: "테슬라",
              AstkBalTpCode: "00",
              AstkBalTpCodeNm: "일반",
              AstkBalQty: "3",
              AstkSellAbleQty: "2",
              FcstckUprc: "220.1000",
              FcurrBuyAmt: "660.30",
              FcstckMktIsuCode: "82TSLA",
              OvrsScrtsCurpri: "283.8200",
              FcurrEvalAmt: "851.46",
              FcurrEvalPnlAmt: "191.16",
              PnlRat: "28.95",
              BaseXchrat: "1434.60",
              PchsAmt: "947270",
              StkConvEvalAmt: "1221511",
              ConvEvalPnlAmt: "274241",
              AstkSettQty: "3",
              MktTpNm: "NASDAQ",
              FcurrMktCode: "82",
              AstkBasePrc: "283.8200",
            },
          ],
        });
      },
    },
  });

  const result = await service.getOverseasStockBalance("ls", {
    baseDate: "2026-05-19",
    currencyCode: "ALL",
    balanceType: "00",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(calls[0], {
    id: "COSOQ00201",
    params: {
      COSOQ00201InBlock1: {
        RecCnt: 1,
        BaseDt: "20260519",
        CrcyCode: "ALL",
        AstkBalTpCode: "00",
      },
    },
  });
  assert.equal(result.data.baseDate, "20260519");
  assert.equal(result.data.summary.profitRate, 12.34);
  assert.equal(result.data.currencyBalances[0].foreignOrderableAmount, 800);
  assert.equal(result.data.positions[0].symbol, "TSLA");
  assert.equal(result.data.positions[0].quantity, 3);
  assert.equal(result.data.positions[0].currentPrice, 283.82);
  assert.equal(result.data.positions[0].marketName, "NASDAQ");
});

test("gets and normalizes LS overseas stock order history", async () => {
  const calls = [];
  const service = new OverseasStockAccountService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess(id, {
          COSAQ00102OutBlock1: {
            RecCnt: 1,
            QryTpCode: "1",
            BkseqTpCode: "1",
            OrdMktCode: "82",
            BnsTpCode: "0",
            IsuNo: "TSLA",
            SrtOrdNo: 999999999,
            OrdDt: "20260519",
            ExecYn: "0",
            CrcyCode: "000",
            ThdayBnsAppYn: "0",
            LoanBalHldYn: "0",
          },
          COSAQ00102OutBlock2: {
            RecCnt: 1,
            AcntNm: "테스트",
            JpnMktHanglIsuNm: "테슬라",
            MgmtBrnNm: "온라인",
            SellExecFcurrAmt: "0",
            SellExecQty: "0",
            BuyExecFcurrAmt: "283.82",
            BuyExecQty: "1",
          },
          COSAQ00102OutBlock3: [
            {
              AcntNm: "테스트",
              ExecTime: "230001",
              OrdTime: "230000",
              OrdNo: 123,
              OrgOrdNo: 0,
              ShtnIsuNo: "TSLA",
              OrdTrxPtnNm: "접수",
              OrdTrxPtnCode: "00",
              MrcAbleQty: "1",
              OrdQty: "1",
              OvrsOrdPrc: "283.8200",
              ExecQty: "1",
              OvrsExecPrc: "283.8200",
              OrdprcPtnCode: "00",
              OrdprcPtnNm: "지정가",
              OrdPtnNm: "매수",
              OrdPtnCode: "02",
              MrcTpCode: "0",
              MrcTpNm: "정상",
              AllExecQty: "1",
              OrdMktCode: "82",
              MktNm: "NASDAQ",
              JpnMktHanglIsuNm: "테슬라",
              UnercQty: "0",
              CnfQty: "1",
              CrcyCode: "USD",
              RegMktCode: "82",
              IsuNo: "TSLA",
              BrkTpCode: "0",
              BnsTpCode: "2",
            },
          ],
        });
      },
    },
  });

  const result = await service.getOverseasStockOrderHistory("ls", {
    marketCode: "82",
    symbol: "TSLA",
    orderDate: "20260519",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(calls[0], {
    id: "COSAQ00102",
    params: {
      COSAQ00102InBlock1: {
        RecCnt: 1,
        QryTpCode: "1",
        BkseqTpCode: "1",
        OrdMktCode: "82",
        BnsTpCode: "0",
        IsuNo: "TSLA",
        SrtOrdNo: 999999999,
        OrdDt: "20260519",
        ExecYn: "0",
        CrcyCode: "000",
        ThdayBnsAppYn: "0",
        LoanBalHldYn: "0",
      },
    },
  });
  assert.equal(result.data.summary.buyExecutedForeignAmount, 283.82);
  assert.equal(result.data.orders[0].orderNumber, "123");
  assert.equal(result.data.orders[0].side, "buy");
  assert.equal(result.data.orders[0].executedQuantity, 1);
  assert.equal(result.data.orders[0].unexecutedQuantity, 0);
});

test("gets and normalizes LS overseas reserved order history", async () => {
  const calls = [];
  const service = new OverseasStockAccountService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess(id, {
          COSAQ01400OutBlock1: {
            RecCnt: 1,
            QryTpCode: "1",
            CntryCode: "001",
            AcntNo: "***********",
            Pwd: "********",
            SrtDt: "20260501",
            EndDt: "20260519",
            BnsTpCode: "0",
            RsvOrdCndiCode: "00",
            RsvOrdStatCode: "1",
          },
          COSAQ01400OutBlock2: [
            {
              AcntNm: "테스트",
              OrdDt: "20260519",
              OrdNo: 123,
              RsvOrdInptDt: "20260518",
              RsvOrdNo: 999,
              ShtnIsuNo: "TSLA",
              JpnMktHanglIsuNm: "테슬라",
              OrdprcPtnNm: "지정가",
              OrdQty: "1",
              OvrsOrdPrc: "283.8200",
              BnsTpNm: "매수",
              ExecQty: "0",
              UnercQty: "1",
              TotExecQty: "0",
              CrcyCode: "USD",
              RsvOrdStatCode: "1",
              MktTpNm: "NASDAQ",
              ErrCnts: "",
              LoanDt: "",
              MgntrnCode: "",
            },
          ],
        });
      },
    },
  });

  const result = await service.getOverseasStockReservedOrderHistory("ls", {
    countryCode: "001",
    accountNumber: "TEST_ACCOUNT",
    password: "TESTPWD",
    startDate: "2026-05-01",
    endDate: "2026-05-19",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(calls[0], {
    id: "COSAQ01400",
    params: {
      COSAQ01400InBlock1: {
        RecCnt: 1,
        QryTpCode: "1",
        CntryCode: "001",
        AcntNo: "TEST_ACCOUNT",
        Pwd: "TESTPWD",
        SrtDt: "20260501",
        EndDt: "20260519",
        BnsTpCode: "0",
        RsvOrdCndiCode: "00",
        RsvOrdStatCode: "1",
      },
    },
  });
  assert.equal(result.data.orders[0].reservedOrderNumber, "999");
  assert.equal(result.data.orders[0].side, "buy");
  assert.equal(result.data.orders[0].unexecutedQuantity, 1);
});

test("returns unsupported for brokers without overseas stock account capability", async () => {
  const service = new OverseasStockAccountService({
    kiwoom: {
      request: async () => {
        throw new Error("should not call unsupported broker");
      },
    },
  });

  const result = await service.getOverseasStockCash("kiwoom");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, BROKER_ERROR_CODES.UNSUPPORTED_CAPABILITY);
});

test("validates reserved order history secrets and date range before request", async () => {
  const service = new OverseasStockAccountService({
    ls: {
      request: async () => {
        throw new Error("should not call invalid request");
      },
    },
  });

  const result = await service.getOverseasStockReservedOrderHistory("ls", {
    countryCode: "001",
    startDate: "20260501",
    endDate: "20260519",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, BROKER_ERROR_CODES.VALIDATION_ERROR);
  assert.equal(result.error.details.field, "accountNumber");
});

test("normalizers expose raw blocks for direct use", () => {
  assert.equal(normalizeOverseasStockCash("ls", {}, "COSOQ02701", {}).raw.currencies.length, 0);
  assert.equal(normalizeOverseasStockBalance("ls", {}, "COSOQ00201", {}).positions.length, 0);
  assert.equal(normalizeOverseasStockOrderHistory("ls", {}, "COSAQ00102", {}).orders.length, 0);
  assert.equal(normalizeOverseasStockReservedOrderHistory("ls", {}, "COSAQ01400", {}).orders.length, 0);
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
