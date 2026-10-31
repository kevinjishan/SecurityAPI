import assert from "node:assert/strict";
import test from "node:test";
import {MarketDataService,normalizeDomesticStockMinuteCandles} from "../../src/index.mjs";

function setup(broker="ls"){
 const calls=[];
 const client={request:async(id,params,options)=>{
  calls.push({id,params,options});
  return {ok:true,data:{[id+"OutBlock"]:{shcode:"005930",s_time:"090000",e_time:"153000",krx_am_s_time:"160000",krx_am_e_time:"200000",krx_am_dshmin:"00",nxt_am_s_time:"154000",nxt_am_e_time:"200000",cts_date:"20261030",cts_time:"151800"},[id+"OutBlock1"]:[{date:"20261030",time:"151900",open:100,high:102,low:99,close:101,jdiff_vol:10,value:1}]},continuation:{hasNext:true,key:"0"}};
 }};
 return {calls,service:new MarketDataService({[broker]:client})};
}
test("LS omitted new options preserve legacy t8412 request defaults",async()=>{
 const {service,calls}=setup();const r=await service.getDomesticStockMinuteCandles("ls","005930",{count:5,endDate:"20261030"});
 assert.equal(r.ok,true);assert.equal(calls[0].id,"t8412");
 assert.equal(Object.hasOwn(calls[0].params.t8412InBlock,"krx_mmk_gubun"),false);
 assert.equal(Object.hasOwn(calls[0].params.t8412InBlock,"exchgubun"),false);
 assert.equal(r.data.source.requestedSession,undefined);
});
for(const [session,wire] of [["regular","Y"],["all",""]]){
 test("LS explicit session "+session+" reaches actual request",async()=>{
  const {service,calls}=setup();const r=await service.getDomesticStockCandles("ls","005930",{interval:"1m",session});
  assert.equal(r.ok,true);assert.equal(calls[0].params.t8412InBlock.krx_mmk_gubun,wire);
  assert.equal(r.data.source.requestedSession,session);
 });
}
for(const [exchange,wire] of [["krx","K"],["nxt","N"],["integrated","U"],["K","K"],["N","N"],["U","U"]]){
 test("LS explicit exchange "+exchange+" selects t8452 and preserves rows",async()=>{
  const {service,calls}=setup();const r=await service.getDomesticStockMinuteCandles("ls","005930",{exchange,session:"all"});
  assert.equal(r.ok,true);assert.equal(calls[0].id,"t8452");assert.equal(calls[0].params.t8452InBlock.exchgubun,wire);
  assert.equal(r.data.candles.length,1);assert.equal(r.data.candles[0].timestamp,"20261030151900");
  assert.equal(r.data.source.requestedExchange,wire);
 });
}
test("LS explicit t8452 works and retains requestOptions/continuation without mutating input",async()=>{
 const {service,calls}=setup(),options={trCode:"t8452",exchangeCode:"K",session:"regular",ctsDate:"20261030",ctsTime:"151800",requestOptions:{retryable:false,continuation:{nextKey:"0",continueFlag:"Y"}}},before=JSON.stringify(options);
 const r=await service.getDomesticStockMinuteCandles("ls","005930",options);
 assert.equal(r.ok,true);assert.equal(calls[0].params.t8452InBlock.krx_mmk_gubun,"Y");
 assert.equal(calls[0].params.t8452InBlock.cts_time,"151800");
 assert.deepEqual(calls[0].options,options.requestOptions);assert.equal(JSON.stringify(options),before);
 assert.equal(r.data.summary.nextTime,"151800");
});
test("invalid/unsupported/conflicting selectors fail before any client call",async()=>{
 const cases=[{session:"pre"},{session:null},{session:1},{exchange:"typo"},{exchange:null},{exchange:1},{exchange:"krx",exchangeCode:"N"},{apiId:"t8412",trCode:"t8452",session:"regular"},{trCode:"t8412",exchange:"krx"},{exchange:"nxt",session:"regular"},{exchange:"integrated",session:"regular"}];
 for(const options of cases){
  const {service,calls}=setup();const r=await service.getDomesticStockMinuteCandles("ls","005930",options);
  assert.equal(r.ok,false,JSON.stringify(options));assert.ok(["VALIDATION_ERROR","UNSUPPORTED_CAPABILITY"].includes(r.error.code));
  assert.equal(calls.length,0,JSON.stringify(options));
 }
});
test("new LS candle selectors are not silently ignored by other brokers or period candles",async()=>{
 for(const broker of ["kiwoom","db","kis"]){
  const {service,calls}=setup(broker);const r=await service.getDomesticStockMinuteCandles(broker,"005930",{session:"regular"});
  assert.equal(r.ok,false);assert.equal(r.error.code,"UNSUPPORTED_CAPABILITY");assert.equal(calls.length,0);
 }
 for(const method of ["getDomesticStockDailyCandles","getDomesticStockWeeklyCandles","getDomesticStockMonthlyCandles"]){
  const {service,calls}=setup();const r=await service[method]("ls","005930",{session:"regular"});
  assert.equal(r.ok,false);assert.equal(calls.length,0);
 }
});
test("both KRX and NXT session metadata survive normalization without venue attestation",()=>{
 const payload={t8452OutBlock:{shcode:"005930",s_time:"090000",e_time:"153000",krx_fm_s_time:"080000",krx_fm_e_time:"085000",krx_am_s_time:"160000",krx_am_e_time:"200000",nxt_am_s_time:"154000",nxt_am_e_time:"200000"},t8452OutBlock1:[{date:"20261030",time:"200000",close:101}]};
 const r=normalizeDomesticStockMinuteCandles("ls","005930","t8452",payload);
 assert.equal(r.candles.length,1);assert.equal(r.summary.sessionTimes.krx_am_e_time,"200000");
 assert.equal(r.summary.sessionTimes.nxt_am_s_time,"154000");assert.equal(r.summary.sessionTimes.s_time,"090000");
 assert.equal(r.source.venueVerified,undefined);assert.equal(r.candles[0].timestamp,"20261030200000");
});

