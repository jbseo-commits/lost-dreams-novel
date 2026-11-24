import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('./reader-info-graphics.js',import.meta.url),'utf8');
const window={};const document={body:{classList:{contains:()=>false}},querySelectorAll:()=>[],addEventListener(){},removeEventListener(){}};
vm.runInNewContext(source,{window,document,matchMedia:()=>({matches:false})});
const graphics=window.ReaderInfoGraphics;
test('information graphics only appear after exact source facts across all eight episodes',async()=>{
  assert.equal(new Set(graphics.cues.map(c=>c.ep)).size,8);
  for(const cue of graphics.cues){const md=await readFile(new URL(`./manuscript/ep0${cue.ep}.md`,import.meta.url),'utf8');assert.ok(md.replaceAll('**','').includes(cue.anchor),`${cue.ep}: ${cue.anchor}`);}
});
test('episode 19 does not reveal the later actual arrival or system route',()=>{
 const early=graphics.afterParagraph('19','공동주방에 나간 안내문에는 오전 6시 전 도착이라고 버젓이 적혀 있었다.').join('');
 assert.match(early,/06:00 전/);assert.match(early,/07:00/);assert.doesNotMatch(early,/05:18|07:40/);
 const choice=graphics.afterParagraph('19','A를 누르자 옆 동네에 불이 몇 개 켜졌다. 서른여섯 집. 그것도 운이 나쁠 때 얘기였다.').join('');assert.match(choice,/2,400집이 한꺼번에 깸/);assert.match(choice,/36집 · 운이 나쁠 때/);
});
test('later graphics preserve the source order for delivery, rescue, and compute facts',()=>{
 const p=(ep,text)=>graphics.afterParagraph(ep,text).join('');
 assert.match(p('19-1','5시 31분. 서인이 식품 담당자 대신 공동주방에 전화를 걸었다.'),/17:31/);
 assert.match(p('19-1','05:18 도착. 07:00 전원 출차.'),/07:40/);
 assert.equal(p('21-1','구조 5 / 12.'),'');
 assert.match(p('22','목록 맨 윗줄에서 82%가 83%로 넘어가고 있었다.'),/83%/);
 assert.match(p('22','그 넷은 오늘 밤 받지 말아 주세요. 지금 돌고 있는 열한 건은 끝까지 가고, 하나 끝날 때마다 그 연산은 바로 회사로 돌려보내 달라고 요청하겠습니다.'),/공공 검증 중단/);
 assert.match(p('22','넷까지 받았다면 아이 결과는 2시 반을 넘겼을 것이다. 한 건씩 돌아오는 연산으로는 딸의 네 번째 완료 예상을 당길 수 없었다. 다만 2시 09분에서 더 밀리지도 않았다.'),/02:30 이후/);
 assert.match(p('21-1','사이로 송출탑의 버팀대가 비스듬히 걸려 있었다. 끝이 흔들렸다.'),/버팀대/);
});
test('bold source emphasis does not break the actual 20-1 alarm cue',async()=>{
 const html=graphics.afterParagraph('20-1','해린의 휴대폰에는 **06:00**이 남아 있었다.').join('');
 assert.match(html,/data-info-kind="alarms"/);
 assert.match(html,/06:00 · 추가 검증 완료 예정/);
 const css=await readFile(new URL('./reader-info-graphics.css',import.meta.url),'utf8');
 assert.match(css,/\.reader-info-graphic\.seen:not\(\.id-still\) \.info-row/);
});
test('episode 19 practice map and A/B cards follow their source lines without later numbers',async()=>{
 const map=graphics.afterParagraph('19','진짜 동네를 그대로 베껴 만든 연습 지도. 새벽 3시의 주택가였다. 집집마다 꿈이 흘러드는 가는 선이 지도 위에 깔려 있는데, 한 구역에서 그 선이 붉게 번져 가고 있었다. 이대로 두면 그 동네 꿈이 죄다 엉킨다.').join('');
 assert.match(map,/data-info-kind="dotmap"/);assert.match(map,/class="is-red"/);
 const cards=graphics.afterParagraph('19','“전부 한 번 끊었다가 다시 붙입니다. 확실히 고쳐집니다. 대신 끊는 순간 연결된 집은 전부 깹니다.”').join('');
 assert.match(cards,/data-choice="A"[\s\S]*data-choice="B"/);
 for(const html of [map,cards])assert.doesNotMatch(html.replace(/<[^>]*>/g,' '),/2,400|36|3\.8|18분/);
 assert.equal(graphics.afterParagraph('19','“A. 이 구역 꿈을 옆 동네 기계로 넘깁니다.”').length,0);
 const css=await readFile(new URL('./reader-info-graphics.css',import.meta.url),'utf8');
 assert.match(css,/\.reader-info-graphic\.id-still \.info-choice/);assert.match(css,/@property --info-sweep/);
});
test('episode 19 morning axis shows promise, pickup, departure and late arrival without later facts',()=>{
 const html=graphics.afterParagraph('19','차가 다 떠난 뒤에야 물건이 온다. 그런데 공동주방에 나간 안내문에는 오전 6시 전 도착이라고 버젓이 적혀 있었다.').join('');
 assert.match(html,/data-info-kind="morning"/);
 const text=html.replace(/<[^>]*>/g,' ');
 for(const fact of ['06:00 전','06:30','07:00','7시 이후'])assert.ok(text.includes(fact),fact);
 assert.doesNotMatch(text,/05:18|07:40|예비/);
});
