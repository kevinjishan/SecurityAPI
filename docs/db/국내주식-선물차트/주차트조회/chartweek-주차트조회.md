---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=0bc09824-e8c2-491a-8c9d-b99e64b4b907&api_id=2a108f78-c73f-409f-82fa-d81befc899f8"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식/선물차트"
api_id: "2a108f78-c73f-409f-82fa-d81befc899f8"
api_name: "주차트조회"
tr_id: "b8e9e67d-421c-48b9-abe4-6a99b6072117"
tr_code: "CHARTWEEK"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-chart/week"
content_type: "application/json;charset=utf-8"
rate_limit: "4"
auth_required: true
---

# 주차트조회 (CHARTWEEK)

<!-- request_field_count: 12 -->
<!-- response_field_count: 11 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식/선물차트 |
| API 페이지 | 주차트조회 |
| TR명 | 주차트조회 |
| TR코드 | `CHARTWEEK` |
| 초당 전송 건수 | 4 |
| 설명 | 국내주식/선물옵션 주차트 조회 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-chart/week` |
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
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | 주식:J<br>주식(NXT): NJ<br>주식(통합): UJ<br>EN : ETN<br>W: ELW<br>F : 지수선물<br>JF : 주식선물<br>KF : 미니선물<br>CF : 상품선물<br>XF : 섹터선물<br>CM : 야간선물<br>O : 지수옵션<br>JO : 주식옵션<br>KO : 미니옵션<br>WO : K200위클리옵션<br>EU : 야간옵션<br>SO: 코스닥 150옵션<br>업종&지수: U<br>※ ETF종목의 경우 J 코드를 사용해 조회 부탁드립니다. |
| Request Body | `-InputOrgAdjPrc` | 수정주가사용여부 | String | Y | 1 | 0:수정주가 미사용<br>1: 수정주가 사용 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 주식(J, NJ, UJ) 선택시 주식종목코드 입력 <br> - J(KRX 주식): (ex. 005930)<br> - NJ(NXT 주식): (ex. N-005930)<br> - UJ(통합): (ex. U-005930)<br>※ NXT/통합시세로 종목 조회 시 반드시 종목 앞에 구분자 (N-, U-)를 붙여서 호출 부탁드리겠습니다.<br>업종(U) 선택시 지수코드:<br>1001: KOSPI<br>2001: KOSDAQ<br>3001: KOSPI200<br>1002: 코스피(대형주)<br>1004: 코스피(소형주)<br>1053: KOSPI50종합지수<br>1054: KOSPI100종합지수<br>1163: 코스피고배당50<br>2002: 코스닥(대형주)<br>2004: 코스닥(소형주)<br>2203: 코스닥 150<br>3903: KP200레버리지지수<br>3907: 변동성지수<br>0100: KRX100<br>0600: KTOP 30<br>K001: KOVIXI00 |
| Request Body | `-InputDate1` | 입력날짜1 | String | Y | 8 | YYYYMMDD (조회 시작일) |
| Request Body | `-InputDate2` | 입력날짜2 | String | Y | 8 | YYYYMMDD (조회 종료일) |
| Request Body | `-InputPeriodDivCode` | 입력주 | String | Y | 32 | "W" |

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
| Response Body | `Out` | Out | Array | Y | - | - |
| Response Body | `-Hour` | 시간 | String | Y | 6 | - |
| Response Body | `-Date` | 일자 | String | Y | 8 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | UJ 통합시세 조회시 종가(현재가)는 KRX 거래소 종가가 아닌,<br> NXT 거래소 종가를 사용합니다. |
| Response Body | `-Oprc` | 시가 | String | Y | 16 | - |
| Response Body | `-Hprc` | 고가 | String | Y | 16 | - |
| Response Body | `-Lprc` | 저가 | String | Y | 16 | - |
| Response Body | `-CntgVol` | 체결거래량 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "J",
    "InputIscd1": "005930",
    "InputDate1": "20240101",
    "InputDate2": "20240201"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Hour": "",
      "Date": "20240129",
      "Prpr": "75200",
      "Oprc": "73800",
      "Hprc": "75300",
      "Lprc": "72500",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20240122",
      "Prpr": "73400",
      "Oprc": "75900",
      "Hprc": "76000",
      "Lprc": "73300",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20240115",
      "Prpr": "74700",
      "Oprc": "73200",
      "Hprc": "74700",
      "Lprc": "70700",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20240108",
      "Prpr": "73100",
      "Oprc": "77000",
      "Hprc": "77700",
      "Lprc": "72700",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20240102",
      "Prpr": "76600",
      "Oprc": "78200",
      "Hprc": "79800",
      "Lprc": "76100",
      "CntgVol": ""
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
