/* === BAGIAN 32: Tarik Tali Ilmu (Tahap 2 dari rencana Arena Belajar) ===
   Modul mandiri, tidak mengubah file 01-31 (hanya memakai global-nya). Dimuat setelah js/31. Tanpa SDK: REST + EventSource Firebase (sama seperti js/28).
   Permainan: Tim Hijau vs Tim Jingga. Setiap jawaban BENAR = 1 tarikan untuk tim. Selisih tarikan >= 8 = menang; waktu habis (2 menit) = tim terbanyak menang.
   Bareng-bareng: ruang = kelas dari akhir nama murid ("Ahmad 4A" -> "4a"), sama seperti Teman Online. Tim dibagi seimbang otomatis.
   Sendirian (atau 1 tim kosong): lawannya Kak Hud-hud (bot, 1 tarikan tiap 5,5 detik, dihitung dari jam server sehingga semua perangkat sama).
   Tanpa internet: otomatis main sendiri melawan Kak Hud-hud.
   Data: /tali/<ruang>/m = {id,t,b,tg,dur} dan /tali/<ruang>/p/<id-perangkat> = {n,tm,c,mid,t,off}. Posisi tali = (tarikan A - tarikan B) / 8, dihitung lokal dari data yang sama (tanpa "host").
   Salah = tidak menarik, jeda 2,2 dtk + pembahasan (tidak ada pengurangan). Koin: +2 per jawaban benar, +40 menang (+60 menang pertama hari ini), +10 ikut. Tidak memanggil rec().
   Cara balik ke tampilan lama: hapus baris <script> js/32 di index.html. */
