// Powder XRD pattern from the structure factor of cubic crystals
import { fitCanvas, seg, outs, FONT, MONO } from './util.js';

const FCC = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
const shift = (pts, d) => pts.map(p => p.map((x, i) => x + d[i]));
const STRUCT = {
  diamond: { a: 3.567, atoms: [...FCC, ...shift(FCC, [0.25, 0.25, 0.25])].map(p => [6, p]), name: '다이아몬드 (C)', rule: '다이아몬드 입방 구조의 탄소입니다. FCC 격자 반사 중 일부가 기저 원자들의 간섭으로 소멸합니다.' },
  bcc:  { a: 2.8665, atoms: [[26, [0, 0, 0]], [26, [0.5, 0.5, 0.5]]], name: 'BCC 철', rule: '<b>h+k+l = 짝수</b>인 면만 나타납니다. (100), (111)은 체심 원자에서 산란된 파와 위상이 π만큼 달라 상쇄되므로 사라집니다.' },
  fcc:  { a: 3.615, atoms: FCC.map(p => [29, p]), name: 'FCC 구리', rule: '<b>h, k, l이 모두 홀수이거나 모두 짝수</b>인 면만 나타납니다: (111), (200), (220), (311), (222)…' },
  si:    { a: 5.431, atoms: [...FCC, ...shift(FCC, [0.25, 0.25, 0.25])].map(p => [14, p]), name: '실리콘 (Si)', rule: '다이아몬드 입방 구조입니다. (200), (222) 등 일부 반사는 구조 인자가 0이 되어 사라집니다.' },
  zb:   { a: 5.653, atoms: [...FCC.map(p => [31, p]), ...shift(FCC, [0.25, 0.25, 0.25]).map(p => [33, p])], name: '섬아연광 (GaAs)', rule: 'Ga(Z=31)와 As(Z=33)의 산란력 차이가 작아 (200)이 <b>f<sub>Ga</sub> − f<sub>As</sub></b>에 비례해 아주 약하게만 남습니다. 다이아몬드 구조와 비교해보세요.' },
};

const fAtom = (Z, s) => Z * (0.25 + 0.75 * Math.exp(-10 * s * s));

function pattern(key, a, lam) {
  const S = STRUCT[key];
  const map = new Map();
  const R = 9;
  for (let h = -R; h <= R; h++) for (let k = -R; k <= R; k++) for (let l = -R; l <= R; l++) {
    const s2 = h * h + k * k + l * l; if (!s2) continue;
    const d = a / Math.sqrt(s2);
    const sinT = lam / (2 * d); if (sinT >= 1) continue;
    const th = Math.asin(sinT), tt = 2 * th * 180 / Math.PI;
    if (tt > 140) continue;
    const s = sinT / lam;
    let re = 0, im = 0;
    for (const [Z, p] of S.atoms) {
      const ph = 2 * Math.PI * (h * p[0] + k * p[1] + l * p[2]);
      const f = fAtom(Z, s);
      re += f * Math.cos(ph); im += f * Math.sin(ph);
    }
    const F2 = re * re + im * im;
    if (F2 < 1e-6) continue;
    const lp = (1 + Math.cos(2 * th) ** 2) / (Math.sin(th) ** 2 * Math.cos(th));
    const e = map.get(s2) || { s2, tt, d, I: 0, best: null, bestF: 0 };
    e.I += F2 * lp;
    const canon = [Math.abs(h), Math.abs(k), Math.abs(l)].sort((x, y) => y - x);
    if (F2 > e.bestF + 1e-6) { e.best = canon.join(''); e.bestF = F2; }
    map.set(s2, e);
  }
  const peaks = [...map.values()].sort((x, y) => x.tt - y.tt);
  const mx = Math.max(...peaks.map(p => p.I), 1);
  peaks.forEach(p => p.I = 100 * p.I / mx);
  return peaks;
}

