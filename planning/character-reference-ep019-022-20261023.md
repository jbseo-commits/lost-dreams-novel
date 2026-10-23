# 19~22화 인물 기준 원화 5인 — 제작 프롬프트 (Codex용) — 2026-10-23

작가 요청: [19~22화 시퀀스 기획](ep019-022-sequence-plan-20261022.md) 4-2절의 기준 원화 5인(강연우·윤세라·백윤하·최은경·마정훈)을 현행 티저 화풍으로 만든다. 작업은 Codex에서 한다. 이 문서는 프롬프트와 작업 조건만 담는다. 원고·설정·VN 코드는 바꾸지 않는다.

## 0. 작업 조건 (Codex에 그대로 전달)

- **도구:** 기존 티저 화풍 원화와 같은 built-in image_gen. 기준은 `vn/assets/teaser-style/provenance.json`의 `doyun-canonical`·`mira-canonical`·`reho-canonical` 항목이다. 그 프롬프트 형식(Input1 편집 대상 + Input2 화풍만)을 그대로 따른다.
- **규격:** 세로 1024×1536, 전신 1인, 실제 투명 배경. WebP quality 96, 원본 크기·알파 보존.
- **저장 위치 (제안):** `vn/assets/teaser-style/<이름>-canonical.webp`. 원본 PNG 경로·SHA256·프롬프트·참고 이미지는 `provenance.json`에 기존 항목과 같은 형식으로 추가한다.
- **후보 수:** 인물마다 2장 만들고 작가가 고른다. 고르기 전에는 `provenance.json`에 확정으로 적지 않는다.
- **범위 밖:** VN 화면 연결(cast ID·state 허용 목록), 기존 구 화풍 파일 교체·삭제, 장면 컷 생성. 장면 컷은 기준 원화 승인 뒤에 한다.
- **브랜치:** `jbseo-commits/lost-dreams-novel`의 작업 브랜치에서 한다. 과거 `jjsjb88-alt` 저장소에는 올리지 않는다. main 병합은 작가 승인 뒤에만 한다.

### 화풍 입력 (Input2, STYLE ONLY)

| 대상 | 화풍 참고 |
| --- | --- |
| 여성 4인 | `vn/assets/teaser-style/mira-canonical.webp` |
| 마정훈 | `vn/assets/teaser-style/reho-canonical.webp` |
| 공통 보조 | `vn/assets/teaser-style/references/teaser-seoin-v16-face.png` (티저 원본 얼굴 프레임) |

기존 항목들이 쓴 화풍 입력 `exec-58532ec4….png`는 작가 PC에만 있다. 그 파일이 있으면 그것을 Input2로 쓰고, 없으면 위 표의 파일을 쓴다.

### 공통 꼬리말 (모든 프롬프트 끝에 붙임)

```
Input2 rendering STYLE ONLY: hand-drawn anime ink linework, clear cel-painted planes, restrained indigo shadow, soft warm rim light, painterly material grain. Transform input1 to this same teaser art direction. Keep the original person's sex/age/face, pose, gaze, costume and props, do not replace identity with the style-reference person. Natural adult anatomy and well-drawn hands. No photoreal airbrushing or glossy 3D. One figure only, same framing, no missing shoes if full body. Genuinely transparent background, no scenery, floor, rectangle, glow backdrop, text, watermark, contact sheet or multiple characters.
```

## 1. 강연우

- **원문 근거:** 여성(17:241·319, 18:7 "그녀"). 아르카디아 상층 실무, 서인 옆자리. 습관: 펜으로 탁자 두드림(19:57), 손목 두드림(20:269), 웃음이 잦음. 외형 묘사는 원문에 없음.
- **Input1:** `vn/assets/yeonwoo.webp` (구 화풍). 짧은 흑발, 남색 테일러드 재킷(소매 걷음), 검은 터틀넥, 검은 슬랙스와 구두, 왼손 태블릿, 오른손 주머니, 손목시계.
- **주의:** 구 화풍 그림의 얼굴이 중성적이다. 성인 여성으로 읽히게 하되 얼굴 정체성은 유지한다. 서인과 머리 모양이 겹치지 않게 곱슬 금지.

