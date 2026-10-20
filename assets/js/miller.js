// Miller index explorer: plane families in a cubic unit cell
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { animate, seg, outs } from './util.js';

const LAT = {
  sc: [[0, 0, 0]],
  bcc: [[0, 0, 0], [0.5, 0.5, 0.5]],
  fcc: [[0, 0, 0], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]],
};

function label(text, color) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 128;
  const g = c.getContext('2d');
  g.font = 'bold 72px -apple-system, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = color; g.fillText(text, 64, 64);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false }));
  s.scale.set(0.9, 0.9, 1);
  return s;
}

export function init(root) {
  const stage = root.querySelector('.stage');
  const canvas = stage.querySelector('canvas');
  const out = outs(root);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x050507, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.up.set(0, 0, 1);
  camera.position.set(2 + 9.5, 2 - 12.5, 2 + 7);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.target.set(2, 2, 2);
  controls.autoRotate = true; controls.autoRotateSpeed = 0.8;
  canvas.addEventListener('pointerdown', () => { controls.autoRotate = false; });
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.1));
  const dl = new THREE.DirectionalLight(0xffffff, 1.3); dl.position.set(5, -3, 8); scene.add(dl);

  const A = 4; // world size of the cube
  const world = new THREE.Group(); scene.add(world);
  // cube edges
  const cubeEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(A, A, A)).translate(A / 2, A / 2, A / 2),
    new THREE.LineBasicMaterial({ color: 0x8e8e93 }));
  world.add(cubeEdges);
  // axes
  const axes = [[1, 0, 0, 0xff6b6b, 'x'], [0, 1, 0, 0x30d158, 'y'], [0, 0, 1, 0x2997ff, 'z']];
  for (const [x, y, z, c, t] of axes) {
    const dir = new THREE.Vector3(x, y, z);
    world.add(new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), A + 1.0, c, 0.28, 0.16));
    const l = label(t, '#' + c.toString(16).padStart(6, '0'));
    l.position.copy(dir.multiplyScalar(A + 1.35)); world.add(l);
  }

  let h = 1, k = 1, l = 1, lat = 'fcc';
  let dyn = new THREE.Group(); world.add(dyn);
  const sphere = new THREE.SphereGeometry(1, 24, 16);

  function planePolys() {
    const corners = [];
    for (const x of [0, 1]) for (const y of [0, 1]) for (const z of [0, 1]) corners.push([x, y, z]);
    const edges = [];
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
      const d = corners[i].reduce((s, v, q) => s + Math.abs(v - corners[j][q]), 0);
      if (d === 1) edges.push([corners[i], corners[j]]);
    }
    const f = (p) => h * p[0] + k * p[1] + l * p[2];
    const vals = corners.map(f);
    const lo = Math.ceil(Math.min(...vals)), hi = Math.floor(Math.max(...vals));
    const nrm = new THREE.Vector3(h, k, l).normalize();
    const u = Math.abs(nrm.x) < 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    u.sub(nrm.clone().multiplyScalar(u.dot(nrm))).normalize();
    const v = new THREE.Vector3().crossVectors(nrm, u);
    const polys = [];
    for (let n = lo; n <= hi; n++) {
      const pts = [];
      const push = (p) => { if (!pts.some(q => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 1e-6)) pts.push(p); };
      for (const [p, q] of edges) {
        const fp = f(p) - n, fq = f(q) - n;
        if (Math.abs(fp) < 1e-9) push(p);
        if (Math.abs(fq) < 1e-9) push(q);
        if (fp * fq < -1e-12) { const t = fp / (fp - fq); push(p.map((c, i) => c + t * (q[i] - c))); }
      }
      if (pts.length < 3) continue;
      const c = pts.reduce((s, p) => s.map((x, i) => x + p[i] / pts.length), [0, 0, 0]);
      pts.sort((P, Q) => {
        const dp = new THREE.Vector3(...P).sub(new THREE.Vector3(...c)), dq = new THREE.Vector3(...Q).sub(new THREE.Vector3(...c));
        return Math.atan2(dp.dot(v), dp.dot(u)) - Math.atan2(dq.dot(v), dq.dot(u));
      });
      polys.push({ n, pts });
    }
    return polys;
  }

  function rebuild() {
    world.remove(dyn);
    dyn.traverse(o => { if (o.material) o.material.dispose(); if (o.geometry && o.geometry !== sphere) o.geometry.dispose(); });
    dyn = new THREE.Group(); world.add(dyn);
    const polys = planePolys();
    polys.forEach(({ pts }, idx) => {
      const hue = 0.78 - 0.18 * (polys.length > 1 ? idx / (polys.length - 1) : 0);
      const col = new THREE.Color().setHSL(hue, 0.85, 0.62);
      const pos = [];
      for (let i = 1; i < pts.length - 1; i++) pos.push(...pts[0], ...pts[i], ...pts[i + 1]);
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos.map(x => x * A), 3));
      g.computeVertexNormals();
      dyn.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false })));
      const lp = [];
      pts.forEach((p, i) => lp.push(...p.map(x => x * A), ...pts[(i + 1) % pts.length].map(x => x * A)));
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
      dyn.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: col })));
    });
    // atoms
    const atoms = [];
    for (const b of LAT[lat]) for (let i = 0; i <= 1; i++) for (let j = 0; j <= 1; j++) for (let q = 0; q <= 1; q++) {
      const p = [b[0] + i, b[1] + j, b[2] + q];
      if (p.some(x => x > 1 + 1e-9)) continue;
      if (!atoms.some(a => a.every((x, t) => Math.abs(x - p[t]) < 1e-9))) atoms.push(p);
    }
    let on = 0;
    const mOn = new THREE.MeshStandardMaterial({ color: 0xffd60a, emissive: 0x664400, roughness: 0.3 });
    const mOff = new THREE.MeshStandardMaterial({ color: 0x8e8e93, roughness: 0.4, transparent: true, opacity: 0.55 });
    for (const p of atoms) {
      const f = h * p[0] + k * p[1] + l * p[2];
      const onPlane = Math.abs(f - Math.round(f)) < 1e-9;
      if (onPlane) on++;
      const s = new THREE.Mesh(sphere, onPlane ? mOn : mOff);
      s.scale.setScalar(onPlane ? 0.24 : 0.17);
      s.position.set(...p.map(x => x * A));
      dyn.add(s);
    }
    // UI
    const s2 = h * h + k * k + l * l;
    out('d', `${(1 / Math.sqrt(s2)).toFixed(3)}<small>a</small>`);
    out('atoms', `${on}<small>개 / ${atoms.length}</small>`);
    out('dsi', `d<sub>${fmt()}</sub> = ${(5.431 / Math.sqrt(s2)).toFixed(3)} Å · 단위격자 내 면 ${polys.length}장`);
    root.querySelectorAll('.mstep').forEach(st => {
      const v = { h, k, l }[st.dataset.k];
      const o = st.querySelector('output');
      o.textContent = Math.abs(v); o.classList.toggle('neg', v < 0);
    });
  }
  const fmt = () => [h, k, l].map(v => v < 0 ? `<span style="text-decoration:overline">${-v}</span>` : v).join('');

  root.querySelectorAll('.mstep').forEach(st => st.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const key = st.dataset.k, d = +b.dataset.d;
    const cur = { h, k, l };
    const nv = Math.max(-3, Math.min(3, cur[key] + d));
    cur[key] = nv;
    if (!cur.h && !cur.k && !cur.l) return;
    ({ h, k, l } = cur);
    setPreset(`${h},${k},${l}`, false);
    rebuild();
  }));
  const setPreset = seg(root, 'preset', v => { [h, k, l] = v.split(',').map(Number); rebuild(); });
  seg(root, 'lat', v => { lat = v; rebuild(); });

  function resize() {
    const w = stage.clientWidth, hh = stage.clientHeight;
    renderer.setSize(w, hh, false); camera.aspect = w / hh; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();
  rebuild();
  animate(stage, () => { controls.update(); renderer.render(scene, camera); });
}
