export const KIS_CAPABILITIES = [
  {
    id: "auth.oauth.issueToken",
    status: "serviceReady",
    apis: [{ id: "/oauth2/tokenP", role: "issueToken", transport: "rest" }],
  },
  {
    id: "auth.oauth.revokeToken",
    status: "serviceReady",
    apis: [{ id: "/oauth2/revokeP", role: "revokeToken", transport: "rest" }],
  },
  {
    id: "auth.oauth.websocketApproval",
    status: "serviceReady",
    apis: [{ id: "/oauth2/Approval", role: "websocketApprovalKey", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.currentPrice",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/quotations/inquire-price", role: "currentPrice", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.orderBook",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/quotations/inquire-asking-price-exp-ccn", role: "orderBook", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.multiCurrentPrice",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/quotations/intstock-multprice", role: "multiCurrentPrice", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.basicInfo",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/quotations/inquire-price", role: "stockBasicInfo", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.dailyCandles",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice", role: "dailyChart", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.minuteCandles",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice", role: "minuteChart", transport: "rest" }],
  },
  {
    id: "technical.domesticStock.indicators",
    status: "composed",
    apis: [],
    caution: "기술적 지표는 표준화된 OHLCV 캔들 위에서 SDK가 계산한다. 매수/매도 판단은 포함하지 않는다.",
  },
  {
    id: "relativeStrength.domesticStock.benchmark",
    status: "composed",
    apis: [],
    caution: "상대강도는 종목 캔들과 벤치마크 캔들을 조합한 SDK 계산값이다.",
  },
  {
    id: "marketBreadth.domesticMarket.indicators",
    status: "composed",
    apis: [],
    caution: "시장 폭 지표는 외부 앱이 제공하는 universe snapshot을 기반으로 계산한다.",
  },
  {
    id: "account.domesticStock.cash",
    status: "serviceReady",
    apis: [
      { id: "/uapi/domestic-stock/v1/trading/inquire-psbl-order", role: "orderableCash", transport: "rest" },
      { id: "/uapi/domestic-stock/v1/trading/pension/inquire-psbl-order", role: "pensionOrderableCash", transport: "rest" },
    ],
  },
  {
    id: "account.domesticStock.balance",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/trading/inquire-balance", role: "stockBalance", transport: "rest" }],
  },
  {
    id: "account.domesticStock.orderHistory",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/trading/inquire-daily-ccld", role: "orderExecutionHistory", transport: "rest" }],
  },
  {
    id: "order.domesticStock.buy",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/trading/order-cash", role: "cashBuy", transport: "rest" }],
    caution: "KIS 주식주문(현금)은 매수/매도 TR ID가 다르다. 주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.sell",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/trading/order-cash", role: "cashSell", transport: "rest" }],
    caution: "KIS 주식주문(현금)은 매수/매도 TR ID가 다르다. 주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.modify",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/trading/order-rvsecncl", role: "modifyOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.cancel",
    status: "serviceReady",
    apis: [{ id: "/uapi/domestic-stock/v1/trading/order-rvsecncl", role: "cancelOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "realtime.domesticStock.trade",
    status: "serviceReady",
    apis: [{ id: "H0STCNT0", role: "krxTrade", transport: "websocket" }],
  },
  {
    id: "realtime.domesticStock.orderBook",
    status: "serviceReady",
    apis: [{ id: "H0STASP0", role: "krxOrderBook", transport: "websocket" }],
  },
  {
    id: "realtime.domesticStock.orderEvent",
    status: "serviceReady",
    apis: [{ id: "H0STCNI0", role: "domesticOrderExecution", transport: "websocket" }],
    caution: "주문 이벤트 실시간은 read-only 검증 대상에서 제외한다.",
  },
  {
    id: "overseasStock.quote.currentPrice",
    status: "metadataOnly",
    apis: [{ id: "/uapi/overseas-price/v1/quotations/price", role: "currentPrice", transport: "rest" }],
  },
  {
    id: "overseasStock.quote.orderBook",
    status: "metadataOnly",
    apis: [{ id: "/uapi/overseas-price/v1/quotations/inquire-asking-price", role: "orderBook", transport: "rest" }],
  },
  {
    id: "overseasStock.marketData.candles",
    status: "serviceReady",
    apis: [
      { id: "/uapi/overseas-price/v1/quotations/inquire-daily-chartprice", role: "periodCandles", transport: "rest" },
      { id: "/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice", role: "minuteCandles", transport: "rest" },
    ],
  },
  {
    id: "overseasStock.technical.indicators",
    status: "composed",
    apis: [],
    caution: "해외주식 기술적 지표는 표준화된 해외주식 캔들 위에서 SDK가 계산한다. 매수/매도 판단은 포함하지 않는다.",
  },
  {
    id: "overseasStock.relativeStrength.benchmark",
    status: "composed",
    apis: [],
    caution: "해외주식 상대강도는 종목 캔들과 명시된 ETF/벤치마크 캔들을 조합한 SDK 계산값이다.",
  },
  {
    id: "overseasStock.account.balance",
    status: "metadataOnly",
    apis: [{ id: "/uapi/overseas-stock/v1/trading/inquire-balance", role: "balance", transport: "rest" }],
  },
  {
    id: "overseasStock.order.new",
    status: "metadataOnly",
    apis: [{ id: "/uapi/overseas-stock/v1/trading/order", role: "newOrder", transport: "rest" }],
    caution: "해외주식 주문은 manifest 연결만 제공하며 live 전송 검증 대상이 아니다.",
  },
];
