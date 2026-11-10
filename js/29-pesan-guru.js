/* === BAGIAN 29: Pesan Guru (kartu pesan dari guru ke siswa yang sedang bermain) ===
   Modul mandiri: tidak mengubah file lain. Dimuat paling akhir (setelah js/28). Tanpa SDK: REST (fetch).
   Guru menulis dari dasbor "Ruang Guru" (tab Online) ke Firebase:
     /pesanGuru/semua   -> diterima semua siswa yang sedang bermain
     /pesanGuru/<ruang> -> hanya satu kelas (ruang = akhir nama murid, "Ahmad 4A" -> "4a")
   Isi: { id, t (teks, maks 160), dari, ts (waktu server) }.
   Siswa memeriksa tiap 7 detik. Pesan lama tidak muncul saat game baru dibuka (hanya yang dikirim <60 detik lalu).
   Kartu tidak muncul saat Ujian Akhir atau layar buat karakter; ia menunggu, lalu tampil setelahnya.
   Teks ditampilkan lewat textContent (aman dari HTML). Penulisan dilindungi aturan Firebase (hanya akun guru).
   Cara balik ke tampilan lama: hapus baris <script> js/29 di index.html. */
(function(){
if(window.PG)return;
const DB='https://miku-profesi-default-rtdb.asia-southeast1.firebasedatabase.app';
const POLL=7000,MAXLEN=160;
const ld=k=>{try{return localStorage.getItem(k)}catch(e){return null}},sv=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const me=()=>{try{return String(typeof NM!=='undefined'?NM:'').trim()}catch(e){return ''}};
const roomOf=n=>{const m=n.match(/(?:^|\s)(\d{1,2})\s*([A-Za-z])?\s*$/);return m?(m[1]+(m[2]||'')).toLowerCase():'umum'};
const bersih=t=>String(t==null?'':t).replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,MAXLEN);
let first=true,queue=[],showing=false;

function playing(){try{const st=document.getElementById('st'),menu=st&&getComputedStyle(st).display!=='none';return !!(typeof ready!=='undefined'&&ready&&me()&&!menu&&!document.hidden)}catch(e){return false}}
function busy(){try{return !!((typeof EXM!=='undefined'&&(EXM.on||EXM.lie))||document.body.classList.contains('cc'))}catch(e){return false}}

const css=document.createElement('style');css.textContent=`
#pgo{position:fixed;inset:0;z-index:90;background:rgba(20,28,60,.55);display:flex;align-items:center;justify-content:center;padding:14px;font-family:'Baloo 2',sans-serif}
#pgo .pgc{width:min(92vw,460px);background:#fffaf0;color:#1d2b53;border:4px solid #1d2b53;border-radius:20px;padding:16px 18px;text-align:center;box-shadow:0 8px 28px rgba(0,0,0,.4)}
#pgo .pga{font-family:Amiri,serif;font-size:28px;font-weight:700;line-height:1.5}
#pgo .pgh{font-size:18px;font-weight:700;margin:2px 0 8px}
#pgo .pgt{font-size:20px;line-height:1.35;white-space:pre-wrap;word-break:break-word;background:#fff;border:3px solid #1d2b53;border-radius:14px;padding:10px 12px;margin-bottom:12px;max-height:40vh;overflow:auto}
#pgo .pgb{font:inherit;font-weight:700;font-size:18px;border:3px solid #1d2b53;background:#2fa56b;color:#fff;border-radius:14px;padding:8px 26px;cursor:pointer}`;
document.head.appendChild(css);

function show(m){showing=true;try{for(const k in key)key[k]=0}catch(e){}
 const o=document.createElement('div');o.id='pgo';o.setAttribute('role','alertdialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Pesan dari guru');
 o.innerHTML='<div class="pgc"><div class="pga" lang="ar">رِسَالَةٌ مِنَ الْمُعَلِّمِ</div><div class="pgh">📢 Pesan dari <span id="pgd"></span></div><div class="pgt" id="pgt"></div><button type="button" class="pgb" id="pgx">Siap! 👍</button></div>';
 document.body.appendChild(o);o.querySelector('#pgd').textContent=m.dari;o.querySelector('#pgt').textContent=m.teks;
 const done=()=>{o.remove();removeEventListener('keydown',kd,true);showing=false};
 const kd=e=>{e.stopImmediatePropagation();if(e.key==='Enter'||e.key==='Escape'||e.key===' '){e.preventDefault();done()}};
 addEventListener('keydown',kd,true);
 const b=o.querySelector('#pgx');b.onclick=done;b.focus();
 try{ts('📢 Pesan dari guru',2000)}catch(e){}}

function pump(){if(showing||!queue.length)return;if(!playing()||busy())return;show(queue.shift())}

function poll(){if(!me()||document.hidden)return;
 const c=new AbortController(),t=setTimeout(()=>c.abort(),8000);
 fetch(DB+'/pesanGuru.json',{signal:c.signal}).then(r=>{clearTimeout(t);if(!r.ok)throw new Error(r.status);return r.json()}).then(d=>{
  const rm=roomOf(me());
  ['semua',rm].forEach(k=>{const m=d&&typeof d==='object'?d[k]:null;if(!m||typeof m!=='object'||!m.id)return;
   const sk='kp.pg.'+k,id=String(m.id).slice(0,12);if(ld(sk)===id)return;sv(sk,id);
   const teks=bersih(m.t);if(!teks)return;
   const fresh=typeof m.ts==='number'&&Math.abs(Date.now()-m.ts)<60000;
   if(first&&!fresh)return;
   queue.push({teks,dari:bersih(m.dari).slice(0,20)||'Guru'})});
  first=false;pump()}).catch(()=>{clearTimeout(t)})}

setTimeout(poll,2500);setInterval(poll,POLL);setInterval(pump,2000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll()});
window.PG={poll,state:()=>({first,antre:queue.length,tampil:showing,ruang:roomOf(me())})};
})();
