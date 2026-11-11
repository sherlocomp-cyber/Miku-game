function analyze(s){
 const A={flags:[],strengths:[],needs:[],insights:[],plan:[],comps:[]};
 const days=s.ts?Math.floor((Date.now()-s.ts)/864e5):null;A.days=days;
 A.act=days==null?'tidak diketahui':days<=3?'aktif':days<=10?'jarang':'tidak aktif';
 const sx=Math.max(s.sim.best,s.sx?s.sx.nilai:0);A.simBest=sx;
 const wsAll=s.ws.reduce((a,b)=>a+b,0);
 const C=[['Akurasi latihan',s.acc,35,s.tot>=15],['Kosakata dikuasai',Math.round(s.wsM/24*100),20,s.full&&(wsAll>0||s.tot>0)],['Stasiun SAS lulus',Math.round(s.stDone/7*100),15,s.stTouched],['Simulasi SAS',sx,20,sx>0],['Ujian Akhir (rekor)',s.ex&&s.ex.try?Math.round(num(s.ex.best)/EXN*100):0,10,!!(s.ex&&num(s.ex.try)>0)]];
 let w=0,sc=0;C.forEach(c=>{A.comps.push({k:c[0],v:c[1],w:c[2],ok:c[3]});if(c[3]){w+=c[2];sc+=c[1]*c[2]}});
 A.ready=w?Math.round(sc/w):null;A.cover=Math.round(w);
 A.cat=s.tot===0&&!s.lencana?'Belum mulai':s.tot<15?'Data belum cukup':lvl(A.ready);
 const bl={};s.topics.forEach(t=>{const b=bl['C'+t.c]||(bl['C'+t.c]={ok:0,n:0});b.ok+=t.ok;b.n+=t.n});
 A.bloom=['C1','C2','C3','C4'].map(k=>{const b=bl[k]||{ok:0,n:0};return{k,n:b.n,acc:b.n?Math.round(b.ok/b.n*100):null}});
 const bA=k=>A.bloom.find(x=>x.k===k);
 s.topics.forEach(t=>{if(!t.n)return;if(t.acc<60&&t.n>=5)A.needs.push(t);else if(t.acc>=80&&t.n>=5)A.strengths.push(`${t.t}: ${t.acc}% benar (${t.ok}/${t.n}).`)});
 A.needs.sort((a,b)=>a.acc-b.acc);
 A.weakest=A.needs[0]||null;
 A.thin=s.topics.filter(t=>t.n>0&&t.n<5).map(t=>t.t);A.untried=s.topics.filter(t=>!t.n).map(t=>t.t);
 const F=(lv,t)=>A.flags.push({lv,t});
 if(s.tot===0&&!s.lencana)F('lo','Belum mulai bermain (belum ada jawaban tercatat).');
 if(days!=null&&days>10&&s.tot>0)F('hi',`Tidak ada data baru ${days} hari (kemungkinan berhenti bermain atau belum online).`);
 else if(days!=null&&days>3&&days<=10&&s.tot>0)F('md',`Terakhir masuk ${days} hari lalu.`);
 if(s.tot>=20&&s.acc<50)F('hi',`Akurasi sangat rendah (${s.acc}% dari ${s.tot} soal).`);
 else if(s.tot>=15&&s.acc<60)F('md',`Akurasi di bawah 60% (${s.acc}%).`);
 A.needs.slice(0,3).forEach(t=>{if(t.acc<50)F('md',`Topik "${t.t}" sangat lemah (${t.acc}%, ${t.n} soal).`)});
 s.stn.filter(x=>x.gt>=3&&!x.done).forEach(x=>F('hi',`Macet di Stasiun ${x.id} "${x.t}": ${x.gt}x gerbang, terbaik ${x.best}/10 (lulus minimal 8).`));
 if(s.sim.tries>=2&&s.sim.best<60)F('hi',`Simulasi SAS berulang tetapi terbaik hanya ${s.sim.best}%.`);
 if(s.over>=2)F('md',`Merasa paham padahal skor rendah ${s.over}x (kalibrasi diri kurang tepat).`);
 if(s.lt.due>=5&&s.rvn<=1)F('md',`${s.lt.due} butir waktunya diulang, tetapi hampir tidak memakai Kuis Ulang Harian.`);
 if(s.tot>=60&&s.acc<55)F('md',`Banyak soal dikerjakan (${s.tot}) tetapi akurasi rendah: indikasi menebak.`);
 if(!s.full&&s.tot>0)F('lo','Hanya data ringkasan yang tersedia (versi game lama); analisis terbatas.');
 // kekuatan lain
 if(s.wsM>=18)A.strengths.push(`Kosakata kuat: ${s.wsM}/24 profesi dikuasai.`);
 if(s.stDone===7)A.strengths.push('Seluruh 7 stasiun Jalur SAS lulus.');
 if(s.ex&&num(s.ex.win)>0)A.strengths.push(`Meraih piala Ujian Akhir (${s.ex.win}x, soal ${EXN}/${EXN} benar).`);
 if(s.bintang>=12)A.strengths.push(`${s.bintang} bintang emas dari warga kota.`);
 if(s.rw.length>=3)A.strengths.push(`Aktif berpraktik nyata: ${s.rw.length}/5 Tugas Dunia Nyata.`);
 // wawasan pedagogis
 const c1=bA('C1'),c2=bA('C2'),c3=bA('C3'),c4=bA('C4');
 if(c1.n>=8&&c1.acc>=75&&((c3.n>=5&&c3.acc<60)||(c4.n>=5&&c4.acc<60)))A.insights.push(`Kesenjangan level berpikir: kosakata (C1) ${c1.acc}% tetapi penerapan/analisis kalimat (C3 ${c3.acc==null?'-':c3.acc+'%'}, C4 ${c4.acc==null?'-':c4.acc+'%'}) tertinggal. Siswa hafal kata, tetapi belum terbiasa merangkainya menjadi kalimat. Perbanyak latihan menyusun dan menerjemah dengan kalimat pendek.`);
 if(c2.n>=8&&c2.acc<60)A.insights.push(`Dhamir (C2) masih lemah (${c2.acc}%). Dhamir menjadi dasar topik berikutnya (tanya-jawab, kepemilikan, cita-cita), jadi sebaiknya diperkuat lebih dulu.`);
 const mw=D.filter(d=>d.g==='m'),fw=D.filter(d=>d.g==='f'),av=a=>a.reduce((x,d)=>x+Math.min(3,s.ws[d.i])/3,0)/a.length;
 if(wsAll>=6&&av(mw)-av(fw)>=.25)A.insights.push(`Kata untuk profesi perempuan (mu'annats) lebih lemah (${Math.round(av(fw)*100)}% dikuasai) dibanding laki-laki (${Math.round(av(mw)*100)}%). Latih pasangan bentuk dengan menambahkan ة (طَبِيبٌ ↔ طَبِيبَةٌ).`);
 if(s.rf.length>=3&&s.over>=2)A.insights.push(`Metakognisi: ${s.over} kali siswa merasa "paham" padahal skor ≤3/5. Ajak melakukan teach-back (menjelaskan ulang dengan kata sendiri) agar penilaian diri lebih akurat.`);
 if(s.rf.length>=3&&s.under>=2)A.insights.push(`Metakognisi: ${s.under} kali siswa merasa "bingung" padahal skor tinggi. Beri umpan balik positif untuk membangun kepercayaan diri.`);
 if(!s.rf.length&&s.tot>=15)A.insights.push('Belum ada refleksi diri. Ingatkan siswa mengisi refleksi di akhir kuis warga agar gurunya dapat melihat tingkat keyakinannya.');
 if(s.tot>=60&&s.acc<55)A.insights.push('Banyak mencoba dengan hasil rendah menunjukkan menebak atau belum memahami. Arahkan membaca kartu materi dan memakai Jalur SAS (materi, latihan, baru gerbang) sebelum mengulang kuis.');
 if(s.lt.n>0&&s.lt.due>=5&&s.rvn<=1)A.insights.push(`Ulangan berjarak: ${s.lt.due} butir jatuh tempo, ${s.lt.strong}/${s.lt.n} sudah kuat. Dorong memakai tombol 🔁 setiap hari; mengulang sedikit di hari berbeda lebih awet daripada berlatih sekaligus.`);
 s.stn.filter(x=>!x.done&&x.gt>=2).forEach(x=>A.insights.push(`Stasiun ${x.id} (${x.tp}) belum lulus setelah ${x.gt}x gerbang. Pastikan siswa membaca Materi dan latihan dulu, lalu temani satu sesi gerbang.`));
 if(s.dx.length===0&&s.tot>=15)A.insights.push('Belum mengerjakan Cek Kemampuan (asesmen diagnostik). Minta dikerjakan sekarang, lalu diulang 2-4 pekan lagi untuk melihat pertumbuhan.');
 else if(s.dx.length>=2){const a=num(s.dx[0].ok),b=num(s.dx[s.dx.length-1].ok);A.insights.push(`Cek Kemampuan: awal ${a}/5 → terbaru ${b}/5 (${b-a>=0?'+':''}${b-a}). ${b>a?'Ada peningkatan.':b===a?'Belum ada perubahan; periksa topik terlemah.':'Menurun; perlu pendampingan.'}`)}
 if(!s.rw.length&&s.tot>=30)A.insights.push('Belum ada Tugas Dunia Nyata. Praktik lisan bersama teman/keluarga penting karena game melatih pengenalan, sedangkan berbicara perlu latihan di luar layar.');
 if(sx>0&&s.sx&&Math.abs(s.sim.best-s.sx.nilai)>=20)A.insights.push(`Hasil dua simulasi berbeda jauh (Simulasi SAS ${s.sim.best}%, SAS Lengkap ${s.sx.nilai}). Mungkin dipengaruhi soal isian/uraian; cek bagian B dan C.`);
 if(s.ex&&num(s.ex.try)>0&&num(s.ex.win)===0)A.insights.push(`Ujian Akhir: ${s.ex.try} percobaan, rekor ${num(s.ex.best)}/${EXN} (batas waktu 10 detik/soal dapat menekan siswa yang masih lambat membaca Arab).`);
 else if(s.ex===null||num(s.ex.try)===0)if(s.tot>=40)A.insights.push('Belum mencoba Ujian Akhir 40 soal.');
 // rencana
 let tier='m',tl='Pantau';
 if(A.cat==='Belum mulai'||A.cat==='Data belum cukup'){tier='m';tl='Pantau & dorong mulai'}
 else if(A.cat==='Mahir'){tier='e';tl='Pengayaan'}else if(A.cat==='Berkembang'){tier='p';tl='Penguatan'}else{tier='r';tl='Remedial'}
 A.tier=tier;A.tierLabel=tl;
 const P=A.plan;
 if(tier==='m'){P.push(s.tot===0?'Pastikan siswa sudah memasukkan nama + kelas di layar awal dan perangkatnya online; minta bermain 10 menit lalu cek lagi besok.':'Data masih sedikit (kurang dari 15 soal). Beri waktu bermain terbimbing, lalu nilai ulang.')}
 if(tier==='r')P.push('Bimbingan kelompok kecil atau tutor sebaya 2x seminggu; minta siswa membaca kartu materi dan mengerjakan Jalur SAS berurutan (bukan langsung gerbang).');
 if(tier==='p')P.push('Latihan berjarak pada topik terendah (3 kali/minggu) disertai praktik percakapan berpasangan di kelas.');
 if(tier==='e')P.push('Pengayaan: jadikan tutor sebaya, buat dialog sendiri tentang cita-cita, dan kerjakan Tugas Dunia Nyata tingkat Mencipta (Kartu Profesi, Pidato Mini).');
 A.needs.slice(0,3).forEach(t=>P.push(`${t.t} (${t.acc}%): ${TI[t.k].rem}.`));
 if(A.act==='tidak aktif'||A.act==='jarang')P.push('Hubungi siswa/orang tua secara ramah untuk mengetahui kendala (perangkat, kuota, waktu belajar).');
 if(tier!=='m')P.push('Cek ulang dalam 1-2 pekan memakai Cek Kemampuan dan bandingkan dengan data minggu ini.');
 return A}

