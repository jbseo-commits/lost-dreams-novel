import test from 'node:test';
import assert from 'node:assert/strict';
import {medicalConferenceForBeat,MEDICAL_CONFERENCE_MORNING} from './medical-conference.js';
const make=(id,line,anchor)=>({id,beats:[{sourceLine:line,text:'시작'}, {sourceLine:line,text:anchor}]});
test('31 & 32 use shared meeting background only inside evidenced morning scene',()=>{
 const a=make('31',113,'백윤하가 회의실 문을 닫자 벽 전체가 병원 화면으로 바뀌었다.');
 const b=make('32',110,'백윤하가 회의실 화면에 숫자 세 개를 띄웠다.');
 assert.equal(medicalConferenceForBeat(a,0),MEDICAL_CONFERENCE_MORNING);
 assert.equal(medicalConferenceForBeat(b,0),MEDICAL_CONFERENCE_MORNING);
 a.beats[0].sourceLine=115;b.beats[0].sourceLine=111;
 assert.equal(medicalConferenceForBeat(a,0),'');
 assert.equal(medicalConferenceForBeat(b,0),'');
});
test('unknown / rewritten content does not place an invented meeting set',()=>{
 assert.equal(medicalConferenceForBeat(make('35',4,'회의실'),0),'');
 assert.equal(medicalConferenceForBeat(make('31',5,'다른 장소'),0),'');
 assert.equal(medicalConferenceForBeat({id:'31',beats:[{text:'missing source line'}]},0),'');
});
