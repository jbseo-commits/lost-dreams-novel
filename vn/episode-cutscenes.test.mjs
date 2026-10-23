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

test('53 event inserts cover the original 30 chapters plus the authorized 19–22 interludes and exact source actions',()=>{
  assert.equal(EPISODE_CUTSCENES.length,53);
  assert.deepEqual([...new Set(EPISODE_CUTSCENES.map(c=>c.chapter))],Array.from({length:30},(_,i)=>String(i+1)).concat(['19-1','20-1','21-1','22-1']));
  for(const cut of EPISODE_CUTSCENES){
    assert.equal(chapter(cut.chapter).beats[cut.start].text,cut.anchor);
    for(let i=cut.start;i<=cut.end;i++){
      const cue=at(cut.chapter,i);assert.ok(cue.cutscene.frames.some(frame=>frame.cg===cut.cg));assert.deepEqual(cue.actors,[]);assert.equal(cue.wallAd,false);assert.ok(cue.cutscene.alt);
    }
    for(const i of [cut.start-1,cut.end+1])assert.notEqual(at(cut.chapter,i)?.cg,cut.cg);
    const changed=structuredClone(chapter(cut.chapter));changed.beats[cut.start].text='다른 행동';
    const original={cg:null};assert.equal(withEpisodeCutscene(original,changed,cut.start),original);
    const changedEnd=structuredClone(chapter(cut.chapter));changedEnd.beats[cut.end].text='다른 끝';assert.equal(withEpisodeCutscene(original,changedEnd,cut.start),original);
  }
});
test('B preview is placed at beat 46 with exact fingerprint and native image copy',async()=>{
 const cut=EPISODE_CUTSCENES.find(c=>c.cg==='ep19-b-preview');assert.ok(cut);assert.equal(cut.chapter,'19');assert.equal(cut.start,46);assert.equal(cut.end,46);
 assert.equal(chapter('19').beats[46].text,'새벽 3시의 주택가. 창문 2,400개에 한꺼번에 불이 들어왔다.');assert.equal(at('19',46).cg,'ep19-b-preview');
 assert.equal(EP1_ASSETS['ep19-b-preview'],'assets/sequence19-22/ep19-b-preview-vn.webp');
 const vn=await readFile(new URL('./assets/sequence19-22/ep19-b-preview-vn.webp',import.meta.url));
 assert.equal(createHash('sha256').update(vn).digest('hex'),'f2c1111bb56928603d1f0952e93ecb7ad25564f0d6b77a4f0522b11eb9cdb979');
 const manifest=JSON.parse(await readFile(new URL('../planning/ep019-022-sequence-20261023/provenance.json',import.meta.url)));const record=manifest.assets.find(a=>a.id==='ep19-b-preview'&&a.format==='vn');assert.deepEqual(record.encodedDimensions,[1536,1024]);assert.equal(record.resizedOrCropped,false);assert.equal(record.bytes,vn.length);
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
  for(const c of box.window.STORY.chapters.filter(c=>c.id.includes('-')&&!['19-1','20-1','21-1','22-1'].includes(c.id)))for(let i=0;i<c.beats.length;i++)assert.equal(eventCutsceneDirection(c,i),null);
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
  const sequence=JSON.parse(await readFile(new URL('../planning/ep019-022-sequence-20261023/provenance.json',import.meta.url),'utf8'));
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
    }else if(path?.startsWith('assets/sequence19-22/')){
      assert.equal(path,`assets/sequence19-22/${cut.cg}-vn.webp`);
      const asset=sequence.assets.find(item=>item.id===cut.cg&&item.format==='vn');assert.ok(asset,cut.cg);
      if(cut.cg==='ep19-b-preview') assert.equal(asset.encodedDimensions.join('x'),'1536x1024');
      else {assert.ok(!ids.has(asset.sha256),cut.cg);ids.add(asset.sha256);}
      const bytes=await readFile(new URL('./'+path,import.meta.url));
      assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);assert.equal(bytes.length,asset.bytes);
      assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');
    }else assert.ok(path?.startsWith('assets/cutscenes/'),cut.cg);
  }
  for(const id of [...new Set(EPISODE_CUTSCENES.filter(c=>/^(19|20|21|22)/.test(c.chapter)).map(c=>c.cg).filter(c=>c.startsWith('ep')&&c!=='ep19-b-preview'))]){
    const asset=sequence.assets.find(item=>item.id===id&&item.format==='web');assert.ok(asset,id);
    if(id!=='ep19-b-preview'){assert.ok(!ids.has(asset.sha256),id);ids.add(asset.sha256);}
    const bytes=await readFile(new URL('../assets/sequence19-22/'+id+'-web.webp',import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);assert.equal(bytes.length,asset.bytes);
    assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');
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
    assert.equal(cue.cutscene.id,'jiwooClaySmile');
    assert.equal(cue.sceneStart,start);
    assert.equal(cue.cg,'jiwooClaySmile');
    assert.equal(EP1_ASSETS[cue.cg],'assets/cutscenes/ep03-jiwoo-clay-smile.webp');
  }
  assert.notEqual(at('3',start+3)?.cutscene?.id,'jiwooClaySmile');
  const edited=structuredClone(c);edited.beats[start+1].text='다른 묘사';
  assert.equal(withEpisodeCutscene(null,edited,start),null);
});

test('episode 3 gaze -> small dirt under nails -> can toast uses distinct CG in source order',()=>{
  const c=chapter('3'),start=c.beats.findIndex(b=>b.text==='그날 둘은 편의점 앞에서 맥주를 마셨다.');
  const nails=c.beats.findIndex(b=>b.text==='지우의 손톱 밑에는 씻어도 빠지지 않은 흙이 조금 남아 있었다.');
  const toast=c.beats.findIndex(b=>b.text==='서인은 그걸 보다가 자기 캔을 지우의 캔에 가볍게 부딪쳤다.');
  assert.ok(start>=0);assert.equal(nails,start+10);assert.equal(toast,nails+1);
  assert.notEqual(at('3',start-1)?.cutscene?.id,'convenienceGaze');
  for(let i=start;i<nails;i++){
    const cue=at('3',i);
    assert.equal(cue.cg,'convenienceGaze');
    assert.equal(cue.sceneStart,start);
    assert.ok(cue.cutscene.alt.includes('편의점'));
  }
  assert.equal(at('3',nails).cg,'clayUnderNails');
  assert.equal(at('3',nails).sceneStart,nails);
  assert.equal(at('3',toast).cg,'convenienceToast');
  assert.equal(at('3',toast).sceneStart,toast);
  assert.notEqual(at('3',toast+1)?.cg,'convenienceToast');
  for(const id of ['convenienceGaze','clayUnderNails','convenienceToast'])assert.ok(EP1_ASSETS[id].endsWith('.webp'));
  assert.equal(EP1_ASSETS.clayUnderNails,'assets/cutscenes/ep03-clay-under-nails-washed.webp');

  // Altering the detail text invalidates the entire insert instead of drifting.
  const changed=structuredClone(c);changed.beats[nails].text='흙은 없었다.';
  assert.equal(withEpisodeCutscene(null,changed,nails),null);
  assert.equal(withEpisodeCutscene(null,changed,toast),null);
});
