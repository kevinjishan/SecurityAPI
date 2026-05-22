---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cd909627-82e5-40c9-b313-1a8fd2d7b119&api_id=d67d0790-4b26-447b-82eb-e9642f66057c"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "실시간 시세 투자정보"
api_id: "d67d0790-4b26-447b-82eb-e9642f66057c"
api_name: "[실시간 시세 투자정보] 투자정보"
tr_id: "428y83h8-v5nr-1u57-z1o5-mea473p5265i"
tr_code: "BMT"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/investinfo"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 시간대별투자자매매추이 (BMT)

<!-- request_field_count: 4 -->
<!-- response_field_count: 87 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 실시간 시세 투자정보 |
| API 페이지 | [실시간 시세 투자정보] 투자정보 |
| TR명 | 시간대별투자자매매추이 |
| TR코드 | `BMT` |
| 초당 전송 건수 | - |
| 설명 | 투자정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/investinfo` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 3 | 001 : 코스피<br>101 : KP200<br>301 : 코스닥<br>550 : ELW<br>560 : ETF<br>600 : 주식선물<br>700 : 콜옵션<br>800 : 풋옵션<br>900 : 선물<br>940 : 미니KP200선물<br>941 : 미니KP200옵션-콜<br>942 : 미니KP200옵션-풋<br>946 : 코스피200위클리-콜<br>947 : 코스피200위클리-풋 |

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
| Response Body | `msvolume1` | 매수거래량1 | String | Y | 8 | - |
| Response Body | `mdvolume1` | 매도거래량1 | String | Y | 8 | - |
| Response Body | `msvol1` | 거래량순매수1 | String | Y | 8 | - |
| Response Body | `msvalue1` | 매수거래대금1 | String | Y | 6 | - |
| Response Body | `mdvalue1` | 매도거래대금1 | String | Y | 6 | - |
| Response Body | `msval1` | 거래대금순매수1 | String | Y | 6 | - |
| Response Body | `tjjcode2` | 투자자코드2(외국인) | String | Y | 4 | - |
| Response Body | `msvolume2` | 매수거래량2 | String | Y | 8 | - |
| Response Body | `mdvolume2` | 매도거래량2 | String | Y | 8 | - |
| Response Body | `msvol2` | 거래량순매수2 | String | Y | 8 | - |
| Response Body | `msvalue2` | 매수거래대금2 | String | Y | 6 | - |
| Response Body | `mdvalue2` | 매도거래대금2 | String | Y | 6 | - |
| Response Body | `msval2` | 거래대금순매수2 | String | Y | 6 | - |
| Response Body | `tjjcode3` | 투자자코드3(기관계) | String | Y | 4 | - |
| Response Body | `msvolume3` | 매수거래량3 | String | Y | 8 | - |
| Response Body | `mdvolume3` | 매도거래량3 | String | Y | 8 | - |
| Response Body | `msvol3` | 거래량순매수3 | String | Y | 8 | - |
| Response Body | `msvalue3` | 매수거래대금3 | String | Y | 6 | - |
| Response Body | `mdvalue3` | 매도거래대금3 | String | Y | 6 | - |
| Response Body | `msval3` | 거래대금순매수3 | String | Y | 6 | - |
| Response Body | `tjjcode4` | 투자자코드4(증권) | String | Y | 4 | - |
| Response Body | `msvolume4` | 매수거래량4 | String | Y | 8 | - |
| Response Body | `mdvolume4` | 매도거래량4 | String | Y | 8 | - |
| Response Body | `msvol4` | 거래량순매수4 | String | Y | 8 | - |
| Response Body | `msvalue4` | 매수거래대금4 | String | Y | 6 | - |
| Response Body | `mdvalue4` | 매도거래대금4 | String | Y | 6 | - |
| Response Body | `msval4` | 거래대금순매수4 | String | Y | 6 | - |
| Response Body | `tjjcode5` | 투자자코드5(투신) | String | Y | 4 | - |
| Response Body | `msvolume5` | 매수거래량5 | String | Y | 8 | - |
| Response Body | `mdvolume5` | 매도거래량5 | String | Y | 8 | - |
| Response Body | `msvol5` | 거래량순매수5 | String | Y | 8 | - |
| Response Body | `msvalue5` | 매수거래대금5 | String | Y | 6 | - |
| Response Body | `mdvalue5` | 매도거래대금5 | String | Y | 6 | - |
| Response Body | `msval5` | 거래대금순매수5 | String | Y | 6 | - |
| Response Body | `tjjcode6` | 투자자코드6(은행) | String | Y | 4 | - |
| Response Body | `msvolume6` | 매수거래량6 | String | Y | 8 | - |
| Response Body | `mdvolume6` | 매도거래량6 | String | Y | 8 | - |
| Response Body | `msvol6` | 거래량순매수6 | String | Y | 8 | - |
| Response Body | `msvalue6` | 매수거래대금6 | String | Y | 6 | - |
| Response Body | `mdvalue6` | 매도거래대금6 | String | Y | 6 | - |
| Response Body | `msval6` | 거래대금순매수6 | String | Y | 6 | - |
| Response Body | `tjjcode7` | 투자자코드7(보험) | String | Y | 4 | - |
| Response Body | `msvolume7` | 매수거래량7 | String | Y | 8 | - |
| Response Body | `mdvolume7` | 매도거래량7 | String | Y | 8 | - |
| Response Body | `msvol7` | 거래량순매수7 | String | Y | 8 | - |
| Response Body | `msvalue7` | 매수거래대금7 | String | Y | 6 | - |
| Response Body | `mdvalue7` | 매도거래대금7 | String | Y | 6 | - |
| Response Body | `msval7` | 거래대금순매수7 | String | Y | 6 | - |
| Response Body | `tjjcode8` | 투자자코드8(종금) | String | Y | 4 | - |
| Response Body | `msvolume8` | 매수거래량8 | String | Y | 8 | - |
| Response Body | `mdvolume8` | 매도거래량8 | String | Y | 8 | - |
| Response Body | `msvol8` | 거래량순매수8 | String | Y | 8 | - |
| Response Body | `msvalue8` | 매수거래대금8 | String | Y | 6 | - |
| Response Body | `mdvalue8` | 매도거래대금8 | String | Y | 6 | - |
| Response Body | `msval8` | 거래대금순매수8 | String | Y | 6 | - |
| Response Body | `tjjcode9` | 투자자코드9(기금) | String | Y | 4 | - |
| Response Body | `msvolume9` | 매수거래량9 | String | Y | 8 | - |
| Response Body | `mdvolume9` | 매도거래량9 | String | Y | 8 | - |
| Response Body | `msvol9` | 거래량순매수9 | String | Y | 8 | - |
| Response Body | `msvalue9` | 매수거래대금9 | String | Y | 6 | - |
| Response Body | `mdvalue9` | 매도거래대금9 | String | Y | 6 | - |
| Response Body | `msval9` | 거래대금순매수9 | String | Y | 6 | - |
| Response Body | `tjjcode10` | 투자자코드10(선물업자) | String | Y | 4 | - |
| Response Body | `msvolume10` | 매수거래량10 | String | Y | 8 | - |
| Response Body | `mdvolume10` | 매도거래량10 | String | Y | 8 | - |
| Response Body | `msvol10` | 거래량순매수10 | String | Y | 8 | - |
| Response Body | `msvalue10` | 매수거래대금10 | String | Y | 6 | - |
| Response Body | `mdvalue10` | 매도거래대금10 | String | Y | 6 | - |
| Response Body | `msval10` | 거래대금순매수10 | String | Y | 6 | - |
| Response Body | `tjjcode11` | 투자자코드11(기타) | String | Y | 4 | - |
| Response Body | `msvolume11` | 매수거래량11 | String | Y | 8 | - |
| Response Body | `mdvolume11` | 매도거래량11 | String | Y | 8 | - |
| Response Body | `msvol11` | 거래량순매수11 | String | Y | 8 | - |
| Response Body | `msvalue11` | 매수거래대금11 | String | Y | 6 | - |
| Response Body | `mdvalue11` | 매도거래대금11 | String | Y | 6 | - |
| Response Body | `msval11` | 거래대금순매수11 | String | Y | 6 | - |
| Response Body | `upcode` | 업종코드 | String | Y | 3 | - |
| Response Body | `tjjcode0` | 투자자코드0(사모펀드) | String | Y | 4 | - |
| Response Body | `msvolume0` | 매수거래량0 | String | Y | 8 | - |
| Response Body | `mdvolume0` | 매도거래량0 | String | Y | 8 | - |
| Response Body | `msvol0` | 거래량순매수0 | String | Y | 8 | - |
| Response Body | `msvalue0` | 매수거래대금0 | String | Y | 6 | - |
| Response Body | `mdvalue0` | 매도거래대금0 | String | Y | 6 | - |
| Response Body | `msval0` | 거래대금순매수0 | String | Y | 6 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "BMT",
    "tr_key": "001"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "BMT",
    "tr_key": "001"
  },
  "body": {
    "mdvalue0": "177",
    "mdvalue1": "26157",
    "msvolume8": "28",
    "msvolume9": "4294",
    "msvolume4": "1751",
    "mdvalue6": "4",
    "msvolume5": "562",
    "mdvalue7": "24",
    "msvolume6": "7",
    "mdvalue8": "1",
    "msvolume7": "277",
    "mdvalue9": "3430",
    "mdvalue2": "7432",
    "msvolume0": "1134",
    "msvolume1": "162016",
    "mdvalue3": "5963",
    "msvolume2": "26797",
    "mdvalue4": "2218",
    "msvolume3": "8054",
    "mdvalue5": "110",
    "mdvolume0": "318",
    "mdvolume9": "4372",
    "mdvolume3": "9338",
    "mdvolume4": "4204",
    "mdvolume1": "155078",
    "mdvolume2": "30775",
    "mdvolume7": "59",
    "mdvolume8": "6",
    "mdvolume5": "333",
    "mdvolume6": "47",
    "msvalue1": "26664",
    "msvalue2": "7893",
    "msvalue0": "464",
    "msvalue5": "274",
    "msvalue6": "6",
    "msvalue3": "5208",
    "msvol11": "-1676",
    "msvalue4": "710",
    "msvol10": "0",
    "msvalue9": "3658",
    "mdvalue11": "440",
    "msvalue7": "84",
    "msvalue8": "12",
    "mdvalue10": "0",
    "tjjtime": "09510001",
    "tjjcode0": "0000",
    "tjjcode10": "0011",
    "msvolume10": "0",
    "tjjcode11": "0007",
    "tjjcode6": "0004",
    "msval6": "1",
    "tjjcode5": "0003",
    "msval5": "165",
    "msval4": "-1508",
    "tjjcode8": "0005",
    "msval3": "-755",
    "tjjcode7": "0002",
    "tjjcode2": "0017",
    "tjjcode1": "0008",
    "msval9": "228",
    "tjjcode4": "0001",
    "msval8": "11",
    "tjjcode3": "0018",
    "msval7": "60",
    "msval2": "461",
    "msval1": "507",
    "tjjcode9": "0006",
    "mdvolume10": "0",
    "msval0": "287",
    "mdvolume11": "2939",
    "msvol9": "-78",
    "msvol5": "229",
    "msvol6": "-39",
    "msvol7": "219",
    "msvol8": "22",
    "msvol1": "6938",
    "msvol2": "-3978",
    "msvol3": "-1284",
    "msval11": "-212",
    "msvol4": "-2453",
    "msval10": "0",
    "msvol0": "817",
    "msvolume11": "1263",
    "msvalue10": "0",
    "msvalue11": "228",
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
