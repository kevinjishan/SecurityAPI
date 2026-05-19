import assert from "node:assert/strict";
import test from "node:test";

import {
  RealtimeService,
  normalizeDomesticStockRealtimeOrderBook,
  normalizeDomesticStockRealtimeOrderEvent,
  normalizeDomesticStockRealtimeTrade,
  normalizeDomesticStockRealtimeMessage,
  normalizeMarketStatusRealtimeMessage,
} from "../../src/index.mjs";
import { RealtimeService as RealtimeServiceFromPackage } from "security-api-reference/services";

test("exports RealtimeService through package service entry", () => {
  assert.equal(RealtimeServiceFromPackage, RealtimeService);
});

test("subscribes to domestic stock trade stream by capability", async () => {
  const client = new FakeRealtimeClient("kiwoom");
  const messages = [];
  const service = new RealtimeService({ kiwoom: client });

  const result = await service.subscribeDomesticStockTrades("kiwoom", "005930", {
    onMessage: (message) => messages.push(message),
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "0B");
  assert.deepEqual(client.subscriptions, [{ id: "0B", key: "005930", options: { streamKind: "quote" } }]);

  client.emit("realtime", {
    data: {
      trnm: "REAL",
      data: [{ type: "0B", name: "주식체결", item: "005930", values: { 10: "70000" } }],
    },
  });

  assert.equal(messages.length, 1);
  assert.equal(messages[0].id, "0B");
  assert.equal(messages[0].kind, "trade");
  assert.equal(messages[0].symbol, "005930");
  assert.equal(messages[0].price, 70000);
  assert.equal(messages[0].body["10"], "70000");
});

test("subscribes to LS order event stream as account registration", async () => {
  const client = new FakeRealtimeClient("ls");
  const service = new RealtimeService({ ls: client });

  const result = await service.subscribeDomesticStockOrderEvents("ls", {}, {
    trCode: "SC1",
  });
  const unsubscribe = await result.unsubscribe();

  assert.equal(result.ok, true);
  assert.equal(result.id, "SC1");
  assert.deepEqual(client.subscriptions[0], { id: "SC1", key: "", options: { trCode: "SC1", streamKind: "account" } });
  assert.deepEqual(unsubscribe, { id: "SC1", key: "", action: "unsubscribe" });
});

test("subscribes to market status stream by capability", async () => {
  const client = new FakeRealtimeClient("kiwoom");
  const messages = [];
  const service = new RealtimeService({ kiwoom: client });

  const result = await service.subscribeMarketStatus("kiwoom", {
    onMessage: (message) => messages.push(message),
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "0s");
  assert.deepEqual(client.subscriptions[0], { id: "0s", key: "", options: { streamKind: "quote" } });

  client.emit("realtime", {
    data: {
      trnm: "REAL",
      data: [{ type: "0s", name: "장시작시간", item: "", values: { 215: "3", 20: "090000", 214: "000000" } }],
    },
  });

  assert.equal(messages.length, 1);
  assert.equal(messages[0].kind, "marketStatus");
  assert.equal(messages[0].eventCode, "3");
  assert.equal(messages[0].eventName, "장시작");
  assert.equal(messages[0].session, "regular");
  assert.equal(messages[0].phase, "open");
  assert.equal(messages[0].time, "090000");
});

test("returns unsupported response for unavailable realtime balance", async () => {
  const service = new RealtimeService({ ls: new FakeRealtimeClient("ls") });

  const result = await service.subscribeDomesticStockBalance("ls");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_CAPABILITY");
});

test("normalizes LS market status messages", () => {
  const [message] = normalizeMarketStatusRealtimeMessage("ls", {
    header: { tr_cd: "JIF", tr_key: "0" },
    body: { jangubun: "1", jstatus: "64" },
  });

  assert.equal(message.kind, "marketStatus");
  assert.equal(message.market, "kospi");
  assert.equal(message.marketName, "KOSPI");
  assert.equal(message.eventCode, "64");
  assert.equal(message.eventName, "사이드카 매도발동");
  assert.equal(message.session, "regular");
  assert.equal(message.phase, "sidecar");
});

test("normalizes domestic stock realtime messages through service export", () => {
  const messages = normalizeDomesticStockRealtimeMessage("ls", {
    header: { tr_cd: "S3_", tr_key: "005930" },
    body: { shcode: "005930", chetime: "093001", price: "70000", cvolume: "10", cgubun: "+" },
  });

  assert.equal(messages[0].broker, "ls");
  assert.equal(messages[0].id, "S3_");
  assert.equal(messages[0].key, "005930");
  assert.equal(messages[0].kind, "trade");
  assert.equal(messages[0].tradeTime, "093001");
  assert.equal(messages[0].tradeQuantity, 10);
  assert.equal(messages[0].tradeSide, "buy");
});

test("normalizes Kiwoom realtime order book messages", () => {
  const [message] = normalizeDomesticStockRealtimeOrderBook("kiwoom", {
    trnm: "REAL",
    data: [{
      type: "0D",
      name: "주식호가잔량",
      item: "005930",
      values: {
        21: "093000",
        41: "-70100",
        51: "-70000",
        61: "10",
        71: "15",
        121: "100",
        125: "200",
      },
    }],
  });

  assert.equal(message.kind, "orderBook");
  assert.equal(message.symbol, "005930");
  assert.equal(message.timestamp, "093000");
  assert.equal(message.asks[0].price, 70100);
  assert.equal(message.bids[0].quantity, 15);
  assert.equal(message.totals.bidQuantity, 200);
});

test("normalizes LS realtime order events", () => {
  const [message] = normalizeDomesticStockRealtimeOrderEvent("ls", {
    header: { tr_cd: "SC1" },
    body: {
      accno: "12345678901",
      ordno: "50",
      execno: "1",
      shtnIsuno: "A005930",
      Isunm: "삼성전자",
      bnstp: "2",
      ordxctptncode: "11",
      ordqty: "10",
      ordprc: "70000",
      execqty: "8",
      execprc: "69900",
      unercqty: "2",
      exectime: "130544000",
    },
  });

  assert.equal(message.kind, "orderEvent");
  assert.equal(message.accountId, "12345678901");
  assert.equal(message.orderId, "50");
  assert.equal(message.executionId, "1");
  assert.equal(message.symbol, "005930");
  assert.equal(message.side, "buy");
  assert.equal(message.status, "11");
  assert.equal(message.orderQuantity, 10);
  assert.equal(message.executedQuantity, 8);
  assert.equal(message.executedPrice, 69900);
  assert.equal(message.remainingQuantity, 2);
});

test("normalizes Kiwoom realtime trades with signed trade side", () => {
  const [message] = normalizeDomesticStockRealtimeTrade("kiwoom", {
    trnm: "REAL",
    data: [{
      type: "0B",
      item: "005930",
      values: {
        20: "130501",
        10: "-70000",
        11: "-100",
        12: "-0.14",
        15: "-3",
        13: "1000",
      },
    }],
  });

  assert.equal(message.kind, "trade");
  assert.equal(message.symbol, "005930");
  assert.equal(message.price, 70000);
  assert.equal(message.change, -100);
  assert.equal(message.tradeQuantity, 3);
  assert.equal(message.tradeSide, "sell");
});

class FakeRealtimeClient {
  constructor(broker) {
    this.broker = broker;
    this.handlers = new Map();
    this.subscriptions = [];
  }

  on(event, handler) {
    const handlers = this.handlers.get(event) ?? new Set();
    handlers.add(handler);
    this.handlers.set(event, handlers);
    return () => handlers.delete(handler);
  }

  async subscribe(id, key, options) {
    this.subscriptions.push({ id, key, options });
    return { id, key, action: "subscribe" };
  }

  async unsubscribe(id, key) {
    return { id, key, action: "unsubscribe" };
  }

  emit(event, payload) {
    for (const handler of this.handlers.get(event) ?? []) {
      handler(payload);
    }
  }
}
