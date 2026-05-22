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
  DbClient,
  KiwoomClient,
  KisClient,
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

DB_APP_KEY=
DB_APP_SECRET_KEY=
DB_ENV=prod

KIS_APP_KEY=
KIS_APP_SECRET_KEY=
KIS_ENV=prod
KIS_CUSTOMER_TYPE=P

SECURITY_API_LIVE_READONLY=false
SECURITY_API_ALLOW_LIVE_ORDER=false
```

Notes:

- `KIWOOM_ENV=prod`가 실제 키움 live 검증에서 사용된 환경이다.
- `LS_MAC_ADDRESS`는 법인 계정 등 broker가 요구하는 경우에만 설정한다.
- `DB_MAC_ADDRESS`는 DB증권 환경이 요구하는 경우에만 설정한다.
- `KIS_CUSTOMER_TYPE`은 개인 고객 기본값 `P`를 사용한다.
- live read-only 예제를 실행할 때만 `SECURITY_API_LIVE_READONLY=true`를 명시한다.
- 주문 관련 앱은 기본값으로 `SECURITY_API_ALLOW_LIVE_ORDER=false`를 유지한다.

## Client Factory

외부 앱에서는 broker client를 한 곳에서 생성하고 service에 주입한다.

```js
import {
  AccountService,
  DbClient,
  KiwoomClient,
  KisClient,
  LsClient,
  MarketBreadthService,
  MarketDataService,
  OrderService,
  OverseasStockQuoteService,
  OverseasStockRealtimeService,
  QuoteService,
  RelativeStrengthService,
  TechnicalIndicatorService,
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
    db: new DbClient({
      appKey: process.env.DB_APP_KEY,
      appSecretKey: process.env.DB_APP_SECRET_KEY,
      macAddress: process.env.DB_MAC_ADDRESS,
      env: process.env.DB_ENV ?? "prod",
    }),
    kis: new KisClient({
      appKey: process.env.KIS_APP_KEY,
      appSecretKey: process.env.KIS_APP_SECRET_KEY,
      env: process.env.KIS_ENV ?? "prod",
      customerType: process.env.KIS_CUSTOMER_TYPE ?? "P",
    }),
  };
}

