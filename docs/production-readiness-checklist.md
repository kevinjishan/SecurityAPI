# Production Readiness Checklist

이 문서는 SecurityAPI를 운영 서버에서 사용하기 전에 확인해야 할 보안, 로그, 장애 대응, 주문 감사 기준을 정의한다. 이 문서가 완료되어도 실제 live 주문 전송이 자동으로 승인되는 것은 아니다.

## Production Gate

운영 사용 전 다음 문서가 모두 준비되어 있어야 한다.

- [Live Integration Readiness](live-integration-readiness.md)
- [Live Read-only Verification Plan](live-readonly-verification-plan.md)
- [Order Guard Verification Plan](order-guard-verification-plan.md)
- [Broker Error And Reject Policy](broker-error-reject-policy.md)
- [Public SDK Contract](public-sdk-contract.md)

## Secret Management

Required rules:

- API key, secret, token, account password는 repository에 저장하지 않는다.
- `.env`는 local only이며 git에 포함하지 않는다.
- 운영 서버는 secret manager 또는 CI/CD secret store를 사용한다.
- token cache는 process memory 또는 안전한 ephemeral store를 우선한다.
- token을 파일, plain log, analytics event에 저장하지 않는다.

Checklist:

- [ ] `KIWOOM_APP_KEY` is stored in secret manager.
- [ ] `KIWOOM_SECRET_KEY` is stored in secret manager.
- [ ] `LS_APP_KEY` is stored in secret manager.
- [ ] `LS_APP_SECRET_KEY` is stored in secret manager.
- [ ] `LS_MAC_ADDRESS` handling is environment-specific and not hardcoded.
- [ ] Account passwords are never stored in source code.
- [ ] Local `.env` is ignored by git.

## Logging Policy

Never log:

- authorization header
- access token
- refresh/issue token response body in full
- app secret
- full account number
- account password
- raw order request containing account credentials

Allowed log fields:

- broker
- environment
- operation
- API ID/TR code
- capability id
- response status
- broker response code/message
- masked account suffix
- request hash
- order audit id
- elapsed time
- retry attempt count for read-only operations

Masking examples:

| Data | Log Format |
| --- | --- |
| Account number | `***1234` |
| Token | `[REDACTED_TOKEN]` |
| App secret | `[REDACTED_SECRET]` |
| Account password | `[REDACTED_PASSWORD]` |
| Authorization | `Bearer [REDACTED_TOKEN]` |

## Rate Limit And Retry

Policy:

- Retry is opt-in or client-controlled for read-only requests.
- Order requests are never automatically retried.
- Backoff should be exponential with jitter where implemented.
- Rate limit events should be logged by broker/id/operation without request secrets.

Checklist:

- [ ] Read-only retry policy is documented in the caller app.
- [ ] Live order retry is disabled.
- [ ] Timeout values are explicit.
- [ ] Rate limit response code is captured as `API_ERROR` or `HTTP_ERROR` with broker details.
- [ ] Repeated failures trigger circuit-breaker behavior in the caller app, not infinite loops in SDK use.

## WebSocket Operations

The SDK WebSocket client supports reconnect/resubscribe behavior. Production apps must observe it.

Events to monitor:

- `connected`
- `disconnected`
- `reconnecting`
- `resubscribed`
- `stale`
- `reconnectFailed`
- `error`

Checklist:

- [ ] App records connect/disconnect timestamps.
- [ ] App records active subscription count.
- [ ] Stale heartbeat threshold is configured.
- [ ] Reconnect failure alerts are routed to operator logs.
- [ ] App calls `unsubscribe` on shutdown or screen/session exit.
- [ ] Duplicate subscriptions are monitored.

## Order Audit Log Schema Draft

Order audit logs are required for dry-run, blocked-live, approved-live-candidate, and live-send phases.

Allowed fields:

```ts
type OrderAuditLog = {
  auditId: string;
  timestamp: string;
  sdkCommit?: string;
  broker: "kiwoom" | "ls" | "db" | "kis";
  environment: "mock" | "dev" | "prod";
  capability: string;
  apiIdOrTrCode: string;
  phase: "dryRun" | "blockedLive" | "approvedLiveCandidate" | "liveSend";
  side: "buy" | "sell" | "modify" | "cancel" | "reserve";
  symbol: string;
  quantity: number;
  orderType?: string;
  price?: number | null;
  estimatedPrice?: number | null;
  currencyCode?: string | null;
  marketCode?: string | null;
  tradingSession?: string | null;
  requestHash: string;
  expectedRequestMatched?: boolean;
  guardResult: "allowed" | "blocked";
  guardReason?: string;
  brokerResponseCode?: string;
  brokerResponseMessage?: string;
  errorCode?: string;
  reviewer?: string;
};
```

Forbidden fields:

- raw token
- app secret
- full account number
- password
- unmasked reserved-order account block
- full authorization header

## Incident Response

### Read-only Incident

Examples:

- repeated timeout
- broker business errors
- WebSocket stale/reconnect failure

Response:

1. Stop retry loops in caller app.
2. Record broker, API/TR, operation, status, response code.
3. Verify broker status and network route.
4. Re-run a minimal read-only scenario after cooldown.
5. Update live-readonly result log.

### Order Incident

Examples:

- uncertain live order outcome
- broker reject
- timeout after order send
- duplicated order candidate

Response:

1. Do not retry automatically.
2. Stop further live order submissions for the affected broker/account.
3. Query order history/read-only reconciliation.
4. Compare order audit id and request hash.
5. Record broker reject code/message.
6. Require manual operator decision before any new order.

## Deployment Checklist

Before deployment:

- [ ] `npm run validate:all` passes.
- [ ] Environment variables are present in secret manager.
- [ ] `.env` is not deployed as a repository artifact.
- [ ] Public SDK contract is reviewed.
- [ ] Broker error/reject policy is reviewed.
- [ ] Read-only verification has been run in target environment or explicitly deferred.
- [ ] Order guard verification has been run locally.
- [ ] Live order send remains disabled unless separately approved.
- [ ] Logs are masked in staging.
- [ ] WebSocket lifecycle events are observable.

After deployment:

- [ ] OAuth token issue succeeds.
- [ ] One domestic read-only quote succeeds.
- [ ] One LS overseas read-only quote succeeds if overseas features are enabled.
- [ ] WebSocket connection can subscribe/unsubscribe.
- [ ] No secrets appear in logs.
- [ ] Failure alerts route to the expected destination.

## Completion Criteria

This checklist is complete when:

- Secret handling is explicit.
- Logging and masking rules are enforceable by caller apps.
- Retry and rate-limit handling distinguish read-only and order operations.
- WebSocket operational events are listed.
- Order audit schema draft exists.
- Incident response separates read-only and order failures.
