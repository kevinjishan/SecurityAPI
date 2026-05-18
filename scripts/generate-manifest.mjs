import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, "data", "raw");
const GENERATED_DIR = path.join(ROOT, "data", "generated");

const KIWOOM_GUIDE_URL = "https://openapi.kiwoom.com/guide/apiguide?dummyVal=0";
const LS_GUIDE_URL =
  "https://openapi.ls-sec.co.kr/apiservice?group_id=ffd2def7-a118-40f7-a0ab-cd4c6a538a90&api_id=33bd887a-6652-4209-88cd-5324bc7c5e36";
const LS_BASE = "https://openapi.ls-sec.co.kr";

const generatedAt = new Date().toISOString();

async function main() {
  await fs.rm(GENERATED_DIR, { recursive: true, force: true });
  await ensureDir(GENERATED_DIR);

  const kiwoomManifest = await buildKiwoomManifest();
  const lsManifest = await buildLsManifest();
  const summary = buildSummary(kiwoomManifest, lsManifest);

  await writeJson(path.join(GENERATED_DIR, "kiwoom-manifest.json"), kiwoomManifest);
  await writeJson(path.join(GENERATED_DIR, "ls-manifest.json"), lsManifest);
  await writeJson(path.join(GENERATED_DIR, "broker-manifest-summary.json"), summary);

  console.log(`Kiwoom manifest: ${Object.keys(kiwoomManifest.apis).length} APIs`);
  console.log(`LS manifest: ${Object.keys(lsManifest.apis).length} TRs`);
  console.log("Done. Generated data/generated/.");
}

async function buildKiwoomManifest() {
  const apiInfoList = await readJson(path.join(RAW_DIR, "kiwoom", "api-info-list.json"));
  const errorCodes = await readJson(path.join(RAW_DIR, "kiwoom", "error-codes.json"));
  const rows = apiInfoList.resp_data ?? [];
  const apis = {};

  for (const row of rows.sort((a, b) => compareText(a.apiInfo?.apiId, b.apiInfo?.apiId))) {
    const info = row.apiInfo ?? {};
    const id = requiredString(info.apiId, "Kiwoom apiInfo.apiId");
    const commonHeaders = row.commonHeader ?? [];
    const ioFields = row.apiTrIo ?? [];

    const requestHeaders = normalizeKiwoomFields(
      commonHeaders.filter((field) => field.inptOutputTp === "I"),
      "header",
      "request",
    );
    const responseHeaders = normalizeKiwoomFields(
      commonHeaders.filter((field) => field.inptOutputTp === "O"),
      "header",
      "response",
    );
    const requestBody = normalizeKiwoomFields(
      ioFields.filter((field) => field.inptOutputTp === "I"),
      "body",
      "request",
    );
    const responseBody = normalizeKiwoomFields(
      ioFields.filter((field) => field.inptOutputTp === "O"),
      "body",
      "response",
    );

    const requestExample = buildKiwoomRequestExample(requestBody);
    const responseRaw = nullIfBlank(info.rsltData);
    const entry = {
      broker: "kiwoom",
      id,
      name: stringOrNull(info.apiNm) ?? id,
      category: stringOrNull(info.jobTpNm) ?? "uncategorized",
      group: stringOrNull(info.grpCodeNm),
      protocol: normalizeProtocol(info.svcTransTp),
      method: stringOrNull(info.jobMethod) ?? "POST",
      domains: {
        prod: stringOrNull(info.jobRealDomain),
        dev: stringOrNull(info.jobDevDomain),
        mock: stringOrNull(info.jobSimulateDomain),
      },
      path: stringOrNull(info.svcUri) ?? "",
      contentType: stringOrNull(info.jobContentType),
      requestFormat: detectRequestFormat(info.jobContentType, info.jobFormat),
      authRequired: inferKiwoomAuthRequired(info, requestHeaders),
      rateLimit: {
        perSecond: null,
        raw: null,
      },
      headers: {
        request: requestHeaders,
        response: responseHeaders,
      },
      body: {
        request: requestBody,
        response: responseBody,
      },
      continuation: buildContinuation(
        requestHeaders,
        responseHeaders,
        { continueFlag: "cont-yn", nextKey: "next-key" },
        { "cont-yn": "N" },
      ),
      examples: {
        request: requestExample,
        response: parseJsonOrNull(responseRaw),
        requestRaw: JSON.stringify(requestExample, null, 2),
        responseRaw,
      },
      sourceRef: {
        officialUrl: KIWOOM_GUIDE_URL,
        rawFile: "data/raw/kiwoom/api-info-list.json",
        rawId: id,
        docPath: `docs/kiwoom/${kiwoomDocRelativePath(info)}`,
      },
      kiwoom: {
        jobTpCode: stringOrNull(info.jobTpCode),
        svcTransTp: stringOrNull(info.svcTransTp),
        jobFormat: stringOrNull(info.jobFormat),
      },
    };

    apis[id] = entry;
  }

  return {
    broker: "kiwoom",
    generatedAt,
    source: {
      docsUrl: KIWOOM_GUIDE_URL,
      rawFiles: [
        "data/raw/kiwoom/api-info-list.json",
        "data/raw/kiwoom/error-codes.json",
      ],
    },
    counts: {
      APIs: Object.keys(apis).length,
      errors: (errorCodes.resp_data ?? []).length,
    },
    apis,
  };
}

