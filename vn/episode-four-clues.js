// Episode 4: source-bound clues. Never create evidence not yet present in the current beat.
export const EP04_CLUES = Object.freeze({
  '시계': Object.freeze({asset:'ep04ClueWatch',detail:'손이 되풀이해 향한 곳',alt:'인물 얼굴 없이 손목시계를 만지는 손 클로즈업'}),
  '메시지': Object.freeze({asset:'ep04ClueMessage',detail:'읽고 곧바로 뒤집은 화면',alt:'한 대의 휴대폰을 읽고 테이블 위로 뒤집는 손 클로즈업'}),
  '시선': Object.freeze({asset:'ep04ClueGaze',detail:'회의가 끝나도 문으로 가지 않은 눈',alt:'얼굴이 보이지 않는 참석자와 회의실 출입구의 뒷모습'}),
});
export const ep04ClueFor = label => Object.hasOwn(EP04_CLUES,label) ? EP04_CLUES[label] : null;
