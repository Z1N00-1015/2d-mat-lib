# 작업 인계 기록

Codex와 Claude가 작업을 마칠 때 맨 위에 새 항목을 추가한다. 최신 항목이 위에 온다.

<!-- 형식
## YYYY-MM-DD · codex|claude
- 변경:
- 남은 일/주의:
-->

## 2026-10-19 · claude
- 변경: 한 페이지 사이트를 SemiBook 형식의 웹 교과서로 재구성. 표지(`index.html`, 분야 목록) + 분야 I ‘차세대 반도체 물질’ 00–08장과 용어 사전(`chapters/nextgen/`). 분야 II ‘반도체 공정’은 SemiBook 외부 링크. `book.js`(FIELDS·레이아웃·퀴즈·지연 로딩), `book.css`(SemiBook 디자인 기반). 연구실 논문 DB 연동(`data/papers.json`, `papers.js`)은 01·04·06·07장 ‘관련 논문’과 08장. Codex 협업을 위해 `AGENTS.md`·`CLAUDE.md`·`HANDOFF.md`와 `main` 푸시 시 자동 배포(`deploy.yml`) 추가.
- 남은 일/주의: 참고 사이트 semi.euiyun.com은 Claude 클라우드 환경에서 접속이 막혀 표지 디자인에 반영하지 못함. 밝은 배경 그래프(`.stage.light`)는 다크 모드에서도 밝은 바탕을 유지함. 논문 DB 값 중 Hypotaxy 논문 On/Off 비 1.4·온전류 2,500 mA/μm는 원문 확인 필요(lab-paper-library HANDOFF 참고).
