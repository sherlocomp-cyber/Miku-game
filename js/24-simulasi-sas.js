/* === BAGIAN 24: Simulasi SAS Lengkap (70 menit) ===
   Modul mandiri: tidak mengubah file lain. Dimuat SETELAH js/21-jalur-sas.js (memakai window.JSAS.hub).
   Tombol "Simulasi SAS Lengkap" otomatis ditambahkan ke layar Jalur (hub) oleh kode di bagian bawah file ini.
   Format mengikuti SAS Bahasa Arab Kelas IV: A pilihan ganda (20), B isian (10), C uraian (5), waktu 70 menit.
   Soal DIACAK dari generator game (serupa dengan SAS asli, bukan salinannya). Tidak ada umpan balik saat mengerjakan;
   hasil dan pembahasan muncul di akhir. Memakai: gen, D, AB, mc, sh, rnd, say, open, mode, ready. */
(function(){
if(window.KPX)return;
const Q=s=>document.querySelector(s);
const dv=(f,d)=>{try{const r=f();return r===undefined?d:r}catch(e){return d}};
const KEY='kp.sasx',load=()=>dv(()=>JSON.parse(localStorage.getItem(KEY)),null),store=o=>dv(()=>localStorage.setItem(KEY,JSON.stringify(o)));
const NM_M=['عَلِيٌّ','أَحْمَدُ','يُوسُفُ'],NM_F=['سَلْمَى','مَرْيَمُ','هِنْدٌ'];
const FEM=[['مُدَرِّسٌ','مُدَرِّسَةٌ'],['مُهَنْدِسٌ','مُهَنْدِسَةٌ'],['شُرْطِيٌّ','شُرْطِيَّةٌ'],['جُنْدِيٌّ','جُنْدِيَّةٌ'],['مُمَرِّضٌ','مُمَرِّضَةٌ'],['صَحَافِيٌّ','صَحَافِيَّةٌ'],['خَيَّاطٌ','خَيَّاطَةٌ'],['مُوَظَّفٌ','مُوَظَّفَةٌ'],['تَاجِرٌ','تَاجِرَةٌ']];
const SECT={A:'A. Pilihlah jawaban yang benar!',B:'B. Lengkapilah dengan jawaban yang tepat!',C:'C. Jawablah dengan benar!'};
const PLAN={A:['v','kt','v','tr','mf','kt','mt','pj','sk','tr','mf','ct','pj','sk','v','mt','dlg','ct','join','fem'],B:['kt','fem','mt','join','mf','v','dlg','ct','kt','tr'],C:['sk','sk','tr','dlg','mt']};

/* ---------- generator tambahan ---------- */
function gFem(){const p=FEM[rnd(FEM.length)];return{t:'fem',q:'Kata '+AB(p[0])+' untuk perempuan menjadi ....',sp:p[1],a:p[1],o:mc(p[1],FEM.map(x=>x[1])),oa:1,ex:p[0]+' (laki-laki) → '+p[1]+' (perempuan): tambahkan ة (ta marbuthah).'}}
function gJoin(d){const bare=d.ar.replace(/[\u064B-\u0652\u0670]/g,''),ch=[...bare].join(' - ');return{t:'join',w:D.indexOf(d),q:'Huruf '+AB(ch)+' jika disambung menjadi ....',sp:d.ar,a:d.ar,o:mc(d.ar,D.map(x=>x.ar)),oa:1,ex:'Huruf-huruf itu jika disambung = '+d.ar+' ('+d.id+').'}}
function gDlg(){const f=Math.random()<.5,pool=D.filter(x=>x.g==(f?'f':'m')&&x.ac),d=pool[rnd(pool.length)],nm=sh(f?NM_F:NM_M),a='أُرِيدُ أَنْ أَكُونَ '+d.ac;
 return{t:'dlg',w:D.indexOf(d),q:'Lengkapi dialog!<br>'+AB(nm[0]+' : مَا أَمَلُ'+(f?'كِ':'كَ')+' فِي الْمُسْتَقْبَلِ؟')+'<br>'+AB(nm[1]+' : ....'),sp:a,a,o:mc(a,pool.map(x=>'أُرِيدُ أَنْ أَكُونَ '+x.ac)),oa:1,ex:'Cita-cita: أُرِيدُ أَنْ أَكُونَ + profesi (tanwin fathah). Di sini: '+a+' = saya ingin menjadi '+d.id+'.'}}
const one=t=>{const d=D[rnd(D.length)];return t=='dlg'?gDlg():t=='fem'?gFem():t=='join'?gJoin(d):gen(t,d)};
function make(){const out=[],seen=new Set();
 for(const sec of 'ABC')PLAN[sec].forEach(t=>{let q;for(let k=0;k<40;k++){q=one(t);if(!seen.has(q.q)&&!String(q.q).startsWith('🎧'))break}seen.add(q.q);
  if(sec=='B'&&(q.t=='v'||q.t=='kt')&&!q.oa&&typeof q.a=='string'&&!/[()]/.test(q.a)&&!q.tk){q.ty=true;q.tx=[q.a,...q.a.split('/').map(s=>s.trim())].filter((x,i,a)=>a.indexOf(x)==i)}
  out.push({sec,q})});return out}

/* ---------- keadaan ujian ---------- */
let S=null,tmr=0;
const kind=i=>{const{sec,q}=S.qs[i];return sec=='C'&&q.tk?'ord':q.ty?'ty':'mc'};
const norm=s=>String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
function isOk(i){const q=S.qs[i].q,a=S.ans[i];if(a==null||a==='')return false;const k=kind(i);
 if(k=='ty')return q.tx.some(x=>norm(x)==norm(a));
 if(k=='ord')return a.length==S.ords[i].length&&a.map(j=>S.ords[i][j]).join(' ')===q.a;
 return q.o[a]===q.a}
const answered=i=>{const a=S.ans[i];return a!=null&&a!==''&&!(Array.isArray(a)&&!a.length)};
const closeM=()=>{clearInterval(tmr);S=null;Q('#modal').style.display='none';open=false;mode=null};
const mmss=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const best=()=>load();

/* ---------- tampilan ---------- */
function intro(){const c=Q('#card'),b=best();open=true;mode='sasx';Q('#modal').style.display='flex';c.scrollTop=0;
 c.innerHTML='<h2>📝 Simulasi SAS Lengkap</h2><div class="fc">Soal <b>serupa</b> dengan SAS Bahasa Arab Kelas IV, tetapi <b>bukan soal aslinya</b>. Soal diacak, jadi setiap kali mencoba soalnya berbeda.</div>'
 +'<div class="ex"><b>Isi:</b> A. pilihan ganda (20 soal) · B. isian (10 soal) · C. uraian (5 soal) · <b>Waktu 70 menit</b>.<br>Tidak ada umpan balik saat mengerjakan. Nilai dan pembahasan muncul di akhir. Kamu boleh pindah soal dengan tombol ◀ ▶.</div>'
 +'<div class="gt">Yang diuji (Tujuan Pembelajaran)</div><div class="mi">1️⃣ Kosakata nama profesi dan cita-cita.</div><div class="mi">2️⃣ Dhamir munfasil dan dhamir muttasil.</div><div class="mi">3️⃣ Melengkapi percakapan dan kalimat tentang profesi dan cita-cita.</div><div class="mi">4️⃣ Menerjemahkan dan menyusun kata acak menjadi kalimat.</div>'
 +(b?'<div class="ex">🏅 Nilai terbaikmu: <b>'+b.nilai+'</b> (A '+b.a+'/20 · B '+b.b+'/10 · C '+b.c+'/5)</div>':'')
 +'<div class="fc">🤲 Berdoalah dulu sebelum mengerjakan. Tidak ada nilai jelek, ini latihan!</div><button class="opt go" id="xgo">Mulai (70 menit) ▶</button><button class="opt" id="xx">Kembali</button>';
 Q('#xgo').onclick=begin;Q('#xx').onclick=back}
function back(){closeM();dv(()=>JSAS.hub(),0)}
function begin(){const qs=make();S={qs,i:0,ans:qs.map(()=>null),ords:qs.map((o,i)=>o.q.tk&&o.sec=='C'?sh(o.q.tk.map((_,k)=>k)).map(k=>o.q.tk[k]):null),end:Date.now()+70*60000};
 S.ords=S.ords.map((r,i)=>{if(!r)return r;const q=qs[i].q;let t=r,n=0;while(t.join(' ')===q.a&&n++<20)t=sh(t);return t});
 clearInterval(tmr);tmr=setInterval(tick,1000);show()}
function tick(){if(!S)return clearInterval(tmr);const e=Q('#xt'),left=S.end-Date.now();if(e)e.textContent='⏱ '+mmss(left);if(left<=0)finish(true)}
function show(){const c=Q('#card'),{sec,q}=S.qs[S.i],k=kind(S.i),n=S.qs.length;c.scrollTop=0;
 const a=S.ans[S.i];let body='';
 if(k=='mc')body=q.o.map((x,j)=>'<button class="opt'+(q.oa?' ar':'')+(a===j?' go':'')+'" data-j="'+j+'"'+(q.oa?' lang="ar"':'')+'>'+x+'</button>').join('');
 else if(k=='ty')body='<div class="ty"><input id="xin" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Ketik jawabanmu…" aria-label="Ketik jawabanmu" value="'+String(a||'').replace(/"/g,'&quot;')+'"></div>';
 else{const sel=a||[];body='<div id="xtp" class="ex" style="min-height:44px;direction:rtl" lang="ar">'+(sel.length?sel.map((j,p)=>'<button class="opt" data-r="'+p+'">'+S.ords[S.i][j]+'</button>').join(' '):'<small style="direction:ltr">Ketuk kartu kata di bawah sesuai urutan</small>')+'</div><div style="direction:rtl" lang="ar">'+S.ords[S.i].map((w,j)=>sel.includes(j)?'':'<button class="opt" data-w="'+j+'">'+w+'</button>').join(' ')+'</div>'}
 const dots='<div class="dots" style="flex-wrap:wrap">'+S.qs.map((_,j)=>'<i class="'+(answered(j)?'on':'')+'" data-g="'+j+'" style="cursor:pointer'+(j==S.i?';outline:2px solid var(--ink)':'')+'"></i>').join('')+'</div>';
 c.innerHTML='<div class="who"><b id="xt">⏱ '+mmss(S.end-Date.now())+'</b> · Terjawab '+S.ans.filter((_,j)=>answered(j)).length+'/'+n+'</div>'+dots
 +'<div class="gt">'+SECT[sec]+'</div><div class="who">Soal '+(S.i+1)+' dari '+n+(q.sp?'<button class="opt spk" id="xsp" aria-label="Dengarkan">🔊</button>':'')+'</div>'
 +(q.pc?'<div class="pic" aria-hidden="true">'+q.pc+'</div>':'')+'<div class="q">'+q.q+'</div>'+body
 +'<div class="who" style="margin-top:10px"><button class="opt" id="xp"'+(S.i?'':' disabled')+'>◀ Sebelumnya</button>'+(S.i<n-1?'<button class="opt go" id="xn">Berikutnya ▶</button>':'<button class="opt go" id="xf">Selesai ✔</button>')+'</div><button class="opt" id="xq">Keluar tanpa menilai</button>';
 if(q.sp)Q('#xsp').onclick=()=>say(q.sp);
 c.querySelectorAll('[data-j]').forEach(b=>b.onclick=()=>{S.ans[S.i]=+b.dataset.j;show()});
 const xin=Q('#xin');if(xin)xin.oninput=()=>{S.ans[S.i]=xin.value};
 c.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>{(S.ans[S.i]=S.ans[S.i]||[]).push(+b.dataset.w);show()});
 c.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{S.ans[S.i].splice(+b.dataset.r,1);show()});
 c.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{S.i=+b.dataset.g;show()});
 Q('#xp').onclick=()=>{S.i--;show()};
 const xn=Q('#xn');if(xn)xn.onclick=()=>{S.i++;show()};
 const xf=Q('#xf');if(xf)xf.onclick=()=>{const k0=S.ans.filter((_,j)=>answered(j)).length;if(k0<n&&!confirm('Masih ada '+(n-k0)+' soal belum dijawab. Selesai sekarang?'))return;finish()};
 Q('#xq').onclick=()=>{if(confirm('Keluar tanpa menilai? Jawabanmu tidak disimpan.'))back()}}
