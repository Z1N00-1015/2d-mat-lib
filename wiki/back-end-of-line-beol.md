---
title: 후공정 배선층
en: back-end-of-line, BEOL
category: 소자
status: 초안
summary: 트랜지스터 등 능동 소자를 만든 뒤 칩의 신호·전력 배선과 interlayer dielectric을 형성하는 공정 영역.
papers: moon2025, akinwande2019, jayachandran2024, hong2020, das2021
reviewed: 2026-10-30
info:
- 위치 | 트랜지스터(FEOL) 위의 배선층
- 구성 | 구리 배선·비아 + 저유전율 interlayer dielectric
- 열 예산 | 대략 400–450 °C 이하
- 2D 물질 쓰임 | 배선 위 소자층, 배리어·dielectric 후보
figures:
- 칩
sources:
- Akinwande et al., Nature (2019) | https://doi.org/10.1038/s41586-019-1573-9
- Jayachandran et al., Nature (2024) | https://doi.org/10.1038/s41586-023-06860-5
- Hong et al., Nature (2020) | https://doi.org/10.1038/s41586-020-2375-9
- Das et al., Nature Electronics (2021) | https://doi.org/10.1038/s41928-021-00670-1
- Moon et al., Nature (2025) | https://doi.org/10.1038/s41586-024-08492-9
---
## 정의

**후공정 배선층**(back-end-of-line, BEOL)은 반도체 칩에서 트랜지스터를 만든 뒤(전공정, FEOL) 그 위에 쌓는 금속 배선과 interlayer dielectric 부분, 또는 그 공정 단계를 말합니다. 수많은 트랜지스터를 서로 연결하고 전력을 공급하는 ‘도로망’에 해당합니다.

{{그림: 칩 | 기판 위 트랜지스터층(FEOL) 위에 여러 층의 금속선과 비아가 쌓이고, 그 사이를 low-k dielectric이 채웁니다. 위층일수록 배선이 굵고 간격이 넓습니다.}}

## 구성 요소

- **금속 배선**: 주로 구리. 아래층은 아주 가늘고 촘촘하며 위로 갈수록 굵어집니다.
- **비아**: 층과 층을 잇는 수직 연결.
- **확산 방지막**: 구리가 dielectric으로 퍼지지 않게 막는 얇은 층.
- **interlayer dielectric**: [[기생 정전용량]]을 줄이기 위해 [[low-k dielectric]]을 씁니다.

## 열 예산

BEOL 공정은 아래의 트랜지스터와 이미 만든 배선을 망가뜨리지 않아야 하므로 대략 400–450 °C 이하에서 진행됩니다([[열 예산]], Akinwande 2019).

## 2D 물질과 BEOL

- **배선 위 소자**: 2D 반도체는 낮은 온도에서 만들거나 옮겨 붙일 수 있어, BEOL 위에 트랜지스터층을 더 쌓는 [[단일체 3차원 집적]] 후보입니다(Jayachandran 2024). 하이포택시로 400 °C에서 황화해 단결정 MoS₂를 만든 연구도 BEOL 온도 조건을 겨냥합니다(Moon 2025, DB).
- **배리어·dielectric**: 원자층 두께의 그래핀·h-BN을 구리 확산 방지막으로, 비정질 BN을 초low-k dielectric으로 쓰는 연구가 있습니다(Hong 2020).
