# 19~20화 컬러 삽화 콘티와 본문 내 연출안 — 2026-10-22

작가 요청: 19~20화의 장면이 머릿속에 잘 그려지지 않는 문제를 텍스트만으로 해결하려 하지 않는다. 웹소설·비주얼 노벨 양쪽에 **정식 컬러 삽화 5컷**을 넣고, 콘티부터 만든다. 팝업은 팝업 연출로 남기고, 본문 흐름 안에서 그려지는 CSS 연출을 별도로 설계한다.

기준 원문: `jbseo-commits/lost-dreams-novel` main `43efd49`의 `manuscript/ep019.md`, `manuscript/ep020.md`. 줄 번호는 이 기준이다. 원고·설정·웹 코드는 이 문서로 바꾸지 않는다.

## 0. 공통 원칙

- **그림은 이해를 돕고, 선택과 손해는 본문이 맡는다.** 그림이 대사·인과를 대신하지 않는다(AGENTS 최상위 원칙, settings/11 16-3).
- **삽입 위치는 해당 문단 바로 뒤.** 독자가 글로 먼저 읽고 그림으로 확인하게 한다. 결과가 나오기 전 장면에 결과를 그리지 않는다.
- **화면 글자는 그림에 넣지 않는다.** 생성 이미지의 한글은 깨진다. 화면·서류·이름표는 빈 발광면이나 흐린 줄로 그리고, 글자가 꼭 필요하면 HTML 오버레이로 얹는다.
- **비공개 유지:** 참여자 4(승인자 4)는 얼굴·실루엣·소속 표시 없이 빈자리와 접속 표시등만 그린다. 윤세라의 속마음을 표정으로 확정하지 않는다(무표정·절제).
- **두 판형:** 웹 세로 4:5(1080×1350), VN 가로 16:9(1920×1080). 한 번 생성해 자르지 말고 판형별로 따로 만든다. 콘티의 구도는 웹 기준이며 VN은 같은 순간을 가로로 넓힌다.

## 1. 화풍·인물 기준

현행 기준은 `vn/assets/teaser-style/`(티저 v16 계열): 또렷한 선, 면 명암, 셀 채색에 가까운 반실사 애니 일러스트. 따뜻한 텅스텐 주황과 차가운 청록 상층 빛의 대비.

| 인물 | 기준 그림 | 이 2화의 상태 |
| --- | --- | --- |
| 서인(남) | `teaser-style/seoin-standing.webp` — 검은 곱슬머리, 차콜 블레이저, 회색 셔츠 | 19화: 손목 띠 + 그 아래 오른손목 멍(19:9–11). 20화: 띠 없음, 손목 압박 붕대(20:7) |
| 강연우(여) | `vn/assets/yeonwoo.webp`(구 화풍) — 짧은 흑발, 남색 재킷, 검은 터틀넥, 태블릿 | **티저 화풍 기준 원화 없음.** 얼굴·복장만 참고하고 화풍은 티저로 옮긴다 |
| 윤세라(여) | `vn/assets/yoonsera.webp`(구 화풍) — 낮게 묶은 흑발, 회색 정장, 베이지 셔츠, 서류철 | **티저 화풍 기준 원화 없음.** 위와 같음 |
| 도윤(남) | `teaser-style/doyun-canonical.webp`, `doyun-ramen.webp` — 회색 후드, 헝클어진 흑발, 느긋한 웃음 | 20화 옥상. 컵라면·나무젓가락 |

**확인 필요 1:** 강연우·윤세라는 컷 제작 전에 티저 화풍 기준 원화를 먼저 한 장씩 만들고 작가 승인을 받는다. 승인 전에는 컷 1·2·3·4를 확정 생성하지 않는다.
**확인 필요 2:** 20화 압박 붕대가 오른손목인지 원문에 명시되지 않음. 19화 멍이 오른손목이고 "다시 꺾인 자리"(20:7)라 오른손으로 그린다 (제안).

## 2. 컷 콘티

### 컷 1 · 19화 — 문 밖에 남은 사람

