---
title: chemical shift
en: chemical shift
category: 분석법
status: 초안
summary: 화학 결합과 전하 환경의 차이로 분광 피크의 에너지 위치가 달라지는 현상. XPS에서는 결합 에너지 이동으로 화학 상태를 비교한다.
papers: eda2011, kappera2014, eda2012
reviewed: 2026-10-30
info:
- 정의 | 화학 환경에 따른 피크 에너지 이동
- XPS에서 | 산화수↑ → 결합 에너지↑
- 크기 | 보통 수 eV 이내
- 2D 예 | MoS₂의 1T 성분은 2H보다 낮은 결합 에너지
figures:
- chemical shift
sources:
- Watts & Wolstenholme, An Introduction to Surface Analysis by XPS and AES (Wiley, 2003)
- Eda et al., Nano Letters (2011) | https://doi.org/10.1021/nl201874w
- Eda et al., ACS Nano (2012) | https://doi.org/10.1021/nn302422x
- Kappera et al., Nature Materials (2014) | https://doi.org/10.1038/nmat4080
---
## 정의

**chemical shift**는 같은 원소라도 주변의 화학 결합과 전하 상태에 따라 분광 피크의 에너지 위치가 달라지는 현상입니다. [[X선 광전자분광법|XPS]]에서는 내각 전자의 결합 에너지가 바뀌는 것으로 나타납니다.

{{그림: chemical shift | 같은 원소가 산화되어 높은 산화수를 가지면 피크가 높은 결합 에너지 쪽으로 이동합니다.}}

## 왜 생기나

원자가 결합 상대(예: 산소)에게 전자를 내주면 남은 전자들이 원자핵을 덜 가려, 내각 전자가 핵에 더 강하게 끌립니다. 그래서 산화수가 높을수록 결합 에너지가 커지는 경향이 있습니다. 반대로 전자를 받으면 결합 에너지가 작아집니다. 이동 폭은 보통 수 eV 이내입니다(Watts & Wolstenholme).

## 분석 방법

1. 넓은 범위 스캔으로 어떤 원소가 있는지 확인합니다.
2. 관심 원소의 피크를 좁은 범위로 자세히 잽니다.
3. 피크를 화학 상태별 성분으로 나눠(피팅) 면적 비로 상의 비율을 구합니다. d·p 궤도는 스핀–궤도 결합으로 두 피크(예: 3d₅/₂·3d₃/₂)로 갈라지므로, 두 피크의 간격과 면적 비를 고정해 맞춥니다.

## 2D 물질에서

화학적으로 박리한 MoS₂에는 반도체 2H 상과 금속 1T 상이 섞여 있는데, Mo 3d와 S 2p 피크에서 1T 성분이 2H 성분보다 낮은 결합 에너지에 나타나 둘을 나눌 수 있습니다. 이 방법으로 열처리하며 1T가 2H로 돌아가는 비율을 추적했습니다(Eda 2011, 2012; Kappera 2014). 표면 산화로 생긴 Mo⁶⁺ 성분은 높은 결합 에너지 쪽에 나타납니다.

전하 축적(대전)으로 피크 전체가 밀릴 수 있으므로, 기준 피크로 에너지를 보정한 뒤 성분 사이의 상대 이동을 비교합니다.
