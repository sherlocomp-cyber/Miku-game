/* === BAGIAN 26: Simpan progres ke Firebase Realtime Database ===
   Modul mandiri: tidak mengubah file lain. Dimuat paling akhir (setelah js/25). Tanpa SDK: memakai REST (fetch).
   Memakai global dari js/09: NM (nama murid), SK (kunci simpanan), lsg, lss, ready, dstr.
   Satu murid = satu catatan di /siswa/<nama> . Isi: ringkasan (untuk guru) + salinan simpanan game (teks JSON).
   Aturan aman: progres di cloud TIDAK pernah ditimpa oleh progres yang lebih sedikit.
   Pindah perangkat: tulis nama yang sama, bila cloud lebih maju game menawarkan memakainya.
   Tombol "Mulai dari awal" juga menghapus catatan cloud milik nama itu.
   Cara balik ke tampilan lama: hapus baris <script> js/26 di index.html. */
(function(){
if(window.FB)return;
const DB='https://miku-profesi-default-rtdb.asia-southeast1.firebasedatabase.app',ROOT='siswa';
const nm=(typeof NM!=='undefined'?NM:'').trim(),KS=typeof SK!=='undefined'?SK:'kotaProfesi.v3';
const g=k=>{try{return localStorage.getItem(k)}catch(e){return null}},s=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const ss=(k,v)=>{try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}};
const jp=t=>{try{return JSON.parse(t)}catch(e){return null}};
const key=nm.toLowerCase().replace(/[.#$\[\]\/\s]+/g,'_');
let dev=g('kp.dev');if(!dev){dev=Math.random().toString(36).slice(2,10);s('kp.dev',dev)}
const jam=()=>new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
function stat(t){let e=document.getElementById('fbs');if(!e){const a=document.getElementById('svi');if(!a)return;e=document.createElement('div');e.id='fbs';e.style.cssText='font-size:13px;opacity:.85;margin:0 0 8px';a.after(e)}e.textContent=t}
const ring=d=>({lencana:(d.lv||[]).filter(v=>v>0).length,bintang:(d.lv||[]).filter(v=>v>=3).length,koin:d.c|0,misi:d.q|0,benar:Object.values(d.st||{}).reduce((a,x)=>a+((x&&x.ok)|0),0)});
const prog=d=>{const r=ring(d);return r.lencana*50+r.bintang*30+r.benar*3+r.misi*20+(d.md||[]).length*10};
const api=(m,body,ka)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),9000);
 return fetch(DB+'/'+ROOT+'/'+encodeURIComponent(key)+'.json',{method:m,body,signal:c.signal,keepalive:!!ka,headers:body?{'Content-Type':'application/json'}:undefined})
 .then(r=>{clearTimeout(t);if(!r.ok)throw new Error(r.status);return r.json()}).catch(e=>{clearTimeout(t);throw e})};
const HINT='Pakai nama + kelas, misalnya "Ahmad 4A", supaya tidak tertukar dengan temanmu.';
let ok=false,cloudProg=0,last='',busy=false;

function up(ka){if(!ok||!key||busy)return Promise.resolve();
 const txt=g(KS),d=jp(txt);if(!d)return Promise.resolve();
 const sas=g(KS+':sas')||'',sx=g('kp.sasx')||'',sig=txt+'|'+sas+'|'+sx;if(sig===last)return Promise.resolve();
 if(prog(d)<cloudProg){stat('☁️ Progres di cloud lebih maju, jadi data perangkat ini tidak menimpanya.');return Promise.resolve()}
 const body=JSON.stringify({nama:nm,ts:Date.now(),dev,v:47,ringkas:ring(d),data:txt,sas,sasx:sx});busy=true;
 return api('PUT',body,ka&&body.length<60000).then(()=>{last=sig;cloudProg=prog(d);stat('☁️ Tersimpan di cloud · '+jam()+'. '+HINT)})
 .catch(()=>stat('☁️ Belum tersambung ke cloud. Progres aman di perangkat ini.')).then(()=>{busy=false})}

async function init(){
 if(!key){stat('☁️ Tulis namamu, progresmu akan tersimpan di cloud. '+HINT);return}
 try{
  if(ss('kp.fbreset')){await api('DELETE');ss('kp.fbreset',null);cloudProg=0;ok=true;stat('☁️ Progres lama dihapus dari cloud.');return}
  const c=await api('GET'),d=jp(g(KS)),lp=d?prog(d):0;
  if(c&&typeof c.data==='string'){const cd=jp(c.data),cp=cd?prog(cd):0;
   if(cd&&cp>lp&&!ss('kp.fbrl')){const r=ring(cd);
    if(confirm('Ditemukan progres "'+nm+'" di cloud yang lebih maju:\n'+r.lencana+'/24 lencana, '+r.bintang+' bintang, '+r.koin+' koin.\n\nPakai progres dari cloud?\nOK = pakai cloud · Batal = tetap pakai data di perangkat ini')){
     window.NOSAVE=1;s(KS,c.data);if(c.sas)s(KS+':sas',c.sas);if(c.sasx)s('kp.sasx',c.sasx);
     if(g(KS)===c.data){ss('kp.fbrl','1');location.reload();return}window.NOSAVE=0}}
   cloudProg=cp}
  ss('kp.fbrl',null);ok=true;stat('☁️ Cloud tersambung. '+HINT);up()
 }catch(e){stat('☁️ Belum tersambung ke cloud. Progres aman di perangkat ini.')}}

/* tombol "Mulai dari awal": bila dikonfirmasi, catatan cloud ikut dihapus saat halaman dimuat ulang */
document.addEventListener('click',e=>{if(e.target&&e.target.id==='rs'){const oc=window.confirm;window.confirm=function(){const r=oc.apply(this,arguments);window.confirm=oc;if(r)ss('kp.fbreset','1');return r}}},true);

init();
setInterval(()=>{if(!ok){init();return}if(typeof ready!=='undefined'&&ready)up()},10000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)up(true)});
addEventListener('pagehide',()=>up(true));
window.FB={sync:()=>up(),url:DB+'/'+ROOT+'/'+key+'.json'};
})();
