---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=c1ef0e8b-4666-4d8c-a77f-6ab488cfdb39&api_id=906d2d0a-7a6d-4ecc-b574-ca2154a70bca"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외선물"
api_id: "906d2d0a-7a6d-4ecc-b574-ca2154a70bca"
api_name: "[해외선물] 차트"
tr_id: "rz562l37-7le3-s1jh-h33h-16e07kvi1i86"
tr_code: "o3117"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/overseas-futureoption/chart"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# 해외선물 차트 NTick 체결 조회 (o3117)

<!-- request_field_count: 12 -->
<!-- response_field_count: 17 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외선물 |
| API 페이지 | [해외선물] 차트 |
| TR명 | 해외선물 차트 NTick 체결 조회 |
| TR코드 | `o3117` |
| 초당 전송 건수 | 1 |
| 설명 | 해외선물옵션 기간별 차트를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/overseas-futureoption/chart` |
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
| Request Body | `o3117InBlock` | o3117InBlock | Object | Y | - | - |
| Request Body | `-shcode` | 단축코드 | String | Y | 8 | - |
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
| Response Body | `o3117OutBlock` | o3117OutBlock | Object | Y | - | - |
| Response Body | `-shcode` | 단축코드 | String | Y | 8 | - |
| Response Body | `-rec_count` | 레코드카운트 | Number | Y | 7 | - |
| Response Body | `-cts_seq` | 순번CTS | String | Y | 10 | - |
| Response Body | `-cts_daygb` | 당일구분CTS | String | Y | 2 | - |
| Response Body | `o3117OutBlock1<br>(Occurs)` | o3117OutBlock1<br>(Occurs) | Object Array | Y | - | - |
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
  "o3117InBlock": {
    "shcode": "ADM23",
    "ncnt": 0,
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
  "o3117OutBlock": {
    "shcode": "ADM23",
    "rec_count": 20,
    "cts_daygb": "0",
    "cts_seq": "4826"
  },
  "rsp_msg": "조회완료",
  "o3117OutBlock1": [
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
