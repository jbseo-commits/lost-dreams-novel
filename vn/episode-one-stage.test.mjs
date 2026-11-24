import test from 'node:test';
import assert from 'node:assert/strict';
import {EpisodeOneStage} from './episode-one-stage.js';

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function image({loadAfter=0,decodeAfter=0}={}){
  const listeners={load:[],error:[]};
  const img={complete:loadAfter===0,naturalWidth:loadAfter===0?100:0,
    addEventListener(type,callback){listeners[type].push(callback);},
    decode(){return new Promise(resolve=>setTimeout(resolve,decodeAfter));}};
  if(loadAfter>0)setTimeout(()=>{img.complete=true;img.naturalWidth=100;for(const callback of listeners.load.splice(0))callback();},loadAfter);
  return img;
}

function stageWith(images){
  const stage=Object.create(EpisodeOneStage.prototype);
  Object.assign(stage,{cg:{querySelectorAll:()=>images},frameCount:images.length,frameIndex:0,frameSignature:'pair',frameGeneration:0,frameTimer:0,frameDecodePending:false,frameAutoCompleted:false,noMotion:false,paintCount:0});
  stage.paintFrame=()=>{stage.paintCount++;};
  return stage;
}

test('automatic frame change waits for all images to load and decode, then keeps the authored 1400ms hold',async()=>{
  const stage=stageWith([image({loadAfter:40,decodeAfter:20}),image({loadAfter:90,decodeAfter:30})]);
  stage.scheduleFrameTransition();
  await wait(70);
  assert.equal(stage.frameIndex,0,'the wide frame stays visible while the slower image is pending');
  assert.equal(stage.frameTimer,0,'the hold timer must not start before decode');
  await wait(80);
  assert.notEqual(stage.frameTimer,0,'the hold timer starts after both images decode');
  await wait(1350);
  assert.equal(stage.frameIndex,0,'the wide frame remains during the 1400ms hold');
  await wait(100);
  assert.equal(stage.frameIndex,1);
  assert.equal(stage.frameAutoCompleted,true);
});

test('invalidating a pending decode prevents a stale automatic frame change',async()=>{
  const stage=stageWith([image({loadAfter:100,decodeAfter:10}),image({loadAfter:100,decodeAfter:10})]);
  stage.scheduleFrameTransition();
  await wait(20);
  stage.cancelFrameTransition();
  stage.frameDecodePending=false;
  await wait(120);
  assert.equal(stage.frameIndex,0);
  assert.equal(stage.frameTimer,0);
  assert.equal(stage.frameAutoCompleted,false);
});

test('a failed frame decode keeps the currently loaded image and skips automatic transition',async()=>{
  const images=[image(),image()];images[1].decode=()=>Promise.reject(new Error('decode failed'));
  const stage=stageWith(images);stage.scheduleFrameTransition();
  await wait(20);
  assert.equal(stage.frameIndex,0);
  assert.equal(stage.frameTimer,0);
  assert.equal(stage.frameAutoCompleted,true);
});

test('a failed first frame falls back to the decoded frame instead of leaving a blank stage',async()=>{
  const images=[image(),image()];images[0].naturalWidth=0;images[0].decode=()=>Promise.reject(new Error('missing image'));
  const stage=stageWith(images);stage.scheduleFrameTransition();
  await wait(20);
  assert.equal(stage.frameIndex,1);
  assert.equal(stage.frameAutoCompleted,true);
});

test('manual navigation can show a decoded target when the current frame failed',async()=>{
  const images=[image(),image()];images[0].naturalWidth=0;images[0].decode=()=>Promise.reject(new Error('missing image'));
  const stage=stageWith(images);await stage.showNextFrameManually();
  assert.equal(stage.frameIndex,1);
  assert.equal(stage.frameAutoCompleted,true);
});

test('manual navigation does not wait forever for a pending current frame when its target is ready',async()=>{
  const pending={complete:false,naturalWidth:0,addEventListener(){},decode(){return new Promise(()=>{});}};
  const target=image();const stage=stageWith([pending,target]);
  const completed=await Promise.race([stage.showNextFrameManually().then(()=>true),wait(60).then(()=>false)]);
  assert.equal(completed,true,'manual navigation should only await the target frame');
  assert.equal(stage.frameIndex,1);
  assert.equal(stage.frameDecodePending,false);
});
