import fs from 'node:fs';

const file = new URL('../pilot.html', import.meta.url);
let html = fs.readFileSync(file, 'utf8');

function once(from, to, label) {
  const count = html.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected 1 match, got ${count}`);
  html = html.replace(from, to);
}

once("const BUMP={6:['6-1'],11:['11-1'],13:['13-1'],15:['15-1'],25:['25-1']}","const BUMP={3:['3-1'],5:['5-1'],6:['6-1'],9:['9-1'],11:['11-1'],13:['13-1'],15:['15-1'],25:['25-1']}",'BUMP map');

const dAnchor = "'6-1':{a:'#ffe0a8',b:'#c9a27a',token:'∞',sync:61,ghost:'CLOSED SUN'";
if (!html.includes(dAnchor)) throw new Error('D bumper anchor missing');
html = html.replace(dAnchor, `'3-1':{a:'#ffd6a0',b:'#9ec9b7',token:'025.2',sync:82,ghost:'ONE MORE LOOK',hook:'두 번째가 더 쌌다는 생각은 집에 도착할 때까지 세 번 났다.',sp:'firstdate',at:.82,on:'예약이 완료되었습니다.',w:900,ms:7200},\n'5-1':{a:'#e7c69a',b:'#86a8a0',token:'020.3',sync:70,ghost:'3.4 → 12.8',hook:'클리닉 문을 잠근 뒤에도 둘은 혁명 이야기를 하지 않았다.',sp:'mealrepair',at:.78,on:'3.4 갚는데 12.8 썼네.',w:900,ms:7200},\n'9-1':{a:'#d9c4ff',b:'#8fc9bc',token:'∞',sync:43,ghost:'JUST TOMORROW',hook:'그래도 한 번 더 읽었다.',sp:'twobuttons',at:.82,on:'두 버튼이 있었다.',w:900,ms:7600},\n` + dAnchor);

once("3:['“왜 그건 내 꿈으로 안 쳐 줘?”','“내가 자유로워졌다는 걸 왜 네가 원하는 방식으로 증명해야 해?”'],","3:['“왜 그건 내 꿈으로 안 쳐 줘?”','“내가 자유로워졌다는 걸 왜 네가 원하는 방식으로 증명해야 해?”'],\n'3-1':['“그날 미경 씨가 온대.”','“응.”'],",'KEY 3');
once("5:['“그럼 조건을 바꿔.”','“사람을 바꾸지 말고.”'],","5:['“그럼 조건을 바꿔.”','“사람을 바꾸지 말고.”'],\n'5-1':['“같이 올라와요.”','“그건 빚 갚은 거고.”'],",'KEY 5');
once("9:['“근데 체제는 불행한 사람만으로 유지되지 않아.”'],","9:['“근데 체제는 불행한 사람만으로 유지되지 않아.”'],\n'9-1':['“너는? 뭐 하고 싶은데.”','“내일까지 생각할게요.”'],",'KEY 9');

const css = `\n/* early Seo-in bumpers: ordinary choices become the visual grammar */\n#firstdate .veil,#mealrepair .veil,#twobuttons .veil{background:radial-gradient(circle at 50% 42%,#11171a 0,#06090b 58%,#020304 100%)}\n.eb-wrap{width:min(650px,100%);text-align:left}.eb-row{display:grid;grid-template-columns:1fr auto;gap:18px;padding:15px 0;border-top:1px solid #ffffff16;font:11px ui-monospace;color:#9ca8b2}.eb-row b{color:#eef4f6}.eb-row.pick{border-color:var(--accent);background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 8%,transparent),transparent);padding-left:12px}.eb-q{margin-top:24px;font:650 clamp(20px,5vw,29px)/1.55 \"Noto Serif KR\",serif;color:#fff}.eb-small{margin-top:8px;font:10px ui-monospace;letter-spacing:.12em;color:#78858f}.eb-btns{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:22px}.eb-btn{padding:18px;border:1px solid #ffffff24;text-align:center;font:700 12px ui-monospace;color:#aab4bd}.eb-btn.reject{border-color:#ffffff55;color:#fff}.eb-dim{opacity:.34}.eb-cost{font:900 clamp(48px,14vw,92px)/1 ui-monospace;letter-spacing:-.07em;color:#fff}.eb-arrow{color:var(--accent);padding:0 .15em}\n`;
once('</style>', css + '\n</style>', 'style close');

const setpieces = `\n<div class="setpiece" id="firstdate"><div class="veil"></div><div class="sp-center"><div class="eb-wrap"><div class="sp-label">검진 예약 · 세 가지 날짜</div><div class="eb-row"><span>두 번째</span><b>가장 쌈</b></div><div class="eb-row"><span>세 번째</span><b>다니기 편한 시간</b></div><div class="eb-row pick"><span>첫 번째</span><b>미경 씨가 오는 날</b></div><div class="eb-q">“첫 번째로 해?”</div><div class="eb-small">예약 완료 · 확인 화면을 한 번 더 봄</div></div></div></div>\n<div class="setpiece" id="mealrepair"><div class="veil"></div><div class="sp-center"><div class="eb-wrap" style="text-align:center"><div class="sp-label">라면 빚</div><div class="eb-cost">3.4 <span class="eb-arrow">→</span> 12.8</div><div class="eb-q">“다음엔 내가 살게.”</div><div class="eb-small">밥 · 천장 누수 · 문 잠그기<br>혁명 이야기는 하지 않았다</div></div></div></div>\n<div class="setpiece" id="twobuttons"><div class="veil"></div><div class="sp-center"><div class="eb-wrap"><div class="sp-label">특별 인지 평가 · 응답 기한 12:00</div><div class="eb-btns"><div class="eb-btn eb-dim">승인</div><div class="eb-btn reject">거절</div></div><div class="eb-q">오늘 같은 날이 계속되어도 괜찮을 것 같았다.</div><div class="eb-small">화면이 어두워짐 → 다시 켬 → 아무 버튼도 누르지 않음</div></div></div></div>\n`;
once('<script>\nconst $=id=>document.getElementById(id);', setpieces + '\n<script>\nconst $=id=>document.getElementById(id);', 'script anchor');

fs.writeFileSync(file, html);
console.log('pilot.html updated: 3-1, 5-1, 9-1 inserted.');
