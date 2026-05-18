---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "x47tsi3u-30i0-0q6e-856o-22c7iq5gp352"
tr_code: "KM_"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KOSDAQ프로그램매매전체집계 (KM_)

<!-- request_field_count: 4 -->
<!-- response_field_count: 87 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | KOSDAQ프로그램매매전체집계 |
| TR코드 | `KM_` |
| 초당 전송 건수 | - |
| 설명 | 주식 주문현황 및 시세, 투자정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/stock` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `token` | 접근토큰 | String | Y | 1000 | Access Token을 설정하기 위한 Header Parameter |
| Request Header | `tr_type` | 거래 Type | String | Y | 1 | 1: 계좌등록, 2: 계좌해제, 3: 실시간 시세 등록, 4: 실시간 시세 해제 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |
| Request Body | `tr_key` | 단축코드 | String | N | 8 | 단축코드 6자리 또는 8자리 (단건, 연속), (계좌등록/해제 일 경우 필수값 아님) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `time` | 수신시간 | String | Y | 6 | - |
| Response Body | `cdhrem` | 차익매도호가 잔량 | String | Y | 6 | - |
| Response Body | `cshrem` | 차익매수호가 잔량 | String | Y | 6 | - |
| Response Body | `bdhrem` | 비차익매도호가 잔량 | String | Y | 6 | - |
| Response Body | `bshrem` | 비차익매수호가 잔량 | String | Y | 6 | - |
| Response Body | `cdhvolume` | 차익매도호가 수량 | String | Y | 6 | - |
| Response Body | `cshvolume` | 차익매수호가 수량 | String | Y | 6 | - |
| Response Body | `bdhvolume` | 비차익매도호가 수량 | String | Y | 6 | - |
| Response Body | `bshvolume` | 비차익매수호가 수량 | String | Y | 6 | - |
| Response Body | `cdwvolume` | 차익매도위탁체결수량 | String | Y | 6 | - |
| Response Body | `cdjvolume` | 차익매도자기체결수량 | String | Y | 6 | - |
| Response Body | `cswvolume` | 차익매수위탁체결수량 | String | Y | 6 | - |
| Response Body | `csjvolume` | 차익매수자기체결수량 | String | Y | 6 | - |
| Response Body | `cwvol` | 차익위탁순매수 수량 | String | Y | 6 | - |
| Response Body | `cjvol` | 차익자기순매수 수량 | String | Y | 6 | - |
| Response Body | `bdwvolume` | 비차익매도위탁체결수량 | String | Y | 6 | - |
| Response Body | `bdjvolume` | 비차익매도자기체결수량 | String | Y | 6 | - |
| Response Body | `bswvolume` | 비차익매수위탁체결수량 | String | Y | 6 | - |
| Response Body | `bsjvolume` | 비차익매수자기체결수량 | String | Y | 6 | - |
| Response Body | `bwvol` | 비차익위탁순매수 수량 | String | Y | 6 | - |
| Response Body | `bjvol` | 비차익자기순매수 수량 | String | Y | 6 | - |
| Response Body | `dwvolume` | 전체매도위탁체결수량 | String | Y | 6 | - |
| Response Body | `swvolume` | 전체매수위탁체결수량 | String | Y | 6 | - |
| Response Body | `wvol` | 전체위탁순매수 수량 | String | Y | 6 | - |
| Response Body | `djvolume` | 전체매도자기체결수량 | String | Y | 6 | - |
| Response Body | `sjvolume` | 전체매수자기체결수량 | String | Y | 6 | - |
| Response Body | `jvol` | 전체자기순매수 수량 | String | Y | 6 | - |
| Response Body | `cdwvalue` | 차익매도위탁체결금액 | String | Y | 8 | - |
| Response Body | `cdjvalue` | 차익매도자기체결금액 | String | Y | 8 | - |
| Response Body | `cswvalue` | 차익매수위탁체결금액 | String | Y | 8 | - |
| Response Body | `csjvalue` | 차익매수자기체결금액 | String | Y | 8 | - |
| Response Body | `cwval` | 차익위탁순매수 금액 | String | Y | 8 | - |
| Response Body | `cjval` | 차익자기순매수 금액 | String | Y | 8 | - |
| Response Body | `bdwvalue` | 비차익매도위탁체결금액 | String | Y | 8 | - |
| Response Body | `bdjvalue` | 비차익매도자기체결금액 | String | Y | 8 | - |
| Response Body | `bswvalue` | 비차익매수위탁체결금액 | String | Y | 8 | - |
| Response Body | `bsjvalue` | 비차익매수자기체결금액 | String | Y | 8 | - |
| Response Body | `bwval` | 비차익위탁순매수 금액 | String | Y | 8 | - |
| Response Body | `bjval` | 비차익자기순매수 금액 | String | Y | 8 | - |
| Response Body | `dwvalue` | 전체매도위탁체결금액 | String | Y | 8 | - |
| Response Body | `swvalue` | 전체매수위탁체결금액 | String | Y | 8 | - |
| Response Body | `wval` | 전체위탁순매수 금액 | String | Y | 8 | - |
| Response Body | `djvalue` | 전체매도자기체결금액 | String | Y | 8 | - |
| Response Body | `sjvalue` | 전체매수자기체결금액 | String | Y | 8 | - |
| Response Body | `jval` | 전체자기순매수 금액 | String | Y | 8 | - |
| Response Body | `k50jisu` | KOSDAQ50 지수 | String | Y | 6.2 | - |
| Response Body | `k50sign` | KOSDAQ50 전일대비구분 | String | Y | 1 | - |
| Response Body | `change` | KOSDAQ50 전일대비 | String | Y | 6.2 | - |
| Response Body | `k50basis` | KOSDAQ50 베이시스 | String | Y | 4.2 | - |
| Response Body | `cdvolume` | 차익매도체결수량합계 | String | Y | 6 | - |
| Response Body | `csvolume` | 차익매수체결수량합계 | String | Y | 6 | - |
| Response Body | `cvol` | 차익순매수 수량합계 | String | Y | 6 | - |
| Response Body | `bdvolume` | 비차익매도체결수량합계 | String | Y | 6 | - |
| Response Body | `bsvolume` | 비차익매수체결수량합계 | String | Y | 6 | - |
| Response Body | `bvol` | 비차익순매수 수량합계 | String | Y | 6 | - |
| Response Body | `tdvolume` | 전체매도체결수량합계 | String | Y | 6 | - |
| Response Body | `tsvolume` | 전체매수체결수량합계 | String | Y | 6 | - |
| Response Body | `tvol` | 전체순매수 수량합계 | String | Y | 6 | - |
| Response Body | `cdvalue` | 차익매도체결금액합계 | String | Y | 8 | - |
| Response Body | `csvalue` | 차익매수체결금액합계 | String | Y | 8 | - |
| Response Body | `cval` | 차익순매수 금액합계 | String | Y | 8 | - |
| Response Body | `bdvalue` | 비차익매도체결금액합계 | String | Y | 8 | - |
| Response Body | `bsvalue` | 비차익매수체결금액합계 | String | Y | 8 | - |
| Response Body | `bval` | 비차익순매수 금액합계 | String | Y | 8 | - |
| Response Body | `tdvalue` | 전체매도체결금액합계 | String | Y | 8 | - |
| Response Body | `tsvalue` | 전체매수체결금액합계 | String | Y | 8 | - |
| Response Body | `tval` | 전체순매수 금액합계 | String | Y | 8 | - |
| Response Body | `p_cdvolcha` | 차익매도체결수량직전대비 | String | Y | 6 | - |
| Response Body | `p_csvolcha` | 차익매수체결수량직전대비 | String | Y | 6 | - |
| Response Body | `p_cvolcha` | 차익순매수 수량직전대비 | String | Y | 6 | - |
| Response Body | `p_bdvolcha` | 비차익매도체결수량직전대비 | String | Y | 6 | - |
| Response Body | `p_bsvolcha` | 비차익매수체결수량직전대비 | String | Y | 6 | - |
| Response Body | `p_bvolcha` | 비차익순매수 수량직전대비 | String | Y | 6 | - |
| Response Body | `p_tdvolcha` | 전체매도체결수량직전대비 | String | Y | 6 | - |
| Response Body | `p_tsvolcha` | 전체매수체결수량직전대비 | String | Y | 6 | - |
| Response Body | `p_tvolcha` | 전체순매수 수량직전대비 | String | Y | 6 | - |
| Response Body | `p_cdvalcha` | 차익매도체결금액직전대비 | String | Y | 8 | - |
| Response Body | `p_csvalcha` | 차익매수체결금액직전대비 | String | Y | 8 | - |
| Response Body | `p_cvalcha` | 차익순매수 금액직전대비 | String | Y | 8 | - |
| Response Body | `p_bdvalcha` | 비차익매도체결금액직전대비 | String | Y | 8 | - |
| Response Body | `p_bsvalcha` | 비차익매수체결금액직전대비 | String | Y | 8 | - |
| Response Body | `p_bvalcha` | 비차익순매수 금액직전대비 | String | Y | 8 | - |
| Response Body | `p_tdvalcha` | 전체매도체결금액직전대비 | String | Y | 8 | - |
| Response Body | `p_tsvalcha` | 전체매수체결금액직전대비 | String | Y | 8 | - |
| Response Body | `p_tvalcha` | 전체순매수 금액직전대비 | String | Y | 8 | - |
| Response Body | `gubun` | 구분값 | String | Y | 1 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "KM_",
    "tr_key": "1"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "KM_",
    "tr_key": "1"
  },
  "body": {
    "sjvalue": "0",
    "p_bdvalcha": "58416",
    "p_cdvalcha": "419",
    "k50sign": "2",
    "cwval": "-440",
    "csjvolume": "0",
    "p_cvolcha": "-2",
    "bdvolume": "8923",
    "dwvalue": "114626",
    "cdvolume": "21",
    "bdwvolume": "8859",
    "sjvolume": "0",
    "jvol": "-83",
    "bdhrem": "1397",
    "tval": "-67954",
    "bdvalue": "114996",
    "bshvolume": "5221",
    "bjvol": "-64",
    "cdhvolume": "22",
    "bvol": "-5183",
    "csvolume": "0",
    "swvalue": "48143",
    "bdjvolume": "64",
    "tdvalue": "116097",
    "k50jisu": "1390.90",
    "tdvolume": "8944",
    "cjvol": "-19",
    "swvolume": "3741",
    "cswvolume": "0",
    "gubun": "1",
    "bwval": "-66043",
    "p_bvolcha": "-2147",
    "p_tsvolcha": "2350",
    "cdhrem": "0",
    "bswvalue": "48143",
    "csjvalue": "0",
    "p_bsvolcha": "2350",
    "p_tvalcha": "-29864",
    "bdjvalue": "809",
    "cdwvalue": "440",
    "cvol": "-21",
    "p_cvalcha": "-419",
    "bwvol": "-5118",
    "bshrem": "1480",
    "cshvolume": "0",
    "bdwvalue": "114186",
    "jval": "-1471",
    "tsvolume": "3741",
    "dwvolume": "8862",
    "p_bdvolcha": "4497",
    "bsjvolume": "0",
    "wvol": "-5121",
    "cdwvolume": "2",
    "bsvalue": "48143",
    "p_cdvolcha": "2",
    "bjval": "-809",
    "p_bsvalcha": "28971",
    "bval": "-66852",
    "djvolume": "83",
    "djvalue": "1471",
    "cshrem": "0",
    "p_csvalcha": "0",
    "p_tdvalcha": "58835",
    "bdhvolume": "10320",
    "p_tdvolcha": "4499",
    "bsvolume": "3741",
    "p_bvalcha": "-29445",
    "change": "2.33",
    "cdjvolume": "19",
    "tvol": "-5204",
    "p_tsvalcha": "28971",
    "bswvolume": "3741",
    "cdvalue": "1102",
    "tsvalue": "48143",
    "cval": "-1102",
    "csvalue": "0",
    "p_tvolcha": "-2149",
    "cswvalue": "0",
    "cwvol": "-2",
    "bsjvalue": "0",
    "cdjvalue": "662",
    "p_csvolcha": "0",
    "time": "090339",
    "k50basis": "-4.10",
    "wval": "-66483",
    "cjval": "-662"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
