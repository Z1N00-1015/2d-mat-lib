"""위키 문서용 SVG 그림(원자 구조, 라만·PL 스펙트럼, 밴드 구조 개념도)을 만든다. 표준 라이브러리만 쓴다.

문서 front matter의 `figures:` 목록에 그림 자료를 적고, 본문에 `{{그림: 이름}}` 또는
`{{그림: 이름 | 캡션}}` 줄을 두면 그 자리에 그림이 들어간다. 이름은 각 줄의 첫 칸이다.

    figures:
    - 구조 | tmd | Mo | S          # tmd / graphene / hbn
    - 라만 | 384:0.7:E′, 404:1:A₁′ | 532 nm   # 위치(cm⁻¹):상대 세기:이름[:선폭]
    - PL | 1.86:1:A | 1.82–1.90    # 에너지(eV):상대 세기:이름[:선폭], 범위(선택)
    - 밴드 | tmd | 1.2 | 1.86      # tmd(bulk 간접 갭, 단층 PL) / dirac / wide | 갭

피크 위치·에너지는 문서의 출처에 있는 값만 쓴다. 세기와 선폭은 모양을 보이기 위한 값이다.
"""

import html
import math

W = 720


def _esc(s):
    return html.escape(str(s))


def _num(s):
    return float(str(s).replace("−", "-").strip())


def _wrap(title, desc, h, inner):
    return ('<svg viewBox="0 0 {0} {1}" role="img"><title>{2}</title><desc>{3}</desc>{4}</svg>').format(
        W, h, _esc(title), _esc(desc), inner)


def _text(x, y, s, cls="label", anchor="middle"):
    return '<text class="{0}" x="{1:.1f}" y="{2:.1f}" text-anchor="{3}">{4}</text>'.format(cls, x, y, anchor, s)


# ── 원자 구조 ───────────────────────────────────────────────────────
def _honeycomb(x0, y0, w, h, L, cls_a, cls_b, ra, rb, cid):
    """위에서 본 벌집 격자. A 자리(lattice point)와 B 자리(A에서 위로 L)."""
    s3 = math.sqrt(3)
    a1, a2 = (s3 * L, 0.0), (s3 * L / 2, 1.5 * L)
    cx, cy = x0 + w / 2, y0 + h / 2
    A = []
    for i in range(-12, 13):
        for j in range(-8, 9):
            x = cx + i * a1[0] + j * a2[0]
            y = cy + j * a2[1]
            if x0 - 2 * L < x < x0 + w + 2 * L and y0 - 2 * L < y < y0 + h + 2 * L:
                A.append((x, y))
    nb = [(0, L), (s3 * L / 2, -L / 2), (-s3 * L / 2, -L / 2)]
    bonds, bsites = [], set()
    for x, y in A:
        for dx, dy in nb:
            bonds.append('<line x1="{0:.1f}" y1="{1:.1f}" x2="{2:.1f}" y2="{3:.1f}"/>'.format(x, y, x + dx, y + dy))
        bsites.add((round(x, 1), round(y + L, 1)))
    out = ['<clipPath id="{0}"><rect x="{1}" y="{2}" width="{3}" height="{4}" rx="12"/></clipPath>'.format(cid, x0, y0, w, h),
           '<rect class="panel" x="{0}" y="{1}" width="{2}" height="{3}" rx="12"/>'.format(x0, y0, w, h),
           '<g clip-path="url(#{0})"><g class="line" style="stroke-width:2">{1}</g>'.format(cid, "".join(bonds))]
    out += ['<circle class="{0}" cx="{1:.1f}" cy="{2:.1f}" r="{3}"/>'.format(cls_b, x, y, rb) for x, y in sorted(bsites)]
    out += ['<circle class="{0}" cx="{1:.1f}" cy="{2:.1f}" r="{3}"/>'.format(cls_a, x, y, ra) for x, y in A]
    # 단위 격자(마름모)
    p = (cx, cy)
    pts = [p, (p[0] + a1[0], p[1]), (p[0] + a1[0] + a2[0], p[1] + a2[1]), (p[0] + a2[0], p[1] + a2[1])]
    out.append('<polygon class="accent-line" style="stroke-dasharray:5 4;fill:none" points="{0}"/>'.format(
        " ".join("{0:.1f},{1:.1f}".format(*q) for q in pts)))
    out.append("</g>")
    out.append('<text class="accent-label" x="{0:.1f}" y="{1:.1f}" text-anchor="middle" style="paint-order:stroke;stroke:var(--surface-2);stroke-width:4px">a</text>'.format(p[0] + a1[0] / 2, p[1] + 5))
    return "".join(out)


