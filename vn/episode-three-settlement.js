// Chapter 3: cinematic handoff of Jiwoo's family settlement screen.
// All five anchors must match, in order. No new save coordinates or story facts.
export const SETTLEMENT_SOURCE = Object.freeze([
  '지우가 가족 계정의 정산 화면을 내밀었다. 광고 수익 재개일과 퇴사 취소가 같은 날짜 아래 있었다.',
  '서인은 화면을 받지 않았다.',
  '지우가 팔을 내렸다.',
  '“왜. 그거 도와주는 건 싫어?”',
  '서인은 열린 지원 목록을 닫았다. 정산 화면을 받아 읽었다. 잘못된 곳은 없었다.',
]);

const SHOTS = Object.freeze(['offer','discover','withdraw','question','accept']);
export function settlementShotForBeat(chapter, index) {
  if (chapter?.id !== '3' || !Number.isInteger(index) || index < 0 || !Array.isArray(chapter.beats)) return null;
  const beats = chapter.beats;
  const start = beats.findIndex((beat, i) => beat.text === SETTLEMENT_SOURCE[0] &&
    SETTLEMENT_SOURCE.every((text, offset) => beats[i + offset]?.text === text));
  const offset = index - start;
  return start < 0 || offset < 0 || offset >= SHOTS.length ? null :
    { start, index, shot: SHOTS[offset] };
}

// A diegetic camera layer over the existing authored two-shot: no fabricated dates,
// no new dialogue, and no second progress/playback system.
export class EpisodeThreeSettlement {
  constructor(stage, assets) {
    this.stage = stage;
    this.host = document.createElement('section');
    this.host.className = 'ep03-settlement';
    this.host.hidden = true;
    this.host.setAttribute('aria-hidden', 'true');
    this.host.innerHTML = `
      <div class="ep03-settlement-shade"></div>
      <div class="ep03-settlement-figures">
        <img class="ep03-settlement-seoin" alt="" draggable="false">
        <img class="ep03-settlement-jiwoo" alt="" draggable="false">
      </div>
      <div class="ep03-settlement-phone">
        <div class="ep03-settlement-device">
          <div class="ep03-settlement-device-bar" aria-hidden="true"></div>
          <div class="ep03-settlement-screen">
            <p class="ep03-settlement-kicker">가족 연계 계정</p>
            <p class="ep03-settlement-heading">정산 화면</p>
            <div class="ep03-settlement-date-card">
              <div class="ep03-settlement-day"><span>적용일</span><strong>같은 날짜</strong></div>
              <div class="ep03-settlement-entry"><i aria-hidden="true"></i><span>광고 수익 재개일</span></div>
              <div class="ep03-settlement-entry"><i aria-hidden="true"></i><span>퇴사 취소</span></div>
            </div>
            <div class="ep03-settlement-screen-lines" aria-hidden="true"><b></b><b></b><b></b></div>
          </div>
        </div>
      </div>
      <div class="ep03-settlement-glance" aria-hidden="true"></div>
    `;
    this.host.querySelector('.ep03-settlement-seoin').src = assets.seoinWorry || assets.seoinHome;
    this.host.querySelector('.ep03-settlement-jiwoo').src = assets.jiwooGuarded;
    stage.append(this.host);
  }
  render(chapter, index, { quiet = false, reducedMotion = false } = {}) {
    const cue = settlementShotForBeat(chapter, index);
    if (!cue) { this.clear(); return; }
    this.host.hidden = false;
    this.host.dataset.shot = cue.shot;
    this.host.dataset.motion = quiet || reducedMotion ||
      (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches) ? 'off' : 'on';
    this.stage.classList.add('ep03-settlement-playing');
  }
  clear() {
    this.host.hidden = true;
    this.host.dataset.shot = '';
    this.stage.classList.remove('ep03-settlement-playing');
  }
}
