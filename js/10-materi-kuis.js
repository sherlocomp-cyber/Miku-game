// ================= KARTU MATERI =================
function materiNPC(p){const d=p.d,g=d.g,P=PRO(g),lk=g=='m'?'lk':'pr',mh=g=='m'?'مِهْنَتُهُ':'مِهْنَتُهَا';
const qf=(QS[G.q]||{}).ft,r=(ar,id,sp,hl)=>`<div class="pat${hl?' hl':''}" data-sp="${sp||ar}"><span class="ar">${ar}</span><small>${id}</small></div>`;
let h=`<h2>${d.e} ${d.pl}</h2><div class="who">Warga: <span class="ar" style="font-size:20px">${d.n}</span></div><div class="ex">${d.e} <b>${PERS[D.indexOf(d)][0]}</b> · ${PERS[D.indexOf(d)][1]}<br>“${PERS[D.indexOf(d)][2]}”</div>
<div class="wd" data-sp="${d.ar}"><span class="ar big">${d.ar}</span><span>= <b>${d.id}</b></span><button class="opt spk" aria-label="Dengarkan">🔊</button></div>
<div class="gt">Pola kalimat (ketuk untuk mendengar):</div>`;
h+=r(`${DEM(g)} ${d.n}، ${P} ${d.ar}`,`Ini (nama), dia ${d.id}. ${P} dipakai untuk ${lk}.`);
h+=r(`هَلْ ${P} ${d.ar}؟ نَعَمْ، ${P} ${d.ar}`,`Apakah dia ${d.id}? Ya, dia ${d.id}.`);
h+='<!--PG-->';h+=r(`${mh} ${d.ar}`,`Profesinya (${lk}) adalah ${d.id}. (${g=='m'?'ـهُ':'ـهَا'} = -nya)`);
h+=r(`أُرِيدُ أَنْ أَكُونَ ${d.ac}`,`Saya ingin menjadi ${d.id}. (setelah أَنْ أَكُونَ → tanwin fathah)`,null,qf=='ct');
h+=r(AR[p.i],AC[p.i],null,qf=='tr');
if(d.pa)h+=r(`${P} ${g=='m'?'يَعْمَلُ':'تَعْمَلُ'} فِي ${d.pa}`,`Dia bekerja di ${d.pl.toLowerCase()}.`);
return h}

