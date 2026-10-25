import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createVnCatalog, createBaseballCatalog, safePath, sha } from './catalog.mjs';
import { readJson, writeJsonAtomic } from './store.mjs';
import { createGenerator } from './generation.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIME = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp3':'audio/mpeg','.wav':'audio/wav','.mp4':'video/mp4' };
const MAX_BODY = 25 * 1024 * 1024;
const err = (message,status=400) => Object.assign(new Error(message),{status});
const clone = v => structuredClone(v);

export function createStudioServer(options = {}) {
  const root = path.resolve(options.root || path.resolve(__dirname,'../..'));
  const vnRoot = path.resolve(options.vnRoot || path.join(root,'vn'));
  const baseballRoot = path.resolve(options.baseballRoot || process.env.BASEBALL_PROJECT_ROOT || path.resolve(root,'../9-baseball-integrate'));
  const stateDir = path.resolve(options.stateDir || path.join(root,'.art-studio'));
  const port = options.port ?? 4321;
  const gen = createGenerator({ root, pythonPath:options.pythonPath, skillPath:options.skillPath, onComplete: async (candidate,jobId) => {
    await mutate(async()=>{const file=path.join(stateDir,'state.json'),state=await readJson(file,emptyState());candidate.jobId=jobId;state.candidates.push(candidate); const j=state.jobs.find(x=>x.id===jobId); if(j){j.status='completed';j.candidateId=candidate.id;j.completedAt=new Date().toISOString();} await writeJsonAtomic(file,state);});
  }});
  let catalogCache = null;
  let recoveredJobs = false;
  let mutationTail=Promise.resolve();
  const mutate=fn=>{const result=mutationTail.then(fn,fn);mutationTail=result.catch(()=>{});return result;};
  let baseballPreview = null;
  let baseballOverridesCache = [];
  let baseballTemporary = [];
  let previewInit = null;
  async function ensureBaseballPreview() {
    if(!previewInit) previewInit=(async()=>{
      try {
        const { createBaseballPreview } = await import('./baseball-preview.mjs');
        const manifest=await readJson(path.join(stateDir,'baseball-direction.json'),{version:1,overrides:[]});
        baseballOverridesCache=manifest.overrides||[];
        baseballPreview=await createBaseballPreview({root:baseballRoot,stateDir,getOverrides:()=>[...baseballOverridesCache,...baseballTemporary]});
      } catch(e) { baseballPreview={available:false,detail:`Baseball preview unavailable: ${String(e.message).slice(0,160)}`}; }
      return baseballPreview;
    })();
    return previewInit;
  }
  async function catalogs() {
    if (!catalogCache) catalogCache = Promise.all([createVnCatalog(root),createBaseballCatalog(baseballRoot)]);
    return catalogCache;
  }
  async function refresh() { catalogCache = null; return catalogs(); }
  async function stateRead() {
    const file=path.join(stateDir,'state.json'),s=await readJson(file,emptyState());
    if(!recoveredJobs){recoveredJobs=true;let changed=false;for(const job of s.jobs)if(job.status==='running'){job.status='interrupted';job.error='Server restarted before this job completed.';job.completedAt=new Date().toISOString();changed=true;}if(changed)await writeJsonAtomic(file,s);}
    return s;
  }
  async function saveState(state) { await writeJsonAtomic(path.join(stateDir,'state.json'),state); }
  async function projectState(id) {
    const [vn, baseball] = await catalogs(), base=id==='vn'?vn:id==='baseball'?baseball:null;
    if (!base) throw err('Unknown project',404);
    const state=await stateRead();
    const manifest=await readJson(path.join(stateDir,id==='vn'?'art-direction.json':'baseball-direction.json'),{version:1,overrides:[]});
    const candidates=state.candidates.filter(x=>x.project===id);
    const references={...base.references,...(state.references[id]||{})};
    return { ...base,candidates,overrides:manifest.overrides||[],history:state.history.filter(x=>x.project===id),references };
  }
  const server=http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff'); res.setHeader('Referrer-Policy','no-referrer');
    try {
      const host=req.headers.host;
      if (!host || !/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host)) throw err('Host is not allowed',403);
      const url=new URL(req.url,'http://localhost');
      if(req.method==='OPTIONS') { res.writeHead(405); return res.end(); }
      if(url.pathname.startsWith('/baseball-game/')) {
        if(!['GET','HEAD'].includes(req.method))return json(res,405,{error:'Game preview is read only'});
        if(url.pathname.startsWith('/baseball-game/__'))return json(res,404,{error:'Not found'});
        const preview=await ensureBaseballPreview();
        if(preview?.middleware) return preview.middleware(req,res,()=>json(res,404,{error:'Baseball preview route not found'}));
        return json(res,503,{error:preview?.detail||'Baseball preview unavailable'});
      }
      if(['POST','PUT','PATCH','DELETE'].includes(req.method)) validateMutation(req,host);
      if(req.method==='GET'&&url.pathname==='/api/bootstrap') {
        const [vn,baseball]=await catalogs(); const provider=await providerStatus(),preview=await ensureBaseballPreview();
        return json(res,200,{projects:[{id:'vn',name:vn.name},{id:'baseball',name:baseball.name}],provider,baseballPreview:{available:Boolean(preview?.available),url:preview?.available?'/baseball-game/':'',detail:preview?.detail||'Preview unavailable'}});
      }
      if(req.method==='GET'&&url.pathname==='/api/project') return json(res,200,await projectState(url.searchParams.get('project')));
      if(req.method==='GET'&&url.pathname==='/api/jobs') { const s=await stateRead(); return json(res,200,{jobs:s.jobs}); }
      if(req.method==='GET'&&url.pathname==='/api/export') {
        const id=url.searchParams.get('project'); const project=await projectState(id);
        return json(res,200,{version:1,project:id,exportedAt:new Date().toISOString(),references:project.references,sourceFingerprints:project.fingerprints,candidates:project.candidates,manifest:{version:1,overrides:project.overrides},history:project.history});
      }
      if(req.method==='POST'&&url.pathname==='/api/candidate') return json(res,201,await mutate(async()=>registerCandidate(await body(req))));
      if(req.method==='POST'&&url.pathname==='/api/import') return json(res,201,await mutate(async()=>importImage(await body(req))));
      if(req.method==='POST'&&url.pathname==='/api/review') return json(res,200,await mutate(async()=>review(await body(req))));
      if(req.method==='POST'&&url.pathname==='/api/reference') return json(res,200,await mutate(async()=>lockReference(await body(req))));
      if(req.method==='POST'&&url.pathname==='/api/prompt') return json(res,200,await mutate(async()=>promptFor(await body(req))));
      if(req.method==='POST'&&url.pathname==='/api/generate') return json(res,202,await mutate(async()=>generate(await body(req))));
      if(req.method==='POST'&&url.pathname==='/api/apply') return json(res,200,await mutate(async()=>apply(await body(req))));
      if(req.method==='POST'&&url.pathname==='/api/undo') return json(res,200,await mutate(async()=>undo(await body(req))));
      if(req.method==='POST'&&url.pathname==='/api/baseball-preview') return json(res,200,await mutate(async()=>temporaryBaseball(await body(req))));
      if(req.method==='GET'&&url.pathname.startsWith('/candidates/')) return await serveCandidate(url.pathname,res);
      if(req.method==='GET'&&url.pathname.startsWith('/media/vn/')) return await serveMedia(vnRoot,url.pathname.slice('/media/vn/'.length),res);
      if(req.method==='GET'&&url.pathname.startsWith('/media/baseball/')) return await serveMedia(baseballRoot,url.pathname.slice('/media/baseball/'.length),res);
      if(req.method==='GET'&&url.pathname.startsWith('/vn/')) return await serveVnStatic(url.pathname.slice('/vn/'.length),res);
      if(req.method==='GET'&&(url.pathname==='/'||url.pathname==='/studio.css'||url.pathname==='/app.js')) {
        const leaf=url.pathname==='/'?'index.html':url.pathname.slice(1); return await serveStaticFile(path.resolve(__dirname),leaf,res);
      }
      return json(res,404,{error:'Not found'});
    } catch(e) { return json(res,e.status||500,{error:String(e.message||'Internal error').slice(0,500)}); }
  });

  async function registerCandidate(input) {
    const project=input.project; const cat=await projectState(project); const asset=cat.assets.find(a=>a.id===input.assetId); if(!asset)throw err('Asset not found in project',404);
    if(!cat.subjects.some(s=>s.id===input.subject)) throw err('Subject does not belong to project');
    if(!['actor','cg','background','atlas'].includes(input.kind)) throw err('Invalid candidate kind');
    if(asset.kind!==input.kind)throw err('Candidate kind must match the selected asset');
    if(input.kind==='actor'&&asset.subject!==input.subject)throw err('Actor asset belongs to another subject',409);
    const candidate={id:`candidate-${crypto.randomUUID()}`,project,assetId:asset.id,label:String(input.label||asset.label).slice(0,160),subject:input.subject,kind:input.kind,url:asset.url,sourcePath:asset.sourcePath,sha256:asset.sha256,width:asset.width,height:asset.height,status:'draft',checks:{identity:false,style:false,anatomy:false,scene:false},note:'',createdAt:new Date().toISOString()};
    const s=await stateRead(); s.candidates.push(candidate); await saveState(s); return candidate;
  }
  async function importImage(input) {
    const cat=await projectState(input.project); if(!cat.subjects.some(s=>s.id===input.subject))throw err('Subject does not belong to project');
    if(!['actor','cg','background','atlas'].includes(input.kind))throw err('Invalid image kind');
    if(typeof input.dataUrl!=='string')throw err('Expected a data URL');
    const m=input.dataUrl.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/); if(!m)throw err('Only PNG, JPEG and WebP imports are accepted');
    const data=Buffer.from(m[2],'base64'); if(data.length>20*1024*1024||data.length<16)throw err('Image size is invalid');
    const meta=await inspectImage(data); if(!meta)throw err('Image is invalid or unsupported');
    const expectedFormat={png:'PNG',jpeg:'JPEG',webp:'WEBP'}[m[1]];if(meta.format!==expectedFormat)throw err('Image MIME type does not match its file content');
    const ext={png:'png',jpeg:'jpg',webp:'webp'}[m[1]],id=`import-${crypto.randomUUID()}`,dir=path.join(stateDir,'imports'); await fs.mkdir(dir,{recursive:true}); await fs.writeFile(path.join(dir,`${id}.${ext}`),data,{flag:'wx'});
    const item={id,project:input.project,assetId:null,label:String(input.label||id).slice(0,160),subject:input.subject,kind:input.kind,url:`/candidates/${id}.${ext}`,sourcePath:`.art-studio/imports/${id}.${ext}`,sha256:sha(data),width:meta.width,height:meta.height,status:'draft',checks:{identity:false,style:false,anatomy:false,scene:false},note:'',createdAt:new Date().toISOString()};
    const s=await stateRead();s.candidates.push(item);await saveState(s);return item;
  }
  async function review(input) {
    const s=await stateRead(), c=s.candidates.find(x=>x.project===input.project&&x.id===input.id); if(!c)throw err('Candidate not found',404);
    if(!['approved','rejected','draft'].includes(input.status))throw err('Invalid review status');
    const checks=input.checks||{}; const keys=['identity','style','anatomy','scene']; if(keys.some(k=>typeof checks[k]!=='boolean'))throw err('Review must include four boolean checks');
    if(input.status==='approved'&&keys.some(k=>!checks[k]))throw err('All four checks must pass before approval');
    c.status=input.status;c.checks=Object.fromEntries(keys.map(k=>[k,checks[k]]));c.note=String(input.note||'').slice(0,2000);c.reviewedAt=new Date().toISOString();await saveState(s);return c;
  }
  async function lockReference(input) {
    const cat=await projectState(input.project),subject=cat.subjects.find(x=>x.id===input.subject),asset=cat.assets.find(x=>x.id===input.assetId);
    if(!subject||!asset)throw err('Subject or reference asset not found',404);
    if(asset.subject!==input.subject||asset.kind!=='actor')throw err('Choose an actor reference for this subject',409);
    const full=safePath(input.project==='vn'?vnRoot:baseballRoot,asset.sourcePath),current=sha(await fs.readFile(full)); if(current!==asset.sha256)throw err('Reference asset changed on disk',409);
    const s=await stateRead();s.references[input.project]??={};s.references[input.project][input.subject]={assetId:asset.id,sha256:current,lockedAt:new Date().toISOString()};await saveState(s);return s.references[input.project][input.subject];
  }
  async function promptFor(input) {
    if(!['vn','baseball'].includes(input.project))throw err('Unknown project',400);
    const cat=await projectState(input.project),subject=cat.subjects.find(x=>x.id===input.subject); if(!subject)throw err('Subject not found',404);
    const requested=[...new Set(Array.isArray(input.referenceSubjects)?input.referenceSubjects:[input.subject])];
    if(!requested.includes(input.subject))requested.unshift(input.subject);
    if(requested.length>6)throw err('Use up to six canonical character references');
    const assetRoot=input.project==='vn'?vnRoot:baseballRoot,references=[];
    for(const id of requested){
      const person=cat.subjects.find(x=>x.id===id),ref=cat.references[id];if(!person||!ref)throw err(`Reference subject not found: ${id}`,404);
      const asset=cat.assets.find(x=>x.id===ref.assetId);if(!asset||asset.sha256!==ref.sha256)throw err(`Locked reference is no longer available: ${id}`,409);
      const full=safePath(assetRoot,asset.sourcePath);if(sha(await fs.readFile(full))!==ref.sha256)throw err(`Locked reference changed on disk: ${id}`,409);
      references.push({subject:id,name:person.name,assetId:asset.id,sha256:ref.sha256,path:full});
    }
    const ref=references[0],referenceSubjects=references.map(({subject,name})=>({id:subject,name}));
    const { buildPrompt }=await import('./generation.mjs');return {prompt:buildPrompt({...input,subjectName:subject.name,referenceSubjects},ref.path),reference:{assetId:ref.assetId,sha256:ref.sha256,path:ref.path},references};
  }
  async function generate(input) {
    if(input.provider!=='codex')throw err('Only the explicit Codex provider is supported',400);
    if(input.accessConfirmed!==true)throw err('Confirm Codex subscription access before generation',400);
    const prompt=await promptFor(input),cat=await projectState(input.project),subject=cat.subjects.find(x=>x.id===input.subject);
    if(!['actor','cg','background'].includes(input.kind))throw err('동작 시트는 기존 스프라이트 파이프라인에서 추출·정렬한 결과를 가져오세요.');
    const id=`job-${crypto.randomUUID()}`,job={id,project:input.project,status:'running',startedAt:new Date().toISOString(),label:String(input.label||'').slice(0,160)};
    const s=await stateRead();if(s.jobs.some(x=>x.status==='running'))throw err('A generation job is already running',409);s.jobs.push(job);await saveState(s);
    gen.generate({...job},input,subject,{...prompt.reference,references:prompt.references},prompt.reference.path,path.join(stateDir,'state.json')).then(candidate=>mutate(async()=>{candidate.jobId=id;const state=await stateRead();const c=state.candidates.find(x=>x.id===candidate.id);if(c)c.jobId=id;await saveState(state);})).catch(e=>mutate(async()=>{const state=await stateRead();const j=state.jobs.find(x=>x.id===id);if(j){j.status='failed';j.error=String(e.message).slice(0,500);j.completedAt=new Date().toISOString();}await saveState(state);}));
    return {job};
  }
  async function apply(input) {
    await refresh();
    if(input.project==='baseball') return applyBaseball(input);
    if(input.project!=='vn')throw err('Unknown project');
    const cat=await projectState('vn'),candidate=cat.candidates.find(x=>x.id===input.candidateId); if(!candidate||candidate.status!=='approved')throw err('Candidate must be approved in this project',409);
    const {target}=input;if(!target||!['actor','cg','background'].includes(target.slot))throw err('Invalid target slot');
    if(candidate.kind!==target.slot)throw err('Candidate type does not match the selected scene slot',409);
    if(target.slot!==candidate.kind)throw err('Candidate kind must match the selected art slot');
    const chapter=cat.chapters.find(c=>c.id===target.chapterId);if(!chapter)throw err('Chapter not found',404);
    const fp=cat.fingerprints[chapter.id];if(target.fingerprint!==fp)throw err('Chapter fingerprint changed',409);
    if(!Number.isInteger(target.start)||!Number.isInteger(target.end)||target.start<0||target.end<target.start||target.end>=chapter.beats.length)throw err('Invalid beat range');
    const anchor=chapter.beats[target.start]?.text,endAnchor=chapter.beats[target.end]?.text;
    if(target.anchor!==anchor||target.endAnchor!==endAnchor)throw err('Beat anchors no longer match',409);
    if(target.slot==='actor'){
      if(typeof target.actorId!=='string'||!/^[a-z0-9-]{1,40}$/i.test(target.actorId))throw err('Invalid actor id');
      if(!['left','right','center'].includes(target.side))throw err('Invalid actor side');
      if(!['left','right','down','aside','screen','up','front'].includes(target.gaze))throw err('Invalid actor gaze');
      if(!['standing','seated','lean','withdrawn','reclining','ready','load','contact','release','follow-through'].includes(target.pose))throw err('Invalid actor pose');
      if(!Number.isFinite(target.scale)||target.scale<.5||target.scale>1.7||![target.offsetX,target.offsetY].every(x=>Number.isFinite(x)&&x>=-30&&x<=30))throw err('Invalid actor transform');
    }
    if(candidate.subject!==target.actorId&&target.slot==='actor')throw err('Actor target subject does not match candidate',409);
    const ref=cat.references[candidate.subject];if(!ref||ref.sha256!==referenceHash(cat,candidate.subject))throw err('Lock the current canonical reference before applying',409);
    if(candidate.referenceSha256&&candidate.referenceSha256!==ref.sha256)throw err('Candidate was generated against a different reference lock',409);
    for(const lock of candidate.referenceLocks||[]){const current=cat.references[lock.subject],file=cat.assets.find(a=>a.id===lock.assetId);if(!current||current.sha256!==lock.sha256||!file||sha(await fs.readFile(safePath(vnRoot,file.sourcePath)))!==lock.sha256)throw err('A locked generation reference changed before apply',409);}
    const referenceAsset=cat.assets.find(x=>x.id===ref.assetId);if(!referenceAsset||sha(await fs.readFile(safePath(vnRoot,referenceAsset.sourcePath)))!==ref.sha256)throw err('Locked reference changed on disk',409);
    const same=candidate.project==='vn'&&cat.candidates.find(x=>x.id===candidate.id);if(!same)throw err('Candidate project mismatch',409);
    const manifestFile=path.join(stateDir,'art-direction.json'),manifest=await readJson(manifestFile,{version:1,overrides:[]});
    const conflict=manifest.overrides.find(x=>overlaps(x.target,target));if(conflict)throw err('This scene slot already has an applied override; undo it first',409);
    const data=await candidateBytes(candidate),extension=candidate.url.match(/\.([a-z0-9]+)$/i)?.[1]||'png',asset=`assets/studio/${candidate.id}.${extension}`,dest=safePath(vnRoot,asset);await fs.mkdir(path.dirname(dest),{recursive:true});
    try{const existing=await fs.readFile(dest);if(sha(existing)!==sha(data))throw err('Studio asset path already contains different data',409);}catch(e){if(e.code!=='ENOENT')throw e;await fs.writeFile(dest,data,{flag:'wx'});}
    const override={id:`override-${crypto.randomUUID()}`,candidateId:candidate.id,asset,target,sha256:sha(data),createdAt:new Date().toISOString()};manifest.overrides.push(override);
    const runtimeManifest=path.join(vnRoot,'art-direction.json');
    await writeJsonAtomic(manifestFile,manifest);
    try { await writeJsonAtomic(runtimeManifest,manifest); } catch(e){await writeJsonAtomic(manifestFile,{version:1,overrides:manifest.overrides.filter(x=>x.id!==override.id)});throw e;}
    const s=await stateRead();s.history.push({project:'vn',action:'apply',id:override.id,candidateId:candidate.id,at:override.createdAt});await saveState(s);catalogCache=null;return {override};
  }
  async function applyBaseball(input) {
    const cat=await projectState('baseball'),candidate=cat.candidates.find(x=>x.id===input.candidateId);if(!candidate||candidate.status!=='approved')throw err('Candidate must be approved in this project',409);
    const target=input.target||{};let asset=target.assetId?cat.assets.find(x=>x.id===target.assetId):target.sourcePath?cat.assets.find(x=>x.sourcePath===target.sourcePath):null;
    if(!asset&&target.assetKey){const matches=cat.assets.filter(x=>x.id===target.assetKey||x.key===target.assetKey);if(matches.length===1)asset=matches[0];else if(matches.length>1)throw err('Baseball asset key is ambiguous; pass assetId or sourcePath',409);}
    if(!asset)throw err('Baseball asset target not found',404);
    if(!asset.applicable)throw err('This baseball image is a reference only; choose a supported runtime atlas',409);
    if(candidate.subject!==asset.subject)throw err('Candidate subject does not match selected baseball asset',409);
    if((target.expectedSha256||target.expectedHash||target.sourceHash)!==asset.sha256)throw err('Baseball source hash changed',409);
    const ref=cat.references[candidate.subject];if(!ref)throw err('Baseball reference not found',409);
    const referenceAsset=cat.assets.find(x=>x.id===ref.assetId);if(!referenceAsset||sha(await fs.readFile(safePath(baseballRoot,referenceAsset.sourcePath)))!==ref.sha256)throw err('Locked baseball reference changed on disk',409);
    if(candidate.referenceSha256&&candidate.referenceSha256!==ref.sha256)throw err('Candidate was generated against a different reference lock',409);
    for(const lock of candidate.referenceLocks||[]){const current=cat.references[lock.subject],file=cat.assets.find(a=>a.id===lock.assetId);if(!current||current.sha256!==lock.sha256||!file||sha(await fs.readFile(safePath(baseballRoot,file.sourcePath)))!==lock.sha256)throw err('A locked generation reference changed before apply',409);}
    if(candidate.kind!==asset.kind)throw err('Candidate type does not match selected asset');
    if(asset.kind==='atlas'&&(candidate.width!==asset.width||candidate.height!==asset.height))throw err('Atlas dimensions must match the selected source');
    const data=await candidateBytes(candidate);if(candidate.kind==='atlas'){const dims=await inspectImage(data);if(dims.width!==asset.width||dims.height!==asset.height)throw err('Atlas dimensions must match the selected source');}
    const manifestFile=path.join(stateDir,'baseball-direction.json'),manifest=await readJson(manifestFile,{version:1,overrides:[]});
    if(manifest.overrides.some(x=>x.target.assetId===asset.id||x.target.sourcePath===asset.sourcePath||(!x.target.assetId&&!x.target.sourcePath&&x.target.assetKey===asset.key)))throw err('This baseball asset already has an override; undo it first',409);
    const override={id:`override-${crypto.randomUUID()}`,candidateId:candidate.id,asset:candidate.url,target:{assetKey:asset.id,assetId:asset.id,sourcePath:asset.sourcePath,expectedSha256:asset.sha256},sha256:sha(data),createdAt:new Date().toISOString()};manifest.overrides.push(override);await writeJsonAtomic(manifestFile,manifest);
    baseballOverridesCache=manifest.overrides.slice();const preview=await ensureBaseballPreview();await preview?.refresh?.();
    const s=await stateRead();s.history.push({project:'baseball',action:'apply',id:override.id,candidateId:candidate.id,at:override.createdAt});await saveState(s);return {override,liveAdapter:preview?.available?'local CinemaLab preview':'manifest export; Vite preview is unavailable'};
  }
  async function temporaryBaseball(input){
    if(input.candidateId===null){baseballTemporary=[];const preview=await ensureBaseballPreview();await preview?.refresh?.();return {preview:true,temporary:false};}
    const cat=await projectState('baseball'),row=cat.candidates.find(item=>item.id===input.candidateId)||cat.assets.find(item=>item.id===input.candidateId);
    const target=cat.assets.find(item=>item.id===input.target?.assetId&&item.sourcePath===input.target?.sourcePath);
    if(!row||!target)throw err('Baseball preview candidate or target not found',404);
    if(!target.applicable)throw err('This baseball image is a reference only; choose a supported runtime atlas',409);
    if(row.subject!==target.subject||row.kind!==target.kind)throw err('Choose the matching character and asset type for this preview',409);
    if(row.kind==='atlas'&&(row.width!==target.width||row.height!==target.height))throw err('Atlas dimensions must match the selected source',409);
    if(row.project)await candidateBytes(row);
    baseballTemporary=[{id:'preview',asset:row.url,target:{sourcePath:target.sourcePath}}];
    const preview=await ensureBaseballPreview();await preview?.refresh?.();return {preview:true,temporary:true};
  }
  async function undo(input) {
    if(!['vn','baseball'].includes(input.project))throw err('Unknown project');
    const file=path.join(stateDir,input.project==='vn'?'art-direction.json':'baseball-direction.json'),manifest=await readJson(file,{version:1,overrides:[]});
    const index=manifest.overrides.findIndex(x=>x.id===input.id);if(index<0)throw err('Override not found',404);const [override]=manifest.overrides.splice(index,1);
    await writeJsonAtomic(file,manifest);if(input.project==='vn')await writeJsonAtomic(path.join(vnRoot,'art-direction.json'),manifest);if(input.project==='baseball'){baseballOverridesCache=manifest.overrides.slice();const preview=await ensureBaseballPreview();await preview?.refresh?.();}const s=await stateRead();s.history.push({project:input.project,action:'undo',id:override.id,at:new Date().toISOString()});await saveState(s);catalogCache=null;return {undone:override.id};
  }
  async function candidateBytes(candidate) {
    const full=candidate.sourcePath.startsWith('.art-studio/')?safeInternalPath(stateDir,candidate.sourcePath.slice('.art-studio/'.length)):safePath(candidate.project==='vn'?vnRoot:baseballRoot,candidate.sourcePath);
    const data=await fs.readFile(full);if(sha(data)!==candidate.sha256)throw err('Candidate file changed on disk',409);return data;
  }
  async function serveCandidate(urlPath,res) {
    if(!/^\/candidates\/(?:import|gen)-[a-f0-9-]+\.(?:png|jpg|webp)$/i.test(urlPath))throw err('Invalid candidate path',404);
    const name=path.basename(urlPath); let candidate;
    const s=await stateRead();candidate=s.candidates.find(x=>path.basename(x.url)===name);if(!candidate)throw err('Candidate not found',404);
    const data=await candidateBytes(candidate);res.writeHead(200,{'Content-Type':MIME[path.extname(name)],'Cache-Control':'no-store','Content-Length':data.length});res.end(data);
  }
  async function serveVnStatic(rel,res) {
    if(rel.split('/').some(x=>!x||x.startsWith('.'))||! /\.(html|css|js|mjs|json|png|jpe?g|webp|svg|mp3|wav|mp4|woff2?)$/i.test(rel))throw err('Static asset is not allowed',404);
    const full=safePath(vnRoot,rel);await ensureNoLinks(vnRoot,full);return sendFile(full,res);
  }
  return { server, listen:async()=>{await ensureBaseballPreview();return new Promise(resolve=>server.listen(port,'127.0.0.1',()=>resolve(server.address())));}, close:async()=>{if(baseballPreview?.close)await baseballPreview.close();return new Promise(resolve=>server.close(resolve));}, refresh };
}

