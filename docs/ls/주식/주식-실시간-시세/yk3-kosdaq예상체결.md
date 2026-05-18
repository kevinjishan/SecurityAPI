---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "zs8g4tn3-14x0-403f-6cfh-1cg82a3r5720"
tr_code: "YK3"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSDAQ예상체결 (YK3)

<!-- request_field_count: 4 -->
<!-- response_field_count: 13 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | KOSDAQ예상체결 |
| TR코드 | `YK3` |
| 초당 전송 건수 | - |
| 설명 | 주식 주문현황 및 시세, 투자정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/stock` |
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
| Response Body | `hotime` | 호가시간 | String | Y | 6 | - |
| Response Body | `yeprice` | 예상체결가격 | String | Y | 8 | - |
| Response Body | `yevolume` | 예상체결수량 | String | Y | 12 | - |
| Response Body | `jnilysign` | 예상체결가전일종가대비구분 | String | Y | 1 | - |
| Response Body | `jnilchange` | 예상체결가전일종가대비 | String | Y | 8 | - |
| Response Body | `jnilydrate` | 예상체결가전일종가등락율 | String | Y | 6.2 | - |
| Response Body | `yofferho0` | 예상매도호가 | String | Y | 8 | - |
| Response Body | `ybidho0` | 예상매수호가 | String | Y | 8 | - |
| Response Body | `yofferrem0` | 예상매도호가수량 | String | Y | 12 | - |
| Response Body | `ybidrem0` | 예상매수호가수량 | String | Y | 12 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 6 | - |
| Response Body | `exchname` | 거래소명 | String | Y | 3 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6Ijk5NGZkNjI5LWY4OGItNGQ0Ni05NTE0LTJjNmQzMjM1MWIyYSIsIm5iZiI6MTY4NjY0MDc3NywiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzI3MTc3LCJpYXQiOjE2ODY2NDA3NzcsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.WT1pgGw-gawv2GAQiRNcEphlv3BfXZfeVG03wwBCoCKpUYYC0l019Oc0JJIqoR41WHm8kEuNgDgYhlib_LxI7g",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "YK3",
    "tr_key": "086520"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "YK3",
    "tr_key": "086520"
  },
  "body": {
    "jnilysign": "2",
    "yofferrem0": "502",
    "jnilchange": "14000",
    "yeprice": "763000",
    "ybidho0": "762000",
    "shcode": "086520",
    "yevolume": "6386",
    "hotime": "085113",
    "ybidrem0": "591",
    "jnilydrate": "1.87",
    "yofferho0": "763000"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
