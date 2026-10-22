// Glossary: Korean term · English · definition
const TERMS = [
  ['결정학', '결정 구조', 'crystal structure', '브라베 격자의 각 격자점에 원자 또는 원자 무리(기저)를 배치한 원자의 주기적 배열.'],
  ['결정학', '브라베 격자', 'Bravais lattice', '병진 대칭만으로 정의되는 무한한 점의 배열. 2차원 5종, 3차원 14종이 있다.'],
  ['결정학', '기저', 'basis', '각 격자점에 놓이는 원자 또는 원자 무리. 결정 구조 = 격자 + 기저.'],
  ['결정학', '단위격자', 'unit cell', '병진 반복으로 결정 전체를 채우는 공간 단위. 격자점을 하나만 포함하면 원시 단위격자(primitive cell)라 한다.'],
  ['결정학', 'Wigner–Seitz 셀', 'Wigner–Seitz cell', '한 격자점에서 이웃 격자점까지의 수직 이등분면으로 둘러싸인 원시 단위격자.'],
  ['결정학', '역격자', 'reciprocal lattice', 'aᵢ · bⱼ = 2πδᵢⱼ를 만족하는 벡터 bⱼ로 생성되는 격자. 회절 조건과 전자 상태를 기술하는 파수 공간의 격자.'],
  ['결정학', '제1 브릴루앙 영역', 'first Brillouin zone', '역격자의 Wigner–Seitz cell. 결정 내 전자 상태를 기술하는 기본 파수 영역.'],
  ['결정학', '밀러 지수', 'Miller indices', '결정면이 세 결정축과 만나는 절편(격자 상수 단위)의 역수를 가장 작은 정수비로 나타낸 (hkl).'],
  ['결정학', '면간 거리', 'interplanar spacing', '평행한 인접 결정면 사이의 거리 d_hkl. 입방정에서 d = a / √(h² + k² + l²).'],
  ['결정학', '브래그 법칙', "Bragg's law", '결정면에서 산란된 X선의 보강 간섭 조건 2d sinθ = nλ.'],
  ['결정학', '구조 인자', 'structure factor', '단위격자 내 원자들의 산란파를 위상과 함께 합한 F_hkl = Σ fⱼ exp[2πi(hxⱼ + kyⱼ + lzⱼ)]. 회절 세기는 |F|²에 비례한다.'],
  ['결정학', '소멸 규칙', 'systematic absence', '구조 인자가 0이 되어 특정 (hkl) 반사가 나타나지 않는 규칙. 격자 중심화와 기저에 의해 결정된다.'],
  ['결정학', '결정 다형', 'polytype', '같은 화학 조성에서 원자층의 적층 순서만 다른 결정 구조. 예: 4H-SiC, 6H-SiC.'],
  ['결정학', '모아레 초격자', 'moiré superlattice', '두 주기 격자를 비틀림 또는 격자 불일치로 겹쳤을 때 생기는 장주기 구조. L = a / [2 sin(θ/2)].'],
  ['결정학', '수직 이종구조', 'vertical heterostructure', '서로 다른 재료층을 면에 수직한 방향으로 쌓아 만든 구조. 층 사이 계면은 반데르발스 결합 또는 직접 성장에 따른 상호작용을 가질 수 있다.'],
  ['결정학', '평면 내 이종구조', 'lateral heterostructure', '한 원자층 안에서 서로 다른 재료 영역을 옆으로 연결한 구조. 계면에서 원자 간 공유결합이 형성되는 경우가 많다.'],
  ['결정학', '반데르발스 통합', 'van der Waals integration', '서로 다른 재료 구성요소를 강한 화학 결합이나 엄격한 격자 정합 없이 물리적으로 조립해 계면 구조를 만드는 접근. 실제 계면은 표면 상태와 제작법에 좌우된다.'],
  ['결정학', '격자 불일치', 'lattice mismatch', '이종 물질의 두 격자 주기 사이 상대적인 차이. 작은 불일치도 겹친 층에서 긴 모아레 주기를 만들 수 있다.'],
  ['결정학', '상대 회전각', 'relative twist angle', '적층한 두 결정 격자 사이의 회전 차이. 모아레 주기와 대칭 방향에 영향을 준다.'],
  ['소재', '황화주석(II)', 'tin(II) sulfide, SnS', 'Sn과 S로 이루어진 층상 반도체. 사방정계의 주름진 격자와 면내 이방성이 특징이다.'],
  ['소재', '안티모니 트리옥사이드', 'antimony trioxide, α-Sb₂O₃', '입방 α상에서 Sb₄O₆ 케이지 분자로 이루어진 0D 분자형 결정.'],
  ['결정학', '원자 재구성', 'atomic reconstruction', '모아레 구조에서 층간 상호작용과 탄성 에너지의 균형에 따라 원자 위치와 국소 적층이 변해 stacking domains와 domain walls가 형성되는 현상.'],
  ['결정학', '적층 도메인', 'stacking domain', '모아레 구조에서 국소 원자 적층이 거의 일정한 영역. twisted bilayer graphene의 작은 비틀림각에서는 AB·BA 영역이 넓어진다.'],
  ['결정학', '도메인 벽', 'domain wall, soliton', '서로 다른 stacking domains 사이를 잇는 좁은 전이 영역.'],
  ['결정학', '에피택시', 'epitaxy', '기판의 결정 방위를 따라 단결정 박막을 성장시키는 것.'],
  ['분석법', '라만 분광법', 'Raman spectroscopy', '빛의 비탄성 산란으로 격자 진동을 측정하는 분광법. 2D 물질의 층수, 변형률, 결함과 전하 상태를 조사할 때 활용한다.'],
  ['분석법', '라만 이동', 'Raman shift', '입사광과 라만 산란광 사이의 에너지 차이를 파수(cm⁻¹)로 나타낸 값. 물질의 진동 에너지에 대응한다.'],
  ['분석법', '포논', 'phonon', '결정 격자의 집단 진동을 양자화해 기술하는 준입자. 라만 분광법은 라만 활성 포논 모드를 측정할 수 있다.'],
  ['분석법', 'Stokes/anti-Stokes 산란', 'Stokes / anti-Stokes scattering', '광자가 진동계에 에너지를 주거나(Stokes) 이미 들뜬 진동계에서 에너지를 얻어(anti-Stokes) 산란되는 과정.'],
  ['분석법', 'Rayleigh 산란', 'Rayleigh scattering', '빛이 물질에서 산란되지만 광자 에너지가 바뀌지 않는 탄성 산란. 대부분의 산란광은 이 과정에 해당한다.'],
  ['분석법', '투과전자현미경', 'transmission electron microscopy, TEM', '얇은 시료를 통과하거나 회절한 전자를 이용해 국소 원자 배열과 미세 구조를 관찰하는 현미경 기법.'],
  ['분석법', '주사 투과전자현미경', 'scanning transmission electron microscopy, STEM', '좁은 전자빔을 시료 위에서 주사하고 각 위치에서 산란·투과 신호를 검출해 영상을 만드는 전자현미경 기법.'],
  ['분석법', '고분해능 투과전자현미경', 'high-resolution transmission electron microscopy, HRTEM', '투과파와 회절파의 간섭으로 생긴 위상 대비를 이용해 국소 격자 무늬와 원자 배열을 관찰하는 방법.'],
  ['분석법', '고각 환형 암시야 영상', 'high-angle annular dark-field, HAADF', '주사 투과전자현미경에서 고각 산란 전자를 환형 검출기로 모으는 영상 방식. 원자 번호에 따른 대비를 제공하지만 두께와 정렬의 영향도 받는다.'],
  ['분석법', '암시야 투과전자현미경', 'dark-field transmission electron microscopy, DF-TEM', '회절 패턴의 선택한 반사 빔으로 영상을 만들어 특정 결정립·방위·결함 영역을 대비시키는 투과전자현미경 기법.'],
  ['분석법', '환형 암시야 주사 투과전자현미경', 'annular dark-field scanning transmission electron microscopy, ADF-STEM', '시료를 주사하는 전자빔에서 산란된 전자를 환형 검출기로 모아 영상을 만드는 방법. 검출 각도와 camera length가 대비에 영향을 준다.'],
  ['분석법', '카메라 길이', 'camera length', 'TEM 회절 모드에서는 회절 패턴의 거리 환산에 쓰이는 유효 투영 거리이며, STEM에서는 detector의 수집 각도 범위를 설정하는 광학 조건이다. 실제 격자 간격이나 모아레 주기를 바꾸지는 않는다.'],
  ['분석법', '고속 푸리에 변환', 'fast Fourier transform, FFT', '영상의 공간 주기를 역공간의 점이나 벡터로 바꾸어 보여주는 계산 방법. 국소 FFT를 여러 영역에서 비교하면 격자와 모아레의 위치별 변화를 분석할 수 있다.'],
  ['결정학', '모아레 벡터', 'moiré vector, g_m', '두 격자의 대응 역격자 벡터 차이 g_m = g_1 − g_2. 그 크기는 모아레 주기와 역수 관계이며, 벡터 방향은 실공간 fringe의 법선 방향과 연결된다.'],
  ['분석법', '모아레 프린지', 'moiré fringe', '두 격자의 간섭으로 생기는 실공간 줄무늬 대비. DF-TEM에서는 선택한 회절점을 이용해 특정 방향의 fringe를 영상화할 수 있다.'],
  ['분석법', '선택 영역 전자 회절', 'selected-area electron diffraction, SAED', '투과전자현미경에서 선택한 시료 영역의 전자 회절 패턴을 얻어 결정 대칭과 방위를 분석하는 방법.'],
  ['분석법', 'X선 회절', 'X-ray diffraction, XRD', '결정에서 산란된 X선의 간섭 패턴을 분석해 결정상, 격자 간격과 배향을 조사하는 기법.'],
  ['분석법', '에너지 분산 X선 분광법', 'energy-dispersive X-ray spectroscopy, EDS', '전자빔으로 여기된 시료에서 나오는 특성 X선 에너지를 분석해 원소와 공간 분포를 조사하는 방법.'],
  ['분석법', '전자 에너지 손실 분광법', 'electron energy-loss spectroscopy, EELS', '시료를 통과한 전자의 에너지 손실을 측정해 원소와 결합·전자 구조 정보를 얻는 방법.'],
  ['분석법', 'X선 광전자분광법', 'X-ray photoelectron spectroscopy, XPS', 'X선 조사로 방출된 광전자의 결합 에너지를 측정해 표면 근처의 원소 조성과 화학 상태를 분석하는 방법.'],
  ['분석법', '화학적 이동', 'chemical shift', '화학 결합과 전하 환경의 차이로 분광 피크의 에너지 위치가 달라지는 현상. XPS에서는 결합 에너지 이동으로 화학 상태를 비교한다.'],
  ['분석법', '원자힘현미경', 'atomic force microscopy, AFM', '탐침과 표면 사이 힘에 따른 캔틸레버 응답을 기록해 표면 형상과 높이를 측정하는 주사 탐침 현미경.'],
  ['전자 구조', '에너지 밴드', 'energy band', '주기 퍼텐셜 속 전자가 가질 수 있는 허용 에너지 영역. 원자 준위가 결정 내에서 넓어져 형성된다.'],
  ['전자 구조', '밴드갭', 'band gap, E_g', '가전자대 최대점과 전도대 최소점 사이의 금지 에너지 폭.'],
  ['전자 구조', '직접/간접 밴드갭', 'direct / indirect band gap', '전도대 최소점과 가전자대 최대점이 같은 파수 k에 있으면 직접, 다르면 간접 밴드갭. 간접 전이에는 포논이 필요하다.'],
  ['전자 구조', '유효 질량', 'effective mass, m*', '밴드의 곡률로 정의되는 결정 내 캐리어의 겉보기 질량. 1/m* = (1/ħ²) d²E/dk².'],
  ['전자 구조', '강한 결합 근사', 'tight-binding approximation', '원자 오비탈의 선형 결합으로 결정의 전자 상태를 구하는 근사. 이웃 원자 간 겹침을 호핑 적분 t로 나타낸다.'],
  ['전자 구조', '디랙 원뿔', 'Dirac cone', '그래핀의 K점에서 에너지가 파수에 선형 비례(E = ±ħv_F|k|)하는 원뿔형 밴드 구조.'],
  ['전자 구조', '평탄 밴드', 'flat band', '에너지가 파수에 거의 무관한 밴드. 운동 에너지가 억제되어 전자 상관 효과가 두드러진다.'],
  ['전자 구조', '엑시톤', 'exciton', '쿨롱 인력으로 속박된 전자–정공 쌍. 2D 반도체에서는 결합 에너지가 수백 meV에 이른다.'],
  ['전자 구조', '층간 엑시톤', 'interlayer exciton', '전자와 정공이 서로 다른 층에 위치한 속박 상태. 층간 거리와 전기장, 적층 구조로 에너지와 수명을 조절할 수 있다.'],
  ['전자 구조', '광발광', 'photoluminescence, PL', '빛을 흡수해 여기된 캐리어가 재결합하며 빛을 방출하는 현상.'],
  ['소자', '양자 터널링', 'quantum tunneling', '입자의 에너지가 퍼텐셜 장벽보다 낮아도 파동함수가 장벽을 투과하는 현상.'],
  ['소자', '등가 산화막 두께', 'equivalent oxide thickness, EOT', '고유전율 절연막과 같은 정전 용량을 주는 SiO₂의 두께. EOT = t_phys × (3.9 / κ).'],
  ['소자', '단채널 효과', 'short-channel effect', '게이트 길이가 짧아져 소스·드레인 전위가 채널 제어에 관여하면서 문턱전압 감소, SS 증가 등이 나타나는 현상.'],
  ['소자', '문턱전압이하 스윙', 'subthreshold swing, SS', '문턱전압 이하에서 드레인 전류를 10배 변화시키는 데 필요한 게이트 전압. 상온 이론 한계 ≈ 60 mV/dec.'],
  ['소자', '드레인 유도 장벽 감소', 'drain-induced barrier lowering, DIBL', '드레인 전압이 소스–채널 퍼텐셜 장벽을 낮춰 문턱전압이 감소하는 현상(mV/V).'],
  ['소자', '스케일 길이', 'scale length, λ', '소스·드레인 전위가 채널로 침투하는 특성 거리. L_g/λ가 클수록 게이트 제어력이 좋다.'],
  ['소자', '강유전체 전계효과 트랜지스터', 'ferroelectric field-effect transistor, FeFET', '게이트 적층에 강유전체를 넣어 잔류 분극으로 채널 전도도를 비휘발성으로 조절하는 트랜지스터.'],
  ['소자', '강유전체 반도체 전계효과 트랜지스터', 'ferroelectric semiconductor field-effect transistor, FeS-FET', '강유전체 반도체를 채널로 사용하고 그 분극 상태로 채널 전도도를 조절하는 FET. 게이트 절연막을 강유전체로 쓰는 FeFET와 구별된다.'],
  ['소자', '단일체 3차원 집적', 'monolithic 3D integration', '같은 기판 위에서 소자층과 연결 배선을 순차적으로 형성해 회로층을 수직으로 쌓는 집적 방식. 층간 연결을 짧게 하고 면적당 기능을 높일 수 있지만, 아래층 소자가 견딜 수 있는 열 예산과 공정 호환성이 중요하다.'],
  ['소자', '음의 정전용량 전계효과 트랜지스터', 'negative-capacitance field-effect transistor, NCFET', '강유전체의 음의 정전용량 효과를 이용해 채널 내부 전압을 증폭하고 낮은 전압 동작을 연구하는 FET 구조. 실제 성능은 재료와 적층 설계에 좌우된다.'],
  ['소자', '2차원 전자가스', 'two-dimensional electron gas, 2DEG', '이종접합 계면 등에 갇혀 면내로만 운동하는 전자 집단. AlGaN/GaN에서는 분극으로 형성된다.'],
  ['소자', '절연파괴 전계', 'breakdown field, E_c', '애벌랜치 항복이 일어나는 임계 전계. 밴드갭이 넓을수록 크다.'],
  ['소자', 'Baliga 성능지수', "Baliga's figure of merit, BFOM", '단극성 전력 소자의 저손실 성능 지표 ε·μ·E_c³. 특성 온저항에 반비례한다.'],
  ['물질·공정', '반데르발스 물질', 'van der Waals material', '층 내부는 공유결합, 층 사이는 약한 반데르발스 힘으로 결합한 층상 물질.'],
  ['물질·공정', '전이금속 디칼코제나이드', 'transition metal dichalcogenide, TMD', 'MX₂ 조성(M: Mo, W 등, X: S, Se, Te)의 층상 물질. 예: MoS₂, WSe₂.'],
  ['물질·공정', '반금속', 'semimetal', '전도대와 가전자대가 맞닿거나 약간 겹쳐 밴드갭이 없는 물질. 그래핀은 영 밴드갭 반금속이다.'],
  ['물질·공정', '광대역 밴드갭 반도체', 'wide-bandgap semiconductor, WBG', '밴드갭이 약 2.3 eV 이상인 반도체(SiC, GaN 등). 4 eV 이상은 초광대역(UWBG)이라 한다.'],
  ['물질·공정', '기계적 박리', 'mechanical exfoliation', '접착 테이프 등으로 층상 결정에서 원자층을 떼어내는 방법.'],
  ['물질·공정', '하향식 합성', 'top-down synthesis', '벌크 층상 결정이나 두꺼운 재료를 박리·식각해 더 얇은 구조를 만드는 접근.'],
  ['물질·공정', '상향식 합성', 'bottom-up synthesis', '원자·분자 전구체를 반응·조립해 결정이나 박막을 성장시키는 접근.'],
  ['물질·공정', '액상 박리', 'liquid-phase exfoliation', '용매 안에서 초음파나 전단력 등을 가해 층상 결정의 얇은 조각을 분산시키는 방법.'],
  ['물질·공정', '이온 삽입', 'intercalation', '층상 재료의 층간 공간에 이온이나 분자를 넣어 층간 결합과 물성을 바꾸는 과정.'],
  ['물질·공정', '화학 기상 증착', 'chemical vapor deposition, CVD', '기체 전구체의 화학 반응으로 기판 위에 박막을 형성하는 방법.'],
  ['물질·공정', '물리 기상 증착', 'physical vapor deposition, PVD', '고체 원료를 증발시키거나 스퍼터링해 기판 위에 응축시키는 박막 증착법.'],
  ['물질·공정', '원자층 증착', 'atomic layer deposition, ALD', '전구체를 순차 공급해 표면의 자기 제한 반응을 반복하며 막 두께를 조절하는 증착법.'],
  ['물질·공정', '결정립계', 'grain boundary', '방위가 다른 결정립 사이의 경계. 캐리어를 산란시켜 이동도를 낮춘다.'],
  ['물질·공정', 'hypotaxy', 'hypotaxy', '2D template의 나노구멍을 통해 하부 금속막을 반응시켜 template의 결정 방위를 전달받은 결정핵을 만들고, 이를 연결해 박막을 성장시키는 방법.'],
  ['물질·공정', '그래핀 나노구멍', 'graphene nanopore', '그래핀에 의도적으로 만든 나노미터 크기 구멍. hypotaxy에서 반응종의 통로이자 핵생성 위치가 될 수 있다.'],
  ['물성', '강유전성', 'ferroelectricity', '외부 전기장 없이 자발 분극을 가지며, 전기장으로 분극 방향을 반전할 수 있는 성질.'],
  ['물성', '자발 분극', 'spontaneous polarization', '외부 전기장이 없어도 물질의 단위 부피(또는 면적)에 존재하는 순 분극.'],
  ['물성', '면내 분극', 'in-plane polarization, IP', '2D 층의 면과 나란한 방향의 분극 성분.'],
  ['물성', '면외 분극', 'out-of-plane polarization, OOP', '2D 층에 수직인 방향의 분극 성분.'],
  ['물성', '층간 미끄럼 강유전성', 'sliding ferroelectricity', '반데르발스 층의 상대적인 옆 방향 미끄럼으로 적층 대칭성과 계면 분극을 바꾸는 강유전성.'],
  ['물성', '강자성', 'ferromagnetism', '스핀의 장거리 정렬로 자발 자화를 갖는 자기 질서.'],
  ['물성', '반강자성', 'antiferromagnetism', '서로 다른 스핀 부격자의 자기 모멘트가 반대 방향으로 정렬해 순자화가 상쇄되는 자성 질서.'],
  ['물성', 'Mermin–Wagner 정리', 'Mermin–Wagner theorem', '단거리 상호작용을 하는 등방성 저차원 연속 대칭계에서는 유한 온도 장거리 질서가 형성되지 않는다는 정리. 실제 2D 자성체의 이방성은 이 가정에서 벗어난다.'],
  ['물성', '네엘 벡터', 'Néel vector', '반강자성에서 서로 반대 방향인 스핀 부격자들의 방향을 나타내는 질서 변수.'],
  ['물성', '네엘 온도', 'Néel temperature, T_N', '반강자성 장거리 질서가 사라지는 전이 온도.'],
  ['물성', '마그논', 'magnon', '자성체에서 스핀들의 집단적인 파동을 양자화해 나타낸 여기.'],
  ['물성', '스핀–궤도 토크', 'spin–orbit torque, SOT', '전류가 만든 스핀 축적 또는 스핀 전류가 스핀–궤도 결합을 통해 자화나 자성 질서에 전달하는 토크.'],
  ['소자·측정', '터널 자기저항', 'tunnelling magnetoresistance, TMR', '터널 장벽 양쪽의 자성 상태에 따라 달라지는 터널 전류 또는 저항. 자성 터널 접합의 상태 판독에 쓰인다.'],
  ['물성', '자기 이방성', 'magnetic anisotropy', '자화 방향에 따라 달라지는 자기 에너지. 2D 자성체의 자화 방향과 열적 안정성에 영향을 준다.'],
  ['물성', '큐리 온도', 'Curie temperature, T_C', '강자성체가 가열에 따라 장거리 강자성 질서를 잃는 전이 온도.'],
  ['분석법', '자기 광학 Kerr 효과', 'magneto-optic Kerr effect, MOKE', '자화된 시료에서 반사광의 편광 방향 또는 타원율이 달라지는 자기 광학 효과.'],
];

export function init(root) {
  const input = root.querySelector('input[type=search]');
  const chips = root.querySelector('.seg');
  const body = root.querySelector('tbody');
  const count = root.querySelector('[data-o="count"]');
  let cat = '전체';
  const cats = ['전체', ...new Set(TERMS.map(t => t[0]))];
  chips.innerHTML = cats.map(c => `<button data-v="${c}"${c === cat ? ' class="on"' : ''}>${c}</button>`).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    cat = b.dataset.v;
    chips.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    render();
  });
  input.addEventListener('input', render);
  function render() {
    const q = input.value.trim().toLowerCase();
    const rows = TERMS.filter(([c, ko, en, d]) =>
      (cat === '전체' || c === cat) && (!q || (ko + en + d).toLowerCase().includes(q)));
    body.innerHTML = rows.map(([c, ko, en, d]) =>
      `<tr><td><b>${ko}</b><div class="en">${en}</div></td><td>${d}</td><td class="cat">${c}</td></tr>`).join('')
      || '<tr><td colspan="3" class="empty">검색 결과가 없습니다.</td></tr>';
    count.textContent = `${rows.length}개 용어`;
  }
  render();
}
