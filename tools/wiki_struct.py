"""위키 결정학(적층·이종구조)·공정·물질 문서용 SVG 그림. wiki_figures.py가 불러 쓴다. 표준 라이브러리만 쓴다.

그림은 구조와 과정을 보이기 위한 도식이다. 그림에 숫자는 적지 않는다(정의상 식은 예외).
"""

import math

from wiki_figures import _text, _wrap
from wiki_concepts import S3, arrow, clip, dot, label, lattice_points, line, panel, path, poly
from wiki_devices import rect


def _hexpatch(x0, y0, w, h, L, rot, cls_a, cls_b, r, cid, skip=None):
    """회전한 벌집 격자 조각. skip(x, y)가 참이면 그 원자를 뺀다."""
    out = [clip(cid, x0, y0, w, h), '<g clip-path="url(#{0})">'.format(cid)]
    a1 = (S3 * L * math.cos(rot), S3 * L * math.sin(rot))
    a2 = (S3 * L * math.cos(rot + math.pi / 3), S3 * L * math.sin(rot + math.pi / 3))
    bvec = (L * math.cos(rot + math.pi / 6), L * math.sin(rot + math.pi / 6))
    pts = lattice_points(x0, y0, w, h, a1, a2, (x0 + w / 2, y0 + h / 2), pad=2 * L)
    bonds, atoms = [], []
    for x, y in pts:
        bx, by = x + bvec[0], y + bvec[1]
        # A 자리의 세 이웃(B 자리)은 b 방향에서 120°씩 돌린 곳에 있다
        for k in range(3):
            t = rot + math.pi / 6 + k * 2 * math.pi / 3
            ex, ey = x + L * math.cos(t), y + L * math.sin(t)
            if not (skip and (skip(x, y) or skip(ex, ey))):
                bonds.append(line(x, y, ex, ey, "line", "stroke-width:1.6"))
        if not (skip and skip(x, y)):
            atoms.append(dot(x, y, r, cls_a))
        if not (skip and skip(bx, by)):
            atoms.append(dot(bx, by, r, cls_b))
    out += bonds + atoms + ["</g>"]
    return "".join(out)


def reconstruction(args):
    out = []
    for k, (x0, title, recon) in enumerate([(20, "강체 모아레(큰 회전각)", False), (380, "atomic reconstruction(작은 회전각)", True)]):
        out.append(panel(x0, 40, 320, 260, title) + clip("rc%d" % k, x0, 40, 320, 260))
        g = ['<g clip-path="url(#rc{0})">'.format(k)]
        a = 64
        cx, cy = x0 + 160, 170
        nodes = lattice_points(x0, 40, 320, 260, (a, 0), (a / 2, a * S3 / 2), (cx, cy), pad=a)
        if recon:
            for x, y in nodes:
                for sgn, cls in ((1, "var(--accent)"), (-1, "var(--teal)")):
                    tri = [(x, y), (x + a, y), (x + a / 2, y + sgn * a * S3 / 2)]
                    g.append(poly(tri, "", "fill:{0};opacity:.28;stroke:var(--surface-2);stroke-width:3".format(cls)))
            for x, y in nodes:
                g.append(dot(x, y, 5, "atom-4"))
        else:
            for x, y in nodes:
                g.append('<circle cx="{0:.1f}" cy="{1:.1f}" r="{2}" style="fill:var(--accent);opacity:.18"/>'.format(x, y, a * 0.55))
                g.append(dot(x, y, 4, "atom-4"))
        g.append("</g>")
        out += g
        out.append(_text(x0 + 160, 320, "AA·AB·BA 영역이 매끄럽게 이어짐" if not recon else "AB·BA 삼각 도메인 + 좁은 도메인 벽 + AA 매듭(빨간 점)", "tiny-label"))
    return _wrap("atomic reconstruction", "회전각이 크면 두 층이 그대로 겹쳐 매끄러운 모아레가 되지만, 작으면 원자가 움직여 에너지가 낮은 AB·BA 적층 도메인을 넓히고 그 경계에 좁은 도메인 벽이 생긴다.", 332, "".join(out))


