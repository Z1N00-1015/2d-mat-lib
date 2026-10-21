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
let synthesisFocusCache = null;
const loadSynthesisFocus = () => (synthesisFocusCache ||= fetch(new URL('../../data/paper-synthesis-focus.json', import.meta.url)).then(r => {
  if (!r.ok) throw new Error(`paper-synthesis-focus.json ${r.status}`);
  return r.json();
}).catch(() => ({})));

const DEVICE = ['contact_resistance', 'mobility', 'on_off_ratio', 'subthreshold_swing', 'on_current', 'schottky_barrier', 'transconductance'];
const SYNTH = ['growth_temperature', 'growth_time', 'gas_flow', 'precursor', 'synthesis_method', 'pressure', 'ramp_rate', 'substrate'];
const hasKey = (p, keys) => p.values.some(v => keys.includes(v.metric_key));
const isContactFormationTemp = (p, v) => v.metric_key === 'growth_temperature'
  && /contact|접촉/i.test(p.title + ' ' + (v.method || ''))
  && /증착|deposition/i.test((v.name || '') + ' ' + (v.method || ''));

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

// ---------- paper comparison ----------
const CHART_METRICS = ['mobility', 'on_off_ratio', 'on_current', 'subthreshold_swing', 'contact_resistance', 'growth_temperature'];
const SYNTHESIS_METRICS = ['growth_temperature', 'growth_time', 'gas_flow', 'pressure', 'ramp_rate', 'precursor_film'];

