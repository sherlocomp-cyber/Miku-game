/* === BAGIAN 33 (v2): Jembatan Kaca Ilmu (arena kedua dari rencana Arena Belajar) ===
   v2: soal salah diulang 3 soal kemudian (maks 2x) dan dicatat sebagai soal lemah (muncul lebih awal di permainan berikutnya);
   salah beruntun = jeda jatuh 3 -> 4,5 -> 6 dtk (anti-tebak); lawan otomatis naik/turun tingkat (2 menang/2 kalah beruntun);
   mode Tim gantian (2 tim, 1 layar, 5 menit, tanpa koin); kamera bergoyang saat kaca pecah; celoteh Hud-hud; rekor harian.
   Modul mandiri, tidak mengubah file 01-32 (hanya memakai global-nya). Dimuat setelah js/32. Tanpa internet: main sendiri melawan Kak Hud-hud.
   Permainan: 8 petak jembatan kaca. Tiap petak ada 2 kaca (kiri/kanan), masing-masing berisi satu pilihan jawaban. Pilih kaca yang benar = maju.
   Kaca salah = pecah, karakter jatuh ke awan empuk, muncul lagi di pos aman terakhir (tiap 3 petak) sesudah 3 dtk; jembatan dipulihkan.
   Waktu habis (12 dtk per soal) = tidak maju, kaca benar ditunjukkan, jeda sebentar (tidak jatuh). 3 benar beruntun = lompat 2 petak.
   Intip: 1 kali per permainan, didapat saat beruntun 3 pertama; kaca yang benar berkilat 1 dtk. Lawan: Kak Hud-hud di jembatan sebelah
   (Santai / Normal / Sulit; jadwalnya dihitung dari bibit acak, termasuk jatuhnya). Siapa sampai seberang lebih dulu menang;
   batas 150 dtk: yang lebih jauh menang, sama jauh = seri. Koin: +2 per benar, +40 menang (+60 menang pertama hari ini), +10 ikut.
   Tidak ada gambar menakutkan dan tidak ada karakter yang "mati". Soal dari EXM.build() (bank yang sama dengan Tarik Tali).
   Cara balik: hapus baris <script> js/33 di index.html. */