(function(){
'use strict';
if(window.TTI)return;
if(typeof THREE==='undefined'||typeof S==='undefined'||typeof R==='undefined'||typeof P==='undefined'||typeof pl==='undefined'||typeof cam==='undefined'||typeof EXM==='undefined'||typeof EXM.build!=='function'){console.warn('Tali: modul pendukung belum siap');return}

const DB='https://miku-profesi-default-rtdb.asia-southeast1.firebasedatabase.app';
const TZ=-3600,RX=22,TG=8,DUR=120,CD=4,BOTMS=5500,STALE=20000,BEAT=5000,LOCKW=2200,MAXP=8;
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
const T={on:false,built:false,ph:'idle',room:'',tree:{},off:0,offOk:false,net:false,es:null,ct:0,joined:false,tm:'a',mid:'',my:0,q:null,pool:[],nxt:0,fin:null,played:false,hb:0,tp:0,fx:0,c:null,cdn:'',ck:'',hk:'',pull:0,G:null,flag:null,pa:[],pb:[],ow:null,org:null,o:null,sv:{try:0,win:0,best:0,d:''}};
const lsRead=()=>{try{return typeof lsg==='function'?lsg(SKT):localStorage.getItem(SKT)}catch(e){return null}};
try{Object.assign(T.sv,jp(lsRead()||'{}')||{})}catch(e){}
const persist=()=>{try{typeof lss==='function'?lss(SKT,JSON.stringify(T.sv)):localStorage.setItem(SKT,JSON.stringify(T.sv))}catch(e){}};
const nowS=()=>Date.now()-(T.off||0);
const E={};

/* ---------- Logika murni: dari data ruang -> keadaan pertandingan ---------- */
function calc(tr,now){
  const m=tr&&tr.m&&typeof tr.m==='object'?tr.m:null,pp=(tr&&tr.p&&typeof tr.p==='object')?tr.p:{};
  const r={m,a:0,b:0,na:0,nb:0,L:{a:[],b:[]},bot:!!(m&&m.b),el:-1,ended:false,win:'',pos:0,tg:TG,dur:DUR};
  Object.keys(pp).forEach(k=>{const d=pp[k];if(!d||typeof d!=='object')return;const t=d.tm==='b'?'b':'a',mine=!!(m&&d.mid===m.id);
    if(!d.off&&now-num(d.t,0,9e15,0)<=STALE){r['n'+t]++;r.L[t].push({k,n:safe(d.n),c:mine?num(d.c,0,999,0):0})}
    if(mine)r[t]+=num(d.c,0,999,0)});
  if(m){
    r.tg=num(m.tg,3,30,TG);r.dur=num(m.dur,20,600,DUR);r.el=(now-num(m.t,0,9e15,0))/1000-CD;
    if(r.bot&&r.el>0)r.b+=Math.floor(Math.min(r.el,r.dur)*1000/BOTMS);
    const df=r.a-r.b;r.pos=Math.max(-1,Math.min(1,df/r.tg));
    if(Math.abs(df)>=r.tg){r.ended=true;r.win=df>0?'a':'b'}
    else if(r.el>=r.dur){r.ended=true;r.win=df>0?'a':df<0?'b':''}}
  return r}

/* ---------- Elemen layar ---------- */
(function(){
  const css=document.createElement('style');css.textContent=`
#tth,#tts,#ttq,#ttc{display:none}
body.tli #tth,body.tli #tts{display:flex}
body.tli .hud,body.tli #js,body.tli #rbar{display:none!important}
#tth{position:fixed;left:0;right:0;top:0;z-index:5;gap:8px;align-items:center;pointer-events:none;padding:calc(8px + env(safe-area-inset-top,0px)) calc(10px + env(safe-area-inset-right,0px)) 0 calc(10px + env(safe-area-inset-left,0px))}
.ttp{font:700 15px/1 "Baloo 2",system-ui,sans-serif;background:#fffaf0;color:#1d2b53;border:3px solid #1d2b53;border-radius:999px;padding:7px 12px;pointer-events:auto;white-space:nowrap}
button.ttp{cursor:pointer;min-width:44px;min-height:44px;padding:4px 12px}
.ttbar{flex:1;height:22px;border:3px solid #1d2b53;border-radius:999px;position:relative;overflow:hidden;background:linear-gradient(90deg,#2fa56b 50%,#f08a24 50%)}
.ttbar i{position:absolute;top:-2px;bottom:-2px;left:50%;width:10px;margin-left:-5px;background:#fff;border:2px solid #1d2b53;border-radius:5px;transition:left .25s}
#tts{position:fixed;left:0;right:0;top:calc(58px + env(safe-area-inset-top,0px));z-index:5;justify-content:space-between;gap:8px;padding:0 calc(10px + env(safe-area-inset-right,0px)) 0 calc(10px + env(safe-area-inset-left,0px));pointer-events:none;font:700 13px/1.25 "Baloo 2",system-ui,sans-serif}
#tts div{background:rgba(255,250,240,.94);border:3px solid #1d2b53;border-radius:14px;padding:4px 10px;max-width:45vw;color:#1d2b53}
#ttsa{border-color:#178a55!important}#ttsb{border-color:#b85c0a!important}
#ttq{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(8px + env(safe-area-inset-bottom,0px));width:min(96vw,720px);max-height:56vh;overflow:auto;z-index:6;background:#fffaf0;color:#1d2b53;border:4px solid #1d2b53;border-radius:18px;padding:10px 12px;font-family:"Baloo 2",system-ui,sans-serif}
#ttq.on{display:block}
.ttq1{font-size:clamp(16px,3.4vw,22px);font-weight:700;margin-bottom:8px;line-height:1.3}
.tsp{float:right;min-width:44px;min-height:44px;border:3px solid #1d2b53;border-radius:12px;background:#fff;font-size:18px;cursor:pointer;margin-left:8px}
.tto{display:grid;grid-template-columns:1fr 1fr;gap:8px;clear:both}
.tto button{min-height:48px;font:700 clamp(15px,3vw,19px)/1.2 "Baloo 2",system-ui,sans-serif;border:3px solid #1d2b53;border-radius:14px;background:#ffcf3f;color:#1d2b53;cursor:pointer;padding:6px 10px;text-align:left;display:flex;gap:8px;align-items:center}
.tto button.ar{font-family:Amiri,"Noto Naskh Arabic",serif;font-size:clamp(20px,4vw,26px);direction:rtl;text-align:right}
.tto button.ok{background:#178a55;color:#fff}.tto button.no{background:#c62f26;color:#fff}
.tto button:disabled{cursor:default}
.tto button:focus-visible,.tsp:focus-visible,.ttp:focus-visible{outline:4px solid #1d2b53;outline-offset:2px}
.tto i{font-style:normal;background:#1d2b53;color:#fff;border-radius:50%;width:22px;height:22px;display:inline-grid;place-items:center;font-size:13px;flex:none}
.ttf{min-height:20px;margin-top:6px;font-size:14px}
#ttc{position:fixed;inset:0;z-index:7;align-items:center;justify-content:center;pointer-events:none;text-align:center;font:800 min(22vw,150px)/1.05 "Baloo 2",system-ui,sans-serif;color:#fff;-webkit-text-stroke:6px #1d2b53;paint-order:stroke fill}
#ttc.on{display:flex;animation:ttpop .45s ease-out}
@keyframes ttpop{from{transform:scale(1.5);opacity:0}to{transform:scale(1);opacity:1}}
.ttg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0}
.ttcol{border:3px solid;border-radius:14px;padding:6px 10px;display:flex;flex-direction:column;gap:2px;font-size:15px;background:#fffaf0}
.ttm{opacity:.7;font-size:13px}
@media (max-height:420px){#ttq{max-height:60vh;padding:6px 10px}.ttq1{font-size:15px;margin-bottom:4px}.tto button{min-height:40px}#tts{top:calc(52px + env(safe-area-inset-top,0px));font-size:12px}}
@media (prefers-reduced-motion:reduce){#ttc.on{animation:none}.ttbar i{transition:none}}`;
  document.head.appendChild(css);
  const w=document.createElement('div');
  w.innerHTML='<div id="tth"><div class="ttp" id="ttt">⏱ 2:00</div><div class="ttbar" aria-hidden="true"><i id="ttm"></i></div><button class="ttp" id="ttx" type="button" aria-label="Keluar dari Tarik Tali">✖</button></div>'
   +'<div id="tts"><div id="ttsa"></div><div id="ttsb"></div></div><div id="ttq" role="group" aria-label="Soal"></div><div id="ttc" aria-hidden="true"></div>';
  while(w.firstChild)document.body.appendChild(w.firstChild);
  E.t=$('#ttt');E.m=$('#ttm');E.x=$('#ttx');E.a=$('#ttsa');E.b=$('#ttsb');E.q=$('#ttq');E.c=$('#ttc')})();

/* ---------- Arena 3D (dibangun sekali) ---------- */
function mk(){
  if(T.built)return;T.built=true;
  const G0=T.G=new THREE.Group();G0.visible=false;S.add(G0);
  const L=c=>new THREE.MeshLambertMaterial({color:c});
  const bx=(g,w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),L(c));m.position.set(x,y,z);g.add(m);return m};
  bx(G0,400,2,200,0x7fc65a,0,-1.1,TZ);
  bx(G0,90,.4,16,0xe9d9a6,0,-.05,TZ);
  bx(G0,10,.5,16.4,0x7a5a3a,0,.02,TZ);
  [-1,1].forEach(s=>{const c=s<0?TC.a.c:TC.b.c;bx(G0,.9,.6,16,c,s*RX,.15,TZ);bx(G0,.5,8,.5,0x5a3a1c,s*RX,4,TZ-9);bx(G0,2.6,1.6,.2,c,s*RX-s*1.4,7.2,TZ-9)});
  const rp=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,100,8),L(0xc89b5a));rp.rotation.z=Math.PI/2;rp.position.set(0,3.4,TZ);G0.add(rp);
  const fl=T.flag=new THREE.Group();fl.position.set(0,3.4,TZ);G0.add(fl);
  bx(fl,.9,1,1,0xffcf3f,0,0,0);bx(fl,.3,5,.3,0x5a3a1c,0,2.5,0);bx(fl,2,1.2,.15,0xe0524a,1.1,4.6,0);
  const mkPuller=(col,sc)=>{const g=new THREE.Group();g.position.z=TZ+1.4;g.scale.setScalar(sc||1);
    bx(g,1.6,2.6,1.2,col,0,2.1,0);const h=new THREE.Mesh(new THREE.SphereGeometry(.85,12,10),L(0xf1c9a0));h.position.y=4.1;g.add(h);
    bx(g,.55,.55,1.6,0xf1c9a0,0,3.2,-.9);bx(g,1.7,.8,1,0x1d2b53,0,.4,0);g.visible=false;G0.add(g);return g};
  for(let i=0;i<MAXP;i++){T.pa.push(mkPuller(TC.a.c));T.pb.push(mkPuller(TC.b.c))}
  T.ow=mkPuller(0x8a5a2b,1.35)}

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
function intro(){
  if(open||!ready||T.on)return;
  open=true;mode='tali';const c=$('#card'),s=T.sv;modal(true);c.scrollTop=0;
  c.innerHTML='<h2>🪢 Tarik Tali Ilmu</h2><div class="fc">Tim Hijau lawan Tim Jingga. Setiap jawaban <b>benar</b> menarik tali ke timmu. Jawab lebih banyak dari lawan, lalu tarik bendera melewati garis timmu!</div>'
   +`<div class="exst"><div><b>${s.win||0}</b><small>kali menang</small></div><div><b>${s.best||0}</b><small>tarikan terbanyak</small></div><div><b>${s.try||0}</b><small>kali main</small></div></div>`
   +'<div class="exrw"><b>👫</b><span><b>Bareng teman sekelas</b>: ruang dibuat dari kelas di akhir namamu (misalnya “Ahmad 4A”). Tim dibagi otomatis.</span></div>'
   +'<div class="exrw"><b>🦉</b><span><b>Sendirian?</b> Lawanmu Kak Hud-hud. Salah tidak mengurangi tarikan, tapi kamu menunggu sebentar.</span></div>'
   +'<div class="exbt"><button class="opt go" id="ttgo0" type="button">▶ Masuk lobi</button><button class="opt" id="ttno0" type="button">✖ Nanti saja</button></div>';
  $('#ttgo0').onclick=begin;$('#ttno0').onclick=()=>{modal(false);open=false;mode=null}}
