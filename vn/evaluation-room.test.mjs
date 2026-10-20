import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluationRoomForBeat,EVALUATION_ROOM,EVALUATION_ROOM_DARK} from './evaluation-room.js';
const chapter={id:'10',beats:[
 {text:'평가실에는 의자가 하나뿐이었다.'},{text:'서인은 앉지 않았다.'},
 {text:'조명이 꺼졌다.'},{text:'첫 문제는 쉬웠다.'}
]};
test('episode 10 shows the same one-chair room after blackout',()=>{
 assert.equal(evaluationRoomForBeat(chapter,0),EVALUATION_ROOM);
 assert.equal(evaluationRoomForBeat(chapter,1),EVALUATION_ROOM);
 assert.equal(evaluationRoomForBeat(chapter,2),EVALUATION_ROOM_DARK);
 assert.equal(evaluationRoomForBeat(chapter,3),EVALUATION_ROOM_DARK);
 assert.equal(evaluationRoomForBeat({...chapter,id:'9'},2),'');
});
test('unmatched manuscript does not receive speculative set',()=>{
 assert.equal(evaluationRoomForBeat({id:'10',beats:[{text:'다른 곳'}]},0),'');
});
