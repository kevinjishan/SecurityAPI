---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80d95623-7135-481b-b109-d7370f1a261b&api_id=0ecec614-4830-4a7c-a0a0-7ba65cb54f3d"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세"
api_id: "0ecec614-4830-4a7c-a0a0-7ba65cb54f3d"
api_name: "호가조회"
tr_id: "5d50eeec-3ee0-4b2b-8204-735dc2d9f93f"
tr_code: "HOGA"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-futureoption/inquiry/orderbook"
content_type: "application/json;charset=utf-8"
rate_limit: "5"
auth_required: true
---

# 호가조회 (HOGA)

<!-- request_field_count: 8 -->
<!-- response_field_count: 34 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세 |
| API 페이지 | 호가조회 |
| TR명 | 호가조회 |
| TR코드 | `HOGA` |
| 초당 전송 건수 | 5 |
| 설명 | 국내선물옵션 호가 조회 API입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-futureoption/inquiry/orderbook` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | F  : 지수선물<br>JF : 주식선물 <br>KF : 미니선물<br>CF : 상품선물<br>XF : 섹터선물<br>CM : 야간선물<br>O  : 지수옵션<br>JO : 주식옵션<br>KO : 미니옵션<br>WO : K200위클리옵션<br>EU : 야간옵션<br>SO: 코스닥 150옵션 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 종목코드 입력 ex. 005930 |

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
    "InputIscd1": "101V3000",
    "InputCondMrktDivCode": "F"
  }
}
```

### Response

```json
{
  "Out": {
    "Askp1": "352.15",
    "Askp2": "352.20",
    "Askp3": "352.25",
    "Askp4": "352.30",
    "Askp5": "352.35",
    "Bidp1": "352.10",
    "Bidp2": "352.05",
    "Bidp3": "352.00",
    "Bidp4": "351.95",
    "Bidp5": "351.90",
    "AskpRsqn1": "18",
    "AskpRsqn2": "384",
    "AskpRsqn3": "141",
    "AskpRsqn4": "28",
    "AskpRsqn5": "32",
    "BidpRsqn1": "43",
    "BidpRsqn2": "82",
    "BidpRsqn3": "86",
    "BidpRsqn4": "127",
    "BidpRsqn5": "315",
    "AskpRsqnIcdc1": "18",
    "AskpRsqnIcdc2": "259",
    "AskpRsqnIcdc3": "50",
    "AskpRsqnIcdc4": "-71",
    "AskpRsqnIcdc5": "-32",
    "BidpRsqnIcdc1": "-39",
    "BidpRsqnIcdc2": "44",
    "BidpRsqnIcdc3": "11",
    "BidpRsqnIcdc4": "39",
    "BidpRsqnIcdc5": "148"
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
