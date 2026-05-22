import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, "data", "raw");
const GENERATED_DIR = path.join(ROOT, "data", "generated");

const KIWOOM_GUIDE_URL = "https://openapi.kiwoom.com/guide/apiguide?dummyVal=0";
const LS_GUIDE_URL =
  "https://openapi.ls-sec.co.kr/apiservice?group_id=ffd2def7-a118-40f7-a0ab-cd4c6a538a90&api_id=33bd887a-6652-4209-88cd-5324bc7c5e36";
const LS_BASE = "https://openapi.ls-sec.co.kr";
const DB_GUIDE_URL =
  "https://openapi.db-fi.com/apiservice?group_id=cc55b867-e049-421b-a798-be016370ff44&api_id=9e3097ab-7d39-4433-8002-00649604f0de";
const DB_BASE = "https://openapi.db-fi.com";
const KIS_GUIDE_URL = "https://apiportal.koreainvestment.com/apiservice-summary";
const KIS_SAMPLE_REPO_URL = "https://github.com/koreainvestment/open-trading-api";
const KIS_DOMAINS = Object.freeze({
  prod: "https://openapi.koreainvestment.com:9443",
  mock: "https://openapivts.koreainvestment.com:29443",
});
const KIS_WEBSOCKET_DOMAINS = Object.freeze({
  prod: "ws://ops.koreainvestment.com:21000",
  mock: "ws://ops.koreainvestment.com:31000",
});
const KIS_SERVICE_OVERRIDES = Object.freeze({
  "/uapi/domestic-stock/v1/quotations/inquire-price": {
    method: "GET",
    trIds: ["FHKST01010100"],
    params: ["FID_COND_MRKT_DIV_CODE", "FID_INPUT_ISCD"],
  },
  "/uapi/domestic-stock/v1/quotations/inquire-asking-price-exp-ccn": {
    method: "GET",
    trIds: ["FHKST01010200"],
    params: ["FID_COND_MRKT_DIV_CODE", "FID_INPUT_ISCD"],
  },
  "/uapi/domestic-stock/v1/quotations/intstock-multprice": {
    method: "GET",
    trIds: ["FHKST11300006"],
    params: ["FID_COND_MRKT_DIV_CODE_1", "FID_INPUT_ISCD_1"],
  },
  "/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice": {
    method: "GET",
    trIds: ["FHKST03010100"],
    params: ["FID_COND_MRKT_DIV_CODE", "FID_INPUT_ISCD", "FID_INPUT_DATE_1", "FID_INPUT_DATE_2", "FID_PERIOD_DIV_CODE", "FID_ORG_ADJ_PRC"],
  },
  "/uapi/domestic-stock/v1/quotations/inquire-time-itemchartprice": {
    method: "GET",
    trIds: ["FHKST03010200"],
    params: ["FID_COND_MRKT_DIV_CODE", "FID_INPUT_ISCD", "FID_INPUT_HOUR_1", "FID_PW_DATA_INCU_YN"],
  },
  "/uapi/domestic-stock/v1/trading/inquire-psbl-order": {
    method: "GET",
    trIds: ["TTTC8908R", "VTTC8908R"],
    params: ["CANO", "ACNT_PRDT_CD", "PDNO", "ORD_UNPR", "ORD_DVSN", "CMA_EVLU_AMT_ICLD_YN", "OVRS_ICLD_YN"],
  },
  "/uapi/domestic-stock/v1/trading/inquire-balance": {
    method: "GET",
    trIds: ["TTTC8434R", "VTTC8434R"],
    params: ["CANO", "ACNT_PRDT_CD", "AFHR_FLPR_YN", "OFL_YN", "INQR_DVSN", "UNPR_DVSN", "FUND_STTL_ICLD_YN", "FNCG_AMT_AUTO_RDPT_YN", "PRCS_DVSN", "CTX_AREA_FK100", "CTX_AREA_NK100"],
  },
  "/uapi/domestic-stock/v1/trading/inquire-daily-ccld": {
    method: "GET",
    trIds: ["TTTC0081R", "VTTC0081R", "CTSC9215R", "VTSC9215R"],
    params: ["CANO", "ACNT_PRDT_CD", "INQR_STRT_DT", "INQR_END_DT", "SLL_BUY_DVSN_CD", "INQR_DVSN", "PDNO", "CCLD_DVSN", "ORD_GNO_BRNO", "ODNO", "INQR_DVSN_3", "INQR_DVSN_1", "CTX_AREA_FK100", "CTX_AREA_NK100"],
  },
  "/uapi/domestic-stock/v1/trading/order-cash": {
    method: "POST",
    trIds: ["TTTC0011U", "TTTC0012U", "VTTC0011U", "VTTC0012U"],
    params: ["CANO", "ACNT_PRDT_CD", "PDNO", "ORD_DVSN", "ORD_QTY", "ORD_UNPR"],
  },
  "/uapi/domestic-stock/v1/trading/order-rvsecncl": {
    method: "POST",
    trIds: ["TTTC0013U", "VTTC0013U"],
    params: ["CANO", "ACNT_PRDT_CD", "KRX_FWDG_ORD_ORGNO", "ORGN_ODNO", "ORD_DVSN", "RVSE_CNCL_DVSN_CD", "ORD_QTY", "ORD_UNPR", "QTY_ALL_ORD_YN"],
  },
  H0STCNT0: { method: "POST", trIds: ["H0STCNT0"], params: ["tr_id", "tr_key"] },
  H0STASP0: { method: "POST", trIds: ["H0STASP0"], params: ["tr_id", "tr_key"] },
  H0STCNI0: { method: "POST", trIds: ["H0STCNI0"], params: ["tr_id", "tr_key"] },
});

