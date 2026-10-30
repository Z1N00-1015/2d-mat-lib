"""위키 개념 문서용 SVG 그림(결정학·전자 구조). wiki_figures.py가 불러 쓴다. 표준 라이브러리만 쓴다.

그림은 개념을 보이기 위한 도식이다. 숫자를 적는 그림은 문서의 출처에 있는 값만 쓴다.
"""

import math

from wiki_figures import W, _esc, _text, _wrap

S3 = math.sqrt(3)


# ── 공용 도구 ───────────────────────────────────────────────────────
def panel(x, y, w, h, title=None):
    out = '<rect class="panel" x="{0:.1f}" y="{1:.1f}" width="{2:.1f}" height="{3:.1f}" rx="12"/>'.format(x, y, w, h)
    if title:
        out += _text(x + w / 2, y - 10, title, "label-strong")
    return out


def clip(cid, x, y, w, h):
    return '<clipPath id="{0}"><rect x="{1:.1f}" y="{2:.1f}" width="{3:.1f}" height="{4:.1f}" rx="12"/></clipPath>'.format(cid, x, y, w, h)


def dot(x, y, r=4.5, cls="atom"):
    return '<circle class="{0}" cx="{1:.1f}" cy="{2:.1f}" r="{3}"/>'.format(cls, x, y, r)


def line(x1, y1, x2, y2, cls="line", style=""):
    st = ' style="{0}"'.format(style) if style else ""
    return '<line class="{0}" x1="{1:.1f}" y1="{2:.1f}" x2="{3:.1f}" y2="{4:.1f}"{5}/>'.format(cls, x1, y1, x2, y2, st)


def arrow(x1, y1, x2, y2, color="accent", width=2.2, dash=False, head=8):
    """끝에 삼각형 머리가 달린 화살표. color: accent/teal/amber/rose/text."""
    ang = math.atan2(y2 - y1, x2 - x1)
    bx, by = x2 - head * math.cos(ang), y2 - head * math.sin(ang)
    lcls = "line" if color == "text" else color + "-line"
    hcls = "arrowhead" if color == "text" else "arrowhead-" + color
    st = "stroke-width:{0}".format(width) + (";stroke-dasharray:5 4" if dash else "")
    pts = [(x2, y2), (bx + head * 0.5 * math.sin(ang), by - head * 0.5 * math.cos(ang)),
           (bx - head * 0.5 * math.sin(ang), by + head * 0.5 * math.cos(ang))]
    return (line(x1, y1, bx, by, lcls, st) +
            '<polygon class="{0}" points="{1}"/>'.format(hcls, " ".join("{0:.1f},{1:.1f}".format(*p) for p in pts)))


def poly(pts, cls, style=""):
    st = ' style="{0}"'.format(style) if style else ""
    return '<polygon class="{0}" points="{1}"{2}/>'.format(cls, " ".join("{0:.1f},{1:.1f}".format(*p) for p in pts), st)


def path(pts, cls, style=""):
    st = ' style="{0}"'.format(style) if style else ""
    return '<path class="{0}" d="M{1}"{2}/>'.format(cls, " L".join("{0:.1f} {1:.1f}".format(*p) for p in pts), st)


def label(x, y, s, cls="label", anchor="middle"):
    """배경색 테두리를 둘러 선 위에서도 읽히는 글자."""
    return ('<text class="{0}" x="{1:.1f}" y="{2:.1f}" text-anchor="{3}" '
            'style="paint-order:stroke;stroke:var(--surface-2);stroke-width:4px;stroke-linejoin:round">{4}</text>').format(cls, x, y, anchor, s)


def lattice_points(x0, y0, w, h, a1, a2, origin, pad=30):
    pts = []
    for i in range(-30, 31):
        for j in range(-30, 31):
            x = origin[0] + i * a1[0] + j * a2[0]
            y = origin[1] + i * a1[1] + j * a2[1]
            if x0 - pad <= x <= x0 + w + pad and y0 - pad <= y <= y0 + h + pad:
                pts.append((x, y))
    return pts


def legend(items, y, x=20):
    out = []
    for cls, name in items:
        out.append(dot(x + 6, y - 4, 6, cls) + _text(x + 18, y, name, "label", "start"))
        x += 34 + 13 * len(name)
    return "".join(out)


