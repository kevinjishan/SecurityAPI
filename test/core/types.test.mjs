import assert from "node:assert/strict";
import test from "node:test";

import {
  BROKERS,
  BROKER_ENVIRONMENTS,
  REQUEST_OPERATIONS,
  assertBroker,
  assertBrokerEnvironment,
  assertRequestOperation,
  isBroker,
  isBrokerEnvironment,
  isRequestOperation,
} from "../../src/core/index.mjs";

test("defines supported broker, environment, and operation values", () => {
  assert.deepEqual(BROKERS, ["kiwoom", "ls", "db", "kis"]);
  assert.deepEqual(BROKER_ENVIRONMENTS, ["prod", "dev", "mock"]);
  assert.deepEqual(REQUEST_OPERATIONS, ["auth", "request", "revoke", "unknown"]);
});

test("checks core enum-like values", () => {
  assert.equal(isBroker("kiwoom"), true);
  assert.equal(isBroker("db"), true);
  assert.equal(isBroker("kis"), true);
  assert.equal(isBroker("bad"), false);
  assert.equal(isBrokerEnvironment("mock"), true);
  assert.equal(isBrokerEnvironment("stage"), false);
  assert.equal(isRequestOperation("auth"), true);
  assert.equal(isRequestOperation("order"), false);
});

test("asserts core enum-like values with BrokerError validation failures", () => {
  assert.equal(assertBroker("ls"), "ls");
  assert.equal(assertBrokerEnvironment("prod"), "prod");
  assert.equal(assertRequestOperation("request"), "request");

  assert.throws(() => assertBroker("bad"), { code: "VALIDATION_ERROR" });
  assert.throws(() => assertBrokerEnvironment("stage"), { code: "VALIDATION_ERROR" });
  assert.throws(() => assertRequestOperation("order"), { code: "VALIDATION_ERROR" });
});
