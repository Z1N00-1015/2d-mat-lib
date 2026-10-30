"""위키 분석법 문서용 SVG 그림(장비 모식도, 원리, 스펙트럼). wiki_figures.py가 불러 쓴다. 표준 라이브러리만 쓴다.

그림은 원리를 보이기 위한 도식이다. 피크 위치처럼 숫자를 적는 값은 문서의 출처에 있는 값이나 그 값에서 계산한 값만 쓴다.
"""

import math

from wiki_figures import W, _esc, _peaks, _spectrum, _text, _wrap
from wiki_concepts import S3, arrow, clip, dot, label, lattice_points, line, panel, path, poly


def _lens(cx, y, w=70, cls="soft"):
    return '<ellipse class="{0}" cx="{1}" cy="{2}" rx="{3}" ry="7"/>'.format(cls, cx, y, w / 2)


# ── 스펙트럼 ───────────────────────────────────────────────────────
def xrd(args):
    peaks = _peaks(args[0], 0.35)
    pos = [p for p, _, _, _ in peaks]
    lo, hi = max(5, min(pos) - 6), max(pos) + 6
    step = 5 if hi - lo <= 45 else 10
    desc = "XRD 피크: " + ", ".join("{0} 2θ = {1:g}°".format(n, p) for p, _, n, _ in peaks if n)
    return _spectrum(peaks, lo, hi, step, "2θ (°) · Cu Kα (λ = 1.5406 Å)", lambda v: "{0:g}".format(v), title="XRD 패턴", desc=desc)


def raman_shift(args):
    """스토크스·반스토크스 대칭 스펙트럼. 반스토크스 세기는 300 K 볼츠만 인자로 줄인다."""
    peaks = []
    for p, a, n, w in _peaks(args[0], 4):
        boltz = math.exp(-p * 1.4388 / 300)   # hc·ν̃/kT, ν̃ in cm⁻¹ → 1.4388 cm·K
        peaks.append((p, a, n, w))
        peaks.append((-p, a * boltz, "", w))
    hi = max(p for p, _, _, _ in peaks) + 80
    lo = -hi
    out = _spectrum(peaks, lo, hi, 100, "Raman shift (cm⁻¹) · 왼쪽: 반스토크스, 오른쪽: 스토크스", lambda v: "{0:g}".format(v),
                    band=(-60, 60), band_label="레일리(필터로 차단)", title="스토크스·반스토크스 라만", desc="레이저 선(0) 양쪽에 같은 이동량의 스토크스·반스토크스 피크가 나타나고, 상온에서는 반스토크스가 약하다.")
    return out


def eels(args):
    out = []
    x0, x1, y0, y1 = 60, 690, 50, 250
    out.append(line(x0, y1, x1, y1, "axis") + line(x0, y1, x0, y0, "axis"))
    pts = []
    for i in range(400):
        e = i / 399
        zl = math.exp(-((e - 0.03) / 0.012) ** 2)
        pl = 0.22 * math.exp(-((e - 0.18) / 0.05) ** 2)
        bg = 0.12 * math.exp(-e * 4)
        edge = 0.07 * (1 if e > 0.62 else 0) * math.exp(-(e - 0.62) * 3) if e > 0.62 else 0
        y = min(1.0, zl) * 0.95 + pl + bg + edge + 0.01
        pts.append((x0 + e * (x1 - x0), y1 - y * 180))
    out.append(path(pts, "accent-line"))
    out.append(label(x0 + 0.03 * (x1 - x0) + 14, y0 + 8, "① 영손실 피크", "accent-label", "start"))
    out.append(label(x0 + 0.18 * (x1 - x0), y1 - 0.31 * 180 - 12, "② 플라스몬", "accent-label"))
    out.append(label(x0 + 0.62 * (x1 - x0) + 6, y1 - 0.13 * 180 - 14, "③ 내각 전자 흡수端(원소마다 고유)", "accent-label", "start").replace("흡수端", "흡수단"))
    out.append(_text((x0 + x1) / 2, y1 + 22, "에너지 손실 (eV) →", "label"))
    out.append('<text class="tiny-label" transform="translate(30 {0}) rotate(-90)" text-anchor="middle">전자 수</text>'.format((y0 + y1) / 2))
    return _wrap("EELS 스펙트럼의 구성", "투과한 전자가 잃은 에너지별 세기. 에너지를 잃지 않은 영손실 피크, 집단 진동(플라스몬), 원소 고유의 내각 흡수단이 차례로 나타난다.", 286, "".join(out))