function classStats(L){
 const R={n:L.length};const full=L.filter(s=>s.full);
 R.aktif7=L.filter(s=>s.A.days!=null&&s.A.days<=7).length;R.belumMulai=L.filter(s=>s.tot===0&&!s.lencana).length;
 const wt=L.filter(s=>s.tot>0);R.tot=wt.reduce((a,s)=>a+s.tot,0);R.ok=wt.reduce((a,s)=>a+s.ok,0);R.accW=R.tot?Math.round(R.ok/R.tot*100):null;
 R.accAvg=wt.length?Math.round(wt.reduce((a,s)=>a+s.acc,0)/wt.length):null;
 R.cats={};L.forEach(s=>R.cats[s.A.cat]=(R.cats[s.A.cat]||0)+1);
 R.topics=TOP.map(([k,t,b,c])=>{let ok=0,n=0,low=[];L.forEach(s=>{const x=s.topics.find(y=>y.k===k);ok+=x.ok;n+=x.n;if(x.n>=5&&x.acc<60)low.push(s)});return{k,t,b,c,ok,n,acc:n?Math.round(ok/n*100):null,low}});
 R.words=D.map(d=>{const v=full.map(s=>s.ws[d.i]);return{d,pct:v.length?Math.round(v.filter(x=>x>=3).length/v.length*100):null,avg:v.length?v.reduce((a,b)=>a+b,0)/v.length:null}});
 R.stations=ST.map(([id,t])=>({id,t,done:L.filter(s=>s.stn[id-1].done).length,stuck:L.filter(s=>s.stn[id-1].gt>=3&&!s.stn[id-1].done)}));
 const sb=s=>Math.max(s.sim.best,s.sx?s.sx.nilai:0);
 R.sas={none:L.filter(s=>sb(s)===0).length,low:L.filter(s=>sb(s)>0&&sb(s)<60).length,mid:L.filter(s=>sb(s)>=60&&sb(s)<80).length,hi:L.filter(s=>sb(s)>=80).length};
 R.ex={tried:L.filter(s=>s.ex&&num(s.ex.try)>0).length,won:L.filter(s=>s.ex&&num(s.ex.win)>0).length};
 const sev={hi:3,md:2,lo:1};
 L.forEach(s=>s.attn=s.A.flags.reduce((a,f)=>a+sev[f.lv],0));
 R.attn=L.filter(s=>s.A.flags.some(f=>f.lv==='hi'||f.lv==='md')).sort((a,b)=>b.attn-a.attn);
 R.rich=L.filter(s=>s.A.cat==='Mahir'&&s.tot>=30);
 R.rem=L.filter(s=>s.A.tier==='r');
 R.over=L.filter(s=>s.over>=2);
 return R}
