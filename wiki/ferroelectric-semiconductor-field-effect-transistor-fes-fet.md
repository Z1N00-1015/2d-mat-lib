---
title: 강유전체 반도체 전계효과 트랜지스터
en: ferroelectric semiconductor field-effect transistor, FeS-FET
category: 소자
status: 초안
summary: 강유전체 반도체를 채널로 사용하고 그 분극 상태로 채널 전도도를 조절하는 FET. 게이트 절연막을 강유전체로 쓰는 FeFET와 구별된다.
papers: si2019, zhou2017in2se3, ding2017, cui2018
reviewed: 2026-10-30
info:
- 구조 | 강유전성 반도체를 채널로 쓰는 FET
- 대표 채널 | α-In₂Se₃
- FeFET와 차이 | 분극이 절연막이 아니라 채널 속에 있음
- 특징 | 면내·면외 분극이 서로 연결됨(In₂Se₃)
figures:
- 전달곡선 | hyst
sources:
- Si et al., Nature Electronics (2019) | https://doi.org/10.1038/s41928-019-0338-7
- Zhou et al., Nano Letters (2017) | https://doi.org/10.1021/acs.nanolett.7b02198
- Ding et al., Nature Communications (2017) | https://doi.org/10.1038/ncomms14956
- Cui et al., Nano Letters (2018) | https://doi.org/10.1021/acs.nanolett.7b04852
---
## 정의

**강유전체 반도체 FET**(ferroelectric semiconductor FET, FeS-FET)는 채널 자체가 강유전성을 가진 반도체인 트랜지스터입니다. 게이트 전압으로 채널 속 분극을 뒤집으면 채널의 전하 분포와 전도도가 바뀌고, 전압을 꺼도 그 상태가 남아 비휘발성 메모리로 동작합니다. 게이트 절연막에 강유전체를 넣는 [[강유전체 전계효과 트랜지스터|FeFET]]와는 분극의 위치가 다릅니다.

{{그림: 전달곡선 | 채널 분극 방향에 따라 문턱전압이 두 상태로 나뉘고 그 차이가 메모리 창이 됩니다. 곡선은 개념도입니다.}}

## α-In₂Se₃

In₂Se₃ 계열 층상 화합물은 원자 몇 층 두께에서도 분극이 유지될 것으로 이론적으로 예측되었고(Ding 2017), α-In₂Se₃ 박막에서 면외 압전성과 강유전성이 관측되었습니다(Zhou 2017). 특히 α-In₂Se₃는 면내 분극과 면외 분극이 원자 배열로 서로 묶여 있어, 한 방향을 바꾸면 다른 방향도 함께 바뀝니다(Cui 2018). 반도체이면서 강유전체이므로 같은 물질이 저장과 전류 흐름을 동시에 맡을 수 있습니다.

Si 등(2019)은 α-In₂Se₃ 채널로 FeS-FET를 만들어 큰 메모리 창과 비휘발성 동작을 보였습니다.

## 장점과 과제

- **장점**: 게이트 절연막과 강유전체 사이의 탈분극 문제를 피할 수 있고, 채널이 얇아 저전압 동작이 기대됩니다.
- **과제**: 채널이 반도체라 분극을 가리는 자유 전하가 있어 분극 유지가 까다롭고, 대면적 박막 성장과 [[잔류 시간]]·내구성 검증이 필요합니다. 이력의 원인이 분극인지 [[전하 트랩]]인지도 구별해야 합니다.

관련 개념: [[면내 분극]], [[면외 분극]], [[강유전성]].
