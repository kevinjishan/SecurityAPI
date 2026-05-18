---
broker: "키움증권"
source_url: "https://openapi.kiwoom.com/guide/apiguide?dummyVal=0"
scraped_at: "2026-05-18T05:16:18.548Z"
category: "ELW"
api_id: "ka30003"
api_name: "ELWLP보유일별추이요청"
method: "POST"
domain: "https://api.kiwoom.com"
path: "/api/dostk/elw"
content_type: "application/json;charset=UTF-8"
rate_limit: "-"
auth_required: true
---

# ELWLP보유일별추이요청 (ka30003)

<!-- request_field_count: 6 -->
<!-- response_field_count: 14 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 메뉴 위치 | 국내주식 > ELW > ELWLP보유일별추이요청 |
| API ID | `ka30003` |
| 전송 방식 | REST |
| 설명 | ELW 정보를 확인할 수 있습니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | POST |
| 운영 도메인 | `https://api.kiwoom.com` |
| 개발 도메인 | `https://apidev.kiwoom.com` |
| 모의투자 도메인 | `https://mockapi.kiwoom.com` |
| URL | `/api/dostk/elw` |
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
| Body | `base_dt` | 기준일자 | String | Y | 8 | 20241122 | YYYYMMDD |
| Body | `bsis_aset_cd` | 기초자산코드 | String | Y | 12 | 57KJ99 | - |

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
| Body | `- chg_qty` | 변동수량 | String | N | 20 | - | - |
| Body | `- cur_prc` | 현재가 | String | N | 20 | - | - |
| Body | `- dt` | 일자 | String | N | 20 | - | - |
| Body | `- flu_rt` | 등락율 | String | N | 20 | - | - |
| Body | `- lprmnd_qty` | LP보유수량 | String | N | 20 | - | - |
| Body | `- pre_tp` | 대비구분 | String | N | 20 | - | - |
| Body | `- pred_pre` | 전일대비 | String | N | 20 | - | - |
| Body | `- trde_prica` | 거래대금 | String | N | 20 | - | - |
| Body | `- trde_qty` | 거래량 | String | N | 20 | - | - |
| Body | `- wght` | 비중 | String | N | 20 | - | - |
| Body | `elwlpposs_daly_trnsn` | ELWLP보유일별추이 | LIST | N | - | - | - |

## 예제

### Request

```json
{
  "bsis_aset_cd": "57KJ99",
  "base_dt": "20241122"
}
```

### Response

```json
{
  "elwlpposs_daly_trnsn": [
    {
      "dt": "20241122",
      "cur_prc": "-125700",
      "pre_tp": "5",
      "pred_pre": "-900",
      "flu_rt": "-0.71",
      "trde_qty": "54",
      "trde_prica": "7",
      "chg_qty": "0",
      "lprmnd_qty": "0",
      "wght": "0.00"
    }
  ],
  "return_code": 0,
  "return_msg": "정상적으로 처리되었습니다"
}
```

## 연속조회/실시간/주의사항

- 연속조회는 응답 헤더 `cont-yn`, `next-key`가 문서에 있는 경우 해당 값을 다음 요청 헤더에 반영합니다.
- 실시간 API는 공식 문서의 API 설명과 요청/응답 필드 구조를 우선합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- [키움증권 오류코드](../errors.md)
