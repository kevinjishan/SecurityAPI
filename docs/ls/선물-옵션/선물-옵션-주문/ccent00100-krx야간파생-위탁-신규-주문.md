---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=b579d38a-3ce5-4b1b-b94e-b0c4bbbf1d27"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "b579d38a-3ce5-4b1b-b94e-b0c4bbbf1d27"
api_name: "[선물/옵션] 주문"
tr_id: "futroptn-0000-0000-0000-00CCENT00100"
tr_code: "CCENT00100"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/order"
content_type: "application/json; charset=UTF-8"
rate_limit: "5"
auth_required: true
---

# KRX야간파생 위탁 신규 주문 (CCENT00100)

<!-- request_field_count: 12 -->
<!-- response_field_count: 39 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 주문 |
| TR명 | KRX야간파생 위탁 신규 주문 |
| TR코드 | `CCENT00100` |
| 초당 전송 건수 | 5 |
| 설명 | 주간/야간 선물옵션 주문서비스를 확인할 수 있습니다 |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/futureoption/order` |
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
| Request Body | `CCENT00100InBlock1` | CCENT00100InBlock1 | Object | Y | - | - |
| Request Body | `-FnoIsuNo` | 선물옵션종목번호 | String | Y | 12 | - |
| Request Body | `-BnsTpCode` | 매매구분 | String | Y | 1 | 1:매도<br>2:매수 |
| Request Body | `-FnoOrdprcPtnCode` | 선물옵션호가유형코드 | String | Y | 2 | 00@지정가<br>03@시장가<br>05@조건부지정가<br>06@최유리지정가<br>10@지정가(IOC)<br>20@지정가(FOK)<br>13@시장가(IOC)<br>23@시장가(FOK)<br>16@최유리지정가(IOC)<br>26@최유리지정가(FOK) |
| Request Body | `-FnoOrdPrc` | 선물옵션주문가격 | Number | Y | 27.8 | - |
| Request Body | `-OrdQty` | 주문수량 | Number | Y | 16 | - |

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
| Response Body | `CCENT00100OutBlock1` | CCENT00100OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-OrdMktCode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-Pwd` | 비밀번호 | String | Y | 8 | - |
| Response Body | `-FnoIsuNo` | 선물옵션종목번호 | String | Y | 12 | - |
| Response Body | `-BnsTpCode` | 매매구분 | String | Y | 1 | - |
| Response Body | `-FnoOrdPtnCode` | 선물옵션주문유형코드 | String | Y | 2 | - |
| Response Body | `-FnoOrdprcPtnCode` | 선물옵션호가유형코드 | String | Y | 2 | - |
| Response Body | `-FnoTrdPtnCode` | 선물옵션거래유형코드 | String | Y | 2 | - |
| Response Body | `-FnoOrdPrc` | 선물옵션주문가격 | Number | Y | 27.8 | - |
| Response Body | `-OrdQty` | 주문수량 | Number | Y | 16 | - |
| Response Body | `-CommdaCode` | 통신매체코드 | String | Y | 2 | - |
| Response Body | `-DscusBnsCmpltTime` | 협의매매완료시각 | String | Y | 9 | - |
| Response Body | `-GrpId` | 그룹ID | String | Y | 20 | - |
| Response Body | `-OrdSeqno` | 주문일련번호 | Number | Y | 10 | - |
| Response Body | `-PtflNo` | 포트폴리오번호 | Number | Y | 10 | - |
| Response Body | `-BskNo` | 바스켓번호 | Number | Y | 10 | - |
| Response Body | `-TrchNo` | 트렌치번호 | Number | Y | 10 | - |
| Response Body | `-ItemNo` | 항목번호 | Number | Y | 16 | - |
| Response Body | `-OpDrtnNo` | 운용지시번호 | String | Y | 12 | - |
| Response Body | `-MgempNo` | 관리사원번호 | String | Y | 9 | - |
| Response Body | `-FundId` | 펀드ID | String | Y | 12 | - |
| Response Body | `-FundOrdNo` | 펀드주문번호 | Number | Y | 10 | - |
| Response Body | `CCENT00100OutBlock2` | CCENT00100OutBlock2 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-OrdNo` | 주문번호 | Number | Y | 10 | - |
| Response Body | `-BrnNm` | 지점명 | String | Y | 40 | - |
| Response Body | `-AcntNm` | 계좌명 | String | Y | 40 | - |
| Response Body | `-IsuNm` | 종목명 | String | Y | 50 | - |
| Response Body | `-OrdAbleAmt` | 주문가능금액 | Number | Y | 16 | - |
| Response Body | `-MnyOrdAbleAmt` | 현금주문가능금액 | Number | Y | 16 | - |
| Response Body | `-OrdMgn` | 주문증거금 | Number | Y | 16 | - |
| Response Body | `-MnyOrdMgn` | 현금주문증거금 | Number | Y | 16 | - |
| Response Body | `-OrdAbleQty` | 주문가능수량 | Number | Y | 16 | - |

## 예제

### Request

```json
{
  "CCENT00100InBlock1": {
    "FnoIsuNo": "101W6000",
    "BnsTpCode": "2",
    "FnoOrdprcPtnCode": "00",
    "FnoOrdPrc": 416,
    "OrdQty": 1
  }
}
```

### Response

```json
{
  "CCENT00100OutBlock1": {
    "RecCnt": 1,
    "OrdMktCode": "40",
    "AcntNo": "***********",
    "Pwd": "********",
    "FnoIsuNo": "101W6000",
    "BnsTpCode": "2",
    "FnoOrdPtnCode": "00",
    "FnoOrdprcPtnCode": "00",
    "FnoTrdPtnCode": "03",
    "FnoOrdPrc": "416.00000000",
    "OrdQty": 1,
    "CommdaCode": "40",
    "DscusBnsCmpltTime": "",
    "GrpId": "",
    "OrdSeqno": 0,
    "PtflNo": 0,
    "BskNo": 0,
    "TrchNo": 0,
    "ItemNo": 0,
    "OpDrtnNo": "",
    "MgempNo": "",
    "FundId": "",
    "FundOrdNo": 0
  },
  "CCENT00100OutBlock2": {
    "RecCnt": 1,
    "OrdNo": 14,
    "BrnNm": "",
    "AcntNm": "***",
    "IsuNm": "F 202506",
    "OrdAbleAmt": 10301798,
    "MnyOrdAbleAmt": 22332251,
    "OrdMgn": 20050754,
    "MnyOrdMgn": 10025376,
    "OrdAbleQty": 0
  },
  "rsp_cd": "00040",
  "rsp_msg": "매수 주문이 완료되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
