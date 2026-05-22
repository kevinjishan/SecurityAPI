---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=a804e311-cb53-499b-9d8a-a4d838f0a484&api_id=e4c85422-9d4a-4e46-917c-ef7988fba8c8"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식시세"
api_id: "e4c85422-9d4a-4e46-917c-ef7988fba8c8"
api_name: "해외주식시간대별체결조회"
tr_id: "690bbc47-9bfb-4841-afeb-3820d460e0ef"
tr_code: "FSTKCONCLUSION"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/overseas-stock/inquiry/hour-price"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 해외주식시간대별체결조회 (FSTKCONCLUSION)

<!-- request_field_count: 11 -->
<!-- response_field_count: 9 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식시세 |
| API 페이지 | 해외주식시간대별체결조회 |
| TR명 | 해외주식시간대별체결조회 |
| TR코드 | `FSTKCONCLUSION` |
| 초당 전송 건수 | 2 |
| 설명 | 해외주식 시간대별 체결조회 API입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/overseas-stock/inquiry/hour-price` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | FY:뉴욕<br>FN:나스닥<br>FA:아멕스 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 해외주식 종목코드 입력 (ex. TQQQ) |
| Request Body | `-InputHourClsCode` | 입력시간구분코드 | String | Y | 9 | 0: 전체<br>1: 장전<br>2: 장중 <br>3: 장후<br>4: 장전+장중<br>5: 장전+장후 |
| Request Body | `-InputDivXtick` | 입력X틱분틱일별구분코드 | String | Y | 9 | 30: 30초<br>60: 1분<br>600: 10분<br>3600: 60분<br>[60*N: N분] |
| Request Body | `-InputSctnClsCode` | 입력구간구분코드 | String | Y | 9 | 0:default <br>1:당일 <br>2:전일 |

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
| Response Body | `Out` | Out | Object | Y | - | - |
| Response Body | `-Hour` | 시간 | String | Y | 16 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-PrdyVrssSign` | 전일대비부호 | String | Y | 1 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |
| Response Body | `-CntgVol` | 체결거래량 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "FN",
    "InputIscd1": "TSLA",
    "InputHourClsCode": "2",
    "InputDivXtick": "600",
    "InputSctnClsCode": "2"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Hour": "160000",
      "Prpr": "188.7100",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.55",
      "CntgVol": "258547"
    },
    {
      "Hour": "155941",
      "Prpr": "188.8250",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.61",
      "CntgVol": "402373"
    },
    {
      "Hour": "155844",
      "Prpr": "188.5593",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.47",
      "CntgVol": "298461"
    },
    {
      "Hour": "155706",
      "Prpr": "188.4212",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.39",
      "CntgVol": "264484"
    },
    {
      "Hour": "155533",
      "Prpr": "188.4900",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.43",
      "CntgVol": "258538"
    },
    {
      "Hour": "155440",
      "Prpr": "188.3200",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.34",
      "CntgVol": "290340"
    },
    {
      "Hour": "155310",
      "Prpr": "188.4900",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.43",
      "CntgVol": "256893"
    },
    {
      "Hour": "155137",
      "Prpr": "188.5800",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.48",
      "CntgVol": "266780"
    },
    {
      "Hour": "155000",
      "Prpr": "188.4500",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.41",
      "CntgVol": "238678"
    },
    {
      "Hour": "154743",
      "Prpr": "188.4799",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.42",
      "CntgVol": "259859"
    },
    {
      "Hour": "154538",
      "Prpr": "188.6292",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.50",
      "CntgVol": "298606"
    },
    {
      "Hour": "154411",
      "Prpr": "188.7602",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.58",
      "CntgVol": "270425"
    },
    {
      "Hour": "154259",
      "Prpr": "188.5920",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.48",
      "CntgVol": "306427"
    },
    {
      "Hour": "154133",
      "Prpr": "188.4800",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.42",
      "CntgVol": "251712"
    },
    {
      "Hour": "153950",
      "Prpr": "188.2409",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.29",
      "CntgVol": "250371"
    },
    {
      "Hour": "153732",
      "Prpr": "188.1300",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.23",
      "CntgVol": "280943"
    },
    {
      "Hour": "153602",
      "Prpr": "187.9415",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.13",
      "CntgVol": "278901"
    },
    {
      "Hour": "153338",
      "Prpr": "187.9576",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.14",
      "CntgVol": "273107"
    },
    {
      "Hour": "153119",
      "Prpr": "188.0750",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.20",
      "CntgVol": "250241"
    },
    {
      "Hour": "153000",
      "Prpr": "188.1400",
      "PrdyVrssSign": "2",
      "PrdyCtrt": "2.24",
      "CntgVol": "249053"
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
