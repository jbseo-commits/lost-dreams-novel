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
