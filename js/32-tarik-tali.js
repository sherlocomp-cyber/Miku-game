/* === BAGIAN 32 (v4.2, improve): Tarik Tali Ilmu (Tahap 2 dari rencana Arena Belajar) ===
   Modul mandiri, tidak mengubah file 01-31 (hanya memakai global-nya). Dimuat setelah js/31. Tanpa SDK: REST + EventSource Firebase (sama seperti js/28).
   Permainan: Tim Hijau vs Tim Jingga. Setiap jawaban BENAR = 1 tarikan untuk tim. Selisih tarikan >= 8 = menang; waktu habis (2 menit) = tim terbanyak menang.
   Seri saat waktu habis = TARIK EMAS (tambahan 20 dtk, tarikan pertama yang membuat unggul langsung menang; masih seri sesudahnya = seri). Dihitung di calc() dari data yang sama.
   Bareng-bareng: ruang = kelas dari akhir nama murid ("Ahmad 4A" -> "4a"), sama seperti Teman Online. Tim dibagi seimbang otomatis.
   Sendirian (atau 1 tim kosong): lawannya Kak Hud-hud (bot). Kecepatan bot dipilih di lobi (Santai 7,5 dtk / Normal 5,5 dtk / Sulit 4 dtk per tarikan),
   disimpan di /tali/<ruang>/m.bm dan dihitung dari jam server sehingga semua perangkat sama. Tanpa internet: otomatis main sendiri melawan Kak Hud-hud.
   Data: /tali/<ruang>/m = {id,t,b,tg,dur,bm} dan /tali/<ruang>/p/<id-perangkat> = {n,tm,c,mid,t,off}. Posisi tali = (tarikan A - tarikan B) / 8, dihitung lokal dari data yang sama (tanpa "host").
   Salah / waktu habis = tidak menarik, jeda 2,2 dtk + pembahasan (tidak ada pengurangan). Koin: +2 per tarikan, +40 menang (+60 menang pertama hari ini), +10 ikut. Tidak memanggil rec().
   v4: batas waktu 15 dtk per soal, combo 3 benar beruntun = tarikan bonus +1, pilihan tingkat lawan, tali ikut bergeser, debu kaki, getar kamera,
   peringatan "Ayo tarik!"/"Hampir menang!", bunyi tik 10 dtk terakhir, hasil: ketepatan + kontribusi tim, kamera naik di HP landscape.
   v4.1: Tarik Emas (perpanjangan saat seri), hitungan combo di pil waktu, penanda "Rekor baru!" di layar hasil.
   v4.2: (1) tanda ✔/✖ di tombol jawaban (tidak mengandalkan warna saja), (2) ketukan dalam 0,25 dtk pertama sesudah soal baru diabaikan
   (anak sering mengetuk beruntun di posisi yang sama), (3) layar hasil memuat "Perlu diulang": soal yang salah/waktu habis beserta jawaban benarnya.
   UX (v2): skor tim di sisi bar atas, timmu bertanda kuning, hitung mundur menyebut timmu, keluar dengan 2x ketuk (tanpa confirm()), getar di HP.
   Tampilan (v3): pelari berkarakter, tali berpilin, arena pasir bergaris, gawang bendera tim, panggung penonton, pohon, bukit, awan, papan judul.
   Cara balik ke tampilan lama: kembalikan berkas ini dari riwayat git, atau hapus baris <script> js/32 di index.html. */
(function(){
'use strict';
if(window.TTI)return;
if(typeof THREE==='undefined'||typeof S==='undefined'||typeof R==='undefined'||typeof P==='undefined'||typeof pl==='undefined'||typeof cam==='undefined'||typeof EXM==='undefined'||typeof EXM.build!=='function'){console.warn('Tali: modul pendukung belum siap');return}

const DB='https://miku-profesi-default-rtdb.asia-southeast1.firebasedatabase.app';
const TZ=-3600,RX=22,TG=8,DUR=120,OT=20,CD=4,BOTMS=5500,STALE=20000,BEAT=5000,LOCKW=2200,MAXP=8,QT=15,TAPG=250;
const LV=['Santai','Normal','Sulit'],BMS=[7500,5500,4000];
const TC={a:{c:0x2fa56b,h:'#178a55',n:'Tim Hijau',e:'🟢'},b:{c:0xf08a24,h:'#b85c0a',n:'Tim Jingga',e:'🟠'}};
const ARX=/[\u0600-\u06FF]/,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const SKT=SK+':tali',SVT={'.sv':'timestamp'};
const num=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):(d||0)};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jp=t=>{try{return JSON.parse(t)}catch(e){return null}};
const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
let dev=null;try{dev=localStorage.getItem('kp.dev')}catch(e){}
if(!dev){dev=Math.random().toString(36).slice(2,10);try{localStorage.setItem('kp.dev',dev)}catch(e){}}
const NMX=()=>{try{return String(typeof NM!=='undefined'?NM:'').trim()}catch(e){return ''}};
const roomOf=n=>{const m=n.match(/(?:^|\s)(\d{1,2})\s*([A-Za-z])?\s*$/);return m?(m[1]+(m[2]||'')).toLowerCase():'umum'};

/* ---------- Filter nama (sama dengan js/28) ---------- */
const cz=w=>w.replace(/(.)\1+/g,'$1');
const BL=['bangsat','bajingan','kontol','memek','ngentot','jancok','jancuk','keparat','brengsek','sialan','goblok','kampret','anjing','fuck','shit','bitch','pantek','pelacur','lonte'].map(cz);
const BT=['asu','tai','bego','tolol','bodoh','setan','idiot','bgst'].map(cz);
const LT={'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','@':'a','$':'s','!':'i'};
function lolos(t){t=String(t||'');
 if(/https?:|www\.|\.(com|net|org|id|me|io|xyz|gg)\b|@/i.test(t))return false;
 if((t.match(/\d/g)||[]).length>=6)return false;
 const n=cz(t.toLowerCase().replace(/[013457@$!]/g,c=>LT[c]).replace(/[^a-z\s]/g,'')),j=n.replace(/\s+/g,''),tk=n.split(/\s+/);
 return!(BL.some(w=>j.includes(w))||tk.some(w=>BT.includes(w)))}
const safe=n=>{n=String(n==null?'':n).replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,16);return n&&lolos(n)?n:'Teman'};

/* ---------- Status ---------- */
const T={on:false,built:false,ph:'idle',room:'',tree:{},off:0,offOk:false,net:false,es:null,ct:0,joined:false,tm:'a',mid:'',my:0,q:null,pool:[],nxt:0,fin:null,played:false,hb:0,tp:0,fx:0,c:null,cdn:'',ck:'',hk:'',pull:0,qc:0,G:null,flag:null,ban:null,pa:[],pb:[],ow:null,crowd:[],cl:[],org:null,o:null,sv:{try:0,win:0,best:0,d:'',lv:1},
  lv:1,qs:0,qb:null,st:0,nok:0,nall:0,miss:[],lt:99,wn:0,wm:0,otn:0,tt:0,jk:{a:-9e9,b:-9e9},la:0,lb:0,dust:[],rope:null};
