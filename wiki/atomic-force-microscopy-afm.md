---
title: 원자힘현미경
en: atomic force microscopy, AFM
category: 분석법
status: 초안
summary: 탐침과 표면 사이 힘에 따른 캔틸레버 응답을 기록해 표면 형상과 높이를 측정하는 주사 탐침 현미경.
chapter: crystallography/afm
papers: novoselov2004, lee2008, novoselov2005pnas, rosenberger2020
reviewed: 2026-10-30
info:
- 원리 | 탐침–표면 힘에 따른 캔틸레버 휨을 레이저로 측정
- 모드 | 접촉, 탭핑(간헐 접촉), 비접촉
- 높이 분해능 | 수직 방향 sub-nm
- 확장 | KPFM(표면 전위), PFM(압전), C-AFM(전류), 나노압입
figures:
- afm
sources:
- Novoselov et al., Science (2004) | https://doi.org/10.1126/science.1102896
- Novoselov et al., PNAS (2005) | https://doi.org/10.1073/pnas.0502848102
- Lee et al., Science (2008) | https://doi.org/10.1126/science.1157996
- Rosenberger et al., ACS Nano (2020) | https://doi.org/10.1021/acsnano.0c00088
- Binnig, Quate & Gerber, Phys. Rev. Lett. (1986) | https://doi.org/10.1103/PhysRevLett.56.930
---
## 원리

**원자힘현미경**(atomic force microscope, AFM)은 끝이 수 nm로 뾰족한 탐침이 달린 캔틸레버로 표면을 훑으며, 탐침과 표면 사이의 힘 때문에 캔틸레버가 휘는 정도를 재서 표면의 높낮이 지도를 만듭니다. 1986년 Binnig, Quate, Gerber가 제안했습니다.

{{그림: afm | 레이저가 캔틸레버 등에서 반사되어 4분할 광검출기에 닿습니다. 탐침이 높낮이를 따라 휘면 반사 위치가 바뀌고, 되먹임 회로가 이를 일정하게 유지하도록 높이를 조절한 값이 지형 영상이 됩니다.}}

## 모드

- **접촉 모드**: 탐침이 표면을 누른 채 끌고 갑니다. 빠르지만 부드러운 시료를 긁을 수 있습니다.
- **탭핑 모드**: 캔틸레버를 진동시키며 표면을 톡톡 두드립니다. 2D 물질 측정에 가장 흔히 씁니다.
- **비접촉 모드**: 표면 위에서 진동만 시키며 힘의 변화로 진동수 변화를 읽습니다.

## 2D 물질에서

- **두께와 층수**: 플레이크와 기판 사이 계단 높이를 잽니다. 그래핀을 처음 분리했을 때도 AFM으로 원자 몇 층 두께를 확인했습니다(Novoselov 2004, 2005). 다만 기판과의 상호작용, 흡착된 물·고분자 잔여물 때문에 단층의 겉보기 두께가 실제 층 간격보다 크게 나올 수 있어, [[라만 분광법]]이나 [[광발광]]과 함께 판단합니다.
- **기계적 성질**: suspended 그래핀을 AFM 탐침으로 눌러 영률 약 1.0 TPa, 고유 강도 약 130 GPa를 측정했습니다(Lee 2008).
- **기능 모드**: 표면 전위(KPFM), 압전·강유전 응답(PFM), 국소 전류(C-AFM)를 함께 지도로 그립니다. PFM으로 꼬인 TMD 이중층의 적층 도메인을 영상화한 연구가 있습니다(Rosenberger 2020).

## 주의할 점

탐침 끝의 모양이 영상에 섞여(탐침 합성곱) 좁은 구조는 넓게 보입니다. 높이 기준면을 잘 잡고, 같은 플레이크를 여러 방향으로 재서 확인합니다.
