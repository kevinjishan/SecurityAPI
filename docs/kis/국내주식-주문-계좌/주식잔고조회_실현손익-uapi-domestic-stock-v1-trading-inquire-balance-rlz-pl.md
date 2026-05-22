---
broker: "한국투자증권"
source_url: "https://apiportal.koreainvestment.com/apiservice-summary"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "[국내주식] 주문/계좌"
api_id: "/uapi/domestic-stock/v1/trading/inquire-balance-rlz-pl"
api_name: "주식잔고조회_실현손익"
method: "GET"
domain: "https://openapi.koreainvestment.com:9443"
path: "/uapi/domestic-stock/v1/trading/inquire-balance-rlz-pl"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 주식잔고조회_실현손익 (/uapi/domestic-stock/v1/trading/inquire-balance-rlz-pl)

<!-- request_field_count: 13 -->
<!-- response_field_count: 0 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | [국내주식] 주문/계좌 |
| API path | `/uapi/domestic-stock/v1/trading/inquire-balance-rlz-pl` |
| 샘플 TR ID | TTTC8494R |
| 공식 샘플 파일 | examples_llm/domestic_stock/inquire_balance_rlz_pl/inquire_balance_rlz_pl.py |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | GET |
| 운영 도메인 | `https://openapi.koreainvestment.com:9443` |
| 모의투자 도메인 | `https://openapivts.koreainvestment.com:29443` |
| URL | `/uapi/domestic-stock/v1/trading/inquire-balance-rlz-pl` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
| Header | `authorization` | Bearer access token | Y |
| Header | `appkey` | 앱키 | Y |
| Header | `appsecret` | 앱시크릿 | Y |
| Header | `tr_id` | TTTC8494R | Y |
| Header | `custtype` | 고객 타입 | N |
| Header | `tr_cont` | 연속거래여부 | N |

## 요청

| 위치 | 필드 | 필수 |
| --- | --- | --- |
| Query/Body | `CANO` | Y |
| Query/Body | `ACNT_PRDT_CD` | Y |
| Query/Body | `AFHR_FLPR_YN` | Y |
| Query/Body | `OFL_YN` | Y |
| Query/Body | `INQR_DVSN` | Y |
| Query/Body | `UNPR_DVSN` | Y |
| Query/Body | `FUND_STTL_ICLD_YN` | Y |
| Query/Body | `FNCG_AMT_AUTO_RDPT_YN` | Y |
| Query/Body | `PRCS_DVSN` | Y |
| Query/Body | `COST_ICLD_YN` | Y |
| Query/Body | `CTX_AREA_FK100` | Y |
| Query/Body | `CTX_AREA_NK100` | Y |

## 응답

한국투자증권 포털 응답 필드 상세는 공식 포털 화면과 샘플 repo를 함께 확인합니다. 이 생성 문서는 API path, TR ID, 필수 요청 파라미터 식별을 우선합니다.

## 예제

### Request

```json
{
  "CANO": "",
  "ACNT_PRDT_CD": "",
  "AFHR_FLPR_YN": "",
  "OFL_YN": "",
  "INQR_DVSN": "",
  "UNPR_DVSN": "",
  "FUND_STTL_ICLD_YN": "",
  "FNCG_AMT_AUTO_RDPT_YN": "",
  "PRCS_DVSN": "",
  "COST_ICLD_YN": "",
  "CTX_AREA_FK100": "",
  "CTX_AREA_NK100": ""
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
