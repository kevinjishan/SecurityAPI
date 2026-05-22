---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=ffd2def7-a118-40f7-a0ab-cd4c6a538a90&api_id=2d923333-f816-4df9-932d-ad390437b66f"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "OAuth 인증"
api_id: "2d923333-f816-4df9-932d-ad390437b66f"
api_name: "접근토큰 폐기"
tr_id: "7tso3860-d2r6-7m2d-b431-yle82vfngam8"
tr_code: "revoke"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/oauth2/revoke"
content_type: "application/x-www-form-urlencoded"
rate_limit: "-"
auth_required: true
---

# 접근토큰 폐기 (revoke)

<!-- request_field_count: 5 -->
<!-- response_field_count: 3 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | OAuth 인증 |
| API 페이지 | 접근토큰 폐기 |
| TR명 | 접근토큰 폐기 |
| TR코드 | `revoke` |
| 초당 전송 건수 | - |
| 설명 | 발급받은 접근토큰을 더 이상  활용하지 않을 때 사용합니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/oauth2/revoke` |
| Request Format | - |
| Content-Type | application/x-www-form-urlencoded |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | OAuth2 호출 Request Body 데이터 포맷으로 "application/x-www-form-urlencoded 설정" |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `appkey` | 고객 앱Key | String | Y | 100 | 포탈에서 발급된 고객의 앱Key |
| Request Body | `appsecretkey` | 고객 앱 비밀Key | String | Y | 36 | 포탈에서 발급된 고객의 앱 비밀Key |
| Request Body | `token_type_hint` | 토큰 유형 hint | String | Y | 36 | access_token, refresh_token 토큰 타입 |
| Request Body | `token` | 접근토큰 | String | Y | 256 | G/W 에서 발급하는 접근토큰 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | OAuth2 응답 Response Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `code` | 응답코드 | String | Y | 3 | - |
| Response Body | `message` | 응답메시지 | String | Y | 100 | 응답메시지 |

## 예제

### Request

```text
appkey=PSd7orrAJnAfr202g4MpbzVxwqPBjjkvjLf2&appsecretkey=puQoMSRYZwOHt8goiEHbOazdBqLRUyYA&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImZhNDQ5NzBmLTVjNmQtNGNlZi1iNTc4LTVhNjViZjBiOTE1YyIsIm5iZiI6MTY4NjYyODQwMSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NjkzNjAxLCJpYXQiOjE2ODY2Mjg0MDEsImp0aSI6IlBTZDdvcnJBSm5BZnIyMDJnNE1wYnpWeHdxUEJqamt2akxmMiJ9.tP3WswPL-FAGdJBTVn6geHALK90i2zRQWZpqPIHRK09SOiP_sd8qJZeosoXFqZdfTqisXlAgwOjXcSvAR0V0lg&token_type_hint=access_token
```

### Response

```json
{
  "code": 200,
  "message": "접근토큰 폐기에 성공하였습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
