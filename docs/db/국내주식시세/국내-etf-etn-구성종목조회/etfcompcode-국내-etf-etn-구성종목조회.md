---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=660ce8d7-00ab-41dc-b9b3-bb7322cd4729"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "660ce8d7-00ab-41dc-b9b3-bb7322cd4729"
api_name: "국내 ETF/ETN 구성종목조회"
tr_id: "e39f6a16-4ce2-4752-8f61-1fd67611e1b4"
tr_code: "ETFCOMPCODE"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/etf-holdings"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 국내 ETF/ETN 구성종목조회 (ETFCOMPCODE)

<!-- request_field_count: 9 -->
<!-- response_field_count: 12 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 국내 ETF/ETN 구성종목조회 |
| TR명 | 국내 ETF/ETN 구성종목조회 |
| TR코드 | `ETFCOMPCODE` |
| 초당 전송 건수 | 2 |
| 설명 | 문서 미기재 |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/etf-holdings` |
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
| Request Body | `-InputMrktClsCode` | 입력시장구분코드 | String | Y | 2 | "A" 고정 |
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | ETF 종목 조회시 : J<br>ETN 종목조회시 : EN |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 종목코드 입력 |

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
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 40 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-PrdyVrssSign` | 전일대비부호 | String | Y | 1 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |
| Response Body | `-EtfCuUnitScrtCnt` | ETFCU단위증권수 | String | Y | 16 | - |
| Response Body | `-EtfCnfgRate` | ETF구성비율 | String | Y | 16 | - |
| Response Body | `-Iscd` | 종목코드 | String | Y | 9 | - |

## 예제

### Request

