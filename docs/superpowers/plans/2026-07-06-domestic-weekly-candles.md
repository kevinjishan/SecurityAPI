# 국내주식 주봉 캔들 + 캔들 통합 코어 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 국내주식 주봉(1w) 캔들을 4개 브로커(LS/Kiwoom/DB/KIS)에 추가하고, 일/주/월 캔들을 interval 기반 단일 코어(`getDomesticStockCandles`)로 통합하되 기존 유형별 메서드는 얇은 파사드로 하위호환 유지.

**Architecture:** Approach C — interval 지원 매트릭스(`candleSupport.mjs`)를 단일 진실원천으로 두고, `MarketDataService.getDomesticStockCandles(broker, symbol, {interval})` 코어가 매트릭스로 라우팅한다. 유형별 메서드(daily/weekly/monthly)는 코어에 interval만 넘기는 파사드다. 미지원 interval은 그 interval을 명시한 구조화 에러로 차단한다.

**Tech Stack:** JavaScript ES Modules (`.mjs`), Node.js >= 20, `node --test` 내장 테스트 러너. 외부 의존성 없음.

## Global Constraints

- 언어: JavaScript ES Module(`.mjs`), `"type": "module"`. TypeScript/JSX 금지.
- Node.js >= 20. `node --test` 사용.
- 브로커명은 소문자: `kiwoom`, `ls`, `db`, `kis`.
- 에러는 항상 `BrokerError`(from `../core/index.mjs`) 사용. 조용한 실패·빈 배열 위장 금지.
- 캔들 반환 스키마 불변: `{ broker, symbol, interval, candles[], summary?, source }`.
- interval 문자열 정규형: 일봉 `"1d"`, 주봉 `"1w"`, 월봉 `"1mo"`, 분봉 `"<N>m"`.
- **PR #12 월봉 동작 불변**: `getDomesticStockMonthlyCandles(broker, symbol, options)` 시그니처·요청 파라미터·반환값이 완전히 동일해야 한다(기존 테스트가 회귀 게이트).
- capability 검증은 `npm test`로만 강제(스크립트는 `src/capabilities/`를 참조하지 않음).
- 검증 게이트(모두 green): `npm test`, `npm run validate:manifest`, `npm run validate:docs`.

## File Structure

- **Create** `src/services/candleSupport.mjs` — interval 매트릭스(단일 진실원천): interval→capabilityId, 브로커별 주기코드(LS gubun / KIS FID_PERIOD_DIV_CODE), interval 분류기(`classifyCandleInterval`). 순수 함수만, 다른 서비스에 의존하지 않음.
- **Create** `test/services/candleSupport.test.mjs` — 매트릭스/분류기 단위 테스트.
- **Modify** `src/capabilities/definitions.mjs` — `weeklyCandles` capability 정의 추가.
- **Modify** `src/capabilities/kiwoom.mjs`, `ls.mjs`, `db.mjs`, `kis.mjs` — 브로커별 주봉 capability 선언 추가.
- **Create** `test/capabilities/weeklyCandles.test.mjs` — 주봉 capability 지원 + 매트릭스↔정의 일관성 테스트.
- **Modify** `src/services/MarketDataService.mjs` — 통합 코어 `getDomesticStockCandles`, 파사드 위임, 주봉 request/normalize 추가.
- **Modify** `test/services/MarketDataService.test.mjs` — 통합 코어/주봉/미지원 interval 테스트.

각 브로커의 주봉 API(문서 검증 완료):

| 브로커 | 주봉 sourceId | 요청 파라미터 근거 | 응답 배열 | 정규화 재사용 |
|--------|--------------|-------------------|-----------|--------------|
| kiwoom | `ka10082` | `{stk_cd, base_dt, upd_stkpc_tp}` (일/월과 동일) | `stk_stk_pole_chart_qry` | `normalizeKiwoomCandles` |
| ls | `t8410` | `t8410InBlock.gubun="3"` | `t8410OutBlock1` | `normalizeLsCandles` |
| db | `CHARTWEEK` | `In{...일봉필드, InputPeriodDivCode:"W"}` | `Out` | `normalizeDbCandles` |
| kis | `inquire-daily-itemchartprice` | `FID_PERIOD_DIV_CODE="W"` | `output2` | `normalizeKisCandles` |