def soliton(args):
    out = [panel(80, 40, 560, 260, "도메인 벽(솔리톤)을 가로지르는 변위")]
    x0, x1, y0 = 120, 600, 90
    cx, wd = 360, 40
    pts = [(x, y0 + 110 - 90 * (0.5 + math.atan(math.sinh((x - cx) / wd * 1.4)) / math.pi)) for x in range(x0, x1)]
    out.append(line(x0, 200, x1, 200, "axis") + line(x0, 200, x0, 90, "axis"))
    out.append(path(pts, "accent-line", "stroke-width:2.6"))
    out.append(label(x0 + 6, 96, "층 사이 변위 u", "label", "start") + label(x1, 218, "위치", "label", "end"))
    out.append(line(cx - wd, 95, cx - wd, 200, "dash") + line(cx + wd, 95, cx + wd, 200, "dash"))
    out.append(arrow(cx - wd, 108, cx + wd, 108, "text", 1.4, head=5) + arrow(cx + wd, 108, cx - wd, 108, "text", 1.4, head=5) + label(cx, 102, "벽 폭", "label"))
    out.append(label(200, 190, "AB 적층", "teal-label") + label(520, 110, "BA 적층", "accent-label"))
    for i in range(10):
        x = 150 + i * 48
        sh = 14 * (0.5 + math.atan(math.sinh((x - cx) / wd * 1.4)) / math.pi)
        out.append(dot(x, 240, 6, "atom") + dot(x + sh, 262, 6, "atom-3"))
    out.append(label(626, 244, "위층", "tiny-label", "end") + label(626, 266, "아래층", "tiny-label", "end"))
    return _wrap("도메인 벽", "두 적층 도메인 사이에서 층 사이 변위가 좁은 구간에 걸쳐 한 결합 길이만큼 바뀌는 경계를 도메인 벽(변형 솔리톤)이라 한다.", 306, "".join(out))


def epitaxy(args):
    out = []
    specs = [("공유결합 에피택시", "격자가 맞아야 함(불일치 → 변형·결함)", "cov"), ("반데르발스 에피택시", "약한 결합 → 불일치가 커도 성장", "vdw"), ("remote epitaxy", "그래핀 너머로 기판 정보 전달", "rem")]
    for k, (name, note, kind) in enumerate(specs):
        x0 = 20 + k * 233
        out.append(panel(x0, 40, 213, 230, name))
        for i in range(7):
            x = x0 + 26 + i * 27
            out.append(dot(x, 220, 7, "atom-alt") + dot(x, 196, 7, "atom-alt"))
            out.append(line(x, 203, x, 213, "line"))
        if kind == "rem":
            out.append(line(x0 + 16, 172, x0 + 196, 172, "line", "stroke-width:3") + label(x0 + 200, 168, "그래핀", "tiny-label", "end"))
        sp = 27 if kind != "vdw" else 33
        yy = 140 if kind != "vdw" else 130
        for i in range(6 if kind != "vdw" else 5):
            x = x0 + 26 + i * sp
            out.append(dot(x, yy, 7, "atom") + dot(x, yy - 22, 7, "atom"))
            out.append(line(x, yy - 15, x, yy - 7, "line"))
            if kind == "cov":
                out.append(line(x, yy + 7, x, 189, "line", "stroke-width:2"))
        if kind == "vdw":
            out.append(line(x0 + 16, 158, x0 + 196, 158, "dash") + label(x0 + 106, 172, "반데르발스 틈", "tiny-label"))
        out.append(_text(x0 + 106, 290, note, "tiny-label"))
    return _wrap("에피택시의 종류", "기판의 결정 방위를 따라 막을 키우는 에피택시는 계면 결합이 강한 공유결합형, 약한 반데르발스형, 얇은 2D 층을 사이에 둔 원격형으로 나뉜다.", 302, "".join(out))


