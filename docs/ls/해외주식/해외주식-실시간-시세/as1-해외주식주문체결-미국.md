---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cdb7e1bc-f7c5-425c-8248-aa83dbb6919f&api_id=0c023f96-5137-48cf-8682-8dd30bbc81be"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "해외주식"
api_id: "0c023f96-5137-48cf-8682-8dd30bbc81be"
api_name: "[해외주식] 실시간 시세"
tr_id: "f0615daa-bed6-400e-8b49-c7f47b1b8e11"
tr_code: "AS1"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/overseas-stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 해외주식주문체결(미국) (AS1)

<!-- request_field_count: 4 -->
<!-- response_field_count: 109 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식 |
| API 페이지 | [해외주식] 실시간 시세 |
| TR명 | 해외주식주문체결(미국) |
| TR코드 | `AS1` |
| 초당 전송 건수 | - |
| 설명 | 해외주식 주문현황 및 시세정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/overseas-stock` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 8 | - |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `lineseq` | 라인일련번호 | String | Y | 10 | - |
| Response Body | `accno` | 계좌번호 | String | Y | 11 | - |
| Response Body | `user` | 조작자ID | String | Y | 8 | - |
| Response Body | `len` | 헤더길이 | String | Y | 6 | - |
| Response Body | `gubun` | 헤더구분 | String | Y | 1 | - |
| Response Body | `compress` | 압축구분 | String | Y | 1 | - |
| Response Body | `encrypt` | 암호구분 | String | Y | 1 | - |
| Response Body | `offset` | 공통시작지점 | String | Y | 3 | - |
| Response Body | `trcode` | TRCODE | String | Y | 8 | - |
| Response Body | `comid` | 이용사번호 | String | Y | 3 | - |
| Response Body | `userid` | 사용자ID | String | Y | 16 | - |
| Response Body | `media` | 접속매체 | String | Y | 2 | - |
| Response Body | `ifid` | I/F일련번호 | String | Y | 3 | - |
| Response Body | `seq` | 전문일련번호 | String | Y | 9 | - |
| Response Body | `trid` | TR추적ID | String | Y | 16 | - |
| Response Body | `pubip` | 공인IP | String | Y | 12 | - |
| Response Body | `prvip` | 사설IP | String | Y | 12 | - |
| Response Body | `pcbpno` | 처리지점번호 | String | Y | 3 | - |
| Response Body | `bpno` | 지점번호 | String | Y | 3 | - |
| Response Body | `termno` | 단말번호 | String | Y | 8 | - |
| Response Body | `lang` | 언어구분 | String | Y | 1 | - |
| Response Body | `proctm` | AP처리시간 | String | Y | 9 | - |
| Response Body | `msgcode` | 메세지코드 | String | Y | 4 | - |
| Response Body | `outgu` | 메세지출력구분 | String | Y | 1 | - |
| Response Body | `compreq` | 압축요청구분 | String | Y | 1 | - |
| Response Body | `funckey` | 기능키 | String | Y | 4 | - |
| Response Body | `reqcnt` | 요청레코드개수 | String | Y | 4 | - |
| Response Body | `filler` | 예비영역 | String | Y | 6 | - |
| Response Body | `cont` | 연속구분 | String | Y | 1 | - |
| Response Body | `contkey` | 연속키값 | String | Y | 18 | - |
| Response Body | `varlen` | 가변시스템길이 | String | Y | 2 | - |
| Response Body | `varhdlen` | 가변해더길이 | String | Y | 2 | - |
| Response Body | `varmsglen` | 가변메시지길이 | String | Y | 2 | - |
| Response Body | `trsrc` | 조회발원지 | String | Y | 1 | - |
| Response Body | `eventid` | I/F이벤트ID | String | Y | 4 | - |
| Response Body | `ifinfo` | I/F정보 | String | Y | 4 | - |
| Response Body | `filler1` | 예비영역 | String | Y | 41 | - |
| Response Body | `sOrdxctPtnCode` | 주문체결유형코드 | String | Y | 2 | - |
| Response Body | `sOrdMktCode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `sOrdPtnCode` | 주문유형코드 | String | Y | 2 | - |
| Response Body | `sMgmtBrnNo` | 관리지점번호 | String | Y | 3 | - |
| Response Body | `sAcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `sAcntNm` | 계좌명 | String | Y | 40 | - |
| Response Body | `sIsuNo` | 종목번호 | String | Y | 12 | - |
| Response Body | `sIsuNm` | 종목명 | String | Y | 40 | - |
| Response Body | `sOrdNo` | 주문번호 | String | Y | 10 | - |
| Response Body | `sOrgOrdNo` | 원주문번호 | String | Y | 10 | - |
| Response Body | `sExecNO` | 체결번호 | String | Y | 10 | - |
| Response Body | `sAbrdExecId` | 해외체결ID | String | Y | 18 | - |
| Response Body | `sOrdQty` | 주문수량 | String | Y | 16 | - |
| Response Body | `sOrdPrc` | 주문가 | String | Y | 13 | - |
| Response Body | `sExecQty` | 체결수량 | String | Y | 16 | - |
| Response Body | `sExecPrc` | 체결가 | String | Y | 13 | - |
| Response Body | `sMdfyCnfQty` | 정정확인수량 | String | Y | 16 | - |
| Response Body | `sMdfyCnfPrc` | 정정확인가 | String | Y | 16 | - |
| Response Body | `sCancCnfQty` | 취소확인수량 | String | Y | 16 | - |
| Response Body | `sRjtQty` | 거부수량 | String | Y | 16 | - |
| Response Body | `sOrdTrxPtnCode` | 주문처리유형코드 | String | Y | 4 | - |
| Response Body | `sMtiordSeqno` | 복수주문일련번호 | String | Y | 10 | - |
| Response Body | `sOrdCndi` | 주문조건 | String | Y | 1 | - |
| Response Body | `sOrdprcPtnCode` | 호가유형코드 | String | Y | 2 | - |
| Response Body | `sShtnIsuNo` | 단축종목번호 | String | Y | 9 | - |
| Response Body | `sOpDrtnNo` | 운용지시번호 | String | Y | 12 | - |
| Response Body | `sUnercQty` | 미체결수량(주문) | String | Y | 16 | - |
| Response Body | `sOrgOrdUnercQty` | 원주문미체결수량 | String | Y | 16 | - |
| Response Body | `sOrgOrdMdfyQty` | 원주문정정수량 | String | Y | 16 | - |
| Response Body | `sOrgOrdCancQty` | 원주문취소수량 | String | Y | 16 | - |
| Response Body | `sOrdAvrExecPrc` | 주문평균체결가 | String | Y | 13 | - |
| Response Body | `sOrdAmt` | 주문금액 | String | Y | 16 | - |
| Response Body | `sStdIsuNo` | 표준종목번호 | String | Y | 12 | - |
| Response Body | `sBnsTp` | 매매구분 | String | Y | 1 | - |
| Response Body | `sCommdaCode` | 통신매체코드 | String | Y | 2 | - |
| Response Body | `sOrdAcntNo` | 주문계좌번호 | String | Y | 20 | - |
| Response Body | `sAgrgtBrnNo` | 집계지점번호 | String | Y | 3 | - |
| Response Body | `sRegMktCode` | 등록시장코드 | String | Y | 2 | - |
| Response Body | `sMnyMgnRat` | 현금증거금률 | String | Y | 7 | - |
| Response Body | `sSubstMgnRat` | 대용증거금률 | String | Y | 9 | - |
| Response Body | `sMnyExecAmt` | 현금체결금액 | String | Y | 16 | - |
| Response Body | `sSubstExecAmt` | 대용체결금액 | String | Y | 16 | - |
| Response Body | `sCmsnAmtExecAmt` | 수수료체결금액 | String | Y | 16 | - |
| Response Body | `sPrdayRuseExecVal` | 전일재사용체결금액 | String | Y | 16 | - |
| Response Body | `sCrdayRuseExecVal` | 금일재사용체결금액 | String | Y | 16 | - |
| Response Body | `sSpotExecQty` | 실물체결수량 | String | Y | 16 | - |
| Response Body | `sStslExecQty` | 공매도체결수량 | String | Y | 16 | - |
| Response Body | `sStrtgCode` | 전략코드 | String | Y | 6 | - |
| Response Body | `sGrpId` | 그룹ID | String | Y | 20 | - |
| Response Body | `sOrdSeqno` | 주문회차 | String | Y | 10 | - |
| Response Body | `sOrdUserId` | 주문자ID | String | Y | 16 | - |
| Response Body | `sExecTime` | 체결시각 | String | Y | 9 | - |
| Response Body | `sRcptExecTime` | 거래소수신체결시각 | String | Y | 9 | - |
| Response Body | `sRjtRsn` | 거부사유 | String | Y | 8 | - |
| Response Body | `sSecBalQty` | 잔고수량 | String | Y | 16 | - |
| Response Body | `sSpotOrdAbleQty` | 실물주문가능수량 | String | Y | 16 | - |
| Response Body | `sOrdAbleRuseQty` | 주문가능재사용수량 | String | Y | 16 | - |
| Response Body | `sFlctQty` | 변동수량 | String | Y | 16 | - |
| Response Body | `sSecBalQtyD2` | 잔고수량(D2) | String | Y | 16 | - |
| Response Body | `sSellAbleQty` | 매도주문가능수량 | String | Y | 16 | - |
| Response Body | `sUnercSellOrdQty` | 미체결매도주문수량 | String | Y | 16 | - |
| Response Body | `sAvrPchsPrc` | 평균매입가 | String | Y | 13 | - |
| Response Body | `sPchsAmt` | 매입금액 | String | Y | 16 | - |
| Response Body | `sDeposit` | 예수금 | String | Y | 16 | - |
| Response Body | `sSubstAmt` | 대용금 | String | Y | 16 | - |
| Response Body | `sCsgnMnyMgn` | 위탁현금증거금액 | String | Y | 16 | - |
| Response Body | `sCsgnSubstMgn` | 위탁대용증거금액 | String | Y | 16 | - |
| Response Body | `sOrdAbleMny` | 주문가능현금 | String | Y | 16 | - |
| Response Body | `sOrdAbleSubstAmt` | 주문가능대용금액 | String | Y | 16 | - |
| Response Body | `sRuseAbleAmt` | 재사용가능금액 | String | Y | 16 | - |
| Response Body | `sMgntrnCode` | 신용거래코드 | String | Y | 3 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "토큰",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "AS1",
    "tr_key": ""
  }
}
```

### Response

```text
문서 미기재
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
