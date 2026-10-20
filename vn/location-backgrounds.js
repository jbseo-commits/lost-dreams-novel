// Source-checked background plates. A shared location label is not permission
// to reuse a plate across different lighting, furniture or event states.
export const SENIOR_CENTER_EVENING = './assets/ep39/bg-senior-center-evening.webp';

export function backgroundForLocation(chapter, beat) {
  if (chapter?.id !== '39' || chapter.sourcePath !== 'manuscript/ep039.md' || beat?.scene !== 'neutral') return null;
  const start = beat.sourceLine, end = beat.endLine ?? start;
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 27 || end < start || end > 403) return null;
  // Fail closed if the source boundaries change. Save indices and story text
  // stay untouched; a new manuscript revision requires another source review.
  const opening = chapter.beats?.find(item => item.sourceLine === 27);
  const closing = chapter.beats?.find(item => item.sourceLine === 403);
  if (opening?.text !== '“나 왔어요. 오늘은 아들 데려왔어.”' ||
      closing?.text !== '김 영감은 대꾸하지 않고 바둑알을 통에 쓸어 담았다.') return null;
  return SENIOR_CENTER_EVENING;
}
