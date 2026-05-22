---
broker: "한국투자증권"
source_url: "https://apiportal.koreainvestment.com/apiservice-summary"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "[국내주식] ELW 시세"
api_id: "/uapi/elw/v1/quotations/cond-search"
api_name: "ELW 종목검색"
method: "GET"
domain: "https://openapi.koreainvestment.com:9443"
path: "/uapi/elw/v1/quotations/cond-search"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# ELW 종목검색 (/uapi/elw/v1/quotations/cond-search)

<!-- request_field_count: 58 -->
<!-- response_field_count: 0 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | [국내주식] ELW 시세 |
| API path | `/uapi/elw/v1/quotations/cond-search` |
| 샘플 TR ID | FHKEW15100000 |
| 공식 샘플 파일 | examples_llm/elw/cond_search/cond_search.py |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | GET |
| 운영 도메인 | `https://openapi.koreainvestment.com:9443` |
| 모의투자 도메인 | `https://openapivts.koreainvestment.com:29443` |
| URL | `/uapi/elw/v1/quotations/cond-search` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
| Header | `authorization` | Bearer access token | Y |
| Header | `appkey` | 앱키 | Y |
| Header | `appsecret` | 앱시크릿 | Y |
| Header | `tr_id` | FHKEW15100000 | Y |
| Header | `custtype` | 고객 타입 | N |
| Header | `tr_cont` | 연속거래여부 | N |

## 요청

| 위치 | 필드 | 필수 |
| --- | --- | --- |
| Query/Body | `FID_COND_MRKT_DIV_CODE` | Y |
| Query/Body | `FID_COND_SCR_DIV_CODE` | Y |
| Query/Body | `FID_RANK_SORT_CLS_CODE` | Y |
| Query/Body | `FID_INPUT_CNT_1` | Y |
| Query/Body | `FID_RANK_SORT_CLS_CODE_2` | Y |
| Query/Body | `FID_INPUT_CNT_2` | Y |
| Query/Body | `FID_RANK_SORT_CLS_CODE_3` | Y |
| Query/Body | `FID_INPUT_CNT_3` | Y |
| Query/Body | `FID_TRGT_CLS_CODE` | Y |
| Query/Body | `FID_INPUT_ISCD` | Y |
| Query/Body | `FID_UNAS_INPUT_ISCD` | Y |
| Query/Body | `FID_MRKT_CLS_CODE` | Y |
| Query/Body | `FID_INPUT_DATE_1` | Y |
| Query/Body | `FID_INPUT_DATE_2` | Y |
| Query/Body | `FID_INPUT_ISCD_2` | Y |
| Query/Body | `FID_ETC_CLS_CODE` | Y |
| Query/Body | `FID_INPUT_RMNN_DYNU_1` | Y |
| Query/Body | `FID_INPUT_RMNN_DYNU_2` | Y |
| Query/Body | `FID_PRPR_CNT1` | Y |
| Query/Body | `FID_PRPR_CNT2` | Y |
| Query/Body | `FID_RSFL_RATE1` | Y |
| Query/Body | `FID_RSFL_RATE2` | Y |
| Query/Body | `FID_VOL1` | Y |
| Query/Body | `FID_VOL2` | Y |
| Query/Body | `FID_APLY_RANG_PRC_1` | Y |
| Query/Body | `FID_APLY_RANG_PRC_2` | Y |
| Query/Body | `FID_LVRG_VAL1` | Y |
| Query/Body | `FID_LVRG_VAL2` | Y |
| Query/Body | `FID_VOL3` | Y |
| Query/Body | `FID_VOL4` | Y |
| Query/Body | `FID_INTS_VLTL1` | Y |
| Query/Body | `FID_INTS_VLTL2` | Y |
| Query/Body | `FID_PRMM_VAL1` | Y |
| Query/Body | `FID_PRMM_VAL2` | Y |
| Query/Body | `FID_GEAR1` | Y |
| Query/Body | `FID_GEAR2` | Y |
| Query/Body | `FID_PRLS_QRYR_RATE1` | Y |
| Query/Body | `FID_PRLS_QRYR_RATE2` | Y |
| Query/Body | `FID_DELTA1` | Y |
| Query/Body | `FID_DELTA2` | Y |
| Query/Body | `FID_ACPR1` | Y |
| Query/Body | `FID_ACPR2` | Y |
| Query/Body | `FID_STCK_CNVR_RATE1` | Y |
| Query/Body | `FID_STCK_CNVR_RATE2` | Y |
| Query/Body | `FID_DIV_CLS_CODE` | Y |
| Query/Body | `FID_PRIT1` | Y |
| Query/Body | `FID_PRIT2` | Y |
| Query/Body | `FID_CFP1` | Y |
| Query/Body | `FID_CFP2` | Y |
| Query/Body | `FID_INPUT_NMIX_PRICE_1` | Y |
| Query/Body | `FID_INPUT_NMIX_PRICE_2` | Y |
| Query/Body | `FID_EGEA_VAL1` | Y |
| Query/Body | `FID_EGEA_VAL2` | Y |
| Query/Body | `FID_INPUT_DVDN_ERT` | Y |
| Query/Body | `FID_INPUT_HIST_VLTL` | Y |
| Query/Body | `FID_THETA1` | Y |
| Query/Body | `FID_THETA2` | Y |

