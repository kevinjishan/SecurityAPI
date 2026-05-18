---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cd909627-82e5-40c9-b313-1a8fd2d7b119&api_id=d67d0790-4b26-447b-82eb-e9642f66057c"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "실시간 시세 투자정보"
api_id: "d67d0790-4b26-447b-82eb-e9642f66057c"
api_name: "[실시간 시세 투자정보] 투자정보"
tr_id: "2b0au583-15ar-bkry-wvly-3p35c0u603iz"
tr_code: "CUR"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/investinfo"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 현물정보USD실시간 (CUR)

<!-- request_field_count: 4 -->
<!-- response_field_count: 13 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 실시간 시세 투자정보 |
| API 페이지 | [실시간 시세 투자정보] 투자정보 |
| TR명 | 현물정보USD실시간 |
| TR코드 | `CUR` |
| 초당 전송 건수 | - |
| 설명 | 투자정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/investinfo` |
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
| Response Body | `time` | 전송시간 | String | Y | 6 | - |
| Response Body | `offer` | 매도호가 | String | Y | 7.2 | - |
| Response Body | `bid` | 매수호가 | String | Y | 7.2 | - |
| Response Body | `open` | 시가 | String | Y | 7.2 | - |
| Response Body | `high` | 고가 | String | Y | 7.2 | - |
| Response Body | `low` | 저가 | String | Y | 7.2 | - |
| Response Body | `price` | 체결가 | String | Y | 7.2 | - |
| Response Body | `sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `change` | 전일대비 | String | Y | 7.2 | - |
| Response Body | `drate` | 등락율 | String | Y | 7.2 | - |
| Response Body | `ctime` | 데이타발생시간 | String | Y | 6 | - |
| Response Body | `base_id` | 기초자산ID | String | Y | 6 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImRmYzQ2NThiLTQ3NmItNGQ4MS05OGM3LTI3NzlmNDhjMGZkZiIsIm5iZiI6MTY4NzM5MTEwOSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg3NDcxMTk5LCJpYXQiOjE2ODczOTExMDksImp0aSI6IlBTMzA3em5Jd2ZMSWxXR1Bhbm1SN2ZtMzl2NXRDbWYydWFPWCJ9.mZK8YsM8NNT-5-1Q7uPi1Xjnx9J-P_eRgn2fHCpMtT5CaXK7fu94xeR5iMGqhhTCW3W08IUUG0ixH01IOULtkg",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "CUR",
    "tr_key": "USD   "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "CUR",
    "tr_key": "USD   "
  },
  "body": {
    "offer": "1318.40",
    "high": "1326.40",
    "drate": "-0.64",
    "low": "1315.50",
    "base_id": "USD",
    "price": "1318.20",
    "change": "-8.50",
    "sign": "5",
    "ctime": "152956",
    "time": "152959",
    "bid": "1318.30",
    "open": "1326.00"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
