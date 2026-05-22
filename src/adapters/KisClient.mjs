import { BaseBrokerClient } from "./BaseBrokerClient.mjs";
import { BrokerError, mergeHeaders } from "../core/index.mjs";

const TOKEN_API_ID = "/oauth2/tokenP";
const REVOKE_API_ID = "/oauth2/revokeP";
const APPROVAL_API_ID = "/oauth2/Approval";
const HASHKEY_API_ID = "/uapi/hashkey";
const DEFAULT_TOKEN_TTL_MS = 23 * 60 * 60 * 1000;

export class KisClient extends BaseBrokerClient {
  constructor(config = {}) {
    validateCredentials(config);
    super("kis", config);

    this.appKey = config.appKey;
    this.appSecret = config.appSecret ?? config.appSecretKey;
    this.customerType = config.customerType ?? "P";
  }

  async request(apiId, params = {}, options = {}) {
    let id = String(apiId ?? "").trim();

    try {
      id = normalizeId(apiId);
      const entry = await this.getEntry(id);
      const endpoint = await this.getEndpoint(id);

      if (entry.protocol === "WEBSOCKET") {
        return this.failureResponse(id, BrokerError.config("KIS WebSocket APIs must be used through WebSocketBrokerClient", {
          broker: this.broker,
          id,
        }));
      }

      const token = entry.authRequired ? await this.getAccessToken() : null;
      const hashKey = options.hashKey === true ? await this.issueHashKey(params ?? {}) : options.hashKey;
      const headers = buildKisHeaders(entry, token, {
        ...options,
        appKey: this.appKey,
        appSecret: this.appSecret,
        customerType: this.customerType,
        hashKey,
        env: this.env,
      });
      const method = endpoint.method.toUpperCase();
      const result = await this.http.request({
        method,
        url: method === "GET" ? appendQuery(endpoint.url, params) : endpoint.url,
        headers,
        body: method === "GET" ? undefined : (params ?? {}),
        bodyFormat: entry.requestFormat,
        timeoutMs: options.timeoutMs,
        context: {
          broker: this.broker,
          id,
          operation: "request",
          retryable: options.retryable,
        },
      });

      return this.normalizeKisResult(id, result);
    } catch (error) {
      return this.failureResponse(id || "unknown", error, { id: id || undefined });
    }
  }

  async getAccessToken(forceRefresh = false) {
    const key = this.tokenStoreKey("access");

    if (!forceRefresh) {
      const cached = this.tokenStore.get(key);
      if (cached) {
        return cached;
      }
    }

    const endpoint = await this.getEndpoint(TOKEN_API_ID);
    const result = await this.http.request({
      method: endpoint.method,
      url: endpoint.url,
      headers: {
        "Content-Type": endpoint.contentType,
      },
      body: {
        grant_type: "client_credentials",
        appkey: this.appKey,
        appsecret: this.appSecret,
      },
      bodyFormat: "json",
      context: {
        broker: this.broker,
        id: TOKEN_API_ID,
        operation: "auth",
        retryable: false,
      },
    });

    if (!result.ok) {
      throw BrokerError.auth("KIS access token request failed", {
        broker: this.broker,
        id: TOKEN_API_ID,
        status: result.status,
        cause: result.error,
      });
    }

    const token = parseKisToken(result.data, this.now);
    return this.tokenStore.set(key, token);
  }

  async getApprovalKey(forceRefresh = false) {
    const key = this.tokenStoreKey("approval");

    if (!forceRefresh) {
      const cached = this.tokenStore.get(key);
      if (cached) {
        return cached.accessToken;
      }
    }

    const endpoint = await this.getEndpoint(APPROVAL_API_ID);
    const result = await this.http.request({
      method: endpoint.method,
      url: endpoint.url,
      headers: {
        "Content-Type": endpoint.contentType,
      },
      body: {
        grant_type: "client_credentials",
        appkey: this.appKey,
        secretkey: this.appSecret,
      },
      bodyFormat: "json",
      context: {
        broker: this.broker,
        id: APPROVAL_API_ID,
        operation: "auth",
        retryable: false,
      },
    });

    if (!result.ok) {
      throw BrokerError.auth("KIS approval key request failed", {
        broker: this.broker,
        id: APPROVAL_API_ID,
        status: result.status,
        cause: result.error,
      });
    }

    const approvalKey = String(result.data?.approval_key ?? "").trim();
    if (!approvalKey) {
      throw BrokerError.auth("KIS approval key response did not include approval_key", {
        broker: this.broker,
        id: APPROVAL_API_ID,
      });
    }

    this.tokenStore.set(key, {
      accessToken: approvalKey,
      tokenType: "Approval",
      expiresAt: this.now() + DEFAULT_TOKEN_TTL_MS,
      raw: result.data,
    });
    return approvalKey;
  }

