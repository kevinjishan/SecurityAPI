---
broker: "한국투자증권"
source_url: "https://apiportal.koreainvestment.com/apiservice-summary"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "[국내선물옵션] 실시간시세"
api_id: "H0IOCNT0"
api_name: "지수옵션  실시간체결가"
method: "GET"
domain: "ws://ops.koreainvestment.com:21000"
path: "/tryitout/H0IOCNT0"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 지수옵션  실시간체결가 (H0IOCNT0)

<!-- request_field_count: 0 -->
<!-- response_field_count: 0 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | [국내선물옵션] 실시간시세 |
| API path | `/tryitout/H0IOCNT0` |
| 샘플 TR ID | - |
| 공식 샘플 파일 | - |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | GET |
| 운영 도메인 | `ws://ops.koreainvestment.com:21000` |
| 모의투자 도메인 | `ws://ops.koreainvestment.com:31000` |
| URL | `/tryitout/H0IOCNT0` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
| Header | `approval_key` | WebSocket 접속키 | Y |
| Header | `custtype` | 고객 타입 | N |
| Header | `tr_type` | 등록/해제 구분 | Y |

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
