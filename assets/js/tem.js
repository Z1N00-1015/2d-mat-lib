// Conceptual lattice sketches comparing common TEM image modes; not an image simulation.
import { fitCanvas, seg, range, outs, FONT } from './util.js';

const MODES = {
  hrtem: 'HRTEM은 통과파와 회절파의 간섭으로 격자 대비를 만듭니다. 실제 위상 대비는 초점·두께·수차에 따라 달라집니다.',
  df: 'DF-TEM은 선택한 회절 빔을 이용해 해당 반사 조건을 만족하는 영역을 강조합니다.',
  stem: 'STEM은 탐침을 주사하며 신호를 모읍니다. 여기서는 HAADF의 원자 번호 민감 대비를 색으로 단순화했습니다.',
};

export function init(root) {
  const out = outs(root);
  const { ctx, state } = fitCanvas(root.querySelector('[data-c="image"]'), draw);
  let mode = 'hrtem', defect = 12;
  seg(root, 'mode', v => { mode = v; update(); });
  range(root, 'defect', v => { defect = v; update(); });

  function hash(i, j) {
    const n = Math.sin((i + 1) * 127.1 + (j + 1) * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }
  function update() {
    out('defect', `${defect}%`);
    out('description', MODES[mode]);
    out('hud', mode === 'hrtem' ? '격자 위상 대비 · 개념도' : mode === 'df' ? '선택 회절 조건 · 개념도' : '원자 번호 민감 대비 · 개념도');
    draw();
  }
  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f7f8fb'; ctx.fillRect(0, 0, w, h);
    const spacing = Math.max(25, Math.min(40, w / 17));
    const cols = Math.ceil(w / spacing) + 1, rows = Math.ceil(h / spacing) + 1;
    if (mode === 'df') {
      ctx.fillStyle = 'rgba(84, 106, 214, .14)'; ctx.fillRect(w * .08, h * .12, w * .40, h * .76);
      ctx.fillStyle = 'rgba(198, 85, 173, .12)'; ctx.fillRect(w * .52, h * .12, w * .40, h * .76);
      ctx.strokeStyle = 'rgba(84, 106, 214, .72)'; ctx.lineWidth = 2; ctx.strokeRect(w * .08, h * .12, w * .40, h * .76);
      ctx.strokeStyle = 'rgba(198, 85, 173, .72)'; ctx.strokeRect(w * .52, h * .12, w * .40, h * .76);
    }
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const px = 16 + i * spacing, py = 18 + j * spacing;
      if (px > w - 10 || py > h - 10) continue;
      const vacancy = hash(i, j) < defect / 100;
      let alpha = .78;
      if (mode === 'df') alpha = px < w * .48 ? .92 : .14;
      if (vacancy) {
        ctx.strokeStyle = '#d94d55'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px - 5, py - 5); ctx.lineTo(px + 5, py + 5); ctx.moveTo(px + 5, py - 5); ctx.lineTo(px - 5, py + 5); ctx.stroke();
        continue;
      }
      if (mode === 'stem') {
        const heavy = (i + j) % 3 === 0;
        ctx.fillStyle = heavy ? `rgba(82, 73, 185, ${alpha})` : `rgba(32, 150, 173, ${alpha})`;
        ctx.beginPath(); ctx.arc(px, py, heavy ? 7 : 4.5, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillStyle = mode === 'df' ? (px < w * .48 ? '#536ad6' : '#bd55a3') : '#4c607d';
        ctx.globalAlpha = alpha;
        ctx.beginPath(); ctx.arc(px, py, mode === 'df' ? 4.5 : 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    if (mode === 'stem') {
      ctx.font = `12px ${FONT}`; ctx.fillStyle = '#5145b5'; ctx.fillText('큰 점: 무거운 원자 예시', 14, h - 14);
      ctx.fillStyle = '#16869a'; ctx.fillText('작은 점: 가벼운 원자 예시', Math.min(w * .52, 210), h - 14);
    }
  }
  update();
}
