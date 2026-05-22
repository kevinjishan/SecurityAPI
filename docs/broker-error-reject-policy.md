# Broker Error And Reject Policy

이 문서는 SecurityAPI가 Kiwoom/LS/DB/KIS 오류, 주문 reject, 네트워크 실패를 외부 앱에서 일관되게 처리할 수 있도록 분류 기준을 정리한다.

## Goals

- SDK error code와 broker response code의 역할을 분리한다.
- 재시도 가능한 오류와 재시도하면 안 되는 오류를 구분한다.
- 주문 reject가 일반 네트워크 오류와 섞이지 않게 한다.
- 사용자 표시 메시지와 내부 로그 메시지를 분리한다.
- 민감 정보가 오류 로그에 남지 않도록 한다.

## Error Object Contract

SDK 오류는 `BrokerError`를 기준으로 다룬다.

```ts
type BrokerErrorShape = {
  name: "BrokerError";
  code: string;
  message: string;
  broker?: "kiwoom" | "ls" | "db" | "kis";
  id?: string;
  operation?: "auth" | "request" | "revoke" | "unknown";
  status?: number;
  retryable: boolean;
  details?: unknown;
};
```

앱은 최소한 다음 필드를 기준으로 처리한다.

- `error.code`: SDK-level classification
- `error.broker`: broker routing
- `error.id`: API ID 또는 TR code
- `error.retryable`: automatic retry candidate 여부
- `error.details`: broker code/message 등 추가 정보

## Classification Table

| SDK Code | Meaning | Typical Source | Retry Default | User Message |
| --- | --- | --- | --- | --- |
| `CONFIG_ERROR` | SDK/client 설정 누락 | missing key, mac address, endpoint | No | 설정이 필요합니다. |
| `VALIDATION_ERROR` | 호출 전 입력 검증 실패 | blank symbol, missing order field | No | 입력값을 확인해 주세요. |
| `AUTH_ERROR` | 인증/토큰 실패 | token issue failed, expired token rejected | No | 인증에 실패했습니다. |
| `UNSUPPORTED_CAPABILITY` | 지원하지 않는 기능 | broker lacks capability | No | 현재 지원하지 않는 기능입니다. |
| `API_ERROR` | broker 업무 오류 | Kiwoom `return_code`, LS/DB `rsp_cd`, KIS `rt_cd` error | No by default | 증권사 처리 오류입니다. |
| `HTTP_ERROR` | HTTP status 오류 | 4xx/5xx response | 5xx only | 서버 응답 오류입니다. |
| `NETWORK_ERROR` | 네트워크 연결 실패 | DNS/TLS/socket failure | Yes for read-only | 네트워크 연결 오류입니다. |
| `TIMEOUT` | timeout | request timeout | Yes for read-only | 요청 시간이 초과되었습니다. |
| `UNKNOWN_ERROR` | 분류되지 않은 실패 | unexpected exception | No | 알 수 없는 오류입니다. |

## Broker Business Error Mapping

### Kiwoom

Kiwoom API response can include:

- `return_code`
- `return_msg`

Policy:

- success-like code stays `ok: true`.
- failure code becomes `API_ERROR`.
- `details` should include `return_code`, `return_msg`, and API ID.
- auth endpoint failure can become `AUTH_ERROR` when failure happens during token operation.

### LS

LS API response can include:

- `rsp_cd`
- `rsp_msg`

Policy:

- documented success/no-data/order-success codes can remain `ok: true` where client already recognizes them.
- business failure becomes `API_ERROR`.
- `details` should include `rsp_cd`, `rsp_msg`, TR code, and block name if available.
- order reject response must be treated as order-domain failure, not generic network failure.

### DB

DB API response can include:

- `rsp_cd`
- `rsp_msg`
- OAuth-style `error`, `error_code`, `error_description`

Policy:

- documented success/no-data/order-success codes can remain `ok: true` where client already recognizes them.
- business failure becomes `API_ERROR`.
- `details` should include `rsp_cd`, `rsp_msg`, and TR code when available.
- order reject response must be treated as order-domain failure, not generic network failure.

