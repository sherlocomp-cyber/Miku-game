
/*LOGIC-START*/
const DEF_DB='https://miku-profesi-default-rtdb.asia-southeast1.firebasedatabase.app',ROOT='siswa',EXN=40;
const num=(v,d=0)=>{v=+v;return isFinite(v)?v:d};
const jp=t=>{if(t&&typeof t==='object')return t;try{return JSON.parse(t)}catch(e){return null}};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>new Date().toLocaleDateString('sv-SE');
const D=[['فَلَّاحٌ','petani','Sawah','m'],['مُهَنْدِسٌ','insinyur','Proyek Bangunan','m'],['تَاجِرٌ','pedagang','Pasar','m'],['شُرْطِيٌّ','polisi','Pos Polisi','m'],['طَبِيبَةٌ','dokter (pr)','Rumah Sakit','f'],['جُنْدِيٌّ','tentara','Barak','m'],['مُدَرِّسَةٌ','guru (pr)','Sekolah','f'],['صَحَافِيَّةٌ','jurnalis (pr)','Studio TV','f'],['طَبَّاخَةٌ','koki (pr)','Dapur Restoran','f'],['مُبَلِّغٌ','penceramah','Masjid','m'],['خَيَّاطَةٌ','penjahit (pr)','Butik Jahit','f'],['طَيَّارٌ','pilot','Bandara','m'],['مُوَظَّفَةٌ','karyawan (pr)','Bank','f'],['تِلْمِيذٌ','siswa','Perpustakaan','m'],['رَبَّةُ الْبَيْتِ','ibu rumah tangga','Rumah Keluarga','f'],['سَائِقٌ','sopir','Terminal Bus','m'],['مُمَرِّضَةٌ','perawat (pr)','Klinik','f'],['لَاعِبٌ','pemain bola','Stadion','m'],['عَالِمٌ','ilmuwan','Laboratorium','m'],['طَبِيبٌ','dokter (lk)','Puskesmas','m'],['طَبَّاخٌ','koki (lk)','Warung Makan','m'],['مُهَنْدِسَةٌ','insinyur (pr)','Kantor Arsitek','f'],['تَاجِرَةٌ','pedagang (pr)','Toko','f'],['مُبَلِّغَةٌ','penceramah (pr)','Majelis Taklim','f']].map((x,i)=>({i,ar:x[0],id:x[1],pl:x[2],g:x[3]}));
const TOP=[['v','Kosakata profesi','C1 Mengingat',1],['kt','Kosakata tempat & kegiatan','C1 Mengingat',1],['mf','Dhamir munfasil','C2 Memahami',2],['mt','Dhamir muttasil','C2 Memahami',2],['pj','Tanya-jawab','C3 Menerapkan',3],['ct','Cita-cita (أُرِيدُ أَنْ أَكُونَ)','C3 Menerapkan',3],['sk','Susun kalimat','C3 Menerapkan',3],['tr','Terjemah kalimat','C4 Menganalisis',4]];
const TSHORT={v:'Kosakata',kt:'Tempat',mf:'Munfasil',mt:'Muttasil',pj:'Tanya-jwb',ct:'Cita-cita',sk:'Susun',tr:'Terjemah'};
const TI={
v:{rem:'flashcard bergambar dan permainan tebak profesi berpasangan',why:'Kaitan kata Arab dengan arti/gambar belum kuat; bentuk laki-laki dan perempuan (mudzakkar/mu\'annats) mudah tertukar.',probe:'Tunjukkan gambar profesi, minta siswa menyebut kata Arabnya, lalu bentuk perempuannya.'},
kt:{rem:'tebak gambar tempat kerja dan gerakan kegiatan (menanam, menjahit, menerbangkan) sambil menyebut kata Arabnya',why:'Kosakata tempat dan kegiatan serta pasangan kata kerja laki-laki (يَـ) / perempuan (تَـ) belum melekat.',probe:'Tanya: "أَيْنَ يَعْمَلُ الطَّبِيبُ؟" dan "مَاذَا تَعْمَلُ الْخَيَّاطَةُ؟" secara lisan.'},
mf:{rem:'kartu dia (lk) / dia (pr) dengan foto teman dan latihan mengganti subjek',why:'Dhamir هُوَ/هِيَ atau أَنْتَ/أَنْتِ tertukar; kemungkinan belum mantap membedakan mudzakkar dan mu\'annats.',probe:'Tunjuk dua teman (laki-laki dan perempuan), minta siswa memperkenalkan masing-masing dengan هُوَ / هِيَ.'},
mt:{rem:'menempelkan akhiran kepemilikan (-nya, -ku, -mu) pada benda nyata secara lisan',why:'Akhiran ـهُ / ـهَا / ـي / ـكَ / ـكِ tertukar; belum menangkap bahwa akhiran menandai kepemilikan.',probe:'Pegang buku: "كِتَابِي" lalu serahkan ke teman: "كِتَابُكَ / كِتَابُكِ". Minta siswa menjelaskan bedanya.'},
pj:{rem:'bermain peran tanya-jawab dengan empat kata tanya',why:'Fungsi مَنْ، مَا، أَيْنَ، هَلْ tertukar; pola jawaban نَعَمْ / لَا belum otomatis.',probe:'Beri jawaban, minta siswa menebak pertanyaannya ("طَبِيبٌ" → "مَا مِهْنَتُهُ؟").'},
ct:{rem:'wawancara cita-cita teman dan aturan tanwin fathah setelah kata kerja menjadi',why:'Bentuk manshub (tanwin fathah) setelah أَنْ أَكُونَ belum dikuasai; أُرِيدُ / تُرِيدُ / تُرِيدِينَ tertukar.',probe:'Minta siswa mengucapkan cita-citanya dengan أُرِيدُ أَنْ أَكُونَ ... lalu tanyakan akhiran profesinya.'},
sk:{rem:'menyusun kartu kata acak di papan tulis secara berkelompok lalu membacakan kalimatnya',why:'Urutan kalimat Arab (penanda pola, subjek, predikat) belum terbentuk; siswa mungkin menyusun seperti urutan bahasa Indonesia.',probe:'Beri 4 kartu kata acak, minta siswa menyusun dan membaca; tanyakan kata mana yang harus pertama.'},
tr:{rem:'memecah kalimat menjadi subjek, predikat, dan keterangan lalu menerjemahkan per bagian',why:'Menerjemah kata per kata tanpa memahami struktur kalimat; butuh latihan menganalisis bagian kalimat.',probe:'Tulis satu kalimat Arab, minta siswa menunjuk subjek, predikat, dan tempat, baru menerjemahkan.'}};
const ST=[[1,'Profesi Bab 2','TP 1'],[2,'Profesi & Cita-cita Bab 3','TP 1'],[3,'Dhamir Munfasil','TP 2'],[4,'Dhamir Muttasil','TP 2'],[5,'Tanya-Jawab & Percakapan','TP 3'],[6,'Membaca & Memahami','TP 3'],[7,'Menulis: Susun & Terjemah','TP 4']];
const TY={v:'Kosakata',pc:'Soal bergambar',pa:'Gambar kegiatan',ti:'Ketik arti',kt:'Tempat & kegiatan',xv:'Kosakata tambahan',mf:'Dhamir munfasil',dp:'Dual & jamak',dm:'Kata tunjuk',cm:'Konsep munfasil',mt:'Dhamir muttasil',mp:'Muttasil dalam kalimat',cs:'Konsep muttasil',pj:'Tanya-jawab',wh:'Kata tanya',dl:'Dialog',ct:'Cita-cita',rd:'Bacaan',tf:'Benar/salah',ts:'Susun ke Arab',hs:'Susun huruf',hr:'Sambung huruf',fm:"Bentuk mu'annats",sk:'Susun kalimat',tr:'Terjemah',tr2:'Terjemah kalimat',ts2:'Susun kalimat buku'};
const QT=['Kenalan dengan Warga','Siapa Dia? هُوَ / هِيَ','Milikku, Milikmu','Tanya-Jawab Seru','Cita-citaku','Penerjemah Cilik','Pemburu Kata','Setengah Kota','Bintang Emas','Juara Kota','Duta Bahasa Nyata','Tukang Susun Kalimat','Kamus Tempat Kerja','Pos Susun Kalimat'];
const MS=[['l','Jago Kosakata'],['c','Ahli Dhamir Munfasil'],['d','Ahli Dhamir Muttasil'],['e','Juru Bicara'],['f','Raja Cita-cita'],['g','Penerjemah Handal'],['h','Penguasa Kosakata'],['k','Kilat Cerdas'],['p','Penyusun Kalimat'],['n','Pakar Tempat Kerja'],['s','Rajin Berlatih'],['a1','Langkah Pertama'],['a2','Kolektor Lencana'],['a3','Bintang Pertama'],['a4','Kolektor Bintang'],['a5','Bintang Sempurna'],['a6','Teman Ngobrol'],['a7','Sahabat Warga'],['a8','Pemain Pasangan'],['a9','Ingatan Emas'],['b1','Gaya Kota'],['b2','Fashionista'],['b3','Penjelajah Kotak'],['b4','Raja Kilat'],['b5','Pahlawan Dunia Nyata'],['b6','Pelajar Hebat'],['b7','Master Soal'],['c1','Cita-cita Terwujud'],['b8','Penakluk Misi']];
const RWT=[['Wawancara Keluarga','Menerapkan'],['Dialog Berpasangan','Menerapkan'],['Kenalkan Temanmu','Menganalisis'],['Kartu Profesi Sekolahku','Mencipta'],['Pidato Mini Cita-citaku','Mencipta']];
const RTX={1:'Masih bingung',2:'Cukup paham',3:'Paham'};
const lvl=a=>a>=80?'Mahir':a>=60?'Berkembang':'Perlu bimbingan';
const accCol=a=>a==null?'var(--gr)':a>=80?'var(--ok)':a>=60?'var(--mid)':'var(--lo)';
const baseName=n=>String(n).toLowerCase().replace(/(?<![0-9])\s*(kelas\s*)?[1-6]\s*[.\-]?\s*[a-z]?\s*$/,'').replace(/[^a-z0-9\u0600-\u06ff ]/g,'').replace(/\s+/g,' ').trim();
const klsOf=n=>{const m=String(n).trim().match(/(?<![0-9])(?:kelas\s*)?([1-6])\s*[.\-]?\s*([a-zA-Z])?\s*$/i);return m?m[1]+(m[2]||'').toUpperCase():''};

