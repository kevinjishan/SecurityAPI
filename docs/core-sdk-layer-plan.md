# Core SDK Layer Detailed Plan

이 문서는 SecurityAPI SDK의 공통 기반인 Core SDK Layer를 상세 설계한다. Core SDK는 증권사별 Client가 공유하는 HTTP 호출, 토큰 저장, 응답 정규화, 에러 타입, 테스트 가능한 의존성 주입 구조를 제공한다.

## 1. 목표와 범위

Core SDK Layer의 목표는 증권사별 차이와 무관한 공통 실행 기반을 만드는 것이다.

포함한다:

- 공통 타입
- fetch 기반 HTTP client
- timeout 처리
- 응답 파싱
- header 정규화
- memory token store
- 공통 에러 타입
- retry 정책의 기본 구조
- 테스트용 fetch/time 주입

포함하지 않는다:

- 키움/LS 인증 API 호출 세부 구현
- API ID/TR 코드별 헤더 구성
- 증권사별 API 에러 코드 해석
- 도메인 모델 변환
- 주문 API 안전 정책

## 2. 파일 구조

1차 구현 파일:

```text
src/core/types.ts
src/core/BrokerError.ts
src/core/HttpClient.ts
src/core/TokenStore.ts
src/core/RetryPolicy.ts
src/core/index.ts
```

테스트 파일:

```text
test/core/HttpClient.test.ts
test/core/TokenStore.test.ts
test/core/BrokerError.test.ts
```

패키지 진입점:

```text
src/index.ts
```

## 3. 공통 타입

### Broker

```ts
export type Broker = "kiwoom" | "ls";
```

### Runtime Environment

```ts
export type BrokerEnvironment = "prod" | "dev" | "mock";
```

`dev`와 `mock` 지원 여부는 증권사별 manifest/capability가 판단한다. Core는 문자열 타입만 제공한다.

### BrokerResponse

```ts
export type BrokerResponse<T = unknown> = {
  ok: boolean;
  broker: Broker;
  id: string;
  data: T | null;
  raw: unknown;
  headers: Record<string, string>;
  status: number;
  continuation?: ContinuationState;
  error?: BrokerError;
};
```

규칙:

- 성공 시 `ok = true`, `data`는 파싱된 응답이다.
- 실패 시 `ok = false`, `error`가 반드시 존재한다.
- `raw`는 가능한 한 원본 응답을 보존한다.
- `headers`는 모두 lower-case key로 정규화한다.
- HTTP status가 없거나 네트워크 실패면 `status = 0`으로 둔다.

### ContinuationState

```ts
export type ContinuationState = {
  hasNext: boolean;
  key?: string;
  raw?: Record<string, string>;
};
```

Core는 구조만 정의한다. 키움의 `cont-yn`/`next-key`, LS의 `tr_cont`/`tr_cont_key` 추출은 Broker Client가 담당한다.

### RequestContext

```ts
export type RequestContext = {
  broker: Broker;
  id: string;
  operation: "auth" | "request" | "revoke" | "unknown";
  retryable?: boolean;
};
```

`RequestContext`는 에러 메시지, 로깅, retry 판단에 사용한다.

## 4. BrokerError 설계

### Error Code

```ts
export type BrokerErrorCode =
  | "HTTP_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "AUTH_ERROR"
  | "API_ERROR"
  | "CONFIG_ERROR"
  | "VALIDATION_ERROR"
  | "UNSUPPORTED_CAPABILITY"
  | "UNKNOWN_ERROR";
```

### BrokerError

```ts
export class BrokerError extends Error {
  readonly code: BrokerErrorCode;
  readonly broker?: Broker;
  readonly id?: string;
  readonly status?: number;
  readonly retryable: boolean;
  readonly details?: unknown;
  readonly cause?: unknown;
}
```

생성 helper:

```ts
BrokerError.http(...)
BrokerError.network(...)
BrokerError.timeout(...)
BrokerError.auth(...)
BrokerError.api(...)
BrokerError.config(...)
BrokerError.validation(...)
BrokerError.unsupported(...)
BrokerError.unknown(...)
```

규칙:

- token, app secret, authorization header는 `details`에 넣지 않는다.
- HTTP 5xx와 network error는 기본 `retryable = true`.
- HTTP 4xx, auth error, validation error는 기본 `retryable = false`.
- 주문/정정/취소는 Broker Client가 `retryable = false`로 context를 넘길 수 있어야 한다.

## 5. HttpClient 설계

### 생성자

```ts
export type HttpClientOptions = {
  fetch?: typeof fetch;
  defaultTimeoutMs?: number;
  defaultHeaders?: Record<string, string>;
  retryPolicy?: RetryPolicy;
  now?: () => number;
};

export class HttpClient {
  constructor(options?: HttpClientOptions);
}
```

기본값:

- `fetch`: globalThis.fetch
- `defaultTimeoutMs`: 10_000
- `retryPolicy`: no retry
- `now`: `Date.now`

### 요청 API

```ts
export type HttpRequest = {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  bodyFormat?: "json" | "form" | "text" | "raw";
  timeoutMs?: number;
  context?: RequestContext;
};

export type HttpResult<T = unknown> = {
  ok: boolean;
  status: number;
  headers: Record<string, string>;
  data: T | null;
  raw: unknown;
  error?: BrokerError;
};
```

```ts
request<T = unknown>(request: HttpRequest): Promise<HttpResult<T>>
```

### Body Serialization

`bodyFormat` 규칙:

- `json`: `JSON.stringify(body)`, content-type 없으면 `application/json`
- `form`: `URLSearchParams`로 변환, content-type 없으면 `application/x-www-form-urlencoded`
- `text`: string 그대로 전송
- `raw`: body를 fetch에 그대로 전달

