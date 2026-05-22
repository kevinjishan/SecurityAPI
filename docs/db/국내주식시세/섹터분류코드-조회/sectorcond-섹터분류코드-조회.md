---
broker: "DB증권"
source_url: "https://openapi.db-fi.com/apiservice?group_id=80005fb0-6feb-4b8b-904a-605c59e29b4f&api_id=5e9ee146-7a0b-4759-a6ef-d778e4d7bedd"
scraped_at: "2026-05-22T15:19:33.392Z"
category: "국내주식시세"
api_id: "5e9ee146-7a0b-4759-a6ef-d778e4d7bedd"
api_name: "섹터분류코드 조회"
tr_id: "b536d23f-a212-41b2-bef4-df264028fce8"
tr_code: "SECTORCOND"
method: "POST"
domain: "https://openapi.dbsec.co.kr:8443"
path: "/api/v1/quote/kr-stock/inquiry/sector-cls"
content_type: "application/json;charset=utf-8"
rate_limit: "2"
auth_required: true
---

# 섹터분류코드 조회 (SECTORCOND)

<!-- request_field_count: 7 -->
<!-- response_field_count: 6 -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | 국내주식시세 |
| API 페이지 | 섹터분류코드 조회 |
| TR명 | 섹터분류코드 조회 |
| TR코드 | `SECTORCOND` |
| 초당 전송 건수 | 2 |
| 설명 | 국내주식 섹터 분류코드를 조회 할 수 있는 API입니다. |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | REST |
| Method | POST |
| 운영 도메인 | `https://openapi.dbsec.co.kr:8443` |
| 모의투자 도메인 | `-` |
| URL | `/api/v1/quote/kr-stock/inquiry/sector-cls` |
| Request Format | JSON |
| Content-Type | application/json;charset=utf-8 |

## 인증/헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권 제공 API를 호출하기 위한 Request Body 데이터 포맷으로 "application/json; charset=utf-8" 설정 |
| Request Header | `authorization` | 접근토큰 | String | Y | 1000 | OAuth 토큰이 필요한 API 경우 발급한 Access Token을 설정하기 위한 Request Heaeder Parameter/json; charset=utf-8" 설정 |
| Request Header | `cont_yn` | 연속 거래 여부 | String | Y | 1 | 연속거래 여부(Y:연속거래 사용 N:연속거래 사용안함) |
| Request Header | `cont_key` | 연속키 값 | String | N | 70 | 연속일 경우 그전에 내려온 연속키 값 올림 |
| Request Header | `mac_address` | MAC 주소 | String | N | 12 | 법인인 경우 필수 세팅 |

## 요청

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Request Body | `In` | In | Object | Y | - | - |
| Request Body | `-InputSectorGroupClsCode` | 입력섹터그룹구분코드 | String | Y | 2 | "S" 고정 |

## 응답

### 헤더

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Header | `content-type` | 컨텐츠타입 | String | Y | 100 | DB증권 제공 API를 호출한 후 Client로 응답하는 Response Header Parameter로 "application/json; charset=utf-8" 설정 |
| Response Header | `cont_yn` | 연속 거래 여부 | String | N | 1 | 연속거래 여부 |
| Response Header | `cont_key` | 연속키 값 | String | N | 18 | 연속일 경우 그전에 내려온 연속키 값 올림 |

### Body

| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
| Response Body | `Out` | Out | Array | Y | - | - |
| Response Body | `-SectorGroupCode` | 섹터그룹코드 | String | Y | 4 | - |
| Response Body | `-SectorGroupName` | 섹터그룹명 | String | Y | 50 | - |

## 예제

### Request

```json
{
  "In": {
    "InputSectorGroupClsCode": "S"
  }
}
```

### Response

