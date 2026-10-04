// 꿈을 잃은 세계: 설정집과 원고를 읽고, 쓰고, GitHub에 바로 저장하는 웹
const REPO = { owner: 'jbseo-commits', name: 'lost-dreams-novel', branch: 'main' };
const API = `https://api.github.com/repos/${REPO.owner}/${REPO.name}`;
const GH = `https://github.com/${REPO.owner}/${REPO.name}`;
const TOKEN_PAGE = 'https://github.com/settings/personal-access-tokens/new';

// 브라우저 저장소는 막혀 있을 수 있으니 항상 감싸서 쓴다
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};
const TOKEN_KEY = 'ldn-token';
const draftKey = path => `ldn-draft:${path || 'new'}`;

let manifest = { settings: [], manuscript: [] };

const HIDDEN_MANUSCRIPT = new Set([
  'ep002-1.md',
  'ep003-1.md',
  'ep006-1.md',
  'ep006-2.md',
  'ep011-1.md',
]);

const episodeKey = filename => {
  const m = filename.match(/^ep(\d+)(?:-(\d+))?\.md$/);
  if (!m) return [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, filename];
  return [Number(m[1]), Number(m[2] || 0), filename];
};

const compareEpisode = (a, b) => {
  const ak = episodeKey(a.name);
  const bk = episodeKey(b.name);
  return ak[0] - bk[0] || ak[1] - bk[1] || ak[2].localeCompare(bk[2]);
};

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const md = text => DOMPurify.sanitize(marked.parse(text));
const pad = n => String(n).padStart(3, '0');
const token = () => store.get(TOKEN_KEY);
const countChars = t => ({ all: t.length, noSpace: t.replace(/\s/g, '').length });

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 4000);
}

function ghHeaders(extra = {}) {
  const h = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...extra };
  if (token()) h.Authorization = `Bearer ${token()}`;
  return h;
}

const toBase64 = text => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
const fromBase64 = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), c => c.charCodeAt(0)));

async function loadFile(path) {
  if (token()) {
    const r = await fetch(`${API}/contents/${path}?ref=${REPO.branch}`, { headers: ghHeaders(), cache: 'no-store' });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`GitHub 응답 ${r.status}`);
    const j = await r.json();
    return { text: fromBase64(j.content), sha: j.sha };
  }
  const r = await fetch(path, { cache: 'no-store' });
  if (!r.ok) return null;
  return { text: await r.text(), sha: null };
}

async function saveFile(path, text, message, sha) {
  const body = { message, content: toBase64(text), branch: REPO.branch };
  if (sha) body.sha = sha;
  const r = await fetch(`${API}/contents/${path}`, { method: 'PUT', headers: ghHeaders({ 'Content-Type': 'application/json' }), body: JSON.stringify(body) });
  if (r.ok) return (await r.json()).content.sha;
  if (r.status === 409 || (r.status === 422 && !sha)) throw new Error('conflict');
  if (r.status === 401) throw new Error('token');
  if (r.status === 403 || r.status === 404) throw new Error('permission');
  throw new Error(`GitHub 응답 ${r.status}`);
}

async function listDir(dir) {
  const r = await fetch(`${API}/contents/${dir}?ref=${REPO.branch}`, { headers: ghHeaders(), cache: 'no-store' });
  if (!r.ok) return [];
  let files = (await r.json()).filter(f => f.name.endsWith('.md'));
  if (dir === 'manuscript') {
    files = files.filter(f => !HIDDEN_MANUSCRIPT.has(f.name)).sort(compareEpisode);
  } else {
    files.sort((a, b) => a.name.localeCompare(b.name));
  }
  return files.map(f => ({ path: f.path, title: f.name.replace(/\.md$/, ''), chars: null }));
}

async function loadManifest() {
  try {
    const r = await fetch('manifest.json', { cache: 'no-store' });
    if (r.ok) manifest = await r.json();
  } catch {}
  if (token() || !manifest.settings.length) {
    const titled = new Map([...manifest.settings, ...manifest.manuscript].map(i => [i.path, i]));
    const fresh = async dir => (await listDir(dir)).map(i => titled.get(i.path) || i);
    const [settings, manuscript] = await Promise.all([fresh('settings'), fresh('manuscript')]);
    if (settings.length || manuscript.length) manifest = { ...manifest, settings, manuscript };
  }
}

function renderNav(active) {
  const item = i => `<li><a href="#/read/${i.path}" class="${i.path === active ? 'active' : ''}">${esc(i.title)}</a></li>`;
  $('#settingsList').innerHTML = manifest.settings.map(item).join('') || '<li class="empty">아직 없어요</li>';
  $('#manuscriptList').innerHTML = manifest.manuscript.map(item).join('') || '<li class="empty">아직 원고가 없어요</li>';
}

