import assert from "node:assert/strict";
import test from "node:test";

import {
  DomesticStockRealtimeSignalState,
  SignalInputService,
  applyDomesticStockRealtimeSignalMessage,
  buildDomesticStockSignalInputs,
  createDomesticStockRealtimeSignalState,
} from "../../src/index.mjs";
import {
  DomesticStockRealtimeSignalState as DomesticStockRealtimeSignalStateFromPackage,
  SignalInputService as SignalInputServiceFromPackage,
} from "security-api-reference/services";

test("exports SignalInputService through package service entry", () => {
  assert.equal(SignalInputServiceFromPackage, SignalInputService);
  assert.equal(DomesticStockRealtimeSignalStateFromPackage, DomesticStockRealtimeSignalState);
});

test("gets and builds Kiwoom domestic stock signal inputs", async () => {
  const client = new FakeClient("kiwoom");
  const service = new SignalInputService({ kiwoom: client });

  const result = await service.getDomesticStockSignalInputs("kiwoom", "005930", {
    includeRankings: true,
    intervalMinutes: 5,
    minuteCount: 3,
    dailyCount: 3,
    generatedAt: "2026-05-19T00:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls.map((call) => call.id).sort(), [
    "ka10001",
    "ka10001",
    "ka10004",
    "ka10027",
    "ka10030",
    "ka10032",
    "ka10080",
    "ka10081",
  ]);
  assert.equal(client.calls.find((call) => call.id === "ka10080").params.tic_scope, "5");
  assert.equal(result.data.generatedAt, "2026-05-19T00:00:00.000Z");
  assert.equal(result.data.metrics.price.current, 70100);
  assert.equal(result.data.metrics.intraday.range, 1500);
  assert.ok(closeTo(result.data.metrics.intraday.rangePosition, 0.7333333333));
  assert.ok(closeTo(result.data.metrics.momentum.minuteCloseChangeRate, 0.5738880918));
  assert.equal(result.data.metrics.volume.minuteVolumeRatio, 2.5);
  assert.ok(closeTo(result.data.metrics.orderBook.imbalance, 0.3333333333));
  assert.equal(result.data.signals.priceMomentum.direction, "up");
  assert.equal(result.data.signals.volumeSpike.active, true);
  assert.equal(result.data.signals.orderBookImbalance.direction, "bid");
  assert.equal(result.data.rankings.volume.rank, 1);
  assert.equal(result.data.rankings.value.rank, 2);
  assert.equal(result.data.rankings.changeRate.rank, 3);
  assert.equal(result.data.warnings.length, 0);
});

