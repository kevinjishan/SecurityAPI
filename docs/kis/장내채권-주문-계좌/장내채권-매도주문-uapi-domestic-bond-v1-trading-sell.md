---
broker: "한국투자증권"
source_url: "https://apiportal.koreainvestment.com/apiservice-summary"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "[장내채권] 주문/계좌"
api_id: "/uapi/domestic-bond/v1/trading/sell"
api_name: "장내채권 매도주문"
method: "POST"
domain: "https://openapi.koreainvestment.com:9443"
path: "/uapi/domestic-bond/v1/trading/sell"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 장내채권 매도주문 (/uapi/domestic-bond/v1/trading/sell)

<!-- request_field_count: 16 -->
<!-- response_field_count: 0 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | [장내채권] 주문/계좌 |
| API path | `/uapi/domestic-bond/v1/trading/sell` |
| 샘플 TR ID | TTTC0958U |
| 공식 샘플 파일 | examples_llm/domestic_bond/sell/sell.py |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | POST |
| 운영 도메인 | `https://openapi.koreainvestment.com:9443` |
| 모의투자 도메인 | `https://openapivts.koreainvestment.com:29443` |
| URL | `/uapi/domestic-bond/v1/trading/sell` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
| Header | `authorization` | Bearer access token | Y |
| Header | `appkey` | 앱키 | Y |
| Header | `appsecret` | 앱시크릿 | Y |
| Header | `tr_id` | TTTC0958U | Y |
| Header | `custtype` | 고객 타입 | N |
| Header | `tr_cont` | 연속거래여부 | N |

## 요청

| 위치 | 필드 | 필수 |
| --- | --- | --- |
| Query/Body | `CANO` | Y |
| Query/Body | `ACNT_PRDT_CD` | Y |
| Query/Body | `ORD_DVSN` | Y |
| Query/Body | `PDNO` | Y |
| Query/Body | `ORD_QTY2` | Y |
| Query/Body | `BOND_ORD_UNPR` | Y |
| Query/Body | `SPRX_YN` | Y |
| Query/Body | `BUY_DT` | Y |
| Query/Body | `BUY_SEQ` | Y |
| Query/Body | `SAMT_MKET_PTCI_YN` | Y |
| Query/Body | `SLL_AGCO_OPPS_SLL_YN` | Y |
| Query/Body | `BOND_RTL_MKET_YN` | Y |
| Query/Body | `MGCO_APTM_ODNO` | Y |
| Query/Body | `ORD_SVR_DVSN_CD` | Y |
| Query/Body | `CTAC_TLNO` | Y |

## 응답

한국투자증권 포털 응답 필드 상세는 공식 포털 화면과 샘플 repo를 함께 확인합니다. 이 생성 문서는 API path, TR ID, 필수 요청 파라미터 식별을 우선합니다.

## 예제

### Request

```json
{
  "CANO": "",
  "ACNT_PRDT_CD": "",
  "ORD_DVSN": "",
  "PDNO": "",
  "ORD_QTY2": "",
  "BOND_ORD_UNPR": "",
  "SPRX_YN": "",
  "BUY_DT": "",
  "BUY_SEQ": "",
  "SAMT_MKET_PTCI_YN": "",
  "SLL_AGCO_OPPS_SLL_YN": "",
  "BOND_RTL_MKET_YN": "",
  "MGCO_APTM_ODNO": "",
  "ORD_SVR_DVSN_CD": "",
  "CTAC_TLNO": ""
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
