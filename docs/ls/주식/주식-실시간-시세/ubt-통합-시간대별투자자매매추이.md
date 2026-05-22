---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "3b7cac40-3314-4707-92bc-864802a970e7"
tr_code: "UBT"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (통합)시간대별투자자매매추이 (UBT)

<!-- request_field_count: 4 -->
<!-- response_field_count: 88 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (통합)시간대별투자자매매추이 |
| TR코드 | `UBT` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 4 | U + 업종코드 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `tjjtime` | 수신시간 | String | Y | 8 | - |
| Response Body | `tjjcode1` | 투자자코드1(개인) | String | Y | 4 | - |
| Response Body | `msvolume1` | 매수거래량1 | Number | Y | 8 | - |
| Response Body | `mdvolume1` | 매도거래량1 | Number | Y | 8 | - |
| Response Body | `msvol1` | 거래량순매수1 | Number | Y | 8 | - |
| Response Body | `msvalue1` | 매수거래대금1 | Number | Y | 6 | - |
| Response Body | `mdvalue1` | 매도거래대금1 | Number | Y | 6 | - |
| Response Body | `msval1` | 거래대금순매수1 | Number | Y | 6 | - |
| Response Body | `tjjcode2` | 투자자코드2(외국인) | String | Y | 4 | - |
| Response Body | `msvolume2` | 매수거래량2 | Number | Y | 8 | - |
| Response Body | `mdvolume2` | 매도거래량2 | Number | Y | 8 | - |
| Response Body | `msvol2` | 거래량순매수2 | Number | Y | 8 | - |
| Response Body | `msvalue2` | 매수거래대금2 | Number | Y | 6 | - |
| Response Body | `mdvalue2` | 매도거래대금2 | Number | Y | 6 | - |
| Response Body | `msval2` | 거래대금순매수2 | Number | Y | 6 | - |
| Response Body | `tjjcode3` | 투자자코드3(기관계) | String | Y | 4 | - |
| Response Body | `msvolume3` | 매수거래량3 | Number | Y | 8 | - |
| Response Body | `mdvolume3` | 매도거래량3 | Number | Y | 8 | - |
| Response Body | `msvol3` | 거래량순매수3 | Number | Y | 8 | - |
| Response Body | `msvalue3` | 매수거래대금3 | Number | Y | 6 | - |
| Response Body | `mdvalue3` | 매도거래대금3 | Number | Y | 6 | - |
| Response Body | `msval3` | 거래대금순매수3 | Number | Y | - | - |
| Response Body | `tjjcode4` | 투자자코드4(증권) | String | Y | 4 | - |
| Response Body | `msvolume4` | 매수거래량4 | Number | Y | 8 | - |
| Response Body | `mdvolume4` | 매도거래량4 | Number | Y | 8 | - |
| Response Body | `msvol4` | 거래량순매수4 | Number | Y | 8 | - |
| Response Body | `msvalue4` | 매수거래대금4 | Number | Y | 6 | - |
| Response Body | `mdvalue4` | 매도거래대금4 | Number | Y | 6 | - |
| Response Body | `msval4` | 거래대금순매수4 | Number | Y | 6 | - |
| Response Body | `tjjcode5` | 투자자코드5(투신) | String | Y | 4 | - |
| Response Body | `msvolume5` | 매수거래량5 | Number | Y | 8 | - |
| Response Body | `mdvolume5` | 매도거래량5 | Number | Y | 8 | - |
| Response Body | `msvol5` | 거래량순매수5 | Number | Y | 8 | - |
| Response Body | `msvalue5` | 매수거래대금5 | Number | Y | 6 | - |
| Response Body | `mdvalue5` | 매도거래대금5 | Number | Y | 6 | - |
| Response Body | `msval5` | 거래대금순매수5 | Number | Y | 6 | - |
| Response Body | `tjjcode6` | 투자자코드6(은행) | String | Y | 4 | - |
| Response Body | `msvolume6` | 매수거래량6 | Number | Y | 8 | - |
| Response Body | `mdvolume6` | 매도거래량6 | Number | Y | 8 | - |
| Response Body | `msvol6` | 거래량순매수6 | Number | Y | 8 | - |
| Response Body | `msvalue6` | 매수거래대금6 | Number | Y | 6 | - |
| Response Body | `mdvalue6` | 매도거래대금6 | Number | Y | 6 | - |
| Response Body | `msval6` | 거래대금순매수6 | Number | Y | 6 | - |
| Response Body | `tjjcode7` | 투자자코드7(보험) | String | Y | 4 | - |
| Response Body | `msvolume7` | 매수거래량7 | Number | Y | 8 | - |
| Response Body | `mdvolume7` | 매도거래량7 | Number | Y | 8 | - |
| Response Body | `msvol7` | 거래량순매수7 | Number | Y | 8 | - |
| Response Body | `msvalue7` | 매수거래대금7 | Number | Y | 6 | - |
| Response Body | `mdvalue7` | 매도거래대금7 | Number | Y | 6 | - |
| Response Body | `msval7` | 거래대금순매수7 | Number | Y | 6 | - |
| Response Body | `tjjcode8` | 투자자코드8(종금) | String | Y | 4 | - |
| Response Body | `msvolume8` | 매수거래량8 | Number | Y | 8 | - |
| Response Body | `mdvolume8` | 매도거래량8 | Number | Y | 8 | - |
| Response Body | `msvol8` | 거래량순매수8 | Number | Y | 8 | - |
| Response Body | `msvalue8` | 매수거래대금8 | Number | Y | 6 | - |
| Response Body | `mdvalue8` | 매도거래대금8 | Number | Y | 6 | - |
| Response Body | `msval8` | 거래대금순매수8 | Number | Y | 6 | - |
| Response Body | `tjjcode9` | 투자자코드9(기금) | String | Y | 4 | - |
| Response Body | `msvolume9` | 매수거래량9 | Number | Y | 8 | - |
| Response Body | `mdvolume9` | 매도거래량9 | Number | Y | 8 | - |
| Response Body | `msvol9` | 거래량순매수9 | Number | Y | 8 | - |
| Response Body | `msvalue9` | 매수거래대금9 | Number | Y | 6 | - |
| Response Body | `mdvalue9` | 매도거래대금9 | Number | Y | 6 | - |
| Response Body | `msval9` | 거래대금순매수9 | Number | Y | 6 | - |
| Response Body | `tjjcode10` | 투자자코드10(선물업자) | String | Y | 4 | - |
| Response Body | `msvolume10` | 매수거래량10 | Number | Y | 8 | - |
| Response Body | `mdvolume10` | 매도거래량10 | Number | Y | 8 | - |
| Response Body | `msvol10` | 거래량순매수10 | Number | Y | 8 | - |
| Response Body | `msvalue10` | 매수거래대금10 | Number | Y | 6 | - |
| Response Body | `mdvalue10` | 매도거래대금10 | Number | Y | 6 | - |
| Response Body | `msval10` | 거래대금순매수10 | Number | Y | 6 | - |
| Response Body | `tjjcode11` | 투자자코드11(기타) | String | Y | 4 | - |
| Response Body | `msvolume11` | 매수거래량11 | Number | Y | 8 | - |
| Response Body | `mdvolume11` | 매도거래량11 | Number | Y | 8 | - |
| Response Body | `msvol11` | 거래량순매수11 | Number | Y | 8 | - |
| Response Body | `msvalue11` | 매수거래대금11 | Number | Y | 6 | - |
| Response Body | `mdvalue11` | 매도거래대금11 | Number | Y | 6 | - |
| Response Body | `msval11` | 거래대금순매수11 | Number | Y | 6 | - |
| Response Body | `upcode` | 업종코드 | String | Y | 3 | - |
| Response Body | `tjjcode0` | 투자자코드0(사모펀드) | String | Y | 4 | - |
| Response Body | `msvolume0` | 매수거래량0 | String | Y | 8 | - |
| Response Body | `mdvolume0` | 매도거래량0 | Number | Y | 8 | - |
| Response Body | `msvol0` | 거래량순매수0 | Number | Y | 8 | - |
| Response Body | `msvalue0` | 매수거래대금0 | Number | Y | 6 | - |
| Response Body | `mdvalue0` | 매도거래대금0 | Number | Y | 6 | - |
| Response Body | `msval0` | 거래대금순매수0 | Number | Y | 6 | - |
| Response Body | `ex_upcode` | 거래소별업종코드 | String | Y | 4 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImNkMzdiY2FmLTUwMjAtNGY2Yy1hYzM3LTcxY2JhZjc2MGE2OCIsIm5iZiI6MTc0Mjg2MTM0OSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQyOTQwMDAwLCJpYXQiOjE3NDI4NjEzNDksImp0aSI6IlBTVXJIa0pWaWVRMzhMREN5NkVVNUpCNWlmV1gzRDhwRlBKcSJ9.KpX1lQQIs4W2HdQIHdJDuJ1AWaYH69soejsKkJFv_8bF4jnlocMJsushvYbesrs2BM2evkz7",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "UBT",
    "tr_key": "U001"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "UBT",
    "tr_key": "U001"
  },
  "body": {
    "mdvalue0": "1344",
    "mdvalue1": "55426",
    "msvolume8": "474",
    "msvolume9": "13560",
    "msvolume4": "10244",
    "mdvalue6": "78",
    "msvolume5": "2663",
    "mdvalue7": "566",
    "msvolume6": "82",
    "mdvalue8": "87",
    "msvolume7": "809",
    "mdvalue9": "9457",
    "mdvalue2": "25515",
    "msvolume0": "1410",
    "msvolume1": "342538",
    "mdvalue3": "16752",
    "msvolume2": "85505",
    "mdvalue4": "3649",
    "msvolume3": "29246",
    "mdvalue5": "1568",
    "mdvolume0": "2589",
    "mdvolume9": "14896",
    "mdvolume3": "30145",
    "mdvolume4": "7630",
    "mdvolume1": "338330",
    "mdvolume2": "89719",
    "mdvolume7": "1125",
    "mdvolume8": "738",
    "mdvolume5": "3000",
    "mdvolume6": "164",
    "msvalue1": "54772",
    "msvalue2": "24751",
    "msvalue0": "907",
    "msvalue5": "1490",
    "msvalue6": "55",
    "msvalue3": "17448",
    "msvol11": "905",
    "msvalue4": "4945",
    "msvol10": "0",
    "msvalue9": "9262",
    "mdvalue11": "770",
    "msvalue7": "499",
    "msvalue8": "287",
    "mdvalue10": "0",
    "tjjtime": "16460001",
    "tjjcode0": "0000",
    "tjjcode10": "0011",
    "msvolume10": "0",
    "tjjcode11": "0007",
    "tjjcode6": "0004",
    "msval6": "-23",
    "tjjcode5": "0003",
    "msval5": "-78",
    "msval4": "1296",
    "tjjcode8": "0005",
    "msval3": "697",
    "tjjcode7": "0002",
    "tjjcode2": "0017",
    "tjjcode1": "0008",
    "msval9": "-196",
    "tjjcode4": "0001",
    "msval8": "200",
    "tjjcode3": "0018",
    "msval7": "-66",
    "msval2": "-764",
    "msval1": "-655",
    "tjjcode9": "0006",
    "mdvolume10": "0",
    "msval0": "-437",
    "mdvolume11": "3275",
    "msvol9": "-1335",
    "msvol5": "-337",
    "msvol6": "-82",
    "msvol7": "-316",
    "msvol8": "-264",
    "msvol1": "4208",
    "ex_upcode": "U001",
    "msvol2": "-4214",
    "msvol3": "-899",
    "msval11": "722",
    "msvol4": "2614",
    "msval10": "0",
    "msvol0": "-1178",
    "msvolume11": "4179",
    "msvalue10": "0",
    "msvalue11": "1492",
    "upcode": "001"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
