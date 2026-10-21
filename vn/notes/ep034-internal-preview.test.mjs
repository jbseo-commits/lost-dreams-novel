import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const read=relative=>readFile(new URL(relative,import.meta.url),'utf8');

test('34 review is isolated from the public demo entrypoint',async()=>{
 const [html,app,entry]=await Promise.all([
   read('./ep034-internal-preview.html'),
   read('../app.js'),
   read('../index.html')
 ]);
 assert.match(html,/noindex,nofollow/);
 assert.match(html,/34화/);
 assert.match(html,/SettlementSceneStage,settlementForBeat/);
 assert.match(html,/story-data.js/);
 assert.doesNotMatch(entry,/settlement-scene|ep034-internal-preview/);
 assert.doesNotMatch(app,/settlement-scene|ep034-internal-preview/);
 assert.match(app,/const demoMode=true;/);
});

test('34 review reuses existing actors without inventing an Oh Hajun face',async()=>{
 const html=await read('./ep034-internal-preview.html');
 assert.match(html,/assets\/seoin\.webp/);
 assert.match(html,/assets\/yoonha\.webp/);
 assert.doesNotMatch(html,/assets\/(?:ohajun|hajun)\.(?:webp|png)/);
 assert.match(html,/story-cast/);
 assert.match(html,/dataset\.room=cue\?\.room/);
 for(const path of ['../assets/seoin.webp','../assets/yoonha.webp','../assets/ep34/bg-external-conference-morning.svg','../assets/ep34/bg-refund-office-afternoon.svg']) {
  await access(new URL(path,import.meta.url));
 }
});

test('touch controls and information overlays are nonblocking',async()=>{
 const [html,css]=await Promise.all([read('./ep034-internal-preview.html'),read('../settlement-scene.css')]);
 assert.match(html,/id="previous"/);
 assert.match(html,/id="next"/);
 assert.match(html,/id="hide"/);
 assert.match(html,/story-cast\{[^}]*pointer-events:none/);
 assert.match(css,/settlement-story-stage\{[^}]*pointer-events:none/);
 assert.match(css,/settlement-panel\[hidden\]\{display:none!important\}/);
});