  async issueHashKey(body) {
    const endpoint = await this.getEndpoint(HASHKEY_API_ID);
    const result = await this.http.request({
      method: endpoint.method,
      url: endpoint.url,
      headers: {
        "Content-Type": endpoint.contentType,
        appkey: this.appKey,
        appsecret: this.appSecret,
      },
      body,
      bodyFormat: "json",
      context: {
        broker: this.broker,
        id: HASHKEY_API_ID,
        operation: "request",
        retryable: false,
      },
    });

    if (!result.ok) {
      throw BrokerError.auth("KIS hashkey request failed", {
        broker: this.broker,
        id: HASHKEY_API_ID,
        status: result.status,
        cause: result.error,
      });
    }

    const hash = String(result.data?.HASH ?? result.data?.hashkey ?? "").trim();
    if (!hash) {
      throw BrokerError.auth("KIS hashkey response did not include HASH", {
        broker: this.broker,
        id: HASHKEY_API_ID,
      });
    }

    return hash;
  }

  async revokeToken() {
    const key = this.tokenStoreKey("access");
    const token = this.tokenStore.get(key);

    if (!token) {
      return {
        ok: true,
        broker: this.broker,
        id: REVOKE_API_ID,
        data: null,
        raw: null,
        headers: {},
        status: 0,
      };
    }

    try {
      const endpoint = await this.getEndpoint(REVOKE_API_ID);
      const result = await this.http.request({
        method: endpoint.method,
        url: endpoint.url,
        headers: {
          "Content-Type": endpoint.contentType,
          appkey: this.appKey,
          appsecret: this.appSecret,
        },
        body: {
          appkey: this.appKey,
          appsecret: this.appSecret,
          token: token.accessToken,
        },
        bodyFormat: "json",
        context: {
          broker: this.broker,
          id: REVOKE_API_ID,
          operation: "revoke",
          retryable: false,
        },
      });

      const response = this.normalizeKisResult(REVOKE_API_ID, result);
      if (response.ok) {
        this.tokenStore.delete(key);
      }
      return response;
    } catch (error) {
      return this.failureResponse(REVOKE_API_ID, error, { id: REVOKE_API_ID });
    }
  }

  clearToken() {
    this.tokenStore.delete(this.tokenStoreKey("access"));
    this.tokenStore.delete(this.tokenStoreKey("approval"));
  }

  tokenStoreKey(kind = "access") {
    return `kis:${this.env}:${kind}`;
  }

  normalizeKisResult(id, result) {
    const continuation = extractKisContinuation(result.headers ?? {});

    if (!result.ok) {
      return this.failureResponse(result.error?.id ?? id, result.error, {
        id,
        raw: result.raw,
        headers: result.headers,
        status: result.status,
        continuation,
      });
    }

    const apiError = extractKisApiError(result.data, id);
    if (apiError) {
      return this.failureResponse(id, apiError, {
        raw: result.raw,
        headers: result.headers,
        status: result.status,
        continuation,
      });
    }

    return this.successResponse(id, result, { continuation });
  }
}

export function parseKisToken(data, now = Date.now) {
  const accessToken = String(data?.access_token ?? "").trim();

  if (!accessToken) {
    throw BrokerError.auth("KIS access token response did not include access_token", {
      broker: "kis",
      id: TOKEN_API_ID,
      details: { responseFields: data && typeof data === "object" ? Object.keys(data) : [] },
    });
  }

  return {
    accessToken,
    tokenType: String(data?.token_type ?? "Bearer"),
    expiresAt: parseKisExpiresAt(data?.expires_in ?? data?.access_token_token_expired, now),
    raw: data,
  };
}

