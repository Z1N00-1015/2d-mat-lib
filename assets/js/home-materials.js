import { MATS, drawMini } from './lineup.js?v=20261021-sbo-topview';
import { fitCanvas } from './util.js';

const HOME_MATERIALS = MATS.filter(material => material.fam === '2d' || material.fam === '0d');

export function init(root) {
  root.innerHTML = HOME_MATERIALS.map(material => `<article class="mat home-mat">
    <canvas aria-hidden="true"></canvas>
    <div class="sym">${material.sym}</div>
    <div class="nm">${material.nm}</div>
    <div class="home-material-kind">${material.kind}</div>
  </article>`).join('');

  root.querySelectorAll('.home-mat canvas').forEach((canvas, index) => {
    const material = HOME_MATERIALS[index];
    const fitted = fitCanvas(canvas, (width, height) => drawMini(fitted.ctx, width, height, material, 0));
  });
}
