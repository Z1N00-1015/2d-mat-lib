// Beyond Silicon site runtime: field/page manifest, layout, theme, and lazy lab loading.
// To add a new field (분야): append an entry to FIELDS and put its pages in chapters/<field id>/.

export const BRAND = { name: 'Beyond Silicon', sub: '2D 물질 연구 분야 안내' };
export const PAPER_LIBRARY_URL = 'https://lab-paper-library-z1n00-1015.onrender.com';

export const FIELDS = [
  {
    id: 'materials', n: 'I', title: '2차원 물질의 이해', en: 'UNDERSTANDING 2D MATERIALS',
    desc: '원자층 물질의 특징과 결정 구조, 대표 계열, 합성법과 주요 연구 분야를 살펴봅니다.',
    chapters: [
      { id: 'intro', n: '01', title: '2차원 물질의 세계', group: '개요', time: 12, level: 1,
        desc: '원자층 물질의 결합과 구조, 실리콘 이후의 연구가 주목받는 이유를 간단히 훑어봅니다.', labs: ['흑연에서 그래핀으로'] },
      { id: 'synthesis', n: '02', title: '2D 물질의 합성', group: '합성과 연구', time: 15, level: 1,
        desc: '기계적 박리와 화학 기상 증착(CVD), 핵생성·성장·결정립계와 에피택시를 소개합니다.', labs: ['기계적 박리', 'CVD 성장'] },
      { id: 'moire', n: '03', title: '이종구조와 모아레 연구', group: '합성과 연구', time: 15, level: 2,
        desc: '반데르발스 이종구조, 비틀림 각도, 모아레 초격자와 트위스트로닉스를 살펴봅니다.', labs: ['모아레 초격자'] },
    ],
  },
  {
    id: 'crystallography', n: 'II', title: '결정학과 분석 방법', en: 'CRYSTALLOGRAPHY & CHARACTERIZATION',
    desc: '결정 격자와 회절의 원리를 익히고, XRD·Raman·TEM·XPS·AFM 등 재료 분석법이 알려 주는 정보를 비교합니다.',
    chapters: [
      { id: 'crystal', n: '01', title: '결정 구조와 격자', group: '결정학 기초', time: 25, level: 2,
        desc: '브라베 격자, 기저, 단위 세포, 역격자와 브릴루앙 영역을 학습합니다.', labs: ['3D 결정 구조 뷰어', '2D 브라베 격자·역격자'] },
      { id: 'diffraction', n: '02', title: '결정면과 X선 회절', group: '회절 분석', time: 25, level: 2,
        desc: '밀러 지수, 면간 거리, 브래그 법칙, 구조 인자와 분말 XRD를 다룹니다.', labs: ['밀러 지수', '브래그 반사', '분말 XRD'] },
      { id: 'characterization', n: '03', title: '2D 물질 분석법', group: '분광·현미경 분석', time: 12, level: 1,
        desc: 'Raman·TEM·XPS·AFM의 측정 원리와 각 방법으로 확인할 수 있는 물성을 개괄합니다.', labs: [] },
    ],
  },
  {
    id: 'semiconductor', n: 'III', title: '반도체 물리와 소자 응용', en: 'SEMICONDUCTOR PHYSICS & DEVICES',
    desc: '에너지 밴드와 밴드갭에서 출발해 FET와 강유전체·음의 정전용량을 이용하는 차세대 소자로 나아갑니다.',
    chapters: [
      { id: 'bands', n: '01', title: '반도체 물리와 밴드갭', group: '전자 구조', time: 25, level: 3,
        desc: '에너지 밴드, 직접·간접 밴드갭, 2D 물질의 층수 효과와 광학 응답을 살펴봅니다.', labs: ['밴드갭과 빛', 'MoS₂ 층 수', '디랙 원뿔'] },
      { id: 'materials', n: '02', title: '2D·광대역 반도체와 응용', group: '물질과 응용', time: 20, level: 1,
        desc: '2D 반도체와 SiC·GaN·Ga₂O₃ 등 광대역 반도체의 특성 및 전력 소자 응용을 비교합니다.', labs: ['물질 라인업', '전력 반도체 비교'] },
      { id: 'devices', n: '03', title: 'FET와 차세대 트랜지스터', group: '소자 응용', time: 30, level: 3,
        desc: 'MOSFET의 게이트 제어와 2D 채널을 익히고 FeS-FET·NCFET의 기본 아이디어를 소개합니다.', labs: ['양자 터널링', '단채널 MOSFET'] },
    ],
  },
  {
    id: 'tools', n: 'IV', title: '도구', en: 'TOOLS',
    desc: '논문 데이터와 주요 용어를 살펴보고 연구실 논문 분석실로 이동합니다.',
    chapters: [
      { id: 'papers', n: '01', title: '논문 데이터', group: '연구 자료', time: 10, level: 1,
        desc: '논문 데이터베이스에서 검토 완료한 수치를 논문별로 비교합니다.', labs: ['논문별 수치 비교'] },
      { id: 'glossary', n: '02', title: '용어 사전', group: '참고 도구', time: 0, level: 0,
        desc: '2D 물질과 반도체 분야의 핵심 용어를 표준 표기와 영문으로 찾아봅니다.', labs: [] },
    ],
    links: [{ title: '논문 분석실 · 로그인', url: PAPER_LIBRARY_URL }],
  },
];

