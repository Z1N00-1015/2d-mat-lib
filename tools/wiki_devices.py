"""위키 소자·물성 문서용 SVG 그림(트랜지스터, 밴드 도식, 특성 곡선, 칩 구조). wiki_figures.py가 불러 쓴다. 표준 라이브러리만 쓴다.

곡선과 구조는 원리를 보이기 위한 도식이다. 그림에 적는 숫자는 문서 출처의 값이나 정의상 값(예: 60 mV/dec)만 쓴다.
"""

import math

from wiki_figures import W, _text, _wrap
from wiki_concepts import arrow, clip, dot, label, line, panel, path, poly


def rect(x, y, w, h, fill, stroke=None, rx=3, extra=""):
    st = "fill:{0};".format(fill) + ("stroke:{0};stroke-width:1.4;".format(stroke) if stroke else "")
    return '<rect x="{0:.1f}" y="{1:.1f}" width="{2:.1f}" height="{3:.1f}" rx="{4}" style="{5}{6}"/>'.format(x, y, w, h, rx, st, extra)


def axes(x0, y0, w, h, xl, yl):
    return (arrow(x0, y0 + h, x0, y0 - 6, "text", 1.4, head=6) + arrow(x0, y0 + h, x0 + w + 6, y0 + h, "text", 1.4, head=6) +
            label(x0 + w, y0 + h + 20, xl, "label", "end") + label(x0 + 8, y0 + 4, yl, "label", "start"))


# ── 트랜지스터 구조 ─────────────────────────────────────────────────
def fet(args):
    out = [panel(60, 30, 600, 280)]
    y_sub, y_ox, y_ch = 230, 206, 196
    out.append(rect(90, y_sub, 540, 56, "var(--fig-si)", None, 4) + label(360, y_sub + 34, "기판", "label"))
    out.append(rect(90, y_ox, 540, 24, "var(--fig-oxide)", None, 2) + label(640, y_ox + 17, "dielectric", "tiny-label", "start"))
    out.append(rect(170, y_ch, 380, 10, "var(--accent)", None, 2) + label(360, y_ch + 26, "2D 반도체 채널 (원자 몇 층)", "accent-label"))
    out.append(rect(120, 150, 110, 56, "var(--fig-metal)", None, 4) + label(175, 182, "소스", "label-strong"))
    out.append(rect(490, 150, 110, 56, "var(--fig-metal)", None, 4) + label(545, 182, "드레인", "label-strong"))
    out.append(rect(250, 160, 220, 30, "var(--fig-oxide)", None, 2) + rect(250, 100, 220, 60, "var(--fig-metal)", None, 4) + label(360, 136, "게이트", "label-strong"))
    out.append(_text(360, 180, "gate dielectric", "tiny-label"))
    out.append(arrow(250, 90, 470, 90, "text", 1.4, head=6) + arrow(470, 90, 250, 90, "text", 1.4, head=6) + label(360, 82, "게이트 길이 L_g", "label"))
    out.append(_text(360, 332, "게이트 전압이 채널의 전자 농도를 바꿔 소스→드레인 전류를 켜고 끈다 (폭 W는 지면에 수직 방향)", "tiny-label"))
    return _wrap("2D 전계효과 트랜지스터 단면", "원자층 채널 위에 gate dielectric과 게이트가 있고, 양쪽 금속 전극(소스·드레인)이 채널에 접촉한다.", 344, "".join(out))


def _transfer(x0, y0, w, h, vth, ss_px, color, dash=False, ion=0.0, ioff=0.0):
    """log I_D–V_G: 꺼짐 바닥 → 기울기 일정한 문턱전압 이하 → 켜짐 포화. 좌표만 계산."""
    pts = []
    for i in range(201):
        x = x0 + w * i / 200
        y_sub = y0 + h - 20 - (x - (vth - 60)) * ss_px
        y = max(y0 + 20 + ion, min(y0 + h - 20 - ioff, y_sub))
        pts.append((x, y))
    # 모서리를 부드럽게
    sm = [pts[0]] + [((pts[i - 1][0] + pts[i][0] + pts[i + 1][0]) / 3, (pts[i - 1][1] + pts[i][1] + pts[i + 1][1]) / 3) for i in range(1, 200)] + [pts[-1]]
    return path(sm, color + "-line", "stroke-width:2.6" + (";stroke-dasharray:6 5" if dash else ""))


