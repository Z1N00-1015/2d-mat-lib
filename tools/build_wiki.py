#!/usr/bin/env python3
"""위키 문서(wiki/*.md)를 사이트 페이지(chapters/wiki/*.html)로 만든다.

표준 라이브러리만 쓴다. 저장소 폴더에서 실행한다.
    python3 tools/build_wiki.py

만들어지는 것
- chapters/wiki/<문서>.html : 문서 페이지 (관련 문서·역링크·본문 장·참고문헌 포함)
- chapters/wiki/index.html  : 전체 문서 목록, 분류, 아직 없는 문서(빨간 링크) 목록
- data/wiki-index.json      : 검색·용어 사전 연결용 색인
이 결과물은 저장소에 넣지 않고(.gitignore), 배포할 때 GitHub Actions가 다시 만든다.

문서 형식(wiki/*.md)
    ---
    title: 화학 기상 증착
    en: chemical vapor deposition, CVD
    aliases: CVD, 화학기상증착
    category: 공정
    status: 초안            # 초안 / 검토됨
    reviewed: 2026-10-27
    summary: 한두 문장 요약
    related: 유기금속 화학 기상 증착, 결정립계
    chapter: materials/synthesis   # 이 내용을 자세히 다루는 장(선택)
    sources:
    - Kang et al., Nature (2015) | https://doi.org/10.1038/nature14417
    info:
    - 결정 구조 | 2H (삼각 프리즘)
    ---
    본문은 마크다운: ## 제목, 문단, - 목록, 1. 목록, > 메모, | 표 |, **굵게**, *기울임*, `코드`,
    [글자](주소), [[문서 제목]], [[문서 제목|보여 줄 글자]]. <sub>·<sup> 같은 짧은 HTML 태그도 쓸 수 있다.
"""

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "wiki"
OUT = ROOT / "chapters" / "wiki"
INDEX_JSON = ROOT / "data" / "wiki-index.json"
EDIT_URL = "https://github.com/z1n00-1015/2d-mat-lib/edit/main/wiki/{0}.md"
NEW_URL = "https://github.com/z1n00-1015/2d-mat-lib/new/main/wiki"
CATEGORY_ORDER = ["물질", "결정학", "전자 구조", "물성", "공정", "분석법", "소자", "연구 분야", "기타"]
LIST_KEYS = {"sources", "info"}
COMMA_KEYS = {"aliases", "related"}


# ── 문서 읽기 ──────────────────────────────────────────────────────
def parse_doc(path):
    text = path.read_text(encoding="utf-8")
    meta, body = {}, text
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end < 0:
            sys.exit("{0}: front matter가 닫히지 않았습니다(---).".format(path.name))
        head, body = text[3:end], text[end + 4:]
        key = None
        for raw in head.splitlines():
            line = raw.rstrip()
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            if line.lstrip().startswith("- ") and key in LIST_KEYS:
                meta[key].append(line.lstrip()[2:].strip())
                continue
            k, _, v = line.partition(":")
            key, v = k.strip(), re.sub(r"\s+#.*$", "", v).strip()
            if key in LIST_KEYS:
                meta[key] = []
            elif key in COMMA_KEYS:
                meta[key] = [x.strip() for x in v.split(",") if x.strip()]
            else:
                meta[key] = v
    for need in ("title", "category", "summary"):
        if not meta.get(need):
            sys.exit("{0}: '{1}' 항목이 필요합니다.".format(path.name, need))
    meta.setdefault("en", "")
    meta.setdefault("aliases", [])
    meta.setdefault("related", [])
    meta.setdefault("sources", [])
    meta.setdefault("info", [])
    meta.setdefault("status", "초안")
    meta.setdefault("reviewed", "")
    meta.setdefault("chapter", "")
    if meta["category"] not in CATEGORY_ORDER:
        meta["category"] = "기타"
    meta["slug"] = path.stem
    meta["body"] = body.strip()
    return meta


def keys_for(doc):
    """[[링크]]가 이 문서를 가리킬 수 있는 이름들(제목, 영문 각 부분, 별칭)."""
    names = [doc["title"], doc["en"]] + [x.strip() for x in doc["en"].split(",")] + doc["aliases"]
    return {norm(n) for n in names if n and n.strip()}


