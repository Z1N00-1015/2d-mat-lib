---
title: 모아레 프린지
en: moiré fringe
category: 분석법
status: 초안
summary: 두 격자의 간섭으로 생기는 실공간 줄무늬 대비. DF-TEM에서는 선택한 회절점을 이용해 특정 방향의 fringe를 영상화할 수 있다.
papers: brown2012, yoo2019, weston2020, rosenberger2020
reviewed: 2026-10-30
info:
- 정의 | 두 격자의 간섭으로 생긴 큰 주기의 줄무늬
- 회전 모아레 주기 | λ ≈ a / (2 sin(θ/2))
- 관찰 | HRTEM·DF-TEM·STEM·STM·FFT
- 주의 | 보이는 무늬 ≠ 실제 atomic reconstruction일 수 있음
figures:
- 모아레 | 6
sources:
- Williams & Carter, Transmission Electron Microscopy, 2nd ed. (Springer, 2009)
- Brown et al., Nano Lett. (2012) | https://doi.org/10.1021/nl204547v
- Yoo et al., Nat. Mater. (2019) | https://doi.org/10.1038/s41563-019-0346-z
- Weston et al., Nat. Nanotechnol. (2020) | https://doi.org/10.1038/s41565-020-0682-9
- Rosenberger et al., ACS Nano (2020) | https://doi.org/10.1021/acsnano.0c00088
---
## 정의

**모아레 프린지**(moiré fringe)는 주기가 비슷한 두 격자를 겹쳤을 때 나타나는, 원래 격자보다 훨씬 큰 주기의 줄무늬입니다. 커튼 두 장을 겹치면 보이는 물결무늬와 같은 원리입니다.

{{그림: 모아레 | 같은 육방 격자 두 장을 6° 비틀어 겹친 모습. 원자 크기 격자 위에 훨씬 큰 육각형 무늬가 생깁니다.}}

## 주기

- **회전 모아레**: 같은 격자상수 a의 두 층이 θ만큼 비틀리면 λ ≈ a / (2 sin(θ/2)) ≈ a/θ. 각도가 작을수록 무늬가 커집니다.
- **격자 불일치 모아레**: 비틀림 없이 격자상수만 다르면(a₁, a₂) λ ≈ a₁a₂ / |a₁ − a₂|입니다. 예를 들어 그래핀/h-BN은 약 1.8% 차이로 큰 모아레가 생깁니다.

## 전자현미경에서

TEM에서는 두 층의 회절빔이 간섭해 모아레 무늬가 보입니다. [[DF-TEM|DF-TEM]]으로 특정 회절점만 고르면 그 방향의 무늬만 볼 수 있고(Brown 2012), [[FFT|FFT]]에서는 위성 점으로 나타납니다.

## 무늬와 실제 구조

‘모아레 프린지’는 영상에 보이는 대비를 뜻하고, 원자가 실제로 만드는 [[모아레 초격자]]와 구분해서 써야 합니다. 작은 각도에서는 원자가 에너지가 낮은 적층으로 움직이는 [[atomic reconstruction]]이 일어나, 균일한 모아레 대신 삼각형 [[적층 도메인]]이 생깁니다(Yoo 2019, Weston 2020, Rosenberger 2020). 이때 보이는 무늬의 모양과 주기는 단순한 기하 모아레와 다를 수 있습니다.
