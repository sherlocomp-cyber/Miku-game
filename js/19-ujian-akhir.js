/* === BAGIAN: ujian akhir 40 soal (menara jawaban) === */
/* Ujian Akhir: 40 soal, 10 detik per soal.
   4 pilar jawaban di bawah kaki pemain, papan mading di depannya berisi soal.
   Benar  -> pilar jawaban naik, pemain ikut naik (sampai ke langit).
   Salah / waktu habis -> pilar runtuh, pemain jatuh, terbangun di Rumah Sakit (profesi dokter).
   40 benar -> piala besar di atas awan.
   Bank soal memakai gen() yang sama dengan pos & kuis (tanpa rec(), jadi Laporan tidak berubah).
   Data tersimpan: G.ex = {try, win, best, last:{ok,d}}. Dibungkus IIFE agar tidak bentrok nama. */
(function(){
const EXN=40,EXS=10,EXH=3.2,AZ=900,BY=8.4;
const ZN=[['Zona 1','Kosakata profesi, tempat & kegiatan','Mengingat (C1)','#2fa56b'],['Zona 2','Dhamir munfasil & muttasil','Memahami (C2)','#3d82e0'],['Zona 3','Tanya-jawab & cita-cita','Menerapkan (C3)','#e0a43a'],['Zona 4','Terjemah & susun kalimat','Menganalisis (C4)','#9b6bd6']];
/* kisi-kisi: [tipe, jumlah] per zona; v=kosakata, kt=tempat/kegiatan, mf=munfasil, mt=muttasil, pj=tanya-jawab, ct=cita-cita, tr=terjemah, sk=susun kalimat */
const KS=[[['v',7],['kt',3]],[['mf',5],['mt',5]],[['pj',6],['ct',4]],[['tr',4],['sk',4],['pj',1],['kt',1]]];
const CO=['#e0524a','#3d82e0','#2fa56b','#e0a43a'],LT=['A','B','C','D'];
const AR=/[\u0600-\u06FF]/,px=i=>(i-1.5)*4.6,ease=k=>1+2.7*Math.pow(k-1,3)+1.7*Math.pow(k-1,2);
const X={on:false,ph:'idle',pt:0,q:[],i:0,ok:0,t:EXS,sec:EXS,sel:-1,right:false,lv:0,by:0,cy:0,H:[0,0,0,0],HT:[0,0,0,0],col:[],vy:0,shake:0,res:[],o:null,built:false,wing:0,fly:0,cele:0,lb:-1,wb:0,gl:null,gT:30,gi:0,gu:0,capI:-2,t0:0,el:0,pyaw:0,pitch:0,yaw:0,bonus:0};
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,V3=THREE.Vector3;
X.cpv=new V3();X.clv=new V3();X.f=new V3(0,0,-1);X.va=new V3();X.vb=new V3();
const EXM=window.EXM={on:false,lie:false,ts:1,state:X};

/* ---------- 1. Bank soal ujian (kisi-kisi) ---------- */
function norm(q){
  if(!q||!Array.isArray(q.o)||q.a==null)return null;
  let o=[...new Set(q.o)];
  if(q.tk&&o.length<4){let g=0;while(o.length<4&&g++<80){const x=sh(q.tk).join(' ');if(!o.includes(x))o.push(x)}}
  if(o.length<4||!o.includes(q.a))return null;
  o=sh(o).slice(0,4);if(!o.includes(q.a))o[rnd(4)]=q.a;
  return Object.assign({},q,{o,c:o.indexOf(q.a),pc:''})} /* tanpa gambar petunjuk: ujian tidak boleh membocorkan jawaban */
function build(){
  const seen=new Set(),out=[],rk={kt:0,pj:1,tr:2,sk:3};let deck=[];
  const take=()=>{if(!deck.length)deck=sh(D.map((_,i)=>i));return D[deck.pop()]};
  KS.forEach((zone,zi)=>{
    let L=[];
    zone.forEach(([t,n])=>{for(let k=0;k<n;k++){
      const d0=take();let q=null;
      for(let a=0;a<120&&!q;a++){
        const c=norm(gen(t,a?D[rnd(D.length)]:d0));if(!c)continue;
        const key=c.k||(c.w!=null?c.t+':'+c.w:c.q);
        if(seen.has(key))continue;seen.add(key);q=c}
      if(!q)for(let a=0;a<60&&!q;a++)q=norm(gen(t,D[rnd(D.length)]));
      if(q){q.zi=zi;L.push(q)}}});
    L=sh(L);if(zi==3)L.sort((a,b)=>rk[a.t]-rk[b.t]);
    out.push(...L)});
  out.forEach((q,i)=>q.no=i+1);return out}
EXM.build=build;

/* ---------- 2. Menggambar teks ke kanvas (papan & pilar) ---------- */
const font=(ar,s)=>ar?`700 ${s}px Amiri,"Noto Naskh Arabic","Traditional Arabic",serif`:`700 ${s}px "Baloo 2",system-ui,sans-serif`;
const rr=(g,x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
function wrap(g,txt,mw){const L=[];let cur='';for(const w of txt.split(/\s+/)){const t=cur?cur+' '+w:w;if(cur&&g.measureText(t).width>mw){L.push(cur);cur=w}else cur=t}if(cur)L.push(cur);return L}
function blocks(html){
  const out=[];
  html.split(/(<span class="ar big" lang="ar">[\s\S]*?<\/span>)/).forEach(s=>{
    if(!s)return;
    const m=s.match(/^<span class="ar big" lang="ar">([\s\S]*?)<\/span>$/);
    if(m){out.push({ar:1,t:m[1].replace(/<[^>]+>/g,'').trim()});return}
    const t=s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
    if(t&&!/^[?؟.…!:]+$/.test(t))out.push({ar:0,t})});
  return out.length?out:[{ar:0,t:'…'}]}
function corkCanvas(){
  const c=document.createElement('canvas');c.width=1536;c.height=732;const g=c.getContext('2d');
  g.fillStyle='#c9965a';g.fillRect(0,0,1536,732);
  for(let i=0;i<2600;i++){g.fillStyle=Math.random()<.5?'rgba(110,64,20,.28)':'rgba(245,205,150,.3)';g.beginPath();g.arc(Math.random()*1536,Math.random()*732,1+Math.random()*4,0,7);g.fill()}
  return c}
function boardText(g,q,x,y,w,h){
  const bl=blocks(q.q);let lay=null;
  for(const f of [1,.9,.8,.7,.6,.5]){
    let tot=0;
    const L=bl.map(b=>{
      let s=Math.round((b.ar?112:56)*f);const lk=b.ar?1.5:1.25;
      g.direction=b.ar?'rtl':'ltr';g.font=font(b.ar,s);let ln=wrap(g,b.t,w);
      while(b.ar&&s>40&&ln.some(l=>g.measureText(l).width>w)){s-=6;g.font=font(1,s);ln=wrap(g,b.t,w)}
      const hh=ln.length*s*lk;tot+=hh;return{b,s,lk,ln,hh}});
    tot+=(bl.length-1)*18;lay={L,tot};if(tot<=h)break}
  let cy=y+Math.max(0,(h-lay.tot)/2);g.textAlign='center';g.textBaseline='middle';
  lay.L.forEach(o=>{
    if(o.b.ar){g.fillStyle='rgba(255,226,122,.6)';rr(g,x,cy-4,w,o.hh+8,20);g.fill()}
    g.fillStyle='#1d2b53';g.font=font(o.b.ar,o.s);g.direction=o.b.ar?'rtl':'ltr';
    o.ln.forEach((l,k)=>g.fillText(l,x+w/2,cy+(k+.5)*o.s*o.lk));cy+=o.hh+18});
  g.direction='ltr'}
function drawBoard(q){
  const g=X.bg;g.drawImage(X.cork,0,0);const z=ZN[q.zi];
  g.fillStyle=z[3];g.strokeStyle='#1d2b53';g.lineWidth=7;rr(g,70,20,1396,80,40);g.fill();g.stroke();
  g.fillStyle='#fff';g.textBaseline='middle';g.direction='ltr';g.font=font(0,38);
  g.textAlign='left';g.fillText(`🎓 ${z[0]} · ${z[1]}`,112,61);g.textAlign='right';g.fillText(`Soal ${q.no}/${EXN}`,1424,61);
  g.fillStyle='rgba(60,30,0,.3)';rr(g,84,136,1396,552,26);g.fill();
  g.fillStyle='#fffdf5';g.strokeStyle='#1d2b53';g.lineWidth=7;rr(g,70,120,1396,552,26);g.fill();g.stroke();
  [[170,-.1],[1366,.1]].forEach(([tx,a])=>{g.save();g.translate(tx,122);g.rotate(a);g.fillStyle='rgba(255,226,122,.85)';g.fillRect(-60,-18,120,36);g.restore()});
  let x0=130,w=1276;
  if(q.pc){g.font='130px "Segoe UI Emoji","Noto Color Emoji",serif';g.textAlign='center';g.fillStyle='#000';g.fillText(q.pc,235,395);x0=360;w=1046}
  boardText(g,q,x0,150,w,500);X.bt.needsUpdate=true}
function drawTop(i,txt,st){
  const g=X.tg[i],c=512;
  g.fillStyle=st==1?'#2fbf85':st==2?'#c93a30':st==3?'#8e97a8':CO[i];g.fillRect(0,0,c,c);
  g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=12;g.strokeRect(6,6,c-12,c-12);
  g.fillStyle='#fffdf5';g.strokeStyle='#1d2b53';g.lineWidth=7;rr(g,30,30,452,452,28);g.fill();g.stroke();
  const ar=AR.test(txt);let s=ar?100:64,ln;
  for(;s>=26;s-=4){g.font=font(ar,s);g.direction=ar?'rtl':'ltr';ln=wrap(g,txt,396);if(ln.length*s*(ar?1.5:1.2)<=310&&ln.every(l=>g.measureText(l).width<=396))break}
  g.textAlign='center';g.textBaseline='middle';g.fillStyle=st==3?'#6b7385':'#1d2b53';
  const lh=s*(ar?1.5:1.2),y0=136+(330-ln.length*lh)/2;ln.forEach((l,k)=>g.fillText(l,256,y0+(k+.5)*lh));g.direction='ltr';
  g.fillStyle=st==1?'#14744b':st==2?'#b8352b':CO[i];g.beginPath();g.arc(86,86,50,0,7);g.fill();g.lineWidth=6;g.stroke();
  g.fillStyle='#fff';g.font=font(0,68);g.fillText(LT[i],86,90);
  if(st==1||st==2){g.font=font(0,110);g.fillStyle=st==1?'#14744b':'#b8352b';g.fillText(st==1?'✔':'✘',420,92)}
  X.tt[i].needsUpdate=true}
function brick(col){
  const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
  g.fillStyle=col;g.fillRect(0,0,128,128);g.fillStyle='rgba(255,255,255,.2)';g.fillRect(0,0,128,12);
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,116,128,12);g.fillRect(60,12,8,104);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t}
function cloudMat(inner){
  const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,4,64,64,62);
  r.addColorStop(0,inner||'rgba(255,255,255,.95)');r.addColorStop(.5,inner?'rgba(255,220,90,.35)':'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128);
  return new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,fog:false,depthWrite:false,blending:inner?THREE.AdditiveBlending:THREE.NormalBlending})}

