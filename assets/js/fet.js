// Short-channel FET: natural length λ, barrier lowering, Id–Vg curves
import { fitCanvas, animate, seg, range, outs, clamp, FONT, MONO } from './util.js';

const MAT = {
  si:   { name: 'Si 박막', eps: 11.7, ts: null, color: '#0071e3' },
  mos2: { name: 'MoS₂ 단층', eps: 7.0, ts: 0.65, color: '#bf5af2' },
  wse2: { name: 'WSe₂ 단층', eps: 7.5, ts: 0.70, color: '#ff375f' },
};
const TOX = 1.0, EPS_OX = 3.9, VT = 0.0259, VD = 0.7;

export function init(root) {
  const out = outs(root);
  const cBand = root.querySelector('[data-c="band"]');
  const cIV = root.querySelector('[data-c="iv"]');
  const B = fitCanvas(cBand, () => drawBand(0));
  const I = fitCanvas(cIV, () => drawIV());
  let mat = 'si', lg = 12, tsSi = 5, vg = 0;
  const tsCtl = range(root, 'ts', v => { tsSi = v; update(); });

  function model(key, Lg = lg) {
    const M = MAT[key];
    const ts = M.ts ?? tsSi;
    const lam = Math.sqrt(M.eps / EPS_OX * ts * TOX);
    const f = Math.exp(-Lg / (2 * lam));
    const denom = 1 - 2 * f;
    const ss = denom > 0.08 ? 60 / denom : 750;
    const dibl = Math.min(800, 800 * f);
    const n = ss / 59.6;
    const vt0 = 0.35 - 0.4 * f;
    return { M, ts, lam, f, ss, dibl, n, vt0 };
  }
  const Id = (m, Vg, Vd) => {
    const vt = m.vt0 - m.dibl / 1000 * Vd;
    const x = (Vg - vt) / (m.n * VT);
    const sp = x > 30 ? x : Math.log1p(Math.exp(x));
    return 1e-12 + 1.2e-3 * m.n * VT * sp * (Vd / (Vd + 0.08));
  };

  function update() {
    const m = model(mat);
    tsCtl.el.disabled = m.M.ts !== null;
    tsCtl.el.style.opacity = m.M.ts !== null ? 0.35 : 1;
    out('lg', `${lg.toFixed(1)} nm`);
    out('ts', `${m.ts.toFixed(2)} nm${m.M.ts !== null ? ' (고정)' : ''}`);
    out('vg', `${vg.toFixed(2)} V`);
    out('lam', `${m.lam.toFixed(2)}<small>nm</small>`);
    out('ratio', (lg / m.lam).toFixed(1));
    out('ss', m.ss >= 750 ? 'SS 발산' : `${m.ss.toFixed(0)}<small>mV/dec</small>`);
    out('dibl', `${m.dibl.toFixed(0)}<small>mV/V</small>`);
    const r = lg / m.lam;
    out('verdict', r > 6
      ? `✅ <b>L<sub>g</sub>/λ = ${r.toFixed(1)}</b> — 게이트가 채널 전위를 충분히 제어합니다. SS가 상온 열이온 방출 한계(ln10·kT/q ≈ 60 mV/dec)에 근접합니다.`
      : r > 3
        ? `⚠️ <b>L<sub>g</sub>/λ = ${r.toFixed(1)}</b> — 단채널 효과가 나타나기 시작합니다. DIBL로 문턱전압이 감소하고 SS가 증가합니다.`
        : `❌ <b>L<sub>g</sub>/λ = ${r.toFixed(1)}</b> — 차단(off) 상태 누설 전류가 커져 스위칭 동작이 어렵습니다. 채널을 더 얇게 하거나 2D 채널 물질을 선택해 보세요.`);
    drawIV();
  }

  function barrier(m, Vg, Vd, x) {
    const L = lg, lam = m.lam;
    const phic = 0.62 - 0.85 * Vg;   // long-channel barrier set by the gate (eV)
    const phis = 0, phid = -Vd;
    const s = Math.sinh(L / lam);
    if (s > 1e12) return phic + (phis - phic) * Math.exp(-x / lam) + (phid - phic) * Math.exp(-(L - x) / lam);
    return phic + (phis - phic) * Math.sinh((L - x) / lam) / s + (phid - phic) * Math.sinh(x / lam) / s;
  }

  // electrons for animation
  const elec = Array.from({ length: 40 }, () => ({ x: Math.random(), y: Math.random(), on: false, v: 0 }));

  function drawBand(t, dt = 0.016) {
    const { ctx } = B, { w, h } = B.state; if (!w) return;
    const m = model(mat);
    ctx.clearRect(0, 0, w, h);
    const S = 8; // source/drain extension (nm)
    const total = lg + 2 * S;
    const X = (x) => 24 + (x + S) / total * (w - 48);
    const Emin = -0.9, Emax = 0.9;
    const Y = (E) => 40 + (Emax - E) / (Emax - Emin) * (h - 80);
    // gate region shading
    ctx.fillStyle = 'rgba(0,113,227,0.07)';
    ctx.fillRect(X(0), 30, X(lg) - X(0), h - 60);
    ctx.fillStyle = '#0071e3'; ctx.fillRect(X(0), 30, X(lg) - X(0), 5);
    ctx.font = `600 12px ${FONT}`; ctx.textAlign = 'center'; ctx.fillStyle = '#6e6e73';
    ctx.fillText('소스', X(-S / 2), h - 12); ctx.fillText('채널 (게이트 영역)', X(lg / 2), h - 12); ctx.fillText('드레인', X(lg + S / 2), h - 12);
    // long-channel reference
    const phic = 0.62 - 0.85 * vg;
    ctx.setLineDash([4, 5]); ctx.strokeStyle = '#86868b'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(X(0), Y(phic)); ctx.lineTo(X(lg), Y(phic)); ctx.stroke(); ctx.setLineDash([]);
    // conduction band profile
    let maxE = -9, maxX = 0;
    ctx.strokeStyle = m.M.color; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(X(-S), Y(0));
    ctx.lineTo(X(0), Y(0));
    for (let i = 0; i <= 200; i++) {
      const x = lg * i / 200, E = barrier(m, vg, VD, x);
      if (E > maxE) { maxE = E; maxX = x; }
      ctx.lineTo(X(x), Y(E));
    }
    ctx.lineTo(X(lg + S), Y(-VD));
    ctx.stroke();
    // fill under
    ctx.lineTo(X(lg + S), h - 30); ctx.lineTo(X(-S), h - 30); ctx.closePath();
    const gr = ctx.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, m.M.color + '30'); gr.addColorStop(1, m.M.color + '00');
    ctx.fillStyle = gr; ctx.fill();
    // Fermi levels
    ctx.strokeStyle = '#30d158'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 3]);
    ctx.beginPath(); ctx.moveTo(X(-S), Y(0.05)); ctx.lineTo(X(0), Y(0.05)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(lg), Y(-VD + 0.05)); ctx.lineTo(X(lg + S), Y(-VD + 0.05)); ctx.stroke(); ctx.setLineDash([]);
    // barrier annotation
    ctx.fillStyle = '#1d1d1f'; ctx.font = `12px ${MONO}`; ctx.textAlign = 'center';
    ctx.fillText(`장벽 높이 ${(Math.max(0, maxE) * 1000).toFixed(0)} meV`, X(maxX), Y(maxE) - 12);
    ctx.fillStyle = '#86868b'; ctx.textAlign = 'left';
    ctx.fillText(`V_d = ${VD} V`, X(lg + S * 0.15), Y(-VD) + 20);
    // electrons hopping over barrier: probability ~ exp(-Eb/kT)
    const pOver = clamp(Math.exp(-Math.max(0, maxE) / 0.06), 0, 1);
    ctx.fillStyle = '#0071e3';
    for (const e of elec) {
      if (!e.on) {
        // sit in source sea
        e.x = -S + Math.random() * S * 0.9;
        if (Math.random() < pOver * 0.08) { e.on = true; e.v = 12 + Math.random() * 10; }
        const yy = Y(0.04) + e.y * 8;
        ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(X(-S + e.y * S * 0.95), yy, 2.6, 0, 7); ctx.fill();
      } else {
        e.x += e.v * dt;
        let E;
        if (e.x < 0) E = 0; else if (e.x > lg) E = -VD; else E = barrier(m, vg, VD, e.x);
        ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(X(e.x), Y(E) - 5, 3.2, 0, 7); ctx.fill();
        if (e.x > lg + S) { e.on = false; }
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawIV() {
    const { ctx } = I, { w, h } = I.state; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pad = { l: 56, r: 18, t: 34, b: 38 };
    const X = (v) => pad.l + v / 0.8 * (w - pad.l - pad.r);
    const Y = (i) => pad.t + (-3 - Math.log10(i)) / 9 * (h - pad.t - pad.b);
    ctx.strokeStyle = '#d2d2d7'; ctx.lineWidth = 1; ctx.font = `11px ${MONO}`; ctx.fillStyle = '#86868b';
    for (let e = -12; e <= -3; e++) {
      const y = Y(Math.pow(10, e));
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      if (e % 3 === 0) { ctx.textAlign = 'right'; ctx.fillText(`1e${e}`, pad.l - 6, y + 4); }
    }
    ctx.textAlign = 'center';
    for (let v = 0; v <= 0.8001; v += 0.2) ctx.fillText(v.toFixed(1), X(v), h - pad.b + 16);
    ctx.fillText('V_g (V)', (pad.l + w - pad.r) / 2, h - 6);
    ctx.save(); ctx.translate(14, (pad.t + h - pad.b) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('I_d (A/µm)', 0, 0); ctx.restore();

    const curve = (m, Vd, color, width, dash = []) => {
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash);
      ctx.beginPath();
      for (let i = 0; i <= 160; i++) {
        const v = 0.8 * i / 160, y = Y(Id(m, v, Vd));
        i ? ctx.lineTo(X(v), y) : ctx.moveTo(X(v), y);
      }
      ctx.stroke(); ctx.setLineDash([]);
    };
    const other = mat === 'si' ? 'mos2' : 'si';
    const mo = model(other);
    curve(mo, VD, '#c7c7cc', 2);
    const m = model(mat);
    curve(m, 0.05, m.M.color, 2, [5, 4]);
    curve(m, VD, m.M.color, 3);
    // marker
    const id = Id(m, vg, VD);
    ctx.fillStyle = m.M.color; ctx.beginPath(); ctx.arc(X(vg), Y(id), 6, 0, 7); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    // legend
    ctx.font = `12px ${FONT}`; ctx.textAlign = 'left';
    const lx = w - pad.r - 190;
    const ly = Y(1e-8);
    ctx.fillStyle = m.M.color; ctx.fillText(`━ ${m.M.name}  V_d = 0.7 V`, lx, ly);
    ctx.fillText(`┅ ${m.M.name}  V_d = 0.05 V`, lx, ly + 16);
    ctx.fillStyle = '#aeaeb2'; ctx.fillText(`━ ${mo.M.name} (비교)`, lx, ly + 32);
    ctx.fillStyle = '#1d1d1f'; ctx.textAlign = 'right'; ctx.font = `12px ${MONO}`;
    ctx.fillText(`I_on/I_off ≈ 10^${Math.log10(Id(m, 0.8, VD) / Id(m, 0, VD)).toFixed(1)}`, w - pad.r - 4, h - pad.b - 10);
  }

  seg(root, 'mat', v => { mat = v; update(); });
  range(root, 'lg', v => { lg = v; update(); });
  range(root, 'vg', v => { vg = v; update(); });
  update();
  animate(root, (t, dt) => drawBand(t, dt));
}