const lsRead=()=>{try{return typeof lsg==='function'?lsg(SKT):localStorage.getItem(SKT)}catch(e){return null}};
try{Object.assign(T.sv,jp(lsRead()||'{}')||{})}catch(e){}
T.lv=num(T.sv.lv,0,2,1);
const persist=()=>{try{typeof lss==='function'?lss(SKT,JSON.stringify(T.sv)):localStorage.setItem(SKT,JSON.stringify(T.sv))}catch(e){}};
const nowS=()=>Date.now()-(T.off||0);
const E={};
const rstat=()=>{T.st=0;T.nok=0;T.nall=0;T.miss=[];T.lt=99;T.wn=0;T.wm=0;T.otn=0;T.la=0;T.lb=0};

/* ---------- Logika murni: dari data ruang -> keadaan pertandingan ---------- */
function calc(tr,now){
  const m=tr&&tr.m&&typeof tr.m==='object'?tr.m:null,pp=(tr&&tr.p&&typeof tr.p==='object')?tr.p:{};
  const r={m,a:0,b:0,na:0,nb:0,L:{a:[],b:[]},bot:!!(m&&m.b),el:-1,ended:false,win:'',pos:0,tg:TG,dur:DUR,ot:false};
  Object.keys(pp).forEach(k=>{const d=pp[k];if(!d||typeof d!=='object')return;const t=d.tm==='b'?'b':'a',mine=!!(m&&d.mid===m.id);
    if(!d.off&&now-num(d.t,0,9e15,0)<=STALE){r['n'+t]++;r.L[t].push({k,n:safe(d.n),c:mine?num(d.c,0,999,0):0})}
    if(mine)r[t]+=num(d.c,0,999,0)});
  if(m){
    r.tg=num(m.tg,3,30,TG);r.dur=num(m.dur,20,600,DUR);r.el=(now-num(m.t,0,9e15,0))/1000-CD;
    const bm=num(m.bm,2500,12000,BOTMS);
    if(r.bot&&r.el>0)r.b+=Math.floor(Math.min(r.el,r.dur+OT)*1000/bm);
    const df=r.a-r.b;r.pos=Math.max(-1,Math.min(1,df/r.tg));
    if(Math.abs(df)>=r.tg){r.ended=true;r.win=df>0?'a':'b'}
    else if(r.el>=r.dur){
      if(df!==0){r.ended=true;r.win=df>0?'a':'b'}
      else if(r.el>=r.dur+OT){r.ended=true;r.win=''}
      else r.ot=true}}
  return r}

/* ---------- Elemen layar ---------- */
(function(){
  const css=document.createElement('style');css.textContent=`
#tth,#ttq,#ttc{display:none}
body.tli #tth{display:flex}
body.tli .hud,body.tli #js,body.tli #rbar{display:none!important}
#tth{position:fixed;left:0;right:0;top:0;z-index:5;gap:8px;align-items:center;pointer-events:none;padding:calc(8px + env(safe-area-inset-top,0px)) calc(10px + env(safe-area-inset-right,0px)) 0 calc(10px + env(safe-area-inset-left,0px))}
.ttp{font:700 15px/1 "Baloo 2",system-ui,sans-serif;background:#fffaf0;color:#1d2b53;border:3px solid #1d2b53;border-radius:999px;padding:7px 12px;pointer-events:auto;white-space:nowrap;box-shadow:0 3px 0 rgba(29,43,83,.35)}
button.ttp{cursor:pointer;min-width:44px;min-height:44px;padding:4px 12px}
.ttbar{flex:1;height:24px;border:3px solid #1d2b53;border-radius:999px;position:relative;overflow:hidden;background:linear-gradient(90deg,#2fa56b 50%,#f08a24 50%);box-shadow:0 3px 0 rgba(29,43,83,.35)}
.ttbar:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 6px,transparent 6px 12px)}
.ttbar i{position:absolute;top:-2px;bottom:-2px;left:50%;width:12px;margin-left:-6px;background:#fff;border:3px solid #1d2b53;border-radius:6px;transition:left .25s}
#tth.near .ttbar{animation:ttnear .5s infinite alternate}
@keyframes ttnear{to{box-shadow:0 0 0 4px #ffcf3f}}
#ttt.ot{background:#ffcf3f}
#ttsa{border-color:#178a55}#ttsb{border-color:#b85c0a}
.ttp.me{background:#fff;box-shadow:0 0 0 3px #ffcf3f}
#ttq{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(8px + env(safe-area-inset-bottom,0px));width:min(96vw,720px);max-height:56vh;overflow:auto;z-index:6;background:#fffaf0;color:#1d2b53;border:4px solid #1d2b53;border-radius:18px;padding:10px 12px;font-family:"Baloo 2",system-ui,sans-serif;box-shadow:0 6px 0 rgba(29,43,83,.35)}
#ttq.on{display:block}
.ttqt{height:8px;border:2px solid #1d2b53;border-radius:6px;background:#fff;overflow:hidden;margin-bottom:6px}
.ttqt i{display:block;height:100%;background:#2fa56b;transform-origin:left center;transform:scaleX(1)}
.ttqt.lo i{background:#c62f26}
.ttq1{font-size:clamp(16px,3.4vw,22px);font-weight:700;margin-bottom:8px;line-height:1.3}
.tsp{float:right;min-width:44px;min-height:44px;border:3px solid #1d2b53;border-radius:12px;background:#fff;font-size:18px;cursor:pointer;margin-left:8px}
.tto{display:grid;grid-template-columns:1fr 1fr;gap:8px;clear:both}
.tto button{min-height:48px;font:700 clamp(15px,3vw,19px)/1.2 "Baloo 2",system-ui,sans-serif;border:3px solid #1d2b53;border-radius:14px;background:#ffcf3f;color:#1d2b53;cursor:pointer;padding:6px 10px;text-align:left;display:flex;gap:8px;align-items:center;box-shadow:0 3px 0 #b8902a}
.tto button.ar{font-family:Amiri,"Noto Naskh Arabic",serif;font-size:clamp(20px,4vw,26px);direction:rtl;text-align:right}
.tto button.ok{background:#178a55;color:#fff;box-shadow:0 3px 0 #0e5c38}.tto button.no{background:#c62f26;color:#fff;box-shadow:0 3px 0 #86201a}
.tto button.ok i,.tto button.no i{background:#fff;color:#1d2b53}
.tto button:disabled{cursor:default}
.tto button:focus-visible,.tsp:focus-visible,.ttp:focus-visible,.ttlv button:focus-visible{outline:4px solid #1d2b53;outline-offset:2px}
.tto i{font-style:normal;background:#1d2b53;color:#fff;border-radius:50%;width:22px;height:22px;display:inline-grid;place-items:center;font-size:13px;flex:none}
.ttf{min-height:20px;margin-top:6px;font-size:14px}
#ttc{position:fixed;inset:0;z-index:7;align-items:center;justify-content:center;pointer-events:none;text-align:center;font:800 min(22vw,150px)/1.05 "Baloo 2",system-ui,sans-serif;color:#fff;-webkit-text-stroke:6px #1d2b53;paint-order:stroke fill}
#ttc.on{display:flex;flex-direction:column;animation:ttpop .45s ease-out}
#ttc.sm{font-size:min(9vw,56px);-webkit-text-stroke:4px #1d2b53;justify-content:flex-start;padding-top:22vh}
#ttc small{font-size:.26em;-webkit-text-stroke:3px #1d2b53;margin-top:.3em}
@keyframes ttpop{from{transform:scale(1.5);opacity:0}to{transform:scale(1);opacity:1}}
.ttg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}
.ttcol{border:3px solid;border-radius:14px;padding:6px 10px;display:flex;flex-direction:column;gap:2px;font-size:15px;background:#fffaf0}
.ttm{opacity:.7;font-size:13px}
.ttlv{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:6px 0;font-weight:700;color:#1d2b53}
.ttlv button{min-height:40px;border:3px solid #1d2b53;border-radius:999px;background:#fff;color:#1d2b53;padding:2px 12px;font:700 14px "Baloo 2",system-ui,sans-serif;cursor:pointer}
.ttlv button.on{background:#ffcf3f}
.ttcn{margin:8px 0}
@media (max-height:420px){#ttq{max-height:60vh;padding:6px 10px}.ttq1{font-size:15px;margin-bottom:4px}.tto button{min-height:40px}#tth{gap:6px}.ttp{padding:5px 9px;font-size:14px}#ttc.sm{padding-top:14vh}}
@media (prefers-reduced-motion:reduce){#ttc.on{animation:none}.ttbar i{transition:none}#tth.near .ttbar{animation:none}}`;
  document.head.appendChild(css);
  const w=document.createElement('div');
  w.innerHTML='<div id="tth"><div class="ttp" id="ttt">⏱ 2:00</div><div class="ttp" id="ttsa"></div><div class="ttbar" aria-hidden="true"><i id="ttm"></i></div><div class="ttp" id="ttsb"></div><button class="ttp" id="ttx" type="button" aria-label="Keluar dari Tarik Tali">✖</button></div>'
   +'<div id="ttq" role="group" aria-label="Soal"></div><div id="ttc" role="status" aria-live="polite"></div>';
  while(w.firstChild)document.body.appendChild(w.firstChild);
  E.h=$('#tth');E.t=$('#ttt');E.m=$('#ttm');E.x=$('#ttx');E.a=$('#ttsa');E.b=$('#ttsb');E.q=$('#ttq');E.c=$('#ttc')})();
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};let qT=0;

