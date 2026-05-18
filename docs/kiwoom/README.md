# 키움증권 REST API 레퍼런스

생성 시각: 2026-05-18T05:16:18.548Z

- 공식 출처: https://openapi.kiwoom.com/guide/apiguide?dummyVal=0
- API 수: 207
- 오류코드 수: 33
- 운영 도메인과 모의투자 도메인은 각 API 문서의 원문 값을 따릅니다.

## 대분류

| 대분류 | API 수 |
| --- | ---: |
| 국내주식 | 205 |
| OAuth 인증 | 2 |

## 중분류별 API

### 계좌

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka00001](계좌/ka00001-계좌번호조회.md) | 계좌번호조회 | POST | `/api/dostk/acnt` |
| [ka01690](계좌/ka01690-일별잔고수익률.md) | 일별잔고수익률 | POST | `/api/dostk/acnt` |
| [ka10072](계좌/ka10072-일자별종목별실현손익요청_일자.md) | 일자별종목별실현손익요청_일자 | POST | `/api/dostk/acnt` |
| [ka10073](계좌/ka10073-일자별종목별실현손익요청_기간.md) | 일자별종목별실현손익요청_기간 | POST | `/api/dostk/acnt` |
| [ka10074](계좌/ka10074-일자별실현손익요청.md) | 일자별실현손익요청 | POST | `/api/dostk/acnt` |
| [ka10075](계좌/ka10075-미체결요청.md) | 미체결요청 | POST | `/api/dostk/acnt` |
| [ka10076](계좌/ka10076-체결요청.md) | 체결요청 | POST | `/api/dostk/acnt` |
| [ka10077](계좌/ka10077-당일실현손익상세요청.md) | 당일실현손익상세요청 | POST | `/api/dostk/acnt` |
| [ka10085](계좌/ka10085-계좌수익률요청.md) | 계좌수익률요청 | POST | `/api/dostk/acnt` |
| [ka10088](계좌/ka10088-미체결-분할주문-상세.md) | 미체결 분할주문 상세 | POST | `/api/dostk/acnt` |
| [ka10170](계좌/ka10170-당일매매일지요청.md) | 당일매매일지요청 | POST | `/api/dostk/acnt` |
| [kt00001](계좌/kt00001-예수금상세현황요청.md) | 예수금상세현황요청 | POST | `/api/dostk/acnt` |
| [kt00002](계좌/kt00002-일별추정예탁자산현황요청.md) | 일별추정예탁자산현황요청 | POST | `/api/dostk/acnt` |
| [kt00003](계좌/kt00003-추정자산조회요청.md) | 추정자산조회요청 | POST | `/api/dostk/acnt` |
| [kt00004](계좌/kt00004-계좌평가현황요청.md) | 계좌평가현황요청 | POST | `/api/dostk/acnt` |
| [kt00005](계좌/kt00005-체결잔고요청.md) | 체결잔고요청 | POST | `/api/dostk/acnt` |
| [kt00007](계좌/kt00007-계좌별주문체결내역상세요청.md) | 계좌별주문체결내역상세요청 | POST | `/api/dostk/acnt` |
| [kt00008](계좌/kt00008-계좌별익일결제예정내역요청.md) | 계좌별익일결제예정내역요청 | POST | `/api/dostk/acnt` |
| [kt00009](계좌/kt00009-계좌별주문체결현황요청.md) | 계좌별주문체결현황요청 | POST | `/api/dostk/acnt` |
| [kt00010](계좌/kt00010-주문인출가능금액요청.md) | 주문인출가능금액요청 | POST | `/api/dostk/acnt` |
| [kt00011](계좌/kt00011-증거금율별주문가능수량조회요청.md) | 증거금율별주문가능수량조회요청 | POST | `/api/dostk/acnt` |
| [kt00012](계좌/kt00012-신용보증금율별주문가능수량조회요청.md) | 신용보증금율별주문가능수량조회요청 | POST | `/api/dostk/acnt` |
| [kt00013](계좌/kt00013-증거금세부내역조회요청.md) | 증거금세부내역조회요청 | POST | `/api/dostk/acnt` |
| [kt00015](계좌/kt00015-위탁종합거래내역요청.md) | 위탁종합거래내역요청 | POST | `/api/dostk/acnt` |
| [kt00016](계좌/kt00016-일별계좌수익률상세현황요청.md) | 일별계좌수익률상세현황요청 | POST | `/api/dostk/acnt` |
| [kt00017](계좌/kt00017-계좌별당일현황요청.md) | 계좌별당일현황요청 | POST | `/api/dostk/acnt` |
| [kt00018](계좌/kt00018-계좌평가잔고내역요청.md) | 계좌평가잔고내역요청 | POST | `/api/dostk/acnt` |
| [kt50020](계좌/kt50020-금현물-잔고확인.md) | 금현물 잔고확인 | POST | `/api/dostk/acnt` |
| [kt50021](계좌/kt50021-금현물-예수금.md) | 금현물 예수금 | POST | `/api/dostk/acnt` |
| [kt50030](계좌/kt50030-금현물-주문체결전체조회.md) | 금현물 주문체결전체조회 | POST | `/api/dostk/acnt` |
| [kt50031](계좌/kt50031-금현물-주문체결조회.md) | 금현물 주문체결조회 | POST | `/api/dostk/acnt` |
| [kt50032](계좌/kt50032-금현물-거래내역조회.md) | 금현물 거래내역조회 | POST | `/api/dostk/acnt` |
| [kt50075](계좌/kt50075-금현물-미체결조회.md) | 금현물 미체결조회 | POST | `/api/dostk/acnt` |