def plain(text):
    """요약을 목록·검색에 쓸 때 마크다운 표시를 걷어 낸다."""
    text = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", text)
    text = re.sub(r"\[\[([^\]]+)\]\]", r"\1", text)
    return re.sub(r"\*\*|`", "", text)


def norm(name):
    return re.sub(r"\s+", " ", name.strip()).lower()


# ── 마크다운(간단한 부분 집합) ─────────────────────────────────────
class Renderer:
    def __init__(self, lookup, current):
        self.lookup, self.current = lookup, current
        self.links, self.missing = set(), set()

    def wikilink(self, m):
        target, _, label = m.group(1).partition("|")
        target, label = target.strip(), (label or target).strip()
        doc = self.lookup.get(norm(target))
        if doc:
            self.links.add(doc["slug"])
            if doc["slug"] == self.current:
                return "<b>{0}</b>".format(label)
            return '<a class="wiki-link" href="{0}.html" title="{1}">{2}</a>'.format(doc["slug"], html.escape(doc["title"]), label)
        self.missing.add(target)
        return '<span class="wiki-missing" title="아직 없는 문서">{0}</span>'.format(label)

    def inline(self, text):
        text = re.sub(r"\[\[([^\]]+)\]\]", self.wikilink, text)
        text = re.sub(r"`([^`]+)`", lambda m: "<code>{0}</code>".format(html.escape(m.group(1))), text)
        text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
        text = re.sub(r"(?<![\*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\*)", r"<em>\1</em>", text)
        text = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+|[\w./#-]+)\)",
                      lambda m: '<a href="{1}"{2}>{0}</a>'.format(
                          m.group(1), m.group(2), ' target="_blank" rel="noopener"' if m.group(2).startswith("http") else ""), text)
        return text

    def render(self, md):
        out, para, lst, table = [], [], None, []
        lines = md.splitlines() + [""]

        def flush_para():
            if para:
                out.append("<p>{0}</p>".format(self.inline(" ".join(para))))
                para.clear()

        def flush_list():
            nonlocal lst
            if lst:
                tag, items = lst
                out.append("<{0}>{1}</{0}>".format(tag, "".join("<li>{0}</li>".format(self.inline(i)) for i in items)))
                lst = None

        def flush_table():
            if not table:
                return
            rows = [[c.strip() for c in r.strip().strip("|").split("|")] for r in table]
            head, body = rows[0], [r for r in rows[1:] if not all(re.fullmatch(r":?-{2,}:?", c) for c in r)]
            out.append('<div class="table-wrap"><table><thead><tr>{0}</tr></thead><tbody>{1}</tbody></table></div>'.format(
                "".join("<th>{0}</th>".format(self.inline(c)) for c in head),
                "".join("<tr>{0}</tr>".format("".join("<td>{0}</td>".format(self.inline(c)) for c in r)) for r in body)))
            table.clear()

        for raw in lines:
            line = raw.rstrip()
            s = line.strip()
            if s.startswith("|"):
                flush_para(); flush_list(); table.append(s); continue
            flush_table()
            m = re.match(r"^(#{2,3})\s+(.*)$", s)
            if m:
                flush_para(); flush_list()
                out.append("<h{0}>{1}</h{0}>".format(len(m.group(1)), self.inline(m.group(2))))
                continue
            m = re.match(r"^(-|\d+\.)\s+(.*)$", s)
            if m:
                flush_para()
                tag = "ul" if m.group(1) == "-" else "ol"
                if not lst or lst[0] != tag:
                    flush_list(); lst = (tag, [])
                lst[1].append(m.group(2))
                continue
            if s.startswith(">"):
                flush_para(); flush_list()
                out.append('<div class="callout note"><p>{0}</p></div>'.format(self.inline(s.lstrip("> ").strip())))
                continue
            if not s:
                flush_para(); flush_list(); continue
            if lst and raw.startswith("  "):
                lst[1][-1] += " " + s
                continue
            flush_list()
            para.append(s)
        return "\n  ".join(out)


