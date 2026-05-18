---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=9f467798-6ce6-4d31-ab93-5a0e2860f89f"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "선물/옵션"
api_id: "9f467798-6ce6-4d31-ab93-5a0e2860f89f"
api_name: "[선물/옵션] 시세"
tr_id: "futroptn-0000-0000-0000-0000000t8458"
tr_code: "t8458"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/market-data"
content_type: "application/json; charset=UTF-8"
rate_limit: "2"
auth_required: true
---

# KRX야간파생 시간대별체결(API용) (t8458)

<!-- request_field_count: 12 -->
<!-- response_field_count: 22 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 시세 |
| TR명 | KRX야간파생 시간대별체결(API용) |
| TR코드 | `t8458` |
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
| Request Body | `t8458InBlock` | t8458InBlock | Object | Y | - | - |
| Request Body | `-focode` | 단축코드 | String | Y | 8 | - |
| Request Body | `-cvolume` | 특이거래량 | Number | Y | 12 | - |
| Request Body | `-stime` | 시작시간 | String | Y | 4 | - |
| Request Body | `-etime` | 종료시간 | String | Y | 4 | - |
| Request Body | `-cts_time` | 시간CTS | String | Y | 10 | - |

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
| Response Body | `t8458OutBlock` | t8458OutBlock | Object | Y | - | - |
| Response Body | `-cts_time` | 시간CTS | String | Y | 10 | - |
| Response Body | `t8458OutBlock1` | t8458OutBlock1 | Object Array | Y | - | - |
| Response Body | `-chetime` | 시간 | String | Y | 10 | - |
| Response Body | `-price` | 현재가 | Number | Y | 6.2 | - |
| Response Body | `-sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `-change` | 전일대비 | Number | Y | 6.2 | - |
| Response Body | `-cvolume` | 체결수량 | Number | Y | 8 | - |
| Response Body | `-chdegree` | 체결강도 | Number | Y | 8.2 | - |
| Response Body | `-offerho` | 매도호가 | Number | Y | 6.2 | - |
| Response Body | `-bidho` | 매수호가 | Number | Y | 6.2 | - |
| Response Body | `-volume` | 거래량 | Number | Y | 12 | - |
| Response Body | `-n_msvolume` | 누적매수체결량 | Number | Y | 12 | - |
| Response Body | `-n_mdvolume` | 누적매도체결량 | Number | Y | 12 | - |
| Response Body | `-s_msvolume` | 누적순매수체결량 | Number | Y | 12 | - |
| Response Body | `-n_mschecnt` | 누적매수체결건수 | Number | Y | 8 | - |
| Response Body | `-n_mdchecnt` | 누적매도체결건수 | Number | Y | 8 | - |
| Response Body | `-s_mschecnt` | 누적순매수체결건수 | Number | Y | 8 | - |

## 예제

### Request

```json
{
  "t8458InBlock": {
    "focode": "101W6000",
    "cvolume": 0,
    "stime": "",
    "etime": "",
    "cts_time": ""
  }
}
```

### Response

```json
{
  "t8458OutBlock": {
    "cts_time": "1609311813"
  },
  "t8458OutBlock1": [
    {
      "chetime": "1609471992",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 9,
      "chdegree": "144.55",
      "offerho": "407.50",
      "bidho": "406.50",
      "volume": "7045",
      "n_msvolume": "3063",
      "n_mdvolume": "2119",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 174,
      "s_mschecnt": 18
    },
    {
      "chetime": "1609464045",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 10,
      "chdegree": "145.17",
      "offerho": "407.95",
      "bidho": "407.50",
      "volume": "7036",
      "n_msvolume": "3063",
      "n_mdvolume": "2110",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 173,
      "s_mschecnt": 19
    },
    {
      "chetime": "1609460283",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 10,
      "chdegree": "145.86",
      "offerho": "407.95",
      "bidho": "407.50",
      "volume": "7026",
      "n_msvolume": "3063",
      "n_mdvolume": "2100",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 172,
      "s_mschecnt": 20
    },
    {
      "chetime": "1609455185",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 10,
      "chdegree": "146.56",
      "offerho": "407.95",
      "bidho": "407.50",
      "volume": "7016",
      "n_msvolume": "3063",
      "n_mdvolume": "2090",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 171,
      "s_mschecnt": 21
    },
    {
      "chetime": "1609446411",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 10,
      "chdegree": "147.26",
      "offerho": "407.95",
      "bidho": "407.50",
      "volume": "7006",
      "n_msvolume": "3063",
      "n_mdvolume": "2080",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 170,
      "s_mschecnt": 22
    },
    {
      "chetime": "1609442580",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 9,
      "chdegree": "147.97",
      "offerho": "407.90",
      "bidho": "407.50",
      "volume": "6996",
      "n_msvolume": "3063",
      "n_mdvolume": "2070",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 169,
      "s_mschecnt": 23
    },
    {
      "chetime": "1609370811",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 10,
      "chdegree": "148.62",
      "offerho": "407.90",
      "bidho": "407.50",
      "volume": "6987",
      "n_msvolume": "3063",
      "n_mdvolume": "2061",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 168,
      "s_mschecnt": 24
    },
    {
      "chetime": "1609327291",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "149.34",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6977",
      "n_msvolume": "3063",
      "n_mdvolume": "2051",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 167,
      "s_mschecnt": 25
    },
    {
      "chetime": "1609326459",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "149.41",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6976",
      "n_msvolume": "3063",
      "n_mdvolume": "2050",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 166,
      "s_mschecnt": 26
    },
    {
      "chetime": "1609324709",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "149.49",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6975",
      "n_msvolume": "3063",
      "n_mdvolume": "2049",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 165,
      "s_mschecnt": 27
    },
    {
      "chetime": "1609323787",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "149.56",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6974",
      "n_msvolume": "3063",
      "n_mdvolume": "2048",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 164,
      "s_mschecnt": 28
    },
    {
      "chetime": "1609321985",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "149.63",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6973",
      "n_msvolume": "3063",
      "n_mdvolume": "2047",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 163,
      "s_mschecnt": 29
    },
    {
      "chetime": "1609321137",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "149.71",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6972",
      "n_msvolume": "3063",
      "n_mdvolume": "2046",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 162,
      "s_mschecnt": 30
    },
    {
      "chetime": "1609319271",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "149.78",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6971",
      "n_msvolume": "3063",
      "n_mdvolume": "2045",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 161,
      "s_mschecnt": 31
    },
    {
      "chetime": "1609318470",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "149.85",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6970",
      "n_msvolume": "3063",
      "n_mdvolume": "2044",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 160,
      "s_mschecnt": 32
    },
    {
      "chetime": "1609316740",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "149.93",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6969",
      "n_msvolume": "3063",
      "n_mdvolume": "2043",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 159,
      "s_mschecnt": 33
    },
    {
      "chetime": "1609315925",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "150.00",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6968",
      "n_msvolume": "3063",
      "n_mdvolume": "2042",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 158,
      "s_mschecnt": 34
    },
    {
      "chetime": "1609314037",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "150.07",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6967",
      "n_msvolume": "3063",
      "n_mdvolume": "2041",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 157,
      "s_mschecnt": 35
    },
    {
      "chetime": "1609313226",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "150.15",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6966",
      "n_msvolume": "3063",
      "n_mdvolume": "2040",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 156,
      "s_mschecnt": 36
    },
    {
      "chetime": "1609311813",
      "price": "407.50",
      "sign": "2",
      "change": "1.35",
      "cvolume": 1,
      "chdegree": "150.22",
      "offerho": "410.00",
      "bidho": "407.50",
      "volume": "6965",
      "n_msvolume": "3063",
      "n_mdvolume": "2039",
      "s_msvolume": "0",
      "n_mschecnt": 192,
      "n_mdchecnt": 155,
      "s_mschecnt": 37
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