/* ---------- 3. Arena 3D (dibangun sekali, saat ujian pertama) ---------- */
function arena(){
  if(X.built)return;X.built=true;
  const L=c=>new THREE.MeshLambertMaterial({color:c}),G0=X.G=new THREE.Group();G0.visible=false;S.add(G0);
  const isl=new THREE.Mesh(new THREE.CylinderGeometry(150,135,4,56),L(0x78c05a));isl.position.set(0,-2,AZ);G0.add(isl);
  const pz=new THREE.Mesh(new THREE.CylinderGeometry(17,17,.3,44),L(0xd9cfae));pz.position.set(0,.15,AZ);G0.add(pz);
  for(let k=0;k<34;k++){const a=Math.random()*6.28,r=34+Math.random()*100,x=Math.cos(a)*r,z=AZ+Math.sin(a)*r;
    const tr=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,3,6),L(0x6b4a2b));tr.position.set(x,1.5,z);G0.add(tr);
    const cn=new THREE.Mesh(new THREE.ConeGeometry(3.2,8,8),L(0x2f8f4a));cn.position.set(x,6.5,z);G0.add(cn)}
  /* sky */
  X.skc=document.createElement('canvas');X.skc.width=2;X.skc.height=256;X.sky=new THREE.CanvasTexture(X.skc);
  /* 4 pilar jawaban */
  const g1=new THREE.BoxGeometry(4.6,1,4.6);X.P=[];X.tg=[];X.tt=[];X.sTex=[];
  for(let i=0;i<4;i++){
    const tex=brick(CO[i]),side=new THREE.MeshLambertMaterial({map:tex}),tc=document.createElement('canvas');tc.width=tc.height=512;
    const tt=new THREE.CanvasTexture(tc);tt.anisotropy=4;
    const top=new THREE.MeshBasicMaterial({map:tt,toneMapped:false,fog:false});
    const m=new THREE.Mesh(g1,[side,side,top,side,side,side]);m.position.set(px(i),1,AZ);G0.add(m);
    X.P.push(m);X.tg.push(tc.getContext('2d'));X.tt.push(tt);X.sTex.push(tex)}
  /* papan mading */
  const B=X.B=new THREE.Group();G0.add(B);
  const fr=new THREE.Mesh(new THREE.BoxGeometry(22.8,11.2,.6),L(0x7a4e2a));fr.position.z=-.3;B.add(fr);
  X.cork=corkCanvas();const bc=document.createElement('canvas');bc.width=1536;bc.height=732;X.bg=bc.getContext('2d');X.bt=new THREE.CanvasTexture(bc);X.bt.anisotropy=4;
  const pl2=new THREE.Mesh(new THREE.PlaneGeometry(21.6,10.2),new THREE.MeshBasicMaterial({map:X.bt,toneMapped:false,fog:false}));pl2.position.z=.02;B.add(pl2);
  X.posts=[-9.4,9.4].map(x=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.8,1,.8),L(0x5a3a1c));p.position.x=x;p.position.z=-.8;B.add(p);return p});
  const tk=new THREE.Mesh(new THREE.PlaneGeometry(19,.5),new THREE.MeshBasicMaterial({color:0x1d2b53,fog:false}));tk.position.set(0,-4.72,.04);B.add(tk);
  const bg=new THREE.PlaneGeometry(19,.38).translate(9.5,0,0);X.tbar=new THREE.Mesh(bg,new THREE.MeshBasicMaterial({color:0x2fbf85,fog:false}));X.tbar.position.set(-9.5,-4.72,.06);B.add(X.tbar);
  /* awan sepanjang menara */
  X.cm=cloudMat();X.cl=[];
  for(let h=24;h<=170;h+=9)for(let j=0;j<3;j++){const s=new THREE.Sprite(X.cm),a=Math.random()*6.28,r=26+Math.random()*60;
    s.scale.set(30+Math.random()*22,13+Math.random()*7,1);s.position.set(Math.cos(a)*r,h+Math.random()*6,AZ+Math.sin(a)*r);G0.add(s);X.cl.push(s)}
  /* dek awan di puncak + panggung piala (muncul saat menang) */
  const dk=X.dk=new THREE.Group(),wm=new THREE.MeshLambertMaterial({color:0xffffff,emissive:0x8a95a8});
  for(let k=0;k<44;k++){const a=k*2.4,r=k<10?k*1.1:7+((k*7)%15),s=3.4+((k*5)%4),m=new THREE.Mesh(new THREE.IcosahedronGeometry(s,1),wm);
    m.position.set(Math.cos(a)*r,((k*3)%5)*.25,Math.sin(a)*r);m.scale.y=.5;dk.add(m)}
  {let yb=1.6;[[5.4,1.1,0xefe6cc],[4.4,1.1,0xfaf4e2],[3.4,1,0xffcf3f]].forEach(([r,h,c],j)=>{const s=new THREE.Mesh(new THREE.CylinderGeometry(r,r+.5,h,32),new THREE.MeshPhongMaterial({color:c,shininess:j==2?80:20}));s.position.set(0,yb+h/2,-10);yb+=h;dk.add(s)})}
  dk.position.set(0,0,AZ);dk.scale.setScalar(.001);G0.add(dk);
  /* piala besar */
  const tp=X.tp=new THREE.Group(),gm=new THREE.MeshPhongMaterial({color:0xffcf3f,specular:0xfff2a0,shininess:90,emissive:0x5a3c00});
  const cup=new THREE.Mesh(new THREE.LatheGeometry([[0,2.4],[.9,2.45],[2.2,3.2],[3,4.4],[3.2,5.9],[2.9,6.1],[2.6,6],[2.7,4.6],[1.9,3.6],[0,3.3]].map(p=>new THREE.Vector2(p[0],p[1])),28),gm);
  cup.material.side=THREE.DoubleSide;tp.add(cup);
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(.5,.9,1.6,14),gm);stem.position.y=1.7;tp.add(stem);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.4,.9,24),gm);base.position.y=.45;tp.add(base);
  [-1,1].forEach(s=>{const h=new THREE.Mesh(new THREE.TorusGeometry(1.15,.24,8,18,Math.PI*1.4),gm);h.position.set(s*3.2,4.7,0);h.rotation.z=s>0?-Math.PI*.7:Math.PI*.7-Math.PI;tp.add(h)});
  const gl=new THREE.Sprite(cloudMat('rgba(255,236,150,.9)'));gl.scale.set(22,22,1);gl.position.y=4;tp.add(gl);
  tp.visible=false;tp.position.set(0,0,AZ-10);G0.add(tp);
  /* sinar emas berputar di belakang piala */
  {const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.translate(128,128);
   for(let k=0;k<14;k++){g.save();g.rotate(k*Math.PI/7);const gr=g.createLinearGradient(0,0,0,-126);gr.addColorStop(0,'rgba(255,240,170,.85)');gr.addColorStop(1,'rgba(255,240,170,0)');g.fillStyle=gr;g.beginPath();g.moveTo(0,0);g.lineTo(-16,-126);g.lineTo(16,-126);g.closePath();g.fill();g.restore()}
   X.ry=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,fog:false,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0}));X.ry.scale.set(64,64,1);X.ry.visible=false;G0.add(X.ry)}
  /* percikan */
  const N=160;X.pp=new Float32Array(N*3).fill(-9999);X.pc=new Float32Array(N*3);X.pv=new Float32Array(N*3);X.pl=new Float32Array(N);
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(X.pp,3));pg.setAttribute('color',new THREE.BufferAttribute(X.pc,3));
  X.pts=new THREE.Points(pg,new THREE.PointsMaterial({size:.6,vertexColors:true,transparent:true,depthWrite:false,fog:false}));X.pts.frustumCulled=false;S.add(X.pts);
  /* puing pilar runtuh */
  X.db=[];for(let k=0;k<18;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(1.1,1.1,1.1),new THREE.MeshLambertMaterial({color:0xcccccc}));m.visible=false;G0.add(m);X.db.push({m,v:new THREE.Vector3(),w:new THREE.Vector3(),on:0})}
  /* matahari & bintang (mengikuti kamera) */
  X.sun=new THREE.Sprite(cloudMat('rgba(255,246,200,1)'));X.sun.scale.set(110,110,1);G0.add(X.sun);
  {const n=260,a=new Float32Array(n*3);for(let k=0;k<n;k++){const u=Math.random(),t=Math.random()*6.283,r=Math.sqrt(1-u*u)*320;a[k*3]=Math.cos(t)*r;a[k*3+1]=20+u*300;a[k*3+2]=Math.sin(t)*r}
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(a,3));X.st=new THREE.Points(g,new THREE.PointsMaterial({color:0xffffff,size:2.4,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));X.st.frustumCulled=false;G0.add(X.st)}
  /* sayap besar (dipakai saat terbang turun melihat kota) */
  X.wg=new THREE.Group();X.wg.visible=false;S.add(X.wg);X.wgs=[];
  {const LN=[3,3.5,3.8,3.6,3.1,2.4],FC=[0xffffff,0xf1f6ff,0xe3ecfb,0xf6f9ff,0xdbe7fa,0xffffff];
   [-1,1].forEach(k=>{const piv=new THREE.Group();piv.position.set(k*.55,3.2,-.75);X.wg.add(piv);
     LN.forEach((len,j)=>{const fg=new THREE.Group();fg.rotation.z=-k*(.25+j*.24);piv.add(fg);
       const m=new THREE.Mesh(new THREE.BoxGeometry(.52,len,.07),new THREE.MeshLambertMaterial({color:FC[j],emissive:0x3a4a66}));m.position.y=len/2;fg.add(m);
       const tx=new THREE.Mesh(new THREE.BoxGeometry(.52,.34,.09),new THREE.MeshLambertMaterial({color:0xffcf3f,emissive:0x6a4a00}));tx.position.y=len;fg.add(tx)});
     X.wgs.push({piv,k})})}
  /* simpan tampilan kota untuk dikembalikan */
  X.org={bg:S.background,fc:S.fog.color.getHex(),fn:S.fog.near,ff:S.fog.far,fov:cam.fov,far:cam.far}}

