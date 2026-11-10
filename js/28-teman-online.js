/* === BAGIAN 28: Teman Online (bertemu teman + pesan di atas kepala) ===
   Modul mandiri: tidak mengubah file 01-27. Dimuat paling akhir (setelah js/27). Tanpa SDK: REST + EventSource (streaming Firebase).
   Memakai global dari game: THREE, S (scene), P (pemain), pl, G, NM, ready, ts, key, INTR, EXM, CV,
   CH/person/pfIdx/PFG/D, SKN/HRC/EYC/PCC/SCC/OUT, charLife, mat.
   Ruang = kelas dari akhir nama murid. "Ahmad 4A" -> ruang "4a". Tanpa kelas -> ruang "umum".
   Data: /online/<ruang>/<id-perangkat>/ { n:nama, h:karakter, p:{x,y,z,r,i,sc,t}, m:{s,q,id,t} }
   Saklar guru (diubah lewat Firebase Console, nilai true/false):
     /config/aktif            -> false = fitur teman online mati total
     /config/chatBebas        -> false = ketik bebas mati (kalimat cepat tetap ada)
     /config/ruang/<ruang>/aktif dan /config/ruang/<ruang>/chatBebas -> berlaku untuk satu kelas saja
   Keamanan: pesan bebas maks 40 huruf, jeda 3 detik, filter kata kasar/nomor/tautan (juga saat menerima), tombol bisukan teman.
   Cara balik ke tampilan lama: hapus baris <script> js/28 di index.html. */
(function(){
if(window.TO)return;
const DB='https://miku-profesi-default-rtdb.asia-southeast1.firebasedatabase.app';
const POS_MS=500,BEAT_MS=6000,STALE=20000,GC=1800000,MAXLEN=40,GAP=3000,MAXSEE=14;
const Q=s=>document.querySelector(s);
const ld=k=>{try{return localStorage.getItem(k)}catch(e){return null}},sv=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const jp=t=>{try{return JSON.parse(t)}catch(e){return null}};
const num=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):(d||0)};
const enc=encodeURIComponent,toast=(h,ms)=>{try{ts(h,ms)}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let dev=ld('kp.dev');if(!dev){dev=Math.random().toString(36).slice(2,10);sv('kp.dev',dev)}
const me=()=>{try{return String(typeof NM!=='undefined'?NM:'').trim()}catch(e){return ''}};
const roomOf=n=>{const m=n.match(/(?:^|\s)(\d{1,2})\s*([A-Za-z])?\s*$/);return m?(m[1]+(m[2]||'')).toLowerCase():'umum'};
const jf=(p,o)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),9000);
 return fetch(DB+p,Object.assign({signal:c.signal},o||{})).then(r=>{clearTimeout(t);if(!r.ok)throw new Error(r.status);return r.json()},e=>{clearTimeout(t);throw e})};
const SVT={'.sv':'timestamp'};

/* ---------- Kalimat cepat (Arab + arti) ---------- */
const QP=[["السَّلَامُ عَلَيْكُمْ","Assalamu'alaikum"],["وَعَلَيْكُمُ السَّلَامُ","Wa'alaikumussalam"],["مَرْحَبًا","Halo"],["مَا اسْمُكَ؟","Siapa namamu?"],["كَيْفَ حَالُكَ؟","Apa kabarmu?"],["أَنَا بِخَيْرٍ","Aku baik"],["شُكْرًا","Terima kasih"],["عَفْوًا","Sama-sama"],["هَيَّا نَلْعَبْ","Ayo bermain"],["أَيْنَ أَنْتَ؟","Kamu di mana?"],["أَحْسَنْتَ","Bagus!"],["مَعَ السَّلَامَةِ","Sampai jumpa"],["👋",""],["😀",""],["👍",""],["❤️",""]];
const QSET=new Set(QP.map(x=>x[0]));

