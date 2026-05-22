---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=05ac28b8-624f-4115-8aed-cf55f24279dd&api_id=13143c06-cf97-4ea5-a9b9-3d30fe6b1fec"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식주문"
api_id: "13143c06-cf97-4ea5-a9b9-3d30fe6b1fec"
api_name: "주식종합주문- NXT거래소"
tr_id: "08ec6c92-5f16-47e1-b1a0-30726e602bf7"
tr_code: "CSPAT00610"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/trading/kr-stock/order-nxt"
content_type: "application/json;charset=utf-8"
rate_limit: "10"
auth_required: true
---

# 주식종합주문- NXT (CSPAT00610)

<!-- request_field_count: 14 -->
<!-- response_field_count: 10 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식주문 |
| API 페이지 | 주식종합주문- NXT거래소 |
| TR명 | 주식종합주문- NXT |
| TR코드 | `CSPAT00610` |
| 초당 전송 건수 | 10 |
| 설명 | NXT거래소 전용 국내주식 주문 API 입니다.<br> ※ 주문 전 MTS/HTS등 당사 매체를 통해 최선집행의무 동의를 하셔야 주문이 가능하십니다. <br>  ※ 수수료 및 제세금 안내는 아래 링크 참고 부탁드립니다. <br>   https://www.dbsec.co.kr/custcenter/jobservice/cu_FeeTrading_viw10.do <br>  ※ 주식매매 거래제도 안내는 아래 링크 참고 부탁드립니다.<br>    https://www.dbsec.co.kr/custcenter/jobservice/cu_TradeStock_viw.do <br> ※ NXT 거래소 접수시간 <br>    프리마켓 : 08:00 ~ 08:50,  [주문가능구분] : 지정가,최유리,최우선 <br>    메인마켓 : 09:00:30 ~ 15:20, [주문가능구분] : 모든주문구분 가능 <br>    애프터마켓 : 15:30 ~ 20:00, [주문가능구분] : 지정가,최유리,최우선 (15:30~40: 지정가만 가능) <br>    종가매매 : 15:00 ~ 16:00, [주문가능구분] : 시간외종가 |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/trading/kr-stock/order-nxt` |
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
| Request Body | `-IsuNo` | 종목번호 | String | Y | 12 | 주식/ETF: 종목코드6자리 or "A"+"종목코드" <br>EX. (005930 or A005930)<br>ETN: Q + 종목코드 (EX. Q580036)<br>ELW: J + 종목코드 (EX. J58J463) |
| Request Body | `-OrdQty` | 주문수량 | Number | Y | 16 | 주식 주문수량 |
| Request Body | `-OrdPrc` | 주문가 | Number | Y | 13 | * 지정가주문 이외의 주문 (시장가, 시간외 등)은<br>  주문가를 0 으로 입력하는것을 권고 |
| Request Body | `-BnsTpCode` | 매매구분 | String | Y | 1 | 1:매도<br>2:매수 |
| Request Body | `-OrdprcPtnCode` | 호가유형코드 | String | Y | 2 | 00:지정가<br>03:시장가<br>05:조건부지정가<br>06:최유리지정가<br>07:최우선지정가<br>14: 중간가호가<br>61:장개시전시간외<br>81:시간외종가<br>82:시간외단일가 |
| Request Body | `-MgntrnCode` | 신용거래코드 | String | Y | 3 | 000:보통 (일반주문시 사용 신용주문X)<br>001:유통융자신규<br>003:자기융자신규<br>005:유통대주신규<br>007:자기대주신규<br>101:유통융자상환<br>103:자기융자상환<br>105:유통대주상환<br>107:자기대주상환<br>180:예탁담보대출상환(신용) |
| Request Body | `-LoanDt` | 대출일 | String | Y | 8 | 일반 주문시: '00000000'<br>신용매수시: 오늘날짜 (YYYYMMDD) 입력<br>신용매도시: 매도할 종목의 대출일자(YYYYMMDD)입력 |
| Request Body | `-OrdCndiTpCode` | 주문조건구분 | String | Y | 1 | 0:없음<br>1:IOC<br>2:FOK |

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
| Response Body | `-OrdNo` | 주문번호 | Number | Y | 10 | 주문시 DB증권 거래시스템에서 채번된 주문번호 |
| Response Body | `-OrdTime` | 주문시각 | String | Y | 9 | 주문시각(HHMMSSSSS - 시분초) |
| Response Body | `-ShtnIsuNo` | 단축종목번호 | String | Y | 9 | - |
| Response Body | `-SpotOrdQty` | 실물주문수량 | Number | Y | 16 | - |
| Response Body | `-MnyOrdAmt` | 현금주문금액 | Number | Y | 16 | - |
| Response Body | `-IsuNm` | 종목명 | String | Y | 40 | 주문 종목의 한글명 |

## 예제

### Request

```json
{
  "In": {
    "IsuNo": "003620",
    "OrdQty": 20,
    "OrdPrc": 3010,
    "BnsTpCode": "2",
    "OrdprcPtnCode": "00",
    "MgntrnCode": "000",
    "LoanDt": "00000000",
    "OrdCndiTpCode": "0"
  }
}
```

### Response

```json
{
  "Out": {
    "OrdNo": 340807,
    "OrdTime": "142649368",
    "ShtnIsuNo": "A003620",
    "SpotOrdQty": 0,
    "MnyOrdAmt": 0,
    "IsuNm": "KG모빌리티"
  },
  "rsp_cd": "00000",
  "rsp_msg": "매수 주문이 완료되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
