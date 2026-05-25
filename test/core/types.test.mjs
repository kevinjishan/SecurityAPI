import assert from "node:assert/strict";
import test from "node:test";

import {
  BROKERS,
  BROKER_ENVIRONMENTS,
  CRYPTO_EXCHANGES,
  REQUEST_OPERATIONS,
  assertBroker,
  assertBrokerEnvironment,
  assertCryptoExchange,
  assertRequestOperation,
  isBroker,
  isBrokerEnvironment,
  isCryptoExchange,
  isRequestOperation,
} from "../../src/core/index.mjs";

test("defines supported broker, environment, and operation values", () => {
  assert.deepEqual(BROKERS, ["kiwoom", "ls", "db", "kis"]);
  assert.deepEqual(CRYPTO_EXCHANGES, ["binance", "bingx", "bybit", "upbit", "bithumb", "coinone"]);
  assert.deepEqual(BROKER_ENVIRONMENTS, ["prod", "dev", "mock"]);
  assert.deepEqual(REQUEST_OPERATIONS, ["auth", "request", "revoke", "unknown"]);
});

test("checks core enum-like values", () => {
  assert.equal(isBroker("kiwoom"), true);
  assert.equal(isBroker("db"), true);
  assert.equal(isBroker("kis"), true);
  assert.equal(isCryptoExchange("binance"), true);
  assert.equal(isCryptoExchange("upbit"), true);
  assert.equal(isCryptoExchange("kiwoom"), false);
  assert.equal(isBroker("bad"), false);
  assert.equal(isBrokerEnvironment("mock"), true);
  assert.equal(isBrokerEnvironment("stage"), false);
  assert.equal(isRequestOperation("auth"), true);
  assert.equal(isRequestOperation("order"), false);
});

test("asserts core enum-like values with BrokerError validation failures", () => {
  assert.equal(assertBroker("ls"), "ls");
  assert.equal(assertCryptoExchange("bybit"), "bybit");
  assert.equal(assertBrokerEnvironment("prod"), "prod");
  assert.equal(assertRequestOperation("request"), "request");

  assert.throws(() => assertBroker("bad"), { code: "VALIDATION_ERROR" });
  assert.throws(() => assertCryptoExchange("kiwoom"), { code: "VALIDATION_ERROR" });
  assert.throws(() => assertBrokerEnvironment("stage"), { code: "VALIDATION_ERROR" });
  assert.throws(() => assertRequestOperation("order"), { code: "VALIDATION_ERROR" });
});
