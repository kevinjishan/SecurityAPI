---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "fwwkp60n-z431-7q2h-u847-lgx43tud56wo"
tr_code: "JH0"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 주식선물호가 (JH0)

<!-- request_field_count: 4 -->
<!-- response_field_count: 69 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | 주식선물호가 |
| TR코드 | `JH0` |
| 초당 전송 건수 | - |
| 설명 | 선물옵션 주문현황 및 시세, 투자정보를 실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/futureoption` |
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
| Response Body | `futcode` | 단축코드 | String | Y | 8 | - |
| Response Body | `hotime` | 호가시간 | String | Y | 6 | - |
| Response Body | `offerho1` | 매도호가1 | String | Y | 10 | - |
| Response Body | `bidho1` | 매수호가1 | String | Y | 10 | - |
| Response Body | `offerrem1` | 매도호가수량1 | String | Y | 7 | - |
| Response Body | `bidrem1` | 매수호가수량1 | String | Y | 7 | - |
| Response Body | `offercnt1` | 매도호가건수1 | String | Y | 5 | - |
| Response Body | `bidcnt1` | 매수호가건수1 | String | Y | 5 | - |
| Response Body | `offerho2` | 매도호가2 | String | Y | 10 | - |
| Response Body | `bidho2` | 매수호가2 | String | Y | 10 | - |
| Response Body | `offerrem2` | 매도호가수량2 | String | Y | 7 | - |
| Response Body | `bidrem2` | 매수호가수량2 | String | Y | 7 | - |
| Response Body | `offercnt2` | 매도호가건수2 | String | Y | 5 | - |
| Response Body | `bidcnt2` | 매수호가건수2 | String | Y | 5 | - |
| Response Body | `offerho3` | 매도호가3 | String | Y | 10 | - |
| Response Body | `bidho3` | 매수호가3 | String | Y | 10 | - |
| Response Body | `offerrem3` | 매도호가수량3 | String | Y | 7 | - |
| Response Body | `bidrem3` | 매수호가수량3 | String | Y | 7 | - |
| Response Body | `offercnt3` | 매도호가건수3 | String | Y | 5 | - |
| Response Body | `bidcnt3` | 매수호가건수3 | String | Y | 5 | - |
| Response Body | `offerho4` | 매도호가4 | String | Y | 10 | - |
| Response Body | `bidho4` | 매수호가4 | String | Y | 10 | - |
| Response Body | `offerrem4` | 매도호가수량4 | String | Y | 7 | - |
| Response Body | `bidrem4` | 매수호가수량4 | String | Y | 7 | - |
| Response Body | `offercnt4` | 매도호가건수4 | String | Y | 5 | - |
| Response Body | `bidcnt4` | 매수호가건수4 | String | Y | 5 | - |
| Response Body | `offerho5` | 매도호가5 | String | Y | 10 | - |
| Response Body | `bidho5` | 매수호가5 | String | Y | 10 | - |
| Response Body | `offerrem5` | 매도호가수량5 | String | Y | 7 | - |
| Response Body | `bidrem5` | 매수호가수량5 | String | Y | 7 | - |
| Response Body | `offercnt5` | 매도호가건수5 | String | Y | 5 | - |
| Response Body | `bidcnt5` | 매수호가건수5 | String | Y | 5 | - |
| Response Body | `offerho6` | 매도호가6 | String | Y | 10 | - |
| Response Body | `bidho6` | 매수호가6 | String | Y | 10 | - |
| Response Body | `offerrem6` | 매도호가수량6 | String | Y | 7 | - |
| Response Body | `bidrem6` | 매수호가수량6 | String | Y | 7 | - |
| Response Body | `offercnt6` | 매도호가건수6 | String | Y | 5 | - |
| Response Body | `bidcnt6` | 매수호가건수6 | String | Y | 5 | - |
| Response Body | `offerho7` | 매도호가7 | String | Y | 10 | - |
| Response Body | `bidho7` | 매수호가7 | String | Y | 10 | - |
| Response Body | `offerrem7` | 매도호가수량7 | String | Y | 7 | - |
| Response Body | `bidrem7` | 매수호가수량7 | String | Y | 7 | - |
| Response Body | `offercnt7` | 매도호가건수7 | String | Y | 5 | - |
| Response Body | `bidcnt7` | 매수호가건수7 | String | Y | 5 | - |
| Response Body | `offerho8` | 매도호가8 | String | Y | 10 | - |
| Response Body | `bidho8` | 매수호가8 | String | Y | 10 | - |
| Response Body | `offerrem8` | 매도호가수량8 | String | Y | 7 | - |
| Response Body | `bidrem8` | 매수호가수량8 | String | Y | 7 | - |
| Response Body | `offercnt8` | 매도호가건수8 | String | Y | 5 | - |
| Response Body | `bidcnt8` | 매수호가건수8 | String | Y | 5 | - |
| Response Body | `offerho9` | 매도호가9 | String | Y | 10 | - |
| Response Body | `bidho9` | 매수호가9 | String | Y | 10 | - |
| Response Body | `offerrem9` | 매도호가수량9 | String | Y | 7 | - |
| Response Body | `bidrem9` | 매수호가수량9 | String | Y | 7 | - |
| Response Body | `offercnt9` | 매도호가건수9 | String | Y | 5 | - |
| Response Body | `bidcnt9` | 매수호가건수9 | String | Y | 5 | - |
| Response Body | `offerho10` | 매도호가10 | String | Y | 10 | - |
| Response Body | `bidho10` | 매수호가10 | String | Y | 10 | - |
| Response Body | `offerrem10` | 매도호가수량10 | String | Y | 7 | - |
| Response Body | `bidrem10` | 매수호가수량10 | String | Y | 7 | - |
| Response Body | `offercnt10` | 매도호가건수10 | String | Y | 5 | - |
| Response Body | `bidcnt10` | 매수호가건수10 | String | Y | 5 | - |
| Response Body | `totofferrem` | 매도호가총수량 | String | Y | 8 | - |
| Response Body | `totbidrem` | 매수호가총수량 | String | Y | 8 | - |
| Response Body | `totoffercnt` | 매도호가총건수 | String | Y | 5 | - |
| Response Body | `totbidcnt` | 매수호가총건수 | String | Y | 5 | - |
| Response Body | `danhochk` | 단일가호가여부 | String | Y | 1 | - |
| Response Body | `alloc_gubun` | 배분적용구분 | String | Y | 1 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "JH0",
    "tr_key": "111T7000"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "JH0",
    "tr_key": "111T7000"
  },
  "body": {
    "offerho4": "72000",
    "futcode": "111T7000",
    "offerho3": "71900",
    "offerho6": "72200",
    "offerho5": "72100",
    "offerho8": "72400",
    "offerho7": "72300",
    "offerho9": "72500",
    "bidcnt10": "36",
    "bidcnt9": "41",
    "bidcnt8": "42",
    "bidcnt7": "92",
    "bidcnt6": "82",
    "bidcnt5": "92",
    "bidcnt4": "57",
    "bidcnt3": "68",
    "bidcnt2": "57",
    "bidcnt1": "40",
    "danhochk": "0",
    "hotime": "143130",
    "offerho2": "71800",
    "offerho1": "71700",
    "offercnt9": "38",
    "offercnt7": "42",
    "offercnt8": "43",
    "offercnt5": "64",
    "offercnt6": "57",
    "offercnt3": "84",
    "offercnt4": "76",
    "offercnt1": "38",
    "offercnt2": "101",
    "offerho10": "72600",
    "offercnt10": "28",
    "totofferrem": "267689",
    "totbidrem": "231253",
    "offerrem2": "27856",
    "bidho5": "71200",
    "offerrem3": "33820",
    "bidho4": "71300",
    "offerrem4": "30908",
    "bidho7": "71000",
    "offerrem5": "20042",
    "bidho6": "71100",
    "bidho9": "70800",
    "bidho8": "70900",
    "offerrem1": "13361",
    "totoffercnt": "843",
    "offerrem6": "10994",
    "totbidcnt": "796",
    "offerrem7": "9785",
    "offerrem8": "9703",
    "offerrem9": "9019",
    "bidrem3": "21544",
    "bidrem4": "21879",
    "bidrem1": "8245",
    "bidrem2": "23580",
    "bidrem9": "14890",
    "bidho1": "71600",
    "bidrem7": "18123",
    "bidrem8": "14104",
    "bidho3": "71400",
    "bidrem5": "17781",
    "bidho2": "71500",
    "bidrem6": "19349",
    "bidrem10": "13765",
    "bidho10": "70700",
    "alloc_gubun": "",
    "offerrem10": "7281"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
