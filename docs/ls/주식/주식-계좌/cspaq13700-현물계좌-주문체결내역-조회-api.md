---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=73142d9f-1983-48d2-8543-89b75535d34c&api_id=37d22d4d-83cd-40a4-a375-81b010a4a627"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "주식"
api_id: "37d22d4d-83cd-40a4-a375-81b010a4a627"
api_name: "[주식] 계좌"
tr_id: "42ut6k7z-036p-h5h7-828n-z00ubjy3eqk2"
tr_code: "CSPAQ13700"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/stock/accno"
content_type: "application/json; charset=UTF-8"
rate_limit: "1"
auth_required: true
---

# 현물계좌 주문체결내역 조회(API) (CSPAQ13700)

<!-- request_field_count: 15 -->
<!-- response_field_count: 60 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 주식 |
| API 페이지 | [주식] 계좌 |
| TR명 | 현물계좌 주문체결내역 조회(API) |
| TR코드 | `CSPAQ13700` |
| 초당 전송 건수 | 1 |
| 설명 | 계좌별 거래내역 및 잔고 등 계좌에 관련된 서비스를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/stock/accno` |
| Request Format | JSON |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter |
| Request Header | `tr_cd` | 거래 CD | String | Y | 10 | LS증권 거래코드 |
| Request Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부<br>Y:연속○<br>N:연속× |
| Request Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | Y | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `CSPAQ13700InBlock1` | CSPAQ13700InBlock1 | Object | Y | - | - |
| Request Body | `-OrdMktCode` | 주문시장코드 | String | Y | 2 | 00.전체<br>10.거래소<br>20.코스닥<br>30.프리보드 |
| Request Body | `-BnsTpCode` | 매매구분 | String | Y | 1 | 0@전체<br>1@매도<br>2@매수 |
| Request Body | `-IsuNo` | 종목번호 | String | Y | 12 | 주식 : A+종목코드<br>ELW : J+종목코드 |
| Request Body | `-ExecYn` | 체결여부 | String | Y | 1 | 0.전체<br>1.체결<br>3.미체결 |
| Request Body | `-OrdDt` | 주문일 | String | Y | 8 | - |
| Request Body | `-SrtOrdNo2` | 시작주문번호2 | Number | Y | 10 | 역순구분이 순 : 000000000<br>역순구분이 역순 : 999999999 |
| Request Body | `-BkseqTpCode` | 역순구분 | String | Y | 1 | 0.역순<br>1.정순 |
| Request Body | `-OrdPtnCode` | 주문유형코드 | String | Y | 2 | 00.전체<br>98.매도전체<br>99.매수전체<br>01.현금매도<br>02.현금매수<br>05.저축매도<br>06.저축매수<br>09.상품매도<br>10.상품매수<br>03.융자매도<br>04.융자매수<br>07.대주매도<br>08.대주매수<br>11.선물대용매도<br>13.현금매도(프)<br>14.현금매수(프)<br>17.대출<br>18.대출상환 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | LS증권 제공 API 응답 Response Body 데이터 포맷으로 "application/json; charset=utf-8 설정" |
| Response Header | `tr_cd` | 거래 CD | String | Y | 10 | LS증권 거래코드 |
| Response Header | `tr_cont` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부<br>Y:연속○<br>N:연속× |
| Response Header | `tr_cont_key` | 연속 거래 Key | String | Y | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `CSPAQ13700OutBlock1` | CSPAQ13700OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-InptPwd` | 입력비밀번호 | String | Y | 8 | - |
| Response Body | `-OrdMktCode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `-BnsTpCode` | 매매구분 | String | Y | 1 | - |
| Response Body | `-IsuNo` | 종목번호 | String | Y | 12 | - |
| Response Body | `-ExecYn` | 체결여부 | String | Y | 1 | - |
| Response Body | `-OrdDt` | 주문일 | String | Y | 8 | - |
| Response Body | `-SrtOrdNo2` | 시작주문번호2 | Number | Y | 10 | - |
| Response Body | `-BkseqTpCode` | 역순구분 | String | Y | 1 | - |
| Response Body | `-OrdPtnCode` | 주문유형코드 | String | Y | 2 | - |
| Response Body | `CSPAQ13700OutBlock2` | CSPAQ13700OutBlock2 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | - |
| Response Body | `-SellExecAmt` | 매도체결금액 | Number | Y | 16 | - |
| Response Body | `-BuyExecAmt` | 매수체결금액 | Number | Y | 16 | - |
| Response Body | `-SellExecQty` | 매도체결수량 | Number | Y | 16 | - |
| Response Body | `-BuyExecQty` | 매수체결수량 | Number | Y | 16 | - |
| Response Body | `-SellOrdQty` | 매도주문수량 | Number | Y | 16 | - |
| Response Body | `-BuyOrdQty` | 매수주문수량 | Number | Y | 16 | - |
| Response Body | `CSPAQ13700OutBlock3` | CSPAQ13700OutBlock3 | Object | Y | - | - |
| Response Body | `-OrdDt` | 주문일 | String | Y | 8 | - |
| Response Body | `-MgmtBrnNo` | 관리지점번호 | String | Y | 3 | - |
| Response Body | `-OrdMktCode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `-OrdNo` | 주문번호 | Number | Y | 10 | - |
| Response Body | `-OrgOrdNo` | 원주문번호 | Number | Y | 10 | - |
| Response Body | `-IsuNo` | 종목번호 | String | Y | 12 | - |
| Response Body | `-IsuNm` | 종목명 | String | Y | 40 | - |
| Response Body | `-BnsTpCode` | 매매구분 | String | Y | 1 | - |
| Response Body | `-BnsTpNm` | 매매구분 | String | Y | 10 | - |
| Response Body | `-OrdPtnCode` | 주문유형코드 | String | Y | 2 | - |
| Response Body | `-OrdPtnNm` | 주문유형명 | String | Y | 40 | - |
| Response Body | `-OrdTrxPtnCode` | 주문처리유형코드 | Number | Y | 9 | - |
| Response Body | `-OrdTrxPtnNm` | 주문처리유형명 | String | Y | 50 | - |
| Response Body | `-MrcTpCode` | 정정취소구분 | String | Y | 1 | - |
| Response Body | `-MrcTpNm` | 정정취소구분명 | String | Y | 10 | - |
| Response Body | `-MrcQty` | 정정취소수량 | Number | Y | 16 | - |
| Response Body | `-MrcAbleQty` | 정정취소가능수량 | Number | Y | 16 | - |
| Response Body | `-OrdQty` | 주문수량 | Number | Y | 16 | - |
| Response Body | `-OrdPrc` | 주문가격 | Number | Y | 15.2 | - |
| Response Body | `-ExecQty` | 체결수량 | Number | Y | 16 | - |
| Response Body | `-ExecPrc` | 체결가 | Number | Y | 15.2 | - |
| Response Body | `-ExecTrxTime` | 체결처리시각 | String | Y | 9 | - |
| Response Body | `-LastExecTime` | 최종체결시각 | String | Y | 9 | - |
| Response Body | `-OrdprcPtnCode` | 호가유형코드 | String | Y | 2 | - |
| Response Body | `-OrdprcPtnNm` | 호가유형명 | String | Y | 40 | - |
| Response Body | `-OrdCndiTpCode` | 주문조건구분 | String | Y | 1 | - |
| Response Body | `-AllExecQty` | 전체체결수량 | Number | Y | 16 | - |
| Response Body | `-RegCommdaCode` | 통신매체코드 | String | Y | 2 | - |
| Response Body | `-CommdaNm` | 통신매체명 | String | Y | 40 | - |
| Response Body | `-MbrNo` | 회원번호 | String | Y | 3 | - |
| Response Body | `-RsvOrdYn` | 예약주문여부 | String | Y | 1 | - |
| Response Body | `-LoanDt` | 대출일 | String | Y | 8 | - |
| Response Body | `-OrdTime` | 주문시각 | String | Y | 9 | - |
| Response Body | `-OpDrtnNo` | 운용지시번호 | String | Y | 12 | - |
| Response Body | `-OdrrId` | 주문자ID | String | Y | 16 | - |

## 예제

### Request

```json
{
  "CSPAQ13700InBlock1": {
    "OrdMktCode": "00",
    "BnsTpCode": "0",
    "IsuNo": "A005930",
    "ExecYn": "0",
    "OrdDt": "20230613",
    "SrtOrdNo2": 0,
    "BkseqTpCode": "0",
    "OrdPtnCode": "00"
  }
}
```

### Response

```json
{
  "CSPAQ13700OutBlock2": {
    "RecCnt": 1,
    "SellOrdQty": 0,
    "BuyExecAmt": 180000,
    "BuyExecQty": 3,
    "SellExecAmt": 0,
    "SellExecQty": 0,
    "BuyOrdQty": 6
  },
  "rsp_cd": "00200",
  "CSPAQ13700OutBlock3": [],
  "CSPAQ13700OutBlock1": {
    "OrdMktCode": "00",
    "BkseqTpCode": "0",
    "RecCnt": 1,
    "BnsTpCode": "0",
    "IsuNo": "A005930",
    "AcntNo": "20011132702",
    "InptPwd": "********",
    "SrtOrdNo2": 0,
    "OrdPtnCode": "00",
    "ExecYn": "0",
    "OrdDt": "20230613"
  },
  "rsp_msg": "조회내역이 없습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