function initSynthesisChart(root, data, synthesisFocus, getMaterial) {
  const controls = root.querySelector('[data-synth-controls]');
  const xSelect = root.querySelector('[data-o="synth-axis-x"]');
  const ySelect = root.querySelector('[data-o="synth-axis-y"]');
  const canvas = root.querySelector('[data-o="synth-canvas"]');
  const tip = root.querySelector('[data-o="synth-tip"]');
  const status = root.querySelector('[data-o="synth-status"]');
  const papers = data.papers || [];
  const metrics = SYNTHESIS_METRICS.filter(key => data.metrics[key]
    && papers.some(p => p.values.some(v => v.metric_key === key && Number.isFinite(+v.norm_value) && +v.norm_value > 0)));
  if (metrics.length < 2) {
    controls.hidden = true;
    status.textContent = '비교할 수 있는 합성 수치가 아직 충분하지 않습니다.';
    return () => {};
  }
  const label = key => data.metrics[key].unit
    ? data.metrics[key].label + ' (' + data.metrics[key].unit + ')'
    : data.metrics[key].label;
  const options = metrics.map(key => '<option value="' + esc(key) + '">' + esc(label(key)) + '</option>').join('');
  xSelect.innerHTML = options;
  ySelect.innerHTML = options;
  xSelect.value = metrics.includes('growth_temperature') ? 'growth_temperature' : metrics[0];
  ySelect.value = metrics.includes('gas_flow') ? 'gas_flow' : metrics.find(key => key !== xSelect.value);
  let xMetric = xSelect.value, yMetric = ySelect.value, points = [], hover = null;
  const { ctx, state } = fitCanvas(canvas, draw);
  const primary = p => synthesisFocus[p.id] || [];

  function pairs() {
    const material = getMaterial();
    const result = [];
    for (const p of papers) {
      const core = primary(p);
      if (material !== '전체' && (material === '미분류' ? core.length : !core.includes(material))) continue;
      const xs = p.values.filter(v => v.metric_key === xMetric && Number.isFinite(+v.norm_value) && +v.norm_value > 0 && !isContactFormationTemp(p, v));
      const ys = p.values.filter(v => v.metric_key === yMetric && Number.isFinite(+v.norm_value) && +v.norm_value > 0 && !isContactFormationTemp(p, v));
      for (const x of xs) for (const y of ys) {
        const xsample = String(x.sample || '').trim(), ysample = String(y.sample || '').trim();
        if ((xsample && ysample && xsample === ysample) || (xs.length === 1 && ys.length === 1)) {
          result.push({ p, x, y, sample: xsample === ysample ? (xsample || '') : [xsample, ysample].filter(Boolean).join(' · ') });
        }
      }
    }
    return result.sort((a, b) => String(b.p.publication_date || b.p.year || '').localeCompare(String(a.p.publication_date || a.p.year || '')));
  }
  function range(values) {
    const low = Math.min(...values), high = Math.max(...values), logarithmic = high / low > 35;
    if (logarithmic) {
      let min = Math.floor(Math.log10(low)), max = Math.ceil(Math.log10(high));
      if (min === max) { min--; max++; }
      return { logarithmic, min, max, map: v => (Math.log10(v) - min) / (max - min) };
    }
    let min = low, max = high;
    if (min === max) { min *= .85; max *= 1.15; }
    else { const pad = (max - min) * .1; min = Math.max(0, min - pad); max += pad; }
    return { logarithmic, min, max, map: v => (v - min) / (max - min) };
  }
  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const values = pairs();
    const box = { left: Math.min(90, Math.max(66, w * .15)), right: w - 22, top: 24, bottom: h - 62 };
    if (!values.length) {
      status.textContent = '0편 · 선택한 조건 조합의 비교 데이터 없음';
      ctx.fillStyle = '#70737d'; ctx.font = '14px ' + FONT; ctx.textAlign = 'center';
      ctx.fillText('같은 시료 또는 논문 단위로 비교할 합성 조건이 없습니다.', w / 2, h / 2);
      points = [];
      return;
    }
    const xv = values.map(v => +v.x.norm_value), yv = values.map(v => +v.y.norm_value);
    const xr = range(xv), yr = range(yv);
    const grid = (axis, vertical, nums) => {
      let ticks = [];
      if (axis.logarithmic) {
        for (let e = Math.ceil(axis.min); e <= Math.floor(axis.max); e++) ticks.push([10 ** e, '10' + (e ? '⁽' + e + '⁾' : '')]);
      } else {
        const step = 10 ** Math.floor(Math.log10((axis.max - axis.min) / 5)) || 1;
        const first = Math.ceil(axis.min / step) * step;
        for (let n = first; n <= axis.max + step * .001; n += step) ticks.push([n, (+n.toPrecision(3)).toLocaleString('en-US')]);
      }
      if (ticks.length < 2) ticks = [[Math.min(...nums), fmtNum(Math.min(...nums))], [Math.max(...nums), fmtNum(Math.max(...nums))]];
      ctx.font = '11px ' + MONO; ctx.fillStyle = '#777b86'; ctx.strokeStyle = 'rgba(120,125,140,.22)'; ctx.lineWidth = 1;
      for (const [n, text] of ticks) {
        const pos = vertical ? box.bottom - axis.map(n) * (box.bottom - box.top) : box.left + axis.map(n) * (box.right - box.left);
        ctx.beginPath();
        if (vertical) { ctx.moveTo(box.left, pos); ctx.lineTo(box.right, pos); }
        else { ctx.moveTo(pos, box.top); ctx.lineTo(pos, box.bottom); }
        ctx.stroke(); ctx.textAlign = vertical ? 'right' : 'center';
        ctx.fillText(text, vertical ? box.left - 9 : pos, vertical ? pos + 4 : box.bottom + 20);
      }
    };
    grid(xr, false, xv); grid(yr, true, yv);
    points = values.map(pair => ({ ...pair,
      px: box.left + xr.map(+pair.x.norm_value) * (box.right - box.left),
      py: box.bottom - yr.map(+pair.y.norm_value) * (box.bottom - box.top),
    }));
    for (const point of points) {
      const active = hover && hover.p === point.p && hover.x === point.x && hover.y === point.y;
      ctx.beginPath(); ctx.arc(point.px, point.py, active ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = active ? '#8e7cff' : '#fff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#7564e8'; ctx.stroke();
    }
    ctx.fillStyle = '#5f626d'; ctx.font = '12px ' + FONT; ctx.textAlign = 'center';
    ctx.fillText(label(xMetric) + (xr.logarithmic ? ' · 로그 축' : ''), (box.left + box.right) / 2, h - 15);
    ctx.save(); ctx.translate(15, (box.top + box.bottom) / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText(label(yMetric) + (yr.logarithmic ? ' · 로그 축' : ''), 0, 0); ctx.restore();
    status.textContent = new Set(values.map(v => v.p.id)).size + '편 · ' + values.length + '개 합성 조건 비교점';
  }
  function renderTable() {
    root.querySelector('[data-o="synth-table"]').innerHTML = pairs().map(point => '<tr><td>'
      + (point.p.url ? '<a href="' + esc(point.p.url) + '" target="_blank" rel="noopener">' + esc(point.p.title) + '</a>' : esc(point.p.title))
      + '<br><small>' + esc(point.p.journal || '') + ' · ' + (point.p.year || '연도 미상') + '</small></td>'
      + '<td>' + (primary(point.p).map(m => formula(esc(m))).join(', ') || '미분류') + '</td>'
      + '<td>' + fmtValue(point.x) + (point.x.qualifier ? '<br><small>' + esc(point.x.qualifier) + '</small>' : '') + '</td>'
      + '<td>' + fmtValue(point.y) + (point.y.qualifier ? '<br><small>' + esc(point.y.qualifier) + '</small>' : '') + '</td>'
      + '<td>' + esc(point.sample || '시료 미기록') + '</td></tr>').join('');
  }
  function changeAxes(changed) {
    xMetric = xSelect.value; yMetric = ySelect.value;
    if (xMetric === yMetric) {
      const alternative = metrics.find(key => key !== xMetric);
      if (changed === 'x') { yMetric = alternative; ySelect.value = alternative; }
      else { xMetric = alternative; xSelect.value = alternative; }
    }
    hover = null; tip.classList.remove('on'); draw(); renderTable();
  }
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * state.w / rect.width, y = (event.clientY - rect.top) * state.h / rect.height;
    let nearest = null, distance = 14;
    for (const point of points) { const d = Math.hypot(point.px - x, point.py - y); if (d < distance) { nearest = point; distance = d; } }
    if (nearest !== hover) { hover = nearest; draw(); }
    if (!nearest) { tip.classList.remove('on'); return; }
    const rectTip = canvas.getBoundingClientRect();
    tip.innerHTML = '<b>' + esc(nearest.p.title) + '</b><br>' + esc(data.metrics[xMetric].label) + ': ' + fmtValue(nearest.x)
      + '<br>' + esc(data.metrics[yMetric].label) + ': ' + fmtValue(nearest.y)
      + (nearest.sample ? '<br>시료: ' + esc(nearest.sample) : '')
      + '<br><span style="opacity:.7">' + esc(nearest.p.journal || '') + ' ' + (nearest.p.year || '') + '</span>';
    tip.style.left = Math.max(8, Math.min(event.clientX - rectTip.left + 12, state.w - 280)) + 'px';
    tip.style.top = Math.max(8, Math.min(event.clientY - rectTip.top + 12, state.h - 130)) + 'px';
    tip.style.maxWidth = '280px'; tip.style.whiteSpace = 'normal'; tip.classList.add('on');
  });
  canvas.addEventListener('pointerleave', () => { hover = null; tip.classList.remove('on'); draw(); });
  canvas.addEventListener('click', () => { if (hover && hover.p.url) window.open(hover.p.url, '_blank', 'noopener'); });
  xSelect.addEventListener('change', () => changeAxes('x'));
  ySelect.addEventListener('change', () => changeAxes('y'));
  draw(); renderTable();
  return () => { hover = null; tip.classList.remove('on'); draw(); renderTable(); };
}

