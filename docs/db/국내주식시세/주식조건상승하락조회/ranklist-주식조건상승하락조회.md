---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=668de023-eb33-4f96-a687-51b5cc1b97ec"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "668de023-eb33-4f96-a687-51b5cc1b97ec"
api_name: "주식조건상승하락조회"
tr_id: "ff9b979f-9a10-411a-99b9-ca7f997fe269"
tr_code: "RANKLIST"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/rank-list"
content_type: "application/json;charset=utf-8"
rate_limit: "3"
auth_required: true
---

# 주식조건상승하락조회 (RANKLIST)

<!-- request_field_count: 10 -->
<!-- response_field_count: 11 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 주식조건상승하락조회 |
| TR명 | 주식조건상승하락조회 |
| TR코드 | `RANKLIST` |
| 초당 전송 건수 | 3 |
| 설명 | 국내주식 주식조건상승하락 조회 API입니다.<br><br>※ 국내주식 상승/하락률을 조건에 맞는 종목을 제공합니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/rank-list` |
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
| Request Body | `-InputDateClsCode` | 입력일자구분코드 | String | Y | 9 | 당일:0<br>전일:1<br>주간:2<br>월간:5 |
| Request Body | `-InputRankSortClsCode1` | 입력순위정렬구분코드1 | String | Y | 9 | 상승률:12<br>하락율:11 |
| Request Body | `-InputMrktClsCode` | 입력시장구분코드 | String | Y | 2 | 전체:A<br>코스피:K <br>코스닥:Q |
| Request Body | `-InputBstpIscd` | 입력업종코드 | String | Y | 32 | 입력시장구분코드 "A" 일시 입력 X<br>코스피:1001<br>코스닥:2001 |

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
| Response Body | `-Iscd` | 종목코드 | String | Y | 16 | - |
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 40 | - |
| Response Body | `-DataRank` | 순위 | String | Y | 9 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-PrdyVrssSign` | 전일대비부호 | String | Y | 1 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputDateClsCode": "1",
    "InputRankSortClsCode1": "12",
    "InputMrktClsCode": "A",
    "InputBstpIscd": ""
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "009310",
      "KorIsnm": "참엔지니어링",
      "DataRank": "1",
      "Prpr": "941",
      "PrdyVrssSign": "1",
      "PrdyVrss": "217",
      "PrdyCtrt": "29.97"
    },
    {
      "Iscd": "151910",
      "KorIsnm": "SBW생명과학",
      "DataRank": "2",
      "Prpr": "438",
      "PrdyVrssSign": "1",
      "PrdyVrss": "101",
      "PrdyCtrt": "29.97"
    },
    {
      "Iscd": "294630",
      "KorIsnm": "서남",
      "DataRank": "3",
      "Prpr": "8470",
      "PrdyVrssSign": "1",
      "PrdyVrss": "1950",
      "PrdyCtrt": "29.91"
    },
    {
      "Iscd": "004830",
      "KorIsnm": "덕성",
      "DataRank": "4",
      "Prpr": "12120",
      "PrdyVrssSign": "1",
      "PrdyVrss": "2790",
      "PrdyCtrt": "29.90"
    },
    {
      "Iscd": "101360",
      "KorIsnm": "에코앤드림",
      "DataRank": "5",
      "Prpr": "59800",
      "PrdyVrssSign": "1",
      "PrdyVrss": "13750",
      "PrdyCtrt": "29.86"
    },
    {
      "Iscd": "347700",
      "KorIsnm": "라이프시맨틱스",
      "DataRank": "6",
      "Prpr": "2510",
      "PrdyVrssSign": "1",
      "PrdyVrss": "576",
      "PrdyCtrt": "29.78"
    },
    {
      "Iscd": "000300",
      "KorIsnm": "대유플러스",
      "DataRank": "7",
      "Prpr": "254",
      "PrdyVrssSign": "1",
      "PrdyVrss": "58",
      "PrdyCtrt": "29.59"
    },
    {
      "Iscd": "443670",
      "KorIsnm": "에스피소프트",
      "DataRank": "8",
      "Prpr": "12940",
      "PrdyVrssSign": "2",
      "PrdyVrss": "2850",
      "PrdyCtrt": "28.25"
    },
    {
      "Iscd": "041190",
      "KorIsnm": "우리기술투자",
      "DataRank": "9",
      "Prpr": "8530",
      "PrdyVrssSign": "2",
      "PrdyVrss": "1770",
      "PrdyCtrt": "26.18"
    },
    {
      "Iscd": "032680",
      "KorIsnm": "소프트센",
      "DataRank": "10",
      "Prpr": "796",
      "PrdyVrssSign": "2",
      "PrdyVrss": "157",
      "PrdyCtrt": "24.57"
    },
    {
      "Iscd": "065650",
      "KorIsnm": "메디프론",
      "DataRank": "11",
      "Prpr": "1450",
      "PrdyVrssSign": "2",
      "PrdyVrss": "260",
      "PrdyCtrt": "21.85"
    },
    {
      "Iscd": "416180",
      "KorIsnm": "신성에스티",
      "DataRank": "12",
      "Prpr": "52900",
      "PrdyVrssSign": "2",
      "PrdyVrss": "9450",
      "PrdyCtrt": "21.75"
    },
    {
      "Iscd": "004835",
      "KorIsnm": "덕성우",
      "DataRank": "13",
      "Prpr": "18250",
      "PrdyVrssSign": "2",
      "PrdyVrss": "3250",
      "PrdyCtrt": "21.67"
    },
    {
      "Iscd": "250060",
      "KorIsnm": "모비스",
      "DataRank": "14",
      "Prpr": "6200",
      "PrdyVrssSign": "2",
      "PrdyVrss": "1090",
      "PrdyCtrt": "21.33"
    },
    {
      "Iscd": "101670",
      "KorIsnm": "하이드로리튬",
      "DataRank": "15",
      "Prpr": "6100",
      "PrdyVrssSign": "2",
      "PrdyVrss": "1010",
      "PrdyCtrt": "19.84"
    },
    {
      "Iscd": "021050",
      "KorIsnm": "서원",
      "DataRank": "16",
      "Prpr": "1690",
      "PrdyVrssSign": "2",
      "PrdyVrss": "238",
      "PrdyCtrt": "16.39"
    },
    {
      "Iscd": "182400",
      "KorIsnm": "엔케이맥스",
      "DataRank": "17",
      "Prpr": "2500",
      "PrdyVrssSign": "2",
      "PrdyVrss": "345",
      "PrdyCtrt": "16.01"
    },
    {
      "Iscd": "088290",
      "KorIsnm": "이원컴포텍",
      "DataRank": "18",
      "Prpr": "1795",
      "PrdyVrssSign": "2",
      "PrdyVrss": "239",
      "PrdyCtrt": "15.36"
    },
    {
      "Iscd": "003530",
      "KorIsnm": "한화투자증권",
      "DataRank": "19",
      "Prpr": "4555",
      "PrdyVrssSign": "2",
      "PrdyVrss": "600",
      "PrdyCtrt": "15.17"
    },
    {
      "Iscd": "073570",
      "KorIsnm": "리튬포어스",
      "DataRank": "20",
      "Prpr": "5340",
      "PrdyVrssSign": "2",
      "PrdyVrss": "695",
      "PrdyCtrt": "14.96"
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
