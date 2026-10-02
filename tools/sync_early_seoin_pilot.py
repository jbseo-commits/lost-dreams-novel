#!/usr/bin/env python3
from pathlib import Path

p = Path('pilot.html')
s = p.read_text(encoding='utf-8')

old = "const BUMP={6:['6-1'],11:['11-1'],13:['13-1'],15:['15-1'],25:['25-1']}"
new = "const BUMP={3:['3-1'],5:['5-1'],6:['6-1'],9:['9-1'],11:['11-1'],13:['13-1'],15:['15-1'],25:['25-1']}"
assert old in s, 'BUMP anchor changed'
s = s.replace(old, new, 1)

anchor = "'6-1':{a:'#ffe0a8',b:'#c9a27a'"
insert = """'3-1':{a:'#ffd3a1',b:'#9fc7d8',token:'025.0',sync:82,ghost:'ONE MORE LOOK',hook:'집에 가는 동안 두 번째 날짜가 더 쌌다는 생각을 세 번 했다.',sp:'mealchoice',at:.78,on:'확인 화면을 한 번 더 봤다.',w:900,ms:7000},
'5-1':{a:'#f0c58d',b:'#83b8ad',token:'019.7',sync:70,ghost:'NEXT MEAL',hook:'클리닉 문을 잠근 뒤에도 둘은 혁명 이야기를 하지 않았다.',sp:'uselesshour',at:.72,on:'한 시간이 넘게 걸렸다.',w:900,ms:7200},
'9-1':{a:'#b6a7ff',b:'#e6b8a2',token:'∞',sync:43,ghost:'JUST TOMORROW',hook:'메시지를 한 번 더 읽었다.',sp:'returnlife',at:.76,on:'오늘이 계속될 수도 있었다.',w:900,ms:7600},
"""
assert anchor in s, 'D bumper anchor changed'
s = s.replace(anchor, insert + anchor, 1)

old10 = "10:{a:'#ff607c',b:'#a88cff',token:'∞',sync:39,ghost:'I CONSENT',hook:'자기 머릿속의 모든 문이 한꺼번에 열렸다.',sp:'consent',at:.72,on:\"손가락이 승인 버튼 위에서 멈췄다\",w:1400},"
new10 = "10:{a:'#ff607c',b:'#a88cff',token:'∞',sync:39,ghost:'I CONSENT',hook:'자기 머릿속의 모든 문이 한꺼번에 열렸다.',sp:'secondconsent',at:.72,on:\"손가락이 승인 버튼 위에서 멈췄다.\",w:900,ms:9200},"
assert old10 in s, 'episode 10 D anchor changed'
s = s.replace(old10, new10, 1)

style_anchor = "/* setpiece engine */"
css = r"""
/* EARLY SEO-IN BUMPERS: ordinary choices become the pre-surgery visual grammar */
#mealchoice .veil,#uselesshour .veil,#returnlife .veil,#secondconsent .veil{background:radial-gradient(circle at 50% 42%,#111820 0,#05070a 62%,#020304 100%)}
.es-wrap{width:min(650px,100%);text-align:left}.es-row{display:grid;grid-template-columns:1fr auto;gap:18px;padding:13px 0;border-top:1px solid #ffffff16;font:11px/1.5 ui-monospace;color:#aeb8c4}.es-row b{color:#f3f6f8}.es-note{margin-top:22px;font:650 clamp(18px,5vw,26px)/1.55 "Noto Serif KR",serif;color:#fff}.es-soft{color:#84909d}.es-cross{text-decoration:line-through;opacity:.45}.es-card{margin-top:16px;padding:18px;border:1px solid #ffffff20;background:#ffffff06}.es-btn{display:inline-block;margin-top:12px;padding:10px 15px;border:1px solid #ffffff45;font:10px ui-monospace;letter-spacing:.14em}.es-btn.dim{opacity:.35}.es-btn.live{border-color:var(--accent);color:var(--accent);box-shadow:0 0 22px color-mix(in srgb,var(--accent) 18%,transparent)}
"""
assert style_anchor in s
s = s.replace(style_anchor, css + '\n' + style_anchor, 1)

