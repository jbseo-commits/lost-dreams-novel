import test from 'node:test';
import assert from 'node:assert/strict';
import { resolvePromptInput } from './prompt-input.mjs';
import { buildPrompt } from './generation.mjs';

test('free prompt keeps user pose without stale defaults and preserves named identities', () => {
  const request=resolvePromptInput({promptMode:'free',subject:'seoin',userPrompt:'서인과 지우가 앉아 서로를 본다. 컷신',expression:'웃음',pose:'standing',gaze:'right'},[{id:'seoin',name:'서인'},{id:'jiwoo',name:'지우'}]);
  const prompt=buildPrompt({...request,referenceSubjects:[{id:'seoin',name:'서인'},{id:'jiwoo',name:'지우'}]});
  assert.match(prompt,/서인 \(male\), 지우 \(female\)/);
  assert.match(prompt,/서인과 지우가 앉아 서로를 본다/);
  assert.doesNotMatch(prompt,/Expression:|Pose: standing|Gaze: right/);
});

test('background negations and transparent actor prompts resolve correctly', () => {
  for(const userPrompt of ['사람 없이 빈 사무실 배경','인물 없는 배경 장면','environment background with no characters']){
    const resolved=resolvePromptInput({promptMode:'free',userPrompt,subject:'seoin'},[{id:'seoin',name:'서인'}]);
    assert.equal(resolved.kind,'background');
    assert.match(buildPrompt(resolved),/style only. Do not include any people/);
  }
  assert.equal(resolvePromptInput({promptMode:'free',userPrompt:'놀란 표정으로 움츠린 전신. 투명 배경',subject:'seoin'},[{id:'seoin',name:'서인'}]).kind,'actor');
});

const subjects = [
  { id: 'seoin', name: '서인' },
  { id: 'jiwoo', name: '지우' },
  { id: 'hakyung', name: '하경' },
];
const free = (userPrompt, rest = {}) => ({ promptMode: 'free', userPrompt, ...rest });

test('explicit references preserve mention order and Korean aliases', () => {
  const out = resolvePromptInput(free('Jiwoo와 서인이 함께 있는 장면'), subjects);
  assert.equal(out.subject, 'jiwoo');
  assert.deepEqual(out.referenceSubjects, ['jiwoo', 'seoin']);
  assert.equal(out.kind, 'cg');
});

test('English IDs match boundaries but not substrings', () => {
  assert.deepEqual(resolvePromptInput(free('hakyung portrait'), subjects).referenceSubjects, ['hakyung']);
  assert.deepEqual(resolvePromptInput(free('hakyungish portrait'), subjects).referenceSubjects, []);
});

test('no explicit name uses the selected subject for subject and reference', () => {
  const out = resolvePromptInput(free('차분한 표정', { subject: 'seoin' }), subjects);
  assert.equal(out.subject, 'seoin');
  assert.deepEqual(out.referenceSubjects, ['seoin']);
});

test('auto kind recognizes scene, background, character override, and explicit kinds', () => {
  assert.equal(resolvePromptInput(free('밤의 장면'), subjects).kind, 'cg');
  assert.equal(resolvePromptInput(free('바다와 산의 풍경'), subjects).kind, 'background');
  assert.equal(resolvePromptInput(free('서인 배경의 인물 초상'), subjects).kind, 'actor');
  assert.equal(resolvePromptInput(free('풍경', { outputKind: 'cg' }), subjects).kind, 'cg');
});

test('explicit actor rejects multiple named people and suggests CG', () => {
  assert.throws(() => resolvePromptInput(free('서인과 지우', { outputKind: 'actor' }), subjects), /CG/);
});

test('free prompt trims description, creates concise label, and clears stale fields without mutation', () => {
  const input = free('  서인\n웃는 모습  ', {
    subject: 'jiwoo', expression: 'angry', pose: 'sitting', gaze: 'right',
  });
  const out = resolvePromptInput(input, subjects);
  assert.equal(out.description, '서인\n웃는 모습');
  assert.match(out.label, /서인 · 서인 웃는 모습/);
  assert.equal(out.expression, undefined);
  assert.equal(out.pose, undefined);
  assert.equal(out.gaze, undefined);
  assert.equal(input.subject, 'jiwoo');
  assert.equal(input.expression, 'angry');
});

test('missing, oversized, invalid mode, and invalid kind fail with Korean errors', () => {
  assert.throws(() => resolvePromptInput(free('   '), subjects), /프롬프트/);
  assert.throws(() => resolvePromptInput(free('x'.repeat(4001)), subjects), /4,000/);
  assert.throws(() => resolvePromptInput({ promptMode: 'other' }, subjects), /모드/);
  assert.throws(() => resolvePromptInput(free('x', { outputKind: 'wat' }), subjects), /종류/);
});

test('legacy direction input is returned unchanged by value', () => {
  const input = { promptMode: 'direction', expression: 'smile', pose: 'standing' };
  assert.deepEqual(resolvePromptInput(input, subjects), input);
  assert.equal(input.expression, 'smile');
  const legacy = { expression: 'smile' };
  assert.deepEqual(resolvePromptInput(legacy, subjects), legacy);
});
