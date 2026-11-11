/* === BAGIAN 31 (v4): Arena Lampu Ilmu — Lomba Pasangan Kata, 2–8 pemain ===
   Menggantikan v2 (lampu hijau/merah). Riwayat lama ada di git. Pasangan: css/arena.css (tidak dipakai lagi; CSS baru ada di dalam berkas ini).
   Aturan: tiap ronde (4,6 dtk) muncul pasangan Arab–Indonesia. Pasangan BENAR = boleh maju (tahan LARI). Pasangan SALAH = harus diam;
   kalau tetap bergerak setelah jeda 0,9 dtk -> terpeleset ke pos terakhir, -1 hati. Pasangan sama untuk semua pemain (dari seed + jam server).
   Jalur 260 m, 3 pos (25/50/75%) sebagai titik kembali. Hati 3; habis = tersingkir (menonton). Selesai: peringkat + bonus koin.
   Mode (dipilih di lobi): "solo" = tiap pemain lomba sendiri (2-8 orang); "duo" = berpasangan, tim 2 orang (4/6/8 pemain, genap).
   Tim duo = pemain urutan 1-2, 3-4, dst (urutan id perangkat, sama di semua layar); skor tim = rata-rata jarak; tim selesai bila kedua anggota sampai finis (waktu = yang terakhir).
   Bareng: ruang = kelas dari akhir nama + nomor Regu (1-6), Firebase REST + EventSource (seperti js/28 & js/32), maks 8 pemain per regu, min 2.
   Data: /lampu/<ruang>/m = {id,t,seed,pl:[id-perangkat],md:'solo'|'duo'} dan /lampu/<ruang>/p/<id-perangkat> = {n,z(dm),h,f(dtk*10),mid,t,off}.
   Tanpa internet / sendirian: tombol "Latihan sendiri". Aturan Firebase: lihat blok "lampu" (isi bebas seperti /tali).
   Kembali ke tampilan lama: kembalikan berkas ini dari riwayat git. */
(function(){
'use strict';
if(window.ARN)return;
if(typeof THREE==='undefined'||typeof S==='undefined'||typeof R==='undefined'||typeof P==='undefined'||typeof pl==='undefined'||typeof cam==='undefined'||typeof D==='undefined'){console.warn('Arena: modul pendukung belum siap');return}
const DB='https://miku-profesi-default-rtdb.asia-southeast1.firebasedatabase.app';
const AZ=-1800,LEN=260,LW=2.6,SP=6.2,CD=4,RD=4.6,SHOW=3.8,GR=.9,DUR=300,STALE=20000,BEAT=5000,MAXP=8,STUN=1.3;
const LC=['#e0524a','#3d82e0','#2fa56b','#e0a43a','#9b6bd6','#2fb5b0','#e86ca0','#6b7a4a'],LH=[0xe0524a,0x3d82e0,0x2fa56b,0xe0a43a,0x9b6bd6,0x2fb5b0,0xe86ca0,0x6b7a4a];
const SVT={'.sv':'timestamp'},RM=matchMedia('(prefers-reduced-motion:reduce)').matches,ARX=/[\u0600-\u06FF]/;
const SKA=SK+':arena';
const jp=t=>{try{return JSON.parse(t)}catch(e){return null}};
const num=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):(d||0)};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
const dm=c=>!!(c&&c.m&&c.m.md==='duo'),ci=(c,i)=>dm(c)?i>>1:i;
let dev=null;try{dev=localStorage.getItem('kp.dev')}catch(e){}
if(!dev){dev=Math.random().toString(36).slice(2,10);try{localStorage.setItem('kp.dev',dev)}catch(e){}}
const NMX=()=>{try{return String(typeof NM!=='undefined'?NM:'').trim()}catch(e){return ''}};
const nm=()=>NMX().replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,14)||'Teman';
const roomOf=n=>{const m=n.match(/(?:^|\s)(\d{1,2})\s*([A-Za-z])?\s*$/);return m?(m[1]+(m[2]||'')).toLowerCase():'umum'};

/* ---------- Kosakata & pasangan (deterministik dari seed + nomor ronde) ---------- */
const VOC=[];{const seen=new Set(),add=(a,b)=>{if(a&&b&&!seen.has(b)){seen.add(b);VOC.push([a,b])}};
 D.forEach(d=>add(d.ar,d.id));[typeof KWP!=='undefined'?KWP:[],typeof KWO!=='undefined'?KWO:[],typeof PN!=='undefined'?PN:[],typeof QW!=='undefined'?QW:[]].forEach(l=>l.forEach(x=>add(x[0],x[1])))}
