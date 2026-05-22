---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=09a668df-d7e8-4b5c-977f-91d1429b931a"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "09a668df-d7e8-4b5c-977f-91d1429b931a"
api_name: "[선물/옵션] 계좌"
tr_id: "futroptn-0000-0000-0000-00CCENQ10100"
tr_code: "CCENQ10100"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/accno"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# KRX야간파생 주문가능수량 조회 (CCENQ10100)

<!-- request_field_count: 15 -->
<!-- response_field_count: 27 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 계좌 |
| TR명 | KRX야간파생 주문가능수량 조회 |
| TR코드 | `CCENQ10100` |
| 초당 전송 건수 | 1 |
| 설명 | 주간/야간 선물옵션 계좌별 거래내역 및 잔고 등 계좌에 관련된 서비스를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/futureoption/accno` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | - |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | - |
| Request Header | `tr_cd` | 거래 CD | String | Y | 10 | - |
| Request Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | - |
| Request Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | - |
| Request Header | `mac_address` | MAC 주소 | String | Y | 12 | - |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Request Body | `CCENQ10100InBlock1` | CCENQ10100InBlock1 | Object | Y | - | - |
| Request Body | `-QryTp` | 조회구분 | String | Y | 1 | 1:일반<br>2:금액<br>3:비율 |
| Request Body | `-OrdAmt` | 주문금액 | Number | Y | 16 | 조회구분이 2일경우만 사용, 그외 0 |
| Request Body | `-RatVal` | 비율값 | Number | Y | 19.8 | 조회구분이 3일경우만 사용, 그외 0 |
| Request Body | `-FnoIsuNo` | 선물옵션종목번호 | String | Y | 12 | - |
| Request Body | `-BnsTpCode` | 매매구분 | String | Y | 1 | 1:매도<br>2:매수 |
| Request Body | `-FnoOrdPrc` | 선물옵션주문가격 | Number | Y | 27.8 | - |
| Request Body | `-FnoOrdprcPtnCode` | 선물옵션호가유형코드 | String | Y | 2 | 00:지정가<br>03:시장가<br>05:조건부지정가<br>06:최유리지정가 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | - |
| Response Header | `tr_cd` | 거래 CD | String | Y | 10 | - |
| Response Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | - |
| Response Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | - |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `CCENQ10100OutBlock1` | CCENQ10100OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-Pwd` | 비밀번호 | String | Y | 8 | - |
| Response Body | `-QryTp` | 조회구분 | String | Y | 1 | - |
| Response Body | `-OrdAmt` | 주문금액 | Number | Y | 16 | - |
| Response Body | `-RatVal` | 비율값 | Number | Y | 19.8 | - |
| Response Body | `-FnoIsuNo` | 선물옵션종목번호 | String | Y | 12 | - |
| Response Body | `-BnsTpCode` | 매매구분 | String | Y | 1 | - |
| Response Body | `-FnoOrdPrc` | 선물옵션주문가격 | Number | Y | 27.8 | - |
| Response Body | `-FnoOrdprcPtnCode` | 선물옵션호가유형코드 | String | Y | 2 | - |
| Response Body | `CCENQ10100OutBlock2` | CCENQ10100OutBlock2 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-AcntNm` | 계좌명 | String | Y | 40 | - |
| Response Body | `-QryDt` | 조회일 | String | Y | 8 | - |
| Response Body | `-FnoNowPrc` | 선물옵션현재가 | Number | Y | 27.8 | - |
| Response Body | `-OrdAbleQty` | 주문가능수량 | Number | Y | 16 | - |
| Response Body | `-NewOrdAbleQty` | 신규주문가능수량 | Number | Y | 16 | - |
| Response Body | `-LqdtOrdAbleQty` | 청산주문가능수량 | Number | Y | 16 | - |
| Response Body | `-UsePreargMgn` | 사용예정증거금액 | Number | Y | 16 | - |
| Response Body | `-UsePreargMnyMgn` | 사용예정현금증거금액 | Number | Y | 16 | - |
| Response Body | `-OrdAbleAmt` | 주문가능금액 | Number | Y | 16 | - |
| Response Body | `-MnyOrdAbleAmt` | 현금주문가능금액 | Number | Y | 16 | - |

## 예제

### Request

```json
{
  "CCENQ10100InBlock1": {
    "RecCnt": 1,
    "QryTp": "1",
    "OrdAmt": 0,
    "RatVal": 0,
    "FnoIsuNo": "101W6000",
    "BnsTpCode": "1",
    "FnoOrdPrc": 0,
    "FnoOrdprcPtnCode": "00"
  }
}
```

### Response

```json
{
  "CCENQ10100OutBlock1": {
    "RecCnt": 1,
    "AcntNo": "***********",
    "Pwd": "********",
    "QryTp": "1",
    "OrdAmt": 0,
    "RatVal": "0.00000000",
    "FnoIsuNo": "101W6000",
    "BnsTpCode": "1",
    "FnoOrdPrc": "438.55000000",
    "FnoOrdprcPtnCode": "00"
  },
  "CCENQ10100OutBlock2": {
    "RecCnt": 1,
    "AcntNm": "***",
    "QryDt": "20250607",
    "FnoNowPrc": "438.55000000",
    "OrdAbleQty": 2,
    "NewOrdAbleQty": 2,
    "LqdtOrdAbleQty": 0,
    "UsePreargMgn": 20050754,
    "UsePreargMnyMgn": 10025376,
    "OrdAbleAmt": 20327175,
    "MnyOrdAbleAmt": 20327175
  },
  "rsp_cd": "00136",
  "rsp_msg": "조회가 완료되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
