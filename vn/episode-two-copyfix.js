// 2026-10-21 작가 승인 A안. 2화 151~205번 기존 저장 좌표를 유지하며 화면 대사를 원고와 동기화한다.
// story-data.js 전체 재생성 전까지 정본 원고에 맞추는 최소 범위 보정. 원본 비트·나머지 장은 변경하지 않는다.
const REVISED_BEATS = [
  {
    "text": "집을 나선 뒤 둘은 한동안 말없이 걸었다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "지우가 먼저 물었다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "“나 미친 것 같아?”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "서인은 바로 대답하지 못했다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "“조금.”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“솔직하네.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“너희 아버지 말도 맞잖아.”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“알아.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“동생은?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“알아.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“보험은?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“안다고.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "지우가 멈춰 섰다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "“나도 계산 다 해 봤어.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“그런데 왜 해?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“계산해도 안 나오는 게 있으니까.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“뭔데?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“그걸 모르겠으니까 이러는 거잖아.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "지우가 짜증스럽게 대꾸하더니 이내 웃었다.\n“우리 대화 계속 제자리네.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“네가 답을 모르겠다며.”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“그러니까. 나도 답 좀 알았으면 좋겠어.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "서인도 웃었다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "지우가 주머니에서 작은 것을 꺼냈다.\n어제 서인에게 줬던 찌그러진 점토였다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "“이거 다시 가져갔네?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“네 책상에서 몰래.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“도둑이냐?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“내 거잖아.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“줬으면 내 거지.”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“치사하게 나오네.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "지우가 웃으며 점토를 손바닥 위에 올렸다.\n“어제 엄마한테 물어봤어. 내가 이걸 왜 만들었냐고.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“뭐래?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“컵이래.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "서인이 점토를 봤다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "“저게?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“그러니까 초등학생 작품이지.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "지우가 웃었다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "“엄마가 그러더라. 어릴 때 내가 도자기 만드는 사람이 되겠다고 난리였대.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“기억나?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“전혀.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "지우는 점토를 뒤집어 보았다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "“그게 좀 무섭더라.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“뭐가.”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“내가 나중에 싫어져서 그만둔 거면 괜찮잖아.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "지우가 잠시 말을 골랐다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "“근데 싫어졌던 기억도 없으니까. 내가 왜 그만뒀는지도 모르겠고.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "서인은 아무 말 없이 지우를 바라봤다.",
    "speaker": "",
    "kind": "narration"
  },
  {
    "text": "“한 달만 찾아볼 거야.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "지우가 점토를 주머니에 넣었다.\n“도자기가 진짜 내 꿈이었는지, 그냥 애들 장난이었는지. 그것도 아니면 아무것도 없는지.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“아무것도 없으면?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“그럼 다시 광고 켜지 뭐.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“그렇게 쉽게?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“쉽겠냐.”\n지우가 웃다가 금방 웃음을 거뒀다.\n“아빠 말이 틀렸으면 좋겠어. 그럼 나도 덜 미안할 텐데.”",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "서인은 아까 태블릿에 떠 있던 붉은 숫자들을 떠올렸다.\n“그래도 하겠다고?”",
    "speaker": "서인",
    "kind": "dialogue"
  },
  {
    "text": "“응.”\n지우가 주머니 속 점토를 손끝으로 만지작거렸다.",
    "speaker": "지우",
    "kind": "dialogue"
  },
  {
    "text": "“서인아, 내가 뭘 포기하는지는 알아야 할 거 아니야.”\n잠시 후, 지우가 덧붙였다.\n“그래야 그게 정말 내 선택이지.”",
    "speaker": "지우",
    "kind": "dialogue"
  }
];
function fingerprint(chapter){
  let hash=2166136261;
  for(const char of chapter.beats.map(beat=>beat.text).join('\u001f'))for(let i=0;i<char.length;i++)hash=Math.imul(hash^char.charCodeAt(i),16777619)>>>0;
  return hash.toString(16);
}
export function syncEpisodeTwoCopy(story){
  const chapter=story?.chapters?.find(c=>c.id==='2');
  if(!chapter || chapter.beats?.length!==286 || fingerprint(chapter)!=='f4703a55' || REVISED_BEATS.length!==55) return false;
  for(let i=0;i<REVISED_BEATS.length;i++)chapter.beats[i+151]={...chapter.beats[i+151],...REVISED_BEATS[i]};
  chapter.__ep2Revision='20261021-A';
  return true;
}