/* ---------- Gambar kanvas (label, papan, bendera) ---------- */
const fnt=(ar,s)=>ar?`700 ${s}px Amiri,"Noto Naskh Arabic",serif`:`700 ${s}px "Baloo 2",system-ui,sans-serif`;
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function mkSign(w,h,cw,ch,draw){const c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d'),tx=new THREE.CanvasTexture(c);tx.anisotropy=4;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx,toneMapped:false,fog:false,side:THREE.DoubleSide}));draw(g,cw,ch);tx.needsUpdate=true;return m}
const dTeam=t=>(g,w,h)=>{g.fillStyle=TC[t].h;g.fillRect(0,0,w,h);g.fillStyle='#fffdf5';rr(g,10,10,w-20,h-20,22);g.fill();g.fillStyle=TC[t].h;g.textAlign='center';g.textBaseline='middle';g.font=fnt(0,Math.round(h*.46));g.fillText(TC[t].e+' '+TC[t].n,w/2,h*.52)};
const dTitle=(g,w,h)=>{g.fillStyle='#5a3a1c';g.fillRect(0,0,w,h);g.fillStyle='#fff3c4';rr(g,14,14,w-28,h-28,36);g.fill();g.fillStyle='#1d2b53';g.textAlign='center';g.textBaseline='middle';
  g.direction='rtl';g.font=fnt(1,Math.round(h*.42));g.fillText('تَجَاذُبُ الْحَبْلِ',w/2,h*.38);g.direction='ltr';g.font=fnt(0,Math.round(h*.3));g.fillText('🪢 TARIK TALI ILMU',w/2,h*.76)};
function setTag(u,t,col){const g=u.tg.getContext('2d');g.clearRect(0,0,256,64);g.fillStyle=col;rr(g,4,6,248,52,26);g.fill();g.strokeStyle='#1d2b53';g.lineWidth=5;g.stroke();
  g.fillStyle='#fff';g.font=fnt(0,30);g.textAlign='center';g.textBaseline='middle';g.fillText(t,128,34);u.sp.material.map.needsUpdate=true;u.nm=t}

/* ---------- Arena 3D (dibangun sekali) ---------- */
function mk(){
  if(T.built)return;T.built=true;
  const G0=T.G=new THREE.Group();G0.visible=false;S.add(G0);
  const L=c=>new THREE.MeshLambertMaterial({color:c});
  const bx=(g,w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),L(c));m.position.set(x,y,z);g.add(m);return m};
  /* tanah: rumput bergaris, lapangan pasir, lubang tengah, garis tim */
  for(let k=0;k<12;k++)bx(G0,420,2,20,k%2?0x74bb50:0x82cc5c,0,-1.2,TZ-100+k*20);
  bx(G0,100,.5,20,0xd9c58a,0,-.15,TZ);bx(G0,96,.3,17,0xe9d9a6,0,-.05,TZ);
  bx(G0,12,.5,17.4,0x7a5a3a,0,.02,TZ);bx(G0,.5,.12,17.4,0xffffff,0,.1,TZ);
  for(let k=-1;k<=1;k+=2){bx(G0,.4,.12,17.4,0xffffff,k*RX,.1,TZ);for(let j=-1;j<=1;j++)bx(G0,.5,.1,.5,0xffffff,k*(RX+1.6),.1,TZ+j*3)}
  [-1,1].forEach(s=>{const t=s<0?'a':'b',c=TC[t].c;
    bx(G0,18,.35,17,c,s*(RX+10),.1,TZ).material.opacity=.55;
    [-1,1].forEach(z=>{bx(G0,.5,9,.5,0x5a3a1c,s*RX,4.5,TZ+z*9.4);bx(G0,.9,.9,.9,0xffcf3f,s*RX,9.2,TZ+z*9.4)});
    bx(G0,.5,.5,18.8,c,s*RX,9,TZ);
    const bn=mkSign(7,2.4,384,128,dTeam(t));bn.position.set(s*RX,11.3,TZ);bn.rotation.y=Math.PI/2*0;G0.add(bn);
    for(let k=0;k<9;k++){const f=bx(G0,.15,.9,.9,k%2?c:0xffffff,s*RX,8.2-Math.abs(k-4)*.12,TZ-8.4+k*2.1);f.rotation.x=.2}});
  /* tali berpilin (ikut bergeser bersama pelari) */
  const rp=T.rope=new THREE.Group();rp.position.set(0,3.4,TZ);G0.add(rp);
  for(let k=0;k<50;k++){const sg=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,2.05,8),L(k%2?0xc89b5a:0xa87b3a));sg.rotation.z=Math.PI/2;sg.position.x=-49+k*2+1;rp.add(sg)}
  /* bendera tengah + pita */
  const fl=T.flag=new THREE.Group();fl.position.set(0,3.4,TZ);G0.add(fl);
  bx(fl,1,1.1,1.1,0xffcf3f,0,0,0);bx(fl,.3,6,.3,0x5a3a1c,0,3,0);
  T.ban=bx(fl,2.6,1.5,.15,0xe0524a,1.4,5.4,0);bx(fl,.9,.9,.9,0xffcf3f,0,6.1,0);
  /* debu kaki (kumpulan partikel yang dipakai ulang) */
  {const dg=new THREE.BoxGeometry(.5,.5,.5),dm=new THREE.MeshLambertMaterial({color:0xe9d9a6});
   for(let k=0;k<32;k++){const m=new THREE.Mesh(dg,dm);m.visible=false;G0.add(m);T.dust.push({m,vx:0,vy:0,vz:0,l:0})}}
  /* penonton: tribun + sorak mendukung tim (kiri hijau, kanan jingga) */
  const gz=TZ-16;[0xd9594c,0x3d82e0,0xe0a43a].forEach((c,r)=>bx(G0,150,1.2+r*1.2,5,c,0,(1.2+r*1.2)/2,gz-r*5));
  const gc=[0x2fa56b,0x3fc07e,0x178a55,0xffffff],oc=[0xf08a24,0xffb347,0xd9701a,0xffffff],hg=new THREE.SphereGeometry(.5,8,6);
  for(let k=0;k<64;k++){const r=k%3,x=-66+((k*2.1)%132),z=gz-r*5,y=1.2+r*1.2,pc=(x<0?gc:oc)[k%4],g=new THREE.Group();g.position.set(x,y,z);G0.add(g);
    bx(g,.9,1.3,.9,pc,0,.65,0);const h=new THREE.Mesh(hg,L(0xf1c9a0));h.position.y=1.6;g.add(h);bx(g,.35,1.2,.3,pc,-.7,1.4,0);bx(g,.35,1.2,.3,pc,.7,1.4,0);T.crowd.push({g,y,k,s:x<0?'a':'b'})}
  /* dekorasi: bukit, pohon, awan, matahari, papan judul */
  [[-90,22,0x5fb04a],[-30,30,0x6bbd52],[40,26,0x5fb04a],[100,20,0x6bbd52]].forEach(h=>{const m=new THREE.Mesh(new THREE.SphereGeometry(h[1],16,10),L(h[2]));m.position.set(h[0],-h[1]*.35,TZ-120);m.scale.y=.6;G0.add(m)});
  for(let k=0;k<26;k++){const s=k%2?1:-1,x=s*(58+(k%6)*7),z=TZ-6-(k%5)*9,h=4+(k%4);bx(G0,.9,h,.9,0x6b4423,x,h/2,z);
    const c=new THREE.Mesh(new THREE.ConeGeometry(3.2,7,8),L(k%3?0x2f9e5a:0x3fb36b));c.position.set(x,h+3,z);G0.add(c)}
  for(let k=0;k<9;k++){const g=new THREE.Group();g.position.set(-120+k*30,55+(k%3)*8,TZ-110);[[0,0],[5,-1],[-5,-1],[2,2]].forEach(o=>{const m=new THREE.Mesh(new THREE.SphereGeometry(5,10,8),new THREE.MeshLambertMaterial({color:0xffffff}));m.position.set(o[0],o[1],0);m.scale.y=.6;g.add(m)});G0.add(g);T.cl.push(g)}
  const sun=new THREE.Mesh(new THREE.SphereGeometry(9,16,12),new THREE.MeshBasicMaterial({color:0xfff2a8,fog:false}));sun.position.set(70,70,TZ-130);G0.add(sun);
  const tt=mkSign(26,9,1024,356,dTitle);tt.position.set(0,26,TZ-28);G0.add(tt);[-10,10].forEach(x=>bx(G0,.8,26,.8,0x5a3a1c,x,13,TZ-28.4));
  /* pelari */
  const mkPuller=(col,sc,owl)=>{
    const g=new THREE.Group(),b=new THREE.Group();g.add(b);g.position.z=TZ+1.2;g.scale.setScalar(sc||1);
    const skin=owl?0x8a5a2b:0xf1c9a0,part=(w,h,d,c,x,y,z,p)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),L(c));m.position.set(x,y,z);(p||b).add(m);return m};
    part(1.5,1.9,.9,col,0,2.55,0);part(1.56,.5,.96,0x1d2b53,0,1.55,0);
    const pv=(x,y,w,h,c)=>{const q=new THREE.Group();q.position.set(x,y,0);b.add(q);part(w,h,w,c,0,-h/2,0,q);return q};
    const lL=pv(-.4,1.4,.5,1.4,skin),lR=pv(.4,1.4,.5,1.4,skin),aL=pv(-.98,3.3,.42,1.4,skin),aR=pv(.98,3.3,.42,1.4,skin);
    part(.6,.3,.95,0x1d2b53,0,-1.4,.15,lL);part(.6,.3,.95,0x1d2b53,0,-1.4,.15,lR);part(.5,.5,.5,0xf1c9a0,0,-1.45,0,aL);part(.5,.5,.5,0xf1c9a0,0,-1.45,0,aR);
    aL.rotation.x=aR.rotation.x=-1.35;
    const hd=new THREE.Mesh(new THREE.SphereGeometry(.78,14,12),L(owl?0x9a6a38:0xf1c9a0));hd.position.y=4.1;b.add(hd);
    if(owl){const f=new THREE.Mesh(new THREE.SphereGeometry(.6,12,10),L(0xf3e0b8));f.scale.set(1.2,1,.4);f.position.set(0,4.1,.55);b.add(f);
      [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),L(0xffffff));e.position.set(s*.32,4.25,.78);b.add(e);const p=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),L(0x1d2b53));p.position.set(s*.32,4.25,1.02);b.add(p);
        const tf=new THREE.Mesh(new THREE.ConeGeometry(.22,.7,6),L(0x6e4521));tf.position.set(s*.55,4.85,0);tf.rotation.z=-s*.3;b.add(tf)});
      const bk=new THREE.Mesh(new THREE.ConeGeometry(.16,.4,6),L(0xf2a33a));bk.position.set(0,4.0,.95);bk.rotation.x=Math.PI/2;b.add(bk);part(.6,.5,.4,0xf3e0b8,0,2.5,.5)}
    else{const hr=new THREE.Mesh(new THREE.SphereGeometry(.82,14,8,0,Math.PI*2,0,Math.PI/2),L(0x4a2f1b));hr.position.y=4.2;b.add(hr);
      part(1.7,.22,.95,col,0,4.3,0).scale.set(1,1,1);
      [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),L(0x1d2b53));e.position.set(s*.28,4.05,.72);b.add(e)});part(.32,.07,.06,0xb8352b,0,3.82,.76)}
    const tg=document.createElement('canvas');tg.width=256;tg.height=64;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(tg),transparent:true,depthTest:false,fog:false}));sp.scale.set(4.6,1.15,1);sp.position.y=6;sp.renderOrder=20;g.add(sp);
    g.userData={b,aL,aR,lL,lR,tg,sp,nm:''};g.visible=false;G0.add(g);return g};
  for(let i=0;i<MAXP;i++){T.pa.push(mkPuller(TC.a.c));T.pb.push(mkPuller(TC.b.c))}
  T.ow=mkPuller(0x8a5a2b,1.35,true)}

