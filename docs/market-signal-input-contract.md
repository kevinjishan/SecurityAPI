# Market Signal Input Contract

Last updated: 2026-05-22

이 문서는 기술지표, 상대강도, 섹터 비교, 시장폭 계산에서 외부 앱이 SDK에 제공할 수 있는 입력 명세를 고정한다.

원칙은 단순하다. 증권사 API만으로 안정적으로 자동 판별하기 어려운 값은 SDK가 추측하지 않고, 외부 앱이 명시 입력으로 제공한다.

## Universe Policy

시장 판단에서 universe는 계산 대상 종목 목록이다. SecurityAPI의 방향은 시장 universe와 섹터 universe를 분리하는 것이다.

| Universe | Ownership | Policy |
| --- | --- | --- |
| KOSPI/KOSDAQ 전체 종목 | SDK collector 또는 외부 앱 | 종목 목록, 상장상태, 일봉은 수집/저장 대상으로 둔다. |
| 관심종목 | 외부 앱 | 사용자가 정의한 watchlist를 입력한다. |
| 섹터/테마 | 외부 앱 | 전략 관점마다 구성이 달라지므로 SDK가 자동 분류하지 않는다. |

따라서 20일선 위 종목 비율, 신고가/신저가 비율, ADL처럼 시장 전체 기준이 필요한 지표는 수집된 market universe와 저장 캔들을 사용한다. 반면 반도체, 방산, 조선, 전력/SMR 같은 섹터 비교는 사용자가 `basketSymbols` 또는 `basketCandlesBySymbol`로 명시한다.

최소 저장 레이어가 추가될 때의 기본 데이터는 아래 세 가지다.

| Dataset | Required fields | Used by |
| --- | --- | --- |
| `symbols` | `symbol`, `name`, `market`, `status` | market universe |
| `daily_candles` | `symbol`, `date`, `open`, `high`, `low`, `close`, `volume`, `value` | indicators, RS, breadth |
| `sector_baskets` | `basketCode`, `basketName`, `symbol`, `weight` | user-defined sector comparison |

## Common Candle Shape

모든 계산기는 아래 표준 캔들 필드를 읽는다.

```js
{
  date: "20260519",
  timestamp: "20260519",
  open: 270000,
  high: 280000,
  low: 268000,
  close: 275500,
  volume: 1234567,
  value: 340000000000
}
```

| Field | Required | Used by |
| --- | --- | --- |
| `date` or `timestamp` | yes | alignment, series order |
| `close` | yes | SMA/EMA/RS/MA/breadth |
| `high` | for volatility/MFI/stochastic | ATR, MFI, Stochastic, candle patterns |
| `low` | for volatility/MFI/stochastic | ATR, MFI, Stochastic, candle patterns |
| `open` | for candle patterns | bullish/bearish/body/shadow |
| `volume` | for volume indicators | volume MA, OBV, MFI |
| `value` | optional | value ratio |

## Technical Indicators

```js
technical.calculateFromCandles(candles, {
  symbol: "005930",
  interval: "1d",
  smaPeriods: [5, 20, 60, 120, 200],
  emaPeriods: [12, 26],
  rsiPeriod: 14,
});
```

SDK가 read-only로 일봉을 조회해 계산하게 할 수도 있다.

```js
technical.getDomesticStockIndicators("kiwoom", "005930", {
  baseDate: "20260519",
  count: 220,
});
```

## Relative Strength

### Index Benchmark

KOSPI/KOSDAQ 같은 지수 benchmark는 SDK가 read-only로 조회할 수 있다.

```js
relativeStrength.getDomesticStockRelativeStrength("kiwoom", "005930", {
  benchmark: { type: "index", code: "kospi" },
  periods: [20, 60],
  baseDate: "20260519",
  count: 120,
});
```

### Provided Benchmark Candles

섹터 지수, 테마 지수, 외부 데이터 provider가 만든 benchmark는 `benchmarkCandles`로 넣는다.

```js
relativeStrength.calculateRelativeStrength({
  targetCandles,
  benchmarkCandles: sectorIndexCandles,
  benchmark: { type: "sector", code: "semiconductor", label: "반도체" },
}, {
  periods: [20, 60],
});
```

### Sector Basket By Ticker

섹터 지수가 없고 섹터 구성 종목 티커만 있는 경우 `basketSymbols` 또는 `basketCandlesBySymbol`을 사용한다.

