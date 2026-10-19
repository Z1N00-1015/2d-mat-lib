// Beyond Silicon book runtime: field/chapter manifest, layout, theme, quiz, lazy lab loading.
// To add a new field (분야): append an entry to FIELDS and put its pages in chapters/<field id>/.

export const BRAND = { name: 'Beyond Silicon', sub: '반도체 인터랙티브 교과서' };

export const FIELDS = [
  {
    id: 'nextgen', n: 'I', title: '차세대 반도체 물질', en: 'NEXT-GENERATION SEMICONDUCTOR MATERIALS',
    desc: '원자 한 층 두께의 2D 물질과 광대역 밴드갭 반도체를 결정학·전자 구조·소자·공정의 순서로 다룹니다.',
    chapters: [
      { id: 'intro', n: '00', title: '왜 새로운 반도체 물질인가', group: '시작하기', time: 12, level: 1,
        desc: '실리콘 미세화의 한계와 2D 물질·광대역 반도체가 등장한 배경을 살펴봅니다.', labs: ['흑연에서 그래핀으로'] },
      { id: 'crystal', n: '01', title: '결정 구조와 격자', group: '결정학', time: 25, level: 2,
        desc: '브라베 격자, 기저, 단위 세포, 역격자와 브릴루앙 영역. 일곱 가지 결정을 3D로 살펴봅니다.', labs: ['3D 결정 구조 뷰어', '2D 브라베 격자·역격자'] },
      { id: 'diffraction', n: '02', title: '결정면과 X선 회절', group: '결정학', time: 25, level: 2,
        desc: '밀러 지수, 면간 거리, 브래그 법칙, 구조 인자와 소멸 규칙.', labs: ['밀러 지수', '브래그 반사', '분말 XRD'] },
      { id: 'moire', n: '03', title: '모아레와 트위스트로닉스', group: '결정학', time: 15, level: 2,
        desc: '두 격자를 비틀거나 어긋나게 겹쳤을 때 생기는 모아레 초격자와 매직 앵글.', labs: ['모아레 초격자'] },
      { id: 'bands', n: '04', title: '에너지 밴드와 광학 특성', group: '전자 구조', time: 25, level: 3,
        desc: '밴드갭과 빛, 층 수에 따른 MoS₂의 간접→직접 전이, 그래핀의 디랙 원뿔.', labs: ['밴드갭과 빛', 'MoS₂ 층 수', '디랙 원뿔'] },
      { id: 'materials', n: '05', title: '2D 물질과 광대역 반도체', group: '물질', time: 20, level: 1,
        desc: '그래핀·h-BN·TMD·흑린·MXene과 SiC·GaN·Ga₂O₃·다이아몬드의 특징과 전력 소자 성능지수.', labs: ['물질 라인업', '전력 반도체 비교'] },
      { id: 'devices', n: '06', title: '2D 반도체 트랜지스터', group: '소자', time: 25, level: 3,
        desc: '게이트 절연막의 양자 터널링, 단채널 효과와 스케일 길이, 원자층 채널의 장점.', labs: ['양자 터널링', '단채널 MOSFET'] },
      { id: 'synthesis', n: '07', title: '2D 물질의 합성', group: '공정', time: 15, level: 1,
        desc: '기계적 박리와 화학 기상 증착(CVD), 핵생성·성장·결정립계와 에피택시.', labs: ['기계적 박리', 'CVD 성장'] },
      { id: 'papers', n: '08', title: '연구실 논문 데이터', group: '연구 데이터', time: 10, level: 1,
        desc: '연구실 논문 DB에서 검토 완료한 수치를 논문별로 비교합니다.', labs: ['논문별 수치 비교'] },
      { id: 'glossary', n: '··', title: '용어 사전', group: '부록', time: 0, level: 0,
        desc: '이 분야의 핵심 용어를 교과서 표기와 영문으로 찾아봅니다.', labs: [] },
    ],
  },
  {
    id: 'process', n: 'II', title: '반도체 공정', en: 'SEMICONDUCTOR PROCESS',
    desc: '웨이퍼부터 패키징까지 8대 공정을 실험으로 배우는 SemiBook(별도 사이트)입니다.',
    external: 'https://z1n00-1015.github.io/semiwiki/',
    chapters: [],
    summary: ['웨이퍼 제조', '산화', '포토리소그래피', '식각', '박막 증착', '이온 주입', '금속 배선·CMP', '테스트·수율', '패키징', '첨단 트랜지스터'],
  },
];