/* ---------- Filter pesan ---------- */
const cz=w=>w.replace(/(.)\1+/g,'$1');
const BL=['bangsat','bajingan','kontol','memek','ngentot','jancok','jancuk','keparat','brengsek','sialan','goblok','kampret','anjing','fuck','shit','bitch','pantek','pelacur','lonte'].map(cz);
const BT=['asu','tai','bego','tolol','bodoh','setan','idiot','bgst'].map(cz);
const LT={'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','@':'a','$':'s','!':'i'};
const bersih=t=>String(t==null?'':t).replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,MAXLEN);
function lolos(t){t=String(t||'');
 if(/https?:|www\.|\.(com|net|org|id|me|io|xyz|gg)\b|@/i.test(t))return false;
 if((t.match(/\d/g)||[]).length>=6)return false;
 const n=cz(t.toLowerCase().replace(/[013457@$!]/g,c=>LT[c]).replace(/[^a-z\s]/g,'')),j=n.replace(/\s+/g,''),tk=n.split(/\s+/);
 if(BL.some(w=>j.includes(w)))return false;
 if(tk.some(w=>BT.includes(w)))return false;
 return true}
const safeName=n=>{n=bersih(n).slice(0,20);return n&&lolos(n)?n:'Teman'};

/* ---------- Status ---------- */
let aktif=true,bebas=true,room='',cur='',joined=false,es=null,tree={},off=null,lastSend='',lastAt=0,lastMsg=0,lastHero='',retryAt=0,FR=[];
const RM={},MID={};let ownB=null,mute=jp(ld('kp.mute'))||[];if(!Array.isArray(mute))mute=[];

/* ---------- Karakter ---------- */
function heroData(){try{const h=G.hero||{},w=h.a||{},n=v=>typeof v==='number'&&isFinite(v)?v:undefined;
 return{g:h.g==='f'?'f':'m',sk:n(h.sk),hc:n(h.hc),ey:n(h.ey),pc:n(h.pc),sc:n(h.sc),hs:n(h.hs),pf:n(h.pf),cur:n(G.cur),hj:String(w.h).startsWith('hj')?1:0}}catch(e){return null}}
function build(h){try{
 const g=new THREE.Group(),f=h.g==='f',sk=SKN[h.sk]??SKN[1],hc=HRC[h.hc]??HRC[1],ec=EYC[h.ey]??EYC[0],oc=(OUT[h.cur]||OUT[0]).c;
 if(h.pf!=null&&typeof PFG!=='undefined'&&PFG[h.pf]){const ix=pfIdx(PFG[h.pf],h.g);person(D[ix].c,ix,sk,{f,hc,ec,hs:h.hs},g);return g}
 CH(g,{f,sk,hc,ec,pc:PCC[h.pc]??PCC[0],sc:SCC[h.sc]??SCC[0],hs:h.hs,hj:!!h.hj,om:()=>mat(oc),col:0xf6f6f6,btn:1,pk:f?0:1});
 return g}catch(e){console.warn('teman-online: gagal membuat karakter',e);return null}}

/* ---------- Sprite: nama dan gelembung pesan ---------- */
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function mkSprite(c,sw,sh){const t=new THREE.CanvasTexture(c);const m=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,depthWrite:false}));m.scale.set(sw,sh,1);m.renderOrder=20;S.add(m);return m}
function killSprite(m){if(!m)return;S.remove(m);try{m.material.map.dispose();m.material.dispose()}catch(e){}}
function nameTag(n){const c=document.createElement('canvas');c.width=384;c.height=96;const x=c.getContext('2d');
 x.font="700 44px 'Baloo 2',sans-serif";x.textAlign='center';x.textBaseline='middle';
 const tw=Math.min(364,x.measureText(n).width+40);x.fillStyle='rgba(29,43,83,.85)';rr(x,(384-tw)/2,10,tw,76,26);x.fill();x.fillStyle='#fff';x.fillText(n,192,50,330);
 return mkSprite(c,4.6,1.15)}
