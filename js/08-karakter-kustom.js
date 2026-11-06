// ================= KARAKTER: layar kustomisasi =================
const CCT=[['bd','👤 Tubuh'],['r','💇 Rambut'],['p','👕 Baju'],['h','🎩 Topi'],['f','👓 Wajah'],['n','🧣 Leher'],['k','🎒 Punggung'],['w','🎈 Tangan'],['pf','👷 Profesi']];
let ccT='bd',ccCb=null;
const ccSw=(arr,cur,pre,nm)=>arr.map((c,i)=>`<button class="swc${cur==i?' on':''}" data-c="${pre}:${i}" style="background:${hx(c)}" aria-label="${nm?nm[i]:pre+' '+(i+1)}"></button>`).join('');
function ccR(keep){
 const h=G.hero,b=$('#ccbody'),st=b.scrollTop,t=ccT,w=h.a||{};
 $('#ccn').textContent='👤 '+(NM||'Petualang');$('#ccc').textContent='🪙 '+coins;
 $('#cct').innerHTML=CCT.map(x=>`<button class="ct${x[0]==t?' on':''}" data-t="${x[0]}">${x[1]}</button>`).join('');
 let s='';
 if(t=='bd')s=`<div class="gt">Gender</div><div class="rw"><button class="ch${h.g=='m'?' on':''}" data-c="g:m">👦 Laki-laki<br><span class="ar">وَلَدٌ</span></button><button class="ch${h.g=='f'?' on':''}" data-c="g:f">👧 Perempuan<br><span class="ar">بِنْتٌ</span></button></div><div class="ex ar" style="text-align:center;font-size:26px;padding:2px">أَنَا ${h.g=='f'?'بِنْتٌ':'وَلَدٌ'}</div><div class="gt">Warna kulit</div><div class="rw">${ccSw(SKN,h.sk,'sk')}</div><div class="gt">Warna mata</div><div class="rw">${ccSw(EYC,h.ey,'ey')}</div>`;
 else if(t=='r')s=`<div class="gt">Model rambut</div><div class="gr">${HSN.map((n,i)=>`<button class="tl${h.hs==i?' on':''}" data-c="hs:${i}">${n}</button>`).join('')}</div><div class="gt">Warna rambut</div><div class="rw">${ccSw(HRC,h.hc,'hc',HRN)}</div>`+(String(w.h).startsWith('hj')?'<div class="ex">🧕 Hijab sedang dipakai, jadi rambut tertutup.</div>':'');
 else if(t=='p')s=`<div class="gt">Warna baju (tukar koin)</div><div class="gr">${OUT.map((o,i)=>{const own=G.own.includes(i),cur=G.cur==i;return`<button class="tl${cur?' on':''}${!own&&coins<o.p?' lk':''}" data-c="o:${i}"><i class="dot" style="background:${hx(o.c)}"></i>${o.n}<small>${cur?'Dipakai':own?'Punya':o.p+' 🪙'}</small></button>`}).join('')}</div><div class="gt">Warna celana</div><div class="rw">${ccSw(PCC,h.pc,'pc')}</div><div class="gt">Warna sepatu</div><div class="rw">${ccSw(SCC,h.sc,'sc')}</div>`;
 else if(t=='pf')s=`<div class="gt">Seragam profesi lengkap dengan aksesorisnya</div><div class="ex">Raih lencana dari warga untuk membuka seragam profesinya, lalu pakai di sini. Seragam menggantikan baju dan aksesoris biasa.</div><div class="gr"><button class="tl${h.pf==null?' on':''}" data-c="pf:-"><b>🚫</b>Lepas<small>baju biasa</small></button>${PFG.map((gr,gi)=>{const d=D[pfIdx(gr,h.g)],op=pfOpen(gr),on=h.pf===gi;return`<button class="tl${on?' on':''}${op?'':' lk'}" data-c="pf:${gi}"><b>${d.e}</b>${pfName(gr.k)}<small>${on?'Dipakai':op?'Pakai':'🔒 Lencana '+d.pl}</small></button>`}).join('')}</div>`;
 else{const L=ACC.filter(a=>a.s==t).sort((a,b)=>a.p-b.p);s=(h.pf!=null?'<div class="ex">👷 Seragam profesi sedang dipakai, jadi aksesoris biasa disembunyikan. Lepas seragam di tab Profesi.</div>':'')+`<div class="gt">${L.length} pilihan · koinmu 🪙 ${coins}</div><div class="ex">Makin langka, makin mahal: Biasa 25 · Keren 50 · Langka 100 · Epik 200 · Legenda 350 🪙. Urut dari termurah.</div><div class="gr"><button class="tl" data-c="a:${t}:-"><b>🚫</b>Lepas<small>kosong</small></button>${L.map(a=>{const on=w[t]==a.id,own=!a.p||G.oa.includes(a.id);return`<button class="tl${on?' on':''}${!on&&!own&&coins<a.p?' lk':''}" data-r="${kTier(a)}" data-c="a:${t}:${a.id}"><b>${a.e}</b>${a.n}<small>${on?'Dipakai':own?'Pakai':a.p+' 🪙'}</small>${kTier(a)?`<span class="rr">${kTN[kTier(a)]}</span>`:''}</button>`}).join('')}</div>`}
 b.innerHTML=s;b.scrollTop=keep===false?0:st}
