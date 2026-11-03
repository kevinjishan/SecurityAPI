# 기업행위·가격 조정 근거 계약 v1

LS 차트의 조정 구분·수정 비율은 주식 수량 전환 명세가 아니다. 일봉 응답의 가격 기준만으로 권리·수량을 확정하지 않는다.

## LS 차트의 추가 필드

각 LS candle의 adjustment는 normalizeLsCandleAdjustment(row)로 생성한다. code(jongchk), rateRaw(rate), priceCheck(pricechk)를 문자열/없으면 null로 보존한다. 0도 보존하며 비트 부호 변환·사건 종류 추정·가격/수량 변경은 하지 않는다. quantityRatio는 항상 null이다. 원래 OHLCV와 raw는 유지한다.

직접 일봉 normalizer 호출에 options가 없으면 priceAdjustment.requested는 UNKNOWN이다. MarketDataService가 전달한 adjusted 옵션은 요청 빌더와 같은 규칙으로 N(false)/Y(그 외)를 기록한다. verified=false이며 조정 정확성 인증은 아니다. 다른 브로커의 응답은 바꾸지 않는다.

## 권리 장부 입력

validateCorporateActionTerms(value)는 securityapi.corporate-action.v1을 검증하고 분리된 JSON을 반환한다. 서식 검증이며 공시 사실·수익률을 인증하지 않는다. performanceCertified는 항상 false다.

필드: id, symbol, kind, eligibility, entitlementAt, effectiveAt, observedAt, outputs, cash, evidence, blockers. 시각은 epoch ms 또는 미확인 null이다. outputs는 종목별 numerator/denominator(최대24자리 비음수 정수 문자열, 분모 양수), deliveryAt이다. 원래 주식을 소비하고 outputs로 전환한다. 현금 배당처럼 원래 주식을 유지할 때는 기존 종목1/1 출력도 명시한다. cash는 원래 적격1주당 KRW 비율과 payAt을 가진다. 미확인 지급일은 null로 남겨 미지급 권리로 보존한다.

entitlementAt은 **해당 주주에게 확인한 적격 보유 수량의 기준 시각**이다. 거래소 명부 기준일을 거래 체결 잔고 시각으로 바로 사용하지 않는다. 결제·권리락·명부·중간 매매가 있으면 적격 스냅샷 어댑터가 먼저 필요하다. effectiveAt은 법적 권리 변화 시각, observedAt은 근거를 실제 확보한 시각이다. 과거 전략의 당시 가용성은 별도 검증한다.

evidence는 HTTPS URL, 보존 원문의 SHA-256, observedAt이다. observedAt은 evidence 시각보다 앞설 수 없다. eligibility는 ALL_HOLDERS/ORDINARY_EXTERNAL/UNKNOWN이다. 선택 소각·채권자 출자전환 등의 대상이 다르면 사건을 분리하며 공통 가격 비율로 대체하지 않는다.

불명 시각·권리 대상·신설 종목·미지원 종류·명시 blocker가 있으면 PARTIAL이다. 필수 조건이 채워지면 TERMS_COMPLETE지만 경제적 검증 완료를 뜻하지 않는다. 외부 status/verified 값을 신뢰하여 부분 조건을 통과시키지 않는다. RIGHTS/UNKNOWN은 현재 미지원이다.

단주를 버리거나 미래 가격으로 즉시 현금 처리하지 않는다. 수신측은 단주·신설주식·현금의 미정산 권리를 별도로 보존하고, 실제 지급/입고 시점과 평가용 가격·수량 기준을 검증한다. 본 SDK는 브로커 계좌 장부를 변경하거나 주문을 생성하지 않는다.

## 호환성과 검증

추가 export와 LS 응답 필드만 추가했다. 인증·quota·주문 builder·운영 설정은 변경하지 않았다. 신규6개를 포함해 SDK346개 테스트가 통과했다. 실제 브로커·OAuth 호출은 수행하지 않았다. 실제 공시 장부와 전략 엔진 연결은 소비 프로젝트에서 별도 검증한다.


## 단주 소각의 명시적 구분

outputs의 fractionDisposition은 기본 CLAIM이다. CANCEL은 단주 소각을 뜻하며 별도의 fractionEvidence(URL/hash/observedAt)가 필요하다. 근거가 없으면 PARTIAL이다. 소각 단위를 감사 기록으로 남기고 대응 원가를 처리하는 일은 소비 장부가 맡는다. LS 가격 조정비로 소각 여부를 추정하지 않는다. 감자기준일·법적 효력발생일·신주상장일은 각각 별도 사실이며 같은 날짜로 간주하지 않는다.
