// ================= AKSESORIS v50: musik (gitar, oud, rebana, seruling) =================
// Panel ketuk/keyboard, suara dibuat dari nol (Karplus-Strong untuk petikan senar, sintesis untuk rebana & seruling).
(()=>{
const ctx=()=>{if(typeof muted!=='undefined'&&muted)return null;try{if(!ACX)ACX=new(window.AudioContext||window.webkitAudioContext)();if(ACX.state=='suspended')ACX.resume();return ACX}catch(e){return null}};
const noiseB=c=>KX.nb||(KX.nb=(()=>{const b=c.createBuffer(1,c.sampleRate>>1,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b})());
const PB={};
function pluck(f,vol){const c=ctx();if(!c)return;const k=Math.round(f*10);let b=PB[k];
 if(!b){const sr=c.sampleRate,N=Math.max(2,Math.round(sr/f)),L=Math.floor(sr*1.6),d=new Float32Array(L),r=new Float32Array(N);for(let i=0;i<N;i++)r[i]=Math.random()*2-1;let p=0;for(let i=0;i<L;i++){const q=(p+1)%N;d[i]=r[p];r[p]=(r[p]+r[q])*.4985;p=q}b=c.createBuffer(1,L,sr);b.getChannelData(0).set(d);PB[k]=b}
 const s=c.createBufferSource(),g=c.createGain();s.buffer=b;g.gain.value=vol||.55;s.connect(g);g.connect(c.destination);s.start()}
function drum(kind){const c=ctx();if(!c)return;const n=c.currentTime;
 if(kind==0){const o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(170,n);o.frequency.exponentialRampToValueAtTime(55,n+.2);g.gain.setValueAtTime(.9,n);g.gain.exponentialRampToValueAtTime(.001,n+.35);o.connect(g);g.connect(c.destination);o.start(n);o.stop(n+.4)}
 else{const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseB(c);f.type='bandpass';f.frequency.value=kind==1?2600:7000;f.Q.value=kind==1?.9:3;g.gain.setValueAtTime(kind==1?.8:.5,n);g.gain.exponentialRampToValueAtTime(.001,n+(kind==1?.12:.45));s.connect(f);f.connect(g);g.connect(c.destination);s.start(n);s.stop(n+.5)}}
let FT=null;
function fluteOff(){if(!FT)return;const{o,o2,l,g,c}=FT,n=c.currentTime;try{g.gain.cancelScheduledValues(n);g.gain.setValueAtTime(g.gain.value,n);g.gain.linearRampToValueAtTime(0,n+.12);[o,o2,l].forEach(x=>x.stop(n+.15))}catch(e){}FT=null}
function fluteOn(f){fluteOff();const c=ctx();if(!c)return;const o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),g2=c.createGain(),l=c.createOscillator(),lg=c.createGain(),n=c.currentTime;
 o.type='sine';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*2;l.frequency.value=5.2;lg.gain.value=f*.012;l.connect(lg);lg.connect(o.frequency);lg.connect(o2.frequency);g2.gain.value=.22;o2.connect(g2);g2.connect(g);o.connect(g);g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(.3,n+.06);g.connect(c.destination);o.start();o2.start();l.start();FT={o,o2,l,g,c}}
KX.whoosh=(d,v)=>{const c=ctx();if(!c)return;d=d||.6;const n=c.currentTime,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=noiseB(c);f.type='lowpass';f.frequency.setValueAtTime(1800,n);f.frequency.exponentialRampToValueAtTime(200,n+d);g.gain.setValueAtTime(v||.2,n);g.gain.exponentialRampToValueAtTime(.001,n+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start(n);s.stop(n+Math.min(d,.5))};
const hz=(b,s)=>b*Math.pow(2,s/12),ST=[82.41,110,146.83,196,246.94,329.63],CHD={C:[-1,3,2,0,1,0],G:[3,2,0,0,0,3],Am:[-1,0,2,2,1,0],F:[1,3,3,2,1,1]},
 HJ=[293.66,311.13,369.99,392,440,466.16,523.25,587.33],PE=[523.25,587.33,659.25,783.99,880,1046.5],SONG=[0,0,7,7,9,9,7,5,5,4,4,2,2,0];
const now=()=>typeof cl!=='undefined'?cl.elapsedTime:0,hit=()=>{KX.nt=now()},seq=(arr,gap,fn)=>{arr.forEach((a,i)=>setTimeout(()=>{if(KX.pn){hit();fn(a)}},i*gap))};
const strum=fr=>{hit();let j=0;fr.forEach((f,i)=>{if(f>=0)setTimeout(()=>pluck(hz(ST[i],f)),(j++)*45)})};
const INS={
 gitar:{e:'🎸',n:'Gitar',pads:ST.map((f,i)=>({l:'EADGBE'[i]+(i<3?2:i<5?3:4),k:String(i+1),dn:()=>{hit();pluck(f)}})),
  ex:[...Object.keys(CHD).map((c,i)=>({l:'Akor '+c,k:'zxcv'[i],fn:()=>strum(CHD[c])})),{l:'▶ Lagu',k:'b',fn:()=>seq(SONG,380,s=>pluck(hz(261.63,s)))}]},
 oud:{e:'🪕',n:'Oud (Gambus)',pads:HJ.map((f,i)=>({l:['ري','مي♭','فا♯','صول','لا','سي♭','دو','ري'][i],k:String(i+1),dn:()=>{hit();pluck(f,.6)}})),
  ex:[{l:'Maqam Hijaz ▶',k:'z',fn:()=>seq([0,1,2,3,4,5,6,7,6,5,3,2,1,0],230,i=>pluck(HJ[i],.6))},{l:'Petik semua',k:'x',fn:()=>seq(HJ,70,f=>pluck(f,.6))}]},
 rebana:{e:'🥁',n:'Rebana Hadroh',cl:'ar',pads:[{l:'دُمْ',k:'1',dn:()=>{hit();drum(0)}},{l:'تَكْ',k:'2',dn:()=>{hit();drum(1)}},{l:'جَلْ',k:'3',dn:()=>{hit();drum(2)}}],
  ex:[{l:'▶ Irama hadroh',k:'z',fn:()=>seq([0,1,1,0,0,1,1,2,0,1,1,0,0,1,2,2],260,i=>drum(i))}]},
 seruling:{e:'🎶',n:'Seruling Bambu',pads:PE.map((f,i)=>({l:'CDEGAC'[i],k:String(i+1),dn:()=>{hit();fluteOn(f)},up:fluteOff})),
  ex:[{l:'▶ Nada pelangi',k:'z',fn:()=>seq([0,1,2,3,4,5,4,3,2,1,0],300,i=>{fluteOn(PE[i]);setTimeout(fluteOff,230)})}]}};
const css=document.createElement('style');css.textContent=`#kxp{position:fixed;left:50%;bottom:max(8px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(96vw,680px);z-index:30;background:#fffaf0f2;border:3px solid #1d2b53;border-radius:18px;padding:8px 10px;font-family:"Baloo 2",sans-serif;color:#1d2b53;box-shadow:0 5px 0 #1d2b53;user-select:none;-webkit-user-select:none}
#kxp .kxh{display:flex;gap:8px;align-items:center;justify-content:space-between}#kxp .kxh small{opacity:.6;flex:1}
#kxp .kxg,#kxp .kxf{display:flex;gap:6px;margin-top:6px}
#kxp button{flex:1;min-height:52px;border:3px solid #1d2b53;border-radius:12px;background:#ffe8a6;font:700 16px "Baloo 2",sans-serif;color:#1d2b53;touch-action:none;position:relative;padding:2px}
#kxp button.on,#kxp button:active{background:#ff8a3d;transform:translateY(2px)}
#kxp button small{display:block;font-size:11px;opacity:.55;font-weight:500}
#kxp .kxf button{background:#c9ecff;min-height:42px;font-size:14px}
#kxp #kxx{flex:0 0 auto;min-height:36px;padding:0 12px;background:#ffd1d1}
#kxp .ar{font-family:Amiri,serif;font-size:22px}`;document.head.appendChild(css);
let pnl=null;
const press=i=>{const p=KX.pn.I.pads[i];if(!p||KX.pn.dn[i])return;KX.pn.dn[i]=1;const b=pnl.querySelector('[data-p="'+i+'"]');b&&b.classList.add('on');p.dn()},
rel=i=>{if(!KX.pn||!KX.pn.dn[i])return;KX.pn.dn[i]=0;const p=KX.pn.I.pads[i],b=pnl&&pnl.querySelector('[data-p="'+i+'"]');b&&b.classList.remove('on');if(p.up)p.up()};
KX.panel=id=>{const I=INS[id];if(!I||KX.pn||open||CV||RID||EXM.on)return;
 KX.pn={id,I,dn:{}};open=true;mode='acc';pnl=document.createElement('div');pnl.id='kxp';
 pnl.innerHTML=`<div class="kxh"><b>${I.e} ${I.n}</b><small>Ketuk tombol, atau pakai keyboard</small><button id="kxx">✖ Selesai (Esc)</button></div><div class="kxg">${I.pads.map((p,i)=>`<button data-p="${i}" class="${I.cl||''}">${p.l}<small>${p.k}</small></button>`).join('')}</div>${I.ex?`<div class="kxf">${I.ex.map((p,i)=>`<button data-e="${i}">${p.l}<small>${p.k}</small></button>`).join('')}</div>`:''}`;
 document.body.appendChild(pnl);
 pnl.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b)return;e.preventDefault();if(b.id=='kxx')KX.close();else if(b.dataset.p!=null)press(+b.dataset.p);else if(b.dataset.e!=null)I.ex[+b.dataset.e].fn()});
 ['pointerup','pointercancel','pointerout'].forEach(ev=>pnl.addEventListener(ev,e=>{const b=e.target.closest('[data-p]');if(b)rel(+b.dataset.p)}));
 snd(660,.1,'triangle');ts(I.e+' '+I.n+': ketuk tombolnya untuk bermain!',2200)};