// ================= KUIS =================
function tapUI(c,q,ans,ff){const tp=c.querySelector('#tp'),bank=sh(q.tk.map(t=>({t}))),built=[];let done=false,tw=false;
const draw=()=>{const full=built.length==q.tk.length;tp.innerHTML=`<div class="tpa ar">${built.length?built.map((x,j)=>`<button class="tc on" data-b="${j}">${x.t}</button>`).join(''):'<span class="tph">Ketuk kartu di bawah sesuai urutan ⬇</span>'}</div><div class="tpb ar">${bank.map((x,j)=>`<button class="tc${built.includes(x)?' used':''}" data-k="${j}"${built.includes(x)?' disabled':''}>${x.t}</button>`).join('')}</div><div class="tpr"><button class="opt" id="tkU">↩ Ulang</button><button class="opt go" id="tkC"${full?'':' disabled'}>✔ Periksa</button></div>`;
tp.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{if(done)return;built.push(bank[+b.dataset.k]);snd(500+built.length*70,.06,'triangle');draw()});
tp.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{if(done)return;built.splice(+b.dataset.b,1);draw()});
tp.querySelector('#tkU').onclick=()=>{if(done)return;built.length=0;draw()};
tp.querySelector('#tkC').onclick=()=>{if(done||built.length!=q.tk.length)return;done=true;const right=built.map(x=>x.t).join(' ')===q.a;if(!right&&ff&&!tw){tw=true;done=false;ff();let n=0;while(n<built.length&&built[n].t===q.tk[n])n++;built.length=n;const fb=c.querySelector('#fb');if(fb)fb.innerHTML='<span style="color:#8a5200">🦉 Hampir! Kartu yang sudah benar tetap dipasang. Susun sisanya lagi.</span>';draw();return}tp.querySelector('.tpa').classList.add(right?'good':'bad');tp.querySelectorAll('button').forEach(b=>b.disabled=true);ans(right,null)}};
const hn=c.querySelector('#hn');hn.onclick=e=>{if(done)return;q.hn=true;let n=0;while(n<built.length&&built[n].t===q.tk[n])n++;built.length=n;if(n>=q.tk.length)return;const x=bank.find(b=>b.t===q.tk[n]&&!built.includes(b));if(!x)return;built.push(x);e.currentTarget.disabled=true;draw()};
draw()}
function quiz(p){open=true;mode='quiz';const st=p.kind=='st',m=$('#modal'),c=$('#card');m.style.display='flex';
let Q,i=0,ok=0,locked=false,combo=0,rv=0,rvr=0,tried=false;const miss=new Set(),mq=[];
function mk(){mk0();Q=Q.map(upg)}
function mk0(){if(st&&p.k=='ul')Q=buildRv();else if(st)Q=sh(D).slice(0,5).map((d,k)=>gen(p.k=='dx'?['v','mf','mt','pj','ct'][k]:p.k,d));else{const d=p.d,qq=QS[G.q],ft=qq&&qq.ft,pool=['tr','ct','v','sk','kt'].concat(G.stb.mt!==undefined?['mt']:[],G.stb.pj!==undefined?['pj']:[]);let ts=pickTypes(pool,3);if(ft)ts=[ft,ft,...pickTypes(pool.filter(x=>x!==ft),1)];Q=[gen('v',d),gen('mf',d),...ts.map(t=>gen(t,d))]}}
function intro(){c.scrollTop=0;const qq=QS[G.q],fm=qq&&!st?`<div class="fc">🎯 Misimu: <b>${qq.t}</b> — ${qq.s}</div>`:'';
if(st){c.innerHTML=`<h2>${p.t}</h2><div class="who"><span class="ar" style="font-size:20px">${p.ar}</span></div>${GR[p.k]||'<div class="ex">Ini bukan ujian. Jawab sebisamu, hasilnya membantu gurumu dan Kak Hud-hud memilih latihan yang pas. Tidak ada nilai jelek! 🌱</div>'}<button class="opt go" id="ms">Mulai kuis (5 soal) ▶</button>`;bindSp(c);$('#ms').onclick=()=>{mk();show()};return}
const [a,b]=materiNPC(p).split('<!--PG-->'),lk=(G.stb.mt===undefined||G.stb.pj===undefined)?'<div class="fc">🔒 Soal Muttasil &amp; Tanya-Jawab terbuka setelah kamu berlatih di pos-nya (kotak biru &amp; oranye).</div>':'';
c.innerHTML=`<div class="stp">Langkah 1 dari 3 · Kenali kata &amp; pola</div>${fm}${a}<button class="opt go" id="ms">Lanjut: tirukan pola ▶</button>`;bindSp(c);
$('#ms').onclick=()=>{c.scrollTop=0;c.innerHTML=`<div class="stp">Langkah 2 dari 3 · Pola lanjutan</div>${b}<div class="fc">🎤 <b>Tirukan!</b> Ketuk tiap kartu 🔊, ucapkan keras-keras 2 kali. Lalu buat satu kalimat sendiri tentang temanmu.</div>${lk}<button class="opt" id="dl">💬 Ngobrol dulu dengan ${p.d.n} (latihan percakapan)</button><button class="opt go" id="ms">Mulai kuis (5 soal) ▶</button>`;bindSp(c);$('#dl').onclick=dlg;$('#ms').onclick=()=>{mk();show()}}}

function dlg(){const d=p.d,g=d.g,ix=D.indexOf(d),hg=G.hero.g=='m'?'m':'f',kk=g=='m'?'كَ':'كِ',ko=g=='m'?'كِ':'كَ',k2=hg=='m'?'كَ':'كِ',X=sh(D.filter(x=>x!==d&&x.g==hg))[0]||D[0];
const T=[
{n:'اَلسَّلَامُ عَلَيْكُمْ',sp:'السلام عليكم',ask:`${d.n} menyapamu. Balas dengan salam yang tepat.`,a:'وَعَلَيْكُمُ السَّلَامُ',o:['وَعَلَيْكُمُ السَّلَامُ','صَبَاحُ الْخَيْرِ','مَعَ السَّلَامَةِ','شُكْرًا'],tp:'pj',ex:'Salam dijawab: وَعَلَيْكُمُ السَّلَامُ.'},
{n:'مَرْحَبًا! هَذَا مَكَانُ عَمَلِي.',sp:'مرحبا هذا مكان عملي',ask:`Kamu ingin tahu profesi ${d.n} (${g=='m'?'laki-laki':'perempuan'}). Pilih pertanyaan yang tepat.`,a:`مَا مِهْنَتُ${kk}؟`,o:[`مَا مِهْنَتُ${kk}؟`,`مَا مِهْنَتُ${ko}؟`,`مَنْ مِهْنَتُ${kk}؟`,`أَيْنَ مِهْنَتُ${kk}؟`],tp:'pj',ex:`مَا = apa. مِهْنَتُ${kk} = profesi${g=='m'?'mu (lk)':'mu (pr)'}.`},
{n:`أَنَا ${d.ar}. وَأَنْتَ؟ مَا أَمَلُ${k2} فِي الْمُسْتَقْبَلِ؟`,sp:`أنا ${d.ar} وأنت ما أملك في المستقبل`,ask:`${d.n} menjawab dan bertanya cita-citamu. Jawab: kamu ingin menjadi ${X.id}.`,a:`أُرِيدُ أَنْ أَكُونَ ${X.ac}`,o:[`أُرِيدُ أَنْ أَكُونَ ${X.ac}`,`أُرِيدُ أَنْ أَكُونَ ${X.ar}`,`هُوَ ${X.ar}`,`هَذَا ${X.ar}`],tp:'ct',ex:`Setelah أَنْ أَكُونَ, profesi bertanwin fathah: ${X.ac}.`}];
let t=0,bad=false;const log=[];
const bub=(who,txt,sp)=>`<div class="bb ${who}">${who=='npc'?`<small>${d.e} ${d.n}</small><br>`:''}<span class="ar">${txt}</span>${sp?`<button class="opt spk" data-sp="${sp}" style="margin-left:8px">🔊</button>`:''}</div>`;
function turn(){const s=T[t];c.scrollTop=0;bad=false;
c.innerHTML=`<div class="stp">💬 Percakapan ${t+1} dari ${T.length}</div><h2>${d.e} ${d.n}</h2>${log.join('')}${bub('npc',s.n,s.sp)}<div class="fc">${s.ask}</div>${sh(s.o).map((x,k)=>`<button class="opt ar" data-o="${k}" data-v="${x}">${x}</button>`).join('')}<div id="fb" role="status" aria-live="polite"></div>`;
c.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>say(b.dataset.sp));say(s.sp);
c.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{const v=b.dataset.v;if(v!==s.a){if(!bad){bad=true;rec({t:s.tp,w:s.tp=='ct'?ix:undefined},false)}b.disabled=true;b.classList.add('no');snd(180,.2,'sawtooth');$('#fb').innerHTML='<span style="color:#8a5200">🦉 Hampir! Coba pilihan lain.</span>';return}
if(!bad)rec({t:s.tp,w:s.tp=='ct'?ix:undefined},true);snd(784,.15,'triangle');log.push(bub('npc',s.n,s.sp),bub('me',s.a,s.a.replace(/[؟]/g,'')));t++;
if(t<T.length){$('#fb').innerHTML=`<span style="color:#14744b">✅ Tepat!</span><div class="ex">💡 ${s.ex}</div><button class="opt go" id="nx">Lanjut ▶</button>`;c.querySelectorAll('.opt[data-o]').forEach(x=>x.disabled=true);$('#nx').onclick=turn;$('#nx').scrollIntoView({block:'nearest'})}
else done(s)})}
function done(s){G.dlg=G.dlg||{};let bn=0;if(!G.dlg[ix]){G.dlg[ix]=1;bn=15;coins+=15}const am=checkMissions();hud();
c.innerHTML=`<h2>${d.e} Percakapan selesai!</h2>${log.join('')}${bub('npc','مَعَ السَّلَامَةِ','مع السلامة')}<div class="ex">💡 ${s.ex}</div><div class="q">Kamu sudah bercakap-cakap dengan ${d.n} dalam bahasa Arab! 🎉${bn?` +${bn} koin (pertama kali).`:''}</div>${am.length?`<div class="ex">🏅 Pencapaian: ${am.map(x=>`<b>${x.t}</b> (+${x.r} 🪙)`).join(', ')}</div>`:''}<button class="opt go" id="ms">Mulai kuis (5 soal) ▶</button>`;
c.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>say(b.dataset.sp));$('#ms').onclick=()=>{mk();show()}}
turn()}
const nrm=s=>String(s).toLowerCase().trim().replace(/^(seorang|si|sang)\s+/,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
function upg(q){const L=lvOf(q);if(L<2||Math.random()<.4)return q;
if(q.tk){q.lis=true;return q}
if((q.t=='v'||q.t=='kt')&&!q.oa&&typeof q.a=='string'&&!/[()]/.test(q.a)){q.ty=true;q.tx=[q.a,...q.a.split('/').map(s=>s.trim())].filter((x,k,a)=>a.indexOf(x)==k)}
return q}
const pkx=(q,b)=>{try{if(!b||q.tk||!q.o)return '';const v=q.o[+b.dataset.i],g=gloss(v);if(!g)return '';return v===g.ar?` Kamu memilih <span class="ar">${v}</span> = <b>${g.id}</b>.`:` Kamu memilih “${v}”, bahasa Arabnya <span class="ar">${g.ar}</span>.`}catch(e){return ''}};
const fixCard=list=>{const seen=new Set(),it=[];list.forEach(q=>{const e=q.ex;if(!e||seen.has(e)||it.length>=5)return;seen.add(e);it.push(q)});if(!it.length)return '';return `<div class="gt">📝 Ingat lagi yang tadi salah</div>${it.map(q=>`<div class="ex">${q.ex}${q.sp?` <button class="opt spk" data-sp="${q.sp}" aria-label="Dengarkan">🔊</button>`:''}</div>`).join('')}`};
const again=()=>{Q=mq.splice(0).map(fresh);i=0;ok=0;combo=0;rv=1;rvr++;show()};
const fresh=q=>{const d=q.w!=null?D[q.w]:(p.d||D[rnd(D.length)]);let n=null;for(let k=0;k<40;k++){const x=gen(q.t,d);if(x.q!==q.q&&(!q.k||x.k===q.k)){n=x;break}}return upg(n||gen(q.t,d))};
function show(){const q=Q[i];locked=false;tried=false;c.scrollTop=0;const pic=(q.pc&&lvOf(q)<1)?`<div class="pic" aria-hidden="true">${q.pc}</div>`:'';
c.innerHTML=`<div class="dots">${Q.map((_,k)=>`<i class="${k<i?'on':''}"></i>`).join('')}</div>
<h2>${st?p.t:p.d.e+' '+p.d.pl}</h2><div class="who">Soal ${i+1} dari ${Q.length}${q.sp?'<button class="opt spk" id="sp">🔊 Dengarkan</button>':''}</div>
${pic}<div class="q ${q.ar?'ar':''}">${q.tk?(q.lis?'🎧 Dengarkan kalimatnya (ketuk 🔊), lalu susun kartu sesuai yang kamu dengar.':'🧩 Susun kartu kata menjadi kalimat yang benar. Ketuk 🔊 untuk mendengar contohnya!'):q.q}</div>${q.tk?'<div id="tp"></div>':q.ty?'<div class="ty"><input id="tyi" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Ketik artinya…" aria-label="Ketik jawabanmu"><button class="opt go" id="tyb">Periksa</button></div>':q.o.map((x,k)=>`<button class="opt ${(q.ar||q.oa)?'ar':''}" data-i="${k}">${x}</button>`).join('')}<button class="opt spk" id="hn" style="margin-top:4px">💡 Petunjuk (gratis)</button><div id="fb" role="status" aria-live="polite"></div>`;
if(q.sp)$('#sp').onclick=()=>say(q.sp);
if(q.q.startsWith('🎧'))say(q.sp);
if(q.lis)say(q.sp);
$('#hn').onclick=e=>{if(locked)return;q.hn=true;if(q.ty){const t=q.tx[0];$('#fb').innerHTML=`<span style="color:#7a5a00">💡 Huruf pertama: <b>${t[0]}</b> · ${t.length} huruf</span>`;e.currentTarget.disabled=true;return}const w=[...c.querySelectorAll('.opt[data-i]:not(:disabled)')].filter(x=>q.o[+x.dataset.i]!==q.a);if(!w.length)return;const x=w[rnd(w.length)];x.disabled=true;x.style.opacity=.3;e.currentTarget.disabled=true};
const ffail=()=>{tried=true;snd(180,.25,'sawtooth');miss.add(q.t);mq.push(q);combo=0;if(!rv)rec(q,false)};
const ans=(right,b)=>{if(locked)return;
if(!right&&!tried&&!q.tk){ffail();if(b){b.disabled=true;b.classList.add('no')}
const tip=q.ty?` Petunjuk: huruf pertama <b>${q.tx[0][0]}</b>, ${q.tx[0].length} huruf.`:' Pilihan yang salah sudah dicoret.';
$('#fb').innerHTML=`<span style="color:#8a5200">🦉 Hampir! Coba sekali lagi.${tip}${pkx(q,b)}</span>`;if(q.sp&&!q.ty)say(q.sp);return}
locked=true;const ti=c.querySelector('#tyi');if(ti)ti.disabled=true;const tb=c.querySelector('#tyb');if(tb)tb.disabled=true;
c.querySelectorAll('.opt[data-i]').forEach(x=>{x.disabled=true;if(q.o&&q.o[+x.dataset.i]===q.a)x.classList.add('ok')});
let gain=0;const self=tried&&right;
if(!tried){if(!right){if(b)b.classList.add('no');snd(180,.25,'sawtooth');miss.add(q.t);mq.push(q);combo=0}else{ok++;combo++;gain=(rv||(q.w!=null&&G.ws[q.w]>=3))?0:10;coins+=gain;snd(784+Math.min(combo,8)*50,.15,'triangle')}if(!rv)rec(q,right)}
else if(right)snd(660,.15,'triangle');
hud();
$('#fb').innerHTML=(right?(self?`<span style="color:#14744b">👍 Betul! Kamu menemukannya sendiri.</span>`:`<span style="color:#14744b"><span class="ar">${['مَا شَاءَ اللَّهُ','أَحْسَنْتَ','بَارَكَ اللَّهُ فِيكَ'][rnd(3)]}</span> ${PE(p)?PE(p)[3]:'Hebat!'} ${gain?'+'+gain+' koin':(rv?'(latihan, tanpa koin)':'(kata ini sudah kamu kuasai, tanpa koin)')}${combo>=2?` · 🔥 Beruntun ×${combo}`:''}</span>`):`<span style="color:#b8352b">${PE(p)?p.d.e:'🦉'} <span class="ar">حَاوِلْ مَرَّةً أُخْرَى</span> ${PE(p)?PE(p)[4]:'Ayo coba lagi!'} ${q.ty?`Jawaban: <b>${q.tx[0]}</b>.`:'Jawaban benar ditandai hijau.'}${pkx(q,b)}</span>`)+(q.ex?`<div class="ex">💡 ${q.ex}</div>`:'')+`<button class="opt go" id="nx">${i<Q.length-1?'Lanjut ▶':'Lihat hasil'}</button>`;
$('#nx').onclick=()=>{i++;i<Q.length?show():end()};
$('#nx').scrollIntoView({block:'nearest'})};
if(q.tk)tapUI(c,q,ans,ffail);else if(q.ty){const ti=$('#tyi'),go=()=>{if(locked)return;const v=nrm(ti.value);if(!v){ti.focus();return}ans(q.tx.some(x=>nrm(x)==v),null)};$('#tyb').onclick=go;ti.onkeydown=e=>{if(e.key=='Enter')go()}}else c.querySelectorAll('.opt[data-i]').forEach(b=>b.onclick=()=>ans(q.o[+b.dataset.i]===q.a,b))}
function end(){if(rv){const rm=mq.length;c.innerHTML=`<h2>🔁 Perbaikan selesai</h2><div class="q">${ok} dari ${Q.length} soal sekarang benar. Kesalahan adalah bagian dari belajar! 🌱</div><div class="fc">📌 Soal perbaikan adalah latihan: tidak masuk laporan dan tidak memberi koin.</div>${rm?fixCard(mq)+(rvr<2?`<button class="opt go" id="rt">🔁 Sekali lagi (${rm} soal baru)</button>`:'<div class="fc">Cukup dua kali perbaikan. Buka 📋 → Tata Bahasa, atau bicara lagi dengan warga untuk belajar ulang.</div>'):''}<button class="opt${rm?'':' go'}" id="x">Lanjut jalan-jalan</button>`;bindSp(c);const r2=$('#rt');if(r2)r2.onclick=again;$('#x').onclick=()=>{m.style.display='none';open=false;mode=null};return}const n=Q.length;let bonus=0,title,desc,nwPf=-1;
if(st){if(p.k=='dx')(G.dx=G.dx||[]).push({d:dstr(),ok});if(p.k=='ul'){if(ok>=3&&G.rvd!==dstr()){bonus=15;G.rvd=dstr()}G.rvn=(G.rvn||0)+1}else{if(ok>=4&&(G.stb[p.k]||0)<4)bonus=20;G.stb[p.k]=Math.max(G.stb[p.k]||0,ok)}
title=ok>=4?'Latihan selesai. Hebat!':ok>=3?'Lumayan, terus berlatih!':'Coba lagi, ya';desc=`${ok} dari ${n} benar.${bonus?(p.k=='ul'?` Bonus ulang hari ini: +${bonus} koin.`:` Bonus pertama kali ≥4 benar: +${bonus} koin.`):''}`}
else{const lv=ok>=n?3:ok>=n-1?2:ok>=3?1:0;
if(lv>p.lv){if(p.lv==0)nwPf=PFG.findIndex(g=>g.ix.includes(p.i)&&!g.ix.some(j=>pois[j].lv>0));bonus=(p.lv==0?20:0)+15*Math.max(0,lv-Math.max(p.lv,1));p.lv=lv;mkc(p);[523,659,784,1047].forEach((f,k)=>setTimeout(()=>snd(f,.2,'triangle'),k*120))}
title=lv==3?'Sempurna! Bintang emas!':lv>0?'Lencana didapat!':'Coba lagi, ya';
desc=`${ok} dari ${n} benar. ${lv>0?'⭐'.repeat(lv)+' ':''}${lv==0?'Butuh minimal 3 benar untuk lencana.':`Lencana ${p.d.pl}.`}${bonus?` Bonus +${bonus} koin.`:''}${lv>0&&lv<3?' Raih 5/5 untuk bintang emas!':''}`}
coins+=bonus;hud();
const ms=checkAll(),all=!st&&pois.every(x=>x.lv>0);
let h=`<h2>${all?'Kamu menyelesaikan seluruh kota!':title}</h2><div class="q">${desc}</div>`;
if(!st)h+=`<div class="q ar">${p.d.ar} — ${p.d.id}</div><div class="ex">${p.d.e} <b>${PE(p)[0]}</b>: “${PE(p)[5]}”</div>`;
if(miss.size)h+=`<div class="ex">📚 Perlu latihan: ${[...miss].map(t=>TN[t]).join(', ')}. Buka 📋 → Tata Bahasa${[...miss].some(t=>TS[t])?` atau kunjungi ${[...miss].filter(t=>TS[t]).map(t=>TS[t]).join(' / ')}`:''}.</div>`;
const pn=pend.splice(0);if(pn.length)h+=`<div class="ex">${pn.join('<br>')}</div>`;
if(ms.q.length){const nx=QS[G.q];h+=`<div class="mi done"><b>🎉 MISI SELESAI!</b><br>${ms.q.map(x=>`${x.t} (+${x.r} 🪙)`).join('<br>')}${nx?`<br><small>Berikutnya: <b>${nx.t}</b> — ${nx.s}</small>`:'<br><b>🏆 Semua misi selesai! Kamu Juara Kota!</b>'}</div>`}
if(ms.a.length)h+=`<div class="ex">🏅 Pencapaian: ${ms.a.map(x=>`<b>${x.t}</b> (+${x.r} 🪙)`).join(', ')}</div>`;
if(nwPf>=0)h+=`<div class="mi done"><b>${D[PFG[nwPf].ix[0]].e} Seragam ${pfName(PFG[nwPf].k)} terbuka!</b><br><small>Pakai di 🎨 Gaya → 👷 Profesi, lengkap dengan aksesorisnya.</small></div>`;
if(mq.length)h+=fixCard(mq)+`<div class="fc">🧠 Mengulang sekarang, selagi masih ingat, membuat ingatan lebih kuat.</div><button class="opt go" id="rt">🔁 Uji lagi sekarang: ${mq.length} soal baru dari yang tadi salah</button>`;
if(!st)h+=`<div class="gt">🪞 Refleksi: seberapa paham kamu tentang ${p.d.pl}?</div><div class="rf"><button class="opt" data-rf="3">😄 Paham</button><button class="opt" data-rf="2">🙂 Cukup</button><button class="opt" data-rf="1">😕 Bingung</button></div><div id="rfm"></div>`;
h+=`<button class="opt${mq.length?'':' go'}" id="x">Lanjut jalan-jalan</button>`;c.innerHTML=h;c.scrollTop=0;bindSp(c);RFB(c,p,ok,n);const rt=$('#rt');if(rt)rt.onclick=again;if(ms.q.length||all||ok==n)confetti();
$('#x').onclick=()=>{m.style.display='none';open=false;mode=null}}
intro()}
