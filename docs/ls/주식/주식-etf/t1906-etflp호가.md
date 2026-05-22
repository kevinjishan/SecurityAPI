---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=30b6dfd6-b0bd-4e63-a510-7d5d94edc740"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "30b6dfd6-b0bd-4e63-a510-7d5d94edc740"
api_name: "[주식] ETF"
tr_id: "f432s27u-5bdd-b6h7-y62f-nh7qwcli3xop"
tr_code: "t1906"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/stock/etf"
content_type: "application/json; charset=UTF-8"
rate_limit: "10"
auth_required: true
---

# ETFLP호가 (t1906)

<!-- request_field_count: 8 -->
<!-- response_field_count: 114 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] ETF |
| TR명 | ETFLP호가 |
| TR코드 | `t1906` |
| 초당 전송 건수 | 10 |
| 설명 | ETF 시세 및 종목별정보를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/stock/etf` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter |
| Request Header | `tr_cd` | 거래 CD | String | Y | 10 | LS증권 거래코드 |
| Request Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부<br>Y:연속○<br>N:연속× |
| Request Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | Y | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `t1906InBlock` | t1906InBlock | Object | Y | - | - |
| Request Body | `-shcode` | 단축코드 | String | Y | 6 | - |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Response Header | `tr_cd` | 거래 CD | String | Y | 10 | LS증권 거래코드 |
| Response Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부<br>Y:연속○<br>N:연속× |
| Response Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `t1906OutBlock` | t1906OutBlock | Object | Y | - | - |
| Response Body | `-hname` | 한글명 | String | Y | 20 | - |
| Response Body | `-price` | 현재가 | Number | Y | 8 | - |
| Response Body | `-sign` | 전일대비구분 | String | Y | 1 | - |
| Response Body | `-change` | 전일대비 | Number | Y | 8 | - |
| Response Body | `-diff` | 등락율 | Number | Y | 6.2 | - |
| Response Body | `-volume` | 누적거래량 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem1` | LP매도호가수량1 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem1` | LP매수호가수량1 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem2` | LP매도호가수량2 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem2` | LP매수호가수량2 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem3` | LP매도호가수량3 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem3` | LP매수호가수량3 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem4` | LP매도호가수량4 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem4` | LP매수호가수량4 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem5` | LP매도호가수량5 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem5` | LP매수호가수량5 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem6` | LP매도호가수량6 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem6` | LP매수호가수량6 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem7` | LP매도호가수량7 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem7` | LP매수호가수량7 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem8` | LP매도호가수량8 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem8` | LP매수호가수량8 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem9` | LP매도호가수량9 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem9` | LP매수호가수량9 | Number | Y | 12 | - |
| Response Body | `-lp_offerrem10` | LP매도호가수량10 | Number | Y | 12 | - |
| Response Body | `-lp_bidrem10` | LP매수호가수량10 | Number | Y | 12 | - |
| Response Body | `-jnilclose` | 전일종가 | Number | Y | 8 | - |
| Response Body | `-offerho1` | 매도호가1 | Number | Y | 8 | - |
| Response Body | `-bidho1` | 매수호가1 | Number | Y | 8 | - |
| Response Body | `-offerrem1` | 매도호가수량1 | Number | Y | 12 | - |
| Response Body | `-bidrem1` | 매수호가수량1 | Number | Y | 12 | - |
| Response Body | `-preoffercha1` | 직전매도대비수량1 | Number | Y | 12 | - |
| Response Body | `-prebidcha1` | 직전매수대비수량1 | Number | Y | 12 | - |
| Response Body | `-offerho2` | 매도호가2 | Number | Y | 8 | - |
| Response Body | `-bidho2` | 매수호가2 | Number | Y | 8 | - |
| Response Body | `-offerrem2` | 매도호가수량2 | Number | Y | 12 | - |
| Response Body | `-bidrem2` | 매수호가수량2 | Number | Y | 12 | - |
| Response Body | `-preoffercha2` | 직전매도대비수량2 | Number | Y | 12 | - |
| Response Body | `-prebidcha2` | 직전매수대비수량2 | Number | Y | 12 | - |
| Response Body | `-offerho3` | 매도호가3 | Number | Y | 8 | - |
| Response Body | `-bidho3` | 매수호가3 | Number | Y | 8 | - |
| Response Body | `-offerrem3` | 매도호가수량3 | Number | Y | 12 | - |
| Response Body | `-bidrem3` | 매수호가수량3 | Number | Y | 12 | - |
| Response Body | `-preoffercha3` | 직전매도대비수량3 | Number | Y | 12 | - |
| Response Body | `-prebidcha3` | 직전매수대비수량3 | Number | Y | 12 | - |
| Response Body | `-offerho4` | 매도호가4 | Number | Y | 8 | - |
| Response Body | `-bidho4` | 매수호가4 | Number | Y | 8 | - |
| Response Body | `-offerrem4` | 매도호가수량4 | Number | Y | 12 | - |
| Response Body | `-bidrem4` | 매수호가수량4 | Number | Y | 12 | - |
| Response Body | `-preoffercha4` | 직전매도대비수량4 | Number | Y | 12 | - |
| Response Body | `-prebidcha4` | 직전매수대비수량4 | Number | Y | 12 | - |
| Response Body | `-offerho5` | 매도호가5 | Number | Y | 8 | - |
| Response Body | `-bidho5` | 매수호가5 | Number | Y | 8 | - |
| Response Body | `-offerrem5` | 매도호가수량5 | Number | Y | 12 | - |
| Response Body | `-bidrem5` | 매수호가수량5 | Number | Y | 12 | - |
| Response Body | `-preoffercha5` | 직전매도대비수량5 | Number | Y | 12 | - |
| Response Body | `-prebidcha5` | 직전매수대비수량5 | Number | Y | 12 | - |
| Response Body | `-offerho6` | 매도호가6 | Number | Y | 8 | - |
| Response Body | `-bidho6` | 매수호가6 | Number | Y | 8 | - |
| Response Body | `-offerrem6` | 매도호가수량6 | Number | Y | 12 | - |
| Response Body | `-bidrem6` | 매수호가수량6 | Number | Y | 12 | - |
| Response Body | `-preoffercha6` | 직전매도대비수량6 | Number | Y | 12 | - |
| Response Body | `-prebidcha6` | 직전매수대비수량6 | Number | Y | 12 | - |
| Response Body | `-offerho7` | 매도호가7 | Number | Y | 8 | - |
| Response Body | `-bidho7` | 매수호가7 | Number | Y | 8 | - |
| Response Body | `-offerrem7` | 매도호가수량7 | Number | Y | 12 | - |
| Response Body | `-bidrem7` | 매수호가수량7 | Number | Y | 12 | - |
| Response Body | `-preoffercha7` | 직전매도대비수량7 | Number | Y | 12 | - |
| Response Body | `-prebidcha7` | 직전매수대비수량7 | Number | Y | 12 | - |
| Response Body | `-offerho8` | 매도호가8 | Number | Y | 8 | - |
| Response Body | `-bidho8` | 매수호가8 | Number | Y | 8 | - |
| Response Body | `-offerrem8` | 매도호가수량8 | Number | Y | 12 | - |
| Response Body | `-bidrem8` | 매수호가수량8 | Number | Y | 12 | - |
| Response Body | `-preoffercha8` | 직전매도대비수량8 | Number | Y | 12 | - |
| Response Body | `-prebidcha8` | 직전매수대비수량8 | Number | Y | 12 | - |
| Response Body | `-offerho9` | 매도호가9 | Number | Y | 8 | - |
| Response Body | `-bidho9` | 매수호가9 | Number | Y | 8 | - |
| Response Body | `-offerrem9` | 매도호가수량9 | Number | Y | 12 | - |
| Response Body | `-bidrem9` | 매수호가수량9 | Number | Y | 12 | - |
| Response Body | `-preoffercha9` | 직전매도대비수량9 | Number | Y | 12 | - |
| Response Body | `-prebidcha9` | 직전매수대비수량9 | Number | Y | 12 | - |
| Response Body | `-offerho10` | 매도호가10 | Number | Y | 8 | - |
| Response Body | `-bidho10` | 매수호가10 | Number | Y | 8 | - |
| Response Body | `-offerrem10` | 매도호가수량10 | Number | Y | 12 | - |
| Response Body | `-bidrem10` | 매수호가수량10 | Number | Y | 12 | - |
| Response Body | `-preoffercha10` | 직전매도대비수량10 | Number | Y | 12 | - |
| Response Body | `-prebidcha10` | 직전매수대비수량10 | Number | Y | 12 | - |
| Response Body | `-offer` | 매도호가수량합 | Number | Y | 12 | - |
| Response Body | `-bid` | 매수호가수량합 | Number | Y | 12 | - |
| Response Body | `-preoffercha` | 직전매도대비수량합 | Number | Y | 12 | - |
| Response Body | `-prebidcha` | 직전매수대비수량합 | Number | Y | 12 | - |
| Response Body | `-hotime` | 수신시간 | String | Y | 8 | - |
| Response Body | `-yeprice` | 예상체결가격 | Number | Y | 8 | - |
| Response Body | `-yevolume` | 예상체결수량 | Number | Y | 12 | - |
| Response Body | `-yesign` | 예상체결전일구분 | String | Y | 1 | - |
| Response Body | `-yechange` | 예상체결전일대비 | Number | Y | 8 | - |
| Response Body | `-yediff` | 예상체결등락율 | Number | Y | 6.2 | - |
| Response Body | `-tmoffer` | 시간외매도잔량 | Number | Y | 12 | - |
| Response Body | `-tmbid` | 시간외매수잔량 | Number | Y | 12 | - |
| Response Body | `-ho_status` | 동시구분 | String | Y | 1 | - |
| Response Body | `-shcode` | 단축코드 | String | Y | 6 | - |
| Response Body | `-uplmtprice` | 상한가 | Number | Y | 8 | - |
| Response Body | `-dnlmtprice` | 하한가 | Number | Y | 8 | - |
| Response Body | `-open` | 시가 | Number | Y | 8 | - |
| Response Body | `-high` | 고가 | Number | Y | 8 | - |
| Response Body | `-low` | 저가 | Number | Y | 8 | - |
| Response Body | `-krx_midprice` | KRX중간가격 | Number | Y | 8 | - |
| Response Body | `-krx_offermidsumrem` | KRX매도중간가잔량합계수량 | Number | Y | 9 | - |
| Response Body | `-krx_bidmidsumrem` | KRX매수중간가잔량합계수량 | Number | Y | 9 | - |

## 예제

### Request

```json
{
  "t1906InBlock": {
    "shcode": "001200"
  }
}
```

### Response

```json
{
  "rsp_cd": "00000",
  "rsp_msg": "정상적으로 조회가 완료되었습니다.",
  "t1906OutBlock": {
    "offerho4": 3705,
    "offerho3": 3700,
    "offerho6": 3715,
    "offerho5": 3710,
    "offerho8": 3725,
    "offerho7": 3720,
    "offerho9": 3730,
    "lp_offerrem6": 0,
    "lp_offerrem5": 0,
    "lp_bidrem10": 0,
    "lp_offerrem8": 0,
    "lp_offerrem7": 0,
    "lp_offerrem2": 0,
    "lp_offerrem1": 0,
    "lp_offerrem4": 0,
    "lp_offerrem3": 0,
    "offer": 18352,
    "price": 3685,
    "lp_bidrem2": 0,
    "lp_bidrem3": 0,
    "lp_bidrem1": 0,
    "lp_bidrem6": 0,
    "tmoffer": 0,
    "lp_bidrem7": 0,
    "hname": "유진투자증권",
    "lp_bidrem4": 0,
    "offerho2": 3695,
    "lp_bidrem5": 0,
    "offerho1": 3690,
    "lp_bidrem8": 0,
    "lp_bidrem9": 0,
    "yediff": "000.00",
    "diff": "000.68",
    "prebidcha10": 0,
    "offerho10": 3735,
    "yeprice": 0,
    "preoffercha9": 0,
    "preoffercha8": 0,
    "preoffercha7": 0,
    "preoffercha6": 0,
    "preoffercha5": 0,
    "preoffercha4": 0,
    "preoffercha3": 0,
    "bidrem3": 4108,
    "bidrem4": 5458,
    "bidrem1": 2647,
    "bidrem2": 1668,
    "low": 3645,
    "preoffercha2": 0,
    "preoffercha1": 0,
    "bidrem9": 1886,
    "bidrem7": 5183,
    "bidrem8": 126,
    "bidrem5": 5181,
    "bidrem6": 6696,
    "change": 25,
    "uplmtprice": 4755,
    "tmbid": 0,
    "lp_offerrem9": 0,
    "lp_offerrem10": 0,
    "open": 3660,
    "jnilclose": 3660,
    "ho_status": "1",
    "sign": "2",
    "preoffercha": 0,
    "high": 3750,
    "hotime": "10265501",
    "yechange": 0,
    "volume": 322192,
    "preoffercha10": 0,
    "offerrem2": 1,
    "bidho5": 3665,
    "offerrem3": 21,
    "bidho4": 3670,
    "offerrem4": 528,
    "bidho7": 3655,
    "offerrem5": 8485,
    "bidho6": 3660,
    "bidho9": 3645,
    "bidho8": 3650,
    "offerrem1": 619,
    "yevolume": 0,
    "offerrem6": 1454,
    "offerrem7": 2803,
    "offerrem8": 828,
    "offerrem9": 2512,
    "dnlmtprice": 2565,
    "bidho1": 3685,
    "bidho3": 3675,
    "bidho2": 3680,
    "prebidcha": 318,
    "prebidcha2": 318,
    "bidrem10": 1569,
    "prebidcha3": 0,
    "prebidcha4": 0,
    "bidho10": 3640,
    "prebidcha5": 0,
    "prebidcha6": 0,
    "prebidcha7": 0,
    "prebidcha8": 0,
    "prebidcha9": 0,
    "shcode": "001200",
    "yesign": "3",
    "offerrem10": 1101,
    "bid": 34522,
    "prebidcha1": 0
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
