---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=a804e311-cb53-499b-9d8a-a4d838f0a484&api_id=136794ff-8ba0-48d5-96d0-eb8fc68060fb"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "해외주식시세"
api_id: "136794ff-8ba0-48d5-96d0-eb8fc68060fb"
api_name: "해외주식 주차트조회"
tr_id: "054e9d41-e06e-4fd0-ae91-f50b5a8b1999"
tr_code: "FSTKCHARTWEEK"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/overseas-stock/chart/week"
content_type: "application/json;charset=utf-8"
rate_limit: "4"
auth_required: true
---

# 해외주식 주차트조회 (FSTKCHARTWEEK)

<!-- request_field_count: 12 -->
<!-- response_field_count: 11 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 해외주식시세 |
| API 페이지 | 해외주식 주차트조회 |
| TR명 | 해외주식 주차트조회 |
| TR코드 | `FSTKCHARTWEEK` |
| 초당 전송 건수 | 4 |
| 설명 | 해외주식 주차트 조회 API 입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/overseas-stock/chart/week` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB금융투자 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |
| Request Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부(Y:연속거래 사용 N:연속거래 사용안함) |
| Request Header | `cont_key` | 연속키 값 | String | N | 70 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | N | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `In` | In | Object | Y | - | - |
| Request Body | `-InputCondMrktDivCode` | 입력조건시장분류코드 | String | Y | 2 | FY:뉴욕<br>FN:나스닥<br>FA:아멕스 |
| Request Body | `-InputOrgAdjPrc` | 수정주가사용여부 | String | Y | 1 | 0:수정주가 미사용<br>1: 수정주가 사용 |
| Request Body | `-InputIscd1` | 입력종목코드1 | String | Y | 12 | 해외주식 종목코드 (ex. TQQQ) |
| Request Body | `-InputDate1` | 입력날짜1 | String | Y | 8 | YYYYMMDD |
| Request Body | `-InputDate2` | 입력날짜2 | String | Y | 8 | YYYYMMDD |
| Request Body | `-InputPeriodDivCode` | 입력일/주/월/년 | String | Y | 1 | W |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB금융투자 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Array | Y | - | - |
| Response Body | `-Hour` | 시간 | String | Y | 6 | - |
| Response Body | `-Date` | 일자 | String | Y | 8 | - |
| Response Body | `-Prpr` | 현재가 | String | Y | 16 | - |
| Response Body | `-Oprc` | 시가 | String | Y | 16 | - |
| Response Body | `-Hprc` | 고가 | String | Y | 16 | - |
| Response Body | `-Lprc` | 저가 | String | Y | 16 | - |
| Response Body | `-CntgVol` | 체결거래량 | String | Y | 16 | - |

## 예제

### Request

```json
{
  "In": {
    "InputCondMrktDivCode": "FN",
    "InputIscd1": "TSLA",
    "InputPeriodDivCode": "W",
    "InputDate1": "20230101",
    "InputDate2": "20240201",
    "InputOrgAdjPrc": "1"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "Hour": "",
      "Date": "20240129",
      "Prpr": "187.9100",
      "Oprc": "185.6300",
      "Hprc": "196.3593",
      "Lprc": "182.0000",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20240122",
      "Prpr": "183.2500",
      "Oprc": "212.2600",
      "Hprc": "217.8000",
      "Lprc": "180.0600",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20240116",
      "Prpr": "212.1900",
      "Oprc": "215.1000",
      "Hprc": "223.4900",
      "Lprc": "207.5600",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20240108",
      "Prpr": "218.8900",
      "Oprc": "236.1400",
      "Hprc": "241.2500",
      "Lprc": "217.1501",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20240102",
      "Prpr": "237.4900",
      "Oprc": "250.0800",
      "Hprc": "251.2500",
      "Lprc": "234.9001",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231226",
      "Prpr": "248.4800",
      "Oprc": "254.4900",
      "Hprc": "265.1300",
      "Lprc": "247.4300",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231218",
      "Prpr": "252.5400",
      "Oprc": "253.7800",
      "Hprc": "259.8400",
      "Lprc": "247.0000",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231211",
      "Prpr": "253.5000",
      "Oprc": "242.7400",
      "Hprc": "254.1300",
      "Lprc": "228.2000",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231204",
      "Prpr": "243.8400",
      "Oprc": "235.7500",
      "Hprc": "246.6600",
      "Lprc": "233.2902",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231127",
      "Prpr": "238.8300",
      "Oprc": "236.8900",
      "Hprc": "252.7500",
      "Lprc": "231.9000",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231120",
      "Prpr": "235.4500",
      "Oprc": "234.0400",
      "Hprc": "244.0100",
      "Lprc": "231.0200",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231113",
      "Prpr": "234.3000",
      "Oprc": "215.6000",
      "Hprc": "246.7000",
      "Lprc": "211.6101",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231106",
      "Prpr": "214.6500",
      "Oprc": "223.9800",
      "Hprc": "226.3200",
      "Lprc": "205.6900",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231030",
      "Prpr": "219.9600",
      "Oprc": "209.2800",
      "Hprc": "226.3701",
      "Lprc": "194.0700",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231023",
      "Prpr": "207.3000",
      "Oprc": "210.0000",
      "Hprc": "222.0500",
      "Lprc": "202.5100",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231016",
      "Prpr": "211.9900",
      "Oprc": "250.0500",
      "Hprc": "257.1830",
      "Lprc": "210.4200",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231009",
      "Prpr": "251.1200",
      "Oprc": "255.3100",
      "Hprc": "268.9400",
      "Lprc": "250.2200",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20231002",
      "Prpr": "260.5300",
      "Oprc": "244.8100",
      "Hprc": "263.6000",
      "Lprc": "242.6200",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230925",
      "Prpr": "250.2200",
      "Oprc": "243.3800",
      "Hprc": "254.7700",
      "Lprc": "234.5800",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230918",
      "Prpr": "244.8800",
      "Oprc": "271.1600",
      "Hprc": "273.9300",
      "Lprc": "244.4800",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230911",
      "Prpr": "274.3900",
      "Oprc": "264.2700",
      "Hprc": "278.9800",
      "Lprc": "260.6100",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230905",
      "Prpr": "248.5000",
      "Oprc": "245.0000",
      "Hprc": "258.0000",
      "Lprc": "243.2650",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230828",
      "Prpr": "245.0100",
      "Oprc": "242.5800",
      "Hprc": "261.1800",
      "Lprc": "235.3500",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230821",
      "Prpr": "238.5900",
      "Oprc": "221.5512",
      "Hprc": "240.8200",
      "Lprc": "220.5800",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230814",
      "Prpr": "215.4900",
      "Oprc": "235.7000",
      "Hprc": "240.6600",
      "Lprc": "212.3600",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230807",
      "Prpr": "242.6500",
      "Oprc": "251.4500",
      "Hprc": "253.6511",
      "Lprc": "238.0200",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230731",
      "Prpr": "253.8600",
      "Oprc": "267.4800",
      "Hprc": "269.0800",
      "Lprc": "250.4900",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230724",
      "Prpr": "266.4400",
      "Oprc": "255.8500",
      "Hprc": "272.9000",
      "Lprc": "254.1200",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230717",
      "Prpr": "260.0200",
      "Oprc": "286.6250",
      "Hprc": "299.2900",
      "Lprc": "255.8000",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230710",
      "Prpr": "281.3800",
      "Oprc": "276.4700",
      "Hprc": "285.3000",
      "Lprc": "265.1000",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230703",
      "Prpr": "274.4300",
      "Oprc": "276.4900",
      "Hprc": "284.2500",
      "Lprc": "272.8800",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230626",
      "Prpr": "261.7700",
      "Oprc": "250.0650",
      "Hprc": "264.4500",
      "Lprc": "240.7000",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230620",
      "Prpr": "256.6000",
      "Oprc": "261.5000",
      "Hprc": "276.9900",
      "Lprc": "248.2500",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230612",
      "Prpr": "260.5400",
      "Oprc": "247.9400",
      "Hprc": "263.6000",
      "Lprc": "244.5900",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230605",
      "Prpr": "244.4000",
      "Oprc": "217.8000",
      "Hprc": "252.4200",
      "Lprc": "212.5300",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230530",
      "Prpr": "213.9700",
      "Oprc": "200.1000",
      "Hprc": "217.2500",
      "Lprc": "195.1200",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230522",
      "Prpr": "193.1700",
      "Oprc": "180.7000",
      "Hprc": "198.6000",
      "Lprc": "178.2200",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230515",
      "Prpr": "180.1400",
      "Oprc": "167.6550",
      "Hprc": "181.9500",
      "Lprc": "164.3500",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230508",
      "Prpr": "167.9800",
      "Oprc": "173.7200",
      "Hprc": "177.3800",
      "Lprc": "166.5600",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230501",
      "Prpr": "170.0600",
      "Oprc": "163.1700",
      "Hprc": "170.7899",
      "Lprc": "158.8300",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230424",
      "Prpr": "164.3100",
      "Oprc": "164.6500",
      "Hprc": "165.6500",
      "Lprc": "152.3700",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230417",
      "Prpr": "165.0800",
      "Oprc": "186.3200",
      "Hprc": "189.6900",
      "Lprc": "160.5600",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230410",
      "Prpr": "185.0000",
      "Oprc": "179.9400",
      "Hprc": "191.5846",
      "Lprc": "176.1100",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230403",
      "Prpr": "185.0600",
      "Oprc": "199.9100",
      "Hprc": "202.6897",
      "Lprc": "179.7400",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230327",
      "Prpr": "207.4600",
      "Oprc": "194.4150",
      "Hprc": "207.7900",
      "Lprc": "185.4300",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230320",
      "Prpr": "190.4100",
      "Oprc": "178.0800",
      "Hprc": "200.6600",
      "Lprc": "176.3500",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230313",
      "Prpr": "180.1300",
      "Oprc": "167.4550",
      "Hprc": "186.2199",
      "Lprc": "163.9100",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230306",
      "Prpr": "173.4400",
      "Oprc": "198.5400",
      "Hprc": "198.6000",
      "Lprc": "168.4400",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230227",
      "Prpr": "197.7900",
      "Oprc": "202.0300",
      "Hprc": "211.2300",
      "Lprc": "186.0100",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230221",
      "Prpr": "196.8800",
      "Oprc": "204.9900",
      "Hprc": "209.7100",
      "Lprc": "191.7800",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230213",
      "Prpr": "208.3100",
      "Oprc": "194.4150",
      "Hprc": "217.6500",
      "Lprc": "187.6100",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230206",
      "Prpr": "196.8900",
      "Oprc": "193.0100",
      "Hprc": "214.0000",
      "Lprc": "189.5500",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230130",
      "Prpr": "189.9800",
      "Oprc": "178.0500",
      "Hprc": "199.0000",
      "Lprc": "162.7800",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230123",
      "Prpr": "177.9000",
      "Oprc": "135.8700",
      "Hprc": "180.6800",
      "Lprc": "134.2700",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230117",
      "Prpr": "133.4200",
      "Oprc": "125.6950",
      "Hprc": "136.6800",
      "Lprc": "124.3082",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230109",
      "Prpr": "122.4000",
      "Oprc": "118.9600",
      "Hprc": "125.9500",
      "Lprc": "114.9200",
      "CntgVol": ""
    },
    {
      "Hour": "",
      "Date": "20230103",
      "Prpr": "113.0600",
      "Oprc": "118.4700",
      "Hprc": "118.8000",
      "Lprc": "101.8100",
      "CntgVol": ""
    }
  ],
  "rsp_cd": "00000",
  "rsp_msg": "정상 처리 되었습니다."
}
```

## 연속조회/실시간/주의사항

- `transactionPerSec` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