# ── 원리 그림 ──────────────────────────────────────────────────────
def raman_levels(args):
    out = [panel(60, 40, 600, 250)]
    yg, yv, yvirt = 250, 214, 90
    out.append(line(90, yg, 630, yg, "line", "stroke-width:2.4") + line(90, yv, 630, yv, "line", "stroke-width:1.8"))
    out.append(line(90, yvirt, 630, yvirt, "dash"))
    out.append(label(98, yg - 6, "바닥 상태 (v = 0)", "tiny-label", "start") + label(98, yv - 6, "진동 들뜬 상태 (v = 1)", "tiny-label", "start") + label(98, yvirt - 6, "가상 준위", "tiny-label", "start"))
    cols = [(230, "레일리", yg, yg, "text"), (380, "스토크스", yg, yv, "teal"), (530, "반스토크스", yv, yg, "rose")]
    for x, name, start, end, col in cols:
        out.append(arrow(x - 14, start, x - 14, yvirt + 2, "accent", 2.4))
        out.append(arrow(x + 14, yvirt + 2, x + 14, end, col, 2.4))
        out.append(_text(x, 30 + 0, "", "label"))
        out.append(label(x, 272, name, "label-strong"))
    out.append(label(360, 64, "들어온 빛(보라) → 나간 빛: 같음 / 에너지 잃음 / 에너지 얻음", "tiny-label"))
    return _wrap("레일리·스토크스·반스토크스 산란", "레일리 산란은 같은 에너지로, 스토크스는 진동 하나를 남겨 낮은 에너지로, 반스토크스는 진동 하나를 가져가 높은 에너지로 빛이 나간다.", 300, "".join(out))


def phonon(args):
    out = [panel(20, 40, 320, 270, "이원자 사슬의 포논 분산")]
    m1, m2 = 1.0, 2.0
    x0, x1, yb, yt = 50, 320, 290, 70
    out.append(arrow(x0, yb, x0, yt - 10, "text", 1.4, head=6) + label(x0 + 8, yt - 4, "ω", "math", "start"))
    out.append(arrow(x0, yb, x1 + 6, yb, "text", 1.4, head=6) + label(x1 + 4, yb + 18, "k", "math", "end"))
    s = 1 / m1 + 1 / m2
    wmax = math.sqrt(2 * s)
    ac, op = [], []
    for i in range(101):
        k = i / 100 * math.pi
        root = math.sqrt(s * s - 4 * math.sin(k / 2) ** 2 / (m1 * m2))
        ac.append((x0 + (x1 - x0) * i / 100, yb - math.sqrt(s - root) / wmax * (yb - yt)))
        op.append((x0 + (x1 - x0) * i / 100, yb - math.sqrt(s + root) / wmax * (yb - yt)))
    out.append(path(ac, "teal-line") + path(op, "rose-line"))
    out.append(label(250, ac[70][1] + 22, "음향 가지", "teal-label") + label(160, op[40][1] - 10, "광학 가지", "rose-label"))
    out.append(label(x0, yb + 18, "0", "math") + label(x1, yb + 30, "π/a", "math"))
    out.append(panel(380, 40, 320, 270, "원자가 움직이는 방식"))
    for row, (yy, name, col, phase) in enumerate([(120, "음향: 이웃이 같은 방향", "teal", 1), (230, "광학: 이웃이 반대 방향", "rose", -1)]):
        out.append(label(540, yy - 36, name, col + "-label"))
        for i in range(6):
            x = 410 + i * 52
            r = 9 if i % 2 == 0 else 13
            out.append(dot(x, yy, r, "atom" if i % 2 == 0 else "atom-3"))
            sign = 1 if phase == 1 or i % 2 == 0 else -1
            out.append(arrow(x - 9 * sign, yy + 26, x + 9 * sign, yy + 26, col, 1.8, head=5))
    out.append(_text(540, 296, "라만에서 보는 것은 k ≈ 0의 광학 포논", "tiny-label"))
    return _wrap("포논", "결정 격자의 집단 진동. 이웃 원자가 함께 움직이는 음향 가지와 서로 반대로 움직이는 광학 가지가 있다.", 320, "".join(out))


