# 한국투자증권 Open API 레퍼런스

생성 시각: 2026-05-22T15:19:33.392Z

- 공식 출처: https://apiportal.koreainvestment.com/apiservice-summary
- 공식 샘플: https://github.com/koreainvestment/open-trading-api
- 카테고리 수: 22
- API path 수: 338
- 샘플 매핑 path 수: 273

## 카테고리

| 카테고리 | API path 수 |
| --- | ---: |
| OAuth인증 | 3 |
| [국내주식] 주문/계좌 | 23 |
| [국내주식] 기본시세 | 22 |
| [국내주식] ELW 시세 | 22 |
| [국내주식] 업종/기타 | 14 |
| [국내주식] 종목정보 | 26 |
| [국내주식] 시세분석 | 29 |
| [국내주식] 순위분석 | 22 |
| [국내주식] 실시간시세 | 29 |
| [국내선물옵션] 주문/계좌 | 15 |
| [국내선물옵션] 기본시세 | 9 |
| [국내선물옵션] 실시간시세 | 20 |
| [해외주식] 주문/계좌 | 18 |
| [해외주식] 기본시세 | 14 |
| [해외주식] 시세분석 | 15 |
| [해외주식] 실시간시세 | 4 |
| [해외선물옵션] 주문/계좌 | 11 |
| [해외선물옵션] 기본시세 | 20 |
| [해외선물옵션]실시간시세 | 4 |
| [장내채권] 주문/계좌 | 7 |
| [장내채권] 기본시세 | 8 |
| [장내채권] 실시간시세 | 3 |

## API path

### OAuth인증

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 접근토큰발급(P) | `/oauth2/tokenP` | - | [문서](oauth인증/접근토큰발급-p-oauth2-tokenp.md) |
| 접근토큰폐기(P) | `/oauth2/revokeP` | - | [문서](oauth인증/접근토큰폐기-p-oauth2-revokep.md) |
| 실시간 (웹소켓) 접속키 발급 | `/oauth2/Approval` | - | [문서](oauth인증/실시간-웹소켓-접속키-발급-oauth2-approval.md) |

### [국내주식] 주문/계좌

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 주식주문(현금) | `/uapi/domestic-stock/v1/trading/order-cash` | TTTC0011U, TTTC0012U, VTTC0011U, VTTC0012U | [문서](국내주식-주문-계좌/주식주문-현금-uapi-domestic-stock-v1-trading-order-cash.md) |
| 주식주문(신용) | `/uapi/domestic-stock/v1/trading/order-credit` | TTTC0052U, TTTC0051U | [문서](국내주식-주문-계좌/주식주문-신용-uapi-domestic-stock-v1-trading-order-credit.md) |
| 주식주문(정정취소) | `/uapi/domestic-stock/v1/trading/order-rvsecncl` | TTTC0013U, VTTC0013U | [문서](국내주식-주문-계좌/주식주문-정정취소-uapi-domestic-stock-v1-trading-order-rvsecncl.md) |
| 주식정정취소가능주문조회 | `/uapi/domestic-stock/v1/trading/inquire-psbl-rvsecncl` | TTTC0084R | [문서](국내주식-주문-계좌/주식정정취소가능주문조회-uapi-domestic-stock-v1-trading-inquire-psbl-rvsecncl.md) |
| 주식일별주문체결조회 | `/uapi/domestic-stock/v1/trading/inquire-daily-ccld` | CTSC9215R, TTTC0081R, VTSC9215R, VTTC0081R | [문서](국내주식-주문-계좌/주식일별주문체결조회-uapi-domestic-stock-v1-trading-inquire-daily-ccld.md) |
| 주식잔고조회 | `/uapi/domestic-stock/v1/trading/inquire-balance` | TTTC8434R, VTTC8434R | [문서](국내주식-주문-계좌/주식잔고조회-uapi-domestic-stock-v1-trading-inquire-balance.md) |
| 매수가능조회 | `/uapi/domestic-stock/v1/trading/inquire-psbl-order` | TTTC8908R, VTTC8908R | [문서](국내주식-주문-계좌/매수가능조회-uapi-domestic-stock-v1-trading-inquire-psbl-order.md) |
| 매도가능수량조회 | `/uapi/domestic-stock/v1/trading/inquire-psbl-sell` | TTTC8408R | [문서](국내주식-주문-계좌/매도가능수량조회-uapi-domestic-stock-v1-trading-inquire-psbl-sell.md) |
| 신용매수가능조회 | `/uapi/domestic-stock/v1/trading/inquire-credit-psamount` | TTTC8909R | [문서](국내주식-주문-계좌/신용매수가능조회-uapi-domestic-stock-v1-trading-inquire-credit-psamount.md) |
| 주식예약주문 | `/uapi/domestic-stock/v1/trading/order-resv` | CTSC0008U | [문서](국내주식-주문-계좌/주식예약주문-uapi-domestic-stock-v1-trading-order-resv.md) |
| 주식예약주문정정취소 | `/uapi/domestic-stock/v1/trading/order-resv-rvsecncl` | CTSC0009U, CTSC0013U | [문서](국내주식-주문-계좌/주식예약주문정정취소-uapi-domestic-stock-v1-trading-order-resv-rvsecncl.md) |
| 주식예약주문조회 | `/uapi/domestic-stock/v1/trading/order-resv-ccnl` | CTSC0004R | [문서](국내주식-주문-계좌/주식예약주문조회-uapi-domestic-stock-v1-trading-order-resv-ccnl.md) |
| 퇴직연금 체결기준잔고 | `/uapi/domestic-stock/v1/trading/pension/inquire-present-balance` | TTTC2202R | [문서](국내주식-주문-계좌/퇴직연금-체결기준잔고-uapi-domestic-stock-v1-trading-pension-inquire-present-balance.md) |
| 퇴직연금 미체결내역 | `/uapi/domestic-stock/v1/trading/pension/inquire-daily-ccld` | TTTC2201R | [문서](국내주식-주문-계좌/퇴직연금-미체결내역-uapi-domestic-stock-v1-trading-pension-inquire-daily-ccld.md) |
| 퇴직연금 매수가능조회 | `/uapi/domestic-stock/v1/trading/pension/inquire-psbl-order` | TTTC0503R | [문서](국내주식-주문-계좌/퇴직연금-매수가능조회-uapi-domestic-stock-v1-trading-pension-inquire-psbl-order.md) |
| 퇴직연금 예수금조회 | `/uapi/domestic-stock/v1/trading/pension/inquire-deposit` | TTTC0506R | [문서](국내주식-주문-계좌/퇴직연금-예수금조회-uapi-domestic-stock-v1-trading-pension-inquire-deposit.md) |
| 퇴직연금 잔고조회 | `/uapi/domestic-stock/v1/trading/pension/inquire-balance` | TTTC2208R | [문서](국내주식-주문-계좌/퇴직연금-잔고조회-uapi-domestic-stock-v1-trading-pension-inquire-balance.md) |
| 주식잔고조회_실현손익 | `/uapi/domestic-stock/v1/trading/inquire-balance-rlz-pl` | TTTC8494R | [문서](국내주식-주문-계좌/주식잔고조회_실현손익-uapi-domestic-stock-v1-trading-inquire-balance-rlz-pl.md) |
| 투자계좌자산현황조회 | `/uapi/domestic-stock/v1/trading/inquire-account-balance` | CTRP6548R | [문서](국내주식-주문-계좌/투자계좌자산현황조회-uapi-domestic-stock-v1-trading-inquire-account-balance.md) |
| 기간별손익일별합산조회 | `/uapi/domestic-stock/v1/trading/inquire-period-profit` | TTTC8708R | [문서](국내주식-주문-계좌/기간별손익일별합산조회-uapi-domestic-stock-v1-trading-inquire-period-profit.md) |
| 기간별매매손익현황조회 | `/uapi/domestic-stock/v1/trading/inquire-period-trade-profit` | TTTC8715R | [문서](국내주식-주문-계좌/기간별매매손익현황조회-uapi-domestic-stock-v1-trading-inquire-period-trade-profit.md) |
| 주식통합증거금 현황 | `/uapi/domestic-stock/v1/trading/intgr-margin` | TTTC0869R | [문서](국내주식-주문-계좌/주식통합증거금-현황-uapi-domestic-stock-v1-trading-intgr-margin.md) |
| 기간별계좌권리현황조회 | `/uapi/domestic-stock/v1/trading/period-rights` | CTRGA011R | [문서](국내주식-주문-계좌/기간별계좌권리현황조회-uapi-domestic-stock-v1-trading-period-rights.md) |

### [국내주식] 기본시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 주식현재가 시세 | `/uapi/domestic-stock/v1/quotations/inquire-price` | FHKST01010100 | [문서](국내주식-기본시세/주식현재가-시세-uapi-domestic-stock-v1-quotations-inquire-price.md) |
| 주식현재가 시세2 | `/uapi/domestic-stock/v1/quotations/inquire-price-2` | FHPST01010000 | [문서](국내주식-기본시세/주식현재가-시세2-uapi-domestic-stock-v1-quotations-inquire-price-2.md) |
| 주식현재가 체결 | `/uapi/domestic-stock/v1/quotations/inquire-ccnl` | FHKST01010300 | [문서](국내주식-기본시세/주식현재가-체결-uapi-domestic-stock-v1-quotations-inquire-ccnl.md) |
| 주식현재가 일자별 | `/uapi/domestic-stock/v1/quotations/inquire-daily-price` | FHKST01010400 | [문서](국내주식-기본시세/주식현재가-일자별-uapi-domestic-stock-v1-quotations-inquire-daily-price.md) |
| 주식현재가 호가/예상체결 | `/uapi/domestic-stock/v1/quotations/inquire-asking-price-exp-ccn` | FHKST01010200 | [문서](국내주식-기본시세/주식현재가-호가-예상체결-uapi-domestic-stock-v1-quotations-inquire-asking-price-exp-ccn.md) |
| 주식현재가 투자자 | `/uapi/domestic-stock/v1/quotations/inquire-investor` | FHKST01010900 | [문서](국내주식-기본시세/주식현재가-투자자-uapi-domestic-stock-v1-quotations-inquire-investor.md) |
| 주식현재가 회원사 | `/uapi/domestic-stock/v1/quotations/inquire-member` | FHKST01010600 | [문서](국내주식-기본시세/주식현재가-회원사-uapi-domestic-stock-v1-quotations-inquire-member.md) |
| 국내주식기간별시세(일/주/월/년) | `/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice` | FHKST03010100 | [문서](국내주식-기본시세/국내주식기간별시세-일-주-월-년-uapi-domestic-stock-v1-quotations-inquire-daily-itemchartprice.md) |
| 주식당일분봉조회 | `/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice` | FHKST03010200 | [문서](국내주식-기본시세/주식당일분봉조회-uapi-domestic-stock-v1-quotations-inquire-time-itemchartprice.md) |
| 주식일별분봉조회 | `/uapi/domestic-stock/v1/quotations/inquire-time-dailychartprice` | FHKST03010230 | [문서](국내주식-기본시세/주식일별분봉조회-uapi-domestic-stock-v1-quotations-inquire-time-dailychartprice.md) |
| 주식현재가 당일시간대별체결 | `/uapi/domestic-stock/v1/quotations/inquire-time-itemconclusion` | FHPST01060000 | [문서](국내주식-기본시세/주식현재가-당일시간대별체결-uapi-domestic-stock-v1-quotations-inquire-time-itemconclusion.md) |
| 주식현재가 시간외일자별주가 | `/uapi/domestic-stock/v1/quotations/inquire-daily-overtimeprice` | FHPST02320000 | [문서](국내주식-기본시세/주식현재가-시간외일자별주가-uapi-domestic-stock-v1-quotations-inquire-daily-overtimeprice.md) |
| 주식현재가 시간외시간별체결 | `/uapi/domestic-stock/v1/quotations/inquire-time-overtimeconclusion` | FHPST02310000 | [문서](국내주식-기본시세/주식현재가-시간외시간별체결-uapi-domestic-stock-v1-quotations-inquire-time-overtimeconclusion.md) |
| 국내주식 시간외현재가 | `/uapi/domestic-stock/v1/quotations/inquire-overtime-price` | FHPST02300000 | [문서](국내주식-기본시세/국내주식-시간외현재가-uapi-domestic-stock-v1-quotations-inquire-overtime-price.md) |
| 국내주식 시간외호가 | `/uapi/domestic-stock/v1/quotations/inquire-overtime-asking-price` | FHPST02300400 | [문서](국내주식-기본시세/국내주식-시간외호가-uapi-domestic-stock-v1-quotations-inquire-overtime-asking-price.md) |
| 국내주식 장마감 예상체결가 | `/uapi/domestic-stock/v1/quotations/exp-closing-price` | FHKST117300C0 | [문서](국내주식-기본시세/국내주식-장마감-예상체결가-uapi-domestic-stock-v1-quotations-exp-closing-price.md) |
| ETF/ETN 현재가 | `/uapi/etfetn/v1/quotations/inquire-price` | FHPST02400000 | [문서](국내주식-기본시세/etf-etn-현재가-uapi-etfetn-v1-quotations-inquire-price.md) |
| ETF 구성종목시세 | `/uapi/etfetn/v1/quotations/inquire-component-stock-price` | FHKST121600C0 | [문서](국내주식-기본시세/etf-구성종목시세-uapi-etfetn-v1-quotations-inquire-component-stock-price.md) |
| NAV 비교추이(종목) | `/uapi/etfetn/v1/quotations/nav-comparison-trend` | FHPST02440000 | [문서](국내주식-기본시세/nav-비교추이-종목-uapi-etfetn-v1-quotations-nav-comparison-trend.md) |
| NAV 비교추이(일) | `/uapi/etfetn/v1/quotations/nav-comparison-daily-trend` | FHPST02440200 | [문서](국내주식-기본시세/nav-비교추이-일-uapi-etfetn-v1-quotations-nav-comparison-daily-trend.md) |
| NAV 비교추이(분) | `/uapi/etfetn/v1/quotations/nav-comparison-time-trend` | FHPST02440100 | [문서](국내주식-기본시세/nav-비교추이-분-uapi-etfetn-v1-quotations-nav-comparison-time-trend.md) |
| ETF 현재가 호가 | `/uapi/etfetn/v1/quotations/inquire-asking-price` | - | [문서](국내주식-기본시세/etf-현재가-호가-uapi-etfetn-v1-quotations-inquire-asking-price.md) |

