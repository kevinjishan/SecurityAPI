---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "c01fb423-0e79-4786-a7f6-e661f92c9b73"
tr_code: "NK1"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (NXT)거래원 (NK1)

<!-- request_field_count: 4 -->
<!-- response_field_count: 85 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (NXT)거래원 |
| TR코드 | `NK1` |
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
| Request Body | `tr_key` | 단축코드 | String | Y | 10 | 단축코드 7자리 + 공백 3자리 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `offerno1` | 매도증권사코드1 | String | Y | 3 | - |
| Response Body | `bidno1` | 매수증권사코드1 | String | Y | 3 | - |
| Response Body | `offertrad1` | 매도회원사명1 | String | Y | 6 | - |
| Response Body | `bidtrad1` | 매수회원사명1 | String | Y | 6 | - |
| Response Body | `tradmdvol1` | 매도거래량1 | Number | Y | 10 | - |
| Response Body | `tradmsvol1` | 매수거래량1 | Number | Y | 10 | - |
| Response Body | `tradmdrate1` | 매도거래량비중1 | Number | Y | 6.2 | - |
| Response Body | `tradmsrate1` | 매도거래량비중1 | Number | Y | 6.2 | - |
| Response Body | `tradmdcha1` | 매도거래량직전대비1 | Number | Y | 10 | - |
| Response Body | `tradmscha1` | 매수거래량직전대비1 | Number | Y | 10 | - |
| Response Body | `offerno2` | 매도증권사코드2 | String | Y | 3 | - |
| Response Body | `bidno2` | 매수증권사코드2 | String | Y | 3 | - |
| Response Body | `offertrad2` | 매도회원사명2 | String | Y | 6 | - |
| Response Body | `bidtrad2` | 매수회원사명2 | String | Y | 6 | - |
| Response Body | `tradmdvol2` | 매도거래량2 | Number | Y | 10 | - |
| Response Body | `tradmsvol2` | 매수거래량2 | Number | Y | 10 | - |
| Response Body | `tradmdrate2` | 매도거래량비중2 | Number | Y | 6.2 | - |
| Response Body | `tradmsrate2` | 매수거래량비중2 | Number | Y | 6.2 | - |
| Response Body | `tradmdcha2` | 매도거래량직전대비2 | Number | Y | 10 | - |
| Response Body | `tradmscha2` | 매수거래량직전대비2 | Number | Y | 10 | - |
| Response Body | `offerno3` | 매도증권사코드3 | String | Y | 3 | - |
| Response Body | `bidno3` | 매수증권사코드3 | String | Y | 3 | - |
| Response Body | `offertrad3` | 매도회원사명3 | String | Y | 6 | - |
| Response Body | `bidtrad3` | 매수회원사명3 | String | Y | 6 | - |
| Response Body | `tradmdvol3` | 매도거래량3 | Number | Y | 10 | - |
| Response Body | `tradmsvol3` | 매수거래량3 | Number | Y | 10 | - |
| Response Body | `tradmdrate3` | 매도거래량비중3 | Number | Y | 6.2 | - |
| Response Body | `tradmsrate3` | 매수거래량비중3 | Number | Y | 6.2 | - |
| Response Body | `tradmdcha3` | 매도거래량직전대비3 | Number | Y | 10 | - |
| Response Body | `tradmscha3` | 매수거래량직전대비3 | Number | Y | 10 | - |
| Response Body | `offerno4` | 매도증권사코드4 | String | Y | 3 | - |
| Response Body | `bidno4` | 매수증권사코드4 | String | Y | 3 | - |
| Response Body | `offertrad4` | 매도회원사명4 | String | Y | 6 | - |
| Response Body | `bidtrad4` | 매수회원사명4 | String | Y | 6 | - |
| Response Body | `tradmdvol4` | 매도거래량4 | Number | Y | 10 | - |
| Response Body | `tradmsvol4` | 매수거래량4 | Number | Y | 10 | - |
| Response Body | `tradmdrate4` | 매도거래량비중4 | Number | Y | 6.2 | - |
| Response Body | `tradmsrate4` | 매수거래량비중4 | Number | Y | 6.2 | - |
| Response Body | `tradmdcha4` | 매도거래량직전대비4 | Number | Y | 10 | - |
| Response Body | `tradmscha4` | 매수거래량직전대비4 | Number | Y | 10 | - |
| Response Body | `offerno5` | 매도증권사코드5 | String | Y | 3 | - |
| Response Body | `bidno5` | 매수증권사코드5 | String | Y | 3 | - |
| Response Body | `offertrad5` | 매도회원사명5 | String | Y | 6 | - |
| Response Body | `bidtrad5` | 매수회원사명5 | String | Y | 6 | - |
| Response Body | `tradmdvol5` | 매도거래량5 | Number | Y | 10 | - |
| Response Body | `tradmsvol5` | 매수거래량5 | Number | Y | 10 | - |
| Response Body | `tradmdrate5` | 매도거래량비중5 | Number | Y | 6.2 | - |
| Response Body | `tradmsrate5` | 매수거래량비중5 | Number | Y | 6.2 | - |
| Response Body | `tradmdcha5` | 매도거래량직전대비5 | Number | Y | 10 | - |
| Response Body | `tradmscha5` | 매수거래량직전대비5 | Number | Y | 10 | - |
| Response Body | `ftradmdvol` | 외국계증권사매도합계 | Number | Y | 10 | - |
| Response Body | `ftradmsvol` | 외국계증권사매수합계 | Number | Y | 10 | - |
| Response Body | `ftradmdrate` | 외국계증권사매도거래량비중 | Number | Y | 6.2 | - |
| Response Body | `ftradmsrate` | 외국계증권사매수거래량비중 | Number | Y | 6.2 | - |
| Response Body | `ftradmdcha` | 외국계증권사매도거래량직전대비 | Number | Y | 10 | - |
| Response Body | `ftradmscha` | 외국계증권사매수거래량직전대비 | Number | Y | 10 | - |
| Response Body | `shcode` | 단축코드 | Number | Y | 9 | - |
| Response Body | `tradmdval1` | 매도거래대금1 | Number | Y | 15 | - |
| Response Body | `tradmsval1` | 매수거래대금1 | Number | Y | 15 | - |
| Response Body | `tradmdavg1` | 매도평균단가1 | Number | Y | 7 | - |
| Response Body | `tradmsavg1` | 매수평균단가1 | Number | Y | 7 | - |
| Response Body | `tradmdval2` | 매도거래대금2 | Number | Y | 15 | - |
| Response Body | `tradmsval2` | 매수거래대금2 | Number | Y | 15 | - |
| Response Body | `tradmdavg2` | 매도평균단가2 | Number | Y | 7 | - |
| Response Body | `tradmsavg2` | 매수평균단가2 | Number | Y | 7 | - |
| Response Body | `tradmdval3` | 매도거래대금3 | Number | Y | 15 | - |
| Response Body | `tradmsval3` | 매수거래대금3 | Number | Y | 15 | - |
| Response Body | `tradmdavg3` | 매도평균단가3 | Number | Y | 7 | - |
| Response Body | `tradmsavg3` | 매수평균단가3 | Number | Y | 7 | - |
| Response Body | `tradmdval4` | 매도거래대금4 | Number | Y | 15 | - |
| Response Body | `tradmsval4` | 매수거래대금4 | Number | Y | 15 | - |
| Response Body | `tradmdavg4` | 매도평균단가4 | Number | Y | 7 | - |
| Response Body | `tradmsavg4` | 매수평균단가4 | Number | Y | 7 | - |
| Response Body | `tradmdval5` | 매도거래대금5 | Number | Y | 15 | - |
| Response Body | `tradmsval5` | 매수거래대금5 | Number | Y | 15 | - |
| Response Body | `tradmdavg5` | 매도평균단가5 | Number | Y | 7 | - |
| Response Body | `tradmsavg5` | 매수평균단가5 | Number | Y | 7 | - |
| Response Body | `ftradmdval` | 외국계증권사매도거래대금 | Number | Y | 15 | - |
| Response Body | `ftradmsval` | 외국계증권사매수거래대금 | Number | Y | 15 | - |
| Response Body | `ftradmdavg` | 외국계증권사매도평균단가 | Number | Y | 7 | - |
| Response Body | `ftradmsavg` | 외국계증권사매수평균단가 | Number | Y | 7 | - |
| Response Body | `time` | 수신시간 | String | Y | 6 | - |
| Response Body | `exchname` | 거래소명 | String | Y | 3 | - |
| Response Body | `ex_shcode` | 거래소별단축코드 | String | Y | 10 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjYyY2NhNzgwLWZjN2EtNDcwZC04NjQ4LTMyOWQzZjFiMmE2NyIsIm5iZiI6MTc0MjQyOTY1MiwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQyNTA4MDAwLCJpYXQiOjE3NDI0Mjk2NTIsImp0aSI6IlBTQ2lXTjBDZGZUYVZYb293Tnltb2dkdmxJaUxHV25UcGQzRCJ9.GJBiwx09tuREqY3AN0zSphhBTBMIC0X6l-TyETIFwoaxllhChr6IDqSVAdgB61y4ufh-J8zGBcu",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "NK1",
    "tr_key": "N009520   "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "NK1",
    "tr_key": "N009520   "
  },
  "body": {
    "tradmdrate1": "39.69",
    "tradmdvol5": "15626",
    "tradmdvol3": "20687",
    "tradmdrate3": "11.55",
    "tradmdrate2": "13.37",
    "tradmdvol4": "16238",
    "offerno2": "005",
    "tradmdrate5": "8.72",
    "offerno1": "050",
    "tradmdrate4": "9.07",
    "offerno4": "017",
    "offerno3": "012",
    "bidtrad4": "NH투자",
    "offerno5": "030",
    "bidtrad5": "KB증권",
    "bidtrad2": "미래에",
    "bidtrad3": "삼성증",
    "tradmdvol1": "71083",
    "bidtrad1": "키움증",
    "tradmdvol2": "23938",
    "tradmdval3": "308",
    "offertrad5": "삼성증",
    "tradmdval4": "242",
    "tradmdval1": "1057",
    "tradmdval2": "357",
    "tradmdval5": "233",
    "tradmscha2": "188",
    "ftradmdval": "0",
    "tradmscha1": "666",
    "tradmscha4": "151",
    "tradmscha3": "42",
    "offertrad2": "미래에",
    "offertrad1": "키움증",
    "offertrad4": "KB증권",
    "offertrad3": "NH투자",
    "tradmdcha5": "0",
    "tradmdcha4": "0",
    "tradmsavg1": "14883",
    "tradmsavg2": "14872",
    "tradmscha5": "61",
    "tradmdavg1": "14875",
    "tradmdavg3": "14870",
    "tradmdavg2": "14901",
    "tradmdavg5": "14887",
    "tradmdavg4": "14900",
    "tradmsavg3": "14907",
    "ftradmscha": "0000000000",
    "tradmsavg4": "14888",
    "ftradmdvol": "0000000000",
    "tradmsavg5": "14866",
    "ftradmdavg": " ",
    "tradmsval3": "265",
    "tradmsval2": "401",
    "tradmsval5": "153",
    "ftradmsval": "0",
    "tradmsval4": "178",
    "tradmsval1": "1254",
    "tradmdcha1": "1159",
    "tradmdcha3": "0",
    "tradmdcha2": "0",
    "bidno1": "050",
    "bidno3": "030",
    "tradmsvol5": "10298",
    "bidno2": "005",
    "tradmsvol4": "11960",
    "bidno5": "017",
    "bidno4": "012",
    "tradmsvol1": "84288",
    "tradmsvol3": "17796",
    "tradmsvol2": "26993",
    "tradmsrate2": "15.07",
    "tradmsrate1": "47.06",
    "tradmsrate4": "6.68",
    "tradmsrate3": "9.94",
    "tradmsrate5": "5.75",
    "ftradmsvol": "0000000000",
    "ftradmdcha": "0000000000",
    "ftradmsrate": "0.0",
    "shcode": "009520",
    "ftradmsavg": " ",
    "ftradmdrate": "0.0",
    "ex_shcode": "N009520",
    "time": "132610",
    "exchname": "NXT"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
