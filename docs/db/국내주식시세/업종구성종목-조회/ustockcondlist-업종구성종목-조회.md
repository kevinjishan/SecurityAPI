---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=e75a5938-c6bb-4bb4-b424-06a021f6f560"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "e75a5938-c6bb-4bb4-b424-06a021f6f560"
api_name: "업종구성종목 조회"
tr_id: "0373b54d-65dc-4af6-8ddd-95f6f73a7860"
tr_code: "USTOCKCONDLIST"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/industry-components"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 업종구성종목 조회 (USTOCKCONDLIST)

<!-- request_field_count: 9 -->
<!-- response_field_count: 14 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 업종구성종목 조회 |
| TR명 | 업종구성종목 조회 |
| TR코드 | `USTOCKCONDLIST` |
| 초당 전송 건수 | 2 |
| 설명 | 국내 업종구성종목을 조회 할 수 있는 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/industry-components` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |
| Request Header | `cont_yn` | 연속 거래 여부 | String | N | 1 | 연속거래 여부(Y:연속거래 사용 N:연속거래 사용안함) |
| Request Header | `cont_key` | 연속키 값 | String | N | 70 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | N | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `In` | In | Object | Y | - | - |
| Request Body | `-InputBstpIscd` | 입력업종코드 | String | Y | 4 | 업종분류코드조회 API에서 조회된 값 사용<br>ex. "1024"입력시 증권 업종 구성종목 조회 |
| Request Body | `-InputRankSortClsCode1` | 입력순위정렬구분코드 | String | Y | 2 | 2: 시가총액 DESC<br>4: 현재가 DESC<br>12: 등락율 DESC<br>13: 거래량 DESC<br>42: 거래대금 DESC |
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | "UJ" 고정 |

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
    "InputBstpIscd": "1024",
    "InputRankSortClsCode1": "2",
    "InputCondMrktDivCode": "UJ"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "006800",
      "KorIsnm": "미래에셋증권",
      "Avls": "12661024",
      "AvlsRlim": "26.56",
      "Prpr": "22200",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "005940",
      "KorIsnm": "NH투자증권",
      "Avls": "7447597",
      "AvlsRlim": "15.62",
      "Prpr": "20900",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-400",
      "PrdyCtrt": "-1.88",
      "AcmlVol": "29502",
      "AcmlTrPbmn": "617125100"
    },
    {
      "Iscd": "039490",
      "KorIsnm": "키움증권",
      "Avls": "7443016",
      "AvlsRlim": "15.61",
      "Prpr": "280000",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-6500",
      "PrdyCtrt": "-2.27",
      "AcmlVol": "2295",
      "AcmlTrPbmn": "642818500"
    },
    {
      "Iscd": "016360",
      "KorIsnm": "삼성증권",
      "Avls": "7063630",
      "AvlsRlim": "14.82",
      "Prpr": "79100",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-1000",
      "PrdyCtrt": "-1.25",
      "AcmlVol": "10451",
      "AcmlTrPbmn": "826917200"
    },
    {
      "Iscd": "001720",
      "KorIsnm": "신영증권",
      "Avls": "2369004",
      "AvlsRlim": "4.97",
      "Prpr": "144100",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-1600",
      "PrdyCtrt": "-1.10",
      "AcmlVol": "1131",
      "AcmlTrPbmn": "163661300"
    },
    {
      "Iscd": "003540",
      "KorIsnm": "대신증권",
      "Avls": "1444503",
      "AvlsRlim": "3.03",
      "Prpr": "28450",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "00680K",
      "KorIsnm": "미래에셋증권2우B",
      "Avls": "1390125",
      "AvlsRlim": "2.91",
      "Prpr": "10110",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "030610",
      "KorIsnm": "교보증권",
      "Avls": "1136211",
      "AvlsRlim": "2.38",
      "Prpr": "9970",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "003530",
      "KorIsnm": "한화투자증권",
      "Avls": "1027684",
      "AvlsRlim": "2.15",
      "Prpr": "4790",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "003470",
      "KorIsnm": "유안타증권",
      "Avls": "766451",
      "AvlsRlim": "1.60",
      "Prpr": "3840",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "001270",
      "KorIsnm": "부국증권",
      "Avls": "626341",
      "AvlsRlim": "1.31",
      "Prpr": "60400",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "003545",
      "KorIsnm": "대신증권우",
      "Avls": "552500",
      "AvlsRlim": "1.15",
      "Prpr": "21250",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "001500",
      "KorIsnm": "현대차증권",
      "Avls": "503321",
      "AvlsRlim": "1.05",
      "Prpr": "8140",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-120",
      "PrdyCtrt": "-1.45",
      "AcmlVol": "9192",
      "AcmlTrPbmn": "74797810"
    },
    {
      "Iscd": "016610",
      "KorIsnm": "DB증권",
      "Avls": "456723",
      "AvlsRlim": "0.95",
      "Prpr": "10760",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "005945",
      "KorIsnm": "NH투자증권우",
      "Avls": "370060",
      "AvlsRlim": "0.77",
      "Prpr": "19610",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "001200",
      "KorIsnm": "유진투자증권",
      "Avls": "333220",
      "AvlsRlim": "0.69",
      "Prpr": "3440",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "001510",
      "KorIsnm": "SK증권",
      "Avls": "314745",
      "AvlsRlim": "0.66",
      "Prpr": "666",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "001750",
      "KorIsnm": "한양증권",
      "Avls": "252916",
      "AvlsRlim": "0.53",
      "Prpr": "19870",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "030210",
      "KorIsnm": "다올투자증권",
      "Avls": "217757",
      "AvlsRlim": "0.45",
      "Prpr": "3575",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "003547",
      "KorIsnm": "대신증권2우B",
      "Avls": "203500",
      "AvlsRlim": "0.42",
      "Prpr": "20350",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "003460",
      "KorIsnm": "유화증권",
      "Avls": "165288",
      "AvlsRlim": "0.34",
      "Prpr": "2915",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "006805",
      "KorIsnm": "미래에셋증권우",
      "Avls": "156241",
      "AvlsRlim": "0.32",
      "Prpr": "11100",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "001275",
      "KorIsnm": "부국증권우",
      "Avls": "93000",
      "AvlsRlim": "0.19",
      "Prpr": "31000",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "001290",
      "KorIsnm": "상상인증권",
      "Avls": "71828",
      "AvlsRlim": "0.15",
      "Prpr": "663",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "003475",
      "KorIsnm": "유안타증권우",
      "Avls": "49906",
      "AvlsRlim": "0.10",
      "Prpr": "3865",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "003465",
      "KorIsnm": "유화증권우",
      "Avls": "48847",
      "AvlsRlim": "0.10",
      "Prpr": "2795",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "003535",
      "KorIsnm": "한화투자증권우",
      "Avls": "37728",
      "AvlsRlim": "0.07",
      "Prpr": "7860",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "001755",
      "KorIsnm": "한양증권우",
      "Avls": "9965",
      "AvlsRlim": "0.02",
      "Prpr": "18980",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "0",
      "AcmlTrPbmn": "0"
    },
    {
      "Iscd": "001515",
      "KorIsnm": "SK증권우",
      "Avls": "8510",
      "AvlsRlim": "0.01",
      "Prpr": "2175",
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
