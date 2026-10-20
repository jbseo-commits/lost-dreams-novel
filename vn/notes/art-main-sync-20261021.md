# 10~33화 비주얼노벨 아트 재통합 검수

- 기준: 2026-10-21, GitHub PR #108 (Draft). 최초 기반 main SHA 4ad31b4b16f88ae16074db9e938cd34f59b5db37.
- 기존 PR #102의 프로토타입 파일 30개를 선별해 최신 cutscene 기반에 재이관했으며 기존 1~30화 컷신, `vn/story-data.js`, 원고, 설정집은 덮어쓰지 않음.
- 현재 branch: art/vn-ep10-33-main-sync-20261021. main 직접 수정/병합/배포하지 않음.

## 실제 반영
- 10화 평가실 밝음/소등 SVG, 31~32화 의료 검증 회의실/병원 대기실 SVG, 33화 인재홀 외부/내부 SVG (총 6장).
- 31·32화 서인·백윤하 기존 원화 재사용 및 의료 검증/대기 시간 시퀀스. 33화 점수·입력보조 칩·3초·다은 점수 순차 연출.
- `vn/app.js`, `vn/index.html`, `vn/package.json`에 최신 main의 컷신 코드를 보존하는 최소 병합. 기존 인물 레이어 중복 및 UI 숨김 시 연출 잔상 수정.

## 검증
- GitHub Actions 실행 #39471509695: 108개 테스트 통과, 실패 0. 오프라인 단일 HTML 빌드 성공.
- `vn-ep10-33-main-sync-preview` 아티팩트 생성 확인. GitHub Actions 실행의 Artifacts에서 다운로드 가능.
- 빌드된 HTML에서 SVG 여섯 장을 재추출해 각각 1672x941 뷰박스를 확인하고 정적 이미지 렌더링으로 무대 구조를 확인함.
- Chromium headless 실제 플레이 테스트는 이 실행 환경에서 file:// URL 접근이 ERR_BLOCKED_BY_ADMINISTRATOR로 차단되어 미완료.
- 따라서 1280x720, 1920x1080, 390x844의 UI 실화면 연출/터치 검수는 이 재통합 PR에서 완료로 주장하지 않음.
- 이후 main에 다른 변경 커밋이 추가됐으므로 병합 직전 최신 main과 재검토 필요. PR은 Draft 보존.

## 원화 품질
- 여섯 SVG는 배치/고증용 벡터 시안. 정식 반회화풍 PNG 마스터/고화질 WebP 원화가 아니므로 G1~G9 최종 통과 상태가 아님.
- 과거 이미지 생성의 평가실 반복 오생성 결과는 GitHub에 적용하지 않았음.
- 다음 제작은 33화 인재홀 원화 품질 강화, 34화 외부 회의실과 환급 창구의 원고 검증 및 에셋 제작 순서.

## 재생·검수
- 현재 Draft PR: https://github.com/jbseo-commits/lost-dreams-novel/pull/108
- Actions 검수 실행: https://github.com/jbseo-commits/lost-dreams-novel/actions/runs/39471509695
- 이전 아트 프로토타입 이력: PR #102
