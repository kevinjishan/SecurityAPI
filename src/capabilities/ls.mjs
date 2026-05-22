export const LS_CAPABILITIES = [
  {
    id: "auth.oauth.issueToken",
    status: "serviceReady",
    apis: [{ id: "token", role: "issueToken", transport: "rest" }],
  },
  {
    id: "auth.oauth.revokeToken",
    status: "serviceReady",
    apis: [{ id: "revoke", role: "revokeToken", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.currentPrice",
    status: "serviceReady",
    apis: [
      { id: "t1102", role: "currentPrice", transport: "rest" },
      { id: "t1101", role: "currentPriceOrderBook", transport: "rest" },
      { id: "t8450", role: "integratedCurrentPriceOrderBook", transport: "rest" },
    ],
  },
  {
    id: "quote.domesticStock.orderBook",
    status: "serviceReady",
    apis: [
      { id: "t1101", role: "orderBook", transport: "rest" },
      { id: "t8450", role: "integratedOrderBook", transport: "rest" },
    ],
  },
  {
    id: "quote.domesticStock.multiCurrentPrice",
    status: "serviceReady",
    apis: [{ id: "t8407", role: "multiCurrentPrice", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.basicInfo",
    status: "serviceReady",
    apis: [{ id: "t1102", role: "stockBasicInfo", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.dailyCandles",
    status: "serviceReady",
    apis: [{ id: "t8410", role: "dailyChart", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.minuteCandles",
    status: "serviceReady",
    apis: [{ id: "t8412", role: "minuteChart", transport: "rest" }],
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
    caution: "상대강도는 종목 캔들과 벤치마크 캔들을 조합한 SDK 계산값이며, 섹터 매핑은 외부 앱 또는 provider가 제공한다.",
  },
  {
    id: "marketBreadth.domesticMarket.indicators",
    status: "composed",
    apis: [],
    caution: "시장 폭 지표는 외부 앱이 제공하는 universe snapshot을 기반으로 계산하며, 전체시장 live 수집은 SDK 기본 동작이 아니다.",
  },
  {
    id: "marketContext.domesticIndex.current",
    status: "serviceReady",
    apis: [{ id: "t1511", role: "sectorIndexCurrent", transport: "rest" }],
  },
  {
    id: "marketContext.domesticIndex.dailyCandles",
    status: "serviceReady",
    apis: [{ id: "t1514", role: "sectorIndexPeriodTrend", transport: "rest" }],
  },
  {
    id: "marketContext.domesticIndex.expected",
    status: "serviceReady",
    apis: [{ id: "t1485", role: "expectedIndex", transport: "rest" }],
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
    apis: [{ id: "t1602", role: "investorTimeSeriesByMarket", transport: "rest" }],
  },
  {
    id: "marketFlow.programTrading.trend",
    status: "serviceReady",
    apis: [{ id: "t1632", role: "programTradingTimeTrend", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.volumeRanking",
    status: "serviceReady",
    apis: [{ id: "t1452", role: "volumeRanking", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.valueRanking",
    status: "serviceReady",
    apis: [{ id: "t1463", role: "tradingValueRanking", transport: "rest" }],
  },
  {
    id: "scanner.domesticStock.changeRateRanking",
    status: "serviceReady",
    apis: [{ id: "t1441", role: "changeRateRanking", transport: "rest" }],
  },
  {
    id: "scanner.conditionSearch.list",
    status: "serviceReady",
    apis: [{ id: "t1866", role: "conditionList", transport: "rest" }],
  },
  {
    id: "scanner.conditionSearch.search",
    status: "serviceReady",
    apis: [{ id: "t1859", role: "conditionSearch", transport: "rest" }],
  },
  {
    id: "scanner.conditionSearch.realtime",
    status: "serviceReady",
    apis: [
      { id: "t1860", role: "realtimeSession", transport: "rest" },
      { id: "AFR", role: "realtimeEvent", transport: "websocket" },
    ],
    caution: "LS 실시간 조건검색은 t1860에서 받은 실시간키로 AFR WebSocket을 구독한다.",
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
    apis: [{ id: "CSPAQ12200", role: "cashAndOrderableAmount", transport: "rest" }],
  },
  {
    id: "account.domesticStock.balance",
    status: "serviceReady",
    apis: [{ id: "t0424", role: "stockBalance", transport: "rest" }],
  },
  {
    id: "account.domesticStock.orderHistory",
    status: "serviceReady",
    apis: [{ id: "CSPAQ13700", role: "orderExecutionHistory", transport: "rest" }],
  },
  {
    id: "order.domesticStock.buy",
    status: "serviceReady",
    apis: [{ id: "CSPAT00601", role: "newOrder", transport: "rest" }],
    caution: "현물주문 TR은 매수/매도를 요청 필드로 구분한다. 주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.sell",
    status: "serviceReady",
    apis: [{ id: "CSPAT00601", role: "newOrder", transport: "rest" }],
    caution: "현물주문 TR은 매수/매도를 요청 필드로 구분한다. 주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.modify",
    status: "serviceReady",
    apis: [{ id: "CSPAT00701", role: "modifyOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.cancel",
    status: "serviceReady",
    apis: [{ id: "CSPAT00801", role: "cancelOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "realtime.domesticStock.trade",
    status: "serviceReady",
    apis: [
      { id: "S3_", role: "kospiTrade", transport: "websocket" },
      { id: "K3_", role: "kosdaqTrade", transport: "websocket" },
      { id: "US3", role: "integratedTrade", transport: "websocket" },
    ],
  },
  {
    id: "realtime.domesticStock.orderBook",
    status: "serviceReady",
    apis: [
      { id: "H1_", role: "kospiOrderBook", transport: "websocket" },
      { id: "HA_", role: "kosdaqOrderBook", transport: "websocket" },
      { id: "UH1", role: "integratedOrderBook", transport: "websocket" },
    ],
  },
  {
    id: "realtime.domesticStock.orderEvent",
    status: "serviceReady",
    apis: [
      { id: "SC0", role: "orderAccepted", transport: "websocket" },
      { id: "SC1", role: "orderExecuted", transport: "websocket" },
      { id: "SC2", role: "orderModified", transport: "websocket" },
      { id: "SC3", role: "orderCanceled", transport: "websocket" },
      { id: "SC4", role: "orderRejected", transport: "websocket" },
    ],
  },
  {
    id: "realtime.market.status",
    status: "serviceReady",
    apis: [{ id: "JIF", role: "marketSessionStatus", transport: "websocket" }],
  },
  {
    id: "overseasStock.quote.currentPrice",
    status: "serviceReady",
    apis: [{ id: "g3101", role: "currentPrice", transport: "rest" }],
  },
  {
    id: "overseasStock.quote.orderBook",
    status: "serviceReady",
    apis: [{ id: "g3106", role: "orderBook", transport: "rest" }],
  },
  {
    id: "overseasStock.marketData.basicInfo",
    status: "serviceReady",
    apis: [{ id: "g3104", role: "basicInfo", transport: "rest" }],
  },
  {
    id: "overseasStock.marketData.master",
    status: "serviceReady",
    apis: [{ id: "g3190", role: "master", transport: "rest" }],
  },
  {
    id: "overseasStock.marketData.candles",
    status: "serviceReady",
    apis: [
      { id: "g3204", role: "periodCandles", transport: "rest" },
      { id: "g3103", role: "simplePeriodCandles", transport: "rest" },
    ],
  },
  {
    id: "overseasStock.marketData.timeSeries",
    status: "serviceReady",
    apis: [{ id: "g3102", role: "timeSeries", transport: "rest" }],
  },
  {
    id: "overseasStock.technical.indicators",
    status: "composed",
    apis: [],
    caution: "해외주식 기술적 지표는 표준화된 해외주식 캔들 위에서 SDK가 계산한다. 매수/매도 판단은 포함하지 않는다.",
  },
  {
    id: "overseasStock.account.cash",
    status: "serviceReady",
    apis: [{ id: "COSOQ02701", role: "cash", transport: "rest" }],
  },
  {
    id: "overseasStock.account.balance",
    status: "serviceReady",
    apis: [{ id: "COSOQ00201", role: "balance", transport: "rest" }],
  },
  {
    id: "overseasStock.account.orderHistory",
    status: "serviceReady",
    apis: [{ id: "COSAQ00102", role: "orderExecutionHistory", transport: "rest" }],
  },
  {
    id: "overseasStock.account.reservedOrderHistory",
    status: "serviceReady",
    apis: [{ id: "COSAQ01400", role: "reservedOrderHistory", transport: "rest" }],
  },
  {
    id: "overseasStock.order.new",
    status: "serviceReady",
    apis: [{ id: "COSAT00301", role: "usMarketOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "overseasStock.order.modify",
    status: "serviceReady",
    apis: [{ id: "COSAT00311", role: "usMarketModifyOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "overseasStock.order.cancel",
    status: "serviceReady",
    apis: [{ id: "COSAT00301", role: "usMarketCancelOrder", transport: "rest" }],
    caution: "미국시장주문 TR은 OrdPtnCode=08로 취소 주문을 구분한다. 주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "overseasStock.order.reserve",
    status: "serviceReady",
    apis: [{ id: "COSAT00400", role: "reservedOrderRegisterOrCancel", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "overseasStock.realtime.trade",
    status: "serviceReady",
    apis: [{ id: "GSC", role: "overseasTrade", transport: "websocket" }],
  },
  {
    id: "overseasStock.realtime.orderBook",
    status: "serviceReady",
    apis: [{ id: "GSH", role: "overseasOrderBook", transport: "websocket" }],
  },
  {
    id: "overseasStock.realtime.orderEvent",
    status: "serviceReady",
    apis: [
      { id: "AS0", role: "overseasOrderAccepted", transport: "websocket" },
      { id: "AS1", role: "overseasOrderExecuted", transport: "websocket" },
      { id: "AS2", role: "overseasOrderModified", transport: "websocket" },
      { id: "AS3", role: "overseasOrderCanceled", transport: "websocket" },
      { id: "AS4", role: "overseasOrderRejected", transport: "websocket" },
    ],
  },
  {
    id: "futureOption.quote.currentPrice",
    status: "parked",
    apis: [
      { id: "t2111", role: "currentPrice", transport: "rest" },
      { id: "t8402", role: "stockFutureCurrentPrice", transport: "rest" },
    ],
  },
  {
    id: "futureOption.quote.orderBook",
    status: "parked",
    apis: [{ id: "t2112", role: "orderBook", transport: "rest" }],
  },
  {
    id: "futureOption.order.new",
    status: "parked",
    apis: [{ id: "CFOAT00100", role: "newOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "futureOption.order.modify",
    status: "parked",
    apis: [{ id: "CFOAT00200", role: "modifyOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "futureOption.order.cancel",
    status: "parked",
    apis: [{ id: "CFOAT00300", role: "cancelOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
];