/* ---------- Jaringan ---------- */
function setPath(path,data){const a=path.split('/').filter(Boolean);if(!a.length){T.tree=data&&typeof data==='object'?data:{};return}
  let o=T.tree;for(let i=0;i<a.length-1;i++){if(!o[a[i]]||typeof o[a[i]]!=='object')o[a[i]]={};o=o[a[i]]}
  if(data===null||data===undefined)delete o[a[a.length-1]];else o[a[a.length-1]]=data}
function after(first){
  const mp=T.tree.p&&T.tree.p[dev];
  if(mp&&typeof mp.t==='number'&&T.net&&!T.offOk){T.offOk=true;T.off=Date.now()-mp.t;rebalance()}
  if(first&&!T.joined)joined()}
function onPut(e){const m=jp(e.data);if(!m||typeof m.path!=='string')return;setPath(m.path,m.data);after(m.path==='/')}
function onPatch(e){const m=jp(e.data);if(!m||typeof m.path!=='string'||!m.data)return;for(const k in m.data)setPath((m.path==='/'?'':m.path)+'/'+k,m.data[k]);after(false)}
function put(path,mkv){
  setPath(path,mkv(nowS()));
  if(!T.net)return;
  fetch(DB+'/tali/'+T.room+'/'+path+'.json',{method:'PUT',body:JSON.stringify(mkv(SVT)),headers:{'Content-Type':'application/json'}}).catch(()=>{})}
