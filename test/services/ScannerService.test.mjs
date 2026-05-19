import assert from "node:assert/strict";
import test from "node:test";

import {
  ScannerService,
  normalizeDomesticStockChangeRateRankings,
} from "../../src/index.mjs";
import { ScannerService as ScannerServiceFromPackage } from "security-api-reference/services";

test("exports ScannerService through package service entry", () => {
  assert.equal(ScannerServiceFromPackage, ScannerService);
});

test("gets and normalizes Kiwoom domestic stock volume rankings", async () => {
  const client = new FakeClient("kiwoom");
  const service = new ScannerService({ kiwoom: client });

  const result = await service.getDomesticStockVolumeRankings("kiwoom", {
    market: "kospi",
    exchange: "krx",
    params: { trde_qty_tp: "10" },
  });

  assert.equal(result.ok, true);
  assert.equal(client.calls[0].id, "ka10030");
  assert.deepEqual(client.calls[0].params, {
    mrkt_tp: "001",
    sort_tp: "1",
    mang_stk_incls: "0",
    crd_tp: "0",
    trde_qty_tp: "10",
    pric_tp: "0",
    trde_prica_tp: "0",
    mrkt_open_tp: "0",
    stex_tp: "1",
  });
  assert.equal(result.data.rankingType, "volume");
  assert.equal(result.data.items[0].rank, 1);
  assert.equal(result.data.items[0].symbol, "005930");
  assert.equal(result.data.items[0].price, 152000);
  assert.equal(result.data.items[0].volume, 34954641);
  assert.equal(result.data.items[0].value, 5308092);
});

test("gets and normalizes LS domestic stock value rankings", async () => {
  const client = new FakeClient("ls");
  const service = new ScannerService({ ls: client });

  const result = await service.getDomesticStockValueRankings("ls", {
    market: "kosdaq",
    exchange: "nxt",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "t1463",
    params: {
      t1463InBlock: {
        gubun: "2",
        jnilgubun: "0",
        jc_num: 0,
        sprice: 0,
        eprice: 0,
        volume: 0,
        idx: 0,
        jc_num2: 0,
        exchgubun: "N",
      },
    },
    options: {},
  });
  assert.equal(result.data.rankingType, "value");
  assert.equal(result.data.summary.nextIndex, 20);
  assert.equal(result.data.items[0].symbol, "005930");
  assert.equal(result.data.items[0].value, 874631);
  assert.equal(result.data.items[0].marketCap, 417000000);
});

test("gets and normalizes domestic stock change rate rankings", async () => {
  const client = new FakeClient("ls");
  const service = new ScannerService({ ls: client });

  const result = await service.getDomesticStockChangeRateRankings("ls", {
    direction: "down",
  });

  assert.equal(result.ok, true);
  assert.equal(client.calls[0].id, "t1441");
  assert.equal(client.calls[0].params.t1441InBlock.gubun2, "1");
  assert.equal(result.data.rankingType, "changeRate");
  assert.equal(result.data.items[0].changeRate, -3.5);
  assert.equal(result.data.items[0].askPrice, 70200);
  assert.equal(result.data.items[0].bidPrice, 70000);
});

test("returns config errors for scanner requests", async () => {
  const service = new ScannerService({});

  const result = await service.getDomesticStockValueRankings("kiwoom");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "CONFIG_ERROR");
});

test("normalizes change rate rankings directly", () => {
  const data = normalizeDomesticStockChangeRateRankings("kiwoom", "ka10027", {
    pred_pre_flu_rt_upper: [
      {
        stk_cd: "A005930",
        stk_nm: "삼성전자",
        cur_prc: "+74800",
        pred_pre: "+17200",
        flu_rt: "+29.86",
        now_trde_qty: "446203",
      },
    ],
  });

  assert.equal(data.items[0].symbol, "005930");
  assert.equal(data.items[0].price, 74800);
  assert.equal(data.items[0].changeRate, 29.86);
  assert.equal(data.items[0].volume, 446203);
});

class FakeClient {
  constructor(broker) {
    this.broker = broker;
    this.calls = [];
  }

  async request(id, params, options = {}) {
    this.calls.push({ id, params, options });
    return {
      ok: true,
      broker: this.broker,
      id,
      data: fakePayload(id),
      raw: fakePayload(id),
      headers: {},
      status: 200,
    };
  }
}

function fakePayload(id) {
  if (id === "ka10030") {
    return {
      tdy_trde_qty_upper: [
        {
          stk_cd: "005930",
          stk_nm: "삼성전자",
          cur_prc: "-152000",
          pred_pre: "-100",
          flu_rt: "-0.07",
          trde_qty: "34954641",
          trde_amt: "5308092",
          trde_tern_rt: "+48.21",
        },
      ],
    };
  }

  if (id === "t1463") {
    return {
      t1463OutBlock: { idx: 20 },
      t1463OutBlock1: [
        {
          shcode: "005930",
          hname: "삼성전자",
          price: 71800,
          change: 400,
          diff: "0.56",
          volume: 4817961,
          value: 874631,
          jnilvolume: 12161798,
          jnilvalue: 874631,
          total: 417000000,
        },
      ],
    };
  }

  if (id === "t1441") {
    return {
      t1441OutBlock: { idx: 40 },
      t1441OutBlock1: [
        {
          shcode: "005930",
          hname: "삼성전자",
          price: 70000,
          change: -2500,
          diff: "-3.50",
          volume: 1000000,
          value: 70000000,
          offerho1: 70200,
          bidho1: 70000,
        },
      ],
    };
  }

  return {};
}
