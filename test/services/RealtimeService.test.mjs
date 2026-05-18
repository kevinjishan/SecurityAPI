import assert from "node:assert/strict";
import test from "node:test";

import {
  RealtimeService,
  normalizeDomesticStockRealtimeMessage,
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

test("returns unsupported response for unavailable realtime balance", async () => {
  const service = new RealtimeService({ ls: new FakeRealtimeClient("ls") });

  const result = await service.subscribeDomesticStockBalance("ls");

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_CAPABILITY");
});

test("normalizes domestic stock realtime messages through service export", () => {
  const messages = normalizeDomesticStockRealtimeMessage("ls", {
    header: { tr_cd: "S3_", tr_key: "005930" },
    body: { shcode: "005930", price: "70000" },
  });

  assert.equal(messages[0].broker, "ls");
  assert.equal(messages[0].id, "S3_");
  assert.equal(messages[0].key, "005930");
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
