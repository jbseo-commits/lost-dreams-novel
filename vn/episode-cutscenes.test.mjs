import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {EP1_ASSETS} from './ep1-assets.js';
import {EPISODE_CUTSCENES,withEpisodeCutscene,eventCutsceneDirection} from './episode-cutscenes.js';
import {episodeOneDirection} from './episode-one.js';
import {episodeTwoDirection} from './episode-two.js';
import {episodeOneReadingPage} from './episode-one-reading.js';
import {episodeTwoReadingPage} from './episode-two-reading.js';
const box={window:{}};vm.runInNewContext(await readFile(new URL('./story-data.js',import.meta.url),'utf8'),box);
const chapter=id=>box.window.STORY.chapters.find(c=>c.id===id);
const at=(id,i)=>id==='1'?episodeOneDirection(chapter(id),i):id==='2'?episodeTwoDirection(chapter(id),i):eventCutsceneDirection(chapter(id),i);

test('35 event inserts cover all 30 main chapters and stay inside their exact source actions',()=>{
  assert.equal(EPISODE_CUTSCENES.length,35);
  assert.deepEqual([...new Set(EPISODE_CUTSCENES.map(c=>c.chapter))],Array.from({length:30},(_,i)=>String(i+1)));
  for(const cut of EPISODE_CUTSCENES){
    assert.equal(chapter(cut.chapter).beats[cut.start].text,cut.anchor);
    for(let i=cut.start;i<=cut.end;i++){
      const cue=at(cut.chapter,i);assert.equal(cue.cg,cut.cg);assert.deepEqual(cue.actors,[]);assert.equal(cue.wallAd,false);assert.ok(cue.cutscene.alt);
    }
    for(const i of [cut.start-1,cut.end+1])assert.notEqual(at(cut.chapter,i)?.cg,cut.cg);
    const changed=structuredClone(chapter(cut.chapter));changed.beats[cut.start].text='다른 행동';
    const original={cg:null};assert.equal(withEpisodeCutscene(original,changed,cut.start),original);
    const changedEnd=structuredClone(chapter(cut.chapter));changedEnd.beats[cut.end].text='다른 끝';assert.equal(withEpisodeCutscene(original,changedEnd,cut.start),original);
  }
});
test('approval color, risks and separate press events follow source order without a new choice',()=>{
  assert.equal(at('1',122).cutscene.phase,'plain');assert.equal(at('1',122).cutscene.impact,122);
  assert.equal(at('1',123).cutscene.phase,'amber');assert.equal(at('1',123).document.showRisks,false);
  assert.equal(at('1',124).document.showRisks,true);assert.equal(at('1',125).cutscene.impact,125);
  assert.equal(at('1',126).cutscene.phase,'red');assert.equal(at('1',127).cg,null);
  for(let i=122;i<=126;i++)assert.ok(!chapter('1').beats[i].choice);
});
test('eye opening, the clay identity, pocketing and wake-to-smile keep their original order',()=>{
  for(let i=0;i<8;i++){assert.equal(at('1',i).intro,true);assert.equal(at('1',i).cg,null);}
  assert.equal(at('1',8).intro,false);assert.equal(at('1',8).cg,'neuralAwakening');
  assert.equal(chapter('2').beats[182].text,'“컵이래.”');assert.equal(at('2',193).cg,null);
  assert.equal(at('2',194).cg,'clayTurn');assert.equal(at('2',198).cg,null);
  assert.equal(at('2',271).cg,null);assert.equal(at('2',272).cg,'nightWake');assert.equal(at('2',275).cg,null);
  assert.equal(at('2',276).actors[0].asset,'seoinRelief');
  for(let i=232;i<=265;i++)assert.equal(at('2',i).cg,'dreamBeach');
  for(let i=256;i<263;i++){assert.equal(at('1',i).blackout,true);assert.equal(at('1',i).cg,null);}
});
test('reading never merges over an insert or its approval state and still covers every source beat',()=>{
  for(const id of ['1','2']){
    const c=chapter(id),seen=[];
    for(let i=0;i<c.beats.length;){
      const p=(id==='1'?episodeOneReadingPage:episodeTwoReadingPage)(c,i),first=at(id,i);
      for(const entry of p.entries){assert.equal(entry.text,c.beats[entry.index].text);assert.deepEqual(at(id,entry.index).cutscene,first.cutscene);seen.push(entry.index);}
      i=p.end+1;
    }
    assert.deepEqual(seen,Array.from({length:c.beats.length},(_,i)=>i));
  }
});
test('event-only cues leave the original later-chapter direction and sound contract untouched',()=>{
  for(const id of Array.from({length:28},(_,i)=>String(i+3))){
    const c=chapter(id),before=JSON.stringify(c);
    for(let i=0;i<c.beats.length;i++){const cue=eventCutsceneDirection(c,i);if(cue){assert.equal(cue.chapterId,id);assert.equal(cue.music,undefined);assert.equal(cue.ambience,undefined);assert.equal(cue.fx,undefined);}}
    assert.equal(JSON.stringify(c),before);
    for(const index of [-1,c.beats.length,1.5,undefined])assert.equal(eventCutsceneDirection(c,index),null);
  }
  for(const c of box.window.STORY.chapters.filter(c=>c.id.includes('-')))for(let i=0;i<c.beats.length;i++)assert.equal(eventCutsceneDirection(c,i),null);
});
test('every selected drawing is distinct, packaged, and matches its recorded production hash',async()=>{
  const ids=new Set();
  for(const filename of ['provenance.json','episode-3-30-provenance.json']){
    const manifest=JSON.parse(await readFile(new URL('./assets/cutscenes/'+filename,import.meta.url),'utf8'));
    for(const asset of manifest.assets){
      const bytes=await readFile(new URL('./assets/cutscenes/'+asset.file,import.meta.url));
      assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
      assert.equal(bytes.length,asset.bytes);assert.ok(!ids.has(asset.sha256));ids.add(asset.sha256);
    }
  }
  const teaser=JSON.parse(await readFile(new URL('./assets/teaser-style/provenance.json',import.meta.url),'utf8'));
  const parents=JSON.parse(await readFile(new URL('./assets/parent-style/provenance.json',import.meta.url),'utf8'));
  for(const cut of EPISODE_CUTSCENES){
    const path=EP1_ASSETS[cut.cg];
    if(path?.startsWith('assets/parent-style/')){
      const asset=parents.assets.find(item=>item.key===cut.cg);
      assert.ok(asset,cut.cg);assert.equal(path,asset.file);
      const bytes=await readFile(new URL('./'+path,import.meta.url));
      assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
      assert.equal(bytes.length,asset.bytes);
    }else if(path?.startsWith('assets/teaser-style/')){
      const asset=teaser.assets.find(item=>item.key===cut.cg);
      assert.ok(asset,cut.cg);assert.equal(path,'assets/teaser-style/'+asset.file);
      const bytes=await readFile(new URL('./'+path,import.meta.url));
      assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
      assert.equal(bytes.length,asset.bytes);
    }else assert.ok(path?.startsWith('assets/cutscenes/'),cut.cg);
  }
});

test('the dirty smiling Jiwoo shot follows the clay failure, respects exact anchors and does not alter manuscript',()=>{
  const c=chapter('3');
  const start=c.beats.findIndex(b=>b.text==='광고꿈에서 본 지우보다 훨씬 엉망인 얼굴이었다.');
  assert.ok(start>60);
  assert.equal(c.beats[start+1].text,'머리는 땀에 붙었고, 볼에는 흙이 묻었고, 앞치마는 엉망이었다.');
  assert.equal(c.beats[start+2].text,'그런데 지우는 계속 웃었다.');
  assert.notEqual(at('3',start-1)?.cutscene?.id,'jiwooClaySmile');
  for(let i=start;i<=start+2;i++){
    const cue=at('3',i);
    assert.equal(cue.cutscene.id,'jiwooClaySmile');
    assert.equal(cue.cutscene.composite,'dirty-jiwoo');
    assert.equal(cue.sceneStart,start);
    assert.equal(cue.cg,'jiwooRelaxed');
  }
  assert.notEqual(at('3',start+3)?.cutscene?.id,'jiwooClaySmile');
  const edited=structuredClone(c);edited.beats[start+1].text='다른 묘사';
  assert.equal(withEpisodeCutscene(null,edited,start),null);
});
