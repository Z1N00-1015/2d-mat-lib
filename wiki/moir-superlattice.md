---
title: 모아레 초격자
en: moiré superlattice
category: 결정학
status: 초안
summary: 두 주기 격자를 비틀림 또는 격자 불일치로 겹쳤을 때 생기는 장주기 구조. L = a / [2 sin(θ/2)].
chapter: materials/moire
papers: dean2013, ponomarenko2013, hunt2013, cao2018sc, andrei2020
reviewed: 2026-10-30
info:
- 정의 | 두 층의 격자 차이로 생긴 긴 주기의 초격자
- 주기(같은 격자, 회전 θ) | λ ≈ a / (2 sin(θ/2))
- 대표 계 | 그래핀/h-BN, 꼬인 이중층 그래핀, TMD 이종이중층
- 현상 | 평탄 밴드, 호프스태터 나비, 모아레 엑시톤
figures:
- 모아레 | 5
- 모아레벡터
sources:
- Hunt et al., Science (2013) | https://doi.org/10.1126/science.1237240
- Dean et al., Nature (2013) | https://doi.org/10.1038/nature12186
- Ponomarenko et al., Nature (2013) | https://doi.org/10.1038/nature12187
- Cao et al., Nature (2018) | https://doi.org/10.1038/nature26160
- Andrei & MacDonald, Nature Materials (2020) | https://doi.org/10.1038/s41563-020-00840-0
- graphene·h-BN 격자상수 | https://link.aps.org/accepted/10.1103/PhysRevB.97.205104
---
## 정의

**모아레 초격자**(moiré superlattice)는 격자상수나 방향이 조금 다른 두 원자층을 겹쳤을 때 생기는, 원래 격자보다 훨씬 큰 주기의 새로운 주기 구조입니다. 위치마다 두 층의 원자가 겹치는 방식(적층)이 서서히 바뀌어, 전자가 느끼는 퍼텐셜도 모아레 주기로 반복됩니다.

{{그림: 모아레 | 같은 육방 격자 두 장을 5° 비틀어 겹친 모습. 원자 크기 격자 위에 큰 육각형 주기가 나타납니다.}}

## 주기

- 같은 격자상수 a, 회전각 θ: λ ≈ a / (2 sin(θ/2)) ≈ a/θ (θ는 라디안)
- 회전 없이 격자상수만 δ 비율 다를 때: λ ≈ a/δ

그래핀과 h-BN은 격자상수가 약 1.8% 달라, 방향을 맞춰 쌓아도 약 14 nm 주기의 모아레가 생깁니다(Hunt 2013). 역공간에서는 두 층의 역격자 벡터 차이가 [[모아레 벡터]]입니다.

{{그림: 모아레벡터 | 두 층의 역격자 벡터 G₁, G₂의 차이 G_M이 모아레 주기를 정합니다.}}

## 나타나는 현상

- **그래핀/h-BN**: 모아레 퍼텐셜이 디랙점에 갭을 열고(Hunt 2013), 강한 자기장에서 프랙탈 에너지 스펙트럼인 호프스태터 나비가 관측되었습니다(Dean 2013, Ponomarenko 2013).
- **꼬인 이중층 그래핀**: 약 1.1°의 마법각에서 [[평탄 밴드]]가 생겨 상관 절연체와 초전도가 나타났습니다(Cao 2018, Andrei & MacDonald 2020).
- **TMD 이종이중층**: 모아레 퍼텐셜에 갇힌 [[층간 엑시톤]], 상관 절연 상태.

작은 회전각에서는 원자가 실제로 움직이는 [[원자 재구성]]이 일어나 단순한 기하 모아레와 달라집니다. 회전각은 [[상대 회전각]], 영상에 보이는 무늬는 [[모아레 프린지]]를 참고하세요.
