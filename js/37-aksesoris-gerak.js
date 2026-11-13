// ================= AKSESORIS v50: aksi interaktif (terbang, kepak sayap, hover, payung, bola, balon, lampu, kompas, foto) =================
// Tombol aksi muncul di kanan layar untuk tiap aksesoris interaktif yang dipakai. Keyboard: 1-5 (atau G untuk yang pertama).
(()=>{
const css=document.createElement('style');css.textContent=`#kxb{position:fixed;right:max(10px,env(safe-area-inset-right));bottom:calc(138px + env(safe-area-inset-bottom));display:none;flex-direction:column;gap:6px;z-index:6;align-items:flex-end}
#kxb button{font:700 14px "Baloo 2",sans-serif;min-height:44px;padding:4px 12px;border:3px solid #1d2b53;border-radius:14px;background:#fffaf0;color:#1d2b53;box-shadow:0 3px 0 #1d2b53;touch-action:manipulation}
#kxb button:active{transform:translateY(2px);box-shadow:0 1px 0 #1d2b53}#kxb small{margin-left:6px;opacity:.55}
#kxg{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);display:none;align-items:center;gap:8px;z-index:6;background:#fffaf0;border:3px solid #1d2b53;border-radius:14px;padding:4px 10px;font:700 14px "Baloo 2",sans-serif;color:#1d2b53}
#kxg i{width:120px;height:12px;border-radius:8px;background:#d7dce8;overflow:hidden;display:block}#kxg u{display:block;height:100%;background:linear-gradient(90deg,#ff8a3d,#ffcf3f);width:100%}
.kxflash{position:fixed;inset:0;background:#fff;z-index:40;pointer-events:none;animation:kxf .45s ease-out forwards}@keyframes kxf{from{opacity:.9}to{opacity:0}}
#kxs{position:fixed;left:10px;bottom:10px;z-index:40;background:#fffaf0;border:3px solid #1d2b53;border-radius:12px;padding:6px;width:190px;transform:rotate(-3deg);font:700 13px "Baloo 2",sans-serif;color:#1d2b53}
#kxs img{width:100%;display:block;border-radius:6px}#kxs .r{display:flex;gap:6px;margin-top:6px}#kxs a,#kxs button{flex:1;text-align:center;padding:6px;border:2px solid #1d2b53;border-radius:10px;background:#ffe8a6;color:#1d2b53;font:inherit;text-decoration:none}`;document.head.appendChild(css);
const jb=$('#jb');if(jb){jb.addEventListener('pointerdown',()=>{KX.jh=1});['pointerup','pointercancel','pointerleave'].forEach(e=>jb.addEventListener(e,()=>{KX.jh=0}))}
const held=()=>!!(key[' ']||KX.jh),v3=new THREE.Vector3(),now=()=>cl.elapsedTime,
 can=()=>!open&&!CV&&typeof ready!=='undefined'&&ready&&!RID&&!EXM.on,
 inp=()=>{const ix=(key.d||key.arrowright?1:0)-(key.a||key.arrowleft?1:0)+jx,iy=(key.w||key.arrowup?1:0)-(key.s||key.arrowdown?1:0)+jy,l=Math.hypot(ix,iy);if(l<.05)return null;const k=l>1?1/l:1,s=Math.sin(pl.yaw),c=Math.cos(pl.yaw);return{mx:(-s*iy+c*ix)*k,mz:(-c*iy-s*ix)*k}},
 push=(m,sp)=>{pl.x+=m.mx*sp;pl.z+=m.mz*sp;if(!INTR.on){pl.x=Math.max(-205,Math.min(205,pl.x));pl.z=Math.max(-175,Math.min(175,pl.z))}},
 R2=a=>a[Math.random()*a.length|0];
// ---- partikel ----
const PP=[],PG=new THREE.SphereGeometry(.2,6,5);
KX.puff=(x,y,z,vx,vy,vz,col,sz,life)=>{if(!PP.length)for(let i=0;i<40;i++){const m=new THREE.Mesh(PG,new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,depthWrite:false}));m.visible=false;S.add(m);PP.push({m,l:0,L:1,s:1,v:new THREE.Vector3()})}
 const q=PP.find(a=>a.l<=0);if(!q)return;q.m.visible=true;q.m.position.set(x,y,z);q.v.set(vx,vy,vz);q.l=q.L=life;q.s=sz;q.m.material.color.setHex(col);q.m.scale.setScalar(sz)};
