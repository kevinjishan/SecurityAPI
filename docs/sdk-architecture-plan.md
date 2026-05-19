# SecurityAPI SDK Architecture Plan

이 문서는 현재의 API 문서/메타데이터 저장소를 재사용 가능한 증권사 API SDK로 확장하기 위한 종합 방향성과 레이어별 구현 계획을 정리한다.

상품 확장 범위는 [Core Expansion Roadmap](core-expansion-roadmap.md)을 기준으로 관리한다. 현재 서비스 확장 목표는 국내주식 core 유지와 해외주식 레이어 추가까지이며, 선물옵션/ELW/해외선물 같은 파생상품 서비스화는 이번 범위에서 제외한다. core 구현 이후의 설계형 후속 작업은 [SDK Stabilization Goal Plan](sdk-stabilization-goal-plan.md)의 단계별 Goal을 기준으로 진행한다.

## 1. 방향성

현재 저장소의 1차 자산은 다음이다.

- `docs/`: AI 코딩 참고용 Markdown 레퍼런스
- `data/raw/`: 공식 문서에서 수집한 원본 JSON 스냅샷
- `scripts/`: 공식 문서 재수집 및 문서 검증 스크립트

다음 단계의 목표는 이 저장소 위에 얇은 SDK를 추가하는 것이다. 1차 SDK는 도메인 의미를 크게 추상화하지 않고, 문서의 API ID/TR 코드와 요청 파라미터만 알면 안전하게 호출할 수 있는 공통 호출 계층을 제공한다.

```ts
await kiwoom.request("ka10001", { stk_cd: "005930" });

await ls.request("t1101", {
  t1101InBlock: { shcode: "005930" }
});
```

핵심 원칙은 다음과 같다.

- 공통화 대상은 인증, 요청 전송, 헤더 구성, 에러 정규화, 연속조회 보조 같은 반복 작업이다.
- API 의미, 요청/응답 필드명, 주문 파라미터, 실시간 시세 방식은 증권사별 특성을 유지한다.
- 응답은 정규화된 wrapper와 원본 응답을 모두 제공한다.
- 실제 API 키 없이도 테스트 가능한 구조를 우선한다.
- 주문 API 자동 retry처럼 위험한 동작은 기본 제공하지 않는다.

## 2. 최종 계층 구조

```text
Application / Strategy Layer
  - 자동매매 전략
  - 포트폴리오/리밸런싱
  - 알림/리포트

Signal / Decision Input Layer
  - buildSignalInputs(symbol)
  - subscribeSignalInputs(symbol)
  - 가격 모멘텀/거래량 급증/호가 불균형 계산
  - 매수/매도 판단은 하지 않음

Domain Service Layer
  - getCurrentPrice(symbol)
  - getBalance()
  - placeOrder(order)
  - cancelOrder(orderId)

Broker Adapter Layer
  - KiwoomAdapter
  - LsAdapter
  - 증권사별 필드 변환
  - capability 기반 지원 여부 판단

Common SDK Layer
  - KiwoomClient.request(apiId, params, options)
  - LsClient.request(trCode, params, options)
  - 인증/토큰 캐시
  - HTTP 요청/응답 처리
  - timeout/retry/error/pagination

Metadata Layer
  - data/raw/*
  - data/generated/*-manifest.json
  - docs/*
```

이 저장소에서 우선 구현할 범위는 `Metadata Layer`와 `Common SDK Layer`다. `Broker Adapter Layer`의 초기 형태는 `KiwoomClient`, `LsClient`에 포함해도 된다. `Domain Service Layer`와 `Signal / Decision Input Layer`는 조회성 서비스부터 점진적으로 확장한다.

## 3. 레이어별 계획

### 3.1 Metadata Layer

목표는 런타임 SDK가 Markdown을 파싱하지 않도록, `data/raw`에서 호출에 필요한 최소 manifest를 생성하는 것이다.

상세 설계는 [Metadata Layer Detailed Plan](metadata-layer-plan.md)을 기준으로 한다.

추가 파일:

