import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { normalizeStory } from '../../vn/state.js';
import { syncEpisodeTwoCopy } from '../../vn/episode-two-copyfix.js';
import { EP1_ASSETS } from '../../vn/ep1-assets.js';
import { coreSceneDirection } from '../../vn/core-demo.js';
import { episodeOneDirection } from '../../vn/episode-one.js';
import { episodeTwoDirection } from '../../vn/episode-two.js';
import { withTeaserCharacterAssets } from '../../vn/teaser-art.js';

const studioDir = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(studioDir, '../..');
const runtimeVnRoot = path.resolve(studioDir, '../../vn');
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const safePath = (root, rel) => {
  const clean = String(rel || '').replaceAll('\\', '/');
  if (!clean || clean.startsWith('/') || clean.split('/').some(x => !x || x === '.' || x === '..' || x.startsWith('.'))) throw new Error('Invalid asset path');
  const resolved = path.resolve(root, clean);
  if (!resolved.startsWith(path.resolve(root) + path.sep)) throw new Error('Invalid asset path');
  return resolved;
};
const subjectFor = key => { const value=String(key).toLowerCase();for(const id of ['seoin','jiwoo','mother','father','doyun','hakyung','reho','mira','yeonwoo','yoonha','yoonsera','eunkyung','haerin','batter','red-rush'])if(value.includes(id))return id;return ''; };
const ART_LABELS={seoin:'서인 · 기본',jiwoo:'지우 · 기본',mother:'어머니 · 기본',doyun:'도윤 · 기본',hakyung:'하경 · 기본',reho:'재호 · 기본',mira:'미라 · 기본',seoinStanding:'서인 · 서 있는 자세',seoinWaking:'서인 · 잠에서 깬 얼굴',seoinHome:'서인 · 집에서',seoinStartled:'서인 · 놀람',seoinRecliningHome:'서인 · 기대어 누움',seoinRelief:'서인 · 안도',seoinQuestion:'서인 · 되묻는 시선',seoinWorry:'서인 · 걱정',seoinNight:'서인 · 밤',seoinAngry:'서인 · 억누른 분노',coreSeoinAfter:'서인 · 말을 삼킨 뒤',motherCare:'어머니 · 걱정',motherWarm:'어머니 · 다정함',motherSearching:'어머니 · 살피는 시선',fatherAppeal:'아버지 · 호소',fatherDown:'아버지 · 고개를 떨굼',jiwooGuarded:'지우 · 경계',jiwooUnsteady:'지우 · 흔들림',jiwooClay:'지우 · 점토를 만지는 손',jiwooRelaxed:'지우 · 풀어진 표정',jiwooTease:'지우 · 짓궂은 웃음',jiwooFirm:'지우 · 단호함',jiwooWounded:'지우 · 상처받은 표정',doyunCanonical:'도윤 · 기준 원화',coreDoyunListen:'도윤 · 듣는 자세',coreHakyung:'하경 · 기준 원화',rehoCanonical:'재호 · 기준 원화',miraCanonical:'미라 · 기준 원화',dreamBeach:'지우의 광고꿈 · 해변',homeMorning:'서인의 집 · 아침',homeNight:'서인의 집 · 밤',sea:'빌린 바다',table:'함께 앉은 식탁',clay:'건넨 점토',night:'오늘 밤의 선택'};
async function assetRecord(root, id, key, label, subject, kind, sourcePath, extra = {}, project = 'vn') {
  try {
    const full = safePath(root, sourcePath), stat = await fs.stat(full), bytes = await fs.readFile(full);
    if (!stat.isFile()) return null;
    const dimensions=imageDimensions(bytes);
    return { id, key, label:ART_LABELS[key]||label, subject, kind, url: `/media/${project}/${sourcePath.split('/').map(encodeURIComponent).join('/')}`, sourcePath, sha256: sha(bytes), ...dimensions, ...extra };
  } catch { return null; }
}

