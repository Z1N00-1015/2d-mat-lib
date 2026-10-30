---
title: 잔류 분극
en: remanent polarization
category: 물성
status: 초안
summary: 분극을 바꾸는 전기장을 제거한 뒤에도 물질에 남아 있는 분극. 비휘발성 강유전 메모리의 정보 상태에 해당한다.
papers: liu2016cips, boscke2011, si2019
reviewed: 2026-10-30
info:
- 정의 | 전기장을 0으로 되돌렸을 때 남는 분극
- 기호 | P_r (±P_r 두 상태)
- 의미 | 비휘발성 메모리의 저장 신호 크기
- 측정 | P–E 이력(양전하 측정, PUND)
figures:
- pe
sources:
- Lines & Glass, Principles and Applications of Ferroelectrics and Related Materials (Oxford, 1977)
- Liu et al., Nature Communications (2016) | https://doi.org/10.1038/ncomms12357
- Böscke et al., Appl. Phys. Lett. (2011) | https://doi.org/10.1063/1.3634052
- Si et al., Nature Electronics (2019) | https://doi.org/10.1038/s41928-019-0338-7
---
## 정의

**잔류 분극**(remanent polarization, P_r)은 강유전체에 전기장을 걸어 분극을 한쪽으로 정렬시킨 뒤 전기장을 0으로 되돌렸을 때 남아 있는 분극입니다. 반대 방향으로 정렬시켰다 끄면 −P_r이 남으므로, 두 상태가 0과 1의 정보가 됩니다.

{{그림: pe | P–E 이력 곡선에서 전기장 축(E = 0)과 만나는 두 점이 +P_r, −P_r입니다. 항전기장 ±E_c를 넘어야 분극이 뒤집힙니다.}}

## 측정

축전기 구조의 강유전체에 삼각파·사각파 전압을 걸고 흐르는 전하를 적분해 P–E 곡선을 얻습니다. 누설 전류나 유전 응답이 섞이면 곡선이 부풀어 P_r이 과대평가되므로, 분극이 뒤집힐 때와 아닐 때의 전류 차이만 골라내는 펄스 측정(PUND)을 함께 씁니다(Lines & Glass).

## 메모리에서의 의미

- P_r이 클수록 두 상태의 신호 차이가 커져 읽기 쉽습니다([[memory window]]).
- 시간이 지나며 P_r이 줄어드는 정도가 [[잔류 시간]]을 정합니다.
- 반복해서 쓰면 P_r이 줄어드는 피로, 처음에 늘어나는 각성(wake-up) 현상이 있습니다.

## 예

HfO₂ 계열 박막(약 10 nm)은 실리콘 공정에 맞으면서 충분한 P_r을 보여 FeFET에 쓰입니다(Böscke 2011). 2D 층상 강유전체 CuInP₂S₆는 원자층 두께에서도 이력 곡선을 보였고(Liu 2016), α-In₂Se₃ 채널의 분극은 [[강유전체 반도체 전계효과 트랜지스터|FeS-FET]]의 저장 상태가 됩니다(Si 2019).
