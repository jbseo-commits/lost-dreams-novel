import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
import {EP1_ASSETS} from './ep1-assets.js';
import {EPISODE_CUTSCENES} from './episode-cutscenes.js';
import {GENERATED_EPISODE_CUTSCENES} from './episode-generated-cutscenes.js';

const json=async path=>JSON.parse(await readFile(new URL(path,import.meta.url),'utf8'));
const cardsDoc=await json('../planning/vn-all-episode-events-20261023/source-cards.json');
const manifest=await json('../planning/vn-all-episode-events-20261023/event-manifest.json');
const sandbox={window:{}};
const storySource=await readFile(new URL('./story-data.js',import.meta.url),'utf8');
vm.runInNewContext(storySource,sandbox);
const story=sandbox.window.STORY;
const chapter=id=>story.chapters.find(item=>item.id===String(id));
function fingerprint(text){let hash=2166136261;for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619)>>>0;return hash.toString(16);}

test('all 92 event cards still match the pinned story source and selected beat fingerprint',()=>{
  const digest=createHash('sha256').update(storySource).digest('hex');
  assert.equal(digest,cardsDoc.storyDataSha256);
  assert.equal(digest,manifest.storyDataSha256);
  assert.equal(cardsDoc.cards.length,92);
  assert.equal(manifest.records.length,92);
  assert.equal(new Set(manifest.records.map(record=>record.id)).size,92);
  assert.equal(new Set(manifest.records.map(record=>`${record.chapterId}:${record.selectedBeat}`)).size,92);
  const cards=new Map(cardsDoc.cards.map(card=>[String(card.chapterId),card]));
  for(const record of manifest.records){
    const card=cards.get(record.chapterId),source=chapter(record.chapterId),selected=source?.beats[record.selectedBeat];
    assert.ok(card,record.id);assert.ok(selected,record.id);
    assert.equal(source.beats[card.anchor.beatIndex]?.text,card.anchor.text,`${record.id} research anchor`);
    assert.equal(fingerprint(card.anchor.text),card.anchor.fingerprint,`${record.id} research fingerprint`);
    assert.equal(selected.text,record.anchor,`${record.id} selected source beat`);
    assert.equal(fingerprint(selected.text),record.fingerprint,`${record.id} selected fingerprint`);
    assert.equal(record.internalDraft,Boolean(card.internalDraft),`${record.id} internal draft status`);
    assert.equal(record.held,Boolean(card.held||false),`${record.id} held status`);
  }
  assert.deepEqual(manifest.records.filter(record=>record.held).map(record=>record.chapterId).sort(),['86','87','88','89','90']);
});

test('only image-accepted entries may enter the generated event map and asset registry',async()=>{
  const accepted=manifest.records.filter(record=>record.generationStatus==='accepted');
  assert.equal(manifest.acceptedRuntimeAssets,accepted.length);
  assert.equal(GENERATED_EPISODE_CUTSCENES.length,accepted.length);
  assert.equal(EPISODE_CUTSCENES.length,56+accepted.length);
  for(const record of manifest.records.filter(item=>item.generationStatus!=='accepted')){
    assert.equal(GENERATED_EPISODE_CUTSCENES.some(cut=>cut.cg===record.id),false,`${record.id} is not accepted`);
    assert.equal(Object.hasOwn(EP1_ASSETS,record.id),false,`${record.id} has no runtime asset path`);
    assert.equal(record.runtimeAsset,null,`${record.id} has no runtime file`);
  }
  for(const record of accepted){
    const cut=GENERATED_EPISODE_CUTSCENES.find(item=>item.cg===record.id);
    assert.ok(cut,record.id);assert.equal(cut.chapter,record.chapterId);assert.equal(cut.start,record.selectedBeat);
    assert.equal(cut.end,record.selectedBeat);assert.equal(cut.anchor,record.anchor);assert.equal(cut.fingerprint,record.fingerprint);
    assert.equal(EP1_ASSETS[record.id],record.runtimeAsset);
    const bytes=await readFile(new URL(`./${record.runtimeAsset}`,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),record.runtimeAssetSha256);
    assert.equal(bytes.subarray(0,4).toString(),'RIFF');assert.equal(bytes.subarray(8,12).toString(),'WEBP');
  }
});

test('held chapters and absent current-reader chapters remain outside runtime mapping',async()=>{
  const absent=cardsDoc.notInVn.map(item=>item.readerChapterId);
  assert.deepEqual(absent,['2-1','4-2','11-1']);
  assert.equal(GENERATED_EPISODE_CUTSCENES.some(cut=>['86','87','88','89','90',...absent].includes(cut.chapter)),false);
  assert.equal(cardsDoc.legacySourceMapping.length,3);
  assert.ok(cardsDoc.legacySourceMapping.every(item=>item.normalizedContentIdentical===false));
});
