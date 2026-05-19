# SDK Stabilization Goal Plan

이 문서는 SecurityAPI core SDK가 “문서/manifest/mock 기준 기능 구현 완료” 상태에서 “다른 서버나 앱이 안정적으로 참조할 수 있는 SDK” 상태로 가기 위한 설계 작업 계획이다.

각 단계는 `/goal`로 바로 실행할 수 있도록 목표 문장, 작업 방법, 산출물, 완료 기준을 함께 둔다. 한 번에 전부 진행하지 않고, 앞 단계 산출물을 다음 단계의 기준으로 삼는다.

## 1. 현재 기준선

현재 기준선은 다음과 같다.

- 공식 문서 Markdown과 generated manifest가 있다.
- Kiwoom/LS 공통 client, auth, metadata, capability layer가 있다.
- 국내주식 core 서비스가 구현되어 있다.
- LS 해외주식 quote, market data, account, order, realtime 서비스가 구현되어 있다.
- 주문은 기본 dry-run이고 live 주문은 guard를 통과해야 한다.
- `npm run validate:all`이 문서/manifest/test/mock example을 검증한다.

아직 이 문서의 범위에서 다루어야 할 것은 다음이다.

- 실제 API 연결 전 준비 조건 명확화
- live read-only 검증 설계
- 주문 안전장치 검증 설계
- broker error/reject 처리 설계
- 외부 앱용 SDK contract 정리
- 운영 배포 전 보안/로그/모니터링 설계

완료된 단계별 설계 산출물:

- G1: [Live Integration Readiness](live-integration-readiness.md)
- G2: [Live Read-only Verification Plan](live-readonly-verification-plan.md)
- G3: [Order Guard Verification Plan](order-guard-verification-plan.md)
- G4: [Broker Error And Reject Policy](broker-error-reject-policy.md)
- G5: [Public SDK Contract](public-sdk-contract.md)
- G6: [Production Readiness Checklist](production-readiness-checklist.md)

## 2. 진행 원칙

- 문서 설계와 코드 변경을 같은 단계에 섞지 않는다. 설계 단계에서는 목표, 위험, 절차, 완료 기준을 먼저 고정한다.
- 실제 주문 전송은 별도 승인된 단계에서만 다룬다.
- read-only live 검증과 order 검증은 분리한다.
- 증권사별 차이는 숨기지 않고 service contract와 guide에 명시한다.
- 운영 환경에서 필요한 secret, account, order 관련 값은 예시에서도 실제처럼 보이는 값을 사용하지 않는다.
- 각 단계는 마지막에 `npm run validate:all` 또는 문서 검증 범위를 명시한다.

## 3. 단계별 Goal

### G1. Integration Readiness 설계

목표:

- 실제 LS/키움 API에 연결하기 전에 필요한 환경, 권한, 계정, 서버, WebSocket 조건을 명확히 한다.
- 개발자가 무엇을 준비해야 하는지 모호하지 않게 만든다.

Goal 명령:

```text
/goal SecurityAPI의 실제 API 연결 준비 조건이 명확하다고 판단될 때까지, LS/키움 환경변수, 앱키 권한, 모의/운영 서버, WebSocket 조건, 계좌/주문 권한, 안전한 실행 순서를 설계 문서로 정리하고 관련 README 링크를 보강해줘
```

방법:

- 현재 `KiwoomClient`, `LsClient`, `WebSocketBrokerClient`가 요구하는 config를 목록화한다.
- `.env.example`에 필요한 키가 충분히 드러나는지 확인한다.
- LS와 키움의 REST/WebSocket 도메인, mock/prod 구분, mac address 요구 여부를 정리한다.
- 조회, 계좌, 주문, 실시간을 각각 별도 준비 항목으로 나눈다.
- 실제 계좌 권한이 필요한 기능과 필요 없는 기능을 구분한다.

산출물:

- `docs/live-integration-readiness.md`
- 필요 시 `.env.example` 보강
- `README.md` 또는 `docs/README.md`의 live integration 안내 링크

완료 기준:

