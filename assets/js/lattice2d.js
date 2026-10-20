// 2D Bravais lattices, reciprocal lattice and first Brillouin zone
import { fitCanvas, seg, range, toggle, outs, arrow, FONT, MONO } from './util.js';

const PRESETS = {
  square: [1, 90], hex: [1, 120], rect: [1.6, 90], crect: [1, 70], obl: [1.35, 105],
};

/** Voronoi cell of the origin among lattice points (half-plane clipping). */
function voronoi(v1, v2) {
  let poly = [[-50, -50], [50, -50], [50, 50], [-50, 50]];
  const pts = [];
  for (let m = -3; m <= 3; m++) for (let n = -3; n <= 3; n++) {
    if (!m && !n) continue;
    pts.push([m * v1[0] + n * v2[0], m * v1[1] + n * v2[1]]);
  }
  pts.sort((a, b) => (a[0] ** 2 + a[1] ** 2) - (b[0] ** 2 + b[1] ** 2));
  for (const G of pts) {
    const c = (G[0] ** 2 + G[1] ** 2) / 2;
    const inside = (p) => p[0] * G[0] + p[1] * G[1] <= c + 1e-9;
    const next = [];
    for (let i = 0; i < poly.length; i++) {
      const P = poly[i], Q = poly[(i + 1) % poly.length];
      const ip = inside(P), iq = inside(Q);
      if (ip) next.push(P);
      if (ip !== iq) {
        const fp = P[0] * G[0] + P[1] * G[1] - c, fq = Q[0] * G[0] + Q[1] * G[1] - c;
        const t = fp / (fp - fq);
        next.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]);
      }
    }
    poly = next;
  }
  return poly;
}

function classify(r, g) {
  const tol = 0.012, at = (x, y) => Math.abs(x - y) < 0.6;
  const eq = Math.abs(r - 1) < tol;
  if (eq && at(g, 90)) return ['정사각 격자', 'square', 'p4mm · 4회 회전 대칭'];
  if (eq && (at(g, 120) || at(g, 60))) return ['육방 격자', 'hex', 'p6mm · 6회 회전 대칭 · 그래핀, hBN, MoS₂'];
  if (at(g, 90)) return ['직사각 격자', 'rect', 'p2mm · 2개의 거울면'];
  const rc = r * Math.cos(g * Math.PI / 180);
  const cg = Math.cos(g * Math.PI / 180);
  if (eq || Math.abs(Math.abs(rc) - 0.5) < tol || Math.abs(Math.abs(cg) - r / 2) < tol) return ['중심 직사각 격자', 'crect', 'c2mm · 마름모꼴 원시 단위격자'];
  return ['평행사변형 격자', 'obl', 'p2 · 2회 회전 대칭만 존재'];
}

