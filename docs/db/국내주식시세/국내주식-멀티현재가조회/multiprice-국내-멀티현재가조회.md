---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=3abd4f11-4a92-48f3-bc3e-726a97a47905"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "3abd4f11-4a92-48f3-bc3e-726a97a47905"
api_name: "국내주식 멀티현재가조회"
tr_id: "b1a8a157-d4f7-4c61-93b1-0f26d4f5603b"
tr_code: "MULTIPRICE"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/multiprice"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 국내 멀티현재가조회 (MULTIPRICE)

<!-- request_field_count: 9 -->
<!-- response_field_count: 21 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 국내주식 멀티현재가조회 |
| TR명 | 국내 멀티현재가조회 |
| TR코드 | `MULTIPRICE` |
| 초당 전송 건수 | 2 |
| 설명 | 국내시세 멀티 현재가 조회 API입니다. <br><br> ※ 1회 호출에 최대 50종목의 시세를 확인 가능합니다.  <br> ※ "dataCnt"  필드에 요청할 데이터의 개수를 입력하여 호출이 가능 합니다. (1~50)  <br> ※ "dataCnt" 필드의 값과 입력 데이터의 개수가 일치하지 않으면 호출이 불가합니다.  <br>※ 아래와 같이시장구분필드와 종목코드가 1:1 쌍을 이뤄야 호출이 정상적으로 이뤄집니다.    <br> - InputCondMrktDivCode1:J (시장구분필드),  <br> - InputIscd1:005930 (종목코드) <br>※ [InputIscd1 ~ InputCondMrktDivCode1] & [InputIscd50  ~ InputCondMrktDivCode50]과 같이 최대 50건 호출이 가능합니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/multiprice` |
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
| Request Body | `-InputCondMrktDivCode1` | 입력조건시장분류코드1 | String | Y | 2 | 주식:J<br>주식(NXT): NJ<br>주식(통합): UJ<br>ETN: EN<br>ELW: W<br>업종&지수: U<br>F : 지수선물<br>JF : 주식선물<br>KF : 미니선물<br>CF : 상품선물<br>XF : 섹터선물<br>CM : 야간선물<br>O : 지수옵션<br>JO : 주식옵션<br>KO : 미니옵션<br>WO : K200위클리옵션<br>EU : 야간옵션<br>SO: 코스닥 150옵션<br>※ ETF종목의 경우 J 코드를 사용해 조회 부탁드립니다. |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 주식(J, NJ, UJ) 선택시 주식종목코드 입력 <br> - J(KRX 주식): (ex. 005930)<br> - NJ(NXT 주식): (ex. N-005930)<br> - UJ(통합): (ex. U-005930)<br>※ NXT/통합시세로 종목 조회 시 반드시 종목 앞에 구분자 (N-, U-)를 붙여서 호출 부탁드리겠습니다.<br>업종(U) 선택시  지수코드:<br>1001: KOSPI<br>2001: KOSDAQ<br>3001: KOSPI200<br>1002: 코스피(대형주)     <br>1004: 코스피(소형주)<br>1053: KOSPI50종합지수<br>1054: KOSPI100종합지수<br>1163: 코스피고배당50<br>2002: 코스닥(대형주)     <br>2004: 코스닥(소형주)  <br>2203: 코스닥 150<br>3903: KP200레버리지지수<br>3907: 변동성지수<br>0100: KRX100<br>0600: KTOP 30<br>K001: KOVIXI00 |

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
    "InputCondMrktDivCode1": "F",
    "InputIscd1": "101VC000",
    "InputCondMrktDivCode2": "JO",
    "InputIscd2": "211VA038",
    "InputCondMrktDivCode3": "J",
    "InputIscd3": "000660",
    "InputCondMrktDivCode4": "J",
    "InputIscd4": "005930",
    "InputCondMrktDivCode5": "U",
    "InputIscd5": "1001"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Iscd": "101VC000",
      "KorIsnm": "K200 F 202412",
      "Sdpr": "349.25",
      "Prpr": "345.35",
      "Mxpr": "377.15",
      "Llam": "321.35",
      "Oprc": "347.20",
      "SdprVrssMrktRate": "-0.59",
      "PrprVrssOprcRate": "",
      "Hprc": "347.55",
      "SdprVrssHgprRate": "-0.49",
      "PrprVrssHgprRate": "",
      "Lprc": "344.40",
      "SdprVrssLwprRate": "-1.39",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "-3.90",
      "PrdyCtrt": "-1.12"
    },
    {
      "Iscd": "211VA038",
      "KorIsnm": "삼성전자   C 202410    54,000(  10)",
      "Sdpr": "7000",
      "Prpr": "7000",
      "Mxpr": "13000",
      "Llam": "920",
      "Oprc": "7000",
      "SdprVrssMrktRate": "0.00",
      "PrprVrssOprcRate": "",
      "Hprc": "7000",
      "SdprVrssHgprRate": "0.00",
      "PrprVrssHgprRate": "",
      "Lprc": "7000",
      "SdprVrssLwprRate": "0.00",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00"
    },
    {
      "Iscd": "000660",
      "KorIsnm": "SK하이닉스",
      "Sdpr": "184900",
      "Prpr": "179800",
      "Mxpr": "240000",
      "Llam": "129500",
      "Oprc": "182200",
      "SdprVrssMrktRate": "-1.46",
      "PrprVrssOprcRate": "1.33",
      "Hprc": "185000",
      "SdprVrssHgprRate": "0.05",
      "PrprVrssHgprRate": "2.89",
      "Lprc": "179500",
      "SdprVrssLwprRate": "-2.92",
      "PrprVrssLwprRate": "-0.17",
      "PrdyVrss": "-5100",
      "PrdyCtrt": "-2.76"
    },
    {
      "Iscd": "005930",
      "KorIsnm": "삼성전자",
      "Sdpr": "61000",
      "Prpr": "60100",
      "Mxpr": "79300",
      "Llam": "42700",
      "Oprc": "60000",
      "SdprVrssMrktRate": "-1.64",
      "PrprVrssOprcRate": "-0.17",
      "Hprc": "61000",
      "SdprVrssHgprRate": "0.00",
      "PrprVrssHgprRate": "1.50",
      "Lprc": "59900",
      "SdprVrssLwprRate": "-1.80",
      "PrprVrssLwprRate": "-0.33",
      "PrdyVrss": "-900",
      "PrdyCtrt": "-1.48"
    },
    {
      "Iscd": "1001",
      "KorIsnm": "코스피지수",
      "Sdpr": "2610.38",
      "Prpr": "2588.72",
      "Mxpr": "",
      "Llam": "",
      "Oprc": "2592.65",
      "SdprVrssMrktRate": "-0.68",
      "PrprVrssOprcRate": "",
      "Hprc": "2599.17",
      "SdprVrssHgprRate": "-0.43",
      "PrprVrssHgprRate": "",
      "Lprc": "2581.79",
      "SdprVrssLwprRate": "-1.10",
      "PrprVrssLwprRate": "",
      "PrdyVrss": "-21.66",
      "PrdyCtrt": "-0.83"
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
