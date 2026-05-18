---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=9f467798-6ce6-4d31-ab93-5a0e2860f89f"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "선물/옵션"
api_id: "9f467798-6ce6-4d31-ab93-5a0e2860f89f"
api_name: "[선물/옵션] 시세"
tr_id: "futroptn-0000-0000-0000-0000000t8455"
tr_code: "t8455"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/market-data"
content_type: "application/json; charset=UTF-8"
rate_limit: "2"
auth_required: true
---

# KRX야간파생 마스터조회(API용) (t8455)

<!-- request_field_count: 8 -->
<!-- response_field_count: 10 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 시세 |
| TR명 | KRX야간파생 마스터조회(API용) |
| TR코드 | `t8455` |
| 초당 전송 건수 | 2 |
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
| Request Body | `t8455InBlock` | t8455InBlock | Object | Y | - | - |
| Request Body | `-gubun` | 구분(NF/NC/NM/NO) | String | Y | 2 | - 선물 gubun<br>NFU : KOSPI200선물<br>NMF : 미니선물<br>NQF : 코스닥150선물<br>NCF : 상품선물<br>- 옵션 gubun<br>NOP : KOSPI200옵션<br>NMO : 미니옵션<br>NQO : 코스닥150옵션<br>NWO : 위클리옵션 |

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
| Response Body | `t8455OutBlock` | t8455OutBlock | Object Array | Y | - | - |
| Response Body | `-hname` | 종목명 | String | Y | 20 | - |
| Response Body | `-shcode` | 종목코드 | String | Y | 8 | - |
| Response Body | `-expcode` | 표준코드 | String | Y | 12 | - |
| Response Body | `-tradeunit` | 거래승수 | Number | Y | 21.8 | - |
| Response Body | `-atmgb` | ATM구분(1:ATM2:ITM3:OTM) | String | Y | 1 | - |

## 예제

### Request

```json
{
  "t8455InBlock": {
    "gubun": "NFU"
  }
}
```

### Response

```json
{
  "t8455OutBlock": [
    {
      "hname": "F 2506",
      "shcode": "101W6000",
      "expcode": "KR4101W60000",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F 2509",
      "shcode": "101W9000",
      "expcode": "KR4101W90007",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F 2512",
      "shcode": "101WC000",
      "expcode": "KR4101WC0003",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F 2603",
      "shcode": "A0163000",
      "expcode": "KR4A01630008",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F 2606",
      "shcode": "A0166000",
      "expcode": "KR4A01660005",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F 2612",
      "shcode": "A016C000",
      "expcode": "KR4A016C0004",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F 2712",
      "shcode": "A017C000",
      "expcode": "KR4A017C0003",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F SP 06-2509",
      "shcode": "401W6W9S",
      "expcode": "KR4401W6W9S8",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F SP 06-2512",
      "shcode": "401W6WCS",
      "expcode": "KR4401W6WCS0",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F SP 06-2603",
      "shcode": "401W663S",
      "expcode": "KR4401W663S0",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F SP 06-2606",
      "shcode": "401W666S",
      "expcode": "KR4401W666S3",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F SP 06-2612",
      "shcode": "401W66CS",
      "expcode": "KR4401W66CS7",
      "tradeunit": "250000.00000000",
      "atmgb": ""
    },
    {
      "hname": "F SP 06-2712",
      "shcode": "401W67CS",
      "expcode": "KR4401W67CS5",
      "tradeunit": "250000.00000000",
      "atmgb": ""
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
