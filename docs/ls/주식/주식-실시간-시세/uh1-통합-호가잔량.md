---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "09f45862-49e8-4220-b2f8-09f7cfb72c99"
tr_code: "UH1"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (통합)호가잔량 (UH1)

<!-- request_field_count: 4 -->
<!-- response_field_count: 104 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (통합)호가잔량 |
| TR코드 | `UH1` |
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
| Response Body | `hotime` | 호가시간 | String | Y | 6 | - |
| Response Body | `offerho1` | 매도호가1 | Number | Y | 7 | - |
| Response Body | `bidho1` | 매수호가1 | Number | Y | 7 | - |
| Response Body | `krx_offerrem1` | KRX매도호가잔량1 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem1` | NXT매도호가잔량1 | Number | Y | 9 | - |
| Response Body | `unt_offerrem1` | 통합매도호가잔량1 | Number | Y | 9 | - |
| Response Body | `krx_bidrem1` | KRX매수호가잔량1 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem1` | NXT매수호가잔량1 | Number | Y | 9 | - |
| Response Body | `unt_bidrem1` | 통합매수호가잔량1 | Number | Y | 9 | - |
| Response Body | `offerho2` | 매도호가2 | Number | Y | 7 | - |
| Response Body | `bidho2` | 매수호가2 | Number | Y | 7 | - |
| Response Body | `krx_offerrem2` | KRX매도호가잔량2 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem2` | NXT매도호가잔량2 | Number | Y | 9 | - |
| Response Body | `unt_offerrem2` | 통합매도호가잔량2 | Number | Y | 9 | - |
| Response Body | `krx_bidrem2` | KRX매수호가잔량2 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem2` | NXT매수호가잔량2 | Number | Y | 9 | - |
| Response Body | `unt_bidrem2` | 통합매수호가잔량2 | Number | Y | 9 | - |
| Response Body | `offerho3` | 매도호가3 | Number | Y | 7 | - |
| Response Body | `bidho3` | 매수호가3 | Number | Y | 7 | - |
| Response Body | `krx_offerrem3` | KRX매도호가잔량3 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem3` | NXT매도호가잔량3 | Number | Y | 9 | - |
| Response Body | `unt_offerrem3` | 통합매도호가잔량3 | Number | Y | 9 | - |
| Response Body | `krx_bidrem3` | KRX매수호가잔량3 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem3` | NXT매수호가잔량3 | Number | Y | 9 | - |
| Response Body | `unt_bidrem3` | 통합매수호가잔량3 | Number | Y | 9 | - |
| Response Body | `offerho4` | 매도호가4 | Number | Y | 7 | - |
| Response Body | `bidho4` | 매수호가4 | Number | Y | 7 | - |
| Response Body | `krx_offerrem4` | KRX매도호가잔량4 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem4` | NXT매도호가잔량4 | Number | Y | 9 | - |
| Response Body | `unt_offerrem4` | 통합매도호가잔량4 | Number | Y | 9 | - |
| Response Body | `krx_bidrem4` | KRX매수호가잔량4 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem4` | NXT매수호가잔량4 | Number | Y | 9 | - |
| Response Body | `unt_bidrem4` | 통합매수호가잔량4 | Number | Y | 9 | - |
| Response Body | `offerho5` | 매도호가5 | Number | Y | 7 | - |
| Response Body | `bidho5` | 매수호가5 | Number | Y | 7 | - |
| Response Body | `krx_offerrem5` | KRX매도호가잔량5 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem5` | NXT매도호가잔량5 | Number | Y | 9 | - |
| Response Body | `unt_offerrem5` | 통합매도호가잔량5 | Number | Y | 9 | - |
| Response Body | `krx_bidrem5` | KRX매수호가잔량5 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem5` | NXT매수호가잔량5 | Number | Y | 9 | - |
| Response Body | `unt_bidrem5` | 통합매수호가잔량5 | Number | Y | 9 | - |
| Response Body | `offerho6` | 매도호가6 | Number | Y | 7 | - |
| Response Body | `bidho6` | 매수호가6 | Number | Y | 7 | - |
| Response Body | `krx_offerrem6` | KRX매도호가잔량6 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem6` | NXT매도호가잔량6 | Number | Y | 9 | - |
| Response Body | `unt_offerrem6` | 통합매도호가잔량6 | Number | Y | 9 | - |
| Response Body | `krx_bidrem6` | KRX매수호가잔량6 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem6` | NXT매수호가잔량6 | Number | Y | 9 | - |
| Response Body | `unt_bidrem6` | 통합매수호가잔량6 | Number | Y | 9 | - |
| Response Body | `offerho7` | 매도호가7 | Number | Y | 7 | - |
| Response Body | `bidho7` | 매수호가7 | Number | Y | 7 | - |
| Response Body | `krx_offerrem7` | KRX매도호가잔량7 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem7` | NXT매도호가잔량7 | Number | Y | 9 | - |
| Response Body | `unt_offerrem7` | 통합매도호가잔량7 | Number | Y | 9 | - |
| Response Body | `krx_bidrem7` | KRX매수호가잔량7 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem7` | NXT매수호가잔량7 | Number | Y | 9 | - |
| Response Body | `unt_bidrem7` | 통합매수호가잔량7 | Number | Y | 9 | - |
| Response Body | `offerho8` | 매도호가8 | Number | Y | 7 | - |
| Response Body | `bidho8` | 매수호가8 | Number | Y | 7 | - |
| Response Body | `krx_offerrem8` | KRX매도호가잔량8 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem8` | NXT매도호가잔량8 | Number | Y | 9 | - |
| Response Body | `unt_offerrem8` | 통합매도호가잔량8 | Number | Y | 9 | - |
| Response Body | `krx_bidrem8` | KRX매수호가잔량8 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem8` | NXT매수호가잔량8 | Number | Y | 9 | - |
| Response Body | `unt_bidrem8` | 통합매수호가잔량8 | Number | Y | 9 | - |
| Response Body | `offerho9` | 매도호가9 | Number | Y | 7 | - |
| Response Body | `bidho9` | 매수호가9 | Number | Y | 7 | - |
| Response Body | `krx_offerrem9` | KRX매도호가잔량9 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem9` | NXT매도호가잔량9 | Number | Y | 9 | - |
| Response Body | `unt_offerrem9` | 통합매도호가잔량9 | Number | Y | 9 | - |
| Response Body | `krx_bidrem9` | KRX매수호가잔량9 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem9` | NXT매수호가잔량9 | Number | Y | 9 | - |
| Response Body | `unt_bidrem9` | 통합매수호가잔량9 | Number | Y | 9 | - |
| Response Body | `offerho10` | 매도호가10 | Number | Y | 7 | - |
| Response Body | `bidho10` | 매수호가10 | Number | Y | 7 | - |
| Response Body | `krx_offerrem10` | KRX매도호가잔량10 | Number | Y | 9 | - |
| Response Body | `nxt_offerrem10` | NXT매도호가잔량10 | Number | Y | 9 | - |
| Response Body | `unt_offerrem10` | 통합매도호가잔량10 | Number | Y | 9 | - |
| Response Body | `krx_bidrem10` | KRX매수호가잔량10 | Number | Y | 9 | - |
| Response Body | `nxt_bidrem10` | NXT매수호가잔량10 | Number | Y | 9 | - |
| Response Body | `unt_bidrem10` | 통합매수호가잔량10 | Number | Y | 9 | - |
| Response Body | `krx_totofferrem` | KRX총매도호가잔량 | Number | Y | 9 | - |
| Response Body | `nxt_totofferrem` | NXT총매도호가잔량 | Number | Y | 9 | - |
| Response Body | `unt_totofferrem` | 통합총매도호가잔량 | Number | Y | 9 | - |
| Response Body | `krx_totbidrem` | KRX총매수호가잔량 | Number | Y | 9 | - |
| Response Body | `nxt_totbidrem` | NXT총매수호가잔량 | Number | Y | 9 | - |
| Response Body | `unt_totbidrem` | 통합총매수호가잔량 | Number | Y | 9 | - |
| Response Body | `krx_donsigubun` | KRX동시호가구분 | String | Y | 1 | - |
| Response Body | `nxt_donsigubun` | NXT동시호가구분 | String | Y | 1 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 9 | - |
| Response Body | `alloc_gubun` | 배분적용구분 | String | Y | 1 | - |
| Response Body | `volume` | 누적거래량 | Number | Y | 12 | - |
| Response Body | `krx_midprice` | KRX중간가격 | Number | Y | 8 | - |
| Response Body | `krx_offermidsumrem` | KRX매도중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `krx_bidmidsumrem` | KRX매수중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `nxt_midprice` | NXT중간가격 | Number | Y | 8 | - |
| Response Body | `nxt_offermidsumrem` | NXT매도중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `nxt_bidmidsumrem` | NXT매수중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `krx_midsumrem` | KRX중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `krx_midsumremgubun` | KRX중간가잔량구분(''없음'1'매도'2'매수) | Number | Y | 1 | - |
| Response Body | `nxt_midsumrem` | NXT중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `nxt_midsumremgubun` | NXT중간가잔량구분(''없음'1'매도'2'매수) | String | Y | 1 | - |
| Response Body | `ex_shcode` | 거래소별단축코드 | String | Y | 10 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjlkZmJhYWNiLWY5NWUtNGMwMi1hZGFlLTBhYzI3YTU4ZmM2NiIsIm5iZiI6MTc0MjUxMDc3OSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQyNTk0NDAwLCJpYXQiOjE3NDI1MTA3NzksImp0aSI6IlBTUFphQmp2S3V6V3VjeGlvYzhib21jdmsxY0U3cUs2V2JubSJ9.r8eqrh_LoLWvOa2WhCBLnXilk-2LZLSGcOSwJ3KuNolsHwRFvncrG0FEdw2sqhk7Z",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "UH1",
    "tr_key": "U005930   "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "UH1",
    "tr_key": "U005930   "
  },
  "body": {
    "offerho4": "61600",
    "offerho3": "61500",
    "offerho6": "61800",
    "offerho5": "61700",
    "offerho8": "62000",
    "offerho7": "61900",
    "offerho9": "62100",
    "offerho2": "61400",
    "offerho1": "61300",
    "krx_offerrem5": "580825",
    "krx_offerrem4": "450859",
    "krx_offerrem7": "595030",
    "krx_offerrem6": "311385",
    "krx_offerrem9": "176709",
    "krx_offerrem8": "980847",
    "krx_offermidsumrem": "0",
    "krx_offerrem1": "65308",
    "krx_offerrem3": "574194",
    "krx_offerrem2": "363373",
    "offerho10": "62200",
    "krx_totbidrem": "1623247",
    "nxt_midprice": "0",
    "nxt_bidrem3": "0",
    "nxt_offerrem4": "0",
    "nxt_bidrem2": "0",
    "nxt_offerrem3": "0",
    "nxt_bidrem5": "0",
    "nxt_offerrem6": "0",
    "krx_midsumrem": "0",
    "nxt_bidrem4": "0",
    "nxt_offerrem5": "0",
    "nxt_bidrem7": "0",
    "nxt_offerrem8": "0",
    "krx_bidrem10": "110802",
    "nxt_bidrem6": "0",
    "nxt_offerrem7": "0",
    "nxt_bidrem9": "0",
    "nxt_bidrem8": "0",
    "nxt_offerrem9": "0",
    "unt_totofferrem": "4245162",
    "nxt_midsumrem": "0",
    "krx_donsigubun": "1",
    "nxt_offerrem10": "0",
    "alloc_gubun": "",
    "nxt_totofferrem": "0",
    "nxt_offerrem2": "0",
    "nxt_offerrem1": "0",
    "unt_offerrem10": "146632",
    "unt_totbidrem": "1623247",
    "nxt_totbidrem": "0",
    "hotime": "151545",
    "nxt_donsigubun": "0",
    "volume": " ",
    "krx_offerrem10": "146632",
    "krx_midprice": "61250",
    "unt_bidrem9": "120706",
    "krx_totofferrem": "4245162",
    "nxt_bidrem1": "0",
    "unt_bidrem5": "114532",
    "nxt_midsumremgubun": "",
    "unt_bidrem6": "121293",
    "unt_bidrem7": "112897",
    "unt_bidrem8": "195433",
    "unt_bidrem1": "333970",
    "unt_bidrem2": "166229",
    "unt_bidrem3": "204186",
    "unt_bidrem4": "143199",
    "bidho5": "60800",
    "bidho4": "60900",
    "bidho7": "60600",
    "bidho6": "60700",
    "bidho9": "60400",
    "bidho8": "60500",
    "bidho1": "61200",
    "bidho3": "61000",
    "bidho2": "61100",
    "nxt_bidrem10": "0",
    "unt_offerrem1": "65308",
    "bidho10": "60300",
    "shcode": "005930",
    "nxt_offermidsumrem": "0",
    "ex_shcode": "U005930",
    "krx_midsumremgubun": "",
    "krx_bidrem1": "333970",
    "krx_bidrem2": "166229",
    "unt_offerrem7": "595030",
    "krx_bidrem7": "112897",
    "krx_bidmidsumrem": "0",
    "unt_offerrem6": "311385",
    "krx_bidrem8": "195433",
    "unt_offerrem9": "176709",
    "krx_bidrem9": "120706",
    "unt_offerrem8": "980847",
    "unt_offerrem3": "574194",
    "krx_bidrem3": "204186",
    "nxt_bidmidsumrem": "0",
    "unt_offerrem2": "363373",
    "krx_bidrem4": "143199",
    "unt_bidrem10": "110802",
    "unt_offerrem5": "580825",
    "krx_bidrem5": "114532",
    "unt_offerrem4": "450859",
    "krx_bidrem6": "121293"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
