import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../vn/',import.meta.url),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(new URL('story-data.js',root),'utf8'),ctx);
const chapters=ctx.window.STORY.chapters;
const fingerprint=text=>{let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619)>>>0;return h.toString(16);};
const end=chapters.findIndex(c=>c.id==='11');if(end<0)throw Error('11화 없음');
const selected=chapters.slice(0,end+1);
const hashes=Object.fromEntries(selected.map(c=>[c.id,fingerprint(c.beats.map(b=>b.text).join('\u001f'))]));
const specs=[
 ['3','coreCupBadge','식탁 위에는 찌그러진 컵과 회사 출입증이 나란히 놓여 있었다.',null,'컵과 출입증을 함께 남긴 선택','48% 52%'],
 ['7','coreShore','꿈속의 사람들은 다시 한 걸음 물러났다.',null,'내민 손에서 물러나는 사람들','51% 46%'],
 ['8-2','coreOverload','서인이 카펫 위로 무너지자',null,'꺼지지 않는 판단과 무너진 몸','46% 48%'],
 ['11','coreCrayon','작은 손이 그 위에 선을 하나 더 그었다.','서인은 그 방에 가 본 적이 없었다.','누구의 기억인지 알 수 없는 방','50% 45%'],
 ['10','coreMotherSleep','서인은 손을 뻗었다가 멈췄다.','광고 연결 표시를 끄지 않았다.','끄지 않은 어머니의 연결','55% 48%'],
 ['11','coreMotherDinner','대신 냉장고 문 화면을 눌러 검진을 가장 가까운 날짜로 다시 잡았다.','어머니는 냄비를 젓느라 보지 못했다.','묻지 않고 바뀐 검진 날짜','26% 46%'],
 ];
const cuts=specs.map(([id,cg,first,last,alt,mobilePosition])=>{const c=chapters.find(c=>c.id===id);const start=c.beats.findIndex(b=>b.text.includes(first));if(start<0)throw Error(first);const end=last?c.beats.findIndex((b,i)=>i>=start&&b.text.includes(last)):start;if(end<start)throw Error(last);return{chapter:id,cg,start,end,anchor:c.beats[start].text,endAnchor:c.beats[end].text,fingerprint:fingerprint(c.beats.slice(start,end+1).map(b=>b.text).join('\u001f')),alt,mobilePosition};});
const moments=selected.filter(c=>Number(c.id.split('-')[0])>=3).flatMap(c=>c.beats.filter((b,i)=>i===0||c.beats[i-1].direction?.place!==b.direction?.place).map(b=>({chapter:c.id,index:c.beats.indexOf(b),title:b.direction?.place||c.title,anchor:b.text})));
fs.writeFileSync(new URL('core-demo-data.js',root),'// 정본 원문에서 생성. 생성 명령: node tools/build-vn-core-data.mjs\nexport const CORE_SOURCE_HASHES = '+JSON.stringify(hashes,null,2)+';\nexport const CORE_CUTS = '+JSON.stringify(cuts,null,2)+';\nexport const CORE_MOMENTS = '+JSON.stringify(moments,null,2)+';\n');
console.log({sequence:selected.map(c=>c.id),cuts:cuts.map(c=>[c.chapter,c.cg,c.start,c.end]),moments:moments.length});