# ── 결정학 ─────────────────────────────────────────────────────────
def crystal(args):
    """격자 + 기저 = 결정 구조 (h-BN 예)."""
    out, w, h, y = [], 200, 200, 40
    xs = [20, 260, 500]
    L = 22
    a1, a2 = (S3 * L, 0), (S3 * L / 2, -1.5 * L)
    for k, (x0, t) in enumerate(zip(xs, ["격자(격자점만)", "기저(원자 2개)", "결정 구조"])):
        out.append(panel(x0, y, w, h, t) + clip("cr%d" % k, x0, y, w, h))
    # 1) 격자
    o = (xs[0] + 70, y + 130)
    pts = lattice_points(xs[0], y, w, h, a1, a2, o)
    g = [dot(px, py, 3.6, "atom-4") for px, py in pts]
    cell = [o, (o[0] + a1[0], o[1]), (o[0] + a1[0] + a2[0], o[1] + a2[1]), (o[0] + a2[0], o[1] + a2[1])]
    out.append('<g clip-path="url(#cr0)">{0}{1}</g>'.format("".join(g), poly(cell, "accent-line", "fill:none;stroke-dasharray:5 4")))
    out.append(arrow(o[0], o[1], o[0] + a1[0], o[1], "accent", 2) + arrow(o[0], o[1], o[0] + a2[0], o[1] + a2[1], "accent", 2))
    out.append(label(o[0] + a1[0] / 2, o[1] + 16, "a₁", "accent-label") + label(o[0] + a2[0] / 2 - 12, o[1] + a2[1] / 2, "a₂", "accent-label"))
    # 2) 기저
    cx, cy = xs[1] + 100, y + 110
    out.append(dot(cx - 20, cy + 12, 3.6, "atom-4") + line(cx - 20, cy + 12, cx - 20, cy - 10, "line") +
               dot(cx - 20, cy + 12, 9, "atom-3") + dot(cx - 20, cy - 10, 9, "atom-alt"))
    out.append(label(cx + 2, cy + 16, "B (격자점 위)", "label", "start") + label(cx + 2, cy - 6, "N (거리 L 위)", "label", "start"))
    out.append(_text(cx, y + h - 22, "격자점마다 이 원자 쌍을 놓는다", "tiny-label"))
    # 3) 결정
    o3 = (xs[2] + 70, y + 130)
    pts3 = lattice_points(xs[2], y, w, h, a1, a2, o3)
    bonds, atoms = [], []
    for px, py in pts3:
        nx, ny = px, py - L
        bonds.append(line(px, py, nx, ny))
        bonds.append(line(nx, ny, nx + S3 * L / 2, ny - L / 2))
        bonds.append(line(nx, ny, nx - S3 * L / 2, ny - L / 2))
        atoms.append(dot(px, py, 6.5, "atom-3") + dot(nx, ny, 6.5, "atom-alt"))
    out.append('<g clip-path="url(#cr2)"><g style="stroke-width:1.8">{0}</g>{1}</g>'.format("".join(bonds), "".join(atoms)))
    out.append(_text(240, 150, "+", "label-strong").replace("label-strong", "label-strong\" style=\"font-size:28px"))
    out.append(_text(480, 150, "=", "label-strong").replace("label-strong", "label-strong\" style=\"font-size:28px"))
    out.append(legend([("atom-4", "격자점"), ("atom-3", "B 붕소"), ("atom-alt", "N 질소")], 268))
    return _wrap("격자와 기저로 만든 결정 구조", "육방 격자의 격자점마다 B–N 원자 쌍(기저)을 놓으면 h-BN의 벌집 구조가 된다.", 280, "".join(out))


def bravais2d(args):
    """2차원 브라베 격자 5종."""
    specs = [("정사각", (1, 0), (0, 1), False), ("직사각", (1.35, 0), (0, 0.85), False),
             ("중심 직사각", (1.5, 0), (0, 1.0), True), ("육방", (1, 0), (0.5, S3 / 2), False),
             ("사각(경사)", (1.2, 0), (0.38, 0.9), False)]
    out, w, h, y, sc = [], 128, 150, 40, 30
    for k, (name, a, b, centered) in enumerate(specs):
        x0 = 12 + k * 141
        out.append(panel(x0, y, w, h, name) + clip("bv%d" % k, x0, y, w, h))
        a1, a2 = (a[0] * sc, -a[1] * sc), (b[0] * sc, -b[1] * sc)
        o = (x0 + 34, y + 110)
        pts = lattice_points(x0, y, w, h, a1, a2, o)
        if centered:
            pts += [(px + (a1[0] + a2[0]) / 2, py + (a1[1] + a2[1]) / 2) for px, py in pts]
        cell = [o, (o[0] + a1[0], o[1] + a1[1]), (o[0] + a1[0] + a2[0], o[1] + a1[1] + a2[1]), (o[0] + a2[0], o[1] + a2[1])]
        out.append('<g clip-path="url(#bv{0})">{1}{2}</g>'.format(
            k, poly(cell, "area", "stroke:var(--accent);stroke-width:1.6;opacity:.9"), "".join(dot(px, py, 3.6) for px, py in pts)))
    out.append(_text(360, 214, "색칠한 칸: 단위격자 (중심 직사각은 가운데에도 격자점이 있는 관습적 단위격자)", "tiny-label"))
    return _wrap("2차원 브라베 격자 5종", "평면을 병진 대칭만으로 채우는 점 배열은 정사각, 직사각, 중심 직사각, 육방, 경사의 다섯 가지뿐이다.", 226, "".join(out))