function applyRoster(L,text){
 const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);if(!lines.length)return null;
 const matched=new Set(),missing=[];
 lines.forEach(ln=>{const b=baseName(ln),k=klsOf(ln);const hit=L.filter(s=>baseName(s.nama)===b&&(!k||s.kelas===k));if(hit.length)hit.forEach(h=>matched.add(h.key));else missing.push(ln)});
 return{n:lines.length,missing,unknown:L.filter(s=>!matched.has(s.key))}}
function normalizeRecords(obj,askName){
 if(!obj||typeof obj!=='object')return{};
 if(obj[ROOT]&&typeof obj[ROOT]==='object'&&!obj.lv)obj=obj[ROOT];
 if(Array.isArray(obj)){const o={};obj.forEach((r,i)=>{if(r&&typeof r==='object'){const k=String(r.nama||'siswa'+i).toLowerCase().replace(/[.#$\[\]\/\s]+/g,'_');o[k]=r}});return o}
 if(obj.lv&&obj.st){const nm=(askName&&askName())||'Siswa tanpa nama';const k=nm.toLowerCase().replace(/[.#$\[\]\/\s]+/g,'_');return{[k]:{nama:nm,ts:Date.now(),data:JSON.stringify(obj)}}}
 const o={};Object.keys(obj).forEach(k=>{const r=obj[k];if(r&&typeof r==='object'&&(r.nama||r.data||r.ringkas))o[k]=r});return o}
/*LOGIC-END*/

/*DEMO-START*/
