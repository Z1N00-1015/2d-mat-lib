// Conceptual model of nanopore-mediated, template-aligned hypotaxial nucleation.
import { fitCanvas, range, outs } from './util.js';

const PORE_SPACING_NM = 16;
const COLS = 8;
const ROWS = 4;
const SITES = COLS * ROWS;
const DURATION_S = 6;
const LARGE_PORE_NM = 3.5;

function makeSites() {
  // A seeded random arrangement keeps the scene stable while controls change.
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
    if (positions.every(p => Math.hypot((candidate.x - p.x) * 0.75, candidate.y - p.y) > 0.09)) {
      positions.push(candidate);
    }
  }
  while (positions.length < SITES) {
    const i = positions.length;
    positions.push({ x: (i % COLS + 0.5) / COLS, y: (Math.floor(i / COLS) + 0.5) / ROWS });
  }
  const factors = Array.from({ length: SITES }, () => 0.58 + random() * 0.84);
  const meanFactor = factors.reduce((sum, factor) => sum + factor, 0) / SITES;
  return positions.map((position, i) => ({
    ...position,
    sizeFactor: factors[i] / meanFactor,
    activation: random(),
    nucleationPhase: random(),
    randomOrientation: random() * Math.PI * 2
  }));
}

const sites = makeSites();
const clamp01 = value => Math.max(0, Math.min(1, value));
const easeOut = value => 1 - (1 - value) ** 2;