def miller(args):
    """정사각 격자에서 (10), (11), (21) 면 가족과 면간 거리."""
    out, w, h, y, a = [], 216, 216, 40, 30
    fams = [((1, 0), "(10)", "accent"), ((1, 1), "(11)", "teal"), ((2, 1), "(21)", "rose")]
    for k, ((hh, kk), name, col) in enumerate(fams):
        x0 = 12 + k * 236
        out.append(panel(x0, y, w, h, name + " 면") + clip("mi%d" % k, x0, y, w, h))
        o = (x0 + 18, y + h - 18)
        pts = lattice_points(x0, y, w, h, (a, 0), (0, -a), o)
        lines = []
        # 면: h·x + k·y = n (x, y는 격자상수 단위)
        for n in range(-12, 24):
            if kk == 0:
                X = n / hh
                lines.append(line(o[0] + X * a, y - 5, o[0] + X * a, y + h + 5, col + "-line", "stroke-width:1.8"))
            else:
                x1, x2 = -2, 10
                y1, y2 = (n - hh * x1) / kk, (n - hh * x2) / kk
                lines.append(line(o[0] + x1 * a, o[1] - y1 * a, o[0] + x2 * a, o[1] - y2 * a, col + "-line", "stroke-width:1.8"))
        out.append('<g clip-path="url(#mi{0})">{1}{2}</g>'.format(k, "".join(lines), "".join(dot(px, py, 3.4, "atom-4") for px, py in pts)))
        d = 1 / math.hypot(hh, kk)
        # 면간 거리 표시: 원점 근처 두 면 사이의 법선
        nx, ny = hh * d, kk * d   # 면의 단위 법선
        n0 = hh * 2 + kk * 2      # 격자점 (2, 2)를 지나는 면
        # 기준점에서 법선 방향으로 d만큼
        bx = o[0] + (n0 / (hh * hh + kk * kk)) * hh * a
        by = o[1] - (n0 / (hh * hh + kk * kk)) * kk * a
        ex, ey = bx + nx * d * a, by - ny * d * a
        out.append(arrow(bx, by, ex, ey, "text", 1.8, head=6) + arrow(ex, ey, bx, by, "text", 1.8, head=6))
        out.append(label((bx + ex) / 2 + 8, (by + ey) / 2 - 6, "d", "math", "start"))
        out.append(_text(x0 + w / 2, y + h + 20, "d = a/√({0}²+{1}²) = {2:.2f}a".format(hh, kk, d), "label"))
    return _wrap("밀러 지수와 면간 거리", "정사각 격자에서 (10), (11), (21) 면 가족. 지수가 클수록 면이 촘촘하고 면간 거리가 짧다.", 290, "".join(out))


def bragg(args):
    out = []
    x0, x1 = 60, 660
    ys = [130, 200, 270]
    a = 46
    for i, yy in enumerate(ys):
        out.append(line(x0, yy, x1, yy, "dash"))
        out += [dot(x, yy, 7, "atom") for x in range(x0 + 10, x1, a)]
    out.append(label(x1 + 8, ys[0] + 4, "결정면", "tiny-label", "start"))
    th = math.radians(28)
    # 두 광선이 각각 위 면 A, 아래 면 B에서 반사
    A = (x0 + 10 + 6 * a, ys[0])
    B = (A[0], ys[1])
    L = 230
    for P, col in ((A, "accent"), (B, "teal")):
        sx, sy = P[0] - L * math.cos(th), P[1] - L * math.sin(th)
        ex, ey = P[0] + L * math.cos(th), P[1] - L * math.sin(th)
        out.append(arrow(sx, sy, P[0], P[1], col, 2.4, head=9) + arrow(P[0], P[1], ex, ey, col, 2.4, head=9))
    # 경로차: B에서 위 광선에 내린 수선의 발
    # A에서 아래 광선에 내린 수선의 발: 그 사이 구간이 경로차의 절반(d sinθ)
    def foot(P, Q, ang):
        ux, uy = math.cos(ang), math.sin(ang)
        t = (P[0] - Q[0]) * ux + (P[1] - Q[1]) * uy
        return (Q[0] + t * ux, Q[1] + t * uy)
    fin = foot(A, B, th + math.pi)        # 들어오는 아래 광선 위의 점(A에서 내린 수선)
    fout = foot(A, B, -th)                 # 나가는 아래 광선 위의 점
    out.append(line(A[0], A[1], fin[0], fin[1], "thin", "stroke-dasharray:3 3") + line(A[0], A[1], fout[0], fout[1], "thin", "stroke-dasharray:3 3"))
    out.append(path([fin, B], "rose-line", "stroke-width:4;opacity:.85") + path([B, fout], "rose-line", "stroke-width:4;opacity:.85"))
    out.append(label(B[0] - 44, B[1] - 6, "d sinθ", "rose-label", "end") + label(B[0] + 44, B[1] - 6, "d sinθ", "rose-label", "start"))
    out.append(arrow(A[0] + 150, ys[0], A[0] + 150, ys[1], "text", 1.6, head=6) + arrow(A[0] + 150, ys[1], A[0] + 150, ys[0], "text", 1.6, head=6))
    out.append(label(A[0] + 158, (ys[0] + ys[1]) / 2 + 4, "d", "math", "start"))
    # θ 표시
    r = 46
    sx = A[0] - r * math.cos(th)
    out.append('<path class="thin" style="stroke:var(--text-2)" d="M{0:.1f} {1:.1f} A{2} {2} 0 0 1 {3:.1f} {4:.1f}"/>'.format(A[0] - r, A[1], r, sx, A[1] - r * math.sin(th)))
    out.append(label(A[0] - r - 12, A[1] - 8, "θ", "math", "end"))
    out.append(_text(360, 330, "아래 면에서 반사된 X선은 2d sinθ만큼 더 진행한다 → 2d sinθ = nλ일 때 보강 간섭", "label"))
    return _wrap("브래그 법칙", "이웃한 두 결정면에서 반사된 X선의 경로차 2d sinθ가 파장의 정수배일 때 보강 간섭이 일어난다.", 346, "".join(out))


