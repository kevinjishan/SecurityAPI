---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "4ab0k2u7-kl78-y52c-e2m7-p13v5csnt014"
tr_code: "FC9"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSPI200선물체결 (FC9)

<!-- request_field_count: 4 -->
<!-- response_field_count: 30 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | KOSPI200선물체결 |
| TR코드 | `FC9` |
| 초당 전송 건수 | - |
| 설명 | 선물옵션 주문현황 및 시세, 투자정보를 실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/futureoption` |
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
| Response Body | `chetime` | 체결시간 | String | Y | 6 | - |
| Response Body | `sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `change` | 전일대비 | String | Y | 9.2 | - |
| Response Body | `drate` | 등락율 | String | Y | 6.2 | - |
| Response Body | `price` | 현재가 | String | Y | 9.2 | - |
| Response Body | `open` | 시가 | String | Y | 9.2 | - |
| Response Body | `high` | 고가 | String | Y | 9.2 | - |
| Response Body | `low` | 저가 | String | Y | 9.2 | - |
| Response Body | `cgubun` | 체결구분 | String | Y | 1 | - |
| Response Body | `cvolume` | 체결량 | String | Y | 6 | - |
| Response Body | `volume` | 누적거래량 | String | Y | 12 | - |
| Response Body | `value` | 누적거래대금 | String | Y | 12 | - |
| Response Body | `mdvolume` | 매도누적체결량 | String | Y | 12 | - |
| Response Body | `mdchecnt` | 매도누적체결건수 | String | Y | 8 | - |
| Response Body | `msvolume` | 매수누적체결량 | String | Y | 12 | - |
| Response Body | `mschecnt` | 매수누적체결건수 | String | Y | 8 | - |
| Response Body | `cpower` | 체결강도 | String | Y | 9.2 | - |
| Response Body | `offerho1` | 매도호가1 | String | Y | 9.2 | - |
| Response Body | `bidho1` | 매수호가1 | String | Y | 9.2 | - |
| Response Body | `openyak` | 미결제약정수량 | String | Y | 8 | - |
| Response Body | `k200jisu` | KOSPI200지수 | String | Y | 9.2 | - |
| Response Body | `theoryprice` | 이론가 | String | Y | 9.2 | - |
| Response Body | `kasis` | 괴리율 | String | Y | 6.2 | - |
| Response Body | `sbasis` | 시장BASIS | String | Y | 9.2 | - |
| Response Body | `ibasis` | 이론BASIS | String | Y | 9.2 | - |
| Response Body | `openyakcha` | 미결제약정증감 | String | Y | 8 | - |
| Response Body | `jgubun` | 장운영정보 | String | Y | 2 | - |
| Response Body | `jnilvolume` | 전일동시간대거래량 | String | Y | 12 | - |
| Response Body | `futcode` | 단축코드 | String | Y | 8 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "FC9",
    "tr_key": "A0166000"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "FC9",
    "tr_key": "A0166000"
  },
  "body": {
    "futcode": "A0166000",
    "mdchecnt": "10849",
    "sign": "5",
    "mschecnt": "10759",
    "ibasis": "2.23",
    "mdvolume": "24994",
    "cpower": "102.07",
    "cvolume": "3",
    "high": "348.55",
    "low": "346.50",
    "price": "347.80",
    "kasis": "-0.18",
    "cgubun": "+",
    "bidho1": "347.75",
    "k200jisu": "346.18",
    "value": "4516509",
    "offerho1": "347.80",
    "jgubun": "40",
    "change": "0.60",
    "chetime": "093621",
    "openyak": "281563",
    "volume": "51968",
    "drate": "-0.17",
    "openyakcha": "3853",
    "jnilvolume": "41625",
    "msvolume": "25511",
    "sbasis": "1.62",
    "theoryprice": "348.41",
    "open": "348.30"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