const ppUpd=dt=>PP.forEach(q=>{if(q.l<=0)return;q.l-=dt;if(q.l<=0){q.m.visible=false;return}q.m.position.addScaledVector(q.v,dt);const a=q.l/q.L;q.m.material.opacity=a*.9;q.m.scale.setScalar(q.s*(1.6-a*.6))});
// ---- dinding: lepas saat terbang di atas gedung ----
let WS=null;const wallsOff=on=>{if(on&&!WS&&!INTR.on)WS=walls.splice(0);else if(!on&&WS){walls.push(...WS);WS=null}};
// ---- terbang: jetpack, roket, baling-baling bambu ----
const FC={jetpack:{up:9,max:60,dr:16,dn:-3,boost:.8},roketx:{up:17,max:140,dr:8,dn:-4.5,boost:1.7,cd:1},bambu:{up:6.5,max:26,dr:9,dn:-2.2,boost:.4}},FL={on:0,id:'',fuel:100,thr:0,air:0,wait:0,tk:0,sk:0};
function stopFly(){if(!FL.on)return;FL.on=0;FL.wait=0;FL.thr=0;wallsOff(0);KX.fl.forEach(m=>m.scale.set(.01,.01,.01))}
function fly(id){if(HV.on)hover();if(FL.on){stopFly();return}
 if(FL.fuel<15){ts('⛽ Bahan bakar habis. Tunggu terisi di tanah ya',2200);snd(180,.2,'sawtooth');return}
 const c=FC[id];FL.on=1;FL.id=id;FL.air=0;FL.thr=0;
 if(c.cd){FL.wait=1;[['3…',0],['2…',800],['1…',1600]].forEach(([m,d])=>setTimeout(()=>{if(FL.on&&FL.wait){ts('🚀 '+m,750);snd(500+d/2,.12,'square',.07)}},d));
  setTimeout(()=>{if(FL.on&&FL.wait){FL.wait=0;pl.vy=24;KX.whoosh(1.2,.4);ts('🚀 Lepas landas! Tahan Lompat untuk naik',2600)}},2400)}
 else{ts('✨ '+(id=='bambu'?'Baling-baling berputar':'Mesin menyala')+'! Tahan Lompat untuk naik, lepas untuk turun pelan. Tekan tombol lagi untuk mematikan.',3600);snd(300,.3,'sawtooth',.08);KX.whoosh(.5,.2)}}
