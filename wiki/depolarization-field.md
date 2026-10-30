---
title: 탈분극장
en: depolarization field
category: 물성
status: 초안
summary: 분극 표면 전하가 충분히 차폐되지 않을 때 분극을 약화시키는 내부 전기장. 얇은 강유전체의 안정성에 영향을 준다.
papers: junquera2003, liu2016cips, chang2016, wu2021sliding
reviewed: 2026-10-30
info:
- 정의 | 분극된 막의 표면 속박 전하가 만드는 반대 방향 전기장
- 크기(가림 없음) | E_d ≈ −P/ε₀ε (막에 수직 분극)
- 영향 | 분극 억제, 임계 두께, 도메인 형성
- 줄이는 법 | 전극·자유 전하로 가림, 면내 분극
figures:
- 탈분극
sources:
- Lines & Glass, Principles and Applications of Ferroelectrics and Related Materials (Oxford, 1977)
- Junquera & Ghosez, Nature (2003) | https://doi.org/10.1038/nature01501
- Liu et al., Nature Communications (2016) | https://doi.org/10.1038/ncomms12357
- Chang et al., Science (2016) | https://doi.org/10.1126/science.aad8609
- Wu & Li, PNAS (2021) | https://doi.org/10.1073/pnas.2115703118
---
## 정의

**탈분극장**(depolarization field, E_d)은 분극된 물질의 표면에 나타난 속박 전하가 만드는, 분극과 반대 방향의 전기장입니다. 이름처럼 분극을 약하게 만드는 쪽으로 작용합니다.

{{그림: 탈분극 | 왼쪽: 막에 수직한 분극 P는 위아래 표면에 +, − 속박 전하를 만들고, 이 전하가 반대 방향의 탈분극장 E_d를 만듭니다. 오른쪽: 양면 전극의 자유 전하가 속박 전하를 상쇄하면 탈분극장이 크게 줄어듭니다.}}

## 크기

막에 수직한 분극 P를 전혀 가리지 않으면 E_d ≈ −P/(ε₀ε)로, 일반 강유전체의 분극 값이면 분극을 유지할 수 없을 만큼 큽니다. 실제로는 전극이나 주변의 자유 전하가 속박 전하를 가리는데, 금속 전극도 완벽하게 가리지 못해 계면에 얇은 ‘가리기 길이’만큼 남은 전기장이 생깁니다.

## 얇은 막의 임계 두께

막이 얇을수록 남은 탈분극장의 영향이 상대적으로 커집니다. 실제 전극을 넣은 계산에서 BaTiO₃ 박막은 약 6 단위격자(약 2.4 nm) 아래에서 강유전성이 사라졌습니다(Junquera & Ghosez 2003). 탈분극장을 피하려고 분극이 위아래로 번갈아 놓인 도메인 구조가 생기기도 합니다.

## 2D 강유전체에서

- **면내 분극**: 분극이 층 안을 향하면 위아래 표면에 속박 전하가 생기지 않아 탈분극장 문제가 작습니다. 원자 한 단위 두께 SnTe의 면내 강유전성(Chang 2016)이 그런 예입니다.
- **면외 분극**: 원자층 CuInP₂S₆는 약 4 nm에서도 면외 분극이 유지되었습니다(Liu 2016).
- **미끄럼 강유전성**: 층 사이 전하 이동이 작은 분극을 만들며, 탈분극 효과와 함께 해석해야 합니다(Wu & Li 2021).
