---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=0bc09824-e8c2-491a-8c9d-b99e64b4b907&api_id=efe731f7-0f2a-45d1-81da-335ebeacd552"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식/선물차트"
api_id: "efe731f7-0f2a-45d1-81da-335ebeacd552"
api_name: "틱차트조회"
tr_id: "a1aaf753-086c-423d-b371-cc75078143dd"
tr_code: "CHARTTICK"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-chart/tick"
content_type: "application/json;charset=utf-8"
rate_limit: "4"
auth_required: true
---

# 틱차트조회 (CHARTTICK)

<!-- request_field_count: 12 -->
<!-- response_field_count: 11 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식/선물차트 |
| API 페이지 | 틱차트조회 |
| TR명 | 틱차트조회 |
| TR코드 | `CHARTTICK` |
| 초당 전송 건수 | 4 |
| 설명 | 국내주식/선물옵션 틱차트 조회 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-chart/tick` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 접근토큰 | String | Y | 100 | DB금융투자 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 연속 거래 여부 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |
| Request Header | `cont_yn` | 연속키 값 | String | Y | 1 | 연속거래 여부(Y:연속거래 사용 N:연속거래 사용안함) |
| Request Header | `cont_key` | 연속키 값 | String | N | 70 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | N | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `In` | In | Object | Y | - | - |
| Request Body | `-dataCnt` | 호출건수 | String | Y | 4 | 입력범위: "1" ~ "2000" <br> ""(공백입력) 또는 "0" 입력시 기본개수(400개)조회 |
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | 주식:J<br>주식(NXT): NJ<br>주식(통합): UJ<br>EN : ETN<br>W: ELW<br>F : 지수선물<br>JF : 주식선물<br>KF : 미니선물<br>CF : 상품선물<br>XF : 섹터선물<br>CM : 야간선물<br>O : 지수옵션<br>JO : 주식옵션<br>KO : 미니옵션<br>WO : K200위클리옵션<br>EU : 야간옵션<br>SO: 코스닥 150옵션<br>업종&지수: U<br>※ ETF종목의 경우 J 코드를 사용해 조회 부탁드립니다. |
| Request Body | `-InputOrgAdjPrc` | 수정주가사용여부 | String | Y | 1 | 0:수정주가 미사용<br>1: 수정주가 사용 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 주식(J, NJ, UJ) 선택시 주식종목코드 입력 <br> - J(KRX 주식): (ex. 005930)<br> - NJ(NXT 주식): (ex. N-005930)<br> - UJ(통합): (ex. U-005930)<br>※ NXT/통합시세로 종목 조회 시 반드시 종목 앞에 구분자 (N-, U-)를 붙여서 호출 부탁드리겠습니다.<br>업종(U) 선택시 지수코드:<br>1001: KOSPI<br>2001: KOSDAQ<br>3001: KOSPI200<br>1002: 코스피(대형주)<br>1004: 코스피(소형주)<br>1053: KOSPI50종합지수<br>1054: KOSPI100종합지수<br>1163: 코스피고배당50<br>2002: 코스닥(대형주)<br>2004: 코스닥(소형주)<br>2203: 코스닥 150<br>3903: KP200레버리지지수<br>3907: 변동성지수<br>0100: KRX100<br>0600: KTOP 30<br>K001: KOVIXI00 |
| Request Body | `-InputDate1` | 입력날짜1 | String | Y | 8 | 조회 시작일을 YYYYMMDD 형식으로 입력 ex. 20241204 |
| Request Body | `-InputDivXtick` | 틱분틱일별구분코드 | String | Y | 9 | N Tick 입력 ex. 100 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB금융투자 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | N | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Array | Y | - | - |
| Response Body | `-Hour` | 시간 | String | Y | 6 | - |
| Response Body | `-Date` | 일자 | String | Y | 8 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-Oprc` | 시가 | String | Y | 16 | - |
| Response Body | `-Hprc` | 고가 | String | Y | 16 | - |
| Response Body | `-Lprc` | 저가 | String | Y | 16 | - |
| Response Body | `-CntgVol` | 체결거래량 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "J",
    "InputIscd1": "005930",
    "InputDate1": "20240411",
    "InputDivXtick": "100",
    "dataCnt": ""
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Hour": "142523",
      "Date": "20240411",
      "Prpr": "84400",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84400",
      "CntgVol": "32"
    },
    {
      "Hour": "142521",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "2667"
    },
    {
      "Hour": "142500",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "4160"
    },
    {
      "Hour": "142431",
      "Date": "20240411",
      "Prpr": "84400",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "2800"
    },
    {
      "Hour": "142405",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "4052"
    },
    {
      "Hour": "142339",
      "Date": "20240411",
      "Prpr": "84400",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "2827"
    },
    {
      "Hour": "142310",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "3415"
    },
    {
      "Hour": "142244",
      "Date": "20240411",
      "Prpr": "84400",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "2739"
    },
    {
      "Hour": "142210",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "3611"
    },
    {
      "Hour": "142140",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "3369"
    },
    {
      "Hour": "142110",
      "Date": "20240411",
      "Prpr": "84400",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "5667"
    },
    {
      "Hour": "142030",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "4355"
    },
    {
      "Hour": "141957",
      "Date": "20240411",
      "Prpr": "84400",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "4118"
    },
    {
      "Hour": "141920",
      "Date": "20240411",
      "Prpr": "84400",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "4086"
    },
    {
      "Hour": "141854",
      "Date": "20240411",
      "Prpr": "84400",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "61749"
    },
    {
      "Hour": "141826",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "3124"
    },
    {
      "Hour": "141758",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "8800"
    },
    {
      "Hour": "141735",
      "Date": "20240411",
      "Prpr": "84400",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "3468"
    },
    {
      "Hour": "141704",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84400",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "9127"
    },
    {
      "Hour": "141641",
      "Date": "20240411",
      "Prpr": "84300",
      "Oprc": "84300",
      "Hprc": "84400",
      "Lprc": "84300",
      "CntgVol": "4083"
    }
  ],
  "rsp_cd": "00000",
  "rsp_msg": "정상 처리 되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