```js
relativeStrength.getDomesticStockRelativeStrengthVsBasket("kiwoom", "005930", {
  basketCode: "semiconductor",
  basketName: "반도체",
  basketSymbols: ["000660", "042700", "039030"],
  weighting: "equal",
  periods: [20, 60],
  baseDate: "20260519",
  count: 120,
});
```

이미 외부 앱이 구성 종목 캔들을 캐시했다면 broker 호출 없이 넣을 수 있다.

```js
relativeStrength.getDomesticStockRelativeStrengthVsBasket("kiwoom", "005930", {
  basketCode: "semiconductor",
  basketSymbols: ["000660", "042700", "039030"],
  basketCandlesBySymbol: {
    "000660": skHynixCandles,
    "042700": hanmiCandles,
    "039030": eoTechnicsCandles,
  },
  periods: [20, 60],
});
```

| Input | Meaning |
| --- | --- |
| `basketSymbols` | SDK가 일봉을 조회할 구성 종목 목록 |
| `basketCandlesBySymbol` | 외부 앱이 이미 가진 구성 종목별 캔들 |
| `basketWeights` | 선택 입력. 없으면 동일가중 |
| `excludeTargetFromBasket` | `true`이면 대상 종목이 basket에 있을 때 제외 |
| `basketCode` / `basketName` | 결과 benchmark 식별자 |

Basket 계산 방식:

- 각 구성 종목을 첫 공통 날짜 기준 `100`으로 정규화한다.
- 공통 거래일만 사용한다.
- 기본은 동일가중 평균이다.
- 가격 단위가 다른 종목을 단순 평균하지 않는다.

## Market Breadth

시장폭은 전체 universe가 필요하므로 SDK가 기본으로 전체 종목 live loop를 돌지 않는다. 외부 앱은 아래 중 하나를 제공한다.

```js
marketBreadth.calculateAdvanceDeclineLine([
  { date: "20260517", advancing: 410, declining: 360, unchanged: 30 },
  { date: "20260518", advancing: 390, declining: 385, unchanged: 25 },
  { date: "20260519", advancing: 460, declining: 310, unchanged: 30 },
], {
  market: "kospi",
});
```

```js
marketBreadth.calculateHighLowRatio([
  { symbol: "005930", close: 275500, high52Week: 280000, low52Week: 70000 },
  { symbol: "000660", close: 210000, high52Week: 230000, low52Week: 110000 },
], {
  market: "kospi",
  lookback: 252,
});
```

```js
marketBreadth.calculateAboveMovingAverageRatio({
  "005930": samsungCandles,
  "000660": skHynixCandles,
  "042700": hanmiCandles,
}, {
  market: "kospi",
  period: 20,
});
```

## SignalInputService Inputs

```js
signals.getDomesticStockSignalInputs("kiwoom", "005930", {
  includeTechnicalIndicators: true,
  includeRelativeStrength: true,
  includeMarketBreadth: true,

  benchmark: { type: "index", code: "kospi" },
  benchmarkCandles,
  relativeStrengthPeriods: [20, 60],

  marketBreadthRows,
  highLowRows,
  candlesBySymbol,
});
```

| Input | Used for | Notes |
| --- | --- | --- |
| `benchmarkCandles` | 상대강도 | 비지수 benchmark일 때 필수 |
| `marketBreadthSnapshot` | 시장폭 | 이미 계산된 snapshot을 그대로 사용 |
| `marketBreadthRows` | ADL | 상승/하락/보합 일별 배열 |
| `highLowRows` | 신고가/신저가 | 종목별 52주 고저가 상태 |
| `candlesBySymbol` | 20일선 위 종목 비율 | 종목별 캔들 맵 |

현재 `SignalInputService`는 basket RS를 직접 호출하지 않는다. 섹터 basket RS가 필요하면 앱이 `RelativeStrengthService.getDomesticStockRelativeStrengthVsBasket()`을 먼저 호출하고, 결과를 앱의 전략 입력에 함께 보관한다.

## Not Automatically Inferred

| Area | Reason | Current Solution |
| --- | --- | --- |
| 종목의 섹터 자동 판별 | 증권사별 테마/업종 체계가 다르고 안정적 표준이 없음 | 앱이 `basketSymbols`, `benchmarkCandles`, `basketCandlesBySymbol` 제공 |
| 전체 KOSPI universe 자동 수집 | API 호출량/캐시/운영정책 필요 | 앱이 `candlesBySymbol`, `marketBreadthRows`, `highLowRows` 제공 |
| 섹터 RS vs KOSPI 자동 브리핑 | 섹터 구성과 지수화 정책 필요 | basket benchmark 생성 후 KOSPI와 비교 |