def _side_layers(x0, y0, w, h, rows, period, layers, shift, cid, gap_label):
    """옆에서 본 층. rows=[(dy, 클래스, 반지름, x 오프셋 비율)], 층마다 shift만큼 밀린다."""
    out = ['<clipPath id="{0}"><rect x="{1}" y="{2}" width="{3}" height="{4}" rx="12"/></clipPath>'.format(cid, x0, y0, w, h),
           '<rect class="panel" x="{0}" y="{1}" width="{2}" height="{3}" rx="12"/>'.format(x0, y0, w, h),
           '<g clip-path="url(#{0})">'.format(cid)]
    tops, bottoms = [], []
    for li, ly in enumerate(layers):
        off = shift * li * period
        sites = []
        for dy, cls, r, fx in rows:
            xs = [x0 - period + off + (k + fx) * period for k in range(int(w / period) + 3)]
            sites.append([(x, ly + dy, cls, r) for x in xs])
        bonds = []
        for ra, rb in zip(sites, sites[1:]):
            for xa, ya, _, _ in ra:
                for xb, yb, _, _ in rb:
                    if abs(xa - xb) <= period * 0.51 + 0.1 and (xa != xb or len(rows) == 1):
                        bonds.append('<line x1="{0:.1f}" y1="{1:.1f}" x2="{2:.1f}" y2="{3:.1f}"/>'.format(xa, ya, xb, yb))
        if len(rows) == 1:
            xs = sites[0]
            bonds += ['<line x1="{0:.1f}" y1="{1:.1f}" x2="{2:.1f}" y2="{1:.1f}"/>'.format(a[0], a[1], b[0]) for a, b in zip(xs, xs[1:])]
        out.append('<g class="line" style="stroke-width:2">{0}</g>'.format("".join(bonds)))
        for row in sites:
            out += ['<circle class="{0}" cx="{1:.1f}" cy="{2:.1f}" r="{3}"/>'.format(c, x, y, r) for x, y, c, r in row]
        tops.append(ly + min(r[0] for r in rows))
        bottoms.append(ly + max(r[0] for r in rows))
    out.append("</g>")
    for i in range(len(layers) - 1):
        ya, yb = bottoms[i] + 9, tops[i + 1] - 9
        xm = x0 + w - 18
        out.append('<line class="dash" x1="{0}" y1="{1:.1f}" x2="{2}" y2="{1:.1f}"/>'.format(x0 + 10, (ya + yb) / 2, xm - 10))
        out.append('<path class="accent-line" style="stroke-width:1.6" d="M{0} {1:.1f}v{2:.1f}M{3} {1:.1f}h10M{3} {4:.1f}h10"/>'.format(
            xm, ya, yb - ya, xm - 5, yb))
        out.append(_text(xm - 14, (ya + yb) / 2 - 6, gap_label, "accent-label", "end"))
    return "".join(out)


# TMD 옆모습은 2H-MoS₂의 실제 원자 위치 비율로 그린다(a = 3.16 Å, 층 간격 c/2 ≈ 6.15 Å, 금속–칼코겐 높이 차 ≈ 1.59 Å).
# 지그재그 방향을 따라 보면 금속(M)과 칼코겐(X) 기둥이 1.5L(L = a/√3) 간격으로 반복되고,
# 한 층 안에서 X는 M에서 +L(원자 1개)과 −0.5L(앞뒤로 겹친 원자 2개)에 있다. 위아래 X는 같은 자리(삼각 프리즘).
TMD_L, TMD_Z, TMD_C = 3.16 / math.sqrt(3), 1.59, 6.15


