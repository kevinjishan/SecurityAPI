---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=05ac28b8-624f-4115-8aed-cf55f24279dd&api_id=159a17c5-6cba-4887-a963-8464cdb95d65"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식주문"
api_id: "159a17c5-6cba-4887-a963-8464cdb95d65"
api_name: "주식취소주문- NXT거래소"
tr_id: "53b2ba3f-608e-4825-9876-eb40e2417274"
tr_code: "CSPAT00810"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/trading/kr-stock/order-cancel-nxt"
content_type: "application/json;charset=utf-8"
rate_limit: "3"
auth_required: true
---

# 주식취소주문-NXT (CSPAT00810)

<!-- request_field_count: 9 -->
<!-- response_field_count: 9 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식주문 |
| API 페이지 | 주식취소주문- NXT거래소 |
| TR명 | 주식취소주문-NXT |
| TR코드 | `CSPAT00810` |
| 초당 전송 건수 | 3 |
| 설명 | NXT 주문에 대해 취소하는 API 입니다.<br><br><br>※ 이미 체결완료된 주문은 취소가 불가능합니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/trading/kr-stock/order-cancel-nxt` |
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
| Request Body | `-OrgOrdNo` | 원주문번호 | Number | Y | 10 | 주식주문 완료시 Out되는 OrdNo 값 입력<br>(DB증권 거래 시스템에서 채번된 주문번호) |
| Request Body | `-IsuNo` | 종목번호 | String | Y | 12 | 원주문시 사용한 종목번호 |
| Request Body | `-OrdQty` | 주문수량 | Number | Y | 16 | 주식 주문수량 |

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
| Response Body | `-OrdNo` | 주문번호 | Number | Y | 10 | 취소주문으로 채번된 주문번호 |
| Response Body | `-PrntOrdNo` | 모주문번호 | Number | Y | 10 | 원 주문시 사용된 주문번호 |
| Response Body | `-OrdTime` | 주문시각 | String | Y | 9 | 주문시각(HHMMSSSSS - 시분초) |
| Response Body | `-ShtnIsuNo` | 단축종목번호 | String | Y | 9 | - |
| Response Body | `-IsuNm` | 종목명 | String | Y | 40 | 주문 종목의 한글명 |

## 예제

### Request

```json
{
  "In": {
    "OrgOrdNo": 340809,
    "IsuNo": "A003620",
    "OrdQty": 19
  }
}
```

### Response

```json
{
  "Out": {
    "OrdNo": 340811,
    "PrntOrdNo": 340807,
    "OrdTime": "142916061",
    "OrdMktCode": "10",
    "OrdPtnCode": "02",
    "ShtnIsuNo": "A003620",
    "PrgmOrdprcPtnCode": "00",
    "StslOrdprcTpCode": "0",
    "StslAbleYn": "0",
    "MgntrnCode": "000",
    "LoanDt": "00000000",
    "CvrgOrdTp": "0",
    "LpYn": "0",
    "MgempNo": "000579",
    "BnsTpCode": "2",
    "SpareOrdNo": 0,
    "CvrgSeqno": 0,
    "RsvOrdNo": 0,
    "AcntNm": "테스트계좌1",
    "IsuNm": "KG모빌리티"
  },
  "rsp_cd": "00000",
  "rsp_msg": "취소주문이 완료되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
