# Order Guard Verification Plan

이 문서는 SecurityAPI 주문 서비스의 안전장치를 검증하기 위한 설계다. 이 단계는 주문 request builder와 guard 동작을 확인하지만 실제 broker 서버로 주문을 전송하지 않는다.

## Scope

포함:

- 국내주식/해외주식 주문 dry-run 검증
- live 주문 차단 guard 검증
- `expectedRequest` 비교 검증
- 금액, 종목, 시장가, 거래시장, 통화, 거래시간 입력 guard 검증
- 주문 후보 승인 전 확인표 설계

제외:

- 실제 주문 제출
- 주문 체결 확인
- 계좌 주문 가능 수량 실측
- 자동매매 전략 판단

## Verification Levels

| Level | Name | Network Call | Purpose |
| --- | --- | --- | --- |
| L0 | dry-run only | No | 주문 request와 normalized order를 생성하고 검토한다. |
| L1 | blocked live | No | `dryRun: false` 입력이 guard에 의해 차단되는지 확인한다. |
| L2 | approved live candidate | No | live 전송 직전 후보 request가 승인 조건을 만족하는지만 확인한다. |
| L3 | live send | Yes | 이 문서 범위 밖이다. 별도 승인된 goal에서만 수행한다. |

## Services Under Verification

| Service | Methods | Broker Scope |
| --- | --- | --- |
| `OrderService` | `buyDomesticStock`, `sellDomesticStock`, `modifyDomesticStock`, `cancelDomesticStock` | Kiwoom, LS |
| `OverseasStockOrderService` | `buyOverseasStock`, `sellOverseasStock`, `modifyOverseasStockOrder`, `cancelOverseasStockOrder`, `submitOverseasStockReservedOrder` | LS |

## Guard Matrix

| Guard | Domestic | Overseas | Expected Result |
| --- | --- | --- | --- |
| `dryRun` default | Required | Required | No network call, request preview returned |
| `confirm: true` for live | Required | Required | Missing confirm blocks live |
| `confirmMarketOrder: true` | Required for market-like orders | Required for market-like orders | Missing confirmation blocks market-like live |
| `expectedRequest` | Required for approved live candidate | Required for approved live candidate | Mismatch blocks live |
| `maxOrderAmount` | Supported | Supported | Exceeding amount blocks order |
| `allowedSymbols` | Supported | Supported | Non-allowed symbol blocks order |
| `blockedSymbols` | Supported | Supported | Blocked symbol blocks order |
| `currencyCode` | Not applicable | Required for overseas live | Missing currency blocks live |
| `marketCode` | Exchange/order market optional by broker | Required for overseas live | Missing market blocks overseas live |
| `exchangeCode` | Domestic exchange field by broker | Required for overseas live | Missing exchange blocks overseas live |
| `tradingSession` | Optional by current domestic service | Required for overseas live | Missing session blocks overseas live |
| `retryable: false` | Required for live order request | Required for live order request | Order requests are not auto-retried |

## Dry-run Scenarios

### Domestic Buy/Sell

Purpose:

- Verify request shape for Kiwoom and LS domestic order.
- Verify order value calculation.
- Verify symbol and amount guard metadata.

Inputs:

```js
await order.buyDomesticStock("kiwoom", {
  symbol: "005930",
  quantity: 1,
  estimatedPrice: 70000
});

await order.sellDomesticStock("ls", {
  symbol: "005930",
  quantity: 1,
  price: 70000,
  orderType: "limit"
});
```

Expected:

- `ok: true`
- `dryRun: true`
- `data.request` exists
- no broker client request is called
- `data.safety.allowed === true`

### Domestic Modify/Cancel

Purpose:

- Verify original order number is required.
- Verify request fields differ by broker.

Expected:

- missing original order number returns `VALIDATION_ERROR`
- valid dry-run returns request preview only

### Overseas Buy/Sell

Purpose:

- Verify LS `COSAT00301` request builder.
- Verify market/currency/session inputs are preserved.

Inputs:

```js
await overseasOrder.buyOverseasStock("ls", {
  symbol: "TSLA",
  marketCode: "82",
  exchangeCode: "82",
  currencyCode: "USD",
  tradingSession: "regular",
  quantity: 1,
  price: 100
});
```

Expected:

- request uses `COSAT00301InBlock1`
- `OrdPtnCode` identifies buy/sell/cancel according to method
- account secrets are not required for standard dry-run preview

### Overseas Modify/Cancel/Reserve

Purpose:

- Verify `COSAT00311`, cancel via `COSAT00301` with cancel order code, and `COSAT00400` reserved order payload.
- Verify account/password masking for reserved order audit.

Expected:

- reserved order preview masks `AcntNo` and `Pwd` in audit-friendly output
- cancel request is not confused with reserved-order TR

## Blocked Live Scenarios

Each scenario uses `dryRun: false` but must fail before network.

| Scenario | Missing/Bad Input | Expected Code |
| --- | --- | --- |
| Missing confirm | `confirm` omitted | `VALIDATION_ERROR` |
| Market order without confirmation | `orderType: "market"`, no `confirmMarketOrder` | `VALIDATION_ERROR` |
| Expected request mismatch | `expectedRequest` differs from built request | `VALIDATION_ERROR` |
| Amount limit exceeded | `maxOrderAmount` lower than order value | `VALIDATION_ERROR` |
| Symbol not allowed | `allowedSymbols` excludes symbol | `VALIDATION_ERROR` |
| Symbol blocked | `blockedSymbols` includes symbol | `VALIDATION_ERROR` |
| Overseas missing currency | no `currencyCode` | `VALIDATION_ERROR` |
| Overseas missing trading session | no `tradingSession` | `VALIDATION_ERROR` |

## Approved Live Candidate Checklist

This checklist only approves a candidate request for a later live integration goal. It does not submit.

- [ ] `dryRun: false` is intentionally set in a local blocked-live test.
- [ ] `confirm: true` is present.
- [ ] `confirmMarketOrder: true` is present for market-like order.
- [ ] `expectedRequest` exactly matches generated request.
- [ ] `retryable: false` is confirmed.
- [ ] `maxOrderAmount` is set.
- [ ] `allowedSymbols` or `blockedSymbols` is set.
- [ ] Overseas orders include `currencyCode`, `marketCode`, `exchangeCode`, `tradingSession`.
- [ ] Request diff has been reviewed by a human.
- [ ] Account identifiers and passwords are masked in logs.
- [ ] A separate live-order goal has been explicitly approved.

## Review Record Template

```md
## Order Guard Review

- Date:
- SDK commit:
- Broker:
- Service method:
- Level: L0 | L1 | L2
- Symbol:
- Side:
- Quantity:
- Order type:
- Estimated/order price:
- Guard result:
- Expected request matched: yes | no | n/a
- Network call attempted: no
- Sensitive data masked: yes | no
- Reviewer:
- Notes:
```

## Completion Criteria

This phase is complete when:

- Dry-run scenarios cover domestic and overseas order methods.
- Blocked-live scenarios prove guard failure before network calls.
- Approved live candidate criteria are separate from live send.
- No scenario in this document submits a real order.
