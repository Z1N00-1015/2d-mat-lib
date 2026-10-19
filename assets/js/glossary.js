// Glossary: Korean textbook term · English · definition
const TERMS = [
  ['결정학', '결정 구조', 'crystal structure', '브라베 격자의 각 격자점에 원자 또는 원자 무리(기저)를 배치한 원자의 주기적 배열.'],
  ['결정학', '브라베 격자', 'Bravais lattice', '병진 대칭만으로 정의되는 무한한 점의 배열. 2차원 5종, 3차원 14종이 있다.'],
  ['결정학', '기저', 'basis', '각 격자점에 놓이는 원자 또는 원자 무리. 결정 구조 = 격자 + 기저.'],
  ['결정학', '단위 세포', 'unit cell', '병진 반복으로 결정 전체를 채우는 공간 단위. 격자점을 하나만 포함하면 기본 단위 세포(primitive cell)라 한다.'],
  ['결정학', '위그너–자이츠 세포', 'Wigner–Seitz cell', '한 격자점에서 이웃 격자점까지의 수직 이등분면으로 둘러싸인 기본 단위 세포.'],
  ['결정학', '역격자', 'reciprocal lattice', 'aᵢ · bⱼ = 2πδᵢⱼ를 만족하는 벡터 bⱼ로 생성되는 격자. 회절 조건과 전자 상태를 기술하는 파수 공간의 격자.'],
  ['결정학', '제1 브릴루앙 영역', 'first Brillouin zone', '역격자의 위그너–자이츠 세포. 결정 내 전자 상태를 기술하는 기본 파수 영역.'],
  ['결정학', '밀러 지수', 'Miller indices', '결정면이 세 결정축과 만나는 절편(격자 상수 단위)의 역수를 가장 작은 정수비로 나타낸 (hkl).'],
  ['결정학', '면간 거리', 'interplanar spacing', '평행한 인접 결정면 사이의 거리 d_hkl. 입방정에서 d = a / √(h² + k² + l²).'],
  ['결정학', '브래그 법칙', "Bragg's law", '결정면에서 산란된 X선의 보강 간섭 조건 2d sinθ = nλ.'],
  ['결정학', '구조 인자', 'structure factor', '단위 세포 내 원자들의 산란파를 위상과 함께 합한 F_hkl = Σ fⱼ exp[2πi(hxⱼ + kyⱼ + lzⱼ)]. 회절 세기는 |F|²에 비례한다.'],
  ['결정학', '소멸 규칙', 'systematic absence', '구조 인자가 0이 되어 특정 (hkl) 반사가 나타나지 않는 규칙. 격자 중심화와 기저에 의해 결정된다.'],
  ['결정학', '결정 다형', 'polytype', '같은 화학 조성에서 원자층의 적층 순서만 다른 결정 구조. 예: 4H-SiC, 6H-SiC.'],
  ['결정학', '모아레 초격자', 'moiré superlattice', '두 주기 격자를 비틀림 또는 격자 불일치로 겹쳤을 때 생기는 장주기 구조. L = a / [2 sin(θ/2)].'],
  ['결정학', '에피택시', 'epitaxy', '기판의 결정 방위를 따라 단결정 박막을 성장시키는 것.'],
  ['분석법', '라만 분광법', 'Raman spectroscopy', '빛의 비탄성 산란으로 격자 진동을 측정하는 분광법. 2D 물질의 층수, 변형률, 결함과 전하 상태를 조사할 때 활용한다.'],
  ['분석법', '투과전자현미경', 'transmission electron microscopy, TEM', '얇은 시료를 통과하거나 회절한 전자를 이용해 국소 원자 배열과 미세 구조를 관찰하는 현미경 기법.'],
  ['분석법', 'X선 광전자분광법', 'X-ray photoelectron spectroscopy, XPS', 'X선 조사로 방출된 광전자의 결합 에너지를 측정해 표면 근처의 원소 조성과 화학 상태를 분석하는 방법.'],
  ['분석법', '원자힘현미경', 'atomic force microscopy, AFM', '탐침과 표면 사이 힘에 따른 캔틸레버 응답을 기록해 표면 형상과 높이를 측정하는 주사 탐침 현미경.'],
  ['전자 구조', '에너지 밴드', 'energy band', '주기 퍼텐셜 속 전자가 가질 수 있는 허용 에너지 영역. 원자 준위가 결정 내에서 넓어져 형성된다.'],
  ['전자 구조', '밴드갭', 'band gap, E_g', '가전자대 최대점과 전도대 최소점 사이의 금지 에너지 폭.'],
  ['전자 구조', '직접/간접 밴드갭', 'direct / indirect band gap', '전도대 최소점과 가전자대 최대점이 같은 파수 k에 있으면 직접, 다르면 간접 밴드갭. 간접 전이에는 포논이 필요하다.'],
  ['전자 구조', '유효 질량', 'effective mass, m*', '밴드의 곡률로 정의되는 결정 내 캐리어의 겉보기 질량. 1/m* = (1/ħ²) d²E/dk².'],
  ['전자 구조', '강한 결합 근사', 'tight-binding approximation', '원자 오비탈의 선형 결합으로 결정의 전자 상태를 구하는 근사. 이웃 원자 간 겹침을 호핑 적분 t로 나타낸다.'],
  ['전자 구조', '디랙 원뿔', 'Dirac cone', '그래핀의 K점에서 에너지가 파수에 선형 비례(E = ±ħv_F|k|)하는 원뿔형 밴드 구조.'],
  ['전자 구조', '평탄 밴드', 'flat band', '에너지가 파수에 거의 무관한 밴드. 운동 에너지가 억제되어 전자 상관 효과가 두드러진다.'],
  ['전자 구조', '엑시톤', 'exciton', '쿨롱 인력으로 속박된 전자–정공 쌍. 2D 반도체에서는 결합 에너지가 수백 meV에 이른다.'],
  ['전자 구조', '광발광', 'photoluminescence, PL', '빛을 흡수해 여기된 캐리어가 재결합하며 빛을 방출하는 현상.'],
  ['소자', '양자 터널링', 'quantum tunneling', '입자의 에너지가 퍼텐셜 장벽보다 낮아도 파동함수가 장벽을 투과하는 현상.'],
  ['소자', '등가 산화막 두께', 'equivalent oxide thickness, EOT', '고유전율 절연막과 같은 정전 용량을 주는 SiO₂의 두께. EOT = t_phys × (3.9 / κ).'],
  ['소자', '단채널 효과', 'short-channel effect', '게이트 길이가 짧아져 소스·드레인 전위가 채널 제어에 관여하면서 문턱전압 감소, SS 증가 등이 나타나는 현상.'],
  ['소자', '문턱전압이하 스윙', 'subthreshold swing, SS', '문턱전압 이하에서 드레인 전류를 10배 변화시키는 데 필요한 게이트 전압. 상온 이론 한계 ≈ 60 mV/dec.'],
  ['소자', '드레인 유도 장벽 감소', 'drain-induced barrier lowering, DIBL', '드레인 전압이 소스–채널 퍼텐셜 장벽을 낮춰 문턱전압이 감소하는 현상(mV/V).'],
  ['소자', '스케일 길이', 'scale length, λ', '소스·드레인 전위가 채널로 침투하는 특성 거리. L_g/λ가 클수록 게이트 제어력이 좋다.'],
  ['소자', '강유전체 전계효과 트랜지스터', 'ferroelectric field-effect transistor, FeFET', '게이트 적층에 강유전체를 넣어 잔류 분극으로 채널 전도도를 비휘발성으로 조절하는 트랜지스터.'],
  ['소자', '강유전체 반도체 전계효과 트랜지스터', 'ferroelectric semiconductor field-effect transistor, FeS-FET', '강유전체 반도체를 채널로 사용하고 그 분극 상태로 채널 전도도를 조절하는 FET. 게이트 절연막을 강유전체로 쓰는 FeFET와 구별된다.'],
  ['소자', '음의 정전용량 전계효과 트랜지스터', 'negative-capacitance field-effect transistor, NCFET', '강유전체의 음의 정전용량 효과를 이용해 채널 내부 전압을 증폭하고 낮은 전압 동작을 연구하는 FET 구조. 실제 성능은 재료와 적층 설계에 좌우된다.'],
  ['소자', '2차원 전자가스', 'two-dimensional electron gas, 2DEG', '이종접합 계면 등에 갇혀 면내로만 운동하는 전자 집단. AlGaN/GaN에서는 분극으로 형성된다.'],
  ['소자', '절연파괴 전계', 'breakdown field, E_c', '애벌랜치 항복이 일어나는 임계 전계. 밴드갭이 넓을수록 크다.'],
  ['소자', '발리가 성능지수', "Baliga's figure of merit, BFOM", '단극성 전력 소자의 저손실 성능 지표 ε·μ·E_c³. 특성 온저항에 반비례한다.'],
  ['물질·공정', '반데르발스 물질', 'van der Waals material', '층 내부는 공유결합, 층 사이는 약한 반데르발스 힘으로 결합한 층상 물질.'],
  ['물질·공정', '전이금속 디칼코제나이드', 'transition metal dichalcogenide, TMD', 'MX₂ 조성(M: Mo, W 등, X: S, Se, Te)의 층상 물질. 예: MoS₂, WSe₂.'],
  ['물질·공정', '반금속', 'semimetal', '전도대와 가전자대가 맞닿거나 약간 겹쳐 밴드갭이 없는 물질. 그래핀은 영 밴드갭 반금속이다.'],
  ['물질·공정', '광대역 밴드갭 반도체', 'wide-bandgap semiconductor, WBG', '밴드갭이 약 2.3 eV 이상인 반도체(SiC, GaN 등). 4 eV 이상은 초광대역(UWBG)이라 한다.'],
  ['물질·공정', '기계적 박리', 'mechanical exfoliation', '접착 테이프 등으로 층상 결정에서 원자층을 떼어내는 방법.'],
  ['물질·공정', '화학 기상 증착', 'chemical vapor deposition, CVD', '기체 전구체의 화학 반응으로 기판 위에 박막을 형성하는 방법.'],
  ['물질·공정', '결정립계', 'grain boundary', '방위가 다른 결정립 사이의 경계. 캐리어를 산란시켜 이동도를 낮춘다.'],
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
