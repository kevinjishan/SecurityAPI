import crypto from "node:crypto";

import { BrokerError, HttpClient, assertBrokerEnvironment, assertCryptoExchange } from "../core/index.mjs";

const DEFAULT_RECV_WINDOW = 5_000;

const BASE_URLS = Object.freeze({
  binance: {
    prod: { spot: "https://api.binance.com", futures: "https://fapi.binance.com" },
    mock: { spot: "https://testnet.binance.vision", futures: "https://testnet.binancefuture.com" },
  },
  bingx: {
    prod: { spot: "https://open-api.bingx.com", futures: "https://open-api.bingx.com" },
    mock: { spot: "https://open-api-vst.bingx.com", futures: "https://open-api-vst.bingx.com" },
  },
  bybit: {
    prod: { spot: "https://api.bybit.com", futures: "https://api.bybit.com" },
    mock: { spot: "https://api-testnet.bybit.com", futures: "https://api-testnet.bybit.com" },
  },
  upbit: {
    prod: { spot: "https://api.upbit.com" },
    mock: { spot: "https://api.upbit.com" },
  },
  bithumb: {
    prod: { spot: "https://api.bithumb.com" },
    mock: { spot: "https://api.bithumb.com" },
  },
  coinone: {
    prod: { spot: "https://api.coinone.co.kr" },
    mock: { spot: "https://api.coinone.co.kr" },
  },
});

const PUBLIC_IDS = new Set([
  "ticker",
  "orderbook",
  "candles",
]);

export class CryptoExchangeClient {
  constructor(exchange, config = {}) {
    this.exchange = assertCryptoExchange(exchange);
    this.broker = this.exchange;
    this.env = assertBrokerEnvironment(config.env ?? "prod");
    this.apiKey = config.apiKey ?? config.accessKey ?? null;
    this.apiSecret = config.apiSecret ?? config.secretKey ?? null;
    this.recvWindow = config.recvWindow ?? DEFAULT_RECV_WINDOW;
    this.now = config.now ?? Date.now;
    this.nonce = config.nonce ?? (() => crypto.randomUUID());
    this.baseUrls = mergeExchangeBaseUrls(this.exchange, config.baseUrls);
    this.http = config.httpClient ?? new HttpClient({
      fetch: config.fetch,
      defaultTimeoutMs: config.timeoutMs,
      defaultHeaders: config.defaultHeaders,
      retryPolicy: config.retryPolicy,
      sleep: config.sleep,
    });
  }

  async request(apiId, params = {}, options = {}) {
    let id = String(apiId ?? "").trim();

    try {
      id = normalizeCryptoApiId(this.exchange, apiId);
      const descriptor = buildCryptoRestDescriptor(this.exchange, id, params, options);
      const request = this.#buildHttpRequest(descriptor, options);
      const result = await this.http.request(request);

      if (!result.ok) {
        return this.failureResponse(id, result.error, {
          raw: result.raw,
          headers: result.headers,
          status: result.status,
        });
      }

      return this.successResponse(id, result);
    } catch (error) {
      return this.failureResponse(id || "unknown", error, { id });
    }
  }

  successResponse(id, result) {
    return {
      ok: true,
      broker: this.exchange,
      exchange: this.exchange,
      id,
      data: result.data,
      raw: result.raw,
      headers: result.headers ?? {},
      status: result.status ?? 0,
    };
  }

  failureResponse(id, error, options = {}) {
    const brokerError = error instanceof BrokerError
      ? error
      : BrokerError.unknown(error?.message ?? "Crypto exchange client failed", {
        broker: this.exchange,
        id: options.id ?? id,
        cause: error,
      });

    return {
      ok: false,
      broker: this.exchange,
      exchange: this.exchange,
      id,
      data: null,
      raw: options.raw ?? null,
      headers: options.headers ?? {},
      status: options.status ?? brokerError.status ?? 0,
      error: brokerError,
    };
  }

  #buildHttpRequest(descriptor, options = {}) {
    const baseUrl = this.#baseUrl(descriptor.product);
    const signed = descriptor.authRequired
      ? this.#signDescriptor(descriptor, options)
      : descriptor;
    const url = buildUrl(baseUrl, signed.path, signed.query);

