---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=12320341-ad85-429a-90bd-5b3771c5e89f"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "12320341-ad85-429a-90bd-5b3771c5e89f"
api_name: "[주식] 차트"
tr_id: "70eede0c-82b7-49bd-8ab0-efba3a629d04"
tr_code: "t8453"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/stock/chart"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# (통합)주식챠트(틱/N틱) API용 (t8453)

<!-- request_field_count: 19 -->
<!-- response_field_count: 40 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 차트 |
| TR명 | (통합)주식챠트(틱/N틱) API용 |
| TR코드 | `t8453` |
| 초당 전송 건수 | 1 |
| 설명 | 개별종목 시세차트 및 기간별투자자매매 차트를 확인할 수 있는 서비스입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/stock/chart` |
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
| Request Body | `t8453InBlock` | t8453InBlock | Object | Y | - | - |
| Request Body | `-shcode` | 단축코드 | String | Y | 6 | - |
| Request Body | `-ncnt` | 단위(n틱) | Number | Y | 4 | - |
| Request Body | `-qrycnt` | 요청건수(최대:500) | Number | Y | 4 | - |
| Request Body | `-nday` | 조회영업일수(0:미사용1>=사용) | String | Y | 1 | - |
| Request Body | `-sdate` | 시작일자 | String | Y | 8 | - |
| Request Body | `-stime` | 시작시간(현재미사용) | String | Y | 6 | - |
| Request Body | `-edate` | 종료일자 | String | Y | 8 | - |
| Request Body | `-etime` | 종료시간(현재미사용) | String | Y | 6 | - |
| Request Body | `-cts_date` | 연속일자 | String | Y | 8 | - |
| Request Body | `-cts_time` | 연속시간 | String | Y | 10 | - |
| Request Body | `-comp_yn` | 압축여부(N:비압축) | String | Y | 1 | N:비압축<br>OPEN API 압축 미제공 |
| Request Body | `-exchgubun` | 거래소구분코드 | String | Y | 1 | K: KRX<br>N: NXT<br>U:통합<br>그외 입력값은 KRX로 처리 |

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
| Response Body | `t8453OutBlock` | t8453OutBlock | Object | Y | - | - |
| Response Body | `-shcode` | 단축코드 | String | Y | 6 | - |
| Response Body | `-jisiga` | 전일시가 | Number | Y | 8 | - |
| Response Body | `-jihigh` | 전일고가 | Number | Y | 8 | - |
| Response Body | `-jilow` | 전일저가 | Number | Y | 8 | - |
| Response Body | `-jicloseㅍ` | 전일종가 | Number | Y | 8 | - |
| Response Body | `-jivolume` | 전일거래량 | Number | Y | 12 | - |
| Response Body | `-disiga` | 당일시가 | Number | Y | 8 | - |
| Response Body | `-dihigh` | 당일고가 | Number | Y | 8 | - |
| Response Body | `-dilow` | 당일저가 | Number | Y | 8 | - |
| Response Body | `-diclose` | 당일종가 | Number | Y | 8 | - |
| Response Body | `-highend` | 상한가 | Number | Y | 8 | - |
| Response Body | `-lowend` | 하한가 | Number | Y | 8 | - |
| Response Body | `-cts_date` | 연속일자 | String | Y | 8 | - |
| Response Body | `-cts_time` | 연속시간 | String | Y | 10 | - |
| Response Body | `-s_time` | 장시작시간(HHMMSS) | String | Y | 6 | - |
| Response Body | `-e_time` | 장종료시간(HHMMSS) | String | Y | 6 | - |
| Response Body | `-dshmin` | 동시호가처리시간(MM:분) | String | Y | 2 | - |
| Response Body | `-rec_count` | 레코드카운트 | Number | Y | 7 | - |
| Response Body | `-nxt_fm_s_time` | NXT프리마켓장시작시간(HHMMSS) | String | Y | 6 | - |
| Response Body | `-nxt_fm_e_time` | NXT프리마켓장종료시간(HHMMSS) | String | Y | 6 | - |
| Response Body | `-nxt_fm_dshmin` | NXT프리마켓동시호가처리시간(MM:분) | String | Y | 2 | - |
| Response Body | `-nxt_am_s_time` | NXT에프터마켓장시작시간(HHMMSS) | String | Y | 6 | - |
| Response Body | `-nxt_am_e_time` | NXT에프터마켓장종료시간(HHMMSS) | String | Y | 6 | - |
| Response Body | `-nxt_am_dshmin` | NXT에프터마켓동시호가처리시간(MM:분) | String | Y | 2 | - |
| Response Body | `t8453OutBlock1` | t8453OutBlock1 | Object Array | Y | - | - |
| Response Body | `-date` | 날짜 | String | Y | 8 | - |
| Response Body | `-time` | 시간 | String | Y | 10 | - |
| Response Body | `-open` | 시가 | Number | Y | 8 | - |
| Response Body | `-high` | 고가 | Number | Y | 8 | - |
| Response Body | `-low` | 저가 | Number | Y | 8 | - |
| Response Body | `-close` | 종가 | Number | Y | 8 | - |
| Response Body | `-jdiff_vol` | 거래량 | Number | Y | 12 | - |
| Response Body | `-jongchk` | 수정구분 | Number | Y | 13 | - |
| Response Body | `-rate` | 수정비율 | Number | Y | 6.2 | - |
| Response Body | `-pricechk` | 수정주가반영항목 | Number | Y | 13 | - |

## 예제

### Request

```json
{
  "t8453InBlock": {
    "shcode": "010950",
    "ncnt": 1,
    "qrycnt": 10,
    "nday": "0",
    "sdate": "",
    "stime": "",
    "edate": "99999999",
    "etime": "",
    "cts_date": "",
    "cts_time": "",
    "comp_yn": "N",
    "exchgubun": "N"
  }
}
```

### Response

```json
{
  "t8453OutBlock": {
    "shcode": "010950",
    "jisiga": 62200,
    "jihigh": 62200,
    "jilow": 59700,
    "jiclose": 60500,
    "jivolume": 55839,
    "disiga": 60400,
    "dihigh": 62700,
    "dilow": 60300,
    "diclose": 60600,
    "highend": 78200,
    "lowend": 42200,
    "cts_date": "20250312",
    "cts_time": "1421271843",
    "s_time": "090000",
    "e_time": "152000",
    "dshmin": "00",
    "rec_count": 10,
    "nxt_fm_s_time": "080000",
    "nxt_fm_e_time": "085000",
    "nxt_fm_dshmin": "00",
    "nxt_am_s_time": "154000",
    "nxt_am_e_time": "200000",
    "nxt_am_dshmin": "00"
  },
  "t8453OutBlock1": [
    {
      "date": "20250312",
      "time": "142127",
      "open": 60700,
      "high": 60700,
      "low": 60700,
      "close": 60700,
      "jdiff_vol": 1,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
    },
    {
      "date": "20250312",
      "time": "142134",
      "open": 60700,
      "high": 60700,
      "low": 60700,
      "close": 60700,
      "jdiff_vol": 68,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
    },
    {
      "date": "20250312",
      "time": "142324",
      "open": 60600,
      "high": 60600,
      "low": 60600,
      "close": 60600,
      "jdiff_vol": 1,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
    },
    {
      "date": "20250312",
      "time": "142648",
      "open": 60600,
      "high": 60600,
      "low": 60600,
      "close": 60600,
      "jdiff_vol": 80,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
    },
    {
      "date": "20250312",
      "time": "142738",
      "open": 60600,
      "high": 60600,
      "low": 60600,
      "close": 60600,
      "jdiff_vol": 16,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
    },
    {
      "date": "20250312",
      "time": "142747",
      "open": 60600,
      "high": 60600,
      "low": 60600,
      "close": 60600,
      "jdiff_vol": 1,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
    },
    {
      "date": "20250312",
      "time": "142757",
      "open": 60600,
      "high": 60600,
      "low": 60600,
      "close": 60600,
      "jdiff_vol": 1,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
    },
    {
      "date": "20250312",
      "time": "143004",
      "open": 60600,
      "high": 60600,
      "low": 60600,
      "close": 60600,
      "jdiff_vol": 1,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
    },
    {
      "date": "20250312",
      "time": "143024",
      "open": 60600,
      "high": 60600,
      "low": 60600,
      "close": 60600,
      "jdiff_vol": 20,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
    },
    {
      "date": "20250312",
      "time": "143040",
      "open": 60600,
      "high": 60600,
      "low": 60600,
      "close": 60600,
      "jdiff_vol": 36,
      "jongchk": 0,
      "rate": "0",
      "pricechk": 0
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
