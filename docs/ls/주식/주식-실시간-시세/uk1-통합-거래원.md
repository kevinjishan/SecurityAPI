---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "3d93aeaa-3da0-4c4e-9412-5b87e1d33189"
tr_code: "UK1"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (통합)거래원 (UK1)

<!-- request_field_count: 4 -->
<!-- response_field_count: 85 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (통합)거래원 |
| TR코드 | `UK1` |
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
| Response Body | `tradmsrate1` | 매수거래량비중1 | Number | Y | 6.2 | - |
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
| Response Body | `ftradmdvol` | 외국계증권사매도합계 | String | Y | 10 | - |
| Response Body | `ftradmsvol` | 외국계증권사매수합계 | String | Y | 10 | - |
| Response Body | `ftradmdrate` | 외국계증권사매도거래량비중 | Number | Y | 6.2 | - |
| Response Body | `ftradmsrate` | 외국계증권사매수거래량비중 | Number | Y | 6.2 | - |
| Response Body | `ftradmdcha` | 외국계증권사매도거래량직전대비 | String | Y | 10 | - |
| Response Body | `ftradmscha` | 외국계증권사매수거래량직전대비 | String | Y | 10 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 9 | - |
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
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjlkZmJhYWNiLWY5NWUtNGMwMi1hZGFlLTBhYzI3YTU4ZmM2NiIsIm5iZiI6MTc0MjUxMDc3OSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQyNTk0NDAwLCJpYXQiOjE3NDI1MTA3NzksImp0aSI6IlBTUFphQmp2S3V6V3VjeGlvYzhib21jdmsxY0U3cUs2V2JubSJ9.r8eqrh_LoLWvOa2WhCBLnXilk-2LZLSGcOSwJ3KuNolsHwRFvncrG0FEdw2sqhk",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "UK1",
    "tr_key": "U000080   "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "UK1",
    "tr_key": "U000080   "
  },
  "body": {
    "tradmdrate1": "17.12",
    "tradmdvol5": "11626",
    "tradmdvol3": "24816",
    "tradmdrate3": "9.46",
    "tradmdrate2": "10.35",
    "tradmdvol4": "16941",
    "offerno2": "012",
    "tradmdrate5": "4.43",
    "offerno1": "050",
    "tradmdrate4": "6.46",
    "offerno4": "003",
    "offerno3": "002",
    "bidtrad4": "메릴린",
    "offerno5": "005",
    "bidtrad5": "메리츠",
    "bidtrad2": "신한투",
    "bidtrad3": "NH투자",
    "tradmdvol1": "44893",
    "bidtrad1": "키움증",
    "tradmdvol2": "27140",
    "tradmdval3": "486",
    "offertrad5": "미래에",
    "tradmdval4": "331",
    "tradmdval1": "880",
    "tradmdval2": "532",
    "tradmdval5": "228",
    "tradmscha2": "0",
    "ftradmdval": "0",
    "tradmscha1": "0",
    "tradmscha4": "0",
    "tradmscha3": "0",
    "offertrad2": "NH투자",
    "offertrad1": "키움증",
    "offertrad4": "한국증",
    "offertrad3": "신한투",
    "tradmdcha5": "0",
    "tradmdcha4": "0",
    "tradmsavg1": "19655",
    "tradmsavg2": "19584",
    "tradmscha5": "0",
    "tradmdavg1": "19615",
    "tradmdavg3": "19602",
    "tradmdavg2": "19632",
    "tradmdavg5": "19656",
    "tradmdavg4": "19563",
    "tradmsavg3": "19571",
    "ftradmscha": "0000000000",
    "tradmsavg4": "19763",
    "ftradmdvol": "0000000911",
    "tradmsavg5": "19726",
    "ftradmdavg": "0",
    "tradmsval3": "414",
    "tradmsval2": "793",
    "tradmsval5": "260",
    "ftradmsval": "0",
    "tradmsval4": "356",
    "tradmsval1": "841",
    "tradmdcha1": "3",
    "tradmdcha3": "0",
    "tradmdcha2": "0",
    "bidno1": "050",
    "bidno3": "012",
    "tradmsvol5": "13187",
    "bidno2": "002",
    "tradmsvol4": "18035",
    "bidno5": "010",
    "bidno4": "044",
    "tradmsvol1": "42815",
    "tradmsvol3": "21185",
    "tradmsvol2": "40513",
    "tradmsrate2": "15.45",
    "tradmsrate1": "16.33",
    "tradmsrate4": "6.88",
    "tradmsrate3": "8.08",
    "tradmsrate5": "5.03",
    "ftradmsvol": "0000018035",
    "ftradmdcha": "0000000000",
    "ftradmsrate": "6.88",
    "shcode": "000080",
    "ftradmsavg": "0",
    "ftradmdrate": "0.35",
    "ex_shcode": "U000080",
    "time": "160349",
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
