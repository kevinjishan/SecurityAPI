---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=d7f6a691-8fe6-4733-901f-c2535417dc46"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "d7f6a691-8fe6-4733-901f-c2535417dc46"
api_name: "현재가조회"
tr_id: "3be5fa4b-e576-4e5d-903b-7ff70d39d42b"
tr_code: "PRICE"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/price"
content_type: "application/json;charset=utf-8"
rate_limit: "5"
auth_required: true
---

# 현재가조회 (PRICE)

<!-- request_field_count: 8 -->
<!-- response_field_count: 27 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 현재가조회 |
| TR명 | 현재가조회 |
| TR코드 | `PRICE` |
| 초당 전송 건수 | 5 |
| 설명 | 국내주식 현재가 조회 API입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/price` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | 주식:J<br>주식(NXT): NJ<br>주식(통합): UJ<br>ETN: EN<br>ELW: W<br>업종&지수: U<br>※ ETF종목의 경우 J 코드를 사용해 조회 부탁드립니다. |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 주식(J, NJ, UJ) 선택시 주식종목코드 입력<br>- J(KRX 주식): (ex. 005930)<br>- NJ(NXT 주식): (ex. N-005930)<br>- UJ(통합): (ex. U-005930)<br>※ NXT/통합시세로 종목 조회 시 반드시 종목 앞에 구분자 (N-, U-)를 붙여서 호출 부탁드리겠습니다.<br>업종(U) 선택시 지수코드:<br>1001: KOSPI<br>2001: KOSDAQ<br>3001: KOSPI200<br>1002: 코스피(대형주)<br>1004: 코스피(소형주)<br>1053: KOSPI50종합지수<br>1054: KOSPI100종합지수<br>1163: 코스피고배당50<br>2002: 코스닥(대형주)<br>2004: 코스닥(소형주)<br>2203: 코스닥 150<br>3903: KP200레버리지지수<br>3907: 변동성지수<br>0100: KRX100<br>0600: KTOP 30<br>K001: KOVIXI00 |

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
| Response Body | `Out` | Out | Object | Y | - | - |
| Response Body | `-AcmlTrPbmn` | 거래대금 | String | Y | 25 | - |
| Response Body | `-AcmlVol` | 거래량 | String | Y | 25 | - |
| Response Body | `-Askp1` | 매도호가 | String | Y | 16 | - |
| Response Body | `-Bidp1` | 매수호가 | String | Y | 16 | - |
| Response Body | `-HtsOtstStplQty` | 미결제약정수량 | String | Y | 16 | - |
| Response Body | `-OtstStplQtyIcdc` | 미결제증감 | String | Y | 16 | - |
| Response Body | `-Pbr` | PBR | String | Y | 16 | - |
| Response Body | `-Per` | PER | String | Y | 16 | - |
| Response Body | `-PrdyVol` | 전일거래량 | String | Y | 16 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |
| Response Body | `-Sdpr` | 기준가 | String | Y | 16 | - |
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
    "InputIscd1": "005930",
    "InputCondMrktDivCode": "J"
  }
}
```

### Response

```json
{
  "Out": {
    "Sdpr": "53900",
    "Prpr": "55550",
    "Mxpr": "70000",
    "Llam": "37800",
    "Oprc": "54300",
    "SdprVrssMrktRate": "0.74",
    "PrprVrssOprcRate": "-2.25",
    "Hprc": "55900",
    "SdprVrssHgprRate": "3.71",
    "PrprVrssHgprRate": "0.63",
    "Lprc": "54200",
    "SdprVrssLwprRate": "0.56",
    "PrprVrssLwprRate": "-2.43",
    "PrdyVrss": "1650",
    "PrdyCtrt": "3.06",
    "Per": "10.89",
    "Pbr": "0.93",
    "AcmlTrPbmn": "400303637800",
    "AcmlVol": "7240324",
    "PrdyVol": "13439520",
    "Bidp1": "55500",
    "Askp1": "55600",
    "HtsOtstStplQty": "",
    "OtstStplQtyIcdc": ""
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
