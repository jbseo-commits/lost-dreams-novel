import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('./reader-inline-direction.js', import.meta.url), 'utf8');
const window = {};
vm.runInNewContext(source, {window, document:{querySelectorAll:()=>[]}, innerHeight:800});
const direction = window.ReaderInlineDirection;

test('direction scenes stay within their exact source anchors', () => {
  const before = direction.decorate('19', '예상 도착 시각을 열었다. 오전 7시 이후.', '<p class="reveal">예상 도착 시각을 열었다. 오전 7시 이후.</p>', 'p');
  assert.match(before, /data-direction="delivery-system"/);
  assert.doesNotMatch(before, /06시 전|6시 전/);
  const after = direction.decorate('19', '공동주방에 나간 안내문에는 오전 6시 전 도착이라고 버젓이 적혀 있었다.', '<p class="reveal">안내문</p>', 'p');
  assert.match(after, /data-direction="delivery-promise"/);
});

test('the manuscript message remains the only copy in styled system and personal cards', () => {
  const text = '거기 진짜 끄는 데야?';
  const html = direction.decorate('20', text, `<div class="sys reveal">${text}</div>`, 'sys');
  assert.match(html, /direction-personal/);
  assert.equal((html.match(/거기 진짜 끄는 데야\?/g) || []).length, 1);
});

test('dream to morning and average-field snapshots do not reveal later data', () => {
  const dream = direction.decorate('21-1', '엄마.', '<p class="reveal">엄마.</p>', 'p');
  assert.match(dream, /data-direction="dream-to-morning"/);
  assert.doesNotMatch(dream, /꿈속 주황|아침 빛/);
  assert.doesNotMatch(dream, /05:40|05:43|05:47|05:50|06:12/);
  const empty = direction.decorate('22-1', '둘째 칸 이름을 지우고 다시 썼다.', '<p class="reveal">둘째 칸 이름을 지우고 다시 썼다.</p>', 'p');
  assert.match(empty, /data-direction="average-field"/);
  assert.doesNotMatch(empty, /소속 조직 평균/);
});

test('the brief tenth-floor count and zero start do not invent a completed result', () => {
  const tenth = direction.decorate('21-1', '잠시 뒤 숫자가 열이 됐다.', '<p class="reveal">잠시 뒤 숫자가 열이 됐다.</p>', 'p');
  assert.match(tenth, /data-direction="rescue-10"/);
  assert.doesNotMatch(tenth, /구조 10 \/ 12/);
  const zero = direction.decorate('22-1', '첫 숫자가 0에서 올라가기 시작했다.', '<p class="reveal">첫 숫자가 0에서 올라가기 시작했다.</p>', 'p');
  assert.match(zero, /data-direction="zero-start"/);
  assert.doesNotMatch(zero, />1</);
});

test('only the requested eight chapters have inline direction anchors', () => {
  const chapters = [...new Set(direction.scenes.map(s => s.ep))].sort();
  assert.deepEqual(chapters, ['19','19-1','20','20-1','21','21-1','22','22-1']);
});

test('delivery timelines share the 07:00 dispatch axis and keep afternoon on a separate clock', () => {
  const plan = direction.decorate('19', '06:30 수령. 07:00 교대 기사 출차 전.', '<p class="reveal">06:30 수령. 07:00 교대 기사 출차 전.</p>', 'p');
  const afterSeven = direction.decorate('19', '예상 도착 시각을 열었다. 오전 7시 이후.', '<p class="reveal">예상 도착 시각을 열었다. 오전 7시 이후.</p>', 'p');
  assert.match(plan, /M117 22v24/);
  assert.match(afterSeven, /M117 22v24/);
  assert.match(afterSeven, /M117 34h51/);
  const promise = direction.decorate('19', '공동주방에 나간 안내문에는 오전 6시 전 도착이라고 버젓이 적혀 있었다.', '<p class="reveal">안내문</p>', 'p');
  assert.match(promise, /M117 22v24/);
  assert.doesNotMatch(afterSeven, /07:40/);
  const afternoon = direction.decorate('19-1', '5시 31분. 서인이 식품 담당자 대신 공동주방에 전화를 걸었다.', '<p class="reveal">5시 31분.</p>', 'p');
  assert.match(afternoon, /17:06/);
  assert.match(afternoon, /17:31/);
  assert.match(afternoon, /17:40/);
  assert.match(afternoon, /오후/);
  assert.doesNotMatch(afternoon, /05:18/);
});

