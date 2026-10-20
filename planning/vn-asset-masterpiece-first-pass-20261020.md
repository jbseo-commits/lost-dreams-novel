# VN 에셋 마스터피스 1차 제작 기록 (2026-10-20)

## 작업 범위
- 기준: `main` (작업 시작 SHA `00025cb7c7800d89646aebb69c77b0f6717f4c9a`).
- 작업 브랜치: `art/vn-masterpiece-audit-20261020`. **main 수정·병합 금지**.
- 로그인: `jbseo-commits`, 대상: `jbseo-commits/lost-dreams-novel`.
- 준수: `AGENTS.md`, `settings/02-world.md`, `settings/12-characters.md`, `docs/chat-loop.md`, 업로드된 VN 에셋 지시서.
- 회차 원문 `manuscript/ep010.md:3`: "평가실에는 의자가 하나뿐이었다."
- 회차 원문 `manuscript/ep010.md:17`: "조명이 꺼졌다."

## 1순위: 빈 무대 조사 작업
`tools/vn-asset-audit.mjs`로 31화 이상 `neutral` 비트의 **연속 구간/원고 출처/예시 문장/앞뒤 배경**을 JSON으로 추출한다.
- 실행: `node tools/vn-asset-audit.mjs > neutral-inventory.json`.
- 앞뒤 배경은 문맥 참고만 하고, 원고 근거가 없는 장소는 `needs-manuscript-review`로 남긴다.
- 같은 장소 묶기와 배경 교체는 실제 `manuscript/` 장면 검토 후 별도 단계.
- 업로드된 지시서의 11,997문장 집계는 2026-10-19 기준 선행 측정치다. 이 브랜치에서 **전체 실집계 실행은 미확인**.

## 첫 적용: 10화 평가실 오배치 해결을 위한 연결 시험
- 밝음: `vn/assets/ep10/bg-evaluation-room.svg` (1672×941 viewBox).
- 소등: `vn/assets/ep10/bg-evaluation-room-dark.svg` (같은 기하·의자).
- `vn/evaluation-room.js`는 원문 텍스트를 앵커로 밝기 전환을 결정한다. `vn/app.js`에는 우선 표시만 적용한다.
- 기존 원고, `story-data.js`, 선택지, 저장 규격은 **수정하지 않았다**.
- **이 둘은 최종 WebP 원화가 아니며 QA 미완료 상태의 SVG 시험 무대다.**

## 이미지 시안 실패 이력
원본 PNG 1672×941로 image_gen을 3회 수행했지만, 모두 관찰창·장비 등 원고에 확정되지 않은 구조가 남았다. G2 FAIL로 최종 사용에서 제외.
최대 재제작 3회 제한을 지켜 더 이상 같은 시안 반복하지 않는다. 이미지 생성 PNG는 이번 GitHub 브랜치에 반영되지 않았다.

## G1~G9 중간 판정
| 게이트 | 판정 | 근거 / 잔여 검증 |
| --- | --- | --- |
| G1 서사 판독 | PENDING | 실제 장면 무대에서 인물·압박 판독 필요 |
| G2 원고 일치 | PARTIAL (PNG FAIL) | SVG 1개 의자/소등만 구조적 일치, 원고 밖 해석 주의 |
| G3 인물 | N/A | 배경 |
| G4 표정 | N/A | 배경 |
| G5 계층 | PENDING | 기존 집·상층 병렬 검증 필요 |
| G6 UI 공존 | PENDING | 1280×720, 1920×1080, 390×844 플레이 캡처 필요 |
| G7 축소 | PENDING | 25% 썸네일 확인 필요 |
| G8 결함 | PENDING | 브라우저 실제 렌더 확인 필요 |
| G9 세트 정합 | PARTIAL | SVG 같은 기하이나 캡처 기반 검증 전 |

## 테스트 및 다음 단계
- 새 단위 테스트: `vn/evaluation-room.test.mjs`, `tools/vn-asset-audit.test.mjs`. `vn/package.json`에 추가.
- **이 채팅 연결에서는 저장소 전체 Node 실행 및 실제 브라우저 QA를 수행하지 못했다.** 테스트 PASS 주장 금지.
- 다음: 감사 스크립트 실행으로 31~105화 `neutral` 구간 실측 → 원고별 장소 확정 → 2순위 `meeting` 배경 낮/밤 세트 제작.
- 목표 품질 G1~G9 미달 상태에서는 최종 원화로 승인·배포하지 않는다.