function initMaterialTemperatureChart(root, data, synthesisFocus, getMaterial) {
  const canvas = root.querySelector('[data-o="material-temp-canvas"]');
  const tip = root.querySelector('[data-o="material-temp-tip"]');
  const status = root.querySelector('[data-o="material-temp-status"]');
  const table = root.querySelector('[data-o="material-temp-table"]');
  const papers = data.papers || [];
  let points = [], hover = null;
  const { ctx, state } = fitCanvas(canvas, draw);
  const selected = getMaterial;
  const coreMaterials = p => synthesisFocus[p.id] || [];

  function records() {
    const result = [];
    for (const p of papers) {
      const core = coreMaterials(p);
      if (selected() !== '전체' && (selected() === '미분류' ? core.length : !core.includes(selected()))) continue;
      for (const v of p.values) {
        if (v.metric_key !== 'growth_temperature' || !Number.isFinite(+v.norm_value) || +v.norm_value <= 0) continue;
        // A temperature recorded during contact-metal deposition is not the 2D material growth temperature.
        if (isContactFormationTemp(p, v)) continue;
        result.push({ p, v, material: core.length ? core.join(' · ') : '미분류' });
      }
    }
    return result.sort((a, b) => String(b.p.publication_date || b.p.year || '').localeCompare(String(a.p.publication_date || a.p.year || '')));
  }

  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const values = records();
    const box = { left: Math.min(84, Math.max(66, w * .15)), right: w - 24, top: 28, bottom: h - 78 };
    if (!values.length) {
      status.textContent = '선택한 소재에 검토된 합성 온도 값이 없습니다.';
      ctx.fillStyle = '#70737d'; ctx.font = '14px ' + FONT; ctx.textAlign = 'center';
      ctx.fillText('선택된 소재의 합성 온도 데이터가 없습니다.', w / 2, h / 2);
      points = [];
      return;
    }
    const materials = [...new Set(values.map(v => v.material))].sort((a, b) => a === '미분류' ? 1 : b === '미분류' ? -1 : a.localeCompare(b));
    const ys = values.map(v => +v.v.norm_value);
    const low = Math.min(...ys), high = Math.max(...ys);
    const step = Math.max(50, Math.ceil(((high - low) / 5 || high / 5) / 50) * 50);
    const min = Math.max(0, Math.floor(low / step) * step - step);
    const max = Math.ceil(high / step) * step + step;
    const yAt = value => box.bottom - (value - min) / (max - min || 1) * (box.bottom - box.top);
    ctx.font = '11px ' + MONO; ctx.fillStyle = '#777b86'; ctx.strokeStyle = 'rgba(120,125,140,.22)'; ctx.lineWidth = 1;
    for (let value = min; value <= max + step * .001; value += step) {
      const y = yAt(value);
      ctx.beginPath(); ctx.moveTo(box.left, y); ctx.lineTo(box.right, y); ctx.stroke();
      ctx.textAlign = 'right'; ctx.fillText(String(value), box.left - 9, y + 4);
    }
    const xAt = material => box.left + (materials.indexOf(material) + .5) * (box.right - box.left) / materials.length;
    materials.forEach(material => {
      const x = xAt(material);
      ctx.strokeStyle = 'rgba(120,125,140,.15)'; ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(x, box.top); ctx.lineTo(x, box.bottom); ctx.stroke(); ctx.setLineDash([]);
      ctx.save(); ctx.translate(x, box.bottom + 24); ctx.rotate(materials.length > 4 ? -.28 : 0);
      ctx.fillStyle = material === '미분류' ? '#858894' : '#5f626d'; ctx.font = '12px ' + FONT;
      ctx.textAlign = materials.length > 4 ? 'right' : 'center'; ctx.fillText(formula(material), 0, 0); ctx.restore();
    });
    points = values.map((item, i) => {
      const same = values.filter(v => v.material === item.material && +v.v.norm_value === +item.v.norm_value);
      const index = same.indexOf(item);
      const jitter = (index - (same.length - 1) / 2) * Math.min(11, 54 / Math.max(1, same.length));
      return { ...item, x: xAt(item.material) + jitter, y: yAt(+item.v.norm_value) };
    });
    for (const point of points) {
      const active = hover === point;
      ctx.beginPath(); ctx.arc(point.x, point.y, active ? 7 : 5, 0, Math.PI * 2);
      ctx.fillStyle = point.material === '미분류' ? '#a0a3ad' : (active ? '#8e7cff' : '#fff'); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = point.material === '미분류' ? '#858894' : '#7564e8'; ctx.stroke();
    }
    ctx.fillStyle = '#5f626d'; ctx.font = '12px ' + FONT; ctx.textAlign = 'center';
    ctx.fillText('합성 대상 소재', (box.left + box.right) / 2, h - 12);
    ctx.save(); ctx.translate(15, (box.top + box.bottom) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('합성 온도 (°C)', 0, 0); ctx.restore();
    status.textContent = `${values.length}개 조건 · ${new Set(values.map(v => v.p.id)).size}편 · ${materials.length}개 소재 분류`;
    table.innerHTML = values.map(({ p, v, material }) => '<tr><td>'
      + (p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>' : esc(p.title))
      + '<br><small>' + esc(p.journal || '') + ' · ' + (p.year || '연도 미상') + '</small></td><td>' + formula(esc(material))
      + '</td><td>' + fmtValue(v) + (v.qualifier ? '<br><small>' + esc(v.qualifier) + '</small>' : '')
      + '</td><td>' + esc(v.sample || '시료 미기록') + '</td><td>' + (v.evidence?.page ? 'p. ' + esc(v.evidence.page) : '—') + '</td></tr>').join('');
  }

  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * state.w / rect.width, y = (event.clientY - rect.top) * state.h / rect.height;
    let nearest = null, distance = 14;
    for (const point of points) { const d = Math.hypot(point.x - x, point.y - y); if (d < distance) { nearest = point; distance = d; } }
    if (nearest !== hover) { hover = nearest; draw(); }
    if (!nearest) { tip.classList.remove('on'); return; }
    tip.innerHTML = '<b>' + esc(nearest.p.title) + '</b><br>합성 대상 소재: ' + formula(esc(nearest.material))
      + '<br>합성 온도: ' + fmtValue(nearest.v) + '<br>시료: ' + esc(nearest.v.sample || '미기록')
      + '<br><span style="opacity:.7">' + esc(nearest.p.journal || '') + ' ' + (nearest.p.year || '')
      + (nearest.v.evidence?.page ? ' · p. ' + esc(nearest.v.evidence.page) : '') + '</span>';
    tip.style.left = Math.max(8, Math.min(x + 12, state.w - 290)) + 'px';
    tip.style.top = Math.max(8, Math.min(y + 12, state.h - 145)) + 'px';
    tip.style.maxWidth = '290px'; tip.style.whiteSpace = 'normal'; tip.classList.add('on');
  });
  canvas.addEventListener('pointerleave', () => { hover = null; tip.classList.remove('on'); draw(); });
  canvas.addEventListener('click', () => { if (hover?.p.url) window.open(hover.p.url, '_blank', 'noopener'); });
  draw();
  return () => { hover = null; tip.classList.remove('on'); draw(); };
}

