// Layer and monolayer tensile-strain explorer for representative 2H-MoS2 Raman modes.
import { fitCanvas, range, outs, FONT, MONO } from './util.js';

// Representative 532 nm measurements on SiO2/Si. 4L is treated as the bulk-like plateau.
const LAYERS = [
  { e: 384.6, a: 404.8 },
  { e: 384.1, a: 405.2 },
  { e: 383.5, a: 406.8 },
  { e: 383.0, a: 408.0 },
];
const STRAIN_SHIFT_PER_PERCENT = { e: -2.3, a: -1.0 };

export function init(root) {
  const out = outs(root);
  const canvas = root.querySelector('[data-c="spectrum"]');
  const { ctx, state } = fitCanvas(canvas, draw);
  const layerControl = range(root, 'layers', v => { layers = v; update(); });
  const strainControl = range(root, 'strain', v => { strain = v; update(); });
  let layers = layerControl.get(), strain = strainControl.get();
  let e = 0, a = 0;

  function update() {
    const base = LAYERS[Math.min(layers, LAYERS.length) - 1];
    const activeStrain = layers === 1 ? strain : 0;
    strainControl.el.disabled = layers !== 1;
    e = base.e + activeStrain * STRAIN_SHIFT_PER_PERCENT.e;
    a = base.a + activeStrain * STRAIN_SHIFT_PER_PERCENT.a;
    out('layers', layers >= 4 ? `${layers}층 · 포화 구간` : `${layers}층`);
    out('strain', layers === 1 ? `${strain.toFixed(2)}%` : '비활성 · 단층에서만 적용');
    out('e', `${e.toFixed(1)} cm⁻¹`);
    out('a', `${a.toFixed(1)} cm⁻¹`);
    out('delta', `${(a - e).toFixed(1)} cm⁻¹`);
    out('model-note', layers === 1
      ? '1층 기준값에서 인장 strain을 증가시키면 두 모드가 낮은 Raman shift 쪽으로 이동합니다.'
      : `${layers}층에서는 strain을 적용하지 않습니다. E′는 낮아지고 A₁′는 높아지는 층수 경향이 포화 구간에 접근합니다.`);
    draw();
  }

  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const p = { l: 54, r: 18, t: 34, b: 42 };
    const lo = 375, hi = 420;
    const x = v => p.l + (v - lo) / (hi - lo) * (w - p.l - p.r);
    const baseY = h - p.b;
    ctx.font = `11px ${MONO}`; ctx.fillStyle = '#666873'; ctx.textAlign = 'center';
    for (let v = 375; v <= 420; v += 5) {
      ctx.strokeStyle = '#e2e3e8'; ctx.beginPath(); ctx.moveTo(x(v), p.t); ctx.lineTo(x(v), baseY); ctx.stroke();
      if (v % 10 === 0 || v === 375) ctx.fillText(String(v), x(v), baseY + 18);
    }
    ctx.strokeStyle = '#51535c'; ctx.beginPath(); ctx.moveTo(p.l, baseY); ctx.lineTo(w - p.r, baseY); ctx.stroke();
    ctx.fillText('Raman shift (cm⁻¹)', (p.l + w - p.r) / 2, h - 9);

    const peaks = [
      { value: e, label: 'E′', color: '#2878d0' },
      { value: a, label: 'A₁′', color: '#bc57bf' },
    ];
    const sigma = 0.85; // display-only peak width; it is not a fit to an experimental spectrum
    for (const peak of peaks) {
      ctx.beginPath();
      for (let px = p.l; px <= w - p.r; px += 1) {
        const shift = lo + (px - p.l) / (w - p.l - p.r) * (hi - lo);
        const intensity = Math.exp(-0.5 * ((shift - peak.value) / sigma) ** 2);
        const py = baseY - intensity * (h - p.t - p.b - 12);
        px === p.l ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.strokeStyle = peak.color; ctx.lineWidth = 2.2; ctx.stroke();
      const px = x(peak.value);
      ctx.setLineDash([3, 4]); ctx.strokeStyle = peak.color;
      ctx.beginPath(); ctx.moveTo(px, p.t); ctx.lineTo(px, baseY); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = peak.color; ctx.font = `600 12px ${FONT}`;
      ctx.textAlign = px > w - 90 ? 'right' : 'left';
      ctx.fillText(`${peak.label} ${peak.value.toFixed(1)}`, px + (px > w - 90 ? -5 : 5), p.t - 9);
    }
  }
  update();
}
