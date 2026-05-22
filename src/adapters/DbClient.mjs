import { BaseBrokerClient } from "./BaseBrokerClient.mjs";
import { BrokerError, mergeHeaders } from "../core/index.mjs";

const TOKEN_TR_CODE = "token";
const REVOKE_TR_CODE = "revoke";
const DEFAULT_TOKEN_TTL_MS = 23 * 60 * 60 * 1000;
const DB_SUCCESS_CODES = new Set(["00000", "00040", "00136", "00156", "00200"]);
const DB_NO_DATA_MESSAGES = new Set(["조회내역이 없습니다."]);

export class DbClient extends BaseBrokerClient {
  constructor(config = {}) {
    validateCredentials(config);
    super("db", config);

    this.appKey = config.appKey;
    this.appSecretKey = config.appSecretKey;
    this.macAddress = config.macAddress;
  }

  async request(trCode, params = {}, options = {}) {
    let id = String(trCode ?? "").trim();

    try {
      id = normalizeId(trCode);
      const entry = await this.getEntry(id);
      const endpoint = await this.getEndpoint(id);

      if (!["json", "form"].includes(entry.requestFormat)) {
        return this.failureResponse(id, BrokerError.config(`Unsupported DB request format: ${entry.requestFormat}`, {
          broker: this.broker,
          id,
        }));
      }

      const token = entry.authRequired ? await this.getAccessToken() : null;
      const headers = buildDbHeaders(entry, token, {
        ...options,
        macAddress: this.macAddress,
      });
      const result = await this.http.request({
        method: endpoint.method,
        url: endpoint.url,
        headers,
        body: params ?? {},
        bodyFormat: entry.requestFormat,
        timeoutMs: options.timeoutMs,
        context: {
          broker: this.broker,
          id,
          operation: "request",
          retryable: options.retryable,
        },
      });

      return this.normalizeDbResult(id, result);
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

    const endpoint = await this.getEndpoint(TOKEN_TR_CODE);
    const result = await this.http.request({
      method: endpoint.method,
      url: endpoint.url,
      headers: {
        "Content-Type": endpoint.contentType,
      },
      body: {
        grant_type: "client_credentials",
        appkey: this.appKey,
        appsecretkey: this.appSecretKey,
        scope: "oob",
      },
      bodyFormat: endpoint.requestFormat,
      context: {
        broker: this.broker,
        id: TOKEN_TR_CODE,
        operation: "auth",
        retryable: false,
      },
    });

    if (!result.ok) {
      throw BrokerError.auth("DB access token request failed", {
        broker: this.broker,
        id: TOKEN_TR_CODE,
        status: result.status,
        cause: result.error,
      });
    }

    const token = parseDbToken(result.data, this.now);
    return this.tokenStore.set(key, token);
  }

  async revokeToken() {
    const key = this.tokenStoreKey();
    const token = this.tokenStore.get(key);

    if (!token) {
      return {
        ok: true,
        broker: this.broker,
        id: REVOKE_TR_CODE,
        data: null,
        raw: null,
        headers: {},
        status: 0,
      };
    }

    try {
      const endpoint = await this.getEndpoint(REVOKE_TR_CODE);
      const result = await this.http.request({
        method: endpoint.method,
        url: endpoint.url,
        headers: {
          "Content-Type": endpoint.contentType,
        },
        body: {
          appkey: this.appKey,
          appsecretkey: this.appSecretKey,
          token_type_hint: "access_token",
          token: token.accessToken,
        },
        bodyFormat: endpoint.requestFormat,
        context: {
          broker: this.broker,
          id: REVOKE_TR_CODE,
          operation: "revoke",
          retryable: false,
        },
      });

      const response = this.normalizeDbResult(REVOKE_TR_CODE, result);
      if (response.ok) {
        this.tokenStore.delete(key);
      }
      return response;
    } catch (error) {
      return this.failureResponse(REVOKE_TR_CODE, error, { id: REVOKE_TR_CODE });
    }
  }

  clearToken() {
    this.tokenStore.delete(this.tokenStoreKey());
  }

  tokenStoreKey() {
    return `db:${this.env}`;
  }

  normalizeDbResult(id, result) {
    const continuation = extractDbContinuation(result.headers ?? {});

    if (!result.ok) {
      return this.failureResponse(result.error?.id ?? id, result.error, {
        id,
        raw: result.raw,
        headers: result.headers,
        status: result.status,
        continuation,
      });
    }

    const apiError = extractDbApiError(result.data, id);
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

export function parseDbToken(data, now = Date.now) {
  const accessToken = String(data?.access_token ?? "").trim();

  if (!accessToken) {
    throw BrokerError.auth("DB access token response did not include access_token", {
      broker: "db",
      id: TOKEN_TR_CODE,
      details: { responseFields: data && typeof data === "object" ? Object.keys(data) : [] },
    });
  }

  return {
    accessToken,
    tokenType: String(data?.token_type ?? "Bearer"),
    expiresAt: parseDbExpiresAt(data?.expires_in ?? data?.expire_in, now),
    raw: data,
  };
}

export function parseDbExpiresAt(value, now = Date.now) {
  const expiresIn = Number(value);

  if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
    return now() + DEFAULT_TOKEN_TTL_MS;
  }

  return now() + expiresIn * 1000;
}

function buildDbHeaders(entry, token, options = {}) {
  const autoHeaders = {
    "Content-Type": entry.contentType,
  };
  const requestHeaderIds = new Set((entry.headers?.request ?? []).map((field) => field.id));

  if (entry.authRequired && token) {
    autoHeaders.authorization = `${token.tokenType} ${token.accessToken}`;
  }

  if (requestHeaderIds.has("cont_yn")) {
    autoHeaders.cont_yn = options.continuation?.continueFlag ?? (options.continuation?.nextKey ? "Y" : "N");
  }

  if (requestHeaderIds.has("cont_key") && options.continuation?.nextKey) {
    autoHeaders.cont_key = options.continuation.nextKey;
  }

  for (const config of entry.requiredConfig ?? []) {
    if (config.key === "macAddress" && options.macAddress) {
      autoHeaders[config.header] = options.macAddress;
    }
  }

  return mergeHeaders(options.headers ?? {}, autoHeaders);
}

function extractDbContinuation(headers) {
  const contYn = headers.cont_yn;
  const contKey = headers.cont_key;

  if (contYn === undefined && contKey === undefined) {
    return undefined;
  }

  return {
    hasNext: contYn === "Y",
    key: contKey || undefined,
    raw: {
      cont_yn: contYn,
      cont_key: contKey,
    },
  };
}

function extractDbApiError(data, id) {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (
    Object.hasOwn(data, "rsp_cd") &&
    !DB_SUCCESS_CODES.has(String(data.rsp_cd)) &&
    !DB_NO_DATA_MESSAGES.has(String(data.rsp_msg ?? "").trim())
  ) {
    return BrokerError.api(String(data.rsp_msg ?? `DB API returned code ${data.rsp_cd}`), {
      broker: "db",
      id,
      details: {
        rsp_cd: data.rsp_cd,
        rsp_msg: data.rsp_msg,
      },
    });
  }

  if (Object.hasOwn(data, "code") && Number(data.code) !== 200) {
    return BrokerError.api(String(data.message ?? `DB API returned code ${data.code}`), {
      broker: "db",
      id,
      details: {
        code: data.code,
        message: data.message,
      },
    });
  }

  if (Object.hasOwn(data, "error_code") || Object.hasOwn(data, "error")) {
    return BrokerError.api(String(data.error_description ?? data.error_msg ?? data.error ?? "DB API returned an error"), {
      broker: "db",
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

function validateCredentials(config) {
  if (!config.appKey) {
    throw BrokerError.config("DB appKey is required", { broker: "db" });
  }

  if (!config.appSecretKey) {
    throw BrokerError.config("DB appSecretKey is required", { broker: "db" });
  }
}

function normalizeId(trCode) {
  const normalized = String(trCode ?? "").trim();

  if (!normalized) {
    throw BrokerError.validation("DB trCode is required", { broker: "db" });
  }

  return normalized;
}
