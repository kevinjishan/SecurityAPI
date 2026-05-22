---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=b86989c1-9666-42d2-a446-492376f71f1b&api_id=1bf5ef83-606b-4b5d-a129-8a35e503aeee"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "장내채권시세"
api_id: "1bf5ef83-606b-4b5d-a129-8a35e503aeee"
api_name: "장내채권 호가 조회"
tr_id: "79cabfdd-a3de-46bd-b0bb-f7803fa72f2a"
tr_code: "BO_HOGA"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/krx-bond/inquiry/orderbook"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 장내채권 호가 조회 (BO_HOGA)

<!-- request_field_count: 8 -->
<!-- response_field_count: 43 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 장내채권시세 |
| API 페이지 | 장내채권 호가 조회 |
| TR명 | 장내채권 호가 조회 |
| TR코드 | `BO_HOGA` |
| 초당 전송 건수 | 2 |
| 설명 | 장내채권 호가조회 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/krx-bond/inquiry/orderbook` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB금융투자 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |
| Request Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부(Y:연속거래 사용 N:연속거래 사용안함) |
| Request Header | `cont_key` | 연속키 값 | String | N | 70 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | N | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `In` | In | Object | Y | - | - |
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | 소액:SB<br>일반:B |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 채권 종목코드 입력 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB금융투자 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Object | Y | - | - |
| Response Body | `-Askp1` | 매도호가1 | String | Y | 16 | - |
| Response Body | `-Askp2` | 매도호가2 | String | Y | 16 | - |
| Response Body | `-Askp3` | 매도호가3 | String | Y | 16 | - |
| Response Body | `-Askp4` | 매도호가4 | String | Y | 16 | - |
| Response Body | `-Askp5` | 매도호가5 | String | Y | 16 | - |
| Response Body | `-Bidp1` | 매수호가1 | String | Y | 16 | - |
| Response Body | `-Bidp2` | 매수호가2 | String | Y | 16 | - |
| Response Body | `-Bidp3` | 매수호가3 | String | Y | 16 | - |
| Response Body | `-Bidp4` | 매수호가4 | String | Y | 16 | - |
| Response Body | `-Bidp5` | 매수호가5 | String | Y | 16 | - |
| Response Body | `-AskpRsqn1` | 매도호가잔량1 | String | Y | 16 | - |
| Response Body | `-AskpRsqn2` | 매도호가잔량2 | String | Y | 16 | - |
| Response Body | `-AskpRsqn3` | 매도호가잔량3 | String | Y | 16 | - |
| Response Body | `-AskpRsqn4` | 매도호가잔량4 | String | Y | 16 | - |
| Response Body | `-AskpRsqn5` | 매도호가잔량5 | String | Y | 16 | - |
| Response Body | `-BidpRsqn1` | 매수호가잔량1 | String | Y | 16 | - |
| Response Body | `-BidpRsqn2` | 매수호가잔량2 | String | Y | 16 | - |
| Response Body | `-BidpRsqn3` | 매수호가잔량3 | String | Y | 16 | - |
| Response Body | `-BidpRsqn4` | 매수호가잔량4 | String | Y | 16 | - |
| Response Body | `-BidpRsqn5` | 매수호가잔량5 | String | Y | 16 | - |
| Response Body | `-BondSelnErt1` | 매도호가수익률1 | String | Y | 16 | - |
| Response Body | `-AskpRsqnIcdc1` | 매도호가잔량증감1 | String | Y | 16 | - |
| Response Body | `-AskpRsqnIcdc2` | 매도호가잔량증감2 | String | Y | 16 | - |
| Response Body | `-AskpRsqnIcdc3` | 매도호가잔량증감3 | String | Y | 16 | - |
| Response Body | `-AskpRsqnIcdc4` | 매도호가잔량증감4 | String | Y | 16 | - |
| Response Body | `-AskpRsqnIcdc5` | 매도호가잔량증감5 | String | Y | 16 | - |
| Response Body | `-BondShnuErt1` | 매수호가수익률1 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc1` | 매수호가잔량증감1 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc2` | 매수호가잔량증감2 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc3` | 매수호가잔량증감3 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc4` | 매수호가잔량증감4 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc5` | 매수호가잔량증감5 | String | Y | 16 | - |
| Response Body | `-TotalAskpRsqn` | 총매도호가잔량 | String | Y | 16 | - |
| Response Body | `-TotalBidpRsqn` | 총매수호가잔량 | String | Y | 16 | - |
| Response Body | `-Oprc` | 시가 | String | Y | 16 | - |
| Response Body | `-Hprc` | 고가 | String | Y | 16 | - |
| Response Body | `-Lprc` | 저가 | String | Y | 16 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-PrdyClpr` | 전일종가 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputIscd1": "KR101501DDC7",
    "InputCondMrktDivCode": "B"
  }
}
```

### Response

```json
{
  "Out": {
    "Askp1": "0.00",
    "Askp2": "0.00",
    "Askp3": "0.00",
    "Askp4": "0.00",
    "Askp5": "0.00",
    "Bidp1": "0.00",
    "Bidp2": "0.00",
    "Bidp3": "0.00",
    "Bidp4": "0.00",
    "Bidp5": "0.00",
    "AskpRsqn1": "0",
    "AskpRsqn2": "0",
    "AskpRsqn3": "0",
    "AskpRsqn4": "0",
    "AskpRsqn5": "0",
    "BidpRsqn1": "0",
    "BidpRsqn2": "0",
    "BidpRsqn3": "0",
    "BidpRsqn4": "0",
    "BidpRsqn5": "0",
    "BondSelnErt1": "0.000",
    "AskpRsqnIcdc1": "",
    "AskpRsqnIcdc2": "0.000",
    "AskpRsqnIcdc3": "0.000",
    "AskpRsqnIcdc4": "0.000",
    "AskpRsqnIcdc5": "0.000",
    "BondShnuErt1": "0.000",
    "BidpRsqnIcdc1": "",
    "BidpRsqnIcdc2": "0.000",
    "BidpRsqnIcdc3": "0.000",
    "BidpRsqnIcdc4": "0.000",
    "BidpRsqnIcdc5": "0.000",
    "TotalAskpRsqn": "0",
    "TotalBidpRsqn": "0",
    "Oprc": "0.00",
    "Hprc": "0.00",
    "Lprc": "0.00",
    "Prpr": "8939.50",
    "PrdyClpr": "8939.50"
  },
  "rsp_cd": "00000",
  "rsp_msg": "정상 처리 되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
