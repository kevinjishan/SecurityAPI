---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "p01ytc30-0koz-d418-qhww-j6ytc16lv0zw"
tr_code: "K1_"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSPI거래원 (K1_)

<!-- request_field_count: 4 -->
<!-- response_field_count: 82 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | KOSPI거래원 |
| TR코드 | `K1_` |
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
| Response Body | `offerno1` | 매도증권사코드1 | String | Y | 3 | - |
| Response Body | `bidno1` | 매수증권사코드1 | String | Y | 3 | - |
| Response Body | `offertrad1` | 매도회원사명1 | String | Y | 6 | - |
| Response Body | `bidtrad1` | 매수회원사명1 | String | Y | 6 | - |
| Response Body | `tradmdvol1` | 매도거래량1 | String | Y | 10 | - |
| Response Body | `tradmsvol1` | 매수거래량1 | String | Y | 10 | - |
| Response Body | `tradmdrate1` | 매도거래량비중1 | String | Y | 6.2 | - |
| Response Body | `tradmsrate1` | 매도거래량비중1 | String | Y | 6.2 | - |
| Response Body | `tradmdcha1` | 매도거래량직전대비1 | String | Y | 10 | - |
| Response Body | `tradmscha1` | 매수거래량직전대비1 | String | Y | 10 | - |
| Response Body | `offerno2` | 매도증권사코드2 | String | Y | 3 | - |
| Response Body | `bidno2` | 매수증권사코드2 | String | Y | 3 | - |
| Response Body | `offertrad2` | 매도회원사명2 | String | Y | 6 | - |
| Response Body | `bidtrad2` | 매수회원사명2 | String | Y | 6 | - |
| Response Body | `tradmdvol2` | 매도거래량2 | String | Y | 10 | - |
| Response Body | `tradmsvol2` | 매수거래량2 | String | Y | 10 | - |
| Response Body | `tradmdrate2` | 매도거래량비중2 | String | Y | 6.2 | - |
| Response Body | `tradmsrate2` | 매수거래량비중2 | String | Y | 6.2 | - |
| Response Body | `tradmdcha2` | 매도거래량직전대비2 | String | Y | 10 | - |
| Response Body | `tradmscha2` | 매수거래량직전대비2 | String | Y | 10 | - |
| Response Body | `offerno3` | 매도증권사코드3 | String | Y | 3 | - |
| Response Body | `bidno3` | 매수증권사코드3 | String | Y | 3 | - |
| Response Body | `offertrad3` | 매도회원사명3 | String | Y | 6 | - |
| Response Body | `bidtrad3` | 매수회원사명3 | String | Y | 6 | - |
| Response Body | `tradmdvol3` | 매도거래량3 | String | Y | 10 | - |
| Response Body | `tradmsvol3` | 매수거래량3 | String | Y | 10 | - |
| Response Body | `tradmdrate3` | 매도거래량비중3 | String | Y | 6.2 | - |
| Response Body | `tradmsrate3` | 매수거래량비중3 | String | Y | 6.2 | - |
| Response Body | `tradmdcha3` | 매도거래량직전대비3 | String | Y | 10 | - |
| Response Body | `tradmscha3` | 매수거래량직전대비3 | String | Y | 10 | - |
| Response Body | `offerno4` | 매도증권사코드4 | String | Y | 3 | - |
| Response Body | `bidno4` | 매수증권사코드4 | String | Y | 3 | - |
| Response Body | `offertrad4` | 매도회원사명4 | String | Y | 6 | - |
| Response Body | `bidtrad4` | 매수회원사명4 | String | Y | 6 | - |
| Response Body | `tradmdvol4` | 매도거래량4 | String | Y | 10 | - |
| Response Body | `tradmsvol4` | 매수거래량4 | String | Y | 10 | - |
| Response Body | `tradmdrate4` | 매도거래량비중4 | String | Y | 6.2 | - |
| Response Body | `tradmsrate4` | 매수거래량비중4 | String | Y | 6.2 | - |
| Response Body | `tradmdcha4` | 매도거래량직전대비4 | String | Y | 10 | - |
| Response Body | `tradmscha4` | 매수거래량직전대비4 | String | Y | 10 | - |
| Response Body | `offerno5` | 매도증권사코드5 | String | Y | 3 | - |
| Response Body | `bidno5` | 매수증권사코드5 | String | Y | 3 | - |
| Response Body | `offertrad5` | 매도회원사명5 | String | Y | 6 | - |
| Response Body | `bidtrad5` | 매수회원사명5 | String | Y | 6 | - |
| Response Body | `tradmdvol5` | 매도거래량5 | String | Y | 10 | - |
| Response Body | `tradmsvol5` | 매수거래량5 | String | Y | 10 | - |
| Response Body | `tradmdrate5` | 매도거래량비중5 | String | Y | 6.2 | - |
| Response Body | `tradmsrate5` | 매수거래량비중5 | String | Y | 6.2 | - |
| Response Body | `tradmdcha5` | 매도거래량직전대비5 | String | Y | 10 | - |
| Response Body | `tradmscha5` | 매수거래량직전대비5 | String | Y | 10 | - |
| Response Body | `ftradmdvol` | 외국계증권사매도합계 | String | Y | 10 | - |
| Response Body | `ftradmsvol` | 외국계증권사매수합계 | String | Y | 10 | - |
| Response Body | `ftradmdrate` | 외국계증권사매도거래량비중 | String | Y | 6.2 | - |
| Response Body | `ftradmsrate` | 외국계증권사매수거래량비중 | String | Y | 6.2 | - |
| Response Body | `ftradmdcha` | 외국계증권사매도거래량직전대비 | String | Y | 10 | - |
| Response Body | `ftradmscha` | 외국계증권사매수거래량직전대비 | String | Y | 10 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 6 | - |
| Response Body | `tradmdval1` | 매도거래대금1 | String | Y | 15 | - |
| Response Body | `tradmsval1` | 매수거래대금1 | String | Y | 15 | - |
| Response Body | `tradmdavg1` | 매도평균단가1 | String | Y | 7 | - |
| Response Body | `tradmsavg1` | 매수평균단가1 | String | Y | 7 | - |
| Response Body | `tradmdval2` | 매도거래대금2 | String | Y | 15 | - |
| Response Body | `tradmsval2` | 매수거래대금2 | String | Y | 15 | - |
| Response Body | `tradmdavg2` | 매도평균단가2 | String | Y | 7 | - |
| Response Body | `tradmsavg2` | 매수평균단가2 | String | Y | 7 | - |
| Response Body | `tradmdval3` | 매도거래대금3 | String | Y | 15 | - |
| Response Body | `tradmsval3` | 매수거래대금3 | String | Y | 15 | - |
| Response Body | `tradmdavg3` | 매도평균단가3 | String | Y | 7 | - |
| Response Body | `tradmsavg3` | 매수평균단가3 | String | Y | 7 | - |
| Response Body | `tradmdval4` | 매도거래대금4 | String | Y | 15 | - |
| Response Body | `tradmsval4` | 매수거래대금4 | String | Y | 15 | - |
| Response Body | `tradmdavg4` | 매도평균단가4 | String | Y | 7 | - |
| Response Body | `tradmsavg4` | 매수평균단가4 | String | Y | 7 | - |
| Response Body | `tradmdval5` | 매도거래대금5 | String | Y | 15 | - |
| Response Body | `tradmsval5` | 매수거래대금5 | String | Y | 15 | - |
| Response Body | `tradmdavg5` | 매도평균단가5 | String | Y | 7 | - |
| Response Body | `tradmsavg5` | 매수평균단가5 | String | Y | 7 | - |
| Response Body | `ftradmdval` | 외국계증권사매도거래대금 | String | Y | 15 | - |
| Response Body | `ftradmsval` | 외국계증권사매수거래대금 | String | Y | 15 | - |
| Response Body | `ftradmdavg` | 외국계증권사매도평균단가 | String | Y | 7 | - |
| Response Body | `ftradmsavg` | 외국계증권사매수평균단가 | String | Y | 7 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6Ijk5NGZkNjI5LWY4OGItNGQ0Ni05NTE0LTJjNmQzMjM1MWIyYSIsIm5iZiI6MTY4NjY0MDc3NywiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzI3MTc3LCJpYXQiOjE2ODY2NDA3NzcsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.WT1pgGw-gawv2GAQiRNcEphlv3BfXZfeVG03wwBCoCKpUYYC0l019Oc0JJIqoR41WHm8kEuNgDgYhlib_LxI7g",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "K1_",
    "tr_key": "005930"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "K1_",
    "tr_key": "005930"
  },
  "body": {
    "tradmdrate1": "13.15",
    "tradmdvol5": "34319",
    "tradmdvol3": "47293",
    "tradmdrate3": "10.83",
    "tradmdrate2": "11.00",
    "tradmdvol4": "36536",
    "offerno2": "033",
    "tradmdrate5": "7.86",
    "offerno1": "017",
    "tradmdrate4": "8.37",
    "offerno4": "063",
    "offerno3": "086",
    "bidtrad4": "맥쿼리",
    "offerno5": "041",
    "bidtrad5": "씨엘",
    "bidtrad2": "KB증권",
    "bidtrad3": "LS증권",
    "tradmdvol1": "57446",
    "bidtrad1": "UBS",
    "tradmdvol2": "48037",
    "tradmdval3": "3410",
    "offertrad5": "씨엘",
    "tradmdval4": "2634",
    "tradmdval1": "4141",
    "tradmdval2": "3463",
    "tradmdval5": "2474",
    "tradmscha2": "79121",
    "ftradmdval": "5938",
    "tradmscha1": "82043",
    "tradmscha4": "30697",
    "tradmscha3": "45048",
    "offertrad2": "JP모간",
    "offertrad1": "KB증권",
    "offertrad4": "eBEST",
    "offertrad3": "BNK 증",
    "tradmdcha5": "34319",
    "tradmdcha4": "36536",
    "tradmsavg1": "72106",
    "tradmsavg2": "72114",
    "tradmscha5": "30429",
    "tradmdavg1": "72083",
    "tradmdavg3": "72100",
    "tradmdavg2": "72100",
    "tradmdavg5": "72100",
    "tradmdavg4": "72096",
    "tradmsavg3": "72100",
    "ftradmscha": "0000143169",
    "tradmsavg4": "72100",
    "ftradmdvol": "0000082356",
    "tradmsavg5": "72100",
    "ftradmdavg": "72100",
    "tradmsval3": "3248",
    "tradmsval2": "5706",
    "tradmsval5": "2194",
    "ftradmsval": "10323",
    "tradmsval4": "2213",
    "tradmsval1": "5916",
    "tradmdcha1": "57446",
    "tradmdcha3": "47293",
    "tradmdcha2": "48037",
    "bidno1": "043",
    "bidno3": "063",
    "tradmsvol5": "30429",
    "bidno2": "017",
    "tradmsvol4": "30697",
    "bidno5": "041",
    "bidno4": "035",
    "tradmsvol1": "82043",
    "tradmsvol3": "45048",
    "tradmsvol2": "79121",
    "tradmsrate2": "18.12",
    "tradmsrate1": "18.79",
    "tradmsrate4": "7.03",
    "tradmsrate3": "10.32",
    "tradmsrate5": "6.97",
    "ftradmsvol": "0000143169",
    "ftradmdcha": "0000082356",
    "ftradmsrate": "32.78",
    "shcode": "005930",
    "ftradmsavg": "72104",
    "ftradmdrate": "18.86"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