- **위치:** 19:11 뒤 ("…손가락을 쫙 펴 보였다.")
- **이해시킬 것:** 강연우는 안, 서인은 밖. 같은 회사 사람인데 문이 사람을 가른다. 손목 띠가 서인을 묶고 있다.
- **구도:** 서인 등 뒤 낮은 어깨 너머 시점. 화면 가운데 열린 문틀. 문턱 바닥에 붉게 빛나는 선, 서인의 앞발 끝이 선 직전에서 멈춤. 문 안쪽 밝은 방: 긴 탁자, 의자 셋, 맞은편에 앉은 윤세라(일어서지 않음, 원경이라 표정 작게). 문 안 한 걸음 들어선 강연우가 반쯤 돌아보며 서인의 손 쪽을 봄.
- **전경 디테일:** 서인 오른손이 화면 아래쪽에 크게. 손가락을 펴 보이는 동작, 띠가 멍 위에서 살짝 비켜 끼워져 멍 가장자리가 보임.
- **빛:** 복도는 어두운 청회색, 문 안은 차가운 백색. 붉은 선이 유일한 강한 색.
- **금지:** 문 위 표지판·이름표 글자. 윤세라 감정 표정.

### 컷 2 · 19화 — 창문 2,400개

- **위치:** 19:103 뒤 ("…그것도 운이 나쁠 때 얘기였다.")
- **이해시킬 것:** B는 동네 전체를 깨운다, A는 옆 동네 일부만 위험하다. 숫자 차이를 불빛 면적으로 보이게.
- **구도:** 탁자 위에 떠오른 반투명 입체 지도를 서인 쪽 비스듬한 위에서 내려다봄. 화면 2/3는 새벽 3시 주택가 B 미리보기: 창문 수천 개가 한꺼번에 켜짐. 가까운 창 몇 개 안에 작은 장면(아기를 안고 일어나는 사람, 부엌으로 나가는 사람, 알람 맞추는 손). 오른쪽 위 옆 동네에는 A 쪽 불빛 수십 개만 드문드문. 서인 오른손 검지가 B 위에 떠 있고 아직 누르지 않음.
- **원경:** 지도 너머 탁자 맞은편에 윤세라의 손과 서류(얼굴은 지도 빛에 가려 흐림), 옆에 강연우의 펜.
- **빛:** 지도 홀로그램 청록, 켜진 창은 따뜻한 노랑. 따뜻한 빛이 많을수록 손해라는 대비.
- **기존 연출과 관계:** `reader-scenes.js`의 `node31b`(창 격자 도표)는 남기고 이 삽화를 그 앞에 둔다 (제안).
- **금지:** 지도 위 숫자·글자. "정답" 암시(A쪽을 밝게 강조하지 않음).

### 컷 3 · 20화 — 문고리를 잡은 사람

- **위치:** 20:13 뒤 ("…서인은 윤세라를 똑바로 봤다.")
- **이해시킬 것:** 윤세라가 문을 쥐고 먼저 말했다 — 문을 여는 권한도, 말할 순서도 그녀 쪽. 서인은 서류와 다친 손목으로 맞선다.
- **구도:** 감사실 앞 좁은 복도, 허리 높이 측면 시점. 왼쪽: 문고리를 잡은 윤세라, 몸은 문 쪽, 얼굴만 서인에게. 오른쪽: 서류(운행표·출동 기록 두 장)를 고쳐 쥔 서인, 손목 압박 붕대가 서류 모서리에 닿음. 가운데 뒤: 걷다 우뚝 멈춘 강연우.
- **빛:** 복도 천장 띠조명, 차갑고 평평함. 문 틈으로 감사실 안 화면 빛 한 줄.
- **19화 컷 1과의 대응:** 같은 "문" 구도. 19화엔 서인이 밖에 있었고 20화엔 문 앞에서 대등하게 선다 (제안).
- **금지:** 서류 글자. 손목 띠(20화엔 없음).

### 컷 4 · 20화 — 한 칸이 두 칸으로

- **위치:** 20:307 뒤 ("…공동주방에 온 7시 40분짜리 경로처럼요.")
- **이해시킬 것:** 확인란 한 칸이 보호받는 집과 기다리는 집을 같이 덮는다. 서인이 그걸 공동주방 사례와 나란히 놓았다.
- **구도:** 감사실 긴 탁자, 서인 손 클로즈업 위주. 서인 앞 작은 받침 위에 떠 있는 패널 둘: 왼쪽 패널에 넓은 확인란 하나(빈 칸)와 그 아래 대기 줄 하나가 빛남, 오른쪽 패널에 공동주방 화이트보드 사진(손글씨 자리만 흐린 선). 서인 검지가 확인란을 누르지 않고 짚고만 있음.
- **원경:** 탁자 끝 네 자리. 윤세라 자리만 실제 사람(서인 쪽을 봄). 나머지 셋은 빈 의자 위 원격 접속 표시등. 4번 자리는 표시등만, 실루엣 없음.
- **빛:** 감사실은 저채도 남회색. 대기 줄 하나만 호박색으로 깜박임.
- **기존 연출과 관계:** 분할 뒤 결과는 기존 `graybutton`(72시간 보호 범위 분할) 팝업이 맡는다. 삽화는 분할 직전, 팝업은 분할 후 (제안).
- **금지:** 4번 자리의 사람 형태. 화면 글자.

