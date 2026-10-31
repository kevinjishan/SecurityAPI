import test from 'node:test';
import assert from 'node:assert/strict';
import schema from '../src/reference/kis-domestic-master-schema.json' with {type:'json'};
import {parseKisDomesticStockMaster} from '../src/reference/KisDomesticStockMaster.mjs';
function line(m,overrides={},code='005930',name='Synthetic'){
 const fields=schema.markets[m].fields;
 const values={scrt_grp_cls_code:'ST',etp_prod_cls_code:'0',etpr_undt_objt_co_yn:'N',prst_cls_code:'0',trht_yn:'N',sltr_yn:'N',mang_issu_yn:'N',stck_lstn_date:'19900101',...overrides};
 return code.padEnd(9)+'KR7005930003'+name.padEnd(40)+fields.map(f=>(values[f.id]??'').padEnd(f.width)).join('')+'\n';
}
test('both official layouts decode identity and explicit common/preferred codes independently of name/code suffix',()=>{
 for(const m of ['kospi','kosdaq']){
  const common=parseKisDomesticStockMaster(line(m,{},'005935','Contains U'),{market:m});
  assert.equal(common.instruments[0].kind,'COMMON_STOCK');assert.equal(common.instruments[0].currentEligible,true);
  const preferred=parseKisDomesticStockMaster(line(m,{prst_cls_code:'2'},'005930','Ordinary-looking'),{market:m});
  assert.equal(preferred.instruments[0].kind,'PREFERRED_STOCK');assert.equal(preferred.instruments[0].currentEligible,false);
 }
});
test('ETF ETN SPAC and explicit halted/managed/liquidating states are separated',()=>{
 for(const [overrides,kind]of [[{scrt_grp_cls_code:'EF',etp_prod_cls_code:'2'},'ETF'],[{scrt_grp_cls_code:'EN',etp_prod_cls_code:'3'},'ETN'],[{etpr_undt_objt_co_yn:'Y'},'SPAC']]){
  const row=parseKisDomesticStockMaster(line('kospi',overrides),{market:'kospi'}).instruments[0];
  assert.equal(row.kind,kind);assert.equal(row.currentEligible,false);
 }
 for(const f of ['trht_yn','sltr_yn','mang_issu_yn']){
  const row=parseKisDomesticStockMaster(line('kosdaq',{[f]:'Y'}),{market:'kosdaq'}).instruments[0];
  assert.equal(row.currentEligible,false);assert.ok(row.exclusionReasons.length);
 }
});
test('unknown classification/blank status stays unknown and cannot become eligible',()=>{
 for(const v of [{prst_cls_code:'9'},{trht_yn:''},{scrt_grp_cls_code:'ZZ'},{etpr_undt_objt_co_yn:''}]){
  const row=parseKisDomesticStockMaster(line('kospi',v),{market:'kospi'}).instruments[0];
  assert.equal(row.currentEligible,false);
 }
});
test('truncated/duplicate/invalid input is rejected instead of shifted parsing',()=>{
 const good=line('kospi');
 for(const input of ['',good.slice(0,100),good+good,good.replace('KR7005930003','not-an-isin!!')])
  assert.throws(()=>parseKisDomesticStockMaster(input,{market:'kospi'}),/MASTER_/);
 assert.throws(()=>parseKisDomesticStockMaster(good,{market:'unknown'}),/MASTER_/);
});
test('CP949 bytes and CRLF are accepted without silently replacing invalid encoding',()=>{
 const encoded=Buffer.from(line('kospi').replace('\n','\r\n'),'ascii');
 const r=parseKisDomesticStockMaster(encoded,{market:'kospi'});assert.equal(r.instruments.length,1);
 const invalid=Buffer.from([0xff]);assert.throws(()=>parseKisDomesticStockMaster(invalid,{market:'kospi'}),/MASTER_/);
});
test('reference data does not claim historical availability or full strategy eligibility',()=>{
 const r=parseKisDomesticStockMaster(line('kospi'),{market:'kospi'});
 assert.equal(r.historicalConstituentsVerified,false);assert.equal(r.instruments[0].historicalAvailableAt,null);
 assert.ok(r.layout.officialCommit);assert.equal(r.broker,'kis');
});

test('non-ETP stock records may have a blank inapplicable ETP field without losing explicit common/preferred identity',()=>{
 const a=parseKisDomesticStockMaster(line('kospi',{etp_prod_cls_code:''}),{market:'kospi'}).instruments[0];
 const b=parseKisDomesticStockMaster(line('kosdaq',{etp_prod_cls_code:'',prst_cls_code:'1'}),{market:'kosdaq'}).instruments[0];
 assert.equal(a.kind,'COMMON_STOCK');assert.equal(a.currentEligible,true);assert.equal(b.kind,'PREFERRED_STOCK');
});
