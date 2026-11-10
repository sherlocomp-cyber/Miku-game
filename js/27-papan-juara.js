/* === BAGIAN 27: Papan Juara (leaderboard) ===
   Modul mandiri (tidak mengubah file 01-26). Dimuat paling akhir. Pasangan: css/papan.css
   1) Papan fisik di kota (dekat tempat mulai) menampilkan 5 juara teratas, dan muncul di peta mini sebagai 🏆.
      Dekati papan lalu ketuk tombol 🏆 (atau tekan L) untuk membuka daftar lengkap.
   2) Tombol 🏆 Juara di HUD (di HP: di dalam menu ☰) membuka daftar lengkap kapan saja. Urut: Skor / Lencana / Bintang.
   3) Data: tiap murid menulis ringkasannya ke Firebase /papan/<nama> (nama, skor, lencana, bintang, koin, misi, benar).
      Murid lain hanya membaca. Bila /papan kosong atau tidak terbaca, daftar dibaca dari /siswa (ringkasan dari js/26).
   4) Tab 📝 Ujian (ujian akhir, 40 soal -> nilai 0-100) dan 🎯 SAS (simulasi SAS, nilai 0-100). Tingkatan: Mahir >=80, Berkembang >=60, selain itu Perlu bimbingan.
      Disimpan sebagai ua dan sx di /papan/<nama>; hanya nilai terbaik yang dikirim.
   Aturan aman: skor di papan TIDAK pernah ditimpa skor yang lebih rendah. Tombol "Mulai dari awal" ikut menghapus catatan papan.
   Nama murid selalu di-escape sebelum ditampilkan. Rumus skor sama dengan js/26 (lencana 50, bintang 30, benar 3, misi 20, pencapaian 10).
   Cara balik ke tampilan lama: hapus baris <script> js/27 dan <link> css/papan.css di index.html. */
