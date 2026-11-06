// ================= MULAI =================
Promise.all([document.fonts.load("700 40px Amiri"),document.fonts.load("700 30px \"Baloo 2\"")]).catch(()=>0).then(()=>{build();extras();items();try{detailPack()}catch(e){console.warn('detailPack',e)}
const sv=load();if(sv){coins=sv.c|0;(sv.lv||[]).forEach((v,i)=>{const p=pois[i];if(p&&v>0){p.lv=Math.min(3,v|0);mkc(p)}});
if(Array.isArray(sv.ws))sv.ws.forEach((v,i)=>{if(i<24)G.ws[i]=v|0});if(sv.st)G.st=sv.st;(sv.seen||[]).forEach(x=>G.seen.add(x));(sv.md||[]).forEach(x=>G.md.add(x));if(sv.stb)G.stb=sv.stb;if(sv.q!=null)G.q=sv.q|0;if(Array.isArray(sv.own))G.own=sv.own;if(sv.cur!=null)G.cur=sv.cur|0;if(sv.day)G.day=Object.assign(G.day,sv.day);if(sv.kw)G.kw=sv.kw|0;if(Array.isArray(sv.rf))G.rf=sv.rf;if(Array.isArray(sv.rw))G.rw=sv.rw;if(Array.isArray(sv.dx))G.dx=sv.dx;if(sv.hero)Object.assign(G.hero,sv.hero);if(sv.hs)G.hs=1;if(Array.isArray(sv.oa))G.oa=sv.oa;if(sv.lt&&typeof sv.lt=='object')G.lt=sv.lt;if(sv.tmo)G.tmo=1;if(sv.bn&&typeof sv.bn=='object')G.bn=sv.bn;if(sv.rvd)G.rvd=sv.rvd;if(sv.rvp)G.rvp=sv.rvp;if(sv.rvn)G.rvn=sv.rvn|0;if(sv.dlg&&typeof sv.dlg=='object')G.dlg=sv.dlg;if(sv.mg&&typeof sv.mg=='object')G.mg=sv.mg;if(sv.ex&&typeof sv.ex=='object')G.ex=sv.ex;
const nb=pois.filter(p=>p.lv>0).length;
if(nb||coins){$('#svi').innerHTML=`Progres tersimpan: ${nb}/24 lencana, ${cntLv(3)} bintang emas, ${coins} koin, misi ${G.q}/${QS.length}. <button id="rs">Mulai dari awal</button>`;$('#rs').onclick=()=>{if(!confirm('Hapus semua progres dan mulai dari awal?'))return;try{localStorage.removeItem(SK)}catch(e){}location.reload()}}}
HERO();wear(G.cur);startCele=checkQuests();ready=true;hud();loop();$('#nm').value=NM;chkV();showVn();try{if(sessionStorage.getItem('kp.auto')){sessionStorage.removeItem('kp.auto');$('#sb').click()}}catch(e){}try{speechSynthesis.onvoiceschanged=()=>{chkV();showVn()}}catch(e){}});
/* === BAGIAN: mini game Pasangan Profesi === */
/* Kartu memori: cocokkan kata Arab profesi dengan gambar + arti Indonesia.
   Dipasang setelah game.js (satu skrip, jadi D, G, coins, open, mode, say, snd, sh, hud dipakai langsung).
   Tidak memengaruhi akurasi laporan (tidak memanggil rec). Data: G.mg = {best:{lv:bintang}, bd:{lv:tanggal bonus}}. */
const MGL=[{k:'e',n:'Mudah',p:4,b:10},{k:'s',n:'Sedang',p:6,b:20},{k:'h',n:'Sulit',p:8,b:30}];
function mgStars(p,m){return m<=p+1?3:m<=Math.ceil(p*1.5)?2:1}
function mgPick(n){
  const idx=D.map((_,k)=>k),weak=sh(idx.filter(k=>G.ws[k]<3)),pick=[],em=new Set();
  const add=k=>{if(pick.length<n&&!pick.includes(k)&&!em.has(D[k].e)){pick.push(k);em.add(D[k].e)}};
  weak.slice(0,Math.ceil(n/2)).forEach(add);
  sh(idx).forEach(add);
  return pick}