```
Use case: style-transfer. One production visual-novel character sprite. Input1 EDIT TARGET: Kang Yeonwoo, adult Korean WOMAN, short straight black hair cut above the ears with side-swept bangs, NOT Seoin curls, sharp observant eyes with a faint amused half-smile, navy tailored blazer with sleeves pushed up, black turtleneck, high-waisted black slacks, black leather shoes, left hand holding a slim dark tablet against her hip, right hand in pocket, wristwatch. Read clearly as a woman while keeping input1's face identity. Retain original full-body pose and composed, quick-witted coworker feeling.
```
+ 공통 꼬리말

## 2. 윤세라

- **원문 근거:** 여성, 공동 운영위원 "인간 승인 전용"(19:27). 절제·무표정, 눈을 떼지 않음(19:59), 코트 차림 등장(21:23). settings/12 5번: 중요한 사실을 늦게 말함, 밤에는 자동 응답.
- **Input1:** `vn/assets/yoonsera.webp` (구 화풍). 낮게 묶은 흑발(잔머리 조금), 회색 정장, 베이지 셔츠, 서류철과 펜, 금속 손목시계, 검은 로퍼.

```
Use case: style-transfer. One production visual-novel character sprite. Input1 EDIT TARGET: Yoon Sera, adult Korean WOMAN, black hair in a low neat bun with a few loose strands, calm unreadable expression with steady direct gaze, gray single-breasted pantsuit, beige collared blouse, black loafers, right hand holding a paper folder with a pen against it, metal wristwatch on left wrist. No smile, no emotional cue. Retain original full-body standing pose and her distinct face, older and more formal than Kang Yeonwoo.
```
+ 공통 꼬리말

## 3. 백윤하

- **원문 근거:** 여성, 아르카디아 실장급(settings/12 6번 "실장 자리"). 의견 대신 선택지 둘을 놓음, 책임질 일은 직접 처리(22화). 손끝으로 기록을 짚음(22-1).
- **Input1:** `vn/assets/yoonha.webp` (구 화풍). 턱선 흑발 단발(귀 뒤로 넘김), 차콜 정장, 흰 셔츠 깃 벌림, 오른손 주머니, 검은 가죽 시계, 로퍼.
- **주의:** 윤세라와 둘 다 정장 차림이다. 머리(단발 vs 묶음)와 색(차콜·흰색 vs 회색·베이지)으로 축소해도 구분되게 한다.

```
Use case: style-transfer. One production visual-novel character sprite. Input1 EDIT TARGET: Baek Yunha, adult Korean WOMAN, chin-length black bob tucked behind one ear, cool level gaze with a slight raised chin, charcoal tailored pantsuit, crisp white open-collar shirt, black loafers, right hand in trouser pocket, left arm relaxed with a black leather-strap watch. Must stay clearly distinct from a gray-suit woman with a bun: keep the bob haircut and charcoal-and-white palette. Retain original full-body pose and her distinct face.
```
+ 공통 꼬리말

## 4. 최은경

- **원문 근거:** 여성, 새벽 근무 노동자, 작업화(20-1:3, 21-1:13), 학교 다니는 딸의 엄마(20-1:7·79). 손바닥·무릎 부상은 21-1 꿈속 상태라 기준 원화에는 넣지 않는다.
- **Input1:** `vn/assets/eunkyung.webp` (구 화풍). 낮게 묶은 흑발 포니테일, 얼룩진 남색 작업 점퍼, 회색 티셔츠, 검은 카고 바지, 갈색 작업화, 주머니에 꽂은 작업 장갑, 오른손 휴대폰.
- **주의:** `mira-canonical`(초록 작업 재킷·포니테일)과 겹친다. 남색 점퍼, 장갑, 더 지친 얼굴로 구분한다.

