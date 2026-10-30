// Synchronize the separately authored VN episode 19-1 with its canonical manuscript.
// Preserve the other 127 chapters verbatim at the data level. Re-align source
// metadata and cutscene anchors, never rewrite the manuscript.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const episode=process.argv[2]||'19-1';
const epFilename='ep'+episode.replace(/^(\d+)/,(_all,digits)=>digits.padStart(3,'0'))+'.md';
const manuscript=path.join(root,'manuscript',epFilename);
const storyFile=path.join(root,'vn','story-data.js');
const cutFile=path.join(root,'vn','episode-cutscenes.js');
const raw=fs.readFileSync(manuscript,'utf8');
const original=fs.readFileSync(storyFile,'utf8');
const context={window:{}};
vm.runInNewContext(original,context,{timeout:15000});
const story=JSON.parse(JSON.stringify(context.window.STORY));
const chapter=story.chapters.find(c=>c.id===episode);
if(!chapter||chapter.sourcePath!=='manuscript/'+epFilename)throw Error('source path changed for '+episode);

const lineParts=raw.split(/\r?\n/);
const title=lineParts[0].replace(/^#\s*/,'');
const paragraphs=[];
let acc=[],begin=0;
function flush(end){
 if(!acc.length)return;
 const rawText=acc.join('\n').trim();
 const text=rawText.replaceAll('**','');
 if(text)paragraphs.push({text,sourceLine:begin,endLine:end,system:/^\*\*/.test(rawText)});
 acc=[];begin=0;
}
for(let i=1;i<=lineParts.length;i++){
 const l=lineParts[i]??'',trim=l.trim();
 if(!trim||trim==='***'){flush(i);continue;}
 if(!acc.length)begin=i+1;
 acc.push(l);
}
if(paragraphs.length<70||paragraphs.length>400)throw Error('Unexpected paragraph count '+episode+': '+paragraphs.length);

const old=chapter.beats,now=paragraphs;
function similarity(a,b){
 if(a===b)return 1;
 if(!a||!b)return 0;
 const grams=(str)=>{
  const chars=Array.from(str.replace(/\s+/g,''));
  const n=Math.min(3,chars.length);
  const m=new Map();
  for(let i=0;i<=chars.length-n;i++){const g=chars.slice(i,i+n).join('');m.set(g,(m.get(g)||0)+1);}
  return m;
 };
 const left=grams(a),right=grams(b);
 let common=0,total=0;
 for(const v of left.values())total+=v;
 for(const v of right.values())total+=v;
 for(const [k,v] of left)common+=Math.min(v,right.get(k)||0);
 return total?2*common/total:0;
}
const m=old.length,n=now.length;
const dp=Array.from({length:m+1},()=>new Float64Array(n+1));
const trace=Array.from({length:m+1},()=>new Uint8Array(n+1));
for(let i=1;i<=m;i++){dp[i][0]=dp[i-1][0]-1;trace[i][0]=1;}
for(let j=1;j<=n;j++){dp[0][j]=dp[0][j-1]-1;trace[0][j]=2;}
for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
 const sim=similarity(old[i-1].text,now[j-1].text);
 const pair=sim===1?5:(sim<.23?-3:4*sim-2.1);
 const diagonal=dp[i-1][j-1]+pair,dropOld=dp[i-1][j]-1,addNew=dp[i][j-1]-1;
 if(diagonal>=dropOld&&diagonal>=addNew){dp[i][j]=diagonal;trace[i][j]=0;}
 else if(dropOld>=addNew){dp[i][j]=dropOld;trace[i][j]=1;}
 else {dp[i][j]=addNew;trace[i][j]=2;}
}
const matched=new Map();let i=m,j=n;
while(i||j){const move=trace[i][j];if(move===0){matched.set(j-1,i-1);i--;j--;}else if(move===1)i--;else j--;}
const pairs=[...matched].sort((a,b)=>a[0]-b[0]);
const unmatched=now.length-pairs.length;
const exact=pairs.filter(([ni,oi])=>now[ni].text===old[oi].text).length;
console.log('Alignment:',JSON.stringify({old:m,canonical:n,matched:pairs.length,exact,unmatched}));
if(exact<Math.floor(Math.min(m,n)*.55))throw Error('Too few unchanged paragraphs; stop instead of guessing');

