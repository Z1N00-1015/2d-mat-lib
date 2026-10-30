---
title: monolithic 3D integration
en: monolithic 3D integration
category: 소자
status: 초안
summary: 같은 기판 위에서 소자층과 연결 배선을 순차적으로 형성해 회로층을 수직으로 쌓는 집적 방식. 층간 연결을 짧게 하고 면적당 기능을 높일 수 있지만, 아래층 소자가 견딜 수 있는 thermal budget과 공정 호환성이 중요하다.
papers: moon2025, jayachandran2024, akinwande2019, das2021
reviewed: 2026-10-30
info:
- 방식 | 한 웨이퍼 위에 소자층을 순서대로 직접 쌓음
- 장점 | 층간 연결이 짧고 촘촘함
- 핵심 제약 | 위층 공정의 thermal budget(아래층 보호)
- 2D 소자의 장점 | 저온 공정·전사, 원자층 두께
figures:
- 3d집적
sources:
- Jayachandran et al., Nature (2024) | https://doi.org/10.1038/s41586-023-06860-5
- Moon et al., Nature (2025) | https://doi.org/10.1038/s41586-024-08492-9
- Akinwande et al., Nature (2019) | https://doi.org/10.1038/s41586-019-1573-9
- Das et al., Nature Electronics (2021) | https://doi.org/10.1038/s41928-021-00670-1
---
## 정의

**monolithic 3D integration**(monolithic 3D integration)은 하나의 웨이퍼 위에 트랜지스터층과 배선층을 만든 뒤, 그 위에 다음 소자층을 직접 만들어 수직으로 쌓는 방식입니다. 완성된 칩을 따로 만들어 붙이는 방식(칩 적층, TSV)과 달리 층 사이 연결을 트랜지스터 크기 수준으로 작고 촘촘하게 만들 수 있습니다.

{{그림: 3d집적 | 실리콘 회로(1층)와 배선층 위에 2D 트랜지스터층(2층)을 만들고 짧은 비아로 연결합니다. 위층을 만들 때 열이 아래층에 전달되므로 온도 제한이 있습니다.}}

## 장점

- 같은 면적에 더 많은 기능을 담습니다.
- 층 사이 배선이 짧아 지연과 전력이 줄어듭니다.
- 논리·메모리·센서를 층별로 나눠 쌓을 수 있습니다.

## 가장 큰 제약: thermal budget

위층 소자를 만드는 동안 아래층 트랜지스터와 배선이 손상되지 않아야 하므로, 위층 공정 온도는 대략 400–450 °C 이하로 제한됩니다([[thermal budget]], Akinwande 2019). 실리콘을 위층에 새로 키우려면 훨씬 높은 온도가 필요해 어렵습니다.

## 2D 물질이 주목받는 이유

- 원자층 두께라 층을 쌓아도 전체가 얇습니다.
- 다른 곳에서 키운 막을 옮겨 붙이거나 낮은 온도에서 성장할 수 있습니다.
- 얇아도 이동도를 유지합니다.

2D 트랜지스터를 여러 층으로 쌓은 monolithic 3D integration이 시연되었고(Jayachandran 2024), 웨이퍼 규모 단결정 TMD를 400 °C 수준의 황화로 얻는 하이포택시도 이런 저온 공정을 겨냥합니다(Moon 2025, DB).
