// Beyond Silicon site runtime: field/page manifest, layout, theme, and lazy lab loading.
// To add a new field (분야): append an entry to FIELDS; chapter.dir can point to an existing page folder.

export const BRAND = { name: 'Beyond Silicon', sub: '2D 물질 연구 길라잡이' };
export const PAPER_LIBRARY_URL = 'https://lab-paper-library-z1n00-1015.onrender.com';

export const FIELDS = [
  {
    id: 'materials', n: 'I', title: '2차원 물질 소개', en: 'INTRODUCTION TO 2D MATERIALS',
    desc: '2D 물질의 세계와 결정 구조에서 출발해 밀러 지수, 밴드 구조와 밴드갭까지 이어서 살펴봅니다.',
    chapters: [
      { id: 'intro', n: '01', title: '2차원 물질의 세계', group: '개요',
        desc: '원자층 물질의 결합과 구조, 실리콘 이후의 연구가 주목받는 이유를 간단히 훑어봅니다.', labs: ['흑연에서 그래핀으로'] },
      { id: 'crystal', dir: 'crystallography', n: '02', title: '결정 구조와 격자', group: '개요',
        desc: '브라베 격자, 기저, 단위격자, 역격자와 브릴루앙 영역을 학습합니다.', labs: ['3D 결정 구조 뷰어', '2D 브라베 격자·역격자'] },
      { id: 'diffraction', dir: 'crystallography', n: '03', title: '결정면과 밀러 지수', group: '개요',
        desc: '결정면을 밀러 지수로 나타내고 면간 거리와 결정 방향의 관계를 살펴봅니다.', labs: ['밀러 지수'] },
      { id: 'bands', dir: 'semiconductor', n: '04', title: '반도체 물리와 밴드갭', group: '개요',
        desc: '에너지 밴드, 직접·간접 밴드갭, 2D 물질의 층수 효과와 광학 응답을 살펴봅니다.', labs: ['밴드갭과 빛', 'MoS₂ 층 수', '디랙 원뿔'] },
    ],
  },
  {
    id: 'synthesis', n: 'II', title: '2차원 물질 합성', en: 'SYNTHESIS OF 2D MATERIALS',
    desc: '박리와 박막 증착부터 에피택시·하이포택시 기반 단결정 성장까지 소재를 만드는 방법을 살펴봅니다.',
    chapters: [
      { id: 'deposition', dir: 'materials', n: '01', title: '박막 증착', group: '합성',
        desc: 'CVD·PVD·ALD의 증착 원리와 2D 박막 형성에서의 활용 및 차이를 비교합니다.', labs: ['CVD 성장'] },
      { id: 'synthesis', dir: 'materials', n: '02', title: '2D 물질의 합성', group: '합성',
        desc: '기계적·액상 박리와 직접 합성 등 반데르발스 물질을 얻는 주요 경로를 살펴봅니다.', labs: ['기계적 박리'] },
      { id: 'single-crystal-growth', dir: 'materials', n: '03', title: '단결정 성장', group: '합성',
        desc: '에피택시와 hypotaxy를 중심으로 결정 방위를 제어하는 박막 성장을 살펴봅니다.', labs: ['Hypotaxy'] },
    ],
  },
  {
    id: 'analysis', n: 'III', title: '2차원 물질 분석', en: 'CHARACTERIZATION OF 2D MATERIALS',
    desc: 'XRD·Raman·TEM·XPS·AFM 등 분석법이 결정 구조와 물성에 대해 알려 주는 정보를 살펴봅니다.',
    chapters: [
      { id: 'characterization', dir: 'crystallography', n: '01', title: '2D 물질 분석법', group: '분석법',
        desc: 'XRD·Raman·TEM·XPS·AFM의 측정 원리와 각 방법으로 확인할 수 있는 물성을 개괄합니다.', labs: [] },
      { id: 'xrd', dir: 'crystallography', n: '02', title: 'X선 회절(XRD)', group: '분석법',
        desc: '브래그 회절, 회절 피크와 분말 XRD 패턴을 통해 결정상·격자 정보를 분석합니다.', labs: ['브래그 반사', '분말 XRD'] },
      { id: 'raman', dir: 'crystallography', n: '03', title: '라만 분광법', group: '분석법',
        desc: '비탄성 광산란과 Raman shift를 이해하고 2D 물질의 진동 모드와 층수·변형률 단서를 해석합니다.', labs: ['층수·strain과 라만 피크'] },
      { id: 'tem', dir: 'crystallography', n: '04', title: '투과전자현미경(TEM)', group: '분석법',
        desc: 'TEM·STEM 영상과 전자 회절·분광으로 국소 구조, 결함과 원소 분포를 분석하는 방법을 살펴봅니다.', labs: ['TEM 모아레 분석'] },
      { id: 'xps', dir: 'crystallography', n: '05', title: 'X선 광전자분광법(XPS)', group: '분석법',
        desc: '광전자 결합 에너지로 표면 원소 조성과 화학 상태를 분석하고 스펙트럼 해석의 주의점을 익힙니다.', labs: [] },
      { id: 'afm', dir: 'crystallography', n: '06', title: '원자힘현미경(AFM)', group: '분석법',
        desc: '탐침과 표면 사이의 힘으로 높이·거칠기를 측정하고 2D 플레이크 두께를 해석합니다.', labs: [] },
    ],
  },
  {
    id: 'applications', n: 'IV', title: '2차원 물질 응용', en: 'PROPERTIES & DEVICE APPLICATIONS',
    desc: 'FET를 비롯한 반도체 소자 응용을 중심으로, 강유전·자성·모아레 등 확장되는 연구 주제를 살펴봅니다.',
    chapters: [
      { id: 'ferroelectric', dir: 'materials', n: '01', title: '2D 강유전성', group: '기능성 물성',
        desc: '면내·면외 분극과 층간 sliding 강유전성의 원리, 대표 소재와 측정·소자 응용을 살펴봅니다.', labs: [] },
      { id: 'ferromagnetism', dir: 'materials', n: '02', title: '2D 자성', group: '기능성 물성',
        desc: '강자성과 반강자성의 원리, 대표 반데르발스 자성체, 스핀 수송과 소자 응용을 살펴봅니다.', labs: [] },
      { id: 'moire', dir: 'materials', n: '03', title: '이종구조와 모아레 연구', group: '기능성 물성',
        desc: '반데르발스 이종구조, 비틀림 각도, 모아레 초격자와 트위스트로닉스를 살펴봅니다.', labs: ['모아레 주기', '원자 재구성'] },
      { id: 'materials', dir: 'semiconductor', n: '04', title: '2D·광대역 반도체와 응용', group: '반도체 소자 응용',
        desc: '2D 반도체와 SiC·GaN·Ga₂O₃ 등 광대역 반도체의 특성 및 전력 소자 응용을 비교합니다.', labs: ['물질 라인업', '전력 반도체 비교'] },
      { id: 'devices', dir: 'semiconductor', n: '05', title: 'FET와 차세대 소자 응용', group: '반도체 소자 응용',
        desc: 'MOSFET의 게이트 제어와 2D 채널을 익히고 FeS-FET·NCFET, 이종구조 기반 소자 응용을 살펴봅니다.', labs: ['양자 터널링', '단채널 MOSFET'] },
    ],
  },
  {
    id: 'tools', n: 'V', title: '도구', en: 'TOOLS',
    desc: '논문 데이터와 주요 용어를 살펴보고 연구실 논문 분석실로 이동합니다.',
    chapters: [
      { id: 'papers', n: '01', title: '논문 데이터', group: '연구 자료',
        desc: '연구실 논문 라이브러리에 저장된 논문을 검색합니다.', labs: ['논문 검색'] },
      { id: 'glossary', n: '02', title: '용어 사전', group: '참고 도구',
        desc: '2D 물질과 반도체 분야의 핵심 용어를 표준 표기와 영문으로 찾아봅니다.', labs: [] },
    ],
    links: [{ title: '논문 분석실 · 로그인', url: PAPER_LIBRARY_URL }],
  },
];