def photoelectron(args):
    out = [panel(20, 40, 320, 260, "광전 효과로 내각 전자 방출")]
    cx, cy = 160, 190
    for r in (24, 52, 80):
        out.append('<circle class="thin" cx="{0}" cy="{1}" r="{2}" style="fill:none"/>'.format(cx, cy, r))
    out.append(dot(cx, cy, 10, "atom-4"))
    out.append(dot(cx + 24, cy, 5, "atom-alt", ) .replace('class="atom-alt"', 'class="atom-alt" style="fill:none;stroke:var(--teal);stroke-width:2"'))
    out.append(dot(cx - 52, cy, 5, "atom-alt") + dot(cx + 37, cy - 37, 5, "atom-alt"))
    out.append('<path class="amber-line" style="fill:none;stroke-width:2" d="M40 70 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0"/>')
    out.append(arrow(140, 70, cx + 18, cy - 10, "amber", 2.2) + label(60, 92, "X선 hν", "amber-label", "start"))
    out.append(arrow(cx + 28, cy - 4, 310, 80, "teal", 2.2) + label(300, 100, "광전자", "teal-label", "end"))
    out.append(label(cx + 24, cy + 22, "빈자리", "tiny-label"))
    out.append(panel(380, 40, 320, 260, "에너지 관계"))
    yv, yf, yc = 90, 130, 260
    out.append(line(410, yv, 680, yv, "dash") + label(676, yv - 6, "진공 준위", "tiny-label", "end"))
    out.append(line(410, yf, 680, yf, "line", "stroke-width:1.6") + label(676, yf - 6, "페르미 준위", "tiny-label", "end"))
    out.append(line(410, yc, 680, yc, "rose-line", "stroke-width:2.4") + label(676, yc - 6, "내각 준위", "rose-label", "end"))
    out.append(arrow(450, yc, 450, yf, "rose", 1.8, head=6) + label(458, 200, "결합 에너지 BE", "rose-label", "start"))
    out.append(arrow(600, yf, 600, yv, "text", 1.6, head=6) + label(608, 114, "φ", "math", "start"))
    out.append(arrow(530, yc, 530, 54, "amber", 1.8, head=6) + label(538, 180, "hν", "amber-label", "start"))
    out.append(_text(540, 290, "KE = hν − BE − φ → 운동 에너지를 재서 BE를 구함", "tiny-label"))
    return _wrap("X선 광전자 분광의 원리", "X선이 원자의 내각 전자를 떼어 내고, 나온 광전자의 운동 에너지에서 원소마다 고유한 결합 에너지를 구한다.", 312, "".join(out))


def chem_shift(args):
    peaks_a = [(0.0, 1.0, "환원 상태", 0.9)]
    out = []
    x0, x1, y0, y1 = 60, 690, 60, 240
    out.append(line(x0, y1, x1, y1, "axis"))
    for c, amp, col, name in ((0.62, 1.0, "accent", "낮은 산화수 (예: 금속·황화물)"), (0.38, 0.55, "rose", "높은 산화수 (예: 산화물)")):
        pts = [(x0 + (x1 - x0) * i / 300, y1 - amp * 150 / (1 + ((i / 300 - c) / 0.03) ** 2)) for i in range(301)]
        out.append(path(pts, col + "-line"))
        out.append(label(x0 + c * (x1 - x0), y1 - amp * 150 - 12, name, col + "-label"))
    out.append(arrow(x0 + 0.6 * (x1 - x0), 226, x0 + 0.4 * (x1 - x0), 226, "text", 1.8))
    out.append(label(x0 + 0.5 * (x1 - x0), 218, "chemical shift", "label-strong"))
    out.append(_text(x0, y1 + 20, "← 결합 에너지 큼", "label", "start") + _text(x1, y1 + 20, "결합 에너지 작음 →", "label", "end"))
    return _wrap("XPS chemical shift", "같은 원소라도 산화되어 전자를 잃으면 남은 내각 전자가 더 강하게 묶여 피크가 높은 결합 에너지 쪽으로 이동한다.", 276, "".join(out))


