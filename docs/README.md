# 증권사 Open API Markdown 레퍼런스

생성 시각: 2026-05-18T05:16:18.548Z

이 문서는 공식 공개 API 문서를 AI 코딩 시 빠르게 검색하고 인용하기 쉽도록 작은 Markdown 파일 단위로 재구성한 레퍼런스입니다. 원본 JSON 스냅샷은 `data/raw/`에 보존합니다.

SDK 구현에서 직접 참조하기 쉬운 정규화 manifest는 `data/generated/kiwoom-manifest.json`, `data/generated/ls-manifest.json`, `data/generated/broker-manifest-summary.json`에 생성합니다.

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
- SDK manifest 찾기: `jq '.apis.ka10001' data/generated/kiwoom-manifest.json`, `jq '.apis.t1101' data/generated/ls-manifest.json`

## 생성 규칙

- 빈 값은 추측하지 않고 `-` 또는 `문서 미기재`로 표기합니다.
- 원문 필드명, API ID, TR 코드, URL은 공식 문서 값을 유지합니다.
- 로그인 후 접근 자료나 실제 주문/조회 호출은 사용하지 않습니다.

## Manifest 검증

```bash
npm run generate:manifest
npm run validate:manifest
```

검증은 키움 207개 API/33개 오류코드, LS 8개 그룹/41개 API 페이지/365개 TR 카운트와 주요 샘플 항목의 필드 수를 확인합니다.

## Metadata Registry

SDK 코드에서는 Markdown이나 raw JSON 대신 Metadata Registry를 사용합니다.

```js
import { createMetadataRegistry } from "security-api-reference/metadata";

const registry = await createMetadataRegistry();
registry.requireEntry("kiwoom", "ka10001");
registry.getEndpoint("ls", "t1101");
registry.getRequestFields("kiwoom", "ka10001");
```
