// Power semiconductors: band gap vs critical field bubble chart + figure-of-merit bars
import { fitCanvas, animate, seg, outs, FONT, MONO } from './util.js';

const M = [
  { n: 'Si', eg: 1.12, ec: 0.3, mu: 1400, eps: 11.7, k: 150, c: '#8e8e93' },
  { n: 'GaAs', eg: 1.42, ec: 0.4, mu: 8500, eps: 12.9, k: 55, c: '#5e5ce6' },
  { n: '4H-SiC', eg: 3.26, ec: 2.5, mu: 1000, eps: 9.7, k: 370, c: '#64d2ff' },
  { n: 'GaN', eg: 3.4, ec: 3.3, mu: 1250, eps: 9.0, k: 230, c: '#2997ff' },
  { n: 'β-Ga₂O₃', eg: 4.85, ec: 8, mu: 200, eps: 10, k: 23, c: '#ff9f0a' },
  { n: '다이아몬드', eg: 5.47, ec: 10, mu: 2000, eps: 5.7, k: 2200, c: '#f5f5f7' },
  { n: 'AlN', eg: 6.2, ec: 12, mu: 300, eps: 8.5, k: 285, c: '#ff375f' },
];
const bfom = (m) => m.eps * m.mu * m.ec ** 3;
const SI = bfom(M[0]);
const METRIC = {
  bfom: { t: 'BFOM (Si = 1, log)', f: m => bfom(m) / SI, log: true, unit: '×' },
  ec: { t: '절연파괴 전계 (MV/cm)', f: m => m.ec, log: false, unit: 'MV/cm' },
  k: { t: '열전도도 (W/m·K, log)', f: m => m.k, log: true, unit: 'W/m·K' },
  mu: { t: '전자 이동도 (cm²/V·s, log)', f: m => m.mu, log: true, unit: 'cm²/V·s' },
};

