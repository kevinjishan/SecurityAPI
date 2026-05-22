import { promises as fs } from "node:fs";
import https from "node:https";
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
const DB_GUIDE_URL =
  "https://openapi.db-fi.com/apiservice?group_id=cc55b867-e049-421b-a798-be016370ff44&api_id=9e3097ab-7d39-4433-8002-00649604f0de";
const DB_BASE = "https://openapi.db-fi.com";
const KIS_GUIDE_URL = "https://apiportal.koreainvestment.com/apiservice-summary";
const KIS_SAMPLE_REPO_URL = "https://github.com/koreainvestment/open-trading-api";
const KIS_TREE_URL = "https://api.github.com/repos/koreainvestment/open-trading-api/git/trees/main?recursive=1";
const KIS_RAW_BASE = "https://raw.githubusercontent.com/koreainvestment/open-trading-api/main";

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

  console.log("Fetching DB source data...");
  const db = await fetchDb();
  console.log(`DB: ${db.groups.length} groups, ${db.apis.length} API pages, ${db.trs.length} TRs`);

  console.log("Fetching KIS source data...");
  const kis = await fetchKis();
  console.log(
    `KIS: ${kis.categories.length} categories, ${kis.apis.length} portal paths, ${Object.keys(kis.sampleMap.byApiUrl).length} sample-mapped paths`,
  );

  await writeRawData(kiwoom, ls, db, kis);
  await writeDocs(kiwoom, ls, db, kis);

  console.log("Done. Generated docs/ and data/raw/.");
}

