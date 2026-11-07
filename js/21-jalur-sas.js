/* === BAGIAN 21: Jalur SAS (7 stasiun + Peta Penguasaan + Simulasi SAS) ===
   Modul mandiri: tidak mengubah file lain. Memakai gen(), D, GR, PERS, AV, KWP, tapUI, bindSp, say, snd, hud dari file 01-20.
   Progres disimpan di localStorage kunci SK+':sas' (terpisah dari simpanan game utama).
   Alur: Stasiun 1-7 (Materi -> Latihan 8 soal -> Gerbang 10 soal, lulus >= 8) -> Simulasi SAS (A 20 PG, B 10 isian, C 5 uraian). */
(function(){
const KEY=(typeof SK!=='undefined'?SK:'kotaProfesi.v3')+':sas';
let SS={st:{},M:{},sim:{best:0,tries:0,last:null,paid:0},nudged:0};
try{const r=JSON.parse(lsg(KEY)||'null');if(r)SS=Object.assign(SS,r)}catch(e){}
SS.st=SS.st||{};SS.M=SS.M||{};SS.sim=SS.sim||{best:0,tries:0,last:null,paid:0};
const sv=()=>{try{lss(KEY,JSON.stringify(SS))}catch(e){}};
const ALL=D.map((_,i)=>i),IA=[0,1,2,3,5,9,10,11,12,13,14,15,16,17,19,20],IB=[4,6,7,8,18,21,22,23],AVK=[0,3,4,5,10,11,19];
const strip=s=>String(s).replace(/[\u064B-\u0652\u0670\u0640]/g,'');
const nrm=s=>String(s).toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim().replace(/^(seorang|si|sang)\s+/,'');
const PR=g=>g=='m'?'هُوَ':'هِيَ',base=s=>s.replace(/\s*\(.*?\)/,'').trim(),LK=g=>g=='m'?'lk':'pr';
const lv=k=>{const m=SS.M[k];return m?Math.min(3,m.s||0):0};
function mrec(q,ok){const f=k=>{const m=SS.M[k]||(SS.M[k]={ok:0,n:0,s:0});m.n++;if(ok){m.ok++;m.s=Math.min(5,(m.s||0)+1)}else m.s=0};f('t:'+q.t);if(q.w!=null)f('w:'+q.w);if(q.k)f('k:'+q.k);sv()}
const pickW=(n,kf)=>{const w=[];let t=0;for(let i=0;i<n;i++){const x=3.2-lv(kf(i));w.push(x);t+=x}let r=Math.random()*t,j=0;while(j<n-1&&(r-=w[j])>0)j++;return j};
const pickD=L=>L[pickW(L.length,j=>'w:'+L[j])];
const pat=(ar,id)=>`<div class="pat" data-sp="${strip(ar)}"><span class="ar">${ar}</span><small>${id}</small></div>`;
const pm=(A,t)=>`<div class="gt">${t}</div>`+A.map(x=>pat(x[0],x[1])).join('');
const vm=(L,t)=>`<div class="gt">${t}</div>`+L.map(i=>pat(D[i].ar,D[i].e+' '+D[i].id)).join('');

/* ---------- DATA TAMBAHAN (dari buku Bab 2 & 3 dan SAS) ---------- */
const XV=[['بَائِعَةٌ','penjual (pr)'],['نَحْنُ','kami / kita'],['نَتَعَلَّمُ','kami belajar'],['الْفَصْلُ الرَّابِعُ','kelas empat'],['عِنْدِي','saya punya'],['عِنْدَنَا','kami punya'],['آمَالٌ','cita-cita (jamak)'],['أَصْدِقَاءُ','teman-teman'],['صَدِيقَتِي','temanku (pr)'],['رَفِيعَةٌ','tinggi / mulia'],['كَثِيرُونَ','banyak'],['فِي الْمُسْتَقْبَلِ','di masa depan'],['جَاوَى الْوُسْطَى','Jawa Tengah'],['أُرِيدُ','saya ingin'],['تُرِيدِينَ','kamu (pr) ingin'],['مَا أَمَلُكَ؟','apa cita-citamu (lk)?'],['الْآنَ','sekarang'],['أَيْضًا','juga'],['الْمَلَابِسُ','pakaian'],['يَعْمَلُ','dia (lk) bekerja']];
const PD=[['هُمَا','mereka berdua (lk/pr)'],['أَنْتُمَا','kalian berdua (lk/pr)'],['هُمْ','mereka (lk)'],['هُنَّ','mereka (pr)'],['أَنْتُمْ','kalian (lk)'],['أَنْتُنَّ','kalian (pr)'],['نَحْنُ','kami / kita']];
const FP=[['طَبِيبٌ','طَبِيبَةٌ','dokter'],['مُدَرِّسٌ','مُدَرِّسَةٌ','guru'],['تَاجِرٌ','تَاجِرَةٌ','pedagang'],['مُهَنْدِسٌ','مُهَنْدِسَةٌ','insinyur'],['مُبَلِّغٌ','مُبَلِّغَةٌ','penceramah'],['طَبَّاخٌ','طَبَّاخَةٌ','koki'],['فَلَّاحٌ','فَلَّاحَةٌ','petani'],['مُمَرِّضٌ','مُمَرِّضَةٌ','perawat'],['مُوَظَّفٌ','مُوَظَّفَةٌ','karyawan'],['صَحَافِيٌّ','صَحَافِيَّةٌ','jurnalis'],['تِلْمِيذٌ','تِلْمِيذَةٌ','siswa'],['خَيَّاطٌ','خَيَّاطَةٌ','penjahit']];
const HW=[['مَدْرَسَة','sekolah'],['مِهْنَة','profesi'],['طَبِيب','dokter'],['تَاجِر','pedagang'],['شُرْطِيّ','polisi'],['جُنْدِيّ','tentara'],['فَلَّاح','petani'],['سَائِق','sopir'],['طَيَّار','pilot'],['عَالِم','ilmuwan'],['مُبَلِّغ','penceramah'],['مُهَنْدِس','insinyur'],['خَيَّاطَة','penjahit'],['مُوَظَّفَة','karyawan'],['مُمَرِّضَة','perawat'],['تِلْمِيذ','siswa'],['طَبَّاخ','koki'],['لَاعِب','pemain bola'],['صَحَافِيَّة','jurnalis'],['مُدَرِّس','guru']];
const SENT=[['هَذَا أَبِي، هُوَ تَاجِرٌ','Ini ayahku, dia seorang pedagang.'],['أُرِيدُ أَنْ أَكُونَ مُدَرِّسَةً فِي الْمُسْتَقْبَلِ','Aku ingin menjadi guru di masa depan.'],['ذَلِكَ عَمِّي لُقْمَانُ، هُوَ شُرْطِيٌّ','Itu pamanku Luqman, dia seorang polisi.'],['هَذِهِ أُمِّي، هِيَ مُدَرِّسَةٌ','Ini ibuku, dia seorang guru.'],['مَا مِهْنَةُ أَبِيكَ؟','Apa profesi ayahmu?'],['أَيْنَ تَعْمَلُ الْمُمَرِّضَةُ؟','Di mana perawat bekerja?'],['هُوَ يُحَافِظُ الْأَمْنَ','Dia (lk) menjaga keamanan.'],['هِيَ تُخَيِّطُ الْمَلَابِسَ','Dia (pr) menjahit pakaian.'],['مَا أَمَلُكِ فِي الْمُسْتَقْبَلِ؟','Apa cita-citamu (pr) di masa depan?'],['أَنَا تِلْمِيذٌ فِي الْفَصْلِ الرَّابِعِ','Aku siswa di kelas empat.'],['مِهْنَتُهَا خَيَّاطَةٌ','Profesinya (pr) penjahit.'],['هُوَ يَعْمَلُ فِي السُّوقِ','Dia (lk) bekerja di pasar.']];
const CN=[
['Dhamir yang bisa berdiri sendiri (terpisah dari kata lain) disebut…','Dhamir munfasil',['Dhamir muttasil','Mudzakkar',"Mu'annats"],'Munfasil = terpisah: هُوَ، هِيَ، أَنَا، أَنْتَ …','mf'],
['Dhamir yang tidak bisa berdiri sendiri (harus bersambung dengan kata lain) disebut…','Dhamir muttasil',['Dhamir munfasil','Mudzakkar',"Mu'annats"],'Muttasil = bersambung: ـهُ، ـهَا، ـي، ـكَ، ـكِ','mt'],
['Dhamir muttasil mengandung makna…','kepemilikan (milik)',['pertanyaan','tempat','waktu'],'Contoh: مِهْنَتُهُ = profesinya, أَمَلِي = cita-citaku.','mt'],
['Dhamir dalam bahasa Indonesia berarti…','kata ganti',['kata kerja','kata sifat','kata tanya'],'Dhamir = kata ganti.','mf'],
['Jumlah dhamir dalam bahasa Arab ada…','14 (empat belas)',['10 (sepuluh)','5 (lima)','20 (dua puluh)'],'Ada 14 dhamir munfasil (tunggal, dual, jamak; untuk lk dan pr).','mf'],
['Kata yang merujuk pada laki-laki disebut…','Mudzakkar',["Mu'annats",'Munfasil','Muttasil'],"Mudzakkar = laki-laki, mu'annats = perempuan.",'mf'],
['Kata yang merujuk pada perempuan disebut…',"Mu'annats",['Mudzakkar','Munfasil','Muttasil'],"Mu'annats = perempuan (biasanya berakhiran ة).",'mf'],
['Pasangan yang semuanya dhamir munfasil adalah…','أَنَا – هِيَ',['هَذَا – هُوَ','ذَلِكَ – هَذَا','أَنْتَ – هَذِهِ'],'هَذَا، هَذِهِ، ذَلِكَ، تِلْكَ adalah kata tunjuk, bukan dhamir.','mf',1],
['Pasangan yang semuanya dhamir muttasil (akhiran) adalah…','ـهُ – ـهَا – ـي',['هُوَ – هِيَ – أَنَا','هَذَا – هَذِهِ – ذَلِكَ','مَنْ – مَا – أَيْنَ'],'Muttasil = akhiran yang menempel pada kata.','mt',1],
['Akhiran untuk “-ku” (misal: cita-citaku) adalah…','ـي',['ـهُ','ـكَ','ـهَا'],'أَمَلِي = cita-citaku.','mt',1]];
const WH=[
['____ مِهْنَةُ أَبِيكَ؟ — هُوَ مُدَرِّسٌ','مَا','مَا = apa → menanyakan profesi.'],
['____ هَذَا؟ — هَذَا فَوْزَانُ','مَنْ','مَنْ = siapa → menanyakan orang.'],
['____ يَعْمَلُ الطَّبِيبُ؟ — يَعْمَلُ فِي الْمُسْتَشْفَى','أَيْنَ','أَيْنَ = di mana → menanyakan tempat.'],
['____ أَنْتَ تَاجِرٌ؟ — نَعَمْ، أَنَا تَاجِرٌ','هَلْ','هَلْ = apakah → jawabannya ya/tidak (نَعَمْ / لَا).'],
['____ يَعْمَلُ هَذَا الرَّجُلُ؟ — يَزْرَعُ الرُّزَّ','مَاذَا','مَاذَا = apa (yang dikerjakan) → menanyakan kegiatan.'],
['____ هَذِهِ؟ — هَذِهِ سَلِيمَةُ، هِيَ طَبِيبَةٌ','مَنْ','مَنْ = siapa → menanyakan orang.'],
['____ أَمَلُكَ فِي الْمُسْتَقْبَلِ؟ — أُرِيدُ أَنْ أَكُونَ طَبِيبًا','مَا','مَا = apa → menanyakan cita-cita.'],
['____ تَعْمَلُ الْمُمَرِّضَةُ؟ — هِيَ تَعْمَلُ فِي الْمُسْتَشْفَى','أَيْنَ','أَيْنَ = di mana → menanyakan tempat.'],
['____ هُوَ شُرْطِيٌّ؟ — لَا، هُوَ جُنْدِيٌّ','هَلْ','هَلْ = apakah → jawabannya نَعَمْ / لَا.'],
['____ تَعْمَلُ الْخَيَّاطَةُ؟ — هِيَ تُخَيِّطُ الْمَلَابِسَ','مَاذَا','مَاذَا = apa (yang dikerjakan) → menanyakan kegiatan.']];
const WQ=['مَنْ','مَا','أَيْنَ','هَلْ','مَاذَا'];
const R2=[['إِسْمِي فَوْزِي، أَنَا تِلْمِيذٌ.','Namaku Fauzi, aku seorang siswa.'],['وَهَذِهِ صَدِيقَتِي، إِسْمُهَا حَمِيدَةُ، هِيَ تِلْمِيذَةٌ أَيْضًا.','Ini temanku, namanya Hamidah, dia juga siswi.'],['نَحْنُ نَتَعَلَّمُ فِي الْمَدْرَسَةِ الْإِبْتِدَائِيَّةِ الْحُكُومِيَّةِ.','Kami belajar di madrasah ibtidaiyah negeri.'],['وَهَذَا السَّيِّدُ عَبْدُ الْحَمِيدِ، هُوَ تَاجِرٌ. هُوَ يَعْمَلُ فِي السُّوقِ.','Ini Tuan Abdul Hamid, dia pedagang. Dia bekerja di pasar.'],['وَهَذِهِ السَّيِّدَةُ سَلِيمَةُ، هِيَ طَبِيبَةٌ. هِيَ تَعْمَلُ فِي الْمُسْتَشْفَى.','Ini Nyonya Salimah, dia dokter. Dia bekerja di rumah sakit.'],['وَذَلِكَ السَّيِّدُ فَوْزَانُ، هُوَ جُنْدِيٌّ. هُوَ يُحَافِظُ الْأَمْنَ.','Itu Tuan Fauzan, dia tentara. Dia menjaga keamanan.'],['وَتِلْكَ السَّيِّدَةُ رَشِيدَةُ، هِيَ مُمَرِّضَةٌ. هِيَ تَعْمَلُ فِي الْمُسْتَشْفَى.','Itu Nyonya Rasyidah, dia perawat. Dia bekerja di rumah sakit.'],['وَذَلِكَ عَمِّي اسْمُهُ لُقْمَانُ، هُوَ شُرْطِيٌّ. هُوَ يُرَتِّبُ الْمُرُورَ.','Itu pamanku, namanya Luqman, dia polisi. Dia mengatur lalu lintas.'],['وَتِلْكَ عَمَّتِي اسْمُهَا نَيْلَى، هِيَ خَيَّاطَةٌ. هِيَ تُخَيِّطُ الْمَلَابِسَ.','Itu bibiku, namanya Naila, dia penjahit. Dia menjahit pakaian.']];
const R3=[['أَنَا تَوْفَانُ، أَنَا الْآنَ فِي الْفَصْلِ الرَّابِعِ مِنَ الْمَدْرَسَةِ الْإِبْتِدَائِيَّةِ الْحُكُومِيَّةِ ٣ بِسَمَارَانْج، جَاوَى الْوُسْطَى.','Aku Taufan, sekarang aku kelas empat di MIN 3 Semarang, Jawa Tengah.'],['عِنْدِي أَصْدِقَاءُ وَعِنْدَنَا آمَالٌ رَفِيعَةٌ. أَنَا أُرِيدُ أَنْ أَكُونَ شُرْطِيًّا.','Aku punya teman-teman dan kami punya cita-cita tinggi. Aku ingin menjadi polisi.'],['وَهَذَا صَدِيقِي، إِسْمُهُ حَكِيمٌ. هُوَ يُرِيدُ أَنْ يَكُونَ طَبِيبًا.','Ini temanku, namanya Hakim. Dia ingin menjadi dokter.'],['وَهَذِهِ صَدِيقَتِي، إِسْمُهَا فَاطِمَةُ، هِيَ تُرِيدُ أَنْ تَكُونَ مُمَرِّضَةً.','Ini temanku (pr), namanya Fatimah, dia ingin menjadi perawat.'],['يَا مَرْوَانُ، مَا أَمَلُكَ فِي الْمُسْتَقْبَلِ؟ فِي الْمُسْتَقْبَلِ أُرِيدُ أَنْ أَكُونَ مُدَرِّسًا.','Marwan, apa cita-citamu? Di masa depan aku ingin menjadi guru.'],['وَيَا حَسَنَةُ، مَا أَمَلُكِ فِي الْمُسْتَقْبَلِ؟ فِي الْمُسْتَقْبَلِ أُرِيدُ أَنْ أَكُونَ مُهَنْدِسَةً.','Hasanah, apa cita-citamu? Di masa depan aku ingin menjadi insinyur.'],['وَأَنْتَ يَا فَوْزِي! هَلْ تُرِيدُ أَنْ تَكُونَ شُرْطِيًّا فِي الْمُسْتَقْبَلِ؟ لَا، أُرِيدُ أَنْ أَكُونَ صَحَافِيًّا.','Fauzi, apakah kamu ingin menjadi polisi? Tidak, aku ingin menjadi jurnalis.'],['وَأَنْتِ يَا زَيْنَبُ! هَلْ تُرِيدِينَ أَنْ تَكُونِي تَاجِرَةً؟ نَعَمْ، أُرِيدُ أَنْ أَكُونَ تَاجِرَةً نَاجِحَةً فِي الْمُسْتَقْبَلِ.','Zainab, apakah kamu ingin menjadi pedagang? Ya, aku ingin menjadi pedagang yang sukses di masa depan.']];
const RQ=[
['r2','مَا مِهْنَةُ عَبْدِ الْحَمِيدِ؟','تَاجِرٌ',['طَبِيبٌ','جُنْدِيٌّ','مُبَلِّغٌ']],
['r2','أَيْنَ يَعْمَلُ عَبْدُ الْحَمِيدِ؟','فِي السُّوقِ',['فِي الْمُسْتَشْفَى','فِي بَنْكٍ','فِي الْمَدْرَسَةِ']],
['r2','مَا مِهْنَةُ سَلِيمَةَ؟','طَبِيبَةٌ',['مُمَرِّضَةٌ','خَيَّاطَةٌ','مُوَظَّفَةٌ']],
['r2','مَاذَا يَعْمَلُ فَوْزَانُ؟','يُحَافِظُ الْأَمْنَ',['يُرَتِّبُ الْمُرُورَ','يُخَيِّطُ الْمَلَابِسَ','يَزْرَعُ الرُّزَّ']],
['r2','مَا مِهْنَةُ لُقْمَانَ؟','شُرْطِيٌّ',['جُنْدِيٌّ','تَاجِرٌ','مُبَلِّغٌ']],
['r2','أَيْنَ تَعْمَلُ رَشِيدَةُ؟','فِي الْمُسْتَشْفَى',['فِي السُّوقِ','فِي بَنْكٍ','فِي الْمَدْرَسَةِ']],
['r2','مَنْ تُخَيِّطُ الْمَلَابِسَ؟','نَيْلَى',['رَشِيدَةُ','سَلِيمَةُ','حَمِيدَةُ']],
['r3','مَاذَا يُرِيدُ تَوْفَانُ أَنْ يَكُونَ؟','شُرْطِيًّا',['طَبِيبًا','مُدَرِّسًا','صَحَافِيًّا']],
['r3','مَنْ يُرِيدُ أَنْ يَكُونَ طَبِيبًا؟','حَكِيمٌ',['تَوْفَانُ','مَرْوَانُ','فَوْزِي']],
['r3','مَاذَا تُرِيدُ فَاطِمَةُ أَنْ تَكُونَ؟','مُمَرِّضَةً',['مُهَنْدِسَةً','تَاجِرَةً','طَبِيبَةً']],
['r3','مَنْ تُرِيدُ أَنْ تَكُونَ تَاجِرَةً نَاجِحَةً؟','زَيْنَبُ',['فَاطِمَةُ','حَسَنَةُ','شَرِيفَةُ']],
['r3','مَاذَا تُرِيدُ حَسَنَةُ أَنْ تَكُونَ؟','مُهَنْدِسَةً',['مُدَرِّسَةً','صَحَافِيَّةً','تَاجِرَةً']]];
const RT=[
['r2','السَّيِّدَةُ سَلِيمَةُ طَبِيبَةٌ',1,'Benar: هِيَ طَبِيبَةٌ، تَعْمَلُ فِي الْمُسْتَشْفَى.'],
['r2','السَّيِّدُ عَبْدُ الْحَمِيدِ يَعْمَلُ فِي الْمُسْتَشْفَى',0,'Salah: Abdul Hamid pedagang, bekerja فِي السُّوقِ (di pasar).'],
['r2','نَيْلَى خَيَّاطَةٌ',1,'Benar: هِيَ خَيَّاطَةٌ، تُخَيِّطُ الْمَلَابِسَ.'],
['r2','لُقْمَانُ جُنْدِيٌّ',0,'Salah: Luqman شُرْطِيٌّ (polisi); yang jundi adalah Fauzan.'],
['r2','رَشِيدَةُ مُمَرِّضَةٌ',1,'Benar: هِيَ مُمَرِّضَةٌ.'],
['r3','مَرْوَانُ يُرِيدُ أَنْ يَكُونَ مُدَرِّسًا',1,'Benar: Marwan ingin menjadi guru.'],
['r3','حَكِيمٌ يُرِيدُ أَنْ يَكُونَ شُرْطِيًّا',0,'Salah: Hakim ingin menjadi dokter (طَبِيبًا); yang ingin menjadi polisi adalah Taufan.'],
['r3','زَيْنَبُ تُرِيدُ أَنْ تَكُونَ تَاجِرَةً',1,'Benar: Zainab ingin menjadi pedagang yang sukses.'],
['r3','فَوْزِي يُرِيدُ أَنْ يَكُونَ شُرْطِيًّا',0,'Salah: Fauzi ingin menjadi jurnalis (صَحَافِيًّا).'],
['r3','حَسَنَةُ تُرِيدُ أَنْ تَكُونَ طَبِيبَةً',0,'Salah: Hasanah ingin menjadi insinyur (مُهَنْدِسَةً).']];
const bacaan=ps=>`<details class="hd"><summary>📖 Lihat bacaan</summary>${(ps=='r2'?R2:R3).map(s=>pat(s[0],s[1])).join('')}</details>`;

/* ---------- PEMBUAT SOAL BARU ---------- */
const sameG=i=>ALL.filter(j=>j!==i&&D[j].g===D[i].g);
const GEN={
pc(i){const d=D[i],m=d.g=='m';return{t:'pc',w:i,pc:d.e,oa:1,q:AB(m?'مَا مِهْنَةُ هَذَا الرَّجُلِ؟':'مَا مِهْنَةُ هَذِهِ السَّيِّدَةِ؟')+'<br><small>Lihat gambar, lalu pilih jawaban yang tepat.</small>',a:d.ar,o:mc(d.ar,sameG(i).map(j=>D[j].ar)),ex:`${d.e} ${d.ar} = ${d.id}.`}},
pa(i){const av=AV[i];if(!av)return GEN.pc(i);const d=D[i],g=d.g,f=k=>`${fl(AV[k][0],g)} ${AV[k][1]}`,a=f(i),ks=Object.keys(AV).filter(k=>AV[k][0]!=av[0]);return{t:'pa',w:i,pc:d.e,oa:1,q:AB(g=='m'?'مَاذَا يَعْمَلُ هَذَا الرَّجُلُ؟':'مَاذَا تَعْمَلُ هَذِهِ السَّيِّدَةُ؟'),a,o:mc(a,ks.map(f)),ex:`${a} = ${av[2]}.`}},
ti(i){const d=D[i];return{t:'ti',w:i,ty:1,acc:[nrm(d.id),nrm(base(d.id))],q:`Tulis artinya dalam bahasa Indonesia: ${AB(d.ar)}`,sp:strip(d.ar),a:d.id,ex:`${d.ar} = ${d.id}`}},
xv(){const k=pickW(XV.length,j=>'k:x:'+j),x=XV[k];if(Math.random()<.5)return{t:'xv',k:'x:'+k,sp:strip(x[0]),q:`Apa arti ${AB(x[0])} ?`,a:x[1],o:mc(x[1],XV.map(y=>y[1])),ex:`${x[0]} = ${x[1]}`};return{t:'xv',k:'x:'+k,oa:1,q:`Bahasa Arab dari “${x[1]}” adalah…`,a:x[0],o:mc(x[0],XV.map(y=>y[0])),ex:`${x[1]} = ${x[0]}`}},
dp(){const k=pickW(PD.length,j=>'k:dp:'+j),x=PD[k],all=PN.concat(PD);if(Math.random()<.5)return{t:'dp',k:'dp:'+k,sp:strip(x[0]),q:`Apa arti dhamir ${AB(x[0])} ?`,a:x[1],o:mc(x[1],all.map(y=>y[1])),ex:`${x[0]} = ${x[1]}`};return{t:'dp',k:'dp:'+k,oa:1,q:`Dhamir untuk “${x[1]}” adalah…`,a:x[0],o:mc(x[0],all.map(y=>y[0])),ex:`${x[1]} = ${x[0]}`}},
dm(i){const d=D[i],g=d.g,far=Math.random()<.5,a=far?(g=='m'?'ذَلِكَ':'تِلْكَ'):(g=='m'?'هَذَا':'هَذِهِ');return{t:'dm',w:i,oa:1,q:`${d.n} ada ${far?'jauh':'dekat'} darimu (${LK(g)}). Lengkapi: ${AB(`____ ${d.n}، ${PR(g)} ${d.ar}`)}`,a,o:mc(a,DM),ex:'هَذَا / هَذِهِ = ini (dekat). ذَلِكَ / تِلْكَ = itu (jauh). lk: هَذَا, ذَلِكَ · pr: هَذِهِ, تِلْكَ.'}},
cn(tag){const L=CN.map((x,j)=>j).filter(j=>CN[j][4]==tag),j=L[pickW(L.length,z=>'k:cn:'+L[z])],x=CN[j];return{t:tag=='mf'?'cm':'cs',k:'cn:'+j,oa:x[5]?1:0,q:x[0],a:x[1],o:mc(x[1],x[2]),ex:x[3]}},
mp(i){const d=D[i],g=d.g,r=rnd(3);if(r==2)return{t:'mp',w:i,oa:1,q:`Profesiku adalah ${base(d.id)}. Lengkapi: ${AB(`____ ${d.ar}`)}`,a:'مِهْنَتِي',o:sh(['مِهْنَتُهُ','مِهْنَتُهَا','مِهْنَتِي','مِهْنَتُكَ']),ex:'ـي = -ku → مِهْنَتِي = profesiku.'};const a=g=='m'?'مِهْنَتُهُ':'مِهْنَتُهَا';return{t:'mp',w:i,oa:1,q:`${g=='m'?'Ayahku':'Ibuku'} ${base(d.id)}. Lengkapi: ${AB(`${g=='m'?'هَذَا أَبِي':'هَذِهِ أُمِّي'}، ____ ${d.ar}`)}`,a,o:sh(['مِهْنَتُهُ','مِهْنَتُهَا','مِهْنَتِي','مِهْنَتُكَ']),ex:`${g=='m'?'ـهُ (-nya lk)':'ـهَا (-nya pr)'}: ${a} = profesinya.`}},
wh(){const k=pickW(WH.length,j=>'k:wh:'+j),x=WH[k];return{t:'wh',k:'wh:'+k,oa:1,q:`Pilih kata tanya yang tepat: ${AB(x[0])}`,a:x[1],o:mc(x[1],WQ),ex:x[2]}},
dl(i){const d=D[i],g=d.g,b=base(d.id);if(Math.random()<.5){const as=g=='m'?'إِحْسَانُ':'شَرِيفَةُ',a='أُرِيدُ أَنْ أَكُونَ '+d.ac;return{t:'dl',w:i,oa:1,q:`Lengkapi percakapan! Kamu ingin menjadi ${b}.<br>${AB(`${as}: مَا أَمَلُ${g=='m'?'كَ':'كِ'} فِي الْمُسْتَقْبَلِ؟`)}<br>${AB('أَنْتَ: ____')}`,a,o:mc(a,['أُرِيدُ أَنْ أَكُونَ '+d.ar,PR(g)+' '+d.ar,'أَنَا '+d.ar]),ex:`Setelah أَنْ أَكُونَ, profesi bertanwin fathah: ${d.ac}.`}}
const o2=sameG(i).map(j=>D[j].ar),a=PR(g)+' '+d.ar;return{t:'dl',w:i,oa:1,q:`Lengkapi percakapan! ${g=='m'?'Ayah':'Ibu'} Ihsan adalah ${b}.<br>${AB(`تَوْفِيقٌ: مَا مِهْنَةُ ${g=='m'?'أَبِيكَ':'أُمِّكَ'}؟`)}<br>${AB('إِحْسَانُ: ____')}`,a,o:mc(a,[PR(g=='m'?'f':'m')+' '+d.ar,'أَنَا '+d.ar,PR(g)+' '+o2[rnd(o2.length)]]),ex:`${g=='m'?'أَبِي':'أُمِّي'} → ${PR(g)} (${g=='m'?'laki-laki':'perempuan'}): ${a}.`}},
fm(){const k=pickW(FP.length,j=>'k:fm:'+j),x=FP[k],toF=Math.random()<.6,a=toF?x[1]:x[0],q=toF?x[0]:x[1];return{t:'fm',k:'fm:'+k,oa:1,sp:strip(q),q:`Bentuk ${toF?"perempuan (mu'annats)":'laki-laki (mudzakkar)'} dari ${AB(q)} (${x[2]}) adalah…`,a,o:mc(a,FP.map(y=>toF?y[1]:y[0])),ex:`${x[0]} (lk) ↔ ${x[1]} (pr). Bentuk perempuan umumnya ditambah ة.`}},
hr(){const k=pickW(HW.length,j=>'k:hr:'+j),x=HW[k],L=[...strip(x[0])],a=L.join('');const s=new Set();let g=0;while(s.size<3&&g++<60){const b=[...L],p=rnd(b.length),q=rnd(b.length);[b[p],b[q]]=[b[q],b[p]];const t=b.join('');if(t!==a)s.add(t)}return{t:'hr',k:'hr:'+k,oa:1,q:`Huruf ${AB(L.join(' - '))} jika disambung menjadi… <small>(${x[1]})</small>`,a,o:mc(a,[...s]),ex:`${L.join(' + ')} = ${x[0]} (${x[1]}).`}},
hs(){const k=pickW(HW.length,j=>'k:hr:'+j),x=HW[k],L=[...strip(x[0])];return{t:'hs',k:'hr:'+k,tk:L,a:L.join(' '),disp:strip(x[0]),q:`Susun huruf menjadi kata untuk “${x[1]}”.`,ex:`${L.join(' + ')} = ${x[0]} (${x[1]}).`}},
rd(){const k=pickW(RQ.length,j=>'k:rd:'+j),x=RQ[k];return{t:'rd',k:'rd:'+k,oa:1,pass:x[0],q:AB(x[1]),a:x[2],o:mc(x[2],x[3]),ex:`${x[1]} → ${x[2]} (lihat bacaan).`}},
tf(){const k=pickW(RT.length,j=>'k:tf:'+j),x=RT[k];return{t:'tf',k:'tf:'+k,pass:x[0],q:`Sesuai bacaan, apakah kalimat ini benar atau salah?<br>${AB(x[1])}`,a:x[2]?'Benar ✓':'Salah ✗',o:['Benar ✓','Salah ✗'],ex:x[3]}},
ts(i){const d=D[i],g=d.g,b=base(d.id),nm=PERS[i][0].replace(/^(Pak|Bu|Kak|Dokter|Suster|Ustadzah|Ustadz|Kapten|Bunda)\s+/,''),p=PR(g),dm=g=='m'?'هَذَا':'هَذِهِ';let r=rnd(5),T,id;if(r==3&&!d.pa)r=2;
if(r==0){id=`Ini ${g=='m'?'ayahku':'ibuku'}, dia seorang ${b}.`;T=[dm,g=='m'?'أَبِي،':'أُمِّي،',p,d.ar]}
else if(r==1){id=`Ini ${nm} (${LK(g)}), dia seorang ${b}.`;T=[dm,d.n+'،',p,d.ar]}
else if(r==2){id=`Aku ingin menjadi ${b}.`;T=['أُرِيدُ','أَنْ','أَكُونَ',d.ac]}
else if(r==3){id=`Dia (${LK(g)}) bekerja di ${d.pl.toLowerCase()}.`;T=[p,g=='m'?'يَعْمَلُ':'تَعْمَلُ','فِي',d.pa]}
else{id=`Apakah dia (${LK(g)}) seorang ${b}?`;T=['هَلْ',p,d.ar+'؟']}
const a=T.join(' ');return{t:'ts',w:i,tk:T,a,disp:a,q:`Susun menjadi kalimat Arab: “${id}”`,ex:`${a} = ${id}`}},
tr2(){const k=pickW(SENT.length,j=>'k:s:'+j),x=SENT[k];return{t:'tr2',k:'s:'+k,sp:strip(x[0]),q:`Apa arti kalimat ini? ${AB(x[0])}`,a:x[1],o:mc(x[1],SENT.map(y=>y[1])),ex:`${x[0]} = ${x[1]}`}},
ts2(){const k=pickW(SENT.length,j=>'k:s:'+j),x=SENT[k],T=x[0].split(' ');return{t:'ts2',k:'s:'+k,tk:T,a:T.join(' '),disp:x[0],q:`Susun menjadi kalimat Arab: “${x[1]}”`,ex:`${x[0]} = ${x[1]}`}}};
const EXT=['v','kt','mf','mt','pj','ct','tr','sk'];
function make(name,arg){if(EXT.includes(name)){const i=Array.isArray(arg)?pickD(arg):rnd(D.length);const q=gen(name,D[i]);return q}const f=GEN[name];return Array.isArray(arg)?f(pickD(arg)):f(arg)}
function build(pool,n){const out=[],seen=new Set(),tot=pool.reduce((a,p)=>a+p[2],0);let g=0;
while(out.length<n&&g++<n*40){let x=Math.random()*tot,p=pool[0];for(const e of pool){if((x-=e[2])<=0){p=e;break}}
let q;try{q=make(p[0],p[1])}catch(e){continue}if(!q)continue;const key=q.q+'|'+q.a;if(seen.has(key))continue;
if(!q.tk&&!q.ty&&(!q.o||q.o.length<2||!q.o.includes(q.a)))continue;seen.add(key);out.push(q)}return out}

/* ---------- STASIUN ---------- */
const GRH=k=>GR[k]||'',ACT=[0,3,4,5,10,11].map(k=>[`${fl(AV[k][0],D[k].g)} ${AV[k][1]}`,AV[k][2]]);
const DLG=[['تَوْفِيقٌ: السَّلَامُ عَلَيْكُمْ','Taufiq: Assalamu’alaikum.'],['إِحْسَانُ: وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ','Ihsan: Wa’alaikumussalam warahmatullah.'],['تَوْفِيقٌ: أَيْنَ أُسْرَتُكَ؟','Di mana keluargamu?'],['إِحْسَانُ: أَبِي فِي مَطَارٍ','Ayahku di bandara.'],['تَوْفِيقٌ: مَا مِهْنَةُ أَبِيكَ؟','Apa profesi ayahmu?'],['إِحْسَانُ: هُوَ طَيَّارٌ','Dia pilot.'],['تَوْفِيقٌ: وَأَيْنَ أُمُّكَ؟','Dan di mana ibumu?'],['إِحْسَانُ: هِيَ فِي الْمَطْبَخِ، هِيَ رَبَّةُ الْبَيْتِ','Dia di dapur, dia ibu rumah tangga.'],['شَرِيفَةُ: مَا أَمَلُكِ فِي الْمُسْتَقْبَلِ؟','Apa cita-citamu (pr) di masa depan?'],['حَنِيفَةُ: أُرِيدُ أَنْ أَكُونَ طَبَّاخَةً فِي الْمُسْتَقْبَلِ، إِنْ شَاءَ اللَّهُ','Aku ingin menjadi koki di masa depan, insya Allah.'],['حَنِيفَةُ: وَأَنْتِ يَا شَرِيفَةُ، مَا أَمَلُكِ؟','Dan kamu, Syarifah, apa cita-citamu?'],['شَرِيفَةُ: أُرِيدُ أَنْ أَكُونَ مُدَرِّسَةً','Aku ingin menjadi guru.']];
const ST=[
{id:1,ic:'🧑‍🌾',t:'Profesi Bab 2',sub:'Al-Mihnah: profesi, tempat & kegiatan',tp:'TP 1',keys:()=>IA.map(i=>'w:'+i),pool:[['v',IA,3],['pc',IA,3],['pa',AVK,2],['ti',IA,2],['kt',IA,1]],
 mat:()=>vm(IA,'Nama profesi Bab 2 (ketuk untuk mendengar)')+pm(KWP,'Tempat kerja')+pm(ACT,'Kegiatan (laki-laki يَـ / perempuan تَـ)')+pm([['مَاذَا يَعْمَلُ؟','apa yang dia (lk) kerjakan?'],['أَيْنَ يَعْمَلُ؟','di mana dia (lk) bekerja?']],'Pertanyaan')},
{id:2,ic:'🌟',t:'Profesi & Cita-cita Bab 3',sub:'Amali: profesi baru, أُرِيدُ أَنْ أَكُونَ',tp:'TP 1',keys:()=>IB.map(i=>'w:'+i).concat(['t:xv']),pool:[['v',IB,2],['pc',IB,2],['ct',IB,3],['xv',null,3],['fm',null,2],['ti',IB,1]],
 mat:()=>vm(IB,'Profesi baru Bab 3')+pm(XV,'Kosakata cita-cita & identitas')+pat('أُرِيدُ أَنْ أَكُونَ طَبِيبًا','Aku ingin menjadi dokter. Setelah أَنْ أَكُونَ, profesi bertanwin fathah (ـًا / ـةً).')+`<div class="gt">Bentuk laki-laki → perempuan (tambah ة)</div><table class="tb">${FP.slice(0,6).map(x=>`<tr><td class="ar">${x[0]}</td><td class="ar">${x[1]}</td><td>${x[2]}</td></tr>`).join('')}</table>`},
{id:3,ic:'👤',t:'Dhamir Munfasil',sub:'هُوَ، هِيَ، أَنْتَ، أَنْتِ، أَنَا، نَحْنُ + kata tunjuk',tp:'TP 2',keys:()=>['t:mf','t:dp','t:dm','t:cm'],pool:[['mf',ALL,4],['dp',null,2],['dm',ALL,2],['cn','mf',2]],
 mat:()=>GRH('mf')+pm(PD,'Dual & jamak (total 14 dhamir)')+`<div class="gt">Kata tunjuk</div><table class="tb"><tr><td class="ar">هَذَا / هَذِهِ</td><td>ini (lk / pr)</td></tr><tr><td class="ar">ذَلِكَ / تِلْكَ</td><td>itu (lk / pr)</td></tr></table>`},
{id:4,ic:'🔗',t:'Dhamir Muttasil',sub:'Akhiran ـهُ ـهَا ـي ـكَ ـكِ (milik)',tp:'TP 2',keys:()=>['t:mt','t:mp','t:cs'],pool:[['mt',null,4],['mp',ALL,3],['cn','mt',2]],
 mat:()=>GRH('mt')+pm([['هَذَا أَبِي، مِهْنَتُهُ مُدَرِّسٌ','Ini ayahku, profesinya guru.'],['هَذِهِ أُمِّي، مِهْنَتُهَا طَبِيبَةٌ','Ini ibuku, profesinya dokter.'],['مِهْنَتِي تِلْمِيذٌ','Profesiku siswa.'],['مَا مِهْنَتُكَ؟','Apa profesimu (lk)?'],['مَا مِهْنَتُكِ؟','Apa profesimu (pr)?'],['كِتَابِي','bukuku'],['أَخُوهُ','saudaranya (lk)']],'Contoh')},
{id:5,ic:'💬',t:'Tanya-Jawab & Percakapan',sub:'مَنْ، مَا، أَيْنَ، هَلْ، مَاذَا + hiwar',tp:'TP 3',keys:()=>['t:wh','t:dl','t:pj','t:ct'],pool:[['wh',null,3],['dl',ALL,3],['pj',ALL,2],['ct',ALL,2]],
 mat:()=>GRH('pj')+pm(DLG,'Percakapan dari buku (ketuk untuk mendengar)')},
{id:6,ic:'📖',t:'Membaca & Memahami',sub:'Teks Bab 2 dan Bab 3 + benar/salah',tp:'TP 3',keys:()=>['t:rd','t:tf'],pool:[['rd',null,3],['tf',null,3]],
 mat:()=>pm(R2,'Teks Bab 2 · الْمِهْنَةُ')+pm(R3,'Teks Bab 3 · أَمَلِي فِي الْمُسْتَقْبَلِ')},
{id:7,ic:'✍️',t:'Menulis: Susun & Terjemah',sub:'Susun kata/huruf, bentuk mu\'annats, terjemah',tp:'TP 4',keys:()=>['t:ts','t:hs','t:hr','t:fm','t:sk','t:tr2','t:ts2'],pool:[['ts',ALL,3],['hs',null,2],['hr',null,2],['fm',null,2],['sk',ALL,2],['tr2',null,1],['ts2',null,1]],
 mat:()=>GRH('sk')+`<div class="gt">Huruf Arab bersambung</div>`+pat('م + د + ر + س + ة = مَدْرَسَة','Huruf-huruf disambung menjadi satu kata (ا، د، ر tidak menyambung ke huruf sesudahnya).')+`<div class="gt">Menerjemah</div>`+pm(SENT.slice(0,6),'Contoh kalimat')}];
const TSM={v:1,pc:1,pa:1,ti:1,kt:1,xv:2,ct:2,fm:2,mf:3,dp:3,dm:3,cm:3,mt:4,mp:4,cs:4,pj:5,wh:5,dl:5,rd:6,tf:6,sk:7,ts:7,hs:7,hr:7,tr:7,tr2:7,ts2:7};
const stPct=s=>{const K=s.keys();return Math.round(K.reduce((a,k)=>a+lv(k),0)/K.length/3*100)};
const stOf=id=>SS.st[id]||(SS.st[id]={pr:0,best:0,done:0,gt:0});
const doneN=()=>ST.filter(s=>stOf(s.id).done).length,nextSt=()=>{const s=ST.find(s=>!stOf(s.id).done);return s?s.id:0};
const unlocked=id=>id==1||stOf(id-1).done;

/* ---------- PENJALAN SOAL ---------- */
const MD=()=>[$('#modal'),$('#card')],closeM=()=>{$('#modal').style.display='none';open=false;mode=null};
const wl=L=>{const seen=new Set(),h=[];L.forEach(q=>{if(!q.ex||seen.has(q.ex)||h.length>=6)return;seen.add(q.ex);h.push(`<div class="ex">${q.ex}${q.sp?` <button class="opt spk" data-sp="${q.sp}" aria-label="Dengarkan">🔊</button>`:''}</div>`)});return h.length?`<div class="gt">📝 Ingat lagi yang tadi belum tepat</div>${h.join('')}`:''};
function run(o){const [m,c]=MD(),Q=o.qs,N=Q.length,items=[];let i=0,ok=0;open=true;mode='sas';m.style.display='flex';
function show(){const q=Q[i];let locked=false,tried=false,rec=false;c.scrollTop=0;
const hint=o.gate?'<button id="hn" style="display:none"></button>':'<button class="opt spk" id="hn" style="margin-top:4px">💡 Petunjuk (gratis)</button>';
c.innerHTML=`<div class="dots">${Q.map((_,k)=>`<i class="${k<i?'on':''}"></i>`).join('')}</div><h2>${o.title}</h2>${q.sec?`<div class="stp">${q.sec}</div>`:''}<div class="who">Soal ${i+1} dari ${N}${q.sp?'<button class="opt spk" id="sp" aria-label="Dengarkan">🔊 Dengarkan</button>':''}</div>${q.pc?`<div class="pic" aria-hidden="true">${q.pc}</div>`:''}${q.pass?bacaan(q.pass):''}<div class="q">${q.t=='sk'?'🧩 Susun kartu kata menjadi kalimat yang benar.':q.q}</div>${q.tk?'<div id="tp"></div>':q.ty?'<div class="ty"><input id="tyi" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Ketik artinya…" aria-label="Ketik jawabanmu"><button class="opt go" id="tyb">Periksa</button></div>':q.o.map((x,k)=>`<button class="opt ${q.oa?'ar':''}" data-i="${k}">${x}</button>`).join('')}${hint}<div id="fb" role="status" aria-live="polite"></div>`;
bindSp(c);if(q.sp)$('#sp').onclick=()=>say(q.sp);
if(!o.gate&&!q.tk)$('#hn').onclick=e=>{if(locked)return;q.hn=true;if(q.ty){const t=base(q.a);$('#fb').innerHTML=`<span style="color:#7a5a00">💡 Huruf pertama: <b>${t[0]}</b> · ${t.length} huruf</span>`;e.currentTarget.disabled=true;return}const w=[...c.querySelectorAll('.opt[data-i]:not(:disabled)')].filter(x=>q.o[+x.dataset.i]!==q.a);if(!w.length)return;const x=w[rnd(w.length)];x.disabled=true;x.style.opacity=.3;e.currentTarget.disabled=true};
const next=()=>{i++;i<N?show():o.end({ok,n:N,items,wrong:items.filter(x=>!x.first).map(x=>x.q)},c)};
const ans=(right,b)=>{if(locked)return;
if(!right&&!o.gate&&!tried&&!q.tk){tried=true;if(!rec){mrec(q,false);rec=true}if(b){b.disabled=true;b.classList.add('no')}snd(180,.25,'sawtooth');$('#fb').innerHTML='<span style="color:#8a5200">🦉 Hampir! Coba sekali lagi.</span>';return}
locked=true;c.querySelectorAll('.opt[data-i]').forEach(x=>{x.disabled=true;if(q.o[+x.dataset.i]===q.a)x.classList.add('ok')});
const ti=$('#tyi');if(ti)ti.disabled=true;const tb=$('#tyb');if(tb)tb.disabled=true;$('#hn').disabled=true;
if(!rec){mrec(q,right&&!q.hn);rec=true}const first=right&&!tried&&!q.hn;if(first)ok++;items.push({q,first});
if(o.quiet){next();return}
if(!right&&b)b.classList.add('no');right?snd(784,.15,'triangle'):snd(180,.25,'sawtooth');
const sh2=q.tk?AB(q.disp||q.a):q.ty?`<b>${q.a}</b>`:'';
$('#fb').innerHTML=(right?`<span style="color:#14744b"><span class="ar">${['مَا شَاءَ اللَّهُ','أَحْسَنْتَ','بَارَكَ اللَّهُ فِيكَ'][rnd(3)]}</span> ${first?'Tepat!':'Betul!'}</span>`:`<span style="color:#b8352b">🦉 Belum tepat.${sh2?' Jawaban: '+sh2:' Jawaban benar ditandai hijau.'}</span>`)+(q.ex?`<div class="ex">💡 ${q.ex}</div>`:'')+`<button class="opt go" id="nx">${i<N-1?'Lanjut ▶':'Lihat hasil'}</button>`;
$('#nx').onclick=next;$('#nx').scrollIntoView({block:'nearest'})};
const ff=()=>{tried=true;if(!rec){mrec(q,false);rec=true}snd(180,.25,'sawtooth')};
if(q.tk)tapUI(c,q,ans,o.gate?null:ff);
else if(q.ty){const ti=$('#tyi'),go=()=>{if(locked)return;const v=nrm(ti.value);if(!v){ti.focus();return}ans(q.acc.includes(v),null)};$('#tyb').onclick=go;ti.onkeydown=e=>{if(e.key=='Enter')go()}}
else c.querySelectorAll('.opt[data-i]').forEach(b=>b.onclick=()=>ans(q.o[+b.dataset.i]===q.a,b))}
show()}

/* ---------- LAYAR: HUB, STASIUN, PETA, SIMULASI ---------- */
function badge(){const e=$('#sasn');if(e)e.textContent=nextSt()||''}
function hub(){const [m,c]=MD();open=true;mode='sas';m.style.display='flex';c.scrollTop=0;const nx=nextSt(),dn=doneN();
c.innerHTML=`<h2>🧭 Jalur Menuju SAS</h2><div class="who">Tujuh stasiun, lalu Simulasi SAS</div><div class="bar"><i style="width:${Math.round(dn/7*100)}%"></i></div><small>${dn} dari 7 stasiun lulus</small>`+ST.map(s=>{const r=stOf(s.id),lk=!unlocked(s.id);return `<button class="opt ${!r.done&&s.id==nx?'go':''}" data-s="${s.id}" ${lk?'disabled':''}>${lk?'🔒':r.done?'✅':'▶'} ${s.ic} Stasiun ${s.id}: ${s.t}<br><small>${s.sub} · ${s.tp}${r.best?` · gerbang terbaik ${r.best}/10`:''}</small></button>`}).join('')+`<button class="opt ${dn==7?'go':''}" id="sim" ${dn<7?'disabled':''}>${dn<7?'🔒':'🎓'} Simulasi SAS (35 soal)<br><small>${dn<7?'Terbuka setelah 7 stasiun lulus':`Bagian A, B, C seperti SAS · terbaik ${SS.sim.best||0}%`}</small></button><button class="opt" id="pt">🗺️ Peta Penguasaan</button><button class="opt" id="x">Tutup</button>`;
c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>station(+b.dataset.s));$('#sim').onclick=simIntro;$('#pt').onclick=peta;$('#x').onclick=closeM}
function station(id){const s=ST[id-1],r=stOf(id),[m,c]=MD(),p=stPct(s);c.scrollTop=0;
c.innerHTML=`<div class="stp">Stasiun ${id} dari 7 · ${s.tp}</div><h2>${s.ic} ${s.t}</h2><div class="who">${s.sub}</div><div class="bar"><i style="width:${p}%"></i></div><small>Penguasaan ${p}% · ${r.done?'✅ sudah lulus':'belum lulus'}${r.best?` · gerbang terbaik ${r.best}/10`:''}</small><button class="opt go" id="b1">📖 1. Materi</button><button class="opt" id="b2">✏️ 2. Latihan (8 soal, boleh diulang)</button><button class="opt" id="b3" ${r.pr?'':'disabled'}>🚪 3. Gerbang (10 soal, lulus jika benar ≥ 8)</button>${r.pr?'':'<div class="fc">Gerbang terbuka setelah kamu menyelesaikan satu latihan.</div>'}<button class="opt" id="bk">← Kembali ke Jalur</button>`;
$('#b1').onclick=()=>materi(id);$('#b2').onclick=()=>practice(id);$('#b3').onclick=()=>gate(id);$('#bk').onclick=hub}
function materi(id){const s=ST[id-1],[m,c]=MD();stOf(id).seen=1;sv();c.scrollTop=0;c.innerHTML=`<div class="stp">Stasiun ${id} · Materi</div><h2>${s.ic} ${s.t}</h2><div class="fc">🎤 Ketuk tiap kartu untuk mendengar, lalu ucapkan keras-keras 2 kali.</div>${s.mat()}<button class="opt go" id="b2">✏️ Lanjut ke Latihan</button><button class="opt" id="bk">← Kembali</button>`;bindSp(c);$('#b2').onclick=()=>practice(id);$('#bk').onclick=()=>station(id)}
function practice(id){const s=ST[id-1];run({title:`${s.ic} Latihan · ${s.t}`,qs:build(s.pool,8),gate:false,end:(res,c)=>{const r=stOf(id);r.pr=(r.pr||0)+1;sv();c.innerHTML=`<h2>Latihan selesai</h2><div class="q">${res.ok} dari ${res.n} benar pada percobaan pertama</div>${wl(res.wrong)}<button class="opt go" id="b3">🚪 Coba Gerbang</button><button class="opt" id="b2">✏️ Latihan lagi</button><button class="opt" id="bm">📖 Baca materi lagi</button><button class="opt" id="bk">← Stasiun</button>`;bindSp(c);$('#b3').onclick=()=>gate(id);$('#b2').onclick=()=>practice(id);$('#bm').onclick=()=>materi(id);$('#bk').onclick=()=>station(id)}})}
function gate(id){const s=ST[id-1];run({title:`🚪 Gerbang · ${s.t}`,qs:build(s.pool,10),gate:true,end:(res,c)=>{const r=stOf(id),pass=res.ok>=8;r.gt=(r.gt||0)+1;r.best=Math.max(r.best||0,res.ok);let bonus=0;if(pass&&!r.done){r.done=1;bonus=40;coins+=40;hud()}sv();badge();
c.innerHTML=`<h2>${pass?'🎉 Stasiun lulus!':'Belum lulus, sedikit lagi'}</h2><div class="q">${res.ok} dari 10 benar${bonus?` · +${bonus} 🪙`:''}</div><div class="fc">${pass?(id<7?'Stasiun berikutnya sudah terbuka.':'Semua stasiun lulus! Simulasi SAS terbuka.'):'Lulus jika benar minimal 8. Baca ulang materi, latihan lagi, lalu coba gerbang.'}</div>${wl(res.wrong)}${pass?`<button class="opt go" id="nx">${id<7?`▶ Stasiun ${id+1}`:'🎓 Ke Simulasi SAS'}</button>`:`<button class="opt go" id="b2">✏️ Latihan lagi</button><button class="opt" id="bm">📖 Baca materi lagi</button>`}<button class="opt" id="bk">← Jalur</button>`;bindSp(c);
if(pass)$('#nx').onclick=()=>id<7?station(id+1):simIntro();else{$('#b2').onclick=()=>practice(id);$('#bm').onclick=()=>materi(id)}$('#bk').onclick=hub;if(pass)try{confetti()}catch(e){}}})}
function peta(){const [m,c]=MD(),L=ALL.map(i=>lv('w:'+i)),good=L.filter(x=>x>=2).length,col=['#e5e7eb','#fde68a','#bbf7d0','#34d399'];c.scrollTop=0;
const TY=[['v','Kosakata'],['pc','Soal bergambar'],['kt','Tempat & kegiatan'],['xv','Kosakata tambahan'],['mf','Dhamir munfasil'],['dp','Dual & jamak'],['mt','Dhamir muttasil'],['mp','Muttasil dalam kalimat'],['pj','Tanya-jawab'],['wh','Kata tanya'],['dl','Dialog'],['ct','Cita-cita'],['rd','Bacaan'],['tf','Benar/salah'],['ts','Terjemah ke Arab'],['hs','Susun huruf'],['hr','Sambung huruf'],['fm',"Bentuk mu'annats"],['sk','Susun kalimat']];
c.innerHTML=`<h2>🗺️ Peta Penguasaan</h2><div class="fc">Warna menunjukkan berapa kali berturut-turut kamu menjawab benar: abu-abu = belum, kuning = 1 kali, hijau muda = 2 kali, hijau tua = 3 kali (dikuasai).</div><div class="q">${good} dari ${D.length} profesi sudah kuat (≥ 2 kali benar)</div><div class="ar" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">${ALL.map(i=>`<button class="opt" data-sp="${strip(D[i].ar)}" style="background:${col[L[i]]};width:auto;padding:6px 10px;margin:0;color:#1d2b53" title="${D[i].id}">${D[i].ar}</button>`).join('')}</div><div class="gt">Per jenis soal</div>${TY.map(t=>{const k='t:'+t[0],x=SS.M[k],p=Math.round(lv(k)/3*100);return `<div style="margin:6px 0"><small>${t[1]} · ${x?`${x.ok}/${x.n} benar`:'belum dicoba'}</small><div class="bar"><i style="width:${p}%"></i></div></div>`}).join('')}<button class="opt go" id="wk">🎯 Latihan dari yang masih lemah (10 soal)</button><button class="opt" id="bk">← Kembali ke Jalur</button>`;bindSp(c);$('#wk').onclick=weakRun;$('#bk').onclick=hub}
function weakRun(){const TL=['v','pc','pa','ti','kt','mf','dp','mt','mp','wh','dl','ct','ts','hs','hr','fm','tr2','sk'];run({title:'🎯 Latihan Penguat',qs:build(TL.map(t=>[t,ALL,3.2-lv('t:'+t)+.2]),10),gate:false,end:(res,c)=>{c.innerHTML=`<h2>Latihan selesai</h2><div class="q">${res.ok} dari ${res.n} benar pada percobaan pertama</div>${wl(res.wrong)}<button class="opt go" id="pt">🗺️ Lihat Peta</button><button class="opt" id="wk">🎯 Latihan lagi</button><button class="opt" id="bk">← Jalur</button>`;bindSp(c);$('#pt').onclick=peta;$('#wk').onclick=weakRun;$('#bk').onclick=hub}})}
function simQs(){const A=[].concat(build([['pc',ALL,1]],6),build([['pa',AVK,1]],3),build([['v',ALL,1]],3),build([['mf',ALL,1]],2),build([['mt',null,1]],2),build([['wh',null,1]],2),build([['dl',ALL,1]],2)),B=[].concat(build([['ti',ALL,1]],2),build([['fm',null,1]],2),build([['hs',null,1]],2),build([['mp',ALL,1]],2),build([['kt',ALL,1]],1),build([['dp',null,1]],1)),C=[].concat(build([['ts',ALL,1]],1),build([['tr2',null,1]],1),build([['sk',ALL,1]],1),build([['dl',ALL,1]],1),build([['mt',null,1]],1));
A.forEach(q=>{q.part='A';q.sec='Bagian A · Pilihan ganda'});B.forEach(q=>{q.part='B';q.sec='Bagian B · Isian'});C.forEach(q=>{q.part='C';q.sec='Bagian C · Uraian'});return A.concat(B,C)}
function simIntro(){const [m,c]=MD();open=true;mode='sas';m.style.display='flex';c.scrollTop=0;c.innerHTML=`<h2>🎓 Simulasi SAS</h2><div class="fc">35 soal dengan susunan seperti SAS: <b>A</b> 20 pilihan ganda (banyak yang bergambar), <b>B</b> 10 isian, <b>C</b> 5 uraian (terjemah, susun kalimat, dialog, sambung kata + dhamir). Tanpa petunjuk dan tanpa pembahasan sampai selesai. Kerjakan dengan tenang, waktu bebas.</div><div class="exst" style="display:flex;gap:10px;justify-content:center"><div><b>${SS.sim.best||0}%</b><small>terbaik</small></div><div><b>${SS.sim.tries||0}</b><small>percobaan</small></div></div><button class="opt go" id="go">▶ Mulai Simulasi</button><button class="opt" id="bk">← Jalur</button>`;$('#go').onclick=simRun;$('#bk').onclick=hub}
function simRun(){const t0=Date.now();run({title:'🎓 Simulasi SAS',qs:simQs(),gate:true,quiet:true,end:(res,c)=>{const pc=p=>{const L=res.items.filter(x=>x.q.part==p);return[L.filter(x=>x.first).length,L.length]},a=pc('A'),b=pc('B'),cc=pc('C'),tot=a[0]+b[0]+cc[0],n=res.n,pct=Math.round(tot/n*100),sec=Math.round((Date.now()-t0)/1000),mm=Math.floor(sec/60);
const S=SS.sim;S.tries=(S.tries||0)+1;S.best=Math.max(S.best||0,pct);S.last={pct,d:dstr()};let bonus=0;if(!S.paid){S.paid=1;bonus=100;coins+=100;hud()}sv();
const wc={};res.wrong.forEach(q=>{const s=TSM[q.t];if(s)wc[s]=(wc[s]||0)+1});const rec=Object.keys(wc).sort((x,y)=>wc[y]-wc[x]).slice(0,3);
c.innerHTML=`<h2>🎓 Hasil Simulasi SAS</h2><div class="q" style="text-align:center;font-size:30px">${tot} / ${n} · ${pct}%</div><div class="bar"><i style="width:${pct}%"></i></div><div class="fc">${pct>=85?'🌟 Siap SAS! Pertahankan dengan mengulang sesekali.':pct>=70?'👍 Hampir siap. Perkuat bagian yang masih salah.':'🌱 Belum siap. Ulangi stasiun yang disarankan di bawah, lalu coba lagi.'}</div><div class="exst" style="display:flex;gap:10px;justify-content:center"><div><b>${a[0]}/${a[1]}</b><small>A pilihan ganda</small></div><div><b>${b[0]}/${b[1]}</b><small>B isian</small></div><div><b>${cc[0]}/${cc[1]}</b><small>C uraian</small></div></div><small>Waktu: ${mm?mm+' mnt ':''}${sec%60} dtk${bonus?` · +${bonus} 🪙 (pertama kali)`:''}</small>${rec.length?`<div class="gt">Disarankan diulang</div>${rec.map(s=>`<button class="opt" data-s="${s}">${ST[s-1].ic} Stasiun ${s}: ${ST[s-1].t} (${wc[s]} salah)</button>`).join('')}`:''}${wl(res.wrong)}<button class="opt go" id="again">🔁 Simulasi lagi</button><button class="opt" id="bk">← Jalur</button>`;bindSp(c);
c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>station(+b.dataset.s));$('#again').onclick=simIntro;$('#bk').onclick=hub;try{if(pct>=70)confetti()}catch(e){}}})}

