---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=548b70a6-24cc-4d9d-a7c7-90eb84a497f4&api_id=55d2f2cc-a85e-4bd0-8c61-04e25f0555d1"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세(실시간)"
api_id: "55d2f2cc-a85e-4bd0-8c61-04e25f0555d1"
api_name: "[실시간]KOSDAQ150옵션체결"
tr_id: "1e092788-1061-48a8-aeae-77be63a22def"
tr_code: "OA0"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7070"
path: "/pub/OA0"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]KOSDAQ150옵션체결 (OA0)

<!-- request_field_count: 4 -->
<!-- response_field_count: 62 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세(실시간) |
| API 페이지 | [실시간]KOSDAQ150옵션체결 |
| TR명 | [실시간]KOSDAQ150옵션체결 |
| TR코드 | `OA0` |
| 초당 전송 건수 | - |
| 설명 | KOSDAQ150옵션 실시간 체결가 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7070` |
| 모의투자 도메인 | `wss://openapi.dbsec.co.kr:17070` |
| URL | `/pub/OA0` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `token` | 토큰 | String | Y | 1000 | G/W 에서 발급하는 접근토큰 |
| Request Header | `tr_type` | TR 타입 | String | Y | 1 | 1: 실시간 시세 등록, 2: 실시간 시세 해제, 3: 계좌 등록 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래코드 | String | Y | 3 | TR코드입력: OA0 |
| Request Body | `tr_key` | 종목코드 | String | Y | 20 | KOSDAQ150옵션: SO<br>※ 종목분류코드 + KOSDAQ150옵션 종목코드 입력 (ex. SO206V5007) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래코드 | String | Y | 3 | TR코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `ShrnIscd` | 종목 코드 | String | Y | 9 | - |
| Response Body | `BsopDate` | 실시간일자 | String | Y | 8 | - |
| Response Body | `BsopHour` | 체결 시간 | String | Y | 6 | - |
| Response Body | `Prpr` | 현재가 | String | Y | 18 | - |
| Response Body | `PrprClr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `PrdyVrsssign` | 전일 대비 부호 | String | Y | 1 | - |
| Response Body | `PrdyVrss` | 전일 대비 | String | Y | 18 | - |
| Response Body | `PrdyVrssclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `PrdyCtrt` | 전일 대비율 | String | Y | 18 | - |
| Response Body | `PrdyCtrtclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `CntgVol` | 체결 거래량 | String | Y | 18 | - |
| Response Body | `CntgVolclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `CntgClscode` | 체결 구분 코드 | String | Y | 1 | - |
| Response Body | `AcmlVol` | 누적 거래량 | String | Y | 18 | - |
| Response Body | `AcmlTrpbmn` | 누적 거래 대금 | String | Y | 18 | - |
| Response Body | `Oprc` | 시가 | String | Y | 18 | - |
| Response Body | `OprcClr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Hgpr` | 고가 | String | Y | 18 | - |
| Response Body | `HgprClr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Lwpr` | 저가 | String | Y | 18 | - |
| Response Body | `LwprClr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp1` | 매도호가1 | String | Y | 18 | - |
| Response Body | `Askp1Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp1` | 매수호가1 | String | Y | 18 | - |
| Response Body | `Bidp1Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `OtstStplqty` | 미결제 약정 수량 | String | Y | 18 | - |
| Response Body | `Delta` | 델타 | String | Y | 18 | - |
| Response Body | `Gama` | 감마 | String | Y | 18 | - |
| Response Body | `Vega` | 베가 | String | Y | 18 | - |
| Response Body | `Theta` | 세타 | String | Y | 18 | - |
| Response Body | `Rho` | 로 | String | Y | 18 | - |
| Response Body | `Thpr` | 이론가 | String | Y | 18 | - |
| Response Body | `IntsVltlprpr` | 내재변동성_현재가 | String | Y | 18 | - |
| Response Body | `IntsVltlaskp` | 내재변동성_매도호가 | String | Y | 18 | - |
| Response Body | `IntsVltlbidp` | 내재변동성_매수호가 | String | Y | 18 | - |
| Response Body | `OtstStplqtyicdc` | 미결제 약정 수량 증감 | String | Y | 12 | - |
| Response Body | `OtstStplqtyicdcclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `DynmcUplmtprc` | 실시간상한가 | String | Y | 18 | - |
| Response Body | `DynmcLwlmtprc` | 실시간하한 | String | Y | 18 | - |
| Response Body | `AntcNmixclscode` | 예상지수구분코드 | String | Y | 1 | - |
| Response Body | `OtstStplqtyrefic` | 미결제약정수량직전증감 | String | Y | 12 | - |
| Response Body | `OtstStplqtyreficclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `IntsWrth` | 내재가치 | String | Y | 18 | - |
| Response Body | `TimeWrth` | 시간가치 | String | Y | 18 | - |
| Response Body | `Esdg` | 괴리도 | String | Y | 10 | - |
| Response Body | `EsdgClr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Dprt` | 괴리율 | String | Y | 10 | - |
| Response Body | `DprtClr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `CntgPrgs` | 체결틱추이 | String | Y | 10 | - |
| Response Body | `AsprRaisesign` | 호가상향부호 | String | Y | 1 | - |
| Response Body | `RgbfAntcsdpr` | 전예상기준가 | String | Y | 18 | - |
| Response Body | `RgbfAntcsdprclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `RgbfAntcvrsssign` | 직전예상대비부호 | String | Y | 1 | - |
| Response Body | `RgbfAntcvrss` | 직전예상대비 | String | Y | 18 | - |
| Response Body | `RgbfAntcvrssclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `RgbfAntcctrt` | 직전예상대비율 | String | Y | 18 | - |
| Response Body | `RgbfAntcctrtclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `TotalAskpcsnu` | 총 매도호가 건수 | String | Y | 12 | - |
| Response Body | `TotalBidpcsnu` | 총 매수호가 건수 | String | Y | 12 | - |
| Response Body | `TotalAskprsqn` | 총 매도호가 잔량 | String | Y | 18 | - |
| Response Body | `TotalBidprsqn` | 총 매수호가 잔량 | String | Y | 18 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "{{ _.access_token }}",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "OA0",
    "tr_key": "SO206V5007"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "OA0",
    "tr_key": null
  },
  "body": {
    "ShrnIscd": "206V5008",
    "BsopDate": "20240426",
    "BsopHour": "114715",
    "Prpr": "13.90",
    "PrprClr": "+",
    "PrdyVrsssign": "2",
    "PrdyVrss": "3.70",
    "PrdyVrssclr": "+",
    "PrdyCtrt": "36.27",
    "PrdyCtrtclr": "+",
    "CntgVol": "2",
    "CntgVolclr": "-",
    "CntgClscode": "1",
    "AcmlVol": "5",
    "AcmlTrpbmn": "704",
    "Oprc": "14.20",
    "OprcClr": "+",
    "Hgpr": "14.20",
    "HgprClr": "+",
    "Lwpr": "13.90",
    "LwprClr": "+",
    "Askp1": "16.50",
    "Askp1Clr": "+",
    "Bidp1": "13.90",
    "Bidp1Clr": "+",
    "OtstStplqty": "33",
    "Delta": "0.2614",
    "Gama": "0.0072",
    "Vega": "0.8251",
    "Theta": "-0.9705",
    "Rho": "0.1164",
    "Thpr": "7.04",
    "IntsVltlprpr": "25.60",
    "IntsVltlaskp": "0.00",
    "IntsVltlbidp": "0.00",
    "OtstStplqtyicdc": "0",
    "OtstStplqtyicdcclr": "",
    "DynmcUplmtprc": "0.00",
    "DynmcLwlmtprc": "0.00",
    "AntcNmixclscode": "0",
    "OtstStplqtyrefic": "0",
    "OtstStplqtyreficclr": "",
    "IntsWrth": "0.00",
    "TimeWrth": "13.90",
    "Esdg": "6.86",
    "EsdgClr": "+",
    "Dprt": "97.44",
    "DprtClr": "+",
    "CntgPrgs": "12",
    "AsprRaisesign": "",
    "RgbfAntcsdpr": "0.00",
    "RgbfAntcsdprclr": "+",
    "RgbfAntcvrsssign": "",
    "RgbfAntcvrss": "0.00",
    "RgbfAntcvrssclr": "",
    "RgbfAntcctrt": "0.00",
    "RgbfAntcctrtclr": "",
    "TotalAskpcsnu": "2",
    "TotalBidpcsnu": "4",
    "TotalAskprsqn": "6",
    "TotalBidprsqn": "25"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
