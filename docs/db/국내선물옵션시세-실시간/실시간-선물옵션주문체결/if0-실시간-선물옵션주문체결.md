---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=548b70a6-24cc-4d9d-a7c7-90eb84a497f4&api_id=99f558bf-e02f-40e7-a388-00ade0ddf5ce"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내선물옵션시세(실시간)"
api_id: "99f558bf-e02f-40e7-a388-00ade0ddf5ce"
api_name: "[실시간]선물옵션주문체결"
tr_id: "0d041dd1-6248-450c-8926-1816583d6979"
tr_code: "IF0"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7070"
path: "/pub/IF0"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]선물옵션주문체결 (IF0)

<!-- request_field_count: 4 -->
<!-- response_field_count: 66 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내선물옵션시세(실시간) |
| API 페이지 | [실시간]선물옵션주문체결 |
| TR명 | [실시간]선물옵션주문체결 |
| TR코드 | `IF0` |
| 초당 전송 건수 | - |
| 설명 | 국내선물옵션 실시간 주문체결 API 입니다.<br>주문 체결시 내역이 출력됩니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7070` |
| 모의투자 도메인 | `wss://openapi.dbsec.co.kr:17070` |
| URL | `/pub/IF0` |
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
| Request Body | `tr_cd` | 거래코드 | String | Y | 3 | TR코드입력: IF0 |
| Request Body | `tr_key` | 종목코드 | String | Y | 20 | 입력 X |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래코드 | String | Y | 3 | TR코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Trcode` | TR코드 | String | Y | 4 | FO01: 신규주문<br>    FO02: 정정주문<br>    FO03:  취소주문<br>    HO01:  확인(정정/취소, 신규확인은 없음)<br>    HO10:  차동취소(IOC/FOK)<br>    CH01 : 체결 |
| Response Body | `Strancode` | 서비스코드 | String | Y | 10 | - |
| Response Body | `Sordmktcode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `Juno` | 주문번호 | String | Y | 10 | - |
| Response Body | `Wonjuno` | 원주문번호 | String | Y | 10 | - |
| Response Body | `Mojuno` | 모주문번호 | String | Y | 10 | - |
| Response Body | `Sisuno` | 종목번호 | String | Y | 12 | - |
| Response Body | `Jgcode` | 선물옵션종목번호 | String | Y | 8 | - |
| Response Body | `Jgname` | 선물옵션종목명 | String | Y | 40 | - |
| Response Body | `Spdgrpcode` | 상품군분류코드 | String | Y | 2 | - |
| Response Body | `Dealgb` | 선물옵션종목유형구분 | String | Y | 1 | - |
| Response Body | `Jugb` | 매매구분 | String | Y | 1 | - |
| Response Body | `Canclegb` | 정정취소구분 | String | Y | 1 | - |
| Response Body | `Juqty` | 주문수량 | String | Y | 16 | - |
| Response Body | `Mmgb` | 호가유형코드 | String | Y | 2 | - |
| Response Body | `Sfnotrdptncode` | 거래유형코드 | String | Y | 2 | - |
| Response Body | `Juprc` | 주문가격 | String | Y | 13 | - |
| Response Body | `Micheqty` | 미체결수량 | String | Y | 16 | - |
| Response Body | `Dealamt` | 선물옵션거래단위금액 | String | Y | 19 | - |
| Response Body | `Time` | 처리시각 | String | Y | 9 | - |
| Response Body | `Sopdrtnno` | 운영지시번호 | String | Y | 12 | - |
| Response Body | `Reggb` | 거래소거부코드 | String | Y | 4 | - |
| Response Body | `Realaltgnty` | 정정취소확인수량 | String | Y | 16 | - |
| Response Body | `Wonmicheqty` | 원주문미체결수량 | String | Y | 16 | - |
| Response Body | `Wonjujjqty` | 원주문정정취소수량(MrcQty) | String | Y | 16 | - |
| Response Body | `Sctrcttime` | 약정시각(거래소체결시각) | String | Y | 8 | - |
| Response Body | `Yakno` | 약정번호 | String | Y | 10 | - |
| Response Body | `Cheprc` | 체결가격 | String | Y | 13 | - |
| Response Body | `Cheqty` | 체결수량 | String | Y | 16 | - |
| Response Body | `Snewqty` | 신규체결수량 | String | Y | 16 | - |
| Response Body | `Slqdtqty` | 청산체결수량 | String | Y | 16 | - |
| Response Body | `Slastqty` | 최종결제수량 | String | Y | 16 | - |
| Response Body | `Cheqtyall` | 전체체결수량 | String | Y | 16 | - |
| Response Body | `Cheprcall` | 전체체결금액 | String | Y | 16 | - |
| Response Body | `Sfnobalevaltp` | 잔고평가구분 | String | Y | 1 | - |
| Response Body | `Sbnsplamt` | 매매손익금액(스프레드제외) | String | Y | 16 | - |
| Response Body | `Jgcode1` | 선물옵션종목번호1 | String | Y | 8 | - |
| Response Body | `Mmgb1` | 매매구분1 | String | Y | 1 | - |
| Response Body | `Chejisu1` | 체결가1 | String | Y | 13 | - |
| Response Body | `Snewqty1` | 신규체결수량1 | String | Y | 16 | - |
| Response Body | `Slqdtqty1` | 청산체결수량1 | String | Y | 16 | - |
| Response Body | `Cheprc1` | 전체체결금액1 | String | Y | 16 | - |
| Response Body | `Jgcode2` | 선물옵션종목번호2 | String | Y | 8 | - |
| Response Body | `Mmgb2` | 매매구분2 | String | Y | 1 | - |
| Response Body | `Chejisu2` | 체결가2 | String | Y | 13 | - |
| Response Body | `Snewqty2` | 신규체결수량2 | String | Y | 16 | - |
| Response Body | `Slqdtqty2` | 청산체결수량2 | String | Y | 16 | - |
| Response Body | `Cheprc2` | 전체체결금액2 | String | Y | 16 | - |
| Response Body | `Yetakcash` | 예수금 | String | Y | 16 | - |
| Response Body | `Yetakdae` | 선물대용지정금액 | String | Y | 16 | - |
| Response Body | `Smgn` | 증거금 | String | Y | 16 | - |
| Response Body | `Smnymgn` | 증거금현금 | String | Y | 16 | - |
| Response Body | `Jumuntot` | 주문가능금액 | String | Y | 16 | - |
| Response Body | `Jumuncash` | 주문가능현금액 | String | Y | 16 | - |
| Response Body | `Jgcode21` | 잔고종목번호1 | String | Y | 8 | - |
| Response Body | `Janmmgb1` | 잔고매매구분1 | String | Y | 1 | - |
| Response Body | `Openyak1` | 미결제수량1 | String | Y | 16 | - |
| Response Body | `Bettingvol1` | 주문가능수량1 | String | Y | 16 | - |
| Response Body | `Yakavgdan1` | 평균가1 | String | Y | 13 | - |
| Response Body | `Jgcode22` | 잔고종목번호2 | String | Y | 8 | - |
| Response Body | `Janmmgb2` | 잔고매매구분2 | String | Y | 1 | - |
| Response Body | `Openyak2` | 미결제수량2 | String | Y | 16 | - |
| Response Body | `Bettingvol2` | 주문가능수량2 | String | Y | 16 | - |
| Response Body | `Yakavgdan2` | 평균가2 | String | Y | 13 | - |
| Response Body | `Gejano` | 게좌번호 | String | Y | 20 | - |

