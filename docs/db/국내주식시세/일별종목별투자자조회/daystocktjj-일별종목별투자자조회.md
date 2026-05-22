---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=2a750d3d-5ea2-4bb6-b3d6-411956d42e75"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "2a750d3d-5ea2-4bb6-b3d6-411956d42e75"
api_name: "일별종목별투자자조회"
tr_id: "a937cb16-ba97-4aaf-ac7d-8228a04f24e0"
tr_code: "DAYSTOCKTJJ"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/daily-investor"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 일별종목별투자자조회 (DAYSTOCKTJJ)

<!-- request_field_count: 10 -->
<!-- response_field_count: 23 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 일별종목별투자자조회 |
| TR명 | 일별종목별투자자조회 |
| TR코드 | `DAYSTOCKTJJ` |
| 초당 전송 건수 | 2 |
| 설명 | 국내 일별종목별투자자조회 API입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/daily-investor` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB금융투자 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |
| Request Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부(Y:연속거래 사용 N:연속거래 사용안함) |
| Request Header | `cont_key` | 연속키 값 | String | Y | 70 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | N | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `In` | In | Object | Y | - | - |
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | 주식&ETF:J<br>주식(NXT): NJ<br>주식(통합): UJ<br>ETN: EN<br>ELW: W |
| Request Body | `-InputDate1` | 입력날짜1 | String | Y | 8 | YYYYMMDD |
| Request Body | `-InputDate2` | 입력날짜2 | String | Y | 8 | YYYYMMDD |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 종목코드 입력 <br> - J(KRX 주식): (ex. 005930)<br> - NJ(NXT 주식): (ex. N-005930)<br> - UJ(통합): (ex. U-005930)<br>※ NXT/통합시세로 종목 조회 시 반드시 종목 앞에 구분자 (N-, U-)를 붙여서 호출 부탁드리겠습니다. |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | Array | Y | 100 | DB금융투자 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Object | Y | - | - |
| Response Body | `-Date` | 일자 | String | Y | 8 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-PrdyVrssSign` | 전일대비부호 | String | Y | 1 | - |
| Response Body | `-PrdyVrss` | 전일대비 | String | Y | 16 | - |
| Response Body | `-PrdyCtrt` | 전일대비율 | String | Y | 16 | - |
| Response Body | `-AcmlVol` | 거래량 | String | Y | 19 | - |
| Response Body | `-AcmlTrPbmn` | 거래대금 | String | Y | 19 | - |
| Response Body | `-OrgnShnuVol` | 기관계매수수량 | String | Y | 19 | - |
| Response Body | `-OrgnSelnVol` | 기관계매도수량 | String | Y | 19 | - |
| Response Body | `-OrgnShnuTrPbmn` | 기관계매수금액 | String | Y | 19 | - |
| Response Body | `-OrgnSelnTrPbmn` | 기관계매도금액 | String | Y | 19 | - |
| Response Body | `-FrgnRegShnuVol` | 외국인매수수량 | String | Y | 19 | - |
| Response Body | `-FrgnRegSelnVol` | 외국인매도수량 | String | Y | 19 | - |
| Response Body | `-FrgnRegShnuTrPbmn` | 외국인매수금액 | String | Y | 19 | - |
| Response Body | `-FrgnRegSelnTrPbmn` | 외국인매도금액 | String | Y | 19 | - |
| Response Body | `-PrsnShnuVol` | 개인매수수량 | String | Y | 19 | - |
| Response Body | `-PrsnSelnVol` | 개인매도수량 | String | Y | 19 | - |
| Response Body | `-PrsnShnuTrPbmn` | 개인매수금액 | String | Y | 19 | - |
| Response Body | `-PrsnSelnTrPbmn` | 개인매도금액 | String | Y | 19 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "J",
    "InputIscd1": "005930",
    "InputDate1": "20250425",
    "InputDate2": "20250425"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Date": "20250425",
      "Prpr": "55700",
      "PrdyVrssSign": "3",
      "PrdyVrss": "0",
      "PrdyCtrt": "0.00",
      "AcmlVol": "12183303",
      "AcmlTrPbmn": "",
      "OrgnShnuVol": "5775864",
      "OrgnSelnVol": "5005319",
      "OrgnShnuTrPbmn": "323264276",
      "OrgnSelnTrPbmn": "280036970",
      "FrgnRegShnuVol": "3478500",
      "FrgnRegSelnVol": "5041378",
      "FrgnRegShnuTrPbmn": "194666286",
      "FrgnRegSelnTrPbmn": "281911560",
      "PrsnShnuVol": "2205489",
      "PrsnSelnVol": "2027625",
      "PrsnShnuTrPbmn": "123333235",
      "PrsnSelnTrPbmn": "113703376"
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
