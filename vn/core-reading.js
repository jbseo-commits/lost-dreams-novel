import {coreSceneDirection} from './core-demo.js?v=teaser-art-20261021-r1';
import {presentationForBeat} from './neural-cues.js?v=teaser-art-20261021-r1';
const maps=new WeakMap();
const signature=(c,i)=>{const q=coreSceneDirection(c,i);return q&&JSON.stringify([q.sceneStart,q.background,q.backgroundAsset,q.actors,q.cg,q.board,q.shot,q.music,q.ambience,q.silence,q.cutscene]);};
function pageMap(c){
 if(!coreSceneDirection(c,0))return null;if(maps.has(c))return maps.get(c);
 const map=new Map();
 for(let start=0;start<c.beats.length;){let end=start,length=c.beats[start].text.length;const first=c.beats[start];
  if(first.kind==='narration'&&!first.choice&&!presentationForBeat(c,first,start))for(let next=start+1;next<Math.min(start+3,c.beats.length);next++){
   const b=c.beats[next],q=coreSceneDirection(c,next);
   if(b.kind!=='narration'||b.choice||b.direction?.pauseMs||q?.fx||q?.gap||presentationForBeat(c,b,next)||signature(c,next)!==signature(c,start)||length+b.text.length>160)break;
   length+=b.text.length;end=next;
  }
  for(let n=start;n<=end;n++)map.set(n,{start,end});start=end+1;
 }
 maps.set(c,map);return map;
}
export function coreReadingPage(c,i){const r=pageMap(c)?.get(i);if(!r||!Number.isInteger(i))return null;const entries=c.beats.slice(i,r.end+1).map((b,n)=>({...b,index:i+n}));return{start:i,end:r.end,entries,text:entries.map(b=>b.text).join('\n'),speaker:entries.length===1?entries[0].speaker:'',focus:entries.at(-1).speaker||''};}
export function corePreviousPage(c,i){const m=pageMap(c),r=m?.get(i);if(!r||i===0)return null;return i>r.start?r.start:m.get(i-1).start;}
