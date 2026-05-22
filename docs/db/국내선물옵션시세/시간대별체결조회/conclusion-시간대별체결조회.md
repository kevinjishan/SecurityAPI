---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80d95623-7135-481b-b109-d7370f1a261b&api_id=587bb0f9-55bd-428e-b8e2-d5ab92c1eb5c"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세"
api_id: "587bb0f9-55bd-428e-b8e2-d5ab92c1eb5c"
api_name: "시간대별체결조회"
tr_id: "b6728af5-b4f2-4e9b-a8bb-3772a795163a"
tr_code: "CONCLUSION"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-futureoption/inquiry/hour-price"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 시간대별체결조회 (CONCLUSION)

<!-- request_field_count: 8 -->
<!-- response_field_count: 9 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세 |
| API 페이지 | 시간대별체결조회 |
| TR명 | 시간대별체결조회 |
| TR코드 | `CONCLUSION` |
| 초당 전송 건수 | 2 |
| 설명 | 국내선물옵션 시간대별 체결조회 API입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-futureoption/inquiry/hour-price` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | F  : 지수선물<br>JF : 주식선물 <br>KF : 미니선물<br>CF : 상품선물<br>XF : 섹터선물<br>CM : 야간선물<br>O  : 지수옵션<br>JO : 주식옵션<br>KO : 미니옵션<br>WO : K200위클리옵션<br>EU : 야간옵션<br>SO: 코스닥 150옵션 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 종목코드 입력 ex. 005930 |

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
    "InputCondMrktDivCode": "F",
    "InputIscd1": "101V3000"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Hour": "888888",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "0"
    },
    {
      "Hour": "154500",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "4728"
    },
    {
      "Hour": "153459",
      "Prpr": "352.20",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.09",
      "CntgVol": "2"
    },
    {
      "Hour": "153459",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "1"
    },
    {
      "Hour": "153459",
      "Prpr": "352.20",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.09",
      "CntgVol": "2"
    },
    {
      "Hour": "153459",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "1"
    },
    {
      "Hour": "153458",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "6"
    },
    {
      "Hour": "153458",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "2"
    },
    {
      "Hour": "153458",
      "Prpr": "352.10",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.11",
      "CntgVol": "1"
    },
    {
      "Hour": "153457",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "20"
    },
    {
      "Hour": "153457",
      "Prpr": "352.10",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.11",
      "CntgVol": "1"
    },
    {
      "Hour": "153457",
      "Prpr": "352.10",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.11",
      "CntgVol": "1"
    },
    {
      "Hour": "153456",
      "Prpr": "352.20",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.09",
      "CntgVol": "8"
    },
    {
      "Hour": "153456",
      "Prpr": "352.10",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.11",
      "CntgVol": "2"
    },
    {
      "Hour": "153456",
      "Prpr": "352.10",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.11",
      "CntgVol": "2"
    },
    {
      "Hour": "153456",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "2"
    },
    {
      "Hour": "153456",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "1"
    },
    {
      "Hour": "153455",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "2"
    },
    {
      "Hour": "153455",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "10"
    },
    {
      "Hour": "153455",
      "Prpr": "352.15",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-0.10",
      "CntgVol": "1"
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
