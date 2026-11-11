/* === BAGIAN 31: Arena Lampu Ilmu (Tahap 1 dari rencana Arena Belajar) ===
   Modul mandiri, pasangan: css/arena.css. Tidak mengubah file 01-30 (hanya memakai global-nya).
   Permainan: lari saat lampu HIJAU, berhenti total saat lampu MERAH (dijaga Kak Hud-hud, burung hantu).
   Terlihat bergerak saat merah = terpeleset kembali ke gerbang terakhir dan kehilangan 1 hati (bukan "tereliminasi").
   Ada 4 gerbang; tiap gerbang 1 soal dari bank soal Ujian Akhir (EXM.build, zona 1-4). Salah = pembahasan lalu soal lain.
   Bintang = sisa hati (1-3). Data lokal: localStorage SK+':arena' = {try,win,best,bt,d}. Tidak memanggil rec() (Laporan guru tidak berubah).
   Kamera/render: membungkus R.render (aktif hanya saat arena menyala), arena 3D dibangun sekali di z=-1800 (jauh dari kota).
   Cara balik ke tampilan lama: hapus baris <script> js/31 dan <link> css/arena.css di index.html. */
(function(){
'use strict';
if(window.ARN)return;
if(typeof THREE==='undefined'||typeof S==='undefined'||typeof R==='undefined'||typeof P==='undefined'||typeof pl==='undefined'||typeof cam==='undefined'||typeof EXM==='undefined'||typeof EXM.build!=='function'){console.warn('Arena: modul pendukung belum siap');return}

const AZ=-1800,LEN=96,HW=7,SP=8,STOP=2.6,GN=4,GZ=[.25,.5,.75,1].map(f=>AZ-LEN*f);
const ZC=['#2fa56b','#3d82e0','#e0a43a','#9b6bd6'];
const ZT=['Kosakata profesi, tempat & kegiatan','Dhamir munfasil & muttasil','Tanya-jawab & cita-cita','Terjemah & susun kalimat'];
const SG={g:['🟢','اِرْكُضْ','LARI! Tahan tombol'],w:['🟡','اِسْتَعِدَّ','Bersiap…'],r:['🔴','قِفْ','BERHENTI! Lepas tombol']};
const ARX=/[\u0600-\u06FF]/,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const SKA=SK+':arena';
const A={on:false,built:false,ph:'idle',pt:0,v:0,hearts:3,gate:0,opening:0,cz:AZ,light:'g',lt:3,rg:0,run:false,kd:false,q:null,pool:[],miss:[],t0:0,el:0,tp:0,org:null,o:null,shake:0,locked:false,tried:0,won:false,hy:Math.PI,lastSay:0,pk:'',G:null,head:null,sig:null,gt:[],sv:{try:0,win:0,best:0,bt:0,d:''}};
try{Object.assign(A.sv,JSON.parse(lsg(SKA)||'{}'))}catch(e){}
const persist=()=>{try{lss(SKA,JSON.stringify(A.sv))}catch(e){}};
const heartStr=()=>'❤️'.repeat(Math.max(0,A.hearts))+'🖤'.repeat(Math.max(0,3-A.hearts));
const E={};

/* ---------- 1. Elemen layar (HUD, sinyal, tombol lari) ---------- */
(function(){
  const w=document.createElement('div');
  w.innerHTML='<div id="arh"><div class="arp" id="arhe">❤️❤️❤️</div><div class="arbar" aria-hidden="true"><i id="arbi"></i><span class="arfl">🏁</span></div><div class="arp" id="arg">🚪 0/4</div><button class="arp" id="arq" type="button" aria-label="Keluar dari arena">✖</button></div>'
   +'<div id="arsig" class="g" role="status" aria-live="polite"></div>'
   +'<button id="arrun" type="button" aria-label="Tahan untuk lari"><span aria-hidden="true">🏃</span><b>LARI</b><small>tahan · atau Spasi / W</small></button>'
   +'<div id="arc" aria-hidden="true"></div>';
  while(w.firstChild)document.body.appendChild(w.firstChild);
  E.he=$('#arhe');E.bi=$('#arbi');E.g=$('#arg');E.q=$('#arq');E.sig=$('#arsig');E.run=$('#arrun');E.c=$('#arc');
})();

/* ---------- 2. Menggambar papan (kanvas) ---------- */
const fnt=(ar,s)=>ar?`700 ${s}px Amiri,"Noto Naskh Arabic",serif`:`700 ${s}px "Baloo 2",system-ui,sans-serif`;
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function mkSign(w,h,cw,ch,draw){
  const c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d'),t=new THREE.CanvasTexture(c);t.anisotropy=4;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,toneMapped:false,fog:false}));
  const f=()=>{draw(g,cw,ch);t.needsUpdate=true};f();return{m,f}}
function drawSig(g,w,h){
  const L=A.light=='b'?'g':A.light,col=L=='g'?'#178a55':L=='r'?'#c62f26':'#f0b429';
  g.fillStyle='#1d2b53';g.fillRect(0,0,w,h);g.fillStyle=col;rr(g,16,16,w-32,h-32,40);g.fill();
  g.fillStyle=L=='w'?'#1d2b53':'#ffffff';g.textAlign='center';g.textBaseline='middle';
  g.direction='rtl';g.font=fnt(1,190);g.fillText(SG[L][1],w/2,h*.42);
  g.direction='ltr';g.font=fnt(0,84);g.fillText(L=='g'?'LARI!':L=='r'?'BERHENTI!':'BERSIAP!',w/2,h*.8)}
function drawGate(i){return(g,w,h)=>{
  g.fillStyle=ZC[i];g.fillRect(0,0,w,h);g.fillStyle='#fffdf5';g.strokeStyle='#1d2b53';g.lineWidth=8;rr(g,14,14,w-28,h-28,26);g.fill();g.stroke();
  g.fillStyle='#1d2b53';g.textAlign='center';g.textBaseline='middle';
  g.direction='rtl';g.font=fnt(1,84);g.fillText('الْبَوَّابَةُ',w/2,h*.38);
  g.direction='ltr';g.font=fnt(0,52);g.fillText(i==GN-1?'🏁 Gerbang Akhir':'Gerbang '+(i+1)+'/'+GN,w/2,h*.74)}}

/* ---------- 3. Arena 3D (dibangun sekali, saat pertama masuk) ---------- */
function mkArena(){
  if(A.built)return;A.built=true;
  const G0=A.G=new THREE.Group();G0.visible=false;S.add(G0);
  const L=c=>new THREE.MeshLambertMaterial({color:c});
  const bx=(g,w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),L(c));m.position.set(x,y,z);g.add(m);return m};
  bx(G0,500,2,500,0x7fc65a,0,-1.1,AZ-LEN/2-10);
  bx(G0,HW*2+2,2,LEN+44,0xe9d9a6,0,-1,AZ-LEN/2-10);
  for(let k=0;k*8<LEN+8;k+=2)bx(G0,HW*2,.05,4,0xf4e8c0,0,.02,AZ-2-k*8);
  bx(G0,HW*2,.06,.6,0xffffff,0,.04,AZ+2.4);
  [-1,1].forEach(s=>bx(G0,.4,1.2,LEN+40,0xffffff,s*(HW+.6),.6,AZ-LEN/2-10));
  /* tribun + penonton */
  const rows=[0xd9594c,0x3d82e0,0xe0a43a];
  [-1,1].forEach(s=>rows.forEach((c,r)=>{const h=1.2+r*1.2;bx(G0,5,h,LEN+30,c,s*(HW+4+r*5),h/2,AZ-LEN/2-6)}));
  const fc=[0xff6b5e,0xffcf3f,0x2fbf85,0x3d9bff,0xb06bff],hg=new THREE.SphereGeometry(.5,8,6);
  for(let k=0;k<36;k++){
    const s=k%2?1:-1,r=(k>>1)%3,z=AZ+4-((k*11)%(LEN+20)),y=1.2+r*1.2,x=s*(HW+4+r*5);
    bx(G0,.9,1.3,.9,fc[k%5],x,y+.65,z);
    const h=new THREE.Mesh(hg,L(0xf1c9a0));h.position.set(x,y+1.6,z);G0.add(h)}
  /* gerbang */
  A.gt=GZ.map((z,i)=>{
    const g=new THREE.Group();g.position.z=z;G0.add(g);
    [-1,1].forEach(s=>bx(g,1,9,1,0x5a3a1c,s*(HW+.2),4.5,0));
    bx(g,HW*2+2.4,1.2,1.2,parseInt(ZC[i].slice(1),16),0,9.4,0);
    const sg=mkSign(9,4.5,512,256,drawGate(i));sg.m.position.set(0,12.4,.7);g.add(sg.m);
    const bar=bx(g,HW*2,.7,.7,0xe0524a,0,1.5,0);
    return{g,bar}});
  /* Kak Hud-hud (burung hantu penjaga) */
  const OZ=AZ-LEN-14,OW=new THREE.Group();OW.position.set(0,0,OZ);OW.scale.setScalar(1.5);G0.add(OW);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(4.2,5,9,18),L(0x8a5a2b));body.position.y=4.5;OW.add(body);
  const belly=new THREE.Mesh(new THREE.SphereGeometry(3.6,16,12),L(0xf3e0b8));belly.scale.set(1,1.15,.5);belly.position.set(0,4.4,3.7);OW.add(belly);
  [-1,1].forEach(s=>{bx(OW,1.2,6.5,2.6,0x6e4521,s*5.2,5,0);bx(OW,1.8,.5,2.6,0xf2a33a,s*1.8,.25,3.6)});
  const hd=A.head=new THREE.Group();hd.position.y=11;hd.rotation.y=Math.PI;OW.add(hd);
  hd.add(new THREE.Mesh(new THREE.SphereGeometry(3.8,18,14),L(0x9a6a38)));
  const face=new THREE.Mesh(new THREE.SphereGeometry(2.9,14,10),L(0xf3e0b8));face.scale.set(1.25,1,.35);face.position.z=2.9;hd.add(face);
  [-1,1].forEach(s=>{
    const e=new THREE.Mesh(new THREE.SphereGeometry(1.15,12,10),L(0xffffff));e.position.set(s*1.6,.5,3.1);hd.add(e);
    const p=new THREE.Mesh(new THREE.SphereGeometry(.6,10,8),L(0x1d2b53));p.position.set(s*1.6,.5,4.1);hd.add(p);
    const tf=new THREE.Mesh(new THREE.ConeGeometry(.8,2.4,6),L(0x6e4521));tf.position.set(s*2.5,3.6,0);tf.rotation.z=-s*.3;hd.add(tf)});
  const bk=new THREE.Mesh(new THREE.ConeGeometry(.8,1.7,8),L(0xf2a33a));bk.position.set(0,-.5,4.1);bk.rotation.x=Math.PI/2;hd.add(bk);
  bx(hd,6.4,.5,6.4,0x1d2b53,0,4.2,0);bx(hd,.4,1.6,.4,0xffcf3f,3,3.4,3);
  /* papan sinyal merah/hijau di atas burung hantu */
  A.sig=mkSign(20,7.5,1024,384,drawSig);A.sig.m.position.set(0,32,OZ-1);G0.add(A.sig.m);
  [-8.5,8.5].forEach(x=>bx(G0,.8,30,.8,0x5a3a1c,x,15,OZ-1.6));
  bx(G0,21,.8,.8,0x5a3a1c,0,36.2,OZ-1.6)}

