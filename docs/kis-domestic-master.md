# KIS 공개 국내 종목 마스터

parseKisDomesticStockMaster(input, {market: 'kospi'|'kosdaq'})는 공식 공개 CP949 종목 파일의 형식을 해석한다. input은 Uint8Array 또는 이미 디코딩한 문자열이다. 네트워크·인증·계좌·주문·캐시 동작은 없다. 다운로드/ZIP 경계와 저장·수신시각은 호출자가 책임진다.

공식 형식 근거: [KIS 저장소](https://github.com/koreainvestment/open-trading-api/tree/3a9be59a3ed8745720dc3aa9d584bdf3b7830362/stocks_info). 코스피/코스닥 .h 및 Python parser의 필드 순서·폭을 사용하며 tail은 각각227/221문자다. 공식 SHA는 schema에 보존한다. 공식 예제의 TLS 검증 해제와 extractall 패턴은 이 구현에서 사용하지 않는다.

우선주 구분0/1/2와 ST 그룹, ETP/ETF·SPAC 필드로 종류를 구분한다. ST의 비적용 ETP 공란은 group/명시적 우선주·SPAC 필드와 함께 처리하며, 알 수 없는 우선주/상태는 UNKNOWN으로 남긴다. 이름·단축코드 끝자리로 보통주를 추정하지 않는다. 현재 정상 보통주에 한해 currentEligible=true이고 거래정지·관리·정리매매를 제외한다. 이 값은 현재 참조 자료의 필터이며 전략 전체 적격성 판정이 아니다.

공개 파일: https://new.real.download.dws.co.kr/common/master/kospi_code.mst.zip 및 kosdaq_code.mst.zip. 조회시각/원문hash를 별도로 보존하고 갱신 시각을 과거 공개시각으로 소급하지 않는다. 역사 시점 종목군·상폐 목록 전체를 제공했다고 주장하지 않는다.
