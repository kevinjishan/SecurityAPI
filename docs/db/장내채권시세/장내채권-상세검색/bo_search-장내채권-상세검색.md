---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=b86989c1-9666-42d2-a446-492376f71f1b&api_id=ed6b9416-bd89-4c99-9a8a-7599f0e14474"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "장내채권시세"
api_id: "ed6b9416-bd89-4c99-9a8a-7599f0e14474"
api_name: "장내채권 상세검색"
tr_id: "c2632ba2-c247-48b2-9d46-9cd2e697bba6"
tr_code: "BO_SEARCH"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/krx-bond/search"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 장내채권 상세검색 (BO_SEARCH)

<!-- request_field_count: 12 -->
<!-- response_field_count: 15 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 장내채권시세 |
| API 페이지 | 장내채권 상세검색 |
| TR명 | 장내채권 상세검색 |
| TR코드 | `BO_SEARCH` |
| 초당 전송 건수 | 2 |
| 설명 | 장내채권 상세검색 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/krx-bond/search` |
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
| Request Body | `-InputSerhName` | 입력검색명 | String | Y | 40 | 기본값: ""<br>종목명으로 검색 가능 EX. 국고 |
| Request Body | `-InputBondStndIscd` | 입력채권구분코드 | String | Y | 9 | 0:채권종류(전체)<br>1:국채<br>2:지방채<br>3:회사채<br>4:특수채<br>5:금융채<br>6:일반사채<br>7:주식관련사채 |
| Request Body | `-InputCrdtClsCode` | 입력신용구분코드 | String | Y | 9 | 0:신용등급(전체)<br>1:AAA+ ~ AAA-<br>2:AA+ ~ AA-<br>3:A+ ~ A-<br>4:BBB+ ~ BBB-<br>5:BBB- 미만<br>6:없음 |
| Request Body | `-InputDivClsCode` | 입력분류구분코드 | String | Y | 9 | 0:이자종류(전체)<br>1:할인채<br>2:복리채<br>3:단리채<br>4:이표채 |
| Request Body | `-InputRmnnDynu1` | 입력잔존일수1 | String | Y | 9 | 0:잔존기간(전체)<br>1:6개월 내<br>2:6개월~1년<br>3:1년~2년<br>4:2년~3년 |
| Request Body | `-InputCompDiviType` | 입력비교구분코드 | String | Y | 9 | 0: 수익률조건 전체<br>1:이상<br>2:이하 |
| Request Body | `-InputCntgErt1` | 입력수익률1 | String | Y | 9 | 수익률 입력 (정수만 입력가능)<br>EX. 3 |

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
| Response Body | `-StndIscd` | 표준종목코드 | String | Y | 16 | - |
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 80 | - |
| Response Body | `-BondClsName` | 채권구분명 | String | Y | 40 | - |
| Response Body | `-CrdtVltnGrad1` | 신용평가등급1 | String | Y | 4 | - |
| Response Body | `-IntKindName` | 이자지급방법 | String | Y | 24 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyVrssSign` | 전일대비부호 | String | Y | 16 | - |
| Response Body | `-BondCntgErt` | 체결수익률 | String | Y | 16 | - |
| Response Body | `-RdmpDate` | 상환일 | String | Y | 8 | - |
| Response Body | `-SrfcMnrt` | 표면금리 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputSerhName": "국고",
    "InputBondStndIscd": "0",
    "InputCrdtClsCode": "0",
    "InputDivClsCode": "0",
    "InputRmnnDynu1": "0",
    "InputCompDiviType": "0",
    "InputCntgErt1": "3"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "StndIscd": "KR103501GB67",
      "KorIsnm": "국고01125-2406(21-4)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9932.70",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20240610",
      "SrfcMnrt": "1.125"
    },
    {
      "StndIscd": "KR103501GA92",
      "KorIsnm": "국고01125-2509(20-6)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9691.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20250910",
      "SrfcMnrt": "1.125"
    },
    {
      "StndIscd": "KR103502G990",
      "KorIsnm": "국고01125-3909(19-6)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "7383.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20390910",
      "SrfcMnrt": "1.125"
    },
    {
      "StndIscd": "KR103501GB34",
      "KorIsnm": "국고01250-2603(21-1)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9620.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20260310",
      "SrfcMnrt": "1.250"
    },
    {
      "StndIscd": "KR103501G992",
      "KorIsnm": "국고01375-2409(19-5)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9922.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20240910",
      "SrfcMnrt": "1.375"
    },
    {
      "StndIscd": "KR103502G9C8",
      "KorIsnm": "국고01375-2912(19-8)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "8960.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20291210",
      "SrfcMnrt": "1.375"
    },
    {
      "StndIscd": "KR103502GA67",
      "KorIsnm": "국고01375-3006(20-4)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "8850.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20300610",
      "SrfcMnrt": "1.375"
    },
    {
      "StndIscd": "KR103501GA35",
      "KorIsnm": "국고01500-2503(20-1)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9818.30",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20250310",
      "SrfcMnrt": "1.500"
    },
    {
      "StndIscd": "KR103502G6C4",
      "KorIsnm": "국고01500-2612(16-8)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9500.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20261210",
      "SrfcMnrt": "1.500"
    },
    {
      "StndIscd": "KR103502GAC2",
      "KorIsnm": "국고01500-3012(20-9)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "8800.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20301210",
      "SrfcMnrt": "1.500"
    },
    {
      "StndIscd": "KR103502G693",
      "KorIsnm": "국고01500-3609(16-6)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "8102.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20360910",
      "SrfcMnrt": "1.500"
    },
    {
      "StndIscd": "KR103502GA91",
      "KorIsnm": "국고01500-4009(20-7)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "7735.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20400910",
      "SrfcMnrt": "1.500"
    },
    {
      "StndIscd": "KR103502GA34",
      "KorIsnm": "국고01500-5003(20-2)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "7115.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20500310",
      "SrfcMnrt": "1.500"
    },
    {
      "StndIscd": "KR103503G691",
      "KorIsnm": "국고01500-6609(16-9)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "5931.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20660910",
      "SrfcMnrt": "1.500"
    },
    {
      "StndIscd": "KR103503GA90",
      "KorIsnm": "국고01625-7009(20-10)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "6250.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20700910",
      "SrfcMnrt": "1.625"
    },
    {
      "StndIscd": "KR103501GB91",
      "KorIsnm": "국고01750-2609(21-7)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9650.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20260910",
      "SrfcMnrt": "1.750"
    },
    {
      "StndIscd": "KR103501G935",
      "KorIsnm": "국고01875-2403(19-1)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "10047.90",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20240310",
      "SrfcMnrt": "1.875"
    },
    {
      "StndIscd": "KR103501GBC2",
      "KorIsnm": "국고01875-2412(21-10)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9890.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20241210",
      "SrfcMnrt": "1.875"
    },
    {
      "StndIscd": "KR103502G669",
      "KorIsnm": "국고01875-2606(16-3)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9670.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20260610",
      "SrfcMnrt": "1.875"
    },
    {
      "StndIscd": "KR103502G966",
      "KorIsnm": "국고01875-2906(19-4)",
      "BondClsName": "국채",
      "CrdtVltnGrad1": "",
      "IntKindName": "이표채",
      "Prpr": "9300.00",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "BondCntgErt": "0.000",
      "RdmpDate": "20290610",
      "SrfcMnrt": "1.875"
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
