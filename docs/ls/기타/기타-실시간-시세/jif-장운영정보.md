---
broker: "LS증권"
source_url: "https://openapi.ls-sec.co.kr/apiservice?group_id=6ad419a5-f0ce-47c2-a52a-91685fa86a31&api_id=eddd61f7-d595-4370-b9c3-49c4c6178096"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "기타"
api_id: "eddd61f7-d595-4370-b9c3-49c4c6178096"
api_name: "[기타] 실시간 시세"
tr_id: "148z73fs-4n7x-0ot8-46t8-63jg7w181y21"
tr_code: "JIF"
method: "POST"
domain: "wss://openapi.ls-sec.co.kr:9443"
path: "/websocket/etc"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# 장운영정보 (JIF)

<!-- request_field_count: 4 -->
<!-- response_field_count: 3 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 기타 |
| API 페이지 | [기타] 실시간 시세 |
| TR명 | 장운영정보 |
| TR코드 | `JIF` |
| 초당 전송 건수 | - |
| 설명 | 장운영정보  등 기타 정보를 실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | WEBSOCKET |
| Method | POST |
| 운영 도메인 | `wss://openapi.ls-sec.co.kr:9443` |
| 모의투자 도메인 | `wss://openapi.ls-sec.co.kr:29443` |
| URL | `/websocket/etc` |
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
| Response Body | `jangubun` | 장구분 | String | Y | 1 | 1:코스피<br>2:코스닥<br>5:선물/옵션<br>6:NXT전용<br>8:KRX야간파생<br>9:미국주식<br>A:중국주식오전<br>B:중국주식오후<br>C:홍콩주식오전<br>D:홍콩주식오후<br>E:일본주식오전<br>F:일본주식오후 |
| Response Body | `jstatus` | 장상태 | String | Y | 2 | 공통사용<br>11:장전동시호가개시<br>21:장시작<br>22:장개시10초전<br>23:장개시1분전<br>24:장개시5분전<br>25:장개시10분전<br>31:장후동시호가개시<br>41:장마감<br>42:장마감10초전<br>43:장마감1분전<br>44:장마감5분전<br>51:시간외종가매매개시<br>52:시간외종가매매종료,시간외단일가매매개시<br>53:사용안함<br>54:시간외단일가매매종료<br>55:프리마켓 개시<br>A2:프리마켓 장개시,10초전<br>A3:프리마켓 장개시,1분전<br>A4:프리마켓 장개시,5분전<br>A5:프리마켓 장개시,10분전<br>56:에프터마켓 개시<br>B2:에프터마켓 장개시,10초전<br>B3:에프터마켓 장개시,1분전<br>B4:에프터마켓 장개시,5분전<br>B5:에프터마켓 장개시,10분전<br>57:프리마켓 마감<br>C2:프리마켓 장마감,10초전<br>C3:프리마켓 장마감,1분전<br>C4:프리마켓 장마감,5분전<br>58:에프터마켓 마감<br>D2:에프터마켓 장마감,10초전<br>D3:에프터마켓 장마감,1분전<br>D4:에프터마켓 장마감,5분전<br>KOSPI / KOSDAQ (jangubun 1,2 인 경우)<br>61:서킷브레이크1단계발동<br>62:서킷브레이크1단계해제,호가접수개시<br>63:서킷브레이크1단계,동시호가종료<br>64:사이드카 매도발동<br>65:사이드카 매도해제<br>66:사이드카 매수발동<br>67:사이드카 매수해제<br>68:서킷브레이크2단계발동<br>69:서킷브레이크3단계발동,당일 장종료<br>70:서킷브레이크2단계해제,호가접수개시<br>71:서킷브레이크2단계,동시호가종료<br>선물/옵션 (jangubun 5인 경우)<br>61:코스피관련파생상품,당일 장종료<br>62:서킷브레이크 해제,호가접수개시<br>63:서킷브레이크, 장중동시마감<br>70:2단계상한가,5분 후 확대 예정<br>71:2단계하한가,5분 후 확대 예정<br>72:3단계상한가,5분 후 확대 예정<br>73:3단계하한가,5분 후 확대 예정<br>74:2단계상한가,확대 적용<br>75:2단계하한가,확대 적용<br>76:3단계상한가,확대 적용<br>77:3단계하한가,확대 적용 |

## 예제

### Request

```json
{
  "header": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6IjY2NDVmOGU0LTRkYzEtNDk4ZS05MjEzLTJlYTU5YjNmYjk2MyIsIm5iZiI6MTY4NjY5NjA3MCwiZ3JhbnRfdHlwZSI6IkNsaWVudCIsImlzcyI6InVub2d3IiwiZXhwIjoxNjg2NzgyNDcwLCJpYXQiOjE2ODY2OTYwNzAsImp0aSI6IlBTRU1CcWF5Q1N6QmxnTjZ3SlRkUTV5dkRNdjllWjlNZWJ2UCJ9.0roE4en_J2M3PDFr8xrZK4l0pw4uz5-kIc7I_w-E2gXlfMvIdIYqTn3LH_kr-V_iOhiOU-dLRrRbbavzNHJX3Q",
    "tr_type": "3"
  },
  "body": {
    "tr_cd": "JIF",
    "tr_key": "0"
  }
}
```

### Response

```json
{
  "header": {
    "tr_cd": "JIF",
    "tr_key": "0"
  },
  "body": {
    "jangubun": "C",
    "jstatus": "21"
  }
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
