---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "futroptn-0000-0000-0000-000000000DBM"
tr_code: "DBM"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KRX야간파생 투자자매매현황 (DBM)

<!-- request_field_count: 4 -->
<!-- response_field_count: 12 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | KRX야간파생 투자자매매현황 |
| TR코드 | `DBM` |
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
| Request Header | `token` | 접근토큰 | String | Y | 1000 | - |
| Request Header | `tr_type` | 거래 Type | String | Y | 1 | - |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래 CD | String | Y | 3 | - |
| Request Body | `tr_key` | 단축코드 | String | N | 5 | ※ 실시간(DBM,DBT) 키값 - 5자리<br> - 시간대(tm_rng) + 선옵구분(fot_clsf_cd) + 기초자산(bsc_asts_id)<br> - ex) 주간 코스피200선물 실시간키값 : DFK2I<br>시간대(tm_rng)<br>D : 주간<br>N : 야간<br>U : 통합<br>선옵구분(fot_clsf_cd)<br>F : 선물<br>C : Call옵션<br>P : Put옵션<br>S : 스프레드<br>기초자산ID(bsc_asts_id)<br>K2I : KP200선물/옵션<br>MKI : 미니KP200선물/옵션<br>KQI : 코스닥150선물/옵션<br>WKM : 위클리옵션-월<br>WKI : 위클리옵션-목<br>BM3 : 국채3년선물<br>BMA : 국채10년선물<br>USD : 미국달러선물 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | - |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `tjjcode` | 투자자코드 | String | Y | 4 | - |
| Response Body | `tjjtime` | 수신시간 | String | Y | 8 | - |
| Response Body | `msvolume` | 매수거래량 | String | Y | 8 | - |
| Response Body | `mdvolume` | 매도거래량 | String | Y | 8 | - |
| Response Body | `msvol` | 거래량순매수 | String | Y | 8 | - |
| Response Body | `p_msvol` | 거래량순매수직전대비 | String | Y | 8 | - |
| Response Body | `msvalue` | 매수거래대금 | String | Y | 6 | - |
| Response Body | `mdvalue` | 매도거래대금 | String | Y | 6 | - |
| Response Body | `msval` | 거래대금순매수 | String | Y | 6 | - |
| Response Body | `p_msval` | 거래대금순매수직전대비 | String | Y | 6 | - |
| Response Body | `fottjjcode` | 파생상품투자자코드 | String | Y | 5 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "토큰",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "DBM",
    "tr_key": "UFK2I"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "DBM",
    "tr_key": "UFK2"
  },
  "body": {
    "p_msval": "-0",
    "tjjtime": "2003300",
    "p_msvol": "0",
    "mdvalue": "12",
    "fottjjcode": "？UFK2",
    "msvolume": "6",
    "tjjcode": "I000",
    "msvalue": "6",
    "mdvolume": "13",
    "msvol": "-6",
    "msval": "-6"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