    return {
      method: signed.method,
      url,
      headers: signed.headers,
      body: signed.body,
      bodyFormat: signed.bodyFormat,
      timeoutMs: options.timeoutMs,
      context: {
        broker: this.exchange,
        id: signed.id,
        operation: "request",
        retryable: options.retryable,
      },
    };
  }

  #baseUrl(product) {
    const baseUrl = this.baseUrls?.[this.env]?.[product] ?? this.baseUrls?.prod?.[product];
    if (!baseUrl) {
      throw BrokerError.config(`Crypto exchange base URL is not configured: ${this.exchange}/${product}`, {
        broker: this.exchange,
        details: { exchange: this.exchange, product, env: this.env },
      });
    }
    return baseUrl;
  }

  #signDescriptor(descriptor, options = {}) {
    if (!this.apiKey || !this.apiSecret) {
      throw BrokerError.config(`Crypto exchange credentials are required: ${this.exchange}`, {
        broker: this.exchange,
        id: descriptor.id,
        details: { exchange: this.exchange },
      });
    }

    if (this.exchange === "binance" || this.exchange === "bingx") {
      return signBinanceLikeDescriptor(descriptor, {
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        timestamp: this.now(),
        recvWindow: options.recvWindow ?? this.recvWindow,
        apiKeyHeader: this.exchange === "bingx" ? "X-BX-APIKEY" : "X-MBX-APIKEY",
      });
    }

    if (this.exchange === "bybit") {
      return signBybitDescriptor(descriptor, {
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        timestamp: this.now(),
        recvWindow: options.recvWindow ?? this.recvWindow,
      });
    }

    if (this.exchange === "upbit" || this.exchange === "bithumb") {
      return signJwtDescriptor(descriptor, {
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        nonce: this.nonce(),
      });
    }

    if (this.exchange === "coinone") {
      return signCoinoneDescriptor(descriptor, {
        apiKey: this.apiKey,
        apiSecret: this.apiSecret,
        nonce: this.nonce(),
      });
    }

    throw BrokerError.unsupported(`Crypto exchange signing is not supported: ${this.exchange}`, {
      broker: this.exchange,
      id: descriptor.id,
    });
  }
}

export function buildCryptoRestDescriptor(exchange, apiId, params = {}, options = {}) {
  const normalizedExchange = assertCryptoExchange(exchange);
  const id = normalizeCryptoApiId(normalizedExchange, apiId);
  const parsed = parseCryptoApiId(normalizedExchange, id);

  if (parsed.product === "futures" && !["binance", "bingx", "bybit"].includes(normalizedExchange)) {
    throw BrokerError.unsupported(`${normalizedExchange} futures APIs are not supported`, {
      broker: normalizedExchange,
      id,
      details: { exchange: normalizedExchange, product: parsed.product },
    });
  }

  if (!PUBLIC_IDS.has(parsed.action) && options.dryRunOnly === true) {
    throw BrokerError.unsupported("Dry-run mode does not build private crypto HTTP requests", {
      broker: normalizedExchange,
      id,
    });
  }

  const builder = DESCRIPTOR_BUILDERS[normalizedExchange]?.[parsed.product]?.[parsed.action];
  if (!builder) {
    throw BrokerError.unsupported(`Crypto REST endpoint is not mapped: ${id}`, {
      broker: normalizedExchange,
      id,
      details: { exchange: normalizedExchange, product: parsed.product, action: parsed.action },
    });
  }

  return {
    id,
    exchange: normalizedExchange,
    product: parsed.product,
    action: parsed.action,
    ...builder(params, options),
  };
}

export function normalizeCryptoApiId(exchange, apiId) {
  const normalizedExchange = assertCryptoExchange(exchange);
  const rawId = String(apiId ?? "").trim();
  if (!rawId) {
    throw BrokerError.validation("Crypto API id is required", { broker: normalizedExchange });
  }

  if (rawId.startsWith(`${normalizedExchange}.`)) {
    return rawId;
  }

  return `${normalizedExchange}.${rawId}`;
}

function parseCryptoApiId(exchange, apiId) {
  const parts = apiId.split(".");
  if (parts.length < 3 || parts[0] !== exchange) {
    throw BrokerError.validation(`Invalid crypto API id: ${apiId}`, {
      broker: exchange,
      id: apiId,
    });
  }

  const product = parts[1];
  if (product !== "spot" && product !== "futures") {
    throw BrokerError.validation(`Invalid crypto product: ${product}`, {
      broker: exchange,
      id: apiId,
    });
  }

  return {
    product,
    action: parts[2],
  };
}

