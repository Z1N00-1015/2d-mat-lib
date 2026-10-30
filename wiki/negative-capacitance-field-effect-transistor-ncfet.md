---
title: NCFET
en: negative-capacitance field-effect transistor, NCFET
category: 소자
status: 초안
summary: 강유전체의 음의 정전용량 효과를 이용해 채널 내부 전압을 증폭하고 낮은 전압 동작을 연구하는 FET 구조. 실제 성능은 재료와 적층 설계에 좌우된다.
papers: salahuddin2008, si2018ncfet, boscke2011
reviewed: 2026-10-30
info:
- 원리 | 강유전체의 음의 정전용량으로 채널 전압 증폭
- 목표 | SS < 60 mV/dec, 낮은 공급 전압
- 조건 | 강유전체·트랜지스터 정전용량 정합
- 주의 | 이력 없이 안정하게 동작해야 함
figures:
- 이중우물
- 전달곡선
sources:
- Salahuddin & Datta, Nano Letters (2008) | https://doi.org/10.1021/nl071804g
- Si et al., Nature Nanotechnology (2018) | https://doi.org/10.1038/s41565-017-0010-1
- Böscke et al., Appl. Phys. Lett. (2011) | https://doi.org/10.1063/1.3634052
- Sze & Ng, Physics of Semiconductor Devices, 3rd ed. (Wiley, 2007)
---
## 아이디어

**NCFET**(negative-capacitance field-effect transistor)는 게이트 적층에 강유전체를 직렬로 넣어, 강유전체가 ‘음의 정전용량’처럼 동작하는 영역을 이용해 채널에 걸리는 전압을 게이트 전압보다 크게 만드는 트랜지스터입니다(Salahuddin & Datta 2008). 내부 전압이 증폭되면 [[subthreshold swing]]이 60 mV/dec 한계보다 작아질 수 있습니다.

## 음의 정전용량이란

강유전체의 자유 에너지 U를 분극 P에 대해 그리면 두 우물 모양입니다. 정전용량은 곡률의 역수(C⁻¹ ∝ d²U/dP²)에 비례하므로, 가운데처럼 곡률이 음수인 영역에서는 정전용량이 음수가 됩니다. 이 영역은 혼자서는 불안정하지만, 양의 정전용량을 가진 트랜지스터와 직렬로 연결하면 전체 계가 안정해질 수 있습니다.

{{그림: 이중우물 | 강유전체 자유 에너지의 이중 우물(왼쪽)과 직렬 연결된 강유전체·트랜지스터 정전용량(오른쪽). 가운데 음의 곡률 영역을 안정하게 쓰는 것이 핵심입니다.}}

## 증폭 조건

직렬 정전용량에서 채널 쪽 전압 증폭률은 대략 |C_FE| / (|C_FE| − C_MOS)이고, 두 값이 잘 맞으면(|C_FE|가 C_MOS보다 약간 클 때) 증폭이 크면서 이력이 없습니다. 맞지 않으면 강유전체가 분극을 뒤집으며 이력(메모리 동작)이 생깁니다.

{{그림: 전달곡선 | SS가 작을수록(가파를수록) 같은 게이트 전압 변화로 전류를 크게 바꿉니다. NCFET는 실선처럼 60 mV/dec보다 가파른 기울기를 목표로 합니다.}}

## 2D 소자에서

HfO₂ 계열 강유전체(Böscke 2011)를 MoS₂ 채널과 결합해, 60 mV/dec보다 가파른 SS를 정방향·역방향 모두 이력 없이 보인 연구가 있습니다(Si 2018). 다만 측정 속도에 따른 과도 효과, 결함·전하 트랩의 영향을 구별해야 하며, 실제 이득은 재료와 적층 설계에 크게 좌우됩니다.
