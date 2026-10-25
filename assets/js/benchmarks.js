const root = document.body.dataset.root || './';
const columns = [
  ['material', '소재'], ['layers', '층수'], ['synthesis_method', '합성 방법'],
  ['growth_temp_C', '성장 온도 (°C)'], ['wafer_size_inch', '웨이퍼 (inch)'],
  ['mobility_cm2Vs', '이동도 (cm²/V·s)'], ['on_off_ratio', 'On/off 비'],
  ['on_current_uA_um', 'On 전류 (μA/μm)'], ['contact_resistance_ohm_um', '접촉 저항 (Ω·μm)'],
  ['channel_length_nm', '채널 길이 (nm)'], ['devices_per_tier', '층별 FET 수'],
  ['measurement_condition', '측정·공정 조건'], ['year', '연도'], ['added_date', '추가일'],
  ['doi', 'DOI'], ['todo', '미확인 항목'],
];
const numericColumns = new Set(['growth_temp_C', 'wafer_size_inch', 'mobility_cm2Vs', 'on_current_uA_um', 'contact_resistance_ohm_um', 'channel_length_nm', 'devices_per_tier', 'year']);
const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });
let rows = [];
let sortState = { key: 'year', direction: 'desc' };
let chart = null;

function parseCSV(source) {
  const matrix = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"' && source[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell.replace(/\r$/, '')); matrix.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell.length || row.length) { row.push(cell.replace(/\r$/, '')); matrix.push(row); }
  const [header, ...records] = matrix;
  return records.filter(record => record.some(value => value.trim())).map(record => Object.fromEntries(header.map((key, index) => [key, (record[index] || '').trim()])));
}

function numericValue(value) {
  if (!value) return NaN;
  const normalized = value.replaceAll(',', '').replace(/×10\^([0-9]+)/g, 'e$1').replace(/[≥>≈~≤<]/g, '');
  const match = normalized.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/i);
  return match ? Number(match[0]) : NaN;
}

function isNew(row) {
  const date = new Date(`${row.added_date}T00:00:00`);
  if (!Number.isFinite(date.getTime())) return false;
  const age = (new Date().setHours(0, 0, 0, 0) - date.getTime()) / 86400000;
  return age >= 0 && age < 30;
}

function populateFilter(select, key) {
  const values = [...new Set(rows.flatMap(row => key === 'material' ? row[key].split(/\s*\+\s*/) : [row[key]]).filter(Boolean))].sort(collator.compare);
  for (const value of values) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}

function activeRows() {
  const material = document.querySelector('[data-material-filter]').value;
  const method = document.querySelector('[data-method-filter]').value;
  return rows.filter(row => (!material || row.material.split(/\s*\+\s*/).includes(material)) && (!method || row.synthesis_method === method));
}

function renderHeader() {
  const head = document.querySelector('[data-benchmark-head]');
  head.replaceChildren();
  for (const [key, label] of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.setAttribute('aria-sort', sortState.key === key ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'benchmark-sort';
    button.textContent = `${label}${sortState.key === key ? (sortState.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}`;
    button.addEventListener('click', () => {
      sortState = { key, direction: sortState.key === key && sortState.direction === 'asc' ? 'desc' : 'asc' };
      render();
    });
    th.append(button);
    head.append(th);
  }
}

function renderTable(filtered) {
  const body = document.querySelector('[data-benchmark-body]');
  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortState.key] || '', bv = b[sortState.key] || '';
    if (!av && bv) return 1;
    if (av && !bv) return -1;
    let order;
    if (numericColumns.has(sortState.key)) {
      const an = numericValue(av), bn = numericValue(bv);
      order = Number.isNaN(an) ? (Number.isNaN(bn) ? collator.compare(av, bv) : 1) : Number.isNaN(bn) ? -1 : an - bn;
    } else order = collator.compare(av, bv);
    return sortState.direction === 'asc' ? order : -order;
  });
  body.replaceChildren();
  if (!sorted.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = columns.length;
    td.className = 'benchmark-empty';
    td.textContent = '선택한 조건에 맞는 기록이 없습니다.';
    tr.append(td); body.append(tr); return;
  }
  for (const item of sorted) {
    const tr = document.createElement('tr');
    for (const [key] of columns) {
      const td = document.createElement('td');
      const value = item[key];
      if (key === 'material' && isNew(item)) {
        td.append(document.createTextNode(value || '—'));
        const badge = document.createElement('span');
        badge.className = 'benchmark-new'; badge.textContent = 'NEW';
        td.append(badge);
      } else if (key === 'doi' && value) {
        const link = document.createElement('a');
        link.href = `https://doi.org/${value}`;
        link.target = '_blank'; link.rel = 'noopener'; link.textContent = value;
        td.append(link);
      } else if (key === 'todo' && value) {
        const details = document.createElement('details');
        details.className = 'benchmark-todo';
        const summary = document.createElement('summary');
        summary.textContent = 'TODO';
        const text = document.createElement('span');
        text.textContent = value.split('; ').join(', ');
        details.append(summary, text); td.append(details);
      } else td.textContent = value || '—';
      if (!value && item.todo.split('; ').includes(key)) td.title = `TODO: ${key}`;
      tr.append(td);
    }
    body.append(tr);
  }
}