### [국내주식] ELW 시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| ELW 현재가 시세 | `/uapi/domestic-stock/v1/quotations/inquire-elw-price` | FHKEW15010000 | [문서](국내주식-elw-시세/elw-현재가-시세-uapi-domestic-stock-v1-quotations-inquire-elw-price.md) |
| ELW 신규상장종목 | `/uapi/elw/v1/quotations/newly-listed` | FHKEW154800C0 | [문서](국내주식-elw-시세/elw-신규상장종목-uapi-elw-v1-quotations-newly-listed.md) |
| ELW 민감도 순위 | `/uapi/elw/v1/ranking/sensitivity` | FHPEW02850000 | [문서](국내주식-elw-시세/elw-민감도-순위-uapi-elw-v1-ranking-sensitivity.md) |
| ELW 기초자산별 종목시세 | `/uapi/elw/v1/quotations/udrl-asset-price` | FHKEW154101C0 | [문서](국내주식-elw-시세/elw-기초자산별-종목시세-uapi-elw-v1-quotations-udrl-asset-price.md) |
| ELW 종목검색 | `/uapi/elw/v1/quotations/cond-search` | FHKEW15100000 | [문서](국내주식-elw-시세/elw-종목검색-uapi-elw-v1-quotations-cond-search.md) |
| ELW 당일급변종목 | `/uapi/elw/v1/ranking/quick-change` | FHPEW02870000 | [문서](국내주식-elw-시세/elw-당일급변종목-uapi-elw-v1-ranking-quick-change.md) |
| ELW 기초자산 목록조회 | `/uapi/elw/v1/quotations/udrl-asset-list` | FHKEW154100C0 | [문서](국내주식-elw-시세/elw-기초자산-목록조회-uapi-elw-v1-quotations-udrl-asset-list.md) |
| ELW 비교대상종목조회 | `/uapi/elw/v1/quotations/compare-stocks` | FHKEW151701C0 | [문서](국내주식-elw-시세/elw-비교대상종목조회-uapi-elw-v1-quotations-compare-stocks.md) |
| ELW LP매매추이 | `/uapi/elw/v1/quotations/lp-trade-trend` | FHPEW03760000 | [문서](국내주식-elw-시세/elw-lp매매추이-uapi-elw-v1-quotations-lp-trade-trend.md) |
| ELW 투자지표추이(체결) | `/uapi/elw/v1/quotations/indicator-trend-ccnl` | FHPEW02740100 | [문서](국내주식-elw-시세/elw-투자지표추이-체결-uapi-elw-v1-quotations-indicator-trend-ccnl.md) |
| ELW 투자지표추이(분별) | `/uapi/elw/v1/quotations/indicator-trend-minute` | FHPEW02740300 | [문서](국내주식-elw-시세/elw-투자지표추이-분별-uapi-elw-v1-quotations-indicator-trend-minute.md) |
| ELW 투자지표추이(일별) | `/uapi/elw/v1/quotations/indicator-trend-daily` | FHPEW02740200 | [문서](국내주식-elw-시세/elw-투자지표추이-일별-uapi-elw-v1-quotations-indicator-trend-daily.md) |
| ELW 변동성 추이(틱) | `/uapi/elw/v1/quotations/volatility-trend-tick` | FHPEW02840400 | [문서](국내주식-elw-시세/elw-변동성-추이-틱-uapi-elw-v1-quotations-volatility-trend-tick.md) |
| ELW 변동성추이(체결) | `/uapi/elw/v1/quotations/volatility-trend-ccnl` | FHPEW02840100 | [문서](국내주식-elw-시세/elw-변동성추이-체결-uapi-elw-v1-quotations-volatility-trend-ccnl.md) |
| ELW 변동성 추이(일별) | `/uapi/elw/v1/quotations/volatility-trend-daily` | FHPEW02840200 | [문서](국내주식-elw-시세/elw-변동성-추이-일별-uapi-elw-v1-quotations-volatility-trend-daily.md) |
| ELW 민감도 추이(체결) | `/uapi/elw/v1/quotations/sensitivity-trend-ccnl` | FHPEW02830100 | [문서](국내주식-elw-시세/elw-민감도-추이-체결-uapi-elw-v1-quotations-sensitivity-trend-ccnl.md) |
| ELW 변동성 추이(분별) | `/uapi/elw/v1/quotations/volatility-trend-minute` | FHPEW02840300 | [문서](국내주식-elw-시세/elw-변동성-추이-분별-uapi-elw-v1-quotations-volatility-trend-minute.md) |
| ELW 민감도 추이(일별) | `/uapi/elw/v1/quotations/sensitivity-trend-daily` | FHPEW02830200 | [문서](국내주식-elw-시세/elw-민감도-추이-일별-uapi-elw-v1-quotations-sensitivity-trend-daily.md) |
| ELW 만기예정/만기종목 | `/uapi/elw/v1/quotations/expiration-stocks` | FHKEW154700C0 | [문서](국내주식-elw-시세/elw-만기예정-만기종목-uapi-elw-v1-quotations-expiration-stocks.md) |
| ELW 지표순위 | `/uapi/elw/v1/ranking/indicator` | FHPEW02790000 | [문서](국내주식-elw-시세/elw-지표순위-uapi-elw-v1-ranking-indicator.md) |
| ELW 상승률순위 | `/uapi/elw/v1/ranking/updown-rate` | FHPEW02770000 | [문서](국내주식-elw-시세/elw-상승률순위-uapi-elw-v1-ranking-updown-rate.md) |
| ELW 거래량순위 | `/uapi/elw/v1/ranking/volume-rank` | FHPEW02780000 | [문서](국내주식-elw-시세/elw-거래량순위-uapi-elw-v1-ranking-volume-rank.md) |

### [국내주식] 업종/기타

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 국내업종 현재지수 | `/uapi/domestic-stock/v1/quotations/inquire-index-price` | FHPUP02100000 | [문서](국내주식-업종-기타/국내업종-현재지수-uapi-domestic-stock-v1-quotations-inquire-index-price.md) |
| 국내업종 일자별지수 | `/uapi/domestic-stock/v1/quotations/inquire-index-daily-price` | FHPUP02120000 | [문서](국내주식-업종-기타/국내업종-일자별지수-uapi-domestic-stock-v1-quotations-inquire-index-daily-price.md) |
| 국내업종 시간별지수(초) | `/uapi/domestic-stock/v1/quotations/inquire-index-tickprice` | FHPUP02110100 | [문서](국내주식-업종-기타/국내업종-시간별지수-초-uapi-domestic-stock-v1-quotations-inquire-index-tickprice.md) |
| 국내업종 시간별지수(분) | `/uapi/domestic-stock/v1/quotations/inquire-index-timeprice` | FHPUP02110200 | [문서](국내주식-업종-기타/국내업종-시간별지수-분-uapi-domestic-stock-v1-quotations-inquire-index-timeprice.md) |
| 업종 분봉조회 | `/uapi/domestic-stock/v1/quotations/inquire-time-indexchartprice` | FHKUP03500200 | [문서](국내주식-업종-기타/업종-분봉조회-uapi-domestic-stock-v1-quotations-inquire-time-indexchartprice.md) |
| 국내주식업종기간별시세(일/주/월/년) | `/uapi/domestic-stock/v1/quotations/inquire-daily-indexchartprice` | FHKUP03500100 | [문서](국내주식-업종-기타/국내주식업종기간별시세-일-주-월-년-uapi-domestic-stock-v1-quotations-inquire-daily-indexchartprice.md) |
| 국내업종 구분별전체시세 | `/uapi/domestic-stock/v1/quotations/inquire-index-category-price` | FHPUP02140000 | [문서](국내주식-업종-기타/국내업종-구분별전체시세-uapi-domestic-stock-v1-quotations-inquire-index-category-price.md) |
| 국내주식 예상체결지수 추이 | `/uapi/domestic-stock/v1/quotations/exp-index-trend` | FHPST01840000 | [문서](국내주식-업종-기타/국내주식-예상체결지수-추이-uapi-domestic-stock-v1-quotations-exp-index-trend.md) |
| 국내주식 예상체결 전체지수 | `/uapi/domestic-stock/v1/quotations/exp-total-index` | FHKUP11750000 | [문서](국내주식-업종-기타/국내주식-예상체결-전체지수-uapi-domestic-stock-v1-quotations-exp-total-index.md) |
| 변동성완화장치(VI) 현황 | `/uapi/domestic-stock/v1/quotations/inquire-vi-status` | FHPST01390000 | [문서](국내주식-업종-기타/변동성완화장치-vi-현황-uapi-domestic-stock-v1-quotations-inquire-vi-status.md) |
| 금리 종합(국내채권/금리) | `/uapi/domestic-stock/v1/quotations/comp-interest` | FHPST07020000 | [문서](국내주식-업종-기타/금리-종합-국내채권-금리-uapi-domestic-stock-v1-quotations-comp-interest.md) |
| 종합 시황/공시(제목) | `/uapi/domestic-stock/v1/quotations/news-title` | FHKST01011800 | [문서](국내주식-업종-기타/종합-시황-공시-제목-uapi-domestic-stock-v1-quotations-news-title.md) |
| 국내휴장일조회 | `/uapi/domestic-stock/v1/quotations/chk-holiday` | - | [문서](국내주식-업종-기타/국내휴장일조회-uapi-domestic-stock-v1-quotations-chk-holiday.md) |
| 국내선물 영업일조회 | `/uapi/domestic-stock/v1/quotations/market-time` | HHMCM000002C0 | [문서](국내주식-업종-기타/국내선물-영업일조회-uapi-domestic-stock-v1-quotations-market-time.md) |

