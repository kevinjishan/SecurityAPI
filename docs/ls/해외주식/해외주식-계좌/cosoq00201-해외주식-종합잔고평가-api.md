---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cdb7e1bc-f7c5-425c-8248-aa83dbb6919f&api_id=45b5abe1-a6e1-4833-a9cb-7eb0c408dba3"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식"
api_id: "45b5abe1-a6e1-4833-a9cb-7eb0c408dba3"
api_name: "[해외주식] 계좌"
tr_id: "986c2f3d-13be-4df6-8073-13aa369fa8d9"
tr_code: "COSOQ00201"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/overseas-stock/accno"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# 해외주식 종합잔고평가 API (COSOQ00201)

<!-- request_field_count: 11 -->
<!-- response_field_count: 65 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식 |
| API 페이지 | [해외주식] 계좌 |
| TR명 | 해외주식 종합잔고평가 API |
| TR코드 | `COSOQ00201` |
| 초당 전송 건수 | 1 |
| 설명 | 해외주식 계좌별 거래내역 및 잔고 등 계좌에 관련된 서비스를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/overseas-stock/accno` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth토큰이필요한API경우발급한AccessToken을설정하기위한RequestHeaederParameter |
| Request Header | `tr_cd` | 거래CD | String | Y | 10 | LS증권거래코드 |
| Request Header | `tr_cont` | 연속거래여부 | String | Y | 1 | 연속거래여부Y:연속○N:연속× |
| Request Header | `tr_cont_key` | 연속거래Key | String | Y | 18 | 연속일경우그전에내려온연속키값올림 |
| Request Header | `mac_address` | MAC주소 | String | Y | 12 | 법인인경우필수세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `-COSOQ00201InBlock1` | COSOQ00201InBlock1 | Object | Y | - | - |
| Request Body | `-RecCnt` | 레코드갯수 | Object | Y | 5 | 00001 |
| Request Body | `-BaseDt` | 기준일자 | String | Y | 8 | - |
| Request Body | `-CrcyCode` | 통화코드 | String | Y | 3 | ALL@전체<br>USD@미국 |
| Request Body | `-AstkBalTpCode` | 해외증권잔고구분코드 | String | Y | 2 | 00 전체<br>10 일반<br>20 소수점 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Response Header | `tr_cd` | 거래CD | String | Y | 10 | LS증권거래코드 |
| Response Header | `tr_cont` | 연속거래여부 | String | Y | 1 | 연속거래여부Y:연속○N:연속× |
| Response Header | `tr_cont_key` | 연속거래Key | String | Y | 18 | 연속일경우그전에내려온연속키값올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `-COSOQ00201OutBlock1` | COSOQ00201OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Object | Y | 5 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-Pwd` | 비밀번호 | String | Y | 8 | - |
| Response Body | `-BaseDt` | 기준일자 | String | Y | 8 | - |
| Response Body | `-CrcyCode` | 통화코드 | String | Y | 3 | - |
| Response Body | `-AstkBalTpCode` | 해외증권잔고구분코드 | String | Y | 2 | - |
| Response Body | `-COSOQ00201OutBlock2` | COSOQ00201OutBlock2 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Object | Y | 5 | - |
| Response Body | `-ErnRat` | 수익율 | Object | Y | 18.6 | - |
| Response Body | `-DpsConvEvalAmt` | 예수금환산평가금액 | Object | Y | 16 | - |
| Response Body | `-StkConvEvalAmt` | 주식환산평가금액 | Object | Y | 16 | - |
| Response Body | `-DpsastConvEvalAmt` | 예탁자산환산평가금액 | Object | Y | 16 | - |
| Response Body | `-WonEvalSumAmt` | 원화평가합계금액 | Object | Y | 16 | - |
| Response Body | `-ConvEvalPnlAmt` | 환산평가손익금액 | Object | Y | 16 | - |
| Response Body | `-WonDpsBalAmt` | 원화예수금잔고금액 | Object | Y | 16 | - |
| Response Body | `-D2EstiDps` | D2추정예수금 | Object | Y | 16 | - |
| Response Body | `-LoanAmt` | 대출금액 | Object | Y | 16 | - |
| Response Body | `-COSOQ00201OutBlock3` | COSOQ00201OutBlock3 | Object | Y | - | - |
| Response Body | `-CrcyCode` | 통화코드 | String | Y | 3 | - |
| Response Body | `-FcurrDps` | 외화예수금 | Object | Y | 21.4 | - |
| Response Body | `-FcurrEvalAmt` | 외화평가금액 | Object | Y | 21.4 | - |
| Response Body | `-FcurrEvalPnlAmt` | 외화평가손익금액 | Object | Y | 21.4 | - |
| Response Body | `-PnlRat` | 손익율 | Object | Y | 18.6 | - |
| Response Body | `-BaseXchrat` | 기준환율 | Object | Y | 15.4 | - |
| Response Body | `-DpsConvEvalAmt` | 예수금환산평가금액 | Object | Y | 16 | - |
| Response Body | `-PchsAmt` | 매입금액 | Object | Y | 16 | - |
| Response Body | `-StkConvEvalAmt` | 주식환산평가금액 | Object | Y | 16 | - |
| Response Body | `-ConvEvalPnlAmt` | 환산평가손익금액 | Object | Y | 16 | - |
| Response Body | `-FcurrBuyAmt` | 외화매수금액 | Object | Y | 21.4 | - |
| Response Body | `-FcurrOrdAbleAmt` | 외화주문가능금액 | Object | Y | 19.2 | - |
| Response Body | `-LoanAmt` | 대출금액 | Object | Y | 16 | - |
| Response Body | `-COSOQ00201OutBlock4` | COSOQ00201OutBlock4 | Object | Y | - | - |
| Response Body | `-CrcyCode` | 통화코드 | String | Y | 3 | - |
| Response Body | `-ShtnIsuNo` | 단축종목번호 | String | Y | 9 | - |
| Response Body | `-IsuNo` | 종목번호 | String | Y | 12 | - |
| Response Body | `-JpnMktHanglIsuNm` | 일본시장한글종목명 | String | Y | 100 | - |
| Response Body | `-AstkBalTpCode` | 해외증권잔고구분코드 | String | Y | 2 | - |
| Response Body | `-AstkBalTpCodeNm` | 해외증권잔고구분코드명 | String | Y | 40 | - |
| Response Body | `-AstkBalQty` | 해외증권잔고수량 | Object | Y | 28.6 | - |
| Response Body | `-AstkSellAbleQty` | 해외증권매도가능수량 | Object | Y | 28.6 | - |
| Response Body | `-FcstckUprc` | 외화증권단가 | Object | Y | 24.4 | - |
| Response Body | `-FcurrBuyAmt` | 외화매수금액 | Object | Y | 21.4 | - |
| Response Body | `-FcstckMktIsuCode` | 외화증권시장종목코드 | String | Y | 18 | - |
| Response Body | `-OvrsScrtsCurpri` | 해외증권시세 | Object | Y | 28.7 | - |
| Response Body | `-FcurrEvalAmt` | 외화평가금액 | Object | Y | 21.4 | - |
| Response Body | `-FcurrEvalPnlAmt` | 외화평가손익금액 | Object | Y | 21.4 | - |
| Response Body | `-PnlRat` | 손익율 | Object | Y | 18.6 | - |
| Response Body | `-BaseXchrat` | 기준환율 | Object | Y | 15.4 | - |
| Response Body | `-PchsAmt` | 매입금액 | Object | Y | 16 | - |
| Response Body | `-DpsConvEvalAmt` | 예수금환산평가금액 | Object | Y | 16 | - |
| Response Body | `-StkConvEvalAmt` | 주식환산평가금액 | Object | Y | 16 | - |
| Response Body | `-ConvEvalPnlAmt` | 환산평가손익금액 | Object | Y | 16 | - |
| Response Body | `-AstkSettQty` | 해외증권결제수량 | Object | Y | 28.6 | - |
| Response Body | `-MktTpNm` | 시장구분명 | String | Y | 20 | - |
| Response Body | `-FcurrMktCode` | 외화시장코드 | String | Y | 2 | - |
| Response Body | `-LoanDt` | 대출일자 | String | Y | 8 | - |
| Response Body | `-LoanDtlClssCode` | 대출상세분류코드 | String | Y | 2 | - |
| Response Body | `-LoanAmt` | 대출금액 | Object | Y | 16 | - |
| Response Body | `-DueDt` | 만기일자 | String | Y | 8 | - |
| Response Body | `-AstkBasePrc` | 해외증권기준가격 | Object | Y | 28.6 | - |

