---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=7c9a349c-1629-4059-9f06-6bcf8c093fe0"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "7c9a349c-1629-4059-9f06-6bcf8c093fe0"
api_name: "ELW 종목 조회"
tr_id: "6d9009a8-e65f-4a79-93b9-13c06fa079db"
tr_code: "WCODES"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/elw-ticker"
content_type: "application/json;charset=utf-8"
rate_limit: "3"
auth_required: true
---

# ELW종목 조회 (WCODES)

<!-- request_field_count: 7 -->
<!-- response_field_count: 8 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | ELW 종목 조회 |
| TR명 | ELW종목 조회 |
| TR코드 | `WCODES` |
| 초당 전송 건수 | 3 |
| 설명 | 국내 ELW 종목조회 API입니다.<br><br>※ 연속키 조회를 통해 종목을 추가로 조회 할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/elw-ticker` |
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
| Request Body | `InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | "W" 입력 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB금융투자 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Array | Y | - | - |
| Response Body | `-Iscd` | 종목코드 | String | Y | 9 | - |
| Response Body | `-StndIscd` | 표준종목코드 | String | Y | 12 | - |
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 40 | - |
| Response Body | `-MrktClsCode` | 시장분류구분코드 | String | Y | 1 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "W"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "52K297",
      "StndIscd": "KRA521101E26",
      "KorIsnm": "미래K297삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K589",
      "StndIscd": "KRA521101E34",
      "KorIsnm": "미래K589삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K850",
      "StndIscd": "KRA521101E42",
      "KorIsnm": "미래K850삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K298",
      "StndIscd": "KRA521102E25",
      "KorIsnm": "미래K298삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K590",
      "StndIscd": "KRA521102E33",
      "KorIsnm": "미래K590삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K851",
      "StndIscd": "KRA521102E41",
      "KorIsnm": "미래K851삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K003",
      "StndIscd": "KRA521103E16",
      "KorIsnm": "미래K003삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K299",
      "StndIscd": "KRA521103E24",
      "KorIsnm": "미래K299삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K591",
      "StndIscd": "KRA521103E32",
      "KorIsnm": "미래K591삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K852",
      "StndIscd": "KRA521103E40",
      "KorIsnm": "미래K852삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52JT77",
      "StndIscd": "KRA521104DC8",
      "KorIsnm": "미래JT77POSCO홀콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K004",
      "StndIscd": "KRA521104E15",
      "KorIsnm": "미래K004삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K300",
      "StndIscd": "KRA521104E23",
      "KorIsnm": "미래K300삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K592",
      "StndIscd": "KRA521104E31",
      "KorIsnm": "미래K592삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K853",
      "StndIscd": "KRA521104E49",
      "KorIsnm": "미래K853삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52JT78",
      "StndIscd": "KRA521105DC5",
      "KorIsnm": "미래JT78POSCO홀콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K301",
      "StndIscd": "KRA521105E22",
      "KorIsnm": "미래K301삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K593",
      "StndIscd": "KRA521105E30",
      "KorIsnm": "미래K593삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52K854",
      "StndIscd": "KRA521105E48",
      "KorIsnm": "미래K854삼성전자콜",
      "MrktClsCode": ""
    },
    {
      "Iscd": "52JR26",
      "StndIscd": "KRA521106DB5",
      "KorIsnm": "미래JR26삼성전자콜",
      "MrktClsCode": ""
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
