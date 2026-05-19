import { BrokerError, assertBroker } from "../core/index.mjs";

const DEFAULT_REALTIME_IDS = Object.freeze({
  kiwoom: "0B",
  ls: "S3_",
});

const DEFAULT_RECONNECT_MAX_ATTEMPTS = 5;
const DEFAULT_RECONNECT_DELAY_MS = 1_000;

export class WebSocketBrokerClient {
  constructor(config = {}) {
    if (!config.brokerClient) {
      throw BrokerError.config("brokerClient is required for WebSocketBrokerClient");
    }

    this.brokerClient = config.brokerClient;
    this.broker = assertBroker(config.broker ?? config.brokerClient.broker);
    this.WebSocket = config.WebSocket;
    this.webSocketFactory = config.webSocketFactory;
    this.socket = null;
    this.token = null;
    this.connectedId = null;
    this.handlers = new Map();
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.lastMessageAt = 0;
    this.closedByUser = false;
    this.autoReconnect = config.autoReconnect ?? true;
    this.reconnectMaxAttempts = config.reconnectMaxAttempts ?? DEFAULT_RECONNECT_MAX_ATTEMPTS;
    this.reconnectDelayMs = config.reconnectDelayMs ?? DEFAULT_RECONNECT_DELAY_MS;
    this.heartbeatIntervalMs = config.heartbeatIntervalMs ?? 0;
    this.heartbeatTimeoutMs = config.heartbeatTimeoutMs ?? this.heartbeatIntervalMs * 2;
    this.pingMessage = config.pingMessage;
  }

  async connect(options = {}) {
    if (this.socket && this.readyState() <= 1) {
      return this;
    }

    const id = options.id ?? DEFAULT_REALTIME_IDS[this.broker];
    const endpoint = await this.brokerClient.getEndpoint(id);
    this.token = await this.brokerClient.getAccessToken();
    this.connectedId = id;
    this.closedByUser = false;

    const headers = this.broker === "kiwoom"
      ? { authorization: `${this.token.tokenType} ${this.token.accessToken}`, "api-id": id }
      : undefined;

    this.socket = this.createSocket(endpoint.url, { headers });
    this.attachSocketHandlers(this.socket);
    this.startHeartbeat();
    return this;
  }

  async subscribe(id, key = "", options = {}) {
    await this.ensureConnected(id);
    const subscriptionKey = makeSubscriptionKey(id, key, options);
    const existing = this.subscriptions.get(subscriptionKey);
    if (existing) {
      return {
        ...existing,
        duplicate: true,
      };
    }

    const message = this.buildSubscriptionMessage("subscribe", id, key, options);
    this.send(message);
    const subscription = {
      broker: this.broker,
      id,
      key,
      action: "subscribe",
      options: { ...options },
      request: message,
    };
    this.subscriptions.set(subscriptionKey, subscription);
    return subscription;
  }

  async unsubscribe(id, key = "", options = {}) {
    await this.ensureConnected(id);
    const message = this.buildSubscriptionMessage("unsubscribe", id, key, options);
    this.send(message);
    this.subscriptions.delete(makeSubscriptionKey(id, key, options));
    return {
      broker: this.broker,
      id,
      key,
      action: "unsubscribe",
      request: message,
    };
  }

  close(code, reason) {
    this.closedByUser = true;
    this.clearReconnectTimer();
    this.stopHeartbeat();
    if (this.socket?.close) {
      this.socket.close(code, reason);
    }
  }

  on(event, handler) {
    const handlers = this.handlers.get(event) ?? new Set();
    handlers.add(handler);
    this.handlers.set(event, handlers);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this.handlers.get(event)?.delete(handler);
  }

  readyState() {
    return this.socket?.readyState ?? 3;
  }

  async ensureConnected(id) {
    if (!this.socket || this.readyState() > 1) {
      await this.connect({ id });
    }
  }

  createSocket(url, options = {}) {
    if (this.webSocketFactory) {
      return this.webSocketFactory(url, options);
    }

    const WebSocketCtor = this.WebSocket ?? globalThis.WebSocket;
    if (!WebSocketCtor) {
      throw BrokerError.config("No WebSocket implementation is available", {
        broker: this.broker,
      });
    }

    return new WebSocketCtor(url, options);
  }

  attachSocketHandlers(socket) {
    setSocketHandler(socket, "open", (event) => {
      this.reconnectAttempts = 0;
      this.lastMessageAt = Date.now();
      this.emit("connected", { broker: this.broker, id: this.connectedId, event });
      this.emit("open", event);
    });
    setSocketHandler(socket, "close", (event) => {
      this.stopHeartbeat();
      this.emit("disconnected", { broker: this.broker, id: this.connectedId, event });
      this.emit("close", event);
      this.scheduleReconnect(event);
    });
    setSocketHandler(socket, "error", (event) => this.emit("error", event));
    setSocketHandler(socket, "message", (event) => {
      const raw = event?.data ?? event;
      const data = parseSocketMessage(raw);
      this.lastMessageAt = Date.now();
      this.emit("message", { broker: this.broker, data, raw });

      if (isAckMessage(this.broker, data)) {
        this.emit("ack", { broker: this.broker, data, raw });
      } else {
        this.emit("realtime", { broker: this.broker, data, raw });
      }
    });
  }