const hs=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const rng=s=>{let a=hs(s);return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
function pairAt(seed,r){const g=rng(seed+'|'+r),n=VOC.length,i=(g()*n)|0,ok=g()<.55;let j=(g()*n)|0;if(j===i)j=(j+1)%n;
 return{a:VOC[i][0],b:VOC[ok?i:j][1],ok,ta:VOC[i][1]}}

/* ---------- Status ---------- */
const T={on:false,built:false,ph:'idle',room:'',tree:{},off:0,offOk:false,net:false,es:null,ct:0,joined:false,mid:'',c:null,hb:0,zs:0,tp:0,rd:-9,pr:null,rv:0,lane:0,ck:'',qc:0,G:null,rn:[],crowd:[],cl:[],board:null,head:null,org:null,o:null,shake:0,regu:1,cheer:0,solo:false,md:'solo',sv:{try:0,win:0,best:0,bt:0,d:'',regu:1}};
const L={z:0,v:0,h:3,cp:0,st:0,f:0,run:false,kd:false,miss:[]};
try{Object.assign(T.sv,JSON.parse(lsg(SKA)||'{}'))}catch(e){}
const persist=()=>{try{lss(SKA,JSON.stringify(T.sv))}catch(e){}};
const nowS=()=>Date.now()-(T.off||0);
const E={};let qT=0;

/* ---------- Logika murni: data ruang -> keadaan pertandingan ---------- */
function calc(tr,now){
  const m=tr&&tr.m&&typeof tr.m==='object'?tr.m:null,pp=tr&&tr.p&&typeof tr.p==='object'?tr.p:{};
  const act=Object.keys(pp).filter(k=>{const d=pp[k];return d&&typeof d==='object'&&!d.off&&now-num(d.t,0,9e15,0)<=STALE}).sort();
  const r={m,pp,act,ids:[],el:-1,rd:-1,rt:0,ended:false};
  if(m){
    r.ids=Array.isArray(m.pl)?m.pl.slice(0,MAXP):[];r.el=(now-num(m.t,0,9e15,0))/1000-CD;
    if(r.el>=0){r.rd=Math.floor(r.el/RD);r.rt=r.el-r.rd*RD}
    const live=r.ids.filter(k=>{const d=pp[k];return d&&d.mid===m.id&&!d.off&&now-num(d.t,0,9e15,0)<=STALE&&!num(d.f,0,99999,0)&&num(d.h,0,3,3)>0});
    r.ended=r.el>=DUR||(r.el>3&&live.length===0)}
  return r}

/* ---------- Elemen layar ---------- */
(function(){
  const css=document.createElement('style');css.textContent=`
#lph,#lpb,#lprun,#lpc{display:none}
body.lpa #lph{display:flex}body.lpa #lpb{display:block}body.lpa.lpr #lprun{display:flex}
body.lpa .hud,body.lpa #js,body.lpa #rbar{display:none!important}
#lph{position:fixed;left:0;right:0;top:0;z-index:5;gap:8px;align-items:center;pointer-events:none;padding:calc(8px + env(safe-area-inset-top,0px)) calc(10px + env(safe-area-inset-right,0px)) 0 calc(10px + env(safe-area-inset-left,0px))}
.lpp{font:700 15px/1 "Baloo 2",system-ui,sans-serif;background:#fffaf0;color:#1d2b53;border:3px solid #1d2b53;border-radius:999px;padding:7px 12px;pointer-events:auto;white-space:nowrap}
button.lpp{cursor:pointer;min-width:44px;min-height:44px;padding:4px 12px}
.lpbar{flex:1;height:22px;border:3px solid #1d2b53;border-radius:999px;position:relative;background:linear-gradient(90deg,#e9d9a6,#f4e8c0);overflow:visible}
.lpbar .d{position:absolute;top:-2px;width:14px;height:14px;margin-left:-7px;border:3px solid #1d2b53;border-radius:50%;transition:left .3s}
.lpbar .d.me{width:24px;height:24px;margin-left:-12px;top:-7px;box-shadow:0 0 0 3px #ffcf3f;z-index:2}
.lpbar .fl{position:absolute;right:-6px;top:-12px;font-size:22px}
#lpb{position:fixed;left:50%;transform:translateX(-50%);top:calc(64px + env(safe-area-inset-top,0px));z-index:5;width:min(92vw,560px);pointer-events:none;text-align:center;font-family:"Baloo 2",system-ui,sans-serif}
#lpb .w{display:flex;align-items:center;justify-content:center;gap:10px;background:#1d2b53;border:4px solid #fffaf0;border-radius:22px;padding:8px 12px;box-shadow:0 4px 0 rgba(0,0,0,.25)}
#lpb.ok .w{background:#178a55}#lpb.no .w{background:#c62f26}
#lpb .c{flex:1;background:#fffaf0;color:#1d2b53;border-radius:14px;padding:6px 8px;font-weight:700;font-size:clamp(16px,3.6vw,24px);line-height:1.25;min-height:54px;display:grid;place-items:center}
#lpb .c.a{font-family:Amiri,"Noto Naskh Arabic",serif;font-size:clamp(26px,6vw,40px);direction:rtl}
#lpb .e{font-size:clamp(24px,5vw,34px);font-weight:800;color:#fff}
#lpb .m{margin-top:6px;display:inline-block;background:#fffaf0;color:#1d2b53;border:3px solid #1d2b53;border-radius:999px;padding:4px 12px;font-weight:700;font-size:clamp(13px,2.8vw,16px)}
#lpb .t{height:8px;margin:6px 14px 0;background:rgba(29,43,83,.35);border-radius:6px;overflow:hidden}#lpb .t i{display:block;height:100%;background:#ffcf3f;transform-origin:left;transform:scaleX(1)}
#lprun{position:fixed;right:calc(14px + env(safe-area-inset-right,0px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:6;width:118px;height:118px;border-radius:50%;border:5px solid #1d2b53;background:#ffcf3f;color:#1d2b53;flex-direction:column;align-items:center;justify-content:center;font:800 20px/1 "Baloo 2",system-ui,sans-serif;touch-action:none;user-select:none;-webkit-user-select:none;cursor:pointer}
#lprun span{font-size:34px}#lprun small{font-size:11px;font-weight:600}#lprun.on{background:#2fa56b;color:#fff;transform:scale(.94)}
#lpc{position:fixed;inset:0;z-index:7;align-items:center;justify-content:center;pointer-events:none;text-align:center;font:800 min(20vw,130px)/1.05 "Baloo 2",system-ui,sans-serif;color:#fff;-webkit-text-stroke:6px #1d2b53;paint-order:stroke fill}
#lpc.on{display:flex;flex-direction:column;animation:lppop .45s ease-out}#lpc.sm{font-size:min(9vw,52px)}
#lpc small{font-size:.4em;-webkit-text-stroke:3px #1d2b53;margin-top:.3em}
@keyframes lppop{from{transform:scale(1.5);opacity:0}to{transform:scale(1);opacity:1}}
.lpl{display:flex;align-items:center;gap:8px;font:700 16px "Baloo 2",system-ui,sans-serif;padding:4px 0}.lpl i{width:16px;height:16px;border-radius:50%;border:3px solid #1d2b53;flex:none}
.lpk{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.lpk button{min-width:44px;min-height:44px;border:3px solid #1d2b53;border-radius:12px;background:#fff;font:800 16px "Baloo 2",system-ui,sans-serif;cursor:pointer;padding:4px 12px}.lpk button.on{background:#ffcf3f}
@media (max-height:420px){#lpb{top:calc(54px + env(safe-area-inset-top,0px))}#lpb .c{min-height:40px}#lprun{width:96px;height:96px}.lpp{padding:5px 9px;font-size:14px}}
@media (prefers-reduced-motion:reduce){#lpc.on{animation:none}.lpbar .d{transition:none}}`;
  document.head.appendChild(css);
  const w=document.createElement('div');
  w.innerHTML='<div id="lph"><div class="lpp" id="lphe">❤️❤️❤️</div><div class="lpbar" aria-hidden="true" id="lpbar"><span class="fl">🏁</span></div><div class="lpp" id="lpt">⏱ 5:00</div><button class="lpp" id="lpx" type="button" aria-label="Keluar dari arena">✖</button></div>'
   +'<div id="lpb" role="status" aria-live="polite"></div>'
   +'<button id="lprun" type="button" aria-label="Tahan untuk lari"><span aria-hidden="true">🏃</span><b>LARI</b><small>tahan · Spasi / W</small></button><div id="lpc" aria-hidden="true"></div>';
  while(w.firstChild)document.body.appendChild(w.firstChild);
  E.he=$('#lphe');E.bar=$('#lpbar');E.t=$('#lpt');E.x=$('#lpx');E.b=$('#lpb');E.run=$('#lprun');E.c=$('#lpc');
  if(matchMedia('(pointer:coarse)').matches){const s=E.run.querySelector('small');if(s)s.textContent='tahan untuk lari'}})();
const hearts=()=>'❤️'.repeat(Math.max(0,L.h))+'🖤'.repeat(Math.max(0,3-L.h));
let fT=0;function flash(h,sm){clearTimeout(fT);E.c.className='';E.c.innerHTML=h;void E.c.offsetWidth;E.c.className=sm?'on sm':'on';if(sm)fT=setTimeout(()=>{E.c.className=''},1400)}

/* ---------- Gambar papan (kanvas) ---------- */
const fnt=(ar,s)=>ar?`700 ${s}px Amiri,"Noto Naskh Arabic",serif`:`700 ${s}px "Baloo 2",system-ui,sans-serif`;
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function fit(g,t,ar,s,mw){while(s>22){g.font=fnt(ar,s);if(g.measureText(t).width<=mw)break;s-=4}g.font=fnt(ar,s)}
function mkSign(w,h,cw,ch,draw){const c=document.createElement('canvas');c.width=cw;c.height=ch;const g=c.getContext('2d'),tx=new THREE.CanvasTexture(c);tx.anisotropy=4;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx,toneMapped:false,fog:false}));
  const f=()=>{draw(g,cw,ch);tx.needsUpdate=true};f();return{m,f}}