const emptyState=()=>({version:1,candidates:[],jobs:[],history:[],references:{}});
function json(res,status,value){const data=Buffer.from(JSON.stringify(value));res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Content-Length':data.length});res.end(data);}
function validateMutation(req,host){const site=req.headers['sec-fetch-site'];if(site&&site!=='same-origin'&&site!=='none')throw err('Cross-site mutation blocked',403);const origin=req.headers.origin;if(!origin)throw err('Origin header required for mutations',403);let parsed;try{parsed=new URL(origin);}catch{throw err('Invalid Origin',403);}if(!['http:','https:'].includes(parsed.protocol)||parsed.host!==host)throw err('Origin must match this local server',403);}
async function body(req){let chunks=[],size=0;for await(const chunk of req){size+=chunk.length;if(size>MAX_BODY)throw err('Request body exceeds 25 MiB limit',413);chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw err('Invalid JSON body');}}
async function providerStatus(){try{await fs.access('C:/Users/정현아/.codex/skills/sprite-gen/.venv/Scripts/python.exe');await fs.access('C:/Users/정현아/.codex/skills/sprite-gen/sprite_gen/cli.py');return {available:true,detail:'Sprite Gen runtime is installed; account access is checked when a generation job starts.'};}catch{return {available:false,detail:'Sprite Gen Python runtime is not installed.'};}}
async function inspectImage(data){const python='C:/Users/정현아/.codex/skills/sprite-gen/.venv/Scripts/python.exe';return new Promise(resolve=>{const script='import sys,json,io; from PIL import Image; raw=sys.stdin.buffer.read(); im=Image.open(io.BytesIO(raw)); im.verify(); im=Image.open(io.BytesIO(raw)); print(json.dumps({"width":im.width,"height":im.height,"format":im.format}))';const child=spawn(python,['-X','utf8','-c',script],{windowsHide:true});let out='';child.stdout.on('data',x=>out+=x);child.on('error',()=>resolve(null));child.on('close',code=>{try{resolve(code===0?JSON.parse(out):null);}catch{resolve(null);}});child.stdin.end(data);});}
function safeInternalPath(root,rel){const full=path.resolve(root,rel);if(!full.startsWith(path.resolve(root)+path.sep))throw err('Invalid internal path',403);return full;}
async function ensureNoLinks(root,full){let current=root;const rel=path.relative(root,full).split(path.sep);for(const seg of rel){current=path.join(current,seg);const st=await fs.lstat(current);if(st.isSymbolicLink())throw err('Symlink access blocked',403);}}
async function serveMedia(root,rel,res){let decoded;try{decoded=decodeURIComponent(rel);}catch{throw err('Invalid path encoding',400);}if(!decoded.startsWith('assets/')||decoded.split('/').some(x=>!x||x.startsWith('.')))throw err('Media path is not allowed',404);return serveStaticFile(root,decoded,res);}
async function serveStaticFile(root,rel,res){let decoded;try{decoded=decodeURIComponent(rel);}catch{throw err('Invalid path encoding',400);}const full=safePath(root,decoded);await ensureNoLinks(root,full);return sendFile(full,res);}
async function sendFile(full,res){const ext=path.extname(full).toLowerCase(),data=await fs.readFile(full);res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-store'});res.end(data);}
function overlaps(a,b){if(a.chapterId!==b.chapterId||b.start>a.end||a.start>b.end)return false;if(a.slot==='actor'&&b.slot==='actor')return a.actorId===b.actorId;if((a.slot==='actor'&&b.slot==='cg')||(a.slot==='cg'&&b.slot==='actor'))return true;return a.slot===b.slot;}
function referenceHash(cat,subject){return cat.references?.[subject]?.sha256;}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const s=createStudioServer({port:Number(process.env.PORT)||4321});s.listen().then(address=>console.log(`Art Studio listening at http://127.0.0.1:${address.port}`));}
