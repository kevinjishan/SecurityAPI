import fs from 'node:fs';
const schema=JSON.parse(fs.readFileSync(new URL('./kis-domestic-master-schema.json',import.meta.url),'utf8'));
const fail=code=>{throw Error(code)};
const yn=x=>x==='Y'?true:x==='N'?false:null;
function classify(r){
 const group=r.scrt_grp_cls_code,etp=r.etp_prod_cls_code,preferred=r.prst_cls_code,spac=yn(r.etpr_undt_objt_co_yn);
 let kind='UNKNOWN';
 if(['3','4'].includes(etp))kind='ETN';
 else if(['1','2'].includes(etp)||['EF','FE'].includes(group))kind='ETF';
 else if(group==='ST'&&['','0'].includes(etp)&&spac===true)kind='SPAC';
 else if(group==='ST'&&['','0'].includes(etp)&&spac===false&&preferred==='0')kind='COMMON_STOCK';
 else if(group==='ST'&&['','0'].includes(etp)&&spac===false&&['1','2'].includes(preferred))kind='PREFERRED_STOCK';
 else if(['MF','RT','SC','IF','DR','EW','SW','SR','BC','FS'].includes(group))kind='OTHER';
 const status={halted:yn(r.trht_yn),liquidating:yn(r.sltr_yn),managed:yn(r.mang_issu_yn),marketWarningCode:r.mrkt_alrm_cls_code||null,investmentAttention:yn(r.invt_alrm_yn)};
 const exclusionReasons=[];
 if(kind!=='COMMON_STOCK')exclusionReasons.push('KIND_'+kind);
 for(const [key,val]of Object.entries(status).filter(([key])=>['halted','liquidating','managed'].includes(key))){if(val===true)exclusionReasons.push(key.toUpperCase());if(val===null)exclusionReasons.push(key.toUpperCase()+'_UNKNOWN')}
 return {kind,status,currentEligible:exclusionReasons.length===0,exclusionReasons};
}
/** Parse official KIS CP949 master bytes (or already-decoded text); no network/authentication side effects. */
export function parseKisDomesticStockMaster(input,{market}={}){
 const layout=schema.markets[market];if(!layout)fail('MASTER_MARKET_INVALID');
 let text;
 try{text=typeof input==='string'?input:new TextDecoder('euc-kr',{fatal:true}).decode(input)}catch{fail('MASTER_ENCODING_INVALID')}
 if(typeof text!=='string'||!text||text.includes('\0')||text.length>16777216)fail('MASTER_INPUT_INVALID');
 const lines=text.split('\n');if(lines.at(-1)==='')lines.pop();if(!lines.length||lines.length>30000)fail('MASTER_INPUT_INVALID');
 const symbols=new Set(),isins=new Set(),instruments=[];
 for(let line of lines){
  if(line.endsWith('\r'))line=line.slice(0,-1);
  if(line.length<layout.tailWidth+22)fail('MASTER_LAYOUT_INVALID');
  const prefix=line.slice(0,-layout.tailWidth),tail=line.slice(-layout.tailWidth);
  const symbol=prefix.slice(0,9).trim(),isin=prefix.slice(9,21).trim(),name=prefix.slice(21).trim();
  if(!/^[A-Z0-9]{6,9}$/.test(symbol)||!/^[A-Z]{2}[A-Z0-9]{9}\d$/.test(isin)||!name||symbols.has(symbol)||isins.has(isin))fail('MASTER_IDENTITY_INVALID');
  if(!/^[\x20-\x7e]+$/.test(tail))fail('MASTER_LAYOUT_INVALID');
  symbols.add(symbol);isins.add(isin);let offset=0;const native={};
  for(const field of layout.fields){native[field.id]=tail.slice(offset,offset+field.width).trim();offset+=field.width}
  if(offset!==tail.length)fail('MASTER_LAYOUT_INVALID');
  instruments.push({symbol,isin,name,market:market.toUpperCase(),...classify(native),listingDate:/^\d{8}$/.test(native.stck_lstn_date)?native.stck_lstn_date:null,historicalAvailableAt:null,native});
 }
 return {broker:'kis',source:'PUBLIC_DOMESTIC_STOCK_MASTER',market:market.toUpperCase(),layout:{schemaVersion:schema.schema,officialRepository:schema.official_repository,officialCommit:schema.official_commit,tailWidth:layout.tailWidth},historicalConstituentsVerified:false,instruments};
}