function neighboringOld(index){
 const before=pairs.filter(p=>p[0]<index).at(-1);
 const after=pairs.find(p=>p[0]>index);
 if(before&&after){
  const oldPoint=Math.round(before[1]+(index-before[0])*(after[1]-before[1])/(after[0]-before[0]));
  return Math.max(0,Math.min(m-1,oldPoint));
 }
 return before?.[1]??after?.[1]??0;
}
let inferredDialogue=0;
chapter.beats=now.map((entry,index)=>{
 const oldIndex=matched.get(index);
 const from=old[oldIndex??neighboringOld(index)];
 const copy=structuredClone(from);
 const isQuote=/^["“「]/.test(entry.text);
 const isSystem=entry.system;
 const priorKind=copy.kind;
 copy.text=entry.text;
 copy.sourceLine=entry.sourceLine;
 copy.endLine=entry.endLine;
 copy.sourceParagraph=index+1;
 if(oldIndex==null){
  copy.choice=null;
  copy.kind=isSystem?'system':isQuote?'dialogue':'narration';
  if(copy.kind==='narration'||copy.kind==='system')copy.speaker='';
  else {
   if(priorKind!=='dialogue'||!copy.speaker){
    const neighbors=pairs.filter(([idx,oi])=>Math.abs(idx-index)<=5&&old[oi].kind==='dialogue')
      .sort((a,b)=>Math.abs(a[0]-index)-Math.abs(b[0]-index));
    copy.speaker=neighbors[0] ? old[neighbors[0][1]].speaker : '서인';
    inferredDialogue++;
   }
  }
  if(copy.direction)copy.direction={...copy.direction,visual:null};
 }else if(from.text!==entry.text){
  if(copy.kind==='dialogue'&&!isQuote){copy.kind='narration';copy.speaker='';}
  if(copy.kind==='narration'&&isQuote){copy.kind='dialogue';if(!copy.speaker)copy.speaker='서인';}
  if(copy.direction?.visual)copy.direction={...copy.direction,visual:null};
 }
 if(copy.kind==='dialogue'&&!copy.speaker)throw Error('Dialogue without speaker at '+index);
 if(!story.assets[copy.scene])throw Error('Missing background at '+index+': '+copy.scene);
 return copy;
});
chapter.title=title;
for(let k=0;k<chapter.beats.length;k++){
 const p=chapter.beats[k],expected=now[k];
 if(p.text!==expected.text||p.sourceLine!==expected.sourceLine||p.endLine!==expected.endLine)throw Error('Source drift at '+k);
}
console.log('Inferred dialogue speakers:',inferredDialogue);
const chapterSummary=chapter.beats.map((b,k)=>({k,text:b.text,kind:b.kind,speaker:b.speaker,sourceLine:b.sourceLine,place:b.direction?.place||'',scene:b.scene}));
fs.writeFileSync(path.join(root,'vn','notes',epFilename.replace(/\.md$/, '-source-sync-review.json')),JSON.stringify({chapter:chapter.id,previousBeats:m,canonicalBeats:n,exactMatches:exact,inferredDialogue,beats:chapterSummary},null,2)+'\n');
fs.writeFileSync(storyFile,'window.STORY = '+JSON.stringify(story)+';\n');

const cutSource=fs.readFileSync(cutFile,'utf8');
const prefix='export const EPISODE_CUTSCENES = Object.freeze(';
const start=cutSource.indexOf(prefix),end=cutSource.indexOf('.map(Object.freeze));',start);
if(start<0||end<0)throw Error('Unknown cutscene format');
const arrayLiteral=cutSource.slice(start+prefix.length,end);
const cuts=vm.runInNewContext(arrayLiteral,{});
const finger=text=>{let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619)>>>0;return h.toString(16);};
for(const cut of cuts.filter(c=>c.chapter===episode)){
 const idx=chapter.beats.findIndex(b=>b.text===cut.anchor);
 const stop=chapter.beats.findIndex((b,k)=>k>=idx&&k<idx+50&&b.text===cut.endAnchor);
 if(idx<0||stop<idx)throw Error('Missing source-bound cutscene anchor '+cut.cg);
 cut.start=idx;cut.end=stop;
 cut.fingerprint=finger(chapter.beats.slice(idx,stop+1).map(b=>b.text).join('\u001f'));
 console.log('Cutscene:',cut.cg,idx,stop,cut.fingerprint);
}
const updated=cutSource.slice(0,start+prefix.length)+JSON.stringify(cuts,null,2)+cutSource.slice(end);
fs.writeFileSync(cutFile,updated);
console.log('Sync complete for '+episode+'. Other chapter data preserved.');