export function init(root) {
  const out = outs(root);
  const R = fitCanvas(root.querySelector('[data-c="real"]'), () => draw());
  const K = fitCanvas(root.querySelector('[data-c="recip"]'), () => draw());
  let ratio = 1, gamma = 120, basis = false;
  const rCtl = range(root, 'ratio', v => { ratio = v; sync(); });
  const gCtl = range(root, 'gamma', v => { gamma = v; sync(); });
  toggle(root, 'basis', v => { basis = v; draw(); });
  const setPreset = seg(root, 'preset', v => {
    [ratio, gamma] = PRESETS[v];
    rCtl.set(ratio, false); gCtl.set(gamma, false);
    sync(true);
  });

  function sync(fromPreset) {
    const [name, key, sym] = classify(ratio, gamma);
    out('type', `${name}<div style="font-size:12px;font-weight:500;color:#86868b;letter-spacing:0">${sym}</div>`);
    if (!fromPreset) setPreset(key, false);
    out('ratio', ratio.toFixed(2));
    out('gamma', `${gamma.toFixed(1)}°`);
    draw();
  }

  function vectors() {
    const g = gamma * Math.PI / 180;
    const a1 = [1, 0], a2 = [ratio * Math.cos(g), ratio * Math.sin(g)];
    const area = a1[0] * a2[1] - a1[1] * a2[0];
    const b1 = [2 * Math.PI * a2[1] / area, -2 * Math.PI * a2[0] / area];
    const b2 = [-2 * Math.PI * a1[1] / area, 2 * Math.PI * a1[0] / area];
    return { a1, a2, b1, b2 };
  }

  function lattice(ctx, w, h, v1, v2, scale, color, opts = {}) {
    const cx = w / 2, cy = h / 2;
    const T = (p) => [cx + p[0] * scale, cy - p[1] * scale];
    // Voronoi cell (WS cell / BZ)
    const cell = voronoi(v1, v2);
    ctx.beginPath();
    cell.forEach((p, i) => { const [x, y] = T(p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.closePath();
    ctx.fillStyle = opts.cellFill; ctx.fill();
    ctx.strokeStyle = opts.cellStroke; ctx.lineWidth = 2; ctx.stroke();
    // primitive cell parallelogram
    if (opts.prim) {
      const P = [[0, 0], v1, [v1[0] + v2[0], v1[1] + v2[1]], v2].map(T);
      ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
      ctx.fillStyle = 'rgba(100,210,255,0.10)'; ctx.fill();
      ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(100,210,255,.6)'; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    }
    // points
    const span = Math.max(w, h) / scale / Math.max(0.3, Math.min(Math.hypot(...v1), Math.hypot(...v2))) + 4;
    const N = Math.min(40, Math.ceil(span));
    ctx.fillStyle = color;
    for (let m = -N; m <= N; m++) for (let n = -N; n <= N; n++) {
      const p = [m * v1[0] + n * v2[0], m * v1[1] + n * v2[1]];
      const [x, y] = T(p);
      if (x < -10 || y < -10 || x > w + 10 || y > h + 10) continue;
      ctx.beginPath(); ctx.arc(x, y, opts.r || 3.5, 0, 7); ctx.fill();
    }
    return { T, cell };
  }

  function draw() {
    const { a1, a2, b1, b2 } = vectors();
    // ---- real space
    {
      const { ctx } = R, { w, h } = R.state; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w, h) / 6.2;
      const { T } = lattice(ctx, w, h, a1, a2, scale, basis ? 'rgba(255,255,255,0.25)' : '#f5f5f7', {
        cellFill: 'rgba(48,209,88,0.12)', cellStroke: '#30d158', prim: true, r: basis ? 2 : 4,
      });
      if (basis) {
        // honeycomb basis at fractional (1/3,2/3) & (2/3,1/3) of each cell
        const atoms = [];
        const N = 8;
        for (let m = -N; m <= N; m++) for (let n = -N; n <= N; n++) for (const [f1, f2, c] of [[1 / 3, 2 / 3, '#ff9f0a'], [2 / 3, 1 / 3, '#64d2ff']]) {
          const u = m + f1, v = n + f2;
          atoms.push([u * a1[0] + v * a2[0], u * a1[1] + v * a2[1], c]);
        }
        const nn = Math.min(...atoms.slice(0, 50).flatMap((p, i) => atoms.slice(0, 50).filter((q, j) => j !== i).map(q => Math.hypot(p[0] - q[0], p[1] - q[1]))));
        ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1.5;
        for (let i = 0; i < atoms.length; i++) for (let j = i + 1; j < atoms.length; j++) {
          const d = Math.hypot(atoms[i][0] - atoms[j][0], atoms[i][1] - atoms[j][1]);
          if (d < nn * 1.05) {
            const [x1, y1] = T(atoms[i]), [x2, y2] = T(atoms[j]);
            if (x1 < -20 || x1 > w + 20 || y1 < -20 || y1 > h + 20) continue;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          }
        }
        for (const p of atoms) {
          const [x, y] = T(p); if (x < -10 || x > w + 10 || y < -10 || y > h + 10) continue;
          ctx.fillStyle = p[2]; ctx.beginPath(); ctx.arc(x, y, 4.5, 0, 7); ctx.fill();
        }
      }
      const o = T([0, 0]);
      arrow(ctx, o[0], o[1], ...T(a1), '#64d2ff', 2.5, 11);
      arrow(ctx, o[0], o[1], ...T(a2), '#ff9f0a', 2.5, 11);
      ctx.font = `600 14px ${FONT}`; ctx.fillStyle = '#64d2ff';
      const p1 = T(a1); ctx.fillText('a₁', p1[0] + 6, p1[1] + 16);
      ctx.fillStyle = '#ff9f0a'; const p2 = T(a2); ctx.fillText('a₂', p2[0] - 20, p2[1] - 6);
      ctx.font = `12px ${MONO}`; ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.textAlign = 'right';
      const area = Math.abs(a1[0] * a2[1] - a1[1] * a2[0]);
      ctx.fillText(`원시 단위격자 면적 = ${area.toFixed(3)} a²`, w - 14, h - 14);
      ctx.textAlign = 'left';
    }
    // ---- reciprocal space
    {
      const { ctx } = K, { w, h } = K.state; if (!w) return;
      ctx.clearRect(0, 0, w, h);
      const scale = Math.min(w, h) / 3.1 / (2 * Math.PI);
      const { T, cell } = lattice(ctx, w, h, b1, b2, scale, '#f5f5f7', {
        cellFill: 'rgba(191,90,242,0.18)', cellStroke: '#bf5af2', r: 4,
      });
      const o = T([0, 0]);
      arrow(ctx, o[0], o[1], ...T(b1), '#64d2ff', 2.5, 11);
      arrow(ctx, o[0], o[1], ...T(b2), '#ff9f0a', 2.5, 11);
      ctx.font = `600 14px ${FONT}`;
      ctx.fillStyle = '#64d2ff'; const q1 = T(b1); ctx.fillText('b₁', q1[0] + 6, q1[1] + 4);
      ctx.fillStyle = '#ff9f0a'; const q2 = T(b2); ctx.fillText('b₂', q2[0] + 6, q2[1] - 4);
      // high symmetry points
      ctx.fillStyle = '#fff'; ctx.font = `700 14px ${FONT}`;
      ctx.fillText('Γ', o[0] + 7, o[1] - 7);
      const [, key] = classify(ratio, gamma);
      if (key === 'hex' || key === 'square') {
        cell.forEach((p, i) => {
          const [x, y] = T(p);
          const q = cell[(i + 1) % cell.length];
          const [mx, my] = T([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]);
          if (key === 'hex') {
            const glow = ctx.createRadialGradient(x, y, 0, x, y, 18);
            glow.addColorStop(0, 'rgba(255,214,10,.9)'); glow.addColorStop(1, 'rgba(255,214,10,0)');
            ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, 18, 0, 7); ctx.fill();
          }
          ctx.fillStyle = '#ffd60a';
          ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill();
          ctx.fillStyle = '#30d158'; ctx.beginPath(); ctx.arc(mx, my, 3, 0, 7); ctx.fill();
          if (i < 2) {
            ctx.fillStyle = '#ffd60a';
            ctx.fillText(key === 'hex' ? (i ? 'K′' : 'K') : 'M', x + 8, y + 4);
            ctx.fillStyle = '#30d158';
            ctx.fillText(key === 'hex' ? 'M' : 'X', mx + 8, my + 4);
          }
        });
        if (key === 'hex') {
          ctx.font = `12px ${FONT}`; ctx.fillStyle = 'rgba(255,214,10,.85)'; ctx.textAlign = 'right';
          ctx.fillText('K, K′ : 그래핀 디랙 원뿔의 위치', w - 14, h - 14); ctx.textAlign = 'left';
        }
      }
    }
  }

  sync();
}
