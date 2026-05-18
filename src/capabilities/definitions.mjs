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
  "overseasStock.quote.currentPrice": {
    area: "overseasStock",
    label: "해외주식 현재가",
  },
  "overseasStock.quote.orderBook": {
    area: "overseasStock",
    label: "해외주식 호가",
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
    label: "해외주식 취소/예약 주문",
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