function drawBoard(g,w,h){
  const pr=T.pr,rv=T.rv;g.fillStyle='#5a3a1c';g.fillRect(0,0,w,h);g.fillStyle=rv>0?'#178a55':rv<0?'#c62f26':'#1d2b53';rr(g,14,14,w-28,h-28,44);g.fill();
  g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';
  if(!pr){g.font=fnt(0,110);g.fillText('Bersiap…',w/2,h/2);return}
  [[40,0],[w/2+60,1]].forEach(([x,k])=>{g.fillStyle='#fffaf0';rr(g,x,54,w/2-100,h-150,28);g.fill();g.fillStyle='#1d2b53';
    if(k==0){g.direction='rtl';fit(g,pr.a,1,150,w/2-130)}else{g.direction='ltr';fit(g,pr.b,0,84,w/2-130)}
    g.fillText(k?pr.b:pr.a,x+(w/2-100)/2,54+(h-150)/2)});
  g.direction='ltr';g.fillStyle='#fff';g.font=fnt(0,130);g.fillText(rv>0?'=':rv<0?'≠':'?',w/2,h*.4);
  g.font=fnt(0,56);g.fillText(rv>0?'✔ BENAR — MAJU!':rv<0?'✖ SALAH — DIAM!':'Cocokkah? Benar: LARI · Salah: DIAM',w/2,h-52)}
function drawGate(i){return(g,w,h)=>{g.fillStyle=LC[i%8];g.fillRect(0,0,w,h);g.fillStyle='#fffdf5';g.strokeStyle='#1d2b53';g.lineWidth=8;rr(g,14,14,w-28,h-28,26);g.fill();g.stroke();
  g.fillStyle='#1d2b53';g.textAlign='center';g.textBaseline='middle';g.direction='rtl';g.font=fnt(1,84);g.fillText('مَحَطَّةٌ',w/2,h*.38);g.direction='ltr';g.font=fnt(0,52);g.fillText('Pos '+(i+1)+'/3 · titik aman',w/2,h*.74)}}
const drawTxt=(a,b,col)=>(g,w,h)=>{g.fillStyle=col;g.fillRect(0,0,w,h);g.fillStyle='#fffdf5';rr(g,8,8,w-16,h-16,18);g.fill();g.fillStyle='#1d2b53';g.textAlign='center';g.textBaseline='middle';
  if(a){g.direction='rtl';g.font=fnt(1,Math.round(h*.4));g.fillText(a,w/2,h*.34)}g.direction='ltr';g.font=fnt(0,Math.round(h*(a?.3:.5)));g.fillText(b,w/2,h*(a?.74:.52))};

/* ---------- Arena 3D (dibangun sekali) ---------- */
function mkRunner(col){
  const g=new THREE.Group(),cm=[],L3=c=>new THREE.MeshLambertMaterial({color:c}),part=(w,h,d,c,x,y,z,p)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),L3(c));m.position.set(x,y,z);(p||g).add(m);return m};
  cm.push(part(1.2,1.5,.7,col,0,2.5,0).material);part(1.25,.5,.75,0x1d2b53,0,1.65,0);
  const hd=new THREE.Mesh(new THREE.SphereGeometry(.6,12,10),L3(0xf1c9a0));hd.position.y=3.75;g.add(hd);
  const cp=new THREE.Mesh(new THREE.SphereGeometry(.64,12,8,0,Math.PI*2,0,Math.PI/2),L3(col));cp.position.y=3.85;g.add(cp);cm.push(cp.material);
  const mk=(x,y,hh)=>{const p=new THREE.Group();p.position.set(x,y,0);g.add(p);part(.38,hh,.38,0xf1c9a0,0,-hh/2,0,p);return p};
  const aL=mk(-.8,3.1,1.3),aR=mk(.8,3.1,1.3),lL=mk(-.32,1.5,1.5),lR=mk(.32,1.5,1.5);
  const tg=document.createElement('canvas');tg.width=256;tg.height=64;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(tg),transparent:true,depthTest:false,fog:false}));sp.scale.set(4.6,1.15,1);sp.position.y=5.3;sp.renderOrder=20;g.add(sp);
  g.scale.setScalar(.85);g.visible=false;return{g,aL,aR,lL,lR,sp,tg,cm,tc:'',nm:'',z:AZ,v:0}}
function setTag(r,t,col){const g=r.tg.getContext('2d');g.clearRect(0,0,256,64);g.fillStyle=col;rr(g,4,6,248,52,26);g.fill();g.strokeStyle='#1d2b53';g.lineWidth=5;g.stroke();
  g.fillStyle='#fff';g.font=fnt(0,32);g.textAlign='center';g.textBaseline='middle';g.fillText(t,128,34);r.sp.material.map.needsUpdate=true;r.nm=t}