/* ---------- PASANG KE GAME ---------- */
function nextTxt(){const n=nextSt(),dn=doneN();return n?`🧭 Jalur SAS: Stasiun ${n} · ${ST[n-1].t} (${dn}/7)`:`🎓 Jalur SAS: siap Simulasi${SS.sim.best?` · terbaik ${SS.sim.best}%`:''}`}
try{const st=$('#stat');if(st&&!$('#sasb')){const b=document.createElement('button');b.className='pill';b.id='sasb';b.setAttribute('aria-label','Jalur menuju SAS');b.title='Jalur menuju SAS';b.innerHTML='<span aria-hidden="true">🧭</span><span id="sasn" class="bdg" aria-hidden="true"></span><span class="lb" aria-hidden="true">Jalur</span>';st.insertBefore(b,$('#bkb')||st.firstChild);
b.onclick=()=>{if(open||!ready)return;if(typeof RID!=='undefined'&&RID){ts('🚲 Turun dulu dari kendaraan (F), lalu buka Jalur.',2200);return}if(typeof CV!=='undefined'&&CV)return;hub()}}}catch(e){}
badge();
if(typeof updQt==='function'){const u0=updQt;updQt=function(){u0.apply(this,arguments);try{const e=typeof qtE!=='undefined'?qtE:null;if(!e)return;let s=e.querySelector('.sasq');const h=nextTxt();if(!s){s=document.createElement('small');s.className='sasq';s.style.cssText='display:block;margin-top:4px';e.appendChild(s)}if(s.innerHTML!==h)s.innerHTML=h}catch(_){}}}
setInterval(()=>{try{if(!SS.nudged&&ready&&!open){SS.nudged=1;sv();ts('🧭 Tekan tombol Jalur untuk belajar menuju SAS',4500)}}catch(e){}},3000);
window.JSAS={GEN,build,ST,simQs,SS:()=>SS,hub,peta};
})();
