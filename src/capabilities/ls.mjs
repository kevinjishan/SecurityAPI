export const LS_CAPABILITIES = [
  {
    id: "auth.oauth.issueToken",
    status: "documented",
    apis: [{ id: "token", role: "issueToken", transport: "rest" }],
  },
  {
    id: "auth.oauth.revokeToken",
    status: "documented",
    apis: [{ id: "revoke", role: "revokeToken", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.currentPrice",
    status: "documented",
    apis: [
      { id: "t1102", role: "currentPrice", transport: "rest" },
      { id: "t1101", role: "currentPriceOrderBook", transport: "rest" },
      { id: "t8450", role: "integratedCurrentPriceOrderBook", transport: "rest" },
    ],
  },
  {
    id: "quote.domesticStock.orderBook",
    status: "documented",
    apis: [
      { id: "t1101", role: "orderBook", transport: "rest" },
      { id: "t8450", role: "integratedOrderBook", transport: "rest" },
    ],
  },
  {
    id: "quote.domesticStock.multiCurrentPrice",
    status: "documented",
    apis: [{ id: "t8407", role: "multiCurrentPrice", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.basicInfo",
    status: "documented",
    apis: [{ id: "t1102", role: "stockBasicInfo", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.dailyCandles",
    status: "documented",
    apis: [{ id: "t8410", role: "dailyChart", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.minuteCandles",
    status: "documented",
    apis: [{ id: "t8412", role: "minuteChart", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.volumeRanking",
    status: "documented",
    apis: [{ id: "t1452", role: "volumeRanking", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.valueRanking",
    status: "documented",
    apis: [{ id: "t1463", role: "tradingValueRanking", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.changeRateRanking",
    status: "documented",
    apis: [{ id: "t1441", role: "changeRateRanking", transport: "rest" }],
  },
  {
    id: "signal.domesticStock.inputs",
    status: "composed",
    apis: [],
    caution: "시그널 입력값은 여러 조회성 API 결과를 조합한 SDK 계산값이며 매수/매도 판단을 포함하지 않는다.",
  },
  {
    id: "signal.domesticStock.realtimeInputs",
    status: "composed",
    apis: [],
    caution: "실시간 시그널 입력값은 체결/호가 WebSocket 메시지를 누적한 SDK 계산값이며 매수/매도 판단을 포함하지 않는다.",
  },
  {
    id: "account.domesticStock.cash",
    status: "documented",
    apis: [
      { id: "CSPAQ12200", role: "cashAndOrderableAmount", transport: "rest" },
      { id: "CSPAQ22200", role: "cashAndOrderableAmount2", transport: "rest" },
      { id: "CSPBQ00200", role: "orderableQuantityByMarginRate", transport: "rest" },
    ],
  },
  {
    id: "account.domesticStock.balance",
    status: "documented",
    apis: [
      { id: "t0424", role: "stockBalance", transport: "rest" },
      { id: "FOCCQ33600", role: "profitRateDetail", transport: "rest" },
    ],
  },
  {
    id: "account.domesticStock.orderHistory",
    status: "documented",
    apis: [
      { id: "CSPAQ13700", role: "orderExecutionHistory", transport: "rest" },
      { id: "CDPCQ04700", role: "accountTransactionHistory", transport: "rest" },
    ],
  },
  {
    id: "order.domesticStock.buy",
    status: "documented",
    apis: [{ id: "CSPAT00601", role: "newOrder", transport: "rest" }],
    caution: "현물주문 TR은 매수/매도를 요청 필드로 구분한다. 주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.sell",
    status: "documented",
    apis: [{ id: "CSPAT00601", role: "newOrder", transport: "rest" }],
    caution: "현물주문 TR은 매수/매도를 요청 필드로 구분한다. 주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.modify",
    status: "documented",
    apis: [{ id: "CSPAT00701", role: "modifyOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.cancel",
    status: "documented",
    apis: [{ id: "CSPAT00801", role: "cancelOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "realtime.domesticStock.trade",
    status: "documented",
    apis: [
      { id: "S3_", role: "kospiTrade", transport: "websocket" },
      { id: "K3_", role: "kosdaqTrade", transport: "websocket" },
      { id: "US3", role: "integratedTrade", transport: "websocket" },
    ],
  },
  {
    id: "realtime.domesticStock.orderBook",
    status: "documented",
    apis: [
      { id: "H1_", role: "kospiOrderBook", transport: "websocket" },
      { id: "HA_", role: "kosdaqOrderBook", transport: "websocket" },
      { id: "UH1", role: "integratedOrderBook", transport: "websocket" },
    ],
  },
  {
    id: "realtime.domesticStock.orderEvent",
    status: "documented",
    apis: [
      { id: "SC0", role: "orderAccepted", transport: "websocket" },
      { id: "SC1", role: "orderExecuted", transport: "websocket" },
      { id: "SC2", role: "orderModified", transport: "websocket" },
      { id: "SC3", role: "orderCanceled", transport: "websocket" },
      { id: "SC4", role: "orderRejected", transport: "websocket" },
    ],
  },
  {
    id: "overseasStock.quote.currentPrice",
    status: "documented",
    apis: [{ id: "g3101", role: "currentPrice", transport: "rest" }],
  },
  {
    id: "overseasStock.quote.orderBook",
    status: "documented",
    apis: [{ id: "g3106", role: "orderBook", transport: "rest" }],
  },
  {
    id: "overseasStock.order.new",
    status: "documented",
    apis: [{ id: "COSAT00301", role: "usMarketOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "overseasStock.order.modify",
    status: "documented",
    apis: [{ id: "COSAT00311", role: "usMarketModifyOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "overseasStock.order.cancel",
    status: "documented",
    apis: [{ id: "COSAT00400", role: "reservedOrderRegisterOrCancel", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "futureOption.quote.currentPrice",
    status: "documented",
    apis: [
      { id: "t2111", role: "currentPrice", transport: "rest" },
      { id: "t8402", role: "stockFutureCurrentPrice", transport: "rest" },
    ],
  },
  {
    id: "futureOption.quote.orderBook",
    status: "documented",
    apis: [{ id: "t2112", role: "orderBook", transport: "rest" }],
  },
  {
    id: "futureOption.order.new",
    status: "documented",
    apis: [{ id: "CFOAT00100", role: "newOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "futureOption.order.modify",
    status: "documented",
    apis: [{ id: "CFOAT00200", role: "modifyOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "futureOption.order.cancel",
    status: "documented",
    apis: [{ id: "CFOAT00300", role: "cancelOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
];
