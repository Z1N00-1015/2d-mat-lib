import { fitCanvas, range, seg, outs } from './util.js';

// Qualitative teaching model based on the reported camera-length series and DF-TEM images.
export function init(root) {
  const canvas = root.querySelector('canvas');
  let mode = 'adf', camera = 285, period = 9.5, spot = 'g1';
  const out = outs(root);
  const { ctx, state } = fitCanvas(canvas, draw);
  const cameraPanel = root.querySelector('[data-o="camera-panel"]');
  const spotPanel = root.querySelector('.seg[data-k="spot"]');

  seg(root, 'mode', value => { mode = value; update(); });
  seg(root, 'camera', value => { camera = +value; update(); });
  seg(root, 'spot', value => { spot = value; update(); });
  range(root, 'period', value => { period = value; update(); });

  function contrast() {
    // Ordinal approximation of the paper's reported visibility at four camera lengths.
    return ({ 115: 0.16, 185: 0.25, 285: 0.92, 360: 0.38 })[camera] || 0.2;
  }

  function update() {
    const isAdf = mode === 'adf';
    cameraPanel.hidden = !isAdf;
    spotPanel.hidden = isAdf;
    root.querySelector('[data-o="badge"]').textContent = isAdf ? 'ADF-STEM · 대비 모식도' : 'DF-TEM · 선택 반사 모식도';
    out('camera', String(camera));
    out('period', `${period.toFixed(1)} nm`);
    out('visibility-key', isAdf ? '논문에서 보고한 모아레 대비' : '선택 반사');
    out('visibility', isAdf ? ({ 115: '매우 약함', 185: '약함', 285: '뚜렷함', 360: '억제됨' })[camera] : (spot === 'all' ? '세 방향 합성' : spot.toUpperCase()));
    out('message', isAdf
      ? `<span class="t">${camera} mm · ${({ 115: '약한 Bragg 신호', 185: '아직 약한 Bragg 신호', 285: '모아레 대비가 가장 뚜렷한 조건', 360: '저각 산란이 우세한 조건' })[camera]}</span><p>카메라 길이는 ADF 검출 각도 범위를 바꿉니다. 시료의 모아레 주기 ${period.toFixed(1)} nm는 그대로입니다.</p>`
      : `<span class="t">${spot === 'all' ? '세 개 1차 회절점 합성' : `SAED의 ${spot.toUpperCase()} 선택`}</span><p>DF-TEM은 선택한 회절 빔의 위상·회절 조건에 민감한 실공간 fringe를 보여줍니다. 대비는 원소 조성 지도가 아닙니다.</p>`);
    out('caption', isAdf
      ? '육방 모아레 초격자의 ADF-STEM 대비를 단순화한 그림입니다. 카메라 길이별 신호 변화는 논문에 보고된 네 조건을 바탕으로 합니다.'
      : '선택한 회절점에 대응하는 1차원 모아레 fringe를 그렸습니다. 중앙부의 국소 굽힘은 논문에서 관찰한 변형을 설명하기 위한 정성적 모식입니다.');
    out('hud', isAdf ? `MoS₂/WSe₂ · ${camera} mm<br>P = ${period.toFixed(1)} nm` : `MoS₂/WSe₂ · DF-TEM<br>P = ${period.toFixed(1)} nm`);
    draw();
  }

  function noiseBackground(w, h) {
    ctx.fillStyle = '#080b10'; ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) {
      const n = 14 + ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1 + 1) % 1 * 28;
      ctx.fillStyle = `rgba(190,205,220,${n / 600})`;
      ctx.fillRect(x, y, 3, 3);
    }
  }

  function drawAdf(w, h) {
    noiseBackground(w, h);
    const pxPerNm = Math.min(w / 32, h / 24);
    const pitch = period * pxPerNm;
    const level = contrast();
    const cx = w / 2, cy = h / 2;
    const iy0 = Math.floor(-cy / (pitch * Math.sqrt(3) / 2)) - 1;
    const iy1 = Math.ceil(cy / (pitch * Math.sqrt(3) / 2)) + 1;
    const ix0 = Math.floor(-cx / pitch) - 2, ix1 = Math.ceil(cx / pitch) + 2;
    for (let j = iy0; j <= iy1; j++) for (let i = ix0; i <= ix1; i++) {
      const x = cx + (i + j * 0.5) * pitch;
      const y = cy + j * pitch * Math.sqrt(3) / 2;
      const glow = ctx.createRadialGradient(x, y, 1, x, y, pitch * 0.34);
      glow.addColorStop(0, `rgba(232,241,250,${0.06 + level * 0.5})`);
      glow.addColorStop(1, 'rgba(100,178,224,0)');
      ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, pitch * 0.34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(242,247,250,${0.12 + level * 0.7})`;
      ctx.beginPath(); ctx.arc(x, y, 2.1 + level * 2.7, 0, Math.PI * 2); ctx.fill();
    }
    if (camera === 360) {
      const haze = ctx.createRadialGradient(cx, cy, pitch * 0.4, cx, cy, Math.max(w, h) * 0.7);
      haze.addColorStop(0, 'rgba(180,190,205,.16)'); haze.addColorStop(1, 'rgba(180,190,205,0)');
      ctx.fillStyle = haze; ctx.fillRect(0, 0, w, h);
    }
    scaleBar(pitch, w, h);
  }

  function drawDf(w, h) {
    noiseBackground(w, h);
    const pxPerNm = Math.min(w / 32, h / 24);
    const pitch = period * pxPerNm;
    const theta = ({ g1: 0, g2: Math.PI / 3, g3: 2 * Math.PI / 3, all: 0 })[spot];
    const cx = w * 0.52, cy = h * 0.52;
    const dirs = spot === 'all' ? [0, Math.PI / 3, 2 * Math.PI / 3] : [theta];
    dirs.forEach((angle, k) => {
      const nx = Math.cos(angle), ny = Math.sin(angle);
      const tx = -ny, ty = nx;
      const color = spot === 'all' ? ['100,210,255', '255,183,86', '206,174,255'][k] : '224,236,245';
      ctx.strokeStyle = `rgba(${color},${spot === 'all' ? 0.48 : 0.78})`;
      ctx.lineWidth = spot === 'all' ? 2 : 3;
      for (let n = -12; n <= 12; n++) {
        ctx.beginPath();
        let started = false;
        for (let t = -h * 0.75; t <= h * 0.75; t += 3) {
          const local = Math.exp(-(t * t) / (2 * (h * 0.2) ** 2));
          const bend = (spot === 'all' ? 0.12 : 0.27) * pitch * local * Math.sin(t / (pitch * 0.75) + n * 0.24);
          const normal = n * pitch + bend;
          const x = cx + nx * normal + tx * t, y = cy + ny * normal + ty * t;
          if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    });
    // Dashed outline indicates a locally distorted central region.
    ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy, pitch * 0.95, pitch * 0.78, -0.25, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    scaleBar(pitch, w, h);
  }

  function scaleBar(pitch, w, h) {
    const x = 22, y = h - 25, len = Math.min(pitch, w * 0.38);
    ctx.strokeStyle = '#fff'; ctx.fillStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y); ctx.stroke();
    ctx.font = '12px sans-serif'; ctx.fillText(`${period.toFixed(1)} nm`, x, y - 7);
  }

  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    mode === 'adf' ? drawAdf(w, h) : drawDf(w, h);
  }

  update();
}
