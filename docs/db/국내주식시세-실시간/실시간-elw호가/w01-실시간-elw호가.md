---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=94b5fddc-b819-451b-9619-13ee42468798&api_id=f6d79404-3c1e-4f7f-b176-49b542477bf4"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세(실시간)"
api_id: "f6d79404-3c1e-4f7f-b176-49b542477bf4"
api_name: "[실시간]ELW호가"
tr_id: "eccfa051-00e3-4ca7-9e70-87853da0899a"
tr_code: "W01"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7070"
path: "/pub/W01"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]ELW호가 (W01)

<!-- request_field_count: 4 -->
<!-- response_field_count: 183 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세(실시간) |
| API 페이지 | [실시간]ELW호가 |
| TR명 | [실시간]ELW호가 |
| TR코드 | `W01` |
| 초당 전송 건수 | - |
| 설명 | ELW 실시간 호가 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7070` |
| 모의투자 도메인 | `wss://openapi.dbsec.co.kr:17070` |
| URL | `/pub/W01` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `token` | 토큰 | String | Y | 1000 | G/W 에서 발급하는 접근토큰 |
| Request Header | `tr_type` | TR 타입 | String | Y | 1 | 1: 실시간 시세 등록, 2: 실시간 시세 해제, 3: 계좌 등록 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래코드 | String | Y | 3 | TR코드입력: W01 |
| Request Body | `tr_key` | 종목코드 | String | Y | 20 | ELW: W<br>※ 종목분류코드 + 주식종목코드 입력 (ex. W 52K297)<br>※ 종목분류코드는 두자리 입력이 필요하므로,  W + " " (공백) 문자를 넣어 2바이트를 맞춰 입력 부탁드리겠습니다. |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래코드 | String | Y | 3 | TR코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `ShrnIscd` | 종목코드 | String | Y | 9 | - |
| Response Body | `BsopHour` | 호가시간 | String | Y | 6 | - |
| Response Body | `HourClscode` | 시간구분 | String | Y | 1 | - |
| Response Body | `Askp1` | 1매도호가 | String | Y | 12 | - |
| Response Body | `Askp1Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp2` | 2매도호가 | String | Y | 12 | - |
| Response Body | `Askp2Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp3` | 3매도호가 | String | Y | 12 | - |
| Response Body | `Askp3Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp4` | 4매도호가 | String | Y | 12 | - |
| Response Body | `Askp4Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp5` | 5매도호가 | String | Y | 12 | - |
| Response Body | `Askp5Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp6` | 6매도호가 | String | Y | 12 | - |
| Response Body | `Askp6Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp7` | 7매도호가 | String | Y | 12 | - |
| Response Body | `Askp7Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp8` | 8매도호가 | String | Y | 12 | - |
| Response Body | `Askp8Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp9` | 9매도호가 | String | Y | 12 | - |
| Response Body | `Askp9Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Askp10` | 10매도호가 | String | Y | 12 | - |
| Response Body | `Askp10Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp1` | 1매수호가 | String | Y | 12 | - |
| Response Body | `Bidp1Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp2` | 2매수호가 | String | Y | 12 | - |
| Response Body | `Bidp2Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp3` | 3매수호가 | String | Y | 12 | - |
| Response Body | `Bidp3Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp4` | 4매수호가 | String | Y | 12 | - |
| Response Body | `Bidp4Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp5` | 5매수호가 | String | Y | 12 | - |
| Response Body | `Bidp5Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp6` | 6매수호가 | String | Y | 12 | - |
| Response Body | `Bidp6Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp7` | 7매수호가 | String | Y | 12 | - |
| Response Body | `Bidp7Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp8` | 8매수호가 | String | Y | 12 | - |
| Response Body | `Bidp8Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp9` | 9매수호가 | String | Y | 12 | - |
| Response Body | `Bidp9Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `Bidp10` | 10매수호가 | String | Y | 12 | - |
| Response Body | `Bidp10Clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqn1` | 1매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn2` | 2매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn3` | 3매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn4` | 4매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn5` | 5매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn6` | 6매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn7` | 7매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn8` | 8매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn9` | 9매도호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqn10` | 10매도호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn1` | 1매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn2` | 2매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn3` | 3매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn4` | 4매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn5` | 5매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn6` | 6매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn7` | 7매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn8` | 8매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn9` | 9매수호가 잔량 | String | Y | 18 | - |
| Response Body | `BidpRsqn10` | 10매수호가 잔량 | String | Y | 18 | - |
| Response Body | `AskpRsqnicdc1` | 1매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc1clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqnicdc2` | 2매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc2clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqnicdc3` | 3매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc3clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqnicdc4` | 4매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc4clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqnicdc5` | 5매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc5clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqnicdc6` | 6매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc6clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqnicdc7` | 7매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc7clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqnicdc8` | 8매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc8clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqnicdc9` | 9매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc9clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AskpRsqnicdc10` | 10매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `AskpRsqnicdc10clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc1` | 1매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc1clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc2` | 2매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc2clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc3` | 3매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc3clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc4` | 4매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc4clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc5` | 5매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc5clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc6` | 6매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc6clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc7` | 7매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc7clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc8` | 8매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc8clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc9` | 9매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc9clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `BidpRsqnicdc10` | 10매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `BidpRsqnicdc10clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqn1` | LP 매도호가 잔량1 | String | Y | 18 | - |
| Response Body | `LpAskprsqn2` | LP 매도호가 잔량2 | String | Y | 18 | - |
| Response Body | `LpAskprsqn3` | LP 매도호가 잔량3 | String | Y | 18 | - |
| Response Body | `LpAskprsqn4` | LP 매도호가 잔량4 | String | Y | 18 | - |
| Response Body | `LpAskprsqn5` | LP 매도호가 잔량5 | String | Y | 18 | - |
| Response Body | `LpAskprsqn6` | LP 매도호가 잔량6 | String | Y | 18 | - |
| Response Body | `LpAskprsqn7` | LP 매도호가 잔량7 | String | Y | 18 | - |
| Response Body | `LpAskprsqn8` | LP 매도호가 잔량8 | String | Y | 18 | - |
| Response Body | `LpAskprsqn9` | LP 매도호가 잔량9 | String | Y | 18 | - |
| Response Body | `LpAskprsqn10` | LP 매도호가 잔량10 | String | Y | 18 | - |
| Response Body | `LpBidprsqn1` | LP 매수호가 잔량1 | String | Y | 18 | - |
| Response Body | `LpBidprsqn2` | LP 매수호가 잔량2 | String | Y | 18 | - |
| Response Body | `LpBidprsqn3` | LP 매수호가 잔량3 | String | Y | 18 | - |
| Response Body | `LpBidprsqn4` | LP 매수호가 잔량4 | String | Y | 18 | - |
| Response Body | `LpBidprsqn5` | LP 매수호가 잔량5 | String | Y | 18 | - |
| Response Body | `LpBidprsqn6` | LP 매수호가 잔량6 | String | Y | 18 | - |
| Response Body | `LpBidprsqn7` | LP 매수호가 잔량7 | String | Y | 18 | - |
| Response Body | `LpBidprsqn8` | LP 매수호가 잔량8 | String | Y | 18 | - |
| Response Body | `LpBidprsqn9` | LP 매수호가 잔량9 | String | Y | 18 | - |
| Response Body | `LpBidprsqn10` | LP 매수호가 잔량10 | String | Y | 18 | - |
| Response Body | `LpAskprsqnicdc1` | LP 매도호가 잔량 증감1 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc1clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqnicdc2` | LP 매도호가 잔량 증감2 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc2clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqnicdc3` | LP 매도호가 잔량 증감3 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc3clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqnicdc4` | LP 매도호가 잔량 증감4 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc4clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqnicdc5` | LP 매도호가 잔량 증감5 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc5clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqnicdc6` | LP 매도호가 잔량 증감6 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc6clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqnicdc7` | LP 매도호가 잔량 증감7 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc7clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqnicdc8` | LP 매도호가 잔량 증감8 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc8clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqnicdc9` | LP 매도호가 잔량 증감9 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc9clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpAskprsqnicdc10` | LP 매도호가 잔량 증감10 | String | Y | 12 | - |
| Response Body | `LpAskprsqnicdc10clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc1` | LP 매수호가 잔량 증감1 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc1clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc2` | LP 매수호가 잔량 증감2 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc2clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc3` | LP 매수호가 잔량 증감3 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc3clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc4` | LP 매수호가 잔량 증감4 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc4clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc5` | LP 매수호가 잔량 증감5 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc5clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc6` | LP 매수호가 잔량 증감6 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc6clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc7` | LP 매수호가 잔량 증감7 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc7clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc8` | LP 매수호가 잔량 증감8 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc8clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc9` | LP 매수호가 잔량 증감9 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc9clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpBidprsqnicdc10` | LP 매수호가 잔량 증감10 | String | Y | 12 | - |
| Response Body | `LpBidprsqnicdc10clr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `TotalAskprsqn` | 총 매도호가 잔량 | String | Y | 18 | - |
| Response Body | `TotalBidprsqn` | 총 매수호가 잔량 | String | Y | 18 | - |
| Response Body | `TotalAskprsqnicdc` | 총 매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `TotalAskprsqnicdcclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `TotalBidprsqnicdc` | 총 매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `TotalBidprsqnicdcclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpTotalaskprsqn` | LP 총 매도호가 잔량 | String | Y | 18 | - |
| Response Body | `LpTotalbidprsqn` | LP 총 매수호가 잔량 | String | Y | 18 | - |
| Response Body | `LpTotalaskrsqnicdc` | LP 총 매도호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `LpTotalaskrsqnicdcclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `LpTotalbidrsqnicdc` | LP 총 매수호가 잔량 증감 | String | Y | 12 | - |
| Response Body | `LpTotalbidrsqnicdcclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `CnccAsprclscode` | 동시 호가 구분 코드 | String | Y | 1 | - |
| Response Body | `AntcCnpr` | 예상 체결가 | String | Y | 12 | - |
| Response Body | `AntcCnprclr` | 색참조(+상승, -하락) | String | Y | 1 | - |
| Response Body | `AntcCnqn` | 예상 체결량 | String | Y | 18 | - |
| Response Body | `AcmlVol` | 누적 거래량 | String | Y | 18 | - |
| Response Body | `NewMkopclscode` | 신장운영구분코드 | String | Y | 2 | - |
| Response Body | `AntcIssyn` | 예상활성여부 | String | Y | 1 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "{{ _.access_token }}",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "W01",
    "tr_key": "W 58J916"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "W01",
    "tr_key": null
  },
  "body": {
    "ShrnIscd": "58J916",
    "BsopHour": "094521",
    "HourClscode": "0",
    "Askp1": "145",
    "Askp1Clr": "+",
    "Askp2": "150",
    "Askp2Clr": "+",
    "Askp3": "0",
    "Askp3Clr": "",
    "Askp4": "0",
    "Askp4Clr": "",
    "Askp5": "0",
    "Askp5Clr": "",
    "Askp6": "0",
    "Askp6Clr": "",
    "Askp7": "0",
    "Askp7Clr": "",
    "Askp8": "0",
    "Askp8Clr": "",
    "Askp9": "0",
    "Askp9Clr": "",
    "Askp10": "0",
    "Askp10Clr": "",
    "Bidp1": "140",
    "Bidp1Clr": "+",
    "Bidp2": "135",
    "Bidp2Clr": "+",
    "Bidp3": "130",
    "Bidp3Clr": "+",
    "Bidp4": "125",
    "Bidp4Clr": "+",
    "Bidp5": "120",
    "Bidp5Clr": "+",
    "Bidp6": "115",
    "Bidp6Clr": "+",
    "Bidp7": "10",
    "Bidp7Clr": "-",
    "Bidp8": "5",
    "Bidp8Clr": "-",
    "Bidp9": "0",
    "Bidp9Clr": "",
    "Bidp10": "0",
    "Bidp10Clr": "",
    "AskpRsqn1": "119180",
    "AskpRsqn2": "1000",
    "AskpRsqn3": "0",
    "AskpRsqn4": "0",
    "AskpRsqn5": "0",
    "AskpRsqn6": "0",
    "AskpRsqn7": "0",
    "AskpRsqn8": "0",
    "AskpRsqn9": "0",
    "AskpRsqn10": "0",
    "BidpRsqn1": "105800",
    "BidpRsqn2": "109600",
    "BidpRsqn3": "109100",
    "BidpRsqn4": "131970",
    "BidpRsqn5": "131010",
    "BidpRsqn6": "60000",
    "BidpRsqn7": "5000",
    "BidpRsqn8": "10000",
    "BidpRsqn9": "0",
    "BidpRsqn10": "0",
    "AskpRsqnicdc1": "0",
    "AskpRsqnicdc1clr": "",
    "AskpRsqnicdc2": "0",
    "AskpRsqnicdc2clr": "",
    "AskpRsqnicdc3": "0",
    "AskpRsqnicdc3clr": "",
    "AskpRsqnicdc4": "0",
    "AskpRsqnicdc4clr": "",
    "AskpRsqnicdc5": "0",
    "AskpRsqnicdc5clr": "",
    "AskpRsqnicdc6": "0",
    "AskpRsqnicdc6clr": "",
    "AskpRsqnicdc7": "0",
    "AskpRsqnicdc7clr": "",
    "AskpRsqnicdc8": "0",
    "AskpRsqnicdc8clr": "",
    "AskpRsqnicdc9": "0",
    "AskpRsqnicdc9clr": "",
    "AskpRsqnicdc10": "0",
    "AskpRsqnicdc10clr": "",
    "BidpRsqnicdc1": "20000",
    "BidpRsqnicdc1clr": "+",
    "BidpRsqnicdc2": "0",
    "BidpRsqnicdc2clr": "",
    "BidpRsqnicdc3": "0",
    "BidpRsqnicdc3clr": "",
    "BidpRsqnicdc4": "0",
    "BidpRsqnicdc4clr": "",
    "BidpRsqnicdc5": "0",
    "BidpRsqnicdc5clr": "",
    "BidpRsqnicdc6": "0",
    "BidpRsqnicdc6clr": "",
    "BidpRsqnicdc7": "0",
    "BidpRsqnicdc7clr": "",
    "BidpRsqnicdc8": "0",
    "BidpRsqnicdc8clr": "",
    "BidpRsqnicdc9": "0",
    "BidpRsqnicdc9clr": "",
    "BidpRsqnicdc10": "0",
    "BidpRsqnicdc10clr": "",
    "LpAskprsqn1": "0",
    "LpAskprsqn2": "0",
    "LpAskprsqn3": "0",
    "LpAskprsqn4": "0",
    "LpAskprsqn5": "0",
    "LpAskprsqn6": "0",
    "LpAskprsqn7": "0",
    "LpAskprsqn8": "0",
    "LpAskprsqn9": "0",
    "LpAskprsqn10": "0",
    "LpBidprsqn1": "0",
    "LpBidprsqn2": "0",
    "LpBidprsqn3": "0",
    "LpBidprsqn4": "0",
    "LpBidprsqn5": "0",
    "LpBidprsqn6": "0",
    "LpBidprsqn7": "0",
    "LpBidprsqn8": "0",
    "LpBidprsqn9": "0",
    "LpBidprsqn10": "0",
    "LpAskprsqnicdc1": "0",
    "LpAskprsqnicdc1clr": "",
    "LpAskprsqnicdc2": "0",
    "LpAskprsqnicdc2clr": "",
    "LpAskprsqnicdc3": "0",
    "LpAskprsqnicdc3clr": "",
    "LpAskprsqnicdc4": "0",
    "LpAskprsqnicdc4clr": "",
    "LpAskprsqnicdc5": "0",
    "LpAskprsqnicdc5clr": "",
    "LpAskprsqnicdc6": "0",
    "LpAskprsqnicdc6clr": "",
    "LpAskprsqnicdc7": "0",
    "LpAskprsqnicdc7clr": "",
    "LpAskprsqnicdc8": "0",
    "LpAskprsqnicdc8clr": "",
    "LpAskprsqnicdc9": "0",
    "LpAskprsqnicdc9clr": "",
    "LpAskprsqnicdc10": "0",
    "LpAskprsqnicdc10clr": "",
    "LpBidprsqnicdc1": "0",
    "LpBidprsqnicdc1clr": "",
    "LpBidprsqnicdc2": "0",
    "LpBidprsqnicdc2clr": "",
    "LpBidprsqnicdc3": "0",
    "LpBidprsqnicdc3clr": "",
    "LpBidprsqnicdc4": "0",
    "LpBidprsqnicdc4clr": "",
    "LpBidprsqnicdc5": "0",
    "LpBidprsqnicdc5clr": "",
    "LpBidprsqnicdc6": "0",
    "LpBidprsqnicdc6clr": "",
    "LpBidprsqnicdc7": "0",
    "LpBidprsqnicdc7clr": "",
    "LpBidprsqnicdc8": "0",
    "LpBidprsqnicdc8clr": "",
    "LpBidprsqnicdc9": "0",
    "LpBidprsqnicdc9clr": "",
    "LpBidprsqnicdc10": "0",
    "LpBidprsqnicdc10clr": "",
    "TotalAskprsqn": "120180",
    "TotalBidprsqn": "662480",
    "TotalAskprsqnicdc": "0",
    "TotalAskprsqnicdcclr": "",
    "TotalBidprsqnicdc": "20000",
    "TotalBidprsqnicdcclr": "+",
    "LpTotalaskprsqn": "0",
    "LpTotalbidprsqn": "0",
    "LpTotalaskrsqnicdc": "0",
    "LpTotalaskrsqnicdcclr": "",
    "LpTotalbidrsqnicdc": "0",
    "LpTotalbidrsqnicdcclr": "",
    "CnccAsprclscode": "1",
    "AntcCnpr": "0",
    "AntcCnprclr": "",
    "AntcCnqn": "0",
    "AcmlVol": "363730",
    "NewMkopclscode": "20",
    "AntcIssyn": "N"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