function stars(){if(KX.stars)return KX.stars;const n=260,p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=Math.random()*6.283,e=Math.random()*1.3+.1,r=170;p[i*3]=Math.cos(a)*Math.cos(e)*r;p[i*3+1]=Math.sin(e)*r;p[i*3+2]=Math.sin(a)*Math.cos(e)*r}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const m=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:2.2,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));m.frustumCulled=false;S.add(m);return KX.stars=m}
function flyUpd(dt,t){
 if(!FL.on){FL.fuel=Math.min(100,FL.fuel+(pl.y<=.05?30:6)*dt);
  if(pl.y>35||KX.stars){const a=Math.max(0,Math.min(1,(pl.y-35)/45));if(a>0||KX.stars){const s=stars();s.position.set(pl.x,0,pl.z);s.material.opacity=a;s.visible=a>0}}return}
 if(open||CV)return;if(INTR.on||RID){stopFly();return}
 const c=FC[FL.id]||FC.jetpack;FL.thr=held()&&!FL.wait&&FL.fuel>0?1:0;
 if(FL.thr)FL.fuel=Math.max(0,FL.fuel-c.dr*dt);else if(pl.y<=.05&&!FL.wait)FL.fuel=Math.min(100,FL.fuel+10*dt);
 if(FL.wait)pl.vy=0;else{pl.vy+=42*dt;const vt=FL.thr?c.up:c.dn;if(!(FL.thr&&pl.y>=c.max))pl.vy+=(vt-pl.vy)*Math.min(1,dt*(FL.thr?3.5:2.5));if(pl.y>=c.max&&pl.vy>0)pl.vy=0}
 if(pl.y>1.2)FL.air=1;if(FL.air&&pl.y<=.02){stopFly();ts('🛬 Mendarat dengan selamat!',1400);return}
 const m=FL.wait?null:inp();if(m)push(m,12*c.boost*(key.shift?1.4:1)*dt);
 wallsOff(pl.y>26);
 const q=FL.wait?1:FL.thr?1.5:.35;KX.fl.forEach(f=>f.scale.set(1,q*(.8+Math.random()*.4),1));
 FL.tk+=dt;if((FL.thr||FL.wait)&&FL.tk>.04&&KX.noz.length){FL.tk=0;P.updateMatrixWorld();KX.noz.forEach(n=>{P.localToWorld(v3.set(n[0],n[1],n[2]));KX.puff(v3.x,v3.y,v3.z,(Math.random()-.5)*1.4,-5-Math.random()*3,(Math.random()-.5)*1.4,R2([0xffb040,0xff7a2f,0xcfd6de]),.38,.55)})}
 FL.sk-=dt;if((FL.thr||FL.wait)&&FL.sk<=0){FL.sk=.18;KX.whoosh(.2,.06)}
 if(pl.y>.5||FL.wait){P.rotation.x=(m?.3:.1)+(FL.thr?.08:0);const w=Math.sin(t*9);P.legL.rotation.x=.25+.1*w;P.legR.rotation.x=.15-.1*w;
  if(FL.id=='roketx'){P.armL.rotation.x=P.armR.rotation.x=-2.9;P.armL.rotation.z=-.15;P.armR.rotation.z=.15}else{P.armL.rotation.z=-.75;P.armR.rotation.z=.75;P.armL.rotation.x=P.armR.rotation.x=.1}}
 if(FL.wait)P.position.x+=(Math.random()-.5)*.12;
 if(pl.y>2){cam.position.y+=Math.min(pl.y*.3,18);cam.lookAt(pl.x,3+pl.y*.55,pl.z)}
 if(pl.y>35){const a=Math.min(1,(pl.y-35)/45),s=stars();s.position.set(pl.x,0,pl.z);s.material.opacity=a;s.visible=true}}
function propUpd(dt){const b=KX.ref.bambu;if(b)b.rotation.y+=dt*((FL.on&&FL.id=='bambu')?(FL.thr?42:16):1.5)}
// ---- sayap: kepak & meluncur ----
const WG={st:100,fl:0,h:0};
function flap(){if(!KX.wings)return;if(WG.st<22&&pl.y>.3){ts('🪽 Sayap lelah, tunggu sebentar',1200);return}WG.st=Math.max(0,WG.st-22);pl.vy=Math.max(pl.vy,12.5);WG.fl=1;snd(520,.1,'sine',.07);for(let i=0;i<6;i++)KX.puff(pl.x+(Math.random()-.5)*2,pl.y+3,pl.z+(Math.random()-.5)*2,(Math.random()-.5)*2,1+Math.random()*2,(Math.random()-.5)*2,0xffffff,.25,.8)}
function wingUpd(dt,t){const w=KX.wings;if(!w)return;WG.st=Math.min(100,WG.st+(pl.y<=.1?45:12)*dt);const h=held();
 if(!open&&!FL.on&&!HV.on){if(h&&!WG.h&&pl.y>.4)flap();if(h&&pl.y>.4&&pl.vy<-2.8)pl.vy=-2.8}WG.h=h;
 WG.fl=Math.max(0,WG.fl-dt*2.2);const air=pl.y>.3,th=air?.5+.38*Math.sin(t*(10+WG.fl*10))*(.4+WG.fl*.6):.1+.06*Math.sin(t*1.6);w.forEach((g,i)=>g.rotation.y=(i?1:-1)*th)}
