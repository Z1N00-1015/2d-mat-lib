---
title: 터널 자기저항
en: tunnelling magnetoresistance, TMR
category: 소자
status: 초안
summary: 터널 장벽 양쪽의 자성 상태에 따라 달라지는 터널 전류 또는 저항. 자성 터널 접합의 상태 판독에 쓰인다.
papers: yuasa2004, parkin2004, song2018, klein2018
reviewed: 2026-10-30
info:
- 정의 | 자성층 자화의 평행/반평행에 따른 터널 저항 차이
- 식 | TMR = (R_AP − R_P) / R_P
- 상온 대표값 | MgO 장벽 약 180–220%
- 2D 예 | CrI₃ 스핀 필터 접합, 저온에서 거대 TMR
figures:
- mtj
sources:
- Yuasa et al., Nature Materials (2004) | https://doi.org/10.1038/nmat1257
- Parkin et al., Nature Materials (2004) | https://doi.org/10.1038/nmat1256
- Song et al., Science (2018) | https://doi.org/10.1126/science.aar4851
- Klein et al., Science (2018) | https://doi.org/10.1126/science.aar3617
---
## 정의

**터널 자기저항**(tunnelling magnetoresistance, TMR)은 얇은 절연 장벽을 사이에 둔 두 자성층(자성 터널 접합, MTJ)에서, 두 층의 자화가 평행일 때와 반평행일 때 터널 저항이 다른 현상입니다.

**TMR = (R_AP − R_P) / R_P**

{{그림: mtj | 두 자성층의 자화가 평행(왼쪽)이면 같은 스핀의 전자가 쉽게 터널링해 저항이 낮고, 반평행(오른쪽)이면 저항이 높습니다.}}

## 원리

자성 금속에서는 위·아래 스핀 전자의 상태 수가 다릅니다. 전자는 스핀을 유지한 채 [[양자 터널링]]하므로, 두 층에서 같은 스핀의 상태가 많이 맞물리는 평행 상태에서 전류가 잘 흐릅니다. 결정질 MgO 장벽은 특정 대칭의 파동함수만 잘 통과시켜 차이를 크게 키웁니다. Fe/MgO/Fe 접합에서 상온 약 180%(Yuasa 2004), CoFe/MgO에서 상온 약 220%(Parkin 2004)가 보고되며 하드디스크 읽기 헤드와 MRAM의 바탕이 되었습니다.

## 쓰임

- **MRAM**: 자유층 자화 방향을 0/1로 저장하고 저항 차이로 읽습니다. 쓰기는 스핀 전달 토크나 [[스핀–궤도 토크]]로 합니다.
- **자기 센서·읽기 헤드**

## 2D 자성체에서

2D 자성 절연체 CrI₃를 장벽으로 쓰면, 각 층의 자화가 스핀에 따라 장벽 높이를 바꾸는 ‘스핀 필터’로 작동합니다. 층 사이 자화 배열이 자기장으로 바뀌면 터널 전류가 크게 달라져, 저온에서 수천 % 이상의 거대 TMR이 관측되었습니다(Song 2018, Klein 2018). 터널 전류로 층별 자성 배열을 읽는 방법도 됩니다.
