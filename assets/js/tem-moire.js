import { fitCanvas, range, seg, outs } from './util.js';

// Projected atomic columns for two hexagonal TMD layers; coincidence is a qualitative model.
const SPOTS = {
  g1: { angle: 0, label: 'g₁', degree: 0, channel: 'R', color: '255,76,76' },
  g2: { angle: Math.PI / 3, label: 'g₂', degree: 60, channel: 'G', color: '80,235,130' },
  g3: { angle: 2 * Math.PI / 3, label: 'g₃', degree: 120, channel: 'B', color: '96,150,255' },
};
const REFERENCE_LATTICE_NM = 0.3316;

export function init(root) {
  const canvas = root.querySelector('canvas');
  let mode = 'adf', camera = 285, mismatch = 3.96, twist = 0.9, zoom = 1, spot = 'g1';
  const out = outs(root);
  const { ctx, state } = fitCanvas(canvas, draw);
  const cameraPanel = root.querySelector('[data-o="camera-panel"]');
  const spotPanel = root.querySelector('.seg[data-k="spot"]');

  seg(root, 'mode', value => { mode = value; update(); });
  seg(root, 'camera', value => { camera = +value; update(); });
  seg(root, 'spot', value => { spot = value; update(); });
  range(root, 'mismatch', value => { mismatch = value; update(); });
  range(root, 'twist', value => { twist = value; update(); });
  range(root, 'zoom', value => { zoom = value; update(); });

  function contrast() {
    // Ordinal approximation of the camera-length contrast reported in the paper.
    return ({ 115: 0.16, 185: 0.25, 285: 0.92, 360: 0.38 })[camera] || 0.2;
  }

  function moirePeriodNm() {
    const d = mismatch / 100, t = twist * Math.PI / 180;
    const denominator = Math.sqrt(d * d + 2 * (1 + d) * (1 - Math.cos(t)));
    return denominator ? (1 + d) * REFERENCE_LATTICE_NM / denominator : Infinity;
  }

  // Rigid-lattice moiré orientation α from the paper's lattice-mismatch/twist relation.
  // Each first-order direction keeps its hexagonal offset and rotates by the same α.
  function moireOrientationDeg() {
    const d = mismatch / 100, t = twist * Math.PI / 180;
    return Math.atan2(Math.sin(t), (1 + d) - Math.cos(t)) * 180 / Math.PI;
  }
  function spotAngle(direction) { return direction.angle + moireOrientationDeg() * Math.PI / 180; }
  function spotDegree(direction) { return (direction.degree + moireOrientationDeg()) % 180; }

  function update() {
    const isAdf = mode === 'adf';
    cameraPanel.hidden = !isAdf;
    spotPanel.hidden = isAdf;
    root.querySelectorAll('[data-o="df-legend"]').forEach(item => { item.style.display = isAdf ? 'none' : 'inline-flex'; });
    root.querySelector('[data-o="badge"]').textContent = isAdf ? 'ADF-STEM · 원자열 모식도' : 'DF-TEM · 선택 반사 모식도';
    out('camera', String(camera));
    out('mismatch', `${mismatch.toFixed(1)}%`);
    out('twist', `${twist.toFixed(1)}°`);
    out('zoom', `${zoom.toFixed(1)}×`);
    out('period', Number.isFinite(moirePeriodNm()) ? `${moirePeriodNm().toFixed(1)} nm` : '∞');
    out('visibility-key', isAdf ? '논문에서 보고한 모아레 대비' : '선택 반사');
    out('visibility', isAdf ? ({ 115: '매우 약함', 185: '약함', 285: '뚜렷함', 360: '억제됨' })[camera] : (spot === 'all' ? `RGB 합성 · α ${moireOrientationDeg().toFixed(1)}°` : `${SPOTS[spot].label} · 방향 ${spotDegree(SPOTS[spot]).toFixed(1)}° · ${SPOTS[spot].channel}`));
    out('message', isAdf
      ? `<span class="t">${camera} mm · ${({ 115: '약한 Bragg 신호', 185: '아직 약한 Bragg 신호', 285: '모아레 대비가 가장 뚜렷한 조건', 360: '저각 산란이 우세한 조건' })[camera]}</span><p>이상적 육방 격자에서 계산한 주기는 약 ${Number.isFinite(moirePeriodNm()) ? moirePeriodNm().toFixed(1) : '∞'} nm입니다. 카메라 길이는 표시 대비만 바꿉니다.</p>`
      : `<span class="t">${spot === 'all' ? `g₁(R) · g₂(G) · g₃(B) 합성 · α ${moireOrientationDeg().toFixed(1)}°` : `SAED의 ${SPOTS[spot].label} · 방향 ${spotDegree(SPOTS[spot]).toFixed(1)}° · ${SPOTS[spot].channel} 성분 강조`}</span><p>논문의 강체 격자 관계 α = atan2(sin θ, 1+δ−cos θ)로 모아레 방향각을 계산하고, 각 gᵢ 방향은 기본 방위 βᵢ에 α를 더해 표시합니다. fringe 선은 선택 방향에 수직입니다. 이 모식도는 국소 굽힘을 포함하지 않습니다.</p>`);
    out('caption', 'MoS₂와 WSe₂의 육방 원자 배열을 흑백 명암으로 표현했습니다. 밝기는 서로 다른 층을 구분하고, 흰 halo는 두 층 원자가 가까이 겹치는 위치를 표시합니다.');
    out('hud', `MoS₂ / WSe₂ · δ ${mismatch.toFixed(1)}% · θ ${twist.toFixed(1)}°<br>L ≈ ${Number.isFinite(moirePeriodNm()) ? moirePeriodNm().toFixed(1) + ' nm' : '∞'}`);
    redraw();
  }

  function makeLayer(w, h, lattice, rotation, color) {
    const a = 13.5 * lattice * zoom;
    const c = Math.cos(rotation), s = Math.sin(rotation);
    const a1 = [a * c, a * s];
    const a2 = [a * (0.5 * c - Math.sqrt(3) / 2 * s), a * (0.5 * s + Math.sqrt(3) / 2 * c)];
    const det = a1[0] * a2[1] - a1[1] * a2[0];
    const cx = w / 2, cy = h / 2;
    let imin = Infinity, imax = -Infinity, jmin = Infinity, jmax = -Infinity;
    for (const [x, y] of [[-cx, -cy], [cx, -cy], [cx, cy], [-cx, cy]]) {
      const i = (x * a2[1] - y * a2[0]) / det, j = (a1[0] * y - a1[1] * x) / det;
      imin = Math.min(imin, i); imax = Math.max(imax, i); jmin = Math.min(jmin, j); jmax = Math.max(jmax, j);
    }
    const atoms = [];
    const bases = [[0, 0, 'metal'], [(a1[0] + a2[0]) / 3, (a1[1] + a2[1]) / 3, 'chalcogen']];
    for (let i = Math.floor(imin) - 2; i <= Math.ceil(imax) + 2; i++) for (let j = Math.floor(jmin) - 2; j <= Math.ceil(jmax) + 2; j++) {
      const lx = i * a1[0] + j * a2[0], ly = i * a1[1] + j * a2[1];
      for (const [bx, by, kind] of bases) {
        const x = cx + lx + bx, y = cy + ly + by;
        if (x < -12 || y < -12 || x > w + 12 || y > h + 12) continue;
        atoms.push({ x, y, kind, color: color[kind], radius: (kind === 'metal' ? 3.05 : 2.15) * zoom });
      }
    }
    return atoms;
  }

  function coincidenceSites(lower, upper) {
    const cell = 2.5 * zoom, threshold = 1.55 * zoom;
    const buckets = new Map();
    for (const atom of lower) {
      const key = `${Math.floor(atom.x / cell)},${Math.floor(atom.y / cell)}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(atom);
    }
    const sites = [];
    for (const top of upper) {
      const gx = Math.floor(top.x / cell), gy = Math.floor(top.y / cell);
      let nearest = null, distance = threshold;
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        for (const bottom of buckets.get(`${gx + dx},${gy + dy}`) || []) {
          const d = Math.hypot(top.x - bottom.x, top.y - bottom.y);
          if (d < distance) { nearest = bottom; distance = d; }
        }
      }
      if (nearest) sites.push({ x: (top.x + nearest.x) / 2, y: (top.y + nearest.y) / 2 });
    }
    return sites;
  }

  function atomColor(hex, alpha) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${alpha})`;
  }

  function paintLayer(atoms, layerAlpha, isUpper) {
    for (const atom of atoms) {
      let alpha = layerAlpha;
      if (mode === 'df') {
        const selectedDirections = spot === 'all' ? Object.values(SPOTS) : [SPOTS[spot]];
        const pitch = Number.isFinite(moirePeriodNm()) ? moirePeriodNm() * 13.5 * zoom / REFERENCE_LATTICE_NM : Math.max(state.w, state.h);
        const component = selectedDirections.reduce((sum, direction) => {
          const angle = spotAngle(direction);
          const phase = 2 * Math.PI * (atom.x * Math.cos(angle) + atom.y * Math.sin(angle)) / pitch;
          return sum + Math.pow(0.5 + 0.5 * Math.cos(phase), 3);
        }, 0) / selectedDirections.length;
        alpha *= 0.12 + 0.88 * component;
      }
      ctx.fillStyle = atomColor(atom.color, alpha);
      ctx.beginPath(); ctx.arc(atom.x, atom.y, atom.radius, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = isUpper ? 'rgba(255,255,255,.16)' : 'rgba(5,12,20,.68)';
      ctx.lineWidth = 0.65; ctx.stroke();
    }
  }

  function draw(w, h) {
    if (!w || !h) return;
    ctx.fillStyle = '#080b10'; ctx.fillRect(0, 0, w, h);
    const t = twist * Math.PI / 180;
    const lower = makeLayer(w, h, 1, -t / 2, { metal: '#f4f5f7', chalcogen: '#d8dce2' });
    const upper = makeLayer(w, h, 1 + mismatch / 100, t / 2, { metal: '#aeb5bf', chalcogen: '#858e9a' });
    const level = mode === 'adf' ? contrast() : 0.88;
    paintLayer(lower, 0.35 + level * 0.54, false);
    paintLayer(upper, 0.35 + level * 0.54, true);
    const sites = coincidenceSites(lower, upper);
    for (const site of sites) {
      const glow = ctx.createRadialGradient(site.x, site.y, 0.5, site.x, site.y, 10 + level * 7);
      glow.addColorStop(0, `rgba(255,255,255,${0.78 * level})`);
      glow.addColorStop(0.22, `rgba(255,255,255,${0.48 * level})`);
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(site.x, site.y, 17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,255,255,${0.82 * level})`;
      ctx.beginPath(); ctx.arc(site.x, site.y, 2, 0, Math.PI * 2); ctx.fill();
    }
    // Keep the selected-reflection signature visible over the actual projected atomic rows.
    if (mode === 'df') drawDfFringes(w, h);
    scaleBar(w, h);
  }

  function drawDfFringes(w, h) {
    const dirs = spot === 'all' ? Object.values(SPOTS) : [SPOTS[spot]];
    const pitch = Number.isFinite(moirePeriodNm()) ? moirePeriodNm() * 13.5 * zoom / REFERENCE_LATTICE_NM : Math.max(w, h) * 1.3;
    dirs.forEach(direction => {
      const angle = spotAngle(direction);
      const nx = Math.cos(angle), ny = Math.sin(angle), tx = -ny, ty = nx;
      ctx.strokeStyle = `rgba(${direction.color},${spot === 'all' ? 0.42 : 0.68})`; ctx.lineWidth = spot === 'all' ? 5 : 8;
      for (let n = -3; n <= 3; n++) {
        ctx.beginPath();
        for (let t = -Math.max(w, h); t <= Math.max(w, h); t += 5) {
          const local = Math.exp(-(t * t) / (2 * (h * 0.2) ** 2));
          const bend = 0.035 * pitch * local * Math.sin(t / (pitch * 0.65) + n * 0.3);
          const normal = n * pitch + bend;
          const x = w / 2 + nx * normal + tx * t, y = h / 2 + ny * normal + ty * t;
          if (t === -Math.max(w, h)) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    });
  }

  function scaleBar(w, h) {
    const length = Math.min(w * 0.55, 13.5 * zoom / REFERENCE_LATTICE_NM);
    const x = 18, y = h - 20;
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + length, y); ctx.stroke();
    ctx.font = '11px sans-serif'; ctx.fillText('1 nm', x, y - 7);
  }

  function redraw() { const { w, h } = state; draw(w, h); }
  update();
}
