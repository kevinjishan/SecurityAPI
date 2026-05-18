import { BrokerError, assertBroker } from "../core/index.mjs";

const DEFAULT_REALTIME_IDS = Object.freeze({
  kiwoom: "0B",
  ls: "S3_",
});

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
  }

  async connect(options = {}) {
    if (this.socket && this.readyState() <= 1) {
      return this;
    }

    const id = options.id ?? DEFAULT_REALTIME_IDS[this.broker];
    const endpoint = await this.brokerClient.getEndpoint(id);
    this.token = await this.brokerClient.getAccessToken();
    this.connectedId = id;

    const headers = this.broker === "kiwoom"
      ? { authorization: `${this.token.tokenType} ${this.token.accessToken}`, "api-id": id }
      : undefined;

    this.socket = this.createSocket(endpoint.url, { headers });
    this.attachSocketHandlers(this.socket);
    return this;
  }

  async subscribe(id, key = "", options = {}) {
    await this.ensureConnected(id);
    const message = this.buildSubscriptionMessage("subscribe", id, key, options);
    this.send(message);
    return {
      broker: this.broker,
      id,
      key,
      action: "subscribe",
      request: message,
    };
  }

  async unsubscribe(id, key = "", options = {}) {
    await this.ensureConnected(id);
    const message = this.buildSubscriptionMessage("unsubscribe", id, key, options);
    this.send(message);
    return {
      broker: this.broker,
      id,
      key,
      action: "unsubscribe",
      request: message,
    };
  }

  close(code, reason) {
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
    setSocketHandler(socket, "open", (event) => this.emit("open", event));
    setSocketHandler(socket, "close", (event) => this.emit("close", event));
    setSocketHandler(socket, "error", (event) => this.emit("error", event));
    setSocketHandler(socket, "message", (event) => {
      const raw = event?.data ?? event;
      const data = parseSocketMessage(raw);
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

  emit(event, payload) {
    for (const handler of this.handlers.get(event) ?? []) {
      handler(payload);
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

function nullableString(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return String(value);
}