const generatedAt = new Date().toISOString();

async function main() {
  await fs.rm(GENERATED_DIR, { recursive: true, force: true });
  await ensureDir(GENERATED_DIR);

  const kiwoomManifest = await buildKiwoomManifest();
  const lsManifest = await buildLsManifest();
  const dbManifest = await buildDbManifest();
  const kisManifest = await buildKisManifest();
  const summary = buildSummary(kiwoomManifest, lsManifest, dbManifest, kisManifest);

  await writeJson(path.join(GENERATED_DIR, "kiwoom-manifest.json"), kiwoomManifest);
  await writeJson(path.join(GENERATED_DIR, "ls-manifest.json"), lsManifest);
  await writeJson(path.join(GENERATED_DIR, "db-manifest.json"), dbManifest);
  await writeJson(path.join(GENERATED_DIR, "kis-manifest.json"), kisManifest);
  await writeJson(path.join(GENERATED_DIR, "broker-manifest-summary.json"), summary);

  console.log(`Kiwoom manifest: ${Object.keys(kiwoomManifest.apis).length} APIs`);
  console.log(`LS manifest: ${Object.keys(lsManifest.apis).length} TRs`);
  console.log(`DB manifest: ${Object.keys(dbManifest.apis).length} TRs`);
  console.log(`KIS manifest: ${Object.keys(kisManifest.apis).length} APIs`);
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

async function buildDbManifest() {
  const menu = await readJson(path.join(RAW_DIR, "db", "menu.json"));
  const apiDetailsById = await readJson(path.join(RAW_DIR, "db", "api-details-by-id.json"));
  const trsByApiId = await readJson(path.join(RAW_DIR, "db", "trs-by-api-id.json"));
  const propertiesByTrId = await readJson(path.join(RAW_DIR, "db", "properties-by-tr-id.json"));
  const propertyTypes = await readJson(path.join(RAW_DIR, "db", "property-types.json"));
  const propertyTypeMap = Object.fromEntries((propertyTypes.codes ?? []).map((item) => [item.key, item.value]));
  const apis = {};
  const seenTrCodes = new Map();

  for (const group of menu.groups ?? []) {
    for (const apiMenu of group.apis ?? []) {
      const detail = apiDetailsById[apiMenu.id] ?? {};
      const trList = trsByApiId[apiMenu.id] ?? [];

      for (const tr of trList) {
        const trCode = requiredString(tr.trCode, "DB tr.trCode");
        const id = uniquePortalTrCode(trCode, tr, apiMenu, seenTrCodes);
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

        apis[id] = {
          broker: "db",
          id,
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
          authRequired: inferDbAuthRequired(detail, requestHeaders),
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
            { continueFlag: "cont_yn", nextKey: "cont_key" },
            { cont_yn: "N" },
          ),
          requiredConfig: buildLsRequiredConfig(requestHeaders),
          examples: {
            request: parseJsonOrNull(requestRaw),
            response: parseJsonOrNull(responseRaw),
            requestRaw,
            responseRaw,
          },
          sourceRef: {
            officialUrl: `${DB_BASE}/apiservice?group_id=${encodeURIComponent(group.id)}&api_id=${encodeURIComponent(apiMenu.id)}`,
            rawFile: "data/raw/db/trs-by-api-id.json",
            rawId: tr.id,
            docPath: `docs/db/${lsDocRelativePath(group, apiMenu, tr)}`,
          },
          db: {
            apiId: apiMenu.id,
            apiName: stringOrNull(apiMenu.name) ?? stringOrNull(detail.name),
            trId: tr.id,
            trCode,
            groupId: group.id,
            groupName: stringOrNull(group.name),
            duplicateOf: id === trCode ? null : trCode,
          },
        };
      }
    }
  }

  return {
    broker: "db",
    generatedAt,
    source: {
      docsUrl: DB_GUIDE_URL,
      rawFiles: [
        "data/raw/db/menu.json",
        "data/raw/db/api-details-by-id.json",
        "data/raw/db/trs-by-api-id.json",
        "data/raw/db/properties-by-tr-id.json",
        "data/raw/db/property-types.json",
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

async function buildKisManifest() {
  const menu = await readJson(path.join(RAW_DIR, "kis", "menu.json"));
  const sampleMap = await readJson(path.join(RAW_DIR, "kis", "sample-map.json"));
  const apis = {};

  for (const api of menu.apis ?? []) {
    const sample = sampleMap.byApiUrl?.[api.path] ?? null;
    const trIds = sample?.trIds ?? [];
    const isWebSocket = api.path.startsWith("/tryitout/");
    const id = isWebSocket ? api.path.split("/").pop() : api.path;
    const method = inferKisMethod(api.path, sample);
    const requestFields = normalizeKisRequestFields(sample?.params ?? [], method === "GET" ? "query" : "body");
    const authRequired = !["/oauth2/tokenP", "/oauth2/revokeP", "/oauth2/Approval"].includes(api.path);
    const entry = {
      broker: "kis",
      id,
      name: api.name || id,
      category: api.category || "uncategorized",
      group: api.category || null,
      protocol: isWebSocket ? "WEBSOCKET" : "REST",
      method,
      domains: isWebSocket ? KIS_WEBSOCKET_DOMAINS : KIS_DOMAINS,
      path: isWebSocket ? "/websocket" : api.path,
      contentType: "application/json; charset=UTF-8",
      requestFormat: "json",
      authRequired,
      rateLimit: { perSecond: null, raw: null },
      headers: {
        request: normalizeKisHeaderFields(api.path, authRequired, trIds, isWebSocket),
        response: [
          kisField("tr_cont", "연속거래여부", "header", "response", 1, false),
          kisField("gt_uid", "Global UID", "header", "response", 2, false),
        ],
      },
      body: {
        request: requestFields,
        response: [],
      },
      continuation: buildKisContinuation(authRequired),
      examples: {
        request: null,
        response: null,
        requestRaw: null,
        responseRaw: null,
      },
      sourceRef: {
        officialUrl: KIS_GUIDE_URL,
        sampleRepo: KIS_SAMPLE_REPO_URL,
        rawFile: "data/raw/kis/menu.json",
        rawId: api.path,
        docPath: `docs/kis/${kisDocRelativePath(api)}`,
      },
      kis: {
        apiPath: api.path,
        trIds,
        sampleFiles: sample?.files ?? [],
        hashRequired: false,
        websocket: isWebSocket,
      },
    };

    applyKisServiceOverrides(entry);
    apis[id] = entry;
  }

  if (!apis["/uapi/hashkey"]) {
    apis["/uapi/hashkey"] = buildKisHashKeyEntry();
  }

  return {
    broker: "kis",
    generatedAt,
    source: {
      docsUrl: KIS_GUIDE_URL,
      sampleRepo: KIS_SAMPLE_REPO_URL,
      rawFiles: [
        "data/raw/kis/menu.json",
        "data/raw/kis/sample-map.json",
      ],
    },
    counts: {
      APIs: Object.keys(apis).length,
      categories: (menu.categories ?? []).length,
      portalPaths: (menu.apis ?? []).length,
      sampleMappedPaths: Object.keys(sampleMap.byApiUrl ?? {}).length,
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

function inferDbAuthRequired(detail, requestHeaders) {
  if (detail.accessUrl === "/oauth2/token") {
    return false;
  }
  return requestHeaders.some((field) => field.id.toLowerCase() === "authorization");
}

function uniquePortalTrCode(trCode, tr, apiMenu, seenTrCodes) {
  if (!seenTrCodes.has(trCode)) {
    seenTrCodes.set(trCode, 1);
    return trCode;
  }

  const index = seenTrCodes.get(trCode) + 1;
  seenTrCodes.set(trCode, index);
  return `${trCode}__${index}_${String(apiMenu.id ?? tr.id).slice(0, 8)}`;
}

function inferKisMethod(apiPath, sample = null) {
  if (["/oauth2/tokenP", "/oauth2/revokeP", "/oauth2/Approval", "/uapi/hashkey"].includes(apiPath)) {
    return "POST";
  }

  if (sample?.postFlag === true) {
    return "POST";
  }

  if (apiPath.includes("/trading/order") || apiPath.includes("/trading/daytime-order")) {
    return "POST";
  }

  return "GET";
}

function normalizeKisRequestFields(params, locationHint) {
  return (params ?? []).map((param, index) => kisField(
    param,
    param,
    locationHint === "query" ? "body" : "body",
    "request",
    index + 1,
    true,
  ));
}

function normalizeKisHeaderFields(apiPath, authRequired, trIds, isWebSocket) {
  const fields = [];
  let order = 1;

  fields.push(kisField("content-type", "Content-Type", "header", "request", order, false));
  order += 1;

  if (isWebSocket) {
    fields.push(kisField("approval_key", "WebSocket approval key", "header", "request", order, true));
    fields.push(kisField("custtype", "Customer type", "header", "request", order + 1, false));
    fields.push(kisField("tr_type", "Transaction type", "header", "request", order + 2, true));
    return fields;
  }

  if (authRequired) {
    fields.push(kisField("authorization", "Authorization bearer token", "header", "request", order, true));
    order += 1;
  }

  fields.push(kisField("appkey", "App key", "header", "request", order, true));
  fields.push(kisField("appsecret", "App secret", "header", "request", order + 1, true));
  order += 2;

  if (trIds.length > 0) {
    fields.push(kisField("tr_id", "Transaction ID", "header", "request", order, true));
    order += 1;
  }

  if (authRequired && !apiPath.startsWith("/oauth2/")) {
    fields.push(kisField("custtype", "Customer type", "header", "request", order, false));
    fields.push(kisField("tr_cont", "Continuation flag", "header", "request", order + 1, false));
  }

  return fields;
}

function kisField(id, name, location, direction, order, required) {
  return {
    id,
    name,
    type: "String",
    required,
    length: null,
    location,
    direction,
    order,
    sample: null,
    description: null,
    raw: { id, name },
  };
}

function buildKisContinuation(authRequired) {
  if (!authRequired) {
    return null;
  }

  return {
    supported: true,
    requestHeaders: {
      continueFlag: "tr_cont",
      nextKey: undefined,
    },
    responseHeaders: {
      continueFlag: "tr_cont",
      nextKey: undefined,
    },
    requestDefaults: { tr_cont: "" },
  };
}

function applyKisServiceOverrides(entry) {
  const override = KIS_SERVICE_OVERRIDES[entry.id];
  if (!override) {
    return;
  }

  entry.method = override.method ?? entry.method;
  entry.kis.trIds = override.trIds ?? entry.kis.trIds;
  entry.headers.request = normalizeKisHeaderFields(entry.kis.apiPath, entry.authRequired, entry.kis.trIds, entry.kis.websocket);
  entry.body.request = (override.params ?? []).map((param, index) => kisField(
    param,
    param,
    "body",
    "request",
    index + 1,
    true,
  ));
  entry.kis.hashRequired = override.hashRequired ?? entry.kis.hashRequired;
}

function buildKisHashKeyEntry() {
  return {
    broker: "kis",
    id: "/uapi/hashkey",
    name: "Hash key 발급",
    category: "OAuth인증",
    group: "OAuth인증",
    protocol: "REST",
    method: "POST",
    domains: KIS_DOMAINS,
    path: "/uapi/hashkey",
    contentType: "application/json; charset=UTF-8",
    requestFormat: "json",
    authRequired: false,
    rateLimit: { perSecond: null, raw: null },
    headers: {
      request: [
        kisField("content-type", "Content-Type", "header", "request", 1, false),
        kisField("appkey", "App key", "header", "request", 2, true),
        kisField("appsecret", "App secret", "header", "request", 3, true),
      ],
      response: [],
    },
    body: {
      request: [],
      response: [kisField("HASH", "Hash key", "body", "response", 1, true)],
    },
    continuation: null,
    examples: {
      request: null,
      response: null,
      requestRaw: null,
      responseRaw: null,
    },
    sourceRef: {
      officialUrl: KIS_SAMPLE_REPO_URL,
      sampleRepo: KIS_SAMPLE_REPO_URL,
      rawFile: "data/raw/kis/sample-map.json",
      rawId: "/uapi/hashkey",
      docPath: "docs/kis/uapi-hashkey.md",
    },
    kis: {
      apiPath: "/uapi/hashkey",
      trIds: [],
      sampleFiles: ["examples_llm/kis_auth.py"],
      hashRequired: false,
      websocket: false,
    },
  };
}

function buildKiwoomRequestExample(requestBody) {
  const result = {};
  for (const field of requestBody) {
    result[field.id] = field.sample ?? "";
  }
  return result;
}

function buildSummary(kiwoomManifest, lsManifest, dbManifest, kisManifest) {
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
      db: {
        groups: dbManifest.counts.groups,
        apiPages: dbManifest.counts.apiPages,
        trs: dbManifest.counts.APIs,
        manifest: "data/generated/db-manifest.json",
      },
      kis: {
        categories: kisManifest.counts.categories,
        portalPaths: kisManifest.counts.portalPaths,
        apis: kisManifest.counts.APIs,
        sampleMappedPaths: kisManifest.counts.sampleMappedPaths,
        manifest: "data/generated/kis-manifest.json",
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

function kisDocRelativePath(api) {
  const category = slugify(api.category ?? "uncategorized");
  const fileName = `${slugify(api.name ?? api.path)}-${slugify(api.path)}.md`;
  return `${category}/${fileName}`;
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
