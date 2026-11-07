/* === BAGIAN 23: HUD ringkas ===
   Modul mandiri (tidak mengubah file 01-22). Pasangan: css/ringkas.css
   1) Di HP / layar sentuh: tombol 🔁 🃏 🎓 🎨 🔊 ⛶ disembunyikan ke dalam tombol ☰ (menu)
   2) Kartu misi (#qt) hanya menampilkan 2 baris pertama (nomor misi + judul)
   Cara balik ke tampilan lama: hapus baris <script> js/23 dan <link> css/ringkas.css di index.html */
(function(){
if(window.KHR)return;
const Q=s=>document.querySelector(s);
const mq=matchMedia('(pointer:coarse),(max-width:900px)');
const EX=['rvb','mgb','exb','ccb','mu','fsb'];
const st=Q('#stat');if(!st)return;

function build(){
 if(Q('#hmb'))return;
 EX.forEach(id=>{const e=document.getElementById(id);if(e)e.classList.add('mx')});
 const br=document.createElement('span');br.className='hbr';br.setAttribute('aria-hidden','true');
 const b=document.createElement('button');b.className='pill';b.id='hmb';b.type='button';
 b.setAttribute('aria-label','Menu lainnya: ulang, main, ujian, gaya, suara, layar penuh');b.setAttribute('aria-expanded','false');b.title='Menu';
 b.innerHTML='<span aria-hidden="true">☰</span><i class="dot" aria-hidden="true"></i>';
 st.appendChild(b);st.appendChild(br);
 b.onclick=e=>{e.stopPropagation();setOpen(!st.classList.contains('mo'))};
 st.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('.mx'))setTimeout(()=>setOpen(false),120)});
 document.addEventListener('click',e=>{if(st.classList.contains('mo')&&!st.contains(e.target))setOpen(false)});
}
function setOpen(v){st.classList.toggle('mo',!!v);const b=Q('#hmb');if(b)b.setAttribute('aria-expanded',v?'true':'false')}

function tick(){
 const b=Q('#hmb');
 if(b){
  const n=Q('#rvn'),t=n?n.textContent.trim():'';
  b.classList.toggle('has',!!t&&t!=='0');
  if(!mq.matches&&st.classList.contains('mo'))setOpen(false);
  if(getComputedStyle(st).display==='none')setOpen(false);
 }
 const q=Q('#qt');
 if(q)[...q.children].forEach((e,i)=>{const h=mq.matches&&i>=2;if(h){if(e.style.display!=='none')e.style.display='none'}else if(e.style.display==='none')e.style.display=''});
}

build();
setInterval(()=>{try{build();tick()}catch(e){}},400);
window.KHR={open:()=>setOpen(true),close:()=>setOpen(false)};
})();
