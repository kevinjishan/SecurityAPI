---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=37d22d4d-83cd-40a4-a375-81b010a4a627"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "37d22d4d-83cd-40a4-a375-81b010a4a627"
api_name: "[주식] 계좌"
tr_id: "h6m7jb6n-0mzi-1l6m-fy5w-07wm257eekkw"
tr_code: "CSPAQ12300"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/stock/accno"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# BEP단가조회 (CSPAQ12300)

<!-- request_field_count: 11 -->
<!-- response_field_count: 125 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 계좌 |
| TR명 | BEP단가조회 |
| TR코드 | `CSPAQ12300` |
| 초당 전송 건수 | 1 |
| 설명 | 계좌별 거래내역 및 잔고 등 계좌에 관련된 서비스를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/stock/accno` |
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
| Request Body | `CSPAQ12300InBlock1` | CSPAQ12300InBlock1 | Object | Y | - | - |
| Request Body | `-BalCreTp` | 잔고생성구분 | String | Y | 1 | 0:전체<br>1:현물<br>9:선물대용 |
| Request Body | `-CmsnAppTpCode` | 수수료적용구분 | String | Y | 1 | 0:평가시 수수료 미적용<br>1:평가시 수수료 적용 |
| Request Body | `-D2balBaseQryTp` | D2잔고기준조회구분 | String | Y | 1 | 0:전부조회<br>1:D2잔고 0이상만 조회 |
| Request Body | `-UprcTpCode` | 단가구분 | String | Y | 1 | 0:평균단가<br>1:BEP단가 |

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
| Response Body | `CSPAQ12300OutBlock1` | CSPAQ12300OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-Pwd` | 비밀번호 | String | Y | 8 | - |
| Response Body | `-BalCreTp` | 잔고생성구분 | String | Y | 1 | - |
| Response Body | `-CmsnAppTpCode` | 수수료적용구분 | String | Y | 1 | - |
| Response Body | `-D2balBaseQryTp` | D2잔고기준조회구분 | String | Y | 1 | - |
| Response Body | `-UprcTpCode` | 단가구분 | String | Y | 1 | - |
| Response Body | `CSPAQ12300OutBlock2` | CSPAQ12300OutBlock2 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-BrnNm` | 지점명 | String | Y | 40 | - |
| Response Body | `-AcntNm` | 계좌명 | String | Y | 40 | - |
| Response Body | `-MnyOrdAbleAmt` | 현금주문가능금액 | Number | Y | 16 | - |
| Response Body | `-MnyoutAbleAmt` | 출금가능금액 | Number | Y | 16 | - |
| Response Body | `-SeOrdAbleAmt` | 거래소금액 | Number | Y | 16 | - |
| Response Body | `-KdqOrdAbleAmt` | 코스닥금액 | Number | Y | 16 | - |
| Response Body | `-HtsOrdAbleAmt` | HTS주문가능금액 | Number | Y | 16 | - |
| Response Body | `-MgnRat100pctOrdAbleAmt` | 증거금률100퍼센트주문가능금액 | Number | Y | 16 | - |
| Response Body | `-BalEvalAmt` | 잔고평가금액 | Number | Y | 16 | - |
| Response Body | `-PchsAmt` | 매입금액 | Number | Y | 16 | - |
| Response Body | `-RcvblAmt` | 미수금액 | Number | Y | 16 | - |
| Response Body | `-PnlRat` | 손익율 | Number | Y | 18.6 | - |
| Response Body | `-InvstOrgAmt` | 투자원금 | Number | Y | 20 | - |
| Response Body | `-InvstPlAmt` | 투자손익금액 | Number | Y | 16 | - |
| Response Body | `-CrdtPldgOrdAmt` | 신용담보주문금액 | Number | Y | 16 | - |
| Response Body | `-Dps` | 예수금 | Number | Y | 16 | - |
| Response Body | `-D1Dps` | D1예수금 | Number | Y | 16 | - |
| Response Body | `-D2Dps` | D2예수금 | Number | Y | 16 | - |
| Response Body | `-OrdDt` | 주문일 | String | Y | 8 | - |
| Response Body | `-MnyMgn` | 현금증거금액 | Number | Y | 16 | - |
| Response Body | `-SubstMgn` | 대용증거금액 | Number | Y | 16 | - |
| Response Body | `-SubstAmt` | 대용금액 | Number | Y | 16 | - |
| Response Body | `-PrdayBuyExecAmt` | 전일매수체결금액 | Number | Y | 16 | - |
| Response Body | `-PrdaySellExecAmt` | 전일매도체결금액 | Number | Y | 16 | - |
| Response Body | `-CrdayBuyExecAmt` | 금일매수체결금액 | Number | Y | 16 | - |
| Response Body | `-CrdaySellExecAmt` | 금일매도체결금액 | Number | Y | 16 | - |
| Response Body | `-EvalPnlSum` | 평가손익합계 | Number | Y | 15 | - |
| Response Body | `-DpsastTotamt` | 예탁자산총액 | Number | Y | 16 | - |
| Response Body | `-Evrprc` | 제비용 | Number | Y | 19 | - |
| Response Body | `-RuseAmt` | 재사용금액 | Number | Y | 16 | - |
| Response Body | `-EtclndAmt` | 기타대여금액 | Number | Y | 16 | - |
| Response Body | `-PrcAdjstAmt` | 가정산금액 | Number | Y | 16 | - |
| Response Body | `-D1CmsnAmt` | D1수수료 | Number | Y | 16 | - |
| Response Body | `-D2CmsnAmt` | D2수수료 | Number | Y | 16 | - |
| Response Body | `-D1EvrTax` | D1제세금 | Number | Y | 16 | - |
| Response Body | `-D2EvrTax` | D2제세금 | Number | Y | 16 | - |
| Response Body | `-D1SettPrergAmt` | D1결제예정금액 | Number | Y | 16 | - |
| Response Body | `-D2SettPrergAmt` | D2결제예정금액 | Number | Y | 16 | - |
| Response Body | `-PrdayKseMnyMgn` | 전일KSE현금증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayKseSubstMgn` | 전일KSE대용증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayKseCrdtMnyMgn` | 전일KSE신용현금증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayKseCrdtSubstMgn` | 전일KSE신용대용증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayKseMnyMgn` | 금일KSE현금증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayKseSubstMgn` | 금일KSE대용증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayKseCrdtMnyMgn` | 금일KSE신용현금증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayKseCrdtSubstMgn` | 금일KSE신용대용증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayKdqMnyMgn` | 전일코스닥현금증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayKdqSubstMgn` | 전일코스닥대용증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayKdqCrdtMnyMgn` | 전일코스닥신용현금증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayKdqCrdtSubstMgn` | 전일코스닥신용대용증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayKdqMnyMgn` | 금일코스닥현금증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayKdqSubstMgn` | 금일코스닥대용증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayKdqCrdtMnyMgn` | 금일코스닥신용현금증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayKdqCrdtSubstMgn` | 금일코스닥신용대용증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayFrbrdMnyMgn` | 전일프리보드현금증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayFrbrdSubstMgn` | 전일프리보드대용증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayFrbrdMnyMgn` | 금일프리보드현금증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayFrbrdSubstMgn` | 금일프리보드대용증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayCrbmkMnyMgn` | 전일장외현금증거금 | Number | Y | 16 | - |
| Response Body | `-PrdayCrbmkSubstMgn` | 전일장외대용증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayCrbmkMnyMgn` | 금일장외현금증거금 | Number | Y | 16 | - |
| Response Body | `-CrdayCrbmkSubstMgn` | 금일장외대용증거금 | Number | Y | 16 | - |
| Response Body | `-DpspdgQty` | 예탁담보수량 | Number | Y | 16 | - |
| Response Body | `-BuyAdjstAmtD2` | 매수정산금(D+2) | Number | Y | 16 | - |
| Response Body | `-SellAdjstAmtD2` | 매도정산금(D+2) | Number | Y | 16 | - |
| Response Body | `-RepayRqrdAmtD1` | 변제소요금(D+1) | Number | Y | 16 | - |
| Response Body | `-RepayRqrdAmtD2` | 변제소요금(D+2) | Number | Y | 16 | - |
| Response Body | `-LoanAmt` | 대출금액 | Number | Y | 16 | - |
| Response Body | `CSPAQ12300OutBlock3` | CSPAQ12300OutBlock3 | Object Array | Y | - | - |
| Response Body | `-IsuNo` | 종목번호 | String | Y | 12 | - |
| Response Body | `-IsuNm` | 종목명 | String | Y | 40 | - |
| Response Body | `-SecBalPtnCode` | 유가증권잔고유형코드 | String | Y | 2 | - |
| Response Body | `-SecBalPtnNm` | 유가증권잔고유형명 | String | Y | 40 | - |
| Response Body | `-BalQty` | 잔고수량 | Number | Y | 16 | - |
| Response Body | `-BnsBaseBalQty` | 매매기준잔고수량 | Number | Y | 16 | - |
| Response Body | `-CrdayBuyExecQty` | 금일매수체결수량 | Number | Y | 16 | - |
| Response Body | `-CrdaySellExecQty` | 금일매도체결수량 | Number | Y | 16 | - |
| Response Body | `-SellPrc` | 매도가 | Number | Y | 21.4 | - |
| Response Body | `-BuyPrc` | 매수가 | Number | Y | 21.4 | - |
| Response Body | `-SellPnlAmt` | 매도손익금액 | Number | Y | 16 | - |
| Response Body | `-PnlRat` | 손익율 | Number | Y | 18.6 | - |
| Response Body | `-NowPrc` | 현재가 | Number | Y | 15.2 | - |
| Response Body | `-CrdtAmt` | 신용금액 | Number | Y | 16 | - |
| Response Body | `-DueDt` | 만기일 | String | Y | 8 | - |
| Response Body | `-PrdaySellExecPrc` | 전일매도체결가 | Number | Y | 13.2 | - |
| Response Body | `-PrdaySellQty` | 전일매도수량 | Number | Y | 16 | - |
| Response Body | `-PrdayBuyExecPrc` | 전일매수체결가 | Number | Y | 13.2 | - |
| Response Body | `-PrdayBuyQty` | 전일매수수량 | Number | Y | 16 | - |
| Response Body | `-LoanDt` | 대출일 | String | Y | 8 | - |
| Response Body | `-AvrUprc` | 평균단가 | Number | Y | 13.2 | - |
| Response Body | `-SellAbleQty` | 매도가능수량 | Number | Y | 16 | - |
| Response Body | `-SellOrdQty` | 매도주문수량 | Number | Y | 16 | - |
| Response Body | `-CrdayBuyExecAmt` | 금일매수체결금액 | Number | Y | 16 | - |
| Response Body | `-CrdaySellExecAmt` | 금일매도체결금액 | Number | Y | 16 | - |
| Response Body | `-PrdayBuyExecAmt` | 전일매수체결금액 | Number | Y | 16 | - |
| Response Body | `-PrdaySellExecAmt` | 전일매도체결금액 | Number | Y | 16 | - |
| Response Body | `-BalEvalAmt` | 잔고평가금액 | Number | Y | 16 | - |
| Response Body | `-EvalPnl` | 평가손익 | Number | Y | 16 | - |
| Response Body | `-MnyOrdAbleAmt` | 현금주문가능금액 | Number | Y | 16 | - |
| Response Body | `-OrdAbleAmt` | 주문가능금액 | Number | Y | 16 | - |
| Response Body | `-SellUnercQty` | 매도미체결수량 | Number | Y | 16 | - |
| Response Body | `-SellUnsttQty` | 매도미결제수량 | Number | Y | 16 | - |
| Response Body | `-BuyUnercQty` | 매수미체결수량 | Number | Y | 16 | - |
| Response Body | `-BuyUnsttQty` | 매수미결제수량 | Number | Y | 16 | - |
| Response Body | `-UnsttQty` | 미결제수량 | Number | Y | 16 | - |
| Response Body | `-UnercQty` | 미체결수량 | Number | Y | 16 | - |
| Response Body | `-PrdayCprc` | 전일종가 | Number | Y | 15.2 | - |
| Response Body | `-PchsAmt` | 매입금액 | Number | Y | 16 | - |
| Response Body | `-RegMktCode` | 등록시장코드 | String | Y | 2 | - |
| Response Body | `-LoanDtlClssCode` | 대출상세분류코드 | String | Y | 2 | - |
| Response Body | `-DpspdgLoanQty` | 예탁담보대출수량 | Number | Y | 16 | - |

