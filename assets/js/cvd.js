// CVD growth of triangular MoS2 domains: nucleation, growth, impingement, grain boundaries
import { fitCanvas, animate, range, toggle, outs } from './util.js';

const UM_PER_CELL = 0.5;

export function init(root) {
  const canvas = root.querySelector('canvas');
  const { ctx, state } = fitCanvas(canvas, () => { if (!running && time === 0) reset(); });
  const out = outs(root);
  let T = 750, F = 1, epi = false, gb = true, running = false, time = 0;
  let GW = 0, GH = 0, owner = null, doms = [], covered = 0, off = null, img = null;
  range(root, 'T', v => { T = v; out('T', `${v} °C`); });
  range(root, 'F', v => { F = v; out('F', v < 0.6 ? '적음' : v < 1.5 ? '보통' : v < 2.3 ? '많음' : '매우 많음'); });
  toggle(root, 'epi', v => { epi = v; });
  toggle(root, 'gb', v => { gb = v; paint(); });
  const runBtn = root.querySelector('[data-a="run"]');
  runBtn.addEventListener('click', () => { running = !running; runBtn.textContent = running ? '일시정지' : '성장 재개'; });
  root.querySelector('[data-a="reset"]').addEventListener('click', () => { reset(); running = false; runBtn.textContent = '성장 시작'; });

  function reset() {
    const { w, h } = state; if (!w) return;
    GW = 180; GH = Math.max(60, Math.round(GW * h / w));
    owner = new Int32Array(GW * GH).fill(-1);
    doms = []; covered = 0; time = 0;
    off = document.createElement('canvas'); off.width = GW; off.height = GH;
    img = off.getContext('2d').createImageData(GW, GH);
    paint(); ui();
  }

  function inside(d, x, y) {
    const px = x - d.x, py = y - d.y, half = d.R / 2;
    for (let i = 0; i < 3; i++) {
      const va = d.rot - Math.PI / 2 + i * 2 * Math.PI / 3;
      if (-(px * Math.cos(va) + py * Math.sin(va)) > half) return false;
    }
    return true;
  }

  function step(dt) {
    time += dt;
    const free = 1 - covered / (GW * GH);
    // nucleation (Arrhenius-like: hotter → fewer nuclei, faster growth)
    const rate = 38 * Math.pow(F, 1.5) * Math.exp(-(T - 600) / 70) * free * (GW * GH) / 15000;
    let n = rate * dt;
    while (n > 0) {
      if (Math.random() < Math.min(1, n)) {
        const x = Math.random() * GW, y = Math.random() * GH;
        if (owner[(y | 0) * GW + (x | 0)] === -1) {
          const rot = epi ? (Math.random() < 0.5 ? 0 : Math.PI / 3) : Math.random() * Math.PI * 2;
          const hue = epi ? (rot === 0 ? 215 : 280) : (((rot * 180 / Math.PI) % 120) / 120 * 300 + 180) % 360;
          doms.push({ x, y, R: 0.6, rot, hue, active: true, cells: 0, idle: 0 });
        }
      }
      n -= 1;
    }
    const G = 4.2 * Math.sqrt(F) * Math.exp((T - 750) / 150);
    for (let id = 0; id < doms.length; id++) {
      const d = doms[id]; if (!d.active) continue;
      d.R += G * dt;
      const x0 = Math.max(0, Math.floor(d.x - d.R)), x1 = Math.min(GW - 1, Math.ceil(d.x + d.R));
      const y0 = Math.max(0, Math.floor(d.y - d.R)), y1 = Math.min(GH - 1, Math.ceil(d.y + d.R));
      let added = 0;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const k = y * GW + x;
        if (owner[k] !== -1) continue;
        if (inside(d, x + 0.5, y + 0.5)) { owner[k] = id; added++; }
      }
      d.cells += added; covered += added;
      if (added === 0 && d.R > 3) { if (++d.idle > 20) d.active = false; } else d.idle = 0;
    }
    paint(); ui();
    if (covered >= GW * GH) { running = false; runBtn.textContent = '완료 ✓'; }
  }

  function paint() {
    if (!img) return;
    const data = img.data;
    const col = new Map();
    const rgb = (hDeg, s, l) => {
      const a = s * Math.min(l, 1 - l), f = (n) => { const k = (n + hDeg / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
      return [f(0) * 255, f(8) * 255, f(4) * 255];
    };
    for (let i = 0; i < GW * GH; i++) {
      const o = owner[i], p = i * 4;
      if (o === -1) { data[p] = 18; data[p + 1] = 20; data[p + 2] = 32; data[p + 3] = 255; continue; }
      const d = doms[o];
      let c = col.get(o);
      if (!c) { c = gb ? rgb(d.hue, 0.65, 0.62) : [150, 120, 230]; col.set(o, c); }
      let edge = false;
      if (gb) {
        const x = i % GW;
        const nb = [x > 0 ? owner[i - 1] : o, x < GW - 1 ? owner[i + 1] : o, i >= GW ? owner[i - GW] : o, i < GW * (GH - 1) ? owner[i + GW] : o];
        for (const q of nb) if (q !== -1 && q !== o && Math.abs(doms[q].rot - d.rot) > 1e-6) { edge = true; break; }
      }
      const k = edge ? 0.25 : 1;
      data[p] = c[0] * k; data[p + 1] = c[1] * k; data[p + 2] = c[2] * k; data[p + 3] = 255;
    }
    off.getContext('2d').putImageData(img, 0, 0);
  }

  function ui() {
    const N = doms.length;
    out('cov', `${(100 * covered / (GW * GH || 1)).toFixed(0)}%`);
    out('n', N);
    if (N) {
      const A = covered / N;
      const L = Math.sqrt(4 * A / Math.sqrt(3)) * UM_PER_CELL;
      out('size', `${L.toFixed(1)}<small>µm (변 길이)</small>`);
    } else out('size', '—');
    out('hud', `t = ${time.toFixed(1)} s · ${T} °C<br>${epi ? '에피택셜: 2가지 방향' : '무작위 방향'}`);
  }

  function draw() {
    const { w, h } = state; if (!w || !off) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, w, h);
  }

  out('T', '750 °C'); out('F', '보통');
  reset();
  animate(root, (t, dt) => { if (running) step(Math.min(dt, 0.033) * 1.6); draw(); });
}
