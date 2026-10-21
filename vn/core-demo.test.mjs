import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {normalizeStory,emptyStore,makeSave} from './state.js';
import {coreDemoStory,coreChapter,coreSceneDirection,CORE_CUTS,isOptionalObservation,coreEditionUrl} from './core-demo.js';
import {coreReadingPage,corePreviousPage} from './core-reading.js';
import {exportSaveData,importSaveData} from './save-portability.js';
import {presentationForBeat} from './neural-cues.js';
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(new URL('./story-data.js',import.meta.url),'utf8'),ctx);
const full=normalizeStory(JSON.parse(JSON.stringify(ctx.window.STORY))),demo=coreDemoStory(full),at=id=>full.chapters.find(c=>c.id===id);

test('single-file demo and full-story navigation stay in the same downloaded file',()=>{
 const file='file:///C:/Games/play-offline.html?chapter=4&beat=90#old';
 assert.equal(coreEditionUrl(file,{offline:true,demo:true}),'file:///C:/Games/play-offline.html?demo=core11');
 assert.equal(coreEditionUrl(file,{offline:true,chapter:'12'}),'file:///C:/Games/play-offline.html?chapter=12&beat=0');
 assert.equal(coreEditionUrl(file,{offline:true}),'file:///C:/Games/play-offline.html');
 assert.equal(coreEditionUrl('https://example.com/vn/index.html?chapter=4',{demo:true}),'https://example.com/vn/demo.html');
 assert.equal(coreEditionUrl('https://example.com/vn/demo.html',{chapter:'12'}),'https://example.com/vn/index.html?chapter=12&beat=0');
});
test('core demo ends after first actual cost in 11, keeping all seven canonical connecting stories',()=>{
 assert.deepEqual(demo.chapters.map(c=>c.id),['1','2','3','4','4-1','5','6','6-1','7','7-2','8','8-1','8-2','8-3','9','9-1','10','11']);
 assert.equal(demo.edition,'core11');assert.equal(full.chapters.length,127);
 assert.ok(!demo.chapters.some(c=>['manuscript/ep008-1.md','manuscript/ep008-2.md'].includes(c.sourcePath)));
 for(const c of demo.chapters)assert.ok(coreChapter(c));
 const changed=structuredClone(at('4'));changed.beats[20].text+=' 개고';assert.equal(coreSceneDirection(changed,202),null);
});
test('new event pictures appear only at their exact source actions, with no duplicate actors',()=>{
 for(const cut of CORE_CUTS){const c=at(cut.chapter);assert.equal(c.beats[cut.start].text,cut.anchor);assert.equal(c.beats[cut.end].text,cut.endAnchor);
  for(let i=cut.start;i<=cut.end;i++){const q=coreSceneDirection(c,i);assert.equal(q.cg,cut.cg);assert.deepEqual(q.actors,[]);}
  for(const i of [cut.start-1,cut.end+1])assert.notEqual(coreSceneDirection(c,i)?.cg,cut.cg);
 }
});
test('mother, clinic, after-surgery behavior, clues, wrong answers and the 0.8s silence follow their scenes',()=>{
 for(let i=245;i<260;i++){const q=coreSceneDirection(at('10'),i);assert.equal(q.background,'kitchen');assert.ok(!q.actors.some(a=>a.id==='jiwoo'));}
 assert.equal(coreSceneDirection(at('11'),200).actors.find(a=>a.id==='seoin').asset,'coreSeoinAfter');
 assert.equal(coreSceneDirection(at('11'),90).actors[0].asset,'coreHakyung');
 const four=at('4'),watch=four.beats.findIndex(b=>b.text.includes('손목시계를 만졌다'));
 assert.equal(coreSceneDirection(four,watch-1).board,null);assert.equal(coreSceneDirection(four,watch).board.rows.length,1);
 const ten=at('10'),wrongs=ten.beats.flatMap((b,i)=>b.text==='오답.'?[i]:[]);assert.equal(wrongs.length,2);
 assert.equal(coreSceneDirection(ten,wrongs[1]).board.rows.filter(r=>r[1]==='오답.').length,2);
 const eleven=at('11'),gap=eleven.beats.findIndex(b=>b.text==='0.8초.');assert.equal(coreSceneDirection(eleven,gap).gap,.8);
 assert.equal(coreSceneDirection(eleven,76).board,null);
});
test('core reading pages include all source beats once, retain every old save and never cross a signal or sound event',()=>{
 for(const c of demo.chapters.filter(c=>Number(c.id.split('-')[0])>=3)){
  const visited=[];for(let i=0;i<c.beats.length;){const p=coreReadingPage(c,i);assert.equal(p.start,i);visited.push(...p.entries.map(b=>b.index));
   for(const b of p.entries.slice(1)){assert.equal(presentationForBeat(c,c.beats[b.index],b.index),null);assert.equal(coreSceneDirection(c,b.index).fx,null);assert.equal(coreSceneDirection(c,b.index).gap,0);}
   i=p.end+1;
  }
  assert.deepEqual(visited,c.beats.map((b,i)=>i));
  for(let i=0;i<c.beats.length;i++){assert.equal(coreReadingPage(c,i).entries[0].index,i);if(i)assert.ok(corePreviousPage(c,i)<i);}
 }
});
test('three existing review interactions stay optional and source-gated',()=>{
 for(const [id,i]of [['1',240],['5',179],['6',225]]){assert.ok(isOptionalObservation(at(id),i));assert.ok(!isOptionalObservation(at(id),i+1));}
 const changed=structuredClone(at('5'));changed.beats[1].text+='변경';assert.equal(isOptionalObservation(changed,179),false);
});
test('demo and full backups round trip separately and refuse imports in both wrong directions',()=>{
 const s=emptyStore();s.autosave=makeSave({chapterId:'1',beatIndex:3,choices:{},finished:false},at('1'),at('1').beats[3]);
 const core=exportSaveData(s,demo),regular=exportSaveData(s,full);
 assert.equal(importSaveData(core,demo).autosave.progress.beatIndex,3);assert.equal(importSaveData(regular,full).autosave.progress.beatIndex,3);
 assert.throws(()=>importSaveData(core,full),/체험판과 본편/);assert.throws(()=>importSaveData(regular,demo),/체험판과 본편/);
 const legacy=JSON.parse(regular);delete legacy.edition;assert.equal(importSaveData(JSON.stringify(legacy),full).autosave.progress.beatIndex,3);
});
test('all nine new art assets and nine original audio files match their real production hashes',()=>{
 for(const name of ['art-provenance.json','audio-provenance.json']){const j=JSON.parse(fs.readFileSync(new URL('./assets/core/'+name,import.meta.url)));assert.equal(j.assets.length,9);
  for(const a of j.assets){const bytes=fs.readFileSync(new URL('./assets/core/'+a.file,import.meta.url));assert.equal(bytes.length,a.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);if(a.file.endsWith('.wav')){assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.ok(a.peak<.85&&a.rms>0);}}
 }
});