## 예제

### Request

```json
{
  "CSPAQ12300InBlock1": {
    "RecCnt": 1,
    "BalCreTp": "0",
    "CmsnAppTpCode": "0",
    "D2balBaseQryTp": "0",
    "UprcTpCode": "0"
  }
}
```

### Response

```json
{
  "rsp_cd": "00136",
  "CSPAQ12300OutBlock2": {
    "BuyAdjstAmtD2": 0,
    "KdqOrdAbleAmt": 0,
    "PrdayKdqMnyMgn": 0,
    "D2CmsnAmt": 0,
    "D1EvrTax": 0,
    "CrdayFrbrdMnyMgn": 0,
    "RepayRqrdAmtD2": 0,
    "D1CmsnAmt": 0,
    "CrdayCrbmkMnyMgn": 0,
    "BrnNm": "",
    "PrdayFrbrdMnyMgn": 0,
    "BalEvalAmt": 0,
    "EvalPnlSum": 0,
    "PrdayFrbrdSubstMgn": 0,
    "CrdayKdqSubstMgn": 0,
    "RepayRqrdAmtD1": 0,
    "CrdayKseCrdtMnyMgn": 0,
    "PrdayKdqSubstMgn": 0,
    "PrdayKseMnyMgn": 0,
    "D2EvrTax": 0,
    "MnyOrdAbleAmt": 0,
    "DpspdgQty": 0,
    "SellAdjstAmtD2": 0,
    "PrcAdjstAmt": 0,
    "EtclndAmt": 0,
    "Evrprc": 0,
    "CrdayKdqCrdtSubstMgn": 0,
    "PrdaySellExecAmt": 0,
    "MnyMgn": 0,
    "MgnRat100pctOrdAbleAmt": 0,
    "PrdayKseSubstMgn": 0,
    "OrdDt": "",
    "CrdayCrbmkSubstMgn": 0,
    "InvstPlAmt": 0,
    "D1SettPrergAmt": 0,
    "D2SettPrergAmt": 0,
    "SeOrdAbleAmt": 0,
    "Dps": 0,
    "DpsastTotamt": 0,
    "PrdayBuyExecAmt": 0,
    "D2Dps": 0,
    "CrdtPldgOrdAmt": 0,
    "CrdayKdqMnyMgn": 0,
    "SubstMgn": 0,
    "LoanAmt": 0,
    "PrdayKdqCrdtSubstMgn": 0,
    "PrdayKdqCrdtMnyMgn": 0,
    "InvstOrgAmt": 0,
    "PchsAmt": 0,
    "CrdayFrbrdSubstMgn": 0,
    "PrdayKseCrdtMnyMgn": 0,
    "CrdayBuyExecAmt": 0,
    "PrdayCrbmkMnyMgn": 0,
    "CrdayKdqCrdtMnyMgn": 0,
    "RcvblAmt": 0,
    "HtsOrdAbleAmt": 0,
    "PrdayCrbmkSubstMgn": 0,
    "CrdayKseCrdtSubstMgn": 0,
    "D1Dps": 0,
    "RecCnt": 1,
    "PnlRat": "0.000000",
    "PrdayKseCrdtSubstMgn": 0,
    "AcntNm": "",
    "MnyoutAbleAmt": 0,
    "CrdaySellExecAmt": 0,
    "CrdayKseMnyMgn": 0,
    "SubstAmt": 0,
    "RuseAmt": 0,
    "CrdayKseSubstMgn": 0
  },
  "CSPAQ12300OutBlock1": {
    "RecCnt": 1,
    "UprcTpCode": "0",
    "AcntNo": "20011132702",
    "D2balBaseQryTp": "0",
    "Pwd": "********",
    "CmsnAppTpCode": "0",
    "BalCreTp": "0"
  },
  "CSPAQ12300OutBlock3": [
    {
      "BuyUnercQty": 0,
      "SecBalPtnNm": "유가KSE",
      "BuyUnsttQty": 1,
      "SellUnercQty": 0,
      "UnercQty": 0,
      "SecBalPtnCode": "00",
      "PrdayBuyExecAmt": 0,
      "LoanDtlClssCode": "",
      "BalEvalAmt": 82700,
      "BuyPrc": "60000.0000",
      "SellOrdQty": 0,
      "AvrUprc": "60000.00",
      "BnsBaseBalQty": 1,
      "SellUnsttQty": 0,
      "PchsAmt": 60000,
      "PrdaySellExecPrc": "0.00",
      "PrdayCprc": "68500.00",
      "BalQty": 0,
      "PrdaySellQty": 0,
      "EvalPnl": 22700,
      "CrdayBuyExecAmt": 60000,
      "PrdayBuyExecPrc": "0.00",
      "SellAbleQty": 1,
      "OrdAbleAmt": 0,
      "MnyOrdAbleAmt": 0,
      "NowPrc": "82700.00",
      "CrdtAmt": 0,
      "SellPrc": "0.0000",
      "IsuNm": "삼성전자",
      "CrdayBuyExecQty": 1,
      "DueDt": "",
      "PnlRat": "0.378333",
      "PrdaySellExecAmt": 0,
      "IsuNo": "A005930",
      "CrdaySellExecQty": 0,
      "CrdaySellExecAmt": 0,
      "RegMktCode": "10",
      "LoanDt": "",
      "UnsttQty": 1,
      "PrdayBuyQty": 0,
      "SellPnlAmt": 22700,
      "DpspdgLoanQty": 0
    }
  ],
  "rsp_msg": "조회가 완료되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