```json
{
  "Out": [
    {
      "SectorGroupCode": "9008",
      "SectorGroupName": "화폐/금융자동화기기(디지털화폐 등)"
    },
    {
      "SectorGroupCode": "9009",
      "SectorGroupName": "OLED(유기 발광 다이오드)"
    },
    {
      "SectorGroupCode": "9012",
      "SectorGroupName": "반도체 장비"
    },
    {
      "SectorGroupCode": "9013",
      "SectorGroupName": "리모델링/인테리어"
    },
    {
      "SectorGroupCode": "9014",
      "SectorGroupName": "반도체 재료/부품"
    },
    {
      "SectorGroupCode": "9016",
      "SectorGroupName": "구제역/광우병 수혜"
    },
    {
      "SectorGroupCode": "9017",
      "SectorGroupName": "SI(시스템통합)"
    },
    {
      "SectorGroupCode": "9018",
      "SectorGroupName": "전자파"
    },
    {
      "SectorGroupCode": "9019",
      "SectorGroupName": "황사/미세먼지"
    },
    {
      "SectorGroupCode": "9027",
      "SectorGroupName": "자동차부품"
    },
    {
      "SectorGroupCode": "9028",
      "SectorGroupName": "CCTV＆DVR"
    },
    {
      "SectorGroupCode": "9030",
      "SectorGroupName": "조선"
    },
    {
      "SectorGroupCode": "9031",
      "SectorGroupName": "환율하락 수혜"
    },
    {
      "SectorGroupCode": "9032",
      "SectorGroupName": "패션/의류"
    },
    {
      "SectorGroupCode": "9033",
      "SectorGroupName": "LED"
    },
    {
      "SectorGroupCode": "9036",
      "SectorGroupName": "해운"
    },
    {
      "SectorGroupCode": "9038",
      "SectorGroupName": "홈쇼핑"
    },
    {
      "SectorGroupCode": "9040",
      "SectorGroupName": "휴대폰부품"
    },
    {
      "SectorGroupCode": "9041",
      "SectorGroupName": "카메라모듈/부품"
    },
    {
      "SectorGroupCode": "9042",
      "SectorGroupName": "게임"
    },
    {
      "SectorGroupCode": "9044",
      "SectorGroupName": "시멘트/레미콘"
    },
    {
      "SectorGroupCode": "9045",
      "SectorGroupName": "캐릭터상품"
    },
    {
      "SectorGroupCode": "9047",
      "SectorGroupName": "카지노"
    },
    {
      "SectorGroupCode": "9048",
      "SectorGroupName": "영화"
    },
    {
      "SectorGroupCode": "9049",
      "SectorGroupName": "인터넷 대표주"
    },
    {
      "SectorGroupCode": "9052",
      "SectorGroupName": "교육/온라인 교육"
    },
    {
      "SectorGroupCode": "9055",
      "SectorGroupName": "보안주(정보)"
    },
    {
      "SectorGroupCode": "9056",
      "SectorGroupName": "NI(네트워크통합)"
    },
    {
      "SectorGroupCode": "9059",
      "SectorGroupName": "광고"
    },
    {
      "SectorGroupCode": "9060",
      "SectorGroupName": "육계"
    },
    {
      "SectorGroupCode": "9062",
      "SectorGroupName": "철강 주요종목"
    },
    {
      "SectorGroupCode": "9063",
      "SectorGroupName": "제지"
    },
    {
      "SectorGroupCode": "9064",
      "SectorGroupName": "2차전지"
    },
    {
      "SectorGroupCode": "9066",
      "SectorGroupName": "줄기세포"
    },
    {
      "SectorGroupCode": "9072",
      "SectorGroupName": "철강 중소형"
    },
    {
      "SectorGroupCode": "9076",
      "SectorGroupName": "여름"
    },
    {
      "SectorGroupCode": "9079",
      "SectorGroupName": "자원개발"
    },
    {
      "SectorGroupCode": "9082",
      "SectorGroupName": "태풍 및 장마"
    },
    {
      "SectorGroupCode": "9086",
      "SectorGroupName": "주류업(주정, 에탄올 등)"
    },
    {
      "SectorGroupCode": "9090",
      "SectorGroupName": "수산"
    },
    {
      "SectorGroupCode": "9092",
      "SectorGroupName": "통신장비"
    },
    {
      "SectorGroupCode": "9094",
      "SectorGroupName": "조선기자재"
    },
    {
      "SectorGroupCode": "9097",
      "SectorGroupName": "RFID(NFC 등)"
    },
    {
      "SectorGroupCode": "9098",
      "SectorGroupName": "음원/음반"
    },
    {
      "SectorGroupCode": "9099",
      "SectorGroupName": "지능형로봇/인공지능(AI)"
    },
    {
      "SectorGroupCode": "9104",
      "SectorGroupName": "스마트홈(홈네트워크)"
    },
    {
      "SectorGroupCode": "9105",
      "SectorGroupName": "사료"
    },
    {
      "SectorGroupCode": "9106",
      "SectorGroupName": "바이오인식(생체인식)"
    },
    {
      "SectorGroupCode": "9108",
      "SectorGroupName": "백신/진단시약/방역(신종플루, AI 등)"
    },
    {
      "SectorGroupCode": "9110",
      "SectorGroupName": "화장품"
    },
    {
      "SectorGroupCode": "9111",
      "SectorGroupName": "지주사"
    },
    {
      "SectorGroupCode": "9112",
      "SectorGroupName": "공기청정기"
    },
    {
      "SectorGroupCode": "9113",
      "SectorGroupName": "음식료업종"
    },
    {
      "SectorGroupCode": "9119",
      "SectorGroupName": "창투사"
    },
    {
      "SectorGroupCode": "9121",
      "SectorGroupName": "남북경협"
    },
    {
      "SectorGroupCode": "9123",
      "SectorGroupName": "전력설비"
    },
    {
      "SectorGroupCode": "9124",
      "SectorGroupName": "제대혈"
    },
    {
      "SectorGroupCode": "9126",
      "SectorGroupName": "통신"
    },
    {
      "SectorGroupCode": "9127",
      "SectorGroupName": "영상콘텐츠"
    },
    {
      "SectorGroupCode": "9128",
      "SectorGroupName": "엔터테인먼트"
    },
    {
      "SectorGroupCode": "9136",
      "SectorGroupName": "소매유통"
    },
    {
      "SectorGroupCode": "9139",
      "SectorGroupName": "출산장려정책"
    },
    {
      "SectorGroupCode": "9141",
      "SectorGroupName": "종합 물류"
    },
    {
      "SectorGroupCode": "9144",
      "SectorGroupName": "방위산업/전쟁 및 테러"
    },
    {
      "SectorGroupCode": "9147",
      "SectorGroupName": "여행"
    },
    {
      "SectorGroupCode": "9149",
      "SectorGroupName": "원격진료/비대면진료(U-Healthcare)"
    },
    {
      "SectorGroupCode": "9151",
      "SectorGroupName": "증권"
    },
    {
      "SectorGroupCode": "9152",
      "SectorGroupName": "온실가스(탄소배출권)/탄소 포집·활용·저장(CCUS)"
    },
    {
      "SectorGroupCode": "9154",
      "SectorGroupName": "건설 대표주"
    },
    {
      "SectorGroupCode": "9155",
      "SectorGroupName": "반도체 대표주(생산)"
    },
    {
      "SectorGroupCode": "9159",
      "SectorGroupName": "자동차 대표주"
    },
    {
      "SectorGroupCode": "9164",
      "SectorGroupName": "손해보험"
    },
    {
      "SectorGroupCode": "9165",
      "SectorGroupName": "은행"
    },
    {
      "SectorGroupCode": "9166",
      "SectorGroupName": "항공/저가 항공사(LCC)"
    },
    {
      "SectorGroupCode": "9167",
      "SectorGroupName": "타이어"
    },
    {
      "SectorGroupCode": "9170",
      "SectorGroupName": "골판지 제조"
    },
    {
      "SectorGroupCode": "9171",
      "SectorGroupName": "비철금속"
    },
    {
      "SectorGroupCode": "9172",
      "SectorGroupName": "제약업체"
    },
    {
      "SectorGroupCode": "9173",
      "SectorGroupName": "IT 대표주"
    },
    {
      "SectorGroupCode": "9174",
      "SectorGroupName": "치아 치료(임플란트 등)"
    },
    {
      "SectorGroupCode": "9175",
      "SectorGroupName": "의료기기"
    },
    {
      "SectorGroupCode": "9176",
      "SectorGroupName": "도시가스"
    },
    {
      "SectorGroupCode": "9177",
      "SectorGroupName": "LPG(액화석유가스)"
    },
    {
      "SectorGroupCode": "9178",
      "SectorGroupName": "전선"
    },
    {
      "SectorGroupCode": "9180",
      "SectorGroupName": "석유화학"
    },
    {
      "SectorGroupCode": "9181",
      "SectorGroupName": "테마파크"
    },
    {
      "SectorGroupCode": "9184",
      "SectorGroupName": "수자원(양적/질적 개선)"
    },
    {
      "SectorGroupCode": "9185",
      "SectorGroupName": "정유"
    },
    {
      "SectorGroupCode": "9187",
      "SectorGroupName": "핵융합에너지"
    },
    {
      "SectorGroupCode": "9188",
      "SectorGroupName": "풍력에너지"
    },
    {
      "SectorGroupCode": "9191",
      "SectorGroupName": "태양광에너지"
    },
    {
      "SectorGroupCode": "9197",
      "SectorGroupName": "폐기물처리"
    },
    {
      "SectorGroupCode": "9200",
      "SectorGroupName": "우주항공산업(누리호/인공위성 등)"
    },
    {
      "SectorGroupCode": "9204",
      "SectorGroupName": "비료"
    },
    {
      "SectorGroupCode": "9205",
      "SectorGroupName": "원자력발전"
    },
    {
      "SectorGroupCode": "9206",
      "SectorGroupName": "농업"
    },
    {
      "SectorGroupCode": "9209",
      "SectorGroupName": "터치패널(스마트폰/태블릿PC 등)"
    },
    {
      "SectorGroupCode": "9210",
      "SectorGroupName": "자전거"
    },
    {
      "SectorGroupCode": "9213",
      "SectorGroupName": "해저터널(지하화/지하도로 등)"
    },
    {
      "SectorGroupCode": "9223",
      "SectorGroupName": "강관업체(Steel pipe)"
    },
    {
      "SectorGroupCode": "9227",
      "SectorGroupName": "전기차"
    },
    {
      "SectorGroupCode": "9228",
      "SectorGroupName": "국내 상장 중국기업"
    },
    {
      "SectorGroupCode": "9229",
      "SectorGroupName": "스마트그리드(지능형전력망)"
    },
    {
      "SectorGroupCode": "9232",
      "SectorGroupName": "미디어(방송/신문)"
    },
    {
      "SectorGroupCode": "9234",
      "SectorGroupName": "보안주(물리)"
    },
    {
      "SectorGroupCode": "9237",
      "SectorGroupName": "GTX(수도권 광역급행철도)"
    },
    {
      "SectorGroupCode": "9241",
      "SectorGroupName": "바이오시밀러(복제 바이오의약품)"
    },
    {
      "SectorGroupCode": "9242",
      "SectorGroupName": "탄소나노튜브(CNT)"
    },
    {
      "SectorGroupCode": "9250",
      "SectorGroupName": "철도"
    },
    {
      "SectorGroupCode": "9265",
      "SectorGroupName": "모바일게임(스마트폰)"
    },
    {
      "SectorGroupCode": "9266",
      "SectorGroupName": "겨울"
    },
    {
      "SectorGroupCode": "9268",
      "SectorGroupName": "전기자전거"
    },
    {
      "SectorGroupCode": "9269",
      "SectorGroupName": "LED장비"
    },
    {
      "SectorGroupCode": "9270",
      "SectorGroupName": "모바일콘텐츠(스마트폰/태블릿PC)"
    },
    {
      "SectorGroupCode": "9272",
      "SectorGroupName": "전자결제(전자화폐)"
    },
    {
      "SectorGroupCode": "9276",
      "SectorGroupName": "클라우드 컴퓨팅"
    },
    {
      "SectorGroupCode": "9279",
      "SectorGroupName": "스마트폰"
    },
    {
      "SectorGroupCode": "9283",
      "SectorGroupName": "생명보험"
    },
    {
      "SectorGroupCode": "9284",
      "SectorGroupName": "기업인수목적회사(SPAC)"
    },
    {
      "SectorGroupCode": "9285",
      "SectorGroupName": "마스크"
    },
    {
      "SectorGroupCode": "9287",
      "SectorGroupName": "PCB(FPCB 등)"
    },
    {
      "SectorGroupCode": "9288",
      "SectorGroupName": "모바일솔루션(스마트폰)"
    },
    {
      "SectorGroupCode": "9289",
      "SectorGroupName": "증강현실(AR)"
    },
    {
      "SectorGroupCode": "9290",
      "SectorGroupName": "스포츠행사 수혜(올림픽, 월드컵 등)"
    },
    {
      "SectorGroupCode": "9294",
      "SectorGroupName": "슈퍼박테리아"
    },
    {
      "SectorGroupCode": "9297",
      "SectorGroupName": "공작기계"
    },
    {
      "SectorGroupCode": "9298",
      "SectorGroupName": "희귀금속(희토류 등)"
    },
    {
      "SectorGroupCode": "9302",
      "SectorGroupName": "음성인식"
    },
    {
      "SectorGroupCode": "9307",
      "SectorGroupName": "시스템반도체"
    },
    {
      "SectorGroupCode": "9310",
      "SectorGroupName": "리츠(REITs)"
    },
    {
      "SectorGroupCode": "9311",
      "SectorGroupName": "고령화 사회(노인복지)"
    },
    {
      "SectorGroupCode": "9313",
      "SectorGroupName": "남-북-러 가스관사업"
    },
    {
      "SectorGroupCode": "9316",
      "SectorGroupName": "엔젤산업"
    },
    {
      "SectorGroupCode": "9317",
      "SectorGroupName": "SNS(소셜네트워크서비스)"
    },
    {
      "SectorGroupCode": "9318",
      "SectorGroupName": "백화점"
    },
    {
      "SectorGroupCode": "9319",
      "SectorGroupName": "화학섬유"
    },
    {
      "SectorGroupCode": "9321",
      "SectorGroupName": "무선충전기술"
    },
    {
      "SectorGroupCode": "9322",
      "SectorGroupName": "건설 중소형"
    },
    {
      "SectorGroupCode": "9323",
      "SectorGroupName": "셰일가스(Shale Gas)"
    },
    {
      "SectorGroupCode": "9324",
      "SectorGroupName": "일자리(취업)"
    },
    {
      "SectorGroupCode": "9325",
      "SectorGroupName": "종합상사"
    },
    {
      "SectorGroupCode": "9326",
      "SectorGroupName": "3D 프린터"
    },
    {
      "SectorGroupCode": "9328",
      "SectorGroupName": "제습기"
    },
    {
      "SectorGroupCode": "9329",
      "SectorGroupName": "전력저장장치(ESS)"
    },
    {
      "SectorGroupCode": "9330",
      "SectorGroupName": "페인트"
    },
    {
      "SectorGroupCode": "9331",
      "SectorGroupName": "가상화폐(비트코인 등)"
    },
    {
      "SectorGroupCode": "9332",
      "SectorGroupName": "스마트카(SMART CAR)"
    },
    {
      "SectorGroupCode": "9334",
      "SectorGroupName": "사물인터넷"
    },
    {
      "SectorGroupCode": "9335",
      "SectorGroupName": "재난/안전(지진/화재 등)"
    },
    {
      "SectorGroupCode": "9341",
      "SectorGroupName": "밥솥"
    },
    {
      "SectorGroupCode": "9342",
      "SectorGroupName": "핀테크(FinTech)"
    },
    {
      "SectorGroupCode": "9343",
      "SectorGroupName": "인터넷은행"
    },
    {
      "SectorGroupCode": "9346",
      "SectorGroupName": "메르스 코로나 바이러스"
    },
    {
      "SectorGroupCode": "9348",
      "SectorGroupName": "삼성페이"
    },
    {
      "SectorGroupCode": "9349",
      "SectorGroupName": "드론(Drone)"
    },
    {
      "SectorGroupCode": "9352",
      "SectorGroupName": "가상현실(VR)"
    },
    {
      "SectorGroupCode": "9362",
      "SectorGroupName": "자율주행차"
    },
    {
      "SectorGroupCode": "9370",
      "SectorGroupName": "3D 낸드(NAND)"
    },
    {
      "SectorGroupCode": "9373",
      "SectorGroupName": "5G(5세대 이동통신)"
    },
    {
      "SectorGroupCode": "9374",
      "SectorGroupName": "4대강 복원"
    },
    {
      "SectorGroupCode": "9375",
      "SectorGroupName": "4차산업 수혜주"
    },
    {
      "SectorGroupCode": "9376",
      "SectorGroupName": "유전자 치료제/분석"
    },
    {
      "SectorGroupCode": "9377",
      "SectorGroupName": "치매"
    },
    {
      "SectorGroupCode": "9378",
      "SectorGroupName": "건설기계"
    },
    {
      "SectorGroupCode": "9379",
      "SectorGroupName": "항공기부품"
    },
    {
      "SectorGroupCode": "9380",
      "SectorGroupName": "면세점"
    },
    {
      "SectorGroupCode": "9381",
      "SectorGroupName": "LNG(액화천연가스)"
    },
    {
      "SectorGroupCode": "9382",
      "SectorGroupName": "플렉서블 디스플레이"
    },
    {
      "SectorGroupCode": "9384",
      "SectorGroupName": "편의점"
    },
    {
      "SectorGroupCode": "9385",
      "SectorGroupName": "키오스크(KIOSK)"
    },
    {
      "SectorGroupCode": "9386",
      "SectorGroupName": "수소차(연료전지/부품/충전소 등)"
    },
    {
      "SectorGroupCode": "9387",
      "SectorGroupName": "블록체인"
    },
    {
      "SectorGroupCode": "9388",
      "SectorGroupName": "아이폰"
    },
    {
      "SectorGroupCode": "9389",
      "SectorGroupName": "면역항암제"
    },
    {
      "SectorGroupCode": "9390",
      "SectorGroupName": "마이크로 LED"
    },
    {
      "SectorGroupCode": "9392",
      "SectorGroupName": "스마트팩토리(스마트공장)"
    },
    {
      "SectorGroupCode": "9393",
      "SectorGroupName": "갤럭시 부품주"
    },
    {
      "SectorGroupCode": "9397",
      "SectorGroupName": "보톡스(보툴리눔톡신)"
    },
    {
      "SectorGroupCode": "9398",
      "SectorGroupName": "DMZ 평화공원"
    },
    {
      "SectorGroupCode": "9400",
      "SectorGroupName": "조림사업"
    },
    {
      "SectorGroupCode": "9401",
      "SectorGroupName": "원자력발전소 해체"
    },
    {
      "SectorGroupCode": "9402",
      "SectorGroupName": "아스콘(아스팔트 콘크리트)"
    },
    {
      "SectorGroupCode": "9404",
      "SectorGroupName": "폴더블폰"
    },
    {
      "SectorGroupCode": "9405",
      "SectorGroupName": "MLCC(적층세라믹콘덴서)"
    },
    {
      "SectorGroupCode": "9407",
      "SectorGroupName": "호텔/리조트"
    },
    {
      "SectorGroupCode": "9408",
      "SectorGroupName": "마리화나(대마)"
    },
    {
      "SectorGroupCode": "9415",
      "SectorGroupName": "그래핀"
    },
    {
      "SectorGroupCode": "9417",
      "SectorGroupName": "아프리카 돼지열병(ASF)"
    },
    {
      "SectorGroupCode": "9421",
      "SectorGroupName": "日제품 불매운동(수혜)"
    },
    {
      "SectorGroupCode": "9422",
      "SectorGroupName": "日 수출 규제(국산화 등)"
    },
    {
      "SectorGroupCode": "9426",
      "SectorGroupName": "양자암호/양자컴퓨팅"
    },
    {
      "SectorGroupCode": "9427",
      "SectorGroupName": "구충제(펜벤다졸, 이버멕틴 등)"
    },
    {
      "SectorGroupCode": "9435",
      "SectorGroupName": "재택근무/스마트워크"
    },
    {
      "SectorGroupCode": "9436",
      "SectorGroupName": "코로나19(진단/치료제/백신 개발 등)"
    },
    {
      "SectorGroupCode": "9445",
      "SectorGroupName": "2차전지(장비)"
    },
    {
      "SectorGroupCode": "9446",
      "SectorGroupName": "2차전지(소재/부품)"
    },
    {
      "SectorGroupCode": "9447",
      "SectorGroupName": "코로나19(진단키트)"
    },
    {
      "SectorGroupCode": "9448",
      "SectorGroupName": "코로나19(치료제/백신 개발 등)"
    },
    {
      "SectorGroupCode": "9449",
      "SectorGroupName": "2차전지(생산)"
    },
    {
      "SectorGroupCode": "9452",
      "SectorGroupName": "코로나19(음압병실/음압구급차)"
    },
    {
      "SectorGroupCode": "9462",
      "SectorGroupName": "UAM(도심항공모빌리티)"
    },
    {
      "SectorGroupCode": "9464",
      "SectorGroupName": "콜드체인(저온 유통)"
    },
    {
      "SectorGroupCode": "9467",
      "SectorGroupName": "모더나(MODERNA)"
    },
    {
      "SectorGroupCode": "9468",
      "SectorGroupName": "화이자(PFIZER)"
    },
    {
      "SectorGroupCode": "9470",
      "SectorGroupName": "마이크로바이옴"
    },
    {
      "SectorGroupCode": "9472",
      "SectorGroupName": "2차전지(전고체)"
    },
    {
      "SectorGroupCode": "9474",
      "SectorGroupName": "쿠팡(coupang)"
    },
    {
      "SectorGroupCode": "9480",
      "SectorGroupName": "메타버스(Metaverse)"
    },
    {
      "SectorGroupCode": "9481",
      "SectorGroupName": "마켓컬리(kurly)"
    },
    {
      "SectorGroupCode": "9482",
      "SectorGroupName": "두나무(Dunamu)"
    },
    {
      "SectorGroupCode": "9483",
      "SectorGroupName": "야놀자(Yanolja)"
    },
    {
      "SectorGroupCode": "9487",
      "SectorGroupName": "건강기능식품"
    },
    {
      "SectorGroupCode": "9488",
      "SectorGroupName": "웹툰"
    },
    {
      "SectorGroupCode": "9489",
      "SectorGroupName": "카카오뱅크(kakao BANK)"
    },
    {
      "SectorGroupCode": "9492",
      "SectorGroupName": "NFT(대체불가토큰)"
    },
    {
      "SectorGroupCode": "9493",
      "SectorGroupName": "mRNA(메신저 리보핵산)"
    },
    {
      "SectorGroupCode": "9496",
      "SectorGroupName": "골프"
    },
    {
      "SectorGroupCode": "9497",
      "SectorGroupName": "토스(toss)"
    },
    {
      "SectorGroupCode": "9500",
      "SectorGroupName": "폐배터리"
    },
    {
      "SectorGroupCode": "9501",
      "SectorGroupName": "리비안(RIVIAN)"
    },
    {
      "SectorGroupCode": "9503",
      "SectorGroupName": "2차전지(LFP/리튬인산철)"
    },
    {
      "SectorGroupCode": "9504",
      "SectorGroupName": "요소수"
    },
    {
      "SectorGroupCode": "9505",
      "SectorGroupName": "로봇(산업용/협동로봇 등)"
    },
    {
      "SectorGroupCode": "9506",
      "SectorGroupName": "탈모 치료"
    },
    {
      "SectorGroupCode": "9507",
      "SectorGroupName": "마이데이터"
    },
    {
      "SectorGroupCode": "9511",
      "SectorGroupName": "니켈"
    },
    {
      "SectorGroupCode": "9513",
      "SectorGroupName": "미용기기"
    },
    {
      "SectorGroupCode": "9514",
      "SectorGroupName": "전기차(충전소/충전기)"
    },
    {
      "SectorGroupCode": "9516",
      "SectorGroupName": "엠폭스(원숭이두창)"
    },
    {
      "SectorGroupCode": "9517",
      "SectorGroupName": "우크라이나 재건"
    },
    {
      "SectorGroupCode": "9519",
      "SectorGroupName": "네옴시티"
    },
    {
      "SectorGroupCode": "9520",
      "SectorGroupName": "피팅(관이음쇠)/밸브"
    },
    {
      "SectorGroupCode": "9521",
      "SectorGroupName": "애플페이"
    },
    {
      "SectorGroupCode": "9523",
      "SectorGroupName": "리튬"
    },
    {
      "SectorGroupCode": "9524",
      "SectorGroupName": "모듈러주택"
    },
    {
      "SectorGroupCode": "9525",
      "SectorGroupName": "렌터카"
    },
    {
      "SectorGroupCode": "9527",
      "SectorGroupName": "윤활유"
    },
    {
      "SectorGroupCode": "9529",
      "SectorGroupName": "AI 챗봇(챗GPT 등)"
    },
    {
      "SectorGroupCode": "9531",
      "SectorGroupName": "STO(토큰증권 발행)"
    },
    {
      "SectorGroupCode": "9534",
      "SectorGroupName": "페라이트"
    },
    {
      "SectorGroupCode": "9536",
      "SectorGroupName": "HBM(고대역폭메모리)"
    },
    {
      "SectorGroupCode": "9537",
      "SectorGroupName": "초전도체"
    },
    {
      "SectorGroupCode": "9539",
      "SectorGroupName": "맥신(MXene)"
    },
    {
      "SectorGroupCode": "9540",
      "SectorGroupName": "비만치료제"
    },
    {
      "SectorGroupCode": "9543",
      "SectorGroupName": "의료AI"
    },
    {
      "SectorGroupCode": "9545",
      "SectorGroupName": "온디바이스 AI"
    },
    {
      "SectorGroupCode": "9546",
      "SectorGroupName": "마이코플라스마 폐렴"
    },
    {
      "SectorGroupCode": "9547",
      "SectorGroupName": "CXL(컴퓨트익스프레스링크)"
    },
    {
      "SectorGroupCode": "9556",
      "SectorGroupName": "뉴로모픽 반도체"
    },
    {
      "SectorGroupCode": "9557",
      "SectorGroupName": "유리 기판"
    },
    {
      "SectorGroupCode": "9559",
      "SectorGroupName": "고체산화물 연료전지(SOFC)"
    },
    {
      "SectorGroupCode": "9560",
      "SectorGroupName": "냉각시스템(액침냉각 등)"
    },
    {
      "SectorGroupCode": "9563",
      "SectorGroupName": "낙태/피임"
    },
    {
      "SectorGroupCode": "9564",
      "SectorGroupName": "전기차 화재 방지(배터리 열폭주 등)"
    },
    {
      "SectorGroupCode": "9566",
      "SectorGroupName": "딥페이크(deepfake)"
    },
    {
      "SectorGroupCode": "9567",
      "SectorGroupName": "밸류업(24년 기업가치 제고계획 발표)"
    },
    {
      "SectorGroupCode": "9568",
      "SectorGroupName": "코리아 밸류업 지수(Korea Value-up Index)"
    },
    {
      "SectorGroupCode": "9571",
      "SectorGroupName": "밸류업(25년 기업가치 제고계획 발표)"
    },
    {
      "SectorGroupCode": "9574",
      "SectorGroupName": "2025 상반기 신규상장"
    },
    {
      "SectorGroupCode": "9575",
      "SectorGroupName": "지역화폐"
    },
    {
      "SectorGroupCode": "9576",
      "SectorGroupName": "퓨리오사AI"
    },
    {
      "SectorGroupCode": "9579",
      "SectorGroupName": "2차전지(나트륨이온)"
    },
    {
      "SectorGroupCode": "9580",
      "SectorGroupName": "유심(USIM)"
    },
    {
      "SectorGroupCode": "9581",
      "SectorGroupName": "탈 플라스틱(친환경/생분해성 등)"
    },
    {
      "SectorGroupCode": "9582",
      "SectorGroupName": "스테이블코인"
    },
    {
      "SectorGroupCode": "9583",
      "SectorGroupName": "2025 하반기 신규상장"
    },
    {
      "SectorGroupCode": "9585",
      "SectorGroupName": "김밥(냉동김밥 등)"
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
