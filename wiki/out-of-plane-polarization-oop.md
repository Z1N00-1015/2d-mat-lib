---
title: 면외 분극
en: out-of-plane polarization, OOP
category: 물성
status: 초안
summary: 2D 층에 수직인 방향의 분극 성분.
papers: zhou2017in2se3, ding2017, liu2016cips, viznerstern2021, yasuda2021
reviewed: 2026-10-30
info:
- 정의 | 분극이 층(막) 면에 수직
- 장점 | 위아래 전극으로 쉽게 전환, 두께 방향 소자에 적합
- 어려움 | 탈분극장
- 2D 예 | α-In₂Se₃, CuInP₂S₆, 미끄럼 강유전체(h-BN 이중층)
figures:
- 분극방향
- 탈분극
sources:
- Zhou et al., Nano Letters (2017) | https://doi.org/10.1021/acs.nanolett.7b02198
- Ding et al., Nature Communications (2017) | https://doi.org/10.1038/ncomms14956
- Liu et al., Nature Communications (2016) | https://doi.org/10.1038/ncomms12357
- Vizner Stern et al., Science (2021) | https://doi.org/10.1126/science.abe8177
- Yasuda et al., Science (2021) | https://doi.org/10.1126/science.abd3230
---
## 정의

**면외 분극**(out-of-plane polarization, OOP)은 분극 방향이 막이나 원자층의 면에 수직한 경우입니다. 위아래 전극 사이에 전압을 걸어 쉽게 뒤집을 수 있어, 축전기·트랜지스터처럼 두께 방향으로 전기장을 거는 소자에 잘 맞습니다.

{{그림: 분극방향 | 면외 분극(오른쪽)은 이온 중심이 위아래로 어긋나 층에 수직한 쌍극자를 만듭니다.}}

## 탈분극장 문제

분극이 면에 수직하면 위아래 표면에 속박 전하가 생겨 반대 방향의 [[탈분극장]]이 생깁니다. 막이 얇을수록 이 효과가 커서, 원자층 두께에서 면외 분극을 유지하기는 면내 분극보다 어렵습니다.

{{그림: 탈분극 | 면외 분극은 표면 속박 전하가 만드는 탈분극장을 받으며, 전극의 자유 전하로 가려야 안정해집니다.}}

## 2D 물질 예

- **α-In₂Se₃**: 원자층에서도 면외 분극이 유지된다는 이론 예측(Ding 2017)에 이어 면외 압전·강유전성이 관측되었습니다(Zhou 2017).
- **CuInP₂S₆**: 약 4 nm 두께에서 상온 면외 강유전성(Liu 2016).
- **[[층간 미끄럼 강유전성|미끄럼 강유전체]]**: 원래 비강유전인 h-BN도 두 층을 평행하게 쌓으면 층 사이 전하 이동으로 면외 분극이 생기고, 층이 미끄러지면 방향이 바뀝니다(Vizner Stern 2021, Yasuda 2021).

면외 분극은 압전 PFM의 수직 신호와 위아래 전극의 P–E 이력, 트랜지스터의 이력 방향으로 확인합니다.