(function(){
'use strict';
/* ---------- Logika murni (dites di Node lewat window.JKL) ---------- */
const N=8,CP=3,DUR=150,FALL=3000,QT=12;
const LV=['Santai','Normal','Sulit'],BMS=[6500,5000,3600],BPF=[.25,.20,.13];
function rng(s){s=s>>>0;return function(){s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
/* jadwal bot: [{t(ms),p(posisi sesudah),f(1=jatuh),k(petak yang dicoba, -1=muncul lagi),s(sisi kaca)}] */
function plan(seed,lv){
  const r=rng(seed),bm=BMS[lv]||BMS[1],pf=BPF[lv]==null?BPF[1]:BPF[lv],ev=[{t:0,p:0,f:0,k:-1,s:0}];
  let t=0,p=0,g=0;
  while(p<N&&t<DUR*2000&&g++<500){
    t+=bm*(.75+r()*.5);
    const k=p,safe=r()<.5?0:1;
    if(r()<pf){ev.push({t,p,f:1,k,s:1-safe});t+=FALL;p=Math.floor(p/CP)*CP;ev.push({t,p,f:0,k:-1,s:0})}
    else{p++;ev.push({t,p,f:0,k,s:safe})}}
  return ev}
const at=(ev,ms)=>{let e=ev[0];for(let i=1;i<ev.length&&ev[i].t<=ms;i++)e=ev[i];return e};
const fin=ev=>{for(let i=0;i<ev.length;i++)if(ev[i].p>=N&&!ev[i].f)return ev[i].t;return Infinity};
function resolve(p,st,ok){
  if(!ok)return{p:Math.floor(p/CP)*CP,st:0,fall:1,jump:0};
  const s=st+1,j=s%3===0?2:1;return{p:Math.min(N,p+j),st:s,fall:0,jump:j}}
function verdict(pt,bt,pp,bp,ms){
  const pd=pt!==null&&pt<=ms,bd=bt<=ms;
  if(pd&&(!bd||pt<=bt))return{ended:1,win:'p'};
  if(bd)return{ended:1,win:'b'};
  if(ms>=DUR*1000)return{ended:1,win:pp>bp?'p':pp<bp?'b':''};
  return{ended:0,win:''}}
function pair(q,r){
  const wr=[];q.o.forEach((x,i)=>{if(i!==q.c)wr.push(i)});
  const w=wr.length?wr[Math.floor(r()*wr.length)]:q.c,side=r()<.5?0:1;
  return{o:side?[w,q.c]:[q.c,w],side}}
/* v2: jeda jatuh makin lama bila salah beruntun (anti-tebak) */
const fallFor=cw=>cw<=1?FALL:cw===2?4500:6000;
function qkey(q){return String(q&&q.q==null?'':q&&q.q).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim().slice(0,80)}
/* soal yang salah muncul lagi `gap` soal kemudian (maks. 2 kali diulang) */
function requeue(pool,q,gap){
  if((q.rq||0)>=2)return false;
  let i=pool.findIndex(x=>!x.u);if(i<0)i=pool.length;
  pool.splice(Math.min(pool.length,i+gap),0,Object.assign({},q,{u:0,rq:(q.rq||0)+1,done:false}));return true}
/* urutan soal acak, tetapi soal yang pernah salah cenderung muncul lebih awal */
function prio(pool,weak,r){
  const w=new Set(weak||[]);
  return pool.map(q=>({q,k:r()*(w.has(qkey(q))?.4:1)})).sort((a,b)=>a.k-b.k).map(x=>x.q)}
/* lawan otomatis: menang 2x beruntun naik tingkat, kalah 2x beruntun turun */
function adapt(lv,h,res){
  h=(h||[]).concat(res).slice(-2);
  if(h.length===2&&h[0]==='w'&&h[1]==='w'&&lv<2)return{lv:lv+1,h:[]};
  if(h.length===2&&h[0]==='l'&&h[1]==='l'&&lv>0)return{lv:lv-1,h:[]};
  return{lv,h}}
/* mode tim gantian: w=1/2 tim yang sampai ujung; a/b = petak tim 1/2 */
function tverdict(w,a,b,ms,dur){
  if(w)return{ended:1,win:w===1?'a':'b'};
  if(ms>=(dur||DUR)*1000)return{ended:1,win:a>b?'a':a<b?'b':''};
  return{ended:0,win:''}}
window.JKL={N,CP,DUR,FALL,QT,LV,BMS,BPF,rng,plan,at,fin,resolve,verdict,pair,fallFor,qkey,requeue,prio,adapt,tverdict};
})();

(function(){
'use strict';
if(window.JKI)return;
const L=window.JKL;
if(typeof THREE==='undefined'||typeof S==='undefined'||typeof R==='undefined'||typeof P==='undefined'||typeof pl==='undefined'||typeof cam==='undefined'||typeof EXM==='undefined'||typeof EXM.build!=='function'){console.warn('Kaca: modul pendukung belum siap');return}

const N=L.N,TZ=-5200,PX=-8,PXB=8,COL=2.3,SZ=5,CD=3,TAPG=250,SC=.85,DURT=300;
const ARX=/[؀-ۿ]/,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const SKT=SK+':kaca';
const jp=t=>{try{return JSON.parse(t)}catch(e){return null}};
const num=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):(d||0)};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
const zg=k=>TZ-k*SZ,zp=p=>p<=0?TZ+7:p>=N?TZ-42.8:zg(p-1);
const sxOf=(bx,p,sx)=>p<=0||p>=N?bx:bx+(sx[p]?COL:-COL);
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const lsRead=()=>{try{return typeof lsg==='function'?lsg(SKT):localStorage.getItem(SKT)}catch(e){return null}};
const T={on:false,built:false,ph:'idle',G:null,ru:null,bu:null,gl:{p:[],b:[]},ov:[],sh:[],gm:[],cl:[],op:['',''],pr:null,q:null,qb:null,qs:0,nxt:0,qc:0,
  p:0,st:0,pkn:0,pkg:0,fl:null,vd:null,endAt:0,pt:null,sx:[],t0:0,plan:[],bi:0,bp:0,bfin:Infinity,nok:0,nall:0,miss:[],cdn:'',hk:'',tp:0,tt:0,cz:0,pool:[],lv:1,org:null,o:null,
  cw:0,cur:0,tm:0,tms:[null,null],rs:0,tw:0,shk:0,sayT:0,rqok:0,sg:[],
  sv:{try:0,win:0,best:0,d:'',lv:1,auto:1,h:[],wk:[],bd:{d:'',t:0}}};
try{Object.assign(T.sv,jp(lsRead()||'{}')||{})}catch(e){}
if(!Array.isArray(T.sv.wk))T.sv.wk=[];if(!Array.isArray(T.sv.h))T.sv.h=[];if(!T.sv.bd||typeof T.sv.bd!=='object')T.sv.bd={d:'',t:0};
T.lv=num(T.sv.lv,0,2,1);
/* pemain aktif: mode lawan selalu tim 0; mode tim bergantian 0/1 */
const RU=()=>T.cur?T.bu:T.ru,BX=()=>T.cur?PXB:PX,GL=()=>T.cur?T.gl.b:T.gl.p;
const pos=i=>T.tm?(T.cur===i?T.p:T.bp):(i?T.bp:T.p);
const dur=()=>T.tm?DURT:L.DUR;
const TF=['p','st','pkn','pkg','fl','pt','sx','nok','nall','cw','rs'];
function swapTeam(){
  const o={};TF.forEach(k=>{o[k]=T[k]});T.tms[T.cur]=o;
  T.cur=1-T.cur;const n=T.tms[T.cur];TF.forEach(k=>{T[k]=n[k]});T.bp=T.tms[1-T.cur].p}
const persist=()=>{try{typeof lss==='function'?lss(SKT,JSON.stringify(T.sv)):localStorage.setItem(SKT,JSON.stringify(T.sv))}catch(e){}};
const E={};let qT=0;

/* ---------- Elemen layar ---------- */
(function(){
  const css=document.createElement('style');css.textContent=`
#jkh,#jkq,#jkc{display:none}
body.jki #jkh{display:flex}
body.jki .hud,body.jki #js,body.jki #rbar{display:none!important}
#jkh{position:fixed;left:0;right:0;top:0;z-index:5;gap:8px;align-items:center;pointer-events:none;padding:calc(8px + env(safe-area-inset-top,0px)) calc(10px + env(safe-area-inset-right,0px)) 0 calc(10px + env(safe-area-inset-left,0px))}
.jkp{font:700 15px/1 "Baloo 2",system-ui,sans-serif;background:#fffaf0;color:#1d2b53;border:3px solid #1d2b53;border-radius:999px;padding:7px 12px;pointer-events:auto;white-space:nowrap;box-shadow:0 3px 0 rgba(29,43,83,.35)}
button.jkp{cursor:pointer;min-width:44px;min-height:44px;padding:4px 12px}
.jkp.me{box-shadow:0 0 0 3px #ffcf3f}
.jkbar{flex:1;height:24px;border:3px solid #1d2b53;border-radius:999px;position:relative;background:linear-gradient(90deg,#bfe6ff,#fff);box-shadow:0 3px 0 rgba(29,43,83,.35)}
.jkbar i{position:absolute;top:-3px;width:20px;height:20px;margin-left:-10px;border-radius:50%;border:3px solid #1d2b53;transition:left .35s}
#jkm1{background:#2fa56b;z-index:2}#jkm2{background:#f08a24;z-index:1}
#jkq{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(8px + env(safe-area-inset-bottom,0px));width:min(96vw,720px);max-height:56vh;overflow:auto;z-index:6;background:#fffaf0;color:#1d2b53;border:4px solid #1d2b53;border-radius:18px;padding:10px 12px;font-family:"Baloo 2",system-ui,sans-serif;box-shadow:0 6px 0 rgba(29,43,83,.35)}
#jkq.on{display:block}
.jkqt{height:8px;border:2px solid #1d2b53;border-radius:6px;background:#fff;overflow:hidden;margin-bottom:6px}
.jkqt i{display:block;height:100%;background:#2fa56b;transform-origin:left center;transform:scaleX(1)}
.jkqt.lo i{background:#c62f26}
.jkq1{font-size:clamp(16px,3.4vw,22px);font-weight:700;margin-bottom:8px;line-height:1.3}
.jksp{float:right;min-width:44px;min-height:44px;border:3px solid #1d2b53;border-radius:12px;background:#fff;font-size:18px;cursor:pointer;margin-left:8px}
.jko{display:grid;grid-template-columns:1fr 1fr;gap:8px;clear:both}
.jko button{min-height:52px;font:700 clamp(15px,3vw,19px)/1.2 "Baloo 2",system-ui,sans-serif;border:3px solid #1d2b53;border-radius:14px;background:#9fe0ff;color:#1d2b53;cursor:pointer;padding:6px 10px;text-align:left;display:flex;gap:8px;align-items:center;box-shadow:0 3px 0 #4a9bc4}
.jko button.ar{font-family:Amiri,"Noto Naskh Arabic",serif;font-size:clamp(20px,4vw,26px);direction:rtl;text-align:right}
.jko button.ok{background:#178a55;color:#fff;box-shadow:0 3px 0 #0e5c38}.jko button.no{background:#c62f26;color:#fff;box-shadow:0 3px 0 #86201a}
.jko button.pk{outline:4px solid #ffcf3f}
.jko button:disabled{cursor:default}
.jko i{font-style:normal;background:#1d2b53;color:#fff;border-radius:12px;min-width:34px;height:24px;padding:0 6px;display:inline-grid;place-items:center;font-size:13px;flex:none}
.jko button.ok i,.jko button.no i{background:#fff;color:#1d2b53}
.jkpk{margin-top:8px;min-height:44px;border:3px solid #1d2b53;border-radius:999px;background:#ffcf3f;color:#1d2b53;font:700 15px "Baloo 2",system-ui,sans-serif;padding:2px 14px;cursor:pointer}
.jko button:focus-visible,.jksp:focus-visible,.jkp:focus-visible,.jkpk:focus-visible,.jklv button:focus-visible{outline:4px solid #1d2b53;outline-offset:2px}
.jkf{min-height:20px;margin-top:6px;font-size:14px}
#jkc{position:fixed;inset:0;z-index:7;align-items:center;justify-content:center;pointer-events:none;text-align:center;font:800 min(22vw,150px)/1.05 "Baloo 2",system-ui,sans-serif;color:#fff;-webkit-text-stroke:6px #1d2b53;paint-order:stroke fill}
#jkc.on{display:flex;flex-direction:column;animation:jkpop .45s ease-out}
#jkc.sm{font-size:min(9vw,56px);-webkit-text-stroke:4px #1d2b53;justify-content:flex-start;padding-top:22vh}
#jkc small{font-size:.26em;-webkit-text-stroke:3px #1d2b53;margin-top:.3em}
@keyframes jkpop{from{transform:scale(1.5);opacity:0}to{transform:scale(1);opacity:1}}
.jkcol{border:3px solid;border-radius:14px;padding:6px 10px;display:flex;flex-direction:column;gap:2px;font-size:15px;background:#fffaf0;margin:8px 0}
.jklv{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:6px 0;font-weight:700;color:#1d2b53}
.jklv button{min-height:40px;border:3px solid #1d2b53;border-radius:999px;background:#fff;color:#1d2b53;padding:2px 12px;font:700 14px "Baloo 2",system-ui,sans-serif;cursor:pointer}
.jklv button.on{background:#ffcf3f}
.jkrq{display:block;color:#b8352b;font-size:13px;font-weight:700;margin-bottom:2px}
.jktn{display:inline-block;border:3px solid #1d2b53;border-radius:999px;padding:2px 12px;margin-bottom:6px;font-size:15px;font-weight:800;color:#fff}
.jktn.t0{background:#178a55}.jktn.t1{background:#b85c0a}
@media (max-height:420px){#jkq{max-height:60vh;padding:6px 10px}.jkq1{font-size:15px;margin-bottom:4px}.jko button{min-height:44px}#jkh{gap:6px}.jkp{padding:5px 9px;font-size:14px}#jkc.sm{padding-top:14vh}}
@media (prefers-reduced-motion:reduce){#jkc.on{animation:none}.jkbar i{transition:none}}`;
  document.head.appendChild(css);
  document.body.insertAdjacentHTML('beforeend','<div id="jkh"><div class="jkp" id="jkt">⏱ 2:30</div><div class="jkp me" id="jka"></div><div class="jkbar" aria-hidden="true"><i id="jkm2"></i><i id="jkm1"></i></div><div class="jkp" id="jkd"></div><button class="jkp" id="jkx" type="button" aria-label="Keluar dari Jembatan Kaca">✖</button></div>'
   +'<div id="jkq" role="group" aria-label="Soal"></div><div id="jkc" role="status" aria-live="polite"></div>');
  E.h=$('#jkh');E.t=$('#jkt');E.a=$('#jka');E.d=$('#jkd');E.m1=$('#jkm1');E.m2=$('#jkm2');E.x=$('#jkx');E.q=$('#jkq');E.c=$('#jkc')})();

/* ---------- Gambar kanvas ---------- */
const fnt=(ar,s)=>ar?`700 ${s}px Amiri,"Noto Naskh Arabic",serif`:`700 ${s}px "Baloo 2",system-ui,sans-serif`;
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function drawSign(m,txt,bg){const u=m.userData,c=u.c,g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);
  g.fillStyle=bg;rr(g,6,6,c.width-12,c.height-12,24);g.fill();g.fillStyle='#fff';g.font=fnt(0,Math.round(c.height*.46));g.textAlign='center';g.textBaseline='middle';g.fillText(txt,c.width/2,c.height/2);u.tx.needsUpdate=true}
function sign(w,h,txt,bg){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const tx=new THREE.CanvasTexture(c);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx,toneMapped:false,fog:false,side:THREE.DoubleSide}));m.userData={c,tx};drawSign(m,txt,bg);return m}
function drawTag(sp,t,col){const u=sp.userData,c=u.c,g=c.getContext('2d');g.clearRect(0,0,256,64);
  g.fillStyle=col;rr(g,4,6,248,52,26);g.fill();g.strokeStyle='#1d2b53';g.lineWidth=5;g.stroke();g.fillStyle='#fff';g.font=fnt(0,28);g.textAlign='center';g.textBaseline='middle';g.fillText(t,128,34);u.tx.needsUpdate=true}
