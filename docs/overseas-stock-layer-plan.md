# Overseas Stock Layer Plan

이 문서는 [Core Expansion Roadmap](core-expansion-roadmap.md)의 해외주식 범위를 실제 구현 단위로 나눈 상세 설계다.

해외주식 1차 구현은 LS증권 OPEN API 기준으로 진행한다. Kiwoom은 현재 저장소의 공식 metadata에서 해외주식 REST/WebSocket 명세가 확인되지 않으므로, 해외주식 service 호출 시 명확한 unsupported 응답을 반환한다.

## 1. 설계 원칙

- 국내주식 service와 같은 사용 경험을 제공한다.
- 해외주식 특유의 거래소, 국가, 통화, 지연시세 구분은 숨기지 않는다.
- API 문서 필드명과 request block명은 그대로 보존한다.
- 공통 normalizer는 앱에서 필요한 핵심 필드만 제공하고, 원본 응답은 항상 `raw` 또는 `blocks`에 남긴다.
- 주문 기능은 국내주식보다 보수적으로 연다.
- service-ready로 노출하는 기능은 request builder, normalizer, manifest audit test를 모두 가진다.

## 2. Capability 상태 구분

현재 capability registry는 “문서에 존재하는 API”와 “도메인 서비스로 안전하게 호출 가능한 기능”을 일부 혼동할 수 있다. 해외주식 확장 전에 다음 상태를 구분한다.

```ts
type CapabilityStatus = "serviceReady" | "metadataOnly" | "parked";
```

권장 의미:

- `serviceReady`: service method, request builder, normalizer, test가 있다.
- `metadataOnly`: 공식 문서와 manifest에는 있지만 service method가 없다.
- `parked`: 이번 범위 밖이라 의도적으로 보류한다.

초기 상태:

- 국내주식 구현 capability: `serviceReady`
- LS 해외주식 quote/order 일부: 구현 전까지 `metadataOnly`
- 선물옵션/파생상품: `parked`

## 3. 공통 입력 타입

### 종목 식별

```ts
type OverseasStockIdentity = {
  symbol: string;
  keySymbol?: string;
  exchangeCode?: string;
  marketCode?: string;
  countryCode?: string;
  currencyCode?: string;
  delayType?: "R" | string;
};
```

LS 주요 필드 대응:

| 공통 입력 | LS 필드 | 설명 |
| --- | --- | --- |
| `symbol` | `symbol`, `IsuNo` | 종목코드 |
| `keySymbol` | `keysymbol` | KEY종목코드. 예: `82TSLA` |
| `exchangeCode` | `exchcd` | 거래소코드. 문서 예: `81`, `82` |
| `marketCode` | `OrdMktCode`, `FcurrMktCode` | 주문시장/외화시장 코드 |
| `countryCode` | `CntryCode`, `natcode` | 국가 코드 |
| `currencyCode` | `CrcyCode` | 통화 코드 |
| `delayType` | `delaygb` | 지연구분. 문서 예: `R` |

기본 규칙:

- `symbol`은 필수다.
- `keySymbol`은 입력되지 않으면 `exchangeCode + symbol`로 만들 수 있는 경우에만 생성한다.
- `exchangeCode`는 추측하지 않는다. 단, caller가 명시한 default option이 있으면 사용한다.
- `delayType`은 LS 문서 예시의 `R`을 기본값 후보로 두되, 테스트에서 request body에 명시되도록 한다.

## 4. Quote Service

파일:

```text
src/services/OverseasStockQuoteService.mjs
test/services/OverseasStockQuoteService.test.mjs
```

Public methods:

```ts
getOverseasStockCurrentPrice(broker, identity, options?)
getOverseasStockOrderBook(broker, identity, options?)
```

LS 대상 TR:

| 기능 | TR | Path | 필수 request |
| --- | --- | --- | --- |
| 현재가 | `g3101` | `/overseas-stock/market-data` | `delaygb`, `keysymbol`, `exchcd`, `symbol` |
| 호가 | `g3106` | `/overseas-stock/market-data` | `delaygb`, `keysymbol`, `exchcd`, `symbol` |

Request 예시:

```js
await service.getOverseasStockCurrentPrice("ls", {
  symbol: "TSLA",
  keySymbol: "82TSLA",
  exchangeCode: "82",
  delayType: "R",
});
```

