import { BrokerError, assertBroker, assertCryptoExchange, isBroker, isCryptoExchange } from "../core/index.mjs";
import { createMetadataRegistry } from "../metadata/index.mjs";
import { CAPABILITY_DEFINITIONS, getCapabilityDefinition } from "./definitions.mjs";
import { KIWOOM_CAPABILITIES } from "./kiwoom.mjs";
import { LS_CAPABILITIES } from "./ls.mjs";
import { DB_CAPABILITIES } from "./db.mjs";
import { KIS_CAPABILITIES } from "./kis.mjs";
import { CRYPTO_CAPABILITIES } from "./crypto.mjs";

const BROKER_CAPABILITIES = Object.freeze({
  kiwoom: KIWOOM_CAPABILITIES,
  ls: LS_CAPABILITIES,
  db: DB_CAPABILITIES,
  kis: KIS_CAPABILITIES,
  ...CRYPTO_CAPABILITIES,
});

export const CAPABILITY_STATUSES = Object.freeze({
  SERVICE_READY: "serviceReady",
  METADATA_ONLY: "metadataOnly",
  PARKED: "parked",
  COMPOSED: "composed",
});

const SERVICE_READY_STATUSES = new Set([
  CAPABILITY_STATUSES.SERVICE_READY,
  CAPABILITY_STATUSES.COMPOSED,
]);

const METADATA_STATUSES = new Set([
  CAPABILITY_STATUSES.SERVICE_READY,
  CAPABILITY_STATUSES.METADATA_ONLY,
  CAPABILITY_STATUSES.PARKED,
]);

export class BrokerCapabilities {
  constructor(broker, capabilities) {
    this.broker = assertCapabilitySource(broker);
    this.capabilities = capabilities.map((capability) => enrichCapability(this.broker, capability));
    this.byId = new Map(this.capabilities.map((capability) => [capability.id, capability]));
  }

  list(options = {}) {
    return clone(this.capabilities.filter((capability) => matchesStatusFilter(capability, options)));
  }

  listIds(options = {}) {
    return this.list(options).map((capability) => capability.id);
  }

  get(capabilityId, options = {}) {
    const capability = this.byId.get(capabilityId) ?? null;
    if (!capability || !matchesStatusFilter(capability, options)) {
      return null;
    }

    return clone(capability);
  }

  require(capabilityId) {
    const capability = this.get(capabilityId);

    if (!capability || !isServiceReadyCapability(capability)) {
      throw BrokerError.unsupported(`${this.broker} does not have service-ready capability: ${capabilityId}`, {
        broker: this.broker,
        details: {
          capabilityId,
          status: capability?.status ?? null,
        },
      });
    }

    return capability;
  }

  supports(capabilityId) {
    return matchingCapabilities(this.capabilities, capabilityId).some(isServiceReadyCapability);
  }

  hasMetadata(capabilityId) {
    return matchingCapabilities(this.capabilities, capabilityId).some(hasMetadataCapability);
  }

  findApis(capabilityId, options = {}) {
    const capabilities = matchingCapabilities(this.capabilities, capabilityId)
      .filter((capability) => matchesStatusFilter(capability, options));
    const refs = [];

    for (const capability of capabilities) {
      for (const api of capability.apis) {
        refs.push({
          ...api,
          broker: this.broker,
          capabilityId: capability.id,
          capabilityStatus: capability.status,
        });
      }
    }

    return dedupeRefs(refs);
  }

  toJSON() {
    return {
      broker: this.broker,
      capabilities: this.list(),
    };
  }
}

export function getCapabilities(broker) {
  const normalizedBroker = assertCapabilitySource(broker);
  return new BrokerCapabilities(normalizedBroker, BROKER_CAPABILITIES[normalizedBroker] ?? []);
}

export function listCapabilityDefinitions() {
  return clone(CAPABILITY_DEFINITIONS);
}

export function listCapabilityIds(broker, options = {}) {
  return getCapabilities(broker).listIds(options);
}

export async function validateCapabilityReferences(options = {}) {
  const metadataRegistry = options.metadataRegistry ?? (await createMetadataRegistry(options));
  const brokers = options.broker ? [assertCapabilitySource(options.broker)] : Object.keys(BROKER_CAPABILITIES);
  const missing = [];
  let checked = 0;

  for (const broker of brokers) {
    for (const capability of getCapabilities(broker).list()) {
      for (const api of capability.apis) {
        checked += 1;
        if (!metadataRegistry.has(broker, api.id)) {
          missing.push({
            broker,
            capabilityId: capability.id,
            apiId: api.id,
          });
        }
      }
    }
  }

  return {
    ok: missing.length === 0,
    checked,
    missing,
  };
}

function assertCapabilitySource(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (isBroker(normalized)) {
    return assertBroker(normalized);
  }
  if (isCryptoExchange(normalized)) {
    return assertCryptoExchange(normalized);
  }
  throw BrokerError.validation(`Unsupported capability source: ${String(value)}`);
}

export async function assertCapabilityReferences(options = {}) {
  const result = await validateCapabilityReferences(options);

  if (!result.ok) {
    throw BrokerError.validation("Capability references include unknown manifest APIs", {
      details: result,
    });
  }

  return result;
}

function enrichCapability(broker, capability) {
  const definition = getCapabilityDefinition(capability.id);
  const status = capability.status ?? CAPABILITY_STATUSES.METADATA_ONLY;

  return {
    broker,
    id: capability.id,
    area: definition?.area ?? capability.id.split(".")[0],
    label: definition?.label ?? capability.id,
    status,
    serviceReady: SERVICE_READY_STATUSES.has(status),
    metadataAvailable: METADATA_STATUSES.has(status) && (capability.apis?.length ?? 0) > 0,
    apis: capability.apis ?? [],
    caution: capability.caution,
  };
}

function isServiceReadyCapability(capability) {
  return SERVICE_READY_STATUSES.has(capability.status);
}

function hasMetadataCapability(capability) {
  return METADATA_STATUSES.has(capability.status) && capability.apis.length > 0;
}

function matchesStatusFilter(capability, options = {}) {
  const statuses = normalizeStatusFilter(options);
  return !statuses || statuses.has(capability.status);
}

function normalizeStatusFilter(options = {}) {
  if (options.statuses) {
    return new Set(Array.isArray(options.statuses) ? options.statuses : [options.statuses]);
  }

  if (options.status) {
    return new Set([options.status]);
  }

  return null;
}

function matchingCapabilities(capabilities, capabilityId) {
  const normalizedId = String(capabilityId ?? "").trim();
  if (!normalizedId) {
    return [];
  }

  return capabilities.filter(
    (capability) => capability.id === normalizedId || capability.id.startsWith(`${normalizedId}.`),
  );
}

function dedupeRefs(refs) {
  const seen = new Set();
  const deduped = [];

  for (const ref of refs) {
    const key = `${ref.broker}:${ref.capabilityId}:${ref.id}:${ref.role}:${ref.transport}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(ref);
  }

  return deduped;
}

function clone(value) {
  return value === null ? null : JSON.parse(JSON.stringify(value));
}
