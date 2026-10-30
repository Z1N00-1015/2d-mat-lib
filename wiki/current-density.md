---
title: 전류 밀도
en: current density
category: 소자
status: 초안
summary: 단위 채널 폭이나 면적당 흐르는 전류. 트랜지스터 비교에서는 채널 치수와 동작 조건을 함께 확인해야 한다.
papers: liu2021prospects, desai2016, shen2021, das2021
reviewed: 2026-10-30
info:
- 정의 | 단위 면적(또는 폭)당 전류
- 3차원 도체 | J = I / A (A/cm²)
- 2D 채널 | 폭당 전류 I/W (A/m, μA/μm)
- 주의 | 단위와 정규화 기준을 반드시 확인
figures:
- 출력곡선
sources:
- Liu et al., Nature (2021) | https://doi.org/10.1038/s41586-021-03339-z
- Desai et al., Science (2016) | https://doi.org/10.1126/science.aah4698
- Shen et al., Nature (2021) | https://doi.org/10.1038/s41586-021-03472-9
- Das et al., Nature Electronics (2021) | https://doi.org/10.1038/s41928-021-00670-1
- Sze & Ng, Physics of Semiconductor Devices, 3rd ed. (Wiley, 2007)
---
## 정의

**전류 밀도**(current density)는 단위 단면적을 지나는 전류입니다. 3차원 도체에서는 J = I/A (A/cm²)이고, 미시적으로는 J = n q v (캐리어 농도 × 전하 × 속도)입니다.

## 2D 채널에서는 ‘폭당 전류’

2D 물질은 두께가 원자 몇 층이라 단면적을 정의하기 애매하므로, 채널 폭 W로 나눈 **선 전류 밀도** I/W(A/m, 흔히 μA/μm)를 씁니다. 면 캐리어 농도 n_s(cm⁻²)를 쓰면 I/W = n_s q v입니다.

{{그림: 출력곡선 | 트랜지스터 출력 곡선을 폭으로 나눠 μA/μm로 나타낸 예. 곡선 모양은 개념도입니다.}}

## 다른 쓰임

- **배선·전극**: 단위 면적 전류가 너무 크면 원자가 전자에 밀려 이동하는 전자이동(electromigration)으로 끊어집니다. 그래핀 배선 연구에서는 견딜 수 있는 최대 전류 밀도가 중요한 지표입니다.
- **수직 소자**: [[수직 이종구조]]처럼 전류가 층을 가로지르는 소자는 면적당 전류(A/cm²)를 씁니다.

## 비교할 때 주의

같은 전류 밀도라도 폭 기준인지 면적 기준인지, 채널 길이와 전압 조건이 무엇인지에 따라 값이 크게 달라집니다. 트랜지스터 성능 비교에서는 지표의 정의와 측정 조건을 맞춰야 합니다(Liu 2021, Das 2021).
