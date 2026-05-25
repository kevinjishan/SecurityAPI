# Crypto Read-only Audit 2026-05-26

## Summary

- Branch: `codex/crypto-exchange-support`
- Commit under test: `1a20c99`
- Guard: `SECURITY_API_LIVE_READONLY=true`, `SECURITY_API_ALLOW_LIVE_ORDER=false`
- Scope: public read-only REST and public WebSocket subscribe/unsubscribe only
- Excluded: live orders, deposits, withdrawals, transfers, leverage mutation, private user/order streams

## Public REST

| Scenario | Exchange | API | Result | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Spot current price | Binance | `binance.spot.ticker` | pass | 200 | `symbol` and `price` normalized |
| Spot order book | Upbit | `upbit.spot.orderbook` | pass | 200 | Initial live check exposed array payload shape; normalizer fixed and rechecked |
| Spot candles | Binance | `binance.spot.candles` | pass | 200 | OHLCV candle values normalized |

## Public WebSocket

| Scenario | Exchange | API | Result | Notes |
| --- | --- | --- | --- | --- |
| Spot trade subscription | Binance | `binance.spot.ws.trade` | pass | Subscribe/unsubscribe envelope created and socket closed |
| Futures order book subscription | Bybit | `bybit.futures.ws.orderbook` | pass | Subscribe/unsubscribe envelope created and socket closed |

## Fixes From Live Check

- `normalizeCryptoSpotOrderBook` now handles array-wrapped order book payloads such as Upbit/Bithumb style responses.
- `examples/crypto-readonly/public-realtime-readonly.mjs` now awaits unsubscribe and explicitly closes WebSocket clients so the example exits cleanly.
- `runReadOnlyScenario` now awaits async summarizers, preserving compatibility with existing synchronous summaries.

## Private Read-only

Not executed in this audit. Private balance/position examples require exchange credentials:

- `BINANCE_API_KEY`
- `BINANCE_API_SECRET`
- `BYBIT_API_KEY`
- `BYBIT_API_SECRET`

## Validation

Commands executed:

```bash
SECURITY_API_LIVE_READONLY=true SECURITY_API_ALLOW_LIVE_ORDER=false npm run examples:crypto-readonly:public-market -- --json
SECURITY_API_LIVE_READONLY=true SECURITY_API_ALLOW_LIVE_ORDER=false npm run examples:crypto-readonly:public-realtime -- --json
npm run validate:all
```

Result: passed.