/* ---------- 4. Alur permainan ---------- */
function modal(on){document.body.classList.toggle('arq',!!on);$('#modal').style.display=on?'flex':'none'}
function updHud(){E.he.textContent=heartStr();E.g.textContent='🚪 '+Math.min(A.gate,GN)+'/'+GN}
function flash(h,sm){E.c.className='';E.c.innerHTML=h;void E.c.offsetWidth;E.c.className=sm?'on sm':'on'}
function setLight(l,d){
  const prev=A.light=='b'?'g':A.light;A.light=l;A.lt=d;
  const k=l=='b'?'g':l,s=SG[k];
  E.sig.className=k;E.sig.innerHTML=`<span aria-hidden="true">${s[0]}</span><span class="ar" lang="ar">${s[1]}</span><b>${s[2]}</b>`;
  if(A.sig)A.sig.f();
  if(k!==prev){
    snd(k=='r'?220:k=='g'?660:440,k=='r'?.25:.1,k=='r'?'square':'triangle',.05);
    const now=performance.now();
    if((k=='r'||k=='g')&&A.ph=='play'&&now-A.lastSay>900){A.lastSay=now;say(k=='r'?'قف':'اركض')}}}
function begin(){
  modal(false);mkArena();
  A.org={bg:S.background,fc:S.fog.color.getHex(),fn:S.fog.near,ff:S.fog.far,fov:cam.fov,far:cam.far};
  A.o={x:pl.x,y:pl.y,z:pl.z,yaw:pl.yaw};
  A.hearts=3;A.gate=0;A.cz=AZ;A.v=0;A.rg=0;A.miss=[];A.tried=0;A.locked=false;A.won=false;A.hy=Math.PI;A.shake=0;A.pk='';A.run=false;A.kd=false;
  A.pool=EXM.build();A.sv.try=(A.sv.try||0)+1;persist();
  A.gt.forEach(g=>{g.bar.position.y=1.5});A.head.rotation.y=Math.PI;
  A.G.visible=true;A.on=true;open=true;mode='arena';document.body.classList.add('arn');
  S.background=new THREE.Color(0xa8dcff);S.fog.color.setHex(0xa8dcff);S.fog.near=70;S.fog.far=420;cam.fov=62;cam.updateProjectionMatrix();
  pl.x=0;pl.y=0;pl.z=AZ;pl.yaw=0;pl.vy=0;
  A.ph='count';A.pt=0;A.tp=performance.now();setLight('g',3);updHud()}
