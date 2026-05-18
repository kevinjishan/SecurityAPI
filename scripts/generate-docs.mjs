import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, "docs");
const RAW_DIR = path.join(ROOT, "data", "raw");

const SCRAPED_AT = new Date().toISOString();

const KIWOOOM_GUIDE_URL = "https://openapi.kiwoom.com/guide/apiguide?dummyVal=0";
const KIWOOOM_BASE = "https://openapi.kiwoom.com";
const LS_GUIDE_URL =
  "https://openapi.ls-sec.co.kr/apiservice?group_id=ffd2def7-a118-40f7-a0ab-cd4c6a538a90&api_id=33bd887a-6652-4209-88cd-5324bc7c5e36";
const LS_BASE = "https://openapi.ls-sec.co.kr";

async function main() {
  await resetGeneratedDirs();

  console.log("Fetching Kiwoom source data...");
  const kiwoom = await fetchKiwoom();
  console.log(`Kiwoom: ${kiwoom.apis.length} APIs, ${kiwoom.errors.length} error codes`);

  console.log("Fetching LS source data...");
  const ls = await fetchLs();
  console.log(
    `LS: ${ls.groups.length} groups, ${ls.apis.length} API pages, ${ls.trs.length} TRs`,
  );

  await writeRawData(kiwoom, ls);
  await writeDocs(kiwoom, ls);

  console.log("Done. Generated docs/ and data/raw/.");
}

async function resetGeneratedDirs() {
  await fs.rm(DOCS_DIR, { recursive: true, force: true });
  await fs.rm(RAW_DIR, { recursive: true, force: true });
  await ensureDir(DOCS_DIR);
  await ensureDir(RAW_DIR);
}

async function fetchKiwoom() {
  const apiInfo = await fetchJson(`${KIWOOOM_BASE}/guide/getApiInfoListAjax`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: new URLSearchParams(),
  });

  const errorCodes = await fetchJson(`${KIWOOOM_BASE}/errorcode/getErrorCodeListAjax`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: new URLSearchParams(),
  });

  if (apiInfo.resp_code !== "0") {
    throw new Error(`Kiwoom API list failed: ${apiInfo.resp_msg || apiInfo.resp_code}`);
  }
  if (errorCodes.resp_code !== "0") {
    throw new Error(`Kiwoom error code list failed: ${errorCodes.resp_msg || errorCodes.resp_code}`);
  }

  const apis = [...apiInfo.resp_data].sort((a, b) =>
    compareText(
      `${a.apiInfo?.grpCodeNm ?? ""}/${a.apiInfo?.jobTpNm ?? ""}/${a.apiInfo?.apiId ?? ""}`,
      `${b.apiInfo?.grpCodeNm ?? ""}/${b.apiInfo?.jobTpNm ?? ""}/${b.apiInfo?.apiId ?? ""}`,
    ),
  );

  return {
    sourceUrl: KIWOOOM_GUIDE_URL,
    apiInfo,
    errorCodes,
    apis,
    errors: errorCodes.resp_data ?? [],
  };
}

