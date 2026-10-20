// Conceptual model of nanopore-mediated, template-aligned hypotaxial nucleation.
import { fitCanvas, range, outs } from './util.js';

const PORE_SPACING_NM = 16;
const COLS = 8;
const ROWS = 4;
const SITES = COLS * ROWS;

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

  function update() {
    // Illustrative saturating response, not a fit to measured nucleation data.
    const probability = 1 - Math.exp(-Math.pow(diameter / 3.1, 2));
    let nuclei = 0;
    for (let i = 0; i < SITES; i++) {
      const threshold = ((i * 37 + 13) % 101) / 101;
      if (threshold < probability) nuclei++;
    }
    const poreFraction = Math.PI * diameter * diameter / (4 * PORE_SPACING_NM * PORE_SPACING_NM);
    out('diameter', `${diameter.toFixed(1)} nm`);
    out('nuclei', `${nuclei} / ${SITES} <small>(모식)</small>`);
    out('cover', `${((1 - poreFraction) * 100).toFixed(1)}%`);
    out('trend', diameter < 1.5
      ? '핵생성 자리 적음'
      : diameter < 3.8
        ? '정렬 핵 증가'
        : '핵 조밀 · 합체 가능성 ↑');
  }

  function drawHex(x, y, r, fill, stroke = '#b7c9d8') {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = -Math.PI / 2 + k * Math.PI / 3;
      const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r;
      if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
    ctx.lineWidth = 1.4; ctx.strokeStyle = stroke; ctx.stroke();
  }

  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#111722'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#dce7f0'; ctx.font = '600 12px system-ui, sans-serif';
    ctx.fillText('GRAPHENE TEMPLATE · TOP VIEW', 18, 23);
    ctx.fillStyle = '#9daebe'; ctx.font = '11px system-ui, sans-serif';
    ctx.fillText(`평균 구멍 직경 ${diameter.toFixed(1)} nm  ·  간격 ${PORE_SPACING_NM} nm 고정`, 18, 42);

    const left = 35, right = w - 35, top = 78, bottom = h - 46;
    const dx = (right - left) / (COLS - 1), dy = (bottom - top) / (ROWS - 1);
    const poreR = Math.max(2.2, Math.min(15, diameter / PORE_SPACING_NM * Math.min(dx, dy) * 0.5));
    const nucleusR = Math.min(12, Math.max(5, poreR * 0.9));
    const probability = 1 - Math.exp(-Math.pow(diameter / 3.1, 2));

    // Graphene template field and a faint hexagonal lattice guide.
    ctx.fillStyle = '#263748'; ctx.fillRect(17, 56, w - 34, h - 86);
    ctx.strokeStyle = 'rgba(160,190,210,.10)'; ctx.lineWidth = 1;
    for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
      const x = left + col * dx, y = top + row * dy;
      ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.stroke();
    }

    let count = 0;
    for (let row = 0; row < ROWS; row++) for (let col = 0; col < COLS; col++) {
      const i = row * COLS + col;
      const x = left + col * dx, y = top + row * dy;
      const threshold = ((i * 37 + 13) % 101) / 101;
      const active = threshold < probability;
      ctx.beginPath(); ctx.arc(x, y, poreR, 0, Math.PI * 2);
      ctx.fillStyle = '#111722'; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = active ? '#64d8c0' : '#8193a5'; ctx.stroke();
      if (active) {
        count++;
        drawHex(x, y, nucleusR, 'rgba(131,111,239,.94)', '#c7bcff');
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();
      }
    }

    const legendY = h - 15;
    ctx.fillStyle = '#64d8c0'; ctx.beginPath(); ctx.arc(22, legendY - 3, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d6e0e9'; ctx.font = '10px system-ui, sans-serif';
    ctx.fillText('나노구멍', 31, legendY);
    drawHex(105, legendY - 3, 6, 'rgba(131,111,239,.94)', '#c7bcff');
    ctx.fillStyle = '#d6e0e9'; ctx.fillText('정렬된 TMD 핵 (개념도)', 116, legendY);
    ctx.fillStyle = '#9daebe'; ctx.textAlign = 'right';
    ctx.fillText(`${count}개 핵 형성 모식`, w - 18, 23); ctx.textAlign = 'left';
  }

  update();
  draw();
}
