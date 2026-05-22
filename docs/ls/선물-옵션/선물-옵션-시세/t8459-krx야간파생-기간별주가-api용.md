---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=9f467798-6ce6-4d31-ab93-5a0e2860f89f"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "9f467798-6ce6-4d31-ab93-5a0e2860f89f"
api_name: "[선물/옵션] 시세"
tr_id: "futroptn-0000-0000-0000-0000000t8459"
tr_code: "t8459"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/market-data"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# KRX야간파생 기간별주가(API용) (t8459)

<!-- request_field_count: 13 -->
<!-- response_field_count: 20 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 시세 |
| TR명 | KRX야간파생 기간별주가(API용) |
| TR코드 | `t8459` |
| 초당 전송 건수 | 1 |
| 설명 | 주간/야간 선물옵션 종목별 시세 및 미결제약정 등시세관련 데이터를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/futureoption/market-data` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | - |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | - |
| Request Header | `tr_cd` | 거래 CD | String | Y | 10 | - |
| Request Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | - |
| Request Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | - |
| Request Header | `mac_address` | MAC 주소 | String | Y | 12 | - |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `t8459InBlock` | t8459InBlock | Object | Y | - | - |
| Request Body | `-shcode` | 단축코드 | String | Y | 8 | - |
| Request Body | `-futcheck` | 선물최근월물 | String | Y | 1 | - |
| Request Body | `-date` | 날짜 | String | Y | 8 | - |
| Request Body | `-cts_code` | CTS종목코드 | String | Y | 8 | - |
| Request Body | `-lastdate` | 전종목만기일 | String | Y | 8 | - |
| Request Body | `-cnt` | 조회요청건수 | Object | Y | 3 | - |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | - |
| Response Header | `tr_cd` | 거래 CD | String | Y | 10 | - |
| Response Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | - |
| Response Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | - |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `t8459OutBlock` | t8459OutBlock | Object | Y | - | - |
| Response Body | `-date` | 날짜 | String | Y | 8 | - |
| Response Body | `-cts_code` | CTS종목코드 | String | Y | 8 | - |
| Response Body | `-lastdate` | 전종목만기일 | String | Y | 8 | - |
| Response Body | `-nowfutyn` | 최근월선물여부 | String | Y | 1 | - |
| Response Body | `t8459OutBlock1` | t8459OutBlock1 | Object Array | Y | - | - |
| Response Body | `-date` | 날짜 | String | Y | 8 | - |
| Response Body | `-open` | 시가 | Number | Y | 6.2 | - |
| Response Body | `-high` | 고가 | Number | Y | 6.2 | - |
| Response Body | `-low` | 저가 | Number | Y | 6.2 | - |
| Response Body | `-close` | 종가 | Number | Y | 6.2 | - |
| Response Body | `-sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `-change` | 전일대비 | Number | Y | 6.2 | - |
| Response Body | `-diff` | 등락율 | Number | Y | 6.2 | - |
| Response Body | `-volume` | 거래량 | Number | Y | 12 | - |
| Response Body | `-diff_vol` | 거래증가율 | Number | Y | 10.2 | - |

## 예제

### Request

```json
{
  "t8459InBlock": {
    "shcode": "201W7342",
    "futcheck": "",
    "date": "",
    "cts_code": "",
    "lastdate": "",
    "cnt": 20
  }
}
```

### Response

```json
{
  "t8459OutBlock": {
    "date": "",
    "cts_code": "201W7342",
    "lastdate": "",
    "nowfutyn": "N"
  },
  "t8459OutBlock1": [
    {
      "date": "20250610",
      "open": "0.00",
      "high": "0.00",
      "low": "0.00",
      "close": "33.70",
      "sign": "3",
      "change": "0.00",
      "diff": "0.00",
      "volume": 0,
      "diff_vol": "0.00"
    }
  ],
  "rsp_cd": "00000",
  "rsp_msg": "정상적으로 조회가 완료되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