// ---- papan hover ----
const HV={on:0,tk:0};
function hover(){if(!KX.ref.hover)return;if(FL.on)stopFly();HV.on=!HV.on;snd(HV.on?660:440,.12,'triangle');ts(HV.on?'🛹 Papan Hover aktif: lebih cepat dan melayang':'🛹 Papan Hover disimpan',2000)}
function hvUpd(dt,t){const r=KX.ref;if(!r.hover)return;r.hover.visible=!!HV.on;if(r.carry)r.carry.visible=!HV.on;if(!HV.on||open||CV)return;if(INTR.on||FL.on||RID){HV.on=0;return}
 const m=inp();if(m)push(m,10.8*(key.shift?1.5:1)*dt);P.position.y+=.55+Math.sin(t*3)*.05;P.rotation.x=m?.12:0;P.legL.rotation.x=P.legR.rotation.x=0;r.hover.rotation.z=Math.sin(t*2)*.03;
 HV.tk+=dt;if(HV.tk>.07){HV.tk=0;P.localToWorld(v3.set(0,-.3,-.9));KX.puff(v3.x,v3.y,v3.z,0,-1,0,0x39e6ff,.3,.4)}}
// ---- payung ----
const U={open:0,k:0};
const umb=()=>{if(!KX.ref.payung)return;U.open=!U.open;snd(U.open?620:420,.08,'triangle');ts(U.open?'☂️ Payung terbuka. Melompat turun jadi melayang pelan':'☂️ Payung ditutup',1800)};
function umbUpd(dt){const r=KX.ref.payung;if(!r)return;U.k+=((U.open?1:0)-U.k)*Math.min(1,dt*9);r.can.scale.set(.15+.85*U.k,1.35-.35*U.k,.15+.85*U.k);if(U.open&&!open&&pl.y>.2&&pl.vy<-2.4&&!FL.on)pl.vy=-2.4}
// ---- bola ----
const BL={w:null,v:new THREE.Vector3(),on:0,mv:0,d0:null};
function killBall(){if(BL.w){S.remove(BL.w);BL.w=null}BL.on=0;BL.mv=0;const r=KX.ref.bola;if(r)r.visible=true}
function shoot(x,y,z){const ry=P.rotation.y;BL.v.set(Math.sin(ry)*15,8,Math.cos(ry)*15);BL.d0={x,z};BL.mv=1;KX.kk=now();snd(260,.1,'triangle')}
function kick(){const r=KX.ref.bola;if(!r)return;
 if(BL.on){const p=BL.w.position;if(Math.hypot(p.x-pl.x,p.z-pl.z)>4){killBall();ts('⚽ Bola kembali ke tangan',1400);snd(700,.08,'triangle');return}p.y=Math.max(p.y,.6);shoot(p.x,p.y,p.z);return}
 P.updateMatrixWorld(true);r.getWorldPosition(v3);BL.w=r.clone();BL.w.visible=true;BL.w.position.copy(v3);S.add(BL.w);BL.on=1;r.visible=false;shoot(v3.x,v3.y,v3.z)}
