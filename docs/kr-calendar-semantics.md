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
