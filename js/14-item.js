// ================= ITEM =================
let jmp=0;$('#jb').addEventListener('pointerdown',e=>{e.preventDefault();jmp=1});
let tsT;function ts(h,ms=2500){const e=$('#ts');e.innerHTML=h;e.style.display='block';clearTimeout(tsT);tsT=setTimeout(()=>e.style.display='none',ms)}
const IT=[];
function freePos(){for(let k=0;k<60;k++){const x=-200+Math.random()*400,z=-170+Math.random()*340;if(!walls.some(w=>Math.abs(x-w.x)<w.hw+2.5&&Math.abs(z-w.z)<w.hd+2.5))return[x,z]}return[0,22]}
function items(){const cg=new THREE.CylinderGeometry(.9,.9,.2,16).rotateX(Math.PI/2),cm=new THREE.MeshLambertMaterial({color:0xffc928,emissive:0x8a5a00});
const rg=new THREE.TorusGeometry(.8,.11,8,22),rm=new THREE.MeshLambertMaterial({color:0xffe066,emissive:0x9a6a00}),ig=new THREE.CylinderGeometry(.6,.6,.26,16).rotateX(Math.PI/2),im=new THREE.MeshLambertMaterial({color:0xf2a900,emissive:0x7a4a00});
const sc=document.createElement('canvas');sc.width=sc.height=64;const sx=sc.getContext('2d');sx.fillStyle='#b87400';sx.font='700 44px sans-serif';sx.textAlign='center';sx.fillText('\u2605',32,47);
const sg=new THREE.CircleGeometry(.5,16),sm=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sc),transparent:true});
const add=(x,z)=>{const m=new THREE.Group();m.add(new THREE.Mesh(cg,cm),new THREE.Mesh(rg,rm),new THREE.Mesh(ig,im));[1,-1].forEach(q=>{const f=new THREE.Mesh(sg,sm);f.position.z=q*.135;if(q<0)f.rotation.y=Math.PI;m.add(f)});m.position.set(x,1.8,z);S.add(m);IT.push({k:'c',m,x})};
for(let l=0;l<16;l++){const ax=l%2,r=ax?RZ[(Math.random()*5)|0]:RX[(Math.random()*7)|0],st=-150+Math.random()*250,ln=l%4<2?-2.4:2.4;for(let j=0;j<7;j++)ax?add(st+j*5,r+ln):add(r+ln,st+j*5)}
for(let i=0;i<30;i++){const q=freePos();add(q[0],q[1])}
const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d');const gd=g.createRadialGradient(32,28,4,32,32,46);gd.addColorStop(0,'#c39bf0');gd.addColorStop(1,'#7a4cc0');g.fillStyle=gd;g.fillRect(0,0,64,64);g.strokeStyle='#fff';g.lineWidth=5;g.strokeRect(3,3,58,58);g.fillStyle='#fff';g.font='700 46px sans-serif';g.textAlign='center';g.fillText('?',32,48);
const qm=new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(cv),emissive:0x331a55}),KG=new THREE.BoxGeometry(.4,.4,.4),KM=new THREE.MeshLambertMaterial({color:0xffd23f,emissive:0x7a5a00});
for(let i=0;i<18;i++){const q=freePos(),m=new THREE.Group(),bx=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),qm);bx.castShadow=true;m.add(bx);for(let a=-1;a<=1;a+=2)for(let b=-1;b<=1;b+=2)for(let c=-1;c<=1;c+=2){const k=new THREE.Mesh(KG,KM);k.position.set(a,b,c);m.add(k)}m.position.set(q[0],3,q[1]);S.add(m);IT.push({k:'q',m,x:q[0],cd:0})}
const pg=new THREE.CylinderGeometry(1.9,1.9,.3,20),pm=new THREE.MeshLambertMaterial({color:0x2fbf85,emissive:0x0d6b46});
const prg=new THREE.TorusGeometry(1.7,.13,6,26).rotateX(Math.PI/2),prm=new THREE.MeshLambertMaterial({color:0xffffff,emissive:0x555555}),pig=new THREE.CylinderGeometry(1.3,1.3,.34,20),pim=new THREE.MeshLambertMaterial({color:0x6fe3b0,emissive:0x1a8a5a}),pag=new THREE.ConeGeometry(.6,1,3),pam=new THREE.MeshLambertMaterial({color:0xffffff,emissive:0x888888});
for(let i=0;i<14;i++){const q=freePos(),m=new THREE.Group();m.add(new THREE.Mesh(pg,pm),new THREE.Mesh(pig,pim));const rr=new THREE.Mesh(prg,prm);rr.position.y=.15;const ar=new THREE.Mesh(pag,pam);ar.position.y=.6;m.add(rr,ar);m.position.set(q[0],.2,q[1]);S.add(m);IT.push({k:'p',m,x:q[0]})}}
function vocab(){const i=rnd(D.length),d=D[i];G.seen.add(i);const r=checkAll();
const ex=[...r.q.map(x=>`🎉 Misi selesai: ${x.t} (+${x.r} 🪙)`),...r.a.map(x=>`🏅 ${x.t} (+${x.r} 🪙)`)];
ts(`${d.e} <span class="ar" style="font-size:26px">${d.ar}</span> = ${d.id} (+3 🪙)`+(ex.length?`<br>${ex.join('<br>')}`:''),ex.length?5500:4200);say(d.ar);
if(r.q.length)setTimeout(()=>{if(!open)celebrate(r.q)},1200);else if(Math.random()<.4)setTimeout(()=>{if(!open)kilat()},1600)}
function itemsUpdate(t,dt){const s=Math.sin;for(const o of IT){const m=o.m,d=Math.hypot(m.position.x-pl.x,m.position.z-pl.z);
if(o.k=='c'){if(!m.visible)continue;m.rotation.y=t*3;m.position.y=1.8+s(t*3+o.x)*.25;if(d<2.3&&pl.y<3){m.visible=false;coins+=5;hud();snd(988,.08);setTimeout(()=>snd(1319,.12),70);ts('+5 🪙',900)}}
else if(o.k=='q'){if(!m.visible){if(t>o.cd)m.visible=true;continue}m.rotation.y=t;m.position.y=3+s(t*2+o.x)*.3;if(d<2.6&&pl.y<4.5){m.visible=false;o.cd=t+25;coins+=3;hud();snd(660,.15,'triangle');vocab()}}
else if(d<2&&pl.y<.8){pl.vy=30;snd(300,.25,'sine',.08)}}}
const begin=()=>{$('#st').style.display='none';open=false;snd(660,.1,'triangle');if(startCele.length){celebrate(startCele);startCele=[]}else revNudge()};
$('#sb').onclick=()=>{const n=$('#nm'),nv=n.value.trim();if(!nv&&!G.hs){n.focus();n.placeholder='Tulis namamu di sini';n.style.borderColor='var(--bad)';n.setAttribute('aria-invalid','true');$('#nme').textContent='Isi namamu dulu ya, supaya progresmu tersimpan.';return}if(nv!==NM){lss('kp.name',nv);try{sessionStorage.setItem('kp.auto','1')}catch(e){}location.reload();return}if(!G.hs){$('#st').style.display='none';ccOpen(begin);return}begin()};
// ---- Layar penuh + kunci landscape ----
const isFS=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function lockLand(){try{if(screen.orientation&&screen.orientation.lock)screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}
function goFS(){try{const d=document.documentElement,f=d.requestFullscreen||d.webkitRequestFullscreen;if(f&&!isFS()){const p=f.call(d);if(p&&p.then)p.then(lockLand,()=>{});else lockLand()}else lockLand()}catch(e){}}
function leaveFS(){try{(document.exitFullscreen||document.webkitExitFullscreen).call(document);if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock()}catch(e){}}
$('#fsb').onclick=()=>{isFS()?leaveFS():goFS()};
if(!(document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen))$('#fsb').style.display='none';
const syncFS=()=>{$('#fsb').textContent=isFS()?'🗗':'⛶'};document.addEventListener('fullscreenchange',syncFS);document.addEventListener('webkitfullscreenchange',syncFS);
let rotOff=false;const rotChk=()=>{$('#rot').classList.toggle('on',!rotOff)};$('#rotb').onclick=()=>{rotOff=true;rotChk()};
try{if(matchMedia('(pointer:coarse)').matches){let fsTry=0,fsOK=false,last=0;
const att=()=>{if(fsOK||fsTry>=12)return;if(isFS()){fsOK=true;return}const t=Date.now();if(t-last<600)return;last=t;fsTry++;goFS()};
/* layar penuh butuh 'user activation': di layar sentuh baru sah saat jari DIANGKAT (pointerup/touchend/click), bukan pointerdown */
['pointerup','touchend','click'].forEach(e=>document.addEventListener(e,att,true));
const ok=()=>{if(isFS())fsOK=true};document.addEventListener('fullscreenchange',ok);document.addEventListener('webkitfullscreenchange',ok)}}catch(e){}
$('#mu').onclick=e=>{muted=!muted;e.currentTarget.textContent=muted?'🔇':'🔊';e.currentTarget.setAttribute('aria-label',muted?'Suara mati. Ketuk untuk menyalakan':'Suara menyala. Ketuk untuk mematikan');if(muted){try{speechSynthesis.cancel()}catch(x){}}};
const cl=new THREE.Clock();let yawc=0,lastNear=null,lastCp='',lastQt='';
const mm=$('#mm'),mg=mm.getContext('2d'),actB=$('#act'),cpE=$('#cp'),qtE=$('#qt');