def mismatch(args):
    out = []
    for k, (x0, title, coherent) in enumerate([(20, "정합 성장 · 막이 변형됨", True), (380, "완화 · 부정합 전위 생성", False)]):
        out.append(panel(x0, 40, 320, 240, title))
        for i in range(9):
            out.append(dot(x0 + 40 + i * 30, 230, 8, "atom-alt"))
        n = 9 if coherent else 8
        sp = 30 if coherent else 34
        for j in range(3):
            for i in range(n):
                out.append(dot(x0 + 40 + i * sp, 196 - j * 30, 8, "atom-3"))
        if not coherent:
            out.append('<path class="rose-line" style="fill:none;stroke-width:2.4" d="M{0} 214 v-60 M{1} 214 h24"/>'.format(x0 + 175, x0 + 163))
            out.append(label(x0 + 196, 160, "⊥ 전위", "rose-label", "start"))
        out.append(_text(x0 + 160, 262, "막 원자 간격을 기판에 맞춤(압축)" if coherent else "막 원래 간격으로 돌아가며 결함", "tiny-label"))
    out.append(_text(360, 302, "격자 불일치 f = (a_막 − a_기판) / a_기판", "label"))
    return _wrap("격자 불일치", "막과 기판의 격자상수가 다르면 얇을 때는 막이 늘거나 줄어 기판에 맞추고, 두꺼워지면 전위를 만들며 원래 간격으로 돌아간다.", 314, "".join(out))


def hetero(args):
    lateral = bool(args) and args[0].startswith("평")
    out = [panel(100, 40, 520, 260)]
    if not lateral:
        layers = [("h-BN", "var(--fig-oxide)"), ("그래핀", "var(--text-2)"), ("MoS₂", "var(--accent)"), ("WSe₂", "var(--teal)"), ("h-BN", "var(--fig-oxide)")]
        for i, (nm, col) in enumerate(layers):
            y = 230 - i * 34
            out.append(poly([(200, y), (460, y), (520, y - 22), (260, y - 22)], "", "fill:{0};opacity:.75;stroke:var(--surface);stroke-width:1.5".format(col)))
            out.append(label(530, y - 6, nm, "label", "start"))
        out.append(_text(360, 284, "서로 다른 2D 층을 레고처럼 쌓음 · 층 사이는 반데르발스 힘", "tiny-label"))
        title, desc = "수직 이종구조", "서로 다른 2D 층을 반데르발스 힘으로 차례로 쌓아 만든 구조."
    else:
        cx, cy = 360, 170
        out.append(_hexpatch(140, 70, 440, 200, 16, 0, "atom", "atom-3", 4.5, "lh", None))
        out.append(rect(140, 70, 220, 200, "var(--accent)", None, 0, "opacity:.08") + rect(360, 70, 220, 200, "var(--teal)", None, 0, "opacity:.14"))
        out.append(line(360, 70, 360, 270, "rose-line", "stroke-width:2.4;stroke-dasharray:6 4"))
        out.append(label(250, 62, "MoS₂", "accent-label") + label(470, 62, "WS₂", "teal-label") + label(366, 288, "원자 단위로 이어진 경계(1D 접합)", "rose-label", "start"))
        title, desc = "lateral heterostructure", "두 2D 물질이 같은 원자층 안에서 옆으로 공유결합으로 이어진 구조."
    return _wrap(title, desc, 312, "".join(out))