function tag(t,col){const c=document.createElement('canvas');c.width=256;c.height=64;const tx=new THREE.CanvasTexture(c);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,transparent:true,depthTest:false,fog:false}));sp.userData={c,tx};drawTag(sp,t,col);sp.scale.set(4.6,1.15,1);sp.renderOrder=20;return sp}
/* nama di papan jembatan dan di atas kepala: mode lawan atau mode tim */
function labels(){
  const a=T.tm?['🟢 Tim Hijau','Tim Hijau']:['🧒 Jalurmu','Kamu'],b=T.tm?['🟠 Tim Jingga','Tim Jingga']:['🦉 Hud-hud','Kak Hud-hud'];
  if(T.sg[0])drawSign(T.sg[0],a[0],'#178a55');if(T.sg[1])drawSign(T.sg[1],b[0],'#b85c0a');
  if(T.ru&&T.ru.tg)drawTag(T.ru.tg,a[1],'#178a55');if(T.bu&&T.bu.tg)drawTag(T.bu.tg,b[1],'#b85c0a')}
/* kaca bertulisan: st 0 biasa, 1 benar, 2 pecah, 3 intip */
function paint(o,txt,st){
  const c=o.userData.c,g=c.getContext('2d'),W=c.width,k=o.userData.k;g.clearRect(0,0,W,W);
  const col=[['rgba(160,225,255,.82)','#1d6fa5'],['rgba(80,200,130,.93)','#0e6b3d'],['rgba(240,110,100,.93)','#8a1f19'],['rgba(255,214,90,.96)','#8a6410']][st];
  g.fillStyle=col[0];rr(g,8,8,W-16,W-16,28);g.fill();g.lineWidth=10;g.strokeStyle=col[1];g.stroke();
  if(st===2){g.strokeStyle='#fff';g.lineWidth=6;g.beginPath();g.moveTo(W*.5,12);g.lineTo(W*.42,W*.35);g.lineTo(W*.6,W*.5);g.lineTo(W*.4,W*.7);g.lineTo(W*.5,W-12);g.moveTo(W*.42,W*.35);g.lineTo(12,W*.45);g.moveTo(W*.6,W*.5);g.lineTo(W-12,W*.58);g.stroke()}
  g.fillStyle=st===0?'#0b3a5c':'#fff';g.textAlign='center';g.textBaseline='middle';g.direction='ltr';g.font=fnt(0,64);
  g.fillText(st===1?'✔':st===2?'✖':st===3?'👁':(k?'2 ▶':'◀ 1'),W/2,W*.17);
  const t=String(txt).replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim(),ar=ARX.test(t),mw=W-70;
  g.direction=ar?'rtl':'ltr';let sz=ar?100:72;g.font=fnt(ar,sz);
  while(g.measureText(t).width>mw&&sz>34){sz-=4;g.font=fnt(ar,sz)}
  if(g.measureText(t).width>mw){const w=t.split(' '),h=Math.ceil(w.length/2),a=w.slice(0,h).join(' '),b=w.slice(h).join(' ');sz=Math.min(sz,46);g.font=fnt(ar,sz);
    while(Math.max(g.measureText(a).width,g.measureText(b).width)>mw&&sz>24){sz-=2;g.font=fnt(ar,sz)}
    g.fillText(a,W/2,W*.5);g.fillText(b,W/2,W*.7)}
  else g.fillText(t,W/2,W*.58);
  o.userData.tx.needsUpdate=true}

