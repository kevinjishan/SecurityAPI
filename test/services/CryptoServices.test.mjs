import assert from "node:assert/strict";
import test from "node:test";

import {
  CryptoFuturesAccountService,
  CryptoFuturesMarketDataService,
  CryptoFuturesOrderService,
  CryptoFuturesQuoteService,
  CryptoFuturesRealtimeService,
  CryptoSpotAccountService,
  CryptoSpotMarketDataService,
  CryptoSpotOrderService,
  CryptoSpotQuoteService,
  CryptoSpotRealtimeService,
  normalizeCryptoFuturesPositions,
  normalizeCryptoSpotBalance,
  normalizeCryptoSpotCurrentPrice,
  normalizeCryptoSpotOrderBook,
} from "../../src/index.mjs";
import { CryptoSpotQuoteService as CryptoSpotQuoteServiceFromPackage } from "security-api-reference/services";

test("exports crypto services through package service entry", () => {
  assert.equal(CryptoSpotQuoteServiceFromPackage, CryptoSpotQuoteService);
});

test("gets crypto spot current prices and order books for all exchanges", async () => {
  const exchanges = ["binance", "bingx", "bybit", "upbit", "bithumb", "coinone"];
  const clients = Object.fromEntries(exchanges.map((exchange) => [exchange, new RecordingCryptoClient(exchange)]));
  const service = new CryptoSpotQuoteService(clients);

  for (const exchange of exchanges) {
    const price = await service.getCryptoSpotCurrentPrice(exchange, { symbol: exchange === "upbit" ? "KRW-BTC" : "BTCUSDT" }, {
      requestOptions: { timeoutMs: 1000 },
    });
    const book = await service.getCryptoSpotOrderBook(exchange, { symbol: exchange === "upbit" ? "KRW-BTC" : "BTCUSDT" }, { limit: 5 });

    assert.equal(price.ok, true);
    assert.equal(price.data.price, 70000);
    assert.equal(book.ok, true);
    assert.equal(book.data.bids[0].price, 69900);
  }

  assert.equal(clients.binance.calls[0].id, "binance.spot.ticker");
  assert.deepEqual(clients.binance.calls[0].options, { timeoutMs: 1000 });
  assert.equal(clients.upbit.calls[0].params.market, "KRW-BTC");
});

test("gets crypto spot candles and balances", async () => {
  const client = new RecordingCryptoClient("bithumb");
  const marketData = new CryptoSpotMarketDataService({ bithumb: client });
  const account = new CryptoSpotAccountService({ bithumb: client });

  const candles = await marketData.getCryptoSpotCandles("bithumb", { symbol: "KRW-BTC" }, { interval: "1d", count: 2 });
  const balance = await account.getCryptoSpotBalance("bithumb");

  assert.equal(candles.ok, true);
  assert.equal(candles.data.candles[0].close, 70000);
  assert.equal(client.calls[0].params.limit, 2);
  assert.equal(balance.ok, true);
  assert.equal(balance.data.balances[0].asset, "BTC");
});

test("gets crypto futures read-only data for global exchanges and rejects domestic futures", async () => {
  const clients = {
    binance: new RecordingCryptoClient("binance"),
    bybit: new RecordingCryptoClient("bybit"),
    bingx: new RecordingCryptoClient("bingx"),
  };
  const quote = new CryptoFuturesQuoteService(clients);
  const marketData = new CryptoFuturesMarketDataService(clients);
  const account = new CryptoFuturesAccountService(clients);

  const price = await quote.getCryptoFuturesCurrentPrice("binance", { symbol: "BTCUSDT" });
  const candles = await marketData.getCryptoFuturesCandles("bingx", { symbol: "BTCUSDT" }, { count: 3 });
  const balance = await account.getCryptoFuturesBalance("bybit");
  const positions = await account.getCryptoFuturesPositions("bybit", { symbol: "BTCUSDT" });
  const unsupported = await account.getCryptoFuturesPositions("upbit", { symbol: "BTCUSDT" });

  assert.equal(price.ok, true);
  assert.equal(price.id, "binance.futures.ticker");
  assert.equal(candles.ok, true);
  assert.equal(candles.data.candles[0].close, 70000);
  assert.equal(balance.ok, true);
  assert.equal(balance.data.balances[0].asset, "USDT");
  assert.equal(positions.ok, true);
  assert.equal(positions.data.positions[0].symbol, "BTCUSDT");
  assert.equal(unsupported.ok, false);
  assert.equal(unsupported.error.code, "UNSUPPORTED_CAPABILITY");
});