function burst(x,y,z,n,cols,sp){
  let k=0;for(let i=0;i<X.pl.length&&k<n;i++){if(X.pl[i]>0)continue;k++;
    const a=Math.random()*6.28,u=Math.random()*2-.4,c=new THREE.Color(cols[(Math.random()*cols.length)|0]),s=sp*(.5+Math.random());
    X.pp[i*3]=x;X.pp[i*3+1]=y;X.pp[i*3+2]=z;X.pv[i*3]=Math.cos(a)*s;X.pv[i*3+1]=u*s+4;X.pv[i*3+2]=Math.sin(a)*s;
    X.pc[i*3]=c.r;X.pc[i*3+1]=c.g;X.pc[i*3+2]=c.b;X.pl[i]=.9+Math.random()*.8}}
function debris(i,y){
  let k=0;for(const d of X.db){if(d.on||k>=6)continue;k++;d.on=1;d.m.visible=true;d.m.material.color.set(CO[i]);
    d.m.position.set(px(i)+(Math.random()-.5)*3.4,y-Math.random()*2,AZ+(Math.random()-.5)*3.4);
    d.v.set((Math.random()-.5)*9,3+Math.random()*7,(Math.random()-.5)*9);d.w.set(Math.random()*8,Math.random()*8,Math.random()*8)}}
