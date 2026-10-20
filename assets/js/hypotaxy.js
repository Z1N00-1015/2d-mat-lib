// Conceptual model of nanopore-mediated, template-aligned hypotaxial nucleation.
import { fitCanvas, range, outs } from './util.js';

const PORE_SPACING_NM = 16;
const COLS = 8;
const ROWS = 4;
const SITES = COLS * ROWS;

function makeSites() {
  // A seeded pattern makes the random-looking arrangement stable while the slider moves.
  let seed = 20261020;
  const random = () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  const positions = [];
  let attempts = 0;
  while (positions.length < SITES && attempts < 50000) {
    attempts++;
    const candidate = { x: 0.06 + random() * 0.88, y: 0.08 + random() * 0.84 };
    // Keep a modest exclusion distance, but do not impose visible rows or columns.
    if (positions.every(p => Math.hypot((candidate.x - p.x) * 0.75, candidate.y - p.y) > 0.09)) {
      positions.push(candidate);
    }
  }
  // Defensive fallback for unusually constrained random sequences.
  while (positions.length < SITES) {
    const i = positions.length;
    positions.push({ x: (i % COLS + 0.5) / COLS, y: (Math.floor(i / COLS) + 0.5) / ROWS });
  }
  const factors = Array.from({ length: SITES }, () => 0.58 + random() * 0.84);
  const meanFactor = factors.reduce((sum, factor) => sum + factor, 0) / SITES;
  return positions.map((position, i) => ({
    ...position,
    // Normalize the sampled spread so the slider is the exact displayed mean diameter.
    sizeFactor: factors[i] / meanFactor,
    threshold: random()
  }));
}

const sites = makeSites();

export function init(root) {
  const canvas = root.querySelector('canvas');
  const { ctx, state } = fitCanvas(canvas, draw);
  const out = outs(root);
  let diameter = 2;

  range(root, 'diameter', value => {
    diameter = value;
    update();
    draw();
  });

  function probabilityFor(meanDiameter) {
    // Illustrative saturating response, not a fit to measured nucleation data.
    return 1 - Math.exp(-Math.pow(meanDiameter / 3.1, 2));
  }

  function update() {
    const probability = probabilityFor(diameter);
    const nuclei = sites.filter(site => site.threshold < probability).length;
    const meanAreaFactor = sites.reduce((sum, site) => sum + site.sizeFactor ** 2, 0) / SITES;
    const poreFraction = Math.PI * diameter * diameter * meanAreaFactor / (4 * PORE_SPACING_NM * PORE_SPACING_NM);
    out('diameter', `${diameter.toFixed(1)} nm`);
    out('nuclei', `${nuclei} / ${SITES} <small>(모식)</small>`);
    out('cover', `${((1 - poreFraction) * 100).toFixed(1)}%`);
    out('trend', diameter < 1.5
      ? '핵생성 자리 적음'
      : diameter < 3.8
        ? '정렬 핵 증가'
        : '핵 조밀 · 합체 가능성 ↑');
  }

  function drawTriangle(x, y, r, fill) {
    ctx.beginPath();
    for (let k = 0; k < 3; k++) {
      const angle = -Math.PI / 2 + k * (Math.PI * 2 / 3);
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
    ctx.lineWidth = 1.7; ctx.strokeStyle = '#fff0bd'; ctx.stroke();
  }

  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#111722'; ctx.fillRect(0, 0, w, h);
    const compact = w < 420;
    ctx.fillStyle = '#dce7f0'; ctx.font = `600 ${compact ? 10 : 12}px system-ui, sans-serif`;
    ctx.fillText(compact ? 'GRAPHENE · TOP VIEW' : 'GRAPHENE TEMPLATE · TOP VIEW', 18, 23);
    ctx.fillStyle = '#9daebe'; ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(`평균 ${diameter.toFixed(1)} nm · 위치·크기 무작위`, 18, 42);
    ctx.fillStyle = '#9daebe'; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(`핵 ${sites.filter(site => site.threshold < probabilityFor(diameter)).length}개 · 모식`, w - 18, 23);
    ctx.textAlign = 'left';

    const left = 30, right = w - 30, top = 72, bottom = h - 48;
    const fieldW = right - left, fieldH = bottom - top;
    const baseRadius = Math.min(fieldW / COLS, fieldH / ROWS);
    const probability = probabilityFor(diameter);
    ctx.fillStyle = '#263748'; ctx.fillRect(17, 54, w - 34, h - 84);

    for (const site of sites) {
      const x = left + site.x * fieldW;
      const y = top + site.y * fieldH;
      const actualDiameter = diameter * site.sizeFactor;
      const poreR = Math.max(2, Math.min(18, actualDiameter / PORE_SPACING_NM * baseRadius * 0.5));
      const active = site.threshold < probability;

      // Draw the pore first so the bright, consistently oriented seed is easy to see.
      ctx.beginPath(); ctx.arc(x, y, poreR, 0, Math.PI * 2);
      ctx.fillStyle = '#101722'; ctx.fill();
      ctx.lineWidth = 1.7; ctx.strokeStyle = active ? '#64d8c0' : '#8193a5'; ctx.stroke();
      if (active) {
        drawTriangle(x, y, Math.max(8, Math.min(12, poreR * 0.92)), '#f2b84b');
      }
    }

    const legendY = h - 15;
    ctx.fillStyle = '#64d8c0'; ctx.beginPath(); ctx.arc(22, legendY - 3, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d6e0e9'; ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('나노구멍', 32, legendY);
    drawTriangle(108, legendY - 4, 6, '#f2b84b');
    ctx.fillStyle = '#d6e0e9'; ctx.fillText(compact ? '정렬 TMD 핵' : '같은 방향으로 정렬된 TMD 핵', 119, legendY);
  }

  update();
  draw();
}
