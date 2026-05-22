# 증권사 Open API Markdown 레퍼런스

생성 시각: 2026-05-18T05:16:18.548Z

이 문서는 공식 공개 API 문서를 AI 코딩 시 빠르게 검색하고 인용하기 쉽도록 작은 Markdown 파일 단위로 재구성한 레퍼런스입니다. 원본 JSON 스냅샷은 `data/raw/`에 보존합니다.

SDK 구현에서 직접 참조하기 쉬운 정규화 manifest는 `data/generated/kiwoom-manifest.json`, `data/generated/ls-manifest.json`, `data/generated/broker-manifest-summary.json`에 생성합니다.

## 범위

| 증권사 | API/문서 수 | 추가 항목 | 공식 출처 |
| --- | ---: | ---: | --- |
| 키움증권 | 207개 API | 오류코드 33개 | https://openapi.kiwoom.com/guide/apiguide?dummyVal=0 |
| LS증권 | 41개 API 페이지 / 365개 TR | 8개 그룹 | https://openapi.ls-sec.co.kr/apiservice?group_id=ffd2def7-a118-40f7-a0ab-cd4c6a538a90&api_id=33bd887a-6652-4209-88cd-5324bc7c5e36 |

## 검색 가이드

- API ID/TR 코드로 찾기: `rg "ka10001|t1101|token" docs/`
- 요청/응답 필드로 찾기: `rg "종목코드|authorization|cont-yn" docs/`
- 증권사별 보기: [키움증권](kiwoom/README.md), [LS증권](ls/README.md)
- SDK 확장 계획: [SecurityAPI SDK Architecture Plan](sdk-architecture-plan.md)
- SDK 사용 가이드: [SDK Usage Guide](sdk-usage-guide.md)
- SDK 배포/참조 가이드: [SDK Distribution Guide](sdk-distribution-guide.md)
- 기술지표/상대강도/시장폭 설계: [Technical Indicators And Market Signals Design](technical-indicators-and-market-signals-design.md)
- 시장 신호 입력 명세: [Market Signal Input Contract](market-signal-input-contract.md)
- Live read-only 검증 계획: [Live Read-only Verification Plan](live-readonly-verification-plan.md)
- Live read-only 검증 매트릭스: [Live Read-only Verification Matrix](live-readonly-verification-matrix.md)
- Live read-only 감사 기록: [2026-05-19](audits/live-readonly-2026-05-19.md), [2026-05-22](audits/live-readonly-2026-05-22.md)
- SDK manifest 찾기: `jq '.apis.ka10001' data/generated/kiwoom-manifest.json`, `jq '.apis.t1101' data/generated/ls-manifest.json`

## 생성 규칙

- 빈 값은 추측하지 않고 `-` 또는 `문서 미기재`로 표기합니다.
- 원문 필드명, API ID, TR 코드, URL은 공식 문서 값을 유지합니다.
- 로그인 후 접근 자료나 실제 주문/조회 호출은 사용하지 않습니다.

## Manifest 검증

```bash
npm run generate:manifest
npm run validate:manifest
```

검증은 키움 207개 API/33개 오류코드, LS 8개 그룹/41개 API 페이지/365개 TR 카운트와 주요 샘플 항목의 필드 수를 확인합니다.

## Metadata Registry

SDK 코드에서는 Markdown이나 raw JSON 대신 Metadata Registry를 사용합니다.

```js
import { createMetadataRegistry } from "security-api-reference/metadata";

const registry = await createMetadataRegistry();
registry.requireEntry("kiwoom", "ka10001");
registry.getEndpoint("ls", "t1101");
registry.getRequestFields("kiwoom", "ka10001");
```

## Core SDK

Broker Client가 공유할 HTTP/토큰/에러 기반은 `security-api-reference/core`에서 제공합니다.

```js
import { BrokerError, HttpClient, MemoryTokenStore } from "security-api-reference/core";
```

Core SDK는 실제 증권사 인증/주문 의미를 알지 않고, fetch 호출, timeout, 응답 파싱, header 정규화, token cache, 공통 에러 형태까지만 담당합니다.

## Broker Clients

현재 키움 REST API client와 LS증권 OPEN API client가 구현되어 있습니다.

```js
import { KiwoomClient } from "security-api-reference";

const kiwoom = new KiwoomClient({
  appKey: process.env.KIWOOM_APP_KEY,
  secretKey: process.env.KIWOOM_SECRET_KEY,
  env: "mock"
});

const result = await kiwoom.request("ka10001", {
  stk_cd: "005930"
});
```

`KiwoomClient`는 manifest에서 endpoint와 content type을 조회하고, 토큰 발급/캐시, `authorization`, `api-id`, 연속조회 헤더, `return_code` 기반 업무 오류 변환을 처리합니다.

