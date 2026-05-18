import { BaseBrokerClient } from "./BaseBrokerClient.mjs";
import { BrokerError, mergeHeaders } from "../core/index.mjs";

const TOKEN_TR_CODE = "token";
const REVOKE_TR_CODE = "revoke";
const DEFAULT_TOKEN_TTL_MS = 23 * 60 * 60 * 1000;

export class LsClient extends BaseBrokerClient {
  constructor(config = {}) {
    validateCredentials(config);
    super("ls", config);

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
        return this.failureResponse(id, BrokerError.config(`Unsupported LS request format: ${entry.requestFormat}`, {
          broker: this.broker,
          id,
        }));
      }

      validateLsRequiredConfig(entry, this.macAddress);
      const token = entry.authRequired ? await this.getAccessToken() : null;
      const headers = buildLsHeaders(entry, id, token, {
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

      return this.normalizeLsResult(id, result);
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
      bodyFormat: "form",
      context: {
        broker: this.broker,
        id: TOKEN_TR_CODE,
        operation: "auth",
        retryable: false,
      },
    });

    if (!result.ok) {
      throw BrokerError.auth("LS access token request failed", {
        broker: this.broker,
        id: TOKEN_TR_CODE,
        status: result.status,
        cause: result.error,
      });
    }

    const token = parseLsToken(result.data, this.now);
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
        bodyFormat: "form",
        context: {
          broker: this.broker,
          id: REVOKE_TR_CODE,
          operation: "revoke",
          retryable: false,
        },
      });

      const response = this.normalizeLsResult(REVOKE_TR_CODE, result);
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
    return `ls:${this.env}`;
  }

  normalizeLsResult(id, result) {
    const continuation = extractLsContinuation(result.headers ?? {});

    if (!result.ok) {
      return this.failureResponse(result.error?.id ?? id, result.error, {
        id,
        raw: result.raw,
        headers: result.headers,
        status: result.status,
        continuation,
      });
    }

    const apiError = extractLsApiError(result.data, id);
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

export function parseLsToken(data, now = Date.now) {
  const accessToken = String(data?.access_token ?? "").trim();

  if (!accessToken) {
    throw BrokerError.auth("LS access token response did not include access_token", {
      broker: "ls",
      id: TOKEN_TR_CODE,
      details: { responseFields: data && typeof data === "object" ? Object.keys(data) : [] },
    });
  }

  return {
    accessToken,
    tokenType: String(data?.token_type ?? "Bearer"),
    expiresAt: parseLsExpiresAt(data?.expires_in ?? data?.expire_in, now),
    raw: data,
  };
}

export function parseLsExpiresAt(value, now = Date.now) {
  const expiresIn = Number(value);

  if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
    return now() + DEFAULT_TOKEN_TTL_MS;
  }

  return now() + expiresIn * 1000;
}

function buildLsHeaders(entry, id, token, options = {}) {
  const autoHeaders = {
    "Content-Type": entry.contentType,
  };
  const requestHeaderIds = new Set((entry.headers?.request ?? []).map((field) => field.id));

  if (entry.authRequired && token) {
    autoHeaders.authorization = `${token.tokenType} ${token.accessToken}`;
  }

  if (requestHeaderIds.has("tr_cd")) {
    autoHeaders.tr_cd = id;
  }

  if (requestHeaderIds.has("tr_cont")) {
    autoHeaders.tr_cont = options.continuation?.continueFlag ?? (options.continuation?.nextKey ? "Y" : "N");
  }

  if (requestHeaderIds.has("tr_cont_key") && options.continuation?.nextKey) {
    autoHeaders.tr_cont_key = options.continuation.nextKey;
  }

  applyLsRequiredConfig(entry, autoHeaders, options);

  return mergeHeaders(options.headers ?? {}, autoHeaders);
}

function applyLsRequiredConfig(entry, headers, options = {}) {
  validateLsRequiredConfig(entry, options.macAddress);

  for (const config of entry.requiredConfig ?? []) {
    if (config.key !== "macAddress") {
      continue;
    }

    if (options.macAddress) {
      headers[config.header] = options.macAddress;
    }
  }
}

function validateLsRequiredConfig(entry, macAddress) {
  for (const config of entry.requiredConfig ?? []) {
    if (config.key !== "macAddress") {
      continue;
    }

    if (!macAddress && config.required) {
      throw BrokerError.config(`LS ${entry.id} requires macAddress config`, {
        broker: "ls",
        id: entry.id,
        details: { header: config.header },
      });
    }
  }
}

function extractLsContinuation(headers) {
  const trCont = headers.tr_cont;
  const trContKey = headers.tr_cont_key;

  if (trCont === undefined && trContKey === undefined) {
    return undefined;
  }

  return {
    hasNext: trCont === "Y",
    key: trContKey || undefined,
    raw: {
      tr_cont: trCont,
      tr_cont_key: trContKey,
    },
  };
}

function extractLsApiError(data, id) {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (Object.hasOwn(data, "rsp_cd") && data.rsp_cd !== "00000") {
    return BrokerError.api(String(data.rsp_msg ?? `LS API returned code ${data.rsp_cd}`), {
      broker: "ls",
      id,
      details: {
        rsp_cd: data.rsp_cd,
        rsp_msg: data.rsp_msg,
      },
    });
  }

  if (Object.hasOwn(data, "code") && Number(data.code) !== 200) {
    return BrokerError.api(String(data.message ?? `LS API returned code ${data.code}`), {
      broker: "ls",
      id,
      details: {
        code: data.code,
        message: data.message,
      },
    });
  }

  if (Object.hasOwn(data, "error_code") || Object.hasOwn(data, "error")) {
    return BrokerError.api(String(data.error_description ?? data.error_msg ?? data.error ?? "LS API returned an error"), {
      broker: "ls",
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
    throw BrokerError.config("LS appKey is required", { broker: "ls" });
  }

  if (!config.appSecretKey) {
    throw BrokerError.config("LS appSecretKey is required", { broker: "ls" });
  }
}

function normalizeId(trCode) {
  const normalized = String(trCode ?? "").trim();

  if (!normalized) {
    throw BrokerError.validation("LS trCode is required", { broker: "ls" });
  }

  return normalized;
}
