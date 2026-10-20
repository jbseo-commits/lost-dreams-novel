import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {medicalSceneForBeat} from './medical-scene.js';
const box={window:{}};
vm.runInNewContext(await fs.readFile(new URL('./story-data.js',import.meta.url),'utf8'),box,{timeout:20000});
const c=id=>box.window.STORY.chapters.find(v=>v.id===id);
const index=(chapter,needle)=>chapter.beats.findIndex(b=>b.text.includes(needle));
test('31 medical fourth run waits for exact source beat',()=>{
 const story=c('31');const begin=index(story,'백윤하가 회의실 문을 닫자');
 const first=index(story,'검증 1 / 완료.');
 const fourth=index(story,'검증 4 / 실행.');
 assert.equal(medicalSceneForBeat(story,begin).rows.length,0);
 assert.deepEqual(medicalSceneForBeat(story,first).rows,['검증 1 / 완료.']);
 assert.equal(medicalSceneForBeat(story,fourth-1).rows.length,3);
 assert.equal(medicalSceneForBeat(story,fourth).phase,'running');
 const next=story.beats.findIndex(b=>b.sourceLine>=115);
 assert.equal(medicalSceneForBeat(story,next),null);
});
test('32 early conference numbers reveal sequentially and never leak later results',()=>{
 const story=c('32');
 const first=index(story,'백윤하가 회의실 화면에 숫자 세 개를');
 const third=index(story,'독립 검증층 평균 대기 4분.');
 assert.equal(medicalSceneForBeat(story,first).rows.length,0);
 assert.deepEqual(medicalSceneForBeat(story,third).rows,[
  '1차 재검증 평균 대기 11분.','2차 재검증 평균 대기 38분.','독립 검증층 평균 대기 4분.'
 ]);
 assert.equal(medicalSceneForBeat(story,third).rows.some(t=>t.includes('16분')),false);
});
test('32 waiting stage preserves one waiting room across paragraph break, no advance spoiler',()=>{
 const story=c('32');
 const start=index(story,'세르젠 협력 병원 6층');
 const wait=index(story,'독립 검증 대기 예상 16분.');
 const result=index(story,'16분째, 대기 표시가 사라졌다.');
 assert.equal(medicalSceneForBeat(story,start).phase,'empty');
 assert.equal(medicalSceneForBeat(story,wait).phase,'pending');
 assert.equal(medicalSceneForBeat(story,result).phase,'complete');
 assert.equal(medicalSceneForBeat(story,result).type,'waiting');
 assert.equal(medicalSceneForBeat(story,story.beats.findIndex(b=>b.sourceLine>=360)),null);
});
test('story stage is entirely opt-in and never invents a source room',()=>{
 const ch={id:'31',beats:[{sourceLine:3,text:'다른 방'}]};
 assert.equal(medicalSceneForBeat(ch,0),null);
 assert.equal(medicalSceneForBeat(c('33'),0),null);
});
