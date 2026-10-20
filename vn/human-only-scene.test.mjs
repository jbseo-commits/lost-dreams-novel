import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {humanOnlyForBeat,humanOnlyBackgroundForBeat,HUMAN_ONLY_EXTERIOR,HUMAN_ONLY_WAITING} from './human-only-scene.js';
const sandbox={window:{}};
vm.runInNewContext(await readFile(new URL('./story-data.js',import.meta.url),'utf8'),sandbox,{timeout:20000});
const chapter=sandbox.window.STORY.chapters.find(c=>c.id==='33');
const at=needle=>chapter.beats.findIndex(b=>b.text?.includes(needle));
test('33 opening crowd and banner do not reveal text before manuscript',()=>{
 const opening=at('동부 환승센터 옆 인재홀 앞에는 줄이 이미 길게 늘어서 있었다.');
 const banner=at('HUMAN ONLY OPEN. 2차 라운드.');
 const subtitle=at('서인 방식으로 풀어 보세요.');
 assert(opening>=0&&banner>opening&&subtitle>=banner);
 assert.equal(humanOnlyBackgroundForBeat(chapter,opening),HUMAN_ONLY_EXTERIOR);
 assert.equal(humanOnlyForBeat(chapter,opening).rows.length,0);
 assert.equal(humanOnlyForBeat(chapter,banner).rows.length,1);
 assert.equal(humanOnlyForBeat(chapter,subtitle).rows.length,2);
});
test('33 inside hall score and chip appear in authored order, no preemptive 3-second reveal',()=>{
 const inside=at('대기실에는 이백 명쯤 앉아 있었다.');
 const score=at('참가자 0519 / 일치도 81% / 인간다움 가산 +7.');
 const chip=at('택배 조끼를 입은 중년 남자가 키보드에 손톱만 한 검은 칩을 붙이고 있었다.');
 const pause=at('정확히 3초.');
 assert(inside>=0&&score>inside&&chip>score&&pause>chip);
 assert.equal(humanOnlyBackgroundForBeat(chapter,inside),HUMAN_ONLY_WAITING);
 assert.equal(humanOnlyForBeat(chapter,inside).rows.length,0);
 assert.equal(humanOnlyForBeat(chapter,score).rows.length,3);
 assert.equal(humanOnlyForBeat(chapter,score).chip,false);
 assert.equal(humanOnlyForBeat(chapter,chip).chip,true);
 assert.equal(humanOnlyForBeat(chapter,chip).threeSecond,false);
 assert.equal(humanOnlyForBeat(chapter,pause).threeSecond,true);
 assert.equal(humanOnlyForBeat(chapter,pause+4).threeSecond,false);
});
test('33 return to hall waits until manuscript scores Da-eun, stops at cafe',()=>{
 const returned=at('대기실로 돌아오자 정미경이 다가왔다.');
 const score=at('일치도 72%.');
 const bonus=at('인간다움 가산 +0.');
 const cafe=at('행사장 맞은편 카페에서 백윤하가 법무 문서를 펼쳤다.');
 assert(returned>=0&&score>returned&&bonus>score&&cafe>bonus);
 assert.equal(humanOnlyForBeat(chapter,returned).rows.length,0);
 assert.deepEqual(humanOnlyForBeat(chapter,score).rows,['일치도 72%.']);
 assert.deepEqual(humanOnlyForBeat(chapter,bonus).rows,['일치도 72%.','인간다움 가산 +0.']);
 assert.equal(humanOnlyForBeat(chapter,cafe),null);
});
test('33 new art never leaks to unrelated chapters or source-less data',()=>{
 assert.equal(humanOnlyForBeat({...chapter,id:'34'},0),null);
 assert.equal(humanOnlyForBeat({id:'33',beats:[{text:'대기실에는 이백 명쯤 앉아 있었다.'}]},0),null);
});
test('33 background SVGs are local 1672x941 text-free art',async()=>{
 for(const path of [HUMAN_ONLY_EXTERIOR,HUMAN_ONLY_WAITING]){
  const text=await readFile(new URL(path,import.meta.url),'utf8');
  assert.match(text,/viewBox="0 0 1672 941"/);
  assert.match(text,/<svg[\s>]/);
  assert(!/<text[\s>]/.test(text),'visual text must use HTML layers');
 }
});