async function fetchLs() {
  const html = await fetchText(LS_GUIDE_URL);
  const menu = parseLsMenu(html);
  const propertyTypesRaw = await fetchJson(`${LS_BASE}/api/codes/public/property_type`);
  const propertyTypeMap = Object.fromEntries(
    (propertyTypesRaw.codes ?? []).map((record) => [record.key, record.value]),
  );

  const apiListsByGroup = {};
  const apiDetailsById = {};
  const trsByApiId = {};
  const propertiesByTrId = {};
  const apis = [];
  const trs = [];

  for (const group of menu.groups) {
    apiListsByGroup[group.id] = await fetchJson(`${LS_BASE}/api/apis/public/api-list/${group.id}`);

    for (const apiMenu of group.apis) {
      const detail = await fetchJson(`${LS_BASE}/api/apis/public/${apiMenu.id}`);
      const trList = await fetchJson(`${LS_BASE}/api/apis/guide/tr/${apiMenu.id}`);
      apiDetailsById[apiMenu.id] = detail;
      trsByApiId[apiMenu.id] = trList;

      const api = {
        ...apiMenu,
        groupId: group.id,
        groupName: group.name,
        detail,
      };
      apis.push(api);

      for (const tr of trList) {
        trs.push({
          ...tr,
          apiId: apiMenu.id,
          apiName: apiMenu.name,
          groupId: group.id,
          groupName: group.name,
        });
      }
    }
  }

  await mapLimit(trs, 8, async (tr) => {
    propertiesByTrId[tr.id] = await fetchJson(`${LS_BASE}/api/apis/guide/tr/property/${tr.id}`);
  });

  return {
    sourceUrl: LS_GUIDE_URL,
    html,
    menu,
    groups: menu.groups,
    apis,
    trs,
    propertyTypesRaw,
    propertyTypeMap,
    apiListsByGroup,
    apiDetailsById,
    trsByApiId,
    propertiesByTrId,
  };
}

function parseLsMenu(html) {
  const groupNameById = new Map();
  const groupRe =
    /<li id="([0-9a-f-]{36})">\s*<ul class="second-depth">\s*<li>\s*<a>([^<]+)<\/a>/g;
  for (const match of html.matchAll(groupRe)) {
    groupNameById.set(match[1], cleanInline(match[2]));
  }

  const apisByGroup = new Map();
  const apiRe =
    /goLeftMenuUrl\(&quot;([0-9a-f-]{36})&quot;,\s*&quot;([0-9a-f-]{36})&quot;[^)]*\)">([^<]+)<\/a>/g;
  for (const match of html.matchAll(apiRe)) {
    const [, groupId, apiId, apiName] = match;
    if (!apisByGroup.has(groupId)) {
      apisByGroup.set(groupId, []);
    }
    apisByGroup.get(groupId).push({
      id: apiId,
      name: cleanInline(apiName),
    });
  }

  const groups = [...apisByGroup.entries()].map(([id, apis]) => ({
    id,
    name: groupNameById.get(id) ?? id,
    apis,
  }));

  if (groups.length === 0) {
    throw new Error("Could not parse LS API menu.");
  }

  return { sourceUrl: LS_GUIDE_URL, groups };
}

async function writeRawData(kiwoom, ls) {
  await ensureDir(path.join(RAW_DIR, "kiwoom"));
  await ensureDir(path.join(RAW_DIR, "ls"));

  await writeJson(path.join(RAW_DIR, "kiwoom", "api-info-list.json"), kiwoom.apiInfo);
  await writeJson(path.join(RAW_DIR, "kiwoom", "error-codes.json"), kiwoom.errorCodes);

  await writeJson(path.join(RAW_DIR, "ls", "menu.json"), ls.menu);
  await writeJson(path.join(RAW_DIR, "ls", "api-lists-by-group.json"), ls.apiListsByGroup);
  await writeJson(path.join(RAW_DIR, "ls", "api-details-by-id.json"), ls.apiDetailsById);
  await writeJson(path.join(RAW_DIR, "ls", "trs-by-api-id.json"), ls.trsByApiId);
  await writeJson(path.join(RAW_DIR, "ls", "properties-by-tr-id.json"), ls.propertiesByTrId);
  await writeJson(path.join(RAW_DIR, "ls", "property-types.json"), ls.propertyTypesRaw);
}

async function writeDocs(kiwoom, ls) {
  await writeDocsReadme(kiwoom, ls);
  await writeKiwoomDocs(kiwoom);
  await writeLsDocs(ls);
}

