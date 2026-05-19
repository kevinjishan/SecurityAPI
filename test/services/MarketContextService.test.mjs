import assert from "node:assert/strict";
import test from "node:test";

import {
  MarketContextService,
  normalizeDomesticIndexDailyCandles,
  normalizeDomesticIndexCurrent,
  normalizeDomesticExpectedIndex,
  normalizeDomesticMarketSnapshot,
} from "../../src/index.mjs";
import { MarketContextService as MarketContextServiceFromPackage } from "security-api-reference/services";

test("exports MarketContextService through package service entry", () => {
  assert.equal(MarketContextServiceFromPackage, MarketContextService);
});

test("gets and normalizes Kiwoom domestic index current", async () => {
  const client = new FakeClient("kiwoom");
  const service = new MarketContextService({ kiwoom: client });

  const result = await service.getDomesticIndexCurrent("kiwoom", "kospi");

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "ka20001",
    params: {
      inds_cd: "001",
      mrkt_tp: "0",
    },
    options: {},
  });
  assert.equal(result.data.index, "kospi");
  assert.equal(result.data.code, "001");
  assert.equal(result.data.name, "KOSPI");
  assert.equal(result.data.price, 2394.49);
  assert.equal(result.data.change, -278.47);
  assert.equal(result.data.breadth.rising, 17);
  assert.equal(result.data.breadth.falling, 130);
  assert.ok(closeTo(result.data.breadth.risingRate, 5.1515151515));
});

test("gets and normalizes LS domestic market snapshot", async () => {
  const client = new FakeClient("ls");
  const service = new MarketContextService({ ls: client });

  const result = await service.getDomesticMarketSnapshot("ls", {
    indexes: ["kospi", "kosdaq"],
    generatedAt: "2026-05-19T00:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls.map((call) => call.params), [
    { t1511InBlock: { upcode: "001" } },
    { t1511InBlock: { upcode: "301" } },
  ]);
  assert.equal(result.data.generatedAt, "2026-05-19T00:00:00.000Z");
  assert.equal(result.data.indexes.length, 2);
  assert.equal(result.data.indexes[0].index, "kospi");
  assert.equal(result.data.indexes[0].previousClose, 2601.36);
  assert.equal(result.data.indexes[0].relatedIndexes[0].code, "002");
  assert.equal(result.data.breadth.rising, 906);
  assert.equal(result.data.breadth.falling, 453);
  assert.equal(result.data.direction, "flat");
});

test("gets and normalizes Kiwoom domestic index daily candles", async () => {
  const client = new FakeClient("kiwoom");
  const service = new MarketContextService({ kiwoom: client });

  const result = await service.getDomesticIndexDailyCandles("kiwoom", "kospi", {
    baseDate: "2026-05-19",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "ka20006",
    params: {
      inds_cd: "001",
      base_dt: "20260519",
    },
    options: {},
  });
  assert.equal(result.data.index, "kospi");
  assert.equal(result.data.interval, "1d");
  assert.equal(result.data.candles[0].date, "20260519");
  assert.equal(result.data.candles[0].open, 2710);
  assert.equal(result.data.candles[0].close, 2725.12);
  assert.equal(result.data.candles[0].volume, 500000);
  assert.equal(result.data.source.id, "ka20006");
});

test("gets and normalizes LS domestic index daily candles", async () => {
  const client = new FakeClient("ls");
  const service = new MarketContextService({ ls: client });

  const result = await service.getDomesticIndexDailyCandles("ls", "kosdaq", {
    count: 2,
    ctsDate: "20260518",
    rateCode: "2",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "t1514",
    params: {
      t1514InBlock: {
        upcode: "301",
        gubun1: " ",
        gubun2: "1",
        cts_date: "20260518",
        cnt: 2,
        rate_gbn: "2",
      },
    },
    options: {},
  });
  assert.equal(result.data.index, "kosdaq");
  assert.equal(result.data.candles[0].close, 850.12);
  assert.equal(result.data.candles[0].breadth.rising, 300);
  assert.equal(result.data.candles[0].breadth.risingRate, 54.55);
  assert.equal(result.data.candles[0].investorFlow.foreignNetBuy, 120);
  assert.equal(result.data.summary.nextDate, "20260518");
});