function leave(){
  const was=A.on;A.on=false;A.ph='idle';A.run=false;A.kd=false;
  E.run.classList.remove('on');E.c.className='';
  if(was){
    const o=A.org;if(o){S.background=o.bg;S.fog.color.setHex(o.fc);S.fog.near=o.fn;S.fog.far=o.ff;cam.fov=o.fov;cam.far=o.far;cam.updateProjectionMatrix()}
    if(A.G)A.G.visible=false;
    P.rotation.order='XYZ';P.rotation.set(0,0,0);P.scale.setScalar(1);P.armL.rotation.set(0,0,0);P.armR.rotation.set(0,0,0);P.legL.rotation.x=P.legR.rotation.x=0;
    if(A.o){pl.x=A.o.x;pl.y=0;pl.z=A.o.z;pl.yaw=A.o.yaw}pl.vy=0}
  document.body.classList.remove('arn');modal(false);open=false;mode=null}
function quit(){if(!A.on)return;if(!confirm('Keluar dari arena? Percobaan ini tidak dihitung menang.'))return;leave()}
function nextQ(z){
  let i=A.pool.findIndex(x=>x.zi===z&&!x.u);
  if(i<0){A.pool=EXM.build();i=A.pool.findIndex(x=>x.zi===z&&!x.u)}
  const q=A.pool[i<0?0:i];q.u=1;return q}
