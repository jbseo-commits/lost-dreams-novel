/* EP41 — 담요 없는 판
 * pilot.html integration target: #ep41
 * Trigger phrase: "우산 쓴 사람 패"
 * Ending sting: anonymous surveillance photo.
 * No sender identity is implied or revealed.
 */
(() => {
  const STYLE_ID = 'ep41-setpiece-style';
  const ROOT_ID = 'ep41-setpiece';
  const TRIGGER = '우산 쓴 사람 패';
  const END_TRIGGER = '사진이 한 장 붙어 있었다.';

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${ROOT_ID}{position:fixed;inset:0;z-index:68;display:none;pointer-events:none;overflow:hidden;background:#050403;color:#f3ead4;isolation:isolate}
#${ROOT_ID}.on{display:block;pointer-events:auto}
#${ROOT_ID} .e41-room{position:absolute;inset:0;background:radial-gradient(circle at 50% 36%,#332515 0,#17120c 35%,#050403 72%)}
#${ROOT_ID} .e41-lamp{position:absolute;left:50%;top:-7vh;width:min(78vw,560px);height:min(78vw,560px);transform:translateX(-50%);border-radius:50%;background:radial-gradient(circle,#ffd99930 0,#d49a4210 35%,transparent 70%);filter:blur(8px);animation:e41Lamp 4.6s ease-in-out infinite}
#${ROOT_ID} .e41-table{position:absolute;left:50%;top:52%;width:min(88vw,620px);height:min(54vw,330px);transform:translate(-50%,-50%) perspective(700px) rotateX(58deg);border:1px solid #d6b76f38;background:linear-gradient(145deg,#72582935,#20180d 68%);box-shadow:0 38px 90px #000, inset 0 0 70px #0008}
#${ROOT_ID} .e41-blanket{position:absolute;inset:10% 8%;border:1px solid #bda16936;background:repeating-linear-gradient(90deg,#69532526 0 1px,transparent 1px 16px),repeating-linear-gradient(0deg,#69532520 0 1px,transparent 1px 16px)}
#${ROOT_ID} .e41-card{position:absolute;left:50%;top:49%;width:72px;height:104px;transform:translate(-50%,-50%) rotate(-7deg);border:1px solid #f0e3c4aa;border-radius:5px;background:#e8dfca;box-shadow:0 15px 30px #000a;opacity:0;animation:e41CardIn .65s cubic-bezier(.2,.8,.2,1) .65s forwards}
#${ROOT_ID} .e41-card:before{content:'☂';position:absolute;inset:0;display:grid;place-items:center;font:700 42px/1 serif;color:#2a261f;filter:grayscale(1)}
#${ROOT_ID} .e41-card:after{content:'비광';position:absolute;left:8px;bottom:7px;font:700 9px ui-monospace;color:#5d5547;letter-spacing:.18em}
#${ROOT_ID} .e41-card.out{animation:e41CardOut .8s cubic-bezier(.2,.8,.2,1) forwards}
#${ROOT_ID} .e41-copy{position:absolute;left:50%;bottom:max(8vh,44px);width:min(86vw,560px);transform:translateX(-50%);text-align:center;opacity:0;animation:e41Copy .8s ease 1.25s forwards}
#${ROOT_ID} .e41-kicker{font:9px ui-monospace;letter-spacing:.28em;color:#d6b76f}
#${ROOT_ID} .e41-line{margin-top:12px;font:600 clamp(21px,6vw,34px)/1.45 'Noto Serif KR',serif;letter-spacing:-.035em}
#${ROOT_ID} .e41-count{margin-top:12px;font:10px ui-monospace;color:#8e8068;letter-spacing:.14em}
#${ROOT_ID} .e41-close{margin-top:20px;border:1px solid #d6b76f55;background:#d6b76f0d;color:#e7d8b8;padding:11px 16px;font:10px ui-monospace;letter-spacing:.13em}
#${ROOT_ID}.watch{background:#020305;color:#eaf0f4}
#${ROOT_ID}.watch .e41-room{background:#020305}
#${ROOT_ID}.watch .e41-lamp,#${ROOT_ID}.watch .e41-table,#${ROOT_ID}.watch .e41-card{display:none}
#${ROOT_ID} .e41-watch{display:none;position:absolute;inset:0}
#${ROOT_ID}.watch .e41-watch{display:block}
#${ROOT_ID} .e41-photo{position:absolute;left:50%;top:48%;width:min(78vw,440px);aspect-ratio:4/5;transform:translate(-50%,-50%) rotate(-1.2deg);border:1px solid #ffffff25;background:linear-gradient(180deg,#17202a,#090d11 68%);box-shadow:0 25px 90px #000;overflow:hidden;animation:e41Photo .7s ease-out both}
#${ROOT_ID} .e41-photo:before{content:'';position:absolute;left:12%;right:12%;bottom:12%;height:38%;border:1px solid #ffffff18;background:linear-gradient(90deg,#ffffff09 0 32%,transparent 32% 68%,#ffffff07 68%);box-shadow:0 -90px 0 #ffffff04}
#${ROOT_ID} .e41-silhouette{position:absolute;left:47%;bottom:13%;width:13%;height:44%;background:#030507;border-radius:48% 48% 8% 8%;filter:blur(.4px)}
#${ROOT_ID} .e41-silhouette:before{content:'';position:absolute;left:19%;top:-15%;width:62%;aspect-ratio:1;border-radius:50%;background:#030507}
#${ROOT_ID} .e41-focus{position:absolute;left:42%;top:30%;width:25%;height:36%;border:1px solid #ff5c5c66;opacity:0;animation:e41Focus .35s steps(2,end) 1s forwards}
#${ROOT_ID} .e41-meta{position:absolute;left:14px;right:14px;top:14px;display:flex;justify-content:space-between;font:9px ui-monospace;color:#9eabb6;letter-spacing:.12em}
#${ROOT_ID} .e41-rent{position:absolute;left:14px;bottom:14px;font:10px ui-monospace;color:#dce6ed;letter-spacing:.08em}
#${ROOT_ID} .e41-anon{position:absolute;left:50%;bottom:max(5vh,24px);transform:translateX(-50%);font:9px ui-monospace;color:#8c98a4;letter-spacing:.24em;white-space:nowrap;opacity:0;animation:e41Copy .7s ease 1.35s forwards}
@keyframes e41Lamp{50%{opacity:.72;transform:translateX(-50%) scale(.96)}}
@keyframes e41CardIn{from{opacity:0;transform:translate(-50%,-80%) rotate(-14deg) scale(.84)}to{opacity:1;transform:translate(-50%,-50%) rotate(-7deg) scale(1)}}
@keyframes e41CardOut{to{opacity:.2;transform:translate(145%,-8%) rotate(17deg) scale(.9)}}
@keyframes e41Copy{to{opacity:1}}
@keyframes e41Photo{from{opacity:0;filter:blur(8px);transform:translate(-50%,-48%) rotate(-1.2deg) scale(.96)}to{opacity:1;filter:none;transform:translate(-50%,-50%) rotate(-1.2deg) scale(1)}}
@keyframes e41Focus{to{opacity:1}}
@media(max-width:430px){#${ROOT_ID} .e41-card{width:60px;height:88px}#${ROOT_ID} .e41-copy{bottom:7vh}#${ROOT_ID} .e41-photo{width:82vw}}
@media(prefers-reduced-motion:reduce){#${ROOT_ID} *{animation-duration:.01ms!important;animation-delay:0s!important}}
`;
    document.head.appendChild(style);
  }

  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="e41-room"></div><div class="e41-lamp"></div>
    <div class="e41-table"><div class="e41-blanket"></div></div>
    <div class="e41-card"></div>
    <div class="e41-copy"><div class="e41-kicker">NINE O'CLOCK TABLE · SUNDAY</div><div class="e41-line">판이 옮겨진 뒤에도<br>패 하나는 자리를 기억했다.</div><div class="e41-count">열네 칸 · 한 사람은 아직 밖에 있다</div><button class="e41-close" type="button">계속 읽기</button></div>
    <div class="e41-watch"><div class="e41-photo"><div class="e41-meta"><span>발신 비공개</span><span>1시간 전</span></div><div class="e41-silhouette"></div><div class="e41-focus"></div><div class="e41-rent">임대 · 월 48 · 보증 없음</div></div><div class="e41-anon">SENDER / UNRESOLVED</div></div>`;
  document.body.appendChild(root);

  const close = () => {
    root.classList.remove('on','watch');
    root.setAttribute('aria-hidden','true');
    document.documentElement.style.overflow = '';
  };
  root.querySelector('.e41-close').addEventListener('click', close);
  root.addEventListener('click', e => { if (root.classList.contains('watch') && e.target === root) close(); });

  let tablePlayed = false;
  let watchPlayed = false;
  const show = mode => {
    root.classList.toggle('watch', mode === 'watch');
    root.classList.add('on');
    root.setAttribute('aria-hidden','false');
    document.documentElement.style.overflow = 'hidden';
    if (mode === 'watch') setTimeout(close, 3300);
  };

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const text = entry.target.textContent || '';
      if (!tablePlayed && text.includes(TRIGGER)) { tablePlayed = true; show('table'); }
      if (!watchPlayed && text.includes(END_TRIGGER)) { watchPlayed = true; show('watch'); }
    }
  }, { threshold: .55 });

  const arm = () => {
    document.querySelectorAll('.prose p,.prose .sys').forEach(el => {
      const t = el.textContent || '';
      if (t.includes(TRIGGER) || t.includes(END_TRIGGER)) observer.observe(el);
    });
  };
  arm();
  new MutationObserver(arm).observe(document.body, { childList:true, subtree:true });
})();