function begin(){
  mk();
  T.org={bg:S.background,fc:S.fog.color.getHex(),fn:S.fog.near,ff:S.fog.far,fov:cam.fov};
  T.o={x:pl.x,y:pl.y,z:pl.z,yaw:pl.yaw};
  T.G.visible=true;T.on=true;open=true;mode='tali';document.body.classList.add('tli');P.visible=false;
  S.background=new THREE.Color(0xa8dcff);S.fog.color.setHex(0xa8dcff);S.fog.near=90;S.fog.far=500;cam.fov=55;cam.updateProjectionMatrix();
  pl.x=0;pl.y=0;pl.z=TZ;pl.yaw=0;pl.vy=0;
  T.sv.try=(T.sv.try||0)+1;persist();T.tp=performance.now();T.fx=0;T.mid='';T.my=0;T.fin=null;T.q=null;T.played=false;T.hk='';T.cdn='';
  connect()}
function leave(){
  const was=T.on;bye();T.on=false;T.ph='idle';clearTimeout(T.ct);try{T.es&&T.es.close()}catch(e){}T.es=null;T.joined=false;
  E.c.className='';E.q.className='';E.q.innerHTML='';
  if(was){
    const o=T.org;if(o){S.background=o.bg;S.fog.color.setHex(o.fc);S.fog.near=o.fn;S.fog.far=o.ff;cam.fov=o.fov;cam.updateProjectionMatrix()}
    if(T.G)T.G.visible=false;P.visible=true;
    if(T.o){pl.x=T.o.x;pl.y=0;pl.z=T.o.z;pl.yaw=T.o.yaw}pl.vy=0}
  document.body.classList.remove('tli');modal(false);open=false;mode=null}
