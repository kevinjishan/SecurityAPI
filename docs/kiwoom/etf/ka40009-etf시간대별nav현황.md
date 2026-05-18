---
broker: "키움증권"
source_url: "https://openapi.kiwoom.com/guide/apiguide?dummyVal=0"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "ETF"
api_id: "ka40009"
api_name: "ETF시간대별NAV현황"
method: "POST"
domain: "https://api.kiwoom.com"
path: "/api/dostk/etf"
content_type: "application/json;charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# ETF시간대별NAV현황 (ka40009)

<!-- request_field_count: 5 -->
<!-- response_field_count: 16 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 메뉴 위치 | 국내주식 > ETF > ETF시간대별NAV현황 |
| API ID | `ka40009` |
| 전송 방식 | REST |
| 설명 | ETF 정보를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | POST |
| 운영 도메인 | `https://api.kiwoom.com` |
| 개발 도메인 | `https://apidev.kiwoom.com` |
| 모의투자 도메인 | `https://mockapi.kiwoom.com` |
| URL | `/api/dostk/etf` |
| Format | JSON |
| Content-Type | application/json;charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 샘플 | 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 헤더 | `authorization` | 접근토큰 | String | Y | 1000 | - | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 <br> 예) Bearer Egicyx... |
| 헤더 | `cont-yn` | 연속조회여부 | String | N | 1 | - | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| 헤더 | `next-key` | 연속조회키 | String | N | 50 | - | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |
| 헤더 | `api-id` | TR명 | String | Y | 10 | - | - |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 샘플 | 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Body | `stk_cd` | 종목코드 | String | Y | 6 | 069500 | - |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 샘플 | 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 헤더 | `cont-yn` | 연속조회여부 | String | N | 1 | - | 다음 데이터가 있을시 Y값 전달 |
| 헤더 | `next-key` | 연속조회키 | String | N | 50 | - | 다음 데이터가 있을시 다음 키값 전달 |
| 헤더 | `api-id` | TR명 | String | Y | 10 | - | - |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 샘플 | 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Body | `- base_pric` | 기준가 | String | N | 20 | - | - |
| Body | `- conv_pric` | 환산가격 | String | N | 20 | - | - |
| Body | `- dispty_rt` | 괴리율 | String | N | 20 | - | - |
| Body | `- drstk` | DR/주 | String | N | 20 | - | - |
| Body | `- for_rmnd_qty` | 외인보유수량 | String | N | 20 | - | - |
| Body | `- nav` | NAV | String | N | 20 | - | - |
| Body | `- navflu_rt` | NAV등락율 | String | N | 20 | - | - |
| Body | `- navpred_pre` | NAV전일대비 | String | N | 20 | - | - |
| Body | `- repl_pric` | 대용가 | String | N | 20 | - | - |
| Body | `- stkcnt` | 주식수 | String | N | 20 | - | - |
| Body | `- trace_eor_rt` | 추적오차율 | String | N | 20 | - | - |
| Body | `- wonju_pric` | 원주가격 | String | N | 20 | - | - |
| Body | `etfnavarray` | ETFNAV배열 | LIST | N | - | - | - |

## 예제

### Request

```json
{
  "stk_cd": "069500"
}
```

### Response

```json
{
  "etfnavarray": [
    {
      "nav": "",
      "navpred_pre": "",
      "navflu_rt": "",
      "trace_eor_rt": "",
      "dispty_rt": "",
      "stkcnt": "133100",
      "base_pric": "4450",
      "for_rmnd_qty": "",
      "repl_pric": "",
      "conv_pric": "",
      "drstk": "",
      "wonju_pric": ""
    },
    {
      "nav": "",
      "navpred_pre": "",
      "navflu_rt": "",
      "trace_eor_rt": "",
      "dispty_rt": "",
      "stkcnt": "133100",
      "base_pric": "4510",
      "for_rmnd_qty": "",
      "repl_pric": "",
      "conv_pric": "",
      "drstk": "",
      "wonju_pric": ""
    },
    {
      "nav": "",
      "navpred_pre": "",
      "navflu_rt": "",
      "trace_eor_rt": "",
      "dispty_rt": "",
      "stkcnt": "133100",
      "base_pric": "4510",
      "for_rmnd_qty": "",
      "repl_pric": "",
      "conv_pric": "",
      "drstk": "",
      "wonju_pric": ""
    },
    {
      "nav": "",
      "navpred_pre": "",
      "navflu_rt": "",
      "trace_eor_rt": "",
      "dispty_rt": "",
      "stkcnt": "133100",
      "base_pric": "4670",
      "for_rmnd_qty": "",
      "repl_pric": "",
      "conv_pric": "",
      "drstk": "",
      "wonju_pric": ""
    }
  ],
  "return_code": 0,
  "return_msg": "정상적으로 처리되었습니다"
}
```

## 연속조회/실시간/주의사항

- 연속조회는 응답 헤더 `cont-yn`, `next-key`가 문서에 있는 경우 해당 값을 다음 요청 헤더에 반영합니다.
- 실시간 API는 공식 문서의 API 설명과 요청/응답 필드 구조를 우선합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- [키움증권 오류코드](../errors.md)