def _tmd_side(x0, y0, w, h, stack, scale, cid, gap=True, tags=None):
    """stack: 층마다 (M 자리, X 자리)를 L 단위로. 예) 2H [(0, 1), (1, 0)], 3R [(0, 1), (1, 2), (2, 0)]."""
    step = 1.5 * TMD_L * scale
    n = len(stack)
    top = y0 + (h - ((n - 1) * TMD_C + 2 * TMD_Z) * scale) / 2 + TMD_Z * scale
    cw = w - 40 if tags else w   # 글자 칸을 오른쪽에 비워 둔다
    out = ['<clipPath id="{0}"><rect x="{1}" y="{2}" width="{3}" height="{4}" rx="12"/></clipPath>'.format(cid, x0, y0, cw, h),
           '<rect class="panel" x="{0}" y="{1}" width="{2}" height="{3}" rx="12"/>'.format(x0, y0, w, h),
           '<g clip-path="url(#{0})">'.format(cid)]
    if tags:
        # 맨 아래층 금속 자리를 지나는 세로 점선: 같은 자리로 돌아오는 층을 보여 준다.
        m0 = stack[-1][0]
        out += ['<line class="dash" x1="{0:.1f}" y1="{1}" x2="{0:.1f}" y2="{2}"/>'.format(x0 + 18 + m0 * TMD_L * scale + k * step, y0, y0 + h)
                for k in range(-2, int(w / step) + 3)]
    zs = []
    for i, (m, xpos) in enumerate(stack):
        zc = top + i * TMD_C * scale
        zs.append(zc)
        cols = range(-2, int(w / step) + 3)
        ms = [x0 + 18 + (m * TMD_L * scale) + k * step for k in cols]
        xs = [x0 + 18 + (xpos * TMD_L * scale) + k * step for k in cols]
        bonds = []
        for xm in ms:
            for xx in xs:
                if abs(xm - xx) <= TMD_L * scale + 0.5:
                    for dz in (-TMD_Z, TMD_Z):
                        bonds.append('<line x1="{0:.1f}" y1="{1:.1f}" x2="{2:.1f}" y2="{3:.1f}"/>'.format(xm, zc, xx, zc + dz * scale))
        out.append('<g class="line" style="stroke-width:1.8">{0}</g>'.format("".join(bonds)))
        r = max(4.0, scale * 0.46)
        for dz in (-TMD_Z, TMD_Z):
            out += ['<circle class="atom-3" cx="{0:.1f}" cy="{1:.1f}" r="{2:.1f}"/>'.format(xx, zc + dz * scale, r * 0.85) for xx in xs]
        out += ['<circle class="atom" cx="{0:.1f}" cy="{1:.1f}" r="{2:.1f}"/>'.format(xm, zc, r) for xm in ms]
    out.append("</g>")
    if tags:
        for zc, t in zip(zs, tags):
            out.append(_text(x0 + w - 20, zc + 4, t, "accent-label"))
    if gap and n > 1:
        ya, yb = zs[0] + TMD_Z * scale + 8, zs[1] - TMD_Z * scale - 8
        xm = x0 + w - 18
        out.append('<path class="accent-line" style="stroke-width:1.6" d="M{0} {1:.1f}V{2:.1f}M{3} {1:.1f}h10M{3} {2:.1f}h10"/>'.format(xm, ya, yb, xm - 5))
        out.append('<text class="accent-label" x="{0}" y="{1:.1f}" text-anchor="end" style="paint-order:stroke;stroke:var(--surface-2);stroke-width:4px">반데르발스 간격</text>'.format(xm - 10, (ya + yb) / 2 + 4))
    return "".join(out)


