// Scotch-tape exfoliation game with optical contrast on 285 nm SiO2/Si
import { fitCanvas, animate, outs, rrect, FONT, MONO } from './util.js';

const SUB = [139, 114, 201]; // substrate color (285 nm SiO2 looks violet)
const STOPS = [ // [log10(layers), rgb]
  [0, [125, 99, 184]], [0.3, [112, 85, 173]], [0.6, [92, 74, 160]], [0.9, [70, 90, 170]],
  [1.15, [66, 140, 200]], [1.45, [130, 200, 190]], [1.75, [225, 220, 150]], [2.2, [240, 228, 196]], [3, [214, 208, 198]],
];
function flakeColor(n) {
  const x = Math.log10(n);
  for (let i = 1; i < STOPS.length; i++) {
    if (x <= STOPS[i][0]) {
      const [x0, c0] = STOPS[i - 1], [x1, c1] = STOPS[i];
      const t = (x - x0) / (x1 - x0);
      return c0.map((c, k) => Math.round(c + (c1[k] - c) * t));
    }
  }
  return STOPS[STOPS.length - 1][1];
}
const shape = () => { const k = 6 + (Math.random() * 4 | 0); return Array.from({ length: k }, (_, i) => [i / k * Math.PI * 2 + (Math.random() - 0.5) * 0.5, 0.55 + Math.random() * 0.45]); };

