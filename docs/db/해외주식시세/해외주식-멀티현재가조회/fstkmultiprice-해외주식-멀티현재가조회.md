---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=a804e311-cb53-499b-9d8a-a4d838f0a484&api_id=729276aa-9913-444e-b637-8efc316de84e"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식시세"
api_id: "729276aa-9913-444e-b637-8efc316de84e"
api_name: "해외주식 멀티현재가조회"
tr_id: "14c1a722-d25b-473a-9e94-cd4178b66742"
tr_code: "FSTKMULTIPRICE"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/overseas-stock/inquiry/multiprice"
content_type: "application/json;charset=utf-8"
rate_limit: "1"
auth_required: true
---

# 해외주식 멀티현재가조회 (FSTKMULTIPRICE)

<!-- request_field_count: 9 -->
<!-- response_field_count: 21 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식시세 |
| API 페이지 | 해외주식 멀티현재가조회 |
| TR명 | 해외주식 멀티현재가조회 |
| TR코드 | `FSTKMULTIPRICE` |
| 초당 전송 건수 | 1 |
| 설명 | 해외주식시세 멀티 현재가 조회 API입니다. <br><br> ※ 1회 호출에 최대 50종목의 시세를 확인 가능합니다.  <br> ※ "dataCnt"  필드에 요청할 데이터의 개수를 입력하여 호출이 가능 합니다. (1~50)  <br> ※ "dataCnt" 필드의 값과 입력 데이터의 개수가 일치하지 않으면 호출이 불가합니다.  <br>※ 아래와 같이시장구분필드와 종목코드가 1:1 쌍을 이뤄야 호출이 정상적으로 이뤄집니다.    <br> - InputIscd1:J (시장구분필드),  <br> - InputCondMrktDivCode1:005930 (종목코드) <br>※ [InputIscd1 ~ InputCondMrktDivCode1] & [InputCondMrktDivCode50 ~ InputCondMrktDivCode50]과 같이 최대 50건 호출이 가능합니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/overseas-stock/inquiry/multiprice` |
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
| Request Body | `-dataCnt` | 호출건수 | String | Y | 2 | 1~50사이의 값 입력 |
| Request Body | `-InputCondMrktDivCode1` | 입력조건시장분류코드1 | String | Y | 2 | FY:뉴욕<br>FN:나스닥<br>FA:아멕스 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 해외주식 종목코드 (ex. TQQQ) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Array | Y | - | - |
| Response Body | `-Iscd` | 종목코드 | String | Y | 16 | - |
| Response Body | `-KorIsnm` | 한글종목명 | String | Y | 16 | - |
| Response Body | `-Sdpr` | 기준가 | String | Y | 16 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-Mxpr` | 상한가 | String | Y | 16 | - |
| Response Body | `-Llam` | 하한가 | String | Y | 16 | - |
| Response Body | `-Oprc` | 시가 | String | Y | 16 | - |
| Response Body | `-SdprVrssMrktRate` | 기준가대비시가비율 | String | Y | 16 | - |
| Response Body | `-PrprVrssOprcRate` | 현재가대비시가비율 | String | Y | 16 | - |
| Response Body | `-Hprc` | 고가 | String | Y | 16 | - |
| Response Body | `-SdprVrssHgprRate` | 기준가대비고가비율 | String | Y | 16 | - |
| Response Body | `-PrprVrssHgprRate` | 현재가대비고가비율 | String | Y | 16 | - |
| Response Body | `-Lprc` | 저가 | String | Y | 16 | - |
| Response Body | `-SdprVrssLwprRate` | 기준가대비저가비율 | String | Y | 16 | - |
| Response Body | `-PrprVrssLwprRate` | 현재가대비저가비율 | String | Y | 16 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "dataCnt": 5,
    "InputCondMrktDivCode1": "FN",
    "InputIscd1": "TSLA",
    "InputCondMrktDivCode2": "FN",
    "InputIscd2": "AAPL",
    "InputCondMrktDivCode3": "FN",
    "InputIscd3": "GOOG",
    "InputCondMrktDivCode4": "FN",
    "InputIscd4": "NVDA",
    "InputCondMrktDivCode5": "FN",
    "InputIscd5": "META"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "TSLA",
      "KorIsnm": "테슬라",
      "Sdpr": "300.7100",
      "Prpr": "304.0600",
      "Mxpr": "0.0000",
      "Llam": "0.0000",
      "Oprc": "303.0700",
      "SdprVrssMrktRate": "0.78",
      "PrprVrssOprcRate": "",
      "Hprc": "304.6000",
      "SdprVrssHgprRate": "1.29",
      "PrprVrssHgprRate": "",
      "Lprc": "302.4800",
      "SdprVrssLwprRate": "0.59",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "3.3500",
      "PrdyCtrt": "1.11"
    },
    {
      "Iscd": "AAPL",
      "KorIsnm": "애플",
      "Sdpr": "207.8200",
      "Prpr": "209.4900",
      "Mxpr": "0.0000",
      "Llam": "0.0000",
      "Oprc": "209.3800",
      "SdprVrssMrktRate": "0.75",
      "PrprVrssOprcRate": "",
      "Hprc": "209.6400",
      "SdprVrssHgprRate": "0.88",
      "PrprVrssHgprRate": "",
      "Lprc": "209.0000",
      "SdprVrssLwprRate": "0.57",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "1.6700",
      "PrdyCtrt": "0.80"
    },
    {
      "Iscd": "GOOG",
      "KorIsnm": "알파벳 C",
      "Sdpr": "176.9100",
      "Prpr": "176.7500",
      "Mxpr": "0.0000",
      "Llam": "0.0000",
      "Oprc": "177.0000",
      "SdprVrssMrktRate": "0.05",
      "PrprVrssOprcRate": "",
      "Hprc": "177.0400",
      "SdprVrssHgprRate": "0.07",
      "PrprVrssHgprRate": "",
      "Lprc": "176.6500",
      "SdprVrssLwprRate": "-0.15",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "-0.1600",
      "PrdyCtrt": "-0.09"
    },
    {
      "Iscd": "NVDA",
      "KorIsnm": "엔비디아",
      "Sdpr": "153.3000",
      "Prpr": "153.3600",
      "Mxpr": "0.0000",
      "Llam": "0.0000",
      "Oprc": "153.4400",
      "SdprVrssMrktRate": "0.09",
      "PrprVrssOprcRate": "",
      "Hprc": "153.6200",
      "SdprVrssHgprRate": "0.21",
      "PrprVrssHgprRate": "",
      "Lprc": "153.2200",
      "SdprVrssLwprRate": "-0.05",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "0.0600",
      "PrdyCtrt": "0.04"
    },
    {
      "Iscd": "META",
      "KorIsnm": "메타 플랫폼스(페이스북)",
      "Sdpr": "719.2200",
      "Prpr": "720.0000",
      "Mxpr": "0.0000",
      "Llam": "0.0000",
      "Oprc": "720.0100",
      "SdprVrssMrktRate": "0.11",
      "PrprVrssOprcRate": "",
      "Hprc": "720.7400",
      "SdprVrssHgprRate": "0.21",
      "PrprVrssHgprRate": "",
      "Lprc": "719.7500",
      "SdprVrssLwprRate": "0.07",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "0.7800",
      "PrdyCtrt": "0.11"
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