function me(){const nm=safe(NMX()),mid=T.mid||'';put('p/'+dev,t=>({n:nm,tm:T.tm,c:T.my,mid,t}))}
function bye(){if(!T.net||!T.joined)return;try{fetch(DB+'/tali/'+T.room+'/p/'+dev+'.json',{method:'PUT',body:JSON.stringify({n:safe(NMX()),tm:T.tm,c:T.my,mid:T.mid,off:1,t:SVT}),headers:{'Content-Type':'application/json'},keepalive:true}).catch(()=>{})}catch(e){}}
function joined(){if(T.joined)return;T.joined=true;clearTimeout(T.ct);T.tm='a';me();T.ph='lobby';T.ck=''}
function rebalance(){
  if(T.ph!=='lobby'&&T.ph!=='conn')return;
  const c=calc(T.tree,nowS()),na=c.na-(T.tm==='a'?1:0),nb=c.nb-(T.tm==='b'?1:0);
  const tm=nb<na?'b':'a';if(tm!==T.tm){T.tm=tm;me()}}
function local(){clearTimeout(T.ct);try{T.es&&T.es.close()}catch(e){}T.es=null;T.net=false;T.off=0;T.tree={};if(!T.joined)joined()}
function connect(){
  T.ph='conn';T.joined=false;T.net=false;T.offOk=false;T.off=0;T.tree={};T.room=roomOf(NMX());conn();
  try{
    const es=T.es=new EventSource(DB+'/tali/'+T.room+'.json');
    es.addEventListener('put',onPut);es.addEventListener('patch',onPatch);
    es.onopen=()=>{T.net=true};
    es.onerror=()=>{if(!T.joined)local()};
    T.ct=setTimeout(()=>{if(!T.joined)local()},4500)}
  catch(e){local()}}

/* ---------- Alur permainan ---------- */
function modal(on){$('#modal').style.display=on?'flex':'none'}
function flash(h,sm){E.c.className='';E.c.innerHTML=h;void E.c.offsetWidth;E.c.className=sm?'on sm':'on'}
function toast(h){flash(h,1);clearTimeout(T.tt);T.tt=setTimeout(()=>{if(!T.cdn)E.c.className=''},1000)}
function intro(){
  if(open||!ready||T.on)return;
  open=true;mode='tali';const c=$('#card'),s=T.sv;modal(true);c.scrollTop=0;
  c.innerHTML='<h2>🪢 Tarik Tali Ilmu</h2><div class="fc">Tim Hijau lawan Tim Jingga. Setiap jawaban <b>benar</b> menarik tali ke timmu. Jawab lebih banyak dari lawan, lalu tarik bendera melewati garis timmu! Kalau waktu habis dan seri, ada <b>Tarik Emas</b>: tarikan berikutnya yang membuat unggul langsung menang.</div>'
   +`<div class="exst"><div><b>${s.win||0}</b><small>kali menang</small></div><div><b>${s.best||0}</b><small>tarikan terbanyak</small></div><div><b>${s.try||0}</b><small>kali main</small></div></div>`
   +'<div class="exrw"><b>👫</b><span><b>Bareng teman sekelas</b>: ruang dibuat dari kelas di akhir namamu (misalnya “Ahmad 4A”). Tim dibagi otomatis.</span></div>'
   +'<div class="exrw"><b>🦉</b><span><b>Sendirian?</b> Lawanmu Kak Hud-hud, tingkatnya bisa dipilih di lobi. Salah tidak mengurangi tarikan, tapi kamu menunggu sebentar.</span></div>'
   +`<div class="exrw"><b>🔥</b><span><b>Cepat dan beruntun!</b> Tiap soal ada waktu ${QT} detik. Jawab benar 3 kali berturut-turut, dapat tarikan bonus.</span></div>`
   +'<div class="exbt"><button class="opt go" id="ttgo0" type="button">▶ Masuk lobi</button><button class="opt" id="ttno0" type="button">✖ Nanti saja</button></div>';
  $('#ttgo0').onclick=begin;$('#ttno0').onclick=()=>{modal(false);open=false;mode=null}}
function begin(){
  mk();
  T.org={bg:S.background,fc:S.fog.color.getHex(),fn:S.fog.near,ff:S.fog.far,fov:cam.fov};
  T.o={x:pl.x,y:pl.y,z:pl.z,yaw:pl.yaw};
  T.G.visible=true;T.on=true;open=true;mode='tali';document.body.classList.add('tli');P.visible=false;
  S.background=new THREE.Color(0xa8dcff);S.fog.color.setHex(0xa8dcff);S.fog.near=140;S.fog.far=560;cam.fov=55;cam.updateProjectionMatrix();
  pl.x=0;pl.y=0;pl.z=TZ;pl.yaw=0;pl.vy=0;
  T.sv.try=(T.sv.try||0)+1;persist();T.tp=performance.now();T.fx=0;T.mid='';T.my=0;T.fin=null;T.q=null;T.played=false;T.hk='';T.cdn='';rstat();
  connect()}
function leave(){
  const was=T.on;qreset();bye();T.on=false;T.ph='idle';clearTimeout(T.ct);clearTimeout(T.tt);try{T.es&&T.es.close()}catch(e){}T.es=null;T.joined=false;
  E.c.className='';E.q.className='';E.q.innerHTML='';T.qb=null;E.h.classList.remove('near');E.t.classList.remove('ot');
  if(was){
    const o=T.org;if(o){S.background=o.bg;S.fog.color.setHex(o.fc);S.fog.near=o.fn;S.fog.far=o.ff;cam.fov=o.fov;cam.updateProjectionMatrix()}
    if(T.G)T.G.visible=false;P.visible=true;
    if(T.o){pl.x=T.o.x;pl.y=0;pl.z=T.o.z;pl.yaw=T.o.yaw}pl.vy=0}
  document.body.classList.remove('tli');modal(false);open=false;mode=null}