def stacking(args):
    """2H와 3R 적층을 나란히 비교한다. 층 이름은 아래층부터 붙인다(stack과 tags는 위층부터 적는다)."""
    m, x = (list(args) + ["M", "X"])[1:3]
    ph = 268
    left = _tmd_side(20, 34, 320, ph, [(0, 1), (1, 0), (0, 1)], 11.5, "ws-2h", gap=False, tags=["A", "A′", "A"])
    right = _tmd_side(380, 34, 320, ph, [(0, 1), (1, 2), (2, 0)], 11.5, "ws-3r", gap=False, tags=["C", "B", "A"])
    inner = (_text(180, 22, "2H · 층마다 180° 돌아감, 2층 주기", "label-strong") + _text(540, 22, "3R · 같은 방향으로 밀림, 3층 주기", "label-strong")
             + left + right
             + '<circle class="atom" cx="26" cy="321" r="6"/>' + _text(38, 325, "{0} 금속".format(m), "label", "start")
             + '<circle class="atom-3" cx="116" cy="321" r="6"/>' + _text(128, 325, "{0} 칼코겐".format(x), "label", "start")
             + _text(700, 325, "층 이름은 아래층부터 · A′: A를 180° 돌린 층 · 점선: 맨 아래층 금속 자리", "tiny-label", "end"))
    return _wrap("2H와 3R 적층", "아래층부터 2H는 A–A′–A로 이웃 층이 180° 돌아가며 두 층마다 반복되고, 3R은 A–B–C로 같은 방향의 층이 한 칸씩 밀리며 세 층마다 반복된다.", 334, inner)


def structure(args):
    kind = args[0].lower()
    lx, ly, pw, ph = 20, 34, 320, 230
    rx = 380
    if kind == "tmd":
        m, x = (args + ["M", "X"])[1:3]
        top = _honeycomb(lx, ly, pw, ph, 25, "atom", "atom-3", 7.5, 6.5, "wf-top")
        side = _tmd_side(rx, ly, pw, ph, [(0, 1), (1, 0)], 16, "wf-side")
        legend = [("atom", m, "금속"), ("atom-3", x, "칼코겐")]
        title, desc = "{0}{1}₂의 원자 구조".format(m, x), "위에서 보면 {0}과 {1}이 번갈아 놓인 벌집 격자, 옆에서 보면 {1}–{0}–{1} 샌드위치 층이 반데르발스 간격을 두고 쌓인다.".format(m, x)
        lt, rt = "위에서 본 단층", "옆에서 본 2H 이중층({0}–{1}–{0})".format(x, m)
    elif kind == "graphene":
        top = _honeycomb(lx, ly, pw, ph, 26, "atom", "atom", 7, 7, "wf-top")
        side = _side_layers(rx, ly, pw, ph, [(0, "atom", 7, 0.0)], 30, [ly + 70, ly + 160], 0.5, "wf-side", "0.335 nm")
        legend = [("atom", "C", "탄소")]
        title, desc = "그래핀의 원자 구조", "위에서 보면 탄소 원자가 이웃 셋과 결합한 벌집 격자, 옆에서 보면 원자 한 겹 두께의 층이 흑연에서 0.335 nm 간격으로 쌓인다."
        lt, rt = "위에서 본 단층", "옆에서 본 층(흑연)"
    elif kind == "hbn":
        top = _honeycomb(lx, ly, pw, ph, 26, "atom-3", "atom-alt", 7.5, 7.5, "wf-top")
        side = _side_layers(rx, ly, pw, ph, [(0, "atom-3", 7.5, 0.0)], 30, [ly + 70, ly + 160], 0.0, "wf-side", "반데르발스 간격")
        # 옆에서 보면 B와 N이 번갈아 놓이고, 위층의 B 위에 아래층의 N이 온다(AA′ 적층).
        side = side.replace('class="atom-3"', 'class="atom-3 hb"')
        legend = [("atom-3", "B", "붕소"), ("atom-alt", "N", "질소")]
        title, desc = "h-BN의 원자 구조", "위에서 보면 붕소와 질소가 번갈아 놓인 벌집 격자, 옆에서 보면 원자 한 겹 두께의 층이 위층 B 위에 아래층 N이 오도록 쌓인다."
        lt, rt = "위에서 본 단층", "옆에서 본 층(AA′ 적층)"
        side = _hbn_alternate(side)
    else:
        raise ValueError("알 수 없는 구조: " + kind)
    leg, lxp = [], 20
    for cls, sym, name in legend:
        leg.append('<circle class="{0}" cx="{1}" cy="283" r="6"/>'.format(cls, lxp + 6))
        leg.append(_text(lxp + 18, 287, "{0} {1}".format(sym, name), "label", "start"))
        lxp += 90
    inner = (_text(lx + pw / 2, 22, lt, "label-strong") + _text(rx + pw / 2, 22, rt, "label-strong") + top + side + "".join(leg))
    return _wrap(title, desc, 296, inner)