```js
import { LsClient } from "security-api-reference";

const ls = new LsClient({
  appKey: process.env.LS_APP_KEY,
  appSecretKey: process.env.LS_APP_SECRET_KEY,
  macAddress: process.env.LS_MAC_ADDRESS
});

const result = await ls.request("t1101", {
  t1101InBlock: { shcode: "005930" }
});
```

`LsClient`는 manifest에서 endpoint와 content type을 조회하고, 토큰 발급/캐시, `authorization`, `tr_cd`, `tr_cont`, `tr_cont_key`, `mac_address` 헤더, `rsp_cd` 기반 업무 오류 변환을 처리합니다.

## Capability Layer

증권사별 기능 상태는 Capability Layer에서 조회합니다. 이 레이어는 실제 도메인 함수를 실행하지 않고, 기능과 API ID/TR 코드의 연결을 제공합니다.

Capability 상태는 다음처럼 구분합니다.

- `serviceReady`: 서비스 메서드, 요청 생성, 응답 정규화, 테스트가 준비된 기능
- `metadataOnly`: 공식 문서/manifest/API 매핑은 있지만 아직 서비스 구현 전인 기능
- `parked`: 공식 문서/manifest/API 매핑은 있지만 현재 제품 범위 밖으로 보류한 기능
- `composed`: 여러 service-ready 기능을 조합한 SDK 계산 기능

```js
import { getCapabilities } from "security-api-reference";

const caps = getCapabilities("kiwoom");

// 서비스에서 바로 사용할 수 있는 기능인지 확인
caps.supports("order.domesticStock");

// 공식 문서/manifest 매핑이 있는지 확인
caps.hasMetadata("account.domesticStock.balance");

// 매핑된 API ID/TR 코드 조회
caps.findApis("account.domesticStock.balance");
```

매핑된 API ID/TR 코드는 `npm test`에서 generated manifest 존재 여부를 검증합니다.

## Domain Services

도메인 서비스는 Broker Client를 사용하되, 결과를 공통 형태로 얇게 정리합니다.
현재 국내주식 시세 조회, 시장 데이터 조회, 기술적 지표 계산, 상대강도 계산, 시장 폭 계산, 종목 스캐너/조건검색, 시장 컨텍스트 스냅샷/지수 추이/예상지수, 시장 수급/프로그램 매매 조회, 시그널 입력값 생성, 계좌 기본 조회, dry-run 기본 주문, 실시간 WebSocket 구독/장운영 상태 서비스와 LS 해외주식 현재가/호가/종목정보/마스터/차트/시간대별/기술적 지표/계좌/주문/실시간 서비스를 제공합니다.

외부 서버/앱 연동을 위한 안정화 설계와 사용법은 [SDK Usage Guide](sdk-usage-guide.md), [SDK Distribution Guide](sdk-distribution-guide.md), [SDK Stabilization Goal Plan](sdk-stabilization-goal-plan.md), [Live Integration Readiness](live-integration-readiness.md), [Live Read-only Verification Plan](live-readonly-verification-plan.md), [Order Guard Verification Plan](order-guard-verification-plan.md), [Broker Error And Reject Policy](broker-error-reject-policy.md), [Public SDK Contract](public-sdk-contract.md), [Production Readiness Checklist](production-readiness-checklist.md)를 기준으로 합니다.