const DESCRIPTOR_BUILDERS = Object.freeze({
  binance: {
    spot: {
      ticker: (params) => get("/api/v3/ticker/price", { symbol: requiredSymbol(params) }),
      orderbook: (params) => get("/api/v3/depth", { symbol: requiredSymbol(params), limit: params.limit }),
      candles: (params) => get("/api/v3/klines", binanceCandleQuery(params)),
      balance: () => signedGet("/api/v3/account"),
    },
    futures: {
      ticker: (params) => get("/fapi/v1/ticker/price", { symbol: requiredSymbol(params) }),
      candles: (params) => get("/fapi/v1/klines", binanceCandleQuery(params)),
      balance: () => signedGet("/fapi/v3/balance"),
      positions: (params) => signedGet("/fapi/v3/positionRisk", { symbol: params.symbol ?? undefined }),
    },
  },
  bingx: {
    spot: {
      ticker: (params) => get("/openApi/spot/v1/ticker/price", { symbol: requiredSymbol(params) }),
      orderbook: (params) => get("/openApi/spot/v1/market/depth", { symbol: requiredSymbol(params), limit: params.limit }),
      candles: (params) => get("/openApi/spot/v1/market/kline", bingxCandleQuery(params)),
      balance: () => signedGet("/openApi/spot/v1/account/balance"),
    },
    futures: {
      ticker: (params) => get("/openApi/swap/v2/quote/price", { symbol: requiredSymbol(params) }),
      candles: (params) => get("/openApi/swap/v3/quote/klines", bingxCandleQuery(params)),
      balance: () => signedGet("/openApi/swap/v2/user/balance"),
      positions: (params) => signedGet("/openApi/swap/v2/user/positions", { symbol: params.symbol ?? undefined }),
    },
  },
  bybit: {
    spot: {
      ticker: (params) => get("/v5/market/tickers", { category: "spot", symbol: requiredSymbol(params) }),
      orderbook: (params) => get("/v5/market/orderbook", { category: "spot", symbol: requiredSymbol(params), limit: params.limit }),
      candles: (params) => get("/v5/market/kline", bybitCandleQuery("spot", params)),
      balance: (params) => signedGet("/v5/account/wallet-balance", { accountType: params.accountType ?? "UNIFIED", coin: params.coin }),
    },
    futures: {
      ticker: (params) => get("/v5/market/tickers", { category: params.category ?? "linear", symbol: requiredSymbol(params) }),
      candles: (params) => get("/v5/market/kline", bybitCandleQuery(params.category ?? "linear", params)),
      balance: (params) => signedGet("/v5/account/wallet-balance", { accountType: params.accountType ?? "UNIFIED", coin: params.coin }),
      positions: (params) => signedGet("/v5/position/list", {
        category: params.category ?? "linear",
        symbol: params.symbol ?? undefined,
        settleCoin: params.settleCoin ?? params.marginAsset ?? undefined,
        limit: params.limit,
        cursor: params.cursor,
      }),
    },
  },
  upbit: {
    spot: {
      ticker: (params) => get("/v1/ticker", { markets: requiredMarket(params) }),
      orderbook: (params) => get("/v1/orderbook", { markets: requiredMarket(params), level: params.level }),
      candles: (params) => get(upbitCandlePath(params), upbitCandleQuery(params)),
      balance: () => signedGet("/v1/accounts"),
    },
  },
  bithumb: {
    spot: {
      ticker: (params) => get("/v1/ticker", { markets: requiredMarket(params) }),
      orderbook: (params) => get("/v1/orderbook", { markets: requiredMarket(params) }),
      candles: (params) => get(bithumbCandlePath(params), bithumbCandleQuery(params)),
      balance: () => signedGet("/v1/accounts"),
    },
  },
  coinone: {
    spot: {
      ticker: (params) => {
        const pair = splitKoreanMarket(params);
        return get(`/public/v2/ticker_new/${pair.quoteCurrency}/${pair.targetCurrency}`, { additional_data: params.additionalData });
      },
      orderbook: (params) => {
        const pair = splitKoreanMarket(params);
        return get(`/public/v2/orderbook/${pair.quoteCurrency}/${pair.targetCurrency}`, {
          size: params.limit ?? params.size,
          order_book_unit: params.orderBookUnit,
        });
      },
      candles: (params) => {
        const pair = splitKoreanMarket(params);
        return get(`/public/v2/chart/${pair.quoteCurrency}/${pair.targetCurrency}`, {
          interval: toCoinoneInterval(params.interval),
          timestamp: params.endTime ?? params.timestamp,
          size: params.limit,
        });
      },
      balance: (params) => signedPost("/v2/account/balance", { currencies: params.currencies }),
    },
  },
});