def transfer(args):
    kind = (args[0] if args else "ss").lower()
    out = [panel(120, 30, 480, 290)]
    x0, y0, w, h = 170, 50, 400, 240
    out.append(axes(x0, y0, w, h, "게이트 전압 V_G", "log I_D"))
    if kind == "dibl":
        out.append(_transfer(x0, y0, w, h, 300, 1.2, "accent"))
        out.append(_transfer(x0, y0, w, h, 250, 1.2, "rose", ion=-14))
        out.append(arrow(330, 150, 282, 150, "text", 1.8, head=6) + label(306, 142, "ΔV_th", "label-strong"))
        out.append(label(420, 238, "낮은 V_D", "accent-label", "start") + label(250, 92, "높은 V_D", "rose-label", "end"))
        out.append(_text(360, 340, "DIBL = −ΔV_th / ΔV_D (mV/V) — 드레인 전압이 장벽을 낮춰 곡선이 왼쪽으로 이동", "tiny-label"))
        title, desc = "DIBL", "드레인 전압을 높이면 문턱전압이 낮아져 전달 곡선이 왼쪽으로 이동한다."
    elif kind == "hyst":
        out.append(_transfer(x0, y0, w, h, 260, 1.1, "accent"))
        out.append(_transfer(x0, y0, w, h, 360, 1.1, "rose"))
        out.append(arrow(296, 160, 384, 160, "text", 1.6, head=6) + arrow(384, 160, 296, 160, "text", 1.6, head=6) + label(340, 152, "memory window", "label-strong"))
        out.append(label(232, 84, "상태 ‘1’ (낮은 V_th)", "accent-label", "end") + label(452, 250, "상태 ‘0’ (높은 V_th)", "rose-label", "start"))
        out.append(_text(360, 340, "같은 읽기 전압(두 곡선 사이)에서 전류 차이로 저장 상태를 읽는다", "tiny-label"))
        title, desc = "두 문턱전압 상태와 memory window", "강유전 분극이나 전하 저장으로 문턱전압이 두 값을 가지면, 그 차이가 memory window이다."
    else:
        out.append(_transfer(x0, y0, w, h, 280, 1.3, "accent"))
        out.append(_transfer(x0, y0, w, h, 280, 0.72, "amber", dash=True))
        # 기울기 삼각형
        xa, ya = 280, 50 + 240 - 20 - (280 - 220) * 1.3
        out.append(path([(xa, ya), (xa + 46, ya), (xa + 46, ya - 46 * 1.3)], "line", "stroke-width:1.4;fill:none"))
        out.append(label(xa + 23, ya + 16, "SS (mV)", "tiny-label") + label(xa + 52, ya - 26, "×10", "tiny-label", "start"))
        out.append(label(200, 262, "꺼짐(누설)", "tiny-label", "start") + label(560, 72, "켜짐", "tiny-label", "end"))
        out.append(label(346, 104, "가파름: SS 작음", "accent-label", "end") + label(470, 196, "완만: SS 큼", "amber-label", "start"))
        out.append(_text(360, 340, "SS = dV_G / d(log₁₀ I_D) — 상온 MOSFET의 이론 하한은 약 60 mV/dec", "tiny-label"))
        title, desc = "전달 곡선과 subthreshold swing", "로그 눈금 전류에서 문턱전압 아래 구간의 기울기가 SS이며, 가파를수록 작은 전압으로 끄고 켤 수 있다."
    return _wrap(title, desc, 352, "".join(out))


def output(args):
    out = [panel(120, 30, 480, 290)]
    x0, y0, w, h = 170, 50, 400, 240
    out.append(axes(x0, y0, w, h, "드레인 전압 V_D", "I_D / W (μA/μm)"))
    for k, vg in enumerate([0.4, 0.6, 0.8, 1.0]):
        isat = 200 * vg ** 2
        vsat = vg * 160
        pts = []
        for i in range(201):
            v = w * i / 200
            I = isat * (2 * v / vsat - (v / vsat) ** 2) if v < vsat else isat * (1 + 0.0006 * (v - vsat))
            pts.append((x0 + v, y0 + h - I))
        out.append(path(pts, ["teal", "accent", "amber", "rose"][k] + "-line", "stroke-width:2.2"))
        out.append(label(x0 + w - 4, pts[-1][1] - 6, "V_G {0}".format(["낮음", "", "", "높음"][k]) if k in (0, 3) else "", ["teal", "accent", "amber", "rose"][k] + "-label", "end"))
    out.append(line(x0 + 64, y0 + 10, x0 + 64, y0 + h, "dash") + label(x0 + 58, y0 + 24, "선형", "tiny-label", "end") + label(x0 + 260, y0 + 24, "포화", "tiny-label"))
    out.append(_text(360, 340, "전류를 채널 폭 W로 나눠 μA/μm로 쓰면 크기가 다른 소자를 비교할 수 있다", "tiny-label"))
    return _wrap("출력 곡선과 온 전류 밀도", "게이트 전압마다 드레인 전압에 따른 전류. 낮은 V_D에서 선형으로 늘다가 높은 V_D에서 포화한다.", 352, "".join(out))