function mk(){
  if(T.built)return;T.built=true;
  const G=T.G=new THREE.Group();G.visible=false;S.add(G);
  const L3=c=>new THREE.MeshLambertMaterial({color:c});
  const bx=(g,w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),L3(c));m.position.set(x,y,z);g.add(m);return m};
  const ZC=AZ-LEN/2,TW=LW*MAXP,Z0=AZ+3,Z1=AZ-LEN;
  bx(G,700,2,760,0x7fc65a,0,-1.3,ZC-20);bx(G,TW+2.4,.5,LEN+60,0xffffff,0,-.4,ZC-8);bx(G,TW,.6,LEN+56,0xc4663f,0,-.35,ZC-8);
  for(let k=0;k<=MAXP;k++)bx(G,.2,.05,LEN+40,0xffffff,(k-MAXP/2)*LW,.0,ZC-8);
  for(let i=0;i<MAXP;i++){bx(G,LW-.4,.06,3,LH[i],(i-(MAXP-1)/2)*LW,.04,AZ+1);const sg=mkSign(1.7,.9,128,64,drawTxt('',String(i+1),LC[i]));sg.m.rotation.x=-Math.PI/2;sg.m.position.set((i-(MAXP-1)/2)*LW,.1,AZ-1.5);G.add(sg.m)}
  /* penanda jarak tiap 20 m */
  for(let d=20;d<LEN;d+=20){[-1,1].forEach(s=>{bx(G,.3,2.2,.3,0x5a3a1c,s*(TW/2+1.2),1.1,AZ-d);const sg=mkSign(3,1.5,192,96,drawTxt('',d+' m','#3d82e0'));sg.m.position.set(s*(TW/2+1.2),2.6,AZ-d);sg.m.rotation.y=-s*.6;G.add(sg.m)})}
  /* gerbang start, pos, garis finis */
  const arch=(z,col,sgn)=>{const g=new THREE.Group();g.position.z=z;G.add(g);[-1,1].forEach(s=>bx(g,1,9,1,0x5a3a1c,s*(TW/2+.6),4.5,0));bx(g,TW+3,1.2,1.2,col,0,9.4,0);if(sgn){sgn.m.position.set(0,12.4,.7);g.add(sgn.m)}return g};
  arch(Z0,0x2fa56b,mkSign(10,4.2,512,208,drawTxt('اِبْدَأْ','START','#2fa56b')));
  for(let i=0;i<3;i++)arch(AZ-LEN*(i+1)/4,LH[i],mkSign(10,4.5,512,256,drawGate(i)));
  arch(Z1,0x1d2b53,mkSign(12,4.2,512,180,drawTxt('نِهَايَةٌ','FINISH 🏁','#1d2b53')));
  for(let i=0;i<20;i++)for(let j=0;j<2;j++)bx(G,TW/20,.05,1,(i+j)%2?0xffffff:0x1d2b53,-TW/2+TW/40+i*TW/20,.06,Z1-.5-j);
  /* tribun + penonton bersorak */
  const rows=[0xd9594c,0x3d82e0,0xe0a43a],fc=[0xff6b5e,0xffcf3f,0x2fbf85,0x3d9bff,0xb06bff],hg=new THREE.SphereGeometry(.5,8,6);
  [-1,1].forEach(s=>rows.forEach((c,r)=>{const h=1.2+r*1.2;bx(G,5,h,LEN+30,c,s*(TW/2+5+r*5),h/2,ZC-8)}));
  for(let k=0;k<64;k++){const s=k%2?1:-1,r=(k>>1)%3,z=AZ+4-((k*7.3)%(LEN+20)),y=1.2+r*1.2,x=s*(TW/2+5+r*5),g=new THREE.Group();g.position.set(x,y,z);G.add(g);
    bx(g,.9,1.3,.9,fc[k%5],0,.65,0);const h=new THREE.Mesh(hg,L3(0xf1c9a0));h.position.y=1.6;g.add(h);T.crowd.push({g,y,k})}
  /* pohon, awan, bendera tali */
  for(let k=0;k<44;k++){const s=k%2?1:-1,x=s*(TW/2+24+(k%5)*5),z=AZ+10-k*7.5,h=4+(k%4);bx(G,.9,h,.9,0x6b4423,x,h/2,z);
    const c=new THREE.Mesh(new THREE.ConeGeometry(3.2,7,8),L3(k%3?0x2f9e5a:0x3fb36b));c.position.set(x,h+3,z);G.add(c)}
  for(let k=0;k<10;k++){const g=new THREE.Group();g.position.set((k%2?1:-1)*(70+k*18),48+(k%3)*8,AZ-k*28);[[0,0],[5,-1],[-5,-1],[2,2]].forEach(o=>{const m=new THREE.Mesh(new THREE.SphereGeometry(5,10,8),new THREE.MeshLambertMaterial({color:0xffffff}));m.position.set(o[0],o[1],0);m.scale.y=.6;g.add(m)});G.add(g);T.cl.push(g)}
  for(let k=0;k<LEN/26;k++)[-1,1].forEach(s=>{const z=AZ-6-k*26;bx(G,.25,6,.25,0xffffff,s*(TW/2+.4),3,z);for(let f=0;f<6;f++)bx(G,.2,.9,.6,fc[(f+k)%5],s*(TW/2+.4),5.4-f*.05,z-f*4.2-2).rotation.z=.2});
  /* Kak Hud-hud wasit + papan pasangan */
  const OZ=Z1-18,OW=new THREE.Group();OW.position.set(0,0,OZ);OW.scale.setScalar(1.5);G.add(OW);
  const body=new THREE.Mesh(new THREE.CylinderGeometry(4.2,5,9,18),L3(0x8a5a2b));body.position.y=4.5;OW.add(body);
  const belly=new THREE.Mesh(new THREE.SphereGeometry(3.6,16,12),L3(0xf3e0b8));belly.scale.set(1,1.15,.5);belly.position.set(0,4.4,3.7);OW.add(belly);
  [-1,1].forEach(s=>{bx(OW,1.2,6.5,2.6,0x6e4521,s*5.2,5,0);bx(OW,1.8,.5,2.6,0xf2a33a,s*1.8,.25,3.6)});
  const hd=T.head=new THREE.Group();hd.position.y=11;OW.add(hd);hd.add(new THREE.Mesh(new THREE.SphereGeometry(3.8,18,14),L3(0x9a6a38)));
  const face=new THREE.Mesh(new THREE.SphereGeometry(2.9,14,10),L3(0xf3e0b8));face.scale.set(1.25,1,.35);face.position.z=2.9;hd.add(face);
  [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.SphereGeometry(1.15,12,10),L3(0xffffff));e.position.set(s*1.6,.5,3.1);hd.add(e);
    const p=new THREE.Mesh(new THREE.SphereGeometry(.6,10,8),L3(0x1d2b53));p.position.set(s*1.6,.5,4.1);hd.add(p)});
  const bk=new THREE.Mesh(new THREE.ConeGeometry(.8,1.7,8),L3(0xf2a33a));bk.position.set(0,-.5,4.1);bk.rotation.x=Math.PI/2;hd.add(bk);bx(hd,6.4,.5,6.4,0x1d2b53,0,4.2,0);bx(hd,.4,1.6,.4,0xffcf3f,3,3.4,3);
  T.board=mkSign(26,9.5,1024,376,drawBoard);T.board.m.position.set(0,33,OZ);G.add(T.board.m);
  [-11.5,11.5].forEach(x=>bx(G,.8,32,.8,0x5a3a1c,x,16,OZ-.8));bx(G,25,.8,.8,0x5a3a1c,0,38.4,OZ-.8);
  for(let i=0;i<MAXP;i++)T.rn.push(mkRunner(LH[i])),G.add(T.rn[i].g)}

