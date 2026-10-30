---
title: WSe₂
en: tungsten diselenide, WSe₂
aliases: 이셀레늄화텅스텐, WSe2, 2H-WSe₂
category: 물질
status: 초안
reviewed: 2026-10-30
summary: 텅스텐 원자층을 셀레늄 원자층이 감싼 층상 [[전이금속 디칼코제나이드]]. 정공(p형) 수송이 쉬워 2D CMOS의 p형 채널 후보로 연구된다.
related: MoS₂, MoSe₂, WS₂, 접촉 저항, 층간 엑시톤, 화학 기상 증착
info:
- 구조 | Se–W–Se 샌드위치 층, 2H상
- 면내 격자상수 a | 3.282 Å
- 단층 PL(A 엑시톤) | 약 1.65 eV (연구실 DB 기판 위 1.60–1.62 eV)
- 단층 라만 | E¹₂g/A₁g가 겹친 약 247–251 cm⁻¹
- 주된 수송 | p형(정공), 전극에 따라 n형도 가능
figures:
- 구조 | tmd | W | Se
- 라만 | 249:1:E¹₂g/A₁g:5 | 532 nm
- PL | 1.62:1:A | 1.60–1.65
- 밴드 | tmd | - | 1.6–1.65
papers: kim2026strain, baek2025sliding, zhao2013, kwon2022, chou2022, sahoo2018, yuan2020, yang2017
sources:
- Zhao et al., ACS Nano (2013) | https://doi.org/10.1021/nn305275h
- 2H-TMD 격자상수 | https://doi.org/10.1103/PhysRevB.89.075409
- Sahoo et al., Nature (2018) — 연구실 DB | https://doi.org/10.1038/nature25155
- Yang et al., Nature Communications (2017) — 연구실 DB | https://doi.org/10.1038/s41467-017-02093-z
- Kwon et al., Nature Electronics (2022) — 연구실 DB | https://doi.org/10.1038/s41928-022-00746-6
- Chou et al., IEDM (2022) — 연구실 DB | https://doi.org/10.1109/iedm45625.2022.10019491
- Zhang et al., Advanced Materials (2021) — 연구실 DB | https://doi.org/10.1002/adma.202104935
- Yuan et al., Nature Materials (2020) — 연구실 DB | https://doi.org/10.1038/s41563-020-0670-3
- Hsu et al., Nature Communications (2018) — 연구실 DB | https://doi.org/10.1038/s41467-018-03869-7
---
## 개요

WSe₂는 W 원자층을 Se 원자층 두 개가 감싼 Se–W–Se 층으로 이루어진 [[반데르발스 물질]]입니다. 단층에서 직접 밴드갭이 되고, 원자량이 큰 W 때문에 스핀–궤도 결합이 강합니다.

{{그림: 구조 | WSe₂의 원자 구조. 위에서 보면 W(보라)와 Se(노랑)가 번갈아 놓인 벌집 격자(a = 3.282 Å), 옆에서 보면 Se–W–Se 샌드위치 층이 반데르발스 간격을 두고 쌓여 있습니다.}}

## 광학 물성

Zhao 등(2013)은 단층 WSe₂의 PL을 약 750 nm(약 1.65 eV)에서 관측했습니다. 연구실 DB의 CVD 단층은 1.60–1.62 eV입니다(Sahoo 2018, Yang 2017). MoSe₂와 쌓으면 두 층 사이에 [[층간 엑시톤]]이 생기고(Hsu 2018), WS₂와의 이종이중층에서는 비틀림각에 따라 층간 엑시톤 확산이 달라집니다(Yuan 2020).

{{그림: 밴드 | 층수에 따른 밴드 구조 개념도. 여러 층에서는 간접 밴드갭이지만 단층에서는 전도대 바닥과 가전자대 꼭대기가 모두 K점에 모여 직접 밴드갭이 됩니다(Zhao 2013). 곡선 모양은 개념을 보이기 위한 것입니다.}}

{{그림: PL | 단층 WSe₂의 PL 스펙트럼. 피크 위치(1.62 eV)는 연구실 DB의 CVD 단층 값이고, 색 띠는 연구실 DB와 Zhao 2013의 보고 범위(1.60–1.65 eV)입니다. 세기와 선폭은 모양을 보이기 위해 정했습니다.}}

## 라만

단층 WSe₂는 면내 진동 E¹₂g와 면외 진동 A₁g가 거의 같은 에너지에 겹쳐, 약 247–251 cm⁻¹에 하나의 강한 피크로 보입니다(연구실 DB).

{{그림: 라만 | 단층 WSe₂의 라만 스펙트럼. 피크 위치는 연구실 DB 대표값입니다. 세기와 선폭은 모양을 보이기 위해 정했습니다.}}

## 성장

연구실 DB의 CVD 성장 온도는 약 1000–1170 °C로, MoS₂(약 750–850 °C)보다 훨씬 높습니다. MOCVD로 만든 WS₂/WSe₂ 초격자는 600 °C에서 성장했습니다.

## 소자와 접촉

WSe₂는 정공 수송이 쉬워 p형 FET 연구에 많이 쓰입니다. 전극 금속을 증착할 때 생기는 손상과 페르미 준위 고정이 [[접촉 저항]]을 키우므로, 금속을 따로 만들어 붙이는 반데르발스 접촉이 연구됩니다. 연구실 DB 기준:

- 반데르발스 Au 접촉: 접촉 저항 1.25–2.5 kΩ·μm, 이동도 약 155 cm²/V·s, on/off 10⁶ (Kwon 2022)
- 분자 처리 반데르발스 접촉: 쇼트키 장벽 약 47 meV (Zhang 2021)
- Sb–Pt 접촉 단층 WSe₂: 접촉 저항 0.75 kΩ·μm, 채널 100 nm에서 p형·n형 온 전류 약 150 μA/μm (Chou 2022)

> 이 문서의 ‘연구실 DB’ 수치는 연구실 논문 데이터베이스에서 검토를 마친 값(대부분 AI 상호검증 승인)이며, 측정 조건이 논문마다 달라 대표 범위로 읽어야 합니다.