def eds(args):
    out = [panel(140, 40, 440, 260, "특성 X선이 나오는 과정")]
    cx, cy = 330, 175
    shells = [(30, "K"), (62, "L"), (94, "M")]
    for r, n in shells:
        out.append('<circle class="thin" cx="{0}" cy="{1}" r="{2}" style="fill:none"/>'.format(cx, cy, r) + label(cx + r * 0.71 + 6, cy - r * 0.71, n, "tiny-label", "start"))
    out.append(dot(cx, cy, 10, "atom-4"))
    out.append(dot(cx - 30, cy, 6, "atom-alt").replace('class="atom-alt"', 'class="atom-alt" style="fill:none;stroke:var(--teal);stroke-width:2"'))
    out.append(dot(cx - 62, cy - 4, 6, "atom-alt") + dot(cx + 44, cy + 44, 6, "atom-alt"))
    out.append(arrow(170, 70, cx - 36, cy - 8, "accent", 2.2) + label(176, 64, "① 입사 전자", "accent-label", "start"))
    out.append(arrow(cx - 34, cy + 6, 190, 280, "accent", 1.8, dash=True) + label(200, 290, "K껍질 전자 튕겨 나감", "tiny-label", "start"))
    out.append('<path class="teal-line" style="fill:none;stroke-width:2.2" d="M{0} {1} Q {2} {3} {4} {5}"/>'.format(cx - 62, cy - 10, cx - 50, cy - 40, cx - 32, cy - 8))
    out.append(label(cx - 64, cy - 40, "② L 전자가 빈자리로", "teal-label", "end"))
    out.append('<path class="amber-line" style="fill:none;stroke-width:2" d="M{0} {1} q8 -8 16 0 t16 0 t16 0 t16 0 t16 0 t16 0"/>'.format(cx + 104, cy + 10))
    out.append(arrow(cx + 200, cy + 10, cx + 216, cy + 10, "amber", 2, head=7) + label(cx + 160, cy - 6, "③ 특성 X선 Kα", "amber-label"))
    out.append(_text(360, 318, "X선 에너지 = 두 껍질의 에너지 차 → 원소마다 고유", "label"))
    return _wrap("EDS 특성 X선", "전자빔이 안쪽 껍질 전자를 떼어 내면 바깥 전자가 빈자리를 채우며 두 준위 차이만큼의 X선을 내고, 그 에너지로 원소를 구별한다.", 330, "".join(out))


