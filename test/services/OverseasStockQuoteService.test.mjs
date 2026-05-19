import assert from "node:assert/strict";
import test from "node:test";

import {
  BrokerError,
  OverseasStockQuoteService,
  normalizeOverseasStockCurrentPrice,
  normalizeOverseasStockOrderBook,
} from "../../src/index.mjs";
import { OverseasStockQuoteService as OverseasStockQuoteServiceFromPackage } from "security-api-reference/services";

test("exports OverseasStockQuoteService through package service entry", () => {
  assert.equal(OverseasStockQuoteServiceFromPackage, OverseasStockQuoteService);
});

test("gets and normalizes LS overseas stock current price", async () => {
  const calls = [];
  const service = new OverseasStockQuoteService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess(id, {
          g3101OutBlock: {
            delaygb: "R",
            keysymbol: "82TSLA",
            exchcd: "82",
            exchange: "0537",
            suspend: "N",
            sellonly: "0",
            symbol: "TSLA",
            korname: "테슬라",
            induname: "자동차 및 부품",
            floatpoint: "4",
            currency: "USD",
            price: "283.8200",
            sign: "5",
            diff: "1.1300",
            rate: "-0.40",
            volume: 414175,
            amount: 117236758,
            high52p: "488.5399",
            low52p: "166.3700",
            uplimit: "0.0000",
            dnlimit: "0.0000",
            open: "285.0900",
            high: "285.3100",
            low: "281.8400",
            perv: "142.71",
            epsv: "1.82",
          },
          rsp_cd: "00000",
        });
      },
    },
  });

  const result = await service.getOverseasStockCurrentPrice("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
    delayType: "R",
  }, {
    requestOptions: { timeoutMs: 5000 },
  });

  assert.equal(result.ok, true);
  assert.equal(result.broker, "ls");
  assert.equal(result.id, "g3101");
  assert.equal(result.capability, "overseasStock.quote.currentPrice");
  assert.equal(result.symbol, "TSLA");
  assert.deepEqual(calls, [
    {
      id: "g3101",
      params: {
        g3101InBlock: {
          delaygb: "R",
          keysymbol: "82TSLA",
          exchcd: "82",
          symbol: "TSLA",
        },
      },
      options: { timeoutMs: 5000 },
    },
  ]);
  assert.equal(result.data.symbol, "TSLA");
  assert.equal(result.data.keySymbol, "82TSLA");
  assert.equal(result.data.exchangeCode, "82");
  assert.equal(result.data.name, "테슬라");
  assert.equal(result.data.price, 283.82);
  assert.equal(result.data.change, 1.13);
  assert.equal(result.data.changeRate, -0.4);
  assert.equal(result.data.volume, 414175);
  assert.equal(result.data.amount, 117236758);
  assert.equal(result.data.currency, "USD");
  assert.equal(result.data.tradingStatus.suspend, "N");
});

test("builds LS overseas key symbol from exchange code when omitted", async () => {
  const calls = [];
  const service = new OverseasStockQuoteService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess(id, {
          g3101OutBlock: {
            delaygb: "R",
            keysymbol: "82AAPL",
            exchcd: "82",
            symbol: "AAPL",
            price: "200.0000",
          },
        });
      },
    },
  });

  const result = await service.getOverseasStockCurrentPrice("ls", "AAPL", {
    exchangeCode: "82",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(calls[0], {
    id: "g3101",
    params: {
      g3101InBlock: {
        delaygb: "R",
        keysymbol: "82AAPL",
        exchcd: "82",
        symbol: "AAPL",
      },
    },
  });
});