function ask(){
  A.ph='ask';A.locked=false;A.v=0;A.tried=0;setLight('g',99);A.q=nextQ(A.gate);showQ(A.q)}
function showQ(q){
  const c=$('#card');modal(true);c.scrollTop=0;
  c.innerHTML=`<h2 style="color:${ZC[A.gate]}">🚪 Gerbang ${A.gate+1}/${GN}</h2><div class="stp">${heartStr()} · ${ZT[A.gate]}</div><div class="q">${q.q}</div>`
   +(q.sp?'<button class="opt spk" id="arsp" type="button">🔊 Dengarkan</button>':'')
   +q.o.map((x,k)=>`<button class="opt ${ARX.test(x)?'ar':''}" data-i="${k}" type="button">${x}</button>`).join('')
   +'<div id="fb" role="status" aria-live="polite"></div><div class="ex">⌨️ Tekan 1–4 untuk menjawab</div><button class="opt" id="arqx" type="button">✖ Keluar arena</button>';
  if(q.sp)$('#arsp').onclick=()=>say(q.sp);
  c.querySelectorAll('.opt[data-i]').forEach(b=>b.onclick=()=>pick(+b.dataset.i));
  $('#arqx').onclick=quit;
  if(q.q.indexOf('🎧')>=0&&q.sp)say(q.sp)}