def _ws(x0, y0, w, h, sp, rot, cid, labels, title, show_vectors=None, vec_angles=None):
    """육방 격자점 + 원점의 Wigner–Seitz 셀(수직 이등분선으로 만든 육각형)."""
    out = [panel(x0, y0, w, h, title), clip(cid, x0, y0, w, h)]
    c = (x0 + w / 2, y0 + h / 2)
    a1 = (sp * math.cos(rot), -sp * math.sin(rot))
    a2 = (sp * math.cos(rot + math.pi / 3), -sp * math.sin(rot + math.pi / 3))
    pts = lattice_points(x0, y0, w, h, a1, a2, c)
    # 육각형 꼭짓점: 이웃 6개 방향의 이등분선 교점, 거리 sp/√3, 방향 rot+30°+60°k
    R = sp / S3
    hexv = [(c[0] + R * math.cos(rot + math.pi / 6 + k * math.pi / 3), c[1] - R * math.sin(rot + math.pi / 6 + k * math.pi / 3)) for k in range(6)]
    g = []
    for k in range(6):
        ang = rot + k * math.pi / 3
        nx, ny = c[0] + sp * math.cos(ang), c[1] - sp * math.sin(ang)
        g.append(line(c[0], c[1], nx, ny, "thin"))
        mx, my = (c[0] + nx) / 2, (c[1] + ny) / 2
        px, py = -math.sin(ang), -math.cos(ang)
        g.append(line(mx - px * 60, my - py * 60, mx + px * 60, my + py * 60, "dash"))
    out.append('<g clip-path="url(#{0})">{1}{2}{3}</g>'.format(
        cid, poly(hexv, "area", "stroke:var(--accent);stroke-width:2;opacity:.9"), "".join(g), "".join(dot(px, py, 4.2) for px, py in pts)))
    out.append(dot(c[0], c[1], 5.5, "atom-4"))
    if labels:
        out.append(label(c[0] - 8, c[1] + 18, labels.get("c", ""), "math", "middle"))
        if "K" in labels:
            for k, name in enumerate(["K", "K′"] * 3):
                vx, vy = hexv[k]
                ox, oy = (vx - c[0]) * 0.28, (vy - c[1]) * 0.28
                out.append(dot(vx, vy, 3.4, "atom-3") + label(vx + ox, vy + oy + 4, name, "amber-label"))
            mx, my = (hexv[3][0] + hexv[4][0]) / 2, (hexv[3][1] + hexv[4][1]) / 2
            out.append(dot(mx, my, 3.4, "atom-alt") + label(mx + (mx - c[0]) * 0.3, my + (my - c[1]) * 0.3 + 4, "M", "teal-label"))
    if show_vectors:
        vecs = (a1, a2) if vec_angles is None else [(sp * math.cos(t), -sp * math.sin(t)) for t in vec_angles]
        for (vx, vy), name in zip(vecs, show_vectors):
            out.append(arrow(c[0], c[1], c[0] + vx, c[1] + vy, "rose", 2.2))
            out.append(label(c[0] + vx * 0.62 + (8 if vy < 0 else 0), c[1] + vy * 0.62 - 8, name, "rose-label", "start"))
    return "".join(out)


def reciprocal(args):
    out = [_ws(20, 40, 320, 260, 58, 0, "rc1", {"c": ""}, "실공간 · 격자 벡터 a₁, a₂", ("a₁", "a₂"))]
    out.append(_ws(380, 40, 320, 260, 66, math.pi / 6 - math.pi / 3, "rc2", {"c": "Γ", "K": 1}, "역공간 · 역격자 벡터 b₁, b₂", ("b₁", "b₂"), (-math.pi / 6, math.pi / 2)))
    out.append(_text(360, 326, "실공간 육방 격자의 역격자도 육방 격자이고 30° 돌아가 있다. 가운데 육각형은 실공간에서 Wigner–Seitz 셀, 역공간에서 제1 브릴루앙 영역", "tiny-label"))
    return _wrap("실공간 격자와 역격자", "육방 격자의 역격자는 30° 돌아간 육방 격자이며, 역공간 원점 주변의 Wigner–Seitz 셀이 제1 브릴루앙 영역이다.", 338, "".join(out))


def brillouin(args):
    out = [_ws(140, 40, 440, 300, 110, math.pi / 6 - math.pi / 3, "bz", {"c": "Γ", "K": 1}, "육방 격자의 제1 브릴루앙 영역")]
    out.append(_text(360, 364, "점선: Γ와 이웃 역격자점 사이의 수직 이등분선 · K/K′: 꼭짓점(그래핀·TMD의 밴드 끝) · M: 변의 가운데", "tiny-label"))
    return _wrap("제1 브릴루앙 영역", "역격자 원점 Γ에서 이웃 역격자점까지의 수직 이등분선으로 둘러싸인 육각형이 육방 격자의 제1 브릴루앙 영역이며, 꼭짓점이 K·K′, 변의 가운데가 M이다.", 376, "".join(out))