function bubble(txt){
 const ar=/[\u0600-\u06FF]/.test(txt),W=512,pad=24,fs=ar?50:38,fnt='700 '+fs+'px '+(ar?'Amiri,serif':"'Baloo 2',sans-serif");
 const c=document.createElement('canvas');c.width=W;c.height=10;let x=c.getContext('2d');x.font=fnt;
 const mw=W-pad*2-16,L=[];let cu='';
 txt.split(' ').forEach(w=>{const t=cu?cu+' '+w:w;if(cu&&x.measureText(t).width>mw){L.push(cu);cu=w}else cu=t});L.push(cu);
 const L2=L.slice(0,4),lh=fs*1.3,bh=Math.ceil(L2.length*lh+pad*1.2),H=bh+26;
 c.height=H;x=c.getContext('2d');x.font=fnt;
 x.fillStyle='#fff';x.strokeStyle='#1d2b53';x.lineWidth=7;rr(x,6,6,W-12,bh-6,28);x.fill();x.stroke();
 x.beginPath();x.moveTo(W/2-18,bh-3);x.lineTo(W/2,H-3);x.lineTo(W/2+18,bh-3);x.stroke();x.fillStyle='#fff';x.fillRect(W/2-14,bh-10,28,10);
 x.beginPath();x.moveTo(W/2-15,bh-4);x.lineTo(W/2,H-8);x.lineTo(W/2+15,bh-4);x.closePath();x.fill();
 x.fillStyle='#1d2b53';x.textAlign='center';x.textBaseline='middle';x.direction=ar?'rtl':'ltr';
 L2.forEach((l,i)=>x.fillText(l,W/2,6+(bh-6)/2+(i-(L2.length-1)/2)*lh));
 const sw=7.4,sh=sw*H/W,m=mkSprite(c,sw,sh);m.userData.h=sh;return m}
const dur=t=>Math.min(9000,4000+t.length*90);

/* ---------- Pesan sendiri ---------- */
function own(t){killSprite(ownB);ownB=bubble(t);ownB.userData.end=performance.now()+dur(t)}

/* ---------- Jaringan ---------- */
const myI=()=>{try{if((typeof EXM!=='undefined'&&(EXM.on||EXM.lie))||(typeof CV!=='undefined'&&CV)||document.body.classList.contains('cc'))return -2;return INTR.on&&INTR.b?INTR.b.i:-1}catch(e){return -1}};
function posObj(){const r=2;return{x:+P.position.x.toFixed(1),y:+P.position.y.toFixed(1),z:+P.position.z.toFixed(1),r:+P.rotation.y.toFixed(r),i:myI(),sc:+(P.scale.x||1).toFixed(2),t:SVT}}
const put=(path,val,ka)=>jf('/online/'+room+'/'+enc(dev)+'/'+path+'.json',{method:'PUT',body:JSON.stringify(val),headers:{'Content-Type':'application/json'},keepalive:!!ka}).catch(()=>{});
function setPath(path,data){const a=path.split('/').filter(Boolean);if(!a.length){tree=data&&typeof data==='object'?data:{};return}
 let o=tree;for(let i=0;i<a.length-1;i++){if(!o[a[i]]||typeof o[a[i]]!=='object')o[a[i]]={};o=o[a[i]]}
 if(data===null||data===undefined)delete o[a[a.length-1]];else o[a[a.length-1]]=data}
function after(){const mp=tree[dev]&&tree[dev].p;if(mp&&mp.t)off=Date.now()-mp.t}
function onPut(e){const m=jp(e.data);if(!m||typeof m.path!=='string')return;setPath(m.path,m.data);after()}
function onPatch(e){const m=jp(e.data);if(!m||typeof m.path!=='string'||!m.data)return;for(const k in m.data)setPath((m.path==='/'?'':m.path)+'/'+k,m.data[k]);after()}
function openEs(){try{es&&es.close()}catch(e){}
 es=new EventSource(DB+'/online/'+room+'.json');es.addEventListener('put',onPut);es.addEventListener('patch',onPatch);
 es.addEventListener('cancel',()=>ui('err'));es.onerror=()=>ui('err');es.onopen=()=>ui()}
function join(){const hd=heroData();if(!hd||typeof P==='undefined')return;tree={};off=null;
 jf('/online/'+room+'/'+enc(dev)+'.json',{method:'PUT',body:JSON.stringify({n:cur.slice(0,24),h:hd,p:posObj()}),headers:{'Content-Type':'application/json'}})
 .then(()=>{joined=true;lastHero=JSON.stringify(hd);lastSend='';lastAt=Date.now();openEs();ui()}).catch(()=>{retryAt=Date.now()+8000;ui('err')})}
function leave(ka){const was=joined;joined=false;try{es&&es.close()}catch(e){}es=null;
 if(was||ka){try{fetch(DB+'/online/'+room+'/'+enc(dev)+'.json',{method:'DELETE',keepalive:true}).catch(()=>{})}catch(e){}}
 Object.keys(RM).forEach(drop);tree={};off=null;FR=[];killSprite(ownB);ownB=null;ui()}