정규화 결과 후보:

```ts
type OverseasStockQuote = {
  broker: "ls";
  sourceId: "g3101";
  symbol: string;
  keySymbol?: string;
  exchangeCode?: string;
  currencyCode?: string;
  price?: number;
  change?: number;
  changeRate?: number;
  volume?: number;
  raw: unknown;
};
```

완료 기준:

- LS request body가 `g3101InBlock`/`g3106InBlock`을 사용한다.
- manifest의 필수 필드가 모두 채워진다.
- Kiwoom 요청은 unsupported 실패 응답을 반환한다.
- `apiId`/`trCode` override는 capability에 존재하는 REST TR만 허용한다.

## 5. Market Data Service

파일:

```text
src/services/OverseasStockMarketDataService.mjs
test/services/OverseasStockMarketDataService.test.mjs
```

Public methods:

```ts
getOverseasStockBasicInfo(broker, identity, options?)
getOverseasStockMaster(broker, query, options?)
getOverseasStockCandles(broker, identity, options?)
getOverseasStockTimeSeries(broker, identity, options?)
```

LS 대상 TR:

| 기능 | TR | Path | 필수 request |
| --- | --- | --- | --- |
| 종목정보 | `g3104` | `/overseas-stock/market-data` | `delaygb`, `keysymbol`, `exchcd`, `symbol` |
| 마스터 | `g3190` | `/overseas-stock/market-data` | `delaygb`, `natcode`, `exgubun`, `readcnt`, `cts_value` |
| 일/주/월 | `g3103` | `/overseas-stock/chart` | `delaygb`, `keysymbol`, `exchcd`, `symbol`, `gubun`, `date` |
| 일/주/월/년 | `g3204` | `/overseas-stock/chart` | `sujung`, `delaygb`, `keysymbol`, `exchcd`, `symbol`, `gubun`, `qrycnt`, `comp_yn`, `sdate`, `edate`, `cts_date`, `cts_info` |
| 시간대별 | `g3102` | `/overseas-stock/market-data` | `delaygb`, `keysymbol`, `exchcd`, `readcnt`, `cts_seq` |
| N틱 | `g3202` | `/overseas-stock/chart` | `delaygb`, `keysymbol`, `exchcd`, `symbol`, `ncnt`, `qrycnt`, `comp_yn`, `sdate`, `edate`, `cts_seq` |

구현 순서:

1. `g3104` 종목정보
2. `g3103` 또는 `g3204` 일봉
3. `g3190` 마스터
4. `g3102`/`g3202` 시간/틱 계열

완료 기준:

- candle normalizer가 `date`, `open`, `high`, `low`, `close`, `volume`을 반환한다.
- 압축 여부, 수정주가 여부, 연속조회 키는 options에 남긴다.
- 필수 입력값이 없으면 broker 호출 전 validation error로 실패한다.

## 6. Account Service

파일:

```text
src/services/OverseasStockAccountService.mjs
test/services/OverseasStockAccountService.test.mjs
```

Public methods:

```ts
getOverseasStockBalance(broker, query, options?)
getOverseasStockCash(broker, query, options?)
getOverseasStockOrderHistory(broker, query, options?)
getOverseasStockReservedOrderHistory(broker, query, options?)
```

LS 대상 TR:

| 기능 | TR | Path | 주요 필수 request |
| --- | --- | --- | --- |
| 잔고 | `COSOQ00201` | `/overseas-stock/accno` | `RecCnt`, `BaseDt`, `CrcyCode`, `AstkBalTpCode` |
| 예수금 | `COSOQ02701` | `/overseas-stock/accno` | `RecCnt`, `CrcyCode` |
| 주문/체결 | `COSAQ00102` | `/overseas-stock/accno` | `QryTpCode`, `OrdMktCode`, `OrdDt`, `ExecYn`, `CrcyCode` |
| 예약주문 결과 | `COSAQ01400` | `/overseas-stock/accno` | `CntryCode`, `AcntNo`, `Pwd`, `SrtDt`, `EndDt` |

주의:

- 계좌번호/비밀번호 필드가 문서상 body에 존재하면 config 또는 explicit query로만 받는다.
- 예제와 test fixture에는 실제 계좌처럼 보이는 값을 넣지 않는다.
- 통화별 잔고/예수금은 합산하지 않고 배열로 보존한다.

## 7. Order Service

