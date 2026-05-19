import { execFileSync } from "node:child_process";

import {
  AccountService,
  KiwoomClient,
  LsClient,
  MarketContextService,
  MarketDataService,
  MarketFlowService,
  OverseasStockAccountService,
  OverseasStockMarketDataService,
  OverseasStockQuoteService,
  OverseasStockRealtimeService,
  QuoteService,
  RealtimeService,
} from "security-api-reference";

export const LIVE_READONLY_FLAG = "SECURITY_API_LIVE_READONLY";
export const LIVE_ORDER_FLAG = "SECURITY_API_ALLOW_LIVE_ORDER";

const SENSITIVE_KEY_PATTERN = /(authorization|token|secret|password|pwd|appkey|app_secret|appsecret|account|acct|acnt|mac)/i;

export function parseCliOptions(argv = process.argv.slice(2)) {
  return {
    validateOnly: argv.includes("--validate-only"),
    json: argv.includes("--json"),
  };
}

export function ensureReadOnlyGuard({ scenario, requiredEnv = [], options = parseCliOptions() }) {
  if (process.env[LIVE_ORDER_FLAG] === "true") {
    throw new Error(`${LIVE_ORDER_FLAG}=true is not allowed for read-only scenario: ${scenario}`);
  }

  if (options.validateOnly) {
    return {
      mode: "validate",
      missingEnv: missingEnv(requiredEnv),
      reason: "validate-only mode; no broker network calls are made",
    };
  }

  if (process.env[LIVE_READONLY_FLAG] !== "true") {
    return {
      mode: "skipped",
      missingEnv: missingEnv(requiredEnv),
      reason: `${LIVE_READONLY_FLAG}=true is required for live read-only calls`,
    };
  }

  const missing = missingEnv(requiredEnv);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables for ${scenario}: ${missing.join(", ")}`);
  }

  return {
    mode: "live",
    missingEnv: [],
    reason: "live read-only mode enabled",
  };
}

export async function runReadOnlyScenario({
  scenario,
  broker,
  environment,
  api,
  serviceMethod,
  inputSummary,
  requiredEnv = [],
  options = parseCliOptions(),
  run,
  summarize = defaultSummarizeResult,
}) {
  const guard = ensureReadOnlyGuard({ scenario, requiredEnv, options });

  if (guard.mode !== "live") {
    const record = buildResultRecord({
      scenario,
      broker,
      environment,
      api,
      serviceMethod,
      inputSummary,
      result: "skipped",
      notes: guard.reason,
      sensitiveDataMasked: true,
      extra: guard.missingEnv.length > 0 ? { missingEnv: guard.missingEnv } : {},
    });
    printRecord(record, options);
    return record;
  }

  const startedAt = Date.now();
  try {
    const response = await run();
    const summary = summarize(response);
    const record = buildResultRecord({
      scenario,
      broker,
      environment,
      api: response?.id ?? api,
      serviceMethod,
      inputSummary,
      result: response?.ok ? "pass" : "fail",
      status: response?.status,
      brokerResponseCode: summary.brokerResponseCode,
      sdkErrorCode: response?.error?.code,
      notes: summary.notes,
      sensitiveDataMasked: true,
      elapsedMs: Date.now() - startedAt,
      extra: {
        response: maskSensitive(summary.response),
      },
    });
    printRecord(record, options);
    return record;
  } catch (error) {
    const record = buildResultRecord({
      scenario,
      broker,
      environment,
      api,
      serviceMethod,
      inputSummary,
      result: "fail",
      sdkErrorCode: error?.code ?? error?.name ?? "ERROR",
      notes: error?.message ?? "Scenario failed",
      sensitiveDataMasked: true,
      elapsedMs: Date.now() - startedAt,
    });
    printRecord(record, options);
    return record;
  }
}

export function buildKiwoomClient() {
  return new KiwoomClient({
    appKey: process.env.KIWOOM_APP_KEY,
    secretKey: process.env.KIWOOM_SECRET_KEY,
    env: process.env.KIWOOM_ENV ?? "mock",
  });
}

export function buildLsClient() {
  return new LsClient({
    appKey: process.env.LS_APP_KEY,
    appSecretKey: process.env.LS_APP_SECRET_KEY,
    macAddress: process.env.LS_MAC_ADDRESS,
    env: process.env.LS_ENV ?? "prod",
  });
}

export function buildDomesticServices(clients) {
  return {
    quote: new QuoteService(clients),
    marketData: new MarketDataService(clients),
    marketContext: new MarketContextService(clients),
    marketFlow: new MarketFlowService(clients),
    account: new AccountService(clients),
    realtime: new RealtimeService(clients),
  };
}

export function buildOverseasServices(clients) {
  return {
    quote: new OverseasStockQuoteService(clients),
    marketData: new OverseasStockMarketDataService(clients),
    account: new OverseasStockAccountService(clients),
    realtime: new OverseasStockRealtimeService(clients),
  };
}

export function brokerEnv(broker) {
  return broker === "kiwoom"
    ? process.env.KIWOOM_ENV ?? "mock"
    : process.env.LS_ENV ?? "prod";
}

export function requiredEnvForBroker(broker) {
  if (broker === "kiwoom") {
    return ["KIWOOM_APP_KEY", "KIWOOM_SECRET_KEY"];
  }

  return ["LS_APP_KEY", "LS_APP_SECRET_KEY"];
}

export function getSdkCommit() {
  try {
    return execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "unknown";
  }
}

export function buildResultRecord({
  scenario,
  broker,
  environment,
  api,
  serviceMethod,
  inputSummary,
  result,
  status = null,
  brokerResponseCode = null,
  sdkErrorCode = null,
  retryAttempted = "no",
  sensitiveDataMasked = true,
  notes = null,
  elapsedMs = null,
  extra = {},
}) {
  return {
    date: new Date().toISOString(),
    broker,
    environment,
    sdkCommit: getSdkCommit(),
    nodeVersion: process.version,
    scenario,
    api,
    serviceMethod,
    inputSummary: maskSensitive(inputSummary),
    result,
    status,
    brokerResponseCode,
    sdkErrorCode,
    retryAttempted,
    sensitiveDataMasked: sensitiveDataMasked ? "yes" : "no",
    elapsedMs,
    notes,
    ...extra,
  };
}

export function printRecord(record, options = parseCliOptions()) {
  const masked = maskSensitive(record);
  if (options.json) {
    console.log(JSON.stringify(masked, null, 2));
    return;
  }

  console.log(formatRecord(masked));
}

export function formatRecord(record) {
  return [
    "## Live Read-only Result",
    "",
    `- Date: ${record.date}`,
    `- Broker: ${record.broker}`,
    `- Environment: ${record.environment}`,
    `- SDK commit: ${record.sdkCommit}`,
    `- Node version: ${record.nodeVersion}`,
    `- Scenario: ${record.scenario}`,
    `- API/TR: ${record.api ?? "-"}`,
    `- Service method: ${record.serviceMethod}`,
    `- Input summary: ${JSON.stringify(record.inputSummary ?? {})}`,
    `- Result: ${record.result}`,
    `- Status: ${record.status ?? "-"}`,
    `- Broker response code: ${record.brokerResponseCode ?? "-"}`,
    `- SDK error code: ${record.sdkErrorCode ?? "-"}`,
    `- Retry attempted: ${record.retryAttempted}`,
    `- Sensitive data masked: ${record.sensitiveDataMasked}`,
    `- Elapsed ms: ${record.elapsedMs ?? "-"}`,
    `- Notes: ${record.notes ?? "-"}`,
    "",
  ].join("\n");
}

export function maskSensitive(value) {
  if (Array.isArray(value)) {
    return value.map((item) => maskSensitive(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(Object.entries(value).map(([key, child]) => [
    key,
    SENSITIVE_KEY_PATTERN.test(key) ? maskScalar(key, child) : maskSensitive(child),
  ]));
}

export function summarizeQuoteData(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  return maskSensitive({
    symbol: data.symbol,
    name: data.name,
    price: data.price,
    change: data.change,
    changeRate: data.changeRate,
    currency: data.currency,
    source: data.source,
  });
}

export function summarizeCollection(value, fields = []) {
  if (!value || typeof value !== "object") {
    return null;
  }

  return Object.fromEntries(fields.map((field) => [field, value[field] ?? null]));
}

function defaultSummarizeResult(response) {
  return {
    brokerResponseCode: response?.raw?.rsp_cd ?? response?.raw?.return_code ?? null,
    notes: response?.ok ? "read-only response received" : response?.error?.message,
    response: {
      ok: response?.ok,
      broker: response?.broker,
      id: response?.id,
      status: response?.status,
      continuation: response?.continuation,
      error: response?.error ? {
        code: response.error.code,
        message: response.error.message,
        retryable: response.error.retryable,
      } : null,
    },
  };
}

function missingEnv(names) {
  return names.filter((name) => !String(process.env[name] ?? "").trim());
}

function maskScalar(key, value) {
  if (value === undefined || value === null || value === "") {
    return value;
  }

  if (/account|acct|acnt/i.test(key)) {
    const raw = String(value);
    return raw.length <= 4 ? "****" : `***${raw.slice(-4)}`;
  }

  if (/mac/i.test(key)) {
    const raw = String(value).replace(/[^a-zA-Z0-9]/g, "");
    return raw.length <= 4 ? "[REDACTED_MAC]" : `***${raw.slice(-4)}`;
  }

  return `[REDACTED_${key.toUpperCase()}]`;
}