```text
data/generated/kiwoom-manifest.json
data/generated/ls-manifest.json
scripts/generate-manifest.mjs
```

manifest 예시:

```json
{
  "ka10001": {
    "broker": "kiwoom",
    "name": "주식기본정보요청",
    "method": "POST",
    "path": "/api/dostk/stkinfo",
    "contentType": "application/json;charset=UTF-8",
    "authRequired": true,
    "requestFields": ["stk_cd"],
    "responseFields": ["stk_cd", "stk_nm", "cur_prc"]
  }
}
```

구현 범위:

- 키움은 `data/raw/kiwoom/api-info-list.json`에서 `apiInfo`, `commonHeader`, `apiTrIo`를 추출한다.
- LS는 `data/raw/ls/api-details-by-id.json`, `trs-by-api-id.json`, `properties-by-tr-id.json`를 조합한다.
- 필수 필드, content type, endpoint, rate limit, auth 여부, 연속조회 헤더를 manifest에 포함한다.
- manifest 생성 후 기존 `npm run validate:docs`와 별도로 `npm run validate:manifest`를 추가한다.

완료 기준:

- 키움 manifest API 수가 207개다.
- LS manifest TR 수가 365개다.
- 각 항목은 `method`, `path`, `contentType`, `authRequired`를 가진다.

### 3.2 Core SDK Layer

목표는 증권사와 무관하게 재사용되는 HTTP, 토큰 저장, 에러 타입을 제공하는 것이다.

상세 설계는 [Core SDK Layer Detailed Plan](core-sdk-layer-plan.md)을 기준으로 한다.

예상 구조:

```text
src/core/HttpClient.ts
src/core/TokenStore.ts
src/core/BrokerError.ts
src/core/types.ts
```

공통 타입:

```ts
export type Broker = "kiwoom" | "ls";

export type BrokerResponse<T = unknown> = {
  ok: boolean;
  broker: Broker;
  id: string;
  data: T | null;
  raw: unknown;
  headers: Record<string, string>;
  continuation?: {
    hasNext: boolean;
    key?: string;
  };
  error?: BrokerError;
};
```

구현 범위:

- `HttpClient`: fetch wrapper, timeout, JSON/text 파싱, header normalize.
- `TokenStore`: memory token cache, 만료 시각 관리, clear 기능.
- `BrokerError`: HTTP error, auth error, API error, unsupported capability error 구분.
- retry는 기본 off 또는 조회 API 한정 opt-in으로 둔다.

완료 기준:

- fetch를 mock으로 주입할 수 있다.
- 네트워크 없이 token/cache/error 테스트가 가능하다.
- 응답 원본과 정규화된 `BrokerResponse`가 함께 반환된다.

### 3.3 Kiwoom Client Layer

목표는 키움 REST API 문서의 API ID를 그대로 사용해 호출할 수 있게 하는 것이다.

상세 설계는 [Broker Client Layer Detailed Plan](broker-client-layer-plan.md)을 기준으로 한다.

예상 사용법:

```ts
const kiwoom = new KiwoomClient({
  appKey: process.env.KIWOOM_APP_KEY!,
  secretKey: process.env.KIWOOM_SECRET_KEY!,
  env: "mock"
});

const res = await kiwoom.request("ka10001", {
  stk_cd: "005930"
});
```

구현 범위:

- 토큰 발급: `au10001`, `/oauth2/token`.
- 토큰 폐기: `au10002`, `/oauth2/revoke`.
- 도메인 선택: `prod`, `dev`, `mock`.
- 요청 헤더 자동 구성:
  - `authorization: Bearer {token}`
  - `api-id: {apiId}`
  - `cont-yn`, `next-key` optional
  - `Content-Type` manifest 기반
- 요청 body는 기본 JSON.
- 응답 헤더에서 `cont-yn`, `next-key`를 읽어 `continuation`으로 제공한다.
- API 응답의 `return_code`, `return_msg`가 있으면 공통 에러 처리에 반영한다.

완료 기준:

- `request("ka10001", params)`가 올바른 URL, 헤더, body로 fetch를 호출한다.
- 토큰이 없거나 만료되면 자동 발급한다.
- 연속조회 옵션을 넣으면 다음 요청 헤더에 반영한다.

