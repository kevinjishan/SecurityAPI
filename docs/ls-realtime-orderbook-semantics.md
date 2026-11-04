# LS 실시간 호가 의미

H1_·HA_는 KRX의 KOSPI·KOSDAQ 호가로 식별한다. UH1은 통합 호가이며 KRX 단일 거래소 호가로 바꾸지 않는다. 정규화는 가격/잔량을 읽기 위한 계약이고 거래 가능성 또는 실체결 보증이 아니다.

공식 근거: [LS 전체 TR 안내 JSON](https://openapi.ls-sec.co.kr/api/apis/public/tr-guides.json)의 H1_/HA_/UH1/JIF. 2026-11-04 확인 사본 SHA256: 9aaca437f192511516374c800e039bf208ee3e5d8563eb8676750f4137c37b7f.

| 필드 | H1_/HA_ | UH1 |
|---|---|---|
| venue | KRX | CONSOLIDATED |
| market | kospi / kosdaq | null |
| asks/bids quantity | offerremN / bidremN | unt_offerremN / unt_bidremN |
| totals quantity | totofferrem / totbidrem | unt_totofferrem / unt_totbidrem |
| quantityByVenue | 없음 | krx/nxt 각 10단계 수량과 총수량 |
| sessionCodes | krx: donsigubun | krx_donsigubun / nxt_donsigubun |

UH1의 공통 가격을 거래소별 최우선 가격으로 간주하지 않는다. 통합 잔량이 없으면 일반 잔량 필드로 대신 채우지 않는다. 가격·수량의 Raw 문자열은 유지한다. 기존 일반 숫자 정규화는 편의 출력이므로 실행 소비자는 부호·소수·범위·교차 호가 등을 별도로 검증해야 한다.

sourceTime은 value=hotime, format=HHmmss, timeZone=Asia/Seoul, precision=second, date=null, sequence=null이다. 원문에 없는 날짜·밀리초·브로커 순번을 수신 시각으로 만들지 않는다. timestamp는 기존 hotime 값을 유지한다.

sessionCodes와 allocationCode는 원문 코드다. instrumentTradability=null이며 동시호가 구분만 보고 종목별 거래 가능을 인증하지 않는다. 공식 문서 H1_의 donsigubun은 1 장중, 2 시간외, 3 장전/장중/장마감이다. 장 상태·정지·분배·세션·일자와 당시 이용 가능 근거는 소비자의 별도 검증이 필요하다.

JIF jangubun=3은 KRX로 식별한다. JIF 공식 응답에는 날짜/시각/순번이 없어 sourceTime=null이다. 호환용 time 필드가 있더라도 공식 원천 시각 인증으로 사용하지 않는다.

이번 수정은 읽기 정규화만 변경한다. 인증·구독·재접속·공유 호출 제한·주문 경로를 새로 실행하거나 호출 상한이 '-'인 항목을 무제한으로 해석하지 않는다. 실제 운용 전 구독/재인증 예산과 기존 호출자 조정을 별도로 확인해야 한다.