const MODULES = {
  hero: './hero.js', stack: './stack.js', tunneling: './tunneling.js', fet: './fet.js',
  crystal: './crystal.js', lattice2d: './lattice2d.js', miller: './miller.js', bragg: './bragg.js',
  xrd: './xrd.js', moire: './moire.js', lineup: './lineup.js', spectrum: './spectrum.js',
  mos2: './mos2.js', bands: './bands.js', power: './power.js', exfo: './exfo.js', cvd: './cvd.js',
  glossary: './glossary.js', refs: './papers.js', paperdata: './papers.js',
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

  // sidebar: the current field's chapters, or every field on the hub
  const side = document.createElement('nav');
  side.className = 'sidebar';
  side.setAttribute('aria-label', '목차');
  const done = store.get('done', {});
  let html = `<a class="nav-item ${current === 'home' ? 'active' : ''}" href="${root}index.html"><span class="num">⌂</span>표지 · 전체 분야</a>`;
  const fields = field ? [field] : FIELDS;
  for (const f of fields) {
    html += `<div class="nav-group">${f.n}. ${f.title}</div>`;
    if (f.external) {
      html += `<a class="nav-item" href="${f.external}" target="_blank" rel="noopener"><span class="num">↗</span><span>SemiBook 열기</span></a>`;
      continue;
    }
    let lastGroup = '';
    for (const c of f.chapters) {
      if (field && c.group !== lastGroup) { html += `<div class="nav-group" style="padding-top:8px;font-size:11px">${c.group}</div>`; lastGroup = c.group; }
      const key = `${f.id}/${c.id}`;
      html += `<a class="nav-item ${field && c.id === current ? 'active' : ''}" href="${chapterUrl(root, f, c)}"><span class="num">${c.n}</span><span>${c.title}</span>${done[key] ? '<span class="check" title="퀴즈 완료">✓</span>' : ''}</a>`;
      if (field && c.id === current) html += '<div class="sub" id="subtoc"></div>';
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

// ---------- quiz (questions from <script type="application/json" id="quiz-data">) ----------
function buildQuiz() {
  const el = document.getElementById('quiz');
  const src = document.getElementById('quiz-data');
  if (!el || !src) return;
  const questions = JSON.parse(src.textContent);
  const key = `${document.body.dataset.field}/${document.body.dataset.chapter}`;
  let answered = 0, right = 0;
  el.classList.add('quiz');
  el.innerHTML = `<div class="quiz-head"><span style="font-size:22px">🧠</span><h4>확인 문제</h4><span class="score">0 / ${questions.length}</span></div>`;
  const score = el.querySelector('.score');
  questions.forEach((q, qi) => {
    const d = document.createElement('div');
    d.className = 'q';
    d.innerHTML = `<div class="qt"><span class="qn">Q${qi + 1}.</span>${q.q}</div><div class="opts"></div><div class="why"></div>`;
    const opts = d.querySelector('.opts');
    q.o.forEach((o, oi) => {
      const b = document.createElement('button');
      b.className = 'opt';
      b.innerHTML = o;
      b.addEventListener('click', () => {
        if (d.classList.contains('done')) return;
        d.classList.add('done');
        answered++;
        const ok = oi === q.a;
        if (ok) right++;
        [...opts.children].forEach((x, xi) => {
          x.disabled = true;
          if (xi === q.a) x.classList.add('right'); else if (xi === oi) x.classList.add('wrong');
        });
        d.querySelector('.why').innerHTML = (ok ? '✅ 정답입니다. ' : '❌ 다시 생각해 봅시다. ') + (q.why || '');
        score.textContent = `${right} / ${questions.length}` + (answered === questions.length ? (right === questions.length ? ' · 만점 🎉' : ' · 완료') : '');
        if (answered === questions.length) {
          const done = store.get('done', {}); done[key] = true; store.set('done', done);
          const link = document.querySelector('.sidebar a.nav-item.active');
          if (link && !link.querySelector('.check')) link.insertAdjacentHTML('beforeend', '<span class="check">✓</span>');
        }
      });
      opts.appendChild(b);
    });
    el.appendChild(d);
  });
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
buildQuiz();
loadModules();