(function(){
if(window.PJ)return;
const DB='https://miku-profesi-default-rtdb.asia-southeast1.firebasedatabase.app',NODE='papan',SRC='siswa';
const Q=s=>document.querySelector(s);
const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const jp=t=>{try{return JSON.parse(t)}catch(e){return null}};
const nm=(typeof NM!=='undefined'?NM:'').trim(),KS=typeof SK!=='undefined'?SK:'kotaProfesi.v3';
const key=nm.toLowerCase().replace(/[.#$\[\]\/\s]+/g,'_');
const num=(v,m)=>{v=+v;return isFinite(v)&&v>0?Math.min(Math.floor(v),m||99999):0};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jam=t=>new Date(t).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
const toast=(h,ms)=>{try{ts(h,ms)}catch(e){}};
const ring=d=>({lencana:(d.lv||[]).filter(v=>v>0).length,bintang:(d.lv||[]).filter(v=>v>=3).length,koin:d.c|0,misi:d.q|0,benar:Object.values(d.st||{}).reduce((a,x)=>a+((x&&x.ok)|0),0)});
const skor=d=>{const r=ring(d);return r.lencana*50+r.bintang*30+r.benar*3+r.misi*20+(d.md||[]).length*10};
const pth=()=>'/'+NODE+'/'+encodeURIComponent(key)+'.json';
const jf=(p,o)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),9000);
 return fetch(DB+p,Object.assign({signal:c.signal},o||{})).then(r=>{clearTimeout(t);if(!r.ok)throw new Error(r.status);return r.json()},e=>{clearTimeout(t);throw e})};

/* ---------- 1) Simpan ringkasan sendiri ---------- */
let ok=false,cs=0,last='',rst=false;try{rst=!!sessionStorage.getItem('kp.fbreset')}catch(e){}
const UAN=40,nU=d=>{const b=+(d&&d.ex&&d.ex.best);return isFinite(b)&&b>0?Math.min(100,Math.round(Math.min(b,UAN)/UAN*100)):0};
const nX=o=>{const v=o&&typeof o==='object'?+o.nilai:0;return isFinite(v)&&v>0?Math.min(100,Math.round(v)):0};
function me(){const d=jp(g(KS));if(!d||typeof d!=='object')return null;return Object.assign({nama:nm,skor:skor(d),ts:Date.now(),ua:nU(d),sx:nX(jp(g('kp.sasx')))},ring(d))}
function up(ka){if(!ok||!key)return;const m=me();if(!m||!m.skor||m.skor<cs)return;
 const sig=[m.skor,m.lencana,m.bintang,m.koin,m.misi,m.benar,m.ua,m.sx].join();if(sig===last)return;
 fetch(DB+pth(),{method:'PUT',body:JSON.stringify(m),headers:{'Content-Type':'application/json'},keepalive:!!ka}).then(r=>{if(r.ok){last=sig;cs=m.skor}}).catch(()=>{})}
function init(){if(ok||!key||init.b)return;init.b=1;
 (rst?jf(pth(),{method:'DELETE'}).then(()=>null):jf(pth())).then(o=>{cs=o&&typeof o==='object'?num(o.skor):0;rst=false;ok=true;up()}).catch(()=>{}).then(()=>{init.b=0})}

/* ---------- 2) Baca daftar juara ---------- */
function norm(k,v,fb){if(!v||typeof v!=='object')return null;
 const nama=String(v.nama||'').trim().slice(0,24);if(!nama)return null;
 const r=fb?(v.ringkas&&typeof v.ringkas==='object'?v.ringkas:{}):v;let s=num(r.skor),ua=num(r.ua,100),sx=num(r.sx,100);
 if(fb){const d=typeof v.data==='string'?jp(v.data):null;s=d&&typeof d==='object'?skor(d):num(r.lencana)*50+num(r.bintang)*30+num(r.benar)*3+num(r.misi)*20;ua=nU(d);sx=nX(typeof v.sasx==='string'?jp(v.sasx):null)}
 return{k,nama,skor:s,lencana:num(r.lencana,24),bintang:num(r.bintang,24),koin:num(r.koin),misi:num(r.misi,14),benar:num(r.benar),ua,sx,ts:+v.ts||0}}
const pick=(o,fb)=>o&&typeof o==='object'?Object.keys(o).map(k=>norm(k,o[k],fb)).filter(x=>x&&(x.skor>0||x.lencana>0)):[];
let cache=null,loading=null;
function load(force){
 if(!force&&cache&&Date.now()-cache.t<45000)return Promise.resolve(cache);
 if(loading)return loading;
 loading=jf('/'+NODE+'.json').then(o=>{const a=pick(o,0);if(!a.length)throw 0;return{a,src:NODE}})
  .catch(()=>jf('/'+SRC+'.json').then(o=>({a:pick(o,1),src:SRC})))
  .then(r=>{cache={a:r.a,src:r.src,t:Date.now()};return cache})
  .finally(()=>{loading=null});
 return loading}

/* ---------- 3) Daftar lengkap (kartu) ---------- */
let tab='s',view='load';
const TT={s:'🏆 Skor',l:'🏅 Lencana',b:'⭐ Bintang',u:'📝 Ujian',x:'🎯 SAS'},MED=['🥇','🥈','🥉'];
const tier=n=>n>=80?'🌟 Mahir':n>=60?'👍 Berkembang':'🌱 Perlu bimbingan';
const ttl=m=>{try{return RK[Math.min(5,Math.floor(m/2))]}catch(e){return ''}};
const val=x=>({s:x.skor,l:x.lencana,b:x.bintang,u:x.ua,x:x.sx})[tab];
function sorted(a){const r=a.filter(x=>tab!=='u'&&tab!=='x'||val(x)>0).sort((p,q)=>val(q)-val(p)||q.skor-p.skor||p.nama.localeCompare(q.nama));let pr=0,pv=null;r.forEach((x,i)=>{const v=val(x);x.r=v===pv?pr:i+1;pr=x.r;pv=v});return r}
function row(x){return `<div class="pjr${x.k===key?' me':''}"><span class="pjn">${MED[x.r-1]||x.r}</span><span class="pjm"><b>${esc(x.nama)}</b><small>${esc(ttl(x.misi))} · 🪙 ${x.koin}</small></span><span class="pjs">${tab==='u'||tab==='x'?esc(tier(val(x))):'🏅'+x.lencana+'/24 ⭐'+x.bintang}</span><span class="pjv">${val(x)}</span></div>`}
function card(){const c=Q('#card');if(!c)return;
 let h=`<h2>🏆 Papan Juara</h2><div class="who">Lihat pencapaian teman-temanmu dan semangat belajar bersama!</div><div class="tabs">${Object.keys(TT).map(k=>`<button class="opt${k===tab?' on':''}" data-t="${k}">${TT[k]}</button>`).join('')}</div>`;
 if(view==='load')h+='<div class="ex">⏳ Mengambil daftar juara…</div>';
 else if(view==='err'){const m=me();h+=`<div class="ex">☁️ Belum tersambung ke internet, jadi daftar teman belum bisa dimuat.${m?`<br>Pencapaianmu: 🏅 ${m.lencana}/24 · ⭐ ${m.bintang} · ${m.skor} poin`:''}</div>`}
 else{const L=sorted(view.a),n=L.length,i=L.findIndex(x=>x.k===key),top=L.slice(0,30);if(i>=30)top.push(L[i]);
  if(tab==='u'||tab==='x')h+='<div class="fc">'+(tab==='u'?'Nilai ujian akhir = jawaban benar terbaik dari 40 soal.':'Nilai terbaik simulasi SAS.')+' Mahir ≥80 · Berkembang ≥60 · selain itu Perlu bimbingan. Ini latihan, bukan nilai rapor.</div>';
  h+=i>=0?`<div class="mi done">Peringkatmu: <b>#${L[i].r}</b> dari ${n} murid${tab==='u'||tab==='x'?' · '+esc(tier(val(L[i]))):''}</div>`:tab==='u'||tab==='x'?`<div class="ex">Kamu belum punya nilai ${tab==='u'?'ujian akhir':'simulasi SAS'}. Kerjakan dulu, lalu tunggu sekitar 10 detik ya!</div>`:`<div class="ex">${key?'Kamu belum masuk papan. Jawab beberapa soal, lalu tunggu sekitar 10 detik ya!':'Tulis namamu di layar awal supaya masuk papan.'}</div>`;
  h+=n?top.map(row).join(''):'<div class="ex">Belum ada juara'+(tab==='u'||tab==='x'?' di tab ini':'')+'. Jadilah yang pertama! 🌟</div>';
  h+=`<div class="pjf">Diperbarui ${jam(view.t)} · yang tampil hanya nama dan pencapaian</div>`}
 h+='<div class="pjb"><button class="opt spk" id="pjr">🔄 Segarkan</button></div><button class="opt go" id="x">Tutup</button>';
 c.innerHTML=h;
 c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;card()});
 const r=c.querySelector('#pjr');if(r)r.onclick=()=>{view='load';card();load(true).then(x=>{view=x}).catch(()=>{view=cache||'err'}).then(()=>{if(mode==='lb')card()})};
 const x=c.querySelector('#x');if(x)x.onclick=closeBook}
