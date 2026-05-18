---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "cb01a6c6-242f-456d-a7fe-7a0dccad0ce8"
tr_code: "NH1"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (NXT)호가잔량 (NH1)

<!-- request_field_count: 4 -->
<!-- response_field_count: 54 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (NXT)호가잔량 |
| TR코드 | `NH1` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 10 | 단축코드 7자리 + 공백 3자리 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `hotime` | 호가시간 | String | Y | 6 | - |
| Response Body | `offerho1` | 매도호가1 | Number | Y | 7 | - |
| Response Body | `bidho1` | 매수호가1 | Number | Y | 7 | - |
| Response Body | `offerrem1` | 매도호가잔량1 | Number | Y | 9 | - |
| Response Body | `bidrem1` | 매수호가잔량1 | Number | Y | 9 | - |
| Response Body | `offerho2` | 매도호가2 | Number | Y | 7 | - |
| Response Body | `bidho2` | 매수호가2 | Number | Y | 7 | - |
| Response Body | `offerrem2` | 매도호가잔량2 | Number | Y | 9 | - |
| Response Body | `bidrem2` | 매수호가잔량2 | Number | Y | 9 | - |
| Response Body | `offerho3` | 매도호가3 | Number | Y | 7 | - |
| Response Body | `bidho3` | 매수호가3 | Number | Y | 7 | - |
| Response Body | `offerrem3` | 매도호가잔량3 | Number | Y | 9 | - |
| Response Body | `bidrem3` | 매수호가잔량3 | Number | Y | 9 | - |
| Response Body | `offerho4` | 매도호가4 | Number | Y | 7 | - |
| Response Body | `bidho4` | 매수호가4 | Number | Y | 7 | - |
| Response Body | `offerrem4` | 매도호가잔량4 | Number | Y | 9 | - |
| Response Body | `bidrem4` | 매수호가잔량4 | Number | Y | 9 | - |
| Response Body | `offerho5` | 매도호가5 | Number | Y | 7 | - |
| Response Body | `bidho5` | 매수호가5 | Number | Y | 7 | - |
| Response Body | `offerrem5` | 매도호가잔량5 | Number | Y | 9 | - |
| Response Body | `bidrem5` | 매수호가잔량5 | Number | Y | 9 | - |
| Response Body | `offerho6` | 매도호가6 | Number | Y | 7 | - |
| Response Body | `bidho6` | 매수호가6 | Number | Y | 7 | - |
| Response Body | `offerrem6` | 매도호가잔량6 | Number | Y | 9 | - |
| Response Body | `bidrem6` | 매수호가잔량6 | Number | Y | 9 | - |
| Response Body | `offerho7` | 매도호가7 | Number | Y | 7 | - |
| Response Body | `bidho7` | 매수호가7 | Number | Y | 7 | - |
| Response Body | `offerrem7` | 매도호가잔량7 | Number | Y | 9 | - |
| Response Body | `bidrem7` | 매수호가잔량7 | Number | Y | 9 | - |
| Response Body | `offerho8` | 매도호가8 | Number | Y | 7 | - |
| Response Body | `bidho8` | 매수호가8 | Number | Y | 7 | - |
| Response Body | `offerrem8` | 매도호가잔량8 | Number | Y | 9 | - |
| Response Body | `bidrem8` | 매수호가잔량8 | Number | Y | 9 | - |
| Response Body | `offerho9` | 매도호가9 | Number | Y | 7 | - |
| Response Body | `bidho9` | 매수호가9 | Number | Y | 7 | - |
| Response Body | `offerrem9` | 매도호가잔량9 | Number | Y | 9 | - |
| Response Body | `bidrem9` | 매수호가잔량9 | Number | Y | 9 | - |
| Response Body | `offerho10` | 매도호가10 | Number | Y | 7 | - |
| Response Body | `bidho10` | 매수호가10 | Number | Y | 7 | - |
| Response Body | `offerrem10` | 매도호가잔량10 | Number | Y | 9 | - |
| Response Body | `bidrem10` | 매수호가잔량10 | Number | Y | 9 | - |
| Response Body | `totofferrem` | 총매도호가잔량 | Number | Y | 9 | - |
| Response Body | `totbidrem` | 총매수호가잔량 | Number | Y | 9 | - |
| Response Body | `donsigubun` | 동시호가구분 | String | Y | 1 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 9 | - |
| Response Body | `alloc_gubun` | 배분적용구분 | String | Y | 1 | - |
| Response Body | `volume` | 누적거래량 | Number | Y | 12 | - |
| Response Body | `midprice` | 중간가격 | Number | Y | 8 | - |
| Response Body | `offermidsumrem` | 매도중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `bidmidsumrem` | 매수중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `midsumrem` | 중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `midsumremgubun` | 중간가잔량구분(''없음'1'매도'2'매수) | String | Y | 1 | ''없음'1'매도'2'매수 |
| Response Body | `ex_shcode` | 거래소별단축코드 | String | Y | 10 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImU4Njk4Y2YyLWJiMTEtNGZlMy05OWE5LWIwNGFlOTE3MDJkOSIsIm5iZiI6MTc0MjQyNDQyOCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQyNTA3OTk5LCJpYXQiOjE3NDI0MjQ0MjgsImp0aSI6IlBTUFphQmp2S3V6V3VjeGlvYzhib21jdmsxY0U3cUs2V2JubSJ9.1u2cfXonwmOrWQTvfPwmFvevvexV-NnqjR9u1lRMAb1-6lvddRGQ8CnWWakWWIfvMZ8",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "NH1",
    "tr_key": "N000880   "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "NH1",
    "tr_key": "N000880   "
  },
  "body": {
    "offerho4": "46900",
    "offerho3": "46850",
    "offerho6": "47000",
    "offerho5": "46950",
    "offerho8": "47100",
    "offerho7": "47050",
    "offerho9": "47150",
    "midsumremgubun": "",
    "donsigubun": "1",
    "bidmidsumrem": "0",
    "hotime": "111244",
    "offerho2": "46800",
    "offerho1": "46750",
    "volume": "111022",
    "offerho10": "47200",
    "totofferrem": "4761",
    "totbidrem": "7116",
    "offermidsumrem": "0",
    "offerrem2": "523",
    "bidho5": "46450",
    "offerrem3": "479",
    "bidho4": "46500",
    "offerrem4": "359",
    "bidho7": "46350",
    "offerrem5": "439",
    "bidho6": "46400",
    "bidho9": "46250",
    "bidho8": "46300",
    "offerrem1": "295",
    "offerrem6": "1346",
    "offerrem7": "300",
    "offerrem8": "815",
    "offerrem9": "72",
    "bidrem3": "259",
    "bidrem4": "21",
    "bidrem1": "112",
    "bidrem2": "270",
    "midprice": "46700",
    "bidrem9": "987",
    "bidho1": "46650",
    "bidrem7": "1085",
    "bidrem8": "298",
    "bidho3": "46550",
    "bidrem5": "232",
    "bidho2": "46600",
    "bidrem6": "1023",
    "bidrem10": "2829",
    "bidho10": "46200",
    "shcode": "000880",
    "ex_shcode": "N000880",
    "alloc_gubun": "",
    "midsumrem": "0",
    "offerrem10": "133"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