### KIS

KIS API response can include:

- `rt_cd`
- `msg_cd`
- `msg1`
- OAuth-style `error`, `error_code`, `error_description`

Policy:

- `rt_cd === "0"` remains `ok: true`.
- non-zero `rt_cd` becomes `API_ERROR`.
- `details` should include `rt_cd`, `msg_cd`, `msg1`, and REST path when available.
- order reject response must be treated as order-domain failure, not generic network failure.

## Order Reject Policy

Order reject means the broker received or evaluated an order-related request and refused it at business level. It is distinct from SDK guard failure.

| Case | SDK Code | Retry | Notes |
| --- | --- | --- | --- |
| SDK guard blocks before network | `VALIDATION_ERROR` | No | Not a broker reject. Fix request/approval. |
| Broker rejects live order | `API_ERROR` | No | Preserve broker reject code/message. |
| Broker reports insufficient funds | `API_ERROR` | No | User/actionable account state. |
| Broker reports invalid market/session | `API_ERROR` | No | Fix market/session input. |
| Broker reports duplicate/order state conflict | `API_ERROR` | No | Manual review before retry. |
| Network failure before order response | `NETWORK_ERROR` | No automatic retry | Order state may be unknown. Must reconcile manually. |
| Timeout after order send | `TIMEOUT` | No automatic retry | Must query order history before any retry. |

Critical rule:

- Orders are never automatically retried by default.
- If a live order request has uncertain outcome, the next action is order history reconciliation, not resubmission.

## Retry Policy

| Operation | Retry Allowed | Conditions |
| --- | --- | --- |
| OAuth token issue | Limited | Only if network/5xx and no token was issued |
| Read-only REST | Yes | `NETWORK_ERROR`, `TIMEOUT`, retryable 5xx, with backoff |
| Account read-only | Cautious | Same as read-only, but logs must be masked |
| WebSocket subscribe | Yes | Reconnect/resubscribe via WebSocket client |
| Order dry-run | No network | Re-run locally after input change |
| Live order send | No | Never auto-retry |
| Order history reconciliation | Yes | Read-only retry rules apply |

## User vs Internal Messages

User-facing messages should be short and non-sensitive.

| Error | User-facing | Internal Log |
| --- | --- | --- |
| Config missing | API 설정이 필요합니다. | Missing variable name, broker, environment |
| Auth failed | 인증에 실패했습니다. | Broker, operation, status, masked response code |
| Validation failed | 입력값을 확인해 주세요. | Field name, capability, validation rule |
| API business error | 증권사 처리 오류입니다. | Broker code/message, API/TR id, request hash |
| Order rejected | 주문이 거부되었습니다. | Broker reject code/message, order audit id |
| Network timeout | 요청 시간이 초과되었습니다. | timeout ms, endpoint host, operation |

## Logging And Masking

Never log raw:

- `authorization`
- access token
- app secret
- account password
- full account number
- full order request with account credentials

Allowed in internal logs:

- broker
- API ID/TR code
- operation
- status
- broker response code/message
- masked account suffix
- request hash
- order audit id

## App Handling Pattern

```js
const result = await quote.getDomesticStockCurrentPrice("ls", "005930");

if (!result.ok) {
  switch (result.error.code) {
    case "VALIDATION_ERROR":
      // ask caller to fix input
      break;
    case "AUTH_ERROR":
      // rotate or reconfigure credentials
      break;
    case "API_ERROR":
      // inspect broker code/message in masked internal log
      break;
    case "TIMEOUT":
    case "NETWORK_ERROR":
      // retry only if operation is read-only
      break;
    default:
      // fail closed
      break;
  }
}
```

## Completion Criteria

This policy is complete when:

- Every `BrokerError` code has an app action.
- Order reject and SDK guard failure are separated.
- Retry policy explicitly forbids automatic live-order retry.
- Logging rules protect tokens, secrets, account numbers, and passwords.
