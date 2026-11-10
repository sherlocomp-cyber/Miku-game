/* === BAGIAN 25: Siang-malam otomatis ===
   Modul mandiri: tidak mengubah file lain. Dimuat paling akhir (setelah js/24).
   Memakai global dari js/02: THREE, S (scene), R, cam, sun. Opsional: INTR, ts, ready, open.
   Satu hari game = DAY detik nyata (awal 08:00 pagi). Yang berubah: warna langit, kabut, cahaya matahari/bulan,
   matahari + bulan + bintang di langit, bola lampu jalan membesar saat malam.
   Di dalam bangunan dan saat Ujian Akhir (langit khusus), cahaya dikembalikan ke siang supaya tetap terang.
   Atur dari konsol: SM.set(20) = jam 20.00 · SM.pause(true) · SM.panjang(120) = 1 hari 120 detik.
   Cara balik ke tampilan lama: hapus baris <script> js/25 di index.html. */
(function(){
if(window.SM)return;
if(typeof THREE==='undefined'||typeof S==='undefined'||typeof sun==='undefined'||typeof cam==='undefined')return;
const tex=S.background,hemi=S.children.find(o=>o.isHemisphereLight),amb=S.children.find(o=>o.isAmbientLight);
if(!tex||!tex.image||!hemi||!amb||!S.fog)return;
let DAY=480,T=8,run=true;
const H=x=>new THREE.Color(x);
const mk=(h,top,mid,bot,fog,hs,hg,hi,ac,ai,sc,si)=>({h,top:H(top),mid:H(mid),bot:H(bot),fog:H(fog),hs:H(hs),hg:H(hg),hi,ac:H(ac),ai,sc:H(sc),si});
const NIGHT=[0x0b1437,0x18265a,0x2b3a6b,0x1a2347,0x5568b0,0x2a3a30,.55,0x6070b0,.22,0x9fb4ff,.35];
const DAYV=[0x5a9fe0,0x9cc9ee,0xefe9d6,0xe2e6dc,0xfff1d6,0x6f7f5a,.95,0xffffff,.12,0xffe2b0,1.3];
const K=[mk(0,...NIGHT),mk(5,...NIGHT),
 mk(6.3,0x4a5fa8,0xe8908a,0xffd7a0,0xe9b9a0,0xffd9b0,0x6f7f5a,.75,0xffffff,.12,0xffb070,.9),
 mk(8,...DAYV),mk(16,...DAYV),
 mk(17.8,0x3d4f9a,0xf08a5d,0xffc277,0xe8a888,0xffc89a,0x6f7f5a,.7,0xffffff,.12,0xff8f50,.85),
 mk(19.3,...NIGHT),mk(24,...NIGHT)];
const cur=mk(0,...DAYV);
function at(h){let i=0;while(i<K.length-2&&h>=K[i+1].h)i++;const a=K[i],b=K[i+1];let f=(h-a.h)/(b.h-a.h);f=f*f*(3-2*f);
 ['top','mid','bot','fog','hs','hg','ac','sc'].forEach(k=>cur[k].lerpColors(a[k],b[k],f));
 ['hi','ai','si'].forEach(k=>{cur[k]=a[k]+(b[k]-a[k])*f})}
const nwOf=h=>h>=19.3||h<5?1:h>=17.8?(h-17.8)/1.5:h<6.3?1-(h-5)/1.3:0;

/* ---------- langit: matahari, bulan, bintang ---------- */
function glow(c0,c1,disc){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,0,64,64,64);
 r.addColorStop(0,c0);r.addColorStop(disc,c0);r.addColorStop(disc+.06,c1);r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
const spr=(t,sz)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,fog:false,depthWrite:false}));s.scale.set(sz,sz,1);s.visible=false;s.renderOrder=-1;S.add(s);return s};
const sunS=spr(glow('rgba(255,246,200,1)','rgba(255,220,140,.35)',.32),50),moonS=spr(glow('rgba(240,244,255,1)','rgba(190,205,255,.30)',.34),34);
const stars=(()=>{const N=260,p=new Float32Array(N*3);for(let i=0;i<N;i++){const y=.1+Math.random()*.85,r=Math.sqrt(1-y*y),a=Math.random()*Math.PI*2;p[i*3]=Math.cos(a)*r*330;p[i*3+1]=y*330;p[i*3+2]=Math.sin(a)*r*330}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));
 const o=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:2.4,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));o.frustumCulled=false;o.visible=false;o.renderOrder=-1;S.add(o);return o})();
