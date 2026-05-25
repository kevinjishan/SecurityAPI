import {
  LIVE_ORDER_FLAG,
  LIVE_READONLY_FLAG,
  cryptoPrivateRequiredEnv,
  getSdkCommit,
} from "../live-readonly/_shared.mjs";

const publicScenarios = [
  {
    order: 1,
    file: "examples/crypto-readonly/public-market-readonly.mjs",
    exchange: "binance, upbit",
    coverage: "public spot ticker/order book/candles",
    requiredEnv: [],
  },
  {
    order: 2,
    file: "examples/crypto-readonly/public-realtime-readonly.mjs",
    exchange: "binance, bybit",
    coverage: "public trade/orderBook WebSocket subscription",
    requiredEnv: [],
  },
];

const privateScenarios = [
  {
    order: 3,
    file: "examples/crypto-readonly/private-account-readonly.mjs",
    exchange: "binance, bybit",
    coverage: "spot balance, futures balance, futures positions",
    requiredEnv: [...cryptoPrivateRequiredEnv("binance"), ...cryptoPrivateRequiredEnv("bybit")],
  },
];

const scenarios = [...publicScenarios, ...privateScenarios];
const requiredEnv = [...new Set(scenarios.flatMap((scenario) => scenario.requiredEnv))];
const missingEnv = requiredEnv.filter((name) => !String(process.env[name] ?? "").trim());
const liveReadonlyEnabled = process.env[LIVE_READONLY_FLAG] === "true";
const liveOrderEnabled = process.env[LIVE_ORDER_FLAG] === "true";
const publicReady = liveReadonlyEnabled && !liveOrderEnabled;
const privateReady = publicReady && missingEnv.length === 0;

const report = {
  date: new Date().toISOString(),
  sdkCommit: getSdkCommit(),
  nodeVersion: process.version,
  ready: publicReady,
  publicReady,
  privateReady,
  guard: {
    [LIVE_READONLY_FLAG]: liveReadonlyEnabled ? "enabled" : "disabled",
    [LIVE_ORDER_FLAG]: liveOrderEnabled ? "enabled" : "disabled",
  },
  requiredEnv: Object.fromEntries(requiredEnv.map((name) => [
    name,
    missingEnv.includes(name) ? "missing" : "present",
  ])),
  missingEnv,
  scenarios: scenarios.map((scenario) => ({
    order: scenario.order,
    file: scenario.file,
    exchange: scenario.exchange,
    coverage: scenario.coverage,
    requiredEnv: scenario.requiredEnv,
    runnable: publicReady && scenario.requiredEnv.every((name) => !missingEnv.includes(name)),
  })),
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(formatMarkdown(report));
}

if (!publicReady) {
  process.exitCode = 2;
}

function formatMarkdown(value) {
  return [
    "# Crypto Live Read-only Preflight",
    "",
    `- Date: ${value.date}`,
    `- SDK commit: ${value.sdkCommit}`,
    `- Node version: ${value.nodeVersion}`,
    `- Public ready: ${value.publicReady ? "yes" : "no"}`,
    `- Private ready: ${value.privateReady ? "yes" : "no"}`,
    `- ${LIVE_READONLY_FLAG}: ${value.guard[LIVE_READONLY_FLAG]}`,
    `- ${LIVE_ORDER_FLAG}: ${value.guard[LIVE_ORDER_FLAG]}`,
    `- Missing env: ${value.missingEnv.length > 0 ? value.missingEnv.join(", ") : "-"}`,
    "",
    "## Required Private Environment",
    "",
    "| Name | Status |",
    "| --- | --- |",
    ...Object.entries(value.requiredEnv).map(([name, status]) => `| ${name} | ${status} |`),
    "",
    "## Execution Order",
    "",
    "| Order | File | Exchange | Coverage | Runnable |",
    "| ---: | --- | --- | --- | --- |",
    ...value.scenarios.map((scenario) => [
      scenario.order,
      scenario.file,
      scenario.exchange,
      scenario.coverage,
      scenario.runnable ? "yes" : "no",
    ].join(" | ")).map((row) => `| ${row} |`),
    "",
  ].join("\n");
}