function get(path, query = {}) {
  return {
    method: "GET",
    path,
    query: cleanObject(query),
    headers: { Accept: "application/json" },
    body: undefined,
    bodyFormat: "json",
    authRequired: false,
  };
}

function signedGet(path, query = {}) {
  return {
    ...get(path, query),
    authRequired: true,
  };
}

function signedPost(path, body = {}) {
  return {
    method: "POST",
    path,
    query: {},
    headers: { Accept: "application/json" },
    body: cleanObject(body),
    bodyFormat: "json",
    authRequired: true,
  };
}

function binanceCandleQuery(params) {
  return {
    symbol: requiredSymbol(params),
    interval: toBinanceInterval(params.interval),
    limit: params.limit,
    startTime: params.startTime,
    endTime: params.endTime,
  };
}

function bingxCandleQuery(params) {
  return {
    symbol: requiredSymbol(params),
    interval: toBinanceInterval(params.interval),
    limit: params.limit,
    startTime: params.startTime,
    endTime: params.endTime,
  };
}

function bybitCandleQuery(category, params) {
  return {
    category,
    symbol: requiredSymbol(params),
    interval: toBybitInterval(params.interval),
    limit: params.limit,
    start: params.startTime,
    end: params.endTime,
  };
}

function upbitCandlePath(params) {
  const interval = String(params.interval ?? "1d");
  if (interval.endsWith("m")) {
    return `/v1/candles/minutes/${interval.slice(0, -1)}`;
  }
  if (interval === "1w" || interval === "w") return "/v1/candles/weeks";
  if (interval === "1M" || interval === "1mon" || interval === "1mo") return "/v1/candles/months";
  if (interval === "1y" || interval === "y") return "/v1/candles/years";
  return "/v1/candles/days";
}

function upbitCandleQuery(params) {
  return {
    market: requiredMarket(params),
    count: params.limit,
    to: params.endTime ?? params.to,
  };
}

function bithumbCandlePath(params) {
  if (params.pathStyle === "legacy") {
    const pair = splitKoreanMarket(params);
    return `/public/candlestick/${pair.targetCurrency}_${pair.quoteCurrency}/${toBithumbLegacyInterval(params.interval)}`;
  }
  return upbitCandlePath(params);
}

function bithumbCandleQuery(params) {
  if (params.pathStyle === "legacy") return {};
  return upbitCandleQuery(params);
}

function toBinanceInterval(interval = "1d") {
  const raw = String(interval);
  if (raw === "1mon" || raw === "1mo") return "1M";
  return raw;
}

function toBybitInterval(interval = "1d") {
  const raw = String(interval);
  if (raw.endsWith("m")) return raw.slice(0, -1);
  if (raw.endsWith("h")) return String(Number(raw.slice(0, -1)) * 60);
  if (raw === "1d") return "D";
  if (raw === "1w") return "W";
  if (raw === "1M" || raw === "1mon" || raw === "1mo") return "M";
  return raw;
}

function toCoinoneInterval(interval = "1d") {
  const raw = String(interval);
  if (raw === "1M" || raw === "1mo") return "1mon";
  return raw;
}

function toBithumbLegacyInterval(interval = "1d") {
  const raw = String(interval);
  if (raw === "1d") return "24h";
  if (raw === "1w") return "1w";
  if (raw === "1M" || raw === "1mon" || raw === "1mo") return "1mm";
  return raw;
}

function requiredSymbol(params) {
  const symbol = String(params.symbol ?? params.market ?? "").trim().toUpperCase();
  if (!symbol) {
    throw BrokerError.validation("Crypto symbol is required");
  }
  return symbol;
}

