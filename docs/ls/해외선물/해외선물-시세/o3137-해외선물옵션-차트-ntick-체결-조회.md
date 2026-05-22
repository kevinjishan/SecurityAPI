---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=c1ef0e8b-4666-4d8c-a77f-6ab488cfdb39&api_id=d61d4f85-9845-41ef-b915-4efa8fd0aad1"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외선물"
api_id: "d61d4f85-9845-41ef-b915-4efa8fd0aad1"
api_name: "[해외선물] 시세"
tr_id: "fxc2y145-87wa-wkw5-iv0d-d077c3ild148"
tr_code: "o3137"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/overseas-futureoption/market-data"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# 해외선물옵션 차트 NTick 체결 조회 (o3137)

<!-- request_field_count: 13 -->
<!-- response_field_count: 17 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외선물 |
| API 페이지 | [해외선물] 시세 |
| TR명 | 해외선물옵션 차트 NTick 체결 조회 |
| TR코드 | `o3137` |
| 초당 전송 건수 | 1 |
| 설명 | 해외선물옵션 종목별 시세 및 차트 등<br>시세관련 데이터를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/overseas-futureoption/market-data` |
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
| Request Body | `o3137InBlock` | o3137InBlock | Object | Y | - | - |
| Request Body | `-mktgb` | 시장구분 | String | Y | 1 | ex) F(선물), O(옵션) |
| Request Body | `-shcode` | 단축코드 | String | Y | 16 | ex) 2ESF16_1915 |
| Request Body | `-ncnt` | 단위 | Number | Y | 4 | - |
| Request Body | `-qrycnt` | 건수 | Number | Y | 4 | - |
| Request Body | `-cts_seq` | 순번CTS | String | Y | 10 | - |
| Request Body | `-cts_daygb` | 당일구분CTS | String | Y | 2 | - |

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
| Response Body | `o3137OutBlock` | o3137OutBlock | Object | Y | - | - |
| Response Body | `-shcode` | 단축코드 | String | Y | 16 | - |
| Response Body | `-rec_count` | 레코드카운트 | Number | Y | 7 | - |
| Response Body | `-cts_seq` | 연속시간 | String | Y | 10 | - |
| Response Body | `-cts_daygb` | 연속당일구분 | String | Y | 2 | - |
| Response Body | `o3137OutBlock1<br>(Occurs)` | o3137OutBlock1<br>(Occurs) | Object Array | Y | - | - |
| Response Body | `-date` | 날짜 | String | Y | 8 | - |
| Response Body | `-time` | 시간 | String | Y | 6 | - |
| Response Body | `-open` | 시가 | Number | Y | 15.9 | - |
| Response Body | `-high` | 고가 | Number | Y | 15.9 | - |
| Response Body | `-low` | 저가 | Number | Y | 15.9 | - |
| Response Body | `-close` | 종가 | Number | Y | 15.9 | - |
| Response Body | `-volume` | 거래량 | Number | Y | 12 | - |

## 예제

### Request

```json
{
  "o3137InBlock": {
    "mktgb": "F",
    "shcode": "ADM23",
    "ncnt": 1,
    "qrycnt": 20,
    "cts_seq": "",
    "cts_daygb": ""
  }
}
```

### Response

```json
{
  "rsp_cd": "00000",
  "rsp_msg": "조회완료",
  "o3137OutBlock": {
    "shcode": null,
    "rec_count": null,
    "cts_daygb": null,
    "cts_seq": null
  },
  "o3137OutBlock1": [
    {
      "date": "20230613",
      "volume": 1,
      "high": "0.67670",
      "low": "0.67670",
      "time": "000533",
      "close": "0.67670",
      "open": "0.67670"
    },
    {
      "date": "20230613",
      "volume": 1,
      "high": "0.67665",
      "low": "0.67665",
      "time": "000438",
      "close": "0.67665",
      "open": "0.67665"
    }
  ]
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
