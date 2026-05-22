---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80d95623-7135-481b-b109-d7370f1a261b&api_id=43e60397-77df-4926-8969-3eb18f9f48e3"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세"
api_id: "43e60397-77df-4926-8969-3eb18f9f48e3"
api_name: "선물종목 조회"
tr_id: "83d101ec-3058-4cb4-a14f-2991b4650a4c"
tr_code: "FCODES"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-futureoption/inquiry/future-ticker"
content_type: "application/json;charset=utf-8"
rate_limit: "3"
auth_required: true
---

# 선물종목 조회 (FCODES)

<!-- request_field_count: 7 -->
<!-- response_field_count: 15 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세 |
| API 페이지 | 선물종목 조회 |
| TR명 | 선물종목 조회 |
| TR코드 | `FCODES` |
| 초당 전송 건수 | 3 |
| 설명 | 국내선물 종목조회 API입니다.<br><br>※ 연속키 조회를 통해 종목을 추가로 조회 할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-futureoption/inquiry/future-ticker` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | F  : 지수선물<br>JF : 주식선물 <br>KF : 미니선물<br>CF : 상품선물<br>XF : 섹터선물<br>CM : 야간선물<br>EC : 야간상품선물<br>ES : KOSDAQ150선물<br>EK : 야간미니선물 |

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
| Response Body | `-UnasShrnIscd` | 기초자산종목코드 | String | Y | 16 | - |
| Response Body | `-Iscd` | 종목코드 | String | Y | 9 | - |
| Response Body | `-StndIscd` | 표준종목코드 | String | Y | 12 | - |
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 40 | - |
| Response Body | `-Sdpr` | 기준가 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "F"
  }
}
```

### Response

```text
{
"Out": [
    {
        "Iscd": "A0163000",
        "StndIscd": "KR4A01630008",
        "KorIsnm": "K200 F 202603",
        "Sdpr": "783.80",
        "UnasShrnIscd": "3001",
        "Mxpr1st": "846.50",
        "Mxpr2nd": "901.35",
        "Mxpr3rd": "940.55",
        "Llam1st": "721.10",
        "Llam2nd": "666.25",
        "Llam3rd": "627.05"
    },
    {
        "Iscd": "A0166000",
        "StndIscd": "KR4A01660005",
        "KorIsnm": "K200 F 202606",
        "Sdpr": "781.85",
        "UnasShrnIscd": "3001",
        "Mxpr1st": "844.35",
        "Mxpr2nd": "899.10",
        "Mxpr3rd": "938.20",
        "Llam1st": "719.35",
        "Llam2nd": "664.60",
        "Llam3rd": "625.50"
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
