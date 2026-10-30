"""위키 물성 문서용 SVG 그림(자성, 분극, 스핀). wiki_figures.py가 불러 쓴다. 표준 라이브러리만 쓴다.

그림은 개념을 보이기 위한 도식이다. 그림에 숫자는 적지 않는다.
"""

import math

from wiki_figures import _text, _wrap
from wiki_concepts import S3, arrow, clip, dot, label, line, panel, path, poly
from wiki_devices import rect


def _spin(x, y, ang_deg, color="rose", L=28):
    a = math.radians(ang_deg)
    dx, dy = L / 2 * math.sin(a), -L / 2 * math.cos(a)
    return dot(x, y, 4, "atom") + arrow(x - dx, y - dy, x + dx, y + dy, color, 2.6, head=8)


def order(args):
    out = []
    names = [("상자성", "제멋대로 → 알짜 자화 0"), ("강자성", "모두 같은 방향 → 알짜 자화"), ("반강자성", "이웃끼리 반대 → 알짜 자화 0")]
    rnd = [17, 200, 95, 310, 250, 40, 150, 280, 120, 60, 230, 330, 10, 170, 300, 75]
    for k, (name, note) in enumerate(names):
        x0 = 20 + k * 233
        out.append(panel(x0, 40, 213, 220, name))
        for i in range(4):
            for j in range(4):
                x, y = x0 + 40 + i * 45, 80 + j * 42
                ang = rnd[i * 4 + j] if k == 0 else (0 if k == 1 else (0 if (i + j) % 2 == 0 else 180))
                out.append(_spin(x, y, ang, "rose" if k != 2 or (i + j) % 2 == 0 else "teal"))
        out.append(_text(x0 + 106, 280, note, "tiny-label"))
    return _wrap("자기 질서의 종류", "원자 자기 모멘트가 제멋대로면 상자성, 모두 같은 방향이면 강자성, 이웃끼리 반대 방향이면 반강자성이다.", 292, "".join(out))


def mag_temp(args):
    kind = (args[0] if args else "큐리")
    out = [panel(120, 30, 480, 280)]
    x0, y0, w, h = 170, 60, 380, 210
    out.append(arrow(x0, y0 + h, x0, y0 - 8, "text", 1.4, head=6) + arrow(x0, y0 + h, x0 + w + 8, y0 + h, "text", 1.4, head=6))
    out.append(label(x0 + w, y0 + h + 20, "온도 T", "label", "end"))
    tc = x0 + 250
    pts = [(x0 + t, y0 + h - 170 * (max(0, 1 - (t / 250) ** 2.2)) ** 0.33) for t in range(0, 251)]
    pts += [(x0 + t, y0 + h) for t in range(251, w)]
    nm = "T_C" if kind.startswith("큐") else "T_N"
    yl = "자화 M" if kind.startswith("큐") else "부격자 자화 M_s"
    out.append(path(pts, "accent-line", "stroke-width:2.6") + label(x0 + 8, y0 + 4, yl, "label", "start"))
    out.append(line(tc, y0, tc, y0 + h, "dash") + label(tc, y0 + h + 20, nm, "math"))
    out.append(label(x0 + 70, y0 + 30, "질서상", "accent-label") + label(tc + 70, y0 + h - 30, "무질서(상자성)", "tiny-label"))
    if not kind.startswith("큐"):
        chi = [(x0 + t, y0 + h - (90 * (t / 250) ** 3 + 40 if t <= 250 else 130 * 250 / t)) for t in range(30, w)]
        out.append(path(chi, "teal-line", "stroke-width:2;stroke-dasharray:6 4") + label(tc + 8, y0 + 70, "자화율 χ (꼭짓점)", "teal-label", "start"))
    out.append(_text(360, 330, "온도가 오르면 열 요동이 질서를 흔들어, 전이 온도에서 자기 질서가 사라진다", "tiny-label"))
    title = "큐리 온도" if kind.startswith("큐") else "네엘 온도"
    return _wrap(title, "온도가 올라갈수록 자기 질서가 약해지다가 전이 온도에서 사라진다.", 342, "".join(out))


