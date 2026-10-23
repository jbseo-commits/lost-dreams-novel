import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('./reader-sequence19-22.js',import.meta.url),'utf8');
const window={matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}})};
const document={body:{classList:{contains:()=>false}},querySelectorAll:()=>[],addEventListener(){},removeEventListener(){}};
vm.runInNewContext(source,{window,document,innerHeight:800,MutationObserver:class{observe(){}disconnect(){}}});
const sequences=window.ReaderSequences;

test('every published sequence image waits for its exact prose anchor in all eight episodes',async()=>{
  assert.deepEqual([...new Set(sequences.cuts.map(c=>c.ep))].sort(),['19','19-1','20','20-1','21','21-1','22','22-1']);
  for(const cut of sequences.cuts){
    const md=await readFile(new URL(`./manuscript/ep0${cut.ep}.md`,import.meta.url),'utf8');
    assert.ok(md.includes(cut.anchor),`${cut.ep}/${cut.id}: ${cut.anchor}`);
  }
});

test('the B-only city preview appears after the 2,400-window paragraph and before A or household detail',async()=>{
  const md=await readFile(new URL('./manuscript/ep019.md',import.meta.url),'utf8');
  const b=md.indexOf('새벽 3시의 주택가. 창문 2,400개에 한꺼번에 불이 들어왔다.');
  const a=md.indexOf('A를 누르자 옆 동네에 불이 몇 개 켜졌다.');
  const life=md.indexOf('우는 아기를 안고 일어나는 그림');
  assert.ok(b>=0&&b<life&&life<a);
  const markup=sequences.afterParagraph('19','새벽 3시의 주택가. 창문 2,400개에 한꺼번에 불이 들어왔다.').join('');
  assert.match(markup,/data-cut-id="ep19-b-preview"/);
  assert.match(markup,/B 미리보기/);
  assert.doesNotMatch(markup,/36집|A 선택|A 미리보기/);
  assert.equal(sequences.afterParagraph('19','“B.”').length,0);
});

test('the doorway and wrist art form a motion pair while keeping both original images accessible',()=>{
  const text='띠 아래 오른손목에는 어제 붙잡혔던 자국이 시퍼렇게 남아 있었다. 띠를 자국 위에서 살짝 비켜 끼우자 강연우의 눈이 그 손에 머물렀다. 서인은 괜찮다는 듯 손가락을 쫙 펴 보였다.';
  const markup=sequences.afterParagraph('19',text).join('');
  assert.match(markup,/data-sequence-motion="wrist-dissolve"/);
  assert.match(markup,/ep19-door-web\.webp/);
  assert.match(markup,/ep19-wrist-detail-web\.webp/);
  assert.match(markup,/붉은 문턱 밖에 멈춘 서인/);
  assert.match(markup,/강연우의 시선이 머문 서인의 오른 손목/);
  assert.equal((markup.match(/<img\b/g)||[]).length,2);
});

test('only the visual moments that need a camera transition carry motion metadata',()=>{
  const animated=[...sequences.cuts.filter(c=>c.motion).map(c=>c.id)].sort();
  assert.equal(JSON.stringify(animated),JSON.stringify(['ep19-b-preview','ep19-door','ep19-wrist-detail']));
  for(const cut of sequences.cuts.filter(c=>!c.motion)){
    const markup=sequences.afterParagraph(cut.ep,cut.anchor).join('');
    assert.doesNotMatch(markup,/data-sequence-motion/);
  }
});
