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

/** Partial exchange schedule register; never a certificate of instrument trading or vendor candle coverage. */
export function normalizeKrxRegularSessionExceptions(value,entries){
 const c=validate(value);
 must(Array.isArray(entries)&&entries.length>0&&entries.length<=500,'SESSION_EXCEPTION_LIST_REQUIRED');
 const keys=['id','date','market','open','close','reason','evidence'],seen=new Set(),out=[];
 const localAt=(date,time)=>new Date(parseDate(date)+Number(time.slice(0,2))*3600000+Number(time.slice(3))*60000-9*3600000).toISOString();
 for(const e of entries){
  must(e&&typeof e==='object'&&!Array.isArray(e)&&Object.keys(e).every(k=>keys.includes(k))&&keys.every(k=>Object.hasOwn(e,k)),'SESSION_EXCEPTION_FIELDS');
  must(typeof e.id==='string'&&/^[A-Za-z0-9_-]{1,100}$/.test(e.id),'SESSION_EXCEPTION_ID');
  const date=e.date;parseDate(date);
  must(['KOSPI','KOSDAQ','KONEX'].includes(e.market),'SESSION_MARKET_UNSUPPORTED');
  const day=c.days.find(d=>d.date===date);must(day?.tradingDay===true,'SESSION_DATE_NOT_OPEN_OR_COVERED');
  const time=s=>typeof s==='string'&&/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/.test(s);
  must(time(e.open)&&time(e.close)&&e.open<e.close,'SESSION_TIME_INVALID');
  must(typeof e.reason==='string'&&/^[A-Z][A-Z0-9_]{0,79}$/.test(e.reason),'SESSION_REASON_REQUIRED');
  must(Array.isArray(e.evidence)&&e.evidence.length>0&&e.evidence.length<=10,'SESSION_EVIDENCE_REQUIRED');
  const evidence=e.evidence.map(proof),key=date+':'+e.market;
  must(!seen.has(key),'DUPLICATE_SESSION_EXCEPTION');seen.add(key);
  out.push({id:e.id,date,market:e.market,open:e.open,close:e.close,reason:e.reason,evidence,
   venue:'KRX',timezone:'Asia/Seoul',session:'REGULAR',assetClass:'CASH_EQUITY',
   status:'DOCUMENTED_EXCEPTION_SCHEDULE',scheduledOpenAt:localAt(date,e.open),scheduledCloseAt:localAt(date,e.close),
   actualOpenAt:null,actualCloseAt:null,historicalAvailableAt:null,pointInTimeCertified:false,
   instrumentTradabilityCertified:false,providerCandleCoverageCertified:false});
 }
 out.sort((a,b)=>(a.date+':'+a.market).localeCompare(b.date+':'+b.market));
 return {schema:'securityapi.regular-session-exceptions.v1',scope:'PARTIAL_REGULAR_SESSION_EXCEPTION_REGISTER',
  calendarFrom:c.from,calendarTo:c.to,calendarEvidence:structuredClone(c.evidence),
  historicalAvailableAt:null,pointInTimeCertified:false,entries:out};
}
export function resolveKrxRegularSessionException(calendar,register,{date,market}={}){
 parseDate(date);must(['KOSPI','KOSDAQ','KONEX'].includes(market),'SESSION_MARKET_UNSUPPORTED');
 must(register?.schema==='securityapi.regular-session-exceptions.v1'&&Array.isArray(register.entries),'SESSION_EXCEPTION_REGISTER_REQUIRED');
 const keys=['id','date','market','open','close','reason','evidence'];
 const rebuilt=normalizeKrxRegularSessionExceptions(calendar,register.entries.map(e=>Object.fromEntries(keys.map(k=>[k,e[k]]))));
 const stable=v=>Array.isArray(v)?v.map(stable):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])])):v;
 must(JSON.stringify(stable(register))===JSON.stringify(stable(rebuilt)),'SESSION_EXCEPTION_ARTIFACT_CHANGED');
 const found=rebuilt.entries.find(e=>e.date===date&&e.market===market);must(found,'SESSION_EXCEPTION_UNVERIFIED');
 return structuredClone(found);
}

/** Compare daily date membership/order with a supplied KRX civil-day calendar.
 * This does not attest instrument trading, provider session/venue, units or PIT availability.
 */
export function auditKrxDailyDates(value,{startDate,endDate,dates}={}){
 const c=validate(value);
 must(Array.isArray(dates)&&dates.length<=10000,'DAILY_DATE_LIST_REQUIRED');
 const start=parseDate(startDate),end=parseDate(endDate);
 must(start<=end,'DAILY_DATE_RANGE_INVALID');
 must(start>=parseDate(c.from)&&end<=parseDate(c.to),'CALENDAR_COVERAGE_REQUIRED');
 dates.forEach(parseDate);
 const days=c.days.filter(d=>d.date>=startDate&&d.date<=endDate);
 const expectedTradingDates=days.filter(d=>d.tradingDay).map(d=>d.date);
 const expected=new Set(expectedTradingDates),within=new Map(days.map(d=>[d.date,d]));
 const counts=new Map();
 for(const date of dates)counts.set(date,(counts.get(date)??0)+1);
 const observed=new Set(dates),sorted=[...observed].sort();
 const missingDates=expectedTradingDates.filter(d=>!observed.has(d));
 const duplicateDates=sorted.filter(d=>counts.get(d)>1);
 const outOfRangeDates=sorted.filter(d=>d<startDate||d>endDate);
 const nonTradingDates=sorted.filter(d=>within.has(d)&&!expected.has(d));
 const chronological=dates.every((d,i)=>i===0||d>dates[i-1]);
 const reasons=[];
 if(!expectedTradingDates.length)reasons.push('NO_EXPECTED_TRADING_DATES');
 if(missingDates.length)reasons.push('MISSING_TRADING_DATES');
 if(duplicateDates.length)reasons.push('DUPLICATE_DATES');
 if(outOfRangeDates.length)reasons.push('OUT_OF_RANGE_DATES');
 if(nonTradingDates.length)reasons.push('NON_TRADING_DATES');
 if(!chronological)reasons.push('DATES_NOT_STRICTLY_CHRONOLOGICAL');
 return {schema:'securityapi.daily-date-coverage.v1',venue:'KRX',timezone:'Asia/Seoul',
  startDate,endDate,expectedCount:expectedTradingDates.length,observedCount:dates.length,uniqueCount:observed.size,
  expectedTradingDates,missingDates,duplicateDates,outOfRangeDates,nonTradingDates,chronological,
  dateCoverageMatched:reasons.length===0,reasons,
  scope:'DATE_MEMBERSHIP_ONLY_NOT_PROVIDER_OR_INSTRUMENT_CERTIFICATION',
  providerVenueCertified:false,providerSessionCertified:false,turnoverUnitCertified:false,
  historicalAvailabilityCertified:false,instrumentTradingStatusCertified:false};
}
