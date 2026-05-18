import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, "data", "raw");
const GENERATED_DIR = path.join(ROOT, "data", "generated");

const EXPECTED = {
  kiwoomApis: 207,
  kiwoomErrors: 33,
  lsGroups: 8,
  lsApiPages: 41,
  lsTrs: 365,
};

async function main() {
  const kiwoomManifest = await readJson(path.join(GENERATED_DIR, "kiwoom-manifest.json"));
  const lsManifest = await readJson(path.join(GENERATED_DIR, "ls-manifest.json"));
  const summary = await readJson(path.join(GENERATED_DIR, "broker-manifest-summary.json"));

  const kiwoomRaw = await readJson(path.join(RAW_DIR, "kiwoom", "api-info-list.json"));
  const kiwoomErrors = await readJson(path.join(RAW_DIR, "kiwoom", "error-codes.json"));
  const lsMenu = await readJson(path.join(RAW_DIR, "ls", "menu.json"));
  const lsTrsByApiId = await readJson(path.join(RAW_DIR, "ls", "trs-by-api-id.json"));
  const lsPropertiesByTrId = await readJson(path.join(RAW_DIR, "ls", "properties-by-tr-id.json"));

  validateTopLevel(kiwoomManifest, "kiwoom");
  validateTopLevel(lsManifest, "ls");
  validateCommonEntries(kiwoomManifest);
  validateCommonEntries(lsManifest);
  validateKiwoom(kiwoomManifest, kiwoomRaw, kiwoomErrors);
  validateLs(lsManifest, lsMenu, lsTrsByApiId, lsPropertiesByTrId);
  validateSummary(summary, kiwoomManifest, lsManifest);

  console.log("Manifest validation passed.");
  console.log(`Kiwoom manifest: ${Object.keys(kiwoomManifest.apis).length} APIs`);
  console.log(`LS manifest: ${Object.keys(lsManifest.apis).length} TRs`);
}

function validateTopLevel(manifest, broker) {
  assertEqual(manifest.broker, broker, `${broker} broker`);
  assertTruthy(manifest.generatedAt, `${broker} generatedAt`);
  assertTruthy(manifest.source?.docsUrl, `${broker} source.docsUrl`);
  assertTruthy(Array.isArray(manifest.source?.rawFiles), `${broker} source.rawFiles`);
  assertTruthy(manifest.counts && typeof manifest.counts.APIs === "number", `${broker} counts.APIs`);
  assertTruthy(manifest.apis && typeof manifest.apis === "object", `${broker} apis`);
}

function validateCommonEntries(manifest) {
  const ids = Object.keys(manifest.apis);
  assertEqual(new Set(ids).size, ids.length, `${manifest.broker} duplicate ids`);

  for (const [id, entry] of Object.entries(manifest.apis)) {
    assertEqual(entry.broker, manifest.broker, `${manifest.broker}.${id}.broker`);
    assertEqual(entry.id, id, `${manifest.broker}.${id}.id`);
    assertTruthy(entry.name, `${manifest.broker}.${id}.name`);
    assertTruthy(entry.method, `${manifest.broker}.${id}.method`);
    assertTruthy(entry.domains && Object.hasOwn(entry.domains, "prod"), `${manifest.broker}.${id}.domains.prod`);
    assertTruthy(entry.path, `${manifest.broker}.${id}.path`);
    assertTruthy(Object.hasOwn(entry, "contentType"), `${manifest.broker}.${id}.contentType`);
    assertTruthy(typeof entry.authRequired === "boolean", `${manifest.broker}.${id}.authRequired`);
    assertTruthy(Array.isArray(entry.headers?.request), `${manifest.broker}.${id}.headers.request`);
    assertTruthy(Array.isArray(entry.headers?.response), `${manifest.broker}.${id}.headers.response`);
    assertTruthy(Array.isArray(entry.body?.request), `${manifest.broker}.${id}.body.request`);
    assertTruthy(Array.isArray(entry.body?.response), `${manifest.broker}.${id}.body.response`);
    assertTruthy(entry.sourceRef?.rawFile, `${manifest.broker}.${id}.sourceRef.rawFile`);
    assertTruthy(entry.sourceRef?.rawId, `${manifest.broker}.${id}.sourceRef.rawId`);

    for (const field of [
      ...entry.headers.request,
      ...entry.headers.response,
      ...entry.body.request,
      ...entry.body.response,
    ]) {
      assertTruthy(field.id, `${manifest.broker}.${id}.field.id`);
      assertTruthy(field.location === "header" || field.location === "body", `${manifest.broker}.${id}.${field.id}.location`);
      assertTruthy(field.direction === "request" || field.direction === "response", `${manifest.broker}.${id}.${field.id}.direction`);
      assertTruthy(typeof field.order === "number", `${manifest.broker}.${id}.${field.id}.order`);
      assertTruthy(field.raw && typeof field.raw === "object", `${manifest.broker}.${id}.${field.id}.raw`);
    }
  }
}