function pick(i){
  if(A.ph!=='ask'||A.locked)return;A.locked=true;
  const q=A.q,c=$('#card'),ok=i===q.c,fb=$('#fb');
  c.querySelectorAll('.opt[data-i]').forEach(b=>{b.disabled=true;const k=+b.dataset.i;if(k===q.c)b.classList.add('ok');else if(k===i)b.classList.add('no')});
  if(ok){
    const g=A.tried?2:5;coins+=g;hud();snd(988,.15,'triangle');
    fb.innerHTML=`<span style="color:#14744b"><b>✔ <span class="ar" lang="ar">أَحْسَنْتَ</span> Benar! +${g} 🪙</b></span><div class="ex">💡 ${q.ex||''}</div><button class="opt go" id="arnx" type="button">🚪 Buka gerbang ▶</button>`;
    $('#arnx').onclick=openGate}
  else{
    A.tried=1;if(!A.miss.includes(q))A.miss.push(q);snd(180,.25,'sawtooth');
    fb.innerHTML=`<span style="color:#b8352b"><b>🦉 Belum tepat. Jawaban benar ditandai hijau.</b></span><div class="ex">💡 ${q.ex||''}</div><button class="opt go" id="arnx" type="button">🔁 Coba soal lain ▶</button>`;
    $('#arnx').onclick=()=>{A.locked=false;A.q=nextQ(A.gate);showQ(A.q)}}
  const nx=$('#arnx');try{nx.focus({preventScroll:true});nx.scrollIntoView({block:'nearest'})}catch(e){}}
function openGate(){
  modal(false);A.cz=GZ[A.gate]+STOP;A.opening=A.gate;A.ph='open';A.pt=0;
  snd(660,.1,'triangle');setTimeout(()=>snd(880,.15,'triangle'),100)}
function caught(){
  A.hearts--;A.ph='caught';A.pt=0;A.v=0;A.shake=.5;snd(160,.35,'sawtooth',.08);updHud();
  flash(A.hearts>0?'😵‍💫 Terpeleset!<br><small>Kembali ke gerbang terakhir</small>':'😵‍💫 Hatimu habis!',1)}
function afterCaught(){
  E.c.className='';
  if(A.hearts<=0){lose();return}
  pl.z=A.cz;A.ph='play';A.pt=0;setLight('g',2.2)}
