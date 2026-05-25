# Examples

이 디렉터리는 실제 API 키 없이 SDK 호출 흐름을 확인하는 예제를 둡니다.

## Mock Clients

```bash
npm run examples:mock
```

검증하는 흐름:

- 키움 `au10001` mock 토큰 발급 후 `ka10001` 호출
- LS `token` mock 토큰 발급 후 `t1101` 호출
- 인증 헤더, API ID/TR 코드 헤더, LS `mac_address` 선택 구성
- `QuoteService.getDomesticStockCurrentPrice()` 공통 응답 형태 확인
- `QuoteService.getDomesticStockOrderBook()` 공통 호가 형태 확인
- `QuoteService.getDomesticStockMultiCurrentPrice()` 복수 현재가 형태 확인
- `MarketDataService.getDomesticStockDailyCandles()` / `getDomesticStockMinuteCandles()` OHLCV 공통 응답 형태 확인
- `MarketDataService.getDomesticStockBasicInfo()` 종목 기본정보 공통 응답 형태 확인
- `ScannerService.getDomesticStockVolumeRankings()` / `getDomesticStockValueRankings()` 랭킹 공통 응답 형태 확인
- `ScannerService.listConditionSearches()` / `searchCondition()` 조건검색 목록/결과 공통 응답 형태 확인
- `MarketContextService.getDomesticMarketSnapshot()` / `getDomesticIndexDailyCandles()` / `getDomesticExpectedIndex()` 주요 지수, 시장 폭, 지수 추이, LS 예상지수 공통 응답 형태 확인
- `MarketFlowService.getDomesticInvestorFlow()` / `getProgramTradingTrend()` 개인/외국인/기관 수급과 프로그램 매매 공통 응답 형태 확인
- `SignalInputService.getDomesticStockSignalInputs()` 시세/호가/OHLCV/랭킹/조건검색/시장 컨텍스트/수급 조합 입력값 확인
- `SignalInputService.subscribeDomesticStockSignalInputs()` 실시간 체결/호가/장운영 상태/조건검색 기반 갱신 입력값 확인
- `AccountService.getDomesticStockCash()` 예수금/주문가능금액 공통 응답 형태 확인
- `AccountService.getDomesticStockBalance()` 잔고/평가손익 공통 응답 형태 확인
- `AccountService.getDomesticStockOrderHistory()` 주문/체결 내역 공통 응답 형태 확인
- `OrderService.buyDomesticStock()` / `sellDomesticStock()` dry-run 주문 요청과 안전장치 확인
- `RealtimeService.subscribeDomesticStockTrades()` / `subscribeMarketStatus()` mock WebSocket 구독/체결/장운영 상태 메시지 공통 필드 정규화 확인
- `OverseasStockRealtimeService.subscribeOverseasStockTrades()` / `subscribeOverseasStockOrderEvents()` LS 해외주식 실시간 체결/주문 이벤트 정규화 확인
- `WebSocketBrokerClient` 중복 구독 방지, 재연결, 구독 복구 테스트는 `npm test`에서 확인

## Real Credentials

실제 호출을 만들 때는 `.env.example`의 값을 기준으로 환경 변수를 설정합니다. 예제 검증 스크립트는 실제 증권사 서버를 호출하지 않습니다.

## Live Read-only Examples

Live read-only 예제는 주문 API를 호출하지 않는 조회/실시간 검증용 골격입니다. 기본 실행은 안전하게 차단되며, validate-only 모드는 실제 API를 호출하지 않습니다.

```bash
npm run examples:live-readonly:preflight
npm run examples:live-readonly:validate
npm run examples:live-readonly:signals
npm run examples:crypto-readonly:preflight
npm run examples:crypto-readonly:validate
```

`preflight`는 환경변수와 guard 상태만 점검하며 실제 증권사 API를 호출하지 않습니다. 준비가 끝나지 않았으면 exit code `2`로 종료합니다.

예제 파일:

- `examples/live-readonly/preflight.mjs`
- `examples/live-readonly/auth-only.mjs`
- `examples/live-readonly/kiwoom-domestic-quote.mjs`
- `examples/live-readonly/ls-domestic-quote.mjs`
- `examples/live-readonly/ls-overseas-quote.mjs`
- `examples/live-readonly/ls-overseas-realtime.mjs`
- `examples/live-readonly/account-readonly.mjs`
- `examples/live-readonly/technical-market-signals.mjs`

실제 read-only 호출을 실행하려면 로컬 환경에서만 `SECURITY_API_LIVE_READONLY=true`를 명시합니다. `SECURITY_API_ALLOW_LIVE_ORDER=true`가 설정되어 있으면 read-only 예제는 실행을 거부합니다.

기술지표/상대강도/시장폭 검증은 다음 범위로 동작합니다.

- `TechnicalIndicatorService`: 국내주식 일봉을 read-only로 조회한 뒤 SMA/EMA/RSI/MACD/거래량/변동성 지표를 계산합니다.
- `RelativeStrengthService`: 국내주식 일봉과 KOSPI 지수 일봉을 read-only로 조회한 뒤 상대강도를 계산합니다.
- `MarketBreadthService`: 전체 종목 자동수집은 하지 않고, 제공된 snapshot 입력으로 ADL, 신고가/신저가 비율, 20일선 위 종목 비율 계산 흐름만 검증합니다.

기본값은 Kiwoom `005930`/KOSPI입니다. 다른 입력은 아래 환경변수로 바꿀 수 있습니다.

```bash
SECURITY_API_SIGNAL_BROKER=kiwoom
SECURITY_API_SIGNAL_SYMBOL=005930
SECURITY_API_SIGNAL_BASE_DATE=20260519
SECURITY_API_SIGNAL_BENCHMARK=kospi
```

## Crypto Validate-only Examples

Crypto 예제는 증권사 live-readonly 예제와 같은 guard를 사용한다. 기본 검증은 실제 거래소 서버를 호출하지 않고 read-only 호출 골격, dry-run 주문 preview, 국내 거래소 futures unsupported 응답을 검증한다.

```bash
npm run examples:crypto-readonly:preflight
npm run examples:crypto-readonly:validate
```

검증 범위:

- Binance spot current price validate-only
- Upbit spot buy dry-run preview
- Bybit futures positions validate-only
- Upbit futures unsupported response
- order/deposit/withdrawal/transfer/leverage mutation 미호출 확인

실제 public read-only 호출을 실행하려면 `SECURITY_API_LIVE_READONLY=true`와 `SECURITY_API_ALLOW_LIVE_ORDER=false` 상태에서 아래를 실행한다. public market/realtime 예제는 API key가 필요하지 않다.

```bash
npm run examples:crypto-readonly:public-market
npm run examples:crypto-readonly:public-realtime
```

private account read-only 예제는 주문 없이 잔고/포지션만 조회한다. 필요한 키는 거래소별 `BINANCE_API_KEY`, `BINANCE_API_SECRET`, `BYBIT_API_KEY`, `BYBIT_API_SECRET` 형식으로 제공한다.

```bash
npm run examples:crypto-readonly:private-account
```
