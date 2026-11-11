/* ---------- hapus & bersihkan data ---------- */
const nk=s=>String(s.nama||'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
const bestOf=g=>g.slice().sort((a,b)=>b.tot-a.tot||(b.ts||0)-(a.ts||0))[0];
function dupGroups(){const m={};S.L.forEach(s=>{const k=nk(s);if(k)(m[k]=m[k]||[]).push(s)});return Object.values(m).filter(g=>g.length>1)}
const isLive=()=>String(S.src||'').indexOf('Firebase')===0;
function askDel(L){const nm=L.slice(0,8).map(s=>'• '+s.nama+(s.tot?' ('+s.tot+' soal)':' (belum bermain)')).join('\n')+(L.length>8?'\n…dan '+(L.length-8)+' lainnya':'');
 return confirm('Hapus '+L.length+' siswa?\n\n'+nm+'\n\n'+(isLive()?'Data dihapus PERMANEN dari Firebase. Berkas cadangan diunduh lebih dulu (bisa dipulihkan lewat Impor berkas).':S.demo?'Ini data contoh, hanya hilang dari tampilan.':'Data ini berasal dari berkas/salinan, jadi hanya dihapus dari daftar di perangkat ini. Firebase tidak berubah.'))}
async function delStudents(L){
 if(!L.length||S.del||!askDel(L))return;
 S.del=true;const done=[],fail=[];
 try{if(isLive()){const sub={};L.forEach(x=>{if(S.recs&&S.recs[x.key])sub[x.key]=S.recs[x.key]});dl('cadangan-siswa-dihapus-'+today()+'.json',JSON.stringify(sub),'application/json');
   const tk=await getTok(),base=cfg.db.replace(/\/$/,'');
   for(const x of L){try{const r=await fetch(base+'/'+ROOT+'/'+encodeURIComponent(x.key)+'.json'+(tk?'?auth='+encodeURIComponent(tk):''),{method:'DELETE'});r.ok?done.push(x.key):fail.push(x.nama+' (HTTP '+r.status+')')}catch(e){fail.push(x.nama+' (jaringan gagal)')}}}
  else L.forEach(x=>done.push(x.key))}
 catch(e){fail.push(String((e&&e.message)||e))}
 S.del=false;const gone=new Set(done);
 S.L=S.L.filter(x=>!gone.has(x.key));
 gone.forEach(k=>{if(S.recs)delete S.recs[k];delete hist[k];delete notes[k];delete logs[k];if(S.pick)S.pick.delete(k)});
 if(gone.has(S.sel))S.sel=null;
 if(!S.demo){LS('rg.hist',JSON.stringify(hist));LS('rg.notes',JSON.stringify(notes));saveLogs();LS('rg.cache',JSON.stringify({at:S.at,recs:S.recs||{}}))}
 classStats(S.L);render();
 alert(done.length+' siswa dihapus.'+(fail.length?' Gagal: '+fail.join('; ')+(fail.some(f=>/HTTP 40[13]/.test(f))?'. Periksa aturan .write pada siswa di Firebase.':''):''))}
function updPick(){const e=$('#dp'),n=S.pick?S.pick.size:0;if(e){e.disabled=!n;e.textContent='Hapus terpilih ('+n+')'}}
function vClean(){
 const G=dupGroups(),E=S.L.filter(x=>!x.tot);if(S.demo||(!G.length&&!E.length))return'';
 let h='<div class="card noprint"><h2>Bersihkan data</h2>';
 if(G.length)h+=`<div class="sm mut">Nama yang mirip (beda huruf besar/kecil, spasi, atau tanda baca). Yang dipertahankan adalah yang paling banyak jawabannya.</div>`+G.map(g=>{const k=bestOf(g);return`<div class="need">${g.map(x=>`<div class="row" style="margin:4px 0"><span style="flex:1;min-width:140px"><b>${esc(x.nama)}</b>${x===k?' <span class="chip ok">dipertahankan</span>':''}<br><span class="mut sm">${x.tot} soal · ${x.ts?esc(ago(x.ts)):'belum aktif'}</span></span>${x===k?'':`<button class="btn danger" data-a="del1" data-k="${esc(x.key)}">Hapus</button>`}</div>`).join('')}<button class="btn" data-a="dedupe" data-g="${esc(nk(g[0]))}">Hapus yang lain, simpan yang dipertahankan</button></div>`}).join('')+`<div style="margin-top:8px"><button class="btn danger" data-a="delAllDup">Bersihkan semua duplikat (${G.reduce((n,g)=>n+g.length-1,0)})</button></div>`;
 if(E.length)h+=`<div class="sm" style="margin-top:10px"><b>${E.length} siswa belum menjawab soal satu pun.</b> <button class="btn danger" data-a="delEmpty">Hapus yang belum bermain</button></div>`;
 return h+'</div>'}
const TABS=[['ring','Ringkasan'],['siswa','Siswa'],['on','Online'],['kelas','Analisis Kelas'],['lap','Laporan & Ekspor'],['set','Pengaturan']];
function render(){
 $('#nav').innerHTML=TABS.map(t=>`<button class="${(S.tab===t[0]||(S.sel&&t[0]==='siswa'&&S.tab==='siswa'))?'on':''}" data-a="tab" data-t="${t[0]}">${ICO[t[0]]}<span>${t[0]==='on'?'Online ('+onList().length+')':t[1]}</span></button>`).join('');
 $('#hdr').textContent=S.L.length?`${view().length} siswa · ${S.src}${S.at?' · '+dt(S.at):''}`:(S.busy?'Memuat data…':'');const hb=$('#hrf');if(hb){hb.disabled=!!S.busy;hb.classList.toggle('spin',!!S.busy);hb.querySelector('span').textContent=S.busy?'Memuat…':'Perbarui'}
 const v={ring:vRing,siswa:()=>S.sel?vDetail():vSiswa(),kelas:vKelas,on:vOnline,lap:vLap,set:vSet}[S.tab]||vRing;
 const f=document.activeElement&&document.activeElement.id;
 $('#app').innerHTML=v();if(f==='q'){const e=$('#q');if(e){e.focus();e.setSelectionRange(e.value.length,e.value.length)}}}
const ACT={
 sel:(d,b)=>{S.pick=S.pick||new Set();const on=!S.pick.has(d.k);on?S.pick.add(d.k):S.pick.delete(d.k);const c=b.querySelector('input');if(c)c.checked=on;updPick()},
 selAll:()=>{S.pick=S.pick||new Set();const v=S.vis||[],all=v.length&&v.every(k=>S.pick.has(k));v.forEach(k=>all?S.pick.delete(k):S.pick.add(k));render()},
 del1:d=>{const x=S.L.find(y=>y.key===d.k);if(x)delStudents([x])},
 delPick:()=>delStudents(S.L.filter(x=>S.pick&&S.pick.has(x.key))),
 dedupe:d=>{const g=dupGroups().find(g=>nk(g[0])===d.g);if(g){const k=bestOf(g);delStudents(g.filter(x=>x!==k))}},
 delAllDup:()=>delStudents(dupGroups().flatMap(g=>{const k=bestOf(g);return g.filter(x=>x!==k)})),
 delEmpty:()=>delStudents(S.L.filter(x=>!x.tot)),
 tab:d=>{S.tab=d.t;if(d.t!=='siswa')S.sel=null;render();scrollTo(0,0)},
 open:d=>{S.sel=d.k;S.tab='siswa';render();scrollTo(0,0)},
 back:()=>{S.sel=null;render()},
 refresh:()=>refresh(),
 demo:()=>{S.tab='ring';ingest(mkDemo(),'Data contoh (fiktif)',true)},
 print:()=>print(),
 printAll:()=>{const L=view().slice().sort((a,b)=>a.nama.localeCompare(b.nama));$('#printAll').innerHTML=L.map(s=>`<div class="pb"><h1 style="margin:0 0 4px">Laporan Belajar · Kota Profesi</h1><div class="mut" style="margin-bottom:8px">${esc(s.nama)}${s.kelas?' · kelas '+esc(s.kelas):''} · dicetak ${esc(today())}</div>${sections(s).replace(/<textarea[\s\S]*?<\/textarea>/g,'')}</div>`).join('');document.body.classList.add('pa');setTimeout(()=>{print();document.body.classList.remove('pa')},200)},
 csv:()=>dl('rekap-kota-profesi-'+today()+'.csv',csv(view()),'text/csv;charset=utf-8'),
 copyS:d=>{const s=S.L.find(x=>x.key===d.k);if(s)copy(sumTxt(s))},
 copyAll:()=>copy(view().map(s=>`${s.nama}: ${s.A.cat}, akurasi ${pc(s.acc)}, kosakata ${s.wsM}/24, stasiun ${s.stDone}/7${s.A.simBest?', simulasi '+s.A.simBest+'%':''}`).join('\n')),
 saveCfg:()=>{cfg.db=($('#cdb').value||DEF_DB).trim();saveCfg();refresh()},
 login:async()=>{cfg.apiKey=($('#cak').value||'').trim();cfg.email=($('#cem').value||'').trim();const pw=$('#cpw').value||'';
  if(!cfg.apiKey||!cfg.email||!pw){alert('Isi Web API Key, email, dan kata sandi.');return}
  saveCfg();try{await login(pw);$('#cpw').value='';S.tab='ring';await refresh()}catch(e){alert(String((e&&e.message)||e))}},
 saveRos:()=>{cfg.roster=$('#cro').value;saveCfg();alert('Daftar siswa disimpan.')},
 inFile:()=>$('#fin').click(),
 bk:()=>dl('cadangan-ruang-guru-'+today()+'.json',JSON.stringify({notes,hist,logs}),'application/json'),
 bkIn:()=>$('#fbk').click(),
 clearLocal:()=>{if(confirm('Hapus salinan data, riwayat perkembangan, dan catatan guru di perangkat ini? Data di Firebase tidak terhapus.')){['rg.cache','rg.hist','rg.notes','rg.log'].forEach(k=>LS(k,null));hist={};notes={};logs={};alert('Dihapus.');render()}}};

/* ---------- edit siswa, interaksi, alat kelas ---------- */
const saveLogs=()=>LS('rg.log',JSON.stringify(logs));
const stripK=n=>String(n).replace(/\s*(?<![0-9])(?:kelas\s*)?[1-6]\s*[.\-]?\s*[a-zA-Z]?\s*$/i,'').trim();
const TAGS=[['pujian','⭐ Pujian'],['aktif','🙋 Aktif'],['remedial','🛠 Remedial'],['wawancara','💬 Wawancara'],['ortu','👨‍👩‍👧 Hubungi ortu']];
function modal(title,body,btns){
 let m=$('#mdl');if(m)m.remove();m=document.createElement('div');m.id='mdl';m.className='noprint';
 m.innerHTML=`<div class="card" role="dialog" aria-modal="true"><h2>${title}</h2>${body}<div class="row" style="margin-top:12px;justify-content:flex-end">${btns.map((b,i)=>`<button class="btn ${b.c||''}" data-i="${i}">${b.l}</button>`).join('')}<button class="btn" data-i="x">Tutup</button></div></div>`;
 m.addEventListener('click',e=>{if(e.target===m)return m.remove();const b=e.target.closest('[data-i]');if(!b)return;if(b.dataset.i==='x')return m.remove();const r=btns[+b.dataset.i].f(m);if(r!==false&&btns[+b.dataset.i].close!==false)m.remove()});
 document.body.appendChild(m);const f=m.querySelector('input,textarea');if(f)f.focus();return m}
async function patchLive(path,obj,method){
 const tk=await getTok(),u=cfg.db.replace(/\/$/,'')+'/'+path+'.json'+(tk?'?auth='+encodeURIComponent(tk):'');
 const r=await fetch(u,{method:method||'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(obj)});
 if(!r.ok)throw new Error('HTTP '+r.status);return r}
function editStudent(k){
 const s=S.L.find(x=>x.key===k);if(!s)return;
 modal('✏️ Ubah data siswa',`<label class="sm">Nama siswa</label><input type="text" id="enm" value="${esc(stripK(s.nama))}"><label class="sm">Kelas (mis. 4A, boleh kosong)</label><input type="text" id="ekl" value="${esc(s.kelas||'')}"><div class="mut sm" style="margin-top:8px">${isLive()?'Nama di Firebase ikut diubah. Kunci data siswa tetap sama, jadi skor dan riwayat tidak hilang.':'Perubahan hanya di perangkat ini (data berasal dari berkas/salinan).'}</div>`,
 [{l:'Simpan',c:'pri',close:false,f:async m=>{
  const n=m.querySelector('#enm').value.trim(),kl=m.querySelector('#ekl').value.trim().replace(/\s+/g,'');
  if(!n){alert('Nama tidak boleh kosong.');return false}
  const nama=(n+(kl?' '+kl:'')).trim();
  try{if(isLive())await patchLive(ROOT+'/'+encodeURIComponent(k),{nama})}catch(e){alert('Gagal menyimpan ke Firebase ('+e.message+'). Periksa aturan .write pada siswa.');return false}
  if(S.recs&&S.recs[k])S.recs[k].nama=nama;
  const i=S.L.findIndex(x=>x.key===k);S.L[i]=parseStudent(k,S.recs[k]);classStats(S.L);
  if(!S.demo)LS('rg.cache',JSON.stringify({at:S.at,recs:S.recs||{}}));
  m.remove();render();alert('Data siswa diperbarui.');return false}}])}
function logAdd(k,tag,t){(logs[k]=logs[k]||[]).unshift({ts:Date.now(),tag,t:t||''});logs[k]=logs[k].slice(0,60);saveLogs()}
function vLog(s){
 const L=logs[s.key]||[],lab=Object.fromEntries(TAGS);
 return`<div class="card noprint"><h2>🤝 Interaksi dengan siswa</h2>
 <div class="row"><button class="btn pri" data-a="msg" data-k="${esc(s.key)}">💬 Kirim pesan / semangat</button><button class="btn" data-a="edit1" data-k="${esc(s.key)}">✏️ Ubah nama/kelas</button></div>
 <div class="sm mut" style="margin:10px 0 4px">Catat cepat (tersimpan di perangkat ini):</div>
 <div class="row">${TAGS.map(t=>`<button class="btn" data-a="logq" data-k="${esc(s.key)}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div>
 <input type="text" id="lgt" placeholder="Catatan singkat (opsional) lalu tekan tombol di atas" style="margin-top:8px;width:100%;box-sizing:border-box">
 <div style="margin-top:8px">${L.length?L.slice(0,10).map((x,i)=>`<div class="sm" style="margin:3px 0"><span class="chip gr">${esc(lab[x.tag]||x.tag)}</span> ${esc(x.t)} <span class="mut">· ${esc(dt(x.ts))}</span> <b style="cursor:pointer;color:var(--lo)" data-a="logdel" data-k="${esc(s.key)}" data-i="${i}" title="Hapus">×</b></div>`).join(''):'<div class="mut sm">Belum ada catatan interaksi.</div>'}</div></div>`}
