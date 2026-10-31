import assert from "node:assert/strict";
import test from "node:test";
import {applyLsNoticeUpdates} from "../../scripts/lib/ls-notice-updates.mjs";
const manifest={broker:"ls",source:{},apis:{t8412:{body:{request:[{id:"t8412InBlock",type:"Object",order:1}],response:[]}}}};
const patch={schemaVersion:1,broker:"ls",checkedAt:"2026-10-31",notices:[{id:"notice",url:"https://openapi.ls-sec.co.kr/notice",announcedEffectiveFrom:"2026-10-22T16:00:00+09:00"}],fields:[{trCode:"t8412",block:"t8412InBlock",direction:"request",name:"krx_mmk_gubun",label:"session",type:"String",length:"1",description:"Y regular; other all",noticeId:"notice"}],usagePolicy:{rules:[]}};
test("notice overlay is idempotent and leaves the base snapshot untouched",()=>{
 const before=JSON.stringify(manifest),once=applyLsNoticeUpdates(manifest,patch),twice=applyLsNoticeUpdates(once,patch);
 assert.equal(JSON.stringify(manifest),before);assert.deepEqual(once,twice);assert.equal(once.apis.t8412.body.request.length,2);
});
test("notice overlay rejects collisions, unknown targets and untrusted source provenance",()=>{
 for(const change of [p=>p.fields[0].trCode="missing",p=>p.fields[0].block="t8412OutBlock",p=>p.notices[0].url="https://untrusted.invalid",p=>p.fields.push({...p.fields[0]})]){
  const p=structuredClone(patch);change(p);assert.throws(()=>applyLsNoticeUpdates(manifest,p));
 }
 const once=applyLsNoticeUpdates(manifest,patch);once.apis.t8412.body.request[1].description="conflict";
 assert.throws(()=>applyLsNoticeUpdates(once,patch),/LS_NOTICE_FIELD_CONFLICT/);
});