### 공매도

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka10014](공매도/ka10014-공매도추이요청.md) | 공매도추이요청 | POST | `/api/dostk/shsa` |

### 기관/외국인

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka10008](기관-외국인/ka10008-주식외국인종목별매매동향.md) | 주식외국인종목별매매동향 | POST | `/api/dostk/frgnistt` |
| [ka10009](기관-외국인/ka10009-주식기관요청.md) | 주식기관요청 | POST | `/api/dostk/frgnistt` |
| [ka10131](기관-외국인/ka10131-기관외국인연속매매현황요청.md) | 기관외국인연속매매현황요청 | POST | `/api/dostk/frgnistt` |
| [ka52301](기관-외국인/ka52301-금현물투자자현황.md) | 금현물투자자현황 | POST | `/api/dostk/frgnistt` |

### 대차거래

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka10068](대차거래/ka10068-대차거래추이요청.md) | 대차거래추이요청 | POST | `/api/dostk/slb` |
| [ka10069](대차거래/ka10069-대차거래상위10종목요청.md) | 대차거래상위10종목요청 | POST | `/api/dostk/slb` |
| [ka20068](대차거래/ka20068-대차거래추이요청-종목별.md) | 대차거래추이요청(종목별) | POST | `/api/dostk/slb` |
| [ka90012](대차거래/ka90012-대차거래내역요청.md) | 대차거래내역요청 | POST | `/api/dostk/slb` |

### 순위정보

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka10020](순위정보/ka10020-호가잔량상위요청.md) | 호가잔량상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10021](순위정보/ka10021-호가잔량급증요청.md) | 호가잔량급증요청 | POST | `/api/dostk/rkinfo` |
| [ka10022](순위정보/ka10022-잔량율급증요청.md) | 잔량율급증요청 | POST | `/api/dostk/rkinfo` |
| [ka10023](순위정보/ka10023-거래량급증요청.md) | 거래량급증요청 | POST | `/api/dostk/rkinfo` |
| [ka10027](순위정보/ka10027-전일대비등락률상위요청.md) | 전일대비등락률상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10029](순위정보/ka10029-예상체결등락률상위요청.md) | 예상체결등락률상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10030](순위정보/ka10030-당일거래량상위요청.md) | 당일거래량상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10031](순위정보/ka10031-전일거래량상위요청.md) | 전일거래량상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10032](순위정보/ka10032-거래대금상위요청.md) | 거래대금상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10033](순위정보/ka10033-신용비율상위요청.md) | 신용비율상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10034](순위정보/ka10034-외인기간별매매상위요청.md) | 외인기간별매매상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10035](순위정보/ka10035-외인연속순매매상위요청.md) | 외인연속순매매상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10036](순위정보/ka10036-외인한도소진율증가상위.md) | 외인한도소진율증가상위 | POST | `/api/dostk/rkinfo` |
| [ka10037](순위정보/ka10037-외국계창구매매상위요청.md) | 외국계창구매매상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10038](순위정보/ka10038-종목별증권사순위요청.md) | 종목별증권사순위요청 | POST | `/api/dostk/rkinfo` |
| [ka10039](순위정보/ka10039-증권사별매매상위요청.md) | 증권사별매매상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10040](순위정보/ka10040-당일주요거래원요청.md) | 당일주요거래원요청 | POST | `/api/dostk/rkinfo` |
| [ka10042](순위정보/ka10042-순매수거래원순위요청.md) | 순매수거래원순위요청 | POST | `/api/dostk/rkinfo` |
| [ka10053](순위정보/ka10053-당일상위이탈원요청.md) | 당일상위이탈원요청 | POST | `/api/dostk/rkinfo` |
| [ka10062](순위정보/ka10062-동일순매매순위요청.md) | 동일순매매순위요청 | POST | `/api/dostk/rkinfo` |
| [ka10065](순위정보/ka10065-장중투자자별매매상위요청.md) | 장중투자자별매매상위요청 | POST | `/api/dostk/rkinfo` |
| [ka10098](순위정보/ka10098-시간외단일가등락율순위요청.md) | 시간외단일가등락율순위요청 | POST | `/api/dostk/rkinfo` |
| [ka90009](순위정보/ka90009-외국인기관매매상위요청.md) | 외국인기관매매상위요청 | POST | `/api/dostk/rkinfo` |

