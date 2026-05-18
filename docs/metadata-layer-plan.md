# Metadata Layer Detailed Plan

이 문서는 SecurityAPI SDK의 첫 번째 구현 대상인 Metadata Layer를 상세 설계한다. 목표는 공식 문서에서 수집한 `data/raw`를 SDK 런타임이 바로 사용할 수 있는 안정적인 manifest로 변환하는 것이다.

## 1. 목표와 범위

Metadata Layer는 SDK의 호출 엔진이 다음 질문에 답할 수 있게 한다.

- 이 API ID/TR 코드는 어느 증권사 API인가?
- 어떤 HTTP method, domain, path, content type으로 호출해야 하는가?
- 인증이 필요한가?
- 어떤 헤더를 자동 구성해야 하는가?
- 요청/응답 필드는 무엇인가?
- 연속조회 키는 어떤 헤더에서 오가는가?
- 호출 빈도 제한 정보가 문서에 있는가?

이 레이어는 실제 API를 호출하지 않는다. 원본 공식 문서를 정규화된 JSON manifest로 바꾸고 검증하는 역할만 가진다.

## 2. 입력과 출력

입력:

```text
data/raw/kiwoom/api-info-list.json
data/raw/kiwoom/error-codes.json
data/raw/ls/menu.json
data/raw/ls/api-details-by-id.json
data/raw/ls/trs-by-api-id.json
data/raw/ls/properties-by-tr-id.json
data/raw/ls/property-types.json
```

출력:

```text
data/generated/kiwoom-manifest.json
data/generated/ls-manifest.json
data/generated/broker-manifest-summary.json
```

추가 스크립트:

```text
scripts/generate-manifest.mjs
scripts/validate-manifest.mjs
```

추가 npm scripts:

```json
{
  "generate:manifest": "node scripts/generate-manifest.mjs",
  "validate:manifest": "node scripts/validate-manifest.mjs"
}
```

## 3. Manifest 원칙

- 런타임 SDK는 Markdown을 읽지 않는다.
- 원본 필드명은 최대한 유지한다.
- SDK 호출에 필요한 값은 공통 필드로 승격한다.
- 원본 데이터에서 확인할 수 없는 값은 추측하지 않고 `null` 또는 `false`로 둔다.
- API별 요청/응답 필드는 순서를 보존한다.
- manifest는 사람이 diff로 검토할 수 있도록 안정적인 정렬 순서를 유지한다.
- 민감정보는 포함하지 않는다.

## 4. 공통 Manifest 스키마

각 증권사 manifest는 최상위에 메타 정보와 API index를 가진다.

```ts
type BrokerManifest = {
  broker: "kiwoom" | "ls";
  generatedAt: string;
  source: {
    docsUrl: string;
    rawFiles: string[];
  };
  counts: {
    APIs: number;
    groups?: number;
    errors?: number;
  };
  apis: Record<string, ApiManifestEntry>;
};
```

공통 API entry:

```ts
type ApiManifestEntry = {
  broker: "kiwoom" | "ls";
  id: string;
  name: string;
  category: string;
  group?: string;

  protocol: "REST" | "UNKNOWN";
  method: string;
  domains: {
    prod: string | null;
    dev?: string | null;
    mock?: string | null;
  };
  path: string;
  contentType: string | null;
  requestFormat: "json" | "form" | "unknown";
  authRequired: boolean;
  rateLimit: {
    perSecond: number | null;
    raw: string | null;
  };

  headers: {
    request: FieldManifest[];
    response: FieldManifest[];
  };
  body: {
    request: FieldManifest[];
    response: FieldManifest[];
  };
  continuation: ContinuationManifest | null;
  examples: {
    request: unknown;
    response: unknown;
    requestRaw?: string | null;
    responseRaw?: string | null;
  };
  sourceRef: SourceRef;
};
```

필드 entry:

