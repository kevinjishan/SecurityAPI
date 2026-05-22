---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "8rj74yu0-gma6-l2b6-cuc3-5kvhhb0snm2c"
tr_code: "OH0"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSPI200옵션호가 (OH0)

<!-- request_field_count: 4 -->
<!-- response_field_count: 39 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | KOSPI200옵션호가 |
| TR코드 | `OH0` |
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
| Response Body | `hotime` | 호가시간 | String | Y | 6 | - |
| Response Body | `offerho1` | 매도호가1 | String | Y | 6.2 | - |
| Response Body | `bidho1` | 매수호가1 | String | Y | 6.2 | - |
| Response Body | `offerrem1` | 매도호가수량1 | String | Y | 7 | - |
| Response Body | `bidrem1` | 매수호가수량1 | String | Y | 7 | - |
| Response Body | `offercnt1` | 매도호가건수1 | String | Y | 5 | - |
| Response Body | `bidcnt1` | 매수호가건수1 | String | Y | 5 | - |
| Response Body | `offerho2` | 매도호가2 | String | Y | 6.2 | - |
| Response Body | `bidho2` | 매수호가2 | String | Y | 6.2 | - |
| Response Body | `offerrem2` | 매도호가수량2 | String | Y | 7 | - |
| Response Body | `bidrem2` | 매수호가수량2 | String | Y | 7 | - |
| Response Body | `offercnt2` | 매도호가건수2 | String | Y | 5 | - |
| Response Body | `bidcnt2` | 매수호가건수2 | String | Y | 5 | - |
| Response Body | `offerho3` | 매도호가3 | String | Y | 6.2 | - |
| Response Body | `bidho3` | 매수호가3 | String | Y | 6.2 | - |
| Response Body | `offerrem3` | 매도호가수량3 | String | Y | 7 | - |
| Response Body | `bidrem3` | 매수호가수량3 | String | Y | 7 | - |
| Response Body | `offercnt3` | 매도호가건수3 | String | Y | 5 | - |
| Response Body | `bidcnt3` | 매수호가건수3 | String | Y | 5 | - |
| Response Body | `offerho4` | 매도호가4 | String | Y | 6.2 | - |
| Response Body | `bidho4` | 매수호가4 | String | Y | 6.2 | - |
| Response Body | `offerrem4` | 매도호가수량4 | String | Y | 7 | - |
| Response Body | `bidrem4` | 매수호가수량4 | String | Y | 7 | - |
| Response Body | `offercnt4` | 매도호가건수4 | String | Y | 5 | - |
| Response Body | `bidcnt4` | 매수호가건수4 | String | Y | 5 | - |
| Response Body | `offerho5` | 매도호가5 | String | Y | 6.2 | - |
| Response Body | `bidho5` | 매수호가5 | String | Y | 6.2 | - |
| Response Body | `offerrem5` | 매도호가수량5 | String | Y | 7 | - |
| Response Body | `bidrem5` | 매수호가수량5 | String | Y | 7 | - |
| Response Body | `offercnt5` | 매도호가건수5 | String | Y | 5 | - |
| Response Body | `bidcnt5` | 매수호가건수5 | String | Y | 5 | - |
| Response Body | `totofferrem` | 매도호가총수량 | String | Y | 7 | - |
| Response Body | `totbidrem` | 매수호가총수량 | String | Y | 7 | - |
| Response Body | `totoffercnt` | 매도호가총건수 | String | Y | 5 | - |
| Response Body | `totbidcnt` | 매수호가총건수 | String | Y | 5 | - |
| Response Body | `optcode` | 단축코드 | String | Y | 8 | - |
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
    "tr_cd": "OH0",
    "tr_key": "201T7347"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "OH0",
    "tr_key": "201T7347"
  },
  "body": {
    "offerrem2": "11",
    "offerho4": "4.40",
    "bidho5": "4.31",
    "offerho3": "4.39",
    "offerrem3": "16",
    "bidho4": "4.32",
    "offerrem4": "4",
    "offerho5": "4.41",
    "offerrem5": "26",
    "offerrem1": "2",
    "totoffercnt": "224",
    "totbidcnt": "312",
    "bidrem3": "13",
    "bidrem4": "12",
    "bidrem1": "7",
    "bidrem2": "7",
    "bidcnt5": "4",
    "bidcnt4": "5",
    "bidcnt3": "5",
    "bidcnt2": "7",
    "bidcnt1": "6",
    "danhochk": "0",
    "bidho1": "4.35",
    "hotime": "093456",
    "offerho2": "4.38",
    "bidho3": "4.33",
    "bidrem5": "5",
    "offerho1": "4.37",
    "bidho2": "4.34",
    "optcode": "201T7347",
    "offercnt5": "8",
    "offercnt3": "7",
    "offercnt4": "3",
    "offercnt1": "2",
    "offercnt2": "8",
    "alloc_gubun": "",
    "totofferrem": "1017",
    "totbidrem": "1944"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
