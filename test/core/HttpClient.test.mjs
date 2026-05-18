import assert from "node:assert/strict";
import test from "node:test";

import { BrokerError, FixedRetryPolicy, HttpClient, mergeHeaders, normalizeResponseHeaders } from "../../src/core/index.mjs";
import { HttpClient as HttpClientFromPackage } from "security-api-reference/core";

test("exports HttpClient through package core entry", () => {
  assert.equal(HttpClientFromPackage, HttpClient);
});

test("sends JSON requests and parses JSON responses", async () => {
  const calls = [];
  const client = new HttpClient({
    fetch: async (url, init) => {
      calls.push({ url, init });
      return jsonResponse({ ok: true }, { status: 200, headers: { "X-Next-Key": "abc" } });
    },
    defaultHeaders: { "User-Agent": "security-api-test" },
  });

  const result = await client.request({
    method: "POST",
    url: "https://example.test/api",
    headers: { Authorization: "Bearer token" },
    body: { stk_cd: "005930" },
    bodyFormat: "json",
    context: { broker: "kiwoom", id: "ka10001", operation: "request" },
  });

  assert.equal(result.ok, true);
  assert.equal(result.status, 200);
  assert.deepEqual(result.data, { ok: true });
  assert.deepEqual(result.raw, { ok: true });
  assert.equal(result.headers["content-type"], "application/json");
  assert.equal(result.headers["x-next-key"], "abc");
  assert.equal(calls[0].url, "https://example.test/api");
  assert.equal(calls[0].init.method, "POST");
  assert.equal(calls[0].init.headers["User-Agent"], "security-api-test");
  assert.equal(calls[0].init.headers.Authorization, "Bearer token");
  assert.equal(calls[0].init.headers["Content-Type"], "application/json");
  assert.equal(calls[0].init.body, JSON.stringify({ stk_cd: "005930" }));
});

test("sends form requests with scalar fields", async () => {
  const calls = [];
  const client = new HttpClient({
    fetch: async (url, init) => {
      calls.push({ url, init });
      return textResponse("ok");
    },
  });

  const result = await client.request({
    method: "POST",
    url: "https://example.test/token",
    bodyFormat: "form",
    body: {
      grant_type: "client_credentials",
      scope: "oob",
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.data, "ok");
  assert.equal(calls[0].init.headers["Content-Type"], "application/x-www-form-urlencoded");
  assert.equal(calls[0].init.body, "grant_type=client_credentials&scope=oob");
});

test("returns validation errors for nested form bodies", async () => {
  const client = new HttpClient({
    fetch: async () => {
      throw new Error("fetch should not be called");
    },
  });

  const result = await client.request({
    method: "POST",
    url: "https://example.test/token",
    bodyFormat: "form",
    body: { nested: { no: "thanks" } },
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 0);
  assert.equal(result.error.code, "VALIDATION_ERROR");
});

test("normalizes HTTP errors while preserving parsed body", async () => {
  const client = new HttpClient({
    fetch: async () => jsonResponse({ error: "bad" }, { status: 400 }),
  });

  const result = await client.request({
    method: "GET",
    url: "https://example.test/fail",
    context: { broker: "ls", id: "t1101", operation: "request" },
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 400);
  assert.deepEqual(result.data, { error: "bad" });
  assert.equal(result.error instanceof BrokerError, true);
  assert.equal(result.error.code, "HTTP_ERROR");
  assert.equal(result.error.retryable, false);
  assert.equal(result.error.broker, "ls");
});

test("normalizes network failures", async () => {
  const client = new HttpClient({
    fetch: async () => {
      throw new Error("socket closed");
    },
  });

  const result = await client.request({
    method: "GET",
    url: "https://example.test/network",
  });

  assert.equal(result.ok, false);
  assert.equal(result.status, 0);
  assert.equal(result.error.code, "NETWORK_ERROR");
  assert.equal(result.error.retryable, true);
});

test("normalizes timeout failures", async () => {
  const client = new HttpClient({
    timeoutMs: 5,
    fetch: (url, init) =>
      new Promise((resolve, reject) => {
        init.signal.addEventListener("abort", () => {
          reject(new DOMException("aborted", "AbortError"));
        });
      }),
  });

  const result = await client.request({
    method: "GET",
    url: "https://example.test/slow",
    timeoutMs: 5,
  });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "TIMEOUT");
  assert.equal(result.error.retryable, true);
});

test("retries according to retry policy", async () => {
  let count = 0;
  const client = new HttpClient({
    retryPolicy: new FixedRetryPolicy({ maxRetries: 1 }),
    fetch: async () => {
      count += 1;
      if (count === 1) {
        return jsonResponse({ error: "temporary" }, { status: 503 });
      }
      return jsonResponse({ ok: true }, { status: 200 });
    },
  });

  const result = await client.request({
    method: "GET",
    url: "https://example.test/retry",
  });

  assert.equal(count, 2);
  assert.equal(result.ok, true);
  assert.deepEqual(result.data, { ok: true });
});

test("does not retry when context retryable is false", async () => {
  let count = 0;
  const client = new HttpClient({
    retryPolicy: new FixedRetryPolicy({ maxRetries: 2 }),
    fetch: async () => {
      count += 1;
      return jsonResponse({ error: "temporary" }, { status: 503 });
    },
  });

  const result = await client.request({
    method: "GET",
    url: "https://example.test/order",
    context: { retryable: false },
  });

  assert.equal(count, 1);
  assert.equal(result.ok, false);
});

test("merges headers case-insensitively and normalizes response headers", () => {
  assert.deepEqual(
    mergeHeaders(
      { "Content-Type": "application/json", "X-Test": "a" },
      { "content-type": "text/plain", Authorization: "Bearer token" },
    ),
    { "X-Test": "a", "content-type": "text/plain", Authorization: "Bearer token" },
  );

  assert.deepEqual(
    normalizeResponseHeaders(new Headers({ "X-Test": "yes", "Content-Type": "text/plain" })),
    { "content-type": "text/plain", "x-test": "yes" },
  );
});

function jsonResponse(body, options = {}) {
  return new Response(JSON.stringify(body), {
    status: options.status ?? 200,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });
}

function textResponse(body, options = {}) {
  return new Response(body, {
    status: options.status ?? 200,
    headers: options.headers ?? { "content-type": "text/plain" },
  });
}
