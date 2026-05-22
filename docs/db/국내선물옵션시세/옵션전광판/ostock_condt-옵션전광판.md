---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80d95623-7135-481b-b109-d7370f1a261b&api_id=cc54c7e7-2e86-4688-b5cb-f5630fe48c60"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세"
api_id: "cc54c7e7-2e86-4688-b5cb-f5630fe48c60"
api_name: "옵션전광판"
tr_id: "86a83682-dd1d-4ebc-99ab-f674722c961f"
tr_code: "OSTOCK_CONDT"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-futureoption/inquiry/option-board"
content_type: "application/json;charset=utf-8"
rate_limit: "1"
auth_required: true
---

# 옵션전광판 (OSTOCK_CONDT)

<!-- request_field_count: 9 -->
<!-- response_field_count: 38 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세 |
| API 페이지 | 옵션전광판 |
| TR명 | 옵션전광판 |
| TR코드 | `OSTOCK_CONDT` |
| 초당 전송 건수 | 1 |
| 설명 | 당사 HTS [2501] - "선옵 만기월별시세" 화면과 유시한 기능을 제공하는 국내옵션 전광판 API입니다. <br> ※ 행사가를 기준으로 콜옵션/풋옵션 각 50종목에 대한 정보를 제공 합니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-futureoption/inquiry/option-board` |
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
| Request Body | `-InputCondMrktDivCode1` | 입력조건시장분류코드1 | String | Y | 2 | O : 지수옵션<br>KO : 미니옵션<br>WO : 위클리옵션<br>EU : 야간옵션<br>SO : 코스닥 150옵션<br>EQ : 코스닥 150옵션(야간)<br>EM : 미니옵션(야간)<br>EW : 위클리옵션(야간) |
| Request Body | `-InputMtrtYymm1` | 입력입력만기년월1 | String | Y | 6 | 일반옵션 : YYYYMM (ex.202602)<br>위클리옵션 : YYMMWW (ex.2602W3 -> 26년2월3주) <br>                            W뒤의 숫자는 주차를 의미 (ex. 1주차 : W1, 2주차 W2 ) |
| Request Body | `-InputTrgtClsCode` | 입력대상구분코드 | String | Y | 32 | 위클리 옵션 조회시에만 사용. 그 외 옵션 분류코드 사용시 "" 공백 입력<br>WKM : 코스피200 위클리 월 만기<br>WKI : 코스피200 위클리 목 만기 <br>WQM : 코스닥150 위클리 월 만기<br>WQI : 코스닥150 위클리 목 만기 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | Array | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Object | Y | - | - |
| Response Body | `-OptnClsCode` | 옵션구분코드 | String | Y | 1 | 2 : 콜<br>3 : 풋 |
| Response Body | `-Acpr` | 행사가 | String | Y | 16 | - |
| Response Body | `-NearAtm` | ATM구분코드 | String | Y | 16 | - |
| Response Body | `-Iscd` | 종목코드 | String | Y | 20 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyVrssSign` | 전일대비부호 | String | Y | 1 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |
| Response Body | `-Askp1` | 매도호가1 | String | Y | 16 | - |
| Response Body | `-Bidp1` | 매수호가1 | String | Y | 16 | - |
| Response Body | `-CntgVol` | 체결거래량 | String | Y | 16 | - |
| Response Body | `-TotalAskpCsnu` | 총매도호가건수 | String | Y | 16 | - |
| Response Body | `-TotalBidpCsnu` | 총매수호가건수 | String | Y | 16 | - |
| Response Body | `-TotalAskpRsqn` | 총매도호가잔량 | String | Y | 16 | - |
| Response Body | `-TotalBidpRsqn` | 총매수호가잔량 | String | Y | 16 | - |
| Response Body | `-AcmlNtbyQty` | 누적순매수수량 | String | Y | 16 | - |
| Response Body | `-HtsOtstStplQty` | 미결제약정수량 | String | Y | 25 | - |
| Response Body | `-Oprc` | 시가 | String | Y | 16 | - |
| Response Body | `-Hprc` | 고가 | String | Y | 16 | - |
| Response Body | `-Lprc` | 저가 | String | Y | 16 | - |
| Response Body | `-AntcCnpr` | 예상체결가 | String | Y | 16 | - |
| Response Body | `-AntcCntgVrss` | 예상체결대비 | String | Y | 16 | - |
| Response Body | `-AntcCntgVrssSign` | 예상체결대비부호 | String | Y | 1 | - |
| Response Body | `-AntcCntgPrdyCtrt` | 예상체결전일대비율 | String | Y | 16 | - |
| Response Body | `-Thpr` | 이론가 | String | Y | 16 | - |
| Response Body | `-Delta` | 델타 | String | Y | 16 | - |
| Response Body | `-Gama` | 감마 | String | Y | 16 | - |
| Response Body | `-Theta` | 쎄타 | String | Y | 16 | - |
| Response Body | `-Vega` | 베가 | String | Y | 16 | - |
| Response Body | `-Dprt` | 괴리율 | String | Y | 16 | - |
| Response Body | `-PsntIntsVltl` | 현재내재변동성 | String | Y | 16 | - |
| Response Body | `-Invl` | 내재가치 | String | Y | 16 | - |
| Response Body | `-Tmvl` | 시간가치 | String | Y | 16 | - |
| Response Body | `-RmnnDynu` | 잔존일수 | String | Y | 9 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode1": "O",
    "InputMtrtYymm1": "202602",
    "InputTrgtClsCode": ""
  }
}
```

### Response

```json
{
  "Out": [
    {
      "OptnClsCode": "2",
      "Acpr": "870.00",
      "NearAtm": "3",
      "Iscd": "B0162870",
      "Prpr": "0.03",
      "PrdyVrss": "-0.05",
      "PrdyVrssSign": "5",
      "PrdyCtrt": "-62.50",
      "Askp1": "0.03",
      "Bidp1": "0.02",
      "CntgVol": "10",
      "TotalAskpCsnu": "125",
      "TotalBidpCsnu": "121",
      "TotalAskpRsqn": "2225",
      "TotalBidpRsqn": "8316",
      "AcmlNtbyQty": "-2545",
      "HtsOtstStplQty": "11210",
      "Oprc": "0.07",
      "Hprc": "0.08",
      "Lprc": "0.02",
      "AntcCnpr": "0.07",
      "AntcCntgVrss": "-0.01",
      "AntcCntgVrssSign": "5",
      "AntcCntgPrdyCtrt": "-12.50",
      "Thpr": "0.02",
      "Delta": "0.0023",
      "Gama": "0.0003",
      "Theta": "-0.0324",
      "Vega": "0.0061",
      "Dprt": "50.01",
      "PsntIntsVltl": "33.55",
      "Invl": "0.00",
      "Tmvl": "0.03",
      "RmnnDynu": "3"
    },
    {
      "OptnClsCode": "3",
      "Acpr": "870.00",
      "NearAtm": "3",
      "Iscd": "C0162870",
      "Prpr": "88.35",
      "PrdyVrss": "0.00",
      "PrdyVrssSign": "3",
      "PrdyCtrt": "0.00",
      "Askp1": "83.75",
      "Bidp1": "82.30",
      "CntgVol": "0",
      "TotalAskpCsnu": "11",
      "TotalBidpCsnu": "10",
      "TotalAskpRsqn": "20",
      "TotalBidpRsqn": "18",
      "AcmlNtbyQty": "0",
      "HtsOtstStplQty": "10",
      "Oprc": "88.35",
      "Hprc": "88.35",
      "Lprc": "88.35",
      "AntcCnpr": "0.00",
      "AntcCntgVrss": "0.00",
      "AntcCntgVrssSign": "3",
      "AntcCntgPrdyCtrt": "0.00",
      "Thpr": "82.82",
      "Delta": "-0.9978",
      "Gama": "0.0003",
      "Theta": "0.0581",
      "Vega": "0.0061",
      "Dprt": "6.68",
      "PsntIntsVltl": "84.97",
      "Invl": "82.97",
      "Tmvl": "5.38",
      "RmnnDynu": "3"
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
