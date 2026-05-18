import { BaseBrokerClient } from "./BaseBrokerClient.mjs";
import { BrokerError, MemoryTokenStore, mergeHeaders } from "../core/index.mjs";

const TOKEN_API_ID = "au10001";
const REVOKE_API_ID = "au10002";
const DEFAULT_TOKEN_TTL_MS = 23 * 60 * 60 * 1000;

export class KiwoomClient extends BaseBrokerClient {
  constructor(config = {}) {
    validateCredentials(config);
    super("kiwoom", config);

    this.appKey = config.appKey;
    this.secretKey = config.secretKey;
  }

  async request(apiId, params = {}, options = {}) {
    let id = String(apiId ?? "").trim();

    try {
      id = normalizeId(apiId);
      const entry = await this.getEntry(id);
      const endpoint = await this.getEndpoint(id);

      if (entry.requestFormat !== "json") {
        return this.failureResponse(id, BrokerError.config(`Unsupported Kiwoom request format: ${entry.requestFormat}`, {
          broker: this.broker,
          id,
        }));
      }

      const token = entry.authRequired ? await this.getAccessToken() : null;
      const headers = buildKiwoomHeaders(entry, id, token, options);
      const result = await this.http.request({
        method: endpoint.method,
        url: endpoint.url,
        headers,
        body: params ?? {},
        bodyFormat: "json",
        timeoutMs: options.timeoutMs,
        context: {
          broker: this.broker,
          id,
          operation: "request",
          retryable: options.retryable,
        },
      });

      return this.normalizeKiwoomResult(id, result);
    } catch (error) {
      return this.failureResponse(id || "unknown", error, { id: id || undefined });
    }
  }

  async getAccessToken(forceRefresh = false) {
    const key = this.tokenStoreKey();

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
        "api-id": TOKEN_API_ID,
      },
      body: {
        grant_type: "client_credentials",
        appkey: this.appKey,
        secretkey: this.secretKey,
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
      throw BrokerError.auth("Kiwoom access token request failed", {
        broker: this.broker,
        id: TOKEN_API_ID,
        status: result.status,
        cause: result.error,
      });
    }

    const token = parseKiwoomToken(result.data, this.now);
    return this.tokenStore.set(key, token);
  }

  async revokeToken() {
    const key = this.tokenStoreKey();
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
          authorization: `${token.tokenType} ${token.accessToken}`,
          "api-id": REVOKE_API_ID,
        },
        body: {
          appkey: this.appKey,
          secretkey: this.secretKey,
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

      const response = this.normalizeKiwoomResult(REVOKE_API_ID, result);
      if (response.ok) {
        this.tokenStore.delete(key);
      }
      return response;
    } catch (error) {
      return this.failureResponse(REVOKE_API_ID, error, { id: REVOKE_API_ID });
    }
  }

  clearToken() {
    this.tokenStore.delete(this.tokenStoreKey());
  }

  tokenStoreKey() {
    return `kiwoom:${this.env}`;
  }

  normalizeKiwoomResult(id, result) {
    const continuation = extractKiwoomContinuation(result.headers ?? {});

    if (!result.ok) {
      return this.failureResponse(result.error?.id ?? id, result.error, {
        id,
        raw: result.raw,
        headers: result.headers,
        status: result.status,
        continuation,
      });
    }

    const apiError = extractKiwoomApiError(result.data, id);
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

export function parseKiwoomToken(data, now = Date.now) {
  const token = String(data?.token ?? "").trim();

  if (!token) {
    throw BrokerError.auth("Kiwoom access token response did not include token", {
      broker: "kiwoom",
      id: TOKEN_API_ID,
      details: { responseFields: data && typeof data === "object" ? Object.keys(data) : [] },
    });
  }

  return {
    accessToken: token,
    tokenType: String(data?.token_type ?? "Bearer"),
    expiresAt: parseKiwoomExpiresAt(data?.expires_dt, now),
    raw: data,
  };
}

export function parseKiwoomExpiresAt(value, now = Date.now) {
  const raw = String(value ?? "").trim();
  const match = raw.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);

  if (!match) {
    return now() + DEFAULT_TOKEN_TTL_MS;
  }

  const [, year, month, day, hour, minute, second] = match.map(Number);
  const timestamp = new Date(year, month - 1, day, hour, minute, second).getTime();

  if (!Number.isFinite(timestamp)) {
    return now() + DEFAULT_TOKEN_TTL_MS;
  }

  return timestamp;
}

function buildKiwoomHeaders(entry, id, token, options = {}) {
  const autoHeaders = {
    "Content-Type": entry.contentType,
    "api-id": id,
  };

  if (entry.authRequired && token) {
    autoHeaders.authorization = `${token.tokenType} ${token.accessToken}`;
  }

  if (options.continuation?.continueFlag || options.continuation?.nextKey) {
    autoHeaders["cont-yn"] = options.continuation.continueFlag ?? "Y";
  }

  if (options.continuation?.nextKey) {
    autoHeaders["next-key"] = options.continuation.nextKey;
  }

  return mergeHeaders(options.headers ?? {}, autoHeaders);
}

function extractKiwoomContinuation(headers) {
  const contYn = headers["cont-yn"];
  const nextKey = headers["next-key"];

  if (contYn === undefined && nextKey === undefined) {
    return undefined;
  }

  return {
    hasNext: contYn === "Y",
    key: nextKey || undefined,
    raw: {
      "cont-yn": contYn,
      "next-key": nextKey,
    },
  };
}

function extractKiwoomApiError(data, id) {
  if (!data || typeof data !== "object" || !Object.hasOwn(data, "return_code")) {
    return null;
  }

  const returnCode = data.return_code;
  const ok = returnCode === 0 || returnCode === "0";
  if (ok) {
    return null;
  }

  return BrokerError.api(String(data.return_msg ?? `Kiwoom API returned code ${returnCode}`), {
    broker: "kiwoom",
    id,
    details: {
      return_code: returnCode,
      return_msg: data.return_msg,
    },
  });
}

function validateCredentials(config) {
  if (!config.appKey) {
    throw BrokerError.config("Kiwoom appKey is required", { broker: "kiwoom" });
  }

  if (!config.secretKey) {
    throw BrokerError.config("Kiwoom secretKey is required", { broker: "kiwoom" });
  }
}

function normalizeId(apiId) {
  const normalized = String(apiId ?? "").trim();

  if (!normalized) {
    throw BrokerError.validation("Kiwoom apiId is required", { broker: "kiwoom" });
  }

  return normalized;
}
