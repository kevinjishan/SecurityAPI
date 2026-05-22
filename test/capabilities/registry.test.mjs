import assert from "node:assert/strict";
import test from "node:test";

import {
  BrokerCapabilities,
  CAPABILITY_STATUSES,
  assertCapabilityReferences,
  getCapabilities,
  getCapabilityDefinition,
  listCapabilityDefinitions,
  listCapabilityIds,
} from "../../src/index.mjs";
import { getCapabilities as getCapabilitiesFromPackage } from "security-api-reference/capabilities";

test("exports capability registry through package entry", () => {
  assert.equal(getCapabilitiesFromPackage, getCapabilities);
});

test("lists Kiwoom capabilities and supports prefixes", () => {
  const caps = getCapabilities("kiwoom");

  assert.equal(caps instanceof BrokerCapabilities, true);
  assert.equal(caps.supports("quote.domesticStock.currentPrice"), true);
  assert.equal(caps.supports("quote.domesticStock"), true);
  assert.equal(caps.supports("technical.domesticStock.indicators"), true);
  assert.equal(caps.supports("relativeStrength.domesticStock.benchmark"), true);
  assert.equal(caps.supports("marketBreadth.domesticMarket.indicators"), true);
  assert.equal(caps.supports("overseasStock.quote.currentPrice"), false);
  assert.ok(caps.listIds().includes("order.domesticStock.buy"));
});

test("finds Kiwoom API references for capabilities", () => {
  const caps = getCapabilities("kiwoom");

  assert.deepEqual(caps.findApis("auth.oauth.issueToken").map((api) => api.id), ["au10001"]);
  assert.deepEqual(caps.findApis("quote.domesticStock.currentPrice").map((api) => api.id), ["ka10001"]);
  assert.deepEqual(caps.findApis("quote.domesticStock.orderBook").map((api) => api.id), ["ka10004"]);
  assert.deepEqual(caps.findApis("quote.domesticStock.multiCurrentPrice").map((api) => api.id), ["ka10095"]);
  assert.deepEqual(caps.findApis("marketContext.domesticIndex.current").map((api) => api.id), ["ka20001"]);
  assert.deepEqual(caps.findApis("marketContext.domesticIndex.dailyCandles").map((api) => api.id), ["ka20006"]);
  assert.deepEqual(caps.findApis("marketFlow.domesticInvestor.netBuy").map((api) => api.id), ["ka10051"]);
  assert.deepEqual(caps.findApis("marketFlow.programTrading.trend").map((api) => api.id), ["ka90005"]);
  assert.deepEqual(caps.findApis("scanner.conditionSearch").map((api) => api.id), [
    "ka10171",
    "ka10172",
    "ka10173",
    "ka10174",
  ]);
  assert.deepEqual(caps.findApis("realtime.market.status").map((api) => api.id), ["0s"]);
  assert.deepEqual(caps.findApis("order.domesticStock").map((api) => api.id), [
    "kt10000",
    "kt10001",
    "kt10002",
    "kt10003",
  ]);
});

test("lists LS capabilities across domestic, overseas, and derivatives", () => {
  const caps = getCapabilities("ls");

  assert.equal(caps.supports("quote.domesticStock.orderBook"), true);
  assert.equal(caps.supports("overseasStock.quote"), true);
  assert.equal(caps.supports("overseasStock.marketData"), true);
  assert.equal(caps.supports("overseasStock.account"), true);
  assert.equal(caps.supports("overseasStock.order"), true);
  assert.equal(caps.supports("overseasStock.realtime"), true);
  assert.equal(caps.supports("technical.domesticStock.indicators"), true);
  assert.equal(caps.supports("relativeStrength.domesticStock.benchmark"), true);
  assert.equal(caps.supports("marketBreadth.domesticMarket.indicators"), true);
  assert.equal(caps.supports("overseasStock.technical.indicators"), true);
  assert.equal(caps.supports("overseasStock.relativeStrength.benchmark"), true);
  assert.equal(caps.hasMetadata("overseasStock.quote"), true);
  assert.equal(caps.hasMetadata("overseasStock.order"), true);
  assert.equal(caps.supports("futureOption.order"), false);
  assert.equal(caps.hasMetadata("futureOption.order"), true);
  assert.equal(caps.supports("realtime.domesticStock.balance"), false);
});