def schottky(args):
    out = []
    for k, (x0, title, phib, note) in enumerate([(20, "증착 금속 · 페르미 준위 고정", 70, "계면 결함·금속 유도 갭 상태 → 장벽 큼"),
                                                  (380, "반금속·반데르발스 접촉", 14, "갭 상태 억제 → 장벽 작음")]):
        out.append(panel(x0, 40, 320, 250, title))
        mx = x0 + 120
        out.append(rect(x0 + 20, 70, mx - x0 - 20, 190, "var(--fig-metal)", None, 2, "opacity:.6") + label(x0 + 66, 248, "금속", "label-strong"))
        ef = 150
        out.append(line(x0 + 20, ef, x0 + 300, ef, "dash") + label(x0 + 300, ef - 6, "E_F", "math", "end"))
        # 전도대: 계면에서 E_F 위 Φ_B, 반도체 안쪽으로 갈수록 E_F 위 30 px로 내려온다(띠 굽힘)
        cbl = [(mx + i * 3, ef - (phib - (phib - 30) * (1 - math.exp(-i / 12)))) for i in range(61)]
        vbl = [(x, y + 110) for x, y in cbl]
        out.append(path(cbl, "teal-line", "stroke-width:2.4") + path(vbl, "rose-line", "stroke-width:2.4"))
        out.append(label(x0 + 300, cbl[-1][1] - 6, "전도대", "teal-label", "end") + label(x0 + 300, vbl[-1][1] + 18, "가전자대", "rose-label", "end"))
        if phib > 20:
            out.append(arrow(mx + 8, ef - 2, mx + 8, ef - phib + 2, "accent", 1.6, head=5) + arrow(mx + 8, ef - phib + 2, mx + 8, ef - 2, "accent", 1.6, head=5))
        out.append(label(mx + 14, ef - phib / 2 + 4 - (14 if phib < 20 else 0), "Φ_B", "accent-label", "start"))
        out.append(_text(x0 + 160, 280, note, "tiny-label"))
    return _wrap("금속–반도체 접촉의 쇼트키 장벽", "전자가 금속에서 반도체 전도대로 넘어가려면 쇼트키 장벽 Φ_B를 넘어야 하며, 장벽이 클수록 접촉 저항이 커진다.", 302, "".join(out))


def tlm(args):
    out = [panel(120, 30, 480, 290, "전달 길이법(TLM)")]
    x0, y0, w, h = 180, 60, 380, 220
    out.append(axes(x0, y0, w, h, "채널 길이 L", "총 저항 R_T·W"))
    pts = [(80, 0.42), (150, 0.58), (220, 0.71), (290, 0.88), (360, 1.02)]
    yb = y0 + h
    b, m = 0.24, 0.0022
    out.append(line(x0, yb - b * 200, x0 + w, yb - (b + m * w) * 200, "accent-line", "stroke-width:2"))
    for L, r in pts:
        out.append(dot(x0 + L, yb - (b + m * L) * 200 + (6 if L in (150, 290) else -5), 5, "atom-4"))
    out.append(dot(x0, yb - b * 200, 5, "atom"))
    out.append(label(x0 + 10, yb - b * 200 + 22, "y절편 = 2R_c·W", "accent-label", "start"))
    out.append(label(x0 + 250, yb - (b + m * 250) * 200 - 14, "기울기 = 채널 면저항 R_sh", "label", "end"))
    out.append(_text(360, 340, "길이가 다른 소자들의 저항을 직선으로 맞춰 L = 0으로 늘이면 두 접촉의 저항만 남는다", "tiny-label"))
    return _wrap("TLM으로 접촉 저항 구하기", "채널 길이에 따른 총 저항을 직선으로 맞추면 기울기는 채널 저항, y절편은 두 접촉 저항의 합이다.", 352, "".join(out))


def tunneling(args):
    out = [panel(80, 40, 560, 250, "장벽을 투과하는 파동함수")]
    yb = 230
    out.append(rect(300, 90, 120, yb - 90, "var(--accent-soft)", "var(--accent)", 2) + label(360, 82, "퍼텐셜 장벽 (높이 > 입자 에너지)", "accent-label"))
    out.append(line(110, 170, 610, 170, "dash") + label(116, 164, "입자 에너지 E", "tiny-label", "start"))
    pts = []
    for i in range(500):
        x = 110 + i
        if x < 300:
            y = 170 - 46 * math.cos((x - 300) / 18)
        elif x < 420:
            a = 46 * math.exp(-(x - 300) / 40)
            y = 170 - a
        else:
            y = 170 - 46 * math.exp(-120 / 40) * math.cos((x - 420) / 18)
        pts.append((x, y))
    out.append(path(pts, "teal-line", "stroke-width:2.4"))
    out.append(label(200, 112, "들어오는 파동", "teal-label") + label(360, 252, "안에서 지수적으로 감소", "tiny-label") + label(520, 140, "투과한 파동(작아짐)", "teal-label"))
    out.append(arrow(300, 270, 420, 270, "text", 1.4, head=5) + arrow(420, 270, 300, 270, "text", 1.4, head=5) + label(360, 284, "두께 d", "math"))
    out.append(_text(360, 312, "투과 확률 T ∝ exp(−2κd), κ = √(2m*(V−E))/ħ — 장벽이 얇고 낮을수록, 질량이 가벼울수록 커진다", "tiny-label"))
    return _wrap("양자 터널링", "입자의 에너지가 장벽보다 낮아도 파동함수가 장벽 안에서 지수적으로 줄어들며 반대편으로 일부 새어 나간다.", 324, "".join(out))


