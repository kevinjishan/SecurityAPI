---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=c1ef0e8b-4666-4d8c-a77f-6ab488cfdb39&api_id=3dc1c51b-5ff2-456d-ad2a-055e78ba2b03"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "해외선물"
api_id: "3dc1c51b-5ff2-456d-ad2a-055e78ba2b03"
api_name: "[해외선물] 실시간 시세"
tr_id: "f5608g2k-zr15-t2z5-5s8y-0ra57238k44v"
tr_code: "OVC"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/overseas-futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 해외선물 체결 (OVC)

<!-- request_field_count: 4 -->
<!-- response_field_count: 19 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외선물 |
| API 페이지 | [해외선물] 실시간 시세 |
| TR명 | 해외선물 체결 |
| TR코드 | `OVC` |
| 초당 전송 건수 | - |
| 설명 | 해외선물옵션 주문현황 및 시세정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/overseas-futureoption` |
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
| Response Body | `symbol` | 종목코드 | String | Y | 8 | - |
| Response Body | `ovsdate` | 체결일자(현지) | String | Y | 8 | - |
| Response Body | `kordate` | 체결일자(한국) | String | Y | 8 | - |
| Response Body | `trdtm` | 체결시간(현지) | String | Y | 6 | - |
| Response Body | `kortm` | 체결시간(한국) | String | Y | 6 | - |
| Response Body | `curpr` | 체결가격 | String | Y | 15.9 | - |
| Response Body | `ydiffpr` | 전일대비 | String | Y | 15.9 | - |
| Response Body | `ydiffSign` | 전일대비기호 | String | Y | 1 | - |
| Response Body | `open` | 시가 | String | Y | 15.9 | - |
| Response Body | `high` | 고가 | String | Y | 15.9 | - |
| Response Body | `low` | 저가 | String | Y | 15.9 | - |
| Response Body | `chgrate` | 등락율 | String | Y | 6.2 | - |
| Response Body | `trdq` | 건별체결수량 | String | Y | 10 | - |
| Response Body | `totq` | 누적체결수량 | String | Y | 15 | - |
| Response Body | `cgubun` | 체결구분 | String | Y | 1 | - |
| Response Body | `mdvolume` | 매도누적체결수량 | String | Y | 15 | - |
| Response Body | `msvolume` | 매수누적체결수량 | String | Y | 15 | - |
| Response Body | `ovsmkend` | 장마감일 | String | Y | 8 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjBmYTRhNmE1LWYwMzMtNGEyZS04MjgyLTE3MTdmOGRkN2EzZiIsIm5iZiI6MTY4Njc4Mjg2NSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2ODY2Mzk5LCJpYXQiOjE2ODY3ODI4NjUsImp0aSI6IlBTMzA3em5Jd2ZMSWxXR1Bhbm1SN2ZtMzl2NXRDbWYydWFPWCJ9.e2T7dj3jYedMsM8nd2FPr2OF8ZRxUwzqBNGgxwamMCa1PAx4oqjOuCdmKLs7oZfL9OICQ4AAA5_ceDulGBGCFg",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "OVC",
    "tr_key": "NQU23   "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "OVC",
    "tr_key": "NQU23   "
  },
  "body": {
    "symbol": "NQU23",
    "chgrate": "-0.31",
    "kordate": "20230622",
    "trdtm": "001640",
    "curpr": "0. 14997.75",
    "ovsdate": "20230622",
    "mdvolume": "",
    "ydiffpr": "0.    46.25",
    "totq": "28064",
    "high": "0. 15058.00",
    "ydiffSign": "5",
    "low": "0. 14988.25",
    "msvolume": "",
    "cgubun": "-",
    "trdq": "1",
    "open": "0. 15038.75",
    "kortm": "141640"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