function fx(dt){
  const n=X.pl.length;let ch=0;
  for(let i=0;i<n;i++){if(X.pl[i]<=0)continue;ch=1;X.pl[i]-=dt;
    if(X.pl[i]<=0){X.pp[i*3+1]=-9999;continue}
    X.pv[i*3+1]-=11*dt;X.pp[i*3]+=X.pv[i*3]*dt;X.pp[i*3+1]+=X.pv[i*3+1]*dt;X.pp[i*3+2]+=X.pv[i*3+2]*dt}
  if(ch){X.pts.geometry.attributes.position.needsUpdate=true;X.pts.geometry.attributes.color.needsUpdate=true}
  X.db.forEach(d=>{if(!d.on)return;d.v.y-=40*dt;d.m.position.addScaledVector(d.v,dt);d.m.rotation.x+=d.w.x*dt;d.m.rotation.y+=d.w.y*dt;
    if(d.m.position.y<.5){d.on=0;d.m.visible=false}})}
function sky(p){
  const g=X.skc.getContext('2d'),m=(a,b)=>'#'+new THREE.Color(a).lerp(new THREE.Color(b),p).getHexString(),gr=g.createLinearGradient(0,0,0,256);
  gr.addColorStop(0,m('#5a9fe0','#1c2f78'));gr.addColorStop(.6,m('#9cc9ee','#4f86d6'));gr.addColorStop(1,m('#efe9d6','#c4def7'));
  g.fillStyle=gr;g.fillRect(0,0,2,256);X.sky.needsUpdate=true;S.fog.color.set(m('#e2e6dc','#a9cdf2'));if(X.st)X.st.material.opacity=Math.max(0,(p-.5)*1.7);if(X.sun)X.sun.material.opacity=.55+.45*p}
function applyH(){X.P.forEach((m,i)=>{const h=Math.max(.2,X.H[i]);m.scale.y=h;m.position.y=h/2;X.sTex[i].repeat.y=h/EXH})}

/* ---------- 4. Alur ujian ---------- */
const hud$={};['exh','exnt','exgr','exzl','exbar','exsec','exalt','exz','exf','exo','exov','exsr','exsp','exq','exw','exfly','glc','gla','gls'].forEach(k=>Object.defineProperty(hud$,k,{get:()=>$('#'+k)}));
function lockBtns(on){document.querySelectorAll('#exo button').forEach(b=>b.disabled=on)}
const aw=q=>AR.test(q.a)?`<span class="ar" lang="ar">${q.a}</span>`:q.a;
function fb(h,c){const e=hud$.exf;e.innerHTML=h;e.className=c;void e.offsetWidth;e.className=c+' go'}
function grid(){hud$.exgr.innerHTML=ZN.map(z=>`<div class="exzg" style="--zc:${z[3]}">${'<i></i>'.repeat(10)}</div>`).join('')}
function gridUp(){hud$.exgr.querySelectorAll('i').forEach((e,k)=>{e.className=k<X.i?'on':k==X.i?'cur':''})}
function okFb(){const n=X.ok;fb(n%10==0&&n<EXN?`🎉 ${ZN[n/10-1][0]} selesai!`:n==EXN-5?'🔥 Tinggal 5 soal lagi!':n==EXN-1?'⚡ Satu soal lagi!':'✔ Benar! +3 🪙','ok');hud$.exsr.textContent=`Benar. ${n} dari ${EXN}`}
function show(){
  const q=X.q[X.i],z=ZN[q.zi];X.t=EXS;X.sec=EXS;X.sel=-1;
  drawBoard(q);for(let i=0;i<4;i++)drawTop(i,q.o[i],0);
  hud$.exh.style.setProperty('--zc',z[3]);hud$.exnt.textContent=`Soal ${q.no}/${EXN}`;hud$.exzl.textContent=`${z[0]} · ${z[1]}`;gridUp();
  hud$.exsec.textContent=EXS;hud$.exbar.style.transform='scaleX(1)';hud$.exbar.className='';
  hud$.exsp.style.display=q.sp?'':'none';
  hud$.exsr.textContent=`Soal ${q.no} dari ${EXN}. ${q.q.replace(/<[^>]+>/g,' ')} Pilihan: ${q.o.map((o,i)=>LT[i]+', '+o).join('; ')}`;
  lockBtns(true);
  if(X.i%10==0){const e=hud$.exz;e.style.setProperty('--zc',z[3]);e.innerHTML=`<b>${z[0]}</b><span>${z[1]}</span><small>${z[2]} · soal ${q.no}–${q.no+9}</small>`;e.classList.remove('go');void e.offsetWidth;e.classList.add('go');X.ph='zone'}
  else X.ph='ready';
  X.pt=0}

/* ---------- 4b. Puncak: piala besar, sayap, terbang turun melihat kota ---------- */
function winStart(){
  X.el=Math.round((performance.now()-X.t0)/1000);endExam(true);
  document.body.classList.add('wn');
  const mm=Math.floor(X.el/60),ss=X.el%60;
  hud$.exw.innerHTML=`<b>🏆 Juara Ujian Akhir!</b><span class="ar" lang="ar">أَحْسَنْتَ! مَبْرُوكٌ</span><small>${EXN}/${EXN} benar · ${mm?mm+' mnt ':''}${ss} dtk</small>`;
  hud$.exsr.textContent=`Selamat! Kamu menjawab ${EXN} dari ${EXN} soal dengan benar dan meraih piala besar di atas awan.`;
  X.fly=0;X.cele=0;X.lb=-1}
function summit(t,kk){
  const ty=X.lv+2.4+Math.sin(t*1.6)*.3;
  X.tp.visible=true;X.tp.scale.setScalar(Math.max(.001,2.1*ease(kk)));X.tp.position.set(0,ty,AZ-10);X.tp.rotation.y=t*.9;
  X.ry.visible=true;X.ry.position.set(0,ty+8,AZ-10.5);X.ry.material.rotation=t*.2;X.ry.material.opacity=Math.min(1,kk*1.3)*.75}
function fly(){
  if(X.ph!='win'||!X.fly)return;
  X.ph='wing';X.pt=0;X.fly=0;X.wb=0;
  hud$.exfly.classList.remove('on');hud$.exov.innerHTML='';
  document.body.classList.remove('wn');document.body.classList.add('gl');
  hud$.glc.textContent='🪽 Sayapmu terbuka!';hud$.gla.textContent='☁️ '+Math.round(pl.y)+' m';
  hud$.exsr.textContent='Sayapmu terbuka. Kamu terbang turun melihat Kota Profesi. Tekan Lewati untuk berhenti.';
  snd(392,.12,'triangle',.05);setTimeout(()=>snd(587,.2,'triangle',.05),120)}
