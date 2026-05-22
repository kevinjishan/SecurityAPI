---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=f1819725-95e6-4445-ad7f-aa1908b20b03&api_id=227bff3a-ef1f-41b5-aee7-13c034f1e1f8"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외선물옵션시세(실시간)"
api_id: "227bff3a-ef1f-41b5-aee7-13c034f1e1f8"
api_name: "[실시간]주문체결"
tr_id: "a95045d9-c19c-4206-8e2a-46e5ba88176e"
tr_code: "O"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7071"
path: "/pub/O"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]주문체결 (O)

<!-- request_field_count: 4 -->
<!-- response_field_count: 25 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외선물옵션시세(실시간) |
| API 페이지 | [실시간]주문체결 |
| TR명 | [실시간]주문체결 |
| TR코드 | `O` |
| 초당 전송 건수 | - |
| 설명 | 해외선물옵션 실시간 주문체결 API 입니다.<br>주문 체결시 내역이 출력됩니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7071` |
| 모의투자 도메인 | `-` |
| URL | `/pub/O` |
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
| Response Body | `OrderNo` | 주문번호 | String | Y | 10 | - |
| Response Body | `code` | 종목코드 | String | Y | 16 | - |
| Response Body | `OrderDate` | 주문일자 | String | Y | 8 | - |
| Response Body | `OrgOrderNo` | 원주문번호 | String | Y | 10 | - |
| Response Body | `OrgOrderDate` | 원주문일자 | String | Y | 8 | - |
| Response Body | `SellBuy` | 매도매수구분 | String | Y | 1 | 1:매수 2:매도 |
| Response Body | `OrderType` | 주문유형 | String | Y | 1 | - |
| Response Body | `OrderDurationType` | 주문구분 | String | Y | 1 | - |
| Response Body | `OrderDurationDate` | 유효일자 | String | Y | 8 | - |
| Response Body | `OrderQty` | 주문수량 | String | Y | 8 | - |
| Response Body | `OrderPrice` | 주문가격 | String | Y | 12 | - |
| Response Body | `WorkingQty` | 주문잔량 | String | Y | 8 | - |
| Response Body | `CancelQty` | 취소수량 | String | Y | 8 | - |
| Response Body | `ReplaceOrCancelQty` | 정정취소수량 | String | Y | 8 | - |
| Response Body | `OrderPlacedTime` | 주문시간 | String | Y | 14 | YYYYMMDDHHMISS |
| Response Body | `CumulativelyFilledQty` | 누적체결량 | String | Y | 8 | - |
| Response Body | `RejectMessage` | 주문거부메세지 | String | Y | 40 | - |
| Response Body | `DealID` | 체결번호 | String | Y | 10 | - |
| Response Body | `ExecutedTime` | 체결시간 | String | Y | 8 | - |
| Response Body | `DealPrice` | 체결가격 | String | Y | 12 | - |
| Response Body | `DealQty` | 체결수량 | String | Y | 8 | - |
| Response Body | `ServerOrderFee` | 수수료 | String | Y | 15 | - |
| Response Body | `ServerOrderPl` | 청산손익 | String | Y | 15 | - |
| Response Body | `OrderStatusCode` | 주문상태코드 | String | Y | 2 | 10 : 주문대기<br>11 : 주문<br>20 : 정정대기<br>21 : 정정<br>30 : 취소대기<br>31 : 취소 |

## 예제

### Request

```json
{
  "header": {
    "token": "{{ _.access_token }}",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "O"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "O",
    "tr_key": null
  },
  "body": {
    "code": "MGCM25",
    "OrderNo": "3406601",
    "OrderDate": "20250403",
    "OrgOrderNo": "",
    "OrgOrderDate": "",
    "SellBuy": "1",
    "OrderType": "2",
    "OrderDurationType": "0",
    "OrderDurationDate": "",
    "OrderQty": "1",
    "OrderPrice": "5068.0",
    "WorkingQty": "0",
    "CancelQty": "",
    "ReplaceOrCancelQty": "",
    "OrderPlacedTime": "20250403101248",
    "OrderStatusCode": "90",
    "CumulativelyFilledQty": "",
    "RejectMessage": "Order send error",
    "DealID": "",
    "ExecutedTime": "",
    "DealPrice": "",
    "DealQty": "",
    "ServerOrderFee": "",
    "ServerOrderPl": ""
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