# ── 장 본문에서 문서 이름 찾기 ──────────────────────────────────────
def load_chapters():
    chapters = []
    for path in sorted((ROOT / "chapters").glob("*/*.html")):
        if path.parent.name in ("wiki", "tools"):
            continue
        raw = path.read_text(encoding="utf-8")
        if 'http-equiv="refresh"' in raw:
            continue
        title = re.search(r"<h1>(.*?)</h1>", raw, flags=re.S)
        art = re.search(r"<article[^>]*>(.*)</article>", raw, flags=re.S)
        text = re.sub(r"<(script|style|svg)[^>]*>.*?</\1>", " ", art.group(1) if art else raw, flags=re.S)
        text = html.unescape(re.sub(r"<[^>]+>", " ", text))
        chapters.append({"path": "{0}/{1}".format(path.parent.name, path.stem),
                         "title": re.sub(r"<[^>]+>", "", title.group(1)).strip() if title else path.stem, "text": text})
    return chapters


def mentions(doc, chapters):
    """제목(3글자 이상)이나 영문·약어(3글자 이상, 단어 경계)가 두 번 이상 나오는 장. 많이 나오는 순으로 최대 6개."""
    pats = []
    if len(doc["title"]) >= 3:
        pats.append(re.compile(re.escape(doc["title"])))
    for term in [x.strip() for x in doc["en"].split(",")] + doc["aliases"]:
        if len(term) >= 3 and re.fullmatch(r"[\w\s'’\-–()₂₃·.]+", term):
            flags = 0 if term.isupper() else re.I
            pats.append(re.compile(r"(?<![\w]){0}(?![\w])".format(re.escape(term)), flags))
    found = []
    for ch in chapters:
        hits = sum(len(p.findall(ch["text"])) for p in pats)
        if ch["path"] == doc["chapter"] or hits >= 2:
            found.append((ch["path"] != doc["chapter"], -hits, ch))
    found.sort(key=lambda x: (x[0], x[1]))
    return [ch for _, _, ch in found[:6]]


# ── 페이지 틀 ──────────────────────────────────────────────────────
def page_head():
    """장 페이지와 같은 CSS·런타임 버전을 쓰도록 intro.html의 <head>에서 가져온다."""
    raw = (ROOT / "chapters" / "materials" / "intro.html").read_text(encoding="utf-8")
    keep = [l for l in raw.splitlines() if re.search(r'<link rel="(icon|stylesheet)"|<script', l)]
    return "\n".join(keep)


def page(title, body_attrs, inner):
    return ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
            '<title>{0} · 위키 · Beyond Silicon</title>\n{1}\n</head>\n<body data-root="../../" data-field="wiki" {2}>\n'
            '<main class="main"><article class="article wiki-article">\n{3}\n</article></main>\n</body>\n</html>\n').format(
        html.escape(title), page_head(), body_attrs, inner)


def badge(status):
    cls = "is-reviewed" if status == "검토됨" else "is-draft"
    return '<span class="wiki-status {0}">{1}</span>'.format(cls, html.escape(status))


def link_list(items):
    return "<ul class=\"wiki-links\">{0}</ul>".format("".join(items))