```json
{
  "In": {
    "InputMrktClsCode": "A",
    "InputCondMrktDivCode": "J",
    "InputIscd1": "0098N0"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "KorIsnm": "기아",
      "Prpr": "111000",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-3400",
      "PrdyCtrt": "-2.97",
      "EtfCuUnitScrtCnt": "227",
      "EtfCnfgRate": "5.02",
      "Iscd": "000270"
    },
    {
      "KorIsnm": "LX인터내셔널",
      "Prpr": "29600",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-300",
      "PrdyCtrt": "-1.00",
      "EtfCuUnitScrtCnt": "245",
      "EtfCnfgRate": "1.44",
      "Iscd": "001120"
    },
    {
      "KorIsnm": "SK네트웍스",
      "Prpr": "4600",
      "PrdyVrssSign": "2",
      "PrdyVrss": "30",
      "PrdyCtrt": "0.66",
      "EtfCuUnitScrtCnt": "1407",
      "EtfCnfgRate": "1.29",
      "Iscd": "001740"
    },
    {
      "KorIsnm": "신세계",
      "Prpr": "177100",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-300",
      "PrdyCtrt": "-0.17",
      "EtfCuUnitScrtCnt": "67",
      "EtfCnfgRate": "2.36",
      "Iscd": "004170"
    },
    {
      "KorIsnm": "현대차",
      "Prpr": "268500",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-7500",
      "PrdyCtrt": "-2.72",
      "EtfCuUnitScrtCnt": "114",
      "EtfCnfgRate": "6.09",
      "Iscd": "005380"
    },
    {
      "KorIsnm": "DB손해보험",
      "Prpr": "128300",
      "PrdyVrssSign": "2",
      "PrdyVrss": "1400",
      "PrdyCtrt": "1.10",
      "EtfCuUnitScrtCnt": "140",
      "EtfCnfgRate": "3.58",
      "Iscd": "005830"
    },
    {
      "KorIsnm": "NH투자증권",
      "Prpr": "20300",
      "PrdyVrssSign": "2",
      "PrdyVrss": "50",
      "PrdyCtrt": "0.25",
      "EtfCuUnitScrtCnt": "906",
      "EtfCnfgRate": "3.66",
      "Iscd": "005940"
    },
    {
      "KorIsnm": "SK디스커버리",
      "Prpr": "57200",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-1000",
      "PrdyCtrt": "-1.72",
      "EtfCuUnitScrtCnt": "137",
      "EtfCnfgRate": "1.56",
      "Iscd": "006120"
    },
    {
      "KorIsnm": "고려아연",
      "Prpr": "1002000",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-9000",
      "PrdyCtrt": "-0.89",
      "EtfCuUnitScrtCnt": "28",
      "EtfCnfgRate": "5.58",
      "Iscd": "010130"
    },
    {
      "KorIsnm": "삼성증권",
      "Prpr": "73400",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-1300",
      "PrdyCtrt": "-1.74",
      "EtfCuUnitScrtCnt": "185",
      "EtfCnfgRate": "2.70",
      "Iscd": "016360"
    },
    {
      "KorIsnm": "SK텔레콤",
      "Prpr": "52700",
      "PrdyVrssSign": "2",
      "PrdyVrss": "300",
      "PrdyCtrt": "0.57",
      "EtfCuUnitScrtCnt": "323",
      "EtfCnfgRate": "3.39",
      "Iscd": "017670"
    },
    {
      "KorIsnm": "현대엘리베이터",
      "Prpr": "71900",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-800",
      "PrdyCtrt": "-1.10",
      "EtfCuUnitScrtCnt": "161",
      "EtfCnfgRate": "2.30",
      "Iscd": "017800"
    },
    {
      "KorIsnm": "한온시스템",
      "Prpr": "4500",
      "PrdyVrssSign": "2",
      "PrdyVrss": "70",
      "PrdyCtrt": "1.58",
      "EtfCuUnitScrtCnt": "2757",
      "EtfCnfgRate": "2.47",
      "Iscd": "018880"
    },
    {
      "KorIsnm": "기업은행",
      "Prpr": "19320",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-10",
      "PrdyCtrt": "-0.05",
      "EtfCuUnitScrtCnt": "1108",
      "EtfCnfgRate": "4.26",
      "Iscd": "024110"
    },
    {
      "KorIsnm": "삼성카드",
      "Prpr": "49650",
      "PrdyVrssSign": "2",
      "PrdyVrss": "150",
      "PrdyCtrt": "0.30",
      "EtfCuUnitScrtCnt": "257",
      "EtfCnfgRate": "2.54",
      "Iscd": "029780"
    },
    {
      "KorIsnm": "제일기획",
      "Prpr": "20300",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-500",
      "PrdyCtrt": "-2.40",
      "EtfCuUnitScrtCnt": "441",
      "EtfCnfgRate": "1.78",
      "Iscd": "030000"
    },
    {
      "KorIsnm": "KT&G",
      "Prpr": "135900",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-400",
      "PrdyCtrt": "-0.29",
      "EtfCuUnitScrtCnt": "169",
      "EtfCnfgRate": "4.57",
      "Iscd": "033780"
    },
    {
      "KorIsnm": "강원랜드",
      "Prpr": "16680",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-240",
      "PrdyCtrt": "-1.42",
      "EtfCuUnitScrtCnt": "811",
      "EtfCnfgRate": "2.69",
      "Iscd": "035250"
    },
    {
      "KorIsnm": "키움증권",
      "Prpr": "282500",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-8000",
      "PrdyCtrt": "-2.75",
      "EtfCuUnitScrtCnt": "56",
      "EtfCnfgRate": "3.15",
      "Iscd": "039490"
    },
    {
      "KorIsnm": "신한지주",
      "Prpr": "75300",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-1100",
      "PrdyCtrt": "-1.44",
      "EtfCuUnitScrtCnt": "360",
      "EtfCnfgRate": "5.40",
      "Iscd": "055550"
    },
    {
      "KorIsnm": "SNT모티브",
      "Prpr": "31900",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-400",
      "PrdyCtrt": "-1.24",
      "EtfCuUnitScrtCnt": "215",
      "EtfCnfgRate": "1.37",
      "Iscd": "064960"
    },
    {
      "KorIsnm": "GS",
      "Prpr": "47750",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-1200",
      "PrdyCtrt": "-2.45",
      "EtfCuUnitScrtCnt": "205",
      "EtfCnfgRate": "1.95",
      "Iscd": "078930"
    },
    {
      "KorIsnm": "미스토홀딩스",
      "Prpr": "38150",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-600",
      "PrdyCtrt": "-1.55",
      "EtfCuUnitScrtCnt": "643",
      "EtfCnfgRate": "4.88",
      "Iscd": "081660"
    },
    {
      "KorIsnm": "하나금융지주",
      "Prpr": "86900",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-1000",
      "PrdyCtrt": "-1.14",
      "EtfCuUnitScrtCnt": "256",
      "EtfCnfgRate": "4.43",
      "Iscd": "086790"
    },
    {
      "KorIsnm": "메리츠금융지주",
      "Prpr": "113900",
      "PrdyVrssSign": "2",
      "PrdyVrss": "600",
      "PrdyCtrt": "0.53",
      "EtfCuUnitScrtCnt": "170",
      "EtfCnfgRate": "3.85",
      "Iscd": "138040"
    },
    {
      "KorIsnm": "BNK금융지주",
      "Prpr": "14450",
      "PrdyVrssSign": "2",
      "PrdyVrss": "20",
      "PrdyCtrt": "0.14",
      "EtfCuUnitScrtCnt": "1323",
      "EtfCnfgRate": "3.81",
      "Iscd": "138930"
    },
    {
      "KorIsnm": "iM금융지주",
      "Prpr": "13420",
      "PrdyVrssSign": "2",
      "PrdyVrss": "10",
      "PrdyCtrt": "0.07",
      "EtfCuUnitScrtCnt": "863",
      "EtfCnfgRate": "2.31",
      "Iscd": "139130"
    },
    {
      "KorIsnm": "JB금융지주",
      "Prpr": "22600",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-150",
      "PrdyCtrt": "-0.66",
      "EtfCuUnitScrtCnt": "607",
      "EtfCnfgRate": "2.73",
      "Iscd": "175330"
    },
    {
      "KorIsnm": "두산밥캣",
      "Prpr": "59900",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-1300",
      "PrdyCtrt": "-2.12",
      "EtfCuUnitScrtCnt": "332",
      "EtfCnfgRate": "3.96",
      "Iscd": "241560"
    },
    {
      "KorIsnm": "우리금융지주",
      "Prpr": "26000",
      "PrdyVrssSign": "5",
      "PrdyVrss": "-250",
      "PrdyCtrt": "-0.95",
      "EtfCuUnitScrtCnt": "943",
      "EtfCnfgRate": "4.88",
      "Iscd": "316140"
    },
    {
      "KorIsnm": "원화현금",
      "Prpr": "0",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "EtfCuUnitScrtCnt": "1088308",
      "EtfCnfgRate": "0.00",
      "Iscd": "J010010"
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
