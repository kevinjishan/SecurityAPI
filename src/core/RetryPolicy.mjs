export class NoRetryPolicy {
  shouldRetry() {
    return false;
  }

  delayMs() {
    return 0;
  }
}

export class FixedRetryPolicy {
  constructor(options = {}) {
    this.maxRetries = Number.isInteger(options.maxRetries) ? options.maxRetries : 1;
    this.delay = Number.isFinite(options.delayMs) ? options.delayMs : 0;
    this.retryableCodes = new Set(options.retryableCodes ?? ["NETWORK_ERROR", "TIMEOUT", "HTTP_ERROR"]);
  }

  shouldRetry({ attempt, result, error, request }) {
    if (request?.context?.retryable === false) {
      return false;
    }

    if (attempt > this.maxRetries) {
      return false;
    }

    const candidate = error ?? result?.error;
    if (!candidate?.retryable) {
      return false;
    }

    return this.retryableCodes.has(candidate.code);
  }

  delayMs() {
    return this.delay;
  }
}

export const noRetryPolicy = new NoRetryPolicy();