/* ---------- Arena 3D (dibangun sekali) ---------- */
const setG=(m,s)=>{m.visible=s!==2;m.material=s===1?T.gm[1]:T.gm[0]};
function mk(){
  if(T.built)return;T.built=true;
  const G0=T.G=new THREE.Group();G0.visible=false;S.add(G0);
  const L0=c=>new THREE.MeshLambertMaterial({color:c}),B0=c=>new THREE.MeshBasicMaterial({color:c});
  const bx=(g,w,h,d,c,x,y,z,basic)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),basic?B0(c):L0(c));m.position.set(x,y,z);g.add(m);return m};
  const r0=L.rng(7);
  /* lembah berawan di bawah jembatan */
  bx(G0,320,1,280,0xdff1ff,0,-17,TZ-20,1);
  const cg=new THREE.SphereGeometry(1,10,8),cm=L0(0xffffff);
  for(let k=0;k<70;k++){const m=new THREE.Mesh(cg,cm),s=5+r0()*9;m.scale.set(s*1.4,s*.6,s);m.position.set(-75+r0()*150,-15+r0()*3,TZ-75+r0()*115);G0.add(m)}
  /* tebing dan matahari */
  for(let k=0;k<10;k++){const s=k%2?1:-1,h=26+r0()*22,m=new THREE.Mesh(new THREE.ConeGeometry(14+r0()*8,h,6),L0(k%3?0x8aa3b8:0x7a93a8));m.position.set(s*(48+r0()*30),h/2-17,TZ+20-k*8);G0.add(m)}
  const sun=new THREE.Mesh(new THREE.SphereGeometry(9,16,12),B0(0xfff2a8));sun.material.fog=false;sun.position.set(60,60,TZ-120);G0.add(sun);
  for(let k=0;k<8;k++){const g=new THREE.Group();g.position.set(-110+k*32,45+(k%3)*7,TZ-100);[[0,0],[5,-1],[-5,-1],[2,2]].forEach(o=>{const m=new THREE.Mesh(new THREE.SphereGeometry(5,10,8),L0(0xffffff));m.position.set(o[0],o[1],0);m.scale.y=.6;g.add(m)});G0.add(g);T.cl.push(g)}
  /* bahan kaca bersama */
  T.gm=[new THREE.MeshBasicMaterial({color:0x9fe0ff,transparent:true,opacity:.42,depthWrite:false}),new THREE.MeshBasicMaterial({color:0x57d68d,transparent:true,opacity:.66,depthWrite:false})];
  const gg=new THREE.BoxGeometry(4.2,.2,4.4),eg=new THREE.EdgesGeometry(gg),em=new THREE.LineBasicMaterial({color:0xffffff});
  const bridge=(x0,arr,name,colr)=>{
    bx(G0,11,1,9,0x6b7a8f,x0,-.6,TZ+7.3);bx(G0,11,1,10,0x6b7a8f,x0,-.6,TZ-42.8);
    [-1,1].forEach(s=>{bx(G0,.5,.5,54,0x44546a,x0+s*(COL+2.5),-.5,TZ-17);bx(G0,.18,.18,54,0xffcf3f,x0+s*(COL+2.5),1.7,TZ-17,1);
      for(let k=0;k<9;k++)bx(G0,.25,2,.25,0x44546a,x0+s*(COL+2.5),.7,TZ+9-k*6.4)});
    [2,5].forEach(k=>[-1,1].forEach(s=>bx(G0,4.8,.1,5,0xffcf3f,x0+s*COL,-.25,zg(k),1)));
    for(let k=0;k<N;k++){arr[k]=[];for(let s=0;s<2;s++){const m=new THREE.Mesh(gg,T.gm[0]);m.position.set(x0+(s?COL:-COL),0,zg(k));m.add(new THREE.LineSegments(eg,em));G0.add(m);arr[k][s]=m}}
    [-1,1].forEach(s=>bx(G0,.7,9,.7,0x5a3a1c,x0+s*5.4,4.5,TZ-46));bx(G0,11.5,.7,.7,0x5a3a1c,x0,9,TZ-46);
    const e=sign(9,2.6,'🏁 SAMPAI!',colr);e.position.set(x0,7.4,TZ-46);G0.add(e);
    const b=sign(9,2.6,name,colr);b.position.set(x0,6,TZ+12);G0.add(b);T.sg.push(b)};
  bridge(PX,T.gl.p,'🧒 Jalurmu','#178a55');bridge(PXB,T.gl.b,'🦉 Hud-hud','#b85c0a');
  /* kaca bertulisan untuk petak yang sedang dijawab */
  for(let s=0;s<2;s++){const c=document.createElement('canvas');c.width=c.height=512;const tx=new THREE.CanvasTexture(c);tx.anisotropy=4;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(4,4.2),new THREE.MeshBasicMaterial({map:tx,transparent:true,toneMapped:false,fog:false,side:THREE.DoubleSide,depthWrite:false}));
    m.rotation.x=-Math.PI/2;m.userData={c,tx,k:s};m.visible=false;G0.add(m);T.ov.push(m)}
  /* serpihan kaca */
  {const sg=new THREE.BoxGeometry(.45,.45,.45),sm=B0(0xbfefff);for(let k=0;k<28;k++){const m=new THREE.Mesh(sg,sm);m.visible=false;G0.add(m);T.sh.push({m,vx:0,vy:0,vz:0,l:0})}}
  /* pelari */
  const mkRun=(col,owl,nm,tc)=>{
    const g=new THREE.Group(),b=new THREE.Group();g.add(b);g.rotation.y=Math.PI;
    const skin=owl?0x8a5a2b:0xf1c9a0,part=(w,h,d,c,x,y,z,p)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),L0(c));m.position.set(x,y,z);(p||b).add(m);return m};
    part(1.5,1.9,.9,col,0,2.55,0);part(1.56,.5,.96,0x1d2b53,0,1.55,0);
    const pv=(x,y,w,h,c)=>{const q=new THREE.Group();q.position.set(x,y,0);b.add(q);part(w,h,w,c,0,-h/2,0,q);return q};
    const lL=pv(-.4,1.4,.5,1.4,skin),lR=pv(.4,1.4,.5,1.4,skin),aL=pv(-.98,3.3,.42,1.4,skin),aR=pv(.98,3.3,.42,1.4,skin);
    part(.6,.3,.95,0x1d2b53,0,-1.4,.15,lL);part(.6,.3,.95,0x1d2b53,0,-1.4,.15,lR);aL.rotation.x=aR.rotation.x=-.5;
    const hd=new THREE.Mesh(new THREE.SphereGeometry(.78,14,12),L0(owl?0x9a6a38:0xf1c9a0));hd.position.y=4.1;b.add(hd);
    if(owl){const f=new THREE.Mesh(new THREE.SphereGeometry(.6,12,10),L0(0xf3e0b8));f.scale.set(1.2,1,.4);f.position.set(0,4.1,.55);b.add(f);
      [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),L0(0xffffff));e.position.set(s*.32,4.25,.78);b.add(e);const p=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),L0(0x1d2b53));p.position.set(s*.32,4.25,1.02);b.add(p);
        const tf=new THREE.Mesh(new THREE.ConeGeometry(.22,.7,6),L0(0x6e4521));tf.position.set(s*.55,4.85,0);tf.rotation.z=-s*.3;b.add(tf)});
      const bk=new THREE.Mesh(new THREE.ConeGeometry(.16,.4,6),L0(0xf2a33a));bk.position.set(0,4.0,.95);bk.rotation.x=Math.PI/2;b.add(bk)}
    else{const hr=new THREE.Mesh(new THREE.SphereGeometry(.82,14,8,0,Math.PI*2,0,Math.PI/2),L0(0x4a2f1b));hr.position.y=4.2;b.add(hr);
      [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),L0(0x1d2b53));e.position.set(s*.28,4.05,.72);b.add(e)})}
    const sp=tag(nm,tc);sp.position.y=6.2;g.add(sp);G0.add(g);
    return{g,lL,lR,tg:sp,x:0,z:0,fx:0,fz:0,tx:0,tz:0,t0:0,d:0,fall:0,pop:0,ph:Math.random()*6}};
  T.ru=mkRun(0x2fa56b,0,'Kamu','#178a55');T.bu=mkRun(0xf08a24,1,'Kak Hud-hud','#b85c0a')}