### 시세

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka10004](시세/ka10004-주식호가요청.md) | 주식호가요청 | POST | `/api/dostk/mrkcond` |
| [ka10005](시세/ka10005-주식일주월시분요청.md) | 주식일주월시분요청 | POST | `/api/dostk/mrkcond` |
| [ka10006](시세/ka10006-주식시분요청.md) | 주식시분요청 | POST | `/api/dostk/mrkcond` |
| [ka10007](시세/ka10007-시세표성정보요청.md) | 시세표성정보요청 | POST | `/api/dostk/mrkcond` |
| [ka10011](시세/ka10011-신주인수권전체시세요청.md) | 신주인수권전체시세요청 | POST | `/api/dostk/mrkcond` |
| [ka10044](시세/ka10044-일별기관매매종목요청.md) | 일별기관매매종목요청 | POST | `/api/dostk/mrkcond` |
| [ka10045](시세/ka10045-종목별기관매매추이요청.md) | 종목별기관매매추이요청 | POST | `/api/dostk/mrkcond` |
| [ka10046](시세/ka10046-체결강도추이시간별요청.md) | 체결강도추이시간별요청 | POST | `/api/dostk/mrkcond` |
| [ka10047](시세/ka10047-체결강도추이일별요청.md) | 체결강도추이일별요청 | POST | `/api/dostk/mrkcond` |
| [ka10063](시세/ka10063-장중투자자별매매요청.md) | 장중투자자별매매요청 | POST | `/api/dostk/mrkcond` |
| [ka10066](시세/ka10066-장마감후투자자별매매요청.md) | 장마감후투자자별매매요청 | POST | `/api/dostk/mrkcond` |
| [ka10078](시세/ka10078-증권사별종목매매동향요청.md) | 증권사별종목매매동향요청 | POST | `/api/dostk/mrkcond` |
| [ka10086](시세/ka10086-일별주가요청.md) | 일별주가요청 | POST | `/api/dostk/mrkcond` |
| [ka10087](시세/ka10087-시간외단일가요청.md) | 시간외단일가요청 | POST | `/api/dostk/mrkcond` |
| [ka50010](시세/ka50010-금현물체결추이.md) | 금현물체결추이 | POST | `/api/dostk/mrkcond` |
| [ka50012](시세/ka50012-금현물일별추이.md) | 금현물일별추이 | POST | `/api/dostk/mrkcond` |
| [ka50087](시세/ka50087-금현물예상체결.md) | 금현물예상체결 | POST | `/api/dostk/mrkcond` |
| [ka50100](시세/ka50100-금현물-시세정보.md) | 금현물 시세정보 | POST | `/api/dostk/mrkcond` |
| [ka50101](시세/ka50101-금현물-호가.md) | 금현물 호가 | POST | `/api/dostk/mrkcond` |
| [ka90005](시세/ka90005-프로그램매매추이요청-시간대별.md) | 프로그램매매추이요청 시간대별 | POST | `/api/dostk/mrkcond` |
| [ka90006](시세/ka90006-프로그램매매차익잔고추이요청.md) | 프로그램매매차익잔고추이요청 | POST | `/api/dostk/mrkcond` |
| [ka90007](시세/ka90007-프로그램매매누적추이요청.md) | 프로그램매매누적추이요청 | POST | `/api/dostk/mrkcond` |
| [ka90008](시세/ka90008-종목시간별프로그램매매추이요청.md) | 종목시간별프로그램매매추이요청 | POST | `/api/dostk/mrkcond` |
| [ka90010](시세/ka90010-프로그램매매추이요청-일자별.md) | 프로그램매매추이요청 일자별 | POST | `/api/dostk/mrkcond` |
| [ka90013](시세/ka90013-종목일별프로그램매매추이요청.md) | 종목일별프로그램매매추이요청 | POST | `/api/dostk/mrkcond` |

