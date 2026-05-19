export const KIWOOM_CAPABILITIES = [
  {
    id: "auth.oauth.issueToken",
    status: "documented",
    apis: [{ id: "au10001", role: "issueToken", transport: "rest" }],
  },
  {
    id: "auth.oauth.revokeToken",
    status: "documented",
    apis: [{ id: "au10002", role: "revokeToken", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.currentPrice",
    status: "documented",
    apis: [{ id: "ka10001", role: "basicInfoWithCurrentPrice", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.orderBook",
    status: "documented",
    apis: [{ id: "ka10004", role: "orderBook", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.multiCurrentPrice",
    status: "documented",
    apis: [{ id: "ka10095", role: "watchListInfo", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.basicInfo",
    status: "documented",
    apis: [{ id: "ka10001", role: "stockBasicInfo", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.dailyCandles",
    status: "documented",
    apis: [{ id: "ka10081", role: "dailyChart", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.minuteCandles",
    status: "documented",
    apis: [{ id: "ka10080", role: "minuteChart", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.volumeRanking",
    status: "documented",
    apis: [{ id: "ka10030", role: "todayVolumeRanking", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.valueRanking",
    status: "documented",
    apis: [{ id: "ka10032", role: "tradingValueRanking", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.changeRateRanking",
    status: "documented",
    apis: [{ id: "ka10027", role: "changeRateRanking", transport: "rest" }],
  },
  {
    id: "account.domesticStock.cash",
    status: "documented",
    apis: [
      { id: "kt00001", role: "cashDetail", transport: "rest" },
      { id: "kt00010", role: "withdrawableOrderCash", transport: "rest" },
      { id: "kt00011", role: "orderableQuantityByMarginRate", transport: "rest" },
    ],
  },
  {
    id: "account.domesticStock.balance",
    status: "documented",
    apis: [
      { id: "kt00004", role: "accountEvaluation", transport: "rest" },
      { id: "kt00005", role: "executionBalance", transport: "rest" },
      { id: "kt00018", role: "evaluationBalanceDetail", transport: "rest" },
    ],
  },
  {
    id: "account.domesticStock.orderHistory",
    status: "documented",
    apis: [
      { id: "kt00007", role: "orderExecutionDetail", transport: "rest" },
      { id: "kt00009", role: "orderExecutionStatus", transport: "rest" },
    ],
  },
  {
    id: "order.domesticStock.buy",
    status: "documented",
    apis: [{ id: "kt10000", role: "buy", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.sell",
    status: "documented",
    apis: [{ id: "kt10001", role: "sell", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.modify",
    status: "documented",
    apis: [{ id: "kt10002", role: "modify", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.cancel",
    status: "documented",
    apis: [{ id: "kt10003", role: "cancel", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "realtime.domesticStock.trade",
    status: "documented",
    apis: [{ id: "0B", role: "stockTrade", transport: "websocket" }],
  },
  {
    id: "realtime.domesticStock.orderBook",
    status: "documented",
    apis: [
      { id: "0D", role: "orderBookDepth", transport: "websocket" },
      { id: "0C", role: "bestOrderBook", transport: "websocket" },
    ],
  },
  {
    id: "realtime.domesticStock.orderEvent",
    status: "documented",
    apis: [{ id: "00", role: "orderExecution", transport: "websocket" }],
  },
  {
    id: "realtime.domesticStock.balance",
    status: "documented",
    apis: [{ id: "04", role: "balance", transport: "websocket" }],
  },
];
