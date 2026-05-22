import { BrokerError } from "./BrokerError.mjs";

export const BROKERS = Object.freeze(["kiwoom", "ls", "db", "kis"]);
export const BROKER_ENVIRONMENTS = Object.freeze(["prod", "dev", "mock"]);
export const REQUEST_OPERATIONS = Object.freeze(["auth", "request", "revoke", "unknown"]);

const BROKER_SET = new Set(BROKERS);
const BROKER_ENVIRONMENT_SET = new Set(BROKER_ENVIRONMENTS);
const REQUEST_OPERATION_SET = new Set(REQUEST_OPERATIONS);

export function isBroker(value) {
  return BROKER_SET.has(value);
}

export function isBrokerEnvironment(value) {
  return BROKER_ENVIRONMENT_SET.has(value);
}

export function isRequestOperation(value) {
  return REQUEST_OPERATION_SET.has(value);
}

export function assertBroker(value) {
  if (!isBroker(value)) {
    throw BrokerError.validation(`Unsupported broker: ${String(value)}`);
  }

  return value;
}

export function assertBrokerEnvironment(value) {
  if (!isBrokerEnvironment(value)) {
    throw BrokerError.validation(`Unsupported broker environment: ${String(value)}`);
  }

  return value;
}

export function assertRequestOperation(value) {
  if (!isRequestOperation(value)) {
    throw BrokerError.validation(`Unsupported request operation: ${String(value)}`);
  }

  return value;
}
