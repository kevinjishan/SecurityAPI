---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=548b70a6-24cc-4d9d-a7c7-90eb84a497f4&api_id=ceda2366-3b40-4545-ab21-ceeb65205d73"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세(실시간)"
api_id: "ceda2366-3b40-4545-ab21-ceeb65205d73"
api_name: "[실시간]KOSDAQ150옵션호가"
tr_id: "d412be65-e741-4607-a444-5a266a89581c"
tr_code: "OA1"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7070"
path: "/pub/OA1"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]KOSDAQ150옵션호가 (OA1)

<!-- request_field_count: 4 -->
<!-- response_field_count: 50 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세(실시간) |
| API 페이지 | [실시간]KOSDAQ150옵션호가 |
| TR명 | [실시간]KOSDAQ150옵션호가 |
| TR코드 | `OA1` |
| 초당 전송 건수 | - |
| 설명 | KOSDAQ150옵션 실시간 호가 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7070` |
| 모의투자 도메인 | `wss://openapi.dbsec.co.kr:17070` |
| URL | `/pub/OA1` |
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
| Request Body | `tr_cd` | 거래코드 | String | Y | 3 | TR코드입력: OA1 |
| Request Body | `tr_key` | 종목코드 | String | Y | 20 | KOSDAQ150옵션: SO<br>※ 종목분류코드 + KOSDAQ150옵션 종목코드 입력 (ex. SO206V5007) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래코드 | String | Y | 3 | TR코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `ShrnIscd` | 종목코드 | String | Y | 9 | - |
| Response Body | `BsopHour` | 호가시간 | String | Y | 6 | - |
| Response Body | `Askp1` | 1매도호가 | String | Y | 18 | - |
| Response Body | `Askp1Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp2` | 2매도호가 | String | Y | 18 | - |
| Response Body | `Askp2Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp3` | 3매도호가 | String | Y | 18 | - |
| Response Body | `Askp3Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp4` | 4매도호가 | String | Y | 18 | - |
| Response Body | `Askp4Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp5` | 5매도호가 | String | Y | 18 | - |
| Response Body | `Askp5Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp1` | 1매수호가 | String | Y | 18 | - |
| Response Body | `Bidp1Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp2` | 2매수호가 | String | Y | 18 | - |
| Response Body | `Bidp2Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp3` | 3매수호가 | String | Y | 18 | - |
| Response Body | `Bidp3Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp4` | 4매수호가 | String | Y | 18 | - |
| Response Body | `Bidp4Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp5` | 5매수호가 | String | Y | 18 | - |
| Response Body | `Bidp5Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpCsnu1` | 1매도호가 건수 | String | Y | 12 | - |
| Response Body | `AskpCsnu2` | 2매도호가 건수 | String | Y | 12 | - |
| Response Body | `AskpCsnu3` | 3매도호가 건수 | String | Y | 12 | - |
| Response Body | `AskpCsnu4` | 4매도호가 건수 | String | Y | 12 | - |
| Response Body | `AskpCsnu5` | 5매도호가 건수 | String | Y | 12 | - |
| Response Body | `BidpCsnu1` | 1매수호가 건수 | String | Y | 12 | - |
| Response Body | `BidpCsnu2` | 2매수호가 건수 | String | Y | 12 | - |
| Response Body | `BidpCsnu3` | 3매수호가 건수 | String | Y | 12 | - |
| Response Body | `BidpCsnu4` | 4매수호가 건수 | String | Y | 12 | - |
| Response Body | `BidpCsnu5` | 5매수호가 건수 | String | Y | 12 | - |
| Response Body | `AskpRsqn1` | 1매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn2` | 2매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn3` | 3매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn4` | 4매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn5` | 5매도호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn1` | 1매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn2` | 2매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn3` | 3매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn4` | 4매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn5` | 5매수호가 잔량 | String | Y | 18 | - |
| Response Body | `TotalAskpcsnu` | 총 매도호가 건수 | String | Y | 12 | - |
| Response Body | `TotalBidpcsnu` | 총 매수호가 건수 | String | Y | 12 | - |
| Response Body | `TotalAskprsqn` | 총 매도호가 잔량 | String | Y | 18 | - |
| Response Body | `TotalBidprsqn` | 총 매수호가 잔량 | String | Y | 18 | - |
| Response Body | `AntcCnpr` | 예상 체결 가격 | String | Y | 18 | - |
| Response Body | `AntcCnprclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AntcClscode` | 예상구분코드 | String | Y | 1 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "{{ _.access_token }}",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "OA1",
    "tr_key": "SO206V5007"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "OA1",
    "tr_key": null
  },
  "body": {
    "ShrnIscd": "206V5007",
    "BsopHour": "111942",
    "Askp1": "29.60",
    "Askp1Clr": "+",
    "Askp2": "30.40",
    "Askp2Clr": "+",
    "Askp3": "39.00",
    "Askp3Clr": "+",
    "Askp4": "0.00",
    "Askp4Clr": "-",
    "Askp5": "0.00",
    "Askp5Clr": "-",
    "Bidp1": "23.80",
    "Bidp1Clr": "+",
    "Bidp2": "22.80",
    "Bidp2Clr": "+",
    "Bidp3": "0.20",
    "Bidp3Clr": "-",
    "Bidp4": "0.00",
    "Bidp4Clr": "-",
    "Bidp5": "0.00",
    "Bidp5Clr": "-",
    "AskpCsnu1": "1",
    "AskpCsnu2": "1",
    "AskpCsnu3": "1",
    "AskpCsnu4": "0",
    "AskpCsnu5": "0",
    "BidpCsnu1": "1",
    "BidpCsnu2": "1",
    "BidpCsnu3": "1",
    "BidpCsnu4": "0",
    "BidpCsnu5": "0",
    "AskpRsqn1": "3",
    "AskpRsqn2": "3",
    "AskpRsqn3": "1",
    "AskpRsqn4": "0",
    "AskpRsqn5": "0",
    "BidpRsqn1": "3",
    "BidpRsqn2": "3",
    "BidpRsqn3": "20",
    "BidpRsqn4": "0",
    "BidpRsqn5": "0",
    "TotalAskpcsnu": "3",
    "TotalBidpcsnu": "3",
    "TotalAskprsqn": "7",
    "TotalBidprsqn": "26",
    "AntcCnpr": "0.00",
    "AntcCnprclr": "-",
    "AntcClscode": "0"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
