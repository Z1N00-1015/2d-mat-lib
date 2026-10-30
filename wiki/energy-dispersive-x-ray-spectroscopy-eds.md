---
title: 에너지 분산 X선 분광법
en: energy-dispersive X-ray spectroscopy, EDS
category: 분석법
status: 초안
summary: 전자빔으로 여기된 시료에서 나오는 특성 X선 에너지를 분석해 원소와 공간 분포를 조사하는 방법.
papers: krivanek2010, muller2008, lin2014phase
reviewed: 2026-10-30
info:
- 신호 | 전자빔이 만든 특성 X선
- 얻는 정보 | 원소 종류·분포(지도), 대략적 조성
- 에너지 분해능 | 보통 약 130 eV 수준(검출기에 따라)
- MoS₂ 주의 | Mo Lα(2.293 keV)와 S Kα(2.307 keV)가 겹침
figures:
- eds
sources:
- Williams & Carter, Transmission Electron Microscopy, 2nd ed. (Springer, 2009)
- X-ray Data Booklet (LBNL) | https://xdb.lbl.gov
- Krivanek et al., Nature (2010) | https://doi.org/10.1038/nature08879
- Muller et al., Science (2008) | https://doi.org/10.1126/science.1148820
- Lin et al., Nature Nanotechnology (2014) | https://doi.org/10.1038/nnano.2014.64
---
## 원리

**에너지 분산 X선 분광법**(energy-dispersive X-ray spectroscopy, EDS 또는 EDX)은 전자빔이 시료 원자의 안쪽 껍질 전자를 떼어 낼 때 나오는 **특성 X선**의 에너지를 재서 원소를 구별하는 방법입니다. 빈자리를 바깥 껍질 전자가 채우면서 두 준위의 에너지 차만큼 X선이 나오는데, 이 값은 원소마다 고유합니다.

{{그림: eds | ① 입사 전자가 K껍질 전자를 떼어 내면 ② L껍질 전자가 빈자리로 떨어지며 ③ 두 준위 차만큼의 Kα X선을 냅니다.}}

## 표기

어느 껍질의 빈자리를 어느 껍질의 전자가 채우는지에 따라 Kα(L→K), Kβ(M→K), Lα 등으로 부릅니다. 무거운 원소는 K선 에너지가 높아 L선이나 M선을 주로 씁니다.

## 장비와 쓰임

SEM과 TEM/STEM에 붙여 씁니다. 전자빔을 주사하며 위치마다 스펙트럼을 모으면 원소 분포 지도를 얻습니다. 수차 보정 STEM에서는 원자 단위 화학 지도도 가능합니다(Muller 2008). 다만 반도체 검출기의 에너지 분해능이 보통 약 130 eV로 [[전자 에너지 손실 분광법|EELS]]보다 훨씬 거칠어, 가까운 피크를 구별하기 어렵습니다(Williams & Carter).

## 2D 물질에서 주의할 점

- **MoS₂의 피크 겹침**: Mo Lα(2.293 keV)와 S Kα(2.307 keV)가 14 eV밖에 차이 나지 않아(X-ray Data Booklet) 일반 EDS로는 거의 한 피크로 보입니다. Mo는 Kα(약 17.5 keV) 선으로 확인하는 것이 안전합니다.
- **신호가 약함**: 단층은 원자 수가 적어 X선이 적게 나오므로 오래 모아야 하고, 그동안 빔 손상이 생길 수 있습니다.
- **조성의 정확도**: 정량 결과는 보정과 두께에 민감해 ‘대략적 조성’으로 읽고, 가벼운 원소(B, C, N, O)는 EELS가 더 정확합니다.
