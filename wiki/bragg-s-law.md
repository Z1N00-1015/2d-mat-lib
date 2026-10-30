---
title: 브래그 법칙
en: Bragg's law
category: 결정학
status: 초안
summary: 결정면에서 산란된 X선의 보강 간섭 조건 2d sinθ = nλ.
chapter: crystallography/xrd
papers: bragg1913, meyer2007
reviewed: 2026-10-30
info:
- 식 | 2d sinθ = nλ
- d | 면간 거리
- θ | 입사 X선과 결정면 사이의 각
figures:
- 브래그
sources:
- Kittel, Introduction to Solid State Physics, 8th ed. (Wiley, 2005)
- Cullity & Stock, Elements of X-Ray Diffraction, 3rd ed. (Prentice Hall, 2001)
- Bragg & Bragg, Proc. R. Soc. Lond. A (1913) | https://doi.org/10.1098/rspa.1913.0040
- 2H-TMD 격자상수 | https://doi.org/10.1103/PhysRevB.89.075409
---
## 식과 의미

**브래그 법칙**(Bragg's law)은 결정면에서 반사된 X선이 보강 간섭하는 조건입니다.

**2d sinθ = nλ**

d는 [[면간 거리]], θ는 입사 X선과 결정면 사이의 각(브래그 각), λ는 X선 파장, n은 정수(회절 차수)입니다. 1913년 W. H. Bragg와 W. L. Bragg 부자가 X선 회절을 결정면의 ‘반사’로 해석해 제안했습니다.

{{그림: 브래그 | 위아래 두 결정면에서 반사된 X선. 아래 면에서 반사된 광선은 2d sinθ만큼 더 가며, 이 경로차가 파장의 정수배일 때 두 파동이 보강됩니다.}}

## 실험에서 읽는 법

[[X선 회절]] 장비는 보통 2θ를 가로축으로 회절 세기를 그립니다. 피크 위치 2θ를 알면 d = nλ / (2 sinθ)로 면간 거리를 구하고, 여러 피크의 d를 [[밀러 지수]]와 짝지어 격자상수를 얻습니다. 실험실 장비는 대부분 Cu Kα 선(λ = 1.5406 Å)을 씁니다(Cullity).

예: 2H-MoS₂의 (002) 면간 거리 약 6.15 Å → sinθ = 1.5406 / (2 × 6.15) → 2θ ≈ 14.4°.

## 역공간으로 보면

같은 조건을 [[역격자]]로 쓰면 ‘산란 벡터가 역격자 벡터와 같을 때 회절이 일어난다’(라우에 조건)가 됩니다. 두 표현은 같은 내용입니다(Kittel). 단위격자 안의 원자 배치에 따라 일부 (hkl) 피크는 사라지는데, 이는 [[구조 인자]]와 [[소멸 규칙]]으로 설명합니다.

전자의 파장도 브래그 조건을 따르므로 [[SAED]]도 같은 원리로 해석합니다. 전자는 파장이 매우 짧아 θ가 아주 작습니다.
