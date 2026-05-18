---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "f7c46d73-fdd5-4b41-b428-d28f8bcfbc79"
tr_code: "UBM"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (통합) 업종별투자자별매매현황 (UBM)

<!-- request_field_count: 4 -->
<!-- response_field_count: 13 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (통합) 업종별투자자별매매현황 |
| TR코드 | `UBM` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 4 | U + 업종코드 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `tjjcode` | 투자자코드 | String | Y | 4 | - |
| Response Body | `tjjtime` | 수신시간 | String | Y | 8 | - |
| Response Body | `msvolume` | 매수거래량 | Number | Y | 8 | - |
| Response Body | `mdvolume` | 매도거래량 | Number | Y | 8 | - |
| Response Body | `msvol` | 거래량순매수 | Number | Y | 8 | - |
| Response Body | `p_msvol` | 거래량순매수직전대비 | Number | Y | 8 | - |
| Response Body | `msvalue` | 매수거래대금 | Number | Y | 6 | - |
| Response Body | `mdvalue` | 매도거래대금 | Number | Y | 6 | - |
| Response Body | `msval` | 거래대금순매수 | Number | Y | 6 | - |
| Response Body | `p_msval` | 거래대금순매수직전대비 | Number | Y | 6 | - |
| Response Body | `upcode` | 업종코드 | String | Y | 3 | - |
| Response Body | `ex_upcode` | 거래소별업종코드 | String | Y | 4 | - |

## 예제

### Request

```text
{
 "header": {
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImNkMzdiY2FmLTUwMjAtNGY2Yy1hYzM3LTcxY2JhZjc2MGE2OCIsIm5iZiI6MTc0Mjg2MTM0OSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQyOTQwMDAwLCJpYXQiOjE3NDI4NjEzNDksImp0aSI6IlBTVXJIa0pWaWVRMzhMREN5NkVVNUpCNWlmV1gzRDhwRlBKcSJ9.KpX1lQQIs4W2HdQIHdJDuJ1AWaYH69soejsKkJFv_8bF4jnlocMJsushvYbesrs2BM2evkz7",
  "tr_type": "3"
 },
 "body": {
  "tr_cd": "UBM",
  "tr_key": "U001"
 }

```

### Response

```json
{
  "header": {
    "tr_cd": "UBM",
    "tr_key": "U001"
  },
  "body": {
    "p_msval": "0",
    "tjjtime": "17103000",
    "p_msvol": "0",
    "mdvalue": "219",
    "msvolume": "1380",
    "upcode": "001",
    "ex_upcode": "U001",
    "tjjcode": "0010",
    "msvalue": "184",
    "mdvolume": "1510",
    "msvol": "-130",
    "msval": "-34"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