const MODULES = {
  hero: './hero.js', stack: './stack.js', tunneling: './tunneling.js', fet: './fet.js',
  crystal: './crystal.js?v=20261020i', lattice2d: './lattice2d.js?v=20261020i', miller: './miller.js?v=20261020i', bragg: './bragg.js',
  xrd: './xrd.js?v=20261020i', moire: './moire.js?v=20261020l', 'moire-reconstruction': './moire-reconstruction.js?v=20261020s', spectrum: './spectrum.js',
  mos2: './mos2.js', bands: './bands.js', power: './power.js?v=20261020i', exfo: './exfo.js', cvd: './cvd.js',
  glossary: './glossary.js?v=20261021-materials-structure', refs: './papers.js?v=20261022-paper-keywords', papersearch: './papers.js?v=20261022-paper-keywords',
  raman: './raman.js?v=20261020i', 'tem-moire': './tem-moire.js?v=20261020l',
  hypotaxy: './hypotaxy.js?v=20261020h', 'home-lineup': './home-materials.js?v=20261021-sbo-topview',
  lineup: './lineup.js?v=20261021-sbo-topview',
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

export const chapterUrl = (root, field, ch) => `${root}chapters/${ch.dir || field.id}/${ch.id}.html`;

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

  // Keep the current field open on chapter pages; other fields start collapsed.
  const side = document.createElement('nav');
  side.className = 'sidebar';
  side.setAttribute('aria-label', '목차');
  let html = `<a class="nav-item ${current === 'home' ? 'active' : ''}" href="${root}index.html"><span class="num">⌂</span>표지 · 전체 분야</a>`;
  const fields = FIELDS;
  for (const f of fields) {
    let content = '';
    if (f.external) {
      content += `<a class="nav-item" href="${f.external}" target="_blank" rel="noopener"><span class="num">↗</span><span>SemiBook 열기</span></a>`;
    } else {
      let lastGroup = '';
      for (const c of f.chapters) {
        if (c.group && c.group !== lastGroup) { content += `<div class="nav-group" style="padding-top:8px;font-size:11px">${c.group}</div>`; lastGroup = c.group; }
        const isCurrent = f.id === fieldId && c.id === current;
        content += `<a class="nav-item ${isCurrent ? 'active' : ''}" href="${chapterUrl(root, f, c)}"><span class="num">${c.n}</span><span>${c.title}</span></a>`;
        if (isCurrent) content += '<div class="sub" id="subtoc"></div>';
      }
      for (const link of f.links || []) {
        content += `<a class="nav-item" href="${link.url}" target="_blank" rel="noopener"><span class="num">↗</span><span>${link.title}</span></a>`;
      }
    }
    const sectionId = `nav-field-${f.id}`;
    const isCurrentField = f.id === fieldId;
    html += `<button class="nav-field-toggle${isCurrentField ? ' is-current' : ''}" type="button" aria-expanded="${isCurrentField}" aria-controls="${sectionId}"><span>${f.n}. ${f.title}</span><span class="chevron" aria-hidden="true">⌄</span></button><div class="nav-field-content" id="${sectionId}"${isCurrentField ? '' : ' hidden'}>${content}</div>`;
  }
  side.innerHTML = html;
  body.insertBefore(side, top.nextSibling);
  side.querySelectorAll('.nav-field-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      document.getElementById(toggle.getAttribute('aria-controls')).hidden = expanded;
    });
  });
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

  // Keep the chapter meta row only for pages with interactive labs.
  const ch = field && field.chapters.find(c => c.id === current);
  const meta = document.querySelector('.chapter-head .meta');
  if (ch && meta && !meta.children.length) {
    meta.innerHTML = ch.labs.length ? `<span class="chip">🧪 인터랙티브 ${ch.labs.length}개</span>` : '';
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

  // footer
  const art = document.querySelector('.article');
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