/* jalur terbang: memutari kota dari ketinggian, lalu berputar turun tepat ke tempat pemain berdiri */
function buildPath(){
  const o=X.o,L=[[-170,130,-150],[-40,112,-150],[110,96,-130],[185,78,-10],[120,58,120],[-20,44,140],[-130,34,60]].map(p=>new V3(p[0],p[1],p[2])),
    last=L[L.length-1],a0=Math.atan2(last.z-o.z,last.x-o.x),N=8,pts=L.slice();
  for(let j=0;j<=N;j++){const s=j/N,r=30-j*2.6,a=a0+j*.82,h=30*Math.pow(1-s,1.25)+(j==N?.25:0);pts.push(new V3(o.x+Math.cos(a)*r,h,o.z+Math.sin(a)*r))}
  pts.push(new V3(o.x,.2,o.z));
  const c=new THREE.CatmullRomCurve3(pts,false,'centripetal');c.arcLengthDivisions=800;return c}
function chase(dt,t,snap){
  const f=X.f,sw=RM?0:Math.sin(t*.35)*5;
  X.va.set(pl.x-f.x*13+f.z*sw,pl.y+4.2-f.y*13,pl.z-f.z*13-f.x*sw);X.va.y=Math.max(X.va.y,pl.y+2.2,1.8);
  X.vb.set(pl.x+f.x*9,pl.y+1.2+f.y*9,pl.z+f.z*9);
  if(snap){X.cpv.copy(X.va);X.clv.copy(X.vb)}else{X.cpv.lerp(X.va,1-Math.exp(-dt*3.4));X.clv.lerp(X.vb,1-Math.exp(-dt*5))}
  cam.position.copy(X.cpv);cam.lookAt(X.clv)}
function toCity(){
  X.G.visible=false;
  S.background=X.org.bg;S.fog.color.setHex(X.org.fc);S.fog.near=X.org.fn;S.fog.far=Math.max(X.org.ff,720);cam.far=900;cam.fov=62;cam.updateProjectionMatrix();
  X.gl=buildPath();X.gT=RM?20:38;X.gi=0;X.gu=0;X.capI=-2;
  X.gl.getPointAt(0,X.va);X.gl.getTangentAt(0,X.f);pl.x=X.va.x;pl.y=X.va.y;pl.z=X.va.z;
  chase(0,0,true);hud$.glc.textContent='🪽 Melayang di atas Kota Profesi'}
function caption(){
  let best=null,bd=1e9;pois.forEach(p=>{const d=Math.hypot(p.n.position.x-pl.x,p.n.position.z-pl.z);if(d<bd){bd=d;best=p}});
  if(best&&bd<70){if(best.i!==X.capI){X.capI=best.i;hud$.glc.innerHTML=`${best.d.e||''} ${best.d.pl} · <span class="ar" lang="ar">${best.d.ar}</span>${best.lv>0?' '+'⭐'.repeat(best.lv):''}`}}
  else if(X.capI!==-1){X.capI=-1;hud$.glc.textContent='🪽 Melayang di atas Kota Profesi'}}
function touch(){X.ph='touch';X.pt=0;X.wb=0;pl.x=X.o.x;pl.y=0;pl.z=X.o.z}
function skipGlide(){if(X.ph!='glide')return;X.ph='skip';X.pt=0;hud$.exov.className='on wh fast'}
function wingsUpd(t){
  const w=X.wing,vis=w>.02;X.wg.visible=vis;if(!vis)return;
  const fl=X.ph=='glide'?(.12+.24*Math.sin(t*2.8)):X.ph=='touch'?.1*Math.sin(t*6)*w:.28*Math.sin(t*13)*Math.min(1,w*1.4),
    sp=.78*Math.min(1,Math.max(0,X.pitch)/1.15);
  X.wgs.forEach(({piv,k})=>{piv.scale.setScalar(Math.max(.001,w));piv.rotation.y=k*fl;piv.rotation.z=-k*sp});
  X.wg.position.copy(P.position);X.wg.quaternion.copy(P.quaternion)}
function ding(){snd(660,.08,'triangle');setTimeout(()=>snd(880,.1,'triangle'),90);setTimeout(()=>snd(1175,.18,'triangle'),190)}
function answer(s){
  if(X.ph!='ask')return;const q=X.q[X.i];
  X.sel=s;X.right=s==q.c;X.res.push({t:q.t,ok:X.right});lockBtns(true);X.pt=0;
  if(s<0){X.ph='shake';X.col=[0,1,2,3];reveal(q);snd(180,.3,'sawtooth',.07);fb('⏰ Waktu habis! Jawaban: '+aw(q),'no');hud$.exsr.textContent='Waktu habis. Jawaban benar: '+q.a}else X.ph='hop'}
function reveal(q){for(let i=0;i<4;i++)drawTop(i,q.o[i],i==q.c?1:(i==X.sel?2:3))}
function endExam(win){
  const e=G.ex=G.ex||{try:0,win:0,best:0,last:null};
  e.best=Math.max(e.best||0,X.ok);e.last={ok:X.ok,d:dstr()};
  let bonus=0;if(win){bonus=e.win?80:250;e.win=(e.win||0)+1;coins+=bonus}
  X.bonus=bonus;try{save()}catch(_){}hud()}
function leave(){
  document.body.classList.remove('exm','wn','gl');EXM.on=false;X.G.visible=false;X.tp.visible=false;X.ry.visible=false;X.wg.visible=false;X.wing=0;
  X.pl.fill(0);X.pp.fill(-9999);X.pts.geometry.attributes.position.needsUpdate=true;
  S.background=X.org.bg;S.fog.color.setHex(X.org.fc);S.fog.near=X.org.fn;S.fog.far=X.org.ff;cam.fov=X.org.fov;cam.far=X.org.far;cam.clearViewOffset();cam.updateProjectionMatrix();
  P.rotation.order='XYZ';P.rotation.set(0,0,0);P.scale.setScalar(1);P.armL.rotation.set(0,0,0);P.armR.rotation.set(0,0,0);P.legL.rotation.x=P.legR.rotation.x=0;pl.vy=0;
  if(X.o){pl.x=X.o.x;pl.z=X.o.z;pl.y=0;pl.yaw=X.o.yaw}}
function quit(){
  if(!confirm('Keluar dari ujian? Ujian yang sedang berjalan tidak dihitung.'))return;
  leave();hud$.exov.className='';open=false;mode=null;X.ph='idle'}
function begin(){
  $('#modal').style.display='none';arena();
  X.q=build();X.i=0;X.ok=0;X.res=[];X.bonus=0;X.col=[];X.vy=0;X.shake=0;X.wing=0;X.fly=0;X.cele=0;X.lb=-1;X.wb=0;X.pyaw=0;X.pitch=0;X.yaw=0;X.gu=0;X.t0=performance.now();
  X.o={x:pl.x,z:pl.z,y:pl.y,yaw:pl.yaw};
  const e=G.ex=G.ex||{try:0,win:0,best:0,last:null};e.try=(e.try||0)+1;
  document.body.classList.remove('wn','gl');document.body.classList.add('exm');X.G.visible=true;EXM.on=true;open=true;mode='exam';
  S.background=X.sky;S.fog.near=60;S.fog.far=320;cam.fov=66;cam.updateProjectionMatrix();sky(0);
  X.lv=EXH*2;X.H=[X.lv,X.lv,X.lv,X.lv];X.HT=X.H.slice();X.P.forEach((m,i)=>m.position.x=px(i));applyH();
  hud$.exo.style.visibility='';X.B.visible=true;X.B.scale.setScalar(1);X.dk.scale.setScalar(.001);X.tp.visible=false;X.ry.visible=false;X.wg.visible=false;
  hud$.exfly.classList.remove('on');hud$.exov.className='';hud$.exov.innerHTML='';hud$.exf.className='';grid();
  pl.x=0;pl.z=AZ;pl.y=X.lv;pl.yaw=0;X.by=X.lv;X.cy=X.lv;
  show()}