---

### Task 1: candleSupport 매트릭스 + interval 분류기

**Files:**
- Create: `src/services/candleSupport.mjs`
- Test: `test/services/candleSupport.test.mjs`

**Interfaces:**
- Produces:
  - `CANDLE_CAPABILITY_IDS`: `{ "1d": string, "1w": string, "1mo": string, minute: string }` — interval→capabilityId 문자열 상수(단일 진실원천).
  - `weeklyPeriodCode(broker: string): string` — LS→`"3"`, KIS→`"W"`. 그 외 broker는 KIS 기본값 `"W"` 반환(월봉 `monthlyPeriodCode` 관례와 동일).
  - `classifyCandleInterval(input: unknown): { kind: "period"|"minute"|"unsupported", interval: string|null, minutes: number|null }` — 입력을 정규 interval로 분류.

- [ ] **Step 1: Write the failing test**

Create `test/services/candleSupport.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";

import {
  CANDLE_CAPABILITY_IDS,
  weeklyPeriodCode,
  classifyCandleInterval,
} from "../../src/services/candleSupport.mjs";

test("capability id map covers day/week/month/minute", () => {
  assert.equal(CANDLE_CAPABILITY_IDS["1d"], "marketData.domesticStock.dailyCandles");
  assert.equal(CANDLE_CAPABILITY_IDS["1w"], "marketData.domesticStock.weeklyCandles");
  assert.equal(CANDLE_CAPABILITY_IDS["1mo"], "marketData.domesticStock.monthlyCandles");
  assert.equal(CANDLE_CAPABILITY_IDS.minute, "marketData.domesticStock.minuteCandles");
});

test("weeklyPeriodCode maps ls and kis", () => {
  assert.equal(weeklyPeriodCode("ls"), "3");
  assert.equal(weeklyPeriodCode("kis"), "W");
});

test("classifyCandleInterval recognizes period intervals and aliases", () => {
  assert.deepEqual(classifyCandleInterval("1w"), { kind: "period", interval: "1w", minutes: null });
  assert.deepEqual(classifyCandleInterval("weekly"), { kind: "period", interval: "1w", minutes: null });
  assert.deepEqual(classifyCandleInterval("1d"), { kind: "period", interval: "1d", minutes: null });
  assert.deepEqual(classifyCandleInterval("monthly"), { kind: "period", interval: "1mo", minutes: null });
});

test("classifyCandleInterval recognizes minute intervals", () => {
  assert.deepEqual(classifyCandleInterval("5m"), { kind: "minute", interval: "5m", minutes: 5 });
  assert.deepEqual(classifyCandleInterval("60m"), { kind: "minute", interval: "60m", minutes: 60 });
});

test("classifyCandleInterval flags unsupported and missing intervals", () => {
  assert.equal(classifyCandleInterval("1y").kind, "unsupported");
  assert.equal(classifyCandleInterval("tick").kind, "unsupported");
  assert.equal(classifyCandleInterval(undefined).kind, "unsupported");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/services/candleSupport.test.mjs`
Expected: FAIL — `Cannot find module '.../src/services/candleSupport.mjs'`.

- [ ] **Step 3: Write minimal implementation**

Create `src/services/candleSupport.mjs`:

```javascript
export const CANDLE_CAPABILITY_IDS = Object.freeze({
  "1d": "marketData.domesticStock.dailyCandles",
  "1w": "marketData.domesticStock.weeklyCandles",
  "1mo": "marketData.domesticStock.monthlyCandles",
  minute: "marketData.domesticStock.minuteCandles",
});

const PERIOD_ALIASES = Object.freeze({
  "1d": "1d", d: "1d", day: "1d", daily: "1d",
  "1w": "1w", w: "1w", week: "1w", weekly: "1w",
  "1mo": "1mo", mo: "1mo", month: "1mo", monthly: "1mo",
});

const WEEKLY_PERIOD_CODES = Object.freeze({ ls: "3", kis: "W" });

export function weeklyPeriodCode(broker) {
  return WEEKLY_PERIOD_CODES[broker] ?? "W";
}

export function classifyCandleInterval(input) {
  if (input == null) {
    return { kind: "unsupported", interval: null, minutes: null };
  }

  const raw = String(input).trim().toLowerCase();
  const period = PERIOD_ALIASES[raw];
  if (period) {
    return { kind: "period", interval: period, minutes: null };
  }

  const minuteMatch = raw.match(/^(\d+)(?:m|min)$/);
  if (minuteMatch) {
    const minutes = Number(minuteMatch[1]);
    if (Number.isInteger(minutes) && minutes > 0) {
      return { kind: "minute", interval: `${minutes}m`, minutes };
    }
  }

  return { kind: "unsupported", interval: null, minutes: null };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/services/candleSupport.test.mjs`
Expected: PASS — 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/services/candleSupport.mjs test/services/candleSupport.test.mjs
git commit -m "feat: add candle support matrix and interval classifier"
```

---

### Task 2: 주봉 capability 선언 + 일관성 테스트

**Files:**
- Modify: `src/capabilities/definitions.mjs`
- Modify: `src/capabilities/kiwoom.mjs`, `src/capabilities/ls.mjs`, `src/capabilities/db.mjs`, `src/capabilities/kis.mjs`
- Test: `test/capabilities/weeklyCandles.test.mjs`

**Interfaces:**
- Consumes: `CANDLE_CAPABILITY_IDS` (Task 1), `getCapabilities(broker)` from `src/capabilities/index.mjs` (기존; `MarketDataService.mjs:1`에서 import되는 것과 동일).
- Produces: 4개 브로커가 `marketData.domesticStock.weeklyCandles`를 `serviceReady`로 광고.

- [ ] **Step 1: Write the failing test**

Create `test/capabilities/weeklyCandles.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";

import { getCapabilities } from "../../src/capabilities/index.mjs";
import { CAPABILITY_DEFINITIONS } from "../../src/capabilities/definitions.mjs";
import { CANDLE_CAPABILITY_IDS } from "../../src/services/candleSupport.mjs";

test("every candle interval capability id is defined", () => {
  for (const capabilityId of Object.values(CANDLE_CAPABILITY_IDS)) {
    assert.ok(
      Object.hasOwn(CAPABILITY_DEFINITIONS, capabilityId),
      `${capabilityId} missing from CAPABILITY_DEFINITIONS`,
    );
  }
});