### 3.4 LS Client Layer

목표는 LS증권 OPEN API의 TR 코드를 그대로 사용해 호출할 수 있게 하는 것이다.

상세 설계는 [Broker Client Layer Detailed Plan](broker-client-layer-plan.md)을 기준으로 한다.

예상 사용법:

```ts
const ls = new LsClient({
  appKey: process.env.LS_APP_KEY!,
  appSecretKey: process.env.LS_APP_SECRET_KEY!,
  env: "prod"
});

const res = await ls.request("t1101", {
  t1101InBlock: { shcode: "005930" }
});
```

구현 범위:

- 토큰 발급: `token`, `/oauth2/token`.
- 토큰 폐기: `revoke`, `/oauth2/revoke`.
- 도메인은 공식 문서의 `domain`을 기본 사용한다.
- 요청 헤더 자동 구성:
  - `authorization: Bearer {token}`
  - `tr_cd: {trCode}`
  - `tr_cont: N` 기본값
  - `tr_cont_key` optional
  - `Content-Type` manifest 기반
  - `mac_address`는 설정값이 있을 때만 자동 삽입하고, 필수인데 없으면 명확히 실패한다.
- JSON API와 form-urlencoded OAuth 요청을 분리 처리한다.
- 응답 헤더에서 `tr_cont`, `tr_cont_key`를 읽어 `continuation`으로 제공한다.

완료 기준:

- `request("t1101", params)`가 올바른 URL, 헤더, body로 fetch를 호출한다.
- TR 코드 중복이 있을 경우 manifest에서 충돌을 감지한다.
- `mac_address`가 필요한 요청에서 설정 누락 시 `MissingRequiredConfigError`를 반환한다.

### 3.5 Broker Adapter / Capability Layer

이 레이어는 1차 SDK에서 기능 상태와 API ID/TR 코드의 연결표로 구현한다.

목표는 증권사별로 “서비스에서 바로 사용 가능한 기능”과 “문서/manifest에만 존재하는 기능”을 명시적으로 구분하는 것이다.

구현 파일:

```text
src/capabilities/definitions.mjs
src/capabilities/kiwoom.mjs
src/capabilities/ls.mjs
src/capabilities/registry.mjs
src/capabilities/index.mjs
```

예시:

```js
import { getCapabilities } from "security-api-reference";

const caps = getCapabilities("ls");

// service-ready 기능만 true
caps.supports("quote.domesticStock.currentPrice");

// 문서/manifest 매핑이 있으면 true
caps.hasMetadata("overseasStock.quote.currentPrice");

// 기본값은 상태와 무관하게 매핑된 API/TR 코드를 조회한다.
caps.findApis("quote.domesticStock.currentPrice");
```

Capability status:

```text
serviceReady  - 서비스 메서드, 요청 생성, 응답 정규화, 테스트가 준비된 기능
metadataOnly  - 공식 문서/manifest/API 매핑은 있지만 서비스 구현 전인 기능
parked        - 공식 문서/manifest/API 매핑은 있지만 현재 범위 밖으로 보류한 기능
composed      - 여러 service-ready 기능을 조합한 SDK 계산 기능
```

초기 capability 예시:

```text
auth.oauth.issueToken
auth.oauth.revokeToken
quote.domesticStock.currentPrice
quote.domesticStock.orderBook
account.domesticStock.balance
order.domesticStock.buy
realtime.domesticStock.trade
overseasStock.quote.currentPrice
futureOption.order.new
```

주의사항:

- capability는 기능을 흉내내기 위한 것이 아니라, 지원 여부를 명확히 드러내기 위한 장치다.
- `supports()`는 `serviceReady` 또는 `composed` 상태만 true로 본다.
- 공식 문서상 API 존재 여부는 `hasMetadata()`나 `findApis()`로 확인한다.
- 불가능한 기능은 조용히 fallback하지 않고 `UNSUPPORTED_CAPABILITY`로 실패한다.
- 주문/계좌/실시간처럼 위험하거나 복잡한 영역은 도메인 계층에서 별도로 설계한다.
- 주문 API는 capability에 포함하되 기본 retry 대상이 아니다.
- 매핑된 API ID/TR 코드는 generated manifest 존재 여부를 테스트에서 검증한다.