def magnon(args):
    out = [panel(20, 40, 320, 260, "스핀파(실공간)")]
    for i in range(7):
        x = 50 + i * 42
        ph = i * math.pi / 4
        out.append('<ellipse cx="{0}" cy="110" rx="14" ry="5" style="fill:none;stroke:var(--border-2)"/>'.format(x))
        tx, ty = x + 13 * math.cos(ph), 110 + 4.5 * math.sin(ph)
        out.append(dot(x, 170, 7, "atom") + arrow(x, 170, tx, ty, "rose", 2.2, head=6))
    out.append(_text(180, 230, "이웃 스핀이 조금씩 위상이 어긋난 채 세차운동", "tiny-label") + _text(180, 248, "→ 이 파동의 양자가 마그논", "tiny-label"))
    out.append(panel(380, 40, 320, 260, "마그논 분산"))
    x0, y0, w, h = 420, 70, 250, 200
    out.append(arrow(x0, y0 + h, x0, y0 - 6, "text", 1.4, head=6) + arrow(x0, y0 + h, x0 + w + 6, y0 + h, "text", 1.4, head=6))
    out.append(label(x0 + 8, y0 + 4, "E", "math", "start") + label(x0 + w, y0 + h + 18, "k", "math", "end"))
    iso = [(x0 + i, y0 + h - 0.0042 * i * i) for i in range(0, 211)]
    gap = [(x0 + i, y0 + h - 40 - 0.0042 * i * i) for i in range(0, 191)]
    out.append(path(iso, "teal-line", "stroke-width:2.4") + path(gap, "accent-line", "stroke-width:2.4"))
    out.append(arrow(x0 + 10, y0 + h, x0 + 10, y0 + h - 40, "rose", 1.6, head=5) + label(x0 + 16, y0 + h - 16, "Δ", "rose-label", "start"))
    out.append(label(x0 + 240, y0 + h - 60, "등방성: 갭 없음", "teal-label", "end") + label(x0 + 110, y0 + 60, "이방성: 갭 Δ", "accent-label", "end"))
    out.append(_text(540, 290, "2D에서 갭이 없으면 열 마그논이 질서를 무너뜨림", "tiny-label"))
    return _wrap("마그논", "자기 질서 속 스핀이 조금씩 어긋나며 퍼지는 스핀파의 양자. 자기 이방성이 있으면 에너지 갭 Δ가 생긴다.", 312, "".join(out))


def anisotropy(args):
    out = [panel(20, 40, 320, 260, "쉬운 축 이방성")]
    cx, cy = 180, 170
    out.append(rect(cx - 100, cy + 30, 200, 16, "var(--fig-si)", None, 2) + label(cx, cy + 66, "2D 자성층", "tiny-label"))
    out.append(arrow(cx, cy + 20, cx, cy - 80, "rose", 3, head=10) + label(cx + 10, cy - 70, "쉬운 축(면에 수직)", "rose-label", "start"))
    out.append(arrow(cx - 20, cy, cx - 100, cy, "teal", 2, dash=True) + label(cx - 104, cy - 8, "어려운 방향", "teal-label", "end"))
    out.append(panel(380, 40, 320, 260, "자화 방향에 따른 에너지"))
    x0, y0, w, h = 420, 70, 250, 190
    out.append(arrow(x0, y0 + h, x0, y0 - 6, "text", 1.4, head=6) + arrow(x0, y0 + h, x0 + w + 6, y0 + h, "text", 1.4, head=6))
    pts = [(x0 + i, y0 + h - 10 - 150 * math.sin(math.pi * i / 250) ** 2) for i in range(251)]
    out.append(path(pts, "accent-line", "stroke-width:2.4"))
    out.append(label(x0, y0 + h + 18, "0°", "math") + label(x0 + 125, y0 + h + 18, "90°", "math") + label(x0 + 250, y0 + h + 18, "180°", "math"))
    out.append(label(x0 + 8, y0 + 4, "E = K sin²θ", "accent-label", "start") + label(x0 + 125, y0 + 30, "↑ 이방성 에너지 장벽", "tiny-label"))
    return _wrap("자기 이방성", "자화가 특정 방향(쉬운 축)을 향할 때 에너지가 가장 낮고, 다른 방향으로 돌리려면 이방성 에너지만큼 대가가 든다.", 312, "".join(out))


def layered_afm(args):
    out = []
    for k, (x0, title, dirs) in enumerate([(20, "이중층 CrI₃ · 자기장 없음", (0, 180)), (380, "자기장을 걸면", (0, 0))]):
        out.append(panel(x0, 40, 320, 250, title))
        for li, (yy, d) in enumerate(zip((110, 200), dirs)):
            out.append(rect(x0 + 40, yy - 22, 240, 44, "var(--fig-ndope)", None, 6, "opacity:.35"))
            for i in range(5):
                out.append(_spin(x0 + 70 + i * 45, yy, d, "rose" if d == 0 else "teal", 24))
            out.append(label(x0 + 290, yy + 4, "{0}층".format(2 - li), "tiny-label", "end"))
        out.append(_text(x0 + 160, 274, "층 안 강자성, 층 사이 반강자성" if k == 0 else "두 층이 같은 방향으로 정렬", "tiny-label"))
    out.append(arrow(355, 260, 355, 90, "amber", 2.2) + label(349, 84, "B", "amber-label", "end"))
    return _wrap("층간 반강자성", "이중층 CrI₃는 각 층 안에서는 스핀이 나란하지만 두 층이 서로 반대 방향이며, 자기장을 걸면 같은 방향으로 바뀐다.", 302, "".join(out))