function win(){
  A.ph='done';A.won=true;A.pt=0;A.el=Math.round((performance.now()-A.t0)/1000);
  const h=A.hearts,first=A.sv.d!==dstr();let b=60+h*30;if(first){b+=100;A.sv.d=dstr()}
  A.sv.win=(A.sv.win||0)+1;A.sv.best=Math.max(A.sv.best||0,h);if(!A.sv.bt||A.el<A.sv.bt)A.sv.bt=A.el;persist();coins+=b;hud();
  setTimeout(()=>{if(A.on&&A.ph=='done')cardWin(b,first)},900)}
function lose(){
  A.ph='done';A.won=false;A.pt=0;setTimeout(()=>{if(A.on&&A.ph=='done')cardLose()},500)}
function bt(){return `<div class="exbt"><button class="opt go" id="aragain" type="button">🔁 Main lagi</button><button class="opt" id="arclose" type="button">✖ Tutup</button></div>`}
function bind(){$('#aragain').onclick=()=>{leave();setTimeout(intro,60)};$('#arclose').onclick=leave}
function cardWin(b,first){
  const c=$('#card'),s=A.sv,mm=Math.floor(A.el/60),ss=A.el%60;modal(true);c.scrollTop=0;
  c.innerHTML=`<h2>🏁 Kamu sampai di garis finis!</h2><div class="ar center" lang="ar" style="font-size:34px;line-height:1.5">أَحْسَنْتَ! مَبْرُوكٌ</div><div class="q" style="text-align:center;font-size:34px">${'⭐'.repeat(A.hearts)}${'☆'.repeat(3-A.hearts)}</div>`
   +`<div class="exst"><div><b>${A.hearts}/3</b><small>❤️ tersisa</small></div><div><b>${mm?mm+':'+String(ss).padStart(2,'0'):ss+' dtk'}</b><small>waktu</small></div><div><b>${s.win}</b><small>kali menang</small></div></div>`
   +`<div class="ex">🪙 +${b} koin${first?' (termasuk bonus menang pertama hari ini)':''}</div>`+bt();
  bind();confetti();[523,659,784,1047].forEach((f,k)=>setTimeout(()=>snd(f,.2,'triangle'),k*120))}
function cardLose(){
  const c=$('#card');modal(true);c.scrollTop=0;
  const rc=A.miss.slice(0,3).map(q=>`<div class="ex">📖 ${q.q}<br>Jawaban benar: ${ARX.test(q.a)?`<span class="ar" lang="ar">${q.a}</span>`:`<b>${q.a}</b>`}<br>${q.ex||''}</div>`).join('');
  c.innerHTML=`<h2>🦉 Istirahat dulu, ya</h2><div class="fc">Hatimu habis di gerbang ${Math.min(A.gate+1,GN)}. Tidak apa-apa! Perhatikan lampu merah, lepas tombol tepat waktu, lalu coba lagi.</div>`+(rc?`<div class="gt">Soal yang tadi meleset</div>${rc}`:'')+bt();
  bind()}
function intro(){
  if(open||!ready||A.on)return;
  open=true;mode='arena';const c=$('#card'),s=A.sv;modal(true);c.scrollTop=0;
  c.innerHTML=`<h2>🚦 Arena Lampu Ilmu</h2><div class="fc">Kak Hud-hud menjaga garis finis. Lari saat <b>lampu hijau</b>, berhenti total saat <b>lampu merah</b>. Di setiap gerbang ada 1 soal untuk dijawab.</div>`
   +`<div class="exst"><div><b>${s.best?'⭐'.repeat(s.best):'—'}</b><small>rekor</small></div><div><b>${s.win||0}</b><small>kali menang</small></div><div><b>${s.try||0}</b><small>percobaan</small></div></div>`
   +`<div class="exrw"><b>🟢</b><span><b>Lampu hijau</b>: tahan tombol LARI (atau tekan Spasi / W).</span></div>`
   +`<div class="exrw"><b>🔴</b><span><b>Lampu merah</b>: lepas tombol! Kalau masih bergerak, kamu terpeleset ke gerbang terakhir dan kehilangan ❤️.</span></div>`
   +`<div class="exrw"><b>🚪</b><span><b>4 gerbang</b>: jawab 1 soal untuk membuka. Salah? Lihat pembahasan, lalu coba soal lain (hati tidak berkurang).</span></div>`
   +`<div class="exrw"><b>⭐</b><span><b>Bintang</b> = sisa ❤️ saat sampai garis finis.</span></div>`
   +`<div class="gt">Dua kata penting</div><div class="pat" data-sp="اركض"><span class="ar">اِرْكُضْ</span><small>Lari! 🔊</small></div><div class="pat" data-sp="قف"><span class="ar">قِفْ</span><small>Berhenti! 🔊</small></div>`
   +`<div class="exbt"><button class="opt go" id="arg1" type="button">▶ Masuk arena</button><button class="opt" id="arg0" type="button">✖ Nanti saja</button></div>`;
  bindSp(c);$('#arg1').onclick=begin;$('#arg0').onclick=leave}

