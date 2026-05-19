# Live Read-only Verification Audit - 2026-05-19

## Summary

- Goal: 주문 없는 live read-only example을 실제 서버에서 실행할 준비가 되었는지 점검한다.
- Result: `blocked`.
- Reason: 현재 쉘에 live read-only 실행에 필요한 증권사 환경변수가 설정되어 있지 않다.
- Network calls: not executed.
- Order calls: not executed.
- Sensitive data: no secret value was printed; only missing/present status is recorded.

## Guard Status

| Guard | Required | Observed | Result |
| --- | --- | --- | --- |
| `SECURITY_API_LIVE_READONLY` | `true` | enabled in explicit preflight | pass |
| `SECURITY_API_ALLOW_LIVE_ORDER` | not `true` | missing/disabled | pass |
| required broker secrets | present | missing | blocked |

## Required Environment

| Broker | Name | Status |
| --- | --- | --- |
| Kiwoom | `KIWOOM_APP_KEY` | missing |
| Kiwoom | `KIWOOM_SECRET_KEY` | missing |
| LS | `LS_APP_KEY` | missing |
| LS | `LS_APP_SECRET_KEY` | missing |
| LS | `LS_MAC_ADDRESS` | missing, optional for individual read-only verification |

Optional environment values were also absent in the current shell: `KIWOOM_ENV`, `LS_ENV`, `LS_MAC_ADDRESS`, `SECURITY_API_REALTIME_WAIT_MS`.

## Execution Order

These scripts are the intended live read-only order once the guard and secrets are configured. The order starts with authentication, then public quote reads, then account reads, and leaves realtime subscription checks near the end.

| Step | Command | Scope | Status |
| ---: | --- | --- | --- |
| 1 | `node examples/live-readonly/auth-only.mjs` | Kiwoom/LS token issue only | not run |
| 2 | `node examples/live-readonly/kiwoom-domestic-quote.mjs` | Kiwoom domestic quote/candle/index/flow | not run |
| 3 | `node examples/live-readonly/ls-domestic-quote.mjs` | LS domestic quote/candle/index/flow | not run |
| 4 | `node examples/live-readonly/ls-overseas-quote.mjs` | LS overseas quote/order book/info/candles | not run |
| 5 | `node examples/live-readonly/ls-overseas-realtime.mjs` | LS overseas realtime trade/order book subscription | not run |
| 6 | `node examples/live-readonly/account-readonly.mjs` | Kiwoom/LS cash and balance read-only account queries | not run |

## Commands Run

```bash
env | rg '^(SECURITY_API|KIWOOM|LS_)'
npm run examples:live-readonly:preflight
SECURITY_API_LIVE_READONLY=true SECURITY_API_ALLOW_LIVE_ORDER=false npm run examples:live-readonly:preflight
npm run examples:live-readonly:validate
npm run validate:docs
npm run validate:all
```

## Validation Result

- `npm run examples:live-readonly:preflight`: blocked as expected with exit code `2` because live read-only was disabled and required secrets were missing.
- `SECURITY_API_LIVE_READONLY=true SECURITY_API_ALLOW_LIVE_ORDER=false npm run examples:live-readonly:preflight`: blocked as expected with exit code `2` because required secrets were missing.
- `npm run examples:live-readonly:validate`: passed.
- `npm run validate:docs`: passed.
- `npm run validate:all`: passed.

The validate-only run produced skipped result records with `sensitiveDataMasked: yes` and the note `validate-only mode; no broker network calls are made`.

## Decision

The examples are executable from a code and validation perspective, but this machine is not ready for real live read-only calls until the required secrets and `SECURITY_API_LIVE_READONLY=true` are provided in the local shell or process environment.

Do not run live examples with account read scenarios until the operator confirms the account is allowed for read-only verification and the output destination is private.

## Follow-up Attempt - 2026-05-19T08:37:41Z

### Goal

Verify whether this server can safely run the live read-only examples with real secrets, then run only `auth-only` and public quote examples if preflight passes.

