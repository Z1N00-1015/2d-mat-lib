// XPS energy bookkeeping demonstrator using the values selected by the learner.
import { fitCanvas, range, outs, FONT, MONO } from './util.js';

export function init(root) {
  const out = outs(root);
  const { ctx, state } = fitCanvas(root.querySelector('[data-c="energy"]'), draw);
  let photon = 1486.6, kinetic = 1200, work = 4.5, binding = 0;
  range(root, 'photon', v => { photon = v; update(); });
  range(root, 'kinetic', v => { kinetic = v; update(); });
  range(root, 'work', v => { work = v; update(); });
  function update() {
    binding = photon - kinetic - work;
    out('photon', `${photon.toFixed(1)} eV`);
    out('kinetic', `${kinetic.toFixed(1)} eV`);
    out('work', `${work.toFixed(1)} eV`);
    out('binding', binding >= 0 ? `${binding.toFixed(1)} eV` : '입력 확인');
    draw();
  }
  function draw() {
    const { w, h } = state;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fbfbfd'; ctx.fillRect(0, 0, w, h);
    const x0 = 28, y = h * .48, totalW = w - 56, scale = totalW / Math.max(photon, kinetic + work);
    ctx.font = `600 13px ${FONT}`; ctx.textAlign = 'left';
    ctx.fillStyle = '#4c4f59'; ctx.fillText('광자 에너지', x0, 36);
    ctx.fillStyle = '#2878d0'; ctx.fillRect(x0, y, photon * scale, 34);
    ctx.fillStyle = '#fff'; ctx.font = `12px ${MONO}`; ctx.fillText(`hν  ${photon.toFixed(1)} eV`, x0 + 10, y + 22);
    ctx.fillStyle = '#4c4f59'; ctx.font = `600 13px ${FONT}`; ctx.fillText('결합 에너지 + 운동 에너지 + 분석기 일함수', x0, y + 76);
    const segments = [{ value: Math.max(binding, 0), color: '#bc57bf', label: `Eᴮ ${Math.max(binding, 0).toFixed(1)}` }, { value: kinetic, color: '#28a38c', label: `Eᴷ ${kinetic.toFixed(1)}` }, { value: work, color: '#e49a31', label: `φ ${work.toFixed(1)}` }];
    let x = x0;
    for (const s of segments) {
      const sw = s.value * scale;
      if (sw > .5) { ctx.fillStyle = s.color; ctx.fillRect(x, y + 92, sw, 34); }
      if (sw > 48) { ctx.fillStyle = '#fff'; ctx.font = `11px ${MONO}`; ctx.fillText(`${s.label} eV`, x + 5, y + 114); }
      x += sw;
    }
    ctx.strokeStyle = '#777984'; ctx.beginPath(); ctx.moveTo(x0, y + 134); ctx.lineTo(x0 + totalW, y + 134); ctx.stroke();
    ctx.fillStyle = '#686a73'; ctx.font = `12px ${FONT}`; ctx.textAlign = 'center';
    ctx.fillText(binding >= 0 ? '에너지 보존 관계를 시각화한 도식' : 'Eᴷ + φ가 hν보다 큽니다. 입력값을 조정하세요.', w / 2, h - 20);
  }
  update();
}
