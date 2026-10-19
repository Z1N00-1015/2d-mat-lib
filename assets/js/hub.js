// Hub page: render every field (분야) and its chapter cards from the manifest in book.js
import { FIELDS, chapterUrl, store } from './book.js';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const levelDots = (n) => n ? '●'.repeat(n) + '○'.repeat(3 - n) : '';

const local = FIELDS.filter(f => !f.external);
const chapters = local.flatMap(f => f.chapters.filter(c => c.labs.length));
document.getElementById('st-field').textContent = FIELDS.length;
document.getElementById('st-ch').textContent = local.reduce((s, f) => s + f.chapters.length, 0);
document.getElementById('st-lab').textContent = chapters.reduce((s, c) => s + c.labs.length, 0);
const first = local[0];
document.getElementById('start').href = chapterUrl('./', first, first.chapters[0]);

const done = store.get('done', {});
document.getElementById('fields').innerHTML = FIELDS.map(f => {
  if (f.external) {
    return `<section class="field ext" id="field-${f.id}">
      <div class="field-head"><div><div class="en">CHAPTER ${f.n} · ${esc(f.en)}</div><h3>${esc(f.title)}</h3><p>${esc(f.desc)}</p></div>
        <div class="field-meta"><span class="chip">↗ 별도 사이트</span></div></div>
      <div class="field-body">
        <div class="tags" style="margin:0 0 16px">${(f.summary || []).map(s => `<span>${esc(s)}</span>`).join('')}</div>
        <a class="btn primary" href="${f.external}" target="_blank" rel="noopener">SemiBook 열기 ↗</a>
      </div></section>`;
  }
  const labs = f.chapters.reduce((s, c) => s + c.labs.length, 0);
  const mins = f.chapters.reduce((s, c) => s + c.time, 0);
  const cards = f.chapters.map(c => {
    const key = `${f.id}/${c.id}`;
    return `<a class="toc-card" href="${chapterUrl('./', f, c)}">
      <span class="n">${c.n === '··' ? '부록' : 'LESSON ' + c.n}${done[key] ? ' · ✓' : ''}</span>
      <h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p>
      ${c.labs.length ? `<div class="labs">${c.labs.map(l => `<span>${esc(l)}</span>`).join('')}</div>` : ''}
      ${c.level ? `<span class="muted" style="font-size:12px;margin-top:auto">⏱ ${c.time}분 · 난이도 ${levelDots(c.level)}</span>` : ''}
    </a>`;
  }).join('');
  return `<section class="field" id="field-${f.id}">
    <div class="field-head"><div><div class="en">CHAPTER ${f.n} · ${esc(f.en)}</div><h3>${esc(f.title)}</h3><p>${esc(f.desc)}</p></div>
      <div class="field-meta"><span class="chip">📖 ${f.chapters.length}개 소단원</span><span class="chip">🧪 실험 ${labs}개</span><span class="chip">⏱ 약 ${Math.round(mins / 10) * 10}분</span></div></div>
    <div class="field-body"><div class="toc-grid">${cards}</div>${(f.links || []).map(link => `<a class="btn" href="${esc(link.url)}" target="_blank" rel="noopener">${esc(link.title)} ↗</a>`).join('')}</div>
  </section>`;
}).join('');