def neel(args):
    out = [panel(140, 40, 440, 250)]
    for i in range(6):
        x = 190 + i * 64
        up = i % 2 == 0
        out.append(_spin(x, 130, 0 if up else 180, "rose" if up else "teal", 30))
    out.append(label(190, 182, "부격자 A: M_A", "rose-label") + label(254, 92, "부격자 B: M_B", "teal-label"))
    out.append(arrow(300, 240, 300, 200, "rose", 2.4) + arrow(340, 200, 340, 240, "teal", 2.4))
    out.append(label(320, 262, "M = M_A + M_B ≈ 0", "label-strong"))
    out.append(arrow(460, 250, 460, 190, "accent", 3) + label(470, 226, "L = M_A − M_B", "accent-label", "start"))
    return _wrap("네엘 벡터", "반강자성체는 두 부격자의 자화가 상쇄되어 알짜 자화는 0이지만, 그 차이인 네엘 벡터 L이 질서의 방향을 나타낸다.", 302, "".join(out))


def polarization(args):
    out = []
    for k, (x0, title, inplane) in enumerate([(20, "면내 분극 (예: SnTe, SnS)", True), (380, "면외 분극 (예: In₂Se₃, CuInP₂S₆)", False)]):
        out.append(panel(x0, 40, 320, 250, title))
        out.append(rect(x0 + 40, 140, 240, 50, "var(--fig-nitride)", None, 6, "opacity:.5") + label(x0 + 160, 212, "원자층", "tiny-label"))
        for i in range(4):
            cx = x0 + 70 + i * 60
            if inplane:
                out.append(dot(cx - 8, 165, 9, "atom-3") + dot(cx + 10, 165, 7, "atom-alt"))
            else:
                out.append(dot(cx, 160, 9, "atom-3") + dot(cx, 176, 7, "atom-alt"))
        if inplane:
            out.append(arrow(x0 + 90, 112, x0 + 230, 112, "rose", 3, head=10) + label(x0 + 160, 102, "P (층 안 방향)", "rose-label"))
        else:
            out.append(arrow(x0 + 300, 210, x0 + 300, 100, "rose", 3, head=10) + label(x0 + 294, 94, "P (층에 수직)", "rose-label", "end"))
        out.append(_text(x0 + 160, 270, "음·양이온 중심이 층 안에서 어긋남" if inplane else "음·양이온 중심이 위아래로 어긋남", "tiny-label"))
    return _wrap("면내 분극과 면외 분극", "2D 강유전체는 분극이 층 안을 향하는 면내형과 층에 수직인 면외형으로 나뉜다.", 302, "".join(out))


def depol(args):
    out = []
    for k, (x0, title, screened) in enumerate([(20, "전극 없음", False), (380, "양면 전극으로 가림", True)]):
        out.append(panel(x0, 40, 320, 250, title))
        if screened:
            out.append(rect(x0 + 50, 82, 220, 14, "var(--fig-metal)", None, 2) + rect(x0 + 50, 214, 220, 14, "var(--fig-metal)", None, 2))
        out.append(rect(x0 + 50, 96, 220, 118, "var(--fig-nitride)", None, 2, "opacity:.45"))
        for i in range(8):
            x = x0 + 64 + i * 27
            out.append(label(x, 110, "+", "rose-label") + label(x, 208, "−", "teal-label"))
            if screened:
                out.append(label(x, 92, "−", "teal-label") + label(x, 226, "+", "rose-label"))
        out.append(arrow(x0 + 100, 196, x0 + 100, 122, "rose", 3, head=9) + label(x0 + 92, 162, "P", "rose-label", "end"))
        if not screened:
            out.append(arrow(x0 + 210, 124, x0 + 210, 192, "accent", 2.4, head=8) + label(x0 + 218, 162, "E_d", "accent-label", "start"))
            out.append(_text(x0 + 160, 270, "표면 속박 전하가 분극과 반대 방향 전기장을 만듦", "tiny-label"))
        else:
            out.append(_text(x0 + 160, 270, "전극의 자유 전하가 속박 전하를 상쇄 → E_d 감소", "tiny-label"))
    return _wrap("탈분극장", "분극된 막의 양쪽 표면에 생긴 속박 전하가 분극을 약하게 하는 반대 방향 전기장을 만들고, 전극이나 자유 전하가 이를 가린다.", 302, "".join(out))


