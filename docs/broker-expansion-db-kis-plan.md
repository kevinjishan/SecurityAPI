# DB/KIS Broker Expansion Plan

이 문서는 Kiwoom/LS 중심 SDK를 DB증권(`db`)과 한국투자증권(`kis`)까지 확장한 설계와 현재 구현 범위를 정리한다. 목적은 4개 증권사를 동일한 `client -> metadata -> capability -> service` 구조에서 사용하게 만드는 것이다.

## Scope

포함:

- `BROKERS`: `kiwoom`, `ls`, `db`, `kis`
- generated manifest: `data/generated/db-manifest.json`, `data/generated/kis-manifest.json`
- raw/docs snapshot: `data/raw/db`, `data/raw/kis`, `docs/db`, `docs/kis`
- clients: `DbClient`, `KisClient`
- capabilities: DB/KIS auth, 국내주식 quote/candle/account/order dry-run/realtime
- services: `QuoteService`, `MarketDataService`, `AccountService`, `OrderService`, `RealtimeService`
- order guard: dry-run default, live request confirmation, market-order confirmation, retry disabled

제외:

- live 주문 전송 검증
- 실제 계좌 조회 또는 live read-only 호출 실행
- DB/KIS 해외주식 serviceReady 승격
- 자동매매 판단 또는 주문 승인 UI

## Official Sources

| Broker | Source |
| --- | --- |
| DB증권 | https://openapi.db-fi.com/apiservice?group_id=cc55b867-e049-421b-a798-be016370ff44&api_id=9e3097ab-7d39-4433-8002-00649604f0de |
| 한국투자증권 포털 | https://apiportal.koreainvestment.com/apiservice-summary |
| 한국투자증권 공식 샘플 | https://github.com/koreainvestment/open-trading-api |

현재 생성 결과:

| Broker | Generated Docs | Manifest Entries | Notes |
| --- | ---: | ---: | --- |
| DB증권 | 165 | 165 | LS형 공개 포털 JSON 구조를 재사용한다. |
| 한국투자증권 | 338 | 339 | 포털 path 338개와 hashkey helper 1개를 포함한다. 공식 샘플 매핑은 273개 path다. |

## Architecture

DB는 LS와 유사한 TR 기반 구조로 수집한다. 런타임 client는 `DbClient`로 분리했고, 인증, continuation header, `mac_address`, DB business error normalize는 DB broker 이름과 manifest를 기준으로 처리한다.

KIS는 REST path 기반 구조로 수집한다. `KisClient`는 운영/모의 domain을 분리하고, request header에 `authorization`, `appkey`, `appsecret`, `tr_id`, `custtype`, `tr_cont`를 구성한다. 주문성 요청에 필요한 hashkey는 `options.hashKey === true`일 때 먼저 발급해 `hashkey` header로 전달한다. WebSocket approval key는 REST access token과 별도 cache key로 관리한다.

## Service Readiness

`serviceReady`로 연결된 범위:

- OAuth token 발급/폐기
- KIS WebSocket approval key 발급
- 국내주식 현재가/호가/복수 현재가
- 국내주식 기본정보/일봉/분봉
- 국내주식 계좌 예수금/잔고/주문체결내역 read-only
- 국내주식 주문 preview/dry-run 및 guarded live request path
- 국내주식 WebSocket 체결/호가/주문 이벤트 normalize

`metadataOnly`로 남긴 범위:

- DB/KIS 해외주식 quote/account/order API
- 테스트와 표준 response normalize가 끝나지 않은 주문성/해외 API

## Order Boundary

주문 서비스는 모든 broker에서 dry-run이 기본값이다. 실제 네트워크 주문 요청은 다음 조건을 모두 만족해야만 client 호출 단계로 진입한다.

- `dryRun: false`
- `confirm: true`
- 시장가 주문이면 `confirmMarketOrder: true`
- 지정된 경우 `expectedRequest`와 실제 broker request payload가 완전히 일치
- live request retry는 `retryable: false`

이번 확장 작업은 live 주문을 실행하지 않는다. live 주문 전송 검증은 별도 승인 goal에서만 다룬다.

## Validation

확장 검증은 mock HTTP와 generated metadata validation으로 수행한다.

```bash
npm run generate:docs
npm run generate:manifest
npm run validate:docs
npm run validate:manifest
npm test
npm run validate:all
npm pack --dry-run
```

신규 broker별 mock test 범위:

- DB token/revoke, TR request headers/body, continuation, business error
- KIS token/revoke-adjacent auth flow, GET query/header, mock/prod domain, hashkey, approval key, business error
- DB/KIS quote, candles, account read-only normalize
- DB/KIS order dry-run request preview
- DB/KIS realtime subscription IDs and message normalize