function ballUpd(dt,t){const r=KX.ref.bola;if(r&&BL.on)r.visible=false;
 if(KX.kk!=null){const a=t-KX.kk;if(a<.35)P.legR.rotation.x=-1.3*Math.sin(a/.35*Math.PI);else KX.kk=null}
 if(!BL.on||!BL.w)return;const w=BL.w,v=BL.v,p=w.position;v.y-=30*dt;p.addScaledVector(v,dt);
 if(p.y<.42){p.y=.42;if(v.y<-1.8){v.y=-v.y*.55;v.x*=.9;v.z*=.9}else v.y=0}
 if(p.y<=.43&&v.y==0){const f=Math.pow(.3,dt);v.x*=f;v.z*=f}
 walls.forEach(q=>{if(Math.abs(p.x-q.x)<q.hw+.42&&Math.abs(p.z-q.z)<q.hd+.42&&p.y<8){const ox=q.hw+.42-Math.abs(p.x-q.x),oz=q.hd+.42-Math.abs(p.z-q.z);if(ox<oz){p.x+=Math.sign(p.x-q.x||1)*ox;v.x*=-.6}else{p.z+=Math.sign(p.z-q.z||1)*oz;v.z*=-.6}}});
 p.x=Math.max(-205,Math.min(205,p.x));p.z=Math.max(-175,Math.min(175,p.z));w.rotation.x+=v.z*dt/.42;w.rotation.z-=v.x*dt/.42;
 const dx=p.x-pl.x,dz=p.z-pl.z,d=Math.hypot(dx,dz);if(d>.01&&d<1.3&&p.y<1&&!open&&pl.y<1&&Math.hypot(v.x,v.z)<7){v.x=dx/d*8;v.z=dz/d*8;v.y=Math.max(v.y,2)}
 if(BL.mv&&p.y<=.43&&Math.hypot(v.x,v.z)<.4){BL.mv=0;ts('⚽ Tendanganmu sejauh <b>'+Math.round(Math.hypot(p.x-BL.d0.x,p.z-BL.d0.z))+' m</b>! Dekati bola untuk menggiring, tekan lagi untuk menendang.',3200)}}
// ---- balon ----
function pop(){const r=KX.ref.balon;if(!r||r.t>0)return;r.t=1.3;r.g.visible=false;P.updateMatrixWorld(true);r.g.getWorldPosition(v3);v3.y+=2.1;const c=r.bm.color.getHex();for(let i=0;i<16;i++)KX.puff(v3.x,v3.y,v3.z,(Math.random()-.5)*9,Math.random()*5+1,(Math.random()-.5)*9,c,.3,.9);KX.whoosh(.12,.5);snd(1100,.04,'square',.1)}
function balUpd(dt){const r=KX.ref.balon;if(!r)return;
 if(r.t>0){r.t-=dt;if(r.t<=0){r.bm.color.setHex(R2([0xee3333,0x3d6fd6,0xffcf3f,0x2fbf85,0xff8ac8,0x9b6bd6]));r.g.visible=true;r.g.scale.setScalar(.05);r.gr=1}}
 if(r.gr){const s=r.g.scale.x+(1-r.g.scale.x)*Math.min(1,dt*6);r.g.scale.setScalar(s);if(s>.99){r.g.scale.setScalar(1);r.gr=0}}}
// ---- lampu helm ----
const LP={on:0,g:null,l:null,b:null};
function lamp(){LP.on=!LP.on;if(LP.on&&!LP.g){const g=new THREE.Group(),l=new THREE.PointLight(0xfff3c0,1.3,34,1.4),b=new THREE.Mesh(new THREE.ConeGeometry(2.4,9,20,1,true),new THREE.MeshBasicMaterial({color:0xfff3a0,transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide}));l.position.set(0,0,2);b.rotation.x=-kPI/2;b.position.z=4.7;g.add(l,b);S.add(g);LP.g=g;LP.l=l;LP.b=b}
 snd(LP.on?880:560,.08,'triangle');ts(LP.on?'⛏️ Lampu helm menyala':'⛏️ Lampu helm mati',1200)}
