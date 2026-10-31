# LS 차트 세션·공식 공지 업데이트 (2026-10-31)

이 변경은 기존 기본 요청을 유지하면서 LS 분봉의 거래소/정규장 선택과 최신 세션 metadata를 추가한다. 인증·주문·HTTP 재시도 코드는 변경하지 않는다.

## 사용법

```js
import {MarketDataService} from "security-api-reference";
const marketData = new MarketDataService({ls: existingLsClient});
const result = await marketData.getDomesticStockMinuteCandles("ls", "005930", {
  exchange: "krx",         // K/krx, N/nxt, U/integrated → t8452
  session: "regular",      // regular → krx_mmk_gubun=Y; all → 빈 문자열
  count: 100,
  endDate: "20261030",
});
```

existingLsClient는 애플리케이션의 기존 인증 주체로 구성한 client다. 이 예제는 별도 인증 발급자를 만들라는 뜻이 아니다.

- 옵션을 생략하면 기존 t8412 요청과 새 필드 생략 상태를 유지한다.
- 거래소를 명시하면 t8452를 선택한다. t8412를 강제로 지정하면서 거래소도 지정하면 지원 불가 오류다.
- t8452를 직접 선택하고 거래소를 생략하면 K를 전송한다.
- session은 regular/all만 받는다. 현재 regular와 NXT/통합 거래소 조합은 의미를 확인하지 않아 지원 불가로 처리한다.
- 다른 브로커/일·주·월봉에서 이 새 session/exchange 옵션은 조용히 무시하지 않고 지원 불가 오류로 반환한다. 별도의 기존 marketDivision 옵션은 바꾸지 않는다.
- apiId와 trCode 또는 exchange와 exchangeCode가 충돌하면 요청 전에 실패한다.
- 요청 조건은 `data.source.requestedSession/requestedExchange`에 남고, 공급자가 실제로 이 조건을 충족했다는 인증으로 쓰지 않는다.
- KRX/NXT 프리·애프터 및 정규 시각 필드를 `summary.sessionTimes`에서 원문 키로 보존한다. 기존 summary 키·가격/거래대금 값·커서는 유지한다. 신규 sessionTimes는 응답에 해당 필드가 있을 때만 추가된다.
- 거래대금 단위·봉 시작/종료·과거 공개시점은 이 변경으로 확정되지 않는다. cursor를 임의 보정하거나 자동 페이지 반복을 추가하지 않았다.

## metadata 재생성

`data/updates/ls-20261031.json`은 과거 raw snapshot을 덮어쓰는 자료가 아니라 공식 공지에서 확인한 추가 필드/정책이다. 필드의 raw는 null이며 sourceEvidence로 공지 URL·확인일·적용 예정 시점을 식별한다. required=false는 SDK 선택 입력 정책이며 공지의 필수 여부 판정을 꾸며낸 값이 아니다.

```sh
node scripts/generate-manifest.mjs --broker ls
node scripts/validate-manifest.mjs
node scripts/validate-docs.mjs
node --test
node examples/mock-clients.mjs
```

브로커 한정 생성은 다른 manifest와 합계 summary를 수정하지 않는다. 전체 생성 명령의 기존 동작은 유지한다. 기본 docs 생성기는 현재 사이트 전체에 접속하므로 이 수정 검증에서는 실행하지 않는다. 기존5월 docs snapshot도 새 사이트 전체를 검증한 문서로 표시하지 않는다.

`registry.getUsagePolicy("ls")`는 정책의 복사본을 반환한다. 계좌/앱키 세션3개(10월31일08시 적용 공지), 최종 구독200개(실제 시행 미확인)를 구분한다. 기존 perSecond 숫자는 그대로이며 최신 전체 REST 제한을 알아냈다는 뜻이 아니다. **정책 조회 API는 강제 limiter가 아니다.** 다른 장비/프로세스를 포함한 공유 조정은 외부 owner가 담당해야 한다. 모르는 브로커 정책은 UNKNOWN으로 반환한다.

## 공식 근거

- [10월 정규장 입력 추가](https://openapi.ls-sec.co.kr/community/10000000-0000-0011-0000-000000000001/posts/90fd71b7-edf5-42bd-92db-700be878b78f)
- [9월 KRX 세션 필드 추가](https://openapi.ls-sec.co.kr/community/10000000-0000-0011-0000-000000000001/posts/893e9427-0cd8-4706-a1d2-b11fd833e2e1)
- [1차 세션 제한](https://openapi.ls-sec.co.kr/community/10000000-0000-0011-0000-000000000001/posts/03f7e4d4-cdb3-4276-a7b6-0f27ca5ebfb5)
- [최종 구독 정책 발표](https://openapi.ls-sec.co.kr/community/10000000-0000-0011-0000-000000000001/posts/043f99f1-271c-4d00-93e4-21b1fbff8de0)
