// Band gap ↔ photon energy ↔ color
import { fitCanvas, range, outs, wavelengthToRGB, FONT, MONO } from './util.js';

const MATS = [
  { n: '그래핀', e: 0.0, c: '#64d2ff' },
  { n: '흑린(벌크)', e: 0.3, c: '#ff9f0a' },
  { n: 'Si', e: 1.12, c: '#0071e3' },
  { n: 'GaAs', e: 1.42, c: '#5e5ce6' },
  { n: 'WSe₂ 단층', e: 1.65, c: '#30d158' },
  { n: 'CsPbI₃', e: 1.73, c: '#ff375f' },
  { n: 'MoS₂ 단층', e: 1.88, c: '#bf5af2' },
  { n: '4H-SiC', e: 3.26, c: '#5e9cff' },
  { n: 'GaN', e: 3.4, c: '#2997ff' },
  { n: 'β-Ga₂O₃', e: 4.85, c: '#ff9f0a' },
  { n: '다이아몬드', e: 5.47, c: '#8e8e93' },
  { n: 'h-BN', e: 6.0, c: '#ffd60a' },
  { n: 'AlN', e: 6.2, c: '#ff6482' },
];
const EMAX = 7;

export function init(root) {
  const canvas = root.querySelector('canvas');
  const { ctx, state } = fitCanvas(canvas, () => draw());
  const out = outs(root);
  const tip = out('tip');
  let E = 2.5;
  const eCtl = range(root, 'E', v => { E = v; update(); });
  const pad = { l: 30, r: 30 };
  const X = (e) => pad.l + e / EMAX * (state.w - pad.l - pad.r);

  function region(lam) {
    if (lam > 780) return '적외선';
    if (lam < 380) return lam < 280 ? '심자외선' : '자외선';
    return '가시광';
  }

  function update() {
    const lam = 1239.84 / E;
    out('E', `${E.toFixed(2)} eV`);
    out('lam', `${lam.toFixed(0)}<small>nm</small>`);
    out('region', region(lam));
    const [r, g, b] = wavelengthToRGB(lam);
    out('sw').style.background = (lam >= 380 && lam <= 780) ? `rgb(${r},${g},${b})` : (lam > 780 ? 'linear-gradient(90deg,#3a0000,#100)' : 'linear-gradient(90deg,#1a0030,#000)');
    const abs = MATS.filter(m => m.e < E && m.e > 0).map(m => m.n);
    const tr = MATS.filter(m => m.e >= E).map(m => m.n);
    out('abs', `<b>흡수</b>(E > E<sub>g</sub>): ${abs.join(', ') || '없음'} &nbsp;·&nbsp; <b>투과</b>: ${tr.join(', ') || '없음'}<br>그래핀은 밴드갭이 0이라 전 파장을 흡수하지만, 단층의 흡수율은 πα ≈ 2.3%(α: 미세구조 상수)에 불과해 투명 전극으로 쓰입니다.`);
    draw();
  }

  function draw() {
    const { w, h } = state; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const by = h * 0.62, bh = 34;
    // spectrum band
    for (let px = X(0); px <= X(EMAX); px++) {
      const e = (px - pad.l) / (w - pad.l - pad.r) * EMAX;
      const lam = 1239.84 / Math.max(e, 0.01);
      let col;
      if (lam > 780) { const k = Math.min(1, (lam - 780) / 1500); col = `rgb(${Math.round(90 - 70 * k)},${Math.round(10 * (1 - k))},${Math.round(10 * (1 - k))})`; }
      else if (lam < 380) { const k = Math.min(1, (380 - lam) / 220); col = `rgb(${Math.round(70 - 60 * k)},${Math.round(10 * (1 - k))},${Math.round(110 - 90 * k)})`; }
      else { const [r, g, b] = wavelengthToRGB(lam); col = `rgb(${r},${g},${b})`; }
      ctx.fillStyle = col; ctx.fillRect(px, by, 1.2, bh);
    }
    ctx.font = `600 11px ${FONT}`; ctx.fillStyle = '#6e6e73'; ctx.textAlign = 'center';
    ctx.fillText('적외선 IR', (X(0) + X(1.65)) / 2, by + bh + 18);
    ctx.fillText('가시광', (X(1.65) + X(3.26)) / 2, by + bh + 18);
    ctx.fillText('자외선 UV', (X(3.26) + X(EMAX)) / 2, by + bh + 18);
    ctx.font = `10px ${MONO}`; ctx.fillStyle = '#86868b';
    for (let e = 0; e <= EMAX; e++) { ctx.fillText(`${e} eV`, X(e), by + bh + 36); }
    for (const lam of [1000, 700, 500, 400, 300, 200]) {
      const x = X(1239.84 / lam);
      ctx.fillText(`${lam}nm`, x, by - 6);
      ctx.fillRect(x - 0.5, by - 2, 1, 4);
    }
    // material markers, stacked to avoid overlap
    const rows = [];
    ctx.font = `600 12px ${FONT}`;
    const placed = MATS.map(m => {
      const x = X(m.e), tw = ctx.measureText(m.n).width + 16;
      let row = 0;
      while ((rows[row] || []).some(([a, b]) => !(x + tw / 2 < a || x - tw / 2 > b))) row++;
      (rows[row] = rows[row] || []).push([x - tw / 2, x + tw / 2]);
      return { m, x, row, tw };
    });
    for (const p of placed) {
      const y = by - 34 - p.row * 30;
      const absorbing = p.m.e < E;
      ctx.strokeStyle = p.m.c; ctx.globalAlpha = absorbing ? 1 : 0.4;
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, y + 10); ctx.lineTo(p.x, by); ctx.stroke();
      ctx.fillStyle = absorbing ? p.m.c : '#fff';
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(p.x - p.tw / 2, y - 10, p.tw, 22, 11) : ctx.rect(p.x - p.tw / 2, y - 10, p.tw, 22);
      ctx.fill(); ctx.strokeStyle = p.m.c; ctx.stroke();
      ctx.fillStyle = absorbing ? '#fff' : '#1d1d1f'; ctx.textAlign = 'center';
      ctx.fillText(p.m.n, p.x, y + 5);
      ctx.globalAlpha = 1;
      p.y = y;
    }
    // photon marker
    const x = X(E);
    ctx.strokeStyle = '#1d1d1f'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, by - 4); ctx.lineTo(x, by + bh + 4); ctx.stroke();
    ctx.fillStyle = '#1d1d1f'; ctx.beginPath(); ctx.moveTo(x, by + bh + 4); ctx.lineTo(x - 7, by + bh + 14); ctx.lineTo(x + 7, by + bh + 14); ctx.fill();
    // photon wave above
    const lam = 1239.84 / E, [r, g, b] = wavelengthToRGB(lam);
    const vis = lam >= 380 && lam <= 780;
    ctx.strokeStyle = vis ? `rgb(${r},${g},${b})` : '#6e6e73'; ctx.lineWidth = 2.5;
    ctx.beginPath();
    const wl = Math.max(6, 60 / E);
    for (let i = 0; i <= 140; i++) { const xx = 20 + i; const yy = 26 + 8 * Math.sin(i / wl * 2 * Math.PI); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.stroke();
    ctx.fillStyle = '#1d1d1f'; ctx.font = `600 12px ${FONT}`; ctx.textAlign = 'left';
    ctx.fillText(`광자 ${E.toFixed(2)} eV → λ = ${lam.toFixed(0)} nm`, 170, 30);
    draw.placed = placed;
  }

  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const p = (draw.placed || []).find(p => Math.abs(mx - p.x) < p.tw / 2 && Math.abs(my - p.y) < 12);
    if (p) { E = Math.max(0.1, p.m.e + 0.01); eCtl.set(E, false); update(); }
  });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const p = (draw.placed || []).find(p => Math.abs(mx - p.x) < p.tw / 2 && Math.abs(my - p.y) < 12);
    canvas.style.cursor = p ? 'pointer' : 'default';
    if (p) {
      tip.innerHTML = `<b>${p.m.n}</b> · E<sub>g</sub> = ${p.m.e} eV${p.m.e > 0 ? ` → ${(1239.84 / p.m.e).toFixed(0)} nm` : ''}<br>클릭하면 밴드갭 에너지로 이동`;
      tip.style.left = Math.min(mx + 12, state.w - 200) + 'px'; tip.style.top = (my + 14) + 'px'; tip.classList.add('on');
    } else tip.classList.remove('on');
  });
  update();
}
