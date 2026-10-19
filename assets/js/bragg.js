// Bragg reflection: two-ray path difference + N-plane interference
import { fitCanvas, animate, range, outs, FONT, MONO } from './util.js';

const NPL = 8;
const interf = (theta, d, lam) => {
  const phi = 2 * Math.PI * 2 * d * Math.sin(theta) / lam;
  const s = Math.sin(phi / 2);
  if (Math.abs(s) < 1e-6) return 1;
  const v = Math.sin(NPL * phi / 2) / (NPL * s);
  return v * v;
};

export function init(root) {
  const out = outs(root);
  const M = fitCanvas(root.querySelector('[data-c="main"]'));
  const C = fitCanvas(root.querySelector('[data-c="curve"]'), () => drawCurve());
  let theta = 30, lam = 1.54, d = 2;
  range(root, 'theta', v => { theta = v; update(); });
  range(root, 'lam', v => { lam = v; update(); });
  range(root, 'd', v => { d = v; update(); });

  function update() {
    const path = 2 * d * Math.sin(theta * Math.PI / 180);
    out('theta', `${theta.toFixed(1)}°`);
    out('lam', `${lam.toFixed(2)} Å`);
    out('d', `${d.toFixed(2)} Å`);
    out('path', `${path.toFixed(2)}<small>Å</small>`);
    const n = path / lam;
    const near = Math.abs(n - Math.round(n)) < 0.04 && Math.round(n) > 0;
    out('n', `${n.toFixed(2)}${near ? ' <small style="color:#30d158">✓ 보강</small>' : ''}`);
    const nmax = Math.floor(2 * d / lam);
    const peaks = [];
    for (let k = 1; k <= Math.min(nmax, 4); k++) peaks.push(`n=${k}: ${(Math.asin(k * lam / (2 * d)) * 180 / Math.PI).toFixed(1)}°`);
    out('hud', `브래그 각: ${peaks.join(' · ') || '없음 (λ > 2d)'}`);
    drawCurve();
  }

  function sineAlong(ctx, x0, y0, ux, uy, len, s0, wl, amp, t) {
    // sinusoid along a straight segment; s0 = cumulative path at start
    const nx = -uy, ny = ux;
    ctx.beginPath();
    for (let s = 0; s <= len; s += 1.5) {
      const ph = 2 * Math.PI * (s0 + s) / wl - t * 6;
      const a = amp * Math.sin(ph);
      const x = x0 + ux * s + nx * a, y = y0 + uy * s + ny * a;
      s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }

  function draw(t) {
    const { ctx } = M, { w, h } = M.state; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#050507'; ctx.fillRect(0, 0, w, h);
    const th = theta * Math.PI / 180;
    const sc = Math.min(h * 0.4 / (3 * 4), 22);
    const dpx = d * sc, wl = lam * sc;
    const y1 = h * 0.52, cx = w * 0.5;
    // planes & atoms
    const spacing = Math.max(16, 2.6 * sc);
    for (let p = 0; p < 4; p++) {
      const y = y1 + p * dpx;
      ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      for (let x = cx % spacing; x < w; x += spacing) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
        g.addColorStop(0, '#9ecbff'); g.addColorStop(1, '#2b5a99');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill();
      }
    }
    // d label
    ctx.strokeStyle = '#ffd60a'; ctx.lineWidth = 1.2;
    const lx = w - 40;
    ctx.beginPath(); ctx.moveTo(lx, y1); ctx.lineTo(lx, y1 + dpx); ctx.stroke();
    ctx.fillStyle = '#ffd60a'; ctx.font = `600 13px ${FONT}`; ctx.fillText('d', lx + 6, y1 + dpx / 2 + 4);

    const uin = [Math.cos(th), Math.sin(th)], uout = [Math.cos(th), -Math.sin(th)];
    const P1 = [cx, y1], P2 = [cx, y1 + dpx];
    const Lin = Math.min(w * 0.45, (y1 - 20) / Math.max(0.2, Math.sin(th)));
    const Lout = Lin;
    const ex = dpx * Math.sin(th);
    const S1 = [P1[0] - uin[0] * Lin, P1[1] - uin[1] * Lin];
    const S2 = [P2[0] - uin[0] * (Lin + ex), P2[1] - uin[1] * (Lin + ex)];
    const delta = 2 * Math.PI * (2 * ex) / wl;
    const cons = Math.pow(Math.cos(delta / 2), 2);
    const I = interf(th, d, lam);
    const amp = Math.min(9, wl * 0.35);
    ctx.lineWidth = 2;
    // incoming
    ctx.strokeStyle = '#2997ff'; ctx.shadowColor = '#2997ff'; ctx.shadowBlur = 8;
    sineAlong(ctx, S1[0], S1[1], uin[0], uin[1], Lin, 0, wl, amp, t);
    sineAlong(ctx, S2[0], S2[1], uin[0], uin[1], Lin + ex, 0, wl, amp, t);
    // outgoing
    const r = Math.round(255 * (1 - cons)), g = Math.round(209 * cons + 55 * (1 - cons));
    const oc = `rgb(${r},${g},${Math.round(88 * cons + 95 * (1 - cons))})`;
    ctx.strokeStyle = oc; ctx.shadowColor = oc;
    sineAlong(ctx, P1[0], P1[1], uout[0], uout[1], Lout, Lin, wl, amp, t);
    sineAlong(ctx, P2[0], P2[1], uout[0], uout[1], Lout + ex, Lin + ex, wl, amp, t);
    ctx.shadowBlur = 0;
    // extra path markers
    ctx.strokeStyle = 'rgba(255,214,10,.85)'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.2;
    const F1 = [P2[0] - uin[0] * ex, P2[1] - uin[1] * ex];
    const F2 = [P2[0] + uout[0] * ex, P2[1] + uout[1] * ex];
    ctx.beginPath(); ctx.moveTo(P1[0], P1[1]); ctx.lineTo(F1[0], F1[1]); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(P1[0], P1[1]); ctx.lineTo(F2[0], F2[1]); ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(255,214,10,.9)';
    ctx.beginPath(); ctx.moveTo(F1[0], F1[1]); ctx.lineTo(P2[0], P2[1]); ctx.lineTo(F2[0], F2[1]); ctx.stroke();
    ctx.font = `12px ${MONO}`; ctx.fillStyle = '#ffd60a';
    ctx.fillText('d·sinθ', P2[0] + 10, P2[1] + 16);
    // angle arc
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(P1[0], P1[1], 34, Math.PI, Math.PI + th); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.font = `600 13px ${FONT}`;
    ctx.fillText('θ', P1[0] - 50, P1[1] - 6);
    // detector
    const D = [P1[0] + uout[0] * (Lout + 10), P1[1] + uout[1] * (Lout + 10)];
    const gl = ctx.createRadialGradient(D[0], D[1], 0, D[0], D[1], 60);
    gl.addColorStop(0, `rgba(48,209,88,${0.9 * I})`); gl.addColorStop(1, 'rgba(48,209,88,0)');
    ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(D[0], D[1], 60, 0, 7); ctx.fill();
    ctx.fillStyle = '#1d1d1f'; ctx.strokeStyle = '#86868b'; ctx.lineWidth = 1.5;
    ctx.save(); ctx.translate(D[0], D[1]); ctx.rotate(-th);
    ctx.fillRect(-4, -16, 10, 32); ctx.strokeRect(-4, -16, 10, 32); ctx.restore();
    ctx.fillStyle = '#fff'; ctx.font = `12px ${MONO}`; ctx.textAlign = 'right';
    ctx.fillText(`검출 강도 ${(I * 100).toFixed(0)}%`, w - 14, 24);
    ctx.fillStyle = cons > 0.9 ? '#30d158' : cons < 0.1 ? '#ff375f' : '#a1a1a6';
    ctx.fillText(cons > 0.9 ? '보강 간섭' : cons < 0.1 ? '상쇄 간섭' : '부분 간섭', w - 14, 42);
    ctx.textAlign = 'left';
  }

  function drawCurve() {
    const { ctx } = C, { w, h } = C.state; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pad = 12, top = 28, bot = 20;
    const X = (deg) => pad + (deg - 5) / 80 * (w - 2 * pad);
    const Y = (v) => h - bot - v * (h - top - bot);
    ctx.strokeStyle = '#d2d2d7'; ctx.beginPath(); ctx.moveTo(pad, Y(0)); ctx.lineTo(w - pad, Y(0)); ctx.stroke();
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#2997ff'); grad.addColorStop(1, '#bf5af2');
    ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= 800; i++) {
      const deg = 5 + 80 * i / 800;
      const v = interf(deg * Math.PI / 180, d, lam);
      i ? ctx.lineTo(X(deg), Y(v)) : ctx.moveTo(X(deg), Y(v));
    }
    ctx.stroke();
    ctx.strokeStyle = '#ff375f'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(X(theta), top - 6); ctx.lineTo(X(theta), Y(0)); ctx.stroke();
    ctx.font = `10px ${MONO}`; ctx.fillStyle = '#86868b'; ctx.textAlign = 'center';
    for (const deg of [10, 30, 50, 70]) ctx.fillText(`${deg}°`, X(deg), h - 5);
  }

  update();
  animate(root, (t) => draw(t));
}
