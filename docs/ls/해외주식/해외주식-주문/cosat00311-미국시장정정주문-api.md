---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=cdb7e1bc-f7c5-425c-8248-aa83dbb6919f&api_id=6bafc43c-6080-4541-bfc2-c2608b269ca0"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식"
api_id: "6bafc43c-6080-4541-bfc2-c2608b269ca0"
api_name: "[해외주식] 주문"
tr_id: "3844dd76-0872-47b4-8f12-9f85b62d9f57"
tr_code: "COSAT00311"
method: "POST"
domain: "https://openapi.ls-sec.co.kr:8080"
path: "/overseas-stock/order"
content_type: "application/json; charset=UTF-8"
rate_limit: "10"
auth_required: true
---

# 미국시장정정주문 API (COSAT00311)

<!-- request_field_count: 16 -->
<!-- response_field_count: 22 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식 |
| API 페이지 | [해외주식] 주문 |
| TR명 | 미국시장정정주문 API |
| TR코드 | `COSAT00311` |
| 초당 전송 건수 | 10 |
| 설명 | 해외주식 주문서비스를 확인할 수 있습니다 |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.ls-sec.co.kr:8080` |
| 모의투자 도메인 | `-` |
| URL | `/overseas-stock/order` |
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
| Request Body | `COSAT00311InBlock1` | COSAT00311InBlock1 | Object | Y | - | - |
| Request Body | `-RecCnt` | 레코드갯수 | Number | Y | 5 | 00001 |
| Request Body | `-OrdPtnCode` | 주문유형코드 | String | Y | 2 | 07@정정주문 |
| Request Body | `-OrgOrdNo` | 원주문번호 | Number | Y | 10 | - |
| Request Body | `-OrdMktCode` | 주문시장코드 | String | Y | 2 | 81@뉴욕거래소<br>82@NASDAQ |
| Request Body | `-IsuNo` | 종목번호 | String | Y | 12 | - |
| Request Body | `-OrdQty` | 주문수량 | Number | Y | 16 | 0 입력 |
| Request Body | `-OvrsOrdPrc` | 해외주문가 | Number | Y | 28.7 | - |
| Request Body | `-OrdprcPtnCode` | 호가유형코드 | String | Y | 2 | - |
| Request Body | `-BrkTpCode` | 중개인구분코드 | String | Y | 2 | - |

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
| Response Body | `-COSAT00311OutBlock1` | COSAT00311OutBlock1 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Object | Y | 5 | - |
| Response Body | `-OrdPtnCode` | 주문유형코드 | String | Y | 2 | - |
| Response Body | `-OrgOrdNo` | 원주문번호 | Object | Y | 10 | - |
| Response Body | `-AcntNo` | 계좌번호 | String | Y | 20 | - |
| Response Body | `-InptPwd` | 입력비밀번호 | String | Y | 8 | - |
| Response Body | `-OrdMktCode` | 주문시장코드 | String | Y | 2 | - |
| Response Body | `-IsuNo` | 종목번호 | String | Y | 12 | - |
| Response Body | `-OrdQty` | 주문수량 | Object | Y | 16 | - |
| Response Body | `-OvrsOrdPrc` | 해외주문가 | Object | Y | 28.7 | - |
| Response Body | `-OrdprcPtnCode` | 호가유형코드 | String | Y | 2 | - |
| Response Body | `-RegCommdaCode` | 등록통신매체코드 | String | Y | 2 | - |
| Response Body | `-BrkTpCode` | 중개인구분코드 | String | Y | 2 | - |
| Response Body | `-COSAT00311OutBlock2` | COSAT00311OutBlock2 | Object | Y | - | - |
| Response Body | `-RecCnt` | 레코드갯수 | Object | Y | 5 | - |
| Response Body | `-OrdNo` | 주문번호 | Object | Y | 10 | - |
| Response Body | `-AcntNm` | 계좌명 | String | Y | 40 | - |
| Response Body | `-IsuNm` | 종목명 | String | Y | 40 | - |

## 예제

### Request

```text
문서 미기재
```

### Response

```text
문서 미기재
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
