---
title: 고각 환형 암시야 영상
en: high-angle annular dark-field, HAADF
category: 분석법
status: 초안
summary: 주사 투과전자현미경에서 고각 산란 전자를 환형 검출기로 모으는 영상 방식. 원자 번호에 따른 대비를 제공하지만 두께와 정렬의 영향도 받는다.
papers: krivanek2010, zhou2013defects, lin2014phase, weston2020
reviewed: 2026-10-30
info:
- 검출 각도 | 대략 50 mrad 이상의 큰 산란각
- 밝기 | 원자번호 Z에 비례해 강해짐(대략 Z^1.7–2)
- 별칭 | Z 대비 영상
- 주의 | 두께·기울기·초점에도 영향받음
figures:
- stem
sources:
- Williams & Carter, Transmission Electron Microscopy, 2nd ed. (Springer, 2009)
- Krivanek et al., Nature (2010) | https://doi.org/10.1038/nature08879
- Zhou et al., Nano Lett. (2013) | https://doi.org/10.1021/nl4007479
- Lin et al., Nat. Nanotechnol. (2014) | https://doi.org/10.1038/nnano.2014.64
---
## 정의

**고각 환형 암시야**(high-angle annular dark-field, HAADF) 영상은 [[주사 투과전자현미경|STEM]]에서 큰 각도(대략 50 mrad 이상)로 산란된 전자만 고리 모양 검출기로 모아 만든 영상입니다(Williams & Carter).

{{그림: stem | HAADF 검출기는 가장 바깥 고리로, 원자핵 가까이에서 크게 꺾인 전자를 모읍니다.}}

## 왜 원자번호에 민감한가

전자가 크게 꺾이는 것은 주로 원자핵의 양전하 가까이를 지날 때(러더퍼드 산란)이며, 그 확률은 핵의 전하, 즉 원자번호 Z가 클수록 커집니다. 그래서 HAADF 밝기는 대략 Z^1.7–2에 비례하고, 이를 **Z 대비**(Z-contrast)라 부릅니다. 회절 효과가 적어 초점이나 두께가 조금 바뀌어도 원자가 밝게 보이는 그림이 비교적 유지되므로, 영상을 직관적으로 해석할 수 있습니다.

## 2D 물질에서

- MoS₂에서 Mo 자리는 밝고 S₂ 자리는 어두워, 빠진 S나 Mo 자리에 S가 들어간 안티사이트를 밝기로 구별합니다(Zhou 2013).
- 2H와 1T 상은 S 원자 위치가 달라 HAADF 영상에서 원자 배열 모양으로 구분됩니다(Lin 2014).
- 도펀트나 무거운 흡착 원자는 주변보다 훨씬 밝아 쉽게 찾을 수 있습니다.

## 주의할 점

가벼운 원자(B, C, N)는 신호가 약해 HAADF보다 중간 각도의 [[환형 암시야 주사 투과전자현미경|ADF]]가 유리할 때가 많습니다(Krivanek 2010). 밝기로 원소를 판단할 때는 두께와 오염층의 영향을 함께 따져야 합니다.