### 3.6 Domain Service Layer

이 레이어는 2차 작업이며, 현재 국내주식 시세, 시장 데이터, 랭킹/조건검색 스캐너, 시장 컨텍스트, 계좌, 주문, 실시간 구독과 LS 해외주식 현재가/호가/종목정보/마스터/차트/시간대별/계좌/주문/실시간의 기본 구현을 제공한다.

목표는 사용자가 증권사별 API ID/TR 코드를 몰라도 도메인 함수로 호출하게 하는 것이다.

예상 예시:

```js
import { QuoteService } from "security-api-reference";

const quote = new QuoteService({ kiwoom, ls });

await quote.getDomesticStockCurrentPrice("kiwoom", "005930");
await quote.getDomesticStockCurrentPrice("ls", "005930");
await quote.getDomesticStockOrderBook("kiwoom", "005930");
await quote.getDomesticStockMultiCurrentPrice("ls", ["005930", "000660"]);
```

`MarketContextService`는 주요 지수 현재가, 지수 일봉 추이, 상승/보합/하락 종목 수, 장전/장후 예상지수를 사용해 시장 전체의 방향성과 폭을 얇게 정리한다. 이 결과는 종목별 시그널 입력값 위에 붙일 수 있는 시장 배경 데이터이며, 매수/매도 판단은 수행하지 않는다. 예상지수는 현재 LS REST `t1485`만 매핑되어 있으며, 키움은 같은 REST 범위가 확인될 때 추가한다.

`MarketFlowService`는 개인, 외국인, 기관계와 세부 기관 투자자의 순매수, 전체/차익/비차익 프로그램 매매 흐름을 공통 형태로 정리한다. 수급 데이터는 시장 판단 입력값이지만, 이 레이어 역시 매수/매도 판단은 수행하지 않는다.

`ScannerService`는 거래량/거래대금/등락률 랭킹뿐 아니라 조건검색 목록, 조건식 실행 결과, 실시간 조건검색 세션을 공통 형태로 정리한다. 키움은 조건검색 요청 자체가 WebSocket 흐름이고, LS는 목록/일반검색은 REST, 실시간 이벤트는 `t1860` 등록 후 `AFR` WebSocket 구독으로 갈라지므로 이 차이를 서비스 내부에서 흡수한다.

`SignalInputService`는 현재 코드 구조상 `src/services`에 함께 두지만, 논리적으로는 Domain Service 결과를 조합하는 `Signal / Decision Input Layer`에 속한다. 이 레이어는 다른 앱의 전략 코드가 읽을 입력값을 만들 뿐, 매수/매도 같은 애플리케이션 판단은 수행하지 않는다. 시장 컨텍스트와 수급 데이터는 기본 비용을 늘리지 않도록 옵션으로만 조회하고, 켜진 경우 `market`, `metrics.market`, `signals.market` 블록에 함께 담는다.

현재 구현:

```text
src/services/QuoteService.mjs
src/services/MarketDataService.mjs
src/services/ScannerService.mjs
src/services/MarketContextService.mjs
src/services/MarketFlowService.mjs
src/services/SignalInputService.mjs
src/services/AccountService.mjs
src/services/OrderService.mjs
src/services/RealtimeService.mjs
src/services/OverseasStockQuoteService.mjs
src/services/OverseasStockMarketDataService.mjs
src/services/OverseasStockAccountService.mjs
src/services/OverseasStockOrderService.mjs
src/services/OverseasStockRealtimeService.mjs
src/services/index.mjs
test/services/QuoteService.test.mjs
test/services/MarketDataService.test.mjs
test/services/ScannerService.test.mjs
test/services/MarketContextService.test.mjs
test/services/MarketFlowService.test.mjs
test/services/SignalInputService.test.mjs
test/services/OverseasStockQuoteService.test.mjs
test/services/OverseasStockMarketDataService.test.mjs
test/services/OverseasStockAccountService.test.mjs
test/services/OverseasStockOrderService.test.mjs
test/services/OverseasStockRealtimeService.test.mjs
```

