/** Explicit KRX civil-day coverage. Pure normalization/date arithmetic; no network, account or clock. */
import {BrokerError} from '../core/BrokerError.mjs';
const fail=code=>{throw BrokerError.validation(code);};
const must=(ok,code)=>{if(!ok)fail(code);};
const DAY=86400000;
function parseDate(s){
 must(typeof s==='string'&&/^\d{8}$/.test(s),'CALENDAR_DATE_INVALID');
 const iso=s.slice(0,4)+'-'+s.slice(4,6)+'-'+s.slice(6),n=Date.parse(iso+'T00:00:00Z');
 must(Number.isFinite(n)&&new Date(n).toISOString().slice(0,10)===iso,'CALENDAR_DATE_INVALID');return n;
}
const label=n=>new Date(n).toISOString().slice(0,10).replaceAll('-','');
function proof(p){
 must(p&&typeof p.url==='string'&&p.url.startsWith('https://')&&/^[a-f0-9]{64}$/.test(p.sha256)&&Number.isSafeInteger(p.observedAt)&&p.observedAt>=0,'CALENDAR_EVIDENCE_REQUIRED');
 return {url:p.url,sha256:p.sha256,observedAt:p.observedAt};
}
function calendar(days,evidence,years){
 return {schema:'securityapi.trading-calendar.v1',venue:'KRX',timezone:'Asia/Seoul',
 from:days[0].date,to:days.at(-1).date,sourceYears:[...years],observedAt:Math.max(...evidence.map(p=>p.observedAt)),
 historicalAvailableAt:null,pointInTimeCertified:false,settlementCycle:'KRX_CASH_T_PLUS_2',
 scope:'RECONSTRUCTION_FROM_SUPPLIED_KRX_HOLIDAY_LIST_AND_NONTRADING_RULE',evidence:structuredClone(evidence),days:structuredClone(days)};
}
function validate(c){
 must(c?.schema==='securityapi.trading-calendar.v1'&&c.venue==='KRX'&&c.timezone==='Asia/Seoul'&&c.settlementCycle==='KRX_CASH_T_PLUS_2','CALENDAR_PROFILE_INVALID');
 must(Array.isArray(c.days)&&c.days.length>0&&c.days.length<=3660&&Array.isArray(c.evidence)&&c.evidence.length>=2,'CALENDAR_COVERAGE_REQUIRED');
 c.evidence.forEach(proof);const start=parseDate(c.from),end=parseDate(c.to);
 must(c.days.length===(end-start)/DAY+1,'CALENDAR_GAP');
 for(let i=0;i<c.days.length;i++){
  const d=c.days[i];must(d.date===label(start+i*DAY),'CALENDAR_GAP');
  must(typeof d.tradingDay==='boolean'&&typeof d.settlementDay==='boolean'&&d.tradingDay===d.settlementDay,'CALENDAR_DAY_FLAG_INVALID');
  must(d.sessionTimes===null&&d.timeStatus==='UNVERIFIED','CALENDAR_INTRADAY_UNVERIFIED');
 }
 return c;
}
export function normalizeKrxHolidayYear(year,payload,{holidayEvidence,ruleEvidence}={}){
 must(Number.isInteger(year)&&year>=1990&&year<=2100,'CALENDAR_YEAR_INVALID');
 must(Array.isArray(payload?.block1)&&payload.block1.length>0&&payload.block1.length<=100,'HOLIDAY_SOURCE_REQUIRED');
 const evidence=[proof(holidayEvidence),proof(ruleEvidence)],closed=new Map();
 for(const row of payload.block1){
  must(typeof row?.calnd_dd==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(row.calnd_dd),'HOLIDAY_DATE_INVALID');
  const date=row.calnd_dd.replaceAll('-','');parseDate(date);must(date.startsWith(String(year)),'HOLIDAY_YEAR_MISMATCH');
  must(!closed.has(date),'DUPLICATE_HOLIDAY');must(typeof row.holdy_nm==='string'&&row.holdy_nm.trim().length>0,'HOLIDAY_NAME_REQUIRED');
  closed.set(date,row.holdy_nm.trim());
 }
 const days=[];
 for(let at=parseDate(year+'0101'),end=parseDate(year+'1231');at<=end;at+=DAY){
  const date=label(at),weekday=new Date(at).getUTCDay(),weekend=weekday===0||weekday===6;
  const reasons=[...(weekend?['WEEKEND']:[]),...(closed.has(date)?[closed.get(date)]:[])],open=reasons.length===0;
  days.push({date,tradingDay:open,settlementDay:open,closureReasons:reasons,sessionTimes:null,timeStatus:'UNVERIFIED'});
 }
 return calendar(days,evidence,[year]);
}
export function joinKrxCalendars(values){
 must(Array.isArray(values)&&values.length>0&&values.length<=10,'CALENDAR_LIST_REQUIRED');
 const cs=values.map(validate).slice().sort((a,b)=>a.from.localeCompare(b.from)),days=[],evidence=[],seen=new Set();
 for(const c of cs){
  if(days.length)must(parseDate(c.from)===parseDate(days.at(-1).date)+DAY,'CALENDAR_GAP');
  days.push(...c.days);
  for(const p of c.evidence){const key=JSON.stringify(p);if(!seen.has(key)){evidence.push(p);seen.add(key);}}
 }
 return validate(calendar(days,evidence,cs.flatMap(c=>c.sourceYears)));
}
export function resolveKrxEquitySettlementDate(value,tradeDate){
 const c=validate(value),i=c.days.findIndex(d=>d.date===tradeDate);must(i>=0,'CALENDAR_COVERAGE_REQUIRED');
 must(c.days[i].tradingDay,'TRADE_DATE_CLOSED');let remaining=2;
 for(let k=i+1;k<c.days.length;k++)if(c.days[k].settlementDay&&!--remaining)return c.days[k].date;
 fail('SETTLEMENT_CALENDAR_COVERAGE_REQUIRED');
}
export function latestKrxEligibleTradeDate(value,recordDate){
 const c=validate(value),i=c.days.findIndex(d=>d.date===recordDate);must(i>=0,'CALENDAR_COVERAGE_REQUIRED');
 let settlements=0;
 for(let k=i;k>=0;k--){
  if(c.days[k].tradingDay&&settlements>=2)return c.days[k].date;
  if(c.days[k].settlementDay)settlements++;
 }
 fail('ENTITLEMENT_CALENDAR_COVERAGE_REQUIRED');
}
export function describeLsDailyMeaning(sourceId){
 must(sourceId==='t8410','DAILY_MEANING_SOURCE_UNSUPPORTED');
 return {schema:'securityapi.candle-meaning.v1',sourceId,venue:null,session:null,venueStatus:'UNVERIFIED',
 sessionStatus:'UNVERIFIED',timestampKind:'TRADING_DATE_ONLY',exactOpenAt:null,exactCloseAt:null,
 finalState:'UNKNOWN',historicalAvailableAt:null,
 turnover:{sourceField:'value',sourceUnit:null,normalizedUnit:null,status:'UNVERIFIED',policy:'PRESERVE_RAW_NO_MULTIPLIER'}};
}
