// Event inserts supplement the original text; they never add choices or change
// its save coordinates. Exact source anchors prevent an insert drifting early.
export const EPISODE_CUTSCENES = Object.freeze([
  {
    "chapter": "1",
    "start": 8,
    "end": 11,
    "cg": "neuralAwakening",
    "anchor": "서인은 눈을 떴다.",
    "alt": "베개 위에서 눈을 뜬 서인과 관자놀이 옆 접속부",
    "endAnchor": "정확히 말하면, 기분이 좋았던 것 같았다.",
    "fingerprint": "beea82ef",
    "mobilePosition": "65% 45%"
  },
  {
    "chapter": "1",
    "start": 32,
    "end": 38,
    "cg": "kitchenAd",
    "anchor": "벽면 패널에서 광고가 재생되고 있었다.",
    "alt": "좁은 주방에서 벽면의 바다 광고에 시선이 멈춘 서인과 조리 중인 어머니",
    "endAnchor": "서인의 시선이 멈췄다.",
    "fingerprint": "2f04b55b",
    "mobilePosition": "54% 45%"
  },
  {
    "chapter": "1",
    "start": 122,
    "end": 126,
    "cg": "retirementHand",
    "anchor": "지우가 승인란을 눌렀다.",
    "alt": "퇴직 승인란을 누르는 지우의 손과 옆에서 멈춘 서인의 손",
    "endAnchor": "이번에는 붉은색 경고가 떴다.",
    "fingerprint": "a98f5c8e",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "2",
    "start": 65,
    "end": 81,
    "cg": "emptyDesk",
    "anchor": "회사에 도착하자 지우 자리는 비어 있었다.",
    "alt": "화분과 텀블러가 사라진 지우의 빈 책상을 보는 서인",
    "endAnchor": "그래서 찾으러 간다고 했다.",
    "fingerprint": "47978b8a",
    "mobilePosition": "55% 50%"
  },
  {
    "chapter": "2",
    "start": 95,
    "end": 98,
    "cg": "medicalTablet",
    "anchor": "그는 앉으라고 한 뒤 한참 말을 고르다가 태블릿을 밀었다.",
    "alt": "태블릿을 밀어 내는 아버지와 다른 쪽 팔목 안쪽의 투약 포트",
    "endAnchor": "숫자는 아래로 갈수록 붉어졌다.",
    "fingerprint": "922ffaac",
    "mobilePosition": "52% 48%"
  },
  {
    "chapter": "2",
    "start": 194,
    "end": 197,
    "cg": "clayTurn",
    "anchor": "지우가 점토를 손바닥 위에서 굴렸다.",
    "alt": "지우가 손바닥의 작은 찌그러진 점토 컵을 손끝으로 굴리는 모습",
    "endAnchor": "“한 달만 찾아볼 거야.”",
    "fingerprint": "9bb35e9b",
    "mobilePosition": "48% 50%"
  },
  {
    "chapter": "2",
    "start": 272,
    "end": 274,
    "cg": "nightWake",
    "anchor": "서인은 식은땀을 닦았다.",
    "alt": "광고꿈에서 깨어 좁은 침대 끝에서 식은땀을 닦는 서인",
    "endAnchor": "짜증이 났고, 손해 본 토큰이 아까웠고, 내일 피곤할 생각에 후회됐다.",
    "fingerprint": "e7112d2e",
    "mobilePosition": "58% 45%"
  },
  {
    "chapter": "3",
    "start": 56,
    "end": 60,
    "cg": "clayFailure",
    "anchor": "첫 수업에서 지우는 컵을 망쳤다.",
    "alt": "첫 컵이 주저앉는 순간",
    "endAnchor": "지우가 발을 뗐다. 흙은 이미 주저앉아 있었다.",
    "fingerprint": "fe740170",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "4",
    "start": 202,
    "end": 209,
    "cg": "sevenSeconds",
    "anchor": "손이 시계로 갔다.",
    "alt": "시계로 향한 손",
    "endAnchor": "“기존 조건으로 진행하죠.”",
    "fingerprint": "bb61d6f7",
    "mobilePosition": "65% 50%"
  },
  {
    "chapter": "5",
    "start": 41,
    "end": 46,
    "cg": "doyunRamen",
    "anchor": "남자는 컵라면 하나를 밀었다.",
    "alt": "라면을 미는 혁명가",
    "endAnchor": "“누구냐고요.”",
    "fingerprint": "c8aae062",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "6",
    "start": 281,
    "end": 287,
    "cg": "breadChoice",
    "anchor": "재호가 빵 봉투를 접었다.",
    "alt": "접힌 빵 봉투",
    "endAnchor": "“내가 빵 좋아하는 것도 진짜고, 망하는 게 무서운 것도 진짜예요.”",
    "fingerprint": "1b0e3d67",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "7",
    "start": 79,
    "end": 83,
    "cg": "sandShoe",
    "anchor": "민우가 모래를 신발에 쏟고 있었다.",
    "alt": "운동화 안의 모래",
    "endAnchor": "서인은 대답하지 않았다.",
    "fingerprint": "bce7bca3",
    "mobilePosition": "63% 50%"
  },
  {
    "chapter": "8",
    "start": 23,
    "end": 28,
    "cg": "unpricedSleep",
    "anchor": "객실 침대 위로 수면 메뉴가 떴다. 무자극 수면, 기억 정리, 맞춤형 서사 꿈. 가격은 없었다. 서인은 메뉴를 끝까지 내렸다. 맨 아래에 있어야 할 줄이 없었다.",
    "alt": "가격이 없는 수면",
    "endAnchor": "서인은 다시 말하지 않았다.",
    "fingerprint": "c37cb672",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "9",
    "start": 265,
    "end": 278,
    "cg": "metalGift",
    "anchor": "금속 조각이었다.",
    "alt": "기능 없는 금속 조각",
    "endAnchor": "“혼자 들어가도 혼자라고 생각하지 말라고.”",
    "fingerprint": "2b37247f",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "10",
    "start": 346,
    "end": 353,
    "cg": "procedureFace",
    "anchor": "장치가 서인의 머리를 감쌌다.",
    "alt": "빛이 좁아지기 전의 얼굴",
    "endAnchor": "똑같은 생각을 해 본 사람의 눈.",
    "fingerprint": "338b20de",
    "mobilePosition": "50% 45%"
  },
  {
    "chapter": "11",
    "start": 69,
    "end": 72,
    "cg": "metalGrip",
    "anchor": "손이 먼저 움직였다.",
    "alt": "아파서 쥔 것인지",
    "endAnchor": "말이 되기 전에 다음 단계가 시작됐다.",
    "fingerprint": "3e6c3984",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "12",
    "start": 268,
    "end": 272,
    "cg": "decisionDoor",
    "anchor": "그 너머에서 수십 개의 의사결정 창이 동시에 떠 있었다.",
    "alt": "문 너머의 결정들",
    "endAnchor": "누군가의 집을 움직였다.",
    "fingerprint": "caa2d564",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "13",
    "start": 212,
    "end": 214,
    "cg": "emptyFour",
    "anchor": "수요일 오후 두 시부터 여섯 시까지 네 칸이 비어 있었다.",
    "alt": "비어 있는 네 칸",
    "endAnchor": "일정 이름도 없었다.",
    "fingerprint": "1403fd58",
    "mobilePosition": "82% 48%"
  },
  {
    "chapter": "14",
    "start": 97,
    "end": 106,
    "cg": "wrongIsolation",
    "anchor": "외부 노출량 +7.2%.",
    "alt": "끊었는데 멈추지 않는 유출",
    "endAnchor": "너무 늦은 두 번째 시선이었다.",
    "fingerprint": "33f391e9",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "15",
    "start": 157,
    "end": 167,
    "cg": "oneAppointment",
    "anchor": "진료 일정 하나가 떠 있었다.",
    "alt": "닫지 않은 진료 일정",
    "endAnchor": "“한 개는 찾았네요.”",
    "fingerprint": "a1c6de66",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "16",
    "start": 236,
    "end": 237,
    "cg": "reserveTruck",
    "anchor": "서인은 영상을 멈췄다.",
    "alt": "남겨 둔 한 대",
    "endAnchor": "더 되감지 않았다.",
    "fingerprint": "76d9d1ca",
    "mobilePosition": "70% 50%"
  },
  {
    "chapter": "17",
    "start": 48,
    "end": 48,
    "cg": "twoApprovals",
    "anchor": "서인은 열람을 신청했다. 자문 계약에서 읽을 수 있는 범위인지 확인하겠다는 접수 문구가 떴다.",
    "alt": "아직 닫힌 열람",
    "endAnchor": "서인은 열람을 신청했다. 자문 계약에서 읽을 수 있는 범위인지 확인하겠다는 접수 문구가 떴다.",
    "fingerprint": "23972144",
    "mobilePosition": "64% 50%"
  },
  {
    "chapter": "18",
    "start": 143,
    "end": 143,
    "cg": "stoppedFinger",
    "anchor": "서인은 0.8초에서 멈췄다. 모노의 침묵과 같은 숫자였다. 그것만으로 같은 이유라고 할 수는 없었다.",
    "alt": "같은 간격 앞에서",
    "endAnchor": "서인은 0.8초에서 멈췄다. 모노의 침묵과 같은 숫자였다. 그것만으로 같은 이유라고 할 수는 없었다.",
    "fingerprint": "5cdbddf8",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "19",
    "start": 58,
    "end": 58,
    "cg": "changedChoice",
    "anchor": "서른여섯 개의 불빛을 띄워 둔 채 A를 눌렀다.",
    "alt": "처음 고른 표시를 지우고",
    "endAnchor": "서른여섯 개의 불빛을 띄워 둔 채 A를 눌렀다.",
    "fingerprint": "40ee0488",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "20",
    "start": 82,
    "end": 82,
    "cg": "signedCost",
    "anchor": "윤세라는 다음 사례로 넘기기 전에 바뀐 보고에 서명했다.",
    "alt": "자기 이름으로 남긴 비용",
    "endAnchor": "윤세라는 다음 사례로 넘기기 전에 바뀐 보고에 서명했다.",
    "fingerprint": "ef31c7a8",
    "mobilePosition": "58% 50%"
  },
  {
    "chapter": "21",
    "start": 125,
    "end": 126,
    "cg": "heldCall",
    "anchor": "서인은 다음 기록으로 넘기던 화면을 문해린의 기록으로 되돌렸다. 문해린의 목소리가 작아졌다.",
    "alt": "넘기지 못한 다음 기록",
    "endAnchor": "“학교는 못 간다고 해야 하는지, 그것도 아직 모르는 거죠?”",
    "fingerprint": "faba2022",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "22",
    "start": 149,
    "end": 149,
    "cg": "ep22-shoe",
    "anchor": "마정훈이 신발을 가져다주자 아이는 뒤축을 구겨 신었다. 그는 허리를 숙여 뒤축을 펴 줬다.",
    "alt": "병원 복도 바닥에서 아이 신발의 구겨진 뒤축을 펴 주는 마정훈의 손",
    "endAnchor": "마정훈이 신발을 가져다주자 아이는 뒤축을 구겨 신었다. 그는 허리를 숙여 뒤축을 펴 줬다.",
    "fingerprint": "3bc5614b",
    "mobilePosition": "35% 52%"
  },
  {
    "chapter": "23",
    "start": 81,
    "end": 86,
    "cg": "turnedBadge",
    "anchor": "잠시 뒤 직원이 복도로 나왔다. 가슴의 이름표를 손으로 뒤집고 있었다.",
    "alt": "뒤집은 이름표",
    "endAnchor": "직원이 접힌 이름표를 주머니에 넣었다.",
    "fingerprint": "e7e159a4",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "24",
    "start": 91,
    "end": 92,
    "cg": "releasedBreath",
    "anchor": "“지금 왔대요. 내일 그대로 오라고.”",
    "alt": "통화 너머의 한숨",
    "endAnchor": "그제야 한숨 소리가 났다.",
    "fingerprint": "bb19ccff",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "25",
    "start": 269,
    "end": 273,
    "cg": "paleDistrict",
    "anchor": "동부 27번의 색은 어제보다 옅었다.",
    "alt": "옅어진 지도 안의 밤",
    "endAnchor": "어머니는 자신이 고른 밤을 받지 못하고 있었다.",
    "fingerprint": "3b65d0c0",
    "mobilePosition": "78% 50%"
  },
  {
    "chapter": "26",
    "start": 226,
    "end": 230,
    "cg": "unequalKitchen",
    "anchor": "정미경은 대파 봉지를 다른 손으로 옮겼다.",
    "alt": "같은 주방에 도착한 대가",
    "endAnchor": "정미경이 봉지 손잡이를 내려다봤다.",
    "fingerprint": "4c369646",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "27",
    "start": 112,
    "end": 112,
    "cg": "memorySale",
    "anchor": "어머니는 그 한 줄을 3토큰에 건넸다.",
    "alt": "시장에서 팔린 한 줄",
    "endAnchor": "어머니는 그 한 줄을 3토큰에 건넸다.",
    "fingerprint": "7a517304",
    "mobilePosition": "62% 50%"
  },
  {
    "chapter": "28",
    "start": 183,
    "end": 185,
    "cg": "pepperThreshold",
    "anchor": "현관 바닥에 고추 모종 화분이 줄지어 있었다.",
    "alt": "집을 막아 둔 고추 모종",
    "endAnchor": "어머니는 그 얘기를 하지 않았다.",
    "fingerprint": "ce63886a",
    "mobilePosition": "50% 58%"
  },
  {
    "chapter": "29",
    "start": 200,
    "end": 202,
    "cg": "handsCenter",
    "anchor": "지우가 뒤에서 서인의 손목을 잡아 줬다.",
    "alt": "잠깐 가운데를 찾은 흙",
    "endAnchor": "흙이 잠깐 가운데를 찾았다.",
    "fingerprint": "97b81398",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "30",
    "start": 115,
    "end": 119,
    "cg": "settlementHands",
    "anchor": "화면 위로 손가락이 빠르게 움직였다.",
    "alt": "미지급분을 돌려주는 손",
    "endAnchor": "“‘대납’이라고 하지 마. 이건 미지급분이야.”",
    "fingerprint": "2afa1d97",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "19",
    "start": 4,
    "end": 4,
    "cg": "ep19-door",
    "anchor": "띠 아래 오른손목에는 어제 붙잡혔던 자국이 시퍼렇게 남아 있었다. 띠를 자국 위에서 살짝 비켜 끼우자 강연우의 눈이 그 손에 머물렀다. 서인은 괜찮다는 듯 손가락을 쫙 펴 보였다.",
    "alt": "붉은 문턱 밖에 멈춘 서인과 안쪽의 강연우, 두 사람 사이의 면담실 문",
    "endAnchor": "띠 아래 오른손목에는 어제 붙잡혔던 자국이 시퍼렇게 남아 있었다. 띠를 자국 위에서 살짝 비켜 끼우자 강연우의 눈이 그 손에 머물렀다. 서인은 괜찮다는 듯 손가락을 쫙 펴 보였다.",
    "fingerprint": "f247bf20",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "19",
    "start": 46,
    "end": 46,
    "cg": "ep19-b-preview",
    "anchor": "새벽 3시의 주택가. 창문 2,400개에 한꺼번에 불이 들어왔다.",
    "alt": "새벽 주택가의 창문에 불빛이 들어온 장면. 아직 A 선택이나 생활 상세는 나오지 않는다.",
    "endAnchor": "새벽 3시의 주택가. 창문 2,400개에 한꺼번에 불이 들어왔다.",
    "fingerprint": "39212851",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "19",
    "start": 49,
    "end": 49,
    "cg": "ep19-windows",
    "anchor": "A를 누르자 옆 동네에 불이 몇 개 켜졌다. 서른여섯 집. 그것도 운이 나쁠 때 얘기였다.",
    "alt": "최종 선택 전 A와 B의 예상 영향 비교: 한쪽은 넓은 구역에 많은 불빛, 다른 쪽은 36집의 불빛",
    "endAnchor": "A를 누르자 옆 동네에 불이 몇 개 켜졌다. 서른여섯 집. 그것도 운이 나쁠 때 얘기였다.",
    "fingerprint": "ec83a6cd",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "19-1",
    "start": 103,
    "end": 103,
    "cg": "ep19-1-alley",
    "anchor": "대기선의 냉장차였다. 운전석에서 졸던 물병 기사가 불 꺼진 승합차를 봤고, 경적을 누른 채 무전으로 배차실을 불렀다. 냉장차가 컨테이너 사이를 꽉 막고 섰다. 하역장 쪽에서 지게차 한 대가 전조등을 번쩍이며 밀고 들어왔다. 물병 기사가 운전석에서 뛰어내렸다.",
    "alt": "컨테이너 통로에서 냉장차와 지게차가 회색 승합차의 길을 막고 서인을 돕는 장면",
    "endAnchor": "대기선의 냉장차였다. 운전석에서 졸던 물병 기사가 불 꺼진 승합차를 봤고, 경적을 누른 채 무전으로 배차실을 불렀다. 냉장차가 컨테이너 사이를 꽉 막고 섰다. 하역장 쪽에서 지게차 한 대가 전조등을 번쩍이며 밀고 들어왔다. 물병 기사가 운전석에서 뛰어내렸다.",
    "fingerprint": "13910972",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "19-1",
    "start": 147,
    "end": 147,
    "cg": "ep19-1-window",
    "anchor": "서인은 4시 반에 집을 나섰다. 등 뒤에서 어머니가 문을 두 번 잠그는 소리가 났다. 공동주방 앞이 아니라 맞은편 계단참에 섰다. 자기 집 창이 올려다보이는 자리였다. 계단 아래 세워 둔 차 안에서는 강연우가 의자를 젖힌 채 졸고 있었다. 혼자는 못 보낸다며 따라온 참이었다.",
    "alt": "새벽 사택 계단참에서 어두운 자기 집 창을 보는 서인과 차에서 조는 강연우",
    "endAnchor": "서인은 4시 반에 집을 나섰다. 등 뒤에서 어머니가 문을 두 번 잠그는 소리가 났다. 공동주방 앞이 아니라 맞은편 계단참에 섰다. 자기 집 창이 올려다보이는 자리였다. 계단 아래 세워 둔 차 안에서는 강연우가 의자를 젖힌 채 졸고 있었다. 혼자는 못 보낸다며 따라온 참이었다.",
    "fingerprint": "2afeedc8",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "20",
    "start": 5,
    "end": 5,
    "cg": "ep20-door",
    "anchor": "옆에서 걷던 강연우가 우뚝 섰다. 서인은 윤세라를 똑바로 봤다.",
    "alt": "감사실 문 앞에서 문고리를 잡은 윤세라와 다친 손목으로 서류를 든 서인",
    "endAnchor": "옆에서 걷던 강연우가 우뚝 섰다. 서인은 윤세라를 똑바로 봤다.",
    "fingerprint": "a1537093",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "20",
    "start": 148,
    "end": 148,
    "cg": "ep20-box",
    "anchor": "“이 칸 누르면, 기다리는 사람까지 보호받은 걸로 남습니다. 공동주방에 온 7시 40분짜리 경로처럼요.”",
    "alt": "서인의 시점에서 본 감사 확인란과 공동주방 화이트보드·배식대 사진. 아직 빈 확인 칸이 남아 있다.",
    "endAnchor": "“이 칸 누르면, 기다리는 사람까지 보호받은 걸로 남습니다. 공동주방에 온 7시 40분짜리 경로처럼요.”",
    "fingerprint": "50c89423",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "20",
    "start": 193,
    "end": 193,
    "cg": "ep20-rooftop",
    "anchor": "도윤이 서인의 컵 위에 젓가락 한 벌을 올려 주었다.",
    "alt": "기업 옥상에서 도윤이 서인의 컵라면 위에 젓가락을 올려 주는 순간",
    "endAnchor": "도윤이 서인의 컵 위에 젓가락 한 벌을 올려 주었다.",
    "fingerprint": "6affa0a4",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "20-1",
    "start": 90,
    "end": 90,
    "cg": "ep20-1-kitchens",
    "anchor": "해린의 휴대폰에는 06:00이 남아 있었다.",
    "alt": "최은경의 집과 문해린의 집. 사람 없이 두 식탁과 현관에 남은 물건, 은경 집의 05:40 알람과 해린 집의 06:00 병원 시각",
    "endAnchor": "해린의 휴대폰에는 06:00이 남아 있었다.",
    "fingerprint": "e117268f",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "21",
    "start": 2,
    "end": 2,
    "cg": "ep21-contracts",
    "anchor": "왼쪽엔 접수 완료. 오른쪽엔 차액 회수.",
    "alt": "두 계약 화면. 왼쪽은 신청한 집이 본 화면, 오른쪽은 실제 처리 화면. 왼쪽엔 접수 완료, 오른쪽엔 차액 회수.",
    "endAnchor": "왼쪽엔 접수 완료. 오른쪽엔 차액 회수.",
    "fingerprint": "bb205c7f",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "21",
    "start": 148,
    "end": 148,
    "cg": "ep21-confirmation",
    "anchor": "윤세라도 그 줄을 봤다. 아무 말도 하지 않았다.",
    "alt": "어머니의 회색 행이 있는 목록에서 확인자 칸 위에 멈춘 서인의 손가락과 화면을 보는 윤세라",
    "endAnchor": "윤세라도 그 줄을 봤다. 아무 말도 하지 않았다.",
    "fingerprint": "b0117791",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "21-1",
    "start": 71,
    "end": 71,
    "cg": "ep21-1-discovery",
    "anchor": "깨진 창 너머로 옆 건물 옥상이 보였다. 그냥 뛰어서는 닿지 않을 것 같았다. 사이로 송출탑의 버팀대가 비스듬히 걸려 있었다. 끝이 흔들렸다.",
    "alt": "깨진 창 너머 옆 건물 옥상까지 닿지 않는 거리와 흔들리는 버팀대를 발견한 은경의 시점",
    "endAnchor": "깨진 창 너머로 옆 건물 옥상이 보였다. 그냥 뛰어서는 닿지 않을 것 같았다. 사이로 송출탑의 버팀대가 비스듬히 걸려 있었다. 끝이 흔들렸다.",
    "fingerprint": "a4d823a7",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "22",
    "start": 9,
    "end": 9,
    "cg": "ep22-corridor",
    "anchor": "두 사람 뒤에서 서인의 걸음이 멎었다. 그 승인서에는 서인의 이름도 들어 있었다.",
    "alt": "병원 복도에서 깨어 있는 마정훈과 외투를 베고 누운 딸, 백윤하와 뒤에 멈춘 서인. 아이 신발은 보이지 않는다",
    "endAnchor": "두 사람 뒤에서 서인의 걸음이 멎었다. 그 승인서에는 서인의 이름도 들어 있었다.",
    "fingerprint": "767ecba2",
    "mobilePosition": "50% 50%"
  },
  {
    "chapter": "22-1",
    "start": 35,
    "end": 35,
    "cg": "ep22-1-paper",
    "anchor": "백윤하가 종이 한 장을 탁자 가운데로 밀었다.",
    "alt": "아침 임원회의의 긴 탁자 가운데로 종이를 미는 백윤하의 손",
    "endAnchor": "백윤하가 종이 한 장을 탁자 가운데로 밀었다.",
    "fingerprint": "6292a3d9",
    "mobilePosition": "50% 50%"
  },
  {"chapter":"19","start":4,"end":4,"cg":"ep19-wrist-detail","anchor":"띠 아래 오른손목에는 어제 붙잡혔던 자국이 시퍼렇게 남아 있었다. 띠를 자국 위에서 살짝 비켜 끼우자 강연우의 눈이 그 손에 머물렀다. 서인은 괜찮다는 듯 손가락을 쫙 펴 보였다.","alt":"서인의 오른 손목 띠와 그 아래 시퍼런 자국을 보는 강연우의 시선","endAnchor":"띠 아래 오른손목에는 어제 붙잡혔던 자국이 시퍼렇게 남아 있었다. 띠를 자국 위에서 살짝 비켜 끼우자 강연우의 눈이 그 손에 머물렀다. 서인은 괜찮다는 듯 손가락을 쫙 펴 보였다.","fingerprint":"f247bf20","mobilePosition":"50% 50%"},
  {"chapter":"19","start":47,"end":47,"cg":"ep19-home-life","anchor":"우는 아기를 안고 일어나는 그림, 다시 잠들지 못해 부엌으로 나가는 그림, 출근 알람을 세 시간 앞당겨 맞추는 그림. 창마다 작은 그림이 흘러갔다. 예측 화면일 뿐인데 불빛만은 진짜 같았다.","alt":"B를 선택할 경우의 예상 생활: 아기를 안고 일어나는 집, 부엌으로 나가는 사람, 앞당긴 알람. 현실 장면이 아니라 예측 화면이다.","endAnchor":"우는 아기를 안고 일어나는 그림, 다시 잠들지 못해 부엌으로 나가는 그림, 출근 알람을 세 시간 앞당겨 맞추는 그림. 창마다 작은 그림이 흘러갔다. 예측 화면일 뿐인데 불빛만은 진짜 같았다.","fingerprint":"4fba4946","mobilePosition":"50% 50%"},
  {"chapter":"21","start":145,"end":145,"cg":"ep21-call-transfer","anchor":"곧바로 첫 병원 회선을 열었다.","alt":"강연우가 커피잔을 내려놓고 첫 병원 회선을 여는 순간. 서인은 문해린 병원 한 곳을 남기고, 나머지 여섯 곳은 연우가 맡는다.","endAnchor":"곧바로 첫 병원 회선을 열었다.","fingerprint":"fc96a3d2","mobilePosition":"50% 50%"},
  {"chapter":"22","start":124,"end":124,"cg":"ep22-compute-choice","anchor":"대기 넷은 내일로 넘어갔다. 이미 시작한 열한 건은 계속 돌았다.","alt":"진행 중인 공공 검사 11개 패널과 비어 있는 대기 4개 패널, 진행 유지와 내일 연기를 나란히 보여 주는 화면.","endAnchor":"대기 넷은 내일로 넘어갔다. 이미 시작한 열한 건은 계속 돌았다.","fingerprint":"55d17374","mobilePosition":"50% 50%"},
  {"chapter":"19-1","start":114,"end":114,"cg":"ep19-1-aftermath","anchor":"서인은 컨테이너에 등을 붙인 채 미끄러져 앉았다. 오른손이 말을 듣지 않았다. 배차 담당이 바닥에 떨어진 단말을 주워 왼손에 쥐여 줬다.","alt":"컨테이너에 주저앉은 서인에게 배차 담당이 떨어진 단말을 왼손으로 건네는 순간","endAnchor":"서인은 컨테이너에 등을 붙인 채 미끄러져 앉았다. 오른손이 말을 듣지 않았다. 배차 담당이 바닥에 떨어진 단말을 주워 왼손에 쥐여 줬다.","fingerprint":"908492bf","mobilePosition":"50% 50%"},
  {"chapter":"21-1","start":82,"end":82,"cg":"ep21-1-landing","anchor":"은경은 발끝에 아직 닿아 있던 버팀대 끝을 디뎌 찼다. 둘이 한꺼번에 옥상 안쪽으로 굴렀다.","alt":"버팀대를 차고 노인과 함께 옆 건물 옥상 안쪽으로 구르는 은경","endAnchor":"은경은 발끝에 아직 닿아 있던 버팀대 끝을 디뎌 찼다. 둘이 한꺼번에 옥상 안쪽으로 굴렀다.","fingerprint":"7a3e6387","mobilePosition":"50% 50%"},
  {"chapter":"22-1","start":42,"end":42,"cg":"ep22-1-document","anchor":"“‘공공 의료 검증 지원 요청 시, 제4 검증층 예비 연산의 일시 전환은 인지안전실장 전결로 한다. 지연 한도 3시간. 사후 보고.’”","alt":"법무 이사가 의결 조항을 읽는 손과 종이에 모인 시선. 제안자 칸은 아직 드러나지 않는다.","endAnchor":"“‘공공 의료 검증 지원 요청 시, 제4 검증층 예비 연산의 일시 전환은 인지안전실장 전결로 한다. 지연 한도 3시간. 사후 보고.’”","fingerprint":"aee49191","mobilePosition":"50% 50%"}
].map(Object.freeze));

