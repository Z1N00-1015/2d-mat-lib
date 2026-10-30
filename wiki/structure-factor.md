---
title: 구조 인자
en: structure factor
category: 결정학
status: 초안
summary: 단위격자 내 원자들의 산란파를 위상과 함께 합한 F_hkl = Σ fⱼ exp[2πi(hxⱼ + kyⱼ + lzⱼ)]. 회절 세기는 |F|²에 비례한다.
papers: bragg1913
reviewed: 2026-10-30
info:
- 정의
- 단위격자 안 원자들의 산란파를 위상까지 더한 값
- 식
- F_hkl = Σ f_j exp[2πi(hx_j + ky_j + lz_j)]
- 회절 세기
- I ∝ |F_hkl|²
- 쓰임
- 피크 세기 해석, 소멸 규칙, 구조 결정
figures:
- 구조인자
sources:
- Cullity & Stock, Elements of X-Ray Diffraction, 3rd ed. (Prentice Hall, 2001)
- Kittel, Introduction to Solid State Physics, 8th ed. (Wiley, 2005)
- Bragg & Bragg, Proc. R. Soc. Lond. A (1913) | https://doi.org/10.1098/rspa.1913.0040
---
## 정의

**구조 인자**(structure factor) F_hkl은 단위격자 안의 모든 원자가 (hkl) 방향으로 산란한 파동을 위상까지 고려해 더한 값입니다.

**F_hkl = Σ_j f_j exp[2πi(h x_j + k y_j + l z_j)]**

f_j는 j번째 원자의 원자 산란 인자(전자가 많을수록 큼), (x_j, y_j, z_j)는 단위격자 안의 분율 좌표입니다. 회절 세기는 I ∝ |F_hkl|²입니다(Cullity).

## 의미

[[브래그 법칙]]은 회절이 일어날 수 있는 **방향**을 정하고, 구조 인자는 그 방향의 **세기**를 정합니다. 단위격자 안 원자들의 산란파가 같은 위상으로 더해지면 강한 피크, 반대 위상으로 상쇄되면 약하거나 0이 됩니다.

{{그림: 구조인자 | 중심 직사각 단위격자는 모서리(0, 0)와 가운데(½, ½)에 같은 원자가 있습니다. 두 원자의 산란파는 h + k가 홀수일 때 반대 위상이 되어 상쇄되고, 그 회절점은 사라집니다(빈 원).}}

## 예

중심 직사각(2차원) 단위격자에서 원자가 (0, 0)과 (½, ½)에 있으면

F_hk = f[1 + exp(iπ(h + k))]

이므로 h + k가 짝수이면 2f, 홀수이면 0입니다. 3차원 체심입방은 h + k + l이 홀수, 면심입방은 h, k, l이 짝·홀수가 섞이면 0입니다(Cullity). 이렇게 사라지는 반사를 [[소멸 규칙]]이라 합니다.

## 2D 물질에서

구조 인자를 계산해 실험 회절 세기와 비교하면 원자 위치, 적층 순서, 층 사이 원자([[이온 삽입]])의 위치를 결정할 수 있습니다. 2H와 3R 같은 [[polytype]]은 일부 (hkl) 반사의 세기가 달라 XRD나 전자 회절로 구별합니다.