- 새 개발자가 문서만 보고 필요한 환경변수를 준비할 수 있다.
- read-only 검증과 order 검증의 경계가 명확하다.
- 실제 주문 전송이 포함되지 않는다는 점이 문서에 명확하다.

### G2. Live Read-only 검증 설계

목표:

- 실제 서버에서 먼저 검증할 read-only 기능과 순서를 정한다.
- 주문 없이도 quote, market data, account, realtime 연결 품질을 확인할 수 있게 한다.

Goal 명령:

```text
/goal SecurityAPI의 read-only live 검증 절차가 실행 가능하다고 판단될 때까지, 국내주식/LS 해외주식 현재가, 호가, 차트, 계좌 조회, 실시간 구독의 검증 순서와 성공/실패 기록 방식을 문서화하고 read-only 예제 설계를 작성해줘
```

방법:

- 검증 대상을 주문 없는 기능으로 제한한다.
- 국내주식과 해외주식을 분리해 최소 검증 시나리오를 정한다.
- REST 검증과 WebSocket 검증을 분리한다.
- 응답 성공 기준, broker business error 기준, timeout/network error 기준을 정한다.
- 민감한 계좌 정보와 토큰이 로그에 남지 않는 기록 양식을 정한다.

산출물:

- `docs/live-readonly-verification-plan.md`
- read-only example 파일 목록 설계
- 실패 로그 템플릿

완료 기준:

- 실제 API 키가 있을 때 어떤 순서로 read-only 검증을 돌릴지 명확하다.
- 주문 API 호출이 절대 포함되지 않는다.
- 성공/실패 결과를 나중에 audit 문서로 옮길 수 있다.

### G3. Order Guard 검증 설계

목표:

- 실주문 전 dry-run과 guard가 의도대로 주문을 막거나 허용하는지 검증하는 절차를 만든다.
- 주문 전송 자체가 아니라 주문 안전장치의 동작 검증에 집중한다.

Goal 명령:

```text
/goal SecurityAPI의 주문 안전장치 검증 절차가 충분하다고 판단될 때까지, 국내주식/해외주식 dry-run, expectedRequest, 금액/종목/통화/시장/시장가/거래시간 guard 검증 시나리오와 문서화 방식을 설계해줘
```

방법:

- 주문 검증을 `dry-run only`, `blocked live`, `approved live candidate` 세 단계로 나눈다.
- `dryRun: false`가 들어가도 `confirm`, `confirmMarketOrder`, `expectedRequest`가 없으면 차단되는지 확인하는 시나리오를 정한다.
- 국내주식과 해외주식의 필수 입력 차이를 표로 정리한다.
- live 전송은 이 단계의 범위 밖으로 둔다.
- 실제 계좌번호, 비밀번호, 주문 가능 금액은 예시에 넣지 않는다.

산출물:

- `docs/order-guard-verification-plan.md`
- 주문 dry-run 결과 검토 체크리스트
- live 주문 후보 승인 전 확인표

완료 기준:

- 주문 안전장치를 어떤 입력으로 검증할지 명확하다.
- 실주문으로 이어지는 단계가 문서상 분리되어 있다.
- 운영자가 request diff를 보고 승인 여부를 판단할 수 있다.

### G4. Broker Error/Reject 설계

목표:

- 증권사 업무 오류, 주문 reject, 네트워크 오류, 인증 오류를 앱에서 일관되게 처리할 수 있는 기준을 만든다.

Goal 명령:

```text
/goal SecurityAPI의 broker error/reject 처리 기준이 앱에서 사용할 만큼 명확하다고 판단될 때까지, Kiwoom/LS 오류 분류, 주문 reject 분류, retry 가능 여부, 사용자 표시 메시지와 내부 로그 메시지 기준을 설계 문서로 정리해줘
```

방법:

- 현재 `BrokerError` code와 broker response code를 대조한다.
- 인증, validation, business error, no data, rate limit, order reject, network/timeout을 분리한다.
- retry 가능한 오류와 절대 retry하면 안 되는 오류를 구분한다.
- 주문 오류는 retry 금지를 기본값으로 둔다.
- 사용자에게 보여줄 메시지와 내부 로그에 남길 정보를 분리한다.

