# SDK Usage Guide

Last updated: 2026-05-19

이 문서는 외부 서버나 앱이 SecurityAPI를 SDK처럼 참조해 인증, 조회, 실시간 구독, dry-run 주문을 사용하는 기본 흐름을 정리한다. 안정적으로 의존해도 되는 public API의 범위는 [Public SDK Contract](public-sdk-contract.md)를 기준으로 한다.

설치, 패키지 포함 파일, Git dependency 검증 절차는 [SDK Distribution Guide](sdk-distribution-guide.md)를 기준으로 한다.

## Package Status

현재 패키지는 `package.json`에서 `private: true`로 관리한다. 따라서 public npm package가 아니라 Git dependency, 같은 저장소 workspace, 또는 사설 registry 배포 형태로 사용하는 것을 전제로 한다.

Git dependency 예시:

```json
{
  "dependencies": {
    "security-api-reference": "github:kevinjishan/SecurityAPI"
  }
}
```

로컬 경로 dependency 예시:

```json
{
  "dependencies": {
    "security-api-reference": "file:../SecurityAPI"
  }
}
```

외부 앱은 `src/**` 내부 파일을 직접 import하지 말고 public entry point만 사용한다.

```js
import {
  KiwoomClient,
  LsClient,
  QuoteService,
} from "security-api-reference";
```

## Environment

외부 앱의 `.env` 또는 secret manager에 다음 값을 둔다. `.env`는 git에 커밋하지 않는다.

```bash
KIWOOM_APP_KEY=
KIWOOM_SECRET_KEY=
KIWOOM_ENV=prod

LS_APP_KEY=
LS_APP_SECRET_KEY=
LS_ENV=prod

SECURITY_API_LIVE_READONLY=false
SECURITY_API_ALLOW_LIVE_ORDER=false
```

Notes:

- `KIWOOM_ENV=prod`가 실제 키움 live 검증에서 사용된 환경이다.
- `LS_MAC_ADDRESS`는 법인 계정 등 broker가 요구하는 경우에만 설정한다.
- live read-only 예제를 실행할 때만 `SECURITY_API_LIVE_READONLY=true`를 명시한다.
- 주문 관련 앱은 기본값으로 `SECURITY_API_ALLOW_LIVE_ORDER=false`를 유지한다.

## Client Factory

외부 앱에서는 broker client를 한 곳에서 생성하고 service에 주입한다.

```js
import {
  AccountService,
  KiwoomClient,
  LsClient,
  MarketDataService,
  OrderService,
  OverseasStockQuoteService,
  OverseasStockRealtimeService,
  QuoteService,
} from "security-api-reference";

export function createSecurityApiClients() {
  return {
    kiwoom: new KiwoomClient({
      appKey: process.env.KIWOOM_APP_KEY,
      secretKey: process.env.KIWOOM_SECRET_KEY,
      env: process.env.KIWOOM_ENV ?? "prod",
    }),
    ls: new LsClient({
      appKey: process.env.LS_APP_KEY,
      appSecretKey: process.env.LS_APP_SECRET_KEY,
      macAddress: process.env.LS_MAC_ADDRESS,
      env: process.env.LS_ENV ?? "prod",
    }),
  };
}

export function createSecurityApiServices(clients = createSecurityApiClients()) {
  return {
    quote: new QuoteService(clients),
    marketData: new MarketDataService(clients),
    account: new AccountService(clients),
    order: new OrderService(clients),
    overseasQuote: new OverseasStockQuoteService(clients),
    overseasRealtime: new OverseasStockRealtimeService(clients),
  };
}
```

## Read-only REST

Read-only 서비스는 `get*` 메서드를 사용한다. 응답은 항상 `ok`를 먼저 확인한다.

```js
const { quote, overseasQuote, account } = createSecurityApiServices();

const domestic = await quote.getDomesticStockCurrentPrice("ls", "005930");
if (!domestic.ok) {
  throw domestic.error;
}
console.log(domestic.data.symbol, domestic.data.price);

const overseas = await overseasQuote.getOverseasStockCurrentPrice("ls", {
  symbol: "TSLA",
  exchangeCode: "82",
});
if (!overseas.ok) {
  throw overseas.error;
}
console.log(overseas.data.symbol, overseas.data.price, overseas.data.currency);

const balance = await account.getDomesticStockBalance("kiwoom");
if (!balance.ok) {
  throw balance.error;
}
console.log(balance.data.positions.length);
```