/* ---------- Gerak pelari ---------- */
function mv(u,x,z,now,d){u.fx=u.x;u.fz=u.z;u.tx=x;u.tz=z;u.t0=now;u.d=d}
function tele(u,x,z,now){u.fx=u.tx=u.x=x;u.fz=u.tz=u.z=z;u.d=0;u.fall=0;u.pop=now}
function anim(u,now,t){
  let x=u.tx,z=u.tz,y=0,k=1;const g=u.g;
  if(u.d&&now<u.t0+u.d){k=(now-u.t0)/u.d;x=u.fx+(u.tx-u.fx)*k;z=u.fz+(u.tz-u.fz)*k;y=Math.sin(Math.PI*k)*2.4}
  u.x=x;u.z=z;
  if(u.fall&&now>=u.fall){const s=(now-u.fall)/1000;y=-12*s*s;g.rotation.z=RM?0:s*5;g.visible=y>-17}
  else{g.rotation.z=0;g.visible=true;if(k>=1&&!RM)y=Math.abs(Math.sin(t*3+u.ph))*.08}
  const pp=u.pop?Math.min(1,(now-u.pop)/300):1;g.scale.setScalar(SC*(.4+.6*pp));
  g.position.set(x,.1+y,z);
  const sw=k<1&&!RM?Math.sin(k*Math.PI*3)*.7:0;u.lL.rotation.x=sw;u.lR.rotation.x=-sw}
function shards(x,z){if(RM)return;let n=0;
  for(const d of T.sh){if(n>=10)break;if(d.l>0)continue;n++;d.l=1.2;d.m.visible=true;d.m.position.set(x+(Math.random()-.5)*3,.3,z+(Math.random()-.5)*3);d.vx=(Math.random()-.5)*6;d.vy=2+Math.random()*4;d.vz=(Math.random()-.5)*6}}

/* ---------- Alur permainan ---------- */
function modal(on){$('#modal').style.display=on?'flex':'none'}
function flash(h,sm){E.c.className='';E.c.innerHTML=h;void E.c.offsetWidth;E.c.className=sm?'on sm':'on'}
function toast(h,ms){flash(h,1);clearTimeout(T.tt);T.tt=setTimeout(()=>{if(!T.cdn)E.c.className=''},ms||1000)}
/* celotehan ringan Kak Hud-hud (hanya mode lawan, paling sering tiap 9 dtk) */
function chat(m,now){if(T.tm||now<T.sayT)return;T.sayT=now+9000;toast(m,1800)}
const mark=(b,s)=>{const n=b.querySelector('i');if(n)n.textContent=s};
/* soal salah: dicatat untuk kartu akhir, diulang 3 soal lagi, dan dicatat sebagai soal lemah (mode lawan) */
const miss=q=>{
  const t=L.qkey(q);
  if(T.miss.length<8&&!T.miss.some(m=>m.k===t))T.miss.push({k:t,q:String(q.q).replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim(),a:String(q.o[q.c])});
  L.requeue(T.pool,q,3);
  if(!T.tm&&T.sv.wk.indexOf(t)<0){T.sv.wk.push(t);if(T.sv.wk.length>60)T.sv.wk.shift();persist()}};
function nextQ(){
  let i=T.pool.findIndex(x=>!x.u);
  if(i<0){T.pool=L.prio(EXM.build(),T.tm?[]:T.sv.wk,Math.random);i=T.pool.findIndex(x=>!x.u)}
  const q=T.pool[i<0?0:i];q.u=1;return q}
