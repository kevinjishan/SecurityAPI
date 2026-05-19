import assert from "node:assert/strict";
import test from "node:test";

import {
  OverseasStockRealtimeService,
  normalizeOverseasStockRealtimeMessage,
  normalizeOverseasStockRealtimeOrderBook,
  normalizeOverseasStockRealtimeOrderEvent,
  normalizeOverseasStockRealtimeTrade,
} from "../../src/index.mjs";
import { OverseasStockRealtimeService as OverseasStockRealtimeServiceFromPackage } from "security-api-reference/services";

test("exports OverseasStockRealtimeService through package service entry", () => {
  assert.equal(OverseasStockRealtimeServiceFromPackage, OverseasStockRealtimeService);
});

test("subscribes to LS overseas stock trades with documented padded realtime key", async () => {
  const client = new FakeRealtimeClient("ls");
  const messages = [];
  const service = new OverseasStockRealtimeService({ ls: client });

  const result = await service.subscribeOverseasStockTrades("ls", {
    symbol: "TSLA",
    exchangeCode: "82",
  }, {
    onMessage: (message) => messages.push(message),
  });

  assert.equal(result.ok, true);
  assert.equal(result.capability, "overseasStock.realtime.trade");
  assert.equal(result.id, "GSC");
  assert.equal(result.key, "82TSLA".padEnd(18, " "));
  assert.deepEqual(client.subscriptions, [{
    id: "GSC",
    key: "82TSLA".padEnd(18, " "),
    options: { streamKind: "quote" },
  }]);

  client.emit("realtime", {
    data: {
      header: { tr_cd: "GSC", tr_key: "82TSLA".padEnd(18, " ") },
      body: {
        symbol: "TSLA",
        ovsdate: "20260519",
        kordate: "20260520",
        trdtm: "093001",
        kortm: "223001",
        price: "283.820000",
        diff: "1.130000",
        rate: "0.40",
        trdq: "15",
        totq: "1000",
        amount: "283820",
        cgubun: "+",
        open: "280.000000",
        high: "284.000000",
        low: "279.000000",
        lSeq: "12",
      },
    },
  });

  assert.equal(messages.length, 1);
  assert.equal(messages[0].kind, "trade");
  assert.equal(messages[0].market, "overseas");
  assert.equal(messages[0].symbol, "TSLA");
  assert.equal(messages[0].localTime, "093001");
  assert.equal(messages[0].koreaTime, "223001");
  assert.equal(messages[0].price, 283.82);
  assert.equal(messages[0].change, 1.13);
  assert.equal(messages[0].tradeQuantity, 15);
  assert.equal(messages[0].volume, 1000);
  assert.equal(messages[0].amount, 283820);
  assert.equal(messages[0].tradeSide, "buy");
  assert.equal(messages[0].sequence, "12");
});

test("subscribes to LS overseas stock order book and normalizes 10-level book", async () => {
  const client = new FakeRealtimeClient("ls");
  const messages = [];
  const service = new OverseasStockRealtimeService({ ls: client });

  const result = await service.subscribeOverseasStockOrderBook("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
  }, {
    onMessage: (message) => messages.push(message),
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "GSH");
  assert.deepEqual(client.subscriptions[0], {
    id: "GSH",
    key: "82TSLA".padEnd(18, " "),
    options: { streamKind: "quote" },
  });

  client.emit("realtime", {
    data: {
      header: { tr_cd: "GSH", tr_key: "82TSLA".padEnd(18, " ") },
      body: {
        symbol: "TSLA",
        loctime: "093001",
        kortime: "223001",
        offerho1: "284.100000",
        offerrem1: "50",
        offerno1: "3",
        bidho1: "283.900000",
        bidrem1: "40",
        bidno1: "2",
        totoffercnt: "30",
        totbidcnt: "25",
        totofferrem: "500",
        totbidrem: "450",
      },
    },
  });

  assert.equal(messages.length, 1);
  assert.equal(messages[0].kind, "orderBook");
  assert.equal(messages[0].symbol, "TSLA");
  assert.equal(messages[0].asks.length, 10);
  assert.equal(messages[0].bids.length, 10);
  assert.equal(messages[0].asks[0].price, 284.1);
  assert.equal(messages[0].asks[0].quantity, 50);
  assert.equal(messages[0].asks[0].count, 3);
  assert.equal(messages[0].bids[0].price, 283.9);
  assert.equal(messages[0].totals.askQuantity, 500);
  assert.equal(messages[0].totals.bidCount, 25);
});

