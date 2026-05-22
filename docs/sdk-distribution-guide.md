# SDK Distribution Guide

Last updated: 2026-05-19

이 문서는 SecurityAPI SDK를 다른 서버나 앱에서 Git dependency, local path dependency, 또는 향후 registry package로 참조할 때 필요한 배포 기준을 정리한다.

## Current Policy

| Item | Policy |
| --- | --- |
| Package name | `security-api-reference` |
| Module format | ESM, `type: "module"` |
| Node version | `>=20` |
| Public package status | `private: true`; public npm publish 대상 아님 |
| Primary install mode | GitHub dependency or local path dependency |
| Lockfile | `package-lock.json` is committed for reproducible validation |
| Included package files | Controlled by `package.json#files` |
| Secrets | Never package or commit `.env` |

## Package Contents

The SDK package intentionally includes only runtime SDK files, generated manifests, and core integration docs.

Included:

- `src/`
- `data/generated/`
- `README.md`
- selected docs:
  - `docs/README.md`
  - `docs/sdk-usage-guide.md`
  - `docs/public-sdk-contract.md`
  - `docs/live-readonly-verification-matrix.md`
  - `docs/live-readonly-verification-plan.md`
  - `docs/live-integration-readiness.md`
  - `docs/order-guard-verification-plan.md`
  - `docs/broker-error-reject-policy.md`
  - `docs/production-readiness-checklist.md`

Excluded from package:

- `.env`
- `node_modules/`
- `data/raw/`
- generated per-API Markdown docs under `docs/kiwoom/`, `docs/ls/`, `docs/db/`, and `docs/kis/`
- tests
- examples
- scripts

Rationale:

- Runtime SDK imports need `src/` and `data/generated/`.
- AI/reference docs remain in the repository, but package consumers do not need the full raw snapshot or every per-API Markdown file.
- Smaller packages reduce install time and lower the chance of accidentally shipping local artifacts.

## Install From GitHub

External app `package.json`:

```json
{
  "dependencies": {
    "security-api-reference": "github:kevinjishan/SecurityAPI"
  }
}
```

Install:

```bash
npm install
```

For a stable production app, pin a commit SHA after validation:

```json
{
  "dependencies": {
    "security-api-reference": "github:kevinjishan/SecurityAPI#<commit-sha>"
  }
}
```

## Install From Local Path

Use this for same-server development before pushing.

```json
{
  "dependencies": {
    "security-api-reference": "file:../SecurityAPI"
  }
}
```

Then:

```bash
npm install
```

## Import Smoke Test

Run this in the consuming app after install.

```bash
node --input-type=module - <<'NODE'
import { DbClient, KiwoomClient, KisClient, LsClient, QuoteService, getCapabilities } from "security-api-reference";
import { createMetadataRegistry } from "security-api-reference/metadata";
import { WebSocketBrokerClient } from "security-api-reference/adapters";
import { BrokerError } from "security-api-reference/core";
import { AccountService } from "security-api-reference/services";

const registry = await createMetadataRegistry();
const entry = registry.requireEntry("ls", "t1101");
const kisEntry = registry.requireEntry("kis", "/uapi/domestic-stock/v1/quotations/inquire-price");
const caps = getCapabilities("kis");

console.log(JSON.stringify({
  ok: true,
  imports: [
    Boolean(KiwoomClient),
    Boolean(LsClient),
    Boolean(DbClient),
    Boolean(KisClient),
    Boolean(QuoteService),
    Boolean(WebSocketBrokerClient),
    Boolean(BrokerError),
    Boolean(AccountService)
  ],
  entry: entry.id,
  kisEntry: kisEntry.id,
  supportsQuote: caps.supports("quote.domesticStock.currentPrice")
}));
NODE
```

Expected:

```json
{"ok":true,"imports":[true,true,true,true,true,true,true,true],"entry":"t1101","kisEntry":"/uapi/domestic-stock/v1/quotations/inquire-price","supportsQuote":true}
```

## Pack Dry-run

Before using a new SDK revision from another app:

```bash
npm pack --dry-run
```

Current expected shape:

| Metric | Expected |
| --- | ---: |
| Total files | about 72 |
| Package size | about 2.6 MB |
| Unpacked size | about 36 MB |

The package is large mainly because generated broker manifests are included, especially LS and DB. This is intentional because runtime metadata lookup depends on `data/generated/`.

## Verified Distribution Checks

The following checks were run on 2026-05-19.

| Check | Result |
| --- | --- |
| `npm pack --dry-run` | pass; package contents reduced to runtime SDK + generated manifests + selected docs |
| local path install from `/Users/kevinchoi/Documents/SecurityAPI` | pass |
| GitHub dependency install from `github:kevinjishan/SecurityAPI` | pass against current remote HEAD at test time |
| packaged tarball install from `/tmp/security-api-reference-1.0.0.tgz` | pass |
| public entry imports | pass |
| metadata registry lookup from installed package | pass |

Note: GitHub dependency tests validate the currently pushed commit. If local distribution-related changes are not pushed yet, use local path or packed tarball tests to validate the pending package shape.

## Consumer App Runtime Requirements

Consumer apps must provide secrets through their own environment or secret manager.

Required for live broker calls:

```bash
KIWOOM_APP_KEY=
KIWOOM_SECRET_KEY=
KIWOOM_ENV=prod

LS_APP_KEY=
LS_APP_SECRET_KEY=
LS_ENV=prod

DB_APP_KEY=
DB_APP_SECRET_KEY=
DB_ENV=prod

KIS_APP_KEY=
KIS_APP_SECRET_KEY=
KIS_ENV=prod
KIS_CUSTOMER_TYPE=P
```

Optional:

```bash
LS_MAC_ADDRESS=
DB_MAC_ADDRESS=
```

Read-only live guard:

```bash
SECURITY_API_LIVE_READONLY=true
SECURITY_API_ALLOW_LIVE_ORDER=false
```

Never ship real `.env` values inside the SDK package or a consumer app repository.

## Release Checklist

Before pointing another server/app at a new commit:

1. Run `npm run validate:all`.
2. Run `npm pack --dry-run`.
3. Verify package file count and contents are expected.
4. Install from local path or packed tarball in a temporary consumer project.
5. Run the import smoke test.
6. Push the SDK commit.
7. Update the consumer dependency to `github:kevinjishan/SecurityAPI#<commit-sha>`.
8. Run the consumer app's own test suite.

## Future Registry Publishing

If this moves from Git dependency to a private registry or public npm package:

- Decide whether `private` should remain `true`.
- Add an explicit license file and registry policy.
- Add `publishConfig` for private registry publishing.
- Add a package-level release tag policy.
- Keep `files` restrictive.
- Keep generated manifests included unless metadata loading is redesigned.
