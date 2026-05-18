import { BrokerError } from "./BrokerError.mjs";
import { noRetryPolicy } from "./RetryPolicy.mjs";

const DEFAULT_TIMEOUT_MS = 10_000;

export class HttpClient {
  constructor(options = {}) {
    this.fetch = options.fetch ?? globalThis.fetch;
    this.defaultTimeoutMs = options.defaultTimeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.defaultHeaders = options.defaultHeaders ?? {};
    this.retryPolicy = options.retryPolicy ?? noRetryPolicy;
    this.sleep = options.sleep ?? sleep;

    if (typeof this.fetch !== "function") {
      throw BrokerError.config("A fetch implementation is required");
    }
  }

  async request(request) {
    let attempt = 0;

    while (true) {
      attempt += 1;
      const result = await this.#requestOnce(request);

      if (result.ok || !this.retryPolicy.shouldRetry({ attempt, result, request })) {
        return result;
      }

      const delayMs = this.retryPolicy.delayMs({ attempt, result, request });
      if (delayMs > 0) {
        await this.sleep(delayMs);
      }
    }
  }

  async #requestOnce(request) {
    const context = request?.context ?? {};
    const timeoutMs = request?.timeoutMs ?? this.defaultTimeoutMs;
    const headers = mergeHeaders(this.defaultHeaders, request?.headers ?? {});
    let serialized;

    try {
      serialized = serializeBody(request?.body, request?.bodyFormat ?? "json", headers);
    } catch (error) {
      return {
        ok: false,
        status: 0,
        headers: {},
        data: null,
        raw: null,
        error: BrokerError.validation(error.message, { ...context, cause: error }),
      };
    }

    const controller = new AbortController();
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    try {
      const response = await this.fetch(request.url, {
        method: request.method,
        headers: serialized.headers,
        body: serialized.body,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return await buildResult(response, context);
    } catch (error) {
      clearTimeout(timeout);

      const brokerError = timedOut
        ? BrokerError.timeout(`Request timed out after ${timeoutMs}ms`, { ...context, cause: error })
        : BrokerError.network(error?.message ?? "Network request failed", { ...context, cause: error });

      return {
        ok: false,
        status: 0,
        headers: {},
        data: null,
        raw: null,
        error: brokerError,
      };
    }
  }
}

export function normalizeResponseHeaders(headers) {
  const normalized = {};

  if (!headers) {
    return normalized;
  }

  if (typeof headers.forEach === "function") {
    headers.forEach((value, key) => {
      normalized[String(key).toLowerCase()] = String(value);
    });
    return normalized;
  }

  for (const [key, value] of Object.entries(headers)) {
    normalized[String(key).toLowerCase()] = String(value);
  }

  return normalized;
}

export function mergeHeaders(defaultHeaders, requestHeaders) {
  const merged = {};
  const index = new Map();

  for (const [key, value] of Object.entries(defaultHeaders ?? {})) {
    if (value === undefined || value === null) {
      continue;
    }

    merged[key] = String(value);
    index.set(key.toLowerCase(), key);
  }

  for (const [key, value] of Object.entries(requestHeaders ?? {})) {
    if (value === undefined || value === null) {
      continue;
    }

    const lowerKey = key.toLowerCase();
    const previousKey = index.get(lowerKey);
    if (previousKey && previousKey !== key) {
      delete merged[previousKey];
    }

    merged[key] = String(value);
    index.set(lowerKey, key);
  }

  return merged;
}

async function buildResult(response, context) {
  const status = response.status ?? 0;
  const headers = normalizeResponseHeaders(response.headers);
  const rawText = await response.text();
  const parsed = parseResponseBody(rawText, headers["content-type"]);

  if (!response.ok) {
    return {
      ok: false,
      status,
      headers,
      data: parsed.data,
      raw: parsed.raw,
      error: BrokerError.http(`HTTP request failed with status ${status}`, {
        ...context,
        status,
        details: { body: parsed.data },
      }),
    };
  }

  return {
    ok: true,
    status,
    headers,
    data: parsed.data,
    raw: parsed.raw,
  };
}

function parseResponseBody(rawText, contentType) {
  if (rawText === "") {
    return { data: null, raw: "" };
  }

  const trimmed = rawText.trim();
  const looksJson = trimmed.startsWith("{") || trimmed.startsWith("[");
  const contentLooksJson = String(contentType ?? "").toLowerCase().includes("json");

  if (contentLooksJson || looksJson) {
    try {
      const data = JSON.parse(rawText);
      return { data, raw: data };
    } catch {
      return { data: rawText, raw: rawText };
    }
  }

  return { data: rawText, raw: rawText };
}

function serializeBody(body, bodyFormat, headers) {
  if (body === undefined) {
    return { body: undefined, headers };
  }

  if (bodyFormat === "json") {
    setHeaderIfMissing(headers, "Content-Type", "application/json");
    return { body: JSON.stringify(body), headers };
  }

  if (bodyFormat === "form") {
    assertFlatFormBody(body);
    setHeaderIfMissing(headers, "Content-Type", "application/x-www-form-urlencoded");
    return { body: new URLSearchParams(body).toString(), headers };
  }

  if (bodyFormat === "text") {
    return { body: String(body), headers };
  }

  if (bodyFormat === "raw") {
    return { body, headers };
  }

  throw new TypeError(`Unsupported bodyFormat: ${String(bodyFormat)}`);
}

function assertFlatFormBody(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new TypeError("Form body must be a flat object");
  }

  for (const [key, value] of Object.entries(body)) {
    const valueType = typeof value;
    const allowed =
      value === null ||
      valueType === "string" ||
      valueType === "number" ||
      valueType === "boolean";

    if (!allowed) {
      throw new TypeError(`Form body field must be scalar: ${key}`);
    }
  }
}

function setHeaderIfMissing(headers, key, value) {
  const hasHeader = Object.keys(headers).some((existingKey) => existingKey.toLowerCase() === key.toLowerCase());

  if (!hasHeader) {
    headers[key] = value;
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
