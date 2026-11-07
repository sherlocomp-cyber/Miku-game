// ================= LOOP =================

// === Interior bangunan profesi (masuk lewat keset hijau di pintu) ===
const IGR=new THREE.Group();let IRD=false;
function roomInit(){if(IRD)return;IRD=true;S.add(IGR);
box(44,.4,44,0x2b2f3d,RMX,-.25,RMZ);box(16,.1,14,0xf3e6c8,RMX,.02,RMZ);
for(let a=0;a<8;a++)for(let b=0;b<7;b++)if((a+b)%2)box(2,.02,2,0xe3cfa3,RMX-7+a*2,.08,RMZ-6+b*2);
box(15.6,.4,.2,0x8a6a40,RMX,.2,RMZ-6.7);box(.2,.4,14,0x8a6a40,RMX-7.7,.2,RMZ);box(.2,.4,14,0x8a6a40,RMX+7.7,.2,RMZ);
box(15.6,.3,.3,0x8a6a40,RMX,5.85,RMZ-6.6);
[-5.8,5.8].forEach(o=>{box(3.2,2.6,.1,0xffffff,RMX+o,3.4,RMZ-6.74);box(2.8,2.2,.08,0x9fd6f0,RMX+o,3.4,RMZ-6.68);box(.1,2.2,.1,0xffffff,RMX+o,3.4,RMZ-6.62);box(2.8,.1,.1,0xffffff,RMX+o,3.4,RMZ-6.62)});
[[16,6,.4,0,-7],[.4,6,14,-8,0],[.4,6,14,8,0]].forEach(a=>box(a[0],a[1],a[2],0xe9d9b5,RMX+a[3],3,RMZ+a[4]));
wall(RMX,RMZ-7.2,8.5,.4);wall(RMX-8.2,RMZ,.4,7.2);wall(RMX+8.2,RMZ,.4,7.2);wall(RMX-5.5,RMZ+7,3.5,.3);wall(RMX+5.5,RMZ+7,3.5,.3);try{kpRoomDetail()}catch(e){console.warn('room',e)}}
function intEnter(b){roomInit();while(IGR.children.length)IGR.remove(IGR.children[0]);const d=b.d,i=b.i,B=(w,h,e,c,x,y,z)=>box(w,h,e,c,RMX+x,y,RMZ+z,IGR);
const sg=sign(d,d.c);sg.position.set(RMX,4.9,RMZ-6.7);IGR.add(sg);
const s2=sign({ar:AR[i],pl:AC[i]},d.c);s2.scale.set(.7,.7,.7);s2.rotation.y=Math.PI/2;s2.position.set(RMX-7.7,3.2,RMZ);IGR.add(s2);
B(8,.05,5,d.c,0,.1,-1);B(5,1.4,1.8,0x8a5a2b,0,.7,-3);B(.8,3,5,0x7a5230,-7.3,1.5,3);B(.5,.6,.9,0xff6b5e,-7.3,3.3,2);B(.5,.6,.9,0x3d9bff,-7.3,3.3,3.2);B(.5,.6,.9,0x2fbf85,-7.3,3.3,4.4);
B(4,.08,1.6,0x2fbf85,0,.1,6);B(4.4,.06,2,0x1e8f64,0,.09,6);
B(8.4,.04,5.4,0xffffff,0,.08,-1);[[7,.15,0,-3.4],[7,.15,0,1.4],[.15,3.8,-3.5,-1],[.15,3.8,3.5,-1]].forEach(a=>B(a[0],.07,a[1],0xffffff,a[2],.13,a[3]));
B(5.4,.2,2,0x6b4423,0,1.5,-3);[-1.6,1.6].forEach(o=>{B(1.4,.8,.05,0x7a5230,o,.75,-2.08);B(.3,.08,.06,0xffd23f,o,.85,-2.04)});
B(.8,.2,.6,0xd9594c,-1.8,1.7,-3);B(.8,.15,.6,0x3d6fd6,-1.8,1.88,-3);B(.15,.6,.15,0x888888,1.9,1.9,-3.3);B(.6,.3,.6,0xffcf3f,1.9,2.3,-3.3);
B(1.6,.25,1.6,0xc0392b,0,1,-4.8);B(1.6,1.6,.2,0xc0392b,0,1.9,-5.6);[[-.7,-4.1],[.7,-4.1],[-.7,-5.5],[.7,-5.5]].forEach(a=>B(.15,.9,.15,0x5a3a1c,a[0],.45,a[1]));
[1,2].forEach(r=>{B(.35,.1,5,0x5a3a1c,-6.75,r,3);for(let k=0;k<8;k++)B(.2,.8,.35,[0xd9594c,0x3d6fd6,0xffcf3f,0x2fbf85,0x9b6bd6][(k+r)%5],-6.8,r+.5,3+(k-3.5)*.55)});
B(.8,.8,.8,0xb5532f,6.5,.4,-5.5);B(1,1.2,1,0x2f9e6b,6.5,1.4,-5.5);B(.6,.8,.6,0x3aa35a,6.5,2.2,-5.5);
[-1,2.5].forEach(z=>{B(.1,1.8,2.4,0x5a3a1c,7.7,3.4,z);B(.08,1.4,2,d.c,7.6,3.4,z)});
const sp=esprite(d.e);sp.scale.set(3,3,1);sp.position.set(RMX,3.1,RMZ-3);IGR.add(sp);
try{kpIntDetail(b)}catch(e){console.warn('int',e)}INTR.on=true;INTR.b=b;pl.x=RMX;pl.z=RMZ+4.5;pl.y=0;pl.vy=0;snd(660,.1,'triangle');
ts(`${d.e} Selamat datang di <b>${d.pl}</b>! Dekati meja untuk bicara. Keluar lewat keset hijau.`,3500)}
function intChk(t){if(open||CV||RID)return;
if(INTR.on){if(pl.z>RMZ+5.8&&Math.abs(pl.x-RMX)<2.2){const b=INTR.b;INTR.on=false;INTR.cd=t+2;pl.x=b.x;pl.z=b.z+9.8;snd(440,.1,'triangle');ts('🚪 Kamu keluar ke jalan',1500)}return}
if(t<INTR.cd)return;for(const b of BLD){if(Math.abs(pl.x-b.x)<1.7&&pl.z>b.z+6.3&&pl.z<b.z+8.6){intEnter(b);return}if(Math.hypot(pl.x-b.x,pl.z-(b.z+8))<8&&t>(b.ht||0)){b.ht=t+25;ts(`${b.d.e} Masuk ke <b>${b.d.pl}</b>: jalan ke keset hijau di bawah kanopi 🚪`,3000)}}}
function carHit(c){const ax=c.ax=='x',cx=c.o.position.x,cz=c.o.position.z,hl=2.4,hw=1.2,R=.6;
if(INTR.on||pl.y>2.3)return;
const dx=pl.x-cx,dz=pl.z-cz,al=ax?dx:dz,ac=ax?dz:dx;
if(Math.abs(al)>hl+R||Math.abs(ac)>hw+R)return;
const sp=Math.abs(c.s??c.v),dir=Math.sign(c.s||c.v)||1;
if(sp<1.5){if(Math.abs(ac)/(hw+R)>Math.abs(al)/(hl+R)){if(ax)pl.z=cz+(dz<0?-1:1)*(hw+R);else pl.x=cx+(dx<0?-1:1)*(hw+R)}else{if(ax)pl.x=cx+(dx<0?-1:1)*(hl+R);else pl.z=cz+(dz<0?-1:1)*(hl+R)}return}
if(pl.kb>0)return;
const pw=16+sp*1.2,side=(ac<0?-1:1)*14;
pl.kx=ax?dir*pw:side;pl.kz=ax?side:dir*pw;pl.kb=.8;pl.vy=14;if(RID)RID.sp=-RID.sp*.3;
snd(110,.3,'sawtooth',.08);ts('💥 Awas! Hati-hati menyeberang jalan.',2200)}
const PLB=new THREE.Mesh(new THREE.OctahedronGeometry(.55).scale(.7,1.25,.7),new THREE.MeshLambertMaterial({color:0x4cff6a,emissive:0x1fbf3a,transparent:true,opacity:.92}));S.add(PLB);
function loop(){requestAnimationFrame(loop);const dt=Math.min(cl.getDelta(),.05),t=cl.elapsedTime;
if(!open){let ix=(key.d||key.arrowright?1:0)-(key.a||key.arrowleft?1:0)+jx,iy=(key.w||key.arrowup?1:0)-(key.s||key.arrowdown?1:0)+jy;
if(pl.kb>0){ix=0;iy=0}const l=Math.hypot(ix,iy);if(l>1){ix/=l;iy/=l}
if(RID)rideStep(ix,iy,dt);else if(l>.05){const s=Math.sin(pl.yaw),c=Math.cos(pl.yaw);const mx=-s*iy+c*ix,mz=-c*iy-s*ix;const sp=(key.shift?20:12)*dt;
pl.x+=mx*sp;pl.z+=mz*sp;{const ty=Math.atan2(mx,mz);let da=ty-P.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));P.rotation.y+=da*Math.min(1,dt*14)}pl.ph+=dt*12}
if(pl.kb>0){pl.kb-=dt;pl.x+=pl.kx*dt;pl.z+=pl.kz*dt;const dc=Math.pow(.04,dt);pl.kx*=dc;pl.kz*=dc}
walls.forEach(w=>{const cx=Math.max(w.x-w.hw,Math.min(pl.x,w.x+w.hw)),cz=Math.max(w.z-w.hd,Math.min(pl.z,w.z+w.hd));
let dx=pl.x-cx,dz=pl.z-cz;const d=Math.hypot(dx,dz);if(d<WRAD){if(RID)RID.sp*=.5;if(d<.001){dx=1;dz=0}else{dx/=d;dz/=d}pl.x=cx+dx*WRAD;pl.z=cz+dz*WRAD}});
if(!INTR.on){pl.x=Math.max(-205,Math.min(205,pl.x));pl.z=Math.max(-175,Math.min(175,pl.z))}}
const moving=Math.hypot(jx,jy)>.05||key.w||key.s||key.a||key.d||key.arrowup||key.arrowdown||key.arrowleft||key.arrowright;
const sw=Math.sin(pl.ph)*(moving&&!open?.7:0);
P.legL.rotation.x=sw;P.legR.rotation.x=-sw;P.armL.rotation.x=-sw;P.armR.rotation.x=sw;
if(!open){if(!RID&&pl.y<=0&&(key[' ']||jmp)){pl.vy=15;snd(420,.1,'sine')}jmp=0;pl.vy-=42*dt;pl.y=Math.max(0,pl.y+pl.vy*dt);if(pl.y==0&&pl.vy<0)pl.vy=0}const BK=RID&&RID.n=='Sepeda';if(BK){P.scale.setScalar(.55);P.rotation.y=pl.yaw+Math.PI;pl.ph+=dt*Math.abs(RID.sp)*.9;const pd=Math.sin(pl.ph)*.5;P.legL.rotation.x=-.5+pd;P.legR.rotation.x=-.5-pd;P.armL.rotation.x=P.armR.rotation.x=-.95}else if(P.scale.x!=1)P.scale.setScalar(1);
P.rotation.x=pl.kb>0?(1-pl.kb/.8)*Math.PI*2:0;P.position.set(pl.x,pl.y+(pl.y?0:(BK?0:Math.abs(sw)*.15))+(BK?.6:0),pl.z);charLife(P,t,{idle:1,mv:moving&&!open});if(EXM.on||EXM.lie)EXM.post(dt,t);
yawc+=(pl.yaw-yawc)*.2;const cs=Math.sin(yawc),cc=Math.cos(yawc);
if(CV){CV.a+=dt*.7;P.rotation.y=CV.a;const W=innerWidth,H=innerHeight;const ls=W>H;cam.position.set(pl.x,ls?5.4:5,pl.z+(ls?11:16));cam.lookAt(pl.x,3.2,pl.z);if(ls)cam.setViewOffset(W,H,W*.24,0,W,H);else cam.setViewOffset(W,H,0,H*.27,W,H)}else if(EXM.on){EXM.cam(dt,t)}else{camD+=((RID?RID.cd:14)-camD)*.06;cam.position.set(pl.x+cs*camD,9+(camD-14)*.3,pl.z+cc*camD);cam.lookAt(pl.x,3+pl.y*.5,pl.z)}
intChk(t);near=null;let nd=9;pois.forEach(p=>{p.mk.rotation.y=t*2;p.mk.position.y=6+Math.sin(t*3+p.i)*.3;npcAct(p,t);p.sp.position.set(p.mk.position.x,p.mk.position.y+2.4,p.mk.position.z);
const d=Math.hypot(p.n.position.x-pl.x,p.n.position.z-pl.z);bub(p,d);charLife(p.n,t,{talk:d<6&&!open});if(d<nd){nd=d;near=p}});
STN.forEach(s=>{s.mk.rotation.y=t*2;s.mk.position.y=7.4+Math.sin(t*3)*.3;const d=Math.hypot(s.x-pl.x,s.z-pl.z);if(d<8&&d<nd){nd=d;near=s}});
if(INTR.on){near=Math.hypot(pl.x-RMX,pl.z-(RMZ-3))<5.5?pois[INTR.b.i]:null}if(near&&!open){if(lastNear!==near){actB.innerHTML=near.kind=='st'?`Belajar di <b>${near.t}</b><br><small class="ar">${near.ar}</small>`:`Bicara dengan <span class="ar">${near.d.n}</span><br><small>${AC[near.i]}</small> <small class="ar">${AR[near.i]}</small>`;if(near.kind!='st'&&t-(near.gt??-99)>45){near.gt=t;const pe=PE(near),nm=NM||'teman',w=near.lv>0?`Halo lagi, ${nm}! ${'⭐'.repeat(near.lv)} ${near.lv>=3?'Kamu jagoan di sini!':'Yuk, lanjut belajar bareng.'}`:`Halo, ${nm}! ${pe[2]}`;ts(`${near.d.e} <b>${pe[0]}</b>: “${w}”`,4500)}lastNear=near}actB.style.display='block'}else{actB.style.display='none';lastNear=null}
// minimap
mg.fillStyle='#bfe8a8';mg.fillRect(0,0,240,220);mg.fillStyle='#4a4f5c';
const mx=x=>(x+220)/440*240,mz=z=>(z+190)/380*220;
RX.forEach(x=>mg.fillRect(mx(x)-2,0,4,220));RZ.forEach(z=>mg.fillRect(0,mz(z)-2,240,4));
pois.forEach(p=>{mg.fillStyle='#'+LVC[p.lv].toString(16).padStart(6,'0');mg.beginPath();mg.arc(mx(p.n.position.x),mz(p.n.position.z),6,0,7);mg.fill();mg.strokeStyle='#1d2b53';mg.lineWidth=2;mg.stroke()});
STN.forEach(s=>{mg.fillStyle='#'+s.c.toString(16).padStart(6,'0');mg.fillRect(mx(s.x)-6,mz(s.z)-6,12,12);mg.strokeStyle='#1d2b53';mg.lineWidth=2;mg.strokeRect(mx(s.x)-6,mz(s.z)-6,12,12)});
IT.forEach(o=>{if(o.k=='q'&&o.m.visible){mg.fillStyle='#9b6bd6';mg.fillRect(mx(o.m.position.x)-3,mz(o.m.position.z)-3,6,6)}});VEH.forEach(v=>{mg.fillStyle='#fff';mg.fillRect(mx(v.m.position.x)-4,mz(v.m.position.z)-4,8,8);mg.strokeRect(mx(v.m.position.x)-4,mz(v.m.position.z)-4,8,8)});mg.fillStyle='#ff6b5e';mg.beginPath();mg.arc(mx(pl.x),mz(pl.z),7,0,7);mg.fill();mg.stroke();
cars.forEach(c=>{let v=c.v;if(window.POL){const q=POL,lane=c.ax=='x'?q.z:q.x,pos=c.ax=='x'?q.x:q.z,ah=(pos-c.p)*Math.sign(c.v);if(Math.abs(c.off-lane)<6&&POL.allow!=c.ax&&ah>4&&ah<18)v=0}c.s=(c.s??c.v)+(v-(c.s??c.v))*Math.min(1,dt*3);c.p+=c.s*dt;if(c.p>210)c.p=-210;if(c.p<-210)c.p=210;c.o.position.set(c.ax=='x'?c.p:c.off,0,c.ax=='x'?c.off:c.p);carHit(c)});clouds.forEach(c=>{c.position.x+=dt*2;if(c.position.x>230)c.position.x=-230});
fa+=dt;fc++;if(fa>2.5){if(!lowq&&!open&&fc/fa<28){lowq=1;R.shadowMap.enabled=false;sun.castShadow=false;S.traverse(o=>{if(o.material)o.material.needsUpdate=true});R.setPixelRatio(1);rs()}fa=fc=0}
if(fc%6==0){const T=target();let h;if(T&&T.b)h='📋 '+T.t;else if(T){const dx=T.x-pl.x,dz=T.z-pl.z,sy=Math.sin(yawc),cy=Math.cos(yawc),ra=dx*cy-dz*sy,rb=-dx*sy-dz*cy;h='<span style="display:inline-block;transform:rotate('+(Math.atan2(ra,rb)*57.3).toFixed(0)+'deg);line-height:0"><svg width="20" height="24" viewBox="0 0 18 22" style="vertical-align:middle"><path d="M9 1 L15 10 H11 V21 H7 V10 H3 Z" fill="#ffcf3f" stroke="#1d2b53" stroke-width="2" stroke-linejoin="round"/></svg></span> '+T.t+' – '+Math.round(Math.hypot(dx,dz))+' m'}else h='Semua bintang emas! Hebat!';
if(h!==lastCp){cpE.innerHTML=h;lastCp=h}updQt()}
if(RID){RID.m.position.set(pl.x,0,pl.z);RID.m.rotation.y=pl.yaw+Math.PI}
{const vb=$('#vb'),nv=!RID&&nearVeh(),h=open||CV?'':RID?'⬇️ Turun (F)':nv?nv.e+' Naik '+nv.ar+' (F)':'';if(vb._h!==h){vb._h=h;vb.textContent=h;vb.style.display=h?'block':'none'}if(RID&&!open)actB.style.display='none'}
itemsUpdate(t,dt);sun.position.set(pl.x+75,70,pl.z+40);sun.target.position.set(pl.x,0,pl.z);sun.target.updateMatrixWorld();PLB.position.set(P.position.x,6.7+Math.sin(t*2.2)*.25,P.position.z);PLB.rotation.y=t*1.6;PLB.visible=!open&&!document.body.classList.contains('cc');R.render(S,cam)}

addEventListener('pagehide',()=>{try{save()}catch(e){}});document.addEventListener('visibilitychange',()=>{if(document.hidden){try{save()}catch(e){}for(const k in key)key[k]=0;jx=0;jy=0}});
