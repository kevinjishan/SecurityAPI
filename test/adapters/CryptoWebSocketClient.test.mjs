import assert from "node:assert/strict";
import test from "node:test";

import { BrokerError, CryptoWebSocketClient, buildCryptoWebSocketDescriptor } from "../../src/index.mjs";
import { CryptoWebSocketClient as CryptoWebSocketClientFromPackage } from "security-api-reference/adapters";

test("exports CryptoWebSocketClient through package adapter entry", () => {
  assert.equal(CryptoWebSocketClientFromPackage, CryptoWebSocketClient);
});

test("builds Binance spot public trade subscription envelopes", () => {
  const descriptor = buildCryptoWebSocketDescriptor("binance", "binance.spot.ws.trade", "BTCUSDT", {
    requestId: 7,
  });

  assert.equal(descriptor.url, "wss://stream.binance.com:9443/ws");
  assert.equal(descriptor.topic, "btcusdt@trade");
  assert.deepEqual(descriptor.subscribeMessage, {
    method: "SUBSCRIBE",
    params: ["btcusdt@trade"],
    id: 7,
  });
});

test("builds Bybit futures public order book subscription envelopes", () => {
  const descriptor = buildCryptoWebSocketDescriptor("bybit", "bybit.futures.ws.orderbook", "BTCUSDT", {
    env: "mock",
    depth: 50,
  });

  assert.equal(descriptor.url, "wss://stream-testnet.bybit.com/v5/public/linear");
  assert.deepEqual(descriptor.subscribeMessage, {
    op: "subscribe",
    args: ["orderbook.50.BTCUSDT"],
  });
});

test("builds domestic public subscription envelopes and rejects domestic futures", () => {
  const upbit = buildCryptoWebSocketDescriptor("upbit", "upbit.spot.ws.trade", "KRW-BTC");
  const coinone = buildCryptoWebSocketDescriptor("coinone", "coinone.spot.ws.orderbook", "KRW-BTC");

  assert.deepEqual(upbit.subscribeMessage, [
    { ticket: "security-api" },
    { type: "trade", codes: ["KRW-BTC"] },
    { format: "SIMPLE" },
  ]);
  assert.equal(coinone.subscribeMessage.channel, "ORDERBOOK");
  assert.deepEqual(coinone.subscribeMessage.topic, {
    quote_currency: "KRW",
    target_currency: "BTC",
  });
  assert.throws(
    () => buildCryptoWebSocketDescriptor("upbit", "upbit.futures.ws.trade", "BTCUSDT"),
    (error) => error instanceof BrokerError && error.code === "UNSUPPORTED_CAPABILITY",
  );
});

test("subscribes and unsubscribes through a WebSocket implementation", async () => {
  const sockets = [];
  const client = new CryptoWebSocketClient("binance", {
    WebSocket: class TestSocket {
      constructor(url) {
        this.url = url;
        this.readyState = 1;
        this.sent = [];
        sockets.push(this);
      }

      send(message) {
        this.sent.push(message);
      }

      close() {
        this.readyState = 3;
      }
    },
  });

  const sub = await client.subscribe("binance.spot.ws.trade", "BTCUSDT", { requestId: 1 });
  const dup = await client.subscribe("binance.spot.ws.trade", "BTCUSDT", { requestId: 1 });
  const unsub = await client.unsubscribe("binance.spot.ws.trade", "BTCUSDT", { requestId: 2 });

  assert.equal(sub.action, "subscribe");
  assert.equal(dup.duplicate, true);
  assert.equal(unsub.action, "unsubscribe");
  assert.equal(sockets[0].url, "wss://stream.binance.com:9443/ws");
  assert.deepEqual(sockets[0].sent.map((message) => JSON.parse(message)), [
    { method: "SUBSCRIBE", params: ["btcusdt@trade"], id: 1 },
    { method: "UNSUBSCRIBE", params: ["btcusdt@trade"], id: 2 },
  ]);
});
