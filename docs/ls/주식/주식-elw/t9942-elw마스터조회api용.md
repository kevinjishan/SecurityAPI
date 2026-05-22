---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=3d58c125-8b45-46b4-baf2-6f98d0373131"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "3d58c125-8b45-46b4-baf2-6f98d0373131"
api_name: "[주식] ELW"
tr_id: "e11t42bf-tog0-u5m4-4uuw-8en3ej31jzjl"
tr_code: "t9942"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/stock/elw"
content_type: "application/json; charset=UTF-8"
rate_limit: "2"
auth_required: true
---

# ELW마스터조회API용 (t9942)

<!-- request_field_count: 8 -->
<!-- response_field_count: 8 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] ELW |
| TR명 | ELW마스터조회API용 |
| TR코드 | `t9942` |
| 초당 전송 건수 | 2 |
| 설명 | ELW 시세 및  종목별정보를 호출하여 ELW 상세정보를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/stock/elw` |
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
| Request Body | `t9942InBlock` | t9942InBlock | Object | Y | - | - |
| Request Body | `-dummy` | Dummy | String | Y | 1 | - |

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
| Response Body | `t9942OutBlock` | t9942OutBlock | Object Array | Y | - | - |
| Response Body | `-hname` | 종목명 | String | Y | 40 | - |
| Response Body | `-shcode` | 단축코드 | String | Y | 6 | - |
| Response Body | `-expcode` | 확장코드 | String | Y | 12 | - |

## 예제

### Request

```json
{
  "t9942InBlock": {
    "dummy": ""
  }
}
```

### Response

```text
{
    "rsp_cd": "00000",
    "rsp_msg": "정상적으로 조회가 완료되었습니다.",
    "t9942OutBlock": [
        {
            "shcode": "52HAAA",
            "expcode": "KRA521127CB3",
            "hname": "미래HAAA한국전력콜"
        },
        {
            "shcode": "52HAAE",
            "expcode": "KRA521231CB3",
            "hname": "미래HAAELG에너지풋"
        },
        {
            "shcode": "52HAAM",
            "expcode": "KRA521138CB0",
            "hname": "미래HAAM네이버콜"
        },
        {
            "shcode": "52HAAZ",
            "expcode": "KRA521149CB7",
            "hname": "미래HAAZ카카오콜"
        },
        {
            "shcode": "52HABA",
            "expcode": "KRA521150CB5",
            "hname": "미래HABA카카오콜"
        },
        {
            "shcode": "52HABB",
            "expcode": "KRA521151CB3",
            "hname": "미래HABB카카오콜"
        },
        {
            "shcode": "52HABJ",
            "expcode": "KRA521158CB8",
            "hname": "미래HABJSK하이닉콜"
        },
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
