---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "6109bede-ef88-45b2-bf8b-0e5a00ccfdf7"
tr_code: "NS3"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (NXT)체결 (NS3)

<!-- request_field_count: 4 -->
<!-- response_field_count: 28 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (NXT)체결 |
| TR코드 | `NS3` |
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
| Response Header | `tr_cd` | 거래CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `chetime` | 체결시간 | String | Y | 6 | - |
| Response Body | `sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `change` | 전일대비 | Number | Y | 8 | - |
| Response Body | `drate` | 등락율 | Number | Y | 6.2 | - |
| Response Body | `price` | 현재가 | Number | Y | 8 | - |
| Response Body | `opentime` | 시가시간 | String | Y | 6 | - |
| Response Body | `open` | 시가 | Number | Y | 8 | - |
| Response Body | `hightime` | 고가시간 | Number | Y | 8 | - |
| Response Body | `lowtime` | 저가시간 | String | Y | 6 | - |
| Response Body | `low` | 저가 | Number | Y | 8 | - |
| Response Body | `cgubun` | 체결구분 | String | Y | 1 | - |
| Response Body | `cvolume` | 체결량 | Number | Y | 8 | - |
| Response Body | `volume` | 누적거래량 | Number | Y | 12 | - |
| Response Body | `value` | 누적거래대금 | Number | Y | 12 | - |
| Response Body | `mdvolume` | 매도누적체결량 | Number | Y | 12 | - |
| Response Body | `mdchecnt` | 매도누적체결건수 | Number | Y | 8 | - |
| Response Body | `msvolume` | 매수누적체결량 | Number | Y | 12 | - |
| Response Body | `mschecnt` | 매수누적체결건수 | Number | Y | 8 | - |
| Response Body | `cpower` | 체결강도 | Number | Y | 9.2 | - |
| Response Body | `w_avrg` | 가중평균가 | Number | Y | 8 | - |
| Response Body | `offerho` | 매도호가 | Number | Y | 8 | - |
| Response Body | `bidho` | 매수호가 | Number | Y | 8 | - |
| Response Body | `status` | 장정보 | String | Y | 2 | - |
| Response Body | `jnilvolume` | 전일동시간대거래량 | Number | Y | 12 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 9 | - |
| Response Body | `exchname` | 거래소명 | String | Y | 3 | - |
| Response Body | `ex_shcode` | 거래소별단축코드 | String | Y | 10 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjlhZjc0YjZkLTI2OGItNDY5Yy1iNjk2LThjYmQ2ZjBiMjI3MSIsIm5iZiI6MTc0MTczMjM1MywiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQxODE2Nzk5LCJpYXQiOjE3NDE3MzIzNTMsImp0aSI6IlBTUFphQmp2S3V6V3VjeGlvYzhib21jdmsxY0U3cUs2V2JubSJ9.I4s4ZGWyG05scODLcBhKzoSDGNy80Z03fXja1KkZlmznugb-6gIkb0ngZTDzHuNCwcuhjT6SAx5dgWwVkm",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "NS3",
    "tr_key": "N010950   "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "NS3",
    "tr_key": "N010950   "
  },
  "body": {
    "mdchecnt": "662",
    "sign": "2",
    "mschecnt": "608",
    "mdvolume": "16648",
    "w_avrg": "61188",
    "cpower": "62.53",
    "offerho": "60600",
    "cvolume": "1",
    "high": "62700",
    "bidho": "60500",
    "low": "60300",
    "price": "60600",
    "cgubun": "+",
    "value": "1656",
    "change": "400",
    "shcode": "010950",
    "chetime": "143216",
    "ex_shcode": "N010950",
    "opentime": "080035",
    "lowtime": "094023",
    "volume": "27058",
    "drate": "0.66",
    "hightime": "080908",
    "jnilvolume": "44972",
    "msvolume": "10410",
    "exchname": "NXT",
    "open": "60400",
    "status": "00"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
