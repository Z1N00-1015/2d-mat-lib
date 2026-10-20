# 개발 에이전트 지침 (Codex · Claude 공통)

## 프로젝트
- Beyond Silicon: 2D 물질, 결정학·분석법, 반도체 물리와 소자 응용의 연구 분야를 소개하는 정적 웹사이트.
- 사용자는 프로그래밍 초보자다. 변경 내용과 확인 방법을 쉬운 한국어로 설명한다.
- 빌드 과정 없는 순수 HTML/CSS/JS. 외부 라이브러리는 `assets/vendor/`의 three.js와 Pretendard 웹폰트(CDN)뿐이다. 새 의존성을 함부로 추가하지 않는다.

## 구조
- `index.html`: 표지(전체 분야 목록). `assets/js/hub.js`가 `FIELDS`로 그린다.
- `assets/js/book-runtime.js`: 분야·페이지 목록 `FIELDS`, 상단 바·사이드바·절 목차·이전/다음 페이지·테마, 실험 모듈 지연 로딩(`MODULES`).
- `chapters/<분야 id>/<장 id>.html`: 장 페이지. `<body data-root="../../" data-field="…" data-chapter="…">`.
- `assets/css/book.css`: 디자인 시스템(SemiBook 계열). 색은 CSS 변수만 쓰고 라이트/다크를 모두 확인한다.
- `assets/js/<실험>.js`: 실험 모듈. `export function init(root)` 하나를 내보내고, 페이지의 `data-module="이름"` 요소가 화면 근처에 오면 실행된다.
- `data/papers.json`: 연구실 논문 DB(비공개 저장소 `lab-paper-library`의 `public_export.py`)가 만든 공개용 데이터. 직접 고치지 말고 다시 내보낸다. `data/paper-focus.json`은 논문별 핵심 소재를 정리하는 사이트 전용 수동 관리 파일이다.

## 작성 규칙
- 용어는 고체물리·반도체공학 분야의 표준 표기를 쓰고, 처음 나올 때 영문을 괄호로 병기한다. 새 용어는 `assets/js/glossary.js`에도 추가한다.
- 분야 페이지 형식: `chapter-head`(eyebrow·h1·lede·빈 `.meta`) → `h2`(`<span class="sec">1.1</span>`) 절 → `section.lab`(`LAB 장-번호`) → `.summary`.
- 새 장을 만들면 `FIELDS`의 해당 분야 `chapters`에 추가한다(표지·사이드바·이전/다음 장이 자동 생성됨).
- 새 실험 모듈을 만들면 `book-runtime.js`의 `MODULES`에 등록한다.
- 시뮬레이션은 교육용 단순화 모델임을 본문이나 힌트에 밝힌다. 수치는 문헌 대표값을 쓰고 출처가 분명하지 않은 값을 만들지 않는다.
- 공개 사이트이므로 논문 원문 인용, 미공개 연구 데이터, 개인 정보, API 키를 넣지 않는다.

## 확인과 배포
- 확인: 저장소 폴더에서 `python3 -m http.server 8000` 후 http://localhost:8000 에서 바꾼 페이지를 열고, 브라우저 콘솔 오류가 없는지와 라이트/다크·모바일 폭을 확인한다.
- 배포: `main`에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 `gh-pages` 브랜치로 자동 배포한다. `gh-pages`에 직접 푸시하지 않는다.

## Claude·Codex 협업 규칙
- 두 에이전트 모두 이 `AGENTS.md`를 공통 지침으로 따른다(`CLAUDE.md`는 이 파일을 불러오기만 한다).
- 작업 시작 전: `git pull`, `HANDOFF.md`의 최근 기록, `git status`, `git log --oneline -5`를 확인한다.
- 커밋 메시지 첫 줄 앞에 `[codex]` 또는 `[claude]`를 붙인다.
- 작업을 마치면 `HANDOFF.md` 맨 위에 날짜·에이전트·변경 내용·남은 일을 짧게 추가하고 커밋·푸시한다.
- 다른 에이전트가 커밋하지 않은 변경은 덮어쓰거나 되돌리지 말고 사용자에게 먼저 알린다.
- 같은 시간에 두 에이전트가 같은 파일을 고치지 않도록, 사용자가 한 번에 한 에이전트에게 작업을 맡긴다.