test("gets and normalizes LS overseas stock order book", async () => {
  const calls = [];
  const service = new OverseasStockQuoteService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess(id, {
          g3106OutBlock: {
            delaygb: "R",
            keysymbol: "82TSLA",
            exchcd: "82",
            symbol: "TSLA",
            korname: "테슬라",
            price: "283.0200",
            sign: "5",
            diff: "1.9300",
            rate: "-0.68",
            volume: 431173,
            amount: 122059929,
            jnilclose: "284.9500",
            open: "285.0900",
            high: "285.3100",
            low: "281.8400",
            hotime: "144734",
            offerho1: "283.1100",
            bidho1: "283.0200",
            offercnt1: "0",
            bidcnt1: "0",
            offerrem1: 20,
            bidrem1: 38,
            offerho2: "283.1200",
            bidho2: "283.0100",
            offercnt2: "1",
            bidcnt2: "2",
            offerrem2: 524,
            bidrem2: 120,
            offercnt: "5",
            bidcnt: "7",
            offer: 1740,
            bid: 2797,
          },
        });
      },
    },
  });

  const result = await service.getOverseasStockOrderBook("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "g3106");
  assert.equal(result.capability, "overseasStock.quote.orderBook");
  assert.deepEqual(calls, [
    {
      id: "g3106",
      params: {
        g3106InBlock: {
          delaygb: "R",
          keysymbol: "82TSLA",
          exchcd: "82",
          symbol: "TSLA",
        },
      },
      options: {},
    },
  ]);
  assert.deepEqual(result.data.asks[0], {
    level: 1,
    price: 283.11,
    priceRaw: "283.1100",
    quantity: 20,
    quantityRaw: "20",
    count: 0,
    countRaw: "0",
  });
  assert.deepEqual(result.data.bids[1], {
    level: 2,
    price: 283.01,
    priceRaw: "283.0100",
    quantity: 120,
    quantityRaw: "120",
    count: 2,
    countRaw: "2",
  });
  assert.deepEqual(result.data.totals, {
    askCount: 5,
    askCountRaw: "5",
    bidCount: 7,
    bidCountRaw: "7",
    askQuantity: 1740,
    askQuantityRaw: "1740",
    bidQuantity: 2797,
    bidQuantityRaw: "2797",
  });
  assert.equal(result.data.timestamp, "144734");
});

test("returns unsupported for Kiwoom overseas quote until metadata exists", async () => {
  const service = new OverseasStockQuoteService({
    kiwoom: {
      request: async () => {
        throw new Error("should not call broker");
      },
    },
  });

  const result = await service.getOverseasStockCurrentPrice("kiwoom", {
    symbol: "TSLA",
    exchangeCode: "82",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_CAPABILITY");
  assert.equal(result.id, null);
});

test("returns validation errors before LS overseas quote requests with missing exchange code", async () => {
  const service = new OverseasStockQuoteService({
    ls: {
      request: async () => {
        throw new Error("should not call broker");
      },
    },
  });

  const result = await service.getOverseasStockCurrentPrice("ls", {
    symbol: "TSLA",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.match(result.error.message, /exchangeCode/);
});

test("preserves LS overseas quote client failures", async () => {
  const service = new OverseasStockQuoteService({
    ls: {
      request: async () => ({
        ok: false,
        broker: "ls",
        id: "g3101",
        data: null,
        raw: { rsp_cd: "99999" },
        headers: {},
        status: 200,
        error: BrokerError.api("업무 오류", {
          broker: "ls",
          id: "g3101",
        }),
      }),
    },
  });

  const result = await service.getOverseasStockCurrentPrice("ls", {
    symbol: "TSLA",
    exchangeCode: "82",
  });

  assert.equal(result.ok, false);
  assert.equal(result.id, "g3101");
  assert.equal(result.error.code, "API_ERROR");
  assert.deepEqual(result.raw, { rsp_cd: "99999" });
});

test("normalizes overseas quote payloads directly", () => {
  const quote = normalizeOverseasStockCurrentPrice("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
  }, "g3101", {
    g3101OutBlock: {
      symbol: "TSLA",
      keysymbol: "82TSLA",
      exchcd: "82",
      price: "-283.8200",
      diff: "-1.1300",
      rate: "-0.40",
      volume: "414,175",
      currency: "USD",
    },
  });

  assert.equal(quote.price, 283.82);
  assert.equal(quote.change, -1.13);
  assert.equal(quote.volume, 414175);
  assert.equal(quote.currency, "USD");

  const orderBook = normalizeOverseasStockOrderBook("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
  }, "g3106", {
    g3106OutBlock: {
      symbol: "TSLA",
      offerho1: "283.1100",
      offerrem1: "20",
      offercnt1: "1",
      bidho1: "283.0200",
      bidrem1: "38",
      bidcnt1: "2",
    },
  });

  assert.deepEqual(orderBook.asks[0], {
    level: 1,
    price: 283.11,
    priceRaw: "283.1100",
    quantity: 20,
    quantityRaw: "20",
    count: 1,
    countRaw: "1",
  });
  assert.deepEqual(orderBook.bids[0], {
    level: 1,
    price: 283.02,
    priceRaw: "283.0200",
    quantity: 38,
    quantityRaw: "38",
    count: 2,
    countRaw: "2",
  });
});

function brokerSuccess(id, data) {
  return {
    ok: true,
    broker: "ls",
    id,
    data,
    raw: data,
    headers: {},
    status: 200,
  };
}
