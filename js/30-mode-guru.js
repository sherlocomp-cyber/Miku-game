/* === BAGIAN 30: Mode Guru (login sederhana, semua fitur terbuka, kirim pesan ke siswa) ===
   Modul mandiri. WAJIB dimuat SEBELUM js/26 di index.html (supaya data guru tidak ikut diunggah sebagai siswa).
   Masuk: layar awal -> tombol "🔑 Masuk guru" -> kata sandi. Nama karakter jadi "Guru", flag kp.guru=1.
   Di mode guru: koin 99999, semua warga ⭐⭐⭐, semua kosakata, semua baju, semua misi selesai.
   Data guru TIDAK ditulis ke /siswa dan /papan (tidak mengotori statistik kelas dan papan juara).
   Tombol 📢 di kanan layar: kirim pesan ke semua siswa aktif atau satu kelas (ke /pesanGuru, dibaca js/29).
   Kata sandi bawaan: gurumiku (disimpan sebagai hash di PASS; ganti dengan hash baru bila perlu).
   Ini pengaman sederhana, bukan keamanan tinggi. Cara balik ke tampilan lama: hapus baris <script> js/30 di index.html. */
(function(){
if(window.GM)return;
const DB='https://miku-profesi-default-rtdb.asia-southeast1.firebasedatabase.app';
const PASS='13bkjdi6s8b',NAMA='Guru';
const ld=k=>{try{return localStorage.getItem(k)}catch(e){return null}},sv=(k,v)=>{try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}};
const hs=s=>{s=String(s).trim().toLowerCase();let a=0xdeadbeef,b=0x41c6ce57;for(let i=0,c;i<s.length;i++){c=s.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);return(4294967296*(2097151&b)+(a>>>0)).toString(36)};
const guru=ld('kp.guru')==='1'&&ld('kp.name')===NAMA;
const Q=s=>document.querySelector(s);
const bersih=t=>String(t==null?'':t).replace(/[\u0000-\u001f\u007f<>]/g,' ').replace(/\s+/g,' ').trim().slice(0,160);

/* ---------- Tombol masuk guru di layar awal ---------- */
(function(){const card=Q('#st .card');if(!card||Q('#gmin'))return;
 const b=document.createElement('button');b.type='button';b.id='gmin';b.className='opt';b.textContent=guru?'👩‍🏫 Mode Guru aktif · keluar':'🔑 Masuk guru';
 b.style.cssText='margin-top:8px;font-size:13px;opacity:.8';card.appendChild(b);
 b.onclick=()=>{
  if(guru){if(confirm('Keluar dari Mode Guru?')){sv('kp.guru',null);sv('kp.name',null);location.reload()}return}
  const p=prompt('Kata sandi guru:');if(p===null)return;
  if(hs(p)!==PASS){alert('Kata sandi salah.');return}
  sv('kp.guru','1');sv('kp.name',NAMA);location.reload()}})();

if(!guru){window.GM={guru:false};return}

/* ---------- Data guru tidak diunggah ---------- */
window.FB={sync(){},url:'',guru:true};
const of=window.fetch;
window.fetch=function(u,o){try{const m=((o&&o.method)||'GET').toUpperCase(),url=String(u&&u.url||u);
 if(m!=='GET'&&/firebasedatabase\.app\/(siswa|papan)\//.test(url))return Promise.resolve(new Response('null',{status:200}))}catch(e){}
 return of.apply(this,arguments)};

/* ---------- Buka semua fitur (sekali, setelah game siap) ---------- */
let done=false;
function unlock(){try{
 if(typeof ready==='undefined'||!ready||typeof pois==='undefined'||typeof G==='undefined'||typeof MS==='undefined')return;
 done=true;
 coins=Math.max(coins,99999);
 pois.forEach(p=>{p.lv=3});
 for(let i=0;i<G.ws.length;i++)G.ws[i]=9;
 G.own=[0,1,2,3,4,5];
 MS.forEach(m=>G.md.add(m.id));
 G.q=QS.length;
 ['mf','mt','pj','sk'].forEach(k=>{G.stb[k]=5});
 hud();
 try{ts('👩‍🏫 Mode Guru: semua fitur terbuka',3500)}catch(e){}
}catch(e){console.warn('mode-guru',e)}}
const iv=setInterval(()=>{if(done){clearInterval(iv);return}unlock()},800);

/* ---------- Tombol 📢 dan panel kirim pesan ---------- */
const css=document.createElement('style');css.textContent=`
#gmb{position:fixed;right:8px;top:46%;z-index:60;font:700 15px 'Baloo 2',sans-serif;background:#ffcf3f;color:#1d2b53;border:3px solid #1d2b53;border-radius:14px;padding:6px 10px;cursor:pointer}
#gmp{position:fixed;left:50%;bottom:max(8px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(94vw,520px);max-height:86vh;overflow:auto;background:#fffaf0;color:#1d2b53;border:4px solid #1d2b53;border-radius:18px;padding:10px 12px;z-index:85;font-family:'Baloo 2',sans-serif;display:none;box-shadow:0 6px 24px rgba(0,0,0,.35)}
#gmp .gh{display:flex;justify-content:space-between;align-items:center;font-size:18px}
#gmp .gh button{background:none;border:0;font-size:20px;cursor:pointer;color:#1d2b53}
#gmp input,#gmp textarea{width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:6px 10px;border:3px solid #1d2b53;border-radius:12px;background:#fff;color:#1d2b53;margin-top:6px}
#gmp .gr{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}
#gmp .gr button{font:inherit;font-weight:700;border:3px solid #1d2b53;border-radius:12px;padding:6px 14px;cursor:pointer;color:#1d2b53;background:#fff}
#gmp .gr .go{background:#2fa56b;color:#fff}
#gmp .gn{font-size:12px;opacity:.85;margin-top:6px}`;
document.head.appendChild(css);
const b=document.createElement('button');b.id='gmb';b.type='button';b.setAttribute('aria-label','Kirim pesan ke siswa');b.textContent='📢 Guru';document.body.appendChild(b);
const p=document.createElement('div');p.id='gmp';p.setAttribute('role','dialog');p.setAttribute('aria-label','Kirim pesan ke siswa');
p.innerHTML='<div class="gh"><b>📢 Pesan ke siswa aktif</b><button id="gmx" type="button" aria-label="Tutup">✖</button></div><input id="gmk" maxlength="6" placeholder="Kelas, mis. 4A (kosongkan = semua siswa aktif)" autocomplete="off"><textarea id="gmt" rows="3" maxlength="160" placeholder="Tulis pesan (maks. 160 huruf)"></textarea><div class="gr"><button class="go" id="gms" type="button">📢 Kirim</button><button id="gmo" type="button">Keluar mode guru</button></div><div class="gn" id="gmn">Pesan tampil di layar siswa yang sedang bermain.</div>';
document.body.appendChild(p);
['keydown','keyup','keypress'].forEach(ev=>p.addEventListener(ev,e=>e.stopPropagation()));
['keydown','keyup'].forEach(ev=>addEventListener(ev,e=>{if(p.contains(e.target))e.stopImmediatePropagation()},true));
const note=t=>{Q('#gmn').textContent=t};
b.onclick=()=>{try{for(const k in key)key[k]=0}catch(e){}p.style.display=p.style.display==='block'?'none':'block'};
Q('#gmx').onclick=()=>{p.style.display='none'};
Q('#gmo').onclick=()=>{if(confirm('Keluar dari Mode Guru?')){sv('kp.guru',null);sv('kp.name',null);location.reload()}};
Q('#gms').onclick=()=>{
 const t=bersih(Q('#gmt').value);if(!t){note('Tulis pesannya dulu.');return}
 const kl=Q('#gmk').value.toLowerCase().replace(/[^a-z0-9]/g,''),to=kl||'semua',lb=kl?'kelas '+kl.toUpperCase():'semua siswa aktif';
 if(!confirm('Kirim ke '+lb+'?\n\n'+t))return;
 fetch(DB+'/pesanGuru/'+encodeURIComponent(to)+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:Math.random().toString(36).slice(2,9),t,dari:'Guru',ts:{'.sv':'timestamp'}})})
 .then(r=>{if(!r.ok)throw new Error(r.status);Q('#gmt').value='';note('✅ Terkirim ke '+lb+'.')})
 .catch(e=>note('Gagal terkirim ('+(e&&e.message)+'). Periksa internet dan aturan pesanGuru di Firebase.'))};
window.GM={guru:true,unlock};
})();
