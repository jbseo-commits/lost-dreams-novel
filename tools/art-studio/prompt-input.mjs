const OUTPUT_KINDS = new Set(['auto', 'actor', 'cg', 'background']);
const CHARACTER_REQUEST = /(?:인물|캐릭터|초상|전신|표정|자세|시선|portrait|character|actor)/i;
const SCENE_REQUEST = /(?:컷신|장면|\bcg\b)/i;
const BACKGROUND_REQUEST = /(?:배경|풍경|\b(?:environment|background|landscape)\b)/i;

const KOREAN_ALIASES = {
  seoin: ['서인'],
  jiwoo: ['지우'],
};

function englishNamePattern(value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^A-Za-z0-9])${escaped}(?=$|[^A-Za-z0-9])`, 'ig');
}

function aliasesFor(subject) {
  const aliases = new Set([subject.name, subject.id, ...(KOREAN_ALIASES[subject.id] || [])]);
  return [...aliases].filter(alias => typeof alias === 'string' && alias.trim());
}

function findMentionedSubjects(prompt, subjects) {
  const matches = [];
  for (const subject of subjects) {
    if (!subject || typeof subject.id !== 'string') continue;
    let firstIndex = -1;
    for (const alias of aliasesFor(subject)) {
      if (/^[A-Za-z][A-Za-z0-9_-]*$/.test(alias)) {
        for (const match of prompt.matchAll(englishNamePattern(alias))) {
          const index = match.index + match[1].length;
          if (firstIndex < 0 || index < firstIndex) firstIndex = index;
        }
      } else {
        const index = prompt.indexOf(alias);
        if (index >= 0 && (firstIndex < 0 || index < firstIndex)) firstIndex = index;
      }
    }
    if (firstIndex >= 0) matches.push({ subject, index: firstIndex });
  }
  return matches.sort((a, b) => a.index - b.index).map(match => match.subject);
}

function inferKind(prompt, mentions) {
  if (mentions.length >= 2) return 'cg';
  const withoutNegation = prompt.replace(/\b(?:no|without)\s+(?:people|characters|actors)\b/gi,'').replace(/(?:인물|사람|캐릭터)\s*(?:은|는|이|가|를|을)?\s*(?:없이|없는|제외|넣지)/g,'');
  if (BACKGROUND_REQUEST.test(prompt) && mentions.length === 0 && !CHARACTER_REQUEST.test(withoutNegation)) return 'background';
  if (SCENE_REQUEST.test(prompt)) return 'cg';
  return 'actor';
}

function makeLabel(description, primarySubject) {
  const excerpt = description.replace(/\s+/g, ' ').trim().slice(0, 34).replace(/[\s,.;:!?·-]+$/u, '');
  return primarySubject?.name ? `${primarySubject.name} · ${excerpt}` : excerpt;
}

/** Resolve a free-form prompt into stable generation metadata without mutating input. */
export function resolvePromptInput(input, subjects = []) {
  if (!input || typeof input !== 'object') throw new Error('입력 정보를 확인해 주세요.');
  const promptMode = input.promptMode === undefined ? 'direction' : input.promptMode;
  if (promptMode === 'direction') return { ...input };
  if (promptMode !== 'free') throw new Error('프롬프트 모드를 확인해 주세요.');

  const userPrompt = typeof input.userPrompt === 'string' ? input.userPrompt : '';
  const description = userPrompt.trim();
  if (!description) throw new Error('프롬프트를 입력해 주세요.');
  if (userPrompt.length > 4000) throw new Error('프롬프트는 4,000자 이내로 입력해 주세요.');

  const outputKind = input.outputKind === undefined ? 'auto' : input.outputKind;
  if (!OUTPUT_KINDS.has(outputKind)) throw new Error('출력 종류를 확인해 주세요.');

  const mentioned = findMentionedSubjects(description, Array.isArray(subjects) ? subjects : []);
  if (outputKind === 'actor' && mentioned.length >= 2) {
    throw new Error('여러 인물이 포함되어 있어요. 출력 종류를 CG로 선택해 주세요.');
  }

  const selected = (Array.isArray(subjects) ? subjects : []).find(subject => subject?.id === input.subject);
  const referenceSubjects = mentioned.length ? mentioned : (selected ? [selected] : []);
  const primarySubject = mentioned[0] || selected;
  const kind = outputKind === 'auto' ? inferKind(description, mentioned) : outputKind;

  return {
    ...input,
    subject: primarySubject?.id ?? input.subject,
    kind,
    description,
    label: makeLabel(description, primarySubject),
    referenceSubjects: referenceSubjects.map(subject => subject.id),
    promptMode: 'free',
    expression: undefined,
    pose: undefined,
    gaze: undefined,
  };
}
