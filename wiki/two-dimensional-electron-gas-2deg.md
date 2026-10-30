---
title: 2차원 전자가스
en: two-dimensional electron gas, 2DEG
category: 소자
status: 초안
summary: 이종접합 계면 등에 갇혀 면내 방향으로 주로 운동하는 전자 집단.
papers: klitzing1980, tsui1982, ohtomo2004, novoselov2005
reviewed: 2026-10-30
info:
- 정의 | 한 방향으로 갇히고 면 안으로만 움직이는 전자 집단
- 대표 계 | GaAs/AlGaAs 이종접합, Si MOSFET 반전층, LaAlO₃/SrTiO₃
- 대표 현상 | 정수·분수 양자 홀 효과
- 2D 물질과 차이 | 계면에 생긴 층 vs 원자 자체가 얇은 층
figures:
- 2deg
sources:
- von Klitzing et al., Phys. Rev. Lett. (1980) | https://doi.org/10.1103/PhysRevLett.45.494
- Tsui et al., Phys. Rev. Lett. (1982) | https://doi.org/10.1103/PhysRevLett.48.1559
- Ohtomo & Hwang, Nature (2004) | https://doi.org/10.1038/nature02308
- Novoselov et al., Nature (2005) | https://doi.org/10.1038/nature04233
- Sze & Ng, Physics of Semiconductor Devices, 3rd ed. (Wiley, 2007)
---
## 정의

**2차원 전자가스**(two-dimensional electron gas, 2DEG)는 한 방향(두께 방향)으로는 좁은 퍼텐셜 우물에 갇혀 에너지가 양자화되고, 나머지 두 방향(면 안)으로만 자유롭게 움직이는 전자 집단입니다.

{{그림: 2deg | 넓은 밴드갭 반도체(예: AlGaAs)와 좁은 밴드갭 반도체(예: GaAs)의 계면에 삼각형 퍼텐셜 우물이 생기고, 전자가 가장 낮은 양자 준위 E₁에 모여 2DEG를 이룹니다. 곡선은 개념도입니다.}}

## 어디서 생기나

- **반도체 이종접합**: AlGaAs/GaAs처럼 밴드갭이 다른 두 반도체의 계면. 도펀트를 장벽 쪽에만 넣으면(변조 도핑) 전자와 이온화된 불순물이 떨어져 이동도가 매우 높아집니다. 고전자 이동도 트랜지스터(HEMT)의 원리입니다.
- **Si MOSFET 반전층**: 게이트 전압이 산화막 아래에 전자를 끌어모은 얇은 층.
- **산화물 계면**: 절연체 LaAlO₃와 SrTiO₃의 계면에 높은 이동도의 전자가스가 생깁니다(Ohtomo 2004).

## 대표 현상: 양자 홀 효과

강한 자기장 속 2DEG의 홀 저항은 h/(ie²)의 정확한 값에 고정됩니다(정수 양자 홀 효과, von Klitzing 1980). 더 깨끗한 계에서는 분수 i에서도 고정되는 분수 양자 홀 효과가 발견되었습니다(Tsui 1982). [[그래핀]]에서는 디랙 페르미온 특유의 반정수 양자 홀 효과가 나타났습니다(Novoselov 2005).

## 2D 물질과의 차이

2DEG는 3차원 결정 속 계면에 ‘만들어진’ 2차원 층이고, 그래핀·TMD 같은 2D 물질은 결정 자체가 원자 몇 층 두께입니다. 2D 물질은 게이트로 캐리어 농도를 넓게 바꿀 수 있고 다른 물질과 자유롭게 쌓을 수 있다는 점이 다릅니다.
