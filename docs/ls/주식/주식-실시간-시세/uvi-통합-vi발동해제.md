---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "006d0c8c-84a8-4466-b014-148c704d2f6e"
tr_code: "UVI"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (통합)VI발동해제 (UVI)

<!-- request_field_count: 4 -->
<!-- response_field_count: 15 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (통합)VI발동해제 |
| TR코드 | `UVI` |
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
| Request Body | `tr_key` | 단축코드 | String | Y | 10 | 'U' + 단축코드 6자리 + 공백 3자리 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `krx_vi_gubun` | KRXVI구분 (0:해제1:정적발동2:동적발동3:정적&동적) | String | Y | 1 | 0:해제1:정적발동2:동적발동3:정적&동적 |
| Response Body | `krx_svi_recprice` | KRX정적VI발동기준가격 | Number | Y | 8 | - |
| Response Body | `krx_dvi_recprice` | KRX동적VI발동기준가격 | Number | Y | 8 | - |
| Response Body | `krx_vi_trgprice` | KRXVI발동가격 | Number | Y | 8 | - |
| Response Body | `krx_time` | KRX시간 | String | Y | 6 | - |
| Response Body | `nxt_vi_gubun` | NXTVI구분(0:해제1:정적발동2:동적발동3:정적&동적) | String | Y | - | 0:해제1:정적발동2:동적발동3:정적&동적 |
| Response Body | `nxt_svi_recprice` | NXT정적VI발동기준가격 | Number | Y | 8 | - |
| Response Body | `nxt_dvi_recprice` | NXT동적VI발동기준가격 | Number | Y | 8 | - |
| Response Body | `nxt_vi_trgprice` | NXTVI발동가격 | Number | Y | 8 | - |
| Response Body | `nxt_time` | NXT시간 | String | Y | 6 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 9 | - |
| Response Body | `ref_shcode` | 참조코드(미사용) | String | Y | 6 | - |
| Response Body | `exchname` | 거래소명 | String | Y | 3 | - |
| Response Body | `ex_shcode` | 거래소별단축코드 | String | Y | 10 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjlkZmJhYWNiLWY5NWUtNGMwMi1hZGFlLTBhYzI3YTU4ZmM2NiIsIm5iZiI6MTc0MjUxMDc3OSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQyNTk0NDAwLCJpYXQiOjE3NDI1MTA3NzksImp0aSI6IlBTUFphQmp2S3V6V3VjeGlvYzhib21jdmsxY0U3cUs2V2JubSJ9.r8eqrh_LoLWvOa2WhCBLnXilk-2LZLSGcOSwJ3KuNolsHwRFvncrG0FEdw2sqhk7Z",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "UVI",
    "tr_key": "0000000000"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "UVI",
    "tr_key": "0000000000"
  },
  "body": {
    "krx_time": "173030",
    "shcode": "000000000",
    "krx_svi_recprice": "0",
    "nxt_svi_recprice": "0",
    "ex_shcode": "U258610",
    "krx_vi_gubun": "0",
    "krx_dvi_recprice": "0",
    "krx_vi_trgprice": "0",
    "ref_shcode": "258610",
    "nxt_dvi_recprice": "0",
    "nxt_time": "",
    "nxt_vi_gubun": "",
    "exchname": "1X",
    "nxt_vi_trgprice": "0"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
