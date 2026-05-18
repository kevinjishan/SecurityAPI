---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "dgb3zvti-2k01-jhfa-6c63-7pmb27qqtw67"
tr_code: "DVI"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 시간외단일가VI발동해제 (DVI)

<!-- request_field_count: 4 -->
<!-- response_field_count: 9 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | 시간외단일가VI발동해제 |
| TR코드 | `DVI` |
| 초당 전송 건수 | - |
| 설명 | 주식 주문현황 및 시세, 투자정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/stock` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `token` | 접근토큰 | String | Y | 1000 | Access Token을 설정하기 위한 Header Parameter |
| Request Header | `tr_type` | 거래 Type | String | Y | 1 | 1: 계좌등록, 2: 계좌해제, 3: 실시간 시세 등록, 4: 실시간 시세 해제 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |
| Request Body | `tr_key` | 단축코드 | String | N | 6 | 단축코드 6자리 또는 전체종목 '000000' |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `vi_gubun` | 구분(0:해제 1:정적발동 2:동적발동 3:정적&동적) | String | Y | 1 | - |
| Response Body | `svi_recprice` | 정적VI발동기준가격 | String | Y | 8 | - |
| Response Body | `dvi_recprice` | 동적VI발동기준가격 | String | Y | 8 | - |
| Response Body | `vi_trgprice` | VI발동가격 | String | Y | 8 | - |
| Response Body | `shcode` | 단축코드(KEY) | String | Y | 6 | - |
| Response Body | `ref_shcode` | 참조코드(미사용) | String | Y | 6 | - |
| Response Body | `time` | 시간 | String | Y | 6 | - |
| Response Body | `exchname` | 거래소명 | String | Y | 3 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6Ijk5NGZkNjI5LWY4OGItNGQ0Ni05NTE0LTJjNmQzMjM1MWIyYSIsIm5iZiI6MTY4NjY0MDc3NywiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzI3MTc3LCJpYXQiOjE2ODY2NDA3NzcsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.WT1pgGw-gawv2GAQiRNcEphlv3BfXZfeVG03wwBCoCKpUYYC0l019Oc0JJIqoR41WHm8kEuNgDgYhlib_LxI7g",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "DVI",
    "tr_key": "086520"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "DVI",
    "tr_key": "145270"
  },
  "body": {
    "svi_recprice": "0",
    "vi_gubun": "0",
    "shcode": "145270",
    "time": "092415",
    "vi_trgprice": "0",
    "dvi_recprice": "0",
    "ref_shcode": "145270"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
