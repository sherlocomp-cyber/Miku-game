/* === BAGIAN: landscape default (v36) === */
/* Kunci landscape dicoba terus: saat dimuat, tiap sentuhan pertama (di atas), tiap kembali ke aplikasi, dan tiap HP berubah tegak.
   Overlay "Putar HP-mu" tidak bisa ditutup langsung; tombol "Tetap tegak" baru muncul setelah 8 detik (jaga-jaga perangkat yang tidak mendukung kunci, mis. iOS). */
(function(){
  const rb=$('#rotb'),mq=matchMedia('(orientation:portrait)');let tm=0;
  const chk=()=>{if(mq.matches){lockLand();if(!tm&&!rotOff)tm=setTimeout(()=>rb.classList.add('on'),8000)}else{clearTimeout(tm);tm=0;rb.classList.remove('on')}};
  (mq.addEventListener?mq.addEventListener('change',chk):mq.addListener(chk));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){lockLand();chk()}});
  lockLand();chk()})();

// ================= SIMPAN / MUAT DATA (CADANGAN KE FILE) =================
// Progres otomatis tersimpan di peramban (localStorage). Cadangan ke file .json dipakai untuk pindah perangkat,
// atau jaga-jaga bila data peramban terhapus. Berkas: {app,v,name,date,data}, data = isi simpanan (lihat save()).
const BKV=1,bkFn=ext=>`${ext}-KotaProfesi-${(NM||'murid').replace(/[^\p{L}\p{N} _-]/gu,'').trim()||'murid'}-${dstr()}.json`;
const bkInfo=()=>lsg('kp.bk')?'Cadangan terakhir: '+lsg('kp.bk'):'Belum pernah dicadangkan ke file.';
const bkHas=d=>!!d&&((d.c|0)>0||(d.lv||[]).some(v=>v>0)||Object.keys(d.st||{}).length>0);
function bkSay(b,t,ms){const o=b.dataset.o||(b.dataset.o=b.textContent);b.textContent=t;if(ms)setTimeout(()=>{b.textContent=o},ms)}
async function bkExport(b){let d=null;try{d=JSON.parse(lsg(SK)||'null')}catch(e){}
if(!bkHas(d)){bkSay(b,'Belum ada data untuk disimpan',2500);return}
const blob=new Blob([JSON.stringify({app:'kota-profesi',v:BKV,name:NM,date:dstr(),data:d})],{type:'application/json'}),fn=bkFn('Data');
try{const r=await kirimBerkas(blob,fn);if(r=='batal'){bkSay(b,b.dataset.o||b.textContent);return}lss('kp.bk',dstr());bkSay(b,'✅ Tersimpan: '+fn,4000);document.querySelectorAll('.bkt').forEach(e=>e.textContent=bkInfo())}catch(e){bkSay(b,'Gagal menyimpan ('+((e&&e.message)||'galat')+')',4000)}}
function bkImport(){const f=document.createElement('input');f.type='file';f.accept='.json,application/json';
f.onchange=()=>{const file=f.files&&f.files[0];if(!file)return;if(file.size>2e6){alert('File terlalu besar untuk data Kota Profesi.');return}
const rd=new FileReader();rd.onerror=()=>alert('File tidak bisa dibaca.');rd.onload=()=>{let o;try{o=JSON.parse(rd.result)}catch(e){alert('File ini bukan data Kota Profesi (isinya rusak).');return}
const d=o&&o.data;if(!o||o.app!=='kota-profesi'||!d||typeof d!='object'||!Array.isArray(d.lv)||!Array.isArray(d.ws)||!d.st||typeof d.st!='object'){alert('File ini bukan cadangan data Kota Profesi.');return}
const nm=String(o.name||'').trim().slice(0,20),key='kotaProfesi.v3'+(nm?':'+nm:'');let cur=null;try{cur=JSON.parse(lsg(key)||'null')}catch(e){}
const nb=d.lv.filter(v=>v>0).length;
if(!confirm(`Muat data "${nm||'murid'}"?\n${nb}/24 lencana, ${d.c|0} koin, dicadangkan ${o.date||'?'}.${bkHas(cur)?'\n\nPERHATIAN: data nama ini di perangkat ini akan ditimpa.':''}`))return;
const txt=JSON.stringify(d);lss(key,txt);if(lsg(key)!==txt){alert('Gagal menyimpan ke perangkat ini (penyimpanan penuh atau diblokir).');return}
lss('kp.name',nm);window.NOSAVE=1;location.reload()};rd.readAsText(file)};f.click()}
function bkBind(root){root.querySelectorAll('.bkx').forEach(b=>b.onclick=()=>bkExport(b));root.querySelectorAll('.bki').forEach(b=>b.onclick=bkImport);root.querySelectorAll('.bkt').forEach(e=>e.textContent=bkInfo())}
bkBind(document);
/* === v30d: fokus dialog & keyboard === */
(function(){const m=$('#modal'),c=$('#card');let prev=null,was=false;
const vis=()=>!!m.style.display&&m.style.display!='none';
new MutationObserver(()=>{const v=vis();
if(v&&!was){prev=document.activeElement;c.focus({preventScroll:true})}
else if(!v&&was){if(prev&&prev.closest&&prev.closest('#stat,#qt')&&document.contains(prev))prev.focus({preventScroll:true});else if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();prev=null}
was=v}).observe(m,{attributes:true,attributeFilter:['style']});
new MutationObserver(()=>{if(vis()&&!c.contains(document.activeElement))c.focus({preventScroll:true})}).observe(c,{childList:true});
m.addEventListener('keydown',e=>{if(e.key!='Tab')return;
const f=[...c.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea,[tabindex="0"]')].filter(x=>x.offsetParent!==null);
if(!f.length){e.preventDefault();return}
const a=f[0],z=f[f.length-1],cur=document.activeElement;
if(e.shiftKey&&(cur===a||cur===c)){e.preventDefault();z.focus()}else if(!e.shiftKey&&cur===z){e.preventDefault();a.focus()}});
$('#nm').addEventListener('input',()=>{$('#nme').textContent='';$('#nm').removeAttribute('aria-invalid');$('#nm').style.borderColor=''});
$('#qt').addEventListener('keydown',e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();e.stopPropagation();if(!open)book()}});
if(matchMedia('(pointer:fine)').matches)setTimeout(()=>{const n=$('#nm');if(n&&$('#st').style.display!='none')n.focus()},300)})();
