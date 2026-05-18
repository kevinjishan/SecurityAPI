---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=c1ef0e8b-4666-4d8c-a77f-6ab488cfdb39&api_id=3dc1c51b-5ff2-456d-ad2a-055e78ba2b03"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "해외선물"
api_id: "3dc1c51b-5ff2-456d-ad2a-055e78ba2b03"
api_name: "[해외선물] 실시간 시세"
tr_id: "35vp7151-20e2-oapm-7l7a-gr538k3s2ir3"
tr_code: "TC2"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/overseas-futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 해외선물 주문응답 (TC2)

<!-- request_field_count: 4 -->
<!-- response_field_count: 26 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외선물 |
| API 페이지 | [해외선물] 실시간 시세 |
| TR명 | 해외선물 주문응답 |
| TR코드 | `TC2` |
| 초당 전송 건수 | - |
| 설명 | 해외선물옵션 주문현황 및 시세정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/overseas-futureoption` |
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
| Response Body | `lineseq` | 라인일련번호 | String | Y | 10 | - |
| Response Body | `key` | KEY | String | Y | 11 | - |
| Response Body | `user` | 조작자ID | String | Y | 8 | - |
| Response Body | `svc_id` | 서비스ID | String | Y | 4 | HO02:확인<br>HO03:거부 |
| Response Body | `ordr_dt` | 주문일자 | String | Y | 8 | - |
| Response Body | `brn_cd` | 지점번호 | String | Y | 3 | - |
| Response Body | `ordr_no` | 주문번호 | String | Y | 10 | - |
| Response Body | `orgn_ordr_no` | 원주문번호 | String | Y | 10 | - |
| Response Body | `mthr_ordr_no` | 모주문번호 | String | Y | 10 | - |
| Response Body | `ac_no` | 계좌번호 | String | Y | 11 | - |
| Response Body | `is_cd` | 종목코드 | String | Y | 30 | - |
| Response Body | `s_b_ccd` | 매도매수유형 | String | Y | 1 | 1:매도<br>2:매수 |
| Response Body | `ordr_ccd` | 정정취소유형 | String | Y | 1 | 1:신규<br>2:정정<br>3:취소 |
| Response Body | `ordr_typ_cd` | 주문유형코드 | String | Y | 1 | 1:시장가<br>2:지정가<br>3:Stop Market<br>4:Stop Limit |
| Response Body | `ordr_typ_prd_ccd` | 주문기간코드 | String | Y | 2 | 01:일반<br>02:Average<br>03:Spread |
| Response Body | `ordr_aplc_strt_dt` | 주문적용시작일자 | String | Y | 8 | - |
| Response Body | `ordr_aplc_end_dt` | 주문적용종료일자 | String | Y | 8 | - |
| Response Body | `ordr_prc` | 주문가격 | String | Y | 18.11 | - |
| Response Body | `cndt_ordr_prc` | 주문조건가격 | String | Y | 18.11 | - |
| Response Body | `ordr_q` | 주문수량 | String | Y | 12 | - |
| Response Body | `ordr_tm` | 주문시간 | String | Y | 9 | - |
| Response Body | `cnfr_q` | 호가확인수량 | String | Y | 12 | - |
| Response Body | `rfsl_cd` | 호가거부사유코드 | String | Y | 4 | - |
| Response Body | `text` | 호가거부사유코드명 | String | Y | 80 | - |
| Response Body | `userid` | 사용자ID | String | Y | 8 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjljZWVkOWI3LTk4MTgtNDIwNi1hNmM3LTU1NjZiOWE0NWFjYyIsIm5iZiI6MTY4NjYzMjY5MywiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzE5MDkzLCJpYXQiOjE2ODY2MzI2OTMsImp0aSI6IlBTMzA3em5Jd2ZMSWxXR1Bhbm1SN2ZtMzl2NXRDbWYydWFPWCJ9.l4l_wi59UXOBE_lZTL2wOSx40S_fIFdkHzBsK5ksMZ38LZGgy-MVl5onWCZg8-VaoGZIeClSj-8s2Tzs_gRDYQ",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "TC2",
    "tr_key": ""
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "TC2"
  },
  "body": {
    "lineseq": " ",
    "s_b_ccd": "1",
    "ordr_typ_prd_ccd": "01",
    "is_cd": "ADM23",
    "ordr_dt": "20230614",
    "orgn_ordr_no": "29",
    "svc_id": "HO02",
    "ordr_aplc_strt_dt": "",
    "brn_cd": "000",
    "ordr_ccd": "2",
    "mthr_ordr_no": "29",
    "ac_no": "20629783903",
    "user": "qzvjaf",
    "ordr_no": "30",
    "ordr_typ_cd": "2",
    "key": "20629783903"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