function renderChart(filtered) {
  const mount = document.querySelector('[data-benchmark-chart]');
  const status = document.querySelector('[data-chart-status]');
  const data = filtered.filter(row => Number.isFinite(numericValue(row.mobility_cm2Vs)) && Number.isFinite(Number(row.year)));
  if (!window.Chart) { status.textContent = '차트 라이브러리를 불러오지 못했습니다. 표 데이터는 계속 사용할 수 있습니다.'; return; }
  const colors = ['#8f7cff', '#21b8a9', '#ff9b65', '#54a8ff', '#e466a7'];
  const tickColor = getComputedStyle(document.documentElement).getPropertyValue('--text-2').trim() || '#555';
  const materials = [...new Set(data.map(row => row.material))];
  const datasets = materials.map((material, index) => ({
    label: material,
    data: data.filter(row => row.material === material).map(row => ({ x: Number(row.year), y: numericValue(row.mobility_cm2Vs), row })),
    backgroundColor: colors[index % colors.length],
    pointRadius: 6,
    pointHoverRadius: 9,
  }));
  if (chart) chart.destroy();
  chart = new Chart(mount, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: tickColor } },
        tooltip: { callbacks: { label(context) {
          const row = context.raw.row;
          const qualifier = /[≥>≈~]/.test(row.mobility_cm2Vs) ? ` (${row.mobility_cm2Vs})` : '';
          return `${row.material}: ${row.mobility_cm2Vs} cm²/V·s${qualifier} · ${row.measurement_condition}`;
        } } },
      },
      scales: {
        x: { type: 'linear', title: { display: true, text: '발표 연도', color: tickColor }, ticks: { precision: 0, color: tickColor }, grid: { color: `${tickColor}22` } },
        y: { type: 'linear', title: { display: true, text: '이동도 (cm²/V·s)', color: tickColor }, ticks: { color: tickColor }, grid: { color: `${tickColor}22` }, beginAtZero: true },
      },
    },
  });
  status.textContent = data.length ? `${data.length}개 이동도 결과 표시 · 필터와 연동` : '현재 필터에 해당하는 수치 이동도 데이터가 없습니다.';
}

function render() {
  renderHeader();
  const filtered = activeRows();
  renderTable(filtered);
  renderChart(filtered);
  document.querySelector('[data-table-status]').textContent = `${filtered.length} / ${rows.length}개 기록`;
}

async function init() {
  try {
    const response = await fetch(`${root}data/benchmarks.csv`, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`benchmarks.csv: ${response.status}`);
    rows = parseCSV(await response.text());
    populateFilter(document.querySelector('[data-material-filter]'), 'material');
    populateFilter(document.querySelector('[data-method-filter]'), 'synthesis_method');
    document.querySelectorAll('.benchmark-filters select').forEach(select => select.addEventListener('change', render));
    render();
  } catch (error) {
    document.querySelector('[data-table-status]').textContent = 'CSV 데이터를 불러오지 못했습니다. 페이지를 웹서버에서 열고 다시 확인해 주세요.';
    console.error('[benchmarks]', error);
  }
}

init();
