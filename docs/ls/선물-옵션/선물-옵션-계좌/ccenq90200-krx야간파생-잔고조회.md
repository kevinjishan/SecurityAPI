---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=09a668df-d7e8-4b5c-977f-91d1429b931a"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "09a668df-d7e8-4b5c-977f-91d1429b931a"
api_name: "[선물/옵션] 계좌"
tr_id: "futroptn-0000-0000-0000-00CCENQ90200"
tr_code: "CCENQ90200"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/accno"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# KRX야간파생 잔고조회 (CCENQ90200)

<!-- request_field_count: 10 -->
<!-- response_field_count: 51 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 계좌 |
| TR명 | KRX야간파생 잔고조회 |
| TR코드 | `CCENQ90200` |
| 초당 전송 건수 | 1 |
| 설명 | 주간/야간 선물옵션 계좌별 거래내역 및 잔고 등 계좌에 관련된 서비스를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/futureoption/accno` |
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
| Request Body | `CCENQ90200InBlock1` | CCENQ90200InBlock1 | Object | Y | - | - |
| Request Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | 1 |
| Request Body | `-BalEvalTp` | 잔고평가구분 | String | Y | 1 | 0:기본설정<br> 1:이동평균법<br> 2:선입선출법 |
| Request Body | `-FutsPrcEvalTp` | 선물가격평가구분 | String | Y | 1 | 1:당초가<br> 2:전일종가 |

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
| Response Body | `CCENQ90200OutBlock1` | CCENQ90200OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-InptPwd` | 입력비밀번호 | String | Y | 8 | - |
| Response Body | `-BalEvalTp` | 잔고평가구분 | String | Y | 1 | - |
| Response Body | `-FutsPrcEvalTp` | 선물가격평가구분 | String | Y | 1 | - |
| Response Body | `CCENQ90200OutBlock2` | CCENQ90200OutBlock2 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | String | Y | 5 | - |
| Response Body | `-AcntNm` | 계좌명 | String | Y | 40 | - |
| Response Body | `-EvalDpsamtTotamt` | 평가예탁금총액 | Number | Y | 15 | - |
| Response Body | `-MnyEvalDpstgAmt` | 현금평가예탁금액 | Number | Y | 15 | - |
| Response Body | `-DpsamtTotamt` | 예탁금총액 | Number | Y | 16 | - |
| Response Body | `-DpstgMny` | 예탁현금 | Number | Y | 16 | - |
| Response Body | `-DpstgSubst` | 예탁대용 | Number | Y | 16 | - |
| Response Body | `-PsnOutAbleTotAmt` | 인출가능총금액 | Number | Y | 15 | - |
| Response Body | `-PsnOutAbleCurAmt` | 인출가능현금액 | Number | Y | 16 | - |
| Response Body | `-PsnOutAbleSubstAmt` | 인출가능대용금액 | Number | N | 16 | - |
| Response Body | `-OrdAbleTotAmt` | 주문가능총금액 | Number | Y | 15 | - |
| Response Body | `-MnyOrdAbleAmt` | 현금주문가능금액 | Number | Y | 16 | - |
| Response Body | `-CsgnMgnTotamt` | 위탁증거금총액 | Number | Y | 16 | - |
| Response Body | `-MnyCsgnMgn` | 현금위탁증거금액 | Number | Y | 16 | - |
| Response Body | `-MtmgnTotamt` | 유지증거금총액 | Number | Y | 15 | - |
| Response Body | `-MnyMaintMgn` | 현금유지증거금액 | Number | Y | 16 | - |
| Response Body | `-EvalAmtSum` | 평가금액합계 | Number | Y | 17 | - |
| Response Body | `-RcvblOdpnt` | 미수연체료 | Number | Y | 16 | - |
| Response Body | `-AddMgnTotamt` | 추가증거금총액 | Number | Y | 15 | - |
| Response Body | `-EvalPnlSum` | 평가손익합계 | Number | Y | 15 | - |
| Response Body | `-RcvblAmt` | 미수금액 | Number | Y | 16 | - |
| Response Body | `-MnyAddMgn` | 현금추가증거금액 | Number | Y | 16 | - |
| Response Body | `-FutsEvalPnlAmt` | 선물평가손익금액 | Number | Y | 16 | - |
| Response Body | `-OptEvalPnlAmt` | 옵션평가손익금액 | Number | Y | 16 | - |
| Response Body | `-OptEvalAmt` | 옵션평가금액 | Number | Y | 16 | - |
| Response Body | `CCENQ90200OutBlock3` | CCENQ90200OutBlock3 | Object | Y | - | - |
| Response Body | `-FnoIsuNo` | 선물옵션종목번호 | String | Y | 12 | - |
| Response Body | `-IsuNm` | 종목명 | String | Y | 40 | - |
| Response Body | `-BnsTpCode` | 매매구분 | String | Y | 1 | - |
| Response Body | `-BnsTpNm` | 매매구분 | String | Y | 10 | - |
| Response Body | `-UnsttQty` | 미결제수량 | Number | Y | 16 | - |
| Response Body | `-FnoAvrPrc` | 평균가 | Number | Y | 198 | - |
| Response Body | `-FnoNowPrc` | 선물옵션현재가 | Number | Y | 278 | - |
| Response Body | `-FnoCmpPrc` | 선물옵션대비가 | Number | Y | 278 | - |
| Response Body | `-EvalPnl` | 평가손익 | Number | Y | 16 | - |
| Response Body | `-PnlRat` | 손익율 | Number | Y | 186 | - |
| Response Body | `-FnoTrdUnitAmt` | 선물옵션거래단위금액 | Number | Y | 198 | - |
| Response Body | `-EvalAmt` | 평가금액 | Number | Y | 16 | - |
| Response Body | `-EvalRat` | 평가비율 | Number | Y | 72 | - |
| Response Body | `-BnsplAmt` | 매매손익금액 | Number | Y | 16 | - |

