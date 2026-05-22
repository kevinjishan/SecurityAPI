---
broker: "한국투자증권"
source_url: "https://apiportal.koreainvestment.com/apiservice-summary"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "[해외주식] 기본시세"
api_id: "/uapi/overseas-price/v1/quotations/inquire-search"
api_name: "해외주식조건검색"
method: "GET"
domain: "https://openapi.koreainvestment.com:9443"
path: "/uapi/overseas-price/v1/quotations/inquire-search"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 해외주식조건검색 (/uapi/overseas-price/v1/quotations/inquire-search)

<!-- request_field_count: 28 -->
<!-- response_field_count: 0 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | [해외주식] 기본시세 |
| API path | `/uapi/overseas-price/v1/quotations/inquire-search` |
| 샘플 TR ID | HHDFS76410000 |
| 공식 샘플 파일 | examples_llm/overseas_stock/inquire_search/inquire_search.py |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | GET |
| 운영 도메인 | `https://openapi.koreainvestment.com:9443` |
| 모의투자 도메인 | `https://openapivts.koreainvestment.com:29443` |
| URL | `/uapi/overseas-price/v1/quotations/inquire-search` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
| Header | `authorization` | Bearer access token | Y |
| Header | `appkey` | 앱키 | Y |
| Header | `appsecret` | 앱시크릿 | Y |
| Header | `tr_id` | HHDFS76410000 | Y |
| Header | `custtype` | 고객 타입 | N |
| Header | `tr_cont` | 연속거래여부 | N |

## 요청

| 위치 | 필드 | 필수 |
| --- | --- | --- |
| Query/Body | `AUTH` | Y |
| Query/Body | `EXCD` | Y |
| Query/Body | `CO_YN_PRICECUR` | Y |
| Query/Body | `CO_ST_PRICECUR` | Y |
| Query/Body | `CO_EN_PRICECUR` | Y |
| Query/Body | `CO_YN_RATE` | Y |
| Query/Body | `CO_ST_RATE` | Y |
| Query/Body | `CO_EN_RATE` | Y |
| Query/Body | `CO_YN_VALX` | Y |
| Query/Body | `CO_ST_VALX` | Y |
| Query/Body | `CO_EN_VALX` | Y |
| Query/Body | `CO_YN_SHAR` | Y |
| Query/Body | `CO_ST_SHAR` | Y |
| Query/Body | `CO_EN_SHAR` | Y |
| Query/Body | `CO_YN_VOLUME` | Y |
| Query/Body | `CO_ST_VOLUME` | Y |
| Query/Body | `CO_EN_VOLUME` | Y |
| Query/Body | `CO_YN_AMT` | Y |
| Query/Body | `CO_ST_AMT` | Y |
| Query/Body | `CO_EN_AMT` | Y |
| Query/Body | `CO_YN_EPS` | Y |
| Query/Body | `CO_ST_EPS` | Y |
| Query/Body | `CO_EN_EPS` | Y |
| Query/Body | `CO_YN_PER` | Y |
| Query/Body | `CO_ST_PER` | Y |
| Query/Body | `CO_EN_PER` | Y |
| Query/Body | `KEYB` | Y |

## 응답

한국투자증권 포털 응답 필드 상세는 공식 포털 화면과 샘플 repo를 함께 확인합니다. 이 생성 문서는 API path, TR ID, 필수 요청 파라미터 식별을 우선합니다.

## 예제

### Request

```json
{
  "AUTH": "",
  "EXCD": "",
  "CO_YN_PRICECUR": "",
  "CO_ST_PRICECUR": "",
  "CO_EN_PRICECUR": "",
  "CO_YN_RATE": "",
  "CO_ST_RATE": "",
  "CO_EN_RATE": "",
  "CO_YN_VALX": "",
  "CO_ST_VALX": "",
  "CO_EN_VALX": "",
  "CO_YN_SHAR": "",
  "CO_ST_SHAR": "",
  "CO_EN_SHAR": "",
  "CO_YN_VOLUME": "",
  "CO_ST_VOLUME": "",
  "CO_EN_VOLUME": "",
  "CO_YN_AMT": "",
  "CO_ST_AMT": "",
  "CO_EN_AMT": "",
  "CO_YN_EPS": "",
  "CO_ST_EPS": "",
  "CO_EN_EPS": "",
  "CO_YN_PER": "",
  "CO_ST_PER": "",
  "CO_EN_PER": "",
  "KEYB": ""
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