현재 범위:

- `quote.domesticStock.currentPrice` capability 확인
- `quote.domesticStock.orderBook` capability 확인
- `quote.domesticStock.multiCurrentPrice` capability 확인
- `marketData.domesticStock.basicInfo` capability 확인
- `marketData.domesticStock.dailyCandles` capability 확인
- `marketData.domesticStock.minuteCandles` capability 확인
- `scanner.domesticStock.volumeRanking` capability 확인
- `scanner.domesticStock.valueRanking` capability 확인
- `scanner.domesticStock.changeRateRanking` capability 확인
- `scanner.conditionSearch.list` capability 확인
- `scanner.conditionSearch.search` capability 확인
- `scanner.conditionSearch.realtime` capability 확인
- `marketContext.domesticIndex.current` capability 확인
- `marketContext.domesticIndex.dailyCandles` capability 확인
- `marketContext.domesticIndex.expected` capability 확인
- `marketContext.domesticMarket.snapshot` capability 확인
- `marketFlow.domesticInvestor.netBuy` capability 확인
- `marketFlow.programTrading.trend` capability 확인
- `realtime.market.status` capability 확인
- 키움 `ka10001` 호출
- 키움 `ka10004` 호가 호출
- 키움 `ka10095` 복수 현재가 호출
- 키움 `ka10081` 일봉 차트 호출
- 키움 `ka10080` 분봉 차트 호출
- 키움 `ka10030` 당일 거래량 상위 호출
- 키움 `ka10032` 거래대금 상위 호출
- 키움 `ka10027` 전일대비 등락률 상위 호출
- 키움 `ka10171` 조건검색 목록 조회
- 키움 `ka10172` 조건검색 일반 요청
- 키움 `ka10173` 조건검색 실시간 요청
- 키움 `ka10174` 조건검색 실시간 해제
- 키움 `ka20001` 업종현재가 호출
- 키움 `ka20006` 업종일봉조회 호출
- 키움 `ka10051` 업종별투자자순매수 호출
- 키움 `ka90005` 프로그램매매추이 시간대별 호출
- 키움 `0s` 장시작시간 WebSocket 구독
- LS `t1101` 현재가/호가 기본 호출, 옵션으로 `t1102` 등 명시 가능
- LS `t8407` 복수 현재가 호출
- LS `t1102` 종목 기본정보 호출
- LS `t8410` 일봉 차트 호출
- LS `t8412` 분봉 차트 호출
- LS `t1452` 거래량 상위 호출
- LS `t1463` 거래대금 상위 호출
- LS `t1441` 등락률 상위 호출
- LS `t1866` 서버저장조건 리스트 조회
- LS `t1859` 서버저장조건 조건검색
- LS `t1860` 서버저장조건 실시간검색 등록/중지
- LS `AFR` API 사용자조건검색 실시간 WebSocket 이벤트
- LS `t1511` 업종현재가 호출
- LS `t1514` 업종기간별추이 호출
- LS `t1485` 예상지수 호출
- LS `t1602` 시간대별투자자매매추이 호출
- LS `t1632` 시간대별프로그램매매추이 호출
- LS `JIF` 장운영정보 WebSocket 구독
- LS 해외주식 `g3101`, `g3106`, `g3104`, `g3190`, `g3204`, `g3103`, `g3102` 조회 호출
- LS 해외주식 `COSOQ02701`, `COSOQ00201`, `COSAQ00102`, `COSAQ01400` 계좌 조회 호출
- LS 해외주식 `COSAT00301`, `COSAT00311`, `COSAT00400` 주문 dry-run 요청 생성
- LS 해외주식 `GSC`, `GSH`, `AS0`~`AS4` WebSocket 구독
- `symbol`, `name`, `price`, `change`, `changeRate`, `volume`, `currency`, `source` 공통 형태 제공
- 호가는 `asks`, `bids`, `totals`, `timestamp`, `source` 공통 형태 제공
- OHLCV는 `date`, `time`, `timestamp`, `open`, `high`, `low`, `close`, `volume`, `value`, `raw` 공통 형태 제공
- 스캐너 랭킹은 `rank`, `symbol`, `name`, `price`, `change`, `changeRate`, `volume`, `value`, `turnoverRate`, `raw` 공통 형태 제공
- 조건검색은 `id`/`seq`/`queryIndex`, `name`, `groupName` 조건식 목록과 `symbol`, `name`, `price`, `change`, `changeRate`, `volume`, `eventType`, `realtimeKey` 공통 형태 제공
- 시장 컨텍스트는 `kospi`, `kosdaq`, `kospi200`, `krx100` 주요 지수 현재가, 일봉 추이, 상승/보합/하락 종목 수, 상승 비율, 시장 방향성, LS 예상지수를 제공
- 시장 수급은 `kospi`, `kosdaq`, `kospi200`의 개인/외국인/기관계 순매수와 세부 투자자별 순매수를 제공
- 프로그램 매매 추이는 `kospi`, `kosdaq`의 전체/차익/비차익 매수/매도/순매수와 KOSPI200/Basis를 제공
- `SignalInputService`는 현재가, 호가, 종목 기본정보, 일봉/분봉, 선택적 랭킹/조건검색을 조합해 `metrics`와 `signals`를 제공
- `SignalInputService`는 조건검색 결과에서 현재 종목의 매칭 여부를 `conditions`, `metrics.conditions`, `signals.conditions`에 포함
- `SignalInputService`는 옵션으로 시장 스냅샷, 지수 일봉, 예상지수, 투자자 수급, 프로그램 매매 흐름을 같은 입력값에 포함
- 시그널 입력값은 가격 모멘텀, 거래량 급증 비율, 호가 불균형, 당일 고저 범위 위치, 시장 방향성/폭/예상지수/수급 방향 입력값을 포함하며 매수/매도 판단은 포함하지 않음
- `DomesticStockRealtimeSignalState`는 초기 시그널 스냅샷에 실시간 체결/호가/조건검색 이벤트를 적용해 `signal.domesticStock.realtimeInputs`를 갱신
- `RealtimeService.subscribeMarketStatus()`는 키움 `0s`, LS `JIF`를 `marketStatus` 메시지로 정규화하며 `session`, `phase`, `eventCode`, `eventName`, `time`, `remainingTime`을 제공
- `subscribeDomesticStockSignalInputs()`는 `RealtimeService`와 선택적 `ScannerService` 실시간 조건검색 구독을 사용해 체결/호가/장운영 상태/조건검색 업데이트마다 최신 입력값을 `onUpdate`로 전달
- `OverseasStockRealtimeService`는 LS 해외주식 체결/호가/주문 이벤트를 `market: "overseas"`, `kind`, `eventType`, `symbol`, `price`, `asks`, `bids`, `orderId`, `executedQuantity` 중심으로 정규화

