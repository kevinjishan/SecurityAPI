import { promises as fs } from "node:fs";
import path from "node:path";

const DEFAULT_MANIFEST_DIR = new URL("../../data/generated/", import.meta.url);
const BROKERS = ["kiwoom", "ls", "db", "kis"];
const CRYPTO_EXCHANGES = ["binance", "bingx", "bybit", "upbit", "bithumb", "coinone"];
const SOURCES = [...BROKERS, ...CRYPTO_EXCHANGES];
const SOURCE_SET = new Set(SOURCES);
const FIELD_LOCATIONS = new Set(["header", "body"]);
const FIELD_DIRECTIONS = new Set(["request", "response"]);

export class MetadataLookupError extends Error {
  constructor(code, message, options = {}) {
    super(message);
    this.name = "MetadataLookupError";
    this.code = code;
    this.broker = options.broker;
    this.id = options.id;
    this.env = options.env;
    this.cause = options.cause;
  }
}

export async function createMetadataRegistry(options = {}) {
  const manifests = options.manifests ?? (await loadGeneratedManifests(options));
  return new MetadataRegistry(manifests);
}

export async function loadGeneratedManifests(options = {}) {
  const manifestDir = normalizeManifestDir(options.manifestDir ?? DEFAULT_MANIFEST_DIR);

  return {
    kiwoom: await readManifest(manifestDir, "kiwoom-manifest.json"),
    ls: await readManifest(manifestDir, "ls-manifest.json"),
    db: await readManifest(manifestDir, "db-manifest.json"),
    kis: await readManifest(manifestDir, "kis-manifest.json"),
    ...createCryptoMetadataSeed(),
  };
}

export class MetadataRegistry {
  #manifests;

  constructor(manifests) {
    this.#manifests = normalizeManifests(manifests);
  }