def barrier(args):
    """소스–채널–드레인 전도대: 긴 채널 vs 짧은 채널, 낮은/높은 V_D."""
    out = []
    for k, (x0, title, short) in enumerate([(20, "긴 채널", False), (380, "짧은 채널", True)]):
        out.append(panel(x0, 40, 320, 250, title))
        xs, xd = x0 + 70, x0 + 250
        lam = 18 if not short else 50
        for vd, col in ((10, "accent"), (70, "rose")):
            pts = []
            for i in range(281):
                x = x0 + 20 + i
                if x < xs:
                    y = 200
                elif x > xd:
                    y = 200 + vd
                else:
                    # 게이트가 잡는 장벽(110)에 소스·드레인 전위가 scale length lam만큼 스며든다
                    y = 110 + (200 - 110) * math.exp(-(x - xs) / lam) + (200 + vd - 110) * math.exp(-(xd - x) / lam)
                pts.append((x, y))
            out.append(path(pts, col + "-line", "stroke-width:2.2"))
        out.append(label(xs - 20, 190, "소스", "tiny-label") + label(xd + 40, 186, "드레인", "tiny-label"))
        out.append(label((xs + xd) / 2, 100, "게이트 아래 장벽", "tiny-label"))
    out.append(_text(360, 312, "파랑: 낮은 V_D · 빨강: 높은 V_D — 짧은 채널에서는 드레인 전위가 채널 깊이 들어와 장벽이 낮아진다", "tiny-label"))
    return _wrap("짧은 채널에서 낮아지는 장벽", "채널이 scale length에 비해 짧으면 드레인 전위가 게이트 아래까지 침투해 소스 쪽 장벽을 낮춘다.", 324, "".join(out))


def eot(args):
    out = [panel(60, 40, 600, 256)]
    for k, (x0, name, t, col, note) in enumerate([(120, "SiO₂ (κ = 3.9)", 40, "var(--fig-oxide)", "두께 1 nm"), (420, "HfO₂ (κ ≈ 25)", 160, "var(--fig-nitride)", "같은 정전용량이면 약 6.4 nm")]):
        out.append(rect(x0, 70, 180, 40, "var(--fig-metal)", None, 3) + label(x0 + 90, 95, "게이트", "label-strong"))
        out.append(rect(x0, 110, 180, t * 0.45 + 6, col, None, 1))
        out.append(rect(x0, 116 + t * 0.45, 180, 36, "var(--fig-si)", None, 3) + label(x0 + 90, 139 + t * 0.45, "채널", "label-strong"))
        out.append(label(x0 + 90, 262, name, "label") + label(x0 + 90, 280, note, "tiny-label"))
    out.append(_text(360, 316, "EOT = t_물리 × 3.9/κ — 두꺼운 고유전율 막으로 같은 게이트 제어력을 얻고 터널링 누설은 줄인다", "tiny-label"))
    return _wrap("EOT", "유전율이 큰 dielectric은 물리적으로 두꺼워도 얇은 SiO₂와 같은 정전용량을 줄 수 있다.", 328, "".join(out))


def pe_loop(args):
    out = [panel(140, 30, 440, 300)]
    cx, cy, sx, sy = 360, 180, 150, 110
    up, dn = [], []
    for i in range(201):
        e = -1 + 2 * i / 200
        up.append((cx + e * sx, cy - sy * math.tanh((e + 0.35) * 4.5) * 0.92))
        dn.append((cx + e * sx, cy - sy * math.tanh((e - 0.35) * 4.5) * 0.92))
    out.append(line(cx - sx - 20, cy, cx + sx + 20, cy, "axis") + line(cx, cy + sy + 20, cx, cy - sy - 20, "axis"))
    out.append(label(cx + sx + 20, cy + 18, "전기장 E", "label", "end") + label(cx + 8, cy - sy - 8, "분극 P", "label", "start"))
    out.append(path(up, "accent-line", "stroke-width:2.6") + path(dn, "accent-line", "stroke-width:2.6"))
    pr = sy * math.tanh(0.35 * 4.5) * 0.92
    out.append(dot(cx, cy - pr, 5, "atom-4") + dot(cx, cy + pr, 5, "atom-4") + label(cx + 10, cy - pr - 8, "+P_r", "rose-label", "start") + label(cx - 10, cy + pr + 18, "−P_r", "rose-label", "end"))
    out.append(dot(cx - 0.35 * sx, cy, 5, "atom-alt") + dot(cx + 0.35 * sx, cy, 5, "atom-alt") + label(cx - 0.35 * sx, cy + 20, "−E_c", "teal-label") + label(cx + 0.35 * sx, cy - 10, "+E_c", "teal-label"))
    out.append(arrow(cx + 60, cy - sy * 0.9, cx + 100, cy - sy * 0.9, "accent", 1.6, head=6) + arrow(cx - 60, cy + sy * 0.9, cx - 100, cy + sy * 0.9, "accent", 1.6, head=6))
    out.append(_text(360, 350, "P_r: 전기장을 꺼도 남는 잔류 분극 · E_c: 분극을 뒤집는 데 필요한 항전기장", "tiny-label"))
    return _wrap("강유전체의 P–E 이력 곡선", "전기장을 쓸면 분극이 이력 곡선을 그리고, 전기장이 0일 때도 +P_r 또는 −P_r의 두 상태가 남는다.", 362, "".join(out))