function boot(){
 const n=me();let okGame=false;try{okGame=typeof ready!=='undefined'&&ready&&typeof S!=='undefined'&&typeof P!=='undefined'&&typeof CH==='function'}catch(e){}
 const st=Q('#st'),menu=st&&getComputedStyle(st).display!=='none';
 if(!okGame||!n||menu||document.hidden||!aktif){if(joined)leave();return}
 if(joined&&n===cur)return;if(joined)leave();
 if(Date.now()<retryAt)return;cur=n;room=roomOf(n);join()}
function sendPos(){if(!joined||document.hidden)return;const now=Date.now(),p=posObj(),sig=[p.x,p.y,p.z,p.r,p.i,p.sc].join();
 if(sig===lastSend&&now-lastAt<BEAT_MS)return;lastSend=sig;lastAt=now;put('p',p)}
function beatHero(){if(!joined)return;const hd=heroData();if(!hd)return;const j=JSON.stringify(hd);if(j!==lastHero){lastHero=j;put('h',hd)}}
function cfg(){jf('/config.json').then(c=>{c=c&&typeof c==='object'?c:{};const r=(room&&c.ruang&&c.ruang[room])||{};
 aktif=(r.aktif!==undefined?r.aktif:c.aktif)!==false;bebas=(r.chatBebas!==undefined?r.chatBebas:c.chatBebas)!==false;ui()}).catch(()=>{})}

/* ---------- Teman di dunia 3D ---------- */
function drop(k){const r=RM[k];if(!r)return;if(r.g)S.remove(r.g);killSprite(r.tag);killSprite(r.bub);delete RM[k]}
function pesanOk(m){if(!m||typeof m.s!=='string')return '';const t=bersih(m.s);if(!t)return '';if(QSET.has(t))return t;return bebas&&lolos(t)?t:''}
function sync(){
 if(!joined||off===null){FR=[];Object.keys(RM).forEach(drop);return}
 const now=Date.now()-off,mi=myI(),seen={},fr=[];let shown=0;
 Object.keys(tree).forEach(k=>{if(k===dev)return;const d=tree[k];if(!d||typeof d!=='object'||!d.p||typeof d.p!=='object')return;
  const age=now-num(d.p.t,0,9e15,0);
  if(age>GC){if(Math.random()<.1)try{fetch(DB+'/online/'+room+'/'+enc(k)+'.json',{method:'DELETE'}).catch(()=>{})}catch(e){}return}
  if(age>STALE)return;
  const nm=safeName(d.n);fr.push({k,n:nm});seen[k]=1;
  const pi=Math.floor(+d.p.i),vis=mi!==-2&&pi!==-2&&pi===mi&&!mute.includes(k)&&shown<MAXSEE;
  let r=RM[k];const hs=JSON.stringify(d.h||{});
  if(r&&r.hs!==hs){drop(k);r=null}
  if(!r&&vis){const gg=build(d.h||{});r=RM[k]={hs,g:gg,n:'',tag:null,bub:null,end:0,tx:0,ty:0,tz:0,tr:0,sc:1,ph:0,first:true};if(gg){gg.visible=false;S.add(gg)}}
  if(r&&r.g){
   if(vis){shown++;r.tx=num(d.p.x,-400,400);r.ty=num(d.p.y,-5,60);r.tz=num(d.p.z,-400,400);r.tr=num(d.p.r,-10,10);r.sc=num(d.p.sc,.3,1.5,1);
    if(r.first){r.first=false;r.g.position.set(r.tx,r.ty,r.tz);r.g.rotation.y=r.tr}
    r.g.visible=true;if(r.n!==nm){killSprite(r.tag);r.tag=nameTag(nm);r.n=nm}}
   else{r.g.visible=false;if(r.tag)r.tag.visible=false;killSprite(r.bub);r.bub=null}}
  const m=d.m;
  if(m&&m.id&&MID[k]!==m.id){MID[k]=m.id;const t=pesanOk(m);
   if(t&&r&&r.g&&r.g.visible&&now-num(m.t,0,9e15,0)<8000){killSprite(r.bub);r.bub=bubble(t);r.end=performance.now()+dur(t)}}});
 Object.keys(RM).forEach(k=>{if(!seen[k])drop(k)});
 FR=fr}

