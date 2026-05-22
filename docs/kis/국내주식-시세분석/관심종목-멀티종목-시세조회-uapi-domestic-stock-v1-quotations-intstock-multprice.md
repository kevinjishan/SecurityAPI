---
broker: "한국투자증권"
source_url: "https://apiportal.koreainvestment.com/apiservice-summary"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "[국내주식] 시세분석"
api_id: "/uapi/domestic-stock/v1/quotations/intstock-multprice"
api_name: "관심종목(멀티종목) 시세조회"
method: "GET"
domain: "https://openapi.koreainvestment.com:9443"
path: "/uapi/domestic-stock/v1/quotations/intstock-multprice"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 관심종목(멀티종목) 시세조회 (/uapi/domestic-stock/v1/quotations/intstock-multprice)

<!-- request_field_count: 61 -->
<!-- response_field_count: 0 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | [국내주식] 시세분석 |
| API path | `/uapi/domestic-stock/v1/quotations/intstock-multprice` |
| 샘플 TR ID | FHKST11300006 |
| 공식 샘플 파일 | examples_llm/domestic_stock/intstock_multprice/intstock_multprice.py |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | GET |
| 운영 도메인 | `https://openapi.koreainvestment.com:9443` |
| 모의투자 도메인 | `https://openapivts.koreainvestment.com:29443` |
| URL | `/uapi/domestic-stock/v1/quotations/intstock-multprice` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
| Header | `authorization` | Bearer access token | Y |
| Header | `appkey` | 앱키 | Y |
| Header | `appsecret` | 앱시크릿 | Y |
| Header | `tr_id` | FHKST11300006 | Y |
| Header | `custtype` | 고객 타입 | N |
| Header | `tr_cont` | 연속거래여부 | N |

## 요청

| 위치 | 필드 | 필수 |
| --- | --- | --- |
| Query/Body | `FID_COND_MRKT_DIV_CODE_1` | Y |
| Query/Body | `FID_INPUT_ISCD_1` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_2` | Y |
| Query/Body | `FID_INPUT_ISCD_2` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_3` | Y |
| Query/Body | `FID_INPUT_ISCD_3` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_4` | Y |
| Query/Body | `FID_INPUT_ISCD_4` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_5` | Y |
| Query/Body | `FID_INPUT_ISCD_5` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_6` | Y |
| Query/Body | `FID_INPUT_ISCD_6` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_7` | Y |
| Query/Body | `FID_INPUT_ISCD_7` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_8` | Y |
| Query/Body | `FID_INPUT_ISCD_8` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_9` | Y |
| Query/Body | `FID_INPUT_ISCD_9` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_10` | Y |
| Query/Body | `FID_INPUT_ISCD_10` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_11` | Y |
| Query/Body | `FID_INPUT_ISCD_11` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_12` | Y |
| Query/Body | `FID_INPUT_ISCD_12` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_13` | Y |
| Query/Body | `FID_INPUT_ISCD_13` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_14` | Y |
| Query/Body | `FID_INPUT_ISCD_14` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_15` | Y |
| Query/Body | `FID_INPUT_ISCD_15` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_16` | Y |
| Query/Body | `FID_INPUT_ISCD_16` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_17` | Y |
| Query/Body | `FID_INPUT_ISCD_17` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_18` | Y |
| Query/Body | `FID_INPUT_ISCD_18` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_19` | Y |
| Query/Body | `FID_INPUT_ISCD_19` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_20` | Y |
| Query/Body | `FID_INPUT_ISCD_20` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_21` | Y |
| Query/Body | `FID_INPUT_ISCD_21` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_22` | Y |
| Query/Body | `FID_INPUT_ISCD_22` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_23` | Y |
| Query/Body | `FID_INPUT_ISCD_23` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_24` | Y |
| Query/Body | `FID_INPUT_ISCD_24` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_25` | Y |
| Query/Body | `FID_INPUT_ISCD_25` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_26` | Y |
| Query/Body | `FID_INPUT_ISCD_26` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_27` | Y |
| Query/Body | `FID_INPUT_ISCD_27` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_28` | Y |
| Query/Body | `FID_INPUT_ISCD_28` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_29` | Y |
| Query/Body | `FID_INPUT_ISCD_29` | Y |
| Query/Body | `FID_COND_MRKT_DIV_CODE_30` | Y |
| Query/Body | `FID_INPUT_ISCD_30` | Y |

