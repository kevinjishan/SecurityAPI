---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "8k7ig4g4-06nc-1834-5fxt-2tl2hf5c71m3"
tr_code: "SHI"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 상/하한가진입 (SHI)

<!-- request_field_count: 4 -->
<!-- response_field_count: 21 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | 상/하한가진입 |
| TR코드 | `SHI` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 8 | 단축코드 6자리 또는 8자리 (단건, 연속), (계좌등록/해제 일 경우 필수값 아님) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `sijanggubun` | 거래소/코스닥구분 | String | Y | 1 | - |
| Response Body | `hname` | 종목명 | String | Y | 20 | - |
| Response Body | `price` | 현재가 | String | Y | 8 | - |
| Response Body | `sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `change` | 전일대비 | String | Y | 8 | - |
| Response Body | `drate` | 등락율 | String | Y | 6.2 | - |
| Response Body | `volume` | 누적거래량 | String | Y | 12 | - |
| Response Body | `volincrate` | 거래증가율 | String | Y | 12.2 | - |
| Response Body | `totofferrem` | 매도호가총수량 | String | Y | 12 | - |
| Response Body | `totbidrem` | 매수호가총수량 | String | Y | 12 | - |
| Response Body | `updnlmtstime` | 상한가/하한가최종진입시간 | String | Y | 6 | - |
| Response Body | `updnlmtdaycnt` | 상한가/하한가연속일수 | String | Y | 3 | - |
| Response Body | `jnilvolume` | 전일거래량 | String | Y | 12 | - |
| Response Body | `shcode` | 단축코드 | String | Y | 6 | - |
| Response Body | `gwangubun` | 관리구분 | String | Y | 1 | - |
| Response Body | `undergubun` | 이상급등구분 | String | Y | 1 | - |
| Response Body | `tgubun` | 투자유의구분 | String | Y | 1 | - |
| Response Body | `wgubun` | 우선주구분 | String | Y | 1 | - |
| Response Body | `dishonest` | 불성실구분 | String | Y | 1 | - |
| Response Body | `jkrate` | 증거금률 | String | Y | 1 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "SHI",
    "tr_key": "1"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "SHI",
    "tr_key": "1"
  },
  "body": {
    "wgubun": "0",
    "dishonest": "0",
    "change": "8950",
    "shcode": "005950",
    "sign": "1",
    "updnlmtstime": "103324",
    "tgubun": "0",
    "volume": "10603317",
    "sijanggubun": "1",
    "drate": "29.93",
    "price": "38850",
    "jnilvolume": "10603307",
    "gwangubun": "0",
    "undergubun": "0",
    "volincrate": "0.00",
    "totofferrem": "446856",
    "jkrate": "1",
    "hname": "이수화학",
    "totbidrem": "83255",
    "updnlmtdaycnt": "1"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
