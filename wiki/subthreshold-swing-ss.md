---
title: subthreshold swing
en: subthreshold swing, SS
category: 소자
status: 초안
summary: 문턱전압 이하에서 드레인 전류를 10배 변화시키는 데 필요한 게이트 전압. 상온 이론 한계 ≈ 60 mV/dec.
papers: sarkar2015, si2018ncfet, ionescu2011, salahuddin2008
reviewed: 2026-10-30
info:
- 정의 | I_D를 10배 바꾸는 데 필요한 게이트 전압
- 이론 하한(300 K, MOSFET) | 약 60 mV/dec = (kT/q)·ln10
- 작을수록 | 낮은 전압·낮은 누설로 스위칭
- 넘는 방법 | tunnel FET, NCFET
figures:
- 전달곡선
sources:
- Sze & Ng, Physics of Semiconductor Devices, 3rd ed. (Wiley, 2007)
- Sarkar et al., Nature (2015) | https://doi.org/10.1038/nature15387
- Si et al., Nature Nanotechnology (2018) | https://doi.org/10.1038/s41565-017-0010-1
- Ionescu & Riel, Nature (2011) | https://doi.org/10.1038/nature10679
- Salahuddin & Datta, Nano Letters (2008) | https://doi.org/10.1021/nl071804g
- Desai et al., Science (2016) | https://doi.org/10.1126/science.aah4698
---
## 정의

**subthreshold swing**(subthreshold swing, SS)은 트랜지스터가 꺼진 상태에서 켜지는 사이(문턱전압 아래)에서 드레인 전류를 10배 늘리는 데 필요한 게이트 전압입니다.

**SS = dV_G / d(log₁₀ I_D)** (단위 mV/dec)

{{그림: 전달곡선 | 로그 눈금의 전달 곡선에서 문턱전압 아래 구간의 기울기가 SS입니다. 가파를수록(SS가 작을수록) 같은 전압 변화로 전류를 더 크게 바꿉니다.}}

## 60 mV/dec의 한계

일반 MOSFET에서 문턱전압 아래 전류는 소스의 전자가 장벽을 열에너지로 넘어오는 것이라, 전자의 에너지 분포(볼츠만 꼬리)를 따릅니다. 그 결과

SS = (kT/q) · ln10 · (1 + C_d/C_ox) ≥ 약 60 mV/dec (300 K)

가 됩니다(Sze). 괄호 안 값이 1에 가까울수록, 즉 게이트가 채널을 완벽하게 잡을수록 60 mV/dec에 가까워집니다.

## 왜 중요한가

공급 전압을 낮춰 전력을 줄이려면, 켜짐 전류를 유지한 채 꺼짐 전류도 충분히 작아야 합니다. SS가 60 mV/dec에 묶이면 on/off 비 10⁶을 얻는 데 최소 0.36 V가 필요해 전압을 더 낮추기 어렵습니다.

## 2D 소자에서

- 원자층 채널은 게이트 제어가 좋아 짧은 채널에서도 SS가 이론값에 가깝게 유지됩니다. 게이트 길이 1 nm MoS₂ 트랜지스터에서도 약 65 mV/dec가 보고되었습니다(Desai 2016).
- **터널 FET**: 장벽을 넘는 대신 밴드 사이를 터널링해 볼츠만 꼬리를 잘라 냅니다. MoS₂/Ge 터널 FET에서 60 mV/dec보다 작은 SS가 여러 자릿수에 걸쳐 관측되었습니다(Sarkar 2015, Ionescu 2011).
- **[[NCFET]]**: 강유전체로 채널 전압을 증폭해 SS를 낮춥니다(Salahuddin & Datta 2008, Si 2018).

측정할 때는 전류 몇 자릿수 구간에서 구했는지, 이력(정방향/역방향)이 있는지 함께 밝혀야 공정하게 비교할 수 있습니다.
