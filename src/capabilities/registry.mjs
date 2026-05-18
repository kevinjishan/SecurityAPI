import { BrokerError, assertBroker } from "../core/index.mjs";
import { createMetadataRegistry } from "../metadata/index.mjs";
import { CAPABILITY_DEFINITIONS, getCapabilityDefinition } from "./definitions.mjs";
import { KIWOOM_CAPABILITIES } from "./kiwoom.mjs";
import { LS_CAPABILITIES } from "./ls.mjs";

const BROKER_CAPABILITIES = Object.freeze({
  kiwoom: KIWOOM_CAPABILITIES,
  ls: LS_CAPABILITIES,
});

export class BrokerCapabilities {
  constructor(broker, capabilities) {
    this.broker = assertBroker(broker);
    this.capabilities = capabilities.map((capability) => enrichCapability(this.broker, capability));
    this.byId = new Map(this.capabilities.map((capability) => [capability.id, capability]));
  }

  list() {
    return clone(this.capabilities);
  }

  listIds() {
    return this.capabilities.map((capability) => capability.id);
  }

  get(capabilityId) {
    return clone(this.byId.get(capabilityId) ?? null);
  }

  require(capabilityId) {
    const capability = this.get(capabilityId);

    if (!capability) {
      throw BrokerError.unsupported(`${this.broker} does not support capability: ${capabilityId}`, {
        broker: this.broker,
        details: { capabilityId },
      });
    }

    return capability;
  }

  supports(capabilityId) {
    return matchingCapabilities(this.capabilities, capabilityId).length > 0;
  }

  findApis(capabilityId, options = {}) {
    const capabilities = matchingCapabilities(this.capabilities, capabilityId);
    const refs = [];

    for (const capability of capabilities) {
      if (options.status && capability.status !== options.status) {
        continue;
      }

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
  const normalizedBroker = assertBroker(broker);
  return new BrokerCapabilities(normalizedBroker, BROKER_CAPABILITIES[normalizedBroker] ?? []);
}

export function listCapabilityDefinitions() {
  return clone(CAPABILITY_DEFINITIONS);
}

export function listCapabilityIds(broker) {
  return getCapabilities(broker).listIds();
}

export async function validateCapabilityReferences(options = {}) {
  const metadataRegistry = options.metadataRegistry ?? (await createMetadataRegistry(options));
  const brokers = options.broker ? [assertBroker(options.broker)] : Object.keys(BROKER_CAPABILITIES);
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

  return {
    broker,
    id: capability.id,
    area: definition?.area ?? capability.id.split(".")[0],
    label: definition?.label ?? capability.id,
    status: capability.status ?? "documented",
    apis: capability.apis ?? [],
    caution: capability.caution,
  };
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
