# Live Read-only Verification Matrix

Last updated: 2026-05-19

이 문서는 SecurityAPI SDK의 live read-only 검증 현황을 한 장으로 정리한다. 상세 실행 기록은 [Live Read-only Verification Audit - 2026-05-19](audits/live-readonly-2026-05-19.md)를 기준으로 한다.

## Status Legend

| Status | Meaning |
| --- | --- |
| `live-pass` | 실제 broker 서버에서 주문 없이 실행했고 통과했다. |
| `guard-pass` | 실행 전 guard/preflight가 의도대로 통과했다. |
| `local-pass` | mock/test/validate 기준으로 통과했다. |
| `excluded` | live read-only 범위에서 의도적으로 제외했다. |
| `deferred` | 설계/구현은 있으나 이번 live read-only 검증 대상이 아니다. |

## Guard Summary

| Guard | Required | Verified | Status |
| --- | --- | --- | --- |
| `SECURITY_API_LIVE_READONLY` | `true` | enabled during live runs | `guard-pass` |
| `SECURITY_API_ALLOW_LIVE_ORDER` | `false` or unset | disabled during live runs | `guard-pass` |
| `.env` secrets | present locally, never committed | Kiwoom/LS secrets present | `guard-pass` |
| Secret masking | token/account/password not printed | audit records contain only masked summaries | `live-pass` |
| Order API calls | must not run | not executed | `live-pass` |
| Order event subscriptions | must not run in this check | `AS0`~`AS4` not subscribed | `live-pass` |

## Live Coverage Matrix

| Area | Broker | Capability / Method | API/TR | Live Result | Notes |
| --- | --- | --- | --- | --- | --- |
| OAuth | Kiwoom | `KiwoomClient.getAccessToken` | `au10001` | `live-pass` | `.env` default was `KIWOOM_ENV=mock`; authoritative live run used `KIWOOM_ENV=prod`. |
| OAuth | LS | `LsClient.getAccessToken` | `token` | `live-pass` | `LS_MAC_ADDRESS` absent and treated as optional for non-corporate read-only verification. |
| Domestic quote | Kiwoom | `QuoteService.getDomesticStockCurrentPrice` | `ka10001` | `live-pass` | Samsung Electronics sample `005930`; public price summary only. |
| Domestic quote | LS | `QuoteService.getDomesticStockCurrentPrice` | `t1101` | `live-pass` | Samsung Electronics sample `005930`; public price summary only. |
| Domestic candles | Kiwoom | `MarketDataService.getDomesticStockDailyCandles` | `ka10081` | `live-pass` | Daily candle count recorded, raw values not copied into audit. |
| Domestic candles | LS | `MarketDataService.getDomesticStockMinuteCandles` | `t8412` | `live-pass` | Minute candle count recorded. |
| Market context | Kiwoom | `MarketContextService.getDomesticIndexCurrent` | `ka20001` | `live-pass` | KOSPI index read-only. |
| Market context | LS | `MarketContextService.getDomesticIndexCurrent` | `t1511` | `live-pass` | KOSPI index read-only. |
| Market flow | Kiwoom | `MarketFlowService.getDomesticInvestorFlow` | `ka10051` | `live-pass` | KOSPI investor flow read-only. |
| Market flow | LS | `MarketFlowService.getDomesticInvestorFlow` | `t1602` | `live-pass` | KOSPI investor flow read-only. |
| Overseas quote | LS | `OverseasStockQuoteService.getOverseasStockCurrentPrice` | `g3101` | `live-pass` | TSLA sample, public price summary only. |
| Overseas order book | LS | `OverseasStockQuoteService.getOverseasStockOrderBook` | `g3106` | `live-pass` | 10 ask / 10 bid levels verified. |
| Overseas basic info | LS | `OverseasStockMarketDataService.getOverseasStockBasicInfo` | `g3104` | `live-pass` | TSLA public info read-only. |
| Overseas candles | LS | `OverseasStockMarketDataService.getOverseasStockCandles` | `g3204` | `live-pass` | Daily candle count recorded. |
| Overseas time series | LS | `OverseasStockMarketDataService.getOverseasStockTimeSeries` | `g3102` | `live-pass` | Trade/time series count recorded. |
| Domestic account cash | Kiwoom | `AccountService.getDomesticStockCash` | `kt00001` | `live-pass` | Account and amount values masked. |
| Domestic account balance | Kiwoom | `AccountService.getDomesticStockBalance` | `kt00018` | `live-pass` | Position count recorded; account and amounts masked. |
| Domestic account cash | LS | `AccountService.getDomesticStockCash` | `CSPAQ12200` | `live-pass` | Account and amount values masked. |
| Domestic account balance | LS | `AccountService.getDomesticStockBalance` | `t0424` | `live-pass` | Position count recorded; account and amounts masked. |
| Overseas account cash | LS | `OverseasStockAccountService.getOverseasStockCash` | `COSOQ02701` | `live-pass` | Account and amount values masked. |
| Overseas account balance | LS | `OverseasStockAccountService.getOverseasStockBalance` | `COSOQ00201` | `live-pass` | LS no-data message treated as successful empty account state. |
| Overseas realtime trade | LS | `OverseasStockRealtimeService.subscribeOverseasStockTrades` | `GSC` | `live-pass` | Subscribe, message receive, unsubscribe verified. |
| Overseas realtime order book | LS | `OverseasStockRealtimeService.subscribeOverseasStockOrderBook` | `GSH` | `live-pass` | Subscribe, message receive, unsubscribe verified. |