/* ---------- 5. Per-frame: mesin status, papan, kamera ---------- */
function step(dt,t){
  dt*=EXM.ts||1;X.pt+=dt;const ph=X.ph;
  if(ph=='zone'||ph=='ready'){
    if(X.pt>=(ph=='zone'?1.8:.5)){X.ph='ask';X.pt=0;lockBtns(false);const q=X.q[X.i];if(q.q.indexOf('🎧')>=0&&q.sp)say(q.sp)}}
  else if(ph=='ask'){
    X.t=Math.max(0,X.t-dt);const s=Math.ceil(X.t);
    if(s!=X.sec){X.sec=s;hud$.exsec.textContent=s;if(s<=3&&s>0)snd(900,.05,'square',.03)}
    hud$.exbar.style.transform=`scaleX(${X.t/EXS})`;const c=X.t>5?'':X.t>3?'mid':'lo';if(hud$.exbar.className!==c)hud$.exbar.className=c;
    if(X.t<=0)answer(-1)}
  else if(ph=='hop'){
    const k=Math.min(1,X.pt/.4);pl.x=px(X.sel)*k;pl.y=X.lv+Math.sin(k*Math.PI)*1.8;
    if(k>=1){const q=X.q[X.i];reveal(q);X.pt=0;
      if(X.right){X.ph='rise';X.lv+=EXH;X.HT[X.sel]=X.lv;X.ok++;coins+=3;hud();ding();burst(px(X.sel),X.lv,AZ,26,['#ffe27a','#ffffff','#2fbf85','#ff6b5e'],9);sky(X.ok/EXN);okFb()}
      else{X.ph='shake';X.col=[X.sel];snd(200,.3,'sawtooth',.07);fb('✘ Belum tepat. Jawaban: '+aw(q),'no');hud$.exsr.textContent='Salah. Jawaban benar: '+q.a}}}
  else if(ph=='rise'){
    const s=X.sel;X.H[s]+=(X.HT[s]-X.H[s])*Math.min(1,dt*7);pl.y=X.H[s];
    if(X.pt>=.9){X.H[s]=X.HT[s];pl.y=X.H[s];X.pt=0;
      if(X.i>=EXN-1){X.ph='win';X.HT=[X.lv,X.lv,X.lv,X.lv];X.win0=1;winStart();hud$.exo.style.visibility='hidden';snd(523,.2,'triangle');setTimeout(()=>{snd(659,.2,'triangle');setTimeout(()=>snd(784,.35,'triangle'),160)},160)}
      else{X.ph='catch';X.HT=[X.lv,X.lv,X.lv,X.lv]}}}
  else if(ph=='catch'){
    for(let i=0;i<4;i++)X.H[i]+=(X.HT[i]-X.H[i])*Math.min(1,dt*6);
    pl.x+=(0-pl.x)*Math.min(1,dt*6);pl.y=X.H[X.sel];
    if(X.pt>=.85){X.H=X.HT.slice();pl.x=0;pl.y=X.lv;X.i++;show()}}
  else if(ph=='shake'){
    X.col.forEach(i=>X.P[i].position.x=px(i)+Math.sin(X.pt*70)*.2);
    if(X.pt>=.6){X.col.forEach(i=>{X.P[i].position.x=px(i);debris(i,X.H[i])});X.ph='fall';X.pt=0;X.vy=0;snd(90,.6,'sawtooth',.1);X.shake=.5}}
  else if(ph=='fall'){
    X.vy-=48*dt;pl.y+=X.vy*dt;X.col.forEach(i=>X.H[i]=Math.max(.2,X.H[i]-70*dt));
    if(Math.random()<.5)X.col.forEach(i=>{if(X.H[i]>.5)debris(i,X.H[i])});
    if(pl.y<=0){pl.y=0;X.ph='land';X.pt=0;X.shake=.7;burst(pl.x,.4,AZ,40,['#ffffff','#ffe27a','#d9cfae'],10);snd(70,.5,'sawtooth',.12)}}
  else if(ph=='land'){if(X.pt>1.3){X.ph='out';X.pt=0;hud$.exov.innerHTML='';hud$.exov.className='on'}}
  else if(ph=='out'){if(X.pt>.9){X.ph='done';endExam(false);wake()}}
  else if(ph=='win'){
    const k=Math.min(1,X.pt/1.7);X.dk.scale.setScalar(Math.max(.001,ease(k)));X.dk.position.y=X.lv-2.6;
    for(let i=0;i<4;i++)X.H[i]+=(X.HT[i]-X.H[i])*Math.min(1,dt*6);
    pl.x+=(0-pl.x)*Math.min(1,dt*5);
    const bs=Math.max(0,1-X.pt*2.2);X.B.scale.setScalar(Math.max(.001,bs));X.B.visible=bs>.02;
    if(X.pt>1.3){
      summit(t,Math.min(1,(X.pt-1.3)/1.3));
      if(!X.cele){X.cele=1;burst(0,X.lv+6,AZ-10,60,['#ffe27a','#ffffff','#ff6b5e','#3d82e0','#2fbf85'],14);[523,659,784,1047].forEach((f,i)=>setTimeout(()=>snd(f,.35,'triangle',.06),i*130))}
      pl.y=X.lv+Math.abs(Math.sin(X.pt*4.5))*.9;
      const b=(X.pt*6)|0;if(b!=X.lb){X.lb=b;burst((Math.random()-.5)*18,X.lv+10,AZ+(Math.random()-.5)*16,12,['#ffe27a','#ffffff','#ff6b5e','#3d82e0','#2fbf85'],11)}
      if(X.pt>3.4&&!X.fly){X.fly=1;const e=hud$.exfly;e.classList.add('on');try{e.focus({preventScroll:true})}catch(_){}}
      if(X.fly&&X.pt>30)fly()}
    else pl.y=X.lv}
  else if(ph=='wing'){
    summit(t,1);
    const u=Math.min(1,X.pt/1.3),sm=u*u*(3-2*u);
    X.wing=Math.min(1,X.pt/.9);X.pyaw=Math.PI*Math.min(1,X.pt/.7);
    pl.x+=(0-pl.x)*Math.min(1,dt*6);pl.y=X.lv+sm*3.4+Math.abs(Math.sin(X.pt*9))*.25;
    if(X.pt>.15&&!X.wb){X.wb=1;burst(0,pl.y+3,AZ,40,['#ffffff','#bfe0ff','#ffe27a'],9);snd(520,.25,'sine',.05)}
    if(X.pt>=1.3){X.ph='wipe';X.pt=0;X.wb=0;hud$.exov.className='on wh'}}
  else if(ph=='wipe'){
    summit(t,1);X.wing=1;pl.y=X.lv+3.4+X.pt*8;
    if(X.pt>=.85){toCity();X.ph='glide';X.pt=0;hud$.exov.className='wh'}}
  else if(ph=='glide'){
    const lin=Math.min(1,X.pt/X.gT),u=lin*.55+lin*lin*(3-2*lin)*.45;
    X.gl.getPointAt(u,X.va);X.gl.getTangentAt(u,X.f);pl.x=X.va.x;pl.y=X.va.y;pl.z=X.va.z;X.gu=u;X.wing=1;
    const gi=(X.pt*8)|0;if(gi!=X.gi){X.gi=gi;burst(pl.x-X.f.x*2,pl.y+1-X.f.y*2,pl.z-X.f.z*2,2,['#ffe27a','#ffffff'],2.2);if(gi%4==0)caption()}
    hud$.gla.textContent='☁️ '+Math.max(0,Math.round(pl.y))+' m';
    if(lin>=1)touch()}
  else if(ph=='skip'){if(X.pt>.3){touch();hud$.exov.className='wh fast'}}
  else if(ph=='touch'){
    X.wing=Math.max(0,1-X.pt/1.1);pl.x=X.o.x;pl.z=X.o.z;pl.y=0;
    if(!X.wb){X.wb=1;burst(pl.x,.5,pl.z,36,['#ffffff','#ffe27a','#dfe8f0'],9);snd(180,.18,'sine',.06)}
    if(X.pt>1.9){X.ph='done';finishWin()}}
  /* papan mengikuti ketinggian */
  X.by+=(X.lv-X.by)*Math.min(1,dt*4.5);
  X.B.position.set(0,X.by+BY,AZ-6);X.posts.forEach(p=>{p.scale.y=X.B.position.y;p.position.y=-X.B.position.y/2});
  X.tbar.scale.x=Math.max(.001,X.t/EXS);X.tbar.material.color.set(X.t>5?0x2fbf85:X.t>3?0xe0a43a:0xe0524a);
  applyH();fx(dt);
  X.cl.forEach(c=>{c.position.x+=dt*.8;if(c.position.x>110)c.position.x=-110});
  const al=Math.round(pl.y)+' m';if(hud$.exalt.textContent!=='☁️ '+al)hud$.exalt.textContent='☁️ '+al}