def sliding(args):
    out = []
    for k, (x0, title, shift, up) in enumerate([(20, "AB 적층 · 분극 위", 1, True), (380, "BA 적층 · 분극 아래", -1, False)]):
        out.append(panel(x0, 40, 320, 250, title))
        a = 40
        for li, (yy, off) in enumerate(((120, 0), (190, shift * a / 2 * 0.8))):
            for i in range(-1, 8):
                x = x0 + 40 + i * a + off
                if x0 + 20 < x < x0 + 300:
                    out.append(dot(x, yy, 8, "atom-3" if (i % 2 == 0) else "atom-alt"))
                    if x0 + 20 < x + a < x0 + 300:
                        out.append(line(x + 8, yy, x + a - 8, yy, "line", "stroke-width:2"))
        out.append(arrow(x0 + 290, 210 if up else 104, x0 + 290, 104 if up else 210, "rose", 3, head=10) + label(x0 + 282, 98 if up else 230, "P", "rose-label", "end"))
        out.append(_text(x0 + 160, 270, "아래층이 오른쪽으로 밀림" if up else "아래층이 왼쪽으로 밀림", "tiny-label"))
    out.append(arrow(330, 160, 390, 160, "accent", 2.2) + label(360, 150, "미끄럼", "accent-label"))
    return _wrap("층간 미끄럼 강유전성", "두 층이 원자 결합 길이의 일부만큼 옆으로 미끄러지면 적층이 AB↔BA로 바뀌며 면에 수직한 분극이 뒤집힌다.", 302, "".join(out))


def spin_valley(args):
    out = [panel(20, 40, 680, 260, "단층 TMD의 스핀–밸리 결합")]
    for k, (cx, name, pol, sgn) in enumerate([(200, "K", "σ+", 1), (520, "K′", "σ−", -1)]):
        out.append(path([(cx + i, 110 - 0.004 * i * i) for i in range(-90, 91)], "teal-line", "stroke-width:2.4"))
        up = [(cx + i, 170 + 0.004 * i * i) for i in range(-90, 91)]
        dn = [(cx + i, 196 + 0.004 * i * i) for i in range(-90, 91)]
        out.append(path(up if sgn > 0 else dn, "rose-line", "stroke-width:2.4") + path(dn if sgn > 0 else up, "amber-line", "stroke-width:2.4"))
        out.append(label(cx + 96, 176 if sgn > 0 else 202, "↑", "rose-label", "start") + label(cx + 96, 202 if sgn > 0 else 176, "↓", "amber-label", "start"))
        out.append(arrow(cx, 168, cx, 104, "accent", 2.4))
        out.append(label(cx + 8, 140, pol + " 원편광", "accent-label", "start"))
        out.append(label(cx, 280, name + " 밸리", "label-strong"))
    out.append(_text(360, 72, "가전자대가 스핀–궤도 결합으로 갈라지고, K와 K′에서 위아래가 뒤바뀜(시간 반전 대칭)", "tiny-label"))
    return _wrap("스핀–밸리 결합", "단층 TMD의 K와 K′ 밸리는 서로 반대 원편광 빛에 반응하고, 가전자대의 스핀 갈라짐도 반대여서 스핀과 밸리가 묶인다.", 312, "".join(out))


def sot(args):
    out = [panel(100, 40, 520, 270)]
    out.append(rect(150, 200, 420, 40, "var(--fig-metal)", None, 3) + label(360, 226, "무거운 금속(Pt, Ta, W) 또는 WTe₂", "label-strong"))
    out.append(arrow(170, 254, 550, 254, "accent", 2.4) + label(360, 278, "면내 전류 J", "accent-label"))
    out.append(rect(230, 120, 260, 80, "var(--fig-ndope)", None, 3, "opacity:.5") + label(560, 162, "자성층", "label", "end"))
    for i in range(6):
        x = 240 + i * 46
        out.append(dot(x, 206, 4, "atom-4") + label(x, 196, "⊙" if i % 2 == 0 else "", "tiny-label"))
    out.append(label(360, 112, "계면에 쌓인 스핀이 자화에 토크를 줌", "rose-label"))
    out.append(arrow(360, 186, 360, 134, "rose", 3, head=10) + '<path class="amber-line" style="fill:none;stroke-width:2" d="M330 150 A 34 14 0 1 0 392 150"/>')
    out.append(_text(360, 330, "스핀 홀 효과 등으로 전류가 수직 방향의 스핀 흐름을 만들고, 이 스핀이 위 자성층의 자화를 뒤집는다", "tiny-label"))
    return _wrap("스핀–궤도 토크", "무거운 금속층에 흐르는 면내 전류가 스핀–궤도 결합으로 스핀 흐름을 만들어, 이웃 자성층의 자화를 뒤집는 토크를 준다.", 342, "".join(out))


KINDS = {"자성질서": order, "자화온도": mag_temp, "마그논": magnon, "이방성": anisotropy, "층간반강자성": layered_afm,
         "네엘": neel, "분극방향": polarization, "탈분극": depol, "미끄럼": sliding, "스핀밸리": spin_valley, "sot": sot}
