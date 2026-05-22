---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=d11dcc68-9e80-4e53-ac21-ea95172e7416"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "d11dcc68-9e80-4e53-ac21-ea95172e7416"
api_name: "섹터구성종목 조회"
tr_id: "acd69fd7-0b35-4b87-b969-bde9adfc4a92"
tr_code: "SECTORCONDLIST"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/sector-components"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 섹터구성종목 조회 (SECTORCONDLIST)

<!-- request_field_count: 9 -->
<!-- response_field_count: 14 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 섹터구성종목 조회 |
| TR명 | 섹터구성종목 조회 |
| TR코드 | `SECTORCONDLIST` |
| 초당 전송 건수 | 2 |
| 설명 | 국내주식 섹터 구성종목을 조회 할 수 있는 API입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/sector-components` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |
| Request Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부(Y:연속거래 사용 N:연속거래 사용안함) |
| Request Header | `cont_key` | 연속키 값 | String | N | 70 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | N | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `In` | In | Object | Y | - | - |
| Request Body | `-InputSectorGroupClsCode` | 입력섹터그룹구분코드 | String | Y | 2 | "S" 고정 |
| Request Body | `-InputRankSortClsCode1` | 입력순위정렬구분코드 | String | Y | 2 | 2: 시가총액 DESC<br>4: 현재가 DESC <br>12: 등락율 DESC <br>13: 거래량 DESC                                                  <br>42: 거래대금 DESC |
| Request Body | `-InputSectorGroupIscd` | 입력섹터그룹코드 | String | Y | 4 | 섹터분류코드조회 API에서 조회된 값 사용<br>ex. "9155"입력시 반도체 대표주 섹터 구성종목 조회 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | N | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Array | Y | - | - |
| Response Body | `-Iscd` | 종목코드 | String | Y | 9 | - |
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 40 | - |
| Response Body | `-Avls` | 시가총액 | String | Y | 16 | 단위: 100만원 |
| Response Body | `-AvlsRlim` | 시가총액비중 | String | Y | 16 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-PrdyVrssSign` | 전일대비부호 | String | Y | 1 | 2: 상승<br>3: 보합<br>5: 하락 |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |
| Response Body | `-AcmlVol` | 거래량 | String | Y | 25 | - |
| Response Body | `-AcmlTrPbmn` | 거래대금 | String | Y | 25 | - |

## 예제

### Request

```json
{
  "In": {
    "InputSectorGroupClsCode": "S",
    "InputRankSortClsCode1": "2",
    "InputSectorGroupIscd": "9155"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "005930",
      "KorIsnm": "삼성전자",
      "Avls": "644648569705800",
      "AvlsRlim": "0.61",
      "Prpr": "108900",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "78",
      "AcmlTrPbmn": "8494200"
    },
    {
      "Iscd": "000660",
      "KorIsnm": "SK하이닉스",
      "Avls": "415689350415000",
      "AvlsRlim": "0.39",
      "Prpr": "571000",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "39",
      "AcmlTrPbmn": "22269000"
    },
    {
      "Iscd": "000990",
      "KorIsnm": "DB하이텍",
      "Avls": "2940910148800",
      "AvlsRlim": "0.00",
      "Prpr": "67600",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
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