const validatedCuts=new WeakMap();
function matchingSource(chapter,insert){
  if(!validatedCuts.has(chapter))validatedCuts.set(chapter,new Map());
  const checks=validatedCuts.get(chapter);
  if(!checks.has(insert)){
    const entries=chapter.beats?.slice(insert.start,insert.end+1)||[];let hash=2166136261;
    const text=entries.map(b=>b.text).join('\u001f');
    for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619)>>>0;
    checks.set(insert,entries.length===insert.end-insert.start+1&&entries[0]?.text===insert.anchor&&entries.at(-1)?.text===insert.endAnchor&&hash.toString(16)===insert.fingerprint);
  }
  return checks.get(insert);
}
export function withEpisodeCutscene(cue,chapter,index){
  // The cup collapsing and the later clay-covered smile are different events.
  // Resolve exact source anchors rather than hand-maintaining save indices.
  if(chapter?.id==='3'){
    const beats=chapter.beats||[];
    // The messy smile in the pottery studio has its own source-bound CG.
    const smile=beats.findIndex(b=>b.text==='광고꿈에서 본 지우보다 훨씬 엉망인 얼굴이었다.');
    const studioDirt=beats.findIndex(b=>b.text==='머리는 땀에 붙었고, 볼에는 흙이 묻었고, 앞치마는 엉망이었다.');
    const smileEnd=beats.findIndex(b=>b.text==='그런데 지우는 계속 웃었다.');
    if(smile>=0&&studioDirt===smile+1&&smileEnd===studioDirt+1&&index>=smile&&index<=smileEnd){
      return {...cue,cg:'jiwooClaySmile',actors:[],wallAd:false,shot:'insert',
        cutscene:{id:'jiwooClaySmile',alt:'땀에 젖고 흙이 묻은 지우가 물레 앞에서 계속 웃고 있다',
          position:'55% 44%',start:smile,phase:'',impact:null}};
    }

    // The camera follows Seo-in's gaze down to the *small* dirt residue
    // under Jiwoo's nails, then returns to their gentle can-clink.
    const start=beats.findIndex(b=>b.text==='그날 둘은 편의점 앞에서 맥주를 마셨다.');
    const nails=beats.findIndex(b=>b.text==='지우의 손톱 밑에는 씻어도 빠지지 않은 흙이 조금 남아 있었다.');
    const toast=beats.findIndex(b=>b.text==='서인은 그걸 보다가 자기 캔을 지우의 캔에 가볍게 부딪쳤다.');
    const previous=beats.findIndex((b,i)=>i>=start&&b.text==='둘이 웃었다.');
    if(start>=0&&previous===start+9&&nails===start+10&&toast===nails+1&&index>=start&&index<=toast){
      const cg=index===nails?'clayUnderNails':index===toast?'convenienceToast':'convenienceGaze';
      const point=index===nails?nails:index===toast?toast:start;
      const phase=index===nails?'detail':index===toast?'toast':'setup';
      const alt=index===nails?'서인의 시선 끝, 지우 손톱 밑에 조금 남은 도자기 흙':index===toast?'서인이 지우의 캔에 자기 캔을 가볍게 부딪친다':'편의점 앞에서 맥주를 마시며 웃는 서인과 지우';
      return {...cue,cg,actors:[],wallAd:false,shot:'insert',cutscene:{
        id:cg,alt,position:index===nails?'50% 54%':'50% 47%',
        start:point,phase,impact:null}};
    }
  }
  const inserts=EPISODE_CUTSCENES.filter(c=>c.chapter===chapter?.id&&index>=c.start&&index<=c.end&&matchingSource(chapter,c));
  const insert=inserts[0];
  if(!insert)return cue;
  const phase=insert.cg==='retirementHand'?(index>=126?'red':index>=123?'amber':'plain'):'';
  const frames=inserts.map(item=>({cg:item.cg,alt:item.alt,position:item.mobilePosition}));
  return {...cue,cg:insert.cg,actors:[],wallAd:false,shot:'insert',cutscene:{id:insert.cg,alt:insert.alt,position:insert.mobilePosition,phase,impact:insert.cg==='retirementHand'&&(index===122||index===125)?index:null,frames}};
}

// Chapters 3–30 keep their own authored audio, place and perception pathways.
// This cue is used only by the picture layer and disappears outside its range.
export function eventCutsceneDirection(chapter,index){
  if(!chapter||['1','2'].includes(chapter.id)||!Number.isInteger(index)||index<0||index>=chapter.beats?.length)return null;
  const cue=withEpisodeCutscene(null,chapter,index);
  return cue?{...cue,chapterId:chapter.id,sceneStart:cue.cutscene?.start??EPISODE_CUTSCENES.find(c=>c.cg===cue.cg&&c.chapter===chapter.id)?.start??index,focus:'',intro:false,blackout:false,holdMotion:true}:null;
}