### 컷 5 · 20화 — 옥상의 젓가락 한 벌

- **위치:** 20:401 뒤 ("도윤이 서인의 컵 위에 젓가락 한 벌을 올려 주었다.")
- **이해시킬 것:** 하루 종일 기록과 권한 싸움 뒤에 사람이 차려 준 밥 한 끼. 그리고 서인은 이미 다음 일을 보고 있다.
- **구도:** 아르카디아 사옥 옥상, 밤 9시 넘어. 둘이 난간 쪽 낮은 턱에 나란히 앉음, 약간 뒤 측면. 서인은 컵 뚜껑을 손바닥으로 누르고 있고 그 컵 위에 도윤이 젓가락 한 벌을 올리는 순간. 서인 다른 손엔 단말, 화면 빛이 얼굴 아래를 비춤. 도윤은 쪼갠 젓가락을 든 채 웃음.
- **배경:** 상층 고층 사옥이므로 `rooftop.webp`(낡은 주거 옥상)는 쓰지 않는다. 깨끗한 기업 옥상 데크, 난간 너머 도시 야경, 멀리 하층 주거지의 따뜻한 불빛.
- **빛:** 옥상 조명 약함. 컵라면 김과 단말 청백광이 주광원.
- **금지:** 손목 띠(없음). 붕대는 보임.

## 3. 생성 프롬프트 초안

공통 머리말(모든 컷 앞에 붙임):

```
Korean science-fiction visual novel illustration, match the attached teaser-style references exactly:
crisp ink lines, flat cel shading with soft gradients, semi-realistic anime proportions, adult characters,
muted cool palette with warm tungsten accents. No text, no letters, no numbers, no logos, no watermark.
Screens and papers show only abstract glowing blocks and blurred lines.
```

공통 금지어: `text, letters, Korean characters, numbers, watermark, logo, extra fingers, extra people, chibi, childlike faces`

| 컷 | 본문 프롬프트 (영문) |
| --- | --- |
| 1 | Over-the-shoulder low angle from behind Seoin (young Korean man, black curly hair, charcoal blazer, gray shirt) standing in a dark blue-gray corridor. An open doorway in the center; a glowing red line on the floor at the threshold, his front shoe stopped just before it. Inside a bright cold-white interview room: one long table, three chairs, a composed woman in a gray suit seated, not standing, small in the distance. A short-haired woman in a navy jacket and black turtleneck has just stepped inside and half turns, looking at his hand. Foreground: his right hand large, fingers spread as if to say "I'm fine", a dark wristband slightly shifted, a fresh bruise visible at its edge. |
| 2 | High three-quarter view over a table. A translucent teal holographic map of a residential district at 3 a.m. floats above it. Most of the map: thousands of apartment windows lighting up warm yellow all at once; in a few close windows tiny scenes — a parent lifting a crying baby, someone walking to a kitchen, a hand setting an alarm. Upper right: a neighboring district with only a few dozen scattered lit windows. Seoin's right index finger hovers above the large district, not touching. Across the table, blurred by the hologram glow, a woman's hands on a folder and a pen lying beside another person's hand. |
| 3 | Narrow office corridor, waist-height side view, flat cold ceiling light. Left: a woman in a gray suit, hair in a low bun, gripping a door handle, body toward the door, face turned to the man. Right: Seoin holding two sheets of paper, right wrist wrapped in an elastic compression bandage, the paper edge touching it. Center background: a short-haired woman in a navy jacket stopped mid-step. A thin line of screen light leaking from the door gap. |
| 4 | Close-up of a long narrow audit table, muted navy-gray. Two floating glass panels above a small tray: left panel has one wide empty checkbox and below it a single amber-blinking row; right panel shows a photo of a whiteboard with blurred handwriting. Seoin's index finger rests on the checkbox without pressing. Far end of the table: four seats — one occupied by a woman in a gray suit looking toward him, the other three empty chairs with small remote-connection indicator lights; seat four has only a light, no figure. |
| 5 | Night rooftop deck of a clean corporate tower, city skyline beyond the railing, distant warm lights of low-rise housing below. Two men sit side by side on a low ledge, seen from slightly behind and to the side. Seoin presses the lid of a cup noodle with his palm, a phone in his other hand lighting his face from below, compression bandage on his right wrist. Doyun (messy black hair, gray hoodie, easy smile) lays a pair of split wooden chopsticks across the top of Seoin's cup. Steam rising, faint rooftop lamp. |

