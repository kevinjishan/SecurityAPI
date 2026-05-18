export const BROKER_ERROR_CODES = Object.freeze({
  HTTP_ERROR: "HTTP_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
  AUTH_ERROR: "AUTH_ERROR",
  API_ERROR: "API_ERROR",
  CONFIG_ERROR: "CONFIG_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNSUPPORTED_CAPABILITY: "UNSUPPORTED_CAPABILITY",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
});

export class BrokerError extends Error {
  constructor(message, options = {}) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = "BrokerError";
    this.code = options.code ?? BROKER_ERROR_CODES.UNKNOWN_ERROR;
    this.broker = options.broker;
    this.id = options.id;
    this.operation = options.operation;
    this.status = options.status;
    this.retryable = Boolean(options.retryable);
    this.details = options.details;
  }

  static http(message, options = {}) {
    const status = Number(options.status ?? 0);

    return new BrokerError(message ?? `HTTP request failed with status ${status}`, {
      ...options,
      code: BROKER_ERROR_CODES.HTTP_ERROR,
      retryable: options.retryable ?? status >= 500,
    });
  }

  static network(message, options = {}) {
    return new BrokerError(message ?? "Network request failed", {
      ...options,
      code: BROKER_ERROR_CODES.NETWORK_ERROR,
      status: options.status ?? 0,
      retryable: options.retryable ?? true,
    });
  }

  static timeout(message, options = {}) {
    return new BrokerError(message ?? "Request timed out", {
      ...options,
      code: BROKER_ERROR_CODES.TIMEOUT,
      status: options.status ?? 0,
      retryable: options.retryable ?? true,
    });
  }

  static auth(message, options = {}) {
    return new BrokerError(message ?? "Authentication failed", {
      ...options,
      code: BROKER_ERROR_CODES.AUTH_ERROR,
      retryable: options.retryable ?? false,
    });
  }

  static api(message, options = {}) {
    return new BrokerError(message ?? "Broker API returned an error", {
      ...options,
      code: BROKER_ERROR_CODES.API_ERROR,
      retryable: options.retryable ?? false,
    });
  }

  static config(message, options = {}) {
    return new BrokerError(message ?? "SDK configuration is invalid", {
      ...options,
      code: BROKER_ERROR_CODES.CONFIG_ERROR,
      retryable: options.retryable ?? false,
    });
  }

  static validation(message, options = {}) {
    return new BrokerError(message ?? "Request validation failed", {
      ...options,
      code: BROKER_ERROR_CODES.VALIDATION_ERROR,
      retryable: options.retryable ?? false,
    });
  }

  static unsupported(message, options = {}) {
    return new BrokerError(message ?? "Capability is not supported", {
      ...options,
      code: BROKER_ERROR_CODES.UNSUPPORTED_CAPABILITY,
      retryable: options.retryable ?? false,
    });
  }

  static unknown(message, options = {}) {
    return new BrokerError(message ?? "Unknown SDK error", {
      ...options,
      code: BROKER_ERROR_CODES.UNKNOWN_ERROR,
      retryable: options.retryable ?? false,
    });
  }
}