async function writeDocsReadme(kiwoom, ls) {
  const content = `# 증권사 Open API Markdown 레퍼런스

생성 시각: ${SCRAPED_AT}

이 문서는 공식 공개 API 문서를 AI 코딩 시 빠르게 검색하고 인용하기 쉽도록 작은 Markdown 파일 단위로 재구성한 레퍼런스입니다. 원본 JSON 스냅샷은 \`data/raw/\`에 보존합니다.

## 범위

| 증권사 | API/문서 수 | 추가 항목 | 공식 출처 |
| --- | ---: | ---: | --- |
| 키움증권 | ${kiwoom.apis.length}개 API | 오류코드 ${kiwoom.errors.length}개 | ${KIWOOOM_GUIDE_URL} |
| LS증권 | ${ls.apis.length}개 API 페이지 / ${ls.trs.length}개 TR | ${ls.groups.length}개 그룹 | ${LS_GUIDE_URL} |

## 검색 가이드

- API ID/TR 코드로 찾기: \`rg "ka10001|t1101|token" docs/\`
- 요청/응답 필드로 찾기: \`rg "종목코드|authorization|cont-yn" docs/\`
- 증권사별 보기: [키움증권](kiwoom/README.md), [LS증권](ls/README.md)

## 생성 규칙

- 빈 값은 추측하지 않고 \`-\` 또는 \`문서 미기재\`로 표기합니다.
- 원문 필드명, API ID, TR 코드, URL은 공식 문서 값을 유지합니다.
- 로그인 후 접근 자료나 실제 주문/조회 호출은 사용하지 않습니다.
`;

  await writeText(path.join(DOCS_DIR, "README.md"), content);
}

async function writeKiwoomDocs(kiwoom) {
  const baseDir = path.join(DOCS_DIR, "kiwoom");
  await ensureDir(baseDir);

  const categories = groupBy(kiwoom.apis, (api) => api.apiInfo?.jobTpNm ?? "미분류");
  const groupCounts = groupBy(kiwoom.apis, (api) => api.apiInfo?.grpCodeNm ?? "미분류");

  let readme = `# 키움증권 REST API 레퍼런스

생성 시각: ${SCRAPED_AT}

- 공식 출처: ${KIWOOOM_GUIDE_URL}
- API 수: ${kiwoom.apis.length}
- 오류코드 수: ${kiwoom.errors.length}
- 운영 도메인과 모의투자 도메인은 각 API 문서의 원문 값을 따릅니다.

## 대분류

| 대분류 | API 수 |
| --- | ---: |
${[...groupCounts.entries()]
  .map(([name, rows]) => `| ${mdCell(name)} | ${rows.length} |`)
  .join("\n")}

## 중분류별 API

`;

  for (const [category, rows] of [...categories.entries()].sort(([a], [b]) => compareText(a, b))) {
    readme += `### ${category}\n\n| API ID | API 명 | Method | URL |\n| --- | --- | --- | --- |\n`;
    for (const api of rows.sort((a, b) => compareText(a.apiInfo?.apiId, b.apiInfo?.apiId))) {
      const info = api.apiInfo ?? {};
      const docPath = kiwoomDocRelativePath(api);
      readme += `| [${mdCell(info.apiId)}](${docPath}) | ${mdCell(info.apiNm)} | ${mdCell(info.jobMethod)} | \`${mdCell(info.svcUri)}\` |\n`;
    }
    readme += "\n";
  }

  await writeText(path.join(baseDir, "README.md"), readme);
  await writeKiwoomErrors(path.join(baseDir, "errors.md"), kiwoom.errors);

  for (const api of kiwoom.apis) {
    const filePath = path.join(baseDir, kiwoomDocRelativePath(api));
    await ensureDir(path.dirname(filePath));
    await writeText(filePath, renderKiwoomApi(api));
  }
}

function kiwoomDocRelativePath(api) {
  const info = api.apiInfo ?? {};
  const category = slugify(info.jobTpNm ?? "uncategorized");
  const fileName = `${slugify(info.apiId ?? "unknown")}-${slugify(info.apiNm ?? "api")}.md`;
  return `${category}/${fileName}`;
}

