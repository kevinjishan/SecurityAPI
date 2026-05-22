---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=d8621b8b-11fd-4d01-b175-e6e3f6285215"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "d8621b8b-11fd-4d01-b175-e6e3f6285215"
api_name: "주식종목 조회"
tr_id: "de65de78-52fa-4e6e-88b0-54b182eccd57"
tr_code: "JCODES"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/stock-ticker"
content_type: "application/json;charset=utf-8"
rate_limit: "3"
auth_required: true
---

# 주식종목 조회 (JCODES)

<!-- request_field_count: 7 -->
<!-- response_field_count: 9 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 주식종목 조회 |
| TR명 | 주식종목 조회 |
| TR코드 | `JCODES` |
| 초당 전송 건수 | 3 |
| 설명 | 국내주식 종목조회 API입니다.<br><br>※ 연속키 조회를 통해 종목을 추가로 조회 할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/stock-ticker` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | J  : 주식 (KRX)<br>NJ : 주식(NXT)<br>UJ : 주식(통합)<br>E  : ETF<br>EN : ETN |

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
| Response Body | `-Iscd` | 종목코드 | String | Y | 9 | - |
| Response Body | `-MrktClsName` | 시장구분명 | String | Y | 50 | 종목 시장구분 코드입니다.<br>구분자 목록:  "ETF", "ETN","코넥스","코스닥","거래소(코스피)" |
| Response Body | `-StndIscd` | 표준종목코드 | String | Y | 12 | - |
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 40 | - |
| Response Body | `-MrktClsCode` | 시장분류구분코드 | String | Y | 1 | 1: 코스닥<br>4: 코스피 |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "J"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "000020",
      "StndIscd": "KR7000020008",
      "KorIsnm": "동화약품",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000040",
      "StndIscd": "KR7000040006",
      "KorIsnm": "KR모터스",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000050",
      "StndIscd": "KR7000050005",
      "KorIsnm": "경방",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000070",
      "StndIscd": "KR7000070003",
      "KorIsnm": "삼양홀딩스",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000080",
      "StndIscd": "KR7000080002",
      "KorIsnm": "하이트진로",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000087",
      "StndIscd": "KR7000082008",
      "KorIsnm": "하이트진로2우B",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "0000D0",
      "StndIscd": "KR70000D0009",
      "KorIsnm": "TIGER 엔비디아미국채커버드콜밸런스(합성)",
      "MrktClsCode": "1",
      "MrktClsName": "ETF"
    },
    {
      "Iscd": "0000H0",
      "StndIscd": "KR70000H0005",
      "KorIsnm": "KODEX 인도Nifty미드캡100",
      "MrktClsCode": "1",
      "MrktClsName": "ETF"
    },
    {
      "Iscd": "0000J0",
      "StndIscd": "KR70000J0003",
      "KorIsnm": "PLUS 한화그룹주",
      "MrktClsCode": "1",
      "MrktClsName": "ETF"
    },
    {
      "Iscd": "0000Y0",
      "StndIscd": "KR70000Y0004",
      "KorIsnm": "HK 26-12 회사채(AA-이상)액티브",
      "MrktClsCode": "1",
      "MrktClsName": "ETF"
    },
    {
      "Iscd": "0000Z0",
      "StndIscd": "KR70000Z0003",
      "KorIsnm": "RISE 바이오TOP10액티브",
      "MrktClsCode": "1",
      "MrktClsName": "ETF"
    },
    {
      "Iscd": "000100",
      "StndIscd": "KR7000100008",
      "KorIsnm": "유한양행",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000105",
      "StndIscd": "KR7000101006",
      "KorIsnm": "유한양행우",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000120",
      "StndIscd": "KR7000120006",
      "KorIsnm": "CJ대한통운",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000140",
      "StndIscd": "KR7000140004",
      "KorIsnm": "하이트진로홀딩스",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000145",
      "StndIscd": "KR7000141002",
      "KorIsnm": "하이트진로홀딩스우",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000150",
      "StndIscd": "KR7000150003",
      "KorIsnm": "두산",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000155",
      "StndIscd": "KR7000151001",
      "KorIsnm": "두산우",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000157",
      "StndIscd": "KR7000152009",
      "KorIsnm": "두산2우B",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "000180",
      "StndIscd": "KR7000180000",
      "KorIsnm": "성창기업지주",
      "MrktClsCode": "1",
      "MrktClsName": "거래소"
    },
    {
      "Iscd": "0001P0",
      "StndIscd": "KR70001P0004",
      "KorIsnm": "마이티 바이오시밀러&CDMO액티브",
      "MrktClsCode": "1",
      "MrktClsName": "ETF"
    },
    {
      "Iscd": "0001S0",
      "StndIscd": "KR70001S0001",
      "KorIsnm": "TIGER 26-04 회사채(A+이상)액티브",
      "MrktClsCode": "1",
      "MrktClsName": "ETF"
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