test("common service uses real LsClient metadata/HTTP and sends regular-session selector unchanged",async()=>{
 const {LsClient}=await import("../../src/index.mjs"),calls=[];
 const client=new LsClient({appKey:"synthetic-test",appSecretKey:"synthetic-test",fetch:async(url,init)=>{
  calls.push({url,init});
  return new Response(JSON.stringify({rsp_cd:"00000",t8452OutBlock:{shcode:"005930",krx_am_s_time:"160000",krx_am_e_time:"200000",cts_date:"20261030",cts_time:"151800"},t8452OutBlock1:[{date:"20261030",time:"151900",open:100,high:101,low:99,close:100,jdiff_vol:1,value:0}]}),{headers:{"content-type":"application/json","tr_cont":"Y","tr_cont_key":"0"}});
 }});
 client.getAccessToken=async()=>({accessToken:"synthetic-test-token",tokenType:"Bearer",expiresAt:Date.now()+3600000});
 const r=await new MarketDataService({ls:client}).getDomesticStockMinuteCandles("ls","005930",{exchange:"krx",session:"regular",endDate:"20261030",ctsDate:"20261030",ctsTime:"151800",requestOptions:{retryable:false,continuation:{nextKey:"0",continueFlag:"Y"}}});
 assert.equal(r.ok,true);assert.equal(calls.length,1);
 assert.equal(calls[0].url,"https://openapi.ls-sec.co.kr:8080/stock/chart");
 const wire=JSON.parse(calls[0].init.body).t8452InBlock;
 assert.equal(wire.exchgubun,"K");assert.equal(wire.krx_mmk_gubun,"Y");assert.equal(wire.cts_time,"151800");
 const headers=new Headers(calls[0].init.headers);assert.equal(headers.get("tr_cd"),"t8452");assert.equal(headers.get("tr_cont_key"),"0");
 assert.equal(r.data.summary.sessionTimes.krx_am_e_time,"200000");
 assert.equal(r.continuation.hasNext,true);assert.equal(r.data.source.requestedSession,"regular");
});
test("malformed session metadata fails rather than being stringified into evidence",async()=>{
 const {lsSessionTimes}=await import("../../src/services/lsCandleOptions.mjs");
 assert.throws(()=>lsSessionTimes({krx_am_e_time:{invalid:1}}));
 assert.deepEqual(lsSessionTimes({}),{});
});