function validateKiwoom(manifest, raw, errorRaw) {
  const rawRows = raw.resp_data ?? [];
  assertEqual(Object.keys(manifest.apis).length, EXPECTED.kiwoomApis, "Kiwoom manifest count");
  assertEqual(manifest.counts.errors, EXPECTED.kiwoomErrors, "Kiwoom manifest error count");
  assertEqual((errorRaw.resp_data ?? []).length, EXPECTED.kiwoomErrors, "Kiwoom raw error count");

  const au10001 = manifest.apis.au10001;
  const ka10001 = manifest.apis.ka10001;
  assertTruthy(au10001, "Kiwoom au10001 exists");
  assertTruthy(ka10001, "Kiwoom ka10001 exists");
  assertEqual(au10001.authRequired, false, "Kiwoom au10001 authRequired");
  assertEqual(ka10001.authRequired, true, "Kiwoom ka10001 authRequired");
  assertEqual(ka10001.path, "/api/dostk/stkinfo", "Kiwoom ka10001 path");

  for (const row of rawRows) {
    const apiId = row.apiInfo?.apiId;
    const entry = manifest.apis[apiId];
    assertTruthy(entry, `Kiwoom manifest entry ${apiId}`);
    const commonHeader = row.commonHeader ?? [];
    const io = row.apiTrIo ?? [];
    assertEqual(entry.headers.request.length, commonHeader.filter((item) => item.inptOutputTp === "I").length, `${apiId} request header count`);
    assertEqual(entry.headers.response.length, commonHeader.filter((item) => item.inptOutputTp === "O").length, `${apiId} response header count`);
    assertEqual(entry.body.request.length, io.filter((item) => item.inptOutputTp === "I").length, `${apiId} request body count`);
    assertEqual(entry.body.response.length, io.filter((item) => item.inptOutputTp === "O").length, `${apiId} response body count`);
  }
}

function validateLs(manifest, menu, trsByApiId, propertiesByTrId) {
  const groups = menu.groups ?? [];
  const apiPages = groups.flatMap((group) => group.apis ?? []);
  const trs = Object.values(trsByApiId).flat();
  assertEqual(groups.length, EXPECTED.lsGroups, "LS group count");
  assertEqual(apiPages.length, EXPECTED.lsApiPages, "LS API page count");
  assertEqual(trs.length, EXPECTED.lsTrs, "LS raw TR count");
  assertEqual(Object.keys(manifest.apis).length, EXPECTED.lsTrs, "LS manifest TR count");
  assertEqual(manifest.counts.groups, EXPECTED.lsGroups, "LS manifest group count");
  assertEqual(manifest.counts.apiPages, EXPECTED.lsApiPages, "LS manifest API page count");

  const token = manifest.apis.token;
  const t1101 = manifest.apis.t1101;
  assertTruthy(token, "LS token exists");
  assertTruthy(t1101, "LS t1101 exists");
  assertEqual(token.authRequired, false, "LS token authRequired");
  assertEqual(token.requestFormat, "form", "LS token requestFormat");
  assertEqual(t1101.authRequired, true, "LS t1101 authRequired");
  assertEqual(t1101.path, "/stock/market-data", "LS t1101 path");
  assertEqual(t1101.rateLimit.raw, "10", "LS t1101 rate limit raw");

  const seen = new Set();
  for (const tr of trs) {
    assertTruthy(!seen.has(tr.trCode), `LS duplicate trCode ${tr.trCode}`);
    seen.add(tr.trCode);
    const entry = manifest.apis[tr.trCode];
    const properties = propertiesByTrId[tr.id] ?? [];
    assertTruthy(entry, `LS manifest entry ${tr.trCode}`);
    assertEqual(entry.headers.request.length, properties.filter((item) => item.bodyType === "req_h").length, `${tr.trCode} request header count`);
    assertEqual(entry.headers.response.length, properties.filter((item) => item.bodyType === "res_h").length, `${tr.trCode} response header count`);
    assertEqual(entry.body.request.length, properties.filter((item) => item.bodyType === "req_b").length, `${tr.trCode} request body count`);
    assertEqual(entry.body.response.length, properties.filter((item) => item.bodyType === "res_b").length, `${tr.trCode} response body count`);
  }
}

function validateSummary(summary, kiwoomManifest, lsManifest) {
  assertEqual(summary.brokers?.kiwoom?.apis, kiwoomManifest.counts.APIs, "summary kiwoom apis");
  assertEqual(summary.brokers?.kiwoom?.errors, kiwoomManifest.counts.errors, "summary kiwoom errors");
  assertEqual(summary.brokers?.ls?.trs, lsManifest.counts.APIs, "summary ls trs");
  assertEqual(summary.brokers?.ls?.groups, lsManifest.counts.groups, "summary ls groups");
  assertEqual(summary.brokers?.ls?.apiPages, lsManifest.counts.apiPages, "summary ls apiPages");
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

function assertTruthy(value, label) {
  if (!value) {
    throw new Error(`${label}: expected truthy value`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
