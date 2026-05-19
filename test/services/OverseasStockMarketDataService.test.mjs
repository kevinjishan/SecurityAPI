import assert from "node:assert/strict";
import test from "node:test";

import {
  BrokerError,
  OverseasStockMarketDataService,
  normalizeOverseasStockBasicInfo,
  normalizeOverseasStockCandles,
  normalizeOverseasStockTimeSeries,
} from "../../src/index.mjs";
import { OverseasStockMarketDataService as OverseasStockMarketDataServiceFromPackage } from "security-api-reference/services";

test("exports OverseasStockMarketDataService through package service entry", () => {
  assert.equal(OverseasStockMarketDataServiceFromPackage, OverseasStockMarketDataService);
});

test("gets and normalizes LS overseas stock basic info", async () => {
  const calls = [];
  const service = new OverseasStockMarketDataService({
    ls: {
      request: async (id, params, options) => {
        calls.push({ id, params, options });
        return brokerSuccess(id, {
          g3104OutBlock: {
            delaygb: "R",
            keysymbol: "82TSLA",
            exchcd: "82",
            exchange: "0537",
            symbol: "TSLA",
            korname: "테슬라",
            engname: "TESLA INC",
            exchange_name: "나스닥",
            nation_name: "미국",
            induname: "자동차 및 부품",
            instname: "주식",
            floatpoint: "4",
            currency: "USD",
            suspend: "N",
            sellonly: "0",
            share: 3216520000,
            untprc: "0.0100",
            bidlotsize: "1",
            asklotsize: "1",
            volume: 419973,
            amount: 118883113,
            pcls: "284.9500",
            clos: "284.9500",
            open: "285.0900",
            high: "285.3100",
            low: "281.8400",
            high52p: "488.5399",
            low52p: "166.3700",
            shareprc: 913170027999,
            perv: "142.71",
            epsv: "1.82",
            exrate: "1434.60",
          },
        });
      },
    },
  });

  const result = await service.getOverseasStockBasicInfo("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
  }, {
    requestOptions: { timeoutMs: 5000 },
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "g3104");
  assert.equal(result.capability, "overseasStock.marketData.basicInfo");
  assert.deepEqual(calls, [
    {
      id: "g3104",
      params: {
        g3104InBlock: {
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
  assert.equal(result.data.englishName, "TESLA INC");
  assert.equal(result.data.exchangeName, "나스닥");
  assert.equal(result.data.currency, "USD");
  assert.equal(result.data.shares, 3216520000);
  assert.equal(result.data.referencePrice, 284.95);
  assert.equal(result.data.marketCap, 913170027999);
  assert.equal(result.data.exchangeRate, 1434.6);
});

test("gets and normalizes LS overseas stock master", async () => {
  const calls = [];
  const service = new OverseasStockMarketDataService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess(id, {
          g3190OutBlock: {
            delaygb: "R",
            natcode: "US",
            exgubun: "2",
            cts_value: "0000000000000011",
            rec_count: 1,
          },
          g3190OutBlock1: [
            {
              keysymbol: "82AACB",
              natcode: "US",
              exchcd: "82",
              symbol: "AACB",
              seccode: "82AACB",
              korname: "ARTIUS II ACQUISITION INC",
              engname: "ARTIUS II ACQUISITION INC",
              currency: "USD",
              isin: "KYG0509J1159",
              share: 22175000,
              marketcap: 575,
              clos: "9.9200",
              listed_date: "20250407",
              suspend: "N",
              sellonly: "0",
            },
          ],
        });
      },
    },
  });

  const result = await service.getOverseasStockMaster("ls", {
    countryCode: "US",
    exchangeGroup: "2",
    readCount: 10,
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "g3190");
  assert.deepEqual(calls[0], {
    id: "g3190",
    params: {
      g3190InBlock: {
        delaygb: "R",
        natcode: "US",
        exgubun: "2",
        readcnt: 10,
        cts_value: "",
      },
    },
  });
  assert.equal(result.data.countryCode, "US");
  assert.equal(result.data.exchangeGroup, "2");
  assert.equal(result.data.continuationValue, "0000000000000011");
  assert.equal(result.data.items[0].symbol, "AACB");
  assert.equal(result.data.items[0].keySymbol, "82AACB");
  assert.equal(result.data.items[0].referencePrice, 9.92);
});

test("gets and normalizes LS overseas stock candles with g3204", async () => {
  const calls = [];
  const service = new OverseasStockMarketDataService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess(id, {
          g3204OutBlock: {
            delaygb: "R",
            keysymbol: "82TSLA",
            exchcd: "82",
            symbol: "TSLA",
            cts_date: "20250421",
            cts_info: "999999",
            rec_count: 1,
            preclose: "284.9500",
            s_time: "200000",
            e_time: "180000",
          },
          g3204OutBlock1: [
            {
              date: "20250428",
              open: "285.0900",
              high: "285.3100",
              low: "281.8400",
              close: "283.5000",
              volume: 434208,
              amount: 122919696,
              sign: "5",
            },
          ],
        });
      },
    },
  });

  const result = await service.getOverseasStockCandles("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
  }, {
    startDate: "20250203",
    endDate: "",
    count: 5,
    period: "daily",
    adjusted: true,
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "g3204");
  assert.deepEqual(calls[0], {
    id: "g3204",
    params: {
      g3204InBlock: {
        sujung: "Y",
        delaygb: "R",
        keysymbol: "82TSLA",
        exchcd: "82",
        symbol: "TSLA",
        gubun: "2",
        qrycnt: 5,
        comp_yn: "N",
        sdate: "20250203",
        edate: "",
        cts_date: "",
        cts_info: "",
      },
    },
  });
  assert.equal(result.data.interval, "1d");
  assert.equal(result.data.candles[0].date, "20250428");
  assert.equal(result.data.candles[0].close, 283.5);
  assert.equal(result.data.summary.continuationDate, "20250421");
  assert.equal(result.data.summary.previous.close, 284.95);
});

