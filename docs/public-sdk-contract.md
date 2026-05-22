# Public SDK Contract

이 문서는 외부 서버나 앱이 SecurityAPI를 SDK로 사용할 때 의존해도 되는 public API와 response contract를 정의한다.

실제 외부 앱 연동 순서와 예제는 [SDK Usage Guide](sdk-usage-guide.md)를 함께 본다.

## Package Status

현재 `package.json`은 `private: true`다. 따라서 이 문서는 npm public package 배포 계약이 아니라, 같은 저장소/사설 패키지/Git dependency로 참조할 때의 SDK contract 기준이다. public package로 전환할 때는 이 문서를 semver 기준으로 사용한다.

## Public Entry Points

외부 앱은 다음 entry point만 사용한다.

| Entry | Purpose |
| --- | --- |
| `security-api-reference` | top-level public exports |
| `security-api-reference/core` | core HTTP/token/error utilities |
| `security-api-reference/adapters` | broker clients and WebSocket client |
| `security-api-reference/metadata` | generated manifest lookup |
| `security-api-reference/capabilities` | broker capability registry |
| `security-api-reference/services` | domain service classes and normalizers |

Internal files under `src/**` are not contract unless exported through one of these entry points.

## Public Classes

### Core

- `BrokerError`
- `HttpClient`
- `MemoryTokenStore`
- `TokenStore`
- retry policy helpers
- broker/environment assertion helpers

### Adapters

- `KiwoomClient`
- `LsClient`
- `WebSocketBrokerClient`
- token parser helpers
- realtime message normalizer

### Metadata And Capabilities

- `MetadataRegistry`
- `createMetadataRegistry`
- `loadGeneratedManifests`
- `getCapabilities`
- `listCapabilityIds`
- `listCapabilityDefinitions`
- capability status constants

### Services

- `QuoteService`
- `MarketDataService`
- `TechnicalIndicatorService`
- `RelativeStrengthService`
- `MarketBreadthService`
- `MarketContextService`
- `MarketFlowService`
- `ScannerService`
- `SignalInputService`
- `AccountService`
- `OrderService`
- `RealtimeService`
- `OverseasStockQuoteService`
- `OverseasStockMarketDataService`
- `OverseasStockAccountService`
- `OverseasStockOrderService`
- `OverseasStockRealtimeService`
- indicator/relative strength/market breadth calculators: `DEFAULT_TECHNICAL_PROFILE`, `calculateTechnicalIndicators`, `calculateRelativeStrength`, `calculateAdvanceDeclineLine`, `calculateHighLowRatio`, `calculateAboveMovingAverageRatio`, `simpleMovingAverage`, `exponentialMovingAverage`, `movingAverageDisparity`, `movingAverageSlope`, `movingAverageAlignment`, `relativeStrengthIndex`, `movingAverageConvergenceDivergence`, `stochasticOscillator`, `ratioToMovingAverage`, `onBalanceVolume`, `moneyFlowIndex`, `averageTrueRange`, `calculateBollingerBands`, `rollingStandardDeviation`, `detectCandlePatterns`

## Method Naming Rules

Service method names follow this pattern.

```text
verb + Market/Product + Domain + Detail
```

Examples:

- `getDomesticStockCurrentPrice`
- `getDomesticStockIndicators`
- `getDomesticStockRelativeStrength`
- `getDomesticStockOrderBook`
- `getDomesticIndexCurrent`
- `getOverseasStockCurrentPrice`
- `buyDomesticStock`
- `cancelOverseasStockOrder`
- `subscribeOverseasStockTrades`

Rules:

- `get*` methods are read-only.
- `buy*`, `sell*`, `modify*`, `cancel*`, `submit*` methods are order-domain methods and must default to dry-run where applicable.
- `subscribe*` methods return a subscription wrapper with `unsubscribe`.
- First argument is always `broker` for domain services.
- Broker-specific ids may be passed through `options.apiId` or `options.trCode` only when the capability exposes that source.

## Response Wrapper Contract

Most service methods return a wrapper with this shape.

```ts
type ServiceResult<T> = {
  ok: boolean;
  broker: "kiwoom" | "ls";
  capability?: string;
  id?: string | null;
  data: T | null;
  raw?: unknown;
  headers?: Record<string, string>;
  status?: number;
  continuation?: {
    hasNext?: boolean;
    key?: string;
  };
  error?: BrokerError;
};
```

Contract:

- `ok: true` means `data` is usable.
- `ok: false` means `error` is present and `data` is `null`.
- `raw` preserves broker response where available.
- `id` is API ID or TR code.
- `capability` is the service capability id.
- Apps should not parse `raw` unless they need broker-specific fields.

## Dry-run Order Response Contract

Order services return dry-run previews by default.

```ts
type OrderDryRunResult = {
  ok: true;
  dryRun: true;
  broker: "kiwoom" | "ls";
  capability: string;
  id: string;
  data: {
    request: object;
    normalized: object;
    safety: object;
    source: {
      broker: string;
      id: string;
      capabilityId: string;
    };
  };
};
```

Contract:

- No network order submission occurs when `dryRun` is omitted or true.
- Live submission requires `dryRun: false` and order guard approval.
- Order methods must set live order request retry to false.
- Apps should store masked audit summaries, not raw credentials.

## Realtime Subscription Contract

Realtime services return:

```ts
type RealtimeSubscription = {
  ok: boolean;
  broker: "kiwoom" | "ls";
  capability: string;
  id: string | null;
  ids?: string[];
  key: string;
  subscription?: unknown;
  subscriptions?: unknown[];
  unsubscribe?: () => Promise<unknown>;
  error?: BrokerError;
};
```

Contract:

- `ok: true` means subscription request was accepted by the SDK client.
- `id` is the primary realtime API/TR id.
- `ids` is present when one service method subscribes multiple event TRs, such as LS overseas order events.
- `unsubscribe` should be called by the app when leaving the stream.
- Message handlers receive normalized messages with `kind`.

## Capability Contract

Capability status values:

| Status | `supports()` | `hasMetadata()` | Meaning |
| --- | --- | --- | --- |
| `serviceReady` | true | true | Service method, request builder, normalizer, tests exist |
| `composed` | true | true | SDK-computed function composed from service-ready sources |
| `metadataOnly` | false | true | Official metadata exists, service not implemented |
| `parked` | false | true | Known but intentionally out of current product scope |

Apps should:

- use `supports()` before exposing a feature as available.
- use `hasMetadata()` only for documentation/discovery.
- handle `UNSUPPORTED_CAPABILITY` without fallback side effects.

## Normalizer Contract

Normalizers exported from services are public for test and adapter use. They:

- accept broker/source/payload-style arguments as implemented by the service.
- return common fields plus `raw`.
- do not guarantee every broker-specific field is normalized.
- may add fields in a backward-compatible way.

Removing or renaming normalized fields is a breaking change.

## Semver And Breaking Change Rules

Breaking changes:

- removing an exported class/function
- changing service method argument order
- changing `ok/error/data` wrapper semantics
- renaming existing normalized fields
- changing order guard defaults to be less restrictive
- changing live order retry behavior
- removing capability ids or changing status from supported to unsupported without deprecation

Non-breaking changes:

- adding new service methods
- adding new normalized fields
- adding new capability ids
- adding new optional parameters
- improving error details while preserving `error.code`
- adding docs/examples/tests

Version policy once package publishing begins:

- patch: bug fixes and docs
- minor: new service methods/capabilities/fields
- major: breaking public contract changes

## Minimal App Integration

```js
import {
  KiwoomClient,
  LsClient,
  QuoteService,
  getCapabilities,
} from "security-api-reference";

const clients = {
  kiwoom: new KiwoomClient({
    appKey: process.env.KIWOOM_APP_KEY,
    secretKey: process.env.KIWOOM_SECRET_KEY,
    env: process.env.KIWOOM_ENV ?? "mock",
  }),
  ls: new LsClient({
    appKey: process.env.LS_APP_KEY,
    appSecretKey: process.env.LS_APP_SECRET_KEY,
    macAddress: process.env.LS_MAC_ADDRESS,
    env: process.env.LS_ENV ?? "prod",
  }),
};

const caps = getCapabilities("ls");
if (caps.supports("quote.domesticStock.currentPrice")) {
  const quote = new QuoteService(clients);
  const result = await quote.getDomesticStockCurrentPrice("ls", "005930");
  if (result.ok) {
    console.log(result.data.symbol, result.data.price);
  }
}
```

## Completion Criteria

This contract is complete when:

- Public entry points are listed.
- Service naming and argument rules are explicit.
- Response wrapper, dry-run, realtime subscription shapes are documented.
- Capability status semantics are clear.
- Breaking change rules are defined.