## Local-only Coverage

These capabilities are implemented and covered by `npm run validate:all`, but were not part of the current live read-only execution.

| Area | Broker | Capability / Method | Reason |
| --- | --- | --- | --- |
| Domestic realtime trade/order book | Kiwoom/LS | `RealtimeService.subscribeDomesticStockTrades`, `subscribeDomesticStockOrderBook` | Deferred to a separate realtime market-hours check. |
| Market status realtime | Kiwoom/LS | `RealtimeService.subscribeMarketStatus` | Deferred to a separate realtime market-hours check. |
| Scanner / condition search | Kiwoom/LS | `ScannerService` methods | Read-only, but not included in the first live verification path. |
| Signal inputs | Kiwoom/LS | `SignalInputService` methods | Composed SDK calculation; underlying quote/market reads were partially verified live. |
| Order dry-run builders | Kiwoom/LS | `OrderService`, `OverseasStockOrderService` | Local guard/dry-run only; live order submission is out of scope. |

## Explicitly Excluded From Live Read-only

| Area | Broker | API/TR | Reason |
| --- | --- | --- | --- |
| Domestic live order send | Kiwoom/LS | broker order TRs | Requires separate order approval flow and must never run under read-only guard. |
| Overseas live order send | LS | overseas order TRs | Requires separate order approval flow and must never run under read-only guard. |
| Domestic order event realtime | Kiwoom/LS | `00`, `SC0`~`SC4` | Account/order event stream; excluded from read-only quote verification. |
| Overseas order event realtime | LS | `AS0`~`AS4` | Account/order event stream; excluded from read-only quote verification. |

## Verification Commands

```bash
set -a; source .env; set +a; npm run examples:live-readonly:preflight
set -a; source .env; set +a; node examples/live-readonly/auth-only.mjs --json
set -a; source .env; set +a; KIWOOM_ENV=prod node examples/live-readonly/kiwoom-domestic-quote.mjs --json
set -a; source .env; set +a; node examples/live-readonly/ls-domestic-quote.mjs --json
set -a; source .env; set +a; node examples/live-readonly/ls-overseas-quote.mjs --json
set -a; source .env; set +a; KIWOOM_ENV=prod node examples/live-readonly/account-readonly.mjs --json
set -a; source .env; set +a; node examples/live-readonly/ls-overseas-realtime.mjs --json
npm run validate:all
```

Do not run live examples unless `SECURITY_API_LIVE_READONLY=true` and `SECURITY_API_ALLOW_LIVE_ORDER=false` are explicitly set.

## Current Decision

The SDK is live-verified for the implemented OAuth, public REST market data, account read-only REST, and LS overseas quote WebSocket paths listed above. It is not live-approved for order submission or order event subscriptions. External apps may use this matrix to decide which SDK paths are already proven against real broker servers and which paths still require separate validation.
