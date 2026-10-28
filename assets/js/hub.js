// Hub page: render every field (분야) and its chapter cards from the manifest in book-runtime.js
import { FIELDS, chapterUrl } from './book-runtime.js?v=20261028-search';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const local = FIELDS.filter(f => !f.external);
const first = local[0];
const start = document.getElementById('start');
if (start && first) start.href = chapterUrl('./', first, first.chapters[0]);

const fieldRoot = document.getElementById('fields');
if (!fieldRoot) throw new Error('Missing #fields hub container');
fieldRoot.innerHTML = FIELDS.map(f => {
  if (f.external) {
    return `<section class="field ext" id="field-${f.id}">
      <div class="field-head"><div><div class="en">FIELD ${f.n} · ${esc(f.en)}</div><h3>${esc(f.title)}</h3><p>${esc(f.desc)}</p></div>
        <div class="field-meta"><span class="chip">↗ 별도 사이트</span></div></div>
      <div class="field-body">
        <div class="tags" style="margin:0 0 16px">${(f.summary || []).map(s => `<span>${esc(s)}</span>`).join('')}</div>
        <a class="btn primary" href="${f.external}" target="_blank" rel="noopener">SemiBook 열기 ↗</a>
      </div></section>`;
  }
  const labs = f.chapters.reduce((s, c) => s + c.labs.length, 0);
  const cards = f.chapters.map(c => {
    return `<a class="toc-card" href="${chapterUrl('./', f, c)}">
      <span class="n">${c.n === '··' ? '부록' : `${f.n} · ${c.n}`}</span>
      <h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p>
      ${c.labs.length ? `<div class="labs">${c.labs.map(l => `<span>${esc(l)}</span>`).join('')}</div>` : ''}
    </a>`;
  }).join('');
  return `<section class="field" id="field-${f.id}">
    <div class="field-head"><div><div class="en">FIELD ${f.n} · ${esc(f.en)}</div><h3>${esc(f.title)}</h3><p>${esc(f.desc)}</p></div>
      <div class="field-meta"><span class="chip">📖 ${f.chapters.length}개 페이지</span><span class="chip">🧪 인터랙티브 ${labs}개</span></div></div>
    <div class="field-body"><div class="toc-grid">${cards}</div>${(f.links || []).map(link => `<a class="btn" href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.title)} ↗</a>`).join('')}</div>
  </section>`;
}).join('');