```ts
type FieldManifest = {
  id: string;
  name: string;
  type: string | null;
  required: boolean;
  length: string | null;
  location: "header" | "body";
  direction: "request" | "response";
  order: number;
  sample: string | null;
  description: string | null;
  raw: Record<string, unknown>;
};
```

연속조회 정보:

```ts
type ContinuationManifest = {
  supported: boolean;
  requestHeaders: {
    continueFlag?: string;
    nextKey?: string;
  };
  responseHeaders: {
    continueFlag?: string;
    nextKey?: string;
  };
  requestDefaults: Record<string, string>;
};
```

출처 정보:

```ts
type SourceRef = {
  officialUrl: string;
  rawFile: string;
  rawId: string;
  docPath?: string;
};
```

## 5. Kiwoom 변환 규칙

원본:

```text
data/raw/kiwoom/api-info-list.json
```

원본 구조:

- `resp_data[].apiInfo`: API 기본정보
- `resp_data[].commonHeader`: 요청/응답 공통 헤더
- `resp_data[].apiTrIo`: 요청/응답 body 필드

ID:

- `entry.id = apiInfo.apiId`
- 예: `ka10001`, `au10001`

기본정보 매핑:

| Manifest | Kiwoom raw |
| --- | --- |
| `name` | `apiInfo.apiNm` |
| `group` | `apiInfo.grpCodeNm` |
| `category` | `apiInfo.jobTpNm` |
| `protocol` | `apiInfo.svcTransTp` |
| `method` | `apiInfo.jobMethod` |
| `domains.prod` | `apiInfo.jobRealDomain` |
| `domains.dev` | `apiInfo.jobDevDomain` |
| `domains.mock` | `apiInfo.jobSimulateDomain` |
| `path` | `apiInfo.svcUri` |
| `contentType` | `apiInfo.jobContentType` |

요청 형식:

- `jobFormat === "JSON"`이면 `requestFormat = "json"`.
- 그 외 값은 일단 `unknown`으로 둔다.

인증:

- `apiInfo.svcUri === "/oauth2/token"`이면 `authRequired = false`.
- 그 외 `commonHeader` 요청 헤더에 `authorization`이 있으면 `authRequired = true`.
- 둘 다 아니면 `false`로 둔다.

헤더 필드:

- `commonHeader`에서 `headBodyTp === "H"` 또는 위치상 header인 값을 사용한다.
- `inptOutputTp === "I"`는 request header.
- `inptOutputTp === "O"`는 response header.
- `sortOrd`가 있으면 order로 사용한다.

Body 필드:

- `apiTrIo`에서 `inptOutputTp === "I"`는 request body.
- `apiTrIo`에서 `inptOutputTp === "O"`는 response body.
- 원본 순서 또는 `sortOrd`가 있으면 그 값을 order로 사용한다.

필드 매핑:

| Manifest | Kiwoom raw |
| --- | --- |
| `id` | `itemId` |
| `name` | `itemNm` |
| `type` | `type` |
| `required` | `esntYn === "Y"` |
| `length` | `lngt` |
| `sample` | `sampData` |
| `description` | `itemDc` |

연속조회:

- request header에 `cont-yn`, `next-key`가 있으면 지원으로 본다.
- response header에 `cont-yn`, `next-key`가 있으면 응답 continuation 추출 대상으로 본다.

```json
{
  "supported": true,
  "requestHeaders": {
    "continueFlag": "cont-yn",
    "nextKey": "next-key"
  },
  "responseHeaders": {
    "continueFlag": "cont-yn",
    "nextKey": "next-key"
  },
  "requestDefaults": {
    "cont-yn": "N"
  }
}
```

예제:

- request 예제는 request body field의 `sampData`로 구성한다.
- response 예제는 `apiInfo.rsltData`를 사용한다.
- JSON parse에 실패하면 raw string으로 보존한다.

Kiwoom manifest 완료 기준:

