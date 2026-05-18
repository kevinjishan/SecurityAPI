---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=9f467798-6ce6-4d31-ab93-5a0e2860f89f"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "선물/옵션"
api_id: "9f467798-6ce6-4d31-ab93-5a0e2860f89f"
api_name: "[선물/옵션] 시세"
tr_id: "futroptn-0000-0000-0000-0000000t8457"
tr_code: "t8457"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/market-data"
content_type: "application/json; charset=UTF-8"
rate_limit: "10"
auth_required: true
---

# KRX야간파생 호가조회(API용) (t8457)

<!-- request_field_count: 8 -->
<!-- response_field_count: 48 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 시세 |
| TR명 | KRX야간파생 호가조회(API용) |
| TR코드 | `t8457` |
| 초당 전송 건수 | 10 |
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
| Request Body | `t8457InBlock` | t8457InBlock | Object | Y | - | - |
| Request Body | `-shcode` | 단축코드 | String | Y | 8 | - |

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
| Response Body | `t8457OutBlock` | t8457OutBlock | Object | Y | - | - |
| Response Body | `-hname` | 종목명 | String | Y | 20 | - |
| Response Body | `-price` | 현재가 | Number | Y | 6.2 | - |
| Response Body | `-sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `-change` | 전일대비 | Number | Y | 6.2 | - |
| Response Body | `-diff` | 등락율 | Number | Y | 6.2 | - |
| Response Body | `-volume` | 거래량 | Number | Y | 12 | - |
| Response Body | `-jnilclose` | 전일종가 | Number | Y | 6.2 | - |
| Response Body | `-offerho1` | 매도호가1 | Number | Y | 6.2 | - |
| Response Body | `-bidho1` | 매수호가1 | Number | Y | 6.2 | - |
| Response Body | `-offerrem1` | 매도호가수량1 | Number | Y | 8 | - |
| Response Body | `-bidrem1` | 매수호가수량1 | Number | Y | 8 | - |
| Response Body | `-dcnt1` | 매도호가건수1 | Number | Y | 8 | - |
| Response Body | `-scnt1` | 매수호가건수1 | Number | Y | 8 | - |
| Response Body | `-offerho2` | 매도호가2 | Number | Y | 6.2 | - |
| Response Body | `-bidho2` | 매수호가2 | Number | Y | 6.2 | - |
| Response Body | `-offerrem2` | 매도호가수량2 | Number | Y | 8 | - |
| Response Body | `-bidrem2` | 매수호가수량2 | Number | Y | 8 | - |
| Response Body | `-dcnt2` | 매도호가건수2 | Number | Y | 8 | - |
| Response Body | `-scnt2` | 매수호가건수2 | Number | Y | 8 | - |
| Response Body | `-offerho3` | 매도호가3 | Number | Y | 6.2 | - |
| Response Body | `-bidho3` | 매수호가3 | Number | Y | 6.2 | - |
| Response Body | `-offerrem3` | 매도호가수량3 | Number | Y | 8 | - |
| Response Body | `-bidrem3` | 매수호가수량3 | Number | Y | 8 | - |
| Response Body | `-dcnt3` | 매도호가건수3 | Number | Y | 8 | - |
| Response Body | `-scnt3` | 매수호가건수3 | Number | Y | 8 | - |
| Response Body | `-offerho4` | 매도호가4 | Number | Y | 6.2 | - |
| Response Body | `-bidho4` | 매수호가4 | Number | Y | 6.2 | - |
| Response Body | `-offerrem4` | 매도호가수량4 | Number | Y | 8 | - |
| Response Body | `-bidrem4` | 매수호가수량4 | Number | Y | 8 | - |
| Response Body | `-dcnt4` | 매도호가건수4 | Number | Y | 8 | - |
| Response Body | `-scnt4` | 매수호가건수4 | Number | Y | 8 | - |
| Response Body | `-offerho5` | 매도호가5 | Number | Y | 6.2 | - |
| Response Body | `-bidho5` | 매수호가5 | Number | Y | 6.2 | - |
| Response Body | `-offerrem5` | 매도호가수량5 | Number | Y | 8 | - |
| Response Body | `-bidrem5` | 매수호가수량5 | Number | Y | 8 | - |
| Response Body | `-dcnt5` | 매도호가건수5 | Number | Y | 8 | - |
| Response Body | `-scnt5` | 매수호가건수5 | Number | Y | 8 | - |
| Response Body | `-dvol` | 매도호가총수량 | Number | Y | 8 | - |
| Response Body | `-svol` | 매수호가총수량 | Number | Y | 8 | - |
| Response Body | `-toffernum` | 총매도호가건수 | Number | Y | 8 | - |
| Response Body | `-tbidnum` | 총매수호가건수 | Number | Y | 8 | - |
| Response Body | `-time` | 수신시간 | String | Y | 6 | - |
| Response Body | `-shcode` | 단축코드 | String | Y | 8 | - |

## 예제

### Request

```json
{
  "t8457InBlock": {
    "shcode": "101W6000"
  }
}
```

### Response

```json
{
  "t8457OutBlock": {
    "hname": "코스피200 F 202506",
    "price": "407.50",
    "sign": "2",
    "change": "1.35",
    "diff": "0.33",
    "volume": 6969,
    "jnilclose": "406.15",
    "offerho1": "410.00",
    "bidho1": "407.50",
    "offerrem1": 5,
    "bidrem1": 75,
    "dcnt1": 1,
    "scnt1": 4,
    "offerho2": "430.00",
    "bidho2": "406.50",
    "offerrem2": 500,
    "bidrem2": 11,
    "dcnt2": 1,
    "scnt2": 2,
    "offerho3": "435.00",
    "bidho3": "406.45",
    "offerrem3": 500,
    "bidrem3": 2,
    "dcnt3": 1,
    "scnt3": 2,
    "offerho4": "0.00",
    "bidho4": "406.40",
    "offerrem4": 0,
    "bidrem4": 370,
    "dcnt4": 0,
    "scnt4": 3,
    "offerho5": "0.00",
    "bidho5": "406.30",
    "offerrem5": 0,
    "bidrem5": 10,
    "dcnt5": 0,
    "scnt5": 1,
    "dvol": 1005,
    "svol": 789,
    "toffernum": 3,
    "tbidnum": 122,
    "time": "160931",
    "shcode": "101W6000"
  },
  "rsp_cd": "00000",
  "rsp_msg": "조회완료"
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
