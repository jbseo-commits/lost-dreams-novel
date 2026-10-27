import {ep04ClueFor} from './episode-four-clues.js?v=ep04-clue-gallery-20261028-r1';
export class EpisodeOneStage {
  constructor(host,assets,{onInspect,onEvidence}={}){
    this.host=host;this.assets=assets;this.currentCg='';this.currentScene=-1;this.actorState=new Map();
    this.frameTimer=0;this.frameGeneration=0;this.frameDecodePending=false;this.frameAutoCompleted=false;this.noMotion=false;
    this.cg=document.createElement('div');this.cg.className='ep1-cg';
    this.actors=document.createElement('div');this.actors.className='ep1-actors';
    this.panel=document.createElement('section');this.panel.className='ep1-document';this.panel.hidden=true;this.panel.setAttribute('aria-label','장면 속 퇴직 의사 확인서');
    this.wall=document.createElement('div');this.wall.className='ep1-wall';this.wall.hidden=true;this.wall.setAttribute('aria-hidden','true');
    this.wall.style.backgroundImage=`url("${assets.sea}")`;
    this.lids=document.createElement('div');this.lids.className='ep1-lids';this.lids.setAttribute('aria-hidden','true');
    this.inspect=document.createElement('button');this.inspect.type='button';this.inspect.className='ep12-art-button';this.inspect.textContent='전체 그림';this.inspect.hidden=true;
    this.inspect.addEventListener('click',event=>{event.stopPropagation();if(this.inspectCue&&onInspect)onInspect(this.inspectCue);});
    this.frameButton=document.createElement('button');this.frameButton.type='button';this.frameButton.className='ep12-art-button ep1-frame-button';this.frameButton.textContent='세부 장면';this.frameButton.hidden=true;
    this.frameButton.addEventListener('click',event=>{event.stopPropagation();this.showNextFrameManually();});
    this.board=document.createElement('section');this.board.className='core-board';this.board.hidden=true;
    this.boardButton=document.createElement('button');this.boardButton.type='button';this.boardButton.textContent='관찰 기록 펼치기';
    this.boardButton.addEventListener('click',event=>{event.stopPropagation();if(this.boardCue&&onEvidence)onEvidence(this.boardCue);});
    this.host.append(this.cg,this.wall,this.actors,this.panel,this.lids,this.inspect,this.frameButton,this.board);
  }
  render(cue,{instant=false,reducedMotion=false}={}){
    const stage=this.host.parentElement;
    if(!cue){this.clear();return;}
    this.host.hidden=false;stage.classList.add('episode-one');
    stage.classList.toggle('core-scene',Boolean(cue.core));
    this.host.dataset.pressure=cue.pressure||'';
    this.board.hidden=!cue.board||Boolean(cue.cg);this.boardCue=cue.board?cue:null;
    if(cue.board&&!cue.cg){
      const signature=JSON.stringify(cue.board);
      if(this.board.dataset.signature!==signature){
        this.board.replaceChildren();
        const title=document.createElement('h3');title.textContent=cue.board.title;this.board.append(title);
        if(cue.board.kind==='clues'){
          const eyebrow=document.createElement('p');eyebrow.className='core-clue-eyebrow';eyebrow.textContent='아르카디아 협상';this.board.insertBefore(eyebrow,title);
          const gallery=document.createElement('div');gallery.className='core-clue-gallery';
          for(const [label,value] of cue.board.rows){
            const clue=ep04ClueFor(label);if(!clue)continue;
            const button=document.createElement('button');button.className='core-clue-card';button.type='button';button.setAttribute('aria-label',label+' 단서 컷신 보기');
            const img=document.createElement('img');img.src=this.assets[clue.asset];img.alt=clue.alt;img.loading='eager';img.decoding='async';
            const play=document.createElement('span');play.className='core-clue-play';play.textContent='▶';play.setAttribute('aria-hidden','true');
            const frame=document.createElement('span');frame.className='core-clue-image';frame.append(img,play);
            const heading=document.createElement('strong');heading.className='core-clue-name';heading.textContent=label;
            const detail=document.createElement('span');detail.className='core-clue-detail';detail.textContent=value;
            button.append(frame,heading,detail);
            button.addEventListener('click',event=>{event.stopPropagation();if(onEvidence)onEvidence(cue,label);});
            gallery.append(button);
          }
          this.board.append(gallery,this.boardButton);
        }else for(const [label,value] of cue.board.rows){
          const row=document.createElement('p'),key=document.createElement('span'),body=document.createElement('strong');
          key.textContent=label;body.textContent=value;row.append(key,body);this.board.append(row);
        }
        this.board.dataset.signature=signature;
      }
      this.board.dataset.kind=cue.board.kind;
    }
    stage.classList.toggle('episode-two',cue.chapterId==='2');
    this.host.dataset.chapterId=cue.chapterId||'1';
    this.host.dataset.holdMotion=String(Boolean(cue.holdMotion));
    this.host.dataset.dream=String(Boolean(cue.dream));
    stage.dataset.ep1Actors=cue.actors.length?'present':'';
    stage.dataset.ep1DocumentPhase=cue.document?.phase||'';
    stage.classList.toggle('ep1-blackout',cue.blackout);stage.classList.toggle('ep1-intro',cue.intro);stage.classList.toggle('ep1-cg-active',Boolean(cue.cg));
    const noMotion=instant||reducedMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.noMotion=noMotion;
    this.host.classList.toggle('ep1-no-motion',noMotion);
    this.host.dataset.shot=cue.shot;
    this.host.dataset.cg=cue.cg||'';
    this.host.dataset.cutscene=cue.cutscene?.id||'';
    this.inspectCue=cue.cutscene?cue:cue.cg==='dreamBeach'?{...cue,cutscene:{alt:'얕은 파도에 앉아 있는 지우와 광고꿈 속 해변'}}:null;this.inspect.hidden=!this.inspectCue;
    this.host.style.setProperty('--cut-position',cue.cutscene?.position||'50% 48%');
    this.cg.dataset.phase=cue.cutscene?.phase||'';
    const impact=cue.cutscene?.impact??'';
    if(this.cg.dataset.impact!==String(impact)){
      this.cg.classList.remove('ep12-cut-impact');
      if(impact!==''){void this.cg.offsetWidth;this.cg.classList.add('ep12-cut-impact');}
      this.cg.dataset.impact=String(impact);
    }
    const frameSignature=JSON.stringify(cue.cutscene?.frames||[]);
    const frameSetChanged=cue.cg!==this.currentCg||frameSignature!==this.frameSignature;
    if(frameSetChanged){
      this.cancelFrameTransition();this.frameDecodePending=false;this.frameAutoCompleted=false;
      this.frameList=cue.cutscene?.frames?.length?cue.cutscene.frames:cue.cg?[{cg:cue.cg,alt:cue.cutscene?.alt||''}]:[];this.frameCount=this.frameList.length;this.frameIndex=noMotion&&this.frameCount?this.frameCount-1:0;this.frameSignature=frameSignature;
      this.cg.replaceChildren();this.cg.style.backgroundImage=cue.cg?`url("${this.assets[cue.cg]}")`:'';
      for(let i=0;i<this.frameList.length;i++){const img=document.createElement('img');img.src=this.assets[this.frameList[i].cg];img.alt=this.frameList[i].alt||'';img.dataset.frame=String(i);if(i)img.hidden=true;this.cg.append(img);}
      this.currentCg=cue.cg;
    }
    if(noMotion&&this.frameCount){this.cancelFrameTransition();this.frameDecodePending=false;this.frameAutoCompleted=true;this.frameIndex=this.frameCount-1;}
    else if(!frameSetChanged&&this.frameAutoCompleted){}
    else if(this.frameCount>1&&!this.frameDecodePending&&!this.frameTimer)this.scheduleFrameTransition();
    this.paintFrame();this.frameButton.hidden=this.frameCount<2;
    this.cg.hidden=!cue.cg;this.wall.hidden=!cue.wallAd;
    this.lids.classList.toggle('closed',cue.intro||cue.blackout);
    const visible=new Set(cue.actors.map(p=>p.id));
    for(const [id,slot]of this.actorState)if(!visible.has(id)){slot.remove();this.actorState.delete(id);}
    for(const person of cue.actors){
      let slot=this.actorState.get(person.id);
      if(!slot){slot=document.createElement('div');slot.className='ep1-actor';slot.dataset.id=person.id;const body=document.createElement('div');body.className='ep1-actor-body';slot.append(body);this.actorState.set(person.id,slot);this.actors.append(slot);}
      slot.dataset.side=person.side;slot.dataset.gaze=person.gaze;slot.dataset.pose=person.pose;
      slot.classList.toggle('speaking',cue.focus===person.name);slot.classList.toggle('listening',Boolean(cue.focus)&&cue.focus!==person.name);
      if(slot.dataset.asset!==person.asset){
        slot.querySelectorAll('.ep1-previous').forEach(n=>n.remove());
        const previous=slot.querySelector('img');if(previous){previous.classList.add('ep1-previous');previous.setAttribute('aria-hidden','true');}
        const img=document.createElement('img');img.src=this.assets[person.asset];img.alt=person.name;img.className='ep1-current';slot.querySelector('.ep1-actor-body').append(img);slot.dataset.asset=person.asset;
      }
    }
    this.panel.hidden=!cue.document;
    if(cue.document){
      const compact=Boolean(cue.cutscene);
      this.panel.classList.toggle('ep12-document-compact',compact);
      const signature=JSON.stringify([cue.document,compact]);
      if(this.panel.dataset.signature!==signature){
        this.panel.replaceChildren();const eyebrow=document.createElement('span');eyebrow.className='ep1-doc-label';eyebrow.textContent='퇴직 의사 확인서';this.panel.append(eyebrow);
        if(cue.document.showRisks&&!compact){
          const rows=[['향후 24개월 예상 소득 안정성','−31.2%'],['가족 연계 의료 플랜 비용','+14.8%'],['주거 신용등급 하락 가능성','22.1%']];
          const dl=document.createElement('dl');rows.forEach(([k,v])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;dl.append(dt,dd);});this.panel.append(dl);
          const note=document.createElement('p');note.textContent='재고를 권장합니다.';this.panel.append(note);
        }
        this.panel.dataset.signature=signature;
      }
      this.panel.dataset.phase=cue.document.phase;
    }
    const sceneKey=`${cue.chapterId||'1'}:${cue.sceneStart}`;
    if(this.currentScene!==sceneKey){this.host.classList.remove('ep1-scene-arrive');void this.host.offsetWidth;this.host.classList.add('ep1-scene-arrive');this.currentScene=sceneKey;}
  }
  paintFrame(){
    for(const img of this.cg.querySelectorAll('img'))img.hidden=Number(img.dataset.frame)!==this.frameIndex;
    const frame=this.frameList[this.frameIndex];
    if(frame)this.cg.style.backgroundImage=`url("${this.assets[frame.cg]}")`;
    this.frameButton.textContent=this.frameIndex===0?'세부 장면':'전체 장면';
    this.frameButton.setAttribute('aria-label',this.frameIndex===0?'세부 장면 보기':'전체 장면 보기');
  }
  cancelFrameTransition(){
    clearTimeout(this.frameTimer);this.frameTimer=0;this.frameGeneration++;
  }
  async decodeFrameImages(generation){
    const images=[...this.cg.querySelectorAll('img')];
    if(images.length<2)return false;
    const ready=await Promise.all(images.map(img=>this.decodeFrameImage(img,generation)));
    return generation===this.frameGeneration?{ready,allReady:ready.every(Boolean)}:{ready:[],allReady:false};
  }
  async decodeFrameImage(img,generation){
    if(!img)return false;
    if(!img.complete){await new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});});}
    if(generation!==this.frameGeneration||!img.complete||img.naturalWidth<=0)return false;
    try{await img.decode();}catch{return false;}
    return generation===this.frameGeneration&&img.complete&&img.naturalWidth>0;
  }
  scheduleFrameTransition(){
    if(this.frameAutoCompleted||this.frameDecodePending||this.frameCount<2||this.noMotion)return;
    const generation=++this.frameGeneration,signature=this.frameSignature;
    this.frameDecodePending=true;
    this.decodeFrameImages(generation).then(ready=>{
      if(generation!==this.frameGeneration||this.frameSignature!==signature)return;
      this.frameDecodePending=false;
      if(!ready.allReady){
        if(!ready.ready[this.frameIndex]){const fallback=ready.ready.findIndex(Boolean);if(fallback>=0){this.frameIndex=fallback;this.paintFrame();}}
        this.frameAutoCompleted=true;return;
      }
      if(this.noMotion){this.frameAutoCompleted=true;this.frameIndex=this.frameCount-1;this.paintFrame();return;}
      this.frameTimer=setTimeout(()=>{
        this.frameTimer=0;
        if(generation!==this.frameGeneration||this.frameSignature!==signature||this.noMotion)return;
        this.frameAutoCompleted=true;this.frameIndex=this.frameCount-1;this.paintFrame();
      },1400);
    });
  }
  async showNextFrameManually(){
    if(this.frameCount<2)return;
    const generation=++this.frameGeneration;clearTimeout(this.frameTimer);this.frameTimer=0;this.frameAutoCompleted=true;this.frameDecodePending=true;
    const images=[...this.cg.querySelectorAll('img')];
    const target=(this.frameIndex+1)%this.frameCount;
    const ready=await this.decodeFrameImage(images[target],generation);
    if(generation!==this.frameGeneration)return;
    this.frameDecodePending=false;
    if(ready)this.frameIndex=target;
    this.paintFrame();
  }
  clear(){
    this.cancelFrameTransition();this.frameDecodePending=false;this.frameAutoCompleted=true;this.noMotion=false;
    this.host.hidden=true;this.host.parentElement.classList.remove('episode-one','episode-two','core-scene','ep1-blackout','ep1-intro','ep1-cg-active');this.host.parentElement.dataset.ep1Actors='';this.host.parentElement.dataset.ep1DocumentPhase='';this.actorState.clear();this.actors.replaceChildren();this.currentScene=-1;
    this.cg.replaceChildren();this.cg.style.backgroundImage='';this.cg.classList.remove('ep12-cut-impact');this.cg.dataset.impact='';this.cg.dataset.phase='';this.currentCg='';this.frameSignature='';this.frameList=[];this.frameCount=0;this.frameIndex=0;this.frameButton.hidden=true;
    this.host.dataset.cutscene='';this.host.dataset.cg='';this.host.dataset.shot='';this.host.dataset.dream='false';this.host.dataset.holdMotion='false';this.panel.hidden=true;this.wall.hidden=true;this.inspect.hidden=true;this.inspectCue=null;
    this.board.hidden=true;this.boardCue=null;this.host.dataset.pressure='';
  }
}
