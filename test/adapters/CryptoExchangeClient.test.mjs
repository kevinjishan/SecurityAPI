import assert from "node:assert/strict";
import test from "node:test";

import { BrokerError, CryptoExchangeClient, buildCryptoRestDescriptor } from "../../src/index.mjs";
import { CryptoExchangeClient as CryptoExchangeClientFromPackage } from "security-api-reference/adapters";

test("exports CryptoExchangeClient through package adapter entry", () => {
  assert.equal(CryptoExchangeClientFromPackage, CryptoExchangeClient);
});

test("builds public spot market requests for domestic exchanges", async () => {
  const calls = [];
  const client = new CryptoExchangeClient("upbit", {
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse([{ market: "KRW-BTC", trade_price: 70000 }]);
    },
  });

  const result = await client.request("upbit.spot.ticker", { symbol: "KRW-BTC" });

  assert.equal(result.ok, true);
  assert.equal(result.exchange, "upbit");
  assert.equal(calls[0].method, "GET");
  assert.equal(calls[0].url, "https://api.upbit.com/v1/ticker?markets=KRW-BTC");
});

test("builds public spot order book and candle requests for Coinone", async () => {
  const calls = [];
  const client = new CryptoExchangeClient("coinone", {
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ result: "success" });
    },
  });

  await client.request("coinone.spot.orderbook", { symbol: "KRW-BTC", limit: 10 });
  await client.request("coinone.spot.candles", { symbol: "KRW-BTC", interval: "1d", limit: 100 });

  assert.equal(calls[0].url, "https://api.coinone.co.kr/public/v2/orderbook/KRW/BTC?size=10");
  assert.equal(calls[1].url, "https://api.coinone.co.kr/public/v2/chart/KRW/BTC?interval=1d&size=100");
});

test("builds Binance spot and futures public requests", async () => {
  const calls = [];
  const client = new CryptoExchangeClient("binance", {
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ symbol: "BTCUSDT", price: "70000" });
    },
  });

  await client.request("binance.spot.orderbook", { symbol: "BTCUSDT", limit: 5 });
  await client.request("binance.futures.candles", { symbol: "BTCUSDT", interval: "1h", limit: 2 });

  assert.equal(calls[0].url, "https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=5");
  assert.equal(calls[1].url, "https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=1h&limit=2");
});

test("builds Bybit futures position request with signed headers", async () => {
  const calls = [];
  const client = new CryptoExchangeClient("bybit", {
    apiKey: "key",
    apiSecret: "secret",
    env: "mock",
    now: () => 1_700_000_000_000,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ retCode: 0, result: { list: [] } });
    },
  });

  const result = await client.request("bybit.futures.positions", { symbol: "BTCUSDT" });

  assert.equal(result.ok, true);
  assert.equal(calls[0].url, "https://api-testnet.bybit.com/v5/position/list?category=linear&symbol=BTCUSDT");
  assert.equal(calls[0].headers["X-BAPI-API-KEY"], "key");
  assert.equal(calls[0].headers["X-BAPI-TIMESTAMP"], "1700000000000");
  assert.equal(calls[0].headers["X-BAPI-RECV-WINDOW"], "5000");
  assert.match(calls[0].headers["X-BAPI-SIGN"], /^[a-f0-9]{64}$/);
});

test("builds Binance signed balance requests and rejects missing credentials", async () => {
  const calls = [];
  const missing = new CryptoExchangeClient("binance", {
    fetch: async () => {
      throw new Error("fetch should not be called");
    },
  });

  const rejected = await missing.request("binance.spot.balance");
  assert.equal(rejected.ok, false);
  assert.equal(rejected.error.code, "CONFIG_ERROR");

  const client = new CryptoExchangeClient("binance", {
    apiKey: "key",
    apiSecret: "secret",
    now: () => 1_700_000_000_000,
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse({ balances: [] });
    },
  });

  await client.request("binance.spot.balance");

  const url = new URL(calls[0].url);
  assert.equal(url.origin + url.pathname, "https://api.binance.com/api/v3/account");
  assert.equal(url.searchParams.get("timestamp"), "1700000000000");
  assert.equal(url.searchParams.get("recvWindow"), "5000");
  assert.match(url.searchParams.get("signature"), /^[a-f0-9]{64}$/);
  assert.equal(calls[0].headers["X-MBX-APIKEY"], "key");
});

test("builds JWT-style domestic signed balance requests", async () => {
  const calls = [];
  const client = new CryptoExchangeClient("upbit", {
    apiKey: "access-key",
    apiSecret: "secret-key",
    nonce: () => "nonce-1",
    fetch: async (url, init) => {
      calls.push(readCall(url, init));
      return jsonResponse([]);
    },
  });

  await client.request("upbit.spot.balance");

  assert.equal(calls[0].url, "https://api.upbit.com/v1/accounts");
  assert.match(calls[0].headers.Authorization, /^Bearer [^.]+\.[^.]+\.[^.]+$/);
});

test("returns unsupported for domestic futures descriptors", () => {
  assert.throws(
    () => buildCryptoRestDescriptor("upbit", "upbit.futures.positions", { symbol: "BTCUSDT" }),
    (error) => error instanceof BrokerError && error.code === "UNSUPPORTED_CAPABILITY",
  );
});

function readCall(url, init) {
  return {
    url,
    method: init.method,
    headers: init.headers,
    body: init.body,
  };
}

function jsonResponse(body, options = {}) {
  return new Response(JSON.stringify(body), {
    status: options.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });
}