파일:

```text
src/services/OverseasStockOrderService.mjs
test/services/OverseasStockOrderService.test.mjs
```

Public methods:

```ts
buyOverseasStock(broker, order, options?)
sellOverseasStock(broker, order, options?)
modifyOverseasStockOrder(broker, order, options?)
cancelOverseasStockOrder(broker, order, options?)
```

LS 대상 TR:

| 기능 | TR | Path | 주요 필수 request |
| --- | --- | --- | --- |
| 신규 | `COSAT00301` | `/overseas-stock/order` | `OrdPtnCode`, `OrdMktCode`, `IsuNo`, `OrdQty`, `OvrsOrdPrc`, `OrdprcPtnCode`, `BrkTpCode` |
| 정정 | `COSAT00311` | `/overseas-stock/order` | `OrdPtnCode`, `OrgOrdNo`, `OrdMktCode`, `IsuNo`, `OrdQty`, `OvrsOrdPrc`, `OrdprcPtnCode`, `BrkTpCode` |
| 예약 등록/취소 | `COSAT00400` | `/overseas-stock/order` | `TrxTpCode`, `CntryCode`, `AcntNo`, `Pwd`, `FcurrMktCode`, `IsuNo`, `OrdQty`, `OvrsOrdPrc` |

보류:

- `COSMT00300`은 매도상환주문 성격이므로 신용/대출 정책이 정리될 때까지 service-ready에서 제외한다.

안전장치:

- `dryRun` 기본값은 `true`.
- live 주문은 `confirm: true` 필수.
- 시장가 또는 가격 미기재 주문은 `confirmMarketOrder: true` 필수.
- live 주문 request는 `retryable: false`.
- `expectedRequest`가 있으면 완전 일치해야 한다.
- `currencyCode`, `marketCode`, `exchangeCode` 누락 시 live 주문을 차단한다.
- 정규장/프리마켓/애프터마켓 구분은 options에 명시하도록 하고, 문서 검증 전에는 추측하지 않는다.

## 8. Realtime Service

파일:

```text
src/services/OverseasStockRealtimeService.mjs
test/services/OverseasStockRealtimeService.test.mjs
```

Public methods:

```ts
subscribeOverseasStockTrades(broker, identity, handler, options?)
subscribeOverseasStockOrderBook(broker, identity, handler, options?)
subscribeOverseasStockOrderEvents(broker, query, handler, options?)
```

LS 대상 TR:

| 기능 | TR | Path |
| --- | --- | --- |
| 체결 | `GSC` | `/websocket/overseas-stock` |
| 호가 | `GSH` | `/websocket/overseas-stock` |
| 주문접수 | `AS0` | `/websocket/overseas-stock` |
| 주문체결 | `AS1` | `/websocket/overseas-stock` |
| 주문정정 | `AS2` | `/websocket/overseas-stock` |
| 주문취소 | `AS3` | `/websocket/overseas-stock` |
| 주문거부 | `AS4` | `/websocket/overseas-stock` |

완료 기준:

- 기존 `WebSocketBrokerClient`의 subscribe envelope를 재사용한다.
- 국내주식 realtime과 같은 response wrapper를 사용한다.
- 주문 이벤트는 원본 이벤트명과 normalized event type을 함께 반환한다.
- reconnect 후 resubscribe 테스트를 추가한다.

## 9. 감사 테스트 확장

대상 파일:

```text
test/audit/coreSpecAudit.test.mjs
docs/audits/overseas-stock-spec-audit-YYYY-MM-DD.md
```

추가 검증:

- service-ready 해외주식 capability의 TR이 manifest에 존재한다.
- request builder 결과가 manifest required field를 모두 포함한다.
- Kiwoom unsupported path가 명확히 실패한다.
- 주문 dry-run 결과의 request와 live `expectedRequest` 비교가 동작한다.
- realtime 구독 payload가 TR별 필수 식별자를 포함한다.

## 10. 구현 순서

1. capability status 구분 추가
2. `OverseasStockQuoteService` 구현
3. quote 테스트와 audit 확장
4. `OverseasStockMarketDataService` 구현
5. `OverseasStockAccountService` 구현
6. `OverseasStockOrderService` 구현
7. `OverseasStockRealtimeService` 구현
8. 해외주식 감사 문서 작성
9. `npm run validate:all` 통과
