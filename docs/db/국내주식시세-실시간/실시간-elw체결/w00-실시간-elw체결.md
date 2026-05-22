---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=94b5fddc-b819-451b-9619-13ee42468798&api_id=cd318c5d-5bd3-4998-99a5-c74002e9caba"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세(실시간)"
api_id: "cd318c5d-5bd3-4998-99a5-c74002e9caba"
api_name: "[실시간]ELW체결"
tr_id: "472ef82f-11d1-4a68-a48a-0650f7ae38a1"
tr_code: "W00"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7070"
path: "/pub/W00"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]ELW체결 (W00)

<!-- request_field_count: 4 -->
<!-- response_field_count: 68 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세(실시간) |
| API 페이지 | [실시간]ELW체결 |
| TR명 | [실시간]ELW체결 |
| TR코드 | `W00` |
| 초당 전송 건수 | - |
| 설명 | ELW 실시간 체결가 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7070` |
| 모의투자 도메인 | `wss://openapi.dbsec.co.kr:17070` |
| URL | `/pub/W00` |
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
| Request Body | `tr_cd` | 거래코드 | String | Y | 3 | TR코드입력: W00 |
| Request Body | `tr_key` | 종목코드 | String | Y | 20 | ELW: W<br>※ 종목분류코드 + 주식종목코드 입력 (ex. W 52K297)<br>※ 종목분류코드는 두자리 입력이 필요하므로,  W + " " (공백) 문자를 넣어 2바이트를 맞춰 입력 부탁드리겠습니다. |

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
| Response Body | `StckCntghour` | 체결 시간 | String | Y | 6 | - |
| Response Body | `HourClscode` | 시간 구분 코드 | String | Y | 1 | - |
| Response Body | `AntcNmixclscode` | 예상 지수 구분 코드 | String | Y | 1 | - |
| Response Body | `StckPrpr` | 현재가 | String | Y | 12 | - |
| Response Body | `StckPrprclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `PrdyVrsssign` | 전일 대비 부호 | String | Y | 1 | - |
| Response Body | `PrdyVrss` | 전일 대비 | String | Y | 12 | - |
| Response Body | `PrdyVrssclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `PrdyCtrt` | 전일 대비율 | String | Y | 18 | - |
| Response Body | `PrdyCtrtclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `StckOprc` | 시가 | String | Y | 12 | - |
| Response Body | `StckOprcclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `StckHgpr` | 고가 | String | Y | 12 | - |
| Response Body | `StckHgprclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `StckLwpr` | 저가 | String | Y | 12 | - |
| Response Body | `StckLwprclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `CntgClscode` | 체결 구분 코드 | String | Y | 1 | - |
| Response Body | `CntgVol` | 채결 거래량 | String | Y | 18 | - |
| Response Body | `CntgVolclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AcmlVol` | 누적 거래량 | String | Y | 18 | - |
| Response Body | `AcmlTrpbmn` | 누적 거래 대금 | String | Y | 18 | - |
| Response Body | `Askp1` | 매도호가 | String | Y | 12 | - |
| Response Body | `Askp1Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp1` | 매수호가 | String | Y | 12 | - |
| Response Body | `Bidp1Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqn1` | 매도호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn1` | 매수호가 잔량 | String | Y | 18 | - |
| Response Body | `TotalAskprsqn` | 총 매도호가 잔량 | String | Y | 18 | - |
| Response Body | `TotalBidprsqn` | 총 매수호가 잔량 | String | Y | 18 | - |
| Response Body | `Tmvl` | 시간가치 | String | Y | 18 | - |
| Response Body | `Invl` | 내재가치 | String | Y | 18 | - |
| Response Body | `Prmm` | 프리미엄 값 | String | Y | 18 | - |
| Response Body | `PrmmRate` | 프리미엄 비율 | String | Y | 18 | - |
| Response Body | `Prit` | 패리티 | String | Y | 18 | - |
| Response Body | `Gear` | 기어링 | String | Y | 18 | - |
| Response Body | `PrlsQryrrate` | 순익 분기율 | String | Y | 18 | - |
| Response Body | `IntsVltl` | 내재 변동성 | String | Y | 18 | - |
| Response Body | `Cfp` | 자본지지점 | String | Y | 18 | - |
| Response Body | `Lvrg` | 레버리지 | String | Y | 18 | - |
| Response Body | `Delta` | 델타 | String | Y | 18 | - |
| Response Body | `Gama` | 감마 | String | Y | 18 | - |
| Response Body | `Vega` | 베가 | String | Y | 18 | - |
| Response Body | `Theta` | 세타 | String | Y | 18 | - |
| Response Body | `Rho` | 로 | String | Y | 18 | - |
| Response Body | `Thpr` | 이론가 | String | Y | 18 | - |
| Response Body | `LpAskprsqn1` | LP 매도호가 잔량1 | String | Y | 18 | - |
| Response Body | `LpBidprsqn1` | LP 매수호가 잔량1 | String | Y | 18 | - |
| Response Body | `LpTotalaskprsqn` | LP 총 매도호가 잔량 | String | Y | 18 | - |
| Response Body | `LpTotalbidprsqn` | LP 총 매수호가 잔량 | String | Y | 18 | - |
| Response Body | `LpHvol` | LP 보유량 | String | Y | 18 | - |
| Response Body | `LpHvolclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpHldnrate` | LP 보유 비율 | String | Y | 18 | - |
| Response Body | `LpHldnrateclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `NewMkopclscode` | 신 장운영 구분코드 | String | Y | 2 | - |
| Response Body | `Rltv` | 체결강도 | String | Y | 18 | - |
| Response Body | `RltvClr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `WghnAvrgprpr` | 가중평균가격 | String | Y | 12 | - |
| Response Body | `CntgPrgs` | 체결틱추이 | String | Y | 10 | - |
| Response Body | `RgbfAntcsdpr` | 직전예상기준가(현재가) | String | Y | 12 | - |
| Response Body | `RgbfAntcsdprclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `RgbfAntcvrsssign` | 직전예상부호 | String | Y | 1 | - |
| Response Body | `RgbfAntcvrss` | 직전예상대비 | String | Y | 12 | - |
| Response Body | `RgbfAntcvrssclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `RgbfAntcctrt` | 직전예상대비율 | String | Y | 18 | - |
| Response Body | `RgbfAntcctrtclr` | 색참조(+상승, -하락) | String | Y | 1 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "{{ _.access_token }}",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "W00",
    "tr_key": "W 58J916"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "W00",
    "tr_key": null
  },
  "body": {
    "ShrnIscd": "58J916",
    "BsopDate": "20240426",
    "StckCntghour": "094514",
    "HourClscode": "0",
    "AntcNmixclscode": "1",
    "StckPrpr": "145",
    "StckPrprclr": "+",
    "PrdyVrsssign": "2",
    "PrdyVrss": "40",
    "PrdyVrssclr": "+",
    "PrdyCtrt": "38.10",
    "PrdyCtrtclr": "+",
    "StckOprc": "145",
    "StckOprcclr": "+",
    "StckHgpr": "145",
    "StckHgprclr": "+",
    "StckLwpr": "120",
    "StckLwprclr": "+",
    "CntgClscode": "2",
    "CntgVol": "10",
    "CntgVolclr": "+",
    "AcmlVol": "363730",
    "AcmlTrpbmn": "48696050",
    "Askp1": "145",
    "Askp1Clr": "+",
    "Bidp1": "140",
    "Bidp1Clr": "+",
    "AskpRsqn1": "119190",
    "BidpRsqn1": "85800",
    "TotalAskprsqn": "120190",
    "TotalBidprsqn": "642480",
    "Tmvl": "145.00",
    "Invl": "0.00",
    "Prmm": "0.39",
    "PrmmRate": "0.00",
    "Prit": "97.51",
    "Gear": "257.71",
    "PrlsQryrrate": "2.93",
    "IntsVltl": "17.48",
    "Cfp": "2.94",
    "Lvrg": "57.731674",
    "Delta": "0.224018",
    "Gama": "0.026721",
    "Vega": "19.158548",
    "Theta": "-22.350697",
    "Rho": "2.501193",
    "Thpr": "159.52",
    "LpAskprsqn1": "0",
    "LpBidprsqn1": "0",
    "LpTotalaskprsqn": "0",
    "LpTotalbidprsqn": "0",
    "LpHvol": "9029930",
    "LpHvolclr": "+",
    "LpHldnrate": "90.30",
    "LpHldnrateclr": "+",
    "NewMkopclscode": "20",
    "Rltv": "98.59",
    "RltvClr": "-",
    "WghnAvrgprpr": "133",
    "CntgPrgs": "3403403003",
    "RgbfAntcsdpr": "0",
    "RgbfAntcsdprclr": "",
    "RgbfAntcvrsssign": "",
    "RgbfAntcvrss": "0",
    "RgbfAntcvrssclr": "",
    "RgbfAntcctrt": "0.00",
    "RgbfAntcctrtclr": ""
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
