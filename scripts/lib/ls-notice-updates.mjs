const nameOf=field=>field.id.replaceAll("&nbsp;","").replace(/^[ -]+/,"");
export function applyLsNoticeUpdates(manifest,updates){
 if(manifest?.broker!=="ls"||updates?.schemaVersion!==1||updates.broker!=="ls"||!Array.isArray(updates.fields)||!Array.isArray(updates.notices))throw Error("INVALID_LS_NOTICE_UPDATES");
 const result=structuredClone(manifest),notices=new Map();
 for(const n of updates.notices){
  if(typeof n.id!=="string"||notices.has(n.id)||!String(n.url).startsWith("https://openapi.ls-sec.co.kr/"))throw Error("INVALID_LS_NOTICE_SOURCE");
  notices.set(n.id,n);
 }
 const seen=new Set();
 for(const patch of updates.fields){
  const notice=notices.get(patch.noticeId),entry=result.apis[patch.trCode],direction=patch.direction;
  if(!notice||!entry||!["request","response"].includes(direction)||!/^krx_[a-z_]+$/.test(patch.name)||patch.type!=="String")throw Error("INVALID_LS_FIELD_UPDATE");
  const fields=entry.body[direction],block=fields.find(f=>f.id===patch.block&&f.type==="Object");
  const identity=patch.trCode+":"+patch.block+":"+patch.name;
  if(!block||seen.has(identity))throw Error("INVALID_LS_FIELD_UPDATE");seen.add(identity);
  const group=Math.floor(block.order);
  const existing=fields.find(f=>Math.floor(f.order)===group&&nameOf(f)===patch.name);
  if(existing){
   if(existing.sourceEvidence?.noticeId!==notice.id||existing.description!==patch.description||existing.type!==patch.type||existing.length!==patch.length)throw Error("LS_NOTICE_FIELD_CONFLICT");
   continue;
  }
  const order=Number((Math.max(...fields.filter(f=>Math.floor(f.order)===group).map(f=>f.order))+.001).toFixed(6));
  fields.push({id:"&nbsp;&nbsp;-"+patch.name,name:patch.label,type:patch.type,required:false,length:patch.length,location:"body",direction,order,sample:null,description:patch.description,raw:null,
   sourceEvidence:{kind:"OFFICIAL_NOTICE",noticeId:notice.id,url:notice.url,block:patch.block,checkedAt:updates.checkedAt,announcedEffectiveFrom:notice.announcedEffectiveFrom,mandatoryStatus:"NOT_DECLARED_IN_NOTICE",orderBasis:"LOCAL_BLOCK_PLACEMENT"}});
  fields.sort((a,b)=>a.order-b.order);
 }
 result.usagePolicy=structuredClone(updates.usagePolicy);
 result.source.noticeUpdates={file:"data/updates/ls-20261031.json",checkedAt:updates.checkedAt,baseSnapshotDate:updates.baseSnapshotDate,notices:structuredClone(updates.notices)};
 return result;
}
