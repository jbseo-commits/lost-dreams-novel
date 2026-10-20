// Episode 34: evidence-gated staging, for full-edition storytelling only.
// Public demo chapters and purchase gates remain owned by release.js.
export const EXTERNAL_MEETING='./assets/ep34/bg-external-conference-morning.svg';
export const REFUND_OFFICE='./assets/ep34/bg-refund-office-afternoon.svg';
const MEETING_ANCHOR='아르카디아 외부 회의실에 남자가 먼저 와 있었다.';
const REFUND_ANCHOR='휴머나이즈 랩의 환급 접수 창구는 작은 사무실 옆방이었다.';
const CONSENT='백윤하가 녹취 동의창을 열었다.';
const CONTRACT='오하준이 합의서 초안을 꺼냈다.';
const HIGHLIGHT='서인은 네 번째 줄을 두 번 읽었다.';
const REFUND_ANNOUNCEMENT='환급은 12 TOKEN입니다.';
const REFUND_DECLINE='안 받을게요.';
const CONTRACT_TERMS=[
 '1. 제품 즉시 판매 중단.',
 '2. 구매자 명단 제출.',
 '3. 현 잔액 4,300 TOKEN 구매자 환급.',
 '4. 원고 참가인은 ‘서인 방식’ 명칭 침해 청구를 취하.'
];
const clean=s=>String(s).replace(/[*]+/g,'').replace(/\s+/g,' ').trim();
const firstAt=(beats,needle)=>beats.findIndex(b=>b.text?.includes(needle));
const reached=(beats,index,needle)=>{
 const found=firstAt(beats,needle);
 return found>=0&&found<=index;
};
export function settlementForBeat(chapter,index){
 const beats=chapter?.beats;
 if(String(chapter?.id)!=='34'||!Array.isArray(beats)||!Number.isInteger(index)||index<0||index>=beats.length)return null;
 const line=Number(beats[index]?.sourceLine);
 if(!Number.isInteger(line))return null;
 if(line>=50&&line<=280&&firstAt(beats,MEETING_ANCHOR)>=0){
  const contract=reached(beats,index,CONTRACT);
  const rows=contract?CONTRACT_TERMS.filter(term=>reached(beats,index,term)).map(clean):[];
  const focus=reached(beats,index,HIGHLIGHT)&&rows.length===4?3:-1;
  const consent=reached(beats,index,CONSENT);
  return {room:'meeting',background:EXTERNAL_MEETING,rows,focus,consent,phase:focus===3?'decision':rows.length?'contract':consent?'recording':'arrival'};
 }
 if(line>=283&&line<=358&&firstAt(beats,REFUND_ANCHOR)>=0){
  const rows=[];
  if(reached(beats,index,REFUND_ANNOUNCEMENT))rows.push('환급 12 TOKEN');
  if(reached(beats,index,REFUND_DECLINE))rows.push('환급 신청 보류');
  return {room:'refund',background:REFUND_OFFICE,rows,focus:-1,consent:false,phase:rows.length>1?'declined':rows.length?'offered':'waiting'};
 }
 return null;
}
export function settlementBackgroundForBeat(chapter,index){
 return settlementForBeat(chapter,index)?.background||'';
}
const element=(tag,cls,s='')=>{
 const v=document.createElement(tag);v.className=cls;if(s)v.textContent=s;return v;
};
export class SettlementSceneStage {
 constructor(root){
  this.root=root;
  this.root.classList.add('settlement-story-stage');
  this.root.setAttribute('aria-hidden','true');
  this.room='';this.key='';
 }
 clear(){this.root.hidden=true;this.root.replaceChildren();this.room='';this.key='';}
 render(cue,{reducedMotion=false}={}){
  if(!cue){if(!this.root.hidden)this.clear();return;}
  if(this.room!==cue.room){
   this.root.replaceChildren();this.room=cue.room;this.key='';
   const panel=element('div','settlement-panel');
   panel.append(element('span','settlement-identifier',cue.room==='meeting'?'SETTLEMENT / DRAFT':'REFUND / WINDOW'));
   const header=element('span','settlement-recording','');
   const rows=element('div','settlement-terms');
   panel.append(header,rows);this.root.append(panel);
  }
  this.root.hidden=false;
  this.root.dataset.room=cue.room;this.root.dataset.phase=cue.phase;
  this.root.classList.toggle('reduced-motion',reducedMotion);
  const key=[cue.rows.join('|'),cue.focus,cue.consent].join('#');
  if(key===this.key)return;this.key=key;
  const panel=this.root.querySelector('.settlement-panel');
  panel.hidden=!cue.rows.length&&!cue.consent;
  this.root.querySelector('.settlement-recording').textContent=cue.consent?'녹취 동의 확인 절차':'';
  const container=this.root.querySelector('.settlement-terms');
  container.replaceChildren();
  cue.rows.forEach((row,index)=>{
   const item=element('span','settlement-term',row);
   item.classList.toggle('focused',index===cue.focus);
   container.append(item);
  });
 }
}