def tem(args):
    out = [panel(150, 30, 420, 380)]
    cx = 300
    items = [(52, "전자총", None), (100, "집속 렌즈", "lens"), (150, "시료", "spec"), (190, "대물 렌즈", "lens"),
             (222, "대물 조리개 (뒤초점면)", "ap"), (262, "제한 시야 조리개 (상면)", "ap"), (306, "중간·투사 렌즈", "lens"), (378, "형광판·카메라", "screen")]
    # 빔
    out.append(poly([(cx - 6, 60), (cx + 6, 60), (cx + 40, 100), (cx + 30, 150), (cx + 44, 190), (cx, 222), (cx - 44, 190), (cx - 30, 150), (cx - 40, 100)], "area", "opacity:.55"))
    out.append(poly([(cx - 44, 190), (cx + 44, 190), (cx + 14, 262), (cx + 60, 306), (cx + 110, 378), (cx - 110, 378), (cx - 60, 306), (cx - 14, 262)], "area", "opacity:.35"))
    for y, name, kind in items:
        if kind == "lens":
            out.append(_lens(cx, y, 120))
        elif kind == "spec":
            out.append('<rect class="slab" x="{0}" y="{1}" width="90" height="6"/>'.format(cx - 45, y - 3))
        elif kind == "ap":
            out.append(line(cx - 70, y, cx - 10, y, "line", "stroke-width:3") + line(cx + 10, y, cx + 70, y, "line", "stroke-width:3"))
        elif kind == "screen":
            out.append('<rect class="slab" x="{0}" y="{1}" width="240" height="10"/>'.format(cx - 120, y - 5))
        else:
            out.append('<rect class="slab" x="{0}" y="{1}" width="40" height="22" rx="4"/>'.format(cx - 20, y - 16))
        out.append(line(cx + 125, y, 418, y, "thin") + label(424, y + 4, name, "label", "start"))
    out.append(_text(360, 428, "대물 렌즈 아래 뒤초점면에 회절 무늬, 상면에 영상이 생긴다. 투사 렌즈를 어디에 맞추느냐로 영상/회절을 고른다.", "tiny-label"))
    return _wrap("투과전자현미경의 구조", "전자총에서 나온 전자가 집속 렌즈를 지나 얇은 시료를 투과하고, 대물 렌즈와 투사 렌즈가 영상이나 회절 무늬를 확대해 카메라에 맺는다.", 440, "".join(out))


def stem(args):
    out = [panel(120, 30, 480, 360)]
    cx = 360
    out.append(_lens(cx, 70, 140) + label(cx + 80, 74, "집속 렌즈", "label", "start"))
    out.append(poly([(cx - 60, 74), (cx + 60, 74), (cx + 4, 160), (cx - 4, 160)], "area", "opacity:.6"))
    out.append('<rect class="slab" x="{0}" y="157" width="200" height="6"/>'.format(cx - 100) + label(cx + 104, 164, "시료", "label", "start"))
    out.append(arrow(cx - 90, 140, cx - 30, 140, "text", 1.6, head=6) + arrow(cx + 90, 140, cx + 30, 140, "text", 1.6, head=6))
    out.append(label(cx - 96, 136, "탐침을 한 점씩 주사", "tiny-label", "end"))
    # 산란 원뿔
    for ang, op in ((10, .5), (28, .35), (55, .25)):
        dx = 200 * math.tan(math.radians(ang))
        out.append(poly([(cx, 163), (cx + dx, 340), (cx - dx, 340)], "area", "opacity:{0}".format(op)))
    # 검출기
    out.append('<rect class="slab" x="{0}" y="338" width="60" height="12" style="fill:var(--teal)"/>'.format(cx - 30))
    out.append('<rect class="slab" x="{0}" y="338" width="50" height="12" style="fill:var(--amber)"/><rect class="slab" x="{1}" y="338" width="50" height="12" style="fill:var(--amber)"/>'.format(cx - 110, cx + 60))
    out.append('<rect class="slab" x="{0}" y="338" width="90" height="12" style="fill:var(--rose)"/><rect class="slab" x="{1}" y="338" width="90" height="12" style="fill:var(--rose)"/>'.format(cx - 230, cx + 140))
    out.append(label(cx, 372, "BF (가운데)", "teal-label") + label(cx - 85, 372, "ADF", "amber-label") + label(cx + 85, 372, "ADF", "amber-label"))
    out.append(label(cx - 185, 372, "HAADF (바깥 고리)", "rose-label") + label(cx + 185, 372, "HAADF", "rose-label"))
    out.append(_text(360, 404, "큰 각도로 산란된 전자일수록 원자번호 Z에 민감 → HAADF 밝기 ≈ Z^1.7–2", "tiny-label"))
    return _wrap("STEM과 검출기", "가늘게 모은 전자 탐침으로 시료를 한 점씩 주사하며, 투과·산란 각도에 따라 BF, ADF, HAADF 검출기로 신호를 모은다.", 416, "".join(out))


