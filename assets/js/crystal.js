// Interactive 3D crystal structure viewer
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { animate, seg, range, toggle, outs } from './util.js';
import { STRUCTURES, ELEMENTS, buildCrystal } from './structures.js?v=20261020i';

export function init(root) {
  const stage = root.querySelector('.stage');
  const canvas = stage.querySelector('canvas');
  const out = outs(root);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x050507, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
  camera.up.set(0, 0, 1);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.2;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x202030, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(30, -20, 40); scene.add(key);
  const rim = new THREE.DirectionalLight(0x88aaff, 0.8); rim.position.set(-30, 30, -10); scene.add(rim);

  let group = null;
  const state = { struct: 'graphene', n: 3, layers: 1, cell: true, bonds: true };
  const nCtl = range(root, 'n', v => { state.n = v; rebuild(false); });
  const lCtl = range(root, 'layers', v => { state.layers = v; rebuild(false); });
  toggle(root, 'cell', v => { state.cell = v; if (group) group.userData.cell.visible = v; });
  toggle(root, 'bonds', v => { state.bonds = v; if (group) group.userData.bonds.visible = v; });
  toggle(root, 'spin', v => { controls.autoRotate = v; });

  const sphereGeo = new THREE.SphereGeometry(1, 28, 18);
  const cylGeo = new THREE.CylinderGeometry(1, 1, 1, 12, 1, true);
  cylGeo.rotateX(Math.PI / 2); // align with z

  function dispose(obj) {
    obj.traverse(o => { if (o.material) o.material.dispose(); if (o.geometry && o.geometry !== sphereGeo && o.geometry !== cylGeo) o.geometry.dispose(); });
  }

  function rebuild(resetCam) {
    const S = STRUCTURES[state.struct];
    if (group) { scene.remove(group); dispose(group); }
    group = new THREE.Group();
    const { atoms, bonds } = buildCrystal(state.struct, state.n, state.layers);

    // atoms grouped by element
    const byEl = {};
    atoms.forEach((a, i) => (byEl[a.el] = byEl[a.el] || []).push(i));
    const m = new THREE.Matrix4();
    for (const el in byEl) {
      const E = ELEMENTS[el];
      const mat = new THREE.MeshStandardMaterial({ color: E.color, roughness: 0.28, metalness: 0.05 });
      const mesh = new THREE.InstancedMesh(sphereGeo, mat, byEl[el].length);
      byEl[el].forEach((idx, k) => {
        const p = atoms[idx].p;
        m.makeScale(E.r, E.r, E.r).setPosition(p[0], p[1], p[2]);
        mesh.setMatrixAt(k, m);
      });
      group.add(mesh);
    }

    // bonds: two half-cylinders, each colored by its atom
    const bmesh = new THREE.InstancedMesh(cylGeo, new THREE.MeshStandardMaterial({ roughness: 0.5 }), bonds.length * 2);
    const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), mid = new THREE.Vector3(), dir = new THREE.Vector3();
    const q = new THREE.Quaternion(), zAxis = new THREE.Vector3(0, 0, 1), sc = new THREE.Vector3();
    const col = new THREE.Color();
    let bi = 0;
    for (const [i, j] of bonds) {
      v1.fromArray(atoms[i].p); v2.fromArray(atoms[j].p);
      mid.addVectors(v1, v2).multiplyScalar(0.5);
      for (const [from, el] of [[v1, atoms[i].el], [v2, atoms[j].el]]) {
        dir.subVectors(mid, from);
        const len = dir.length();
        q.setFromUnitVectors(zAxis, dir.clone().normalize());
        sc.set(0.13, 0.13, len);
        const c = from.clone().add(mid).multiplyScalar(0.5);
        m.compose(c, q, sc);
        bmesh.setMatrixAt(bi, m);
        bmesh.setColorAt(bi, col.set(ELEMENTS[el].color).multiplyScalar(0.85));
        bi++;
      }
    }
    bmesh.visible = state.bonds;
    group.add(bmesh);
    group.userData.bonds = bmesh;

    // unit cell outline
    const [A, B, C0] = S.cell;
    const cz = S.layered ? Math.min(state.layers, S.layersPerCell) / S.layersPerCell : 1;
    const C = C0.map(x => x * cz);
    const o = [0, 0, 0];
    const add = (...vs) => vs.reduce((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]], [0, 0, 0]);
    const P = [o, A, B, C, add(A, B), add(A, C), add(B, C), add(A, B, C)];
    const E = [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [1, 5], [3, 5], [2, 6], [3, 6], [4, 7], [5, 7], [6, 7]];
    const lp = [];
    E.forEach(([a, b]) => lp.push(...P[a], ...P[b]));
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
    const cell = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x64d2ff, transparent: true, opacity: 0.9 }));
    // face tint for the cell
    cell.visible = state.cell;
    group.add(cell);
    group.userData.cell = cell;

    // center
    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);
    scene.add(group);
    const radius = box.getSize(new THREE.Vector3()).length() / 2;
    // fit the camera to the structure; keep the current viewing direction unless resetting
    const fit = S.layered && state.layers === 1 ? 0.75 : 1.0;
    const d = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * fit;
    const dirv = (resetCam || !camera.userData.init)
      ? (S.layered ? new THREE.Vector3(0.55, -0.75, 0.55) : new THREE.Vector3(0.75, -0.9, 0.55))
      : camera.position.clone().sub(controls.target);
    camera.position.copy(dirv.normalize().multiplyScalar(d));
    camera.near = d / 100; camera.far = d * 10; camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    camera.userData.init = true;

    // UI
    out('name', S.name);
    out('kind', S.kind);
    out('desc', S.desc);
    out('props', S.props.map(([k, v]) => `<div><div class="k">${k}</div><div class="v" style="font-size:16px">${v}</div></div>`).join(''));
    const els = [...new Set(S.basis.map(b => b[0]))];
    out('legend', els.map(e => `<span><i style="background:#${ELEMENTS[e].color.toString(16).padStart(6, '0')}"></i>${e === 'Ci' ? 'C' : e} · ${ELEMENTS[e].name}</span>`).join(''));
    out('hud', `원자 ${atoms.length} · 결합 ${bonds.length}`);
    out('nlabel', S.layered ? '면내 supercell (n × n)' : 'supercell (n × n × n)');
    out('nval', S.layered ? `${state.n} × ${state.n}` : `${state.n} × ${state.n} × ${state.n}`);
    out('lval', `${state.layers} 층`);
    root.querySelector('[data-o="layerwrap"]').style.display = S.layered ? '' : 'none';
  }

  seg(root, 'struct', v => {
    state.struct = v;
    const S = STRUCTURES[v];
    nCtl.el.max = S.layered ? 8 : 4;
    if (state.n > +nCtl.el.max) nCtl.set(+nCtl.el.max, false), state.n = +nCtl.el.max;
    if (!S.layered && state.n > 2) { state.n = 2; nCtl.set(2, false); }
    if (S.layered && state.n < 3) { state.n = 4; nCtl.set(4, false); }
    rebuild(true);
  });

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();
  state.n = 4; nCtl.set(4, false); nCtl.el.max = 8;
  rebuild(true);
  animate(stage, () => { controls.update(); renderer.render(scene, camera); });
}
