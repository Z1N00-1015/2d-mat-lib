import { MATS, drawMini } from './lineup.js?v=20261021-sbo-topview';
import { fitCanvas } from './util.js';

const HOME_MATERIALS = MATS.filter(material => material.fam === '2d' || material.fam === '0d');
const MATERIAL_PAGES = {
  gr: './chapters/materials/intro.html#s3',
  hbn: './chapters/materials/intro.html#s2',
  mos2: './chapters/semiconductor/bands.html',
  wse2: './chapters/semiconductor/bands.html',
  sns: './chapters/materials/ferroelectric.html',
  sbo: './chapters/materials/intro.html#s2',
};

export function init(root) {
  root.innerHTML = HOME_MATERIALS.map(material => `<a class="mat home-mat" href="${MATERIAL_PAGES[material.id] || './chapters/materials/intro.html'}" aria-label="${material.nm} 원자 구조와 관련 설명 보기">
    <canvas aria-hidden="true"></canvas>
    <div class="sym">${material.sym}</div>
    <div class="nm">${material.nm}</div>
    <div class="home-material-kind">${material.kind}</div>
  </a>`).join('');

  root.querySelectorAll('.home-mat canvas').forEach((canvas, index) => {
    const material = HOME_MATERIALS[index];
    const fitted = fitCanvas(canvas, (width, height) => drawMini(fitted.ctx, width, height, material, 0));
  });
}