test("separates service-ready, metadata-only, and parked capability states", () => {
  const caps = getCapabilities("ls");

  assert.equal(CAPABILITY_STATUSES.SERVICE_READY, "serviceReady");
  assert.equal(caps.get("quote.domesticStock.currentPrice").status, "serviceReady");
  assert.equal(caps.get("quote.domesticStock.currentPrice").serviceReady, true);
  assert.equal(caps.get("overseasStock.quote.currentPrice").status, "serviceReady");
  assert.equal(caps.get("overseasStock.quote.currentPrice").serviceReady, true);
  assert.equal(caps.get("overseasStock.quote.currentPrice").metadataAvailable, true);
  assert.equal(caps.get("overseasStock.order.new").status, "serviceReady");
  assert.equal(caps.get("overseasStock.order.new").serviceReady, true);
  assert.equal(caps.get("overseasStock.order.new").metadataAvailable, true);
  assert.equal(caps.get("futureOption.order.new").status, "parked");
  assert.equal(caps.get("futureOption.order.new").serviceReady, false);
  assert.equal(caps.get("futureOption.order.new").metadataAvailable, true);
  assert.deepEqual(caps.findApis("overseasStock.quote", { status: "serviceReady" }).map((api) => api.id), [
    "g3101",
    "g3106",
  ]);
  assert.deepEqual(caps.findApis("overseasStock.marketData", { status: "serviceReady" }).map((api) => api.id), [
    "g3104",
    "g3190",
    "g3204",
    "g3203",
    "g3103",
    "g3102",
  ]);
  assert.deepEqual(caps.findApis("overseasStock.account", { status: "serviceReady" }).map((api) => api.id), [
    "COSOQ02701",
    "COSOQ00201",
    "COSAQ00102",
    "COSAQ01400",
  ]);
  assert.deepEqual(caps.findApis("overseasStock.order", { status: "serviceReady" }).map((api) => api.id), [
    "COSAT00301",
    "COSAT00311",
    "COSAT00301",
    "COSAT00400",
  ]);
  assert.deepEqual(caps.findApis("overseasStock.realtime", { status: "serviceReady" }).map((api) => api.id), [
    "GSC",
    "GSH",
    "AS0",
    "AS1",
    "AS2",
    "AS3",
    "AS4",
  ]);
  assert.deepEqual(caps.findApis("overseasStock.order", { status: "metadataOnly" }), []);
  assert.deepEqual(caps.findApis("futureOption.order", { status: "parked" }).map((api) => api.id), [
    "CFOAT00100",
    "CFOAT00200",
    "CFOAT00300",
  ]);
});

test("finds LS API references for capabilities", () => {
  const caps = getCapabilities("ls");

  assert.deepEqual(caps.findApis("auth.oauth.issueToken").map((api) => api.id), ["token"]);
  assert.ok(caps.findApis("quote.domesticStock.currentPrice").some((api) => api.id === "t1101"));
  assert.deepEqual(caps.findApis("marketContext.domesticIndex.current").map((api) => api.id), ["t1511"]);
  assert.deepEqual(caps.findApis("marketContext.domesticIndex.dailyCandles").map((api) => api.id), ["t1514"]);
  assert.deepEqual(caps.findApis("marketContext.domesticIndex.expected").map((api) => api.id), ["t1485"]);
  assert.deepEqual(caps.findApis("marketFlow.domesticInvestor.netBuy").map((api) => api.id), ["t1602"]);
  assert.deepEqual(caps.findApis("marketFlow.programTrading.trend").map((api) => api.id), ["t1632"]);
  assert.deepEqual(caps.findApis("scanner.conditionSearch").map((api) => api.id), ["t1866", "t1859", "t1860", "AFR"]);
  assert.deepEqual(caps.findApis("realtime.market.status").map((api) => api.id), ["JIF"]);
  assert.deepEqual(caps.findApis("order.domesticStock").map((api) => api.id), [
    "CSPAT00601",
    "CSPAT00601",
    "CSPAT00701",
    "CSPAT00801",
  ]);
  assert.deepEqual(caps.findApis("overseasStock.order").map((api) => api.id), [
    "COSAT00301",
    "COSAT00311",
    "COSAT00301",
    "COSAT00400",
  ]);
  assert.deepEqual(caps.findApis("overseasStock.account").map((api) => api.id), [
    "COSOQ02701",
    "COSOQ00201",
    "COSAQ00102",
    "COSAQ01400",
  ]);
  assert.deepEqual(caps.findApis("overseasStock.realtime").map((api) => api.id), [
    "GSC",
    "GSH",
    "AS0",
    "AS1",
    "AS2",
    "AS3",
    "AS4",
  ]);
});

