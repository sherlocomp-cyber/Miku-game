/* === BAGIAN 22: Panduan "Ke mana? Ngapain?" ===
   Modul mandiri: tidak mengubah file lain. Memakai: target(), QS, G, pois, STN, pl, cam, S, THREE, mg, near, open, mode, ready, ts.
   Isi:
   1) tiang cahaya + cincin + panah 3D di tujuan misi (kelihatan dari jauh)
   2) penunjuk di tepi layar (nama tujuan + jarak) saat tujuan belum terlihat
   3) kotak "Ngapain sekarang?" berisi langkah 1-2-3 (ketuk untuk Bantuan)
   4) cincin + garis putus-putus tujuan di peta kecil
   5) tombol Bicara/Misi berdenyut saat saatnya ditekan
   6) kartu Bantuan (arti tanda peta, fungsi tombol) */
(function(){
if(window.KPG||typeof THREE==='undefined')return;
const Q=s=>document.querySelector(s);
const dv=(f,d)=>{try{const r=f();return r===undefined?d:r}catch(e){return d}};
const TOUCH=dv(()=>matchMedia('(pointer:coarse)').matches,false);
let hideUI=true,fr=0,flashT=0,P=null,sx=null,sz=null,lx=0,lz=0,moved=false,lastMoveT=performance.now(),nudgeT=performance.now(),snap=true,lastKey='',lastDist='';

/* ---------- elemen DOM ---------- */
const gc=document.createElement('div');gc.id='gc';gc.tabIndex=0;gc.setAttribute('role','button');gc.setAttribute('aria-label','Panduan: ke mana dan mengerjakan apa. Ketuk untuk bantuan.');
gc.innerHTML='<div class="gc1"><span class="gcn" id="gcn">1</span><b id="gct"></b><span class="gcd" id="gcd" aria-hidden="true"></span><span class="gcq" aria-hidden="true">❓</span></div><div class="gcs" id="gcs"></div><div class="gcp" id="gcp"></div>';
document.body.appendChild(gc);
const gp=document.createElement('div');gp.id='gp';gp.setAttribute('aria-hidden','true');
gp.innerHTML='<svg class="gpa" id="gpa" width="30" height="36" viewBox="0 0 18 22"><path d="M9 1 L15 10 H11 V21 H7 V10 H3 Z" fill="#ffcf3f" stroke="#1d2b53" stroke-width="2" stroke-linejoin="round"/></svg><div class="gpl"><b id="gpt"></b><small id="gpd"></small></div>';
document.body.appendChild(gp);
const gcn=Q('#gcn'),gct=Q('#gct'),gcd=Q('#gcd'),gcs=Q('#gcs'),gcp=Q('#gcp'),gpa=Q('#gpa'),gpt=Q('#gpt'),gpd=Q('#gpd');
const tv=new THREE.Vector3();

/* ---------- rencana: apa yang harus dilakukan sekarang ---------- */
function lab(T){const p=dv(()=>pois.find(o=>Math.hypot(o.n.position.x-T.x,o.n.position.z-T.z)<.6),null);return p&&p.d?(p.d.e||'')+' '+(p.d.pl||T.t||''):(T.t||'tujuan')}
function atT(T,tg){const n=dv(()=>near,null);if(!n)return false;
 if(n.kind=='st')return tg.startsWith('st:')&&Math.hypot(n.x-T.x,n.z-T.z)<1.2;
 if(tg.startsWith('st:'))return false;
 if(tg=='any')return true;
 return !!n.n&&Math.hypot(n.n.position.x-T.x,n.n.position.z-T.z)<1.2}
function plan(){
 const q=dv(()=>QS[G.q],null),tg=String(q?q.tg:'npc'),T=dv(target,null);
 const r={n:1,ti:'',su:'',st:['1 Jalan','2 Bicara','3 Jawab'],ai:0,d:null,kind:'go',pul:'',lab:T?lab(T):''};
 const prog=q?dv(()=>Math.min(q.v(),q.g)+'/'+q.g,''):'',mis=q?' Misi: '+q.t+(prog?' ('+prog+')':'')+'.':'';
 const INT=dv(()=>INTR.on,false),rid=dv(()=>!!RID,false);
 const d=T&&!T.b?Math.hypot(T.x-pl.x,T.z-pl.z):null;r.d=d;
 if(!moved){r.n='▶';r.kind='start';r.ti='Ayo mulai berjalan!';r.su=TOUCH?'Geser joystick ⚪ di kiri bawah layar ke arah mana saja.':'Tekan W A S D (atau tombol panah) di keyboard.';r.d=null;return r}
 if(INT){const b=dv(()=>pois[INTR.b.i],null),n=dv(()=>near,null),here=b&&T&&!T.b&&Math.hypot(b.n.position.x-T.x,b.n.position.z-T.z)<1.2;
  r.d=null;
  if(n&&b&&n===b){r.n=2;r.ai=1;r.ti='Tekan tombol Bicara';r.su='Tombol kuning di kanan bawah (atau tombol E).'+mis;r.pul='act';return r}
  if(here||tg=='any'){r.ti='Dekati meja di depan';r.su='Jalan ke meja dan warga di tengah ruangan, lalu tekan Bicara.';return r}
  r.kind='out';r.ti='Keluar dulu 🚪';r.su='Jalan ke keset hijau di bagian bawah ruangan.';return r}
 if(!T){r.n='★';r.kind='done';r.d=null;r.ti='Semua misi selesai! 🏆';r.su='Terus berlatih di 🧭 Jalur SAS, atau coba 🎓 Ujian Akhir.';r.st=['🧭 Jalur','🎓 Ujian','🃏 Main'];r.ai=-1;return r}
 if(T.b){r.d=null;r.ti='Buka 📋 Misi';r.su='Pilih tab 🌍 Dunia Nyata, kerjakan bersama teman atau keluarga, lalu centang.';r.st=['1 Buka 📋','2 Tab 🌍','3 Centang'];r.pul='bkb';return r}
 if(tg=='box'){const dk=d<8;r.ti=dk?'Sentuh kotak ? ungu!':'Cari kotak ? ungu';r.su=dk?'Jalan mendekat sampai menyentuh kotaknya.':'Ikuti tiang kuning ✨ ke kotak yang melayang.'+mis;r.st=['1 Cari','2 Sentuh','3 Pelajari'];r.ai=dk?1:0;return r}
 const st=tg.startsWith('st:');if(st)r.st=['1 Jalan','2 Belajar','3 Jawab'];
 if(rid&&d<22){r.ti='Turun dari kendaraan';r.su='Tekan tombol “Turun” (atau F), lalu '+(st?'tekan Belajar.':'tekan Bicara.');return r}
 if(atT(T,tg)){r.n=2;r.ai=1;r.ti=st?'Tekan tombol Belajar':'Tekan tombol Bicara';r.su='Tombol kuning di kanan bawah (atau tombol E). Baca kartunya, lalu jawab 5 soal.';r.pul='act';return r}
 r.ti='Jalan ke '+r.lab;
 r.su=(tg=='any'?'Warga mana saja boleh. ':'')+'Ikuti tiang kuning ✨ dan panah.'+mis;
 if(d>90&&!rid&&dv(()=>VEH.length,0))r.su+=' 💡 Jauh? Naik kendaraan ⬜ (tekan F di dekatnya).';
 return r}

/* ---------- kotak "Ngapain sekarang?" ---------- */
const stepHTML=p=>p.st.map((s,k)=>'<i class="'+(k==p.ai?'on':k<p.ai?'ok':'')+'">'+(k<p.ai?'✓ ':'')+s+'</i>').join('');
function render(){const p=P;if(!p)return;
 const key=[p.n,p.ti,p.su,p.ai,p.st.join('|')].join('¦');
 if(key!==lastKey){lastKey=key;gcn.textContent=p.n;gct.textContent=p.ti;gcs.textContent=p.su;gcp.innerHTML=stepHTML(p)}
 const dd=p.d!=null?Math.round(p.d)+' m':'';if(dd!==lastDist){lastDist=dd;gcd.textContent=dd}}
function place(){const s=Q('#stat'),mm=Q('#mm');if(!s||!mm)return;
 const sr=s.getBoundingClientRect().right,ml=mm.getBoundingClientRect().left,av=ml-sr-24;
 if(av>=190){gc.classList.remove('bot');gc.style.maxWidth=Math.min(av,380)+'px';gc.style.left=Math.round(sr+12+av/2)+'px'}
 else{gc.classList.add('bot');gc.style.maxWidth='min(46vw,380px)';gc.style.left='50%'}}

/* ---------- tiang cahaya 3D ---------- */
let BC=null,bP,bC,bR,bA;
function mk(){const M=(c,o)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,fog:false,side:THREE.DoubleSide});
 BC=new THREE.Group();
 bP=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,90,20,1,true),M(0xffd23f,.2));bP.position.y=45;
 bC=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,90,10,1,true),M(0xfff6b0,.5));bC.position.y=45;
 bR=new THREE.Mesh(new THREE.RingGeometry(2.3,3.3,40),M(0xffcf3f,.9));bR.rotation.x=-Math.PI/2;bR.position.y=.4;
 bA=new THREE.Group();const cg=new THREE.ConeGeometry(1.5,3,5);
 const a1=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({color:0xffcf3f,fog:false})),a2=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({color:0x1d2b53,side:THREE.BackSide,fog:false}));
 a2.scale.setScalar(1.28);a1.rotation.x=Math.PI;a2.rotation.x=Math.PI;bA.add(a2);bA.add(a1);
 BC.add(bP);BC.add(bC);BC.add(bR);BC.add(bA);BC.visible=false;BC.traverse(o=>{o.renderOrder=5;o.frustumCulled=false});S.add(BC)}
