// VN art inventory. Report evidence, never infer a location from adjacent scenes.
// node tools/vn-asset-audit.mjs > neutral-inventory.json
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const shorten = (s,n=96) => String(s??'').replace(/\s+/g,' ').trim().slice(0,n);
const isNeutral = b => !b?.scene || b.scene === 'neutral';
export function auditNeutral(chapters,minEpisode=31) {
 const groups=[]; let neutralBeats=0;
 for(const chapter of chapters) {
  if(Number(String(chapter.id).split('-')[0])<minEpisode) continue;
  const beats=chapter.beats||[];
  for(let i=0;i<beats.length;) {
   if(!isNeutral(beats[i])) {i++;continue;}
   const first=i;while(i<beats.length&&isNeutral(beats[i])) i++;
   const last=i-1,slice=beats.slice(first,i);
   neutralBeats+=slice.length;
   const places=[...new Set(slice.map(b=>b.direction?.place).filter(Boolean))];
   const grounded=places.length===1&&slice.every(b=>b.direction?.place===places[0]);
   groups.push({chapter:chapter.id,source:chapter.sourcePath||'',beatFrom:first,beatTo:last,
    sourceLineFrom:beats[first].sourceLine??null,
    sourceLineTo:beats[last].endLine??beats[last].sourceLine??null,
    count:slice.length,status:grounded?'source-grounded':'needs-manuscript-review',
    location:grounded?places[0]:null,
    priorSceneContext:beats[first-1]?.scene??null,nextSceneContext:beats[i]?.scene??null,
    openingText:shorten(beats[first].text),closingText:shorten(beats[last].text)});
  }
 }
 return {schema:'vn-neutral-inventory/v1',minEpisode,neutralBeats,sceneGroups:groups.length,
  resolvedGroups:groups.filter(x=>x.status==='source-grounded').length,
  unresolvedGroups:groups.filter(x=>x.status==='needs-manuscript-review').length,groups};
}
async function main() {
 const source=await readFile(resolve(REPO_ROOT,'vn/story-data.js'),'utf8');
 const sandbox={window:{}};
 vm.runInNewContext(source,sandbox,{filename:'vn/story-data.js',timeout:20000});
 if(!Array.isArray(sandbox.window.STORY?.chapters)) throw Error('STORY.chapters missing');
 process.stdout.write(JSON.stringify(auditNeutral(sandbox.window.STORY.chapters),null,2)+'\n');
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 main().catch(e=>{console.error(e);process.exitCode=1;});
}
