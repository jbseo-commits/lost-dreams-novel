// Episode 33: Human Only contest. Scene changes and text are manuscript-gated.
// The original STORY beats remain the single source of truth; no authored spoilers.
export const HUMAN_ONLY_EXTERIOR = './assets/ep33/bg-human-only-exterior.svg';
export const HUMAN_ONLY_WAITING = './assets/ep33/bg-human-only-waiting.svg';
const OPENING = '동부 환승센터 옆 인재홀 앞에는 줄이 이미 길게 늘어서 있었다.';
const WAITING = '대기실에는 이백 명쯤 앉아 있었다.';
const RETURN = '대기실로 돌아오자 정미경이 다가왔다.';
const OUTSIDE = ['HUMAN ONLY OPEN. 2차 라운드.','서인 방식으로 풀어 보세요.'];
const HIGHLIGHTS = ['성인 공개 동의자 하이라이트 생중계.','참가자 0512 / 일치도 78% / 인간다움 가산 +6.','참가자 0519 / 일치도 81% / 인간다움 가산 +7.'];
const RESULTS = ['일치도 72%.','인간다움 가산 +0.'];
const CHIP = '택배 조끼를 입은 중년 남자가 키보드에 손톱만 한 검은 칩을 붙이고 있었다.';
const clean = value => String(value).replace(/[*]+/g,'').replace(/\s+/g,' ').trim();
const indexOf = (beats,needle) => beats.findIndex(beat=>beat.text?.includes(needle));
const revealed = (beats,index,needles) => needles.filter(needle=>{const first=indexOf(beats,needle);return first>=0&&index>=first;}).map(clean);

export function humanOnlyForBeat(chapter,index) {
 if(String(chapter?.id)!=='33'||!Array.isArray(chapter.beats)||!Number.isInteger(index)||index<0||index>=chapter.beats.length)return null;
 const beats=chapter.beats,line=Number(beats[index].sourceLine);
 if(!Number.isInteger(line))return null;
 if(line>=3&&line<=54&&indexOf(beats,OPENING)>=0){
  return {room:'exterior',background:HUMAN_ONLY_EXTERIOR,rows:revealed(beats,index,OUTSIDE),
   phase:'queue',chip:false,threeSecond:false};
 }
 const inFirst=line>=56&&line<=141&&indexOf(beats,WAITING)>=0;
 const inReturn=line>=278&&line<=409&&indexOf(beats,RETURN)>=0;
 if(!inFirst&&!inReturn)return null;
 const rows=inFirst?revealed(beats,index,HIGHLIGHTS):revealed(beats,index,RESULTS);
 const chip=indexOf(beats,CHIP)>=0&&index>=indexOf(beats,CHIP)&&inFirst;
 const pause=indexOf(beats,'정확히 3초.');
 const threeSecond=inFirst&&pause>=0&&index>=pause&&index<=pause+3;
 return {room:'waiting',background:HUMAN_ONLY_WAITING,rows,
   phase:inReturn?'return':'contest',chip,threeSecond};
}
export function humanOnlyBackgroundForBeat(chapter,index){
 return humanOnlyForBeat(chapter,index)?.background??'';
}

function make(tag,className,label=''){
 const el=document.createElement(tag);el.className=className;
 if(label)el.textContent=label;
 return el;
}
export class HumanOnlyStage {
 constructor(root){
  this.root=root;this.root.classList.add('human-only-stage');
  this.root.setAttribute('aria-hidden','true');
  this.room='';this.lastKey='';
 }
 clear(){
  this.room='';this.lastKey='';this.root.hidden=true;
  this.root.replaceChildren();
 }
 render(cue,{reducedMotion=false}={}){
  if(!cue){if(!this.root.hidden)this.clear();return;}
  if(this.room!==cue.room){
   this.root.replaceChildren();this.room=cue.room;this.lastKey='';
   const plaque=make('div','human-only-plaque');
   const kicker=make('span','human-only-kicker',cue.room==='exterior'?'동부 환승센터 인재홀':'현장 중계');
   const rows=make('div','human-only-rows');
   plaque.append(kicker,rows);
   const clock=make('div','human-only-stop');
   const chip=make('div','human-only-chip');
   const chipCore=make('span','human-only-chip-core');
   chip.append(chipCore);
   this.root.append(plaque,clock,chip);
  }
  this.root.hidden=false;this.root.dataset.room=cue.room;
  this.root.dataset.phase=cue.phase;
  this.root.classList.toggle('reduced-motion',reducedMotion);
  this.root.classList.toggle('has-chip',cue.chip);
  this.root.classList.toggle('three-second',cue.threeSecond);
  const key=cue.rows.join('\u241f');
  if(this.lastKey===key)return;
  this.lastKey=key;
  const target=this.root.querySelector('.human-only-rows');
  target.replaceChildren();
  for(const [index,text] of cue.rows.entries()){
   const row=make('div','human-only-row');
   row.append(make('span','human-only-row-index',String(index+1).padStart(2,'0')),make('span','human-only-row-label',text));
   target.append(row);
  }
 }
}
