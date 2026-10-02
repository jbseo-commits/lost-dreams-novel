# 초반 서인 웹 동기화

2026-10-03 · `claude/writing-direction-doc-22sqhk`

`tools/sync_early_seoin_pilot.py`는 승인된 초반 보강 원고를 현재 `pilot.html`에 제한적으로 동기화한다.

- 독서 순서: 3→3-1→4, 5→5-1→6, 9→9-1→10→11.
- 새 장면 재현 세트피스: `mealchoice`, `uselesshour`, `returnlife`.
- 10화 동의 세트피스: 기존 단순 승인 연출 대신 현재 원고의 첫 번째/두 번째 읽기, 손을 뗌, 다시 승인, 완료 화면 재확인을 재현하는 `secondconsent`.
- 기존 1~40화, 기존 범퍼, 공통 엔진은 건드리지 않는다.

실행:

```bash
python tools/sync_early_seoin_pilot.py
```

스크립트는 예상 앵커가 바뀌었으면 assert로 중단한다. 성공 뒤에는 400×900에서 새 독서 순서, 팝업 기준 문장, 8배속/닫힘, 콘솔 오류와 기존 세트피스 회귀를 확인한다.

현재 GitHub 연결은 대용량 `pilot.html`을 부분 패치하는 쓰기 동작 없이 전체 파일 치환만 제공하므로, 이 브랜치에서는 안전한 결정적 패치 스크립트까지 커밋하고 실제 `pilot.html` 실행은 부분 패치가 가능한 실행 환경에서 수행한다.
