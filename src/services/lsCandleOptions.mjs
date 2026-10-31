import {BrokerError} from "../core/index.mjs";
const minuteId="marketData.domesticStock.minuteCandles";
const candleIds=new Set([minuteId,"marketData.domesticStock.dailyCandles","marketData.domesticStock.weeklyCandles","marketData.domesticStock.monthlyCandles"]);
const exchangeCodes=new Map([["krx","K"],["k","K"],["nxt","N"],["n","N"],["integrated","U"],["u","U"]]);
function exchange(value){
 if(typeof value!=="string"||!exchangeCodes.has(value.trim().toLowerCase()))throw BrokerError.validation("Unsupported candle exchange");
 return exchangeCodes.get(value.trim().toLowerCase());
}
export function candleSelection(broker,capabilityId,options={}){
 if(!candleIds.has(capabilityId))return {exchange:null};
 const hasSession=options.session!==undefined,hasExchange=options.exchange!==undefined||options.exchangeCode!==undefined;
 if(options.apiId!==undefined&&options.trCode!==undefined&&options.apiId!==options.trCode)throw BrokerError.validation("Conflicting candle API selectors",{broker});
 if(!hasSession&&!hasExchange)return {exchange:null};
 if(broker!=="ls"||capabilityId!==minuteId)throw BrokerError.unsupported("Explicit candle session/exchange selection is supported only by LS minute candles",{broker});
 if(hasSession&&!["regular","all"].includes(options.session))throw BrokerError.validation("Candle session must be regular or all",{broker});
 const left=options.exchange===undefined?null:exchange(options.exchange),right=options.exchangeCode===undefined?null:exchange(options.exchangeCode);
 if(left!==null&&right!==null&&left!==right)throw BrokerError.validation("Conflicting candle exchange selectors",{broker});
 const selected=right??left;
 if(options.session==="regular"&&selected!==null&&selected!=="K")throw BrokerError.unsupported("KRX regular-session semantics are not verified for NXT/integrated requests",{broker});
 return {exchange:selected};
}
export function lsMinuteWireOptions(sourceId,options={}){
 const selected=candleSelection("ls",minuteId,options),wire={};
 if(sourceId==="t8452")wire.exchgubun=selected.exchange??"K";
 if(options.session!==undefined)wire.krx_mmk_gubun=options.session==="regular"?"Y":"";
 return wire;
}
const timeFields=["s_time","e_time","dshmin",...["krx","nxt"].flatMap(venue=>["fm","am"].flatMap(session=>["s_time","e_time","dshmin"].map(field=>venue+"_"+session+"_"+field)))];
export function lsSessionTimes(summary={}){
 const times={};
 for(const field of timeFields){
  if(!Object.hasOwn(summary,field))continue;
  const value=summary[field];
  if(value!==null&&!["string","number"].includes(typeof value))throw BrokerError.validation("Invalid LS session metadata");
  times[field]=value===null?null:String(value).trim()||null;
 }
 return Object.keys(times).length?{sessionTimes:times}:{};
}
