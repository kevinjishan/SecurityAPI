---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=47005ce6-8500-4a3d-ad6c-f96ec3251669"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "47005ce6-8500-4a3d-ad6c-f96ec3251669"
api_name: "[선물/옵션] 투자자"
tr_id: "futroptn-0000-0000-0000-0000000t8463"
tr_code: "t8463"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/investor"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# KRX야간파생 투자자시간대별(API용) (t8463)

<!-- request_field_count: 12 -->
<!-- response_field_count: 48 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 투자자 |
| TR명 | KRX야간파생 투자자시간대별(API용) |
| TR코드 | `t8463` |
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
| Request Body | `t8463InBlock` | t8463InBlock | Object | Y | - | - |
| Request Body | `-tm_rng` | 시간대(D/N/U) | String | Y | 1 | - |
| Request Body | `-fot_clsf_cd` | 선물옵션구분 | String | Y | 1 | F : 선물<br>C : 콜옵션<br>P : 풋옵션<br>S : 스프레드 |
| Request Body | `-bsc_asts_id` | 기초자산코드 | String | Y | 3 | K2I : KP200선물/옵션<br>MKI : 미니KP200선물/옵션<br>KQI : 코스닥150선물/옵션<br>WKM : 위클리옵션-월<br>WKI : 위클리옵션-목<br>BM3 : 국채3년선물<br>BMA : 국채10년선물<br>USD : 미국달러선물 |
| Request Body | `-cnt` | 조회건수 | Object | Y | 3 | - |
| Request Body | `-bgubun` | 전일분 | String | Y | 1 | - |

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
| Response Body | `t8463OutBlock` | t8463OutBlock | Object | Y | - | - |
| Response Body | `-tm_rng` | 시간대(D/N/U) | String | Y | 1 | - |
| Response Body | `-fot_clsf_cd` | 선물옵션구분 | String | Y | 1 | - |
| Response Body | `-indcode` | 개인투자자코드 | String | Y | 4 | - |
| Response Body | `-forcode` | 외국인투자자코드 | String | Y | 4 | - |
| Response Body | `-syscode` | 기관계투자자코드 | String | Y | 4 | - |
| Response Body | `-stocode` | 증권투자자코드 | String | Y | 4 | - |
| Response Body | `-invcode` | 투신투자자코드 | String | Y | 4 | - |
| Response Body | `-bancode` | 은행투자자코드 | String | Y | 4 | - |
| Response Body | `-inscode` | 보험투자자코드 | String | Y | 4 | - |
| Response Body | `-fincode` | 종금투자자코드 | String | Y | 4 | - |
| Response Body | `-moncode` | 기금투자자코드 | String | Y | 4 | - |
| Response Body | `-etccode` | 기타투자자코드 | String | Y | 4 | - |
| Response Body | `-natcode` | 국가투자자코드 | String | Y | 4 | - |
| Response Body | `-pefcode` | 사모펀드투자자코드 | String | Y | 4 | - |
| Response Body | `t8463OutBlock1` | t8463OutBlock1 | Object Array | Y | - | - |
| Response Body | `-date` | 일자 | String | Y | 8 | - |
| Response Body | `-time` | 시간 | String | Y | 6 | - |
| Response Body | `-datetime` | 일자시간 | String | Y | 14 | - |
| Response Body | `-bsc_asts_id` | 기초자산코드 | String | Y | 3 | - |
| Response Body | `-indmsvol` | 개인순매수거래량 | Number | Y | 8 | - |
| Response Body | `-indmsamt` | 개인순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-formsvol` | 외국인순매수거래량 | Number | Y | 8 | - |
| Response Body | `-formsamt` | 외국인순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-sysmsvol` | 기관계순매수거래량 | Number | Y | 8 | - |
| Response Body | `-sysmsamt` | 기관계순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-stomsvol` | 증권순매수거래량 | Number | Y | 8 | - |
| Response Body | `-stomsamt` | 증권순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-invmsvol` | 투신순매수거래량 | Number | Y | 8 | - |
| Response Body | `-invmsamt` | 투신순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-banmsvol` | 은행순매수거래량 | Number | Y | 8 | - |
| Response Body | `-banmsamt` | 은행순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-insmsvol` | 보험순매수거래량 | Number | Y | 8 | - |
| Response Body | `-insmsamt` | 보험순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-finmsvol` | 종금순매수거래량 | Number | Y | 8 | - |
| Response Body | `-finmsamt` | 종금순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-monmsvol` | 기금순매수거래량 | Number | Y | 8 | - |
| Response Body | `-monmsamt` | 기금순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-etcmsvol` | 기타순매수거래량 | Number | Y | 8 | - |
| Response Body | `-etcmsamt` | 기타순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-natmsvol` | 국가순매수거래량 | Number | Y | 8 | - |
| Response Body | `-natmsamt` | 국가순매수거래대금 | Number | Y | 12 | - |
| Response Body | `-pefmsvol` | 사모펀드순매수거래량 | Number | Y | 8 | - |
| Response Body | `-pefmsamt` | 사모펀드순매수거래대금 | Number | Y | 12 | - |