### Preflight Command

```bash
SECURITY_API_LIVE_READONLY=true SECURITY_API_ALLOW_LIVE_ORDER=false npm run examples:live-readonly:preflight
```

### Preflight Result

- Result: `blocked`.
- Exit code: `2`.
- SDK commit: `c20761a`.
- `SECURITY_API_LIVE_READONLY`: enabled.
- `SECURITY_API_ALLOW_LIVE_ORDER`: disabled.
- Missing required env: `KIWOOM_APP_KEY`, `KIWOOM_SECRET_KEY`, `LS_APP_KEY`, `LS_APP_SECRET_KEY`, `LS_MAC_ADDRESS`.
- Real API calls: not executed.
- Order API calls: not executed.
- Account read API calls: not executed.

### Execution Decision

`auth-only`, `kiwoom-domestic-quote`, `ls-domestic-quote`, and `ls-overseas-quote` were not run because preflight did not pass. This is the intended safe behavior.

## MAC Address Requirement Correction - 2026-05-19

LS API 신청 항목에 MAC address 입력이 없고, 공식 문서의 `mac_address` 설명이 "법인인 경우 필수 세팅"으로 되어 있어 `LS_MAC_ADDRESS`를 live read-only 전역 필수값에서 제외했다.

Updated behavior:

- `LS_MAC_ADDRESS` is optional for individual read-only verification.
- If provided, SDK still sends it as `mac_address`.
- If absent, SDK omits the header instead of blocking before network calls.
- Order/account-sensitive live verification remains gated separately by scenario guard and operator approval.

## Live Public Read-only Run - 2026-05-19T09:00:34Z

### Environment

- `SECURITY_API_LIVE_READONLY`: enabled.
- `SECURITY_API_ALLOW_LIVE_ORDER`: disabled.
- `KIWOOM_APP_KEY`, `KIWOOM_SECRET_KEY`, `LS_APP_KEY`, `LS_APP_SECRET_KEY`: present.
- `LS_MAC_ADDRESS`: absent, treated as optional.
- `.env` had `KIWOOM_ENV=mock`; Kiwoom live checks were executed with command-level `KIWOOM_ENV=prod` override.
- Network calls: executed for auth and public quote/read-only market data only.
- Order calls: not executed.
- Account read calls: not executed.

### Commands

```bash
set -a; source .env; set +a; npm run examples:live-readonly:preflight
set -a; source .env; set +a; node examples/live-readonly/auth-only.mjs --json
set -a; source .env; set +a; node examples/live-readonly/ls-domestic-quote.mjs --json
set -a; source .env; set +a; node examples/live-readonly/ls-overseas-quote.mjs --json
set -a; source .env; set +a; KIWOOM_ENV=prod node examples/live-readonly/auth-only.mjs --json
set -a; source .env; set +a; KIWOOM_ENV=prod node examples/live-readonly/kiwoom-domestic-quote.mjs --json
```

### Preflight

- Result: `pass`.
- SDK commit reported by script: `9e1e800`.
- Required env present: `KIWOOM_APP_KEY`, `KIWOOM_SECRET_KEY`, `LS_APP_KEY`, `LS_APP_SECRET_KEY`.
- Missing env: none.

### Auth Results

| Broker | Environment | Result | Notes |
| --- | --- | --- | --- |
| Kiwoom | `mock` | fail | `.env` default `KIWOOM_ENV=mock` returned no token field. |
| Kiwoom | `prod` | pass | token issued; token value redacted. |
| LS | `prod` | pass | token issued; token value redacted. |

### Public Quote Results