### [국내주식] 종목정보

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 상품기본조회 | `/uapi/domestic-stock/v1/quotations/search-info` | CTPF1604R | [문서](국내주식-종목정보/상품기본조회-uapi-domestic-stock-v1-quotations-search-info.md) |
| 주식기본조회 | `/uapi/domestic-stock/v1/quotations/search-stock-info` | CTPF1002R | [문서](국내주식-종목정보/주식기본조회-uapi-domestic-stock-v1-quotations-search-stock-info.md) |
| 국내주식 대차대조표 | `/uapi/domestic-stock/v1/finance/balance-sheet` | FHKST66430100 | [문서](국내주식-종목정보/국내주식-대차대조표-uapi-domestic-stock-v1-finance-balance-sheet.md) |
| 국내주식 손익계산서 | `/uapi/domestic-stock/v1/finance/income-statement` | FHKST66430200 | [문서](국내주식-종목정보/국내주식-손익계산서-uapi-domestic-stock-v1-finance-income-statement.md) |
| 국내주식 재무비율 | `/uapi/domestic-stock/v1/finance/financial-ratio` | FHKST66430300 | [문서](국내주식-종목정보/국내주식-재무비율-uapi-domestic-stock-v1-finance-financial-ratio.md) |
| 국내주식 수익성비율 | `/uapi/domestic-stock/v1/finance/profit-ratio` | FHKST66430400 | [문서](국내주식-종목정보/국내주식-수익성비율-uapi-domestic-stock-v1-finance-profit-ratio.md) |
| 국내주식 기타주요비율 | `/uapi/domestic-stock/v1/finance/other-major-ratios` | FHKST66430500 | [문서](국내주식-종목정보/국내주식-기타주요비율-uapi-domestic-stock-v1-finance-other-major-ratios.md) |
| 국내주식 안정성비율 | `/uapi/domestic-stock/v1/finance/stability-ratio` | FHKST66430600 | [문서](국내주식-종목정보/국내주식-안정성비율-uapi-domestic-stock-v1-finance-stability-ratio.md) |
| 국내주식 성장성비율 | `/uapi/domestic-stock/v1/finance/growth-ratio` | FHKST66430800 | [문서](국내주식-종목정보/국내주식-성장성비율-uapi-domestic-stock-v1-finance-growth-ratio.md) |
| 국내주식 당사 신용가능종목 | `/uapi/domestic-stock/v1/quotations/credit-by-company` | FHPST04770000 | [문서](국내주식-종목정보/국내주식-당사-신용가능종목-uapi-domestic-stock-v1-quotations-credit-by-company.md) |
| 예탁원정보(배당일정) | `/uapi/domestic-stock/v1/ksdinfo/dividend` | HHKDB669102C0 | [문서](국내주식-종목정보/예탁원정보-배당일정-uapi-domestic-stock-v1-ksdinfo-dividend.md) |
| 예탁원정보(주식매수청구일정) | `/uapi/domestic-stock/v1/ksdinfo/purreq` | HHKDB669103C0 | [문서](국내주식-종목정보/예탁원정보-주식매수청구일정-uapi-domestic-stock-v1-ksdinfo-purreq.md) |
| 예탁원정보(합병/분할일정) | `/uapi/domestic-stock/v1/ksdinfo/merger-split` | HHKDB669104C0 | [문서](국내주식-종목정보/예탁원정보-합병-분할일정-uapi-domestic-stock-v1-ksdinfo-merger-split.md) |
| 예탁원정보(액면교체일정) | `/uapi/domestic-stock/v1/ksdinfo/rev-split` | HHKDB669105C0 | [문서](국내주식-종목정보/예탁원정보-액면교체일정-uapi-domestic-stock-v1-ksdinfo-rev-split.md) |
| 예탁원정보(자본감소일정) | `/uapi/domestic-stock/v1/ksdinfo/cap-dcrs` | HHKDB669106C0 | [문서](국내주식-종목정보/예탁원정보-자본감소일정-uapi-domestic-stock-v1-ksdinfo-cap-dcrs.md) |
| 예탁원정보(상장정보일정) | `/uapi/domestic-stock/v1/ksdinfo/list-info` | HHKDB669107C0 | [문서](국내주식-종목정보/예탁원정보-상장정보일정-uapi-domestic-stock-v1-ksdinfo-list-info.md) |
| 예탁원정보(공모주청약일정) | `/uapi/domestic-stock/v1/ksdinfo/pub-offer` | HHKDB669108C0 | [문서](국내주식-종목정보/예탁원정보-공모주청약일정-uapi-domestic-stock-v1-ksdinfo-pub-offer.md) |
| 예탁원정보(실권주일정) | `/uapi/domestic-stock/v1/ksdinfo/forfeit` | HHKDB669109C0 | [문서](국내주식-종목정보/예탁원정보-실권주일정-uapi-domestic-stock-v1-ksdinfo-forfeit.md) |
| 예탁원정보(의무예치일정) | `/uapi/domestic-stock/v1/ksdinfo/mand-deposit` | HHKDB669110C0 | [문서](국내주식-종목정보/예탁원정보-의무예치일정-uapi-domestic-stock-v1-ksdinfo-mand-deposit.md) |
| 예탁원정보(유상증자일정) | `/uapi/domestic-stock/v1/ksdinfo/paidin-capin` | HHKDB669100C0 | [문서](국내주식-종목정보/예탁원정보-유상증자일정-uapi-domestic-stock-v1-ksdinfo-paidin-capin.md) |
| 예탁원정보(무상증자일정) | `/uapi/domestic-stock/v1/ksdinfo/bonus-issue` | HHKDB669101C0 | [문서](국내주식-종목정보/예탁원정보-무상증자일정-uapi-domestic-stock-v1-ksdinfo-bonus-issue.md) |
| 예탁원정보(주주총회일정) | `/uapi/domestic-stock/v1/ksdinfo/sharehld-meet` | HHKDB669111C0 | [문서](국내주식-종목정보/예탁원정보-주주총회일정-uapi-domestic-stock-v1-ksdinfo-sharehld-meet.md) |
| 국내주식 종목추정실적 | `/uapi/domestic-stock/v1/quotations/estimate-perform` | HHKST668300C0 | [문서](국내주식-종목정보/국내주식-종목추정실적-uapi-domestic-stock-v1-quotations-estimate-perform.md) |
| 당사 대주가능 종목 | `/uapi/domestic-stock/v1/quotations/lendable-by-company` | CTSC2702R | [문서](국내주식-종목정보/당사-대주가능-종목-uapi-domestic-stock-v1-quotations-lendable-by-company.md) |
| 국내주식 종목투자의견 | `/uapi/domestic-stock/v1/quotations/invest-opinion` | FHKST663300C0 | [문서](국내주식-종목정보/국내주식-종목투자의견-uapi-domestic-stock-v1-quotations-invest-opinion.md) |
| 국내주식 증권사별 투자의견 | `/uapi/domestic-stock/v1/quotations/invest-opbysec` | FHKST663400C0 | [문서](국내주식-종목정보/국내주식-증권사별-투자의견-uapi-domestic-stock-v1-quotations-invest-opbysec.md) |

