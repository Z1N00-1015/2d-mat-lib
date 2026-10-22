// Public paper library: search exported database records and show related studies.
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

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
const formula = f => f.replace(/\d/g, d => SUB[d]);

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
const firstAuthor = p => p.authors?.length
  ? `${esc(p.authors[0].split(',')[0])}${p.authors.length > 1 ? ` 외 ${p.authors.length - 1}명` : ''}`
  : '저자 정보 없음';

// Topics used by the short related-paper panels embedded in research chapters.
const DEVICE = ['contact_resistance', 'mobility', 'on_off_ratio', 'subthreshold_swing', 'on_current', 'schottky_barrier', 'transconductance'];
const SYNTH = ['growth_temperature', 'growth_time', 'gas_flow', 'precursor', 'synthesis_method', 'pressure', 'ramp_rate', 'substrate'];
const hasKey = (p, keys) => (p.values || []).some(v => keys.includes(v.metric_key));
const TOPICS = {
  fet: { match: p => hasKey(p, DEVICE) || /contact|transistor|electronics/i.test(p.title), keys: DEVICE },
  mos2: { match: p => (p.materials || []).includes('MoS2') || /MoS/i.test(p.title), keys: [...DEVICE, 'growth_temperature', 'raman_shift'] },
  cvd: { match: p => hasKey(p, SYNTH) || /growth|epitax|hypotax|wafer/i.test(p.title), keys: SYNTH },
  crystal: { match: p => /phase|3R|stacking|single-crystal|epitax|hypotax/i.test(p.title), keys: [...SYNTH, 'raman_shift'] },
  xrd: { methodLabel: 'X선 회절(XRD)', methodRe: /\bXRD\b|X-ray diffraction|X ray diffraction|X선 회절|powder diffraction/i },
  raman: { methodLabel: 'Raman 분광법', methodRe: /Raman|라만/i },
  tem: { methodLabel: '전자현미경(TEM·DF-TEM·STEM)', methodRe: /\bTEM\b|HRTEM|HR-TEM|DF-TEM|STEM|SAED|HAADF|전자현미경/i },
  xps: { methodLabel: 'X선 광전자분광법(XPS)', methodRe: /\bXPS\b|X-ray photoelectron|X선 광전자/i },
  afm: { methodLabel: '원자힘현미경(AFM)', methodRe: /\bAFM\b|atomic force microscopy|원자힘현미경/i },
};

function valueCard(p, keys, focus) {
  const vals = (p.values || []).filter(v => keys.includes(v.metric_key) && fmtValue(v)).slice(0, 4);
  const core = focus[p.id] || [];
  return `<article class="pcard">
    <div class="pmeta">${esc(p.journal || '저널 정보 없음')} · ${p.year || '연도 미상'}${p.research_type?.length ? ` · ${esc(p.research_type.join(', '))}` : ''}</div>
    <h4>${esc(p.title)}</h4>
    <div class="pauth">${firstAuthor(p)}</div>
    ${core.length ? `<div class="pchips" aria-label="핵심 소재">${core.map(m => `<span>${formula(esc(m))}</span>`).join('')}</div>` : ''}
    ${vals.length ? `<dl class="pvals">${vals.map(v => `<div><dt>${esc(v.metric_label)}${v.qualifier ? ` <small>${esc(v.qualifier)}</small>` : ''}</dt><dd>${fmtValue(v)}</dd></div>`).join('')}</dl>`
      : `<div class="pnone">${p.has_verified_data ? '이 주제의 검토 완료 수치 없음' : '서지정보만 공개 (수치 검토 전)'}</div>`}
    ${p.url ? `<a class="plink" href="${esc(p.url)}" target="_blank" rel="noopener">${p.doi ? 'DOI ' + esc(p.doi) : '논문 페이지'} ↗</a>` : ''}
  </article>`;
}