주의:

- `bodyFormat`이 `json`인데 body가 `undefined`면 body를 보내지 않는다.
- `form`에서 nested object는 허용하지 않는다. Broker Client가 명시적으로 flatten해야 한다.

### Response Parsing

응답 파싱 순서:

1. response text를 한 번만 읽는다.
2. content-type에 `json`이 있으면 JSON parse를 시도한다.
3. content-type이 없더라도 text가 `{` 또는 `[`로 시작하면 JSON parse를 시도한다.
4. parse 실패 시 text를 `raw`와 `data`에 보존한다.
5. 빈 body는 `data = null`, `raw = ""`.

### Header Normalize

모든 response header key는 lower-case로 변환한다.

```ts
{
  "content-type": "application/json",
  "next-key": "..."
}
```

request header는 Broker Client에서 넘긴 key를 유지하되, 내부 merge 시 case-insensitive 충돌을 피한다.

### Timeout

구현 방식:

- `AbortController` 사용.
- timeout 발생 시 `BrokerError.timeout` 반환.
- timeout 후 timer는 반드시 clear한다.

### HTTP Error

HTTP status가 200~299가 아니면:

- `ok = false`
- `error.code = "HTTP_ERROR"`
- `status`와 parsed body를 details에 포함
- `raw`는 응답 원문 유지

Core는 증권사 API body 안의 업무 에러는 판단하지 않는다. 그 판단은 Broker Client가 한다.

## 6. RetryPolicy 설계

1차 기본값은 retry 없음이다.

```ts
export type RetryPolicy = {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  shouldRetry: (error: BrokerError, attempt: number, context?: RequestContext) => boolean;
};
```

기본 policy:

```ts
export const noRetryPolicy = {
  maxAttempts: 1,
  baseDelayMs: 0,
  maxDelayMs: 0,
  shouldRetry: () => false
};
```

조회 API용 opt-in policy:

- network error
- timeout
- HTTP 502/503/504
- context.retryable이 false가 아닌 경우

주문 API는 자동 retry를 기본 사용하지 않는다.

## 7. TokenStore 설계

### Token 모델

```ts
export type StoredToken = {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  issuedAt?: number;
  raw?: unknown;
};
```

### TokenStore API

```ts
export class TokenStore {
  constructor(options?: { now?: () => number; expirySkewMs?: number });

  get(key: string): StoredToken | null;
  set(key: string, token: StoredToken): void;
  clear(key?: string): void;
  isValid(key: string): boolean;
  getAuthorizationHeader(key: string): string | null;
}
```

규칙:

- key는 Broker Client가 정한다. 예: `kiwoom:prod`, `ls:prod`.
- 기본 `expirySkewMs`는 60초.
- `expiresAt - expirySkewMs <= now()`이면 invalid.
- token type은 원문을 보존하되 authorization header 생성 시 `Bearer` 형태를 사용할 수 있게 한다.

주의:

- 1차 구현은 memory store만 제공한다.
- 파일/Redis/DB token store는 인터페이스가 안정화된 뒤 추가한다.

## 8. Config와 Secret 처리

Core는 secret 값을 직접 알 필요가 없다. Broker Client config에서 받은 secret은 인증 호출에만 사용한다.

공통 보안 규칙:

- `BrokerError.details`에 authorization, appKey, secretKey를 넣지 않는다.
- request/response debug logging은 Core 1차 범위에서 제공하지 않는다.
- 추후 logger를 추가할 경우 redact hook을 먼저 설계한다.

## 9. 테스트 전략

Core SDK는 실제 네트워크 없이 테스트한다.

필수 테스트:

### HttpClient

- JSON body serialization
- form body serialization
- response JSON parse
- invalid JSON fallback
- response header lower-case normalize
- HTTP 500을 `HTTP_ERROR`로 반환
- fetch throw를 `NETWORK_ERROR`로 반환
- timeout을 `TIMEOUT`으로 반환
- custom timeout이 default timeout을 override

### TokenStore

- set/get token
- valid token authorization header 생성
- 만료 token invalid 처리
- expiry skew 적용
- clear single key
- clear all

### BrokerError

- 각 helper가 올바른 code/retryable/status를 가진다.
- secret-like field가 details에 들어가지 않도록 helper 사용 규칙 테스트.

## 10. Public Export

`src/core/index.ts`:

```ts
export * from "./types";
export * from "./BrokerError";
export * from "./HttpClient";
export * from "./TokenStore";
export * from "./RetryPolicy";
```

`src/index.ts` 초기 export:

```ts
export * from "./core";
```

Broker Client 구현 후:

```ts
export * from "./adapters/KiwoomClient";
export * from "./adapters/LsClient";
```

## 11. 구현 순서

1. TypeScript 설정 추가.
2. `src/core/types.ts` 작성.
3. `BrokerError` 작성.
4. `RetryPolicy` 작성.
5. `HttpClient` 작성.
6. `TokenStore` 작성.
7. core index export 작성.
8. core 단위 테스트 작성.
9. `npm run build`, `npm test` 추가.

## 12. 완료 기준

- `npm run build`가 성공한다.
- `npm test`가 네트워크 없이 성공한다.
- Core API는 fetch와 now를 주입받아 deterministic test가 가능하다.
- Broker Client가 사용할 수 있는 최소 기능이 준비된다:
  - HTTP 호출
  - timeout
  - body serialization
  - response parsing
  - token cache
  - common error

## 13. 1차 구현에서 하지 않을 것

- persistent token store
- structured logger
- OpenTelemetry
- circuit breaker
- rate limiter
- request body schema validation
- generated TypeScript 타입

이 기능들은 실제 Broker Client 구현과 사용 패턴이 안정화된 뒤 추가한다.