test("promotes DB and KIS overseas candle capabilities to service-ready", () => {
  const db = getCapabilities("db");
  const kis = getCapabilities("kis");

  assert.equal(db.supports("overseasStock.marketData.candles"), true);
  assert.equal(db.supports("overseasStock.technical.indicators"), true);
  assert.equal(db.supports("overseasStock.relativeStrength.benchmark"), true);
  assert.deepEqual(db.findApis("overseasStock.marketData.candles", { status: "serviceReady" }).map((api) => api.id), [
    "FSTKCHARTDAY",
    "FSTKCHARTWEEK",
    "FSTKCHARTMONTH",
    "FSTKCHARTMIN",
    "FSTKCHARTTICK",
  ]);

  assert.equal(kis.supports("overseasStock.marketData.candles"), true);
  assert.equal(kis.supports("overseasStock.technical.indicators"), true);
  assert.equal(kis.supports("overseasStock.relativeStrength.benchmark"), true);
  assert.deepEqual(kis.findApis("overseasStock.marketData.candles", { status: "serviceReady" }).map((api) => api.id), [
    "/uapi/overseas-price/v1/quotations/inquire-daily-chartprice",
    "/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice",
  ]);
});

test("throws unsupported errors when requiring unknown capabilities", () => {
  const caps = getCapabilities("kiwoom");

  assert.throws(() => caps.require("overseasStock.quote.currentPrice"), {
    code: "UNSUPPORTED_CAPABILITY",
  });
});

test("throws unsupported errors when requiring metadata-only capabilities", () => {
  const caps = new BrokerCapabilities("ls", [
    {
      id: "overseasStock.order.new",
      status: "metadataOnly",
      apis: [{ id: "COSAT00301", role: "usMarketOrder", transport: "rest" }],
    },
  ]);

  assert.throws(() => caps.require("overseasStock.order.new"), {
    code: "UNSUPPORTED_CAPABILITY",
  });
});

test("returns capability definitions", () => {
  const definitions = listCapabilityDefinitions();

  assert.equal(getCapabilityDefinition("quote.domesticStock.currentPrice").area, "quote");
  assert.equal(definitions["order.domesticStock.buy"].label, "국내주식 매수");
  assert.equal(definitions["technical.domesticStock.indicators"].label, "국내주식 기술적 지표");
  assert.equal(definitions["relativeStrength.domesticStock.benchmark"].label, "국내주식 벤치마크 상대강도");
  assert.equal(definitions["marketBreadth.domesticMarket.indicators"].label, "국내 시장 폭 지표");
  assert.equal(definitions["overseasStock.realtime.trade"].label, "해외주식 실시간 체결");
});

test("lists capability ids by broker", () => {
  assert.ok(listCapabilityIds("kiwoom").includes("realtime.domesticStock.trade"));
  assert.ok(listCapabilityIds("ls").includes("futureOption.quote.currentPrice"));
  assert.equal(listCapabilityIds("ls", { status: "serviceReady" }).includes("futureOption.quote.currentPrice"), false);
  assert.ok(listCapabilityIds("ls", { status: "parked" }).includes("futureOption.quote.currentPrice"));
});

test("validates all capability API references against generated manifests", async () => {
  const result = await assertCapabilityReferences();

  assert.equal(result.ok, true);
  assert.equal(result.missing.length, 0);
  assert.ok(result.checked > 40);
});