def _hex_spots(cx, cy, g, rot=0.0, n=2, labels=True, r0=5.0):
    out = []
    for i in range(-n, n + 1):
        for j in range(-n, n + 1):
            x = i * g + j * g / 2
            y = j * g * S3 / 2
            if math.hypot(x, y) > n * g + 1:
                continue
            xr = x * math.cos(rot) - y * math.sin(rot)
            yr = x * math.sin(rot) + y * math.cos(rot)
            d = math.hypot(x, y) / g
            r = r0 * (1.6 if d < 0.1 else (1.0 if d < 1.1 else 0.8))
            out.append(dot(cx + xr, cy + yr, r, "atom" if d > 0.1 else "atom-4"))
    return "".join(out)


def saed(args):
    out = [panel(20, 40, 320, 280, "단층 육방정의 회절 무늬"), clip("sd", 20, 40, 320, 280)]
    cx, cy = 180, 180
    out.append('<g clip-path="url(#sd)"><rect x="20" y="40" width="320" height="280" style="fill:var(--text);opacity:.9"/>' + _hex_spots(cx, cy, 52) + "</g>")
    out.append('<circle cx="{0}" cy="{1}" r="52" style="fill:none;stroke:var(--teal);stroke-width:1.4;stroke-dasharray:4 4"/>'.format(cx, cy))
    out.append('<circle cx="{0}" cy="{1}" r="{2:.1f}" style="fill:none;stroke:var(--amber);stroke-width:1.4;stroke-dasharray:4 4"/>'.format(cx, cy, 52 * S3))
    out.append(label(cx + 40, cy - 44, "{100}", "teal-label") + label(cx + 72, cy - 78, "{110}", "amber-label"))
    out.append('<text class="tiny-label" x="{0}" y="{1}" text-anchor="middle" style="fill:#fff">투과빔</text>'.format(cx, cy + 24))
    out.append(panel(380, 40, 320, 280, "카메라 길이와 반지름"))
    sx, sy = 420, 90
    out.append('<rect class="slab" x="{0}" y="{1}" width="70" height="6"/>'.format(sx - 35 + 60, sy - 3) + label(sx + 100, sy + 4, "시료", "label", "start"))
    tx = sx + 60
    out.append(arrow(tx, 50, tx, sy, "accent", 2) + arrow(tx, sy, tx, 290, "accent", 2) + arrow(tx, sy, tx + 150, 290, "teal", 2))
    out.append('<rect class="slab" x="400" y="290" width="280" height="8"/>' + label(676, 312, "검출기", "tiny-label", "end"))
    out.append(arrow(tx + 4, 280, tx + 146, 280, "text", 1.4, head=5) + label(tx + 75, 274, "R", "math"))
    out.append(arrow(tx - 24, sy, tx - 24, 290, "text", 1.4, head=5) + arrow(tx - 24, 290, tx - 24, sy, "text", 1.4, head=5) + label(tx - 30, 196, "L", "math", "end"))
    out.append(label(tx + 28, sy + 40, "2θ", "math", "start"))
    out.append(_text(540, 340, "작은 각에서 R·d = λL (λL: 카메라 상수)", "label"))
    return _wrap("전자 회절 무늬와 카메라 길이", "육방정 단결정의 회절 점은 육각형으로 늘어서고, 중심에서 점까지 거리 R은 면간 거리 d와 R·d = λL로 이어진다.", 352, "".join(out))


def fft(args):
    out = [panel(20, 40, 320, 270, "격자 영상(실공간)"), clip("ff1", 20, 40, 320, 270)]
    pts = lattice_points(20, 40, 320, 270, (22, 0), (11, -19.05), (180, 175))
    g = "".join('<circle cx="{0:.1f}" cy="{1:.1f}" r="7" style="fill:var(--text);opacity:.75"/>'.format(x, y) for x, y in pts)
    out.append('<g clip-path="url(#ff1)"><rect x="20" y="40" width="320" height="270" style="fill:var(--surface-2)"/>{0}</g>'.format(g))
    out.append(arrow(350, 175, 372, 175, "text", 2) + label(361, 166, "FFT", "label-strong"))
    out.append(panel(380, 40, 320, 270, "FFT(역공간)") + clip("ff2", 380, 40, 320, 270))
    out.append('<g clip-path="url(#ff2)"><rect x="380" y="40" width="320" height="270" style="fill:var(--text);opacity:.9"/>' + _hex_spots(540, 175, 56, math.pi / 6, 1) + "</g>")
    out.append('<text class="tiny-label" x="540" y="298" text-anchor="middle" style="fill:#fff">점까지 거리 = 1/d, 방향 = 면의 법선</text>')
    return _wrap("HRTEM image and FFT", "주기적인 격자 영상을 푸리에 변환하면 격자 주기와 방향을 나타내는 점 무늬가 생긴다.", 322, "".join(out))


