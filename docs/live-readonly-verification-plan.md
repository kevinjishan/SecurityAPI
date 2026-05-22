# Live Read-only Verification Plan

이 문서는 실제 broker 서버에서 주문 없이 먼저 검증할 read-only 기능과 실행 순서를 설계한다. 이 문서는 예제와 절차의 기준이며, 문서 작성 단계에서는 실제 API를 호출하지 않는다.

## Scope

포함:

- OAuth 연결 검증 순서
- 4개 증권사 국내주식 read-only REST 검증
- LS 해외주식 read-only REST 검증
- 계좌 read-only 검증
- WebSocket 실시간 구독 검증
- 성공/실패 기록 양식

제외:

- live 주문 전송
- 주문 dry-run 검증
- 자동매매 판단
- broker rate limit 실측 자동화

## Preflight

실제 read-only 검증을 실행하기 전 다음을 만족해야 한다.

- [ ] [Live Integration Readiness](live-integration-readiness.md)를 검토했다.
- [ ] `.env`가 준비되어 있고 git에 포함되지 않는다.
- [ ] `SECURITY_API_LIVE_READONLY=true`를 명시적으로 설정했다.
- [ ] `SECURITY_API_ALLOW_LIVE_ORDER=false` 상태를 확인했다.
- [ ] `npm run validate:all`이 local mock 기준으로 통과한다.
- [ ] 계좌 read-only 검증을 하려면 계좌 조회 권한이 준비되어 있다.

## Verification Order

### Phase 1. OAuth Only

목표:

- app key/secret이 올바른지 확인한다.
- token issue/revoke가 broker별 expected response wrapper로 돌아오는지 확인한다.

대상:

- Kiwoom `au10001`
- LS `token`
- DB `token`
- KIS `/oauth2/tokenP`
- KIS `/oauth2/Approval` for WebSocket approval key

성공 기준:

- access token이 발급된다.
- KIS approval key가 REST access token과 별도 흐름으로 발급된다.
- token이 로그에 원문으로 남지 않는다.
- revoke를 실행하는 경우 성공 또는 broker-defined no-op으로 기록된다.

### Phase 2. Domestic Read-only REST

목표:

- 국내주식 조회성 service가 실제 REST 서버와 연결 가능한지 확인한다.

최소 대상:

| Service | Broker | Method | Sample Input |
| --- | --- | --- | --- |
| `QuoteService` | Kiwoom | `getDomesticStockCurrentPrice` | `005930` |
| `QuoteService` | LS | `getDomesticStockCurrentPrice` | `005930` |
| `QuoteService` | DB | `getDomesticStockCurrentPrice` | `005930` |
| `QuoteService` | KIS | `getDomesticStockCurrentPrice` | `005930` |
| `MarketDataService` | Kiwoom | `getDomesticStockDailyCandles` | `005930` |
| `MarketDataService` | LS | `getDomesticStockMinuteCandles` | `005930` |
| `MarketDataService` | DB | `getDomesticStockDailyCandles` | `005930` |
| `MarketDataService` | KIS | `getDomesticStockDailyCandles` | `005930` |
| `MarketContextService` | Kiwoom/LS | `getDomesticIndexCurrent` | `kospi` |
| `MarketFlowService` | Kiwoom/LS | `getDomesticInvestorFlow` | `kospi` |

성공 기준:

- `ok: true`를 반환한다.
- `broker`, `id`, `data`, `raw`, `headers`, `status`가 보존된다.
- 데이터가 없을 수 있는 API는 broker의 no-data 응답을 실패와 구분한다.

### Phase 3. LS Overseas Read-only REST

목표:

- LS 해외주식 조회성 service가 실제 REST 서버와 연결 가능한지 확인한다.

최소 대상:

| Service | Method | Sample Input |
| --- | --- | --- |
| `OverseasStockQuoteService` | `getOverseasStockCurrentPrice` | `{ symbol: "TSLA", exchangeCode: "82" }` |
| `OverseasStockQuoteService` | `getOverseasStockOrderBook` | `{ symbol: "TSLA", exchangeCode: "82" }` |
| `OverseasStockMarketDataService` | `getOverseasStockBasicInfo` | `{ symbol: "TSLA", exchangeCode: "82" }` |
| `OverseasStockMarketDataService` | `getOverseasStockCandles` | `{ symbol: "TSLA", exchangeCode: "82" }` |
| `OverseasStockMarketDataService` | `getOverseasStockTimeSeries` | `{ symbol: "TSLA", exchangeCode: "82" }` |

성공 기준:

- LS `g3101`, `g3106`, `g3104`, `g3204` 또는 `g3103`, `g3102`가 service response로 정규화된다.
- `keySymbol`이 입력 또는 `exchangeCode + symbol`로 명확히 구성된다.
- `raw` block이 보존된다.

### Phase 4. Account Read-only REST

목표:

- 계좌 권한이 있는 환경에서 조회성 계좌 API만 검증한다.

