---
title: 전자 에너지 손실 분광법
en: electron energy-loss spectroscopy, EELS
category: 분석법
status: 초안
summary: 시료를 통과한 전자의 에너지 손실을 측정해 원소와 결합·전자 구조 정보를 얻는 방법.
papers: muller2008, krivanek2010, zhou2013defects
reviewed: 2026-10-30
info:
- 신호 | 투과 전자가 잃은 에너지
- 구간 | 영손실 피크 · 저손실(플라스몬) · 내각 흡수단
- 에너지 분해능 | 보통 1 eV 이하, 단색화기 사용 시 더 작음
- 강점 | 가벼운 원소, 결합·산화 상태, 원자 단위 지도
figures:
- eels
sources:
- Williams & Carter, Transmission Electron Microscopy, 2nd ed. (Springer, 2009)
- X-ray Data Booklet (LBNL) | https://xdb.lbl.gov
- Muller et al., Science (2008) | https://doi.org/10.1126/science.1148820
- Krivanek et al., Nature (2010) | https://doi.org/10.1038/nature08879
- Zhou et al., Nano Letters (2013) | https://doi.org/10.1021/nl4007479
---
## 원리

**전자 에너지 손실 분광법**(electron energy loss spectroscopy, EELS)은 TEM/STEM에서 시료를 통과한 전자가 시료와 상호작용하며 잃은 에너지를 분광기로 재는 방법입니다. 잃은 에너지는 시료 속에서 일어난 들뜸(플라스몬, 밴드 사이 전이, 내각 전자 이온화)의 에너지와 같습니다.

{{그림: eels | EELS 스펙트럼의 세 부분. ① 에너지를 잃지 않은 전자의 영손실 피크, ② 전자들의 집단 진동인 플라스몬, ③ 원소 고유의 내각 흡수단. 위치와 높이는 개념을 보이기 위한 것입니다.}}

## 스펙트럼 구간

- **영손실 피크**: 가장 강합니다. 폭이 장비의 에너지 분해능을 나타냅니다.
- **저손실 영역**(약 50 eV 이하): 플라스몬과 밴드 사이 전이. 두께 측정, 밴드갭과 유전 함수 정보를 얻습니다.
- **내각 손실 영역**: 원소마다 정해진 에너지에서 흡수단이 시작됩니다. 예를 들어 탄소 K 흡수단은 약 284 eV입니다(X-ray Data Booklet). 흡수단 근처의 미세 구조(ELNES)는 결합 상태와 산화수를 반영합니다.

## EDS와 비교

[[에너지 분산 X선 분광법|EDS]]보다 에너지 분해능이 훨씬 좋고 B, C, N, O 같은 가벼운 원소에 민감합니다. 반면 시료가 두꺼우면 여러 번 산란한 신호가 섞여 해석이 어려워지므로 얇은 시료가 유리합니다. 2D 물질은 이 점에서 EELS에 잘 맞습니다.

## 2D 물질 연구에서

수차 보정 STEM에 EELS를 붙이면 원자 단위로 원소와 결합 상태 지도를 그릴 수 있습니다(Muller 2008). 단층 BN 속 원자를 ADF 영상 밝기로 하나씩 구별한 연구(Krivanek 2010)처럼 원자 단위 영상과 함께 쓰면, 결함·도펀트·경계 주변의 원소와 결합 상태를 직접 확인할 수 있습니다(Zhou 2013).