## 응답

한국투자증권 포털 응답 필드 상세는 공식 포털 화면과 샘플 repo를 함께 확인합니다. 이 생성 문서는 API path, TR ID, 필수 요청 파라미터 식별을 우선합니다.

## 예제

### Request

```json
{
  "FID_COND_MRKT_DIV_CODE": "",
  "FID_COND_SCR_DIV_CODE": "",
  "FID_RANK_SORT_CLS_CODE": "",
  "FID_INPUT_CNT_1": "",
  "FID_RANK_SORT_CLS_CODE_2": "",
  "FID_INPUT_CNT_2": "",
  "FID_RANK_SORT_CLS_CODE_3": "",
  "FID_INPUT_CNT_3": "",
  "FID_TRGT_CLS_CODE": "",
  "FID_INPUT_ISCD": "",
  "FID_UNAS_INPUT_ISCD": "",
  "FID_MRKT_CLS_CODE": "",
  "FID_INPUT_DATE_1": "",
  "FID_INPUT_DATE_2": "",
  "FID_INPUT_ISCD_2": "",
  "FID_ETC_CLS_CODE": "",
  "FID_INPUT_RMNN_DYNU_1": "",
  "FID_INPUT_RMNN_DYNU_2": "",
  "FID_PRPR_CNT1": "",
  "FID_PRPR_CNT2": "",
  "FID_RSFL_RATE1": "",
  "FID_RSFL_RATE2": "",
  "FID_VOL1": "",
  "FID_VOL2": "",
  "FID_APLY_RANG_PRC_1": "",
  "FID_APLY_RANG_PRC_2": "",
  "FID_LVRG_VAL1": "",
  "FID_LVRG_VAL2": "",
  "FID_VOL3": "",
  "FID_VOL4": "",
  "FID_INTS_VLTL1": "",
  "FID_INTS_VLTL2": "",
  "FID_PRMM_VAL1": "",
  "FID_PRMM_VAL2": "",
  "FID_GEAR1": "",
  "FID_GEAR2": "",
  "FID_PRLS_QRYR_RATE1": "",
  "FID_PRLS_QRYR_RATE2": "",
  "FID_DELTA1": "",
  "FID_DELTA2": "",
  "FID_ACPR1": "",
  "FID_ACPR2": "",
  "FID_STCK_CNVR_RATE1": "",
  "FID_STCK_CNVR_RATE2": "",
  "FID_DIV_CLS_CODE": "",
  "FID_PRIT1": "",
  "FID_PRIT2": "",
  "FID_CFP1": "",
  "FID_CFP2": "",
  "FID_INPUT_NMIX_PRICE_1": "",
  "FID_INPUT_NMIX_PRICE_2": "",
  "FID_EGEA_VAL1": "",
  "FID_EGEA_VAL2": "",
  "FID_INPUT_DVDN_ERT": "",
  "FID_INPUT_HIST_VLTL": "",
  "FID_THETA1": "",
  "FID_THETA2": ""
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
