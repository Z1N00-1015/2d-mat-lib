// Material lineup: Apple-style compare cards with mini animated structures
import { fitCanvas, animate } from './util.js';

const MATS = [
  { id: 'gr', fam: '2d', sym: 'C', nm: '그래핀', eg: 0, egt: '0 eV', grad: ['#64d2ff', '#2997ff'], draw: 'honey', cols: ['#b8c0cc', '#b8c0cc'],
    kind: '2D 반금속(semimetal) · 디랙 물질', title: '그래핀', desc: '탄소 원자 한 층. 알려진 물질 중 최고 수준의 전자 이동도와 열전도율, 강철의 200배에 이르는 강도를 가집니다. 밴드갭이 없어 논리 소자의 스위치로는 어렵지만 고주파 소자, 투명 전극, 센서, 방열 소재로 쓰입니다.',
    spec: [['밴드갭', '0 eV'], ['이동도', '>10⁵ cm²/V·s'], ['열전도율', '~3000–5000 W/m·K'], ['두께', '0.34 nm']], tags: ['RF 트랜지스터', '투명 전극', '바이오 센서', '방열'] },
  { id: 'hbn', fam: '2d', sym: 'BN', nm: '육방정 질화붕소', eg: 6.0, egt: '~6.0 eV', grad: ['#ffd60a', '#ff9f0a'], draw: 'honey', cols: ['#ff9f0a', '#64d2ff'],
    kind: '2D 절연체', title: '육방정 질화붕소 (h-BN)', desc: '원자적으로 평탄하고 댕글링 본드가 없는 2D 절연체. 그래핀·TMD를 위아래로 감싸 캡슐화하면 이동도가 수 배 향상됩니다. 원자 결함은 상온 단일광자 광원으로도 연구됩니다.',
    spec: [['밴드갭', '~6.0 eV'], ['유전율', '~3–4'], ['격자 불일치(그래핀)', '1.8 %'], ['열안정성', '>1000 °C (공기)']], tags: ['게이트 절연막', '캡슐화', '단일광자원', '심자외선'] },
  { id: 'mos2', fam: '2d', sym: 'MoS₂', nm: '이황화몰리브데넘', eg: 1.9, egt: '1.9 eV (단층)', grad: ['#bf5af2', '#ff375f'], draw: 'tmd', cols: ['#bf5af2', '#ffd60a'],
    kind: '2D 반도체 · TMD', title: 'MoS₂', desc: '가장 많이 연구된 2D 반도체. 0.65 nm 두께에서도 적절한 밴드갭을 가져, 실리콘 이후 초미세 트랜지스터의 n형 채널 후보 1순위입니다. 자연에서 휘수연석 광물로 산출됩니다.',
    spec: [['밴드갭', '1.2 → 1.9 eV'], ['이동도', '~10–200 cm²/V·s'], ['두께', '0.65 nm'], ['극성', 'n형']], tags: ['2D 채널', '광검출기', '밸리트로닉스', '촉매'] },
  { id: 'wse2', fam: '2d', sym: 'WSe₂', nm: '이셀레늄화텅스텐', eg: 1.65, egt: '1.65 eV (단층)', grad: ['#30d158', '#64d2ff'], draw: 'tmd', cols: ['#30d158', '#ff9f0a'],
    kind: '2D 반도체 · TMD', title: 'WSe₂', desc: '정공 전도에 유리한 TMD로, MoS₂와 짝을 이뤄 2D CMOS의 p형 채널 후보가 됩니다. 강한 스핀–궤도 결합으로 밸리 분극 연구의 대표 물질이며, 모아레 이종구조에서 다양한 상관 상태가 발견되었습니다.',
    spec: [['밴드갭', '1.65 eV'], ['극성', 'p형 / 양극성'], ['스핀-궤도 분리', '~0.45 eV'], ['두께', '~0.7 nm']], tags: ['2D p-FET', '엑시톤', '모아레 물리', 'LED'] },
  { id: 'bp', fam: '2d', sym: 'P', nm: '흑린 (포스포린)', eg: 0.3, egt: '0.3 → ~2 eV', grad: ['#ff9f0a', '#ff375f'], draw: 'pucker', cols: ['#ff9f0a', '#ff375f'],
    kind: '2D 반도체 · 이방성', title: '흑린 (Black Phosphorus)', desc: '주름진(puckered) 층 구조로 인해 결정 방향에 따라 물성이 크게 다른 이방성(anisotropic) 물질입니다. 층 수에 따라 밴드갭이 0.3 eV(벌크)에서 약 2 eV(단층)까지 변해 적외선 광소자에 유리하지만 공기 중에서 쉽게 산화됩니다.',
    spec: [['밴드갭', '0.3 → ~2 eV'], ['이동도', '~1000 cm²/V·s'], ['구조', '사방정 주름'], ['약점', '대기 불안정']], tags: ['적외선 검출기', '이방성 소자', '편광 감지'] },
  { id: 'mx', fam: '2d', sym: 'MXene', nm: 'Ti₃C₂Tₓ', eg: 0, egt: '금속성', grad: ['#a1a1a6', '#64d2ff'], draw: 'honey3', cols: ['#a1a1a6', '#3a3a3c', '#ff375f'],
    kind: '2D 금속 · 전이금속 탄화물', title: 'MXene (Ti₃C₂Tₓ)', desc: 'MAX 상(MAX phase)에서 A 원소층을 선택적으로 식각해 얻는 2D 전이금속 탄화·질화물. 높은 전기전도도와 친수성 표면을 동시에 가져, 용액 공정 전극, 전자파 차폐, 에너지 저장 소재로 주목받습니다.',
    spec: [['전기전도도', '~10⁴ S/cm'], ['표면', '–O, –OH, –F'], ['공정', '용액 기반'], ['발견', '2011년']], tags: ['EMI 차폐', '슈퍼커패시터', '투명 전극', '잉크'] },
  { id: 'sic', fam: 'wbg', sym: 'SiC', nm: '4H-탄화규소', eg: 3.26, egt: '3.26 eV', grad: ['#64d2ff', '#5e5ce6'], draw: 'hexwbg', cols: ['#5e9cff', '#3a3a3c'],
    kind: '광대역 밴드갭(WBG) · 전력', title: '4H-SiC', desc: '실리콘보다 약 8배 높은 절연파괴 전계와 2배 이상의 열전도율을 가집니다. 고온·고전압 환경에서도 안정적이어서 전기차 인버터와 충전 인프라, 태양광 인버터의 표준이 되어가고 있습니다.',
    spec: [['밴드갭', '3.26 eV'], ['절연파괴', '2.5 MV/cm'], ['열전도율', '~370 W/m·K'], ['웨이퍼', '6–8 인치']], tags: ['EV 인버터', '고속 충전', '태양광', '철도'] },
  { id: 'gan', fam: 'wbg', sym: 'GaN', nm: '질화갈륨', eg: 3.4, egt: '3.4 eV', grad: ['#2997ff', '#bf5af2'], draw: 'hexwbg', cols: ['#30d158', '#64d2ff'],
    kind: '광대역 밴드갭(WBG) · 광·RF·전력', title: 'GaN', desc: '청색·백색 LED를 가능하게 한 물질. AlGaN/GaN 이종접합의 2DEG로 만든 HEMT는 높은 주파수와 효율을 동시에 달성해 고속 충전기, 데이터센터 전원, 5G·레이더 RF 증폭기에 쓰입니다.',
    spec: [['밴드갭', '3.4 eV (직접)'], ['2DEG 이동도', '~2000 cm²/V·s'], ['절연파괴', '3.3 MV/cm'], ['구조', '우르차이트']], tags: ['LED', 'HEMT', '고속 충전기', '5G RF'] },
  { id: 'gao', fam: 'wbg', sym: 'Ga₂O₃', nm: '베타 산화갈륨', eg: 4.85, egt: '4.85 eV', grad: ['#ff9f0a', '#ffd60a'], draw: 'mono', cols: ['#30d158', '#ff375f'],
    kind: '초광대역 밴드갭 (UWBG)', title: 'β-Ga₂O₃', desc: '4.8 eV의 밴드갭과 약 8 MV/cm의 절연파괴 전계로 SiC·GaN을 넘어서는 이론 성능. 용융 성장법으로 대구경 기판을 저렴하게 만들 수 있지만, 낮은 열전도율과 p형 도핑의 어려움이 과제입니다.',
    spec: [['밴드갭', '4.85 eV'], ['절연파괴', '~8 MV/cm'], ['열전도율', '~10–27 W/m·K'], ['결정계', '단사정']], tags: ['초고전압 소자', '태양광 맹(solar-blind) UV 검출', '저가 기판'] },
  { id: 'dia', fam: 'wbg', sym: 'C', nm: '다이아몬드', eg: 5.47, egt: '5.47 eV', grad: ['#ffffff', '#64d2ff'], draw: 'diamond', cols: ['#e5f4ff', '#64d2ff'],
    kind: '초광대역 밴드갭 · 궁극의 반도체', title: '다이아몬드', desc: '가장 높은 열전도율(>2000 W/m·K)와 10 MV/cm의 절연파괴 전계를 가진 ‘궁극의 반도체’. 대면적 단결정 기판과 n형 도핑이 어렵지만, NV 센터는 양자 센서로 이미 활용되고 있습니다.',
    spec: [['밴드갭', '5.47 eV'], ['절연파괴', '~10 MV/cm'], ['열전도율', '>2000 W/m·K'], ['BFOM (Si=1)', '>20,000']], tags: ['고출력 RF', '방열 기판', 'NV 양자 센서', '방사선 검출'] },
];

