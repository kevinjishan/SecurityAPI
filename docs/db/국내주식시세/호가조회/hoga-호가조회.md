---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=14be0244-5a65-4219-9639-f32d6ec3f374"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "14be0244-5a65-4219-9639-f32d6ec3f374"
api_name: "호가조회"
tr_id: "12248529-d9e0-4f18-9011-59b95d865420"
tr_code: "HOGA"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/orderbook"
content_type: "application/json;charset=utf-8"
rate_limit: "3"
auth_required: true
---

# 호가조회 (HOGA)

<!-- request_field_count: 8 -->
<!-- response_field_count: 34 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 호가조회 |
| TR명 | 호가조회 |
| TR코드 | `HOGA` |
| 초당 전송 건수 | 3 |
| 설명 | 국내주식 호가 조회 API입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/orderbook` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | 주식:J<br>주식(NXT): NJ<br>주식(통합): UJ<br>ETN: EN<br>ELW: W<br>※ ETF종목의 경우 J 코드를 사용해 조회 부탁드립니다. |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 종목코드 입력 <br> - J(KRX 주식): (ex. 005930)<br> - NJ(NXT 주식): (ex. N-005930)<br> - UJ(통합): (ex. U-005930)<br>※ NXT/통합시세로 종목 조회 시 반드시 종목 앞에 구분자 (N-, U-)를 붙여서 호출 부탁드리겠습니다. |

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
| Response Body | `-AskpRsqnIcdc1` | 매도호가잔량증감1 | String | Y | 16 | - |
| Response Body | `-AskpRsqnIcdc2` | 매도호가잔량증감2 | String | Y | 16 | - |
| Response Body | `-AskpRsqnIcdc3` | 매도호가잔량증감3 | String | Y | 16 | - |
| Response Body | `-AskpRsqnIcdc4` | 매도호가잔량증감4 | String | Y | 16 | - |
| Response Body | `-AskpRsqnIcdc5` | 매도호가잔량증감5 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc1` | 매수호가잔량증감1 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc2` | 매수호가잔량증감2 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc3` | 매수호가잔량증감3 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc4` | 매수호가잔량증감4 | String | Y | 16 | - |
| Response Body | `-BidpRsqnIcdc5` | 매수호가잔량증감5 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputIscd1": "005930",
    "InputCondMrktDivCode": "J"
  }
}
```

### Response

```json
{
  "Out": {
    "Askp1": "74300",
    "Askp2": "74400",
    "Askp3": "74500",
    "Askp4": "74600",
    "Askp5": "74700",
    "Bidp1": "74200",
    "Bidp2": "74100",
    "Bidp3": "74000",
    "Bidp4": "73900",
    "Bidp5": "73800",
    "AskpRsqn1": "88722",
    "AskpRsqn2": "133085",
    "AskpRsqn3": "79821",
    "AskpRsqn4": "119539",
    "AskpRsqn5": "86715",
    "BidpRsqn1": "77736",
    "BidpRsqn2": "84894",
    "BidpRsqn3": "150757",
    "BidpRsqn4": "175015",
    "BidpRsqn5": "121979",
    "AskpRsqnIcdc1": "0",
    "AskpRsqnIcdc2": "0",
    "AskpRsqnIcdc3": "0",
    "AskpRsqnIcdc4": "0",
    "AskpRsqnIcdc5": "0",
    "BidpRsqnIcdc1": "0",
    "BidpRsqnIcdc2": "0",
    "BidpRsqnIcdc3": "0",
    "BidpRsqnIcdc4": "0",
    "BidpRsqnIcdc5": "-5"
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