추후 다룰 것:

- 공통 종목/가격/잔고/주문 모델 정의
- 키움/LS 응답을 공통 모델로 변환
- 시그널 입력값의 시장 컨텍스트를 전략 앱에서 바로 소비할 수 있는 예제 확대
- 실시간 체결을 장중 누적 지표로 보존하는 장기 window/TTL 정책

## 4. 패키지/개발 환경 계획

현재 `package.json`은 문서 생성용 Node.js 스크립트만 가진다. SDK 구현 시 다음을 추가한다.

```text
src/
test/
tsconfig.json
```

권장 도구:

- TypeScript
- Node.js `fetch` 기반 구현
- 테스트 러너는 Node 내장 test runner 또는 Vitest 중 하나
- 외부 런타임 의존성은 최소화

권장 npm scripts:

```json
{
  "build": "tsc",
  "test": "node --test dist/test/**/*.test.js",
  "generate:manifest": "node scripts/generate-manifest.mjs",
  "validate:manifest": "node scripts/validate-manifest.mjs",
  "check": "npm run validate:docs && npm run validate:manifest && npm run build && npm test"
}
```

## 5. 구현 단계

### Phase 1: SDK 기반 준비

- TypeScript 빌드 설정 추가.
- `data/raw`에서 `data/generated/*-manifest.json` 생성.
- manifest 검증 스크립트 추가.
- README에 SDK 목표와 manifest 생성법 추가.