function show(){if(open)return;open=true;mode='lb';Q('#modal').style.display='flex';try{snd(660,.1,'triangle')}catch(e){}
 view=cache||'load';card();
 load(false).then(r=>{view=r}).catch(()=>{view=cache||'err'}).then(()=>{if(mode==='lb')card()})}

/* ---------- 4) HUD: tombol 🏆 + tombol dekat papan + peta mini ---------- */
(function(){const st=Q('#stat');if(!st||Q('#lbb'))return;const b=document.createElement('button');b.className='pill mx';b.id='lbb';b.type='button';b.title='Papan Juara';
 b.setAttribute('aria-label','Papan Juara: lihat pencapaian teman');b.innerHTML='<span aria-hidden="true">🏆</span><span class="lb" aria-hidden="true">Juara</span>';
 st.insertBefore(b,Q('#mu'));b.onclick=()=>{if(!open)show()}})();
const btn=document.createElement('button');btn.id='lbn';btn.type='button';btn.textContent='🏆 Lihat Papan Juara';btn.onclick=()=>{if(!open)show()};document.body.appendChild(btn);
const ovc=document.createElement('canvas');ovc.id='lbm';ovc.width=240;ovc.height=220;document.body.appendChild(ovc);const c2=ovc.getContext('2d');
addEventListener('keydown',e=>{if(mode!=='lb')return;const k=e.key.toLowerCase();if(k==='escape'||k==='enter'||k==='m'||k==='l')closeBook();if(k===' '||k.startsWith('arrow'))e.preventDefault();e.stopImmediatePropagation()},true);
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='l'&&!open&&!e.ctrlKey&&!e.metaKey&&!/INPUT|TEXTAREA/.test(e.target.tagName)&&Q('#st')&&Q('#st').style.display==='none')show()});
{const T0=window.talk;if(typeof T0==='function')window.talk=function(){if(!open&&nbs&&!near)return show();return T0.apply(this,arguments)}}