function qreset(){T.qc=0;clearTimeout(qT);E.x.textContent='✖';E.x.setAttribute('aria-label','Keluar dari Tarik Tali')}
function quit(){if(!T.on)return;
  if(T.ph!=='play'||T.qc){qreset();leave();return}
  T.qc=1;E.x.textContent='Keluar? Ketuk lagi';E.x.setAttribute('aria-label','Ketuk sekali lagi untuk keluar. Tarikanmu tetap dihitung untuk timmu.');
  qT=setTimeout(qreset,3200)}
function conn(){const c=$('#card');modal(true);c.scrollTop=0;c.innerHTML='<h2>🪢 Menyambung…</h2><div class="fc">Mencari teman sekelas. Kalau tidak ada internet, kamu main melawan Kak Hud-hud.</div><div class="exbt"><button class="opt" id="ttq0" type="button">✖ Batal</button></div>';$('#ttq0').onclick=leave}
function lobby(c){
  const sg=JSON.stringify([c.L.a.map(x=>x.n),c.L.b.map(x=>x.n),T.net,c.m&&c.m.id,c.ended,T.tm,T.lv]);if(sg===T.ck)return;T.ck=sg;
  const col=t=>`<div class="ttcol" style="border-color:${TC[t].h}"><b style="color:${TC[t].h}">${TC[t].e} ${TC[t].n} · ${c.L[t].length}</b>${c.L[t].map(x=>`<span>${esc(x.n)}${x.k===dev?' (kamu)':''}</span>`).join('')||'<span class="ttm">menunggu teman…</span>'}</div>`;
  const solo=c.na===0||c.nb===0,card=$('#card');modal(true);
  const lvH=solo?'<div class="ttlv" role="group" aria-label="Tingkat lawan"><span>🦉 Lawan:</span>'+LV.map((l,k)=>`<button type="button" data-lv="${k}" class="${k===T.lv?'on':''}" aria-pressed="${k===T.lv}">${l}</button>`).join('')+'</div>':'';
  card.innerHTML=`<h2>🪢 Lobi Tarik Tali</h2><div class="stp">${T.net?'☁️ Ruang '+esc(T.room.toUpperCase()):'📴 Main sendiri (tanpa internet)'}</div><div class="ttg">${col('a')}${col('b')}</div><div class="fc" style="text-align:center">Kamu di <b style="color:${TC[T.tm].h}">${TC[T.tm].e} ${TC[T.tm].n}</b></div>`
   +`<div class="fc">${solo?'Belum ada lawan manusia: <b>Kak Hud-hud 🦉</b> akan jadi lawanmu.':'Siapa saja boleh menekan Mulai. Semua pemain langsung ikut.'}</div>`+lvH
   +'<div class="exbt"><button class="opt go" id="ttgo" type="button">▶ Mulai pertandingan</button><button class="opt" id="ttno" type="button">✖ Keluar</button></div>';
  card.querySelectorAll('[data-lv]').forEach(b=>{b.onclick=()=>{T.lv=num(b.dataset.lv,0,2,1);T.sv.lv=T.lv;persist();T.ck=''}});
  $('#ttgo').onclick=start;$('#ttno').onclick=leave;try{$('#ttgo').focus({preventScroll:true})}catch(e){}}
function start(){
  const c=calc(T.tree,nowS());if(c.m&&!c.ended)return;
  const id=Math.random().toString(36).slice(2,8),bot=(c.na===0||c.nb===0)?1:0,bm=BMS[T.lv]||BOTMS;
  T.mid=id;T.my=0;T.fin=null;T.played=true;rstat();put('m',t=>({id,t,b:bot,tg:TG,dur:DUR,bm}));me()}
function nextQ(){
  let i=T.pool.findIndex(x=>!x.u);
  if(i<0){T.pool=EXM.build().sort(()=>Math.random()-.5);i=T.pool.findIndex(x=>!x.u)}
  const q=T.pool[i<0?0:i];q.u=1;return q}
function ask(){
  const q=T.q=nextQ();E.q.className='on';T.qs=performance.now();
  E.q.innerHTML=`<div class="ttqt" aria-hidden="true"><i></i></div><div class="ttq1">${q.sp?'<button class="tsp" type="button" aria-label="Dengarkan">🔊</button>':''}${q.q}</div><div class="tto">`
   +q.o.map((x,k)=>`<button type="button" data-i="${k}" class="${ARX.test(x)?'ar':''}"><i aria-hidden="true">${k+1}</i><span>${x}</span></button>`).join('')+'</div><div class="ttf" role="status" aria-live="polite"></div>';
  T.qb=E.q.querySelector('.ttqt i');
  if(q.q.indexOf('🎧')>=0&&q.sp)say(q.sp)}
/* tanda ✔/✖ pada nomor tombol (supaya hasil tidak hanya dibedakan oleh warna) */
const mark=(b,s)=>{const n=b.querySelector('i');if(n)n.textContent=s};
/* catat soal yang salah/waktu habis untuk "Perlu diulang" di layar hasil */
const miss=q=>{if(T.miss.length<8)T.miss.push({q:String(q.q).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(),a:String(q.o[q.c])})};
function pick(i){
  const q=T.q;if(!q||q.done||T.ph!=='play'||!T.c||T.c.el<0)return;
  if(performance.now()-T.qs<TAPG)return;
  q.done=true;const ok=i===q.c;T.nall++;
  E.q.querySelectorAll('button[data-i]').forEach(b=>{b.disabled=true;const k=+b.dataset.i;if(k===q.c){b.classList.add('ok');mark(b,'✔')}else if(k===i){b.classList.add('no');mark(b,'✖')}});
  const f=E.q.querySelector('.ttf');
  if(ok){T.nok++;T.st++;const g=T.st%3===0?2:1;T.my+=g;coins+=2*g;hud();me();snd(988,.12,'triangle');vib(g>1?[20,30,40]:20);T.pull=performance.now();
    if(g>1){snd(1319,.14,'triangle');toast('🔥 Beruntun x'+T.st+'!');f.innerHTML='<b style="color:#14744b">✔ <span class="ar" lang="ar">أَحْسَنْتَ</span> Beruntun x'+T.st+'! Tarik +2 💪💪</b>'}
    else f.innerHTML='<b style="color:#14744b">✔ <span class="ar" lang="ar">أَحْسَنْتَ</span> Tarik! +1 💪</b>';
    T.nxt=performance.now()+900}
  else{T.st=0;miss(q);snd(180,.25,'sawtooth');vib([60,40]);
    f.innerHTML='<b style="color:#b8352b">🦉 Belum tepat.</b> <span class="ex">💡 '+(q.ex||'')+'</span>';T.nxt=performance.now()+LOCKW+(q.ex?800:0)}}