EXM.cam=function(dt,t){
  if(!X.G)return;step(Math.min(dt,.05),t);
  const fast=X.ph=='fall'||X.ph=='land'||X.ph=='out'?8:4;X.cy+=(pl.y-X.cy)*Math.min(1,dt*fast);
  let sx=0,sy=0;if(X.shake>0){X.shake-=dt;sx=(Math.random()-.5)*X.shake*2;sy=(Math.random()-.5)*X.shake*2}
  {const W=innerWidth,H=innerHeight;if(H<480)cam.setViewOffset(W,H,0,H*.045,W,H);else if(cam.view&&cam.view.enabled)cam.clearViewOffset()}
  const ph=X.ph;
  if(ph=='glide'||ph=='touch'||ph=='skip')chase(dt,t,false);
  else if(ph=='wing'||ph=='wipe'){
    X.va.set(0,X.cy+7.5,AZ+17);X.vb.set(0,X.cy+5.2,AZ-9);
    X.cpv.lerp(X.va,1-Math.exp(-dt*2.2));X.clv.lerp(X.vb,1-Math.exp(-dt*3));cam.position.copy(X.cpv);cam.lookAt(X.clv)}
  else if(ph=='win'&&X.pt>1.2){
    const a=Math.sin((X.pt-1.2)*.35)*.9;
    X.va.set(Math.sin(a)*30,X.cy+10,AZ-4+Math.cos(a)*30);X.vb.set(0,X.cy+7.5,AZ-6);
    X.cpv.lerp(X.va,1-Math.exp(-dt*2.5));X.clv.lerp(X.vb,1-Math.exp(-dt*3));cam.position.copy(X.cpv);cam.lookAt(X.clv)}
  else{cam.position.set(sx,X.cy+9+sy,AZ+13.5);cam.lookAt(0,X.cy+4.8,AZ-4);X.cpv.copy(cam.position);X.clv.set(0,X.cy+4.8,AZ-4)}
  if(X.G.visible){X.sun.position.set(cam.position.x+60,cam.position.y+55,cam.position.z-250);X.st.position.copy(cam.position)}}
EXM.post=function(dt,t){
  if(EXM.lie){P.rotation.set(-Math.PI/2,0,0);P.armL.rotation.x=P.armR.rotation.x=0;P.legL.rotation.x=P.legR.rotation.x=0;return}
  if(!EXM.on)return;
  const ph=X.ph,fl=ph=='wing'||ph=='wipe'||ph=='glide'||ph=='touch'||ph=='skip';
  P.rotation.order=fl?'YXZ':'XYZ';P.rotation.set(0,Math.PI,0);
  if(!fl)P.armL.rotation.z=P.armR.rotation.z=0;
  let a=Math.sin(t*2)*.05,l=0,pitch=0;
  if(ph=='hop'){a=-1;l=Math.sin(X.pt*20)*.3}
  else if(ph=='rise'||ph=='catch'){a=-2.7}
  else if(ph=='shake'){a=Math.sin(X.pt*60)*.8;l=Math.sin(X.pt*60)*.3}
  else if(ph=='fall'){a=Math.sin(t*28)*1.5;l=Math.sin(t*22)*.8;P.rotation.x=-X.pt*4}
  else if(ph=='land'||ph=='out'){P.rotation.set(-1.5,0,0);a=0;pl.y=.45}
  else if(ph=='win'||ph=='done'){P.rotation.y=0;a=X.pt>1.2?-2.9:-.2}
  else if(ph=='wing'||ph=='wipe'){P.rotation.set(0,X.pyaw,0);a=-.25;l=Math.sin(t*7)*.25;P.armL.rotation.z=-.5*X.wing;P.armR.rotation.z=.5*X.wing}
  else if(ph=='glide'||ph=='skip'){
    const f=X.f,s=Math.max(0,Math.min(1,(X.gu-.88)/.1)),sm=s*s*(3-2*s);
    X.yaw=Math.atan2(f.x,f.z);pitch=(1.15+Math.sin(t*1.7)*.06)*(1-sm);
    P.rotation.set(pitch,X.yaw,0);a=-.2*(1-sm);l=Math.sin(t*6)*.15*(1-sm);
    P.armL.rotation.z=-1.25*(1-sm);P.armR.rotation.z=1.25*(1-sm)}
  else if(ph=='touch'){P.rotation.set(0,X.yaw,0);a=-.1*X.wing;P.armL.rotation.z=-.5*X.wing;P.armR.rotation.z=.5*X.wing}
  X.pitch=pitch;
  P.armL.rotation.x=a;P.armR.rotation.x=a;P.legL.rotation.x=l;P.legR.rotation.x=-l;P.position.set(pl.x,pl.y,pl.z);wingsUpd(t)}

/* ---------- 6. Hasil: Rumah Sakit atau Piala ---------- */
function stat(){return G.ex||{try:0,win:0,best:0,last:null}}
function wake(){
  leave();
  const b=BLD.find(x=>x.i===4);
  if(b){
    intEnter(b);const bx=RMX+4.6,bz=RMZ+1.2,Bd=(w,h,d,c,x,y,z)=>box(w,h,d,c,bx+x,y,bz+z,IGR);
    Bd(2.7,.45,5.4,0xcfd8e3,0,.45,0);Bd(2.4,.35,5,0xffffff,0,.85,0);Bd(2.5,.22,3.1,0x5fc9a0,0,1.08,1);Bd(1.5,.25,.95,0xfff6e0,0,1.1,-2);
    Bd(2.7,1.6,.22,0x8a6a40,0,1.25,-2.7);Bd(2.7,.9,.22,0x8a6a40,0,.9,2.7);Bd(.1,3.6,.1,0x9aa5b5,2,1.8,-1.8);Bd(.7,.9,.35,0xbfe8ff,2,3.4,-1.8);
    pl.x=bx;pl.z=bz+1.7;pl.y=1.55;pl.yaw=0;EXM.lie=true;const e=$('#ts');if(e)e.style.display='none'}
  hud$.exov.innerHTML='<div>💫<br>Perlahan kamu membuka mata…<small>Kamu terbangun di Rumah Sakit</small></div>';hud$.exov.className='on';
  setTimeout(()=>{hud$.exov.className=''},1900);
  setTimeout(()=>{EXM.lie=false;if(b){pl.x=RMX+2.3;pl.z=RMZ+1.8;pl.y=0}hud$.exov.innerHTML='';cardLose()},3500)}
