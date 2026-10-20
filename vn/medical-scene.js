// Episode 31–32 authored visual composition; source text remains in STORY.
// This module does not infer AI internals, medical outcomes or system secrets.
const ROOMS = Object.freeze({
 '31':{min:3,max:114,place:'의료 검증 회의실',anchor:'백윤하가 회의실 문을 닫자 벽 전체가 병원 화면으로 바뀌었다.',type:'conference'},
 '32':{min:3,max:110,place:'의료 검증 회의실',anchor:'백윤하가 회의실 화면에 숫자 세 개를 띄웠다.',type:'conference'},
});
const HOSPITAL = {min:258,max:358,place:'협력 병원 6층 대기실',anchor:'세르젠 협력 병원 6층',type:'waiting'};
const VALID_ROWS = Object.freeze({
 '31':['검증 1 / 완료.','검증 2 / 완료.','검증 3 / 완료.','검증 4 / 실행.'],
 '32':['1차 재검증 평균 대기 11분.','2차 재검증 평균 대기 38분.','독립 검증층 평균 대기 4분.']
});
const clean=s=>String(s).replace(/\*+/g,'').replace(/\s+/g,' ').trim();
const contains=(chapter,needle)=>chapter.beats?.some(beat=>beat.text?.includes(needle));
function revealed(chapter,index,needles){
 return needles.filter(needle=>{
  const first=chapter.beats.findIndex(b=>b.text?.includes(needle));
  return first>=0&&first<=index;
 }).map(clean);
}
export function medicalSceneForBeat(chapter,index){
 const beats=chapter?.beats;
 if(!Array.isArray(beats)||!Number.isInteger(index)||index<0||index>=beats.length)return null;
 const id=String(chapter.id),line=Number(beats[index]?.sourceLine);
 if(!Number.isInteger(line))return null;
 if(id==='32'&&line>=HOSPITAL.min&&line<=HOSPITAL.max&&contains(chapter,HOSPITAL.anchor)){
  const rows=revealed(chapter,index,['독립 검증 대기 예상 16분.','16분째, 대기 표시가 사라졌다. 검증 결과가 나왔다.']);
  return {type:'waiting',place:HOSPITAL.place,rows,phase:rows.length>1?'complete':rows.length===1?'pending':'empty',cast:['seoin','yoonha']};
 }
 const room=ROOMS[id];
 if(!room||line<room.min||line>room.max||!contains(chapter,room.anchor))return null;
 const rows=revealed(chapter,index,VALID_ROWS[id]);
 return {type:'conference',place:room.place,rows,
  phase: id==='31' && rows.length===4?'running':rows.length>0?'showing':'empty',
  cast:['seoin','yoonha']};
}

function element(tag,className,text='') {
 const el=document.createElement(tag);el.className=className;
 if(text)el.textContent=text;
 return el;
}
export class MedicalSceneStage {
 constructor(root,assets){
  this.root=root;
  this.assets=assets;
  this.scene='';
  this.lastRows='';
  this.root.classList.add('medical-story-stage');
  this.root.setAttribute('aria-hidden','true');
 }
 clear(){
  this.scene='';this.lastRows='';
  this.root.hidden=true;this.root.replaceChildren();
 }
 render(cue,{reducedMotion=false}={}){
  if(!cue){if(!this.root.hidden)this.clear();return;}
  const changed=this.scene!==cue.type;
  if(changed){
   this.root.replaceChildren();
   this.scene=cue.type;this.lastRows='';
   this.root.dataset.room=cue.type;
   const people=element('div','medical-stage-people');
   for(const id of cue.cast){
    if(!this.assets?.[id])continue;
    const actor=element('div','medical-stage-actor '+id);
    const img=document.createElement('img');
    img.src=this.assets[id];img.alt='';img.loading='eager';img.decoding='async';
    actor.append(img);people.append(actor);
   }
   const display=element('div','medical-stage-display');
   const aura=element('div','medical-stage-aura');
   const overline=element('div','medical-stage-overline',cue.type==='waiting'?'HOSPITAL / WAITING':'MEDICAL VERIFICATION');
   const rows=element('div','medical-stage-rows');
   display.append(aura,overline,rows);
   this.root.append(people,display);
  }
  this.root.hidden=false;this.root.dataset.phase=cue.phase;
  this.root.classList.toggle('reduced-motion',reducedMotion);
  const key=cue.rows.join('|');
  if(key===this.lastRows)return;
  this.lastRows=key;
  const target=this.root.querySelector('.medical-stage-rows');
  target.replaceChildren();
  for(const [i,entry] of cue.rows.entries()){
   const row=element('div','medical-stage-row');
   const index=element('span','medical-stage-index',String(i+1).padStart(2,'0'));
   const label=element('span','medical-stage-label',entry);
   row.append(index,label);target.append(row);
  }
 }
}