function parseStudent(key,rec){
 rec=rec&&typeof rec==='object'?rec:{};
 const g0=jp(rec.data),full=!!(g0&&typeof g0==='object'),g=full?g0:{};
 const sas=jp(rec.sas)||{},sx=jp(rec.sasx);
 const rg=rec.ringkas&&typeof rec.ringkas==='object'?rec.ringkas:{};
 const arr=a=>Array.isArray(a)?a:[];
 const stO=g.st&&typeof g.st==='object'?g.st:{};
 const topics=TOP.map(([k,t,b,c])=>{const e=stO[k]||{},n=Math.max(0,num(e.n)),ok=Math.min(n,Math.max(0,num(e.ok)));return{k,t,b,c,n,ok,acc:n?Math.round(ok/n*100):null}});
 let tot=0,okt=0;Object.values(stO).forEach(e=>{if(e&&typeof e==='object'){const n=Math.max(0,num(e.n)),o=Math.min(n,Math.max(0,num(e.ok)));tot+=n;okt+=o}});
 if(!full&&num(rg.benar)>okt)okt=num(rg.benar);
 const ws=D.map((_,i)=>Math.max(0,num(arr(g.ws)[i])));
 const lv=D.map((_,i)=>Math.max(0,Math.min(3,num(arr(g.lv)[i]))));
 const lencana=full?lv.filter(v=>v>0).length:num(rg.lencana),bintang=full?lv.filter(v=>v>=3).length:num(rg.bintang);
 const md=arr(g.md),q=full?num(g.q):num(rg.misi),koin=full?num(g.c):num(rg.koin);
 const lt=g.lt&&typeof g.lt==='object'?Object.entries(g.lt).filter(e=>e[1]&&typeof e[1]==='object'):[],td=today();
 const ltInfo={n:lt.length,strong:lt.filter(e=>num(e[1].b)>=2).length,due:lt.filter(e=>String(e[1].due||'')<=td).length,weak:lt.filter(e=>num(e[1].b)===0).map(e=>e[0])};
 const rf=arr(g.rf).filter(x=>x&&typeof x==='object');
 const over=rf.filter(x=>num(x.v)===3&&num(x.ok)<=3).length,under=rf.filter(x=>num(x.v)===1&&num(x.ok)>=4).length;
 const dx=arr(g.dx).filter(x=>x&&typeof x==='object');
 const ex=g.ex&&typeof g.ex==='object'?g.ex:null;
 const stn=ST.map(([id,t,tp])=>{const e=(sas.st&&sas.st[id])||{};return{id,t,tp,done:!!e.done,best:num(e.best),pr:num(e.pr),gt:num(e.gt),seen:!!e.seen}});
 const sim=sas.sim&&typeof sas.sim==='object'?sas.sim:{},sasM=Object.entries(sas.M||{}).filter(e=>e[0].startsWith('t:')&&e[1]&&num(e[1].n)>0).map(e=>({k:e[0].slice(2),ok:num(e[1].ok),n:num(e[1].n)}));
 const mgBest=g.mg&&g.mg.best&&typeof g.mg.best==='object'?Object.values(g.mg.best).map(x=>num(x)):[];
 const dates=new Set();rf.forEach(x=>x.d&&dates.add(x.d));dx.forEach(x=>x.d&&dates.add(x.d));if(ex&&ex.last&&ex.last.d)dates.add(ex.last.d);if(g.rvd)dates.add(g.rvd);if(sim.last&&sim.last.d)dates.add(sim.last.d);if(sx&&sx.d)dates.add(sx.d);
 const nama=String(rec.nama||key).trim();
 const s={key,nama,kelas:klsOf(nama),ts:num(rec.ts),full,tot,ok:okt,acc:tot?Math.round(okt/tot*100):null,topics,ws,lv,wsM:ws.filter(v=>v>=3).length,lencana,bintang,koin,q,md,seen:arr(g.seen).length,
  kw:num(g.kw),rf,over,under,dx,rw:arr(g.rw).map(num),ex,lt:ltInfo,dlg:g.dlg&&typeof g.dlg==='object'?Object.keys(g.dlg).length:0,mg:mgBest,rvn:num(g.rvn),rvd:g.rvd||'',own:arr(g.own).length,
  stn,stDone:stn.filter(x=>x.done).length,stTouched:stn.some(x=>x.pr||x.gt||x.seen),sim:{best:num(sim.best),tries:num(sim.tries),last:sim.last||null},sx:sx&&typeof sx==='object'?{nilai:num(sx.nilai),a:num(sx.a),b:num(sx.b),c:num(sx.c),d:sx.d}:null,sasM,
  stb:g.stb&&typeof g.stb==='object'?g.stb:{},activeDates:[...dates].sort()};
 s.skor=s.lencana*50+s.bintang*30+s.ok*3+s.q*20+s.md.length*10;
 s.A=analyze(s);return s}

