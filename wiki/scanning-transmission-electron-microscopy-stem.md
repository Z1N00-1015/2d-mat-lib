---
title: 주사 투과전자현미경
en: scanning transmission electron microscopy, STEM
category: 분석법
status: 초안
summary: 좁은 전자빔을 시료 위에서 주사하고 각 위치에서 산란·투과 신호를 검출해 영상을 만드는 전자현미경 기법.
papers: krivanek2010, muller2008, zhou2013defects, lin2014phase
reviewed: 2026-10-30
info:
- 방식 | 가늘게 모은 전자 탐침을 주사
- 검출기 | BF, ADF, HAADF (산란 각도별)
- 장점 | 원자번호 대비, 원자 단위 분광(EDS·EELS) 지도
- 분해능 | 수차 보정 시 0.1 nm 이하
figures:
- stem
sources:
- Williams & Carter, Transmission Electron Microscopy, 2nd ed. (Springer, 2009)
- Krivanek et al., Nature (2010) | https://doi.org/10.1038/nature08879
- Muller et al., Science (2008) | https://doi.org/10.1126/science.1148820
- Zhou et al., Nano Lett. (2013) | https://doi.org/10.1021/nl4007479
- Lin et al., Nat. Nanotechnol. (2014) | https://doi.org/10.1038/nnano.2014.64
---
## 원리

**주사 투과전자현미경**(scanning TEM, STEM)은 전자를 원자 크기 정도의 점(탐침)으로 모아 시료 위를 한 점씩 훑으며, 각 위치에서 투과·산란한 전자의 양을 검출기로 재서 영상을 만듭니다. TV 화면처럼 한 화소씩 영상을 채우는 방식이라, 같은 위치에서 분광 신호도 함께 모을 수 있습니다.

{{그림: stem | 탐침이 시료를 지난 뒤 작은 각도로 나간 전자는 가운데의 BF 검출기로, 중간 각도는 ADF, 큰 각도는 바깥 고리 모양의 HAADF 검출기로 들어갑니다.}}

## 검출기와 대비

- **BF**(명시야): 거의 꺾이지 않은 전자. HRTEM과 비슷한 위상 대비.
- **ADF**(환형 암시야): 중간 각도 산란. 가벼운 원자도 보이면서 원자번호 대비가 있습니다.
- **[[고각 환형 암시야 영상|HAADF]]**: 큰 각도 산란은 원자핵 근처의 러더퍼드 산란이 주이므로 밝기가 원자번호 Z에 크게 의존합니다(Z 대비). 해석이 직관적이라 무거운 원자의 위치를 찾기 좋습니다.

## 2D 물질에서

Krivanek 등(2010)은 60 kV ADF-STEM으로 단층 BN 속 B, C, N, O 원자를 밝기만으로 하나씩 구별했습니다. MoS₂에서는 Mo(Z = 42)와 S(Z = 16)의 밝기 차이가 커서, S 빈자리·안티사이트 같은 점결함과 결정립계 구조를 원자 단위로 셀 수 있습니다(Zhou 2013). 전자빔으로 시료를 가열하며 2H→1T 상전이가 원자 단위로 진행하는 모습도 관찰되었습니다(Lin 2014).

## 분광 지도

탐침 위치마다 [[에너지 분산 X선 분광법|EDS]]나 [[전자 에너지 손실 분광법|EELS]] 스펙트럼을 얻으면 원소와 결합 상태의 지도를 원자 단위로 그릴 수 있습니다(Muller 2008).