산출물:

- `docs/broker-error-reject-policy.md`
- error classification table
- retry policy table
- log masking rules

완료 기준:

- 앱이 `error.code`, `broker`, `id`, `details`를 보고 처리 방향을 정할 수 있다.
- 주문 reject가 일반 network failure와 섞이지 않는다.
- retry 금지 영역이 명확하다.

### G5. Public SDK Contract 설계

목표:

- 외부 서버나 앱이 SecurityAPI를 SDK처럼 사용할 때 안정적으로 의존할 public API contract를 정한다.

Goal 명령:

```text
/goal SecurityAPI의 public SDK contract가 외부 앱에서 안정적으로 사용할 만큼 명확하다고 판단될 때까지, public exports, service method naming, response wrapper, capability status, semver/breaking change 규칙과 최소 연동 예제를 설계 문서로 정리해줘
```

방법:

- `src/index.mjs`, `src/services/index.mjs`, package exports를 기준으로 public API와 internal API를 구분한다.
- 서비스 메서드 이름 규칙과 인자 순서를 정리한다.
- `BrokerResponse`, dry-run response, realtime subscription response의 공통 형태를 문서화한다.
- capability status의 의미를 외부 앱 관점으로 다시 정리한다.
- breaking change와 semver 기준을 정한다.

산출물:

- `docs/public-sdk-contract.md`
- minimal app integration guide
- response contract examples

완료 기준:

- 외부 앱 개발자가 어떤 import를 써야 하는지 명확하다.
- public API와 내부 구현 세부사항이 구분된다.
- breaking change 판단 기준이 문서화되어 있다.

### G6. Production Readiness 설계

목표:

- 운영 서버에 올리기 전 필요한 보안, 로그, 모니터링, 장애 대응 기준을 만든다.

Goal 명령:

```text
/goal SecurityAPI를 운영 서버에 배포하기 전 필요한 기준이 명확하다고 판단될 때까지, secret 관리, 로그 마스킹, rate limit 대응, WebSocket 재연결, 주문 감사 로그, 장애 대응, 배포 체크리스트를 설계 문서로 정리해줘
```

방법:

- secret 입력과 저장 금지 원칙을 정리한다.
- 토큰, 계좌번호, 비밀번호, 주문 request 로그 마스킹 기준을 정한다.
- REST timeout, retry, rate limit 대응 기준을 정한다.
- WebSocket reconnect/resubscribe/stale heartbeat 운영 관측 항목을 정한다.
- 주문 감사 로그의 필수 필드와 금지 필드를 정한다.
- 운영 배포 전/후 체크리스트를 분리한다.

산출물:

- `docs/production-readiness-checklist.md`
- secret/logging policy
- incident response checklist
- order audit log schema draft

완료 기준:

- 운영 서버에 올리기 전 반드시 확인할 항목이 명확하다.
- 민감 정보가 로그에 남지 않는 기준이 있다.
- 장애 발생 시 관측해야 할 이벤트와 대응 순서가 정리되어 있다.

## 4. 권장 실행 순서

권장 순서는 다음이다.

1. G1 Integration Readiness 설계
2. G2 Live Read-only 검증 설계
3. G3 Order Guard 검증 설계
4. G4 Broker Error/Reject 설계
5. G5 Public SDK Contract 설계
6. G6 Production Readiness 설계

실제 API 키가 준비되지 않아도 G1~G6는 문서 설계로 진행할 수 있다. 실제 서버 호출은 G2 이후 별도 실행 단계에서 다룬다.

## 5. 설계 완료 후 구현 전환 기준

각 문서 단계가 끝나면 다음 질문에 답할 수 있어야 구현 단계로 넘어간다.

- 어떤 파일을 만들거나 수정할 것인가?
- 실제 API 호출이 필요한가, mock으로 충분한가?
- 주문 전송 가능성이 있는가?
- 실패 시 어떤 로그를 남기는가?
- 완료 여부를 어떤 명령으로 검증하는가?

이 질문에 답할 수 없으면 구현으로 넘어가지 않고 해당 설계 문서를 먼저 보강한다.
