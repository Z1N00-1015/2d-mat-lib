---
title: 밴드갭
en: band gap, E_g
category: 전자 구조
status: 초안
summary: 가전자대 최대점과 전도대 최소점 사이의 금지 에너지 폭.
chapter: semiconductor/bands
papers: mak2010, splendiani2010, kuc2011, chaves2020, wang2012review
reviewed: 2026-10-30
info:
- 정의 | 가전자대 꼭대기 ~ 전도대 바닥의 에너지 차
- Si (300 K) | 1.12 eV, 간접
- GaAs (300 K) | 1.42 eV, 직접
- 단층 MoS₂ | PL 1.82–1.90 eV, 직접
- h-BN | 약 6 eV
figures:
- 밴드분류
- 밴드 | tmd | 1.2 | 1.8–1.9
sources:
- Sze & Ng, Physics of Semiconductor Devices, 3rd ed. (Wiley, 2007)
- Kittel, Introduction to Solid State Physics, 8th ed. (Wiley, 2005)
- Mak et al., Phys. Rev. Lett. (2010) | https://doi.org/10.1103/PhysRevLett.105.136805
- Splendiani et al., Nano Lett. (2010) | https://doi.org/10.1021/nl903868w
- Kuc et al., Phys. Rev. B (2011) | https://doi.org/10.1103/PhysRevB.83.245213
- Chernikov et al., Phys. Rev. Lett. (2014) | https://doi.org/10.1103/PhysRevLett.113.076802
---
## 정의

**밴드갭**(band gap, E_g)은 전자로 꽉 찬 가전자대의 꼭대기와 비어 있는 전도대의 바닥 사이에 놓인, 전자가 가질 수 없는 에너지 폭입니다. 전자가 전류를 나르려면 이 폭 이상의 에너지를 얻어 전도대로 올라가야 하므로, 밴드갭은 물질이 금속인지 반도체인지 절연체인지를 가르는 기준이 됩니다.

{{그림: 밴드분류 | 금속은 밴드가 일부만 차 있어 밴드갭이 없고, 반도체와 절연체는 가전자대와 전도대 사이에 밴드갭이 있습니다. 반도체와 절연체의 경계는 관습적인 것입니다.}}

## 밴드갭이 정하는 것

- **전기 전도도**: 상온에서 열로 들뜨는 캐리어 수는 대략 exp(−E_g / 2kT)에 비례합니다. 밴드갭이 클수록 꺼진 상태의 누설 전류가 작습니다(Sze).
- **빛**: 밴드갭보다 에너지가 큰 빛만 흡수하고, 재결합할 때는 밴드갭 근처 에너지의 빛을 냅니다. 파장(nm) ≈ 1240 / E_g(eV)입니다.
- **소자**: 트랜지스터 채널은 보통 1–2 eV, 게이트 절연막은 5 eV 이상이 적합합니다.

대표값(300 K, Sze): Si 1.12 eV(간접), GaAs 1.42 eV(직접).

## 2D 물질의 밴드갭

TMD는 층수에 따라 밴드갭이 바뀝니다. MoS₂는 bulk에서 약 1.2 eV의 간접 밴드갭이지만, 단층이 되면 K점의 직접 밴드갭으로 바뀌어 빛을 강하게 냅니다(Mak 2010, Splendiani 2010, Kuc 2011). 자세한 차이는 [[직접/간접 밴드갭]]에 있습니다.

{{그림: 밴드 | MoS₂의 층수에 따른 밴드 구조 개념도. bulk는 간접(약 1.2 eV), 단층은 직접 밴드갭이 됩니다.}}

## 광학 갭과 준입자 갭

2D 반도체에서는 ‘밴드갭’이라는 말을 쓸 때 어떤 값인지 구분해야 합니다. PL이나 흡수로 재는 값은 [[엑시톤]] 에너지(**광학 갭**)이고, 전자를 하나 넣거나 빼는 데 드는 에너지 차(**준입자 갭**, 전자적 밴드갭)는 엑시톤 결합 에너지만큼 더 큽니다. 단층 WS₂에서는 이 차이가 약 0.32 eV입니다(Chernikov 2014). 그래핀은 밴드갭이 0인 반금속이고([[디랙 원뿔]]), [[h-BN]]은 약 6 eV의 절연체입니다.