  buildSubscriptionMessage(action, id, key, options = {}) {
    if (this.broker === "kiwoom") {
      return {
        trnm: action === "subscribe" ? "REG" : "REMOVE",
        grp_no: String(options.groupNo ?? "1"),
        refresh: String(options.refresh ?? "1"),
        data: [{ item: key, type: id }],
      };
    }

    return {
      header: {
        token: this.token.accessToken,
        tr_type: lsTrType(action, options.streamKind),
      },
      body: {
        tr_cd: id,
        tr_key: key,
      },
    };
  }

  send(message) {
    if (!this.socket?.send) {
      throw BrokerError.config("WebSocket is not connected", {
        broker: this.broker,
      });
    }

    this.socket.send(JSON.stringify(message));
  }

  listSubscriptions() {
    return [...this.subscriptions.values()].map((subscription) => ({
      broker: subscription.broker,
      id: subscription.id,
      key: subscription.key,
      options: { ...subscription.options },
      request: subscription.request,
    }));
  }

  emit(event, payload) {
    for (const handler of this.handlers.get(event) ?? []) {
      handler(payload);
    }
  }

  scheduleReconnect(event) {
    if (!this.autoReconnect || this.closedByUser || this.reconnectTimer) {
      return;
    }

    if (this.reconnectAttempts >= this.reconnectMaxAttempts) {
      this.emit("reconnectFailed", {
        broker: this.broker,
        attempts: this.reconnectAttempts,
        event,
      });
      return;
    }

    this.reconnectAttempts += 1;
    const delayMs = reconnectDelay(this.reconnectDelayMs, this.reconnectAttempts);
    this.emit("reconnecting", {
      broker: this.broker,
      attempt: this.reconnectAttempts,
      delayMs,
      event,
    });

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = null;
      try {
        await this.reconnect();
      } catch (error) {
        this.emit("error", error);
        this.scheduleReconnect(event);
      }
    }, delayMs);
  }

  async reconnect() {
    const id = this.connectedId ?? this.subscriptions.values().next().value?.id ?? DEFAULT_REALTIME_IDS[this.broker];
    this.socket = null;
    await this.connect({ id });
    await this.restoreSubscriptions();
    return this;
  }

  async restoreSubscriptions() {
    const subscriptions = this.listSubscriptions();
    for (const subscription of subscriptions) {
      const request = this.buildSubscriptionMessage("subscribe", subscription.id, subscription.key, subscription.options);
      this.send(request);
      this.emit("resubscribed", {
        broker: this.broker,
        id: subscription.id,
        key: subscription.key,
        request,
      });
    }
  }

  startHeartbeat() {
    this.stopHeartbeat();
    if (!this.heartbeatIntervalMs) {
      return;
    }

    this.lastMessageAt = Date.now();
    this.heartbeatTimer = setInterval(() => {
      const staleForMs = Date.now() - this.lastMessageAt;
      if (this.heartbeatTimeoutMs && staleForMs >= this.heartbeatTimeoutMs) {
        this.emit("stale", {
          broker: this.broker,
          staleForMs,
        });
        this.socket?.close?.();
        return;
      }

      if (this.pingMessage) {
        this.send(this.pingMessage);
      }
    }, this.heartbeatIntervalMs);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export function normalizeRealtimeMessage(broker, payload) {
  const normalizedBroker = assertBroker(broker);

  if (normalizedBroker === "kiwoom") {
    return normalizeKiwoomRealtimeMessage(payload);
  }

  return normalizeLsRealtimeMessage(payload);
}

function normalizeKiwoomRealtimeMessage(payload) {
  const rows = Array.isArray(payload?.data) ? payload.data : [];
  return rows.map((row) => ({
    broker: "kiwoom",
    id: nullableString(row.type),
    name: nullableString(row.name),
    key: nullableString(row.item),
    body: row.values ?? {},
    raw: row,
  }));
}

function normalizeLsRealtimeMessage(payload) {
  const header = payload?.header ?? {};
  return [{
    broker: "ls",
    id: nullableString(header.tr_cd ?? payload?.body?.tr_cd),
    name: null,
    key: nullableString(header.tr_key ?? payload?.body?.tr_key ?? payload?.body?.shcode ?? payload?.body?.shtnIsuno),
    body: payload?.body ?? {},
    raw: payload,
  }];
}

function setSocketHandler(socket, event, handler) {
  if (socket.addEventListener) {
    socket.addEventListener(event, handler);
    return;
  }

  socket[`on${event}`] = handler;
}

function parseSocketMessage(raw) {
  if (typeof raw !== "string") {
    return raw;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function isAckMessage(broker, data) {
  if (!data || typeof data !== "object") {
    return false;
  }

  if (broker === "kiwoom") {
    return data.trnm === "REG" || data.trnm === "REMOVE";
  }

  return Boolean(data.header?.tr_type);
}

function lsTrType(action, streamKind) {
  if (streamKind === "account") {
    return action === "subscribe" ? "1" : "2";
  }

  return action === "subscribe" ? "3" : "4";
}

function makeSubscriptionKey(id, key, options = {}) {
  return JSON.stringify({
    id,
    key,
    streamKind: options.streamKind ?? null,
    groupNo: options.groupNo ?? null,
  });
}

function reconnectDelay(baseDelayMs, attempt) {
  return baseDelayMs * 2 ** Math.max(0, attempt - 1);
}

function nullableString(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value);
}
