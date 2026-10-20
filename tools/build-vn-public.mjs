import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {buildOffline} from './build-vn-offline.mjs';
import {normalizeStory} from '../vn/state.js';
import {publicDemoStory,DEMO_CHAPTER_IDS} from '../vn/release.js';
import {EP1_ASSETS} from '../vn/ep1-assets.js';
import {withTeaserCharacterAssets} from '../vn/teaser-art.js';
import {episodeOneDirection} from '../vn/episode-one.js';
import {episodeTwoDirection} from '../vn/episode-two.js';
import {coreSceneDirection} from '../vn/core-demo.js';
import {EPISODE_CUTSCENES} from '../vn/episode-cutscenes.js';

const slash=s=>s.replaceAll('\\','/');
const hash=s=>createHash('sha256').update(s).digest('hex');
const local=(root,relative)=>{
 if(!relative||/^(?:[a-z]+:|[\\/])/i.test(relative))throw Error('로컬 상대 경로가 필요합니다: '+relative);
 const file=path.resolve(root,relative.split(/[?#]/)[0]),rel=path.relative(root,file);
 if(rel==='..'||rel.startsWith('..'+path.sep)||path.isAbsolute(rel))throw Error('배포 범위를 벗어난 경로: '+relative);
 return file;
};
function pureMap(source,name,value){
 const start=source.indexOf('const '+name+' = '),end=source.indexOf('\n};',start);
 if(start<0||end<start)throw Error('방향 자료 형식이 달라졌습니다: '+name);
 return source.slice(0,start)+'const '+name+' = '+JSON.stringify(value,null,2)+';'+source.slice(end+3);
}

// 원본 체크아웃은 읽기만 한다. 비어 있는 별도 출력 폴더만 허용한다.
export async function buildPublicSite(sourceRoot,outputRoot,{copyRoot=true}={}){
 if(!path.isAbsolute(sourceRoot)||!path.isAbsolute(outputRoot))throw Error('입력·출력은 절대 경로여야 합니다.');
 const root=path.resolve(sourceRoot),out=path.resolve(outputRoot),rel=path.relative(root,out);
 if(out===root||(!rel.startsWith('..'+path.sep)&&rel!=='..'&&!path.isAbsolute(rel)))throw Error('출력은 원본 폴더 밖이어야 합니다.');
 await fs.mkdir(out,{recursive:true});
 if((await fs.readdir(out)).length)throw Error('출력 폴더가 비어 있지 않습니다.');
 if(copyRoot)for(const entry of await fs.readdir(root,{withFileTypes:true})){
  if(entry.name.startsWith('.')||['vn','node_modules'].includes(entry.name))continue;
  await fs.cp(path.join(root,entry.name),path.join(out,entry.name),{recursive:true,filter:src=>!path.relative(root,src).split(path.sep).some(p=>p.startsWith('.')||p==='node_modules')});
 }
 const input=path.join(root,'vn'),vn=path.join(out,'vn');await fs.mkdir(vn);
 const box={window:{}};vm.runInNewContext(await fs.readFile(path.join(input,'story-data.js'),'utf8'),box);
 const original=JSON.parse(JSON.stringify(box.window.STORY)),raw=withTeaserCharacterAssets(publicDemoStory(original),EP1_ASSETS),story=normalizeStory(raw);
 const ids=new Set(DEMO_CHAPTER_IDS),keys=new Set(['teaserVideo','sea']);
 const storyKeys=new Set(['city']);
 for(const c of story.chapters)for(let i=0;i<c.beats.length;i++){
  const b=c.beats[i];storyKeys.add(b.scene);storyKeys.add(b.portrait);storyKeys.add(b.direction?.visual?.image);
  for(const p of b.direction?.cast||[])storyKeys.add(p.id);
  const cue=episodeOneDirection(c,i)||episodeTwoDirection(c,i)||coreSceneDirection(c,i);
  if(cue){for(const k of ['backgroundAsset','cg','music','ambience','fx'])if(cue[k])keys.add(cue[k]);storyKeys.add(cue.background);for(const a of cue.actors||[])keys.add(a.asset);}
 }
 const episodeAssets=Object.fromEntries(Object.entries(EP1_ASSETS).filter(([key])=>keys.has(key)));
 const assets=Object.fromEntries(Object.entries(raw.assets).filter(([key])=>storyKeys.has(key)));
 const data={...raw,assets,credits:{author:original.credits?.author||'',scope:'무료 데모 · 1~11화와 사이 이야기 7편'}};
 await fs.writeFile(path.join(vn,'story-data.js'),'window.STORY = '+JSON.stringify(data)+';\n');
 const generated=new Map([['ep1-assets.js','export const EP1_ASSETS=Object.freeze('+JSON.stringify(episodeAssets)+');\n']]);
 const cuts=EPISODE_CUTSCENES.filter(c=>ids.has(c.chapter)),cutSource=await fs.readFile(path.join(input,'episode-cutscenes.js'),'utf8');
 const cutTail=cutSource.indexOf('const validatedCuts=');if(cutTail<0)throw Error('컷신 자료 형식이 달라졌습니다.');
 generated.set('episode-cutscenes.js','export const EPISODE_CUTSCENES=Object.freeze('+JSON.stringify(cuts)+'.map(Object.freeze));\n'+cutSource.slice(cutTail));
 let neural=await fs.readFile(path.join(input,'neural-cues.js'),'utf8');
 const cueBox={};vm.runInNewContext(neural.replace(/^export\s+/gm,'')+'\n;globalThis.maps={PRESETS,AUTHORED};',cueBox);
 const authored=Object.fromEntries(Object.entries(cueBox.maps.AUTHORED).filter(([id])=>ids.has(id)));
 const presetNames=new Set(Object.values(authored).flatMap(rows=>rows.map(row=>row[2])));
 neural=pureMap(neural,'PRESETS',Object.fromEntries(Object.entries(cueBox.maps.PRESETS).filter(([key])=>presetNames.has(key))));
 neural=pureMap(neural,'AUTHORED',authored);
 const supported=/const SUPPORTED_CHAPTERS = new Set\(\[[\s\S]*?\]\);/;
 if(!supported.test(neural))throw Error('통신 허용 범위 형식이 달라졌습니다.');
 neural=neural.replace(supported,'const SUPPORTED_CHAPTERS = new Set('+JSON.stringify(DEMO_CHAPTER_IDS)+');');
 generated.set('neural-cues.js',neural);
 const files=new Set(),media=new Set([...Object.values(episodeAssets),...Object.values(assets)]);
 async function copy(relative){
  const src=local(input,relative),key=slash(path.relative(input,src));if(files.has(key))return;files.add(key);
  const destination=local(vn,key);await fs.mkdir(path.dirname(destination),{recursive:true});
  await fs.copyFile(src,destination);
 }
 async function module(relative){
  const file=local(input,relative),key=slash(path.relative(input,file));if(files.has(key))return;
  const source=generated.get(key)??await fs.readFile(file,'utf8');files.add(key);
  await fs.writeFile(local(vn,key),source);
  for(const m of source.matchAll(/\bimport\s+(?:[\s\S]*?\sfrom\s*)?['"]([^'"\r\n]+)['"]\s*;/g)){
   const dep=path.resolve(path.dirname(file),m[1].split(/[?#]/)[0]);await module(slash(path.relative(input,dep)));
  }
  for(const m of source.matchAll(/['"](\.\/assets\/[^'"\r\n]+)['"]/g))media.add(slash(path.relative(input,path.resolve(path.dirname(file),m[1]))));
 }
 const html=await fs.readFile(path.join(input,'index.html'),'utf8');
 for(const entry of ['index.html','demo.html']){await fs.writeFile(path.join(vn,entry),html.replace('<html lang="ko">','<html lang="ko" data-core-demo="true">'));files.add(entry);}
 await module('app.js');
 for(const m of html.matchAll(/<link\b[^>]*href="([^"]+)"/g)){
  const cssName=m[1].split(/[?#]/)[0];await copy(cssName);const css=await fs.readFile(local(input,cssName),'utf8');
  for(const match of css.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)/gi)){
   const url=(match[1]??match[2]??match[3]??'').trim();
   if(url&&!url.startsWith('data:')&&!url.startsWith('#'))media.add(slash(path.relative(input,path.resolve(path.dirname(local(input,cssName)),url))));
  }
 }
 for(const asset of media)await copy(asset);
 await fs.mkdir(path.join(vn,'notes'));
 const notice='<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>꿈을 잃은 세계 · 무료 데모</title><style>body{max-width:680px;margin:12vh auto;padding:24px;background:#0b1822;color:#dfdfcf;font:18px/1.9 system-ui}a{color:#d9c18a}</style><h1>꿈을 잃은 세계</h1><p>공개 버전은 1~11화 무료 데모입니다. 이후 이야기는 정식판 출시 안내에서 확인할 수 있습니다.</p><p><a href="../demo.html">데모 플레이와 출시 안내</a></p></html>';
 for(const entry of await fs.readdir(path.join(input,'notes')))if(entry.endsWith('.html'))await fs.writeFile(path.join(vn,'notes',entry),notice);
 await fs.writeFile(path.join(vn,'notes','release.html'),notice);
 const offline=await buildOffline(vn,path.join(vn,'play-offline.html'));
 await fs.writeFile(path.join(out,'.nojekyll'),'');
 const report={edition:'core11',chapterIds:DEMO_CHAPTER_IDS,chapters:data.chapters.length,sourceBeats:data.chapters.reduce((n,c)=>n+c.beats.length,0),cutsceneChapters:[...new Set(cuts.map(c=>c.chapter))],neuralChapters:Object.keys(authored),media:[...media].sort(),offlineBytes:offline.offlineBytes,offlineSha256:offline.sha256,sourceStorySha256:hash(await fs.readFile(path.join(input,'story-data.js'))),checkoutModified:false,paymentAuthentication:false,rootNovelSitePreserved:copyRoot};
 await fs.writeFile(path.join(vn,'public-build.json'),JSON.stringify(report,null,2));
 return report;
}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url){
 try{if(process.argv.length!==4)throw Error('Usage: node build-vn-public.mjs <source root> <empty output root>');const report=await buildPublicSite(process.argv[2],process.argv[3]);console.log(JSON.stringify({chapters:report.chapters,sourceBeats:report.sourceBeats,assets:report.media.length,offlineBytes:report.offlineBytes,checkoutModified:false}));}catch(e){console.error(e.stack);process.exitCode=1;}
}