const D3=new THREE.Vector3();
function body(s,a,dist){const e=Math.sin(a);if(e<=0){s.visible=false;return}D3.set(-Math.cos(a),e,-.35).normalize().multiplyScalar(dist).add(cam.position);s.position.copy(D3);s.material.opacity=Math.min(1,e*4);s.visible=true;return e}

/* ---------- bola lampu jalan: membesar saat malam ---------- */
const lamps=[];S.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='SphereGeometry'&&o.geometry.parameters.radius===.28&&o.material&&o.material.type==='MeshBasicMaterial'&&o.material.color.getHex()===0xfff0b0)lamps.push(o)});
let lampK=0;

/* ---------- loop ---------- */
const cv=tex.image,cx=cv.getContext('2d');
function paint(){const g=cx.createLinearGradient(0,0,0,cv.height);g.addColorStop(0,'#'+cur.top.getHexString());g.addColorStop(.6,'#'+cur.mid.getHexString());g.addColorStop(1,'#'+cur.bot.getHexString());cx.fillStyle=g;cx.fillRect(0,0,cv.width,cv.height);tex.needsUpdate=true}
const PH=h=>h>=19||h<6?'n':h>=16.5?'s':h>=12?'g':'p';
const MSG={p:'🌅 <span class="ar">صَبَاحُ الْخَيْرِ</span> · Selamat pagi!',g:'☀️ Siang hari yang cerah!',s:'🌇 <span class="ar">مَسَاءُ الْخَيْرِ</span> · Selamat sore!',n:'🌙 <span class="ar">لَيْلَةٌ سَعِيدَةٌ</span> · Selamat malam!'};
let last=performance.now(),acc=1,ph=PH(T);
function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.1);last=now;
 if(run&&!document.hidden)T=(T+dt*24/DAY)%24;
 const ex=S.background!==tex,inside=typeof INTR!=='undefined'&&INTR&&INTR.on;
 at(ex||inside?12:T);
 hemi.color.copy(cur.hs);hemi.groundColor.copy(cur.hg);hemi.intensity=cur.hi;amb.color.copy(cur.ac);amb.intensity=cur.ai;sun.color.copy(cur.sc);sun.intensity=cur.si;
 if(ex){sunS.visible=moonS.visible=stars.visible=false;return}
 at(T);S.fog.color.copy(cur.fog);
 acc+=dt;if(acc>.25){acc=0;paint()}
 const nw=nwOf(T);
 if(inside){sunS.visible=moonS.visible=stars.visible=false}else{
  const as=(T-6)/12*Math.PI,am=((T-18+24)%24)/12*Math.PI;
  const e=body(sunS,as,320);if(e!==undefined)sunS.material.color.setRGB(1,.62+.38*Math.min(1,e*2.5),.35+.65*Math.min(1,e*2.5));
  body(moonS,am,320);
  stars.visible=nw>.02;if(stars.visible){stars.material.opacity=nw;stars.position.copy(cam.position)}}
 const lk=Math.round(nw*20);if(lk!==lampK){lampK=lk;const s=1+1.3*nw;lamps.forEach(l=>l.scale.setScalar(s))}
 const p=PH(T);if(p!==ph){let ok=true;try{ok=typeof ts==='function'&&typeof ready!=='undefined'&&ready&&!open&&!inside}catch(e){ok=false}
  if(ok){ph=p;try{ts(MSG[p],3200)}catch(e){}}else if(typeof ready==='undefined'||!ready)ph=p}}
requestAnimationFrame(frame);
window.SM={get jam(){return T},set(h){T=((+h%24)+24)%24;ph=PH(T)},pause(v){run=!v},panjang(s){DAY=Math.max(20,+s||480)}};
})();