test("supports simple overseas period candle source g3103", async () => {
  const calls = [];
  const service = new OverseasStockMarketDataService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess(id, {
          g3103OutBlock: {
            delaygb: "R",
            keysymbol: "82TSLA",
            exchcd: "82",
            symbol: "TSLA",
            gubun: "4",
            date: "20250120",
          },
          g3103OutBlock1: [
            {
              chedate: "20250428",
              price: "283.4300",
              open: "263.8000",
              high: "286.8500",
              low: "214.2500",
              volume: 2568819717,
              diff: "24.2700",
              rate: "9.36",
              sign: "2",
            },
          ],
        });
      },
    },
  });

  const result = await service.getOverseasStockCandles("ls", {
    symbol: "TSLA",
    exchangeCode: "82",
  }, {
    trCode: "g3103",
    period: "monthly",
    date: "20250120",
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "g3103");
  assert.equal(result.data.interval, "1mo");
  assert.equal(result.data.candles[0].date, "20250428");
  assert.equal(result.data.candles[0].close, 283.43);
  assert.deepEqual(calls[0], {
    id: "g3103",
    params: {
      g3103InBlock: {
        delaygb: "R",
        keysymbol: "82TSLA",
        exchcd: "82",
        symbol: "TSLA",
        gubun: "4",
        date: "20250120",
      },
    },
  });
});

