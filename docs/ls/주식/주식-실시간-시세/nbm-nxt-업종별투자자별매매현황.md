---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "bd0bba34-6de0-4138-9c2c-8bd86164ea42"
tr_code: "NBM"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# (NXT)업종별투자자별매매현황 (NBM)

<!-- request_field_count: 4 -->
<!-- response_field_count: 13 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | (NXT)업종별투자자별매매현황 |
| TR코드 | `NBM` |
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
| Request Body | `tr_key` | 단축코드 | String | Y | 4 | N + 업종코드 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `tjjcode` | 투자자코드 | String | Y | 4 | - |
| Response Body | `tjjtime` | 수신시간 | String | Y | 8 | - |
| Response Body | `msvolume` | 매수거래량 | Number | Y | 8 | - |
| Response Body | `mdvolume` | 매도거래량 | Number | Y | 8 | - |
| Response Body | `msvol` | 거래량순매수 | Number | Y | 8 | - |
| Response Body | `p_msvol` | 거래량순매수직전대비 | Number | Y | 8 | - |
| Response Body | `msvalue` | 매수거래대금 | Number | Y | 6 | - |
| Response Body | `매도거래대금` | 매도거래대금 | Number | Y | 6 | - |
| Response Body | `msval` | 거래대금순매수 | Number | Y | 6 | - |
| Response Body | `p_msval` | 거래대금순매수직전대비 | Number | Y | 6 | - |
| Response Body | `upcode` | 업종코드 | String | Y | 3 | - |
| Response Body | `ex_upcode` | 거래소별업종코드 | String | Y | 4 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjlkZmJhYWNiLWY5NWUtNGMwMi1hZGFlLTBhYzI3YTU4ZmM2NiIsIm5iZiI6MTc0MjUxMDc3OSwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNzQyNTk0NDAwLCJpYXQiOjE3NDI1MTA3NzksImp0aSI6IlBTUFphQmp2S3V6V3VjeGlvYzhib21jdmsxY0U3cUs2V2JubSJ9.r8eqrh_LoLWvOa2WhCBLnXilk-2LZLSGcOSwJ3KuNolsHwRFvncrG0FEdw2sqhk7Z-rHXpvNiyMbdtOS4-E3hQ",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "NBM",
    "tr_key": "N003"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "NBM",
    "tr_key": "N003"
  },
  "body": {
    "p_msval": "0",
    "tjjtime": "15030000",
    "p_msvol": "0",
    "mdvalue": "487",
    "msvolume": "1123",
    "upcode": "003",
    "ex_upcode": "N003",
    "tjjcode": "9999",
    "msvalue": "487",
    "mdvolume": "1127",
    "msvol": "-3",
    "msval": "-1"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
