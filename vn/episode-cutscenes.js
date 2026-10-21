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
    "start": 309,
    "end": 311,
    "cg": "twoApprovals",
    "anchor": "추가 승인 필요: 2.",
    "alt": "아직 닫힌 열람",
    "endAnchor": "대신 승인자 두 명에게 서인의 이름이 전달됐다.",
    "fingerprint": "b7c9d317",
    "mobilePosition": "64% 50%"
  },
  {
    "chapter": "18",
    "start": 163,
    "end": 164,
    "cg": "stoppedFinger",
    "anchor": "서인의 손가락이 멈췄다.",
    "alt": "같은 간격 앞에서",
    "endAnchor": "모노의 침묵과 같은 숫자였다.",
    "fingerprint": "dff5e82",
    "mobilePosition": "50% 48%"
  },
  {
    "chapter": "19",
    "start": 57,
    "end": 57,
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
    "start": 148,
    "end": 148,
    "cg": "hospitalShoe",
    "anchor": "그가 신발을 가져다주자 아이는 뒤축을 구겨 신었다. 남자는 허리를 숙여 뒤축을 펴 줬다.",
    "alt": "57분 뒤 신발 뒤축",
    "endAnchor": "그가 신발을 가져다주자 아이는 뒤축을 구겨 신었다. 남자는 허리를 숙여 뒤축을 펴 줬다.",
    "fingerprint": "ae77d5d8",
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
  }
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
  const insert=EPISODE_CUTSCENES.find(c=>c.chapter===chapter?.id&&index>=c.start&&index<=c.end);
  if(!insert||!matchingSource(chapter,insert))return cue;
  const phase=insert.cg==='retirementHand'?(index>=126?'red':index>=123?'amber':'plain'):'';
  return {...cue,cg:insert.cg,actors:[],wallAd:false,shot:'insert',cutscene:{id:insert.cg,alt:insert.alt,position:insert.mobilePosition,phase,impact:insert.cg==='retirementHand'&&(index===122||index===125)?index:null}};
}

// Chapters 3–30 keep their own authored audio, place and perception pathways.
// This cue is used only by the picture layer and disappears outside its range.
export function eventCutsceneDirection(chapter,index){
  if(!chapter||['1','2'].includes(chapter.id)||!Number.isInteger(index)||index<0||index>=chapter.beats?.length)return null;
  const cue=withEpisodeCutscene(null,chapter,index);
  return cue?{...cue,chapterId:chapter.id,sceneStart:EPISODE_CUTSCENES.find(c=>c.cg===cue.cg&&c.chapter===chapter.id).start,focus:'',intro:false,blackout:false,holdMotion:true}:null;
}
