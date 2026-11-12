/* === BAGIAN 34 (v1): Kabar Baru, pengumuman pembaruan di layar awal ===
   ATURAN PROYEK: setiap kali ada pembaruan aplikasi, TAMBAHKAN satu entri di BAGIAN ATAS daftar KB di bawah
   ({id,tgl,judul,butir:[...]}), pakai bahasa sederhana untuk siswa, lalu naikkan ?v= pada <script> js/34 di index.html.
   Entri paling atas = pengumuman terbaru. id harus baru dan unik (mis. '2026-11-20a').
   Tampilan: kotak di layar awal ("Mulai petualangan"). Terbuka otomatis selama siswa belum melihat entri terbaru;
   setelah menekan "Mulai petualangan" ia tersimpan sebagai sudah dilihat dan lain kali tampil ringkas (ketuk untuk membuka).
   Modul mandiri, tidak mengubah file lain. Cara balik: hapus baris <script> js/34 di index.html. */
(function(){
'use strict';
const KB=[
  {id:'2026-11-12a',tgl:'12 November 2026',judul:'Jembatan Kaca Ilmu makin seru 🌉',butir:[
    '🌉 Arena baru <b>Jembatan Kaca</b> (tombol 🌉 Kaca): pilih kaca yang berisi jawaban benar, sampai seberang lebih dulu dari Kak Hud-hud.',
    '🔁 Soal yang kamu salah akan <b>muncul lagi</b> beberapa soal kemudian, jadi bisa langsung dilatih.',
    '⏳ Salah berkali-kali beruntun membuat jeda jatuh makin lama. Baca dulu, jangan menebak ya!',
    '🤖 Lawan bisa <b>naik atau turun tingkat otomatis</b> sesuai kemampuanmu.',
    '👥 <b>Mode Tim gantian</b>: dua tim main di satu layar, cocok untuk seru-seruan di kelas.',
    '⚡ Ada rekor <b>tercepat hari ini</b>, dan Kak Hud-hud sekarang suka berceloteh.'
  ]}
];
const KEY='kp:kabar-baru',MAX=3;
const rd=()=>{try{return localStorage.getItem(KEY)}catch(e){return null}};
const wr=v=>{try{localStorage.setItem(KEY,v)}catch(e){}};
function mount(){
  if(!KB.length||document.getElementById('kbr'))return;
  const sb=document.getElementById('sb');if(!sb||!sb.parentNode)return;
  const cur=KB[0],unseen=rd()!==cur.id;
  const css=document.createElement('style');css.textContent=
    '#kbr{margin:8px 0;text-align:left;border:3px solid #1d2b53;border-radius:14px;background:#fff6d6;color:#1d2b53;font-size:14px;line-height:1.35}'
    +'#kbr summary{cursor:pointer;padding:8px 12px;font-weight:800;min-height:44px;box-sizing:border-box;display:flex;align-items:center;gap:6px}'
    +'#kbr summary:focus-visible{outline:4px solid #1d2b53;outline-offset:2px}'
    +'#kbr .kbn{background:#c62f26;color:#fff;border-radius:999px;padding:1px 8px;font-size:12px}'
    +'#kbr .kbb{padding:0 12px 10px;max-height:34vh;overflow:auto}'
    +'#kbr h4{margin:8px 0 4px;font-size:14px}#kbr h4 small{font-weight:400;opacity:.75}'
    +'#kbr ul{margin:0;padding-left:20px}#kbr li{margin:3px 0}';
  document.head.appendChild(css);
  const box=document.createElement('details');box.id='kbr';box.open=unseen;
  const sm=document.createElement('summary');
  const badge=document.createElement('span');badge.className='kbn';badge.textContent='BARU';badge.hidden=!unseen;
  const ttl=document.createElement('span');ttl.textContent='🆕 Kabar baru: '+cur.judul;
  sm.appendChild(badge);sm.appendChild(ttl);box.appendChild(sm);
  const body=document.createElement('div');body.className='kbb';
  KB.slice(0,MAX).forEach((e,i)=>{
    const h=document.createElement('h4');h.textContent=(i?e.judul:'Yang baru:')+' ';const s=document.createElement('small');s.textContent='('+e.tgl+')';h.appendChild(s);body.appendChild(h);
    const ul=document.createElement('ul');e.butir.forEach(t=>{const li=document.createElement('li');li.innerHTML=t;ul.appendChild(li)});body.appendChild(ul)});
  box.appendChild(body);
  const vn=document.getElementById('vn');
  if(vn&&vn.parentNode)vn.parentNode.insertBefore(box,vn.nextSibling);else sb.parentNode.insertBefore(box,sb);
  sb.addEventListener('click',()=>{wr(cur.id);box.open=false;badge.hidden=true},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
window.KBR={list:KB,mount};
})();
