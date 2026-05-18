# Broker Client Layer Detailed Plan

이 문서는 SecurityAPI SDK의 Broker Client Layer를 상세 설계한다. Broker Client는 Metadata Layer의 manifest와 Core SDK Layer의 HTTP/토큰/에러 기반을 사용해, 사용자가 API ID 또는 TR 코드만으로 증권사 API를 호출할 수 있게 한다.

## 1. 목표와 범위

Broker Client Layer의 1차 목표는 다음 호출을 안정적으로 지원하는 것이다.

```ts
await kiwoom.request("ka10001", { stk_cd: "005930" });

await ls.request("t1101", {
  t1101InBlock: { shcode: "005930" }
});
```

포함한다:

- `KiwoomClient`
- `LsClient`
- 인증 토큰 발급/캐싱/폐기
- manifest 기반 endpoint/headers/body 구성
- 운영/개발/모의 도메인 선택
- 연속조회 request option과 response extraction
- 증권사별 API error normalize
- 실제 네트워크 없이 mock fetch로 검증 가능한 구조

포함하지 않는다:

- `getCurrentPrice`, `placeOrder` 같은 도메인 함수
- 요청 body schema validation
- 응답 필드 타입 변환
- 실시간 WebSocket 추상화
- 주문 retry 정책
- capability/superpowers layer

## 2. 파일 구조

```text
src/adapters/BaseBrokerClient.ts
src/adapters/KiwoomClient.ts
src/adapters/LsClient.ts
src/adapters/types.ts
src/adapters/index.ts
```

테스트:

```text
test/adapters/KiwoomClient.test.ts
test/adapters/LsClient.test.ts
```

Core와 Metadata 의존:

```text
src/core/*
data/generated/kiwoom-manifest.json
data/generated/ls-manifest.json
```

1차 구현에서는 JSON manifest를 런타임 import한다. 패키지 배포 시 `data/generated`를 포함한다.

## 3. 공통 Client 타입

### Client Config

```ts
type BaseBrokerClientConfig = {
  env?: "prod" | "dev" | "mock";
  timeoutMs?: number;
  fetch?: typeof fetch;
  tokenStore?: TokenStore;
  now?: () => number;
};
```

공통 규칙:

- `env` 기본값은 `prod`.
- `fetch`, `now`, `tokenStore`는 테스트 주입을 위해 받는다.
- API 키/secret은 증권사별 config에 둔다.

### Request Options

```ts
type BrokerRequestOptions = {
  timeoutMs?: number;
  headers?: Record<string, string>;
  continuation?: {
    nextKey?: string;
    continueFlag?: string;
  };
  auth?: boolean;
  retryable?: boolean;
  rawResponse?: boolean;
};
```

규칙:

- `headers`는 자동 생성 헤더 위에 merge한다. 단, 민감/필수 헤더를 잘못 덮는 것은 Broker Client가 방지한다.
- `auth: false`는 OAuth/token 같은 특수 호출에만 내부적으로 사용한다. public request에서는 기본 노출하지 않는다.
- `retryable`은 Core `RequestContext`에 전달한다.

### Public Response

Broker Client는 Core의 `BrokerResponse<T>`를 그대로 반환하되, `continuation`과 `error`를 증권사별 규칙으로 보강한다.

```ts
type BrokerClientResponse<T = unknown> = BrokerResponse<T>;
```

## 4. BaseBrokerClient

`BaseBrokerClient`는 직접 export하지 않는 내부 추상 클래스다.

역할:

- `HttpClient` 생성/보관
- `TokenStore` 보관
- manifest 조회 helper
- URL 구성 helper
- 공통 response wrapper helper
- secret redaction helper

예상 skeleton:

```ts
abstract class BaseBrokerClient<TEntry> {
  protected readonly http: HttpClient;
  protected readonly tokenStore: TokenStore;
  protected readonly env: BrokerEnvironment;

  protected getManifestEntry(id: string): TEntry;
  protected buildUrl(entry: TEntry): string;
  protected normalizeHeaders(headers: Record<string, string>): Record<string, string>;
}
```

