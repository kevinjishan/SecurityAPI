---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=68dccbef-704a-4ebc-86ac-e44056c5687b&api_id=85fc552d-4bcd-45e5-8fd3-62eaf01b7e5c"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식시세(실시간)"
api_id: "85fc552d-4bcd-45e5-8fd3-62eaf01b7e5c"
api_name: "[실시간]해외주식 주문체결 조회"
tr_id: "491661d9-a93e-4f77-b333-0c640d2adc06"
tr_code: "IS2"
method: "POST"
domain: "wss://openapi.dbsec.co.kr:7070"
path: "/pub/IS2"
content_type: "application/json;charset=utf-8"
rate_limit: "-"
auth_required: true
---

# [실시간]해외주식 주문체결 (IS2)

<!-- request_field_count: 4 -->
<!-- response_field_count: 44 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식시세(실시간) |
| API 페이지 | [실시간]해외주식 주문체결 조회 |
| TR명 | [실시간]해외주식 주문체결 |
| TR코드 | `IS2` |
| 초당 전송 건수 | - |
| 설명 | 해외주식 실시간 주문체결 API 입니다.<br>주문 체결시 내역이 출력됩니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.dbsec.co.kr:7070` |
| 모의투자 도메인 | `wss://openapi.dbsec.co.kr:17070` |
| URL | `/pub/IS2` |
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
| Request Body | `tr_cd` | 거래코드 | String | Y | 3 | TR코드입력: IS2 |
| Request Body | `tr_key` | 종목코드 | String | Y | 20 | 입력 X |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `tr_cd` | 거래코드 | String | Y | 3 | TR코드 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Sordxctptncode` | 주문체결유형코드 | String | Y | 2 | 00: 해당없음<br>01: 주문<br>02: 정정<br>03: 취소<br>11: 체결<br>12: 정정확인<br>13: 취소확인<br>14: 거부 |
| Response Body | `Sorddt` | 주문일자 | String | Y | 8 | - |
| Response Body | `Strancode` | 서비스 코드 | String | Y | 10 | - |
| Response Body | `Sordno` | 주문번호 | String | Y | 10 | - |
| Response Body | `Sorgordno` | 원주문번호 | String | Y | 10 | - |
| Response Body | `Sastkisuno` | 해외주식종목번호 | String | Y | 20 | - |
| Response Body | `Ssymcode` | 심볼코드 | String | Y | 12 | - |
| Response Body | `Sastkisunm` | 해외주식종목명 | String | Y | 40 | - |
| Response Body | `Sastkmktcode` | 해외주식시장코드 | String | Y | 2 | - |
| Response Body | `Sastkmktnm` | 해외주식시장명 | String | Y | 20 | - |
| Response Body | `Sownsecode` | 자체증권거래소코드 | String | Y | 2 | - |
| Response Body | `Sastkbnstpcode` | 해외주식매매구분코드 | String | Y | 1 | 0: 전체<br>1: 매도<br>2: 매수 |
| Response Body | `Sastkbnstpnm` | 해외주식매매구분명 | String | Y | 10 | - |
| Response Body | `Sordtrdtpcode` | 주문거래구분코드 | String | Y | 1 | 0: 원주문<br>1: 정정주문<br>2: 취소주문 |
| Response Body | `Sastkordqty` | 해외주식주문수량 | String | Y | 16 | - |
| Response Body | `Sastkordprc` | 해외주식주문가격 | String | Y | 16 | - |
| Response Body | `Sastkordprcptncode` | 해외주식호가유형코드 | String | Y | 1 | 1: 지정가<br>2: 시장가 |
| Response Body | `Sastkordprcptnnm` | 해외주식호가유형명 | String | Y | 20 | - |
| Response Body | `Sastkordcnditpcode` | 해외주식주문조건구분코드 | String | Y | 1 | 1:FAS <br>2:IOC <br>3:FOK |
| Response Body | `Sastkordcnditpnm` | 해외주식주문조건구분명 | String | Y | 10 | - |
| Response Body | `Scrcycode` | 통화코드 | String | Y | 3 | - |
| Response Body | `Sshtncntrysymcode` | 단축국가심볼코드 | String | Y | 2 | - |
| Response Body | `Sastkordstatnm` | 해외주식주문상태명 | String | Y | 20 | - |
| Response Body | `Sastkorddttm` | 해외주식주문일시 | String | Y | 17 | - |
| Response Body | `Sastklclorddttm` | 해외주식현지주문일시 | String | Y | 17 | - |
| Response Body | `Sastkexecqty` | 체결수량 | String | Y | 16 | - |
| Response Body | `Sastkexecprc` | 체결가격 | String | Y | 16 | - |
| Response Body | `Sastkacmexecqty` | 누적체결수량 | String | Y | 16 | - |
| Response Body | `Sastkexecavruprc` | 체결평균단가 | String | Y | 16 | - |
| Response Body | `Sastkunercqty` | 미체결수량 | String | Y | 16 | - |
| Response Body | `Sastkexecamt` | 체결금액 | String | Y | 16 | - |
| Response Body | `Sastkexecdttm` | 외주식체결일시 | String | Y | 17 | - |
| Response Body | `Sastklclexecdttm` | 해외주식현지체결일시 | String | Y | 17 | - |
| Response Body | `Smgntrncode` | 신용거래코드 | String | Y | 3 | - |
| Response Body | `Sloandt` | 대출일자 | String | Y | 8 | - |
| Response Body | `Sastkexecbaseqty` | 해외주식체결기준수량 | String | Y | 16 | - |
| Response Body | `Sastkordableqty` | 해외주식주문가능수량 | String | Y | 16 | - |
| Response Body | `Sastkbuyamt` | 해외주식매수금액 | String | Y | 16 | - |
| Response Body | `Sastkbuycmsn` | 해외주식매수수수료 | String | Y | 16 | - |
| Response Body | `Sthdayrlzpnlamt` | 당일실현손익금액 | String | Y | 16 | - |
| Response Body | `Sastkselllclcmsnrat` | 해외주식매도현지수수료율 | String | Y | 16 | - |
| Response Body | `Sastkbuylclcmsnrat` | 해외주식매수현지수수료율 | String | Y | 16 | - |
| Response Body | `Sacntno` | 게좌번호 | String | Y | 20 | - |

## 예제

### Request

```json
{
  "header": {
    "token": "{{ _.access_token }}",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "IS2"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "IS2"
  },
  "body": {
    "Strancode": "CAZCT00100",
    "Sordxctptncode": "01",
    "Sacntno": "11111111111",
    "Sorddt": "20240202",
    "Sordno": "0000000005",
    "Sorgordno": "0000000000",
    "Sastkisuno": "000001.SZ",
    "Ssymcode": "000001",
    "Sastkisunm": "평안은행",
    "Sastkmktcode": "SZ",
    "Sastkmktnm": "심천",
    "Sownsecode": "ZS",
    "Sastkbnstpcode": "2",
    "Sastkbnstpnm": "매수",
    "Sordtrdtpcode": "0",
    "Sastkordqty": "0000000000000100",
    "Sastkordprc": "00000000009.4300",
    "Sastkordprcptncode": "1",
    "Sastkordprcptnnm": "지정가",
    "Sastkordcnditpcode": "1",
    "Sastkordcnditpnm": "일반",
    "Scrcycode": "CNY",
    "Sshtncntrysymcode": "CN",
    "Sastkordstatnm": "송신",
    "Scommdacode": "50",
    "Scommdacodenm": "해피+",
    "Sastkorddttm": "20240202103110235",
    "Sastklclorddttm": "20240202093110023",
    "Sastkexecqty": "0000000000000000",
    "Sastkexecprc": "00000000000.0000",
    "Sastkacmexecqty": "0000000000000000",
    "Sastkexecavruprc": "00000000000.0000",
    "Sastkunercqty": "0000000000000100",
    "Sastkexecamt": "0000000000000.00",
    "Sastkexecdttm": "",
    "Sastklclexecdttm": "",
    "Smgntrncode": "000",
    "Sloandt": "",
    "Sastkexecbaseqty": "0000000000000100",
    "Sastkordableqty": "0000000000000000",
    "Sastkbuyamt": "0000000000941.00",
    "Sastkbuycmsn": "0000000000000.55",
    "Sthdayrlzpnlamt": "0000000000000000",
    "Sastkselllclcmsnrat": "0000.05000000000",
    "Sastkbuylclcmsnrat": "0000.05841000000"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
