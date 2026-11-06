/** Pure LS usage-policy interpretation for a host-owned shared admission controller. No network or timers. */
const fail=(c='REALTIME_POLICY_INVALID')=>{throw Error(c);};
const positive=n=>Number.isSafeInteger(n)&&n>0;
const official=url=>{try{const u=new URL(url);return u.protocol==='https:'&&u.hostname==='openapi.ls-sec.co.kr'&&!u.username&&!u.password&&!u.hash;}catch{return false;}};
export function resolveRealtimeUsagePolicy(usage,options={}){
 if(usage?.broker!=='ls'||!Array.isArray(usage.rules)||!Array.isArray(usage.unknownLimits))fail('REALTIME_POLICY_UNAVAILABLE');
 const keys=['at','localMaxSessions','localMaxSubscriptions','localMessageGapMs'];
 if(!options||typeof options!=='object'||Array.isArray(options)||Object.keys(options).length!==keys.length||keys.some(k=>!Object.hasOwn(options,k))||
 !Number.isSafeInteger(options.at)||options.at<0||!positive(options.localMaxSessions)||!positive(options.localMaxSubscriptions)||!positive(options.localMessageGapMs))fail();
 if(typeof usage.checkedAt!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(usage.checkedAt)||!Number.isFinite(Date.parse(usage.checkedAt)))fail();
 if(options.at<Date.parse(usage.checkedAt))fail('REALTIME_POLICY_UNAVAILABLE');
 const sessions=usage.rules.filter(r=>r.dimension==='concurrentSessions'&&r.scope==='accountAppkey'&&r.status==='EFFECTIVE_ANNOUNCEMENT');
 const subscriptions=usage.rules.filter(r=>r.dimension==='subscriptions'&&r.scope==='session'&&r.status==='ANNOUNCED_NOT_CONFIRMED_ACTIVE');
 if(sessions.length!==1||subscriptions.length!==1)fail('REALTIME_POLICY_UNAVAILABLE');
 const s=sessions[0],b=subscriptions[0],effective=Date.parse(s.effectiveFrom);
 if(!positive(s.limit)||!positive(b.limit)||!official(s.sourceUrl)||!official(b.sourceUrl)||!Number.isFinite(effective))fail();
 if(options.at<effective)fail('REALTIME_POLICY_UNAVAILABLE');
 if(options.localMaxSessions>s.limit||options.localMaxSubscriptions>b.limit||options.localMessageGapMs>86400000)fail();
 if(usage.unknownLimits.some(x=>typeof x!=='string'||x.length>256))fail();
 return Object.freeze({schema:1,broker:'ls',sourceCheckedAt:usage.checkedAt,interpretedAt:options.at,
 officialSessionLimit:s.limit,sessionScope:'accountAppkey',sessionEffectiveFrom:s.effectiveFrom,
 announcedSubscriptionLimit:b.limit,subscriptionScope:'session',subscriptionActivationVerified:false,
 effectiveSessions:options.localMaxSessions,effectiveSubscriptions:options.localMaxSubscriptions,
 messageGapMs:options.localMessageGapMs,messageGapSource:'EXPLICIT_LOCAL_BOUND',brokerQuotaVerified:false,
 sources:Object.freeze([s.sourceUrl,b.sourceUrl]),unknownLimits:Object.freeze([...usage.unknownLimits]),
 enforcement:'HOST_SHARED_OWNER_REQUIRED'});
}
