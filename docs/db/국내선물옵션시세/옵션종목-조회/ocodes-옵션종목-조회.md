---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80d95623-7135-481b-b109-d7370f1a261b&api_id=a51e61c7-a77f-408c-99bd-69f1ae4df730"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세"
api_id: "a51e61c7-a77f-408c-99bd-69f1ae4df730"
api_name: "옵션종목 조회"
tr_id: "eb29414c-037d-41dd-b88c-c9af1e8b6392"
tr_code: "OCODES"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-futureoption/inquiry/option-ticker"
content_type: "application/json;charset=utf-8"
rate_limit: "10"
auth_required: true
---

# 옵션종목 조회 (OCODES)

<!-- request_field_count: 7 -->
<!-- response_field_count: 18 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세 |
| API 페이지 | 옵션종목 조회 |
| TR명 | 옵션종목 조회 |
| TR코드 | `OCODES` |
| 초당 전송 건수 | 10 |
| 설명 | 국내옵션 종목조회 API입니다.<br><br>※ 연속키 조회를 통해 종목을 추가로 조회 할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-futureoption/inquiry/option-ticker` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |
| Request Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부(Y:연속거래 사용 N:연속거래 사용안함) |
| Request Header | `cont_key` | 연속키 값 | String | N | 70 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | N | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `In` | In | Object | Y | - | - |
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | O  : 지수옵션<br>JO : 주식옵션<br>KO : 미니옵션<br>WO : K200위클리옵션<br>EU : 야간옵션<br>SO : 코스닥 150옵션<br>EQ : KOSDAQ150옵션(야간)<br>EM : 미니옵션(야간)<br>EW : 위클리옵션(야간) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Array | Y | - | - |
| Response Body | `-Llam1st` | 1단계하한가 | String | Y | 16 | - |
| Response Body | `-Llam2nd` | 2단계하한가 | String | Y | 16 | - |
| Response Body | `-Llam3rd` | 3단계하한가 | String | Y | 16 | - |
| Response Body | `-Mxpr1st` | 1단계상한가 | String | Y | 16 | - |
| Response Body | `-Mxpr2nd` | 2단계상한가 | String | Y | 16 | - |
| Response Body | `-Mxpr3rd` | 3단계상한가 | String | Y | 16 | - |
| Response Body | `-UnasIsnm` | 기초자산명 | String | Y | 16 | - |
| Response Body | `-Acpr` | 행사가 | String | Y | 8 | - |
| Response Body | `-RmnnDynu` | 잔존만기 | String | Y | 2 | - |
| Response Body | `-Iscd` | 종목코드 | String | Y | 9 | - |
| Response Body | `-StndIscd` | 표준종목코드 | String | Y | 12 | - |
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 40 | - |
| Response Body | `-AtmClsCode` | ATM구분코드 | String | Y | 1 | - |
| Response Body | `-TrMltl` | 거래승수 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "O"
  }
}
```

### Response

```text
{
 "Out": [
    {
        "Iscd": "B0162305",
        "StndIscd": "KR4B01623051",
        "KorIsnm": "C 202602 305.0",
        "AtmClsCode": "2",
        "TrMltl": "250000.00000000",
        "RmnnDynu": "3",
        "Acpr": "305.00",
        "UnasIsnm": "KP200종합",
        "Mxpr1st": "538.45",
        "Mxpr2nd": "593.15",
        "Mxpr3rd": "632.15",
        "Llam1st": "413.55",
        "Llam2nd": "358.90",
        "Llam3rd": "319.85"
    },
    {
        "Iscd": "B0162307",
        "StndIscd": "KR4B01623077",
        "KorIsnm": "C 202602 307.5",
        "AtmClsCode": "2",
        "TrMltl": "250000.00000000",
        "RmnnDynu": "3",
        "Acpr": "307.50",
        "UnasIsnm": "KP200종합",
        "Mxpr1st": "535.95",
        "Mxpr2nd": "590.65",
        "Mxpr3rd": "629.65",
        "Llam1st": "411.05",
        "Llam2nd": "356.40",
        "Llam3rd": "317.35"
    },
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
