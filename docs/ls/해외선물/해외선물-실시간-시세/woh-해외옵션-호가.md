---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=c1ef0e8b-4666-4d8c-a77f-6ab488cfdb39&api_id=3dc1c51b-5ff2-456d-ad2a-055e78ba2b03"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "해외선물"
api_id: "3dc1c51b-5ff2-456d-ad2a-055e78ba2b03"
api_name: "[해외선물] 실시간 시세"
tr_id: "15t02g30-gq1z-6g5w-j0mq-y87jf3e71510"
tr_code: "WOH"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/overseas-futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 해외옵션 호가 (WOH)

<!-- request_field_count: 4 -->
<!-- response_field_count: 37 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외선물 |
| API 페이지 | [해외선물] 실시간 시세 |
| TR명 | 해외옵션 호가 |
| TR코드 | `WOH` |
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
| Response Body | `symbol` | 종목코드 | String | Y | 16 | - |
| Response Body | `hotime` | 호가시간 | String | Y | 6 | - |
| Response Body | `offerho1` | 매도호가 1 | String | Y | 15.9 | - |
| Response Body | `bidho1` | 매수호가 1 | String | Y | 15.9 | - |
| Response Body | `offerrem1` | 매도호가 잔량 1 | String | Y | 10 | - |
| Response Body | `bidrem1` | 매수호가 잔량 1 | String | Y | 10 | - |
| Response Body | `offerno1` | 매도호가 건수 1 | String | Y | 10 | - |
| Response Body | `bidno1` | 매수호가 건수 1 | String | Y | 10 | - |
| Response Body | `offerho2` | 매도호가 2 | String | Y | 15.9 | - |
| Response Body | `bidho2` | 매수호가 2 | String | Y | 15.9 | - |
| Response Body | `offerrem2` | 매도호가 잔량 2 | String | Y | 10 | - |
| Response Body | `bidrem2` | 매수호가 잔량 2 | String | Y | 10 | - |
| Response Body | `offerno2` | 매도호가 건수 2 | String | Y | 10 | - |
| Response Body | `bidno2` | 매수호가 건수 2 | String | Y | 10 | - |
| Response Body | `offerho3` | 매도호가 3 | String | Y | 15.9 | - |
| Response Body | `bidho3` | 매수호가 3 | String | Y | 15.9 | - |
| Response Body | `offerrem3` | 매도호가 잔량 3 | String | Y | 10 | - |
| Response Body | `bidrem3` | 매수호가 잔량 3 | String | Y | 10 | - |
| Response Body | `offerno3` | 매도호가 건수 3 | String | Y | 10 | - |
| Response Body | `bidno3` | 매수호가 건수 3 | String | Y | 10 | - |
| Response Body | `offerho4` | 매도호가 4 | String | Y | 15.9 | - |
| Response Body | `bidho4` | 매수호가 4 | String | Y | 15.9 | - |
| Response Body | `offerrem4` | 매도호가 잔량 4 | String | Y | 10 | - |
| Response Body | `bidrem4` | 매수호가 잔량 4 | String | Y | 10 | - |
| Response Body | `offerno4` | 매도호가 건수 4 | String | Y | 10 | - |
| Response Body | `bidno4` | 매수호가 건수 4 | String | Y | 10 | - |
| Response Body | `offerho5` | 매도호가 5 | String | Y | 15.9 | - |
| Response Body | `bidho5` | 매수호가 5 | String | Y | 15.9 | - |
| Response Body | `offerrem5` | 매도호가 잔량 5 | String | Y | 10 | - |
| Response Body | `bidrem5` | 매수호가 잔량 5 | String | Y | 10 | - |
| Response Body | `offerno5` | 매도호가 건수 5 | String | Y | 10 | - |
| Response Body | `bidno5` | 매수호가 건수 5 | String | Y | 10 | - |
| Response Body | `totoffercnt` | 매도호가총건수 | String | Y | 10 | - |
| Response Body | `totbidcnt` | 매수호가총건수 | String | Y | 10 | - |
| Response Body | `totofferrem` | 매도호가총수량 | String | Y | 10 | - |
| Response Body | `totbidrem` | 매수호가총수량 | String | Y | 10 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImRmYzQ2NThiLTQ3NmItNGQ4MS05OGM3LTI3NzlmNDhjMGZkZiIsIm5iZiI6MTY4NzM5MTEwOSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg3NDcxMTk5LCJpYXQiOjE2ODczOTExMDksImp0aSI6IlBTMzA3em5Jd2ZMSWxXR1Bhbm1SN2ZtMzl2NXRDbWYydWFPWCJ9.mZK8YsM8NNT-5-1Q7uPi1Xjnx9J-P_eRgn2fHCpMtT5CaXK7fu94xeR5iMGqhhTCW3W08IUUG0ixH01IOULtkg",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "WOH",
    "tr_key": "2ESU23_4400     "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "WOH",
    "tr_key": "2ESU23_4"
  },
  "body": {
    "offerrem2": "107.75？00",
    "offerho4": "0.1",
    "bidho5": "0.00",
    "symbol": "400     2ESU23_4",
    "offerho3": "0.2",
    "offerrem3": "90.00？00",
    "bidho4": "0.00",
    "bidno1": "1 00",
    "offerrem4": ".00？00",
    "offerho5": "0.0",
    "offerrem5": ".00？00",
    "offerno2": "50 00",
    "bidno3": "2 00",
    "offerno1": "19 00",
    "bidno2": "3 00",
    "offerno4": "0",
    "bidno5": "0",
    "offerrem1": "108.00？00",
    "offerno3": "1 00",
    "bidno4": "0",
    "offerno5": "0",
    "totoffercnt": "0",
    "totbidcnt": "6 00",
    "bidrem3": "48 00",
    "bidrem4": "0",
    "bidrem1": "13 00",
    "bidrem2": "6 00",
    "bidho1": "108.75",
    "hotime": "00",
    "offerho2": "0.4",
    "bidho3": "109.25",
    "bidrem5": "0",
    "offerho1": "354.0",
    "bidho2": "109.00",
    "totofferrem": "7 00",
    "totbidrem": "67 00"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