html_anchor = '<div class="setpiece" id="pathburn">'
html = r'''<div class="setpiece" id="mealchoice"><div class="veil"></div><div class="sp-center"><div class="es-wrap"><div class="sp-label">검진 뒤 · 점심과 예약</div><div class="es-row" data-t=".2"><span>더 싸고 건강한 답</span><b class="es-cross" data-k="1.5">선택 안 함</b></div><div class="es-row" data-t="1"><span>어머니가 고른 칼국수</span><b>그냥 먹고 싶어서</b></div><div class="es-card" data-t="2.2"><small>검진 예약</small><div class="es-row"><span>두 번째 날짜</span><b>더 저렴함</b></div><div class="es-row"><span>어머니가 고른 날짜</span><b class="sc-gold">미경 씨 장날</b></div></div><div class="es-note" data-t="4.1">예약. <span class="es-soft">확인.</span> <b data-t="5.2">한 번 더 확인.</b></div></div></div></div>
<div class="setpiece" id="uselesshour"><div class="veil"></div><div class="sp-center"><div class="es-wrap"><div class="sp-label">클리닉 · 아무것도 바꾸지 않은 저녁</div><div class="es-row" data-t=".2"><span>지난 라면</span><b>3.4 TOKEN</b></div><div class="es-row" data-t=".8"><span>도윤이 고른 메뉴</span><b class="sc-gold">12.8</b></div><div class="es-row" data-t="1.4"><span>서인 메뉴</span><b>7.6</b></div><div class="es-card" data-t="2.3"><small>천장 누수</small><div class="es-row"><span>도구</span><b>형편없음</b></div><div class="es-row"><span>걸린 시간</span><b>1시간 이상</b></div></div><div class="es-note" data-t="4.7">혁명 이야기 <b>0분</b>.</div></div></div></div>
<div class="setpiece" id="returnlife"><div class="veil"></div><div class="sp-center"><div class="es-wrap"><div class="sp-label">그냥 내일도 · 돌아갈 수 있는 하루</div><div class="es-row" data-t=".2"><span>회사</span><b>인정받음</b></div><div class="es-row" data-t=".8"><span>지우</span><b>도자기 + 광고꿈</b></div><div class="es-row" data-t="1.4"><span>못생긴 컵</span><b class="sc-gold">굽기로 함</b></div><div class="es-row" data-t="2"><span>어머니</span><b>저녁 반 공기</b></div><div class="es-card" data-t="3"><small>23:17 · 도윤</small>검사 받을 거야?</div><div data-t="4"><span class="es-btn dim">거절</span> <span class="es-btn dim">승인</span></div><div class="es-note" data-t="5.4">오늘이 계속될 수도 있었다.</div></div></div></div>
<div class="setpiece" id="secondconsent"><div class="veil"></div><div class="sp-center"><div class="es-wrap"><div class="sp-label">자발적 동의 · 마지막 줄</div><div class="es-card" data-t=".2"><small>본인은 모든 위험을 이해했으며</small><strong>자발적으로 동의합니다.</strong></div><div class="es-row" data-t="1.5"><span>첫 번째</span><b>읽음</b></div><div class="es-row" data-t="2.2"><span>두 번째</span><b>다시 읽음</b></div><div class="es-row" data-t="3"><span>세 번째</span><b class="es-soft">읽으려다 멈춤</b></div><div data-t="4"><span class="es-btn dim">손을 뗌</span></div><div class="es-note" data-t="5">“내가 나중에 이걸 후회하면.”</div><div data-t="6.2"><span class="es-btn live">승인</span></div><div class="es-row" data-t="7.1"><span>완료 화면</span><b>한 번 봄 · 다시 봄</b></div></div></div></div>
'''
assert html_anchor in s, 'setpiece insertion anchor changed'
s = s.replace(html_anchor, html + html_anchor, 1)

key_anchor = "3:['“왜 그건 내 꿈으로 안 쳐 줘?”','“내가 자유로워졌다는 걸 왜 네가 원하는 방식으로 증명해야 해?”'],"
key_new = key_anchor + "\n'3-1':['“나한테 왜 물어봤어.”','“꼭 하나 있어야 돼?”'],"
assert key_anchor in s
s = s.replace(key_anchor, key_new, 1)
key_anchor = "5:['“그럼 조건을 바꿔.”','“사람을 바꾸지 말고.”'],"
s = s.replace(key_anchor, key_anchor + "\n'5-1':['“다음엔 내가 살게.”','“됐어요. 비싼 거 먹을 거잖아요.”'],", 1)
key_anchor = "9:['“근데 체제는 불행한 사람만으로 유지되지 않아.”'],"
s = s.replace(key_anchor, key_anchor + "\n'9-1':['“너는? 뭐 하고 싶은데.”','“남한테는 그렇게 잘 물어보면서.”'],", 1)
key_anchor = "10:['“너 요즘 자꾸 세상에 버튼 하나만 있는 것처럼 말해.”'],"
s = s.replace(key_anchor, "10:['“너 요즘 자꾸 세상에 버튼 하나만 있는 것처럼 말해.”','“그럼 모르는 채로 둬.”','“싫어요.”'],", 1)

p.write_text(s, encoding='utf-8')
print('pilot.html synced: 3-1, 5-1, 9-1, ep10 consent')