function quit(){if(!T.on)return;if(T.ph==='play'&&!confirm('Keluar dari pertandingan? Tarikanmu tetap dihitung untuk timmu.'))return;leave()}
function conn(){const c=$('#card');modal(true);c.scrollTop=0;c.innerHTML='<h2>🪢 Menyambung…</h2><div class="fc">Mencari teman sekelas. Kalau tidak ada internet, kamu main melawan Kak Hud-hud.</div><div class="exbt"><button class="opt" id="ttq0" type="button">✖ Batal</button></div>';$('#ttq0').onclick=leave}
function lobby(c){
  const sg=JSON.stringify([c.L.a.map(x=>x.n),c.L.b.map(x=>x.n),T.net,c.m&&c.m.id,c.ended]);if(sg===T.ck)return;T.ck=sg;
  const col=t=>`<div class="ttcol" style="border-color:${TC[t].h}"><b style="color:${TC[t].h}">${TC[t].e} ${TC[t].n} · ${c.L[t].length}</b>${c.L[t].map(x=>`<span>${esc(x.n)}${x.k===dev?' (kamu)':''}</span>`).join('')||'<span class="ttm">menunggu teman…</span>'}</div>`;
  const solo=c.na===0||c.nb===0,card=$('#card');modal(true);
  card.innerHTML=`<h2>🪢 Lobi Tarik Tali</h2><div class="stp">${T.net?'☁️ Ruang '+esc(T.room.toUpperCase()):'📴 Main sendiri (tanpa internet)'}</div><div class="ttg">${col('a')}${col('b')}</div>`
   +`<div class="fc">${solo?'Belum ada lawan manusia: <b>Kak Hud-hud 🦉</b> akan jadi lawanmu.':'Siapa saja boleh menekan Mulai. Semua pemain langsung ikut.'}</div>`
   +'<div class="exbt"><button class="opt go" id="ttgo" type="button">▶ Mulai pertandingan</button><button class="opt" id="ttno" type="button">✖ Keluar</button></div>';
  $('#ttgo').onclick=start;$('#ttno').onclick=leave;try{$('#ttgo').focus({preventScroll:true})}catch(e){}}
