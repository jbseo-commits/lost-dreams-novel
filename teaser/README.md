# 티저 영상

「꿈을 잃은 세계」 티저 V6의 최종 영상과, 그 영상을 다시 만드는 렌더 코드입니다. 원화에서 자막을 걷어 낸 clean plate 위에 2.5D 애니메이션(변위·광원·HUD 감광)과 자막을 합성합니다.

| 경로 | 내용 |
| --- | --- |
| `output/lost-dreams-teaser-v6.mp4` | 최종본. 1280×720 / 24fps / H.264 / 50.0s, 오디오 없음 |
| `video-production-plan.md` | V4 shot 분석, 원본 고정형 컷별 연출, clean plate 목록 |
| `v6-revision-brief.md` | V5 장면별 판정과 V6 수정 지시서(통과 조건 포함) |
| `plates/` | `p01`~`p19.jpg`는 V4 원화 still(`p05`~`p07`은 자막 없는 image-gen 원본). `*-clean.png`, `p16-unlit.png`는 `tools/prep.py`가 만든 clean plate |
| `tools/` | 렌더 코드 |

## 다시 렌더하기

Python 3, numpy, Pillow, ffmpeg가 필요합니다. GPU나 영상 생성 모델은 쓰지 않습니다.

```bash
cd teaser
sh tools/fetch-fonts.sh                     # Noto Sans KR / Noto Serif KR 내려받기 (fonts/는 커밋하지 않음)
python3 tools/prep.py                       # clean plate 다시 만들기 (이미 plates/에 있으면 생략 가능)
python3 tools/render.py output/out.mp4      # 전체 렌더 (4코어 약 7분)
python3 tools/render.py /tmp/still --still 5,30,35.5   # 특정 시각 정지 프레임만
```

- `tools/engine.py`: 2x 소스 샘플링, 변위장, 광원 맵, 자막 박스, 그레인
- `tools/shots.py`: 컷별 연출. 아래쪽 `V6` 블록이 분석 테이크(구 S10~S15 병합)와 S16·S17·S19 수정본
- `tools/render.py`: 타임라인, 전환(딥·하드컷·블랙), 자막·숫자 카운터
- `tools/qa.py`: 프레임 간 튐 검사. `tools/qa6.py V5.mp4 V6.mp4`: V6 통과 조건 측정
- `tools/match.py`, `tools/boxdet2.py`: V4 분석과 자막 박스 위치 측정에 쓴 보조 스크립트
