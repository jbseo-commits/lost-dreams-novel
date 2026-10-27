// Web-only information graphics: relationships are derived from already-read source paragraphs.
window.ReaderInfoGraphics = (() => {
  const cues = [
    {ep:'19', anchor:'진짜 동네를 그대로 베껴 만든 연습 지도. 새벽 3시의 주택가였다.', kind:'dotmap', label:'연습 지도 · 새벽 3시 주택가', note:'붉게 번지는 구역 · 이대로 두면 꿈이 엉킴'},
    {ep:'19', anchor:'전부 한 번 끊었다가 다시 붙입니다. 확실히 고쳐집니다. 대신 끊는 순간 연결된 집은 전부 깹니다.', kind:'choices', label:'고칠 방법 두 가지', options:[['A','옆 동네 기계로 넘김','자는 사람은 안 깸','운이 나쁘면 옆 동네가 한동안 끊김'],['B','전부 끊었다가 다시 붙임','확실히 고쳐짐','연결된 집은 전부 깸']]},
    {ep:'19', anchor:'공동주방에 나간 안내문에는 오전 6시 전 도착이라고 버젓이 적혀 있었다.', kind:'delivery', label:'한 주문의 약속·예상과 07:00 출차', points:[['06:00 전','안내 약속',25],['07:00 이후','시스템 예상',76]]},
    {ep:'19', anchor:'A를 누르자 옆 동네에 불이 몇 개 켜졌다. 서른여섯 집. 그것도 운이 나쁠 때 얘기였다.', kind:'compare', label:'선택에 따른 영향', left:'B', leftValue:'2,400집이 한꺼번에 깸', right:'A', rightValue:'36집 · 운이 나쁠 때'},
    {ep:'19-1', anchor:'5시 31분. 서인이 식품 담당자 대신 공동주방에 전화를 걸었다.', kind:'promise', label:'오후 현장 시간', points:[['17:06','벽시계'],['17:31','공동주방에 전화'],['17:40','답변 기한']]},
    {ep:'19-1', anchor:'05:18 도착. 07:00 전원 출차.', kind:'delivery', label:'다음 날 새벽 · 도착과 출차', points:[['05:18','실제 납품',8],['07:40','시스템 예상',67]]},
    {ep:'20', anchor:'시스템 대체 경로: 도착 07:40, 고객 조건 미충족. 실제 납품: 예비 차량 수동 출동.', kind:'compare', label:'한 건의 납품 기록', left:'시스템 대체 경로', leftValue:'07:40 · 조건 미충족', right:'실제 납품', rightValue:'예비 차량 수동 출동', note:'07:00 출차 조건을 충족한 것은 실제 납품'},
    {ep:'20', anchor:'한 칸이 두 칸으로 쪼개졌다.', kind:'split', label:'기존 보호 범위와 신규 요청을 분리', left:'보호 확인', right:'별도 심사'},
    {ep:'20', anchor:'접수 14:02 줄은 아래 칸으로 내려갔다.', kind:'rows', label:'보호와 신규 심사', rows:[['보호 확인','기존 범위'],['14:02 의료 지원','신규 · 심사 대기']]},
    {ep:'20-1', anchor:'해린의 휴대폰에는 06:00이 남아 있었다.', kind:'alarms', label:'두 집, 다른 시각', rows:[['최은경의 집','05:40 · 기상'],['문해린의 집','06:00 · 추가 검증 완료 예정']]},
    {ep:'21', anchor:'그런데 일부 신청 화면의 예상 정산액은 예전 계약 조건으로 계산돼 있었다. 변경을 적용하면 그 안내보다 적게 받을 집들이었다.', kind:'compare', label:'신청 화면과 실제 계약 조건', left:'신청 화면', leftValue:'예상 정산액 · 기존 계약 기준', right:'실제 변경', rightValue:'받는 금액은 더 적음'},
    {ep:'21', anchor:'1시 36분, 문해린에게 다시 전화를 걸었다.', kind:'promise', label:'약속과 실제 연락', points:[['01:32','남은 시간 7분'],['01:36','실제 재통화'],['01:39','다시 걸기로 한 시각']]},
    {ep:'21-1', anchor:'딸이 화면을 내밀었다. 05:40, 05:43, 05:47, 05:50.', kind:'alarms', label:'네 개 모두 꺼진 알람', rows:[['05:40','꺼짐'],['05:43','꺼짐'],['05:47','꺼짐'],['05:50','꺼짐']]},
    {ep:'21-1', anchor:'사이로 송출탑의 버팀대가 비스듬히 걸려 있었다. 끝이 흔들렸다.', kind:'structure', label:'끊긴 계단에서 옆 건물 옥상으로', left:'송출탑 · 끊긴 계단', brace:'비스듬한 버팀대', right:'옆 건물 옥상'},
    {ep:'22', anchor:'목록 맨 윗줄에서 82%가 83%로 넘어가고 있었다.', kind:'progress', label:'진행 중 검사 한 건', title:'71세 남성 · 수술 전 검사', from:'82%', to:'83%'},
    {ep:'22', anchor:'그 넷은 오늘 밤 받지 말아 주세요. 지금 돌고 있는 열한 건은 끝까지 가고, 하나 끝날 때마다 그 연산은 바로 회사로 돌려보내 달라고 요청하겠습니다.', kind:'compute-branch', label:'연산 회수와 진행 유지', left:'회수', leftValue:'아이의 네 번째 검증을 당김 · 공공 검증 중단', right:'유지', rightValue:'공공 검사 11건 끝까지 · 대기 4건은 내일'},
    {ep:'22', anchor:'넷까지 받았다면 아이 결과는 2시 반을 넘겼을 것이다. 한 건씩 돌아오는 연산으로는 딸의 네 번째 완료 예상을 당길 수 없었다. 다만 2시 09분에서 더 밀리지도 않았다.', kind:'compare', label:'아이의 네 번째 검증과 연산 회수 결과', left:'대기 4건까지 수용', leftValue:'아이 결과는 02:30 이후', right:'11건을 마치고 회수', rightValue:'02:09 예상에서 더 밀리지 않음'},
    {ep:'22-1', anchor:'소속 조직 평균.', kind:'rows', label:'바뀐 표시 이름', rows:[['이전 이름','조직별 참여율'],['새 이름','소속 조직 평균']]},
    {ep:'22-1', anchor:'9시 12분, 게시 버튼을 눌렀다.', kind:'promise', label:'회의에서 게시까지', points:[['05:52','회의 소집'],['06:40','보고서 완료'],['07:30','회의'],['08:58','안전실'],['09:00','입력 멈춤'],['09:12','게시']]},
    {ep:'22-1', anchor:'첫 숫자가 0에서 올라가기 시작했다.', kind:'zero', label:'게시 이후', value:'0', note:'첫 숫자가 움직이기 시작함'},
  ];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  // 격자 위 집(점)과 가는 선. 붉은 구역은 중심에서 거리순으로 번진다.
  function dotmap() {
    const cols=24, rows=11, gap=13, ox=10, oy=12, cx=16, cy=5, red=3.3;
    let lines='', dots='';
    for(let r=0;r<rows;r++) lines+=`<path d="M${ox} ${oy+r*gap} H${ox+(cols-1)*gap}"/>`;
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){const d=Math.hypot(c-cx,(r-cy)*1.15);
      dots+=`<circle cx="${ox+c*gap}" cy="${oy+r*gap}" r="1.7"${d<=red?` class="is-red" style="--d:${(d*.38).toFixed(2)}s"`:''}/>`;}
    const x=ox+cx*gap, y=oy+cy*gap;
    const tangle=`M${x-38} ${y-13} C${x-14} ${y-30} ${x+6} ${y+24} ${x-12} ${y+8} S${x+30} ${y-28} ${x+22} ${y-4} S${x-26} ${y+30} ${x+36} ${y+14}`;
    return `<svg class="info-dotmap" viewBox="0 0 320 156" role="img" aria-label="격자 지도 한 구역에서 선이 붉게 엉킴"><g class="info-map-lines">${lines}</g><path class="info-map-tangle" d="${tangle}" pathLength="1"/><g class="info-map-dots">${dots}</g></svg>`;
  }
  const choice = ([key,how,gain,cost]) => `<div class="info-choice" data-choice="${esc(key)}"><b>${esc(key)}</b><strong>${esc(how)}</strong><span class="info-choice-gain">${esc(gain)}</span><span class="info-choice-cost">${esc(cost)}</span></div>`;
  const point = ([time,label], i, active) => `<li class="info-point${i===active?' is-active':''}"><span class="info-time">${esc(time)}</span><span class="info-role">${esc(label)}</span></li>`;
  function markup(c) {
    let body='';
    if(c.kind==='split') body=`<div class="info-compare info-split"><div><span>기존 범위</span><strong>${esc(c.left)}</strong></div><b aria-hidden="true">|</b><div><span>새 요청</span><strong>${esc(c.right)}</strong></div></div>`;
    if(c.kind==='compute-branch') body=`<div class="info-compare info-compute-branch"><div><span>회수</span><strong>${esc(c.leftValue)}</strong></div><b aria-hidden="true">↔</b><div><span>유지</span><strong>${esc(c.rightValue)}</strong></div></div>`;
    if(c.kind==='structure') body=`<div class="info-structure"><div class="info-structure-side"><b>${esc(c.left)}</b><span class="info-stair-gap">계단 중간이 끊김</span></div><div class="info-brace">${esc(c.brace)}</div><div class="info-structure-side"><b>${esc(c.right)}</b></div></div>`;
    if(c.kind==='compare') body=`<div class="info-compare"><div><span>${esc(c.left)}</span><strong>${esc(c.leftValue)}</strong></div><b aria-hidden="true">↔</b><div><span>${esc(c.right)}</span><strong>${esc(c.rightValue)}</strong></div></div>${c.note?`<p class="info-note">${esc(c.note)}</p>`:''}`;
    if(c.kind==='delivery') body=`<div class="info-delivery-axis" role="img" aria-label="${esc(c.label)}"><span class="info-axis-line"></span><span class="info-departure"><b>07:00</b><small>교대 기사 출차</small></span>${c.points.map(([time,label,at],i)=>`<span class="info-delivery-point" style="--at:${at}%"><span class="info-delivery-label side-${i===0?'top':'bottom'}"><b>${esc(time)}</b><small>${esc(label)}</small></span></span>`).join('')}</div>`;
    if(c.kind==='promise') body=`<ol class="info-timeline${c.points.length>3?' info-timeline-six':''}">${c.points.map((p,i)=>point(p,i,c.active)).join('')}</ol>`;
    if(c.kind==='rows'||c.kind==='alarms') body=`<div class="info-rows">${c.rows.map(([a,b])=>`<div class="info-row"><span>${esc(a)}</span><strong>${esc(b)}</strong></div>`).join('')}</div>`;
    if(c.kind==='building') body=`<div class="info-building"><div class="info-levels">${c.levels.map(([floor,state])=>`<div class="info-level ${state==='완료'?'is-done':''}"><b>${esc(floor)}</b><span>${esc(state)}</span></div>`).join('')}</div><strong class="info-count">${esc(c.count)}</strong></div>`;
    if(c.kind==='progress') body=`<div class="info-progress"><span>${esc(c.title)}</span><strong><i>${esc(c.from)}</i><b aria-hidden="true">→</b><i>${esc(c.to)}</i></strong></div>`;
    if(c.kind==='dotmap') body=`${dotmap()}<p class="info-note">${esc(c.note)}</p>`;
    if(c.kind==='choices') body=`<div class="info-choices">${c.options.map(choice).join('')}</div>`;
    if(c.kind==='zero') body=`<div class="info-zero"><strong>${esc(c.value)}</strong><span>${esc(c.note)}</span></div>`;
    return `<figure class="reader-info-graphic reveal" data-info-kind="${esc(c.kind)}" aria-label="${esc(c.label)}"><figcaption>${esc(c.label)}</figcaption>${body}</figure>`;
  }
  function afterParagraph(ep, paragraph) { const source=String(paragraph).replaceAll('**','');return cues.filter(c=>c.ep===String(ep)&&source.includes(c.anchor)).map(markup); }
  let listener=null, observer=null, seenObserver=null, media=null, mediaChange=null, timers=null;
  function restore(){if(listener)document.removeEventListener('animationend',listener);listener=null;if(observer)observer.disconnect();observer=null;if(seenObserver)seenObserver.disconnect();seenObserver=null;if(timers)timers.forEach(clearTimeout);timers=null;if(media&&mediaChange){media.removeEventListener?.('change',mediaChange);media=null;mediaChange=null;}}
  function mount(){restore();const figures=[...document.querySelectorAll('.reader-info-graphic')]; if(!figures.length)return;
    const settle=el=>el.classList.add('id-still');
    timers=new Map();
    const start=el=>{if(el.classList.contains('id-still'))return;if(document.body.classList.contains('ldx-off')||media?.matches){clearTimeout(timers.get(el));settle(el);return;}clearTimeout(timers.get(el));timers.set(el,setTimeout(()=>settle(el),3300));};
    listener=e=>{const fig=e.target?.closest?.('.reader-info-graphic');if(!fig)return;requestAnimationFrame(()=>{const running=[fig,...fig.querySelectorAll('*')].flatMap(node=>node.getAnimations?.()||[]).some(animation=>animation.playState==='running'||animation.playState==='pending');if(!running){clearTimeout(timers.get(fig));settle(fig);}});};document.addEventListener('animationend',listener);
    seenObserver=new MutationObserver(records=>records.forEach(record=>{if(record.target.classList.contains('seen'))start(record.target);}));figures.forEach(el=>seenObserver.observe(el,{attributes:true,attributeFilter:['class']}));
    const finish=()=>figures.filter(el=>el.classList.contains('seen')).forEach(settle);
    observer=new MutationObserver(()=>{if(document.body.classList.contains('ldx-off')||media?.matches)finish();});observer.observe(document.body,{attributes:true,attributeFilter:['class']});
    media=matchMedia('(prefers-reduced-motion: reduce)');mediaChange=event=>{if(event.matches)finish();};media.addEventListener?.('change',mediaChange);
    if(document.body.classList.contains('ldx-off')||media.matches)finish();
    figures.forEach(el=>{if(el.classList.contains('seen')){if(document.body.classList.contains('ldx-off')||media.matches)settle(el);else start(el);}});
  }
  return Object.freeze({afterParagraph,mount,restore,cues:Object.freeze(cues)});
})();
