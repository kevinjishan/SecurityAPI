import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  AccountService,
  MarketContextService,
  MarketDataService,
  MarketFlowService,
  OrderService,
  QuoteService,
  ScannerService,
} from "../../src/index.mjs";

const manifests = {
  kiwoom: JSON.parse(readFileSync(new URL("../../data/generated/kiwoom-manifest.json", import.meta.url))),
  ls: JSON.parse(readFileSync(new URL("../../data/generated/ls-manifest.json", import.meta.url))),
};

test("implemented core service requests include documented required body fields", async () => {
  const scenarios = [
    quoteScenario("kiwoom", "ka10001", (service) => service.getDomesticStockCurrentPrice("kiwoom", "005930")),
    quoteScenario("kiwoom", "ka10004", (service) => service.getDomesticStockOrderBook("kiwoom", "005930")),
    quoteScenario("kiwoom", "ka10095", (service) => service.getDomesticStockMultiCurrentPrice("kiwoom", ["005930", "000660"])),
    quoteScenario("ls", "t1101", (service) => service.getDomesticStockCurrentPrice("ls", "005930")),
    quoteScenario("ls", "t1102", (service) => service.getDomesticStockCurrentPrice("ls", "005930", { trCode: "t1102" })),
    quoteScenario("ls", "t8450", (service) => service.getDomesticStockOrderBook("ls", "005930", { trCode: "t8450" })),
    quoteScenario("ls", "t8407", (service) => service.getDomesticStockMultiCurrentPrice("ls", ["005930", "000660"])),

    marketDataScenario("kiwoom", "ka10001", (service) => service.getDomesticStockBasicInfo("kiwoom", "005930")),
    marketDataScenario("kiwoom", "ka10081", (service) => service.getDomesticStockDailyCandles("kiwoom", "005930", { baseDate: "20260519" })),
    marketDataScenario("kiwoom", "ka10080", (service) => service.getDomesticStockMinuteCandles("kiwoom", "005930", { intervalMinutes: 5 })),
    marketDataScenario("ls", "t1102", (service) => service.getDomesticStockBasicInfo("ls", "005930")),
    marketDataScenario("ls", "t8410", (service) => service.getDomesticStockDailyCandles("ls", "005930", { endDate: "20260519" })),
    marketDataScenario("ls", "t8412", (service) => service.getDomesticStockMinuteCandles("ls", "005930", { intervalMinutes: 5, endDate: "20260519" })),

    marketContextScenario("kiwoom", "ka20001", (service) => service.getDomesticIndexCurrent("kiwoom", "kospi")),
    marketContextScenario("kiwoom", "ka20006", (service) => service.getDomesticIndexDailyCandles("kiwoom", "kospi", { baseDate: "20260519" })),
    marketContextScenario("ls", "t1511", (service) => service.getDomesticIndexCurrent("ls", "kospi")),
    marketContextScenario("ls", "t1514", (service) => service.getDomesticIndexDailyCandles("ls", "kospi")),
    marketContextScenario("ls", "t1485", (service) => service.getDomesticExpectedIndex("ls", "kospi", { session: "preopen" })),

    marketFlowScenario("kiwoom", "ka10051", (service) => service.getDomesticInvestorFlow("kiwoom", "kospi")),
    marketFlowScenario("kiwoom", "ka90005", (service) => service.getProgramTradingTrend("kiwoom", "kospi", { date: "20260519" })),
    marketFlowScenario("ls", "t1602", (service) => service.getDomesticInvestorFlow("ls", "kospi")),
    marketFlowScenario("ls", "t1632", (service) => service.getProgramTradingTrend("ls", "kospi")),

    scannerScenario("kiwoom", "ka10030", (service) => service.getDomesticStockVolumeRankings("kiwoom")),
    scannerScenario("kiwoom", "ka10032", (service) => service.getDomesticStockValueRankings("kiwoom")),
    scannerScenario("kiwoom", "ka10027", (service) => service.getDomesticStockChangeRateRankings("kiwoom")),
    scannerScenario("kiwoom", "ka10171", (service) => service.listConditionSearches("kiwoom")),
    scannerScenario("kiwoom", "ka10172", (service) => service.searchCondition("kiwoom", { seq: "4" })),
    scannerScenario("kiwoom", "ka10173", (service) => service.startConditionSearchRealtime("kiwoom", { seq: "4" })),
    scannerScenario("ls", "t1452", (service) => service.getDomesticStockVolumeRankings("ls")),
    scannerScenario("ls", "t1463", (service) => service.getDomesticStockValueRankings("ls")),
    scannerScenario("ls", "t1441", (service) => service.getDomesticStockChangeRateRankings("ls")),
    scannerScenario("ls", "t1866", (service) => service.listConditionSearches("ls", { userId: "testID" })),
    scannerScenario("ls", "t1859", (service) => service.searchCondition("ls", { queryIndex: "testID0000" })),
    scannerScenario("ls", "t1860", (service) => service.startConditionSearchRealtime("ls", { queryIndex: "testID0000" })),

    accountScenario("kiwoom", "kt00001", (service) => service.getDomesticStockCash("kiwoom")),
    accountScenario("kiwoom", "kt00018", (service) => service.getDomesticStockBalance("kiwoom")),
    accountScenario("kiwoom", "kt00007", (service) => service.getDomesticStockOrderHistory("kiwoom")),
    accountScenario("ls", "CSPAQ12200", (service) => service.getDomesticStockCash("ls")),
    accountScenario("ls", "t0424", (service) => service.getDomesticStockBalance("ls")),
    accountScenario("ls", "CSPAQ13700", (service) => service.getDomesticStockOrderHistory("ls", { orderDate: "20260519" })),

    orderScenario("kiwoom", "kt10000", (service) => service.buyDomesticStock("kiwoom", { symbol: "005930", quantity: 1 })),
    orderScenario("kiwoom", "kt10001", (service) => service.sellDomesticStock("kiwoom", { symbol: "005930", quantity: 1 })),
    orderScenario("kiwoom", "kt10002", (service) => service.modifyDomesticStock("kiwoom", { originalOrderNumber: "1", symbol: "005930", quantity: 1, price: 70000, orderType: "limit" })),
    orderScenario("kiwoom", "kt10003", (service) => service.cancelDomesticStock("kiwoom", { originalOrderNumber: "1", symbol: "005930", quantity: 1 })),
    orderScenario("ls", "CSPAT00601", (service) => service.buyDomesticStock("ls", { symbol: "005930", quantity: 1 })),
    orderScenario("ls", "CSPAT00701", (service) => service.modifyDomesticStock("ls", { originalOrderNumber: "1", symbol: "005930", quantity: 1, price: 70000, orderType: "limit" })),
    orderScenario("ls", "CSPAT00801", (service) => service.cancelDomesticStock("ls", { originalOrderNumber: "1", symbol: "005930", quantity: 1 })),
  ];

  for (const scenario of scenarios) {
    const actual = await scenario.getParams();
    const missing = missingRequiredFields(scenario.broker, scenario.id, actual);
    assert.deepEqual(missing, [], `${scenario.broker} ${scenario.id} missing required request fields`);
  }
});