function connectBadge() {
  return token()
    ? `<a class="badge ok" href="#/connect">GitHub 연결됨</a>`
    : `<a class="badge" href="#/connect">GitHub 연결하기</a>`;
}

function viewHome() {
  renderNav(null);
  const total = manifest.manuscript.reduce((s, i) => s + (i.chars || 0), 0);
  const latest = manifest.manuscript.at(-1);
  $('#main').innerHTML = `
    <section class="home">
      <p class="eyebrow">장편소설 · 설정집과 원고</p>
      <h1>꿈을 잃은 세계</h1>
      <p class="lead">채팅에서 쓴 글을 붙여넣고 저장하면 GitHub 저장소가 바로 바뀌어요. 어떤 AI든 그 저장소를 읽고 이어서 쓸 수 있어요.</p>
      <div class="actions">
        <a class="btn primary" href="#/write">새 화 쓰기</a>
        ${latest ? `<a class="btn" href="#/read/${latest.path}">최근 원고 읽기</a>` : ''}
        ${connectBadge()}
      </div>
      <dl class="stats">
        <div><dt>설정</dt><dd>${manifest.settings.length}개</dd></div>
        <div><dt>원고</dt><dd>${manifest.manuscript.length}화</dd></div>
        <div><dt>총 글자 수</dt><dd>${total ? total.toLocaleString('ko-KR') + '자' : '-'}</dd></div>
      </dl>
      <h2>설정집</h2>
      <ol class="cards">
        ${manifest.settings.map(i => `<li><a href="#/read/${i.path}">${esc(i.title)}</a></li>`).join('')}
      </ol>
    </section>`;
}

