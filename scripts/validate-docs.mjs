import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, "docs");
const RAW_DIR = path.join(ROOT, "data", "raw");

const EXPECTED = {
  kiwoomApis: 207,
  kiwoomErrors: 33,
  lsGroups: 8,
  lsApis: 41,
  lsTrs: 365,
  dbGroups: 19,
  dbApis: 165,
  dbTrs: 165,
};

async function main() {
  const kiwoomRaw = await readJson(path.join(RAW_DIR, "kiwoom", "api-info-list.json"));
  const kiwoomErrors = await readJson(path.join(RAW_DIR, "kiwoom", "error-codes.json"));
  const lsMenu = await readJson(path.join(RAW_DIR, "ls", "menu.json"));
  const lsTrsByApiId = await readJson(path.join(RAW_DIR, "ls", "trs-by-api-id.json"));
  const lsPropertiesByTrId = await readJson(path.join(RAW_DIR, "ls", "properties-by-tr-id.json"));
  const dbMenu = await readJson(path.join(RAW_DIR, "db", "menu.json"));
  const dbTrsByApiId = await readJson(path.join(RAW_DIR, "db", "trs-by-api-id.json"));
  const dbPropertiesByTrId = await readJson(path.join(RAW_DIR, "db", "properties-by-tr-id.json"));
  const kisMenu = await readJson(path.join(RAW_DIR, "kis", "menu.json"));

  const kiwoomDocs = (await listMarkdown(path.join(DOCS_DIR, "kiwoom"))).filter(
    (file) => !file.endsWith(`${path.sep}README.md`) && !file.endsWith(`${path.sep}errors.md`),
  );
  const lsDocs = (await listMarkdown(path.join(DOCS_DIR, "ls"))).filter(
    (file) => !file.endsWith(`${path.sep}README.md`),
  );
  const dbDocs = (await listMarkdown(path.join(DOCS_DIR, "db"))).filter(
    (file) => !file.endsWith(`${path.sep}README.md`),
  );
  const kisDocs = (await listMarkdown(path.join(DOCS_DIR, "kis"))).filter(
    (file) => !file.endsWith(`${path.sep}README.md`),
  );

  const kiwoomApis = kiwoomRaw.resp_data ?? [];
  const lsGroups = lsMenu.groups ?? [];
  const lsApis = lsGroups.flatMap((group) => group.apis ?? []);
  const lsTrs = Object.values(lsTrsByApiId).flat();
  const dbGroups = dbMenu.groups ?? [];
  const dbApis = dbGroups.flatMap((group) => group.apis ?? []);
  const dbTrs = Object.values(dbTrsByApiId).flat();
  const kisApis = kisMenu.apis ?? [];

  assertEqual(kiwoomApis.length, EXPECTED.kiwoomApis, "Kiwoom raw API count");
  assertEqual((kiwoomErrors.resp_data ?? []).length, EXPECTED.kiwoomErrors, "Kiwoom error code count");
  assertEqual(kiwoomDocs.length, kiwoomApis.length, "Kiwoom markdown API count");

  assertEqual(lsGroups.length, EXPECTED.lsGroups, "LS group count");
  assertEqual(lsApis.length, EXPECTED.lsApis, "LS API page count");
  assertEqual(lsTrs.length, EXPECTED.lsTrs, "LS TR count");
  assertEqual(lsDocs.length, lsTrs.length, "LS markdown TR count");

  assertEqual(dbGroups.length, EXPECTED.dbGroups, "DB group count");
  assertEqual(dbApis.length, EXPECTED.dbApis, "DB API page count");
  assertEqual(dbTrs.length, EXPECTED.dbTrs, "DB TR count");
  assertEqual(dbDocs.length, dbTrs.length, "DB markdown TR count");
  assertEqual(kisDocs.length, kisApis.length, "KIS markdown API path count");

  await validateCommonSections([...kiwoomDocs, ...lsDocs, ...dbDocs, ...kisDocs]);
  await validateKiwoomFieldCounts(kiwoomDocs, kiwoomApis);
  await validateLsFieldCounts(lsDocs, lsTrs, lsPropertiesByTrId);
  await validateLsFieldCounts(dbDocs, dbTrs, dbPropertiesByTrId);

  console.log("Validation passed.");
  console.log(`Kiwoom: ${kiwoomDocs.length} API docs, ${(kiwoomErrors.resp_data ?? []).length} errors`);
  console.log(`LS: ${lsGroups.length} groups, ${lsApis.length} API pages, ${lsDocs.length} TR docs`);
  console.log(`DB: ${dbGroups.length} groups, ${dbApis.length} API pages, ${dbDocs.length} TR docs`);
  console.log(`KIS: ${kisMenu.categories?.length ?? 0} categories, ${kisDocs.length} API docs`);
}

