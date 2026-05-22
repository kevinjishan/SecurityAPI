---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=a804e311-cb53-499b-9d8a-a4d838f0a484&api_id=789a2830-7620-4a44-8107-336b0fd3f611"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식시세"
api_id: "789a2830-7620-4a44-8107-336b0fd3f611"
api_name: "해외주식 월차트조회"
tr_id: "c35e2cb0-4b79-4724-892e-6b39dbd03016"
tr_code: "FSTKCHARTMONTH"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/overseas-stock/chart/month"
content_type: "application/json;charset=utf-8"
rate_limit: "4"
auth_required: true
---

# 해외주식 월차트조회 (FSTKCHARTMONTH)

<!-- request_field_count: 11 -->
<!-- response_field_count: 11 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식시세 |
| API 페이지 | 해외주식 월차트조회 |
| TR명 | 해외주식 월차트조회 |
| TR코드 | `FSTKCHARTMONTH` |
| 초당 전송 건수 | 4 |
| 설명 | 해외주식 월차트 조회 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/overseas-stock/chart/month` |
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
| Request Body | `-InputDate2` | 입력날짜2 | String | Y | 8 | 8YYYYMMDD |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | - |
| Response Header | `cont_yn` | 연속 거래 여부 | String | N | 1 | - |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | - |

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
| Response Body | `-AcmlVol` | 누적체결거래량 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "FN",
    "InputIscd1": "TSLA",
    "InputDate1": "20230205",
    "InputDate2": "20230708",
    "InputOrgAdjPrc": "1"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Hour": "",
      "Date": "20230703",
      "Prpr": "267.4300",
      "Oprc": "276.4900",
      "Hprc": "299.2900",
      "Lprc": "254.1200",
      "AcmlVol": "2394275082"
    },
    {
      "Hour": "",
      "Date": "20230601",
      "Prpr": "261.7700",
      "Oprc": "202.5900",
      "Hprc": "276.9900",
      "Lprc": "199.3700",
      "AcmlVol": "3443091887"
    },
    {
      "Hour": "",
      "Date": "20230501",
      "Prpr": "203.9300",
      "Oprc": "163.1700",
      "Hprc": "204.4800",
      "Lprc": "158.8300",
      "AcmlVol": "2682606426"
    },
    {
      "Hour": "",
      "Date": "20230403",
      "Prpr": "164.3100",
      "Oprc": "199.9100",
      "Hprc": "202.6897",
      "Lprc": "152.3700",
      "AcmlVol": "2505176293"
    },
    {
      "Hour": "",
      "Date": "20230301",
      "Prpr": "207.4600",
      "Oprc": "206.2100",
      "Hprc": "207.7900",
      "Lprc": "163.9100",
      "AcmlVol": "3312555115"
    },
    {
      "Hour": "",
      "Date": "20230201",
      "Prpr": "205.7100",
      "Oprc": "173.8900",
      "Hprc": "217.6500",
      "Lprc": "169.9300",
      "AcmlVol": "3625947459"
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