### Phase 2: Core SDK

- `HttpClient`, `TokenStore`, `BrokerError`, 공통 타입 구현.
- fetch mock 기반 단위 테스트 작성.
- timeout, response parsing, error normalize 검증.

### Phase 3: KiwoomClient

- 토큰 발급/캐싱 구현.
- API ID 기반 request 구현.
- mock fetch로 헤더/body/URL 검증.
- 연속조회 helper 검증.

### Phase 4: LsClient

- 토큰 발급/캐싱 구현.
- TR 코드 기반 request 구현.
- JSON/form-urlencoded 분기 검증.
- `tr_cont`, `tr_cont_key`, `mac_address` 처리 검증.

### Phase 5: Public API 정리

- `src/index.ts`에서 public export 정리.
- README에 사용 예제 작성.
- 다른 서버에서 `npm install git+https://github.com/kevinjishan/SecurityAPI.git`로 사용할 수 있게 패키지 엔트리 정리.

### Phase 6: Domain Layer 후보 선정

- 가장 안전한 조회성 API부터 도메인 함수 후보를 정한다.
- 1차 후보:
  - 현재가 조회
  - 종목 기본정보
  - 일봉/분봉 차트
  - 계좌 잔고 조회
- 주문 API는 별도 위험 분석 후 진행한다.

## 6. 테스트 전략

실제 API 키가 없어도 대부분의 SDK 검증이 가능해야 한다.

필수 테스트:

- manifest 생성 개수 검증.
- KiwoomClient가 `ka10001` 호출 시 `api-id`, `authorization`, JSON body를 올바르게 구성.
- LsClient가 `t1101` 호출 시 `tr_cd`, `tr_cont`, JSON body를 올바르게 구성.
- OAuth 요청은 각 증권사별 content type과 body 형식을 맞춤.
- 토큰 만료 시 자동 갱신.
- continuation key가 응답에서 추출됨.
- HTTP 실패와 API 실패가 `BrokerError`로 정규화됨.

실제 API 연동 테스트는 별도 opt-in으로 둔다.

```bash
npm run test:integration
```

통합 테스트는 `.env`나 서버 secret을 요구하고, 기본 CI에서는 실행하지 않는다.

## 7. 운영/보안 원칙

- API 키, secret, 계좌번호는 저장소에 커밋하지 않는다.
- `.env`는 `.gitignore`에 포함한다.
- 주문 API는 자동 retry 기본값을 사용하지 않는다.
- 로그에는 authorization, app secret, 계좌번호를 남기지 않는다.
- SDK는 원본 응답을 제공하되 민감정보 마스킹 옵션을 둔다.

상세 안정화 설계:

- [SDK Stabilization Goal Plan](sdk-stabilization-goal-plan.md)
- [Live Integration Readiness](live-integration-readiness.md)
- [Live Read-only Verification Plan](live-readonly-verification-plan.md)
- [Order Guard Verification Plan](order-guard-verification-plan.md)
- [Broker Error And Reject Policy](broker-error-reject-policy.md)
- [Public SDK Contract](public-sdk-contract.md)
- [Production Readiness Checklist](production-readiness-checklist.md)

## 8. 당장 만들 첫 PR 권장 범위

첫 SDK PR은 너무 욕심내지 않고 아래만 포함한다.

- TypeScript 빌드 설정
- `generate:manifest`, `validate:manifest`
- `src/core` 기본 타입
- `KiwoomClient`, `LsClient`의 skeleton
- mock fetch 테스트 4~6개
- README 사용 예시 초안

이 PR에서는 실제 API 호출 성공까지 목표로 하지 않는다. 목표는 SDK 구조가 문서 메타데이터와 연결되고, 인증/요청 구성의 방향이 테스트로 고정되는 것이다.