function tmo(){
  const q=T.q;if(!q||q.done)return;q.done=true;T.st=0;T.nall++;miss(q);
  E.q.querySelectorAll('button[data-i]').forEach(b=>{b.disabled=true;if(+b.dataset.i===q.c){b.classList.add('ok');mark(b,'✔')}});
  const f=E.q.querySelector('.ttf');if(f)f.innerHTML='<b style="color:#b8352b">⏰ Waktu habis.</b> <span class="ex">💡 '+(q.ex||'')+'</span>';
  snd(180,.25,'sawtooth');vib([60,40]);T.nxt=performance.now()+LOCKW+(q.ex?800:0)}
function finish(c){
  T.ph='end';T.fin=c;T.q=null;T.qb=null;E.q.className='';E.q.innerHTML='';E.c.className='';E.h.classList.remove('near');E.t.classList.remove('ot');
  const won=c.win===T.tm,draw=c.win==='',s=T.sv,first=s.d!==dstr();let b=10;
  const old=s.best||0,rec=T.played&&T.my>old&&T.my>0;
  if(T.played){
    if(won){b=40;if(first){b+=60;s.d=dstr()}s.win=(s.win||0)+1}
    s.best=Math.max(old,T.my);persist();coins+=b;hud()}
  const card=$('#card');modal(true);card.scrollTop=0;
  const ttl=!T.played?'🪢 Pertandingan selesai':won?'🏆 Timmu menang!':draw?'🤝 Seri!':'🦉 Belum menang';
  const mem=c.L[T.tm].slice().sort((x,y)=>y.c-x.c).slice(0,5),medal=['🥇','🥈','🥉'];
  const ctb=T.played&&mem.length>1?`<div class="ttcol ttcn" style="border-color:${TC[T.tm].h}"><b style="color:${TC[T.tm].h}">Kontribusi ${TC[T.tm].n}</b>${mem.map((x,k)=>`<span>${medal[k]||'▫️'} ${esc(x.n)}${x.k===dev?' (kamu)':''}: ${x.c} tarikan</span>`).join('')}</div>`:'';
  const rvw=T.played&&T.miss.length?`<div class="ttcol ttcn" style="border-color:#c62f26"><b style="color:#c62f26">📝 Perlu diulang</b>${T.miss.slice(0,5).map(m=>`<span>${esc(m.q)} → <b${ARX.test(m.a)?' class="ar" lang="ar"':''}>${esc(m.a)}</b></span>`).join('')}${T.miss.length>5?`<span class="ttm">dan ${T.miss.length-5} soal lain</span>`:''}</div>`:'';
  card.innerHTML=`<h2>${ttl}</h2>`+(won?'<div class="ar center" lang="ar" style="font-size:34px;line-height:1.5">أَحْسَنْتَ! مَبْرُوكٌ</div>':'')
   +`<div class="exst"><div><b style="color:${TC.a.h}">${c.a}</b><small>${TC.a.e} ${TC.a.n}</small></div><div><b style="color:${TC.b.h}">${c.b}</b><small>${TC.b.e} ${TC.b.n}</small></div><div><b>${T.my}</b><small>tarikanmu</small></div></div>`
   +(rec?`<div class="ex">🎉 <b>Rekor baru!</b> ${T.my} tarikan (sebelumnya ${old}).</div>`:'')
   +(T.played?`<div class="ex">🪙 +${b+T.my*2} koin (${T.my*2} dari jawaban benar${won&&first?', termasuk bonus menang pertama hari ini':''})</div>`:'')
   +(T.played&&T.nall?`<div class="ex">🎯 Ketepatan: ${T.nok} dari ${T.nall} soal (${Math.round(T.nok*100/T.nall)}%)</div>`:'')
   +ctb+rvw
   +(won?'':'<div class="fc">Tidak apa-apa! Perhatikan pembahasan setiap soal, lalu coba lagi bersama timmu.</div>')
   +'<div class="exbt"><button class="opt go" id="ttag" type="button">🔁 Main lagi</button><button class="opt" id="ttcl" type="button">✖ Tutup</button></div>';
  $('#ttag').onclick=()=>{modal(false);T.ph='lobby';T.ck='';T.cdn='';T.fin=null;const n=calc(T.tree,nowS());if(!n.m||n.ended)start()};
  $('#ttcl').onclick=leave;
  if(won||rec){vib([40,40,40,40,120]);confetti();[523,659,784,1047].forEach((f,k)=>setTimeout(()=>snd(f,.2,'triangle'),k*120))}}

/* ---------- Per-frame ---------- */
function hudUpd(c){
  const left=c.el<0?c.dur:Math.max(0,Math.ceil(c.dur-c.el));
  const la=TC.a.e+' '+c.a,lb=c.b+' '+TC.b.e+(c.bot?' 🦉':''),sg=left+'|'+la+'|'+lb+'|'+c.pos+'|'+T.tm+'|'+c.ot+'|'+T.st;if(sg===T.hk)return;T.hk=sg;
  if(T.ph==='play'&&c.el>=0&&left>0&&left<=10&&left!==T.lt){T.lt=left;snd(left<=3?880:660,.06,'square')}
  E.t.textContent=(c.ot?'⚡ Tarik Emas':'⏱ '+fmt(left))+(T.st>0&&T.ph==='play'?' 🔥'+T.st:'');E.t.classList.toggle('ot',!!c.ot);
  E.m.style.left=(50-c.pos*50)+'%';E.a.textContent=la;E.b.textContent=lb;
  E.h.classList.toggle('near',Math.abs(c.pos)>=.7);
  E.a.classList.toggle('me',T.tm==='a');E.b.classList.toggle('me',T.tm==='b');
  E.a.setAttribute('aria-label',TC.a.n+' '+c.a+' tarikan'+(T.tm==='a'?', timmu':''));E.b.setAttribute('aria-label',TC.b.n+' '+c.b+' tarikan'+(T.tm==='b'?', timmu':''))}
function tick(now){
  const c=T.c=calc(T.tree,nowS());
  if(T.joined&&now-T.hb>BEAT){T.hb=now;me()}
  if(c.m&&c.m.id!==T.mid){T.mid=c.m.id;T.my=0;T.fin=null;rstat();if(T.joined)me()}
  if(T.ph==='lobby'){
    if(c.m&&!c.ended){T.ph='play';T.played=true;T.q=null;modal(false)}
    else lobby(c)}
  if(T.ph==='play'){
    if(c.ended){finish(c);return}
    const s=c.el<0?String(Math.ceil(-c.el)):(c.el<.9?'MULAI!':'');
    if(s!==T.cdn){T.cdn=s;if(s){flash(s+(c.el<0?'<small>Kamu di '+TC[T.tm].e+' '+TC[T.tm].n+'</small>':''),0);snd(c.el<0?440:880,.12,'triangle')}else E.c.className=''}
    if(c.el>=0){
      if(T.q&&T.q.done&&now>=T.nxt)T.q=null;
      if(!T.q&&now>=T.nxt)ask();
      if(T.q&&!T.q.done){const r=1-(now-T.qs)/(QT*1000);
        if(T.qb){T.qb.style.transform='scaleX('+Math.max(0,r).toFixed(3)+')';T.qb.parentNode.classList.toggle('lo',r<.3)}
        if(r<=0)tmo()}
      if(c.ot&&!T.otn){T.otn=1;toast('⚡ Tarik Emas! Tarikan berikutnya menang');vib([60,40,60]);snd(1175,.18,'triangle')}
      const mp=c.pos*(T.tm==='a'?1:-1);
      if(mp<=-.7){if(!T.wn){T.wn=1;toast('💪 Ayo tarik!')}}else if(mp>-.4)T.wn=0;
      if(mp>=.7){if(!T.wm){T.wm=1;toast('🔥 Hampir menang!')}}else if(mp<.4)T.wm=0}
    else if(E.q.className){E.q.className='';E.q.innerHTML='';T.q=null;T.qb=null}}
  hudUpd(c)}
