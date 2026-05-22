---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "502bk5lr-b1y0-r666-eixz-vm82r7561db6"
tr_code: "KH_"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSDAQ프로그램매매종목별 (KH_)

<!-- request_field_count: 4 -->
<!-- response_field_count: 32 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | KOSDAQ프로그램매매종목별 |
| TR코드 | `KH_` |
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
| Response Body | `time` | 수신시간 | String | Y | 6 | - |
| Response Body | `price` | 현재가 | String | Y | 8 | - |
| Response Body | `sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `change` | 전일대비 | String | Y | 8 | - |
| Response Body | `volume` | 누적거래량 | String | Y | 10 | - |
| Response Body | `drate` | 등락율 | String | Y | 6.2 | - |
| Response Body | `cdhrem` | 차익매도호가 잔량 | String | Y | 12 | - |
| Response Body | `cshrem` | 차익매수호가 잔량 | String | Y | 12 | - |
| Response Body | `bdhrem` | 비차익매도호가 잔량 | String | Y | 12 | - |
| Response Body | `bshrem` | 비차익매수호가 잔량 | String | Y | 12 | - |
| Response Body | `cdhvolume` | 차익매도호가 수량 | String | Y | 12 | - |
| Response Body | `cshvolume` | 차익매수호가 수량 | String | Y | 12 | - |
| Response Body | `bdhvolume` | 비차익매도호가 수량 | String | Y | 12 | - |
| Response Body | `bshvolume` | 비차익매수호가 수량 | String | Y | 12 | - |
| Response Body | `dwcvolume` | 전체매도위탁체결수량 | String | Y | 12 | - |
| Response Body | `swcvolume` | 전체매수위탁체결수량 | String | Y | 12 | - |
| Response Body | `djcvolume` | 전체매도자기체결수량 | String | Y | 12 | - |
| Response Body | `sjcvolume` | 전체매수자기체결수량 | String | Y | 12 | - |
| Response Body | `tdvolume` | 전체매도체결수량 | String | Y | 12 | - |
| Response Body | `tsvolume` | 전체매수체결수량 | String | Y | 12 | - |
| Response Body | `tvol` | 전체순매수 수량 | String | Y | 12 | - |
| Response Body | `dwcvalue` | 전체매도위탁체결금액 | String | Y | 15 | - |
| Response Body | `swcvalue` | 전체매수위탁체결금액 | String | Y | 15 | - |
| Response Body | `djcvalue` | 전체매도자기체결금액 | String | Y | 15 | - |
| Response Body | `sjcvalue` | 전체매수자기체결금액 | String | Y | 15 | - |
| Response Body | `tdvalue` | 전체매도체결금액 | String | Y | 15 | - |
| Response Body | `tsvalue` | 전체매수체결금액 | String | Y | 15 | - |
| Response Body | `tval` | 전체순매수 금액 | String | Y | 15 | - |
| Response Body | `pdgvolume` | 매도 사전공시수량 | String | Y | 12 | - |
| Response Body | `psgvolume` | 매수 사전공시수량 | String | Y | 12 | - |
| Response Body | `shcode` | 종목코드 | String | Y | 6 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "KH_",
    "tr_key": "086520"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "KH_",
    "tr_key": "086520"
  },
  "body": {
    "bshrem": "69",
    "cshvolume": "0",
    "swcvolume": "0",
    "tsvolume": "0",
    "sign": "3",
    "dwcvolume": "0",
    "djcvalue": "0",
    "price": "749000",
    "dwcvalue": "0",
    "cshrem": "0",
    "bdhrem": "53",
    "bdhvolume": "53",
    "swcvalue": "0",
    "tval": "0",
    "djcvolume": "0",
    "bshvolume": "69",
    "sjcvalue": "0",
    "cdhvolume": "0",
    "tdvalue": "0",
    "change": "0",
    "shcode": "086520",
    "sjcvolume": "0",
    "tdvolume": "0",
    "tvol": "0",
    "tsvalue": "0",
    "volume": "672",
    "drate": "0.00",
    "cdhrem": "0",
    "psgvolume": "0",
    "time": "084011",
    "pdgvolume": "0"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
