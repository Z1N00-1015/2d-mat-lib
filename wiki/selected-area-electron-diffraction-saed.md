---
title: SAED
en: selected-area electron diffraction, SAED
category: 분석법
status: 초안
summary: 투과전자현미경에서 선택한 시료 영역의 전자 회절 패턴을 얻어 결정 대칭과 방위를 분석하는 방법.
papers: meyer2007, brown2012, huang2011
reviewed: 2026-10-30
info:
- 방법 | 제한 시야 조리개로 영역을 골라 회절 무늬를 얻음
- 선택 영역 크기 | 보통 수백 nm~수 µm
- 얻는 정보 | 결정 대칭, 방위, 면간 거리, 단결정/다결정
- 관계식 | R·d = λL
figures:
- saed
sources:
- Williams & Carter, Transmission Electron Microscopy, 2nd ed. (Springer, 2009)
- Meyer et al., Nature (2007) | https://doi.org/10.1038/nature05545
- Huang et al., Nature (2011) | https://doi.org/10.1038/nature09718
- Brown et al., Nano Lett. (2012) | https://doi.org/10.1021/nl204547v
---
## 원리

**SAED**(selected-area electron diffraction)은 TEM의 상면에 제한 시야 조리개를 넣어 원하는 영역만 고른 뒤, 그 영역에서 나온 회절 무늬를 보는 방법입니다. 결정은 [[브래그 법칙]]을 만족하는 방향으로만 전자를 회절시키므로, 화면에는 [[역격자]]를 그대로 옮긴 점 무늬가 나타납니다.

{{그림: saed | 왼쪽: 단층 육방정의 회절 무늬. 가장 안쪽 육각형이 {100}, 그다음이 {110} 반사입니다. 오른쪽: 시료와 검출기 사이 거리(카메라 길이 L)와 회절점까지 반지름 R의 관계.}}

## 무늬로 읽는 것

- **단결정/다결정**: 단결정은 점, 방위가 무작위인 다결정은 고리, 몇 개 방위가 섞이면 점이 여러 세트로 보입니다.
- **방위·비틀림각**: 두 층이 비틀려 있으면 육각형 점 세트가 두 개 생기고 그 사이 각이 [[상대 회전각]]입니다(Brown 2012).
- **면간 거리**: R·d = λL 관계로 회절점까지 거리 R에서 면간 거리 d를 구하며, L은 camera length입니다.
- **층수 판별(그래핀)**: 단층은 {100}이 {110}보다 강하고, AB 이중층은 반대가 되는 경향이 있습니다(Meyer 2007).

## 2D 물질에서

suspended 그래핀을 기울이며 회절점이 퍼지는 모양을 분석해, 그래핀이 평평하지 않고 물결친다는 것이 밝혀졌습니다(Meyer 2007). CVD 막에서는 영역을 옮겨 가며 SAED를 찍어 결정립의 방위 분포를 얻습니다(Huang 2011).
