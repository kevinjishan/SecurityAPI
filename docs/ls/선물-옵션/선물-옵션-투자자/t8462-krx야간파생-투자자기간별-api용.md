---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=47005ce6-8500-4a3d-ad6c-f96ec3251669"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "선물/옵션"
api_id: "47005ce6-8500-4a3d-ad6c-f96ec3251669"
api_name: "[선물/옵션] 투자자"
tr_id: "futroptn-0000-0000-0000-0000000t8462"
tr_code: "t8462"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/investor"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# KRX야간파생 투자자기간별(API용) (t8462)

<!-- request_field_count: 14 -->
<!-- response_field_count: 34 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 투자자 |
| TR명 | KRX야간파생 투자자기간별(API용) |
| TR코드 | `t8462` |
| 초당 전송 건수 | 1 |
| 설명 | 상품선물 투자자별 데이터를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/futureoption/investor` |
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
| Request Body | `t8462InBlock` | t8462InBlock | Object | Y | - | - |
| Request Body | `-tm_rng` | 시간대(D/N/U) | String | Y | 1 | - |
| Request Body | `-fot_clsf_cd` | 선물옵션구분 | String | Y | 1 | F : 선물<br>C : 콜옵션<br>P : 풋옵션<br>S : 스프레드 |
| Request Body | `-bsc_asts_id` | 기초자산코드 | String | Y | 3 | K2I : KP200선물/옵션<br>MKI : 미니KP200선물/옵션<br>KQI : 코스닥150선물/옵션<br>WKM : 위클리옵션-월<br>WKI : 위클리옵션-목<br>BM3 : 국채3년선물<br>BMA : 국채10년선물<br>USD : 미국달러선물 |
| Request Body | `-gubun2` | 수치구분(1:수치2:누적) | String | Y | 1 | - |
| Request Body | `-gubun3` | 단위구분(1:일2:주3:월) | String | Y | 1 | - |
| Request Body | `-from_date` | 시작날짜 | String | Y | 8 | - |
| Request Body | `-to_date` | 종료날짜 | String | Y | 8 | - |

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
| Response Body | `t8462OutBlock` | t8462OutBlock | Object | Y | - | - |
| Response Body | `-tm_rng` | 시간대(D/N/U) | String | Y | 1 | - |
| Response Body | `-fot_clsf_cd` | 선물옵션구분 | String | Y | 1 | - |
| Response Body | `-bsc_asts_id` | 기초자산코드 | String | Y | 3 | - |
| Response Body | `t8462OutBlock1` | t8462OutBlock1 | Object | Y | - | - |
| Response Body | `-date` | 일자 | String | Y | 8 | - |
| Response Body | `-sv_08` | 개인수량 | Number | Y | 12 | - |
| Response Body | `-sv_17` | 외국인수량 | Number | Y | 12 | - |
| Response Body | `-sv_18` | 기관계수량 | Number | Y | 12 | - |
| Response Body | `-sv_01` | 증권수량 | Number | Y | 12 | - |
| Response Body | `-sv_03` | 투신수량 | Number | Y | 12 | - |
| Response Body | `-sv_04` | 은행수량 | Number | Y | 12 | - |
| Response Body | `-sv_02` | 보험수량 | Number | Y | 12 | - |
| Response Body | `-sv_05` | 종금수량 | Number | Y | 12 | - |
| Response Body | `-sv_06` | 기금수량 | Number | Y | 12 | - |
| Response Body | `-sv_07` | 기타수량 | Number | Y | 12 | - |
| Response Body | `-sv_15` | 선물수량 | Number | Y | 12 | - |
| Response Body | `-sv_00` | 사모펀드수량 | Number | Y | 12 | - |
| Response Body | `-sa_08` | 개인금액 | Number | Y | 12 | - |
| Response Body | `-sa_17` | 외국인금액 | Number | Y | 12 | - |
| Response Body | `-sa_18` | 기관계금액 | Number | Y | 12 | - |
| Response Body | `-sa_01` | 증권금액 | Number | Y | 12 | - |
| Response Body | `-sa_03` | 투신금액 | Number | Y | 12 | - |
| Response Body | `-sa_04` | 은행금액 | Number | Y | 12 | - |
| Response Body | `-sa_02` | 보험금액 | Number | Y | 12 | - |
| Response Body | `-sa_05` | 종금금액 | Number | Y | 12 | - |
| Response Body | `-sa_06` | 기금금액 | Number | Y | 12 | - |
| Response Body | `-sa_07` | 기타금액 | Number | Y | 12 | - |
| Response Body | `-sa_15` | 선물금액 | Number | Y | 12 | - |
| Response Body | `-sa_00` | 사모펀드금액 | Number | Y | 12 | - |

## 예제

### Request

```json
{
  "t8462InBlock": {
    "tm_rng": "N",
    "fot_clsf_cd": "F",
    "bsc_asts_id": "K2I",
    "gubun2": "1",
    "gubun3": "1",
    "from_date": "20250609",
    "to_date": "20250610"
  }
}
```

### Response

```json
{
  "t8462OutBlock": {
    "tm_rng": "N",
    "fot_clsf_cd": "F",
    "bsc_asts_id": "K2I"
  },
  "t8462OutBlock1": [
    {
      "date": "20250610",
      "sv_08": -299,
      "sv_17": 335,
      "sv_18": -69,
      "sv_01": -69,
      "sv_03": 0,
      "sv_04": 0,
      "sv_02": 0,
      "sv_05": 0,
      "sv_06": 0,
      "sv_07": 33,
      "sv_15": 0,
      "sv_00": 0,
      "sa_08": "-287",
      "sa_17": "321",
      "sa_18": "-66",
      "sa_01": "-66",
      "sa_03": "0",
      "sa_04": "0",
      "sa_02": "0",
      "sa_05": "0",
      "sa_06": "0",
      "sa_07": "32",
      "sa_15": "0",
      "sa_00": "0"
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
