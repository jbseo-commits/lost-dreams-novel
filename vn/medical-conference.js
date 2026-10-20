// A manuscript-bounded background for two explicitly located morning scenes.
// The screen artwork is blank: system numbers remain HTML, never burned into pixels.
// manuscript/ep031.md lines 3-114; manuscript/ep032.md lines 3-110.
export const MEDICAL_CONFERENCE_MORNING = './assets/ep31/bg-medical-conference-morning.svg';
const SCENES = Object.freeze({
 '31': { first:3, last:114, anchor:'백윤하가 회의실 문을 닫자 벽 전체가 병원 화면으로 바뀌었다.' },
 '32': { first:3, last:110, anchor:'백윤하가 회의실 화면에 숫자 세 개를 띄웠다.' },
});
export function medicalConferenceForBeat(chapter,index) {
 const spec=SCENES[String(chapter?.id)];
 if(!spec||!Array.isArray(chapter.beats)||!Number.isInteger(index)||index<0||index>=chapter.beats.length)return '';
 const beat=chapter.beats[index];
 const line=Number(beat.sourceLine);
 if(!Number.isInteger(line)||line<spec.first||line>spec.last)return '';
 // No staging if text/data no longer matches the anchored manuscript.
 if(!chapter.beats.some(b=>b.text?.includes(spec.anchor)))return '';
 return MEDICAL_CONFERENCE_MORNING;
}
