---
title: 큐리 온도
en: Curie temperature, T_C
category: 물성
status: 초안
summary: 강자성체가 가열에 따라 장거리 강자성 질서를 잃는 전이 온도.
papers: huang2017, gong2017, deng2018, bonilla2018, burch2018
reviewed: 2026-10-30
info:
- 정의 | 강자성(또는 강유전성)이 사라지는 전이 온도
- 위에서 | 상자성(상유전) 상태
- 2D 예 | 단층 CrI₃ 약 45 K (bulk 약 61 K)
- 조절 | 게이트, 변형, 두께, 이방성
figures:
- 자화온도 | 큐리
sources:
- Kittel, Introduction to Solid State Physics, 8th ed. (Wiley, 2005)
- Huang et al., Nature (2017) | https://doi.org/10.1038/nature22391
- Gong et al., Nature (2017) | https://doi.org/10.1038/nature22060
- Deng et al., Nature (2018) | https://doi.org/10.1038/s41586-018-0626-9
- Bonilla et al., Nature Nanotechnology (2018) | https://doi.org/10.1038/s41565-018-0063-9
- Burch et al., Nature (2018) | https://doi.org/10.1038/s41586-018-0631-z
---
## 정의

**큐리 온도**(Curie temperature, T_C)는 강자성체가 자발 자화를 잃고 상자성체로 바뀌는 온도입니다. 강유전체에서 자발 분극이 사라지는 온도도 같은 이름으로 부릅니다.

{{그림: 자화온도 | 자발 자화는 온도가 오르면 줄어들고 T_C에서 0이 됩니다. 곡선은 개념도입니다.}}

## 무엇이 정하나

큐리 온도는 스핀을 정렬시키는 교환 에너지와 이를 흔드는 열에너지(kT)의 경쟁으로 정해집니다. 교환 상호작용이 강할수록, 이웃 수가 많을수록 T_C가 높습니다(Kittel). T_C 위에서 자화율은 퀴리–바이스 법칙 χ ∝ 1/(T − T_C)를 따릅니다.

## 2D에서 낮아지는 이유

얇아지면 이웃 원자 수가 줄고, 2차원에서는 낮은 에너지의 스핀파([[마그논]])가 쉽게 들떠 질서를 무너뜨립니다. [[자기 이방성]]이 마그논에 에너지 갭을 열어 줘야 질서가 유지됩니다.

- CrI₃: bulk 약 61 K → 단층 약 45 K (Huang 2017)
- Cr₂Ge₂Te₆: 이방성이 작아 두께가 줄면 T_C가 크게 떨어집니다(Gong 2017).

## 상온으로 올리기

실용 소자에는 상온 이상의 T_C가 필요합니다. Fe₃GeTe₂는 이온 게이트로 전자 농도를 바꿔 T_C를 상온까지 올렸고(Deng 2018), 기판 위 단층 VSe₂에서 상온 강자성이 보고되었습니다(Bonilla 2018). 측정 방법(MOKE, 홀 효과, SQUID)과 시료 조건에 따라 판정이 달라질 수 있어 여러 방법으로 교차 확인합니다(Burch 2018).
