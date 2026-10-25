import test from 'node:test';
import assert from 'node:assert/strict';
import {replaceArtImports,transformBaseballSource} from './baseball-preview.mjs';
const root='C:/game/baseball',file=root+'/src/duel/batter-v15.js';
const source="import batter from '../../assets/production/batter.png';\nimport other from '../../assets/production/other.png';\nexport const sheet={src:batter,cols:4,rows:2};";
test('the exact selected baseball sheet import changes without editing source or timing',()=>{
 const output=replaceArtImports(source,file,root,[{asset:'/candidates/import-a.png',target:{sourcePath:'assets/production/batter.png'}}]);
 assert.match(output,/const batter="\/candidates\/import-a.png"/);assert.match(output,/import other from/);assert.match(output,/cols:4,rows:2/);assert.match(source,/import batter from/);
});
test('an existing catalog candidate can use the same live baseball bridge',()=>{
 const output=replaceArtImports(source,file,root,[{asset:'/media/baseball/assets/production/batter.png',target:{sourcePath:'assets/production/batter.png'}}]);
 assert.match(output,/const batter="\/media\/baseball\/assets\/production\/batter.png"/);
});
test('an unrelated asset or an external URL never rewrites a baseball import',()=>{
 assert.equal(replaceArtImports(source,file,root,[{asset:'/candidates/a.png',target:{sourcePath:'assets/production/missing.png'}}]),source);
 assert.equal(replaceArtImports(source,file,root,[{asset:'https://example.org/a.png',target:{sourcePath:'assets/production/batter.png'}}]),source);
});
test('Vite forward-slash module IDs match Windows project paths',()=>{
 const source='const timers=useRef([]),shot=presentationFor(chosen.state),timeline=presentationTimeline(shot,false);';
 const changed=transformBaseballSource(source,'C:/game/baseball/src/duel/App.jsx','C:\\game\\baseball',[]);
 assert.ok(changed?.code.includes('redRushBatterShot(presentationFor(chosen.state)'));
 assert.equal(transformBaseballSource(source,'C:/other/src/duel/App.jsx','C:\\game\\baseball',[]),null);
});
test('the production batter sheet has a nonzero frame box in the isolated CinemaLab',()=>{
 const result=transformBaseballSource('.existing-game-rule{}','C:/game/baseball/src/duel/duel.css','C:\\game\\baseball',[]);
 assert.ok(result.code.startsWith('.existing-game-rule{}'));assert.ok(result.code.includes('.cinema-lab-stage .batter-sheet-frame'));
 assert.ok(result.code.includes('height:100%;aspect-ratio:2/3'));
});