export function init(root) {
  const canvas = root.querySelector('canvas');
  const { ctx, state } = fitCanvas(canvas);
  const out = outs(root);
  const tip = out('tip');
  let tape = [], wafer = [], folds = 0, hover = null, foldAnim = 0, pressAnim = 0;

  function layout() {
    const { w, h } = state;
    const narrow = w < 560;
    const T = narrow ? { x: 14, y: 14, w: w - 28, h: h * 0.36 } : { x: 16, y: 16, w: w * 0.4, h: h - 32 };
    const W = narrow ? { x: 14, y: h * 0.36 + 28, w: w - 28, h: h - h * 0.36 - 42 } : { x: w * 0.4 + 32, y: 16, w: w * 0.6 - 48, h: h - 32 };
    return { T, W };
  }

  const act = {
    load() {
      tape = Array.from({ length: 3 }, () => ({ n: 1e5 + Math.random() * 4e5 | 0, x: 0.2 + Math.random() * 0.6, y: 0.2 + Math.random() * 0.6, s: 0.16 + Math.random() * 0.06, sh: shape() }));
      folds = 0; wafer = [];
      out('msg', '좋아요! 이제 테이프를 여러 번 접었다 펴서 흑연을 얇게 만드세요. 10~15번 반복해야 단층이 나올 만큼 얇아집니다.');
      ui();
    },
    fold() {
      if (!tape.length) { out('msg', '먼저 ① 흑연을 테이프에 올리세요.'); return; }
      const next = [];
      for (const f of tape) {
        const r = 0.1 + 0.8 * Math.random();
        const n1 = Math.max(1, Math.round(f.n * r)), n2 = f.n - n1;
        const s = Math.max(0.025, f.s * (0.72 + Math.random() * 0.2));
        next.push({ ...f, n: n1, s, sh: shape() });
        if (n2 > 0) next.push({ n: n2, x: 1 - f.x + (Math.random() - 0.5) * 0.08, y: f.y + (Math.random() - 0.5) * 0.12, s: s * (0.8 + Math.random() * 0.3), sh: shape() });
      }
      next.forEach(f => { f.x = Math.min(0.94, Math.max(0.06, f.x)); f.y = Math.min(0.94, Math.max(0.06, f.y)); });
      // tape can't hold infinitely many: keep a random subset
      while (next.length > 90) next.splice(Math.random() * next.length | 0, 1);
      tape = next; folds++; foldAnim = 1;
      out('msg', folds < 6 ? '조각들이 점점 얇고 작아지고 있습니다. 계속 접어보세요. (흑연 결정은 수십만 층!)' : '이제 ③ 웨이퍼에 눌러 붙여보세요. 압력으로 조각이 갈라지며 일부 층만 웨이퍼에 남습니다.');
      ui();
    },
    press() {
      if (!tape.length) { out('msg', '테이프에 흑연이 없습니다.'); return; }
      const { W } = layout();
      for (const f of tape) {
        if (Math.random() > 0.55) continue;
        const n = Math.max(1, Math.round(f.n * Math.pow(Math.random(), 2)));
        wafer.push({ n, x: 0.08 + Math.random() * 0.84, y: 0.1 + Math.random() * 0.8, s: f.s * (0.5 + Math.random() * 0.5) * 1.6, sh: shape() });
      }
      while (wafer.length > 70) wafer.shift();
      pressAnim = 1;
      const mono = wafer.filter(f => f.n === 1).length;
      out('msg', mono ? `🎉 단층 그래핀 ${mono}개 발견! 기판보다 아주 살짝 어두운 보라색 조각입니다. 마우스를 올려 확인하세요. 노벨상 실험을 재현했습니다.` : '아직 단층은 없네요. 테이프를 더 접거나 다시 눌러보세요. 노란색은 두꺼운 흑연, 파란색은 수 층입니다.');
      ui();
    },
  };
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act[b.dataset.a]()));

  function ui() {
    out('folds', folds);
    out('flakes', tape.length);
    const thin = tape.length ? Math.min(...tape.map(f => f.n)) : null;
    out('thin', thin ? `${thin.toLocaleString()}<small>층</small>` : '—');
    out('mono', wafer.filter(f => f.n === 1).length);
  }

  function poly(x, y, s, sh) {
    ctx.beginPath();
    sh.forEach(([a, r], i) => { const px = x + Math.cos(a) * r * s, py = y + Math.sin(a) * r * s; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
    ctx.closePath();
  }

  function draw(dt) {
    const { w, h } = state; if (!w) return;
    foldAnim = Math.max(0, foldAnim - dt * 2.5); pressAnim = Math.max(0, pressAnim - dt * 1.5);
    ctx.clearRect(0, 0, w, h);
    const { T, W } = layout();
    // tape
    ctx.save();
    const sq = 1 - 0.5 * Math.sin(foldAnim * Math.PI);
    ctx.translate(T.x + T.w / 2, T.y + T.h / 2); ctx.scale(sq, 1); ctx.translate(-(T.x + T.w / 2), -(T.y + T.h / 2));
    rrect(ctx, T.x, T.y, T.w, T.h, 14);
    const tg = ctx.createLinearGradient(T.x, T.y, T.x + T.w, T.y + T.h);
    tg.addColorStop(0, '#fbf6e9'); tg.addColorStop(1, '#efe7d2');
    ctx.fillStyle = tg; ctx.fill(); ctx.strokeStyle = '#e0d6bd'; ctx.stroke();
    ctx.clip();
    for (const f of tape) {
      const d = Math.min(1, Math.log10(f.n) / 3.8);
      const v = Math.round(200 - 170 * d);
      ctx.fillStyle = `rgba(${v},${v},${v + 6},${0.35 + 0.6 * d})`;
      poly(T.x + f.x * T.w, T.y + f.y * T.h, f.s * Math.min(T.w, T.h), f.sh); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = '#86868b'; ctx.font = `600 12px ${FONT}`; ctx.textAlign = 'left';
    ctx.fillText('스카치테이프', T.x + 12, T.y + 22);
    if (!tape.length) { ctx.textAlign = 'center'; ctx.fillStyle = '#aeaeb2'; ctx.fillText('비어 있음', T.x + T.w / 2, T.y + T.h / 2); }
    // wafer (optical microscope view)
    rrect(ctx, W.x, W.y, W.w, W.h, 14);
    const wg = ctx.createRadialGradient(W.x + W.w / 2, W.y + W.h / 2, 0, W.x + W.w / 2, W.y + W.h / 2, Math.max(W.w, W.h) * 0.7);
    wg.addColorStop(0, `rgb(${SUB.join(',')})`); wg.addColorStop(1, 'rgb(98,78,152)');
    ctx.fillStyle = wg; ctx.fill();
    ctx.save(); rrect(ctx, W.x, W.y, W.w, W.h, 14); ctx.clip();
    for (const f of wafer) {
      const [r, g, b] = flakeColor(f.n);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      poly(W.x + f.x * W.w, W.y + f.y * W.h, f.s * Math.min(W.w, W.h), f.sh); ctx.fill();
      if (f === hover) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
      if (f.n === 1) { ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]); }
    }
    if (pressAnim > 0) { ctx.fillStyle = `rgba(255,255,255,${pressAnim * 0.4})`; ctx.fillRect(W.x, W.y, W.w, W.h); }
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = `600 12px ${FONT}`; ctx.textAlign = 'left';
    ctx.fillText('광학 현미경 · SiO₂ (285 nm) / Si', W.x + 12, W.y + 22);
    // scale bar
    ctx.fillStyle = '#fff'; ctx.fillRect(W.x + W.w - 90, W.y + W.h - 24, 60, 3);
    ctx.font = `11px ${MONO}`; ctx.textAlign = 'center'; ctx.fillText('20 µm', W.x + W.w - 60, W.y + W.h - 30);
    // legend
    const lg = [[1, '1층'], [2, '2'], [5, '5'], [12, '~10'], [40, '~40'], [300, '흑연']];
    lg.forEach(([n, t], i) => {
      const x = W.x + 12 + i * 42, y = W.y + W.h - 34;
      const [r, g, b] = flakeColor(n); ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 30, 12); ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.strokeRect(x, y, 30, 12);
      ctx.fillStyle = '#fff'; ctx.font = `10px ${FONT}`; ctx.fillText(t, x + 15, y + 24);
    });
  }

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const { W } = layout();
    hover = null;
    for (let i = wafer.length - 1; i >= 0; i--) {
      const f = wafer[i];
      const cx = W.x + f.x * W.w, cy = W.y + f.y * W.h, s = f.s * Math.min(W.w, W.h);
      if (Math.hypot(mx - cx, my - cy) < s * 0.75) { hover = f; break; }
    }
    if (hover) {
      tip.innerHTML = `<b>${hover.n === 1 ? '단층 그래핀 ✨' : hover.n < 10 ? `${hover.n}층 그래핀` : hover.n < 100 ? `${hover.n}층 (다층)` : `흑연 (${hover.n.toLocaleString()}층)`}</b><br>두께 ≈ ${(hover.n * 0.335).toFixed(hover.n < 10 ? 2 : 0)} nm`;
      tip.style.left = Math.min(mx + 14, state.w - 170) + 'px'; tip.style.top = (my + 10) + 'px'; tip.classList.add('on');
    } else tip.classList.remove('on');
  });
  canvas.addEventListener('pointerleave', () => { hover = null; tip.classList.remove('on'); });
  ui();
  animate(root, (t, dt) => draw(dt));
}
