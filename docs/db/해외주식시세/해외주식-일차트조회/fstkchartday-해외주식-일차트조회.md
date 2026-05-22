---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=a804e311-cb53-499b-9d8a-a4d838f0a484&api_id=98c2bedf-af8b-41b2-ac54-5b91ded72530"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식시세"
api_id: "98c2bedf-af8b-41b2-ac54-5b91ded72530"
api_name: "해외주식 일차트조회"
tr_id: "87cacf6a-f4bc-48b1-aeb4-355e94278626"
tr_code: "FSTKCHARTDAY"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/overseas-stock/chart/day"
content_type: "application/json;charset=utf-8"
rate_limit: "4"
auth_required: true
---

# 해외주식 일차트조회 (FSTKCHARTDAY)

<!-- request_field_count: 11 -->
<!-- response_field_count: 11 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식시세 |
| API 페이지 | 해외주식 일차트조회 |
| TR명 | 해외주식 일차트조회 |
| TR코드 | `FSTKCHARTDAY` |
| 초당 전송 건수 | 4 |
| 설명 | 해외주식 일차트 조회 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/overseas-stock/chart/day` |
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
| Request Body | `-InputOrgAdjPrc` | 수정주가사용여부 | String | Y | 1 | 0:수정주가 미사용<br>1: 수정주가 사용 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 해외주식 종목코드 (ex. TQQQ) |
| Request Body | `-InputDate1` | 입력날짜1 | String | Y | 8 | YYYYMMDD |
| Request Body | `-InputDate2` | 입력날짜2 | String | Y | 8 | YYYYMMDD |

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
    "InputOrgAdjPrc": "1",
    "InputCondMrktDivCode": "FN",
    "InputIscd1": "TSLA",
    "InputDate1": "20250701",
    "InputDate2": "20250714"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Hour": "",
      "Date": "20250711",
      "Prpr": "313.5100",
      "Oprc": "307.8900",
      "Hprc": "314.0900",
      "Lprc": "305.6500",
      "AcmlVol": "79236442"
    },
    {
      "Hour": "",
      "Date": "20250710",
      "Prpr": "309.8700",
      "Oprc": "300.0500",
      "Hprc": "310.4800",
      "Lprc": "300.0000",
      "AcmlVol": "104365271"
    },
    {
      "Hour": "",
      "Date": "20250709",
      "Prpr": "295.8800",
      "Oprc": "297.5500",
      "Hprc": "300.1500",
      "Lprc": "293.5500",
      "AcmlVol": "75586771"
    },
    {
      "Hour": "",
      "Date": "20250708",
      "Prpr": "297.8100",
      "Oprc": "297.0000",
      "Hprc": "304.0499",
      "Lprc": "294.3500",
      "AcmlVol": "103246742"
    },
    {
      "Hour": "",
      "Date": "20250707",
      "Prpr": "293.9400",
      "Oprc": "291.3700",
      "Hprc": "296.1500",
      "Lprc": "288.7701",
      "AcmlVol": "131177949"
    },
    {
      "Hour": "",
      "Date": "20250703",
      "Prpr": "315.3500",
      "Oprc": "317.9900",
      "Hprc": "318.4500",
      "Lprc": "312.7600",
      "AcmlVol": "58042302"
    },
    {
      "Hour": "",
      "Date": "20250702",
      "Prpr": "315.6500",
      "Oprc": "312.6300",
      "Hprc": "316.8320",
      "Lprc": "303.8200",
      "AcmlVol": "119483730"
    },
    {
      "Hour": "",
      "Date": "20250701",
      "Prpr": "300.7100",
      "Oprc": "298.4600",
      "Hprc": "305.8900",
      "Lprc": "293.2100",
      "AcmlVol": "145085665"
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
