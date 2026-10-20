// 32화 병원 6층 대기실. 인물이 앉지 않는 빈 의자를 배경으로 둔다.
// manuscript/ep032.md:258-358, source-anchored, not a shared generic clinic.
export const HOSPITAL_WAITING_AFTERNOON='./assets/ep32/bg-hospital-waiting-afternoon.svg';
export function hospitalWaitingForBeat(chapter,index) {
 if(String(chapter?.id)!=='32'||!Array.isArray(chapter.beats)||!Number.isInteger(index)||index<0||index>=chapter.beats.length)return '';
 const line=Number(chapter.beats[index].sourceLine);
 if(!Number.isInteger(line)||line<258||line>=359)return '';
 if(!chapter.beats.some(b=>b.text?.includes('세르젠 협력 병원 6층')))return '';
 return HOSPITAL_WAITING_AFTERNOON;
}