## 예제

### Request

```json
{
  "CCENQ90200InBlock1": {
    "RecCnt": 1,
    "BalEvalTp": "0",
    "FutsPrcEvalTp": "0"
  }
}
```

### Response

```json
{
  "CCENQ90200OutBlock1": {
    "RecCnt": 1,
    "AcntNo": "***********",
    "InptPwd": "********",
    "BalEvalTp": "2",
    "FutsPrcEvalTp": "1"
  },
  "CCENQ90200OutBlock2": {
    "RecCnt": 1,
    "AcntNm": "***",
    "EvalDpsamtTotamt": 34399538,
    "MnyEvalDpstgAmt": 34399538,
    "DpsamtTotamt": 31925203,
    "DpstgMny": 31925203,
    "DpstgSubst": 0,
    "PsnOutAbleTotAmt": 20321010,
    "PsnOutAbleCurAmt": 20321010,
    "PsnOutAbleSubstAmt": 0,
    "OrdAbleTotAmt": 20327175,
    "MnyOrdAbleAmt": 20327175,
    "CsgnMgnTotamt": 11598028,
    "MnyCsgnMgn": 4580264,
    "MtmgnTotamt": 2673434,
    "MnyMaintMgn": 0,
    "EvalAmtSum": 6288000,
    "RcvblOdpnt": 0,
    "AddMgnTotamt": 0,
    "EvalPnlSum": 6288000,
    "RcvblAmt": 0,
    "MnyAddMgn": 0,
    "FutsEvalPnlAmt": 6288000,
    "OptEvalPnlAmt": 0,
    "OptEvalAmt": 0
  },
  "CCENQ90200OutBlock3": [
    {
      "FnoIsuNo": "105W6000",
      "IsuNm": "MF 2506",
      "BnsTpCode": "2",
      "BnsTpNm": "매수",
      "UnsttQty": 2,
      "FnoAvrPrc": "343.70000000",
      "FnoNowPrc": "406.58000000",
      "FnoCmpPrc": "62.88000000",
      "EvalPnl": 6288000,
      "PnlRat": "18.300000",
      "FnoTrdUnitAmt": "50000.00000000",
      "EvalAmt": 40658000,
      "EvalRat": "1.18",
      "BnsplAmt": 0
    }
  ],
  "rsp_cd": "00136",
  "rsp_msg": "조회가 완료되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
