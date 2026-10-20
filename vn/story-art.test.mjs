import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {medicalConferenceForBeat,MEDICAL_CONFERENCE_MORNING} from './medical-conference.js';
import {hospitalWaitingForBeat,HOSPITAL_WAITING_AFTERNOON} from './hospital-waiting.js';
import {evaluationRoomForBeat,EVALUATION_ROOM,EVALUATION_ROOM_DARK} from './evaluation-room.js';

const context={window:{}};
vm.runInNewContext(await readFile(new URL('./story-data.js',import.meta.url),'utf8'),context,{timeout:20000});
const story=context.window.STORY;
const chapter=id=>story.chapters.find(c=>c.id===id);

test('real episodes 10, 31 and 32 stage only source-anchored ranges',()=>{
 const ep10=chapter('10'),ep31=chapter('31'),ep32=chapter('32');
 assert(ep10&&ep31&&ep32);
 const index10=ep10.beats.findIndex(b=>b.text.includes('평가실에는 의자가 하나뿐이었다.'));
 const blackout=ep10.beats.findIndex(b=>b.text.includes('조명이 꺼졌다.'));
 assert(index10>=0&&blackout>index10);
 assert.equal(evaluationRoomForBeat(ep10,index10),EVALUATION_ROOM);
 assert.equal(evaluationRoomForBeat(ep10,blackout),EVALUATION_ROOM_DARK);
 const index31=ep31.beats.findIndex(b=>b.text.includes('백윤하가 회의실 문을 닫자'));
 const index32=ep32.beats.findIndex(b=>b.text.includes('백윤하가 회의실 화면에 숫자 세 개를 띄웠다.'));
 const hospital=ep32.beats.findIndex(b=>b.text.includes('세르젠 협력 병원 6층'));
 assert(index31>=0&&index32>=0&&hospital>=0);
 assert.equal(medicalConferenceForBeat(ep31,index31),MEDICAL_CONFERENCE_MORNING);
 assert.equal(medicalConferenceForBeat(ep32,index32),MEDICAL_CONFERENCE_MORNING);
 assert.equal(hospitalWaitingForBeat(ep32,hospital),HOSPITAL_WAITING_AFTERNOON);
 assert.equal(hospitalWaitingForBeat(ep31,index31),'');
 assert.equal(medicalConferenceForBeat(ep32,hospital),'');
});
test('interim SVGs have exact storyboard dimensions and remain real local assets',async()=>{
 for(const path of [EVALUATION_ROOM,EVALUATION_ROOM_DARK,MEDICAL_CONFERENCE_MORNING,HOSPITAL_WAITING_AFTERNOON]){
  const source=await readFile(new URL(path.replace('./assets/','./assets/'),import.meta.url),'utf8');
  assert.match(source,/viewBox="0 0 1672 941"/,path);
  assert.match(source,/<svg\b/);
  assert(!/<text[\s>]/i.test(source),'text must remain separate UI: '+path);
 }
});
