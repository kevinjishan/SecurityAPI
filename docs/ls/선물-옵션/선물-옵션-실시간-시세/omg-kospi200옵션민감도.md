---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "30d5gryt-et0l-76a7-tq46-w2ui7ed3t4k7"
tr_code: "OMG"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSPI200옵션민감도 (OMG)

<!-- request_field_count: 4 -->
<!-- response_field_count: 18 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | KOSPI200옵션민감도 |
| TR코드 | `OMG` |
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
| Response Body | `chetime` | 체결시간 | String | Y | 6 | - |
| Response Body | `actprice` | 행사가 | String | Y | 6.2 | - |
| Response Body | `k200jisu` | KOSPI200지수 | String | Y | 6.2 | - |
| Response Body | `fut200jisu` | 선물가격 | String | Y | 6.2 | - |
| Response Body | `price` | 현재가 | String | Y | 6.2 | - |
| Response Body | `capimpv` | 대표내재변동성 | String | Y | 6.2 | - |
| Response Body | `impv` | 내재변동성 | String | Y | 6.2 | - |
| Response Body | `delt` | 델타(블랙숄즈) | String | Y | 7.4 | - |
| Response Body | `gama` | 감마(블랙숄즈) | String | Y | 7.4 | - |
| Response Body | `ceta` | 세타(블랙숄즈) | String | Y | 7.4 | - |
| Response Body | `vega` | 베가(블랙숄즈) | String | Y | 7.4 | - |
| Response Body | `rhox` | 로우(블랙숄즈) | String | Y | 7.4 | - |
| Response Body | `theoryprice` | 이론가(블랙숄즈) | String | Y | 6.2 | - |
| Response Body | `bimpv` | 전일가내재변동성 | String | Y | 6.2 | - |
| Response Body | `offerimpv` | 매도가내재변동성 | String | Y | 6.2 | - |
| Response Body | `bidimpv` | 매수가내재변동성 | String | Y | 6.2 | - |
| Response Body | `optcode` | 옵션코드 | String | Y | 8 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "OMG",
    "tr_key": "201T7347"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "OMG",
    "tr_key": "201T7347"
  },
  "body": {
    "ceta": "-0.0947",
    "optcode": "201T7347",
    "bidimpv": "12.70",
    "fut200jisu": "348.00",
    "delt": "0.4966",
    "rhox": "0.1376",
    "chetime": "092803",
    "price": "4.50",
    "capimpv": "18.21",
    "offerimpv": "12.73",
    "bimpv": "13.41",
    "actprice": "347.50",
    "impv": "12.67",
    "k200jisu": "346.17",
    "theoryprice": "4.96",
    "gama": "0.0351",
    "vega": "0.4006"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
