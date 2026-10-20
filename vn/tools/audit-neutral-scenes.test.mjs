import test from 'node:test';
import assert from 'node:assert/strict';
import {assessNeutralRuns} from './audit-neutral-scenes.mjs';
const chapter=(id,beats)=>({id,title:'테스트',sourcePath:'manuscript/ep'+id+'.md',beats});
test('neutral 연속 구간의 원고 줄과 개수를 보존한다',()=>{
 const a=assessNeutralRuns({chapters:[chapter('31',[
  {scene:'meeting',text:'회의장에 들어섰다.',sourceLine:1,endLine:1},
  {scene:'neutral',text:'회의실 문을 닫았다.',sourceLine:2,endLine:2},
  {scene:'neutral',text:'벽 전체가 바뀌었다.',sourceLine:3,endLine:3},
  {scene:'office',text:'회사에 돌아왔다.',sourceLine:4,endLine:4}
 ])]});
 assert.equal(a.totalNeutral,2);assert.equal(a.groupCount,1);
 assert.equal(a.groups[0].candidate,'meeting');
 assert.equal(a.groups[0].status,'needs-context-review');
 assert.equal(a.groups[0].lineStart,2);assert.equal(a.groups[0].lineEnd,3);
});
test('여러 장소가 함께 나오면 확정하지 않는다',()=>{
 const a=assessNeutralRuns({chapters:[chapter('32',[{scene:'neutral',text:'회의실을 나와 병원 로비로 갔다.',sourceLine:10,endLine:10}])]});
 assert.equal(a.groups[0].candidate,null);
 assert.equal(a.groups[0].status,'ambiguous-multiple-places');
});
test('장소 근거가 없는 구간은 미분류',()=>{
 const a=assessNeutralRuns({chapters:[chapter('33',[{scene:'neutral',text:'서인은 대답하지 않았다.',sourceLine:30,endLine:30}])]});
 assert.equal(a.groups[0].status,'unresolved');
});