function beacon(T,vis,now,d){
 if(!BC){if(!vis)return;mk()}
 if(!vis){BC.visible=false;snap=true;return}
 if(snap){BC.position.set(T.x,0,T.z);snap=false}else{BC.position.x+=(T.x-BC.position.x)*.25;BC.position.z+=(T.z-BC.position.z)*.25}
 BC.visible=true;
 const fl=now<flashT,k=Math.min(4,Math.max(1,d/30));
 bP.visible=bC.visible=d>8;
 bP.scale.set(fl?2:1,1,fl?2:1);bP.material.opacity=fl?.4:.2;
 bR.scale.setScalar((1+.15*Math.sin(now/260))*Math.max(1,d/60)*(fl?1.4:1));bR.material.opacity=.7+.2*Math.sin(now/260);
 bA.scale.setScalar(k);bA.position.y=7.5+k*1.2+Math.sin(now/280)*.8*k;bA.rotation.y=now/700}

/* ---------- penunjuk di layar ---------- */
function chip(T,vis,d){
 if(!vis||!P||!T||T.b){gp.style.display='none';return}
 const W=innerWidth,H=innerHeight;
 tv.set(T.x,9,T.z).applyMatrix4(cam.matrixWorldInverse);
 const behind=tv.z>0,cx=tv.x;tv.applyMatrix4(cam.projectionMatrix);
 let x=(tv.x*.5+.5)*W,y=(-tv.y*.5+.5)*H;
 const xm=Math.min(90,W*.12),yt=Math.min(120,H*.3),yb=Math.min(120,H*.3),rx=W/2,ry=(yt+H-yb)/2,hx=W/2-xm,hy=Math.max(10,(H-yt-yb)/2);
 let dx=x-rx,dy=y-ry;if(behind){dx=(cx>=0?1:-1)*hx;dy=hy}
 const t=Math.min(hx/(Math.abs(dx)||1e-6),hy/(Math.abs(dy)||1e-6),1),on=!behind&&t>=1;
 x=rx+dx*t;y=ry+dy*t;
 if(on&&d<9){gp.style.display='none';return}
 gp.style.display='flex';gp.classList.toggle('on',on);
 gpa.style.transform='rotate('+(on?180:Math.round(Math.atan2(dx,-dy)*57.3))+'deg)';
 gp.style.transform='translate('+Math.round(x)+'px,'+Math.round(y)+'px) translate(-50%,'+(on?'-100%':'-50%')+')';
 const tx=P.lab||T.t||'',dd=Math.round(d)+' m';
 if(gpt._v!==tx){gpt._v=tx;gpt.textContent=tx}if(gpd._v!==dd){gpd._v=dd;gpd.textContent=dd}}

