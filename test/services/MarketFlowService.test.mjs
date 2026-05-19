import assert from "node:assert/strict";
import test from "node:test";

import {
  MarketFlowService,
  normalizeDomesticInvestorFlow,
  normalizeProgramTradingTrend,
} from "../../src/index.mjs";
import { MarketFlowService as MarketFlowServiceFromPackage } from "security-api-reference/services";

test("exports MarketFlowService through package service entry", () => {
  assert.equal(MarketFlowServiceFromPackage, MarketFlowService);
});

test("gets and normalizes Kiwoom domestic investor flow", async () => {
  const client = new FakeClient("kiwoom");
  const service = new MarketFlowService({ kiwoom: client });

  const result = await service.getDomesticInvestorFlow("kiwoom", "kospi", {
    baseDate: "2026-05-19",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "ka10051",
    params: {
      mrkt_tp: "0",
      amt_qty_tp: "0",
      base_dt: "20260519",
      stex_tp: "3",
    },
    options: {},
  });
  assert.equal(result.data.market, "kospi");
  assert.equal(result.data.code, "001");
  assert.equal(result.data.index.price, 2653.81);
  assert.equal(result.data.index.changeRate, 3.52);
  assert.equal(result.data.summary.individualNetBuy, -16);
  assert.equal(result.data.summary.foreignNetBuy, -622);
  assert.equal(result.data.summary.institutionalNetBuy, 601);
  assert.equal(result.data.summary.foreignInstitutionalNetBuy, -21);
  assert.equal(result.data.participants.find((item) => item.type === "securities").netBuy, 255);
});

test("gets and normalizes LS domestic investor flow", async () => {
  const client = new FakeClient("ls");
  const service = new MarketFlowService({ ls: client });

  const result = await service.getDomesticInvestorFlow("ls", "kosdaq", {
    unit: "quantity",
    count: 2,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "t1602",
    params: {
      t1602InBlock: {
        market: "3",
        upcode: "301",
        gubun1: "1",
        gubun2: "0",
        cts_time: " ",
        cts_idx: 1,
        cnt: 2,
        gubun3: "C",
        exchgubun: "U",
      },
    },
    options: {},
  });
  assert.equal(result.data.market, "kosdaq");
  assert.equal(result.data.unit, "quantity");
  assert.equal(result.data.summary.nextTime, "10263000");
  assert.equal(result.data.summary.individualNetBuy, -8398);
  assert.equal(result.data.summary.foreignNetBuy, 3250);
  assert.equal(result.data.summary.institutionalNetBuy, 5148);
  assert.equal(result.data.summary.foreignInstitutionalNetBuy, 8398);
  assert.equal(result.data.participants.find((item) => item.type === "foreign").buy, 12000);
  assert.equal(result.data.timeline[0].time, "10263000");
  assert.equal(result.data.timeline[0].participants.find((item) => item.type === "institutional").netBuy, 120);
});

test("gets and normalizes Kiwoom program trading trend", async () => {
  const client = new FakeClient("kiwoom");
  const service = new MarketFlowService({ kiwoom: client });

  const result = await service.getProgramTradingTrend("kiwoom", "kospi", {
    date: "2026-05-19",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "ka90005",
    params: {
      date: "20260519",
      amt_qty_tp: "1",
      mrkt_tp: "P001_AL01",
      min_tic_tp: "1",
      stex_tp: "3",
    },
    options: {},
  });
  assert.equal(result.data.market, "kospi");
  assert.equal(result.data.summary.latestTime, "170500");
  assert.equal(result.data.summary.totalNetBuy, 17);
  assert.equal(result.data.summary.nonArbitrageNetBuy, 17);
  assert.equal(result.data.summary.k200Index, 478.39);
  assert.equal(result.data.summary.basis, -146.59);
});

test("gets and normalizes LS program trading trend", async () => {
  const client = new FakeClient("ls");
  const service = new MarketFlowService({ ls: client });

  const result = await service.getProgramTradingTrend("ls", "kosdaq", {
    unit: "quantity",
    date: "2026-05-19",
    time: "102630",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "t1632",
    params: {
      t1632InBlock: {
        gubun: "1",
        gubun1: "1",
        gubun2: "1",
        gubun3: "0",
        date: "20260519",
        time: "102630",
        exchgubun: "U",
      },
    },
    options: {},
  });
  assert.equal(result.data.market, "kosdaq");
  assert.equal(result.data.unit, "quantity");
  assert.equal(result.data.summary.latestTime, "180518");
  assert.equal(result.data.summary.totalNetBuy, 99);
  assert.equal(result.data.summary.arbitrageNetBuy, 12);
  assert.equal(result.data.summary.nonArbitrageNetBuy, 87);
  assert.equal(result.data.summary.nextDate, "20230602");
  assert.equal(result.data.timeline[0].index.kospi200, 342.67);
});