## 응답

한국투자증권 포털 응답 필드 상세는 공식 포털 화면과 샘플 repo를 함께 확인합니다. 이 생성 문서는 API path, TR ID, 필수 요청 파라미터 식별을 우선합니다.

## 예제

### Request

```json
{
  "FID_COND_MRKT_DIV_CODE_1": "",
  "FID_INPUT_ISCD_1": "",
  "FID_COND_MRKT_DIV_CODE_2": "",
  "FID_INPUT_ISCD_2": "",
  "FID_COND_MRKT_DIV_CODE_3": "",
  "FID_INPUT_ISCD_3": "",
  "FID_COND_MRKT_DIV_CODE_4": "",
  "FID_INPUT_ISCD_4": "",
  "FID_COND_MRKT_DIV_CODE_5": "",
  "FID_INPUT_ISCD_5": "",
  "FID_COND_MRKT_DIV_CODE_6": "",
  "FID_INPUT_ISCD_6": "",
  "FID_COND_MRKT_DIV_CODE_7": "",
  "FID_INPUT_ISCD_7": "",
  "FID_COND_MRKT_DIV_CODE_8": "",
  "FID_INPUT_ISCD_8": "",
  "FID_COND_MRKT_DIV_CODE_9": "",
  "FID_INPUT_ISCD_9": "",
  "FID_COND_MRKT_DIV_CODE_10": "",
  "FID_INPUT_ISCD_10": "",
  "FID_COND_MRKT_DIV_CODE_11": "",
  "FID_INPUT_ISCD_11": "",
  "FID_COND_MRKT_DIV_CODE_12": "",
  "FID_INPUT_ISCD_12": "",
  "FID_COND_MRKT_DIV_CODE_13": "",
  "FID_INPUT_ISCD_13": "",
  "FID_COND_MRKT_DIV_CODE_14": "",
  "FID_INPUT_ISCD_14": "",
  "FID_COND_MRKT_DIV_CODE_15": "",
  "FID_INPUT_ISCD_15": "",
  "FID_COND_MRKT_DIV_CODE_16": "",
  "FID_INPUT_ISCD_16": "",
  "FID_COND_MRKT_DIV_CODE_17": "",
  "FID_INPUT_ISCD_17": "",
  "FID_COND_MRKT_DIV_CODE_18": "",
  "FID_INPUT_ISCD_18": "",
  "FID_COND_MRKT_DIV_CODE_19": "",
  "FID_INPUT_ISCD_19": "",
  "FID_COND_MRKT_DIV_CODE_20": "",
  "FID_INPUT_ISCD_20": "",
  "FID_COND_MRKT_DIV_CODE_21": "",
  "FID_INPUT_ISCD_21": "",
  "FID_COND_MRKT_DIV_CODE_22": "",
  "FID_INPUT_ISCD_22": "",
  "FID_COND_MRKT_DIV_CODE_23": "",
  "FID_INPUT_ISCD_23": "",
  "FID_COND_MRKT_DIV_CODE_24": "",
  "FID_INPUT_ISCD_24": "",
  "FID_COND_MRKT_DIV_CODE_25": "",
  "FID_INPUT_ISCD_25": "",
  "FID_COND_MRKT_DIV_CODE_26": "",
  "FID_INPUT_ISCD_26": "",
  "FID_COND_MRKT_DIV_CODE_27": "",
  "FID_INPUT_ISCD_27": "",
  "FID_COND_MRKT_DIV_CODE_28": "",
  "FID_INPUT_ISCD_28": "",
  "FID_COND_MRKT_DIV_CODE_29": "",
  "FID_INPUT_ISCD_29": "",
  "FID_COND_MRKT_DIV_CODE_30": "",
  "FID_INPUT_ISCD_30": ""
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
