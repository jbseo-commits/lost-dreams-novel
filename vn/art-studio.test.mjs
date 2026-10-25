import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto,createHash} from 'node:crypto';
import {chapterFingerprints,createArtDirector,createPreviewStorage,safeArtPath,validTarget} from './art-studio.js';
const chapter={id:'2',title:'제2화',beats:[{text:'여기까지는 원래 그림이다.'},{text:'지우가 돌아보았다.'},{text:'대답을 기다렸다.'},{text:'다음 장면이다.'}]};
const fingerprints=await chapterFingerprints({chapters:[chapter]},webcrypto);
const target={chapterId:'2',start:1,end:2,fingerprint:fingerprints['2'],anchor:chapter.beats[1].text,endAnchor:chapter.beats[2].text,slot:'actor',actorId:'jiwoo',gaze:'down',pose:'seated',scale:1.1};
const row={id:'chosen',asset:'assets/studio/chosen.webp',target};
const cue={chapterId:'2',actors:[{id:'jiwoo',name:'지우',asset:'jiwooRelaxed',side:'right'}],cg:null};
test('fingerprint matches the server UTF-8 SHA-256 contract',()=>assert.equal(fingerprints['2'],createHash('sha256').update(JSON.stringify(chapter.beats.map(beat=>beat.text))).digest('hex')));
test('the approved actor changes only its exact range and never source cue',()=>{
 const director=createArtDirector({manifest:{overrides:[row]},fingerprints,baseAssets:{jiwooRelaxed:'assets/jiwoo.webp'}});
 assert.equal(director.cue(cue,chapter,0),cue);assert.equal(director.cue(cue,chapter,3),cue);
 const changed=director.cue(cue,chapter,1);assert.equal(changed.actors[0].asset,'studio_chosen');assert.equal(changed.actors[0].gaze,'down');assert.equal(cue.actors[0].asset,'jiwooRelaxed');
 assert.equal(director.assets.studio_chosen,row.asset);
});
test('a changed source chapter refuses the old range even when indexes still exist',()=>{
 const changed={...chapter,beats:chapter.beats.map((beat,i)=>i===1?{text:'지우가 일어났다.'}:beat)};
 assert.equal(validTarget(target,changed,fingerprints),false);
 assert.equal(validTarget({...target,fingerprint:'changed'},chapter,fingerprints),false);
});
test('a new cutscene clears previous multi-frame cues and the temporary preview can be removed',()=>{
 const cg={...row,id:'cut',target:{...target,slot:'cg'},asset:'/candidates/cut.png'};
 const director=createArtDirector({manifest:{overrides:[]},fingerprints,baseAssets:{}});
 const original={...cue,cg:'old',cutscene:{frames:[{cg:'old'},{cg:'old-second'}]}};
 director.preview(cg);const changed=director.cue(original,chapter,1);assert.equal(changed.cg,'studio_cut');assert.equal(changed.cutscene.frames,undefined);assert.equal(changed.actors.length,0);
 director.preview(null);assert.equal(director.cue(original,chapter,1),original);
});
test('background application does not replace acting or change a source asset',()=>{
 const director=createArtDirector({manifest:{overrides:[{...row,target:{...target,slot:'background'}}]},fingerprints,baseAssets:{room:'original'}});
 const changed=director.cue(cue,chapter,1);assert.equal(changed.backgroundAsset,'studio_chosen');assert.deepEqual(changed.actors,cue.actors);assert.equal(director.assets.room,'original');
});
test('a studio cutscene retains its full-picture fit and bounded mobile composition',()=>{
 const director=createArtDirector({manifest:{overrides:[{...row,target:{...target,slot:'cg',fit:'contain',positionX:15,positionY:70}}]},fingerprints,baseAssets:{}});
 const changed=director.cue(cue,chapter,1);assert.equal(changed.cutscene.fit,'contain');assert.equal(changed.cutscene.position,'15% 70%');
});
test('preview storage is isolated from the player and from the next preview',()=>{
 const first=createPreviewStorage(),second=createPreviewStorage();first.setItem('player-save','preview');assert.equal(first.getItem('player-save'),'preview');assert.equal(second.getItem('player-save'),null);
});
test('candidate URLs cannot escape the studio or execute CSS / remote content',()=>{
 assert.equal(safeArtPath('assets/studio/abcd.webp'),true);assert.equal(safeArtPath('/candidates/abcd.png'),true);
 for(const value of ['https://example.org/image.png','assets/studio/../private.png','/candidates/a.png")',"/candidates/\\secret.png",'javascript:alert(1)'])assert.equal(safeArtPath(value),false);
});