def double_well(args):
    out = [panel(60, 30, 600, 280)]
    cx, cy = 260, 200
    pts = [(cx + p * 130, cy - 30 * (-(p ** 2) * 2 + p ** 4) * 1.6) for p in [-1.45 + 2.9 * i / 200 for i in range(201)]]
    out.append(path(pts, "accent-line", "stroke-width:2.6"))
    out.append(line(cx - 200, cy + 60, cx + 200, cy + 60, "axis") + label(cx + 200, cy + 78, "분극 P", "label", "end"))
    out.append(label(cx - 130, cy + 50 + 40, "−P", "label") + label(cx + 130, cy + 90, "+P", "label"))
    out.append(label(cx - 200, 56, "자유 에너지 U", "label", "start"))
    out.append(label(cx, cy - 18, "곡률 음수 → 음의 정전용량 영역", "rose-label"))
    out.append(dot(cx - 130 / 1.0 * 1.0, cy + 48, 6, "atom-4") + dot(cx + 130, cy + 48, 6, "atom-4"))
    # 직렬 커패시터
    bx = 500
    out.append(line(bx, 70, bx, 100, "line") + line(bx - 30, 100, bx + 30, 100, "line", "stroke-width:3") + line(bx - 30, 112, bx + 30, 112, "line", "stroke-width:3"))
    out.append(label(bx + 40, 110, "C_FE < 0 (강유전체)", "rose-label", "start"))
    out.append(line(bx, 112, bx, 160, "line") + line(bx - 30, 160, bx + 30, 160, "line", "stroke-width:3") + line(bx - 30, 172, bx + 30, 172, "line", "stroke-width:3"))
    out.append(label(bx + 40, 170, "C_MOS (트랜지스터)", "label", "start") + line(bx, 172, bx, 210, "line"))
    out.append(label(bx, 64, "V_G", "math") + label(bx, 228, "채널", "tiny-label"))
    out.append(_text(560, 296, "직렬 연결 → 내부 전압 증폭 가능성", "tiny-label"))
    return _wrap("강유전체의 이중 우물과 음의 정전용량", "자유 에너지가 두 우물 모양이고 가운데 곡률이 음수인 영역에서 강유전체가 음의 정전용량처럼 동작할 수 있다.", 322, "".join(out))


def chip(args):
    back = bool(args) and args[0].startswith("후")
    out = [panel(100, 30, 520, 330)]
    x0, w = 130, 460
    ybase = 250 if not back else 210
    out.append(rect(x0, ybase, w, 30, "var(--fig-si)", None, 2) + label(x0 + w + 6, ybase + 20, "FEOL(트랜지스터)", "tiny-label", "start"))
    for i in range(6):
        out.append(rect(x0 + 30 + i * 72, ybase - 6, 40, 10, "var(--accent)", None, 1))
    levels = [(ybase - 30, 6, 10), (ybase - 60, 6, 12), (ybase - 96, 4, 18), (ybase - 140, 3, 24)]
    out.append(rect(x0, levels[-1][0] - 20, w, ybase - levels[-1][0] + 20, "var(--fig-oxide)", None, 2, "opacity:.45"))
    for y, n, hgt in levels:
        span = w / n
        for i in range(n):
            out.append(rect(x0 + i * span + span * 0.18, y - hgt / 2, span * 0.64, hgt, "var(--fig-metal)", None, 1))
            out.append(rect(x0 + i * span + span * 0.46, y + hgt / 2, span * 0.08, 30 - hgt / 2, "var(--fig-metal)", None, 0, "opacity:.8"))
    out.append(label(x0 + w + 6, ybase - 80, "BEOL(배선)", "tiny-label", "start") + label(x0 + w + 6, ybase - 64, "금속선+low-k dielectric", "tiny-label", "start"))
    if back:
        out.append(rect(x0, ybase + 30, w, 18, "var(--fig-si)", None, 0, "opacity:.6") + label(x0 + w + 6, ybase + 44, "얇게 깎은 기판", "tiny-label", "start"))
        for i in range(4):
            out.append(rect(x0 + 50 + i * 110, ybase + 48, 70, 26, "var(--rose)", None, 2, "opacity:.85"))
            out.append(rect(x0 + 80 + i * 110, ybase + 26, 10, 24, "var(--rose)", None, 0))
        out.append(label(x0 + w + 6, ybase + 66, "후면 전력망", "rose-label", "start"))
        out.append(_text(360, 352, "전력선을 웨이퍼 뒷면으로 옮겨 앞면 배선은 신호에만 쓰고 전력 경로를 짧게 한다", "tiny-label"))
        title, desc = "BSPDN", "전력 배선을 기판 뒤쪽에 두고 짧은 관통 연결로 트랜지스터에 전력을 공급해, 앞면 배선을 신호 전용으로 쓴다."
    else:
        out.append(_text(360, 320, "아래층 트랜지스터를 만든 뒤 그 위에 여러 층의 금속 배선을 쌓는다(위로 갈수록 굵음)", "tiny-label"))
        out.append(label(x0 + w / 2, ybase + 52, "기판", "label"))
        title, desc = "칩 단면: FEOL과 BEOL", "기판 위 트랜지스터층(FEOL) 위에 금속 배선과 interlayer dielectric이 여러 층 쌓인 배선층(BEOL)이 있다."
    return _wrap(title, desc, 364, "".join(out))