def wigner_seitz(args):
    out = [_ws(140, 40, 440, 300, 110, 0, "ws", {"c": ""}, "육방 격자의 Wigner–Seitz 셀")]
    out.append(_text(360, 364, "가는 선: 가운데 격자점과 이웃 6개를 잇는 선 · 점선: 그 수직 이등분선 · 색칠한 육각형: 이 격자점에 가장 가까운 영역", "tiny-label"))
    return _wrap("Wigner–Seitz 셀", "한 격자점과 이웃 격자점을 잇는 선의 수직 이등분선으로 둘러싸인 영역이 Wigner–Seitz 셀이다.", 376, "".join(out))


# ── 전자 구조 ───────────────────────────────────────────────────────
def levels(args):
    """원자 준위가 원자 수가 늘며 밴드로 넓어지는 모습."""
    out = []
    cols = [(1, "원자 1개"), (2, "2개"), (4, "4개"), (8, "8개"), (60, "많음(결정)")]
    y0, x = 40, 70
    for k, (n, name) in enumerate(cols):
        cx = 90 + k * 130
        for e0, wid, col in ((110, 46, "teal"), (230, 46, "rose")):
            if n == 1:
                out.append(line(cx - 30, e0, cx + 30, e0, col + "-line", "stroke-width:2.6"))
            elif n < 20:
                for i in range(n):
                    yy = e0 - wid / 2 + wid * i / (n - 1)
                    out.append(line(cx - 30, yy, cx + 30, yy, col + "-line", "stroke-width:1.8"))
            else:
                out.append('<rect class="area" x="{0}" y="{1}" width="60" height="{2}" style="opacity:.8"/>'.format(cx - 30, e0 - wid / 2, wid))
                out.append('<rect x="{0}" y="{1}" width="60" height="{2}" rx="3" style="fill:none;stroke:var(--{3});stroke-width:2"/>'.format(cx - 30, e0 - wid / 2, wid, col))
        out.append(_text(cx, 290, name, "label"))
    out.append(arrow(30, 280, 30, 50, "text", 1.6) + label(38, 56, "E", "math", "start"))
    out.append(label(648, 114, "전도대", "teal-label", "start") + label(648, 234, "가전자대", "rose-label", "start"))
    out.append(arrow(610, 136, 610, 204, "accent", 1.8, head=6) + arrow(610, 204, 610, 136, "accent", 1.8, head=6))
    out.append(label(648, 174, "밴드갭", "accent-label", "start"))
    return _wrap("원자 준위에서 에너지 밴드로", "원자가 가까워지면 같은 준위가 원자 수만큼 갈라지고, 결정처럼 원자가 아주 많으면 준위가 촘촘해져 연속된 밴드가 된다.", 304, "".join(out))


def band_classes(args):
    out = []
    specs = [("금속", "fill", None), ("반도체", "gap", "1–3 eV 안팎"), ("절연체", "wide", "보통 4 eV 이상")]
    for k, (name, kind, note) in enumerate(specs):
        x0 = 30 + k * 230
        out.append(panel(x0, 40, 200, 240, name))
        bx = x0 + 50
        if kind == "fill":
            out.append('<rect x="{0}" y="80" width="100" height="70" rx="4" style="fill:none;stroke:var(--teal);stroke-width:2"/>'.format(bx))
            out.append('<rect class="area" x="{0}" y="122" width="100" height="28" style="opacity:.9"/>'.format(bx))
            out.append('<rect x="{0}" y="165" width="100" height="80" rx="4" style="fill:var(--accent-soft);stroke:var(--rose);stroke-width:2"/>'.format(bx))
            out.append(line(bx - 16, 122, bx + 116, 122, "dash") + label(bx + 118, 126, "E<tspan baseline-shift=\"sub\" font-size=\"9\">F</tspan>", "math", "start"))
            out.append(_text(x0 + 100, 268, "밴드가 반쯤 차 있어 전자가 쉽게 움직임", "tiny-label"))
        else:
            gap = 50 if kind == "gap" else 104
            top = 80
            out.append('<rect x="{0}" y="{1}" width="100" height="44" rx="4" style="fill:none;stroke:var(--teal);stroke-width:2"/>'.format(bx, top))
            vb = top + 44 + gap
            out.append('<rect x="{0}" y="{1}" width="100" height="{2}" rx="4" style="fill:var(--accent-soft);stroke:var(--rose);stroke-width:2"/>'.format(bx, vb, 250 - vb))
            out.append(arrow(bx + 50, top + 46, bx + 50, vb - 2, "accent", 1.6, head=6) + arrow(bx + 50, vb - 2, bx + 50, top + 46, "accent", 1.6, head=6))
            out.append(label(bx + 58, (top + 44 + vb) / 2 + 4, "E<tspan baseline-shift=\"sub\" font-size=\"9\">g</tspan>", "accent-label", "start"))
            out.append(_text(x0 + 100, 268, note, "tiny-label"))
    out.append(legend([("atom-alt", "빈 밴드(전도대)"), ("atom-4", "찬 밴드(가전자대)")], 302, 30).replace('class="atom-alt"', 'class="atom-alt" style="fill:none;stroke:var(--teal);stroke-width:2"').replace('class="atom-4"', 'class="atom-4" style="fill:var(--accent-soft);stroke:var(--rose);stroke-width:2"'))
    return _wrap("금속·반도체·절연체의 밴드", "금속은 밴드가 일부만 차 있고, 반도체와 절연체는 꽉 찬 가전자대와 빈 전도대 사이에 밴드갭이 있으며 절연체의 갭이 더 넓다.", 314, "".join(out))


