import test from 'node:test';
import assert from 'node:assert/strict';
import {hospitalWaitingForBeat,HOSPITAL_WAITING_AFTERNOON} from './hospital-waiting.js';
const chapter={id:'32',beats:[{sourceLine:259,text:'세르젠 협력 병원 6층.'},{sourceLine:333,text:'그는 의자에 앉았다.'},{sourceLine:360,text:'집에 돌아왔다.'}]};
test('32 hospital room keeps same set across paragraph break, then restores home',()=>{
 assert.equal(hospitalWaitingForBeat(chapter,0),HOSPITAL_WAITING_AFTERNOON);
 assert.equal(hospitalWaitingForBeat(chapter,1),HOSPITAL_WAITING_AFTERNOON);
 assert.equal(hospitalWaitingForBeat(chapter,2),'');
 assert.equal(hospitalWaitingForBeat({...chapter,id:'31'},0),'');
});
test('hospital room does not stage without the source anchor',()=>{
 assert.equal(hospitalWaitingForBeat({id:'32',beats:[{sourceLine:260,text:'누락된 장소'}]},0),'');
});
