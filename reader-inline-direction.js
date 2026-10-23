// Inline direction belongs to the paragraph that introduces each fact. The manuscript stays authoritative.
window.ReaderInlineDirection = (() => {
  let observer = null, fallbackScroll = null, classObserver = null, motionMedia = null, motionChange = null, renameWordListener = null, renameWordPending = false;
  const scenes = [
    ['19', '창문 2,400개에 한꺼번에 불이 들어왔다.', 'fork-b'],
    ['19', 'A를 누르자 옆 동네에 불이 몇 개 켜졌다. 서른여섯 집. 그것도 운이 나쁠 때 얘기였다.', 'fork-compare'],
    ['19', 'B에서 손가락을 뗐다.', 'fork-release'],
    ['19', '“A요.”', 'fork-a'],
    ['19', '그때, 목록 맨 위로 새 줄 하나가 밀고 올라왔다.', 'queue-one'],
    ['19', '목록 위로 또 한 줄.', 'queue-two'],
    ['19', '06:30 수령. 07:00 교대 기사 출차 전.', 'delivery-plan'],
    ['19', '예상 도착 시각을 열었다. 오전 7시 이후.', 'delivery-system'],
    ['19', '공동주방에 나간 안내문에는 오전 6시 전 도착이라고 버젓이 적혀 있었다.', 'delivery-promise'],

    ['19-1', '공동주방에서 5시 40분까지 답 달래요. 넘기면 딴 가게에서 산대요. 새벽 6시에 재료 들어가야 6시 반에 기사들 도시락이랑 애들 아침이 나가는데.', 'clock-540'],
    ['19-1', '벽시계는 5시 6분.', 'clock-506'],
    ['19-1', '5시 31분. 서인이 식품 담당자 대신 공동주방에 전화를 걸었다.', 'clock-531'],
    ['19-1', '회사 시스템은 이 주문이 아직도 자기 경로로 가는 중이라고 믿고 있었다.', 'delivery-740'],
    ['19-1', '05:18 도착. 07:00 전원 출차.', 'delivery-518'],

    ['20', '공동주방 주문은 새벽 5시 18분에 도착했습니다.', 'delivery-518-review'],
    ['20', '시스템 대체 경로의 도착 예정은 오전 7시 40분이었습니다.', 'delivery-740-review'],
    ['20', '한 칸이었다.', 'one-cell'],
    ['20', '접수 14:02. 의료 지원 신규. 심사 대기.', 'pending-row'],
    ['20', '한 칸이 두 칸으로 쪼개졌다.', 'two-cells'],
    ['20', '접수 14:02 줄은 아래 칸으로 내려갔다.', 'row-moves'],

    ['20-1', '알람은 세 개였다.', 'alarm-three'],
    ['20-1', '은경이 05:50을 하나 더 만들었다.', 'alarm-550'],

    ['21', '왼쪽엔 접수 완료. 오른쪽엔 차액 회수.', 'contract-overlap'],
    ['21', '오후 10시 18분, 운영 회의실.', 'deadline-start'],
    ['21', '10시 30분에 묶어서 넘깁니다. 지금 보류하면 오늘 변경은 못 받아요.', 'deadline-1030'],
    ['21', '변경 적용 시 실제 계약 조건으로 재정산.', 'small-clause'],
    ['21', '1시 32분. 목록이 넘어가기까지 2분, 문해린에게 다시 걸기로 한 1시 39분까지 7분.', 'clock-0132-0139'],
    ['21', '1시 34분에 목록이 아침 처리로 넘어갑니다. 그 전에 넣으셔야 해요.', 'deadline-0134'],
    ['21', '1시 33분이었다.', 'clock-0133'],
    ['21', '1시 36분, 문해린에게 다시 전화를 걸었다.', 'clock-0136'],

    ['21-1', '구조 0 / 12.', 'rescue-0'],
    ['21-1', '3층에서 남자 둘을 데리고 나왔다. 한 사람은 걸을 수 있었고, 다른 사람은 발을 디디지 못했다.', 'floor-3'],
    ['21-1', '5층의 여자 셋은 서로 붙잡고 있었다.', 'floor-5'],
    ['21-1', '7층 복도에서는 네 사람이 엎드려 기침하고 있었다.', 'floor-7'],
    ['21-1', '구조 2 / 12.', 'rescue-2'],
    ['21-1', '구조 5 / 12.', 'rescue-5'],
    ['21-1', '구조 9 / 12.', 'rescue-9'],
    ['21-1', '잠시 뒤 숫자가 열이 됐다.', 'rescue-10'],
    ['21-1', '구조 11 / 12.', 'rescue-11'],
    ['21-1', '구조 12 / 12.', 'rescue-12'],
    ['21-1', '엄마.', 'dream-to-morning'],
    ['21-1', '딸이 화면을 내밀었다. 05:40, 05:43, 05:47, 05:50.', 'alarm-screen'],
    ['21-1', '계단 중간이 떨어져 나갔다.', 'floor-break'],

    ['22', '진행 중 열한 건. 맨 위는 일흔한 살 남자의 수술 전 검사. 진행률 82%.', 'compute-82'],
    ['22', '목록 맨 윗줄에서 82%가 83%로 넘어가고 있었다.', 'compute-83'],
    ['22', '대기 넷은 내일로 넘어갔다. 이미 시작한 열한 건은 계속 돌았다.', 'compute-continue'],
    ['22', '수술 전 검사 · 완료.', 'compute-complete'],
    ['22', '진행 중 열한 건. 맨 위는 일흔한 살 남자의 수술 전 검사. 진행률 82%.', 'compute-branch'],

    ['22-1', '새벽 5시 52분, 백윤하의 단말에 회의 소집이 떴다.', 'meeting-552'],
    ['22-1', '보고서를 먼저 끝냈다. 6시 40분이었다.', 'meeting-640'],
    ['22-1', '7시 30분, 25층 회의실.', 'meeting-730'],
    ['22-1', '8시 58분, 인지안전실.', 'meeting-858'],
    ['22-1', '둘째 칸 이름을 지우고 다시 썼다.', 'average-field'],
    ['22-1', '소속 조직 평균.', 'average-final'],
    ['22-1', '9시 정각에 누르려다 손을 멈췄다.', 'meeting-900'],
    ['22-1', '9시 12분, 게시 버튼을 눌렀다.', 'meeting-912'],
    ['22-1', '첫 숫자가 0에서 올라가기 시작했다.', 'zero-start'],
  ].map(([ep, anchor, kind]) => Object.freeze({ep, anchor, kind}));

  const personal = [
    ['20', '거기 진짜 끄는 데야?'], ['20', '지금은 감사 중이야.'], ['20', '내 건 끄지 마.'],
    ['20-1', '우유 없음'], ['20-1', '내일 사갈게'], ['20-1', '안 까먹게 알람 해'],
    ['21', '엄마 오늘 꿈 바꿨어?'], ['21', '응. 센 걸로. 돈 더 준대서.'], ['21', '문자 그만. 지금 놀고 있어요.'],
    ['21', '예약 그대로라고 들었습니다.'], ['21', '아이는 아직 자요.'], ['21', '엄마 꿈 진짜 재밌었다. 돈은 언제 들어와?'],
    ['19-1', '모레 감사실 들어가기 전에, 먼저 드릴 말씀이 있습니다.'],
    ['19-1', '어젯밤 기지 건 보고받았습니다. 감사 전까지 혼자 이동하지 마십시오.'],
  ];
  const system = [
    ['19', '접수: 1분 전.'], ['19', '접수: 방금.'], ['19-1', '기존 경로: 도착 07:10.'],
    ['19-1', '신규 경로: 확보. 도착 시각 —.'], ['19-1', '새 배송 경로로 주문이 도착합니다. 도착 예정 07:40.'],
    ['20', '동부 물류기지 / 대체 경로 운행 완료. 납품 지속 가능.'], ['20', '시스템 대체 경로: 도착 07:40, 고객 조건 미충족. 실제 납품: 예비 차량 수동 출동.'],
    ['20', '생존 정산 보호 절차 확인.'], ['20', '신규 요청은 별도 심사. 보호 확인에 포함하지 않음.'], ['20', '보호 범위 열람 확인.'],
    ['20-1', '추가 검증 완료 예정 06:00'], ['21', '변경 적용 시 실제 계약 조건으로 재정산.'],
    ['22', '기업 제4 의료 검증 지연 한도: 3시간.'], ['22', '지원: 오늘 밤 1회.'],
    ['22-1', '임시 임원회의 · 07:30 · 안건 1건.'], ['22-1', '인지안전실장 해임 및 제4 검증층 영구 비공유 결의 (제안: 전략본부 마정훈 상무).'],
    ['22-1', '제4 의료 검증 예비층 자발적 공유 시범.'], ['22-1', '소속 조직 평균.'],
  ];

  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const deliveryTimeline = (events, range='') => {
    const x={'05:18':26,'06:00':63,'06:30':90,'07:00':117,'07:10':126,'07:40':152};
    return `<svg viewBox="0 0 180 62"><path d="M10 34h160"/>${range==='before-6'?'<path d="M12 34H63" class="id-pending"/>':''}${range==='after-7'?'<path d="M117 34h51m-6-4 6 4-6 4" class="id-pending"/>':''}${events.map(([time,side])=>{const at=x[time], y=side==='down'?55:12, tx=Math.max(10,Math.min(158,at-17));return `<g class="id-time-marker"><path d="M${at} 22v24" class="${time==='07:00'?'id-active':''}"/><circle cx="${at}" cy="34" r="3.5" class="${time==='07:00'?'id-active':''}"/><text x="${tx}" y="${y}">${time}</text></g>`}).join('')}</svg>`;
  };
  const responseTimeline = events => {
    const x={'17:06':28,'17:31':96,'17:40':120};
    return `<svg viewBox="0 0 180 62"><text x="9" y="12">오후</text><path d="M10 35h160"/>${events.map(([time,side])=>{const at=x[time], y=side==='down'?56:22, tx=Math.max(8,Math.min(151,at-17));return `<g class="id-time-marker"><path d="M${at} 23v24" class="${time==='17:40'?'id-active':''}"/><circle cx="${at}" cy="35" r="3.5" class="${time==='17:40'?'id-active':''}"/><text x="${tx}" y="${y}">${time}</text></g>`}).join('')}</svg>`;
  };
  const graphic = kind => {
    const labels = {
      'fork-b':[], 'fork-compare':[], 'fork-release':[], 'fork-a':[],
      'queue-one':['접수 · 1분 전'], 'queue-two':['접수 · 방금'], 'delivery-plan':[], 'delivery-system':[], 'delivery-promise':[],
      'clock-506':[], 'clock-540':[], 'clock-531':[], 'delivery-740':[], 'delivery-518':[],
      'delivery-518-review':[], 'delivery-740-review':[], 'one-cell':['보호','대기'], 'pending-row':['14:02','심사 대기'], 'two-cells':['보호 확인','별도 심사'], 'row-moves':['아래 칸','심사 대기'],
      'alarm-three':['알람','3개'], 'alarm-550':[], 'alarm-screen':[], 'milk-empty':['우유','없음'], 'alarm-renamed':['05:40','일어나기 / 우유'],
      'contract-overlap':['신청 화면','처리 화면'], 'deadline-start':['오후 10:18','현재'], 'deadline-1030':['오후 10:30','마감'], 'small-clause':['작은 조항'], 'deadline-0134':['01:34','목록 이동'], 'clock-0132-0139':['01:32','01:34','01:39 약속'], 'clock-0133':['01:33','확인'], 'clock-0136':['01:36','실제 재통화'],
      'rescue-0':[], 'rescue-2':[], 'rescue-5':[], 'rescue-9':[], 'rescue-10':[], 'rescue-11':[], 'rescue-12':[], 'dream-to-morning':[], 'alarm-screen':['05:40','05:43','05:47','05:50'], 'floor-3':[], 'floor-5':[], 'floor-7':[], 'floor-break':[],
      'compute-82':['진행 중','82%'], 'compute-branch':[], 'compute-83':['진행 중','83%'], 'compute-continue':['11건 계속','대기 4건 내일'], 'compute-complete':['완료','목록 아래'],
      'meeting-552':['05:52','소집'], 'meeting-640':['06:40','보고서'], 'meeting-730':['07:30','회의'], 'meeting-858':['08:58','입력'], 'meeting-900':['09:00','게시 전'], 'average-field':[''], 'average-final':['소속 조직 평균'], 'meeting-912':['09:12','게시'], 'zero-start':['0']
    }[kind] || [kind];
    const multi = labels.length > 2;
    const nodes = labels.filter(Boolean).map((label,i) => `<span class="id-node" style="--i:${i}">${esc(label)}</span>`).join('');
    const maps = {
      'fork-b':`<svg viewBox="0 0 180 72"><path d="M90 4v13M90 17L42 34M90 17l48 17"/><text x="31" y="34">B</text><path class="id-wide" d="M42 34v34M138 34v34"/>${Array.from({length:36},(_,i)=>`<rect style="--i:${i}" x="${26+(i%9)*4}" y="${39+Math.floor(i/9)*6}" width="2" height="2" rx=".5"/>`).join('')}</svg>`,
      'fork-compare':`<svg viewBox="0 0 180 72"><path d="M90 4v15M90 19L45 35M90 19l45 16"/><rect x="8" y="35" width="102" height="32" rx="2"/><rect x="122" y="35" width="50" height="32" rx="2"/><text x="13" y="44">B · 2,400집 불 켜짐</text><text x="140" y="44">A</text><text x="124" y="54">운 나쁠 때</text><text x="136" y="64">36집</text>${Array.from({length:36},(_,i)=>`<rect style="--i:${i}" x="${13+(i%12)*7}" y="${49+Math.floor(i/12)*5}" width="2.5" height="2.5"/>`).join('')}</svg>`,
      'fork-release':`<svg viewBox="0 0 180 48"><path d="M90 5v14L40 38M90 19l50 19"/><text x="30" y="18">B</text><text x="129" y="17">A</text><path class="id-fade" d="M90 19l-50 19" stroke-dasharray="3 5"/></svg>`,
      'fork-a':`<svg viewBox="0 0 180 48"><path d="M90 5v14L40 38M90 19l50 19"/><text x="30" y="18">B</text><text x="129" y="17">A</text><circle cx="140" cy="38" r="7" class="id-active"/></svg>`,
      'queue-one':`<svg viewBox="0 0 180 48"><rect class="id-queue-old" x="18" y="4" width="145" height="14" rx="2"/><rect class="id-queue-new id-active" x="18" y="26" width="145" height="14" rx="2"/><path d="M11 34v-8m-3 3 3-3 3 3"/><text class="id-queue-old" x="70" y="13">기존 접수</text><text class="id-queue-new" x="70" y="35">새 접수</text></svg>`,
      'queue-two':`<svg viewBox="0 0 180 64"><rect class="id-queue-old1" x="18" y="2" width="145" height="12" rx="2"/><rect class="id-queue-old2" x="18" y="19" width="145" height="12" rx="2"/><rect class="id-queue-new id-active" x="18" y="36" width="145" height="12" rx="2"/><path d="M11 44V37m-3 3 3-3 3 3"/><text class="id-queue-old1" x="70" y="11">접수</text><text class="id-queue-old2" x="70" y="28">접수</text><text class="id-queue-new" x="70" y="45">새 접수</text></svg>`,
      'delivery-plan':deliveryTimeline([['06:30','up'],['07:00','down']]),
      'delivery-system':deliveryTimeline([['07:00','down']],'after-7'),
      'delivery-promise':deliveryTimeline([['06:00','up'],['07:00','down']],'before-6'),
      'clock-506':responseTimeline([['17:06','up']]),
      'clock-540':responseTimeline([['17:40','up']]),
      'clock-531':responseTimeline([['17:06','up'],['17:31','down'],['17:40','up']]),
      'delivery-518':deliveryTimeline([['05:18','up'],['07:00','down']]),
      'delivery-740':deliveryTimeline([['07:00','up'],['07:10','down'],['07:40','up']]),
      'delivery-518-review':deliveryTimeline([['05:18','up'],['07:00','down']]),
      'delivery-740-review':deliveryTimeline([['07:00','up'],['07:40','down']]),
      'alarm-540':`<svg viewBox="0 0 180 42"><rect x="8" y="8" width="164" height="27" rx="4"/><circle cx="25" cy="21" r="5"/></svg>`,
      'alarm-three':`<svg viewBox="0 0 180 52"><rect x="8" y="3" width="164" height="12" rx="2"/><rect x="8" y="20" width="164" height="12" rx="2"/><rect x="8" y="37" width="164" height="12" rx="2"/><circle cx="21" cy="9" r="3"/><circle cx="21" cy="26" r="3"/><circle cx="21" cy="43" r="3"/></svg>`,
      'alarm-550':`<svg viewBox="0 0 180 66"><rect x="8" y="2" width="164" height="13" rx="2"/><rect x="8" y="18" width="164" height="13" rx="2"/><rect x="8" y="34" width="164" height="13" rx="2"/><rect class="id-alarm-new" x="8" y="50" width="164" height="13" rx="2"/><circle cx="21" cy="8" r="3"/><circle cx="21" cy="24" r="3"/><circle cx="21" cy="40" r="3"/><circle class="id-alarm-new" cx="21" cy="56" r="3"/><text x="32" y="11">05:40</text><text x="32" y="27">05:43</text><text x="32" y="43">05:47</text><text class="id-alarm-new" x="32" y="59">05:50</text></svg>`,
      'alarm-screen':`<svg viewBox="0 0 180 66"><rect x="8" y="2" width="164" height="13" rx="2"/><rect x="8" y="18" width="164" height="13" rx="2"/><rect x="8" y="34" width="164" height="13" rx="2"/><rect x="8" y="50" width="164" height="13" rx="2"/><circle cx="21" cy="8" r="3"/><circle cx="21" cy="24" r="3"/><circle cx="21" cy="40" r="3"/><circle cx="21" cy="56" r="3"/><path d="M12 8h18M12 24h18M12 40h18M12 56h18" class="id-muted"/><text x="36" y="11">05:40</text><text x="36" y="27">05:43</text><text x="36" y="43">05:47</text><text x="36" y="59">05:50</text></svg>`,
      'one-cell':`<svg viewBox="0 0 180 52"><rect x="9" y="8" width="162" height="36" rx="2"/><path d="M16 17h145" stroke-dasharray="3 4"/></svg>`,
      'pending-row':`<svg viewBox="0 0 180 56"><rect x="9" y="3" width="162" height="24" rx="2"/><path d="M9 34h162" stroke-dasharray="4 4"/><rect x="9" y="39" width="162" height="14" rx="1" class="id-pending"/></svg>`,
      'two-cells':`<svg viewBox="0 0 180 54"><rect x="9" y="8" width="162" height="38" rx="2" class="id-cell-whole"/><rect x="9" y="8" width="78" height="38" rx="2" class="id-cell-left"/><rect x="93" y="8" width="78" height="38" rx="2" class="id-cell-right"/><path d="M90 4v46" class="id-split"/><text x="25" y="30">보호받는 집</text><text x="104" y="30">기다리는 집</text></svg>`,
      'row-moves':`<svg viewBox="0 0 180 58"><rect x="9" y="3" width="162" height="19" rx="2"/><path d="M90 24v12m-4-4 4 4 4-4"/><rect x="9" y="39" width="162" height="15" rx="1" class="id-pending id-moving-row"/><text x="50" y="50" class="id-moving-row">접수 14:02 · 심사 대기</text></svg>`,
      'contract-overlap':`<svg viewBox="0 0 180 56"><rect x="12" y="4" width="104" height="43" rx="2"/><rect x="63" y="12" width="104" height="43" rx="2" class="id-contract-back"/><path d="M20 14h75M20 21h57M71 22h78M71 29h62"/></svg>`,
      'deadline-start':`<svg viewBox="0 0 180 42"><path d="M10 24h160"/><circle cx="32" cy="24" r="5" class="id-active"/></svg>`,
      'deadline-1030':`<svg viewBox="0 0 180 42"><path d="M10 24h160"/><circle cx="32" cy="24" r="4"/><path d="M146 6v36" class="id-active"/></svg>`,
      'deadline-0134':`<svg viewBox="0 0 180 42"><path d="M10 24h160"/><path d="M123 7v33" class="id-active"/></svg>`,
      'clock-0132-0139':`<svg viewBox="0 0 180 42"><path d="M10 24h160"/><circle cx="42" cy="24" r="5"/><path d="M82 6v36" class="id-active"/><path d="M145 8v32" stroke-dasharray="3 4"/></svg>`,
      'clock-0133':`<svg viewBox="0 0 180 42"><path d="M10 24h160"/><circle cx="73" cy="24" r="6" class="id-active"/><path d="M130 8v32" stroke-dasharray="3 4"/></svg>`,
      'clock-0136':`<svg viewBox="0 0 180 42"><path d="M10 24h160"/><circle cx="111" cy="24" r="6" class="id-active"/><path d="M150 8v32"/></svg>`,
      'small-clause':`<svg viewBox="0 0 180 43"><rect x="8" y="3" width="164" height="36" rx="2"/><path d="M18 12h140M18 20h100M18 28h65"/><path d="M117 33h40" class="id-clause"/></svg>`,
      'compute-82':`<svg viewBox="0 0 180 58"><text x="8" y="8">71세 남성 수술 전 검사 · 82%</text>${Array.from({length:11},(_,i)=>`<rect x="${8+(i%6)*28}" y="${12+Math.floor(i/6)*17}" width="23" height="13" rx="1" class="${i===0?'id-progress':''}"/>`).join('')}<path d="M8 51h164"/><path d="M8 51h134.48" class="id-fill"/></svg>`,
      'compute-83':`<svg viewBox="0 0 180 58"><text x="8" y="8">71세 남성 수술 전 검사 · 83%</text>${Array.from({length:11},(_,i)=>`<rect x="${8+(i%6)*28}" y="${12+Math.floor(i/6)*17}" width="23" height="13" rx="1" class="${i===0?'id-progress':''}"/>`).join('')}<path d="M8 51h164"/><path d="M8 51h136.12" class="id-fill"/></svg>`,
      'compute-continue':`<svg viewBox="0 0 180 50"><rect x="5" y="4" width="111" height="42" rx="2"/><rect x="123" y="4" width="52" height="42" rx="2" class="id-pending"/>${Array.from({length:11},(_,i)=>`<circle cx="${12+(i%6)*17}" cy="${12+Math.floor(i/6)*15}" r="2.8"/>`).join('')}${Array.from({length:4},(_,i)=>`<rect x="${130+(i%2)*19}" y="${11+Math.floor(i/2)*17}" width="8" height="8" rx="1" class="id-pending"/>`).join('')}</svg>`,
      'compute-branch':`<svg viewBox="0 0 180 114"><text x="38" y="10">공공 검증 11건 진행 중</text><circle cx="18" cy="21" r="2.3"/><circle cx="32" cy="21" r="2.3"/><circle cx="46" cy="21" r="2.3"/><circle cx="60" cy="21" r="2.3"/><circle cx="74" cy="21" r="2.3"/><circle cx="88" cy="21" r="2.3"/><circle cx="102" cy="21" r="2.3"/><circle cx="116" cy="21" r="2.3"/><circle cx="130" cy="21" r="2.3"/><circle cx="144" cy="21" r="2.3"/><circle cx="158" cy="21" r="2.3"/><path d="M90 27L46 43M90 27l44 16" class="id-branch-left id-active"/><rect x="4" y="44" width="84" height="65" rx="2" class="id-choice-left id-pending"/><rect x="92" y="44" width="84" height="65" rx="2" class="id-choice-right"/><text x="16" y="56">회수</text><text x="16" y="67">아이 4차</text><text x="16" y="78">1:40 전후</text><text x="16" y="89">공공 11 중단</text><text x="16" y="100">재검증 시각 미정</text><text x="104" y="56">계속</text><text x="104" y="69">공공 11 유지</text></svg>`,
      'dream-to-morning':`<svg viewBox="0 0 180 16"><rect x="8" y="5" width="164" height="6" rx="3" fill="#d98b55"/><rect x="8" y="5" width="164" height="6" rx="3" fill="#86a9b4" class="id-dawn-color"/></svg>`,
      'compute-complete':`<svg viewBox="0 0 180 48"><rect x="8" y="3" width="164" height="27" rx="2"/><path d="M12 11l4 4 8-9" class="id-active"/><path d="M16 35v8m0-4h145"/></svg>`,
      'floor-3':`<svg viewBox="0 0 180 72"><path d="M20 5h58v62H20zM80 67h80"/><path d="M24 10h48M24 18h48M24 26h48M24 34h48M24 42h48M24 50h48M24 58h48"/><text x="3" y="52">3F</text><circle cx="46" cy="50" r="2.6" class="id-active"/><circle cx="53" cy="50" r="2.6" class="id-active"/></svg>`,
      'floor-5':`<svg viewBox="0 0 180 72"><path d="M20 5h58v62H20zM80 67h80"/><path d="M24 10h48M24 18h48M24 26h48M24 34h48M24 42h48M24 50h48M24 58h48"/><text x="3" y="36">5F</text><circle cx="43" cy="34" r="2.6" class="id-active"/><circle cx="49" cy="34" r="2.6" class="id-active"/><circle cx="55" cy="34" r="2.6" class="id-active"/></svg>`,
      'floor-7':`<svg viewBox="0 0 180 72"><path d="M20 5h58v62H20zM80 67h80"/><path d="M24 10h48M24 18h48M24 26h48M24 34h48M24 42h48M24 50h48M24 58h48"/><text x="3" y="20">7F</text><circle cx="40" cy="18" r="2.3" class="id-active"/><circle cx="46" cy="18" r="2.3" class="id-active"/><circle cx="52" cy="18" r="2.3" class="id-active"/><circle cx="58" cy="18" r="2.3" class="id-active"/></svg>`,
      'floor-break':`<svg viewBox="0 0 180 72"><path d="M20 5h58v22M20 47v20h58v-8M24 17h48M24 53h48M82 31l8 8-8 8"/><path d="M100 64h55" stroke-dasharray="3 4"/><circle cx="49" cy="17" r="4" class="id-active"/></svg>`,
      'average-field':`<svg viewBox="0 0 180 44"><rect x="8" y="5" width="164" height="34" rx="2"/><path d="M17 13h72"/><path d="M87 11v13" class="id-active"/></svg>`,
      'average-final':`<svg viewBox="0 0 180 44"><rect x="8" y="5" width="164" height="34" rx="2" class="id-active"/><path d="M17 22h145"/></svg>`,
      'zero-start':`<svg viewBox="0 0 180 44"><path d="M12 35h156"/><circle cx="19" cy="18" r="6" class="id-active"/><path d="M19 26v8" stroke-dasharray="2 3"/></svg>`
    }[kind] || '';
    const meetingKinds=['meeting-552','meeting-640','meeting-730','meeting-858','meeting-900','meeting-912'];
    const meetingIndex=meetingKinds.indexOf(kind);
    const meetingArt=meetingIndex<0?'':`<svg viewBox="0 0 180 42"><path d="M10 24h160"/>${meetingKinds.slice(0,meetingIndex+1).map((_,i)=>`<circle cx="${15+i*29}" cy="24" r="${i===meetingIndex?5:3}" class="${i===meetingIndex?'id-active':''}"/>`).join('')}</svg>`;
    const rescueCount=({ 'rescue-0':0,'rescue-2':2,'rescue-5':5,'rescue-9':9,'rescue-10':10,'rescue-11':11,'rescue-12':12 })[kind];
    const rescueArt=rescueCount===undefined?'':`<svg viewBox="0 0 180 44">${Array.from({length:12},(_,i)=>{const x=14+(i%6)*29,y=6+Math.floor(i/6)*19,active=i<rescueCount;return `<g class="id-rescue-person ${active?'id-active':''}" style="--i:${i}"><circle cx="${x+4}" cy="${y+3}" r="2"/><path d="M${x+4} ${y+6}v6m-3-3h6m-5 6 2-3 2 3"/></g>`}).join('')}</svg>`;
    const art=rescueCount!==undefined?rescueArt:meetingIndex>=0?meetingArt:maps;
    if (!art && !nodes) return '';
    return `<figure class="inline-direction ${multi?'multi':''} ${art?'':'label-only'}" data-direction="${kind}" aria-hidden="true">${art}<div class="id-rail">${nodes}</div></figure>`;
  };
  function decorate(ep, text, html, type) {
    const key = String(ep), matches = scenes.filter(s => s.ep === key && text.includes(s.anchor));
    const isPersonal = personal.some(([e,a]) => e === key && text.includes(a));
    const isSystem = type === 'sys' && system.some(([e,a]) => e === key && text.includes(a));
    const isPaper = key === '22' && type === 'sys' && (text.includes('서인 / 인간 단독 판단 가능성 높음.') || text.includes('공공 의사결정 권한 추가 확대: 반대.'));
    const isRenamedAlarm = key === '20-1' && text.includes('05:40 알람 이름을 바꿨다.');
    const isPhoneTime = key === '20-1' && (text.includes('**05:40**') || text.includes('**06:00**'));
    const isTwelveMinutes = key === '21' && text.trim() === '12분.';
    const isSystemLimit = key === '22' && text.includes('기업 제4 의료 검증 지연 한도: 3시간.');
    let result = html;
    if (isPersonal || isSystem || isPaper || isRenamedAlarm || isPhoneTime || isTwelveMinutes || isSystemLimit) {
      const tone = isPersonal ? 'direction-personal' : isPaper ? 'direction-paper' : isRenamedAlarm ? 'direction-alarm-rename' : isPhoneTime ? (text.includes('**05:40**') ? 'direction-phone-time direction-phone-0540' : 'direction-phone-time direction-phone-0600') : isTwelveMinutes ? 'direction-deadline-mark' : isSystemLimit ? 'direction-system-limit' : 'direction-system';
      result = result.replace(/^(<(?:p|div)\b[^>]*class="[^"]*)/, `$1 ${tone}`);
    }
    if (key === '20-1' && renameWordPending && text.trim() === '일어나기 / 우유') {
      result = result.replace(/^(<(?:p|div)\b[^>]*class="[^"]*)/, '$1 direction-alarm-name');
      result = result.replace('일어나기 / 우유', '<span class="direction-alarm-name-word">일어나기 / 우유</span>');
      renameWordPending = false;
    }
    if (isRenamedAlarm) renameWordPending = true;
    return result + matches.map(s => graphic(s.kind)).join('');
  }
  function afterParagraph(ep, text) { return scenes.filter(s => s.ep === String(ep) && text.includes(s.anchor)).map(s => graphic(s.kind)); }
  function keepCompleted(el) { if (el && el.isConnected && el.classList.contains('id-ready')) el.classList.add('id-still'); }
  function keepRenameWord(el) { if (el && el.isConnected) el.classList.add('id-still'); }
  function settleAfterMotion(el) {
    if (!el || !el.classList.contains('id-ready')) return;
    if (document.body.classList.contains('ldx-off') || motionMedia?.matches) { keepCompleted(el); return; }
    const animations=[el,...el.querySelectorAll('*')].flatMap(node=>node.getAnimations());
    if (!animations.length) { keepCompleted(el); return; }
    Promise.all(animations.map(animation=>animation.finished.catch(()=>{}))).then(()=>keepCompleted(el));
  }
  function restore() {
    if (observer) observer.disconnect(); observer = null;
    if (fallbackScroll) { window.removeEventListener('scroll',fallbackScroll); fallbackScroll=null; }
    if (classObserver) classObserver.disconnect(); classObserver=null;
    if (renameWordListener) document.removeEventListener('animationend',renameWordListener); renameWordListener=null;
    renameWordPending=false;
    if (motionMedia && motionChange) {
      if (motionMedia.removeEventListener) motionMedia.removeEventListener('change',motionChange);
      else motionMedia.removeListener(motionChange);
    }
    motionMedia=null; motionChange=null;
  }
  function mount() {
    restore();
    const figures = [...document.querySelectorAll('.inline-direction')];
    if (!figures.length) return;
    const reveal = el => { if (!el.classList.contains('id-ready')) { el.classList.add('id-ready'); settleAfterMotion(el); } };
    const renameWords=[...document.querySelectorAll('.direction-alarm-name-word')];
    renameWordListener=event=>{ if(event.target?.matches?.('.direction-alarm-name-word')) keepRenameWord(event.target); };
    document.addEventListener('animationend',renameWordListener);
    renameWords.filter(el=>el.parentElement?.classList.contains('seen')).forEach(keepRenameWord);
    classObserver = new MutationObserver(() => {
      if (document.body.classList.contains('ldx-off')) {
        figures.filter(el=>el.classList.contains('id-ready')).forEach(keepCompleted);
        renameWords.filter(el=>el.parentElement?.classList.contains('seen')).forEach(keepRenameWord);
      }
    });
    classObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
    motionMedia=window.matchMedia?.('(prefers-reduced-motion: reduce)') || null;
    motionChange=event=>{ if(event.matches) { figures.filter(el=>el.classList.contains('id-ready')).forEach(keepCompleted); renameWords.filter(el=>el.parentElement?.classList.contains('seen')).forEach(keepRenameWord); } };
    if (motionMedia) {
      if (motionMedia.addEventListener) motionMedia.addEventListener('change',motionChange);
      else motionMedia.addListener(motionChange);
    }
    if (!('IntersectionObserver' in window)) {
      const revealVisible = () => figures.forEach(el => { const r=el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) reveal(el); });
      fallbackScroll = revealVisible; revealVisible(); window.addEventListener('scroll', fallbackScroll, {passive:true}); return;
    }
    observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { reveal(e.target); observer.unobserve(e.target); }
    }), {threshold:0.01, rootMargin:'0px 0px 24px 0px'});
    figures.forEach(el => observer.observe(el));
  }
  return Object.freeze({decorate, afterParagraph, mount, restore, scenes:Object.freeze(scenes)});
})();
