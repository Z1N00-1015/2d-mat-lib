// 위키 전체 문서 목록: 검색창에 입력하면 제목·영문·별칭·요약으로 문서를 거른다.
export function init(root) {
  const input = root.querySelector('input[type=search]');
  const count = root.querySelector('[data-o="count"]');
  const items = [...root.querySelectorAll('.wiki-list li')];
  const sections = [...root.querySelectorAll('.wiki-cat')];
  const params = new URLSearchParams(location.search);
  input.value = params.get('q') || '';
  function render() {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    items.forEach(li => {
      const hit = !q || li.dataset.q.includes(q);
      li.hidden = !hit;
      if (hit) shown += 1;
    });
    sections.forEach(s => { s.hidden = !s.querySelector('li:not([hidden])'); });
    count.textContent = `${shown}개 문서`;
  }
  input.addEventListener('input', render);
  render();
}