export function init(root) {
  const out = outs(root);
  const tip = out('tip');
  const Sc = fitCanvas(root.querySelector('[data-c="scatter"]'), () => drawScatter());
  const Bc = fitCanvas(root.querySelector('[data-c="bars"]'), () => (prog = 0));
  let metric = 'bfom', hover = null, prog = 0;
  seg(root, 'metric', v => { metric = v; prog = 0; });

  const pad = { l: 54, r: 24, t: 30, b: 46 };
  const sx = (eg) => pad.l + (eg - 0.5) / 6.2 * (Sc.state.w - pad.l - pad.r);
  const sy = (ec) => Sc.state.h - pad.b - ec / 13.5 * (Sc.state.h - pad.t - pad.b);

  function drawScatter() {
    const { ctx } = Sc, { w, h } = Sc.state; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.font = `11px ${MONO}`; ctx.fillStyle = '#86868b';
    for (let e = 1; e <= 6; e++) { ctx.beginPath(); ctx.moveTo(sx(e), pad.t); ctx.lineTo(sx(e), h - pad.b); ctx.stroke(); ctx.textAlign = 'center'; ctx.fillText(e, sx(e), h - pad.b + 16); }
    for (let c = 0; c <= 12; c += 3) { ctx.beginPath(); ctx.moveTo(pad.l, sy(c)); ctx.lineTo(w - pad.r, sy(c)); ctx.stroke(); ctx.textAlign = 'right'; ctx.fillText(c, pad.l - 8, sy(c) + 4); }
    ctx.textAlign = 'center'; ctx.fillStyle = '#a1a1a6'; ctx.font = `12px ${FONT}`;
    ctx.fillText('밴드갭 (eV)', (pad.l + w - pad.r) / 2, h - 10);
    ctx.save(); ctx.translate(16, (pad.t + h - pad.b) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('절연파괴 전계 (MV/cm)', 0, 0); ctx.restore();
    // empirical trend Ec ∝ Eg^2.5 (fit through Si-ish)
    ctx.strokeStyle = 'rgba(191,90,242,.5)'; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.5; ctx.beginPath();
    for (let e = 0.8; e <= 6.6; e += 0.05) { const c = 0.3 * Math.pow(e / 1.12, 1.9); const y = sy(Math.min(13.5, c)); e === 0.8 ? ctx.moveTo(sx(e), y) : ctx.lineTo(sx(e), y); }
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(191,90,242,.8)'; ctx.font = `11px ${FONT}`; ctx.textAlign = 'left';
    ctx.fillText('경향: E꜀ ∝ E_g^~2', sx(1.3), sy(3.6));
    // regions
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.font = `600 11px ${FONT}`;
    ctx.fillText('WBG', sx(3.0), pad.t + 12); ctx.fillText('UWBG', sx(4.5), pad.t + 12);
    ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.moveTo(sx(2.3), pad.t); ctx.lineTo(sx(2.3), h - pad.b); ctx.moveTo(sx(4.2), pad.t); ctx.lineTo(sx(4.2), h - pad.b); ctx.stroke();
    for (const m of M) {
      const x = sx(m.eg), y = sy(m.ec), r = 6 + 5 * Math.log10(m.k / 10);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, m.c); g.addColorStop(1, m.c + '33');
      ctx.globalAlpha = hover && hover !== m ? 0.35 : 1;
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.strokeStyle = m.c; ctx.lineWidth = hover === m ? 2.5 : 1; ctx.stroke();
      ctx.fillStyle = '#f5f5f7'; ctx.font = `600 12px ${FONT}`; ctx.textAlign = 'left';
      ctx.fillText(m.n, x + r + 4, y + 4);
      ctx.globalAlpha = 1;
    }
  }

  function drawBars(dt) {
    const { ctx } = Bc, { w, h } = Bc.state; if (!w) return;
    prog = Math.min(1, prog + dt * 1.6);
    const e = 1 - Math.pow(1 - prog, 3);
    ctx.clearRect(0, 0, w, h);
    const Mt = METRIC[metric];
    const vals = M.map(Mt.f);
    const vmax = Math.max(...vals), vmin = Mt.log ? Math.min(...vals) / 3 : 0;
    const L = (v) => Mt.log ? (Math.log10(v) - Math.log10(vmin)) / (Math.log10(vmax) - Math.log10(vmin)) : v / vmax;
    ctx.fillStyle = '#f5f5f7'; ctx.font = `600 15px ${FONT}`; ctx.textAlign = 'left';
    ctx.fillText(Mt.t, 20, 30);
    const top = 54, rowH = (h - top - 20) / M.length, x0 = 110, bw = w - x0 - 90;
    const order = M.map((m, i) => [m, vals[i]]).sort((a, b) => b[1] - a[1]);
    order.forEach(([m, v], i) => {
      const y = top + i * rowH;
      ctx.fillStyle = '#a1a1a6'; ctx.font = `600 13px ${FONT}`; ctx.textAlign = 'right';
      ctx.fillText(m.n, x0 - 12, y + rowH / 2 + 4);
      ctx.fillStyle = 'rgba(255,255,255,.06)';
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y + rowH * 0.2, bw, rowH * 0.6, 6) : ctx.rect(x0, y + rowH * 0.2, bw, rowH * 0.6); ctx.fill();
      const len = Math.max(4, bw * L(v) * e);
      const g = ctx.createLinearGradient(x0, 0, x0 + len, 0);
      g.addColorStop(0, m.c + '88'); g.addColorStop(1, m.c);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, y + rowH * 0.2, len, rowH * 0.6, 6) : ctx.rect(x0, y + rowH * 0.2, len, rowH * 0.6); ctx.fill();
      ctx.fillStyle = '#f5f5f7'; ctx.font = `600 12px ${MONO}`; ctx.textAlign = 'left';
      const txt = metric === 'bfom' ? `${Math.round(v * e).toLocaleString()}×` : `${(v * e).toLocaleString(undefined, { maximumFractionDigits: 1 })}`;
      ctx.fillText(txt, x0 + len + 8, y + rowH / 2 + 4);
    });
  }

  root.querySelector('[data-c="scatter"]').addEventListener('pointermove', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    hover = M.find(m => Math.hypot(sx(m.eg) - mx, sy(m.ec) - my) < 6 + 5 * Math.log10(m.k / 10) + 4) || null;
    if (hover) {
      const m = hover;
      tip.innerHTML = `<b>${m.n}</b><br>E<sub>g</sub> ${m.eg} eV · E<sub>c</sub> ${m.ec} MV/cm<br>μ ${m.mu} cm²/V·s · κ ${m.k} W/m·K<br>BFOM ${Math.round(bfom(m) / SI).toLocaleString()} × Si`;
      tip.style.left = Math.min(mx + 14, Sc.state.w - 200) + 'px'; tip.style.top = (my + 10) + 'px'; tip.classList.add('on');
    } else tip.classList.remove('on');
    drawScatter();
  });
  root.querySelector('[data-c="scatter"]').addEventListener('pointerleave', () => { hover = null; tip.classList.remove('on'); drawScatter(); });

  drawScatter();
  animate(root, (t, dt) => { if (prog < 1) drawBars(dt); });
}
