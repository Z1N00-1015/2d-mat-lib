// Educational continuum relaxation model for twisted bilayer graphene.
// A periodic displacement field is relaxed against in-plane elasticity and a
// three-harmonic stacking potential, then sampled at displayed carbon sites.
import { fitCanvas, animate, range, outs, clamp } from './util.js';

const A_NM = 0.246;
const GRID = 32;
const TAU = Math.PI * 2;
const SQRT3 = Math.sqrt(3);
const B = [
  [TAU, -TAU / SQRT3],
  [0, 2 * TAU / SQRT3],
  [-TAU, -TAU / SQRT3],
];

export function init(root) {
  const canvas = root.querySelector('canvas');
  const out = outs(root);
  let dirty = true;
  let theta = 1.1;
  let coupling = 0.65;
  let field = zeroField();
  let fromField = field;
  let motion = 1;
  let changedAt = performance.now() / 1000;
  const { ctx, state } = fitCanvas(canvas, () => { dirty = true; });

  range(root, 'theta', value => { theta = clamp(value, 0.1, 2.5); relax(); });
  range(root, 'coupling', value => { coupling = clamp(value, 0, 1); relax(); });

  function zeroField() {
    return { x: new Float32Array(GRID * GRID), y: new Float32Array(GRID * GRID) };
  }

  function relax() {
    fromField = field;
    const next = zeroField();
    // The elastic cost rises with twist angle (shorter moiré period); the
    // stacking term is user-scaled. These dimensionless coefficients are for
    // visualization and are not fitted force-field parameters.
    const elastic = 20 * (theta / 1.1) ** 2;
    const adhesion = coupling * 2.2;
    const step = 0.16 / (80 * adhesion + 6 * elastic + 1);
    const wrap = n => (n + GRID) % GRID;

    for (let iteration = 0; iteration < 420; iteration++) {
      for (let j = 0; j < GRID; j++) for (let i = 0; i < GRID; i++) {
        const k = j * GRID + i;
        const im = j * GRID + wrap(i - 1), ip = j * GRID + wrap(i + 1);
        const jm = wrap(j - 1) * GRID + i, jp = wrap(j + 1) * GRID + i;
        const lapX = 6 * next.x[k] - next.x[im] - next.x[ip] - next.x[jm] - next.x[jp]
          - next.x[wrap(j - 1) * GRID + wrap(i + 1)] - next.x[wrap(j + 1) * GRID + wrap(i - 1)];
        const lapY = 6 * next.y[k] - next.y[im] - next.y[ip] - next.y[jm] - next.y[jp]
          - next.y[wrap(j - 1) * GRID + wrap(i + 1)] - next.y[wrap(j + 1) * GRID + wrap(i - 1)];
        const s = i / GRID, t = j / GRID;
        // Rigid-twist local registry sweeps once through a graphene unit cell.
        const d0x = s + 0.5 * t, d0y = SQRT3 * 0.5 * t;
        let gx = 0, gy = 0;
        for (const [bx, by] of B) {
          const phase = bx * (d0x + next.x[k]) + by * (d0y + next.y[k]);
          const force = -Math.sin(phase);
          gx += bx * force;
          gy += by * force;
        }
        next.x[k] -= step * (elastic * lapX + adhesion * gx);
        next.y[k] -= step * (elastic * lapY + adhesion * gy);
      }
    }
    field = next;
    motion = 0;
    changedAt = performance.now() / 1000;
    const period = A_NM / (2 * Math.sin(theta * Math.PI / 360));
    const displacement = maxDisplacement(field);
    out('theta', `${theta.toFixed(2)}°`);
    out('coupling', `${Math.round(coupling * 100)}%`);
    out('L', `${period.toFixed(2)}<small>nm</small>`);
    out('displacement', `${(displacement * A_NM).toFixed(3)}<small>nm</small>`);
    out('hud', `θ = ${theta.toFixed(2)}° · 층간 상호작용 ${Math.round(coupling * 100)}%<br>위층 원자 위치 relaxation 중`);
    if (coupling < 0.08) {
      out('msg', '층간 상호작용이 약해 원자 이동이 작습니다. 모아레의 registry 변화가 넓게 남습니다.');
    } else if (theta < 0.7 && coupling > 0.55) {
      out('msg', '작은 비틀림각과 강한 층간 상호작용 조건입니다. AB·BA 영역이 커지고 그 사이에 좁은 domain wall이 나타납니다.');
    } else if (theta > 2.1) {
      out('msg', '각도가 커지면 같은 변위에도 층내 탄성 비용이 커져 재구성이 약해집니다.');
    } else {
      out('msg', '층간 상호작용은 낮은 에너지 stacking을 넓히고, 층내 탄성은 원자 변위를 억제합니다. 두 에너지의 경쟁으로 domain이 형성됩니다.');
    }
    dirty = true;
  }

  function maxDisplacement(f) {
    let max = 0;
    for (let k = 0; k < f.x.length; k++) max = Math.max(max, Math.hypot(f.x[k], f.y[k]));
    return max;
  }

  function sample(f, s, t) {
    const x = ((s % 1) + 1) % 1 * GRID;
    const y = ((t % 1) + 1) % 1 * GRID;
    const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j;
    const i1 = (i + 1) % GRID, j1 = (j + 1) % GRID;
    const interp = values => {
      const a = values[j * GRID + i] * (1 - u) + values[j * GRID + i1] * u;
      const b = values[j1 * GRID + i] * (1 - u) + values[j1 * GRID + i1] * u;
      return a * (1 - v) + b * v;
    };
    return [interp(f.x), interp(f.y)];
  }

  function draw(now) {
    const { w, h } = state;
    if (!w || !h) return;
    const progress = clamp((now - changedAt) / 1.5, 0, 1);
    motion = progress * progress * (3 - 2 * progress);
    const f = { x: new Float32Array(GRID * GRID), y: new Float32Array(GRID * GRID) };
    for (let k = 0; k < f.x.length; k++) {
      f.x[k] = fromField.x[k] * (1 - motion) + field.x[k] * motion;
      f.y[k] = fromField.y[k] * (1 - motion) + field.y[k] * motion;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#111722';
    ctx.fillRect(0, 0, w, h);
    const Lpx = Math.min(w / 1.48, h / 0.9) * 0.88;
    const ox = w / 2, oy = h / 2;
    // A moiré parallelogram is shown as a square-ish cell. The same periodic
    // relaxed field is tiled across it so its registry and walls remain clear.
    const screen = (s, t) => [ox + Lpx * (s - 0.5 + (t - 0.5) * 0.5), oy + Lpx * SQRT3 * 0.5 * (t - 0.5)];
    const pixels = Math.max(30, Math.round(Lpx * 1.5));
    const image = ctx.createImageData(pixels, pixels);
    for (let py = 0; py < pixels; py++) for (let px = 0; px < pixels; px++) {
      const x = (px / (pixels - 1) - 0.5) * Lpx * 1.5;
      const y = (py / (pixels - 1) - 0.5) * Lpx * 1.5;
      const t = y / (Lpx * SQRT3 * 0.5) + 0.5;
      const s = x / Lpx - (t - 0.5) * 0.5 + 0.5;
      const [ux, uy] = sample(f, s, t);
      const dx = s + 0.5 * t + ux, dy = SQRT3 * 0.5 * t + uy;
      const phases = B.map(([bx, by]) => bx * dx + by * dy);
      const registry = phases.reduce((sum, phase) => sum + Math.cos(phase), 0);
      const aa = clamp((registry + 1.35) / 4.35, 0, 1);
      const p = (py * pixels + px) * 4;
      // AB and BA are distinguished by the sign of the local stacking chirality.
      const chirality = Math.sin(phases[0]) + Math.sin(phases[1]) + Math.sin(phases[2]);
      const domain = chirality >= 0 ? [69, 145, 244] : [241, 151, 72];
      const shade = 0.20 + 0.48 * (1 - aa);
      image.data[p] = Math.round(18 + domain[0] * shade);
      image.data[p + 1] = Math.round(22 + domain[1] * shade);
      image.data[p + 2] = Math.round(31 + domain[2] * shade);
      image.data[p + 3] = 255;
    }
    const temp = document.createElement('canvas');
    temp.width = pixels; temp.height = pixels;
    temp.getContext('2d').putImageData(image, 0, 0);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(...screen(-0.08, 0.08)); ctx.lineTo(...screen(1.08, 0.08));
    ctx.lineTo(...screen(1.08, 0.92)); ctx.lineTo(...screen(-0.08, 0.92)); ctx.closePath();
    ctx.clip();
    ctx.drawImage(temp, ox - Lpx * 0.75, oy - Lpx * 0.75, Lpx * 1.5, Lpx * 1.5);
    ctx.restore();

    // Draw a bounded number of atoms from both honeycomb layers. At small
    // angles the display samples the dense lattice for browser performance.
    const cells = A_NM / (2 * Math.sin(theta * Math.PI / 360)) / A_NM;
    const stride = Math.max(1, Math.ceil(cells / 72));
    const basis = [[0, 0, '#d8e5ff'], [1 / 3, 1 / 3, '#aab7d0']];
    const drawLayer = (upper, color) => {
      ctx.fillStyle = color;
      for (let j = -stride; j <= cells + stride; j += stride) {
        for (let i = -stride; i <= cells + stride; i += stride) for (const [bi, bj, subColor] of basis) {
          const s = (i + bi) / cells, t = (j + bj) / cells;
          if (s < -0.035 || s > 1.035 || t < -0.035 || t > 1.035) continue;
          const [px, py] = screen(s, t);
          let x = px, y = py;
          if (upper) {
            const angle = theta * Math.PI / 180;
            const rx = px - ox, ry = py - oy;
            x = ox + rx * Math.cos(angle) - ry * Math.sin(angle);
            y = oy + rx * Math.sin(angle) + ry * Math.cos(angle);
            const [ux, uy] = sample(f, s, t);
            // Exaggerated displacement keeps sub-pixel relaxation visible.
            const exaggeration = 3.2;
            x += (ux + 0.5 * uy) * Lpx / cells * exaggeration;
            y += uy * Lpx * SQRT3 / (2 * cells) * exaggeration;
          }
          ctx.globalAlpha = subColor === '#aab7d0' ? 0.74 : 0.95;
          ctx.beginPath();
          ctx.arc(x, y, clamp(Lpx / cells * 0.23, 0.7, 2.3), 0, TAU);
          ctx.fillStyle = upper ? (subColor === '#aab7d0' ? '#ffbb79' : '#fff0d8') : subColor;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };
    drawLayer(false, '#d8e5ff');
    drawLayer(true, '#fff0d8');

    ctx.font = '600 12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e4ecff';
    ctx.fillText('아래층', 14, h - 28);
    ctx.fillStyle = '#ffc27f';
    ctx.fillText(motion < 1 ? '위층 · 이동 중' : '위층', 70, h - 28);
    out('hud', `θ = ${theta.toFixed(2)}° · 층간 상호작용 ${Math.round(coupling * 100)}%<br>relaxation 진행 ${Math.round(motion * 100)}%<br>AB blue · BA orange · AA dark`);
    dirty = false;
  }

  relax();
  animate(root, now => {
    if (motion < 1) dirty = true;
    if (dirty) draw(now);
  });
}