### 신용주문

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [kt10006](신용주문/kt10006-신용-매수주문.md) | 신용 매수주문 | POST | `/api/dostk/crdordr` |
| [kt10007](신용주문/kt10007-신용-매도주문.md) | 신용 매도주문 | POST | `/api/dostk/crdordr` |
| [kt10008](신용주문/kt10008-신용-정정주문.md) | 신용 정정주문 | POST | `/api/dostk/crdordr` |
| [kt10009](신용주문/kt10009-신용-취소주문.md) | 신용 취소주문 | POST | `/api/dostk/crdordr` |

### 실시간시세

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [00](실시간시세/00-주문체결.md) | 주문체결 | POST | `/api/dostk/websocket` |
| [04](실시간시세/04-잔고.md) | 잔고 | POST | `/api/dostk/websocket` |
| [0A](실시간시세/0a-주식기세.md) | 주식기세 | POST | `/api/dostk/websocket` |
| [0B](실시간시세/0b-주식체결.md) | 주식체결 | POST | `/api/dostk/websocket` |
| [0C](실시간시세/0c-주식우선호가.md) | 주식우선호가 | POST | `/api/dostk/websocket` |
| [0D](실시간시세/0d-주식호가잔량.md) | 주식호가잔량 | POST | `/api/dostk/websocket` |
| [0E](실시간시세/0e-주식시간외호가.md) | 주식시간외호가 | POST | `/api/dostk/websocket` |
| [0F](실시간시세/0f-주식당일거래원.md) | 주식당일거래원 | POST | `/api/dostk/websocket` |
| [0g](실시간시세/0g-주식종목정보.md) | 주식종목정보 | POST | `/api/dostk/websocket` |
| [0G](실시간시세/0g-etf-nav.md) | ETF NAV | POST | `/api/dostk/websocket` |
| [0H](실시간시세/0h-주식예상체결.md) | 주식예상체결 | POST | `/api/dostk/websocket` |
| [0I](실시간시세/0i-국제금환산가격.md) | 국제금환산가격 | POST | `/api/dostk/websocket` |
| [0J](실시간시세/0j-업종지수.md) | 업종지수 | POST | `/api/dostk/websocket` |
| [0m](실시간시세/0m-elw-이론가.md) | ELW 이론가 | POST | `/api/dostk/websocket` |
| [0s](실시간시세/0s-장시작시간.md) | 장시작시간 | POST | `/api/dostk/websocket` |
| [0u](실시간시세/0u-elw-지표.md) | ELW 지표 | POST | `/api/dostk/websocket` |
| [0U](실시간시세/0u-업종등락.md) | 업종등락 | POST | `/api/dostk/websocket` |
| [0w](실시간시세/0w-종목프로그램매매.md) | 종목프로그램매매 | POST | `/api/dostk/websocket` |
| [1h](실시간시세/1h-vi발동-해제.md) | VI발동/해제 | POST | `/api/dostk/websocket` |

### 업종

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka10010](업종/ka10010-업종프로그램요청.md) | 업종프로그램요청 | POST | `/api/dostk/sect` |
| [ka10051](업종/ka10051-업종별투자자순매수요청.md) | 업종별투자자순매수요청 | POST | `/api/dostk/sect` |
| [ka20001](업종/ka20001-업종현재가요청.md) | 업종현재가요청 | POST | `/api/dostk/sect` |
| [ka20002](업종/ka20002-업종별주가요청.md) | 업종별주가요청 | POST | `/api/dostk/sect` |
| [ka20003](업종/ka20003-전업종지수요청.md) | 전업종지수요청 | POST | `/api/dostk/sect` |
| [ka20009](업종/ka20009-업종현재가일별요청.md) | 업종현재가일별요청 | POST | `/api/dostk/sect` |

