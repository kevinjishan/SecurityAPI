import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeLsCandleAdjustment,validateCorporateActionTerms} from '../../src/services/corporateActionSupport.mjs';
import {normalizeDomesticStockDailyCandles,MarketDataService} from '../../src/services/MarketDataService.mjs';
const proof={url:'https://kind.krx.co.kr/fixture',sha256:'a'.repeat(64),observedAt:100};
const terms=()=>({schema:'securityapi.corporate-action.v1',id:'fixture',symbol:'000001',kind:'CONSOLIDATION',effectiveAt:20,entitlementAt:10,observedAt:100,eligibility:'ORDINARY_EXTERNAL',evidence:[{...proof}],outputs:[{symbol:'000001',numerator:'1',denominator:'2',deliveryAt:30}],cash:[],blockers:[]});
test('LS flags preserve zero, large unsigned code and rate text without deriving quantity',()=>{
 assert.deepEqual(normalizeLsCandleAdjustment({jongchk:1075839632,rate:'723.24',pricechk:0}),{schema:'securityapi.candle-adjustment.v1',provider:'ls',code:'1075839632',rateRaw:'723.24',priceCheck:'0',quantityRatio:null,interpretation:'OPAQUE_PROVIDER_FIELDS'});
 assert.equal(normalizeLsCandleAdjustment({jongchk:0,rate:'0.00'}).code,'0');
 assert.equal(normalizeLsCandleAdjustment({}).rateRaw,null);
 assert.throws(()=>normalizeLsCandleAdjustment({rate:{}}));
});
test('daily LS normalization exposes flags and explicit requested basis, leaving OHLC/raw unchanged',()=>{
 const row={date:'20241025',open:1984,high:1984,low:1984,close:1984,jdiff_vol:0,jongchk:1075839632,rate:'723.24',pricechk:0};
 const n=normalizeDomesticStockDailyCandles('ls','000300','t8410',{t8410OutBlock1:[row]}, {adjusted:false});
 assert.equal(n.priceAdjustment.requested,'N');assert.equal(n.priceAdjustment.verified,false);
 assert.equal(n.candles[0].adjustment.rateRaw,'723.24');assert.equal(n.candles[0].close,1984);assert.equal(n.candles[0].raw,row);
 assert.equal(normalizeDomesticStockDailyCandles('ls','000300','t8410',{t8410OutBlock1:[row]}).priceAdjustment.requested,'UNKNOWN');
});
test('terms use exact rational strings and compute completeness rather than trusting status',()=>{
 const e=validateCorporateActionTerms(terms());assert.equal(e.status,'TERMS_COMPLETE');assert.equal(e.performanceCertified,false);
 const p=terms();p.entitlementAt=null;p.status='TERMS_COMPLETE';assert.equal(validateCorporateActionTerms(p).status,'PARTIAL');
});
test('reject malformed rationals, floats, invalid symbols, dates and proof hashes',()=>{
 for(const mutate of [e=>e.outputs[0].denominator='0',e=>e.outputs[0].numerator=0.5,e=>e.outputs[0].symbol='oops',e=>e.effectiveAt=-1,e=>e.evidence[0].sha256='x',e=>e.outputs[0].deliveryAt=19,e=>e.eligibility='VERIFIED_BY_USER']){
  const e=terms();mutate(e);assert.throws(()=>validateCorporateActionTerms(e));
 }
});
test('missing evidence, unsupported event or explicit missing terms remain partial',()=>{
 for(const mutate of [e=>e.evidence=[],e=>e.kind='UNKNOWN',e=>e.blockers=['CASH_IN_LIEU_TERMS_UNKNOWN']]){
  const e=terms();mutate(e);assert.equal(validateCorporateActionTerms(e).status,'PARTIAL');
 }
});
test('contract result detaches mutable caller data and preserves unknown cash payment',()=>{
 const e=terms();e.cash=[{currency:'KRW',numerator:'25',denominator:'1',payAt:null}];
 const c=validateCorporateActionTerms(e);e.outputs[0].numerator='99';
 assert.equal(c.outputs[0].numerator,'1');assert.equal(c.cash[0].payAt,null);
});