export async function createVnCatalog(root = defaultRoot) {
  root = path.resolve(root); const vnRoot = path.join(root, 'vn');
  const source = await fs.readFile(path.join(vnRoot, 'story-data.js'), 'utf8');
  const match = source.match(/window\.STORY\s*=\s*(\{[\s\S]*\})\s*;\s*$/);
  if (!match) throw new Error('Could not parse window.STORY JSON');
  const fullStory = JSON.parse(match[1]);
  // Load the same release and cue modules used by the browser runtime; no story JS is evaluated.
  const release = await import(pathToFileURL(path.join(runtimeVnRoot, 'release.js')).href + `?studio=${Date.now()}`);
  const normalized = normalizeStory(fullStory);
  syncEpisodeTwoCopy(normalized);
  const story = withTeaserCharacterAssets(release.publicDemoStory(normalized),EP1_ASSETS);
  const episode = await import(pathToFileURL(path.join(runtimeVnRoot, 'episode-cutscenes.js')).href + `?studio=${Date.now()}`);
  const assets = [];
  const assetPathByKey = new Map([...Object.entries(story.assets || {}), ...Object.entries(EP1_ASSETS)]);
  for (const [key, assetSource] of assetPathByKey) {
    const rel=String(assetSource).split('?')[0];
    if(!/\.(png|jpe?g|webp)$/i.test(rel))continue;
    if(key==='jiwoo'&&rel==='assets/jiwoo.webp')continue;
    const inferred=subjectFor(key),isActor=Boolean(inferred)&&!['batter','red-rush'].includes(inferred);
    const file = await assetRecord(vnRoot, `vn-${key}`, key, key, inferred, isActor ? 'actor' : 'background', rel);
    if (file) assets.push(file);
  }
  const extraAssetFiles = [];
  async function walk(dir, prefix = '') {
    for (const ent of await fs.readdir(dir, { withFileTypes: true })) {
      if (ent.name.startsWith('.')) continue;
      const rel = path.posix.join(prefix, ent.name);
      if (ent.isSymbolicLink()) continue;
      if (ent.isDirectory()) await walk(path.join(dir, ent.name), rel);
      else if (/\.(png|jpe?g|webp)$/i.test(ent.name)) extraAssetFiles.push(`assets/${rel}`);
    }
  }
  await walk(path.join(vnRoot, 'assets'));
  const known = new Set(assets.map(a => a.sourcePath));
  for (const rel of extraAssetFiles) {
    if (known.has(rel)) continue;
    const lower=rel.toLowerCase();
    if(subjectFor(lower)&&!lower.startsWith('assets/teaser-style/')&&!lower.startsWith('assets/parent-style/')&&!lower.startsWith('assets/studio/')&&!lower.startsWith('assets/cutscenes/ep03-'))continue;
    if(lower==='assets/jiwoo.webp'||(lower.includes('jiwoo')&&!lower.includes('teaser-style/jiwoo-')&&!lower.includes('jiwoo-woman-')&&!lower.includes('cutscenes/ep03-jiwoo-clay-smile')))continue;
    const basename = path.basename(rel, path.extname(rel)), inferred=subjectFor(`${basename} ${rel}`), actor = Boolean(inferred)||/canonical|portrait/i.test(basename);
    const item = await assetRecord(vnRoot, `vn-file-${rel.replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'')}`, basename, basename.replaceAll('-', ' '), inferred, actor ? 'actor' : 'cg', rel);
    if (item) assets.push(item);
  }
  const assetByKey = new Map(assets.map(a => [a.key, a]));
  const normalizedAssets = new Map(assets.map(a => [a.key.toLowerCase().replace(/[^a-z0-9]/g,''),a]));
  const resolveAsset = key => assetByKey.get(key) || normalizedAssets.get(String(key||'').toLowerCase().replace(/[^a-z0-9]/g,''));
  const chapterScenes = [],cgKeys=new Set(),actorKeys=new Set();
  for (const chapter of story.chapters) {
    const beats = chapter.beats || []; let start = 0;
    const cueAt = i => {const cue=chapter.id==='1' ? episodeOneDirection(chapter,i) : chapter.id==='2' ? episodeTwoDirection(chapter,i) : coreSceneDirection(chapter,i);if(cue?.cg)cgKeys.add(cue.cg);for(const actor of cue?.actors||[])actorKeys.add(actor.asset);return cue;};
    const signatureAt = i => { const cue=cueAt(i),beat=beats[i]; return JSON.stringify({scene:cue?.background||beat.scene||'neutral',actors:cue?.actors||[],cg:cue?.cg||'',background:cue?.backgroundAsset||''}); };
    while (start < beats.length) {
      const beat = beats[start], scene = beat.scene || 'neutral', cue=cueAt(start), signature=signatureAt(start);
      let end = start;
      while (end + 1 < beats.length && signatureAt(end+1)===signature) end++;
      const cast = cue?.actors || beat.direction?.cast || [];
      chapterScenes.push({ id: `${chapter.id}:${start}`, chapterId: chapter.id, start, end, title: beat.direction?.place || scene,anchor:beat.text,endAnchor:beats[end]?.text,
        actors: cast.map((entry, i) => ({ id: entry.id || entry.name || `actor${i}`, asset: resolveAsset(entry.asset)?.id || resolveAsset(entry.id)?.id || '', gaze: entry.gaze||'left', pose: entry.pose||'standing', side: entry.side||(i ? 'right' : 'left') })),
        cg: resolveAsset(cue?.cg)?.id || '', background: resolveAsset(cue?.backgroundAsset||cue?.background||scene)?.id || '', _cue: null });
      start = end + 1;
    }
    for (const cut of episode.EPISODE_CUTSCENES.filter(x => x.chapter === chapter.id && x.start < beats.length && x.end < beats.length)) {
      const scene = chapterScenes.find(x => x.chapterId === chapter.id && cut.start >= x.start && cut.start <= x.end);
      if (scene) { scene._cue = cut.cg; scene.cg = assetByKey.get(cut.cg)?.id || ''; }
    }
  }
  for (const s of chapterScenes) delete s._cue;
  for(const row of assets){if(cgKeys.has(row.key)&&!actorKeys.has(row.key)){row.kind='cg';row.subject='';}}
  const subjects = [
    { id: 'seoin', name: '서인', referenceAssetId: resolveAsset('seoinStanding')?.id },
    { id: 'jiwoo', name: '지우', referenceAssetId: resolveAsset('jiwooRelaxed')?.id },
    ...['mother','father','doyun','hakyung','reho','mira'].map(id => ({ id, name: ({mother:'어머니',father:'아버지',doyun:'도윤',hakyung:'하경',reho:'재호',mira:'미라'})[id], referenceAssetId: resolveAsset(({mother:'motherCare',father:'fatherAppeal',doyun:'doyunCanonical',hakyung:'coreHakyung',reho:'rehoCanonical',mira:'miraCanonical'})[id])?.id || resolveAsset(id)?.id }))
  ];
  const fingerprints = Object.fromEntries(story.chapters.map(c => [c.id, sha(Buffer.from(JSON.stringify(c.beats.map(b => b.text))))]));
  return { id: 'vn', name: '꿈을 잃은 세계 · 공개 데모', subjects, assets,
    chapters: story.chapters.map(c => ({ id: c.id, label: c.label, title: c.title, beats: c.beats.map(b => ({ text: b.text, speaker: b.speaker, scene: b.scene })) })),
    scenes: chapterScenes, fingerprints, candidates: [], overrides: [], history: [], references: Object.fromEntries(subjects.map(s => { const a = assets.find(x => x.id === s.referenceAssetId); return [s.id, a ? { assetId: a.id, sha256: a.sha256 } : null]; }).filter(([,v]) => v)) };
}

