export const DB_CAPABILITIES = [
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
    apis: [{ id: "PRICE", role: "currentPrice", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.orderBook",
    status: "serviceReady",
    apis: [{ id: "HOGA", role: "orderBook", transport: "rest" }],
  },
  {
    id: "quote.domesticStock.multiCurrentPrice",
    status: "serviceReady",
    apis: [{ id: "MULTIPRICE", role: "multiCurrentPrice", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.basicInfo",
    status: "serviceReady",
    apis: [{ id: "PRICE", role: "stockBasicInfo", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.dailyCandles",
    status: "serviceReady",
    apis: [{ id: "CHARTDAY", role: "dailyChart", transport: "rest" }],
  },
  {
    id: "marketData.domesticStock.minuteCandles",
    status: "serviceReady",
    apis: [{ id: "CHARTMIN", role: "minuteChart", transport: "rest" }],
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
    apis: [{ id: "CDPCQ00100", role: "cash", transport: "rest" }],
  },
  {
    id: "account.domesticStock.balance",
    status: "serviceReady",
    apis: [{ id: "CSPAQ03420", role: "stockBalance", transport: "rest" }],
  },
  {
    id: "account.domesticStock.orderHistory",
    status: "serviceReady",
    apis: [{ id: "CSPAQ04800", role: "orderExecutionHistory", transport: "rest" }],
  },
  {
    id: "order.domesticStock.buy",
    status: "serviceReady",
    apis: [{ id: "CSPAT00600", role: "newOrder", transport: "rest" }],
    caution: "주식종합주문 TR은 매수/매도를 요청 필드로 구분한다. 주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.sell",
    status: "serviceReady",
    apis: [{ id: "CSPAT00600", role: "newOrder", transport: "rest" }],
    caution: "주식종합주문 TR은 매수/매도를 요청 필드로 구분한다. 주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.modify",
    status: "serviceReady",
    apis: [{ id: "CSPAT00700", role: "modifyOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "order.domesticStock.cancel",
    status: "serviceReady",
    apis: [{ id: "CSPAT00800", role: "cancelOrder", transport: "rest" }],
    caution: "주문 API는 기본 retry 대상이 아니다.",
  },
  {
    id: "realtime.domesticStock.trade",
    status: "serviceReady",
    apis: [{ id: "S00", role: "stockTrade", transport: "websocket" }],
  },
  {
    id: "realtime.domesticStock.orderBook",
    status: "serviceReady",
    apis: [{ id: "S01", role: "stockOrderBook", transport: "websocket" }],
  },
  {
    id: "realtime.domesticStock.orderEvent",
    status: "serviceReady",
    apis: [
      { id: "IS0", role: "orderAccepted", transport: "websocket" },
      { id: "IS1", role: "orderExecuted", transport: "websocket" },
    ],
  },
  {
    id: "overseasStock.quote.currentPrice",
    status: "metadataOnly",
    apis: [{ id: "FSTKPRICE", role: "currentPrice", transport: "rest" }],
  },
  {
    id: "overseasStock.quote.orderBook",
    status: "metadataOnly",
    apis: [{ id: "FSTKHOGA", role: "orderBook", transport: "rest" }],
  },
  {
    id: "overseasStock.order.new",
    status: "metadataOnly",
    apis: [{ id: "CAZCT00100", role: "newOrder", transport: "rest" }],
    caution: "해외주식 주문은 manifest 연결만 제공하며 live 전송 검증 대상이 아니다.",
  },
];
