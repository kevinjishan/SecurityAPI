import { BrokerError, HttpClient, MemoryTokenStore, assertBroker, assertBrokerEnvironment } from "../core/index.mjs";
import { MetadataLookupError, createMetadataRegistry } from "../metadata/index.mjs";

export class BaseBrokerClient {
  constructor(broker, config = {}) {
    this.broker = assertBroker(broker);
    this.env = assertBrokerEnvironment(config.env ?? "prod");
    this.now = config.now ?? Date.now;
    this.tokenStore = config.tokenStore ?? new MemoryTokenStore({ now: this.now });
    this.http = config.httpClient ?? new HttpClient({
      fetch: config.fetch,
      defaultTimeoutMs: config.timeoutMs,
      defaultHeaders: config.defaultHeaders,
      retryPolicy: config.retryPolicy,
      sleep: config.sleep,
    });
    this.registryPromise = config.metadataRegistry
      ? Promise.resolve(config.metadataRegistry)
      : createMetadataRegistry({ manifestDir: config.manifestDir });
  }

  async getRegistry() {
    return this.registryPromise;
  }

  async getEntry(id) {
    const registry = await this.getRegistry();
    return registry.requireEntry(this.broker, id);
  }

  async getEndpoint(id, options = {}) {
    const registry = await this.getRegistry();
    return registry.getEndpoint(this.broker, id, { env: options.env ?? this.env });
  }

  successResponse(id, result, options = {}) {
    return {
      ok: true,
      broker: this.broker,
      id,
      data: result.data,
      raw: result.raw,
      headers: result.headers ?? {},
      status: result.status ?? 0,
      continuation: options.continuation,
    };
  }

  failureResponse(id, error, options = {}) {
    const brokerError = this.toBrokerError(error, options);

    return {
      ok: false,
      broker: this.broker,
      id,
      data: null,
      raw: options.raw ?? null,
      headers: options.headers ?? {},
      status: options.status ?? brokerError.status ?? 0,
      continuation: options.continuation,
      error: brokerError,
    };
  }

  toBrokerError(error, options = {}) {
    if (error instanceof BrokerError) {
      return error;
    }

    if (error instanceof MetadataLookupError) {
      if (error.code === "DOMAIN_NOT_CONFIGURED") {
        return BrokerError.config(error.message, {
          broker: this.broker,
          id: options.id ?? error.id,
          details: { env: error.env },
          cause: error,
        });
      }

      return BrokerError.validation(error.message, {
        broker: this.broker,
        id: options.id ?? error.id,
        cause: error,
      });
    }

    return BrokerError.unknown(error?.message ?? "Broker client failed", {
      broker: this.broker,
      id: options.id,
      cause: error,
    });
  }
}
