---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "1x6v03nd-8q12-500i-ip58-7x0272qv1wzm"
tr_code: "H1_"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSPI호가잔량 (H1_)

<!-- request_field_count: 4 -->
<!-- response_field_count: 53 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | KOSPI호가잔량 |
| TR코드 | `H1_` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 8 | 단축코드 6자리 또는 8자리 (단건, 연속), (계좌등록/해제 일 경우 필수값 아님) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `hotime` | 호가시간 | String | Y | 6 | - |
| Response Body | `offerho1` | 매도호가1 | String | Y | 7 | - |
| Response Body | `bidho1` | 매수호가1 | String | Y | 7 | - |
| Response Body | `offerrem1` | 매도호가잔량1 | String | Y | 9 | - |
| Response Body | `bidrem1` | 매수호가잔량1 | String | Y | 9 | - |
| Response Body | `offerho2` | 매도호가2 | String | Y | 7 | - |
| Response Body | `bidho2` | 매수호가2 | String | Y | 7 | - |
| Response Body | `offerrem2` | 매도호가잔량2 | String | Y | 9 | - |
| Response Body | `bidrem2` | 매수호가잔량2 | String | Y | 9 | - |
| Response Body | `offerho3` | 매도호가3 | String | Y | 7 | - |
| Response Body | `bidho3` | 매수호가3 | String | Y | 7 | - |
| Response Body | `offerrem3` | 매도호가잔량3 | String | Y | 9 | - |
| Response Body | `bidrem3` | 매수호가잔량3 | String | Y | 9 | - |
| Response Body | `offerho4` | 매도호가4 | String | Y | 7 | - |
| Response Body | `bidho4` | 매수호가4 | String | Y | 7 | - |
| Response Body | `offerrem4` | 매도호가잔량4 | String | Y | 9 | - |
| Response Body | `bidrem4` | 매수호가잔량4 | String | Y | 9 | - |
| Response Body | `offerho5` | 매도호가5 | String | Y | 7 | - |
| Response Body | `bidho5` | 매수호가5 | String | Y | 7 | - |
| Response Body | `offerrem5` | 매도호가잔량5 | String | Y | 9 | - |
| Response Body | `bidrem5` | 매수호가잔량5 | String | Y | 9 | - |
| Response Body | `offerho6` | 매도호가6 | String | Y | 7 | - |
| Response Body | `bidho6` | 매수호가6 | String | Y | 7 | - |
| Response Body | `offerrem6` | 매도호가잔량6 | String | Y | 9 | - |
| Response Body | `bidrem6` | 매수호가잔량6 | String | Y | 9 | - |
| Response Body | `offerho7` | 매도호가7 | String | Y | 7 | - |
| Response Body | `bidho7` | 매수호가7 | String | Y | 7 | - |
| Response Body | `offerrem7` | 매도호가잔량7 | String | Y | 9 | - |
| Response Body | `bidrem7` | 매수호가잔량7 | String | Y | 9 | - |
| Response Body | `offerho8` | 매도호가8 | String | Y | 7 | - |
| Response Body | `bidho8` | 매수호가8 | String | Y | 7 | - |
| Response Body | `offerrem8` | 매도호가잔량8 | String | Y | 9 | - |
| Response Body | `bidrem8` | 매수호가잔량8 | String | Y | 9 | - |
| Response Body | `offerho9` | 매도호가9 | String | Y | 7 | - |
| Response Body | `bidho9` | 매수호가9 | String | Y | 7 | - |
| Response Body | `offerrem9` | 매도호가잔량9 | String | Y | 9 | - |
| Response Body | `bidrem9` | 매수호가잔량9 | String | Y | 9 | - |
| Response Body | `offerho10` | 매도호가10 | String | Y | 7 | - |
| Response Body | `bidho10` | 매수호가10 | String | Y | 7 | - |
| Response Body | `offerrem10` | 매도호가잔량10 | String | Y | 9 | - |
| Response Body | `bidrem10` | 매수호가잔량10 | String | Y | 9 | - |
| Response Body | `totofferrem` | 총매도호가잔량 | String | Y | 9 | - |
| Response Body | `totbidrem` | 총매수호가잔량 | String | Y | 9 | - |
| Response Body | `donsigubun` | 동시호가구분 | String | Y | 1 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 6 | - |
| Response Body | `alloc_gubun` | 배분적용구분 | String | Y | 1 | - |
| Response Body | `volume` | 누적거래량 | String | Y | 12 | - |
| Response Body | `midprice` | 중간가격 | String | Y | 8 | - |
| Response Body | `offermidsumrem` | 매도중간가잔량합계수량 | String | Y | 9 | - |
| Response Body | `bidmidsumrem` | 매수중간가잔량합계수량 | String | Y | 9 | - |
| Response Body | `midsumrem` | 중간가잔량합계수량 | String | Y | 9 | - |
| Response Body | `midsumremgubun` | 중간가잔량구분 | String | Y | 1 | ' '없음<br>'1'매도<br>'2'매수 |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6Ijk5NGZkNjI5LWY4OGItNGQ0Ni05NTE0LTJjNmQzMjM1MWIyYSIsIm5iZiI6MTY4NjY0MDc3NywiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzI3MTc3LCJpYXQiOjE2ODY2NDA3NzcsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.WT1pgGw-gawv2GAQiRNcEphlv3BfXZfeVG03wwBCoCKpUYYC0l019Oc0JJIqoR41WHm8kEuNgDgYhlib_LxI7g",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "H1_",
    "tr_key": "005930"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "H1_",
    "tr_key": "005930"
  },
  "body": {
    "offerrem2": "66102",
    "offerho4": "0",
    "bidho5": "0",
    "offerho3": "72600",
    "offerrem3": "74102",
    "bidho4": "0",
    "offerrem4": "0",
    "offerho6": "0",
    "bidho7": "0",
    "offerho5": "0",
    "offerrem5": "0",
    "bidho6": "0",
    "offerho8": "0",
    "bidho9": "0",
    "offerho7": "0",
    "bidho8": "0",
    "offerrem1": "32616",
    "offerho9": "0",
    "offerrem6": "0",
    "offerrem7": "0",
    "donsigubun": "3",
    "offerrem8": "0",
    "offerrem9": "0",
    "bidrem3": "156534",
    "bidrem4": "0",
    "bidrem1": "70581",
    "bidrem2": "100447",
    "bidrem9": "0",
    "bidho1": "72300",
    "bidrem7": "0",
    "bidrem8": "0",
    "hotime": "084242",
    "offerho2": "72500",
    "bidho3": "72100",
    "bidrem5": "0",
    "offerho1": "72400",
    "bidho2": "72200",
    "bidrem6": "0",
    "bidrem10": "0",
    "bidho10": "0",
    "shcode": "005930",
    "alloc_gubun": "",
    "volume": "136",
    "offerho10": "0",
    "offerrem10": "0",
    "totofferrem": "0",
    "totbidrem": "0"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
