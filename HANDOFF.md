# 작업 인계 기록

Codex와 Claude가 작업을 마칠 때 맨 위에 새 항목을 추가한다. 최신 항목이 위에 온다.

<!-- 형식
## YYYY-MM-DD · codex|claude
- 변경:
- 남은 일/주의:
-->

## 2026-10-19 · codex
- 변경: `lab-paper-library`의 `public_export.py`를 매시간 실행하는 `sync-paper-data.yml` 자동화를 추가. 검증된 JSON에 변경이 있을 때만 `main`에 커밋하고 GitHub Pages에 배포. README에 수동 실행과 설정 안내 추가.
- 남은 일/주의: `2d-mat-lib` 저장소 Actions Secret `LAB_PAPER_LIBRARY_READ_TOKEN` 등록 필요. 이 토큰은 `lab-paper-library`의 Contents 읽기 권한만 가져야 함. 원본 비공개 저장소 경로는 `Z1N00-1015/lab-paper-library`로 설정했으며 실제 저장소 이름·소유자가 다르면 워크플로를 수정해야 함.

## 2026-10-19 · codex
- 변경: 사이트 목차를 세 큰 장(2차원 물질의 이해, 결정학과 분석 방법, 반도체 물리와 소자 응용)으로 재구성하고 기존 장 페이지를 주제별 폴더로 이동. XRD·Raman·TEM·XPS·AFM 개요 페이지를 추가하고 FeS-FET와 NCFET 설명 및 용어 사전을 보강. 표지와 각 장의 안내 문구·번호도 새 구조에 맞춤.
- 남은 일/주의: 분석법 페이지는 원리와 활용 범위의 입문 개요이며, 고급 측정·정량 해석은 후속 보강 가능.

## 2026-10-19 · claude
- 변경: 한 페이지 사이트를 SemiBook 형식의 웹 교과서로 재구성. 표지(`index.html`, 분야 목록) + 분야 I ‘차세대 반도체 물질’ 00–08장과 용어 사전(`chapters/nextgen/`). 분야 II ‘반도체 공정’은 SemiBook 외부 링크. `book.js`(FIELDS·레이아웃·퀴즈·지연 로딩), `book.css`(SemiBook 디자인 기반). 연구실 논문 DB 연동(`data/papers.json`, `papers.js`)은 01·04·06·07장 ‘관련 논문’과 08장. Codex 협업을 위해 `AGENTS.md`·`CLAUDE.md`·`HANDOFF.md`와 `main` 푸시 시 자동 배포(`deploy.yml`) 추가.
- 남은 일/주의: 참고 사이트 semi.euiyun.com은 Claude 클라우드 환경에서 접속이 막혀 표지 디자인에 반영하지 못함. 밝은 배경 그래프(`.stage.light`)는 다크 모드에서도 밝은 바탕을 유지함. 논문 DB 값 중 Hypotaxy 논문 On/Off 비 1.4·온전류 2,500 mA/μm는 원문 확인 필요(lab-paper-library HANDOFF 참고).
