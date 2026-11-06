// ================= AUDIO & SUARA =================
let ACX,muted=false,fa=0,fc=0,lowq=0;
function snd(f,d=.12,ty='square',v=.05){if(muted)return;try{ACX=ACX||new(window.AudioContext||window.webkitAudioContext)();if(ACX.state=='suspended')ACX.resume();const o=ACX.createOscillator(),g=ACX.createGain(),n=ACX.currentTime;o.type=ty;o.frequency.value=f;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(ACX.destination);o.start();o.stop(n+d)}catch(e){}}
let HASAR=true;function chkV(){try{const v=speechSynthesis.getVoices();if(v.length)HASAR=v.some(x=>/^ar/i.test(x.lang))}catch(e){HASAR=false}}
function showVn(){const e=$('#vn');if(!e)return;if(!HASAR){e.style.display='block';e.innerHTML='🔇 Perangkat ini belum punya suara Arab, jadi tombol 🔊 mungkin diam. Minta gurumu membacakan, atau pasang suara Arab di pengaturan Text-to-Speech.'}else e.style.display='none'}
function say(t){if(muted||!t)return;try{const u=new SpeechSynthesisUtterance(t.replace(/[\u064B-\u0652\u0670]/g,''));u.lang='ar-SA';u.rate=.8;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function bindSp(root){root.querySelectorAll('[data-sp]').forEach(e=>{e.onclick=()=>say(e.dataset.sp);if(e.tagName!='BUTTON'){e.tabIndex=0;e.setAttribute('role','button');e.onkeydown=ev=>{if(ev.key=='Enter'||ev.key==' '){ev.preventDefault();ev.stopPropagation();say(e.dataset.sp)}}}})}

// ================= STATE, MISI & SIMPAN =================
let coins=0,open=true,near=null,ready=false,mode=null;
const G={hero:{g:'m',sk:1,hc:1,hs:0,ey:0,pc:0,sc:0,a:{}},hs:0,oa:[],ws:Array(24).fill(0),st:{},seen:new Set(),md:new Set(),stb:{},q:0,own:[0],cur:0,kw:0,rf:[],rw:[],day:{d:'',ok:0,done:0,streak:0,last:''}};
const lsg=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const NM=lsg('kp.name')||'';const SK='kotaProfesi.v3'+(NM?':'+NM:'');
const cntLv=n=>pois.filter(p=>p.lv>=n).length,cntWs=()=>G.ws.filter(v=>v>=3).length,okc=t=>(G.st[t]&&G.st[t].ok)||0;
const MS=[
{id:'l',t:'Jago Kosakata',d:'Jawab benar 20 soal kosakata',g:20,v:()=>okc('v'),r:50},
{id:'c',t:'Ahli Dhamir Munfasil',d:'Jawab benar 10 soal هو / هي / أنت / أنا',g:10,v:()=>okc('mf'),r:60},
{id:'d',t:'Ahli Dhamir Muttasil',d:'Jawab benar 10 soal akhiran ـه ـها ـي ـك ـكِ',g:10,v:()=>okc('mt'),r:60},
{id:'e',t:'Juru Bicara',d:'Jawab benar 10 soal pola kalimat dan tanya-jawab',g:10,v:()=>okc('pj'),r:60},
{id:'f',t:'Raja Cita-cita',d:'Jawab benar 12 soal أُرِيدُ أَنْ أَكُونَ',g:12,v:()=>okc('ct'),r:70},
{id:'g',t:'Penerjemah Handal',d:'Jawab benar 12 soal terjemah kalimat',g:12,v:()=>okc('tr'),r:70},
{id:'h',t:'Penguasa Kosakata',d:'Kuasai 12 kosakata (3 kali jawab benar)',g:12,v:cntWs,r:80},
{id:'k',t:'Kilat Cerdas',d:'Menangkan 5 Tantangan Kilat',g:5,v:()=>G.kw||0,r:60},
{id:'p',t:'Penyusun Kalimat',d:'Jawab benar 10 soal susun kalimat',g:10,v:()=>okc('sk'),r:70},
{id:'n',t:'Pakar Tempat Kerja',d:'Jawab benar 10 soal kosakata tempat dan kegiatan',g:10,v:()=>okc('kt'),r:70},
{id:'s',t:'Rajin Berlatih',d:'Jawab benar 50 soal (kapan saja, tanpa batas hari)',g:50,v:()=>tc(),r:100},
{id:'a1',i:'🌱',t:'Langkah Pertama',d:'Raih lencana pertamamu dari seorang warga',g:1,v:()=>cntLv(1),r:20},
{id:'a2',i:'🏅',t:'Kolektor Lencana',d:'Raih lencana dari 6 warga',g:6,v:()=>cntLv(1),r:50},
{id:'a3',i:'⭐',t:'Bintang Pertama',d:'Raih 1 bintang emas (5/5 benar)',g:1,v:()=>cntLv(3),r:40},
{id:'a4',i:'🌟',t:'Kolektor Bintang',d:'Raih 12 bintang emas',g:12,v:()=>cntLv(3),r:150},
{id:'a5',i:'👑',t:'Bintang Sempurna',d:'Raih bintang emas dari semua 24 warga',g:24,v:()=>cntLv(3),r:300},
{id:'a6',i:'💬',t:'Teman Ngobrol',d:'Selesaikan percakapan dengan 5 warga',g:5,v:()=>Object.keys(G.dlg||{}).length,r:50},
{id:'a7',i:'🗣️',t:'Sahabat Warga',d:'Selesaikan percakapan dengan semua 24 warga',g:24,v:()=>Object.keys(G.dlg||{}).length,r:200},
{id:'a8',i:'🃏',t:'Pemain Pasangan',d:'Selesaikan mini game Pasangan Profesi di 3 tingkat',g:3,v:()=>Object.values((G.mg&&G.mg.best)||{}).filter(x=>x>0).length,r:60},
{id:'a9',i:'🧠',t:'Ingatan Emas',d:'Raih ⭐⭐⭐ di 3 tingkat mini game Pasangan',g:3,v:()=>Object.values((G.mg&&G.mg.best)||{}).filter(x=>x>=3).length,r:120},
{id:'b1',i:'👕',t:'Gaya Kota',d:'Miliki 3 warna baju (beli di 📋 → 🛍️ Toko)',g:3,v:()=>G.own.length,r:50},
{id:'b2',i:'🛍️',t:'Fashionista',d:'Miliki semua 6 warna baju',g:6,v:()=>G.own.length,r:150},
{id:'b3',i:'🔎',t:'Penjelajah Kotak',d:'Temukan 15 kosakata dari kotak ? ungu',g:15,v:()=>G.seen.size,r:70},
{id:'b4',i:'⚡',t:'Raja Kilat',d:'Menangkan 15 Tantangan Kilat',g:15,v:()=>G.kw||0,r:120},
{id:'b5',i:'🌍',t:'Pahlawan Dunia Nyata',d:'Selesaikan 5 Tugas Dunia Nyata',g:5,v:()=>G.rw.length,r:200},
{id:'b6',i:'💯',t:'Pelajar Hebat',d:'Jawab benar 100 soal (kapan saja)',g:100,v:()=>tc(),r:150},
{id:'b7',i:'🏆',t:'Master Soal',d:'Jawab benar 250 soal (kapan saja)',g:250,v:()=>tc(),r:300},
{id:'c1',i:'👷',t:'Cita-cita Terwujud',d:'Kenakan seragam profesi di 🎨 Gaya → 👷 Profesi',g:1,v:()=>G.hero.pf!=null?1:0,r:60},
{id:'b8',i:'🎯',t:'Penakluk Misi',d:'Selesaikan semua 14 misi petualangan',g:14,v:()=>G.q,r:250}];
const QS=[
{t:'Kenalan dengan Warga',s:'Raih 3 lencana dari warga mana saja',d:'Bicara dengan warga (tekan E / tombol Bicara), pelajari kartu materinya, lalu jawab 5 soal. Raih 3 lencana.',g:3,v:()=>cntLv(1),r:60,tg:'npc'},
{t:'Siapa Dia? هُوَ / هِيَ',s:'Ke Pos Dhamir Munfasil (hijau), benar ≥4 dari 5',d:'Datangi Pos Dhamir Munfasil (kotak hijau di minimap, dekat tempat mulai). Pelajari kartunya, lalu jawab minimal 4 dari 5 soal dengan benar.',g:4,v:()=>G.stb.mf||0,r:70,tg:'st:mf'},
{t:'Milikku, Milikmu',s:'Ke Pos Dhamir Muttasil (biru), benar ≥4 dari 5',d:'Datangi Pos Dhamir Muttasil (kotak biru). Pelajari akhiran ـهُ ـهَا ـي ـكَ ـكِ, lalu jawab minimal 4 dari 5 soal dengan benar.',g:4,v:()=>G.stb.mt||0,r:70,tg:'st:mt'},
{t:'Tanya-Jawab Seru',s:'Ke Pos Tanya-Jawab (oranye), benar ≥4 dari 5',d:'Datangi Pos Tanya-Jawab (kotak oranye). Pelajari مَنْ, مَا, أَيْنَ, هَلْ, lalu jawab minimal 4 dari 5 soal dengan benar.',g:4,v:()=>G.stb.pj||0,r:70,tg:'st:pj'},
{t:'Cita-citaku',s:'Jawab benar 6 soal أُرِيدُ أَنْ أَكُونَ (kuis warga)',d:'Soal cita-cita (أُرِيدُ أَنْ أَكُونَ ...) kini muncul 2 kali di setiap kuis warga. Jawab benar 6 soal.',g:6,v:()=>okc('ct'),r:80,tg:'any',ft:'ct'},
{t:'Penerjemah Cilik',s:'Jawab benar 6 soal terjemah kalimat (kuis warga)',d:'Soal terjemah kalimat kini muncul 2 kali di setiap kuis warga. Jawab benar 6 soal.',g:6,v:()=>okc('tr'),r:80,tg:'any',ft:'tr'},
{t:'Pemburu Kata',s:'Sentuh 8 kotak ? ungu untuk menemukan kata',d:'Sentuh kotak ? ungu yang melayang di kota. Setiap kotak membuka satu kosakata, dan kadang Tantangan Kilat.',g:8,v:()=>G.seen.size,r:60,tg:'box'},
{t:'Setengah Kota',s:'Raih 12 lencana',d:'Raih lencana dari 12 warga yang berbeda.',g:12,v:()=>cntLv(1),r:100,tg:'npc'},
{t:'Bintang Emas',s:'Raih 5 bintang emas (5/5 benar)',d:'Jawab semua 5 soal dengan benar pada 5 warga yang berbeda untuk mendapat ⭐⭐⭐.',g:5,v:()=>cntLv(3),r:120,tg:'npc'},
{t:'Juara Kota',s:'Raih lencana dari semua 24 warga',d:'Temui semua 24 warga dan raih lencana dari masing-masing.',g:24,v:()=>cntLv(1),r:200,tg:'npc'},
{t:'Duta Bahasa Nyata',s:'Selesaikan 2 Tugas Dunia Nyata (📋 → 🌍)',d:'Buka 📋 lalu tab 🌍 Dunia Nyata. Kerjakan bersama teman atau keluarga, centang setelah disaksikan guru atau teman.',g:2,v:()=>G.rw.length,r:150,tg:'book'},
{t:'Tukang Susun Kalimat',s:'Jawab benar 6 soal susun kalimat (kuis warga)',d:'Soal susun kata acak kini muncul 2 kali di setiap kuis warga. Ketuk kartu kata berurutan hingga kalimat benar. Jawab benar 6 soal.',g:6,v:()=>okc('sk'),r:80,tg:'any',ft:'sk'},
{t:'Kamus Tempat Kerja',s:'Jawab benar 6 soal kosakata tempat/kegiatan (kuis warga)',d:'Soal kosakata tempat kerja dan مَاذَا يَعْمَلُ؟ kini muncul 2 kali di setiap kuis warga. Jawab benar 6 soal.',g:6,v:()=>okc('kt'),r:80,tg:'any',ft:'kt'},
{t:'Pos Susun Kalimat',s:'Ke Pos Susun Kalimat (ungu), benar ≥4 dari 5',d:'Datangi Pos Susun Kalimat (kotak ungu, dekat Pos Tanya-Jawab). Pelajari pola kalimatnya, lalu susun kartu kata dan jawab minimal 4 dari 5 soal dengan benar.',g:4,v:()=>G.stb.sk||0,r:80,tg:'st:sk'}];
const RK=['Murid Baru','Penjelajah Kota','Pelajar Rajin','Pemburu Kata','Duta Bahasa','Juara Kota'];
const rank=()=>RK[Math.min(5,Math.floor(G.q/2))];
const pend=[];let startCele=[];
function dstr(o=0){return new Date(Date.now()-o*864e5).toLocaleDateString('sv-SE')}
const tc=()=>Object.values(G.st).reduce((a,s)=>a+(s.ok||0),0);
function dayOk(){return tc()%10}
function dayStreak(){return 0}
function onCorrect(){if(tc()%10==0){const d0=dstr();if(!G.bn||G.bn.d!==d0)G.bn={d:d0,n:0};if(G.bn.n<3){G.bn.n++;coins+=50;pend.push('🎯 Setiap 10 jawaban benar: bonus +50 🪙 ('+G.bn.n+'/3 hari ini)')}else pend.push('🎯 Bonus 10 jawaban benar hari ini sudah habis (maksimal 3 kali). Besok ada lagi!')}}
function checkMissions(){const r=[];MS.forEach(m=>{if(!G.md.has(m.id)&&m.v()>=m.g){G.md.add(m.id);coins+=m.r;r.push(m)}});if(r.length){snd(880,.2,'triangle');hud()}return r}
function checkQuests(){const r=[];while(G.q<QS.length&&QS[G.q].v()>=QS[G.q].g){coins+=QS[G.q].r;r.push(QS[G.q]);G.q++}if(r.length){snd(880,.2,'triangle');hud()}return r}
function checkAll(){return{q:checkQuests(),a:checkMissions()}}
function target(){const q=QS[G.q],tg=q?q.tg:'npc',nr=(arr,f)=>{let b=null,bd=1e9;arr.forEach(o=>{const p=f(o),d=Math.hypot(p[0]-pl.x,p[1]-pl.z);if(d<bd){bd=d;b=o}});return b};
if(tg.startsWith('st:')){const s=STN.find(x=>x.k==tg.slice(3));return{x:s.x,z:s.z,t:s.t}}
if(tg=='box'){const b=nr(IT.filter(o=>o.k=='q'&&o.m.visible),o=>[o.m.position.x,o.m.position.z]);if(b)return{x:b.m.position.x,z:b.m.position.z,t:'Kotak ?'}}
if(tg=='book')return{x:pl.x,z:pl.z,t:'Buka 📋 → 🌍 Dunia Nyata',b:1};let cand=tg=='any'?pois:pois.filter(p=>p.lv==0);if(!cand.length)cand=pois.filter(p=>p.lv<3);if(!cand.length)return null;
const p=nr(cand,o=>[o.n.position.x,o.n.position.z]);return{x:p.n.position.x,z:p.n.position.z,t:(p.lv?'⭐ ulangi: ':'')+p.d.pl}}
function updQt(){const q=QS[G.q],ok=dayOk(),st=dayStreak();let h;let dn=0;try{dn=dueN()}catch(e){}const du=dn?` · 🔁 ${dn} perlu diulang`:'';
if(q){const v=Math.min(q.v(),q.g);h=`<div class="qh">🎯 Misi ${G.q+1}/${QS.length} · ${rank()}</div><b>${q.t}</b><small>${q.s}</small><div class="bar"><i style="width:${v/q.g*100}%"></i></div><small>${v}/${q.g} · 🎯 ${ok}/10 menuju bonus${du}</small>`}
else h=`<div class="qh">🏆 ${rank()}</div><b>Semua misi selesai!</b><small>Raih ⭐⭐⭐ di semua warga.</small><small>🎯 ${ok}/10 menuju bonus${du}</small>`;
if(h!==lastQt){qtE.innerHTML=h;lastQt=h}}
function confetti(){if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const m=$('#modal'),w=document.createElement('div');w.className='cfw';for(let i=0;i<46;i++){const e=document.createElement('i');e.style.cssText=`left:${rnd(100)}%;background:${['#ffcf3f','#2fbf85','#ff6b5e','#3d9bff','#b06bff'][rnd(5)]};animation-delay:${Math.random()*.6}s;animation-duration:${1.6+Math.random()*1.4}s;transform:rotate(${rnd(360)}deg)`;w.appendChild(e)}m.appendChild(w);setTimeout(()=>w.remove(),3500)}
function celebrate(list){open=true;mode='cele';const m=$('#modal'),c=$('#card'),nx=QS[G.q];m.style.display='flex';
c.innerHTML=`<div class="center"><div style="font-size:54px">🎉</div><h2>Misi selesai!</h2></div>${list.map(x=>`<div class="mi done"><b>${x.t}</b> <small>+${x.r} 🪙</small></div>`).join('')}${nx?`<div class="gt">Misi berikutnya</div><div class="mi"><b>${nx.t}</b><br><small>${nx.d}</small></div>`:`<div class="center"><h2>🏆 Kamu Juara Kota!</h2><small>Terus raih ⭐⭐⭐ di semua warga.</small></div>`}<button class="opt go" id="x">Siap!</button>`;
confetti();[523,659,784,1047].forEach((f,k)=>setTimeout(()=>snd(f,.2,'triangle'),k*120));$('#x').onclick=closeBook}
function revNudge(){let n=0;try{n=dueN()}catch(e){}if(n<3||G.rvp===dstr()||G.rvd===dstr()||open)return;G.rvp=dstr();open=true;mode='cele';const m=$('#modal'),c=$('#card');m.style.display='flex';
c.innerHTML=`<div class="center"><div style="font-size:54px">🦉</div><h2>Pemanasan dulu, yuk!</h2></div><div class="ex">🔁 Ada <b>${n}</b> hal yang waktunya diulang. Mengulang sedikit demi sedikit di hari yang berbeda membuat ingatan lebih awet. Cuma 5 soal, tidak ada nilai jelek!</div><button class="opt go" id="rvg">Ayo pemanasan (5 soal) ▶</button><button class="opt" id="rvx">Nanti saja</button>`;
$('#rvx').onclick=closeBook;$('#rvg').onclick=()=>{closeBook();quiz({kind:'st',k:'ul',t:'🔁 Kuis Ulang Harian',ar:'مُرَاجَعَة'})}}
function kilat(){if(open)return;open=true;mode='kilat';const m=$('#modal'),c=$('#card');m.style.display='flex';
const pl2=Math.random()<.7?D.filter((_,k)=>G.ws[k]<3):[],pp=pl2.length?pl2:D,d=pp[rnd(pp.length)],q=gen(['v','mf','mt','pj','ct','tr','sk','kt'][rnd(8)],d);let locked=false,tm;const secs=q.tk?30:12;
c.innerHTML=`<h2>⚡ Tantangan Kilat!</h2><div class="who">${G.tmo?`Jawab dalam ${secs} detik`:'Tanpa batas waktu'}: +25 koin${q.sp?'<button class="opt spk" id="sp">🔊 Dengarkan</button>':''}</div><div class="tbar" style="display:none"><i style="animation-duration:${secs}s"></i></div><div class="q">${q.tk?'🧩 Susun kartu kata menjadi kalimat yang benar!':q.q}</div>${q.tk?'<div id="tp"></div><button class="opt spk" id="hn" style="margin-top:4px">💡 Petunjuk (gratis)</button>':q.o.map((x,k)=>`<button class="opt ${q.oa?'ar':''}" data-i="${k}">${x}</button>`).join('')}<div id="fb" role="status" aria-live="polite"></div>`;
if(q.sp)$('#sp').onclick=()=>say(q.sp);
function fin(right,b){if(locked)return;locked=true;clearTimeout(tm);c.querySelectorAll('#tp button,#hn,#tmb').forEach(x=>x.disabled=true);
c.querySelectorAll('.opt[data-i]').forEach(x=>{x.disabled=true;if(q.o[+x.dataset.i]===q.a)x.classList.add('ok')});
if(b&&!right)b.classList.add('no');
rec(q,right);let msg;
if(right){coins+=25;G.kw=(G.kw||0)+1;snd(988,.15,'triangle');msg=`<span style="color:#14744b">⚡ <span class="ar">مَا شَاءَ اللَّهُ</span> Cepat dan tepat! +25 koin</span>`}
else{snd(180,.25,'sawtooth');msg=`<span style="color:#b8352b">${b?'🦉 Belum tepat.':'⏰ Waktu habis!'} Jawaban benar ditandai hijau.</span>`}
hud();const r=checkAll(),pn=pend.splice(0);
$('#fb').innerHTML=msg+(q.ex?`<div class="ex">💡 ${q.ex}</div>`:'')+(pn.length?`<div class="ex">${pn.join('<br>')}</div>`:'')+(r.q.length?`<div class="mi done"><b>🎉 MISI SELESAI!</b><br>${r.q.map(x=>x.t).join(', ')}</div>`:'')+(r.a.length?`<div class="ex">🏅 Pencapaian: ${r.a.map(x=>x.t).join(', ')}</div>`:'')+`<button class="opt go" id="x">Lanjut</button>`;
if(r.q.length)confetti();
$('#x').onclick=()=>{m.style.display='none';open=false;mode=null};$('#x').scrollIntoView({block:'nearest'})}
if(q.tk)tapUI(c,q,fin);else c.querySelectorAll('.opt[data-i]').forEach(b=>b.onclick=()=>fin(q.o[+b.dataset.i]===q.a,b));
c.insertAdjacentHTML('beforeend','<button class="opt spk" id="tmb" style="margin-top:6px"></button>');
const bar=c.querySelector('.tbar'),tb=$('#tmb'),lab=()=>{tb.textContent=G.tmo?'⏱ Timer hidup (ketuk untuk mematikan)':'⏱ Timer mati (ketuk untuk tantangan waktu)'};
const startT=()=>{bar.style.display='';const f=bar.firstChild;f.style.animationName='none';void f.offsetWidth;f.style.animationName='';tm=setTimeout(()=>fin(false,null),secs*1000)},stopT=()=>{clearTimeout(tm);bar.style.display='none'};
tb.onclick=()=>{if(locked)return;G.tmo=!G.tmo;lab();G.tmo?startT():stopT();save()};lab();if(G.tmo)startT()}
function save(){if(window.NOSAVE)return;try{localStorage.setItem(SK,JSON.stringify({c:coins,lv:pois.map(p=>p.lv),ws:G.ws,st:G.st,seen:[...G.seen],md:[...G.md],stb:G.stb,q:G.q,own:G.own,cur:G.cur,day:G.day,kw:G.kw||0,rf:G.rf,rw:G.rw,dx:G.dx||[],hero:G.hero,hs:G.hs,oa:G.oa,bn:G.bn||null,lt:G.lt||{},tmo:G.tmo?1:0,rvd:G.rvd||'',rvn:G.rvn||0,rvp:G.rvp||'',dlg:G.dlg||{},mg:G.mg||{},ex:G.ex||null}))}catch(e){}}
function load(){try{return JSON.parse(lsg(SK)||(NM?null:lsg('kotaProfesi.v2')))}catch(e){return null}}
function hud(){$('#co').textContent=coins;{let n=0;try{n=dueN()}catch(e){}const e=$('#rvn');if(e)e.textContent=n?String(n):'';const rb=$('#rvb');if(rb)rb.setAttribute('aria-label','Kuis ulang harian'+(n?', '+n+' perlu diulang':''))}$('#bd').textContent=pois.filter(p=>p.lv>0).length;if(ready)save()}
const LI=[1,2,4,7];
const qkey=q=>q.k||q.t+(q.w!=null?':'+q.w:'');
const lvOf=q=>{const e=(G.lt||{})[qkey(q)];return e?e.b:0};
const dueN=()=>Object.values(G.lt||{}).filter(e=>e.due<=dstr()).length;
function ltUp(q,good){G.lt=G.lt||{};const k=qkey(q),t=dstr(),e=G.lt[k];
if(!e){const b=good?1:0;G.lt[k]={b,due:dstr(-LI[b])}}else if(!good){e.b=0;e.due=dstr(-LI[0])}else if(e.due<=t){e.b=Math.min(3,e.b+1);e.due=dstr(-LI[e.b])}}
function buildRv(){const t=dstr(),due=Object.entries(G.lt||{}).filter(([k,e])=>e.due<=t).sort((a,b)=>a[1].b-b[1].b||(a[1].due<b[1].due?-1:1)),out=[],cnt={};
const okT=x=>(x!='mt'||G.stb.mt!==undefined)&&(x!='pj'||G.stb.pj!==undefined);
for(const [k] of due){if(out.length>=5)break;const j=k.indexOf(':'),tp=j<0?k:k.slice(0,j),w=j<0?'':k.slice(j+1);if(!gen_t(tp)||!okT(tp)||(cnt[tp]||0)>=2)continue;
const d=/^\d+$/.test(w)?D[+w]:D[rnd(D.length)];let q=null;for(let n=0;n<40;n++){const x=gen(tp,d);if(qkey(x)===k){q=x;break}}
out.push(q||gen(tp,d));cnt[tp]=(cnt[tp]||0)+1}
const pool=['v','mf','tr','ct','sk','kt'].concat(G.stb.mt!==undefined?['mt']:[],G.stb.pj!==undefined?['pj']:[]);
const wk=D.filter((_,k)=>G.ws[k]<3);
while(out.length<5){const tp=pickTypes(pool,1)[0],d=(wk.length?wk:D)[rnd((wk.length?wk:D).length)];out.push(gen(tp,d))}
return sh(out)}
const gen_t=t=>['v','mf','mt','pj','ct','tr','sk','kt'].includes(t);
function rec(q,right){const s=G.st[q.t]||(G.st[q.t]={ok:0,n:0});s.n++;ltUp(q,right&&!q.hn);if(right){s.ok++;onCorrect();if(q.w!=null)G.ws[q.w]=Math.min(9,G.ws[q.w]+1)}else if(q.w!=null)G.ws[q.w]=Math.max(0,G.ws[q.w]-1)}
function weak(t){const s=G.st[t];return 1.4-(s&&s.n?s.ok/s.n:.5)}
function pickTypes(pool,n){const r=[],p=[...pool];while(r.length<n&&p.length){const w=p.map(weak),tot=w.reduce((a,b)=>a+b,0);let x=Math.random()*tot,i=0;while(i<p.length-1&&(x-=w[i])>0)i++;r.push(p.splice(i,1)[0])}return r}