export function parseKisExpiresAt(value, now = Date.now) {
  const expiresIn = Number(value);
  if (Number.isFinite(expiresIn) && expiresIn > 0) {
    return now() + expiresIn * 1000;
  }

  const raw = String(value ?? "").trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (match) {
    const [, year, month, day, hour, minute, second] = match.map(Number);
    const timestamp = new Date(year, month - 1, day, hour, minute, second).getTime();
    if (Number.isFinite(timestamp)) {
      return timestamp;
    }
  }

  return now() + DEFAULT_TOKEN_TTL_MS;
}

function buildKisHeaders(entry, token, options = {}) {
  const autoHeaders = {
    "Content-Type": entry.contentType,
  };
  const trId = options.trId ?? options.tr_id ?? defaultKisTrId(entry, options);

  if (entry.authRequired && token) {
    autoHeaders.authorization = `${token.tokenType} ${token.accessToken}`;
  }

  if (!entry.path.startsWith("/oauth2/")) {
    autoHeaders.appkey = options.appKey;
    autoHeaders.appsecret = options.appSecret;
  }

  if (trId) {
    autoHeaders.tr_id = trId;
  }

  if (entry.authRequired && !entry.path.startsWith("/oauth2/")) {
    autoHeaders.custtype = options.customerType ?? "P";
    autoHeaders.tr_cont = options.continuation?.continueFlag ?? options.trCont ?? "";
  }

  if (options.hashKey) {
    autoHeaders.hashkey = options.hashKey;
  }

  return mergeHeaders(options.headers ?? {}, autoHeaders);
}

function defaultKisTrId(entry, options = {}) {
  const trIds = entry.kis?.trIds ?? [];
  if (trIds.length === 0) {
    return null;
  }

  const candidates = options.env === "mock" || options.paper === true
    ? trIds.filter((id) => id.startsWith("V"))
    : trIds.filter((id) => !id.startsWith("V"));
  const scoped = candidates.length > 0 ? candidates : trIds;
  if (options.env === "mock" || options.paper === true) {
    const mock = scoped.find((id) => id.startsWith("V"));
    if (mock) {
      if (!options.side) {
        return mock;
      }
    }
  }

  const side = options.side;
  if (side === "buy") {
    return scoped.find((id) => id.endsWith("0011U") || id.endsWith("1002U")) ?? scoped[0];
  }
  if (side === "sell") {
    return scoped.find((id) => id.endsWith("0012U") || id.endsWith("1006U")) ?? scoped[0];
  }

  return scoped[0];
}

function extractKisContinuation(headers) {
  const trCont = headers.tr_cont;

  if (trCont === undefined) {
    return undefined;
  }

  return {
    hasNext: trCont === "M" || trCont === "F",
    key: undefined,
    raw: {
      tr_cont: trCont,
    },
  };
}

function extractKisApiError(data, id) {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (Object.hasOwn(data, "rt_cd") && String(data.rt_cd) !== "0") {
    return BrokerError.api(String(data.msg1 ?? `KIS API returned code ${data.rt_cd}`), {
      broker: "kis",
      id,
      details: {
        rt_cd: data.rt_cd,
        msg_cd: data.msg_cd,
        msg1: data.msg1,
      },
    });
  }

  if (Object.hasOwn(data, "error_code") || Object.hasOwn(data, "error")) {
    return BrokerError.api(String(data.error_description ?? data.error_msg ?? data.error ?? "KIS API returned an error"), {
      broker: "kis",
      id,
      details: {
        error: data.error,
        error_code: data.error_code,
        error_description: data.error_description,
      },
    });
  }

  return null;
}

function appendQuery(url, params = {}) {
  const parsed = new URL(url);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      parsed.searchParams.set(key, String(value));
    }
  }
  return parsed.toString();
}

function validateCredentials(config) {
  if (!config.appKey) {
    throw BrokerError.config("KIS appKey is required", { broker: "kis" });
  }

  if (!config.appSecret && !config.appSecretKey) {
    throw BrokerError.config("KIS appSecret is required", { broker: "kis" });
  }
}

function normalizeId(apiId) {
  const normalized = String(apiId ?? "").trim();

  if (!normalized) {
    throw BrokerError.validation("KIS apiId is required", { broker: "kis" });
  }

  return normalized;
}