async function buildLsManifest() {
  const menu = await readJson(path.join(RAW_DIR, "ls", "menu.json"));
  const apiDetailsById = await readJson(path.join(RAW_DIR, "ls", "api-details-by-id.json"));
  const trsByApiId = await readJson(path.join(RAW_DIR, "ls", "trs-by-api-id.json"));
  const propertiesByTrId = await readJson(path.join(RAW_DIR, "ls", "properties-by-tr-id.json"));
  const propertyTypes = await readJson(path.join(RAW_DIR, "ls", "property-types.json"));
  const propertyTypeMap = Object.fromEntries((propertyTypes.codes ?? []).map((item) => [item.key, item.value]));
  const apis = {};
  const seenTrCodes = new Map();

  for (const group of menu.groups ?? []) {
    for (const apiMenu of group.apis ?? []) {
      const detail = apiDetailsById[apiMenu.id] ?? {};
      const trList = trsByApiId[apiMenu.id] ?? [];

      for (const tr of trList) {
        const trCode = requiredString(tr.trCode, "LS tr.trCode");
        if (seenTrCodes.has(trCode)) {
          throw new Error(`Duplicate LS trCode: ${trCode} (${seenTrCodes.get(trCode)} and ${tr.id})`);
        }
        seenTrCodes.set(trCode, tr.id);

        const properties = propertiesByTrId[tr.id] ?? [];
        const requestHeaders = normalizeLsFields(
          properties.filter((field) => field.bodyType === "req_h"),
          "header",
          "request",
          propertyTypeMap,
        );
        const responseHeaders = normalizeLsFields(
          properties.filter((field) => field.bodyType === "res_h"),
          "header",
          "response",
          propertyTypeMap,
        );
        const requestBody = normalizeLsFields(
          properties.filter((field) => field.bodyType === "req_b"),
          "body",
          "request",
          propertyTypeMap,
        );
        const responseBody = normalizeLsFields(
          properties.filter((field) => field.bodyType === "res_b"),
          "body",
          "response",
          propertyTypeMap,
        );
        const requestRaw = nullIfBlank(tr.reqExample);
        const responseRaw = nullIfBlank(tr.resExample);

        apis[trCode] = {
          broker: "ls",
          id: trCode,
          name: stringOrNull(tr.trName) ?? trCode,
          category: stringOrNull(detail.apiCollectionName) ?? stringOrNull(group.name) ?? "uncategorized",
          group: stringOrNull(group.name),
          protocol: normalizeProtocol(detail.protocolType),
          method: stringOrNull(detail.httpMethod) ?? "POST",
          domains: {
            prod: stringOrNull(detail.domain),
            mock: stringOrNull(detail.simulatedDomain),
          },
          path: stringOrNull(detail.accessUrl) ?? "",
          contentType: stringOrNull(detail.contentType),
          requestFormat: detectRequestFormat(detail.contentType, detail.reqFormat),
          authRequired: inferLsAuthRequired(detail, requestHeaders),
          rateLimit: parseRateLimit(tr.transactionPerSec),
          headers: {
            request: requestHeaders,
            response: responseHeaders,
          },
          body: {
            request: requestBody,
            response: responseBody,
          },
          continuation: buildContinuation(
            requestHeaders,
            responseHeaders,
            { continueFlag: "tr_cont", nextKey: "tr_cont_key" },
            { tr_cont: "N" },
          ),
          requiredConfig: buildLsRequiredConfig(requestHeaders),
          examples: {
            request: parseJsonOrNull(requestRaw),
            response: parseJsonOrNull(responseRaw),
            requestRaw,
            responseRaw,
          },
          sourceRef: {
            officialUrl: `${LS_BASE}/apiservice?group_id=${encodeURIComponent(group.id)}&api_id=${encodeURIComponent(apiMenu.id)}`,
            rawFile: "data/raw/ls/trs-by-api-id.json",
            rawId: tr.id,
            docPath: `docs/ls/${lsDocRelativePath(group, apiMenu, tr)}`,
          },
          ls: {
            apiId: apiMenu.id,
            apiName: stringOrNull(apiMenu.name) ?? stringOrNull(detail.name),
            trId: tr.id,
            trCode,
            groupId: group.id,
            groupName: stringOrNull(group.name),
          },
        };
      }
    }
  }

  return {
    broker: "ls",
    generatedAt,
    source: {
      docsUrl: LS_GUIDE_URL,
      rawFiles: [
        "data/raw/ls/menu.json",
        "data/raw/ls/api-details-by-id.json",
        "data/raw/ls/trs-by-api-id.json",
        "data/raw/ls/properties-by-tr-id.json",
        "data/raw/ls/property-types.json",
      ],
    },
    counts: {
      APIs: Object.keys(apis).length,
      groups: (menu.groups ?? []).length,
      apiPages: (menu.groups ?? []).flatMap((group) => group.apis ?? []).length,
    },
    apis: Object.fromEntries(Object.entries(apis).sort(([a], [b]) => compareText(a, b))),
  };
}