def render_doc(doc, docs, lookup, backlinks, chapters):
    r = Renderer(lookup, doc["slug"])
    body = r.render(doc["body"]) if doc["body"] else ""
    parts = []
    head = ['<header class="chapter-head wiki-head">',
            '  <div class="eyebrow">WIKI · {0}</div>'.format(html.escape(doc["category"])),
            "  <h1>{0}</h1>".format(html.escape(doc["title"])),
            '  <p class="wiki-en">{0}</p>'.format(html.escape(doc["en"])) if doc["en"] else "",
            '  <p class="lede">{0}</p>'.format(r.inline(doc["summary"])),
            '  <div class="meta">{0}{1}<a class="wiki-edit" href="{2}" target="_blank" rel="noopener">GitHub에서 고치기 ↗</a></div>'.format(
                badge(doc["status"]), '<span class="chip">검토일 {0}</span>'.format(doc["reviewed"]) if doc["reviewed"] else "",
                EDIT_URL.format(doc["slug"])),
            "</header>"]
    parts.append("\n".join(x for x in head if x))
    if doc["info"]:
        rows = []
        for item in doc["info"]:
            k, _, v = item.partition("|")
            rows.append("<tr><th>{0}</th><td>{1}</td></tr>".format(r.inline(k.strip()), r.inline(v.strip())))
        parts.append('<aside class="wiki-infobox"><div class="wiki-infobox-title">{0}</div><table>{1}</table></aside>'.format(
            html.escape(doc["title"]), "".join(rows)))
    if body:
        parts.append(body)
    else:
        parts.append('<div class="callout note"><span class="t">아직 짧은 문서입니다</span><p>용어 사전의 정의만 옮겨 둔 초안입니다. '
                     '원리, 2D 물질에서의 의미, 관련 연구를 출처와 함께 채워 주세요.</p></div>')
    rel = []
    for name in doc["related"]:
        d = lookup.get(norm(name))
        if d and d["slug"] != doc["slug"]:
            r.links.add(d["slug"])
            rel.append('<li><a class="wiki-link" href="{0}.html">{1}</a> <small>{2}</small></li>'.format(d["slug"], html.escape(d["title"]), html.escape(plain(d["summary"])[:60])))
        elif not d:
            r.missing.add(name)
            rel.append('<li><span class="wiki-missing" title="아직 없는 문서">{0}</span></li>'.format(html.escape(name)))
    if rel:
        parts.append("<h2>관련 문서</h2>\n" + link_list(rel))
    back = sorted(backlinks.get(doc["slug"], []), key=lambda s: docs[s]["title"])
    if back:
        parts.append("<h2>이 문서를 가리키는 문서</h2>\n" + link_list(
            '<li><a class="wiki-link" href="{0}.html">{1}</a></li>'.format(s, html.escape(docs[s]["title"])) for s in back))
    chs = mentions(doc, chapters)
    if chs:
        parts.append("<h2>본문에서 다루는 장</h2>\n" + link_list(
            '<li><a href="../{0}.html">{1}</a>{2}</li>'.format(c["path"], html.escape(c["title"]), " <small>자세한 설명</small>" if c["path"] == doc["chapter"] else "")
            for c in chs))
    if doc["sources"]:
        src = []
        for s in doc["sources"]:
            label, _, url = s.partition("|")
            label, url = label.strip(), url.strip()
            src.append("<li>{0}</li>".format('<a href="{0}" target="_blank" rel="noopener">{1}</a>'.format(html.escape(url), r.inline(label)) if url else r.inline(label)))
        parts.append("<h2>참고문헌</h2>\n<ol class=\"wiki-sources\">{0}</ol>".format("".join(src)))
    return page(doc["title"], 'data-chapter="{0}"'.format(doc["slug"]), "  " + "\n  ".join(parts)), r


