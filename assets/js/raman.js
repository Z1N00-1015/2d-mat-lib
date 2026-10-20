// Interactive explorer for user-entered Raman mode positions (not a fitted spectrum).
import { fitCanvas, range, outs, FONT, MONO } from './util.js';

export function init(root) {
  const out = outs(root);
  const canvas = root.querySelector('[data-c="spectrum"]');
  const { ctx, state } = fitCanvas(canvas, draw);
  let e = 385, a = 405;
  range(root, 'e', v => { e = v; update(); });
  range(root, 'a', v => { a = v; update(); });

  function update() {
    out('e', `${e.toFixed(1)} cm⁻¹`);
    out('a', `${a.toFixed(1)} cm⁻¹`);
    out('delta', `${Math.abs(a - e).toFixed(1)} cm⁻¹`);
    draw();
  }

  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const p = { l: 54, r: 18, t: 24, b: 42 };
    const lo = 370, hi = 425;
    const x = v => p.l + (v - lo) / (hi - lo) * (w - p.l - p.r);
    const base = h - p.b;
    ctx.font = `11px ${MONO}`; ctx.fillStyle = '#666873'; ctx.textAlign = 'center';
    for (let v = 370; v <= 420; v += 10) {
      ctx.strokeStyle = '#e2e3e8'; ctx.beginPath(); ctx.moveTo(x(v), p.t); ctx.lineTo(x(v), base); ctx.stroke();
      ctx.fillText(String(v), x(v), base + 18);
    }
    ctx.strokeStyle = '#51535c'; ctx.beginPath(); ctx.moveTo(p.l, base); ctx.lineTo(w - p.r, base); ctx.stroke();
    ctx.fillText('Raman shift (cm⁻¹)', (p.l + w - p.r) / 2, h - 9);
    const peaks = [{ value: e, label: 'E′', color: '#2878d0' }, { value: a, label: 'A₁′', color: '#bc57bf' }];
    for (const peak of peaks) {
      const px = x(peak.value);
      ctx.strokeStyle = peak.color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, base); ctx.lineTo(px, p.t + 28); ctx.stroke();
      ctx.fillStyle = peak.color; ctx.beginPath(); ctx.arc(px, p.t + 28, 4, 0, Math.PI * 2); ctx.fill();
      ctx.font = `600 12px ${FONT}`; ctx.textAlign = px > w - 80 ? 'right' : 'left';
      ctx.fillText(`${peak.label}  ${peak.value.toFixed(1)}`, px + (px > w - 80 ? -6 : 6), p.t + 18);
    }
  }
  update();
}
