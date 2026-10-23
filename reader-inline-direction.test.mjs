import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('./reader-inline-direction.js', import.meta.url), 'utf8');
const window = {};
vm.runInNewContext(source, {window, document:{querySelectorAll:()=>[],body:{classList:{contains:()=>false}},addEventListener(){},removeEventListener(){}}, innerHeight:800, MutationObserver:class {observe(){} disconnect(){}}});
const direction = window.ReaderInlineDirection;

test('all inline direction anchors point to source paragraphs in the connected eight episodes', async () => {
  assert.deepEqual([...new Set(direction.scenes.map(s=>s.ep))].sort(), ['19','19-1','20','20-1','21','21-1','22','22-1']);
  for (const {ep,anchor} of direction.scenes) {
    const key=ep.replace('-', '-');
    const md=await readFile(new URL(`./manuscript/ep0${key}.md`, import.meta.url),'utf8');
    assert.ok(md.includes(anchor), `${ep}: ${anchor}`);
  }
});

test('direction enhances the existing paragraph and adds no SVG, card, or duplicate copy', () => {
  const text='거기 진짜 끄는 데야?';
  const html=direction.decorate('20',text,`<p class="reveal">${text}</p>`,'p');
  assert.match(html,/direction-personal/);
  assert.equal((html.match(/거기 진짜 끄는 데야\?/g)||[]).length,1);
  assert.doesNotMatch(html,/<svg|<figure|id-rail|id-node/);
  const queue=direction.decorate('19','그때, 목록 맨 위로 새 줄 하나가 밀고 올라왔다.','<p class="reveal">그때, 목록 맨 위로 새 줄 하나가 밀고 올라왔다.</p>','p');
  assert.match(queue,/data-directions="queue-one"/);
  assert.equal(direction.afterParagraph('19','그때, 목록 맨 위로 새 줄 하나가 밀고 올라왔다.').length,0);
});

test('direction classes preserve source-only facts and reveal timing', () => {
  const before='예상 도착 시각을 열었다. 오전 7시 이후.';
  const html=direction.decorate('19',before,`<p class="reveal">${before}</p>`,'p');
  assert.match(html,/data-directions="delivery-system"/);
  assert.doesNotMatch(html,/07:40|06:00/);
  const promise='공동주방에 나간 안내문에는 오전 6시 전 도착이라고 버젓이 적혀 있었다.';
  assert.match(direction.decorate('19',promise,`<p class="reveal">${promise}</p>`,'p'),/direction-delivery-promise/);
  const dream=direction.decorate('21-1','엄마.','<p class="reveal">엄마.</p>','p');
  assert.match(dream,/direction-dream-to-morning/);
  assert.doesNotMatch(dream,/꿈속 주황|아침 빛|05:40|06:12/);
  const average=direction.decorate('22-1','둘째 칸 이름을 지우고 다시 썼다.','<p class="reveal">둘째 칸 이름을 지우고 다시 썼다.</p>','p');
  assert.doesNotMatch(average,/소속 조직 평균/);
});

test('count and zero snapshots style the original text without inventing outcomes', () => {
  const tenth=direction.decorate('21-1','잠시 뒤 숫자가 열이 됐다.','<p class="reveal">잠시 뒤 숫자가 열이 됐다.</p>','p');
  assert.match(tenth,/direction-rescue-10/);
  assert.doesNotMatch(tenth,/구조 10 \/ 12/);
  const zero=direction.decorate('22-1','첫 숫자가 0에서 올라가기 시작했다.','<p class="reveal">첫 숫자가 0에서 올라가기 시작했다.</p>','p');
  assert.match(zero,/direction-zero-start/);
  assert.doesNotMatch(zero,/>1</);
});

test('the original renamed alarm and phone times remain one textual instance', () => {
  const first=direction.decorate('20-1','05:40 알람 이름을 바꿨다.','<p class="reveal">05:40 알람 이름을 바꿨다.</p>','p');
  const next=direction.decorate('20-1','일어나기 / 우유','<p class="reveal"><strong>일어나기 / 우유</strong></p>','p');
  assert.match(first,/direction-alarm-rename/);
  assert.match(next,/direction-alarm-name-word/);
  assert.equal((next.match(/일어나기 \/ 우유/g)||[]).length,1);
  const time=direction.decorate('20-1','해린의 휴대폰에는 **06:00**이 남아 있었다.','<p class="reveal">해린의 휴대폰에는 <strong>06:00</strong>이 남아 있었다.</p>','p');
  assert.match(time,/direction-phone-0600/);
});
