---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cd909627-82e5-40c9-b313-1a8fd2d7b119&api_id=d67d0790-4b26-447b-82eb-e9642f66057c"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "실시간 시세 투자정보"
api_id: "d67d0790-4b26-447b-82eb-e9642f66057c"
api_name: "[실시간 시세 투자정보] 투자정보"
tr_id: "3c0k0445-07da-jtv7-5jfc-6668r26l4ohn"
tr_code: "MK2"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/investinfo"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# US지수 (MK2)

<!-- request_field_count: 4 -->
<!-- response_field_count: 19 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 실시간 시세 투자정보 |
| API 페이지 | [실시간 시세 투자정보] 투자정보 |
| TR명 | US지수 |
| TR코드 | `MK2` |
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
| Request Body | `tr_key` | 심볼코드 | String | N | 16 | DJI@DJI         : 다우산업<br>NAS@IXIC      : 나스닥 종합<br>SPI@SPX       : S&P 500<br>USI@SOXX      : 필라델피아 반도체 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `date` | 일자 | String | Y | 8 | - |
| Response Body | `time` | 시간 | String | Y | 6 | - |
| Response Body | `kodate` | 한국일자 | String | Y | 8 | - |
| Response Body | `kotime` | 한국시간 | String | Y | 6 | - |
| Response Body | `open` | 시가 | String | Y | 9.2 | - |
| Response Body | `high` | 고가 | String | Y | 9.2 | - |
| Response Body | `low` | 저가 | String | Y | 9.2 | - |
| Response Body | `price` | 현재가 | String | Y | 9.2 | - |
| Response Body | `sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `change` | 전일대비 | String | Y | 9.2 | - |
| Response Body | `uprate` | 등락율 | String | Y | 9.2 | - |
| Response Body | `bidho` | 매수호가 | String | Y | 9.2 | - |
| Response Body | `bidrem` | 매수잔량 | String | Y | 9 | - |
| Response Body | `offerho` | 매도호가 | String | Y | 9.2 | - |
| Response Body | `offerrem` | 매도잔량 | String | Y | 9 | - |
| Response Body | `volume` | 누적거래량 | String | Y | 12.0 | - |
| Response Body | `xsymbol` | 심벌 | String | Y | 16 | - |
| Response Body | `cvolume` | 체결거래량 | String | Y | 8.0 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImRmYzQ2NThiLTQ3NmItNGQ4MS05OGM3LTI3NzlmNDhjMGZkZiIsIm5iZiI6MTY4NzM5MTEwOSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg3NDcxMTk5LCJpYXQiOjE2ODczOTExMDksImp0aSI6IlBTMzA3em5Jd2ZMSWxXR1Bhbm1SN2ZtMzl2NXRDbWYydWFPWCJ9.mZK8YsM8NNT-5-1Q7uPi1Xjnx9J-P_eRgn2fHCpMtT5CaXK7fu94xeR5iMGqhhTCW3W08IUUG0ixH01IOULtkg",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "MK2",
    "tr_key": "NII@NI225       "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "MK2",
    "tr_key": "N"
  },
  "body": {
    "date": "II@NI225",
    "change": "10？ 334.49",
    "sign": "8",
    "bidrem": ".38",
    "offerho": "0.00",
    "cvolume": "I@NI225",
    "offerrem": " ",
    "volume": "0.00",
    "high": "20  3.34",
    "bidho": "6.14",
    "kodate": "0230622",
    "low": "8.01？ 336",
    "xsymbol": "0            0 N",
    "price": "1.46？ 333",
    "kotime": "40020",
    "time": "",
    "uprate": "5.-1",
    "open": "230622. 1"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
