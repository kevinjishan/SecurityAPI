import test from "node:test";
import assert from "node:assert/strict";
import {normalizeDomesticStockRealtimeOrderBook as book,normalizeMarketStatusRealtimeMessage as status} from "../../src/index.mjs";
const raw=(id="H1_",body={})=>({header:{tr_cd:id,tr_key:"005930"},body:{shcode:"005930",hotime:"090001",offerho1:"70100",bidho1:"70000",offerrem1:"10",bidrem1:"20",donsigubun:"1",alloc_gubun:" ",...body}});
test("LS H1 retains raw session/time facts without certifying tradability",()=>{
 const [x]=book("ls",raw());
 assert.equal(x.venue,"KRX");assert.equal(x.market,"kospi");
 assert.deepEqual(x.sourceTime,{value:"090001",format:"HHmmss",timeZone:"Asia/Seoul",precision:"second",date:null,sequence:null});
 assert.equal(x.sessionCodes.krx,"1");assert.equal(x.allocationCode," ");assert.equal(x.instrumentTradability,null);
});
test("LS HA identifies KOSDAQ without deriving symbol market from its name",()=>{
 const [x]=book("ls",raw("HA_"));assert.equal(x.venue,"KRX");assert.equal(x.market,"kosdaq");
});
test("UH1 maps consolidated quantity fields and labels consolidated venue",()=>{
 const [x]=book("ls",raw("UH1",{unt_offerrem1:30,unt_bidrem1:50,krx_offerrem1:10,nxt_offerrem1:20,krx_bidrem1:20,nxt_bidrem1:30,unt_totofferrem:300,unt_totbidrem:500,krx_donsigubun:"1",nxt_donsigubun:"2"}));
 assert.equal(x.venue,"CONSOLIDATED");assert.equal(x.market,null);
 assert.equal(x.asks[0].quantity,30);assert.equal(x.bids[0].quantity,50);
 assert.equal(x.asks[0].quantityRaw,"30");assert.equal(x.totals.askQuantity,300);assert.equal(x.totals.bidQuantity,500);
 assert.deepEqual(x.quantityByVenue.krx.asks[0],{level:1,quantity:10,quantityRaw:"10"});
 assert.deepEqual(x.quantityByVenue.nxt.bids[0],{level:1,quantity:30,quantityRaw:"30"});
 assert.deepEqual(x.sessionCodes,{krx:"1",nxt:"2"});
});
test("UH1 never substitutes legacy quantities for missing consolidated fields",()=>{
 const [x]=book("ls",raw("UH1"));assert.equal(x.asks[0].quantity,null);assert.equal(x.bids[0].quantity,null);
 assert.equal(x.quantityByVenue.krx.asks[0].quantity,null);assert.equal(x.totals.askQuantity,null);
});
test("UH1 preserves all ten levels and zero quantities",()=>{
 const body={};for(let i=1;i<=10;i++){body["offerho"+i]=String(70000+i);body["bidho"+i]=String(69999-i);body["unt_offerrem"+i]=i===1?0:i;body["unt_bidrem"+i]=i+10;}
 const [x]=book("ls",raw("UH1",body));assert.equal(x.asks.length,10);assert.equal(x.asks[0].quantity,0);assert.equal(x.asks[9].quantity,10);assert.equal(x.bids[9].quantity,20);
});
test("missing LS source time is unknown rather than replaced by wall clock",()=>{
 const r=raw();delete r.body.hotime;const [x]=book("ls",r);assert.equal(x.sourceTime.value,null);assert.equal(x.sourceTime.date,null);assert.equal(x.sourceTime.sequence,null);
});
test("unknown auction/allocation facts remain raw and never become TRADABLE",()=>{
 const [x]=book("ls",raw("H1_",{donsigubun:"?",alloc_gubun:"?"}));assert.equal(x.sessionCodes.krx,"?");assert.equal(x.allocationCode,"?");assert.equal(x.instrumentTradability,null);
});
test("normalization does not mutate official raw frames",()=>{
 const r=raw("UH1",{unt_offerrem1:30});const before=JSON.stringify(r);book("ls",r);assert.equal(JSON.stringify(r),before);
});
test("JIF jangubun 3 identifies KRX and has no documented source clock",()=>{
 const [x]=status("ls",{header:{tr_cd:"JIF",tr_key:"0"},body:{jangubun:"3",jstatus:"21"}});
 assert.equal(x.market,"krx");assert.equal(x.sourceTime,null);assert.equal(x.time,null);
});
test("other brokers keep their own order book field mapping",()=>{
 const [x]=book("kiwoom",{trnm:"REAL",data:[{type:"0D",item:"005930",values:{"41":"+70100","61":"10","51":"-70000","71":"20"}}]});
 assert.equal(x.asks[0].price,70100);assert.equal(x.bids[0].quantity,20);assert.equal(x.sourceTime,undefined);
});
