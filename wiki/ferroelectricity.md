---
title: 강유전성
en: ferroelectricity
category: 물성
status: 초안
summary: 외부 전기장 없이 자발 분극을 가지며, 전기장으로 분극 방향을 반전할 수 있는 성질.
chapter: materials/ferroelectric
papers: liu2016cips, chang2016, zhou2017in2se3, fei2018, wu2021sliding
reviewed: 2026-10-30
info:
- 정의 | 전기장으로 뒤집을 수 있는 자발 분극
- 특징 | P–E 이력, 잔류 분극, 항전기장
- 전이 온도 | 큐리 온도 위에서 상유전체
- 2D 예 | CuInP₂S₆, SnTe·SnS(면내), α-In₂Se₃, 미끄럼 강유전체
figures:
- pe
- 분극방향
sources:
- Lines & Glass, Principles and Applications of Ferroelectrics and Related Materials (Oxford, 1977)
- Liu et al., Nature Communications (2016) | https://doi.org/10.1038/ncomms12357
- Chang et al., Science (2016) | https://doi.org/10.1126/science.aad8609
- Zhou et al., Nano Letters (2017) | https://doi.org/10.1021/acs.nanolett.7b02198
- Fei et al., Nature (2018) | https://doi.org/10.1038/s41586-018-0336-3
- Wu & Li, PNAS (2021) | https://doi.org/10.1073/pnas.2115703118
---
## 정의

**강유전성**(ferroelectricity)은 외부 전기장이 없어도 결정 안에 전기 쌍극자가 정렬한 [[자발 분극]]이 있고, 그 방향을 전기장으로 뒤집을 수 있는 성질입니다. 자석의 강자성과 비슷해서 이름이 붙었지만 철과는 관계가 없습니다.

## 이력 곡선

강유전체에 전기장을 걸어 쓸면 분극이 이력 곡선을 그립니다. 전기장을 꺼도 남는 [[잔류 분극]] P_r과, 분극을 뒤집는 데 필요한 항전기장 E_c가 핵심 지표입니다. 두 안정 상태(+P_r, −P_r)가 있어 비휘발성 메모리에 쓰입니다([[강유전체 전계효과 트랜지스터|FeFET]]).

{{그림: pe | P–E 이력 곡선. 전기장이 0일 때도 분극이 +P_r 또는 −P_r로 남습니다.}}

## 왜 생기나

결정 속 양이온과 음이온의 중심이 대칭 위치에서 살짝 어긋나면 단위격자마다 쌍극자가 생깁니다. 이런 어긋남이 에너지가 더 낮고 두 방향이 모두 가능하면 강유전체가 됩니다. 온도가 [[큐리 온도]]를 넘으면 대칭 위치로 돌아가 상유전체가 됩니다(Lines & Glass).

## 얇아지면 어려운 이유

막이 얇아지면 표면 속박 전하가 만드는 [[탈분극장]]이 분극을 약하게 해, 일반 산화물 강유전체는 수 nm 아래에서 분극이 사라지기 쉽습니다.

## 2D 강유전체

층상 물질에서는 원자층까지 분극이 유지되는 사례가 보고되었습니다.

{{그림: 분극방향 | 2D 강유전체는 분극이 층 안을 향하는 면내형(SnTe, SnS)과 층에 수직인 면외형(In₂Se₃, CuInP₂S₆)으로 나뉩니다.}}

- **CuInP₂S₆**: 약 4 nm 두께에서도 상온 강유전성(Liu 2016)
- **SnTe**: 원자 한 단위 두께의 면내 강유전성(Chang 2016)
- **α-In₂Se₃**: 면외 강유전성과 압전성(Zhou 2017)
- **WTe₂**: 금속인데도 분극 전환이 가능한 이중층·삼중층(Fei 2018)
- **[[층간 미끄럼 강유전성]]**: 비강유전 층을 특정하게 쌓아 만든 분극(Wu & Li 2021)
