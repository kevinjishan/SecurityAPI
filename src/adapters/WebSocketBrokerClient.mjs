import { randomUUID } from "node:crypto";
import { BrokerError, assertBroker } from "../core/index.mjs";

const DEFAULT_REALTIME_IDS = Object.freeze({
  kiwoom: "0B",
  ls: "S3_",
  db: "S00",
  kis: "H0STCNT0",
});

const DEFAULT_RECONNECT_MAX_ATTEMPTS = 5;
const DEFAULT_RECONNECT_DELAY_MS = 1_000;
const DEFAULT_CONNECT_TIMEOUT_MS = 10_000;

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
    this.connectTimeoutMs = config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS;
    this._captureState = null;
    if (config.onInboundFrame !== undefined) {
      const integer = (n, max) => Number.isSafeInteger(n) && n >= 1 && n <= max;
      if (typeof config.onInboundFrame !== "function" || config.autoReconnect !== false ||
          !integer(config.captureMaxPending ?? 64, 256) || !integer(config.captureMaxBytes ?? 65536, 1048576) ||
          !integer(config.captureTimeoutMs ?? 5000, 30000) || config.captureClock !== undefined && typeof config.captureClock !== "function") {
        throw BrokerError.config("Capture requires a callback, explicit autoReconnect=false and bounded policy.", { broker: this.broker });
      }
      this._captureSink = config.onInboundFrame;
      this._captureClock = config.captureClock ?? Date.now;
      this._captureMaxPending = config.captureMaxPending ?? 64;
      this._captureMaxBytes = config.captureMaxBytes ?? 65536;
      this._captureTimeoutMs = config.captureTimeoutMs ?? 5000;
      this._captureState = { sessionId: randomUUID(), started: false, closed: false, received: 0, pending: 0,
        activeCallbacks: 0, completed: 0, dispatched: 0, blockedReason: null, outcomeUnknown: false };
      this._captureTail = Promise.resolve();
      this._captureCallbacks = new Set();
      this._captureConnecting = null;
      this._captureLastAt = null;
    }
  }

  async connect(options = {}) {
    if (!this._captureState) return this._connectOnce(options);
    this._assertCaptureOpen();
    if (this.socket && this.readyState() <= 1) return this;
    if (this._captureConnecting) return this._captureConnecting;
    if (this._captureState.started) throw BrokerError.config("Capture session already attempted; a new authorized instance is required.", { broker: this.broker });
    this._captureState.started = true;
    this._captureConnecting = this._connectOnce(options).catch((error) => {
      this._captureState.closed = true;
      throw error;
    }).finally(() => { this._captureConnecting = null; });
    return this._captureConnecting;
  }

  async _connectOnce(options = {}) {
    if (this.socket && this.readyState() <= 1) {
      return this;
    }

    const id = options.id ?? DEFAULT_REALTIME_IDS[this.broker];
    const endpoint = await this.brokerClient.getEndpoint(id);
    this._assertCaptureOpen();
    this.token = this.broker === "kis"
      ? { accessToken: await this.brokerClient.getApprovalKey(), tokenType: "Approval" }
      : await this.brokerClient.getAccessToken();
    this._assertCaptureOpen();
    this.connectedId = id;
    this.closedByUser = false;

    const headers = this.broker === "kiwoom"
      ? { authorization: `${this.token.tokenType} ${this.token.accessToken}`, "api-id": id }
      : undefined;

    this.socket = this.createSocket(normalizeWebSocketUrl(this.broker, endpoint.url), { headers });
    try {
      this.attachSocketHandlers(this.socket);
      await waitForSocketOpen(this.socket, this.connectTimeoutMs);
      this._assertCaptureOpen();
      this.startHeartbeat();
      return this;
    } catch (error) {
      this.closedByUser = true;
      this.socket?.close?.();
      this.socket = null;
      throw error;
    }
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
    if (this._captureState) {
      this._captureState.closed = true;
      if (this._captureState.activeCallbacks) this._captureState.outcomeUnknown = true;
    }
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
    this._assertCaptureOpen();
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

    return hasHeaders(options) ? new WebSocketCtor(url, options) : new WebSocketCtor(url);
  }

  attachSocketHandlers(socket) {
    setSocketHandler(socket, "open", (event) => {
      this.reconnectAttempts = 0;
      this.lastMessageAt = Date.now();
      this.emit("connected", { broker: this.broker, id: this.connectedId, event });
      this.emit("open", event);
    });
    setSocketHandler(socket, "close", (event) => {
      if (this._captureState && this.socket === socket) {
        this._captureState.closed = true;
        if (this._captureState.activeCallbacks) this._captureState.outcomeUnknown = true;
      }
      this.stopHeartbeat();
      this.emit("disconnected", { broker: this.broker, id: this.connectedId, event });
      this.emit("close", event);
      this.scheduleReconnect(event);
    });
    setSocketHandler(socket, "error", (event) => this._captureState ? this._stopCapture("CAPTURE_SOCKET_ERROR") : this.emit("error", event));
    setSocketHandler(socket, "message", (event) => {
      const raw = event?.data ?? event;
      if (this._captureState) this._captureMessage(socket, raw);
      else this._dispatchRaw(raw);
    });
  }


  _assertCaptureOpen() {
    if (this._captureState?.closed || this._captureState?.blockedReason) {
      throw BrokerError.config("Capture session is closed or stopped.", { broker: this.broker });
    }
  }

  inspectCapture() {
    return this._captureState ? { ...this._captureState } : null;
  }

  async waitForCaptureIdle({ timeoutMs = 1000 } = {}) {
    if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 30000) {
      throw BrokerError.config("Capture idle timeout is invalid.", { broker: this.broker });
    }
    if (!this._captureState) return { idle: true };
    let timer;
    const work = Promise.allSettled([this._captureTail, ...this._captureCallbacks]);
    try {
      await Promise.race([work, new Promise((resolve) => { timer = setTimeout(resolve, timeoutMs); })]);
      const state = this.inspectCapture();
      return { ...state, idle: state.pending === 0 && state.activeCallbacks === 0 };
    } finally { clearTimeout(timer); }
  }

  _dispatchRaw(raw, frame) {
    const data = parseSocketMessage(raw);
    this.lastMessageAt = Date.now();
    const payload = { broker: this.broker, data, raw, ...(frame ? {
      receivedAt: frame.receivedAt, captureSessionId: frame.sessionId, captureSequence: frame.sequence,
    } : {}) };
    this.emit("message", payload);
    if (frame && (this._captureState.closed || this._captureState.blockedReason)) return false;
    this.emit(isAckMessage(this.broker, data) ? "ack" : "realtime", payload);
    return true;
  }

  _stopCapture(code) {
    const state = this._captureState;
    if (!state || state.blockedReason) return;
    state.blockedReason = code;
    state.closed = true;
    if (state.activeCallbacks) state.outcomeUnknown = true;
    this.closedByUser = true;
    this.clearReconnectTimer();
    this.stopHeartbeat();
    try { this.socket?.close?.(1011, "Inbound capture stopped"); } catch {}
    // Sink/dispatch exception messages may contain private diagnostics. Never forward their text/cause.
    try { this.emit("error", BrokerError.config("Inbound frame capture stopped.", { broker: this.broker, details: { code } })); } catch {}
  }

  _captureMessage(socket, raw) {
    const state = this._captureState;
    if (this.socket !== socket || state.closed || state.blockedReason) return;
    state.received += 1;
    this.lastMessageAt = Date.now();
    if (typeof raw !== "string") { this._stopCapture("CAPTURE_FRAME_TYPE"); return; }
    if (raw.length > this._captureMaxBytes || new TextEncoder().encode(raw).byteLength > this._captureMaxBytes) {
      this._stopCapture("CAPTURE_FRAME_TOO_LARGE"); return;
    }
    let receivedAt;
    try { receivedAt = this._captureClock(); } catch { this._stopCapture("CAPTURE_CLOCK_INVALID"); return; }
    if (!Number.isSafeInteger(receivedAt) || receivedAt < 0 || this._captureLastAt !== null && receivedAt < this._captureLastAt) {
      this._stopCapture("CAPTURE_CLOCK_INVALID"); return;
    }
    this._captureLastAt = receivedAt;
    if (state.pending >= this._captureMaxPending) { this._stopCapture("CAPTURE_QUEUE_FULL"); return; }
    const frame = Object.freeze({ broker: this.broker, id: this.connectedId, sessionId: state.sessionId,
      sequence: state.received, receivedAt, raw });
    state.pending += 1;
    const task = this._captureTail.then(async () => {
      if (state.closed || state.blockedReason || this.socket !== socket) return;
      state.activeCallbacks += 1;
      const callback = Promise.resolve().then(() => this._captureSink(frame));
      this._captureCallbacks.add(callback);
      callback.then(() => { state.completed += 1; }, () => {}).finally(() => {
        state.activeCallbacks -= 1;
        this._captureCallbacks.delete(callback);
      }).catch(() => {});
      let timer;
      try {
        const outcome = await Promise.race([
          callback.then(() => "RESOLVED", () => "REJECTED"),
          new Promise(resolve => { timer = setTimeout(() => resolve("TIMEOUT"), this._captureTimeoutMs); }),
        ]);
        if (outcome !== "RESOLVED") {
          state.outcomeUnknown = true;
          this._stopCapture(outcome === "TIMEOUT" ? "CAPTURE_TIMEOUT" : "CAPTURE_FAILED");
          return;
        }
        if (state.closed || state.blockedReason || this.socket !== socket) return;
        try { if (this._dispatchRaw(raw, frame)) state.dispatched += 1; }
        catch { this._stopCapture("CAPTURE_DISPATCH_FAILED"); }
      } finally { clearTimeout(timer); }
    }).catch(() => { this._stopCapture("CAPTURE_INTERNAL_FAILED"); })
      .finally(() => { state.pending -= 1; });
    this._captureTail = task;
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

    if (this.broker === "kis") {
      return {
        header: {
          approval_key: this.token.accessToken,
          custtype: options.customerType ?? "P",
          tr_type: action === "subscribe" ? "1" : "2",
          "content-type": "utf-8",
        },
        body: {
          input: {
            tr_id: id,
            tr_key: key,
          },
        },
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
    this._assertCaptureOpen();
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
    if (this._captureState) return;
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
    if (this._captureState) throw BrokerError.config("Capture reconnect requires a new authorized instance.", { broker: this.broker });
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

  if (normalizedBroker === "kis") {
    return normalizeKisRealtimeMessage(payload);
  }

  return normalizeLsLikeRealtimeMessage(normalizedBroker, payload);
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

function normalizeLsLikeRealtimeMessage(broker, payload) {
  const header = payload?.header ?? {};
  return [{
    broker,
    id: nullableString(header.tr_cd ?? payload?.body?.tr_cd),
    name: null,
    key: nullableString(header.tr_key ?? payload?.body?.tr_key ?? payload?.body?.shcode ?? payload?.body?.shtnIsuno),
    body: payload?.body ?? {},
    raw: payload,
  }];
}

function normalizeKisRealtimeMessage(payload) {
  const header = payload?.header ?? {};
  const body = payload?.body?.output ?? payload?.body ?? {};
  return [{
    broker: "kis",
    id: nullableString(header.tr_id ?? payload?.body?.tr_id ?? payload?.body?.input?.tr_id),
    name: null,
    key: nullableString(header.tr_key ?? payload?.body?.tr_key ?? payload?.body?.input?.tr_key ?? body?.stck_shrn_iscd),
    body,
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

function addSocketListener(socket, event, handler) {
  if (socket.addEventListener) {
    socket.addEventListener(event, handler);
    return () => socket.removeEventListener?.(event, handler);
  }

  const previous = socket[`on${event}`];
  socket[`on${event}`] = (payload) => {
    previous?.(payload);
    handler(payload);
  };
  return () => {
    socket[`on${event}`] = previous;
  };
}

function hasHeaders(options = {}) {
  return Boolean(options.headers && Object.keys(options.headers).length > 0);
}

function normalizeWebSocketUrl(broker, url) {
  if (!["ls", "db"].includes(broker)) {
    return url;
  }

  const parsed = new URL(url);
  if (parsed.pathname.startsWith("/websocket/")) {
    parsed.pathname = "/websocket";
  }
  return parsed.toString();
}

function waitForSocketOpen(socket, timeoutMs) {
  if (socket.readyState === 1) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let settled = false;
    let cleanupOpen = () => {};
    let cleanupError = () => {};
    let cleanupClose = () => {};
    const timer = setTimeout(() => {
      settle(reject, new Error("WebSocket connection timed out before open."));
    }, timeoutMs);

    const settle = (callback, value) => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      cleanupOpen();
      cleanupError();
      cleanupClose();
      callback(value);
    };

    cleanupOpen = addSocketListener(socket, "open", () => settle(resolve));
    cleanupError = addSocketListener(socket, "error", (event) => settle(reject, toSocketError(event, "WebSocket error before open.")));
    cleanupClose = addSocketListener(socket, "close", (event) => settle(reject, toSocketError(event, "WebSocket closed before open.")));
  });
}

function toSocketError(event, fallbackMessage) {
  if (event instanceof Error) {
    return event;
  }

  const reason = event?.reason || event?.message;
  return new Error(reason ? `${fallbackMessage} ${reason}` : fallbackMessage);
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