def _hbn_alternate(svg):
    """h-BN 옆모습: 각 층에서 원자를 B, N 번갈아 칠하고, 아래층은 N부터 시작한다(위층 B 아래에 N)."""
    parts = svg.split('<circle class="atom-3 hb"')
    out, layers, idx = [parts[0]], [], 0
    for p in parts[1:]:
        cy = p.split('cy="')[1].split('"')[0]
        if cy not in layers:
            layers.append(cy)
            idx = len(layers) - 1
        out.append('<circle class="{0}"'.format("atom-3" if idx % 2 == 0 else "atom-alt") + p)
        idx += 1
    return "".join(out)


# ── 스펙트럼 ───────────────────────────────────────────────────────
def _peaks(spec, default_w):
    peaks = []
    for item in spec.split(","):
        f = [x.strip() for x in item.split(":")]
        pos, amp = _num(f[0]), _num(f[1]) if len(f) > 1 and f[1] else 1.0
        name = f[2] if len(f) > 2 else ""
        width = _num(f[3]) if len(f) > 3 and f[3] else default_w
        peaks.append((pos, amp, name, width))
    return peaks


def _ticks(lo, hi, step):
    t = math.ceil(lo / step) * step
    while t <= hi + 1e-9:
        yield round(t, 6)
        t += step


