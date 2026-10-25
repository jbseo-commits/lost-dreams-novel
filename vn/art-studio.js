// This adapter changes presentation only. Story text, choices and save coordinates are shared.
export async function chapterFingerprints(story, cryptoImpl = globalThis.crypto) {
  const entries = await Promise.all(story.chapters.map(async chapter => {
    const bytes = new TextEncoder().encode(JSON.stringify(chapter.beats.map(beat => beat.text)));
    const digest = await cryptoImpl.subtle.digest('SHA-256', bytes);
    return [chapter.id, [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('')];
  }));
  return Object.fromEntries(entries);
}

export function validTarget(target, chapter, fingerprints) {
  return Boolean(target && chapter && target.chapterId === chapter.id &&
    Number.isInteger(target.start) && Number.isInteger(target.end) && target.start >= 0 &&
    target.end >= target.start && target.end < chapter.beats.length &&
    target.fingerprint === fingerprints[chapter.id] &&
    target.anchor === chapter.beats[target.start]?.text && target.endAnchor === chapter.beats[target.end]?.text);
}

export function safeArtPath(value) {
  if (typeof value !== 'string' || value.includes('..') || /["'()\\\x00-\x1f]/.test(value)) return false;
  if (/^data:image\/(?:png|webp|jpeg);base64,[A-Za-z0-9+/=]+$/.test(value)) return true;
  return /^(?:assets\/studio\/|\/candidates\/|\/media\/(?:vn|baseball)\/)[a-zA-Z0-9_./%-]+\.(?:png|webp|jpe?g)(?:\?[^"'<>]*)?$/.test(value);
}

export function createArtDirector({ manifest = { overrides: [] }, fingerprints, baseAssets }) {
  let persisted = manifest.overrides || [], temporary = [], assets = { ...baseAssets };
  function install(rows) {
    assets = { ...baseAssets };
    for (const row of rows) if (safeArtPath(row.asset)) assets[`studio_${row.id}`] = row.asset;
  }
  install(persisted);
  return {
    get assets() { return assets; },
    preview(row) { temporary = row ? [row] : []; install([...persisted, ...temporary]); },
    cue(cue, chapter, index) {
      const rows = [...persisted, ...temporary].filter(row => safeArtPath(row.asset) &&
        validTarget(row.target, chapter, fingerprints) && index >= row.target.start && index <= row.target.end);
      if (!rows.length) return cue;
      const beat = chapter.beats[index];
      const out = structuredClone(cue || { chapterId: chapter.id, index, sceneStart: index,
        title: chapter.title, place: beat.direction?.place || '', background: beat.scene || 'room',
        actors: [], focus: beat.speaker || '', cg: null, shot: 'wide', intro: false, blackout: false,
        silence: false, hideLegacyVisual: true, music: null, ambience: null, document: null, wallAd: false });
      out.studioApplied = [];
      for (const row of rows) {
        const target = row.target, key = `studio_${row.id}`;
        if (target.slot === 'cg') {
          const center=value=>Number.isFinite(Number(value))?Math.max(0,Math.min(100,Number(value))):50;
          out.cg = key; out.actors = []; out.shot = 'insert'; out.intro = false; out.blackout = false;
          out.cutscene = { id: key, alt: row.label || '선택한 장면 그림', fit:target.fit==='contain'?'contain':'cover',position:`${center(target.positionX)}% ${center(target.positionY)}%` };
        } else if (target.slot === 'background') {
          out.backgroundAsset = key;
        } else if (target.slot === 'actor') {
          let actor = out.actors.find(person => person.id === target.actorId);
          if (!actor) {
            actor = { id: target.actorId, name: {seoin:'서인',jiwoo:'지우',mother:'어머니',father:'아버지',doyun:'도윤',hakyung:'하경',reho:'재호',mira:'미라',yeonwoo:'연우'}[target.actorId] || target.actorId,
              side: target.side || 'left', gaze: target.gaze || 'right', pose: target.pose || 'standing' };
            out.actors.push(actor);
          }
          actor.asset = key;
          for (const prop of ['side', 'gaze', 'pose']) if (target[prop]) actor[prop] = target[prop];
          actor.studioTransform = { scale: Math.max(.5, Math.min(1.7, Number(target.scale) || 1)),
            x: Math.max(-30, Math.min(30, Number(target.offsetX) || 0)), y: Math.max(-30, Math.min(30, Number(target.offsetY) || 0)) };
          out.cg = null; out.cutscene = null; out.intro = false; out.blackout = false;
        }
        out.studioApplied.push(row.id);
      }
      return out;
    },
  };
}

export function createPreviewStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
}

export async function readArtManifest(fetchImpl = globalThis.fetch) {
  try {
    if(globalThis.VN_ART_DIRECTION?.version===1&&Array.isArray(globalThis.VN_ART_DIRECTION.overrides))return globalThis.VN_ART_DIRECTION;
    const response = await fetchImpl(new URL('./art-direction.json', globalThis.location?.href || 'http://localhost/vn/'), { cache: 'no-store' });
    if (!response.ok) return { version: 1, overrides: [] };
    const value = await response.json();
    return value?.version === 1 && Array.isArray(value.overrides) ? value : { version: 1, overrides: [] };
  } catch { return { version: 1, overrides: [] }; }
}
