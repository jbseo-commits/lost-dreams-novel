import {CORE_SOURCE_HASHES,CORE_CUTS,CORE_MOMENTS} from './core-demo-data.js?v=teaser-art-20261021-r1';
import {withEpisodeCutscene} from './episode-cutscenes.js?v=ep03-cinematic-20261023-r1';
export {CORE_CUTS,CORE_MOMENTS};
export const CORE_DEMO_EDITION='core11';
export const CORE_DEMO_STORAGE_SUFFIX='_core11';
export function coreEditionUrl(href,{demo=false,chapter=null,offline=false}={}){
 const url=new URL(offline?href:demo?'demo.html':'index.html',href);url.search='';url.hash='';
 if(offline&&demo)url.searchParams.set('demo','core11');
 if(chapter){url.searchParams.set('chapter',chapter);url.searchParams.set('beat','0');}
 return url.href;
}
const checked=new WeakMap(),points=new WeakMap();
export function sourceHash(text){let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619)>>>0;return h.toString(16);}
export function coreChapter(chapter){
 if(!CORE_SOURCE_HASHES[chapter?.id])return false;
 if(!checked.has(chapter))checked.set(chapter,sourceHash(chapter.beats.map(b=>b.text).join('\u001f'))===CORE_SOURCE_HASHES[chapter.id]);
 return checked.get(chapter);
}
export function coreDemoStory(story){const end=story.chapters.findIndex(c=>c.id==='11');if(end<0)throw Error('데모의 마지막 화를 확인하지 못했습니다.');return {...story,edition:CORE_DEMO_EDITION,chapters:story.chapters.slice(0,end+1)};}
function point(c,text){let map=points.get(c);if(!map){map=new Map();points.set(c,map);}if(!map.has(text)){const exact=c.beats.findIndex(b=>b.text===text);map.set(text,exact>=0?exact:c.beats.findIndex(b=>b.text.includes(text)));}return map.get(text);}
const after=(c,i,text)=>{const p=point(c,text);return p>=0&&i>=p;};
const before=(c,i,text)=>{const p=point(c,text);return p<0||i<p;};
const actor=(id,asset,side,gaze='left',pose='standing',name)=>({id,asset,side,gaze,pose,name:name||({seoin:'서인',jiwoo:'지우',mother:'어머니',doyun:'도윤',hakyung:'하경',reho:'재호',mira:'미라'})[id]});
const defaultAsset={seoin:'seoinStanding',jiwoo:'jiwooRelaxed',mother:'motherCare',doyun:'coreDoyunListen',hakyung:'coreHakyung',reho:'rehoCanonical',mira:'miraCanonical'};
const ambiences={room:'nightRoom',kitchen:'room',clinic:'coreAir',hospital:'coreAir',corporate:'coreAir',meeting:'office',office:'office',train:'train',bus:'train',workshop:'coreWheel',bakery:'room',rooftop:'street',laundry:'room',city:'street',streetday:'street',park:'street',depot:'coreAir',memory:'nightRoom',dream:'coreTide',dreamsea:'coreTide'};
export function coreSceneDirection(c,i){
 if(!coreChapter(c)||Number(c.id.split('-')[0])<3||!Number.isInteger(i)||i<0||i>=c.beats.length)return null;
 const b=c.beats[i],d=b.direction||{},scene=b.scene||'room';
 let start=i;while(start>0&&c.beats[start-1].direction?.place===d.place)start--;
 const out={core:true,chapterId:c.id,index:i,sceneStart:start,title:d.place||c.title,place:d.place||'',background:scene,backgroundAsset:null,timeOfDay:'day',actors:(d.cast||[]).filter(p=>!p.remote&&defaultAsset[p.id]).map((p,n)=>actor(p.id,defaultAsset[p.id],n?'right':'left',n?'left':'right','standing',p.name)),focus:b.speaker||'',shot:d.camera==='close'?'close':'wide',ambience:ambiences[scene]||'nightRoom',music:({warm:'coreClay',tense:'corePulse',urgent:'corePulse',dream:'coreThreshold'})[d.mood]||null,fx:null,gap:0,cg:null,intro:false,blackout:false,silence:false,document:null,wallAd:false,dream:d.mood==='dream',holdMotion:false,board:null};
 if(['room','kitchen'].includes(scene))out.backgroundAsset='homeNight';
 if(c.id==='3'){
  if(i>=44&&i<108){out.music='coreClay';out.actors=[actor('seoin','seoinQuestion','left','right','seated'),actor('jiwoo',i>=70?'jiwooRelaxed':'jiwooGuarded','right','down','seated')];if(i===56)out.fx='coreClayFall';}
  if(i>=139&&i<236){out.actors=[actor('seoin',i>=209?'seoinWorry':'seoinQuestion','left','right','tense'),actor('jiwoo',i>=209?'jiwooWounded':'jiwooGuarded','right',i>=209?'down':'left','guarded')];out.music=null;}
  if(i>=224&&i<230)out.actors=[actor('seoin','seoinWorry','left','down','withdrawn')];
  if(i>=258){out.actors=[];out.ambience='nightRoom';out.music=null;}
 }
 if(c.id==='4'){
  if(i>=44&&i<244){out.music='corePulse';out.actors=[];const seen=c.beats.slice(44,i+1).map(b=>b.text).join('\n');const rows=[];if(seen.includes('손목시계를 만졌다'))rows.push(['시계','손이 되풀이해 향한 곳']);if(seen.includes('읽자마자 화면을 뒤집었다'))rows.push(['메시지','읽고 곧바로 뒤집은 화면']);if(seen.includes('창밖으로 갔다'))rows.push(['시선','끝난다는 말 뒤의 창밖']);if(rows.length)out.board={kind:'clues',title:'여기까지 본 단서',rows};if(i>=point(c,'1초.')&&i<=point(c,'7초.')){out.music=null;out.holdMotion=true;}}
  if(i>=305&&i<334){out.actors=[actor('seoin','seoinStanding','left','down','withdrawn'),actor('mother','motherCare','right','left','seated')];out.music='coreClay';}
 }
 if(c.id==='5'){
  if(i>=48&&i<343){out.actors=[actor('seoin','seoinQuestion','left','right','seated'),actor('doyun',i<125?'doyunCanonical':'coreDoyunListen','right','left','seated')];out.music=i<125?'coreClay':null;out.ambience='coreAir';}
  if(i>=370){out.actors=[actor('doyun','coreDoyunListen','center','down','withdrawn')];out.music=null;}
 }
 if(c.id==='6'){
  if(i<125)out.music='coreClay';if(i>=200&&i<250)out.music=null;
  if(i>=250)out.music=null;if(i>=326){out.music='coreClay';out.timeOfDay='night';out.actors=[actor('seoin','seoinWorry','left','down','withdrawn'),actor('doyun','coreDoyunListen','right','left','seated')];}
 }
 if(c.id==='7'){
  if(i>=48&&i<115)out.music='coreClay';if(i>=115&&i<171)out.music=null;
  if(after(c,i,'그날 밤 서인은 오랜만에 꿈을 꾸었다.')){out.actors=[];out.ambience='coreTide';out.music='coreThreshold';out.background='dreamsea';out.backgroundAsset=null;}
  if(after(c,i,'새벽 5시 03분.')){out.background='room';out.backgroundAsset='homeNight';out.ambience='nightRoom';out.music=null;out.dream=false;}
 }
 if(c.id==='8'){out.music=i<14?'coreClay':null;if(i>=14)out.ambience='coreAir';}
 if(c.id==='8-1'){out.music=null;out.ambience='coreAir';}
 if(c.id==='8-2'){
  out.music=null;out.ambience='coreAir';if(after(c,i,'세 층 아래 402호.'))out.pressure='rising';
  if(after(c,i,'〈인지 부하가 급격히 상승하고 있습니다.〉')&&before(c,i,'경고: 인지 부하 임계 초과.')){out.pressure='overload';out.ambience=null;out.music='coreThreshold';}
 }
 if(c.id==='8-3'){out.music=null;out.ambience='coreAir';out.holdMotion=true;}
 if(c.id==='9'){
  if(i<71){out.actors=[actor('doyun','coreDoyunListen','center','down','seated')];out.music=null;out.ambience='coreAir';out.shot='close';}
  if(i>=106&&i<157)out.music='coreClay';if(i>=260){out.music='coreClay';out.background='clinic';out.ambience='coreAir';}
 }
 if(c.id==='10'){
  if(i<46){out.music=null;out.ambience='coreAir';const answers=c.beats.slice(0,i+1).filter(b=>b.text==='정답.'||b.text==='오답.').map((b,n)=>[`${n+1}`,b.text]);if(answers.length)out.board={kind:'assessment',title:'평가 기록',rows:answers};}
  if(after(c,i,'서인은 클리닉으로 찾아갔다.')&&i<183){out.background='clinic';out.backgroundAsset=null;out.place='클리닉 · 시술 제안';out.ambience='coreAir';out.actors=[actor('seoin','seoinWorry','left','right','tense'),actor('doyun','coreDoyunListen','right','left','seated')];out.music=null;}
  if(i>=183&&before(c,i,'지우였다.'))out.actors=[];
  if(after(c,i,'지우는 사람들 사이로 사라졌다.')&&i<245)out.actors=[];
  if(i>=245&&i<260){out.background='kitchen';out.backgroundAsset='homeNight';out.place='잠든 어머니 곁';out.actors=[];out.ambience='nightRoom';out.music=null;out.timeOfDay='night';}
  if(i>=260){out.music=null;out.ambience='coreAir';out.timeOfDay='night';}
  if(i>=334){out.actors=[];out.music=null;out.ambience='coreAir';}
  if(i>=354){out.silence=true;out.holdMotion=true;}
 }
 if(c.id==='11'){
  out.music=null;out.ambience='coreAir';out.holdMotion=true;
  if(i<85){out.actors=[];out.background='memory';out.backgroundAsset=null;if(after(c,i,'0.21초.')&&before(c,i,'피험자 의사 확인 절차.'))out.board={kind:'latency',title:'같은 질문, 짧아진 응답',rows:[['어머니','0.63초 → 0.21초']]};if(i===69)out.fx='coreGrip';}
  if(i>=85&&i<136)out.actors=[actor('hakyung','coreHakyung','right','down','seated')];
  if(i>=136&&i<189){out.actors=[actor('doyun','coreDoyunListen','right','down','withdrawn')];out.music='coreAfter';}
  if(i>=189&&i<228){out.actors=[actor('seoin','coreSeoinAfter','left','right','still'),actor('mother','motherCare','right','left','seated')];out.background='kitchen';out.backgroundAsset='homeNight';out.ambience='pan';out.music=null;}
  if(i>=228){out.actors=[];out.background='room';out.backgroundAsset='homeNight';out.ambience='nightRoom';out.music='coreAfter';if(b.text==='0.8초.')out.gap=.8;}
 }
 let result=withEpisodeCutscene(out,c,i);
 const cut=CORE_CUTS.find(cut=>cut.chapter===c.id&&i>=cut.start&&i<=cut.end);
 if(cut){result={...result,cg:cut.cg,actors:[],board:null,shot:'insert',cutscene:{id:cut.cg,alt:cut.alt,position:cut.mobilePosition,phase:'',impact:''}};}
 return result;
}
export function isOptionalObservation(c,i){return coreChapter(c)&&Boolean(c.beats[i]?.choice)&&((c.id==='1'&&i===240)||(c.id==='5'&&i===179)||(c.id==='6'&&i===225));}