export async function createBaseballCatalog(root = defaultRoot) {
  root = path.resolve(root);
  const paths = [
    ['batter-portrait','batter','Batter · canonical portrait','actor','assets/production-art/battle-portrait-v15/batter-ready.png'],
    ['batter-runtime','batter','Batter · 4×2 runtime atlas','atlas','assets/production-art/battle-portrait-v15/batter-sheet-runtime.png'],
    ['pitcher-atlas','red-rush','Red Rush · pitching atlas','atlas','assets/pitcher-sd-v1/red-rush-pitch-120-atlas.png'],
    ['red-rush-portrait','red-rush','Red Rush · canonical portrait','actor','assets/pitcher-mobs-v1/regular-01-red-rush.png'],
    ['dex-red-rush','red-rush','Red Rush · Dex portrait','actor','assets/production-art/mockup-world-v15/dex-red-rush.png']
  ];
  const assets = [];
  for (const [id,key,label,kind,sourcePath] of paths) {
    const full = safePath(root, sourcePath);
    try {
      const data = await fs.readFile(full);
    const dims = await pngDimensions(data);
      assets.push({ id, key, label, subject: key==='batter'?'batter':'red-rush', kind,applicable:kind==='atlas',referenceOnly:kind!=='atlas', url: `/media/baseball/${sourcePath.split('/').map(encodeURIComponent).join('/')}`, sourcePath, sha256: sha(data), width: dims?.width, height: dims?.height,
        ...(id==='batter-runtime'?{cols:4,rows:2,frames:7}:id==='pitcher-atlas'?{cols:10,rows:12,frames:120}:{}) });
    } catch {}
  }
  return { id:'baseball', name:'Baseball Duel', subjects: [...new Map(assets.map(a=>[a.subject,{id:a.subject,name:a.subject==='batter'?'타자':'Red Rush',referenceAssetId:assets.find(x=>x.subject===a.subject&&x.kind==='actor'&&x.id!==`${a.subject}-runtime`)?.id||a.id}])).values()], assets,
    chapters: [], scenes: assets.filter(a=>a.applicable).map((a,i)=>({ id:`baseball:${a.id}`,chapterId:'cinema',start:0,end:0,title:a.label,assetId:a.id,actors:[],cg:'',background:'' })), fingerprints:{cinema:sha(Buffer.from(assets.map(a=>a.sha256).join('|')))}, candidates:[],overrides:[],history:[], references:Object.fromEntries([...new Map(assets.map(a=>[a.subject,a])).entries()].map(([subject,a])=>[subject,{assetId:assets.find(x=>x.subject===subject&&x.kind==='actor'&&x.id!==`${subject}-runtime`)?.id||a.id,sha256:(assets.find(x=>x.subject===subject&&x.kind==='actor'&&x.id!==`${subject}-runtime`)||a).sha256}])) };
}
function imageDimensions(buf) {
  if(buf.length>=24&&buf.toString('hex',0,8)==='89504e470d0a1a0a')return {width:buf.readUInt32BE(16),height:buf.readUInt32BE(20)};
  if(buf.length>=30&&buf.toString('ascii',0,4)==='RIFF'&&buf.toString('ascii',8,12)==='WEBP'){
    let offset=12;
    while(offset+8<=buf.length){const type=buf.toString('ascii',offset,offset+4),len=buf.readUInt32LE(offset+4),p=offset+8;
      if(type==='VP8X'&&p+10<=buf.length)return {width:1+buf.readUIntLE(p+4,3),height:1+buf.readUIntLE(p+7,3)};
      if(type==='VP8L'&&p+5<=buf.length&&buf[p]===0x2f){const b1=buf[p+1],b2=buf[p+2],b3=buf[p+3],b4=buf[p+4];return {width:1+((b2&0x3f)<<8|b1),height:1+((b4&0x0f)<<10|b3<<2|(b2&0xc0)>>6)};}
      if(type==='VP8 '&&p+10<=buf.length){let i=p;while(i+3<buf.length&&(buf[i]!==0x9d||buf[i+1]!==0x01||buf[i+2]!==0x2a))i++;if(i+7<=buf.length)return {width:buf.readUInt16LE(i+3)&0x3fff,height:buf.readUInt16LE(i+5)&0x3fff};}
      offset=p+len+(len&1);
    }
  }
  if(buf[0]===0xff&&buf[1]===0xd8){let i=2;while(i+9<buf.length){if(buf[i]!==0xff){i++;continue;}const marker=buf[i+1],len=buf.readUInt16BE(i+2);if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker))return {height:buf.readUInt16BE(i+5),width:buf.readUInt16BE(i+7)};if(len<2)break;i+=2+len;}}
  return {};
}
async function pngDimensions(buf) { return imageDimensions(buf); }
export { safePath, sha };
