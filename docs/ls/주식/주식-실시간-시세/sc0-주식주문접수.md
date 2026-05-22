---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "40x00uzk-d077-jjz3-g3xz-n0t365rj71ks"
tr_code: "SC0"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 주식주문접수 (SC0)

<!-- request_field_count: 4 -->
<!-- response_field_count: 114 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | 주식주문접수 |
| TR코드 | `SC0` |
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
| Response Body | `lineseq` | 라인일련번호 | String | Y | 10 | - |
| Response Body | `accno` | Push키 | String | Y | 11 | - |
| Response Body | `user` | 조작자ID | String | Y | 8 | - |
| Response Body | `len` | 헤더길이 | String | Y | 6 | - |
| Response Body | `gubun` | 헤더구분 | String | Y | 1 | - |
| Response Body | `compress` | 압축구분 | String | Y | 1 | - |
| Response Body | `encrypt` | 암호구분 | String | Y | 1 | - |
| Response Body | `offset` | 공통시작지점 | String | Y | 3 | - |
| Response Body | `trcode` | TRCODE | String | Y | 8 | SONAT000:신규주문<br>SONAT001:정정주문<br>SONAT002:취소주문<br>SONAS100:체결확인 |
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
| Response Body | `ordchegb` | 주문체결구분 | String | Y | 2 | 01:주문<br>02:정정<br>03:취소<br>11:체결<br>12:정정확인<br>13:취소확인<br>14:거부<br>A1:접수중<br>AC:접수완료 |
| Response Body | `marketgb` | 시장구분 | String | Y | 2 | 00:비상장<br>10:코스피<br>11:채권<br>19:장외시장<br>20:코스닥<br>23:코넥스<br>30:프리보드<br>61:동경거래소<br>62:JASDAQ |
| Response Body | `ordgb` | 주문구분 | String | Y | 2 | 01:현금매도<br>02:현금매수<br>03:신용매도<br>04:신용매수<br>05:저축매도<br>06:저축매수<br>07:상품매도(대차)<br>09:상품매도<br>10:상품매수<br>11:선물대용매도(일반)<br>12:선물대용매도(반대)<br>13:현금매도(프)<br>14:현금매수(프)<br>15:현금매수(유가)<br>16:현금매수(정리)<br>17:상품매도(대차.프)<br>19:상품매도(프)<br>20:상품매수(프)<br>30:장외매매 |
| Response Body | `orgordno` | 원주문번호 | String | Y | 10 | - |
| Response Body | `accno1` | 계좌번호 | String | Y | 11 | - |
| Response Body | `accno2` | 계좌번호 | String | Y | 9 | - |
| Response Body | `passwd` | 비밀번호 | String | Y | 8 | - |
| Response Body | `expcode` | 종목번호 | String | Y | 12 | 표준코드 12자리 |
| Response Body | `shtcode` | 단축종목번호 | String | Y | 9 | 주식은 단축코드 앞에 A포함 7자리<br>ELW는 단촉코드 앞에 J포함 7자리 |
| Response Body | `hname` | 종목명 | String | Y | 40 | - |
| Response Body | `ordqty` | 주문수량 | String | Y | 16 | - |
| Response Body | `ordprice` | 주문가격 | String | Y | 13 | - |
| Response Body | `hogagb` | 주문조건 | String | Y | 1 | 0:없음<br>1:IOC<br>2:FOK |
| Response Body | `etfhogagb` | 호가유형코드 | String | Y | 2 | 00:지정가<br>03:시장가<br>05:조건부지정가<br>06:최유리지정가<br>07:최우선지정가<br>09:자사주<br>10:매입인도(일반)<br>13:시장가 (IOC)<br>16:최유리지정가 (IOC)<br>18:사용안함<br>20:지정가(임의)<br>23:시장가(임의)<br>26:최유리지정가 (FOK)<br>41:부분충족(프리보드)<br>42:전량충족(프리보드)<br>51:장중대량<br>52:장중바스켓<br>61:장개시전시간외<br>62:사용안함<br>63:경매매<br>66:장전시간외경쟁대량<br>67:장개시전시간외대량<br>68:장개시전시간외바스켓<br>69:장개시전시간외자사주<br>71:신고대량전장시가<br>72:사용안함<br>73:신고대량종가<br>76:장중경쟁대량<br>77:장중대량<br>78:장중바스켓<br>79:사용안함<br>80:매입인도(당일)<br>81:시간외종가<br>82:시간외단일가<br>87:시간외대량<br>88:바스켓주문<br>89:시간외자사주<br>91:자사주스톡옵션<br>A1:stop order |
| Response Body | `pgmtype` | 프로그램호가구분 | String | Y | 2 | 00:일반<br>01:지수차익<br>02:지수비차익<br>03:주식차익<br>04:ETF차익(비차익제외)<br>05:ETF설정(비차익제외)<br>06:ETF차익(비차익)<br>07:ETF설정(비차익)<br>08:DR차익<br>09:ELW LP헷지<br>10:ETF LP헷지<br>11:주식옵션 LP헷지<br>12:장외파생상품헷지 |
| Response Body | `gmhogagb` | 공매도호가구분 | String | Y | 1 | 0:일반<br>1:차입주식매도<br>2:기타공매도 |
| Response Body | `gmhogayn` | 공매도가능여부 | String | Y | 1 | 0:일반<br>1:공매도 |
| Response Body | `singb` | 신용구분 | String | Y | 3 | 000:보통<br>001:유통융자신규<br>003:자기융자신규<br>005:유통대주신규<br>007:자기대주신규<br>011:미사용<br>070:매도대금담보융자신규<br>080:예탁주식담보융자신규<br>082:예탁채권담보융자신규<br>101:유통융자상환<br>103:자기융자상환<br>105:유통대주상환<br>107:자기대주상환<br>111:유통융자전액상환<br>113:자기융자전액상환<br>170:매도대금담보융자상환<br>180:예탁주식담보융자상환<br>182:예탁채권담보융자상환<br>188:담보대출전액상환<br>201:유통융자현금상환<br>203:자기융자현금상환<br>205:유통대주현물상환<br>207:자기대주현물상환<br>280:예탁주식담보융자현금상환<br>282:예탁채권담보융자현금상환<br>301:유통융자현금상환취소<br>303:자기융자현금상환취소<br>305:유통대주현물상환취소<br>307:자기대주현물상환취소 |
| Response Body | `loandt` | 대출일 | String | Y | 8 | - |
| Response Body | `cvrgordtp` | 반대매매주문구분 | String | Y | 1 | 0:일반<br>1:자동반대매매<br>2:지점반대매매<br>3:예비주문에대한 본주문 |
| Response Body | `strtgcode` | 전략코드 | String | Y | 6 | - |
| Response Body | `groupid` | 그룹ID | String | Y | 20 | - |
| Response Body | `ordseqno` | 주문회차 | String | Y | 10 | - |
| Response Body | `prtno` | 포트폴리오번호 | String | Y | 10 | - |
| Response Body | `basketno` | 바스켓번호 | String | Y | 10 | - |
| Response Body | `trchno` | 트렌치번호 | String | Y | 10 | - |
| Response Body | `itemno` | 아아템번호 | String | Y | 10 | - |
| Response Body | `brwmgmyn` | 차입구분 | String | Y | 1 | - |
| Response Body | `mbrno` | 회원사번호 | String | Y | 3 | - |
| Response Body | `procgb` | 처리구분 | String | Y | 1 | - |
| Response Body | `admbrchno` | 관리지점번호 | String | Y | 3 | - |
| Response Body | `futaccno` | 선물계좌번호 | String | Y | 20 | - |
| Response Body | `futmarketgb` | 선물상품구분 | String | Y | 1 | - |
| Response Body | `tongsingb` | 통신매체구분 | String | Y | 2 | - |
| Response Body | `lpgb` | 유동성공급자구분 | String | Y | 1 | 0:해당없음<br>1:유동성공급자 |
| Response Body | `dummy` | DUMMY | String | Y | 20 | - |
| Response Body | `ordno` | 주문번호 | String | Y | 10 | - |
| Response Body | `ordtm` | 주문시각 | String | Y | 9 | - |
| Response Body | `prntordno` | 모주문번호 | String | Y | 10 | - |
| Response Body | `mgempno` | 관리사원번호 | String | Y | 9 | - |
| Response Body | `orgordundrqty` | 원주문미체결수량 | String | Y | 16 | - |
| Response Body | `orgordmdfyqty` | 원주문정정수량 | String | Y | 16 | - |
| Response Body | `ordordcancelqty` | 원주문취소수량 | String | Y | 16 | - |
| Response Body | `nmcpysndno` | 비회원사송신번호 | String | Y | 10 | - |
| Response Body | `ordamt` | 주문금액 | String | Y | 16 | - |
| Response Body | `bnstp` | 매매구분 | String | Y | 1 | 1:매도<br>2:매수 |
| Response Body | `spareordno` | 예비주문번호 | String | Y | 10 | - |
| Response Body | `cvrgseqno` | 반대매매일련번호 | String | Y | 10 | - |
| Response Body | `rsvordno` | 예약주문번호 | String | Y | 10 | - |
| Response Body | `mtordseqno` | 복수주문일련번호 | String | Y | 10 | - |
| Response Body | `spareordqty` | 예비주문수량 | String | Y | 16 | - |
| Response Body | `orduserid` | 주문사원번호 | String | Y | 16 | - |
| Response Body | `spotordqty` | 실물주문수량 | String | Y | 16 | - |
| Response Body | `ordruseqty` | 재사용주문수량 | String | Y | 16 | - |
| Response Body | `mnyordamt` | 현금주문금액 | String | Y | 16 | - |
| Response Body | `ordsubstamt` | 주문대용금액 | String | Y | 16 | - |
| Response Body | `ruseordamt` | 재사용주문금액 | String | Y | 16 | - |
| Response Body | `ordcmsnamt` | 수수료주문금액 | String | Y | 16 | - |
| Response Body | `crdtuseamt` | 사용신용담보재사용금 | String | Y | 16 | - |
| Response Body | `secbalqty` | 잔고수량 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `spotordableqty` | 실물가능수량 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `ordableruseqty` | 재사용가능수량(매도) | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `flctqty` | 변동수량 | String | Y | 16 | - |
| Response Body | `secbalqtyd2` | 잔고수량(D2) | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `sellableqty` | 매도주문가능수량 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `unercsellordqty` | 미체결매도주문수량 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `avrpchsprc` | 평균매입가 | String | Y | 13 | 실서버 데이터 미제공 필드 |
| Response Body | `pchsamt` | 매입금액 | String | Y | 16 | 실서버 데이터 미제공 필드 |
| Response Body | `deposit` | 예수금 | String | Y | 16 | - |
| Response Body | `substamt` | 대용금 | String | Y | 16 | - |
| Response Body | `csgnmnymgn` | 위탁증거금현금 | String | Y | 16 | - |
| Response Body | `csgnsubstmgn` | 위탁증거금대용 | String | Y | 16 | - |
| Response Body | `crdtpldgruseamt` | 신용담보재사용금 | String | Y | 16 | - |
| Response Body | `ordablemny` | 주문가능현금 | String | Y | 16 | - |
| Response Body | `ordablesubstamt` | 주문가능대용 | String | Y | 16 | - |
| Response Body | `ruseableamt` | 재사용가능금액 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "SC0",
    "tr_key": ""
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "SC0"
  },
  "body": {
    "trchno": "0",
    "spareordqty": "0",
    "trcode": "SONAT000",
    "userid": "hdkrggg4",
    "dummy": "",
    "len": "1053",
    "loandt": "00000000",
    "orgordmdfyqty": "0",
    "avrpchsprc": ".00",
    "cont": "N",
    "hname": "삼성전자",
    "pgmtype": "0",
    "compress": "0",
    "ordprice": "60000",
    "procgb": "0",
    "unercsellordqty": "0",
    "ruseableamt": "0",
    "ordgb": "02",
    "gubun": "B",
    "trid": "2000095635771500",
    "flctqty": "0",
    "varmsglen": "0",
    "ordno": "86382",
    "passwd": "********",
    "singb": "000",
    "gmhogayn": "0",
    "ordruseqty": "0",
    "deposit": "79759964",
    "trsrc": "L",
    "gmhogagb": "0",
    "reqcnt": " ",
    "accno1": "20011132702",
    "strtgcode": "",
    "ordchegb": "01",
    "ordtm": "095636020",
    "orduserid": "hdkrggg4",
    "ordseqno": "0",
    "ordablesubstamt": "244160",
    "pchsamt": "0",
    "encrypt": "0",
    "accno2": "",
    "shtcode": "A005930",
    "contkey": "0",
    "brwmgmyn": "0",
    "seq": "000000154",
    "mtordseqno": "0",
    "lineseq": "200000001",
    "tongsingb": "40",
    "varlen": "50",
    "lpgb": "0",
    "rsvordno": "0",
    "spotordqty": "0",
    "cvrgseqno": "0",
    "filler": "",
    "hogagb": "0",
    "secbalqty": "0",
    "expcode": "KR7005930003",
    "prntordno": "86382",
    "ordablemny": "79459964",
    "pubip": "010130001138",
    "prvip": "",
    "funckey": "C",
    "accno": "20011132702",
    "compreq": "0",
    "orgordundrqty": "0",
    "ruseordamt": "0",
    "crdtpldgruseamt": " ",
    "ordordcancelqty": "0",
    "ordamt": "120000",
    "spareordno": "0",
    "termno": "",
    "etfhogagb": "00",
    "bpno": "106",
    "substamt": "244160",
    "mgempno": "999999106",
    "csgnsubstmgn": "0",
    "offset": "212",
    "sellableqty": "0",
    "groupid": "",
    "varhdlen": "0",
    "mnyordamt": "120000",
    "itemno": "0",
    "prtno": "0",
    "marketgb": "10",
    "ifinfo": "",
    "ordableruseqty": "0",
    "crdtuseamt": "0",
    "ordcmsnamt": "0",
    "secbalqtyd2": "0",
    "eventid": "",
    "csgnmnymgn": "300000",
    "pcbpno": "000",
    "orgordno": "0",
    "basketno": "0",
    "ifid": "000",
    "media": "HT",
    "filler1": "",
    "mbrno": "63",
    "proctm": "95636020",
    "ordsubstamt": "0",
    "lang": "K",
    "spotordableqty": "0",
    "cvrgordtp": "0",
    "ordqty": "2",
    "outgu": "",
    "msgcode": "0040",
    "futaccno": "00000000000000000000",
    "futmarketgb": "0",
    "admbrchno": "106",
    "comid": "063",
    "bnstp": "2",
    "user": "hdkrggg4",
    "nmcpysndno": "0"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