def moire(args):
    ang = float(args[0]) if args and args[0] else 5.0
    out = [panel(140, 40, 440, 300, "두 육방 격자를 {0:g}° 비틀어 겹치기".format(ang)), clip("mo", 140, 40, 440, 300)]
    cx, cy, a = 360, 190, 10
    g = []
    for rot, col in ((0, "var(--accent)"), (math.radians(ang), "var(--rose)")):
        a1 = (a * math.cos(rot), a * math.sin(rot))
        a2 = (a * math.cos(rot + math.pi / 3), a * math.sin(rot + math.pi / 3))
        for x, y in lattice_points(140, 40, 440, 300, a1, a2, (cx, cy), pad=10):
            g.append('<circle cx="{0:.1f}" cy="{1:.1f}" r="2.6" style="fill:{2};opacity:.8"/>'.format(x, y, col))
    out.append('<g clip-path="url(#mo)">{0}</g>'.format("".join(g)))
    out.append(_text(360, 362, "모아레 주기 λ ≈ a / (2 sin(θ/2)) — 회전각이 작을수록 무늬가 커진다", "label"))
    return _wrap("모아레 무늬", "주기가 비슷한 두 격자를 조금 비틀어 겹치면 원래 격자보다 훨씬 큰 주기의 무늬가 나타난다.", 376, "".join(out))


def afm(args):
    out = [panel(60, 30, 600, 300)]
    # 시료 표면(단층 계단)
    out.append(poly([(80, 300), (80, 270), (330, 270), (330, 252), (640, 252), (640, 300)], "slab"))
    out.append(label(200, 292, "기판", "tiny-label") + label(480, 280, "2D 플레이크(단층)", "tiny-label"))
    out.append(arrow(650, 270, 650, 252, "rose", 1.4, head=4) + arrow(650, 252, 650, 270, "rose", 1.4, head=4) + label(646, 246, "층 두께", "rose-label", "end"))
    # 캔틸레버와 탐침
    out.append(poly([(260, 160), (420, 166), (420, 174), (260, 168)], "slab"))
    out.append(poly([(402, 172), (416, 172), (409, 246)], "slab"))
    out.append(label(250, 158, "캔틸레버", "label", "end") + label(424, 236, "탐침", "label", "start"))
    # 레이저
    out.append(arrow(300, 60, 404, 164, "rose", 2) + arrow(410, 164, 540, 70, "rose", 2))
    out.append(label(296, 56, "레이저", "rose-label", "end"))
    out.append('<rect class="slab" x="540" y="46" width="44" height="44" rx="4"/>' + line(562, 46, 562, 90, "thin") + line(540, 68, 584, 68, "thin"))
    out.append(label(592, 72, "4분할 광검출기", "label", "start"))
    out.append(_text(360, 352, "탐침이 표면 높낮이를 따라 휘면 반사된 레이저 위치가 바뀌고, 이를 되먹임해 높이 지도를 만든다", "tiny-label"))
    return _wrap("원자힘현미경의 원리", "날카로운 탐침이 달린 캔틸레버가 표면을 훑을 때 생기는 휨을 레이저 반사로 읽어 표면 높이를 잰다.", 364, "".join(out))


