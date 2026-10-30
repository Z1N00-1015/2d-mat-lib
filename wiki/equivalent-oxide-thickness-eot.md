---
title: EOT
en: equivalent oxide thickness, EOT
category: 소자
status: 초안
summary: high-k dielectric과 같은 정전 용량을 주는 SiO₂의 두께. EOT = t_phys × (3.9 / κ).
papers: wilk2001, illarionov2020, liu2021prospects, das2021
reviewed: 2026-10-30
info:
- 정의 | 같은 정전용량을 주는 SiO₂ 두께
- 식 | EOT = t_물리 × (3.9 / κ)
- 예 | HfO₂(κ≈25) 6.4 nm ≈ EOT 1 nm
- 2D 소자 과제 | EOT 1 nm 이하 + 낮은 결함·누설
figures:
- eot
sources:
- Wilk et al., J. Appl. Phys. (2001) | https://doi.org/10.1063/1.1361065
- Illarionov et al., Nature Communications (2020) | https://doi.org/10.1038/s41467-020-16640-8
- Liu et al., Nature (2021) | https://doi.org/10.1038/s41586-021-03339-z
- Das et al., Nature Electronics (2021) | https://doi.org/10.1038/s41928-021-00670-1
- Sze & Ng, Physics of Semiconductor Devices, 3rd ed. (Wiley, 2007)
---
## 정의

**EOT**(equivalent oxide thickness, EOT)는 어떤 gate dielectric과 같은 단위 면적당 정전용량을 주는 SiO₂의 두께입니다.

**EOT = t_물리 × (κ_SiO₂ / κ) = t_물리 × (3.9 / κ)**

정전용량은 κ/t에 비례하므로 유전율 κ가 큰 막은 물리적으로 두꺼워도 EOT가 작습니다.

{{그림: eot | SiO₂ 1 nm와 같은 정전용량을 얻으려면 HfO₂(κ ≈ 25)는 약 6.4 nm 두께면 됩니다. 두께가 두꺼우면 터널링 누설 전류가 크게 줄어듭니다.}}

## 왜 필요했나

트랜지스터를 줄이며 게이트 제어력을 유지하려면 정전용량을 키워야 해서 SiO₂를 계속 얇게 만들었습니다. 그런데 2 nm 아래로 얇아지면 전자가 직접 터널링해 누설 전류가 급증합니다. 그래서 HfO₂ 같은 고유전율(high-κ) 막으로 바꿔, 두께는 유지하면서 EOT를 줄였습니다(Wilk 2001).

대표 유전율: SiO₂ 3.9, Si₃N₄ 약 7, Al₂O₃ 약 9, HfO₂ 약 25(Wilk 2001).

## 2D 소자에서의 과제

2D 채널은 표면에 결합할 자리가 없어 원자층 증착(ALD)으로 산화막이 고르게 붙지 않고, 계면 결함과 [[전하 트랩]]이 생기기 쉽습니다. [[h-BN]]은 계면이 깨끗하지만 유전율이 SiO₂와 비슷한 수준으로 낮고 얇으면 누설이 커서 EOT를 1 nm 아래로 줄이기 어렵습니다. 따라서 EOT, 누설 전류, 결함 밀도를 함께 만족하는 dielectric이 2D 트랜지스터의 핵심 과제로 꼽힙니다(Illarionov 2020, Liu 2021, Das 2021).
