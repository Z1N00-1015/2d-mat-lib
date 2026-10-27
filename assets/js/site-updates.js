import { FIELDS, chapterUrl } from './book-runtime.js?v=20261027-cvd';

const root = document.body.dataset.root || './';
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function renderHomeToc() {
  const mount = document.querySelector('[data-home-toc]');
  if (!mount) return;
  mount.innerHTML = FIELDS.filter(field => !field.external).map(field => `
    <section class="home-toc-field" aria-labelledby="home-toc-${field.id}">
      <h3 id="home-toc-${field.id}">${escapeText(field.n)}. ${escapeText(field.title)}</h3>
      <ol>${field.chapters.map(chapter => `
        <li><a href="${escapeText(chapterUrl(root, field, chapter))}"><span>${escapeText(field.n)} · ${escapeText(chapter.n)}</span>${escapeText(chapter.title)}</a></li>
      `).join('')}</ol>
    </section>`).join('');
}

function addDoiLinks(container, dois) {
  if (!Array.isArray(dois) || !dois.length) return;
  const list = document.createElement('div');
  list.className = 'update-dois';
  const label = document.createElement('span');
  label.textContent = '추가된 DOI';
  list.append(label);
  for (const doi of dois) {
    const link = document.createElement('a');
    link.href = `https://doi.org/${doi}`;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = doi;
    list.append(link);
  }
  container.append(list);
}

function appendUpdate(container, entry, compact = false) {
  const item = document.createElement(compact ? 'li' : 'article');
  item.className = compact ? 'recent-update' : 'changelog-entry';
  const meta = document.createElement('div');
  meta.className = 'update-meta';
  const date = document.createElement('time');
  date.dateTime = entry.date;
  date.textContent = entry.date;
  const page = document.createElement('a');
  page.href = new URL(`${root}${(entry.url || './index.html').replace(/^\.\//, '')}`, location.href).href;
  page.textContent = entry.page;
  meta.append(date, page);
  const summary = document.createElement('p');
  summary.textContent = entry.summary;
  item.append(meta, summary);
  if (!compact) addDoiLinks(item, entry.added_dois);
  else if (entry.added_dois?.length) {
    const count = document.createElement('span');
    count.className = 'update-doi-count';
    count.textContent = `DOI ${entry.added_dois.length}개 추가`;
    item.append(count);
  }
  container.append(item);
}

async function renderChangelog() {
  const response = await fetch(`${root}data/changelog.json`);
  if (!response.ok) throw new Error(`changelog.json: ${response.status}`);
  const { entries = [] } = await response.json();
  const recent = document.querySelector('[data-recent-updates]');
  if (recent) entries.slice(0, 5).forEach(entry => appendUpdate(recent, entry, true));
  const full = document.querySelector('[data-changelog-list]');
  if (full) entries.forEach(entry => appendUpdate(full, entry));
}

renderHomeToc();
const accessDate = new Date();
const accessDateText = `${accessDate.getFullYear()}-${String(accessDate.getMonth() + 1).padStart(2, '0')}-${String(accessDate.getDate()).padStart(2, '0')}`;
document.querySelectorAll('[data-access-date]').forEach(node => { node.textContent = accessDateText; node.dateTime = accessDateText; });
renderChangelog().catch(error => {
  document.querySelectorAll('[data-update-status]').forEach(node => { node.textContent = '변경 이력을 불러오지 못했습니다.'; });
  console.warn('[changelog]', error);
});
