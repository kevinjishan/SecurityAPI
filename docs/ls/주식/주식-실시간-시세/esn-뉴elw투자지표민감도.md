---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "48i332t8-055l-82lb-61r4-0046kfbj7uci"
tr_code: "ESN"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 뉴ELW투자지표민감도 (ESN)

<!-- request_field_count: 4 -->
<!-- response_field_count: 17 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | 뉴ELW투자지표민감도 |
| TR코드 | `ESN` |
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
| Response Body | `time` | 시간 | String | Y | 6 | - |
| Response Body | `theoryprice` | 장중이론가 | String | Y | 10.2 | - |
| Response Body | `delt` | 델타 | String | Y | 7.6 | - |
| Response Body | `gama` | 감마 | String | Y | 7.6 | - |
| Response Body | `ceta` | 세타 | String | Y | 12.6 | - |
| Response Body | `vega` | 베가 | String | Y | 12.6 | - |
| Response Body | `rhox` | 로우 | String | Y | 12.6 | - |
| Response Body | `impv` | 내재변동성 | String | Y | 5.2 | - |
| Response Body | `egearing` | E.기어링 | String | Y | 8.2 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 6 | - |
| Response Body | `elwclose` | ELW현재가 | String | Y | 8 | - |
| Response Body | `sign` | ELW전일대비구분 | String | Y | 1 | - |
| Response Body | `change` | ELW전일대비 | String | Y | 8 | - |
| Response Body | `date` | 일자 | String | Y | 8 | - |
| Response Body | `tickvalue` | 틱환산 | String | Y | 10.2 | - |
| Response Body | `lp_impv` | LP내재변동성 | String | Y | 5.2 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "ESN",
    "tr_key": "52HAAA"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "ESN",
    "tr_key": "52HAAA"
  },
  "body": {
    "date": "20230920",
    "ceta": "-0.556109",
    "elwclose": "70",
    "delt": "0.544628",
    "shcode": "52HAAA",
    "change": "5",
    "sign": "5",
    "rhox": "1.173105",
    "lp_impv": "33.72",
    "egearing": "7.31",
    "time": "091930",
    "impv": "34.08",
    "theoryprice": "52.39",
    "tickvalue": "0.27",
    "gama": "0.000120",
    "vega": "1.914977"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
