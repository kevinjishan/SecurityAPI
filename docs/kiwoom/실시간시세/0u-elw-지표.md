---
broker: "키움증권"
source_url: "https://openapi.kiwoom.com/guide/apiguide?dummyVal=0"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "실시간시세"
api_id: "0u"
api_name: "ELW 지표"
method: "POST"
domain: "wss://api.kiwoom.com:10000"
path: "/api/dostk/websocket"
content_type: "application/json;charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# ELW 지표 (0u)

<!-- request_field_count: 10 -->
<!-- response_field_count: 17 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 메뉴 위치 | 국내주식 > 실시간시세 > ELW 지표 |
| API ID | `0u` |
| 전송 방식 | WEBSOCKET |
| 설명 | 시세정보를 실시간으로 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | POST |
| 운영 도메인 | `wss://api.kiwoom.com:10000` |
| 개발 도메인 | `wss://apidev.kiwoom.com:10000` |
| 모의투자 도메인 | `wss://mockapi.kiwoom.com:10000` |
| URL | `/api/dostk/websocket` |
| Format | JSON |
| Content-Type | application/json;charset=UTF-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 샘플 | 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 헤더 | `authorization` | 접근토큰 | String | Y | 1000 | - | 토큰 지정시 토큰타입("Bearer") 붙혀서 호출 <br> 예) Bearer Egicyx... |
| 헤더 | `cont-yn` | 연속조회여부 | String | N | 1 | - | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 cont-yn값 세팅 |
| 헤더 | `next-key` | 연속조회키 | String | N | 50 | - | 응답 Header의 연속조회여부값이 Y일 경우 다음데이터 요청시 응답 Header의 next-key값 세팅 |
| 헤더 | `api-id` | TR명 | String | Y | 10 | - | - |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 샘플 | 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Body | `- item` | 실시간 등록 요소 | String | N | 100 | 57JBHH | 거래소별 종목코드, 업종코드<br>(KRX:039490,NXT:039490_NX,SOR:039490_AL) |
| Body | `- type` | 실시간 항목 | String | Y | 2 | 0u | TR 명(0A,0B....) |
| Body | `data` | 실시간 등록 리스트 | LIST | - | - | - | - |
| Body | `grp_no` | 그룹번호 | String | Y | 4 | 1 | - |
| Body | `refresh` | 기존등록유지여부 | String | Y | 1 | 1 | 등록(REG)시0:기존유지안함 1:기존유지(Default) 0일경우 기존등록한 item/type은 해지, 1일경우 기존등록한 item/type 유지해지(REMOVE)시 값 불필요 |
| Body | `trnm` | 서비스명 | String | Y | 10 | REG | REG : 등록 , REMOVE : 해지 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 샘플 | 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 헤더 | `cont-yn` | 연속조회여부 | String | N | 1 | - | 다음 데이터가 있을시 Y값 전달 |
| 헤더 | `next-key` | 연속조회키 | String | N | 50 | - | 다음 데이터가 있을시 다음 키값 전달 |
| 헤더 | `api-id` | TR명 | String | Y | 10 | - | - |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 샘플 | 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Body | `- - 1211` | ELW프리미엄 | String | N | - | - | - |
| Body | `- - 20` | 체결시간 | String | N | - | - | - |
| Body | `- - 666` | ELW패리티 | String | N | - | - | - |
| Body | `- - 667` | ELW기어링비율 | String | N | - | - | - |
| Body | `- - 668` | ELW손익분기율 | String | N | - | - | - |
| Body | `- - 669` | ELW자본지지점 | String | N | - | - | - |
| Body | `- item` | 실시간 등록 요소 | String | N | - | - | 종목코드 |
| Body | `- name` | 실시간 항목명 | String | N | - | - | - |
| Body | `- type` | 실시간항목 | String | N | - | - | TR 명(0A,0B....) |
| Body | `- values` | 실시간 값 리스트 | LIST | N | - | - | - |
| Body | `data` | 실시간 등록리스트 | LIST | N | - | - | - |
| Body | `return_code` | 결과코드 | String | N | - | - | 통신결과에대한 코드<br>(등록,해지요청시에만 값 전송 0:정상,1:오류 , 데이터 실시간 수신시 미전송) |
| Body | `return_msg` | 결과메시지 | String | N | - | - | 통신결과에대한메시지 |
| Body | `trnm` | 서비스명 | String | N | - | - | 등록,해지요청시 요청값 반환 , 실시간수신시 REAL 반환 |

## 예제

### Request

```json
{
  "trnm": "REG",
  "grp_no": "1",
  "refresh": "1",
  "data": "",
  "- item": "57JBHH",
  "- type": "0u"
}
```

### Response

```text
#요청
{
    'trnm': 'REG',
    'return_code': 0,
    'return_msg': ''
}

#실시간 수신
{
    'data': [
        {
            'values': {
                '20': '111847',
                '666': '69.13',
                '1211': '0',
                '667': '1037.04',
                '668': '+44.73',
                '669': '+44.78'
            },
            'type': '0u',
            'name': 'ELW 지표',
            'item': '57JBHH'
        }
    ],
    'trnm': 'REAL'
}
```

## 연속조회/실시간/주의사항

- 연속조회는 응답 헤더 `cont-yn`, `next-key`가 문서에 있는 경우 해당 값을 다음 요청 헤더에 반영합니다.
- 실시간 API는 공식 문서의 API 설명과 요청/응답 필드 구조를 우선합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- [키움증권 오류코드](../errors.md)