test('the branch comparison states both source quantities and the bad-luck condition', () => {
  const html = direction.decorate('19', 'A를 누르자 옆 동네에 불이 몇 개 켜졌다. 서른여섯 집. 그것도 운이 나쁠 때 얘기였다.', '<p class="reveal">A를 누르자 옆 동네에 불이 몇 개 켜졌다.</p>', 'p');
  assert.match(html, /B · 2,400집 불 켜짐/);
  assert.match(html, /운 나쁠 때/);
  assert.match(html, /36집/);
});

test('the count-sensitive recovery choice waits until the eleven public checks are introduced', () => {
  const earlier = '회사 연산을 지금 회수하면 아이의 네 번째 검증은 1시 40분 전후로 당겨질 수 있다. 대신 그 연산으로 돌고 있던 공공 검증을 중간에 끊어야 한다. 끊긴 검사를 다시 돌리면 언제 끝날지는 아무도 장담 못 한다.';
  const earlyHtml = direction.decorate('22', earlier, `<p class="reveal">${earlier}</p>`, 'p');
  assert.doesNotMatch(earlyHtml, /data-direction="compute-branch"|11건 진행 중/);
  const text = '진행 중 열한 건. 맨 위는 일흔한 살 남자의 수술 전 검사. 진행률 82%.';
  const html = direction.decorate('22', text, `<p class="reveal">${text}</p>`, 'p');
  assert.ok(html.indexOf('data-direction="compute-82"') < html.indexOf('data-direction="compute-branch"'));
  assert.match(html, /data-direction="compute-branch"/);
  assert.match(html, /공공 검증 11건 진행 중/);
  assert.match(html, /1:40 전후/);
  assert.match(html, /공공 11 중단/);
  assert.match(html, /재검증 시각 미정/);
  assert.doesNotMatch(html, /대기 4|4건 내일/);
});

test('queue movement includes its label, and unavailable art does not get a decorative fallback line', () => {
  const queue = direction.decorate('19', '그때, 목록 맨 위로 새 줄 하나가 밀고 올라왔다.', '<p class="reveal">새 줄</p>', 'p');
  assert.match(queue, /class="id-queue-old" x="70" y="13"/);
  assert.match(queue, /class="id-queue-new" x="70" y="35"/);
  const simple = direction.decorate('22', '기업 제4 의료 검증 지연 한도: 3시간.', '<p class="reveal">한도</p>', 'p');
  assert.match(simple, /direction-system-limit/);
  assert.doesNotMatch(simple, /data-direction|M8 21h164/);
});

test('the original renamed-alarm line is styled in place without repeating its copy', () => {
  const source = '05:40 알람 이름을 바꿨다.';
  const html = direction.decorate('20-1', source, '<p class="reveal">05:40 알람 이름을 바꿨다.</p>', 'p');
  assert.match(html, /direction-alarm-rename/);
  assert.equal((html.match(/05:40/g) || []).length, 1);
  const named = direction.decorate('20-1', '일어나기 / 우유', '<p class="reveal"><strong>일어나기 / 우유</strong></p>', 'p');
  assert.match(named, /direction-alarm-name-word/);
  assert.equal((named.match(/일어나기 \/ 우유/g) || []).length, 1);
  const repeat = direction.decorate('20-1', '일어나기 / 우유', '<p class="reveal"><strong>일어나기 / 우유</strong></p>', 'p');
  assert.doesNotMatch(repeat, /direction-alarm-name-word/);
});

test('separate source clock lines stay in prose and all scene kinds avoid generic fallback art', () => {
  const mother = direction.decorate('20-1', '은경의 휴대폰에는 **05:40**이 켜져 있었다.', '<p class="reveal">은경의 휴대폰에는 <strong>05:40</strong>이 켜져 있었다.</p>', 'p');
  const daughter = direction.decorate('20-1', '해린의 휴대폰에는 **06:00**이 남아 있었다.', '<p class="reveal">해린의 휴대폰에는 <strong>06:00</strong>이 남아 있었다.</p>', 'p');
  assert.match(mother, /direction-phone-0540/);
  assert.match(daughter, /direction-phone-0600/);
  assert.doesNotMatch(mother + daughter, /data-direction|M8 21h164/);
  const deadline = direction.decorate('21', '12분.', '<p class="reveal">12분.</p>', 'p');
  assert.match(deadline, /direction-deadline-mark/);
  assert.doesNotMatch(deadline, /data-direction|M8 21h164/);
  for (const {ep,anchor} of direction.scenes) assert.doesNotMatch(direction.afterParagraph(ep,anchor).join(''), /M8 21h164/);
});