test("returns config and validation errors for market flow requests", async () => {
  const service = new MarketFlowService({});

  const missingClient = await service.getDomesticInvestorFlow("kiwoom", "kospi");
  const blankMarket = await service.getDomesticInvestorFlow("kiwoom", "");
  const invalidUnit = await new MarketFlowService({ kiwoom: new FakeClient("kiwoom") })
    .getDomesticInvestorFlow("kiwoom", "kospi", { unit: "shares-and-won" });

  assert.equal(missingClient.ok, false);
  assert.equal(missingClient.error.code, "CONFIG_ERROR");
  assert.equal(blankMarket.ok, false);
  assert.equal(blankMarket.error.code, "VALIDATION_ERROR");
  assert.equal(invalidUnit.ok, false);
  assert.equal(invalidUnit.error.code, "VALIDATION_ERROR");
});

test("returns validation errors for unsupported program trading markets", async () => {
  const service = new MarketFlowService({ kiwoom: new FakeClient("kiwoom") });
  const result = await service.getProgramTradingTrend("kiwoom", "kospi200");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
});

test("normalizes domestic investor flow directly", () => {
  const data = normalizeDomesticInvestorFlow("kiwoom", "kospi", "ka10051", {
    inds_netprps: [
      {
        inds_cd: "001_AL",
        inds_nm: "종합(KOSPI)",
        cur_prc: "+265381",
        flu_rt: "352",
        ind_netprps: "-16",
        frgnr_netprps: "-622",
        orgn_netprps: "+601",
      },
    ],
  });

  assert.equal(data.index.price, 2653.81);
  assert.equal(data.summary.foreignInstitutionalNetBuy, -21);
});

test("normalizes program trading trend directly", () => {
  const data = normalizeProgramTradingTrend("ls", "kospi", "t1632", {
    t1632OutBlock: {
      date: "20260519",
      time: "101500",
      idx: 2,
    },
    t1632OutBlock1: [
      {
        time: "101500",
        tot1: 100,
        tot2: 70,
        tot3: 30,
        cha1: 10,
        cha2: 4,
        cha3: 6,
        bcha1: 90,
        bcha2: 66,
        bcha3: 24,
        k200jisu: "342.67",
      },
    ],
  });

  assert.equal(data.summary.totalNetBuy, 30);
  assert.equal(data.summary.nonArbitrageNetBuy, 24);
  assert.equal(data.summary.nextIndex, 2);
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
  if (id === "ka10051") {
    return {
      inds_netprps: [
        {
          inds_cd: "001_AL",
          inds_nm: "종합(KOSPI)",
          cur_prc: "+265381",
          pre_smbol: "2",
          pred_pre: "+9030",
          flu_rt: "352",
          trde_qty: "1164",
          sc_netprps: "+255",
          insrnc_netprps: "+0",
          invtrt_netprps: "+0",
          bank_netprps: "+0",
          jnsinkm_netprps: "+0",
          endw_netprps: "+0",
          etc_corp_netprps: "+0",
          ind_netprps: "-16",
          frgnr_netprps: "-622",
          native_trmt_frgnr_netprps: "+4",
          natn_netprps: "+0",
          samo_fund_netprps: "+1",
          orgn_netprps: "+601",
        },
      ],
    };
  }

  if (id === "t1602") {
    return {
      rsp_cd: "00000",
      t1602OutBlock: {
        cts_time: "10263000",
        ex_upcode: "301",
        ms_08: 205539,
        md_08: 213937,
        svolume_08: -8398,
        rate_08: 0,
        ms_17: 12000,
        md_17: 8750,
        svolume_17: 3250,
        rate_17: 0,
        ms_18: 12247,
        md_18: 7099,
        svolume_18: 5148,
        rate_18: 0,
        ms_01: 3769,
        md_01: 2210,
        svolume_01: 1558,
      },
      t1602OutBlock1: [
        {
          time: "10263000",
          sv_08: -200,
          sv_17: 80,
          sv_18: 120,
        },
      ],
    };
  }

  if (id === "ka90005") {
    return {
      prm_trde_trnsn: [
        {
          cntr_tm: "170500",
          dfrt_trde_sel: "0",
          dfrt_trde_buy: "0",
          dfrt_trde_netprps: "0",
          ndiffpro_trde_sel: "1",
          ndiffpro_trde_buy: "17",
          ndiffpro_trde_netprps: "+17",
          dfrt_trde_sell_qty: "0",
          dfrt_trde_buy_qty: "0",
          dfrt_trde_netprps_qty: "0",
          ndiffpro_trde_sell_qty: "0",
          ndiffpro_trde_buy_qty: "0",
          ndiffpro_trde_netprps_qty: "+0",
          all_sel: "1",
          all_buy: "17",
          all_netprps: "+17",
          kospi200: "+47839",
          basis: "-146.59",
        },
      ],
    };
  }

  if (id === "t1632") {
    return {
      rsp_cd: "00000",
      t1632OutBlock: {
        date: "20230602",
        time: "175811",
        idx: 19,
      },
      t1632OutBlock1: [
        {
          time: "180518",
          k200jisu: "342.67",
          sign: "2",
          change: "004.59",
          k200basis: "000.28",
          tot1: 102,
          tot2: 3,
          tot3: 99,
          cha1: 20,
          cha2: 8,
          cha3: 12,
          bcha1: 82,
          bcha2: -5,
          bcha3: 87,
        },
      ],
    };
  }

  return {};
}
