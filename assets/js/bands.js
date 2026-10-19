// Honeycomb tight-binding bands: 3D Dirac cones + high-symmetry path
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { fitCanvas, animate, seg, range, outs, FONT, MONO } from './util.js';

const A = 2.46;                         // lattice constant (Å)
const KX = 4 * Math.PI / (3 * A);       // |ΓK|
const PRESETS = { gr: [2.7, 0], tmd: [1.1, 0.9], hbn: [2.3, 2.9] };

function f2(kx, ky) {
  const p1 = kx * A, p2 = kx * A / 2 + ky * A * Math.sqrt(3) / 2;
  return 3 + 2 * Math.cos(p1) + 2 * Math.cos(p2) + 2 * Math.cos(p1 - p2);
}

export function init(root) {
  const out = outs(root);
  let t = 2.7, D = 0;
  const tCtl = range(root, 't', v => { t = v; update(); });
  const dCtl = range(root, 'D', v => { D = v; update(); });
  seg(root, 'preset', v => { [t, D] = PRESETS[v]; tCtl.set(t, false); dCtl.set(D, false); update(); });

  // ---------- 3D
  const canvas = root.querySelector('[data-c="three"]');
  const stage = canvas.parentElement;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x050507, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.up.set(0, 0, 1);
  camera.position.set(9.5, -11, 7.5);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.autoRotate = true; controls.autoRotateSpeed = 0.7;
  canvas.addEventListener('pointerdown', () => controls.autoRotate = false);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 0.9));
  const dl = new THREE.DirectionalLight(0xffffff, 1.2); dl.position.set(4, -6, 10); scene.add(dl);

  const R = 1.2 * KX, NG = 150, XY = 3 / KX, ZS = 0.42;
  const geo = (sign) => {
    const g = new THREE.PlaneGeometry(2 * R * XY, 2 * R * XY, NG, NG);
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3), 3));
    g.userData.sign = sign;
    return g;
  };
  const gC = geo(1), gV = geo(-1);
  const mat = new THREE.MeshPhongMaterial({ vertexColors: true, side: THREE.DoubleSide, shininess: 70, transparent: true, opacity: 0.95 });
  scene.add(new THREE.Mesh(gC, mat), new THREE.Mesh(gV, mat));
  // BZ hexagon + K points
  const hex = [];
  for (let i = 0; i <= 6; i++) { const a = i * Math.PI / 3; hex.push(KX * XY * Math.cos(a), KX * XY * Math.sin(a), 0); }
  const hg = new THREE.BufferGeometry(); hg.setAttribute('position', new THREE.Float32BufferAttribute(hex, 3));
  scene.add(new THREE.Line(hg, new THREE.LineBasicMaterial({ color: 0xffd60a })));
  const kdots = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd60a }));
    s.position.set(KX * XY * Math.cos(i * Math.PI / 3), KX * XY * Math.sin(i * Math.PI / 3), 0);
    kdots.add(s);
  }
  scene.add(kdots);

  const cC0 = new THREE.Color(0x5e5ce6), cC1 = new THREE.Color(0x64d2ff), cV0 = new THREE.Color(0xff375f), cV1 = new THREE.Color(0xff9f0a);
  const tmp = new THREE.Color();
  function surf() {
    for (const g of [gC, gV]) {
      const pos = g.attributes.position, col = g.attributes.color, s = g.userData.sign;
      for (let i = 0; i < pos.count; i++) {
        const kx = pos.getX(i) / XY, ky = pos.getY(i) / XY;
        const E = s * Math.sqrt(D * D + t * t * Math.max(0, f2(kx, ky)));
        pos.setZ(i, E * ZS);
        const k = Math.min(1, (Math.abs(E) - D) / (3 * t + 1e-6));
        tmp.copy(s > 0 ? cC0 : cV0).lerp(s > 0 ? cC1 : cV1, Math.pow(k, 0.6));
        col.setXYZ(i, tmp.r, tmp.g, tmp.b);
      }
      pos.needsUpdate = true; col.needsUpdate = true;
      g.computeVertexNormals();
    }
  }
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  // ---------- path plot
  const P = fitCanvas(root.querySelector('[data-c="path"]'), () => drawPath());
  const M = [0, 2 * Math.PI / (Math.sqrt(3) * A)], K = [2 * Math.PI / (3 * A), 2 * Math.PI / (Math.sqrt(3) * A)];
  const segs = [[[0, 0], M, 'Γ', 'M'], [M, K, 'M', 'K'], [K, [0, 0], 'K', 'Γ']];
  const segLen = segs.map(([p, q]) => Math.hypot(q[0] - p[0], q[1] - p[1]));
  const totLen = segLen.reduce((a, b) => a + b);

  function drawPath() {
    const { ctx } = P, { w, h } = P.state; if (!w) return;
    ctx.clearRect(0, 0, w, h);
    const pad = { l: 44, r: 16, t: 34, b: 30 };
    const Emax = 10;
    const X = (s) => pad.l + s / totLen * (w - pad.l - pad.r);
    const Y = (E) => pad.t + (Emax - E) / (2 * Emax) * (h - pad.t - pad.b);
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.font = `10px ${MONO}`; ctx.fillStyle = '#86868b'; ctx.textAlign = 'right';
    for (let E = -10; E <= 10; E += 5) { ctx.beginPath(); ctx.moveTo(pad.l, Y(E)); ctx.lineTo(w - pad.r, Y(E)); ctx.stroke(); ctx.fillText(`${E}`, pad.l - 6, Y(E) + 3); }
    ctx.save(); ctx.translate(12, h / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText('E (eV)', 0, 0); ctx.restore();
    let s0 = 0;
    const ptsC = [], ptsV = [];
    segs.forEach(([p, q, a, b], i) => {
      ctx.strokeStyle = 'rgba(255,255,255,.2)'; ctx.beginPath(); ctx.moveTo(X(s0), pad.t); ctx.lineTo(X(s0), h - pad.b); ctx.stroke();
      ctx.fillStyle = a === 'K' ? '#ffd60a' : '#f5f5f7'; ctx.font = `600 13px ${FONT}`; ctx.textAlign = 'center';
      ctx.fillText(a, X(s0), h - 10);
      for (let j = 0; j <= 80; j++) {
        const u = j / 80, kx = p[0] + u * (q[0] - p[0]), ky = p[1] + u * (q[1] - p[1]);
        const E = Math.sqrt(D * D + t * t * Math.max(0, f2(kx, ky)));
        ptsC.push([X(s0 + u * segLen[i]), Y(E)]); ptsV.push([X(s0 + u * segLen[i]), Y(-E)]);
      }
      s0 += segLen[i];
    });
    ctx.fillStyle = '#f5f5f7'; ctx.fillText('Γ', X(totLen), h - 10);
    // filled valence
    ctx.beginPath(); ptsV.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.lineTo(X(totLen), h - pad.b); ctx.lineTo(X(0), h - pad.b); ctx.closePath();
    const gv = ctx.createLinearGradient(0, Y(0), 0, h); gv.addColorStop(0, 'rgba(255,55,95,.35)'); gv.addColorStop(1, 'rgba(255,55,95,0)');
    ctx.fillStyle = gv; ctx.fill();
    for (const [pts, c] of [[ptsC, '#64d2ff'], [ptsV, '#ff375f']]) {
      ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    }
    // Fermi level
    ctx.setLineDash([4, 4]); ctx.strokeStyle = '#30d158'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.l, Y(0)); ctx.lineTo(w - pad.r, Y(0)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#30d158'; ctx.textAlign = 'left'; ctx.font = `11px ${MONO}`; ctx.fillText('E_F', pad.l + 4, Y(0) - 5);
    // gap annotation at K
    const xK = X(segLen[0] + segLen[1]);
    if (D > 0.05) {
      ctx.strokeStyle = '#ffd60a'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(xK + 8, Y(D)); ctx.lineTo(xK + 8, Y(-D)); ctx.stroke();
      ctx.fillStyle = '#ffd60a'; ctx.fillText(`${(2 * D).toFixed(2)} eV`, xK + 14, Y(0) + 16);
    } else {
      const gl = ctx.createRadialGradient(xK, Y(0), 0, xK, Y(0), 16);
      gl.addColorStop(0, 'rgba(255,214,10,.9)'); gl.addColorStop(1, 'rgba(255,214,10,0)');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(xK, Y(0), 16, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffd60a'; ctx.fillText('디랙점', xK + 12, Y(0) + 18);
    }
  }

  function update() {
    out('t', `${t.toFixed(2)} eV`);
    out('D', `${D.toFixed(2)} eV`);
    out('gap', `${(2 * D).toFixed(2)}<small>eV</small>`);
    const vf = 3 * t * 1.42e-10 / (2 * 6.582e-16);
    const mstar = D > 0.01 ? D * 1.602e-19 / (vf * vf * 9.109e-31) : 0;
    out('vf', `${(vf / 1e6).toFixed(2)}<small>×10⁶ m/s</small>${D > 0.01 ? `<div style="font-size:12px;color:#86868b;font-weight:500">유효 질량 m* ≈ ${mstar.toFixed(2)} m₀</div>` : '<div style="font-size:12px;color:#86868b;font-weight:500">유효 질량 0 · 광속의 약 1/300</div>'}`);
    surf(); drawPath();
  }
  update();
  animate(stage, () => { controls.update(); renderer.render(scene, camera); });
}