let last=performance.now(),fr0=0,bad=0;
function frame(now){if(bad>8)return;requestAnimationFrame(frame);
 try{const dt=Math.min(.1,(now-last)/1000),t=now/1000;last=now;fr0++;
  if(fr0%6===0)sync();
  Object.keys(RM).forEach(k=>{const r=RM[k];if(!r||!r.g)return;const g=r.g;
   if(r.tag)r.tag.visible=g.visible;if(!g.visible)return;
   const dx=r.tx-g.position.x,dz=r.tz-g.position.z,dist=Math.hypot(dx,dz);
   if(dist>15){g.position.set(r.tx,r.ty,r.tz)}else{const q=Math.min(1,dt*7);g.position.x+=dx*q;g.position.z+=dz*q;g.position.y+=(r.ty-g.position.y)*Math.min(1,dt*12)}
   let da=r.tr-g.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));g.rotation.y+=da*Math.min(1,dt*10);
   const mv=dist>.35;if(mv)r.ph+=dt*12;const sw=Math.sin(r.ph)*(mv?.7:0);
   if(g.legL){g.legL.rotation.x=sw;g.legR.rotation.x=-sw;g.armL.rotation.x=-sw;g.armR.rotation.x=sw}
   g.scale.setScalar(r.sc);try{charLife(g,t,{idle:1,mv})}catch(e){}
   const base=g.position.y+(r.sc<1?4.6:6.1);
   if(r.tag)r.tag.position.set(g.position.x,base,g.position.z);
   if(r.bub){if(now>r.end){killSprite(r.bub);r.bub=null}else r.bub.position.set(g.position.x,base+.7+r.bub.userData.h/2,g.position.z)}});
  if(ownB){if(now>ownB.userData.end){killSprite(ownB);ownB=null}else ownB.position.set(P.position.x,P.position.y+8.0+ownB.userData.h/2,P.position.z)}
 }catch(e){bad++;console.warn('teman-online',e)}}

/* ---------- Tampilan: tombol 💬 + panel ---------- */
const css=document.createElement('style');css.textContent=`
#top{position:fixed;left:50%;bottom:max(8px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(94vw,560px);max-height:86vh;overflow:auto;background:#fffaf0;color:#1d2b53;border:4px solid #1d2b53;border-radius:18px;padding:10px 12px;z-index:70;font-family:'Baloo 2',sans-serif;display:none;box-shadow:0 6px 24px rgba(0,0,0,.35)}
#top .th{display:flex;justify-content:space-between;align-items:center;font-size:18px}
#top .th button{background:none;border:0;font-size:20px;cursor:pointer;color:#1d2b53}
#top .tl{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0;font-size:14px}
#top .tf{background:#f3ead2;border-radius:12px;padding:2px 8px;display:inline-flex;gap:4px;align-items:center}
#top .tf button{background:none;border:0;cursor:pointer;font-size:15px}
#top .tq{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
#top .tq button{background:#ffcf3f;border:3px solid #1d2b53;border-radius:14px;padding:4px 10px;cursor:pointer;color:#1d2b53;font-family:inherit;display:flex;flex-direction:column;align-items:center;line-height:1.15}
#top .tq .ar{font-family:Amiri,serif;font-size:19px;font-weight:700}
#top .tq small{font-size:11px;opacity:.8}
#top .ti{display:flex;gap:6px;margin-top:6px}
#top .ti input{flex:1;min-width:0;font:inherit;font-size:16px;padding:6px 10px;border:3px solid #1d2b53;border-radius:12px;background:#fff;color:#1d2b53}
#top .ti button{font:inherit;font-weight:700;border:3px solid #1d2b53;background:#2fa56b;color:#fff;border-radius:12px;padding:6px 14px;cursor:pointer}
#top .tn{font-size:12px;opacity:.85;margin-top:6px}`;
document.head.appendChild(css);
const pan=document.createElement('div');pan.id='top';pan.setAttribute('role','dialog');pan.setAttribute('aria-label','Teman online');
pan.innerHTML='<div class="th"><b>💬 Teman online <span id="tocn"></span></b><button id="tox" type="button" aria-label="Tutup">✖</button></div><div class="ti" id="toi"><input id="tot" maxlength="'+MAXLEN+'" placeholder="Ketik pesan (maks. '+MAXLEN+' huruf)" autocomplete="off" enterkeyhint="send"><button id="tos" type="button">Kirim</button></div><div class="tl" id="tol"></div><div class="tq" id="toq"></div><div class="tn" id="ton"></div>';
document.body.appendChild(pan);
['keydown','keyup','keypress'].forEach(ev=>pan.addEventListener(ev,e=>e.stopPropagation()));
['keydown','keyup'].forEach(ev=>addEventListener(ev,e=>{if(pan.contains(e.target))e.stopImmediatePropagation()},true));
const toq=Q('#toq');toq.innerHTML=QP.map((q,i)=>'<button type="button" data-q="'+i+'" title="'+esc(q[1])+'"><span class="ar" lang="ar">'+esc(q[0])+'</span>'+(q[1]?'<small>'+esc(q[1])+'</small>':'')+'</button>').join('');
let btn=null;
(function(){const st=Q('#stat');if(!st||Q('#tob'))return;btn=document.createElement('button');btn.className='pill mx';btn.id='tob';btn.type='button';btn.title='Teman online';
 btn.setAttribute('aria-label','Teman online dan pesan');btn.innerHTML='<span aria-hidden="true">💬</span><span class="bdg" id="ton2" aria-hidden="true"></span><span class="lb" aria-hidden="true">Teman</span>';
 st.insertBefore(btn,Q('#mu'));btn.onclick=()=>{pan.style.display==='block'?pan.style.display='none':openPanel()}})();
