// Hero: a rippling graphene sheet in 3D
import * as THREE from 'three';
import { animate } from './util.js';

export function init(root) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);
  root.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.018);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 400);

  // Honeycomb lattice (a = 2.46 Å scaled to world units)
  const a = 2.46, nx = 46, ny = 40;
  const a1 = new THREE.Vector2(a, 0), a2 = new THREE.Vector2(a / 2, a * Math.sqrt(3) / 2);
  const basis = [new THREE.Vector2(0, 0), new THREE.Vector2((a1.x + a2.x) / 3, (a1.y + a2.y) / 3)];
  const pos = [];
  const index = new Map();
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) for (let s = 0; s < 2; s++) {
    // shear correction so the patch is rectangular
    const ii = i - Math.floor(j / 2);
    const x = ii * a1.x + j * a2.x + basis[s].x;
    const y = ii * a1.y + j * a2.y + basis[s].y;
    index.set(`${ii},${j},${s}`, pos.length);
    pos.push([x, y]);
  }
  // center
  let cx = 0, cy = 0; pos.forEach(p => { cx += p[0]; cy += p[1]; }); cx /= pos.length; cy /= pos.length;
  pos.forEach(p => { p[0] -= cx; p[1] -= cy; });

  // bonds: each A atom (s=0) bonds to B at same cell, (ii-1,j) and (ii,j-1)
  const bonds = [];
  for (const [key, idx] of index) {
    const [ii, j, s] = key.split(',').map(Number);
    if (s !== 0) continue;
    for (const [di, dj] of [[0, 0], [-1, 0], [0, -1]]) {
      const k = index.get(`${ii + di},${j + dj},1`);
      if (k !== undefined) bonds.push([idx, k]);
    }
  }

  const N = pos.length;
  const sphere = new THREE.SphereGeometry(0.34, 14, 10);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.1 });
  const atoms = new THREE.InstancedMesh(sphere, mat, N);
  atoms.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(atoms);

  const bondGeo = new THREE.BufferGeometry();
  const bpos = new Float32Array(bonds.length * 6);
  const bcol = new Float32Array(bonds.length * 6);
  bondGeo.setAttribute('position', new THREE.BufferAttribute(bpos, 3).setUsage(THREE.DynamicDrawUsage));
  bondGeo.setAttribute('color', new THREE.BufferAttribute(bcol, 3).setUsage(THREE.DynamicDrawUsage));
  const lines = new THREE.LineSegments(bondGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55 }));
  scene.add(lines);

  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const l1 = new THREE.PointLight(0x64d2ff, 900, 0, 1.6); l1.position.set(-30, 20, 30); scene.add(l1);
  const l2 = new THREE.PointLight(0xbf5af2, 900, 0, 1.6); l2.position.set(30, -10, 25); scene.add(l2);
  const l3 = new THREE.DirectionalLight(0xffffff, 0.6); l3.position.set(0, 0, 50); scene.add(l3);

  const z = new Float32Array(N);
  const m = new THREE.Matrix4();
  const c = new THREE.Color();
  const cA = new THREE.Color(0x2997ff), cB = new THREE.Color(0xbf5af2), cC = new THREE.Color(0xff375f);
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  root.addEventListener('pointermove', (e) => {
    const r = root.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) / r.width - 0.5;
    mouse.ty = (e.clientY - r.top) / r.height - 0.5;
  });

  function resize() {
    const w = root.clientWidth, h = root.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(root);
  resize();

  animate(root, (t) => {
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    const sy = Math.min(1, scrollY / innerHeight);
    for (let i = 0; i < N; i++) {
      const [x, y] = pos[i];
      const r = Math.hypot(x, y);
      z[i] = 1.6 * Math.sin(0.11 * x + t * 0.9) * Math.cos(0.09 * y - t * 0.6)
           + 1.1 * Math.sin(0.22 * r - t * 1.6) * Math.exp(-r / 45);
      m.makeTranslation(x, y, z[i]);
      atoms.setMatrixAt(i, m);
      const k = (z[i] + 2.7) / 5.4;
      if (k < 0.5) c.copy(cA).lerp(cB, k * 2); else c.copy(cB).lerp(cC, (k - 0.5) * 2);
      atoms.setColorAt(i, c);
    }
    atoms.instanceMatrix.needsUpdate = true;
    atoms.instanceColor.needsUpdate = true;
    for (let b = 0; b < bonds.length; b++) {
      const [p, q] = bonds[b];
      bpos.set([pos[p][0], pos[p][1], z[p], pos[q][0], pos[q][1], z[q]], b * 6);
      const k = (z[p] + 2.7) / 5.4;
      const v = 0.35 + 0.5 * k;
      bcol.set([v * 0.5, v * 0.75, v, v * 0.5, v * 0.75, v], b * 6);
    }
    bondGeo.attributes.position.needsUpdate = true;
    bondGeo.attributes.color.needsUpdate = true;

    const ang = -0.95 + mouse.y * 0.25 + sy * 0.3;
    const dist = 62 - sy * 18;
    camera.position.set(mouse.x * 18, Math.sin(ang) * dist, Math.cos(ang) * dist * 0.62);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 4, 0);
    scene.rotation.z = t * 0.03;
    renderer.render(scene, camera);
  });
}
