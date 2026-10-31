import test from 'node:test';import assert from 'node:assert/strict';
import {LsClient} from '../src/adapters/LsClient.mjs';
const NOW=1800000000000;
const token=()=>({accessToken:'synthetic-authority-token',tokenType:'Bearer',expiresAt:NOW+3600000});
function setup({authority={async getAccessToken(){return token()}},code='00000'}={}){
 const calls=[];const fetch=async(url,init)=>{calls.push({url,headers:new Headers(init.headers),body:init.body});return new Response(JSON.stringify({rsp_cd:code,t8410OutBlock:{shcode:'0053F0',rec_count:0},t8410OutBlock1:[]}))};
 const client=new LsClient({tokenAuthority:authority,env:'prod',now:()=>NOW,fetch});return {client,calls,authority};
}
test('delegated token authority builds a credential-free client and sends only the requested market HTTP',async()=>{
 let count=0;const f=setup({authority:{async getAccessToken(c){count++;assert.deepEqual(c,{broker:'ls',env:'prod'});return token()}}});
 const r=await f.client.request('t8410',{t8410InBlock:{shcode:'0053F0'}});assert.equal(r.ok,true);assert.equal(count,1);assert.equal(f.calls.length,1);assert.match(f.calls[0].url,/\/stock\/chart$/);assert.equal(f.calls[0].headers.get('authorization'),'Bearer synthetic-authority-token');
});
test('authority method receiver is preserved and token values are projected without raw provider metadata',async()=>{
 const authority={value:'synthetic-authority-token',async getAccessToken(){return {...token(),accessToken:this.value,raw:{private:'omit'}}}};
 const f=setup({authority}),t=await f.client.getAccessToken();assert.deepEqual(t,token());assert.equal(Object.hasOwn(t,'raw'),false);assert.equal(f.client.tokenStore.get(f.client.tokenStoreKey()),null);
});
test('forced refresh, clear, revoke and raw OAuth endpoints never bypass the external authority',async()=>{
 let count=0;const f=setup({authority:{async getAccessToken(){count++;return token()}}});
 await assert.rejects(f.client.getAccessToken(true));assert.throws(()=>f.client.clearToken());await assert.rejects(f.client.revokeToken());
 for(const id of ['token','revoke',' token ']){const r=await f.client.request(id,{});assert.equal(r.ok,false);assert.equal(r.error.code,'UNSUPPORTED_CAPABILITY')}
 assert.equal(f.calls.length,0);assert.equal(count,0);
});
test('invalid-token market responses are returned once without clear, OAuth, authority refresh or replay',async()=>{
 for(const code of ['IGW00121','IGW00123','IGW00125']){
  let count=0;const f=setup({code,authority:{async getAccessToken(){count++;return token()}}});
  const r=await f.client.request('t8410',{});assert.equal(r.ok,false);assert.equal(f.calls.length,1);assert.equal(count,1);
 }
});
test('invalid, expired or near-expiry authority tokens stop before market transport',async()=>{
 for(const value of [null,{}, {...token(),accessToken:''},{...token(),accessToken:'bad\r\nvalue'},{...token(),tokenType:'Basic'},{...token(),expiresAt:NOW},{...token(),expiresAt:NOW+60000},{...token(),expiresAt:Infinity}]){
  const f=setup({authority:{async getAccessToken(){return value}}}),r=await f.client.request('t8410',{});assert.equal(r.ok,false);assert.equal(r.error.code,'AUTH_ERROR');assert.equal(f.calls.length,0);
 }
});
test('private authority failure text and cause are not exported',async()=>{
 const f=setup({authority:{async getAccessToken(){throw Error('synthetic-private-secret')}}}),r=await f.client.request('t8410',{});
 assert.equal(r.ok,false);assert.equal(r.error.code,'AUTH_ERROR');assert.equal(JSON.stringify(r).includes('synthetic-private-secret'),false);assert.equal(f.calls.length,0);
});
test('an invalid or ambiguous authority configuration fails rather than falling back to credentials',()=>{
 for(const tokenAuthority of [null,{},false,{getAccessToken:1}])assert.throws(()=>new LsClient({tokenAuthority,appKey:'synthetic',appSecretKey:'synthetic'}));
 assert.throws(()=>new LsClient({tokenAuthority:{getAccessToken(){}},appKey:'synthetic',appSecretKey:'synthetic'}));
});
test('legacy credential constructor and legacy cached-token requests remain compatible',async()=>{
 let calls=0;const c=new LsClient({appKey:'synthetic-key',appSecretKey:'synthetic-secret',now:()=>NOW,fetch:async()=>{calls++;return new Response(JSON.stringify({rsp_cd:'00000'}))}});
 c.tokenStore.set(c.tokenStoreKey(),token());const r=await c.request('t8410',{});assert.equal(r.ok,true);assert.equal(calls,1);
});