VN 16:9판은 같은 프롬프트 끝에 `wide 16:9 cinematic framing, keep characters within center 60%`를 붙인다.

## 4. 본문 안에서 그려지는 연출 (제안)

현재 웹 리더는 두 갈래다: 본문 안의 작은 그림(`ldx-life`/`ReaderScenes.inline`)과 화면을 덮는 팝업(`setpiece`). 19~20화의 핵심 장치는 팝업에만 있다. 팝업은 그대로 두고, **읽는 흐름 안에서 그려지는 연출**을 추가한다.

| 연출 | 적용 줄 | 동작 |
| --- | --- | --- |
| 시스템 메시지가 눈앞에 그려짐 | 19:17·143·155·165·189·209, 20:53·71·101·115·143·147·187·213·291·297·319·325 등 굵은 시스템 줄 | 문단이 화면에 들어오면 테두리를 그라디언트 선이 한 바퀴 그리며 채우고, 그 안에 글자가 한 줄씩 떠오름. 한 번만 재생, 다시 보면 정지 상태 |
| 접수 줄이 밀고 올라옴 | 19:165 "접수: 1분 전", 19:189 "접수: 방금" | 앞의 목록 문단 위로 새 줄이 아래에서 밀려 올라와 박힘. 연습이 아니라는 불안을 리듬으로 |
| A/B 갈림 | 19:79–83 | 두 안을 읽는 동안 문단 왼쪽 여백에 선 하나가 둘로 갈라지고, B 쪽 가지 끝에 불빛이 넓게, A 쪽엔 몇 개만 켜짐. 19:107 "B에서 손가락을 뗐다"에서 B 가지가 흐려짐 |
| 차량 동선과 시각 | 19:309–315, 20:61–77 | 가로 시간축 위로 두 차가 움직임: 시스템 경로는 07:40, 예비 차량은 05:18. 07:00 출차선 표시. 독자가 숫자를 비교하지 않아도 어느 차가 늦는지 보임 |
| 한 칸이 두 칸으로 | 20:293 → 20:321 | 293에서 넓은 칸 하나, 321에 오면 그 칸이 실제로 갈라지며 14:02 줄이 아래 칸으로 내려감 |
| 지우 메시지 | 20:231·235·237 | 말풍선 대신 휴대폰 알림이 문단 옆으로 들어왔다 남음. 사적 화면이라 시스템 메시지와 다른 색·모양 |

구현 조건(작가 승인 후):
- 숨김 상태는 `pointer-events:none`/`display:none`, 휴대폰 폭 400px에서 버튼 동작 확인(AGENTS).
- `prefers-reduced-motion`과 기존 "본문만" 토글에서는 정지된 완성 상태로만 보임.
- 연출이 꺼져도 본문만으로 인과가 이어져야 한다.

## 5. 도트 그림

도트는 코드로 찍을 수 있다(픽셀 격자 SVG/PNG). 다만 이 작품에선 쓰는 자리를 좁히는 게 맞다 (제안):
- 맞는 곳: 시스템이 보여 주는 화면 속 표현(지도 위 집 아이콘, 냉장차 점, 접속 표시등), 위 4절의 동선·갈림 연출 속 작은 기호.
- 안 맞는 곳: 정식 삽화. 인물·장면은 컬러 일러스트로 가고, 도트는 "기계가 보여 주는 세계"의 표식으로 구분하면 두 화법이 섞여도 의미가 생긴다.

## 6. 다음 단계

1. 작가: 컷 1~5 콘티 승인 / 수정 지시.
2. 강연우·윤세라 티저 화풍 기준 원화 제작·승인(확인 필요 1).
3. 컷별 웹·VN 판형 생성(외부 이미지 생성 도구). 이 세션에는 이미지 생성 도구가 없다.
4. 4절 본문 연출은 별도 승인 후 프로토타입.
