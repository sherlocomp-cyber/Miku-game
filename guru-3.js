function mkDemo(){
 let seed=11;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
 const P=[['Aisyah 4A',.93,130,.92,0,'win'],['Budi 4A',.76,72,.6,1,''],['Citra 4A',.55,66,.28,2,'over'],['Dimas 4B',.63,50,.4,6,'gate'],['Eka 4B',0,0,0,null,'new'],['Farhan 4B',.46,34,.2,15,''],['Gita 4B',.84,95,.72,0,'gender'],['Hana 4A',.68,58,.5,3,'']];
 const out={};
 P.forEach(([nm,a,tot,wm,ago,sp])=>{
  const st={},keys=TOP.map(t=>t[0]);let rest=tot;
  keys.forEach((k,i)=>{const n=i===keys.length-1?rest:Math.round(tot/8*(.6+R()*.8));rest-=n;let p=a+(R()-.5)*.2;if(sp==='gender'&&(k==='mf'||k==='mt'))p=.5;if(sp==='over'&&k==='sk')p=.3;if(sp==='gate'&&k==='tr')p=.4;p=Math.max(0,Math.min(1,p));const nn=Math.max(0,n);st[k]={n:nn,ok:Math.round(nn*p)}});
  if(!tot)keys.forEach(k=>delete st[k]);
  const ws=D.map(d=>{let m=wm;if(sp==='gender'&&d.g==='f')m=wm*.45;return Math.round(Math.min(9,Math.max(0,m*3.4+(R()-.5)*2)))});
  const lv=D.map(d=>{const v=R()<wm?(R()<a?3:2):(R()<.4?1:0);return tot?v:0});
  const rf=[];if(tot>20)for(let i=0;i<6;i++){const ok=Math.round(5*a+(R()-.5)*3),okc=Math.max(0,Math.min(5,ok));const v=sp==='over'?(R()<.7?3:2):okc>=4?3:okc>=2?2:1;rf.push({p:D[i].pl,v,ok:okc,n:5,d:today()})}
  const gt=sp==='gate'?4:0,lt={};if(tot>10)for(let i=0;i<20;i++)lt['v:'+i]={b:Math.round(R()*3*a),due:R()<.4?today():'2999-01-01'};
  const dd={c:Math.round(tot*4),lv,ws,st,seen:[],md:tot>60?['l','a1','a2','a3','s']:tot>10?['a1']:[],stb:{mf:Math.round(a*5),mt:Math.round(a*5),pj:Math.round(a*5)},q:Math.min(14,Math.floor(tot/10)),own:[0],rf,rw:a>.8?[0,1,2]:a>.6?[0]:[],dx:tot>15?[{ok:Math.round(a*3),d:today()},{ok:Math.round(a*5),d:today()}]:[],kw:Math.round(tot/12),lt,dlg:{},mg:{best:{}},rvn:sp==='over'?0:Math.round(tot/25),rvd:today(),ex:tot>40?{try:sp==='win'?3:1,win:sp==='win'?1:0,best:sp==='win'?40:Math.round(a*28),last:{ok:Math.round(a*28),d:today()}}:null};
  const sas={st:{},M:{},sim:{best:0,tries:0}};
  if(tot>30){ST.forEach(([id],i)=>{const done=sp==='gate'?i<3:a>.6?i<(a>.9?7:5):i<2;sas.st[id]={pr:1,best:done?9:Math.round(a*7),done:done?1:0,gt:sp==='gate'&&i===3?4:done?1:0,seen:1}});
   ['v','mf','mt','pj','sk','tr2'].forEach(k=>{const n=10+Math.round(R()*10);sas.M['t:'+k]={ok:Math.round(n*(a+(R()-.5)*.2)),n,s:2}});
   sas.sim={best:Math.round(a*95),tries:sp==='gate'?3:1,last:{pct:Math.round(a*90),d:today()}}}
  const key=nm.toLowerCase().replace(/[.#$\[\]\/\s]+/g,'_');
  out[key]={nama:nm,ts:ago==null?0:Date.now()-ago*864e5-R()*36e5,v:47,data:JSON.stringify(dd),sas:JSON.stringify(sas),sasx:tot>60?JSON.stringify({nilai:Math.round(a*92),a:Math.round(a*20),b:Math.round(a*10),c:Math.round(a*5),d:today()}):''};
  if(!out[key].ts)delete out[key].ts});
 return out}
/*DEMO-END*/

/* ================= UI ================= */
const $=s=>document.querySelector(s);
const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}};
const cfg=Object.assign({db:DEF_DB,roster:'',auto:0,apiKey:'',email:''},jp(LS('rg.cfg'))||{});
let tok=null,refTok=null,tokExp=0;
async function login(pw){
 const r=await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+encodeURIComponent(cfg.apiKey),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:cfg.email,password:pw,returnSecureToken:true})});
 const j=await r.json().catch(()=>({}));
 if(!r.ok){const m=(j.error&&j.error.message)||String(r.status);throw new Error('Login gagal ('+m+'). '+(/INVALID_LOGIN|INVALID_PASSWORD|EMAIL_NOT_FOUND/.test(m)?'Periksa email dan kata sandi.':/API_KEY/.test(m)?'Periksa Web API Key.':/OPERATION_NOT_ALLOWED/.test(m)?'Aktifkan metode Email/Password di Firebase Authentication.':''))}
 tok=j.idToken;refTok=j.refreshToken;tokExp=Date.now()+num(j.expiresIn,3600)*1000}