function methodCard(p, topic, focus) {
  const values = (p.values || []).filter(v => topic.methodRe.test(v.method || ''));
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
      ? p => (p.values || []).some(v => topic.methodRe.test(v.method || ''))
      : topic.match);
    const list = topic.methodRe
      ? matching.sort((a, b) => String(b.publication_date || b.year || '').localeCompare(String(a.publication_date || a.year || ''))).slice(0, 3)
      : matching;
    if (!list.length) { root.remove(); return; }
    const rootPath = document.body.dataset.root || '../../';
    const heading = topic.methodRe ? `DB 내 관련 최신 연구 ${list.length}편` : `관련 논문 ${list.length}편`;
    root.innerHTML = `<div class="refs-head"><span class="refs-tag">연구실 논문 DB</span><h4>${heading}</h4><a href="${rootPath}chapters/tools/papers.html">전체 논문 검색 ›</a></div>
      <div class="refs-row">${list.map(p => topic.methodRe ? methodCard(p, topic, focus) : valueCard(p, topic.keys, focus)).join('')}</div>`;
  } catch (e) {
    root.remove();
    console.warn('[refs]', e);
  }
}

function normalized(text) {
  return String(text ?? '').normalize('NFKC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function searchableText(p, focus) {
  const values = (p.values || []).flatMap(v => [
    v.name, v.canonical_name, v.metric_label, v.qualifier, v.conditions, v.method, v.sample,
    v.value, v.value_text, v.unit, v.norm_value, v.norm_unit, ...(v.materials || []),
  ]);
  const components = (p.device_components || []).flatMap(c => Object.values(c));
  return normalized([
    p.title, ...(p.authors || []), p.journal, p.year, p.publication_date, p.doi,
    ...(p.materials || []), ...(focus[p.id] || []), ...(p.research_type || []),
    ...values, ...components,
  ].filter(v => v != null).join(' '));
}

function searchCard(p, focus) {
  const core = focus[p.id] || [];
  const year = p.year || (p.publication_date || '').slice(0, 4) || '연도 미상';
  const meta = [p.journal, year].filter(Boolean).map(esc).join(' · ');
  const tags = core.length
    ? `<div class="paper-search-tags" aria-label="핵심 소재">${core.map(m => `<span>${formula(esc(m))}</span>`).join('')}</div>`
    : '';
  const recordCount = (p.values || []).length;
  return `<article class="paper-search-card">
    <div class="paper-search-card-main">
      <div class="paper-search-meta">${meta || '서지 정보 미등록'}${p.doi ? ` · DOI ${esc(p.doi)}` : ''}</div>
      <h3>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)} ↗</a>` : esc(p.title)}</h3>
      <p class="paper-search-authors">${firstAuthor(p)}</p>
      ${tags}
    </div>
    <div class="paper-search-record">${p.has_verified_data ? `검토 데이터 ${recordCount}개` : '검토 데이터 없음'}</div>
  </article>`;
}

async function initSearch(root) {
  const input = root.querySelector('[data-paper-search]');
  const clear = root.querySelector('[data-paper-clear]');
  const status = root.querySelector('[data-paper-status]');
  const results = root.querySelector('[data-paper-results]');
  try {
    const [data, focus] = await Promise.all([load(), loadFocus()]);
    const papers = [...(data.papers || [])].sort((a, b) =>
      String(b.publication_date || b.year || '').localeCompare(String(a.publication_date || a.year || '')));
    const indexed = papers.map(p => ({ paper: p, text: searchableText(p, focus) }));

    function render() {
      const terms = normalized(input.value).split(/\s+/).filter(Boolean);
      const matches = indexed.filter(item => terms.every(term => item.text.includes(term)));
      status.textContent = terms.length
        ? `${matches.length}편 검색됨 · 전체 ${papers.length}편`
        : `전체 ${papers.length}편 · 제목, 저자, 소재, DOI, 검토 데이터에서 검색`;
      clear.hidden = !input.value;
      results.innerHTML = matches.length
        ? matches.map(({ paper }) => searchCard(paper, focus)).join('')
        : '<div class="paper-search-empty">일치하는 논문이 없습니다. 다른 제목·소재·저자명으로 검색해 보세요.</div>';
    }

    input.addEventListener('input', render);
    clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
    root.querySelector('[data-paper-updated]').textContent = `공개 데이터 기준일: ${String(data.generated_at || '').slice(0, 10)}`;
    render();
  } catch (e) {
    status.textContent = '논문 데이터를 불러오지 못했습니다.';
    results.innerHTML = '<div class="paper-search-empty">공개 논문 데이터 파일을 읽을 수 없습니다. 잠시 후 다시 열어 주세요.</div>';
    console.warn('[papersearch]', e);
  }
}

export function init(root) {
  if (root.dataset.module === 'refs') return initRefs(root);
  if (root.dataset.module === 'papersearch') return initSearch(root);
}