  listBrokers() {
    return SOURCES.filter((broker) => this.#manifests[broker]);
  }

  getManifest(broker) {
    return this.#requireManifest(broker);
  }

  listApiIds(broker) {
    return Object.keys(this.#requireManifest(broker).apis).sort(compareText);
  }

  listApis(broker) {
    const manifest = this.#requireManifest(broker);
    return Object.values(manifest.apis)
      .map((entry) => ({
        broker: entry.broker,
        id: entry.id,
        name: entry.name,
        category: entry.category,
        group: entry.group ?? null,
        method: entry.method,
        path: entry.path,
        authRequired: entry.authRequired,
      }))
      .sort((a, b) => compareText(a.id, b.id));
  }

  has(broker, id) {
    return this.getEntry(broker, id) !== null;
  }

  getEntry(broker, id) {
    const manifest = this.#requireManifest(broker);
    return findEntry(manifest, id);
  }

  requireEntry(broker, id) {
    const manifest = this.#requireManifest(broker);
    const entry = findEntry(manifest, id);

    if (!entry) {
      throw new MetadataLookupError(
        "NOT_FOUND",
        `Unknown ${broker} API metadata id: ${String(id)}`,
        { broker, id: String(id) },
      );
    }

    return entry;
  }

  findById(id) {
    const matches = [];

    for (const broker of this.listBrokers()) {
      const entry = this.getEntry(broker, id);
      if (entry) {
        matches.push(entry);
      }
    }

    return matches;
  }

  getEndpoint(broker, id, options = {}) {
    const env = options.env ?? "prod";
    const entry = this.requireEntry(broker, id);
    const domain = resolveDomain(entry, env);

    return {
      broker: entry.broker,
      id: entry.id,
      env,
      method: entry.method,
      domain,
      path: entry.path,
      url: joinUrl(domain, entry.path),
      contentType: entry.contentType,
      requestFormat: entry.requestFormat,
      authRequired: entry.authRequired,
      rateLimit: entry.rateLimit ?? { perSecond: null, raw: null },
    };
  }

  getFields(broker, id, options = {}) {
    const location = options.location ?? "body";
    const direction = options.direction ?? "request";

    assertFieldLocation(location);
    assertFieldDirection(direction);

    const entry = this.requireEntry(broker, id);
    const fields = location === "header" ? entry.headers?.[direction] : entry.body?.[direction];
    const normalized = Array.isArray(fields) ? fields : [];

    if (options.required === undefined) {
      return normalized;
    }

    return normalized.filter((field) => Boolean(field.required) === Boolean(options.required));
  }

  getRequestFields(broker, id, options = {}) {
    return this.getFields(broker, id, { ...options, direction: "request" });
  }

  getResponseFields(broker, id, options = {}) {
    return this.getFields(broker, id, { ...options, direction: "response" });
  }

  getRequiredFields(broker, id, options = {}) {
    return this.getFields(broker, id, { ...options, required: true });
  }

  getContinuation(broker, id) {
    return this.requireEntry(broker, id).continuation ?? null;
  }

  isAuthRequired(broker, id) {
    return this.requireEntry(broker, id).authRequired;
  }

  getSourceRef(broker, id) {
    return this.requireEntry(broker, id).sourceRef;
  }

  #requireManifest(broker) {
    const normalizedBroker = assertSource(broker);
    const manifest = this.#manifests[normalizedBroker];

    if (!manifest) {
      throw new MetadataLookupError(
        "BROKER_NOT_LOADED",
        `Manifest is not loaded for broker: ${normalizedBroker}`,
        { broker: normalizedBroker },
      );
    }

    return manifest;
  }
}

function normalizeManifests(manifests) {
  const normalized = {};

  for (const broker of SOURCES) {
    if (!manifests?.[broker]) {
      continue;
    }

    const manifest = manifests[broker];
    if (manifest.broker !== broker) {
      throw new MetadataLookupError(
        "INVALID_MANIFEST",
        `Manifest broker mismatch for ${broker}`,
        { broker },
      );
    }

    if (!manifest.apis || typeof manifest.apis !== "object") {
      throw new MetadataLookupError(
        "INVALID_MANIFEST",
        `Manifest is missing apis index for ${broker}`,
        { broker },
      );
    }

    normalized[broker] = manifest;
  }

  return normalized;
}

function assertSource(source) {
  const normalized = String(source ?? "").trim().toLowerCase();

  if (!SOURCE_SET.has(normalized)) {
    throw new MetadataLookupError(
      "INVALID_BROKER",
      `Unsupported broker: ${String(source)}`,
      { broker: String(source) },
    );
  }

  return normalized;
}

function createCryptoMetadataSeed() {
  const docs = {
    binance: "https://www.binance.com/en/binance-api",
    bingx: "https://bingx-api.github.io/docs-v3/#/en/info",
    bybit: "https://bybit-exchange.github.io/docs/",
    upbit: "https://docs.upbit.com/kr",
    bithumb: "https://apidocs.bithumb.com/",
    coinone: "https://docs.coinone.co.kr/docs/about-public-api",
  };
  const manifests = {};

  for (const exchange of CRYPTO_EXCHANGES) {
    const apis = {};
    for (const product of ["spot", "futures"]) {
      const hasFutures = ["binance", "bingx", "bybit"].includes(exchange);
      if (product === "futures" && !hasFutures) continue;

      for (const id of cryptoIds(exchange, product)) {
        apis[id] = cryptoEntry(exchange, id, product, docs[exchange]);
      }
    }

    manifests[exchange] = {
      broker: exchange,
      generatedAt: "static-seed",
      source: {
        docsUrl: docs[exchange],
        rawFiles: [],
      },
      counts: {
        APIs: Object.keys(apis).length,
      },
      apis,
    };
  }

  return manifests;
}

function cryptoIds(exchange, product) {
  const prefix = `${exchange}.${product}`;
  return [
    `${prefix}.ticker`,
    `${prefix}.orderbook`,
    `${prefix}.candles`,
    `${prefix}.balance`,
    ...(product === "futures" ? [`${prefix}.positions`] : []),
    `${prefix}.order.preview`,
    `${prefix}.cancel.preview`,
    `${prefix}.ws.trade`,
    `${prefix}.ws.orderbook`,
  ];
}

function cryptoEntry(exchange, id, product, docsUrl) {
  const isWebSocket = id.includes(".ws.");
  const isPrivate = id.includes(".balance") || id.includes(".positions");
  const isOrderPreview = id.includes(".order.preview") || id.includes(".cancel.preview");

  return {
    broker: exchange,
    id,
    name: id,
    category: product === "spot" ? "cryptoSpot" : "cryptoFutures",
    method: isWebSocket ? "WEBSOCKET" : isOrderPreview ? "DRY_RUN" : "GET",
    domains: {
      prod: docsUrl,
      mock: docsUrl,
    },
    path: `/${id.replaceAll(".", "/")}`,
    contentType: "application/json",
    requestFormat: "json",
    authRequired: isPrivate,
    rateLimit: { perSecond: null, raw: null },
    headers: { request: [], response: [] },
    body: {
      request: [],
      response: [],
    },
    sourceRef: {
      rawFile: "static crypto metadata seed",
      rawId: id,
      url: docsUrl,
    },
  };
}

function findEntry(manifest, id) {
  const rawId = String(id ?? "").trim();
  if (!rawId) {
    return null;
  }

  const direct = manifest.apis[rawId] ?? manifest.apis[rawId.toLowerCase()];
  if (direct) {
    return direct;
  }

  return Object.entries(manifest.apis).find(([entryId]) => entryId.trim() === rawId)?.[1] ?? null;
}

function resolveDomain(entry, env) {
  const normalizedEnv = String(env ?? "prod").trim().toLowerCase();
  const domain = entry.domains?.[normalizedEnv];

  if (!domain) {
    throw new MetadataLookupError(
      "DOMAIN_NOT_CONFIGURED",
      `${entry.broker} ${entry.id} does not define a ${normalizedEnv} domain`,
      { broker: entry.broker, id: entry.id, env: normalizedEnv },
    );
  }

  return domain;
}

function joinUrl(domain, requestPath) {
  const trimmedDomain = String(domain).replace(/\/+$/, "");
  const normalizedPath = `/${String(requestPath ?? "").replace(/^\/+/, "")}`;
  return `${trimmedDomain}${normalizedPath}`;
}

function assertFieldLocation(location) {
  if (!FIELD_LOCATIONS.has(location)) {
    throw new MetadataLookupError(
      "INVALID_FIELD_LOCATION",
      `Unsupported field location: ${String(location)}`,
    );
  }
}

function assertFieldDirection(direction) {
  if (!FIELD_DIRECTIONS.has(direction)) {
    throw new MetadataLookupError(
      "INVALID_FIELD_DIRECTION",
      `Unsupported field direction: ${String(direction)}`,
    );
  }
}

function normalizeManifestDir(manifestDir) {
  if (manifestDir instanceof URL) {
    return manifestDir;
  }

  return path.resolve(String(manifestDir));
}

async function readManifest(manifestDir, fileName) {
  const filePath = resolveManifestPath(manifestDir, fileName);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    throw new MetadataLookupError(
      "MANIFEST_LOAD_FAILED",
      `Failed to load generated manifest: ${fileName}`,
      { cause: error },
    );
  }
}

function resolveManifestPath(manifestDir, fileName) {
  if (manifestDir instanceof URL) {
    return new URL(fileName, manifestDir);
  }

  return path.join(manifestDir, fileName);
}

function compareText(a, b) {
  return String(a).localeCompare(String(b), "en");
}
