---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "4ar3rm7b-2a23-c135-ovao-pz22y85q5bsn"
tr_code: "DHA"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSDAQ시간외단일가호가잔량 (DHA)

<!-- request_field_count: 4 -->
<!-- response_field_count: 45 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | KOSDAQ시간외단일가호가잔량 |
| TR코드 | `DHA` |
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
| Response Body | `dan_hotime` | 시간외단일가호가시간 | String | Y | 6 | - |
| Response Body | `dan_hstatus` | 시간외단일가장구분 | String | Y | 2 | - |
| Response Body | `dan_offerho1` | 시간외단일가매도호가1 | String | Y | 8 | - |
| Response Body | `dan_bidho1` | 시간외단일가매수호가1 | String | Y | 8 | - |
| Response Body | `dan_offerrem1` | 시간외단일가매도호가잔량1 | String | Y | 12 | - |
| Response Body | `dan_bidrem1` | 시간외단일가매수호가잔량1 | String | Y | 12 | - |
| Response Body | `dan_preoffercha1` | 시간외단일가직전매도대비수량1 | String | Y | 12 | - |
| Response Body | `dan_prebidcha1` | 시간외단일가직전매수대비수량1 | String | Y | 12 | - |
| Response Body | `dan_offerho2` | 시간외단일가매도호가2 | String | Y | 8 | - |
| Response Body | `dan_bidho2` | 시간외단일가매수호가2 | String | Y | 8 | - |
| Response Body | `dan_offerrem2` | 시간외단일가매도호가잔량2 | String | Y | 12 | - |
| Response Body | `dan_bidrem2` | 시간외단일가매수호가잔량2 | String | Y | 12 | - |
| Response Body | `dan_preoffercha2` | 시간외단일가직전매도대비수량2 | String | Y | 12 | - |
| Response Body | `dan_prebidcha2` | 시간외단일가직전매수대비수량2 | String | Y | 12 | - |
| Response Body | `dan_offerho3` | 시간외단일가매도호가3 | String | Y | 8 | - |
| Response Body | `dan_bidho3` | 시간외단일가매수호가3 | String | Y | 8 | - |
| Response Body | `dan_offerrem3` | 시간외단일가매도호가잔량3 | String | Y | 12 | - |
| Response Body | `dan_bidrem3` | 시간외단일가매수호가잔량3 | String | Y | 12 | - |
| Response Body | `dan_preoffercha3` | 시간외단일가직전매도대비수량3 | String | Y | 12 | - |
| Response Body | `dan_prebidcha3` | 시간외단일가직전매수대비수량3 | String | Y | 12 | - |
| Response Body | `dan_offerho4` | 시간외단일가매도호가4 | String | Y | 8 | - |
| Response Body | `dan_bidho4` | 시간외단일가매수호가4 | String | Y | 8 | - |
| Response Body | `dan_offerrem4` | 시간외단일가매도호가잔량4 | String | Y | 12 | - |
| Response Body | `dan_bidrem4` | 시간외단일가매수호가잔량4 | String | Y | 12 | - |
| Response Body | `dan_preoffercha4` | 시간외단일가직전매도대비수량4 | String | Y | 12 | - |
| Response Body | `dan_prebidcha4` | 시간외단일가직전매수대비수량4 | String | Y | 12 | - |
| Response Body | `dan_offerho5` | 시간외단일가매도호가5 | String | Y | 8 | - |
| Response Body | `dan_bidho5` | 시간외단일가매수호가5 | String | Y | 8 | - |
| Response Body | `dan_offerrem5` | 시간외단일가매도호가잔량5 | String | Y | 12 | - |
| Response Body | `dan_bidrem5` | 시간외단일가매수호가잔량5 | String | Y | 12 | - |
| Response Body | `dan_preoffercha5` | 시간외단일가직전매도대비수량5 | String | Y | 12 | - |
| Response Body | `dan_prebidcha5` | 시간외단일가직전매수대비수량5 | String | Y | 12 | - |
| Response Body | `dan_totofferrem` | 시간외단일가총매도호가잔량 | String | Y | 12 | - |
| Response Body | `dan_totbidrem` | 시간외단일가총매수호가잔량 | String | Y | 12 | - |
| Response Body | `dan_preoffercha` | 시간외단일가직전매도호가총대비수량 | String | Y | 12 | - |
| Response Body | `dan_prebidcha` | 시간외단일가직전매수호가총대비수량 | String | Y | 12 | - |
| Response Body | `dan_yeprice` | 시간외단일가예상체결가격 | String | Y | 8 | - |
| Response Body | `dan_yevolume` | 시간외단일가예상체결수량 | String | Y | 12 | - |
| Response Body | `dan_preysign` | 시간외단일가예상가직전가대비구분 | String | Y | 1 | - |
| Response Body | `dan_preychange` | 시간외단일가예상가직전가대비 | String | Y | 8 | - |
| Response Body | `dan_jnilysign` | 시간외단일가예상가전일가대비구분 | String | Y | 1 | - |
| Response Body | `dan_jnilychange` | 시간외단일가예상가전일가대비 | String | Y | 8 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 6 | - |
| Response Body | `volume` | 누적거래량 | String | Y | 12 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6Ijk5NGZkNjI5LWY4OGItNGQ0Ni05NTE0LTJjNmQzMjM1MWIyYSIsIm5iZiI6MTY4NjY0MDc3NywiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzI3MTc3LCJpYXQiOjE2ODY2NDA3NzcsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.WT1pgGw-gawv2GAQiRNcEphlv3BfXZfeVG03wwBCoCKpUYYC0l019Oc0JJIqoR41WHm8kEuNgDgYhlib_LxI7g",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "DHA",
    "tr_key": "086520"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "DHA",
    "tr_key": "086520"
  },
  "body": {
    "dan_bidrem2": "441",
    "dan_bidrem1": "318",
    "dan_preychange": "1000",
    "dan_totbidrem": "937",
    "dan_jnilychange": "-4000",
    "dan_bidrem5": "0",
    "dan_totofferrem": "1080",
    "dan_bidrem4": "0",
    "dan_bidrem3": "178",
    "dan_prebidcha1": "0",
    "dan_offerho5": "0",
    "dan_prebidcha2": "0",
    "dan_prebidcha3": "0",
    "dan_hotime": "162755",
    "dan_hstatus": "01",
    "dan_bidho1": "745000",
    "dan_preoffercha2": "0",
    "dan_bidho3": "743000",
    "dan_preoffercha1": "-2",
    "dan_bidho2": "744000",
    "dan_preoffercha4": "0",
    "dan_bidho5": "0",
    "dan_preoffercha": "-2",
    "dan_preoffercha3": "0",
    "dan_bidho4": "0",
    "dan_preoffercha5": "0",
    "dan_yeprice": "745000",
    "dan_preysign": "5",
    "shcode": "086520",
    "dan_offerho2": "747000",
    "dan_prebidcha4": "0",
    "dan_offerho1": "746000",
    "dan_prebidcha5": "0",
    "dan_offerho4": "0",
    "dan_offerho3": "748000",
    "dan_offerrem4": "0",
    "volume": "3801",
    "dan_offerrem5": "0",
    "dan_jnilysign": "5",
    "dan_prebidcha": "0",
    "dan_yevolume": "928",
    "dan_offerrem1": "608",
    "dan_offerrem2": "192",
    "dan_offerrem3": "280"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
