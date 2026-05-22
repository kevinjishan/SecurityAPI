---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80d95623-7135-481b-b109-d7370f1a261b&api_id=18f56401-9d9e-49c6-8e6b-3b226c1dc222"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세"
api_id: "18f56401-9d9e-49c6-8e6b-3b226c1dc222"
api_name: "현재가조회"
tr_id: "d9c80cbd-ee4e-4a0b-aa9e-fabbc73b6c94"
tr_code: "FOPRICE"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-futureoption/inquiry/price"
content_type: "application/json;charset=utf-8"
rate_limit: "5"
auth_required: true
---

# 현재가조회 (FOPRICE)

<!-- request_field_count: 8 -->
<!-- response_field_count: 27 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세 |
| API 페이지 | 현재가조회 |
| TR명 | 현재가조회 |
| TR코드 | `FOPRICE` |
| 초당 전송 건수 | 5 |
| 설명 | 국내선물옵션 현재가 조회 API입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-futureoption/inquiry/price` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | F  : 지수선물<br>JF : 주식선물 <br>KF : 미니선물<br>CF : 상품선물<br>XF : 섹터선물<br>CM : 야간선물<br>EK : 야간미니선물<br>O  : 지수옵션<br>JO : 주식옵션<br>KO : 미니옵션<br>WO : K200위클리옵션<br>EU : 야간옵션<br>EW : 위클리옵션(야간)<br>SO: 코스닥 150옵션 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 종목코드 입력 ex. 101VC000 |

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
| Response Body | `Out` | Out | Object | Y | - | - |
| Response Body | `-AcmlTrPbmn` | 거래대금 | String | Y | 16 | - |
| Response Body | `-AcmlVol` | 거래량 | String | Y | 16 | - |
| Response Body | `-Askp1` | 매도호가 | String | Y | 16 | - |
| Response Body | `-Bidp1` | 매수호가 | String | Y | 16 | - |
| Response Body | `-Dprt` | 괴리율 | String | Y | 16 | - |
| Response Body | `-HtsOtstStplQty` | 미결제약정수량 | String | Y | 16 | - |
| Response Body | `-OtstStplQtyIcdc` | 미결제증감 | String | Y | 16 | - |
| Response Body | `-PrdyVol` | 전일거래량 | String | Y | 16 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-Thrr` | 이론가 | String | Y | 16 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |
| Response Body | `-MrktBasis` | 시장베이시스 | String | Y | 16 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-Mxpr` | 상한가 | String | Y | 16 | - |
| Response Body | `-Llam` | 하한가 | String | Y | 16 | - |
| Response Body | `-Oprc` | 시가 | String | Y | 16 | - |
| Response Body | `-SdprVrssMrktRate` | 기준가대비시가비율 | String | Y | 16 | - |
| Response Body | `-PrprVrssOprcRate` | 현재가대비시가비율 | String | Y | 16 | - |
| Response Body | `-Hprc` | 고가 | String | Y | 16 | - |
| Response Body | `-SdprVrssHgprRate` | 기준가대비고가비율 | String | Y | 16 | - |
| Response Body | `-Lprc` | 저가 | String | Y | 16 | - |
| Response Body | `-SdprVrssLwprRate` | 기준가대비저가비율 | String | Y | 16 | - |
| Response Body | `-PrprVrssLwprRate` | 현재가대비저가비율 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "F",
    "InputIscd1": "A0163000"
  }
}
```

### Response

```json
{
  "Out": {
    "Prpr": "790.35",
    "Mxpr": "839.15",
    "Llam": "714.85",
    "Oprc": "770.95",
    "SdprVrssMrktRate": "-0.78",
    "PrprVrssOprcRate": "",
    "Hprc": "792.30",
    "SdprVrssHgprRate": "1.97",
    "PrprVrssHgprRate": "",
    "Lprc": "768.50",
    "SdprVrssLwprRate": "-1.09",
    "PrprVrssLwprRate": "",
    "PrdyVrss": "13.35",
    "PrdyCtrt": "1.72",
    "AcmlTrPbmn": "44989887738",
    "AcmlVol": "229825",
    "PrdyVol": "257438",
    "Bidp1": "790.30",
    "Askp1": "790.35",
    "HtsOtstStplQty": "210077",
    "OtstStplQtyIcdc": "-47",
    "Thrr": "790.83",
    "Dprt": "-0.06",
    "MrktBasis": "-0.03"
  },
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