def _ek_axes(x0, y0, w, h, title):
    return panel(x0, y0, w, h, title) + arrow(x0 + 24, y0 + h - 14, x0 + 24, y0 + 16, "text", 1.4, head=6) + \
        label(x0 + 32, y0 + 26, "E", "math", "start") + arrow(x0 + 24, y0 + h - 14, x0 + w - 14, y0 + h - 14, "text", 1.4, head=6) + \
        label(x0 + w - 16, y0 + h - 22, "k", "math", "end")


def transitions(args):
    out = []
    for k, (x0, title, direct) in enumerate([(20, "직접 밴드갭 · 빛만으로 전이", True), (380, "간접 밴드갭 · 포논이 운동량을 보탬", False)]):
        out.append(_ek_axes(x0, 40, 320, 250, title))
        cx = x0 + 120
        ck = cx if direct else x0 + 230
        ks = [x0 + 40 + i * 2 for i in range(130)]
        cb = [(x, 120 - ((x - ck) / 46) ** 2 * 26) for x in ks]
        vb = [(x, 200 + ((x - cx) / 46) ** 2 * 26) for x in ks]
        out.append(clip("tc%d" % k, x0, 40, 320, 250) + '<g clip-path="url(#tc%d)">' % k + path(cb, "teal-line") + path(vb, "rose-line") + "</g>")
        out.append(dot(cx, 200, 5, "atom-4") + dot(ck, 120, 5, "atom-alt"))
        if direct:
            out.append(arrow(cx, 194, cx, 128, "amber", 2.4))
            out.append(label(cx + 10, 165, "광자 hν (운동량 거의 0)", "amber-label", "start"))
        else:
            out.append(arrow(cx, 194, cx, 142, "amber", 2.4) + label(cx - 8, 172, "광자", "amber-label", "end"))
            out.append(arrow(cx + 4, 136, ck - 6, 122, "accent", 2.2, dash=True) + label((cx + ck) / 2, 116, "포논", "accent-label"))
        out.append(label(x0 + 300, 70, "전도대", "teal-label", "end") + label(x0 + 300, 250, "가전자대", "rose-label", "end"))
    return _wrap("직접 전이와 간접 전이", "직접 밴드갭에서는 빛만으로 전자가 수직으로 올라가지만, 간접 밴드갭에서는 운동량 차이를 포논이 채워야 해서 빛의 흡수와 방출이 약하다.", 304, "".join(out))


def effmass(args):
    out = [_ek_axes(140, 40, 440, 260, "밴드 곡률과 유효 질량")]
    cx = 360
    ks = [160 + i * 2 for i in range(205)]
    # 좁은 포물선(가벼운 캐리어)과 넓은 포물선(무거운 캐리어)
    out.append(clip("em", 140, 40, 440, 260) + '<g clip-path="url(#em)">' + \
        path([(x, 240 - ((x - cx) / 36) ** 2 * 24) for x in ks], "teal-line") + \
        path([(x, 240 - ((x - cx) / 110) ** 2 * 24) for x in ks], "amber-line") + "</g>")
    out.append(label(cx + 74, 86, "곡률 큼 → m* 작음 (가벼운 캐리어)", "teal-label", "start"))
    out.append(label(cx + 150, 206, "곡률 작음 → m* 큼", "amber-label", "start"))
    out.append(_text(360, 322, "1/m* = (1/ħ²)·d²E/dk²  — 같은 힘을 받아도 가벼운 캐리어가 더 빨리 가속된다", "label"))
    return _wrap("유효 질량", "밴드 바닥이 뾰족하게 휠수록 유효 질량이 작고, 완만할수록 크다.", 336, "".join(out))


