# Examples

이 디렉터리는 실제 API 키 없이 SDK 호출 흐름을 확인하는 예제를 둡니다.

## Mock Clients

```bash
npm run examples:mock
```

검증하는 흐름:

- 키움 `au10001` mock 토큰 발급 후 `ka10001` 호출
- LS `token` mock 토큰 발급 후 `t1101` 호출
- 인증 헤더, API ID/TR 코드 헤더, LS `mac_address` 자동 구성
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
