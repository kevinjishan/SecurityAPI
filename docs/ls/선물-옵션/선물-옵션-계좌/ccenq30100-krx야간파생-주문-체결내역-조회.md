---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=2f1eea77-5606-4512-93c6-31b21d2ece90&api_id=09a668df-d7e8-4b5c-977f-91d1429b931a"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "선물/옵션"
api_id: "09a668df-d7e8-4b5c-977f-91d1429b931a"
api_name: "[선물/옵션] 계좌"
tr_id: "futroptn-0000-0000-0000-00CCENQ30100"
tr_code: "CCENQ30100"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/futureoption/accno"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# KRX야간파생 주문/체결내역 조회 (CCENQ30100)

<!-- request_field_count: 21 -->
<!-- response_field_count: 57 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 선물/옵션 |
| API 페이지 | [선물/옵션] 계좌 |
| TR명 | KRX야간파생 주문/체결내역 조회 |
| TR코드 | `CCENQ30100` |
| 초당 전송 건수 | 1 |
| 설명 | 주간/야간 선물옵션 계좌별 거래내역 및 잔고 등 계좌에 관련된 서비스를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/futureoption/accno` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | - |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | - |
| Request Header | `tr_cd` | 거래 CD | String | Y | 10 | - |
| Request Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | - |
| Request Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | - |
| Request Header | `mac_address` | MAC 주소 | String | Y | 12 | - |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Request Body | `CCENQ30100InBlock1` | CCENQ30100InBlock1 | Object | Y | - | - |
| Request Body | `-QrySrtDt` | 조회시작일 | String | Y | 8 | - |
| Request Body | `-QryEndDt` | 조회종료일 | String | Y | 8 | - |
| Request Body | `-FnoClssCode` | 선물옵션분류코드 | String | Y | 2 | 00:전체<br>11:선물<br>12:옵션 |
| Request Body | `-PrdgrpCode` | 상품군코드 | String | Y | 2 | 00:전체 |
| Request Body | `-PrdtExecTpCode` | 체결구분 | String | Y | 1 | 0:전체,1:체결,2:미체결 |
| Request Body | `-StnlnSeqTp` | 정렬순서구분 | String | Y | 1 | 1 : 원주문번호역순<br>2 : 원주문번호순<br>3 : 주문번호역순<br>4 : 주문번호순 |
| Request Body | `-MktTpCode` | 시장구분코드 | String | Y | 1 | 0 : 야간장 |
| Request Body | `-CommdaCode` | 통신매체코드 | String | Y | 2 | 99 |
| Request Body | `-FnoIsuNo` | 선물옵션종목번호 | String | Y | 12 | - |
| Request Body | `-FnoTrdPtnCode` | 선물옵션거래유형코드 | String | Y | 2 | 03 |
| Request Body | `-GrpId` | 그룹ID | String | Y | 20 | 미사용 |
| Request Body | `-UserId` | 사용자ID | String | Y | 16 | 미사용 |
| Request Body | `-SrtOrdNo2` | 시작주문번호2 | Number | Y | 10 | 0 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | - |
| Response Header | `tr_cd` | 거래 CD | String | Y | 10 | - |
| Response Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | - |
| Response Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | - |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `CCENQ30100OutBlock1` | CCENQ30100OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-InptPwd` | 입력비밀번호 | String | Y | 8 | - |
| Response Body | `-QrySrtDt` | 조회시작일 | String | Y | 8 | - |
| Response Body | `-QryEndDt` | 조회종료일 | String | Y | 8 | - |
| Response Body | `-FnoClssCode` | 선물옵션분류코드 | String | Y | 2 | - |
| Response Body | `-PrdgrpCode` | 상품군코드 | String | Y | 2 | - |
| Response Body | `-PrdtExecTpCode` | 체결구분 | String | Y | 1 | - |
| Response Body | `-StnlnSeqTp` | 정렬순서구분 | String | Y | 1 | - |
| Response Body | `-MktTpCode` | 시장구분코드 | String | Y | 1 | - |
| Response Body | `-CommdaCode` | 통신매체코드 | String | Y | 2 | - |
| Response Body | `-FnoIsuNo` | 선물옵션종목번호 | String | Y | 12 | - |
| Response Body | `-FnoTrdPtnCode` | 선물옵션거래유형코드 | String | Y | 2 | - |
| Response Body | `-GrpId` | 그룹ID | String | Y | 20 | - |
| Response Body | `-UserId` | 사용자ID | String | Y | 16 | - |
| Response Body | `-SrtOrdNo2` | 시작주문번호2 | Number | Y | 10 | - |
| Response Body | `CCENQ30100OutBlock2` | CCENQ30100OutBlock2 | Number | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-AcntNm` | 계좌명 | String | Y | 40 | - |
| Response Body | `-FutsOrdQty` | 선물주문수량 | Number | Y | 16 | - |
| Response Body | `-FutsExecQty` | 선물체결수량 | Number | Y | 16 | - |
| Response Body | `-OptOrdQty` | 옵션주문수량 | Number | Y | 16 | - |
| Response Body | `-OptExecQty` | 옵션체결수량 | Number | Y | 16 | - |
| Response Body | `CCENQ30100OutBlock3` | CCENQ30100OutBlock3 | Number | Y | - | - |
| Response Body | `-OrdDt` | 주문일 | String | Y | 8 | - |
| Response Body | `-OrdNo` | 주문번호 | Number | Y | 10 | - |
| Response Body | `-OrgOrdNo` | 원주문번호 | Number | Y | 10 | - |
| Response Body | `-OrdTime` | 주문시각 | String | Y | 9 | - |
| Response Body | `-FnoIsuNo` | 선물옵션종목번호 | String | Y | 12 | - |
| Response Body | `-IsuNm` | 종목명 | String | Y | 40 | - |
| Response Body | `-BnsTpNm` | 매매구분 | String | Y | 10 | - |
| Response Body | `-MrcTpNm` | 정정취소구분명 | String | Y | 10 | - |
| Response Body | `-FnoOrdprcPtnCode` | 선물옵션호가유형코드 | String | Y | 2 | - |
| Response Body | `-FnoOrdprcPtnNm` | 선물옵션호가유형명 | String | Y | 40 | - |
| Response Body | `-FnoOrdPrc` | 선물옵션주문가격 | Number | Y | 27 | - |
| Response Body | `-OrdQty` | 주문수량 | Number | Y | 16 | - |
| Response Body | `-OrdTpNm` | 주문구분명 | String | Y | 10 | - |
| Response Body | `-ExecTpNm` | 체결구분명 | String | Y | 10 | - |
| Response Body | `-FnoExecPrc` | 선물옵션체결가 | Number | Y | 27 | - |
| Response Body | `-ExecQty` | 체결수량 | Number | Y | 16 | - |
| Response Body | `-CtrctTime` | 약정시각 | String | Y | 9 | - |
| Response Body | `-CtrctNo` | 약정번호 | Number | Y | 10 | - |
| Response Body | `-ExecNo` | 체결번호 | Number | Y | 10 | - |
| Response Body | `-BnsplAmt` | 매매손익금액 | Number | Y | 16 | - |
| Response Body | `-UnercQty` | 미체결수량 | Number | Y | 16 | - |
| Response Body | `-UserId` | 사용자ID | String | Y | 16 | - |
| Response Body | `-MktClssCodeNm` | 시장분류코드명 | String | Y | 40 | - |
| Response Body | `-CommdaCode` | 통신매체코드 | String | Y | 2 | - |
| Response Body | `-CommdaCodeNm` | 통신매체코드명 | String | Y | 40 | - |
| Response Body | `-IpAddr` | IP주소 | String | Y | 16 | - |
| Response Body | `-TrdPtnTpNm` | 거래유형구분 | String | Y | 20 | - |
| Response Body | `-GrpId` | 그룹ID | String | Y | 20 | - |

## 예제

### Request

```json
{
  "CCENQ30100InBlock1": {
    "RecCnt": 1,
    "QrySrtDt": "00000000",
    "QryEndDt": "00000000",
    "FnoClssCode": "00",
    "PrdgrpCode": "00",
    "PrdtExecTpCode": "0",
    "StnlnSeqTp": "4",
    "MktTpCode": "0",
    "CommdaCode": "99",
    "FnoIsuNo": "",
    "FnoTrdPtnCode": "00",
    "SrtOrdNo2": 0
  }
}
```

### Response

```json
{
  "CCENQ30100OutBlock1": {
    "RecCnt": 1,
    "AcntNo": "***********",
    "InptPwd": "********",
    "QrySrtDt": "20200101",
    "QryEndDt": "20250610",
    "FnoClssCode": "00",
    "PrdgrpCode": "00",
    "PrdtExecTpCode": "0",
    "StnlnSeqTp": "4",
    "MktTpCode": "0",
    "CommdaCode": "99",
    "FnoIsuNo": "",
    "FnoTrdPtnCode": "00",
    "GrpId": "",
    "UserId": "",
    "SrtOrdNo2": 0
  },
  "CCENQ30100OutBlock2": {
    "RecCnt": 1,
    "AcntNm": "***",
    "FutsOrdQty": 22,
    "FutsExecQty": 22,
    "OptOrdQty": 24,
    "OptExecQty": 24
  },
  "CCENQ30100OutBlock3": [
    {
      "OrdDt": "20250513",
      "OrdNo": 47,
      "OrgOrdNo": 0,
      "OrdTime": "160724349",
      "FnoIsuNo": "201W6215",
      "IsuNm": "C 202506 215.0",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "126.80000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "126.80000000",
      "ExecQty": 1,
      "CtrctTime": "160724373",
      "CtrctNo": 2,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250515",
      "OrdNo": 122,
      "OrgOrdNo": 0,
      "OrdTime": "172453113",
      "FnoIsuNo": "201W6370",
      "IsuNm": "C 202506 370.0",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "0.96000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "0.96000000",
      "ExecQty": 1,
      "CtrctTime": "172453179",
      "CtrctNo": 141,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250515",
      "OrdNo": 123,
      "OrgOrdNo": 0,
      "OrdTime": "172547744",
      "FnoIsuNo": "201W6370",
      "IsuNm": "C 202506 370.0",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "1.01000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "0.96000000",
      "ExecQty": 1,
      "CtrctTime": "172547806",
      "CtrctNo": 142,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250515",
      "OrdNo": 124,
      "OrgOrdNo": 0,
      "OrdTime": "172626017",
      "FnoIsuNo": "201W6370",
      "IsuNm": "C 202506 370.0",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "1.01000000",
      "OrdQty": 13,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "0.96000000",
      "ExecQty": 5,
      "CtrctTime": "172626105",
      "CtrctNo": 144,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "",
      "OrdNo": 0,
      "OrgOrdNo": 0,
      "OrdTime": "",
      "FnoIsuNo": "",
      "IsuNm": "",
      "BnsTpNm": "",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "",
      "FnoOrdPrc": "0.00000000",
      "OrdQty": 0,
      "OrdTpNm": "",
      "ExecTpNm": "매수",
      "FnoExecPrc": "0.97000000",
      "ExecQty": 7,
      "CtrctTime": "172626196",
      "CtrctNo": 145,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "",
      "CommdaCodeNm": "",
      "IpAddr": "",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "",
      "OrdNo": 0,
      "OrgOrdNo": 0,
      "OrdTime": "",
      "FnoIsuNo": "",
      "IsuNm": "",
      "BnsTpNm": "",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "",
      "FnoOrdPrc": "0.00000000",
      "OrdQty": 0,
      "OrdTpNm": "",
      "ExecTpNm": "매수",
      "FnoExecPrc": "1.01000000",
      "ExecQty": 1,
      "CtrctTime": "172626236",
      "CtrctNo": 146,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "",
      "CommdaCodeNm": "",
      "IpAddr": "",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250515",
      "OrdNo": 125,
      "OrgOrdNo": 0,
      "OrdTime": "172803810",
      "FnoIsuNo": "201W6370",
      "IsuNm": "C 202506 370.0",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "1.59000000",
      "OrdQty": 4,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "1.09000000",
      "ExecQty": 1,
      "CtrctTime": "172803860",
      "CtrctNo": 147,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "",
      "OrdNo": 0,
      "OrgOrdNo": 0,
      "OrdTime": "",
      "FnoIsuNo": "",
      "IsuNm": "",
      "BnsTpNm": "",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "",
      "FnoOrdPrc": "0.00000000",
      "OrdQty": 0,
      "OrdTpNm": "",
      "ExecTpNm": "매수",
      "FnoExecPrc": "1.25000000",
      "ExecQty": 2,
      "CtrctTime": "172803970",
      "CtrctNo": 149,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "",
      "CommdaCodeNm": "",
      "IpAddr": "",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "",
      "OrdNo": 0,
      "OrgOrdNo": 0,
      "OrdTime": "",
      "FnoIsuNo": "",
      "IsuNm": "",
      "BnsTpNm": "",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "",
      "FnoOrdPrc": "0.00000000",
      "OrdQty": 0,
      "OrdTpNm": "",
      "ExecTpNm": "매수",
      "FnoExecPrc": "1.30000000",
      "ExecQty": 1,
      "CtrctTime": "172804035",
      "CtrctNo": 150,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "",
      "CommdaCodeNm": "",
      "IpAddr": "",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250515",
      "OrdNo": 126,
      "OrgOrdNo": 0,
      "OrdTime": "172935147",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "372.45000000",
      "OrdQty": 3,
      "OrdTpNm": "거부-0306",
      "ExecTpNm": "",
      "FnoExecPrc": "0.00000000",
      "ExecQty": 0,
      "CtrctTime": "",
      "CtrctNo": 0,
      "ExecNo": 0,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250515",
      "OrdNo": 127,
      "OrgOrdNo": 0,
      "OrdTime": "172952180",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "372.40000000",
      "OrdQty": 1,
      "OrdTpNm": "거부-0306",
      "ExecTpNm": "",
      "FnoExecPrc": "0.00000000",
      "ExecQty": 0,
      "CtrctTime": "",
      "CtrctNo": 0,
      "ExecNo": 0,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250515",
      "OrdNo": 128,
      "OrgOrdNo": 0,
      "OrdTime": "173011832",
      "FnoIsuNo": "165W6000",
      "IsuNm": "KTB3 2506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "105.78000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "105.78000000",
      "ExecQty": 1,
      "CtrctTime": "173011877",
      "CtrctNo": 6176,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250515",
      "OrdNo": 129,
      "OrgOrdNo": 0,
      "OrdTime": "173037287",
      "FnoIsuNo": "165W6000",
      "IsuNm": "KTB3 2506",
      "BnsTpNm": "매도",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "03",
      "FnoOrdprcPtnNm": "시장가",
      "FnoOrdPrc": "0.00000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "전매",
      "FnoExecPrc": "105.74000000",
      "ExecQty": 1,
      "CtrctTime": "173037349",
      "CtrctNo": 6177,
      "ExecNo": 0,
      "BnsplAmt": -40000,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250515",
      "OrdNo": 144,
      "OrgOrdNo": 0,
      "OrdTime": "174259586",
      "FnoIsuNo": "201W6360",
      "IsuNm": "C 202506 360.0",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "2.73000000",
      "OrdQty": 3,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "2.73000000",
      "ExecQty": 3,
      "CtrctTime": "174259627",
      "CtrctNo": 178,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250520",
      "OrdNo": 187,
      "OrgOrdNo": 0,
      "OrdTime": "181149619",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "373.65000000",
      "OrdQty": 1,
      "OrdTpNm": "거부-0306",
      "ExecTpNm": "",
      "FnoExecPrc": "0.00000000",
      "ExecQty": 0,
      "CtrctTime": "",
      "CtrctNo": 0,
      "ExecNo": 0,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250520",
      "OrdNo": 188,
      "OrgOrdNo": 0,
      "OrdTime": "181219410",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "368.30000000",
      "OrdQty": 1,
      "OrdTpNm": "거부-0306",
      "ExecTpNm": "",
      "FnoExecPrc": "0.00000000",
      "ExecQty": 0,
      "CtrctTime": "",
      "CtrctNo": 0,
      "ExecNo": 0,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250520",
      "OrdNo": 189,
      "OrgOrdNo": 0,
      "OrdTime": "181229875",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가-전환",
      "FnoOrdPrc": "364.50000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "364.50000000",
      "ExecQty": 1,
      "CtrctTime": "181231060",
      "CtrctNo": 274,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 13,
      "OrgOrdNo": 0,
      "OrdTime": "185838455",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "423.85000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "423.85000000",
      "ExecQty": 1,
      "CtrctTime": "185838478",
      "CtrctNo": 171,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 15,
      "OrgOrdNo": 0,
      "OrdTime": "185923545",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "423.85000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "423.85000000",
      "ExecQty": 1,
      "CtrctTime": "185923567",
      "CtrctNo": 174,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 16,
      "OrgOrdNo": 0,
      "OrdTime": "190041900",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "420.00000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "420.00000000",
      "ExecQty": 1,
      "CtrctTime": "190118948",
      "CtrctNo": 198,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 17,
      "OrgOrdNo": 0,
      "OrdTime": "190112042",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "420.00000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "420.00000000",
      "ExecQty": 1,
      "CtrctTime": "190118967",
      "CtrctNo": 199,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "40",
      "CommdaCodeNm": "OPEN API",
      "IpAddr": "183111090075",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 18,
      "OrgOrdNo": 0,
      "OrdTime": "190142985",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "417.00000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "",
      "FnoExecPrc": "0.00000000",
      "ExecQty": 0,
      "CtrctTime": "",
      "CtrctNo": 0,
      "ExecNo": 0,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "40",
      "CommdaCodeNm": "OPEN API",
      "IpAddr": "183111090075",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 19,
      "OrgOrdNo": 18,
      "OrdTime": "190223839",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "정정",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "418.00000000",
      "OrdQty": 1,
      "OrdTpNm": "확인",
      "ExecTpNm": "",
      "FnoExecPrc": "0.00000000",
      "ExecQty": 0,
      "CtrctTime": "",
      "CtrctNo": 0,
      "ExecNo": 0,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "40",
      "CommdaCodeNm": "OPEN API",
      "IpAddr": "183111090075",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 24,
      "OrgOrdNo": 19,
      "OrdTime": "190539234",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "취소",
      "FnoOrdprcPtnCode": "",
      "FnoOrdprcPtnNm": "",
      "FnoOrdPrc": "0.00000000",
      "OrdQty": 1,
      "OrdTpNm": "확인",
      "ExecTpNm": "",
      "FnoExecPrc": "0.00000000",
      "ExecQty": 0,
      "CtrctTime": "",
      "CtrctNo": 0,
      "ExecNo": 0,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "40",
      "CommdaCodeNm": "OPEN API",
      "IpAddr": "183111090075",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 62,
      "OrgOrdNo": 0,
      "OrdTime": "194746161",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "420.75000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "420.75000000",
      "ExecQty": 1,
      "CtrctTime": "195541953",
      "CtrctNo": 2904,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 67,
      "OrgOrdNo": 0,
      "OrdTime": "194759635",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "420.85000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "420.85000000",
      "ExecQty": 1,
      "CtrctTime": "195541087",
      "CtrctNo": 2901,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 70,
      "OrgOrdNo": 0,
      "OrdTime": "194808222",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매도",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "452.25000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "전매",
      "FnoExecPrc": "452.25000000",
      "ExecQty": 1,
      "CtrctTime": "205318721",
      "CtrctNo": 4827,
      "ExecNo": 0,
      "BnsplAmt": 21937500,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250526",
      "OrdNo": 81,
      "OrgOrdNo": 0,
      "OrdTime": "195029129",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "435.00000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "435.00000000",
      "ExecQty": 1,
      "CtrctTime": "195043502",
      "CtrctNo": 2148,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250528",
      "OrdNo": 50,
      "OrgOrdNo": 0,
      "OrdTime": "181713372",
      "FnoIsuNo": "201W6352",
      "IsuNm": "C 202506 352.5",
      "BnsTpNm": "매도",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "35.00000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "",
      "FnoExecPrc": "0.00000000",
      "ExecQty": 0,
      "CtrctTime": "",
      "CtrctNo": 0,
      "ExecNo": 0,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250528",
      "OrdNo": 170,
      "OrgOrdNo": 0,
      "OrdTime": "185329832",
      "FnoIsuNo": "201W6192",
      "IsuNm": "C 202506 192.5",
      "BnsTpNm": "매도",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "0.50000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매도",
      "FnoExecPrc": "0.50000000",
      "ExecQty": 1,
      "CtrctTime": "185744028",
      "CtrctNo": 1,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250528",
      "OrdNo": 192,
      "OrgOrdNo": 50,
      "OrdTime": "190313031",
      "FnoIsuNo": "201W6352",
      "IsuNm": "C 202506 352.5",
      "BnsTpNm": "매도",
      "MrcTpNm": "취소",
      "FnoOrdprcPtnCode": "",
      "FnoOrdprcPtnNm": "",
      "FnoOrdPrc": "0.00000000",
      "OrdQty": 1,
      "OrdTpNm": "확인",
      "ExecTpNm": "",
      "FnoExecPrc": "0.00000000",
      "ExecQty": 0,
      "CtrctTime": "",
      "CtrctNo": 0,
      "ExecNo": 0,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250528",
      "OrdNo": 220,
      "OrgOrdNo": 0,
      "OrdTime": "191032104",
      "FnoIsuNo": "101W6000",
      "IsuNm": "F 202506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "494.55000000",
      "OrdQty": 10,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "494.55000000",
      "ExecQty": 10,
      "CtrctTime": "191032141",
      "CtrctNo": 572,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
    },
    {
      "OrdDt": "20250528",
      "OrdNo": 228,
      "OrgOrdNo": 0,
      "OrdTime": "191502252",
      "FnoIsuNo": "165W6000",
      "IsuNm": "KTB3 2506",
      "BnsTpNm": "매수",
      "MrcTpNm": "",
      "FnoOrdprcPtnCode": "00",
      "FnoOrdprcPtnNm": "지정가",
      "FnoOrdPrc": "105.94000000",
      "OrdQty": 1,
      "OrdTpNm": "접수",
      "ExecTpNm": "매수",
      "FnoExecPrc": "105.94000000",
      "ExecQty": 1,
      "CtrctTime": "191502275",
      "CtrctNo": 148,
      "ExecNo": 1,
      "BnsplAmt": 0,
      "UnercQty": 0,
      "UserId": "*****",
      "MktClssCodeNm": "NDV 파생야간",
      "CommdaCode": "85",
      "CommdaCodeNm": "투혼(HTS)",
      "IpAddr": "123456789000",
      "TrdPtnTpNm": "기타",
      "GrpId": ""
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