function normalizeKiwoomFields(fields, location, direction) {
  return fields
    .map((field, index) => ({
      id: stringOrNull(field.itemId) ?? "",
      name: stringOrNull(field.itemNm) ?? stringOrNull(field.itemId) ?? "",
      type: stringOrNull(field.type),
      required: field.esntYn === "Y",
      length: stringOrNull(field.lngt),
      location,
      direction,
      order: numberOrFallback(field.sortOrd, index + 1),
      sample: stringOrNull(field.sampData),
      description: cleanDescription(field.itemDc),
      raw: field,
    }))
    .sort(compareFieldOrder);
}

function normalizeLsFields(fields, location, direction, propertyTypeMap) {
  return fields
    .map((field, index) => ({
      id: stringOrNull(field.propertyCd) ?? "",
      name: stringOrNull(field.propertyNm) ?? stringOrNull(field.propertyCd) ?? "",
      type: propertyTypeMap[field.propertyType] ?? stringOrNull(field.propertyType),
      required: field.requireYn === "Y",
      length: stringOrNull(field.propertyLength),
      location,
      direction,
      order: numberOrFallback(field.propertyOrder, index + 1),
      sample: null,
      description: cleanDescription(field.description),
      raw: field,
    }))
    .sort(compareFieldOrder);
}

function buildContinuation(requestHeaders, responseHeaders, names, defaults) {
  const requestHasFlag = requestHeaders.some((field) => field.id === names.continueFlag);
  const requestHasKey = requestHeaders.some((field) => field.id === names.nextKey);
  const responseHasFlag = responseHeaders.some((field) => field.id === names.continueFlag);
  const responseHasKey = responseHeaders.some((field) => field.id === names.nextKey);
  const supported = (requestHasFlag || requestHasKey) && (responseHasFlag || responseHasKey);

  if (!supported) {
    return null;
  }

  return {
    supported: true,
    requestHeaders: {
      continueFlag: requestHasFlag ? names.continueFlag : undefined,
      nextKey: requestHasKey ? names.nextKey : undefined,
    },
    responseHeaders: {
      continueFlag: responseHasFlag ? names.continueFlag : undefined,
      nextKey: responseHasKey ? names.nextKey : undefined,
    },
    requestDefaults: defaults,
  };
}