/* ---------- 5) Papan 3D di kota ---------- */
const cv=document.createElement('canvas');cv.width=512;cv.height=384;const cx=cv.getContext('2d');
let B=null,tex=null,nbs=false,lastHint=-1e9,lastRef=0,fr=0,bad=0;
function paint(a,msg){if(!tex)return;const w=512,h=384;
 cx.clearRect(0,0,w,h);cx.fillStyle='#fffaf0';cx.fillRect(0,0,w,h);cx.fillStyle='#ffcf3f';cx.fillRect(0,0,w,104);
 cx.lineWidth=12;cx.strokeStyle='#1d2b53';cx.strokeRect(6,6,w-12,h-12);
 cx.fillStyle='#1d2b53';cx.textAlign='center';cx.textBaseline='alphabetic';cx.direction='ltr';cx.font="700 44px 'Baloo 2',sans-serif";cx.fillText('🏆 Papan Juara',w/2,58);
 cx.direction='rtl';cx.font='700 30px Amiri,serif';cx.fillText('لَوْحَةُ الشَّرَفِ',w/2,94);cx.direction='ltr';
 const L=a?a.slice().sort((p,q)=>q.skor-p.skor||p.nama.localeCompare(q.nama)).slice(0,5):[];
 if(!L.length){cx.font="700 28px 'Baloo 2',sans-serif";cx.fillText(a?'Belum ada juara':(msg||'Memuat…'),w/2,234);if(a){cx.font="600 24px 'Baloo 2',sans-serif";cx.fillText('Jadilah yang pertama! 🌟',w/2,276)}}
 L.forEach((x,i)=>{const y=150+i*46;if(i%2){cx.fillStyle='#f3ead2';cx.fillRect(18,y-34,w-36,44)}
  cx.fillStyle='#1d2b53';cx.textAlign='left';cx.font='700 32px serif';cx.fillText(['🥇','🥈','🥉','4','5'][i],32,y);
  cx.font="700 28px 'Baloo 2',sans-serif";let n=x.nama;while(n.length>1&&cx.measureText(n).width>270)n=n.slice(0,-1);if(n!==x.nama)n=n.slice(0,-1)+'…';cx.fillText(n,88,y);
  cx.textAlign='right';cx.font="700 30px 'Baloo 2',sans-serif";cx.fillText(String(x.skor),w-34,y)});
 tex.needsUpdate=true}
