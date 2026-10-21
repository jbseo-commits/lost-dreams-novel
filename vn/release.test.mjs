import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {buildPublicSite} from '../tools/build-vn-public.mjs';
import {RELEASE,DEMO_CHAPTER_IDS,publicDemoStory,canReadChapter,purchaseLink} from './release.js';
import {normalizeStory} from './state.js';
import {presentationForBeat} from './neural-cues.js';
const root=fileURLToPath(new URL('../',import.meta.url)),vn=path.join(root,'vn');
const box={window:{}};vm.runInNewContext(await fs.readFile(path.join(vn,'story-data.js'),'utf8'),box);
const full=JSON.parse(JSON.stringify(box.window.STORY));

test('every public entry uses the canonical demo and no query flag can select the full edition',async()=>{
 const app=await fs.readFile(path.join(vn,'app.js'),'utf8');
 assert.equal(publicDemoStory(full).chapters.length,18);assert.equal(full.chapters.length,128);
 for(const id of DEMO_CHAPTER_IDS)assert.ok(canReadChapter(id));
 for(const id of ['12','11-1','30','105','999','../12','full'])assert.equal(canReadChapter(id),false);
 assert.match(app,/const demoMode=true;/);assert.match(app,/if\(!canReadChapter\(chapterId\)\)\{openRelease\(true\);return;/);
 assert.match(app,/else if\(reviewChapter\)openRelease\(true\)/);
 assert.doesNotMatch(app,/본편 12화로|editionUrl\(|demo:!demoMode/);
 assert.match(app,/!document\.querySelector\('\.end-screen'\)\) renderBeat/);
});

test('unconfigured checkout shows a release notice and cannot create a fake purchase or unlock',()=>{
 assert.equal(purchaseLink(),null);assert.match(RELEASE.comingSoon,/출시를 준비/);
 for(const purchaseUrl of ['javascript:alert(1)','http://example.com','https://name:secret@example.com','broken'])assert.equal(purchaseLink({purchaseUrl}),null);
 assert.equal(purchaseLink({purchaseUrl:'https://example.com/store'}),'https://example.com/store');
 assert.match(RELEASE.endingBody,/9시간 8분/);assert.match(RELEASE.endingTitle,/여전히 서인일까/);
});

test('actual VN deployment and its single HTML contain only the demo text, cues and required media',async t=>{
 const tmpRoot=path.resolve(os.tmpdir()),out=await fs.mkdtemp(path.join(tmpRoot,'lost-dreams-public-test-'));
 assert.ok(path.resolve(out).startsWith(tmpRoot+path.sep));
 t.after(async()=>{const resolved=path.resolve(out);assert.ok(resolved.startsWith(tmpRoot+path.sep));await fs.rm(resolved,{recursive:true,force:true});});
 const report=await buildPublicSite(root,out,{copyRoot:false}),pub=path.join(out,'vn');
 const built={window:{}};vm.runInNewContext(await fs.readFile(path.join(pub,'story-data.js'),'utf8'),built);
 assert.deepEqual(built.window.STORY.chapters.map(c=>String(c.id)).join('|'),DEMO_CHAPTER_IDS.join('|'));
 assert.equal(report.sourceBeats,4242);assert.equal(report.paymentAuthentication,false);
 assert.equal(built.window.STORY.assets.jiwoo,'assets/teaser-style/jiwoo-relaxed.webp');
 assert.ok(!report.media.includes('assets/jiwoo.webp'));
 assert.equal(report.media.filter(m=>m.startsWith('assets/teaser-style/')).length,34);
 const parents=JSON.parse(await fs.readFile(path.join(vn,'assets/parent-style/provenance.json'),'utf8'));
 assert.equal(report.media.filter(m=>m.startsWith('assets/parent-style/')).length,10);
 for(const asset of parents.assets){
  assert.ok(report.media.includes(asset.file),asset.key);
  assert.ok(!report.media.includes(asset.original),asset.key+' legacy art excluded');
 }
 for(const c of built.window.STORY.chapters)assert.equal(JSON.stringify(c.beats),JSON.stringify(full.chapters.find(o=>o.id===c.id).beats));
 assert.ok(report.media.every(m=>!m.includes('court')&&!m.includes('settlement-hands')));
 assert.ok(!report.media.includes('assets/cutscenes/foodstall-contract.webp'));
 await assert.rejects(fs.access(path.join(pub,'notes','core-demo-qa.json')));
 await assert.rejects(fs.access(path.join(pub,'notes','cutscene-play-qa.json')));
 for(const name of ['cutscenes.html','direction-30.html','neural-30.html']){
  const text=await fs.readFile(path.join(pub,'notes',name),'utf8');assert.match(text,/공개 버전은 1~11화 무료 데모/);assert.doesNotMatch(text,/정산|하경|30화/);
 }
 const cueSource=await fs.readFile(path.join(pub,'neural-cues.js'),'utf8'),cueContext={};
 vm.runInNewContext(cueSource.replace(/^export\s+/gm,'')+'\n;globalThis.cue=presentationForBeat;globalThis.ids=Object.keys(AUTHORED);',cueContext);
 assert.ok(cueContext.ids.every(canReadChapter));
 for(const c of normalizeStory(built.window.STORY).chapters)for(let i=0;i<c.beats.length;i++)assert.equal(JSON.stringify(cueContext.cue(c,c.beats[i],i)),JSON.stringify(presentationForBeat(c,c.beats[i],i)),c.id+':'+i);
 const manifest=JSON.parse(await fs.readFile(path.join(pub,'play-offline.html.manifest.json'),'utf8'));
 assert.equal(manifest.storyChapters,18);assert.equal(manifest.externalScripts,false);assert.equal(manifest.externalStylesheets,false);
 const offlineBytes=await fs.readFile(path.join(pub,'play-offline.html'));
 assert.equal(offlineBytes.length,manifest.offlineBytes);assert.equal(createHash('sha256').update(offlineBytes).digest('hex'),manifest.sha256);
 assert.equal(offlineBytes.includes(Buffer.from('\r\n')),false);
 const allText=[];async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())await walk(p);else if(/\.(?:js|html|json|css)$/.test(p))allText.push((await fs.readFile(p,'utf8')).replace(/data:[\w/+.-]+;base64,[A-Za-z0-9+/=]+/g,''));}}await walk(pub);
 const text=allText.join('\n'),early=built.window.STORY.chapters.flatMap(c=>c.beats.map(b=>b.text)).join('\n');
 for(const c of full.chapters.filter(c=>!canReadChapter(c.id))){const probe=c.beats.map(b=>b.text).filter(s=>s.length>=35&&!early.includes(s)).sort((a,b)=>b.length-a.length)[0];if(probe){assert.ok(!text.includes(probe),'후속 본문 포함: '+c.id);assert.ok(!text.includes(JSON.stringify(probe).slice(1,-1)),'후속 JSON 본문 포함: '+c.id);}}
});
