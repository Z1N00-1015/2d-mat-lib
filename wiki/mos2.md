---
title: MoS₂
en: molybdenum disulfide, MoS₂
aliases: 이황화몰리브데넘, MoS2, 2H-MoS₂
category: 물질
status: 초안
reviewed: 2026-10-30
summary: 몰리브데넘 원자층을 황 원자층이 위아래로 감싼 층상 [[전이금속 디칼코제나이드]]. 단층에서 직접 밴드갭을 갖는 대표적인 2D 반도체다.
related: WS₂, MoSe₂, WSe₂, 전이금속 디칼코제나이드, 화학 기상 증착, 접촉 저항
chapter: materials/intro
info:
- 구조 | S–Mo–S 샌드위치 층(Trigonal Prism coordination)
- 적층 | 2H(흔한 안정상), 3R
- 면내 격자상수 a | 3.160 Å (2H)
- 단층 PL(A 엑시톤) | 약 1.82–1.90 eV
- bulk 밴드갭 | 약 1.2 eV, 간접
- 단층 라만 | E′ 약 383–385, A₁′ 약 403–405 cm⁻¹
figures:
- 구조 | tmd | Mo | S
- 적층 | tmd | Mo | S
- 라만 | 384:0.8:E′, 404:1:A₁′ | 532 nm
- PL | 1.84:1:A | 1.82–1.90
- 밴드 | tmd | 1.2 | 1.8–1.9
papers: moon2025, kim2026strain, hong2025recon, baek2025sliding, hong2025vls, mak2010, splendiani2010, radisavljevic2011, kang2015, shen2021, li2023sb
sources:
- Mak et al., Phys. Rev. Lett. (2010) | https://doi.org/10.1103/PhysRevLett.105.136805
- 2H-TMD 격자상수 | https://doi.org/10.1103/PhysRevB.89.075409
- Gong et al., Nature Materials (2014) — DB | https://doi.org/10.1038/nmat4091
- Pak et al., Nano Letters (2017) — DB | https://doi.org/10.1021/acs.nanolett.7b02513
- Shen et al., Nature (2021) — DB | https://doi.org/10.1038/s41586-021-03472-9
- Li et al., Nature (2023) — DB | https://doi.org/10.1038/s41586-022-05431-4
- Suzuki et al., Nature Nanotechnology (2014) | https://doi.org/10.1038/nnano.2014.148
- Wu & Li, PNAS (2021) | https://doi.org/10.1073/pnas.2115703118
- Lee et al., ACS Nano (2010) | https://doi.org/10.1021/nn1003937
- Hong et al., ACS Nano (2025, 3R-MoS₂ VLS) — DB | https://doi.org/10.1021/acsnano.5c11757
- Baek et al., Adv. Funct. Mater. (2025) — DB | https://doi.org/10.1002/adfm.202519094
---
## 개요

MoS₂는 Mo 원자층 하나를 S 원자층 두 개가 감싼 S–Mo–S 층이 반데르발스 힘으로 쌓인 [[반데르발스 물질]]입니다. 단층은 직접 밴드갭을 가져 대표적인 2D 반도체로 연구됩니다.

{{그림: 구조 | 2H-MoS₂의 원자 구조. 위에서 보면 Mo(보라)와 S(노랑)가 번갈아 놓인 벌집 격자이고(점선은 단위 격자, a = 3.160 Å), 옆에서 보면 S–Mo–S 샌드위치 층이 반데르발스 갭을 두고 쌓여 있습니다. 위에서 볼 때 S 자리에는 위·아래 S 원자 두 개가 겹쳐 있습니다. 옆모습은 지그재그 방향을 따라 본 2H 이중층입니다.}}

## 2H와 3R 적층

S–Mo–S 층 하나의 구조는 같아도, 층을 쌓는 방식에 따라 서로 다른 [[polytype]]이 됩니다.

- **2H**: 이웃한 층이 180° 돌아간 채 쌓여, 위층의 Mo가 아래층의 S 바로 위에 옵니다. 아래층부터 A–A′–A로 두 층마다 같은 배열이 반복되며(A′는 A를 180° 돌린 층), 천연 MoS₂와 CVD 다층에서 가장 흔한 안정상입니다. bulk와 짝수 층은 반전 대칭을 가집니다.
- **3R**: 모든 층이 같은 방향을 향한 채 한 칸씩 밀려 쌓여, 아래층부터 A–B–C로 세 층마다 반복됩니다. 층수와 관계없이 반전 대칭이 깨져 있어 bulk에서도 valley-dependent spin polarization이 나타나고(Suzuki 2014), 층이 서로 미끄러지면 분극 방향이 바뀌는 [[sliding ferroelectricity]]가 나타납니다(Wu & Li 2021).