def render_index(docs, missing):
    by_cat = {}
    for d in docs.values():
        by_cat.setdefault(d["category"], []).append(d)
    cats = [c for c in CATEGORY_ORDER if c in by_cat]
    reviewed = sum(1 for d in docs.values() if d["status"] == "검토됨")
    parts = ['<header class="chapter-head">\n    <div class="eyebrow">WIKI</div>\n    <h1>위키 문서</h1>\n'
             '    <p class="lede">2D 물질과 반도체 연구의 개념·물질·공정·분석법을 문서 하나에 하나씩 정리합니다. 문서끼리 [[링크]]로 이어지고, 각 문서에서 관련 장과 참고문헌으로 이동할 수 있습니다.</p>\n'
             '    <div class="meta"><span class="chip">문서 {0}개</span><span class="chip">검토됨 {1}개</span><span class="chip">아직 없는 문서 {2}개</span></div>\n  </header>'.format(
                 len(docs), reviewed, len(missing))]
    parts.append('<div class="wiki-index" data-module="wiki-index">\n    <div class="gloss-bar"><input type="search" placeholder="문서 검색 (예: CVD, 모아레, 밴드갭)" aria-label="위키 문서 검색"><span class="note" data-o="count"></span></div>\n'
                 '    <nav class="wiki-cat-nav">{0}</nav>'.format("".join('<a href="#cat-{0}">{1} <small>{2}</small></a>'.format(i, html.escape(c), len(by_cat[c])) for i, c in enumerate(cats))))
    for i, c in enumerate(cats):
        items = sorted(by_cat[c], key=lambda d: d["title"])
        parts.append('<section class="wiki-cat" id="cat-{0}"><h2>{1}</h2><ul class="wiki-list">{2}</ul></section>'.format(
            i, html.escape(c), "".join(
                '<li data-q="{0}"><a href="{1}.html"><b>{2}</b> <span class="wiki-en">{3}</span></a>{4}<p>{5}</p></li>'.format(
                    html.escape(" ".join([d["title"], d["en"]] + d["aliases"] + [plain(d["summary"])]).lower()), d["slug"], html.escape(d["title"]),
                    html.escape(d["en"]), badge(d["status"]) if d["status"] == "검토됨" else "", html.escape(plain(d["summary"]))) for d in items)))
    parts.append("</div>")
    if missing:
        rows = sorted(missing.items(), key=lambda kv: (-len(kv[1]), kv[0]))
        parts.append('<h2>아직 없는 문서</h2>\n<p>다른 문서에서 링크했지만 아직 쓰지 않은 문서입니다. '
                     '<a href="{0}" target="_blank" rel="noopener">새 문서 만들기 ↗</a></p>\n<ul class="wiki-missing-list">{1}</ul>'.format(
                         NEW_URL, "".join('<li><span class="wiki-missing">{0}</span> <small>{1}곳에서 링크</small></li>'.format(html.escape(k), len(v)) for k, v in rows)))
    parts.append('<h2>문서 쓰는 법</h2>\n<p>문서는 저장소의 <code>wiki/</code> 폴더에 마크다운 파일로 있습니다. 형식은 <code>tools/build_wiki.py</code> 맨 위 설명과 <code>wiki/README.md</code>를 참고하세요. '
                 '모든 사실에는 출처를 달고, 확인하지 않은 수치는 넣지 않습니다.</p>')
    return page("위키 문서", 'data-chapter="index"', "  " + "\n  ".join(parts))


def main():
    paths = sorted(p for p in SRC.glob("*.md") if p.name.lower() != "readme.md")
    docs = {}
    for p in paths:
        d = parse_doc(p)
        docs[d["slug"]] = d
    lookup = {}
    for d in docs.values():
        for k in keys_for(d):
            if k in lookup and lookup[k]["slug"] != d["slug"]:
                print("주의: '{0}' 이름이 {1}와 {2}에 함께 있습니다.".format(k, lookup[k]["slug"], d["slug"]))
                continue
            lookup[k] = d
    # 1차: 링크 수집(역링크용)
    backlinks, missing = {}, {}
    for d in docs.values():
        r = Renderer(lookup, d["slug"])
        r.render(d["body"])
        for name in d["related"]:
            t = lookup.get(norm(name))
            (r.links.add(t["slug"]) if t else r.missing.add(name))
        for s in r.links:
            if s != d["slug"]:
                backlinks.setdefault(s, set()).add(d["slug"])
        for m in r.missing:
            missing.setdefault(m, set()).add(d["slug"])
    chapters = load_chapters()
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.html"):
        old.unlink()
    for d in docs.values():
        html_text, _ = render_doc(d, docs, lookup, backlinks, chapters)
        (OUT / "{0}.html".format(d["slug"])).write_text(html_text, encoding="utf-8")
    (OUT / "index.html").write_text(render_index(docs, missing), encoding="utf-8")
    index = [{"slug": d["slug"], "title": d["title"], "en": d["en"], "aliases": d["aliases"], "category": d["category"],
              "status": d["status"], "summary": plain(d["summary"]), "url": "chapters/wiki/{0}.html".format(d["slug"])}
             for d in sorted(docs.values(), key=lambda d: d["title"])]
    INDEX_JSON.write_text(json.dumps({"entries": index}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print("위키 문서 {0}개, 아직 없는 문서 {1}개 → {2}".format(len(docs), len(missing), OUT.relative_to(ROOT)))


if __name__ == "__main__":
    main()
