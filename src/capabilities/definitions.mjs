export const CAPABILITY_DEFINITIONS = Object.freeze({
  "auth.oauth.issueToken": {
    area: "auth",
    label: "OAuth 접근토큰 발급",
  },
  "auth.oauth.revokeToken": {
    area: "auth",
    label: "OAuth 접근토큰 폐기",
  },
  "quote.domesticStock.currentPrice": {
    area: "quote",
    label: "국내주식 현재가",
  },
  "quote.domesticStock.orderBook": {
    area: "quote",
    label: "국내주식 호가",
  },
  "quote.domesticStock.multiCurrentPrice": {
    area: "quote",
    label: "국내주식 복수 현재가",
  },
  "marketData.domesticStock.basicInfo": {
    area: "marketData",
    label: "국내주식 종목 기본정보",
  },
  "marketData.domesticStock.dailyCandles": {
    area: "marketData",
    label: "국내주식 일봉 OHLCV",
  },
  "marketData.domesticStock.minuteCandles": {
    area: "marketData",
    label: "국내주식 분봉 OHLCV",
  },
  "marketContext.domesticIndex.current": {
    area: "marketContext",
    label: "국내 주요 지수 현재가",
  },
  "marketContext.domesticIndex.dailyCandles": {
    area: "marketContext",
    label: "국내 주요 지수 일봉 추이",
  },
  "marketContext.domesticIndex.expected": {
    area: "marketContext",
    label: "국내 주요 지수 예상지수",
  },
  "marketContext.domesticMarket.snapshot": {
    area: "marketContext",
    label: "국내 시장 컨텍스트 스냅샷",
  },
  "marketFlow.domesticInvestor.netBuy": {
    area: "marketFlow",
    label: "국내 시장 투자자 순매수",
  },
  "marketFlow.programTrading.trend": {
    area: "marketFlow",
    label: "국내 프로그램 매매 추이",
  },
  "scanner.domesticStock.volumeRanking": {
    area: "scanner",
    label: "국내주식 거래량 상위",
  },
  "scanner.domesticStock.valueRanking": {
    area: "scanner",
    label: "국내주식 거래대금 상위",
  },
  "scanner.domesticStock.changeRateRanking": {
    area: "scanner",
    label: "국내주식 등락률 상위",
  },
  "scanner.conditionSearch.list": {
    area: "scanner",
    label: "조건검색 목록",
  },
  "scanner.conditionSearch.search": {
    area: "scanner",
    label: "조건검색 일반 조회",
  },
  "scanner.conditionSearch.realtime": {
    area: "scanner",
    label: "조건검색 실시간",
  },
  "signal.domesticStock.inputs": {
    area: "signal",
    label: "국내주식 판단 입력값",
  },
  "signal.domesticStock.realtimeInputs": {
    area: "signal",
    label: "국내주식 실시간 판단 입력값",
  },
  "account.domesticStock.cash": {
    area: "account",
    label: "국내주식 예수금/주문가능금액",
  },
  "account.domesticStock.balance": {
    area: "account",
    label: "국내주식 잔고",
  },
  "account.domesticStock.orderHistory": {
    area: "account",
    label: "국내주식 주문/체결 내역",
  },
  "order.domesticStock.buy": {
    area: "order",
    label: "국내주식 매수",
  },
  "order.domesticStock.sell": {
    area: "order",
    label: "국내주식 매도",
  },
  "order.domesticStock.modify": {
    area: "order",
    label: "국내주식 정정",
  },
  "order.domesticStock.cancel": {
    area: "order",
    label: "국내주식 취소",
  },
  "realtime.domesticStock.trade": {
    area: "realtime",
    label: "국내주식 실시간 체결",
  },
  "realtime.domesticStock.orderBook": {
    area: "realtime",
    label: "국내주식 실시간 호가",
  },
  "realtime.domesticStock.orderEvent": {
    area: "realtime",
    label: "국내주식 실시간 주문 이벤트",
  },
  "realtime.domesticStock.balance": {
    area: "realtime",
    label: "국내주식 실시간 잔고",
  },
  "realtime.market.status": {
    area: "realtime",
    label: "시장 장운영 상태",
  },
  "overseasStock.quote.currentPrice": {
    area: "overseasStock",
    label: "해외주식 현재가",
  },
  "overseasStock.quote.orderBook": {
    area: "overseasStock",
    label: "해외주식 호가",
  },
  "overseasStock.marketData.basicInfo": {
    area: "overseasStock",
    label: "해외주식 종목정보",
  },
  "overseasStock.marketData.master": {
    area: "overseasStock",
    label: "해외주식 마스터",
  },
  "overseasStock.marketData.candles": {
    area: "overseasStock",
    label: "해외주식 일주월년 차트",
  },
  "overseasStock.marketData.timeSeries": {
    area: "overseasStock",
    label: "해외주식 시간대별 체결",
  },
  "overseasStock.account.cash": {
    area: "overseasStock",
    label: "해외주식 예수금",
  },
  "overseasStock.account.balance": {
    area: "overseasStock",
    label: "해외주식 잔고/종합잔고평가",
  },
  "overseasStock.account.orderHistory": {
    area: "overseasStock",
    label: "해외주식 주문/체결 내역",
  },
  "overseasStock.account.reservedOrderHistory": {
    area: "overseasStock",
    label: "해외주식 예약주문 처리결과",
  },
  "overseasStock.order.new": {
    area: "overseasStock",
    label: "해외주식 신규 주문",
  },
  "overseasStock.order.modify": {
    area: "overseasStock",
    label: "해외주식 정정 주문",
  },
  "overseasStock.order.cancel": {
    area: "overseasStock",
    label: "해외주식 취소 주문",
  },
  "overseasStock.order.reserve": {
    area: "overseasStock",
    label: "해외주식 예약 주문 등록/취소",
  },
  "overseasStock.realtime.trade": {
    area: "overseasStock",
    label: "해외주식 실시간 체결",
  },
  "overseasStock.realtime.orderBook": {
    area: "overseasStock",
    label: "해외주식 실시간 호가",
  },
  "overseasStock.realtime.orderEvent": {
    area: "overseasStock",
    label: "해외주식 실시간 주문 이벤트",
  },
  "futureOption.quote.currentPrice": {
    area: "futureOption",
    label: "선물/옵션 현재가",
  },
  "futureOption.quote.orderBook": {
    area: "futureOption",
    label: "선물/옵션 호가",
  },
  "futureOption.order.new": {
    area: "futureOption",
    label: "선물/옵션 신규 주문",
  },
  "futureOption.order.modify": {
    area: "futureOption",
    label: "선물/옵션 정정 주문",
  },
  "futureOption.order.cancel": {
    area: "futureOption",
    label: "선물/옵션 취소 주문",
  },
});

export function getCapabilityDefinition(id) {
  return CAPABILITY_DEFINITIONS[id] ?? null;
}
