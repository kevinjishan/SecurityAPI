export class MemoryTokenStore {
  constructor(options = {}) {
    this.now = options.now ?? Date.now;
    this.expirationSkewMs = options.expirationSkewMs ?? 30_000;
    this.tokens = new Map();
  }

  set(key, token) {
    const normalizedKey = normalizeKey(key);
    const normalizedToken = normalizeToken(token);
    this.tokens.set(normalizedKey, normalizedToken);
    return normalizedToken;
  }

  get(key) {
    const normalizedKey = normalizeKey(key);
    const token = this.tokens.get(normalizedKey);

    if (!token) {
      return null;
    }

    if (this.isExpired(token)) {
      this.tokens.delete(normalizedKey);
      return null;
    }

    return token;
  }

  peek(key) {
    return this.tokens.get(normalizeKey(key)) ?? null;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.tokens.delete(normalizeKey(key));
  }

  clear() {
    this.tokens.clear();
  }

  isExpired(token) {
    if (!Number.isFinite(token?.expiresAt)) {
      return false;
    }

    return token.expiresAt - this.expirationSkewMs <= this.now();
  }
}

export const TokenStore = MemoryTokenStore;

function normalizeKey(key) {
  const normalized = String(key ?? "").trim();

  if (!normalized) {
    throw new TypeError("TokenStore key is required");
  }

  return normalized;
}

function normalizeToken(token) {
  if (!token || typeof token !== "object") {
    throw new TypeError("Token object is required");
  }

  const accessToken = String(token.accessToken ?? "").trim();
  if (!accessToken) {
    throw new TypeError("Token accessToken is required");
  }

  return {
    accessToken,
    tokenType: token.tokenType ?? "Bearer",
    expiresAt: Number.isFinite(token.expiresAt) ? token.expiresAt : null,
    raw: token.raw,
  };
}