function buildLsRequiredConfig(requestHeaders) {
  return requestHeaders
    .filter((field) => field.id === "mac_address")
    .map((field) => ({
      key: "macAddress",
      header: "mac_address",
      required: field.required,
    }));
}

function inferKiwoomAuthRequired(info, requestHeaders) {
  if (info.svcUri === "/oauth2/token") {
    return false;
  }
  return requestHeaders.some((field) => field.id.toLowerCase() === "authorization");
}

function inferLsAuthRequired(detail, requestHeaders) {
  if (detail.accessUrl === "/oauth2/token") {
    return false;
  }
  return requestHeaders.some((field) => field.id.toLowerCase() === "authorization");
}

function buildKiwoomRequestExample(requestBody) {
  const result = {};
  for (const field of requestBody) {
    result[field.id] = field.sample ?? "";
  }
  return result;
}

function buildSummary(kiwoomManifest, lsManifest) {
  return {
    generatedAt,
    brokers: {
      kiwoom: {
        apis: kiwoomManifest.counts.APIs,
        errors: kiwoomManifest.counts.errors,
        manifest: "data/generated/kiwoom-manifest.json",
      },
      ls: {
        groups: lsManifest.counts.groups,
        apiPages: lsManifest.counts.apiPages,
        trs: lsManifest.counts.APIs,
        manifest: "data/generated/ls-manifest.json",
      },
    },
  };
}

function parseRateLimit(value) {
  const raw = stringOrNull(value);
  const perSecond = raw && /^\d+$/.test(raw) ? Number(raw) : null;
  return { perSecond, raw };
}

function detectRequestFormat(contentType, format) {
  const combined = `${contentType ?? ""} ${format ?? ""}`.toLowerCase();
  if (combined.includes("json")) {
    return "json";
  }
  if (combined.includes("x-www-form-urlencoded") || combined.includes("form")) {
    return "form";
  }
  return "unknown";
}

function normalizeProtocol(value) {
  return String(value ?? "").toUpperCase() === "REST" ? "REST" : "UNKNOWN";
}

function parseJsonOrNull(value) {
  if (value == null) {
    return null;
  }
  const text = String(value).trim();
  if (!text || (!text.startsWith("{") && !text.startsWith("["))) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function kiwoomDocRelativePath(info) {
  const category = slugify(info.jobTpNm ?? "uncategorized");
  const fileName = `${slugify(info.apiId ?? "unknown")}-${slugify(info.apiNm ?? "api")}.md`;
  return `${category}/${fileName}`;
}

function lsDocRelativePath(group, apiMenu, tr) {
  const groupSlug = slugify(group.name);
  const apiSlug = slugify(apiMenu.name);
  const trCode = slugify(tr.trCode || tr.id);
  const trName = slugify(tr.trName || "tr");
  return `${groupSlug}/${apiSlug}/${trCode}-${trName}.md`;
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

function cleanDescription(value) {
  const text = stringOrNull(value);
  if (text == null) {
    return null;
  }
  return text
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

function nullIfBlank(value) {
  const text = stringOrNull(value);
  return text == null ? null : text;
}

function stringOrNull(value) {
  if (value == null) {
    return null;
  }
  const text = String(value);
  return text === "" ? null : text;
}

function requiredString(value, label) {
  const text = stringOrNull(value);
  if (text == null) {
    throw new Error(`Missing required value: ${label}`);
  }
  return text;
}

function numberOrFallback(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function compareFieldOrder(a, b) {
  if (a.order !== b.order) {
    return a.order - b.order;
  }
  return compareText(a.id, b.id);
}

function compareText(a, b) {
  return String(a ?? "").localeCompare(String(b ?? ""), "ko");
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeJson(filePath, data) {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