### [국내주식] 시세분석

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 종목조건검색 목록조회 | `/uapi/domestic-stock/v1/quotations/psearch-title` | HHKST03900300 | [문서](국내주식-시세분석/종목조건검색-목록조회-uapi-domestic-stock-v1-quotations-psearch-title.md) |
| 종목조건검색조회 | `/uapi/domestic-stock/v1/quotations/psearch-result` | HHKST03900400 | [문서](국내주식-시세분석/종목조건검색조회-uapi-domestic-stock-v1-quotations-psearch-result.md) |
| 관심종목 그룹조회 | `/uapi/domestic-stock/v1/quotations/intstock-grouplist` | HHKCM113004C7 | [문서](국내주식-시세분석/관심종목-그룹조회-uapi-domestic-stock-v1-quotations-intstock-grouplist.md) |
| 관심종목(멀티종목) 시세조회 | `/uapi/domestic-stock/v1/quotations/intstock-multprice` | FHKST11300006 | [문서](국내주식-시세분석/관심종목-멀티종목-시세조회-uapi-domestic-stock-v1-quotations-intstock-multprice.md) |
| 관심종목 그룹별 종목조회 | `/uapi/domestic-stock/v1/quotations/intstock-stocklist-by-group` | HHKCM113004C6 | [문서](국내주식-시세분석/관심종목-그룹별-종목조회-uapi-domestic-stock-v1-quotations-intstock-stocklist-by-group.md) |
| 국내기관_외국인 매매종목가집계 | `/uapi/domestic-stock/v1/quotations/foreign-institution-total` | FHPTJ04400000 | [문서](국내주식-시세분석/국내기관_외국인-매매종목가집계-uapi-domestic-stock-v1-quotations-foreign-institution-total.md) |
| 외국계 매매종목 가집계 | `/uapi/domestic-stock/v1/quotations/frgnmem-trade-estimate` | FHKST644100C0 | [문서](국내주식-시세분석/외국계-매매종목-가집계-uapi-domestic-stock-v1-quotations-frgnmem-trade-estimate.md) |
| 종목별 투자자매매동향(일별) | `/uapi/domestic-stock/v1/quotations/investor-trade-by-stock-daily` | FHPTJ04160001 | [문서](국내주식-시세분석/종목별-투자자매매동향-일별-uapi-domestic-stock-v1-quotations-investor-trade-by-stock-daily.md) |
| 시장별 투자자매매동향(시세) | `/uapi/domestic-stock/v1/quotations/inquire-investor-time-by-market` | FHPTJ04030000 | [문서](국내주식-시세분석/시장별-투자자매매동향-시세-uapi-domestic-stock-v1-quotations-inquire-investor-time-by-market.md) |
| 시장별 투자자매매동향(일별) | `/uapi/domestic-stock/v1/quotations/inquire-investor-daily-by-market` | FHPTJ04040000 | [문서](국내주식-시세분석/시장별-투자자매매동향-일별-uapi-domestic-stock-v1-quotations-inquire-investor-daily-by-market.md) |
| 종목별 외국계 순매수추이 | `/uapi/domestic-stock/v1/quotations/frgnmem-pchs-trend` | FHKST644400C0 | [문서](국내주식-시세분석/종목별-외국계-순매수추이-uapi-domestic-stock-v1-quotations-frgnmem-pchs-trend.md) |
| 회원사 실시간 매매동향(틱) | `/uapi/domestic-stock/v1/quotations/frgnmem-trade-trend` | FHPST04320000 | [문서](국내주식-시세분석/회원사-실시간-매매동향-틱-uapi-domestic-stock-v1-quotations-frgnmem-trade-trend.md) |
| 주식현재가 회원사 종목매매동향 | `/uapi/domestic-stock/v1/quotations/inquire-member-daily` | FHPST04540000 | [문서](국내주식-시세분석/주식현재가-회원사-종목매매동향-uapi-domestic-stock-v1-quotations-inquire-member-daily.md) |
| 종목별 프로그램매매추이(체결) | `/uapi/domestic-stock/v1/quotations/program-trade-by-stock` | FHPPG04650101 | [문서](국내주식-시세분석/종목별-프로그램매매추이-체결-uapi-domestic-stock-v1-quotations-program-trade-by-stock.md) |
| 종목별 프로그램매매추이(일별) | `/uapi/domestic-stock/v1/quotations/program-trade-by-stock-daily` | FHPPG04650201 | [문서](국내주식-시세분석/종목별-프로그램매매추이-일별-uapi-domestic-stock-v1-quotations-program-trade-by-stock-daily.md) |
| 종목별 외인기관 추정가집계 | `/uapi/domestic-stock/v1/quotations/investor-trend-estimate` | HHPTJ04160200 | [문서](국내주식-시세분석/종목별-외인기관-추정가집계-uapi-domestic-stock-v1-quotations-investor-trend-estimate.md) |
| 종목별일별매수매도체결량 | `/uapi/domestic-stock/v1/quotations/inquire-daily-trade-volume` | FHKST03010800 | [문서](국내주식-시세분석/종목별일별매수매도체결량-uapi-domestic-stock-v1-quotations-inquire-daily-trade-volume.md) |
| 프로그램매매 종합현황(시간) | `/uapi/domestic-stock/v1/quotations/comp-program-trade-today` | FHPPG04600101 | [문서](국내주식-시세분석/프로그램매매-종합현황-시간-uapi-domestic-stock-v1-quotations-comp-program-trade-today.md) |
| 프로그램매매 종합현황(일별) | `/uapi/domestic-stock/v1/quotations/comp-program-trade-daily` | FHPPG04600001 | [문서](국내주식-시세분석/프로그램매매-종합현황-일별-uapi-domestic-stock-v1-quotations-comp-program-trade-daily.md) |
| 프로그램매매 투자자매매동향(당일) | `/uapi/domestic-stock/v1/quotations/investor-program-trade-today` | HHPPG046600C1 | [문서](국내주식-시세분석/프로그램매매-투자자매매동향-당일-uapi-domestic-stock-v1-quotations-investor-program-trade-today.md) |
| 국내주식 신용잔고 일별추이 | `/uapi/domestic-stock/v1/quotations/daily-credit-balance` | FHPST04760000 | [문서](국내주식-시세분석/국내주식-신용잔고-일별추이-uapi-domestic-stock-v1-quotations-daily-credit-balance.md) |
| 국내주식 예상체결가 추이 | `/uapi/domestic-stock/v1/quotations/exp-price-trend` | FHPST01810000 | [문서](국내주식-시세분석/국내주식-예상체결가-추이-uapi-domestic-stock-v1-quotations-exp-price-trend.md) |
| 국내주식 공매도 일별추이 | `/uapi/domestic-stock/v1/quotations/daily-short-sale` | FHPST04830000 | [문서](국내주식-시세분석/국내주식-공매도-일별추이-uapi-domestic-stock-v1-quotations-daily-short-sale.md) |
| 국내주식 시간외예상체결등락률 | `/uapi/domestic-stock/v1/ranking/overtime-exp-trans-fluct` | FHKST11860000 | [문서](국내주식-시세분석/국내주식-시간외예상체결등락률-uapi-domestic-stock-v1-ranking-overtime-exp-trans-fluct.md) |
| 국내주식 체결금액별 매매비중 | `/uapi/domestic-stock/v1/quotations/tradprt-byamt` | FHKST111900C0 | [문서](국내주식-시세분석/국내주식-체결금액별-매매비중-uapi-domestic-stock-v1-quotations-tradprt-byamt.md) |
| 국내 증시자금 종합 | `/uapi/domestic-stock/v1/quotations/mktfunds` | FHKST649100C0 | [문서](국내주식-시세분석/국내-증시자금-종합-uapi-domestic-stock-v1-quotations-mktfunds.md) |
| 종목별 일별 대차거래추이 | `/uapi/domestic-stock/v1/quotations/daily-loan-trans` | HHPST074500C0 | [문서](국내주식-시세분석/종목별-일별-대차거래추이-uapi-domestic-stock-v1-quotations-daily-loan-trans.md) |
| 국내주식 상하한가 포착 | `/uapi/domestic-stock/v1/quotations/capture-uplowprice` | FHKST130000C0 | [문서](국내주식-시세분석/국내주식-상하한가-포착-uapi-domestic-stock-v1-quotations-capture-uplowprice.md) |
| 국내주식 매물대/거래비중 | `/uapi/domestic-stock/v1/quotations/pbar-tratio` | FHPST01130000 | [문서](국내주식-시세분석/국내주식-매물대-거래비중-uapi-domestic-stock-v1-quotations-pbar-tratio.md) |

### [국내주식] 순위분석

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 거래량순위 | `/uapi/domestic-stock/v1/quotations/volume-rank` | FHPST01710000 | [문서](국내주식-순위분석/거래량순위-uapi-domestic-stock-v1-quotations-volume-rank.md) |
| 국내주식 등락률 순위 | `/uapi/domestic-stock/v1/ranking/fluctuation` | FHPST01700000 | [문서](국내주식-순위분석/국내주식-등락률-순위-uapi-domestic-stock-v1-ranking-fluctuation.md) |
| 국내주식 호가잔량 순위 | `/uapi/domestic-stock/v1/ranking/quote-balance` | FHPST01720000 | [문서](국내주식-순위분석/국내주식-호가잔량-순위-uapi-domestic-stock-v1-ranking-quote-balance.md) |
| 국내주식 수익자산지표 순위 | `/uapi/domestic-stock/v1/ranking/profit-asset-index` | FHPST01730000 | [문서](국내주식-순위분석/국내주식-수익자산지표-순위-uapi-domestic-stock-v1-ranking-profit-asset-index.md) |
| 국내주식 시가총액 상위 | `/uapi/domestic-stock/v1/ranking/market-cap` | FHPST01740000 | [문서](국내주식-순위분석/국내주식-시가총액-상위-uapi-domestic-stock-v1-ranking-market-cap.md) |
| 국내주식 재무비율 순위 | `/uapi/domestic-stock/v1/ranking/finance-ratio` | FHPST01750000 | [문서](국내주식-순위분석/국내주식-재무비율-순위-uapi-domestic-stock-v1-ranking-finance-ratio.md) |
| 국내주식 시간외잔량 순위 | `/uapi/domestic-stock/v1/ranking/after-hour-balance` | FHPST01760000 | [문서](국내주식-순위분석/국내주식-시간외잔량-순위-uapi-domestic-stock-v1-ranking-after-hour-balance.md) |
| 국내주식 우선주/괴리율 상위 | `/uapi/domestic-stock/v1/ranking/prefer-disparate-ratio` | FHPST01770000 | [문서](국내주식-순위분석/국내주식-우선주-괴리율-상위-uapi-domestic-stock-v1-ranking-prefer-disparate-ratio.md) |
| 국내주식 이격도 순위 | `/uapi/domestic-stock/v1/ranking/disparity` | FHPST01780000 | [문서](국내주식-순위분석/국내주식-이격도-순위-uapi-domestic-stock-v1-ranking-disparity.md) |
| 국내주식 시장가치 순위 | `/uapi/domestic-stock/v1/ranking/market-value` | FHPST01790000 | [문서](국내주식-순위분석/국내주식-시장가치-순위-uapi-domestic-stock-v1-ranking-market-value.md) |
| 국내주식 체결강도 상위 | `/uapi/domestic-stock/v1/ranking/volume-power` | FHPST01680000 | [문서](국내주식-순위분석/국내주식-체결강도-상위-uapi-domestic-stock-v1-ranking-volume-power.md) |
| 국내주식 관심종목등록 상위 | `/uapi/domestic-stock/v1/ranking/top-interest-stock` | FHPST01800000 | [문서](국내주식-순위분석/국내주식-관심종목등록-상위-uapi-domestic-stock-v1-ranking-top-interest-stock.md) |
| 국내주식 예상체결 상승/하락상위 | `/uapi/domestic-stock/v1/ranking/exp-trans-updown` | FHPST01820000 | [문서](국내주식-순위분석/국내주식-예상체결-상승-하락상위-uapi-domestic-stock-v1-ranking-exp-trans-updown.md) |
| 국내주식 당사매매종목 상위 | `/uapi/domestic-stock/v1/ranking/traded-by-company` | FHPST01860000 | [문서](국내주식-순위분석/국내주식-당사매매종목-상위-uapi-domestic-stock-v1-ranking-traded-by-company.md) |
| 국내주식 신고/신저근접종목 상위 | `/uapi/domestic-stock/v1/ranking/near-new-highlow` | FHPST01870000 | [문서](국내주식-순위분석/국내주식-신고-신저근접종목-상위-uapi-domestic-stock-v1-ranking-near-new-highlow.md) |
| 국내주식 배당률 상위 | `/uapi/domestic-stock/v1/ranking/dividend-rate` | HHKDB13470100 | [문서](국내주식-순위분석/국내주식-배당률-상위-uapi-domestic-stock-v1-ranking-dividend-rate.md) |
| 국내주식 대량체결건수 상위 | `/uapi/domestic-stock/v1/ranking/bulk-trans-num` | FHKST190900C0 | [문서](국내주식-순위분석/국내주식-대량체결건수-상위-uapi-domestic-stock-v1-ranking-bulk-trans-num.md) |
| 국내주식 신용잔고 상위 | `/uapi/domestic-stock/v1/ranking/credit-balance` | FHKST17010000 | [문서](국내주식-순위분석/국내주식-신용잔고-상위-uapi-domestic-stock-v1-ranking-credit-balance.md) |
| 국내주식 공매도 상위종목 | `/uapi/domestic-stock/v1/ranking/short-sale` | FHPST04820000 | [문서](국내주식-순위분석/국내주식-공매도-상위종목-uapi-domestic-stock-v1-ranking-short-sale.md) |
| 국내주식 시간외등락율순위 | `/uapi/domestic-stock/v1/ranking/overtime-fluctuation` | FHPST02340000 | [문서](국내주식-순위분석/국내주식-시간외등락율순위-uapi-domestic-stock-v1-ranking-overtime-fluctuation.md) |
| 국내주식 시간외거래량순위 | `/uapi/domestic-stock/v1/ranking/overtime-volume` | FHPST02350000 | [문서](국내주식-순위분석/국내주식-시간외거래량순위-uapi-domestic-stock-v1-ranking-overtime-volume.md) |
| HTS조회상위20종목 | `/uapi/domestic-stock/v1/ranking/hts-top-view` | HHMCM000100C0 | [문서](국내주식-순위분석/hts조회상위20종목-uapi-domestic-stock-v1-ranking-hts-top-view.md) |