function lampUpd(){const lm=KX.ref.lens;if(lm)lm.color.setHex(LP.on?0xfff3a0:0x7a7a60);if(!LP.g)return;LP.l.intensity=LP.on?1.3:0;LP.b.visible=!!LP.on;if(!LP.on)return;P.updateMatrixWorld();P.localToWorld(v3.set(0,4.8,.7));LP.g.position.copy(v3);LP.g.rotation.y=P.rotation.y}
// ---- kompas ----
const CP={on:0,a:null,tk:0,T:null};
function comp(){CP.on=!CP.on;if(CP.on&&!CP.a){const a=new THREE.Mesh(new THREE.ConeGeometry(.55,1.8,12),new THREE.MeshBasicMaterial({color:0xffcf3f}));a.geometry.rotateX(kPI/2);S.add(a);CP.a=a}
 snd(CP.on?880:560,.08,'triangle');ts(CP.on?'🧭 Panah emas di atas kepalamu menunjuk ke misi':'🧭 Panah kompas dimatikan',1800)}
function compUpd(dt,t){const n=KX.ref.needle;if(!n&&!CP.on){if(CP.a)CP.a.visible=false;return}
 if(--CP.tk<=0){CP.tk=10;try{CP.T=target()}catch(e){CP.T=null}}const T=CP.T;
 if(T&&T.x!=null){const b=Math.atan2(T.x-pl.x,T.z-pl.z);if(n)n.rotation.z=-(b-P.rotation.y);if(CP.on&&CP.a){CP.a.visible=true;CP.a.position.set(pl.x,pl.y+7.4+Math.sin(t*3)*.25,pl.z);CP.a.rotation.y=b}}
 if(CP.a&&(!CP.on||!T||T.x==null))CP.a.visible=false}
// ---- kamera foto ----
function shot(){if(KX.sh)return;KX.sh=1;const f=document.createElement('div');f.className='kxflash';document.body.appendChild(f);setTimeout(()=>f.remove(),450);snd(1400,.04,'square',.08);setTimeout(()=>snd(900,.07,'square',.08),70)}
function shotUpd(){if(!KX.sh)return;KX.sh=0;try{R.render(S,cam);const s=R.domElement,W=Math.min(1280,s.width),H=Math.round(W*s.height/s.width),c=document.createElement('canvas');c.width=W;c.height=H+54;const g=c.getContext('2d');g.fillStyle='#fffaf0';g.fillRect(0,0,W,H+54);g.drawImage(s,0,0,W,H);g.fillStyle='#1d2b53';g.font='700 26px sans-serif';g.fillText('Kota Profesi · '+(NM||'Petualang')+' · '+new Date().toLocaleDateString('id-ID'),16,H+36);
 const u=c.toDataURL('image/jpeg',.85),old=$('#kxs');if(old)old.remove();const d=document.createElement('div');d.id='kxs';d.innerHTML='<img alt="Foto Kota Profesi" src="'+u+'"><div class="r"><a download="foto-kota-profesi.jpg" href="'+u+'">💾 Simpan</a><button type="button">✖</button></div>';d.querySelector('button').onclick=()=>d.remove();document.body.appendChild(d);setTimeout(()=>d.remove(),14000)}catch(e){ts('📷 Foto gagal diambil',1500)}}
// ---- daftar aksi, tombol, papan ukur ----
const IX={gitar:['🎸','Main Gitar',()=>KX.panel('gitar')],oud:['🪕','Main Oud',()=>KX.panel('oud')],rebana:['🥁','Tabuh Rebana',()=>KX.panel('rebana')],seruling:['🎶','Tiup Seruling',()=>KX.panel('seruling')],
 jetpack:['🚀','Terbang',()=>fly('jetpack')],roketx:['🚀','Roket!',()=>fly('roketx')],bambu:['🚁','Baling-baling',()=>fly('bambu')],
 sayapm:['🪽','Kepak',flap],sayapk:['🦋','Kepak',flap],sayapn:['🐉','Kepak',flap],sayapcahaya:['✨','Kepak',flap],
 hoverboard:['🛹','Papan Hover',hover],payung:['☂️','Payung',umb],bola:['⚽','Tendang',kick],balon:['🎈','Letuskan',pop],lampuhelm:['⛏️','Lampu',lamp],kompas:['🧭','Arah Misi',comp],kamera:['📷','Foto',shot]};