def m3d(args):
    out = [panel(80, 30, 560, 330)]
    x0, w = 120, 400
    tiers = [(270, "1층: 실리콘 CMOS", "var(--fig-si)"), (200, "배선층", "var(--fig-oxide)"), (150, "2층: 2D 트랜지스터", "var(--accent)"), (90, "배선층", "var(--fig-oxide)")]
    for y, name, col in tiers:
        h = 40 if "배선" not in name else 50
        out.append(rect(x0, y, w, h if "2D" not in name else 30, col, None, 3, "opacity:{0}".format(0.85 if "배선" not in name else 0.5)))
        out.append(label(x0 + w + 10, y + 22, name, "label", "start"))
    for i in range(5):
        out.append(rect(x0 + 40 + i * 80, 120, 8, 150, "var(--fig-metal)", None, 0))
    out.append(label(x0 + 44, 112, "층간 연결(짧은 비아)", "tiny-label", "start"))
    out.append(arrow(104, 150, 104, 300, "rose", 2) + label(100, 330, "위층 공정 열이 아래층에 전달", "rose-label", "start"))
    out.append(_text(360, 350, "위층은 아래 소자·배선이 견디는 온도(대략 400–450 °C 이하)에서 만들어야 한다", "tiny-label"))
    return _wrap("monolithic 3D integration", "실리콘 회로와 배선층 위에 새 소자층을 직접 만들어 쌓고, 짧은 비아로 층 사이를 잇는다.", 372, "".join(out))


def parasitic(args):
    out = [panel(140, 40, 440, 250)]
    out.append(rect(170, 180, 380, 60, "var(--fig-oxide)", None, 2, "opacity:.5") + label(360, 266, "interlayer dielectric (유전율 κ)", "label"))
    for x in (230, 400):
        out.append(rect(x, 120, 90, 120, "var(--fig-metal)", None, 3))
    out.append(label(275, 112, "배선 1", "label-strong") + label(445, 112, "배선 2", "label-strong"))
    for k in range(5):
        y = 140 + k * 20
        out.append(arrow(322, y, 398, y, "accent", 1.4, head=5))
    out.append(label(360, 76, "C ∝ κ · (마주보는 면적) / 간격", "accent-label"))
    out.append(_text(360, 284, "배선 간격이 줄수록 C가 커져 RC 지연과 충방전 전력이 늘어난다 → 낮은 κ dielectric 사용", "tiny-label"))
    return _wrap("배선 사이 기생 정전용량", "이웃한 금속선과 그 사이 dielectric이 원치 않는 커패시터가 되어 신호 지연과 전력 소모를 늘린다.", 302, "".join(out))


def mtj(args):
    out = []
    for k, (x0, title, up2, r) in enumerate([(20, "평행 (P) · 저항 낮음", True, "R_P"), (380, "반평행 (AP) · 저항 높음", False, "R_AP")]):
        out.append(panel(x0, 40, 320, 250, title))
        cx = x0 + 160
        out.append(rect(cx - 90, 90, 180, 46, "var(--fig-ndope)", None, 3, "opacity:.6") + arrow(cx, 128, cx, 98, "rose", 2.6) + label(cx + 96, 118, "자유층", "tiny-label", "start"))
        out.append(rect(cx - 90, 136, 180, 18, "var(--fig-oxide)", None, 0) + label(cx + 96, 150, "터널 장벽", "tiny-label", "start"))
        out.append(rect(cx - 90, 154, 180, 46, "var(--fig-ndope)", None, 3, "opacity:.6") + label(cx + 96, 182, "고정층", "tiny-label", "start"))
        out.append(arrow(cx, 192, cx, 162, "rose", 2.6) if up2 else arrow(cx, 162, cx, 192, "rose", 2.6))
        out.append(arrow(cx - 60, 220, cx - 60, 70, "teal", 2 if up2 else 1, dash=not up2))
        out.append(label(cx - 66, 236, "터널 전류 {0}".format("큼" if up2 else "작음"), "teal-label", "start"))
        out.append(label(cx, 270, r, "label-strong"))
    out.append(_text(360, 310, "TMR = (R_AP − R_P) / R_P — 두 상태의 저항 차이로 0과 1을 읽는다", "tiny-label"))
    return _wrap("자성 터널 접합과 터널 자기저항", "두 자성층의 자화가 평행이면 터널 저항이 낮고 반평행이면 높다.", 322, "".join(out))