### [국내주식] 실시간시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 국내주식 실시간체결가 (KRX) | `/tryitout/H0STCNT0` | - | [문서](국내주식-실시간시세/국내주식-실시간체결가-krx-tryitout-h0stcnt0.md) |
| 국내주식 실시간호가 (KRX) | `/tryitout/H0STASP0` | - | [문서](국내주식-실시간시세/국내주식-실시간호가-krx-tryitout-h0stasp0.md) |
| 국내주식 실시간체결통보 | `/tryitout/H0STCNI0` | - | [문서](국내주식-실시간시세/국내주식-실시간체결통보-tryitout-h0stcni0.md) |
| 국내주식 실시간예상체결 (KRX) | `/tryitout/H0STANC0` | - | [문서](국내주식-실시간시세/국내주식-실시간예상체결-krx-tryitout-h0stanc0.md) |
| 국내주식 실시간회원사 (KRX) | `/tryitout/H0STMBC0` | - | [문서](국내주식-실시간시세/국내주식-실시간회원사-krx-tryitout-h0stmbc0.md) |
| 국내주식 실시간프로그램매매 (KRX) | `/tryitout/H0STPGM0` | - | [문서](국내주식-실시간시세/국내주식-실시간프로그램매매-krx-tryitout-h0stpgm0.md) |
| 국내주식 장운영정보 (KRX) | `/tryitout/H0STMKO0` | - | [문서](국내주식-실시간시세/국내주식-장운영정보-krx-tryitout-h0stmko0.md) |
| 국내주식 시간외 실시간호가 (KRX) | `/tryitout/H0STOAA0` | - | [문서](국내주식-실시간시세/국내주식-시간외-실시간호가-krx-tryitout-h0stoaa0.md) |
| 국내주식 시간외 실시간체결가 (KRX) | `/tryitout/H0STOUP0` | - | [문서](국내주식-실시간시세/국내주식-시간외-실시간체결가-krx-tryitout-h0stoup0.md) |
| 국내주식 시간외 실시간예상체결 (KRX) | `/tryitout/H0STOAC0` | - | [문서](국내주식-실시간시세/국내주식-시간외-실시간예상체결-krx-tryitout-h0stoac0.md) |
| 국내지수 실시간체결 | `/tryitout/H0UPCNT0` | - | [문서](국내주식-실시간시세/국내지수-실시간체결-tryitout-h0upcnt0.md) |
| 국내지수 실시간예상체결 | `/tryitout/H0UPANC0` | - | [문서](국내주식-실시간시세/국내지수-실시간예상체결-tryitout-h0upanc0.md) |
| 국내지수 실시간프로그램매매 | `/tryitout/H0UPPGM0` | - | [문서](국내주식-실시간시세/국내지수-실시간프로그램매매-tryitout-h0uppgm0.md) |
| ELW 실시간호가 | `/tryitout/H0EWASP0` | - | [문서](국내주식-실시간시세/elw-실시간호가-tryitout-h0ewasp0.md) |
| ELW 실시간체결가 | `/tryitout/H0EWCNT0` | - | [문서](국내주식-실시간시세/elw-실시간체결가-tryitout-h0ewcnt0.md) |
| ELW 실시간예상체결 | `/tryitout/H0EWANC0` | - | [문서](국내주식-실시간시세/elw-실시간예상체결-tryitout-h0ewanc0.md) |
| 국내ETF NAV추이 | `/tryitout/H0STNAV0` | - | [문서](국내주식-실시간시세/국내etf-nav추이-tryitout-h0stnav0.md) |
| 국내주식 실시간체결가 (통합) | `/tryitout/H0UNCNT0` | - | [문서](국내주식-실시간시세/국내주식-실시간체결가-통합-tryitout-h0uncnt0.md) |
| 국내주식 실시간호가 (통합) | `/tryitout/H0UNASP0` | - | [문서](국내주식-실시간시세/국내주식-실시간호가-통합-tryitout-h0unasp0.md) |
| 국내주식 실시간예상체결 (통합) | `/tryitout/H0UNANC0` | - | [문서](국내주식-실시간시세/국내주식-실시간예상체결-통합-tryitout-h0unanc0.md) |
| 국내주식 실시간회원사 (통합) | `/tryitout/H0UNMBC0` | - | [문서](국내주식-실시간시세/국내주식-실시간회원사-통합-tryitout-h0unmbc0.md) |
| 국내주식 실시간프로그램매매 (통합) | `/tryitout/H0UNPGM0` | - | [문서](국내주식-실시간시세/국내주식-실시간프로그램매매-통합-tryitout-h0unpgm0.md) |
| 국내주식 장운영정보 (통합) | `/tryitout/H0UNMKO0` | - | [문서](국내주식-실시간시세/국내주식-장운영정보-통합-tryitout-h0unmko0.md) |
| 국내주식 실시간체결가 (NXT) | `/tryitout/H0NXCNT0` | - | [문서](국내주식-실시간시세/국내주식-실시간체결가-nxt-tryitout-h0nxcnt0.md) |
| 국내주식 실시간호가 (NXT) | `/tryitout/H0NXASP0` | - | [문서](국내주식-실시간시세/국내주식-실시간호가-nxt-tryitout-h0nxasp0.md) |
| 국내주식 실시간예상체결 (NXT) | `/tryitout/H0NXANC0` | - | [문서](국내주식-실시간시세/국내주식-실시간예상체결-nxt-tryitout-h0nxanc0.md) |
| 국내주식 실시간회원사 (NXT) | `/tryitout/H0NXMBC0` | - | [문서](국내주식-실시간시세/국내주식-실시간회원사-nxt-tryitout-h0nxmbc0.md) |
| 국내주식 실시간프로그램매매 (NXT) | `/tryitout/H0NXPGM0` | - | [문서](국내주식-실시간시세/국내주식-실시간프로그램매매-nxt-tryitout-h0nxpgm0.md) |
| 국내주식 장운영정보 (NXT) | `/tryitout/H0NXMKO0` | - | [문서](국내주식-실시간시세/국내주식-장운영정보-nxt-tryitout-h0nxmko0.md) |

### [국내선물옵션] 주문/계좌

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 선물옵션 주문 | `/uapi/domestic-futureoption/v1/trading/order` | TTTO1101U, STTN1101U, VTTO1101U | [문서](국내선물옵션-주문-계좌/선물옵션-주문-uapi-domestic-futureoption-v1-trading-order.md) |
| 선물옵션 정정취소주문 | `/uapi/domestic-futureoption/v1/trading/order-rvsecncl` | TTTO1103U, TTTN1103U, VTTO1103U | [문서](국내선물옵션-주문-계좌/선물옵션-정정취소주문-uapi-domestic-futureoption-v1-trading-order-rvsecncl.md) |
| 선물옵션 주문체결내역조회 | `/uapi/domestic-futureoption/v1/trading/inquire-ccnl` | TTTO5201R, VTTO5201R | [문서](국내선물옵션-주문-계좌/선물옵션-주문체결내역조회-uapi-domestic-futureoption-v1-trading-inquire-ccnl.md) |
| 선물옵션 잔고현황 | `/uapi/domestic-futureoption/v1/trading/inquire-balance` | CTFO6118R, VTFO6118R | [문서](국내선물옵션-주문-계좌/선물옵션-잔고현황-uapi-domestic-futureoption-v1-trading-inquire-balance.md) |
| 선물옵션 주문가능 | `/uapi/domestic-futureoption/v1/trading/inquire-psbl-order` | TTTO5105R, VTTO5105R | [문서](국내선물옵션-주문-계좌/선물옵션-주문가능-uapi-domestic-futureoption-v1-trading-inquire-psbl-order.md) |
| (야간)선물옵션 주문체결 내역조회 | `/uapi/domestic-futureoption/v1/trading/inquire-ngt-ccnl` | STTN5201R | [문서](국내선물옵션-주문-계좌/야간-선물옵션-주문체결-내역조회-uapi-domestic-futureoption-v1-trading-inquire-ngt-ccnl.md) |
| (야간)선물옵션 잔고현황 | `/uapi/domestic-futureoption/v1/trading/inquire-ngt-balance` | CTFN6118R | [문서](국내선물옵션-주문-계좌/야간-선물옵션-잔고현황-uapi-domestic-futureoption-v1-trading-inquire-ngt-balance.md) |
| (야간)선물옵션 주문가능 조회 | `/uapi/domestic-futureoption/v1/trading/inquire-psbl-ngt-order` | STTN5105R | [문서](국내선물옵션-주문-계좌/야간-선물옵션-주문가능-조회-uapi-domestic-futureoption-v1-trading-inquire-psbl-ngt-order.md) |
| (야간)선물옵션 증거금 상세 | `/uapi/domestic-futureoption/v1/trading/ngt-margin-detail` | CTFN7107R | [문서](국내선물옵션-주문-계좌/야간-선물옵션-증거금-상세-uapi-domestic-futureoption-v1-trading-ngt-margin-detail.md) |
| 선물옵션 잔고정산손익내역 | `/uapi/domestic-futureoption/v1/trading/inquire-balance-settlement-pl` | CTFO6117R | [문서](국내선물옵션-주문-계좌/선물옵션-잔고정산손익내역-uapi-domestic-futureoption-v1-trading-inquire-balance-settlement-pl.md) |
| 선물옵션 총자산현황 | `/uapi/domestic-futureoption/v1/trading/inquire-deposit` | CTRP6550R | [문서](국내선물옵션-주문-계좌/선물옵션-총자산현황-uapi-domestic-futureoption-v1-trading-inquire-deposit.md) |
| 선물옵션 잔고평가손익내역 | `/uapi/domestic-futureoption/v1/trading/inquire-balance-valuation-pl` | CTFO6159R | [문서](국내선물옵션-주문-계좌/선물옵션-잔고평가손익내역-uapi-domestic-futureoption-v1-trading-inquire-balance-valuation-pl.md) |
| 선물옵션 기준일체결내역 | `/uapi/domestic-futureoption/v1/trading/inquire-ccnl-bstime` | CTFO5139R | [문서](국내선물옵션-주문-계좌/선물옵션-기준일체결내역-uapi-domestic-futureoption-v1-trading-inquire-ccnl-bstime.md) |
| 선물옵션기간약정수수료일별 | `/uapi/domestic-futureoption/v1/trading/inquire-daily-amount-fee` | CTFO6119R | [문서](국내선물옵션-주문-계좌/선물옵션기간약정수수료일별-uapi-domestic-futureoption-v1-trading-inquire-daily-amount-fee.md) |
| 선물옵션 증거금률 | `/uapi/domestic-futureoption/v1/quotations/margin-rate` | - | [문서](국내선물옵션-주문-계좌/선물옵션-증거금률-uapi-domestic-futureoption-v1-quotations-margin-rate.md) |