/* ---------- Jaringan (REST + EventSource) ---------- */
function setPath(path,data){const a=path.split('/').filter(Boolean);if(!a.length){T.tree=data&&typeof data==='object'?data:{};return}
  let o=T.tree;for(let i=0;i<a.length-1;i++){if(!o[a[i]]||typeof o[a[i]]!=='object')o[a[i]]={};o=o[a[i]]}
  if(data===null||data===undefined)delete o[a[a.length-1]];else o[a[a.length-1]]=data}
function after(first){const mp=T.tree.p&&T.tree.p[dev];if(mp&&typeof mp.t==='number'&&T.net&&!T.offOk){T.offOk=true;T.off=Date.now()-mp.t}if(first&&!T.joined)joined()}
function onPut(e){const m=jp(e.data);if(!m||typeof m.path!=='string')return;setPath(m.path,m.data);after(m.path==='/')}
function onPatch(e){const m=jp(e.data);if(!m||typeof m.path!=='string'||!m.data)return;for(const k in m.data)setPath((m.path==='/'?'':m.path)+'/'+k,m.data[k]);after(false)}
function put(path,mkv){setPath(path,mkv(nowS()));if(!T.net)return;
  fetch(DB+'/lampu/'+T.room+'/'+path+'.json',{method:'PUT',body:JSON.stringify(mkv(SVT)),headers:{'Content-Type':'application/json'}}).catch(()=>{})}
function me(){put('p/'+dev,t=>({n:nm(),z:Math.round(L.z*10),h:L.h,f:L.f,mid:T.mid,t}))}
function bye(){if(!T.net||!T.joined)return;try{fetch(DB+'/lampu/'+T.room+'/p/'+dev+'.json',{method:'PUT',body:JSON.stringify({n:nm(),z:Math.round(L.z*10),h:L.h,f:L.f,mid:T.mid,off:1,t:SVT}),headers:{'Content-Type':'application/json'},keepalive:true}).catch(()=>{})}catch(e){}}
function joined(){if(T.joined)return;T.joined=true;clearTimeout(T.ct);me();T.ph='lobby';T.ck=''}
function local(){clearTimeout(T.ct);try{T.es&&T.es.close()}catch(e){}T.es=null;T.net=false;T.off=0;T.tree={};if(!T.joined)joined()}
function connect(){T.ph='conn';T.joined=false;T.net=false;T.offOk=false;T.off=0;T.tree={};T.room=roomOf(NMX())+'-'+T.regu;T.sv.regu=T.regu;persist();conn();
  try{const es=T.es=new EventSource(DB+'/lampu/'+T.room+'.json');es.addEventListener('put',onPut);es.addEventListener('patch',onPatch);es.onopen=()=>{T.net=true};es.onerror=()=>{if(!T.joined)local()};T.ct=setTimeout(()=>{if(!T.joined)local()},4500)}catch(e){local()}}

/* ---------- Alur permainan ---------- */
function modal(on){$('#modal').style.display=on?'flex':'none'}
function intro(){
  if(open||!ready||T.on)return;
  open=true;mode='arena';const c=$('#card'),s=T.sv;modal(true);c.scrollTop=0;T.regu=num(s.regu,1,6,1);
  c.innerHTML='<h2>🚦 Arena Lampu Ilmu</h2><div class="fc">Lomba lari <b>2–8 pemain</b> di jalur 260 m! Di papan Kak Hud-hud muncul <b>pasangan kata Arab–Indonesia</b>. Pasangan <b>BENAR → LARI</b>. Pasangan <b>SALAH → DIAM</b>.</div>'
   +`<div class="exst"><div><b>${s.win||0}</b><small>kali juara 1</small></div><div><b>${s.bt?fmt(s.bt):'—'}</b><small>waktu terbaik</small></div><div><b>${s.try||0}</b><small>kali main</small></div></div>`
   +'<div class="exrw"><b>🟰</b><span><b>Cocok?</b> Contoh: <span class="ar" lang="ar">فَلَّاحٌ</span> = petani → benar, tahan tombol LARI.</span></div>'
   +'<div class="exrw"><b>≠</b><span><b>Tidak cocok?</b> Lepas tombol! Kalau masih bergerak, kamu terpeleset ke pos terakhir dan kehilangan ❤️.</span></div>'
   +'<div class="exrw"><b>👫</b><span><b>Dua mode</b> (dipilih di lobi): <b>Sendiri-sendiri</b> (2–8 orang, juara perorangan) atau <b>Berpasangan</b> (tim 2 orang, 4/6/8 pemain; tim menang kalau keduanya sampai finis lebih dulu).</span></div>'
   +'<div class="exrw"><b>🚩</b><span><b>3 pos aman</b> di jalur. Hati habis = tersingkir.</span></div>'
   +'<div class="gt">Pilih Regu (sama dengan temanmu)</div><div class="lpk" id="lpk">'+[1,2,3,4,5,6].map(n=>`<button type="button" data-r="${n}" class="${n===T.regu?'on':''}">${n}</button>`).join('')+'</div>'
   +'<div class="exbt"><button class="opt go" id="lpg1" type="button">▶ Masuk lobi</button><button class="opt" id="lpg0" type="button">✖ Nanti saja</button></div>';
  $('#lpk').onclick=e=>{const b=e.target.closest('button');if(!b)return;T.regu=+b.dataset.r;$('#lpk').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b))};
  $('#lpg1').onclick=begin;$('#lpg0').onclick=leave}
function begin(){
  mk();T.org={bg:S.background,fc:S.fog.color.getHex(),fn:S.fog.near,ff:S.fog.far,fov:cam.fov,far:cam.far};T.o={x:pl.x,y:pl.y,z:pl.z,yaw:pl.yaw};
  T.G.visible=true;T.on=true;open=true;mode='arena';document.body.classList.add('lpa');
  S.background=new THREE.Color(0xa8dcff);S.fog.color.setHex(0xa8dcff);S.fog.near=80;S.fog.far=480;cam.fov=62;cam.updateProjectionMatrix();
  pl.x=0;pl.y=0;pl.z=AZ;pl.yaw=0;pl.vy=0;T.sv.try=(T.sv.try||0)+1;persist();T.tp=performance.now();T.mid='';T.rd=-9;T.pr=null;T.rv=0;resetL();connect()}
