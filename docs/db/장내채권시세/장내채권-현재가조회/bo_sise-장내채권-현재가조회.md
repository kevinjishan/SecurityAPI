---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=b86989c1-9666-42d2-a446-492376f71f1b&api_id=106586fa-701b-49f8-9d21-eefe8b81e1a6"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "장내채권시세"
api_id: "106586fa-701b-49f8-9d21-eefe8b81e1a6"
api_name: "장내채권 현재가조회"
tr_id: "ae53883e-1416-4de5-8635-03603858c483"
tr_code: "BO_SISE"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/krx-bond/inquiry/price"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 장내채권 현재가조회 (BO_SISE)

<!-- request_field_count: 8 -->
<!-- response_field_count: 13 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 장내채권시세 |
| API 페이지 | 장내채권 현재가조회 |
| TR명 | 장내채권 현재가조회 |
| TR코드 | `BO_SISE` |
| 초당 전송 건수 | 2 |
| 설명 | 문서 미기재 |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/krx-bond/inquiry/price` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | 소액:SB<br>일반:B |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 채권 종목코드 입력 |

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
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyVrssSign` | 전일대비부호 | String | Y | 1 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |
| Response Body | `-AcmlVol` | 누적거래량 | String | Y | 16 | - |
| Response Body | `-PrdyErt` | 전일수익률 | String | Y | 16 | - |
| Response Body | `-Mxpr` | 상한가 | String | Y | 16 | - |
| Response Body | `-Llam` | 하한가 | String | Y | 16 | - |
| Response Body | `-PrdyClpr` | 전일종가 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputIscd1": "KR101501DDC7",
    "InputCondMrktDivCode": "B"
  }
}
```

### Response

```json
{
  "Out": {
    "Prpr": "8939.50",
    "PrdyVrss": "0.00",
    "PrdyVrssSign": "3",
    "PrdyCtrt": "0.00",
    "AcmlVol": "0",
    "PrdyErt": "",
    "Mxpr": "",
    "Llam": "",
    "PrdyClpr": "8939.50"
  },
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