function start(){
  const c=calc(T.tree,nowS());if(c.m&&!c.ended)return;
  const id=Math.random().toString(36).slice(2,8),bot=(c.na===0||c.nb===0)?1:0;
  T.mid=id;T.my=0;T.fin=null;T.played=true;put('m',t=>({id,t,b:bot,tg:TG,dur:DUR}));me()}
function nextQ(){
  let i=T.pool.findIndex(x=>!x.u);
  if(i<0){T.pool=EXM.build().sort(()=>Math.random()-.5);i=T.pool.findIndex(x=>!x.u)}
  const q=T.pool[i<0?0:i];q.u=1;return q}
function ask(){
  const q=T.q=nextQ();E.q.className='on';
  E.q.innerHTML=`<div class="ttq1">${q.sp?'<button class="tsp" type="button" aria-label="Dengarkan">🔊</button>':''}${q.q}</div><div class="tto">`
   +q.o.map((x,k)=>`<button type="button" data-i="${k}" class="${ARX.test(x)?'ar':''}"><i aria-hidden="true">${k+1}</i><span>${x}</span></button>`).join('')+'</div><div class="ttf" role="status" aria-live="polite"></div>';
  if(q.q.indexOf('🎧')>=0&&q.sp)say(q.sp)}
function pick(i){
  const q=T.q;if(!q||q.done||T.ph!=='play'||!T.c||T.c.el<0)return;q.done=true;const ok=i===q.c;
  E.q.querySelectorAll('button[data-i]').forEach(b=>{b.disabled=true;const k=+b.dataset.i;if(k===q.c)b.classList.add('ok');else if(k===i)b.classList.add('no')});
  const f=E.q.querySelector('.ttf');
  if(ok){T.my++;coins+=2;hud();me();snd(988,.12,'triangle');T.pull=performance.now();
    f.innerHTML='<b style="color:#14744b">✔ <span class="ar" lang="ar">أَحْسَنْتَ</span> Tarik! +1 💪</b>';T.nxt=performance.now()+900}
  else{snd(180,.25,'sawtooth');
    f.innerHTML='<b style="color:#b8352b">🦉 Belum tepat.</b> <span class="ex">💡 '+(q.ex||'')+'</span>';T.nxt=performance.now()+LOCKW+(q.ex?800:0)}}
function finish(c){
  T.ph='end';T.fin=c;T.q=null;E.q.className='';E.q.innerHTML='';E.c.className='';
  const won=c.win===T.tm,draw=c.win==='',s=T.sv,first=s.d!==dstr();let b=10;
  if(T.played){
    if(won){b=40;if(first){b+=60;s.d=dstr()}s.win=(s.win||0)+1}
    s.best=Math.max(s.best||0,T.my);persist();coins+=b;hud()}
  const card=$('#card');modal(true);card.scrollTop=0;
  const ttl=!T.played?'🪢 Pertandingan selesai':won?'🏆 Timmu menang!':draw?'🤝 Seri!':'🦉 Belum menang';
  card.innerHTML=`<h2>${ttl}</h2>`+(won?'<div class="ar center" lang="ar" style="font-size:34px;line-height:1.5">أَحْسَنْتَ! مَبْرُوكٌ</div>':'')
   +`<div class="exst"><div><b style="color:${TC.a.h}">${c.a}</b><small>${TC.a.e} ${TC.a.n}</small></div><div><b style="color:${TC.b.h}">${c.b}</b><small>${TC.b.e} ${TC.b.n}</small></div><div><b>${T.my}</b><small>tarikanmu</small></div></div>`
   +(T.played?`<div class="ex">🪙 +${b+T.my*2} koin (${T.my*2} dari jawaban benar${won&&first?', termasuk bonus menang pertama hari ini':''})</div>`:'')
   +(won?'':'<div class="fc">Tidak apa-apa! Perhatikan pembahasan setiap soal, lalu coba lagi bersama timmu.</div>')
   +'<div class="exbt"><button class="opt go" id="ttag" type="button">🔁 Main lagi</button><button class="opt" id="ttcl" type="button">✖ Tutup</button></div>';
  $('#ttag').onclick=()=>{modal(false);T.ph='lobby';T.ck='';T.cdn='';T.fin=null;const n=calc(T.tree,nowS());if(!n.m||n.ended)start()};
  $('#ttcl').onclick=leave;
  if(won){confetti();[523,659,784,1047].forEach((f,k)=>setTimeout(()=>snd(f,.2,'triangle'),k*120))}}