/* ---------- 5. Per-frame ---------- */
function step(dt){
  const run=A.run||A.kd||(typeof jy!=='undefined'&&jy>.35);
  A.lt-=dt;
  if(A.light=='g'){if(A.lt<=0)setLight('w',.8)}
  else if(A.light=='w'){if(A.lt<=0){setLight('r',1.5+Math.random()*1.3);A.rg=.35}}
  else if(A.light=='r'){A.rg=Math.max(0,A.rg-dt);if(A.lt<=0)setLight('b',.6)}
  else if(A.light=='b'){if(A.lt<=0)setLight('g',1.2+Math.random()*1.4)}
  A.v+=((run?SP:0)-A.v)*Math.min(1,dt*(run?6:16));
  pl.z-=A.v*dt;
  if(A.light=='r'&&A.rg<=0&&A.v>2.2){caught();return}
  const zg=GZ[A.gate]+STOP;
  if(pl.z<=zg){pl.z=zg;A.v=0;ask()}}
function frame(){
  const now=performance.now(),dt=Math.min(.05,Math.max(0,(now-A.tp)/1000)),t=now/1000;A.tp=now;A.pt+=dt;
  let ph=A.ph;
  if(ph=='count'){
    const n=3-Math.floor(A.pt),s=n>0?String(n):'MULAI!';
    if(E.c.textContent!==s){flash(s,0);snd(n>0?440:880,.12,'triangle')}
    if(A.pt>=3.7){E.c.className='';A.ph='play';A.pt=0;A.t0=now;setLight('g',2.2)}}
  else if(ph=='play')step(dt);
  else if(ph=='caught'){if(A.pt>=1.3)afterCaught()}
  else if(ph=='open'){
    A.gt[A.opening].bar.position.y=1.5+Math.min(1,A.pt/.8)*8;
    if(A.pt>=1){A.gate++;updHud();A.pt=0;if(A.opening==GN-1){A.ph='dash'}else{A.ph='play';setLight('g',.8+Math.random()*1.2)}}}
  else if(ph=='dash'){A.v=SP*.9;pl.z-=A.v*dt;if(pl.z<=GZ[GN-1]-9)win()}
  else if(ph=='done')A.v=0;
  ph=A.ph;
  /* pose pemain */
  const mv=Math.min(1,A.v/SP),sw=Math.sin(t*15)*mv*.9;let py=Math.abs(sw)*.12;
  P.rotation.order='XYZ';P.rotation.set(0,Math.PI,0);P.armL.rotation.z=0;P.armR.rotation.z=0;
  P.legL.rotation.x=sw;P.legR.rotation.x=-sw;P.armL.rotation.x=-sw;P.armR.rotation.x=sw;
  if(ph=='caught'){P.rotation.set(0,Math.PI,Math.sin(A.pt*26)*.45*Math.max(0,1-A.pt/1.3));P.armL.rotation.x=P.armR.rotation.x=-1.2+Math.sin(A.pt*30)*.5}
  else if(ph=='done'&&A.won){P.armL.rotation.x=P.armR.rotation.x=-2.8;py=Math.abs(Math.sin(A.pt*5))*.9}
  else if(ph=='play'&&A.light=='r'&&mv<.15){P.armL.rotation.z=-.5;P.armR.rotation.z=.5}
  P.position.set(pl.x,pl.y+py,pl.z);
  /* burung hantu: kepala berputar */
  const tg=A.won?0:(A.light=='g'||A.light=='b')?Math.PI:0;
  A.hy+=(tg-A.hy)*Math.min(1,dt*(A.light=='w'?3.4:6));A.head.rotation.y=A.hy;A.head.position.y=11+Math.sin(t*2)*.1;
  /* kamera */
  let sx=0,sy=0;if(A.shake>0){A.shake-=dt;if(!RM){sx=(Math.random()-.5)*A.shake*1.6;sy=(Math.random()-.5)*A.shake*1.6}}
  cam.position.set(sx,6.6+sy,pl.z+12.5);cam.lookAt(0,4.6,pl.z-30);
  /* progres */
  const pk=Math.max(0,Math.min(1,(AZ-pl.z)/LEN)).toFixed(2);if(pk!==A.pk){A.pk=pk;E.bi.style.transform='scaleX('+pk+')'}}
