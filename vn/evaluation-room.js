// Episode 10 evidence-gated interim stage: manuscript/ep010.md:3,17.
// SVG is a proof-of-placement, not a G1-G9-approved WebP master.
export const EVALUATION_ROOM='./assets/ep10/bg-evaluation-room.svg';
export const EVALUATION_ROOM_DARK='./assets/ep10/bg-evaluation-room-dark.svg';
export function evaluationRoomForBeat(chapter,index) {
 if(String(chapter?.id)!=='10'||!Array.isArray(chapter.beats))return '';
 if(!Number.isInteger(index)||index<0||index>=chapter.beats.length)return '';
 const start=chapter.beats.findIndex(b=>b.text?.includes('평가실에는 의자가 하나뿐이었다.'));
 if(start<0||index<start)return '';
 const blackout=chapter.beats.findIndex((b,i)=>i>=start&&b.text?.includes('조명이 꺼졌다.'));
 return blackout>=0&&index>=blackout?EVALUATION_ROOM_DARK:EVALUATION_ROOM;
}
