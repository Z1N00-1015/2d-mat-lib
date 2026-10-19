// Page bootstrap: nav, reveal-on-scroll, counters, lazy module loading, quiz

const MODULES = {
  hero: './hero.js',
  stack: './stack.js',
  tunneling: './tunneling.js',
  fet: './fet.js',
  crystal: './crystal.js',
  lattice2d: './lattice2d.js',
  miller: './miller.js',
  bragg: './bragg.js',
  xrd: './xrd.js',
  moire: './moire.js',
  lineup: './lineup.js',
  spectrum: './spectrum.js',
  mos2: './mos2.js',
  bands: './bands.js',
  power: './power.js',
  exfo: './exfo.js',
  cvd: './cvd.js',
};

// ---- Lazy-init interactive modules when they approach the viewport
const lazy = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    lazy.unobserve(el);
    const path = MODULES[el.dataset.module];
    if (!path) continue;
    import(path)
      .then(m => m.init(el))
      .catch(err => console.error(`[${el.dataset.module}]`, err));
  }
}, { rootMargin: '800px 0px' });
document.querySelectorAll('[data-module]').forEach(el => lazy.observe(el));

// ---- Reveal on scroll
const rev = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); }
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => rev.observe(el));

// ---- Animated counters
const cnt = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    cnt.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, dec = +(el.dataset.dec || 0);
    const t0 = performance.now(), dur = 1600;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * k).toLocaleString('ko-KR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => cnt.observe(el));

// ---- Nav: progress bar, active link, mobile toggle
const bar = document.getElementById('progress');
const links = [...document.querySelectorAll('#navlinks a')];
const targets = links.map(a => document.querySelector(a.getAttribute('href')));
function onScroll() {
  const h = document.documentElement;
  bar.style.width = (100 * h.scrollTop / (h.scrollHeight - h.clientHeight)) + '%';
  let idx = -1;
  targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top < innerHeight * 0.4) idx = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === idx));
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();
document.getElementById('navtoggle').addEventListener('click', () => document.getElementById('navlinks').classList.toggle('open'));
links.forEach(a => a.addEventListener('click', () => document.getElementById('navlinks').classList.remove('open')));

// ---- Quiz
const QUIZ = [
  { q: '단층 MoS₂가 벌크 MoS₂보다 훨씬 강하게 빛나는 이유는?', o: ['밴드갭이 0이 되어서', '간접 → 직접 밴드갭으로 바뀌어서', '전자 이동도가 높아져서', '결정 구조가 입방정으로 바뀌어서'], a: 1, e: '단층이 되면 Γ점의 가전자대 최고점이 내려가 K점에서 직접 전이가 가장 작은 밴드갭이 됩니다. 운동량 보존을 위한 포논이 필요 없으므로 발광 효율이 급증합니다.' },
  { q: '면심입방(FCC) 결정의 X선 회절에서 나타나는 피크는?', o: ['h+k+l이 짝수인 면', 'h, k, l이 모두 짝수이거나 모두 홀수인 면', '모든 (hkl)', 'h+k+l = 4n 인 면만'], a: 1, e: 'FCC의 구조 인자는 h, k, l이 모두 짝수이거나 모두 홀수일 때만 0이 아닙니다. 그래서 (111), (200), (220), (311)… 이 나타나고 (100), (110)은 사라집니다. 다이아몬드 구조에서는 추가로 (200)도 사라지죠.' },
  { q: '트위스트 각 θ가 작아지면 모아레 주기 L은?', o: ['작아진다', '변하지 않는다', '커진다', '0이 된다'], a: 2, e: 'L = a / (2 sin(θ/2)) 이므로 θ가 작을수록 L은 커집니다. 매직 앵글 1.1°에서 L ≈ 13 nm로, 그래핀 격자 상수의 약 52배입니다.' },
  { q: '전력 반도체에서 넓은 밴드갭 물질이 유리한 가장 큰 이유는?', o: ['빛을 잘 흡수해서', '절연파괴 전계가 높아 얇은 층으로 고전압을 견뎌서', '격자 상수가 커서', '가격이 저렴해서'], a: 1, e: '밴드갭이 넓을수록 절연파괴 전계가 커집니다. 같은 전압을 훨씬 얇고 도핑이 높은 드리프트층으로 견딜 수 있어 온저항이 E꜀³에 반비례해 줄어듭니다(BFOM).' },
];
const qb = document.getElementById('quizbox');
QUIZ.forEach((item) => {
  const d = document.createElement('div');
  d.className = 'q reveal';
  d.innerHTML = `<h4>${item.q}</h4><div class="opts">${item.o.map((o, j) => `<button data-j="${j}">${o}</button>`).join('')}</div><div class="exp">${item.e}</div>`;
  d.querySelector('.opts').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || d.classList.contains('done')) return;
    d.classList.add('done');
    const j = +b.dataset.j;
    b.classList.add(j === item.a ? 'right' : 'wrong');
    d.querySelectorAll('button')[item.a].classList.add('right');
  });
  qb.appendChild(d);
  rev.observe(d);
});