def exciton(args):
    out = [panel(20, 40, 320, 260, "에너지로 본 엑시톤")]
    cb, vb = 90, 262
    out.append('<rect class="area" x="40" y="52" width="280" height="{0}" style="opacity:.55"/>'.format(cb - 52))
    out.append(line(40, cb, 320, cb, "teal-line", "stroke-width:2.6") + label(312, cb - 8, "전도대 바닥", "teal-label", "end"))
    out.append('<rect x="40" y="{0}" width="280" height="{1}" style="fill:var(--accent-soft);opacity:.7"/>'.format(vb, 290 - vb))
    out.append(line(40, vb, 320, vb, "rose-line", "stroke-width:2.6") + label(312, vb + 20, "가전자대 꼭대기", "rose-label", "end"))
    lv = [(1, 150), (2, 106)]
    for n, yy in lv:
        out.append(line(160, yy, 260, yy, "accent-line", "stroke-width:2") + label(266, yy + 4, "n=%d" % n, "tiny-label", "start"))
    out.append(arrow(100, vb - 2, 100, cb + 2, "text", 1.6, head=6) + arrow(100, cb + 2, 100, vb - 2, "text", 1.6, head=6))
    out.append(label(92, 190, "준입자 갭", "label", "end"))
    out.append(arrow(210, vb - 2, 210, 152, "amber", 2.2, head=7) + label(218, 214, "광학 갭(PL)", "amber-label", "start"))
    out.append(arrow(140, cb + 2, 140, 148, "accent", 1.6, head=5) + arrow(140, 148, 140, cb + 2, "accent", 1.6, head=5))
    out.append(label(132, 124, "결합 에너지", "accent-label", "end"))
    # 실공간
    out.append(panel(380, 40, 320, 260, "실공간 · 얇은 층에서의 전자–정공 쌍"))
    out.append('<rect class="slab" x="400" y="150" width="280" height="40"/>')
    ex, hx, yy = 500, 580, 170
    for s in (-1, 1):
        for r in (40, 70):
            out.append('<path class="dash" d="M{0} {1} C {2} {3}, {4} {3}, {5} {1}"/>'.format(ex, yy, ex + 10, yy + s * r, hx - 10, hx))
    out.append(dot(ex, yy, 9, "atom-alt") + dot(hx, yy, 9, "atom-4") + label(ex - 16, yy + 5, "e⁻", "label-strong", "end") + label(hx + 16, yy + 5, "h⁺", "label-strong", "start"))
    out.append(label(540, 92, "전기력선이 층 밖(유전율이 낮은 공간)으로 퍼져", "tiny-label") + label(540, 108, "가리기 효과가 약하고 결합이 강해진다", "tiny-label"))
    out.append(label(690, 206, "2D 반도체 단층", "tiny-label", "end"))
    return _wrap("엑시톤", "빛으로 만든 전자와 정공이 쿨롱 힘으로 묶여 전도대 바로 아래에 수소 원자 같은 준위를 만든다. 얇은 층에서는 가리기 효과가 약해 결합 에너지가 크다.", 314, "".join(out))


def interlayer(args):
    out = [panel(20, 40, 320, 260, "제2형(type-II) 밴드 정렬")]
    # 층 1: 전도대 낮음, 층 2: 가전자대 높음
    for x0, cbv, vbv, name in ((60, 110, 220, "층 1"), (200, 80, 190, "층 2")):
        out.append(line(x0, cbv, x0 + 100, cbv, "teal-line", "stroke-width:2.6") + line(x0, vbv, x0 + 100, vbv, "rose-line", "stroke-width:2.6"))
        out.append(_text(x0 + 50, 282, name, "label"))
    out.append(dot(110, 110, 7, "atom-alt") + label(110, 100, "e⁻", "label-strong"))
    out.append(dot(250, 190, 7, "atom-4") + label(250, 214, "h⁺", "label-strong"))
    out.append(arrow(240, 84, 124, 106, "accent", 2, dash=True) + label(180, 80, "전자는 층 1로", "accent-label"))
    out.append(arrow(124, 218, 240, 194, "accent", 2, dash=True) + label(186, 236, "정공은 층 2로", "accent-label"))
    out.append(arrow(110, 116, 250, 184, "amber", 2.2) + label(196, 152, "층간 엑시톤 발광", "amber-label", "start"))
    out.append(panel(380, 40, 320, 260, "옆에서 본 이종이중층"))
    out.append('<rect class="slab" x="400" y="110" width="280" height="34"/><rect class="slab" x="400" y="170" width="280" height="34"/>')
    out.append(label(690, 104, "층 1", "tiny-label", "end") + label(690, 222, "층 2", "tiny-label", "end"))
    out.append(dot(520, 127, 9, "atom-alt") + label(504, 132, "e⁻", "label-strong", "end") + dot(560, 187, 9, "atom-4") + label(576, 192, "h⁺", "label-strong", "start"))
    out.append(line(520, 127, 560, 187, "dash"))
    out.append(arrow(620, 196, 620, 118, "rose", 2.2) + label(630, 162, "면외 쌍극자", "rose-label", "start"))
    out.append(_text(540, 264, "전자와 정공이 떨어져 있어 재결합이 느리고(긴 수명)", "tiny-label") + _text(540, 280, "수직 전기장으로 에너지를 바꿀 수 있다", "tiny-label"))
    return _wrap("층간 엑시톤", "두 층의 밴드가 엇갈려 정렬되면 전자는 한 층, 정공은 다른 층으로 모여 층을 사이에 둔 엑시톤이 된다.", 314, "".join(out))


