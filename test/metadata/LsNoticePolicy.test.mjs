import assert from "node:assert/strict";
import test from "node:test";
import {createMetadataRegistry} from "../../src/metadata/index.mjs";
const registry=await createMetadataRegistry();
const fieldName=f=>f.id.replaceAll("&nbsp;","").replace(/^[ -]+/,"");
test("notice-derived optional regular-session fields are discoverable on both LS minute TRs",()=>{
 for(const tr of ["t8412","t8452"]){
  const f=registry.getRequestFields("ls",tr).filter(f=>fieldName(f)==="krx_mmk_gubun");
  assert.equal(f.length,1);assert.equal(f[0].required,false);
  assert.equal(f[0].sourceEvidence.kind,"OFFICIAL_NOTICE");
  assert.ok(f[0].description.includes("Y"));assert.equal(f[0].raw,null);
 }
});
test("latest KRX session fields are present on all announced integrated chart TRs",()=>{
 for(const tr of ["t8451","t8452","t8453"]){
  const fields=registry.getResponseFields("ls",tr).map(fieldName);
  for(const suffix of ["fm_s_time","fm_e_time","fm_dshmin","am_s_time","am_e_time","am_dshmin"])assert.ok(fields.includes("krx_"+suffix),tr+":"+suffix);
 }
 assert.equal(registry.listApiIds("ls").length,365);
});
test("usage policy distinguishes effective session announcement from future subscription limit",()=>{
 const p=registry.getUsagePolicy("ls");
 const sessions=p.rules.find(r=>r.id==="account-appkey-sessions");
 assert.equal(sessions.limit,3);assert.equal(sessions.effectiveFrom,"2026-10-31T08:00:00+09:00");
 const subscriptions=p.rules.find(r=>r.id==="subscriptions-per-session");
 assert.equal(subscriptions.limit,200);assert.equal(subscriptions.effectiveFrom,null);
 assert.equal(subscriptions.status,"ANNOUNCED_NOT_CONFIRMED_ACTIVE");
 sessions.limit=999;assert.equal(registry.getUsagePolicy("ls").rules.find(r=>r.id===sessions.id).limit,3);
 assert.equal(registry.getUsagePolicy("kis").status,"UNKNOWN");
 assert.equal(registry.getEndpoint("ls","t8412").rateLimit.perSecond,1);
 assert.equal(registry.getEndpoint("kiwoom","ka10080").rateLimit.perSecond,null);
});