test("gets and normalizes LS overseas stock time series", async () => {
  const calls = [];
  const service = new OverseasStockMarketDataService({
    ls: {
      request: async (id, params) => {
        calls.push({ id, params });
        return brokerSuccess(id, {
          g3102OutBlock: {
            delaygb: "R",
            keysymbol: "82TSLA",
            exchcd: "82",
            symbol: "TSLA",
            cts_seq: 20250428014018000,
            rec_count: 1,
          },
          g3102OutBlock1: [
            {
              locdate: "20250428",
              loctime: "014101",
              kordate: "20250428",
              kortime: "144101",
              price: "283.9500",
              sign: "5",
              diff: "1.0000",
              rate: "-0.35",
              open: "285.0900",
              high: "285.3100",
              low: "281.8400",
              exevol: 20,
              cgubun: "-",
              floatpoint: "4",
            },
          ],
        });
      },
    },
  });

  const result = await service.getOverseasStockTimeSeries("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
  }, {
    readCount: 30,
    continuationSequence: 0,
  });

  assert.equal(result.ok, true);
  assert.equal(result.id, "g3102");
  assert.deepEqual(calls[0], {
    id: "g3102",
    params: {
      g3102InBlock: {
        delaygb: "R",
        keysymbol: "82TSLA",
        exchcd: "82",
        symbol: "TSLA",
        readcnt: 30,
        cts_seq: 0,
      },
    },
  });
  assert.equal(result.data.trades[0].localTime, "014101");
  assert.equal(result.data.trades[0].price, 283.95);
  assert.equal(result.data.trades[0].executionVolume, 20);
});

test("returns unsupported for Kiwoom overseas market data until metadata exists", async () => {
  const service = new OverseasStockMarketDataService({
    kiwoom: {
      request: async () => {
        throw new Error("should not call broker");
      },
    },
  });

  const result = await service.getOverseasStockBasicInfo("kiwoom", {
    symbol: "TSLA",
    exchangeCode: "82",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "UNSUPPORTED_CAPABILITY");
});

test("returns validation errors before overseas candle requests with missing startDate", async () => {
  const service = new OverseasStockMarketDataService({
    ls: {
      request: async () => {
        throw new Error("should not call broker");
      },
    },
  });

  const result = await service.getOverseasStockCandles("ls", {
    symbol: "TSLA",
    exchangeCode: "82",
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "VALIDATION_ERROR");
  assert.match(result.error.message, /startDate/);
});

test("preserves overseas market data client failures", async () => {
  const service = new OverseasStockMarketDataService({
    ls: {
      request: async () => ({
        ok: false,
        broker: "ls",
        id: "g3104",
        data: null,
        raw: { rsp_cd: "99999" },
        headers: {},
        status: 200,
        error: BrokerError.api("업무 오류", {
          broker: "ls",
          id: "g3104",
        }),
      }),
    },
  });

  const result = await service.getOverseasStockBasicInfo("ls", {
    symbol: "TSLA",
    exchangeCode: "82",
  });

  assert.equal(result.ok, false);
  assert.equal(result.id, "g3104");
  assert.equal(result.error.code, "API_ERROR");
});

test("normalizes overseas market data payloads directly", () => {
  const basicInfo = normalizeOverseasStockBasicInfo("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
  }, "g3104", {
    g3104OutBlock: {
      symbol: "TSLA",
      keysymbol: "82TSLA",
      exchcd: "82",
      clos: "284.9500",
      currency: "USD",
    },
  });

  assert.equal(basicInfo.referencePrice, 284.95);
  assert.equal(basicInfo.currency, "USD");

  const candles = normalizeOverseasStockCandles("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
  }, "g3204", {
    g3204OutBlock: { symbol: "TSLA", cts_date: "20250421" },
    g3204OutBlock1: [{ date: "20250428", close: "283.5000", volume: "434,208" }],
  });

  assert.equal(candles.candles[0].close, 283.5);
  assert.equal(candles.candles[0].volume, 434208);

  const series = normalizeOverseasStockTimeSeries("ls", {
    symbol: "TSLA",
    keySymbol: "82TSLA",
    exchangeCode: "82",
  }, "g3102", {
    g3102OutBlock: { symbol: "TSLA", cts_seq: 1 },
    g3102OutBlock1: [{ loctime: "014101", price: "283.9500", exevol: "20" }],
  });

  assert.equal(series.trades[0].price, 283.95);
  assert.equal(series.trades[0].executionVolume, 20);
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
