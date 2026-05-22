---
broker: "한국투자증권"
source_url: "https://apiportal.koreainvestment.com/apiservice-summary"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "[국내주식] 주문/계좌"
api_id: "/uapi/domestic-stock/v1/trading/order-resv-rvsecncl"
api_name: "주식예약주문정정취소"
method: "POST"
domain: "https://openapi.koreainvestment.com:9443"
path: "/uapi/domestic-stock/v1/trading/order-resv-rvsecncl"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 주식예약주문정정취소 (/uapi/domestic-stock/v1/trading/order-resv-rvsecncl)

<!-- request_field_count: 15 -->
<!-- response_field_count: 0 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | [국내주식] 주문/계좌 |
| API path | `/uapi/domestic-stock/v1/trading/order-resv-rvsecncl` |
| 샘플 TR ID | CTSC0009U, CTSC0013U |
| 공식 샘플 파일 | examples_llm/domestic_stock/order_resv_rvsecncl/order_resv_rvsecncl.py |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | POST |
| 운영 도메인 | `https://openapi.koreainvestment.com:9443` |
| 모의투자 도메인 | `https://openapivts.koreainvestment.com:29443` |
| URL | `/uapi/domestic-stock/v1/trading/order-resv-rvsecncl` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
| Header | `authorization` | Bearer access token | Y |
| Header | `appkey` | 앱키 | Y |
| Header | `appsecret` | 앱시크릿 | Y |
| Header | `tr_id` | CTSC0009U, CTSC0013U | Y |
| Header | `custtype` | 고객 타입 | N |
| Header | `tr_cont` | 연속거래여부 | N |

## 요청

| 위치 | 필드 | 필수 |
| --- | --- | --- |
| Query/Body | `CANO` | Y |
| Query/Body | `ACNT_PRDT_CD` | Y |
| Query/Body | `RSVN_ORD_SEQ` | Y |
| Query/Body | `RSVN_ORD_ORGNO` | Y |
| Query/Body | `RSVN_ORD_ORD_DT` | Y |
| Query/Body | `PDNO` | Y |
| Query/Body | `ORD_QTY` | Y |
| Query/Body | `ORD_UNPR` | Y |
| Query/Body | `SLL_BUY_DVSN_CD` | Y |
| Query/Body | `ORD_DVSN_CD` | Y |
| Query/Body | `ORD_OBJT_CBLC_DVSN_CD` | Y |
| Query/Body | `LOAN_DT` | Y |
| Query/Body | `RSVN_ORD_END_DT` | Y |
| Query/Body | `CTAL_TLNO` | Y |

## 응답

한국투자증권 포털 응답 필드 상세는 공식 포털 화면과 샘플 repo를 함께 확인합니다. 이 생성 문서는 API path, TR ID, 필수 요청 파라미터 식별을 우선합니다.

## 예제

### Request

```json
{
  "CANO": "",
  "ACNT_PRDT_CD": "",
  "RSVN_ORD_SEQ": "",
  "RSVN_ORD_ORGNO": "",
  "RSVN_ORD_ORD_DT": "",
  "PDNO": "",
  "ORD_QTY": "",
  "ORD_UNPR": "",
  "SLL_BUY_DVSN_CD": "",
  "ORD_DVSN_CD": "",
  "ORD_OBJT_CBLC_DVSN_CD": "",
  "LOAN_DT": "",
  "RSVN_ORD_END_DT": "",
  "CTAL_TLNO": ""
}
```

### Response

```text
문서 미기재
```

## 연속조회/실시간/주의사항

- REST 요청은 `authorization`, `appkey`, `appsecret`, `tr_id`, 필요 시 `custtype` 헤더를 사용합니다.
- 실시간은 `/oauth2/Approval`로 받은 approval key를 WebSocket 헤더에 사용합니다.
- 주문성 API의 hashkey 적용 여부는 공식 포털과 샘플의 최신 정책을 우선합니다.