```js
import { AccountService, KiwoomClient, LsClient, MarketBreadthService, MarketContextService, MarketFlowService, MarketDataService, OrderService, OverseasStockAccountService, OverseasStockMarketDataService, OverseasStockOrderService, OverseasStockQuoteService, OverseasStockRealtimeService, QuoteService, RealtimeService, RelativeStrengthService, ScannerService, SignalInputService, TechnicalIndicatorService } from "security-api-reference";

const clients = {
  kiwoom: new KiwoomClient({
    appKey: process.env.KIWOOM_APP_KEY,
    secretKey: process.env.KIWOOM_SECRET_KEY,
    env: "mock"
  }),
  ls: new LsClient({
    appKey: process.env.LS_APP_KEY,
    secretKey: process.env.LS_SECRET_KEY,
    env: "mock"
  })
};

const quote = new QuoteService(clients);
const marketData = new MarketDataService(clients);
const technical = new TechnicalIndicatorService(clients);
const relativeStrength = new RelativeStrengthService(clients);
const marketBreadth = new MarketBreadthService();
const scanner = new ScannerService(clients);
const marketContext = new MarketContextService(clients);
const marketFlow = new MarketFlowService(clients);
const signals = new SignalInputService(clients);
const account = new AccountService(clients);
const order = new OrderService(clients);
const realtime = new RealtimeService(clients);
const overseasAccount = new OverseasStockAccountService(clients);
const overseasOrder = new OverseasStockOrderService(clients);
const overseasRealtime = new OverseasStockRealtimeService(clients);

const currentPrice = await quote.getDomesticStockCurrentPrice("kiwoom", "005930");
const orderBook = await quote.getDomesticStockOrderBook("kiwoom", "005930");
const multiPrices = await quote.getDomesticStockMultiCurrentPrice("kiwoom", ["005930", "000660"]);
const basicInfo = await marketData.getDomesticStockBasicInfo("kiwoom", "005930");
const dailyCandles = await marketData.getDomesticStockDailyCandles("kiwoom", "005930", {
  baseDate: "20260519"
});
const minuteCandles = await marketData.getDomesticStockMinuteCandles("kiwoom", "005930", {
  intervalMinutes: 5
});
const indicators = await technical.getDomesticStockIndicators("kiwoom", "005930", {
  smaPeriods: [5, 20, 60],
  rsiPeriod: 14
});
const rs = await relativeStrength.getDomesticStockRelativeStrength("kiwoom", "005930", {
  benchmark: { type: "index", code: "kospi" },
  periods: [20, 60]
});
const volumeRankings = await scanner.getDomesticStockVolumeRankings("kiwoom", {
  market: "kospi"
});
const valueRankings = await scanner.getDomesticStockValueRankings("kiwoom");
const conditions = await scanner.listConditionSearches("kiwoom");
const conditionMatches = await scanner.searchCondition("kiwoom", {
  seq: "4",
  name: "거래량 급증"
});
const marketSnapshot = await marketContext.getDomesticMarketSnapshot("kiwoom", {
  indexes: ["kospi", "kosdaq"]
});
const indexCandles = await marketContext.getDomesticIndexDailyCandles("kiwoom", "kospi", {
  baseDate: "20260519"
});
const expectedIndex = await marketContext.getDomesticExpectedIndex("ls", "kospi", {
  session: "preopen"
});
const investorFlow = await marketFlow.getDomesticInvestorFlow("kiwoom", "kospi", {
  unit: "amount",
  baseDate: "20260519"
});
const programTrading = await marketFlow.getProgramTradingTrend("kiwoom", "kospi", {
  unit: "amount",
  date: "20260519"
});
const signalInputs = await signals.getDomesticStockSignalInputs("kiwoom", "005930", {
  includeRankings: true,
  includeConditionSearch: true,
  includeMarketContext: true,
  includeMarketIndexCandles: true,
  includeMarketFlow: true,
  conditionSearches: [{ seq: "4", name: "거래량 급증" }],
  intervalMinutes: 5,
  market: "kospi",
  baseDate: "20260519"
});
const cash = await account.getDomesticStockCash("kiwoom");
const balance = await account.getDomesticStockBalance("kiwoom");
const orderHistory = await account.getDomesticStockOrderHistory("kiwoom", {
  orderDate: "20260518",
  symbol: "005930"
});
const overseasCash = await overseasAccount.getOverseasStockCash("ls", {
  currencyCode: "ALL"
});
const overseasBalance = await overseasAccount.getOverseasStockBalance("ls", {
  baseDate: "20260519",
  currencyCode: "ALL",
  balanceType: "00"
});
const overseasBuyDryRun = await overseasOrder.buyOverseasStock("ls", {
  symbol: "PLTR",
  marketCode: "82",
  currencyCode: "USD",
  tradingSession: "regular",
  quantity: 5,
  price: 70
});
const buyDryRun = await order.buyDomesticStock("kiwoom", {
  symbol: "005930",
  quantity: 1,
  estimatedPrice: 70000
}, {
  maxOrderAmount: 100000,
  allowedSymbols: ["005930"]
});
const tradeStream = await realtime.subscribeDomesticStockTrades("kiwoom", "005930", {
  onMessage: (message) => console.log(message.symbol, message.price, message.tradeQuantity)
});
const marketStatusStream = await realtime.subscribeMarketStatus("kiwoom", {
  onMessage: (message) => console.log(message.session, message.phase, message.eventName)
});
const overseasTradeStream = await overseasRealtime.subscribeOverseasStockTrades("ls", {
  symbol: "TSLA",
  exchangeCode: "82"
}, {
  onMessage: (message) => console.log(message.symbol, message.price, message.tradeQuantity)
});
```

