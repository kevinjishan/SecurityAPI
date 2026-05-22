---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "b7p5scxa-0c1s-7e6t-1f2u-1z7716r515kv"
tr_code: "FX9"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSPI200선물가격제한폭확대 (FX9)

<!-- request_field_count: 4 -->
<!-- response_field_count: 6 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | KOSPI200선물가격제한폭확대 |
| TR코드 | `FX9` |
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
| Response Body | `upstep` | 적용상한단계 | String | Y | 2 | - |
| Response Body | `dnstep` | 적용하한단계 | String | Y | 2 | - |
| Response Body | `uplmtprice` | 적용상한가 | String | Y | 9.2 | - |
| Response Body | `dnlmtprice` | 적용하한가 | String | Y | 9.2 | - |
| Response Body | `futcode` | 단축코드 | String | Y | 8 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjQyNjA1YWEzLTA2YzEtNDliNi04ZmRjLTVmNjU1ZTQ1MTE2MiIsIm5iZiI6MTY4Njc4MjU0MSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2ODY2Mzk5LCJpYXQiOjE2ODY3ODI1NDEsImp0aSI6IlBTanpid3pFbE90UGtlbE5zUXZIQThPSkpPV2J6WE1NdUdpNCJ9.BRwxcX00HeeQKW_2MEAcBqk3ZkfLdDfg5WDv17U5X-kYIiudsdLpfkZ0Fo0B8mcTN_NlJuXXhdw6449-8okFYQ",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "FX9",
    "tr_key": "A0166000"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "FX9",
    "tr_key": "A0166000"
  },
  "body": {
    "upstep": "01",
    "futcode": "A0166000",
    "uplmtprice": "3.86",
    "dnstep": "02",
    "dnlmtprice": "3.04"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