def moire_vec(args):
    out = [panel(140, 40, 440, 280, "역공간에서 본 모아레 벡터")]
    o = (220, 280)
    g = 240
    th = math.radians(8)
    g1 = (g, 0)
    g2 = (g * math.cos(th), -g * math.sin(th))
    out.append(dot(o[0], o[1], 5, "atom-4") + label(o[0] - 8, o[1] + 16, "Γ", "math"))
    out.append(arrow(o[0], o[1], o[0] + g1[0], o[1] + g1[1], "accent", 2.4) + label(o[0] + g1[0], o[1] + 20, "G₁ (층 1)", "accent-label"))
    out.append(arrow(o[0], o[1], o[0] + g2[0], o[1] + g2[1], "teal", 2.4) + label(o[0] + g2[0] + 4, o[1] + g2[1] - 10, "G₂ (층 2)", "teal-label"))
    out.append(arrow(o[0] + g2[0], o[1] + g2[1], o[0] + g1[0], o[1] + g1[1], "rose", 2.6, head=7) + label(o[0] + g1[0] + 10, o[1] - 16, "G_M = G₁ − G₂", "rose-label", "start"))
    out.append('<path class="thin" style="stroke:var(--text-2)" d="M{0} {1} A 90 90 0 0 0 {2:.1f} {3:.1f}"/>'.format(o[0] + 90, o[1], o[0] + 90 * math.cos(th), o[1] - 90 * math.sin(th)))
    out.append(label(o[0] + 100, o[1] - 6, "θ", "math", "start"))
    out.append(_text(360, 340, "|G_M| = 2|G| sin(θ/2) → 실공간 모아레 주기 λ = 2π/|G_M| ≈ a/θ", "label"))
    return _wrap("모아레 벡터", "두 층의 역격자 벡터 차이가 모아레 벡터이며, 회전각이 작을수록 짧아져 실공간에서는 긴 주기의 모아레가 된다.", 352, "".join(out))


def structure_factor(args):
    out = [panel(20, 40, 320, 260, "중심 직사각 단위격자")]
    x0, y0, a, b = 90, 90, 180, 150
    out.append(rect(x0, y0, a, b, "var(--accent-soft)", "var(--accent)", 2))
    for x, y in ((x0, y0), (x0 + a, y0), (x0, y0 + b), (x0 + a, y0 + b)):
        out.append(dot(x, y, 9, "atom"))
    out.append(dot(x0 + a / 2, y0 + b / 2, 9, "atom-3"))
    out.append(label(x0 + a / 2, y0 + b / 2 + 26, "(½, ½)", "math") + label(x0 - 6, y0 + b + 22, "(0, 0)", "math", "end"))
    out.append(_text(180, 284, "같은 원자가 모서리와 가운데에 있음", "tiny-label"))
    out.append(panel(380, 40, 320, 260, "회절점: h + k 홀수는 사라짐") + clip("sf", 380, 40, 320, 260))
    cx, cy, s = 540, 170, 36
    g = ['<g clip-path="url(#sf)"><rect x="380" y="40" width="320" height="260" style="fill:var(--text);opacity:.9"/>']
    for h in range(-4, 5):
        for k in range(-3, 4):
            x, y = cx + h * s, cy - k * s * 0.85
            if (h + k) % 2 == 0:
                g.append(dot(x, y, 6 if (h, k) != (0, 0) else 8, "atom" if (h, k) != (0, 0) else "atom-4"))
            else:
                g.append('<circle cx="{0:.1f}" cy="{1:.1f}" r="6" style="fill:none;stroke:#fff;stroke-width:1;stroke-dasharray:2 2;opacity:.6"/>'.format(x, y))
    g.append("</g>")
    out += g
    out.append(_text(360, 322, "F_hk = f[1 + e^{iπ(h+k)}] → h + k 홀수이면 0 (빈 원: 소멸)", "label"))
    return _wrap("구조 인자와 소멸 규칙", "단위격자 안 원자들의 산란파가 위상 차로 상쇄되면, 격자만으로는 허용되는 회절점도 세기가 0이 된다.", 334, "".join(out))