function resetL(){L.z=0;L.v=0;L.h=3;L.cp=0;L.st=0;L.f=0;L.miss=[];L.run=false;L.kd=false;E.run.classList.remove('on')}
function leave(){
  const was=T.on;qreset();bye();T.on=false;T.ph='idle';clearTimeout(T.ct);try{T.es&&T.es.close()}catch(e){}T.es=null;T.joined=false;
  document.body.classList.remove('lpa','lpr');E.c.className='';E.b.innerHTML='';
  if(was){const o=T.org;if(o){S.background=o.bg;S.fog.color.setHex(o.fc);S.fog.near=o.fn;S.fog.far=o.ff;cam.fov=o.fov;cam.far=o.far;cam.updateProjectionMatrix()}
    if(T.G)T.G.visible=false;P.rotation.order='XYZ';P.rotation.set(0,0,0);P.scale.setScalar(1);P.armL.rotation.set(0,0,0);P.armR.rotation.set(0,0,0);P.legL.rotation.x=P.legR.rotation.x=0;
    if(T.o){pl.x=T.o.x;pl.y=0;pl.z=T.o.z;pl.yaw=T.o.yaw}pl.vy=0}
  modal(false);open=false;mode=null}
function qreset(){T.qc=0;clearTimeout(qT);E.x.textContent='✖'}
function quit(){if(!T.on)return;if(T.ph!=='play'||T.qc){qreset();leave();return}T.qc=1;E.x.textContent='Keluar? Ketuk lagi';qT=setTimeout(qreset,3200)}
function conn(){const c=$('#card');modal(true);c.scrollTop=0;c.innerHTML='<h2>🚦 Menyambung…</h2><div class="fc">Mencari temanmu di Regu '+T.regu+'. Tanpa internet, kamu bisa Latihan sendiri.</div><div class="exbt"><button class="opt" id="lpq0" type="button">✖ Batal</button></div>';$('#lpq0').onclick=leave}
function lobby(c){
  const others=c.act.filter(k=>k!==dev).length,run=c.m&&!c.ended,mine=c.ids.includes(dev),duo=T.md==='duo',na=c.act.length;
  const sg=JSON.stringify([c.act.map(k=>c.pp[k].n),T.net,c.m&&c.m.id,c.ended,T.md]);if(sg===T.ck)return;T.ck=sg;
  const rows=c.act.slice(0,MAXP).map((k,i)=>`<div class="lpl"><i style="background:${LC[duo?i>>1:i]}"></i>${duo?'Tim '+((i>>1)+1)+' · ':''}${esc(String(c.pp[k].n||'Teman').slice(0,14))}${k===dev?' (kamu)':''}</div>`).join('');
  const full=others>=MAXP,bad=duo&&(na%2||na<4),ok=!run&&na>=2&&na<=MAXP&&!bad,card=$('#card');modal(true);
  card.innerHTML=`<h2>🚦 Lobi Regu ${T.regu}</h2><div class="stp">${T.net?'☁️ Ruang '+esc(T.room.toUpperCase()):'📴 Tanpa internet'} · ${Math.min(na,MAXP)}/${MAXP} pemain</div>`
   +`<div class="lpk" id="lpm"><button type="button" data-m="solo" class="${duo?'':'on'}">🏃 Sendiri-sendiri</button><button type="button" data-m="duo" class="${duo?'on':''}">👫 Berpasangan</button></div>`+rows
   +(full?'<div class="fc">Regu ini sudah penuh (maks 8). Pilih Regu lain.</div>':run&&!mine?'<div class="fc">Lomba sedang berjalan. Tunggu sampai selesai, ya.</div>':bad&&na>=2?'<div class="fc">Mode berpasangan butuh jumlah pemain <b>genap</b> (4, 6, atau 8). Tim dibentuk berurutan sesuai daftar.</div>':na<2?'<div class="fc">Minimal <b>2 pemain</b>. Ajak temanmu masuk <b>Regu '+T.regu+'</b>.</div>':'<div class="fc">Siapa saja boleh menekan Mulai. Semua pemain langsung ikut!</div>')
   +'<div class="exbt">'+(full?'':`<button class="opt go" id="lpgo" type="button" ${ok?'':'disabled'}>▶ Mulai lomba</button>`)+'<button class="opt" id="lpso" type="button">🏃 Latihan sendiri</button><button class="opt" id="lpno" type="button">✖ Keluar</button></div>';
  $('#lpm').onclick=e=>{const b=e.target.closest('button');if(!b)return;T.md=b.dataset.m;T.ck=''};
  const g=$('#lpgo');if(g)g.onclick=()=>start(T.md==='duo'?'duo':'race');$('#lpso').onclick=()=>start('prak');$('#lpno').onclick=leave}
function start(kind){
  const c=calc(T.tree,nowS());if(c.m&&!c.ended&&c.ids.includes(dev))return;
  const pr=kind==='prak',duo=kind==='duo',ids=pr?[dev]:c.act.slice(0,MAXP);
  if(!pr&&(ids.length<2||!ids.includes(dev)))return;
  if(duo&&(ids.length%2||ids.length<4))return;
  if(pr&&c.m&&!c.ended)return;
  const id=Math.random().toString(36).slice(2,8),seed=Math.random().toString(36).slice(2,8),md=duo?'duo':'solo';T.solo=pr;
  put('m',t=>({id,t,seed,pl:ids,md}));
  if(pr){T.net=false}}
function enterPlay(c){
  T.mid=c.m.id;T.ph='play';T.rd=-9;T.pr=null;T.rv=0;T.lane=Math.max(0,c.ids.indexOf(dev));resetL();modal(false);document.body.classList.add('lpr');me();T.zs=0;
  c.ids.forEach((k,i)=>{const r=T.rn[i];if(r){r.z=AZ;r.v=0;r.nm='';r.g.rotation.z=0;r.tc=LC[ci(c,i)];r.cm.forEach(m=>m.color.setHex(LH[ci(c,i)]))}});E.he.textContent=hearts();
  E.bar.querySelectorAll('.d').forEach(d=>d.remove());c.ids.forEach((k,i)=>{const d=document.createElement('i');d.className='d'+(k===dev?' me':'');d.style.background=LC[ci(c,i)];d.style.left='0%';E.bar.appendChild(d)})}
function caught(pr){
  L.h--;L.st=STUN;L.z=L.cp;L.v=0;T.shake=.5;snd(160,.35,'sawtooth',.08);vib([90,50,90]);E.he.textContent=hearts();
  if(!L.miss.some(m=>m.a===pr.a))L.miss.push(pr);me();
  flash(L.h>0?'😵‍💫 Pasangan salah, tapi kamu bergerak!<br><small>Kembali ke pos terakhir</small>':'😵‍💫 Hatimu habis!',1)}
