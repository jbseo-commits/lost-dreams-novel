import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const manifest=JSON.parse(fs.readFileSync(path.join(root,'source-manifest.json'),'utf8'));
const output={sha:manifest.sha,sourceFiles:manifest.files.length,sourceErrors:[],readers:[]};
for(const f of manifest.files){const b=fs.readFileSync(path.join(root,'source',f.path));const h=crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');if(h!==f.sha)output.sourceErrors.push(f.path);}
for(let i=1;i<=6;i++){
const dir=path.join(root,'reader-workspaces','reader'+i),p=path.join(dir,'state.json');
if(!fs.existsSync(p)){output.readers.push({reader:i,started:false});continue;}
const s=JSON.parse(fs.readFileSync(p,'utf8'));
const events=fs.readFileSync(path.join(dir,'events.jsonl'),'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const errors=[],quotes=[],rawQuotes=[],appliedCorrections=[];
const correctionPath=path.join(dir,'corrections.json');
const corrections=fs.existsSync(correctionPath)?JSON.parse(fs.readFileSync(correctionPath,'utf8')):[];
let lastReason=-1;
for(let j=0;j<s.completed.length;j++){
const e=s.completed[j],f=manifest.files[j];
if(e.order!==f.order||e.path!==f.path)errors.push('order mismatch '+j);
const read=events.findIndex(x=>x.type==='read'&&x.order===e.order),vote=events.findIndex(x=>x.type==='vote'&&x.order===e.order),reason=events.findIndex(x=>x.type==='reason'&&x.order===e.order);
if(!(read>lastReason&&vote>read&&reason>vote))errors.push('event order '+e.order);
if(events.filter(x=>x.type==='vote'&&x.order===e.order).length!==1||events.filter(x=>x.type==='reason'&&x.order===e.order).length!==1)errors.push('duplicate/missing decision '+e.order);
if(events[vote]?.choice!==e.vote)errors.push('stored vote mismatch '+e.order);
lastReason=reason;
const lines=fs.readFileSync(path.join(root,'source',e.path),'utf8').split('\n');
if(e.quote&&(!lines.join('\n').includes(e.quote)||!lines[Number(e.line)-1]?.includes(e.quote)))rawQuotes.push({order:e.order,path:e.path,line:e.line,quote:e.quote});
const correction=corrections.find(c=>c.order===e.order);
const effectiveQuote=correction?(correction.corrected??correction.quote):e.quote;const effectiveLine=correction?.line??e.line;
if(correction)appliedCorrections.push({order:e.order,path:e.path,line:effectiveLine,quote:effectiveQuote});
if(effectiveQuote&&!lines.join('\n').includes(effectiveQuote))quotes.push({order:e.order,path:e.path,line:effectiveLine,error:'quote absent after correction'});
else if(effectiveQuote&&effectiveLine&&!lines[Number(effectiveLine)-1]?.includes(effectiveQuote))quotes.push({order:e.order,path:e.path,line:effectiveLine,error:'quote not at stated line after correction',actualLines:lines.flatMap((x,k)=>x.includes(effectiveQuote)?[k+1]:[])});
if(s.firstC&&e.order>s.firstC.order&&e.mode!=='업무 독서')errors.push('mode '+e.order);
}
const cs=s.completed.filter(e=>e.vote==='C');
if((s.firstC?.order??null)!==(cs[0]?.order??null))errors.push('first C mismatch');
output.readers.push({reader:i,started:true,completed:s.completed.length,read:s.completed.map(e=>e.path),unread:manifest.files.slice(s.completed.length).map(e=>e.path),eventErrors:errors,quoteIssues:quotes,originalQuoteIssues:rawQuotes,appliedCorrections,finalReport:fs.existsSync(path.join(dir,'final-report.md'))});
}
fs.writeFileSync(path.join(root,'evidence','validation.json'),JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({sourceFiles:output.sourceFiles,sourceErrors:output.sourceErrors,readers:output.readers.map(({reader,started,completed,eventErrors,quoteIssues,finalReport})=>({reader,started,completed,eventErrors,quoteIssues,finalReport}))},null,2));