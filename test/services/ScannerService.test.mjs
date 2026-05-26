import assert from "node:assert/strict";
import test from "node:test";

import {
  ScannerService,
  normalizeConditionSearchRealtimeMessage,
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

test("maps explicit all market aliases to broker whole-market codes", async () => {
  const kiwoomClient = new FakeClient("kiwoom");
  const lsClient = new FakeClient("ls");
  const service = new ScannerService({ kiwoom: kiwoomClient, ls: lsClient });

  await service.getDomesticStockVolumeRankings("kiwoom", { market: "all" });
  await service.getDomesticStockValueRankings("ls", { market: "all" });

  assert.equal(kiwoomClient.calls[0].params.mrkt_tp, "000");
  assert.equal(lsClient.calls[0].params.t1463InBlock.gubun, "0");
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

test("lists Kiwoom condition searches", async () => {
  const client = new FakeClient("kiwoom");
  const service = new ScannerService({ kiwoom: client });

  const result = await service.listConditionSearches("kiwoom");

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "ka10171",
    params: { trnm: "CNSRLST" },
    options: {},
  });
  assert.deepEqual(result.data.conditions[0], {
    id: "4",
    seq: "4",
    queryIndex: null,
    name: "거래량 급증",
    groupName: null,
    raw: ["4", "거래량 급증"],
  });
});

test("searches LS saved condition results", async () => {
  const client = new FakeClient("ls");
  const service = new ScannerService({ ls: client });

  const result = await service.searchCondition("ls", { queryIndex: "testID0000", name: "거래량 급증" });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "t1859",
    params: {
      t1859InBlock: {
        query_index: "testID0000",
      },
    },
    options: {},
  });
  assert.equal(result.data.condition.queryIndex, "testID0000");
  assert.equal(result.data.items[0].symbol, "000250");
  assert.equal(result.data.items[0].name, "삼천당제약");
  assert.equal(result.data.items[0].price, 68300);
  assert.equal(result.data.items[0].changeRate, 1.79);
});

test("starts LS realtime condition search and normalizes AFR events", async () => {
  const client = new FakeClient("ls");
  const realtimeClient = new FakeRealtimeClient();
  const messages = [];
  const service = new ScannerService({ ls: client, lsRealtime: realtimeClient });

  const result = await service.startConditionSearchRealtime("ls", "testID0000", {
    onMessage: (message) => messages.push(message),
  });

  assert.equal(result.ok, true);
  assert.equal(client.calls[0].id, "t1860");
  assert.equal(result.data.realtimeKey, "1722490200A");
  assert.deepEqual(realtimeClient.subscriptions[0], {
    id: "AFR",
    key: "1722490200A",
    options: { streamKind: "quote" },
  });

  realtimeClient.emit("realtime", {
    data: {
      header: { tr_cd: "AFR", tr_key: "1722490200A" },
      body: {
        gsJobFlag: "N",
        gsCode: "078150",
        gshname: "HB테크놀러지",
        gsPrice: "2435",
        gsSign: "2",
        gsChange: "45",
        gsChgRate: "1.88",
        gsVolume: "3432360",
      },
    },
  });

  assert.equal(messages.length, 1);
  assert.equal(messages[0].kind, "conditionSearchEvent");
  assert.equal(messages[0].symbol, "078150");
  assert.equal(messages[0].eventType, "entered");
  assert.equal(messages[0].price, 2435);

  const stop = await result.unsubscribe();

  assert.equal(stop.ok, true);
  assert.equal(client.calls[1].id, "t1860");
  assert.equal(client.calls[1].params.t1860InBlock.sFlag, "D");
  assert.equal(client.calls[1].params.t1860InBlock.sAlertNum, "1722490200A");
  assert.deepEqual(realtimeClient.unsubscriptions[0], {
    id: "AFR",
    key: "1722490200A",
    options: { streamKind: "quote" },
  });
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

test("normalizes Kiwoom condition realtime messages directly", () => {
  const messages = normalizeConditionSearchRealtimeMessage("kiwoom", {
    trnm: "REAL",
    data: [
      {
        values: {
          841: "4",
          9001: "A005930",
          843: "I",
          20: "152028",
          907: "2",
        },
        type: "02",
        name: "조건검색",
        item: "005930",
      },
    ],
  });

  assert.equal(messages[0].kind, "conditionSearchEvent");
  assert.equal(messages[0].conditionId, "4");
  assert.equal(messages[0].symbol, "005930");
  assert.equal(messages[0].eventType, "entered");
  assert.equal(messages[0].side, "buy");
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

class FakeRealtimeClient {
  constructor() {
    this.handlers = new Map();
    this.subscriptions = [];
    this.unsubscriptions = [];
  }

  on(event, handler) {
    const handlers = this.handlers.get(event) ?? new Set();
    handlers.add(handler);
    this.handlers.set(event, handlers);
    return () => handlers.delete(handler);
  }

  async subscribe(id, key, options = {}) {
    this.subscriptions.push({ id, key, options });
    return { id, key, options, action: "subscribe" };
  }

  async unsubscribe(id, key, options = {}) {
    this.unsubscriptions.push({ id, key, options });
    return { id, key, options, action: "unsubscribe" };
  }

  emit(event, payload) {
    for (const handler of this.handlers.get(event) ?? []) {
      handler(payload);
    }
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

  if (id === "ka10171") {
    return {
      trnm: "CNSRLST",
      return_code: 0,
      return_msg: "",
      data: [
        ["4", "거래량 급증"],
        ["5", "기관외국인상위100"],
      ],
    };
  }

  if (id === "t1859") {
    return {
      t1859OutBlock: {
        result_count: 1,
        result_time: "171729",
        text: "",
      },
      t1859OutBlock1: [
        {
          shcode: "000250",
          hname: "삼천당제약",
          price: 68300,
          sign: "2",
          change: 1200,
          diff: "1.79",
          volume: 241418,
        },
      ],
      rsp_cd: "00000",
      rsp_msg: "",
    };
  }

  if (id === "t1860") {
    return {
      t1860OutBlock: {
        sSysUserFlag: "U",
        sFlag: "E",
        sResultFlag: "S",
        sTime: "172249",
        sAlertNum: "1722490200A",
        Msg: "정상처리 되었습니다.",
      },
      rsp_cd: "00000",
      rsp_msg: "조회 완료",
    };
  }

  return {};
}