function finishRun(c){L.f=Math.max(1,Math.round(c.el*10));L.v=0;T.cheer=performance.now();snd(988,.2,'triangle');vib([40,40,40,40,120]);confetti();me();flash('🏁 Kamu sampai garis finis!<br><small>'+(dm(c)?'Menunggu pasanganmu…':'Menunggu pemain lain…')+'</small>',1)}
function groups(c){
  const duo=dm(c),per=c.ids.map(k=>{const d=c.pp[k]||{},m=k===dev;return{k,n:m?nm():String(d.n||'Teman').slice(0,14),z:m?L.z:num(d.z,0,9999,0)/10,f:(m?L.f:num(d.f,0,99999,0))/10,h:m?L.h:num(d.h,0,3,0),mine:m}});
  const gs=[];per.forEach((x,i)=>{if(duo&&i%2&&gs.length)gs[gs.length-1].m.push(x);else gs.push({m:[x],ci:duo?i>>1:i})});
  gs.forEach(g=>{g.n=g.m.map(x=>x.n).join(' & ');g.z=g.m.reduce((s,x)=>s+x.z,0)/g.m.length;g.f=g.m.every(x=>x.f>0)?Math.max(...g.m.map(x=>x.f)):0;g.h=Math.max(...g.m.map(x=>x.h));g.mine=g.m.some(x=>x.mine)});
  return gs.sort((a,b)=>(b.f>0)-(a.f>0)||(a.f>0&&b.f>0?a.f-b.f:b.z-a.z))}
function endCard(c){
  T.ph='end';document.body.classList.remove('lpr');E.c.className='';E.b.innerHTML='';
  const rk=groups(c),duo=dm(c),pos=Math.max(0,rk.findIndex(x=>x.mine)),g0=rk[pos]||{f:0},fin=g0.f>0,s=T.sv,first=s.d!==dstr(),n=rk.length;
  let b=10;if(fin){b+=50+([30,20,10][pos]||0);if(rk.every(x=>x.f>0)&&n>1)b+=20;if(!s.bt||g0.f<s.bt)s.bt=g0.f;if(pos===0&&n>1){s.win=(s.win||0)+1;if(first){b+=60;s.d=dstr()}}}
  persist();coins+=b;hud();
  const med=['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣'],card=$('#card');modal(true);card.scrollTop=0;
  const rows=rk.map((x,i)=>`<div class="lpl" style="${x.mine?'background:#fff3c4;border-radius:10px;padding:4px 8px':''}"><span>${med[i]}</span><i style="background:${LC[x.ci]}"></i><span style="flex:1">${esc(x.n)}${x.mine?' (kamu)':''}</span><span>${x.f>0?'🏁 '+fmt(x.f):x.h<=0?'😵 tersingkir':'📍 '+Math.round(x.z)+' m'}</span></div>`).join('');
  const rc=L.miss.slice(0,3).map(q=>`<div class="ex">📖 <span class="ar" lang="ar">${esc(q.a)}</span> = <b>${esc(q.ta)}</b> (bukan “${esc(q.b)}”)</div>`).join('');
  card.innerHTML=`<h2>${fin&&pos===0&&n>1?(duo?'🏆 Timmu juara 1!':'🏆 Kamu juara 1!'):fin?'🏁 '+(duo?'Timmu':'Kamu')+' sampai finis!':'🦉 Lomba selesai'}</h2>`+(fin?'<div class="ar center" lang="ar" style="font-size:32px;line-height:1.5">أَحْسَنْتَ! مَبْرُوكٌ</div>':'<div class="fc">Tidak apa-apa! Perhatikan pasangan katanya, lalu coba lagi bersama temanmu.</div>')+rows
   +`<div class="ex">🪙 +${b} koin</div>`+(rc?'<div class="gt">Pasangan yang tadi bikin terpeleset</div>'+rc:'')
   +'<div class="exbt"><button class="opt go" id="lpag" type="button">🔁 Main lagi</button><button class="opt" id="lpcl" type="button">✖ Tutup</button></div>';
  $('#lpag').onclick=()=>{T.ph='lobby';T.ck='';resetL();me()};$('#lpcl').onclick=leave;
  if(fin){confetti();[523,659,784,1047].forEach((f,k)=>setTimeout(()=>snd(f,.2,'triangle'),k*120))}}

/* ---------- Per-frame ---------- */
function showPair(c){
  const pr=T.pr;E.b.className=T.rv>0?'ok':T.rv<0?'no':'';
  if(c.el<0){const ix=c.ids.indexOf(dev),pk=dm(c)?c.ids[ix^1]:null,pt=pk?`<div class="m">👫 Timmu: ${esc(String((c.pp[pk]||{}).n||'Teman').slice(0,14))} (Tim ${(ix>>1)+1})</div>`:'';
    E.b.innerHTML='<div class="w"><div class="c">Bersiap…</div></div>'+pt;return}
  E.b.innerHTML=`<div class="w"><div class="c a" lang="ar">${esc(pr.a)}</div><div class="e">${T.rv>0?'=':T.rv<0?'≠':'?'}</div><div class="c">${esc(pr.b)}</div></div>`
   +`<div class="m">${T.rv>0?'✔ BENAR — boleh maju!':T.rv<0?'✖ SALAH — diam! Yang benar: '+esc(pr.ta):'Cocok → LARI · Tidak cocok → DIAM'}</div><div class="t"><i id="lpti"></i></div>`;
  E.ti=$('#lpti');if(T.board)T.board.f()}
function sim(c,dt){
  if(L.f||L.h<=0){L.v=0;return}
  if(c.el<0)return;
  if(L.st>0){L.st-=dt;L.v=0;return}
  const run=L.run||L.kd||(typeof jy!=='undefined'&&jy>.35),pr=T.pr;
  L.v+=((run?SP:0)-L.v)*Math.min(1,dt*(run?6:16));L.z+=L.v*dt;
  if(pr&&c.rt<SHOW&&c.rt>GR&&!pr.ok&&L.v>2.2){caught(pr);return}
  const gi=Math.floor(L.z/(LEN/4));if(gi>=1&&gi<=3&&gi*LEN/4>L.cp){L.cp=gi*LEN/4;snd(784,.12,'triangle');flash('🚩 Pos '+gi+'/3 aman!<br><small>Kalau terpeleset, kembali ke sini</small>',1)}
  if(L.z>=LEN){L.z=LEN;finishRun(c)}}
function tick(now,dt){
  const c=T.c=calc(T.tree,nowS());
  if(T.joined&&now-T.hb>BEAT){T.hb=now;me()}
  if((T.ph==='lobby'||T.ph==='end')&&c.m&&!c.ended&&c.ids.includes(dev)&&c.m.id!==T.mid)enterPlay(c);
  if(T.ph==='lobby')lobby(c);
  if(T.ph==='play'){
    if(c.ended){endCard(c);return}
    if(c.rd!==T.rd){T.rd=c.rd;T.rv=0;T.pr=c.rd>=0?pairAt(c.m.seed||'x',c.rd):null;showPair(c);
      if(c.rd>=0){snd(520,.08,'triangle');const w=performance.now();if(w-(T.ls||0)>1500){T.ls=w;try{say(T.pr.a)}catch(e){}}}
      else{flash(String(Math.max(1,Math.ceil(-c.el))),0)}}
    if(c.el<0){const s=String(Math.max(1,Math.ceil(-c.el)));if(E.c.textContent!==s){flash(s,0);snd(440,.1,'triangle')}}
    else if(E.c.className&&c.el<.4&&!E.c.classList.contains('sm')){E.c.className=''}
    if(T.pr&&!T.rv&&c.rt>=SHOW){T.rv=T.pr.ok?1:-1;showPair(c);snd(T.pr.ok?880:200,.2,T.pr.ok?'triangle':'square');if(T.pr.ok)T.cheer=now}
    if(E.ti&&T.pr)E.ti.style.transform='scaleX('+Math.max(0,1-c.rt/SHOW)+')';
    sim(c,dt);
    if(now-T.zs>300){T.zs=now;me()}
    E.t.textContent='⏱ '+fmt(Math.max(0,Math.ceil(DUR-Math.max(0,c.el))));
    const ds=E.bar.querySelectorAll('.d');c.ids.forEach((k,i)=>{if(ds[i])ds[i].style.left=Math.min(100,(k===dev?L.z:num((c.pp[k]||{}).z,0,9999,0)/10)/LEN*100)+'%'})}}
