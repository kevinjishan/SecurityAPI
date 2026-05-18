import assert from "node:assert/strict";
import test from "node:test";

import { BrokerError, BROKER_ERROR_CODES } from "../../src/core/index.mjs";
import { BrokerError as BrokerErrorFromPackage } from "security-api-reference/core";

test("exports BrokerError through package core entry", () => {
  assert.equal(BrokerErrorFromPackage, BrokerError);
});

test("creates retryable HTTP errors for 5xx responses", () => {
  const error = BrokerError.http("server failed", {
    broker: "kiwoom",
    id: "ka10001",
    operation: "request",
    status: 503,
  });

  assert.equal(error.name, "BrokerError");
  assert.equal(error.code, BROKER_ERROR_CODES.HTTP_ERROR);
  assert.equal(error.broker, "kiwoom");
  assert.equal(error.id, "ka10001");
  assert.equal(error.operation, "request");
  assert.equal(error.status, 503);
  assert.equal(error.retryable, true);
});

test("creates non-retryable validation and auth errors", () => {
  assert.equal(BrokerError.validation("bad request").retryable, false);
  assert.equal(BrokerError.auth("bad token").retryable, false);
});

test("preserves cause without exposing secrets in details", () => {
  const cause = new Error("low-level failure");
  const error = BrokerError.network("network failed", {
    cause,
    details: { url: "https://example.test" },
  });

  assert.equal(error.cause, cause);
  assert.deepEqual(error.details, { url: "https://example.test" });
});
