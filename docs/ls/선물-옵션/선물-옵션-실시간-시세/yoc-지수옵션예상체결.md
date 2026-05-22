---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "8478652c-n55m-4n0r-54nx-005qzs00shaj"
tr_code: "YOC"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 지수옵션예상체결 (YOC)

<!-- request_field_count: 4 -->
<!-- response_field_count: 8 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | 지수옵션예상체결 |
| TR코드 | `YOC` |
| 초당 전송 건수 | - |
| 설명 | 선물옵션 주문현황 및 시세, 투자정보를 실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/futureoption` |
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
| Response Body | `ychetime` | 예상체결시간 | String | Y | 6 | - |
| Response Body | `yeprice` | 예상체결가격 | String | Y | 6.2 | - |
| Response Body | `jnilysign` | 예상체결가전일종가대비구분 | String | Y | 1 | - |
| Response Body | `jnilchange` | 예상체결가전일종가대비 | String | Y | 6.2 | - |
| Response Body | `jnilydrate` | 예상체결가전일종가등락율 | String | Y | 6.2 | - |
| Response Body | `optcode` | 단축코드 | String | Y | 8 | - |
| Response Body | `expct_ccls_q` | 예상체결수량 | String | Y | 9 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjQyNjA1YWEzLTA2YzEtNDliNi04ZmRjLTVmNjU1ZTQ1MTE2MiIsIm5iZiI6MTY4Njc4MjU0MSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2ODY2Mzk5LCJpYXQiOjE2ODY3ODI1NDEsImp0aSI6IlBTanpid3pFbE90UGtlbE5zUXZIQThPSkpPV2J6WE1NdUdpNCJ9.BRwxcX00HeeQKW_2MEAcBqk3ZkfLdDfg5WDv17U5X-kYIiudsdLpfkZ0Fo0B8mcTN_NlJuXXhdw6449-8okFYQ",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "YOC",
    "tr_key": "201T7345"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "YOC",
    "tr_key": "201T7345"
  },
  "body": {
    "ychetime": "083256",
    "jnilysign": "3",
    "jnilchange": "0.00",
    "optcode": "201T7345",
    "yeprice": "0.00",
    "jnilydrate": "0.00",
    "expct_ccls_q": "0"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
