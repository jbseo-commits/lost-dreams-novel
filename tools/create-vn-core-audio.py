"""핵심 데모 자체 작곡·장면음. 외부 샘플이나 유료 서비스 없이 생성한다."""
from pathlib import Path
import hashlib,json,math,wave
import numpy as np

ROOT=Path(__file__).resolve().parent.parent/'vn'/'assets'/'core'
RATE=22050
rng=np.random.default_rng(11102026)

def note(midi,duration,soft=False):
 t=np.arange(round(duration*RATE))/RATE
 f=440*2**((midi-69)/12)
 # 짧은 건반 어택과 긴 잔향. 어떤 기존 곡도 인용하지 않는다.
 wave=sum(np.sin(2*np.pi*f*h*t)*v*np.exp(-t*(.55+h*.22)) for h,v in [(1,1),(2,.23),(3,.08),(5,.025)])
 env=np.minimum(1,t/(.12 if soft else .012))*np.minimum(1,np.maximum(0,duration-t)/.12)
 return wave*env

def music(name):
 duration=48.; out=np.zeros(round(duration*RATE));beat=.75
 themes={
 'core-clay':([62,65,69,67,64,65,60,62],[[50,57,65],[48,55,64],[46,53,62],[48,55,60]],.09),
 'core-pulse':([62,62,69,65,63,62,57,60],[[38,50,57],[41,53,60],[39,51,58],[38,50,57]],.065),
 'core-threshold':([62,69,70,65,64,62,57,61],[[38,50,57],[46,58,65],[43,55,62],[45,57,64]],.075),
 'core-after':([69,68,62,65,64,60,61,57],[[50,57,64],[46,53,60],[48,55,62],[45,52,61]],.062),
 }
 melody,chords,volume=themes[name]
 def put(at,signal,gain):
  start=round(at*RATE);stop=min(len(out),start+len(signal));out[start:stop]+=signal[:stop-start]*gain
 for bar in range(16):
  for pitch in chords[(bar//2)%4]:put(bar*4*beat,note(pitch,5.6,True),volume*.28)
  if name=='core-pulse':
   for step in [0,2]:put((bar*4+step)*beat,note(chords[(bar//2)%4][0]+12,1.15),volume*.36)
  # 긴 단음과 여백으로 대화가 들릴 자리를 남긴다.
  if bar%2==0:put(bar*4*beat+.18,note(melody[(bar//2)%8],4.3),volume)
  if name=='core-clay' and bar%4==3:put((bar*4+2.5)*beat,note(melody[(bar//2)%8]+12,2.1),volume*.25)
 return out

def ambience(name,duration):
 t=np.arange(round(duration*RATE))/RATE
 white=rng.normal(0,1,len(t));low=np.convolve(white,np.ones(240)/240,mode='same')
 if name=='core-wheel':
  return low*.28+np.sin(2*np.pi*53*t)*(.018+.007*np.sin(2*np.pi*.7*t))
 if name=='core-tide':
  swell=.2+.8*(.5+.5*np.sin(2*np.pi*t/5.7))**2
  return np.convolve(white,np.ones(18)/18,mode='same')*.22*swell
 if name=='core-air':return low*.2+np.sin(2*np.pi*61*t)*.005
 if name=='core-grip':return (low*.75+np.sin(2*np.pi*173*t)*.04)*np.exp(-t*9)
 return low*.38*np.exp(-t*5)+np.sin(2*np.pi*88*t)*.05*np.exp(-t*13)

def main():
 ROOT.mkdir(parents=True,exist_ok=True);records=[]
 jobs=[(n,48)for n in ['core-clay','core-pulse','core-threshold','core-after']]+[('core-wheel',12),('core-tide',16),('core-air',12),('core-grip',.7),('core-clay-fall',.7)]
 for name,duration in jobs:
  data=music(name)if duration==48 else ambience(name,duration)
  t=np.arange(len(data))/RATE;data*=np.minimum(1,t/.05)*np.minimum(1,np.maximum(0,duration-t)/.08)
  peak=float(np.max(np.abs(data)));assert peak<.85
  rms=float(np.sqrt(np.mean(data**2)));path=ROOT/(name+'.wav')
  with wave.open(str(path),'wb')as stream:
   stream.setnchannels(1);stream.setsampwidth(2);stream.setframerate(RATE);stream.writeframes((data*32767).astype('<i2').tobytes())
  records.append(dict(file=path.name,duration=duration,peak=peak,rms=rms,bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
 (ROOT/'audio-provenance.json').write_text(json.dumps(dict(method='자체 음 합성과 새 선율 작곡. 외부 음원·샘플·유료 서비스 미사용',seed=11102026,sampleRate=RATE,paidCreditsUsed=0,assets=records),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(dict(files=len(records),bytes=sum(r['bytes']for r in records),maxPeak=max(r['peak']for r in records))))
if __name__=='__main__':main()
