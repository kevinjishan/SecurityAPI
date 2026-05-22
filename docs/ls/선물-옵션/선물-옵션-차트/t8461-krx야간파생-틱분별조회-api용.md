---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=a9b39b08-25c2-427d-848b-675c6228a92b"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "a9b39b08-25c2-427d-848b-675c6228a92b"
api_name: "[선물/옵션] 차트"
tr_id: "futroptn-0000-0000-0000-0000000t8461"
tr_code: "t8461"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/chart"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# KRX야간파생 틱분별조회(API용) (t8461)

<!-- request_field_count: 11 -->
<!-- response_field_count: 22 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 차트 |
| TR명 | KRX야간파생 틱분별조회(API용) |
| TR코드 | `t8461` |
| 초당 전송 건수 | 1 |
| 설명 | 주간/야간 선물옵션 기간별 차트를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/futureoption/chart` |
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
| Request Body | `t8461InBlock` | t8461InBlock | Object | Y | - | - |
| Request Body | `-focode` | 단축코드 | String | Y | 8 | - |
| Request Body | `-cgubun` | 챠트구분 | String | Y | 1 | T:틱차트<br>B:분차트 |
| Request Body | `-bgubun` | 분구분 | Object | Y | 3 | 차트구분이 'B'일때만 체크<br>0: 30초<br>0초과 : n분 |
| Request Body | `-cnt` | 조회건수 | Object | Y | 3 | - |

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
| Response Body | `t8461OutBlock1` | t8461OutBlock1 | Object Array | Y | - | - |
| Response Body | `-chetime` | 시간 | String | Y | 10 | - |
| Response Body | `-price` | 현재가 | Number | Y | 6.2 | - |
| Response Body | `-sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `-change` | 전일대비 | Number | Y | 6.2 | - |
| Response Body | `-open` | 시가 | Number | Y | 6.2 | - |
| Response Body | `-high` | 고가 | Number | Y | 6.2 | - |
| Response Body | `-low` | 저가 | Number | Y | 6.2 | - |
| Response Body | `-volume` | 거래량 | Number | Y | 12 | - |
| Response Body | `-cvolume` | 체결수량 | Number | Y | 8 | - |
| Response Body | `-s_mschecnt` | 매수순간체결건수 | Number | Y | 8 | - |
| Response Body | `-s_mdchecnt` | 매도순간체결건수 | Number | Y | 8 | - |
| Response Body | `-ss_mschecnt` | 순매수순간체결건수 | Number | Y | 8 | - |
| Response Body | `-s_mschevol` | 매수순간체결량 | Number | Y | 12 | - |
| Response Body | `-s_mdchevol` | 매도순간체결량 | Number | Y | 12 | - |
| Response Body | `-ss_mschevol` | 순매수순간체결량 | Number | Y | 12 | - |
| Response Body | `-chdegvol` | 체결강도(거래량) | Number | Y | 8.2 | - |
| Response Body | `-chdegcnt` | 체결강도(건수) | Number | Y | 8.2 | - |

## 예제

### Request

```json
{
  "t8461InBlock": {
    "focode": "101W6000",
    "cgubun": "2",
    "bgubun": "0",
    "cnt": 20
  }
}
```

### Response

