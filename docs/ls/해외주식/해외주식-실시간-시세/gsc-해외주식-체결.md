---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cdb7e1bc-f7c5-425c-8248-aa83dbb6919f&api_id=0c023f96-5137-48cf-8682-8dd30bbc81be"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식"
api_id: "0c023f96-5137-48cf-8682-8dd30bbc81be"
api_name: "[해외주식] 실시간 시세"
tr_id: "fb82371e-2d73-4ec0-909e-e56772e24660"
tr_code: "GSC"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/overseas-stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 해외주식 체결 (GSC)

<!-- request_field_count: 4 -->
<!-- response_field_count: 20 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식 |
| API 페이지 | [해외주식] 실시간 시세 |
| TR명 | 해외주식 체결 |
| TR코드 | `GSC` |
| 초당 전송 건수 | - |
| 설명 | 해외주식 주문현황 및 시세정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/overseas-stock` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 18 | Key 종목코드 + 18자리에서 남은 자릿수만큼 공백<br>ex) '82TSLA            ' <br>'82TSLA' + 공백 12자리 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `symbol` | 종목코드 | String | Y | 16 | - |
| Response Body | `ovsdate` | 체결일자(현지) | String | Y | 8 | - |
| Response Body | `kordate` | 체결일자(한국) | String | Y | 8 | - |
| Response Body | `trdtm` | 체결시간(현지) | String | Y | 6 | - |
| Response Body | `kortm` | 체결시간(한국) | String | Y | 6 | - |
| Response Body | `sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `price` | 체결가격 | String | Y | 15.6 | - |
| Response Body | `diff` | 전일대비 | String | Y | 15.6 | - |
| Response Body | `rate` | 등락율 | String | Y | 6.2 | - |
| Response Body | `open` | 시가 | String | Y | 15.6 | - |
| Response Body | `high` | 고가 | String | Y | 15.6 | - |
| Response Body | `low` | 저가 | String | Y | 15.6 | - |
| Response Body | `trdq` | 건별체결수량 | String | Y | 10 | - |
| Response Body | `totq` | 누적체결수량 | String | Y | 15 | - |
| Response Body | `cgubun` | 체결구분 | String | Y | 1 | - |
| Response Body | `lSeq` | 초당시퀀스 | String | Y | 3 | - |
| Response Body | `amount` | 누적거래대금 | String | Y | 16 | - |
| Response Body | `high52p` | 52주고가 | String | Y | 15.6 | - |
| Response Body | `low52p` | 52주저가 | String | Y | 15.6 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "토큰",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "GSC",
    "tr_key": "81SOXL            "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "GSC",
    "tr_key": "81SOXL            "
  },
  "body": {
    "symbol": "SOXL",
    "lSeq": "0",
    "high52p": "70.0800",
    "low52p": "7.2250",
    "amount": "7771791",
    "kordate": "20250429",
    "trdtm": "044222",
    "sign": "5",
    "ovsdate": "20250429",
    "diff": "0.0800",
    "totq": "637963",
    "high": "12.3000",
    "rate": "-0.65",
    "low": "12.1000",
    "price": "12.2100",
    "cgubun": "+",
    "trdq": "16",
    "open": "12.3000",
    "kortm": "174222"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