function drawMini(ctx, w, h, m, t) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.46;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  bg.addColorStop(0, '#2c2c2e'); bg.addColorStop(1, '#111');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.translate(cx, cy); ctx.rotate(t * 0.15);
  const a = R / 3.2;
  const dot = (x, y, r, c) => { const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r); g.addColorStop(0, '#fff'); g.addColorStop(0.25, c); g.addColorStop(1, shade(c)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1.5;
  if (m.draw === 'honey' || m.draw === 'tmd' || m.draw === 'honey3' || m.draw === 'hexwbg') {
    const a1 = [a, 0], a2 = [a / 2, a * Math.sqrt(3) / 2];
    const at = [];
    for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
      const x = i * a1[0] + j * a2[0], y = i * a1[1] + j * a2[1];
      at.push([x, y, 0]);
      at.push([x + (a1[0] + a2[0]) / 3, y + (a1[1] + a2[1]) / 3, 1]);
      if (m.draw === 'honey3') at.push([x + 2 * (a1[0] + a2[0]) / 3, y + 2 * (a1[1] + a2[1]) / 3, 2]);
    }
    const cc = a / Math.sqrt(3);
    for (const p of at) for (const q of at) if (p[2] < q[2] || (m.draw === 'honey3' && p[2] === 0 && q[2] === 2)) {
      const d = Math.hypot(p[0] - q[0], p[1] - q[1]);
      if (d < cc * 1.05 && d > 1) line(p[0], p[1], q[0], q[1]);
    }
    for (const p of at) if (Math.hypot(p[0], p[1]) < R * 1.3) {
      const big = (m.draw === 'tmd' && p[2] === 0) || (m.draw === 'hexwbg' && p[2] === 0);
      dot(p[0], p[1], big ? a * 0.26 : a * 0.2, m.cols[p[2]]);
    }
  } else if (m.draw === 'pucker') {
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) {
      const x = i * a * 1.0, y = j * a * 0.75;
      const up = (i + j) % 2 === 0;
      const x2 = x + a * 0.5, y2 = y + (up ? 0.25 : -0.25) * a;
      line(x, y, x2, y2);
      line(x2, y2, x + a, y);
      if (j % 2 === 0) line(x, y, x, y + a * 0.75);
      dot(x, y, a * 0.18, m.cols[0]); dot(x2, y2, a * 0.15, m.cols[1]);
    }
  } else if (m.draw === 'mono') {
    for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
      const x = i * a * 1.15 + (j % 2) * a * 0.4, y = j * a * 0.6;
      const s = a * 0.38;
      ctx.fillStyle = (i + j) % 2 ? 'rgba(48,209,88,.35)' : 'rgba(255,159,10,.35)';
      ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s, y); ctx.closePath(); ctx.fill(); ctx.stroke();
      dot(x, y, a * 0.16, m.cols[0]);
      dot(x + s, y, a * 0.11, m.cols[1]);
    }
  } else if (m.draw === 'diamond') {
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 6; j++) {
      const x = i * a * 0.8, y = j * a * 0.8;
      if ((i + j) % 2 === 0) {
        line(x, y, x + a * 0.4, y + a * 0.4); line(x, y, x - a * 0.4, y - a * 0.4);
        line(x, y, x + a * 0.4, y - a * 0.4); line(x, y, x - a * 0.4, y + a * 0.4);
      }
      dot(x, y, a * 0.16, m.cols[0]);
      dot(x + a * 0.4, y + a * 0.4, a * 0.12, m.cols[1]);
    }
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
}

