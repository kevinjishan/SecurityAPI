import {
  LIVE_ORDER_FLAG,
  LIVE_READONLY_FLAG,
  getSdkCommit,
  requiredEnvForBroker,
} from "./_shared.mjs";

const scenarios = [
  {
    order: 1,
    file: "examples/live-readonly/auth-only.mjs",
    broker: "kiwoom, ls",
    coverage: "OAuth token issue only",
    requiredEnv: [...requiredEnvForBroker("kiwoom"), ...requiredEnvForBroker("ls")],
  },
  {
    order: 2,
    file: "examples/live-readonly/kiwoom-domestic-quote.mjs",
    broker: "kiwoom",
    coverage: "domestic quote, candle, index, investor flow",
    requiredEnv: requiredEnvForBroker("kiwoom"),
  },
  {
    order: 3,
    file: "examples/live-readonly/ls-domestic-quote.mjs",
    broker: "ls",
    coverage: "domestic quote, candle, index, investor flow",
    requiredEnv: requiredEnvForBroker("ls"),
  },
  {
    order: 4,
    file: "examples/live-readonly/ls-overseas-quote.mjs",
    broker: "ls",
    coverage: "overseas quote, order book, basic info, candles, time series",
    requiredEnv: requiredEnvForBroker("ls"),
  },
  {
    order: 5,
    file: "examples/live-readonly/ls-overseas-realtime.mjs",
    broker: "ls",
    coverage: "overseas realtime trade and order book subscription",
    requiredEnv: requiredEnvForBroker("ls"),
  },
  {
    order: 6,
    file: "examples/live-readonly/account-readonly.mjs",
    broker: "kiwoom, ls",
    coverage: "cash and balance read-only account queries",
    requiredEnv: [...requiredEnvForBroker("kiwoom"), ...requiredEnvForBroker("ls")],
  },
];

const requiredEnv = [...new Set(scenarios.flatMap((scenario) => scenario.requiredEnv))];
const missingEnv = requiredEnv.filter((name) => !String(process.env[name] ?? "").trim());
const liveReadonlyEnabled = process.env[LIVE_READONLY_FLAG] === "true";
const liveOrderEnabled = process.env[LIVE_ORDER_FLAG] === "true";
const ready = liveReadonlyEnabled && !liveOrderEnabled && missingEnv.length === 0;

const report = {
  date: new Date().toISOString(),
  sdkCommit: getSdkCommit(),
  nodeVersion: process.version,
  ready,
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
    broker: scenario.broker,
    coverage: scenario.coverage,
    requiredEnv: scenario.requiredEnv,
    runnable: scenario.requiredEnv.every((name) => !missingEnv.includes(name)),
  })),
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(formatMarkdown(report));
}

if (!ready) {
  process.exitCode = 2;
}

function formatMarkdown(value) {
  return [
    "# Live Read-only Preflight",
    "",
    `- Date: ${value.date}`,
    `- SDK commit: ${value.sdkCommit}`,
    `- Node version: ${value.nodeVersion}`,
    `- Ready: ${value.ready ? "yes" : "no"}`,
    `- ${LIVE_READONLY_FLAG}: ${value.guard[LIVE_READONLY_FLAG]}`,
    `- ${LIVE_ORDER_FLAG}: ${value.guard[LIVE_ORDER_FLAG]}`,
    `- Missing env: ${value.missingEnv.length > 0 ? value.missingEnv.join(", ") : "-"}`,
    "",
    "## Required Environment",
    "",
    "| Name | Status |",
    "| --- | --- |",
    ...Object.entries(value.requiredEnv).map(([name, status]) => `| ${name} | ${status} |`),
    "",
    "## Execution Order",
    "",
    "| Order | File | Broker | Coverage | Runnable |",
    "| ---: | --- | --- | --- | --- |",
    ...value.scenarios.map((scenario) => [
      scenario.order,
      scenario.file,
      scenario.broker,
      scenario.coverage,
      scenario.runnable ? "yes" : "no",
    ].join(" | ")).map((row) => `| ${row} |`),
    "",
  ].join("\n");
}
