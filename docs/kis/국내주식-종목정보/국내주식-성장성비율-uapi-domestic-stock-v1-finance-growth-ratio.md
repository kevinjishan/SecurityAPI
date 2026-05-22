---
broker: "한국투자증권"
source_url: "https://apiportal.koreainvestment.com/apiservice-summary"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "[국내주식] 종목정보"
api_id: "/uapi/domestic-stock/v1/finance/growth-ratio"
api_name: "국내주식 성장성비율"
method: "GET"
domain: "https://openapi.koreainvestment.com:9443"
path: "/uapi/domestic-stock/v1/finance/growth-ratio"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 국내주식 성장성비율 (/uapi/domestic-stock/v1/finance/growth-ratio)

<!-- request_field_count: 1 -->
<!-- response_field_count: 0 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | [국내주식] 종목정보 |
| API path | `/uapi/domestic-stock/v1/finance/growth-ratio` |
| 샘플 TR ID | FHKST66430800 |
| 공식 샘플 파일 | examples_llm/domestic_stock/finance_growth_ratio/finance_growth_ratio.py |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | GET |
| 운영 도메인 | `https://openapi.koreainvestment.com:9443` |
| 모의투자 도메인 | `https://openapivts.koreainvestment.com:29443` |
| URL | `/uapi/domestic-stock/v1/finance/growth-ratio` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
| Header | `authorization` | Bearer access token | Y |
| Header | `appkey` | 앱키 | Y |
| Header | `appsecret` | 앱시크릿 | Y |
| Header | `tr_id` | FHKST66430800 | Y |
| Header | `custtype` | 고객 타입 | N |
| Header | `tr_cont` | 연속거래여부 | N |

## 요청

문서 미기재

## 응답

한국투자증권 포털 응답 필드 상세는 공식 포털 화면과 샘플 repo를 함께 확인합니다. 이 생성 문서는 API path, TR ID, 필수 요청 파라미터 식별을 우선합니다.

## 예제

### Request

```json
{}
```

### Response

```text
문서 미기재
```

## 연속조회/실시간/주의사항

- REST 요청은 `authorization`, `appkey`, `appsecret`, `tr_id`, 필요 시 `custtype` 헤더를 사용합니다.
- 실시간은 `/oauth2/Approval`로 받은 approval key를 WebSocket 헤더에 사용합니다.
- 주문성 API의 hashkey 적용 여부는 공식 포털과 샘플의 최신 정책을 우선합니다.