/* ---------- peta kecil: cincin + garis ke tujuan ---------- */
function minimap(T,vis){const c=dv(()=>mg,null);if(!c||!vis||!T||T.b)return;
 const mx=x=>(x+220)/440*240,mz=z=>(z+190)/380*220,t=performance.now(),ax=mx(pl.x),az=mz(pl.z),bx=mx(T.x),bz=mz(T.z);
 c.save();c.setLineDash([7,6]);c.lineWidth=3;c.strokeStyle='#1d2b53';c.beginPath();c.moveTo(ax,az);c.lineTo(bx,bz);c.stroke();
 c.lineWidth=1.6;c.strokeStyle='#ffcf3f';c.stroke();c.setLineDash([]);
 const r=9+Math.sin(t/220)*3;c.lineWidth=6;c.strokeStyle='#1d2b53';c.beginPath();c.arc(bx,bz,r,0,7);c.stroke();c.lineWidth=3.5;c.strokeStyle='#ffcf3f';c.stroke();
 c.fillStyle='#ff6b5e';c.strokeStyle='#1d2b53';c.lineWidth=2;c.beginPath();c.arc(ax,az,7,0,7);c.fill();c.stroke();c.restore()}

/* ---------- kapan panduan disembunyikan ---------- */
function calcHide(){
 if(dv(()=>open,true))return true;
 if(dv(()=>CV,false))return true;
 if(dv(()=>EXM.on||EXM.lie,false))return true;
 if(document.body.classList.contains('cc'))return true;
 for(const id of ['st','exh','glh']){const e=Q('#'+id);if(e&&getComputedStyle(e).display!=='none')return true}
 return false}

