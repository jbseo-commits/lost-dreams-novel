import {coreDemoStory} from './core-demo.js?v=ep03-cinematic-20261023-r3';

// 실제 판매처가 확정되면 HTTPS 구매 주소만 지정한다. 브라우저에서 본편을 해제하지 않는다.
export const RELEASE = Object.freeze({
  edition:'core11',lastChapter:'11',purchaseUrl:null,
  endingTitle:'판단은 빨라졌다.\n그 답을 내린 사람은 여전히 서인일까.',
  endingBody:'모노가 되묻는다. 「본인이 맞습니까?」\n다음 면담까지 9시간 8분.\n서인의 다음 선택은 정식판에서 이어집니다.',
  comingSoon:'정식판 출시를 준비하고 있습니다. 구매 링크는 준비되는 대로 이곳에서 안내합니다.',
});
export const DEMO_CHAPTER_IDS=Object.freeze(['1','2','3','4','4-1','5','6','6-1','7','7-2','8','8-1','8-2','8-3','9','9-1','10','11']);
export function publicDemoStory(story){
  const demo=coreDemoStory(story);
  if(demo.chapters.map(c=>c.id).join('|')!==DEMO_CHAPTER_IDS.join('|'))throw Error('공개 데모의 읽기 순서를 확인하지 못했습니다.');
  return demo;
}
export function canReadChapter(chapterId){return DEMO_CHAPTER_IDS.includes(String(chapterId));}
export function purchaseLink(release=RELEASE){
  if(!release.purchaseUrl)return null;
  try{const url=new URL(release.purchaseUrl);return url.protocol==='https:'&&!url.username&&!url.password?url.href:null;}catch{return null;}
}