function ccDo(s){const h=G.hero,i=s.indexOf(':'),k=s.slice(0,i),v=s.slice(i+1);
  if(k=='pf'){if(v=='-'){delete h.pf;snd(660,.08,'triangle')}else{const gi=+v,gr=PFG[gi];if(!gr)return;if(!pfOpen(gr)){snd(180,.2,'sawtooth');return}if(h.pf===gi){delete h.pf;snd(660,.08,'triangle')}else{h.pf=gi;snd(988,.15,'triangle');checkMissions();hud()}}}
 else if(k=='g'){const d=h.hs==(h.g=='f'?5:0);h.g=v;if(d)h.hs=v=='f'?5:0;snd(660,.08,'triangle')}
 else if(k=='o')buy(+v);
 else if(k=='a'){const[sl,id]=v.split(':');if(!h.a)h.a={};
  if(id=='-')delete h.a[sl];
  else{const a=ACC.find(x=>x.id==id);if(!a)return;const own=!a.p||G.oa.includes(id);
   if(h.a[sl]==id)delete h.a[sl];
   else if(own){h.a[sl]=id;snd(660,.08,'triangle')}
   else if(coins>=a.p){coins-=a.p;G.oa.push(id);h.a[sl]=id;hud();snd(988,.15,'triangle');try{if(a.p>=200)confetti()}catch(e){}}
   else{snd(180,.2,'sawtooth');return}}}
 else{h[k]=+v;snd(520,.06,'triangle')}
 HERO();ccR()}
function ccOpen(cb){ccCb=cb||null;ccT='bd';document.body.classList.add('cc');$('#cc').classList.add('on');CV={a:0};open=true;HERO();ccR(false)}
function ccClose(){G.hs=1;save();document.body.classList.remove('cc');$('#cc').classList.remove('on');CV=null;cam.clearViewOffset();cam.updateProjectionMatrix();P.rotation.y=0;snd(660,.1,'triangle');
 const cb=ccCb;ccCb=null;if(cb)cb();else open=false}
$('#cct').onclick=e=>{const b=e.target.closest('[data-t]');if(b){ccT=b.dataset.t;ccR(false)}};
$('#ccbody').onclick=e=>{const b=e.target.closest('[data-c]');if(b)ccDo(b.dataset.c)};
$('#ccd').onclick=ccClose;
$('#ccb').onclick=()=>{if(!open&&ready)ccOpen(null)};
$('#ccr').onclick=()=>{const h=G.hero,r=n=>(Math.random()*n)|0;h.sk=r(SKN.length);h.hc=r(HRC.length);h.hs=r(HSN.length);h.ey=r(EYC.length);h.pc=r(PCC.length);h.sc=r(SCC.length);G.cur=G.own[r(G.own.length)];
 const ow=ACC.filter(a=>!a.p||G.oa.includes(a.id));h.a={};['h','f','n','k','w'].forEach(sl=>{if(Math.random()<.6){const l=ow.filter(a=>a.s==sl);if(l.length)h.a[sl]=l[r(l.length)].id}});snd(740,.1,'triangle');HERO();ccR(false)};
