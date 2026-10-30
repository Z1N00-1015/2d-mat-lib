---
title: 고분해능 투과전자현미경
en: high-resolution transmission electron microscopy, HRTEM
category: 분석법
status: 초안
summary: 투과파와 회절파의 간섭으로 생긴 위상 대비를 이용해 국소 격자 무늬와 원자 배열을 관찰하는 방법.
papers: meyer2007, huang2011, lin2014phase
reviewed: 2026-10-30
info:
- 대비 원리 | 투과파와 회절파의 간섭(위상 대비)
- 보이는 것 | 격자 무늬(lattice fringe), 원자 기둥
- 분석 | FFT로 면간 거리·방위 측정
- 주의 | 초점·두께에 따라 원자가 밝게도 어둡게도 보임
figures:
- fft
sources:
- Williams & Carter, Transmission Electron Microscopy, 2nd ed. (Springer, 2009)
- Meyer et al., Nature (2007) | https://doi.org/10.1038/nature05545
- Huang et al., Nature (2011) | https://doi.org/10.1038/nature09718
- Lin et al., Nat. Nanotechnol. (2014) | https://doi.org/10.1038/nnano.2014.64
---
## 원리

**고분해능 TEM**(HRTEM)은 시료를 지난 투과파와 여러 회절파를 대물 조리개 안에 함께 통과시켜, 이들이 간섭하며 만드는 무늬로 격자를 보는 방법입니다. 얇은 시료는 전자의 세기보다 위상을 바꾸므로 이를 **위상 대비**(phase contrast)라 합니다. 결과로 결정면 간격과 같은 주기의 줄무늬(격자 무늬)나 원자 기둥 배열이 보입니다.

{{그림: fft | 주기적인 격자 영상(왼쪽)을 푸리에 변환하면 격자 주기와 방향을 나타내는 점 무늬(오른쪽)가 생깁니다. HRTEM 영상의 면간 거리와 방위는 보통 이렇게 측정합니다.}}

## 읽는 법

- 격자 무늬 간격을 재면 [[면간 거리]]를 얻고, [[밀러 지수]]와 대응시켜 결정면을 정합니다.
- 영상의 [[고속 푸리에 변환|FFT]]는 [[선택 영역 전자 회절|회절 무늬]]와 비슷한 점 무늬를 보여 주어 방위와 결정성을 빠르게 확인할 수 있습니다.
- 육방정 2D 물질을 위에서 보면 육각형 배열이, 옆(단면)에서 보면 층 간격의 줄무늬가 보입니다.

## 해석할 때 주의

위상 대비는 초점과 두께, 렌즈 수차에 따라 바뀌어, 같은 원자가 밝게도 어둡게도 보일 수 있습니다. 원자 위치를 정확히 말하려면 영상 시뮬레이션과 비교하거나 [[고각 환형 암시야 영상|HAADF-STEM]]을 함께 씁니다(Williams & Carter). 단층 그래핀처럼 가벼운 원자로 된 시료는 대비가 약하고 빔 손상에 민감합니다.

## 2D 물질 연구 예

떠 있는 그래핀의 층수와 가장자리 구조(Meyer 2007), 그래핀 결정립계의 오각형–칠각형 배열(Huang 2011), MoS₂ 상전이 경계(Lin 2014) 등이 고분해능 영상으로 관찰되었습니다.
