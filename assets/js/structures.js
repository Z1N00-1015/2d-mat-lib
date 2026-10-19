// Crystal structure definitions (lattice vectors in Å, fractional basis)
const S3 = Math.sqrt(3);
const hex = (a, c) => [[a, 0, 0], [-a / 2, a * S3 / 2, 0], [0, 0, c]];
const cubic = (a) => [[a, 0, 0], [0, a, 0], [0, 0, a]];

export const ELEMENTS = {
  C:  { color: 0xb8c0cc, r: 0.42, name: '탄소' },
  B:  { color: 0xff9f0a, r: 0.42, name: '붕소' },
  N:  { color: 0x64d2ff, r: 0.40, name: '질소' },
  Mo: { color: 0xbf5af2, r: 0.62, name: '몰리브데넘' },
  S:  { color: 0xffd60a, r: 0.50, name: '황' },
  Si: { color: 0x5e9cff, r: 0.55, name: '실리콘' },
  Ga: { color: 0x30d158, r: 0.55, name: '갈륨' },
  Cs: { color: 0xff9f0a, r: 0.80, name: '세슘' },
  Pb: { color: 0x8e8e93, r: 0.65, name: '납' },
  I:  { color: 0xbf5af2, r: 0.62, name: '아이오딘' },
  Ci: { color: 0x3a3a3c, r: 0.40, name: '탄소' }, // carbon in SiC (dark)
};

export const STRUCTURES = {
  graphene: {
    name: '그래핀 (흑연)', kind: '2D · 육방정 벌집 격자',
    layered: true, layerC: 6.70, layersPerCell: 2,
    cell: hex(2.46, 6.70),
    basis: [['C', 0, 0, 0.25], ['C', 1 / 3, 2 / 3, 0.25], ['C', 0, 0, 0.75], ['C', 2 / 3, 1 / 3, 0.75]],
    bond: 1.6,
    props: [['격자 상수 a', '2.46 Å'], ['C–C 결합', '1.42 Å'], ['층간 거리', '3.35 Å'], ['밴드갭', '0 eV'], ['혼성', 'sp²'], ['평면군', 'p6mm']],
    desc: '탄소 원자가 sp² 결합으로 엮인 벌집 격자. 단위 셀에 서로 다른 두 부격자(A, B) 원자가 있으며, 이 두 부격자의 대칭성이 K점의 디랙 콘을 만듭니다. 층을 늘리면 AB(Bernal) 적층된 흑연이 됩니다.',
  },
  hbn: {
    name: '육방정 질화붕소 (h-BN)', kind: '2D · 육방정 절연체',
    layered: true, layerC: 6.66, layersPerCell: 2,
    cell: hex(2.504, 6.66),
    basis: [['B', 1 / 3, 2 / 3, 0.25], ['N', 2 / 3, 1 / 3, 0.25], ['N', 1 / 3, 2 / 3, 0.75], ['B', 2 / 3, 1 / 3, 0.75]],
    bond: 1.6,
    props: [['격자 상수 a', '2.50 Å'], ['그래핀과 불일치', '1.8 %'], ['층간 거리', '3.33 Å'], ['밴드갭', '~6.0 eV'], ['공간군', 'P6₃/mmc'], ['별칭', '하얀 그래핀']],
    desc: '그래핀과 구조가 같지만 B와 N이 번갈아 놓여 부격자 대칭이 깨집니다. 그 결과 약 6 eV의 넓은 밴드갭을 가진 절연체가 됩니다. AA′ 적층으로 B 위에 N이 놓입니다. 2D 소자의 이상적인 기판·게이트 절연막입니다.',
  },
  mos2: {
    name: '이황화몰리브데넘 (2H-MoS₂)', kind: '2D · 전이금속 디칼코게나이드(TMD)',
    layered: true, layerC: 12.29, layersPerCell: 2,
    cell: hex(3.16, 12.29),
    basis: [['Mo', 1 / 3, 2 / 3, 0.25], ['S', 2 / 3, 1 / 3, 0.121], ['S', 2 / 3, 1 / 3, 0.379],
            ['Mo', 2 / 3, 1 / 3, 0.75], ['S', 1 / 3, 2 / 3, 0.621], ['S', 1 / 3, 2 / 3, 0.879]],
    bond: 2.6,
    props: [['격자 상수 a', '3.16 Å'], ['층 두께', '~0.65 nm'], ['Mo–S 결합', '2.41 Å'], ['밴드갭', '1.2 → 1.9 eV'], ['배위', '삼각 프리즘'], ['공간군', 'P6₃/mmc']],
    desc: 'S–Mo–S 세 원자층이 하나의 층을 이루는 샌드위치 구조. Mo는 여섯 개의 S에 삼각 프리즘 형태로 배위됩니다. 단층은 반전 대칭이 없어 K와 K′ 계곡(valley)을 구분하는 ‘밸리트로닉스’가 가능합니다.',
  },
  si: {
    name: '실리콘 (Si)', kind: '3D · 다이아몬드 입방정',
    cell: cubic(5.431),
    basis: [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]].flatMap(([x, y, z]) => [['Si', x, y, z], ['Si', x + 0.25, y + 0.25, z + 0.25]]),
    bond: 2.5,
    props: [['격자 상수 a', '5.431 Å'], ['Si–Si 결합', '2.35 Å'], ['단위 셀 원자', '8 개'], ['밴드갭', '1.12 eV (간접)'], ['배위', '정사면체 (4)'], ['공간군', 'Fd3̄m']],
    desc: '면심입방(FCC) 격자에 두 개의 원자 기저를 (¼,¼,¼)만큼 엇갈려 놓은 구조. 모든 원자가 정사면체 sp³ 결합을 합니다. 반세기 넘게 반도체 산업을 지탱한 기준 물질입니다.',
  },
  gan: {
    name: '질화갈륨 (GaN)', kind: '3D · 우르차이트 육방정',
    cell: hex(3.189, 5.185),
    basis: [['Ga', 1 / 3, 2 / 3, 0], ['Ga', 2 / 3, 1 / 3, 0.5], ['N', 1 / 3, 2 / 3, 0.377], ['N', 2 / 3, 1 / 3, 0.877]],
    bond: 2.1,
    props: [['a / c', '3.189 / 5.185 Å'], ['내부 변수 u', '0.377'], ['밴드갭', '3.4 eV (직접)'], ['절연파괴', '3.3 MV/cm'], ['배위', '정사면체'], ['공간군', 'P6₃mc']],
    desc: 'Ga와 N이 정사면체로 결합하며 c축 방향으로 ABAB 적층됩니다. 반전 대칭이 없어 강한 자발 분극과 압전 분극이 생기고, AlGaN/GaN 계면에 도핑 없이 고농도 2차원 전자가스(2DEG)가 형성됩니다.',
  },
  sic: {
    name: '탄화규소 (4H-SiC)', kind: '3D · 육방정 다형(polytype)',
    cell: hex(3.073, 10.053),
    basis: [['Si', 0, 0, 0], ['Si', 1 / 3, 2 / 3, 0.25], ['Si', 2 / 3, 1 / 3, 0.5], ['Si', 1 / 3, 2 / 3, 0.75],
            ['Ci', 0, 0, 0.1875], ['Ci', 1 / 3, 2 / 3, 0.4375], ['Ci', 2 / 3, 1 / 3, 0.6875], ['Ci', 1 / 3, 2 / 3, 0.9375]],
    bond: 2.0,
    props: [['a / c', '3.073 / 10.05 Å'], ['적층 순서', 'ABCB'], ['밴드갭', '3.26 eV'], ['절연파괴', '2.5 MV/cm'], ['열전도도', '~370 W/m·K'], ['공간군', 'P6₃mc']],
    desc: 'SiC는 같은 조성으로 250가지가 넘는 적층 다형을 가집니다. ABCB 네 층 주기의 4H-SiC가 이동도와 밴드갭의 균형이 좋아 전력 소자의 표준이 되었습니다. 회전시켜 c축 방향의 지그재그 적층을 확인해 보세요.',
  },
  perov: {
    name: '할라이드 페로브스카이트 (α-CsPbI₃)', kind: '3D · 입방정 페로브스카이트 ABX₃',
    cell: cubic(6.29),
    basis: [['Pb', 0.5, 0.5, 0.5], ['I', 0, 0.5, 0.5], ['I', 0.5, 0, 0.5], ['I', 0.5, 0.5, 0], ['Cs', 0, 0, 0]],
    bond: 3.3,
    props: [['격자 상수 a', '~6.29 Å'], ['구조', 'ABX₃'], ['밴드갭', '1.73 eV'], ['특징', '용액 공정'], ['배위', 'PbI₆ 팔면체'], ['공간군', 'Pm3̄m']],
    desc: 'PbI₆ 팔면체가 꼭짓점을 공유하며 3차원 망을 이루고, 그 빈 공간에 Cs⁺가 들어갑니다. 결함에 관대한 전자 구조와 저온 용액 공정 덕분에 차세대 태양전지·발광소자·X선 검출기 물질로 주목받습니다.',
  },
};