/* ---------- Per-frame ---------- */
function hudUpd(c){
  const left=c.el<0?c.dur:Math.max(0,Math.ceil(c.dur-c.el));
  const lst=t=>{const L=c.L[t],nm=L.slice(0,4).map(x=>esc(x.n)+(x.k===dev?'★':'')).join(', ')+(L.length>4?' +'+(L.length-4):'');return `<b>${TC[t].e} ${t==='a'?c.a:c.b}</b> ${nm}`+(t==='b'&&c.bot?' 🦉':'')};
  const la=lst('a'),lb=lst('b'),sg=left+'|'+la+'|'+lb+'|'+c.pos;if(sg===T.hk)return;T.hk=sg;
  E.t.textContent='⏱ '+fmt(left);E.m.style.left=(50-c.pos*50)+'%';E.a.innerHTML=la;E.b.innerHTML=lb}
function tick(now){
  const c=T.c=calc(T.tree,nowS());
  if(T.joined&&now-T.hb>BEAT){T.hb=now;me()}
  if(c.m&&c.m.id!==T.mid){T.mid=c.m.id;T.my=0;T.fin=null;if(T.joined)me()}
  if(T.ph==='lobby'){
    if(c.m&&!c.ended){T.ph='play';T.played=true;T.q=null;modal(false)}
    else lobby(c)}
  if(T.ph==='play'){
    if(c.ended){finish(c);return}
    const s=c.el<0?String(Math.ceil(-c.el)):(c.el<.9?'MULAI!':'');
    if(s!==T.cdn){T.cdn=s;if(s){flash(s,0);snd(c.el<0?440:880,.12,'triangle')}else E.c.className=''}
    if(c.el>=0){
      if(T.q&&T.q.done&&now>=T.nxt)T.q=null;
      if(!T.q&&now>=T.nxt)ask()}
    else if(E.q.className){E.q.className='';E.q.innerHTML='';T.q=null}}
  hudUpd(c)}
function frame(){
  const now=performance.now(),dt=Math.min(.05,Math.max(0,(now-T.tp)/1000)),t=now/1000;T.tp=now;
  tick(now);const c=T.c;
  T.fx+=(-c.pos*RX-T.fx)*Math.min(1,dt*(RM?30:5));
  T.flag.position.x=T.fx;
  const jerk=RM?0:Math.max(0,1-(now-T.pull)/260),sh=T.fx*.55;
  const place=(g,i,dir,lean,on)=>{g.visible=!!on;if(!on)return;
    g.position.x=dir*(9+i*3.3)+sh;g.position.y=Math.abs(Math.sin(t*6+i))*(RM?0:.12);
    g.rotation.z=lean*(1+(RM?0:.1*Math.sin(t*7+i*1.7)))+(dir<0?jerk*.12:0);g.rotation.y=0};
  for(let i=0;i<MAXP;i++)place(T.pa[i],i,-1,.35,i<c.na&&T.ph!=='conn');
  const bo=c.bot?1:0;
  place(T.ow,0,1,-.35,!!bo);
  for(let i=0;i<MAXP;i++)place(T.pb[i],i+bo,1,-.35,i<c.nb&&i+bo<MAXP);
  cam.position.set(0,7.5,TZ+30);cam.lookAt(0,-1.5,TZ);
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