## 예제

### Request

```json
{
  "COSOQ00201InBlock1": {
    "RecCnt": 1,
    "BaseDt": "20250217",
    "CrcyCode": "ALL",
    "AstkBalTpCode": "00"
  }
}
```

### Response

```json
{
  "COSOQ00201OutBlock1": {
    "RecCnt": 1,
    "AcntNo": "***********",
    "Pwd": "********",
    "BaseDt": "20250428",
    "CrcyCode": "ALL",
    "AstkBalTpCode": "00"
  },
  "COSOQ00201OutBlock2": {
    "RecCnt": 1,
    "ErnRat": "28.810000",
    "DpsConvEvalAmt": 0,
    "StkConvEvalAmt": 6098484,
    "DpsastConvEvalAmt": 6098484,
    "WonEvalSumAmt": 4734180,
    "ConvEvalPnlAmt": 1364304,
    "WonDpsBalAmt": 13927349,
    "D2EstiDps": 13927349,
    "LoanAmt": 0
  },
  "COSOQ00201OutBlock3": [
    {
      "CrcyCode": "USD",
      "FcurrDps": "0.0000",
      "FcurrEvalAmt": "4251.0000",
      "FcurrEvalPnlAmt": "951.0000",
      "PnlRat": "28.818182",
      "BaseXchrat": "1434.6000",
      "DpsConvEvalAmt": 0,
      "PchsAmt": 4734180,
      "StkConvEvalAmt": 6098484,
      "ConvEvalPnlAmt": 1364304,
      "FcurrBuyAmt": "3300.0000",
      "FcurrOrdAbleAmt": "0.00",
      "LoanAmt": 0
    }
  ],
  "COSOQ00201OutBlock4": [
    {
      "CrcyCode": "USD",
      "ShtnIsuNo": "TSLA",
      "IsuNo": "US88160R1014",
      "JpnMktHanglIsuNm": "테슬라",
      "AstkBalTpCode": "10",
      "AstkBalTpCodeNm": "일반",
      "AstkBalQty": "15.000000",
      "AstkSellAbleQty": "15.000000",
      "FcstckUprc": "220.0000",
      "FcurrBuyAmt": "3300.0000",
      "FcstckMktIsuCode": "82US88160R1014",
      "OvrsScrtsCurpri": "283.4000000",
      "FcurrEvalAmt": "4251.0000",
      "FcurrEvalPnlAmt": "951.0000",
      "PnlRat": "28.818182",
      "BaseXchrat": "1434.6000",
      "PchsAmt": 4734180,
      "DpsConvEvalAmt": 0,
      "StkConvEvalAmt": 6098484,
      "ConvEvalPnlAmt": 1364304,
      "AstkSettQty": "15.000000",
      "MktTpNm": "NASDAQ",
      "FcurrMktCode": "82",
      "LoanDt": "",
      "LoanDtlClssCode": "",
      "LoanAmt": 0,
      "DueDt": "",
      "AstkBasePrc": "284.950000"
    }
  ],
  "rsp_cd": "00001",
  "rsp_msg": "조회가 완료되었습니다"
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