/**
 * Build atom list for an n×n(×n) supercell.
 * Layered structures: in-plane n×n, `layers` atomic layers stacked.
 * Atoms on the far boundaries are included so the supercell looks closed.
 */
export function buildCrystal(key, n, layers) {
  const S = STRUCTURES[key];
  const [A, B, C] = S.cell;
  const atoms = [];
  const eps = 1e-6;
  const nz = S.layered ? Math.ceil(layers / S.layersPerCell) : n;
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) for (let k = 0; k <= nz; k++) {
    for (const [el, fx, fy, fz] of S.basis) {
      const u = i + fx, v = j + fy, w = k + fz;
      if (u > n + eps || v > n + eps) continue;
      if (S.layered) {
        const layerIdx = Math.floor(w * S.layersPerCell + eps);
        if (layerIdx >= layers || w < 0) continue;
      } else if (w > nz + eps) continue;
      atoms.push({ el, p: [u * A[0] + v * B[0] + w * C[0], u * A[1] + v * B[1] + w * C[1], u * A[2] + v * B[2] + w * C[2]] });
    }
  }
  // de-duplicate (basis coords that wrap)
  const seen = new Set(), out = [];
  for (const a of atoms) {
    const key2 = a.p.map(x => x.toFixed(3)).join(',');
    if (!seen.has(key2)) { seen.add(key2); out.push(a); }
  }
  // bonds
  const bonds = [];
  const c2 = S.bond * S.bond;
  for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
    const a = out[i].p, b = out[j].p;
    const dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2];
    const d2 = dx * dx + dy * dy + dz * dz;
    if (d2 < c2 && d2 > 0.5) {
      // forbid same-element bonds in binary compounds (except C–C, Si–Si, S–S never)
      const e1 = out[i].el, e2 = out[j].el;
      if (e1 === e2 && !(e1 === 'C' || e1 === 'Si' && key === 'si')) continue;
      bonds.push([i, j]);
    }
  }
  return { atoms: out, bonds, nz };
}
