// Conceptual stacking-domain reconstruction map for twisted bilayer graphene.
import { fitCanvas, animate, range, outs } from './util.js';

const A_NM = 0.246;
const MAX_THETA = 2.5;

export function init(root) {
  const canvas = root.querySelector('canvas');
  let dirty = true;
  const { ctx, state } = fitCanvas(canvas, () => { dirty = true; });
  const out = outs(root);
  let theta = 1.1;
  range(root, 'theta', v => { theta = Math.max(0.1, Math.min(MAX_THETA, v)); refresh(); });

  function reconstructionStrength() {
    return Math.max(0, Math.min(1, (MAX_THETA - theta) / 1.4));
  }

  function refresh() {
    const L = A_NM / (2 * Math.sin(theta * Math.PI / 360));
    const strength = reconstructionStrength();
    const domainFactor = 0.44 + 0.5 * strength;
    out('theta', `${theta.toFixed(2)}°`);
    out('L', `${L.toFixed(2)}<small>nm</small>`);
    out('domain-size', `${(L * domainFactor).toFixed(2)}<small>nm</small>`);
    out('hud', `θ = ${theta.toFixed(2)}°<br>L = ${L.toFixed(2)} nm`);
    const msg = out('msg');
    if (theta > 2.1) {
      msg.innerHTML = '약 2.5° 경계에 가까워 reconstruction 대비가 약해집니다. 이 값은 TBG 모델에서 참고한 근사 범위입니다.';
    } else if (theta < 0.6) {
      msg.innerHTML = '작은 θ에서 모아레 주기가 길어지고, AB·BA domains가 넓어지며 AA 영역은 상대적으로 작아집니다.';
    } else {
      msg.innerHTML = 'AB·BA 적층 domain이 확장되고, AA 영역은 작아지며 domain wall이 경계를 이룹니다.';
    }
    dirty = true;
  }

  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // Keep one screen scale across the slider so the moiré period visibly grows
    // as theta falls. The ratio is schematic and is not an atomistic fit.
    const Lpx = (A_NM / (2 * Math.sin(theta * Math.PI / 360)) / A_NM) * 5;
    const M1 = [Lpx, 0];
    const M2 = [Lpx / 2, Math.sqrt(3) * Lpx / 2];
    const origin = [w / 2, h / 2];
    const det = M1[0] * M2[1] - M1[1] * M2[0];
    const toCell = (x, y) => [(x * M2[1] - y * M2[0]) / det, (M1[0] * y - M1[1] * x) / det];
    const corners = [[-origin[0], -origin[1]], [w - origin[0], -origin[1]], [w - origin[0], h - origin[1]], [-origin[0], h - origin[1]]].map(([x, y]) => toCell(x, y));
    const imin = Math.floor(Math.min(...corners.map(p => p[0]))) - 1;
    const imax = Math.ceil(Math.max(...corners.map(p => p[0]))) + 1;
    const jmin = Math.floor(Math.min(...corners.map(p => p[1]))) - 1;
    const jmax = Math.ceil(Math.max(...corners.map(p => p[1]))) + 1;
    const point = (i, j) => [origin[0] + i * M1[0] + j * M2[0], origin[1] + i * M1[1] + j * M2[1]];
    const strength = reconstructionStrength();
    const inset = 0.44 + 0.5 * strength;

    function triangle(a, b, c, color) {
      const center = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3];
      const inner = [a, b, c].map(p => [center[0] + (p[0] - center[0]) * inset, center[1] + (p[1] - center[1]) * inset]);
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.closePath();
      ctx.fillStyle = 'rgba(12,16,24,.96)'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(...inner[0]); ctx.lineTo(...inner[1]); ctx.lineTo(...inner[2]); ctx.closePath();
      ctx.fillStyle = color; ctx.fill();
    }

    for (let i = imin; i <= imax; i++) for (let j = jmin; j <= jmax; j++) {
      const p = point(i, j), p1 = point(i + 1, j), p2 = point(i, j + 1), p12 = point(i + 1, j + 1);
      triangle(p, p1, p2, 'rgba(79,151,255,.5)');
      triangle(p12, p2, p1, 'rgba(255,166,73,.5)');
    }

    // AA nodes stay localized while the moiré cell expands at smaller angles.
    const aa = Math.max(2, Math.min(24, Lpx * (0.2 - 0.15 * strength)));
    ctx.fillStyle = 'rgba(231,239,255,.95)';
    ctx.beginPath();
    for (let i = imin; i <= imax; i++) for (let j = jmin; j <= jmax; j++) {
      const [x, y] = point(i, j);
      if (x < -aa || y < -aa || x > w + aa || y > h + aa) continue;
      ctx.moveTo(x + aa, y); ctx.arc(x, y, aa, 0, Math.PI * 2);
    }
    ctx.fill();

    if (Lpx > 70) {
      ctx.font = '600 12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,.96)';
      const ab = point(1 / 3, 1 / 3), ba = point(2 / 3, 2 / 3);
      if (ab[0] > 12 && ab[0] < w - 12 && ab[1] > 12 && ab[1] < h - 12) ctx.fillText('AB', ab[0], ab[1] + 4);
      if (ba[0] > 12 && ba[0] < w - 12 && ba[1] > 12 && ba[1] < h - 12) ctx.fillText('BA', ba[0], ba[1] + 4);
      if (origin[0] > 12 && origin[0] < w - 12 && origin[1] > 12 && origin[1] < h - 12) {
        ctx.fillStyle = '#171b25';
        ctx.fillText('AA', origin[0], origin[1] + 4);
      }
    }
  }

  refresh();
  animate(root, () => {
    if (dirty) { draw(); dirty = false; }
  });
}
