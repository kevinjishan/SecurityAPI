# Core Spec Audit - 2026-05-19

## Scope

This audit checks the currently implemented SDK core against the generated official API metadata in this repository.

Covered areas:

- Broker clients: Kiwoom, LS OAuth/request/continuation/error handling.
- Capability mappings for implemented core services.
- Domain services: quote, market data, market context, market flow, scanner/condition search, account, order, realtime, signal input.
- Order safety guardrails: dry-run default, explicit live-order confirmation, market-order confirmation, retry disabled for live order requests, symbol/amount guards, expected request matching.

Out of scope:

- Live broker connectivity with real keys/accounts.
- Domain services not yet implemented for overseas stock, futures/options, ELW, credit, short selling, and every raw documented API.
- Strategy decisions such as buy/sell signal generation.

## Automated Checks Added

Added `test/audit/coreSpecAudit.test.mjs`.

This test creates each implemented service request and compares the generated request body with required request fields from:

- `data/generated/kiwoom-manifest.json`
- `data/generated/ls-manifest.json`

The check covers all service-backed core request paths that the SDK currently exposes as ready-to-call domain services:

- Quote: current price, order book, multi current price.
- MarketData: basic info, daily candles, minute candles.
- MarketContext: index current, index daily candles, expected index.
- MarketFlow: investor net buy, program trading trend.
- Scanner: volume/value/change rankings, condition list/search/realtime session.
- Account: cash, balance, order history.
- Order: buy, sell, modify, cancel.

Realtime WebSocket envelope construction is covered by existing `WebSocketBrokerClient` and `RealtimeService` tests. The audit treats realtime domain message normalization separately because the service API exposes `subscribe(id, key)` rather than the raw broker WebSocket payload.

## Findings And Fixes

### P1 - LS `exchgubun` required field was missing for some stock quote/basic-info requests

Official LS metadata marks `exchgubun` as required for:

- `t1102` stock current/basic info
- `t8450` integrated current price/order book

Before this audit:

- `QuoteService.getDomesticStockCurrentPrice("ls", ..., { trCode: "t1102" })` sent only `shcode`.
- `QuoteService.getDomesticStockOrderBook("ls", ..., { trCode: "t8450" })` sent only `shcode`.
- `MarketDataService.getDomesticStockBasicInfo("ls", ...)` sent only `shcode`.

Fix:

- Added default `exchgubun: "K"` for LS `t1102` and `t8450`.
- Allowed override through `exchangeCode` or `exchange`.
- Updated tests for the corrected request shape.

Status: fixed.

### P1 - Account capabilities exposed alternate APIs that were not normalized as service-ready

Some account capability entries exposed additional APIs whose required request fields and response shapes are materially different from the current account service methods.

Examples:

- Kiwoom `kt00010`, `kt00011`, `kt00004`, `kt00005`, `kt00009`
- LS `CSPAQ22200`, `CSPBQ00200`, `FOCCQ33600`, `CDPCQ04700`

The SDK could technically call these with explicit `params`, but the service did not provide a complete default request/normalizer contract for them. Exposing them in capability mappings made them look fully service-ready.

Fix:

- Narrowed account capabilities to APIs currently covered by service defaults and normalizers:
  - Kiwoom cash: `kt00001`
  - Kiwoom balance: `kt00018`
  - Kiwoom order history: `kt00007`
  - LS cash: `CSPAQ12200`
  - LS balance: `t0424`
  - LS order history: `CSPAQ13700`

Status: fixed.

## Verified No P0/P1 Issues Found In

- Current capability references exist in generated manifests.
- Implemented service request bodies include all documented required body fields.
- Kiwoom/LS client auth and continuation tests pass.
- Order service keeps live order execution guarded:
  - dry-run by default
  - `confirm: true` required
  - `confirmMarketOrder: true` required for live market orders
  - live order retry forced to `false`
  - `expectedRequest` mismatch blocks live submission
- Realtime service and WebSocket client tests cover subscribe/unsubscribe, message normalization, reconnect, resubscribe, and stale heartbeat detection.
- Signal input realtime state covers trade, order book, market status, and condition search event updates.

## Residual Risks

- This is a static/mock audit. It does not prove broker production acceptance without real app keys, account permissions, and market-session connectivity.
- Response normalization is tested against representative official-like payloads, not every field variant in every API response.
- Some documented capabilities for overseas stock and futures/options are metadata/capability mappings only. They are not domain services yet.
- WebSocket subscription payloads vary by broker runtime. Existing tests verify SDK envelope construction and normalized messages, but production WebSocket validation remains a live integration task.

## Current Judgment

The implemented domestic-stock core is in a service-ready state for mock/tested usage and is aligned with generated official metadata for required request fields. No remaining P0/P1 issues were found in the currently implemented core after the fixes above.

Before production trading, run a separate live integration audit with real mock/live broker environments, account permissions, rate-limit observations, and broker-side rejected-order logs.
