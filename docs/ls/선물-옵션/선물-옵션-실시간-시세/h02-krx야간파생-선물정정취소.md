---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "futroptn-0000-0000-0000-000000000H02"
tr_code: "H02"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KRX야간파생 선물정정취소 (H02)

<!-- request_field_count: 4 -->
<!-- response_field_count: 53 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | KRX야간파생 선물정정취소 |
| TR코드 | `H02` |
| 초당 전송 건수 | - |
| 설명 | 선물옵션 주문현황 및 시세, 투자정보를 실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/futureoption` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `token` | 접근토큰 | String | Y | 1000 | - |
| Request Header | `tr_type` | 거래 Type | String | Y | 1 | - |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래 CD | String | Y | 3 | - |
| Request Body | `tr_key` | 단축코드 | String | N | 8 | - |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | - |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `lineseq` | 라인일련번호 | Number | Y | 10 | - |
| Response Body | `accno` | 계좌번호 | String | Y | 11 | - |
| Response Body | `user` | 조작자ID | String | Y | 8 | - |
| Response Body | `seq` | 일련번호 | Number | Y | 11 | - |
| Response Body | `trcode` | trcode | String | Y | 11 | - |
| Response Body | `megrpno` | 매칭그룹번호 | String | Y | 2 | - |
| Response Body | `boardid` | 보드ID | String | Y | 2 | - |
| Response Body | `memberno` | 회원번호 | String | Y | 5 | - |
| Response Body | `bpno` | 지점번호 | String | Y | 5 | - |
| Response Body | `ordno` | 주문번호 | String | Y | 10 | - |
| Response Body | `orgordno` | 원주문번호 | String | Y | 10 | - |
| Response Body | `expcode` | 종목코드 | String | Y | 12 | - |
| Response Body | `dosugb` | 매도수구분 | String | Y | 1 | - |
| Response Body | `mocagb` | 정정취소구분 | String | Y | 1 | - |
| Response Body | `accno1` | 계좌번호1 | String | Y | 12 | - |
| Response Body | `qty2` | 호가수량 | Number | Y | 10 | - |
| Response Body | `price` | 호가가격 | Number | Y | 11.2 | - |
| Response Body | `ordgb` | 주문유형 | String | Y | 1 | - |
| Response Body | `hogagb` | 호가구분 | String | Y | 1 | - |
| Response Body | `sihogagb` | 시장조성호가구분 | String | Y | 11 | - |
| Response Body | `tradid` | 자사주신고서ID | String | Y | 5 | - |
| Response Body | `treacode` | 자사주매매방법 | String | Y | 1 | - |
| Response Body | `askcode` | 매도유형코드 | String | Y | 2 | - |
| Response Body | `creditcode` | 신용구분코드 | String | Y | 2 | - |
| Response Body | `jakigb` | 위탁자기구분 | String | Y | 2 | - |
| Response Body | `trustnum` | 위탁사번호 | String | Y | 5 | - |
| Response Body | `ptgb` | 프로그램구분 | String | Y | 2 | - |
| Response Body | `substonum` | 대용주권계좌번호 | String | Y | 12 | - |
| Response Body | `accgb` | 계좌구분코드 | String | Y | 2 | - |
| Response Body | `accmarggb` | 계좌증거금코드 | String | Y | 2 | - |
| Response Body | `nationcode` | 국가코드 | String | Y | 3 | - |
| Response Body | `investgb` | 투자자구분 | String | Y | 4 | - |
| Response Body | `forecode` | 외국인코드 | String | Y | 2 | - |
| Response Body | `medcode` | 주문매체구분 | String | Y | 1 | - |
| Response Body | `ordid` | 주문식별자번호 | String | Y | 12 | - |
| Response Body | `macid` | MAC주소 | String | Y | 12 | - |
| Response Body | `orddate` | 호가일자 | String | Y | 8 | - |
| Response Body | `rcvtime` | 회원사주문시각 | String | Y | 9 | - |
| Response Body | `mem_filler` | mem_filler | String | Y | 7 | - |
| Response Body | `mem_accno` | mem_accno | String | Y | 11 | - |
| Response Body | `mem_filler1` | mem_filler1 | String | Y | 42 | - |
| Response Body | `ordacpttm` | 매칭접수시간 | String | Y | 9 | - |
| Response Body | `qty` | 실정정취소수량 | Number | Y | 10 | - |
| Response Body | `autogb` | 자동취소구분 | String | Y | 1 | - |
| Response Body | `rejcode` | 거부사유 | String | Y | 4 | - |
| Response Body | `prgordde` | 프로그램호가신고 | String | Y | 1 | - |
| Response Body | `trdr_id` | 거래자ID | String | Y | 6 | - |
| Response Body | `ord_grp_no` | 호가그룹번호 | String | Y | 2 | - |
| Response Body | `smp_cd` | 자전거래방지코드 | String | Y | 1 | - |
| Response Body | `ord_cond_prc` | 호가조건가격 | Number | Y | 11.2 | - |
| Response Body | `trd_mkt_choic_tp_cd` | 거래시장선택구분코드 | String | Y | 1 | - |
| Response Body | `srtsell_id` | 공매도ID | String | Y | 10 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "토큰",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "H02",
    "tr_key": "101W6000"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "H02"
  },
  "body": {
    "creditcode": "10",
    "orddate": "20250610",
    "prgordde": "1",
    "accno": "***********",
    "macid": "123456789000",
    "mem_filler": "*****",
    "qty2": "1",
    "trcode": "TTRODP11301",
    "ord_grp_no": "",
    "megrpno": "01",
    "substocnum": "",
    "memberno": "00063",
    "mocagb": "3",
    "price": "0.00",
    "boardid": "G1",
    "accgb": "31",
    "rcvtime": "162043600",
    "jakigb": "11",
    "smp_cd": "0",
    "trd_mkt_choic_tp_cd": "1",
    "ord_cond_prc": "0.00",
    "bpno": "00201",
    "medcode": "4",
    "ordgb": "2",
    "nationcode": "410",
    "accmarggb": "10",
    "ordno": "0000000016",
    "qty": "1",
    "mem_accno": "***********",
    "dosugb": "2",
    "ordordno": "0000000015",
    "trdr_id": "",
    "accno1": "0***********",
    "sihogagb": "00000000000",
    "ordacpttm": "162043608",
    "treaid": "0",
    "seq": "160",
    "lineseq": "900000200",
    "rejcode": "0000",
    "autogb": "0",
    "treacode": "0",
    "askcode": "00",
    "ptgb": "00",
    "ordid": "123456789000",
    "trustnum": "",
    "hogagb": "0",
    "forecode": "00",
    "expcode": "KR4101W60000",
    "srtsell_id": "",
    "investgb": "8000",
    "user": ""
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