const MODULES = {
  hero: './hero.js', stack: './stack.js', tunneling: './tunneling.js', fet: './fet.js',
  crystal: './crystal.js', lattice2d: './lattice2d.js', miller: './miller.js', bragg: './bragg.js',
  xrd: './xrd.js', moire: './moire.js', lineup: './lineup.js', spectrum: './spectrum.js',
  mos2: './mos2.js', bands: './bands.js', power: './power.js', exfo: './exfo.js', cvd: './cvd.js',
  glossary: './glossary.js', refs: './papers.js?v=20261019b', paperdata: './papers.js?v=20261019b',
};

const LOGO = '<svg class="brand-logo" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="bslg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a6cf0"/><stop offset="1" stop-color="#1fb3a3"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="8" fill="url(#bslg)"/><g fill="none" stroke="#fff" stroke-width="1.6" stroke-opacity=".9"><path d="M16 7.5l7.4 4.25v8.5L16 24.5l-7.4-4.25v-8.5z"/></g><circle cx="16" cy="16" r="2.6" fill="#fff"/></svg>';
const ICONS = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>',
};

export const store = {
  get(k, d) { try { const v = localStorage.getItem('beyondsi:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('beyondsi:' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
};

// ---------- theme (applied before layout to avoid a flash) ----------
const savedTheme = store.get('theme', null);
if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
export function isDark() {
  const t = document.documentElement.getAttribute('data-theme');
  if (t) return t === 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const chapterUrl = (root, field, ch) => `${root}chapters/${field.id}/${ch.id}.html`;
const levelDots = (n) => n ? '●'.repeat(n) + '○'.repeat(3 - n) : '';

function buildLayout() {
  const body = document.body;
  const root = body.dataset.root || './';
  const fieldId = body.dataset.field || null;
  const current = body.dataset.chapter || 'home';
  const field = FIELDS.find(f => f.id === fieldId);

  const top = document.createElement('header');
  top.className = 'topbar';
  top.innerHTML = `
    <button class="icon-btn menu-btn" aria-label="목차 열기">${ICONS.menu}</button>
    <a class="brand" href="${root}index.html">${LOGO}<span>${BRAND.name}</span><small>${field ? field.title : BRAND.sub}</small></a>
    <div class="spacer"></div>
    <button class="icon-btn theme-btn" aria-label="테마 전환"></button>`;
  body.prepend(top);
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  body.prepend(bar);

  // Keep every field visible; expand only the current chapter's section links.
  const side = document.createElement('nav');
  side.className = 'sidebar';
  side.setAttribute('aria-label', '목차');
  let html = `<a class="nav-item ${current === 'home' ? 'active' : ''}" href="${root}index.html"><span class="num">⌂</span>표지 · 전체 분야</a>`;
  const fields = FIELDS;
  for (const f of fields) {
    html += `<div class="nav-group">${f.n}. ${f.title}</div>`;
    if (f.external) {
      html += `<a class="nav-item" href="${f.external}" target="_blank" rel="noopener"><span class="num">↗</span><span>SemiBook 열기</span></a>`;
      continue;
    }
    let lastGroup = '';
    for (const c of f.chapters) {
      if (c.group && c.group !== lastGroup) { html += `<div class="nav-group" style="padding-top:8px;font-size:11px">${c.group}</div>`; lastGroup = c.group; }
      const isCurrent = f.id === fieldId && c.id === current;
      html += `<a class="nav-item ${isCurrent ? 'active' : ''}" href="${chapterUrl(root, f, c)}"><span class="num">${c.n}</span><span>${c.title}</span></a>`;
      if (isCurrent) html += '<div class="sub" id="subtoc"></div>';
    }
    for (const link of f.links || []) {
      html += `<a class="nav-item" href="${link.url}" target="_blank" rel="noopener"><span class="num">↗</span><span>${link.title}</span></a>`;
    }
  }
  side.innerHTML = html;
  body.insertBefore(side, top.nextSibling);
  const scrim = document.createElement('div');
  scrim.className = 'scrim';
  body.appendChild(scrim);
  top.querySelector('.menu-btn').addEventListener('click', () => body.classList.toggle('nav-open'));
  scrim.addEventListener('click', () => body.classList.remove('nav-open'));

  const tb = top.querySelector('.theme-btn');
  const paintTB = () => { tb.innerHTML = isDark() ? ICONS.sun : ICONS.moon; };
  paintTB();
  tb.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    store.set('theme', next);
    paintTB();
  });

  // chapter header meta (time · labs · level) from the manifest
  const ch = field && field.chapters.find(c => c.id === current);
  const meta = document.querySelector('.chapter-head .meta');
  if (ch && meta && !meta.children.length) {
    meta.innerHTML = [ch.time ? `⏱ ${ch.time}분` : '', ch.labs.length ? `🧪 실험 ${ch.labs.length}개` : '', ch.level ? `난이도 ${levelDots(ch.level)}` : '']
      .filter(Boolean).map(t => `<span class="chip">${t}</span>`).join('');
  }

  // in-page section TOC
  const sub = document.getElementById('subtoc');
  const heads = [...document.querySelectorAll('.article h2')];
  if (sub && heads.length) {
    heads.forEach((h, i) => {
      if (!h.id) h.id = 's' + (i + 1);
      const a = document.createElement('a');
      a.href = '#' + h.id;
      const c = h.cloneNode(true); c.querySelector('.sec')?.remove();
      a.textContent = c.textContent.trim();
      a.addEventListener('click', () => body.classList.remove('nav-open'));
      sub.appendChild(a);
    });
    const links = [...sub.querySelectorAll('a')];
    const spy = () => {
      let idx = 0;
      heads.forEach((h, i) => { if (h.getBoundingClientRect().top < 140) idx = i; });
      links.forEach((l, i) => l.classList.toggle('on', i === idx));
    };
    addEventListener('scroll', spy, { passive: true });
    spy();
  }

  const prog = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + '%';
  };
  addEventListener('scroll', prog, { passive: true });
  prog();

  // pager + footer
  const art = document.querySelector('.article');
  if (art && field) {
    const list = field.chapters, i = list.findIndex(c => c.id === current);
    const prev = list[i - 1], next = list[i + 1];
    const pg = document.createElement('div');
    pg.className = 'pager';
    pg.innerHTML = (prev
      ? `<a class="prev" href="${prev.id}.html"><small>← 이전 장</small><b>${prev.n} ${prev.title}</b></a>`
      : `<a class="prev" href="${root}index.html"><small>← 표지</small><b>전체 분야로 돌아가기</b></a>`)
      + (next ? `<a class="next" href="${next.id}.html"><small>다음 장 →</small><b>${next.n} ${next.title}</b></a>` : '');
    art.appendChild(pg);
  }
  if (art) {
    const f = document.createElement('footer');
    f.className = 'site-foot';
    f.innerHTML = `${BRAND.name} · ${BRAND.sub} — 시뮬레이션은 교육용 단순화 모델이며, 수치는 문헌의 대표값입니다.`;
    art.appendChild(f);
  }
}

// ---------- lazy-load interactive labs as they approach the viewport ----------
function loadModules() {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      const path = MODULES[e.target.dataset.module];
      if (path) import(path).then(m => m.init(e.target)).catch(err => console.error(`[${e.target.dataset.module}]`, err));
    }
  }, { rootMargin: '600px 0px' });
  document.querySelectorAll('[data-module]').forEach(el => io.observe(el));
}

buildLayout();
loadModules();
