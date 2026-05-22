---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "90214c0f-6aee-4dba-bdeb-2caa8029ed7d"
tr_code: "AFR"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# API사용자조건검색실시간 (AFR)

<!-- request_field_count: 4 -->
<!-- response_field_count: 9 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | API사용자조건검색실시간 |
| TR코드 | `AFR` |
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
| Request Body | `tr_key` | 사용자구분키 | String | N | 11 | t1860 TR의 t1860OutBlock. sAlertNum (실시간키) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `gsCode` | 종목코드 | String | Y | 9 | - |
| Response Body | `gshname` | 종목명 | String | Y | 40 | - |
| Response Body | `gsPrice` | 현재가 | String | Y | 8 | - |
| Response Body | `gsSign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `gsChange` | 전일대비 | String | Y | 8 | - |
| Response Body | `gsChgRate` | 등락율 | String | Y | 6 | - |
| Response Body | `gsVolume` | 거래량 | String | Y | 9 | - |
| Response Body | `gsJobFlag` | 종목상태 | String | Y | 1 | N:진입 R:재진입 O:이탈 |

## 예제

### Request

```json
{
  "header": {
    "token": "토큰값",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "AFR",
    "tr_key": "실시간키"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "AFR",
    "tr_key": "실시간키"
  },
  "body": {
    "gsJobFlag": "O",
    "gsVolume": "3432360",
    "gsPrice": "2435",
    "gsSign": "2",
    "gshname": "HB테크놀러지",
    "gsChange": "45",
    "gsChgRate": "1.88",
    "gsCode": "078150"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
