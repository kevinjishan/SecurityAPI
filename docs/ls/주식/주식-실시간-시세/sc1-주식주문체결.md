---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "f211yu82-clea-bh10-88f7-hbcf3munafti"
tr_code: "SC1"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 주식주문체결 (SC1)

<!-- request_field_count: 4 -->
<!-- response_field_count: 131 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | 주식주문체결 |
| TR코드 | `SC1` |
| 초당 전송 건수 | - |
| 설명 | 주식 주문현황 및 시세, 투자정보를  실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/stock` |
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
| Request Body | `tr_key` | 단축코드 | String | N | 8 | 단축코드 6자리 또는 8자리 (단건, 연속), (계좌등록/해제 일 경우 필수값 아님) |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래 CD | String | Y | 3 | LS증권 거래코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `grpId` | 그룹Id | String | Y | 20 | - |
| Response Body | `trchno` | 트렌치번호 | String | Y | 10 | - |
| Response Body | `trtzxLevytp` | 거래세징수구분 | String | Y | 1 | - |
| Response Body | `ordtrxptncode` | 주문처리유형코드 | String | Y | 4 | - |
| Response Body | `acntnm` | 계좌명 | String | Y | 40 | - |
| Response Body | `trcode` | TRCODE | String | Y | 8 | SONAT000:신규주문<br>SONAT001:정정주문<br>SONAT002:취소주문<br>SONAS100:체결확인 |
| Response Body | `userid` | 사용자ID | String | Y | 16 | - |
| Response Body | `agrgbrnno` | 집계지점번호 | String | Y | 3 | - |
| Response Body | `regmktcode` | 등록시장코드 | String | Y | 2 | - |
| Response Body | `len` | 헤더길이 | String | Y | 6 | - |
| Response Body | `opdrtnno` | 운용지시번호 | String | Y | 12 | - |
| Response Body | `orgordmdfyqty` | 원주문정정수량 | String | Y | 16 | - |
| Response Body | `avrpchsprc` | 평균매입가 | String | Y | 13 | 실서버 데이터 미제공 필드 |
| Response Body | `exectime` | 체결시각 | String | Y | 9 | - |
| Response Body | `cont` | 연속구분 | String | Y | 1 | - |
| Response Body | `mnymgnrat` | 현금증거금률 | String | Y | 7 | - |
| Response Body | `mdfycnfqty` | 정정확인수량 | String | Y | 16 | - |
| Response Body | `orgordcancqty` | 원주문취소수량 | String | Y | 16 | - |
| Response Body | `compress` | 압축구분 | String | Y | 1 | - |
| Response Body | `execprc` | 체결가격 | String | Y | 13 | - |
| Response Body | `mdfycnfprc` | 정정확인가격 | String | Y | 16 | - |
| Response Body | `unercsellordqty` | 미체결매도주문수량 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `cmsnamtexecamt` | 수수료체결금액 | String | Y | 16 | - |
| Response Body | `ruseableamt` | 재사용가능금액 | String | Y | 16 | - |
| Response Body | `gubun` | 헤더구분 | String | Y | 1 | - |
| Response Body | `trid` | TR추적ID | String | Y | 16 | - |
| Response Body | `flctqty` | 변동수량 | String | Y | 16 | - |
| Response Body | `execno` | 체결번호 | String | Y | 10 | - |
| Response Body | `lptp` | 유동성공급자구분 | String | Y | 1 | - |
| Response Body | `varmsglen` | 가변메시지길이 | String | Y | 2 | - |
| Response Body | `ordno` | 주문번호 | String | Y | 10 | - |
| Response Body | `futsmkttp` | 선물시장구분 | String | Y | 1 | - |
| Response Body | `crdtexecamt` | 신용체결금액 | String | Y | 16 | - |
| Response Body | `deposit` | 예수금 | String | Y | 16 | - |
| Response Body | `frgrunqno` | 외국인고유번호 | String | Y | 6 | - |
| Response Body | `crdayruseexecval` | 금일재사용체결금액 | String | Y | 16 | - |
| Response Body | `trsrc` | 조회발원지 | String | Y | 1 | - |
| Response Body | `ordacntno` | 주문계좌번호 | String | Y | 20 | - |
| Response Body | `reqcnt` | 요청레코드개수 | String | Y | 4 | - |
| Response Body | `shtnIsuno` | 단축종목번호 | String | Y | 9 | - |
| Response Body | `accno1` | 계좌번호 | String | Y | 11 | - |
| Response Body | `strtgcode` | 전략코드 | String | Y | 6 | - |
| Response Body | `ordseqno` | 주문회차 | String | Y | 10 | - |
| Response Body | `Isunm` | 종목명 | String | Y | 40 | - |
| Response Body | `ordablesubstamt` | 주문가능대용 | String | Y | 16 | - |
| Response Body | `encrypt` | 암호구분 | String | Y | 1 | - |
| Response Body | `Isuno` | 종목번호 | String | Y | 12 | - |
| Response Body | `accno2` | 계좌번호 | String | Y | 9 | - |
| Response Body | `contkey` | 연속키값 | String | Y | 18 | - |
| Response Body | `Loandt` | 대출일 | String | Y | 8 | - |
| Response Body | `seq` | 전문일련번호 | String | Y | 9 | - |
| Response Body | `lineseq` | 라인일련번호 | String | Y | 10 | - |
| Response Body | `varlen` | 가변시스템길이 | String | Y | 2 | - |
| Response Body | `orduserId` | 주문자Id | String | Y | 16 | - |
| Response Body | `mgmtbrnno` | 관리지점번호 | String | Y | 3 | - |
| Response Body | `rjtqty` | 거부수량 | String | Y | 16 | - |
| Response Body | `ordprcptncode` | 호가유형코드 | String | Y | 2 | 00:지정가<br>03:시장가<br>05:조건부지정가<br>06:최유리지정가<br>07:최우선지정가<br>09:자사주<br>10:매입인도(일반)<br>13:시장가 (IOC)<br>16:최유리지정가 (IOC)<br>18:사용안함<br>20:지정가(임의)<br>23:시장가(임의)<br>26:최유리지정가 (FOK)<br>41:부분충족(프리보드)<br>42:전량충족(프리보드)<br>51:장중대량<br>52:장중바스켓<br>61:장개시전시간외<br>62:사용안함<br>63:경매매<br>66:장전시간외경쟁대량<br>67:장개시전시간외대량<br>68:장개시전시간외바스켓<br>69:장개시전시간외자사주<br>71:신고대량전장시가<br>72:사용안함<br>73:신고대량종가<br>76:장중경쟁대량<br>77:장중대량<br>78:장중바스켓<br>79:사용안함<br>80:매입인도(당일)<br>81:시간외종가<br>82:시간외단일가<br>87:시간외대량<br>88:바스켓주문<br>89:시간외자사주<br>91:자사주스톡옵션<br>A1:stop order |
| Response Body | `stdIsuno` | 표준종목번호 | String | Y | 12 | - |
| Response Body | `pchsant` | 매입금액 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `filler` | 예비영역 | String | Y | 6 | - |
| Response Body | `secbalqty` | 잔고수량 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `ordxctptncode` | 주문체결유형코드 | String | Y | 2 | 01:주문<br>02:정정<br>03:취소<br>11:체결<br>12 정정확인<br>13 취소확인<br>14 거부 |
| Response Body | `canccnfqty` | 취소확인수량 | String | Y | 16 | - |
| Response Body | `ordablemny` | 주문가능현금 | String | Y | 16 | - |
| Response Body | `pubip` | 공인IP | String | Y | 12 | - |
| Response Body | `prvip` | 사설IP | String | Y | 12 | - |
| Response Body | `funckey` | 기능키 | String | Y | 4 | - |
| Response Body | `accno` | 계좌번호 | String | Y | 11 | - |
| Response Body | `compreq` | 압축요청구분 | String | Y | 1 | - |
| Response Body | `crdtpldgruseamt` | 신용담보재사용금 | String | Y | 16 | - |
| Response Body | `ordamt` | 주문금액 | String | Y | 16 | - |
| Response Body | `termno` | 단말번호 | String | Y | 8 | - |
| Response Body | `crdtpldgexecamt` | 신용담보체결금액 | String | Y | 16 | - |
| Response Body | `ordcndi` | 주문조건 | String | Y | 1 | - |
| Response Body | `rmndLoanamt` | 잔여대출금액 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `bpno` | 지점번호 | String | Y | 3 | - |
| Response Body | `substamt` | 대용금 | String | Y | 16 | - |
| Response Body | `mgempno` | 관리사원번호 | String | Y | 9 | - |
| Response Body | `csgnsubstmgn` | 위탁증거금대용 | String | Y | 16 | - |
| Response Body | `offset` | 공통시작지점 | String | Y | 3 | - |
| Response Body | `rcptexectime` | 거래소수신체결시각 | String | Y | 9 | - |
| Response Body | `sellableqty` | 매도주문가능수량 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `spotexecqty` | 실물체결수량 | String | Y | 16 | - |
| Response Body | `varhdlen` | 가변해더길이 | String | Y | 2 | - |
| Response Body | `substmgnrat` | 대용증거금률 | String | Y | 9 | - |
| Response Body | `ordavrexecprc` | 주문평균체결가격 | String | Y | 13 | - |
| Response Body | `itemno` | 아이템번호 | String | Y | 10 | - |
| Response Body | `mgntrncode` | 신용거래코드 | String | Y | 3 | [신규]<br>000 : 보통<br>001 : 유통융자신규<br>003 : 자기융자신규<br>005 : 유통대주신규<br>007 : 자기대주신규<br>080 : 예탁주식담보융자신규<br>082 : 예탁채권담보융자신규<br>[상환]<br>101 : 유통융자상환<br>103 : 자기융자상환<br>105 : 유통대주상환<br>107 : 자기대주상환<br>111 : 유통융자전액상환<br>113 : 자기융자전액상환<br>180 : 예탁주식담보융자상환<br>182 : 예탁채권담보융자상환<br>188 : 담보대출전액상환 |
| Response Body | `nsavtrdqty` | 비저축체결수량 | String | Y | 16 | - |
| Response Body | `ifinfo` | I/F정보 | String | Y | 4 | - |
| Response Body | `ordableruseqty` | 재사용가능수량(매도) | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `ptflno` | 포트폴리오번호 | String | Y | 10 | - |
| Response Body | `secbalqtyd2` | 잔고수량(d2) | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `brwmgmtYn` | 차입관리여부 | String | Y | 1 | - |
| Response Body | `eventid` | I/F이벤트ID | String | Y | 4 | - |
| Response Body | `csgnmnymgn` | 위탁증거금현금 | String | Y | 16 | - |
| Response Body | `pcbpno` | 처리지점번호 | String | Y | 3 | - |
| Response Body | `orgordno` | 원주문번호 | String | Y | 10 | - |
| Response Body | `ifid` | I/F일련번호 | String | Y | 3 | - |
| Response Body | `media` | 접속매체 | String | Y | 2 | - |
| Response Body | `mtiordseqno` | 복수주문일련번호 | String | Y | 10 | - |
| Response Body | `filler1` | 예비영역 | String | Y | 41 | - |
| Response Body | `orgordunercqty` | 원주문미체결수량 | String | Y | 16 | - |
| Response Body | `mbrnmbrno` | 회원/비회원사번호 | String | Y | 3 | - |
| Response Body | `futsLnkbrnno` | 선물연계지점번호 | String | Y | 3 | - |
| Response Body | `commdacode` | 통신매체코드 | String | Y | 2 | - |
| Response Body | `stslexecqty` | 공매도체결수량 | String | Y | 16 | - |
| Response Body | `proctm` | AP처리시간 | String | Y | 9 | - |
| Response Body | `bfstdIsuno` | 전표준종목번호 | String | Y | 12 | - |
| Response Body | `futsLnkacntno` | 선물연계계좌번호 | String | Y | 20 | - |
| Response Body | `lang` | 언어구분 | String | Y | 1 | - |
| Response Body | `unercqty` | 미체결수량(주문) | String | Y | 16 | - |
| Response Body | `execqty` | 체결수량 | String | Y | 16 | - |
| Response Body | `adduptp` | 수수료합산코드 | String | Y | 2 | - |
| Response Body | `bskno` | 바스켓번호 | String | Y | 10 | - |
| Response Body | `spotordableqty` | 실물가능수량 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `ubstexecamt` | 대용체결금액 | String | Y | 16 | - |
| Response Body | `cvrgordtp` | 반대매매주문구분 | String | Y | 1 | 0:일반<br>1:자동반대매매<br>2:지점반대매매<br>3:예비주문에대한 본주문 |
| Response Body | `ordqty` | 주문수량 | String | Y | 16 | - |
| Response Body | `mnyexecamt` | 현금체결금액 | String | Y | 16 | - |
| Response Body | `outgu` | 메세지출력구분 | String | Y | 1 | - |
| Response Body | `msgcode` | 메세지코드 | String | Y | 4 | - |
| Response Body | `ordtrdptncode` | 주문거래유형코드 | String | Y | 2 | 00: 위탁<br>01: 신용<br>04: 선물대용 |
| Response Body | `ordmktcode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `ordptncode` | 주문유형코드 | String | Y | 2 | 00 해당없음<br>01:현금매도<br>02:현금매수<br>03신용매도<br>04:신용매수 |
| Response Body | `prdayruseexecval` | 전일재사용체결금액 | String | Y | 16 | - |
| Response Body | `comid` | COM ID | String | Y | 3 | - |
| Response Body | `bnstp` | 매매구분 | String | Y | 1 | 1:매도<br>2:매수 |
| Response Body | `user` | 조작자ID | String | Y | 8 | - |
| Response Body | `ordprc` | 주문가격 | String | Y | 13 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "SC1",
    "tr_key": ""
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "SC1"
  },
  "body": {
    "grpId": "A1100000000000000000",
    "trchno": "0",
    "trtzxLevytp": "1",
    "ordtrxptncode": "0",
    "acntnm": "우우돌",
    "trcode": "SONAS100",
    "userid": "hdkrggg4",
    "agrgbrnno": "106",
    "regmktcode": "10",
    "len": "1294",
    "opdrtnno": "0",
    "orgordmdfyqty": "0",
    "avrpchsprc": "0",
    "exectime": "095636107",
    "cont": "N",
    "mnymgnrat": "1.000",
    "mdfycnfqty": "0",
    "orgordcancqty": "0",
    "compress": "0",
    "execprc": "60000",
    "mdfycnfprc": "0",
    "unercsellordqty": "0",
    "cmsnamtexecamt": "0",
    "ruseableamt": "0",
    "gubun": "B",
    "trid": "2000095635771500",
    "flctqty": "1",
    "execno": "1",
    "lptp": "0",
    "varmsglen": "0",
    "ordno": "86382",
    "futsmkttp": "",
    "crdtexecamt": "0",
    "deposit": "79759964",
    "frgrunqno": "000000",
    "crdayruseexecval": "0",
    "trsrc": "L",
    "ordacntno": "20011132702",
    "reqcnt": " ",
    "shtnIsuno": "A005930",
    "accno1": "20011132702",
    "strtgcode": "",
    "ordseqno": "0",
    "Isunm": "삼성전자",
    "ordablesubstamt": "244160",
    "encrypt": "0",
    "Isuno": "KR7005930003",
    "accno2": "",
    "contkey": "0",
    "Loandt": "00000000",
    "seq": "000000154",
    "lineseq": "200000002",
    "varlen": "50",
    "orduserId": "hdkrggg4",
    "mgmtbrnno": "106",
    "rjtqty": "0",
    "ordprcptncode": "00",
    "stdIsuno": "KR7005930003",
    "pchsant": "0",
    "filler": "",
    "secbalqty": "0",
    "ordxctptncode": "11",
    "canccnfqty": "0",
    "ordablemny": "79459964",
    "pubip": "010130001138",
    "prvip": "",
    "funckey": "C",
    "accno": "20011132702",
    "compreq": "0",
    "crdtpldgruseamt": "0",
    "ordamt": "120000",
    "termno": "",
    "crdtpldgexecamt": "0",
    "ordcndi": "0",
    "rmndLoanamt": "0",
    "bpno": "106",
    "substamt": "244160",
    "mgempno": "999999106",
    "csgnsubstmgn": "0",
    "offset": "212",
    "rcptexectime": "095636098",
    "sellableqty": "0",
    "spotexecqty": "0",
    "varhdlen": "0",
    "substmgnrat": ".0000000",
    "ordavrexecprc": "60000",
    "itemno": "0",
    "mgntrncode": "000",
    "nsavtrdqty": "0",
    "ifinfo": "",
    "ordableruseqty": "0",
    "ptflno": "0",
    "secbalqtyd2": "0",
    "brwmgmtYn": "0",
    "eventid": "",
    "csgnmnymgn": "300000",
    "pcbpno": "000",
    "orgordno": "0",
    "ifid": "000",
    "media": "HT",
    "mtiordseqno": "0",
    "filler1": "",
    "orgordunercqty": "0",
    "mbrnmbrno": "0",
    "futsLnkbrnno": "",
    "commdacode": "40",
    "stslexecqty": "0",
    "proctm": "95636107",
    "bfstdIsuno": "KR7005930003",
    "futsLnkacntno": "",
    "lang": "K",
    "unercqty": "1",
    "execqty": "1",
    "adduptp": "40",
    "bskno": "0",
    "spotordableqty": "0",
    "ubstexecamt": "0",
    "cvrgordtp": "0",
    "ordqty": "2",
    "mnyexecamt": "60000",
    "outgu": "",
    "msgcode": "9999",
    "ordtrdptncode": "00",
    "ordmktcode": "10",
    "ordptncode": "02",
    "prdayruseexecval": "0",
    "comid": "063",
    "bnstp": "2",
    "user": "hdkrggg4",
    "ordprc": "60000"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
