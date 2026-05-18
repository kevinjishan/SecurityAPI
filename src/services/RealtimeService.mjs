import { getCapabilities } from "../capabilities/index.mjs";
import { WebSocketBrokerClient, normalizeRealtimeMessage } from "../adapters/index.mjs";
import { BrokerError, assertBroker } from "../core/index.mjs";

const TRADE_CAPABILITY_ID = "realtime.domesticStock.trade";
const ORDER_BOOK_CAPABILITY_ID = "realtime.domesticStock.orderBook";
const ORDER_EVENT_CAPABILITY_ID = "realtime.domesticStock.orderEvent";
const BALANCE_CAPABILITY_ID = "realtime.domesticStock.balance";

export class RealtimeService {
  constructor(clients = {}, options = {}) {
    this.clients = clients;
    this.webSocketOptions = options.webSocketOptions ?? {};
  }

  async subscribeDomesticStockTrades(broker, symbol, handlers = {}, options = {}) {
    return this.subscribe({
      broker,
      key: normalizeRequiredKey(symbol, "symbol"),
      handlers,
      options,
      capabilityId: TRADE_CAPABILITY_ID,
      streamKind: "quote",
    });
  }

  async subscribeDomesticStockOrderBook(broker, symbol, handlers = {}, options = {}) {
    return this.subscribe({
      broker,
      key: normalizeRequiredKey(symbol, "symbol"),
      handlers,
      options,
      capabilityId: ORDER_BOOK_CAPABILITY_ID,
      streamKind: "quote",
    });
  }

  async subscribeDomesticStockOrderEvents(broker, handlers = {}, options = {}) {
    return this.subscribe({
      broker,
      key: options.key ?? "",
      handlers,
      options,
      capabilityId: ORDER_EVENT_CAPABILITY_ID,
      streamKind: "account",
    });
  }

  async subscribeDomesticStockBalance(broker, handlers = {}, options = {}) {
    return this.subscribe({
      broker,
      key: options.key ?? "",
      handlers,
      options,
      capabilityId: BALANCE_CAPABILITY_ID,
      streamKind: "account",
    });
  }

  async subscribe({ broker, key, handlers, options, capabilityId, streamKind }) {
    let normalizedBroker = String(broker ?? "").trim().toLowerCase();
    let source = null;

    try {
      normalizedBroker = assertBroker(normalizedBroker);
      const capabilities = getCapabilities(normalizedBroker);

      if (!capabilities.supports(capabilityId)) {
        throw BrokerError.unsupported(`${normalizedBroker} does not support ${capabilityId}`, {
          broker: normalizedBroker,
          details: { capabilityId },
        });
      }

      source = selectRealtimeSource(normalizedBroker, capabilities, capabilityId, options);
      const client = this.resolveRealtimeClient(normalizedBroker);
      const offRealtime = client.on("realtime", (event) => {
        const messages = normalizeRealtimeMessage(normalizedBroker, event.data);
        for (const message of messages) {
          if (message.id === source.id || !message.id) {
            handlers.onMessage?.(message);
          }
        }
      });
      const offAck = handlers.onAck ? client.on("ack", handlers.onAck) : null;
      const offError = handlers.onError ? client.on("error", handlers.onError) : null;
      const subscription = await client.subscribe(source.id, key, {
        ...options,
        streamKind,
      });

      return {
        ok: true,
        broker: normalizedBroker,
        capability: capabilityId,
        id: source.id,
        key,
        subscription,
        unsubscribe: async () => {
          offRealtime();
          offAck?.();
          offError?.();
          return client.unsubscribe(source.id, key, {
            ...options,
            streamKind,
          });
        },
      };
    } catch (error) {
      return failureResponse({
        broker: normalizedBroker || "unknown",
        source,
        capabilityId,
        error,
      });
    }
  }

  resolveRealtimeClient(broker) {
    const client = this.clients[broker];
    if (!client) {
      throw BrokerError.config(`Missing realtime client for broker: ${broker}`, {
        broker,
        details: { broker },
      });
    }

    if (client.subscribe && client.on) {
      return client;
    }

    if (client.getAccessToken && client.getEndpoint) {
      return new WebSocketBrokerClient({
        brokerClient: client,
        ...this.webSocketOptions,
      });
    }

    throw BrokerError.config(`Invalid realtime client for broker: ${broker}`, {
      broker,
      details: { broker },
    });
  }
}

export function normalizeDomesticStockRealtimeMessage(broker, payload) {
  return normalizeRealtimeMessage(broker, payload);
}

function selectRealtimeSource(broker, capabilities, capabilityId, options) {
  const preferredId = options.apiId ?? options.trCode;
  const sources = capabilities.findApis(capabilityId).filter((api) => api.transport === "websocket");

  if (preferredId) {
    const source = sources.find((api) => api.id === preferredId);
    if (!source) {
      throw BrokerError.unsupported(`${broker} ${capabilityId} does not expose ${preferredId}`, {
        broker,
        details: { capabilityId, requestedId: preferredId },
      });
    }

    return source;
  }

  const source = sources[0];
  if (!source) {
    throw BrokerError.unsupported(`${broker} does not have a WebSocket source for ${capabilityId}`, {
      broker,
      details: { capabilityId },
    });
  }

  return source;
}

function normalizeRequiredKey(value, field) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw BrokerError.validation(`${field} is required`, {
      details: { field },
    });
  }

  return normalized;
}

function failureResponse({ broker, source, error, capabilityId }) {
  const brokerError = error instanceof BrokerError
    ? error
    : BrokerError.unknown(error?.message ?? "Realtime service failed", {
        broker,
        cause: error,
      });

  return {
    ok: false,
    broker,
    capability: capabilityId,
    id: source?.id ?? null,
    data: null,
    error: brokerError,
  };
}