### 접근토큰발급

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [au10001](접근토큰발급/au10001-접근토큰-발급.md) | 접근토큰 발급 | POST | `/oauth2/token` |

### 접근토큰폐기

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [au10002](접근토큰폐기/au10002-접근토큰폐기.md) | 접근토큰폐기 | POST | `/oauth2/revoke` |

### 조건검색

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka10171](조건검색/ka10171-조건검색-목록조회.md) | 조건검색 목록조회 | POST | `/api/dostk/websocket` |
| [ka10172](조건검색/ka10172-조건검색-요청-일반.md) | 조건검색 요청 일반 | POST | `/api/dostk/websocket` |
| [ka10173](조건검색/ka10173-조건검색-요청-실시간.md) | 조건검색 요청 실시간 | POST | `/api/dostk/websocket` |
| [ka10174](조건검색/ka10174-조건검색-실시간-해제.md) | 조건검색 실시간 해제 | POST | `/api/dostk/websocket` |

### 종목정보

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka00198](종목정보/ka00198-실시간종목조회순위.md) | 실시간종목조회순위 | POST | `/api/dostk/stkinfo` |
| [ka10001](종목정보/ka10001-주식기본정보요청.md) | 주식기본정보요청 | POST | `/api/dostk/stkinfo` |
| [ka10002](종목정보/ka10002-주식거래원요청.md) | 주식거래원요청 | POST | `/api/dostk/stkinfo` |
| [ka10003](종목정보/ka10003-체결정보요청.md) | 체결정보요청 | POST | `/api/dostk/stkinfo` |
| [ka10013](종목정보/ka10013-신용매매동향요청.md) | 신용매매동향요청 | POST | `/api/dostk/stkinfo` |
| [ka10015](종목정보/ka10015-일별거래상세요청.md) | 일별거래상세요청 | POST | `/api/dostk/stkinfo` |
| [ka10016](종목정보/ka10016-신고저가요청.md) | 신고저가요청 | POST | `/api/dostk/stkinfo` |
| [ka10017](종목정보/ka10017-상하한가요청.md) | 상하한가요청 | POST | `/api/dostk/stkinfo` |
| [ka10018](종목정보/ka10018-고저가근접요청.md) | 고저가근접요청 | POST | `/api/dostk/stkinfo` |
| [ka10019](종목정보/ka10019-가격급등락요청.md) | 가격급등락요청 | POST | `/api/dostk/stkinfo` |
| [ka10024](종목정보/ka10024-거래량갱신요청.md) | 거래량갱신요청 | POST | `/api/dostk/stkinfo` |
| [ka10025](종목정보/ka10025-매물대집중요청.md) | 매물대집중요청 | POST | `/api/dostk/stkinfo` |
| [ka10026](종목정보/ka10026-고저per요청.md) | 고저PER요청 | POST | `/api/dostk/stkinfo` |
| [ka10028](종목정보/ka10028-시가대비등락률요청.md) | 시가대비등락률요청 | POST | `/api/dostk/stkinfo` |
| [ka10043](종목정보/ka10043-거래원매물대분석요청.md) | 거래원매물대분석요청 | POST | `/api/dostk/stkinfo` |
| [ka10052](종목정보/ka10052-거래원순간거래량요청.md) | 거래원순간거래량요청 | POST | `/api/dostk/stkinfo` |
| [ka10054](종목정보/ka10054-변동성완화장치발동종목요청.md) | 변동성완화장치발동종목요청 | POST | `/api/dostk/stkinfo` |
| [ka10055](종목정보/ka10055-당일전일체결량요청.md) | 당일전일체결량요청 | POST | `/api/dostk/stkinfo` |
| [ka10058](종목정보/ka10058-투자자별일별매매종목요청.md) | 투자자별일별매매종목요청 | POST | `/api/dostk/stkinfo` |
| [ka10059](종목정보/ka10059-종목별투자자기관별요청.md) | 종목별투자자기관별요청 | POST | `/api/dostk/stkinfo` |
| [ka10061](종목정보/ka10061-종목별투자자기관별합계요청.md) | 종목별투자자기관별합계요청 | POST | `/api/dostk/stkinfo` |
| [ka10084](종목정보/ka10084-당일전일체결요청.md) | 당일전일체결요청 | POST | `/api/dostk/stkinfo` |
| [ka10095](종목정보/ka10095-관심종목정보요청.md) | 관심종목정보요청 | POST | `/api/dostk/stkinfo` |
| [ka10099](종목정보/ka10099-종목정보-리스트.md) | 종목정보 리스트 | POST | `/api/dostk/stkinfo` |
| [ka10100](종목정보/ka10100-종목정보-조회.md) | 종목정보 조회 | POST | `/api/dostk/stkinfo` |
| [ka10101](종목정보/ka10101-업종코드-리스트.md) | 업종코드 리스트 | POST | `/api/dostk/stkinfo` |
| [ka10102](종목정보/ka10102-회원사-리스트.md) | 회원사 리스트 | POST | `/api/dostk/stkinfo` |
| [ka90003](종목정보/ka90003-프로그램순매수상위50요청.md) | 프로그램순매수상위50요청 | POST | `/api/dostk/stkinfo` |
| [ka90004](종목정보/ka90004-종목별프로그램매매현황요청.md) | 종목별프로그램매매현황요청 | POST | `/api/dostk/stkinfo` |
| [kt20016](종목정보/kt20016-신용융자-가능종목요청.md) | 신용융자 가능종목요청 | POST | `/api/dostk/stkinfo` |
| [kt20017](종목정보/kt20017-신용융자-가능문의.md) | 신용융자 가능문의 | POST | `/api/dostk/stkinfo` |

