import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('./reader-sequence19-22.js',import.meta.url),'utf8');
const window={};
vm.runInNewContext(source,{window});
const sequences=window.ReaderSequences;

test('the original eighteen web illustrations remain static and follow source anchors',async()=>{
  assert.equal(sequences.cuts.length,18);
  assert.deepEqual([...new Set(sequences.cuts.map(c=>c.ep))].sort(),['19','19-1','20','20-1','21','21-1','22','22-1']);
  for(const cut of sequences.cuts){
    const md=await readFile(new URL(`./manuscript/ep0${cut.ep}.md`,import.meta.url),'utf8');
    assert.ok(md.includes(cut.anchor),`${cut.ep}/${cut.id}: ${cut.anchor}`);
    const markup=sequences.afterParagraph(cut.ep,cut.anchor).join('');
    assert.match(markup,new RegExp(`data-cut-id="${cut.id}"`));
    assert.doesNotMatch(markup,/data-sequence-motion/);
  }
});

test('B neighborhood is not inserted in web prose, and its old A/detail cuts stay separate',()=>{
  const web=sequences.afterParagraph('19','새벽 3시의 주택가. 창문 2,400개에 한꺼번에 불이 들어왔다.').join('');
  assert.equal(web,'');
  const a=sequences.afterParagraph('19','A를 누르자 옆 동네에 불이 몇 개 켜졌다. 서른여섯 집. 그것도 운이 나쁠 때 얘기였다.').join('');
  const life=sequences.afterParagraph('19','우는 아기를 안고 일어나는 그림, 다시 잠들지 못해 부엌으로 나가는 그림, 출근 알람을 세 시간 앞당겨 맞추는 그림. 창마다 작은 그림이 흘러갔다. 예측 화면일 뿐인데 불빛만은 진짜 같았다.').join('');
  assert.match(a,/ep19-windows-web\.webp/);assert.match(life,/ep19-home-life-web\.webp/);
  assert.doesNotMatch(a,/ep19-b-preview/);
});

test('the web renders both door and wrist source images as static illustrations',()=>{
  const text='띠 아래 오른손목에는 어제 붙잡혔던 자국이 시퍼렇게 남아 있었다. 띠를 자국 위에서 살짝 비켜 끼우자 강연우의 눈이 그 손에 머물렀다. 서인은 괜찮다는 듯 손가락을 쫙 펴 보였다.';
  const markup=sequences.afterParagraph('19',text).join('');
  assert.match(markup,/ep19-door-web\.webp/);assert.match(markup,/ep19-wrist-detail-web\.webp/);
  assert.equal((markup.match(/<img\b/g)||[]).length,2);assert.doesNotMatch(markup,/data-sequence-motion/);
});
