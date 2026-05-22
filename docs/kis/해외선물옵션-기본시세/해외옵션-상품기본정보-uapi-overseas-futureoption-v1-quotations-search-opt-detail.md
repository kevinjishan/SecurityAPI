---
broker: "한국투자증권"
source_url: "https://apiportal.koreainvestment.com/apiservice-summary"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "[해외선물옵션] 기본시세"
api_id: "/uapi/overseas-futureoption/v1/quotations/search-opt-detail"
api_name: "해외옵션 상품기본정보"
method: "GET"
domain: "https://openapi.koreainvestment.com:9443"
path: "/uapi/overseas-futureoption/v1/quotations/search-opt-detail"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 해외옵션 상품기본정보 (/uapi/overseas-futureoption/v1/quotations/search-opt-detail)

<!-- request_field_count: 32 -->
<!-- response_field_count: 0 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | [해외선물옵션] 기본시세 |
| API path | `/uapi/overseas-futureoption/v1/quotations/search-opt-detail` |
| 샘플 TR ID | HHDFO55200000 |
| 공식 샘플 파일 | examples_llm/overseas_futureoption/search_opt_detail/search_opt_detail.py |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | GET |
| 운영 도메인 | `https://openapi.koreainvestment.com:9443` |
| 모의투자 도메인 | `https://openapivts.koreainvestment.com:29443` |
| URL | `/uapi/overseas-futureoption/v1/quotations/search-opt-detail` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
| Header | `authorization` | Bearer access token | Y |
| Header | `appkey` | 앱키 | Y |
| Header | `appsecret` | 앱시크릿 | Y |
| Header | `tr_id` | HHDFO55200000 | Y |
| Header | `custtype` | 고객 타입 | N |
| Header | `tr_cont` | 연속거래여부 | N |

## 요청

| 위치 | 필드 | 필수 |
| --- | --- | --- |
| Query/Body | `QRY_CNT` | Y |
| Query/Body | `SRS_CD_01` | Y |
| Query/Body | `SRS_CD_02` | Y |
| Query/Body | `SRS_CD_03` | Y |
| Query/Body | `SRS_CD_04` | Y |
| Query/Body | `SRS_CD_05` | Y |
| Query/Body | `SRS_CD_06` | Y |
| Query/Body | `SRS_CD_07` | Y |
| Query/Body | `SRS_CD_08` | Y |
| Query/Body | `SRS_CD_09` | Y |
| Query/Body | `SRS_CD_10` | Y |
| Query/Body | `SRS_CD_11` | Y |
| Query/Body | `SRS_CD_12` | Y |
| Query/Body | `SRS_CD_13` | Y |
| Query/Body | `SRS_CD_14` | Y |
| Query/Body | `SRS_CD_15` | Y |
| Query/Body | `SRS_CD_16` | Y |
| Query/Body | `SRS_CD_17` | Y |
| Query/Body | `SRS_CD_18` | Y |
| Query/Body | `SRS_CD_19` | Y |
| Query/Body | `SRS_CD_20` | Y |
| Query/Body | `SRS_CD_21` | Y |
| Query/Body | `SRS_CD_22` | Y |
| Query/Body | `SRS_CD_23` | Y |
| Query/Body | `SRS_CD_24` | Y |
| Query/Body | `SRS_CD_25` | Y |
| Query/Body | `SRS_CD_26` | Y |
| Query/Body | `SRS_CD_27` | Y |
| Query/Body | `SRS_CD_28` | Y |
| Query/Body | `SRS_CD_29` | Y |
| Query/Body | `SRS_CD_30` | Y |

## 응답

한국투자증권 포털 응답 필드 상세는 공식 포털 화면과 샘플 repo를 함께 확인합니다. 이 생성 문서는 API path, TR ID, 필수 요청 파라미터 식별을 우선합니다.

## 예제

### Request

```json
{
  "QRY_CNT": "",
  "SRS_CD_01": "",
  "SRS_CD_02": "",
  "SRS_CD_03": "",
  "SRS_CD_04": "",
  "SRS_CD_05": "",
  "SRS_CD_06": "",
  "SRS_CD_07": "",
  "SRS_CD_08": "",
  "SRS_CD_09": "",
  "SRS_CD_10": "",
  "SRS_CD_11": "",
  "SRS_CD_12": "",
  "SRS_CD_13": "",
  "SRS_CD_14": "",
  "SRS_CD_15": "",
  "SRS_CD_16": "",
  "SRS_CD_17": "",
  "SRS_CD_18": "",
  "SRS_CD_19": "",
  "SRS_CD_20": "",
  "SRS_CD_21": "",
  "SRS_CD_22": "",
  "SRS_CD_23": "",
  "SRS_CD_24": "",
  "SRS_CD_25": "",
  "SRS_CD_26": "",
  "SRS_CD_27": "",
  "SRS_CD_28": "",
  "SRS_CD_29": "",
  "SRS_CD_30": ""
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