async function viewRead(path) {
  renderNav(path);
  const main = $('#main');
  main.innerHTML = '<p class="muted">불러오는 중…</p>';
  let file;
  try { file = await loadFile(path); } catch (e) { file = null; }
  if (!file) {
    main.innerHTML = `<p class="muted">이 파일을 불러오지 못했어요. 방금 저장했다면 1~2분 뒤 다시 열어보세요.</p>`;
    return;
  }
  const isMs = path.startsWith('manuscript/');
  const list = isMs ? manifest.manuscript : manifest.settings;
  const idx = list.findIndex(i => i.path === path);
  const prev = idx > 0 ? list.at(idx - 1) : null;
  const next = idx >= 0 && idx < list.length - 1 ? list.at(idx + 1) : null;
  const c = countChars(file.text);
  main.innerHTML = `
    <div class="doc-bar">
      <span class="muted">${isMs ? `공백 제외 ${c.noSpace.toLocaleString('ko-KR')}자` : '설정'}</span>
      <a class="btn small" href="#/edit/${path}">고치기</a>
    </div>
    <article class="prose ${isMs ? 'manuscript' : ''}">${md(file.text)}</article>
    <nav class="pager">
      ${prev ? `<a href="#/read/${prev.path}">← ${esc(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a href="#/read/${next.path}">${esc(next.title)} →</a>` : '<span></span>'}
    </nav>`;
  main.focus();
  window.scrollTo(0, 0);
}

async function nextEpisodeNumber() {
  const nums = manifest.manuscript.map(i => Number((i.path.match(/ep(\d+)\.md$/) || [])[1] || 0));
  return Math.max(0, ...nums) + 1;
}

async function viewEditor(path) {
  renderNav(path);
  const main = $('#main');
  const isNew = !path;
  let sha = null, original = '';
  if (!isNew) {
    main.innerHTML = '<p class="muted">불러오는 중…</p>';
    try {
      const f = await loadFile(path);
      if (f) { original = f.text; sha = f.sha; }
    } catch {}
  }
  const initial = original || (isNew ? `# 제${await nextEpisodeNumber()}화. 제목\n\n` : '');
  main.innerHTML = `
    <section class="editor">
      <div class="editor-head">
        <h2>${isNew ? '새 화 쓰기' : '원고 고치기'}</h2>
        <span id="count" class="muted"></span>
      </div>
      ${isNew ? `<label>파일명 <input id="filename" value="ep${pad(await nextEpisodeNumber())}.md" /></label>` : ''}
      <textarea id="editor" spellcheck="false"></textarea>
      <div class="editor-actions">
        <button id="save" class="btn primary">GitHub에 저장</button>
        <button id="preview" class="btn">미리보기</button>
        <button id="clearDraft" class="btn ghost">임시저장 지우기</button>
      </div>
      <div id="previewBox" class="prose manuscript hidden"></div>
    </section>`;
  const ta = $('#editor');
  ta.value = store.get(draftKey(path)) || initial;
  const updateCount = () => {
    const c = countChars(ta.value);
    $('#count').textContent = `공백 제외 ${c.noSpace.toLocaleString('ko-KR')}자`;
  };
  updateCount();
  ta.addEventListener('input', () => { updateCount(); store.set(draftKey(path), ta.value); });
  $('#preview').onclick = () => { const p = $('#previewBox'); p.innerHTML = md(ta.value); p.classList.toggle('hidden'); };
  $('#clearDraft').onclick = () => { store.del(draftKey(path)); toast('임시저장을 지웠어요.'); };
  $('#save').onclick = async () => {
    if (!token()) { location.hash = '#/connect'; toast('먼저 GitHub에 연결해 주세요.'); return; }
    let target = path;
    if (isNew) {
      const raw = $('#filename').value.trim();
      target = `manuscript/${raw.endsWith('.md') ? raw : raw + '.md'}`;
      if (!/^manuscript\/ep\d{3}\.md$/.test(target)) { toast('파일명은 ep012.md 같은 형식으로 입력해 주세요.'); return; }
    }
    $('#save').disabled = true;
    try {
      const msg = `${target.split('/').pop()} ${isNew ? '집필' : '수정'}`;
      sha = await saveFile(target, ta.value, msg, sha);
      store.del(draftKey(path));
      toast('GitHub에 저장했습니다.');
      if (isNew) location.hash = `#/read/${target}`;
    } catch (e) {
      if (e.message === 'conflict') toast('다른 곳에서 파일이 바뀌었습니다. 새로고침 후 다시 저장해 주세요.');
      else if (e.message === 'token') toast('토큰이 만료되었거나 잘못되었습니다.');
      else if (e.message === 'permission') toast('저장 권한이 없습니다. 토큰 권한과 저장소 접근을 확인해 주세요.');
      else toast(`저장 실패: ${e.message}`);
    } finally { $('#save').disabled = false; }
  };
}

function viewConnect() {
  renderNav(null);
  const has = !!token();
  $('#main').innerHTML = `
    <section class="connect">
      <p class="eyebrow">GitHub 연결</p>
      <h1>${has ? '연결되어 있습니다' : '저장소에 직접 저장하기'}</h1>
      <p>Fine-grained personal access token을 한 번 넣어 두면 이 브라우저에서 원고를 바로 읽고 수정할 수 있습니다.</p>
      <p class="muted">토큰은 이 브라우저에만 저장되며 서버로 보내지지 않습니다. 이 페이지는 GitHub API에 직접 요청합니다.</p>
      <div class="connect-form">
        <input id="tokenInput" type="password" placeholder="github_pat_…" autocomplete="off" />
        <button id="tokenSave" class="btn primary">저장하고 연결</button>
        ${has ? '<button id="tokenClear" class="btn">연결 해제</button>' : ''}
      </div>
      <p><a href="${TOKEN_PAGE}" target="_blank" rel="noopener">Fine-grained token 만들기 ↗</a> · <a href="${GH}" target="_blank" rel="noopener">저장소 열기 ↗</a></p>
      <p class="muted">권장 권한: 이 저장소만 선택 → Contents: Read and write.</p>
    </section>`;
  $('#tokenSave').onclick = async () => {
    const v = $('#tokenInput').value.trim();
    if (!v) return toast('토큰을 입력해 주세요.');
    store.set(TOKEN_KEY, v);
    try {
      const r = await fetch(`${API}/contents/AGENTS.md?ref=${REPO.branch}`, { headers: ghHeaders(), cache: 'no-store' });
      if (!r.ok) throw new Error();
      toast('연결되었습니다.');
      await loadManifest();
      location.hash = '#/';
    } catch {
      store.del(TOKEN_KEY);
      toast('연결하지 못했습니다. 토큰과 저장소 권한을 확인해 주세요.');
    }
  };
  if (has) $('#tokenClear').onclick = () => { store.del(TOKEN_KEY); toast('연결을 해제했습니다.'); location.hash = '#/'; };
}

async function router() {
  const hash = decodeURIComponent(location.hash || '#/');
  if (hash === '#/' || hash === '#') return viewHome();
  if (hash === '#/write') return viewEditor(null);
  if (hash === '#/connect') return viewConnect();
  if (hash.startsWith('#/read/')) return viewRead(hash.slice(7));
  if (hash.startsWith('#/edit/')) return viewEditor(hash.slice(7));
  viewHome();
}

window.addEventListener('hashchange', router);
await loadManifest();
await router();