export function init(root) {
  const canvas = root.querySelector('canvas');
  const { ctx, state } = fitCanvas(canvas, () => draw());
  const out = outs(root);
  const tip = out('tip');
  let key = 'si', lam = 1.5406, peaks = [], hover = null;
  seg(root, 'struct', v => { key = v; update(); });
  seg(root, 'src', v => { lam = +v; update(); });

  const T0 = 10, T1 = 130;
  const pad = { l: 46, r: 20, t: 34, b: 40 };
  const X = (tt) => pad.l + (tt - T0) / (T1 - T0) * (state.w - pad.l - pad.r);

  function update() {
    peaks = pattern(key, STRUCT[key].a, lam);
    const S = STRUCT[key];
    out('info', `<b>${S.name}</b> — ${S.rule}`);
    draw();
  }

  function draw() {
    const { w, h } = state; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const Y = (v) => h - pad.b - v / 110 * (h - pad.t - pad.b);
    // grid
    ctx.strokeStyle = '#e5e5ea'; ctx.lineWidth = 1; ctx.font = `11px ${MONO}`; ctx.fillStyle = '#86868b'; ctx.textAlign = 'center';
    for (let tt = 20; tt <= T1; tt += 10) {
      ctx.beginPath(); ctx.moveTo(X(tt), pad.t); ctx.lineTo(X(tt), h - pad.b); ctx.stroke();
      if (tt % 20 === 0) ctx.fillText(`${tt}°`, X(tt), h - pad.b + 16);
    }
    ctx.fillText('2θ', (pad.l + w - pad.r) / 2, h - 6);
    ctx.save(); ctx.translate(14, (pad.t + h - pad.b) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('강도 (상대)', 0, 0); ctx.restore();
    ctx.strokeStyle = '#1d1d1f'; ctx.beginPath(); ctx.moveTo(pad.l, h - pad.b); ctx.lineTo(w - pad.r, h - pad.b); ctx.stroke();
    // profile
    const fw = 0.28, sig = fw / 2.3548;
    const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
    grad.addColorStop(0, 'rgba(191,90,242,0.35)'); grad.addColorStop(1, 'rgba(41,151,255,0.02)');
    ctx.beginPath(); ctx.moveTo(X(T0), Y(0));
    const pts = [];
    for (let px = pad.l; px <= w - pad.r; px += 0.75) {
      const tt = T0 + (px - pad.l) / (w - pad.l - pad.r) * (T1 - T0);
      let v = 0.6 + 0.4 * Math.exp(-(tt - T0) / 40);
      for (const p of peaks) { const dx = tt - p.tt; if (Math.abs(dx) < 2) v += p.I * Math.exp(-dx * dx / (2 * sig * sig)); }
      pts.push([px, Y(Math.min(v, 108))]);
    }
    pts.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(X(T1), Y(0)); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    const lg = ctx.createLinearGradient(0, 0, w, 0); lg.addColorStop(0, '#0071e3'); lg.addColorStop(1, '#bf5af2');
    ctx.strokeStyle = lg; ctx.lineWidth = 1.6; ctx.stroke();
    // labels
    ctx.font = `600 11px ${MONO}`; ctx.fillStyle = '#1d1d1f'; ctx.textAlign = 'center';
    let lastX = -99;
    for (const p of peaks) {
      if (p.tt < T0 || p.tt > T1 || p.I < 2) continue;
      const x = X(p.tt);
      const y = Y(Math.min(p.I, 104)) - 8;
      if (x - lastX < 26) continue;
      ctx.fillText(`(${p.best})`, x, y);
      lastX = x;
    }
    if (hover) {
      const x = X(hover.tt);
      ctx.strokeStyle = '#ff375f'; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, h - pad.b); ctx.stroke(); ctx.setLineDash([]);
    }
  }

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const px = e.clientX - r.left;
    const tt = T0 + (px - pad.l) / (state.w - pad.l - pad.r) * (T1 - T0);
    let best = null, bd = 1.5;
    for (const p of peaks) { const dd = Math.abs(p.tt - tt); if (dd < bd && p.I > 0.3) { bd = dd; best = p; } }
    hover = best;
    if (best) {
      tip.innerHTML = `<b>(${best.best})</b> &nbsp; h²+k²+l² = ${best.s2}<br>2θ = ${best.tt.toFixed(2)}° · d = ${best.d.toFixed(4)} Å<br>상대 강도 ${best.I.toFixed(1)}`;
      tip.style.left = Math.min(px + 14, state.w - 190) + 'px'; tip.style.top = (e.clientY - r.top - 10) + 'px';
      tip.classList.add('on');
    } else tip.classList.remove('on');
    draw();
  });
  canvas.addEventListener('pointerleave', () => { hover = null; tip.classList.remove('on'); draw(); });
  update();
}