test("subscribes to all LS overseas stock order event TRs by default", async () => {
  const client = new FakeRealtimeClient("ls");
  const messages = [];
  const service = new OverseasStockRealtimeService({ ls: client });

  const result = await service.subscribeOverseasStockOrderEvents("ls", {
    onMessage: (message) => messages.push(message),
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.ids, ["AS0", "AS1", "AS2", "AS3", "AS4"]);
  assert.deepEqual(client.subscriptions.map((item) => item.id), ["AS0", "AS1", "AS2", "AS3", "AS4"]);
  assert.deepEqual(client.subscriptions[0], { id: "AS0", key: "", options: { streamKind: "account" } });

  client.emit("realtime", {
    data: {
      header: { tr_cd: "AS1", tr_key: "" },
      body: {
        sAcntNo: "12345678901",
        sOrdNo: "77",
        sOrgOrdNo: "70",
        sExecNO: "1",
        sAbrdExecId: "ABC-1",
        sShtnIsuNo: "TSLA",
        sIsuNm: "Tesla",
        sBnsTp: "2",
        sOrdxctPtnCode: "11",
        sOrdQty: "10",
        sOrdPrc: "280.000000",
        sExecQty: "8",
        sExecPrc: "279.900000",
        sUnercQty: "2",
        sOrdAvrExecPrc: "279.950000",
        sExecTime: "093001000",
      },
    },
  });

  assert.equal(messages.length, 1);
  assert.equal(messages[0].kind, "orderEvent");
  assert.equal(messages[0].eventType, "executed");
  assert.equal(messages[0].accountId, "12345678901");
  assert.equal(messages[0].orderId, "77");
  assert.equal(messages[0].executionId, "1");
  assert.equal(messages[0].overseasExecutionId, "ABC-1");
  assert.equal(messages[0].symbol, "TSLA");
  assert.equal(messages[0].side, "buy");
  assert.equal(messages[0].orderQuantity, 10);
  assert.equal(messages[0].executedQuantity, 8);
  assert.equal(messages[0].remainingQuantity, 2);
  assert.equal(messages[0].averageExecutionPrice, 279.95);
  assert.equal(messages[0].executionTime, "093001000");

  const unsubscribed = await result.unsubscribe();
  assert.deepEqual(unsubscribed.map((item) => item.id), ["AS0", "AS1", "AS2", "AS3", "AS4"]);
});

test("can subscribe to a single LS overseas stock order event TR", async () => {
  const client = new FakeRealtimeClient("ls");
  const service = new OverseasStockRealtimeService({ ls: client });

  const result = await service.subscribeOverseasStockOrderEvents("ls", {}, {
    trCode: "AS4",
    key: "12345678",
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "AS4");
  assert.deepEqual(result.ids, ["AS4"]);
  assert.deepEqual(client.subscriptions, [{
    id: "AS4",
    key: "12345678",
    options: { trCode: "AS4", key: "12345678", streamKind: "account" },
  }]);
});

test("returns unsupported response when overseas realtime is unavailable for broker", async () => {
  const service = new OverseasStockRealtimeService({ kiwoom: new FakeRealtimeClient("kiwoom") });

  const result = await service.subscribeOverseasStockTrades("kiwoom", {
    symbol: "TSLA",
    exchangeCode: "82",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_CAPABILITY");
});

test("validates overseas realtime quote identity before subscription", async () => {
  const service = new OverseasStockRealtimeService({ ls: new FakeRealtimeClient("ls") });

  const result = await service.subscribeOverseasStockTrades("ls", "TSLA");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
});

test("normalizes LS overseas realtime messages through service export", () => {
  const [trade] = normalizeOverseasStockRealtimeMessage("ls", {
    header: { tr_cd: "GSC", tr_key: "82TSLA            " },
    body: {
      symbol: "TSLA",
      price: "283.820000",
      diff: "-1.130000",
      rate: "-0.40",
      trdq: "-15",
      totq: "1000",
      cgubun: "-",
    },
  });

  assert.equal(trade.kind, "trade");
  assert.equal(trade.symbol, "TSLA");
  assert.equal(trade.price, 283.82);
  assert.equal(trade.tradeQuantity, 15);
  assert.equal(trade.tradeSide, "sell");

  const [book] = normalizeOverseasStockRealtimeOrderBook("ls", {
    header: { tr_cd: "GSH", tr_key: "82TSLA            " },
    body: { symbol: "TSLA", offerho1: "284.100000", bidho1: "283.900000" },
  });
  assert.equal(book.asks[0].price, 284.1);

  const [event] = normalizeOverseasStockRealtimeOrderEvent("ls", {
    header: { tr_cd: "AS4" },
    body: { sOrdNo: "77", sRjtRsn: "price range", sShtnIsuNo: "TSLA", sBnsTp: "1" },
  });
  assert.equal(event.eventType, "rejected");
  assert.equal(event.side, "sell");

  assert.equal(normalizeOverseasStockRealtimeTrade("ls", {
    header: { tr_cd: "GSH" },
    body: {},
  }).length, 0);
});

class FakeRealtimeClient {
  constructor(broker) {
    this.broker = broker;
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

  async subscribe(id, key, options) {
    this.subscriptions.push({ id, key, options });
    return {
      id,
      key,
      action: "subscribe",
      request: {
        header: { tr_type: options.streamKind === "account" ? "3" : "1" },
        body: { tr_cd: id, tr_key: key },
      },
    };
  }

  async unsubscribe(id, key, options) {
    const result = {
      id,
      key,
      action: "unsubscribe",
      request: {
        header: { tr_type: options.streamKind === "account" ? "4" : "2" },
        body: { tr_cd: id, tr_key: key },
      },
    };
    this.unsubscriptions.push(result);
    return result;
  }

  emit(event, payload) {
    for (const handler of this.handlers.get(event) ?? []) {
      handler(payload);
    }
  }
}