function frame(){
  const now=performance.now(),dt=Math.min(.05,Math.max(0,(now-T.tp)/1000)),t=now/1000;T.tp=now;
  tick(now,dt);const c=T.c,ids=c.ids.length?c.ids:[dev],n=ids.length;
  const lx=(Math.max(0,ids.indexOf(dev))-(n-1)/2)*LW;
  /* pemain lokal */
  const mv=Math.min(1,L.v/SP),sw=Math.sin(t*15)*mv*.9;let py=Math.abs(sw)*.12;
  P.rotation.order='XYZ';P.rotation.set(0,Math.PI,0);P.armL.rotation.set(-sw,0,0);P.armR.rotation.set(sw,0,0);P.legL.rotation.x=sw;P.legR.rotation.x=-sw;
  if(L.st>0){P.rotation.set(0,Math.PI,Math.sin(t*26)*.45*Math.max(0,L.st/STUN));P.armL.rotation.x=P.armR.rotation.x=-1.2+Math.sin(t*30)*.5}
  else if(L.f){P.armL.rotation.x=P.armR.rotation.x=-2.8;py=Math.abs(Math.sin(t*5))*.9}
  else if(L.h<=0)P.rotation.set(0,Math.PI,1.3);
  const wz=AZ-L.z;P.position.set(lx,pl.y+py,wz);pl.x=lx;pl.z=wz;
  /* pemain lain */
  for(let i=0;i<MAXP;i++){const r=T.rn[i],k=ids[i];
    if(!r||!k||k===dev||T.ph!=='play'){if(r)r.g.visible=false;continue}
    const d=c.pp[k]||{},tz=AZ-num(d.z,0,9999,0)/10,x=(i-(n-1)/2)*LW;r.g.visible=true;
    const dz=(tz-r.g.position.z)*Math.min(1,dt*6),v=Math.min(1,Math.abs(dz)/Math.max(dt,.001)/SP);r.g.position.set(x,Math.abs(Math.sin(t*14+i))*.12*v,r.g.position.z+dz);r.v+=(v-r.v)*.2;
    const s2=Math.sin(t*15+i)*.9*r.v;r.aL.rotation.x=-s2;r.aR.rotation.x=s2;r.lL.rotation.x=s2;r.lR.rotation.x=-s2;
    r.g.rotation.z=num(d.h,0,3,3)<=0?1.3:0;if(r.nm!==String(d.n||'Teman').slice(0,14))setTag(r,String(d.n||'Teman').slice(0,14),r.tc||LC[i])}
  /* penonton, awan, burung hantu */
  const ch=now-T.cheer<900?.7:.12;T.crowd.forEach(o=>{o.g.position.y=o.y+Math.abs(Math.sin(t*(RM?0:4)+o.k))*ch});
  T.cl.forEach((g,i)=>{g.position.x+=Math.sin(t*.2+i)*.01});
  if(T.head){T.head.rotation.y=Math.sin(t*.8)*.25;T.head.rotation.z=T.rv>0?Math.sin(t*10)*.12:0;T.head.position.y=11+Math.sin(t*2)*.1}
  /* kamera */
  let sx=0,sy=0;if(T.shake>0){T.shake-=dt;if(!RM){sx=(Math.random()-.5)*T.shake*1.6;sy=(Math.random()-.5)*T.shake*1.6}}
  cam.position.set(lx*.6+sx,7.2+sy,wz+14);cam.lookAt(lx*.4,4.8,wz-32)}
const R0=R.render;
R.render=function(s,c){
  if(T.on&&s===S){try{frame()}catch(e){console.warn('arena',e);try{leave()}catch(_){}try{ts('⚠️ Arena error: '+e.message,4500)}catch(_){}}}
  return R0.call(R,s,c)};

/* ---------- Tombol & input ---------- */
{
  const b=document.createElement('button');b.className='pill mx';b.id='arb';b.type='button';b.title='Arena Lampu Ilmu';b.setAttribute('aria-label','Arena Lampu Ilmu: lomba lari pasangan kata, 2 sampai 8 pemain');
  b.innerHTML='<span aria-hidden="true">🚦</span><span class="lb" aria-hidden="true">Arena</span>';
  const st=$('#stat'),ref=$('#exb');if(ref&&ref.after)ref.after(b);else if(st)st.appendChild(b);
  b.onclick=()=>{
    if(open||!ready)return;
    if(typeof RID!=='undefined'&&RID){ts('🚲 Turun dulu dari kendaraan (F), lalu masuk arena.',2200);return}
    if(typeof CV!=='undefined'&&CV)return;
    if(typeof INTR!=='undefined'&&INTR&&INTR.on){ts('🚪 Keluar dulu dari bangunan, lalu masuk arena.',2200);return}
    intro()}}
{
  const on=e=>{e.preventDefault();L.run=true;E.run.classList.add('on');try{E.run.setPointerCapture(e.pointerId)}catch(_){}},off=()=>{L.run=false;E.run.classList.remove('on')};
  E.run.addEventListener('pointerdown',on);['pointerup','pointercancel','lostpointercapture'].forEach(n=>E.run.addEventListener(n,off));
  E.run.addEventListener('contextmenu',e=>e.preventDefault());E.x.onclick=quit;
  addEventListener('blur',()=>{L.kd=false;off()});document.addEventListener('visibilitychange',()=>{if(document.hidden){L.kd=false;off()}});
  const isRun=k=>k===' '||k==='w'||k==='W'||k==='ArrowUp';
  addEventListener('keydown',e=>{if(!T.on)return;const k=e.key;if(isRun(k)){if(T.ph==='play')e.preventDefault();L.kd=true;return}if(k==='Escape'&&T.ph==='play')quit()});
  addEventListener('keyup',e=>{if(isRun(e.key))L.kd=false});
  addEventListener('pagehide',bye)}

window.ARN={start:intro,leave,calc,state:T};
})();
