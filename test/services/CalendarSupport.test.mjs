import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeKrxHolidayYear,joinKrxCalendars,resolveKrxEquitySettlementDate,latestKrxEligibleTradeDate,describeLsDailyMeaning} from '../../src/index.mjs';
const proof={url:'https://open.krx.co.kr/fixture',sha256:'a'.repeat(64),observedAt:1793760000000};
const rules={url:'https://regulation.krx.co.kr/fixture',sha256:'b'.repeat(64),observedAt:1793760000001};
function year(y,dates=[]){return normalizeKrxHolidayYear(y,{block1:dates.map(d=>({calnd_dd:d,holdy_nm:'fixture closure'}))},{holidayEvidence:proof,ruleEvidence:rules});}
const y24=()=>year(2024,['2024-01-01','2024-09-16','2024-09-17','2024-09-18','2024-12-31']);
test('leap year has explicit coverage for every civil date and no invented intraday times',()=>{const c=y24();assert.equal(c.days.length,366);assert.equal(c.days.find(d=>d.date==='20240229').tradingDay,true);assert.equal(c.days[0].tradingDay,false);assert.equal(c.days[2].sessionTimes,null);});
test('weekends and supplied exchange closures are non-trading and non-settlement dates',()=>{const c=y24();for(const date of ['20240914','20240916','20241231']){const d=c.days.find(x=>x.date===date);assert.equal(d.tradingDay,false);assert.equal(d.settlementDay,false);}});
test('T+2 crosses Chuseok without using two calendar days',()=>assert.equal(resolveKrxEquitySettlementDate(y24(),'20240912'),'20240919'));
test('record date yields last eligible settled trade date',()=>assert.equal(latestKrxEligibleTradeDate(y24(),'20240912'),'20240910'));
test('Samyang record date maps to October29 under explicitly supplied settlement calendar',()=>assert.equal(latestKrxEligibleTradeDate(year(2025,['2025-01-01']),'20251031'),'20251029'));
test('year-end closure and new-year holiday skipped across joined calendars',()=>{const c=joinKrxCalendars([y24(),year(2025,['2025-01-01'])]);assert.equal(resolveKrxEquitySettlementDate(c,'20241227'),'20250102');});
test('beyond coverage rejects instead of extrapolating weekdays',()=>assert.throws(()=>resolveKrxEquitySettlementDate(y24(),'20241230'),/COVERAGE/));
test('closed trade date rejects',()=>assert.throws(()=>resolveKrxEquitySettlementDate(y24(),'20240916'),/TRADE_DATE_CLOSED/));
test('record outside coverage rejects',()=>assert.throws(()=>latestKrxEligibleTradeDate(y24(),'20250101'),/COVERAGE/));
test('missing civil date is a gap rather than an inferred holiday',()=>{const c=y24();c.days=c.days.filter(d=>d.date!=='20240913');assert.throws(()=>resolveKrxEquitySettlementDate(c,'20240912'),/CALENDAR_GAP/);});
test('noncontiguous annual blocks reject',()=>assert.throws(()=>joinKrxCalendars([y24(),year(2026,['2026-01-01'])]),/CALENDAR_GAP/));
test('duplicate closure date rejected',()=>assert.throws(()=>year(2024,['2024-01-01','2024-01-01']),/DUPLICATE/));
test('invalid or wrong-year closure rejected',()=>{for(const d of ['2024-02-30','2025-01-01'])assert.throws(()=>year(2024,[d]));});
test('empty or malformed source is not an all-open year',()=>{for(const p of [{},{block1:[]},{block1:null}])assert.throws(()=>normalizeKrxHolidayYear(2024,p,{holidayEvidence:proof,ruleEvidence:rules}));});
test('missing/malformed evidence rejected',()=>{for(const evidence of [null,{...proof,sha256:'x'},{...proof,observedAt:null}])assert.throws(()=>normalizeKrxHolidayYear(2024,{block1:[{calnd_dd:'2024-01-01',holdy_nm:'test'}]},{holidayEvidence:evidence,ruleEvidence:rules}));});
test('current observation is not backfilled historical publication',()=>{const c=y24();assert.equal(c.historicalAvailableAt,null);assert.equal(c.pointInTimeCertified,false);assert.equal(c.observedAt,rules.observedAt);});
test('returned calendars detach mutable inputs',()=>{const p={block1:[{calnd_dd:'2024-01-01',holdy_nm:'test'}]};const c=normalizeKrxHolidayYear(2024,p,{holidayEvidence:proof,ruleEvidence:rules});p.block1[0].holdy_nm='changed';assert.equal(c.days[0].closureReasons.includes('changed'),false);});
test('LS daily turnover and venue/session remain unknown without explicit source documentation',()=>{const m=describeLsDailyMeaning('t8410');assert.equal(m.turnover.sourceUnit,null);assert.equal(m.turnover.normalizedUnit,null);assert.equal(m.venue,null);assert.equal(m.session,null);assert.equal(m.timestampKind,'TRADING_DATE_ONLY');});
test('unknown LS source cannot inherit t8410 meaning',()=>assert.throws(()=>describeLsDailyMeaning('t9999')));

test('daily normalizer adds meaning without altering legacy values or raw row',async()=>{const {normalizeDomesticStockDailyCandles}=await import('../../src/index.mjs');const row={date:'20241025',open:1984,high:1984,low:1984,close:1984,jdiff_vol:0,value:153};const r=normalizeDomesticStockDailyCandles('ls','000300','t8410',{t8410OutBlock1:[row]},{adjusted:false});assert.equal(r.meaning.turnover.sourceUnit,null);assert.equal(r.candles[0].value,153);assert.equal(r.candles[0].raw,row);assert.equal(r.priceAdjustment.requested,'N');});