async function writeKiwoomErrors(filePath, errors) {
  const rows = [...errors].sort((a, b) => compareText(a.errorCode, b.errorCode));
  const content = `# 키움증권 오류코드

생성 시각: ${SCRAPED_AT}

공식 출처: ${KIWOOOM_GUIDE_URL}

| 오류코드 | 사용자 표시 코드 | 메시지 | 메시지 표시 | 실패 횟수 적용 |
| --- | --- | --- | --- | --- |
${rows
  .map(
    (row) =>
      `| ${mdCell(row.errorCode)} | ${mdCell(row.userIndcErrorCode)} | ${mdCell(row.errorMsg)} | ${mdCell(row.errorMsgIndcYn)} | ${mdCell(row.failCntAplcYn)} |`,
  )
  .join("\n")}
`;
  await writeText(filePath, content);
}

function renderKiwoomApi(api) {
  const info = api.apiInfo ?? {};
  const commonHeader = api.commonHeader ?? [];
  const io = api.apiTrIo ?? [];
  const requestHeader = commonHeader.filter((item) => item.inptOutputTp === "I");
  const responseHeader = commonHeader.filter((item) => item.inptOutputTp === "O");
  const requestBody = io.filter((item) => item.inptOutputTp === "I");
  const responseBody = io.filter((item) => item.inptOutputTp === "O");
  const requestCount = requestHeader.length + requestBody.length;
  const responseCount = responseHeader.length + responseBody.length;
  const authRequired =
    info.svcUri !== "/oauth2/token" &&
    requestHeader.some((item) => String(item.itemId).toLowerCase() === "authorization");

  return `---
broker: "키움증권"
source_url: "${yamlEscape(KIWOOOM_GUIDE_URL)}"
scraped_at: "${SCRAPED_AT}"
category: "${yamlEscape(info.jobTpNm ?? "-")}"
api_id: "${yamlEscape(info.apiId ?? "-")}"
api_name: "${yamlEscape(info.apiNm ?? "-")}"
method: "${yamlEscape(info.jobMethod ?? "-")}"
domain: "${yamlEscape(info.jobRealDomain ?? "-")}"
path: "${yamlEscape(info.svcUri ?? "-")}"
content_type: "${yamlEscape(info.jobContentType ?? "-")}"
rate_limit: "-"
auth_required: ${authRequired}
---

# ${safeTitle(info.apiNm)} (${safeTitle(info.apiId)})

<!-- request_field_count: ${requestCount} -->
<!-- response_field_count: ${responseCount} -->

## 요약

| 항목 | 값 |
| --- | --- |
| 메뉴 위치 | ${mdCell(`${info.grpCodeNm ?? "-"} > ${info.jobTpNm ?? "-"} > ${info.apiNm ?? "-"}`)} |
| API ID | \`${mdCell(info.apiId)}\` |
| 전송 방식 | ${mdCell(info.svcTransTp)} |
| 설명 | ${mdCell(info.apiDc || info.jobTpDc || "문서 미기재")} |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | ${mdCell(info.jobMethod)} |
| 운영 도메인 | \`${mdCell(info.jobRealDomain)}\` |
| 개발 도메인 | \`${mdCell(info.jobDevDomain)}\` |
| 모의투자 도메인 | \`${mdCell(info.jobSimulateDomain)}\` |
| URL | \`${mdCell(info.svcUri)}\` |
| Format | ${mdCell(info.jobFormat)} |
| Content-Type | ${mdCell(info.jobContentType)} |

## 인증/헤더

${renderFieldTable(requestHeader, "헤더")}

## 요청

${renderFieldTable(requestBody, "Body")}

## 응답

### 헤더

${renderFieldTable(responseHeader, "헤더")}

### Body

${renderFieldTable(responseBody, "Body")}

## 예제

### Request

\`\`\`json
${codeFenceJson(buildKiwoomRequestExample(requestBody))}
\`\`\`

### Response

\`\`\`${isValidJsonString(info.rsltData) ? "json" : "text"}
${codeFenceText(formatKiwoomResponseExample(info.rsltData))}
\`\`\`

## 연속조회/실시간/주의사항

- 연속조회는 응답 헤더 \`cont-yn\`, \`next-key\`가 문서에 있는 경우 해당 값을 다음 요청 헤더에 반영합니다.
- 실시간 API는 공식 문서의 API 설명과 요청/응답 필드 구조를 우선합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- [키움증권 오류코드](../errors.md)
`;
}