const R0=R.render;
R.render=function(s,c){
  if(A.on&&s===S){try{frame()}catch(e){console.warn('arena',e);try{leave()}catch(_){}try{ts('⚠️ Arena error: '+e.message,4500)}catch(_){}}}
  return R0.call(R,s,c)};

/* ---------- 6. Tombol & input ---------- */
{
  const b=document.createElement('button');b.className='pill mx';b.id='arb';b.type='button';b.title='Arena Lampu Ilmu';b.setAttribute('aria-label','Arena Lampu Ilmu: lari dan jawab soal');
  b.innerHTML='<span aria-hidden="true">🚦</span><span class="lb" aria-hidden="true">Arena</span>';
  const st=$('#stat'),ref=$('#exb');if(ref&&ref.after)ref.after(b);else if(st)st.appendChild(b);
  b.onclick=()=>{
    if(open||!ready)return;
    if(typeof RID!=='undefined'&&RID){ts('🚲 Turun dulu dari kendaraan (F), lalu masuk arena.',2200);return}
    if(typeof CV!=='undefined'&&CV)return;
    if(typeof INTR!=='undefined'&&INTR&&INTR.on){ts('🚪 Keluar dulu dari bangunan, lalu masuk arena.',2200);return}
    intro()}}
{
  const on=e=>{e.preventDefault();A.run=true;E.run.classList.add('on');try{E.run.setPointerCapture(e.pointerId)}catch(_){}},off=()=>{A.run=false;E.run.classList.remove('on')};
  E.run.addEventListener('pointerdown',on);['pointerup','pointercancel','lostpointercapture'].forEach(n=>E.run.addEventListener(n,off));
  E.run.addEventListener('contextmenu',e=>e.preventDefault());
  E.q.onclick=quit;
  addEventListener('blur',()=>{A.kd=false;off()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){A.kd=false;off()}});
  const isRun=k=>k===' '||k==='w'||k==='W'||k==='ArrowUp';
  addEventListener('keydown',e=>{
    if(!A.on)return;const k=e.key;
    if(isRun(k)){if(A.ph=='play'||A.ph=='count')e.preventDefault();A.kd=true;return}
    if(A.ph==='ask'&&!A.locked&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&k.length===1){const i='1234'.indexOf(k);if(i>=0)pick(i)}
    else if(k==='Escape'&&A.ph==='play')quit()});
  addEventListener('keyup',e=>{if(isRun(e.key))A.kd=false})}

window.ARN={start:intro,leave,state:A};
})();
