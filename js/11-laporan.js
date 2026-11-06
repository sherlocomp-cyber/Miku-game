// ================= REFLEKSI, LAPORAN GURU, DUNIA NYATA =================
function RFB(c,p,ok,n){c.querySelectorAll('[data-rf]').forEach(b=>b.onclick=()=>{const v=+b.dataset.rf;G.rf.push({p:p.d.pl,v,ok,n,d:dstr()});if(G.rf.length>40)G.rf.shift();hud();c.querySelectorAll('[data-rf]').forEach(x=>x.disabled=true);b.classList.add('ok');$('#rfm').innerHTML=`<div class="ex">${v==3?'Keren! Coba ajarkan satu kalimat ke temanmu. 🌟':v==2?'Baik! Baca ulang kartu materi, lalu coba lagi untuk meraih bintang.':'Tidak apa-apa. Dengarkan kartu 🔊, lalu tanya guru atau temanmu. Kamu pasti bisa! 💪'}</div>`})}
const TOP=[['v','Kosakata (C1 Mengingat)'],['mf','Dhamir munfasil (C2 Memahami)'],['mt','Dhamir muttasil (C2 Memahami)'],['pj','Tanya-jawab (C3 Menerapkan)'],['ct','Cita-cita (C3 Menerapkan)'],['tr','Terjemah kalimat (C4 Menganalisis)'],['sk','Susun kalimat (C3 Menerapkan)'],['kt','Kosakata tempat & kegiatan (C1 Mengingat)']];
const lvl=a=>a>=80?'Mahir':a>=60?'Berkembang':'Perlu bimbingan';
const RWT=[['Wawancara Keluarga','Tanya satu anggota keluarga atau tetangga tentang pekerjaannya, lalu ceritakan dalam bahasa Arab.','مِهْنَةُ أَبِي تَاجِرٌ. مِهْنَةُ أُمِّي مُدَرِّسَةٌ.'],
['Dialog Berpasangan','Bermain peran dengan teman: bergantian bertanya dan menjawab, lalu tukar peran.','مَا أَمَلُكَ؟ — أُرِيدُ أَنْ أَكُونَ طَبِيبًا.'],
['Kenalkan Temanmu','Perkenalkan dua temanmu (laki-laki dan perempuan) beserta cita-citanya.','هَذَا أَحْمَدُ، هُوَ تِلْمِيذٌ. هَذِهِ سَارَةُ، هِيَ تُرِيدُ أَنْ تَكُونَ طَبِيبَةً.'],
['Kartu Profesi Sekolahku','Temukan 3 pekerjaan di sekitar sekolah (boleh tanya guru/kamus). Buat kartu: gambar + kata Arab + kalimat.','هَذَا ____. هُوَ يَعْمَلُ فِي الْمَدْرَسَةِ.'],
['Pidato Mini Cita-citaku','Ucapkan 3 kalimat di depan kelas: namamu, cita-citamu, dan alasannya (alasan boleh bahasa Indonesia).','أَنَا ____. أُرِيدُ أَنْ أَكُونَ ____.']];
const DISC='Catatan: laporan ini dibuat otomatis dari latihan murid di perangkat ini. Ini gambaran latihan, bukan nilai, dan tidak boleh dipakai untuk nilai rapor atau SAS. Data tersimpan di perangkat ini saja dan bisa tercampur bila satu perangkat dipakai bergantian.';
function rptTxt(){const L=[];let tot=0,okt=0,wk=null,wa=101;
L.push('LAPORAN BELAJAR — Kota Profesi (Bahasa Arab: المهن)',`Nama: ${NM||'(tanpa nama)'} · Tanggal: ${dstr()}`,`Peringkat: ${rank()} · Lencana: ${pois.filter(p=>p.lv>0).length}/24 · Bintang emas: ${cntLv(3)} · Kata dikuasai: ${cntWs()}/24`,'','Ketercapaian per topik:');
TOP.forEach(([k,t])=>{const s=G.st[k]||{ok:0,n:0};tot+=s.n;okt+=s.ok;if(!s.n){L.push(`- ${t}: belum dicoba`);return}const a=Math.round(s.ok/s.n*100);if(a<wa){wa=a;wk=t}L.push(`- ${t}: ${s.ok}/${s.n} benar (${a}%) — ${lvl(a)}`)});
L.push('',`Total: ${okt}/${tot} jawaban benar${tot?` (${Math.round(okt/tot*100)}%)`:''} · Total benar sepanjang waktu: ${tc()}`);
const dx=G.dx||[];if(dx.length){const a=dx[0].ok,b=dx[dx.length-1].ok;L.push('',`Cek kemampuan: awal ${a}/5`+(dx.length>1?` → terbaru ${b}/5 (${b-a>=0?'+':''}${b-a})`:' (belum ada cek ulang)'))}
L.push('',stbTxt(),ltTxt());
const r=G.rf.slice(-5);if(r.length){L.push('','Refleksi terakhir murid:');r.forEach(x=>L.push(`- ${x.p}: ${['','Masih bingung','Cukup paham','Paham'][x.v]} (${x.ok}/${x.n} benar)`))}
L.push('',`Tugas Dunia Nyata: ${G.rw.length}/${RWT.length} selesai`,'',`Saran tindak lanjut: ${wk?`penguatan "${wk}" (capaian terendah). `:''}${wa<60?'Beri bimbingan kecil atau tutor sebaya, ulang kartu materi.':'Tantang dengan percakapan berpasangan dan membuat kalimat sendiri.'}`);
L.push('',DISC);return L.join('\n')}
const ltTxt=()=>{const a=Object.values(G.lt||{}),m=a.filter(e=>e.b>=2).length;return `Ulangan berjarak: ${m} dari ${a.length} butir materi sudah kuat (benar 2x berturut-turut di hari berbeda) · ${dueN()} butir waktunya diulang · ${G.rvn||0}x Kuis Ulang Harian`};
const stbTxt=()=>'Latihan di pos (skor terbaik dari 5 soal): '+STN.map(s=>`${s.t.replace('Pos ','')} ${G.stb[s.k]!==undefined?G.stb[s.k]+'/5':'belum'}`).join(' · ');
function RPT(){return `<div class="gt">📊 Laporan Belajar${NM?' – '+NM:''}</div><div class="ex">⚠️ ${DISC}</div>`+TOP.map(([k,t])=>{const s=G.st[k]||{ok:0,n:0},a=s.n?Math.round(s.ok/s.n*100):0;return`<div class="mi"><b>${t}</b> <small>${s.n?`${s.ok}/${s.n} · ${lvl(a)}`:'belum dicoba'}</small><div class="bar"><i style="width:${a}%"></i></div></div>`}).join('')+`<div class="ex">${stbTxt()}</div><div class="mi"><small>${ltTxt()}</small></div><button class="opt go" id="pdf">📄 Unduh Laporan PDF Lengkap</button><div class="bkr"><button class="opt bkx">💾 Simpan data ke file</button><button class="opt bki">📂 Muat data dari file</button><small class="bkt"></small></div><button class="opt" id="dx">🧭 Cek ${(G.dx||[]).length?'Ulang':'Awal'} Kemampuan (5 soal)</button><div class="gt">Salin untuk guru / buku nilai</div><textarea class="rp" readonly id="rpt">${rptTxt()}</textarea><button class="opt go" id="cpy">📋 Salin laporan</button>`}
function RW(){return `<div class="gt">🌍 Tugas Dunia Nyata (+30 🪙)</div><div class="ex">Belajar jadi bermakna kalau dipakai! Kerjakan bersama teman atau keluarga, lalu centang setelah gurumu atau temanmu menyaksikan.</div>`+RWT.map((x,i)=>{const d=G.rw.includes(i);return`<div class="mi${d?' done':''}"><label class="cb"><input type="checkbox" data-rw="${i}" ${d?'checked disabled':''}><span><b>${x[0]}</b><br><small>${x[1]}</small><br><small>🧠 Level berpikir: ${['Menerapkan','Menerapkan','Menganalisis','Mencipta','Mencipta'][i]}</small></span></label><div class="pat" data-sp="${x[2]}"><span class="ar">${x[2]}</span><small>🔊 Ketuk untuk contoh ucapan</small></div></div>`}).join('')}
function bindX(c){bkBind(c);const pb=c.querySelector('#pdf');if(pb)pb.onclick=()=>savePdf(pb);const dxb=c.querySelector('#dx');if(dxb)dxb.onclick=()=>quiz({kind:'st',k:'dx',t:'Cek Kemampuan',ar:'تَقْوِيمٌ'});const b=c.querySelector('#cpy');if(b)b.onclick=()=>{const t=c.querySelector('#rpt');t.select();let ok=false;try{navigator.clipboard&&navigator.clipboard.writeText(t.value);ok=document.execCommand('copy')}catch(e){}b.textContent=ok?'✅ Tersalin!':'Teks sudah dipilih, tekan Ctrl+C / Salin'};
c.querySelectorAll('[data-rw]').forEach(x=>x.onchange=()=>{const i=+x.dataset.rw;if(x.checked&&!G.rw.includes(i)){G.rw.push(i);coins+=30;x.disabled=true;x.closest('.mi').classList.add('done');snd(988,.15,'triangle');confetti();hud();const rq=checkQuests();if(rq.length)setTimeout(()=>celebrate(rq),900)}})}
// ================= LAPORAN PDF =================
const PAL={ok:'#2fbf85',mid:'#e0a43a',lo:'#ff6b5e'},BL=['Menerapkan','Menerapkan','Menganalisis','Mencipta','Mencipta'];
const REM={v:'flashcard bergambar dan permainan tebak profesi berpasangan',mf:'kartu dia (lk) / dia (pr) dengan foto teman dan latihan mengganti subjek',mt:'menempelkan akhiran kepemilikan (-nya, -ku, -mu) pada benda nyata secara lisan',pj:'bermain peran tanya-jawab dengan empat kata tanya',ct:'wawancara cita-cita teman dan aturan tanwin fathah setelah kata kerja menjadi',sk:'menyusun kartu kata acak di papan tulis secara berkelompok lalu membacakan kalimatnya',kt:'tebak gambar tempat kerja dan gerakan kegiatan (menanam, menjahit, menerbangkan) sambil menyebut kata Arabnya',tr:'memecah kalimat menjadi subjek, predikat, dan keterangan lalu menerjemahkan per bagian'};
async function pdfReport(){await Promise.all([document.fonts.load('700 30px Amiri'),document.fonts.load('700 30px Baloo 2')]).catch(()=>0);
const W=1190,H=1684,M=70,pg=[];let g,y;
const np=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;g=c.getContext('2d');g.fillStyle='#fffaf0';g.fillRect(0,0,W,H);pg.push(c);y=M};
const T=(t,x,sz,col='#1d2b53',w=500,al='left')=>{g.font=`${w} ${sz}px 'Baloo 2',system-ui,sans-serif`;g.fillStyle=col;g.textAlign=al;g.direction='ltr';g.fillText(t,x,y)};
const A=(t,x,sz,col='#1d2b53')=>{g.font=`700 ${sz}px Amiri,serif`;g.fillStyle=col;g.textAlign='right';g.direction='rtl';g.fillText(t,x,y)};
const need=h=>{if(y+h>H-M)np()};
const H2=t=>{need(110);y+=34;T(t,M,32,'#1d2b53',700);g.fillStyle='#ffcf3f';g.fillRect(M,y+8,120,5);y+=44};
const P=(t,x=M,sz=24,col='#1d2b53',w=W-2*M)=>{g.font=`500 ${sz}px 'Baloo 2',system-ui,sans-serif`;let ln='';const L=[];t.split(' ').forEach(s=>{const z=ln?ln+' '+s:s;if(g.measureText(z).width>w&&ln){L.push(ln);ln=s}else ln=z});L.push(ln);L.forEach(s=>{need(40);T(s,x,sz,col);y+=sz*1.5});y+=6};
const bl=t=>P('• '+t,M+10,23,'#1d2b53',W-2*M-20);
const bar=(x,w,p,col)=>{g.fillStyle='#e6dcc3';g.fillRect(x,y-18,w,16);g.fillStyle=col;g.fillRect(x,y-18,w*p,16)};
const dx=G.dx||[],S2=TOP.map(([k,t])=>{const s=G.st[k]||{ok:0,n:0};return{k,t,n:s.n,ok:s.ok,a:s.n?Math.round(s.ok/s.n*100):null}}),tot=S2.reduce((a,x)=>a+x.n,0),okt=S2.reduce((a,x)=>a+x.ok,0),acc=tot?Math.round(okt/tot*100):0;
np();g.fillStyle='#1d2b53';g.fillRect(0,0,W,210);
y=95;T('Laporan Kemajuan Belajar Bahasa Arab',M,46,'#ffffff',700);y=150;T('Kota Profesi · Topik: Al-Mihan (Profesi)',M,26,'#ffcf3f');y=160;A('مَدِينَةُ الْمِهَنِ',W-M,56,'#ffffff');
y=270;T('Nama: '+(NM||'(tanpa nama)'),M,30,'#1d2b53',700);T('Tanggal: '+dstr()+' · Peringkat: '+rank(),W-M,24,'#1d2b53',500,'right');y=300;
const box=(x,w,v,l,col)=>{g.fillStyle='#fff';g.fillRect(x,y,w,130);g.strokeStyle='#1d2b53';g.lineWidth=3;g.strokeRect(x,y,w,130);const s=y;y=s+70;T(v,x+w/2,48,col,700,'center');y=s+110;T(l,x+w/2,22,'#1d2b53',500,'center');y=s};
const bw=(W-2*M-60)/4;box(M,bw,acc+'%','Akurasi total',acc>=80?PAL.ok:acc>=60?PAL.mid:PAL.lo);box(M+bw+20,bw,pois.filter(p=>p.lv>0).length+'/24','Lencana warga','#1d2b53');box(M+2*(bw+20),bw,cntLv(3)+'','Bintang emas','#e0a43a');box(M+3*(bw+20),bw,cntWs()+'/24','Kata dikuasai',PAL.ok);y+=165;
P(`Misi selesai ${G.q}/${QS.length} · Pencapaian ${G.md.size}/${MS.length} · Koin ${coins} · Total ${okt}/${tot} jawaban benar`,M,22,'#555');
H2('1. Ketercapaian per Topik');
S2.forEach(x=>{need(84);const col=x.a>=80?PAL.ok:x.a>=60?PAL.mid:PAL.lo;T(x.t,M,24,'#1d2b53',700);T(x.n?`${x.ok}/${x.n} benar · ${x.a}% · ${lvl(x.a)}`:'belum dicoba',W-M,22,x.n?col:'#888',700,'right');y+=30;bar(M,W-2*M,(x.a||0)/100,col);y+=46});
H2('2. Cek Kemampuan Awal vs Terbaru');
if(dx.length){const a=dx[0].ok,b=dx[dx.length-1].ok;P(`Cek awal: ${a}/5 (${dx[0].d}). Cek terbaru: ${b}/5 (${dx[dx.length-1].d}). Selisih: ${b-a>=0?'+':''}${b-a}.${dx.length<2?' Belum ada cek ulang; sarankan mengulang setelah beberapa pekan.':b>a?' Ada peningkatan.':b==a?' Belum ada perubahan; periksa topik terlemah.':' Menurun; perlu pendampingan.'}`)}else P('Murid belum mengerjakan Cek Kemampuan. Disarankan dikerjakan di awal pembelajaran sebagai asesmen diagnostik, lalu diulang untuk melihat pertumbuhan.');
P(stbTxt());P(ltTxt());
need(330);H2('3. Peta Penguasaan Kosakata ('+cntWs()+'/24 dikuasai)');
const cw=(W-2*M)/2;for(let r=0;r<12;r++){need(52);[r,r+12].forEach((k,c)=>{const x=M+c*cw;A(D[k].ar,x+170,30);T(D[k].id.replace(' (perempuan)',' (pr)').replace(' (laki-laki)',' (lk)'),x+185,20);const n=Math.min(3,G.ws[k]);for(let d=0;d<3;d++){g.fillStyle=d<n?PAL.ok:'#e6dcc3';g.beginPath();g.arc(x+cw-70+d*22,y-8,8,0,7);g.fill()}});y+=46}
P('Tiga titik hijau = kata dikuasai (3 kali dijawab benar). Jawaban salah menurunkan satu titik sebagai bagian dari pengulangan berjarak.',M,19,'#777');
H2('4. Refleksi Diri Murid');
const rf=G.rf||[];if(!rf.length)P('Belum ada refleksi. Refleksi muncul di akhir kuis warga.');else{const c=[0,0,0,0];rf.forEach(x=>c[x.v]++);P(`Dari ${rf.length} refleksi: paham ${c[3]}, cukup ${c[2]}, masih bingung ${c[1]}.`);rf.slice(-8).forEach(x=>bl(`${x.d} · ${x.p}: ${['','masih bingung','cukup paham','paham'][x.v]} (skor ${x.ok}/${x.n})`));const ov=rf.filter(x=>x.v==3&&x.ok<=3).length,un=rf.filter(x=>x.v==1&&x.ok>=4).length;if(ov)P(`Kalibrasi diri: ${ov} kali murid merasa paham tetapi skor 3/5 atau kurang. Ajak murid menjelaskan ulang dengan kata sendiri (teach-back).`,M,22,'#b8402f');if(un)P(`Kalibrasi diri: ${un} kali murid merasa bingung padahal skor tinggi. Beri penguatan agar percaya diri.`,M,22,'#2f7f5f')}
H2('5. Tugas Dunia Nyata ('+G.rw.length+'/'+RWT.length+')');
RWT.forEach((x,i)=>{need(44);const d=G.rw.includes(i);g.strokeStyle='#1d2b53';g.lineWidth=3;g.strokeRect(M,y-22,24,24);if(d){g.fillStyle=PAL.ok;g.fillRect(M+4,y-18,16,16)}T(`${x[0]} (level: ${BL[i]})`,M+40,24,d?'#1d2b53':'#777');y+=42});
H2('6. Analisis dan Rekomendasi untuk Guru');
const st=S2.filter(x=>x.n&&x.a>=80),md=S2.filter(x=>x.n&&x.a>=60&&x.a<80),wk=S2.filter(x=>x.n&&x.a<60),nt=S2.filter(x=>!x.n),lw=D.map((d,k)=>[d,G.ws[k]]).filter(x=>x[1]<3);
bl(`Profil umum: akurasi ${acc}% dari ${tot} jawaban (${lvl(acc)}).${tot<15?' Data masih sedikit, simpulkan dengan hati-hati.':''}`);
if(st.length)bl(`Kekuatan: ${st.map(x=>x.t).join('; ')}.`);
if(md.length)bl(`Sedang berkembang: ${md.map(x=>x.t).join('; ')}. Lanjutkan latihan berjarak.`);
wk.forEach(x=>bl(`Perlu penguatan: ${x.t} (${x.a}%). Saran kegiatan: ${REM[x.k]}.`));
if(nt.length)bl(`Belum dicoba: ${nt.map(x=>x.t).join('; ')}.`);
bl(`Kosakata: ${cntWs()}/24 dikuasai.${lw.length?` Belum dikuasai antara lain: ${lw.slice(0,8).map(x=>x[0].id).join(', ')}.`:''}`);
bl(`Keaktifan: ${tot} soal dikerjakan dengan ${okt} jawaban benar. Data ini gambaran latihan, bukan nilai. Jangan dipakai untuk rapor atau SAS.`);
need(90);y+=10;T('Rencana tindak lanjut',M,26,'#1d2b53',700);y+=38;
bl(acc<60?'Remedial: bimbingan kelompok kecil atau tutor sebaya, ulang kartu materi dan fitur perbaiki soal salah, lalu Cek Ulang dalam 1-2 pekan.':acc<80?'Penguatan: latihan berjarak pada topik terendah, lalu praktik percakapan berpasangan di kelas.':'Pengayaan: tantang murid membuat dialog sendiri, menjadi tutor sebaya, dan mengerjakan Tugas Dunia Nyata tingkat Mencipta.');
P(DISC,M,20,'#777');
pg.forEach((c,k)=>{const x=c.getContext('2d');x.font="500 20px 'Baloo 2',sans-serif";x.fillStyle='#777';x.textAlign='center';x.fillText(`Kota Profesi · dibuat otomatis ${dstr()} · halaman ${k+1}/${pg.length}`,W/2,H-30)});return pg}
// PDF ditulis sendiri (tiap halaman = satu gambar JPEG A4): tanpa pustaka luar, jadi jalan juga saat offline.
function mkPdf(js){const enc=new TextEncoder(),parts=[],off=[];let len=0;
const push=x=>{const b=typeof x=='string'?enc.encode(x):x;parts.push(b);len+=b.length},obj=(n,f)=>{off[n]=len;push(n+' 0 obj\n');f();push('\nendobj\n')};
push('%PDF-1.4\n');obj(1,()=>push('<< /Type /Catalog /Pages 2 0 R >>'));
obj(2,()=>push('<< /Type /Pages /Kids ['+js.map((_,k)=>(3+k*3)+' 0 R').join(' ')+'] /Count '+js.length+' >>'));
js.forEach((j,k)=>{const p=3+k*3,cs=`q 595.28 0 0 841.89 0 0 cm /Im${k} Do Q`;
obj(p,()=>push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im${k} ${p+2} 0 R >> >> /Contents ${p+1} 0 R >>`));
obj(p+1,()=>push(`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`));
obj(p+2,()=>{push(`<< /Type /XObject /Subtype /Image /Width ${j.w} /Height ${j.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${j.d.length} >>\nstream\n`);push(j.d);push('\nendstream')})});
const xr=len,tot=3+js.length*3;push(`xref\n0 ${tot}\n0000000000 65535 f \n`);for(let n=1;n<tot;n++)push(String(off[n]).padStart(10,'0')+' 00000 n \n');
push(`trailer\n<< /Size ${tot} /Root 1 0 R >>\nstartxref\n${xr}\n%%EOF`);return new Blob(parts,{type:'application/pdf'})}
const jpgOf=c=>{const b=atob(c.toDataURL('image/jpeg',.92).split(',')[1]),d=new Uint8Array(b.length);for(let i=0;i<b.length;i++)d[i]=b.charCodeAt(i);return{d,w:c.width,h:c.height}};
// kirim berkas ke pengguna: unduhan Claude bila ada -> menu Bagikan (sentuh) -> unduhan biasa. Hasil: 'ok' | 'batal'
async function kirimBerkas(blob,fn){let done=false;
try{const dl=window.claude&&claude.use?await claude.use('downloads'):null;if(dl){await dl.save({filename:fn,data:blob});done=true}}catch(e){if(e&&e.code=='declined')return 'batal'}
if(!done&&matchMedia('(pointer:coarse)').matches){try{const f=new File([blob],fn,{type:blob.type});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:fn});done=true}}catch(e){if(e&&e.name=='AbortError')return 'batal'}}
if(!done){const a=document.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=fn;a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u)},8000)}
return 'ok'}
async function savePdf(b){const o=b.textContent;b.disabled=true;b.textContent='⏳ Menyusun PDF…';
try{const pg=await pdfReport(),blob=mkPdf(pg.map(jpgOf)),fn=`Laporan-KotaProfesi-${(NM||'murid').replace(/[^\p{L}\p{N} _-]/gu,'').trim()||'murid'}-${dstr()}.pdf`;
if(await kirimBerkas(blob,fn)=='batal')b.textContent=o;else b.textContent='✅ PDF siap: '+fn}catch(e){b.textContent='PDF belum bisa dibuat ('+((e&&e.message)||'galat')+'). Gunakan Salin laporan.'}b.disabled=false}
