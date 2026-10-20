// Quantum tunneling through a gate dielectric (WKB: T ≈ exp(-2κd))
import { fitCanvas, animate, seg, range, outs, clamp, sci, FONT, MONO } from './util.js';

const DIEL = {
  sio2: { name: 'SiO₂', k: 3.9, phi: 3.1, m: 0.5, color: '#ff9f0a', note: 'Si의 열산화막 SiO₂(κ = 3.9). 물리적 두께 약 1.2 nm(원자 약 5층)가 실용적 한계로, 그 이하에서는 직접 터널링(direct tunneling)에 의한 게이트 누설 전류가 급증합니다.' },
  hfo2: { name: 'HfO₂', k: 25, phi: 1.5, m: 0.2, color: '#bf5af2', note: '전도대 오프셋(장벽 높이)은 낮지만 비유전율 κ ≈ 25로, 같은 EOT에서 SiO₂보다 약 6배 두꺼운 막을 쓸 수 있어 터널링 전류가 크게 감소합니다.' },
  hbn:  { name: 'h-BN', k: 3.8, phi: 2.5, m: 0.5, color: '#64d2ff', note: 'h-BN은 고유전율 물질은 아니지만(κ ≈ 3–4), 댕글링 본드(dangling bond)가 없고 원자적으로 평탄해 2D 채널과의 계면 특성이 우수합니다. 다만 얇게 쓰면 터널링 전류가 큽니다.' },
};

export function init(root) {
  const canvas = root.querySelector('canvas');
  const { ctx, state } = fitCanvas(canvas, () => draw(0));
  const out = outs(root);
  let diel = 'sio2', eot = 1.2;

  function calc() {
    const D = DIEL[diel];
    const d = eot * D.k / 3.9;                     // physical thickness, nm
    const kappa = 5.123 * Math.sqrt(D.m * D.phi);  // nm^-1
    const T = Math.exp(-2 * kappa * d);
    return { D, d, kappa, T };
  }

  function update() {
    const { D, d, T } = calc();
    out('eot', `${eot.toFixed(2)} nm`);
    out('phys', `${d.toFixed(2)}<small>nm</small>`);
    out('kappa', D.k);
    out('T', sci(T, 2));
    const pct = clamp((Math.log10(T) + 40) / 40, 0.01, 1) * 100;
    out('bar').style.width = pct + '%';
    out('hud', `장벽 높이(전도대 오프셋) φ<sub>B</sub> = ${D.phi} eV · 터널링 유효 질량 m* = ${D.m} m₀<br>원자층 ≈ ${(d / 0.25).toFixed(0)} 층`);
    root.querySelector('.panel .note:last-child').innerHTML = D.note;
  }

  function draw(t) {
    const { w, h } = state; if (!w) return;
    const { D, d, T } = calc();
    ctx.clearRect(0, 0, w, h);
    // background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0b0b0f'); bg.addColorStop(1, '#000');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    const lead = 3.2;                 // nm shown on each side
    const span = d + 2 * lead;
    const sx = (w - 40) / span;
    const X = (x) => 20 + (x + lead) * sx;
    const yBase = h * 0.66;          // electron energy level
    const yTop = h * 0.2;            // barrier top
    // regions
    ctx.fillStyle = 'rgba(41,151,255,0.07)'; ctx.fillRect(0, 0, X(0), h);
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(X(d), 0, w - X(d), h);
    // barrier
    const g = ctx.createLinearGradient(0, yTop, 0, h);
    g.addColorStop(0, D.color + 'aa'); g.addColorStop(1, D.color + '22');
    ctx.fillStyle = g; ctx.fillRect(X(0), yTop, X(d) - X(0), h - yTop);
    ctx.strokeStyle = D.color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(X(-lead), yBase + 46); ctx.lineTo(X(0), yBase + 46); ctx.lineTo(X(0), yTop); ctx.lineTo(X(d), yTop); ctx.lineTo(X(d), yBase + 46); ctx.lineTo(X(d + lead), yBase + 46); ctx.stroke();
    // energy line
    ctx.setLineDash([4, 6]); ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, yBase); ctx.lineTo(w, yBase); ctx.stroke(); ctx.setLineDash([]);

    // labels
    ctx.font = `600 13px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.textAlign = 'center';
    ctx.fillText('반도체 채널', X(-lead / 2), h - 18);
    ctx.fillText(D.name, (X(0) + X(d)) / 2, h - 18);
    ctx.fillText('게이트', X(d + lead / 2), h - 18);
    ctx.font = `12px ${MONO}`; ctx.fillStyle = D.color;
    ctx.fillText(`d = ${d.toFixed(2)} nm`, (X(0) + X(d)) / 2, yTop - 12);
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.fillText('E', 8, yBase - 6);

    // wavefunction (visual amplitude on log scale for transmitted part)
    const A = h * 0.17;
    const lamE = 2.4; // nm, electron wavelength (illustrative)
    const k = 2 * Math.PI / lamE, om = 5;
    const visT = clamp(1 + Math.log10(Math.sqrt(T)) / 10, 0.03, 1);
    const ph0 = -om * t;
    ctx.lineWidth = 2.5;
    // incident
    ctx.strokeStyle = '#2997ff'; ctx.shadowColor = '#2997ff'; ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let x = -lead; x <= 0; x += 0.02) {
      const y = yBase - A * Math.cos(k * x + ph0);
      x === -lead ? ctx.moveTo(X(x), y) : ctx.lineTo(X(x), y);
    }
    // evanescent decay inside barrier
    const c0 = Math.cos(ph0);
    for (let x = 0; x <= d; x += d / 200) {
      const env = Math.pow(visT, x / d);
      ctx.lineTo(X(x), yBase - A * c0 * env);
    }
    ctx.stroke();
    // transmitted
    ctx.strokeStyle = '#ff375f'; ctx.shadowColor = '#ff375f';
    ctx.beginPath();
    for (let x = d; x <= d + lead; x += 0.02) {
      const y = yBase - A * visT * Math.cos(k * (x - d) + ph0);
      x === d ? ctx.moveTo(X(x), y) : ctx.lineTo(X(x), y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    // envelope inside barrier
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.setLineDash([3, 4]); ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= d; x += d / 100) ctx.lineTo(X(x), yBase - A * Math.pow(visT, x / d));
    ctx.stroke(); ctx.setLineDash([]);

    ctx.font = `12px ${MONO}`; ctx.textAlign = 'right'; ctx.fillStyle = '#ff375f';
    ctx.fillText(`|ψ|² 투과 = ${T.toExponential(1)}`, w - 16, yBase - A - 14);
    ctx.fillStyle = 'rgba(255,255,255,.4)';
    ctx.fillText('(투과파 진폭은 로그 스케일)', w - 16, yBase - A + 2);
  }

  seg(root, 'diel', v => { diel = v; update(); });
  range(root, 'eot', v => { eot = v; update(); });
  update();
  animate(root, draw);
}