## 예제

### Request

```json
{
  "t8463InBlock": {
    "tm_rng": "U",
    "fot_clsf_cd": "F",
    "bsc_asts_id": "K2I",
    "cnt": 10,
    "bgubun": "0"
  }
}
```

### Response

```json
{
  "t8463OutBlock": {
    "tm_rng": "U",
    "fot_clsf_cd": "F",
    "bsc_asts_id": "K2I",
    "indcode": "0008",
    "forcode": "0009",
    "syscode": "0018",
    "stocode": "0001",
    "invcode": "0003",
    "bancode": "0004",
    "inscode": "0002",
    "fincode": "0005",
    "moncode": "0006",
    "etccode": "0007",
    "natcode": "0011",
    "pefcode": "0000"
  },
  "t8463OutBlock1": [
    {
      "date": "20250609",
      "time": "194600",
      "datetime": "20250609",
      "indmsvol": -275,
      "indmsamt": "-263",
      "formsvol": 308,
      "formsamt": "295",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 33,
      "etcmsamt": "31",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
    },
    {
      "date": "20250609",
      "time": "194530",
      "datetime": "20250609",
      "indmsvol": -276,
      "indmsamt": "-264",
      "formsvol": 309,
      "formsamt": "296",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 33,
      "etcmsamt": "31",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
    },
    {
      "date": "20250609",
      "time": "194500",
      "datetime": "20250609",
      "indmsvol": -275,
      "indmsamt": "-263",
      "formsvol": 308,
      "formsamt": "295",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 33,
      "etcmsamt": "31",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
    },
    {
      "date": "20250609",
      "time": "194430",
      "datetime": "20250609",
      "indmsvol": -274,
      "indmsamt": "-262",
      "formsvol": 308,
      "formsamt": "295",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 32,
      "etcmsamt": "30",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
    },
    {
      "date": "20250609",
      "time": "194400",
      "datetime": "20250609",
      "indmsvol": -274,
      "indmsamt": "-262",
      "formsvol": 308,
      "formsamt": "295",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 32,
      "etcmsamt": "30",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
    },
    {
      "date": "20250609",
      "time": "194330",
      "datetime": "20250609",
      "indmsvol": -274,
      "indmsamt": "-262",
      "formsvol": 308,
      "formsamt": "295",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 32,
      "etcmsamt": "30",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
    },
    {
      "date": "20250609",
      "time": "194300",
      "datetime": "20250609",
      "indmsvol": -274,
      "indmsamt": "-262",
      "formsvol": 308,
      "formsamt": "295",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 32,
      "etcmsamt": "30",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
    },
    {
      "date": "20250609",
      "time": "194230",
      "datetime": "20250609",
      "indmsvol": -273,
      "indmsamt": "-261",
      "formsvol": 307,
      "formsamt": "294",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 32,
      "etcmsamt": "30",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
    },
    {
      "date": "20250609",
      "time": "194200",
      "datetime": "20250609",
      "indmsvol": -273,
      "indmsamt": "-261",
      "formsvol": 307,
      "formsamt": "294",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 32,
      "etcmsamt": "30",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
    },
    {
      "date": "20250609",
      "time": "194130",
      "datetime": "20250609",
      "indmsvol": -273,
      "indmsamt": "-261",
      "formsvol": 307,
      "formsamt": "294",
      "sysmsvol": -66,
      "sysmsamt": "-63",
      "stomsvol": -66,
      "stomsamt": "-63",
      "invmsvol": 0,
      "invmsamt": "0",
      "banmsvol": 0,
      "banmsamt": "0",
      "insmsvol": 0,
      "insmsamt": "0",
      "finmsvol": 0,
      "finmsamt": "0",
      "monmsvol": 0,
      "monmsamt": "0",
      "etcmsvol": 32,
      "etcmsamt": "30",
      "natmsvol": 0,
      "natmsamt": "0",
      "pefmsvol": 0,
      "pefmsamt": "0"
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