function place(){
 if(typeof TR==='undefined'||!TR.length||typeof BLD==='undefined'||!BLD.length||typeof pois==='undefined'||!pois.length||typeof STN==='undefined'||typeof pl==='undefined')return;
 const V=typeof VEH!=='undefined'?VEH:[],C=[[14,14],[-14,14],[14,27],[-14,27],[15,-14],[-15,-14],[14,-27],[-14,-27]];
 const free=c=>!TR.some(t=>Math.abs(t[0]-c[0])<9&&Math.abs(t[1]-c[1])<6)&&!GB.some(b=>Math.abs(b[0]-c[0])<12&&Math.abs(b[1]-c[1])<8)&&!BLD.some(b=>Math.abs(b.x-c[0])<18&&Math.abs(b.z-c[1])<14)&&!STN.some(s=>Math.hypot(s.x-c[0],s.z-c[1])<12)&&!pois.some(p=>Math.hypot(p.nx-c[0],p.nz-c[1])<8)&&!V.some(v=>Math.hypot(v.m.position.x-c[0],v.m.position.z-c[1])<9);
 const p=C.find(free)||C[0],x=p[0],z=p[1],W=0x6b4a2b;
 box(10.6,.5,2.4,0xcfc9bc,x,.25,z+.2);[-4.8,4.8].forEach(o=>box(.6,8.2,.6,W,x+o,4.35,z-.1));box(10,7.4,.5,W,x,5.7,z-.1);box(10.8,.6,1.6,0xffcf3f,x,9.6,z+.1);
 tex=new THREE.CanvasTexture(cv);tex.anisotropy=4;const sg=new THREE.Mesh(new THREE.PlaneGeometry(9,6.75),new THREE.MeshBasicMaterial({map:tex}));sg.position.set(x,5.7,z+.18);S.add(sg);
 const tr=esprite('🏆');tr.scale.set(5,5,1);tr.position.set(x,12.2,z);S.add(tr);wall(x,z,5.4,1.4);
 B={x,z,tr};lastRef=Date.now();paint(null,'Memuat…');
 load().then(r=>paint(r.a)).catch(()=>paint(null,'Belum tersambung ☁️'));
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(cache)paint(cache.a);else paint(null,'Memuat…')})}
function mini(){const mm=Q('#mm');if(!mm)return;const r=mm.getBoundingClientRect();
 if(!r.width||document.body.classList.contains('cc')){ovc.style.display='none';return}
 const pt=parseFloat(getComputedStyle(mm).paddingTop)||0,s=ovc.style;
 s.display='block';s.left=(r.left+mm.clientLeft)+'px';s.top=(r.top+mm.clientTop+pt)+'px';s.width=mm.clientWidth+'px';s.height=(mm.clientHeight-pt)+'px';
 const X=(B.x+220)/440*240,Z=(B.z+190)/380*220;c2.clearRect(0,0,240,220);c2.fillStyle='#ffcf3f';c2.beginPath();c2.arc(X,Z,12,0,7);c2.fill();c2.lineWidth=3;c2.strokeStyle='#1d2b53';c2.stroke();
 c2.font='18px serif';c2.textAlign='center';c2.textBaseline='middle';c2.fillText('🏆',X,Z+1)}
function tick(now){if(bad>5)return;requestAnimationFrame(tick);fr++;
 try{
  if(!B){if(fr%20===0)place();return}
  B.tr.position.y=12.2+Math.sin(now/500)*.4;
  if(fr%6)return;
  let hid=open||document.body.classList.contains('cc');
  try{hid=hid||(typeof EXM!=='undefined'&&(EXM.on||EXM.lie))||INTR.on||!!RID||getComputedStyle(Q('#glh')).display!=='none'}catch(e){}
  const d=Math.hypot(pl.x-B.x,pl.z-(B.z+5)),nb=!hid&&d<11;
  if(nb!==nbs){nbs=nb;btn.style.display=nb?'block':'none'}
  if(nb&&now-lastHint>40000){lastHint=now;toast('🏆 <b>Papan Juara</b>: lihat pencapaian teman! Ketuk tombol 🏆 atau tekan L.',4000)}
  if(!hid&&d<60&&Date.now()-lastRef>90000){lastRef=Date.now();load(true).then(r=>paint(r.a)).catch(()=>{})}
  mini()
 }catch(e){bad++;console.warn('papan',e)}}
requestAnimationFrame(tick);

/* ---------- 6) Jalan ---------- */
init();
setInterval(()=>{if(!ok){init();return}if(typeof ready!=='undefined'&&ready)up()},12000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)up(true)});
addEventListener('pagehide',()=>up(true));
window.PJ={show,sync:()=>up(),load,url:DB+'/'+NODE+'.json'};
})();
