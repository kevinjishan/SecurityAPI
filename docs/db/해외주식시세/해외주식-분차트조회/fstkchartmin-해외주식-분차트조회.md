---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=a804e311-cb53-499b-9d8a-a4d838f0a484&api_id=eff74363-ad04-4c0e-8009-91a744e9324d"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식시세"
api_id: "eff74363-ad04-4c0e-8009-91a744e9324d"
api_name: "해외주식 분차트조회"
tr_id: "ddfbae56-46a8-4742-85f8-43c4d7b69e74"
tr_code: "FSTKCHARTMIN"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/overseas-stock/chart/min"
content_type: "application/json;charset=utf-8"
rate_limit: "4"
auth_required: true
---

# 해외주식 분차트조회 (FSTKCHARTMIN)

<!-- request_field_count: 15 -->
<!-- response_field_count: 11 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식시세 |
| API 페이지 | 해외주식 분차트조회 |
| TR명 | 해외주식 분차트조회 |
| TR코드 | `FSTKCHARTMIN` |
| 초당 전송 건수 | 4 |
| 설명 | 해외주식 분차트 조회 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/overseas-stock/chart/min` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB금융투자 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |
| Request Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부(Y:연속거래 사용 N:연속거래 사용안함) |
| Request Header | `cont_key` | 연속키 값 | String | N | 70 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | N | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `In` | In | Object | Y | - | - |
| Request Body | `-dataCnt` | 호출건수 | String | Y | 4 | 입력범위: "1" ~ "2000" <br>""(공백입력) 또는 "0" 입력시 기본개수(400개)조회 |
| Request Body | `-InputOrgAdjPrc` | 수정주가사용여부 | String | Y | 1 | 0:수정주가 미사용<br>1: 수정주가 사용 |
| Request Body | `-InputPwDataIncuYn` | 기간지정여부코드 | String | Y | 1 | "Y": 기간지정<br>"N":기간미지정 (InputDate2 부터 이전날짜 계속조회) |
| Request Body | `-InputHourClsCode` | 입력시간구분코드 | String | Y | 9 | "0" 입력 |
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | FY:뉴욕<br>FN:나스닥<br>FA:아멕스 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 해외주식 종목코드 (ex. TQQQ) |
| Request Body | `-InputDate1` | 입력날짜1 | String | Y | 8 | YYYYMMDD |
| Request Body | `-InputDate2` | 입력날짜2 | String | Y | 8 | YYYYMMDD |
| Request Body | `-InputDivXtick` | 분일별구분코드 | String | Y | 9 | 30: 30초<br>60: 1분<br>600: 10분<br>3600: 60분<br>[60*N: N분] |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB금융투자 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부 |
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
    "InputCondMrktDivCode": "FN",
    "InputIscd1": "AAPL",
    "InputDate1": "20240812",
    "InputDate2": "20240816",
    "InputHourClsCode": "0",
    "InputDivXtick": "60",
    "InputPwDataIncuYn": "Y",
    "InputOrgAdjPrc": "1",
    "dataCnt": ""
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Hour": "163000",
      "Date": "20240205",
      "Prpr": "187.5700",
      "Oprc": "187.8300",
      "Hprc": "187.8500",
      "Lprc": "187.5150",
      "CntgVol": "14162"
    },
    {
      "Hour": "162000",
      "Date": "20240205",
      "Prpr": "187.8300",
      "Oprc": "187.9700",
      "Hprc": "188.0300",
      "Lprc": "187.6800",
      "CntgVol": "26443"
    },
    {
      "Hour": "161000",
      "Date": "20240205",
      "Prpr": "187.8700",
      "Oprc": "187.8300",
      "Hprc": "188.0500",
      "Lprc": "187.6800",
      "CntgVol": "47724"
    },
    {
      "Hour": "160000",
      "Date": "20240205",
      "Prpr": "187.8500",
      "Oprc": "187.6900",
      "Hprc": "188.0000",
      "Lprc": "187.4100",
      "CntgVol": "9778817"
    },
    {
      "Hour": "155000",
      "Date": "20240205",
      "Prpr": "187.6600",
      "Oprc": "188.0300",
      "Hprc": "188.2950",
      "Lprc": "187.6500",
      "CntgVol": "2064438"
    },
    {
      "Hour": "154000",
      "Date": "20240205",
      "Prpr": "188.0200",
      "Oprc": "188.0150",
      "Hprc": "188.2400",
      "Lprc": "187.8800",
      "CntgVol": "1066394"
    },
    {
      "Hour": "153000",
      "Date": "20240205",
      "Prpr": "188.0150",
      "Oprc": "188.3500",
      "Hprc": "188.4200",
      "Lprc": "188.0150",
      "CntgVol": "688743"
    },
    {
      "Hour": "152000",
      "Date": "20240205",
      "Prpr": "188.3500",
      "Oprc": "188.2650",
      "Hprc": "188.4100",
      "Lprc": "188.1600",
      "CntgVol": "642116"
    },
    {
      "Hour": "151000",
      "Date": "20240205",
      "Prpr": "188.2700",
      "Oprc": "188.5000",
      "Hprc": "188.5750",
      "Lprc": "188.0300",
      "CntgVol": "850086"
    },
    {
      "Hour": "150000",
      "Date": "20240205",
      "Prpr": "188.5000",
      "Oprc": "188.5200",
      "Hprc": "188.6300",
      "Lprc": "188.3800",
      "CntgVol": "740606"
    },
    {
      "Hour": "145000",
      "Date": "20240205",
      "Prpr": "188.5182",
      "Oprc": "188.5722",
      "Hprc": "188.5900",
      "Lprc": "188.3700",
      "CntgVol": "550090"
    },
    {
      "Hour": "144000",
      "Date": "20240205",
      "Prpr": "188.5722",
      "Oprc": "188.7000",
      "Hprc": "188.7300",
      "Lprc": "188.4700",
      "CntgVol": "531043"
    },
    {
      "Hour": "143000",
      "Date": "20240205",
      "Prpr": "188.7000",
      "Oprc": "188.4870",
      "Hprc": "188.8400",
      "Lprc": "188.4201",
      "CntgVol": "609078"
    },
    {
      "Hour": "142000",
      "Date": "20240205",
      "Prpr": "188.4650",
      "Oprc": "188.4600",
      "Hprc": "188.6300",
      "Lprc": "188.3850",
      "CntgVol": "530722"
    },
    {
      "Hour": "141000",
      "Date": "20240205",
      "Prpr": "188.4600",
      "Oprc": "188.8100",
      "Hprc": "188.8376",
      "Lprc": "188.4100",
      "CntgVol": "525366"
    },
    {
      "Hour": "140000",
      "Date": "20240205",
      "Prpr": "188.8000",
      "Oprc": "188.7200",
      "Hprc": "188.9000",
      "Lprc": "188.6000",
      "CntgVol": "450902"
    },
    {
      "Hour": "135000",
      "Date": "20240205",
      "Prpr": "188.7200",
      "Oprc": "188.8063",
      "Hprc": "188.8799",
      "Lprc": "188.5300",
      "CntgVol": "483998"
    },
    {
      "Hour": "134000",
      "Date": "20240205",
      "Prpr": "188.8063",
      "Oprc": "188.8450",
      "Hprc": "188.8950",
      "Lprc": "188.6710",
      "CntgVol": "378349"
    },
    {
      "Hour": "133000",
      "Date": "20240205",
      "Prpr": "188.8450",
      "Oprc": "188.5401",
      "Hprc": "189.0125",
      "Lprc": "188.5400",
      "CntgVol": "559720"
    },
    {
      "Hour": "132000",
      "Date": "20240205",
      "Prpr": "188.5401",
      "Oprc": "188.7200",
      "Hprc": "188.9100",
      "Lprc": "188.5340",
      "CntgVol": "594997"
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
