import {BrokerError} from '../core/BrokerError.mjs';
const fail=message=>{throw BrokerError.validation('Corporate action: '+message);};
const scalar=v=>v==null?null:typeof v==='string'||typeof v==='number'&&Number.isFinite(v)?String(v):fail('provider field must be scalar');
export function normalizeLsCandleAdjustment(row={}){
 return {schema:'securityapi.candle-adjustment.v1',provider:'ls',code:scalar(row.jongchk),rateRaw:scalar(row.rate),priceCheck:scalar(row.pricechk),quantityRatio:null,interpretation:'OPAQUE_PROVIDER_FIELDS'};
}
const symbol=v=>{if(typeof v!=='string'||!/^\w{6}$/.test(v)||!/^[0-9A-Z]{6}$/.test(v))fail('invalid symbol');return v;};
const time=(v,name)=>{if(v===null)return null;if(!Number.isSafeInteger(v)||v<0)fail(name+' must be epoch milliseconds or null');return v;};
const nat=(v,zero=false)=>{if(typeof v!=='string'||! /^(0|[1-9][0-9]{0,23})$/.test(v)||(!zero&&BigInt(v)===0n))fail('ratio must be bounded integer strings');return v;};
const kinds=new Set(['SPLIT','CONSOLIDATION','SPIN_OFF','CASH_DIVIDEND','RIGHTS','UNKNOWN']);
export function validateCorporateActionTerms(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||value.schema!=='securityapi.corporate-action.v1')fail('unsupported schema');
 if(typeof value.id!=='string'||! /^[A-Za-z0-9_.:-]{1,100}$/.test(value.id))fail('invalid id');
 if(!kinds.has(value.kind))fail('invalid kind');
 if(!['ALL_HOLDERS','ORDINARY_EXTERNAL','UNKNOWN'].includes(value.eligibility))fail('invalid eligibility');
 const e={schema:value.schema,id:value.id,symbol:symbol(value.symbol),kind:value.kind,eligibility:value.eligibility,
  entitlementAt:time(value.entitlementAt,'entitlementAt'),effectiveAt:time(value.effectiveAt,'effectiveAt'),observedAt:time(value.observedAt,'observedAt')};
 if(e.entitlementAt!==null&&e.effectiveAt!==null&&e.entitlementAt>e.effectiveAt)fail('entitlement must not follow effective time');
 if(!Array.isArray(value.outputs)||!Array.isArray(value.cash)||!Array.isArray(value.evidence)||!Array.isArray(value.blockers))fail('missing arrays');
 if(value.outputs.length>8||value.cash.length>8||value.evidence.length>32)fail('too many terms');
 e.outputs=value.outputs.map(o=>{
  const deliveryAt=time(o.deliveryAt,'deliveryAt');if(deliveryAt!==null&&e.effectiveAt!==null&&deliveryAt<e.effectiveAt)fail('delivery before effect');
  const fractionDisposition=o.fractionDisposition??'CLAIM';if(!['CLAIM','CANCEL'].includes(fractionDisposition))fail('invalid fraction disposition');
  const fractionEvidence=(o.fractionEvidence??[]).map(p=>{if(!p||typeof p.url!=='string'||!p.url.startsWith('https://')||typeof p.sha256!=='string'||!/^[a-f0-9]{64}$/.test(p.sha256)||!Number.isSafeInteger(p.observedAt)||p.observedAt<0)fail('invalid fraction evidence');return {url:p.url,sha256:p.sha256,observedAt:p.observedAt};});
  return {symbol:symbol(o.symbol),numerator:nat(o.numerator,true),denominator:nat(o.denominator),deliveryAt,fractionDisposition,fractionEvidence};
 });
 if(new Set(e.outputs.map(o=>o.symbol)).size!==e.outputs.length)fail('duplicate output symbol');
 e.cash=value.cash.map(o=>{if(o.currency!=='KRW')fail('unsupported currency');const payAt=time(o.payAt,'payAt');if(payAt!==null&&e.effectiveAt!==null&&payAt<e.effectiveAt)fail('payment before effect');return {currency:'KRW',numerator:nat(o.numerator,true),denominator:nat(o.denominator),payAt};});
 e.evidence=value.evidence.map(p=>{
  if(typeof p.url!=='string'||!p.url.startsWith('https://')||typeof p.sha256!=='string'||!/^[a-f0-9]{64}$/.test(p.sha256))fail('invalid evidence');
  const observedAt=time(p.observedAt,'evidence observedAt');if(observedAt===null)fail('evidence time missing');
  return {url:p.url,sha256:p.sha256,observedAt};
 });
 if(!value.blockers.every(b=>typeof b==='string'&&b.length>0&&b.length<=160))fail('invalid blockers');
 const blockers=new Set(value.blockers);
 if(e.entitlementAt===null)blockers.add('ENTITLEMENT_SNAPSHOT_TIME_UNKNOWN');
 if(e.effectiveAt===null)blockers.add('EFFECTIVE_TIME_UNKNOWN');
 if(e.observedAt===null)blockers.add('OBSERVED_TIME_UNKNOWN');
 if(e.observedAt!==null&&e.evidence.some(p=>p.observedAt>e.observedAt))fail('event observation precedes evidence');
 if(e.eligibility==='UNKNOWN')blockers.add('HOLDER_ELIGIBILITY_UNKNOWN');
 if(!e.evidence.length)blockers.add('EVIDENCE_REQUIRED');
 if(!e.outputs.length)blockers.add('SOURCE_REPLACEMENT_TERMS_REQUIRED');
 if(e.outputs.some(o=>o.deliveryAt===null))blockers.add('DELIVERY_TIME_UNKNOWN');
 if(e.outputs.some(o=>o.fractionDisposition==='CANCEL'&&!o.fractionEvidence.length))blockers.add('FRACTION_CANCELLATION_EVIDENCE_REQUIRED');
 if(e.observedAt!==null&&e.outputs.some(o=>o.fractionEvidence.some(p=>p.observedAt>e.observedAt)))fail('event observation precedes fraction evidence');
 if(['UNKNOWN','RIGHTS'].includes(e.kind))blockers.add('ACTION_KIND_UNSUPPORTED');
 e.blockers=[...blockers].sort();e.status=e.blockers.length?'PARTIAL':'TERMS_COMPLETE';
 e.performanceCertified=false;
 return e;
}