### [국내선물옵션] 기본시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 선물옵션 시세 | `/uapi/domestic-futureoption/v1/quotations/inquire-price` | FHMIF10000000 | [문서](국내선물옵션-기본시세/선물옵션-시세-uapi-domestic-futureoption-v1-quotations-inquire-price.md) |
| 선물옵션 시세호가 | `/uapi/domestic-futureoption/v1/quotations/inquire-asking-price` | FHMIF10010000 | [문서](국내선물옵션-기본시세/선물옵션-시세호가-uapi-domestic-futureoption-v1-quotations-inquire-asking-price.md) |
| 선물옵션기간별시세(일/주/월/년) | `/uapi/domestic-futureoption/v1/quotations/inquire-daily-fuopchartprice` | FHKIF03020100 | [문서](국내선물옵션-기본시세/선물옵션기간별시세-일-주-월-년-uapi-domestic-futureoption-v1-quotations-inquire-daily-fuopchartprice.md) |
| 선물옵션 분봉조회 | `/uapi/domestic-futureoption/v1/quotations/inquire-time-fuopchartprice` | FHKIF03020200 | [문서](국내선물옵션-기본시세/선물옵션-분봉조회-uapi-domestic-futureoption-v1-quotations-inquire-time-fuopchartprice.md) |
| 국내옵션전광판_옵션월물리스트 | `/uapi/domestic-futureoption/v1/quotations/display-board-option-list` | FHPIO056104C0 | [문서](국내선물옵션-기본시세/국내옵션전광판_옵션월물리스트-uapi-domestic-futureoption-v1-quotations-display-board-option-list.md) |
| 국내선물 기초자산 시세 | `/uapi/domestic-futureoption/v1/quotations/display-board-top` | FHPIF05030000 | [문서](국내선물옵션-기본시세/국내선물-기초자산-시세-uapi-domestic-futureoption-v1-quotations-display-board-top.md) |
| 국내옵션전광판_콜풋 | `/uapi/domestic-futureoption/v1/quotations/display-board-callput` | FHPIF05030100 | [문서](국내선물옵션-기본시세/국내옵션전광판_콜풋-uapi-domestic-futureoption-v1-quotations-display-board-callput.md) |
| 국내옵션전광판_선물 | `/uapi/domestic-futureoption/v1/quotations/display-board-futures` | FHPIF05030200 | [문서](국내선물옵션-기본시세/국내옵션전광판_선물-uapi-domestic-futureoption-v1-quotations-display-board-futures.md) |
| 선물옵션 일중예상체결추이 | `/uapi/domestic-futureoption/v1/quotations/exp-price-trend` | FHPIF05110100 | [문서](국내선물옵션-기본시세/선물옵션-일중예상체결추이-uapi-domestic-futureoption-v1-quotations-exp-price-trend.md) |

### [국내선물옵션] 실시간시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 지수선물 실시간호가 | `/tryitout/H0IFASP0` | - | [문서](국내선물옵션-실시간시세/지수선물-실시간호가-tryitout-h0ifasp0.md) |
| 지수선물 실시간체결가 | `/tryitout/H0IFCNT0` | - | [문서](국내선물옵션-실시간시세/지수선물-실시간체결가-tryitout-h0ifcnt0.md) |
| 지수옵션 실시간호가 | `/tryitout/H0IOASP0` | - | [문서](국내선물옵션-실시간시세/지수옵션-실시간호가-tryitout-h0ioasp0.md) |
| 지수옵션  실시간체결가 | `/tryitout/H0IOCNT0` | - | [문서](국내선물옵션-실시간시세/지수옵션-실시간체결가-tryitout-h0iocnt0.md) |
| 선물옵션 실시간체결통보 | `/tryitout/H0IFCNI0` | - | [문서](국내선물옵션-실시간시세/선물옵션-실시간체결통보-tryitout-h0ifcni0.md) |
| 상품선물 실시간호가 | `/tryitout/H0CFASP0` | - | [문서](국내선물옵션-실시간시세/상품선물-실시간호가-tryitout-h0cfasp0.md) |
| 상품선물 실시간체결가 | `/tryitout/H0CFCNT0` | - | [문서](국내선물옵션-실시간시세/상품선물-실시간체결가-tryitout-h0cfcnt0.md) |
| 주식선물 실시간호가 | `/tryitout/H0ZFASP0` | - | [문서](국내선물옵션-실시간시세/주식선물-실시간호가-tryitout-h0zfasp0.md) |
| 주식선물 실시간체결가 | `/tryitout/H0ZFCNT0` | - | [문서](국내선물옵션-실시간시세/주식선물-실시간체결가-tryitout-h0zfcnt0.md) |
| 주식선물 실시간예상체결 | `/tryitout/H0ZFANC0` | - | [문서](국내선물옵션-실시간시세/주식선물-실시간예상체결-tryitout-h0zfanc0.md) |
| 주식옵션 실시간호가 | `/tryitout/H0ZOASP0` | - | [문서](국내선물옵션-실시간시세/주식옵션-실시간호가-tryitout-h0zoasp0.md) |
| 주식옵션 실시간체결가 | `/tryitout/H0ZOCNT0` | - | [문서](국내선물옵션-실시간시세/주식옵션-실시간체결가-tryitout-h0zocnt0.md) |
| 주식옵션 실시간예상체결 | `/tryitout/H0ZOANC0` | - | [문서](국내선물옵션-실시간시세/주식옵션-실시간예상체결-tryitout-h0zoanc0.md) |
| KRX야간옵션 실시간호가 | `/tryitout/H0EUASP0` | - | [문서](국내선물옵션-실시간시세/krx야간옵션-실시간호가-tryitout-h0euasp0.md) |
| KRX야간옵션 실시간체결가 | `/tryitout/H0EUCNT0` | - | [문서](국내선물옵션-실시간시세/krx야간옵션-실시간체결가-tryitout-h0eucnt0.md) |
| KRX야간옵션실시간예상체결 | `/tryitout/H0EUANC0` | - | [문서](국내선물옵션-실시간시세/krx야간옵션실시간예상체결-tryitout-h0euanc0.md) |
| KRX야간옵션실시간체결통보 | `/tryitout/H0EUCNI0` | - | [문서](국내선물옵션-실시간시세/krx야간옵션실시간체결통보-tryitout-h0eucni0.md) |
| KRX야간선물 실시간호가 | `/tryitout/H0MFASP0` | - | [문서](국내선물옵션-실시간시세/krx야간선물-실시간호가-tryitout-h0mfasp0.md) |
| KRX야간선물 실시간종목체결 | `/tryitout/H0MFCNT0` | - | [문서](국내선물옵션-실시간시세/krx야간선물-실시간종목체결-tryitout-h0mfcnt0.md) |
| KRX야간선물 실시간체결통보 | `/tryitout/H0MFCNI0` | - | [문서](국내선물옵션-실시간시세/krx야간선물-실시간체결통보-tryitout-h0mfcni0.md) |

### [해외주식] 주문/계좌

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 해외주식 주문 | `/uapi/overseas-stock/v1/trading/order` | TTTT1002U, TTTS1002U, TTTS0202U, TTTS0305U, TTTS0308U, TTTS0311U, TTTT1006U, TTTS1001U, TTTS1005U, TTTS0304U, TTTS0307U, TTTS0310U, V | [문서](해외주식-주문-계좌/해외주식-주문-uapi-overseas-stock-v1-trading-order.md) |
| 해외주식 정정취소주문 | `/uapi/overseas-stock/v1/trading/order-rvsecncl` | TTTT1004U, VTTT1004U | [문서](해외주식-주문-계좌/해외주식-정정취소주문-uapi-overseas-stock-v1-trading-order-rvsecncl.md) |
| 해외주식 예약주문접수 | `/uapi/overseas-stock/v1/trading/order-resv` | TTTT3014U, TTTT3016U, TTTS3013U, VTTT3014U, VTTT3016U, VTTS3013U | [문서](해외주식-주문-계좌/해외주식-예약주문접수-uapi-overseas-stock-v1-trading-order-resv.md) |
| 해외주식 예약주문접수취소 | `/uapi/overseas-stock/v1/trading/order-resv-ccnl` | TTTT3017U, VTTT3017U | [문서](해외주식-주문-계좌/해외주식-예약주문접수취소-uapi-overseas-stock-v1-trading-order-resv-ccnl.md) |
| 해외주식 매수가능금액조회 | `/uapi/overseas-stock/v1/trading/inquire-psamount` | TTTS3007R, VTTS3007R | [문서](해외주식-주문-계좌/해외주식-매수가능금액조회-uapi-overseas-stock-v1-trading-inquire-psamount.md) |
| 해외주식 미체결내역 | `/uapi/overseas-stock/v1/trading/inquire-nccs` | TTTS3018R | [문서](해외주식-주문-계좌/해외주식-미체결내역-uapi-overseas-stock-v1-trading-inquire-nccs.md) |
| 해외주식 잔고 | `/uapi/overseas-stock/v1/trading/inquire-balance` | TTTS3012R, VTTS3012R | [문서](해외주식-주문-계좌/해외주식-잔고-uapi-overseas-stock-v1-trading-inquire-balance.md) |
| 해외주식 주문체결내역 | `/uapi/overseas-stock/v1/trading/inquire-ccnl` | TTTS3035R, VTTS3035R | [문서](해외주식-주문-계좌/해외주식-주문체결내역-uapi-overseas-stock-v1-trading-inquire-ccnl.md) |
| 해외주식 체결기준현재잔고 | `/uapi/overseas-stock/v1/trading/inquire-present-balance` | CTRP6504R, VTRP6504R | [문서](해외주식-주문-계좌/해외주식-체결기준현재잔고-uapi-overseas-stock-v1-trading-inquire-present-balance.md) |
| 해외주식 예약주문조회 | `/uapi/overseas-stock/v1/trading/order-resv-list` | TTTT3039R, TTTS3014R | [문서](해외주식-주문-계좌/해외주식-예약주문조회-uapi-overseas-stock-v1-trading-order-resv-list.md) |
| 해외주식 결제기준잔고 | `/uapi/overseas-stock/v1/trading/inquire-paymt-stdr-balance` | CTRP6010R | [문서](해외주식-주문-계좌/해외주식-결제기준잔고-uapi-overseas-stock-v1-trading-inquire-paymt-stdr-balance.md) |
| 해외주식 일별거래내역 | `/uapi/overseas-stock/v1/trading/inquire-period-trans` | CTOS4001R | [문서](해외주식-주문-계좌/해외주식-일별거래내역-uapi-overseas-stock-v1-trading-inquire-period-trans.md) |
| 해외주식 기간손익 | `/uapi/overseas-stock/v1/trading/inquire-period-profit` | TTTS3039R | [문서](해외주식-주문-계좌/해외주식-기간손익-uapi-overseas-stock-v1-trading-inquire-period-profit.md) |
| 해외증거금 통화별조회 | `/uapi/overseas-stock/v1/trading/foreign-margin` | TTTC2101R | [문서](해외주식-주문-계좌/해외증거금-통화별조회-uapi-overseas-stock-v1-trading-foreign-margin.md) |
| 해외주식 미국주간주문 | `/uapi/overseas-stock/v1/trading/daytime-order` | TTTS6036U, TTTS6037U | [문서](해외주식-주문-계좌/해외주식-미국주간주문-uapi-overseas-stock-v1-trading-daytime-order.md) |
| 해외주식 미국주간정정취소 | `/uapi/overseas-stock/v1/trading/daytime-order-rvsecncl` | TTTS6038U | [문서](해외주식-주문-계좌/해외주식-미국주간정정취소-uapi-overseas-stock-v1-trading-daytime-order-rvsecncl.md) |
| 해외주식 지정가주문번호조회 | `/uapi/overseas-stock/v1/trading/algo-ordno` | TTTS6058R | [문서](해외주식-주문-계좌/해외주식-지정가주문번호조회-uapi-overseas-stock-v1-trading-algo-ordno.md) |
| 해외주식 지정가체결내역조회 | `/uapi/overseas-stock/v1/trading/inquire-algo-ccnl` | TTTS6059R | [문서](해외주식-주문-계좌/해외주식-지정가체결내역조회-uapi-overseas-stock-v1-trading-inquire-algo-ccnl.md) |

