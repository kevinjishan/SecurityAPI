# 국내주식 캔들 통합 설계 (Approach C)

- 날짜: 2026-07-06
- 상태: 구현 완료
- 관련 PR: #12 (국내 월봉 서비스, 병합됨 / 현재 브랜치 기반)

## 1. 배경 및 문제

이 저장소는 4개 증권사 브로커(LS, Kiwoom, DB, KIS)를 감싸 **일관된 인터페이스**로
노출하는 통합 SDK 래퍼다. 캔들(OHLCV) 영역에서 두 가지 구조적 문제가 있다.

1. **국내 주봉(weekly)이 통째로 없음.** capability, 서비스 메서드, 정규화 모두 부재.
   브로커는 대부분 주봉 API를 제공한다(LS `t8410 gubun=3`, Kiwoom `ka10082`,
   KIS `inquire-daily-itemchartprice periodCode=W`, DB는 미제공으로 추정).
2. **국내와 해외의 캔들 인터페이스 입도가 다르다.**
   - 국내(`MarketDataService`): 유형별 메서드 3개 + 유형별 capability 3개
     (`getDomesticStockDailyCandles` / `MonthlyCandles` / `MinuteCandles`).
   - 해외(`OverseasStockMarketDataService`): 단일 메서드
     `getOverseasStockCandles(broker, identity, { interval })` + capability 1개
     (`overseasStock.marketData.candles`)로 interval 라우팅.

## 2. 현재 제약(constraint) 메커니즘

"모든 브로커가 모두 지원하는 척" 하지 않는다. 제약이 3단으로 표현되어 있다.

1. **캔들 유형 1개 = capability ID 1개** — `src/capabilities/definitions.mjs`.
2. **브로커별 지원 선언** — `src/capabilities/{kiwoom,ls,db,kis}.mjs`에서
   각 capability에 `status`, `apis`(sourceId·role·transport)를 명시.
3. **디스패치 시점 차단** — `MarketDataService.requestMarketData`가
   `capabilities.supports(capabilityId)` false 시 `BrokerError.unsupported`를
   **구조화된 실패 응답**으로 반환(조용한 실패 없음).

이 설계는 이 메커니즘을 **버리지 않고 확장**한다. 제약의 단일 진실원천을
"브로커 × interval 지원 매트릭스"로 승격하되, 기존 capability 체계는 그 매트릭스에서
**파생**되도록 하여 하위호환과 세밀함을 동시에 유지한다.

## 3. 목표 / 비목표