function initSynthesisConditions(root, data, synthesisFocus, getMaterial) {
  const status = root.querySelector('[data-o="synthesis-status"]');
  const table = root.querySelector('[data-o="synthesis-table"]');
  const papers = data.papers || [];
  const relevantKeys = new Set([...SYNTHESIS_METRICS, 'precursor', 'synthesis_method']);
  const evidenceLabel = value => {
    const evidence = value.evidence;
    if (!evidence) return '';
    return [evidence.page ? `p. ${evidence.page}` : '', evidence.label || ''].filter(Boolean).join(' · ');
  };
  const reported = value => value.value_text || fmtValue(value) || value.qualifier || '세부 값 미기록';
  const temperatureOnly = value => value.value_text
    ? value.value_text.replace(/\s*\([^)]*\)/g, '').trim()
    : fmtValue(value) || '';
  const synthesisSentences = values => {
    const analysis = /\b(?:SEM|AFM|TEM|HRTEM|HR-TEM|DF-TEM|HAADF-STEM|STEM|SAED|Raman|XPS)\b|분석|조사|관찰|측정|characteri[sz]|imaging|analysis|analy[sz]|measur|observ/i;
    return [...new Set(values.flatMap(value => String(value.method || '').split(/(?<=[.!?。])\s+/)))]
      .map(sentence => sentence.trim())
      .filter(sentence => sentence && !analysis.test(sentence))
      .join(' ');
  };
  const substanceOnly = value => {
    let text = String(value.value_text || '').trim();
    if (!text) return '';
    // Drop parenthetical supplier/purity notes while retaining chemical formulas
    // such as (C2H5)2Zn and useful precursor abbreviations such as (TDMA-Sn).
    text = text.replace(/\s*\((?:[^()]*(?:%|≥|≤|Sigma[- ]Aldrich|Merck|Aldrich|purity|순도)[^()]*)\)/gi, '').trim();
    const abbreviation = text.match(/\(([A-Z][A-Za-z0-9-]{1,14})\)\s*$/);
    if (abbreviation) text = abbreviation[1];
    text = text.replace(/\b(?:high[- ]purity|powder|target|pellets?|flakes?)\b/gi, '').trim();
    text = text.replace(/\s+/g, ' ');
    if (/^sulph?ur$/i.test(text)) text = 'S';
    return text;
  };

  function render() {
    const selected = getMaterial();
    const rows = papers.filter(p => {
      const targets = synthesisFocus[p.id] || [];
      return targets.length && (selected === '전체' || targets.includes(selected));
    });
    table.innerHTML = rows.map(p => {
      const targets = synthesisFocus[p.id] || [];
      const values = p.values.filter(v => relevantKeys.has(v.metric_key) && !isContactFormationTemp(p, v));
      const precursorValues = [...new Set(values.filter(v => v.metric_key === 'precursor')
        .map(substanceOnly).filter(Boolean))];
      const temperatureValues = values.filter(v => v.metric_key === 'growth_temperature');
      const methodValue = values.find(v => v.metric_key === 'synthesis_method' && v.value_text);
      const processNote = synthesisSentences(values);
      const precursorHtml = precursorValues.length
        ? '<ul>' + precursorValues.map(v => '<li>' + formula(esc(v)) + '</li>').join('') + '</ul>'
        : '<span class="pnone">승인된 전구체 항목 없음</span>';
      const temperatureHtml = temperatureValues.length
        ? '<ul>' + temperatureValues.map(v => '<li>' + esc(temperatureOnly(v)) + '</li>').join('') + '</ul>'
        : '<span class="pnone">승인된 온도 값 없음</span>';
      const methodHtml = methodValue
        ? esc(reported(methodValue))
        : processNote
          ? '<details><summary>공정 설명 보기</summary><p>' + esc(processNote) + '</p></details>'
          : '<span class="pnone">공정 정보 미등록</span>';
      return '<tr><td>' + targets.map(m => '<span class="pill">' + formula(esc(m)) + '</span>').join(' ')
        + '</td><td>' + precursorHtml + '</td><td>' + temperatureHtml + '</td><td>' + methodHtml + '</td><td>'
        + (p.url ? '<a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title) + ' ↗</a>' : esc(p.title))
        + '<br><small>' + esc(p.journal || '') + ' · ' + (p.year || '연도 미상') + '</small></td></tr>';
    }).join('');
    const withPrecursors = rows.filter(p => p.values.some(v => v.metric_key === 'precursor' && substanceOnly(v))).length;
    const withTemperature = rows.filter(p => p.values.some(v => v.metric_key === 'growth_temperature' && !isContactFormationTemp(p, v))).length;
    status.textContent = `${rows.length}편 · 전구체 기록 ${withPrecursors}편 · 합성 온도 기록 ${withTemperature}편 (공개 DB의 검토 승인 자료 기준)`;
  }
  render();
  return render;
}