async function resetGeneratedDirs() {
  for (const broker of ["kiwoom", "ls", "db", "kis"]) {
    await fs.rm(path.join(DOCS_DIR, broker), { recursive: true, force: true });
    await fs.rm(path.join(RAW_DIR, broker), { recursive: true, force: true });
  }
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

async function fetchDb() {
  const html = await fetchText(DB_GUIDE_URL, { allowInsecureTls: true });
  const menu = parsePortalMenu(html, DB_GUIDE_URL);
  const propertyTypesRaw = await fetchJson(`${DB_BASE}/api/codes/public/property_type`, {
    allowInsecureTls: true,
  });
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
    apiListsByGroup[group.id] = await fetchJson(`${DB_BASE}/api/apis/public/api-list/${group.id}`, {
      allowInsecureTls: true,
    });

    for (const apiMenu of group.apis) {
      const detail = await fetchJson(`${DB_BASE}/api/apis/public/${apiMenu.id}`, {
        allowInsecureTls: true,
      });
      const trList = await fetchJson(`${DB_BASE}/api/apis/guide/tr/${apiMenu.id}`, {
        allowInsecureTls: true,
      });
      apiDetailsById[apiMenu.id] = detail;
      trsByApiId[apiMenu.id] = trList;

      apis.push({
        ...apiMenu,
        groupId: group.id,
        groupName: group.name,
        detail,
      });

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
    propertiesByTrId[tr.id] = await fetchJson(`${DB_BASE}/api/apis/guide/tr/property/${tr.id}`, {
      allowInsecureTls: true,
    });
  });

  return {
    sourceUrl: DB_GUIDE_URL,
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

async function fetchKis() {
  const html = await fetchText(KIS_GUIDE_URL);
  const menu = parseKisMenu(html);
  const sampleMap = await fetchKisSampleMap(menu);

  return {
    sourceUrl: KIS_GUIDE_URL,
    html,
    categories: menu.categories,
    apis: menu.apis,
    menu,
    sampleMap,
  };
}

function parseLsMenu(html) {
  return parsePortalMenu(html, LS_GUIDE_URL);
}

function parsePortalMenu(html, sourceUrl) {
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
    throw new Error(`Could not parse API menu from ${sourceUrl}.`);
  }

  return { sourceUrl, groups };
}

function parseKisMenu(html) {
  const apiRe = /onclick="goLeftMenuUrl\(&#39;([^&]+)&#39;\)">\s*<span>([^<]+)<\/span>/g;
  const categoryRe =
    /<li class="snb-list-item"[^>]*>\s*<a href="javascript:;">\s*<span>([^<]+)<\/span>/g;
  const categoriesByName = new Map();
  const apis = [];

  for (const match of html.matchAll(apiRe)) {
    const before = html.slice(0, match.index);
    const categoryMatch = [...before.matchAll(categoryRe)].pop();
    const category = cleanInline(categoryMatch?.[1] ?? "uncategorized");

    if (!categoriesByName.has(category)) {
      categoriesByName.set(category, {
        id: slugify(category),
        name: category,
        apis: [],
      });
    }

    const api = {
      id: match[1].startsWith("/tryitout/") ? match[1].split("/").pop() : match[1],
      path: match[1],
      name: cleanInline(match[2]),
      category,
    };
    categoriesByName.get(category).apis.push(api);
    apis.push(api);
  }

  if (apis.length === 0) {
    throw new Error("Could not parse KIS API menu.");
  }

  return {
    sourceUrl: KIS_GUIDE_URL,
    categories: [...categoriesByName.values()],
    apis,
  };
}

async function fetchKisSampleMap(menu) {
  const tree = await fetchJson(KIS_TREE_URL);
  const portalPaths = new Set((menu.apis ?? []).map((api) => api.path));
  const paths = (tree.tree ?? [])
    .map((item) => item.path)
    .filter((filePath) => /examples_(llm|user)\/.*\.py$/.test(filePath) && !/\/chk_/.test(filePath));
  const byApiUrl = {};
  const files = {};

  await mapLimit(paths, 12, async (filePath) => {
    const text = await fetchText(`${KIS_RAW_BASE}/${encodeURI(filePath)}`);
    const apiUrl = matchPythonString(text, "API_URL");
    const trIds = [...new Set([...text.matchAll(/tr_id\s*=\s*["']([^"']+)["']/g)].map((match) => match[1]))];
    const params = extractKisParams(text);
    const postFlag = /postFlag\s*=\s*True/.test(text);

    files[filePath] = {
      apiUrl,
      trIds,
      params,
      postFlag,
    };

    if (!apiUrl || !portalPaths.has(apiUrl)) {
      return;
    }

    const record = byApiUrl[apiUrl] ?? {
      files: [],
      trIds: [],
      params: [],
      postFlag: false,
    };
    record.files.push(filePath);
    record.trIds = [...new Set([...record.trIds, ...trIds])];
    record.params = [...new Set([...record.params, ...params])];
    record.postFlag = record.postFlag || postFlag;
    byApiUrl[apiUrl] = record;
  });

  return {
    sourceRepo: KIS_SAMPLE_REPO_URL,
    byApiUrl,
    files,
  };
}

async function writeRawData(kiwoom, ls, db, kis) {
  await ensureDir(path.join(RAW_DIR, "kiwoom"));
  await ensureDir(path.join(RAW_DIR, "ls"));
  await ensureDir(path.join(RAW_DIR, "db"));
  await ensureDir(path.join(RAW_DIR, "kis"));

  await writeJson(path.join(RAW_DIR, "kiwoom", "api-info-list.json"), kiwoom.apiInfo);
  await writeJson(path.join(RAW_DIR, "kiwoom", "error-codes.json"), kiwoom.errorCodes);

  await writeJson(path.join(RAW_DIR, "ls", "menu.json"), ls.menu);
  await writeJson(path.join(RAW_DIR, "ls", "api-lists-by-group.json"), ls.apiListsByGroup);
  await writeJson(path.join(RAW_DIR, "ls", "api-details-by-id.json"), ls.apiDetailsById);
  await writeJson(path.join(RAW_DIR, "ls", "trs-by-api-id.json"), ls.trsByApiId);
  await writeJson(path.join(RAW_DIR, "ls", "properties-by-tr-id.json"), ls.propertiesByTrId);
  await writeJson(path.join(RAW_DIR, "ls", "property-types.json"), ls.propertyTypesRaw);

  await writeJson(path.join(RAW_DIR, "db", "menu.json"), db.menu);
  await writeJson(path.join(RAW_DIR, "db", "api-lists-by-group.json"), db.apiListsByGroup);
  await writeJson(path.join(RAW_DIR, "db", "api-details-by-id.json"), db.apiDetailsById);
  await writeJson(path.join(RAW_DIR, "db", "trs-by-api-id.json"), db.trsByApiId);
  await writeJson(path.join(RAW_DIR, "db", "properties-by-tr-id.json"), db.propertiesByTrId);
  await writeJson(path.join(RAW_DIR, "db", "property-types.json"), db.propertyTypesRaw);

  await writeJson(path.join(RAW_DIR, "kis", "menu.json"), kis.menu);
  await writeJson(path.join(RAW_DIR, "kis", "sample-map.json"), kis.sampleMap);
}

async function writeDocs(kiwoom, ls, db, kis) {
  await writeDocsReadme(kiwoom, ls, db, kis);
  await writeKiwoomDocs(kiwoom);
  await writeLsDocs(ls);
  await writeDbDocs(db);
  await writeKisDocs(kis);
}

async function writeDocsReadme(kiwoom, ls, db, kis) {
  const content = `# 증권사 Open API Markdown 레퍼런스

생성 시각: ${SCRAPED_AT}

이 문서는 공식 공개 API 문서를 AI 코딩 시 빠르게 검색하고 인용하기 쉽도록 작은 Markdown 파일 단위로 재구성한 레퍼런스입니다. 원본 JSON 스냅샷은 \`data/raw/\`에 보존합니다.

## 범위

| 증권사 | API/문서 수 | 추가 항목 | 공식 출처 |
| --- | ---: | ---: | --- |
| 키움증권 | ${kiwoom.apis.length}개 API | 오류코드 ${kiwoom.errors.length}개 | ${KIWOOOM_GUIDE_URL} |
| LS증권 | ${ls.apis.length}개 API 페이지 / ${ls.trs.length}개 TR | ${ls.groups.length}개 그룹 | ${LS_GUIDE_URL} |
| DB증권 | ${db.apis.length}개 API 페이지 / ${db.trs.length}개 TR | ${db.groups.length}개 그룹 | ${DB_GUIDE_URL} |
| 한국투자증권 | ${kis.apis.length}개 API path | ${Object.keys(kis.sampleMap.byApiUrl).length}개 path 샘플 매핑 | ${KIS_GUIDE_URL} |

## 검색 가이드

- API ID/TR 코드로 찾기: \`rg "ka10001|t1101|PRICE|FHKST01010100|token" docs/\`
- 요청/응답 필드로 찾기: \`rg "종목코드|authorization|cont-yn" docs/\`
- 증권사별 보기: [키움증권](kiwoom/README.md), [LS증권](ls/README.md), [DB증권](db/README.md), [한국투자증권](kis/README.md)

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

async function writeDbDocs(db) {
  const baseDir = path.join(DOCS_DIR, "db");
  await ensureDir(baseDir);

  let readme = `# DB증권 OPEN API 레퍼런스

생성 시각: ${SCRAPED_AT}

- 공식 출처: ${DB_GUIDE_URL}
- 그룹 수: ${db.groups.length}
- API 페이지 수: ${db.apis.length}
- TR 수: ${db.trs.length}
- DB증권 포털은 LS형 공개 JSON 구조를 사용하지만, 런타임 broker는 \`db\`로 분리합니다.

## 그룹

| 그룹 | API 페이지 수 | TR 수 |
| --- | ---: | ---: |
${db.groups
  .map((group) => {
    const apiCount = group.apis.length;
    const trCount = db.trs.filter((tr) => tr.groupId === group.id).length;
    return `| ${mdCell(group.name)} | ${apiCount} | ${trCount} |`;
  })
  .join("\n")}

## API 페이지

`;

  const usedPaths = new Set();

  for (const group of db.groups) {
    readme += `### ${group.name}\n\n| API 페이지 | TR 수 | 문서 |\n| --- | ---: | --- |\n`;
    for (const apiMenu of group.apis) {
      const trRows = db.trs.filter((tr) => tr.apiId === apiMenu.id);
      const firstDoc = trRows[0] ? lsDocRelativePath(group, apiMenu, trRows[0], usedPaths, true) : "";
      readme += `| ${mdCell(apiMenu.name)} | ${trRows.length} | ${firstDoc ? `[첫 TR](${firstDoc})` : "-"} |\n`;
    }
    readme += "\n";
  }

  await writeText(path.join(baseDir, "README.md"), readme);

  usedPaths.clear();
  for (const tr of db.trs) {
    const group = db.groups.find((item) => item.id === tr.groupId);
    const apiMenu = group.apis.find((item) => item.id === tr.apiId);
    const relativePath = lsDocRelativePath(group, apiMenu, tr, usedPaths, false);
    const filePath = path.join(baseDir, relativePath);
    await ensureDir(path.dirname(filePath));
    await writeText(filePath, renderPortalTr(db, group, apiMenu, tr, {
      brokerName: "DB증권",
      baseUrl: DB_BASE,
      relatedErrors: "- DB증권 오류 정책은 API 페이지의 설명과 응답 예제를 우선합니다.",
    }));
  }
}

async function writeKisDocs(kis) {
  const baseDir = path.join(DOCS_DIR, "kis");
  await ensureDir(baseDir);

  let readme = `# 한국투자증권 Open API 레퍼런스

생성 시각: ${SCRAPED_AT}

- 공식 출처: ${KIS_GUIDE_URL}
- 공식 샘플: ${KIS_SAMPLE_REPO_URL}
- 카테고리 수: ${kis.categories.length}
- API path 수: ${kis.apis.length}
- 샘플 매핑 path 수: ${Object.keys(kis.sampleMap.byApiUrl).length}

## 카테고리

| 카테고리 | API path 수 |
| --- | ---: |
${kis.categories.map((category) => `| ${mdCell(category.name)} | ${category.apis.length} |`).join("\n")}

## API path

`;

  for (const category of kis.categories) {
    readme += `### ${category.name}\n\n| API | Path | 샘플 TR ID | 문서 |\n| --- | --- | --- | --- |\n`;
    for (const api of category.apis) {
      const sample = kis.sampleMap.byApiUrl[api.path];
      readme += `| ${mdCell(api.name)} | \`${mdCell(api.path)}\` | ${mdCell((sample?.trIds ?? []).join(", "))} | [문서](${kisDocRelativePath(api)}) |\n`;
    }
    readme += "\n";
  }

  await writeText(path.join(baseDir, "README.md"), readme);

  for (const api of kis.apis) {
    const filePath = path.join(baseDir, kisDocRelativePath(api));
    await ensureDir(path.dirname(filePath));
    await writeText(filePath, renderKisApi(kis, api));
  }
}

function renderPortalTr(portal, group, apiMenu, tr, options) {
  const detail = portal.apiDetailsById[tr.apiId] ?? {};
  const properties = portal.propertiesByTrId[tr.id] ?? [];
  const reqHeader = sortLsProperties(properties.filter((item) => item.bodyType === "req_h"));
  const reqBody = sortLsProperties(properties.filter((item) => item.bodyType === "req_b"));
  const resHeader = sortLsProperties(properties.filter((item) => item.bodyType === "res_h"));
  const resBody = sortLsProperties(properties.filter((item) => item.bodyType === "res_b"));
  const requestCount = reqHeader.length + reqBody.length;
  const responseCount = resHeader.length + resBody.length;
  const sourceUrl = `${options.baseUrl}/apiservice?group_id=${encodeURIComponent(group.id)}&api_id=${encodeURIComponent(apiMenu.id)}`;
  const authRequired = detail.accessUrl !== "/oauth2/token";

  return `---
broker: "${yamlEscape(options.brokerName)}"
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

${renderLsFieldTable(reqHeader, portal.propertyTypeMap, "Request Header")}

## 요청

${renderLsFieldTable(reqBody, portal.propertyTypeMap, "Request Body")}

## 응답

### 헤더

${renderLsFieldTable(resHeader, portal.propertyTypeMap, "Response Header")}

### Body

${renderLsFieldTable(resBody, portal.propertyTypeMap, "Response Body")}

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

${options.relatedErrors}
`;
}

function renderKisApi(kis, api) {
  const sample = kis.sampleMap.byApiUrl[api.path] ?? {};
  const requestFields = sample.params ?? [];
  const requestCount = requestFields.length + (sample.trIds?.length ? 1 : 0);
  const responseCount = 0;
  const isWebSocket = api.path.startsWith("/tryitout/");
  const method = sample.postFlag || api.path.startsWith("/oauth2/") ? "POST" : "GET";

  return `---
broker: "한국투자증권"
source_url: "${yamlEscape(KIS_GUIDE_URL)}"
scraped_at: "${SCRAPED_AT}"
category: "${yamlEscape(api.category ?? "-")}"
api_id: "${yamlEscape(api.id ?? api.path)}"
api_name: "${yamlEscape(api.name ?? "-")}"
method: "${method}"
domain: "${isWebSocket ? "ws://ops.koreainvestment.com:21000" : "https://openapi.koreainvestment.com:9443"}"
path: "${yamlEscape(api.path)}"
content_type: "application/json; charset=UTF-8"
rate_limit: "-"
auth_required: ${!api.path.startsWith("/oauth2/")}
---

# ${safeTitle(api.name)} (${safeTitle(api.id ?? api.path)})

<!-- request_field_count: ${requestCount} -->
<!-- response_field_count: ${responseCount} -->

## 요약

| 항목 | 값 |
| --- | --- |
| 카테고리 | ${mdCell(api.category)} |
| API path | \`${mdCell(api.path)}\` |
| 샘플 TR ID | ${mdCell((sample.trIds ?? []).join(", "))} |
| 공식 샘플 파일 | ${mdCell((sample.files ?? []).join("<br>"))} |

## 엔드포인트

| 항목 | 값 |
| --- | --- |
| Method | ${method} |
| 운영 도메인 | \`${isWebSocket ? "ws://ops.koreainvestment.com:21000" : "https://openapi.koreainvestment.com:9443"}\` |
| 모의투자 도메인 | \`${isWebSocket ? "ws://ops.koreainvestment.com:31000" : "https://openapivts.koreainvestment.com:29443"}\` |
| URL | \`${mdCell(api.path)}\` |
| Content-Type | application/json; charset=UTF-8 |

## 인증/헤더

${renderKisHeaderTable(sample, isWebSocket)}

## 요청

${renderKisRequestTable(requestFields)}

## 응답

한국투자증권 포털 응답 필드 상세는 공식 포털 화면과 샘플 repo를 함께 확인합니다. 이 생성 문서는 API path, TR ID, 필수 요청 파라미터 식별을 우선합니다.

## 예제

### Request

\`\`\`json
${codeFenceJson(Object.fromEntries(requestFields.map((field) => [field, ""])))}
\`\`\`

### Response

\`\`\`text
문서 미기재
\`\`\`

## 연속조회/실시간/주의사항

- REST 요청은 \`authorization\`, \`appkey\`, \`appsecret\`, \`tr_id\`, 필요 시 \`custtype\` 헤더를 사용합니다.
- 실시간은 \`/oauth2/Approval\`로 받은 approval key를 WebSocket 헤더에 사용합니다.
- 주문성 API의 hashkey 적용 여부는 공식 포털과 샘플의 최신 정책을 우선합니다.
`;
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

function kisDocRelativePath(api) {
  const category = slugify(api.category ?? "uncategorized");
  const fileName = `${slugify(api.name ?? api.path)}-${slugify(api.path)}.md`;
  return `${category}/${fileName}`;
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

function renderKisHeaderTable(sample = {}, isWebSocket = false) {
  const rows = isWebSocket
    ? [
        ["approval_key", "WebSocket 접속키", "Y"],
        ["custtype", "고객 타입", "N"],
        ["tr_type", "등록/해제 구분", "Y"],
      ]
    : [
        ["authorization", "Bearer access token", "Y"],
        ["appkey", "앱키", "Y"],
        ["appsecret", "앱시크릿", "Y"],
        ["tr_id", (sample.trIds ?? []).join(", ") || "TR ID", sample.trIds?.length ? "Y" : "N"],
        ["custtype", "고객 타입", "N"],
        ["tr_cont", "연속거래여부", "N"],
      ];

  return `| 위치 | 필드 | 이름 | 필수 |
| --- | --- | --- | --- |
${rows.map(([field, name, required]) => `| Header | \`${mdCell(field)}\` | ${mdCell(name)} | ${required} |`).join("\n")}`;
}

function renderKisRequestTable(fields) {
  if (!fields || fields.length === 0) {
    return "문서 미기재";
  }

  return `| 위치 | 필드 | 필수 |
| --- | --- | --- |
${fields.map((field) => `| Query/Body | \`${mdCell(field)}\` | Y |`).join("\n")}`;
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
  if (options.allowInsecureTls) {
    return fetchTextInsecure(url, options, retries);
  }

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

async function fetchTextInsecure(url, options = {}, retries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await httpsGetText(url, options);
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(300 * attempt);
      }
    }
  }
  throw new Error(`Failed to fetch ${url}: ${lastError.message}`);
}

function httpsGetText(url, options = {}) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      rejectUnauthorized: false,
      headers: {
        Accept: "application/json, text/html, */*",
        "User-Agent": "SecurityAPI-doc-generator/1.0",
        ...(options.headers ?? {}),
      },
    }, (response) => {
      let data = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }
        resolve(data);
      });
    });
    request.on("error", reject);
    request.setTimeout(30_000, () => {
      request.destroy(new Error("Request timed out"));
    });
  });
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

function matchPythonString(text, name) {
  const match = text.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`));
  return match?.[1] ?? null;
}

function extractKisParams(text) {
  const keys = new Set();
  for (const match of text.matchAll(/["']([A-Z][A-Z0-9_]{1,})["']\s*:/g)) {
    keys.add(match[1]);
  }
  for (const match of text.matchAll(/params\[['"]([A-Z][A-Z0-9_]{1,})['"]\]/g)) {
    keys.add(match[1]);
  }
  return [...keys];
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