def two_deg(args):
    out = [panel(120, 30, 480, 290, "이종접합 계면의 삼각 우물")]
    xi = 330
    cb = [(150 + i, 120 + (xi - 150 - i) * 0.0) for i in range(0, xi - 150)]
    left = [(150, 110), (xi, 110 + 30)]
    out.append(path([(150, 120), (xi, 140)], "teal-line", "stroke-width:2.4"))
    out.append(line(xi, 140, xi, 216, "teal-line", "stroke-width:2.4"))
    right = [(xi + i, 216 - 70 * (1 - math.exp(-i / 50))) for i in range(0, 250)]
    out.append(path(right, "teal-line", "stroke-width:2.4"))
    out.append(line(150, 196, 580, 196, "dash") + label(584, 200, "E_F", "math", "start"))
    out.append(line(xi + 4, 205, xi + 34, 205, "accent-line", "stroke-width:2.4") + line(xi + 4, 186, xi + 64, 186, "accent-line", "stroke-width:1.6"))
    out.append(label(xi + 70, 210, "E₁ (전자가 갇힌 준위)", "accent-label", "start"))
    out.append(label(240, 106, "넓은 갭 층 (예: AlGaAs)", "tiny-label") + label(480, 128, "좁은 갭 층 (예: GaAs)", "tiny-label"))
    for i in range(6):
        out.append(dot(xi + 8 + i * 5, 200, 2.6, "atom-alt"))
    out.append(_text(360, 300, "전자가 계면 수직 방향으로 묶이고 면 안으로만 움직인다 → 2차원 전자가스", "tiny-label"))
    return _wrap("2차원 전자가스", "두 반도체의 계면에 생긴 좁은 삼각형 퍼텐셜 우물에 전자가 갇혀, 면 안으로만 자유롭게 움직인다.", 332, "".join(out))


def trap_hyst(args):
    out = []
    for k, (x0, title, cw) in enumerate([(20, "전하 트랩 · 시계 방향", True), (380, "강유전 분극 · 반시계 방향", False)]):
        out.append(panel(x0, 40, 320, 250, title))
        ax, ay, w, h = x0 + 40, 70, 250, 180
        out.append(axes(ax, ay, w, h, "V_G", "log I_D"))
        fwd = _transfer(ax, ay, w, h, ax + 110, 1.4, "accent")
        bwd = _transfer(ax, ay, w, h, ax + (160 if cw else 60), 1.4, "rose")
        out.append(fwd + bwd)
        out.append(label(ax + w - 6, ay + 30, "→ 정방향", "accent-label", "end") + label(ax + w - 6, ay + 48, "← 역방향", "rose-label", "end"))
        out.append(_text(x0 + 160, 282, "역방향 곡선이 오른쪽 (V_th 증가)" if cw else "역방향 곡선이 왼쪽 (V_th 감소)", "tiny-label"))
    out.append(_text(360, 310, "n형 채널 기준. 이력의 방향으로 원인(트랩/분극)을 가늠한다", "tiny-label"))
    return _wrap("전달 곡선의 이력 방향", "n형 트랜지스터에서 전자 트랩은 시계 방향, 강유전 분극은 반시계 방향 이력을 만든다.", 322, "".join(out))


def selector(args):
    out = [panel(20, 40, 320, 260, "교차점 배열의 누설 경로")]
    xs = [80, 160, 240]
    ys = [100, 170, 240]
    for x in xs:
        out.append(line(x, 70, x, 270, "line", "stroke-width:2"))
    for y in ys:
        out.append(line(50, y, 300, y, "line", "stroke-width:2"))
    for x in xs:
        for y in ys:
            out.append(rect(x - 9, y - 9, 18, 18, "var(--fig-nitride)", None, 3))
    out.append(rect(xs[2] - 11, ys[0] - 11, 22, 22, "none", "var(--teal)", 3))
    out.append(path([(xs[2], ys[0]), (xs[1], ys[0]), (xs[1], ys[1]), (xs[2], ys[1])], "rose-line", "stroke-width:2.4;stroke-dasharray:5 4"))
    out.append(label(250, 88, "읽을 셀", "teal-label", "start") + label(190, 205, "누설(스니크) 경로", "rose-label"))
    out.append(panel(380, 40, 320, 260, "선택 소자의 비선형 I–V"))
    ax, ay, w, h = 420, 70, 250, 200
    out.append(line(ax, ay + h / 2, ax + w, ay + h / 2, "axis") + line(ax + w / 2, ay, ax + w / 2, ay + h, "axis"))
    pts = [(ax + w / 2 + v * 120, ay + h / 2 - 90 * math.sinh(v * 4) / math.sinh(4)) for v in [-1 + 2 * i / 200 for i in range(201)]]
    out.append(path(pts, "accent-line", "stroke-width:2.6"))
    out.append(label(ax + w / 2 + 70, ay + h / 2 + 18, "V/2: 거의 안 흐름", "tiny-label") + label(ax + w - 10, ay + 20, "V: 크게 흐름", "accent-label", "end"))
    out.append(label(ax + w, ay + h / 2 + 18, "V", "math", "end") + label(ax + w / 2 + 8, ay + 10, "I", "math", "start"))
    return _wrap("선택 소자", "교차점 배열에서 이웃 셀로 새는 전류를 막기 위해, 낮은 전압에서는 거의 막히고 높은 전압에서만 열리는 비선형 소자를 셀마다 붙인다.", 312, "".join(out))


