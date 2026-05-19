export const KIWOOM_CAPABILITIES = [
  {
    id: "auth.oauth.issueToken",
    status: "serviceReady",
    apis: [{ id: "au10001", role: "issueToken", transport: "rest" }],
  },
  {
    id: "auth.oauth.revokeToken",
    status: "serviceReady",
    apis: [{ id: "au10002", role: "revokeToken", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.currentPrice",
    status: "serviceReady",
    apis: [{ id: "ka10001", role: "basicInfoWithCurrentPrice", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.orderBook",
    status: "serviceReady",
    apis: [{ id: "ka10004", role: "orderBook", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.multiCurrentPrice",
    status: "serviceReady",
    apis: [{ id: "ka10095", role: "watchListInfo", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.basicInfo",
    status: "serviceReady",
    apis: [{ id: "ka10001", role: "stockBasicInfo", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.dailyCandles",
    status: "serviceReady",
    apis: [{ id: "ka10081", role: "dailyChart", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.minuteCandles",
    status: "serviceReady",
    apis: [{ id: "ka10080", role: "minuteChart", transport: "rest" }],
  },
  {
    id: "marketContext.domesticIndex.current",
    status: "serviceReady",
    apis: [{ id: "ka20001", role: "sectorIndexCurrent", transport: "rest" }],
  },
  {
    id: "marketContext.domesticIndex.dailyCandles",
    status: "serviceReady",
    apis: [{ id: "ka20006", role: "sectorIndexDailyChart", transport: "rest" }],
  },
  {
    id: "marketContext.domesticMarket.snapshot",
    status: "composed",
    apis: [],
    caution: "시장 컨텍스트 스냅샷은 주요 지수 현재가를 여러 번 호출해 조합한 SDK 계산값이다.",
  },
  {
    id: "marketFlow.domesticInvestor.netBuy",
    status: "serviceReady",
    apis: [{ id: "ka10051", role: "sectorInvestorNetBuy", transport: "rest" }],
  },
  {
    id: "marketFlow.programTrading.trend",
    status: "serviceReady",
    apis: [{ id: "ka90005", role: "programTradingTimeTrend", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.volumeRanking",
    status: "serviceReady",
    apis: [{ id: "ka10030", role: "todayVolumeRanking", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.valueRanking",
    status: "serviceReady",
    apis: [{ id: "ka10032", role: "tradingValueRanking", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.changeRateRanking",
    status: "serviceReady",
    apis: [{ id: "ka10027", role: "changeRateRanking", transport: "rest" }],
  },
  {
    id: "scanner.conditionSearch.list",
    status: "serviceReady",
    apis: [{ id: "ka10171", role: "conditionList", transport: "websocket" }],
    caution: "조건검색은 키움 WebSocket 조건검색 요청 흐름을 사용한다.",
  },
  {
    id: "scanner.conditionSearch.search",
    status: "serviceReady",
    apis: [{ id: "ka10172", role: "conditionSearch", transport: "websocket" }],
    caution: "조건검색은 키움 WebSocket 조건검색 요청 흐름을 사용한다.",
  },
  {
    id: "scanner.conditionSearch.realtime",
    status: "serviceReady",
    apis: [
      { id: "ka10173", role: "realtimeStart", transport: "websocket" },
      { id: "ka10174", role: "realtimeStop", transport: "websocket" },
    ],
    caution: "실시간 조건검색은 조건검색 목록 조회 이후 사용할 수 있다.",
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
    status: "serviceReady",
    apis: [{ id: "kt00001", role: "cashDetail", transport: "rest" }],
  },
  {
    id: "account.domesticStock.balance",
    status: "serviceReady",
    apis: [{ id: "kt00018", role: "evaluationBalanceDetail", transport: "rest" }],
  },
  {
    id: "account.domesticStock.orderHistory",
    status: "serviceReady",
    apis: [{ id: "kt00007", role: "orderExecutionDetail", transport: "rest" }],
  },
  {
    id: "order.domesticStock.buy",
    status: "serviceReady",
    apis: [{ id: "kt10000", role: "buy", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.sell",
    status: "serviceReady",
    apis: [{ id: "kt10001", role: "sell", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.modify",
    status: "serviceReady",
    apis: [{ id: "kt10002", role: "modify", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.cancel",
    status: "serviceReady",
    apis: [{ id: "kt10003", role: "cancel", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "realtime.domesticStock.trade",
    status: "serviceReady",
    apis: [{ id: "0B", role: "stockTrade", transport: "websocket" }],
  },
  {
    id: "realtime.domesticStock.orderBook",
    status: "serviceReady",
    apis: [
      { id: "0D", role: "orderBookDepth", transport: "websocket" },
      { id: "0C", role: "bestOrderBook", transport: "websocket" },
    ],
  },
  {
    id: "realtime.domesticStock.orderEvent",
    status: "serviceReady",
    apis: [{ id: "00", role: "orderExecution", transport: "websocket" }],
  },
  {
    id: "realtime.domesticStock.balance",
    status: "serviceReady",
    apis: [{ id: "04", role: "balance", transport: "websocket" }],
  },
  {
    id: "realtime.market.status",
    status: "serviceReady",
    apis: [{ id: "0s", role: "marketSessionStatus", transport: "websocket" }],
  },
];
