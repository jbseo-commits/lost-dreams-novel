// The text stays authoritative: show each frame only after its exact source paragraph.
window.ReaderSequences = (() => {
  const cuts = [
    { ep: '19', id: 'ep19-door', anchor: '서인은 괜찮다는 듯 손가락을 쫙 펴 보였다.', alt: '붉은 문턱 밖에 멈춘 서인과 안쪽의 강연우, 두 사람 사이의 면담실 문' },
    { ep: '19', id: 'ep19-wrist-detail', anchor: '띠 아래 오른손목에는 어제 붙잡혔던 자국이 시퍼렇게 남아 있었다. 띠를 자국 위에서 살짝 비켜 끼우자 강연우의 눈이 그 손에 머물렀다. 서인은 괜찮다는 듯 손가락을 쫙 펴 보였다.', alt: '강연우의 시선이 머문 서인의 오른 손목 띠와 푸른 멍 자국' },
    { ep: '19', id: 'ep19-windows', anchor: 'A를 누르자 옆 동네에 불이 몇 개 켜졌다. 서른여섯 집. 그것도 운이 나쁠 때 얘기였다.', alt: '최종 선택 전, A와 B의 예상 영향을 나란히 보여 주는 지도. 한쪽은 넓은 구역에 많은 불빛, 다른 쪽은 36집의 불빛이다.', caption: '아직 최종 선택 전인 A와 B 미리보기: 두 선택의 예상 영향을 나란히 보여 준다.' },
    { ep: '19', id: 'ep19-home-life', anchor: '예측 화면일 뿐인데 불빛만은 진짜 같았다.', alt: 'B를 선택할 경우의 예상 생활을 보여 주는 불 켜진 창들: 아기를 안고 일어나는 집, 잠들지 못해 부엌에 선 사람, 앞당긴 출근 알람', caption: 'B를 선택할 경우의 예상 생활. 지금 일어나는 현실 장면이 아니라 예측 화면이다.' },
    { ep: '19-1', id: 'ep19-1-alley', anchor: '냉장차가 컨테이너 사이를 꽉 막고 섰다.', alt: '컨테이너 통로에서 냉장차와 지게차가 회색 승합차의 길을 막고 서인을 돕는 장면' },
    { ep: '19-1', id: 'ep19-1-window', anchor: '혼자는 못 보낸다며 따라온 참이었다.', alt: '새벽 사택 계단참에서 어두운 자기 집 창을 보는 서인과 차에서 조는 강연우' },
    { ep: '20', id: 'ep20-door', anchor: '서인은 윤세라를 똑바로 봤다.', alt: '감사실 문 앞에서 문고리를 잡은 윤세라와 다친 손목으로 서류를 든 서인' },
    { ep: '20', id: 'ep20-box', anchor: '공동주방에 온 7시 40분짜리 경로처럼요.', alt: '서인의 시점에서 본 감사 확인란과 공동주방 화이트보드·배식대 사진; 빈 확인 칸이 남아 있다.' },
    { ep: '20', id: 'ep20-rooftop', anchor: '도윤이 서인의 컵 위에 젓가락 한 벌을 올려 주었다.', alt: '기업 옥상에서 도윤이 서인의 컵라면 위에 젓가락을 올려 주는 순간' },
    { ep: '20-1', id: 'ep20-1-kitchens', anchor: '해린의 휴대폰에는 **06:00**이 남아 있었다.', alt: '사람 없이 두 집의 식탁과 현관에 남은 물건, 최은경 집의 05:40 알람과 문해린 집의 06:00 병원 시각', caption: '최은경의 집 / 문해린의 집.' },
    { ep: '21', id: 'ep21-contracts', anchor: '왼쪽엔 접수 완료. 오른쪽엔 차액 회수.', alt: '같은 틀로 보이는 두 계약 화면, 왼쪽 접수 결과와 오른쪽 실제 차액 회수', caption: '왼쪽: 신청한 집이 본 화면 / 오른쪽: 실제 처리 화면.' },
    { ep: '21', id: 'ep21-confirmation', anchor: '윤세라도 그 줄을 봤다. 아무 말도 하지 않았다.', alt: '어머니의 회색 행이 있는 목록에서 확인자 칸 위에 멈춘 서인의 손가락과 화면을 보는 윤세라' },
    { ep: '21', id: 'ep21-call-transfer', anchor: '곧바로 첫 병원 회선을 열었다.', alt: '강연우가 커피잔을 내려놓고 첫 병원 회선을 여는 순간', caption: '서인은 문해린의 병원 한 곳을 남기고, 나머지 여섯 곳은 연우가 맡는다.' },
    { ep: '21-1', id: 'ep21-1-rescue', anchor: '사이로 송출탑의 버팀대가 비스듬히 걸려 있었다. 끝이 흔들렸다.', alt: '불타는 송출탑의 깨진 창과 옆 건물 사이에 비스듬히 걸려 흔들리는 버팀대' },
    { ep: '22', id: 'ep22-corridor', anchor: '두 사람 뒤에서 서인의 걸음이 멎었다. 그 승인서에는 서인의 이름도 들어 있었다.', alt: '병원 복도에서 깨어 있는 마정훈과 외투를 베고 누운 딸, 백윤하와 뒤에 멈춘 서인' },
    { ep: '22', id: 'ep22-compute-choice', anchor: '대기 넷은 내일로 넘어갔다. 이미 시작한 열한 건은 계속 돌았다.', alt: '진행 중인 공공 검사 11개 패널과 비어 있는 대기 4개 패널; 진행 유지와 내일 연기를 나란히 보여 주는 화면', caption: '진행 중인 공공 검사 11건은 계속. 대기 4건은 내일로.' },
    { ep: '22', id: 'ep22-shoe', anchor: '그는 허리를 숙여 뒤축을 펴 줬다.', alt: '병원 복도 바닥에서 아이 신발의 구겨진 뒤축을 펴 주는 마정훈의 손' },
    { ep: '22-1', id: 'ep22-1-paper', anchor: '백윤하가 종이 한 장을 탁자 가운데로 밀었다.', alt: '아침 임원회의의 긴 탁자 가운데로 종이를 미는 백윤하의 손' },
  ];

  function image(cut, extra='') {
    return `<img class="sequence-frame ${extra}" data-cut-id="${cut.id}" src="assets/sequence19-22/${cut.id}-web.webp" alt="${cut.alt}" loading="lazy" decoding="async">`;
  }
  function afterParagraph(ep, paragraph) {
    const matched = cuts.filter(cut => cut.ep === String(ep) && paragraph.includes(cut.anchor));
    const result = [];
    for (let i=0; i<matched.length; i++) {
      const cut = matched[i];
      result.push(`<figure class="sequence-cut" data-cut-id="${cut.id}">${image(cut)}${cut.caption?`<figcaption>${cut.caption}</figcaption>`:''}</figure>`);
    }
    return result;
  }
  function restore() {}
  function mount() {}
  return Object.freeze({cuts:Object.freeze(cuts.map(Object.freeze)),afterParagraph,mount,restore});
})();