def _spectrum(peaks, lo, hi, step, xlabel, fmt, band=None, top_axis=None, title="", desc="", band_label="보고 범위"):
    x0, x1, y0 = 56, W - 24, (96 if top_axis else 56)
    y1 = y0 + 184
    sx = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)
    n = 480
    xs = [lo + (hi - lo) * i / n for i in range(n + 1)]
    ys = [sum(a / (1 + ((x - p) / (w / 2)) ** 2) for p, a, _, w in peaks) for x in xs]
    top = max(ys) or 1
    sy = lambda v: y1 - v / top * (y1 - y0 - 40)
    out = []
    for t in _ticks(lo, hi, step):
        out.append('<line class="grid" x1="{0:.1f}" y1="{1}" x2="{0:.1f}" y2="{2}"/>'.format(sx(t), y0 - 6, y1))
        out.append(_text(sx(t), y1 + 18, fmt(t), "tiny-label"))
    if band:
        a, b = band
        out.append('<rect class="area" x="{0:.1f}" y="{1}" width="{2:.1f}" height="{3}"/>'.format(sx(a), y0 - 6, sx(b) - sx(a), y1 - y0 + 6))
        out.append(_text((sx(a) + sx(b)) / 2, y1 - 8, band_label, "tiny-label"))
    if top_axis:
        conv, tstep, tlabel = top_axis
        # 위쪽 축: 파장(nm). 보기 좋은 파장 눈금을 에너지로 바꿔 찍는다.
        lam_hi, lam_lo = conv(lo), conv(hi)
        lam, last = math.ceil(lam_lo / tstep) * tstep, None
        while lam <= lam_hi:
            e = conv(lam)
            if lo <= e <= hi and (last is None or abs(sx(e) - last) >= 36):
                last = sx(e)
                out.append('<line class="axis" x1="{0:.1f}" y1="{1}" x2="{0:.1f}" y2="{2}"/>'.format(sx(e), y0 - 26, y0 - 21))
                out.append(_text(sx(e), y0 - 30, "{0:.0f}".format(lam), "tiny-label"))
            lam += tstep
        out.append('<line class="axis" x1="{0}" y1="{1}" x2="{2}" y2="{1}"/>'.format(x0, y0 - 21, x1))
        out.append(_text(x1, y0 - 46, tlabel, "tiny-label", "end"))
    d = "M" + " L".join("{0:.1f} {1:.1f}".format(sx(x), sy(y)) for x, y in zip(xs, ys))
    out.append('<path class="area" style="opacity:.45" d="{0} L{1:.1f} {3} L{2:.1f} {3} Z"/>'.format(d, sx(hi), sx(lo), y1))
    out.append('<path class="accent-line" d="{0}"/>'.format(d))
    out.append('<line class="axis" x1="{0}" y1="{1}" x2="{2}" y2="{1}"/>'.format(x0, y1, x1))
    out.append('<line class="axis" x1="{0}" y1="{1}" x2="{0}" y2="{2}"/>'.format(x0, y1, y0 - 6))
    out.append('<text class="tiny-label" transform="translate(22 {0}) rotate(-90)" text-anchor="middle">세기 (상대값)</text>'.format((y0 + y1) / 2))
    out.append(_text((x0 + x1) / 2, y1 + 38, xlabel, "label"))
    placed = []
    for p, a, name, w in sorted(peaks, key=lambda q: -q[1]):
        if not name:
            continue
        x, y = sx(p), sy(sum(b / (1 + ((p - q) / (v / 2)) ** 2) for q, b, _, v in peaks))
        dx = 0
        for px in placed:
            if abs(px - (x + dx)) < 64:
                dx = 64 if x >= px else -64
        placed.append(x + dx)
        if dx:
            out.append('<line class="thin" x1="{0:.1f}" y1="{1:.1f}" x2="{2:.1f}" y2="{3:.1f}"/>'.format(x, y - 3, x + dx, y - 14))
        out.append(_text(x + dx, y - 30, name, "accent-label"))
        out.append(_text(x + dx, y - 17, fmt(p), "tiny-label"))
    return _wrap(title, desc, y1 + 50, "".join(out))


def raman(args):
    peaks = _peaks(args[0], 4)
    laser = args[1] if len(args) > 1 else ""
    pos = [p for p, _, _, _ in peaks]
    span = max(pos) - min(pos)
    pad = max(25, span * 0.15)
    lo, hi = min(pos) - pad, max(pos) + pad
    step = next(s for s in (5, 10, 20, 50, 100, 200, 250, 500) if (hi - lo) / s <= 9)
    xlabel = "라만 이동 (cm⁻¹)" + (" · 들뜸 레이저 {0}".format(laser) if laser else "")
    desc = "라만 피크: " + ", ".join("{0} {1:g} cm⁻¹".format(n, p) for p, _, n, _ in peaks if n)
    return _spectrum(peaks, lo, hi, step, xlabel, lambda v: "{0:g}".format(v), title="라만 스펙트럼", desc=desc)


def pl(args):
    peaks = _peaks(args[0], 0.06)
    band = None
    if len(args) > 1 and args[1]:
        a, b = args[1].replace("–", "-").split("-")
        band = (_num(a), _num(b))
    pos = [p for p, _, _, _ in peaks] + (list(band) if band else [])
    lo, hi = round(min(pos) - 0.32, 1), round(max(pos) + 0.32, 1)
    desc = "PL 피크: " + ", ".join("{0} {1:g} eV".format(n, p) for p, _, n, _ in peaks if n)
    return _spectrum(peaks, lo, hi, 0.1, "광자 에너지 (eV)", lambda v: "{0:.2f}".format(v).rstrip("0").rstrip("."), band=band,
                     top_axis=(lambda v: 1239.84 / v, 25, "파장 (nm)"), title="PL 스펙트럼", desc=desc)


