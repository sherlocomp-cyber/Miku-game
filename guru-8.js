function msgStudent(k){
 const s=S.L.find(x=>x.key===k);if(!s)return;
 const pre=s.A.cat==='Mahir'?`Hebat ${stripK(s.nama)}! Pertahankan semangat belajarmu dan bantu temanmu ya.`:`Semangat ${stripK(s.nama)}! Ayo ulangi kosakata dan stasiun yang belum selesai, kamu pasti bisa.`;
 modal('💬 Pesan untuk '+esc(s.nama),`<label class="sm">Isi pesan</label><textarea id="mtx" rows="4">${esc(pre)}</textarea><div class="mut sm" style="margin-top:6px">Simpan ke Firebase: pesan masuk di <code>pesan/${esc(k)}</code> supaya bisa dibaca game siswa. WhatsApp/salin untuk orang tua atau siswa.</div>`,
 [{l:'Simpan ke Firebase',c:'pri',close:false,f:async m=>{const t=m.querySelector('#mtx').value.trim();if(!t)return false;
   if(!isLive()){alert('Hanya bisa saat terhubung ke Firebase. Gunakan WhatsApp atau Salin.');return false}
   try{await patchLive('pesan/'+encodeURIComponent(k),{[Date.now()]:{dari:'guru',t,ts:Date.now(),baca:false}});logAdd(k,'pujian','Pesan: '+t.slice(0,60));m.remove();render();alert('Pesan tersimpan.')}catch(e){alert('Gagal ('+e.message+'). Atur aturan .write untuk pesan di Firebase, atau pakai WhatsApp/Salin.')}return false}},
  {l:'WhatsApp',f:m=>{const t=m.querySelector('#mtx').value.trim();if(t){window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank');logAdd(k,'ortu','Pesan WA')}}},
  {l:'Salin',f:m=>{copy(m.querySelector('#mtx').value)}}])}
function callRandom(){
 const pool=(S.vis&&S.vis.length?S.vis:view().map(x=>x.key)).map(k=>S.L.find(x=>x.key===k)).filter(Boolean);
 if(!pool.length){alert('Tidak ada siswa.');return}
 S.called=S.called||new Set();
 const show=m=>{
  let c=pool.filter(x=>!S.called.has(x.key));if(!c.length){S.called.clear();c=pool}
  const pr=m.querySelector('#cpr').checked;
  let w=c.map(x=>pr&&x.A.cat==='Perlu bimbingan'?3:1),t=w.reduce((a,b)=>a+b,0),r=Math.random()*t,i=0;
  while(i<c.length-1&&r>=w[i]){r-=w[i];i++}
  const s=c[i];S.called.add(s.key);S.cur=s.key;
  m.querySelector('#cnm').innerHTML=`<div style="font-size:28px;font-weight:700;text-align:center;margin:14px 0">${esc(s.nama)}</div><div class="mut sm" style="text-align:center">${esc(s.A.cat)} · akurasi ${pc(s.acc)} · sisa ${pool.length-S.called.size} dari ${pool.length}</div>`};
 const m=modal('🎲 Panggil siswa acak',`<label class="sm"><input type="checkbox" id="cpr"> Utamakan yang perlu bimbingan</label><div id="cnm"></div>`,
  [{l:'Catat: aktif ⭐',close:false,f:m=>{if(S.cur){logAdd(S.cur,'aktif','Dipanggil acak');alert('Dicatat.')}return false}},{l:'Panggil lagi',c:'pri',close:false,f:m=>{show(m);return false}}]);
 show(m)}
function pairUp(){
 const L=(S.vis&&S.vis.length?S.vis:view().map(x=>x.key)).map(k=>S.L.find(x=>x.key===k)).filter(x=>x&&x.tot).sort((a,b)=>b.acc-a.acc);
 if(L.length<2){alert('Butuh minimal 2 siswa yang sudah bermain.');return}
 const P=[];for(let i=0,j=L.length-1;i<j;i++,j--)P.push([L[i],L[j]]);
 const mid=L.length%2?L[(L.length-1)/2]:null;
 const txt=P.map(p=>stripK(p[0].nama)+' (tutor) ↔ '+stripK(p[1].nama)).join('\n')+(mid?'\n'+stripK(mid.nama)+' (bergabung ke pasangan mana saja)':'');
 modal('🤝 Teman belajar (tutor sebaya)',`<div class="sm mut">Siswa dengan akurasi tinggi dipasangkan dengan yang akurasinya rendah.</div>`+P.map(p=>`<div class="need" style="margin:6px 0"><b>${esc(p[0].nama)}</b> <span class="chip ok">${pc(p[0].acc)}</span> ↔ <b>${esc(p[1].nama)}</b> <span class="chip lo">${pc(p[1].acc)}</span></div>`).join('')+(mid?`<div class="sm mut">${esc(mid.nama)} bergabung ke pasangan mana saja.</div>`:''),
  [{l:'Salin daftar',c:'pri',close:false,f:()=>{copy(txt);return false}}])}
Object.assign(ACT,{
 edit1:d=>editStudent(d.k),msg:d=>msgStudent(d.k),rand:()=>callRandom(),pair:()=>pairUp(),
 logq:d=>{const e=$('#lgt');logAdd(d.k,d.t,e?e.value.trim():'');render()},
 logdel:d=>{(logs[d.k]||[]).splice(+d.i,1);saveLogs();render()}});

/* ---------- siswa online ---------- */
const lastSeen=s=>Math.max(s.ts||0,(S.pres&&S.pres[s.key]&&num(S.pres[s.key].ts))||0);
const isLiveP=s=>!!(S.pres&&S.pres[s.key]&&Date.now()-num(S.pres[s.key].ts)<9e4);
const isOn=s=>!S.demo&&(isLiveP(s)||(s.ts&&Date.now()-s.ts<3e5));
const onList=()=>view().filter(isOn).sort((a,b)=>lastSeen(b)-lastSeen(a));
Object.assign(ICO,{on:`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4M17.7 6.3a8 8 0 0 1 0 11.4"/></svg>`});
function vOnline(){
 const L=onList(),n=S.L.filter(isOn).length,live=S.pres&&Object.keys(S.pres).length;
 return`<div class="card noprint"><div class="row"><h2 style="margin:0">🟢 Siswa online: ${n}</h2><select id="fk" style="width:auto"><option value="">Semua kelas</option>${kelasList().map(k=>`<option ${S.kelas===k?'selected':''}>${esc(k)}</option>`).join('')}</select><button class="btn" data-a="refresh">Perbarui</button><span class="mut sm">otomatis tiap 20 detik · ${esc(S.at?'diperbarui '+ago(S.at):'')}</span></div>
 <div class="mut sm" style="margin-top:6px">${live?'Status langsung dari game siswa (detak ≤ 90 detik).':'Perkiraan: siswa yang menyimpan progres dalam 5 menit terakhir. Untuk status real-time, game siswa perlu mengirim detak ke <code>online/&lt;kunci&gt;</code> (lihat CATATAN.md).'}</div></div>
 <div class="card">${L.length?L.map(s=>`<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line)"><span style="color:var(--ok);font-size:18px">●</span><span style="flex:1;min-width:150px"><b>${esc(s.nama)}</b> <span class="mut sm">${esc(s.kelas||'tanpa kelas')}</span><br><span class="mut sm">${isLiveP(s)?'online langsung':'aktif'} · ${esc(ago(lastSeen(s)))} · ${s.tot} soal · akurasi ${pc(s.acc)}</span></span><span class="chip ${chipC(s.A.cat)}">${esc(s.A.cat)}</span><button class="btn" data-a="open" data-k="${esc(s.key)}">Buka</button><button class="btn" data-a="msg" data-k="${esc(s.key)}">💬</button></div>`).join(''):'<div class="mut">Tidak ada siswa online saat ini.'+(S.demo?' (Data contoh tidak punya status online.)':'')+'</div>'}</div>`}
setInterval(()=>{if(S.tab==='on'&&!document.hidden&&!S.demo&&!S.busy&&!(document.activeElement&&document.activeElement.id==='bct'))refresh()},2e4);
const _tab=ACT.tab;ACT.tab=(d,b)=>{_tab(d,b);if(d.t==='on'&&!S.demo)refresh()};
function copy(t){try{navigator.clipboard.writeText(t).then(()=>alert('Tersalin.'),()=>prompt('Salin teks ini:',t))}catch(e){prompt('Salin teks ini:',t)}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&ACT[b.dataset.a])ACT[b.dataset.a](b.dataset,b)});
document.addEventListener('input',e=>{const t=e.target;
 if(t.id==='q'){S.q=t.value;const l=$('#lst');if(l)l.innerHTML=rows()}
 if(t.id==='note'){notes[t.dataset.k]=t.value;LS('rg.notes',JSON.stringify(notes))}});
document.addEventListener('change',e=>{const t=e.target;
 if(t.id==='fk'){S.kelas=t.value;render()}
 if(t.id==='so'){S.sort=t.value;render()}
 if(t.id==='cau'){cfg.auto=+t.value;saveCfg();setAuto()}
 if(t.id==='fin'&&t.files[0]){const r=new FileReader();r.onload=()=>{const o=jp(r.result);if(!o){alert('Berkas bukan JSON yang valid.');return}const n=Object.keys(normalizeRecords(o,()=>'x')).length;if(!n){alert('Tidak ditemukan rekaman siswa di berkas ini.');return}S.tab='ring';ingest(o,'Berkas: '+t.files[0].name,false)};r.readAsText(t.files[0]);t.value=''}
 if(t.id==='fbk'&&t.files[0]){const r=new FileReader();r.onload=()=>{const o=jp(r.result);if(!o){alert('Berkas cadangan tidak valid.');return}Object.assign(notes,o.notes||{});Object.assign(logs,o.logs||{});saveLogs();Object.keys(o.hist||{}).forEach(k=>{hist[k]=Object.assign(hist[k]||{},o.hist[k])});LS('rg.notes',JSON.stringify(notes));LS('rg.hist',JSON.stringify(hist));alert('Cadangan dipulihkan.');render()};r.readAsText(t.files[0]);t.value=''}});
addEventListener('afterprint',()=>document.body.classList.remove('pa'));
(function(){const t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t);let h;window.alert=m=>{m=String(m);t.textContent=m;t.className='show';clearTimeout(h);h=setTimeout(()=>t.className='',2800+m.length*35)}})();
/* === BAGIAN: pesan guru ke semua siswa aktif === */
(function(){
const roomOfK=k=>String(k||'').toLowerCase().replace(/\s+/g,'');
const QUICK=["Assalamu'alaikum anak-anak. Perhatikan ke depan sebentar ya.","Waktu tersisa 5 menit. Selesaikan misi yang sedang dikerjakan.","Bagus sekali! Lanjutkan semangat belajarmu.","Silakan berhenti bermain dan kumpulkan perhatian ke guru."];
S.bt=S.bt||'';S.bk=S.bk||'semua';
function bcCard(){
 const n=S.L.filter(isOn).length,ks=kelasList();
 return `<div class="card noprint"><h2>📢 Pesan ke siswa aktif</h2>
 <div class="row"><select id="bkt" style="width:auto"><option value="semua" ${S.bk==='semua'?'selected':''}>Semua siswa aktif</option>${ks.map(k=>`<option value="${esc(roomOfK(k))}" ${S.bk===roomOfK(k)?'selected':''}>Kelas ${esc(k)}</option>`).join('')}</select><span class="mut sm">${n} siswa online sekarang</span></div>
 <textarea id="bct" rows="3" maxlength="160" placeholder="Tulis pesan (maks. 160 huruf)" style="margin-top:8px">${esc(S.bt)}</textarea>
 <div class="row" style="margin-top:6px">${QUICK.map((q,i)=>`<button class="btn" data-a="bq" data-i="${i}">${esc(q.slice(0,26))}…</button>`).join('')}</div>
 <div class="row" style="margin-top:8px"><button class="btn pri" data-a="bsend">📢 Kirim sekarang</button><span class="mut sm">${S.bl?'Terakhir terkirim '+esc(ago(S.bl.ts))+' ke '+esc(S.bl.to):''}</span></div>
 <div class="mut sm" style="margin-top:6px">Pesan tampil sebagai kartu di layar siswa yang sedang bermain (bukan yang masih di menu awal atau sedang Ujian Akhir; kartu menunggu sampai ujian selesai). Tidak perlu login Firebase.</div>
 <details class="sm" style="margin-top:6px"><summary><b>Aturan Firebase yang perlu dipasang (sekali)</b></summary>Di Realtime Database → Rules, tambahkan di dalam <code>"rules"</code>, sejajar dengan <code>siswa</code> dan <code>online</code> (jangan lupa koma di blok sebelumnya):<br><code>"pesanGuru": {".read": true, "$target": {".write": true, ".validate": "newData.hasChildren(['id','t']) &amp;&amp; newData.child('t').isString() &amp;&amp; newData.child('t').val().length &lt;= 160"}}</code><br>Aturan terbuka: siapa pun yang tahu alamat database secara teknis bisa menulis pesan, jadi cukup untuk kelas, bukan untuk data penting.</details></div>`}
Object.assign(ACT,{
 bq:d=>{S.bt=QUICK[+d.i]||'';render()},
 bsend:async()=>{
  const t=(S.bt||'').replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
  if(!t){alert('Tulis pesannya dulu.');return}
  if(!isLive()){alert('Hanya bisa saat terhubung ke Firebase (bukan data contoh atau berkas).');return}
  const to=S.bk||'semua',lb=to==='semua'?'semua siswa aktif':'kelas '+to.toUpperCase();
  if(!confirm('Kirim ke '+lb+'?\n\n'+t))return;
  try{await patchLive('pesanGuru/'+encodeURIComponent(to),{id:Math.random().toString(36).slice(2,9),t,dari:'Guru',ts:{'.sv':'timestamp'}},'PUT');S.bl={ts:Date.now(),to:lb};S.bt='';render();alert('Terkirim ke '+lb+'.')}
  catch(e){alert('Gagal ('+e.message+'). '+(/40[13]/.test(e.message)?'Pasang aturan pesanGuru di Firebase (lihat kartu Pesan).':'Periksa koneksi.'))}}});
document.addEventListener('input',e=>{if(e.target.id==='bct')S.bt=e.target.value});
document.addEventListener('change',e=>{if(e.target.id==='bkt')S.bk=e.target.value});
const _v=vOnline;vOnline=function(){return bcCard()+_v()};
})();

render();setAuto();refresh();
