# Security API Reference

키움증권과 LS증권의 공식 Open API 문서를 AI 코딩 참고용 Markdown 레퍼런스로 생성하는 저장소입니다.

## 사용법

```bash
npm run generate:docs
npm run validate:docs
npm run generate:manifest
npm run validate:manifest
npm run examples:mock
```

Markdown 레퍼런스는 `docs/`에, SDK용 JSON manifest는 `data/generated/`에, 원본 JSON 스냅샷은 `data/raw/`에 저장됩니다.

## SDK 확장 계획

문서 레퍼런스를 공통 증권사 API SDK로 확장하기 위한 방향성은 [docs/sdk-architecture-plan.md](docs/sdk-architecture-plan.md)에 정리되어 있습니다.

초기 SDK 구현은 `data/generated/kiwoom-manifest.json`과 `data/generated/ls-manifest.json`을 기준으로 API ID/TR 코드, 엔드포인트, 헤더, 요청/응답 필드, 인증 필요 여부를 조회하도록 설계합니다.

```js
import { createMetadataRegistry } from "security-api-reference/metadata";

const registry = await createMetadataRegistry();
const endpoint = registry.getEndpoint("kiwoom", "ka10001", { env: "mock" });
const requestFields = registry.getRequestFields("ls", "t1101");
```

Core SDK 유틸리티는 `security-api-reference/core`에서 사용할 수 있습니다.

```js
import { HttpClient, MemoryTokenStore, BrokerError } from "security-api-reference/core";

const http = new HttpClient({ defaultTimeoutMs: 10_000 });
const tokens = new MemoryTokenStore();
```

키움 REST API는 API ID 기반으로 호출할 수 있습니다.

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

LS증권 OPEN API는 TR 코드 기반으로 호출할 수 있습니다.

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

증권사별 문서상 지원 기능은 Capability Layer에서 조회할 수 있습니다.

```js
import { getCapabilities } from "security-api-reference";

const caps = getCapabilities("ls");

caps.supports("quote.domesticStock"); // true
caps.findApis("quote.domesticStock.currentPrice");
```

국내주식 시세 조회 도메인 서비스는 현재가, 호가, 복수 현재가 조회를 제공합니다.
시장 데이터 서비스는 종목 기본정보, 일봉/분봉 OHLCV 조회를 제공합니다.
스캐너 서비스는 거래량/거래대금/등락률 랭킹으로 종목 탐색을 돕습니다.
시장 컨텍스트 서비스는 KOSPI/KOSDAQ 같은 주요 지수 현재가, 일봉 추이, 시장 폭 스냅샷을 제공합니다. LS는 장전/장후 예상지수도 제공합니다.
시장 수급 서비스는 개인/외국인/기관 순매수와 프로그램 매매 흐름을 공통 형태로 제공합니다.
시그널 입력 서비스는 현재가, 호가, OHLCV, 랭킹을 조합해 전략 앱이 바로 읽을 수 있는 판단 입력값을 만듭니다. 옵션을 켜면 시장 스냅샷, 지수 일봉, 투자자 수급, 프로그램 매매 흐름도 같은 입력값에 포함합니다. 초기 스냅샷에 실시간 체결/호가 메시지를 누적해 갱신형 입력값으로 사용할 수도 있습니다.
계좌 조회 도메인 서비스는 예수금/주문가능금액, 잔고/평가손익, 주문/체결 내역 조회를 제공합니다.
주문 서비스는 기본값으로 dry-run 요청만 생성합니다. 실주문은 `dryRun: false`, `confirm: true`가 모두 필요하고, 시장가 실주문은 `confirmMarketOrder: true`도 필요합니다.
실시간 서비스는 WebSocket 구독 요청, 수신 메시지 정규화, 자동 재연결과 구독 복구를 제공합니다.

```js
import { AccountService, KiwoomClient, LsClient, MarketContextService, MarketFlowService, MarketDataService, OrderService, QuoteService, RealtimeService, ScannerService, SignalInputService } from "security-api-reference";

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
const scanner = new ScannerService(clients);
const marketContext = new MarketContextService(clients);
const marketFlow = new MarketFlowService(clients);
const signals = new SignalInputService(clients);
const account = new AccountService(clients);
const order = new OrderService(clients);
const realtime = new RealtimeService(clients);

const price = await quote.getDomesticStockCurrentPrice("kiwoom", "005930");
const orderBook = await quote.getDomesticStockOrderBook("kiwoom", "005930");
const prices = await quote.getDomesticStockMultiCurrentPrice("kiwoom", ["005930", "000660"]);
const dailyCandles = await marketData.getDomesticStockDailyCandles("kiwoom", "005930", {
  baseDate: "20260519"
});
const minuteCandles = await marketData.getDomesticStockMinuteCandles("kiwoom", "005930", {
  intervalMinutes: 5
});
const volumeRankings = await scanner.getDomesticStockVolumeRankings("kiwoom", {
  market: "kospi"
});
const valueRankings = await scanner.getDomesticStockValueRankings("kiwoom");
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
  includeMarketContext: true,
  includeMarketIndexCandles: true,
  includeMarketFlow: true,
  intervalMinutes: 5,
  market: "kospi",
  baseDate: "20260519"
});
const realtimeSignalInputs = await signals.subscribeDomesticStockSignalInputs("kiwoom", "005930", {
  onUpdate: (data) => console.log(data.symbol, data.metrics.price.current)
}, {
  initialInputs: signalInputs.data,
  intervalMinutes: 5
});
const cash = await account.getDomesticStockCash("kiwoom");
const balance = await account.getDomesticStockBalance("kiwoom");
const orderHistory = await account.getDomesticStockOrderHistory("kiwoom", {
  orderDate: "20260518",
  symbol: "005930"
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
```

실제 API 키 없이 호출 흐름을 확인하려면 [examples](examples/README.md)를 사용합니다.

## 공식 출처

- 키움 REST API: https://openapi.kiwoom.com/guide/apiguide?dummyVal=0
- LS증권 OPEN API: https://openapi.ls-sec.co.kr/apiservice?group_id=ffd2def7-a118-40f7-a0ab-cd4c6a538a90&api_id=33bd887a-6652-4209-88cd-5324bc7c5e36
