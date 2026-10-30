// Material lineup: Apple-style compare cards with mini animated structures
import { fitCanvas, animate } from './util.js';

export const MATS = [
  { id: 'gr', fam: '2d', sym: 'C', nm: '그래핀', eg: 0, egt: '0 eV', grad: ['#64d2ff', '#2997ff'], draw: 'honey', cols: ['#b8c0cc', '#b8c0cc'],
    kind: '2D 반금속(semimetal) · 디랙 물질', title: '그래핀', desc: '탄소 원자 한 층. 알려진 물질 중 최고 수준의 전자 이동도와 열전도율, 강철의 200배에 이르는 강도를 가집니다. 밴드갭이 없어 논리 소자의 스위치로는 어렵지만 고주파 소자, 투명 전극, 센서, 방열 소재로 쓰입니다.',
    spec: [['밴드갭', '0 eV'], ['이동도', '>10⁵ cm²/V·s'], ['열전도율', '~3000–5000 W/m·K'], ['두께', '0.34 nm']], tags: ['RF 트랜지스터', '투명 전극', '바이오 센서', '방열'] },
  { id: 'hbn', fam: '2d', sym: 'BN', nm: '육방정 질화붕소', eg: 6.0, egt: '~6.0 eV', grad: ['#ffd60a', '#ff9f0a'], draw: 'honey', cols: ['#ff9f0a', '#64d2ff'],
    kind: '2D 절연체', title: '육방정 질화붕소 (h-BN)', desc: '원자적으로 평탄하고 댕글링 본드가 없는 2D 절연체. 그래핀·TMD를 위아래로 감싸 encapsulation하면 이동도가 수 배 향상됩니다. 원자 결함은 상온 단일광자 광원으로도 연구됩니다.',
    spec: [['밴드갭', '~6.0 eV'], ['유전율', '~3–4'], ['격자 불일치(그래핀)', '1.8 %'], ['열안정성', '>1000 °C (공기)']], tags: ['gate dielectric', 'encapsulation', '단일광자원', '심자외선'] },
  { id: 'mos2', fam: '2d', sym: 'MoS₂', nm: '이황화몰리브데넘', eg: 1.9, egt: '1.9 eV (단층)', grad: ['#bf5af2', '#ff375f'], draw: 'tmd', cols: ['#bf5af2', '#ffd60a'],
    kind: '2D 반도체 · TMD', title: 'MoS₂', desc: '가장 많이 연구된 2D 반도체. 0.65 nm 두께에서도 적절한 밴드갭을 가져, 실리콘 이후 초미세 트랜지스터의 n형 채널 후보 1순위입니다. 자연에서 휘수연석 광물로 산출됩니다.',
    spec: [['밴드갭', '1.2 → 1.9 eV'], ['이동도', '~10–200 cm²/V·s'], ['두께', '0.65 nm'], ['극성', 'n형']], tags: ['2D 채널', '광검출기', '밸리트로닉스', '촉매'] },
  { id: 'wse2', fam: '2d', sym: 'WSe₂', nm: '이셀레늄화텅스텐', eg: 1.65, egt: '1.65 eV (단층)', grad: ['#30d158', '#64d2ff'], draw: 'tmd', cols: ['#30d158', '#ff9f0a'],
    kind: '2D 반도체 · TMD', title: 'WSe₂', desc: '정공 전도에 유리한 TMD로, MoS₂와 짝을 이뤄 2D CMOS의 p형 채널 후보가 됩니다. 강한 스핀–궤도 결합으로 밸리 분극 연구의 대표 물질이며, 모아레 이종구조에서 다양한 상관 상태가 발견되었습니다.',
    spec: [['밴드갭', '1.65 eV'], ['극성', 'p형 / 양극성'], ['스핀-궤도 분리', '~0.45 eV'], ['두께', '~0.7 nm']], tags: ['2D p-FET', '엑시톤', '모아레 물리', 'LED'] },
  { id: 'sns', fam: '2d', sym: 'SnS', nm: '황화주석(II)', eg: 1.1, egt: '~1.1 eV (벌크 대표값)', grad: ['#ff9f0a', '#64d2ff'], draw: 'pucker', cols: ['#ffad4e', '#64d2dc'],
    kind: '2D 층상 반도체 · 이방성', title: '황화주석(II) (SnS)', desc: 'Sn과 S가 서로 다른 원자종으로 이루어진 층상 반도체입니다. 사방정계의 주름진 층 구조와 강한 in-plane 이방성을 가지며, 얇은 층에서는 강유전 분극과 광전 특성도 연구됩니다.',
    spec: [['밴드갭', '~1.1 eV (벌크 대표값)'], ['구조', '사방정 주름층'], ['특징', '강한 in-plane 이방성'], ['연구', '2D 반도체·강유전']], tags: ['층상 반도체', '이방성 광학', '강유전성'] },
  { id: 'sbo', fam: '0d', sym: 'Sb₂O₃', nm: 'Sb₂O₃', eg: null, egt: '', cardMetric: '0D 결정', grad: ['#bf9bff', '#ff6b61'], draw: 'packed', cols: ['#c99a78', '#b17ac5'],
    kind: '0D 결정 · 산화물', title: 'Sb₂O₃ (α-Sb₂O₃)', desc: 'Sb와 O 원자가 조밀하게 반복 배열된 α-Sb₂O₃ 결정입니다. 표지 그림은 Sb₄O₆ 단위 모티프가 만드는 원자 배열을 위에서 본 모습입니다.',
    spec: [['화학식 단위', 'Sb₄O₆ 케이지'], ['차원성', '0D 분자형 결정'], ['결정상', '입방 α상']], tags: ['0D 케이지', '유전 특성', '분자 결정'] },
];

