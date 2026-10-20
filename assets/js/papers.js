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

// ---------- paper comparison ----------
const CHART_METRICS = ['mobility', 'on_off_ratio', 'on_current', 'subthreshold_swing', 'contact_resistance', 'growth_temperature'];

async function initData(root) {
  const status = root.querySelector('[data-o="status"]');
  try {
    const [data, focus] = await Promise.all([load(), loadFocus()]);
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
    let xMetric = xSelect.value, yMetric = ySelect.value;
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
