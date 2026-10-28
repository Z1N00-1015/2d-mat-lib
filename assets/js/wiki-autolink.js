// 장 본문에서 위키 문서가 있는 용어의 첫 등장에 문서 링크를 붙인다.
// 색인(data/wiki-index.json)은 tools/build_wiki.py가 만든다. 색인이 없으면 아무것도 하지 않는다.
const SKIP = 'a, h1, h2, h3, h4, h5, h6, code, pre, svg, button, label, input, select, textarea, script, style, th, sub, sup, .chapter-head, .lab, .refs, .eq, .callout .t, .site-foot, .gap-map, .timeline, .glossary-body-link';
const MAX_LINKS = 60;
const HANGUL = /[가-힣]/;
const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function termsFrom(entries, here) {
  const terms = new Map();
  for (const e of entries) {
    if (e.url === here) continue;
    const names = [e.title, ...String(e.en || '').split(','), ...(e.aliases || [])].map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      const korean = HANGUL.test(name);
      if (name.replace(/\s/g, '').length < 3) continue;          // ‘기저’ 같은 두 글자는 다른 낱말과 헷갈리기 쉬워 뺀다
      if (!korean && !/[A-Za-z]/.test(name)) continue;
      if (!terms.has(name)) terms.set(name, e);
      if (!korean && name === name.toLowerCase()) {               // 영문 소문자 용어는 문장 첫머리 대문자도 찾는다
        const cap = name[0].toUpperCase() + name.slice(1);
        if (!terms.has(cap)) terms.set(cap, e);
      }
    }
  }
  return terms;
}

export async function init(root) {
  const article = document.querySelector('.article');
  if (!article) return;
  let entries;
  try {
    const res = await fetch(`${root}data/wiki-index.json`);
    if (!res.ok) return;
    ({ entries = [] } = await res.json());
  } catch { return; }
  const here = location.pathname.replace(/^.*?chapters\//, 'chapters/');
  const terms = termsFrom(entries, here);
  if (!terms.size) return;
  const names = [...terms.keys()].sort((a, b) => b.length - a.length);
  // 앞이 한글·영숫자가 아니어야 한다(‘결정립계가’처럼 뒤에 조사가 붙는 것은 허용). 영문은 뒤도 단어 경계.
  const re = new RegExp(names.map(n => (HANGUL.test(n) ? `(?<![가-힣A-Za-z0-9])${escapeRe(n)}` : `(?<![A-Za-z0-9])${escapeRe(n)}(?![A-Za-z0-9])`)).join('|'), 'g');
  const used = new Set();
  let count = 0;
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
    acceptNode: n => (n.nodeValue.trim() && !n.parentElement.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    if (count >= MAX_LINKS) break;
    const text = node.nodeValue;
    let last = 0, frag = null, m;
    re.lastIndex = 0;
    while ((m = re.exec(text)) && count < MAX_LINKS) {
      const entry = terms.get(m[0]);
      if (!entry || used.has(entry.slug)) continue;
      used.add(entry.slug);
      count += 1;
      frag = frag || document.createDocumentFragment();
      frag.append(text.slice(last, m.index));
      const a = document.createElement('a');
      a.className = 'wiki-auto';
      a.href = `${root}${entry.url}`;
      a.title = `위키: ${entry.title} — ${entry.summary}`;
      a.textContent = m[0];
      frag.append(a);
      last = m.index + m[0].length;
    }
    if (frag) {
      frag.append(text.slice(last));
      node.replaceWith(frag);
    }
  }
}
