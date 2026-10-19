// Scroll-driven story: graphite → exfoliation → monolayer graphene
import * as THREE from 'three';
import { animate, clamp } from './util.js';

const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function hexLayer(R, shift, color) {
  const a = 2.46, cc = a / Math.sqrt(3);
  const a1 = [a, 0], a2 = [a / 2, a * Math.sqrt(3) / 2];
  const bas = [[0, 0], [(a1[0] + a2[0]) / 3, (a1[1] + a2[1]) / 3]];
  const pts = [];
  const n = Math.ceil(R / a) + 2;
  for (let i = -n * 2; i <= n * 2; i++) for (let j = -n * 2; j <= n * 2; j++) for (const b of bas) {
    const x = i * a1[0] + j * a2[0] + b[0] + shift[0];
    const y = i * a1[1] + j * a2[1] + b[1] + shift[1];
    if (x * x + y * y < R * R) pts.push([x, y]);
  }
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(0.32, 12, 8);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1, transparent: true });
  const mesh = new THREE.InstancedMesh(geo, mat, pts.length);
  const m = new THREE.Matrix4();
  pts.forEach((p, i) => { m.makeTranslation(p[0], p[1], 0); mesh.setMatrixAt(i, m); });
  g.add(mesh);
  const seg = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1];
    if (dx * dx + dy * dy < (cc * 1.1) ** 2) seg.push(pts[i][0], pts[i][1], 0, pts[j][0], pts[j][1], 0);
  }
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
  const lmat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
  g.add(new THREE.LineSegments(lg, lmat));
  g.userData = { mat, lmat };
  return g;
}

export function init(root) {
  const sticky = root.querySelector('.sticky');
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  sticky.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 500);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const d1 = new THREE.DirectionalLight(0xffffff, 1.2); d1.position.set(20, 30, 40); scene.add(d1);
  const p1 = new THREE.PointLight(0x64d2ff, 1500, 0, 1.5); p1.position.set(-30, -10, 30); scene.add(p1);
  const p2 = new THREE.PointLight(0xbf5af2, 1500, 0, 1.5); p2.position.set(30, 10, -10); scene.add(p2);

  const L = 8;
  const world = new THREE.Group();
  scene.add(world);
  const layers = [];
  const cols = [0x9aa4b2, 0x8e98a8];
  const shiftB = [2.46 / 2, 2.46 * Math.sqrt(3) / 6];
  for (let i = 0; i < L; i++) {
    const g = hexLayer(17, i % 2 ? shiftB : [0, 0], cols[i % 2]);
    world.add(g); layers.push(g);
  }
  const topColor = new THREE.Color(0x64d2ff);

  const steps = [...root.querySelectorAll('.step')];
  const outL = root.querySelector('#stack-layers');
  const outT = root.querySelector('#stack-thick');

  function resize() {
    const w = sticky.clientWidth, h = sticky.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(sticky);
  resize();

  let pSmooth = 0;
  animate(sticky, (t) => {
    const r = root.getBoundingClientRect();
    const p = clamp(-r.top / (root.offsetHeight - innerHeight), 0, 1);
    pSmooth += (p - pSmooth) * 0.12;
    const P = pSmooth;
    const stepIdx = Math.min(3, Math.floor(P * 4 + 0.0001));
    steps.forEach((s, i) => s.classList.toggle('on', i === stepIdx));

    const explode = ease(clamp((P - 0.18) / 0.22, 0, 1));         // 0.18 → 0.40
    const spacing = 1.1 + explode * 4.2;                              // world units
    const peel = clamp((P - 0.5) / 0.28, 0, 1) * (L - 1);             // 0.50 → 0.78
    const mono = ease(clamp((P - 0.76) / 0.2, 0, 1));
    let remaining = L;
    layers.forEach((g, i) => {
      const k = L - 1 - i;              // k=0 bottom ... top layer removed first
      const order = L - 1 - k;          // top layer order 0
      const pe = clamp(peel - order, 0, 1);
      const base = (k - (L - 1) / 2) * spacing;
      const lift = ease(pe) * 70;
      g.position.set(ease(pe) * 25, 0, base + lift);
      g.rotation.set(-ease(pe) * 0.6, ease(pe) * 0.4, 0);
      const op = 1 - pe;
      g.userData.mat.opacity = op; g.userData.lmat.opacity = 0.5 * op;
      g.visible = op > 0.01;
      if (pe >= 0.5) remaining--;
      if (k === 0) {
        g.userData.mat.color.set(cols[0]).lerp(topColor, mono);
        g.userData.lmat.color.set(cols[0]).lerp(topColor, mono);
        g.userData.lmat.opacity = 0.5 + 0.5 * mono;
      }
    });
    // keep the remaining stack centered
    world.position.z = -((L - 1) / 2) * spacing * (peel / (L - 1)) * 0.0 + mono * ((L - 1) / 2) * spacing;
    world.rotation.z = t * 0.08;

    if (P < 0.18) { outL.textContent = '∞'; outT.textContent = '두께 ~ mm (수백만 층)'; }
    else if (P < 0.5) { outL.textContent = '0.335'; outT.textContent = 'nm · 층간 거리'; }
    else { outL.textContent = String(Math.max(1, remaining)); outT.textContent = `두께 ≈ ${(Math.max(1, remaining) * 0.335).toFixed(2)} nm`; }

    const camAng = 1.05 - mono * 0.55;
    const dist = 95 - mono * 30 - explode * 0;
    camera.position.set(0, -Math.sin(camAng) * dist, Math.cos(camAng) * dist * 0.75 + 4);
    camera.up.set(0, 0, 1);
    const xOff = innerWidth > 734 ? -14 : 0;
    camera.lookAt(xOff * (1 - mono * 0.3), 0, 0);
    renderer.render(scene, camera);
  });
}
