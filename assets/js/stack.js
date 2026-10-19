// Lab: graphite → van der Waals gaps → exfoliation → monolayer graphene (slider-driven)
import * as THREE from 'three';
import { animate, clamp, outs } from './util.js';

const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const STEPS = [
  ['① 흑연(graphite)', '벌집 격자의 탄소 원자층(그래핀)이 AB 순서로 적층된 층상 결정입니다. 층 내부는 sp² 공유결합, 층 사이는 반데르발스 힘으로 결합합니다.'],
  ['② 층간 거리 0.335 nm', '층 사이 결합 에너지는 층 내부 공유결합보다 두 자릿수가량 작습니다. 이 결합의 이방성 덕분에 층을 분리할 수 있습니다.'],
  ['③ 기계적 박리', '접착 테이프로 위에서부터 한 층씩 떼어냅니다(Novoselov·Geim, 2004). 남은 층 수가 줄어드는 것을 확인하세요.'],
  ['④ 단층 그래핀', '두께 방향으로 양자 구속된 2차원 전자계가 됩니다. 유효 질량이 0인 디랙 페르미온이 나타납니다.'],
];

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
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1, transparent: true });
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.32, 12, 8), mat, pts.length);
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
  const stage = root.querySelector('.stage');
  const out = outs(root);
  const slider = root.querySelector('input[data-k="p"]');
  const playBtn = root.querySelector('[data-a="play"]');
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x07080b, 1);
  stage.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 500);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const d1 = new THREE.DirectionalLight(0xffffff, 1.2); d1.position.set(20, 30, 40); scene.add(d1);
  const p1 = new THREE.PointLight(0x64d2ff, 1500, 0, 1.5); p1.position.set(-30, -10, 30); scene.add(p1);
  const p2 = new THREE.PointLight(0xbf5af2, 1500, 0, 1.5); p2.position.set(30, 10, -10); scene.add(p2);

  const L = 8;
  const world = new THREE.Group();
  scene.add(world);
  const cols = [0x9aa4b2, 0x8e98a8];
  const shiftB = [2.46 / 2, 2.46 * Math.sqrt(3) / 6];
  const layers = [];
  for (let i = 0; i < L; i++) { const g = hexLayer(15, i % 2 ? shiftB : [0, 0], cols[i % 2]); world.add(g); layers.push(g); }
  const topColor = new THREE.Color(0x64d2ff);

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  let target = +slider.value, P = target, playing = false, lastStep = -1;
  slider.addEventListener('input', () => { target = +slider.value; playing = false; playBtn.textContent = '▶ 자동 재생'; });
  playBtn.addEventListener('click', () => {
    playing = !playing;
    if (playing && target >= 0.999) { target = 0; P = 0; }
    playBtn.textContent = playing ? '❚❚ 정지' : '▶ 자동 재생';
  });

  animate(stage, (t, dt) => {
    if (playing) { target = Math.min(1, target + dt * 0.12); slider.value = target; if (target >= 1) { playing = false; playBtn.textContent = '▶ 자동 재생'; } }
    P += (target - P) * 0.12;
    const step = Math.min(3, Math.floor(P * 4 + 1e-4));
    if (step !== lastStep) { out('step', `<b class="t">${STEPS[step][0]}</b>${STEPS[step][1]}`); lastStep = step; }

    const explode = ease(clamp((P - 0.18) / 0.22, 0, 1));
    const spacing = 1.1 + explode * 4.2;
    const peel = clamp((P - 0.5) / 0.28, 0, 1) * (L - 1);
    const mono = ease(clamp((P - 0.76) / 0.2, 0, 1));
    let remaining = L;
    layers.forEach((g, i) => {
      const k = L - 1 - i;            // k = 0 is the bottom layer; the top layer peels first
      const pe = clamp(peel - i, 0, 1);
      const lift = ease(pe) * 70;
      g.position.set(ease(pe) * 25, 0, (k - (L - 1) / 2) * spacing + lift);
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
    world.position.z = mono * ((L - 1) / 2) * spacing;
    world.rotation.z = t * 0.08;
    const n = Math.max(1, remaining);
    out('layers', P < 0.18 ? '∞ (수백만 층)' : `${n} 층`);
    out('thick', P < 0.18 ? '~ mm' : `${(n * 0.335).toFixed(2)} nm`);

    const camAng = 1.05 - mono * 0.55;
    const dist = 80 - mono * 26;
    camera.position.set(0, -Math.sin(camAng) * dist, Math.cos(camAng) * dist * 0.75 + 4);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  });
}
