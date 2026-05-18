---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "0c3a6d32-f496-4c2a-89d9-6c004c6e84a1"
tr_code: "NPH"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (NXT)프로그램매매종목별 (NPH)

<!-- request_field_count: 4 -->
<!-- response_field_count: 33 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (NXT)프로그램매매종목별 |
| TR코드 | `NPH` |
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
| Request Body | `tr_cd` | 거래 CD | String | N | 3 | LS증권 거래코드 |
| Request Body | `tr_key` | 단축코드 | String | Y | 10 | 단축코드 7자리 + 공백 3자리 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `time` | 수신시간 | String | Y | 6 | - |
| Response Body | `price` | 현재가 | Number | Y | 8 | - |
| Response Body | `sign` | 전일대비구분 | Number | Y | 1 | - |
| Response Body | `change` | 전일대비 | Number | Y | 8 | - |
| Response Body | `volume` | 누적거래량 | Number | Y | 10 | - |
| Response Body | `drate` | 등락율 | Number | Y | 6.2 | - |
| Response Body | `cdhrem` | 차익매도호가잔량 | Number | Y | 12 | - |
| Response Body | `cshrem` | 차익매수호가잔량 | Number | Y | 12 | - |
| Response Body | `bdhrem` | 비차익매도호가잔량 | Number | Y | 12 | - |
| Response Body | `bshrem` | 비차익매수호가잔량 | Number | Y | 12 | - |
| Response Body | `cdhvolume` | 차익매도호가수량 | Number | Y | 12 | - |
| Response Body | `cshvolume` | 차익매수호가수량 | Number | Y | 12 | - |
| Response Body | `bdhvolume` | 비차익매도호가수량 | Number | Y | 12 | - |
| Response Body | `bshvolume` | 비차익매수호가수량 | Number | Y | 12 | - |
| Response Body | `dwcvolume` | 전체매도위탁체결수량 | Number | Y | 12 | - |
| Response Body | `swcvolume` | 전체매수위탁체결수량 | Number | Y | 12 | - |
| Response Body | `djcvolume` | 전체매도자기체결수량 | Number | Y | 12 | - |
| Response Body | `sjcvolume` | 전체매수자기체결수량 | Number | Y | 12 | - |
| Response Body | `tdvolume` | 전체매도체결수량 | Number | Y | 12 | - |
| Response Body | `tsvolume` | 전체매수체결수량 | Number | Y | 12 | - |
| Response Body | `tvol` | 전체순매수수량 | Number | Y | 12 | - |
| Response Body | `dwcvalue` | 전체매도위탁체결금액 | Number | Y | 15 | - |
| Response Body | `swcvalue` | 전체매수위탁체결금액 | Number | Y | 15 | - |
| Response Body | `djcvalue` | 전체매도자기체결금액 | Number | Y | 15 | - |
| Response Body | `sjcvalue` | 전체매수자기체결금액 | Number | Y | 15 | - |
| Response Body | `tdvalue` | 전체매도체결금액 | Number | Y | 15 | - |
| Response Body | `tsvalue` | 전체매수체결금액 | Number | Y | 15 | - |
| Response Body | `tval` | 전체순매수금액 | Number | Y | 15 | - |
| Response Body | `pdgvolume` | 매도사전공시수량 | Number | Y | 12 | - |
| Response Body | `psgvolume` | 매수사전공시수량 | Number | Y | 12 | - |
| Response Body | `shcode` | 종목코드 | Number | Y | 12 | - |
| Response Body | `ex_shcode` | 거래소별단축코드 | Number | Y | 10 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjYyY2NhNzgwLWZjN2EtNDcwZC04NjQ4LTMyOWQzZjFiMmE2NyIsIm5iZiI6MTc0MjQyOTY1MiwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQyNTA4MDAwLCJpYXQiOjE3NDI0Mjk2NTIsImp0aSI6IlBTQ2lXTjBDZGZUYVZYb293Tnltb2dkdmxJaUxHV25UcGQzRCJ9.GJBiwx09tuREqY3AN0zSphhBTBMIC0X6l-TyETIFwoaxllhChr6IDqSVAdgB61y4ufh-J8zGBcucZuVDfC54Qg",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "NPH",
    "tr_key": "N009520   "
  }
}
```

### Response

```text
문서 미기재
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
