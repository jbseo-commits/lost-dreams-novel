import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {settlementForBeat,settlementBackgroundForBeat,EXTERNAL_MEETING,REFUND_OFFICE} from './settlement-scene.js';
const ctx={window:{}};
vm.runInNewContext(await readFile(new URL('./story-data.js',import.meta.url),'utf8'),ctx,{timeout:20000});
const chapter=ctx.window.STORY.chapters.find(c=>String(c.id)==='34');
const at=(txt)=>chapter?.beats.findIndex(b=>b.text?.includes(txt))??-1;
test('34 first meeting does not leak settlement terms before they appear',()=>{
 assert(chapter,'episode 34 must be present in unfiltered STORY data');
 const intro=at('아르카디아 외부 회의실에 남자가 먼저 와 있었다.');
 const terms=at('오하준이 합의서 초안을 꺼냈다.');
 const lastTerm=at('4. 원고 참가인은 ‘서인 방식’ 명칭 침해 청구를 취하.');
 const fourth=at('서인은 네 번째 줄을 두 번 읽었다.');
 assert(intro>=0&&terms>intro&&lastTerm>terms&&fourth>lastTerm);
 assert.equal(settlementBackgroundForBeat(chapter,intro),EXTERNAL_MEETING);
 assert.equal(settlementForBeat(chapter,intro).rows.length,0);
 assert.equal(settlementForBeat(chapter,terms).rows.length,0);
 assert.equal(settlementForBeat(chapter,lastTerm).rows.length,4);
 assert.equal(settlementForBeat(chapter,lastTerm).focus,-1);
 assert.equal(settlementForBeat(chapter,fourth).focus,3);
});
test('34 refund is distinct and decline waits until woman refuses',()=>{
 const intro=at('휴머나이즈 랩의 환급 접수 창구는 작은 사무실 옆방이었다.');
 const offer=at('환급은 12 TOKEN입니다.');
 const refusal=at('안 받을게요.');
 const next=at('오하준이 보낸 구매자 응답 요약이 도착했다.');
 assert(intro>=0&&offer>intro&&refusal>offer&&next>refusal);
 assert.equal(settlementBackgroundForBeat(chapter,intro),REFUND_OFFICE);
 assert.equal(settlementForBeat(chapter,intro).rows.length,0);
 assert.deepEqual(settlementForBeat(chapter,offer).rows,['환급 12 TOKEN']);
 assert.equal(settlementForBeat(chapter,refusal).phase,'declined');
 assert.equal(settlementForBeat(chapter,next),null);
});
test('34 has no stage beyond source-bounded scenes, and no paywall override',()=>{
 assert.equal(settlementForBeat({...chapter,id:'33'},0),null);
 assert.equal(settlementForBeat({id:'34',beats:[{sourceLine:53,text:'빈 원고'}]},0),null);
 assert.equal(settlementForBeat(chapter,at('집에 들어서자 어머니가 달걀전을 뒤집고 있었다.')),null);
});
test('34 SVG prototypes are 1672x941 without burned-in text or water glass objects',async()=>{
 for(const path of [EXTERNAL_MEETING,REFUND_OFFICE]){
  const svg=await readFile(new URL(path,import.meta.url),'utf8');
  assert.match(svg,/viewBox="0 0 1672 941"/);
  assert.match(svg,/<svg[\s>]/);
  assert(!/<text[\s>]/.test(svg));
 }
 const meeting=await readFile(new URL(EXTERNAL_MEETING,import.meta.url),'utf8');
 assert(!/<(?:image|use)\b/.test(meeting),'opaque embedded art may contain unverified props');
});
