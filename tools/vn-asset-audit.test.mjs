import test from 'node:test';
import assert from 'node:assert/strict';
import { auditNeutral } from './vn-asset-audit.mjs';
test('groups adjacent neutral beats without inventing places', () => {
 const chapters=[
  {id:'2',beats:[{scene:'neutral',text:'old'}]},
  {id:'31',sourcePath:'manuscript/ep031.md',beats:[
   {scene:'neutral',sourceLine:4,endLine:4,text:'의자 앞에서 멈췄다.'},
   {scene:'neutral',sourceLine:5,endLine:5,text:'아무도 없었다.'},
   {scene:'office',sourceLine:6,text:'회사'},
   {scene:'neutral',sourceLine:7,endLine:7,text:'돌아왔다.',direction:{place:'사무실'}}
  ]}
 ];
 const result=auditNeutral(chapters);
 assert.equal(result.neutralBeats,3);
 assert.equal(result.sceneGroups,2);
 assert.equal(result.unresolvedGroups,1);
 assert.equal(result.resolvedGroups,1);
 assert.equal(result.groups[0].location,null);
 assert.equal(result.groups[0].sourceLineTo,5);
 assert.equal(result.groups[1].location,'사무실');
 assert.equal(result.groups[1].priorSceneContext,'office');
});
test('partial direction evidence never auto-classifies',()=>{
 const result=auditNeutral([{id:'32',beats:[
  {scene:'neutral',direction:{place:'회의실'}},{scene:'neutral',text:'다음'}
 ]}]);
 assert.equal(result.groups[0].status,'needs-manuscript-review');
 assert.equal(result.groups[0].location,null);
});

test('manuscript separators split a neutral chapter into scene-sized groups',async()=>{
 const {manuscriptBreaks}=await import('./vn-asset-audit.mjs');
 const md=['# 제31화','회의실 문이 닫혔다.','***','도로 옆으로 나왔다.','***','집에 돌아왔다.'].join('\n');
 const markers=manuscriptBreaks(md);
 assert.deepEqual(markers,[3,5]);
 const source='manuscript/ep031.md';
 const result=auditNeutral([{id:'31',sourcePath:source,beats:[
  {scene:'neutral',sourceLine:2,text:'회의실'},{scene:'neutral',sourceLine:4,text:'거리'},{scene:'neutral',sourceLine:6,text:'부엌'}
 ]}],31,{[source]:markers});
 assert.equal(result.neutralBeats,3);
 assert.equal(result.sceneGroups,3);
 assert.deepEqual(result.groups.map(g=>g.manuscriptSection),[0,1,2]);
 assert.deepEqual(result.groups.map(g=>g.location),[null,null,null]);
 assert(result.groups[0].locationEvidence.includes('회의실'));
});

test('missing manuscript groups are blocked rather than presumed one confirmed scene',()=>{
 const source='manuscript/ep071.md';
 const group=auditNeutral([{id:'71',sourcePath:source,beats:[{scene:'neutral',sourceLine:3,text:'약국 앞'}]}],31,{},[source]);
 assert.equal(group.missingGroups,1);
 assert.equal(group.reviewableGroups,0);
 assert.equal(group.groups[0].status,'source-missing');
 assert.equal(group.groups[0].manuscriptSection,null);
 assert.equal(group.groups[0].location,null);
});