function puff(t){
  if(RM)return;const dir=t==='a'?-1:1;let n=0;
  for(const d of T.dust){if(n>=4)break;if(d.l>0)continue;n++;d.l=.6;d.m.visible=true;
    d.m.position.set(dir*(8+Math.random()*10)+T.fx*.55,.4,TZ+1.2+(Math.random()-.5)*2.4);
    d.vx=dir*(1+Math.random()*3);d.vy=2+Math.random()*3;d.vz=(Math.random()-.5)*3}}
function frame(){
  const now=performance.now(),dt=Math.min(.05,Math.max(0,(now-T.tp)/1000)),t=now/1000;T.tp=now;
  tick(now);const c=T.c;
  /* deteksi tarikan baru (dari tim mana pun, termasuk bot) -> tersentak + debu */
  if(c.a>T.la){T.jk.a=now;puff('a')}if(c.b>T.lb){T.jk.b=now;puff('b')}T.la=c.a;T.lb=c.b;
  T.fx+=(-c.pos*RX-T.fx)*Math.min(1,dt*(RM?30:5));
  T.flag.position.x=T.fx;
  const sh=T.fx*.55;T.rope.position.x=sh;
  if(T.ban&&!RM){T.ban.rotation.y=Math.sin(t*4)*.18;T.ban.position.x=1.4+Math.sin(t*3)*.12}
  const jf=k=>RM?0:Math.max(0,1-(now-T.jk[k])/260),jA=jf('a'),jB=jf('b');
  /* satu pelari: berdiri menghadap tali, miring ke belakang, kaki melangkah, label nama */
  const place=(g,i,dir,lean,on,nm,col)=>{g.visible=!!on;if(!on)return;const u=g.userData;
    g.position.x=dir*(9+i*3.3)+sh;g.rotation.y=dir<0?Math.PI/2:-Math.PI/2;
    const ph=t*6+i*1.3,j=dir<0?jA:jB;
    u.b.position.y=RM?0:Math.abs(Math.sin(ph))*.12;
    u.b.rotation.x=-(lean+(RM?0:.07*Math.sin(ph*1.2))+j*.18);
    const sw=RM?0:Math.sin(ph)*.3;u.lL.rotation.x=sw;u.lR.rotation.x=-sw;
    u.aL.rotation.x=u.aR.rotation.x=-1.35+(RM?0:Math.sin(ph*1.2)*.08)+j*.25;
    if(nm&&u.nm!==nm)setTag(u,nm,col);u.sp.visible=!!nm};
  for(let i=0;i<MAXP;i++){const m=c.L.a[i];place(T.pa[i],i,-1,.5,i<c.na&&T.ph!=='conn',m&&m.n,TC.a.h)}
  const bo=c.bot?1:0;
  place(T.ow,0,1,.5,!!bo,'Kak Hud-hud',TC.b.h);
  for(let i=0;i<MAXP;i++){const m=c.L.b[i];place(T.pb[i],i+bo,1,.5,i<c.nb&&i+bo<MAXP,m&&m.n,TC.b.h)}
  /* debu kaki */
  for(const d of T.dust){if(d.l<=0)continue;d.l-=dt;if(d.l<=0){d.m.visible=false;continue}
    d.vy-=9*dt;d.m.position.x+=d.vx*dt;d.m.position.y=Math.max(.2,d.m.position.y+d.vy*dt);d.m.position.z+=d.vz*dt;d.m.scale.setScalar(Math.max(.05,d.l/.6))}
  /* penonton bersorak: tim yang unggul lebih heboh */
  const cheer=now-Math.max(T.jk.a,T.jk.b)<500;
  T.crowd.forEach(o=>{const lead=(o.s==='a'?c.pos:-c.pos)>0?.45:.15;o.g.position.y=o.y+(RM?0:Math.abs(Math.sin(t*4+o.k))*(cheer?.6:lead))});
  T.cl.forEach((g,i)=>{g.position.x+=Math.sin(t*.2+i)*.012});
  /* kamera: di HP landscape (layar pendek) arena dinaikkan supaya tidak tertutup panel soal; sentakan kecil saat timmu menarik */
  const jm=T.tm==='a'?jA:jB,ly=innerHeight<520?-8.5:-3.5;
  cam.position.set(RM?0:Math.sin(t*.3)*1.5,8-jm*.35,TZ+30-jm*.9);cam.lookAt(0,ly,TZ);
  P.position.set(pl.x,pl.y,pl.z)}
const R0=R.render;
R.render=function(s,c){
  if(T.on&&s===S){try{frame()}catch(e){console.warn('tali',e);try{leave()}catch(_){}try{ts('⚠️ Tarik Tali error: '+e.message,4500)}catch(_){}}}
  return R0.call(R,s,c)};

/* ---------- Tombol & input ---------- */
{
  const b=document.createElement('button');b.className='pill mx';b.id='ttb';b.type='button';b.title='Tarik Tali Ilmu';b.setAttribute('aria-label','Tarik Tali Ilmu: tim lawan tim, jawab soal untuk menarik tali');
  b.innerHTML='<span aria-hidden="true">🪢</span><span class="lb" aria-hidden="true">Tali</span>';
  const st=$('#stat'),ref=$('#arb')||$('#exb');if(ref&&ref.after)ref.after(b);else if(st)st.appendChild(b);
  b.onclick=()=>{
    if(open||!ready)return;
    if(typeof RID!=='undefined'&&RID){ts('🚲 Turun dulu dari kendaraan (F), lalu masuk arena.',2200);return}
    if(typeof CV!=='undefined'&&CV)return;
    if(typeof INTR!=='undefined'&&INTR&&INTR.on){ts('🚪 Keluar dulu dari bangunan, lalu masuk arena.',2200);return}
    intro()}}
E.x.onclick=quit;
E.q.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.classList.contains('tsp')){if(T.q&&T.q.sp)say(T.q.sp);return}if(b.dataset.i!=null)pick(+b.dataset.i)});
addEventListener('keydown',e=>{
  if(!T.on||T.ph!=='play'||e.ctrlKey||e.metaKey||e.altKey)return;
  const i='1234'.indexOf(e.key);if(i>=0&&e.key.length===1)pick(i);else if(e.key==='Escape')quit()});
addEventListener('pagehide',bye);

window.TTI={start:intro,leave,calc,state:T};
})();
