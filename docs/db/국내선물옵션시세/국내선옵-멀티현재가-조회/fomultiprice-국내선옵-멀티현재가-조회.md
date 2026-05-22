---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80d95623-7135-481b-b109-d7370f1a261b&api_id=0d013d41-68cb-4ccb-92e6-893e27048217"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세"
api_id: "0d013d41-68cb-4ccb-92e6-893e27048217"
api_name: "국내선옵 멀티현재가 조회"
tr_id: "33933b16-e614-46b2-a8ad-bfe135ae367a"
tr_code: "FOMULTIPRICE"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-futureoption/inquiry/multiprice"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 국내선옵 멀티현재가 조회 (FOMULTIPRICE)

<!-- request_field_count: 9 -->
<!-- response_field_count: 29 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세 |
| API 페이지 | 국내선옵 멀티현재가 조회 |
| TR명 | 국내선옵 멀티현재가 조회 |
| TR코드 | `FOMULTIPRICE` |
| 초당 전송 건수 | 2 |
| 설명 | 국내선물옵션 멀티 현재가 조회 API입니다. <br><br> ※ 1회 호출에 최대 50종목의 시세를 확인 가능합니다.  <br> ※ "dataCnt"  필드에 요청할 데이터의 개수를 입력하여 호출이 가능 합니다. (1~50)  <br> ※ "dataCnt" 필드의 값과 입력 데이터의 개수가 일치하지 않으면 호출이 불가합니다.  <br>※ 아래와 같이시장구분필드와 종목코드가 1:1 쌍을 이뤄야 호출이 정상적으로 이뤄집니다.    <br> - InputIscd1:F (시장구분필드),  <br> - InputCondMrktDivCode1:A0166000 (종목코드) <br>※ [InputIscd1 ~ InputCondMrktDivCode1] & [InputCondMrktDivCode50 ~ InputCondMrktDivCode50]과 같이 최대 50건 호출이 가능합니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-futureoption/inquiry/multiprice` |
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
| Request Body | `-dataCnt` | 호출건수 | String | Y | 2 | 1~50사이의 값 입력 |
| Request Body | `-InputCondMrktDivCode1` | 입력조건시장분류코드1 | String | Y | 2 | F : 지수선물<br>JF : 주식선물<br>KF : 미니선물<br>CF : 상품선물<br>XF : 섹터선물<br>CM : 야간선물<br>EK : 야간미니선물<br>O : 지수옵션<br>JO : 주식옵션<br>KO : 미니옵션<br>WO : K200위클리옵션<br>EU : 야간옵션<br>EW : 위클리옵션(야간)<br>SO: 코스닥 150옵션 |
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
| Response Body | `Out` | Out | Array | Y | - | - |
| Response Body | `-Iscd` | 종목코드 | String | Y | 20 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-Mxpr` | 상한가 | String | Y | 16 | - |
| Response Body | `-Llam` | 하한가 | String | Y | 16 | - |
| Response Body | `-Oprc` | 시가 | String | Y | 16 | - |
| Response Body | `- SdprVrssMrktRate` | 기준가대비시가비율 | String | Y | 16 | - |
| Response Body | `-PrprVrssOprcRate` | 현재가대비시가비율 | String | Y | 16 | - |
| Response Body | `-Hprc` | 고가 | String | Y | 16 | - |
| Response Body | `-SdprVrssHgprRate` | 기준가대비고가비율 | String | Y | 16 | - |
| Response Body | `-PrprVrssHgprRate` | 현재가대비고가비율 | String | Y | 16 | - |
| Response Body | `-Lprc` | 저가 | String | Y | 16 | - |
| Response Body | `-SdprVrssLwprRate` | 기준가대비저가비율 | String | Y | 16 | - |
| Response Body | `-PrprVrssLwprRate` | 현재가대비저가비율 | String | Y | 16 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |
| Response Body | `-AcmlTrPbmn` | 거래대금 | String | Y | 25 | - |
| Response Body | `-AcmlVol` | 거래량 | String | Y | 25 | - |
| Response Body | `-PrdyVol` | 전일거래량 | String | Y | 25 | - |
| Response Body | `-Bidp1` | 매수호가 | String | Y | 16 | - |
| Response Body | `-Askp1` | 매도호가 | String | Y | 16 | - |
| Response Body | `-HtsOtstStplQty` | 미결제약정수량 | String | Y | 25 | - |
| Response Body | `-OtstStplQtyIcdc` | 미결제증감 | String | Y | 16 | - |
| Response Body | `-Thrr` | 이론가 | String | Y | 16 | - |
| Response Body | `-Dprt` | 괴리율 | String | Y | 16 | - |
| Response Body | `-MrktBasis` | 시장베이시스 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "dataCnt": 5,
    "InputCondMrktDivCode1": "O",
    "InputIscd1": "B0164375",
    "InputCondMrktDivCode2": "F",
    "InputIscd2": "A0166000",
    "InputCondMrktDivCode3": "CF",
    "InputIscd3": "A6563000",
    "InputCondMrktDivCode4": "WO",
    "InputIscd4": "B09ES787",
    "InputCondMrktDivCode5": "JO",
    "InputIscd5": "B1164073"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "B0164375",
      "Prpr": "464.40",
      "Mxpr": "531.70",
      "Llam": "397.15",
      "Oprc": "464.40",
      "SdprVrssMrktRate": "0.00",
      "PrprVrssOprcRate": "",
      "Hprc": "464.40",
      "SdprVrssHgprRate": "0.00",
      "PrprVrssHgprRate": "",
      "Lprc": "464.40",
      "SdprVrssLwprRate": "0.00",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "0.00",
      "PrdyCtrt": "0.00",
      "AcmlTrPbmn": "0",
      "AcmlVol": "0",
      "PrdyVol": "0",
      "Bidp1": "500.70",
      "Askp1": "514.50",
      "HtsOtstStplQty": "24",
      "OtstStplQtyIcdc": "0",
      "Thrr": "510.98",
      "Dprt": "-9.12",
      "MrktBasis": "-424.17"
    },
    {
      "Iscd": "A0166000",
      "Prpr": "890.70",
      "Mxpr": "911.80",
      "Llam": "776.80",
      "Oprc": "861.55",
      "SdprVrssMrktRate": "2.04",
      "PrprVrssOprcRate": "",
      "Hprc": "892.60",
      "SdprVrssHgprRate": "5.72",
      "PrprVrssHgprRate": "",
      "Lprc": "861.00",
      "SdprVrssLwprRate": "1.98",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "46.40",
      "PrdyCtrt": "5.50",
      "AcmlTrPbmn": "32316706063",
      "AcmlVol": "147092",
      "PrdyVol": "139807",
      "Bidp1": "890.45",
      "Askp1": "890.70",
      "HtsOtstStplQty": "194730",
      "OtstStplQtyIcdc": "1433",
      "Thrr": "892.23",
      "Dprt": "-0.17",
      "MrktBasis": "2.13"
    },
    {
      "Iscd": "",
      "Prpr": "",
      "Mxpr": "",
      "Llam": "",
      "Oprc": "",
      "SdprVrssMrktRate": "",
      "PrprVrssOprcRate": "",
      "Hprc": "",
      "SdprVrssHgprRate": "",
      "PrprVrssHgprRate": "",
      "Lprc": "",
      "SdprVrssLwprRate": "",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "",
      "PrdyCtrt": "",
      "AcmlTrPbmn": "",
      "AcmlVol": "",
      "PrdyVol": "",
      "Bidp1": "",
      "Askp1": "",
      "HtsOtstStplQty": "",
      "OtstStplQtyIcdc": "",
      "Thrr": "",
      "Dprt": "",
      "MrktBasis": ""
    },
    {
      "Iscd": "B09ES787",
      "Prpr": "75.15",
      "Mxpr": "121.05",
      "Llam": "0.01",
      "Oprc": "75.15",
      "SdprVrssMrktRate": "40.21",
      "PrprVrssOprcRate": "",
      "Hprc": "75.15",
      "SdprVrssHgprRate": "40.21",
      "PrprVrssHgprRate": "",
      "Lprc": "75.15",
      "SdprVrssLwprRate": "40.21",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "21.55",
      "PrdyCtrt": "40.21",
      "AcmlTrPbmn": "18788",
      "AcmlVol": "1",
      "PrdyVol": "0",
      "Bidp1": "92.10",
      "Askp1": "121.05",
      "HtsOtstStplQty": "3",
      "OtstStplQtyIcdc": "1",
      "Thrr": "101.25",
      "Dprt": "-25.78",
      "MrktBasis": "-813.42"
    },
    {
      "Iscd": "B1164073",
      "Prpr": "73800",
      "Mxpr": "94400",
      "Llam": "54400",
      "Oprc": "73800",
      "SdprVrssMrktRate": "0.00",
      "PrprVrssOprcRate": "",
      "Hprc": "73800",
      "SdprVrssHgprRate": "0.00",
      "PrprVrssHgprRate": "",
      "Lprc": "73800",
      "SdprVrssLwprRate": "0.00",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlTrPbmn": "0",
      "AcmlVol": "0",
      "PrdyVol": "0",
      "Bidp1": "0",
      "Askp1": "0",
      "HtsOtstStplQty": "0",
      "OtstStplQtyIcdc": "0",
      "Thrr": "87986",
      "Dprt": "-16.12",
      "MrktBasis": "-134700"
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