function intro(){
  if(open||!ready||T.on)return;
  open=true;mode='kaca';const c=$('#card'),s=T.sv;modal(true);c.scrollTop=0;
  c.innerHTML='<h2>🌉 Jembatan Kaca Ilmu</h2><div class="fc">Jembatan punya 8 petak, tiap petak 2 kaca. Soal muncul, lalu pilih kaca yang berisi <b>jawaban benar</b> untuk melangkah. Sampai seberang lebih dulu dari Kak Hud-hud!</div>'
   +`<div class="exst"><div><b>${s.win||0}</b><small>kali menang</small></div><div><b>${s.best?s.best+' dtk':'-'}</b><small>tercepat</small></div><div><b>${s.try||0}</b><small>kali main</small></div></div>`
   +'<div class="exrw"><b>💥</b><span><b>Kaca salah pecah!</b> Kamu jatuh ke awan empuk dan muncul lagi di pos aman (tiap 3 petak). Tenang, tidak sakit.</span></div>'
   +'<div class="exrw"><b>🔥</b><span><b>Beruntun 3 kali benar</b> = lompat 2 petak, dan kamu dapat <b>Intip 👁</b> (1 kali per main).</span></div>'
   +`<div class="exrw"><b>⏱</b><span>Tiap soal ada waktu ${L.QT} detik. Waktu habis tidak membuatmu jatuh, tapi kamu menunggu sebentar.</span></div>`
   +(s.bd&&s.bd.d===dstr()&&s.bd.t?`<div class="ex">⚡ Tercepat hari ini: <b>${s.bd.t} dtk</b></div>`:'')
   +'<div class="jklv" role="group" aria-label="Mode"><span>🎮 Mode:</span><button type="button" data-md="0" class="'+(T.tm?'':'on')+'" aria-pressed="'+!T.tm+'">🦉 Lawan Hud-hud</button><button type="button" data-md="1" class="'+(T.tm?'on':'')+'" aria-pressed="'+!!T.tm+'">👥 Tim gantian</button></div>'
   +'<div class="fc" id="jkmn" style="display:'+(T.tm?'block':'none')+'">Dua tim bergantian menjawab di satu layar (cocok diproyeksikan ke kelas). Tim yang sampai seberang lebih dulu menang. Batas 5 menit. Tanpa koin.</div>'
   +'<div class="jklv" id="jklr" style="display:'+(T.tm?'none':'flex')+'" role="group" aria-label="Tingkat lawan"><span>🦉 Lawan:</span>'+L.LV.map((l,k)=>`<button type="button" data-lv="${k}" class="${k===T.lv?'on':''}" aria-pressed="${k===T.lv}">${l}</button>`).join('')+`<button type="button" data-au="1" class="${s.auto!==0?'on':''}" aria-pressed="${s.auto!==0}">🤖 Otomatis</button></div>`
   +'<div class="exbt"><button class="opt go" id="jkgo" type="button">▶ Mulai</button><button class="opt" id="jkno" type="button">✖ Nanti saja</button></div>';
  const ui=()=>{
    c.querySelectorAll('[data-lv]').forEach(x=>{const on=+x.dataset.lv===T.lv;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
    c.querySelectorAll('[data-au]').forEach(x=>{const on=T.sv.auto!==0;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
    c.querySelectorAll('[data-md]').forEach(x=>{const on=+x.dataset.md===T.tm;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
    const lr=$('#jklr'),mn=$('#jkmn');if(lr)lr.style.display=T.tm?'none':'flex';if(mn)mn.style.display=T.tm?'block':'none'};
  c.querySelectorAll('[data-lv]').forEach(b=>{b.onclick=()=>{T.lv=num(b.dataset.lv,0,2,1);T.sv.lv=T.lv;T.sv.auto=0;T.sv.h=[];persist();ui()}});
  c.querySelectorAll('[data-au]').forEach(b=>{b.onclick=()=>{T.sv.auto=T.sv.auto===0?1:0;T.sv.h=[];persist();ui()}});
  c.querySelectorAll('[data-md]').forEach(b=>{b.onclick=()=>{T.tm=+b.dataset.md?1:0;ui()}});
  $('#jkgo').onclick=begin;$('#jkno').onclick=()=>{modal(false);open=false;mode=null}}
function reset(now){
  T.p=0;T.st=0;T.pkn=0;T.pkg=0;T.q=null;T.qb=null;T.nxt=0;T.fl=null;T.vd=null;T.pt=null;T.nall=0;T.nok=0;T.miss=[];T.cdn='';T.hk='';T.sx=[];T.t0=now;T.tp=now;T.qc=0;
  T.cw=0;T.cur=0;T.tw=0;T.rs=0;T.shk=0;T.sayT=0;T.rqok=0;T.tms=[null,{p:0,st:0,pkn:0,pkg:0,fl:null,pt:null,sx:[],nok:0,nall:0,cw:0,rs:0}];
  T.plan=L.plan((Math.random()*1e9)|0,T.lv);T.bfin=L.fin(T.plan);T.bi=0;T.bp=0;T.ph='play';
  [T.gl.p,T.gl.b].forEach(a=>a.forEach(r=>r.forEach(m=>setG(m,0))));
  T.ov.forEach(o=>{o.visible=false});T.sh.forEach(d=>{d.l=0;d.m.visible=false});
  tele(T.ru,PX,zp(0),now);tele(T.bu,PXB,zp(0),now);T.cz=zp(0);
  E.q.className='';E.q.innerHTML='';E.c.className=''}
function begin(){
  mk();labels();
  T.org={bg:S.background,fc:S.fog.color.getHex(),fn:S.fog.near,ff:S.fog.far,fov:cam.fov};
  T.o={x:pl.x,y:pl.y,z:pl.z,yaw:pl.yaw};
  T.G.visible=true;T.on=true;open=true;mode='kaca';document.body.classList.add('jki');P.visible=false;
  S.background=new THREE.Color(0xa8dcff);S.fog.color.setHex(0xa8dcff);S.fog.near=90;S.fog.far=380;cam.fov=55;cam.updateProjectionMatrix();
  pl.x=0;pl.y=0;pl.z=TZ;pl.yaw=0;pl.vy=0;
  T.sv.try=(T.sv.try||0)+1;persist();
  reset(performance.now());modal(false)}
function qreset(){T.qc=0;clearTimeout(qT);E.x.textContent='✖';E.x.setAttribute('aria-label','Keluar dari Jembatan Kaca')}
function leave(){
  const was=T.on;qreset();T.on=false;T.ph='idle';clearTimeout(T.tt);
  E.c.className='';E.q.className='';E.q.innerHTML='';T.qb=null;
  if(was){
    const o=T.org;if(o){S.background=o.bg;S.fog.color.setHex(o.fc);S.fog.near=o.fn;S.fog.far=o.ff;cam.fov=o.fov;cam.updateProjectionMatrix()}
    if(T.G)T.G.visible=false;P.visible=true;
    if(T.o){pl.x=T.o.x;pl.y=0;pl.z=T.o.z;pl.yaw=T.o.yaw}pl.vy=0}
  document.body.classList.remove('jki');modal(false);open=false;mode=null}
function quit(){if(!T.on)return;
  if(T.ph!=='play'||T.qc){qreset();leave();return}
  T.qc=1;E.x.textContent='Keluar? Ketuk lagi';E.x.setAttribute('aria-label','Ketuk sekali lagi untuk keluar');
  qT=setTimeout(qreset,3200)}
function ask(){
  if(T.rs){respawn(performance.now());T.rs=0}
  const q=T.q=nextQ(),pr=T.pr=L.pair(q,Math.random);q.done=false;T.qs=performance.now();
  T.op=pr.o.map(i=>q.o[i]);
  E.q.className='on';
  E.q.innerHTML=(T.tm?`<span class="jktn t${T.cur}">${T.cur?'🟠 Giliran: Tim Jingga':'🟢 Giliran: Tim Hijau'}</span>`:'')+(q.rq?'<small class="jkrq">🔁 Soal ulang. Kamu pasti bisa!</small>':'')+`<div class="jkqt" aria-hidden="true"><i></i></div><div class="jkq1">${q.sp?'<button class="jksp" type="button" aria-label="Dengarkan">🔊</button>':''}${q.q}</div><div class="jko">`
   +T.op.map((x,k)=>`<button type="button" data-i="${k}" class="${ARX.test(x)?'ar':''}"><i aria-hidden="true">${k?'2 ▶':'◀ 1'}</i><span>${x}</span></button>`).join('')+'</div><div class="jkf" role="status" aria-live="polite"></div>'
   +(T.pkn>0?'<button class="jkpk" type="button" data-pk="1">👁 Intip kaca</button>':'');
  T.qb=E.q.querySelector('.jkqt i');
  [0,1].forEach(s=>{const o=T.ov[s];o.visible=true;o.position.set(BX()+(s?COL:-COL),.2,zg(T.p));paint(o,T.op[s],0)});
  if(q.q.indexOf('🎧')>=0&&q.sp)say(q.sp)}
function pick(i){
  const q=T.q,now=performance.now();
  if(!q||q.done||T.ph!=='play'||T.fl||T.vd||now-T.t0<CD*1000||now-T.qs<TAPG)return;
  q.done=true;T.nall++;
  const pr=T.pr,ok=i===pr.side,r=L.resolve(T.p,T.st,ok),k=T.p;
  E.q.querySelectorAll('button[data-i]').forEach(b=>{b.disabled=true;const j=+b.dataset.i;if(j===pr.side){b.classList.add('ok');mark(b,'✔')}else if(j===i){b.classList.add('no');mark(b,'✖')}});
  const pk=E.q.querySelector('.jkpk');if(pk&&pk.remove)pk.remove();
  const f=E.q.querySelector('.jkf');
  paint(T.ov[i],T.op[i],ok?1:2);if(!ok)paint(T.ov[pr.side],T.op[pr.side],1);
  if(ok){
    T.nok++;T.st=r.st;T.p=r.p;T.cw=0;setG(GL()[k][i],1);T.sx[k+1]=i;
    if(q.rq)T.rqok++;
    if(!T.tm){const ix=T.sv.wk.indexOf(L.qkey(q));if(ix>=0){T.sv.wk.splice(ix,1);persist()}}
    if(r.jump>1&&k+1<N){const s2=Math.random()<.5?0:1;setG(GL()[k+1][s2],1);T.sx[k+2]=s2}
    if(!T.tm){coins+=2*r.jump;hud();if(k<=T.bp&&T.p>T.bp)chat('🦉 Wah, kamu cepat sekali!',now)}
    if(T.tm&&T.p>=N)T.tw=T.cur+1;
    mv(RU(),sxOf(BX(),T.p,T.sx),zp(T.p),now,r.jump>1?650:450);
    snd(988,.12,'triangle');vib(r.jump>1?[20,30,40]:20);
    let m='<b style="color:#14744b">✔ <span class="ar" lang="ar">أَحْسَنْتَ</span> Maju! '+(r.jump>1?'Lompat 2 petak 💪💪':'+1 petak 💪')+'</b>';
    if(r.jump>1){snd(1319,.14,'triangle');toast('🔥 Beruntun x'+r.st+'!')}
    if(r.st===3&&!T.pkg){T.pkg=1;T.pkn=1;m+=' <b>👁 Kamu dapat Intip!</b>'}
    if(f)f.innerHTML=m;
    if(T.p>=N&&T.pt===null)T.pt=now-T.t0-CD*1000;
    T.nxt=now+(T.p>=N?0:850)}
  else{
    T.st=0;T.cw++;miss(q);T.p=r.p;setG(GL()[k][i],2);shards(BX()+(i?COL:-COL),zg(k));T.shk=now+300;
    const fm=L.fallFor(T.cw);
    mv(RU(),BX()+(i?COL:-COL),zg(k),now,250);RU().fall=now+250;
    if(T.tm)T.rs=1;else T.fl={until:now+fm};
    if(f)f.innerHTML='<b style="color:#b8352b">💥 Kacanya pecah!</b> <span class="ex">💡 '+(q.ex||'')+'</span>'+(T.cw>=2&&!T.tm?' <b style="color:#b8352b">⏳ Jeda lebih lama karena salah beruntun. Baca dulu, jangan menebak ya.</b>':'');
    snd(180,.25,'sawtooth');vib([60,40]);T.nxt=now+(T.tm?2800:fm+500)}}
function tmo(){
  const q=T.q;if(!q||q.done)return;q.done=true;T.st=0;T.nall++;miss(q);
  E.q.querySelectorAll('button[data-i]').forEach(b=>{b.disabled=true;if(+b.dataset.i===T.pr.side){b.classList.add('ok');mark(b,'✔')}});
  const pk=E.q.querySelector('.jkpk');if(pk&&pk.remove)pk.remove();
  paint(T.ov[T.pr.side],T.op[T.pr.side],1);
  const f=E.q.querySelector('.jkf');if(f)f.innerHTML='<b style="color:#b8352b">⏰ Waktu habis.</b> <span class="ex">💡 '+(q.ex||'')+'</span>';
  snd(180,.25,'sawtooth');vib([60,40]);T.nxt=performance.now()+2200+(q.ex?800:0)}
function usePeek(){
  const q=T.q;if(!q||q.done||T.pkn<=0)return;T.pkn--;const s=T.pr.side;
  paint(T.ov[s],T.op[s],3);snd(1175,.15,'triangle');
  const b=E.q.querySelector('button[data-i="'+s+'"]');if(b)b.classList.add('pk');
  const pk=E.q.querySelector('.jkpk');if(pk&&pk.remove)pk.remove();
  setTimeout(()=>{if(T.on&&T.q===q&&!q.done){paint(T.ov[s],T.op[s],0);if(b)b.classList.remove('pk')}},1000)}
function respawn(now){
  T.fl=null;tele(RU(),sxOf(BX(),T.p,T.sx),zp(T.p),now);
  for(let k=T.p;k<N;k++){setG(GL()[k][0],0);setG(GL()[k][1],0)}
  T.ov.forEach(o=>{o.visible=false});toast('🔧 Jembatan dipulihkan')}
function botStep(ms,now){
  while(T.bi+1<T.plan.length&&T.plan[T.bi+1].t<=ms){
    const e=T.plan[++T.bi],bu=T.bu,x=PXB+(e.s?COL:-COL),was=T.bp;
    if(e.k>=0){
      if(e.f){setG(T.gl.b[e.k][e.s],2);shards(x,zg(e.k));mv(bu,x,zg(e.k),now,250);bu.fall=now+250;chat('🦉 Aduh, kacaku pecah!',now)}
      else{setG(T.gl.b[e.k][e.s],1);mv(bu,e.p>=N?PXB:x,zp(e.p),now,450)}}
    else{for(let k=e.p;k<N;k++){setG(T.gl.b[k][0],0);setG(T.gl.b[k][1],0)}tele(bu,PXB,zp(e.p),now)}
    T.bp=e.p;if(e.k>=0&&!e.f&&was<=T.p&&e.p>T.p)chat('🦉 Aku di depan! Ayo kejar!',now)}}
const team=i=>i===T.cur?T:T.tms[i];
function finishTeam(v){
  const card=$('#card');modal(true);card.scrollTop=0;
  const ttl=v.win==='a'?'🟢 Tim Hijau menang!':v.win==='b'?'🟠 Tim Jingga menang!':'🤝 Seri!';
  const t0=team(0),t1=team(1),pc=t=>t.nall?Math.round(t.nok*100/t.nall)+'%':'-';
  const rvw=T.miss.length?`<div class="jkcol" style="border-color:#c62f26"><b style="color:#c62f26">📝 Perlu dibahas bersama</b>${T.miss.slice(0,5).map(m=>`<span>${esc(m.q)} → <b${ARX.test(m.a)?' class="ar" lang="ar"':''}>${esc(m.a)}</b></span>`).join('')}${T.miss.length>5?`<span style="opacity:.7">dan ${T.miss.length-5} soal lain</span>`:''}</div>`:'';
  card.innerHTML=`<h2>${ttl}</h2>`+(v.win?'<div class="ar center" lang="ar" style="font-size:34px;line-height:1.5">أَحْسَنْتُمْ! مَبْرُوكٌ</div>':'')
   +`<div class="exst"><div><b>${t0.p}/${N}</b><small>🟢 Hijau (${pc(t0)})</small></div><div><b>${t1.p}/${N}</b><small>🟠 Jingga (${pc(t1)})</small></div></div>`
   +rvw+'<div class="fc">Beri tepuk tangan untuk kedua tim! Bahas soal yang salah bersama-sama.</div>'
   +'<div class="exbt"><button class="opt go" id="jkag" type="button">🔁 Main lagi</button><button class="opt" id="jkcl" type="button">✖ Tutup</button></div>';
  $('#jkag').onclick=()=>{modal(false);reset(performance.now())};
  $('#jkcl').onclick=leave;
  if(v.win){vib([40,40,40,40,120]);confetti();[523,659,784,1047].forEach((f,k)=>setTimeout(()=>snd(f,.2,'triangle'),k*120))}}
function finish(v){
  T.ph='end';T.q=null;T.qb=null;E.q.className='';E.q.innerHTML='';E.c.className='';T.ov.forEach(o=>{o.visible=false});
  if(T.tm){finishTeam(v);return}
  const won=v.win==='p',draw=v.win==='',s=T.sv,first=s.d!==dstr();let b=10;
  const secs=T.pt===null?null:Math.round(T.pt/100)/10,old=s.best||0,rec=won&&secs!==null&&(old===0||secs<old);
  const bd0=s.bd&&s.bd.d===dstr()?s.bd.t:0,recD=won&&secs!==null&&(!bd0||secs<bd0);
  if(recD)s.bd={d:dstr(),t:secs};
  if(won){b=40;if(first){b+=60;s.d=dstr()}s.win=(s.win||0)+1;if(rec)s.best=secs}
  /* lawan otomatis: 2 menang beruntun naik, 2 kalah beruntun turun */
  let adp='';
  if(s.auto!==0&&!draw){const a=L.adapt(T.lv,s.h,won?'w':'l');s.h=a.h;
    if(a.lv!==T.lv){adp=`<div class="ex">🦉 Lawan ${a.lv>T.lv?'naik':'turun'} ke tingkat <b>${L.LV[a.lv]}</b> untuk permainan berikutnya.</div>`;T.lv=a.lv;s.lv=a.lv}}
  persist();coins+=b;hud();
  const card=$('#card');modal(true);card.scrollTop=0;
  const ttl=won?'🏆 Kamu sampai lebih dulu!':draw?'🤝 Seri!':'🦉 Kak Hud-hud lebih dulu';
  const rvw=T.miss.length?`<div class="jkcol" style="border-color:#c62f26"><b style="color:#c62f26">📝 Perlu diulang</b>${T.miss.slice(0,5).map(m=>`<span>${esc(m.q)} → <b${ARX.test(m.a)?' class="ar" lang="ar"':''}>${esc(m.a)}</b></span>`).join('')}${T.miss.length>5?`<span style="opacity:.7">dan ${T.miss.length-5} soal lain</span>`:''}</div>`:'';
  card.innerHTML=`<h2>${ttl}</h2>`+(won?'<div class="ar center" lang="ar" style="font-size:34px;line-height:1.5">أَحْسَنْتَ! مَبْرُوكٌ</div>':'')
   +`<div class="exst"><div><b>${T.p}/${N}</b><small>petakmu</small></div><div><b>${T.bp}/${N}</b><small>🦉 Hud-hud</small></div><div><b>${secs===null?'-':secs+' dtk'}</b><small>waktumu</small></div></div>`
   +(rec?`<div class="ex">🎉 <b>Rekor baru!</b> ${secs} dtk${old?' (sebelumnya '+old+' dtk)':''}.</div>`:recD?`<div class="ex">⚡ <b>Tercepat hari ini!</b> ${secs} dtk.</div>`:'')
   +(T.rqok?`<div class="ex">🔁 Soal ulang yang berhasil kamu jawab: <b>${T.rqok}</b></div>`:'')+adp
   +`<div class="ex">🪙 +${b+T.nok*2} koin (${T.nok*2} dari jawaban benar${won&&first?', termasuk bonus menang pertama hari ini':''})</div>`
   +(T.nall?`<div class="ex">🎯 Ketepatan: ${T.nok} dari ${T.nall} soal (${Math.round(T.nok*100/T.nall)}%)</div>`:'')
   +rvw+(won?'':'<div class="fc">Tidak apa-apa! Perhatikan pembahasan setiap soal, lalu coba lagi.</div>')
   +'<div class="exbt"><button class="opt go" id="jkag" type="button">🔁 Main lagi</button><button class="opt" id="jkcl" type="button">✖ Tutup</button></div>';
  $('#jkag').onclick=()=>{modal(false);reset(performance.now())};
  $('#jkcl').onclick=leave;
  if(won||rec){vib([40,40,40,40,120]);confetti();[523,659,784,1047].forEach((f,k)=>setTimeout(()=>snd(f,.2,'triangle'),k*120))}}

/* ---------- Per-frame ---------- */
function hudUpd(ms,el){
  const D=dur(),left=el<0?D:Math.max(0,Math.ceil(D-ms/1000)),sg=left+'|'+T.p+'|'+T.bp+'|'+T.st+'|'+T.pkn+'|'+T.cur+'|'+T.tm;if(sg===T.hk)return;T.hk=sg;
  const a=pos(0),b=pos(1);
  E.t.textContent='⏱ '+fmt(left)+(T.st>0?' 🔥'+T.st:'')+(T.pkn>0?' 👁':'')+(T.tm?(T.cur?' 🟠':' 🟢'):'');
  E.a.textContent=(T.tm?'🟢 ':'🧒 ')+a+'/'+N;E.d.textContent=(T.tm?'🟠 ':'🦉 ')+b+'/'+N;
  E.m1.style.left=(a/N*100)+'%';E.m2.style.left=(b/N*100)+'%';
  E.a.setAttribute('aria-label',(T.tm?'Tim Hijau':'Kamu')+' di petak '+a+' dari '+N);E.d.setAttribute('aria-label',(T.tm?'Tim Jingga':'Kak Hud-hud')+' di petak '+b+' dari '+N)}
function tick(now){
  const el=(now-T.t0)/1000-CD,ms=Math.max(0,now-T.t0-CD*1000);
  if(T.ph==='play'){
    const s=el<0?String(Math.ceil(-el)):(el<.9?'MULAI!':'');
    if(s!==T.cdn){T.cdn=s;if(s){flash(s+(el<0?'<small>Pilih kaca yang benar!</small>':''),0);snd(el<0?440:880,.12,'triangle')}else E.c.className=''}
    if(el>=0){
      if(!T.tm)botStep(ms,now);
      if(!T.vd){
        if(T.fl){if(now>=T.fl.until)respawn(now)}
        else{
          if(T.q&&T.q.done&&now>=T.nxt){T.q=null;if(T.tm&&!T.tw){swapTeam();toast(T.cur?'🟠 Giliran Tim Jingga':'🟢 Giliran Tim Hijau',1200)}}
          if(!T.q&&now>=T.nxt&&T.p<N)ask();
          if(T.q&&!T.q.done){const r=1-(now-T.qs)/(L.QT*1000);
            if(T.qb){T.qb.style.transform='scaleX('+Math.max(0,r).toFixed(3)+')';T.qb.parentNode.classList.toggle('lo',r<.3)}
            if(r<=0)tmo()}}
        const v=T.tm?L.tverdict(T.tw,pos(0),pos(1),ms,DURT):L.verdict(T.pt,T.bfin,T.p,T.bp,ms);
        if(v.ended){const keep=T.tm?!!T.tw:(v.win==='p'&&T.p>=N);
          T.vd=v;T.endAt=now+(keep?900:700);if(!keep){E.q.className='';E.q.innerHTML='';T.q=null;T.qb=null;T.ov.forEach(o=>{o.visible=false})}}}
      if(T.vd&&now>=T.endAt){finish(T.vd);return}}}
  hudUpd(ms,el)}
function frame(){
  const now=performance.now(),dt=Math.min(.05,Math.max(0,(now-T.tp)/1000)),t=now/1000;T.tp=now;
  tick(now);
  anim(T.ru,now,t);anim(T.bu,now,t);
  for(const d of T.sh){if(d.l<=0)continue;d.l-=dt;d.vy-=14*dt;d.m.position.x+=d.vx*dt;d.m.position.y+=d.vy*dt;d.m.position.z+=d.vz*dt;if(d.l<=0||d.m.position.y<-17){d.l=0;d.m.visible=false}}
  T.cl.forEach((g,i)=>{g.position.x+=Math.sin(t*.2+i)*.012});
  const zt=zp(T.p)*.75+zp(T.bp)*.25,sh=innerHeight<520;T.cz+=(zt-T.cz)*Math.min(1,dt*(RM?30:3));
  cam.position.set(RM?0:Math.sin(t*.3)*1.2,sh?10:12.5,T.cz+(sh?10:15));
  if(T.shk>now&&!RM){const k=(T.shk-now)/300*.7;cam.position.x+=(Math.random()-.5)*k;cam.position.y+=(Math.random()-.5)*k}
  cam.lookAt(0,sh?-1.5:0,T.cz-(sh?3:7));
  P.position.set(pl.x,pl.y,pl.z)}
const R0=R.render;
R.render=function(s,c){
  if(T.on&&s===S){try{frame()}catch(e){console.warn('kaca',e);try{leave()}catch(_){}try{ts('⚠️ Jembatan Kaca error: '+e.message,4500)}catch(_){}}}
  return R0.call(R,s,c)};

/* ---------- Tombol & input ---------- */
{
  const b=document.createElement('button');b.className='pill mx';b.id='jkbtn';b.type='button';b.title='Jembatan Kaca Ilmu';b.setAttribute('aria-label','Jembatan Kaca Ilmu: pilih kaca dengan jawaban benar untuk menyeberang');
  b.innerHTML='<span aria-hidden="true">🌉</span><span class="lb" aria-hidden="true">Kaca</span>';
  const st=$('#stat'),ref=$('#ttb')||$('#arb')||$('#exb');if(ref&&ref.after)ref.after(b);else if(st)st.appendChild(b);
  b.onclick=()=>{
    if(open||!ready)return;
    if(typeof RID!=='undefined'&&RID){ts('🚲 Turun dulu dari kendaraan (F), lalu masuk arena.',2200);return}
    if(typeof CV!=='undefined'&&CV)return;
    if(typeof INTR!=='undefined'&&INTR&&INTR.on){ts('🚪 Keluar dulu dari bangunan, lalu masuk arena.',2200);return}
    intro()}}
E.x.onclick=quit;
E.q.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.classList.contains('jksp')){if(T.q&&T.q.sp)say(T.q.sp);return}
  if(b.dataset.pk){usePeek();return}
  if(b.dataset.i!=null)pick(+b.dataset.i)});
addEventListener('keydown',e=>{
  if(!T.on||T.ph!=='play'||e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.key==='1'||e.key==='ArrowLeft')pick(0);else if(e.key==='2'||e.key==='ArrowRight')pick(1);else if(e.key==='Escape')quit()});

window.JKI={start:intro,begin,leave,pick,usePeek,state:T};
})();