async function validateCommonSections(files) {
  const required = ["---", "source_url:", "## 엔드포인트", "## 요청", "## 응답"];
  for (const file of files) {
    const text = await fs.readFile(file, "utf8");
    for (const marker of required) {
      if (!text.includes(marker)) {
        throw new Error(`${file} is missing ${marker}`);
      }
    }
    validateSourceUrl(file, matchFrontmatterValue(text, "source_url"));
  }
}

function validateSourceUrl(file, sourceUrl) {
  let parsed;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    throw new Error(`${file} has invalid source_url: ${sourceUrl}`);
  }

  const allowedHosts = new Set([
    "openapi.kiwoom.com",
    "openapi.ls-sec.co.kr",
    "openapi.db-fi.com",
    "apiportal.koreainvestment.com",
  ]);
  if (parsed.protocol !== "https:" || !allowedHosts.has(parsed.hostname)) {
    throw new Error(`${file} has unexpected source_url: ${sourceUrl}`);
  }
}

async function validateKiwoomFieldCounts(files, rawApis) {
  const expectedByApiId = new Map();
  for (const api of rawApis) {
    const apiId = api.apiInfo?.apiId;
    const commonHeader = api.commonHeader ?? [];
    const io = api.apiTrIo ?? [];
    expectedByApiId.set(apiId, {
      request:
        commonHeader.filter((item) => item.inptOutputTp === "I").length +
        io.filter((item) => item.inptOutputTp === "I").length,
      response:
        commonHeader.filter((item) => item.inptOutputTp === "O").length +
        io.filter((item) => item.inptOutputTp === "O").length,
    });
  }

  for (const file of files) {
    const text = await fs.readFile(file, "utf8");
    const apiId = matchFrontmatterValue(text, "api_id");
    const actual = matchCounts(text);
    const expected = expectedByApiId.get(apiId);
    if (!expected) {
      throw new Error(`${file} has unknown Kiwoom api_id ${apiId}`);
    }
    assertEqual(actual.request, expected.request, `Kiwoom request field count for ${apiId}`);
    assertEqual(actual.response, expected.response, `Kiwoom response field count for ${apiId}`);
  }
}

async function validateLsFieldCounts(files, rawTrs, propertiesByTrId) {
  const expectedByTrId = new Map();
  for (const tr of rawTrs) {
    const properties = propertiesByTrId[tr.id] ?? [];
    expectedByTrId.set(tr.id, {
      request: properties.filter((item) => item.bodyType === "req_h" || item.bodyType === "req_b").length,
      response: properties.filter((item) => item.bodyType === "res_h" || item.bodyType === "res_b").length,
    });
  }

  for (const file of files) {
    const text = await fs.readFile(file, "utf8");
    const trId = matchFrontmatterValue(text, "tr_id");
    const actual = matchCounts(text);
    const expected = expectedByTrId.get(trId);
    if (!expected) {
      throw new Error(`${file} has unknown LS tr_id ${trId}`);
    }
    assertEqual(actual.request, expected.request, `LS request field count for ${trId}`);
    assertEqual(actual.response, expected.response, `LS response field count for ${trId}`);
  }
}

function matchFrontmatterValue(text, key) {
  const match = text.match(new RegExp(`^${key}: "([^"]*)"`, "m"));
  if (!match) {
    throw new Error(`Missing frontmatter key: ${key}`);
  }
  return match[1];
}

function matchCounts(text) {
  const request = text.match(/<!-- request_field_count: (\d+) -->/);
  const response = text.match(/<!-- response_field_count: (\d+) -->/);
  if (!request || !response) {
    throw new Error("Missing field count comments");
  }
  return {
    request: Number(request[1]),
    response: Number(response[1]),
  };
}

async function listMarkdown(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdown(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
