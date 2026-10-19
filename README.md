# Beyond Silicon — 반도체 인터랙티브 교과서

반도체를 분야별로 나누어 **교과서 설명과 브라우저 속 실험(LAB)** 으로 배우는 웹 교과서 시리즈입니다.

🌐 https://z1n00-1015.github.io/2d-mat-lib/

## 구성

- `index.html` — 표지: 전체 분야와 각 분야의 목차
- `chapters/<분야>/<장>.html` — 장 페이지 (사이드바 목차, 절 번호, LAB, 정리, 확인 문제, 이전/다음 장)
- `assets/js/book.js` — 분야·장 목록(`FIELDS`)과 공통 레이아웃, 퀴즈, 실험 모듈 지연 로딩
- `assets/css/book.css` — 디자인 시스템 (SemiBook과 같은 계열, 라이트/다크 테마)
- `assets/js/*.js` — 실험 모듈 (three.js, Canvas)
- `data/papers.json` — 연구실 논문 DB 공개용 데이터

### 분야 I. 차세대 반도체 물질

| 장 | 주제 | 실험 |
|---|---|---|
| 00 | 왜 새로운 반도체 물질인가 | 흑연에서 그래핀으로 |
| 01 | 결정 구조와 격자 | 3D 결정 구조 뷰어 · 2D 브라베 격자·역격자 |
| 02 | 결정면과 X선 회절 | 밀러 지수 · 브래그 반사 · 분말 XRD |
| 03 | 모아레와 트위스트로닉스 | 모아레 초격자 |
| 04 | 에너지 밴드와 광학 특성 | 밴드갭과 빛 · MoS₂ 층 수 · 디랙 원뿔 |
| 05 | 2D 물질과 광대역 반도체 | 물질 라인업 · 전력 반도체 비교 |
| 06 | 2D 반도체 트랜지스터 | 양자 터널링 · 단채널 MOSFET |
| 07 | 2D 물질의 합성 | 기계적 박리 · CVD 성장 |
| 08 | 연구실 논문 데이터 | 논문별 수치 비교 |
| 부록 | 용어 사전 | 검색 · 분류 필터 |

분야 II(반도체 공정)는 별도 사이트인 [SemiBook](https://z1n00-1015.github.io/semiwiki/)으로 연결됩니다.

## 새 분야 추가하기

1. `assets/js/book.js`의 `FIELDS` 배열에 분야(`id`, `title`, `chapters`)를 추가합니다.
2. `chapters/<분야 id>/` 폴더에 장 페이지를 만듭니다. 기존 장 페이지를 복사해 `data-field`, `data-chapter`와 본문만 바꾸면 됩니다.
3. 표지, 사이드바, 이전/다음 장 링크는 `FIELDS`에서 자동으로 만들어집니다.

## 연구실 논문 데이터

`data/papers.json`은 비공개 저장소 `lab-paper-library`의 `public_export.py`로 만든 파일입니다.
서지정보와 연구실에서 검토 완료한 수치만 들어 있고, 원문 인용과 AI 요약은 포함하지 않습니다.

GitHub Actions가 매시간 원본 저장소를 확인해 공개용 JSON을 다시 내보냅니다. 데이터가 바뀌면 `main`에 자동 커밋하고 GitHub Pages에도 배포합니다. 이를 위해 `2d-mat-lib` 저장소의 **Settings → Secrets and variables → Actions**에 `LAB_PAPER_LIBRARY_READ_TOKEN` Secret을 등록해야 합니다. 토큰은 비공개 저장소 `lab-paper-library`에만 접근하도록 만들고 `Contents: Read-only` 권한만 부여하세요. 수동으로 즉시 동기화하려면 Actions 탭에서 **Sync research paper database → Run workflow**를 실행하면 됩니다.

논문 등록·PDF 보관·AI 분석·사람 검토는 [로그인형 웹 논문 분석실](https://lab-paper-library-z1n00-1015.onrender.com)에서 진행하도록 구성 중입니다. 이 앱은 비공개 저장소의 별도 Render 서비스로 운영하며, Pages에는 서지정보와 검토 완료 수치만 게시합니다. Render 서비스와 Google 로그인을 설정하기 전까지 논문 분석실 주소는 사용할 수 없습니다.

```bash
# lab-paper-library 폴더에서
python public_export.py --out ../2d-mat-lib/data/papers.json
```

## 로컬 실행

빌드 과정이 없는 정적 사이트입니다.

```bash
python3 -m http.server 8000
# http://localhost:8000
```

시뮬레이션은 개념 이해를 위한 단순화 모델이며, 물성 수치는 문헌의 대표값입니다.
