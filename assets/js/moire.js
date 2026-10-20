// Moiré superlattice of two twisted / mismatched honeycomb layers
import { fitCanvas, animate, seg, range, toggle, outs } from './util.js';

const A_NM = 0.246;
const PRESETS = { magic: [1.1, 0], t5: [5, 0], t13: [13.17, 0], t21: [21.79, 0], ghbn: [0, 1.8] };

export function init(root) {
  const canvas = root.querySelector('canvas');
  const { ctx, state } = fitCanvas(canvas, () => (dirty = true));
  const out = outs(root);
  let theta = 1.1, delta = 0, zoom = 5, mode = 'domains', anim = false, dirty = true;
  const tCtl = range(root, 'theta', v => { theta = v; refresh(); });
  const dCtl = range(root, 'delta', v => { delta = v; refresh(); });
  range(root, 'zoom', v => { zoom = v; refresh(); });
  toggle(root, 'anim', v => { anim = v; });
  seg(root, 'mode', v => { mode = v; refresh(); });
  const setPreset = seg(root, 'preset', v => {
    [theta, delta] = PRESETS[v];
    tCtl.set(theta, false); dCtl.set(delta, false); refresh();
  });

  // drag to twist
  let drag = null;
  canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, t: theta }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (!drag) return;
    theta = Math.max(0, Math.min(30, drag.t + (e.clientX - drag.x) * 0.02));
    tCtl.set(theta, false); setPreset('', false); refresh();
  });
  canvas.addEventListener('pointerup', () => { drag = null; });

  function period() {
    const r = 1 + delta / 100, th = theta * Math.PI / 180;
    const den = Math.sqrt(2 * r * (1 - Math.cos(th)) + (r - 1) ** 2);
    return den < 1e-9 ? Infinity : r / den; // in units of a
  }

  function refresh() {
    const La = period();
    out('theta', `${theta.toFixed(2)}°`);
    out('delta', `${delta.toFixed(1)}%`);
    out('zoom', `×${(zoom / 12).toFixed(1)}`);
    out('L', isFinite(La) ? `${(La * A_NM).toFixed(2)}<small>nm</small>` : '∞');
    out('La', isFinite(La) ? La.toFixed(1) : '∞');
    out('domain-size', isFinite(La) ? `${(La * A_NM).toFixed(2)}<small>nm</small>` : '∞');
    out('N', isFinite(La) ? `≈ ${Math.round(4 * La * La).toLocaleString()} 개` : '—');
    const msg = out('msg');
    let html = '비틀림 각 θ가 작을수록 모아레 주기 L은 커집니다. 화면을 좌우로 드래그해 비틀어 보세요.', hot = false;
    if (mode === 'domains') {
      html = '파랑·주황 영역은 AB·BA stacking domains, 어두운 띠는 domain walls, 원은 AA 영역을 나타내는 모식도입니다. θ를 낮추면 모아레 주기가 커지고, AB·BA 영역이 AA 주변과 domain walls보다 상대적으로 넓어지는 경향을 볼 수 있습니다. TBG의 작은 각도 영역에서 관찰되는 재구성을 단순화했습니다.';
      if (delta > 0.1) html += ' 격자 불일치가 있는 조합은 실제 도메인 대칭과 모양이 다를 수 있습니다.';
    }
    else if (Math.abs(theta - 1.08) < 0.1 && delta < 0.3) { html = '✨ <b>매직 앵글</b>: 층간 혼성(interlayer hybridization)으로 디랙 원뿔의 페르미 속도가 0에 가까워져 평탄 밴드(flat band)가 형성됩니다. 운동 에너지보다 전자 간 쿨롱 상호작용이 우세해져 상관 절연체(correlated insulator)와 비통상 초전도가 나타납니다.'; hot = true; }
    else if (Math.abs(theta - 21.79) < 0.05) html = '<b>정합(commensurate) 구조</b>: θ = 21.79°에서 두 격자가 √7 × √7 초격자로 정확히 일치합니다(Σ7 대응 격자, coincidence site lattice).';
    else if (Math.abs(theta - 13.17) < 0.05) html = '<b>정합 구조</b>: θ = 13.17°는 √19 × √19 초격자를 만듭니다. 정합 각도는 cos θ = (m²+4mn+n²) / 2(m²+mn+n²) 로 주어집니다.';
    else if (theta > 29.5) html = '<b>30° 비틀림</b>: 병진 주기성이 없는 12회 회전 대칭의 <b>준결정(quasicrystal)</b>이 됩니다 (Science 2018).';
    else if (theta < 0.3 && delta > 1.4 && delta < 2.2) html = '<b>그래핀/h-BN</b>: 비틀림 없이도 1.8%의 격자 불일치(lattice mismatch)만으로 약 14 nm 주기의 모아레가 형성되어, 그래핀에 작은 밴드갭과 2차 디랙점(secondary Dirac point)이 나타납니다.';
    msg.innerHTML = html; msg.classList.toggle('hot', hot);
    out('hud', `θ = ${theta.toFixed(2)}° · δ = ${delta.toFixed(1)}%<br>L = ${isFinite(La) ? (La * A_NM).toFixed(2) + ' nm' : '∞'}`);
    dirty = true;
  }

  function layer(rot, scale, color) {
    const { w, h } = state;
    const a = zoom * scale;
    const c = Math.cos(rot), s = Math.sin(rot);
    const a1 = [a * c, a * s];
    const a2 = [a * (0.5 * c - Math.sqrt(3) / 2 * s), a * (0.5 * s + Math.sqrt(3) / 2 * c)];
    const b = [(a1[0] + a2[0]) / 3, (a1[1] + a2[1]) / 3];
    const cx = w / 2, cy = h / 2;
    // lattice coord bounds
    const det = a1[0] * a2[1] - a1[1] * a2[0];
    let imin = 1e9, imax = -1e9, jmin = 1e9, jmax = -1e9;
    for (const [x, y] of [[-cx, -cy], [cx, -cy], [cx, cy], [-cx, cy]]) {
      const i = (x * a2[1] - y * a2[0]) / det, j = (a1[0] * y - a1[1] * x) / det;
      imin = Math.min(imin, i); imax = Math.max(imax, i); jmin = Math.min(jmin, j); jmax = Math.max(jmax, j);
    }
    imin = Math.floor(imin) - 1; jmin = Math.floor(jmin) - 1; imax = Math.ceil(imax) + 1; jmax = Math.ceil(jmax) + 1;
    ctx.fillStyle = color; ctx.strokeStyle = color;
    if (mode === 'dots') {
      // one dot per lattice point keeps the moiré legible
      const r = Math.max(1, a * 0.3);
      ctx.beginPath();
      for (let i = imin; i <= imax; i++) for (let j = jmin; j <= jmax; j++) {
        const x = cx + i * a1[0] + j * a2[0], y = cy + i * a1[1] + j * a2[1];
        if (x < -4 || y < -4 || x > w + 4 || y > h + 4) continue;
        ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, 6.2832);
      }
      ctx.fill();
    } else if (mode === 'bonds') {
      ctx.lineWidth = Math.max(0.8, a * 0.09);
      ctx.beginPath();
      for (let i = imin; i <= imax; i++) for (let j = jmin; j <= jmax; j++) {
        const x = cx + i * a1[0] + j * a2[0], y = cy + i * a1[1] + j * a2[1];
        if (x < -a || y < -a || x > w + a || y > h + a) continue;
        const bx = x + b[0], by = y + b[1];
        ctx.moveTo(x, y); ctx.lineTo(bx, by);
        ctx.moveTo(bx, by); ctx.lineTo(x + a1[0], y + a1[1]);
        ctx.moveTo(bx, by); ctx.lineTo(x + a2[0], y + a2[1]);
      }
      ctx.stroke();
    }
    return { a1, a2 };
  }

  function draw() {
    const { w, h } = state; if (!w) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    const th = theta * Math.PI / 180;
    const L1 = layer(-th / 2, 1, mode === 'dots' ? 'rgba(41,151,255,0.85)' : 'rgba(41,151,255,0.75)');
    const L2 = layer(th / 2, 1 + delta / 100, mode === 'dots' ? 'rgba(255,159,10,0.9)' : 'rgba(255,159,10,0.75)');
    ctx.globalCompositeOperation = 'source-over';
    // AA sites from moiré lattice: g_i = b_i(1) - b_i(2)
    const recip = ({ a1, a2 }) => {
      const det = a1[0] * a2[1] - a1[1] * a2[0];
      return [[2 * Math.PI * a2[1] / det, -2 * Math.PI * a2[0] / det], [-2 * Math.PI * a1[1] / det, 2 * Math.PI * a1[0] / det]];
    };
    const B1 = recip(L1), B2 = recip(L2);
    const g1 = [B1[0][0] - B2[0][0], B1[0][1] - B2[0][1]], g2 = [B1[1][0] - B2[1][0], B1[1][1] - B2[1][1]];
    const gd = g1[0] * g2[1] - g1[1] * g2[0];
    if (Math.abs(gd) > 1e-12) {
      const M1 = [2 * Math.PI * g2[1] / gd, -2 * Math.PI * g2[0] / gd];
      const M2 = [-2 * Math.PI * g1[1] / gd, 2 * Math.PI * g1[0] / gd];
      const Lpx = Math.hypot(...M1);
      if (mode === 'domains') {
        drawDomains(M1, M2, Lpx, w, h);
      } else if (Lpx > 40 && Lpx < 4 * Math.max(w, h)) {
        ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
        const n = Math.ceil(Math.max(w, h) / Lpx) + 1;
        // moiré unit cell
        ctx.beginPath();
        const o = [w / 2, h / 2];
        ctx.moveTo(o[0], o[1]); ctx.lineTo(o[0] + M1[0], o[1] + M1[1]); ctx.lineTo(o[0] + M1[0] + M2[0], o[1] + M1[1] + M2[1]); ctx.lineTo(o[0] + M2[0], o[1] + M2[1]); ctx.closePath(); ctx.stroke();
        ctx.setLineDash([]);
        for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) {
          const x = o[0] + i * M1[0] + j * M2[0], y = o[1] + i * M1[1] + j * M2[1];
          if (x < -20 || y < -20 || x > w + 20 || y > h + 20) continue;
          ctx.beginPath(); ctx.arc(x, y, Math.min(18, Lpx * 0.12), 0, 7); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.font = '600 12px -apple-system, sans-serif';
        ctx.fillText('AA', o[0] + Math.min(18, Lpx * 0.12) + 4, o[1] - 4);
      }
    } else if (mode === 'domains') {
      ctx.fillStyle = 'rgba(255,255,255,.78)';
      ctx.font = '500 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('θ = 0°, δ = 0%에서는 모아레 주기가 무한대입니다', w / 2, h / 2);
    }
  }

  function drawDomains(M1, M2, Lpx, w, h) {
    if (!Number.isFinite(Lpx) || Lpx < 1e-6) return;
    const o = [w / 2, h / 2];
    const det = M1[0] * M2[1] - M1[1] * M2[0];
    if (Math.abs(det) < 1e-9) return;
    const toCell = (x, y) => [(x * M2[1] - y * M2[0]) / det, (M1[0] * y - M1[1] * x) / det];
    const corners = [[-o[0], -o[1]], [w - o[0], -o[1]], [w - o[0], h - o[1]], [-o[0], h - o[1]]].map(([x, y]) => toCell(x, y));
    const imin = Math.floor(Math.min(...corners.map(p => p[0]))) - 1;
    const imax = Math.ceil(Math.max(...corners.map(p => p[0]))) + 1;
    const jmin = Math.floor(Math.min(...corners.map(p => p[1]))) - 1;
    const jmax = Math.ceil(Math.max(...corners.map(p => p[1]))) + 1;
    const point = (i, j) => [o[0] + i * M1[0] + j * M2[0], o[1] + i * M1[1] + j * M2[1]];
    const strength = 1 / (1 + Math.exp((theta - 1.4) / 0.35));
    const fillTriangle = (a, b, c, color) => {
      const center = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
      const inset = 0.42 + 0.5 * strength;
      const inner = [a, b, c].map(p => [center[0] + (p[0] - center[0]) * inset, center[1] + (p[1] - center[1]) * inset]);
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.closePath();
      ctx.fillStyle = 'rgba(12,16,24,.92)'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(...inner[0]); ctx.lineTo(...inner[1]); ctx.lineTo(...inner[2]); ctx.closePath();
      ctx.fillStyle = color; ctx.fill();
    };
    for (let i = imin; i <= imax; i++) for (let j = jmin; j <= jmax; j++) {
      const p = point(i, j), p1 = point(i + 1, j), p2 = point(i, j + 1), p12 = point(i + 1, j + 1);
      fillTriangle(p, p1, p2, 'rgba(79,151,255,.32)');
      fillTriangle(p12, p2, p1, 'rgba(255,166,73,.32)');
    }
    // AA regions lie at the vertices of the triangular moiré lattice.
    const aa = Math.max(2, Math.min(zoom * 2.5, Lpx * (0.2 - 0.15 * strength)));
    ctx.fillStyle = 'rgba(231,239,255,.92)';
    ctx.beginPath();
    for (let i = imin; i <= imax; i++) for (let j = jmin; j <= jmax; j++) {
      const [x, y] = point(i, j);
      if (x < -aa || y < -aa || x > w + aa || y > h + aa) continue;
      ctx.moveTo(x + aa, y); ctx.arc(x, y, aa, 0, Math.PI * 2);
    }
    ctx.fill();
    if (Lpx > 62) {
      ctx.font = '600 12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,.95)';
      const ab = point(1 / 3, 1 / 3), ba = point(2 / 3, 2 / 3);
      if (ab[0] > 12 && ab[0] < w - 12 && ab[1] > 12 && ab[1] < h - 12) ctx.fillText('AB', ab[0], ab[1] + 4);
      if (ba[0] > 12 && ba[0] < w - 12 && ba[1] > 12 && ba[1] < h - 12) ctx.fillText('BA', ba[0], ba[1] + 4);
      if (o[0] > 12 && o[0] < w - 12 && o[1] > 12 && o[1] < h - 12) {
        ctx.fillStyle = '#171b25';
        ctx.fillText('AA', o[0], o[1] + 4);
      }
    }
  }

  refresh();
  animate(root, (t, dt) => {
    if (anim) {
      theta = (theta + dt * 0.4) % 30;
      tCtl.set(theta, false); refresh();
    }
    if (dirty) { draw(); dirty = false; }
  });
}