test("can use injected services for signal inputs", async () => {
  const result = await new SignalInputService({
    quote: {
      async getDomesticStockCurrentPrice() {
        return okResult("quote.domesticStock.currentPrice", "ka10001", {
          broker: "kiwoom",
          symbol: "005930",
          price: 100,
          change: 5,
          changeRate: 5.26,
          volume: 1000,
        });
      },
      async getDomesticStockOrderBook() {
        return okResult("quote.domesticStock.orderBook", "ka10004", {
          asks: [{ level: 1, price: 101, quantity: 100 }],
          bids: [{ level: 1, price: 100, quantity: 300 }],
          totals: { askQuantity: 100, bidQuantity: 300 },
        });
      },
    },
    marketData: {
      async getDomesticStockBasicInfo() {
        return okResult("marketData.domesticStock.basicInfo", "ka10001", {
          open: 95,
          high: 105,
          low: 90,
        });
      },
      async getDomesticStockDailyCandles() {
        return okResult("marketData.domesticStock.dailyCandles", "ka10081", {
          candles: [],
        });
      },
      async getDomesticStockMinuteCandles() {
        return okResult("marketData.domesticStock.minuteCandles", "ka10080", {
          candles: [],
        });
      },
    },
    scanner: {},
  }).getDomesticStockSignalInputs("kiwoom", "005930", {
    includeDailyCandles: false,
    includeMinuteCandles: false,
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.metrics.price.current, 100);
  assert.equal(result.data.metrics.orderBook.askQuantity, 100);
  assert.equal(result.data.signals.dayRange.zone, "middle");
});

test("can include market context and flow in signal inputs", async () => {
  const client = new FakeClient("kiwoom");
  const service = new SignalInputService({ kiwoom: client });

  const result = await service.getDomesticStockSignalInputs("kiwoom", "005930", {
    includeOrderBook: false,
    includeBasicInfo: false,
    includeDailyCandles: false,
    includeMinuteCandles: false,
    includeMarketContext: true,
    includeMarketIndexCandles: true,
    includeMarketFlow: true,
    market: "kospi",
    baseDate: "20260519",
    generatedAt: "2026-05-19T00:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls.map((call) => call.id).sort(), [
    "ka10001",
    "ka10051",
    "ka20001",
    "ka20001",
    "ka20006",
    "ka90005",
  ]);
  assert.equal(result.data.market.targetMarket, "kospi");
  assert.equal(result.data.market.snapshot.indexes.length, 2);
  assert.equal(result.data.market.indexDailyCandles.candles.length, 2);
  assert.equal(result.data.market.metrics.flow.foreignInstitutionalNetBuy, 1500);
  assert.equal(result.data.metrics.market.flow.programTotalNetBuy, 17);
  assert.equal(result.data.signals.market.indexMomentum, "positive");
  assert.equal(result.data.signals.market.foreignInstitutionalFlow, "positive");
  assert.equal(result.data.warnings.length, 0);
});

test("can include condition search matches in signal inputs", async () => {
  const client = new FakeClient("kiwoom");
  const service = new SignalInputService({ kiwoom: client });

  const result = await service.getDomesticStockSignalInputs("kiwoom", "005930", {
    includeOrderBook: false,
    includeBasicInfo: false,
    includeDailyCandles: false,
    includeMinuteCandles: false,
    includeConditionSearch: true,
    conditionSearches: [
      { seq: "4", name: "거래량 급증" },
      { seq: "5", name: "기관외국인상위100" },
    ],
    generatedAt: "2026-05-19T00:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls.map((call) => call.id), ["ka10001", "ka10172", "ka10172"]);
  assert.equal(result.data.conditions.metrics.searchedCount, 2);
  assert.equal(result.data.conditions.metrics.matchedCount, 1);
  assert.equal(result.data.conditions.matches[0].condition.seq, "4");
  assert.equal(result.data.conditions.matches[0].item.symbol, "005930");
  assert.equal(result.data.metrics.conditions.matchedRatio, 0.5);
  assert.equal(result.data.signals.conditions.anyMatch, true);
  assert.deepEqual(result.data.signals.conditions.matchedNames, ["거래량 급증"]);
  assert.equal(result.data.source.conditionSearches[0].id, "ka10172");
});

test("can include expected index in signal inputs", async () => {
  const result = await new SignalInputService({
    quote: {
      async getDomesticStockCurrentPrice() {
        return okResult("quote.domesticStock.currentPrice", "t1101", {
          broker: "ls",
          symbol: "005930",
          price: 100,
        });
      },
    },
    marketData: {},
    marketContext: {
      async getDomesticExpectedIndex() {
        return okResult("marketContext.domesticIndex.expected", "t1485", {
          broker: "ls",
          index: "kospi",
          session: "1",
          summary: {
            latestTime: "084000",
            latestExpectedIndex: 2601.36,
            latestChangeRate: 0.6,
          },
          timeline: [],
        });
      },
    },
    marketFlow: {},
    scanner: {},
  }).getDomesticStockSignalInputs("ls", "005930", {
    includeOrderBook: false,
    includeBasicInfo: false,
    includeDailyCandles: false,
    includeMinuteCandles: false,
    includeExpectedIndex: true,
    market: "kospi",
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.market.expectedIndex.summary.latestExpectedIndex, 2601.36);
  assert.equal(result.data.metrics.market.expectedIndex.latestChangeRate, 0.6);
  assert.equal(result.data.signals.market.expectedIndex, "positive");
});

test("returns config errors when the current price source fails", async () => {
  const service = new SignalInputService({});

  const result = await service.getDomesticStockSignalInputs("kiwoom", "005930");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "CONFIG_ERROR");
});

test("builds signal inputs directly from normalized service results", () => {
  const data = buildDomesticStockSignalInputs({
    broker: "kiwoom",
    symbol: "005930",
    options: {
      generatedAt: "2026-05-19T00:00:00.000Z",
      thresholds: {
        nearHighRangePosition: 0.7,
      },
    },
    results: {
      currentPrice: okResult("quote.domesticStock.currentPrice", "ka10001", {
        price: 108,
      }),
      basicInfo: okResult("marketData.domesticStock.basicInfo", "ka10001", {
        open: 100,
        high: 110,
        low: 90,
      }),
      orderBook: okResult("quote.domesticStock.orderBook", "ka10004", {
        asks: [{ level: 1, price: 109, quantity: 100 }],
        bids: [{ level: 1, price: 108, quantity: 100 }],
        totals: { askQuantity: 100, bidQuantity: 100 },
      }),
      dailyCandles: okResult("marketData.domesticStock.dailyCandles", "ka10081", {
        candles: [
          { timestamp: "20260518", close: 100, volume: 1000 },
          { timestamp: "20260519", close: 108, volume: 2000 },
        ],
      }),
      minuteCandles: okResult("marketData.domesticStock.minuteCandles", "ka10080", {
        candles: [
          { timestamp: "20260519090000", close: 100, volume: 100 },
          { timestamp: "20260519090500", close: 108, volume: 300 },
        ],
      }),
    },
  });

  assert.equal(data.signals.dayRange.zone, "nearHigh");
  assert.equal(data.metrics.momentum.dailyCloseChange, 8);
  assert.equal(data.metrics.volume.minuteVolumeRatio, 3);
});

test("updates signal inputs from realtime trade and order book messages", () => {
  const initialInputs = sampleSignalInputs();
  const state = createDomesticStockRealtimeSignalState(initialInputs, {
    intervalMinutes: 5,
    tradeDate: "20260519",
    startedAt: "2026-05-19T00:00:00.000Z",
  });

  const tradeUpdate = state.applyRealtimeMessage({
    kind: "trade",
    broker: "kiwoom",
    symbol: "005930",
    tradeTime: "094212",
    price: 104,
    priceRaw: "104",
    change: 4,
    changeRate: 4,
    tradeQuantity: 200,
    volume: 1500,
    open: 100,
    high: 104,
    low: 99,
    currency: "KRW",
  }, {
    updatedAt: "2026-05-19T00:01:00.000Z",
  });

  assert.equal(tradeUpdate.updated, true);
  assert.equal(tradeUpdate.data.quote.price, 104);
  assert.equal(tradeUpdate.data.basicInfo.high, 104);
  assert.equal(tradeUpdate.data.candles.minute.at(-1).timestamp, "20260519094000");
  assert.equal(tradeUpdate.data.candles.minute.at(-1).close, 104);
  assert.equal(tradeUpdate.data.candles.minute.at(-1).volume, 300);
  assert.equal(tradeUpdate.data.metrics.volume.minuteVolumeRatio, 3);
  assert.equal(tradeUpdate.data.signals.volumeSpike.active, true);
  assert.equal(tradeUpdate.data.realtime.tradeCount, 1);
  assert.equal(tradeUpdate.data.realtime.lastMessageKind, "trade");

  const orderBookUpdate = state.applyRealtimeMessage({
    kind: "orderBook",
    broker: "kiwoom",
    symbol: "005930",
    timestamp: "094213",
    asks: [{ level: 1, price: 105, quantity: 100 }],
    bids: [{ level: 1, price: 104, quantity: 400 }],
    totals: { askQuantity: 100, bidQuantity: 400 },
  }, {
    updatedAt: "2026-05-19T00:02:00.000Z",
  });

  assert.equal(orderBookUpdate.updated, true);
  assert.equal(orderBookUpdate.data.metrics.orderBook.bestBidPrice, 104);
  assert.equal(orderBookUpdate.data.signals.orderBookImbalance.direction, "bid");
  assert.equal(orderBookUpdate.data.realtime.orderBookUpdateCount, 1);

  const ignored = state.applyRealtimeMessage({
    kind: "trade",
    broker: "kiwoom",
    symbol: "000660",
    price: 200,
  });

  assert.equal(ignored.updated, false);
  assert.equal(ignored.reason, "symbol_mismatch");
  assert.equal(ignored.data.realtime.ignoredCount, 1);
});

test("applies one realtime message through the helper", () => {
  const update = applyDomesticStockRealtimeSignalMessage(sampleSignalInputs(), {
    kind: "trade",
    broker: "kiwoom",
    symbol: "005930",
    tradeTime: "094200",
    price: 103,
    tradeQuantity: 50,
  }, {
    intervalMinutes: 5,
    tradeDate: "20260519",
    updatedAt: "2026-05-19T00:01:00.000Z",
  });

  assert.equal(update.updated, true);
  assert.equal(update.data.quote.price, 103);
  assert.equal(update.data.realtime.tradeCount, 1);
});

test("subscribes to realtime signal input updates", async () => {
  const realtime = new FakeRealtimeService();
  const updates = [];
  const service = new SignalInputService({
    quote: {},
    marketData: {},
    scanner: {},
    realtime,
  });

  const result = await service.subscribeDomesticStockSignalInputs("kiwoom", "005930", {
    onUpdate: (data, message) => updates.push({ data, message }),
  }, {
    initialInputs: sampleSignalInputs(),
    intervalMinutes: 5,
    tradeDate: "20260519",
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "signal.domesticStock.realtimeInputs");
  assert.deepEqual(realtime.subscriptions.map((subscription) => subscription.kind), ["trade", "orderBook"]);

  realtime.emitTrade({
    kind: "trade",
    broker: "kiwoom",
    symbol: "005930",
    tradeTime: "094212",
    price: 104,
    tradeQuantity: 100,
  });
  realtime.emitOrderBook({
    kind: "orderBook",
    broker: "kiwoom",
    symbol: "005930",
    asks: [{ level: 1, price: 105, quantity: 50 }],
    bids: [{ level: 1, price: 104, quantity: 150 }],
    totals: { askQuantity: 50, bidQuantity: 150 },
  });

  assert.equal(updates.length, 2);
  assert.equal(updates[0].data.quote.price, 104);
  assert.equal(updates[1].data.realtime.orderBookUpdateCount, 1);

  const unsubscribe = await result.unsubscribe();
  assert.deepEqual(unsubscribe, ["trade-unsubscribed", "order-book-unsubscribed"]);
});

test("can include market status in realtime signal input updates", async () => {
  const realtime = new FakeRealtimeService();
  const updates = [];
  const service = new SignalInputService({
    quote: {},
    marketData: {},
    scanner: {},
    realtime,
  });

  const result = await service.subscribeDomesticStockSignalInputs("kiwoom", "005930", {
    onUpdate: (data, message) => updates.push({ data, message }),
  }, {
    initialInputs: sampleSignalInputs(),
    includeRealtimeOrderBook: false,
    includeMarketStatus: true,
    startedAt: "2026-05-19T00:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(realtime.subscriptions.map((subscription) => subscription.kind), ["trade", "marketStatus"]);

  realtime.emitMarketStatus({
    kind: "marketStatus",
    broker: "kiwoom",
    session: "regular",
    phase: "open",
    eventCode: "3",
    eventName: "장시작",
    time: "090000",
    remainingTime: "000000",
  });

  assert.equal(updates.length, 1);
  assert.equal(updates[0].message.kind, "marketStatus");
  assert.equal(updates[0].data.market.status.phase, "open");
  assert.equal(updates[0].data.realtime.marketStatusUpdateCount, 1);
});

test("can include realtime condition search events in signal input updates", async () => {
  const realtime = new FakeRealtimeService();
  const scanner = new FakeScannerService();
  const updates = [];
  const service = new SignalInputService({
    quote: {},
    marketData: {},
    scanner,
    realtime,
  });

  const result = await service.subscribeDomesticStockSignalInputs("kiwoom", "005930", {
    onUpdate: (data, message) => updates.push({ data, message }),
  }, {
    initialInputs: sampleSignalInputsWithConditionSearch(),
    includeRealtimeOrderBook: false,
    includeRealtimeConditionSearch: true,
    conditionSearches: [{ seq: "4", name: "거래량 급증" }],
    startedAt: "2026-05-19T00:00:00.000Z",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(realtime.subscriptions.map((subscription) => subscription.kind), ["trade"]);
  assert.deepEqual(scanner.subscriptions.map((subscription) => subscription.kind), ["conditionSearch"]);
  assert.equal(result.data.conditions.searches[0].condition.realtimeKey, "4");

  scanner.emitCondition({
    kind: "conditionSearchEvent",
    broker: "kiwoom",
    conditionId: "4",
    realtimeKey: "4",
    symbol: "005930",
    name: "삼성전자",
    eventType: "entered",
    eventCode: "I",
    time: "094500",
    price: 105,
    change: 5,
    changeRate: 5,
    volume: 1500,
  });

  assert.equal(updates.length, 1);
  assert.equal(updates[0].message.kind, "conditionSearchEvent");
  assert.equal(updates[0].data.conditions.metrics.matchedCount, 1);
  assert.equal(updates[0].data.conditions.matches[0].item.symbol, "005930");
  assert.equal(updates[0].data.signals.conditions.anyMatch, true);
  assert.equal(updates[0].data.realtime.conditionSearchEventCount, 1);

  scanner.emitCondition({
    kind: "conditionSearchEvent",
    broker: "kiwoom",
    conditionId: "4",
    realtimeKey: "4",
    symbol: "005930",
    eventType: "exited",
    eventCode: "D",
    time: "095000",
  });

  assert.equal(updates.length, 2);
  assert.equal(updates[1].data.conditions.metrics.matchedCount, 0);
  assert.equal(updates[1].data.signals.conditions.anyMatch, false);
  assert.equal(updates[1].data.realtime.conditionSearchEventCount, 2);

  const unsubscribe = await result.unsubscribe();
  assert.deepEqual(unsubscribe, ["trade-unsubscribed", "condition-realtime-unsubscribed"]);
});

class FakeClient {
  constructor(broker) {
    this.broker = broker;
    this.calls = [];
  }

  async request(id, params, options = {}) {
    this.calls.push({ id, params, options });
    const data = fakePayload(id, params);
    return {
      ok: true,
      broker: this.broker,
      id,
      data,
      raw: data,
      headers: {},
      status: 200,
    };
  }
}

class FakeRealtimeService {
  constructor() {
    this.subscriptions = [];
    this.tradeHandlers = null;
    this.orderBookHandlers = null;
  }

  async subscribeDomesticStockTrades(broker, symbol, handlers, options) {
    this.tradeHandlers = handlers;
    this.subscriptions.push({ kind: "trade", broker, symbol, options });

    return {
      ok: true,
      broker,
      id: "0B",
      symbol,
      unsubscribe: async () => "trade-unsubscribed",
    };
  }

  async subscribeDomesticStockOrderBook(broker, symbol, handlers, options) {
    this.orderBookHandlers = handlers;
    this.subscriptions.push({ kind: "orderBook", broker, symbol, options });

    return {
      ok: true,
      broker,
      id: "0D",
      symbol,
      unsubscribe: async () => "order-book-unsubscribed",
    };
  }

  async subscribeMarketStatus(broker, handlers, options) {
    this.marketStatusHandlers = handlers;
    this.subscriptions.push({ kind: "marketStatus", broker, options });

    return {
      ok: true,
      broker,
      id: "0s",
      unsubscribe: async () => "market-status-unsubscribed",
    };
  }

  emitTrade(message) {
    this.tradeHandlers?.onMessage(message);
  }

  emitOrderBook(message) {
    this.orderBookHandlers?.onMessage(message);
  }

  emitMarketStatus(message) {
    this.marketStatusHandlers?.onMessage(message);
  }
}

class FakeScannerService {
  constructor() {
    this.subscriptions = [];
    this.conditionHandlers = [];
  }

  async startConditionSearchRealtime(broker, condition, handlers, options) {
    this.conditionHandlers.push(handlers);
    this.subscriptions.push({ kind: "conditionSearch", broker, condition, options });

    return {
      ok: true,
      broker,
      capability: "scanner.conditionSearch.realtime",
      id: "ka10173",
      data: {
        broker,
        condition,
        realtimeKey: condition.seq ?? condition.id,
        status: "started",
      },
      unsubscribe: async () => "condition-realtime-unsubscribed",
    };
  }

  emitCondition(message) {
    for (const handlers of this.conditionHandlers) {
      handlers.onMessage(message);
    }
  }
}

function fakePayload(id, params = {}) {
  if (id === "ka10001") {
    return {
      stk_cd: "005930",
      stk_nm: "삼성전자",
      cur_prc: "70100",
      pred_pre: "+600",
      flu_rt: "+0.86",
      trde_qty: "1000000",
      open_pric: "69600",
      high_pric: "70500",
      low_pric: "69000",
      base_pric: "69500",
    };
  }

  if (id === "ka10004") {
    return {
      bid_req_base_tm: "093000",
      sel_fpr_bid: "70200",
      sel_fpr_req: "100",
      buy_fpr_bid: "70000",
      buy_fpr_req: "200",
      tot_sel_req: "100",
      tot_buy_req: "200",
    };
  }

  if (id === "ka10081") {
    return {
      stk_dt_pole_chart_qry: [
        { dt: "20260517", open_pric: "68000", high_pric: "70000", low_pric: "67500", cur_prc: "69000", trde_qty: "8000000" },
        { dt: "20260518", open_pric: "69000", high_pric: "70000", low_pric: "68500", cur_prc: "69500", trde_qty: "8500000" },
        { dt: "20260519", open_pric: "69600", high_pric: "70500", low_pric: "69000", cur_prc: "70100", trde_qty: "10000000" },
      ],
    };
  }

  if (id === "ka10080") {
    return {
      stk_min_pole_chart_qry: [
        { cntr_tm: "20260519093000", open_pric: "69600", high_pric: "69800", low_pric: "69500", cur_prc: "69700", trde_qty: "300" },
        { cntr_tm: "20260519093500", open_pric: "69700", high_pric: "70000", low_pric: "69600", cur_prc: "69900", trde_qty: "500" },
        { cntr_tm: "20260519094000", open_pric: "69900", high_pric: "70200", low_pric: "69800", cur_prc: "70100", trde_qty: "1000" },
      ],
    };
  }

  if (id === "ka10030") {
    return {
      tdy_trde_qty_upper: [
        { rank: "1", stk_cd: "005930", stk_nm: "삼성전자", cur_prc: "70100", flu_rt: "+0.86", trde_qty: "1000000", trde_amt: "70100000" },
      ],
    };
  }

  if (id === "ka10032") {
    return {
      trde_prica_upper: [
        { rank: "2", stk_cd: "005930", stk_nm: "삼성전자", cur_prc: "70100", flu_rt: "+0.86", trde_qty: "1000000", trde_prica: "70100000" },
      ],
    };
  }

  if (id === "ka10027") {
    return {
      pred_pre_flu_rt_upper: [
        { rank: "3", stk_cd: "005930", stk_nm: "삼성전자", cur_prc: "70100", flu_rt: "+0.86", now_trde_qty: "1000000" },
      ],
    };
  }

  if (id === "ka10172") {
    const matchedSymbol = params.seq === "4" ? "A005930" : "A000660";

    return {
      trnm: "CNSRREQ",
      seq: params.seq ?? "4",
      cont_yn: "N",
      next_key: "",
      return_code: 0,
      return_msg: "",
      data: [
        {
          9001: matchedSymbol,
          302: matchedSymbol === "A005930" ? "삼성전자" : "SK하이닉스",
          10: "000070100",
          25: "2",
          11: "000000600",
          12: "000000086",
          13: "001000000",
        },
      ],
    };
  }

  if (id === "ka20001") {
    return {
      inds_cd: "001",
      inds_nm: "KOSPI",
      cur_prc: "285000",
      pred_pre: "+500",
      flu_rt: "+0.18",
      open_pric: "284000",
      high_pric: "286000",
      low_pric: "283500",
      trde_qty: "1000000",
      trde_prica: "500000",
      rising: "500",
      stdns: "100",
      fall: "320",
    };
  }

  if (id === "ka20006") {
    return {
      inds_dt_pole_qry: [
        { dt: "20260518", open_pric: "283000", high_pric: "285000", low_pric: "282000", cur_prc: "284500", trde_qty: "1000000" },
        { dt: "20260519", open_pric: "284500", high_pric: "286000", low_pric: "284000", cur_prc: "285000", trde_qty: "1200000" },
      ],
    };
  }

  if (id === "ka10051") {
    return {
      inds_netprps: [
        {
          inds_cd: "001",
          inds_nm: "KOSPI",
          cur_prc: "285000",
          pred_pre: "+500",
          flu_rt: "+0.18",
          ind_netprps: "-2000",
          frgnr_netprps: "1000",
          orgn_netprps: "500",
          sc_netprps: "100",
          invtrt_netprps: "200",
          bank_netprps: "30",
          insrnc_netprps: "40",
          jnsinkm_netprps: "0",
          endw_netprps: "50",
          natn_netprps: "0",
          samo_fund_netprps: "80",
          etc_corp_netprps: "10",
        },
      ],
    };
  }

  if (id === "ka90005") {
    return {
      prm_trde_trnsn: [
        {
          cntr_tm: "170500",
          all_buy: "100",
          all_sel: "83",
          all_netprps: "17",
          dfrt_trde_buy: "20",
          dfrt_trde_sel: "20",
          dfrt_trde_netprps: "0",
          ndiffpro_trde_buy: "80",
          ndiffpro_trde_sel: "63",
          ndiffpro_trde_netprps: "17",
          kospi200: "47839",
          basis: "-146.59",
        },
      ],
    };
  }

  return {};
}

function sampleSignalInputs() {
  return buildDomesticStockSignalInputs({
    broker: "kiwoom",
    symbol: "005930",
    options: {
      generatedAt: "2026-05-19T00:00:00.000Z",
    },
    results: {
      currentPrice: okResult("quote.domesticStock.currentPrice", "ka10001", {
        broker: "kiwoom",
        symbol: "005930",
        price: 102,
        change: 2,
        changeRate: 2,
        volume: 1000,
      }),
      basicInfo: okResult("marketData.domesticStock.basicInfo", "ka10001", {
        broker: "kiwoom",
        symbol: "005930",
        price: 102,
        open: 100,
        high: 103,
        low: 99,
        referencePrice: 100,
        volume: 1000,
      }),
      orderBook: okResult("quote.domesticStock.orderBook", "ka10004", {
        broker: "kiwoom",
        symbol: "005930",
        asks: [{ level: 1, price: 103, quantity: 100 }],
        bids: [{ level: 1, price: 102, quantity: 100 }],
        totals: { askQuantity: 100, bidQuantity: 100 },
      }),
      dailyCandles: okResult("marketData.domesticStock.dailyCandles", "ka10081", {
        candles: [
          { timestamp: "20260518", close: 100, volume: 1000 },
          { timestamp: "20260519", close: 102, volume: 1500 },
        ],
      }),
      minuteCandles: okResult("marketData.domesticStock.minuteCandles", "ka10080", {
        candles: [
          { date: "20260519", time: "093500", timestamp: "20260519093500", open: 100, high: 101, low: 99, close: 100, volume: 100 },
          { date: "20260519", time: "094000", timestamp: "20260519094000", open: 101, high: 102, low: 100, close: 102, volume: 100 },
        ],
      }),
    },
  });
}

function sampleSignalInputsWithConditionSearch() {
  const data = sampleSignalInputs();

  data.conditions = {
    searches: [
      {
        condition: {
          id: "4",
          seq: "4",
          queryIndex: null,
          realtimeKey: null,
          alertKey: null,
          name: "거래량 급증",
          groupName: null,
        },
        matched: false,
        item: null,
        itemCount: 0,
        summary: null,
        source: {
          ok: true,
          broker: "kiwoom",
          id: "ka10172",
          capability: "scanner.conditionSearch.search",
          status: 200,
        },
      },
    ],
    matches: [],
    metrics: {
      searchedCount: 1,
      matchedCount: 0,
      unmatchedCount: 1,
      matchedRatio: 0,
    },
    indicators: {
      anyMatch: false,
      matchedCount: 0,
      matchedConditionIds: [],
      matchedNames: [],
    },
  };
  data.metrics.conditions = data.conditions.metrics;
  data.signals.conditions = data.conditions.indicators;
  data.source.conditionSearches = [
    {
      ok: true,
      broker: "kiwoom",
      id: "ka10172",
      capability: "scanner.conditionSearch.search",
      status: 200,
    },
  ];

  return data;
}

function okResult(capability, id, data) {
  return {
    ok: true,
    broker: "kiwoom",
    capability,
    id,
    data,
    raw: data,
    headers: {},
    status: 200,
  };
}

function closeTo(actual, expected, tolerance = 0.000001) {
  return Math.abs(actual - expected) <= tolerance;
}
