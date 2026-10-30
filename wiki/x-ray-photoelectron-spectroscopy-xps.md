---
title: X선 광전자분광법
en: X-ray photoelectron spectroscopy, XPS
category: 분석법
status: 초안
summary: X선 조사로 방출된 광전자의 결합 에너지를 측정해 표면 근처의 원소 조성과 화학 상태를 분석하는 방법.
chapter: crystallography/xps
papers: eda2011, kappera2014, eda2012
reviewed: 2026-10-30
info:
- 원리 | 광전 효과: KE = hν − BE − φ
- 광원 | 보통 Al Kα (1486.6 eV)
- 분석 깊이 | 표면에서 수 nm
- 얻는 정보 | 원소 조성, 산화 상태, 상(phase) 비율
figures:
- 광전자
- 화학적이동
sources:
- Watts & Wolstenholme, An Introduction to Surface Analysis by XPS and AES (Wiley, 2003)
- X-ray Data Booklet (LBNL) | https://xdb.lbl.gov
- Eda et al., Nano Letters (2011) | https://doi.org/10.1021/nl201874w
- Eda et al., ACS Nano (2012) | https://doi.org/10.1021/nn302422x
- Kappera et al., Nature Materials (2014) | https://doi.org/10.1038/nmat4080
---
## 원리

**X선 광전자분광법**(X-ray photoelectron spectroscopy, XPS)은 시료에 X선을 비춰 원자의 안쪽 껍질 전자를 떼어 내고, 튀어나온 광전자의 운동 에너지(KE)를 재는 방법입니다. 에너지 보존에서

**BE = hν − KE − φ**

로 원소마다 고유한 **결합 에너지**(BE)를 구합니다. φ는 분석기의 일함수입니다. 실험실 장비는 주로 Al Kα(hν = 1486.6 eV)를 씁니다(Watts & Wolstenholme).

{{그림: 광전자 | 왼쪽: X선이 내각 전자를 떼어 내 광전자로 내보냅니다. 오른쪽: 광자 에너지 hν는 결합 에너지, 일함수, 광전자의 운동 에너지로 나뉩니다.}}

## 표면에 민감한 이유

광전자는 고체 속에서 몇 nm만 가도 에너지를 잃으므로, 에너지를 잃지 않고 나온 전자는 표면 수 nm에서 온 것입니다. 그래서 XPS는 표면 분석법이고, 2D 물질처럼 얇은 시료에 잘 맞지만 표면 오염(탄소, 산소)의 영향도 크게 받습니다.

## 화학 상태 분석

같은 원소라도 결합 상대와 산화 상태에 따라 결합 에너지가 조금씩 달라집니다([[화학적 이동]]). 산화되어 전자를 잃으면 높은 결합 에너지 쪽으로 이동합니다.

{{그림: 화학적이동 | 같은 원소의 두 화학 상태. 산화수가 높을수록 피크가 높은 결합 에너지 쪽(왼쪽)에 나타납니다. 위치는 개념을 보이기 위한 것입니다.}}

## 2D 물질에서

- **2H/1T 상 비율**: 화학적으로 박리한 MoS₂의 Mo 3d와 S 2p 피크를 2H 성분과 낮은 결합 에너지의 1T 성분으로 나눠 상 비율을 구하고, 열처리로 2H로 돌아가는 과정을 추적했습니다(Eda 2011, 2012). 1T 상을 접촉에 쓴 소자 연구에서도 XPS로 상을 확인했습니다(Kappera 2014).
- **산화·도핑**: Mo⁶⁺(MoO₃) 성분, 질소·산소 도핑, 전극 금속과의 반응을 확인합니다.
- **조성**: 피크 면적을 감도 인자로 나눠 S/Mo 비 같은 원소 비를 어림합니다.

에너지 눈금은 흔히 탄소 1s(약 284.8 eV, 오염 탄소)로 맞추지만, 기준에 따라 수백 meV 차이가 날 수 있어 기준을 함께 밝힙니다.