### 목표
- 국내주식 **주봉(1w) 신규 지원**을 브로커별로 추가.
- 국내 캔들을 **interval-aware 단일 코어**로 통합하되, 기존 유형별 메서드는
  얇은 파사드로 **하위호환 유지**(PR #12의 `getDomesticStockMonthlyCandles` 불변).
- 제약을 **읽기 쉬운 지원 매트릭스** 한 곳에 모으고, capability를 매트릭스에서 파생.
- 미지원 `(broker, interval)`을 해당 interval을 명시한 **구조화 에러**로 차단.

### 비목표 (이번 범위 밖)
- 국내 **연봉(1y)·틱(tick)** 구현 — 매트릭스가 확장 가능하도록만 열어둔다.
- 해외(`OverseasStockMarketDataService`) 기능 변경 — 동작 불변.
  (내부 표현을 동일 매트릭스로 정렬하는 것은 선택적 후속 과제로 남긴다.)
- 지수(index) 캔들 등 캔들 외 marketData 영역.

## 4. 설계

### 4.1 지원 매트릭스 (단일 진실원천)

신규 파일 `src/services/candleSupport.mjs`.
국내 시장에 대해 브로커별로 지원 interval → `{ sourceId, role, params }` 매핑을 선언.

개념 형태(정확한 API ID/파라미터는 구현 시 `docs`의 브로커 마크다운 레퍼런스로 검증):

```
DOMESTIC_STOCK_CANDLES = {
  ls:     { "1d": {...gubun:"2"}, "1w": {...gubun:"3"}, "1mo": {...gubun:"4"}, "Nm": {id:"t8412"} },
  kiwoom: { "1d": "ka10081", "1w": "ka10082", "1mo": "ka10083", "Nm": "ka10080" },
  kis:    { "1d/1w/1mo": inquire-daily-itemchartprice + periodCode D/W/M, "Nm": inquire-time-... },
  db:     { "1d": "CHARTDAY", "Nm": "CHARTMIN" },   // 주/월 미지원 → 매트릭스에 키 없음 = 미지원
}
```

- 매트릭스에 **키가 없으면 미지원**이 정의(定義)다.
- 구현이 브로커 레퍼런스와 실제로 일치하는지는 검증 후 확정한다. 미검증 값은 매트릭스에
  넣지 않는다(허위 지원 방지).

### 4.2 interval-aware 코어

`MarketDataService`에 `getDomesticStockCandles(broker, symbol, { interval, ...options })` 추가.

흐름:
1. `interval` 정규화(`"1w"`, `"1d"`, `"1mo"`, `"5m"` 등).
2. 매트릭스에서 `(broker, interval)` 조회.
   - 없으면 → `BrokerError.unsupported`(interval 명시) 구조화 실패 반환.
3. 조회 결과의 `sourceId`/`params`로 기존 `requestMarketData` 파이프라인 재사용
   (capability 검증 → `selectMarketDataSource` → request → normalize).
4. 정규화는 브로커별 기존 함수(`normalizeKiwoomCandles`, `normalizeLsCandles`,
   `normalizeDbCandles`, `normalizeKisCandles`)를 interval만 바꿔 재활용.
   반환 스키마 불변: `{ broker, symbol, interval, candles[], summary?, source }`.

### 4.3 유형별 파사드 (하위호환)

기존/신규 유형별 메서드는 코어에 interval을 넘기는 **얇은 wrapper**로 정리:

- `getDomesticStockDailyCandles`   → `getDomesticStockCandles(_, _, { interval: "1d",  ... })`
- `getDomesticStockWeeklyCandles`  → `... { interval: "1w",  ... }`   (신규)
- `getDomesticStockMonthlyCandles` → `... { interval: "1mo", ... }`   (PR #12, 시그니처·동작 불변)
- `getDomesticStockMinuteCandles`  → `... { interval: "<Nm>", ... }`

### 4.4 capability ↔ 매트릭스 일관성 (파생 아님, 검증으로 강제)

capability는 자동 생성(codegen)하지 않는다. 기존 방식대로 **수기 선언을 유지**하되,
매트릭스를 단일 진실원천으로 두고 둘의 **일관성을 검증으로 강제**한다(블라스트 반경 최소화).

- `marketData.domesticStock.weeklyCandles` capability 신규 정의
  (`definitions.mjs`에 label 추가).
- 각 브로커 `{broker}.mjs`에 주봉 지원분을 매트릭스와 동일하게 수기 선언.
- **정정**: `validate:manifest`/`validate:docs`는 브로커 원본 API 문서(data/raw→
  data/generated)만 검증하며 `src/capabilities/`와 무관하다(어떤 script도 capabilities를
  참조하지 않음). 따라서 매트릭스↔선언 드리프트는 `npm test`의 **단위 테스트**로 강제한다:
  매트릭스(candleSupport)의 모든 interval capabilityId가 `CAPABILITY_DEFINITIONS`에
  존재하고, 주봉 지원 브로커가 실제로 `supports()`를 통과하는지 검증.
- 주봉 capability 추가는 manifest/docs 생성물에 영향이 없으므로 재생성 불필요
  (PR #12 월봉도 동일). `validate:manifest`/`validate:docs`는 회귀 게이트로만 유지.
- 문서 생성(`generate:docs`)과 매니페스트(`generate:manifest`)에 주봉이 반영되도록
  재생성하고 `validate:docs` / `validate:manifest` 통과.

### 4.5 제약 강제 (요약)

- 미지원 `(broker, interval)`: 매트릭스에 없음 → interval 명시 구조화 에러.
- 미지원 broker capability: 기존 `requestMarketData`의 `supports()` 게이트 유지.
- 조용한 실패·빈 배열 위장 없음. 실패는 항상 `ok:false` + `BrokerError`.

## 5. 데이터 흐름

```
호출자 → getDomesticStockWeeklyCandles(broker, symbol, opts)   // 파사드
      → getDomesticStockCandles(broker, symbol, {interval:"1w", ...opts})  // 코어
      → candleSupport 매트릭스 조회 (broker,"1w") → {sourceId, params}
      → requestMarketData({capabilityId, request, normalize})
          → capabilities.supports() 게이트
          → selectMarketDataSource → client.request(sourceId, params)
          → normalize{Broker}Candles(interval="1w")
      → { ok, broker, capability, symbol, data:{ interval:"1w", candles[], ... } }
```

## 6. 테스트 계획 (완료 기준 = 게이트)

모든 게이트가 green이어야 승인한다.

- `npm test`
  - 신규: 각 브로커(지원분) **주봉 정규화** 테스트 — 요청 파라미터(sourceId·gubun/periodCode)
    와 반환 `interval:"1w"`, OHLCV 매핑 검증. 기존 일/월/분 테스트 패턴(FakeClient) 준수.
  - 신규: **미지원 interval 차단** 테스트 — 예: DB에 `"1w"` 요청 시 `ok:false` +
    `BrokerError.unsupported`, 에러에 interval 명시.
  - 신규: **매트릭스↔capability 일관성** 테스트 — candleSupport의 interval capabilityId가
    모두 CAPABILITY_DEFINITIONS에 존재, 주봉 지원 브로커가 supports() 통과.
  - 회귀: PR #12 **월봉** 테스트 및 기존 일/분 테스트 전부 통과(파사드 위임 후에도 불변).
- `npm run validate:manifest` — 회귀 게이트(주봉과 무관, green 유지 확인).
- `npm run validate:docs` — 회귀 게이트(주봉과 무관, green 유지 확인).

## 7. 리스크 / 주의점

- **브로커 API 정확성**: 주봉 sourceId·파라미터는 반드시 `docs` 브로커 레퍼런스로
  검증한 뒤 매트릭스에 기입. 추정값 그대로 두지 않는다.
- **DB 주봉 미지원 가정**: DB가 국내 주봉을 제공하지 않는다는 가정은 레퍼런스로 재확인.
  제공한다면 매트릭스에 추가, 아니면 미지원으로 명시(테스트로 차단 검증).
- **PR #12 회귀**: 월봉 파사드 전환 시 기존 시그니처/반환/파라미터 완전 불변 유지.
- **capability 파생 드리프트**: 매트릭스와 `{broker}.mjs` 수기 선언 불일치를
  검증으로 잡지 못하면 문서/런타임이 어긋난다 — 검증 추가를 필수 항목으로 둔다.

## 8. Advisor / Worker 진행 방식

- Advisor(메인 세션): 본 설계·스펙·구현 계획 확정, diff·테스트로 직접 검증, 커밋 승인.
- Worker(Opus 서브에이전트): 매트릭스/코어/파사드/capability/테스트 구현.
  브리프에 파일 경로·컨벤션·함정·완료 기준(위 게이트)·브로커 레퍼런스 검증 지시 포함.
- 검증은 게이트 우선: Worker 보고를 그대로 믿지 않고 Advisor가 직접 게이트를 돌려 확인.
