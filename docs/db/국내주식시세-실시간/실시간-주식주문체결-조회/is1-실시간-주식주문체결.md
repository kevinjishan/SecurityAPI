---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=94b5fddc-b819-451b-9619-13ee42468798&api_id=a3a93ec3-2ccc-4fa5-8096-b45616b785e4"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세(실시간)"
api_id: "a3a93ec3-2ccc-4fa5-8096-b45616b785e4"
api_name: "[실시간]주식주문체결 조회"
tr_id: "26a98bfd-cd43-4810-a5e1-a20549d41434"
tr_code: "IS1"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7070"
path: "/pub/IS1"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]주식주문체결 (IS1)

<!-- request_field_count: 4 -->
<!-- response_field_count: 72 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세(실시간) |
| API 페이지 | [실시간]주식주문체결 조회 |
| TR명 | [실시간]주식주문체결 |
| TR코드 | `IS1` |
| 초당 전송 건수 | - |
| 설명 | 국내주식 실시간 주문체결 API 입니다.<br>주문 체결시 내역이 출력됩니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7070` |
| 모의투자 도메인 | `wss://openapi.dbsec.co.kr:17070` |
| URL | `/pub/IS1` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `token` | 토큰 | String | Y | 1000 | G/W 에서 발급하는 접근토큰 |
| Request Header | `tr_type` | TR 타입 | String | Y | 1 | 1: 실시간 시세 등록, 2: 실시간 시세 해제, 3: 계좌 등록 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `tr_cd` | 거래코드 | String | Y | 3 | TR코드입력: IS1 |
| Request Body | `tr_key` | 종목코드 | String | Y | 20 | 입력 X |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래코드 | String | Y | 3 | TR코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Sordxctptncode` | 주문체결유형코드 | String | Y | 2 | - |
| Response Body | `Strancode` | 서비스코드 | String | Y | 10 | - |
| Response Body | `Sordmktcode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `Sordptncode` | 주문유형코드 | String | Y | 2 | - |
| Response Body | `Sisuno` | 종목번호 | String | Y | 12 | - |
| Response Body | `Sisunm` | 종목명 | String | Y | 40 | - |
| Response Body | `Sordno` | 주문번호 | String | Y | 10 | - |
| Response Body | `Sorgordno` | 원주문번호 | String | Y | 10 | - |
| Response Body | `Sexecno` | 체결번호 | String | Y | 10 | - |
| Response Body | `Sordqty` | 주문수량 | String | Y | 16 | - |
| Response Body | `Sordprc` | 주문가격 | String | Y | 13 | - |
| Response Body | `Sexecqty` | 체결수량 | String | Y | 16 | - |
| Response Body | `Sexecprc` | 체결가격 | String | Y | 13 | - |
| Response Body | `Smdfycnfqty` | 정정확인수량 | String | Y | 16 | - |
| Response Body | `Smdfycnfprc` | 정정확인가격 | String | Y | 16 | - |
| Response Body | `Scanccnfqty` | 취소확인수량 | String | Y | 16 | - |
| Response Body | `Srjtqty` | 거부수량 | String | Y | 16 | - |
| Response Body | `Sordtrxptncode` | 주문처리유형코드 | String | Y | 4 | - |
| Response Body | `Sordcndi` | 주문조건 | String | Y | 1 | - |
| Response Body | `Sordprcptncode` | 호가유형코드 | String | Y | 2 | - |
| Response Body | `Snsavtrdqty` | 비저축체결수량 | String | Y | 16 | - |
| Response Body | `Sshtnisuno` | 단축종목번호 | String | Y | 9 | - |
| Response Body | `Sopdrtnno` | 운용지시번호 | String | Y | 12 | - |
| Response Body | `Scvrgordtp` | 반대매매주문구분 | String | Y | 1 | - |
| Response Body | `Sunercqty` | 미체결수량(주문) | String | Y | 16 | - |
| Response Body | `Sorgordunercqty` | 원주문미체결수량 | String | Y | 16 | - |
| Response Body | `Sorgordmdfyqty` | 원주문정정수량 | String | Y | 16 | - |
| Response Body | `Sorgordcancqty` | 원주문취소수량 | String | Y | 16 | - |
| Response Body | `Sordavrexecprc` | 주문평균체결가격 | String | Y | 13 | - |
| Response Body | `Sordamt` | 주문금액 | String | Y | 16 | - |
| Response Body | `Sstdisuno` | 표준종목번호 | String | Y | 12 | - |
| Response Body | `Sbnstp` | 매매구분 | String | Y | 1 | - |
| Response Body | `Sordtrdptncode` | 주문거래유형코드 | String | Y | 2 | - |
| Response Body | `Smgntrncode` | 신용거래코드 | String | Y | 3 | - |
| Response Body | `Sadduptp` | 수수료합산코드 | String | Y | 2 | - |
| Response Body | `Sloandt` | 대출일 | String | Y | 8 | - |
| Response Body | `Sagrgbrnno` | 집계지점번호 | String | Y | 3 | - |
| Response Body | `Sregmktcode` | 등록시장코드 | String | Y | 2 | - |
| Response Body | `Smnymgnrat` | 현금증거금률 | String | Y | 7 | - |
| Response Body | `Ssubstmgnrat` | 대용증거금률 | String | Y | 9 | - |
| Response Body | `Smnyexecamt` | 현금체결금액 | String | Y | 16 | - |
| Response Body | `Ssubstexecamt` | 대용체결금액 | String | Y | 16 | - |
| Response Body | `Scmsnamtexecamt` | 수수료체결금액 | String | Y | 16 | - |
| Response Body | `Scrdtpldgexecamt` | 신용담보체결금액 | String | Y | 16 | - |
| Response Body | `Scrdtexecamt` | 신용체결금액 | String | Y | 16 | - |
| Response Body | `Sprdayruseexecval` | 전일재사용체결금액 | String | Y | 16 | - |
| Response Body | `Scrdayruseexecval` | 금일재사용체결금액 | String | Y | 16 | - |
| Response Body | `Sspotexecqty` | 실물체결수량 | String | Y | 16 | - |
| Response Body | `Sorduserid` | 주문자ID | String | Y | 16 | - |
| Response Body | `Sfrgrunqno` | 외국인고유번호 | String | Y | 6 | - |
| Response Body | `Sexectime` | 체결시각 | String | Y | 9 | - |
| Response Body | `Srcptexectime` | 거래소수신체결시각 | String | Y | 9 | - |
| Response Body | `Srmndloanamt` | 잔여대출금액 | String | Y | 16 | - |
| Response Body | `Ssecbalqty` | *주식잔고-잔고수량 | String | Y | 16 | - |
| Response Body | `Sspotordableqty` | *주식잔고-실물가능수량 | String | Y | 16 | - |
| Response Body | `Sordableruseqty` | *주식잔고-재사용가능수량(매도) | String | Y | 16 | - |
| Response Body | `Sflctqty` | *주식잔고-변동수량 | String | Y | 16 | - |
| Response Body | `Ssecbalqtyd2` | *주식잔고-잔고수량(D2) | String | Y | 16 | - |
| Response Body | `Ssellableqty` | *주식잔고-매도주문가능수량 | String | Y | 16 | - |
| Response Body | `Sunercsellordqty` | *주식잔고-미체결매도주문수량 | String | Y | 16 | - |
| Response Body | `Savrpchsprc` | *주식잔고-평균매입가 | String | Y | 13 | - |
| Response Body | `Spchsamt` | *주식잔고-매입금액 | String | Y | 16 | - |
| Response Body | `Sdeposit` | *예수금잔고-예수금 | String | Y | 16 | - |
| Response Body | `Ssubstamt` | *예수금잔고-대용금 | String | Y | 16 | - |
| Response Body | `Scsgnmnymgn` | *예수금잔고-위탁증거금현금 | String | Y | 16 | - |
| Response Body | `Scsgnsubstmgn` | *예수금잔고-위탁증거금대용 | String | Y | 16 | - |
| Response Body | `Scrdtpldgruseamt` | *예수금잔고-신용담보재사용금 | String | Y | 16 | - |
| Response Body | `Sordablemny` | *예수금잔고-주문가능현금 | String | Y | 16 | - |
| Response Body | `Sordablesubstamt` | *예수금잔고-주문가능대용 | String | Y | 16 | - |
| Response Body | `Sruseableamt` | *예수금잔고-재사용가능금액 | String | Y | 16 | - |
| Response Body | `Sacntno` | 계좌번호 | String | Y | 20 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "{{ _.access_token }}",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "IS1"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "IS1",
    "tr_key": null
  },
  "body": {
    "Strancode": "CSPZS00100",
    "Sordxctptncode": "13",
    "Sordmktcode": "10",
    "Sordptncode": "02",
    "Sacntno": "10590765201",
    "Sisuno": "KR7004410007",
    "Sisunm": "서울식품",
    "Sordno": "0000241048",
    "Sorgordno": "0000241038",
    "Sexecno": "0000000000",
    "Sordqty": "0000000000000001",
    "Sordprc": "0000000000000",
    "Sexecqty": "0000000000000000",
    "Sexecprc": "0000000000000",
    "Smdfycnfqty": "0000000000000000",
    "Smdfycnfprc": "0000000000000000",
    "Scanccnfqty": "0000000000000001",
    "Srjtqty": "0000000000000000",
    "Sordtrxptncode": "0000",
    "Sordcndi": "0",
    "Sordprcptncode": "03",
    "Snsavtrdqty": "0000000000000000",
    "Sshtnisuno": "A004410",
    "Sopdrtnno": "",
    "Scvrgordtp": "0",
    "Sunercqty": "0000000000000000",
    "Sorgordunercqty": "0000000000000000",
    "Sorgordmdfyqty": "0000000000000000",
    "Sorgordcancqty": "0000000000000001",
    "Sordavrexecprc": "0000000000000",
    "Sordamt": "0000000000000163",
    "Sstdisuno": "KR7004410007",
    "Sbnstp": "2",
    "Sordtrdptncode": "00",
    "Smgntrncode": "000",
    "Sadduptp": "50",
    "Sloandt": "00000000",
    "Sagrgbrnno": "103",
    "Sregmktcode": "10",
    "Smnymgnrat": "001.000",
    "Ssubstmgnrat": "0.0000000",
    "Smnyexecamt": "0000000000000000",
    "Ssubstexecamt": "0000000000000000",
    "Scmsnamtexecamt": "0000000000000000",
    "Scrdtpldgexecamt": "0000000000000000",
    "Scrdtexecamt": "0000000000000000",
    "Sprdayruseexecval": "0000000000000000",
    "Scrdayruseexecval": "0000000000000000",
    "Sspotexecqty": "0000000000000000",
    "Sorduserid": "dsfuture",
    "Sfrgrunqno": "000000",
    "Sexectime": "145410982",
    "Srcptexectime": "145410982",
    "Srmndloanamt": "0000000000000000",
    "Ssecbalqty": "0000000000000000",
    "Sspotordableqty": "0000000000000000",
    "Sordableruseqty": "0000000000000000",
    "Sflctqty": "0000000000000000",
    "Ssecbalqtyd2": "0000000000000000",
    "Ssellableqty": "0000000000000000",
    "Sunercsellordqty": "0000000000000000",
    "Savrpchsprc": "0000000001098",
    "Spchsamt": "0000000000000000",
    "Sdeposit": "0000000941117355",
    "Ssubstamt": "0000000168735470",
    "Scsgnmnymgn": "0000000000000978",
    "Scsgnsubstmgn": "0000000000000000",
    "Scrdtpldgruseamt": "0000000000000000",
    "Sordablemny": "0000000941116377",
    "Sordablesubstamt": "0000000168735470",
    "Sruseableamt": "0000000000000000"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
