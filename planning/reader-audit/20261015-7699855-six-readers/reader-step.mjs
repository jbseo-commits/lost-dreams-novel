import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const id=process.argv[2], action=process.argv[3];
if(!/^reader[1-6]$/.test(id))throw Error('Invalid reader');
const dir=path.join(root,'reader-workspaces',id);fs.mkdirSync(dir,{recursive:true});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'source-manifest.json'),'utf8'));
const statePath=path.join(dir,'state.json'),eventsPath=path.join(dir,'events.jsonl');
let state=fs.existsSync(statePath)?JSON.parse(fs.readFileSync(statePath,'utf8')):{next:0,current:null,firstC:null,completed:[]};
const event=(type,data={})=>fs.appendFileSync(eventsPath,JSON.stringify({time:new Date().toISOString(),type,...data})+'\n');
const save=()=>fs.writeFileSync(statePath,JSON.stringify(state,null,2)+'\n');
function readNext(){
 if(state.current)throw Error('Current file needs vote and reason first');
 if(state.next>=manifest.files.length){console.log('END: all 125 files completed. Prepare final report from your own records.');save();return;}
 const f=manifest.files[state.next];
 const text=fs.readFileSync(path.join(root,'source',f.path),'utf8');
 state.current={order:f.order,label:f.label,path:f.path,kind:f.kind,mode:state.firstC?'업무 독서':'자발 독서',vote:null};
 event('read',state.current);save();
 console.log(JSON.stringify({reading:state.current,totalFiles:manifest.files.length,sha:manifest.sha}));
 console.log(text.split('\n').map((s,i)=>String(i+1).padStart(4,'0')+' | '+s).join('\n'));
 console.log('END FILE '+f.path+' — vote A/B/C BEFORE explaining; do not read next file yet.');
}
if(action==='read'){readNext();}
else if(action==='vote'){
 const choice=process.argv[4],line=Number(process.argv[5]||0);
 if(!state.current||state.current.vote)throw Error('No undecided current file');
 if(!['A','B','C'].includes(choice))throw Error('Invalid choice');
 state.current.vote=choice;state.current.line=line||null;
 event('vote',{order:state.current.order,label:state.current.label,path:state.current.path,choice,line:line||null,mode:state.current.mode});
 if(choice==='C'&&!state.firstC)state.firstC={...state.current};
 save();console.log(JSON.stringify({fixedVote:state.current,firstC:state.firstC}));
}
else if(action==='reason'){
 if(!state.current?.vote)throw Error('Vote must be fixed before reason');
 const input=fs.readFileSync(0,'utf8').replace(/^\uFEFF/,'').trim();
 const detail=JSON.parse(input);
 if(typeof detail.reason!=='string'||!detail.reason.trim())throw Error('Missing reason');
 const entry={...state.current,...detail};
 event('reason',{order:entry.order,...detail});state.completed.push(entry);
 state.next++;state.current=null;save();
 fs.writeFileSync(path.join(dir,'episode-log.json'),JSON.stringify(state.completed,null,2)+'\n');
 if(process.argv.includes('--next'))readNext();else console.log(JSON.stringify({completed:entry,nextOrder:state.next+1}));
}
else if(action==='status'){console.log(JSON.stringify({completed:state.completed.length,firstC:state.firstC,current:state.current,next:manifest.files[state.next]?.path??null}));}
else throw Error('Actions: read | vote A/B/C [line] | reason [--next] (JSON on stdin) | status');
