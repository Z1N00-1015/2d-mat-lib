// Lab paper database (data/papers.json, exported by lab-paper-library/public_export.py)
// Two entry points: "refs" (related-paper panel under a lab) and "paperdata" (comparison section).
import { fitCanvas, seg, FONT, MONO } from './util.js';

let cache = null;
const load = () => (cache ||= fetch(new URL('../../data/papers.json', import.meta.url), { cache: 'no-store' }).then(r => {
  if (!r.ok) throw new Error(`papers.json ${r.status}`);
  return r.json();
}));
let focusCache = null;
const loadFocus = () => (focusCache ||= fetch(new URL('../../data/paper-focus.json', import.meta.url)).then(r => {
  if (!r.ok) throw new Error(`paper-focus.json ${r.status}`);
  return r.json();
}).catch(() => ({})));

const DEVICE = ['contact_resistance', 'mobility', 'on_off_ratio', 'subthreshold_swing', 'on_current', 'schottky_barrier', 'transconductance'];
const SYNTH = ['growth_temperature', 'growth_time', 'gas_flow', 'precursor', 'synthesis_method', 'pressure', 'ramp_rate', 'substrate'];
const hasKey = (p, keys) => p.values.some(v => keys.includes(v.metric_key));

// Which papers belong under which lab, and which values to highlight there
const TOPICS = {
  fet: { match: p => hasKey(p, DEVICE) || /contact|transistor|electronics/i.test(p.title), keys: DEVICE },
  mos2: { match: p => p.materials.includes('MoS2') || /MoS/i.test(p.title), keys: [...DEVICE, 'growth_temperature', 'raman_shift'] },
  cvd: { match: p => hasKey(p, SYNTH) || /growth|epitax|hypotax|wafer/i.test(p.title), keys: SYNTH },
  crystal: { match: p => /phase|3R|stacking|single-crystal|epitax|hypotax/i.test(p.title), keys: [...SYNTH, 'raman_shift'] },
  xrd: { methodLabel: 'X선 회절(XRD)', methodRe: /\bXRD\b|X-ray diffraction|X ray diffraction|X선 회절|powder diffraction/i },
  raman: { methodLabel: 'Raman 분광법', methodRe: /Raman|라만/i },
  tem: { methodLabel: '전자현미경(TEM·DF-TEM·STEM)', methodRe: /\bTEM\b|HRTEM|HR-TEM|DF-TEM|STEM|SAED|HAADF|전자현미경/i },
  xps: { methodLabel: 'X선 광전자분광법(XPS)', methodRe: /\bXPS\b|X-ray photoelectron|X선 광전자/i },
  afm: { methodLabel: '원자힘현미경(AFM)', methodRe: /\bAFM\b|atomic force microscopy|원자힘현미경/i },
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
const formula = (f) => f.replace(/\d/g, d => SUB[d]);

function fmtNum(x) {
  if (x == null) return '';
  const a = Math.abs(x);
  if (a >= 1e5 || (a > 0 && a < 1e-2)) {
    const e = Math.floor(Math.log10(a)), m = x / 10 ** e;
    return `${Math.abs(m - 1) < 1e-9 ? '' : m.toFixed(1).replace(/\.0$/, '') + '×'}10<sup>${e}</sup>`;
  }
  return (+x.toPrecision(4)).toLocaleString('en-US');
}
const BOUND = { '>': '&gt; ', '<': '&lt; ', '≈': '≈ ' };
function fmtValue(v) {
  if (v.norm_value != null) return `${BOUND[v.bound] || ''}${fmtNum(v.norm_value)}${v.norm_unit ? ' ' + esc(v.norm_unit) : ''}`;
  if (v.value != null) return `${fmtNum(v.value)}${v.unit ? ' ' + esc(v.unit) : ''}`;
  return null;
}
const firstAuthor = (p) => p.authors.length ? `${esc(p.authors[0].split(',')[0])}${p.authors.length > 1 ? ' 외' : ''}` : '저자 정보 없음';

function card(p, keys, focus) {
  const vals = p.values.filter(v => keys.includes(v.metric_key) && fmtValue(v)).slice(0, 4);
  const core = focus[p.id] || [];
  return `<article class="pcard">
    <div class="pmeta">${esc(p.journal || '저널 정보 없음')} · ${p.year || '연도 미상'}${p.research_type.length ? ` · ${esc(p.research_type.join(', '))}` : ''}</div>
    <h4>${esc(p.title)}</h4>
    <div class="pauth">${firstAuthor(p)}</div>
    ${core.length ? `<div class="pchips" aria-label="핵심 소재">${core.map(m => `<span>${formula(esc(m))}</span>`).join('')}</div>` : '<div class="pnone">핵심 소재 미분류</div>'}
    ${vals.length ? `<dl class="pvals">${vals.map(v => `<div><dt>${esc(v.metric_label)}${v.qualifier ? ` <small>${esc(v.qualifier)}</small>` : ''}</dt><dd>${fmtValue(v)}</dd></div>`).join('')}</dl>`
      : `<div class="pnone">${p.has_verified_data ? '이 주제의 검토 완료 수치 없음' : '서지정보만 공개 (수치 검토 전)'}</div>`}
    ${p.url ? `<a class="plink" href="${esc(p.url)}" target="_blank" rel="noopener">${p.doi ? 'DOI ' + esc(p.doi) : '논문 페이지'} ↗</a>` : ''}
  </article>`;
}

function methodCard(p, topic, focus) {
  const values = p.values.filter(v => topic.methodRe.test(v.method || ''));
  // Some exports attach a whole experiment narrative to each metric. Only show
  // numbers when the method field names the technique directly, to avoid
  // presenting unrelated device or synthesis values as characterization data.
  const measurements = values.filter(v => fmtValue(v) && (v.method || '').length <= 80).slice(0, 3);
  const core = focus[p.id] || [];
  const reported = measurements.length
    ? `<dl class="pvals">${measurements.map(v => `<div><dt>${esc(v.metric_label || v.canonical_name || v.name)}${v.evidence?.page ? ` <small>p. ${v.evidence.page}</small>` : ''}</dt><dd>${fmtValue(v)}</dd></div>`).join('')}</dl>`
    : '<div class="pnone">논문 DB에서 이 분석법을 사용한 연구로 분류했습니다. 연결된 수치가 없거나 분석법 전용 값으로 확인되지 않았습니다.</div>';
  return `<article class="pcard">
    <div class="pmeta">${esc(p.journal || '저널 정보 없음')} · ${p.year || '연도 미상'} · ${esc(topic.methodLabel)}</div>
    <h4>${esc(p.title)}</h4>
    <div class="pauth">${firstAuthor(p)}</div>
    ${core.length ? `<div class="pchips" aria-label="핵심 소재">${core.map(m => `<span>${formula(esc(m))}</span>`).join('')}</div>` : ''}
    ${reported}
    ${p.url ? `<a class="plink" href="${esc(p.url)}" target="_blank" rel="noopener">${p.doi ? 'DOI ' + esc(p.doi) : '논문 페이지'} ↗</a>` : ''}
  </article>`;
}

async function initRefs(root) {
  const topic = TOPICS[root.dataset.topic];
  if (!topic) { root.remove(); return; }
  try {
    const [data, focus] = await Promise.all([load(), loadFocus()]);
    const matching = data.papers.filter(topic.methodRe
      ? p => p.values.some(v => topic.methodRe.test(v.method || ''))
      : topic.match);
    const list = topic.methodRe
      ? matching.sort((a, b) => String(b.publication_date || b.year || '').localeCompare(String(a.publication_date || a.year || ''))).slice(0, 3)
      : matching;
    if (!list.length) { root.remove(); return; }
    const rootPath = document.body.dataset.root || '../../';
    const heading = topic.methodRe ? `DB 내 관련 최신 연구 ${list.length}편` : `관련 논문 ${list.length}편`;
    root.innerHTML = `<div class="refs-head"><span class="refs-tag">연구실 논문 DB</span><h4>${heading}</h4><a href="${rootPath}chapters/tools/papers.html">전체 데이터 보기 ›</a></div>
      <div class="refs-row">${list.map(p => topic.methodRe ? methodCard(p, topic, focus) : card(p, topic.keys, focus)).join('')}</div>`;
  } catch (e) {
    root.remove();
    console.warn('[refs]', e);
  }
}

// ---------- comparison section ----------
const CHART_METRICS = ['contact_resistance', 'mobility', 'on_off_ratio', 'subthreshold_swing', 'growth_temperature'];

async function initData(root) {
  let data, focus;
  try { [data, focus] = await Promise.all([load(), loadFocus()]); } catch (e) {
    root.querySelector('[data-o="status"]').textContent = '논문 데이터를 불러오지 못했습니다.';
    return;
  }
  const papers = data.papers;
  const deviceRole = root.querySelector('[data-o="device-role"]');
  const deviceMaterial = root.querySelector('[data-o="device-material"]');
  const deviceQuery = root.querySelector('[data-o="device-query"]');
  const deviceList = root.querySelector('[data-o="device-list"]');
  const deviceStatus = root.querySelector('[data-o="device-status"]');
  const components = papers.flatMap(p => (p.device_components || []).map(component => ({ p, component })));
  const roles = [...new Map(components.map(({ component }) => [component.role, component.role_label || component.role])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1], 'ko'));
  deviceRole.innerHTML = '<option value="">모든 역할</option>' + roles
    .map(([key, label]) => `<option value="${esc(key)}">${esc(label)}</option>`).join('');
  function updateDeviceMaterials() {
    const selectedRole = deviceRole.value;
    const materials = [...new Set(components
      .filter(({ component }) => !selectedRole || component.role === selectedRole)
      .map(({ component }) => component.material).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));
    const selectedMaterial = deviceMaterial.value;
    deviceMaterial.innerHTML = '<option value="">모든 재료</option>' + materials
      .map(material => `<option value="${esc(material)}">${formula(esc(material))}</option>`).join('');
    if (materials.includes(selectedMaterial)) deviceMaterial.value = selectedMaterial;
  }
  function renderDeviceComponents() {
    const selectedRole = deviceRole.value, selectedMaterial = deviceMaterial.value;
    const query = deviceQuery.value.trim().toLocaleLowerCase();
    const shown = components.filter(({ p, component }) =>
      (!selectedRole || component.role === selectedRole)
      && (!selectedMaterial || component.material === selectedMaterial)
      && (!query || [component.role_label, component.role, component.role_name, component.material,
        component.sample, component.notes, pTitle(component), component.thickness_value,
        component.thickness_text, component.thickness_unit, component.length_value,
        component.length_text, component.length_unit, component.width_value,
        component.width_text, component.width_unit, component.evidence?.label, component.evidence?.page, p.title]
        .some(value => String(value ?? '').toLocaleLowerCase().includes(query))));
    deviceStatus.textContent = components.length
      ? `${shown.length}개 구성요소 · 검토 완료 항목만 표시`
      : '아직 공개된 검토 완료 소자 구성요소가 없습니다. 분석실에서 논문을 다시 분석하고 구성요소를 검토·승인하면 이곳에 표시됩니다.';
    deviceList.innerHTML = shown.map(({ p, component }) => {
      const evidence = component.evidence;
      const location = evidence?.label || (evidence?.page ? `PDF p.${evidence.page}` : '근거 위치 미기록');
      const thickness = component.thickness_value != null
        ? `${fmtNum(component.thickness_value)}${component.thickness_unit ? ' ' + esc(component.thickness_unit) : ''}`
        : component.thickness_text ? `${esc(component.thickness_text)}${component.thickness_unit ? ' ' + esc(component.thickness_unit) : ''}` : '';
      const length = component.length_value != null
        ? `${fmtNum(component.length_value)}${component.length_unit ? ' ' + esc(component.length_unit) : ''}`
        : component.length_text ? `${esc(component.length_text)}${component.length_unit ? ' ' + esc(component.length_unit) : ''}` : '';
      const width = component.width_value != null
        ? `${fmtNum(component.width_value)}${component.width_unit ? ' ' + esc(component.width_unit) : ''}`
        : component.width_text ? `${esc(component.width_text)}${component.width_unit ? ' ' + esc(component.width_unit) : ''}` : '';
      const dimensions = [length && `길이 ${length}`, width && `폭/너비 ${width}`, thickness && `두께 ${thickness}`].filter(Boolean).join(' · ');
      return `<article class="pcard device-card">
        <div class="pmeta">${esc(component.role_label || component.role || '구성요소')}</div>
        <h4>${component.material ? formula(esc(component.material)) : '재료 미기록'}</h4>
        <div class="pauth">${esc(p.journal || '저널 정보 없음')} · ${p.year || '연도 미상'}${component.sample ? ` · 시료 ${esc(component.sample)}` : ''}</div>
        ${dimensions ? `<div class="pnone">치수: ${dimensions}</div>` : ''}
        ${component.role_name ? `<div class="pnone">원문 역할: ${esc(component.role_name)}</div>` : ''}
        <div class="pnone">근거: ${esc(location)}</div>
        ${p.url ? `<a class="plink" href="${esc(p.url)}" target="_blank" rel="noopener">논문 보기 ↗</a>` : ''}
      </article>`;
    }).join('');
  }
  deviceRole.addEventListener('change', () => { updateDeviceMaterials(); renderDeviceComponents(); });
  deviceMaterial.addEventListener('change', renderDeviceComponents);
  deviceQuery.addEventListener('input', renderDeviceComponents);
  updateDeviceMaterials();
  renderDeviceComponents();
  const primary = p => focus[p.id] || [];
  const nVals = papers.reduce((s, p) => s + p.values.length, 0);
  const mats = [...new Set(papers.flatMap(primary))].sort((a, b) => a.localeCompare(b));
  const hasUnclassified = papers.some(p => !primary(p).length);
  const years = papers.map(p => p.year).filter(Boolean);
  root.querySelector('[data-o="stats"]').innerHTML = [
    [papers.length, '등록 논문'], [nVals, '검토 완료 수치'], [mats.length, '핵심 소재'],
    [years.length ? `${Math.min(...years)}–${String(Math.max(...years)).slice(2)}` : '—', '출판 연도'],
  ].map(([v, k]) => `<div class="kpi"><div class="v">${v}</div><div class="k">${k}</div></div>`).join('');
  root.querySelector('[data-o="updated"]').textContent = `데이터 기준: ${data.generated_at.slice(0, 10)}`;

  // metric segmented control (only metrics that have numeric values)
  const avail = CHART_METRICS.filter(k => papers.some(p => p.values.some(v => v.metric_key === k && v.norm_value != null)));
  const segEl = root.querySelector('.seg[data-k="metric"]');
  segEl.innerHTML = avail.map((k, i) => `<button data-v="${k}"${i ? '' : ' class="on"'}>${esc(data.metrics[k].label)}</button>`).join('');
  let metric = avail[0];
  let material = '전체';

  const canvas = root.querySelector('canvas');
  const tip = root.querySelector('.tip');
  const { ctx, state } = fitCanvas(canvas, () => draw());
  let points = [], hover = null;

  function rows() {
    const out = [];
    for (const p of papers) {
      const core = primary(p);
      if (material !== '전체' && (material === '미분류' ? core.length > 0 : !core.includes(material))) continue;
      const vals = p.values.filter(v => v.metric_key === metric && v.norm_value != null && v.norm_value > 0
        && (material === '전체' || material === '미분류' || (v.materials || []).includes(material)));
      if (vals.length) out.push({ p, vals });
    }
    return out;
  }

  function draw() {
    const { w, h } = state; if (!w || !metric) return;
    ctx.clearRect(0, 0, w, h);
    const R = rows();
    if (!R.length) {
      ctx.fillStyle = '#6e6e73'; ctx.font = `14px ${FONT}`; ctx.textAlign = 'center';
      ctx.fillText('이 핵심 소재의 검토 완료 수치가 없습니다.', w / 2, h / 2);
      points = [];
      return;
    }
    const all = R.flatMap(r => r.vals.map(v => v.norm_value));
    const lo = Math.min(...all), hi = Math.max(...all);
    const log = hi / lo > 30;
    const pad = { l: Math.min(260, w * 0.36), r: 28, t: 24, b: 44 };
    let a = log ? Math.floor(Math.log10(lo)) : 0;
    let b = log ? Math.ceil(Math.log10(hi)) : hi * 1.12;
    if (log && a === b) { a -= 1; b += 1; }
    const X = (v) => pad.l + (log ? (Math.log10(v) - a) / (b - a) : (v - a) / (b - a)) * (w - pad.l - pad.r);
    const rowH = Math.min(56, (h - pad.t - pad.b) / Math.max(1, R.length));
    // grid + axis
    ctx.font = `11px ${MONO}`; ctx.fillStyle = '#86868b'; ctx.textAlign = 'center';
    ctx.strokeStyle = '#e8e8ed'; ctx.lineWidth = 1;
    const ticks = [];
    if (log) for (let e = a; e <= b; e++) ticks.push([10 ** e, `1e${e}`]);
    else { const step = niceStep(b / 5); for (let t = 0; t <= b; t += step) ticks.push([t, (+t.toPrecision(3)).toLocaleString('en-US')]); }
    const yBot = pad.t + rowH * R.length;
    for (const [t, lab] of ticks) {
      const x = X(t);
      ctx.beginPath(); ctx.moveTo(x, pad.t - 6); ctx.lineTo(x, yBot); ctx.stroke();
      ctx.fillText(lab, x, yBot + 18);
    }
    const unit = data.metrics[metric].unit;
    ctx.fillStyle = '#6e6e73'; ctx.font = `12px ${FONT}`;
    ctx.fillText(`${data.metrics[metric].label}${unit ? ` (${unit})` : ''}${log ? ' · 로그 축' : ''}`, (pad.l + w - pad.r) / 2, yBot + 38);
    // rows
    points = [];
    R.forEach(({ p, vals }, i) => {
      const yc = pad.t + rowH * (i + 0.5);
      ctx.fillStyle = '#1d1d1f'; ctx.textAlign = 'right'; ctx.font = `600 13px ${FONT}`;
      const label = shorten(ctx, `${p.journal || '—'} ${p.year || ''}`, pad.l - 18);
      ctx.fillText(label, pad.l - 16, yc - 2);
      ctx.fillStyle = '#86868b'; ctx.font = `12px ${FONT}`;
      ctx.fillText(shorten(ctx, primary(p).map(formula).join(' · ') || '핵심 소재 미분류', pad.l - 18), pad.l - 16, yc + 14);
      ctx.strokeStyle = '#f2f2f5'; ctx.beginPath(); ctx.moveTo(pad.l, yc); ctx.lineTo(w - pad.r, yc); ctx.stroke();
      vals.forEach((v, j) => {
        const x = X(v.norm_value), y = yc + (vals.length > 1 ? (j - (vals.length - 1) / 2) * 6 : 0);
        points.push({ x, y, p, v });
      });
    });
    for (const pt of points) {
      const on = hover === pt;
      ctx.beginPath(); ctx.arc(pt.x, pt.y, on ? 7 : 5.5, 0, 7);
      ctx.fillStyle = pt.v.bound === '>' || pt.v.bound === '<' ? '#fff' : '#0071e3';
      ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
      ctx.lineWidth = 2; ctx.strokeStyle = '#0071e3';
      ctx.beginPath(); ctx.arc(pt.x, pt.y, on ? 7 : 5.5, 0, 7); ctx.stroke();
    }
  }
  function niceStep(x) { const e = 10 ** Math.floor(Math.log10(x)); return [1, 2, 5, 10].map(m => m * e).find(s => s >= x); }
  function shorten(c, s, max) { if (c.measureText(s).width <= max) return s; while (s.length > 1 && c.measureText(s + '…').width > max) s = s.slice(0, -1); return s + '…'; }

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    let best = null, bd = 14;
    for (const pt of points) { const d = Math.hypot(pt.x - mx, pt.y - my); if (d < bd) { bd = d; best = pt; } }
    if (best !== hover) { hover = best; draw(); }
    if (best) {
      const v = best.v;
      tip.innerHTML = `<b>${fmtValue(v)}</b>${v.qualifier ? ` · ${esc(v.qualifier)}` : ''}<br>${esc(v.name || '')}${v.conditions ? `<br>${esc(v.conditions)}` : ''}${v.sample ? `<br><span style="opacity:.7">${esc(v.sample)}</span>` : ''}<br><span style="opacity:.7">${esc(best.p.journal || '')} ${best.p.year || ''}${v.evidence?.label ? ` · ${esc(v.evidence.label)}` : v.evidence?.page ? ` · p.${v.evidence.page}` : ''}</span>`;
      tip.style.left = Math.min(mx + 14, state.w - 260) + 'px'; tip.style.top = (my + 12) + 'px';
      tip.style.whiteSpace = 'normal'; tip.style.maxWidth = '260px';
      tip.classList.add('on');
    } else tip.classList.remove('on');
  });
  canvas.addEventListener('pointerleave', () => { hover = null; tip.classList.remove('on'); draw(); });
  canvas.addEventListener('click', () => { if (hover?.p.url) window.open(hover.p.url, '_blank', 'noopener'); });
  seg(root, 'metric', v => { metric = v; hover = null; tip.classList.remove('on'); fitHeight(); draw(); renderTable(); });
  // chart height follows the number of papers that report the metric
  function fitHeight() { canvas.parentElement.style.height = `${Math.max(200, rows().length * 56 + 90)}px`; }

  // table view of the selected metric (accessible alternative to the chart)
  function renderTable() {
    const tb = root.querySelector('[data-o="table"]');
    const R = rows().flatMap(({ p, vals }) => vals.map(v => ({ p, v })));
    tb.innerHTML = R.map(({ p, v }) => `<tr><td>${esc(p.journal || '—')} ${p.year || ''}</td><td>${primary(p).map(m => formula(esc(m))).join(', ') || '미분류'}</td><td>${fmtValue(v)}</td><td>${esc(v.conditions || v.qualifier || '—')}</td><td>${esc(v.sample || '—')}</td><td>${v.evidence?.label ? esc(v.evidence.label) : v.evidence?.page ? 'p.' + v.evidence.page : '—'}</td></tr>`).join('');
  }

  // paper list with material filter
  const listEl = root.querySelector('[data-o="list"]');
  const filt = root.querySelector('.seg[data-k="mat"]');
  const choices = ['전체', ...mats, ...(hasUnclassified ? ['미분류'] : [])];
  filt.innerHTML = choices.map((m, i) => `<button data-v="${esc(m)}"${i ? '' : ' class="on"'}>${m === '전체' || m === '미분류' ? m : formula(esc(m))}</button>`).join('');
  const renderList = () => {
    const shown = papers.filter(p => material === '전체' || (material === '미분류' ? !primary(p).length : primary(p).includes(material)));
    listEl.innerHTML = shown.map(p => card(p, [...DEVICE, ...SYNTH, 'raman_shift'], focus)).join('');
  };
  seg(root, 'mat', value => {
    material = value;
    hover = null;
    tip.classList.remove('on');
    renderList();
    fitHeight();
    draw();
    renderTable();
  });
  renderList();
  renderTable();
  fitHeight();
  draw();
}

export function init(root) {
  return root.dataset.module === 'refs' ? initRefs(root) : initData(root);
}