function quoteScenario(broker, id, run) {
  return serviceScenario({ broker, id, Service: QuoteService, run });
}

function marketDataScenario(broker, id, run) {
  return serviceScenario({ broker, id, Service: MarketDataService, run });
}

function marketContextScenario(broker, id, run) {
  return serviceScenario({ broker, id, Service: MarketContextService, run });
}

function marketFlowScenario(broker, id, run) {
  return serviceScenario({ broker, id, Service: MarketFlowService, run });
}

function scannerScenario(broker, id, run) {
  return serviceScenario({ broker, id, Service: ScannerService, run });
}

function accountScenario(broker, id, run) {
  return serviceScenario({ broker, id, Service: AccountService, run });
}

function serviceScenario({ broker, id, Service, run }) {
  return {
    broker,
    id,
    async getParams() {
      const client = new RecordingClient(broker);
      const service = new Service({ [broker]: client });
      const result = await run(service);
      assert.equal(result.ok, true, `${broker} ${id} scenario should succeed`);
      const call = client.calls.find((item) => normalizeId(item.id) === normalizeId(id));
      assert.ok(call, `${broker} ${id} should be called`);
      return call.params;
    },
  };
}

function orderScenario(broker, id, run) {
  return {
    broker,
    id,
    async getParams() {
      const result = await run(new OrderService({}));
      assert.equal(result.ok, true, `${broker} ${id} order dry-run should succeed`);
      assert.equal(normalizeId(result.id), normalizeId(id));
      return result.data.request;
    },
  };
}

class RecordingClient {
  constructor(broker) {
    this.broker = broker;
    this.calls = [];
  }

  async request(id, params, options = {}) {
    this.calls.push({ id, params, options });
    return {
      ok: true,
      broker: this.broker,
      id,
      data: {},
      raw: {},
      headers: {},
      status: 200,
    };
  }
}

function missingRequiredFields(broker, id, params) {
  const entry = findManifestEntry(broker, id);
  const names = new Set(flattenParamNames(params));
  return (entry.body?.request ?? [])
    .filter((field) => field.required)
    .map((field) => normalizeFieldId(field.id))
    .filter((field) => !names.has(field));
}

function flattenParamNames(value) {
  if (!value || typeof value !== "object") {
    return [];
  }

  const names = [];
  for (const [key, child] of Object.entries(value)) {
    names.push(key);
    if (child && typeof child === "object" && !Array.isArray(child)) {
      names.push(...flattenParamNames(child));
    }
  }

  return names;
}

function findManifestEntry(broker, id) {
  const manifest = manifests[broker];
  const normalized = normalizeId(id);
  const entry = Object.values(manifest.apis).find((candidate) => normalizeId(candidate.id) === normalized);
  assert.ok(entry, `${broker} ${id} should exist in generated manifest`);
  return entry;
}

function normalizeId(value) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeFieldId(value) {
  return String(value ?? "")
    .replaceAll("&nbsp;", "")
    .replace(/^-+/, "")
    .trim();
}
