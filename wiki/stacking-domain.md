---
title: 적층 도메인
en: stacking domain
category: 결정학
status: 초안
summary: 모아레 구조에서 국소 원자 적층이 거의 일정한 영역. twisted bilayer graphene의 작은 비틀림각에서는 AB·BA 영역이 넓어진다.
papers: kim2026strain, hong2025recon, baek2025sliding, hong2025vls, alden2013, yoo2019, weston2020, rosenberger2020
reviewed: 2026-10-30
info:
- 정의 | 같은 적층 방식(AB, BA 등)을 가진 영역
- 경계 | 도메인 벽(변형 솔리톤)
- 생성 | 원자 재구성, 성장·전사 중 변형
- 영향 | 전자·광학 성질, 분극(미끄럼 강유전성)
figures:
- 재구성
- 도메인벽
sources:
- Alden et al., PNAS (2013) | https://doi.org/10.1073/pnas.1309394110
- Yoo et al., Nature Materials (2019) | https://doi.org/10.1038/s41563-019-0346-z
- Weston et al., Nature Nanotechnology (2020) | https://doi.org/10.1038/s41565-020-0682-9
- Rosenberger et al., ACS Nano (2020) | https://doi.org/10.1021/acsnano.0c00088
- Hong et al., ACS Nano (2025, 3R-MoS₂ VLS) — 연구실 DB | https://doi.org/10.1021/acsnano.5c11757
- Kim et al., Rep. Prog. Phys. (2026) — 연구실 DB | https://doi.org/10.1088/1361-6633/ae5ea2
---
## 정의

**적층 도메인**(stacking domain)은 두 층 이상이 겹친 구조에서 층 사이의 상대 위치(적층 방식)가 같은 영역입니다. 예를 들어 이중층 그래핀은 위층이 아래층에 대해 한쪽으로 밀린 AB 적층과 반대쪽으로 밀린 BA 적층이 있고, 둘은 에너지가 같아 한 시료 안에 섞여 나타납니다.

{{그림: 재구성 | 작은 각도로 꼬인 이중층에서는 AB·BA 적층 도메인이 삼각형으로 번갈아 놓입니다.}}

## 도메인 경계

이웃한 두 도메인 사이에서는 층 사이 변위가 좁은 구간에 걸쳐 한 결합 길이만큼 바뀝니다. 이 경계를 [[도메인 벽]] 또는 변형 솔리톤이라 합니다(Alden 2013).

{{그림: 도메인벽 | 도메인 벽을 가로지르면 층 사이 변위가 AB에서 BA 값으로 매끄럽게 바뀝니다.}}

## 어떻게 생기나

- **원자 재구성**: 작은 회전각에서 원자가 움직여 도메인이 넓어집니다(Yoo 2019, Weston 2020).
- **변형**: 전사·성장 중 생긴 미세한 늘어남이나 휨이 적층을 바꿉니다. VLS 방식 CVD로 키운 3R-MoS₂ 이중층에서는 변형으로 도메인 구조를 제어할 수 있었고(Hong 2025), 이종이중층에서는 격자 불일치에 따라 변형 완화와 도메인 형성이 달라집니다(Kim 2026).
- **성장**: 여러 층이 따로 핵을 만들면 적층이 다른 영역이 생깁니다.

## 관찰과 의미

[[암시야 투과전자현미경|DF-TEM]]은 특정 회절점을 골라 AB와 BA 도메인을 서로 다른 밝기로 보여 줍니다(Alden 2013). 압전 응답을 재는 PFM으로도 TMD 이중층의 도메인을 볼 수 있습니다(Rosenberger 2020). 적층에 따라 밴드 구조와 대칭이 달라지므로, 도메인 크기와 분포는 이중층 소자의 균일성을 좌우합니다. 3R형 TMD나 평행 h-BN에서는 이웃 도메인의 분극 방향이 반대여서 [[층간 미끄럼 강유전성]]과 직결됩니다.
