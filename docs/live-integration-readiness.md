# Live Integration Readiness

이 문서는 SecurityAPI를 실제 Kiwoom/LS API에 연결하기 전에 준비해야 할 조건을 정리한다. 이 단계는 실제 서버 호출이나 실제 주문 전송을 수행하지 않는다. 목적은 live 검증을 시작하기 전에 환경, 권한, 계좌, 로그 기준이 충분히 명확한지 확인하는 것이다.

## Scope

포함:

- Kiwoom/LS API 키와 환경 변수 준비 기준
- 모의/운영 서버 구분
- REST/WebSocket 연결 준비 조건
- 조회, 계좌, 주문, 실시간 기능별 권한 구분
- read-only 검증과 order 검증의 경계
- 안전한 실행 순서

제외:

- 실제 API 호출 실행
- 실제 계좌 잔고 또는 주문 가능 금액 확인
- live 주문 전송
- 자동매매 전략 또는 앱 UI 설계

## Required Environment Variables

`.env.example`은 실제 값을 넣는 파일이 아니라 필요한 키 이름을 공유하는 템플릿이다. 실제 값은 배포 환경의 secret store 또는 로컬 `.env`에만 둔다.

| Variable | Required For | Description |
| --- | --- | --- |
| `KIWOOM_APP_KEY` | Kiwoom REST auth | Kiwoom 앱키 |
| `KIWOOM_SECRET_KEY` | Kiwoom REST auth | Kiwoom secret key |
| `KIWOOM_ENV` | Kiwoom endpoint selection | `mock`, `dev`, `prod` 중 하나 |
| `LS_APP_KEY` | LS REST/WebSocket auth | LS 앱키 |
| `LS_APP_SECRET_KEY` | LS REST/WebSocket auth | LS secret key |
| `LS_MAC_ADDRESS` | LS REST request header | LS API가 요구하는 MAC address. 운영 환경에서 요구될 수 있다. |
| `LS_ENV` | LS endpoint selection | 현재 manifest 기준 일부 LS mock endpoint는 없을 수 있으므로 `prod` 사용 여부를 명시해야 한다. |
| `SECURITY_API_LIVE_READONLY` | live read-only examples | 실제 read-only 호출 허용 플래그. 설계상 기본값은 disabled. |
| `SECURITY_API_ALLOW_LIVE_ORDER` | live order examples | 실제 주문 전송 허용 플래그. 이 문서 범위에서는 사용하지 않는다. |

## Broker Environment Matrix

| Broker | REST Prod | REST Mock/Dev | WebSocket Prod | Notes |
| --- | --- | --- | --- | --- |
| Kiwoom | `https://api.kiwoom.com` | manifest의 mock/dev domain | `wss://api.kiwoom.com:10000` | API ID 기반. WebSocket은 실시간 문서의 domain을 따른다. |
| LS | `https://openapi.ls-sec.co.kr:8080` | manifest에 없는 TR은 mock 사용 불가 | `wss://openapi.ls-sec.co.kr:9443` | TR 코드 기반. `mac_address` 헤더 요구 여부를 환경별로 확인한다. |

## Capability Permission Checklist

| Area | Needs Account Permission | Needs Order Permission | Can Be Read-only First | Notes |
| --- | --- | --- | --- | --- |
| OAuth token | No | No | Yes | 키/secret만 필요하다. |
| Domestic quote/market data | No | No | Yes | 가장 먼저 검증한다. |
| Overseas quote/market data | No | No | Yes | LS 해외주식은 거래소 코드와 key symbol 규칙을 확인한다. |
| Realtime quote/order book | Usually no | No | Yes | WebSocket token과 구독 envelope를 확인한다. |
| Account cash/balance/history | Yes | No | Yes | read-only지만 계좌 권한과 계좌별 약관이 필요할 수 있다. |
| Domestic/overseas order dry-run | No live permission required | No live send | Yes, local only | SDK request builder/guard만 확인한다. |
| Live order send | Yes | Yes | No | 별도 승인된 order integration 단계에서만 다룬다. |

## Safe Execution Order

1. Validate local repository with `npm run validate:all`.
2. Prepare `.env` from `.env.example` without committing it.
3. Verify OAuth token issue/revoke on the selected broker environment.
4. Run domestic quote read-only checks.
5. Run LS overseas quote/market-data read-only checks.
6. Run WebSocket quote subscriptions with a low-risk symbol.
7. Run account read-only checks only after account permission is confirmed.
8. Run order dry-run and guard checks without a broker client capable of live submission.
9. Review order guard audit output.
10. Do not proceed to live order send without a separate approved goal.

## Read-only Boundary

Read-only live verification may call:

- current price
- order book
- candles/time series
- stock master/basic info
- account cash/balance/order history
- realtime quote/order book/order event subscription

Read-only live verification must not call:

- domestic live buy/sell/modify/cancel
- overseas live buy/sell/modify/cancel/reserve
- any method with `dryRun: false`
- any script that sets `SECURITY_API_ALLOW_LIVE_ORDER=true`

## Order Boundary

Order guard verification may create:

- dry-run request payloads
- blocked live-order attempts that fail before network calls
- `expectedRequest` comparison artifacts
- masked audit records

Order guard verification must not:

- submit orders to Kiwoom or LS
- use real account passwords in fixtures
- run retry on order requests
- log full account numbers, passwords, app secrets, or access tokens

## Readiness Checklist

- [ ] `.env` exists locally and is ignored by git.
- [ ] API keys are stored outside the repository.
- [ ] Broker environment is explicitly selected.
- [ ] Read-only and order verification are run as separate steps.
- [ ] Account read-only permission is confirmed before account calls.
- [ ] WebSocket client can be configured for the runtime environment.
- [ ] Logging masks authorization, app secret, token, account number, and password.
- [ ] Live order send is disabled by default.

## Completion Criteria

This readiness phase is complete when:

- A developer can prepare environment variables from this document.
- The safe execution order is clear.
- Read-only and order verification boundaries are explicit.
- No step in this document performs a real broker call by itself.