test("all domestic brokers advertise weekly candles", () => {
  for (const broker of ["kiwoom", "ls", "db", "kis"]) {
    assert.equal(
      getCapabilities(broker).supports("marketData.domesticStock.weeklyCandles"),
      true,
      `${broker} should support weekly candles`,
    );
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/capabilities/weeklyCandles.test.mjs`
Expected: FAIL — `weeklyCandles missing from CAPABILITY_DEFINITIONS` 및 supports() false.

> 참고: `getCapabilities`의 정확한 export/시그니처는 `src/capabilities/index.mjs`에서 확인하라(`MarketDataService.mjs` 상단에서 `import { getCapabilities } from "../capabilities/index.mjs"`로 사용됨). broker 문자열을 받아 `supports(capabilityId)` 메서드를 가진 객체를 반환한다.

- [ ] **Step 3: Write minimal implementation**

In `src/capabilities/definitions.mjs`, add after the `monthlyCandles` entry (기존 `marketData.domesticStock.minuteCandles` 정의 바로 앞):

```javascript
  "marketData.domesticStock.weeklyCandles": {
    area: "marketData",
    label: "국내주식 주봉 OHLCV",
  },
```

In `src/capabilities/kiwoom.mjs`, add after the `monthlyCandles` capability object:

```javascript
      {
        id: "marketData.domesticStock.weeklyCandles",
        status: "serviceReady",
        apis: [{ id: "ka10082", role: "weeklyChart", transport: "rest" }],
      },
```

In `src/capabilities/ls.mjs`, add after the `monthlyCandles` capability object:

```javascript
      {
        id: "marketData.domesticStock.weeklyCandles",
        status: "serviceReady",
        apis: [{ id: "t8410", role: "weeklyChart", transport: "rest" }],
      },
```

In `src/capabilities/db.mjs`, add after the `dailyCandles` capability object (DB는 monthly 없음):

```javascript
      {
        id: "marketData.domesticStock.weeklyCandles",
        status: "serviceReady",
        apis: [{ id: "CHARTWEEK", role: "weeklyChart", transport: "rest" }],
      },
```

In `src/capabilities/kis.mjs`, add after the `monthlyCandles` capability object:

```javascript
      {
        id: "marketData.domesticStock.weeklyCandles",
        status: "serviceReady",
        apis: [{ id: "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice", role: "weeklyChart", transport: "rest" }],
      },
```

> 들여쓰기/객체 위치는 각 파일의 기존 `dailyCandles`/`monthlyCandles` 항목과 정확히 일치시켜라(배열 요소로 삽입, 쉼표 유지).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test test/capabilities/weeklyCandles.test.mjs`
Expected: PASS — 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/capabilities/definitions.mjs src/capabilities/kiwoom.mjs src/capabilities/ls.mjs src/capabilities/db.mjs src/capabilities/kis.mjs test/capabilities/weeklyCandles.test.mjs
git commit -m "feat: declare domestic weekly candle capability for all brokers"
```

---

### Task 3: 통합 코어 `getDomesticStockCandles` + 파사드 위임 (일/월/분)

**Files:**
- Modify: `src/services/MarketDataService.mjs`
- Test: `test/services/MarketDataService.test.mjs`

**Interfaces:**
- Consumes: `classifyCandleInterval` (Task 1); 기존 `requestDailyCandles`, `requestMonthlyCandles`, `requestMinuteCandles`, `normalizeDomesticStockDailyCandles`, `normalizeDomesticStockMonthlyCandles`, `normalizeDomesticStockMinuteCandles`, `failureResponse`, `BrokerError` (모두 파일 내 기존 정의).
- Produces: `MarketDataService.getDomesticStockCandles(broker, symbol, { interval, ...options })`. `getDomesticStockDailyCandles`/`getDomesticStockMonthlyCandles`는 코어에 위임하는 파사드가 됨(반환값 불변).

- [ ] **Step 1: Write the failing test**

Add to `test/services/MarketDataService.test.mjs` (파일 상단 import 구역은 그대로; 아래 테스트를 추가):

```javascript
test("getDomesticStockCandles routes daily interval like the daily facade", async () => {
  const core = new MarketDataService({ ls: new FakeClient("ls") });
  const facade = new MarketDataService({ ls: new FakeClient("ls") });

  const viaCore = await core.getDomesticStockCandles("ls", "005930", { interval: "1d", count: 3, endDate: "2026-05-31" });
  const viaFacade = await facade.getDomesticStockDailyCandles("ls", "005930", { count: 3, endDate: "2026-05-31" });

  assert.equal(viaCore.ok, true);
  assert.equal(viaCore.capability, "marketData.domesticStock.dailyCandles");
  assert.equal(viaCore.data.interval, "1d");
  assert.deepEqual(viaCore.data, viaFacade.data);
});

test("getDomesticStockCandles rejects unsupported intervals with a structured error", async () => {
  const service = new MarketDataService({ ls: new FakeClient("ls") });

  const result = await service.getDomesticStockCandles("ls", "005930", { interval: "1y" });

  assert.equal(result.ok, false);
  assert.equal(result.error.code, "unsupported");
  assert.match(result.error.message, /1y/);
});
```

> `result.error.code === "unsupported"`는 `BrokerError.unsupported(...)`가 설정하는 코드다. 실제 필드명이 다르면(`error.code` 대신 다른 속성) `BrokerError` 정의(`src/core/`)를 확인해 어서션을 맞춰라 — 기존 실패 응답 테스트가 있으면 그 패턴을 그대로 따르라.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/services/MarketDataService.test.mjs`
Expected: FAIL — `service.getDomesticStockCandles is not a function`.

- [ ] **Step 3: Write minimal implementation**

In `src/services/MarketDataService.mjs`, add the import at the top (after the existing imports on lines 1-2):

```javascript
import { classifyCandleInterval } from "./candleSupport.mjs";
```

Add a route table just below the capability-id constants (after line 7):

```javascript
const PERIOD_CANDLE_ROUTES = {
  "1d": {
    capabilityId: DAILY_CANDLES_CAPABILITY_ID,
    request: requestDailyCandles,
    normalize: normalizeDomesticStockDailyCandles,
  },
  "1mo": {
    capabilityId: MONTHLY_CANDLES_CAPABILITY_ID,
    request: requestMonthlyCandles,
    normalize: normalizeDomesticStockMonthlyCandles,
  },
};
```

Add the unified core method inside the `MarketDataService` class (place it directly above `requestMarketData`):

```javascript
  async getDomesticStockCandles(broker, symbol, options = {}) {
    const classification = classifyCandleInterval(options.interval);

    if (classification.kind === "minute") {
      return this.requestMarketData({
        broker,
        symbol,
        options: { ...options, intervalMinutes: options.intervalMinutes ?? classification.minutes },
        capabilityId: MINUTE_CANDLES_CAPABILITY_ID,
        request: requestMinuteCandles,
        normalize: normalizeDomesticStockMinuteCandles,
      });
    }

    const route = PERIOD_CANDLE_ROUTES[classification.interval];
    if (classification.kind !== "period" || !route) {
      return failureResponse({
        broker: String(broker ?? "").trim().toLowerCase(),
        symbol: String(symbol ?? "").trim(),
        source: null,
        capabilityId: null,
        error: BrokerError.unsupported(
          `Unsupported domestic stock candle interval: ${options.interval}`,
          { broker, details: { interval: options.interval ?? null } },
        ),
      });
    }

    return this.requestMarketData({
      broker,
      symbol,
      options: { ...options, interval: classification.interval },
      capabilityId: route.capabilityId,
      request: route.request,
      normalize: route.normalize,
    });
  }
```

Replace the bodies of the daily and monthly facade methods (lines 25-45) so they delegate to the core (do NOT touch `getDomesticStockMinuteCandles`):

```javascript
  async getDomesticStockDailyCandles(broker, symbol, options = {}) {
    return this.getDomesticStockCandles(broker, symbol, { ...options, interval: "1d" });
  }

  async getDomesticStockMonthlyCandles(broker, symbol, options = {}) {
    return this.getDomesticStockCandles(broker, symbol, { ...options, interval: "1mo" });
  }
```

> `PERIOD_CANDLE_ROUTES`는 함수 선언(`requestDailyCandles` 등)을 참조한다. 그 함수들은 `function` 선언(호이스팅됨)이므로 모듈 최상단 상수에서 참조해도 안전하다. 확인만 하고 그대로 두라.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test test/services/MarketDataService.test.mjs`
Expected: PASS — 신규 2개 테스트 + 기존 daily/monthly/minute 테스트 전부 통과(파사드 위임이 동작 불변임을 증명).

- [ ] **Step 5: Commit**

```bash
git add src/services/MarketDataService.mjs test/services/MarketDataService.test.mjs
git commit -m "feat: add unified domestic candle core and delegate day/month facades"
```

---

### Task 4: 주봉 서비스 경로 (request + normalize + 파사드 + 코어 라우트)

**Files:**
- Modify: `src/services/MarketDataService.mjs`
- Test: `test/services/MarketDataService.test.mjs`

**Interfaces:**
- Consumes: `weeklyPeriodCode` (Task 1); 기존 `normalizeKiwoomCandles`, `normalizeLsCandles`, `normalizeDbCandles`, `normalizeKisCandles`, `requestDailyCandles`, `normalizeDate`, `normalizeOptionalDate`.
- Produces: `MarketDataService.getDomesticStockWeeklyCandles(broker, symbol, options)`; `getDomesticStockCandles(...,{interval:"1w"})` 동작; `normalizeDomesticStockWeeklyCandles` export.

- [ ] **Step 1: Write the failing test**

Add to `test/services/MarketDataService.test.mjs`:

```javascript
test("gets and normalizes LS domestic stock weekly candles", async () => {
  const client = new FakeClient("ls");
  const service = new MarketDataService({ ls: client });

  const result = await service.getDomesticStockWeeklyCandles("ls", "005930", { count: 3, endDate: "2026-05-31" });

  assert.equal(result.ok, true);
  assert.deepEqual(client.calls[0], {
    id: "t8410",
    params: {
      t8410InBlock: {
        shcode: "005930",
        gubun: "3",
        qrycnt: 3,
        sdate: "",
        edate: "20260531",
        cts_date: "",
        comp_yn: "N",
        sujung: "Y",
      },
    },
    options: {},
  });
  assert.equal(result.capability, "marketData.domesticStock.weeklyCandles");
  assert.equal(result.data.interval, "1w");
  assert.equal(result.data.source.capabilityId, "marketData.domesticStock.weeklyCandles");
});

test("requests Kiwoom weekly candles via ka10082", async () => {
  const client = new FakeClient("kiwoom");
  const service = new MarketDataService({ kiwoom: client });

  const result = await service.getDomesticStockCandles("kiwoom", "005930", { interval: "1w", endDate: "2026-05-31" });

  assert.equal(result.ok, true);
  assert.equal(client.calls[0].id, "ka10082");
  assert.deepEqual(client.calls[0].params, {
    stk_cd: "005930",
    base_dt: "20260531",
    upd_stkpc_tp: "1",
  });
  assert.equal(result.data.interval, "1w");
});

test("requests DB weekly candles via CHARTWEEK with period div code", async () => {
  const client = new FakeClient("db");
  const service = new MarketDataService({ db: client });

  const result = await service.getDomesticStockWeeklyCandles("db", "005930", { startDate: "2026-01-01", endDate: "2026-05-31" });

  assert.equal(result.ok, true);
  assert.equal(client.calls[0].id, "CHARTWEEK");
  assert.deepEqual(client.calls[0].params, {
    In: {
      InputOrgAdjPrc: "1",
      InputCondMrktDivCode: "J",
      InputIscd1: "005930",
      InputDate1: "20260101",
      InputDate2: "20260531",
      InputPeriodDivCode: "W",
    },
  });
  assert.equal(result.data.interval, "1w");
});

test("requests KIS weekly candles with FID_PERIOD_DIV_CODE W", async () => {
  const client = new FakeClient("kis");
  const service = new MarketDataService({ kis: client });

  const result = await service.getDomesticStockWeeklyCandles("kis", "005930", { startDate: "2026-01-01", endDate: "2026-05-31" });

  assert.equal(result.ok, true);
  assert.equal(client.calls[0].params.FID_PERIOD_DIV_CODE, "W");
  assert.equal(result.data.interval, "1w");
});
```

> DB/KIS FakeClient mock 응답: `FakeClient.request`가 `fakePayload(id)`를 반환하므로, `CHARTWEEK`와 KIS 주봉 경로가 정규화 시 빈 배열이라도 `ok:true`가 나오도록, `fakePayload`에 `CHARTWEEK`/KIS 케이스가 없으면 최소한 빈 객체를 반환하는지 확인하라. 위 어서션은 요청 파라미터와 `interval`만 검증하므로 candle 내용은 비어도 무방하다. 필요 시 기존 daily DB/KIS 테스트가 쓰는 `fakePayload` 케이스를 참고해 주봉 payload 케이스를 추가하되, 요청 파라미터 검증만으로 충분하면 payload 추가는 생략한다.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test test/services/MarketDataService.test.mjs`
Expected: FAIL — `service.getDomesticStockWeeklyCandles is not a function`.

- [ ] **Step 3: Write minimal implementation**

In `src/services/MarketDataService.mjs`:

(a) Extend the import from `./candleSupport.mjs`:

```javascript
import { classifyCandleInterval, weeklyPeriodCode } from "./candleSupport.mjs";
```

(b) Add the capability-id constant next to the others (after line 6, `MONTHLY_CANDLES_CAPABILITY_ID`):

```javascript
const WEEKLY_CANDLES_CAPABILITY_ID = "marketData.domesticStock.weeklyCandles";
```

(c) Add the weekly facade method in the class (directly after `getDomesticStockMonthlyCandles`):

```javascript
  async getDomesticStockWeeklyCandles(broker, symbol, options = {}) {
    return this.getDomesticStockCandles(broker, symbol, { ...options, interval: "1w" });
  }
```

(d) Add the `"1w"` entry to `PERIOD_CANDLE_ROUTES`:

```javascript
  "1w": {
    capabilityId: WEEKLY_CANDLES_CAPABILITY_ID,
    request: requestWeeklyCandles,
    normalize: normalizeDomesticStockWeeklyCandles,
  },
```

(e) Add the weekly request builder next to `requestMonthlyCandles` (module-level function):

```javascript
async function requestWeeklyCandles(client, broker, sourceId, symbol, options) {
  const requestOptions = options.requestOptions ?? {};

  if (broker === "kiwoom") {
    return client.request(sourceId, {
      stk_cd: symbol,
      base_dt: normalizeDate(options.baseDate ?? options.endDate),
      upd_stkpc_tp: options.adjusted === false ? "0" : "1",
    }, requestOptions);
  }

  if (broker === "ls" || broker === "kis") {
    return requestDailyCandles(client, broker, sourceId, symbol, {
      ...options,
      periodCode: options.periodCode ?? weeklyPeriodCode(broker),
    });
  }

  if (broker === "db") {
    return client.request(sourceId, {
      In: {
        InputOrgAdjPrc: options.adjusted === false ? "0" : "1",
        InputCondMrktDivCode: options.marketDivision ?? options.market ?? "J",
        InputIscd1: symbol,
        InputDate1: normalizeOptionalDate(options.startDate),
        InputDate2: normalizeOptionalDate(options.endDate ?? options.baseDate),
        InputPeriodDivCode: "W",
      },
    }, requestOptions);
  }

  throw BrokerError.unsupported(`Unsupported weekly candle request broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}
```

(f) Add the weekly normalize dispatch next to `normalizeDomesticStockMonthlyCandles` (exported):

```javascript
export function normalizeDomesticStockWeeklyCandles(broker, symbol, sourceId, payload) {
  if (broker === "kiwoom") {
    return normalizeKiwoomCandles(symbol, sourceId, "1w", payload?.stk_stk_pole_chart_qry, WEEKLY_CANDLES_CAPABILITY_ID);
  }

  if (broker === "ls") {
    return normalizeLsCandles(symbol, sourceId, "1w", payload?.t8410OutBlock1, payload?.t8410OutBlock, WEEKLY_CANDLES_CAPABILITY_ID);
  }

  if (broker === "db") {
    return normalizeDbCandles(symbol, sourceId, "1w", payload?.Out ?? payload?.output, WEEKLY_CANDLES_CAPABILITY_ID);
  }

  if (broker === "kis") {
    return normalizeKisCandles(symbol, sourceId, "1w", payload?.output2, payload?.output1, WEEKLY_CANDLES_CAPABILITY_ID);
  }

  throw BrokerError.unsupported(`Unsupported weekly candle normalization broker: ${broker}`, {
    broker,
    details: { sourceId },
  });
}
```

(g) Fix `candleCapabilityId` (line ~694) so `"1w"` resolves correctly instead of falling through to minute:

```javascript
function candleCapabilityId(interval) {
  if (interval === "1d") {
    return DAILY_CANDLES_CAPABILITY_ID;
  }

  if (interval === "1w") {
    return WEEKLY_CANDLES_CAPABILITY_ID;
  }

  if (interval === "1mo") {
    return MONTHLY_CANDLES_CAPABILITY_ID;
  }

  return MINUTE_CANDLES_CAPABILITY_ID;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test test/services/MarketDataService.test.mjs`
Expected: PASS — 신규 주봉 4개 테스트 + Task 3 테스트 + 기존 테스트 전부 통과.

- [ ] **Step 5: Commit**

```bash
git add src/services/MarketDataService.mjs test/services/MarketDataService.test.mjs
git commit -m "feat: add domestic weekly candle service across brokers"
```

---

### Task 5: 전체 게이트 검증 + 문서 마감

**Files:**
- Modify: `docs/superpowers/specs/2026-07-06-domestic-candles-unification-design.md` (상태 갱신)

- [ ] **Step 1: Run the full verification gates**

```bash
npm test
npm run validate:manifest
npm run validate:docs
```

Expected: 세 명령 모두 성공(exit 0). `npm test`는 candleSupport/weeklyCandles/MarketDataService 신규 테스트를 포함해 전부 green. `validate:manifest`/`validate:docs`는 주봉과 무관하게 green 유지(회귀 없음 확인).

- [ ] **Step 2: Sanity-check the unified surface manually**

Run:

```bash
node --input-type=module -e "
import { MarketDataService } from './src/services/MarketDataService.mjs';
const svc = new MarketDataService({ ls: { async request(id, params){ return { ok:true, broker:'ls', id, data:{}, raw:{}, headers:{}, status:200 }; } } });
const bad = await svc.getDomesticStockCandles('ls', '005930', { interval: '1y' });
console.log('unsupported ok=', bad.ok, 'code=', bad.error?.code);
const good = await svc.getDomesticStockCandles('ls', '005930', { interval: '1w', endDate: '2026-05-31' });
console.log('weekly ok=', good.ok, 'interval=', good.data.interval, 'cap=', good.capability);
"
```

Expected: `unsupported ok= false code= unsupported` 및 `weekly ok= true interval= 1w cap= marketData.domesticStock.weeklyCandles`.

- [ ] **Step 3: Update the spec status and commit**

In `docs/superpowers/specs/2026-07-06-domestic-candles-unification-design.md`, change the status line near the top from `승인 대기 (스펙 리뷰 전)` to `구현 완료`.

```bash
git add docs/superpowers/specs/2026-07-06-domestic-candles-unification-design.md
git commit -m "docs: mark domestic weekly candle spec as implemented"
```

## Self-Review

**Spec coverage:**
- 주봉 신규 지원(4 브로커) → Task 2 (capability) + Task 4 (service). ✅
- interval 통합 코어 `getDomesticStockCandles` → Task 3. ✅
- 유형별 파사드 하위호환(월봉 불변) → Task 3 (daily/monthly 위임, 기존 테스트 회귀 게이트) + Task 4 (weekly 파사드). ✅
- 지원 매트릭스 단일 진실원천 → Task 1 (`candleSupport.mjs`). ✅
- 미지원 interval 구조화 차단 → Task 3 (unsupported 테스트) + Task 5 Step 2. ✅
- 매트릭스↔capability 일관성 강제(npm test) → Task 2 (일관성 테스트). ✅
- 게이트(test/validate:manifest/validate:docs) → Task 5. ✅
- 비목표(연봉·틱·해외 변경 없음) → classifyCandleInterval이 `1y`/`tick`을 unsupported로 처리, 해외 파일 미변경. ✅

**Placeholder scan:** 코드 스텝은 모두 실제 코드 포함. 검증 필요 지점(getCapabilities 시그니처, BrokerError.code 필드명, DB/KIS fakePayload)은 "기존 패턴을 확인하라"는 구체 지시로 표기했고 어서션은 구체값이다.

**Type consistency:** `getDomesticStockCandles`/`classifyCandleInterval`/`weeklyPeriodCode`/`CANDLE_CAPABILITY_IDS`/`WEEKLY_CANDLES_CAPABILITY_ID`/`requestWeeklyCandles`/`normalizeDomesticStockWeeklyCandles` 명칭이 Task 전반에서 일관. `PERIOD_CANDLE_ROUTES` 키(`"1d"`,`"1w"`,`"1mo"`)와 `classifyCandleInterval` 반환 interval 값 일치.