function cardLose(){
  const q=X.q[X.i],m=$('#modal'),c=$('#card'),dr=PERS[4],st=stat(),ans=AR.test(q.a)?AB(q.a):`<b>${q.a}</b>`;
  const mine=X.sel<0?'waktu habis ⏰':(AR.test(q.o[X.sel])?AB(q.o[X.sel]):`<b>${q.o[X.sel]}</b>`);
  mode='exres';m.style.display='flex';c.scrollTop=0;
  c.innerHTML=`<h2>🏥 Kamu terbangun di Rumah Sakit</h2><div class="fc">🩺 <b>${dr[0]}</b>: “${dr[4]} Kamu terjatuh di soal ke-${q.no}.”</div>
  <div class="q" style="text-align:center;font-size:26px;margin-bottom:4px">${X.ok} dari ${EXN} soal benar</div><div class="bar" aria-hidden="true"><i style="width:${Math.round(X.ok/EXN*100)}%"></i></div>
  <div class="fc">${X.ok>=30?'Sedikit lagi, kamu hampir sampai di puncak!':X.ok>=20?'Sudah lewat setengah jalan. Ulangi materinya, lalu coba lagi!':X.ok>=10?'Bagus! Pelajari materinya lagi, lalu naik lebih tinggi.':'Tidak apa-apa. Belajar dulu, lalu coba lagi.'}</div>
  <div class="ex">📖 <b>Pembahasan soal ${q.no}</b> (${TN[q.t]||q.t})<br>${q.q}<br>Jawabanmu: ${mine}<br>Jawaban benar: ${ans}<br>${q.ex||''}</div>
  <div class="ex">🪙 +${X.ok*3} koin dari jawaban benar · rekor terbaikmu ${st.best}/${EXN}</div>
  <div class="exbt"><button class="opt go" id="exr">🔁 Coba ujian lagi</button><button class="opt" id="exc">📖 Belajar dulu</button></div>`;
  $('#exr').onclick=()=>{m.style.display='none';open=false;mode=null;intro()};
  $('#exc').onclick=()=>{m.style.display='none';open=false;mode=null}}
function finishWin(){
  leave();hud$.exov.className='';
  const m=$('#modal'),c=$('#card'),st=stat(),mm=Math.floor(X.el/60),ss=X.el%60;mode='exres';m.style.display='flex';c.scrollTop=0;
  c.innerHTML=`<h2>🏆 Juara Ujian Akhir!</h2><div class="ar center" lang="ar" style="font-size:34px;line-height:1.5">أَحْسَنْتَ! مَبْرُوكٌ</div>
  <div class="fc">Kamu menjawab semua soal dengan benar, meraih piala besar di atas awan, lalu terbang turun melihat seluruh Kota Profesi.</div>
  <div class="exst"><div><b>${EXN}/${EXN}</b><small>soal benar</small></div><div><b>${mm?mm+':'+String(ss).padStart(2,'0'):ss+' dtk'}</b><small>waktu</small></div><div><b>${st.win}</b><small>piala 🏆</small></div></div>
  <div class="ex">🪙 +${X.bonus} koin bonus piala · +${EXN*3} koin dari jawaban benar</div>
  <div class="exbt"><button class="opt go" id="exr">🔁 Ujian lagi</button><button class="opt" id="exc">✖ Tutup</button></div>`;
  $('#exr').onclick=()=>{m.style.display='none';open=false;mode=null;intro()};
  $('#exc').onclick=()=>{m.style.display='none';open=false;mode=null}}
/* kegagalan: catat sebelum pindah ke rumah sakit */

function intro(){
  if(open||!ready)return;open=true;mode='exin';
  const m=$('#modal'),c=$('#card'),st=stat();m.style.display='flex';c.scrollTop=0;
  c.innerHTML=`<h2>🎓 Ujian Akhir</h2><div class="fc">${EXN} soal · ${EXS} detik per soal · semua materi Kota Profesi</div>
  <div class="exst"><div><b>${st.best||0}/${EXN}</b><small>rekor</small></div><div><b>${st.try||0}</b><small>percobaan</small></div><div><b>${st.win||0}</b><small>piala 🏆</small></div></div>
  <div class="exrw"><b>✅</b><span><b>Benar</b>: pilarmu naik, kamu makin tinggi sampai ke langit.</span></div>
  <div class="exrw"><b>❌</b><span><b>Salah atau waktu habis</b>: pilar runtuh dan kamu terbangun di Rumah Sakit.</span></div>
  <div class="exrw"><b>🏆</b><span><b>${EXN} benar semua</b>: raih piala besar di atas awan, lalu terbang dengan sayap melihat seluruh kota!</span></div>
  <div class="exzs">${ZN.map((z,k)=>`<div style="--zc:${z[3]}"><i></i><span><b>${z[0]}</b> · ${z[1]}<small>soal ${k*10+1}–${k*10+10} · ${z[2]}</small></span></div>`).join('')}</div>
  <div class="exk">⌨️ Tekan <b>1–4</b> atau <b>A–D</b> · 👆 atau ketuk pilar jawabannya</div>
  <div class="exbt"><button class="opt go" id="exgo">▶ Mulai ujian</button><button class="opt" id="exno2">✖ Nanti saja</button></div>`;
  $('#exgo').onclick=begin;$('#exno2').onclick=()=>{m.style.display='none';open=false;mode=null}}

/* ---------- 7. Tombol & input ---------- */
$('#exb').onclick=()=>{if(RID){ts('🚲 Turun dulu dari kendaraan (F), lalu mulai ujian.',2200);return}if(!open&&ready&&!CV)intro()};
hud$.exq.onclick=()=>{if(mode=='exam')quit()};
hud$.exsp.onclick=()=>{const q=X.q[X.i];if(mode=='exam'&&q&&q.sp)say(q.sp)};
document.querySelectorAll('#exo button').forEach(b=>b.onclick=()=>answer(+b.dataset.i));
hud$.exfly.onclick=fly;hud$.gls.onclick=skipGlide;
addEventListener('keydown',e=>{
  if(mode!='exam')return;const k=e.key;
  if(X.ph=='win'&&X.fly&&(k=='Enter'||k==' ')){e.preventDefault();fly()}
  else if(X.ph=='glide'&&(k=='Enter'||k==' '||k=='Escape')){e.preventDefault();skipGlide()}});
addEventListener('keydown',e=>{
  if(mode!='exam'||X.ph!='ask'||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();let s='1234'.indexOf(k);if(s<0)s='abcd'.indexOf(k);
  if(k.length==1&&s>=0)answer(s)});
const rc=new THREE.Raycaster(),mv=new THREE.Vector2();
$('#c').addEventListener('pointerdown',e=>{
  if(mode!='exam'||X.ph!='ask')return;const r=e.target.getBoundingClientRect();
  mv.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(mv,cam);
  const h=rc.intersectObjects(X.P,false)[0];if(h)answer(X.P.indexOf(h.object))});
EXM.intro=intro;
})();