/* ---------- kartu Bantuan ---------- */
const closeM=()=>{Q('#modal').style.display='none';open=false;mode=null};
function help(){
 if(dv(()=>open,true)||!dv(()=>ready,false))return;
 open=true;mode='help';const m=Q('#modal'),c=Q('#card');m.style.display='flex';c.scrollTop=0;
 const p=plan();
 c.innerHTML='<h2>🧭 Ke mana? Ngapain?</h2>'
 +'<div class="fc"><b>Sekarang:</b> '+p.ti+'<br><small>'+p.su+'</small></div><div class="gcp" style="margin:6px 0 10px">'+stepHTML(p)+'</div>'
 +'<div class="gt">Tiga langkah di setiap misi</div>'
 +'<div class="mi">1️⃣ <b>Jalan</b> ke tempat yang ditunjuk tiang kuning ✨.</div>'
 +'<div class="mi">2️⃣ Tekan tombol kuning <b>Bicara</b> atau <b>Belajar</b> di kanan bawah (keyboard: E).</div>'
 +'<div class="mi">3️⃣ Baca kartunya, lalu <b>jawab 5 soal</b>. Kamu dapat 🏅 lencana dan 🪙 koin. Misi berikutnya muncul sendiri.</div>'
 +'<div class="gt">Cara melihat arah</div>'
 +'<div class="mi">✨ <b>Tiang kuning</b> di kota = tujuanmu, kelihatan dari jauh.</div>'
 +'<div class="mi">🔼 <b>Panah kuning di tepi layar</b> = arah tujuan kalau belum terlihat. Angkanya jarak dalam meter.</div>'
 +'<div class="mi">🗺️ <b>Peta kecil</b> (kanan atas): lingkaran kuning berkedip dan garis putus-putus = tujuan.</div>'
 +'<details class="hd"><summary>🗺️ Arti tanda di peta kecil</summary><ul><li>🔴 Titik merah besar = kamu.</li><li>⭕ Lingkaran kuning berkedip = tujuan misi.</li><li>● Lingkaran kecil = warga (warnanya berubah setelah kamu dapat lencana).</li><li>■ Kotak besar = pos belajar: hijau Dhamir Munfasil, biru Dhamir Muttasil, oranye Tanya-Jawab, ungu Susun Kalimat.</li><li>▪ Kotak ungu kecil = kotak ? (kosakata).</li><li>⬜ Kotak putih = kendaraan (tekan F di dekatnya untuk naik).</li></ul></details>'
 +'<details class="hd"><summary>🔘 Fungsi tombol di atas</summary><ul><li>🧭 <b>Jalur</b>: 7 stasiun belajar menuju SAS.</li><li>📋 <b>Misi</b>: daftar misi, toko, tugas dunia nyata, laporan.</li><li>🔁 <b>Ulang</b>: kuis ulang harian.</li><li>🃏 <b>Main</b>: permainan kartu pasangan.</li><li>🎓 <b>Ujian</b>: ujian akhir 40 soal.</li><li>🎨 <b>Gaya</b>: ubah karakter.</li></ul></details>'
 +'<button class="opt go" id="gpf">🎯 Tunjukkan arah tujuan</button><button class="opt" id="gpx">Tutup</button>';
 Q('#gpf').onclick=()=>{flashT=performance.now()+6000;closeM()};Q('#gpx').onclick=closeM}