2H와 3R은 층 안의 Trigonal Prism 구조는 같고 쌓는 방식이 다릅니다. WS₂에서도 성장 조건으로 2H·3R 다층을 골라 키운 사례가 있습니다([[WS₂]]). 3R-MoS₂ 이중층은 CVD(VLS 성장)로 키워 변형으로 도메인 구조를 조절할 수 있고(Hong 2025), 완전 정합한 3R 이중층에서는 도메인 벽 없는 sliding ferroelectricity가 보고되었습니다(Baek 2025).

{{그림: 적층 | 2H와 3R 적층을 옆에서 본 모습. 층 이름은 아래층부터 붙였습니다. 2H는 이웃 층이 180° 돌아가 A–A′–A로 두 층마다 반복되고, 3R은 같은 방향의 층이 한 칸씩 밀려 A–B–C로 세 층마다 반복됩니다. 점선은 맨 아래층 Mo 자리입니다.}}

## 층수와 광학 물성

bulk는 약 1.2 eV의 간접 밴드갭이지만 단층에서는 직접 밴드갭이 되어 빛을 강하게 냅니다([[직접/간접 밴드갭]]). Mak 등(2010)은 suspended 단층에서 PL 피크를 1.90 eV로 보고했고, CVD 단층에서는 1.82–1.84 eV가 보고되었습니다(Gong 2014, Pak 2017). 시료 환경과 측정 조건에 따라 값이 달라질 수 있습니다. PL 피크는 [[엑시톤]] 에너지라서 전자적 밴드갭보다 결합 에너지만큼 작습니다.

{{그림: 밴드 | 층수에 따른 밴드 구조 개념도. bulk는 가전자대 꼭대기(Γ)와 전도대 바닥(Q)의 운동량이 달라 간접 밴드갭(약 1.2 eV)이고, 단층은 둘 다 K점에 있어 직접 밴드갭이 됩니다(Mak 2010). }}

{{그림: PL | 단층 MoS₂의 PL 스펙트럼. A 엑시톤 피크 위치(1.84 eV)는 DB의 CVD 단층 값이고, 색 띠는 보고 범위(1.82–1.90 eV)입니다. }}

## 라만으로 층수 확인

선행 연구의 단층 MoS₂에서는 E′(E¹₂g)가 약 383–384 cm⁻¹, A₁′(A₁g)가 약 403–405 cm⁻¹로 간격이 약 20 cm⁻¹입니다. 층이 늘면 간격이 커지므로 [[라만 분광법]]으로 층수를 빠르게 판단합니다(Lee 2010).

{{그림: 라만 | 단층 MoS₂의 라만 스펙트럼. 면내 진동 E′와 면외 진동 A₁′의 위치는 DB 대표값이고, 두 피크 간격 약 20 cm⁻¹가 단층의 표시입니다. }}

## 만드는 방법

- [[기계적 박리]]: 결함이 적은 작은 플레이크.
- [[화학 기상 증착]](MoO₃·S 분말): DB 성장 온도 약 750–850 °C, 큰 삼각형 단결정 도메인.
- [[유기금속 화학 기상 증착]]: 웨이퍼 규모 균일 막. Shen 등(2021)은 320 °C에서 성장한 MOCVD 단층을 사용했습니다.
- [[하이포택시]]: 그래핀 template 아래 방위가 정렬된 단결정 막.

## 소자와 접촉

단층 MoS₂ FET의 성능은 [[접촉 저항]]에 크게 좌우됩니다. 반금속 전극을 쓰면 쇼트키 장벽이 거의 사라집니다. DB 기준 Bi 접촉 123 Ω·μm(Shen 2021), Sb(01̄12) 접촉 42 Ω·μm(Li 2023)이 보고되었고, 짧은 채널에서 온 전류는 1 mA/μm를 넘습니다.

> 논문마다 시료와 측정 조건이 다르므로 수치를 비교할 때는 원문 조건을 함께 확인해야 합니다.