function buildKiwoomRequestExample(requestBody) {
  const result = {};
  let listTarget = null;
  for (const item of requestBody) {
    if (item.listYn === "Y") {
      result[item.itemId] = [{}];
      listTarget = result[item.itemId][0];
    } else if (listTarget) {
      listTarget[item.itemId] = item.sampData ?? "";
    } else {
      result[item.itemId] = item.sampData ?? "";
    }
  }
  return result;
}

function formatKiwoomResponseExample(value) {
  if (value == null || value === "") {
    return "문서 미기재";
  }
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return String(value).replaceAll("\t", "    ");
  }
}

async function writeLsDocs(ls) {
  const baseDir = path.join(DOCS_DIR, "ls");
  await ensureDir(baseDir);

  let readme = `# LS증권 OPEN API 레퍼런스

생성 시각: ${SCRAPED_AT}

- 공식 출처: ${LS_GUIDE_URL}
- 그룹 수: ${ls.groups.length}
- API 페이지 수: ${ls.apis.length}
- TR 수: ${ls.trs.length}

## 그룹

| 그룹 | API 페이지 수 | TR 수 |
| --- | ---: | ---: |
${ls.groups
  .map((group) => {
    const apiCount = group.apis.length;
    const trCount = ls.trs.filter((tr) => tr.groupId === group.id).length;
    return `| ${mdCell(group.name)} | ${apiCount} | ${trCount} |`;
  })
  .join("\n")}

## API 페이지

`;

  const usedPaths = new Set();
  const docPathByTrId = new Map();

  for (const group of ls.groups) {
    readme += `### ${group.name}\n\n| API 페이지 | TR 수 | 문서 |\n| --- | ---: | --- |\n`;
    for (const apiMenu of group.apis) {
      const trRows = ls.trs.filter((tr) => tr.apiId === apiMenu.id);
      const firstDoc = trRows[0] ? lsDocRelativePath(group, apiMenu, trRows[0], usedPaths, true) : "";
      readme += `| ${mdCell(apiMenu.name)} | ${trRows.length} | ${firstDoc ? `[첫 TR](${firstDoc})` : "-"} |\n`;
    }
    readme += "\n";
  }

  await writeText(path.join(baseDir, "README.md"), readme);

  usedPaths.clear();
  for (const tr of ls.trs) {
    const group = ls.groups.find((item) => item.id === tr.groupId);
    const apiMenu = group.apis.find((item) => item.id === tr.apiId);
    const relativePath = lsDocRelativePath(group, apiMenu, tr, usedPaths, false);
    docPathByTrId.set(tr.id, relativePath);
    const filePath = path.join(baseDir, relativePath);
    await ensureDir(path.dirname(filePath));
    await writeText(filePath, renderLsTr(ls, group, apiMenu, tr));
  }
}

function lsDocRelativePath(group, apiMenu, tr, usedPaths, previewOnly) {
  const groupSlug = slugify(group.name);
  const apiSlug = slugify(apiMenu.name);
  const trCode = slugify(tr.trCode || tr.id);
  const trName = slugify(tr.trName || "tr");
  let relativePath = `${groupSlug}/${apiSlug}/${trCode}-${trName}.md`;
  let index = 2;
  while (usedPaths.has(relativePath)) {
    relativePath = `${groupSlug}/${apiSlug}/${trCode}-${trName}-${index}.md`;
    index += 1;
  }
  if (!previewOnly) {
    usedPaths.add(relativePath);
  }
  return relativePath;
}