현재 구현 범위는 `quote.domesticStock.currentPrice`, `quote.domesticStock.orderBook`, `quote.domesticStock.multiCurrentPrice`, `marketData.domesticStock.basicInfo`, `marketData.domesticStock.dailyCandles`, `marketData.domesticStock.minuteCandles`, `technical.domesticStock.indicators`, `relativeStrength.domesticStock.benchmark`, `marketBreadth.domesticMarket.indicators`, `scanner.domesticStock.volumeRanking`, `scanner.domesticStock.valueRanking`, `scanner.domesticStock.changeRateRanking`, `scanner.conditionSearch.list`, `scanner.conditionSearch.search`, `scanner.conditionSearch.realtime`, `marketContext.domesticIndex.current`, `marketContext.domesticIndex.dailyCandles`, `marketContext.domesticIndex.expected`, `marketContext.domesticMarket.snapshot`, `marketFlow.domesticInvestor.netBuy`, `marketFlow.programTrading.trend`, `signal.domesticStock.inputs`, `signal.domesticStock.realtimeInputs`, `account.domesticStock.cash`, `account.domesticStock.balance`, `account.domesticStock.orderHistory`, `order.domesticStock.buy`, `order.domesticStock.sell`, `order.domesticStock.modify`, `order.domesticStock.cancel`, `realtime.domesticStock.trade`, `realtime.domesticStock.orderBook`, `realtime.domesticStock.orderEvent`, `realtime.domesticStock.balance`, `realtime.market.status`, `overseasStock.quote.currentPrice`, `overseasStock.quote.orderBook`, `overseasStock.marketData.basicInfo`, `overseasStock.marketData.master`, `overseasStock.marketData.candles`, `overseasStock.marketData.timeSeries`, `overseasStock.technical.indicators`, `overseasStock.account.cash`, `overseasStock.account.balance`, `overseasStock.account.orderHistory`, `overseasStock.account.reservedOrderHistory`, `overseasStock.order.new`, `overseasStock.order.modify`, `overseasStock.order.cancel`, `overseasStock.order.reserve`, `overseasStock.realtime.trade`, `overseasStock.realtime.orderBook`, `overseasStock.realtime.orderEvent`입니다. 조건검색 서비스는 키움 `ka10171`/`ka10172`/`ka10173`/`ka10174`, LS `t1866`/`t1859`/`t1860`/`AFR` 차이를 감추고 조건식 목록, 검색 결과, 실시간 조건 이벤트를 공통 필드로 정리합니다. 시장 컨텍스트 서비스는 주요 지수 현재가와 상승/보합/하락 종목 수, 지수 일봉 추이, LS 예상지수를 조합해 시장 폭과 방향성을 제공하지만, 매매 판단은 포함하지 않습니다. 기술지표 서비스는 표준 OHLCV 캔들 위에서 SMA/EMA/RSI/MACD/Bollinger Bands 같은 계산값을 만들며, 상대강도와 시장폭 확장은 [Technical Indicators And Market Signals Design](technical-indicators-and-market-signals-design.md)을 기준으로 진행합니다. 시장 수급 서비스는 개인/외국인/기관/세부 기관 투자자 순매수와 전체/차익/비차익 프로그램 매매 흐름을 공통 형태로 제공합니다. 시그널 입력 서비스는 매수/매도 판단을 내리지 않고 가격 모멘텀, 거래량 급증, 조건검색 매칭 여부, 호가 불균형, 당일 위치 같은 계산 입력값만 제공합니다. 옵션으로 조건검색, 시장 스냅샷/지수 일봉/예상지수/수급/프로그램 매매를 같은 입력값에 포함할 수 있습니다. `signal.domesticStock.realtimeInputs`는 초기 스냅샷에 실시간 체결/호가/장운영 상태/조건검색 이벤트를 누적해 같은 계산 입력값을 갱신합니다. 주문 서비스는 기본 dry-run이며 실주문은 `dryRun: false`, `confirm: true`가 모두 필요하고 retry를 비활성화합니다. 안전장치 옵션으로 `maxOrderAmount`, `allowedSymbols`, `blockedSymbols`, `confirmMarketOrder`, `expectedRequest`를 지원합니다. 실시간 서비스는 Capability Layer에 등록된 WebSocket API만 구독하며, 체결/호가/주문 이벤트/장운영 상태는 `kind`, `symbol`, `price`, `asks`, `bids`, `orderId`, `executedQuantity`, `session`, `phase`, `eventName` 같은 공통 필드로 정규화합니다. 해외주식 실시간 서비스는 LS `GSC`, `GSH`, `AS0`~`AS4`를 같은 모델로 구독하고 `market: "overseas"`와 `eventType`을 포함해 정규화합니다. WebSocket Client는 중복 구독 방지, 연결 종료 시 backoff 재연결, 기존 구독 복구, heartbeat stale 감지, `connected`/`disconnected`/`reconnecting`/`resubscribed` 상태 이벤트를 지원합니다. 실행 환경에서 헤더 지정이 필요한 경우 `webSocketFactory` 또는 호환 WebSocket 구현을 주입합니다.
