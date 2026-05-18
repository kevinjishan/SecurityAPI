---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cdb7e1bc-f7c5-425c-8248-aa83dbb6919f&api_id=4903400b-731d-42b0-98c7-6d50fc504894"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "해외주식"
api_id: "4903400b-731d-42b0-98c7-6d50fc504894"
api_name: "[해외주식] 차트"
tr_id: "4768094d-51b7-436d-a5b4-7ef2d44ef2a9"
tr_code: "g3202"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/overseas-stock/chart"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# 해외주식 API 차트NTICK 조회 (g3202)

<!-- request_field_count: 17 -->
<!-- response_field_count: 36 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식 |
| API 페이지 | [해외주식] 차트 |
| TR명 | 해외주식 API 차트NTICK 조회 |
| TR코드 | `g3202` |
| 초당 전송 건수 | 1 |
| 설명 | 해외주식 기간별 차트를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/overseas-stock/chart` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth토큰이필요한API경우발급한AccessToken을설정하기위한RequestHeaederParameter |
| Request Header | `tr_cd` | 거래CD | String | Y | 10 | LS증권거래코드 |
| Request Header | `tr_cont` | 연속거래여부 | String | Y | 1 | 연속거래여부Y:연속○N:연속× |
| Request Header | `tr_cont_key` | 연속거래Key | String | Y | 18 | 연속일경우그전에내려온연속키값올림 |
| Request Header | `mac_address` | MAC주소 | String | Y | 12 | 법인인경우필수세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `-g3202InBlock` | g3202InBlock | Object | Y | - | - |
| Request Body | `-delaygb` | 지연구분 | String | Y | 1 | - |
| Request Body | `-keysymbol` | KEY종목코드 | String | Y | 18 | - |
| Request Body | `-exchcd` | 거래소코드 | String | Y | 2 | - |
| Request Body | `-symbol` | 종목코드 | String | Y | 16 | - |
| Request Body | `-ncnt` | 단위(n틱) | Object | Y | 4 | - |
| Request Body | `-qrycnt` | 요청건수(최대-압축:2000비압축:5 | Object | Y | 4 | - |
| Request Body | `-comp_yn` | 압축여부(Y:압축N:비압축) | String | Y | 1 | - |
| Request Body | `-sdate` | 시작일자 | String | Y | 8 | - |
| Request Body | `-edate` | 종료일자 | String | Y | 8 | - |
| Request Body | `-cts_seq` | 연속시퀀스 | Object | Y | 17 | - |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Response Header | `tr_cd` | 거래CD | String | Y | 10 | LS증권거래코드 |
| Response Header | `tr_cont` | 연속거래여부 | String | Y | 1 | 연속거래여부Y:연속○N:연속× |
| Response Header | `tr_cont_key` | 연속거래Key | String | Y | 18 | 연속일경우그전에내려온연속키값올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `-g3202OutBlock` | g3202OutBlock | Object | Y | - | - |
| Response Body | `-delaygb` | 지연구분 | String | Y | 1 | - |
| Response Body | `-keysymbol` | KEY종목코드 | String | Y | 18 | - |
| Response Body | `-exchcd` | 거래소코드 | String | Y | 2 | - |
| Response Body | `-symbol` | 종목코드 | String | Y | 16 | - |
| Response Body | `-cts_seq` | 연속시퀀스 | Object | Y | 17 | - |
| Response Body | `-rec_count` | 레코드카운트 | Object | Y | 7 | - |
| Response Body | `-preopen` | 전일시가 | Object | Y | 15.8 | - |
| Response Body | `-prehigh` | 전일고가 | Object | Y | 15.8 | - |
| Response Body | `-prelow` | 전일저가 | Object | Y | 15.8 | - |
| Response Body | `-preclose` | 전일종가 | Object | Y | 15.8 | - |
| Response Body | `-prevolume` | 전일거래량 | Object | Y | 16 | - |
| Response Body | `-open` | 당일시가 | Object | Y | 15.8 | - |
| Response Body | `-high` | 당일고가 | Object | Y | 15.8 | - |
| Response Body | `-low` | 당일저가 | Object | Y | 15.8 | - |
| Response Body | `-close` | 당일종가 | Object | Y | 15.8 | - |
| Response Body | `-s_time` | 장시작시간(HHMMSS) | String | Y | 6 | - |
| Response Body | `-e_time` | 장종료시간(HHMMSS) | String | Y | 6 | - |
| Response Body | `-last_count` | 마지막Tick건수 | String | Y | 4 | - |
| Response Body | `-timediff` | 시차 | String | Y | 4 | - |
| Response Body | `-prtt_rate` | 수정비율 | Object | Y | 6.2 | - |
| Response Body | `-g3202OutBlock1` | g3202OutBlock1 | Object | Y | - | - |
| Response Body | `-date` | 날짜 | String | Y | 8 | - |
| Response Body | `-loctime` | 현지시간 | String | Y | 6 | - |
| Response Body | `-open` | 시가 | Object | Y | 15.8 | - |
| Response Body | `-high` | 고가 | Object | Y | 15.8 | - |
| Response Body | `-low` | 저가 | Object | Y | 15.8 | - |
| Response Body | `-close` | 종가 | Object | Y | 15.8 | - |
| Response Body | `-exevol` | 체결량 | Object | Y | 16 | - |
| Response Body | `-jongchk` | 수정구분 | Object | Y | 13 | - |
| Response Body | `-pricechk` | 수정주가반영항목 | Object | Y | 13 | - |
| Response Body | `-sign` | 종가등락구분(1:상한2:상승3:보합 | String | Y | 1 | - |

## 예제

### Request

```json
{
  "g3202InBlock": {
    "delaygb": "R",
    "keysymbol": "82TSLA",
    "exchcd": "82",
    "symbol": "TSLA",
    "ncnt": 5,
    "qrycnt": 5,
    "comp_yn": "N",
    "sdate": "20250414",
    "edate": ""
  }
}
```

### Response

```json
{
  "g3202OutBlock": {
    "delaygb": "R",
    "keysymbol": "82TSLA",
    "exchcd": "82",
    "symbol": "TSLA",
    "cts_seq": 20250428014650000,
    "rec_count": 5,
    "preopen": "261.6900",
    "prehigh": "286.8500",
    "prelow": "259.6300",
    "preclose": "284.9500",
    "prevolume": 167560688,
    "open": "285.0900",
    "high": "285.3100",
    "low": "281.8400",
    "close": "283.1300",
    "s_time": "200000",
    "e_time": "180000",
    "last_count": "",
    "timediff": "-13"
  },
  "g3202OutBlock1": [
    {
      "date": "20250428",
      "loctime": "014721",
      "open": "283.1600",
      "high": "283.1600",
      "low": "283.1000",
      "close": "283.1000",
      "exevol": 25,
      "jongchk": 0,
      "prtt_rate": "0",
      "pricechk": 0,
      "sign": "5"
    },
    {
      "date": "20250428",
      "loctime": "014730",
      "open": "283.1000",
      "high": "283.1200",
      "low": "283.0200",
      "close": "283.1200",
      "exevol": 111,
      "jongchk": 0,
      "prtt_rate": "0",
      "pricechk": 0,
      "sign": "5"
    },
    {
      "date": "20250428",
      "loctime": "014739",
      "open": "283.0500",
      "high": "283.0500",
      "low": "283.0200",
      "close": "283.0500",
      "exevol": 340,
      "jongchk": 0,
      "prtt_rate": "0",
      "pricechk": 0,
      "sign": "5"
    },
    {
      "date": "20250428",
      "loctime": "014739",
      "open": "283.0300",
      "high": "283.1200",
      "low": "283.0300",
      "close": "283.1200",
      "exevol": 435,
      "jongchk": 0,
      "prtt_rate": "0",
      "pricechk": 0,
      "sign": "5"
    },
    {
      "date": "20250428",
      "loctime": "014743",
      "open": "283.1200",
      "high": "283.1300",
      "low": "283.0200",
      "close": "283.1300",
      "exevol": 307,
      "jongchk": 0,
      "prtt_rate": "0",
      "pricechk": 0,
      "sign": "5"
    }
  ],
  "rsp_cd": "00000",
  "rsp_msg": "조회완료"
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
