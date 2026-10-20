// Shared helpers for canvas labs

/** Make a canvas crisp on HiDPI and keep it sized to its CSS box. */
export function fitCanvas(canvas, onResize) {
  const ctx = canvas.getContext('2d');
  const state = { w: 0, h: 0, dpr: 1 };
  let ready = false;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (w === state.w && h === state.h && dpr === state.dpr) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    Object.assign(state, { w, h, dpr });
    if (ready) onResize && onResize(w, h);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();
  // first callback is deferred so callers can finish initialising
  queueMicrotask(() => { ready = true; onResize && state.w && onResize(state.w, state.h); });
  return { ctx, state };
}

/** Run fn(t, dt) every frame only while el is on screen. */
export function animate(el, fn) {
  let visible = false, raf = 0, last = performance.now();
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    fn(now / 1000, dt);
    if (visible) raf = requestAnimationFrame(tick);
  };
  new IntersectionObserver(([e]) => {
    const was = visible; visible = e.isIntersecting;
    if (visible && !was) { last = performance.now(); raf = requestAnimationFrame(tick); }
    if (!visible) cancelAnimationFrame(raf);
  }, { rootMargin: '100px' }).observe(el);
}

/** Segmented control: calls cb(value, button) on change. Returns setter. */
export function seg(root, key, cb) {
  const el = root.querySelector(`.seg[data-k="${key}"]`);
  if (!el) return () => {};
  const set = (v, fire = true) => {
    el.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
    if (fire) cb && cb(v);
  };
  el.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    set(b.dataset.v);
  });
  return set;
}

/** Range input bound to a key; returns {get, set}. */
export function range(root, key, cb) {
  const el = root.querySelector(`input[data-k="${key}"]`);
  el.addEventListener('input', () => cb && cb(+el.value));
  return {
    el,
    get: () => +el.value,
    set: (v, fire = true) => { el.value = v; if (fire) cb && cb(+el.value); },
  };
}

export function toggle(root, key, cb) {
  const el = root.querySelector(`input[data-k="${key}"]`);
  el.addEventListener('change', () => cb && cb(el.checked));
  return { el, get: () => el.checked };
}

/** Output setter: out(root)('name', html) */
export function outs(root) {
  const cache = {};
  return (k, html) => {
    const el = cache[k] || (cache[k] = root.querySelector(`[data-o="${k}"]`));
    if (el && html !== undefined) el.innerHTML = html;
    return el;
  };
}

export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;

/** Scientific notation as HTML: 1.2×10⁻⁵ */
export function sci(x, digits = 2) {
  if (x === 0) return '0';
  if (x >= 1e-2 && x < 1e4) return x.toPrecision(digits + 1);
  const e = Math.floor(Math.log10(x));
  const m = x / Math.pow(10, e);
  return `${m.toFixed(digits - 1)}×10<sup>${e}</sup>`;
}

/** Visible spectrum: wavelength (nm) → [r,g,b] 0..255 (Dan Bruton approximation) */
export function wavelengthToRGB(wl) {
  let r = 0, g = 0, b = 0;
  if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
  else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
  else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
  else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
  else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
  else if (wl >= 645 && wl <= 780) { r = 1; }
  let f = 0;
  if (wl >= 380 && wl < 420) f = 0.3 + 0.7 * (wl - 380) / 40;
  else if (wl >= 420 && wl <= 700) f = 1;
  else if (wl > 700 && wl <= 780) f = 0.3 + 0.7 * (780 - wl) / 80;
  const g8 = (c) => Math.round(255 * Math.pow(c * f, 0.8));
  return [g8(r), g8(g), g8(b)];
}

/** Rounded rect path */
export function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Draw an arrow from (x1,y1) to (x2,y2) */
export function arrow(ctx, x1, y1, x2, y2, color, width = 2, head = 9) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * head * 0.6, y2 - Math.sin(a) * head * 0.6); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(a - 0.4), y2 - head * Math.sin(a - 0.4));
  ctx.lineTo(x2 - head * Math.cos(a + 0.4), y2 - head * Math.sin(a + 0.4));
  ctx.closePath(); ctx.fill();
}

export const FONT = '-apple-system, BlinkMacSystemFont, "Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
export const MONO = '"SF Mono", ui-monospace, Menlo, Consolas, monospace';