export function init(root) {
  const canvas = root.querySelector('canvas');
  const { ctx, state } = fitCanvas(canvas, draw);
  const out = outs(root);
  const runBtn = root.querySelector('[data-a="run-hypotaxy"]');
  const resetBtn = root.querySelector('[data-a="reset-hypotaxy"]');
  let diameter = 2;
  let time = 0;
  let playing = false;
  let lastFrame = 0;
  let frameId = 0;

  range(root, 'diameter', value => {
    diameter = value;
    update();
    draw();
  });

  runBtn.addEventListener('click', () => {
    if (playing) {
      playing = false;
      cancelAnimationFrame(frameId);
      runBtn.textContent = '▶ 성장 계속';
      lastFrame = 0;
      return;
    }
    if (time >= 1) time = 0;
    playing = true;
    runBtn.textContent = '❚❚ 일시 정지';
    lastFrame = 0;
    frameId = requestAnimationFrame(animate);
  });

  resetBtn.addEventListener('click', () => {
    playing = false;
    cancelAnimationFrame(frameId);
    time = 0;
    lastFrame = 0;
    runBtn.textContent = '▶ 성장 시작';
    update();
    draw();
  });

  function probabilityFor(meanDiameter) {
    // Illustrative saturating response, not a fit to measured nucleation data.
    return 1 - Math.exp(-Math.pow(meanDiameter / 3.1, 2));
  }

  function poreGrowthAt(t) {
    return easeOut(clamp01(t / 0.62));
  }

  function holeDiameterAt(site, t) {
    const finalDiameter = diameter * site.sizeFactor;
    return 0.35 + Math.max(0, finalDiameter - 0.35) * poreGrowthAt(t);
  }

  function nucleationTime(site) {
    return 0.18 + site.nucleationPhase * 0.42;
  }

  function isSelected(site) {
    return site.activation < probabilityFor(diameter);
  }

  function isRandomlyOriented(site) {
    // If a pore has already grown large before a seed appears, registry locking is lost.
    return holeDiameterAt(site, nucleationTime(site)) >= LARGE_PORE_NM;
  }

  function update() {
    const growth = poreGrowthAt(time);
    const currentMean = 0.35 + Math.max(0, diameter - 0.35) * growth;
    const formed = sites.filter(site => isSelected(site) && time >= nucleationTime(site));
    const randomOrientationCount = formed.filter(isRandomlyOriented).length;
    const meanAreaFactor = sites.reduce((sum, site) => sum + site.sizeFactor ** 2, 0) / SITES;
    const poreFraction = Math.PI * currentMean * currentMean * meanAreaFactor / (4 * PORE_SPACING_NM * PORE_SPACING_NM);
    out('diameter', `${diameter.toFixed(1)} nm`);
    out('nuclei', `${formed.length} / ${SITES} <small>(모식)</small>`);
    out('cover', `${((1 - poreFraction) * 100).toFixed(1)}%`);
    out('trend', time === 0
      ? '성장 시작 전'
      : time < 0.15
        ? 'nanopore 성장 중'
        : time < 0.62
          ? `핵 성장 중 · 무작위 배향 ${randomOrientationCount}개`
          : time < 0.96
            ? '삼각형 핵 성장 · 배향 비교'
            : '성장 완료 · 배향 비교');
    out('time', `t = ${(time * DURATION_S).toFixed(1)} s · 평균 구멍 ${currentMean.toFixed(1)} nm`);
  }

  function drawHex(x, y, r) {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const angle = Math.PI / 6 + k * Math.PI / 3;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = '#101722'; ctx.fill();
    ctx.lineWidth = 1.7; ctx.strokeStyle = '#64d8c0'; ctx.stroke();
  }

  function drawTriangle(x, y, r, rotation, alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    for (let k = 0; k < 3; k++) {
      const angle = -Math.PI / 2 + k * (Math.PI * 2 / 3);
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = '#f2b84b'; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = '#fff0bd'; ctx.stroke();
    ctx.restore();
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
    const meanAtTime = 0.35 + Math.max(0, diameter - 0.35) * poreGrowthAt(time);
    ctx.fillText(`t ${(time * DURATION_S).toFixed(1)} s · 평균 ${meanAtTime.toFixed(1)} nm`, 18, 42);
    ctx.fillStyle = '#9daebe'; ctx.font = '10px system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(`목표 ${diameter.toFixed(1)} nm`, w - 18, 23);
    ctx.textAlign = 'left';

    const left = 30, right = w - 30, top = 72, bottom = h - 48;
    const fieldW = right - left, fieldH = bottom - top;
    const baseRadius = Math.min(fieldW / COLS, fieldH / ROWS);
    ctx.fillStyle = '#263748'; ctx.fillRect(17, 54, w - 34, h - 84);

    for (const site of sites) {
      const x = left + site.x * fieldW;
      const y = top + site.y * fieldH;
      const poreDiameter = holeDiameterAt(site, time);
      const poreR = Math.max(1.1, Math.min(20, poreDiameter / PORE_SPACING_NM * baseRadius * 0.5));
      drawHex(x, y, poreR);

      const start = nucleationTime(site);
      if (isSelected(site) && time >= start) {
        const growth = easeOut(clamp01((time - start) / 0.34));
        const maxR = Math.min(15, Math.max(8, baseRadius * 0.20));
        const orientation = isRandomlyOriented(site) ? site.randomOrientation : -Math.PI / 2;
        drawTriangle(x, y, Math.max(1, maxR * Math.sqrt(growth)), orientation, 0.98);
      }
    }

    const legendY = h - 15;
    ctx.fillStyle = '#64d8c0'; ctx.beginPath(); ctx.arc(22, legendY - 3, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d6e0e9'; ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('구멍', 32, legendY);
    drawTriangle(78, legendY - 4, 6, -Math.PI / 2);
    ctx.fillText('정렬', 89, legendY);
    drawTriangle(133, legendY - 4, 6, Math.PI / 4);
    ctx.fillText(compact ? '무작위' : '무작위 배향', 144, legendY);
  }

  function animate(timestamp) {
    if (!playing) return;
    if (!lastFrame) lastFrame = timestamp;
    time = Math.min(1, time + Math.min(0.05, (timestamp - lastFrame) / 1000) / DURATION_S);
    lastFrame = timestamp;
    update();
    draw();
    if (time < 1) frameId = requestAnimationFrame(animate);
    else {
      playing = false;
      runBtn.textContent = '↻ 다시 재생';
      lastFrame = 0;
    }
  }

  update();
  draw();
}
