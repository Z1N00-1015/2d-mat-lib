---
title: 투과전자현미경
en: transmission electron microscopy, TEM
category: 분석법
status: 초안
summary: 얇은 시료를 통과하거나 회절한 전자를 이용해 국소 원자 배열과 미세 구조를 관찰하는 현미경 기법.
chapter: crystallography/tem
papers: meyer2007, huang2011, krivanek2010, zhou2013defects
reviewed: 2026-10-30
info:
- 신호 | 얇은 시료를 투과·회절한 전자
- 전자 파장 | 200 kV에서 약 2.5 pm
- 모드 | 영상(명시야·암시야·고분해능), 회절(SAED)
- 시료 두께 | 보통 100 nm 이하, 2D 물질은 단층도 가능
figures:
- tem
sources:
- Williams & Carter, Transmission Electron Microscopy, 2nd ed. (Springer, 2009)
- Meyer et al., Nature (2007) | https://doi.org/10.1038/nature05545
- Huang et al., Nature (2011) | https://doi.org/10.1038/nature09718
- Krivanek et al., Nature (2010) | https://doi.org/10.1038/nature08879
- Zhou et al., Nano Lett. (2013) | https://doi.org/10.1021/nl4007479
---
## 원리

**투과전자현미경**(transmission electron microscope, TEM)은 수십~수백 kV로 가속한 전자를 아주 얇은 시료에 통과시켜, 투과하거나 회절한 전자로 영상을 만드는 현미경입니다. 200 kV 전자의 파장은 약 2.5 pm으로 가시광선보다 십만 배 이상 짧아, 렌즈 수차만 잘 보정하면 원자 하나하나를 구분할 수 있습니다(Williams & Carter).

{{그림: tem | TEM의 기본 구조. 대물 렌즈의 뒤초점면에는 회절 무늬가, 상면에는 영상이 맺힙니다. 아래 렌즈를 어느 면에 초점을 맞추느냐에 따라 영상 모드와 회절 모드를 오갑니다.}}

## 주요 모드

- **명시야(BF) 영상**: 투과빔만 통과시켜 만든 영상. 두께·회절 조건에 따른 대비.
- **[[암시야 투과전자현미경|암시야(DF) 영상]]**: 회절빔 하나만 골라 특정 방위의 결정립만 밝게 봅니다.
- **[[고분해능 투과전자현미경|고분해능(HRTEM)]]**: 여러 빔의 간섭(위상 대비)으로 격자 무늬를 봅니다.
- **[[선택 영역 전자 회절|회절(SAED)]]**: 선택한 영역의 회절 무늬로 결정 구조·방위를 봅니다.
- 전자 탐침을 주사하는 [[주사 투과전자현미경|STEM]]과 [[에너지 분산 X선 분광법|EDS]]·[[전자 에너지 손실 분광법|EELS]] 같은 분광 분석도 같은 장비에서 합니다.

## 2D 물질에서

2D 물질은 원래 얇아서 시료를 깎아 내지 않고 TEM 그리드에 옮기기만 하면 됩니다. 떠 있는 그래핀을 기울이며 회절을 재어 표면이 약 1 nm 높이로 물결친다는 것이 밝혀졌고(Meyer 2007), DF-TEM으로 CVD 그래핀의 결정립 지도를 그렸습니다(Huang 2011). MoS₂의 점결함과 결정립계도 원자 단위로 관찰되었습니다(Zhou 2013).

## 주의할 점

전자빔이 원자를 튕겨 내는 손상(knock-on)이 있어, 가벼운 원자로 된 2D 물질은 60–80 kV처럼 낮은 가속 전압에서 관찰하기도 합니다(Krivanek 2010). 관찰하는 동안 구조가 바뀔 수 있으므로 빔 조사량을 함께 기록하는 것이 좋습니다.
