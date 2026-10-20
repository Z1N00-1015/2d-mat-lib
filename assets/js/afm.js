// A synthetic topography sketch controlled by relative height and roughness settings.
import { fitCanvas, range, outs, FONT, MONO } from './util.js';

export function init(root) {
  const out = outs(root);
  const { ctx, state } = fitCanvas(root.querySelector('[data-c="topography"]'), draw);
  let height = .8, rough = .2;
  range(root, 'height', v => { height = v; update(); });
  range(root, 'rough', v => { rough = v; update(); });
  function update() {
    out('height', `${height.toFixed(1)} nm`);
    out('rough', `${rough.toFixed(2)} nm`);
    out('height-read', `${height.toFixed(1)} nm`);
    draw();
  }
  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f8f9fc'; ctx.fillRect(0, 0, w, h);
    const p = { l: 28, r: 22, t: 24, b: 60 }, mw = w - p.l - p.r, mh = h - p.t - p.b;
    const cols = Math.max(36, Math.floor(mw / 5)), rows = Math.max(20, Math.floor(mh / 5));
    const step = v => v > .48 && v < .83 && height > 0;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const u = i / cols, v = j / rows;
      const island = step(u);
      const ripple = rough * (Math.sin(i * .29) * Math.cos(j * .23) + .35 * Math.sin((i + j) * .11));
      const z = Math.max(0, (island ? height : 0) + ripple);
      const t = Math.max(0, Math.min(1, z / 2.6));
      const r = Math.round(35 + t * 185), g = Math.round(118 + t * 42), b = Math.round(190 - t * 95);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(p.l + i * mw / cols, p.t + j * mh / rows, mw / cols + 1, mh / rows + 1);
    }
    const edgeX1 = p.l + mw * .48, edgeX2 = p.l + mw * .83;
    ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(edgeX1, p.t); ctx.lineTo(edgeX1, p.t + mh); ctx.moveTo(edgeX2, p.t); ctx.lineTo(edgeX2, p.t + mh); ctx.stroke();
    // Draw a schematic line profile below the height map.
    const py = h - 36, amp = 14, mid = p.l + mw * .5;
    ctx.strokeStyle = '#454852'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.l, py + 8); ctx.lineTo(p.l + mw, py + 8); ctx.stroke();
    ctx.strokeStyle = '#bc57bf'; ctx.lineWidth = 2; ctx.beginPath();
    for (let i = 0; i <= mw; i += 2) {
      const u = i / mw, island = step(u), ripple = rough * (Math.sin(i * .045) + .35 * Math.cos(i * .08));
      const z = (island ? height : 0) + ripple;
      const y = py + (island ? -amp : 0) - z * 7;
      i ? ctx.lineTo(p.l + i, y) : ctx.moveTo(p.l + i, y);
    }
    ctx.stroke();
    ctx.font = `11px ${MONO}`; ctx.fillStyle = '#5e606a'; ctx.textAlign = 'left'; ctx.fillText('기판', p.l + 8, p.t + mh - 8);
    ctx.fillText('플레이크', mid + 8, p.t + 18);
    ctx.textAlign = 'right'; ctx.fillText('개념적 단면', w - 8, h - 10);
    ctx.textAlign = 'left'; ctx.font = `12px ${FONT}`;
  }
  update();
}
