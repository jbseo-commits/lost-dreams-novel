// The existing working copy is read only. Vite transforms belong to this local preview session.
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import {createRequire} from 'node:module';

export function replaceArtImports(source, file, root, overrides) {
  return source.replace(/import\s+([\w$]+)\s+from\s*['"]([^'"]+)['"];?/g, (original, name, specifier) => {
    if (!specifier.startsWith('.')) return original;
    const local = relative(root, resolve(dirname(file), specifier)).replaceAll('\\', '/');
    const row = overrides.findLast(item => item.target?.sourcePath === local && /^(?:\/candidates\/[\w.-]+|\/media\/baseball\/assets\/[\w/%.+-]+)$/.test(item.asset));
    return row ? `const ${name}=${JSON.stringify(row.asset)};` : original;
  });
}

export function transformBaseballSource(source,id,root,rows){
 const file=id.split('?')[0],normalized=file.replaceAll('\\','/'),sourceRoot=resolve(root,'src').replaceAll('\\','/');
 if(!normalized.startsWith(sourceRoot+'/'))return null;
 if(normalized.endsWith('/src/duel/duel.css'))return {code:source+'\n.cinema-lab-stage .batter-sheet-actor{position:relative;display:block;width:100%;height:100%}.cinema-lab-stage .batter-sheet-frame{position:absolute;left:50%;bottom:0;height:100%;aspect-ratio:2/3;translate:-50% calc((1 - var(--baseline,1)) * 100%);background-repeat:no-repeat;image-rendering:auto}\n',map:null};
 if(!/\.[jt]sx?$/.test(file))return null;
 let output=replaceArtImports(source,file,root,rows);
 if(normalized.endsWith('/src/duel/App.jsx')){
  output=output.replace('<Sprite who="batter" stage={stage} shot={shot} golden playToken={token}/>',
   '<Sprite who="batter" stage={stage} shot={shot} golden playToken={token} sheet={BATTER_V15_SHEET} syncRedRush/>');
  output=output.replace('<Sprite who="pitcher" stage={stage} shot={shot} golden playToken={token}/>',
   '<PitcherAtlasSprite atlas={redRushAtlas} stage={stage} shot={shot} playToken={token}/>');
  output=output.replace('shot=presentationFor(chosen.state),timeline=presentationTimeline(shot,false)',
   'shot=redRushBatterShot(presentationFor(chosen.state),false),timeline=redRushTimeline(presentationTimeline(shot,false),false)');
  output=output.replace('const p=presentationFor(item.state),t=presentationTimeline(p,false),pitch=!!item.state.battle.revealed;',
   'const p=redRushBatterShot(presentationFor(item.state),false),t=redRushTimeline(presentationTimeline(p,false),false),pitch=!!item.state.battle.revealed;');
  if(rows.some(row=>row.target?.sourcePath?.endsWith('batter-sheet-runtime.png')))output=output.replace('batterRig={BATTER_V15_RIG}','batterRig={null}');
 }
 return output===source?null:{code:output,map:null};
}

export async function createBaseballPreview({root, stateDir, getOverrides}) {
  const viteEntry = resolve(root, 'node_modules/vite/dist/node/index.js');
  if (!existsSync(viteEntry)) return {available:false,detail:'야구 프로젝트의 Vite 설치를 찾지 못했습니다.'};
  try {
    const {createServer} = await import(pathToFileURL(viteEntry).href);
    const fromGame=createRequire(resolve(root,'package.json'));
    const postcssPlugins=[fromGame('tailwindcss')({config:resolve(root,'tailwind.config.js'),content:[resolve(root,'index.html').replaceAll('\\','/'),resolve(root,'src').replaceAll('\\','/')+'/**/*.{js,jsx}']}),fromGame('autoprefixer')()];
    const server = await createServer({root,base:'/baseball-game/',configFile:false,cacheDir:resolve(stateDir,'vite-cache'),
      css:{postcss:{plugins:postcssPlugins}},
      logLevel:'error',appType:'spa',server:{middlewareMode:true,hmr:false,fs:{strict:true,allow:[root]},watch:{ignored:['**/.qa-*/**']}},
      plugins:[{name:'art-studio-read-only-preview',enforce:'pre',transform(source,id){
        return transformBaseballSource(source,id,root,getOverrides());
      }}]});
    return {available:true,detail:'로컬 작업본의 실제 CinemaLab · 원본 파일 보존',
      middleware:server.middlewares,refresh:()=>server.moduleGraph.invalidateAll(),close:()=>server.close()};
  } catch(error){return {available:false,detail:`야구 미리보기 시작 실패: ${String(error.message).slice(0,160)}`};}
}
