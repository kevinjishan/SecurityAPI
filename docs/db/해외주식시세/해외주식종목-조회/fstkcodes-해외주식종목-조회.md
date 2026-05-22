---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=a804e311-cb53-499b-9d8a-a4d838f0a484&api_id=22c67f31-c325-4898-8929-6ba9836d982f"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식시세"
api_id: "22c67f31-c325-4898-8929-6ba9836d982f"
api_name: "해외주식종목 조회"
tr_id: "7e7b597a-473b-4f7f-ba51-438a7c0ffa89"
tr_code: "FSTKCODES"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/overseas-stock/inquiry/stock-ticker"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 해외주식종목 조회 (FSTKCODES)

<!-- request_field_count: 7 -->
<!-- response_field_count: 10 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식시세 |
| API 페이지 | 해외주식종목 조회 |
| TR명 | 해외주식종목 조회 |
| TR코드 | `FSTKCODES` |
| 초당 전송 건수 | 2 |
| 설명 | 해외주식 종목 조회 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/overseas-stock/inquiry/stock-ticker` |
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
| Request Body | `-InputDataCode` | 입력해외증시구분코드 | String | Y | 2 | NY: 뉴욕<br>NA: 나스닥<br>AM: 아멕스 |

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
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 40 | - |
| Response Body | `-BstpLargName` | 업종대분류명 | String | Y | 40 | - |
| Response Body | `-ExchClsCode2` | 거래소코드2 | String | Y | 4 | - |
| Response Body | `-SelnVolUnit` | 매도량단위 | String | Y | 9 | - |
| Response Body | `-ShnuVolUnit` | 매수량단위 | String | Y | 9 | - |

## 예제

### Request

```json
{
  "In": {
    "InputDataCode": "NA"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "AACG",
      "KorIsnm": "ATA 크리에티비티 글로벌(ADR)",
      "BstpLargName": "경기 소비재",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AACI",
      "KorIsnm": "아마다 애퀴지션",
      "BstpLargName": "금융",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AACIU",
      "KorIsnm": "아마다 애퀴지션 유닛",
      "BstpLargName": "금융",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AADI",
      "KorIsnm": "AADI 바이오사이언스",
      "BstpLargName": "헬스케어",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AADR",
      "KorIsnm": "ADVISORSHARES TRUST ADVISORSHARES DORSEY WRIGHT ADR ETF",
      "BstpLargName": "",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAGR",
      "KorIsnm": "아프리칸 애그리컬처 홀딩스",
      "BstpLargName": "필수 소비재",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAL",
      "KorIsnm": "아메리칸 에어라인스 그룹",
      "BstpLargName": "산업재",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAME",
      "KorIsnm": "애틀랜틱 아메리칸",
      "BstpLargName": "금융",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAOI",
      "KorIsnm": "어플라이드 옵토일렉트로닉스",
      "BstpLargName": "IT",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAON",
      "KorIsnm": "에이에이온",
      "BstpLargName": "산업재",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAPB",
      "KorIsnm": "GRANITESHARES ETF TRUST 2X LONG AAPL DAILY ETF",
      "BstpLargName": "",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAPD",
      "KorIsnm": "DIREXION SHARES ETF TRUST DAILY AAPL BEAR 1X SHS",
      "BstpLargName": "",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAPL",
      "KorIsnm": "애플",
      "BstpLargName": "IT",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAPU",
      "KorIsnm": "DIREXION SHARES ETF TRUST DAILY AAPL BULL 1.5X SHS",
      "BstpLargName": "",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "AAXJ",
      "KorIsnm": "ISHARES TRUST MSCI ALL COUNTRY ASIA EX JAPAN ETF",
      "BstpLargName": "",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "ABAT",
      "KorIsnm": "아메리칸 배터리 테크놀로지",
      "BstpLargName": "소재",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "ABCB",
      "KorIsnm": "아메리스 뱅코프",
      "BstpLargName": "금융",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "ABCL",
      "KorIsnm": "앱셀레라 바이오로직스",
      "BstpLargName": "헬스케어",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "ABCS",
      "KorIsnm": "EA SERIES TRUST ALPHA BLUE CAP US SM-MID CAP DYNAMIC ETF",
      "BstpLargName": "",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
    },
    {
      "Iscd": "ABEO",
      "KorIsnm": "아베오나 테라퓨틱스",
      "BstpLargName": "헬스케어",
      "ExchClsCode2": "FN",
      "SelnVolUnit": "1",
      "ShnuVolUnit": "1"
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
