---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=94b5fddc-b819-451b-9619-13ee42468798&api_id=24ae5513-5186-4e7e-a4eb-66bfe10a0d8a"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세(실시간)"
api_id: "24ae5513-5186-4e7e-a4eb-66bfe10a0d8a"
api_name: "[실시간]주식주문접수 조회"
tr_id: "fa256504-a486-490e-b023-a6f1f7badacb"
tr_code: "IS0"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7070"
path: "/pub/IS0"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]주식주문접수 (IS0)

<!-- request_field_count: 4 -->
<!-- response_field_count: 50 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세(실시간) |
| API 페이지 | [실시간]주식주문접수 조회 |
| TR명 | [실시간]주식주문접수 |
| TR코드 | `IS0` |
| 초당 전송 건수 | - |
| 설명 | 국내주식 실시간 주문접수 API 입니다.<br>주문 접수시 내역이 출력됩니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7070` |
| 모의투자 도메인 | `wss://openapi.dbsec.co.kr:17070` |
| URL | `/pub/IS0` |
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
| Request Body | `tr_cd` | 거래코드 | String | Y | 3 | TR코드입력: IS0 |
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
| Response Body | `Sordmktcode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `Strancode` | 서비스코드 | String | Y | 10 | - |
| Response Body | `Sordptncode` | 주문유형코드 | String | Y | 2 | - |
| Response Body | `Sorgordno` | 원주문번호 | String | Y | 10 | - |
| Response Body | `Sisuno` | 종목번호 | String | Y | 12 | - |
| Response Body | `Sshtnisuno` | 단축종목번호 | String | Y | 9 | - |
| Response Body | `Sisunm` | 종목명 | String | Y | 40 | - |
| Response Body | `Sordqty` | 주문수량 | String | Y | 16 | - |
| Response Body | `Sordprc` | 주문가 | String | Y | 13 | - |
| Response Body | `Sordcndi` | 주문조건 | String | Y | 1 | - |
| Response Body | `Sordprcptncode` | 호가유형코드 | String | Y | 2 | - |
| Response Body | `Sprgmordprcptncode` | 프로그램호가유형코드 | String | Y | 2 | - |
| Response Body | `Smgntrncode` | 신용거래코드 | String | Y | 3 | - |
| Response Body | `Sloandt` | 대출일 | String | Y | 8 | - |
| Response Body | `Scvrgordtp` | 반대매매주문구분 | String | Y | 1 | - |
| Response Body | `Sordno` | 주문번호 | String | Y | 10 | - |
| Response Body | `Sordtm` | 주문시각 | String | Y | 9 | - |
| Response Body | `Sprntordno` | 모주문번호 | String | Y | 10 | - |
| Response Body | `Sorgordunercqty` | 원주문미체결수량 | String | Y | 16 | - |
| Response Body | `Sorgordmdfyqty` | 원주문정정수량 | String | Y | 16 | - |
| Response Body | `Sorgordcancqty` | 원주문취소수량 | String | Y | 16 | - |
| Response Body | `Sordamt` | 주문금액 | String | Y | 16 | - |
| Response Body | `Sbnstp` | 매매구분 | String | Y | 1 | - |
| Response Body | `Sspotordqty` | 실물주문수량 | String | Y | 16 | - |
| Response Body | `Sordruseqty` | 재사용주문수량 | String | Y | 16 | - |
| Response Body | `Smnyordamt` | 현금주문금액 | String | Y | 16 | - |
| Response Body | `Sordsubstamt` | 주문대용금액 | String | Y | 16 | - |
| Response Body | `Sruseordamt` | 재사용주문금액 | String | Y | 16 | - |
| Response Body | `Sordcmsnamt` | 수수료주문금액 | String | Y | 16 | - |
| Response Body | `Susecrdtpldgruseamt` | 사용신용담보재사용금 | String | Y | 16 | - |
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
    "tr_cd": "IS0"
  }
}
```

### Response

```text
"{
 "header": {
  "tr_cd": "IS0"
 },
 "body": {
  "Strancode": "CSPAT00600",
  "Sordxctptncode": "01",
  "Sordmktcode": "10",
  "Sordptncode": "02",
  "Sorgordno": "0000000000",
  "Sacntno": "10590765201",
  "Spwd": "********",
  "Sisuno": "KR7005930003",
  "Sshtnisuno": "A005930",
  "Sisunm": "삼성전자",
  "Sordqty": "0000000000000010",
  "Sordprc": "0000000080000",
  "Sordcndi": "0",
  "Sordprcptncode": "00",
  "Sprgmordprcptncode": "00",
  "Sstslordprctp": "0",
  "Sstslableyn": "0",
  "Smgntrncode": "000",
  "Sloandt": "00000000",
  "Scvrgordtp": "0",
  "Sstrtgcode": "",
  "Sgrpid": "",
  "Sordseqno": "0000000000",
  "Sptflno": "0000000000",
  "Sbskno": "0000000000",
  "Strchno": "0000000000",
  "Sitemno": "0000000000",
  "Sbrwmgmtyn": "0",
  "Smbrno": "031",
  "Sfnosubstcvrgtp": "0",
  "Sfutslnkbrnno": "019",
  "Sfutslnkacntno": "00000000000000000000",
  "Sfutsmkttp": "0",
  "OutCommtype": "50",
  "Slptp": "0",
  "OutDummy": "",
  "Sordno": "0000034048",
  "Sordtm": "101020317",
  "Sprntordno": "0000034048",
  "Smgempno": "000579",
  "Sorgordunercqty": "0000000000000000",
  "Sorgordmdfyqty": "0000000000000000",
  "Sorgordcancqty": "0000000000000000",
  "Snmcpysndno": "0000000000",
  "Sordamt": "0000000000800000",
  "Sbnstp": "2",
  "Sspareordno": "0000000000",
  "Scvrgseqno": "0000000000",
  "Srsvordno": "0000000000",
  "Smtiordseqno": "0000000000",
  "Sspareordqty": "0000000000000000",
  "Sorduserid": "dsfuture",
  "Sspotordqty": "0000000000000000",
  "Sordruseqty": "0000000000000000",
  "Smnyordamt": "0000000000800000",
  "Sordsubstamt": "0000000000000000",
  "Sruseordamt": "0000000000000000",
  "Sordcmsnamt": "0000000000000000",
  "Susecrdtpldgruseamt": "0000000000000000",
  "Ssecbalqty": "0000000000000000",
  "Sspotordableqty": "0000000000000000",
  "Sordableruseqty": "0000000000000000",
  "Sflctqty": "0000000000000000",
  "Ssecbalqtyd2": "0000000000000000",
  "Ssellableqty": "0000000000000000",
  "Sunercsellordqty": "0000000000000000",
  "Savrpchsprc": "0039000000.00",
  "Spchsamt": "0000000000000000",
  "Sdeposit": "0000000300131030",
  "Ssubstamt": "0000000000000000",
  "Scsgnmnymgn": "0000000080780048",
  "Scsgnsubstmgn": "0000000000000000",
  "Scrdtpldgruseamt": "",
  "Sordablemny": "0000000219350982",
  "Sordablesubstamt": "0000000000000000",
  "Sruseableamt": "0000000000000000"
 }
}"
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