gc.onclick=help;gc.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();help()}};
addEventListener('keydown',e=>{if(e.key=='Escape'&&dv(()=>mode,null)=='help')closeM()});
addEventListener('resize',()=>{try{place()}catch(e){}});

/* ---------- dipanggil setiap frame (setelah loop() selesai) ---------- */
function frame(){
 fr++;const now=performance.now();
 if(typeof pl==='undefined'||!pl||!cam||!S)return;
 if(fr%10==1)hideUI=calcHide();
 const hide=hideUI;
 if(sx===null){sx=pl.x;sz=pl.z;lx=pl.x;lz=pl.z}
 if(hide)lastMoveT=now;
 else{if(!moved&&Math.hypot(pl.x-sx,pl.z-sz)>5)moved=true;if(Math.hypot(pl.x-lx,pl.z-lz)>.06){lx=pl.x;lz=pl.z;lastMoveT=now}}
 const INT=dv(()=>INTR.on,false),T=hide?null:dv(target,null),vis=!hide&&!INT&&!!T&&!T.b;
 const d=vis?Math.hypot(T.x-pl.x,T.z-pl.z):0;
 if(fr%6==0||(!P&&!hide)){P=hide?null:plan();
  gc.style.display=(hide||!P)?'none':'block';if(P)render();
  const a=Q('#act'),bk=Q('#bkb');
  if(a)a.classList.toggle('gp-pulse',!!(P&&P.pul=='act'&&a.style.display!=='none'));
  if(bk)bk.classList.toggle('gp-pulse',!!(P&&P.pul=='bkb'))}
 if(hide&&gc.style.display!=='none')gc.style.display='none';
 if(fr%30==0)place();
 beacon(T,vis,now,d);chip(T,vis,d);minimap(T,vis);
 if(!hide&&now-lastMoveT>30000&&now-nudgeT>30000){nudgeT=now;flashT=now+4500;gc.classList.add('nudge');setTimeout(()=>gc.classList.remove('nudge'),3800);dv(()=>ts('🧭 Bingung? Ikuti tiang kuning ✨ atau ketuk kotak panduan di atas.',4000))}}

/* ---------- pasang ke loop game ---------- */
let errN=0;
if(typeof loop==='function'&&!loop.__kpg){const L0=loop;const W=function(){L0();try{frame()}catch(e){if(errN++<3)console.warn('panduan',e)}};W.__kpg=1;window.loop=W}
setTimeout(place,300);
window.KPG={plan,help,flash:()=>{flashT=performance.now()+6000}};
})();