계좌 조회 결과를 로그에 남길 때는 계좌번호, 금액, 토큰, 원문 `raw`를 그대로 출력하지 않는다. 앱 로그에는 position count, 성공/실패, broker code 같은 요약만 남긴다.

## Realtime WebSocket

실시간 서비스는 `subscribe*` 메서드를 사용하고, 앱 종료/화면 이탈 시 반드시 `unsubscribe`와 `close`를 호출한다.

```js
const { overseasRealtime } = createSecurityApiServices();

const stream = await overseasRealtime.subscribeOverseasStockTrades("ls", {
  symbol: "TSLA",
  exchangeCode: "82",
}, {
  onMessage: (message) => {
    console.log(message.kind, message.symbol, message.price);
  },
  onError: (error) => {
    console.error("realtime error", error);
  },
});

if (!stream.ok) {
  throw stream.error;
}

process.on("SIGINT", async () => {
  await stream.unsubscribe?.();
  stream.close?.();
  process.exit(0);
});
```

Live verified:

- LS overseas realtime trade `GSC`
- LS overseas realtime order book `GSH`

Order event realtime streams are not part of read-only verification. Do not subscribe to domestic order event or LS overseas `AS0`~`AS4` streams unless a separate account-event verification flow is approved.

## Capability Checks

UI나 API endpoint를 외부 앱에서 열기 전에 capability를 확인한다.

```js
import { getCapabilities } from "security-api-reference";

const lsCaps = getCapabilities("ls");

if (lsCaps.supports("overseasStock.quote.currentPrice")) {
  // show overseas quote feature
}

const allowAccountEventStreams = process.env.SECURITY_API_ALLOW_ACCOUNT_EVENTS === "true";
const canUseOrderEvents = allowAccountEventStreams && lsCaps.supports("overseasStock.realtime.orderEvent");
```

Use:

- `supports(capabilityId)` for callable SDK features.
- `hasMetadata(capabilityId)` only for documentation/discovery.
- `findApis(capabilityId)` when the app needs to display broker API IDs/TR codes.
- account/order event streams need an app-level approval flag even when the SDK capability is implemented.

## Order Dry-run

Order services are intentionally dry-run by default. This lets an app inspect the generated broker request without sending an order.

```js
const { order } = createSecurityApiServices();

const preview = await order.buyDomesticStock("kiwoom", {
  symbol: "005930",
  quantity: 1,
  estimatedPrice: 70000,
}, {
  maxOrderAmount: 100000,
  allowedSymbols: ["005930"],
});

if (!preview.ok) {
  throw preview.error;
}

console.log(preview.dryRun); // true
console.log(preview.data.normalized);
```

Live order submission is outside this usage guide. A production app must require a separate approval flow before setting `dryRun: false`, `confirm: true`, and `expectedRequest`.

## Error Handling

All service calls use the wrapper shape described in [Public SDK Contract](public-sdk-contract.md).

```js
const result = await quote.getDomesticStockCurrentPrice("ls", "005930");

if (!result.ok) {
  switch (result.error.code) {
    case "AUTH_ERROR":
      // refresh app configuration or notify operator
      break;
    case "VALIDATION_ERROR":
      // fix user input
      break;
    case "UNSUPPORTED_CAPABILITY":
      // disable this feature for the broker
      break;
    default:
      // record masked diagnostic summary
      break;
  }
}
```

Do not retry order-domain calls automatically. For read-only calls, retry policy should be conservative and observable from the caller app.

## Live Verification Reference

Current live-verified scope is summarized in [Live Read-only Verification Matrix](live-readonly-verification-matrix.md).

Before running any live read-only example:

```bash
set -a; source .env; set +a; npm run examples:live-readonly:preflight
```

The example should report:

- `SECURITY_API_LIVE_READONLY: enabled`
- `SECURITY_API_ALLOW_LIVE_ORDER: disabled`
- no missing required env

Then run only the read-only example needed for the target path. Never use read-only examples to test live order submission.

## Production App Checklist

- Use only public package entry points.
- Create broker clients once per app/process boundary where practical.
- Keep secrets in the app environment or secret manager, not in source code.
- Check `result.ok` before using `result.data`.
- Mask account, token, password, authorization, app key, and raw account values in logs.
- Call `unsubscribe` and `close` for realtime streams.
- Keep order submission disabled unless a separate approval/audit flow is implemented.
- Run `npm run validate:all` in this repository before updating the dependency revision used by an external app.
