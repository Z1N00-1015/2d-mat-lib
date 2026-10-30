---
title: 강자성
en: ferromagnetism
category: 물성
status: 초안
summary: 스핀의 장거리 정렬로 자발 자화를 갖는 자기 질서.
chapter: materials/ferromagnetism
papers: huang2017, gong2017, deng2018, burch2018, gibertini2019
reviewed: 2026-10-30
info:
- 정의 | 원자 자기 모멘트가 같은 방향으로 정렬
- 원인 | 교환 상호작용(양자역학적)
- 전이 온도 | 큐리 온도 T_C 위에서 사라짐
- 2D 대표 물질 | CrI₃, Cr₂Ge₂Te₆, Fe₃GeTe₂
figures:
- 자성질서
- 자화온도 | 큐리
sources:
- Kittel, Introduction to Solid State Physics, 8th ed. (Wiley, 2005)
- Huang et al., Nature (2017) | https://doi.org/10.1038/nature22391
- Gong et al., Nature (2017) | https://doi.org/10.1038/nature22060
- Deng et al., Nature (2018) | https://doi.org/10.1038/s41586-018-0626-9
- Burch et al., Nature (2018) | https://doi.org/10.1038/s41586-018-0631-z
- Gibertini et al., Nature Nanotechnology (2019) | https://doi.org/10.1038/s41565-019-0438-6
---
## 정의

**강자성**(ferromagnetism)은 물질 속 원자의 자기 모멘트(스핀)들이 외부 자기장 없이도 같은 방향으로 정렬해, 물질 전체가 알짜 자화를 갖는 성질입니다. 철, 코발트, 니켈이 대표적입니다.

{{그림: 자성질서 | 상자성(제멋대로), 강자성(같은 방향), 반강자성(이웃끼리 반대)의 스핀 배열.}}

## 왜 정렬하나

이웃한 전자 스핀 사이에는 양자역학적 **교환 상호작용**이 있어, 스핀이 나란할 때(강자성) 또는 반대일 때(반강자성) 에너지가 낮아집니다. 교환 에너지가 열에너지보다 크면 정렬이 유지되고, 온도가 [[큐리 온도]]를 넘으면 열 요동이 이겨 상자성이 됩니다(Kittel).

{{그림: 자화온도 | 온도가 오르면 자화가 줄다가 큐리 온도 T_C에서 사라집니다. 곡선은 개념도입니다.}}

## 2D 강자성의 발견

[[Mermin–Wagner 정리]]에 따르면 방향 제한이 없는 2차원 계에서는 유한 온도에서 장거리 자기 질서가 깨집니다. 그런데 [[자기 이방성]]이 특정 방향을 선호하게 만들면 이 제약을 피할 수 있습니다. 2017년에 원자층 강자성이 처음 확인되었습니다.

- **CrI₃**: 단층이 이징형 강자성체(T_C 약 45 K)이고, 이중층은 층 사이가 반강자성, 삼중층은 다시 강자성으로 층수에 따라 바뀝니다(Huang 2017).
- **Cr₂Ge₂Te₆**: 이방성이 작아 층이 얇아질수록 T_C가 크게 낮아지고 작은 자기장에도 민감합니다(Gong 2017).
- **Fe₃GeTe₂**: 금속성 강자성체로, 이온 게이트로 전자를 넣어 T_C를 상온까지 올렸습니다(Deng 2018).

2D 강자성체는 게이트 전압, 변형, 적층으로 자성을 조절할 수 있고 다른 2D 물질과 쌓아 스핀 소자를 만들 수 있어 활발히 연구됩니다(Burch 2018, Gibertini 2019). 측정에는 주로 [[자기 광학 Kerr 효과]]를 씁니다.