- API entry 수가 207개다.
- `au10001`은 `authRequired = false`다.
- `ka10001`은 `authRequired = true`, path가 `/api/dostk/stkinfo`다.
- 모든 entry는 `id`, `name`, `method`, `path`, `contentType`을 가진다.

## 6. LS 변환 규칙

원본:

```text
data/raw/ls/menu.json
data/raw/ls/api-details-by-id.json
data/raw/ls/trs-by-api-id.json
data/raw/ls/properties-by-tr-id.json
data/raw/ls/property-types.json
```

LS는 API 페이지와 TR이 분리되어 있다. SDK 호출 단위는 TR이므로 manifest entry의 ID는 `trCode`를 기본으로 한다.

ID:

- `entry.id = tr.trCode`
- 예: `t1101`, `token`
- 내부 추적용으로 `trId`, `apiId`, `groupId`를 `sourceRef` 또는 LS 확장 필드에 보존한다.

LS 전용 확장 필드:

```ts
type LsApiManifestEntry = ApiManifestEntry & {
  ls: {
    apiId: string;
    apiName: string;
    trId: string;
    trCode: string;
    groupId: string | null;
    groupName: string | null;
  };
};
```

기본정보 매핑:

| Manifest | LS raw |
| --- | --- |
| `name` | `tr.trName` |
| `group` | `menu.groups[].name` |
| `category` | `apiDetail.apiCollectionName` 또는 group name |
| `protocol` | `apiDetail.protocolType` |
| `method` | `apiDetail.httpMethod` |
| `domains.prod` | `apiDetail.domain` |
| `domains.mock` | `apiDetail.simulatedDomain` |
| `path` | `apiDetail.accessUrl` |
| `contentType` | `apiDetail.contentType` |
| `rateLimit.raw` | `tr.transactionPerSec` |

요청 형식:

- `contentType`에 `json`이 포함되면 `requestFormat = "json"`.
- `contentType`에 `x-www-form-urlencoded`가 포함되면 `requestFormat = "form"`.
- 그 외는 `unknown`.

인증:

- `apiDetail.accessUrl === "/oauth2/token"`이면 `authRequired = false`.
- 그 외 request header에 `authorization`이 있으면 `authRequired = true`.
- OAuth revoke는 문서상 authorization/body 요구사항을 따른다.

헤더/Body 필드:

`properties-by-tr-id.json`의 각 property를 `bodyType`으로 분류한다.

| bodyType | Manifest 위치 |
| --- | --- |
| `req_h` | request header |
| `req_b` | request body |
| `res_h` | response header |
| `res_b` | response body |

필드 매핑:

| Manifest | LS raw |
| --- | --- |
| `id` | `propertyCd` |
| `name` | `propertyNm` |
| `type` | `propertyTypes[propertyType]` |
| `required` | `requireYn === "Y"` |
| `length` | `propertyLength` |
| `order` | `propertyOrder` |
| `description` | `description` |

주의:

- LS 필드 중 `-shcode`처럼 하위 필드를 하이픈 prefix로 표시하는 값이 있다.
- manifest에는 원본 `id`를 그대로 보존한다.
- 추후 도메인 계층에서 nested body helper를 만들 수 있지만 Metadata Layer에서는 추측 변환하지 않는다.

연속조회:

- request header에 `tr_cont`, `tr_cont_key`가 있으면 지원으로 본다.
- response header에 `tr_cont`, `tr_cont_key`가 있으면 응답 continuation 추출 대상으로 본다.

```json
{
  "supported": true,
  "requestHeaders": {
    "continueFlag": "tr_cont",
    "nextKey": "tr_cont_key"
  },
  "responseHeaders": {
    "continueFlag": "tr_cont",
    "nextKey": "tr_cont_key"
  },
  "requestDefaults": {
    "tr_cont": "N"
  }
}
```

mac address:

- request header에 `mac_address`가 있으면 `requiredConfig`에 추가한다.
- SDK는 설정에 `macAddress`가 없고 해당 header가 필수이면 명확한 설정 누락 에러를 낸다.

