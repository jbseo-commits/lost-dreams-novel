// VN art inventory. Report evidence; do not infer locations from neighboring scenes.
// node tools/vn-asset-audit.mjs > neutral-inventory.json
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
const REPO_ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const shorten=(s,n=96)=>String(s??'').replace(/\s+/g,' ').trim().slice(0,n);
const isNeutral=b=>!b?.scene||b.scene==='neutral';
const PLACE_TERMS=['회의실','면담실','감사실','평가실','사무실','작업실','공방','부엌','주방','복도','병실','병동','의료실','대기실','병원','현관','골목','버스','열차','승강장','옥상','노인정','시장','카페','식탁','회의장','지하실','기지','법정','센터','출근'];
export function manuscriptBreaks(source) {
 return String(source).split(/\r?\n/).flatMap((line,index)=>line.trim()==='***'?[index+1]:[]);
}
function segmentOf(line, markers) {
 if(!Number.isInteger(line))return -1;
 let value=0;for(const marker of markers){if(marker<line)value++;else break;}
 return value;
}
export function auditNeutral(chapters,minEpisode=31,sourceBreaks={}) {
 const groups=[];let neutralBeats=0;
 for(const chapter of chapters) {
  if(Number(String(chapter.id).split('-')[0])<minEpisode)continue;
  const beats=chapter.beats||[],markers=sourceBreaks[chapter.sourcePath]||[];
  for(let i=0;i<beats.length;) {
   if(!isNeutral(beats[i])){i++;continue;}
   const first=i,part=segmentOf(beats[i].sourceLine,markers);
   while(i<beats.length&&isNeutral(beats[i])&&segmentOf(beats[i].sourceLine,markers)===part)i++;
   const last=i-1,slice=beats.slice(first,i);
   neutralBeats+=slice.length;
   const places=[...new Set(slice.map(b=>b.direction?.place).filter(Boolean))];
   const grounded=places.length===1&&slice.every(b=>b.direction?.place===places[0]);
   const textCorpus=slice.map(b=>b.text??'').join(' ');
   const locationEvidence=PLACE_TERMS.filter(word=>textCorpus.includes(word)).slice(0,9);
   const lineBefore=part<=0?1:markers[part-1]+1;
   const lineAfter=part<0?null:markers[part]??null;
   groups.push({chapter:chapter.id,source:chapter.sourcePath||'',
    manuscriptSection:part,manuscriptSectionStarts:part>=0?lineBefore:null,
    manuscriptSectionEnds:lineAfter,
    beatFrom:first,beatTo:last,sourceLineFrom:beats[first].sourceLine??null,
    sourceLineTo:beats[last].endLine??beats[last].sourceLine??null,
    count:slice.length,status:grounded?'source-grounded':'needs-manuscript-review',
    location:grounded?places[0]:null,locationEvidence,
    priorSceneContext:beats[first-1]?.scene??null,nextSceneContext:beats[i]?.scene??null,
    openingText:shorten(beats[first].text),closingText:shorten(beats[last].text)});
  }
 }
 return {schema:'vn-neutral-inventory/v2',minEpisode,neutralBeats,sceneGroups:groups.length,
  resolvedGroups:groups.filter(x=>x.status==='source-grounded').length,
  unresolvedGroups:groups.filter(x=>x.status==='needs-manuscript-review').length,groups};
}
async function main() {
 const source=await readFile(resolve(REPO_ROOT,'vn/story-data.js'),'utf8');
 const sandbox={window:{}};vm.runInNewContext(source,sandbox,{filename:'vn/story-data.js',timeout:20000});
 if(!Array.isArray(sandbox.window.STORY?.chapters))throw Error('STORY.chapters missing');
 const chapters=sandbox.window.STORY.chapters,sourceBreaks={};
 for(const path of new Set(chapters.filter(c=>Number(String(c.id).split('-')[0])>=31).map(c=>c.sourcePath).filter(Boolean))){
  const text=await readFile(resolve(REPO_ROOT,path),'utf8');
  sourceBreaks[path]=manuscriptBreaks(text);
 }
 process.stdout.write(JSON.stringify(auditNeutral(chapters,31,sourceBreaks),null,2)+'\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 main().catch(e=>{console.error(e);process.exitCode=1;});
}
