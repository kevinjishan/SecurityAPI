---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cdb7e1bc-f7c5-425c-8248-aa83dbb6919f&api_id=0c023f96-5137-48cf-8682-8dd30bbc81be"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "해외주식"
api_id: "0c023f96-5137-48cf-8682-8dd30bbc81be"
api_name: "[해외주식] 실시간 시세"
tr_id: "54afe570-1d0d-4e32-a946-544b6b5ceb5f"
tr_code: "GSH"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/overseas-stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 해외주식 호가 (GSH)

<!-- request_field_count: 4 -->
<!-- response_field_count: 68 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식 |
| API 페이지 | [해외주식] 실시간 시세 |
| TR명 | 해외주식 호가 |
| TR코드 | `GSH` |
| 초당 전송 건수 | - |
| 설명 | 해외주식 주문현황 및 시세정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/overseas-stock` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 18 | Key 종목코드 + 남은 자릿수만큼 공백<br>ex) '82TSLA            ' <br>'82TSLA' + 공백 12자리 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `symbol` | 종목코드 | String | Y | 16 | - |
| Response Body | `loctime` | 현지호가시간 | String | Y | 6 | - |
| Response Body | `kortime` | 한국호가시간 | String | Y | 6 | - |
| Response Body | `offerho1` | 매도호가1 | String | Y | 15.6 | - |
| Response Body | `bidho1` | 매수호가1 | String | Y | 15.6 | - |
| Response Body | `offerrem1` | 매도호가잔량1 | String | Y | 10 | - |
| Response Body | `bidrem1` | 매수호가잔량1 | String | Y | 10 | - |
| Response Body | `offerno1` | 매도호가건수1 | String | Y | 10 | - |
| Response Body | `bidno1` | 매수호가건수1 | String | Y | 10 | - |
| Response Body | `offerho2` | 매도호가2 | String | Y | 15.6 | - |
| Response Body | `bidho2` | 매수호가2 | String | Y | 15.6 | - |
| Response Body | `offerrem2` | 매도호가잔량2 | String | Y | 10 | - |
| Response Body | `bidrem2` | 매수호가잔량2 | String | Y | 10 | - |
| Response Body | `offerno2` | 매도호가건수2 | String | Y | 10 | - |
| Response Body | `bidno2` | 매수호가건수2 | String | Y | 10 | - |
| Response Body | `offerho3` | 매도호가3 | String | Y | 15.6 | - |
| Response Body | `bidho3` | 매수호가3 | String | Y | 15.6 | - |
| Response Body | `offerrem3` | 매도호가잔량3 | String | Y | 10 | - |
| Response Body | `bidrem3` | 매수호가잔량3 | String | Y | 10 | - |
| Response Body | `offerno3` | 매도호가건수3 | String | Y | 10 | - |
| Response Body | `bidno3` | 매수호가건수3 | String | Y | 10 | - |
| Response Body | `offerho4` | 매도호가4 | String | Y | 15.6 | - |
| Response Body | `bidho4` | 매수호가4 | String | Y | 15.6 | - |
| Response Body | `offerrem4` | 매도호가잔량4 | String | Y | 10 | - |
| Response Body | `bidrem4` | 매수호가잔량4 | String | Y | 10 | - |
| Response Body | `offerno4` | 매도호가건수4 | String | Y | 10 | - |
| Response Body | `bidno4` | 매수호가건수4 | String | Y | 10 | - |
| Response Body | `offerho5` | 매도호가5 | String | Y | 15.6 | - |
| Response Body | `bidho5` | 매수호가5 | String | Y | 15.6 | - |
| Response Body | `offerrem5` | 매도호가잔량5 | String | Y | 10 | - |
| Response Body | `bidrem5` | 매수호가잔량5 | String | Y | 10 | - |
| Response Body | `offerno5` | 매도호가건수5 | String | Y | 10 | - |
| Response Body | `bidno5` | 매수호가건수5 | String | Y | 10 | - |
| Response Body | `offerho6` | 매도호가6 | String | Y | 15.6 | - |
| Response Body | `bidho6` | 매수호가6 | String | Y | 15.6 | - |
| Response Body | `offerrem6` | 매도호가잔량6 | String | Y | 10 | - |
| Response Body | `bidrem6` | 매수호가잔량6 | String | Y | 10 | - |
| Response Body | `offerno6` | 매도호가건수6 | String | Y | 10 | - |
| Response Body | `bidno6` | 매수호가건수6 | String | Y | 10 | - |
| Response Body | `offerho7` | 매도호가7 | String | Y | 15.6 | - |
| Response Body | `bidho7` | 매수호가7 | String | Y | 15.6 | - |
| Response Body | `offerrem7` | 매도호가잔량7 | String | Y | 10 | - |
| Response Body | `bidrem7` | 매수호가잔량7 | String | Y | 10 | - |
| Response Body | `offerno7` | 매도호가건수7 | String | Y | 10 | - |
| Response Body | `bidno7` | 매수호가건수7 | String | Y | 10 | - |
| Response Body | `offerho8` | 매도호가8 | String | Y | 15.6 | - |
| Response Body | `bidho8` | 매수호가8 | String | Y | 15.6 | - |
| Response Body | `offerrem8` | 매도호가잔량8 | String | Y | 10 | - |
| Response Body | `bidrem8` | 매수호가잔량8 | String | Y | 10 | - |
| Response Body | `offerno8` | 매도호가건수8 | String | Y | 10 | - |
| Response Body | `bidno8` | 매수호가건수8 | String | Y | 10 | - |
| Response Body | `offerho9` | 매도호가9 | String | Y | 15.6 | - |
| Response Body | `bidho9` | 매수호가9 | String | Y | 15.6 | - |
| Response Body | `offerrem9` | 매도호가잔량9 | String | Y | 10 | - |
| Response Body | `bidrem9` | 매수호가잔량9 | String | Y | 10 | - |
| Response Body | `offerno9` | 매도호가건수9 | String | Y | 10 | - |
| Response Body | `bidno9` | 매수호가건수9 | String | Y | 10 | - |
| Response Body | `offerho10` | 매도호가10 | String | Y | 15.6 | - |
| Response Body | `bidho10` | 매수호가10 | String | Y | 15.6 | - |
| Response Body | `offerrem10` | 매도호가잔량10 | String | Y | 10 | - |
| Response Body | `bidrem10` | 매수호가잔량10 | String | Y | 10 | - |
| Response Body | `offerno10` | 매도호가건수10 | String | Y | 10 | - |
| Response Body | `bidno10` | 매수호가건수10 | String | Y | 10 | - |
| Response Body | `totoffercnt` | 매도호가총건수 | String | Y | 10 | - |
| Response Body | `totbidcnt` | 매수호가총건수 | String | Y | 10 | - |
| Response Body | `totofferrem` | 매도호가총수량 | String | Y | 10 | - |
| Response Body | `totbidrem` | 매수호가총수량 | String | Y | 10 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "토큰",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "GSH",
    "tr_key": "81SOXL            "
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "GSH",
    "tr_key": "81SOXL            "
  },
  "body": {
    "offerho4": "12.2400",
    "symbol": "SOXL",
    "offerho3": "12.2300",
    "offerho6": "12.2600",
    "offerho5": "12.2500",
    "offerno2": "0",
    "offerho8": "12.2800",
    "offerno1": "0",
    "offerho7": "12.2700",
    "offerno4": "0",
    "offerno3": "0",
    "offerho9": "12.2900",
    "offerno6": "0",
    "offerno5": "0",
    "offerno8": "0",
    "offerno7": "0",
    "offerno9": "0",
    "offerno10": "0",
    "bidno10": "0",
    "offerho2": "12.2200",
    "offerho1": "12.2100",
    "offerho10": "12.3000",
    "loctime": "044331",
    "totofferrem": "8418",
    "totbidrem": "12760",
    "offerrem2": "0",
    "bidho5": "12.1600",
    "offerrem3": "0",
    "bidho4": "12.1700",
    "bidno1": "0",
    "offerrem4": "0",
    "bidho7": "12.1400",
    "offerrem5": "0",
    "bidho6": "12.1500",
    "bidno3": "0",
    "bidho9": "12.1200",
    "bidno2": "0",
    "bidho8": "12.1300",
    "bidno5": "0",
    "offerrem1": "8418",
    "bidno4": "0",
    "bidno7": "0",
    "bidno6": "0",
    "bidno9": "0",
    "totoffercnt": "0",
    "bidno8": "0",
    "offerrem6": "0",
    "totbidcnt": "0",
    "offerrem7": "0",
    "offerrem8": "0",
    "offerrem9": "0",
    "bidrem3": "0",
    "bidrem4": "0",
    "bidrem1": "12760",
    "bidrem2": "0",
    "bidrem9": "0",
    "bidho1": "12.2000",
    "bidrem7": "0",
    "bidrem8": "0",
    "bidho3": "12.1800",
    "bidrem5": "0",
    "bidho2": "12.1900",
    "bidrem6": "0",
    "bidrem10": "0",
    "bidho10": "12.1100",
    "kortime": "174331",
    "offerrem10": "0"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