```ts
type RequiredConfig = {
  key: "macAddress";
  header: "mac_address";
  required: boolean;
};
```

예제:

- `tr.reqExample`, `tr.resExample`을 보존한다.
- JSON parse가 되면 parsed example도 저장한다.
- parse 실패 또는 form 예제는 raw string으로 저장한다.

LS manifest 완료 기준:

- TR entry 수가 365개다.
- `token`은 `authRequired = false`, `requestFormat = "form"`이다.
- `t1101`은 path가 `/stock/market-data`, rate limit raw가 `10`이다.
- 모든 entry는 `id`, `name`, `method`, `path`, `contentType`을 가진다.

## 7. Summary Manifest

`broker-manifest-summary.json`은 사람이 빠르게 확인하고 CI에서 개수를 검증하기 위한 파일이다.

예시:

```json
{
  "generatedAt": "2026-05-18T00:00:00.000Z",
  "brokers": {
    "kiwoom": {
      "apis": 207,
      "errors": 33,
      "manifest": "data/generated/kiwoom-manifest.json"
    },
    "ls": {
      "groups": 8,
      "apiPages": 41,
      "trs": 365,
      "manifest": "data/generated/ls-manifest.json"
    }
  }
}
```

## 8. 정렬 규칙

안정적인 diff를 위해 다음 순서를 지킨다.

- 최상위 `apis` key는 ID 오름차순.
- Kiwoom field는 `sortOrd`가 있으면 `sortOrd`, 없으면 원본 순서.
- LS property는 `propertyOrder`, 없으면 원본 순서.
- JSON 출력은 2칸 indentation.
- 생성 시각은 manifest에는 포함하되, deterministic diff가 필요하면 `--stable` 옵션으로 생략 가능하게 한다.

초기 구현은 `generatedAt`을 포함한다. 나중에 diff 소음이 크면 stable mode를 추가한다.

## 9. 검증 규칙

`scripts/validate-manifest.mjs`는 다음을 검증한다.

공통:

- manifest 파일이 존재한다.
- 모든 API entry에 `broker`, `id`, `name`, `method`, `domains.prod`, `path`, `contentType`, `authRequired`가 있다.
- `headers.request`, `headers.response`, `body.request`, `body.response`는 배열이다.
- field entry의 `id`, `location`, `direction`, `order`, `raw`가 존재한다.

Kiwoom:

- API 수 207개.
- `au10001.authRequired === false`.
- `ka10001.authRequired === true`.
- `ka10001.path === "/api/dostk/stkinfo"`.
- request/response field count가 raw와 일치한다.

LS:

- TR 수 365개.
- group 수 8개.
- API page 수 41개.
- `token.authRequired === false`.
- `t1101.authRequired === true`.
- `t1101.path === "/stock/market-data"`.
- request/response field count가 raw property count와 일치한다.

충돌 검증:

- 동일 broker 안에서 `id` 중복이 없어야 한다.
- LS에서 동일 `trCode`가 중복될 경우 manifest 생성은 실패하고, 구현자가 alias 정책을 명시해야 한다.

## 10. 구현 순서

1. `scripts/generate-manifest.mjs` 추가.
2. Kiwoom manifest 생성 구현.
3. LS manifest 생성 구현.
4. `broker-manifest-summary.json` 생성 구현.
5. `scripts/validate-manifest.mjs` 추가.
6. `package.json`에 scripts 추가.
7. `npm run generate:manifest && npm run validate:manifest` 통과.
8. `docs/sdk-architecture-plan.md`와 README에 manifest 사용법 업데이트.

## 11. 1차 구현에서 하지 않을 것

- TypeScript 타입 자동 생성.
- API별 request parameter runtime validation.
- LS `-field`를 nested object로 자동 변환.
- 도메인 함수 생성.
- 실제 증권사 API 호출.

이들은 SDK Core와 Broker Client가 안정화된 뒤 2차로 진행한다.
