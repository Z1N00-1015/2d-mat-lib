---
title: 이동도
en: carrier mobility, μ
aliases: mobility, carrier mobility
category: 소자
status: 초안
summary: 전기장이 캐리어의 평균 이동 속도를 얼마나 잘 유도하는지 나타내며, FET 성능을 이해할 때 자주 쓰는 수송 지표.
related: 접촉 저항, 유효 질량, MoS₂
chapter: semiconductor/materials
papers: zhu2014mobility, fuhrer2013mobility, radisavljevic2011, kang2015
reviewed: 2026-10-30
figures:
- 이동도
sources:
- Zhu et al., Nature Communications (2014) | https://doi.org/10.1038/ncomms4087
- Fuhrer & Hone, Nature Nanotechnology (2013) | https://doi.org/10.1038/nnano.2013.30
- Two- and four-probe field-effect and Hall mobilities in transition metal dichalcogenide field-effect transistors, RSC Advances (2016) | https://doi.org/10.1039/C6RA14638D
- Radisavljevic et al., Nature Nanotechnology (2011) | https://doi.org/10.1038/nnano.2010.279
---
## 정의와 중요성

이동도(mobility, μ)는 전기장 E를 가했을 때 캐리어가 얻는 평균 drift velocity v<sub>d</sub>의 비례 계수입니다. v<sub>d</sub> = μE로 나타내며, 단위는 보통 cm²/(V·s)입니다. 같은 전하 밀도와 전기장이라면 이동도가 큰 재료에서 캐리어가 더 잘 이동합니다.

FET에서는 이동도가 채널 전류와 transconductance에 영향을 줍니다. 다만 높은 이동도만으로 빠르고 효율적인 소자가 보장되지는 않습니다. [[접촉 저항]], gate dielectric, on/off ratio, subthreshold swing, 채널 크기와 측정 조건도 함께 살펴야 합니다.

## FET에서 추출하는 field-effect mobility

낮은 drain bias의 선형 영역에서 채널 길이 L, 폭 W, gate capacitance per area C<sub>g</sub>를 알면 전달 곡선 기울기 g<sub>m</sub> = dI<sub>D</sub>/dV<sub>G</sub>로 field-effect mobility를 추정할 수 있습니다.

μ<sub>FE</sub> = (L / W C<sub>g</sub> V<sub>DS</sub>) × (dI<sub>D</sub> / dV<sub>G</sub>)

두 단자 측정값에는 채널뿐 아니라 금속–반도체 접촉의 전압 강하도 포함될 수 있습니다. 유효한 비교를 위해서는 C<sub>g</sub> 산정, 측정 온도, V<sub>DS</sub>, 캐리어 밀도와 접촉 구조를 함께 기록해야 합니다.

## 측정 방법

- **FET transfer 특성**: gate voltage에 따른 drain current 기울기에서 μ<sub>FE</sub>를 계산합니다. 비교적 간단하지만, 접촉 저항과 gate capacitance의 오차에 영향을 받습니다.
- **Hall 측정**: 수직 자기장에서 생기는 Hall voltage로 sheet carrier density와 Hall coefficient를 구하고, 면전도도 σ를 이용해 μ<sub>H</sub> = |R<sub>H</sub>|σ를 계산합니다. 다중 캐리어 수송이나 불균일한 시료에서는 해석이 복잡해질 수 있습니다.
- **4단자 수송 측정**: 바깥 단자로 전류를 흘리고 안쪽 전압 단자로 채널 전압을 읽어 접촉에서 생기는 전압 강하를 줄입니다. 채널 전도도와 캐리어 밀도 추정이 필요합니다.
- **Transmission line method (TLM)**: 채널 길이가 다른 FET들의 total resistance를 비교해 contact resistance를 추정합니다. 이동도를 직접 재는 방법은 아니지만, 두 단자 μ<sub>FE</sub>에 접촉이 미치는 영향을 분리할 때 유용합니다.

{{그림: 이동도 | FET 기울기, Hall 효과, 4단자 측정의 관계를 비교합니다.}}

## 상용 수준에서 어떻게 볼까

이동도에 공통으로 적용되는 단일한 상용 합격선은 없습니다. 특정 응용의 회로 속도·전력·전압 조건과 소자 구조에 따라 필요한 값이 달라집니다. 예를 들어 Zhu 등은 CVD 단층 MoS₂ 연구에서 display와 photodetection 같은 기초 응용을 논의하며 30 cm²/(V·s)보다 큰 이동도를 응용 기준의 한 사례로 들었습니다. 이 값은 모든 제품이나 logic FET에 적용되는 표준값은 아닙니다.

상용 가능성을 판단할 때는 이동도와 함께 접촉 저항, on/off ratio, 동작 전압, 소자 간 편차, 장기 안정성, wafer-scale 공정의 균일성을 살펴야 합니다. 논문 간 이동도 비교에서는 측정 방식과 시료 조건이 같은지 먼저 확인합니다.
