---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=9a2800c3-9bf2-4d67-8d83-905074f06646"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "9a2800c3-9bf2-4d67-8d83-905074f06646"
api_name: "[주식] 실시간 시세"
tr_id: "1271t7l3-m48x-exbc-415w-j3zmt0ovt53z"
tr_code: "SC3"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/stock"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 주식주문취소 (SC3)

<!-- request_field_count: 4 -->
<!-- response_field_count: 1 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 실시간 시세 |
| TR명 | 주식주문취소 |
| TR코드 | `SC3` |
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

문서 미기재

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "1"
  },
  "body": {
    "tr_cd": "SC3",
    "tr_key": ""
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "SC3"
  },
  "body": {
    "grpId": "A1100000000000000000",
    "trchno": "0",
    "trtzxLevytp": "0",
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
    "exectime": "150622765",
    "cont": "N",
    "mnymgnrat": ".000",
    "mdfycnfqty": "0",
    "orgordcancqty": "1",
    "compress": "0",
    "execprc": "0",
    "mdfycnfprc": "0",
    "unercsellordqty": "0",
    "cmsnamtexecamt": "0",
    "ruseableamt": "0",
    "gubun": "B",
    "trid": "4000150622737537",
    "flctqty": "0",
    "execno": "0",
    "lptp": "0",
    "varmsglen": "0",
    "ordno": "88343",
    "futsmkttp": "",
    "crdtexecamt": "0",
    "deposit": "78489774",
    "frgrunqno": "000000",
    "crdayruseexecval": "0",
    "trsrc": "L",
    "ordacntno": "20011132702",
    "reqcnt": " ",
    "shtnIsuno": "A000020",
    "accno1": "20011132702",
    "strtgcode": "",
    "ordseqno": "0",
    "Isunm": "동화약품",
    "ordablesubstamt": "1260000",
    "encrypt": "0",
    "Isuno": "KR7000020008",
    "accno2": "",
    "contkey": "0",
    "Loandt": "00000000",
    "seq": "000000009",
    "lineseq": "200000012",
    "varlen": "50",
    "orduserId": "hdkrggg4",
    "mgmtbrnno": "106",
    "rjtqty": "0",
    "ordprcptncode": "00",
    "stdIsuno": "KR7000020008",
    "pchsant": "0",
    "filler": "",
    "secbalqty": "0",
    "ordxctptncode": "13",
    "canccnfqty": "1",
    "ordablemny": "78173174",
    "pubip": "010130001138",
    "prvip": "",
    "funckey": "C",
    "accno": "20011132702",
    "compreq": "0",
    "crdtpldgruseamt": "0",
    "ordamt": "9500",
    "termno": "",
    "crdtpldgexecamt": "0",
    "ordcndi": "0",
    "rmndLoanamt": "0",
    "bpno": "106",
    "substamt": "1302000",
    "mgempno": "999999106",
    "csgnsubstmgn": "42000",
    "offset": "212",
    "rcptexectime": "150622765",
    "sellableqty": "0",
    "spotexecqty": "0",
    "varhdlen": "0",
    "substmgnrat": ".3000000",
    "ordavrexecprc": "0",
    "itemno": "0",
    "mgntrncode": "000",
    "nsavtrdqty": "0",
    "ifinfo": "",
    "ordableruseqty": "0",
    "ptflno": "0",
    "secbalqtyd2": "0",
    "brwmgmtYn": "0",
    "eventid": "",
    "csgnmnymgn": "316600",
    "pcbpno": "000",
    "orgordno": "88342",
    "ifid": "000",
    "media": "HT",
    "mtiordseqno": "0",
    "filler1": "",
    "orgordunercqty": "5",
    "mbrnmbrno": "0",
    "futsLnkbrnno": "",
    "commdacode": "40",
    "stslexecqty": "0",
    "proctm": "150622765",
    "bfstdIsuno": "KR7000020008",
    "futsLnkacntno": "",
    "lang": "K",
    "unercqty": "0",
    "execqty": "0",
    "adduptp": "40",
    "bskno": "0",
    "spotordableqty": "0",
    "ubstexecamt": "0",
    "cvrgordtp": "0",
    "ordqty": "1",
    "mnyexecamt": "0",
    "outgu": "1",
    "msgcode": "9999",
    "ordtrdptncode": "00",
    "ordmktcode": "10",
    "ordptncode": "02",
    "prdayruseexecval": "0",
    "comid": "063",
    "bnstp": "2",
    "user": "hdkrggg4",
    "ordprc": "0"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
