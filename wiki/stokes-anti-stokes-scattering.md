---
title: Stokes/anti-Stokes 산란
en: Stokes / anti-Stokes scattering
category: 분석법
status: 초안
summary: 광자가 진동계에 에너지를 주거나(Stokes) 이미 들뜬 진동계에서 에너지를 얻어(anti-Stokes) 산란되는 과정.
papers: raman1928, malard2009, ferrari2013
reviewed: 2026-10-30
info:
- 스토크스 | 포논을 만들며 에너지를 잃음(낮은 에너지로 산란)
- 반스토크스 | 포논을 흡수하며 에너지를 얻음
- 세기 비 | I_aS / I_S ∝ exp(−ħω / kT)
- 응용 | 국소 온도 측정
figures:
- 라만준위
- 라만대칭 | 384:0.8:E′, 404:1:A₁′
sources:
- Raman & Krishnan, Nature (1928) | https://doi.org/10.1038/121501c0
- Malard et al., Physics Reports (2009) | https://doi.org/10.1016/j.physrep.2009.02.003
- Ferrari & Basko, Nature Nanotechnology (2013) | https://doi.org/10.1038/nnano.2013.46
- Kittel, Introduction to Solid State Physics, 8th ed. (Wiley, 2005)
---
## 정의

라만 산란에는 두 종류가 있습니다.

- **스토크스**(Stokes) 산란: 빛이 진동([[포논]]) 하나를 만들어 주고, 그만큼 에너지를 잃은 빛이 나옵니다.
- **반스토크스**(anti-Stokes) 산란: 이미 진동하고 있던 상태에서 진동 하나를 흡수해, 그만큼 에너지를 얻은 빛이 나옵니다.

{{그림: 라만준위 | 스토크스는 바닥 상태에서 출발해 진동 들뜬 상태로 끝나고, 반스토크스는 진동 들뜬 상태에서 출발해 바닥 상태로 끝납니다.}}

## 세기 차이와 온도

반스토크스는 처음부터 진동이 들떠 있어야 일어나므로, 그 확률은 들뜬 진동의 수(볼츠만 분포)에 비례합니다. 그래서

**I_aS / I_S ∝ exp(−ħω / kT)**

입니다. 상온(kT ≈ 26 meV)에서 50 meV(약 404 cm⁻¹) 진동이라면 반스토크스는 스토크스의 약 15% 수준이고, 진동 에너지가 클수록 더 약해집니다. 그래서 대부분의 라만 측정은 스토크스 쪽을 봅니다.

{{그림: 라만대칭 | 양쪽 피크의 이동량은 같고, 반스토크스 쪽 세기는 300 K 볼츠만 인자로 줄여 그렸습니다.}}

## 응용: 온도 재기

같은 피크의 반스토크스/스토크스 비를 재면 위 식으로 레이저가 비추는 곳의 국소 온도를 구할 수 있습니다. 레이저 가열이나 소자 동작 중 발열을 확인하는 데 쓰입니다. 다만 공명 조건에서는 두 쪽의 산란 효율이 달라 보정이 필요합니다(Ferrari & Basko 2013, Malard 2009).