### [해외주식] 기본시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 해외주식 현재가상세 | `/uapi/overseas-price/v1/quotations/price-detail` | HHDFS76200200 | [문서](해외주식-기본시세/해외주식-현재가상세-uapi-overseas-price-v1-quotations-price-detail.md) |
| 해외주식 현재가 호가 | `/uapi/overseas-price/v1/quotations/inquire-asking-price` | HHDFS76200100 | [문서](해외주식-기본시세/해외주식-현재가-호가-uapi-overseas-price-v1-quotations-inquire-asking-price.md) |
| 해외주식 현재체결가 | `/uapi/overseas-price/v1/quotations/price` | HHDFS00000300 | [문서](해외주식-기본시세/해외주식-현재체결가-uapi-overseas-price-v1-quotations-price.md) |
| 해외주식 체결추이 | `/uapi/overseas-price/v1/quotations/inquire-ccnl` | HHDFS76200300 | [문서](해외주식-기본시세/해외주식-체결추이-uapi-overseas-price-v1-quotations-inquire-ccnl.md) |
| 해외주식분봉조회 | `/uapi/overseas-price/v1/quotations/inquire-time-itemchartprice` | HHDFS76950200 | [문서](해외주식-기본시세/해외주식분봉조회-uapi-overseas-price-v1-quotations-inquire-time-itemchartprice.md) |
| 해외지수분봉조회 | `/uapi/overseas-price/v1/quotations/inquire-time-indexchartprice` | FHKST03030200 | [문서](해외주식-기본시세/해외지수분봉조회-uapi-overseas-price-v1-quotations-inquire-time-indexchartprice.md) |
| 해외주식 기간별시세 | `/uapi/overseas-price/v1/quotations/dailyprice` | HHDFS76240000 | [문서](해외주식-기본시세/해외주식-기간별시세-uapi-overseas-price-v1-quotations-dailyprice.md) |
| 해외주식 종목/지수/환율기간별시세(일/주/월/년) | `/uapi/overseas-price/v1/quotations/inquire-daily-chartprice` | FHKST03030100 | [문서](해외주식-기본시세/해외주식-종목-지수-환율기간별시세-일-주-월-년-uapi-overseas-price-v1-quotations-inquire-daily-chartprice.md) |
| 해외주식조건검색 | `/uapi/overseas-price/v1/quotations/inquire-search` | HHDFS76410000 | [문서](해외주식-기본시세/해외주식조건검색-uapi-overseas-price-v1-quotations-inquire-search.md) |
| 해외결제일자조회 | `/uapi/overseas-stock/v1/quotations/countries-holiday` | CTOS5011R | [문서](해외주식-기본시세/해외결제일자조회-uapi-overseas-stock-v1-quotations-countries-holiday.md) |
| 해외주식 상품기본정보 | `/uapi/overseas-price/v1/quotations/search-info` | CTPF1702R | [문서](해외주식-기본시세/해외주식-상품기본정보-uapi-overseas-price-v1-quotations-search-info.md) |
| 해외주식 업종별시세 | `/uapi/overseas-price/v1/quotations/industry-theme` | HHDFS76370000 | [문서](해외주식-기본시세/해외주식-업종별시세-uapi-overseas-price-v1-quotations-industry-theme.md) |
| 해외주식 업종별코드조회 | `/uapi/overseas-price/v1/quotations/industry-price` | HHDFS76370100 | [문서](해외주식-기본시세/해외주식-업종별코드조회-uapi-overseas-price-v1-quotations-industry-price.md) |
| 해외주식 복수종목 시세조회 | `/uapi/overseas-price/v1/quotations/multprice` | - | [문서](해외주식-기본시세/해외주식-복수종목-시세조회-uapi-overseas-price-v1-quotations-multprice.md) |

### [해외주식] 시세분석

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 해외주식 가격급등락 | `/uapi/overseas-stock/v1/ranking/price-fluct` | HHDFS76260000 | [문서](해외주식-시세분석/해외주식-가격급등락-uapi-overseas-stock-v1-ranking-price-fluct.md) |
| 해외주식 거래량급증 | `/uapi/overseas-stock/v1/ranking/volume-surge` | HHDFS76270000 | [문서](해외주식-시세분석/해외주식-거래량급증-uapi-overseas-stock-v1-ranking-volume-surge.md) |
| 해외주식 매수체결강도상위 | `/uapi/overseas-stock/v1/ranking/volume-power` | HHDFS76280000 | [문서](해외주식-시세분석/해외주식-매수체결강도상위-uapi-overseas-stock-v1-ranking-volume-power.md) |
| 해외주식 상승율/하락율 | `/uapi/overseas-stock/v1/ranking/updown-rate` | HHDFS76290000 | [문서](해외주식-시세분석/해외주식-상승율-하락율-uapi-overseas-stock-v1-ranking-updown-rate.md) |
| 해외주식 신고/신저가 | `/uapi/overseas-stock/v1/ranking/new-highlow` | HHDFS76300000 | [문서](해외주식-시세분석/해외주식-신고-신저가-uapi-overseas-stock-v1-ranking-new-highlow.md) |
| 해외주식 거래량순위 | `/uapi/overseas-stock/v1/ranking/trade-vol` | HHDFS76310010 | [문서](해외주식-시세분석/해외주식-거래량순위-uapi-overseas-stock-v1-ranking-trade-vol.md) |
| 해외주식 거래대금순위 | `/uapi/overseas-stock/v1/ranking/trade-pbmn` | HHDFS76320010 | [문서](해외주식-시세분석/해외주식-거래대금순위-uapi-overseas-stock-v1-ranking-trade-pbmn.md) |
| 해외주식 거래증가율순위 | `/uapi/overseas-stock/v1/ranking/trade-growth` | HHDFS76330000 | [문서](해외주식-시세분석/해외주식-거래증가율순위-uapi-overseas-stock-v1-ranking-trade-growth.md) |
| 해외주식 거래회전율순위 | `/uapi/overseas-stock/v1/ranking/trade-turnover` | HHDFS76340000 | [문서](해외주식-시세분석/해외주식-거래회전율순위-uapi-overseas-stock-v1-ranking-trade-turnover.md) |
| 해외주식 시가총액순위 | `/uapi/overseas-stock/v1/ranking/market-cap` | HHDFS76350100 | [문서](해외주식-시세분석/해외주식-시가총액순위-uapi-overseas-stock-v1-ranking-market-cap.md) |
| 해외주식 기간별권리조회 | `/uapi/overseas-price/v1/quotations/period-rights` | CTRGT011R | [문서](해외주식-시세분석/해외주식-기간별권리조회-uapi-overseas-price-v1-quotations-period-rights.md) |
| 해외뉴스종합(제목) | `/uapi/overseas-price/v1/quotations/news-title` | HHPSTH60100C1 | [문서](해외주식-시세분석/해외뉴스종합-제목-uapi-overseas-price-v1-quotations-news-title.md) |
| 해외주식 권리종합 | `/uapi/overseas-price/v1/quotations/rights-by-ice` | HHDFS78330900 | [문서](해외주식-시세분석/해외주식-권리종합-uapi-overseas-price-v1-quotations-rights-by-ice.md) |
| 당사 해외주식담보대출 가능 종목 | `/uapi/overseas-price/v1/quotations/colable-by-company` | CTLN4050R | [문서](해외주식-시세분석/당사-해외주식담보대출-가능-종목-uapi-overseas-price-v1-quotations-colable-by-company.md) |
| 해외속보(제목) | `/uapi/overseas-price/v1/quotations/brknews-title` | FHKST01011801 | [문서](해외주식-시세분석/해외속보-제목-uapi-overseas-price-v1-quotations-brknews-title.md) |

### [해외주식] 실시간시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 해외주식 실시간호가 | `/tryitout/HDFSASP0` | - | [문서](해외주식-실시간시세/해외주식-실시간호가-tryitout-hdfsasp0.md) |
| 해외주식 지연호가(아시아) | `/tryitout/HDFSASP1` | - | [문서](해외주식-실시간시세/해외주식-지연호가-아시아-tryitout-hdfsasp1.md) |
| 해외주식 실시간지연체결가 | `/tryitout/HDFSCNT0` | - | [문서](해외주식-실시간시세/해외주식-실시간지연체결가-tryitout-hdfscnt0.md) |
| 해외주식 실시간체결통보 | `/tryitout/H0GSCNI0` | - | [문서](해외주식-실시간시세/해외주식-실시간체결통보-tryitout-h0gscni0.md) |

### [해외선물옵션] 주문/계좌

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 해외선물옵션 주문 | `/uapi/overseas-futureoption/v1/trading/order` | OTFM3001U | [문서](해외선물옵션-주문-계좌/해외선물옵션-주문-uapi-overseas-futureoption-v1-trading-order.md) |
| 해외선물옵션 정정취소주문 | `/uapi/overseas-futureoption/v1/trading/order-rvsecncl` | OTFM3002U, OTFM3003U | [문서](해외선물옵션-주문-계좌/해외선물옵션-정정취소주문-uapi-overseas-futureoption-v1-trading-order-rvsecncl.md) |
| 해외선물옵션 당일주문내역조회 | `/uapi/overseas-futureoption/v1/trading/inquire-ccld` | OTFM3116R | [문서](해외선물옵션-주문-계좌/해외선물옵션-당일주문내역조회-uapi-overseas-futureoption-v1-trading-inquire-ccld.md) |
| 해외선물옵션 미결제내역조회(잔고) | `/uapi/overseas-futureoption/v1/trading/inquire-unpd` | OTFM1412R | [문서](해외선물옵션-주문-계좌/해외선물옵션-미결제내역조회-잔고-uapi-overseas-futureoption-v1-trading-inquire-unpd.md) |
| 해외선물옵션 주문가능조회 | `/uapi/overseas-futureoption/v1/trading/inquire-psamount` | OTFM3304R | [문서](해외선물옵션-주문-계좌/해외선물옵션-주문가능조회-uapi-overseas-futureoption-v1-trading-inquire-psamount.md) |
| 해외선물옵션 기간계좌손익 일별 | `/uapi/overseas-futureoption/v1/trading/inquire-period-ccld` | OTFM3118R | [문서](해외선물옵션-주문-계좌/해외선물옵션-기간계좌손익-일별-uapi-overseas-futureoption-v1-trading-inquire-period-ccld.md) |
| 해외선물옵션 일별 체결내역 | `/uapi/overseas-futureoption/v1/trading/inquire-daily-ccld` | OTFM3122R | [문서](해외선물옵션-주문-계좌/해외선물옵션-일별-체결내역-uapi-overseas-futureoption-v1-trading-inquire-daily-ccld.md) |
| 해외선물옵션 예수금현황 | `/uapi/overseas-futureoption/v1/trading/inquire-deposit` | OTFM1411R | [문서](해외선물옵션-주문-계좌/해외선물옵션-예수금현황-uapi-overseas-futureoption-v1-trading-inquire-deposit.md) |
| 해외선물옵션 일별 주문내역 | `/uapi/overseas-futureoption/v1/trading/inquire-daily-order` | OTFM3120R | [문서](해외선물옵션-주문-계좌/해외선물옵션-일별-주문내역-uapi-overseas-futureoption-v1-trading-inquire-daily-order.md) |
| 해외선물옵션 기간계좌거래내역 | `/uapi/overseas-futureoption/v1/trading/inquire-period-trans` | OTFM3114R | [문서](해외선물옵션-주문-계좌/해외선물옵션-기간계좌거래내역-uapi-overseas-futureoption-v1-trading-inquire-period-trans.md) |
| 해외선물옵션 증거금상세 | `/uapi/overseas-futureoption/v1/trading/margin-detail` | OTFM3115R | [문서](해외선물옵션-주문-계좌/해외선물옵션-증거금상세-uapi-overseas-futureoption-v1-trading-margin-detail.md) |