let bar=null;
function buildBar(){if(!bar){bar=document.createElement('div');bar.id='kxb';document.body.appendChild(bar);bar.addEventListener('click',e=>{const b=e.target.closest('[data-u]');if(b)useItem(b.dataset.u)})}
 bar.innerHTML=KX.worn.map((id,i)=>'<button type="button" data-u="'+id+'"><b>'+IX[id][0]+'</b> '+IX[id][1]+'<small>'+(i+1)+'</small></button>').join('')}
function useItem(id){if(!can()||KX.pn)return;const x=IX[id];if(x)x[2]()}
KX.after=()=>{const w=G.hero.pf!=null?{}:(G.hero.a||{});KX.worn=['k','w','h','f','n'].map(s=>w[s]).filter(id=>id&&IX[id]);const has=id=>KX.worn.includes(id);
 if(FL.on&&!has(FL.id))stopFly();if(HV.on&&!has('hoverboard'))HV.on=0;if(LP.on&&!has('lampuhelm'))LP.on=0;if(KX.pn&&!has(KX.pn.id))KX.close();if(CP.on&&!has('kompas'))CP.on=0;if(U.open&&!has('payung'))U.open=0;if(BL.on&&!has('bola'))killBall();buildBar()};
addEventListener('keydown',e=>{if(e.repeat||KX.pn||(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName)))return;const k=e.key,i=k=='g'||k=='G'?0:'12345'.indexOf(k);if(i<0||!KX.worn[i])return;useItem(KX.worn[i])});
let gd=null;function gauge(){if(!gd){gd=document.createElement('div');gd.id='kxg';gd.innerHTML='<b></b><i><u></u></i><small></small>';document.body.appendChild(gd)}
 let v=null,l='',a='';if(FL.on){v=FL.fuel;l='⛽';a='⬆ '+Math.round(pl.y)+' m'}else if(KX.wings&&WG.st<99){v=WG.st;l='🪽';a=pl.y>1?'⬆ '+Math.round(pl.y)+' m':''}else if(FL.fuel<99&&KX.worn.some(id=>FC[id])){v=FL.fuel;l='⛽'}
 const sh=v!=null&&!open&&!CV;if(gd._s!==sh){gd._s=sh;gd.style.display=sh?'flex':'none'}if(sh){gd.children[0].textContent=l;gd.children[1].firstChild.style.width=Math.max(0,Math.min(100,v))+'%';gd.children[2].textContent=a}}
function frame(t,dt){try{dt=dt||.016;ppUpd(dt);if(KX.pose)KX.pose(t,dt);if(CV&&FL.on)stopFly();
 flyUpd(dt,t);wingUpd(dt,t);hvUpd(dt,t);umbUpd(dt,t);ballUpd(dt,t);balUpd(dt,t);lampUpd(dt,t);compUpd(dt,t);propUpd(dt,t);shotUpd();gauge();
 const sh=!!KX.worn.length&&can()&&!KX.pn&&!document.body.classList.contains('cc');if(bar&&bar._s!==sh){bar._s=sh;bar.style.display=sh?'flex':'none'}}
 catch(e){if(!KX.er){KX.er=1;console.warn('aksesoris',e)}}}
try{const I0=itemsUpdate;itemsUpdate=function(t,d){I0.apply(this,arguments);frame(t,d)}}catch(e){const lp=()=>{requestAnimationFrame(lp);frame(now(),.016)};lp()}
try{if(G&&G.hero)KX.after()}catch(e){console.warn('aksesoris',e)}
})();
