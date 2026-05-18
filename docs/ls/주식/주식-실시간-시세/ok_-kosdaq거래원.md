---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "5t341rq3-755f-y536-p4l4-k44f5xm28l82"
tr_code: "OK_"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSDAQ거래원 (OK_)

<!-- request_field_count: 4 -->
<!-- response_field_count: 82 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | KOSDAQ거래원 |
| TR코드 | `OK_` |
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
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "OK_",
    "tr_key": "086520"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "OK_",
    "tr_key": "086520"
  },
  "body": {
    "tradmdrate1": "32.67",
    "tradmdvol5": "4218",
    "tradmdvol3": "7053",
    "tradmdrate3": "11.04",
    "tradmdrate2": "16.00",
    "tradmdvol4": "4439",
    "offerno2": "005",
    "tradmdrate5": "6.60",
    "offerno1": "050",
    "tradmdrate4": "6.95",
    "offerno4": "012",
    "offerno3": "002",
    "bidtrad4": "삼성증",
    "offerno5": "003",
    "bidtrad5": "NH투자",
    "bidtrad2": "한국증",
    "bidtrad3": "미래에",
    "tradmdvol1": "20868",
    "bidtrad1": "키움증",
    "tradmdvol2": "10220",
    "tradmdval3": "5332",
    "offertrad5": "한국증",
    "tradmdval4": "3351",
    "tradmdval1": "15746",
    "tradmdval2": "7738",
    "tradmdval5": "3181",
    "tradmscha2": "7210",
    "ftradmdval": "0",
    "tradmscha1": "21164",
    "tradmscha4": "5739",
    "tradmscha3": "5930",
    "offertrad2": "미래에",
    "offertrad1": "키움증",
    "offertrad4": "NH투자",
    "offertrad3": "신한투",
    "tradmdcha5": "4218",
    "tradmdcha4": "4439",
    "tradmsavg1": "755482",
    "tradmsavg2": "755335",
    "tradmscha5": "4572",
    "tradmdavg1": "754570",
    "tradmdavg3": "756014",
    "tradmdavg2": "757173",
    "tradmdavg5": "754197",
    "tradmdavg4": "754884",
    "tradmsavg3": "755310",
    "ftradmscha": "0000000000",
    "tradmsavg4": "756039",
    "ftradmdvol": "0000000000",
    "tradmsavg5": "755234",
    "ftradmdavg": " ",
    "tradmsval3": "4479",
    "tradmsval2": "5446",
    "tradmsval5": "3453",
    "ftradmsval": "0",
    "tradmsval4": "4339",
    "tradmsval1": "15989",
    "tradmdcha1": "20868",
    "tradmdcha3": "7053",
    "tradmdcha2": "10220",
    "bidno1": "050",
    "bidno3": "005",
    "tradmsvol5": "4572",
    "bidno2": "003",
    "tradmsvol4": "5739",
    "bidno5": "012",
    "bidno4": "030",
    "tradmsvol1": "21164",
    "tradmsvol3": "5930",
    "tradmsvol2": "7210",
    "tradmsrate2": "11.29",
    "tradmsrate1": "33.14",
    "tradmsrate4": "8.99",
    "tradmsrate3": "9.28",
    "tradmsrate5": "7.16",
    "ftradmsvol": "0000000000",
    "ftradmdcha": "0000000000",
    "ftradmsrate": "0.00",
    "shcode": "086520",
    "ftradmsavg": " ",
    "ftradmdrate": "0.00"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