async function initData(root) {
  const status = root.querySelector('[data-o="status"]');
  try {
    const [data, focus, synthesisFocus] = await Promise.all([load(), loadFocus(), loadSynthesisFocus()]);
    const papers = data.papers || [];
    const metrics = CHART_METRICS.filter(key => data.metrics[key]
      && papers.some(p => p.values.some(v => v.metric_key === key && Number.isFinite(+v.norm_value) && +v.norm_value > 0)));
    const xSelect = root.querySelector('[data-o="axis-x"]');
    const ySelect = root.querySelector('[data-o="axis-y"]');
    if (!metrics.length) {
      status.textContent = '비교할 수 있는 주요 수치가 아직 없습니다.';
      return;
    }
    const metricLabel = key => {
      const m = data.metrics[key];
      return m.unit ? m.label + ' (' + m.unit + ')' : m.label;
    };
    const options = metrics.map(key => '<option value="' + esc(key) + '">' + esc(metricLabel(key)) + '</option>').join('');
    xSelect.innerHTML = options;
    ySelect.innerHTML = options;
    xSelect.value = metrics.includes('mobility') ? 'mobility' : metrics[0];
    ySelect.value = metrics.includes('on_off_ratio') ? 'on_off_ratio' : metrics.find(key => key !== xSelect.value) || metrics[0];

    const primary = p => focus[p.id] || [];
    const materials = [...new Set(papers.flatMap(primary))].sort((a, b) => a.localeCompare(b));
    const hasUnclassified = papers.some(p => !primary(p).length);
    const filter = root.querySelector('.seg[data-k="mat"]');
    const choices = ['전체', ...materials, ...(hasUnclassified ? ['미분류'] : [])];
    filter.innerHTML = choices.map((m, i) => '<button data-v="' + esc(m) + '"' + (i ? '' : ' class="on"') + '>'
      + (m === '전체' || m === '미분류' ? esc(m) : formula(esc(m))) + '</button>').join('');
    let material = '전체';
    let synthesisMaterial = '전체';
    let xMetric = xSelect.value, yMetric = ySelect.value;
    const synthesisMaterials = [...new Set(Object.values(synthesisFocus).flat())].sort((a, b) => a.localeCompare(b));
    const hasUnclassifiedSynthesis = papers.some(p => !synthesisFocus[p.id]?.length
      && p.values.some(v => SYNTHESIS_METRICS.includes(v.metric_key)));
    const synthesisFilter = root.querySelector('.seg[data-k="synth-mat"]');
    const synthesisChoices = ['전체', ...synthesisMaterials, ...(hasUnclassifiedSynthesis ? ['미분류'] : [])];
    synthesisFilter.innerHTML = synthesisChoices.map((m, i) => '<button data-v="' + esc(m) + '"' + (i ? '' : ' class="on"') + '>'
      + (m === '전체' || m === '미분류' ? esc(m) : formula(esc(m))) + '</button>').join('');
    const refreshSynthesisConditions = initSynthesisConditions(root, data, synthesisFocus, () => synthesisMaterial);
    const refreshMaterialTemperature = initMaterialTemperatureChart(root, data, synthesisFocus, () => synthesisMaterial);
    synthesisFilter.addEventListener('click', event => {
      const button = event.target.closest('button[data-v]');
      if (!button) return;
      synthesisMaterial = button.dataset.v;
      synthesisFilter.querySelectorAll('button').forEach(item => item.classList.toggle('on', item === button));
      refreshSynthesisConditions(); refreshMaterialTemperature();
    });
    const canvas = root.querySelector('canvas');
    const tip = root.querySelector('.tip');
    const { ctx, state } = fitCanvas(canvas, draw);
    let points = [], hover = null;

    function selectedPapers() {
      return papers.filter(p => material === '전체'
        || (material === '미분류' ? !primary(p).length : primary(p).includes(material)));
    }
    function valuesFor(p, key) {
      return p.values.filter(v => v.metric_key === key && Number.isFinite(+v.norm_value) && +v.norm_value > 0);
    }
    function pairs() {
      const result = [];
      for (const p of selectedPapers()) {
        const xs = valuesFor(p, xMetric), ys = valuesFor(p, yMetric);
        for (const xv of xs) for (const yv of ys) {
          const xsample = String(xv.sample || '').trim();
          const ysample = String(yv.sample || '').trim();
          const sameKnownSample = xsample && ysample && xsample === ysample;
          const uniquePaperPair = xs.length === 1 && ys.length === 1;
          if (sameKnownSample || uniquePaperPair) {
            const sample = xsample === ysample ? (xsample || '') : [xsample, ysample].filter(Boolean).join(' · ');
            result.push({ p, x: xv, y: yv, sample });
          }
        }
      }
      return result.sort((a, b) => String(b.p.publication_date || b.p.year || '').localeCompare(String(a.p.publication_date || a.p.year || '')));
    }
    function niceStep(value) {
      if (!Number.isFinite(value) || value <= 0) return 1;
      const exponent = Math.floor(Math.log10(value)), base = 10 ** exponent, scaled = value / base;
      return (scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10) * base;
    }
    function axisRange(values) {
      const low = Math.min(...values), high = Math.max(...values);
      const logarithmic = high / low > 35;
      if (logarithmic) {
        let min = Math.floor(Math.log10(low)), max = Math.ceil(Math.log10(high));
        if (min === max) { min -= 1; max += 1; }
        return { logarithmic, min, max, map: v => (Math.log10(v) - min) / (max - min) };
      }
      let min = low, max = high;
      if (min === max) { min *= .85; max *= 1.15; }
      else { const pad = (max - min) * .1; min = Math.max(0, min - pad); max += pad; }
      return { logarithmic, min, max, map: v => (v - min) / (max - min) };
    }
    function drawAxis(range, vertical, box, values) {
      const { left, right, top, bottom } = box;
      const start = vertical ? bottom : left, end = vertical ? top : right;
      const ticks = [];
      if (range.logarithmic) {
        for (let e = Math.ceil(range.min); e <= Math.floor(range.max); e++) ticks.push([10 ** e, '10' + (e ? '⁽' + e + '⁾' : '')]);
      } else {
        const step = niceStep((range.max - range.min) / 5);
        const first = Math.ceil(range.min / step) * step;
        for (let t = first; t <= range.max + step * .001; t += step) ticks.push([t, (+t.toPrecision(3)).toLocaleString('en-US')]);
      }
      if (ticks.length < 2) {
        ticks.length = 0;
        ticks.push([Math.min(...values), fmtNum(Math.min(...values))], [Math.max(...values), fmtNum(Math.max(...values))]);
      }
      ctx.font = '11px ' + MONO;
      ctx.fillStyle = '#777b86';
      ctx.strokeStyle = 'rgba(120,125,140,.22)';
      ctx.lineWidth = 1;
      for (const [value, label] of ticks) {
        const ratio = range.map(value);
        const pos = start + (end - start) * ratio;
        ctx.beginPath();
        if (vertical) { ctx.moveTo(left, pos); ctx.lineTo(right, pos); }
        else { ctx.moveTo(pos, top); ctx.lineTo(pos, bottom); }
        ctx.stroke();
        ctx.textAlign = vertical ? 'right' : 'center';
        if (vertical) ctx.fillText(label, left - 9, pos + 4);
        else ctx.fillText(label, pos, bottom + 20);
      }
    }
    function draw() {
      const { w, h } = state;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      const dataPairs = pairs();
      const minX = Math.min(90, Math.max(66, w * .15));
      const box = { left: minX, right: w - 22, top: 24, bottom: h - 62 };
      if (!dataPairs.length) {
        status.textContent = '0편 · 선택한 지표 조합의 비교 데이터 없음';
        ctx.fillStyle = '#70737d';
        ctx.font = '14px ' + FONT;
        ctx.textAlign = 'center';
        ctx.fillText('같은 시료에서 두 지표를 함께 보고한 논문이 없습니다.', w / 2, h / 2 - 8);
        ctx.font = '12px ' + FONT;
        ctx.fillText('축 조합이나 핵심 소재를 바꿔 보세요.', w / 2, h / 2 + 16);
        points = [];
        return;
      }
      const xValues = dataPairs.map(pair => +pair.x.norm_value);
      const yValues = dataPairs.map(pair => +pair.y.norm_value);
      const xr = axisRange(xValues), yr = axisRange(yValues);
      drawAxis(xr, false, box, xValues);
      drawAxis(yr, true, box, yValues);
      points = dataPairs.map(pair => ({
        x: box.left + xr.map(+pair.x.norm_value) * (box.right - box.left),
        y: box.bottom - yr.map(+pair.y.norm_value) * (box.bottom - box.top),
        ...pair,
      }));
      for (const point of points) {
        const active = hover && hover.p === point.p && hover.x === point.x && hover.y === point.y;
        ctx.beginPath();
        ctx.arc(point.x, point.y, active ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = active ? '#8e7cff' : '#fff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#7564e8';
        ctx.stroke();
      }
      ctx.fillStyle = '#5f626d';
      ctx.font = '12px ' + FONT;
      ctx.textAlign = 'center';
      ctx.fillText(metricLabel(xMetric) + (xr.logarithmic ? ' · 로그 축' : ''), (box.left + box.right) / 2, h - 15);
      ctx.save();
      ctx.translate(15, (box.top + box.bottom) / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(metricLabel(yMetric) + (yr.logarithmic ? ' · 로그 축' : ''), 0, 0);
      ctx.restore();
      const paperCount = new Set(dataPairs.map(point => point.p.id)).size;
      status.textContent = paperCount + '편 · 시료 기준 또는 논문 단위 ' + dataPairs.length + '개 비교점';
    }
    function showTip(point, clientX, clientY) {
      if (!point) { tip.classList.remove('on'); return; }
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left, y = clientY - rect.top;
      const p = point.p;
      tip.innerHTML = '<b>' + esc(p.title) + '</b><br>'
        + esc(data.metrics[xMetric].label) + ': ' + fmtValue(point.x) + (point.x.qualifier ? ' · ' + esc(point.x.qualifier) : '') + '<br>'
        + esc(data.metrics[yMetric].label) + ': ' + fmtValue(point.y) + (point.y.qualifier ? ' · ' + esc(point.y.qualifier) : '')
        + (point.sample ? '<br>시료: ' + esc(point.sample) : '')
        + '<br><span style="opacity:.7">' + esc(p.journal || '') + ' ' + (p.year || '') + '</span>';
      tip.style.left = Math.max(8, Math.min(x + 12, state.w - 280)) + 'px';
      tip.style.top = Math.max(8, Math.min(y + 12, state.h - 150)) + 'px';
      tip.style.whiteSpace = 'normal';
      tip.style.maxWidth = '280px';
      tip.classList.add('on');
    }
    function changeAxes(changed) {
      xMetric = xSelect.value;
      yMetric = ySelect.value;
      if (xMetric === yMetric && metrics.length > 1) {
        const alternative = metrics.find(key => key !== xMetric);
        if (changed === 'x') { yMetric = alternative; ySelect.value = alternative; }
        else { xMetric = alternative; xSelect.value = alternative; }
      }
      hover = null;
      tip.classList.remove('on');
      draw();
      renderTable();
    }
    function renderTable() {
      const tbody = root.querySelector('[data-o="table"]');
      tbody.innerHTML = pairs().map(point => '<tr><td>' + (point.p.url
        ? '<a href="' + esc(point.p.url) + '" target="_blank" rel="noopener">' + esc(point.p.title) + '</a>'
        : esc(point.p.title)) + '<br><small>' + esc(point.p.journal || '') + ' · ' + (point.p.year || '연도 미상') + '</small></td>'
        + '<td>' + (primary(point.p).map(m => formula(esc(m))).join(', ') || '미분류') + '</td>'
        + '<td>' + fmtValue(point.x) + (point.x.qualifier ? '<br><small>' + esc(point.x.qualifier) + '</small>' : '') + '</td>'
        + '<td>' + fmtValue(point.y) + (point.y.qualifier ? '<br><small>' + esc(point.y.qualifier) + '</small>' : '') + '</td>'
        + '<td>' + esc(point.sample || '시료 미기록') + '</td></tr>').join('');
    }
    canvas.addEventListener('pointermove', event => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) * state.w / rect.width;
      const y = (event.clientY - rect.top) * state.h / rect.height;
      let nearest = null, distance = 14;
      for (const point of points) {
        const d = Math.hypot(point.x - x, point.y - y);
        if (d < distance) { nearest = point; distance = d; }
      }
      if (nearest !== hover) { hover = nearest; draw(); }
      showTip(nearest, event.clientX, event.clientY);
    });
    canvas.addEventListener('pointerleave', () => { hover = null; tip.classList.remove('on'); draw(); });
    canvas.addEventListener('click', () => { if (hover && hover.p.url) window.open(hover.p.url, '_blank', 'noopener'); });
    xSelect.addEventListener('change', () => changeAxes('x'));
    ySelect.addEventListener('change', () => changeAxes('y'));
    seg(root, 'mat', value => {
      material = value;
      hover = null;
      tip.classList.remove('on');
      draw();
      renderTable();
      refreshSynthesis();
      refreshMaterialTemperature();
    });
    root.querySelector('[data-o="updated"]').textContent = '데이터 기준: ' + String(data.generated_at || '').slice(0, 10);
    draw();
    renderTable();
  } catch (error) {
    status.textContent = '논문 데이터를 불러오지 못했습니다.';
    console.warn('[paperdata]', error);
  }
}


export function init(root) {
  return root.dataset.module === 'refs' ? initRefs(root) : initData(root);
}
