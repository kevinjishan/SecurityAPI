---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=57936c91-b49d-4702-b7f6-3935c6859462"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "57936c91-b49d-4702-b7f6-3935c6859462"
api_name: "[선물/옵션] 실시간 시세"
tr_id: "futroptn-0000-0000-0000-000000000O02"
tr_code: "O02"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/futureoption"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# KRX야간파생 선물접수 (O02)

<!-- request_field_count: 4 -->
<!-- response_field_count: 120 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 실시간 시세 |
| TR명 | KRX야간파생 선물접수 |
| TR코드 | `O02` |
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
| Response Body | `len` | 헤더길이 | Number | Y | 6 | - |
| Response Body | `gubun` | 헤더구분 | String | Y | 1 | - |
| Response Body | `compress` | 압축구분 | String | Y | 1 | - |
| Response Body | `encrypt` | 암호구분 | String | Y | 1 | - |
| Response Body | `offset` | 공통시작지점 | Number | Y | 3 | - |
| Response Body | `trcode` | TRCODE | String | Y | 8 | - |
| Response Body | `compid` | 이용사번호 | String | Y | 3 | - |
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
| Response Body | `proctm` | AP처리시간 | Number | Y | 9 | - |
| Response Body | `msgcode` | 메세지코드 | String | Y | 4 | - |
| Response Body | `outgu` | 메세지출력구분 | String | Y | 1 | - |
| Response Body | `compreq` | 압축요청구분 | String | Y | 1 | - |
| Response Body | `funckey` | 기능키 | String | Y | 4 | - |
| Response Body | `reqcnt` | 요청레코드개수 | Number | Y | 4 | - |
| Response Body | `filler` | 예비영역 | String | Y | 6 | - |
| Response Body | `cont` | 연속구분 | String | Y | 1 | - |
| Response Body | `contkey` | 연속키값 | String | Y | 18 | - |
| Response Body | `varlen` | 가변시스템길이 | Number | Y | 2 | - |
| Response Body | `varhdlen` | 가변해더길이 | Number | Y | 2 | - |
| Response Body | `varmsglen` | 가변메시지길이 | Number | Y | 2 | - |
| Response Body | `trsrc` | 조회발원지 | String | Y | 1 | - |
| Response Body | `eventid` | I/F이벤트ID | String | Y | 4 | - |
| Response Body | `ifinfo` | I/F정보 | String | Y | 4 | - |
| Response Body | `filler1` | 예비영역 | String | Y | 41 | - |
| Response Body | `trcode1` | tr코드 | String | Y | 4 | - |
| Response Body | `firmno` | 회사번호 | String | Y | 3 | - |
| Response Body | `acntno` | 계좌번호 | String | Y | 11 | - |
| Response Body | `acntno1` | 계좌번호 | String | Y | 9 | - |
| Response Body | `acntnm` | 계좌명 | String | Y | 40 | - |
| Response Body | `brnno` | 지점번호 | String | Y | 3 | - |
| Response Body | `ordmktcode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `ordno1` | 주문번호 | String | Y | 3 | - |
| Response Body | `ordno` | 주문번호 | Number | Y | 7 | - |
| Response Body | `orgordno1` | 원주문번호 | String | Y | 3 | - |
| Response Body | `orgordno` | 원주문번호 | Number | Y | 7 | - |
| Response Body | `prntordno` | 모주문번호 | String | Y | 3 | - |
| Response Body | `prntordno1` | 모주문번호 | Number | Y | 7 | - |
| Response Body | `isuno` | 종목번호 | String | Y | 12 | - |
| Response Body | `fnoIsuno` | 선물옵션종목번호 | String | Y | 8 | - |
| Response Body | `fnoIsunm` | 선물옵션종목명 | String | Y | 40 | - |
| Response Body | `pdgrpcode` | 상품군분류코드 | String | Y | 2 | - |
| Response Body | `fnoIsuptntp` | 선물옵션종목유형구분 | String | Y | 1 | - |
| Response Body | `bnstp` | 매매구분 | String | Y | 1 | - |
| Response Body | `mrctp` | 정정취소구분 | String | Y | 1 | - |
| Response Body | `ordqty` | 주문수량 | Number | Y | 16 | - |
| Response Body | `hogatype` | 호가유형코드 | String | Y | 2 | - |
| Response Body | `mmgb` | 거래유형코드 | String | Y | 2 | - |
| Response Body | `ordprc` | 주문가격 | Number | Y | 13.2 | - |
| Response Body | `unercqty` | 미체결수량 | Number | Y | 16 | - |
| Response Body | `commdacode` | 통신매체 | String | Y | 2 | - |
| Response Body | `peeamtcode` | 수수료합산코드 | String | Y | 2 | - |
| Response Body | `mgempno` | 관리사원 | String | Y | 9 | - |
| Response Body | `fnotrdunitamt` | 선물옵션거래단위금액 | Number | Y | 19.8 | - |
| Response Body | `trxtime` | 처리시각 | String | Y | 9 | - |
| Response Body | `strtgcode` | 전략코드 | String | Y | 6 | - |
| Response Body | `grpId` | 그룹Id | String | Y | 20 | - |
| Response Body | `ordseqno` | 주문회차 | String | Y | 10 | - |
| Response Body | `ptflno` | 포트폴리오번호 | String | Y | 10 | - |
| Response Body | `bskno` | 바스켓번호 | String | Y | 10 | - |
| Response Body | `trchno` | 트렌치번호 | String | Y | 10 | - |
| Response Body | `Itemno` | 아이템번호 | String | Y | 10 | - |
| Response Body | `userId` | 주문자Id | String | Y | 16 | - |
| Response Body | `opdrtnno` | 운영지시번호 | String | Y | 12 | - |
| Response Body | `rjtcode` | 부적격코드 | String | Y | 3 | - |
| Response Body | `mrccnfqty` | 정정취소확인수량 | Number | Y | 16 | - |
| Response Body | `orgordunercqty` | 원주문미체결수량 | Number | Y | 16 | - |
| Response Body | `orgordmrcqty` | 원주문정정취소수량 | Number | Y | 16 | - |
| Response Body | `ctrcttime` | 약정시각(체결시각) | String | Y | 8 | - |
| Response Body | `ctrctno` | 약정번호 | String | Y | 10 | - |
| Response Body | `execprc` | 체결가격 | Number | Y | 13.2 | - |
| Response Body | `execqty` | 체결수량 | Number | Y | 16 | - |
| Response Body | `newqty` | 신규체결수량 | Number | Y | 16 | - |
| Response Body | `qdtqty` | 청산체결수량 | Number | Y | 16 | - |
| Response Body | `lastqty` | 최종결제수량 | Number | Y | 16 | - |
| Response Body | `lallexecqty` | 전체체결수량 | Number | Y | 16 | - |
| Response Body | `allexecamt` | 전체체결금액 | Number | Y | 16 | - |
| Response Body | `fnobalevaltp` | 잔고평가구분 | String | Y | 1 | - |
| Response Body | `bnsplamt` | 매매손익금액 | Number | Y | 16 | - |
| Response Body | `fnoIsuno1` | 선물옵션종목번호1 | String | Y | 8 | - |
| Response Body | `bnstp1` | 매매구분1 | String | Y | 1 | - |
| Response Body | `execprc1` | 체결가1 | Number | Y | 13.2 | - |
| Response Body | `newqty1` | 신규체결수량1 | Number | Y | 16 | - |
| Response Body | `qdtqty1` | 청산체결수량1 | Number | Y | 16 | - |
| Response Body | `allexecamt1` | 전체체결금액1 | Number | Y | 16 | - |
| Response Body | `fnoIsuno2` | 선물옵션종목번호2 | String | Y | 8 | - |
| Response Body | `bnstp2` | 매매구분2 | String | Y | 1 | - |
| Response Body | `execprc2` | 체결가2 | Number | Y | 13.2 | - |
| Response Body | `newqty2` | 신규체결수량2 | Number | Y | 16 | - |
| Response Body | `lqdtqty2` | 청산체결수량2 | Number | Y | 16 | - |
| Response Body | `allexecamt2` | 전체체결금액2 | Number | Y | 16 | - |
| Response Body | `dps` | 예수금 | Number | Y | 16 | - |
| Response Body | `ftsubtdsgnamt` | 선물대용지정금액 | Number | Y | 16 | - |
| Response Body | `mgn` | 증거금 | Number | Y | 16 | - |
| Response Body | `mnymgn` | 증거금현금 | Number | Y | 16 | - |
| Response Body | `ordableamt` | 주문가능금액 | Number | Y | 16 | - |
| Response Body | `mnyordableamt` | 주문가능현금액 | Number | Y | 16 | - |
| Response Body | `fnoIsuno_1` | 잔고종목번호1 | String | Y | 8 | - |
| Response Body | `bnstp_1` | 잔고매매구분1 | String | Y | 1 | - |
| Response Body | `unsttqty_1` | 미결제수량1 | Number | Y | 16 | - |
| Response Body | `lqdtableqty_1` | 주문가능수량1 | Number | Y | 16 | - |
| Response Body | `avrprc_1` | 평균가1 | Number | Y | 13.2 | - |
| Response Body | `fnoIsuno_2` | 잔고종목번호2 | String | Y | 8 | - |
| Response Body | `bnstp_2` | 잔고매매구분2 | String | Y | 1 | - |
| Response Body | `unsttqty_2` | 미결제수량2 | Number | Y | 16 | - |
| Response Body | `lqdtableqty_2` | 주문가능수량2 | Number | Y | 16 | - |
| Response Body | `avrprc_2` | 평균가2 | Number | Y | 13.2 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "토큰",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "O02",
    "tr_key": "101W6000"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "O02"
  },
  "body": {
    "grpId": "",
    "execprc2": "0.00",
    "execprc1": "0.00",
    "trchno": "0000000000",
    "acntno": "***********",
    "fnoIsuptntp": "F",
    "acntnm": "***",
    "trcode": "SONBT003",
    "userid": "*****",
    "fnobalevaltp": "2",
    "avrprc_2": "0.00",
    "avrprc_1": "0.00",
    "fnotrdunitamt": "250000.00000000",
    "len": "1106",
    "mgn": "0",
    "Itemno": "0000000000",
    "opdrtnno": "",
    "cont": "N",
    "allexecamt2": "0",
    "allexecamt1": "0",
    "compress": "0",
    "execprc": "0.00",
    "trxtime": "162043600",
    "gubun": "B",
    "trid": "dD00162043594430",
    "mnyordableamt": "0",
    "varmsglen": "0",
    "ordno": "16",
    "bnstp_2": "",
    "bnstp_1": "",
    "trsrc": "L",
    "fnoIsuno_1": "",
    "hogatype": "",
    "reqcnt": " ",
    "mmgb": "03",
    "strtgcode": "",
    "lqdtqty2": "0",
    "fnoIsuno_2": "",
    "ordseqno": "0000000000",
    "bnstp2": "",
    "bnstp1": "",
    "lastqty": "0",
    "encrypt": "0",
    "ftsubtdsgnamt": "0",
    "acntno1": "",
    "contkey": "0",
    "fnoIsuno1": "",
    "mnymgn": "0",
    "fnoIsuno2": "",
    "seq": "000000070",
    "lineseq": "300000378",
    "peeamtcode": "40",
    "varlen": "50",
    "dps": "0",
    "fnoIsunm": "F 202506",
    "newqty": "0",
    "userId": "*****",
    "fnoIsuno": "101W6000",
    "mrctp": "2",
    "isuno": "KR4101W60000",
    "firmno": "063",
    "filler": "",
    "prntordno": "000",
    "orgordno1": "000",
    "pubip": "010130001138",
    "prvip": "123456789000",
    "funckey": "C",
    "accno": "***********",
    "compreq": "0",
    "ctrcttime": "",
    "orgordmrcqty": "0",
    "termno": "",
    "qdtqty1": "0",
    "bpno": "000",
    "mgempno": "999999201",
    "offset": "212",
    "trcode1": "FO03",
    "varhdlen": "0",
    "ifinfo": "",
    "lallexecqty": "0",
    "pdgrpcode": "01",
    "ptflno": "0000000000",
    "bnsplamt": "0",
    "eventid": "",
    "lqdtableqty_1": "0",
    "pcbpno": "000",
    "lqdtableqty_2": "0",
    "orgordno": "15",
    "brnno": "201",
    "ifid": "000",
    "media": "HT",
    "filler1": "",
    "orgordunercqty": "1",
    "ordno1": "000",
    "rjtcode": "",
    "commdacode": "40",
    "newqty1": "0",
    "newqty2": "0",
    "proctm": "162043601",
    "prntordno1": "14",
    "lang": "K",
    "unercqty": "0",
    "allexecamt": "0",
    "execqty": "0",
    "qdtqty": "0",
    "bskno": "0000000000",
    "ctrctno": "0000000000",
    "ordqty": "1",
    "outgu": "1",
    "msgcode": "9999",
    "ordableamt": "0",
    "ordmktcode": "40",
    "mrccnfqty": "0",
    "comid": "063",
    "bnstp": "2",
    "unsttqty_2": "0",
    "user": "*****",
    "unsttqty_1": "0",
    "ordprc": "0.00"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