최소 대상:

| Service | Broker | Method |
| --- | --- | --- |
| `AccountService` | Kiwoom | `getDomesticStockCash` |
| `AccountService` | Kiwoom | `getDomesticStockBalance` |
| `AccountService` | LS | `getDomesticStockCash` |
| `AccountService` | LS | `getDomesticStockBalance` |
| `AccountService` | DB | `getDomesticStockCash` |
| `AccountService` | DB | `getDomesticStockBalance` |
| `AccountService` | KIS | `getDomesticStockCash` |
| `AccountService` | KIS | `getDomesticStockBalance` |
| `OverseasStockAccountService` | LS | `getOverseasStockCash` |
| `OverseasStockAccountService` | LS | `getOverseasStockBalance` |

성공 기준:

- 계좌번호, 비밀번호, token이 로그에 남지 않는다.
- 금액/수량은 테스트 기록에서 필요 시 범주화하거나 마스킹한다.
- broker business error는 별도 기록한다.

### Phase 5. WebSocket Read-only

목표:

- WebSocket 연결, subscribe, message normalize, unsubscribe가 동작 가능한지 확인한다.

최소 대상:

| Service | Broker | Method | TR/API |
| --- | --- | --- | --- |
| `RealtimeService` | Kiwoom | `subscribeDomesticStockTrades` | `0B` |
| `RealtimeService` | LS | `subscribeDomesticStockTrades` | `S3_`/`K3_`/`US3` |
| `RealtimeService` | DB | `subscribeDomesticStockTrades` | `S00` |
| `RealtimeService` | KIS | `subscribeDomesticStockTrades` | `H0STCNT0` |
| `RealtimeService` | Kiwoom/LS | `subscribeMarketStatus` | `0s`/`JIF` |
| `RealtimeService` | DB/KIS | `subscribeDomesticStockOrderBook` | `S01`/`H0STASP0` |
| `OverseasStockRealtimeService` | LS | `subscribeOverseasStockTrades` | `GSC` |
| `OverseasStockRealtimeService` | LS | `subscribeOverseasStockOrderBook` | `GSH` |

성공 기준:

- connected/subscribed 상태를 확인한다.
- 최소 1개 message 또는 broker ack를 기록한다.
- unsubscribe가 실행된다.
- reconnect/resubscribe는 장시간 테스트 항목으로 별도 기록한다.

## Example Design

실제 예제 파일은 별도 구현 단계에서 다음 이름으로 추가한다.

```text
examples/live-readonly/auth-only.mjs
examples/live-readonly/kiwoom-domestic-quote.mjs
examples/live-readonly/ls-domestic-quote.mjs
examples/live-readonly/db-domestic-quote.mjs
examples/live-readonly/kis-domestic-quote.mjs
examples/live-readonly/ls-overseas-quote.mjs
examples/live-readonly/ls-overseas-realtime.mjs
examples/live-readonly/account-readonly.mjs
examples/live-readonly/preflight.mjs
examples/live-readonly/validate.mjs
```

예제 실행 규칙:

- `preflight.mjs`는 환경변수와 guard 상태만 점검하며 실제 API를 호출하지 않는다.
- `SECURITY_API_LIVE_READONLY=true`가 아니면 즉시 종료한다.
- `SECURITY_API_ALLOW_LIVE_ORDER=true`이면 read-only 예제는 실행을 거부한다.
- 응답 요약만 출력한다.
- token, account, password, authorization header는 출력하지 않는다.
- `--validate-only`는 실제 API를 호출하지 않고 guard, masking, 결과 기록 템플릿만 검증한다.

## Result Record Template

```md
## Live Read-only Result

- Date:
- Broker:
- Environment:
- SDK commit:
- Node version:
- Scenario:
- API/TR:
- Service method:
- Input summary:
- Result: pass | fail | skipped
- Status:
- Broker response code:
- SDK error code:
- Retry attempted: no
- Sensitive data masked: yes | no
- Notes:
```

## Failure Classification

| Failure Type | Meaning | Next Action |
| --- | --- | --- |
| `CONFIG_ERROR` | Missing key/env/mac address | Fix environment before retry |
| `AUTH_ERROR` | Token issue failed or invalid credential | Check broker app permission |
| `VALIDATION_ERROR` | SDK rejected input before network | Fix example input |
| `API_ERROR` | Broker business error | Record broker code/message |
| `HTTP_ERROR` | HTTP status failure | Check endpoint, broker status, permission |
| `NETWORK_ERROR` | DNS/TLS/socket failure | Check network/runtime |
| `TIMEOUT` | Request timed out | Retry only read-only scenario after delay |

## Completion Criteria

This phase is ready for implementation when:

- Read-only scenarios are listed and ordered.
- Account read-only checks are separated from public quote checks.
- WebSocket verification has subscribe and unsubscribe criteria.
- A failure record template exists.
- No order API is included.
