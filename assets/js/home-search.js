import { FIELDS } from './book-runtime.js?v=20261021-materials-structure';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
const subscript = value => String(value).replace(/\d/g, digit => '₀₁₂₃₄₅₆₇₈₉'[Number(digit)]);
const normalize = value => String(value ?? '')
  .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, digit => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(digit)))
  .toLocaleLowerCase().replace(/[^a-z0-9가-힣]/g, '');
const textFields = value => Array.isArray(value) ? value.join(' ') : String(value ?? '');
const rootPath = document.body.dataset.root || './';
const paperRoot = document.getElementById('home-paper-results');
const guideRoot = document.getElementById('home-guide-result-list');
const guideSection = document.getElementById('home-guide-results');
const status = document.getElementById('home-search-status');
const note = document.getElementById('discovery-note');
const form = document.getElementById('home-search');
const input = document.getElementById('home-search-input');

const guideItems = FIELDS.filter(field => !field.external).flatMap(field => field.chapters.map(chapter => ({
  title: chapter.title,
  field: field.title,
  description: `${field.desc} ${chapter.desc} ${(chapter.labs || []).join(' ')}`,
  url: `${rootPath}chapters/${field.id}/${chapter.id}.html`,
  text: normalize(`${field.title} ${field.desc} ${chapter.title} ${chapter.group} ${chapter.desc} ${(chapter.labs || []).join(' ')}`),
})));

function paperSearchText(paper, coreMaterials) {
  const values = (paper.values || []).flatMap(value => [
    value.name, value.canonical_name, value.metric_label, value.method,
    value.qualifier, value.sample, value.conditions, value.unit,
  ]);
  const components = (paper.device_components || []).flatMap(component => [
    component.role, component.role_label, component.role_name, component.material,
    component.thickness, component.channel_length, component.channel_width,
  ]);
  return normalize([
    paper.title, paper.journal, paper.year, textFields(paper.research_type),
    textFields(coreMaterials), textFields(values), textFields(components),
  ].join(' '));
}

function paperCard(paper, focus) {
  const core = focus[paper.id] || [];
  const year = paper.year || '연도 미상';
  const type = textFields(paper.research_type);
  return `<article class="home-paper-card">
    <div class="home-paper-meta">${esc(paper.journal || '저널 정보 없음')} · ${esc(year)}${type ? ` · ${esc(type)}` : ''}</div>
    <h3>${esc(paper.title)}</h3>
    <div class="home-paper-tags">${core.length
      ? core.map(material => `<span>${esc(subscript(material))}</span>`).join('')
      : '<span class="unclassified">핵심 소재 미분류</span>'}</div>
    <div class="home-paper-links">${paper.url ? `<a href="${esc(paper.url)}" target="_blank" rel="noopener">${paper.doi ? 'DOI로 논문 보기 ↗' : '논문 페이지 ↗'}</a>` : ''}<a href="${rootPath}chapters/tools/papers.html">공개 데이터에서 보기 →</a></div>
  </article>`;
}

function guideCard(guide) {
  return `<a class="home-guide-result" href="${esc(guide.url)}"><span>${esc(guide.field)}</span><b>${esc(guide.title)}</b><p>${esc(guide.description)}</p><strong>기초 설명 보기 →</strong></a>`;
}

function sortRecent(papers) {
  return [...papers].sort((a, b) => String(b.publication_date || b.year || '').localeCompare(String(a.publication_date || a.year || '')));
}

async function init() {
  try {
    const [dataResponse, focusResponse] = await Promise.all([
      fetch(`${rootPath}data/papers.json`), fetch(`${rootPath}data/paper-focus.json`),
    ]);
    if (!dataResponse.ok) throw new Error(`papers.json ${dataResponse.status}`);
    const data = await dataResponse.json();
    const focus = focusResponse.ok ? await focusResponse.json() : {};
    const papers = Array.isArray(data.papers) ? data.papers : [];
    function render() {
      const query = input.value.trim();
      const terms = query.split(/\s+/).map(normalize).filter(Boolean);
      const matchingPapers = terms.length
        ? sortRecent(papers.filter(paper => {
            const searchable = paperSearchText(paper, focus[paper.id] || []);
            return terms.every(term => searchable.includes(term));
          }))
        : sortRecent(papers).slice(0, 3);
      const matchingGuides = terms.length
        ? guideItems.filter(guide => terms.every(term => guide.text.includes(term))).slice(0, 4)
        : [];

      paperRoot.innerHTML = matchingPapers.length
        ? matchingPapers.slice(0, 4).map(paper => paperCard(paper, focus)).join('')
        : `<div class="home-empty">‘${esc(query)}’와 일치하는 논문 데이터가 없습니다. 소재명이나 분석법을 바꿔 검색해 보세요.</div>`;
      guideRoot.innerHTML = matchingGuides.map(guideCard).join('');
      guideSection.hidden = matchingGuides.length === 0;
      if (terms.length) {
        document.getElementById('home-discovery-title').textContent = '검색 결과';
        note.textContent = `“${query}” 검색 · 핵심 소재와 검토된 연구 기록을 기준으로 찾았습니다.`;
        status.textContent = `논문 ${matchingPapers.length}편${matchingPapers.length > 4 ? ' 중 4편 표시' : ''} · 기초 설명 ${matchingGuides.length}개`;
      } else {
        document.getElementById('home-discovery-title').textContent = '최근 연구 데이터';
        note.textContent = 'DB에서 최근 등록된 논문을 핵심 소재와 함께 보여줍니다. 검색하면 논문과 연결된 기초 설명도 찾아드립니다.';
        status.textContent = '';
      }
    }

    form.addEventListener('submit', event => { event.preventDefault(); render(); });
    input.addEventListener('input', render);
    form.querySelectorAll('[data-query]').forEach(button => button.addEventListener('click', () => {
      input.value = button.dataset.query || '';
      render();
      input.focus();
    }));
    render();
  } catch (error) {
    paperRoot.innerHTML = `<div class="home-empty">논문 데이터를 불러오지 못했습니다. <a href="${rootPath}chapters/tools/papers.html">논문 데이터 페이지에서 확인하세요 →</a></div>`;
    status.textContent = '공개 DB를 연결할 수 없어 논문 검색을 사용할 수 없습니다.';
    console.error('[home-search]', error);
  }
}

init();
