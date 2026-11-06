// ================= RENDERER & SCENE =================
const R=new THREE.WebGLRenderer({canvas:$('#c'),antialias:true});const LOW=matchMedia('(pointer:coarse)').matches||(navigator.hardwareConcurrency||8)<=4;R.setPixelRatio(Math.min(devicePixelRatio,LOW?1.5:2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.0;
const S=new THREE.Scene();{const c=document.createElement('canvas');c.width=2;c.height=256;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#5a9fe0');gr.addColorStop(.6,'#9cc9ee');gr.addColorStop(1,'#efe9d6');g.fillStyle=gr;g.fillRect(0,0,2,256);S.background=new THREE.CanvasTexture(c)}S.fog=new THREE.Fog(0xe2e6dc,100,280);
const cam=new THREE.PerspectiveCamera(60,1,.1,400);
S.add(new THREE.HemisphereLight(0xfff1d6,0x6f7f5a,.95),new THREE.AmbientLight(0xffffff,.12));
const sun=new THREE.DirectionalLight(0xffe2b0,1.3);sun.position.set(60,100,40);sun.castShadow=true;sun.shadow.mapSize.set(LOW?1024:2048,LOW?1024:2048);Object.assign(sun.shadow.camera,{left:-70,right:70,top:70,bottom:-70,near:1,far:300});sun.shadow.camera.updateProjectionMatrix();sun.shadow.bias=-.0005;S.add(sun,sun.target);
function rs(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',rs);rs();
const M={};const mat=c=>M[c]||(M[c]=new THREE.MeshLambertMaterial({color:c}));
const GC={};const geo=(w,h,d)=>{const k=w+','+h+','+d;return GC[k]||(GC[k]=new THREE.BoxGeometry(w,h,d))};
function box(w,h,d,c,x=0,y=0,z=0,p){const m=new THREE.Mesh(geo(w,h,d),mat(c));m.position.set(x,y,z);m.castShadow=w>.5&&h>.5;m.receiveShadow=true;(p||S).add(m);return m}
function nt(base,amp,rep,sz=128){const c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,sz,sz);for(let i=0;i<sz*sz/5;i++){const v=(Math.random()-.5)*amp;g.fillStyle=v>0?`rgba(255,255,190,${v/255})`:`rgba(0,30,0,${-v/255})`;g.fillRect(Math.random()*sz,Math.random()*sz,2,2)}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);t.anisotropy=4;return t}
const FT={};function facade(c,h){const fl=Math.max(2,Math.round(h/3.2)),key=c+'_'+fl;if(FT[key])return FT[key];const W=128,H=fl*40,cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d'),hex='#'+c.toString(16).padStart(6,'0'),sh=(a)=>a>0?`rgba(255,255,255,${a})`:`rgba(0,0,0,${-a})`;
g.fillStyle=hex;g.fillRect(0,0,W,H);
const gl=g.createLinearGradient(0,0,0,H);gl.addColorStop(0,sh(.10));gl.addColorStop(1,sh(-.12));g.fillStyle=gl;g.fillRect(0,0,W,H);
for(let i=0;i<W*H/6;i++){g.fillStyle=sh((Math.random()-.5)*.12);g.fillRect(Math.random()*W,Math.random()*H,2,2)}
for(let f=0;f<fl;f++){const y0=f*40;
g.fillStyle=sh(.22);g.fillRect(0,y0+1,W,2);g.fillStyle=sh(-.28);g.fillRect(0,y0+36,W,4);g.fillStyle=sh(.16);g.fillRect(0,y0+35,W,1);
for(let k=0;k<3;k++){const x=12+k*38,y=y0+8,lit=Math.random()<.25,wd=28,ht=24;
g.fillStyle=sh(-.3);g.fillRect(x-3,y-3,wd+6,ht+6);
g.fillStyle='#fffaf0';g.fillRect(x-2,y-2,wd+4,ht+4);
const gr=g.createLinearGradient(0,y,0,y+ht);gr.addColorStop(0,lit?'#fff3c4':'#bfe3f7');gr.addColorStop(1,lit?'#f2c96a':'#4a7899');g.fillStyle=gr;g.fillRect(x,y,wd,ht);
if(lit){g.fillStyle='rgba(255,140,90,.55)';g.fillRect(x,y,6,ht);g.fillRect(x+wd-6,y,6,ht)}
g.fillStyle='#fffaf0';g.fillRect(x+wd/2-1,y,2,ht);g.fillRect(x,y+ht/2-1,wd,2);
g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.moveTo(x+2,y+2);g.lineTo(x+11,y+2);g.lineTo(x+2,y+14);g.fill();
g.fillStyle='#8f857a';g.fillRect(x-4,y+ht+2,wd+8,3);g.fillStyle=sh(.3);g.fillRect(x-4,y+ht+2,wd+8,1);
if(!lit&&Math.random()<.35){g.fillStyle='#3a8f4f';g.fillRect(x+3,y+ht-3,5,4);g.fillStyle='#d9534f';g.fillRect(x+4,y+ht-5,3,2)}
}}
g.fillStyle=sh(-.2);g.fillRect(0,H-6,W,6);
const t=new THREE.CanvasTexture(cv);t.anisotropy=4;return FT[key]=new THREE.MeshLambertMaterial({map:t})}
{const gm=new THREE.Mesh(new THREE.PlaneGeometry(440,380).rotateX(-Math.PI/2),new THREE.MeshLambertMaterial({map:(()=>{const t=nt('#5fa545',50,30),q=t.image.getContext('2d');for(let i=0;i<70;i++){q.strokeStyle=Math.random()<.5?'rgba(20,110,20,.35)':'rgba(200,255,120,.3)';q.lineWidth=1;const x=Math.random()*128,y=Math.random()*128;q.beginPath();q.moveTo(x,y);q.lineTo(x+(Math.random()-.5)*3,y-3-Math.random()*4);q.stroke()}t.needsUpdate=true;return t})()}));gm.position.y=-.01;gm.receiveShadow=true;S.add(gm)}
const RX=[-180,-120,-60,0,60,120,180],RZ=[-140,-70,0,70,140];
function rt(){const c=document.createElement('canvas');c.width=64;c.height=64;const g=c.getContext('2d');g.fillStyle='#454a56';g.fillRect(0,0,64,64);for(let i=0;i<500;i++){g.fillStyle=Math.random()<.5?'#00000030':'#ffffff20';g.fillRect(Math.random()*64,Math.random()*64,1.5,1.5)}g.fillStyle='#00000016';g.fillRect(10,0,9,64);g.fillRect(45,0,9,64);g.fillStyle='#fff';g.fillRect(30,6,4,28);g.fillStyle='#ffffff77';g.fillRect(1,0,2,64);g.fillRect(61,0,2,64);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
function road(L,ang,x,z,y){const t=rt();t.repeat.set(1,L/8);const g=new THREE.PlaneGeometry(10,L);g.rotateX(-Math.PI/2);if(ang)g.rotateY(Math.PI/2);const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({map:t}));m.position.set(x,y,z);m.receiveShadow=true;S.add(m)}
RX.forEach(x=>box(15,.1,380,0xd9d3c3,x,.01,0));RZ.forEach(z=>box(440,.1,15,0xd9d3c3,0,.015,z));RX.forEach(x=>road(380,0,x,0,.05));RZ.forEach(z=>road(440,1,0,z,.07));
const walls=[];const BLD=[],INTR={on:false,b:null,cd:0},RMX=0,RMZ=-300;
function wall(x,z,hw,hd){walls.push({x,z,hw,hd})}
const PX=[-150,-90,-30,30,90,150],PZ=[-105,-35,35,105];const pois=[];
function sign(t,col){const c=document.createElement('canvas');c.width=512;c.height=160;const g=c.getContext('2d');
const cc='#'+col.toString(16).padStart(6,'0');g.fillStyle='#fffaf0';g.fillRect(0,0,512,160);g.fillStyle=cc;g.fillRect(0,0,512,14);g.fillRect(0,146,512,14);g.lineWidth=10;g.strokeStyle='#1d2b53';g.strokeRect(5,5,502,150);g.fillStyle='#ffffff55';g.fillRect(10,10,492,4);
g.fillStyle='#1d2b53';g.textAlign='center';g.direction='rtl';g.font='700 70px Amiri, serif';g.fillText(t.ar.replace(/[ًٌٍ]$/,''),256,82);
g.direction='ltr';g.font='700 34px "Baloo 2", sans-serif';g.fillStyle='#'+col.toString(16).padStart(6,'0');g.fillText(t.pl,256,134);
const tx=new THREE.CanvasTexture(c);return new THREE.Mesh(new THREE.PlaneGeometry(10,3.1),new THREE.MeshBasicMaterial({map:tx}))}
function personOld(c,skin=0xf2c9a0,hr=0x3b2a20){const g=new THREE.Group();const M=(G,col,x,y,z,p,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(G,mat(col));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;(p||g).add(m);return m};
const cy=new THREE.CylinderGeometry(.32,.28,1.4,10),sp=new THREE.SphereGeometry(.5,14,10),am=new THREE.CylinderGeometry(.25,.21,1.4,10),sh=new THREE.BoxGeometry(.6,.35,.95);
[-1,1].forEach(k=>{const l=new THREE.Group();l.position.set(k*.42,1.45,0);g.add(l);M(cy,0x2b3550,0,-.7,0,l);M(sh,0x1a1a1a,0,-1.38,.15,l);const a=new THREE.Group();a.position.set(k*1.1,3,0);g.add(a);M(am,c,0,-.7,0,a);M(sp,skin,0,-1.45,0,a,.5,.5,.5);if(k<0){g.legL=l;g.armL=a}else{g.legR=l;g.armR=a}});
M(new THREE.CylinderGeometry(.85,.75,1.7,14),c,0,2.3,0,null,1,1,.55);M(new THREE.CylinderGeometry(.2,.2,.3,8),skin,0,3.25,0);M(sp,skin,0,3.75,0,null,1.3,1.4,1.2);M(sp,hr,0,3.95,-.1,null,1.38,1.3,1.3);M(new THREE.SphereGeometry(.1,6,5),skin,0,3.66,.62);return g}
const ad=(G,c,x,y,z)=>{const m=new THREE.Mesh(G,mat(c));m.position.set(x,y,z);m.castShadow=true;S.add(m);return m};
function person(c,i,sk=0xf2c9a0,ov,tg){const d=D[i],f=ov?ov.f:(d&&d.g=='f'),g=tg||new THREE.Group(),K=KIT(g),{B,both,dk,SH,HL,TX,M}=K;
const Q={top:c,pc:0x2b3550,sc:0x1a1a1a,col:0xf6f6f6,btn:1,hs:f?(i&1?5:7):(i%3==0?3:0)};let ex=()=>{};
const W=0xf4f6f8,GOLD=0xe8c050,lap=(col,y=2.85)=>both(k=>B(.3,.55,.04,col,k*.3,y,.5,[0,0,-k*.35])),
 tie=(col)=>{B(.2,.8,.05,col,0,2.5,.5);B(.2,.16,.06,col,0,3.0,.5)},
 tag=(x,y,col=0xffffff)=>B(.36,.12,.03,col,x,y,.5),
 lan=(col,card)=>{both(k=>B(.05,.9,.03,col,k*.22,2.7,.51,[0,0,-k*.12]));B(.3,.4,.03,card,0,2.2,.52)},
 coat=(col,len,inner)=>{B(1.82,len,1.0,col,0,1.45-len/2+.1,0);B(.28,len+1.2,.03,inner,0,1.45+(1.7-len)/2+.1,.51)},
 scope=()=>{both(k=>B(.05,.9,.04,0x222222,k*.32,2.5,.52,[0,0,-k*.1]));B(.2,.2,.05,0xcccccc,.35,1.95,.52)},
 vest=(col)=>{both(k=>{B(.74,1.55,.06,col,k*.45,2.35,.5);B(.76,.1,.07,0xe8e8e8,k*.45,2.0,.5);B(.76,.1,.07,0xe8e8e8,k*.45,2.6,.5);B(.3,.06,.96,col,k*.48,3.17,0)});B(1.72,1.55,.06,col,0,2.35,-.5);B(1.74,.1,.07,0xe8e8e8,0,2.1,-.5)},
 ep=(col,st)=>both(k=>{B(.55,.1,.6,col,k*1.1,3.2,0);[-.18,0,.18].forEach(z=>B(.5,.03,.05,st,k*1.1,3.26,z))}),
 cap=(col,vis,bad)=>{B(1.45,.4,1.45,col,0,4.65,0);B(1.5,.1,1.5,0x111111,0,4.5,0);B(1.4,.08,.6,vis,0,4.48,.95);B(.25,.25,.05,bad,0,4.62,.76)},
 toque=()=>{B(1.3,.3,1.3,0xffffff,0,4.62,0);B(1.5,.7,1.5,0xffffff,0,5.15,0)},
 helm=(col)=>{B(1.5,.55,1.5,col,0,4.62,0);B(.22,.1,1.5,dk(col,.12),0,4.92,0);B(1.5,.1,.55,col,0,4.4,.9);B(1.7,.1,1.7,col,0,4.38,0)},
 apron=(col,y,w,h,z)=>{B(w,h,.05,col,0,y,z);B(w*.5,.28,.03,SH,0,y-h*.2,z+.03);both(k=>B(.1,.7,.05,col,k*.4,3.0,.49,[0,0,k*.2]))},
 gogg=()=>{B(1.35,.1,1.25,0x333333,0,4.28,0);both(k=>B(.4,.25,.1,0x9fe0ff,k*.28,4.33,.64))};
switch(i){
case 0:Object.assign(Q,{pc:0x3d5a8a,sc:0x6b4a2a,belt:false,btn:0,col:0xe8e0c8});ex=()=>{[-.6,-.2,.2,.6].forEach(x=>B(.06,1.6,.02,SH,x,2.3,.47));[1.8,2.3,2.8].forEach(y=>B(1.7,.06,.02,SH,0,y,.47));
 const dn=0x3d5a8a;B(1.74,.55,.96,dn,0,1.75,0);B(1.0,.85,.06,dn,0,2.5,.5);both(k=>{B(.16,.3,.06,dn,k*.38,3.02,.49);B(.16,.06,.96,dn,k*.38,3.17,0);B(.16,1.6,.06,dn,k*.38,2.3,-.49);B(.1,.1,.04,GOLD,k*.38,2.85,.54)});B(.5,.3,.03,SH,0,2.4,.535);
 B(.7,.2,.55,0xd9594c,0,3.2,.03);B(.2,.3,.06,0xd9594c,0,3.0,.49);const cn=new THREE.Mesh(new THREE.ConeGeometry(1.5,.9,12),mat(0xe8c050));cn.position.y=4.55;g.add(cn);B(1.3,.08,1.3,0xb5651d,0,4.35,0)};break;
case 1:Object.assign(Q,{top:0x4a6fa5,pc:0x6b5b3a,sc:0x5a3a22,pk:1});ex=()=>{vest(c);helm(0xffd23f);tag(-.45,2.75)};break;
case 2:Object.assign(Q,{top:0xf3e7c9,pc:0x2b2b3a,sc:0x3a2a20});ex=()=>{both(k=>B(.74,1.2,.06,c,k*.45,2.5,.5));B(1.72,1.2,.06,c,0,2.5,-.5);for(let q=0;q<3;q++)B(.1,.1,.04,GOLD,.12,2.9-q*.35,.54);B(1.32,.38,1.32,0xf5f5f5,0,4.62,0);B(1.35,.08,1.35,GOLD,0,4.5,0)};break;
case 3:Object.assign(Q,{pc:0x1d2b53,sc:0x111111,col:dk(c,.3),pk:2,bc:0x111111});ex=()=>{ep(0x1d2b53,GOLD);tie(0x111111);B(.22,.26,.04,0xffd23f,.45,2.75,.5);tag(-.45,2.75);B(.2,.6,.4,0x1a1a1a,.95,1.5,.05);B(.3,.3,.2,0x1a1a1a,-.6,1.7,.5);cap(0x1d2b53,0x111111,GOLD)};break;
case 4:Object.assign(Q,{top:W,pc:0x2fb5b0,sc:0xf0f0f0,tr:1,col:0x2fb5b0,hs:8,belt:false});ex=()=>{coat(W,.6,0x2fb5b0);lap(0xe4e8ec);scope();tag(.5,2.7);B(.4,.4,.02,SH,-.5,2.0,.5)};break;
case 5:Object.assign(Q,{pc:0x4b5a35,sc:0x111111,col:0x55633a,pk:2,bc:0x222222});ex=()=>{for(let q=0;q<9;q++){const r1=((i*9301+q*49297)%233280)/233280,r2=((i*7001+q*2713)%233280)/233280;B(.3+r1*.3,.25+r2*.3,.02,q%2?0x3b4727:0x6b5a3a,-.7+r1*1.4,1.8+r2*1.2,.47)}tag(.4,2.95,0x222222);B(.34,.2,.03,0xcc2222,-.5,2.95,.5);helm(0x4b5a35)};break;
case 6:Object.assign(Q,{skc:0x2b2b3a,col:0xffffff,hjc:0xd9c9f2});ex=()=>{B(.4,1.1,.03,0xffffff,0,2.6,.505);lap(dk(c,.15));lan(GOLD,0xffffff);B(.2,.05,.06,0x222222,0,3.8,.68);[-.3,.3].forEach(x=>{const t=new THREE.Mesh(new THREE.TorusGeometry(.2,.03,8,18),mat(0x222222));t.position.set(x,3.8,.68);g.add(t)})};break;
case 7:Object.assign(Q,{pc:0x2b3550,sc:0xf0f0f0,tr:1,col:0xffffff,hs:5});ex=()=>{B(.4,1.1,.03,0xffffff,0,2.6,.505);lap(dk(c,.15));lan(0xd9594c,0xffffff);B(.2,.08,.03,0xd9594c,0,2.35,.54)};break;
case 8:Object.assign(Q,{top:0xffffff,pc:0x3a4a6a,tr:1,sc:0x111111,col:c,belt:false});ex=()=>{both(k=>{B(.1,.1,.03,0x999999,k*.3,2.85,.5);B(.1,.1,.03,0x999999,k*.3,2.45,.5)});B(.8,.18,.6,c,0,3.15,.03);B(.4,.4,.05,c,0,2.95,.49,[0,0,Math.PI/4]);apron(0x2b2b3a,1.95,1.5,1.0,.52);toque()};break;
case 9:Object.assign(Q,{pc:c,sc:0x5a3a22,belt:false,btn:0,col:0xffffff});ex=()=>{B(1.95,1.3,1.14,c,0,1.15,0);B(1.97,.12,1.16,SH,0,.56,0);B(.18,1.2,.03,0xf6f6f6,0,2.4,.47);B(.18,1.1,.03,0xf6f6f6,0,1.2,.575);for(let q=0;q<4;q++)B(.1,.1,.03,GOLD,0,2.9-q*.3,.49);both(k=>B(.3,1.1,.06,0xffffff,k*.45,2.5,.5,[0,0,k*.2]));B(1.35,.5,1.35,0x1a1a1a,0,4.6,0);B(1.38,.08,1.38,GOLD,0,4.45,0)};break;
case 10:Object.assign(Q,{col:0xffffff,hs:7});ex=()=>{apron(0xf5e6c8,1.9,1.2,1.0,.62);both(k=>B(.14,1.2,.04,0xffe066,k*.28,2.55,.5,[0,0,k*.05]));[0,1,2,3].forEach(q=>both(k=>B(.14,.03,.05,SH,k*.28,2.1+q*.25,.51)))};break;
case 11:Object.assign(Q,{top:W,pc:0x1d2430,sc:0x111111,col:0xffffff,pk:2});ex=()=>{ep(0x1d2430,GOLD);tie(0x111111);B(.5,.12,.04,GOLD,-.42,2.75,.5);B(.15,.15,.04,GOLD,-.42,2.75,.51);cap(0x1d2430,0x111111,GOLD)};break;
case 12:Object.assign(Q,{skc:0x3a3f4f,col:0xffffff,hs:7});ex=()=>{B(.4,1.1,.03,0xffffff,0,2.6,.505);lap(dk(c,.15));lan(0xe8c050,0xffffff);B(.3,.08,.03,0x3d6fd6,0,2.35,.54)};break;
case 13:Object.assign(Q,{top:0xffffff,sl:'s',pc:0xc23b3b,sc:0x111111,pk:1,bc:0x111111});ex=()=>{tie(0xc23b3b);B(.2,.22,.03,0x3d6fd6,.45,2.75,.5);B(1.2,1.4,.5,0x3d6fd6,0,2.3,-.7);both(k=>B(.14,1.4,.05,0x2b4aa0,k*.5,2.3,.48));B(.9,.5,.1,0x2b4aa0,0,1.9,-.97)};break;
case 14:Object.assign(Q,{ln:2.7,col:0xf6f6f6,hjc:0xc98aa0,hs:7,btn:0});ex=()=>{apron(0xfff3e0,1.9,1.2,1.1,.62);[[-.3,2.1],[.2,1.8],[-.1,1.5],[.35,2.2]].forEach(([x,y])=>B(.1,.1,.02,0xe86ca0,x,y,.66))};break;
case 15:Object.assign(Q,{pc:0x3a3f4f,sc:0x2b2b2b,pk:2,bc:0x2b2b2b});ex=()=>{B(1.5,.2,1.5,0x2b3a4a,0,4.55,0);B(1.3,.1,.6,0x2b3a4a,0,4.48,.9);tag(-.45,2.75);B(.3,.2,.03,0xffd23f,.45,2.75,.5)};break;
case 16:Object.assign(Q,{pc:W,sc:W,tr:1,col:0xffffff,hjc:0xf5f5f5,belt:false});ex=()=>{both(k=>B(.3,.6,.04,0xffffff,k*.2,2.9,.5,[0,0,-k*.45]));B(.4,.36,.03,SH,.45,2.3,.5);tag(-.45,2.5);B(.2,.07,.05,0xe03a3a,0,4.33,.7);B(.07,.2,.05,0xe03a3a,0,4.33,.71)};break;
case 17:Object.assign(Q,{sl:'s',sh:0xffffff,sock:c,pc:c,sc:0x111111,belt:false,col:0xffffff,btn:0});ex=()=>{TX('10','#ffffff',.9,.9,0,2.3,.48,0);TX('10','#ffffff',.9,.9,0,2.4,-.48,Math.PI);B(1.72,.08,.94,0xffffff,0,3.0,0)};break;
case 18:Object.assign(Q,{top:0xe9eef3,pc:0x2b3550,sc:0x111111,col:0x4a6fa5,pk:2,belt:false,btn:0,hs:2});ex=()=>{coat(0xe9eef3,.7,0x4a6fa5);lap(0xdde3e9);tag(.45,2.75);[.05,.12].forEach((q,k)=>B(.05,.3,.04,k?0x3d6fd6:0xe03a3a,-.38+q,2.85,.5));gogg()};break;
case 19:Object.assign(Q,{pc:0x7fbfae,sc:W,col:0xffffff,belt:false,btn:0,pk:1,hs:4});ex=()=>{both(k=>B(.3,.6,.04,0xffffff,k*.2,2.9,.5,[0,0,-k*.45]));scope();B(1.4,.55,1.4,0x2fb5b0,0,4.58,0);B(.3,.3,.1,0x2fb5b0,0,4.4,-.72)};break;
case 20:Object.assign(Q,{top:0xffffff,pc:0x3a4a6a,sc:0x111111,col:c,belt:false});ex=()=>{both(k=>{B(.1,.1,.03,0x999999,k*.3,2.85,.5);B(.1,.1,.03,0x999999,k*.3,2.45,.5)});B(.8,.18,.6,c,0,3.15,.03);B(.4,.4,.05,c,0,2.95,.49,[0,0,Math.PI/4]);apron(0x2b2b3a,1.9,1.5,1.5,.52);toque()};break;
case 21:Object.assign(Q,{top:0xf3f3f3,pc:0x6b5b3a,sc:0x5a3a22,tr:1,pk:1,hs:5});ex=()=>{vest(c);helm(0xffffff);tag(-.45,2.75)};break;
case 22:Object.assign(Q,{skc:0x5a3a3a,ln:1.6,col:0xfff3e0,hs:5});ex=()=>{apron(0xf5e6c8,1.8,1.2,1.1,.62);[-.4,-.1,.2,.5].forEach(x=>B(.06,1.0,.02,0xc9406a,x,1.8,.65));B(.1,1.9,.04,0x8a5a2a,0,2.3,.5,[0,0,.75]);B(.5,.45,.3,0x8a5a2a,-.8,1.5,.6)};break;
case 23:Object.assign(Q,{ln:2.7,col:0xf6f6f6,hjc:0xb9a2e6,hjl:1,btn:0,belt:false});ex=()=>{B(1.9,.08,1.02,0xffffff,0,1.35,0)};break}
if(ov&&d.g=='f'&&!f){delete Q.ln;delete Q.hjc;delete Q.hjl}
CH(g,{f,sk,hc:ov?ov.hc:[0x2a1b14,0x3b2a20,0x5a3a22,0x1a1a1a][i&3],ec:ov?ov.ec:0x1b1b1b,oc:c,...Q,...(ov?{hs:ov.hs}:{})});ex();npcExtra(g,i,c);return g}
