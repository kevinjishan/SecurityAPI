# Crypto Exchange Layer Plan

이 문서는 SecurityAPI에 크립토 거래소 product layer를 추가하기 위한 v1 범위를 정의한다. 크립토는 기존 증권사 SDK와 같은 저장소에서 확장하되, 증권사 `broker`와 크립토 `exchange` 타입은 분리한다.

## Official Sources

- Upbit: https://docs.upbit.com/kr, https://docs.upbit.com/reference/api-overview, https://github.com/upbit-official
- Bithumb: https://apidocs.bithumb.com/, https://apidocs.bithumb.com/docs/%EB%B9%97%EC%8D%B8-developer-docs, https://apidocs.bithumb.com/reference/api-%EB%A0%88%ED%8D%BC%EB%9F%B0%EC%8A%A4
- Coinone: https://docs.coinone.co.kr/docs/about-public-api, https://docs.coinone.co.kr/reference/range-unit
- Binance: https://www.binance.com/en/binance-api
- BingX: https://bingx-api.github.io/docs-v3/#/en/info
- Bybit: https://bybit-exchange.github.io/docs/, https://bybit-exchange.github.io/docs/api-explorer/v5/category

## Scope

v1 includes read-only market/account capabilities and dry-run order previews.

- Spot: current price, order book, candles, account balance, order preview, cancel preview, public trade/order book realtime.
- Futures: Binance, BingX, and Bybit current price, candles, balance, positions, order preview, cancel preview, public trade/order book realtime.
- Upbit, Bithumb, and Coinone futures capabilities remain parked/unsupported until official API support is explicitly mapped.

v1 excludes all mutation paths that can move funds or change live exposure.

- No live order submission.
- No deposit or withdrawal APIs.
- No transfer APIs.
- No leverage or margin-mode mutation APIs.
- No private user/order realtime stream implementation.

## Public Contract

Crypto exchange ids are separate from securities brokers.

```js
CRYPTO_EXCHANGES = ["binance", "bingx", "bybit", "upbit", "bithumb", "coinone"];
```

Core capabilities use product namespaces:

- `cryptoSpot.*`
- `cryptoFutures.*`

Service methods accept `exchange` as the first argument and return the same wrapper shape as broker services: `ok`, `exchange`, `capability`, `id`, `data`, `raw`, `headers`, `status`, and `error` on failure.

`CryptoExchangeClient` maps semantic ids such as `binance.spot.ticker`, `upbit.spot.orderbook`, and `bybit.futures.positions` to exchange REST requests. Public market-data calls can run without credentials. Private read-only calls require exchange credentials and generate signed requests, but v1 still does not expose live order, withdrawal, transfer, or leverage mutation endpoints.

`CryptoWebSocketClient` maps public realtime ids such as `binance.spot.ws.trade`, `bybit.futures.ws.orderbook`, and `upbit.spot.ws.trade` to exchange WebSocket subscribe/unsubscribe envelopes. Private user/order streams are excluded from v1.

## Safety

Order services return preview-only dry-run results. They never call an exchange client and never expose a `dryRun: false` path in v1.

Dry-run guard output includes:

- symbol allow/block checks
- max notional checks
- futures leverage cap checks
- market order confirmation requirement signal
- `liveSubmissionSupported: false`

Secrets, signatures, tokens, and account-like fields must be masked in audit/safety request copies.

## Capability Status Defaults

| Exchange | Spot | Futures |
| --- | --- | --- |
| Binance | service-ready candidate | service-ready candidate |
| BingX | service-ready candidate | service-ready candidate |
| Bybit | service-ready candidate | service-ready candidate |
| Upbit | service-ready candidate | parked |
| Bithumb | service-ready candidate | parked |
| Coinone | service-ready candidate | parked |

## Validation

The crypto layer is considered v1-ready when:

- crypto exchange enum/assertion tests pass
- capability lookup and status tests pass
- spot read-only request/normalizer tests pass for all six exchanges
- crypto REST adapter request-building tests pass for public market data and signed read-only account/position requests
- crypto WebSocket adapter envelope/subscription tests pass for public trade and order book streams
- futures read-only request/normalizer tests pass for Binance/BingX/Bybit
- domestic exchange futures calls return explicit unsupported failures
- order preview tests prove no live exchange client is required
- `npm run validate:all` passes

## Live Read-only Examples

Crypto live examples follow the same guard as securities examples.

```bash
npm run examples:crypto-readonly:preflight
npm run examples:crypto-readonly:validate
```

Actual read-only calls are blocked unless `SECURITY_API_LIVE_READONLY=true` and `SECURITY_API_ALLOW_LIVE_ORDER` is not `true`.

```bash
npm run examples:crypto-readonly:public-market
npm run examples:crypto-readonly:public-realtime
npm run examples:crypto-readonly:private-account
```

Public market/realtime examples do not require API keys. Private account read-only examples require credentials such as `BINANCE_API_KEY`, `BINANCE_API_SECRET`, `BYBIT_API_KEY`, and `BYBIT_API_SECRET`.