function renderLsTr(ls, group, apiMenu, tr) {
  const detail = ls.apiDetailsById[tr.apiId] ?? {};
  const properties = ls.propertiesByTrId[tr.id] ?? [];
  const reqHeader = sortLsProperties(properties.filter((item) => item.bodyType === "req_h"));
  const reqBody = sortLsProperties(properties.filter((item) => item.bodyType === "req_b"));
  const resHeader = sortLsProperties(properties.filter((item) => item.bodyType === "res_h"));
  const resBody = sortLsProperties(properties.filter((item) => item.bodyType === "res_b"));
  const requestCount = reqHeader.length + reqBody.length;
  const responseCount = resHeader.length + resBody.length;
  const sourceUrl = `${LS_BASE}/apiservice?group_id=${encodeURIComponent(group.id)}&api_id=${encodeURIComponent(apiMenu.id)}`;
  const authRequired = detail.accessUrl !== "/oauth2/token";

  return `---
broker: "LS증권"
source_url: "${yamlEscape(sourceUrl)}"
scraped_at: "${SCRAPED_AT}"
category: "${yamlEscape(group.name)}"
api_id: "${yamlEscape(apiMenu.id)}"
api_name: "${yamlEscape(apiMenu.name)}"
tr_id: "${yamlEscape(tr.id)}"
tr_code: "${yamlEscape(tr.trCode ?? "-")}"
method: "${yamlEscape(detail.httpMethod ?? "-")}"
domain: "${yamlEscape(detail.domain ?? "-")}"
path: "${yamlEscape(detail.accessUrl ?? "-")}"
content_type: "${yamlEscape(detail.contentType ?? "-")}"
rate_limit: "${yamlEscape(tr.transactionPerSec ?? "-")}"
auth_required: ${authRequired}
---

# ${safeTitle(tr.trName)} (${safeTitle(tr.trCode)})

<!-- request_field_count: ${requestCount} -->
<!-- response_field_count: ${responseCount} -->

## 요약

| 항목 | 값 |
| --- | --- |
| 그룹 | ${mdCell(group.name)} |
| API 페이지 | ${mdCell(apiMenu.name)} |
| TR명 | ${mdCell(tr.trName)} |
| TR코드 | \`${mdCell(tr.trCode)}\` |
| 초당 전송 건수 | ${mdCell(tr.transactionPerSec)} |
| 설명 | ${mdCell(detail.description || "문서 미기재")} |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Protocol | ${mdCell(detail.protocolType)} |
| Method | ${mdCell(detail.httpMethod)} |
| 운영 도메인 | \`${mdCell(detail.domain)}\` |
| 모의투자 도메인 | \`${mdCell(detail.simulatedDomain)}\` |
| URL | \`${mdCell(detail.accessUrl)}\` |
| Request Format | ${mdCell(detail.reqFormat)} |
| Content-Type | ${mdCell(detail.contentType)} |

## 인증/헤더

${renderLsFieldTable(reqHeader, ls.propertyTypeMap, "Request Header")}

## 요청

${renderLsFieldTable(reqBody, ls.propertyTypeMap, "Request Body")}

## 응답

### 헤더

${renderLsFieldTable(resHeader, ls.propertyTypeMap, "Response Header")}

### Body

${renderLsFieldTable(resBody, ls.propertyTypeMap, "Response Body")}

## 예제

### Request

\`\`\`${isValidJsonString(tr.reqExample) ? "json" : "text"}
${codeFenceText(formatExample(tr.reqExample))}
\`\`\`

### Response

\`\`\`${isValidJsonString(tr.resExample) ? "json" : "text"}
${codeFenceText(formatExample(tr.resExample))}
\`\`\`

## 연속조회/실시간/주의사항

- \`transactionPerSec\` 값은 공식 문서의 초당 전송 건수 원문입니다.
- 실시간 시세 TR은 그룹/문서명과 필드 구조를 기준으로 구분합니다.
- 빈 값은 공식 문서에 값이 없음을 의미합니다.

## 관련 오류

- LS증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.
`;
}