function openPanel(){try{for(const k in key)key[k]=0}catch(e){}pan.style.display='block';ui();draw()}
Q('#tox').onclick=()=>{pan.style.display='none'};
let lastDraw='';
function draw(){if(pan.style.display!=='block')return;
 const sig=JSON.stringify([FR,mute,joined,bebas]);if(sig===lastDraw)return;lastDraw=sig;
 Q('#tol').innerHTML=FR.length?FR.map(f=>'<span class="tf">'+esc(f.n)+'<button type="button" data-m="'+esc(f.k)+'" title="Bisukan / bunyikan">'+(mute.includes(f.k)?'🔇':'🔈')+'</button></span>').join(''):'<span class="tn">Belum ada teman lain di ruang ini.</span>';
 Q('#toi').style.display=bebas?'flex':'none';
 Q('#ton').textContent=bebas?'Jaga adab: tulis dengan sopan. Jangan tulis nomor HP, alamat, atau tautan.':'Ketik bebas sedang dimatikan oleh guru. Pakai kalimat cepat di atas ya.'}
function ui(st){const n=FR.length;const b=Q('#ton2');if(b)b.textContent=n>0?String(n):'';
 if(btn)btn.style.display=aktif?'':'none';if(!aktif)pan.style.display='none';
 const c=Q('#tocn');if(c)c.textContent=st==='err'?'· ☁️ belum tersambung':(joined?'· ruang '+room.toUpperCase()+' · '+n+' teman':'');draw()}
function kirim(text,quick){text=bersih(text);if(!text)return;
 if(!joined){toast('☁️ Belum tersambung ke teman. Coba lagi sebentar ya.',2500);return}
 if(!quick){if(!bebas){toast('Ketik bebas sedang dimatikan guru. Pakai kalimat cepat ya 🙂',2800);return}
  if(!lolos(text)){toast('Pesan tidak dikirim 🙏 Pakai kata yang sopan, tanpa nomor atau tautan.',3200);return}}
 const now=Date.now();if(now-lastMsg<GAP){toast('Tunggu sebentar ya…',1500);return}lastMsg=now;
 own(text);put('m',{s:text,q:quick?1:0,id:Math.random().toString(36).slice(2,8),t:SVT})}
pan.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.q!=null){const q=QP[+b.dataset.q];if(q)kirim(q[0],true);return}
 if(b.dataset.m){const k=b.dataset.m,i=mute.indexOf(k);if(i>=0)mute.splice(i,1);else mute.push(k);sv('kp.mute',JSON.stringify(mute));sync();draw();return}
 if(b.id==='tos'){const i=Q('#tot');kirim(i.value,false);i.value='';return}});
Q('#tot').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const i=e.target;kirim(i.value,false);i.value=''}});

/* ---------- Jalan ---------- */
cfg();setInterval(cfg,60000);
setInterval(boot,1000);setInterval(sendPos,POS_MS);setInterval(beatHero,15000);setInterval(()=>{if(pan.style.display==='block')draw()},1000);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&joined)leave(true)});
addEventListener('pagehide',()=>{if(joined)leave(true)});
requestAnimationFrame(frame);
window.TO={room:()=>room,kirim,leave,state:()=>({joined,room,aktif,bebas,teman:FR.length})};
})();
