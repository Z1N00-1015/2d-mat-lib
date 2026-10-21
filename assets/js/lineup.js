// Material lineup: Apple-style compare cards with mini animated structures
import { fitCanvas, animate } from './util.js';

export const MATS = [
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
  { id: 'sns', fam: '2d', sym: 'SnS', nm: '황화주석(II)', eg: 1.1, egt: '~1.1 eV (벌크 대표값)', grad: ['#ff9f0a', '#64d2ff'], draw: 'pucker', cols: ['#ffad4e', '#64d2dc'],
    kind: '2D 층상 반도체 · 이방성', title: '황화주석(II) (SnS)', desc: 'Sn과 S가 서로 다른 원자종으로 이루어진 층상 반도체입니다. 사방정계의 주름진 층 구조와 강한 in-plane 이방성을 가지며, 얇은 층에서는 강유전 분극과 광전 특성도 연구됩니다.',
    spec: [['밴드갭', '~1.1 eV (벌크 대표값)'], ['구조', '사방정 주름층'], ['특징', '강한 in-plane 이방성'], ['연구', '2D 반도체·강유전']], tags: ['층상 반도체', '이방성 광학', '강유전성'] },
  { id: 'sbo', fam: '0d', sym: 'Sb₂O₃', nm: '안티모니 트리옥사이드', eg: null, egt: '', cardMetric: '0D 결정', grad: ['#bf9bff', '#ff6b61'], draw: 'packed', cols: ['#c99a78', '#ff5b51'],
    kind: '0D 결정 · 산화물', title: '안티모니 트리옥사이드 (α-Sb₂O₃)', desc: 'Sb와 O 원자가 조밀하게 배열된 결정입니다. 원자 구조는 관찰 방향에 따라 육각형 모티프나 층상 배열처럼 다르게 투영될 수 있습니다. 표지의 원자 모형은 이 방향 의존적 투영을 보여주는 개념도입니다.',
    spec: [['화학식 단위', 'Sb₄O₆ 케이지'], ['차원성', '0D 분자형 결정'], ['결정상', '입방 α상']], tags: ['0D 케이지', '유전 특성', '분자 결정'] },
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

export function drawMini(ctx, w, h, m, t) {
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
  } else if (m.draw === 'packed') {
    // Static perspective view of a close-packed Sb/O slab on a substrate-like plane.
    const d = a * 0.48, layerH = d * Math.sqrt(2 / 3), tilt = 0.34;
    const atoms = [];
    const project = (x, y, z) => [(x - y * 0.55) * 0.72, (x + y * 0.85) * tilt - z * 0.9];
    const layerShift = [[0, 0], [0.5, Math.sqrt(3) / 6], [0, 0]];
    for (let k = 0; k < 3; k++) for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) {
      const [sx, sy] = layerShift[k];
      const x = d * (i + j * 0.5 + sx), y = d * (j * Math.sqrt(3) * 0.5 + sy), z = layerH * k;
      const species = ((i * 7 + j * 3 + k * 5) % 5 + 5) % 5 < 2 ? 0 : 1;
      const [px, py] = project(x, y, z);
      atoms.push({ x, y, z, px, py, species, r: d * (species === 0 ? 0.31 : 0.27) });
    }
    const plane = [[-3.55, -3.55], [3.55, -3.55], [3.55, 3.55], [-3.55, 3.55]]
      .map(([i, j]) => project(d * (i + j * 0.5), d * j * Math.sqrt(3) * 0.5, -layerH * 0.45));
    ctx.fillStyle = 'rgba(55,190,177,.20)'; ctx.strokeStyle = 'rgba(107,230,213,.48)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(plane[0][0], plane[0][1]); plane.slice(1).forEach(([x, y]) => ctx.lineTo(x, y)); ctx.closePath(); ctx.fill(); ctx.stroke();
    atoms.sort((p, q) => (p.x + p.y + p.z) - (q.x + q.y + q.z));
    ctx.strokeStyle = 'rgba(238,202,180,.42)'; ctx.lineWidth = Math.max(0.7, d * 0.045);
    for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) {
      const p = atoms[i], q = atoms[j], dx = p.x - q.x, dy = p.y - q.y, dz = p.z - q.z;
      if (dx * dx + dy * dy + dz * dz <= d * d * 1.04) line(p.px, p.py, q.px, q.py);
    }
    atoms.forEach(p => dot(p.px, p.py, p.r, m.cols[p.species]));
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
    el.innerHTML = `<canvas></canvas><div class="sym">${m.sym}</div><div class="nm">${m.nm}</div><div class="eg">${m.cardMetric || `E<sub>g</sub> ${m.egt}`}</div><div class="bar"><i style="width:${Math.max(3, (m.eg || 0) / 6.2 * 100)}%;background:linear-gradient(90deg,${m.grad[0]},${m.grad[1]})"></i></div>`;
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
