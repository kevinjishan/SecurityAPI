---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=cc55b867-e049-421b-a798-be016370ff44&api_id=9e3097ab-7d39-4433-8002-00649604f0de"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "OAuth 인증"
api_id: "9e3097ab-7d39-4433-8002-00649604f0de"
api_name: "접근토큰 발급"
tr_id: "cd5b4c37-609c-4b8c-995f-f4f7a594a16c"
tr_code: "token"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/oauth2/token"
content_type: "application/x-www-form-urlencoded"
rate_limit: "-"
auth_required: false
---

# 접근토큰 발급 (token)

<!-- request_field_count: 5 -->
<!-- response_field_count: 5 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | OAuth 인증 |
| API 페이지 | 접근토큰 발급 |
| TR명 | 접근토큰 발급 |
| TR코드 | `token` |
| 초당 전송 건수 | - |
| 설명 | 본인을 인증하는 확인 절차로, 접근 토큰을 부여받아 오픈 API  활용이 가능합니다.<br>※ API호출 유량은 1분에 1건 입니다. <br> ※ 접근토큰 유효기간 개인/법인 : 신청일시로부터 24시간 <br> ※ 유효기간 만료 전 토큰을 발급을 하는경우, 동일한 토큰이 발급됩니다. (만료기간도 동일) 유효기간 만료 전 새 토큰이 필요한 경우 접근토큰 폐기 후  발급 부탁드립니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/oauth2/token` |
| Request Format | - |
| Content-Type | application/x-www-form-urlencoded |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | OAuth2 호출 Request Body 포맷으로 "application/x-www-form-urlencoded" 설정 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `grant_type` | 권한부여 Type | String | Y | 100 | "client_credentials" 고정 |
| Request Body | `appkey` | 고객 앱Key | String | Y | 36 | 포탈에서 발급된 고객의 앱Key |
| Request Body | `appsecretkey` | 고객 앱 비밀Key | String | Y | 36 | 포탈에서 발급된 고객의 앱 비밀Key |
| Request Body | `scope` | scope | String | Y | 256 | "oob" 고정 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | OAuth2 호출 Request Body 포맷으로 "application/x-www-form-urlencoded" |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `token` | 접근토큰 | String | Y | 1000 | G/W 에서 발급하는 접근토큰 |
| Response Body | `expire_in` | 접근토큰 유효기간 | String | Y | 10 | 유효기간(초) |
| Response Body | `scope` | scope | String | Y | 256 | "oob" |
| Response Body | `token_type` | 토큰 유형 | String | Y | 256 | Bearer |

## 예제

### Request

```text
appkey=PSqzSi7jxxxxxxxxxxxxxxxxxxxxxxxxxxxx&appsecretkey=RPclxxxxxxxxxxxxxxxxxxxxxxxxxxxx&grant_type=client_credentials&scope=oob
```

### Response

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxx",
  "scope": "oob",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
