# Metadata rate policy

`resolveRequestRatePolicy(entry, options)` converts a complete registry entry's `rateLimit.perSecond` into a minimum request interval. Obtain the entry with `registry.requireEntry(broker, id)`; `listApis()` is a discovery summary and does not carry all rate metadata.

```js
import { createMetadataRegistry, resolveRequestRatePolicy } from "../src/index.mjs";
const registry = await createMetadataRegistry();
const policy = resolveRequestRatePolicy(registry.requireEntry("ls", "t8410"), {
  localFloorMs: 1100,
  safetyMarginMs: 100,
  unknownGapMs: 1100,
});
// metadata 1/s -> 1000ms + 100ms -> effectiveGapMs 1100
```

The interval is `max(localFloorMs, ceil(1000 / perSecond) + safetyMarginMs)`. If the numeric rate is absent/null, an explicit positive `unknownGapMs` is required and its interval also includes the safety margin. Unknown metadata is never interpreted as unlimited. Invalid numeric rates, unsafe intervals and invalid options are rejected.

This is a pure policy function. Apply its result at the existing shared admission controller for the actual credential identity. Keep global spacing, per-TR boundaries, failures, continuation pages and restarts in that controller's durable state. Independent timers in each client cannot coordinate separate processes or hosts, so this helper does not install a client-private queue.

`source` distinguishes SDK metadata from an explicit local fallback. `brokerQuotaVerified` is always false: mathematical interpretation does not prove that a snapshot is current, nor establish undocumented account/app-key/IP/session limits. Local job budgets, authentication cooldowns, cancellation, HTTP deadlines and retries remain separate policies. This function performs no HTTP, token issuance, order transmission or automatic retry.
