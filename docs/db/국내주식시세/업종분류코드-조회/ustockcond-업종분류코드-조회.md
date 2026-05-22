---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=d373d73b-9d99-474e-a990-048132353d61"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "d373d73b-9d99-474e-a990-048132353d61"
api_name: "업종분류코드 조회"
tr_id: "9b4103f9-fee9-4ebf-b7c7-490aa1e5f1ed"
tr_code: "USTOCKCOND"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/industry-cls"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 업종분류코드 조회 (USTOCKCOND)

<!-- request_field_count: 8 -->
<!-- response_field_count: 6 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 업종분류코드 조회 |
| TR명 | 업종분류코드 조회 |
| TR코드 | `USTOCKCOND` |
| 초당 전송 건수 | 2 |
| 설명 | 국내  업종분류코드를 조회 할 수 있는 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/industry-cls` |
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
| Request Body | `-InputMrktClsCode` | 입력시장구분코드 | String | Y | 2 | 입력시장 구분코드로, 입력값은 "U" 고정입니다. |
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 32 | K: 코스피<br>Q: 코스닥<br>K2: Kospi200<br>KR: KRX |

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
| Response Body | `입력조건시장분류코드` | 입력조건시장분류코드 | Array | Y | - | - |
| Response Body | `-Iscd` | 종목코드 | String | Y | 9 | - |
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 40 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "U",
    "InputMrktClsCode": "K"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "1001",
      "KorIsnm": "코스피종합"
    },
    {
      "Iscd": "1002",
      "KorIsnm": "대형주"
    },
    {
      "Iscd": "1003",
      "KorIsnm": "중형주"
    },
    {
      "Iscd": "1004",
      "KorIsnm": "소형주"
    },
    {
      "Iscd": "1005",
      "KorIsnm": "음식료·담배"
    },
    {
      "Iscd": "1006",
      "KorIsnm": "섬유·의류"
    },
    {
      "Iscd": "1007",
      "KorIsnm": "종이·목재"
    },
    {
      "Iscd": "1008",
      "KorIsnm": "화학"
    },
    {
      "Iscd": "1009",
      "KorIsnm": "제약"
    },
    {
      "Iscd": "1010",
      "KorIsnm": "비금속"
    },
    {
      "Iscd": "1011",
      "KorIsnm": "금속"
    },
    {
      "Iscd": "1012",
      "KorIsnm": "기계·장비"
    },
    {
      "Iscd": "1013",
      "KorIsnm": "전기·전자"
    },
    {
      "Iscd": "1014",
      "KorIsnm": "의료·정밀기기"
    },
    {
      "Iscd": "1015",
      "KorIsnm": "운송장비·부품"
    },
    {
      "Iscd": "1016",
      "KorIsnm": "유통"
    },
    {
      "Iscd": "1017",
      "KorIsnm": "전기·가스"
    },
    {
      "Iscd": "1018",
      "KorIsnm": "건설"
    },
    {
      "Iscd": "1019",
      "KorIsnm": "운송·창고"
    },
    {
      "Iscd": "1020",
      "KorIsnm": "통신"
    },
    {
      "Iscd": "1021",
      "KorIsnm": "금융"
    },
    {
      "Iscd": "1024",
      "KorIsnm": "증권"
    },
    {
      "Iscd": "1025",
      "KorIsnm": "보험"
    },
    {
      "Iscd": "1026",
      "KorIsnm": "일반서비스"
    },
    {
      "Iscd": "1027",
      "KorIsnm": "제조"
    },
    {
      "Iscd": "1045",
      "KorIsnm": "부동산"
    },
    {
      "Iscd": "1046",
      "KorIsnm": "IT서비스"
    },
    {
      "Iscd": "1047",
      "KorIsnm": "오락·문화"
    },
    {
      "Iscd": "1053",
      "KorIsnm": "KOSPI50종합지수"
    },
    {
      "Iscd": "1054",
      "KorIsnm": "KOSPI100종합지수"
    },
    {
      "Iscd": "1163",
      "KorIsnm": "코스피고배당50"
    },
    {
      "Iscd": "1164",
      "KorIsnm": "코스피배당성장50"
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
