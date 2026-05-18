import assert from "node:assert/strict";
import test from "node:test";

import {
  WebSocketBrokerClient,
  normalizeRealtimeMessage,
} from "../../src/index.mjs";
import { WebSocketBrokerClient as WebSocketBrokerClientFromPackage } from "security-api-reference/adapters";

test("exports WebSocketBrokerClient through package adapter entry", () => {
  assert.equal(WebSocketBrokerClientFromPackage, WebSocketBrokerClient);
});

test("connects and subscribes to Kiwoom realtime streams", async () => {
  const sockets = [];
  const client = new WebSocketBrokerClient({
    brokerClient: fakeBrokerClient("kiwoom"),
    webSocketFactory: (url, options) => {
      const socket = new FakeWebSocket(url, options);
      sockets.push(socket);
      return socket;
    },
  });
  const realtime = [];
  const acks = [];
  client.on("realtime", (event) => realtime.push(event));
  client.on("ack", (event) => acks.push(event));

  const subscription = await client.subscribe("0B", "005930");

  assert.equal(sockets[0].url, "wss://mock.kiwoom.test/api/dostk/websocket");
  assert.deepEqual(sockets[0].options.headers, {
    authorization: "Bearer token-kiwoom",
    "api-id": "0B",
  });
  assert.deepEqual(subscription.request, {
    trnm: "REG",
    grp_no: "1",
    refresh: "1",
    data: [{ item: "005930", type: "0B" }],
  });
  assert.deepEqual(sockets[0].sent.map(JSON.parse), [subscription.request]);

  sockets[0].emitMessage({ trnm: "REG", return_code: 0 });
  sockets[0].emitMessage({
    trnm: "REAL",
    data: [{ type: "0B", name: "주식체결", item: "005930", values: { 10: "70000" } }],
  });

  assert.equal(acks.length, 1);
  assert.equal(realtime.length, 1);
  assert.equal(realtime[0].data.data[0].values["10"], "70000");
});

test("connects and subscribes to LS realtime streams", async () => {
  const sockets = [];
  const client = new WebSocketBrokerClient({
    brokerClient: fakeBrokerClient("ls"),
    webSocketFactory: (url, options) => {
      const socket = new FakeWebSocket(url, options);
      sockets.push(socket);
      return socket;
    },
  });

  const subscription = await client.subscribe("S3_", "005930");
  const orderEventSubscription = await client.subscribe("SC1", "", { streamKind: "account" });
  const unsubscribe = await client.unsubscribe("S3_", "005930");

  assert.equal(sockets[0].url, "wss://mock.ls.test/websocket/stock");
  assert.deepEqual(subscription.request, {
    header: { token: "token-ls", tr_type: "3" },
    body: { tr_cd: "S3_", tr_key: "005930" },
  });
  assert.deepEqual(orderEventSubscription.request.header, { token: "token-ls", tr_type: "1" });
  assert.deepEqual(unsubscribe.request.header, { token: "token-ls", tr_type: "4" });
});

test("normalizes realtime messages", () => {
  assert.deepEqual(
    normalizeRealtimeMessage("kiwoom", {
      data: [{ type: "0B", name: "주식체결", item: "005930", values: { 10: "70000" } }],
    }),
    [
      {
        broker: "kiwoom",
        id: "0B",
        name: "주식체결",
        key: "005930",
        body: { 10: "70000" },
        raw: { type: "0B", name: "주식체결", item: "005930", values: { 10: "70000" } },
      },
    ],
  );

  assert.deepEqual(
    normalizeRealtimeMessage("ls", {
      header: { tr_cd: "S3_", tr_key: "005930" },
      body: { shcode: "005930", price: "70000" },
    }),
    [
      {
        broker: "ls",
        id: "S3_",
        name: null,
        key: "005930",
        body: { shcode: "005930", price: "70000" },
        raw: {
          header: { tr_cd: "S3_", tr_key: "005930" },
          body: { shcode: "005930", price: "70000" },
        },
      },
    ],
  );
});

function fakeBrokerClient(broker) {
  return {
    broker,
    getEndpoint: async () => ({
      url: broker === "kiwoom" ? "wss://mock.kiwoom.test/api/dostk/websocket" : "wss://mock.ls.test/websocket/stock",
    }),
    getAccessToken: async () => ({
      tokenType: "Bearer",
      accessToken: `token-${broker}`,
    }),
  };
}

class FakeWebSocket {
  constructor(url, options) {
    this.url = url;
    this.options = options;
    this.readyState = 1;
    this.sent = [];
    this.handlers = new Map();
  }

  addEventListener(event, handler) {
    const handlers = this.handlers.get(event) ?? [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
  }

  send(message) {
    this.sent.push(message);
  }

  close() {
    this.readyState = 3;
  }

  emitMessage(data) {
    for (const handler of this.handlers.get("message") ?? []) {
      handler({ data: JSON.stringify(data) });
    }
  }
}
