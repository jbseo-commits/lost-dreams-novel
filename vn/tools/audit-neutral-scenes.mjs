/** VN neutral 공통 무대 조사: 명시된 장소만 후보로 보고 자동 교체하지 않는다. */
import fs from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const PLACE_SIGNALS=Object.freeze({
  meeting:/회의실|회의 테이블|이사회|회의장/g,
  office:/사무실|사무 공간|사무동|회사 복도/g,
  kitchen:/부엌|주방|싱크대|가스레인지/g,
  room:/침실|자기 방|방 안|침대|원룸/g,
  clinic:/클리닉|진료실|병원 복도|장부실/g,
  train:/열차|전철|지하철|객차/g,
  street:/거리|광장|인도|횡단보도/g,
  hospital:/병실|병원 로비|응급실|접수대/g,
  rooftop:/옥상|난간/g,
  workshop:/공방|도자기|가마/g,
  assessment:/평가실/g
});
export function assessNeutralRuns(story){
  if(!Array.isArray(story?.chapters))throw new Error('window.STORY.chapters 배열이 없습니다.');
  const groups=[],byChapter=[];let totalNeutral=0;
  for(const chapter of story.chapters){
    if(!Array.isArray(chapter.beats))continue;
    let count=0;
    for(let start=0;start<chapter.beats.length;){
      if(chapter.beats[start]?.scene!=='neutral'){start++;continue;}
      let end=start;
      while(end+1<chapter.beats.length&&chapter.beats[end+1]?.scene==='neutral')end++;
      const beats=chapter.beats.slice(start,end+1);
      count+=beats.length;totalNeutral+=beats.length;
      const hints=new Map();
      for(const [name,rx] of Object.entries(PLACE_SIGNALS)){
        const matches=beats.flatMap((b,offset)=>[...String(b?.text??'').matchAll(rx)].map(m=>({
          beatIndex:start+offset,fragment:m[0],sourceLine:b?.sourceLine??null
        })));
        if(matches.length)hints.set(name,matches);
      }
      const candidates=[...hints.keys()];
      groups.push({
        chapterId:chapter.id,chapterTitle:chapter.title??'',sourcePath:chapter.sourcePath??'',
        beatStart:start,beatEnd:end,count:beats.length,
        lineStart:beats[0]?.sourceLine??null,lineEnd:beats.at(-1)?.endLine??null,
        candidate:candidates.length===1?candidates[0]:null,candidates,
        evidence:Object.fromEntries(hints),
        status:candidates.length===1?'needs-context-review':candidates.length>1?'ambiguous-multiple-places':'unresolved',
        firstText:String(beats[0]?.text??'').slice(0,100)
      });
      start=end+1;
    }
    if(count)byChapter.push({id:chapter.id,title:chapter.title??'',neutralBeats:count});
  }
  const byStatus=Object.fromEntries(['unresolved','ambiguous-multiple-places','needs-context-review'].map(k=>[k,groups.filter(g=>g.status===k).length]));
  return {schemaVersion:1,totalNeutral,groupCount:groups.length,byStatus,byChapter,groups};
}
export async function readStory(filepath=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../story-data.js')){
  const sandbox={window:{}};
  vm.runInNewContext(await fs.readFile(filepath,'utf8'),sandbox,{filename:filepath,timeout:30000});
  return sandbox.window.STORY;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const report=assessNeutralRuns(await readStory());
  const i=process.argv.indexOf('--json');
  if(i>=0){
    if(!process.argv[i+1])throw new Error('--json 다음에 출력 경로를 지정해 주세요.');
    await fs.writeFile(process.argv[i+1],JSON.stringify(report,null,2)+'\n');
  }
  console.log(`neutral ${report.totalNeutral}문장 / ${report.groupCount}연속 구간`);
  console.log(report.byStatus);
  console.log('최다 회차', [...report.byChapter].sort((a,b)=>b.neutralBeats-a.neutralBeats).slice(0,20));
  console.log('원고 확인 전 자동으로 배경을 바꾸지 않습니다.');
}