test("builds crypto spot and futures order dry-run previews without clients", async () => {
  const spot = new CryptoSpotOrderService();
  const futures = new CryptoFuturesOrderService();

  const buy = await spot.buyCryptoSpot("upbit", {
    symbol: "KRW-BTC",
    quoteQuantity: 10000,
  }, {
    maxNotional: 50000,
    allowedSymbols: ["KRW-BTC"],
  });
  const cancel = await spot.cancelCryptoSpotOrder("upbit", {
    symbol: "KRW-BTC",
    orderId: "abc",
  });
  const open = await futures.openCryptoFuturesPosition("bybit", {
    symbol: "BTCUSDT",
    side: "buy",
    quantity: 0.01,
    price: 70000,
    orderType: "limit",
    leverage: 2,
  }, {
    maxLeverage: 3,
  });
  const blocked = await futures.openCryptoFuturesPosition("bybit", {
    symbol: "BTCUSDT",
    side: "buy",
    quantity: 1,
    price: 70000,
    orderType: "limit",
    leverage: 10,
  }, {
    maxLeverage: 3,
  });

  assert.equal(buy.ok, true);
  assert.equal(buy.dryRun, true);
  assert.equal(buy.data.safety.liveSubmissionSupported, false);
  assert.equal(buy.data.request.symbol, "KRW-BTC");
  assert.equal(cancel.ok, true);
  assert.equal(cancel.data.request.orderId, "abc");
  assert.equal(open.ok, true);
  assert.equal(open.data.request.reduceOnly, false);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.error.details.failedCode, "LEVERAGE_EXCEEDED");
});

test("subscribes to crypto public realtime streams", async () => {
  const spotClient = new RecordingCryptoRealtimeClient("binance");
  const futuresClient = new RecordingCryptoRealtimeClient("bybit");
  const spot = new CryptoSpotRealtimeService({ binance: spotClient });
  const futures = new CryptoFuturesRealtimeService({ bybit: futuresClient });

  const trade = await spot.subscribeCryptoSpotTrades("binance", { symbol: "BTCUSDT" });
  const book = await futures.subscribeCryptoFuturesOrderBook("bybit", { symbol: "BTCUSDT" });

  assert.equal(trade.ok, true);
  assert.equal(trade.id, "binance.spot.ws.trade");
  assert.equal(book.ok, true);
  assert.equal(book.id, "bybit.futures.ws.orderbook");
  assert.deepEqual(spotClient.calls[0], { id: "binance.spot.ws.trade", key: "BTCUSDT", streamKind: "trade" });
  assert.deepEqual(futuresClient.calls[0], { id: "bybit.futures.ws.orderbook", key: "BTCUSDT", streamKind: "orderBook" });
});

test("normalizes crypto payloads directly", () => {
  const price = normalizeCryptoSpotCurrentPrice("binance", "binance.spot.ticker", { symbol: "BTCUSDT", price: "70000" });
  const book = normalizeCryptoSpotOrderBook("upbit", "upbit.spot.orderbook", {
    market: "KRW-BTC",
    orderbook_units: [{ bid_price: "69900", bid_size: "1", ask_price: "70100", ask_size: "2" }],
  });
  const arrayBook = normalizeCryptoSpotOrderBook("upbit", "upbit.spot.orderbook", [{
    market: "KRW-BTC",
    orderbook_units: [{ bid_price: "69950", bid_size: "3", ask_price: "70050", ask_size: "4" }],
  }]);
  const balance = normalizeCryptoSpotBalance("bithumb", "bithumb.spot.balance", {
    balances: [{ currency: "BTC", balance: "1.5", locked: "0.1" }],
  });
  const positions = normalizeCryptoFuturesPositions("bybit", "bybit.futures.positions", {
    positions: [{ symbol: "BTCUSDT", positionAmt: "0.01", entryPrice: "70000", leverage: "2" }],
  });

  assert.equal(price.price, 70000);
  assert.equal(book.asks[0].price, 70100);
  assert.equal(arrayBook.symbol, "KRW-BTC");
  assert.equal(arrayBook.bids[0].quantity, 3);
  assert.equal(arrayBook.asks[0].price, 70050);
  assert.equal(balance.balances[0].total, 1.5);
  assert.equal(positions.positions[0].leverage, 2);
});

class RecordingCryptoClient {
  constructor(exchange) {
    this.exchange = exchange;
    this.calls = [];
  }

  async request(id, params, options = {}) {
    this.calls.push({ id, params, options });
    return {
      ok: true,
      broker: this.exchange,
      id,
      data: fakePayload(id, params),
      raw: fakePayload(id, params),
      headers: {},
      status: 200,
    };
  }
}

class RecordingCryptoRealtimeClient {
  constructor(exchange) {
    this.exchange = exchange;
    this.calls = [];
  }

  async subscribe(id, key, options = {}) {
    this.calls.push({ id, key, streamKind: options.streamKind });
    return { id, key, action: "subscribe" };
  }

  async unsubscribe(id, key) {
    return { id, key, action: "unsubscribe" };
  }
}

function fakePayload(id, params) {
  if (id.includes("orderbook")) {
    return {
      symbol: params.symbol,
      bids: [["69900", "1"]],
      asks: [["70100", "2"]],
    };
  }
  if (id.includes("candles")) {
    return [[1, "69000", "71000", "68000", "70000", "10"]];
  }
  if (id.includes("balance")) {
    return {
      balances: [{ asset: id.includes("futures") ? "USDT" : "BTC", free: "1", locked: "0", total: "1" }],
    };
  }
  if (id.includes("positions")) {
    return {
      positions: [{ symbol: params.symbol ?? "BTCUSDT", positionAmt: "0.01", entryPrice: "70000", leverage: "2" }],
    };
  }
  return { symbol: params.symbol, price: "70000" };
}