### 주문

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [kt10000](주문/kt10000-주식-매수주문.md) | 주식 매수주문 | POST | `/api/dostk/ordr` |
| [kt10001](주문/kt10001-주식-매도주문.md) | 주식 매도주문 | POST | `/api/dostk/ordr` |
| [kt10002](주문/kt10002-주식-정정주문.md) | 주식 정정주문 | POST | `/api/dostk/ordr` |
| [kt10003](주문/kt10003-주식-취소주문.md) | 주식 취소주문 | POST | `/api/dostk/ordr` |
| [kt50000](주문/kt50000-금현물-매수주문.md) | 금현물 매수주문 | POST | `/api/dostk/ordr` |
| [kt50001](주문/kt50001-금현물-매도주문.md) | 금현물 매도주문 | POST | `/api/dostk/ordr` |
| [kt50002](주문/kt50002-금현물-정정주문.md) | 금현물 정정주문 | POST | `/api/dostk/ordr` |
| [kt50003](주문/kt50003-금현물-취소주문.md) | 금현물 취소주문 | POST | `/api/dostk/ordr` |

### 차트

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka10060](차트/ka10060-종목별투자자기관별차트요청.md) | 종목별투자자기관별차트요청 | POST | `/api/dostk/chart` |
| [ka10064](차트/ka10064-장중투자자별매매차트요청.md) | 장중투자자별매매차트요청 | POST | `/api/dostk/chart` |
| [ka10079](차트/ka10079-주식틱차트조회요청.md) | 주식틱차트조회요청 | POST | `/api/dostk/chart` |
| [ka10080](차트/ka10080-주식분봉차트조회요청.md) | 주식분봉차트조회요청 | POST | `/api/dostk/chart` |
| [ka10081](차트/ka10081-주식일봉차트조회요청.md) | 주식일봉차트조회요청 | POST | `/api/dostk/chart` |
| [ka10082](차트/ka10082-주식주봉차트조회요청.md) | 주식주봉차트조회요청 | POST | `/api/dostk/chart` |
| [ka10083](차트/ka10083-주식월봉차트조회요청.md) | 주식월봉차트조회요청 | POST | `/api/dostk/chart` |
| [ka10094](차트/ka10094-주식년봉차트조회요청.md) | 주식년봉차트조회요청 | POST | `/api/dostk/chart` |
| [ka20004](차트/ka20004-업종틱차트조회요청.md) | 업종틱차트조회요청 | POST | `/api/dostk/chart` |
| [ka20005](차트/ka20005-업종분봉조회요청.md) | 업종분봉조회요청 | POST | `/api/dostk/chart` |
| [ka20006](차트/ka20006-업종일봉조회요청.md) | 업종일봉조회요청 | POST | `/api/dostk/chart` |
| [ka20007](차트/ka20007-업종주봉조회요청.md) | 업종주봉조회요청 | POST | `/api/dostk/chart` |
| [ka20008](차트/ka20008-업종월봉조회요청.md) | 업종월봉조회요청 | POST | `/api/dostk/chart` |
| [ka20019](차트/ka20019-업종년봉조회요청.md) | 업종년봉조회요청 | POST | `/api/dostk/chart` |
| [ka50079](차트/ka50079-금현물틱차트조회요청.md) | 금현물틱차트조회요청 | POST | `/api/dostk/chart` |
| [ka50080](차트/ka50080-금현물분봉차트조회요청.md) | 금현물분봉차트조회요청 | POST | `/api/dostk/chart` |
| [ka50081](차트/ka50081-금현물일봉차트조회요청.md) | 금현물일봉차트조회요청 | POST | `/api/dostk/chart` |
| [ka50082](차트/ka50082-금현물주봉차트조회요청.md) | 금현물주봉차트조회요청 | POST | `/api/dostk/chart` |
| [ka50083](차트/ka50083-금현물월봉차트조회요청.md) | 금현물월봉차트조회요청 | POST | `/api/dostk/chart` |
| [ka50091](차트/ka50091-금현물당일틱차트조회요청.md) | 금현물당일틱차트조회요청 | POST | `/api/dostk/chart` |
| [ka50092](차트/ka50092-금현물당일분봉차트조회요청.md) | 금현물당일분봉차트조회요청 | POST | `/api/dostk/chart` |