def topdown(args):
    out = []
    for k, (x0, title) in enumerate([(20, "하향식 · 큰 결정을 얇게"), (380, "상향식 · 원자로부터 쌓기")]):
        out.append(panel(x0, 40, 320, 250, title))
    for j in range(8):
        out.append(rect(60, 80 + j * 12, 120, 10, "var(--accent)", None, 2, "opacity:.75"))
    out.append(arrow(190, 130, 240, 130, "text", 2) + rect(250, 126, 70, 8, "var(--accent)", None, 2))
    out.append(label(120, 196, "층상 결정(bulk)", "tiny-label") + label(285, 152, "원자층", "tiny-label"))
    out.append(_text(180, 240, "기계적 박리 · 액상 박리 · 화학적 박리", "label") + _text(180, 262, "결정 품질 좋음 / 크기·양 제한", "tiny-label"))
    import random
    rnd = random.Random(3)
    for i in range(18):
        out.append(dot(420 + rnd.random() * 240, 70 + rnd.random() * 60, 4, "atom" if i % 3 else "atom-3"))
        if i % 3 == 0:
            out.append(arrow(430 + i * 12, 140, 430 + i * 12, 176, "teal", 1.2, head=4))
    out.append(rect(410, 182, 260, 10, "var(--accent)", None, 2) + rect(410, 192, 260, 18, "var(--fig-si)", None, 2) + label(540, 226, "기판 위 막", "tiny-label"))
    out.append(_text(540, 248, "CVD · MOCVD · 에피택시 · ALD", "label") + _text(540, 268, "대면적·웨이퍼 규모 / 결함 제어가 과제", "tiny-label"))
    return _wrap("하향식과 상향식 합성", "큰 층상 결정을 떼어 얇게 만드는 하향식과, 원자·분자 원료를 기판 위에 쌓아 막을 키우는 상향식으로 나뉜다.", 302, "".join(out))


def exfoliation(args):
    out = []
    steps = [("① 결정을 테이프에", 0), ("② 접었다 떼며 얇게", 1), ("③ 기판에 눌렀다 떼기", 2)]
    for k, (name, s) in enumerate(steps):
        x0 = 20 + k * 233
        out.append(panel(x0, 40, 213, 220, name))
        cx = x0 + 106
        if s == 0:
            out.append(rect(cx - 80, 160, 160, 16, "var(--amber)", None, 3, "opacity:.6") + label(cx, 196, "접착 테이프", "tiny-label"))
            for j in range(5):
                out.append(rect(cx - 25, 108 + j * 10, 50, 8, "var(--accent)", None, 1))
        elif s == 1:
            out.append(rect(cx - 80, 96, 160, 14, "var(--amber)", None, 3, "opacity:.6") + rect(cx - 80, 170, 160, 14, "var(--amber)", None, 3, "opacity:.6"))
            for j in range(2):
                out.append(rect(cx - 25, 110 + j * 8, 50, 6, "var(--accent)", None, 1) + rect(cx - 25, 156 - j * 8, 50, 6, "var(--accent)", None, 1))
            out.append(arrow(cx + 90, 160, cx + 90, 120, "text", 1.6, head=5))
        else:
            out.append(rect(cx - 80, 100, 160, 14, "var(--amber)", None, 3, "opacity:.6") + arrow(cx, 86, cx, 66, "text", 1.6, head=5))
            out.append(rect(cx - 80, 170, 160, 12, "var(--fig-oxide)", None, 1) + rect(cx - 80, 182, 160, 22, "var(--fig-si)", None, 2))
            out.append(rect(cx - 30, 165, 22, 5, "var(--accent)", None, 1) + rect(cx + 10, 166, 34, 4, "var(--accent)", None, 1, "opacity:.6"))
            out.append(label(cx, 222, "SiO₂/Si 위 플레이크", "tiny-label"))
    out.append(_text(360, 282, "얇은 플레이크는 SiO₂ 위에서 빛의 간섭으로 색 대비가 생겨 광학 현미경으로 찾는다", "tiny-label"))
    return _wrap("기계적 박리", "접착 테이프로 층상 결정을 반복해 떼어 얇게 만든 뒤 기판에 옮기면 원자 몇 층 두께의 플레이크를 얻는다.", 294, "".join(out))