test("gets and normalizes LS domestic expected index", async () => {
  const client = new FakeClient("ls");
  const service = new MarketContextService({ ls: client });

  const result = await service.getDomesticExpectedIndex("ls", "kospi", {
    session: "preopen",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "t1485",
    params: {
      t1485InBlock: {
        upcode: "001",
        gubun: "1",
      },
    },
    options: {},
  });
  assert.equal(result.data.index, "kospi");
  assert.equal(result.data.session, "1");
  assert.equal(result.data.price, 2610.62);
  assert.equal(result.data.timeline[0].expectedIndex, 2617.03);
  assert.equal(result.data.timeline[0].changeRate, 0.6);
  assert.equal(result.data.breadth.rising, 5);
  assert.equal(result.data.summary.latestExpectedIndex, 2617.03);
});

test("returns config and validation errors for market context requests", async () => {
  const service = new MarketContextService({});

  const missingClient = await service.getDomesticIndexCurrent("kiwoom", "kospi");
  const unknownIndex = await service.getDomesticIndexCurrent("kiwoom", "unknown");

  assert.equal(missingClient.ok, false);
  assert.equal(missingClient.error.code, "CONFIG_ERROR");
  assert.equal(unknownIndex.ok, false);
  assert.equal(unknownIndex.error.code, "VALIDATION_ERROR");
});

test("normalizes domestic index current directly", () => {
  const data = normalizeDomesticIndexCurrent("ls", "kosdaq", "t1511", {
    t1511OutBlock: {
      upcode: "301",
      hname: "코스닥",
      pricejisu: "850.12",
      change: "-4.25",
      diffjisu: "-0.50",
      highjo: 300,
      unchgjo: 50,
      lowjo: 200,
      upjo: 3,
      downjo: 1,
    },
  });

  assert.equal(data.index, "kosdaq");
  assert.equal(data.price, 850.12);
  assert.equal(data.changeRate, -0.5);
  assert.ok(closeTo(data.breadth.risingRate, 54.5454545454));
});

test("normalizes domestic index daily candles directly", () => {
  const data = normalizeDomesticIndexDailyCandles("kiwoom", "kospi", "ka20006", {
    inds_cd: "001",
    inds_dt_pole_qry: [
      {
        dt: "20260519",
        open_pric: "271000",
        high_pric: "273000",
        low_pric: "270000",
        cur_prc: "272512",
        trde_qty: "100",
      },
    ],
  });

  assert.equal(data.candles[0].open, 2710);
  assert.equal(data.candles[0].close, 2725.12);
});

test("normalizes domestic market snapshot directly", () => {
  const snapshot = normalizeDomesticMarketSnapshot("kiwoom", [
    {
      ok: true,
      data: {
        index: "kospi",
        code: "001",
        changeRate: 0.2,
        breadth: { rising: 10, steady: 5, falling: 5 },
        source: { id: "ka20001" },
      },
    },
    {
      ok: true,
      data: {
        index: "kosdaq",
        code: "101",
        changeRate: -0.1,
        breadth: { rising: 6, steady: 4, falling: 10 },
        source: { id: "ka20001" },
      },
    },
  ], {
    generatedAt: "2026-05-19T00:00:00.000Z",
  });

  assert.equal(snapshot.direction, "flat");
  assert.equal(snapshot.breadth.rising, 16);
  assert.equal(snapshot.breadth.falling, 15);
  assert.ok(closeTo(snapshot.breadth.risingRate, 40));
});

test("normalizes domestic expected index directly", () => {
  const data = normalizeDomesticExpectedIndex("ls", "kospi", "t1485", {
    t1485OutBlock: {
      pricejisu: "2610.62",
      change: "9.26",
      sign: "2",
      volume: 263165,
      yhighjo: 5,
      yunchgjo: 944,
      ylowjo: 1,
    },
    t1485OutBlock1: [
      {
        chetime: "084000",
        jisu: "2601.36",
        change: "0.00",
        sign: "3",
        diff: "0.00",
        volume: 488,
        volcha: 0,
      },
    ],
  }, {
    session: "afterclose",
  });

  assert.equal(data.session, "2");
  assert.equal(data.timeline[0].time, "084000");
  assert.equal(data.timeline[0].expectedIndex, 2601.36);
  assert.equal(data.summary.recordCount, 1);
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
      data: fakePayload(id, params),
      raw: fakePayload(id, params),
      headers: {},
      status: 200,
    };
  }
}