### [해외선물옵션] 기본시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 해외선물종목현재가 | `/uapi/overseas-futureoption/v1/quotations/inquire-price` | HHDFC55010000 | [문서](해외선물옵션-기본시세/해외선물종목현재가-uapi-overseas-futureoption-v1-quotations-inquire-price.md) |
| 해외선물종목상세 | `/uapi/overseas-futureoption/v1/quotations/stock-detail` | HHDFC55010100 | [문서](해외선물옵션-기본시세/해외선물종목상세-uapi-overseas-futureoption-v1-quotations-stock-detail.md) |
| 해외선물 호가 | `/uapi/overseas-futureoption/v1/quotations/inquire-asking-price` | HHDFC86000000 | [문서](해외선물옵션-기본시세/해외선물-호가-uapi-overseas-futureoption-v1-quotations-inquire-asking-price.md) |
| 해외선물 분봉조회 | `/uapi/overseas-futureoption/v1/quotations/inquire-time-futurechartprice` | HHDFC55020400 | [문서](해외선물옵션-기본시세/해외선물-분봉조회-uapi-overseas-futureoption-v1-quotations-inquire-time-futurechartprice.md) |
| 해외선물 체결추이(틱) | `/uapi/overseas-futureoption/v1/quotations/tick-ccnl` | HHDFC55020200 | [문서](해외선물옵션-기본시세/해외선물-체결추이-틱-uapi-overseas-futureoption-v1-quotations-tick-ccnl.md) |
| 해외선물 체결추이(주간) | `/uapi/overseas-futureoption/v1/quotations/weekly-ccnl` | HHDFC55020000 | [문서](해외선물옵션-기본시세/해외선물-체결추이-주간-uapi-overseas-futureoption-v1-quotations-weekly-ccnl.md) |
| 해외선물 체결추이(일간) | `/uapi/overseas-futureoption/v1/quotations/daily-ccnl` | HHDFC55020100 | [문서](해외선물옵션-기본시세/해외선물-체결추이-일간-uapi-overseas-futureoption-v1-quotations-daily-ccnl.md) |
| 해외선물 체결추이(월간) | `/uapi/overseas-futureoption/v1/quotations/monthly-ccnl` | HHDFC55020300 | [문서](해외선물옵션-기본시세/해외선물-체결추이-월간-uapi-overseas-futureoption-v1-quotations-monthly-ccnl.md) |
| 해외선물 상품기본정보 | `/uapi/overseas-futureoption/v1/quotations/search-contract-detail` | HHDFC55200000 | [문서](해외선물옵션-기본시세/해외선물-상품기본정보-uapi-overseas-futureoption-v1-quotations-search-contract-detail.md) |
| 해외선물 미결제추이 | `/uapi/overseas-futureoption/v1/quotations/investor-unpd-trend` | HHDDB95030000 | [문서](해외선물옵션-기본시세/해외선물-미결제추이-uapi-overseas-futureoption-v1-quotations-investor-unpd-trend.md) |
| 해외옵션종목현재가 | `/uapi/overseas-futureoption/v1/quotations/opt-price` | HHDFO55010000 | [문서](해외선물옵션-기본시세/해외옵션종목현재가-uapi-overseas-futureoption-v1-quotations-opt-price.md) |
| 해외옵션종목상세 | `/uapi/overseas-futureoption/v1/quotations/opt-detail` | HHDFO55010100 | [문서](해외선물옵션-기본시세/해외옵션종목상세-uapi-overseas-futureoption-v1-quotations-opt-detail.md) |
| 해외옵션 호가 | `/uapi/overseas-futureoption/v1/quotations/opt-asking-price` | HHDFO86000000 | [문서](해외선물옵션-기본시세/해외옵션-호가-uapi-overseas-futureoption-v1-quotations-opt-asking-price.md) |
| 해외옵션 분봉조회 | `/uapi/overseas-futureoption/v1/quotations/inquire-time-optchartprice` | HHDFO55020100 | [문서](해외선물옵션-기본시세/해외옵션-분봉조회-uapi-overseas-futureoption-v1-quotations-inquire-time-optchartprice.md) |
| 해외옵션 체결추이(틱) | `/uapi/overseas-futureoption/v1/quotations/opt-tick-ccnl` | HHDFO55020200 | [문서](해외선물옵션-기본시세/해외옵션-체결추이-틱-uapi-overseas-futureoption-v1-quotations-opt-tick-ccnl.md) |
| 해외옵션 체결추이(일간) | `/uapi/overseas-futureoption/v1/quotations/opt-daily-ccnl` | HHDFO55020100 | [문서](해외선물옵션-기본시세/해외옵션-체결추이-일간-uapi-overseas-futureoption-v1-quotations-opt-daily-ccnl.md) |
| 해외옵션 체결추이(주간) | `/uapi/overseas-futureoption/v1/quotations/opt-weekly-ccnl` | HHDFO55020000 | [문서](해외선물옵션-기본시세/해외옵션-체결추이-주간-uapi-overseas-futureoption-v1-quotations-opt-weekly-ccnl.md) |
| 해외옵션 체결추이(월간) | `/uapi/overseas-futureoption/v1/quotations/opt-monthly-ccnl` | HHDFO55020300 | [문서](해외선물옵션-기본시세/해외옵션-체결추이-월간-uapi-overseas-futureoption-v1-quotations-opt-monthly-ccnl.md) |
| 해외옵션 상품기본정보 | `/uapi/overseas-futureoption/v1/quotations/search-opt-detail` | HHDFO55200000 | [문서](해외선물옵션-기본시세/해외옵션-상품기본정보-uapi-overseas-futureoption-v1-quotations-search-opt-detail.md) |
| 해외선물옵션 장운영시간 | `/uapi/overseas-futureoption/v1/quotations/market-time` | OTFM2229R | [문서](해외선물옵션-기본시세/해외선물옵션-장운영시간-uapi-overseas-futureoption-v1-quotations-market-time.md) |

### [해외선물옵션]실시간시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 해외선물옵션 실시간체결가 | `/tryitout/HDFFF020` | - | [문서](해외선물옵션-실시간시세/해외선물옵션-실시간체결가-tryitout-hdfff020.md) |
| 해외선물옵션 실시간호가 | `/tryitout/HDFFF010` | - | [문서](해외선물옵션-실시간시세/해외선물옵션-실시간호가-tryitout-hdfff010.md) |
| 해외선물옵션 실시간주문내역통보 | `/tryitout/HDFFF1C0` | - | [문서](해외선물옵션-실시간시세/해외선물옵션-실시간주문내역통보-tryitout-hdfff1c0.md) |
| 해외선물옵션 실시간체결내역통보 | `/tryitout/HDFFF2C0` | - | [문서](해외선물옵션-실시간시세/해외선물옵션-실시간체결내역통보-tryitout-hdfff2c0.md) |

### [장내채권] 주문/계좌

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 장내채권 매수주문 | `/uapi/domestic-bond/v1/trading/buy` | TTTC0952U | [문서](장내채권-주문-계좌/장내채권-매수주문-uapi-domestic-bond-v1-trading-buy.md) |
| 장내채권 매도주문 | `/uapi/domestic-bond/v1/trading/sell` | TTTC0958U | [문서](장내채권-주문-계좌/장내채권-매도주문-uapi-domestic-bond-v1-trading-sell.md) |
| 장내채권 정정취소주문 | `/uapi/domestic-bond/v1/trading/order-rvsecncl` | TTTC0953U | [문서](장내채권-주문-계좌/장내채권-정정취소주문-uapi-domestic-bond-v1-trading-order-rvsecncl.md) |
| 채권정정취소가능주문조회 | `/uapi/domestic-bond/v1/trading/inquire-psbl-rvsecncl` | CTSC8035R | [문서](장내채권-주문-계좌/채권정정취소가능주문조회-uapi-domestic-bond-v1-trading-inquire-psbl-rvsecncl.md) |
| 장내채권 주문체결내역 | `/uapi/domestic-bond/v1/trading/inquire-daily-ccld` | CTSC8013R | [문서](장내채권-주문-계좌/장내채권-주문체결내역-uapi-domestic-bond-v1-trading-inquire-daily-ccld.md) |
| 장내채권 잔고조회 | `/uapi/domestic-bond/v1/trading/inquire-balance` | CTSC8407R | [문서](장내채권-주문-계좌/장내채권-잔고조회-uapi-domestic-bond-v1-trading-inquire-balance.md) |
| 장내채권 매수가능조회 | `/uapi/domestic-bond/v1/trading/inquire-psbl-order` | TTTC8910R | [문서](장내채권-주문-계좌/장내채권-매수가능조회-uapi-domestic-bond-v1-trading-inquire-psbl-order.md) |

### [장내채권] 기본시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 장내채권현재가(호가) | `/uapi/domestic-bond/v1/quotations/inquire-asking-price` | FHKBJ773401C0 | [문서](장내채권-기본시세/장내채권현재가-호가-uapi-domestic-bond-v1-quotations-inquire-asking-price.md) |
| 장내채권현재가(시세) | `/uapi/domestic-bond/v1/quotations/inquire-price` | FHKBJ773400C0 | [문서](장내채권-기본시세/장내채권현재가-시세-uapi-domestic-bond-v1-quotations-inquire-price.md) |
| 장내채권현재가(체결) | `/uapi/domestic-bond/v1/quotations/inquire-ccnl` | FHKBJ773403C0 | [문서](장내채권-기본시세/장내채권현재가-체결-uapi-domestic-bond-v1-quotations-inquire-ccnl.md) |
| 장내채권현재가(일별) | `/uapi/domestic-bond/v1/quotations/inquire-daily-price` | FHKBJ773404C0 | [문서](장내채권-기본시세/장내채권현재가-일별-uapi-domestic-bond-v1-quotations-inquire-daily-price.md) |
| 장내채권 기간별시세(일) | `/uapi/domestic-bond/v1/quotations/inquire-daily-itemchartprice` | FHKBJ773701C0 | [문서](장내채권-기본시세/장내채권-기간별시세-일-uapi-domestic-bond-v1-quotations-inquire-daily-itemchartprice.md) |
| 장내채권 평균단가조회 | `/uapi/domestic-bond/v1/quotations/avg-unit` | CTPF2005R | [문서](장내채권-기본시세/장내채권-평균단가조회-uapi-domestic-bond-v1-quotations-avg-unit.md) |
| 장내채권 발행정보 | `/uapi/domestic-bond/v1/quotations/issue-info` | CTPF1101R | [문서](장내채권-기본시세/장내채권-발행정보-uapi-domestic-bond-v1-quotations-issue-info.md) |
| 장내채권 기본조회 | `/uapi/domestic-bond/v1/quotations/search-bond-info` | CTPF1114R | [문서](장내채권-기본시세/장내채권-기본조회-uapi-domestic-bond-v1-quotations-search-bond-info.md) |

### [장내채권] 실시간시세

| API | Path | 샘플 TR ID | 문서 |
| --- | --- | --- | --- |
| 일반채권 실시간체결가 | `/tryitout/H0BJCNT0` | - | [문서](장내채권-실시간시세/일반채권-실시간체결가-tryitout-h0bjcnt0.md) |
| 일반채권 실시간호가 | `/tryitout/H0BJASP0` | - | [문서](장내채권-실시간시세/일반채권-실시간호가-tryitout-h0bjasp0.md) |
| 채권지수 실시간체결가 | `/tryitout/H0BICNT0` | - | [문서](장내채권-실시간시세/채권지수-실시간체결가-tryitout-h0bicnt0.md) |

