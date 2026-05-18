---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=9f467798-6ce6-4d31-ab93-5a0e2860f89f"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "선물/옵션"
api_id: "9f467798-6ce6-4d31-ab93-5a0e2860f89f"
api_name: "[선물/옵션] 시세"
tr_id: "futroptn-0000-0000-0000-0000000t8456"
tr_code: "t8456"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/market-data"
content_type: "application/json; charset=UTF-8"
rate_limit: "10"
auth_required: true
---

# KRX야간파생 시세조회(API용) (t8456)

<!-- request_field_count: 8 -->
<!-- response_field_count: 46 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 시세 |
| TR명 | KRX야간파생 시세조회(API용) |
| TR코드 | `t8456` |
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
| Request Body | `t8456InBlock` | t8456InBlock | Object | Y | - | - |
| Request Body | `-focode` | 단축코드 | String | Y | 8 | - |

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
| Response Body | `t8456OutBlock` | t8456OutBlock | Object | Y | - | - |
| Response Body | `-hname` | 한글명 | String | Y | 20 | - |
| Response Body | `-price` | 현재가 | Number | Y | 6.2 | - |
| Response Body | `-sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `-change` | 전일대비 | Number | Y | 6.2 | - |
| Response Body | `-jnilclose` | 전일종가 | Number | Y | 6.2 | - |
| Response Body | `-diff` | 등락율 | Number | Y | 6.2 | - |
| Response Body | `-volume` | 거래량 | Number | Y | 12 | - |
| Response Body | `-value` | 거래대금 | Number | Y | 12 | - |
| Response Body | `-open` | 시가 | Number | Y | 6.2 | - |
| Response Body | `-high` | 고가 | Number | Y | 6.2 | - |
| Response Body | `-low` | 저가 | Number | Y | 6.2 | - |
| Response Body | `-recprice` | 기준가 | Number | Y | 6.2 | - |
| Response Body | `-theoryprice` | 이론가 | Number | Y | 6.2 | - |
| Response Body | `-actprice` | 행사가 | Number | Y | 6.2 | - |
| Response Body | `-impv` | 내재가치 | Number | Y | 6.2 | - |
| Response Body | `-timevl` | 시간가치 | Number | Y | 6.2 | - |
| Response Body | `-kospijisu` | KOSPI200지수 | Number | Y | 6.2 | - |
| Response Body | `-kospisign` | KOSPI200전일대비구분 | String | Y | 1 | - |
| Response Body | `-kospichange` | KOSPI200전일대비 | Number | Y | 6.2 | - |
| Response Body | `-kospidiff` | KOSPI200등락율 | Number | Y | 6.2 | - |
| Response Body | `-cmeprice` | CME야간선물현재가 | Number | Y | 6.2 | - |
| Response Body | `-cmesign` | CME야간선물전일대비구분 | String | Y | 1 | - |
| Response Body | `-cmechange` | CME야간선물전일대비 | Number | Y | 6.2 | - |
| Response Body | `-cmediff` | CME야간선물등락율 | Number | Y | 6.2 | - |
| Response Body | `-cmefocode` | CME야간선물종목코드 | String | Y | 8 | - |
| Response Body | `-uplmtprice` | 정규장적용상한가 | Number | Y | 6.2 | - |
| Response Body | `-dnlmtprice` | 정규장적용하한가 | Number | Y | 6.2 | - |
| Response Body | `-focode` | 단축코드 | String | Y | 8 | - |
| Response Body | `-yeprice` | 예상체결가 | Number | Y | 6.2 | - |
| Response Body | `-ysign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `-ychange` | 전일대비 | Number | Y | 6.2 | - |
| Response Body | `-ydiff` | 등락율 | Number | Y | 6.2 | - |
| Response Body | `-danhochk` | 단일가호가여부 | String | Y | 1 | - |
| Response Body | `-jnilvolume` | 전일거래량 | Number | Y | 12 | - |
| Response Body | `-jnilvalue` | 전일거래대금 | Number | Y | 12 | - |
| Response Body | `-uplmtprice_3rd` | 정규장3단계상한가 | Number | Y | 6.2 | - |
| Response Body | `-dnlmtprice_3rd` | 정규장3단계하한가 | Number | Y | 6.2 | - |
| Response Body | `-ndv_uplmtprice` | 야간장_적용상한가 | Number | Y | 6.2 | - |
| Response Body | `-ndv_dnlmtprice` | 야간장_적용하한가 | Number | Y | 6.2 | - |
| Response Body | `-ndv_rt_uplmtprice` | 야간장_실시간상한가 | Number | Y | 6.2 | - |
| Response Body | `-ndv_rt_dnlmtprice` | 야간장_실시간하한가 | Number | Y | 6.2 | - |

## 예제

### Request

```json
{
  "t8456InBlock": {
    "focode": "101W9000"
  }
}
```

### Response

```json
{
  "t8456OutBlock": {
    "hname": "코스피200 F 202509",
    "price": "424.70",
    "sign": "5",
    "change": "0.70",
    "jnilclose": "425.40",
    "diff": "-0.16",
    "volume": 11275,
    "value": 1196821488,
    "open": "425.05",
    "high": "425.30",
    "low": "423.60",
    "recprice": "425.40",
    "theoryprice": "0",
    "actprice": "0.00",
    "impv": "0.00",
    "timevl": "-3.97",
    "kospijisu": "428.67",
    "kospisign": "2",
    "kospichange": "4.26",
    "kospidiff": "1.00",
    "cmeprice": "424.70",
    "cmesign": "5",
    "cmechange": "0.70",
    "cmediff": "-0.16",
    "cmefocode": "101W9000",
    "uplmtprice": "459.40",
    "dnlmtprice": "391.40",
    "focode": "101W9000",
    "yeprice": "424.70",
    "ysign": "5",
    "ychange": "0.70",
    "ydiff": "-0.16",
    "danhochk": "0",
    "jnilvolume": 15296,
    "jnilvalue": 1621978500,
    "uplmtprice_3rd": "510.45",
    "dnlmtprice_3rd": "340.35",
    "ndv_uplmtprice": "459.40",
    "ndv_dnlmtprice": "391.40",
    "ndv_rt_uplmtprice": "459.40",
    "ndv_rt_dnlmtprice": "391.40"
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
