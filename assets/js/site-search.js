// 상단 바 검색창: 위키 문서와 장(분야별 페이지)을 한꺼번에 찾는다.
// 위키 색인(data/wiki-index.json)은 tools/build_wiki.py가 만들고, 장 목록은 런타임의 FIELDS를 받는다.
const SUBS = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
const norm = s => String(s || '').toLowerCase().replace(/[₀-₉]/g, c => SUBS[c]).replace(/[\s·\-–()]/g, '');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MAX = 8;

function score(q, item) {
  let best = 0;
  item.names.forEach((n, i) => {
    const s = n === q ? 100 : n.startsWith(q) ? 80 : n.includes(q) ? 60 : 0;
    best = Math.max(best, s - (i ? 5 : 0));
  });
  if (!best && item.text.includes(q)) best = 20;
  return best ? best + item.boost : 0;
}

export function init({ top, root, fields, chapterUrl }) {
  const box = top.querySelector('.site-search');
  const input = box.querySelector('input');
  const list = box.querySelector('.site-search-results');
  const openBtn = top.querySelector('.search-btn');
  let items = null, results = [], active = -1;

  const chapters = fields.filter(f => !f.external && f.id !== 'wiki').flatMap(f => f.chapters.map(c => ({
    kind: '장', title: c.title, sub: `${f.n}. ${f.title}`, desc: c.desc || '', url: chapterUrl(root, f, c),
    names: [norm(c.title)], text: norm(`${c.title} ${c.desc || ''} ${(c.labs || []).join(' ')}`), boost: 3,
  })));

  async function load() {
    if (items) return items;
    let wiki = [];
    try {
      const res = await fetch(`${root}data/wiki-index.json`);
      if (res.ok) ({ entries: wiki = [] } = await res.json());
    } catch { /* 색인이 없으면 장만 검색한다 */ }
    items = chapters.concat(wiki.map(e => ({
      kind: '위키', title: e.title, sub: e.en || e.category, desc: e.summary || '', url: `${root}${e.url}`,
      names: [e.title, ...String(e.en || '').split(','), ...(e.aliases || [])].map(norm).filter(Boolean),
      text: norm(`${e.title} ${e.en} ${(e.aliases || []).join(' ')} ${e.summary}`), boost: e.status === '검토됨' ? 2 : 0,
    })));
    return items;
  }

  function render() {
    const raw = input.value.trim();
    const q = norm(raw);
    if (!q) { list.hidden = true; list.innerHTML = ''; results = []; return; }
    results = items.map(it => [score(q, it), it]).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).slice(0, MAX).map(([, it]) => it);
    active = results.length ? 0 : -1;
    const rows = results.map((it, i) => `<a class="ssr-item${i === active ? ' on' : ''}" role="option" href="${esc(it.url)}">
      <span class="ssr-kind ${it.kind === '위키' ? 'is-wiki' : ''}">${it.kind}</span>
      <span class="ssr-main"><b>${esc(it.title)}</b><small>${esc(it.sub)}</small><span class="ssr-desc">${esc(it.desc)}</span></span></a>`).join('');
    const more = `<a class="ssr-more" href="${esc(root)}chapters/wiki/index.html?q=${encodeURIComponent(raw)}">위키 전체 문서에서 ‘${esc(raw)}’ 찾기 →</a>`;
    list.innerHTML = (rows || '<div class="ssr-empty">찾는 문서가 없습니다.</div>') + more;
    list.hidden = false;
  }

  function move(d) {
    if (!results.length) return;
    active = (active + d + results.length) % results.length;
    list.querySelectorAll('.ssr-item').forEach((a, i) => a.classList.toggle('on', i === active));
    list.querySelectorAll('.ssr-item')[active]?.scrollIntoView({ block: 'nearest' });
  }

  function close() { list.hidden = true; document.body.classList.remove('search-open'); }

  input.addEventListener('focus', async () => { await load(); render(); });
  input.addEventListener('input', async () => { await load(); render(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[active];
      location.href = target ? target.url : `${root}chapters/wiki/index.html?q=${encodeURIComponent(input.value.trim())}`;
    } else if (e.key === 'Escape') { input.blur(); close(); }
  });
  document.addEventListener('click', e => { if (!box.contains(e.target) && e.target !== openBtn && !openBtn.contains(e.target)) close(); });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openBtn.offsetParent ? openBtn.click() : input.focus(); }
  });
  openBtn.addEventListener('click', () => {
    document.body.classList.toggle('search-open');
    if (document.body.classList.contains('search-open')) input.focus();
  });
}