def lpe(args):
    out = []
    steps = ["① 분말 + 용매", "② 초음파·전단", "③ 원심분리", "④ 나노시트 분산액"]
    for k, nm in enumerate(steps):
        x0 = 20 + k * 175
        out.append(panel(x0, 40, 160, 220, nm))
        cx = x0 + 80
        out.append('<path d="M{0} 90 v120 a10 10 0 0 0 10 10 h60 a10 10 0 0 0 10 -10 v-120" style="fill:var(--fig-oxide);fill-opacity:.25;stroke:var(--border-2);stroke-width:2"/>'.format(cx - 40))
        if k == 0:
            for i in range(6):
                out.append(rect(cx - 30 + (i % 3) * 20, 186 + (i // 3) * 12, 16, 10, "var(--accent)", None, 1))
        elif k == 1:
            for i in range(8):
                out.append(rect(cx - 30 + (i % 4) * 16, 120 + (i // 4) * 40 + (i % 2) * 10, 12, 4, "var(--accent)", None, 1, "opacity:.85"))
            out.append('<path class="amber-line" style="fill:none;stroke-width:1.6" d="M{0} 76 q6 -6 12 0 t12 0 t12 0"/>'.format(cx - 18))
        elif k == 2:
            for i in range(5):
                out.append(rect(cx - 28 + i * 12, 206, 10, 6, "var(--accent)", None, 1))
            for i in range(4):
                out.append(rect(cx - 24 + i * 14, 120 + i * 14, 10, 3, "var(--accent)", None, 1, "opacity:.7"))
            out.append(label(cx, 232, "두꺼운 것 가라앉음", "tiny-label"))
        else:
            for i in range(10):
                out.append(rect(cx - 30 + (i % 5) * 13, 110 + (i // 5) * 50 + (i % 3) * 8, 9, 3, "var(--accent)", None, 1, "opacity:.75"))
    out.append(_text(360, 282, "용매의 표면 에너지가 층과 맞으면 떼어진 층이 다시 뭉치지 않고 분산된다", "tiny-label"))
    return _wrap("액상 박리", "층상 물질 분말을 알맞은 용매에 넣고 초음파나 전단으로 떼어 낸 뒤, 원심분리로 얇은 나노시트만 골라 분산액을 만든다.", 294, "".join(out))


def ald(args):
    out = []
    steps = [("① 원료 A 주입", "A가 표면에 한 겹 흡착", "accent"), ("② 퍼지", "남은 A·부산물 제거", "text"), ("③ 원료 B 주입", "B가 A와 반응해 한 겹 완성", "teal"), ("④ 퍼지", "한 주기 끝 → 반복", "text")]
    for k, (nm, note, col) in enumerate(steps):
        x0 = 20 + k * 175
        out.append(panel(x0, 40, 160, 220, nm))
        cx = x0 + 80
        out.append(rect(x0 + 15, 200, 130, 22, "var(--fig-si)", None, 2))
        if k >= 2:
            out.append(rect(x0 + 15, 192, 130, 8, "var(--fig-nitride)", None, 1))
        for i in range(6):
            x = x0 + 25 + i * 22
            if k in (0, 1):
                out.append(dot(x, 192, 6, "atom"))
            if k in (2, 3):
                out.append(dot(x, 184, 5, "atom-alt"))
        if k == 0:
            for i in range(4):
                out.append(dot(x0 + 35 + i * 30, 110 + (i % 2) * 20, 6, "atom"))
        if k == 2:
            for i in range(4):
                out.append(dot(x0 + 35 + i * 30, 110 + (i % 2) * 20, 5, "atom-alt"))
        if k in (1, 3):
            out.append(arrow(x0 + 30, 120, x0 + 130, 120, "text", 1.6) + label(cx, 108, "불활성 기체", "tiny-label"))
        out.append(_text(cx, 246, note, "tiny-label"))
    out.append(_text(360, 282, "각 반응이 표면 자리를 다 채우면 멈추는 자기 제한 반응 → 주기 수로 두께를 원자층 단위로 조절", "tiny-label"))
    return _wrap("원자층 증착 주기", "원료 A와 B를 번갈아 넣고 그 사이를 불활성 기체로 비우는 주기를 반복해, 한 주기에 원자층 정도씩 막을 쌓는다.", 294, "".join(out))


def mfc(args):
    out = [panel(60, 40, 600, 250)]
    out.append(rect(80, 150, 560, 26, "var(--fig-oxide)", None, 4, "opacity:.5"))
    out.append(arrow(90, 163, 150, 163, "accent", 2.4) + label(96, 146, "기체 입구", "accent-label", "start"))
    out.append(arrow(570, 163, 630, 163, "accent", 2.4) + label(626, 146, "출구", "accent-label", "end"))
    out.append('<path d="M190 150 v-50 h140 v50" style="fill:none;stroke:var(--rose);stroke-width:2.4"/>')
    out.append(rect(220, 88, 80, 24, "var(--rose)", None, 4, "opacity:.25") + label(260, 82, "열식 유량 센서(우회관)", "rose-label"))
    out.append(rect(440, 120, 70, 70, "var(--fig-metal)", None, 6, "opacity:.6") + label(475, 210, "제어 밸브", "label"))
    out.append(rect(330, 220, 120, 40, "var(--surface)", "var(--border-2)", 6) + label(390, 245, "제어 회로", "label-strong"))
    out.append(path([(260, 112), (260, 240), (330, 240)], "teal-line", "fill:none;stroke-width:1.8;stroke-dasharray:5 4"))
    out.append(path([(450, 240), (475, 240), (475, 190)], "teal-line", "fill:none;stroke-width:1.8;stroke-dasharray:5 4"))
    out.append(label(400, 274, "설정값과 측정값을 비교해 밸브 열림을 조절", "teal-label"))
    return _wrap("질량 유량 제어기", "기체 일부를 우회관의 열식 센서로 보내 질량 유량을 재고, 설정값에 맞도록 제어 밸브를 자동으로 조절한다.", 302, "".join(out))


def pvd(args):
    out = [panel(100, 40, 520, 260, "진공 챔버")]
    out.append(rect(220, 70, 280, 18, "var(--fig-si)", None, 3) + label(360, 64, "기판", "label"))
    out.append(rect(300, 250, 120, 24, "var(--fig-metal)", None, 4) + label(360, 292, "원료(증발원 또는 스퍼터 타깃)", "label"))
    for i in range(9):
        x = 310 + i * 12
        out.append(arrow(x, 246, 240 + i * 30, 92, "accent", 1.2, head=5))
    out.append(label(520, 180, "원자·분자가 직진해 기판에 쌓임", "accent-label", "start"))
    out.append(label(150, 230, "가열(증발)", "rose-label", "start") + label(150, 250, "또는 이온 충돌(스퍼터)", "rose-label", "start"))
    return _wrap("물리 기상 증착", "원료를 가열하거나 이온으로 때려 원자·분자를 튀어나오게 하고, 진공 속에서 날아가 기판에 쌓이게 하는 방법.", 312, "".join(out))


def grains(args):
    out = [panel(140, 40, 440, 270)]
    regions = [([(160, 60), (330, 60), (300, 190), (160, 220)], 0, "accent"), ([(330, 60), (560, 60), (560, 160), (420, 210), (300, 190)], 0.35, "teal"),
               ([(160, 220), (300, 190), (420, 210), (450, 290), (160, 290)], 0.8, "amber"), ([(420, 210), (560, 160), (560, 290), (450, 290)], 1.2, "rose")]
    for k, (pts, rot, col) in enumerate(regions):
        cid = "gb%d" % k
        out.append('<clipPath id="{0}"><polygon points="{1}"/></clipPath>'.format(cid, " ".join("{0},{1}".format(*p) for p in pts)))
        g = ['<g clip-path="url(#{0})">'.format(cid)]
        for n in range(-30, 31):
            for ang in (rot, rot + math.pi / 3, rot - math.pi / 3):
                nx, ny = math.cos(ang), math.sin(ang)
                d = n * 12
                px, py = 360 + -ny * d, 175 + nx * d
                g.append('<line x1="{0:.1f}" y1="{1:.1f}" x2="{2:.1f}" y2="{3:.1f}" style="stroke:var(--{4});stroke-width:1;opacity:.55"/>'.format(px - nx * 400, py - ny * 400, px + nx * 400, py + ny * 400, col))
        g.append("</g>")
        out += g
        out.append(poly(pts, "", "fill:none;stroke:var(--text);stroke-width:2.4"))
    out.append(_text(360, 330, "선: 결정립마다 다른 격자 방향 · 굵은 선: 결정립계(원자 배열이 어긋나는 경계)", "tiny-label"))
    return _wrap("결정립계", "방향이 서로 다른 결정립들이 만나는 경계에서는 원자 배열이 어긋나 결함이 생긴다.", 342, "".join(out))


def intercalation(args):
    out = []
    for k, (x0, title, inter) in enumerate([(20, "원래 층상 결정", False), (380, "이온·분자 삽입 후", True)]):
        out.append(panel(x0, 40, 320, 250, title))
        gap = 34 if not inter else 58
        for j in range(4):
            y = 80 + j * gap
            out.append(rect(x0 + 40, y, 240, 14, "var(--accent)", None, 3, "opacity:.75"))
            if inter and j < 3:
                for i in range(7):
                    out.append(dot(x0 + 58 + i * 34, y + 14 + (gap - 14) / 2, 7, "atom-3"))
        out.append(arrow(x0 + 296, 94, x0 + 296, 94 + gap, "text", 1.4, head=5) + arrow(x0 + 296, 94 + gap, x0 + 296, 94, "text", 1.4, head=5))
        out.append(label(x0 + 302, 94 + gap / 2 + 4, "d" if not inter else "d′ > d", "math", "start"))
    out.append(_text(540, 290, "층 간격 증가 · 전자 주입 · 상 변화(예: 2H→1T)", "tiny-label"))
    return _wrap("이온 삽입", "층 사이의 반데르발스 틈에 이온이나 분자를 넣으면 층 간격이 벌어지고 전자가 주입되어 물성이 바뀐다.", 302, "".join(out))


def semimetal_band(args):
    out = []
    specs = [("금속", "페르미 준위가 밴드 한가운데 · 상태 많음",
              [lambda k: -1.2 + 3 * k * k]),
             ("반금속", "두 밴드가 다른 k에서 조금 겹침 · 상태 적음",
              [lambda k: -0.25 + 4 * (k - 0.45) ** 2, lambda k: 0.25 - 4 * (k + 0.45) ** 2]),
             ("반도체", "밴드갭 · 페르미 준위 근처 상태 없음",
              [lambda k: 0.8 + 3 * k * k, lambda k: -0.8 - 3 * k * k])]
    for n, (nm, note, bands) in enumerate(specs):
        x0 = 20 + n * 233
        out.append(panel(x0, 40, 213, 240, nm) + clip("sm%d" % n, x0, 40, 213, 240))
        ex = lambda k: x0 + 106 + k * 90          # 파수 → 화면 x
        ey = lambda e: 160 - e * 55               # 에너지(E_F = 0) → 화면 y
        g = ['<g clip-path="url(#sm{0})">'.format(n)]
        for i, f in enumerate(bands):
            pts = [(ex(k), ey(f(k))) for k in [-1.05 + 2.1 * j / 200 for j in range(201)]]
            g.append(path(pts, ("teal" if (i == 0) else "rose") + "-line", "stroke-width:2.4"))
        g.append("</g>")
        out += g
        out.append(line(x0 + 12, 160, x0 + 201, 160, "dash") + label(x0 + 200, 154, "E_F", "math", "end"))
        out.append(_text(x0 + 106, 270, note, "tiny-label"))
    return _wrap("반금속의 밴드", "반금속은 전도대 바닥과 가전자대 꼭대기가 서로 다른 운동량에서 조금 겹쳐, 페르미 준위 근처 상태가 적다.", 292, "".join(out))


KINDS = {"재구성": reconstruction, "도메인벽": soliton, "에피택시": epitaxy, "격자불일치": mismatch, "이종구조": hetero,
         "모아레벡터": moire_vec, "구조인자": structure_factor, "하향상향": topdown, "박리": exfoliation,
         "액상박리": lpe, "ald": ald, "mfc": mfc, "pvd": pvd, "결정립계": grains, "삽입": intercalation, "반금속": semimetal_band}