## 예제

### Request

```text
"{
 "header": {
  "token" : "{{ _.access_token }}",
  "tr_type": "3"
 },
 "body": {
  "tr_cd": "IF0"
 }
}"
```

### Response

```text
"{
 "header": {
  "tr_cd": "IF0"
 },
 "body": {
  "Strancode": "CFOAT80100",
  "Trcode": "CH01",
  "Gejano": "02060701975",
  "Gejaname": "ZO동국선민",
  "Sbrnno": "020",
  "Sordmktcode": "40",
  "Juno": "0000002136",
  "Wonjuno": "0000000000",
  "Mojuno": "0000000000",
  "Sisuno": "KR4101V30005",
  "Jgcode": "101V3000",
  "Jgname": "F 202403",
  "Spdgrpcode": "01",
  "Dealgb": "F",
  "Jugb": "2",
  "Canclegb": "0",
  "Juqty": "0000000000000010",
  "Mmgb": "00",
  "Sfnotrdptncode": "03",
  "Juprc": "0000000349.45",
  "Micheqty": "0000000000000000",
  "Commgb": "50",
  "Scmsnamtaddupcode": "01",
  "Sawon": "000020",
  "Dealamt": "0000250000.00000000",
  "Time": "130511907",
  "Plancode": "",
  "Grpcode": "",
  "Plancnt": "0000000000",
  "Sptflno": "0000000000",
  "Sbskno": "0000000000",
  "Strchno": "0000000000",
  "Sitemno": "0000000000",
  "Suserid": "dsfuture",
  "Sopdrtnno": "",
  "Reggb": "",
  "Realaltgnty": "0000000000000000",
  "Wonmicheqty": "0000000000000000",
  "Wonjujjqty": "0000000000000000",
  "Sctrcttime": "13051190",
  "Yakno": "0000000012",
  "Cheprc": "0000000349.45",
  "Cheqty": "0000000000000010",
  "Snewqty": "0000000000000010",
  "Slqdtqty": "0000000000000000",
  "Slastqty": "0000000000000000",
  "Cheqtyall": "0000000000000010",
  "Cheprcall": "0000000873625000",
  "Sfnobalevaltp": "1",
  "Sbnsplamt": "0000000000000000",
  "Jgcode1": "",
  "Mmgb1": "",
  "Chejisu1": "0000000000.00",
  "Snewqty1": "0000000000000000",
  "Slqdtqty1": "0000000000000000",
  "Cheprc1": "0000000000000000",
  "Jgcode2": "",
  "Mmgb2": "",
  "Chejisu2": "0000000000.00",
  "Snewqty2": "0000000000000000",
  "Slqdtqty2": "0000000000000000",
  "Cheprc2": "0000000000000000",
  "Yetakcash": "0000001071497188",
  "Yetakdae": "0000000003493800",
  "Smgn": "0000000870701680",
  "Smnymgn": "0000000435427340",
  "Jumuntot": "0000000000000000",
  "Jumuncash": "0000000000000000",
  "Jgcode21": "101V3000",
  "Janmmgb1": "2",
  "Openyak1": "0000000000000095",
  "Bettingvol1": "0000000000000095",
  "Yakavgdan1": "0000353.22836",
  "Jgcode22": "",
  "Janmmgb2": "",
  "Openyak2": "0000000000000000",
  "Bettingvol2": "0000000000000000",
  "Yakavgdan2": "0000000.00000"
 }
}"
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