```json
{
  "t8461OutBlock1": [
    {
      "chetime": "161600",
      "price": "436.40",
      "sign": "2",
      "change": "30.25",
      "open": "436.00",
      "high": "436.45",
      "low": "436.00",
      "volume": "12436",
      "cvolume": 267,
      "s_mschecnt": 3,
      "s_mdchecnt": 22,
      "ss_mschecnt": -19,
      "s_mschevol": "76",
      "s_mdchevol": "191",
      "ss_mschevol": "-115",
      "chdegvol": "305.72",
      "chdegcnt": "155.87"
    },
    {
      "chetime": "161530",
      "price": "436.00",
      "sign": "2",
      "change": "29.85",
      "open": "435.85",
      "high": "436.10",
      "low": "435.40",
      "volume": "12169",
      "cvolume": 496,
      "s_mschecnt": 45,
      "s_mdchecnt": 16,
      "ss_mschecnt": 29,
      "s_mschevol": "385",
      "s_mdchevol": "111",
      "ss_mschevol": "274",
      "chdegvol": "326.75",
      "chdegcnt": "169.78"
    },
    {
      "chetime": "161500",
      "price": "435.35",
      "sign": "2",
      "change": "29.20",
      "open": "435.55",
      "high": "435.95",
      "low": "435.35",
      "volume": "11673",
      "cvolume": 228,
      "s_mschecnt": 8,
      "s_mdchecnt": 6,
      "ss_mschecnt": 2,
      "s_mschevol": "206",
      "s_mdchevol": "22",
      "ss_mschevol": "184",
      "chdegvol": "325.78",
      "chdegcnt": "161.24"
    },
    {
      "chetime": "161430",
      "price": "435.50",
      "sign": "2",
      "change": "29.35",
      "open": "435.35",
      "high": "435.50",
      "low": "435.35",
      "volume": "11445",
      "cvolume": 1127,
      "s_mschecnt": 12,
      "s_mdchecnt": 5,
      "ss_mschecnt": 7,
      "s_mschevol": "1102",
      "s_mdchevol": "25",
      "ss_mschevol": "1077",
      "chdegvol": "319.89",
      "chdegcnt": "162.07"
    },
    {
      "chetime": "161400",
      "price": "435.30",
      "sign": "2",
      "change": "29.15",
      "open": "435.25",
      "high": "435.30",
      "low": "435.25",
      "volume": "10318",
      "cvolume": 836,
      "s_mschecnt": 87,
      "s_mdchecnt": 0,
      "ss_mschecnt": 87,
      "s_mschevol": "836",
      "s_mdchevol": "0",
      "ss_mschevol": "836",
      "chdegvol": "274.61",
      "chdegcnt": "160.10"
    },
    {
      "chetime": "161330",
      "price": "435.30",
      "sign": "2",
      "change": "29.15",
      "open": "435.25",
      "high": "435.30",
      "low": "435.25",
      "volume": "9482",
      "cvolume": 172,
      "s_mschecnt": 18,
      "s_mdchecnt": 3,
      "ss_mschecnt": 15,
      "s_mschevol": "167",
      "s_mdchevol": "5",
      "ss_mschevol": "162",
      "chdegvol": "237.57",
      "chdegcnt": "116.16"
    },
    {
      "chetime": "161300",
      "price": "435.20",
      "sign": "2",
      "change": "29.05",
      "open": "435.00",
      "high": "435.20",
      "low": "434.95",
      "volume": "9310",
      "cvolume": 546,
      "s_mschecnt": 8,
      "s_mdchecnt": 3,
      "ss_mschecnt": 5,
      "s_mschevol": "536",
      "s_mdchevol": "10",
      "ss_mschevol": "526",
      "chdegvol": "230.68",
      "chdegcnt": "108.72"
    },
    {
      "chetime": "161230",
      "price": "435.00",
      "sign": "2",
      "change": "28.85",
      "open": "415.90",
      "high": "435.00",
      "low": "415.90",
      "volume": "8764",
      "cvolume": 1482,
      "s_mschecnt": 7,
      "s_mdchecnt": 1,
      "ss_mschecnt": 6,
      "s_mschevol": "1481",
      "s_mdchevol": "1",
      "ss_mschevol": "1480",
      "chdegvol": "207.81",
      "chdegcnt": "106.25"
    },
    {
      "chetime": "161200",
      "price": "424.00",
      "sign": "2",
      "change": "17.85",
      "open": "424.00",
      "high": "424.00",
      "low": "424.00",
      "volume": "7282",
      "cvolume": 0,
      "s_mschecnt": 0,
      "s_mdchecnt": 0,
      "ss_mschecnt": 0,
      "s_mschevol": "0",
      "s_mdchevol": "0",
      "ss_mschevol": "0",
      "chdegvol": "141.81",
      "chdegcnt": "103.14"
    },
    {
      "chetime": "161130",
      "price": "424.00",
      "sign": "2",
      "change": "17.85",
      "open": "424.00",
      "high": "424.00",
      "low": "423.70",
      "volume": "7282",
      "cvolume": 83,
      "s_mschecnt": 2,
      "s_mdchecnt": 8,
      "ss_mschecnt": -6,
      "s_mschevol": "9",
      "s_mdchevol": "74",
      "ss_mschevol": "-65",
      "chdegvol": "141.81",
      "chdegcnt": "103.14"
    },
    {
      "chetime": "161100",
      "price": "423.70",
      "sign": "2",
      "change": "17.55",
      "open": "424.00",
      "high": "424.00",
      "low": "423.70",
      "volume": "7199",
      "cvolume": 26,
      "s_mschecnt": 0,
      "s_mdchecnt": 4,
      "ss_mschecnt": -4,
      "s_mschevol": "0",
      "s_mdchevol": "26",
      "ss_mschevol": "-26",
      "chdegvol": "146.24",
      "chdegcnt": "106.56"
    },
    {
      "chetime": "161030",
      "price": "430.00",
      "sign": "2",
      "change": "23.85",
      "open": "423.70",
      "high": "430.00",
      "low": "423.70",
      "volume": "7173",
      "cvolume": 102,
      "s_mschecnt": 1,
      "s_mdchecnt": 2,
      "ss_mschecnt": -1,
      "s_mschevol": "100",
      "s_mdchevol": "2",
      "ss_mschevol": "98",
      "chdegvol": "148.01",
      "chdegcnt": "108.94"
    },
    {
      "chetime": "161000",
      "price": "415.60",
      "sign": "2",
      "change": "9.45",
      "open": "407.50",
      "high": "415.60",
      "low": "407.50",
      "volume": "7071",
      "cvolume": 107,
      "s_mschecnt": 2,
      "s_mdchecnt": 23,
      "ss_mschecnt": -21,
      "s_mschevol": "6",
      "s_mdchevol": "101",
      "ss_mschevol": "-95",
      "chdegvol": "143.48",
      "chdegcnt": "109.60"
    },
    {
      "chetime": "160930",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "open": "407.55",
      "high": "407.55",
      "low": "407.50",
      "volume": "6964",
      "cvolume": 39,
      "s_mschecnt": 0,
      "s_mdchecnt": 39,
      "ss_mschecnt": -39,
      "s_mschevol": "0",
      "s_mdchevol": "39",
      "ss_mschevol": "-39",
      "chdegvol": "150.29",
      "chdegcnt": "124.68"
    },
    {
      "chetime": "160900",
      "price": "414.25",
      "sign": "2",
      "change": "8.10",
      "open": "407.60",
      "high": "414.35",
      "low": "407.60",
      "volume": "6925",
      "cvolume": 91,
      "s_mschecnt": 5,
      "s_mdchecnt": 0,
      "ss_mschecnt": 5,
      "s_mschevol": "91",
      "s_mdchevol": "0",
      "ss_mschevol": "91",
      "chdegvol": "153.23",
      "chdegcnt": "166.96"
    },
    {
      "chetime": "160830",
      "price": "407.60",
      "sign": "2",
      "change": "1.45",
      "open": "407.60",
      "high": "407.60",
      "low": "407.60",
      "volume": "6834",
      "cvolume": 5,
      "s_mschecnt": 5,
      "s_mdchecnt": 0,
      "ss_mschecnt": 5,
      "s_mschevol": "5",
      "s_mdchevol": "0",
      "ss_mschevol": "5",
      "chdegvol": "148.67",
      "chdegcnt": "162.61"
    },
    {
      "chetime": "160800",
      "price": "407.60",
      "sign": "2",
      "change": "1.45",
      "open": "414.35",
      "high": "414.35",
      "low": "407.55",
      "volume": "6829",
      "cvolume": 501,
      "s_mschecnt": 6,
      "s_mdchecnt": 6,
      "ss_mschecnt": 0,
      "s_mschevol": "6",
      "s_mdchevol": "495",
      "ss_mschevol": "-489",
      "chdegvol": "148.42",
      "chdegcnt": "158.26"
    },
    {
      "chetime": "160730",
      "price": "408.25",
      "sign": "2",
      "change": "2.10",
      "open": "407.90",
      "high": "414.35",
      "low": "407.65",
      "volume": "6328",
      "cvolume": 1660,
      "s_mschecnt": 16,
      "s_mdchecnt": 5,
      "ss_mschecnt": 11,
      "s_mschevol": "1628",
      "s_mdchevol": "32",
      "ss_mschevol": "1596",
      "chdegvol": "196.88",
      "chdegcnt": "161.47"
    },
    {
      "chetime": "160700",
      "price": "407.85",
      "sign": "2",
      "change": "1.70",
      "open": "407.80",
      "high": "407.85",
      "low": "407.75",
      "volume": "4668",
      "cvolume": 231,
      "s_mschecnt": 4,
      "s_mdchecnt": 1,
      "ss_mschecnt": 3,
      "s_mschevol": "226",
      "s_mdchevol": "5",
      "ss_mschevol": "221",
      "chdegvol": "90.56",
      "chdegcnt": "153.85"
    },
    {
      "chetime": "160630",
      "price": "407.80",
      "sign": "2",
      "change": "1.65",
      "open": "407.80",
      "high": "407.80",
      "low": "407.80",
      "volume": "4437",
      "cvolume": 12,
      "s_mschecnt": 4,
      "s_mdchecnt": 0,
      "ss_mschecnt": 4,
      "s_mschevol": "12",
      "s_mdchevol": "0",
      "ss_mschevol": "12",
      "chdegvol": "75.46",
      "chdegcnt": "151.46"
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