주의:

- 증권사별 인증/헤더/에러 판단은 Base에 넣지 않는다.
- Base는 broker-neutral helper만 제공한다.

## 5. KiwoomClient 설계

### Config

```ts
type KiwoomClientConfig = BaseBrokerClientConfig & {
  appKey: string;
  secretKey: string;
};
```

### Public API

```ts
class KiwoomClient {
  constructor(config: KiwoomClientConfig);

  request<T = unknown>(
    apiId: string,
    params?: Record<string, unknown>,
    options?: BrokerRequestOptions
  ): Promise<BrokerResponse<T>>;

  getAccessToken(forceRefresh?: boolean): Promise<StoredToken>;
  revokeToken(): Promise<BrokerResponse>;
  clearToken(): void;
}
```

### Domain 선택

manifest entry의 `domains`를 사용한다.

| env | domain |
| --- | --- |
| `prod` | `domains.prod` |
| `dev` | `domains.dev` |
| `mock` | `domains.mock` |

규칙:

- 선택한 env의 domain이 없으면 `CONFIG_ERROR`.
- path는 manifest `path`를 사용한다.

### Token 발급

키움 OAuth entry:

- API ID: `au10001`
- path: `/oauth2/token`
- method: `POST`
- content type: `application/json;charset=UTF-8`

요청 body:

```json
{
  "grant_type": "client_credentials",
  "appkey": "{appKey}",
  "secretkey": "{secretKey}"
}
```

응답에서 token 추출:

```ts
{
  token: string;
  token_type: string;
  expires_dt?: string;
}
```

만료 처리:

- `expires_dt`가 있으면 `yyyyMMddHHmmss`로 파싱해 `expiresAt`을 만든다.
- 파싱 실패 시 보수적으로 23시간 후 만료로 둔다.
- `TokenStore` key는 `kiwoom:{env}`.

### Token 폐기

키움 revoke entry:

- API ID: `au10002`
- path: `/oauth2/revoke`

요청은 manifest와 공식 문서 필드를 따른다. 성공/실패와 무관하게 사용자가 `clearToken()`을 직접 호출할 수 있게 한다.

### 일반 Request Header

기본 헤더:

```ts
{
  "Content-Type": entry.contentType,
  "authorization": `Bearer ${token.accessToken}`,
  "api-id": apiId
}
```

연속조회 옵션:

```ts
if (options.continuation?.nextKey) {
  headers["cont-yn"] = options.continuation.continueFlag ?? "Y";
  headers["next-key"] = options.continuation.nextKey;
}
```

첫 요청 기본값:

- `cont-yn`은 보내지 않는다.
- 사용자가 명시한 경우만 보낸다.

### Body

- manifest `requestFormat`이 `json`이면 JSON body.
- params가 없으면 `{}`를 보낸다.
- form/unknown은 1차 구현에서는 `CONFIG_ERROR` 또는 명시적 unsupported로 처리한다. 현재 키움 문서는 REST JSON 중심이다.

### Response 처리

Core `HttpClient` 결과를 받은 뒤:

1. HTTP error면 그대로 `BrokerResponse.ok = false`.
2. body에 `return_code`가 있고 0이 아니면 `API_ERROR`.
3. body에 `return_code === 0`이면 success.
4. `return_code`가 없으면 HTTP success를 success로 본다.

연속조회 추출:

```ts
const contYn = headers["cont-yn"];
const nextKey = headers["next-key"];

continuation = {
  hasNext: contYn === "Y",
  key: nextKey || undefined,
  raw: { "cont-yn": contYn, "next-key": nextKey }
};
```

## 6. LsClient 설계

### Config

```ts
type LsClientConfig = BaseBrokerClientConfig & {
  appKey: string;
  appSecretKey: string;
  macAddress?: string;
};
```

### Public API