### 테마

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka90001](테마/ka90001-테마그룹별요청.md) | 테마그룹별요청 | POST | `/api/dostk/thme` |
| [ka90002](테마/ka90002-테마구성종목요청.md) | 테마구성종목요청 | POST | `/api/dostk/thme` |

### ELW

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka10048](elw/ka10048-elw일별민감도지표요청.md) | ELW일별민감도지표요청 | POST | `/api/dostk/elw` |
| [ka10050](elw/ka10050-elw민감도지표요청.md) | ELW민감도지표요청 | POST | `/api/dostk/elw` |
| [ka30001](elw/ka30001-elw가격급등락요청.md) | ELW가격급등락요청 | POST | `/api/dostk/elw` |
| [ka30002](elw/ka30002-거래원별elw순매매상위요청.md) | 거래원별ELW순매매상위요청 | POST | `/api/dostk/elw` |
| [ka30003](elw/ka30003-elwlp보유일별추이요청.md) | ELWLP보유일별추이요청 | POST | `/api/dostk/elw` |
| [ka30004](elw/ka30004-elw괴리율요청.md) | ELW괴리율요청 | POST | `/api/dostk/elw` |
| [ka30005](elw/ka30005-elw조건검색요청.md) | ELW조건검색요청 | POST | `/api/dostk/elw` |
| [ka30009](elw/ka30009-elw등락율순위요청.md) | ELW등락율순위요청 | POST | `/api/dostk/elw` |
| [ka30010](elw/ka30010-elw잔량순위요청.md) | ELW잔량순위요청 | POST | `/api/dostk/elw` |
| [ka30011](elw/ka30011-elw근접율요청.md) | ELW근접율요청 | POST | `/api/dostk/elw` |
| [ka30012](elw/ka30012-elw종목상세정보요청.md) | ELW종목상세정보요청 | POST | `/api/dostk/elw` |

### ETF

| API ID | API 명 | Method | URL |
| --- | --- | --- | --- |
| [ka40001](etf/ka40001-etf수익율요청.md) | ETF수익율요청 | POST | `/api/dostk/etf` |
| [ka40002](etf/ka40002-etf종목정보요청.md) | ETF종목정보요청 | POST | `/api/dostk/etf` |
| [ka40003](etf/ka40003-etf일별추이요청.md) | ETF일별추이요청 | POST | `/api/dostk/etf` |
| [ka40004](etf/ka40004-etf전체시세요청.md) | ETF전체시세요청 | POST | `/api/dostk/etf` |
| [ka40006](etf/ka40006-etf시간대별추이요청.md) | ETF시간대별추이요청 | POST | `/api/dostk/etf` |
| [ka40007](etf/ka40007-etf시간대별체결요청.md) | ETF시간대별체결요청 | POST | `/api/dostk/etf` |
| [ka40008](etf/ka40008-etf일자별체결요청.md) | ETF일자별체결요청 | POST | `/api/dostk/etf` |
| [ka40009](etf/ka40009-etf시간대별nav현황.md) | ETF시간대별NAV현황 | POST | `/api/dostk/etf` |
| [ka40010](etf/ka40010-etf시간대별수급현황.md) | ETF시간대별수급현황 | POST | `/api/dostk/etf` |

