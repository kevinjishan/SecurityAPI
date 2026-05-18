# 증권사 Open API Markdown 레퍼런스

생성 시각: 2026-05-18T05:16:18.548Z

이 문서는 공식 공개 API 문서를 AI 코딩 시 빠르게 검색하고 인용하기 쉽도록 작은 Markdown 파일 단위로 재구성한 레퍼런스입니다. 원본 JSON 스냅샷은 `data/raw/`에 보존합니다.

## 범위

| 증권사 | API/문서 수 | 추가 항목 | 공식 출처 |
| --- | ---: | ---: | --- |
| 키움증권 | 207개 API | 오류코드 33개 | https://openapi.kiwoom.com/guide/apiguide?dummyVal=0 |
| LS증권 | 41개 API 페이지 / 365개 TR | 8개 그룹 | https://openapi.ls-sec.co.kr/apiservice?group_id=ffd2def7-a118-40f7-a0ab-cd4c6a538a90&api_id=33bd887a-6652-4209-88cd-5324bc7c5e36 |

## 검색 가이드

- API ID/TR 코드로 찾기: `rg "ka10001|t1101|token" docs/`
- 요청/응답 필드로 찾기: `rg "종목코드|authorization|cont-yn" docs/`
- 증권사별 보기: [키움증권](kiwoom/README.md), [LS증권](ls/README.md)
- SDK 확장 계획: [SecurityAPI SDK Architecture Plan](sdk-architecture-plan.md)

## 생성 규칙

- 빈 값은 추측하지 않고 `-` 또는 `문서 미기재`로 표기합니다.
- 원문 필드명, API ID, TR 코드, URL은 공식 문서 값을 유지합니다.
- 로그인 후 접근 자료나 실제 주문/조회 호출은 사용하지 않습니다.