function requiredMarket(params) {
  const market = String(params.market ?? params.symbol ?? "").trim().toUpperCase();
  if (!market) {
    throw BrokerError.validation("Crypto market is required");
  }
  return market;
}

function splitKoreanMarket(params) {
  const market = requiredMarket(params).replace("_", "-");
  if (market.includes("-")) {
    const [quoteCurrency, targetCurrency] = market.split("-");
    return { quoteCurrency, targetCurrency };
  }

  return {
    quoteCurrency: String(params.quoteAsset ?? params.quoteCurrency ?? "KRW").trim().toUpperCase(),
    targetCurrency: market,
  };
}

function signBinanceLikeDescriptor(descriptor, options) {
  const query = cleanObject({
    ...descriptor.query,
    timestamp: options.timestamp,
    recvWindow: options.recvWindow,
  });
  const queryString = stringifyQuery(query);
  const signature = hmacHex("sha256", options.apiSecret, queryString);
  return {
    ...descriptor,
    query: { ...query, signature },
    headers: {
      ...descriptor.headers,
      [options.apiKeyHeader]: options.apiKey,
    },
  };
}

function signBybitDescriptor(descriptor, options) {
  const query = cleanObject(descriptor.query);
  const queryString = stringifyQuery(query);
  const payload = descriptor.method === "GET" ? queryString : JSON.stringify(descriptor.body ?? {});
  const signaturePayload = `${options.timestamp}${options.apiKey}${options.recvWindow}${payload}`;
  return {
    ...descriptor,
    query,
    headers: {
      ...descriptor.headers,
      "X-BAPI-API-KEY": options.apiKey,
      "X-BAPI-TIMESTAMP": String(options.timestamp),
      "X-BAPI-RECV-WINDOW": String(options.recvWindow),
      "X-BAPI-SIGN": hmacHex("sha256", options.apiSecret, signaturePayload),
    },
  };
}

function signJwtDescriptor(descriptor, options) {
  const queryString = stringifyQuery(descriptor.query);
  const claims = {
    access_key: options.apiKey,
    nonce: options.nonce,
    ...(queryString
      ? {
        query_hash: crypto.createHash("sha512").update(queryString).digest("hex"),
        query_hash_alg: "SHA512",
      }
      : {}),
  };

  return {
    ...descriptor,
    headers: {
      ...descriptor.headers,
      Authorization: `Bearer ${signJwt(claims, options.apiSecret)}`,
    },
  };
}

function signCoinoneDescriptor(descriptor, options) {
  const payload = {
    access_token: options.apiKey,
    nonce: options.nonce,
    ...(descriptor.body ?? {}),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64");
  return {
    ...descriptor,
    body: payload,
    headers: {
      ...descriptor.headers,
      "Content-Type": "application/json",
      "X-COINONE-PAYLOAD": encodedPayload,
      "X-COINONE-SIGNATURE": hmacHex("sha512", options.apiSecret, encodedPayload),
    },
  };
}

function signJwt(claims, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(claims));
  const signature = crypto.createHmac("sha256", secret).update(`${encodedHeader}.${encodedPayload}`).digest();
  return `${encodedHeader}.${encodedPayload}.${base64Url(signature)}`;
}

function buildUrl(baseUrl, path, query = {}) {
  const url = new URL(path, `${baseUrl.replace(/\/+$/, "")}/`);
  for (const [key, value] of Object.entries(cleanObject(query))) {
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function stringifyQuery(query = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(cleanObject(query))) {
    search.append(key, String(value));
  }
  return search.toString();
}

function cleanObject(input = {}) {
  const output = {};
  for (const [key, value] of Object.entries(input ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      output[key] = value;
    }
  }
  return output;
}

function hmacHex(algorithm, secret, payload) {
  return crypto.createHmac(algorithm, secret).update(payload).digest("hex");
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}

function mergeExchangeBaseUrls(exchange, overrides = {}) {
  const defaults = BASE_URLS[exchange];
  return {
    prod: {
      ...(defaults?.prod ?? {}),
      ...(overrides?.prod ?? {}),
    },
    mock: {
      ...(defaults?.mock ?? {}),
      ...(overrides?.mock ?? {}),
    },
  };
}
