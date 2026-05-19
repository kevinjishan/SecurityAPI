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
| LS | `LS_MAC_ADDRESS` | missing |

Optional environment values were also absent in the current shell: `KIWOOM_ENV`, `LS_ENV`, `SECURITY_API_REALTIME_WAIT_MS`.

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