function fakePayload(id, params) {
  if (id === "ka20001") {
    return {
      cur_prc: "-2394.49",
      pred_pre_sig: "5",
      pred_pre: "-278.47",
      flu_rt: "-10.42",
      trde_qty: "890",
      trde_prica: "41867",
      trde_frmatn_stk_num: "330",
      trde_frmatn_rt: "+34.38",
      open_pric: "-2669.53",
      high_pric: "-2669.53",
      low_pric: "-2375.21",
      upl: "0",
      rising: "17",
      stdns: "183",
      fall: "130",
      lst: "3",
    };
  }

  if (id === "ka20006") {
    return {
      inds_cd: "001",
      inds_dt_pole_qry: [
        {
          dt: "20260519",
          open_pric: "271000",
          high_pric: "273000",
          low_pric: "270000",
          cur_prc: "272512",
          trde_qty: "500000",
          trde_prica: "12000000",
        },
      ],
    };
  }

  if (id === "t1511") {
    const isKosdaq = params.t1511InBlock.upcode === "301";

    return {
      rsp_cd: "00000",
      t1511OutBlock: {
        upcode: isKosdaq ? "301" : "001",
        hname: isKosdaq ? "코스닥" : "종       합",
        pricejisu: isKosdaq ? "850.12" : "2610.62",
        jniljisu: isKosdaq ? "854.37" : "2601.36",
        sign: isKosdaq ? "5" : "2",
        change: isKosdaq ? "-4.25" : "9.26",
        diffjisu: isKosdaq ? "-0.50" : "0.36",
        volume: isKosdaq ? 123456 : 263165,
        value: isKosdaq ? 222222 : 3884240,
        openjisu: isKosdaq ? "853.00" : "2617.43",
        highjisu: isKosdaq ? "860.00" : "2617.58",
        lowjisu: isKosdaq ? "849.00" : "2610.40",
        highjo: isKosdaq ? 300 : 606,
        unchgjo: isKosdaq ? 50 : 91,
        lowjo: isKosdaq ? 200 : 253,
        upjo: isKosdaq ? 3 : 0,
        downjo: isKosdaq ? 1 : 0,
        firstjcode: "002",
        firstjname: "대형주",
        firstjisu: "2611.97",
        firchange: "9.26",
        firdiff: "0.36",
        firsign: "2",
      },
    };
  }

  if (id === "t1514") {
    return {
      t1514OutBlock: {
        cts_date: "20260518",
      },
      t1514OutBlock1: [
        {
          date: "20260519",
          upcode: "301",
          jisu: "850.12",
          sign: "2",
          change: "2.12",
          diff: "0.25",
          volume: 300000,
          diff_vol: "12.50",
          value2: 6000000,
          high: 300,
          unchg: 50,
          low: 200,
          uprate: "54.55",
          frgsvolume: 120,
          orgsvolume: -80,
          openjisu: "849.00",
          highjisu: "852.00",
          lowjisu: "846.00",
          up: 3,
          down: 1,
          totjo: 550,
          rate: "1.20",
          divrate: "0.80",
        },
      ],
    };
  }

  if (id === "t1485") {
    return {
      rsp_cd: "00000",
      rsp_msg: "조회완료",
      t1485OutBlock: {
        pricejisu: "2610.62",
        sign: "2",
        change: "9.26",
        volume: 263165,
        yhighjo: 5,
        yupjo: 0,
        yunchgjo: 944,
        ylowjo: 1,
        ydownjo: 0,
        ytrajo: 7,
      },
      t1485OutBlock1: [
        {
          chetime: "장  전",
          jisu: "2617.03",
          sign: "2",
          change: "15.67",
          volume: 7372,
          volcha: 810,
          diff: "0.60",
        },
        {
          chetime: "084000",
          jisu: "2601.36",
          sign: "3",
          change: "0.00",
          volume: 488,
          volcha: 0,
          diff: "0.00",
        },
      ],
    };
  }

  return {};
}

function closeTo(actual, expected, tolerance = 0.000001) {
  return Math.abs(actual - expected) <= tolerance;
}