def pl_process(args):
    out = [_ek_axes(140, 40, 440, 270, "광발광 과정")]
    cx = 360
    ks = [170 + i * 2 for i in range(200)]
    p = lambda x: ((x - cx) / 60) ** 2 * 20
    out.append(clip("pp", 140, 40, 440, 270) + '<g clip-path="url(#pp)">' + path([(x, 130 - p(x)) for x in ks], "teal-line") +
               path([(x, 220 + p(x)) for x in ks], "rose-line") + "</g>")
    ex = cx - 80
    ytop = 130 - p(ex)
    out.append(arrow(ex, 220 + p(ex) - 4, ex, ytop + 4, "accent", 2.6))
    out.append(label(ex - 10, 176, "① 흡수(레이저)", "accent-label", "end"))
    out.append(dot(ex, ytop, 5, "atom-alt"))
    wig = [(ex + i * 2, 130 - p(ex + i * 2) - 6 + 3.5 * math.sin(i * 1.3)) for i in range(40)]
    out.append(path(wig, "line", "stroke-width:1.6"))
    out.append(label(ex + 4, ytop - 16, "② 바닥으로 이완(포논 방출)", "label", "start"))
    out.append(dot(cx, 130, 5, "atom-alt") + dot(cx, 220, 5, "atom-4"))
    out.append(arrow(cx, 134, cx, 216, "amber", 2.6))
    out.append(label(cx + 10, 180, "③ 재결합 → 빛(PL)", "amber-label", "start"))
    out.append(_text(360, 334, "흡수한 빛보다 에너지가 낮은, 밴드갭(엑시톤) 근처의 빛이 나온다", "label"))
    return _wrap("광발광 과정", "레이저로 들뜬 전자가 전도대 바닥까지 이완한 뒤 정공과 재결합하며 밴드 끝 에너지의 빛을 낸다.", 348, "".join(out))


def flatband(args):
    out = []
    for k, (x0, title, amp, note) in enumerate([(20, "보통 밴드 · 폭 W 큼", 70, "운동 에너지 ≫ 전자 사이 반발"), (380, "평탄 밴드 · 폭 W 작음", 8, "전자 사이 반발 U가 상대적으로 커짐")]):
        out.append(_ek_axes(x0, 40, 320, 250, title))
        ks = [x0 + 44 + i * 2 for i in range(126)]
        mid = x0 + 170
        yc = 160
        pts = [(x, yc - amp * math.cos((x - mid) / 126 * 2 * math.pi) * -1) for x in ks]
        out.append(path(pts, "accent-line"))
        ys = [p[1] for p in pts]
        top, bot = min(ys), max(ys)
        bx = x0 + 300
        out.append(arrow(bx, top, bx, bot, "rose", 1.6, head=5) + arrow(bx, bot, bx, top, "rose", 1.6, head=5) if bot - top > 12 else
                   line(bx - 5, top, bx + 5, top, "rose-line", "stroke-width:1.6") + line(bx - 5, bot, bx + 5, bot, "rose-line", "stroke-width:1.6"))
        out.append(label(bx - 8, (top + bot) / 2 - (8 if bot - top < 12 else -4), "W", "rose-label", "end"))
        out.append(_text(x0 + 172, 72, note, "tiny-label"))
    return _wrap("평탄 밴드", "밴드 폭 W가 작아지면 전자의 운동 에너지가 억제되고, 전자끼리의 반발이 상대적으로 커져 상관 효과가 나타난다.", 304, "".join(out))


def tightbinding(args):
    out = [panel(20, 40, 680, 90, "1차원 원자 사슬")]
    xs = [70 + i * 82 for i in range(8)]
    for i, x in enumerate(xs):
        out.append(dot(x, 92, 12, "atom"))
        if i < len(xs) - 1:
            out.append('<path class="accent-line" style="stroke-width:1.8;fill:none" d="M{0} 74 Q {1} 56 {2} 74"/>'.format(x + 10, x + 41, x + 72))
            out.append(label(x + 41, 58, "t", "accent-label"))
    out.append(arrow(xs[2], 116, xs[3], 116, "text", 1.4, head=5) + arrow(xs[3], 116, xs[2], 116, "text", 1.4, head=5) + label((xs[2] + xs[3]) / 2, 112, "a", "math"))
    out.append(_ek_axes(140, 170, 440, 220, "E(k) = ε₀ − 2t cos(ka)"))
    x0, x1, yc, amp = 190, 550, 280, 70
    pts = [(x0 + (x1 - x0) * i / 200, yc + amp * math.cos(-math.pi + 2 * math.pi * i / 200)) for i in range(201)]
    out.append(path(pts, "teal-line"))
    out.append(line(x0, 186, x0, 380, "grid") + line(x1, 186, x1, 380, "grid") + line((x0 + x1) / 2, 186, (x0 + x1) / 2, 380, "grid"))
    out.append(label(x0, 384, "−π/a", "math") + label((x0 + x1) / 2, 384, "0", "math") + label(x1, 384, "π/a", "math"))
    out.append(arrow(565, yc - amp, 565, yc + amp, "rose", 1.6, head=6) + arrow(565, yc + amp, 565, yc - amp, "rose", 1.6, head=6) + label(560, yc + 4, "4t", "rose-label", "end"))
    return _wrap("강한 결합 근사", "이웃 원자로 전자가 건너뛰는 정도(호핑 t)가 클수록 밴드 폭(1차원 사슬에서 4t)이 넓어진다.", 398, "".join(out))


KINDS = {"결정": crystal, "브라베": bravais2d, "밀러": miller, "브래그": bragg, "역격자": reciprocal,
         "브릴루앙": brillouin, "위그너자이츠": wigner_seitz, "준위": levels, "밴드분류": band_classes,
         "전이": transitions, "유효질량": effmass, "엑시톤": exciton, "층간엑시톤": interlayer,
         "pl과정": pl_process, "평탄밴드": flatband, "강결합": tightbinding}
