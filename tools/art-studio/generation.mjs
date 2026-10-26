import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';

const python = 'C:/Users/정현아/.codex/skills/sprite-gen/.venv/Scripts/python.exe';
const skillRoot = 'C:/Users/정현아/.codex/skills/sprite-gen';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const cleanOutput = s => String(s || '').replace(/(?:api[_-]?key|token|authorization)(\s*[:=]\s*)\S+/ig, '$1[redacted]').slice(-12000);

export function buildPrompt(input, referencePath) {
  const intent = String(input.description || '').trim();
  const kind = input.kind;
  const sex = {seoin:'male',jiwoo:'female',mother:'middle-aged woman',father:'middle-aged man'};
  const identities=(input.referenceSubjects||[{id:input.subject,name:input.subjectName}]).map(row=>`${row.name||row.id} (${sex[row.id]||'as shown in the reference'})`).join(', ');
  const form = kind === 'actor' ? 'single full-body character portrait, transparent background, entire figure visible, no text' :
    kind === 'cg' ? 'cinematic visual-novel scene illustration, opaque full-bleed composition, no text' :
    kind === 'background' ? 'environment background illustration, opaque full-bleed composition, no characters, no text' : 'game art atlas sheet, clear evenly spaced cells, no text';
  return [
    `Create original ${input.project==='baseball'?'baseball game':'visual novel'} art. Preserve the depicted people as: ${identities}.`,
    `Artwork type: ${form}.`,
    input.promptMode === 'free' ? 'Follow the requested expression, pose, gaze, action and framing in the description. Where unspecified, choose a natural composition; do not override the description with preset directions.' : `Expression: ${input.expression || 'neutral'}. Pose: ${input.pose || 'standing'}. Gaze: ${input.gaze || 'forward'}.`,
    `Description: ${intent}`,
    'Use each attached locked canonical reference for that named person. Preserve each face, hairstyle, age, gender presentation and clothing. Keep the established reference linework, brush texture, color palette, lighting and shading; do not impose another generic art style. Do not copy a reference pose unless specified.',
    kind === 'background' ? 'The attached references provide art style only. Do not include any people in this environment.' : 'Include only the people requested above; reference attachment alone is not a request for an extra person. Keep relationships and interaction exactly as described; do not add romance, intimacy, or an implied relationship unless explicitly requested. Avoid extra people, extra limbs, logos, lettering, signatures or watermarks.'
  ].join('\n');
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide:true, shell:false, cwd:skillRoot, ...options });
    let stdout='', stderr='';
    child.stdout.on('data', b => { stdout += b.toString(); if (stdout.length > 20000) stdout = stdout.slice(-20000); });
    child.stderr.on('data', b => { stderr += b.toString(); if (stderr.length > 20000) stderr = stderr.slice(-20000); });
    child.on('error', reject); child.on('close', code => resolve({ code, stdout:cleanOutput(stdout), stderr:cleanOutput(stderr) }));
  });
}

export function createGenerator({ root, pythonPath = python, skillPath = skillRoot, onComplete }) {
  let running = false;
  return {
    get running() { return running; },
    async generate(job, request, subject, reference, referenceFile, stateFile) {
      if (running) throw Object.assign(new Error('A generation job is already running'), { status: 409 });
      running = true;
      const workDir = path.join(path.dirname(stateFile), 'runs', job.id);
      await fs.mkdir(workDir, { recursive:true });
      const promptPath = path.join(workDir, 'prompt.txt'), output = path.join(workDir, 'result.png'), report = path.join(workDir,'report.json');
      const references=reference.references||[reference];
      const referenceSubjects=references.map(item=>({id:item.subject,name:item.name}));
      const prompt = buildPrompt({ ...request, subjectName:subject.name,referenceSubjects }, referenceFile);
      await fs.writeFile(promptPath, prompt, 'utf8');
      const args = ['-X','utf8','-m','sprite_gen.cli','workflow','--kind','image','--image-provider','codex','--confirmed-access','codex'];
      let workflow;
      try {
        workflow = await run(pythonPath, args, { cwd:skillPath });
        let access = null; try { access = JSON.parse(workflow.stdout); } catch {}
        if (workflow.code !== 0 || access?.status !== 'ready') throw new Error(`Codex image workflow check did not pass. ${workflow.stderr || workflow.stdout}`);
        const genArgs = ['-X','utf8','-m','sprite_gen.cli','gen','--provider','codex','--prompt-file',promptPath,'--out',output,'--report',report];
        for(const item of references)genArgs.push('--ref',item.path);
        if (request.kind === 'actor') genArgs.push('--transparent','--decontam','auto');
        const result = await run(pythonPath, genArgs, { cwd:skillPath });
        if (result.code !== 0) throw new Error(`Image generation failed. ${result.stderr || result.stdout}`);
        const data = await fs.readFile(output);
        if (data.length < 32 || data.toString('hex',0,8)!=='89504e470d0a1a0a') throw new Error('Provider output is not a PNG image');
        const id = `gen-${crypto.randomUUID()}`;
        const destDir = path.join(path.dirname(stateFile),'candidates'); await fs.mkdir(destDir,{recursive:true});
        const dest = path.join(destDir,`${id}.png`); await fs.copyFile(output,dest);
        const info = { id, project:request.project, assetId:null, label:request.label, subject:request.subject, kind:request.kind, expression:request.expression, pose:request.pose, gaze:request.gaze, description:request.description, promptMode:request.promptMode||'direction', userPrompt:request.userPrompt, provider:'codex', url:`/candidates/${id}.png`, sourcePath:`.art-studio/candidates/${id}.png`, sha256:sha(data), width:data.readUInt32BE(16), height:data.readUInt32BE(20), referenceSha256:reference.sha256, referenceLocks:references.map(({subject,assetId,sha256})=>({subject,assetId,sha256})), status:'draft', checks:{identity:false,style:false,anatomy:false,scene:false}, note:'', createdAt:new Date().toISOString(), prompt };
        await onComplete(info, job.id); return info;
      } catch(error) { throw Object.assign(new Error(cleanOutput(error.message)),{ generation:true }); }
      finally { running = false; }
    }
  };
}