function finish(auto){clearInterval(tmr);const c=Q('#card');c.scrollTop=0;
 const sc={A:0,B:0,C:0},tt={A:0,B:0,C:0};S.qs.forEach((o,i)=>{tt[o.sec]++;if(isOk(i))sc[o.sec]++});
 const tot=sc.A+sc.B+sc.C,nilai=Math.round(tot/S.qs.length*100),pred=nilai>=80?'Mahir':nilai>=60?'Berkembang':'Perlu bimbingan';
 const prev=best();if(!prev||nilai>prev.nilai)store({nilai,a:sc.A,b:sc.B,c:sc.C,d:new Date().toISOString().slice(0,10)});
 const wrong=S.qs.map((o,i)=>[o,i]).filter(([o,i])=>!isOk(i));
 const rev=wrong.slice(0,10).map(([o,i])=>'<div class="ex"><small>'+o.sec+' · soal '+(i+1)+'</small><br>'+o.q.q+'<br>✅ <b'+(o.q.oa||o.q.tk?' class="ar" lang="ar"':'')+'>'+(o.q.ty?o.q.tx[0]:o.q.a)+'</b>'+(o.q.ex?'<br><small>'+o.q.ex+'</small>':'')+(o.q.sp?' <button class="opt spk" data-sp="'+o.q.sp+'" aria-label="Dengarkan">🔊</button>':'')+'</div>').join('');
 c.innerHTML='<h2>📝 Hasil Simulasi SAS</h2>'+(auto?'<div class="fc">⏰ Waktu 70 menit habis.</div>':'')
 +'<div class="center"><div style="font-size:48px">'+(nilai>=80?'🏆':nilai>=60?'👍':'🌱')+'</div><h2>Nilai: '+nilai+'</h2><b>'+pred+'</b></div>'
 +'<div class="mi">A. Pilihan ganda <small>'+sc.A+'/'+tt.A+'</small><div class="bar"><i style="width:'+sc.A/tt.A*100+'%"></i></div></div>'
 +'<div class="mi">B. Isian <small>'+sc.B+'/'+tt.B+'</small><div class="bar"><i style="width:'+sc.B/tt.B*100+'%"></i></div></div>'
 +'<div class="mi">C. Uraian <small>'+sc.C+'/'+tt.C+'</small><div class="bar"><i style="width:'+sc.C/tt.C*100+'%"></i></div></div>'
 +'<div class="ex">'+(nilai>=80?'Kamu siap menghadapi SAS! 🎉 Terus jaga dengan mengulang sedikit tiap hari.':'Ulangi stasiun yang masih lemah di 🧭 Jalur, lalu coba simulasi lagi dengan soal baru.')+' Ini latihan, bukan nilai rapor.</div>'
 +(wrong.length?'<div class="gt">📌 Pembahasan soal yang belum tepat'+(wrong.length>10?' (10 pertama)':'')+'</div>'+rev:'<div class="fc">Semua benar! مَا شَاءَ اللَّهُ 🌟</div>')
 +'<button class="opt go" id="xr">🔁 Coba lagi dengan soal baru</button><button class="opt" id="xb">Kembali ke Jalur</button><button class="opt" id="xc">Tutup</button>';
 dv(()=>bindSp(c),0);Q('#xr').onclick=intro;Q('#xb').onclick=back;Q('#xc').onclick=closeM;S=null}
window.KPX={start:intro,best,make};
})();

/* ---------- PASANG KE LAYAR JALUR (hub) ---------- */
(function(){
const card=document.getElementById('card');if(!card)return;
const add=()=>{const s=card.querySelector('#sim');if(!s||card.querySelector('#simx'))return;
 const b=document.createElement('button');b.className='opt';b.id='simx';
 b.innerHTML='📝 Simulasi SAS Lengkap (70 menit)<br><small>A 20 pilihan ganda · B 10 isian · C 5 uraian · soal diacak</small>';
 b.onclick=()=>{if(window.KPX)KPX.start()};s.after(b)};
new MutationObserver(add).observe(card,{childList:true});
})();