export function createSecurityApiServices(clients = createSecurityApiClients()) {
  return {
    quote: new QuoteService(clients),
    marketBreadth: new MarketBreadthService(),
    marketData: new MarketDataService(clients),
    technical: new TechnicalIndicatorService(clients),
    relativeStrength: new RelativeStrengthService(clients),
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

const dbPrice = await quote.getDomesticStockCurrentPrice("db", "005930");
const kisPrice = await quote.getDomesticStockCurrentPrice("kis", "005930");
console.log(dbPrice.ok, kisPrice.ok);

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

const kisBalance = await account.getDomesticStockBalance("kis", {
  params: {
    CANO: process.env.KIS_ACCOUNT_NO,
    ACNT_PRDT_CD: process.env.KIS_ACCOUNT_PRODUCT_CODE ?? "01",
  },
});
if (!kisBalance.ok) {
  throw kisBalance.error;
}
```

계좌 조회 결과를 로그에 남길 때는 계좌번호, 금액, 토큰, 원문 `raw`를 그대로 출력하지 않는다. 앱 로그에는 position count, 성공/실패, broker code 같은 요약만 남긴다.

## Technical Indicators

기술적 지표는 증권사 API가 직접 제공하는 주문 판단값이 아니라, SDK가 표준화된 OHLCV 캔들 위에서 계산하는 read-only 계산 레이어다. 현재 `SMA`, `EMA`, `Disparity`, `MA slope`, `RSI`, `MACD`, `Stochastic`, `Volume ratio`, `Value ratio`, `OBV`, `MFI`, `ATR`, `Bollinger Bands`, `Standard deviation`, 캔들 패턴을 제공한다.

```js
const { technical } = createSecurityApiServices();

const indicators = await technical.getDomesticStockIndicators("ls", "005930", {
  count: 120,
  smaPeriods: [5, 20, 60],
  emaPeriods: [12, 26],
  disparityPeriods: [20, 60],
  rsiPeriod: 14,
  volumeRatioPeriod: 20,
  valueRatioPeriod: 20,
  atrPeriod: 14,
});
if (!indicators.ok) {
  throw indicators.error;
}

console.log(indicators.data.latest.trend.sma.p20, indicators.data.latest.momentum.rsi);
console.log(indicators.data.latest.flags.maAlignment, indicators.data.latest.flags.valueRatioAlert);

const calculated = technical.calculateFromCandles(indicators.data.candles, {
  smaPeriods: [10],
});
```

이 레이어는 매수/매도 추천을 반환하지 않는다. 전략 앱은 `latest`, `indicators`, `candles`를 입력값으로 받아 별도의 전략/알림/주문 승인 로직을 구성한다.

## Relative Strength

상대강도는 대상 캔들과 benchmark 캔들을 비교한다. KOSPI/KOSDAQ 같은 지수 benchmark는 SDK가 조회할 수 있고, 섹터 benchmark는 외부 앱이 섹터 지수 캔들을 넣는 방식으로 시작한다.

```js
const { relativeStrength } = createSecurityApiServices();

const rs = await relativeStrength.getDomesticStockRelativeStrength("ls", "005930", {
  benchmark: { type: "index", code: "kospi" },
  periods: [20, 60],
});
if (!rs.ok) {
  throw rs.error;
}

console.log(rs.data.latest.p20.direction, rs.data.latest.p20.spread);
```

섹터 대비 상대강도는 `benchmarkCandles`를 명시한다.

```js
const sectorRs = relativeStrength.calculateRelativeStrength({
  targetCandles: stockCandles,
  benchmarkCandles: semiconductorSectorCandles,
  benchmark: { type: "sector", code: "semiconductor" },
}, {
  periods: [20, 60],
});
```

섹터 지수가 없고 섹터 구성 종목 티커만 있다면 basket benchmark를 만들 수 있다. SDK는 각 종목을 첫 공통 날짜 기준 100으로 정규화한 뒤 동일가중 basket을 만든다.

```js
const basketRs = await relativeStrength.getDomesticStockRelativeStrengthVsBasket("kiwoom", "005930", {
  basketCode: "semiconductor",
  basketName: "반도체",
  basketSymbols: ["000660", "042700", "039030"],
  basketCandlesBySymbol, // optional cache; 없으면 basketSymbols를 read-only로 조회
  periods: [20, 60],
  excludeTargetFromBasket: true,
});
```

입력 명세는 [Market Signal Input Contract](market-signal-input-contract.md)를 기준으로 한다.

## Market Breadth

시장 폭 지표는 전체 종목 universe가 필요하므로 SDK가 기본으로 대량 live 호출을 수행하지 않는다. 외부 앱이 캐시한 시장 스냅샷이나 종목별 캔들을 넣어 계산한다.

```js
const { marketBreadth } = createSecurityApiServices();

const adl = marketBreadth.calculateAdvanceDeclineLine([
  { date: "20260520", advancing: 500, declining: 300, unchanged: 50 },
  { date: "20260521", advancing: 350, declining: 450, unchanged: 60 },
]);

const aboveMa20 = marketBreadth.calculateAboveMovingAverageRatio(candlesBySymbol, {
  market: "kospi",
  period: 20,
});
```

## Signal Inputs With Indicators

전략 앱은 `SignalInputService`에서 기술지표, 상대강도, 시장 폭을 선택적으로 함께 받을 수 있다. 비용이 큰 시장 폭 입력은 기본 수집하지 않으며, 외부 앱이 캐시한 universe snapshot을 넣는다.

```js
const signalInputs = await signals.getDomesticStockSignalInputs("ls", "005930", {
  includeTechnicalIndicators: true,
  includeRelativeStrength: true,
  includeMarketBreadth: true,
  benchmark: { type: "index", code: "kospi" },
  candlesBySymbol,
});

console.log(signalInputs.data.signals.technical.rsiZone);
console.log(signalInputs.data.signals.relativeStrength.p20.direction);
console.log(signalInputs.data.signals.marketBreadth.direction);
```

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
const kisCaps = getCapabilities("kis");

if (lsCaps.supports("overseasStock.quote.currentPrice")) {
  // show overseas quote feature
}

if (kisCaps.hasMetadata("overseasStock.quote.currentPrice")) {
  // KIS overseas quote docs are discoverable, but not serviceReady yet.
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

const preview = await order.buyDomesticStock("kis", {
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
