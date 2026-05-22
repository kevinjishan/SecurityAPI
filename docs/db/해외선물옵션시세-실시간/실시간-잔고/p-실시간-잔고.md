---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=f1819725-95e6-4445-ad7f-aa1908b20b03&api_id=8c1c0e6a-a0cd-4eb8-a170-40832b8317c4"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외선물옵션시세(실시간)"
api_id: "8c1c0e6a-a0cd-4eb8-a170-40832b8317c4"
api_name: "[실시간]잔고"
tr_id: "6d535bdd-3f7e-442d-a9ca-327eb462e379"
tr_code: "P"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7071"
path: "/pub/P"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]잔고 (P)

<!-- request_field_count: 4 -->
<!-- response_field_count: 14 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외선물옵션시세(실시간) |
| API 페이지 | [실시간]잔고 |
| TR명 | [실시간]잔고 |
| TR코드 | `P` |
| 초당 전송 건수 | - |
| 설명 | 해외선물옵션 실시간 잔고 API 입니다.<br>주문 체결시 내역이 출력됩니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7071` |
| 모의투자 도메인 | `-` |
| URL | `/pub/P` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `token` | 토큰 | String | Y | 1000 | G/W 에서 발급하는 접근토큰 |
| Request Header | `tr_type` | TR 타입 | String | Y | 1 | 1: 실시간 시세 등록, 2: 실시간 시세 해제, 3: 계좌 등록 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래코드 | String | Y | 3 | 입력 X (계좌등록시 자동으로 출력) |
| Request Body | `tr_key` | 종목코드 | String | Y | 20 | 입력 X |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래코드 | String | Y | 3 | TR코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Curr` | 현재가 | String | Y | 12 | - |
| Response Body | `Code` | 종목코드 | String | Y | 16 | - |
| Response Body | `TickSize` | Tick Size | String | Y | 12 | - |
| Response Body | `TickValue` | Tick Value | String | Y | 12 | - |
| Response Body | `AdjustmentValue` | Adjust Value | String | Y | 12 | - |
| Response Body | `SellBuy` | 매도매수구분 | String | Y | 1 | 1:매수 2:매도 |
| Response Body | `NetPositionQty` | 잔고수량 | String | Y | 8 | - |
| Response Body | `AvailableQty` | 청산가능수량 | String | Y | 8 | - |
| Response Body | `PositionPrice` | 평균단가 | String | Y | 12 | - |
| Response Body | `EvaluatedPL` | 평가손익 | String | Y | 12 | - |
| Response Body | `GCurr` | 통화코드 | String | Y | 3 | - |
| Response Body | `PreNonePositionQty` | 전일잔고수량 | String | Y | 8 | - |
| Response Body | `PurchasePrice` | 총매입금액 | String | Y | 18 | 해당종목의 전체 매입금액 |

## 예제

### Request

```json
{
  "header": {
    "token": "{{ _.access_token }}",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "P"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "P"
  },
  "body": {
    "Code": "MESH24",
    "Curr": "5023.75",
    "AcntNo": "02065701975",
    "AcntNm": "testacnt",
    "TickSize": "0.25000000",
    "TickValue": "1.250000",
    "AdjustmentValue": "1.000000",
    "SellBuy": "1",
    "HsbgFlag": "",
    "NetPositionQty": "6",
    "AvailableQty": "6",
    "PositionPrice": "4983.16",
    "EvaluatedPL": "1217.500",
    "GCurr": "USD",
    "PreNonePositionQty": "5",
    "UserID": "dsfuture",
    "PurchasePrice": "29899.00"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
