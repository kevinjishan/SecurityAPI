---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cdb7e1bc-f7c5-425c-8248-aa83dbb6919f&api_id=45b5abe1-a6e1-4833-a9cb-7eb0c408dba3"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "해외주식"
api_id: "45b5abe1-a6e1-4833-a9cb-7eb0c408dba3"
api_name: "[해외주식] 계좌"
tr_id: "10cc2461-65bf-4d76-a995-e61123a83548"
tr_code: "COSOQ02701"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/overseas-stock/accno"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# 해외주식 예수금 조회 API (COSOQ02701)

<!-- request_field_count: 9 -->
<!-- response_field_count: 47 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식 |
| API 페이지 | [해외주식] 계좌 |
| TR명 | 해외주식 예수금 조회 API |
| TR코드 | `COSOQ02701` |
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
| Request Body | `COSOQ02701InBlock1` | COSOQ02701InBlock1 | Object | Y | - | - |
| Request Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Request Body | `-CrcyCode` | 통화코드 | String | Y | 3 | - |

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
| Response Body | `COSOQ02701OutBlock1` | COSOQ02701OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-Pwd` | 비밀번호 | String | Y | 8 | - |
| Response Body | `-CrcyCode` | 통화코드 | String | Y | 3 | - |
| Response Body | `COSOQ02701OutBlock2` | COSOQ02701OutBlock2 | Object Array | Y | - | - |
| Response Body | `-CrcyCode` | 통화코드 | String | Y | 3 | - |
| Response Body | `-FcurrBuyAdjstAmt1` | 외화매수정산금1 | Number | Y | 17.4 | - |
| Response Body | `-FcurrBuyAdjstAmt2` | 외화매수정산금2 | Number | Y | 17.4 | - |
| Response Body | `-FcurrBuyAdjstAmt3` | 외화매수정산금3 | Number | Y | 17.4 | - |
| Response Body | `-FcurrBuyAdjstAmt4` | 외화매수정산금4 | Number | Y | 17.4 | - |
| Response Body | `-FcurrSellAdjstAmt1` | 외화매도정산금1 | Number | Y | 17.4 | - |
| Response Body | `-FcurrSellAdjstAmt2` | 외화매도정산금2 | Number | Y | 17.4 | - |
| Response Body | `-FcurrSellAdjstAmt3` | 외화매도정산금3 | Number | Y | 17.4 | - |
| Response Body | `-FcurrSellAdjstAmt4` | 외화매도정산금4 | Number | Y | 17.4 | - |
| Response Body | `-PrsmptFcurrDps1` | 추정외화예수금1 | Number | Y | 17.4 | - |
| Response Body | `-PrsmptFcurrDps2` | 추정외화예수금2 | Number | Y | 17.4 | - |
| Response Body | `-PrsmptFcurrDps3` | 추정외화예수금3 | Number | Y | 17.4 | - |
| Response Body | `-PrsmptFcurrDps4` | 추정외화예수금4 | Number | Y | 17.4 | - |
| Response Body | `-PrsmptMxchgAbleAmt1` | 추정환전가능금1 | Number | Y | 17.4 | - |
| Response Body | `-PrsmptMxchgAbleAmt2` | 추정환전가능금2 | Number | Y | 17.4 | - |
| Response Body | `-PrsmptMxchgAbleAmt3` | 추정환전가능금3 | Number | Y | 17.4 | - |
| Response Body | `-PrsmptMxchgAbleAmt4` | 추정환전가능금4 | Number | Y | 17.4 | - |
| Response Body | `COSOQ02701OutBlock3` | COSOQ02701OutBlock3 | Object Array | Y | - | - |
| Response Body | `-CntryNm` | 국가명 | String | Y | 40 | - |
| Response Body | `-CrcyCode` | 통화코드 | String | Y | 3 | - |
| Response Body | `-T4FcurrDps` | T4외화예수금 | Number | Y | 21.4 | - |
| Response Body | `-FcurrDps` | 외화예수금 | Number | Y | 17.4 | - |
| Response Body | `-FcurrOrdAbleAmt` | 외화주문가능금액 | Number | Y | 17.4 | - |
| Response Body | `-PrexchOrdAbleAmt` | 가환전주문가능금액 | Number | Y | 21.4 | - |
| Response Body | `-FcurrOrdAmt` | 외화주문금액 | Number | Y | 24.4 | - |
| Response Body | `-FcurrPldgAmt` | 외화담보금액 | Number | Y | 17.4 | - |
| Response Body | `-ExecRuseFcurrAmt` | 체결재사용외화금액 | Number | Y | 17.4 | - |
| Response Body | `-FcurrMxchgAbleAmt` | 외화환전가능금 | Number | Y | 17.4 | - |
| Response Body | `-BaseXchrat` | 기준환율 | Number | Y | 15.4 | - |
| Response Body | `COSOQ02701OutBlock4` | COSOQ02701OutBlock4 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-WonDpsBalAmt` | 원화예수금잔고금액 | Number | Y | 16 | - |
| Response Body | `-MnyoutAbleAmt` | 출금가능금액 | Number | Y | 16 | - |
| Response Body | `-WonPrexchAbleAmt` | 원화가환전가능금액 | Number | Y | 16 | - |
| Response Body | `-OvrsMgn` | 해외증거금 | Number | Y | 17 | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-NrfCode` | 내외국인코드 | String | Y | 2 | - |

## 예제

### Request

```json
{
  "COSOQ02701InBlock1": {
    "RecCnt": 1,
    "CrcyCode": "ALL"
  }
}
```

### Response

```json
{
  "COSOQ02701OutBlock1": {
    "RecCnt": 1,
    "AcntNo": "***********",
    "Pwd": "********",
    "CrcyCode": "ALL"
  },
  "COSOQ02701OutBlock2": [
    {
      "CrcyCode": "JPY",
      "FcurrBuyAdjstAmt1": "0.0000",
      "FcurrBuyAdjstAmt2": "0.0000",
      "FcurrBuyAdjstAmt3": "0.0000",
      "FcurrBuyAdjstAmt4": "0.0000",
      "FcurrSellAdjstAmt1": "0.0000",
      "FcurrSellAdjstAmt2": "0.0000",
      "FcurrSellAdjstAmt3": "0.0000",
      "FcurrSellAdjstAmt4": "0.0000",
      "PrsmptFcurrDps1": "0.0000",
      "PrsmptFcurrDps2": "0.0000",
      "PrsmptFcurrDps3": "0.0000",
      "PrsmptFcurrDps4": "0.0000",
      "PrsmptMxchgAbleAmt1": "0.0000",
      "PrsmptMxchgAbleAmt2": "0.0000",
      "PrsmptMxchgAbleAmt3": "0.0000",
      "PrsmptMxchgAbleAmt4": "0.0000"
    },
    {
      "CrcyCode": "HKD",
      "FcurrBuyAdjstAmt1": "0.0000",
      "FcurrBuyAdjstAmt2": "0.0000",
      "FcurrBuyAdjstAmt3": "0.0000",
      "FcurrBuyAdjstAmt4": "0.0000",
      "FcurrSellAdjstAmt1": "0.0000",
      "FcurrSellAdjstAmt2": "0.0000",
      "FcurrSellAdjstAmt3": "0.0000",
      "FcurrSellAdjstAmt4": "0.0000",
      "PrsmptFcurrDps1": "0.0000",
      "PrsmptFcurrDps2": "0.0000",
      "PrsmptFcurrDps3": "0.0000",
      "PrsmptFcurrDps4": "0.0000",
      "PrsmptMxchgAbleAmt1": "0.0000",
      "PrsmptMxchgAbleAmt2": "0.0000",
      "PrsmptMxchgAbleAmt3": "0.0000",
      "PrsmptMxchgAbleAmt4": "0.0000"
    },
    {
      "CrcyCode": "CNY",
      "FcurrBuyAdjstAmt1": "0.0000",
      "FcurrBuyAdjstAmt2": "0.0000",
      "FcurrBuyAdjstAmt3": "0.0000",
      "FcurrBuyAdjstAmt4": "0.0000",
      "FcurrSellAdjstAmt1": "0.0000",
      "FcurrSellAdjstAmt2": "0.0000",
      "FcurrSellAdjstAmt3": "0.0000",
      "FcurrSellAdjstAmt4": "0.0000",
      "PrsmptFcurrDps1": "0.0000",
      "PrsmptFcurrDps2": "0.0000",
      "PrsmptFcurrDps3": "0.0000",
      "PrsmptFcurrDps4": "0.0000",
      "PrsmptMxchgAbleAmt1": "0.0000",
      "PrsmptMxchgAbleAmt2": "0.0000",
      "PrsmptMxchgAbleAmt3": "0.0000",
      "PrsmptMxchgAbleAmt4": "0.0000"
    },
    {
      "CrcyCode": "USD",
      "FcurrBuyAdjstAmt1": "0.0000",
      "FcurrBuyAdjstAmt2": "0.0000",
      "FcurrBuyAdjstAmt3": "0.0000",
      "FcurrBuyAdjstAmt4": "0.0000",
      "FcurrSellAdjstAmt1": "0.0000",
      "FcurrSellAdjstAmt2": "0.0000",
      "FcurrSellAdjstAmt3": "0.0000",
      "FcurrSellAdjstAmt4": "0.0000",
      "PrsmptFcurrDps1": "0.0000",
      "PrsmptFcurrDps2": "0.0000",
      "PrsmptFcurrDps3": "0.0000",
      "PrsmptFcurrDps4": "0.0000",
      "PrsmptMxchgAbleAmt1": "0.0000",
      "PrsmptMxchgAbleAmt2": "0.0000",
      "PrsmptMxchgAbleAmt3": "0.0000",
      "PrsmptMxchgAbleAmt4": "0.0000"
    }
  ],
  "COSOQ02701OutBlock3": [
    {
      "CntryNm": "미국",
      "CrcyCode": "USD",
      "T4FcurrDps": "0.0000",
      "FcurrDps": "0.0000",
      "FcurrOrdAbleAmt": "0.0000",
      "PrexchOrdAbleAmt": "9245.8800",
      "FcurrOrdAmt": "9245.8800",
      "FcurrPldgAmt": "0.0000",
      "ExecRuseFcurrAmt": "0.0000",
      "FcurrMxchgAbleAmt": "0.0000",
      "BaseXchrat": "1434.6000"
    },
    {
      "CntryNm": "홍콩",
      "CrcyCode": "HKD",
      "T4FcurrDps": "0.0000",
      "FcurrDps": "0.0000",
      "FcurrOrdAbleAmt": "0.0000",
      "PrexchOrdAbleAmt": "71721.3200",
      "FcurrOrdAmt": "71721.3200",
      "FcurrPldgAmt": "0.0000",
      "ExecRuseFcurrAmt": "0.0000",
      "FcurrMxchgAbleAmt": "0.0000",
      "BaseXchrat": "184.9400"
    }
  ],
  "COSOQ02701OutBlock4": {
    "RecCnt": 1,
    "WonDpsBalAmt": 13927349,
    "MnyoutAbleAmt": 13927349,
    "WonPrexchAbleAmt": 13927349,
    "OvrsMgn": 0
  },
  "COSOQ02701OutBlock5": {
    "RecCnt": 1,
    "NrfCode": "01"
  },
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