async function getTok(){
 if(!tok)return null;
 if(Date.now()>tokExp-60000&&refTok){
  const r=await fetch('https://securetoken.googleapis.com/v1/token?key='+encodeURIComponent(cfg.apiKey),{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=refresh_token&refresh_token='+encodeURIComponent(refTok)});
  const j=await r.json().catch(()=>({}));
  if(!r.ok){tok=null;refTok=null;throw new Error('Sesi login berakhir. Masuk lagi di tab Pengaturan.')}
  tok=j.id_token;refTok=j.refresh_token;tokExp=Date.now()+num(j.expires_in,3600)*1000}
 return tok}
const S={recs:{},L:[],tab:'ring',sel:null,kelas:'',q:'',sort:'attn',src:'',at:0,err:'',demo:false,busy:false};
let hist=jp(LS('rg.hist'))||{},notes=jp(LS('rg.notes'))||{},logs=jp(LS('rg.log'))||{},timer=0;
const ago=ts=>{if(!ts)return'tidak diketahui';const m=Math.floor((Date.now()-ts)/6e4);if(m<1)return'baru saja';if(m<60)return m+' mnt lalu';const h=Math.floor(m/60);if(h<24)return h+' jam lalu';return Math.floor(h/24)+' hari lalu'};
const dt=ts=>ts?new Date(ts).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'}):'-';
const pc=v=>v==null?'-':v+'%';
const bar=(v,col)=>`<div class="bar"><i style="width:${Math.max(0,Math.min(100,v||0))}%;background:${col||accCol(v)}"></i></div>`;
const chipC=c=>c==='Mahir'?'ok':c==='Berkembang'?'md':c==='Perlu bimbingan'?'lo':'gr';
const actC=a=>a==='aktif'?'ok':a==='jarang'?'md':a==='tidak aktif'?'lo':'gr';

function ingest(obj,label,demo){
 const recs=normalizeRecords(obj,()=>prompt('Nama siswa untuk berkas ini (mis. Ahmad 4A):')||'');
 S.recs=recs;S.L=Object.keys(recs).map(k=>parseStudent(k,recs[k]));
 S.src=label;S.at=Date.now();S.err='';S.demo=!!demo;classStats(S.L);
 if(!demo){histUpdate();LS('rg.cache',JSON.stringify({at:S.at,recs}))}
 render()}
function histUpdate(){
 const d=today();S.L.forEach(s=>{const h=hist[s.key]||(hist[s.key]={});h[d]={tot:s.tot,ok:s.ok,skor:s.skor,ws:s.wsM,ts:s.ts};const ks=Object.keys(h).sort();while(ks.length>90)delete h[ks.shift()]});
 LS('rg.hist',JSON.stringify(hist))}
async function refresh(){
 if(S.busy)return;S.busy=true;S.err='';render();
 try{const c=new AbortController(),t=setTimeout(()=>c.abort(),15000);
  const tk=await getTok();
  const r=await fetch(cfg.db.replace(/\/$/,'')+'/'+ROOT+'.json'+(tk?'?auth='+encodeURIComponent(tk):''),{signal:c.signal});clearTimeout(t);
  if(!r.ok)throw new Error(r.status===401||r.status===403?(tk?'Akun guru ini belum diizinkan membaca /siswa oleh aturan Firebase (HTTP '+r.status+'). Periksa aturan di tab Pengaturan.':'Daftar /siswa dikunci oleh aturan Firebase (HTTP '+r.status+'). Ubah aturan Firebase agar .read pada siswa bernilai true, atau pakai Impor berkas di tab Pengaturan.'):'Firebase menjawab HTTP '+r.status+'.');
  const o=await r.json();try{const rp=await fetch(cfg.db.replace(/\/$/,'')+'/online.json'+(tk?'?auth='+encodeURIComponent(tk):''));S.pres=rp.ok?((await rp.json())||{}):{}}catch(e){S.pres={}}S.busy=false;ingest(o||{},'Firebase (langsung)',false)}
 catch(e){S.busy=false;S.err=(e&&e.name==='AbortError')?'Waktu habis saat menghubungi Firebase. Periksa koneksi internet.':String((e&&e.message)||e);
  const c=jp(LS('rg.cache'));if(c&&c.recs&&!S.L.length){S.recs=c.recs;S.L=Object.keys(c.recs).map(k=>parseStudent(k,c.recs[k]));S.src='Salinan terakhir di perangkat ini';S.at=c.at;classStats(S.L)}
  render()}}
function setAuto(){clearInterval(timer);if(cfg.auto>0)timer=setInterval(()=>{if(!document.hidden&&!S.demo)refresh()},cfg.auto*1000)}
const saveCfg=()=>LS('rg.cfg',JSON.stringify(cfg));
const kelasList=()=>[...new Set(S.L.map(s=>s.kelas||'(tanpa kelas)'))].sort();
const view=()=>S.L.filter(s=>(!S.kelas||(s.kelas||'(tanpa kelas)')===S.kelas));

/* ---------- komponen ---------- */
function radar(vals,labs){const n=vals.length,cx=130,cy=120,R=80,P=(i,r)=>{const a=-Math.PI/2+i*2*Math.PI/n;return[cx+Math.cos(a)*r,cy+Math.sin(a)*r]},f=p=>p.map(x=>x.toFixed(1)).join(',');
 let g='';[.25,.5,.75,1].forEach(k=>{g+=`<polygon points="${vals.map((_,i)=>f(P(i,R*k))).join(' ')}" fill="none" stroke="#e3dfd2"/>`});
 vals.forEach((_,i)=>{const p=P(i,R),l=P(i,R+17);g+=`<line x1="${cx}" y1="${cy}" x2="${p[0].toFixed(1)}" y2="${p[1].toFixed(1)}" stroke="#e3dfd2"/><text x="${l[0].toFixed(1)}" y="${l[1].toFixed(1)}" font-size="10" text-anchor="middle" dominant-baseline="middle" fill="#555">${esc(labs[i])}</text>`});
 g+=`<polygon points="${vals.map((v,i)=>f(P(i,R*(v||0)/100))).join(' ')}" fill="rgba(61,90,254,.25)" stroke="#3d5afe" stroke-width="2"/>`;
 return`<svg viewBox="0 0 260 240" width="300" role="img" aria-label="Radar ketercapaian per topik">${g}</svg>`}
function spark(a){if(a.length<2)return'';const w=180,h=40,mx=Math.max(...a),mn=Math.min(...a),r=mx-mn||1;return`<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><polyline fill="none" stroke="#3d5afe" stroke-width="2" points="${a.map((v,i)=>((i/(a.length-1))*(w-4)+2).toFixed(1)+','+(h-3-((v-mn)/r)*(h-8)).toFixed(1)).join(' ')}"/></svg>`}
const flagsH=L=>L.length?L.map(f=>`<div class="flag ${f.lv}">${esc(f.t)}</div>`).join(''):'<div class="mut sm">Tidak ada catatan perhatian khusus.</div>';

/* ---------- tampilan: ringkasan ---------- */