def retention(args):
    out = [panel(120, 30, 480, 290)]
    x0, y0, w, h = 170, 60, 400, 220
    out.append(axes(x0, y0, w, h, "시간 (log)", "V_th"))
    for sgn, col, name in ((1, "rose", "상태 ‘0’"), (-1, "accent", "상태 ‘1’")):
        pts = [(x0 + i * 2, y0 + h / 2 - sgn * (70 - 0.09 * i)) for i in range(201)]
        out.append(path(pts, col + "-line", "stroke-width:2.4") + label(x0 + 6, pts[0][1] - 8, name, col + "-label", "start"))
    out.append(line(x0 + 360, y0, x0 + 360, y0 + h, "dash") + label(x0 + 356, y0 + 14, "목표 시간 (예: 10년)", "tiny-label", "end"))
    out.append(arrow(x0 + 360, y0 + h / 2 - 34, x0 + 360, y0 + h / 2 + 34, "text", 1.4, head=5) + label(x0 + 366, y0 + h / 2 + 4, "남은 창", "label", "start"))
    out.append(_text(360, 340, "고온에서 가속 측정한 뒤 외삽해 목표 시간에도 두 상태를 구분할 수 있는지 판단한다", "tiny-label"))
    return _wrap("잔류 시간", "시간이 지나며 두 저장 상태의 문턱전압이 가까워지고, 목표 시간까지 구분 가능한 창이 남아 있어야 한다.", 352, "".join(out))


def mobility(args):
    """이동도 추출에 쓰이는 FET, Hall, 4단자 측정 배치."""
    out = []
    out.append(panel(24, 28, 212, 278, "FET 전달 특성"))
    x0, y0, w, h = 60, 92, 144, 146
    out.append(axes(x0, y0, w, h, "V_G", "I_D"))
    pts = []
    for i in range(101):
        x = x0 + w * i / 100
        y = y0 + h - 12 - 120 / (1 + math.exp(-(i - 50) / 10))
        pts.append((x, y))
    out.append(path(pts, "accent-line", "stroke-width:2.6"))
    out.append(line(114, 193, 147, 151, "rose-line", "stroke-width:1.8;stroke-dasharray:4 3"))
    out.append(label(132, 144, "gₘ", "rose-label"))
    out.append(_text(130, 282, "μ_FE ∝ gₘ / C_g", "tiny-label"))

    out.append(panel(254, 28, 212, 278, "Hall 측정"))
    out.append(rect(292, 115, 136, 82, "var(--fig-oxide)", "var(--border)", 8))
    out.append(rect(278, 137, 16, 38, "var(--fig-metal)", None, 3) + rect(426, 137, 16, 38, "var(--fig-metal)", None, 3))
    out.append(rect(333, 99, 34, 16, "var(--fig-metal)", None, 3) + rect(333, 197, 34, 16, "var(--fig-metal)", None, 3))
    out.append(arrow(302, 156, 414, 156, "accent", 2, head=7) + label(358, 147, "I", "accent-label"))
    out.append(line(350, 104, 350, 208, "rose-line", "stroke-width:1.7;stroke-dasharray:4 3"))
    out.append(label(372, 108, "V_H", "rose-label", "start"))
    out.append(_text(360, 244, "자기장 B ⊙", "tiny-label"))
    out.append(_text(360, 282, "μ_H = |R_H| σ", "tiny-label"))

    out.append(panel(484, 28, 212, 278, "4단자 채널 측정"))
    out.append(rect(512, 126, 152, 62, "var(--fig-oxide)", "var(--border)", 8))
    for x, name in ((516, "I+"), (656, "I−"), (560, "V+"), (616, "V−")):
        out.append(rect(x - 7, 112 if name.startswith("V") else 146, 14, 18 if name.startswith("V") else 22,
                        "var(--fig-metal)", None, 3))
        out.append(label(x, 103 if name.startswith("V") else 180, name, "tiny-label"))
    out.append(arrow(528, 158, 646, 158, "accent", 2, head=7))
    out.append(line(560, 112, 560, 105, "rose-line", "stroke-width:1.5") + line(616, 112, 616, 105, "rose-line", "stroke-width:1.5"))
    out.append(_text(590, 244, "접촉 전압 강하를 줄여 채널 저항을 분리", "tiny-label"))
    out.append(_text(590, 282, "μ = σ / (q n)", "tiny-label"))
    return _wrap("이동도 측정 개요", "FET 전달 특성, Hall 효과, 4단자 수송 측정은 서로 다른 방식으로 캐리어 이동도를 추정한다.", 326, "".join(out))


KINDS = {"fet": fet, "전달곡선": transfer, "출력곡선": output, "쇼트키": schottky, "tlm": tlm, "터널링": tunneling,
         "장벽": barrier, "eot": eot, "pe": pe_loop, "이중우물": double_well, "칩": chip, "3d집적": m3d,
         "기생용량": parasitic, "mtj": mtj, "2deg": two_deg, "이력방향": trap_hyst, "선택소자": selector,
         "잔류": retention, "이동도": mobility}