```
Use case: style-transfer. One production visual-novel character sprite. Input1 EDIT TARGET: Choi Eunkyung, adult Korean WOMAN and working mother, black hair in a low practical ponytail with loose strands, tired but steady eyes, faded navy zip work jacket with dust stains, gray crewneck tee, black cargo trousers, worn brown lace-up work boots, olive work gloves tucked in the jacket pocket, right hand holding a phone at chest height. Keep her distinct from a green-jacket ponytail woman: navy jacket, gloves, more worn face. Retain original full-body pose and her distinct face.
```
+ 공통 꼬리말

## 5. 마정훈 (신규 디자인)

- **원문 근거:** 남성, 아르카디아 전략본부 상무(22:5). 학교 다닐 나이의 딸. 22화 밤과 22-1 아침: 넥타이 없음, 셔츠 단추 한 칸 밀림(22:17, 22-1:21), 밤샌 얼굴. 손가락으로 탁자를 두 번 두드림(22-1).
- **기존 그림 없음.** 아래 외형은 전부 (제안)이며 작가 승인 전까지 확정이 아니다.
- **디자인 제안:** 40대 초중반, 단정하게 넘긴 짧은 흑발과 관자놀이 쪽 흰머리 약간, 각진 턱, 날카롭지만 지친 눈. 서인·도윤·레호와 실루엣이 겹치지 않게 키 크고 어깨 넓은 정장 체형.
- **두 장으로 나눈다.** 기본형(평소 상무)과 22화 상태형(밤샘). 장면 컷 22-a·22-b·22-1-a는 상태형을 쓴다. 기본형은 이후 회차용이다.
- **입력:** Input1 없음(신규). Input2 `reho-canonical.webp`(화풍만). 그래서 프롬프트가 `style-transfer`가 아니라 `new-character`다.

**5-A 기본형**
```
Use case: new-character. One production visual-novel character sprite in the attached teaser art style. Ma Jeonghoon, adult Korean MAN in his early-to-mid forties, corporate strategy executive, tall with broad shoulders, short black hair neatly combed back with slight gray at the temples, square jaw, sharp tired eyes, no beard, NOT curly hair. Dark navy two-piece business suit, white dress shirt, dark tie, black oxford shoes, standing full body, one hand at his side, the other loosely holding a phone. Composed, impatient authority, not a cartoon villain.
```
+ 공통 꼬리말 (첫 문장 "Transform input1…"과 "Keep the original person's…"는 빼고, 화풍 문장과 그 뒤 품질·배경 문장만 붙인다)

**5-B 22화 상태형 (5-A 승인 후, 5-A를 Input1로)**
```
Use case: precise-object-edit / identity-preserve. Input1 is the approved Ma Jeonghoon sprite. Change ONLY his state for an all-night hospital vigil: no suit jacket, no tie, white dress shirt with sleeves rolled once and ONE BUTTON MISALIGNED so the placket sits one hole off, collar open, slightly creased trousers, hair a little disordered, visible fatigue under the eyes. Keep exact face, age, build, shoes, pose and framing. No props other than the phone.
```
+ 공통 꼬리말

## 6. 검수 기준 (작가 승인 전 Codex가 스스로 확인)

- 축소(약 160px 높이)해도 5인이 서로, 그리고 서인·도윤·지우·미라·레호와 구분되는가.
- 성별: 강연우·윤세라·백윤하·최은경은 여성, 마정훈은 남성.
- 배경이 실제 투명이고 바닥 그림자·사각형·글자가 없는가.
- 손가락 수와 손 모양, 소품(태블릿·서류철·휴대폰·장갑)이 남아 있는가.
- 최은경 기준 원화에 부상을 넣지 않았는가. 마정훈 5-B의 단추 어긋남이 실제로 보이는가.
- 구 화풍 원화 파일은 그대로 남아 있는가.

결과 보고: 인물마다 후보 2장 경로, 사용한 입력 파일, 프롬프트 원문, 실패·재시도 기록.