KX.close=()=>{if(!KX.pn)return;const id=KX.pn.id;Object.keys(KX.pn.dn).forEach(i=>rel(+i));fluteOff();KX.last=id;KX.pn=null;if(pnl){pnl.remove();pnl=null}open=false;mode=null;snd(440,.1,'triangle')};
addEventListener('keydown',e=>{if(!KX.pn)return;e.stopImmediatePropagation();e.preventDefault();const k=e.key.toLowerCase();if(k=='escape'){KX.close();return}if(e.repeat)return;const I=KX.pn.I;I.pads.forEach((p,i)=>{if(p.k==k)press(i)});(I.ex||[]).forEach(p=>{if(p.k==k)p.fn()})},true);
addEventListener('keyup',e=>{if(!KX.pn)return;const k=e.key.toLowerCase();KX.pn.I.pads.forEach((p,i)=>{if(p.k==k)rel(i)})},true);
// pose: kamera pindah ke depan, lengan memainkan alat (dipanggil tiap frame dari 37)
const FRONT={gitar:{x:.2,y:2,z:.72,rz:-1.15},oud:{x:.2,y:2.1,z:.72,rz:-1.1}},V=new THREE.Vector3();
KX.pose=(t,dt)=>{const pn=KX.pn;KX.pf=Math.max(0,Math.min(1,(KX.pf||0)+(pn?dt*2.2:-dt*3)));const f=KX.pf;if(f<=0)return;const id=pn?pn.id:KX.last,ry=P.rotation.y;
 cam.position.lerp(V.set(pl.x+Math.sin(ry)*8,pl.y+4.8,pl.z+Math.cos(ry)*8),f*.9);cam.lookAt(pl.x,pl.y+3.1,pl.z);
 const a=Math.max(0,1-(t-(KX.nt||0))*3.2),sw=Math.sin(t*26)*.5*a;
 if(id=='gitar'||id=='oud'){P.armL.rotation.x=(-1+sw)*f;P.armL.rotation.z=.35*f;P.armR.rotation.x=-1.3*f;const g=KX.ref[id],T=FRONT[id];if(g&&g.userData.b){const b=g.userData.b;g.position.set(b.x+(T.x-b.x)*f,b.y+(T.y-b.y)*f,b.z+(T.z-b.z)*f);g.rotation.z=b.rz+(T.rz-b.rz)*f}}
 else if(id=='rebana'){P.armR.rotation.x=-1.25*f;P.armL.rotation.x=(-1.3+sw*1.4)*f;P.armL.rotation.z=.3*f}
 else if(id=='seruling'){P.armR.rotation.x=-2.25*f;P.armR.rotation.z=-.45*f;P.armL.rotation.x=-2*f;P.armL.rotation.z=.5*f}};
})();
