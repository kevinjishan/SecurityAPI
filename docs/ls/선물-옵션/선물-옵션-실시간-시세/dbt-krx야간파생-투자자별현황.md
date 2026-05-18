---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "futroptn-0000-0000-0000-000000000DBT"
tr_code: "DBT"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KRX야간파생 투자자별현황 (DBT)

<!-- request_field_count: 4 -->
<!-- response_field_count: 87 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | KRX야간파생 투자자별현황 |
| TR코드 | `DBT` |
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
| Request Header | `token` | 접근토큰 | String | Y | 1000 | - |
| Request Header | `tr_type` | 거래 Type | String | Y | 1 | - |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래 CD | String | Y | 3 | - |
| Request Body | `tr_key` | 단축코드 | String | N | 5 | ※ 실시간(DBM,DBT) 키값 - 5자리<br> - 시간대(tm_rng) + 선옵구분(fot_clsf_cd) + 기초자산(bsc_asts_id)<br> - ex) 주간 코스피200선물 실시간키값 : DFK2I<br>시간대(tm_rng)<br>D : 주간<br>N : 야간<br>U : 통합<br>선옵구분(fot_clsf_cd)<br>F : 선물<br>C : Call옵션<br>P : Put옵션<br>S : 스프레드<br>기초자산ID(bsc_asts_id)<br>K2I : KP200선물/옵션<br>MKI : 미니KP200선물/옵션<br>KQI : 코스닥150선물/옵션<br>WKM : 위클리옵션-월<br>WKI : 위클리옵션-목<br>BM3 : 국채3년선물<br>BMA : 국채10년선물<br>USD : 미국달러선물 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | - |

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
| Response Body | `fottjjcode` | 파생상품투자자코드 | String | Y | 5 | - |
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
    "token": "토큰",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "DBT",
    "tr_key": "UFK2I"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "DBT",
    "tr_key": "UFK2"
  },
  "body": {
    "mdvalue0": "0",
    "mdvalue1": "110",
    "msvolume8": "0",
    "msvolume9": "0",
    "msvolume4": "6",
    "mdvalue6": "0",
    "msvolume5": "0",
    "mdvalue7": "0",
    "msvolume6": "0",
    "mdvalue8": "0",
    "msvolume7": "0",
    "mdvalue9": "0",
    "mdvalue2": "51",
    "msvolume0": "0",
    "msvolume1": "84",
    "mdvalue3": "13",
    "msvolume2": "87",
    "mdvalue4": "13",
    "msvolume3": "6",
    "mdvalue5": "0",
    "mdvolume0": "0",
    "mdvolume9": "0",
    "mdvolume3": "13",
    "mdvolume4": "13",
    "mdvolume1": "115",
    "mdvolume2": "53",
    "mdvolume7": "0",
    "mdvolume8": "0",
    "mdvolume5": "0",
    "mdvolume6": "0",
    "msvalue1": "81",
    "msvalue2": "84",
    "msvalue0": "0",
    "msvalue5": "0",
    "msvalue6": "0",
    "msvalue3": "6",
    "msvol11": "2",
    "msvalue4": "6",
    "msvol10": "0",
    "msvalue9": "0",
    "mdvalue11": "1",
    "msvalue7": "0",
    "msvalue8": "0",
    "mdvalue10": "0",
    "tjjtime": "I2005000",
    "fottjjcode": "？UFK2",
    "tjjcode0": "000",
    "tjjcode10": "？001",
    "msvolume10": "0",
    "tjjcode11": "？000",
    "tjjcode6": "？000",
    "msval6": "0",
    "tjjcode5": "？000",
    "msval5": "0",
    "msval4": "-6",
    "tjjcode8": "？000",
    "msval3": "-6",
    "tjjcode7": "？000",
    "tjjcode2": "？001",
    "tjjcode1": "000",
    "msval9": "0",
    "tjjcode4": "？000",
    "msval8": "0",
    "tjjcode3": "？001",
    "msval7": "0",
    "msval2": "33",
    "msval1": "-29",
    "tjjcode9": "？000",
    "mdvolume10": "0",
    "msval0": "0",
    "mdvolume11": "1",
    "msvol9": "0",
    "msvol5": "0",
    "msvol6": "0",
    "msvol7": "0",
    "msvol8": "0",
    "msvol1": "-30",
    "msvol2": "34",
    "msvol3": "-6",
    "msval11": "2",
    "msvol4": "-6",
    "msval10": "0",
    "msvol0": "0",
    "msvolume11": "3",
    "msvalue10": "0",
    "msvalue11": "3"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
