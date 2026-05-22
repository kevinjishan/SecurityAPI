# Live Read-only Verification Audit - 2026-05-22

This audit records the live read-only verification run for the technical indicator, relative strength, and market breadth signal services.

## Guard

| Guard | Value |
| --- | --- |
| `SECURITY_API_LIVE_READONLY` | `true` |
| `SECURITY_API_ALLOW_LIVE_ORDER` | `false` |
| Broker environment | `KIWOOM_ENV=prod` |
| Order API calls | not executed |
| Order event subscriptions | not executed |
| Sensitive data masking | enabled |

## Command

```bash
set -a; source .env; set +a
KIWOOM_ENV=prod SECURITY_API_LIVE_READONLY=true SECURITY_API_ALLOW_LIVE_ORDER=false npm run examples:live-readonly:signals -- --json
```

## Result Summary

| Scenario | Method | API/TR | Result | Notes |
| --- | --- | --- | --- | --- |
| Kiwoom domestic technical indicators | `TechnicalIndicatorService.getDomesticStockIndicators` | `ka10081` | `pass` | Daily candle read-only data received and indicators calculated. |
| Kiwoom domestic relative strength vs KOSPI | `RelativeStrengthService.getDomesticStockRelativeStrength` | `ka10081` + `ka20006` | `pass` | Stock and KOSPI index daily candles aligned and relative strength calculated. |
| Snapshot domestic market breadth indicators | `MarketBreadthService` calculators | snapshot | `pass` | Calculated from static snapshot input; no broker network call. |

## Technical Indicators

| Field | Value |
| --- | --- |
| Broker | Kiwoom |
| Environment | prod |
| Symbol | `005930` |
| Base date | `20260519` |
| Candle count | `600` |
| Interval | `1d` |
| SMA 5 | `281400` |
| SMA 20 | `249900` |
| SMA 60 | `212743.33333333` |
| MA alignment | `bullish` |
| 20-day disparity | `110.24409764` |
| RSI | `62.56312143` |
| MACD histogram | `1445.22983819` |
| Volume ratio | `1.03165369` |
| Value ratio | `1.10322888` |
| ATR | `16078.61154998` |
| Candle color | `bullish` |

## Relative Strength

| Field | Value |
| --- | --- |
| Broker | Kiwoom |
| Environment | prod |
| Symbol | `005930` |
| Benchmark | KOSPI |
| Aligned count | `600` |
| 5-period direction | `outperforming` |
| 5-period spread | `3.60595029` |
| 5-period ratio | `0.25810065` |
| 20-period direction | `outperforming` |
| 20-period spread | `10.10840951` |
| 20-period ratio | `1.57968088` |

## Market Breadth Snapshot

| Field | Value |
| --- | --- |
| Source | static sample snapshot |
| Market | KOSPI |
| ADL latest value | `205` |
| ADL latest net advances | `150` |
| High/low ratio | `1` |
| Above moving average ratio | `0.66666667` |
| Universe size | `3` |

## Safety Notes

- This run used read-only market data paths only.
- No order service method was called.
- No account field, token, password, app key, app secret, or MAC address was printed.
- Market breadth remains snapshot-based; it does not prove live whole-market universe collection.
