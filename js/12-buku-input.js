// ================= BUKU: MISI / KOSAKATA / TATA BAHASA =================
function book(tab='m'){open=true;mode='book';const m=$('#modal'),c=$('#card');m.style.display='flex';
const tabs=[['m','🎯 Misi'],['k','📖 Kata'],['g','🧠 Tata'],['s','🛍️ Toko'],['r','📊 Laporan'],['w','🌍 Dunia Nyata']];
function body(){
if(tab=='m'){const q=QS[G.q],ok=dayOk();
let h=`<div class="mi"><b>🏅 ${rank()}</b> · 🎯 Menuju bonus ${ok}/10 · total ${tc()} benar<div class="bar"><i style="width:${Math.min(100,ok*10)}%"></i></div></div>`;
h+=q?`<div class="gt">🎯 Misi sekarang (${G.q+1}/${QS.length})</div><div class="mi" style="border:3px solid var(--sun)"><b>${q.t}</b> <small>+${q.r} 🪙</small><br><small>${q.d}</small><div class="bar"><i style="width:${Math.min(q.v(),q.g)/q.g*100}%"></i></div><small>${Math.min(q.v(),q.g)}/${q.g} · Ikuti panah kuning di kiri atas.</small></div>`:`<div class="mi done"><b>🏆 Semua misi selesai! Kamu Juara Kota!</b></div>`;
h+=`<div class="gt">Peta petualangan</div>`+QS.map((x,i)=>`<div class="vr2">${i<G.q?'✅':i==G.q?'▶️':'🔒'} <b>${x.t}</b> <small>${x.s}</small></div>`).join('');
h+=`<div class="gt">Pencapaian (${MS.filter(x=>G.md.has(x.id)).length}/${MS.length})</div>`+MS.map(x=>{const v=Math.min(x.v(),x.g),dn=G.md.has(x.id);return`<div class="mi${dn?' done':''}"><div><b>${dn?'✅ ':(x.i||'🏅')+' '}${x.t}</b> <small>+${x.r} 🪙</small></div><small>${x.d}</small><div class="bar"><i style="width:${v/x.g*100}%"></i></div><small>${v}/${x.g}</small></div>`}).join('');
return h+`<div class="ex">Warna penanda warga: 🟡 belum · 🟢 lencana · 🔵 ⭐⭐ · 🟣 ⭐⭐⭐. Kata dikuasai setelah 3 kali dijawab benar.</div>`}
if(tab=='k')return`<div class="gt">Dikuasai: ${cntWs()}/24 kata · Temukan lebih banyak lewat kotak ? dan kuis.</div>`+D.map((d,k)=>`<div class="vr"><span>${d.e}</span><span class="ar">${d.ar}</span><span>${d.id}</span><span>${G.ws[k]>=3?'⭐':'●'.repeat(G.ws[k])||'·'}</span><button class="opt spk" data-s="${k}" aria-label="Dengarkan">🔊</button></div>`).join('');
if(tab=='s')return`<div class="gt">Tukar koinmu (🪙 ${coins}) dengan kostum!</div>`+OUT.map((o,i)=>{const own=G.own.includes(i),cur=G.cur==i;return`<div class="vr2"><span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:#${o.c.toString(16).padStart(6,'0')};border:2px solid var(--ink)"></span><b>${o.n}</b><button class="opt spk" data-b="${i}" ${cur?'disabled':''}>${cur?'Dipakai':own?'Pakai':`Beli ${o.p} 🪙`}</button></div>`}).join('');
if(tab=='r')return RPT();if(tab=='w')return RW();
return GR.mf+GR.mt+GR.pj+GR.sk}
function render(){c.innerHTML=`<div class="tabs">${tabs.map(t=>`<button class="opt${t[0]==tab?' on':''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div>${body()}</div><button class="opt go" id="x">Tutup</button>`;
c.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;render()});
c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>say(D[+b.dataset.s].ar));c.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{buy(+b.dataset.b);render()});bindSp(c);bindX(c);c.scrollTop=0;
$('#x').onclick=closeBook}
render()}
function closeBook(){$('#modal').style.display='none';open=false;mode=null}
$('#bkb').onclick=()=>{if(!open)book()};$('#rvb').onclick=()=>{if(!open&&ready)quiz({kind:'st',k:'ul',t:'🔁 Kuis Ulang Harian',ar:'مُرَاجَعَة'})};$('#qt').onclick=()=>{if(!open)book()};

// ================= INPUT =================
const key={};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();key[k]=1;
if(mode=='quiz'||mode=='kilat'){const n=+e.key;if(n>=1&&n<=4){const b=document.querySelectorAll('#card .opt[data-i]:not(:disabled)')[n-1];if(b)b.click()}
if(k=='enter'){const b=$('#nx')||$('#ms')||$('#x');if(b)b.click()}}
else if(mode=='book'||mode=='cele'){if(k=='escape'||k=='m'||k=='enter')closeBook()}
else if(k=='f')vtoggle();
else if(k=='e'){if(!RID)talk()}
else if(k=='m'&&!open)book();
if(k=='enter'&&$('#st').style.display!='none')$('#sb').click();
if((k==' '||k.startsWith('arrow'))&&!/INPUT|TEXTAREA/.test(e.target.tagName))e.preventDefault()});
addEventListener('keyup',e=>key[e.key.toLowerCase()]=0);
addEventListener('blur',()=>{for(const k in key)key[k]=0});
let jx=0,jy=0,jid=null;const js=$('#js'),kn=$('#kn');
function jm(e){const r=js.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const l=Math.hypot(dx,dy),m=58;if(l>m){dx*=m/l;dy*=m/l}
jx=dx/m;jy=-dy/m;kn.style.transform=`translate(${dx}px,${dy}px)`}
js.addEventListener('pointerdown',e=>{jid=e.pointerId;js.setPointerCapture(jid);jm(e)});
js.addEventListener('pointermove',e=>{if(e.pointerId==jid)jm(e)});
const je=e=>{if(e.pointerId==jid){jid=null;jx=jy=0;kn.style.transform=''}};js.addEventListener('pointerup',je);js.addEventListener('pointercancel',je);
let drag=null;const cv=$('#c');
cv.addEventListener('pointerdown',e=>{const r=js.getBoundingClientRect(),pd=60;if(e.clientX>r.left-pd&&e.clientX<r.right+pd&&e.clientY>r.top-pd&&e.clientY<r.bottom+pd){if(jid===null){jid=e.pointerId;cv.setPointerCapture(jid);jm(e)}return}drag=e.clientX;cv.setPointerCapture(e.pointerId)});
cv.addEventListener('pointermove',e=>{if(e.pointerId==jid){jm(e);return}if(drag!==null){pl.yaw-=(e.clientX-drag)*.006;drag=e.clientX}});
cv.addEventListener('pointerup',e=>{if(e.pointerId==jid)je(e);else drag=null});cv.addEventListener('pointercancel',e=>{if(e.pointerId==jid)je(e);else drag=null});
function talk(){if(near&&!open)quiz(near)}
$('#act').onclick=()=>{if(!RID)talk()};