export function drawMini(ctx, w, h, m, t) {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.46;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  bg.addColorStop(0, '#2c2c2e'); bg.addColorStop(1, '#111');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.translate(cx, cy); if (m.draw !== 'packed') ctx.rotate(t * 0.15);
  const a = R / 3.2;
  const dot = (x, y, r, c) => { const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r); g.addColorStop(0, '#fff'); g.addColorStop(0.25, c); g.addColorStop(1, shade(c)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1.5;
  if (m.draw === 'honey' || m.draw === 'tmd' || m.draw === 'honey3') {
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
  } else if (m.draw === 'packed') {
    // Static, cropped top view inspired by the repeated Sb4O6 motifs in the reference figure.
    const pitch = a * 1.5, moleculeR = a * 0.48, sbR = a * 0.20, oR = a * 0.18;
    const sb = [[0, -moleculeR], [moleculeR * 0.86, moleculeR * 0.5], [-moleculeR * 0.86, moleculeR * 0.5], [0, 0]];
    const oxygen = [[0, -moleculeR * 0.5], [moleculeR * 0.43, -moleculeR * 0.25], [-moleculeR * 0.43, -moleculeR * 0.25], [0, moleculeR * 0.5], [moleculeR * 0.43, moleculeR * 0.25], [-moleculeR * 0.43, moleculeR * 0.25]];
    const bridges = [[0, 4], [0, 5], [0, 6], [1, 5], [1, 7], [1, 8], [2, 6], [2, 7], [2, 9], [3, 4], [3, 8], [3, 9]];
    const motifs = [];
    for (let row = -4; row <= 4; row++) for (let col = -4; col <= 4; col++) {
      const x = col * pitch + (Math.abs(row) % 2) * pitch * 0.5;
      const y = row * pitch * Math.sqrt(3) * 0.5;
      if (Math.hypot(x, y) < R + pitch * 0.8) motifs.push([x, y]);
    }
    ctx.strokeStyle = 'rgba(238,202,180,.48)'; ctx.lineWidth = Math.max(0.8, a * 0.045);
    for (const [x, y] of motifs) {
      for (const [from, to] of bridges) {
        const p = from < 4 ? sb[from] : oxygen[from - 4], q = to < 4 ? sb[to] : oxygen[to - 4];
        line(x + p[0], y + p[1], x + q[0], y + q[1]);
      }
    }
    for (const [x, y] of motifs) {
      oxygen.forEach(([dx, dy]) => dot(x + dx, y + dy, oR, m.cols[1]));
      sb.forEach(([dx, dy]) => dot(x + dx, y + dy, sbR, m.cols[0]));
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
