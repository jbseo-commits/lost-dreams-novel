import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {EP04_CLUES, ep04ClueFor} from './episode-four-clues.js';
import {coreSceneDirection} from './core-demo.js';
import {normalizeStory} from './state.js';
import vm from 'node:vm';

const box={window:{}};
vm.runInNewContext(fs.readFileSync(new URL('./story-data.js',import.meta.url),'utf8'),box);
const chapter=normalizeStory(JSON.parse(JSON.stringify(box.window.STORY))).chapters.find(c=>c.id==='4');

test('단서 자료가 관찰 이후 순차적으로 나타나고 조기 노출하지 않는다',()=>{
 const labels=['시계','메시지','시선'];
 assert.deepEqual(Object.keys(EP04_CLUES),labels);
 for(const label of labels){const info=ep04ClueFor(label);assert.match(info.asset,/ep04Clue/);assert.ok(info.alt.includes('얼굴')||info.alt.includes('손')||info.alt.includes('뒷모습'));}
 const watch=chapter.beats.findIndex(b=>b.text.includes('손목시계를 만졌다'));
 const message=chapter.beats.findIndex(b=>b.text.includes('읽자마자 화면을 뒤집었다'));
 const gaze=chapter.beats.findIndex(b=>b.text.includes('창밖으로 갔다'));
 assert.ok(watch>0&&message>watch&&gaze>message);
 assert.deepEqual(coreSceneDirection(chapter,watch).board.rows.map(r=>r[0]),['시계']);
 assert.deepEqual(coreSceneDirection(chapter,message).board.rows.map(r=>r[0]),['시계','메시지']);
 assert.deepEqual(coreSceneDirection(chapter,gaze).board.rows.map(r=>r[0]),labels);
 assert.equal(coreSceneDirection(chapter,watch-1).board,null);
});
test('게임에 이미지 키를 넣고 공개/오프라인 데모에 모두 포함한다',()=>{
 const assets=fs.readFileSync(new URL('./ep1-assets.js',import.meta.url),'utf8');
 const builder=fs.readFileSync(new URL('../tools/build-vn-public.mjs',import.meta.url),'utf8');
 const stage=fs.readFileSync(new URL('./episode-one-stage.js',import.meta.url),'utf8');
 const app=fs.readFileSync(new URL('./app.js',import.meta.url),'utf8');
 for(const info of Object.values(EP04_CLUES)){assert.ok(assets.includes(info.asset+':'));assert.ok(builder.includes("'"+info.asset+"'"));}
 assert.match(stage,/core-clue-gallery/);assert.match(stage,/this\.onEvidence\?\.\(cue,label\)/);
 assert.match(app,/function openCoreEvidence\(cue, selectedLabel = null\)/);
});
