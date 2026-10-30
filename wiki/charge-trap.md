---
title: 전하 트랩
en: charge trap
category: 소자
status: 초안
summary: 결함이나 계면 상태가 전하를 붙잡아 두는 현상 또는 그 상태. 문턱전압 이동과 히스테리시스의 원인이 될 수 있다.
papers: illarionov2020, radisavljevic2011, liu2021prospects, das2021
reviewed: 2026-10-30
info:
- 정의 | 결함·계면 상태가 전하를 붙잡는 현상(상태)
- 위치 | dielectric 속, 채널–dielectric 계면, 흡착물
- 증상 | 히스테리시스, 문턱전압 이동(BTI), 1/f 잡음
- 이력 방향(n형) | 전자 트랩 → 시계 방향
figures:
- 이력방향
sources:
- Illarionov et al., Nature Communications (2020) | https://doi.org/10.1038/s41467-020-16640-8
- Radisavljevic et al., Nature Nanotechnology (2011) | https://doi.org/10.1038/nnano.2010.279
- Liu et al., Nature (2021) | https://doi.org/10.1038/s41586-021-03339-z
- Das et al., Nature Electronics (2021) | https://doi.org/10.1038/s41928-021-00670-1
---
## 정의

**전하 트랩**(charge trap)은 결함이나 계면 상태가 전자나 정공을 붙잡아 일정 시간 가둬 두는 현상, 또는 그런 상태 자체를 말합니다. 트랩에 갇힌 전하는 게이트 전압을 가리거나 보태 트랜지스터의 문턱전압을 바꿉니다.

## 어디에 있나

- **gate dielectric 속 결함**: 산소 빈자리 같은 점결함(경계 트랩)
- **채널–dielectric 계면**: 깨진 결합, 거친 계면
- **표면 흡착물**: 2D 채널 위의 물·산소 분자, 공정 잔여물
- **채널 자체의 결함**: TMD의 칼코겐 빈자리

2D 채널은 표면 전체가 계면이라 이런 영향이 특히 큽니다.

## 나타나는 현상

- **히스테리시스**: 게이트 전압을 올릴 때와 내릴 때 전달 곡선이 다릅니다.
- **바이어스 온도 불안정(BTI)**: 오래 전압을 걸어 두면 문턱전압이 서서히 이동합니다.
- **잡음**: 전하가 붙잡히고 풀리며 전류가 요동칩니다(1/f 잡음).

{{그림: 이력방향 | n형 채널에서 양의 게이트 전압 동안 전자가 트랩에 붙잡히면 역방향 곡선이 오른쪽으로 밀려 시계 방향 이력이 생깁니다(왼쪽). 강유전 분극에 의한 이력은 반대(반시계) 방향입니다(오른쪽).}}

## 2D 소자에서의 의미

초기 단층 MoS₂ 트랜지스터부터 이력과 문턱전압 이동이 보고되었고(Radisavljevic 2011), dielectric과 계면의 트랩 밀도는 2D 트랜지스터의 신뢰성을 가로막는 큰 문제로 꼽힙니다(Illarionov 2020, Liu 2021). 결함이 적은 dielectric, 진공·encapsulation treatment, 계면 세정으로 줄입니다. [[강유전체 전계효과 트랜지스터|강유전 메모리]]를 평가할 때는 트랩에 의한 이력을 분극 효과로 착각하지 않도록 이력 방향과 속도 의존성을 확인해야 합니다.
