// MoS2: layer-dependent lowest transition (indirect → direct) and photoluminescence
import { fitCanvas, animate, range, outs, wavelengthToRGB, arrow, FONT, MONO } from './util.js';

// Representative values (eV), referenced to VB maximum at K = 0
const DATA = [
  null,
  { EvG: -0.15, EcL: 2.05, Ed: 1.88, pl: 1.0 },   // 1L
  { EvG: 0.15, EcL: 1.75, Ed: 1.87, pl: 0.10 },   // 2L
  { EvG: 0.25, EcL: 1.70, Ed: 1.86, pl: 0.04 },   // 3L
  { EvG: 0.30, EcL: 1.68, Ed: 1.86, pl: 0.022 },  // 4L
  { EvG: 0.33, EcL: 1.66, Ed: 1.85, pl: 0.014 },  // 5L
  { EvG: 0.38, EcL: 1.67, Ed: 1.85, pl: 0.004 },  // bulk
];
const smax = (a, b, k = 9) => Math.log(Math.exp(k * a) + Math.exp(k * b)) / k;
const smin = (a, b, k = 9) => -smax(-a, -b, k);

export function init(root) {
  const out = outs(root);
  const B = fitCanvas(root.querySelector('[data-c="band"]'), () => draw(0));
  const P = fitCanvas(root.querySelector('[data-c="pl"]'), () => draw(0));
  const S = fitCanvas(root.querySelector('[data-c="stack"]'), () => draw(0));
  let N = 1, cur = { ...DATA[1] };
  range(root, 'N', v => { N = v; update(); });

  function gaps(d) {
    const ind = Math.min(d.EcL, d.Ed) - d.EvG;
    const dir = d.Ed;
    return { ind, dir, min: Math.min(ind, dir), isDirect: dir <= ind };
  }

  function update() {
    const g = gaps(DATA[N]);
    out('N', N === 6 ? '벌크' : `${N} 층`);
    out('eg', `${g.min.toFixed(2)}<small>eV</small>`);
    out('type', g.isDirect ? '<span style="color:#30d158">직접</span>' : '<span style="color:#ff9f0a">간접</span>');
  }

  function draw(t) {
    // ease toward target
    const tgt = DATA[N];
    for (const k of ['EvG', 'EcL', 'Ed', 'pl']) cur[k] += (tgt[k] - cur[k]) * 0.12;
    const g = gaps(cur);
    // ---- band diagram
    {
      const { ctx } = B, { w, h } = B.state; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const pad = { l: 50, r: 30, t: 40, b: 40 };
      const X = (x) => pad.l + x * (w - pad.l - pad.r);
      const Y = (E) => pad.t + (3.0 - E) / 4.2 * (h - pad.t - pad.b);
      const vb = (x) => smax(cur.EvG - 2.6 * x * x, 0 - 3.2 * (1 - x) ** 2);
      const cb = (x) => smin(smin(cur.Ed + 3.5 * (1 - x) ** 2, cur.EcL + 5 * (x - 0.55) ** 2), 2.9 - 0.4 * x);
      // gap shading
      ctx.fillStyle = 'rgba(191,90,242,0.06)'; ctx.fillRect(pad.l, Y(g.min), w - pad.l - pad.r, Y(0) - Y(g.min));
      for (const [name, x] of [['Γ', 0], ['Λ', 0.55], ['K', 1]]) {
        ctx.strokeStyle = '#d2d2d7'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(x), pad.t - 10); ctx.lineTo(X(x), h - pad.b); ctx.stroke();
        ctx.fillStyle = '#1d1d1f'; ctx.font = `600 15px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(name, X(x), h - pad.b + 22);
      }
      const curve = (f, col) => {
        ctx.strokeStyle = col; ctx.lineWidth = 3.5; ctx.beginPath();
        for (let i = 0; i <= 200; i++) { const x = i / 200; i ? ctx.lineTo(X(x), Y(f(x))) : ctx.moveTo(X(x), Y(f(x))); }
        ctx.stroke();
      };
      curve(cb, '#0071e3'); curve(vb, '#ff375f');
      ctx.font = `600 12px ${FONT}`; ctx.textAlign = 'left';
      ctx.fillStyle = '#0071e3'; ctx.fillText('전도대', pad.l + 6, Y(cb(0)) - 8);
      ctx.fillStyle = '#ff375f'; ctx.fillText('가전자대', pad.l + 6, Y(vb(0)) + 22);
      // transitions
      const xL = 0.55;
      const indCB = cur.EcL < cur.Ed ? [xL, cur.EcL] : [1, cur.Ed];
      ctx.globalAlpha = g.isDirect ? 0.35 : 1;
      ctx.setLineDash([5, 4]);
      arrow(ctx, X(indCB[0]), Y(indCB[1]) + 4, X(0) + 4, Y(cur.EvG) - 4, '#ff9f0a', 2, 9);
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff9f0a'; ctx.font = `600 12px ${MONO}`;
      ctx.fillText(`간접 전이 ${g.ind.toFixed(2)} eV`, X(0.18), Y((indCB[1] + cur.EvG) / 2) - 6);
      ctx.globalAlpha = g.isDirect ? 1 : 0.35;
      arrow(ctx, X(1) - 10, Y(cur.Ed) + 4, X(1) - 10, Y(0) - 4, '#30d158', 3, 10);
      ctx.fillStyle = '#30d158'; ctx.textAlign = 'right';
      ctx.fillText(`직접 전이 ${cur.Ed.toFixed(2)} eV`, X(1) - 18, Y(cur.Ed / 2));
      ctx.globalAlpha = 1;
      // photon glow when direct
      if (g.isDirect) {
        const lam = 1239.84 / cur.Ed, [r, gg, b] = wavelengthToRGB(lam);
        const px = X(1) + 2, py = Y(cur.Ed / 2);
        ctx.strokeStyle = `rgb(${r},${gg},${b})`; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 60; i++) { const xx = px + i * 0.5, yy = py - i * 0.6 + 4 * Math.sin(i / 4 - t * 8); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
        ctx.stroke();
      }
      ctx.save(); ctx.translate(16, h / 2); ctx.rotate(-Math.PI / 2); ctx.fillStyle = '#86868b'; ctx.font = `11px ${MONO}`; ctx.textAlign = 'center'; ctx.fillText('에너지 (eV)', 0, 0); ctx.restore();
    }
    // ---- PL spectrum
    {
      const { ctx } = P, { w, h } = P.state; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const pad = { l: 20, r: 20, t: 34, b: 28 };
      const E0 = 1.2, E1 = 2.2;
      const X = (E) => pad.l + (E - E0) / (E1 - E0) * (w - pad.l - pad.r);
      const Y = (v) => h - pad.b - v * (h - pad.t - pad.b);
      const spec = (E) => cur.pl * Math.exp(-((E - cur.Ed) ** 2) / (2 * 0.03 ** 2))
        + 0.55 * cur.pl * Math.exp(-((E - cur.Ed - 0.15) ** 2) / (2 * 0.04 ** 2))
        + (N > 1 ? 0.035 : 0) * Math.exp(-((E - g.ind) ** 2) / (2 * 0.05 ** 2));
      const scale = 1 / Math.max(0.05, cur.pl) > 1 && N > 1 ? 1 : 1;
      for (let px = X(E0); px < X(E1); px++) {
        const E = E0 + (px - pad.l) / (w - pad.l - pad.r) * (E1 - E0);
        const [r, gg, b] = wavelengthToRGB(1239.84 / E);
        ctx.fillStyle = `rgba(${r},${gg},${b},0.85)`;
        const v = spec(E) * scale;
        ctx.fillRect(px, Y(v), 1.2, Y(0) - Y(v));
      }
      ctx.strokeStyle = '#1d1d1f'; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let px = X(E0); px < X(E1); px++) { const E = E0 + (px - pad.l) / (w - pad.l - pad.r) * (E1 - E0); const y = Y(spec(E)); px === X(E0) ? ctx.moveTo(px, y) : ctx.lineTo(px, y); }
      ctx.stroke();
      ctx.font = `10px ${MONO}`; ctx.fillStyle = '#86868b'; ctx.textAlign = 'center';
      for (const E of [1.4, 1.6, 1.8, 2.0]) ctx.fillText(`${E} eV`, X(E), h - 8);
      ctx.textAlign = 'right'; ctx.fillStyle = '#1d1d1f'; ctx.font = `600 12px ${MONO}`;
      ctx.fillText(`상대 PL 세기 ×${cur.pl.toFixed(3)}`, w - pad.r, pad.t - 12);
      if (N > 1) { ctx.fillStyle = '#ff9f0a'; ctx.textAlign = 'center'; ctx.font = `11px ${FONT}`; ctx.fillText('간접 전이 (I)', X(g.ind), Y(0.08) - 4); }
    }
    // ---- side view stack
    {
      const { ctx } = S, { w, h } = S.state; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const n = N === 6 ? 6 : N;
      const lh = Math.min(16, (h - 20) / 6);
      const total = n * lh;
      const y0 = h / 2 + total / 2;
      for (let i = 0; i < n; i++) {
        const y = y0 - (i + 0.5) * lh;
        const fade = N === 6 && i === n - 1 ? 0.35 : 1;
        ctx.globalAlpha = fade;
        for (let x = 20; x < w - 20; x += 10) {
          ctx.fillStyle = '#ffd60a'; ctx.beginPath(); ctx.arc(x + (i % 2) * 5, y - lh * 0.28, 2.3, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.arc(x + (i % 2) * 5, y + lh * 0.28, 2.3, 0, 7); ctx.fill();
          ctx.fillStyle = '#bf5af2'; ctx.beginPath(); ctx.arc(x + 5 - (i % 2) * 5, y, 3, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = '#6e6e73'; ctx.font = `11px ${MONO}`; ctx.textAlign = 'right';
      ctx.fillText(N === 6 ? '벌크 (수천 층…)' : `${N} 층 · ${(N * 0.65).toFixed(2)} nm`, w - 12, 14);
    }
  }

  update();
  animate(root, (t) => draw(t));
}