| Broker | Scenario | API/TR | Result | Status | Broker Code | Summary |
| --- | --- | --- | --- | ---: | --- | --- |
| Kiwoom | domestic current price | `ka10001` | pass | 200 | `0` | `005930`, KRW price received |
| Kiwoom | domestic daily candles | `ka10081` | pass | 200 | `0` | 600 daily candles received |
| Kiwoom | domestic index current | `ka20001` | pass | 200 | `0` | KOSPI index received |
| Kiwoom | domestic investor flow | `ka10051` | pass | 200 | `0` | KOSPI investor flow received |
| LS | domestic current price | `t1101` | pass | 200 | `00000` | `005930`, KRW price received |
| LS | domestic minute candles | `t8412` | pass | 200 | `00000` | 500 minute candles received |
| LS | domestic index current | `t1511` | pass | 200 | `00000` | KOSPI index received |
| LS | domestic investor flow | `t1602` | pass | 200 | `00000` | KOSPI investor flow received |
| LS | overseas current price | `g3101` | pass | 200 | `00000` | `TSLA`, USD price received |
| LS | overseas order book | `g3106` | pass | 200 | `00000` | 10 ask levels and 10 bid levels received |
| LS | overseas basic info | `g3104` | pass | 200 | `00000` | `TSLA`, USD info received |
| LS | overseas period candles | `g3204` | pass | 200 | `00000` | 5 daily candles received |
| LS | overseas time series | `g3102` | pass | 200 | `00000` | 30 trades received |

### Decision

The SDK can execute live read-only auth and public quote/market data examples for Kiwoom and LS with current secrets. Keep `KIWOOM_ENV=prod` for Kiwoom live checks. Continue to keep order and account-sensitive checks out of the public quote verification path.

## Live Account Read-only Run - 2026-05-19T09:32:58Z

### Environment

- `SECURITY_API_LIVE_READONLY`: enabled.
- `SECURITY_API_ALLOW_LIVE_ORDER`: disabled.
- Required broker secrets: present.
- `LS_MAC_ADDRESS`: absent, optional.
- Network calls: executed for account read-only APIs only.
- Order calls: not executed.
- Account numbers: masked in output.
- Monetary values: not printed; account summaries are recorded as `[SUMMARY_MASKED]`.
- Tokens/secrets: not printed.

### Commands

```bash
set -a; source .env; set +a; npm run examples:live-readonly:preflight
set -a; source .env; set +a; node examples/live-readonly/account-readonly.mjs --json
set -a; source .env; set +a; KIWOOM_ENV=prod node examples/live-readonly/account-readonly.mjs --json
```

The first account run used `.env` as-is and showed Kiwoom failures because `.env` still had `KIWOOM_ENV=mock`. The second run used `KIWOOM_ENV=prod` and is the authoritative live account read-only result.

### Account Results

| Broker | Environment | Scenario | API/TR | Result | Status | Broker Code | Masked Summary |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| Kiwoom | `prod` | domestic account cash | `kt00001` | pass | 200 | `0` | `[SUMMARY_MASKED]` |
| Kiwoom | `prod` | domestic account balance | `kt00018` | pass | 200 | `0` | `[SUMMARY_MASKED]`, position count `8` |
| LS | `prod` | domestic account cash | `CSPAQ12200` | pass | 200 | `00136` | `[SUMMARY_MASKED]` |
| LS | `prod` | domestic account balance | `t0424` | pass | 200 | `00000` | `[SUMMARY_MASKED]`, position count `0` |
| LS | `prod` | overseas account cash | `COSOQ02701` | pass | 200 | `00136` | `[SUMMARY_MASKED]` |
| LS | `prod` | overseas account balance | `COSOQ00201` | pass | 200 | `02679` | `[SUMMARY_MASKED]`, position count `0` |

### No-data Handling

LS `COSOQ00201` returned `02679 / 조회내역이 없습니다.` for overseas stock balance. This was verified as a no-data account state, not a transport/auth/order failure. The LS adapter now treats no-data messages as successful read-only responses while preserving the broker code in the result.

### Decision

Live account read-only verification is complete for the current implemented account capabilities. The SDK can execute Kiwoom domestic cash/balance, LS domestic cash/balance, and LS overseas cash/balance without order submission. Keep `KIWOOM_ENV=prod` for live account checks.
