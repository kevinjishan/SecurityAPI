# 한국 거래일·결제일과 LS 일봉 의미

공식 KRX 연도별 휴장일 응답과 비거래·비결제 규칙의 근거를 받아 모든 민간 날짜를 명시한다. `normalizeKrxHolidayYear` → `joinKrxCalendars`로 구성하고, `resolveKrxEquitySettlementDate`와 `latestKrxEligibleTradeDate`는 명시한 달력의 결제일만 세어 T+2를 계산한다. 빈 응답·중복·잘못된 날짜·연도·근거·달력 공백·범위 밖은 거부한다. 누락을 평일/휴일로 추정하지 않는다.

이 순수 함수는 원문이 실제 공식 출처인지 인증하거나 투자/집행을 허용하지 않는다. 소비 Application은 원문 SHA256·연도/거래소 요청 범위·SDK commit·정규화 결과 hash를 검증해야 한다. 현재 수신 시각은 과거 당시 이용 가능 시각이 아니다. 결과는 `pointInTimeCertified:false`, `historicalAvailableAt:null`이다. 연도별 휴장일과 현행 KRX 규칙을 바탕으로 한 재구성이며 역사적 규칙의 효력과 향후 임시 휴장은 별도 검토한다. 증권별 거래정지/상장일은 거래소 달력과 별도다.

달력 날짜 계산에서 사용하는 UTC 자정은 날짜를 이동하는 산술 내부값이다. 시장의 실제 시각으로 출력하지 않는다. `sessionTimes:null`을 유지한다. 정규장 일반 규칙과 달리 연초·수능 등 일자별 변경 근거를 확인하기 전에는 09:00/15:30을 모든 역사 날짜에 쓰지 않는다. 결제일을 계산했다고 개별 계좌의 입고 시각을 증명한 것도 아니다.

LS `t8410` 정규화는 기존 OHLC/value/raw·수정주가 요청 값을 유지하면서 `meaning`을 추가한다. 현재 공식 가이드의 `value` 설명에는 단위가 없어 원화·백만원을 선택하지 않는다. 거래소/일봉 집계 세션도 문서로 확정되지 않은 상태를 보존한다. 날짜 표시는 거래일 레이블이며 정확한 개장/마감·확정/역사 수신 시각으로 바꾸지 않는다. 원래 `value`는 단위가 확정된 금액이 아니다.

새 브로커 클라이언트·인증·호출·호출 제한 경로를 추가하지 않는다. 기존 수집 pin과 운영 프로세스는 자동 업그레이드하지 않는다.

공식 근거:

- https://open.krx.co.kr/contents/MKD/01/0110/01100305/MKD01100305.jsp
- https://regulation.krx.co.kr/contents/RGL/03/03010100/RGL03010100T1.jsp
- https://openapi.ls-sec.co.kr/guide/api/8ncj7d41-48w8-fv13-cj5y-4z8d6m811rbr?type=rest&api=12320341-ad85-429a-90bd-5b3771c5e89f

검증: `node --test test/services/CalendarSupport.test.mjs`. 네트워크/실제 계좌를 사용하지 않는다.


## 날짜·시장별 정규장 예외 일정

`normalizeKrxRegularSessionExceptions(calendar, entries)`는 공식 공시에서 확인한 날짜·시장·개장/종료 시각·근거를 명시한 부분 일정 등록부를 만듭니다. `resolveKrxRegularSessionException(calendar, register, {date,market})`는 정확히 일치하는 항목만 반환하며 미등록 날짜·시장은 실패합니다. 빈 목록·중복·휴장일·범위 밖·잘못된 시각·근거 없는 항목도 거부합니다. 이 API는 기존 날짜 달력의 sessionTimes나 LS 일봉 meaning을 변경하지 않습니다.

각 입력은 id, date(YYYYMMDD), market(KOSPI/KOSDAQ/KONEX), open/close(HH:mm), reason, evidence로 구성합니다. KST 일정을 scheduledOpenAt/scheduledCloseAt(UTC ISO)으로 변환하며 실제 첫/마지막 체결 시각은 null입니다. 부분 등록부는 모든 일반 거래일·추가 예외의 완전성을 인증하지 않습니다. 날짜별 공시가 있다고 해당 종목의 정지/거래 가능 여부, LS 봉의 집계 세션, 거래대금 단위나 과거 정보 가용 시각이 인증되는 것도 아닙니다.

SDK는 전달받은 사실·일정의 구조와 달력 일치를 검사합니다. Application은 원문 전체 해시와 시장·날짜·변경 전/후 구획의 발췌, 등록부 스냅샷을 검증해야 합니다. 현재 취득한 공시의 관측 시각을 과거 이용 가능 시각으로 바꾸지 않습니다. 기존 수집 pin·동결 연구 계획·운영 프로세스를 자동 업그레이드하지 않습니다.

검증: `node --test test/services/RegularSessionExceptions.test.mjs`.


## Daily date coverage audit

auditKrxDailyDates(calendar, {startDate, endDate, dates}) compares an explicitly bounded daily date list with the supplied KRX day calendar. The range must be covered by the calendar. Missing trading dates, duplicates, nontrading dates, out-of-range observations and unsorted input are reported. Invalid dates/lists/calendar profiles throw validation errors. Empty input or a range containing no expected trading day never passes.

dateCoverageMatched covers date membership and ordering only. It does not certify the instrument's listing/halt history, the provider's exchange or aggregation session, turnover units, candle finality, or historical availability. All corresponding certification fields remain false. Provider header times must not be copied to every historical row.

No network, implicit holiday lookup, clock, candle mutation or trading activation is performed. Existing calendar/settlement and LS raw-preservation contracts are unchanged.
