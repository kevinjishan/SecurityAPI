---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "1yd75440-004h-107x-5r4x-30pmkm6n7561"
tr_code: "k1_"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# ELW거래원 (k1_)

<!-- request_field_count: 4 -->
<!-- response_field_count: 58 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | ELW거래원 |
| TR코드 | `k1_` |
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

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "k1_",
    "tr_key": "52HAAA"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "k1_",
    "tr_key": "52HAAA"
  },
  "body": {
    "tradmdrate1": "100.00",
    "tradmdvol5": "0",
    "tradmdvol3": "0",
    "tradmdrate3": "0.00",
    "tradmdrate2": "0.00",
    "tradmdvol4": "0",
    "offerno2": "",
    "tradmdrate5": "0.00",
    "offerno1": "005",
    "tradmdrate4": "0.00",
    "offerno4": "",
    "offerno3": "",
    "bidtrad4": "",
    "offerno5": "",
    "bidtrad5": "",
    "bidtrad2": "",
    "bidtrad3": "",
    "tradmdvol1": "30",
    "bidtrad1": "키움증",
    "tradmdvol2": "0",
    "offertrad5": "",
    "tradmscha2": "0",
    "tradmscha1": "20",
    "tradmscha4": "0",
    "tradmscha3": "0",
    "offertrad2": "",
    "offertrad1": "미래에",
    "offertrad4": "",
    "offertrad3": "",
    "tradmdcha5": "0",
    "tradmdcha4": "0",
    "tradmscha5": "0",
    "ftradmscha": "0000000000",
    "ftradmdvol": "0000000000",
    "tradmdcha1": "20",
    "tradmdcha3": "0",
    "tradmdcha2": "0",
    "bidno1": "050",
    "bidno3": "",
    "tradmsvol5": "0",
    "bidno2": "",
    "tradmsvol4": "0",
    "bidno5": "",
    "bidno4": "",
    "tradmsvol1": "30",
    "tradmsvol3": "0",
    "tradmsvol2": "0",
    "tradmsrate2": "0.00",
    "tradmsrate1": "100.00",
    "tradmsrate4": "0.00",
    "tradmsrate3": "0.00",
    "tradmsrate5": "0.00",
    "ftradmsvol": "0000000000",
    "ftradmdcha": "0000000000",
    "ftradmsrate": "0.00",
    "shcode": "52HAAA",
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
