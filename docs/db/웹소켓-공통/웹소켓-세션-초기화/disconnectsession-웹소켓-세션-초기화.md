---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=0140b583-0f93-4aff-897b-e350b3652b40&api_id=cc424a15-7d38-46d6-ab6e-5d46b2b386fc"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "웹소켓(공통)"
api_id: "cc424a15-7d38-46d6-ab6e-5d46b2b386fc"
api_name: "웹소켓 세션 초기화"
tr_id: "f62a219f-88ae-436d-bc7b-681e2f15efb1"
tr_code: "DisconnectSession"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/websocket/disconnectSession"
content_type: "application/json;charset=utf-8"
rate_limit: "1"
auth_required: true
---

# 웹소켓 세션 초기화 (DisconnectSession)

<!-- request_field_count: 2 -->
<!-- response_field_count: 4 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 웹소켓(공통) |
| API 페이지 | 웹소켓 세션 초기화 |
| TR명 | 웹소켓 세션 초기화 |
| TR코드 | `DisconnectSession` |
| 초당 전송 건수 | 1 |
| 설명 | 접속중인 모든 웹소켓 세션을 초기화 하는 API 입니다.<br><br>※ 발급받은 토큰정보와 일치하는 계좌의 세션이 초기화 됩니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/websocket/disconnectSession` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |

## 요청

문서 미기재

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Object | Y | - | - |
| Response Body | `-acntNo` | 계좌번호 | String | Y | 11 | 웹소켓 세션 초기화를 완료한 계좌번호 |
| Response Body | `-result` | result | String | Y | 19 | 처리 메세지 |

## 예제

### Request

```json
{}
```

### Response

```json
{
  "acntNo": "11122333344",
  "result": "접속중인 세션이 초기화 되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
