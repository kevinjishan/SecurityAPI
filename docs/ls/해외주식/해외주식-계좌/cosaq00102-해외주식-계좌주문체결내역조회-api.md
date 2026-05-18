---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cdb7e1bc-f7c5-425c-8248-aa83dbb6919f&api_id=45b5abe1-a6e1-4833-a9cb-7eb0c408dba3"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "해외주식"
api_id: "45b5abe1-a6e1-4833-a9cb-7eb0c408dba3"
api_name: "[해외주식] 계좌"
tr_id: "b08d5789-9810-4293-8e9b-470d7ab4a2f7"
tr_code: "COSAQ00102"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/overseas-stock/accno"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# 해외주식 계좌주문체결내역조회 API (COSAQ00102)

<!-- request_field_count: 19 -->
<!-- response_field_count: 66 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식 |
| API 페이지 | [해외주식] 계좌 |
| TR명 | 해외주식 계좌주문체결내역조회 API |
| TR코드 | `COSAQ00102` |
| 초당 전송 건수 | 1 |
| 설명 | 해외주식 계좌별 거래내역 및 잔고 등 계좌에 관련된 서비스를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/overseas-stock/accno` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth토큰이필요한API경우발급한AccessToken을설정하기위한RequestHeaederParameter |
| Request Header | `tr_cd` | 거래CD | String | Y | 10 | LS증권거래코드 |
| Request Header | `tr_cont` | 연속거래여부 | String | Y | 1 | 연속거래여부Y:연속○N:연속× |
| Request Header | `tr_cont_key` | 연속거래Key | String | Y | 18 | 연속일경우그전에내려온연속키값올림 |
| Request Header | `mac_address` | MAC주소 | String | Y | 12 | 법인인경우필수세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `-COSAQ00102InBlock1` | COSAQ00102InBlock1 | Object | Y | - | - |
| Request Body | `-RecCnt` | 레코드갯수 | Object | Y | 5 | 00001 |
| Request Body | `-QryTpCode` | 조회구분코드 | String | Y | 1 | 1@계좌별 |
| Request Body | `-BkseqTpCode` | 역순구분코드 | String | Y | 1 | 1@역순<br>2@정순 |
| Request Body | `-OrdMktCode` | 주문시장코드 | String | Y | 2 | 81@뉴욕거래소<br>82@NASDAQ |
| Request Body | `-BnsTpCode` | 매매구분코드 | String | Y | 1 | 0@전체<br>1@매도<br>2@매수 |
| Request Body | `-IsuNo` | 종목번호 | String | Y | 12 | - |
| Request Body | `-SrtOrdNo` | 시작주문번호 | Object | Y | 10 | 역순인경우 999999999<br>정순인 경우 0 |
| Request Body | `-OrdDt` | 주문일자 | String | Y | 8 | - |
| Request Body | `-ExecYn` | 체결여부 | String | Y | 1 | 0@전체<br>1@체결<br>2@미체결 |
| Request Body | `-CrcyCode` | 통화코드 | String | Y | 3 | 000@전체<br>USD@미국 |
| Request Body | `-ThdayBnsAppYn` | 당일매매적용여부 | String | Y | 1 | 0@미적용<br>1@적용 |
| Request Body | `-LoanBalHldYn` | 대출잔고보유여부 | String | Y | 1 | 0@ 전체<br>1@ 대출잔고만 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Response Header | `tr_cd` | 거래CD | String | Y | 10 | LS증권거래코드 |
| Response Header | `tr_cont` | 연속거래여부 | String | Y | 1 | 연속거래여부Y:연속○N:연속× |
| Response Header | `tr_cont_key` | 연속거래Key | String | Y | 18 | 연속일경우그전에내려온연속키값올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `-COSAQ00102OutBlock1` | COSAQ00102OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Object | Y | 5 | - |
| Response Body | `-QryTpCode` | 조회구분코드 | String | Y | 1 | - |
| Response Body | `-BkseqTpCode` | 역순구분코드 | String | Y | 1 | - |
| Response Body | `-OrdMktCode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-Pwd` | 비밀번호 | String | Y | 8 | - |
| Response Body | `-BnsTpCode` | 매매구분코드 | String | Y | 1 | - |
| Response Body | `-IsuNo` | 종목번호 | String | Y | 12 | - |
| Response Body | `-SrtOrdNo` | 시작주문번호 | Object | Y | 10 | - |
| Response Body | `-OrdDt` | 주문일자 | String | Y | 8 | - |
| Response Body | `-ExecYn` | 체결여부 | String | Y | 1 | - |
| Response Body | `-CrcyCode` | 통화코드 | String | Y | 3 | - |
| Response Body | `-ThdayBnsAppYn` | 당일매매적용여부 | String | Y | 1 | - |
| Response Body | `-LoanBalHldYn` | 대출잔고보유여부 | String | Y | 1 | - |
| Response Body | `-COSAQ00102OutBlock2` | COSAQ00102OutBlock2 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Object | Y | 5 | - |
| Response Body | `-AcntNm` | 계좌명 | String | Y | 40 | - |
| Response Body | `-JpnMktHanglIsuNm` | 일본시장한글종목명 | String | Y | 100 | - |
| Response Body | `-MgmtBrnNm` | 관리지점명 | String | Y | 40 | - |
| Response Body | `-SellExecFcurrAmt` | 매도체결외화금액 | Object | Y | 21.4 | - |
| Response Body | `-SellExecQty` | 매도체결수량 | Object | Y | 16 | - |
| Response Body | `-BuyExecFcurrAmt` | 매수체결외화금액 | Object | Y | 21.4 | - |
| Response Body | `-BuyExecQty` | 매수체결수량 | Object | Y | 16 | - |
| Response Body | `-COSAQ00102OutBlock3` | COSAQ00102OutBlock3 | Object | Y | - | - |
| Response Body | `-MgmtBrnNo` | 관리지점번호 | String | Y | 3 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-AcntNm` | 계좌명 | String | Y | 40 | - |
| Response Body | `-ExecTime` | 체결시각 | String | Y | 9 | - |
| Response Body | `-OrdTime` | 주문시각 | String | Y | 9 | - |
| Response Body | `-OrdNo` | 주문번호 | Object | Y | 10 | - |
| Response Body | `-OrgOrdNo` | 원주문번호 | Object | Y | 10 | - |
| Response Body | `-ShtnIsuNo` | 단축종목번호 | String | Y | 9 | - |
| Response Body | `-OrdTrxPtnNm` | 주문처리유형명 | String | Y | 50 | - |
| Response Body | `-OrdTrxPtnCode` | 주문처리유형코드 | Object | Y | 9 | - |
| Response Body | `-MrcAbleQty` | 정정취소가능수량 | Object | Y | 16 | - |
| Response Body | `-OrdQty` | 주문수량 | Object | Y | 16 | - |
| Response Body | `-OvrsOrdPrc` | 해외주문가 | Object | Y | 22.7 | - |
| Response Body | `-ExecQty` | 체결수량 | Object | Y | 16 | - |
| Response Body | `-OvrsExecPrc` | 해외체결가 | Object | Y | 28.7 | - |
| Response Body | `-OrdprcPtnCode` | 호가유형코드 | String | Y | 2 | - |
| Response Body | `-OrdprcPtnNm` | 호가유형명 | String | Y | 40 | - |
| Response Body | `-OrdPtnNm` | 주문유형명 | String | Y | 40 | - |
| Response Body | `-OrdPtnCode` | 주문유형코드 | String | Y | 2 | - |
| Response Body | `-MrcTpCode` | 정정취소구분코드 | String | Y | 1 | - |
| Response Body | `-MrcTpNm` | 정정취소구분명 | String | Y | 10 | - |
| Response Body | `-AllExecQty` | 전체체결수량 | Object | Y | 16 | - |
| Response Body | `-CommdaCode` | 통신매체코드 | String | Y | 2 | - |
| Response Body | `-OrdMktCode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `-MktNm` | 시장명 | String | Y | 40 | - |
| Response Body | `-CommdaNm` | 통신매체명 | String | Y | 40 | - |
| Response Body | `-JpnMktHanglIsuNm` | 일본시장한글종목명 | String | Y | 100 | - |
| Response Body | `-UnercQty` | 미체결수량 | Object | Y | 16 | - |
| Response Body | `-CnfQty` | 확인수량 | Object | Y | 16 | - |
| Response Body | `-CrcyCode` | 통화코드 | String | Y | 3 | - |
| Response Body | `-RegMktCode` | 등록시장코드 | String | Y | 2 | - |
| Response Body | `-IsuNo` | 종목번호 | String | Y | 12 | - |
| Response Body | `-BrkTpCode` | 중개인구분코드 | String | Y | 2 | - |
| Response Body | `-OppBrkNm` | 상대중개인명 | String | Y | 40 | - |
| Response Body | `-BnsTpCode` | 매매구분코드 | String | Y | 1 | - |
| Response Body | `-LoanDt` | 대출일자 | String | Y | 8 | - |
| Response Body | `-LoanAmt` | 대출금액 | Object | Y | 16 | - |

## 예제

### Request

```json
{
  "COSAQ00102InBlock1": {
    "RecCnt": 1,
    "QryTpCode": "1",
    "BkseqTpCode": "1",
    "OrdMktCode": "82",
    "BnsTpCode": "0",
    "IsuNo": "TSLA",
    "SrtOrdNo": 999999999,
    "OrdDt": "20250407",
    "ExecYn": "0",
    "CrcyCode": "000",
    "ThdayBnsAppYn": "0",
    "LoanBalHldYn": "0"
  }
}
```

### Response

```json
{
  "COSAQ00102OutBlock1": {
    "RecCnt": 1,
    "QryTpCode": "1",
    "BkseqTpCode": "1",
    "OrdMktCode": "82",
    "AcntNo": "12345678900",
    "Pwd": "********",
    "BnsTpCode": "0",
    "IsuNo": "",
    "SrtOrdNo": 999999999,
    "OrdDt": "20250407",
    "ExecYn": "0",
    "CrcyCode": "000",
    "ThdayBnsAppYn": "0",
    "LoanBalHldYn": "0"
  },
  "COSAQ00102OutBlock2": {
    "RecCnt": 1,
    "AcntNm": "",
    "JpnMktHanglIsuNm": "",
    "MgmtBrnNm": "회사전체",
    "SellExecFcurrAmt": "0.0000",
    "SellExecQty": 0,
    "BuyExecFcurrAmt": "3300.0000",
    "BuyExecQty": 15
  },
  "COSAQ00102OutBlock3": [
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "",
      "OrdTime": "224041436",
      "OrdNo": 141,
      "OrgOrdNo": 0,
      "ShtnIsuNo": "TSLA",
      "OrdTrxPtnNm": "취소완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 10,
      "OvrsOrdPrc": "200.0000000",
      "ExecQty": 0,
      "OvrsExecPrc": "0.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수",
      "OrdPtnCode": "02",
      "MrcTpCode": "",
      "MrcTpNm": "정상",
      "AllExecQty": 0,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "테슬라",
      "UnercQty": 0,
      "CnfQty": 0,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "TSLA",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    },
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "223819132",
      "OrdTime": "212742355",
      "OrdNo": 94,
      "OrgOrdNo": 64,
      "ShtnIsuNo": "TSLA",
      "OrdTrxPtnNm": "정정완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 15,
      "OvrsOrdPrc": "220.0000000",
      "ExecQty": 15,
      "OvrsExecPrc": "220.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수정정",
      "OrdPtnCode": "07",
      "MrcTpCode": "",
      "MrcTpNm": "정정",
      "AllExecQty": 15,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "테슬라",
      "UnercQty": 0,
      "CnfQty": 15,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "TSLA",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    },
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "",
      "OrdTime": "211844358",
      "OrdNo": 87,
      "OrgOrdNo": 0,
      "ShtnIsuNo": "PLTR",
      "OrdTrxPtnNm": "취소완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 25,
      "OvrsOrdPrc": "65.0000000",
      "ExecQty": 0,
      "OvrsExecPrc": "0.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수",
      "OrdPtnCode": "02",
      "MrcTpCode": "",
      "MrcTpNm": "정상",
      "AllExecQty": 0,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "팔란티어 테크",
      "UnercQty": 0,
      "CnfQty": 0,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "PLTR",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    },
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "",
      "OrdTime": "204012782",
      "OrdNo": 64,
      "OrgOrdNo": 0,
      "ShtnIsuNo": "TSLA",
      "OrdTrxPtnNm": "접수완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 15,
      "OvrsOrdPrc": "210.0000000",
      "ExecQty": 0,
      "OvrsExecPrc": "0.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수",
      "OrdPtnCode": "02",
      "MrcTpCode": "",
      "MrcTpNm": "정상",
      "AllExecQty": 0,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "테슬라",
      "UnercQty": 0,
      "CnfQty": 0,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "TSLA",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    },
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "",
      "OrdTime": "203932980",
      "OrdNo": 63,
      "OrgOrdNo": 60,
      "ShtnIsuNo": "TSLA",
      "OrdTrxPtnNm": "취소완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 10,
      "OvrsOrdPrc": "0.0000000",
      "ExecQty": 0,
      "OvrsExecPrc": "0.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수취소",
      "OrdPtnCode": "08",
      "MrcTpCode": "",
      "MrcTpNm": "취소",
      "AllExecQty": 0,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "테슬라",
      "UnercQty": 0,
      "CnfQty": 10,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "TSLA",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    },
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "",
      "OrdTime": "203928642",
      "OrdNo": 62,
      "OrgOrdNo": 61,
      "ShtnIsuNo": "TSLA",
      "OrdTrxPtnNm": "취소완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 10,
      "OvrsOrdPrc": "0.0000000",
      "ExecQty": 0,
      "OvrsExecPrc": "0.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수취소",
      "OrdPtnCode": "08",
      "MrcTpCode": "",
      "MrcTpNm": "취소",
      "AllExecQty": 0,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "테슬라",
      "UnercQty": 0,
      "CnfQty": 10,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "TSLA",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    },
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "",
      "OrdTime": "203917598",
      "OrdNo": 61,
      "OrgOrdNo": 0,
      "ShtnIsuNo": "TSLA",
      "OrdTrxPtnNm": "접수완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 10,
      "OvrsOrdPrc": "200.0000000",
      "ExecQty": 0,
      "OvrsExecPrc": "0.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수",
      "OrdPtnCode": "02",
      "MrcTpCode": "",
      "MrcTpNm": "정상",
      "AllExecQty": 0,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "테슬라",
      "UnercQty": 0,
      "CnfQty": 0,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "TSLA",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    },
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "",
      "OrdTime": "203851736",
      "OrdNo": 60,
      "OrgOrdNo": 57,
      "ShtnIsuNo": "TSLA",
      "OrdTrxPtnNm": "정정완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 10,
      "OvrsOrdPrc": "200.0000000",
      "ExecQty": 0,
      "OvrsExecPrc": "0.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수정정",
      "OrdPtnCode": "07",
      "MrcTpCode": "",
      "MrcTpNm": "정정",
      "AllExecQty": 0,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "테슬라",
      "UnercQty": 0,
      "CnfQty": 10,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "TSLA",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    },
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "",
      "OrdTime": "203426976",
      "OrdNo": 57,
      "OrgOrdNo": 55,
      "ShtnIsuNo": "TSLA",
      "OrdTrxPtnNm": "정정완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 10,
      "OvrsOrdPrc": "220.0000000",
      "ExecQty": 0,
      "OvrsExecPrc": "0.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수정정",
      "OrdPtnCode": "07",
      "MrcTpCode": "",
      "MrcTpNm": "정정",
      "AllExecQty": 0,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "테슬라",
      "UnercQty": 0,
      "CnfQty": 10,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "TSLA",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    },
    {
      "MgmtBrnNo": "209",
      "AcntNo": "12345678900",
      "AcntNm": "***",
      "ExecTime": "",
      "OrdTime": "203222932",
      "OrdNo": 55,
      "OrgOrdNo": 0,
      "ShtnIsuNo": "TSLA",
      "OrdTrxPtnNm": "접수완료",
      "OrdTrxPtnCode": 0,
      "MrcAbleQty": 0,
      "OrdQty": 10,
      "OvrsOrdPrc": "225.0000000",
      "ExecQty": 0,
      "OvrsExecPrc": "0.0000000",
      "OrdprcPtnCode": "00",
      "OrdprcPtnNm": "지정가",
      "OrdPtnNm": "매수",
      "OrdPtnCode": "02",
      "MrcTpCode": "",
      "MrcTpNm": "정상",
      "AllExecQty": 0,
      "CommdaCode": "51",
      "OrdMktCode": "82",
      "MktNm": "NASDAQ",
      "CommdaNm": "투혼(iOS)",
      "JpnMktHanglIsuNm": "테슬라",
      "UnercQty": 0,
      "CnfQty": 0,
      "CrcyCode": "USD",
      "RegMktCode": "82",
      "IsuNo": "TSLA",
      "BrkTpCode": "18",
      "OppBrkNm": "MORGAN STANLEY",
      "BnsTpCode": "2",
      "LoanDt": "",
      "LoanAmt": 0
    }
  ],
  "rsp_cd": "00136",
  "rsp_msg": "조회가 완료되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
