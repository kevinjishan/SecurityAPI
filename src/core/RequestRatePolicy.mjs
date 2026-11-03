const fail=()=>{throw Error('RATE_POLICY_INVALID');};
const integer=x=>Number.isSafeInteger(x)&&x>=0;
/** Interpret metadata for a caller-owned shared controller; no request or private queue. */
export function resolveRequestRatePolicy(entry,options={}){
 if(!entry||typeof entry.broker!=='string'||!entry.broker||typeof entry.id!=='string'||!entry.id||
 !options||typeof options!=='object'||Array.isArray(options)||Object.keys(options).some(k=>!['localFloorMs','safetyMarginMs','unknownGapMs'].includes(k)))fail();
 const {localFloorMs=0,safetyMarginMs=0,unknownGapMs}=options;
 if(!integer(localFloorMs)||!integer(safetyMarginMs)||unknownGapMs!==undefined&&(!integer(unknownGapMs)||unknownGapMs<1))fail();
 const perSecond=entry.rateLimit?.perSecond??null;
 if(perSecond!==null&&(typeof perSecond!=='number'||!Number.isFinite(perSecond)||perSecond<=0))fail();
 if(perSecond===null&&unknownGapMs===undefined)throw Error('RATE_LIMIT_UNSPECIFIED');
 const metadataIntervalMs=perSecond===null?null:Math.ceil(1000/perSecond);
 if(metadataIntervalMs!==null&&(!integer(metadataIntervalMs)||metadataIntervalMs<1))fail();
 const base=metadataIntervalMs??unknownGapMs;
 if(!integer(base+safetyMarginMs))fail();
 return Object.freeze({schema:1,broker:entry.broker,id:entry.id,perSecond,metadataIntervalMs,
 effectiveGapMs:Math.max(localFloorMs,base+safetyMarginMs),
 source:perSecond===null?'EXPLICIT_LOCAL_FALLBACK':'SDK_METADATA',brokerQuotaVerified:false});
}
