import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { normalizeStory } from './state.js';
import { backgroundForLocation, SENIOR_CENTER_EVENING } from './location-backgrounds.js';

const box = { window: {} };
vm.runInNewContext(await fs.readFile(new URL('./story-data.js', import.meta.url), 'utf8'), box);
const raw = JSON.parse(JSON.stringify(box.window.STORY));

test('actual game-normalized story resolves only the reviewed 39th-chapter interior', () => {
  for (const story of [raw, normalizeStory(raw)]) {
    const matches = story.chapters.flatMap(chapter => chapter.beats.flatMap((beat, index) =>
      backgroundForLocation(chapter, beat) ? [{ chapter: chapter.id, index, beat }] : []));
    assert.equal(matches.length, 185);
    assert(matches.every(item => item.chapter === '39'));
    assert.equal(matches[0].beat.text, '“나 왔어요. 오늘은 아들 데려왔어.”');
    assert.equal(matches.at(-1).beat.text, '김 영감은 대꾸하지 않고 바둑알을 통에 쓸어 담았다.');
    const chapter = story.chapters.find(item => item.id === '39');
    assert.equal(backgroundForLocation(chapter, chapter.beats.find(beat => beat.text === '서인은 노인정 앞 계단에 앉았다.')), null);
    assert.equal(backgroundForLocation(chapter, chapter.beats[0]), null);
  }
});

test('source revisions and other room states cannot silently inherit the plate', () => {
  const story = normalizeStory(raw), chapter = story.chapters.find(item => item.id === '39');
  const beat = chapter.beats.find(item => item.text.includes('군용 담요'));
  assert.equal(backgroundForLocation(chapter, beat), SENIOR_CENTER_EVENING);
  const changed = structuredClone(chapter);
  changed.beats.find(item => item.sourceLine === 27).text = '장면 시작 문장이 개정됨';
  assert.equal(backgroundForLocation(changed, beat), null);
  assert.equal(backgroundForLocation({ ...chapter, sourcePath: 'loop/held/ep039.md' }, beat), null);
  assert.equal(backgroundForLocation(chapter, { ...beat, sourceLine: 403, endLine: 407 }), null);
  for (const id of ['40', '43', '44', '47', '66', '70']) {
    const other = story.chapters.find(item => item.id === id);
    assert(other.beats.every(item => backgroundForLocation(other, item) === null), id);
  }
});