# ── 밴드 구조 개념도 ────────────────────────────────────────────────
def _panel(x0, title):
    return ('<rect class="panel" x="{0}" y="34" width="320" height="236" rx="12"/>'
            '<clipPath id="wb{0}"><rect x="{0}" y="34" width="320" height="236" rx="12"/></clipPath>').format(x0) + _text(x0 + 160, 22, title, "label-strong")


def _curve(points, cls):
    return '<path class="{0}" d="M{1}"/>'.format(cls, " L".join("{0:.1f} {1:.1f}".format(x, y) for x, y in points))


def band(args):
    kind = args[0].lower()
    out = []
    if kind == "tmd":
        bulk, mono = args[1], args[2]
        # 에너지(eV 비슷한 상대 단위)로 그린 뒤 화면 좌표로 바꾼다. 값은 개념을 보이기 위한 것이다.
        ey = lambda e: 206 - e * 62
        for x0, name, direct, gap in [(20, "bulk · 간접 밴드갭", False, bulk), (380, "단층 · 직접 밴드갭", True, mono)]:
            out.append(_panel(x0, name))
            gx, qx, kx = x0 + 60, x0 + 160, x0 + 250   # Γ, Q(Λ), K
            ks = [x0 + 24 + i * 2 for i in range(137)]
            eq, ek, vk, vg = (1.15, 1.75, -0.45, 0.0) if not direct else (2.15, 1.75, 0.0, -0.4)
            cb = [(x, ey(min(eq + ((x - qx) / 42) ** 2 * 0.9, ek + ((x - kx) / 34) ** 2 * 0.9, 9))) for x in ks]
            vb = [(x, ey(max(vg - ((x - gx) / 50) ** 2 * 0.9, vk - ((x - kx) / 34) ** 2 * 0.9, -9))) for x in ks]
            out.append('<g clip-path="url(#wb{0})">{1}{2}</g>'.format(x0, _curve(cb, "teal-line"), _curve(vb, "rose-line")))
            cbm = max(cb, key=lambda p: p[1])
            vbm = min(vb, key=lambda p: p[1])
            out.append('<path class="accent-line" style="stroke-width:2;stroke-dasharray:5 4" d="M{0:.1f} {1:.1f} L{2:.1f} {3:.1f}"/>'.format(vbm[0], vbm[1] - 6, cbm[0], cbm[1] + 6))
            out.append('<circle class="atom" cx="{0:.1f}" cy="{1:.1f}" r="4"/><circle class="atom" cx="{2:.1f}" cy="{3:.1f}" r="4"/>'.format(vbm[0], vbm[1], cbm[0], cbm[1]))
            label = (("PL 약 " if direct else "약 ") + _esc(gap) + " eV") if gap not in ("", "-") else ("직접 전이" if direct else "간접 전이")
            lx = max(vbm[0], cbm[0]) + 10
            out.append(_text(lx, (vbm[1] + cbm[1]) / 2 + 4, label, "accent-label", "start"))
            for x, sym in ((gx, "Γ"), (qx, "Q"), (kx, "K")):
                out.append('<line class="grid" x1="{0}" y1="46" x2="{0}" y2="252"/>'.format(x))
                out.append(_text(x, 264, sym, "math"))
        out.append(_text(20, 288, "전도대", "teal-label", "start") + _text(80, 288, "가전자대", "rose-label", "start"))
        title = "층수에 따른 밴드 구조 변화"
        desc = "bulk에서는 가전자대 꼭대기(Γ)와 전도대 바닥(Q)이 달라 간접 밴드갭이고, 단층에서는 둘 다 K점에 있어 직접 밴드갭이 된다."
        h = 296
    elif kind == "dirac":
        x0 = 200
        out.append(_panel(x0, "K점 근처의 디랙 원뿔"))
        cx, cy = x0 + 160, 152
        out.append('<ellipse class="thin" cx="{0}" cy="{1}" rx="80" ry="14"/><ellipse class="thin" cx="{0}" cy="{2}" rx="80" ry="14"/>'.format(cx, cy - 80, cy + 80))
        out.append('<path class="teal-line" d="M{0} {1} L{2} {3} L{4} {1}"/>'.format(cx - 80, cy - 80, cx, cy, cx + 80))
        out.append('<path class="rose-line" d="M{0} {1} L{2} {3} L{4} {1}"/>'.format(cx - 80, cy + 80, cx, cy, cx + 80))
        out.append('<line class="dash" x1="{0}" y1="{1}" x2="{2}" y2="{1}"/>'.format(x0 + 24, cy, x0 + 296))
        out.append('<circle class="atom" cx="{0}" cy="{1}" r="4.5"/>'.format(cx, cy))
        out.append(_text(cx + 12, cy - 8, "디랙점 · 밴드갭 0", "accent-label", "start"))
        out.append(_text(x0 + 300, cy - 4, 'E<tspan baseline-shift="sub" font-size="9">F</tspan>', "math", "end"))
        out.append(_text(cx + 88, cy - 76, "전도대", "teal-label", "start") + _text(cx + 88, cy + 88, "가전자대", "rose-label", "start"))
        out.append(_text(cx, 264, "E ∝ |k| (선형 분산)", "tiny-label"))
        title = "그래핀의 디랙 원뿔"
        desc = "그래핀은 K점에서 전도대와 가전자대가 한 점에서 맞닿아 밴드갭이 0이고, 그 근처에서 에너지가 운동량에 비례한다."
        h = 280
    elif kind == "wide":
        gap = args[1]
        x0 = 200
        out.append(_panel(x0, "넓은 밴드갭 절연체"))
        ks = [x0 + 30 + i * 2 for i in range(131)]
        cx = x0 + 160
        cb = [(x, 96 - ((x - cx) / 90) ** 2 * 16) for x in ks]
        vb = [(x, 214 + ((x - cx) / 90) ** 2 * 16) for x in ks]
        out.append('<rect class="area" style="opacity:.35" x="{0}" y="80" width="260" height="150"/>'.format(x0 + 30))
        out.append('<g clip-path="url(#wb{0})">{1}{2}</g>'.format(x0, _curve(cb, "teal-line"), _curve(vb, "rose-line")))
        out.append('<path class="accent-line" style="stroke-width:2" d="M{0} 100 V210 M{1} 100 h10 M{1} 210 h10"/>'.format(cx, cx - 5))
        out.append(_text(cx + 12, 160, "약 " + _esc(gap) + " eV", "accent-label", "start"))
        out.append(_text(cx + 90, 68, "전도대", "teal-label") + _text(cx + 90, 258, "가전자대", "rose-label"))
        title = "넓은 밴드갭"
        desc = "전도대와 가전자대 사이가 약 {0} eV로 넓어 전자가 쉽게 넘어가지 못하므로 절연체로 쓰인다.".format(gap)
        h = 280
    else:
        raise ValueError("알 수 없는 밴드 종류: " + kind)
    return _wrap(title, desc, h, "".join(out))


KINDS = {"구조": structure, "적층": stacking, "라만": raman, "pl": pl, "밴드": band}


def render(spec):
    """'라만 | 384:0.7:E′, 404:1:A₁′ | 532 nm' 같은 한 줄을 (이름, svg)로 바꾼다."""
    f = [x.strip() for x in spec.split("|")]
    name = f[0]
    import wiki_analysis  # 분석법 그림
    import wiki_concepts  # 개념 그림(결정학·전자 구조)
    import wiki_devices  # 소자 그림
    import wiki_matter  # 물성 그림(자성·분극·스핀)
    import wiki_struct  # 적층·이종구조·공정·물질 그림
    fn = None
    for table in (KINDS, wiki_concepts.KINDS, wiki_analysis.KINDS, wiki_devices.KINDS, wiki_matter.KINDS, wiki_struct.KINDS):
        fn = fn or table.get(name.lower())
    if not fn:
        raise ValueError("알 수 없는 그림 종류: " + name)
    return name, fn(f[1:])