```ts
class LsClient {
  constructor(config: LsClientConfig);

  request<T = unknown>(
    trCode: string,
    params?: Record<string, unknown>,
    options?: BrokerRequestOptions
  ): Promise<BrokerResponse<T>>;

  getAccessToken(forceRefresh?: boolean): Promise<StoredToken>;
  revokeToken(): Promise<BrokerResponse>;
  clearToken(): void;
}
```

### Domain 선택

LS manifest의 `domains.prod`를 기본 사용한다.

규칙:

- `env = "prod"`는 `domains.prod`.
- `env = "mock"`이고 `domains.mock`이 있으면 사용한다.
- `env = "dev"`는 LS에서 문서상 별도 dev domain이 없으면 `CONFIG_ERROR`.
- domain이 없으면 `CONFIG_ERROR`.

### Token 발급

LS OAuth TR:

- TR code: `token`
- path: `/oauth2/token`
- method: `POST`
- content type: `application/x-www-form-urlencoded`

요청 body:

```text
grant_type=client_credentials&appkey={appKey}&appsecretkey={appSecretKey}&scope=oob
```

응답에서 token 추출:

```ts
{
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}
```

만료 처리:

- `expiresAt = now + expires_in * 1000`.
- `TokenStore` key는 `ls:{env}`.

### Token 폐기

LS revoke TR:

- TR code: `revoke`
- path: `/oauth2/revoke`

요청 body와 헤더는 manifest를 따른다. 폐기 성공 후 `TokenStore.clear("ls:{env}")`를 수행한다.

### 일반 Request Header

기본 헤더:

```ts
{
  "Content-Type": entry.contentType,
  "authorization": `Bearer ${token.accessToken}`,
  "tr_cd": trCode,
  "tr_cont": options.continuation?.continueFlag ?? "N"
}
```

연속조회 옵션:

```ts
if (options.continuation?.nextKey) {
  headers["tr_cont"] = options.continuation.continueFlag ?? "Y";
  headers["tr_cont_key"] = options.continuation.nextKey;
}
```

mac address:

- manifest request headers에 `mac_address`가 있고 config `macAddress`가 있으면 자동 삽입한다.
- 해당 필드가 필수인데 config가 없으면 `CONFIG_ERROR`.
- 필수가 아니고 config가 없으면 생략한다.

### Body

- manifest `requestFormat = "json"`이면 JSON body.
- manifest `requestFormat = "form"`이면 form body.
- OAuth token/revoke는 form body.
- 일반 JSON TR은 사용자가 전달한 params를 그대로 body로 보낸다.
- LS 하위 필드 `-shcode` 같은 문서 표기는 SDK가 자동 변환하지 않는다. 사용자는 실제 API body 구조대로 params를 전달한다.

### Response 처리

Core `HttpClient` 결과를 받은 뒤:

1. HTTP error면 그대로 `BrokerResponse.ok = false`.
2. LS 응답 body에 명확한 에러 코드 필드가 있으면 `API_ERROR`로 변환한다.
3. 에러 필드명이 API마다 다를 수 있으므로 1차 구현에서는 HTTP success를 기본 success로 보고, 알려진 공통 에러 필드가 있을 때만 API error로 처리한다.
4. 원본 body는 항상 `raw`에 보존한다.

연속조회 추출:

```ts
const trCont = headers["tr_cont"];
const trContKey = headers["tr_cont_key"];

continuation = {
  hasNext: trCont === "Y",
  key: trContKey || undefined,
  raw: { "tr_cont": trCont, "tr_cont_key": trContKey }
};
```

## 7. Manifest 조회 규칙

Kiwoom:

- key는 `apiId`.
- 존재하지 않으면 `VALIDATION_ERROR`.

LS:

- key는 `trCode`.
- manifest 생성 단계에서 중복을 금지한다.
- 존재하지 않으면 `VALIDATION_ERROR`.

공통:

- manifest entry의 `authRequired`가 true이면 token을 확보한다.
- false이면 authorization header를 만들지 않는다.
- public `request()`로 OAuth token API를 직접 호출하는 것은 허용하되, 보통은 `getAccessToken()`을 사용하도록 문서화한다.

## 8. Error Normalize

