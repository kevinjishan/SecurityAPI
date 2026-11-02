import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveRequestRatePolicy} from '../../src/core/index.mjs';
import {createMetadataRegistry,resolveRequestRatePolicy as publicResolve} from '../../src/index.mjs';
const entry=(rate,id='t8410')=>({broker:'ls',id,rateLimit:{perSecond:rate}});
test('the public API derives chart spacing from the actual pinned manifest',async()=>{
 const registry=await createMetadataRegistry(),p=publicResolve(registry.requireEntry('ls','t8410'),{safetyMarginMs:100});
 assert.equal(p.perSecond,1);assert.equal(p.metadataIntervalMs,1000);assert.equal(p.effectiveGapMs,1100);assert.equal(p.source,'SDK_METADATA');assert.equal(p.brokerQuotaVerified,false);
});
test('fractional quotas and a stricter local floor are both preserved',()=>{
 assert.equal(resolveRequestRatePolicy(entry(.5),{safetyMarginMs:100,localFloorMs:1100}).effectiveGapMs,2100);
 assert.equal(resolveRequestRatePolicy(entry(5),{safetyMarginMs:100,localFloorMs:1100}).effectiveGapMs,1100);
 assert.equal(resolveRequestRatePolicy(entry(3)).metadataIntervalMs,334);
});
test('unknown metadata requires an explicit positive local fallback',()=>{
 assert.throws(()=>resolveRequestRatePolicy(entry(null)),/RATE_LIMIT_UNSPECIFIED/);
 const p=resolveRequestRatePolicy(entry(null),{unknownGapMs:2000,localFloorMs:1100});
 assert.equal(p.effectiveGapMs,2000);assert.equal(p.source,'EXPLICIT_LOCAL_FALLBACK');assert.equal(p.perSecond,null);
 assert.throws(()=>resolveRequestRatePolicy(entry(null),{unknownGapMs:0}),/RATE_POLICY_INVALID/);
});
test('invalid known quotas cannot silently become unlimited or use the unknown fallback',()=>{
 for(const rate of [0,-1,NaN,Infinity,'1',1e-20])assert.throws(()=>resolveRequestRatePolicy(entry(rate),{unknownGapMs:1100}),/RATE_POLICY_INVALID/);
});
test('missing metadata is unknown and an unrelated broker ID is retained',()=>{
 const p=resolveRequestRatePolicy({broker:'kis',id:'/uapi/test'}, {unknownGapMs:500});
 assert.equal(p.broker,'kis');assert.equal(p.id,'/uapi/test');assert.equal(p.effectiveGapMs,500);
});
test('invalid identity, negative margins and unrecognized options fail closed',()=>{
 for(const [e,o] of [[{},{}],[entry(1),{localFloorMs:-1}],[entry(1),{safetyMarginMs:.5}],[entry(1),{extra:1}]])assert.throws(()=>resolveRequestRatePolicy(e,o),/RATE_POLICY_INVALID/);
});
test('policy resolution is pure and never installs an independent timer or mutates metadata',()=>{
 const e=Object.freeze({broker:'ls',id:'t8410',rateLimit:Object.freeze({perSecond:1})});
 const p=resolveRequestRatePolicy(e,{localFloorMs:1100});assert.equal(Object.isFrozen(p),true);assert.equal(e.rateLimit.perSecond,1);assert.equal(p.effectiveGapMs,1100);
});
