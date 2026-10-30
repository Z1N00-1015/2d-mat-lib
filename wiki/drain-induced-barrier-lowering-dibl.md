---
title: DIBL
en: drain-induced barrier lowering, DIBL
category: 소자
status: 초안
summary: 드레인 전압이 소스–채널 퍼텐셜 장벽을 낮춰 문턱전압이 감소하는 현상(mV/V).
papers: desai2016, frank2001, yan1992, liu2021prospects
reviewed: 2026-10-30
info:
- 정의 | 드레인 전압에 의한 소스 쪽 장벽 감소
- 지표 | DIBL = −ΔV_th / ΔV_D (mV/V)
- 커지는 조건 | 짧은 채널, 두꺼운 채널·dielectric
- 영향 | 꺼짐 누설 증가, 출력 저항 감소
figures:
- 전달곡선 | dibl
- 장벽
sources:
- Yan et al., IEEE Trans. Electron Devices (1992) | https://doi.org/10.1109/16.141237
- Frank et al., Proc. IEEE (2001) | https://doi.org/10.1109/5.915374
- Desai et al., Science (2016) | https://doi.org/10.1126/science.aah4698
- Liu et al., Nature (2021) | https://doi.org/10.1038/s41586-021-03339-z
- Sze & Ng, Physics of Semiconductor Devices, 3rd ed. (Wiley, 2007)
---
## 정의

**DIBL**(drain-induced barrier lowering)는 드레인 전압을 높였을 때 소스와 채널 사이의 퍼텐셜 장벽이 낮아져 문턱전압이 줄어드는 현상입니다. 대표적인 [[단채널 효과]]입니다.

{{그림: 전달곡선 | 같은 소자에서 드레인 전압을 높이면(빨강) 전달 곡선이 왼쪽으로 이동합니다. 이동량을 드레인 전압 차로 나눈 값이 DIBL입니다.}}

## 계산

DIBL = −(V_th,높은 V_D − V_th,낮은 V_D) / (V_D,높음 − V_D,낮음)

단위는 mV/V입니다. 같은 전류 기준(예: 일정 전류법)으로 두 문턱전압을 정해야 합니다.

## 왜 생기나

긴 채널에서는 장벽 높이를 게이트가 정합니다. 채널이 짧으면 드레인 쪽 전기장이 채널 깊숙이 들어와 소스 쪽 장벽까지 끌어내립니다.

{{그림: 장벽 | 짧은 채널(오른쪽)에서는 드레인 전압을 올리면(빨강) 소스 쪽 장벽 꼭대기까지 낮아집니다.}}

## 줄이는 방법과 2D 소자

[[scale length]]를 줄이면 DIBL이 줄어듭니다. 채널을 얇게, gate dielectric을 얇게(또는 [[EOT|EOT]]를 작게), 게이트가 채널을 감싸게 하면 됩니다(Yan 1992, Frank 2001). 원자층 채널은 이 점에서 유리해, 매우 짧은 게이트 길이에서도 비교적 작은 DIBL이 보고됩니다(Desai 2016, Liu 2021).

DIBL이 크면 회로에서 꺼짐 누설이 드레인 전압에 따라 크게 변하고 증폭기의 출력 저항이 낮아집니다.
