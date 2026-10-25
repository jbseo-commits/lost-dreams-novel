// Read-only verification of the local production runtime; does not modify a project or submit a job.
import assert from 'node:assert/strict';
const base='http://127.0.0.1:4321';
async function read(path){const response=await fetch(base+path);assert.equal(response.status,200,`${path} HTTP ${response.status}`);return response.text();}
const bootstrap=JSON.parse(await read('/api/bootstrap'));
assert.equal(bootstrap.baseballPreview.available,true);
const app=await read('/baseball-game/src/duel/App.jsx');
assert.ok(app.includes('redRushBatterShot(presentationFor(chosen.state)'));
assert.ok(app.includes('redRushTimeline(presentationTimeline(shot'));
const css=await read('/baseball-game/src/duel/duel.css');assert.ok(css.includes('.cinema-lab-stage .batter-sheet-frame'));
const module=await read('/baseball-game/src/duel/batter-v15.js');
const project=JSON.parse(await read('/api/project?project=baseball'));
const row=project.overrides.find(item=>item.target.assetId==='batter-runtime');
if(row)assert.ok(module.includes(row.asset),'the exact selected candidate URL reaches the game module');
const vn=JSON.parse(await read('/api/project?project=vn'));
const jobs=JSON.parse(await read('/api/jobs')).jobs;
console.log(JSON.stringify({baseballPreview:true,productionPitchTiming:true,selectedBatterOverrideVerified:Boolean(row),vnChapters:vn.chapters.length,publicRange:'1–11 plus 7 interludes',successfulGenerationJobs:jobs.filter(job=>job.status==='completed').length,vnApplied:vn.overrides.length,baseballApplied:project.overrides.length}));
