---
title: ADF-STEM
en: annular dark-field scanning transmission electron microscopy, ADF-STEM
category: 분석법
status: 초안
summary: 시료를 주사하는 전자빔에서 산란된 전자를 환형 검출기로 모아 영상을 만드는 방법. 검출 각도와 camera length가 대비에 영향을 준다.
papers: krivanek2010, zhou2013defects, lin2014phase, weston2020, muller2008
reviewed: 2026-10-30
info:
- 검출 신호 | 환형 검출기에 모인 산란 전자
- 대비 | 원자번호·두께에 따라 밝기 변화
- 조절 변수 | 검출기 안쪽·바깥쪽 각도(카메라 길이)
- 대표 성과 | 단층 BN 속 원자를 하나씩 식별
figures:
- stem
sources:
- Williams & Carter, Transmission Electron Microscopy, 2nd ed. (Springer, 2009)
- Krivanek et al., Nature (2010) | https://doi.org/10.1038/nature08879
- Zhou et al., Nano Lett. (2013) | https://doi.org/10.1021/nl4007479
- Lin et al., Nat. Nanotechnol. (2014) | https://doi.org/10.1038/nnano.2014.64
- Weston et al., Nat. Nanotechnol. (2020) | https://doi.org/10.1038/s41565-020-0682-9
---
## 정의

**환형 암시야 STEM**(ADF-STEM)은 [[STEM|STEM]]에서 투과빔을 피해 고리 모양 검출기로 산란된 전자만 모아 만든 영상입니다. 원자가 있는 곳에서 전자가 더 많이 산란되므로 원자가 밝게, 빈 곳이 어둡게 보입니다.

{{그림: stem | 검출기의 안쪽·바깥쪽 각도가 어떤 산란 전자를 모을지를 정합니다. 중간 각도는 ADF, 더 큰 각도는 HAADF입니다.}}

## 검출 각도와 대비

검출 각도 범위는 camera length 설정에 따라 달라집니다. 값을 줄이면 같은 검출기가 더 큰 각도의 전자를 모읍니다.

- 각도가 크면([[HAADF imaging|HAADF]]) 밝기가 원자번호에 강하게 의존하고 해석이 쉽습니다.
- 각도가 중간이면 신호가 더 많아 탄소·붕소처럼 가벼운 원자를 보기 좋지만, 회절 효과가 섞일 수 있습니다.

Krivanek 등(2010)은 중간 각도 ADF로 단층 BN의 각 원자 밝기를 재서 B, C, N, O를 구별했습니다.

## 2D 물질 연구에서의 쓰임

- **점결함 세기**: MoS₂의 S 빈자리, 안티사이트, 결정립계 구조(Zhou 2013)
- **상전이 관찰**: 2H→1T 전환 과정의 원자 이동(Lin 2014)
- **모아레 재구성**: 작은 각도로 꼬인 TMD 이중층의 적층 도메인과 [[atomic reconstruction]](Weston 2020)

## 해석할 때 주의

밝기는 원자번호뿐 아니라 두께, 결정 기울기, 초점, 흡착물의 영향을 받습니다. 정량 비교에는 같은 조건에서 얻은 영상과 시뮬레이션을 함께 쓰는 것이 좋습니다.