function miniGame(){
  if(open)return;open=true;mode='mini';
  const m=$('#modal'),c=$('#card');m.style.display='flex';
  const close=()=>{m.style.display='none';open=false;mode=null};
  G.mg=G.mg||{best:{},bd:{}};G.mg.best=G.mg.best||{};G.mg.bd=G.mg.bd||{};
  function menu(){
    c.scrollTop=0;
    c.innerHTML=`<h2>🃏 Pasangan Profesi</h2><div class="fc">Balik dua kartu. Cocokkan <b>kata Arab</b> 🔊 dengan <b>gambar profesinya</b>. Semakin sedikit langkah, semakin banyak bintang ⭐</div>`
    +MGL.map(l=>{const b=G.mg.best[l.k]||0;return `<button class="opt" data-l="${l.k}">${l.n} · ${l.p} pasang <span style="float:right">${b?'⭐'.repeat(b):'—'}</span></button>`}).join('')
    +`<div class="ex">🪙 Bonus koin sekali sehari per tingkat (selesai dengan benar).</div><button class="opt" id="mgx">✖ Tutup</button>`;
    c.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>play(MGL.find(l=>l.k==b.dataset.l)));
    $('#mgx').onclick=close}
  function play(L){
    const pk=mgPick(L.p),cards=sh(pk.flatMap(k=>[{k,t:'a'},{k,t:'e'}]));
    let first=null,lock=false,moves=0,found=0;
    c.scrollTop=0;
    c.innerHTML=`<div class="stp">${L.n} · <span id="mgm">0</span> langkah · <span id="mgf">0</span>/${L.p} pasang</div><div class="mgg">${cards.map((x,i)=>{const d=D[x.k];return `<button class="mgc" data-i="${i}" aria-label="Kartu ${i+1}"><span class="mgb">🦉</span><span class="mgf ${x.t=='a'?'ar':''}">${x.t=='a'?d.ar:`<i>${d.e}</i><small>${d.id}</small>`}</span></button>`}).join('')}</div><button class="opt" id="mgb2">◀ Ganti tingkat</button>`;
    const els=[...c.querySelectorAll('.mgc')];
    $('#mgb2').onclick=menu;
    els.forEach((b,i)=>b.onclick=()=>{
      if(lock||b.classList.contains('up')||b.classList.contains('mt'))return;
      b.classList.add('up');if(cards[i].t=='a')say(D[cards[i].k].ar);snd(660,.06,'triangle');
      if(first==null){first=i;return}
      const j=first;first=null;moves++;$('#mgm').textContent=moves;
      if(cards[j].k===cards[i].k){
        found++;$('#mgf').textContent=found;els[j].classList.add('mt');els[i].classList.add('mt');snd(988,.12,'triangle');
        if(found==L.p)setTimeout(fin,450)}
      else{lock=true;snd(200,.15,'sawtooth');setTimeout(()=>{els[j].classList.remove('up');els[i].classList.remove('up');lock=false},950)}});
    function fin(){
      const st=mgStars(L.p,moves);let bn=0;const t=dstr();
      if((G.mg.best[L.k]||0)<st)G.mg.best[L.k]=st;
      if(G.mg.bd[L.k]!==t){G.mg.bd[L.k]=t;bn=L.b;coins+=bn}
      const am=checkMissions();hud();snd(880,.2,'triangle');
      if(!els[0].isConnected||mode!='mini')return; /* pemain sudah ke menu/tutup saat jeda: jangan timpa layar */
      c.scrollTop=0;
      c.innerHTML=`<h2>🎉 Hebat!</h2><div class="q" style="text-align:center;font-size:34px">${'⭐'.repeat(st)}${'☆'.repeat(3-st)}</div><div class="fc">${L.p} pasang dalam <b>${moves}</b> langkah.${bn?` +${bn} 🪙 (bonus hari ini)`:''}</div>${am.length?`<div class="ex">🏅 Pencapaian: ${am.map(x=>`<b>${x.t}</b> (+${x.r} 🪙)`).join(', ')}</div>`:''}<div class="mgl">${pk.map(k=>`<button class="opt ar" data-s="${D[k].ar}">${D[k].e} ${D[k].ar} 🔊</button>`).join('')}</div><button class="opt go" id="ag">🔁 Main lagi</button><button class="opt" id="mn">◀ Ganti tingkat</button><button class="opt" id="mgx">✖ Tutup</button>`;
      c.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>say(b.dataset.s));
      $('#ag').onclick=()=>play(L);$('#mn').onclick=menu;$('#mgx').onclick=close}
  }
  menu()}
$('#mgb').onclick=()=>{if(!open&&ready)miniGame()};
addEventListener('keydown',e=>{if(mode=='mini'&&e.key=='Escape'){$('#modal').style.display='none';open=false;mode=null}});
