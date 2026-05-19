import {
  brokerEnv,
  buildLsClient,
  buildOverseasServices,
  parseCliOptions,
  requiredEnvForBroker,
  runReadOnlyScenario,
} from "./_shared.mjs";

const options = parseCliOptions();
const requiredEnv = requiredEnvForBroker("ls");
const identity = { symbol: "TSLA", exchangeCode: "82" };
const waitMs = Number(process.env.SECURITY_API_REALTIME_WAIT_MS ?? 10_000);

await runReadOnlyScenario({
  scenario: "ls overseas realtime trade subscription",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "GSC",
  serviceMethod: "OverseasStockRealtimeService.subscribeOverseasStockTrades",
  inputSummary: identity,
  requiredEnv,
  options,
  run: async () => {
    ensureWebSocketAvailable();
    const services = buildOverseasServices({ ls: buildLsClient() });
    return subscribeAndCollect({
      subscribe: (messages) => services.realtime.subscribeOverseasStockTrades("ls", identity, {
        onMessage: (message) => messages.push(message),
      }),
      waitMs,
    });
  },
  summarize: summarizeRealtimeResult("overseas realtime trade subscription completed"),
});

await runReadOnlyScenario({
  scenario: "ls overseas realtime order book subscription",
  broker: "ls",
  environment: brokerEnv("ls"),
  api: "GSH",
  serviceMethod: "OverseasStockRealtimeService.subscribeOverseasStockOrderBook",
  inputSummary: identity,
  requiredEnv,
  options,
  run: async () => {
    ensureWebSocketAvailable();
    const services = buildOverseasServices({ ls: buildLsClient() });
    return subscribeAndCollect({
      subscribe: (messages) => services.realtime.subscribeOverseasStockOrderBook("ls", identity, {
        onMessage: (message) => messages.push(message),
      }),
      waitMs,
    });
  },
  summarize: summarizeRealtimeResult("overseas realtime order book subscription completed"),
});

async function subscribeAndCollect({ subscribe, waitMs }) {
  const messages = [];
  const subscription = await subscribe(messages);

  if (!subscription.ok) {
    return subscription;
  }

  await new Promise((resolve) => setTimeout(resolve, waitMs));
  const unsubscribeResult = await subscription.unsubscribe?.();
  subscription.close?.();

  return {
    ...subscription,
    data: {
      messageCount: messages.length,
      firstMessage: messages[0] ? {
        kind: messages[0].kind,
        id: messages[0].id,
        symbol: messages[0].symbol,
        price: messages[0].price,
      } : null,
      unsubscribeResult,
    },
    status: 0,
  };
}

function summarizeRealtimeResult(successNotes) {
  return (response) => ({
    brokerResponseCode: null,
    notes: response?.ok ? successNotes : response?.error?.message,
    response: {
      ok: response?.ok,
      broker: response?.broker,
      id: response?.id,
      ids: response?.ids,
      keyPresent: Boolean(response?.key),
      messageCount: response?.data?.messageCount ?? 0,
      firstMessage: response?.data?.firstMessage ?? null,
    },
  });
}

function ensureWebSocketAvailable() {
  if (!globalThis.WebSocket) {
    throw new Error("No global WebSocket implementation is available. Provide a compatible runtime before running live realtime examples.");
  }
}