def moke(args):
    out = []
    for k, (x0, title, sgn) in enumerate([(20, "자화 위(+M)", 1), (380, "자화 아래(−M)", -1)]):
        out.append(panel(x0, 40, 320, 250, title))
        out.append('<rect class="slab" x="{0}" y="230" width="240" height="24"/>'.format(x0 + 40))
        out.append(arrow(x0 + 160, 250, x0 + 160, 210 if sgn > 0 else 250, "rose", 2.4) if sgn > 0 else arrow(x0 + 160, 212, x0 + 160, 252, "rose", 2.4))
        out.append(label(x0 + 176, 246, "M", "rose-label", "start"))
        out.append(arrow(x0 + 60, 80, x0 + 150, 226, "accent", 2) + arrow(x0 + 170, 226, x0 + 260, 80, "accent", 2))
        # 편광 표시
        out.append(line(x0 + 66, 110, x0 + 96, 110, "accent-line", "stroke-width:2.4") + label(x0 + 81, 132, "입사 편광", "tiny-label"))
        th = math.radians(18 * sgn)
        cx, cy = x0 + 254, 110
        out.append(line(cx - 15, cy, cx + 15, cy, "dash") + line(cx - 15 * math.cos(th), cy + 15 * math.sin(th), cx + 15 * math.cos(th), cy - 15 * math.sin(th), "teal-line", "stroke-width:2.4"))
        out.append(label(cx, 136, "θK {0}".format("+" if sgn > 0 else "−"), "teal-label"))
    out.append(_text(360, 310, "반사된 빛의 편광이 자화 방향에 따라 반대로 θK만큼 돌아간다 → 회전각으로 자화를 읽는다", "tiny-label"))
    return _wrap("자기 광학 Kerr 효과", "자화된 시료에서 반사된 빛은 편광이 조금 회전하고, 회전 방향이 자화 방향에 따라 바뀐다.", 322, "".join(out))


def dftem(args):
    out = [panel(20, 40, 320, 280, "뒤초점면 · 회절점 하나만 통과"), clip("df1", 20, 40, 320, 280)]
    cx, cy = 180, 185
    out.append('<g clip-path="url(#df1)"><rect x="20" y="40" width="320" height="280" style="fill:var(--text);opacity:.9"/>' + _hex_spots(cx, cy, 48, 0, 1) +
               _hex_spots(cx, cy, 48, math.radians(17), 1).replace('class="atom"', 'class="atom-3"') + "</g>")
    sx, sy = cx + 48 * math.cos(math.radians(17)), cy + 48 * math.sin(math.radians(17))
    out.append('<circle cx="{0:.1f}" cy="{1:.1f}" r="14" style="fill:none;stroke:var(--teal);stroke-width:2.4"/>'.format(sx, sy))
    out.append(label(sx + 18, sy + 26, "대물 조리개", "teal-label", "start"))
    out.append(panel(380, 40, 320, 280, "암시야 영상 · 그 방위의 결정립만 밝음"))
    out.append('<rect x="400" y="60" width="280" height="240" rx="6" style="fill:var(--text);opacity:.85"/>')
    out.append(poly([(400, 60), (560, 60), (520, 170), (400, 210)], "", "fill:var(--surface-2);opacity:.12"))
    out.append(poly([(560, 60), (680, 60), (680, 230), (600, 260), (520, 170)], "", "fill:var(--amber);opacity:.9"))
    out.append(poly([(400, 210), (520, 170), (600, 260), (680, 230), (680, 300), (400, 300)], "", "fill:var(--surface-2);opacity:.2"))
    out.append(label(620, 160, "선택한 결정립", "label-strong"))
    return _wrap("DF-TEM", "회절 무늬에서 특정 회절점 하나만 대물 조리개로 통과시켜 영상을 만들면, 그 방향으로 회절하는 결정립만 밝게 보인다.", 332, "".join(out))


KINDS = {"xrd": xrd, "라만대칭": raman_shift, "eels": eels, "라만준위": raman_levels, "포논": phonon, "광전자": photoelectron,
         "chemical shift": chem_shift, "eds": eds, "tem": tem, "stem": stem, "saed": saed, "fft": fft, "모아레": moire,
         "afm": afm, "moke": moke, "암시야": dftem}
