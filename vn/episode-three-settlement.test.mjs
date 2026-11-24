import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {SETTLEMENT_SOURCE,settlementShotForBeat} from './episode-three-settlement.js';
import {coreReadingPage,corePreviousPage} from './core-reading.js';

const box={window:{}};
vm.runInNewContext(await readFile(new URL('./story-data.js',import.meta.url),'utf8'),box);
const chapter=box.window.STORY.chapters.find(c=>c.id==='3');
const start=chapter.beats.findIndex(b=>b.text===SETTLEMENT_SOURCE[0]);

test('3화 가족 정산 컷신은 정본 다섯 문장에만 연결되고 숨은 원리를 밝히지 않는다',()=>{
  assert.ok(start>0,'정본 3화에 원문 앵커가 있어야 한다');
  assert.deepEqual(chapter.beats.slice(start,start+5).map(b=>b.text),[...SETTLEMENT_SOURCE]);
  for(const [i,shot]of ['offer','discover','withdraw','question','accept'].entries()){
    assert.equal(settlementShotForBeat(chapter,start+i)?.shot,shot);
    assert.equal(settlementShotForBeat(chapter,start+i)?.start,start);
  }
  for(const i of [start-2,start-1,start+5,start+6])assert.equal(settlementShotForBeat(chapter,i),null);
  assert.equal(settlementShotForBeat({...chapter,id:'2'},start),null);
  const changed=structuredClone(chapter);
  changed.beats[start+2].text='원문이 바뀌었습니다.';
  assert.equal(settlementShotForBeat(changed,start),null,'원문 한 줄만 달라져도 비활성화');
  const restores=structuredClone(chapter);
  assert.equal(settlementShotForBeat(restores,start)?.shot,'offer');
  restores.beats[start+1].text='변경';
  assert.equal(settlementShotForBeat(restores,start),null,'기존에 검증한 객체도 변경 뒤 재검증');
});
test('다섯 행동은 각각 별도 화면으로 전환되며 기존 원문/저장 인덱스는 보존된다',()=>{
  for(let i=start;i<start+5;i++){
    const page=coreReadingPage(chapter,i);
    assert.ok(page,'3화 공개 읽기 페이지가 있어야 한다');
    assert.equal(page.start,i);
    assert.equal(page.end,i);
    assert.equal(page.entries.length,1);
    assert.equal(page.text,chapter.beats[i].text);
    if(i>start)assert.equal(corePreviousPage(chapter,i),i-1);
  }
  assert.ok(coreReadingPage(chapter,start-1).end<start);
});
test('컷신 UI는 원화 참조·동작 감소·원본 텍스트 경계를 보존한다',async()=>{
  const app=await readFile(new URL('./app.js',import.meta.url),'utf8');
  const html=await readFile(new URL('./index.html',import.meta.url),'utf8');
  const css=await readFile(new URL('./episode-three-settlement.css',import.meta.url),'utf8');
  const logic=await readFile(new URL('./episode-three-settlement.js',import.meta.url),'utf8');
  const publicBuilder=await readFile(new URL('../tools/build-vn-public.mjs',import.meta.url),'utf8');
  assert.match(app,/settlementStage\.render\(chapter,progress\.beatIndex/);
  assert.match(app,/settlementStage\.clear\(\)/);
  assert.match(html,/episode-three-settlement\.css/);
  assert.match(css,/pointer-events:none/);
  assert.match(css,/\[hidden\]\{display:none!important/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.match(logic,/assets\.jiwooGuarded/);
  assert.match(logic,/assets\.seoinWorry/);
  assert.match(publicBuilder,/if\(ids\.has\('3'\)\)for\(const asset/);
  assert.doesNotMatch(logic,/인지 연산|연산망|추가 토큰|가상의 날짜/);
});