Broker Client는 Core error를 감싸거나 보강한다.

공통 에러:

| 상황 | Error code |
| --- | --- |
| manifest entry 없음 | `VALIDATION_ERROR` |
| env domain 없음 | `CONFIG_ERROR` |
| token 발급 실패 | `AUTH_ERROR` |
| required config 누락 | `CONFIG_ERROR` |
| HTTP 실패 | `HTTP_ERROR` |
| API 업무 실패 | `API_ERROR` |

민감정보 보호:

- error details에 `appKey`, `secretKey`, `appSecretKey`, `authorization`은 넣지 않는다.
- request body를 details에 넣을 때는 OAuth body를 제외하거나 redact한다.

## 9. Retry 정책

1차 Broker Client 기본값:

- 모든 요청 retry off.
- 사용자가 retry policy를 주입할 수는 있다.
- 주문/정정/취소 API는 Broker Client가 `retryable = false`로 context를 설정할 수 있어야 한다.

추후:

- 조회 API만 opt-in retry.
- manifest category/path를 보고 주문성 API를 보수적으로 분류.

## 10. 테스트 전략

실제 API 키 없이 mock fetch로 테스트한다.

### KiwoomClient 테스트

- token이 없으면 `/oauth2/token` 호출 후 원 요청을 호출한다.
- `ka10001` 요청 시 URL, `api-id`, `authorization`, JSON body가 맞다.
- token이 유효하면 token API를 다시 호출하지 않는다.
- token 만료 시 refresh한다.
- response header `cont-yn=Y`, `next-key=abc`를 continuation으로 변환한다.
- body `return_code !== 0`이면 `API_ERROR`.
- env domain이 없으면 `CONFIG_ERROR`.

### LsClient 테스트

- token이 없으면 `/oauth2/token` form 요청 후 원 요청을 호출한다.
- `t1101` 요청 시 URL, `tr_cd`, `tr_cont=N`, authorization, JSON body가 맞다.
- continuation option이 있으면 `tr_cont=Y`, `tr_cont_key`를 보낸다.
- response header `tr_cont=Y`, `tr_cont_key=abc`를 continuation으로 변환한다.
- required `mac_address`가 있는데 config가 없으면 `CONFIG_ERROR`.
- token이 유효하면 token API를 다시 호출하지 않는다.

## 11. Public Export

`src/adapters/index.ts`:

```ts
export * from "./types";
export * from "./KiwoomClient";
export * from "./LsClient";
```

`src/index.ts`:

```ts
export * from "./core";
export * from "./adapters";
```

## 12. README 사용 예시

1차 README에는 아래 수준의 예시만 포함한다.

```ts
import { KiwoomClient, LsClient } from "security-api-reference";

const kiwoom = new KiwoomClient({
  appKey: process.env.KIWOOM_APP_KEY!,
  secretKey: process.env.KIWOOM_SECRET_KEY!,
  env: "mock"
});

const result = await kiwoom.request("ka10001", {
  stk_cd: "005930"
});
```

도메인 함수 예시는 1차 README에 넣지 않는다.

## 13. 구현 순서

1. `src/adapters/types.ts` 작성.
2. `BaseBrokerClient` 작성.
3. `KiwoomClient` token flow 작성.
4. `KiwoomClient.request` 작성.
5. `LsClient` token flow 작성.
6. `LsClient.request` 작성.
7. mock fetch 테스트 작성.
8. public export 정리.
9. README에 SDK 기본 사용법 추가.

## 14. 완료 기준

- API 키 없이 테스트가 통과한다.
- Kiwoom/LS 각각 token flow와 일반 request flow가 mock으로 검증된다.
- manifest 없는 ID는 명확히 실패한다.
- 연속조회 헤더가 request/response 양쪽에서 처리된다.
- 민감정보가 error details에 포함되지 않는다.

## 15. 1차 구현에서 하지 않을 것

- API별 parameter validation.
- response type generation.
- domain service 함수.
- superpowers/capabilities.
- websocket 실시간 시세.
- 주문 안전 정책.
- persistent token store.
