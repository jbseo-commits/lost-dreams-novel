// The manuscript remains the only source of text. Direction is applied to its existing paragraphs.
window.ReaderInlineDirection = (() => {
  let classObserver = null, motionMedia = null, motionChange = null, renameWordListener = null;
  let renameWordPending = false, alarmListActive = false;
  const scenes = [
    ['19','창문 2,400개에 한꺼번에 불이 들어왔다.','fork-b'],
    ['19','A를 누르자 옆 동네에 불이 몇 개 켜졌다. 서른여섯 집. 그것도 운이 나쁠 때 얘기였다.','fork-compare'],
    ['19','손을 화면에서 뗐다.','fork-release'], ['19','“A요.”','fork-a'],
    ['19','그때, 목록 맨 위로 새 줄 하나가 밀고 올라왔다.','queue-one'], ['19','목록 위로 또 한 줄.','queue-two'],
    ['19','06:30 수령. 07:00 교대 기사 출차 전.','delivery-plan'], ['19','예상 도착 시각을 열었다. 오전 7시 이후.','delivery-system'],
    ['19','공동주방에 나간 안내문에는 오전 6시 전 도착이라고 버젓이 적혀 있었다.','delivery-promise'],
    ['19-1','공동주방에서 5시 40분까지 답 달래요. 넘기면 딴 가게에서 산대요. 새벽 6시에 재료 들어가야 6시 반에 기사들 도시락이랑 애들 아침이 나가는데.','clock-540'],
    ['19-1','벽시계는 5시 6분.','clock-506'], ['19-1','5시 31분. 서인이 식품 담당자 대신 공동주방에 전화를 걸었다.','clock-531'],
    ['19-1','회사 시스템은 이 주문이 아직도 자기 경로로 가는 중이라고 믿고 있었다.','delivery-740'],
    ['19-1','05:18 도착. 07:00 전원 출차.','delivery-518'],
    ['20','공동주방 주문은 새벽 5시 18분에 도착했습니다.','delivery-518-review'],
    ['20','시스템 대체 경로의 도착 예정은 오전 7시 40분이었습니다.','delivery-740-review'],
    ['20','한 칸이었다.','one-cell'], ['20','접수 14:02. 의료 지원 신규. 심사 대기.','pending-row'],
    ['20','한 칸이 두 칸으로 쪼개졌다.','two-cells'], ['20','접수 14:02 줄은 아래 칸으로 내려갔다.','row-moves'],
    ['20-1','알람은 세 개였다.','alarm-three'], ['20-1','은경이 05:50을 하나 더 만들었다.','alarm-550'],
    ['21','왼쪽엔 접수 완료. 오른쪽엔 차액 회수.','contract-overlap'], ['21','오후 10시 18분, 운영 회의실.','deadline-start'],
    ['21','10시 30분에 묶어서 넘깁니다. 지금 보류하면 오늘 변경은 못 받아요.','deadline-1030'],
    ['21','변경 적용 시 실제 계약 조건으로 재정산.','small-clause'],
    ['21','1시 32분. 목록이 넘어가기까지 2분, 문해린에게 다시 걸기로 한 1시 39분까지 7분.','clock-0132-0139'],
    ['21','1시 34분에 목록이 아침 처리로 넘어갑니다. 그 전에 넣으셔야 해요.','deadline-0134'],
    ['21','1시 33분이었다.','clock-0133'], ['21','1시 36분, 문해린에게 다시 전화를 걸었다.','clock-0136'],
    ['21-1','구조 0 / 12.','rescue-0'],
    ['21-1','3층에서 남자 둘을 데리고 나왔다. 한 사람은 걸을 수 있었고, 다른 사람은 발을 디디지 못했다.','floor-3'],
    ['21-1','5층의 여자 셋은 서로 붙잡고 있었다.','floor-5'], ['21-1','7층 복도에서는 네 사람이 엎드려 기침하고 있었다.','floor-7'],
    ['21-1','구조 2 / 12.','rescue-2'], ['21-1','구조 5 / 12.','rescue-5'], ['21-1','구조 9 / 12.','rescue-9'],
    ['21-1','잠시 뒤 숫자가 열이 됐다.','rescue-10'], ['21-1','구조 11 / 12.','rescue-11'], ['21-1','구조 12 / 12.','rescue-12'],
    ['21-1','엄마.','dream-to-morning'], ['21-1','딸이 화면을 내밀었다. 05:40, 05:43, 05:47, 05:50.','alarm-screen'],
    ['21-1','계단 중간이 떨어져 나갔다.','floor-break'],
    ['22','진행 중 열한 건. 맨 위는 일흔한 살 남자의 수술 전 검사. 진행률 82%.','compute-82'],
    ['22','목록 맨 윗줄에서 82%가 83%로 넘어가고 있었다.','compute-83'],
    ['22','대기 넷은 내일로 넘어갔다. 이미 시작한 열한 건은 계속 돌았다.','compute-continue'],
    ['22','수술 전 검사 · 완료.','compute-complete'],
    ['22','진행 중 열한 건. 맨 위는 일흔한 살 남자의 수술 전 검사. 진행률 82%.','compute-branch'],
    ['22-1','새벽 5시 52분, 백윤하의 단말에 회의 소집이 떴다.','meeting-552'],
    ['22-1','보고서를 먼저 끝냈다. 6시 40분이었다.','meeting-640'], ['22-1','7시 30분, 25층 회의실.','meeting-730'],
    ['22-1','8시 58분, 인지안전실.','meeting-858'], ['22-1','둘째 칸 이름을 지우고 다시 썼다.','average-field'],
    ['22-1','소속 조직 평균.','average-final'], ['22-1','9시 정각에 누르려다 손을 멈췄다.','meeting-900'],
    ['22-1','9시 12분, 게시 버튼을 눌렀다.','meeting-912'], ['22-1','첫 숫자가 0에서 올라가기 시작했다.','zero-start'],
  ].map(([ep,anchor,kind]) => Object.freeze({ep,anchor,kind}));

  const personal = [
    ['20','거기 진짜 끄는 데야?'], ['20','지금은 감사 중이야.'], ['20','내 건 끄지 마.'],
    ['20-1','우유 없음'], ['20-1','내일 사갈게'], ['20-1','안 까먹게 알람 해'],
    ['21','엄마 오늘 꿈 바꿨어?'], ['21','응. 센 걸로. 돈 더 준대서.'], ['21','문자 그만. 지금 놀고 있어요.'],
    ['21','예약 그대로라고 들었습니다.'], ['21','아이는 아직 자요.'], ['21','엄마 꿈 진짜 재밌었다. 돈은 언제 들어와?'],
    ['19-1','모레 감사실 들어가기 전에, 먼저 드릴 말씀이 있습니다.'], ['19-1','어젯밤 기지 건 보고받았습니다. 감사 전까지 혼자 이동하지 마십시오.'],
  ];
  const system = [
    ['19','접수: 1분 전.'], ['19','접수: 방금.'], ['19-1','기존 경로: 도착 07:10.'],
    ['19-1','신규 경로: 확보. 도착 시각 —.'], ['19-1','새 배송 경로로 주문이 도착합니다. 도착 예정 07:40.'],
    ['20','동부 물류기지 / 대체 경로 운행 완료. 납품 지속 가능.'], ['20','시스템 대체 경로: 도착 07:40, 고객 조건 미충족. 실제 납품: 예비 차량 수동 출동.'],
    ['20','생존 정산 보호 절차 확인.'], ['20','신규 요청은 별도 심사. 보호 확인에 포함하지 않음.'], ['20','보호 범위 열람 확인.'],
    ['20-1','추가 검증 완료 예정 06:00'], ['21','변경 적용 시 실제 계약 조건으로 재정산.'],
    ['22','기업 제4 의료 검증 지연 한도: 3시간.'], ['22','지원: 오늘 밤 1회.'],
    ['22-1','임시 임원회의 · 07:30 · 안건 1건.'],
    ['22-1','인지안전실장 해임 및 제4 검증층 영구 비공유 결의 (제안: 전략본부 마정훈 상무).'],
    ['22-1','제4 의료 검증 예비층 자발적 공유 시범.'], ['22-1','소속 조직 평균.'],
  ];

  function tagExisting(html, classes, directions = []) {
    const match = html.match(/^<(p|div)\b[^>]*>/);
    if (!match) return html;
    let tag = match[0];
    const classMatch = tag.match(/\bclass="([^"]*)"/);
    if (classMatch) tag = tag.replace(classMatch[0], `class="${classMatch[1]} ${classes.join(' ')}"`);
    else tag = tag.replace(/^<(p|div)/, `$& class="${classes.join(' ')}"`);
    if (directions.length) tag = tag.replace(/^<(p|div)\b/, `<$1 data-directions="${directions.join(' ')}"`);
    return tag + html.slice(match[0].length);
  }
  const emphasis = {
    'fork-b':['창문 2,400개'], 'fork-compare':['서른여섯 집','운이 나쁠 때'],
    'queue-one':['새 줄 하나'], 'queue-two':['또 한 줄'],
    'delivery-plan':['06:30 수령','07:00 교대 기사 출차 전'], 'delivery-system':['오전 7시 이후'],
    'delivery-promise':['오전 6시 전 도착'], 'clock-540':['5시 40분까지','새벽 6시'], 'clock-506':['5시 6분'],
    'clock-531':['5시 31분'], 'delivery-740':['07:40'], 'delivery-518':['05:18 도착','07:00 전원 출차'],
    'delivery-518-review':['5시 18분'], 'delivery-740-review':['7시 40분'], 'one-cell':['한 칸'],
    'pending-row':['14:02','심사 대기'], 'two-cells':['두 칸'], 'row-moves':['14:02','아래 칸'],
    'alarm-three':['세 개'], 'alarm-550':['05:50'], 'contract-overlap':['접수 완료','차액 회수'],
    'deadline-start':['오후 10시 18분'], 'deadline-1030':['10시 30분'], 'small-clause':['실제 계약 조건'],
    'clock-0132-0139':['1시 32분','1시 39분까지 7분'], 'deadline-0134':['1시 34분'],
    'clock-0133':['1시 33분'], 'clock-0136':['1시 36분'], 'rescue-0':['0 / 12'],
    'floor-3':['3층','남자 둘'], 'floor-5':['5층','여자 셋'], 'floor-7':['7층','네 사람'],
    'rescue-2':['2 / 12'], 'rescue-5':['5 / 12'], 'rescue-9':['9 / 12'], 'rescue-11':['11 / 12'], 'rescue-12':['12 / 12'],
    'alarm-screen':['05:40, 05:43, 05:47, 05:50'], 'floor-break':['계단 중간'],
    'compute-82':['82%'], 'compute-83':['82%가 83%'], 'compute-continue':['열한 건','대기 넷'],
    'compute-complete':['완료'], 'compute-branch':['열한 건','82%'],
    'meeting-552':['5시 52분'], 'meeting-640':['6시 40분'], 'meeting-730':['7시 30분'],
    'meeting-858':['8시 58분'], 'average-field':['둘째 칸 이름'], 'average-final':['소속 조직 평균'],
    'meeting-900':['9시 정각'], 'meeting-912':['9시 12분'], 'zero-start':['0에서 올라가기'],
  };
  function markSourceText(html, phrase, kind) {
    if (!phrase || !html.includes(phrase)) return html;
    const span=`<span class="direction-mark direction-mark-${kind}">${phrase}</span>`;
    return html.replace(phrase,span);
  }
  function decorate(ep, text, html, type) {
    const key = String(ep), matches = scenes.filter(s => s.ep === key && text.includes(s.anchor));
    const isPersonal = personal.some(([e,a]) => e === key && text.includes(a));
    const isSystem = type === 'sys' && system.some(([e,a]) => e === key && text.includes(a));
    const isPaper = key === '22' && type === 'sys' && (text.includes('서인 / 인간 단독 판단 가능성 높음.') || text.includes('공공 의사결정 권한 추가 확대: 반대.'));
    const isRenamedAlarm = key === '20-1' && text.includes('05:40 알람 이름을 바꿨다.');
    const isPhoneTime = key === '20-1' && (text.includes('**05:40**') || text.includes('**06:00**'));
    const isTwelveMinutes = key === '21' && text.trim() === '12분.';
    const isSystemLimit = key === '22' && text.includes('기업 제4 의료 검증 지연 한도: 3시간.');
    const isAlarmRow = key === '20-1' && alarmListActive && /^05:(?:40|43|47)\.$/.test(text.trim());
    const isNewAlarm = key === '20-1' && text.includes('은경이 05:50을 하나 더 만들었다.');
    const classes = [];
    if (matches.length) classes.push('direction-cue', ...matches.map(s => `direction-${s.kind}`));
    if (isPersonal) classes.push('direction-personal');
    if (isSystem) classes.push('direction-system');
    if (isPaper) classes.push('direction-paper');
    if (isRenamedAlarm) classes.push('direction-alarm-rename');
    if (isPhoneTime) classes.push('direction-phone-time', text.includes('**05:40**') ? 'direction-phone-0540' : 'direction-phone-0600');
    if (isTwelveMinutes) classes.push('direction-deadline-mark');
    if (isSystemLimit) classes.push('direction-system-limit');
    if (isAlarmRow) classes.push('direction-alarm-row');
    if (isNewAlarm) classes.push('direction-alarm-row-new');
    let result = classes.length ? tagExisting(html, classes, matches.map(s => s.kind)) : html;
    for (const scene of matches) for (const phrase of emphasis[scene.kind]||[]) result=markSourceText(result,phrase,scene.kind);
    if (key === '20-1' && renameWordPending && text.trim() === '일어나기 / 우유') {
      result = result.replace(/^(<(?:p|div)\b[^>]*class="[^"]*)/, '$1 direction-alarm-name');
      result = result.replace('일어나기 / 우유', '<span class="direction-alarm-name-word">일어나기 / 우유</span>');
      renameWordPending = false;
    }
    if (text.trim() === '알람은 세 개였다.') alarmListActive = true;
    if (isRenamedAlarm) renameWordPending = true;
    return result;
  }
  function afterParagraph() { return []; }
  function keepRenameWord(el) { if (el && el.isConnected) el.classList.add('id-still'); }
  function restore() {
    if (classObserver) classObserver.disconnect(); classObserver = null;
    if (renameWordListener) document.removeEventListener('animationend', renameWordListener); renameWordListener = null;
    if (motionMedia && motionChange) {
      if (motionMedia.removeEventListener) motionMedia.removeEventListener('change', motionChange);
      else motionMedia.removeListener(motionChange);
    }
    motionMedia = null; motionChange = null; renameWordPending = false; alarmListActive = false;
  }
  function mount() {
    restore();
    const words = [...document.querySelectorAll('.direction-alarm-name-word')];
    if (!words.length) return;
    renameWordListener = event => { if (event.target?.matches?.('.direction-alarm-name-word')) keepRenameWord(event.target); };
    document.addEventListener('animationend', renameWordListener);
    words.filter(el => el.parentElement?.classList.contains('seen')).forEach(keepRenameWord);
    classObserver = new MutationObserver(() => {
      if (document.body.classList.contains('ldx-off')) words.filter(el => el.parentElement?.classList.contains('seen')).forEach(keepRenameWord);
    });
    classObserver.observe(document.body, {attributes:true, attributeFilter:['class']});
    motionMedia = window.matchMedia?.('(prefers-reduced-motion: reduce)') || null;
    motionChange = event => { if (event.matches) words.filter(el => el.parentElement?.classList.contains('seen')).forEach(keepRenameWord); };
    if (motionMedia) {
      if (motionMedia.addEventListener) motionMedia.addEventListener('change', motionChange);
      else motionMedia.addListener(motionChange);
    }
  }
  return Object.freeze({decorate,afterParagraph,mount,restore,scenes:Object.freeze(scenes)});
})();
