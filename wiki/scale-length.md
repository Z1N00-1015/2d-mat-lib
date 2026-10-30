---
title: scale length
en: scale length, λ
category: 소자
status: 초안
summary: 소스·드레인 전위가 채널로 침투하는 특성 거리. L_g/λ가 클수록 게이트 제어력이 좋다.
papers: yan1992, frank2001, desai2016
reviewed: 2026-10-30
info:
- 정의 | 소스·드레인 전위가 채널로 스며드는 특성 거리 λ
- SOI 근사식 | λ = √(ε_ch · t_ch · t_ox / ε_ox)
- 설계 기준 | L_g / λ가 클수록 단채널 효과 작음
- 2D 채널 | t_ch < 1 nm → λ 작음
figures:
- 장벽
sources:
- Yan et al., IEEE Trans. Electron Devices (1992) | https://doi.org/10.1109/16.141237
- Frank et al., Proc. IEEE (2001) | https://doi.org/10.1109/5.915374
- Desai et al., Science (2016) | https://doi.org/10.1126/science.aah4698
- Liu et al., Nature (2021) | https://doi.org/10.1038/s41586-021-03339-z
---
## 정의

**scale length** λ는 소스와 드레인의 전위가 채널 안으로 지수적으로 스며드는 특성 거리입니다. 채널 위치 x에서 소스 쪽 영향은 대략 exp(−x/λ)로 줄어듭니다. 게이트 길이 L_g가 λ보다 충분히 길면 채널 가운데는 게이트만의 영향 아래 있어 [[단채널 효과]]가 작습니다.

{{그림: 장벽 | 왼쪽은 L_g ≫ λ로 장벽이 평평하게 유지되고, 오른쪽은 L_g가 λ에 가까워 소스·드레인 전위가 장벽을 깎습니다.}}

## 식

얇은 채널(SOI) 소자에서 근사적으로

**λ = √(ε_ch · t_ch · t_ox / ε_ox)**

입니다(Yan 1992). t_ch는 채널 두께, t_ox는 gate dielectric 두께, ε은 각각의 유전율입니다. 게이트가 채널을 여러 면에서 감쌀수록 λ는 더 작아집니다. 보통 L_g/λ가 대략 5 이상이 되도록 설계합니다(Frank 2001).

## λ를 줄이는 방법

1. **채널을 얇게** (t_ch↓): 실리콘은 수 nm 이하로 얇아지면 표면 거칠기 산란으로 이동도가 크게 떨어집니다.
2. **dielectric을 얇게 또는 고유전율로** (t_ox/ε_ox↓): [[EOT]]를 줄입니다.
3. **게이트 구조**: 단일 게이트 → 이중 게이트 → FinFET → 게이트 올 어라운드.

## 2D 채널의 의미

단층 TMD는 t_ch가 1 nm 이하이고 표면에 댕글링 본드가 없어 얇아도 이동도 저하가 덜합니다. 그래서 λ가 아주 작아 극단적으로 짧은 게이트에서도 게이트 제어가 유지됩니다(Desai 2016, Liu 2021).