function renderFieldTable(rows, location) {
  if (!rows || rows.length === 0) {
    return "문서 미기재";
  }
  const sorted = [...rows].sort((a, b) => compareNumberThenText(a.sortOrd, b.sortOrd, a.itemId, b.itemId));
  return `| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 샘플 | 설명 |
| --- | --- | --- | --- | --- | --- | --- | --- |
${sorted
  .map(
    (row) =>
      `| ${mdCell(location)} | \`${mdCell(row.itemId)}\` | ${mdCell(row.itemNm)} | ${mdCell(row.type)} | ${mdCell(row.esntYn)} | ${mdCell(row.lngt)} | ${mdCell(row.sampData)} | ${mdCell(row.itemDc)} |`,
  )
  .join("\n")}`;
}

function renderLsFieldTable(rows, propertyTypeMap, location) {
  if (!rows || rows.length === 0) {
    return "문서 미기재";
  }
  return `| 위치 | 필드 | 이름 | 타입 | 필수 | 길이 | 설명 |
| --- | --- | --- | --- | --- | --- | --- |
${rows
  .map((row) => {
    const type = propertyTypeMap[row.propertyType] ?? row.propertyType;
    return `| ${mdCell(location)} | \`${mdCell(row.propertyCd)}\` | ${mdCell(row.propertyNm)} | ${mdCell(type)} | ${mdCell(row.requireYn)} | ${mdCell(row.propertyLength)} | ${mdCell(row.description)} |`;
  })
  .join("\n")}`;
}

function sortLsProperties(rows) {
  return [...rows].sort((a, b) =>
    compareNumberThenText(a.propertyOrder, b.propertyOrder, a.propertyCd, b.propertyCd),
  );
}

function formatExample(value) {
  if (value == null || value === "") {
    return "문서 미기재";
  }
  if (isJsonLike(value)) {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

async function fetchJson(url, options = {}, retries = 3) {
  const text = await fetchText(url, options, retries);
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${url}: ${error.message}`);
  }
}

async function fetchText(url, options = {}, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Accept: "application/json, text/html, */*",
          "User-Agent": "SecurityAPI-doc-generator/1.0",
          ...(options.headers ?? {}),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(300 * attempt);
      }
    }
  }
  throw new Error(`Failed to fetch ${url}: ${lastError.message}`);
}

async function mapLimit(items, limit, worker) {
  const executing = new Set();
  const results = [];
  for (const item of items) {
    const promise = Promise.resolve().then(() => worker(item));
    results.push(promise);
    executing.add(promise);
    promise.finally(() => executing.delete(promise));
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

function groupBy(rows, getKey) {
  const map = new Map();
  for (const row of rows) {
    const key = getKey(row);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(row);
  }
  return map;
}

function slugify(value) {
  return (
    String(value ?? "unknown")
      .trim()
      .toLowerCase()
      .replace(/&amp;/g, "and")
      .replace(/[\/\\?%*:|"<>[\]()]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "unknown"
  );
}

function mdCell(value) {
  const text = cleanInline(value);
  if (text === "") {
    return "-";
  }
  return text.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function cleanInline(value) {
  if (value == null || value === "") {
    return "";
  }
  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&lt;br&gt;/gi, "\n")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function safeTitle(value) {
  const text = cleanInline(value);
  return text || "-";
}

function yamlEscape(value) {
  return String(value ?? "-").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function codeFenceText(value) {
  return String(value ?? "문서 미기재").replaceAll("```", "\\`\\`\\`");
}

function codeFenceJson(value) {
  return codeFenceText(JSON.stringify(value, null, 2));
}

function isJsonLike(value) {
  if (typeof value !== "string") {
    return false;
  }
  const trimmed = value.trim();
  return (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  );
}

function isValidJsonString(value) {
  if (!isJsonLike(value)) {
    return false;
  }
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

function compareText(a, b) {
  return String(a ?? "").localeCompare(String(b ?? ""), "ko");
}

function compareNumberThenText(aNumber, bNumber, aText, bText) {
  const aParsed = Number(aNumber);
  const bParsed = Number(bNumber);
  if (Number.isFinite(aParsed) && Number.isFinite(bParsed) && aParsed !== bParsed) {
    return aParsed - bParsed;
  }
  return compareText(aText, bText);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function writeText(filePath, content) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