function shade(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) * 0.35, g = ((n >> 8) & 255) * 0.35, b = (n & 255) * 0.35;
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

export function init(root) {
  const detail = document.getElementById('mat-detail');
  const minis = [];
  for (const m of MATS) {
    const el = document.createElement('div');
    el.className = 'mat reveal in';
    el.dataset.id = m.id; el.dataset.fam = m.fam;
    el.innerHTML = `<canvas></canvas><div class="sym">${m.sym}</div><div class="nm">${m.nm}</div><div class="eg">E<sub>g</sub> ${m.egt}</div><div class="bar"><i style="width:${Math.max(3, m.eg / 6.2 * 100)}%;background:linear-gradient(90deg,${m.grad[0]},${m.grad[1]})"></i></div>`;
    root.appendChild(el);
    const c = el.querySelector('canvas');
    const f = fitCanvas(c, () => drawMini(f.ctx, f.state.w, f.state.h, m, 0));
    minis.push({ m, f, el });
    el.addEventListener('click', () => select(m.id));
  }
  function select(id) {
    const m = MATS.find(x => x.id === id);
    minis.forEach(x => x.el.classList.toggle('on', x.m.id === id));
    detail.innerHTML = `<div><div class="kind">${m.kind}</div><h4 class="grad-text" style="background-image:linear-gradient(120deg,${m.grad[0]},${m.grad[1]})">${m.title}</h4><p>${m.desc}</p><div class="tags">${m.tags.map(t => `<span>${t}</span>`).join('')}</div></div>
      <div class="spec">${m.spec.map(([k, v]) => `<div><div class="k">${k}</div><div class="v">${v}</div></div>`).join('')}</div>`;
  }
  const filter = document.getElementById('lineup-filter');
  filter.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    filter.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    minis.forEach(x => { x.el.style.display = (b.dataset.v === 'all' || x.m.fam === b.dataset.v) ? '' : 'none'; });
  });
  select('gr');
  let hoverId = null;
  minis.forEach(x => { x.el.addEventListener('mouseenter', () => hoverId = x.m.id); x.el.addEventListener('mouseleave', () => hoverId = null); });
  const tt = {};
  animate(root, (t, dt) => {
    for (const x of minis) {
      if (x.el.style.display === 'none') continue;
      tt[x.m.id] = (tt[x.m.id] || 0) + dt * (hoverId === x.m.id ? 4 : 1);
      drawMini(x.f.ctx, x.f.state.w, x.f.state.h, x.m, tt[x.m.id]);
    }
  });
}
