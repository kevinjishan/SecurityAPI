---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=6ad419a5-f0ce-47c2-a52a-91685fa86a31&api_id=eddd61f7-d595-4370-b9c3-49c4c6178096"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "기타"
api_id: "eddd61f7-d595-4370-b9c3-49c4c6178096"
api_name: "[기타] 실시간 시세"
tr_id: "1861dwn3-xbb5-3f1c-m5p1-1jycodtw73e7"
tr_code: "NWS"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/etc"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 실시간뉴스제목패킷 (NWS)

<!-- request_field_count: 4 -->
<!-- response_field_count: 8 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 기타 |
| API 페이지 | [기타] 실시간 시세 |
| TR명 | 실시간뉴스제목패킷 |
| TR코드 | `NWS` |
| 초당 전송 건수 | - |
| 설명 | 장운영정보  등 기타 정보를 실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/etc` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `token` | 접근토큰 | String | Y | 1000 | Access Token을 설정하기 위한 Header Parameter |
| Request Header | `tr_type` | 거래 Type | String | Y | 1 | 1: 계좌등록, 2: 계좌해제, 3: 실시간 시세 등록, 4: 실시간 시세 해제 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |
| Request Body | `tr_key` | 단축코드 | String | N | 8 | 단축코드 6자리 또는 8자리 (단건, 연속), (계좌등록/해제 일 경우 필수값 아님) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `date` | 날짜 | String | Y | 8 | - |
| Response Body | `time` | 시간 | String | Y | 6 | - |
| Response Body | `id` | 뉴스구분자 | String | Y | 2 | - |
| Response Body | `realkey` | 키값 | String | Y | 24 | - |
| Response Body | `title` | 제목 | String | Y | 300 | - |
| Response Body | `code` | 단축종목코드 | String | Y | 240 | - |
| Response Body | `bodysize` | BODY길이 | String | Y | 8 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "NWS",
    "tr_key": "NWS001"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "NWS",
    "tr_key": "NWS001"
  },
  "body": {
    "date": "20230614",
    "code": "000000011810",
    "realkey": "202306140952172704000165",
    "bodysize": "4841",
    "time": "095217",
    "id": "27",
    "title": "STX, ‘2차전지 핵심’ 수산화리튬 사업 박차…中 영정리튬과 MOU"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
